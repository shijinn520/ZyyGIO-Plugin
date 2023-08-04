import fs from 'fs'
import Yaml from 'yaml'
import moment from 'moment'
import fetch from 'node-fetch'
import { ComputeMail } from './request.js'
import { GetUser, GetServer, GetState } from './app.js'

let state = false
const { data, config, alias } = global.ZhiYu

export class mails extends plugin {
    constructor() {
        super({
            name: 'zhiyu-plugin',
            dsc: '邮件相关',
            event: 'message',
            priority: -100,
            rule: [
                {
                    reg: /^#全服邮件+/,
                    fnc: 'allMail'
                }
            ]
        })

        /** 生日邮件定时推送 */
        this.task = {
            cron: "0 0 0 * * *",
            name: '生日邮件定时推送',
            fnc: () => this.taskMail(),
        }
    }

    async allMail(e) {
        const { scenes, GioAdmin } = await GetUser(e)
        const { Mail } = await GetState(scenes)
        if (!Mail) return

        if (!GioAdmin && !e.isMaster) return e.reply(`只有管理大大才能命令我哦~\n(*/ω＼*)`)
        /** 防止短时间重复触发 */
        if (state) return e.reply([segment.at(e.user_id), `全服邮件还在发送中...请勿重复触发...`])
        state = true

        e.reply("正在执行...")
        /** 为什么要加这个... 因为坑逼频道插件没有转码 */
        const msg = (e.msg.replace(/&lt;color=([^&]+)&gt;([^&]+)&lt;\/color&gt;/g, '<color=$1>$2</color>')).split(' ')
        const mails = Yaml.parse(fs.readFileSync(`${alias}/mail/mail.yaml`, 'utf8'))

        let title = msg[1]
        let content = msg[2]
        let item_list = msg[3]

        for (const key in mails) {
            /** 这里检测是否存在别名 */
            const obj = mails[key]
            const names = obj[0].names
            if (names && names.includes(msg[1])) {
                title = obj[1].title
                content = obj[2].content
                item_list = obj[3].item_list
                break
            }
        }

        /** 等待循环完毕判断格式 */
        if (!item_list || !/:|：/.test(item_list)) {
            const reply = `邮件格式错误\n\n格式：邮件 [标题] [内容] [ID:数量,ID:数量]\n举例：邮件 测试 你好 201:1`
            state = false
            return e.reply([segment.at(e.user_id), reply])
        }

        const { ip, port, region, sign, ticket, MailSender } = await GetServer(e)

        /** 获取全服uid */
        const uids = await allUid(ip, port)

        /** 计算url并存储到urls里面，准备开始请求 */
        const urls = []
        const sender = MailSender
        const now = Math.floor(Date.now() / 1000)
        const expire_time = (now + (30 * 24 * 60 * 60)).toString()
        const collection = false

        const asyncTasks = uids.map(async uid => {
            const request = await ComputeMail(uid, region, content,
                expire_time, item_list, sender, title, ticket, sign, collection)
            urls.push(`http://${ip}:${port}/api?${request}`)
        })

        /** 等待所有url计算完毕 */
        await Promise.all(asyncTasks)
        e.reply([segment.at(e.user_id), `预计需要${(urls.length * 0.02).toFixed(2)}分钟...`])
        await batchRequest(urls, e)
    }

    /** 每天凌晨检查当天是否存在角色生日 */
    async taskMail() {
        const cfg = Yaml.parse(fs.readFileSync(`${config}/birthdaymail.yaml`, 'utf8'))

        /** 获取当前日期的月和日 */
        const currentMonth = new Date().getMonth() + 1
        const currentDay = new Date().getDate()

        /** 收集所有符合条件的生日日期 */
        const theRole = Object.keys(cfg).filter(key => {
            const [month, day] = key.split('-').map(Number)
            return month === currentMonth && day === currentDay
        })

        /** 查看是否有需要推送的群聊 */
        const Group = Yaml.parse(fs.readFileSync(`${config}/birthday.yaml`, 'utf8'))

        for (const birthday of theRole) {
            const names = Object.keys(cfg[birthday])
            /** 存在多个角色的情况下 依次发送 */
            for (const name of names) {
                logger.mark(`今天是 ${name} 的生日~`)
                for (const key in Group) {
                    const { mode, ip, port, region, sign } = Group[key]
                    /** 判断群聊是否开启推送 */
                    if (mode) await festival(ip, port, region, sign, birthday, name)
                    /** mode状态未开启跳出循环 */
                    else continue
                }
            }
        }
    }
}


