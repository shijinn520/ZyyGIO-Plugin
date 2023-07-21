import fs from 'fs'
import Yaml from 'yaml'
import puppeteerRender from '../resources/render.js'
import {
    ComputeGM,
    ComputeMail,
    Request,
    GetServer,
    GetUser,
    GetState,
    GetPassList
} from './request.js'

const { data, AliasList, config, resources, Yzversion, version } = global.ZhiYu
let helplist = JSON.parse(fs.readFileSync(`${resources}/help/index.json`, "utf8")) || []

export class ZhiYu extends plugin {
    constructor() {
        super({
            name: 'zhiyu-plugin',
            dsc: '一些通用功能',
            event: 'message',
            priority: -100,
            rule: [
                {
                    reg: /^\/?(帮助|help)$/,
                    fnc: 'help',
                },
                {
                    reg: /^\/?(.*)别名(列表)?$/,
                    fnc: 'aliasList',
                },
                {
                    reg: /^\/?添加命令 (.*)$/,
                    fnc: '添加命令',
                },
                {
                    reg: /^\/?添加邮件 (.*)$/,
                    fnc: '添加邮件',
                },
                {
                    reg: /^\/?别名列表$/,
                    fnc: '别名帮助',
                },
                {
                    reg: /^\/?查看(命令|邮件)(.*)$/,
                    fnc: '查看别名信息'
                },
                {
                    reg: /^\/?添加命令别名(.*)$/,
                    fnc: '添加命令别名'
                },
                {
                    reg: /^\/?添加邮件别名(.*)$/,
                    fnc: '添加邮件别名'
                },
                {
                    reg: /^\/?删除命令(.*)$/,
                    fnc: '删除命令别名'
                },
                {
                    reg: /^\/?删除邮件(.*)$/,
                    fnc: '删除邮件别名'
                },
                {
                    reg: /^\/?我的id$/gi,
                    fnc: '查看ID'
                }
            ]
        })
    }


