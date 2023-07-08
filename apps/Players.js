import fs from 'fs'
import Yaml from 'yaml'
import { players } from './rule.js'
import plugin from '../../../lib/plugins/plugin.js'
import puppeteerRender from '../resources/render.js'
import { getScenes, getmode, getadmin, getpath } from './index.js'

let helplist = []
const { config, resources } = await getpath()

if (fs.existsSync(`${resources}/help/index.json`)) {
    helplist = JSON.parse(fs.readFileSync(`${resources}/help/index.json`, "utf8")) || []
}


export class Player extends plugin {
    constructor() {
        super({
            name: 'Players',
            dsc: '一些通用功能',
            event: 'message',
            priority: -100,
            rule: players
        })
    }


    async 小钰帮助(e) {
        let helpGroup = []
        helplist.forEach((group) => {
            if (group.auth && group.auth === "master" && !this.e.isMaster) {
                return
            }

            helpGroup.push(group)
        })

        let res = await puppeteerRender.render('help', 'index', { helpGroup })
        return e.reply(res)
    }

    async 别名帮助(e) {
        const base64 = Buffer.from(fs.readFileSync(resources + '/players/help-alias.png')).toString('base64')
        await e.reply(segment.image(`base64://${base64}`))
    }

    async 玩家列表(e) {
        const { mode } = await getmode(e)
        if (!mode) return
        if (mode !== false) {
            const cfg = Yaml.parse(fs.readFileSync(config + '/config.yaml', 'utf8'))
            const { value, scenes } = await getScenes(e)
            const uid = cfg[scenes].uid
            const keys = Object.keys(uid)
            const values = Object.values(uid).map(obj => JSON.stringify(obj).replace(/[{}"]/g, ''))
            const data = {
                keys: keys,
                values: values,
                title: '玩家列表',
                description1: `当前${value}所有已绑定UID的玩家`
            }
            const res = await puppeteerRender.render('players', 'index', data)
            return e.reply(res)
        }
    }

    async 命令别名(e) {
        const { gm } = await getmode(e)
        if (!gm) return
        const cfg = Yaml.parse(fs.readFileSync(config + '/command.yaml', 'utf8'))
        const keys = Object.values(cfg).map(entry => entry.filter(obj => 'names' in obj).flatMap(obj => obj.names).join(' - '))
        const data = {
            keys: keys,
            values: '',
            title: '命令别名',
            description1: `结构解析：多个别名使用“-”分隔,并不是所有的单元都是一个别名`,
            description2: `使用方法：在需要使用的别名前面加上“/”`
        }
        const res = await puppeteerRender.render('players', 'index', data)
        return e.reply(res)
    }

    async 邮件别名(e) {
        const { mail } = await getmode(e)
        if (!mail) return
        const cfg = Yaml.parse(fs.readFileSync(config + '/mail.yaml', 'utf8'))
        const keys = Object.values(cfg).map(entry => entry.filter(obj => 'names' in obj).flatMap(obj => obj.names).join(' - '))
        const data = {
            keys: keys,
            values: '',
            title: '邮件别名',
            description1: `结构解析：多个别名使用“-”分隔,并不是所有的单元都是一个别名`,
            description2: `使用方法：在需要使用的别名前面加上“邮件 ”，记得带空格`
        }
        const res = await puppeteerRender.render('players', 'index', data)
        return e.reply(res)
    }

    async 添加命令(e) {
        // 后续将使用逗号分割
        const { gm } = await getmode(e)
        if (!gm) return

        const { gioadmin } = await getadmin(e)
        if (!e.isMaster && !gioadmin) {
            e.reply([segment.at(e.user_id), "只有管理员才能命令我qwq"])
            return
        }

        if (e.msg.split(' ').length < 3) {
            e.reply([segment.at(e.user_id), '格式错误\n正确的格式为：添加命令 别名名称 /指令1 /指令2\n示例：添加命令 货币 /mcoin 99 /hcoin 99'])
            return
        }
        if (e.msg.split(' ')[2].indexOf('/') === -1) {
            e.reply([segment.at(e.user_id), '格式错误\n正确的格式为：添加命令 别名名称 /指令1 /指令2\n示例：添加命令 货币 /mcoin 99 /hcoin 99'])
            return
        }

        const msg = e.msg.split(' ')
        const alias = msg[1].includes('/') ? msg[1].split('/') : [msg[1]]
        const name = Array.isArray(alias) ? alias[0] : alias
        const oldcommand = msg.slice(2).join(' ')
        const newcommand = oldcommand.split('/').filter(Boolean).map(str => str.trim())
        const cfg = Yaml.parse(fs.readFileSync(config + '/command.yaml', 'utf8'))

        let state = false
        Object.values(cfg).forEach((value) => {
            const names = value[0]?.names || []
            if (names.some((n) => alias.includes(n))) {
                e.reply([segment.at(e.user_id), `存在别名：${alias.filter((a) => names.includes(a))}`])
                state = true
                return
            }
        })
        if (state) return
        cfg[name] = [
            { names: alias },
            { command: newcommand }
        ]

        fs.writeFileSync(config + '/command.yaml', Yaml.stringify(cfg))
        e.reply([segment.at(e.user_id), `添加成功`])
    }

    async 添加邮件(e) {
        const { mail } = await getmode(e)
        if (!mail) return

        const { gioadmin } = await getadmin(e)
        if (!e.isMaster && !gioadmin) {
            e.reply([segment.at(e.user_id), "只有管理员才能命令我(*/ω＼*)"])
            return
        }

        const msg = e.msg.split(' ')
        if (msg.length !== 5) {
            e.reply([segment.at(e.user_id), '格式错误\n正确的格式为：\n添加邮件 [别名 多个使用/分隔] 邮件标题 邮件内容 物品ID:数量,物品ID:数量\n\n示例：\n添加邮件 测试邮件 标题 内容 201:1,105003:1'])
            return
        }
        if (!msg[4].includes(':')) {
            e.reply([segment.at(e.user_id), '格式错误，请检查 [物品ID:数量]'])
            return
        }
        const alias = msg[1].includes('/') ? msg[1].split('/') : [msg[1]]
        const name = Array.isArray(alias) ? alias[0] : alias
        const cfg = Yaml.parse(fs.readFileSync(config + '/mail.yaml', 'utf8'))
        Object.values(cfg).forEach((value) => {
            const names = value[0]?.names || []
            if (names.some((n) => alias.includes(n))) {
                e.reply([segment.at(e.user_id), `存在别名：${alias.filter((a) => names.includes(a))}`])
                return
            }
        })
        cfg[name] = [
            {
                "names": alias
            },
            {
                "title": msg[2]
            },
            {
                "content": msg[3]
            },
            {
                "item_list": msg[4].replace(/，/g, ',').replace(/：/g, ':')
            }
        ]

        fs.writeFileSync(config + '/mail.yaml', Yaml.stringify(cfg))
        e.reply([segment.at(e.user_id), `添加成功`])
    }

    async 添加命令别名(e) {
        const { gm } = await getmode(e)
        if (!gm) return

        const { gioadmin } = await getadmin(e)
        if (!gioadmin && !e.isMaster) {
            e.reply(`只有管理大大才能命令我哦~\n(*/ω＼*)`)
            return
        }

        const msg = e.msg.split(' ')
        if (msg.length !== 3) {
            e.reply([segment.at(e.user_id), '格式错误\n正确的格式为：\n添加命令别名 [主别名] [新别名]\n\n示例：\n添加命令别名 90 一键满级'])
            return
        }
        const name = msg[1]
        const newname = msg[2].replace(/^\[|\]$/g, '')
        const cfg = Yaml.parse(fs.readFileSync(config + '/command.yaml', 'utf8'))
        let state = false

        for (const [key, value] of Object.entries(cfg)) {
            const names = value[0]?.names || []

            if (name === newname) {
                e.reply([segment.at(e.user_id), `达咩达咩，两个别名一样怎么加！`])
                state = true
                break
            }

            if (names.includes(newname)) {
                e.reply([segment.at(e.user_id), `达咩，${newname} 已经存在主别名 ${key} 中`])
                state = true
                break
            }

            if (key === name && !names.includes(newname)) {
                names.push(newname)
                fs.writeFileSync(config + '/command.yaml', Yaml.stringify(cfg), 'utf8')
                console.log(`已将 newname: ${newname} 添加到 ${key} 的 names 数组中`)
                e.reply([segment.at(e.user_id), `成功啦\n现在可以使用   /${newname}`])
                state = true
                break
            }
        }


        if (!state) {
            e.reply([segment.at(e.user_id), `达咩，没有 ${name} 这个主别名\n请发送 查看别名[别名名称] 获取主别名`])
        }
    }

    async 添加邮件别名(e) {
        const { mail } = await getmode(e)
        if (!mail) return

        const { gioadmin } = await getadmin(e)
        if (!gioadmin && !e.isMaster) {
            e.reply(`只有管理大大才能命令我哦~\n(*/ω＼*)`)
            return
        }

        const msg = e.msg.split(' ')
        if (msg.length !== 3) {
            e.reply([segment.at(e.user_id), '格式错误\n正确的格式为：\n添加邮件别名 [主别名] [新别名]\n\n示例：\n添加邮件别名 新手礼包 测试礼包'])
            return
        }
        const name = msg[1]
        const newname = msg[2].replace(/^\[|\]$/g, '')
        const cfg = Yaml.parse(fs.readFileSync(config + '/mail.yaml', 'utf8'))
        let state = false

        for (const [key, value] of Object.entries(cfg)) {
            const names = value[0]?.names || []

            if (name === newname) {
                e.reply([segment.at(e.user_id), `达咩达咩，两个别名一样怎么加！`])
                state = true
                break
            }

            if (names.includes(newname)) {
                e.reply([segment.at(e.user_id), `达咩，${newname} 已经存在主别名 ${key} 中`])
                state = true
                break
            }

            if (key === name && !names.includes(newname)) {
                names.push(newname)
                fs.writeFileSync(config + '/mail.yaml', Yaml.stringify(cfg), 'utf8')
                console.log(`已将 newname: ${newname} 添加到 ${key} 的 names 数组中`)
                e.reply([segment.at(e.user_id), `成功啦\n现在可以使用   /${newname}`])
                state = true
                break
            }
        }


        if (!state) {
            e.reply([segment.at(e.user_id), `达咩，没有 ${name} 这个主别名\n请发送 查看别名[别名名称] 获取主别名`])
        }
    }

    async 查看别名信息(e) {
        const { gm, mail } = await getmode(e)
        if (!gm && !mail) return
        let msg
        if (e.msg.includes('别名')) {
            msg = e.msg.split('别名')
        } else if (e.msg.includes(' ')) {
            msg = e.msg.split(' ')
        } else {
            let emsg = e.msg
            if (emsg.includes('查看命令')) {
                emsg = emsg.replace('查看命令', '查看命令 ')
            } else if (emsg.includes('查看邮件')) {
                emsg = emsg.replace('查看邮件', '查看邮件 ')
            }
            msg = emsg.split(' ')
        }

        if (msg[1] === '') {
            e.reply([segment.at(e.user_id), `\n格式错误，请正确填写需要查询的别名\n参数：查看(命令|邮件)别名[需要查询的别名]\n举例：查看命令别名90\n举例：查看邮件别名新手礼包`])
            return
        }
        if (msg[0] === '查看命令') {
            const cfg = Yaml.parse(fs.readFileSync(config + '/command.yaml', 'utf8'))

            let key = ''
            for (const topKey in cfg) {
                for (const subKey in cfg[topKey]) {
                    if (cfg[topKey][subKey].names && cfg[topKey][subKey].names.includes(msg[1].trim())) {
                        key = topKey
                        break
                    }
                }
                if (key) {
                    break
                }
            }

            if (!key) {
                e.reply([segment.at(e.user_id), ` ${msg[1].trim()} 不存在，请确认你输入的是正确的已有别名`])
                return
            }

            const alias = cfg[key][0].names.join(' ')
            const command = cfg[key][1].command.join('\n/')
            e.reply([segment.at(e.user_id), `\n主别名：${key}\n已拥有别名：\n${alias}\n\n指令：\n/${command}\n\n添加新别名指令：\n添加命令别名 ${key} [新别名]`])
        }

        if (msg[0] === '查看邮件') {
            const cfg = Yaml.parse(fs.readFileSync(config + '/mail.yaml', 'utf8'))

            let key = ''
            for (const topKey in cfg) {
                for (const subKey in cfg[topKey]) {
                    if (cfg[topKey][subKey].names && cfg[topKey][subKey].names.includes(msg[1].trim())) {
                        key = topKey
                        break
                    }
                }
                if (key) {
                    break
                }
            }

            if (!key) {
                e.reply([segment.at(e.user_id), ` ${msg[1].trim()} 不存在，请确认你输入的是正确的已有别名`])
                return
            }

            const alias = cfg[key][0].names.join(' ')
            const title = cfg[key][1].title
            const content = cfg[key][2].content.length
            const item_list = cfg[key][3].item_list
            e.reply([segment.at(e.user_id), `\n主别名：${key}\n已拥有别名：\n${alias}\n\n标题：${title}\n内容：${content}\n物品：${item_list}\n\n添加新别名指令：\n添加命令别名 ${key} [新别名]`])
        }
    }

    async 删除命令别名(e) {
        const { gm } = await getmode(e)
        if (!gm) return
        const { gioadmin } = await getadmin(e)
        if (!gioadmin && !e.isMaster) {
            e.reply(`只有管理大大才能命令我哦~\n(*/ω＼*)`)
            return
        }

        const cfg = Yaml.parse(fs.readFileSync(config + '/command.yaml', 'utf8'))
        let msg
        if (e.msg.includes('删除命令别名')) {
            msg = e.msg.replace('删除命令别名', '')
        } else {
            msg = e.msg.replace('删除命令', '')
        }
        msg = msg.trim()
        if (!msg) {
            e.reply([segment.at(e.user_id), `格式错误\n格式：删除命令 [删除的主别名]`])
            return
        }
        if (!cfg.hasOwnProperty(msg)) {
            e.reply([segment.at(e.user_id), `达咩达咩，没有这个别名`])
            return
        }
        const alias = cfg[msg][0].names.join('/')
        const command = cfg[msg][1].command.join(' /')
        delete cfg[msg]
        fs.writeFileSync(config + '/command.yaml', Yaml.stringify(cfg), 'utf8')
        e.reply([segment.at(e.user_id), `\n已删除 ${msg}\n你可以通过指令重新添加此命令：\n添加命令 ${alias} /${command}`])
    }

    async 删除邮件别名(e) {
        const { mail } = await getmode(e)
        if (!mail) return

        const { gioadmin } = await getadmin(e)
        if (!gioadmin && !e.isMaster) {
            e.reply(`只有管理大大才能命令我哦~\n(*/ω＼*)`)
            return
        }

        const cfg = Yaml.parse(fs.readFileSync(config + '/mail.yaml', 'utf8'))
        let msg
        if (e.msg.includes('删除邮件别名')) {
            msg = e.msg.replace('删除邮件别名', '')
        } else {
            msg = e.msg.replace('删除邮件', '')
        }
        msg = msg.trim()
        if (!msg) {
            e.reply([segment.at(e.user_id), `格式错误\n格式：删除邮件[可选参数：别名] [删除的主别名]`])
            return
        }
        if (!cfg.hasOwnProperty(msg)) {
            e.reply([segment.at(e.user_id), `达咩达咩，没有这个别名`])
            return
        }
        const alias = cfg[msg][0].names.join('/')
        const title = cfg[msg][1].title
        const content = cfg[msg][2].content.replace(/\n/g, '\\n')
        const item_list = cfg[msg][3].item_list
        delete cfg[msg]
        fs.writeFileSync(config + '/mail.yaml', Yaml.stringify(cfg), 'utf8')
        e.reply([segment.at(e.user_id), `\n已删除 ${msg}\n你可以通过指令重新添加此命令：\n添加邮件 ${alias} ${title} ${content} ${item_list}`])
    }

    async 查看ID(e) {
        const { scenes, value } = await getScenes(e)
        e.reply(`当前${value}ID：${scenes}\n您的个人ID：${e.user_id.replace("qg_", "")}`)
    }
}