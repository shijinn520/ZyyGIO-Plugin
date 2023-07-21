/*
 * @Author: Zyy.小钰 1072411694@qq.com
 * @Date: 2023-07-17 16:42:35
 * @LastEditors: Zyy.小钰 1072411694@qq.com
 * @LastEditTime: 2023-07-19 23:33:49
 * @FilePath: \Yunzai\plugins\ZhiYu-plugin\apps\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from 'fs'
import Yaml from 'yaml'
import moment from 'moment'
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
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 1000
    }

    const fetchResults = [].concat(urls).map((url, index) => {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('超过1秒未响应，中断请求'))
            }, 1000)
        })

        const fetchPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                fetch(url, options)
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
                if (response.ok) {
                    response.json()
                        .then(outcome => {
                            const retcode = outcome.retcode
                            if (retcode !== 0) {
                                logger.mark(`[error-command][${e.sender.card || e.sender.nickname}(${e.user_id.toString().replace("qg_", "")}-${uid})][${JSON.stringify(outcome).replace(/[{}]/g, '')}]`)
                            }
                            let datamsg = outcome.data?.msg || {}

                            const ErrorCode = {
                                4: `又不在线，再发我顺着网线打死你！╭(╯^╰)╮`,
                                17: `\n失败 -> 账户不存在\nuid：${uid}`,
                                617: `失败：${datamsg}  ->  ${uid}\n原因：数量超出限制`,
                                627: `失败：${datamsg}  ->  ${uid}\n原因：数量超出限制`,
                                1002: `失败 -> ${outcome.msg.replace(/para error/g, '段落错误')}`,
                                1003: `失败，服务器验证签名错误`,
                                1010: `失败，服务器区服不匹配`,
                                1117: `失败 -> 未达到副本要求等级`,
                                1202: `失败 -> 处于多人模式非房主`,
                                1311: `失败 -> 禁止发送「创世结晶」`,
                                1312: `失败 -> 游戏货币超限`,
                                1316: `失败 -> 游戏货币超限`,
                                2006: `失败 -> 禁止重复发送邮件`,
                                2028: `失败 -> 邮件日期设置错误，请修改[expire_time`,
                                8002: `失败，传说钥匙超过限制`,
                                "-1": "", // 添加空字符串作为默认处理消息
                            }

                            if (retcode === 0) {
                                const modelist = {
                                    "在线玩家": () => e.reply(ping(outcome.data)),
                                    "子服": () => e.reply(SubService(outcome.data)),
                                    "封禁": () => e.reply(Banned(uid)),
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
        .map(([key, value]) => `${parseFloat(key)}：${value}`)
        .sort((a, b) => parseFloat(b.split('：')[0]) - parseFloat(a.split('：')[0]))
        .join('\n')
    return `game数量：${Object.keys(games).length}\n详细人数：\n${players}`
}

/** 通用 */
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
        const name = msg.replace(/兑换|\/兑换/g, '').trim()

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
function Banned(msg) {
    const uid = msg.replace(/[^0-9]/g, "")
    let Reply = [segment.at(e.user_id), `成功封禁玩家${uid}`]
    if (msg.includes("解")) {
        Reply = [segment.at(e.user_id), `已解除玩家 ${uid} 的封禁`]
    }
    return Reply
}





/** 插件功能状态 */
export async function GetState(scenes) {
    const Groupcfg = `${data}/group/${scenes}/config.yaml`
    let GM = false
    let Mail = false
    let birthday = false
    let CheckIns = false
    let generatecdk = false
    let CDK = false
    let State = false
    let UID = false
    let Ban = false

    if (!fs.existsSync(Groupcfg)) {
        console.log(`\x1b[31m[ZhiYu]当前群聊 ${scenes} 未初始化\x1b[0m`)
    } else {
        const cfg = Yaml.parse(fs.readFileSync(Groupcfg, 'utf8'))
        GM = cfg.GM.状态 ? true : false
        Mail = cfg.邮件.状态 ? true : false
        birthday = cfg.生日邮件.状态 ? true : false
        CheckIns = cfg.签到.状态 ? true : false
        generatecdk = cfg.生成cdk.状态 ? true : false
        CDK = cfg.兑换码.状态 ? true : false
        State = cfg.在线玩家.状态 ? true : false
        UID = cfg.UID.状态 ? true : false
        Ban = cfg.封禁.状态 ? true : false
    }

    return { GM, Mail, birthday, CheckIns, generatecdk, CDK, State, UID, Ban }
}


