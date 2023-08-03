import fs from 'fs'
import Yaml from 'yaml'
import crypto from 'crypto'
import fetch from 'node-fetch'
const { data, config } = global.ZhiYu

/** 构建自定义请求参数，计算sign */
export async function ComputeGM(signkey, sign) {
    const base = Object.keys(signkey).sort().map(key => `${key}=${signkey[key]}`).join('&')
    const newsign = `&sign=` + crypto.createHash('sha256').update(base + sign).digest('hex')
    return `${encodeURI(base)}${newsign}`
}

/** 构建邮件请求参数，计算sign */
export async function ComputeMail(uid, region, content, expire_time, item_list, sender, title, ticket, sign) {

    let signkey = {
        cmd: '1005',
        uid: uid,
        region: region,
        config_id: '0',
        content: content,
        expire_time: expire_time,
        importance: '0',
        is_collectible: "false",
        item_limit_type: '1',
        item_list: item_list,
        source_type: '0',
        tag: '0',
        sender: sender,
        title: title,
        ticket: ticket,
    }

    const base = Object.keys(signkey).sort().map(key => `${key}=${signkey[key]}`).join('&')
    const newsign = `&sign=` + crypto.createHash('sha256').update(base + sign).digest('hex')
    /** 单独编码 邮件参数可能存在特殊字符 */
    signkey.content = encodeURIComponent(signkey.content)
    signkey.item_list = encodeURIComponent(signkey.item_list)
    signkey.sender = encodeURIComponent(signkey.sender)
    signkey.title = encodeURIComponent(signkey.title)

    const bases = Object.keys(signkey).sort().map(key => `${key}=${signkey[key]}`).join('&')
    return `${bases}${newsign}`
}

/** 向MuipServer发送请求 */
export async function Request(e = {}, mode, urls = [], uid) {
    const fetchResults = [].concat(urls).map((url, index) => {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('超过1秒未响应，中断请求'))
            }, 1000)
        })

        const fetchPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                fetch(url)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            }, index * 150)
        })
        return Promise.race([fetchPromise, timeoutPromise])
    })

    const succ = []
    const fail = []
    const trss = e.group_id.toString().replace("qg_", "")
    const scenes = e.group_name === "频道插件" ? `${e.group_id}-${e.member.info.group_id}` : trss

    Promise.all(fetchResults)
        .then(responses => {
            responses.forEach(response => {
                1202
                if (response.ok) {
                    response.json()
                        .then(outcome => {
                            const retcode = outcome.retcode
                            if (retcode !== 0) {
                                logger.mark(`[error-command][${e.sender.card || e.sender.nickname}(${e.user_id.toString().replace("qg_", "")}-${uid})][${JSON.stringify(outcome).replace(/[{}]/g, '')}]`)
                            }
                            let datamsg = outcome.data?.msg || {}

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
                                1002: `失败 -> ${outcome.msg.replace(/para error/g, '参数错误')}`,
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
                                "-1": "", // 添加空字符串作为默认处理消息
                            }

                            if (retcode === 0) {
                                const modelist = {
                                    "在线玩家": () => e.reply(ping(outcome.data)),
                                    "子服": () => e.reply(SubService(outcome.data)),
                                    "封禁": () => e.reply(Banned(e, uid)),
                                    "邮件": () => succ.push(`成功  ->  ${uid}`),
                                }

                                if (modelist.hasOwnProperty(mode)) {
                                    modelist[mode]()
                                } else {
                                    succ.push(`成功：${datamsg}  ->  ${uid}`)
                                }
                            } else if (ErrorCode.hasOwnProperty(retcode)) {
                                if (retcode === -1) {
                                    fail.push(ErrorMinusOne(outcome, uid))
                                } else {
                                    fail.push(ErrorCode[retcode])
                                }
                            } else {
                                fail.push(`失败 -> 请把此内容反馈给作者\nUID:${uid}\n反馈内容：\n${JSON.stringify(outcome)}`)
                            }

                            if (urls.length === (succ.length + fail.length)) {
                                if (mode === "兑换码") {
                                    e.reply(cdk(e, succ, fail, scenes, uid))
                                }
                                else if (mode === "签到") {
                                    e.reply(checkins(e, scenes, uid))
                                } else {
                                    e.reply(restall(e, succ, fail))
                                }
                            }
                        })
                } else {
                    console.error('请求失败')
                }
            })
        })
        .catch(error => {
            if (error.message === "超过1秒未响应，中断请求") {
                /** 其实还有一种情况 如果muipserver关了，同样会被中断请求 */
                e.reply([segment.at(e.user_id), `\nUID：${uid}\n走开，你都不在线 ￣へ￣`])
            } else {
                e.reply("发生未知错误，请前往控制台查看日志")
                console.error(error.message)
            }
        })
}

