import fs from 'fs'
import Yaml from 'yaml'
import crypto from 'crypto'
import moment from 'moment'
import { cdk } from './rule.js'
import common from '../../../lib/common/common.js'
import plugin from '../../../lib/plugins/plugin.js'
import { getmode, getserver, getuid, getpath, getcommand, getmail, getScenes } from './index.js'

const { data } = await getpath()
let cdk0 = []
let type
let actiontype

export class gm extends plugin {
    constructor() {
        super({
            name: 'CDK',
            dsc: '兑换码',
            event: 'message',
            priority: -100,
            rule: cdk
        })
    }

    async 兑换码(e) {
        const { cdk } = await getmode(e)
        if (!cdk) return
        const { uid } = await getuid(e)
        if (!uid) return
        const { scenes } = await getScenes(e) || {}
        const msg = e.msg.replace(/兑换/g, '').trim()
        const file = `${data}/group/${scenes}/cdk/${msg}.yaml`

        if (!fs.existsSync(file)) {
            e.reply(`无效的兑换码!`)
            return
        }

        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        if (cfg.redeemlimit <= cfg.used) {
            e.reply("兑换码可兑换次数不足!")
            return
        }

        if (uid in cfg.uid) {
            if (cfg.uid[uid] >= cfg.uidusagelimit) {
                e.reply(`同一个兑换码单个uid使用次数达到上限!`)
                return
            }
        }

        if (cfg.actiontype === 'command') {
            const mode = "cdk"
            const msg = cfg.command.includes(',') ? cfg.command.split(',') : [cfg.command]
            getcommand(e, mode, msg)
        }

        if (cfg.actiontype === 'mail') {
            const mode = "cdk"
            const item = cfg.command
            getmail(e, mode, item)
        }
    }


