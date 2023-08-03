import fs from 'fs'
import Yaml from 'yaml'
import { other } from './regex.js'
import { GetUser, GetState } from './app.js'
import render from '../resources/render.js'

const { alias, Questlist, resources, Yzversion, version } = global.ZhiYu

export class ZhiYu extends plugin {
    constructor() {
        super({
            name: 'zhiyu-plugin',
            dsc: '一些通用功能',
            event: 'message',
            priority: -100,
            rule: other
        })
    }


    async help(e) {
        let helpGroup = []
        let helplist = JSON.parse(fs.readFileSync(`${resources}/help/index.json`, "utf8"))
        helplist.forEach((group) => {
            if (group.auth && group.auth === "master" && !this.e.isMaster) return
            helpGroup.push(group)
        })
        e.reply(await render.render('help', 'index', { helpGroup }))
    }

    async aliasList(e) {
        const { scenes } = await GetUser(e)
        const { GM } = await GetState(scenes)
        if (!GM) return
        List(e)
    }

    async CdkList(e) {
        const { scenes } = await GetUser(e)
        const { CDK } = await GetState(scenes)
        if (!CDK) return

        const list = fs.readdirSync(`${global.ZhiYu.data}/group/${scenes}/cdk/自定义`)
            .filter(file => file.toLowerCase().endsWith('.yaml') && !file.includes('测试'))
            .map(file => '兑换' + file.slice(0, -5)) || []

        let data = {
            title: "公开兑换码列表",
            list: list,
            Yzversion: Yzversion,
            version: version
        }
        e.reply(await render.render('alias', 'mail', data))
    }

    async addalias(e) {
        const { scenes, GioAdmin } = await GetUser(e)
        const { GM, Mail } = await GetState(scenes)

        if (!e.isMaster && !GioAdmin) return e.reply([segment.at(e.user_id), "只有管理员才能命令我qwq"])

        if (e.msg.includes("添加命令")) {
            if (!GM) return
            e.reply(addGM(e))
        } else {
            if (!Mail) return
            e.reply(addMail(e))
        }
    }

    async delalias(e) {
        const { scenes, GioAdmin } = await GetUser(e)
        const { GM } = await GetState(scenes)
        if (!GM) return

        if (!GioAdmin && !e.isMaster) return e.reply(`只有管理大大才能命令我哦~\n(*/ω＼*)`)

        if (e.msg.includes("命令")) {
            e.reply(delGM(e))
        } else {
            e.reply(delMail(e))
        }
    }

    async lookupQuest(e) {
        const outcome = []
        const msg = e.msg.replace(/查找任务|查找/g, "").trim()

        for (const [key, value] of Object.entries(Questlist)) {
            if (key.includes(msg) || value.includes(msg)) {
                outcome.push(`${key}: ${value}`)
            }
        }
        if (outcome.length > 60) {
            e.reply("搜索结果过多，请提供更详细的关键词")
        } else if (outcome.length > 0) {
            e.reply(`使用方法：\n1.完成任务+ID\n2.添加任务+ID\n举例：完成任务1000001\n\n查找结果：\n${outcome.join('\n')}`)
        } else {
            e.reply("未查询到相关任务")
        }
    }

    async Information(e) {
        const trss = e.group_id.toString().replace("qg_", "")
        const scenes = e.group_name === "频道插件" ? `${e.group_id}-${e.member.info.group_id}` : trss
        const id = e.user_id
        const newid = e.user_id.toString().replace("qg_", "")
        const group_id = e.group_id
        e.reply(`您的个人信息：\n个人id：${id}\n频道个人id：${newid}\n\n场景id：${scenes}\n群聊ID：${group_id}`)
    }
}

/** alias */
async function List(e) {
    const msg = e.msg.replace(/\/|列表|别名|#/g, "")
    const YamlFiles = fs.readdirSync(`${alias}/command`)
        .filter(file => file.toLowerCase().endsWith('.yaml'))
        .map(file => '#' + file.slice(0, -5) + '别名')

    YamlFiles.push("#自定义别名")
    if (e.msg.includes("列表")) return e.reply(`使用方法：\n发送以下任意指令即可查看对应别名\n\n别名列表：\n${YamlFiles.join('\n')}`)

    const file = `${alias}/command/${msg}.yaml`
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
        e.reply(await render.render('alias', 'alias', data))
    } else if (e.msg.includes("邮件")) {
        const cfg = Yaml.parse(fs.readFileSync(`${alias}/mail/mail.yaml`, 'utf8'))
        const list = Object.values(cfg).map(entry => entry.filter(obj => 'names' in obj).flatMap(obj => obj.names).join(' - '))

        data.aliasTitle = "邮件别名指令列表"
        data.exegesisA = `使用：下方名称前面加上[邮件 ] 注意空格`
        data.exegesisB = `温馨提示：[神瞳 - 神瞳大礼包] 这样是多个别名`
        data.exegesisC = `使用举例：[邮件 神瞳] 或者 [邮件 神瞳大礼包] 都可以达到一个效果`
        data.title = `邮件别名指令`
        data.list = list

        e.reply(await render.render('alias', 'mail', data))
    } else if (e.msg.includes("自定义")) {
        const cfg = Yaml.parse(fs.readFileSync(`${alias}/command.yaml`, 'utf8'))
        const list = Object.values(cfg).map(entry => entry.filter(obj => 'names' in obj).flatMap(obj => obj.names).join(' - '))

        data.list = list
        e.reply(await render.render('alias', 'alias', data))
    } else {
        e.reply("无此别名，请使用“别名列表”进行查看已有别名文件")
    }
}