    async help(e) {
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

    async aliasList(e) {
        const { gm } = basic(e)
        if (!gm) return

        const msg = e.msg.replace(/\/|列表|别名/g, "")
        const YamlFiles = fs.readdirSync(`${AliasList}/command`).filter(file => file.toLowerCase()
            .endsWith('.yaml')).map(file => file.slice(0, -5) + '别名')
        YamlFiles.push("自定义别名")
        if (e.msg.includes("列表")) {
            e.reply(`使用方法：\n发送以下任意指令即可查看对应别名\n\n别名列表：\n${YamlFiles.join('\n')}`)
            return
        }

        const file = `${AliasList}/command/${msg}.yaml`
        let data = {
            aliasTitle: "全部别名指令列表",
            aliasName: "别名指令",
            exegesisA: `使用：下方名称前面加上/`,
            exegesisB: `温馨提示：[Q - Q无限充能] 这样是多个别名`,
            exegesisC: `使用举例：/Q 或者 /Q无限充能 都可以达到一个效果`,
            YamlFiles: YamlFiles,
            title: `${msg}别名指令`,
            list: {},
            Yzversion: Yzversion,
            version: version
        }

        if (fs.existsSync(file)) {
            const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
            const list = Object.values(cfg).map(entry => entry.filter(obj => 'names' in obj).flatMap(obj => obj.names).join(' - '))

            data.list = list
            const res = await puppeteerRender.render('players', 'alias', data)
            return e.reply(res)
        } else if (e.msg.includes("邮件")) {
            const cfg = Yaml.parse(fs.readFileSync(`${AliasList}/mail/mail.yaml`, 'utf8'))
            const list = Object.values(cfg).map(entry => entry.filter(obj => 'names' in obj).flatMap(obj => obj.names).join(' - '))

            data.aliasTitle = "邮件别名指令列表"
            data.exegesisA = `使用：下方名称前面加上[邮件 ] 注意空格`
            data.exegesisB = `温馨提示：[神瞳 - 神瞳大礼包] 这样是多个别名`
            data.exegesisC = `使用举例：[邮件 神瞳] 或者 [邮件 神瞳大礼包] 都可以达到一个效果`
            data.title = `邮件别名指令`
            data.list = list

            const res = await puppeteerRender.render('players', 'mail', data)
            return e.reply(res)
        } else if (e.msg.includes("自定义")) {
            const cfg = Yaml.parse(fs.readFileSync(`${AliasList}/command.yaml`, 'utf8'))
            const list = Object.values(cfg).map(entry => entry.filter(obj => 'names' in obj).flatMap(obj => obj.names).join(' - '))

            data.list = list

            const res = await puppeteerRender.render('players', 'alias', data)
            return e.reply(res)
        } else {
            e.reply("无此别名，请使用“别名列表”进行查看已有别名文件")
            return
        }
    }

    async 添加命令(e) {
        const { scenes, GioAdmin } = await GetUser(e)
        if (!(await GetState(scenes)).GM) return


        if (!e.isMaster && !GioAdmin) {
            e.reply([segment.at(e.user_id), "只有管理员才能命令我qwq"])
            return
        }

        const msg = e.msg.replace(/，/g, ",").split(' ')
        const alias = msg[1].split(',') || [msg[1]]
        const command = msg.slice(2).join(' ').split(',') || [msg.slice(2).join(' ')]
        const cfg = Yaml.parse(fs.readFileSync(AliasList + '/command.yaml', 'utf8'))

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
        cfg[alias[0]] = [
            { names: alias },
            { command: command }
        ]

        fs.writeFileSync(AliasList + '/command.yaml', Yaml.stringify(cfg))
        e.reply([segment.at(e.user_id), `添加成功`])
    }

    async 添加邮件(e) {
        const { mail, GioAdmin } = basic(e)
        if (!mail) return

        if (!e.isMaster && !GioAdmin) {
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
        const { gm, GioAdmin } = basic(e)
        if (!gm) return

        if (!GioAdmin && !e.isMaster) {
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
        const { mail, GioAdmin } = basic(e)
        if (!mail) return

        if (!GioAdmin && !e.isMaster) {
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
        const { gm, mail } = basic(e)
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
        const { gm, GioAdmin } = basic(e)
        if (!gm) return

        if (!GioAdmin && !e.isMaster) {
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
        const { mail, GioAdmin } = basic(e)
        if (!mail) return

        if (!GioAdmin && !e.isMaster) {
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
        const { scenes } = basic(e)
        e.reply(`当前群聊场景ID：${scenes}\n您的个人ID：${e.user_id.toString().replace("qg_", "")}`)
    }
}


function basic(e) {
    let gm = false
    let uid = false
    let mail = false
    let GioAdmin = false

    const trss = e.group_id.toString().replace("qg_", "")
    const scenes = e.group_name === "频道插件" ? `${e.group_id}-${e.member.info.group_id}` : trss
    const file = `${data}/user/${e.user_id.toString().replace("qg_", "")}.yaml`

    if (!fs.existsSync(file)) {
        e.reply([segment.at(e.user_id), "\n清先绑定UID\n格式：绑定+UID\n举例：绑定100001"])
    }
    else {
        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        uid = cfg.uid
        GioAdmin = cfg.Administrator ? true : false
    }

    const Groupcfg = `${data}/group/${scenes}/config.yaml`

    if (!fs.existsSync(Groupcfg)) {
        console.log(`\x1b[31m[ZhiYu]当前群聊 ${scenes} 未初始化\x1b[0m`)
    }

    const cfg = Yaml.parse(fs.readFileSync(Groupcfg, 'utf8'))
    gm = cfg.GM.状态 ? true : false
    mail = cfg.邮件.状态 ? true : false
    return { scenes, GioAdmin, gm, mail }
}

