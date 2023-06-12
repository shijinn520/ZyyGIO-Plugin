import fs from 'fs'
import Yaml from 'yaml'
import crypto from 'crypto'
import moment from 'moment'
import { cdk } from './rule.js'
import common from '../../../lib/common/common.js'
import plugin from '../../../lib/plugins/plugin.js'
import { getmode, getserver, getuid, getpath, getcommand, getmail, getScenes } from './index.js'

const { config, data } = await getpath()
let cdk0 = []
let method
let state = false

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
            e.group.recallMsg(e.message_id)
            e.reply([segment.at(e.user_id), `无效的兑换码!`])
            return
        }

        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        if (cfg.redeemlimit <= cfg.used) {
            e.reply([segment.at(e.user_id), "兑换码可兑换次数不足!"])
            return
        }

        if (uid in cfg.uid) {
            if (cfg.uid[uid] >= cfg.uidusagelimit) {
                e.group.recallMsg(e.message_id)
                e.reply([segment.at(e.user_id), `同一个兑换码单个uid使用次数达到上限!`])
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
        if (state && cdk0.length > 0) {
            e.reply("上个cdk生成还未结束，管理员可使用重置cdk来重置进程")
            return
        }

        cdk0.push("开始生成")
        state = true
        e.reply('请输入需要生成cdk的方式\n只能输入1或者2\n1.自定义生成单个兑换码\n2.随机生成若干个兑换码')
        this.setContext('cdk1')
    }

    async cdk1() {
        this.finish('cdk1')
        if (this.e.message[0].text === '1') {
            cdk0.push("自定义")
        }
        else if (this.e.message[0].text === '2') {
            cdk0.push("随机")
        }
        else {
            this.reply("输入错误")
            cdk0 = []
            state = false
            return
        }
        this.reply("请选择cdk发放方式：\n只能输入1或者2\n1.邮件发放(无需玩家在线)\n2.在线GM发放(需玩家在线)")
        this.setContext('cdk2')
    }

    cdk2() {
        this.finish('cdk2')
        if (this.e.message[0].text === '1') {
            cdk0.push('mail')
        }
        else if (this.e.message[0].text === '2') {
            cdk0.push('command')
        }
        else {
            this.reply("输入错误")
            cdk0 = []
            state = false
            return
        }

        if (cdk0[1] === "自定义") {
            this.reply("请输入你的自定义兑换码，请不要出现空格，否则兑换码会生成失败")
            this.setContext('cdk3')
        } else {
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
        if (cdk0[1] === "自定义") {
            if (isNaN(this.e.message[0].text) || this.e.message[0].text === '0') {
                this.reply("输入错误")
                this.finish('cdk4')
                cdk0 = []
                state = false
                return
            }
            this.reply("请输入单个uid可以使用此兑换码的次数，请输入数字")
            cdk0.push(this.e.message[0].text)
            this.setContext('cdk5')
        } else {
            if (isNaN(this.e.message[0].text)) {
                this.reply("格式错误，非数字")
                cdk0 = []
                state = false
                return
            }
            this.reply("请输入TXT文件名称前缀，用于识别txt")
            cdk0.push(this.e.message[0].text)
            this.setContext('cdk5')
        }
    }

    cdk5() {
        this.finish('cdk5')
        const msg = this.e.message[0].text

        if (cdk0[1] === "自定义") {
            if (isNaN(msg)) {
                this.reply("格式错误，非数字")
                cdk0 = []
                state = false
                return
            }

            if (msg === "0") {
                this.reply("格式错误，不能为0")
                cdk0 = []
                state = false
                return
            }
            cdk0.push(msg)
        } else {
            if (msg > 1000) {
                this.reply("单次生成仅限1000个")
                cdk0 = []
                state = false
                return
            }
            cdk0.push(msg)
        }

        if (cdk0[2] === 'mail') {
            this.reply("你选择的是邮件发放\n请根据以下格式填写需要发放的对应物品\n\n格式：物品ID:数量,物品ID:数量\n多个物品使用逗号分隔\n举例：201:1,201:1")
        } else {
            this.reply("你选择的是在线GM发放\n请根据以下格式填写需要发放的对应物品\n\n格式：指令1,指令2\n多个指令使用逗号分隔\n举例：item add 201,item add 202")
        }

        this.setContext('cdk6')
    }

    async cdk6(e) {
        if (method !== 'fastcdk') {
            this.finish('cdk6')
            cdk0.push(this.e.message[0].text)
        }

        const { keycdk, groupcdk } = await getserver(e)

        if (cdk0[1] === "自定义") {
            const file = `${data}/group/${groupcdk}/cdk/${cdk0[3]}.yaml`
            if (fs.existsSync(file)) {
                e.reply([segment.at(e.user_id), `兑换码${cdk0[3]}已经存在`])
                cdk0 = []
                state = false
                return
            }

            const time = moment().format('YYYY-MM-DD HH:mm:ss')
            const cdk = {
                redeemlimit: Number(cdk0[4]),
                uidusagelimit: Number(cdk0[5]),
                createtime: time,
                actiontype: cdk0[2],
                command: cdk0[6].replace("，", ",").replace("：", ":"),
                used: 0,
                uid: {
                    "0": 0
                }
            }
            fs.writeFileSync(file, Yaml.stringify(cdk))
            e.reply([segment.at(e.user_id), `\n生成完毕\n兑换码为：${cdk0[3]}\n可使用次数：${Number(cdk0[4])}\n每个玩家可兑换次数：${Number(cdk0[5])}\n发放方式：${cdk0[2].replace("mail", "邮件").replace("command", "在线命令")}`])
            cdk0 = []
            state = false
            return
        } else {
            e.reply([segment.at(e.user_id), `正在生成中...`])
            const time = moment().format('YYYY-MM-DD HH:mm:ss')
            const cdkContent = {
                redeemlimit: 1,
                uidusagelimit: 1,
                createtime: time,
                actiontype: cdk0[2],
                command: cdk0[5].replace("，", ",").replace("：", ":"),
                used: 0,
                uid: {
                    "10001": 0
                }
            }
            const succwrite = []
            const failwrite = []

            for (let i = 0; i < cdk0[3]; i++) {
                const currentTimestamp = Date.now() + i // 使用递增的时间戳以防止重复                
                const cdk = {
                    ...cdkContent,
                    createtime: moment(currentTimestamp).format('YYYY-MM-DD HH:mm:ss')
                }
                const filename = crypto.createHash('md5')
                    .update(currentTimestamp + keycdk + cdk0[5]).digest('hex')

                const yamlfile = `${data}/group/${groupcdk}/cdk/${filename}.yaml`
                if (fs.existsSync(yamlfile)) {
                    console.error(`文件 ${yamlfile} 已存在`)
                    failwrite.push(filename)
                    return

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
            if (cdk0[3] < 51) {
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
                const txtfile = `${data}/group/${groupcdk}/txt/${cdk0[4]}${moment().format('YYYYMMDD-HHmmss')}.txt`
                fs.writeFileSync(txtfile, succwrite.join('\n'))
                if (e.isGroup) {
                    Bot.pickGroup(e.group_id).fs.upload(txtfile)
                } else {
                    Bot.pickFriend(e.user_id).sendFile(txtfile)
                }
            } catch (err) {
                console.error(err)
            }
            cdk0 = []
            state = false
            return
        }
    }

    async 快捷生成列表(e) {
        const { generatecdk } = await getmode(e)
        if (!generatecdk) return
        const file = `${config}/cdk.yaml`
        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        e.reply(`${Object.keys(cfg).join('\n')}`)
    }

    async 快捷生成cdk(e) {
        const { generatecdk } = await getmode(e)
        if (!generatecdk) return
        if (state && cdk0.length > 0) {
            e.reply("上个cdk生成还未结束，管理员可使用重置cdk来重置进程")
            return
        }
        const msg = e.msg.replace("快捷生成", "")
        const file = `${config}/cdk.yaml`
        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        if (!(cfg[msg])) {
            e.reply([segment.at(e.user_id), `\n${msg} 不存在\n发送“快捷生成列表”查看已有的`])
            return
        }
        state = true
        method = 'fastcdk'
        type = '2'
        const content = cfg[msg].split('-')
        cdk0 = [
            "开始生成",
            "随机",
            content[0],
            content[1],
            msg,
            content[2].replace("，", ",").replace("：", ":")
        ]
        this.cdk6(e)
    }

    async 快捷生成自定义cdk(e) {
        const { generatecdk } = await getmode(e)
        if (!generatecdk) return
        if (state && cdk0.length > 0) {
            e.reply("上个cdk生成还未结束，管理员可使用重置cdk来重置进程")
            return
        }
        const msg = e.msg.split('-')
        if (msg.length !== 6) {
            const base64 = Buffer.from(fs.readFileSync(process.cwd() + '/plugins/Zyy-GM-plugin/resources/players/cdk-随机.png')).toString('base64')
            await e.reply([segment.image(`base64://${base64}`)])
            e.reply("正确格式：\n自定义cdk-兑换类型-兑换码-总使用次数-单uid使用次数-对应命令")
            return
        }
        if (msg[1] !== '邮件' && msg[1] !== '命令') {
            e.reply("只能输入邮件或者命令")
            return
        }
        state = true
        method = 'fastcdk'
        cdk0 = [
            "开始生成",
            "自定义",
            msg[1].replace("邮件", "mail").replace("命令", "command"),
            msg[2],
            msg[3],
            msg[4],
            msg[5].replace("，", ",").replace("：", ":")
        ]
        this.cdk6(e)
    }

    async 快捷生成随机cdk(e) {
        const { generatecdk } = await getmode(e)
        if (!generatecdk) return
        if (state && cdk0.length > 0) {
            e.reply("上个cdk生成还未结束，管理员可使用重置cdk来重置进程")
            return
        }
        const msg = e.msg.split('-')
        if (msg.length !== 5) {
            const base64 = Buffer.from(fs.readFileSync(process.cwd() + '/plugins/Zyy-GM-plugin/resources/players/cdk-随机.png')).toString('base64')
            await e.reply([segment.image(`base64://${base64}`)])
            e.reply("正确格式：\n自定义cdk-兑换类型-兑换码-总使用次数-单uid使用次数-对应命令")
            return
        }
        if (msg[1] !== '邮件' && msg[1] !== '命令') {
            e.reply("只能输入邮件或者命令")
            return
        }
        state = true
        method = 'fastcdk'
        cdk0 = [
            "开始生成",
            "随机",
            msg[1].replace("邮件", "mail").replace("命令", "command"),
            msg[2],
            msg[3],
            msg[4].replace("，", ",").replace("：", ":")
        ]
        this.cdk6(e)
    }

    async 生成cdk帮助(e) {
        e.reply(`目前有4种生成方式：\n1.快捷生成\n2.自定义cdk\n3.随机cdk\n4.生成cdk(上下文)\n\n第一种需要配置好cdk.yaml，随后快捷生成+名称\n第二种发送“自定义cdk”即可查看使用指南\n第三张发送“随机cdk”即可查看使用指南\n第四种直接发送“生成cdk”，跟着提示走即可`)
    }

    async 重置cdk() {
        this.finish('cdk1')
        this.finish('cdk2')
        this.finish('cdk3')
        this.finish('cdk4')
        this.finish('cdk5')
        this.finish('cdk6')
        cdk0 = []
        state = false
        await this.reply("重置成功")
        return
    }
}
