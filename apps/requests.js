import fs from 'fs'
import http from 'http'
import Yaml from 'yaml'
import crypto from 'crypto'
import fetch from 'node-fetch'
import schedule from 'node-schedule'
import { ComputeMail } from './request.js'
import { GetUser, GetServer, GetState } from './app.js'

let state = true
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
                    reg: '^#全服邮件 (.*)$',
                    fnc: 'allMail'
                }
            ]
        })
    }
    /** qwq改的头疼，就这样吧 */
    async allMail(e) {
        const { scenes, GioAdmin } = await GetUser(e)
        const { Mail } = await GetState(scenes)
        if (!Mail) return

        if (!GioAdmin && !e.isMaster) return e.reply(`只有管理大大才能命令我哦~\n(*/ω＼*)`)
        // if (!state) return e.reply([segment.at(e.user_id), `全服邮件还在发送中...请勿重复触发...`])

        // state = false
        e.reply([segment.at(e.user_id), `正在执行...预计需要10-20分钟...`])
        // const cfg = Yaml.parse(fs.readFileSync(`${alias}/mail/mail.yaml`, 'utf8'))
        const msg = e.msg.split(' ')

        let title = msg[1]
        let content = msg[2]
        let item_list = msg[3]

        const { ip, port, region, sign, ticket, MailSender } = await GetServer(e)

        /** 使用可读流解析全服uid */
        let uids
        let filecontent = ''
        const stream = fs.createReadStream(`${data}/alluid/${ip}-${port}.yaml`, 'utf8')
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

        /** 计算url并存储到urls里面，准备开始请求 */
        const urls = []
        let sender = MailSender
        const now = Math.floor(Date.now() / 1000)
        const expire_time = (now + (30 * 24 * 60 * 60)).toString()

        const asyncTasks = uids.map(async uid => {
            const request = await ComputeMail(uid, region, content,
                expire_time, item_list, sender, title, ticket, sign)
            urls.push(`http://${ip}:${port}/api?${request}`)
        })

        /** 等待所有url计算完毕 */
        await Promise.all(asyncTasks)

        /** 向MuipServer发送请求 */
        let time = 100
        const succs = []
        const fails = []
        const Timeout = []

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 1000
        }

        // 定义函数用于发送请求
        const sendRequest = async (url) => {
            try {
                const response = await fetch(url, options)
                const data = await response.json()
                return data
            } catch (error) {
                throw new Error(`请求错误: ${error.message}`)
            }
        }

        // 定义函数用于批量请求
        const batchRequest = async (urls) => {
            for (const url of urls) {
                try {
                    const uid = url.match(/uid=(\d+)/)[1]
                    // 使用Promise.race来添加超时错误处理
                    const result = await Promise.race([
                        sendRequest(url),
                        new Promise((_, reject) => setTimeout(() => reject(new Error(`超过3秒未响应：${uid}`)), 3000))
                    ])
                    console.log(result)
                    const { succ, fail } = await dispose(result, uid)
                    if (succ.length > 0) succs.push(succ)
                    if (fail.length > 0) fails.push(fail)

                    const s = Timeout.length + fails.length + succs.length
                    time = s % 100 === 0 ? 1000 : 100
                    if ((Timeout.length + fails.length) >= 50) return console.log("错误超过50，以停止后续请求")

                    // 使用setTimeout来处理请求间隔，间隔时间为150
                    await new Promise(resolve => setTimeout(resolve, time))
                } catch (error) {
                    // console.error(error.message)
                    Timeout.push(error.message)
                }

            }
            if (urls.length === (Timeout.length + fails.length + succs.length)) {
                console.log("succs:", succs)
                console.log("fails:", fails)
                console.log("Timeout:", Timeout)
            }
        }
        batchRequest(urls)
    }
}




/** 生日邮件 */
const cfg = Yaml.parse(fs.readFileSync(`${config}/birthdaymail.yaml`, 'utf8'))
const expressions = Object.keys(cfg).map((key) => {
    const [month, day] = key.split('-')
    return `01 00 ${day} ${month} *`
})

expressions.forEach((expression) => {
    schedule.scheduleJob(expression, async () => {
        await 生日邮件()
    })
})