async function festival(ip, port, region, sign, birthday, name) {
    state = true
    /** 获取全服uid */
    const uids = await allUid(ip, port)

    /** 读取角色对应文案构成邮件参数 */
    const cfg = Yaml.parse(fs.readFileSync(`${config}/birthdaymail.yaml`, 'utf8'))

    const sender = name
    const collection = true
    const title = cfg[birthday][name].标题
    const content = cfg[birthday][name].内容
    const item_list = cfg[birthday][name].奖励
    const now = Math.floor(Date.now() / 1000)
    const expire_time = (now + (365 * 24 * 60 * 60)).toString()

    /** 计算url并存储到urls里面，准备开始请求 */
    const urls = []

    const asyncTasks = uids.map(async uid => {
        const ticket = `Zyy955${uid}${moment().format('YYYYMMDDHHmmss')}`
        const request = await ComputeMail(uid, region, content, expire_time,
            item_list, sender, title, ticket, sign, collection)
        urls.push(`http://${ip}:${port}/api?${request}`)
    })

    /** 等待所有url计算完毕 */
    await Promise.all(asyncTasks)
    logger.mark(`预计需要${(urls.length * 0.01).toFixed(2)}分钟...`)
    const e = false
    await batchRequest(urls, e)
}

/** 使用可读流解析全服uid */
async function allUid(ip, port) {
    let uids
    let filecontent = ''
    const file = `${data}/alluid/${ip}-${port}.yaml`

    /** 添加检测防止崩溃 */
    if (!fs.existsSync(file)) fs.writeFileSync(file, ' - "0"\n')

    const stream = fs.createReadStream(file, 'utf8')
    stream.on('data', (chunk) => { filecontent += chunk })
    await new Promise((resolve, reject) => {
        stream.on('end', () => {
            uids = Yaml.parse(filecontent)
            resolve()
        })
        stream.on('error', (error) => {
            logger.mark("读取文件错误", error)
            reject(error)
        })
    })

    return uids
}

