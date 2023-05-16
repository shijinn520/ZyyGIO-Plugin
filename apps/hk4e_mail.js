import plugin from '../../../lib/plugins/plugin.js'
import http from 'http'
import Yaml from 'yaml'
import fs from 'fs'
import crypto from 'crypto'
import { mail } from './rule.js'
import { getmode, getserver, getuid, getScenes } from './index.js'

let state = true
let _path = process.cwd() + '/plugins/Zyy-GM-plugin/config'

export class hk4e extends plugin {
    constructor() {
        super({
            name: 'hk4e-邮件',
            dsc: 'hk4e-邮件',
            event: 'message',
            priority: -100,
            rule: mail
        })
    }

    async 邮件(e) {
        const { mode } = await getmode(e) || {}
        if (!mode) return
        const maxRetries = 3
        let retries = 0
        let disposition
        let msglength = true
        let result = null
        if (mode === 'gm') {
            e.reply([segment.at(e.user_id), `\n正在处理...请稍后...`])
            const { mode } = await getmode(e) || {}
            if (!mode) return
            const { uid } = await getuid(e)
            if (mode === false || mode === undefined) {
                console.log(`重试请求已停止，因为GM的状态为 ${mode}。`)
                return
            } else if (uid === undefined) {
                console.log(`此用户未绑定UID，已停止重试`)
                return
            }

            while (retries < maxRetries) {
                try {
                    disposition = await makeRequest()
                    if (msglength === false) {
                        break
                    }
                    if (disposition) {
                        result = disposition
                        break
                    }
                } catch (error) {
                    console.error(`第 ${retries + 1} 次请求失败：${error.message}`)
                    console.error(`请求失败->正在重试->(${retries + 1} / ${maxRetries})`)
                }
                retries++
                if (retries === maxRetries) {
                    e.reply([segment.at(e.user_id), '请求全部失败，请检查你的在线状态、UID是否正确'])
                }
            }

            if (disposition) {
                const retcode = disposition.retcode
                if (retcode === 0) {
                    const dispositionuid = parseInt(disposition.data.uid)
                    e.reply([segment.at(e.user_id), `\n成功 -> ${dispositionuid}`])
                }
                else if (retcode === -1) {
                    e.reply([segment.at(e.user_id), `\n失败 -> 发生未知错误，请检查指令`])
                }
                else if (retcode === 617) {
                    e.reply([segment.at(e.user_id), `\n失败 -> 邮件物品超过限制`])
                }
                else if (retcode === 1002) {
                    e.reply([segment.at(e.user_id), `\n失败 -> ${disposition.msg.replace(/para error/g, '段落错误')}`])
                }
                else if (retcode === 1003) {
                    e.reply([segment.at(e.user_id), `\n失败 -> 服务器验证签名错误`])
                }
                else if (retcode === 1010) {
                    e.reply([segment.at(e.user_id), `\n失败 -> 服务器区服错误`])
                }
                else if (retcode === 1311) {
                    e.reply([segment.at(e.user_id), `\n失败 -> 禁止发送「创世结晶」`])
                }
                else if (retcode === 1312) {
                    e.reply([segment.at(e.user_id), `\n失败 -> 游戏货币超限`])
                }
                else if (retcode === 1316) {
                    e.reply([segment.at(e.user_id), `\n失败 -> 游戏货币超限`])
                }
                else if (retcode === 2006) {
                    fail.push(`失败 -> 禁止重复发送邮件`)
                }
                else if (retcode === 2028) {
                    e.reply([segment.at(e.user_id), `\n失败 -> 邮件日期设置错误，请修改[expire_time]`])
                }
                else {
                    e.reply([segment.at(e.user_id), `\n失败 -> 请把此内容反馈给作者\n反馈内容：[msg:${disposition.msg} retcode:${disposition.retcode}]`])
                }
            }

            async function makeRequest() {
                const { uid } = await getuid(e)
                const { ip, port, region, sign, ticketping, sender } = await getserver(e)
                const config_id = '0'
                const now = Math.floor(Date.now() / 1000)
                const thirtyDaysLater = now + (30 * 24 * 60 * 60)
                const expire_time = thirtyDaysLater.toString()
                const importance = '0'
                const tag = '0'
                const source_type = '0'
                const item_limit_type = '1'
                const is_collectible = "false"

                const mail = Yaml.parse(fs.readFileSync(_path + '/mail.yaml', 'utf8'))
                const msg = e.msg.split(' ')
                let title = msg[1]
                let content = msg[2]
                let item_list = msg[3]
                let foundTemplate = false

                for (const key in mail) {
                    const obj = mail[key]
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
                        e.reply([segment.at(e.user_id), `邮件格式错误\n\n格式：邮件 [标题] [内容] [ID:数量,ID:数量]\n举例：邮件 测试 你好 201:1`])
                        msglength = false
                        return msglength
                    }
                    console.log('没有找到匹配的邮件模板')
                }

                const signingkey = {
                    cmd: '1005',
                    uid: uid,
                    region: region,
                    config_id: config_id,
                    content: content,
                    expire_time: expire_time,
                    importance: importance,
                    is_collectible: is_collectible,
                    item_limit_type: item_limit_type,
                    item_list: item_list,
                    source_type: source_type,
                    tag: tag,
                    sender: sender,
                    title: title,
                    ticket: ticketping,
                }
                const sortedParams = Object.keys(signingkey)
                    .sort()
                    .map(key => `${key}=${signingkey[key]}`)
                    .join('&')
                const signStr = sortedParams + sign
                const newsign = `&sign=` + crypto.createHash('sha256').update(signStr).digest('hex')

                const original = {
                    cmd: '1005',
                    uid: uid,
                    region: region,
                    config_id: config_id,
                    content: encodeURIComponent(content),
                    expire_time: expire_time,
                    importance: importance,
                    is_collectible: is_collectible,
                    item_limit_type: item_limit_type,
                    item_list: item_list,
                    source_type: source_type,
                    tag: tag,
                    sender: encodeURIComponent(sender),
                    title: encodeURIComponent(title),
                    ticket: ticketping,
                }
                const parameter = Object.keys(original)
                    .sort()
                    .map(key => `${key}=${original[key]}`)
                    .join('&')
                return new Promise((resolve, reject) => {
                    const options = {
                        host: ip,
                        port: port,
                        path: `/api?${parameter}${newsign}`,
                        method: 'GET',
                        headers: {
                            'Host': `${ip}:${port}`
                        },
                        timeout: 1000
                    }

                    const req = http.request(options, (res) => {
                        res.setEncoding('utf8')
                        let rawData = ''
                        res.on('data', (chunk) => {
                            rawData += chunk
                        })
                        res.on('end', () => {
                            console.log(`完整响应主体: ${rawData}`)
                            try {
                                const disposition = JSON.parse(rawData)
                                resolve(disposition, msglength)
                            } catch (error) {
                                reject(`解析响应数据时出错：${error.message}`)
                            }

                        })
                    })
                    req.setTimeout(1000, () => {
                        req.abort()
                    })
                    req.on('error', (e) => {
                        console.error(`请求错误: ${e.message}`)
                        reject(new Error(`哇!连接超时啦!o(╥﹏╥)o`))
                    })
                    req.end()
                })
            }
        }
    }

    async 全服邮件(e) {
        const { mode } = await getmode(e) || {}
        if (!mode) return
        if (mode === 'gm') {
            const config = Yaml.parse(fs.readFileSync(_path + '/config.yaml', 'utf8'))
            const { scenes } = await getScenes(e)
            const admin = config[scenes]?.Administrator
            if (!admin || !admin.includes(e.user_id.toString())) {
                e.reply(`只有管理大大才能命令我哦~\n(*/ω＼*)`)
                return
            }
            if (state === false) {
                e.reply([segment.at(e.user_id), `全服邮件还在发送中...请勿重复触发...`])
                return
            }

            state = false
            e.reply([segment.at(e.user_id), `正在执行...预计需要10-20分钟...`])
            const { ip, port, region, sign, ticketping, sender } = await getserver(e)
            const config_id = '0'
            const now = Math.floor(Date.now() / 1000)
            const thirtyDaysLater = now + (30 * 24 * 60 * 60)
            const expire_time = thirtyDaysLater.toString()
            const importance = '0'
            const tag = '0'
            const source_type = '0'
            const item_limit_type = '1'
            const is_collectible = "false"

            const mail = Yaml.parse(fs.readFileSync(_path + '/mail.yaml', 'utf8'))
            const cfg = Yaml.parse(fs.readFileSync(_path + '/full_server_mail.yaml', 'utf8'))
            const uid = cfg[scenes]

            const msg = e.msg.split(' ')
            let title = msg[1]
            let content = msg[2]
            let item_list = msg[3]
            let foundTemplate = false

            for (const key in mail) {
                const obj = mail[key]
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
                    e.reply([segment.at(e.user_id), `邮件格式错误\n\n格式：邮件 [标题] [内容] [ID:数量,ID:数量]\n举例：邮件 测试 你好 201:1`])
                    msglength = false
                    return msglength
                }
                console.log('没有找到匹配的邮件模板')
            }
            const signingkey = {
                cmd: '1005',
                uid: uid,
                region: region,
                config_id: config_id,
                content: content,
                expire_time: expire_time,
                importance: importance,
                is_collectible: is_collectible,
                item_limit_type: item_limit_type,
                item_list: item_list,
                source_type: source_type,
                tag: tag,
                sender: sender,
                title: title,
                ticket: ticketping,
            }
            const sortedParams = Object.keys(signingkey).sort().map(key => `${key}=${signingkey[key]}`).join('&')
            const signStr = sortedParams + sign
            const newsign = `&sign=` + crypto.createHash('sha256').update(signStr).digest('hex')
            const original = {
                cmd: '1005',
                region: region,
                config_id: config_id,
                content: encodeURIComponent(content),
                expire_time: expire_time,
                importance: importance,
                is_collectible: is_collectible,
                item_limit_type: item_limit_type,
                item_list: item_list,
                source_type: source_type,
                tag: tag,
                sender: encodeURIComponent(sender),
                title: encodeURIComponent(title),
                ticket: ticketping,
            }
            const parameter = Object.keys(original).sort().map(key => `${key}=${original[key]}`).join('&')
            const batchSize = 100 // 每批次发送的请求数量
            const interval = 500 // 发送请求的时间间隔
            const messages = []
            const succ = []
            const fail = []
            let errorCount = 0
            let responseCount = 0



            for (let i = 0; i < uid.length; i += batchSize) {
                const batch = uid.slice(i, i + batchSize)
                const requests = batch.map(id => {
                    const options = {
                        host: ip,
                        port: port,
                        path: `/api?${parameter}&uid=${id}${newsign}`,
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
                            console.error(`请求错误:`, error)
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
                            // console.log(`完整响应主体: ${response.value}`) // 如需调试，请取消注释此行
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
                            console.error(`请求错误:`, response.reason)
                            errorCount++
                        }
                    }

                    responseCount += responses.length
                    if (fail.length > 50) {
                        this.reply([segment.at(e.user_id), `\n失败过多\n失败原因：\n${fail.slice(0, 10).join('\n')}\n失败原因仅展示前10个，完整请前往控制台查看\n当前批次请求错误数量超过50，已停止后续所有请求`])
                        console.error('当前批次请求错误数量超过50，停止后续所有请求')
                        break
                    }

                    // 1000个请求暂停发送响应
                    if (responseCount >= 1000) {
                        if (fail.length > 0) {
                            this.reply(`全服邮件发送中...\n玩家数量：${uid.length}\n请求成功：${messages.length}\n请求失败：${errorCount}\n发送成功：${succ.length}\n发送失败:${fail.length}\n失败原因：\n${fail.slice(0, 10).join('\n')}\n失败原因仅展示前10个，完整原因请前往控制台查看`)
                        }
                        else {
                            this.reply(`全服邮件发送中...\n玩家数量：${uid.length}\n请求成功：${messages.length}\n请求失败：${errorCount}\n发送成功：${succ.length}\n发送失败:${fail.length}`)
                        }
                        responseCount = 0
                        await new Promise(resolve => setTimeout(resolve, 10000)) // 等待10秒钟
                    }
                } catch (error) {
                    console.error(`请求错误:`, error)
                    errorCount++
                }
                if (i + batchSize < uid.length) {
                    await new Promise(resolve => setTimeout(resolve, interval))
                }
            }
            console.log(`发送完毕，共发送了 ${uid.length} 个请求，其中成功了 ${messages.length} 个，失败了 ${errorCount} 个`)
            console.log(`失败原因：`, fail)
            this.reply([segment.at(e.user_id), `\n全服邮件发送完毕...\n玩家数量：${uid.length}\n请求成功：${messages.length}\n请求失败：${errorCount}\n发送成功：${succ.length}\n发送失败:${fail.length}`])
            state = true
            return messages
        }

    }


    async 添加UID(e) {
        // 添加uid添加重复检测
        const { mode } = await getmode(e) || {}
        if (!mode) return
        if (mode === 'gm') {
            const config = Yaml.parse(fs.readFileSync(_path + '/config.yaml', 'utf8'))
            const { scenes } = await getScenes(e)
            const admin = config[scenes]?.Administrator
            if (!admin || !admin.includes(e.user_id.toString())) {
                e.reply(`只有管理大大才能命令我哦~\n(*/ω＼*)`)
                return
            }
            e.reply([segment.at(e.user_id), `正在执行...请稍等...`])
            const cfg = Yaml.parse(fs.readFileSync(_path + '/full_server_mail.yaml', 'utf8'))
            const msg = e.msg.split(' ')

            if (msg.length !== 3) {
                e.reply([segment.at(e.user_id), `格式错误\n格式：添加UID 起始UID 终止UID`])
                return
            }
            if (isNaN(msg[1]) || isNaN(msg[2])) {
                e.reply([segment.at(e.user_id), `输入不合法，请输入纯数字`])
                return
            }
            const start = parseInt(msg[1])
            const end = parseInt(msg[2])

            if (!cfg[scenes]) {
                cfg[scenes] = []
            }
            for (let i = start; i <= end; i++) {
                cfg[scenes].push(i.toString())
            }

            fs.writeFileSync(_path + '/full_server_mail.yaml', Yaml.stringify(cfg))
            e.reply([segment.at(e.user_id), `${start} 到 ${end} 所有的UID已经添加`])
        }
    }


}
