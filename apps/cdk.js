import plugin from '../../../lib/plugins/plugin.js'
import http from 'http'
import fs from 'fs'
import crypto from 'crypto'
import Yaml from 'yaml'
import { cdk } from './rule.js'
import { getmode, getserver, getuid, getScenes } from './index.js'
let _path = process.cwd() + '/plugins/Zyy-GM-plugin/config'

export class hk4e extends plugin {
    constructor() {
        super({
            name: 'hk4e-GM',
            dsc: 'hk4e-游戏指令',
            event: 'message',
            priority: -50,
            rule: cdk
        })
    }

    async 签到(e) {
        const { mode } = await getmode(e) || {}
        if (!mode) return
        if (mode === 'CheckIns') {
            const { uid } = await getuid(e)
            const { scenes } = await getScenes(e)
            const { ip, port, region, sign, ticketping, sender, title, content } = await getserver(e)
            const CheckIns = Yaml.parse(fs.readFileSync(_path + '/CheckIns.yaml', 'utf8'))
            const players = Yaml.parse(fs.readFileSync(_path + '/players.yaml', 'utf8'))
            const getNow = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
            let date = null

            if (!players[scenes][e.user_id]) {
                players[scenes][e.user_id] = {
                    total_signin_count: 0,
                    last_signin_time: "1999-12-12 00:00:00"
                }
                fs.writeFileSync(_path + '/players.yaml', Yaml.stringify(players))
            }

            const checkInSum = players[scenes][e.user_id].total_signin_count
            const logTime = players[scenes][e.user_id].last_signin_time
            if (logTime.slice(0, 10) === getNow.slice(0, 10)) {
                date = 0
                e.reply([segment.at(e.user_id), `\n今日已签到\n累计签到：${checkInSum} 天\n签到时间：${logTime}`])
                return date
            }

            date = checkInSum + 1
            const config_id = '0'
            const now = Math.floor(Date.now() / 1000)
            const thirtyDaysLater = now + (30 * 24 * 60 * 60)
            const expire_time = thirtyDaysLater.toString()
            const importance = '0'
            const tag = '0'
            const source_type = '0'
            const item_limit_type = '1'
            const is_collectible = "false"

            const item_list = CheckIns.CheckIns[date].item_list
            const name = CheckIns.CheckIns[date].name

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
                            const data = JSON.parse(rawData)
                            resolve(data)
                            if (data) {
                                const retcode = data.retcode
                                if (retcode === 0) {
                                    players[scenes][e.user_id].total_signin_count = checkInSum + 1
                                    players[scenes][e.user_id].last_signin_time = getNow
                                    fs.writeFileSync(_path + '/players.yaml', Yaml.stringify(players))
                                    e.reply([segment.at(e.user_id), `\n签到成功\n当前UID：${parseInt(data.data.uid)}\n累计签到：${checkInSum + 1} 天\n签到时间：${getNow} \n签到物品：${name}`])
                                }
                                else {
                                    e.reply([segment.at(e.user_id), `邮件发送失败\n请联系管理员更改签到物品`])
                                }
                            }
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
                    this.reply(`签到失败，网络发生错误，请重试`)
                })
                req.end()
            })
        }
    }
}