async function 生日邮件() {
    const cfg = Yaml.parse(fs.readFileSync(`${config}/birthday.yaml`, 'utf8'))
    const date = `${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate()}`

    for (const key in cfg) {
        const { mode, ip, port, region, sign } = cfg[key]
        if (!mode) continue

        let now = Math.floor(Date.now() / 1000)
        const mail = Yaml.parse(fs.readFileSync(`${config}/birthdaymail.yaml`, 'utf8'))

        const birthday = mail[date]
        for (const keys in birthday) {
            logger.mark(`检测到今天是${keys}生日...开始发送邮件`)
            let uids
            let filecontent = ''
            const sender = keys
            const title = birthday[keys].标题
            const content = birthday[keys].内容
            const item_list = birthday[keys].奖励

            const cfgfile = Yaml.parse(fs.readFileSync(`${data}/group/${key}/config.yaml`, 'utf8'))
            const stream = fs.createReadStream(`${data}/alluid/${cfgfile.server.ip}-${cfgfile.server.port}.yaml`, 'utf8')
            stream.on('data', (chunk) => { filecontent += chunk })
            await new Promise((resolve, reject) => {
                stream.on('end', () => {
                    const parsedContent = Yaml.parse(filecontent)
                    uids = parsedContent
                    resolve()
                })

                stream.on('error', (error) => {
                    logger.mark("读取文件错误", error)
                    reject(error)
                })
            })

            const batchSize = 100 // 每批次发送的请求数量
            const interval = 500 // 发送请求的时间间隔
            const messages = []
            const succ = []
            const fail = []
            let errorCount = 0
            let responseCount = 0

            for (let i = 0; i < uids.length; i += batchSize) {
                const batch = uids.slice(i, i + batchSize)
                const requests = batch.map(id => {
                    const original = {
                        cmd: '1005',
                        uid: id,
                        region: region,
                        config_id: '0',
                        content: content,
                        expire_time: (now + (30 * 24 * 60 * 60)).toString(),
                        importance: '0',
                        is_collectible: "true",
                        item_limit_type: '1',
                        item_list: item_list,
                        source_type: '0',
                        tag: '0',
                        sender: sender,
                        title: title,
                        ticket: `Zyy${now}`,
                    }
                    const url = Object.keys(original)
                        .sort()
                        .map(key => `${key}=${original[key]}`)
                        .join('&')

                    const newsign = `&sign=` + crypto.createHash('sha256').update(url + sign).digest('hex')

                    const options = {
                        host: ip,
                        port: port,
                        path: `/api?${encodeURI(url)}${newsign}`,
                        method: 'GET',
                        headers: {
                            'Host': `${ip}:${port}`
                        },
                        timeout: 10000
                    }
                    return new Promise((resolve, reject) => {
                        const req = http.request(options, res => {
                            let data = ''
                            res.on('data', chunk => {
                                data += chunk
                            })
                            res.on('end', () => {
                                resolve(data)
                            })
                        })
                        req.setTimeout(100000, () => {
                            req.abort()
                        })
                        req.on('error', error => {
                            logger.mark(`请求错误:`, error)
                            reject(error)
                        })
                        req.end()
                    })
                })
                try {
                    const responses = await Promise.allSettled(requests)
                    for (const response of responses) {
                        if (response.status === 'fulfilled') {
                            const data = JSON.parse(response.value)
                            const retcode = data.retcode
                            if (retcode === 0) {
                                succ.push(`\n成功 -> ${data.uid}`)
                            }
                            else if (retcode === -1) {
                                fail.push(`失败 -> 发生未知错误`)
                            }
                            else if (retcode === 617) {
                                fail.push(`失败 -> 物品数量超限`)
                            }
                            else if (retcode === 1002) {
                                fail.push(`失败 -> ${data.msg.replace(/para error/g, '段落错误')}`)
                            }
                            else if (retcode === 1003) {
                                fail.push(`失败 -> 服务器验证签名错误`)
                            }
                            else if (retcode === 1010) {
                                fail.push(`失败 -> 服务器区服错误`)
                            }
                            else if (retcode === 1311) {
                                fail.push(`失败 -> 禁止发送「创世结晶」`)
                            }
                            else if (retcode === 1312) {
                                fail.push(`失败 -> 游戏货币超限`)
                            }
                            else if (retcode === 2006) {
                                fail.push(`失败 -> 禁止重复发送邮件`)
                            }
                            else if (retcode === 2028) {
                                fail.push(`失败 -> 邮件日期设置错误，请修改[expire_time]`)
                            }
                            else {
                                fail.push(`失败 -> 请把此内容反馈给作者\n反馈内容：[msg:${data.msg} retcode:${data.retcode}]`)
                            }
                            messages.push({ id: data.uid, status: retcode })
                        } else {
                            logger.mark(`请求错误:`, response.reason)
                            errorCount++
                        }
                    }

                    responseCount += responses.length
                    if (fail.length > 50) {
                        logger.mark(`\n失败过多\n失败原因：\n${fail.slice(0, 10).join('\n')}\n失败原因仅展示前10个，完整请前往控制台查看\n当前批次请求错误数量超过50，已停止后续所有请求`)
                        logger.mark('当前批次请求错误数量超过50，停止后续所有请求')
                        break
                    }

                    // 1000个请求暂停发送响应
                    if (responseCount >= 1000) {
                        if (fail.length > 0) {
                            logger.mark(`生日邮件发送中...\n玩家数量：${uids.length}\n请求成功：${messages.length}\n请求失败：${errorCount}\n发送成功：${succ.length}\n发送失败:${fail.length}\n失败原因：\n${fail.slice(0, 10).join('\n')}\n失败原因仅展示前10个，完整原因请前往控制台查看`)
                        }
                        else {
                            logger.mark(`生日邮件发送中...\n玩家数量：${uids.length}\n请求成功：${messages.length}\n请求失败：${errorCount}\n发送成功：${succ.length}\n发送失败:${fail.length}`)
                        }
                        responseCount = 0
                        await new Promise(resolve => setTimeout(resolve, 10000)) // 等待10秒钟
                    }
                } catch (error) {
                    logger.mark.error(`请求错误:`, error)
                    errorCount++
                }
                if (i + batchSize < uids.length) {
                    await new Promise(resolve => setTimeout(resolve, interval))
                }
            }
            logger.mark(`失败原因：`, fail)
            logger.mark(`服务器 ${ip} 生日邮件发送完毕...\n玩家数量：${uids.length}\n请求成功：${messages.length}\n请求失败：${errorCount}\n发送成功：${succ.length}\n发送失败:${fail.length}`)
            now++
        }
    }
}



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
        1002: `失败 -> ${data.msg.replace(/para error/g, '段落错误')}`,
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
        "-1": "失败 -> 发生未知错误"
    }
    if (retcode === 0) {
        succ.push(`成功：${datamsg}  ->  ${uid}`)
    } else if (ErrorCode.hasOwnProperty(retcode)) {
        fail.push(ErrorCode[retcode])
    } else {
        fail.push(`失败 -> 请把此内容反馈给作者\nUID:${uid}\n反馈内容：\n${data}`)
    }
    return { succ, fail }
}