/** 向MuipServer批量发送请求 */
async function batchRequest(urls, e) {
    let time = 20
    const succs = []
    const fails = []
    const Timeout = []
    for (const url of urls) {
        try {
            /** 从请求的url中提取uid */
            const uid = url.match(/uid=(\d+)/)[1]

            /** 设置延迟，muipserver响应过慢直接中断 */
            const result = await Promise.race([
                fetch(url).then(response => response.json()),
                new Promise((_, reject) => setTimeout(() => reject(new Error(`超过3秒未响应：${uid}`)), 3000))
            ])
            logger.debug(result)

            /** 将响应结果可视化处理 */
            const { succ, fail } = await dispose(result, uid)
            if (succ.length > 0) succs.push(succ)
            if (fail.length > 0) fails.push(fail)

            /** 处理请求间隔，当达到100的倍数，等待1s */
            const count = Timeout.length + fails.length + succs.length
            time = count % 100 === 0 ? 1000 : 20
            await new Promise(resolve => setTimeout(resolve, time))
        } catch (error) {
            logger.debug(error.message)
            Timeout.push(`请求错误：${error.message}`)
        }

        /** 将请求失败+响应失败的数量相加，达到50则停止后续请求 */
        if ((Timeout.length + fails.length) >= 50) {
            logger.error("错误指令 fails", fails)
            logger.error("请求错误 Timeout：", Timeout)
            const msg = `${fails.join('\n').trim()}${Timeout.join('\n').trim()}`
            const reply = `错误次数过多\n详细错误：\n${msg}\n\n已停止继续发送，请检查指令~`
            if (!e) return logger.mark(reply)
            else return e.reply([segment.at(e.user_id), `\n${reply}`])
        }
    }

    /** 求和 */
    const sum = Timeout.length + fails.length + succs.length

    /** 当请求数量为100的倍数，控制台打印进度 */
    if (sum > 0 && sum % 100 === 0) {
        logger.mark(`总请求：${urls.length} 已发送：${sum} 待发送：${urls.length - sum} 发送成功：${succs.length}`)
    }

    /** 发送完毕进行回复 */
    if (urls.length === sum) {
        const msg = `总请求：${urls.length}\n成功：${succs.length}\n失败：${fails.length}\n请求错误：${Timeout.length}`
        state = false

        /** 输出错误日志~ */
        logger.error("错误指令 fails", fails)
        logger.error("请求错误 Timeout：", Timeout)

        /** Miaozai的频道插件没测试过是否可以进行主动发消息 */
        if (!e) return logger.mark(`发送完毕...\n${msg}`)
        else return Bot.pickGroup(e.group_id).sendMsg([segment.at(e.user_id), `发送完毕...\n${msg}`])
    }
}

/** 将响应结果可视化处理 */
async function dispose(data, uid) {
    const succ = []
    const fail = []
    const retcode = data.retcode
    let datamsg = data.data?.msg || {}

    const ErrorCode = {
        4: "又不在线，再发我顺着网线打死你！╭(╯^╰)╮",
        17: `\n失败 -> 账户不存在\nuid：${uid}`,
        104: `失败：${datamsg}  ->  ${uid}\n原因：无此角色...`,
        105: "失败 -> 无法删除角色，请勿将角色放置队伍中...",
        609: `失败：${datamsg}  ->  ${uid}\n原因：物品数量不足`,
        617: `失败：${datamsg}  ->  ${uid}\n原因：数量超出限制`,
        626: `失败：${datamsg}  ->  ${uid}\n原因：货币超出限制`,
        627: `失败：${datamsg}  ->  ${uid}\n原因：数量超出限制`,
        640: `失败：${datamsg}  ->  ${uid}\n原因：数量超出限制`,
        642: "失败 -> 装备超过限制",
        647: "失败 -> 返回物品数量为0",
        661: "失败 -> 树脂超过限制",
        860: `失败：${datamsg}  ->  ${uid}\n原因：活动已关闭`,
        1002: `失败 -> 参数错误 ${uid}`,
        1003: "失败 -> 服务器验证签名错误",
        1010: "失败 -> 服务器区服不匹配",
        1117: "失败 -> 未达到副本要求等级",
        1202: "失败 -> 处于多人模式非房主",
        1311: "失败 -> 禁止发送「创世结晶」",
        1312: "失败 -> 游戏货币超限",
        1313: "失败 -> 超出邮件发送货币限制",
        1315: "失败 -> 超出邮件发送角色限制",
        1316: "失败 -> 游戏货币超限",
        2006: "失败 -> 禁止重复发送邮件",
        2028: "失败 -> 邮件日期设置错误，请修改「expire_time」",
        8002: "失败 -> 传说钥匙超过限制",
        "-1": `失败 -> 发生未知错误 ${uid}`
    }

    /** 根据状态码判断对应内容 进行可视化处理 */
    if (retcode === 0) {
        succ.push(`成功：${datamsg}  ->  ${uid}`)
    } else if (ErrorCode.hasOwnProperty(retcode)) {
        fail.push(ErrorCode[retcode])
    } else {
        fail.push(`失败 -> 请把此内容反馈给作者\nUID:${uid}\n反馈内容：\n${data}`)
    }

    return { succ, fail }
}
