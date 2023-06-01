import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import fs from 'fs'
import crypto from 'crypto'
import Yaml from 'yaml'
import { cdk } from './rule.js'
import moment from 'moment'
import md5 from 'md5'
import common from '../../../lib/common/common.js'
import { getmode, getserver, getuid, getScenes } from './index.js'
let _path = process.cwd() + '/plugins/Zyy-GM-plugin/config'
let cdk0 = []
let type
let state
let actiontype

export class gm extends plugin {
    constructor() {
        super({
            name: 'CDK',
            dsc: '兑换码',
            event: 'message',
            priority: -50,
            rule: cdk
        })
    }

    async 兑换码(e) {
        const { mode } = await getmode(e) || {}
        console.log(mode)
        if (!mode || mode !== 'cdk') return
        const { uid } = await getuid(e) || {}
        if (!uid) return
        const { scenes } = await getScenes(e) || {}
        const msg = e.msg.replace(/兑换/g, '').trim()

        const file = `${_path}/${scenes}/${msg}.yaml`

        if (!fs.existsSync(file)) {
            e.reply(`无效的兑换码!`)
            return
        }
        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))

        /* 

        # cdk: 单个兑换码可兑换次数-每个玩家可兑换次数-command-生成日期-命令
        cdk: 0-1-command-2023.5.25 0:00:01-item add 201
        */

        // const data = cfg.cdk.split('-')
        if (cfg.redeemlimit !== '0') {
            if (cfg.redeemlimit > cfg.used) {
                e.replt("兑换码可兑换次数不足!")
                return
            }
        }
        let uidstate = false
        if (uid in cfg.uid) {
            if (cfg.uid[uid] >= cfg.uidusagelimit) {
                e.reply(`同一个兑换码单个uid使用次数达到上限!`)
                return
            }
            uidstate = true
        }

        // 根据兑换类型来处理命令
        const urls = []
        const { ip, port, region, sign, ticketping, sender } = await getserver(e)
        if (cfg.actiontype === 'command') {
            const newmsg = cfg.command.includes(',') ? cfg.command.split(',') : [cfg.command]
            newmsg.forEach(newmsg => {
                const signingkey = { cmd: '1116', uid: uid, region: region, msg: newmsg, ticket: ticketping }
                const base = Object.keys(signingkey).sort().map(key => `${key}=${signingkey[key]}`).join('&')
                const newsign = `&sign=` + crypto.createHash('sha256').update(base + sign).digest('hex')
                console.log(base)
                console.log(newsign)
                const url = `http://${ip}:${port}/api?${encodeURI(base)}${newsign}`
                urls.push(url)
                console.log(`url:${url}`)
            })
        }
        if (cfg.actiontype === 'mail') {
            const signingkey = {
                cmd: '1005',
                uid: uid,
                region: region,
                config_id: '0',
                content: '亲爱的旅行者：请查收您通过兑换码获得的奖励',
                expire_time: (Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)).toString(),
                importance: '0',
                is_collectible: "false",
                item_limit_type: '1',
                item_list: cfg.command,
                source_type: '0',
                tag: '0',
                sender: sender,
                title: '【奖励】兑换码兑换奖励',
                ticket: ticketping,
            }
            const base = Object.keys(signingkey).sort().map(key => `${key}=${signingkey[key]}`).join('&')
            const newsign = `&sign=` + crypto.createHash('sha256').update(base + sign).digest('hex')
            const url = `http://${ip}:${port}/api?${encodeURI(base)}${newsign}`
            urls.push(url)
        }
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 1000
        }

        const fetchResults = [].concat(urls).map(url => {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('超过1秒未响应，中断请求'))
                }, 1000)
            })

            const fetchPromise = fetch(url, options)

            return Promise.race([fetchPromise, timeoutPromise])
        })

        Promise.all(fetchResults)
            .then(responses => {
                responses.forEach(response => {
                    // 获取响应的状态码
                    const status = response.status
                    console.log('状态码:', status)
                    if (response.ok) {
                        response.json()
                            .then(outcome => {
                                console.log('响应内容:', outcome)
                                if (uidstate === false) {
                                    // yaml中uid不存在，创建并写入，cdk总次数+1
                                    cfg.uid[uid] = Number(1)
                                    cfg.used += 1
                                    fs.writeFileSync(file, Yaml.stringify(cfg), 'utf8')
                                }
                                if (uidstate === true) {
                                    // 存在uid，总次数+1，uid兑换次数+1
                                    // 更新 cfg 对象的值
                                    cfg.used += 1
                                    cfg.uid[uid] = Number(cfg.uid[uid]) + 1
                                    fs.writeFileSync(file, Yaml.stringify(cfg), 'utf8')
                                }
                            })
                    } else {
                        console.error('请求失败')
                    }
                })
            })
            .catch(error => {
                console.error(error)
                this.reply([segment.at(e.user_id), '走开，你都不在线 ￣へ￣'])
            })
    }


    async 生成兑换码() {
        this.setContext('cdk1')
        await this.reply('请输入需要生成cdk的方式\n只能输入1或者2\n1.自定义生成单个兑换码\n2.随机生成若干个兑换码')
    }
    cdk1() {
        if (this.e.message[0].text === '1') {
            type = '1'
        }
        else if (this.e.message[0].text === '2') {
            type = '2'
        }
        else {
            this.reply("输入错误")
            this.finish('cdk1')
            return
        }
        this.reply("请选择cdk发放方式：\n只能输入1或者2\n1.邮件发放(无需玩家在线)\n2.在线GM发放(需玩家在线)")
        this.finish('cdk1')
        this.setContext('cdk2')
    }
    cdk2() {
        if (this.e.message[0].text === '1') {
            actiontype = 'mail'
            cdk0.push('mail')
        }
        else if (this.e.message[0].text === '2') {
            actiontype = 'command'
            cdk0.push('command')
        }
        else {
            this.reply("输入错误")
            this.finish('cdk2')
            return
        }
        if (type === '1') {
            this.reply("请输入你的自定义兑换码，请不要出现空格，否则兑换码会生成失败")
            this.finish('cdk2')
            this.setContext('cdk3')
        }
        if (type === '2') {
            this.reply("请输入需要生成的兑换码数量，请输入纯数字，不大于10000")
            this.finish('cdk2')
            this.setContext('cdk5')
        }
    }
    cdk3() {
        cdk0.push(this.e.message[0].text)
        this.reply("请输入兑换码总共可使用次数，0位无限次，请输入数字")
        this.finish('cdk3')
        this.setContext('cdk4')
    }
    cdk4() {
        if (isNaN(this.e.message[0].text)) {
            this.reply("输入错误")
            this.finish('cdk4')
            return
        }
        this.reply("请输入单个uid可以使用此兑换码的次数，请输入数字")
        cdk0.push(this.e.message[0].text)
        this.finish('cdk4')
        this.setContext('cdk5')
    }
    cdk5() {
        if (this.e.message[0].text === "0") {
            this.reply("禁止为0")
            this.finish('cdk5')
            return
        }
        if (isNaN(this.e.message[0].text)) {
            this.reply("格式错误，非数字")
            this.finish('cdk5')
            return
        }
        if (actiontype === 'mail') {
            this.reply("你选择的是邮件发放\n请根据以下格式填写需要发放的对应物品\n\n格式：物品ID:数量,物品ID:数量\n多个物品使用逗号分隔\n举例：201:1,201:1")
        }
        if (actiontype === 'command') {
            this.reply("你选择的是在线GM发放\n请根据以下格式填写需要发放的对应物品\n\n格式：指令1,指令2,指令3\n多个指令使用逗号分隔\n举例：revive,player level 45")
        }
        if (type === '1') {
            cdk0.push(this.e.message[0].text)
        }
        if (type === '2') {
            cdk0.push(this.e.message[0].text)
            if (this.e.message[0].text > 1000) {
                this.reply([segment.at(e.user_id), "单次生成仅限1000个"])
                this.finish('cdk5')
                return
            }
        }
        this.finish('cdk5')
        this.setContext('cdk6')
    }
    async cdk6(e) {
        cdk0.push(this.e.message[0].text)
        const { scenes } = await getScenes(e) || {}
        if (type === '1') {
            if (fs.existsSync(`${_path}/${scenes}/${cdk0[1]}.yaml`)) {
                e.reply([segment.at(e.user_id), `兑换码${cdk0[1]}已经存在`])
                return
            }

            const time = moment().format('YYYY-MM-DD HH:mm:ss')
            const cdk = {
                redeemlimit: cdk0[2],
                uidusagelimit: cdk0[3],
                createtime: time,
                actiontype: cdk0[0],
                command: cdk0[4],
                used: 0,
                uid: {
                    "10001": 0
                }
            }
            fs.writeFileSync(_path + `/${scenes}/${cdk0[1]}.yaml`, Yaml.stringify(cdk))
        }
        if (type === '2') {
            e.reply([segment.at(e.user_id), `正在生成中...`])
            const config = Yaml.parse(fs.readFileSync(_path + '/config.yaml', 'utf8'))
            const title = config[scenes]?.server.cdk
            const time = moment().format('YYYY-MM-DD HH:mm:ss')

            const cdkContent = {
                redeemlimit: 1,
                uidusagelimit: 1,
                createtime: time,
                actiontype: cdk0[0],
                command: cdk0[2],
                used: 0,
                uid: {
                    "10001": 0
                }
            }
            const file = []
            for (let i = 0; i < cdk0[1]; i++) {
                const currentTimestamp = Date.now() + i // 使用递增的时间戳以防止重复
                const cdk = {
                    ...cdkContent,
                    createtime: moment(currentTimestamp).format('YYYY-MM-DD HH:mm:ss')
                }

                const fileName = md5(currentTimestamp + title + cdk[2])
                file.push(fileName)
                fs.writeFileSync(`${_path}/${scenes}/${fileName}.yaml`, '')
                const writable = fs.createWriteStream(`${_path}/${scenes}/${fileName}.yaml`, { flags: 'a' })
                writable.write(Yaml.stringify(cdk))
                writable.end()
            }
            if (cdk0[1] < 51) {
                const forward = []
                for (let i = 0; i < file.length; i += 25) {
                    const group = file.slice(i, i + 25)
                    const newElement = group.join('\n')
                    forward.push(newElement)
                }
                const msg = await common.makeForwardMsg(this.e, forward)
                await this.e.reply(msg)
            }
            try {
                const txtfile = `${_path}/${scenes}/${moment().format('YYYYMMDD-HHmmss')}.txt`
                fs.writeFileSync(txtfile, file.join('\n'))
                if (typeof e.friend.sendFile === 'function') {
                    e.friend.sendFile(txtfile)
                        .catch((err) => {
                            this.reply(err)
                            console.error(err)
                        })
                } else {
                    console.error('无法使用上传txt功能，已跳过')
                    
                }
            } catch (err) {
                console.error(err)
            }
        }
        cdk0 = []
        this.finish('cdk6')
        return
    }
}