/** 处理状态码 -1 */
function ErrorMinusOne(outcome, uid) {
    const msg = outcome.data.retmsg
    if (msg) {
        const newmsg = msg
            .replace(/can't find gm command/g, '找不到GM命令')
            .replace(/command/g, '命令')
            .replace(/execute fails/g, '执行失败')
            .replace(/invalid param/g, '无效参数')
        return `失败：${outcome.data.msg} -> ${uid}\n原因：${newmsg}`
    } else {
        return "发生未知错误，请检查指令"
    }
}

/** 在线玩家 */
function ping(cfg) {
    const { online_player_num, platform_player_num } = cfg
    const classify = platform_player_num
    return `(〃'▽'〃)\n在线人数：${online_player_num}\nPC：${classify.PC}\nAndroid：${classify.ANDROID}\nIOS：${classify.IOS}`
}

/** 子服 */
function SubService(cfg) {
    const games = cfg.gameserver_player_num
    const players = Object.entries(games)
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => {
            const keyA = a.key.split('.').map(parseFloat)
            const keyB = b.key.split('.').map(parseFloat)
            for (let i = 0; i < Math.min(keyA.length, keyB.length); i++) {
                if (keyA[i] !== keyB[i]) return keyA[i] - keyB[i]
            }
            return keyA.length - keyB.length
        })
        .map(({ key, value }) => `${key}：${value}`).join('\n')
    return `game数量：${Object.keys(games).length}\n详细人数：\n${players}`
}

/** 通用状态处理 */
function restall(e, succ, fail) {
    if (succ.length === 0) {
        return [segment.at(e.user_id), `\n${fail.join('\n')}`]
    } else if (fail.length === 0) {
        return [segment.at(e.user_id), `\n${succ.join('\n')}`]
    } else {
        return [segment.at(e.user_id), `\n${succ.join('\n')}\n\n${fail.join('\n')}`]
    }
}

/** 兑换码 */
function cdk(e, succ, fail, scenes, uid) {
    /** 如果储存成功跟失败的数组同时存在值，只要成功一个都算兑换成功(一般很少发生) */
    if (succ.length > 0) {
        const name = e.msg.replace(/兑换|\/兑换/g, '').trim()

        let file = `${data}/group/${scenes}/cdk/自定义/${name}.yaml`
        if (name.length === 32) {
            file = `${data}/group/${scenes}/cdk/批量生成/${name}.yaml`
        }

        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))

        let actiontype = "在线GM发放\n备注：自动发放至背包"
        if (cfg.actiontype === "mail") {
            actiontype = "邮件发放\n备注：请在游戏内打开邮箱领取"
        }

        const Reply = [segment.at(e.user_id), `\n兑换成功\nUID：${uid}\n发放方式：${actiontype}`]
        /** 读取兑换码的可使用次数+1是否等于总使用次数 */
        if (cfg.redeemlimit <= (Number(cfg.used) + 1)) {
            /** 次数用尽后删除文件 */
            fs.unlink(file, (err) => {
                if (err) {
                    console.error("删除文件错误：", err)
                    return "发生未知错误，请前往控制台查看"
                }
                console.log(`兑换码可使用次数为0，已删除文件：${file} `)
            })
            return Reply
        } else {
            /** 这里处理自定义兑换码 */
            cfg.used += 1
            cfg.uid[uid] = Number(cfg.uid[uid]) + 1 || 1
            fs.writeFileSync(file, Yaml.stringify(cfg), 'utf8')
            return Reply
        }
    } else {
        return [segment.at(e.user_id), `\n兑换失败\n${fail.join('\n')}`]
    }
}

/** 签到 */
function checkins(e, scenes, uid) {
    const file = `${data}/user/${e.user_id.toString().replace("qg_", "")}.yaml`
    const CheckIns = Yaml.parse(fs.readFileSync(config + '/items.yaml', 'utf8'))
    const players = Yaml.parse(fs.readFileSync(file, 'utf8'))
    const getNow = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
    let checkInSum = players[scenes].total_signin_count + 1
    const name = CheckIns.CheckIns[checkInSum].name
    players[scenes].total_signin_count = checkInSum
    players[scenes].last_signin_time = getNow
    fs.writeFileSync(file, Yaml.stringify(players))
    return [segment.at(e.user_id), `\n签到成功\n当前UID：${uid}\n累计签到：${checkInSum} 天\n签到时间：${getNow} \n签到物品：${name}`]
}

/** 封禁玩家 */
function Banned(e, signkey) {
    let Reply = [segment.at(e.user_id), `\n封禁成功\n封禁玩家：${signkey.uid}\n封禁原因：${signkey.msg}\n解禁时间：${signkey.end_time}`]
    if (e.msg.includes("解")) {
        Reply = [segment.at(e.user_id), `已解除玩家 ${signkey.uid} 的封禁`]
    }
    return Reply
}

