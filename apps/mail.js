import fs from 'fs'
import http from 'http'
import Yaml from 'yaml'
import crypto from 'crypto'
import { mail } from './rule.js'
import schedule from 'node-schedule'
import plugin from '../../../lib/plugins/plugin.js'
import { getmode, getserver, getuid, getScenes, getmail, getadmin, getintercept, getpath } from './index.js'

let state = true
const { data, config } = await getpath()

export class mails extends plugin {
    constructor() {
        super({
            name: 'mail',
            dsc: '邮件相关',
            event: 'message',
            priority: -100,
            rule: mail
        })
    }

    async 邮件(e) {
        const { mail } = await getmode(e)
        if (!mail) return
        const { gioadmin } = await getadmin(e)
        if (!e.isMaster && !gioadmin) {
            const { intercept } = await getintercept(e)
            if (!intercept) return
        }
        const { uid } = await getuid(e)
        if (!uid) return
        const mode = "mail"
        getmail(e, mode)

    }

    async 全服邮件(e) {
        // 全服邮件需要单独处理并发请求...不弄整合了...
        const { mail } = await getmode(e)
        if (!mail) {
            console.log("邮件功能未开启")
            return
        }
        const { scenes } = await getScenes(e)
        const { gioadmin } = await getadmin(e)
        if (!gioadmin && !e.isMaster) {
            e.reply(`只有管理大大才能命令我哦~\n(*/ω＼*)`)
            return
        }
        if (state === false) {
            e.reply([segment.at(e.user_id), `全服邮件还在发送中...请勿重复触发...`])
            return
        }

        state = false
        e.reply([segment.at(e.user_id), `正在执行...预计需要10-20分钟...`])
        const { ip, port, region, sign, ticketping, mailsender } = await getserver(e)

        const cfg = Yaml.parse(fs.readFileSync(`${config}/mail.yaml`, 'utf8'))
        const msg = e.msg.split(' ')
        let uids
        let title = msg[1]
        let content = msg[2]
        let item_list = msg[3]
        let filecontent = ''

        const config = Yaml.parse(fs.readFileSync(`${data}/group/${scenes}/config.yaml`, 'utf8'))
        const stream = fs.createReadStream(`${data}/alluid/${config.server.ip}-${config.server.port}.yaml`, 'utf8')
        stream.on('data', (chunk) => { filecontent += chunk })
        await new Promise((resolve, reject) => {
            stream.on('end', () => {
                const parsedContent = Yaml.parse(filecontent)
                uids = parsedContent
                resolve()
            })

            stream.on('error', (error) => {
                logger.mark.log("读取文件错误", error)
                reject(error)
            })
        })

        let foundTemplate = false
        for (const key in cfg) {
            const obj = cfg[key]
            const names = obj[0].names
            if (names && names.includes(msg[1])) {
                title = obj[1].title
                content = obj[2].content
                item_list = obj[3].item_list
                foundTemplate = true
                break
            }
        }
        if (!foundTemplate) {
            if (msg.length < 4) {
                e.reply([segment.at(e.user_id), `邮件格式错误\n\n格式：全服邮件 [标题] [内容] [ID:数量,ID:数量]\n举例：邮件 测试 你好 201:1`])
                return
            }
        }

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
                    expire_time: ((Math.floor(Date.now() / 1000)) + (30 * 24 * 60 * 60)).toString(),
                    importance: '0',
                    is_collectible: "false",
                    item_limit_type: '1',
                    item_list: item_list,
                    source_type: '0',
                    tag: '0',
                    sender: mailsender,
                    title: title,
                    ticket: ticketping,
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
                    timeout: 100000
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
                    this.reply([segment.at(e.user_id), `\n失败过多\n失败原因：\n${fail.slice(0, 10).join('\n')}\n失败原因仅展示前10个，完整请前往控制台查看\n当前批次请求错误数量超过50，已停止后续所有请求`])
                    logger.mark('当前批次请求错误数量超过50，停止后续所有请求')
                    break
                }

                // 1000个请求暂停发送响应
                if (responseCount >= 1000) {
                    if (fail.length > 0) {
                        this.reply(`全服邮件发送中...\n玩家数量：${uids.length}\n请求成功：${messages.length}\n请求失败：${errorCount}\n发送成功：${succ.length}\n发送失败:${fail.length}\n失败原因：\n${fail.slice(0, 10).join('\n')}\n失败原因仅展示前10个，完整原因请前往控制台查看`)
                    }
                    else {
                        this.reply(`全服邮件发送中...\n玩家数量：${uids.length}\n请求成功：${messages.length}\n请求失败：${errorCount}\n发送成功：${succ.length}\n发送失败:${fail.length}`)
                    }
                    responseCount = 0
                    await new Promise(resolve => setTimeout(resolve, 10000)) // 等待10秒钟
                }
            } catch (error) {
                logger.mark(`请求错误:`, error)
                errorCount++
            }
            if (i + batchSize < uids.length) {
                await new Promise(resolve => setTimeout(resolve, interval))
            }
        }
        logger.mark(`发送完毕，共发送了 ${uids.length} 个请求，其中成功了 ${messages.length} 个，失败了 ${errorCount} 个`)
        logger.mark(`失败原因：`, fail)
        this.reply([segment.at(e.user_id), `\n全服邮件发送完毕...\n玩家数量：${uids.length}\n请求成功：${messages.length}\n请求失败：${errorCount}\n发送成功：${succ.length}\n发送失败:${fail.length}`])
        state = true
        return messages
    }
}

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

            const config = Yaml.parse(fs.readFileSync(`${data}/group/${key}/config.yaml`, 'utf8'))
            const stream = fs.createReadStream(`${data}/alluid/${config.server.ip}-${config.server.port}.yaml`, 'utf8')
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