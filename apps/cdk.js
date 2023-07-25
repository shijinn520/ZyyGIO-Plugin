import fs from 'fs'
import Yaml from 'yaml'
import crypto from 'crypto'
import moment from 'moment'
import { cdk } from './regex.js'
import { GetUser, GetState } from './app.js'
import common from '../../../lib/common/common.js'

const { config, data, resources } = global.ZhiYu
let cdks = []

export class ZhiYu extends plugin {
    constructor() {
        super({
            name: 'zhiyu-plugin',
            dsc: '兑换码',
            event: 'message',
            priority: -100,
            rule: cdk
        })
    }

    async FastAddCdk(e) {
        const { scenes, GioAdmin } = await GetUser(e)
        const { addCdk, CDK } = await GetState(scenes)
        if (!addCdk && !CDK) return
        if (!e.isMaster && !GioAdmin) return

        if (e.msg.includes("#快捷生成列表")) {
            const file = `${config}/cdk.yaml`
            const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
            e.reply(`${Object.keys(cfg).join('\n')}`)
        } else {
            const msg = e.msg.replace(/#快捷生成/, "")
            const file = `${config}/cdk.yaml`
            const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))

            if (!(cfg[msg])) {
                e.reply([segment.at(e.user_id), `\n${msg} 不存在\n发送“快捷生成列表”查看已有的`])
                return
            }

            const content = cfg[msg].split('-')
            if (content[0] !== '邮件' && content[0] !== '命令') {
                return e.reply("兑换类型不正确，请检查")
            }
            cdks = [
                "开始生成",
                "随机",
                content[0].replace("邮件", "mail").replace("命令", "command"),
                content[1],
                msg,
                content[2].replace("，", ",").replace("：", ":")
            ]
            AddCdk(e)
        }
    }

    async addCustomizeCdk(e) {
        const { scenes, GioAdmin } = await GetUser(e)
        const { addCdk, CDK } = await GetState(scenes)
        if (!addCdk && !CDK) return
        if (!e.isMaster && !GioAdmin) return

        const msg = e.msg.split('-')
        if (msg.length !== 6) {
            const base64 = Buffer.from(fs.readFileSync(resources + '/cdk/cdk-自定义.png')).toString('base64')
            await e.reply([segment.image(`base64://${base64}`)])
            e.reply("正确格式：\n自定义cdk-兑换类型-兑换码-总使用次数-单uid使用次数-对应命令")
            return
        }
        if (msg[1] !== '邮件' && msg[1] !== '命令') {
            e.reply("只能输入邮件或者命令")
            return
        }

        cdks = [
            "开始生成",
            "自定义",
            msg[1].replace("邮件", "mail").replace("命令", "command"),
            msg[2],
            msg[3],
            msg[4],
            msg[5].replace("，", ",").replace("：", ":")
        ]
        AddCdk(e)
    }

    async addRandomCdk(e) {
        const { scenes, GioAdmin } = await GetUser(e)
        const { addCdk, CDK } = await GetState(scenes)
        if (!addCdk && !CDK) return
        if (!e.isMaster && !GioAdmin) return

        const msg = e.msg.split('-')
        if (msg.length !== 5) {
            const base64 = Buffer.from(fs.readFileSync(resources + '/cdk/cdk-随机.png')).toString('base64')
            await e.reply([segment.image(`base64://${base64}`)])
            e.reply("正确格式：\n随机cdk-兑换类型-生成数量-TXT前缀-对应命令")
            return
        }
        if (msg[1] !== '邮件' && msg[1] !== '命令') {
            e.reply("只能输入邮件或者命令")
            return
        }

        cdks = [
            "开始生成",
            "随机",
            msg[1].replace("邮件", "mail").replace("命令", "command"),
            msg[2],
            msg[3],
            msg[4].replace("，", ",").replace("：", ":")
        ]
        AddCdk(e)
    }

    async delCdk(e) {
        const { scenes, GioAdmin } = await GetUser(e)
        const { addCdk, CDK } = await GetState(scenes)
        if (!addCdk && !CDK) return
        if (!e.isMaster && !GioAdmin) return

        const data = `${global.ZhiYu.data}/group/${scenes}/cdk`
        const msg = e.msg.replace(/#删除兑换码/g, "").trim()
        let file = `${data}/自定义/${msg}.yaml`
        if (msg.length === 32) {
            file = `${data}/批量生成/${msg}.yaml`
        }

        try {
            fs.accessSync(file, fs.constants.F_OK)
            fs.unlinkSync(file)
            e.reply([segment.at(e.user_id), "删除成功"])
        } catch (err) {
            if (err.code === 'ENOENT') {
                e.reply([segment.at(e.user_id), "兑换码不存在"])
            } else {
                e.reply([segment.at(e.user_id), "兑换码删除失败:", err])
            }
        }
    }

    async lookCdk(e) {
        const { scenes, GioAdmin } = await GetUser(e)
        const { addCdk, CDK } = await GetState(scenes)
        if (!addCdk && !CDK) return
        if (!e.isMaster && !GioAdmin) return

        const data = `${global.ZhiYu.data}/group/${scenes}/cdk`
        const msg = e.msg.replace(/#查看兑换码/g, "").trim()
        let file = `${data}/自定义/${msg}.yaml`
        if (msg.length === 32) {
            file = `${data}/批量生成/${msg}.yaml`
        }

        try {
            fs.accessSync(file, fs.constants.F_OK)
            const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
            const redeemlimit = `总可使用次数：${cfg.redeemlimit}`
            const uidusagelimit = `个人可使用次数：${cfg.uidusagelimit}`
            const createtime = `生成时间：${cfg.createtime}`
            const actiontype = `兑换方式：${cfg.actiontype}`
            const command = `对应命令：${cfg.command}`
            const used = `已使用次数：${cfg.used}`
            e.reply(`${msg}详情\n${redeemlimit}\n${uidusagelimit}\n${createtime}\n${actiontype}\n${command}\n${used}`)
        } catch (err) {
            if (err.code === 'ENOENT') {
                e.reply([segment.at(e.user_id), "兑换码不存在"])
            } else {
                e.reply([segment.at(e.user_id), "解析失败：", err])
            }
        }
    }
}


async function AddCdk(e) {
    const trss = e.group_id.toString().replace("qg_", "")
    const scenes = e.group_name === "频道插件" ? `${e.group_id}-${e.member.info.group_id}` : trss

    const cfg = Yaml.parse(fs.readFileSync(`${data}/group/${scenes}/config.yaml`, 'utf8'))
    const Group = cfg.addCdk.group

    if (cdks[1] === "自定义") {
        const file = `${data}/group/${Group}/cdk/自定义/${cdks[3]}.yaml`
        if (fs.existsSync(file)) {
            e.reply([segment.at(e.user_id), `兑换码${cdks[3]}已经存在`])
            cdks = []
            return
        }

        const time = moment().format('YYYY-MM-DD HH:mm:ss')
        const cdk = {
            redeemlimit: Number(cdks[4]),
            uidusagelimit: Number(cdks[5]),
            createtime: time,
            actiontype: cdks[2],
            command: cdks[6].replace("，", ",").replace("：", ":"),
            used: 0,
            uid: {
                "0": 0
            }
        }
        fs.writeFileSync(file, Yaml.stringify(cdk))
        e.reply([segment.at(e.user_id), `\n生成完毕\n兑换码为：${cdks[3]}\n可使用次数：${Number(cdks[4])}\n每个玩家可兑换次数：${Number(cdks[5])}\n发放方式：${cdks[2].replace("mail", "邮件").replace("command", "在线命令")}`])
        cdks = []
        return
    } else {
        e.reply([segment.at(e.user_id), `正在生成中...`])
        const time = moment().format('YYYY-MM-DD HH:mm:ss')
        const CdkContent = {
            redeemlimit: 1,
            uidusagelimit: 1,
            createtime: time,
            actiontype: cdks[2],
            command: cdks[5].replace("，", ",").replace("：", ":"),
            used: 0,
            uid: {
                "10001": 0
            }
        }
        const succwrite = []
        const failwrite = []
        const key = cfg.addCdk.key

        for (let i = 0; i < cdks[3]; i++) {
            const currentTimestamp = Date.now() + i // 使用递增的时间戳以防止重复                
            const cdk = {
                ...CdkContent,
                createtime: moment(currentTimestamp).format('YYYY-MM-DD HH:mm:ss')
            }
            const filename = crypto.createHash('md5')
                .update(currentTimestamp + key + cdks[5]).digest('hex')

            const yamlfile = `${data}/group/${Group}/cdk/批量生成/${filename}.yaml`
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
        if (cdks[3] < 51) {
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
            const txtfile = `${data}/group/${Group}/txt/${cdks[4]}${moment().format('YYYYMMDD-HHmmss')}.txt`
            fs.writeFileSync(txtfile, succwrite.join('\n'))
            if (e.isGroup) {
                Bot.pickGroup(e.group_id).fs.upload(txtfile)
            } else {
                Bot.pickFriend(e.user_id).sendFile(txtfile)
            }
        } catch (err) {
            console.error(err)
        }
        cdks = []
        return
    }
}