/**
 * qwq生成各种请求参数~
 * @returns {Promise<{
* ticket: "muip请求令牌",
* MailSender: "普通邮件发件人",
* CheckInSender: "每日签到-发件人",
* CheckInTitle: "每日签到-标题",
* CheckInContent: "每日签到-内容",
* CreateKey: "生成cdk密钥",
* CreateGroup: "cdk使用的群聊",
* CdkSender: "cdk兑换-发件人",
* CdkTitle: "cdk兑换-标题",
* CdkContent: "cdk兑换-内容"
* }>}
*/
export async function GetServer(e = {}) {
    const trss = e.group_id.toString().replace("qg_", "")
    const scenes = e.group_name === "频道插件" ? `${e.group_id}-${e.member.info.group_id}` : trss

    let ip = false
    let port = false
    let region = false
    let sign = false
    let ticket = false
    let MailSender = false
    let CheckInSender = false
    let CheckInTitle = false
    let CheckInContent = false
    let CreateKey = false
    let CreateGroup = false
    let CdkSender = false
    let CdkTitle = false
    let CdkContent = false
    let regex = false
    let BanTitle = false
    let BanTime = false

    const file = `${data}/group/${scenes}/config.yaml`
    if (fs.existsSync(file)) {
        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        ip = cfg.server.ip
        port = cfg.server.port
        region = cfg.server.region
        sign = cfg.server.sign
        ticket = `Zyy955${moment().format('YYYYMMDDHHmmss')}`
        MailSender = cfg.邮件.发件人
        CheckInSender = cfg.签到.发件人
        CheckInTitle = cfg.签到.标题
        CheckInContent = cfg.签到.内容
        CreateKey = cfg.生成cdk.key
        CreateGroup = cfg.生成cdk.群聊id
        CdkTitle = cfg.兑换码.标题
        CdkSender = cfg.兑换码.发件人
        CdkContent = cfg.兑换码.内容
        BanTitle = cfg.封禁文案
        BanTime = cfg.默认封禁时间
    }

    return {
        ip, port, region, sign, ticket, MailSender, CheckInSender, CheckInTitle,
        CheckInContent, CreateKey, CreateGroup, CdkSender, CdkTitle, CdkContent, BanTitle, BanTime
    }
}

/** 用户管理 */
export async function GetUser(e = {}) {
    let uid = false
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
    return { scenes, uid, GioAdmin }
}

/** 黑白名单 */
export async function GetPassList(msg) {
    let blocklist = ''
    let intercept = ''

    const other = Yaml.parse(fs.readFileSync(`${config}/other.yaml`, 'utf8'))
    if (!other.whitelist || other.whitelist.length === 0) {
        for (let i = 0; i < other.blacklist.length; i++) {
            blocklist += `(${other.blacklist[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})|`
        }
        blocklist = blocklist.slice(0, -1)
        intercept = !((new RegExp(`^.*(${blocklist})\\.*`)).test(msg))
        if (!intercept) {
            logger.mark(`${msg} 存在黑名单中`)
        }
    }
    else {
        for (let i = 0; i < other.whitelist.length; i++) {
            blocklist += `(${other.whitelist[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})|`
        }
        blocklist = blocklist.slice(0, -1)
        intercept = (new RegExp(`^.*(${blocklist})\\.*`)).test(msg)
        if (!intercept) {
            logger.mark(`${msg} 不存在白名单中`)
        }
    }

    return { intercept }
}