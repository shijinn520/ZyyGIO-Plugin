import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import fs from 'fs'
import crypto from 'crypto'
import Yaml from 'yaml'
import { cdk } from './rule.js'
import { getmode, getserver, getuid, getScenes } from './index.js'
let _path = process.cwd() + '/plugins/Zyy-GM-plugin/config'

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
        console.log(`1`)
        const { mode } = await getmode(e) || {}
        console.log(mode)
        if (!mode || mode !== 'cdk') return
        console.log(`2`)
        const { uid } = await getuid(e) || {}
        if (!uid) return
        const { scenes } = await getScenes(e) || {}
        const msg = e.msg.replace(/兑换/g, '')
        const cfg = Yaml.parse(fs.readFileSync(_path + '/cdk.yaml', 'utf8'))
        if (!(msg in cfg[scenes])) {
            console.log("停止后续代码，msg 不存在于字典中")
            return
        }

        /* 
        兑换码: 可兑换次数-已使用-生成日期-过期日期-兑换类型-对应命令
        test1234: 50-20-2023.05.23-2999.01.01-command-item add 201,item add 202

        兑换码: 可兑换次数-生成日期-过期日期-兑换类型-对应命令
        test1234: 0-2023.05.23-2999.01.01-command-item add 201,item add 202
        */

        const data = cfg[scenes][msg].split('-')
        /* 
        判断是否过期
        if (data[2] !== '0') {
                if (new Date(data[2].replace(/\./g, '-')).toISOString().split('T')[0] < new Date().toISOString().split('T')[0]) {
                    e.reply("兑换码已过期")
                    return
                }
            } 
        */

        // 根据兑换类型来处理命令
        const urls = []
        const { ip, port, region, sign, ticketping, sender } = await getserver(e)
        if (data[2] === 'command') {
            const newmsg = data[3].includes(',') ? data[3].split(',') : [data[3]]
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
        if (data[2] === 'mail') {
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
                item_list: data[3],
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
        console.log(`6`)
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
                                if (data[0] === '1') {
                                    delete cfg[scenes][msg]
                                    fs.writeFileSync(_path + '/cdk.yaml', Yaml.stringify(cfg), 'utf8')
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

    async 生成自定义兑换码(e) {
        const msg = e.msg.split('-')
        if (msg.length !== '4') {
            e.reply([segment.at(e.user_id), `\n格式错误\n格式：\n生成邮件自定义cdk-兑换码-可兑换次数-物品id:数量,id:数量\n举例：\n生成邮件自定义cdk-新手礼包-0-201:1,202:1\n\n格式：生成命令自定义cdk-兑换码-可兑换次数-指令1,指令2\n举例：\nn生成命令自定义cdk-测试-0-item add 201,item add 202\n\n温馨提示：可兑换次数只能是0或者1。\n0代表无限次使用\n1代表使用之后销毁该cdk`])
            return
        }
        if (msg[2] !== '0' || msg[2] !== '1') {
            e.reply([segment.at(e.user_id), `\n可兑换次数错误，只能为0或者1`])
            return
        }
    //     if ()
    // }
}
}

/* 
生成邮件自定义cdk-兑换码-可兑换次数-对应命令
生成命令自定义cdk-兑换码-可兑换次数-对应命令

生成邮件随机cdk-生成数量-对应命令
生成命令随机cdk-生成数量-对应命令
*/