    async 生成兑换码(e) {
        const { generatecdk } = await getmode(e)
        if (!generatecdk) return
        this.setContext('cdk1')
        await this.reply('请输入需要生成cdk的方式\n只能输入1或者2\n1.自定义生成单个兑换码\n2.随机生成若干个兑换码')
    }
    cdk1() {
        this.finish('cdk1')
        if (this.e.message[0].text === '1') {
            type = '1'
        }
        else if (this.e.message[0].text === '2') {
            type = '2'
        }
        else {
            this.reply("输入错误")
            return
        }
        this.reply("请选择cdk发放方式：\n只能输入1或者2\n1.邮件发放(无需玩家在线)\n2.在线GM发放(需玩家在线)")
        this.setContext('cdk2')
    }
    cdk2() {
        this.finish('cdk2')
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
            return
        }
        if (type === '1') {
            this.reply("请输入你的自定义兑换码，请不要出现空格，否则兑换码会生成失败")
            this.setContext('cdk3')
        }
        if (type === '2') {
            this.reply("请输入需要生成的兑换码数量，请输入纯数字，不大于1000")
            this.setContext('cdk4')
        }
    }
    cdk3() {
        this.finish('cdk3')
        cdk0.push(this.e.message[0].text)
        this.reply("请输入兑换码总共可使用次数，禁止为0，请输入数字")
        this.setContext('cdk4')
    }
    cdk4() {
        this.finish('cdk4')
        if (type === '1') {
            if (isNaN(this.e.message[0].text) || this.e.message[0].text === '0') {
                this.reply("输入错误")
                return
            }
            this.reply("请输入单个uid可以使用此兑换码的次数，请输入数字")
            cdk0.push(this.e.message[0].text)
            this.setContext('cdk5')
        }
        if (type === '2') {
            if (isNaN(this.e.message[0].text)) {
                this.reply("格式错误，非数字")
                return
            }
            this.reply("请输入TXT文件名称前缀，用于识别txt")
            cdk0.push(this.e.message[0].text)
            this.setContext('cdk5')
        }
    }
    cdk5() {
        this.finish('cdk5')
        if (this.e.message[0].text === "0") {
            this.reply("禁止为0")
            return
        }
        if (type === '1') {
            if (isNaN(this.e.message[0].text)) {
                this.reply("格式错误，非数字")
                return
            }
        }

        if (type === '1') {
            cdk0.push(this.e.message[0].text)
        }
        if (type === '2') {
            cdk0.push(this.e.message[0].text)
            if (this.e.message[0].text > 1000) {
                this.reply([segment.at(e.user_id), "单次生成仅限1000个"])
                return
            }
        }

        if (actiontype === 'mail') {
            this.reply("你选择的是邮件发放\n请根据以下格式填写需要发放的对应物品\n\n格式：物品ID:数量,物品ID:数量\n多个物品使用逗号分隔\n举例：201:1,201:1")
        }
        if (actiontype === 'command') {
            this.reply("你选择的是在线GM发放\n请根据以下格式填写需要发放的对应物品\n\n格式：指令1,指令2,指令3\n多个指令使用逗号分隔\n举例：revive,player level 45")
        }
        this.setContext('cdk6')
    }
    async cdk6(e) {
        this.finish('cdk6')
        cdk0.push(this.e.message[0].text)
        const { keycdk, groupcdk } = await getserver(e)

        if (type === '1') {
            if (actiontype === 'mail') {
                cdk0[4].replace("，", ",").replace("：", ":") // 转换字符
                const comma = cdk0[4].split(',').length
                const colon = cdk0[4].split(':').length
                if (comma * 2 !== colon) {
                    this.reply(`格式错误\n逗号数量：${comma}\n冒号数量：${colon}\n逗号*2必须等于冒号数量`)
                    return
                }
            }
            const file = `${data}/group/${groupcdk}/cdk/${cdk0[1]}.yaml`
            if (fs.existsSync(file)) {
                e.reply([segment.at(e.user_id), `兑换码${cdk0[1]}已经存在`])
                return
            }

            const time = moment().format('YYYY-MM-DD HH:mm:ss')
            const cdk = {
                redeemlimit: Number(cdk0[2]),
                uidusagelimit: Number(cdk0[3]),
                createtime: time,
                actiontype: cdk0[0],
                command: cdk0[4].replace(/[^a-zA-Z0-9\s]/g, ''),
                used: 0,
                uid: {
                    "10001": 0
                }
            }
            fs.writeFileSync(file, Yaml.stringify(cdk))
            e.reply([segment.at(e.user_id), `\n生成完毕\n兑换码为：${cdk0[4]}\n可使用次数：${Number(cdk0[2])}\n每个玩家可兑换次数：${Number(cdk0[3])}\n发放方式：${cdk0[0]}`])
        }
        if (type === '2') {
            if (actiontype === 'mail') {
                cdk0[3].replace("，", ",").replace("：", ":")
                const comma = cdk0[3].split(',').length
                const colon = cdk0[3].split(':').length
                if (comma * 2 !== colon) {
                    this.reply(`格式错误\n逗号数量：${comma}\n冒号数量：${colon}\n冒号数量必须=逗号*2`)
                    return
                }
            }
            e.reply([segment.at(e.user_id), `正在生成中...`])
            const time = moment().format('YYYY-MM-DD HH:mm:ss')
            const cdkContent = {
                redeemlimit: 1,
                uidusagelimit: 1,
                createtime: time,
                actiontype: cdk0[0],
                command: cdk0[3].replace(/[^a-zA-Z0-9\s]/g, ''),
                used: 0,
                uid: {
                    "10001": 0
                }
            }
            const succwrite = []
            const failwrite = []

            for (let i = 0; i < cdk0[1]; i++) {
                const currentTimestamp = Date.now() + i // 使用递增的时间戳以防止重复                
                const cdk = {
                    ...cdkContent,
                    createtime: moment(currentTimestamp).format('YYYY-MM-DD HH:mm:ss')
                }
                const filename = crypto.createHash('md5')
                    .update(currentTimestamp + keycdk + cdk0[3]).digest('hex')

                const yamlfile = `${data}/group/${groupcdk}/cdk/${filename}.yaml`
                if (fs.existsSync(yamlfile)) {
                    console.error(`文件 ${yamlfile} 已存在`)
                    failwrite.push(filename)

                }
                else {
                    succwrite.push(filename)
                }
                fs.writeFileSync(yamlfile, '')
                const writable = fs.createWriteStream(yamlfile, { flags: 'a' })
                writable.write(Yaml.stringify(cdk))
                // writable.on('finish', () => {
                //     console.log(`文件 ${yamlfile} 已成功编写`)                    
                // })
                writable.end()
            }
            e.reply(`生成完毕\n成功：${succwrite.length}\n失败：${failwrite.length}`)
            if (cdk0[1] < 51) {
                const forward = []
                for (let i = 0; i < succwrite.length; i += 25) {
                    const group = succwrite.slice(i, i + 25)
                    const newforward = group.join('\n')
                    forward.push(newforward)
                }
                const msg = await common.makeForwardMsg(this.e, forward)
                await this.e.reply(msg)
            }
            try {
                const txtfile = `${data}/group/${groupcdk}/txt/${cdk0[2]}${moment().format('YYYYMMDD-HHmmss')}.txt`
                fs.writeFileSync(txtfile, succwrite.join('\n'))
                if (e.isGroup) {
                    Bot.pickGroup(e.group_id).fs.upload(txtfile)
                } else {
                    Bot.pickFriend(e.user_id).sendFile(txtfile)
                }
            } catch (err) {
                console.error(err)
            }
        }
        cdk0 = []
        return
    }
}