/** 添加快捷命令 */
function addGM(e) {
    /** 逗号统一 */
    const msg = e.msg.replace(/，/g, ",").split(' ')
    const name = msg[1].split(',') || [msg[1]]
    const command = msg.slice(2).join(' ').split(',') || [msg.slice(2).join(' ')]
    const file = `${alias}/command.yaml`
    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
    const knownAliases = new Set()

    for (const value of Object.values(cfg)) {
        const names = value[0]?.names || []
        for (const n of names) {
            knownAliases.add(n)
        }
    }

    const conflictingAliases = name.filter((a) => knownAliases.has(a))
    if (conflictingAliases.length > 0) return [segment.at(e.user_id), `存在别名：${conflictingAliases.join(', ')}`]

    cfg[name[0]] = [
        { names: name },
        { command: command }
    ]

    fs.writeFileSync(file, Yaml.stringify(cfg))
    Object.assign(global.ZhiYu.list, cfg)
    return [segment.at(e.user_id), `添加成功`]
}

/** 添加快捷邮件 */
function addMail(e) {
    /** 逗号统一 */
    const [command, aliasStr, title, content, itemList] = e.msg.replace(/，/g, ",").split(' ')

    if (![aliasStr, title, content, itemList].every(Boolean)) {
        return [segment.at(e.user_id), '格式错误\n正确的格式为：\n添加邮件 [别名 多个使用逗号连接] 标题 内容 物品ID:数量,物品ID:数量\n\n示例：\n添加邮件 测试邮件 标题 内容 201:1,105003:1']
    }

    if (!itemList.includes(':')) {
        return [segment.at(e.user_id), '格式错误，请检查 [物品ID:数量]']
    }

    const name = aliasStr.split(',') || [aliasStr]
    const file = `${alias}/mail/mail.yaml`
    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
    const knownAliases = new Set()

    for (const value of Object.values(cfg)) {
        const names = value[0]?.names || []
        for (const n of names) {
            knownAliases.add(n)
        }
    }

    const conflictingAliases = name.filter((a) => knownAliases.has(a))
    if (conflictingAliases.length > 0) {
        return [segment.at(e.user_id), `存在别名：${conflictingAliases.join(', ')}`]
    }

    cfg[name[0]] = [
        {
            "names": name
        },
        {
            "title": title
        },
        {
            "content": content
        },
        {
            "item_list": itemList.replace(/：/g, ':')
        }
    ]

    fs.writeFileSync(file, Yaml.stringify(cfg))
    return [segment.at(e.user_id), `添加成功`]
}

/** 删除快捷命令 */
function delGM(e) {
    const msg = e.msg.replace(/删除命令|#/g, '').trim()
    const file = alias + '/command.yaml'
    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))

    for (const key in cfg) {
        /** 获取names */
        const names = cfg[key][0].names
        /** 检测names中是否存在msg */
        if (names.includes(msg)) {
            const command = cfg[key][1].command
            delete cfg[key]
            delete alias[key]
            fs.writeFileSync(file, Yaml.stringify(cfg), 'utf8')
            return [segment.at(e.user_id), `\n已删除 ${msg}\n你可以通过指令重新添加此命令：\n#添加命令 ${names.join(',')} ${command.join(',')}`]
        }
    }
    return [segment.at(e.user_id), `达咩达咩，没有这个别名`]
}

/** 删除快捷邮件 */
function delMail(e) {
    const msg = e.msg.replace(/删除邮件|#/g, '').trim()
    const file = `${alias}/mail/mail.yaml`
    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))

    for (const key in cfg) {
        /** 获取names */
        const names = cfg[key][0].names
        /** 检测names中是否存在msg */
        if (names.includes(msg)) {
            const title = cfg[key][1].title
            const content = cfg[key][2].content
            const item_list = cfg[key][3].item_list
            delete cfg[key]
            fs.writeFileSync(file, Yaml.stringify(cfg), 'utf8')
            return [segment.at(e.user_id), `\n已删除 ${msg}\n你可以通过指令重新添加此命令：\n#添加邮件 ${names.join(',')} ${title} ${content} ${item_list}`]
        }
    }
    return [segment.at(e.user_id), `达咩达咩，没有这个别名`]
}