import fs from 'fs'
import Yaml from 'yaml'
import moment from 'moment'
const { data, config } = global.ZhiYu

/** 插件功能状态 */
export async function GetState(scenes) {
    const Groupcfg = `${data}/group/${scenes}/config.yaml`
    let GM = false
    let Mail = false
    let birthday = false
    let CheckIns = false
    let addCdk = false
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
        addCdk = cfg.生成cdk.状态 ? true : false
        CDK = cfg.兑换码.状态 ? true : false
        State = cfg.在线玩家.状态 ? true : false
        UID = cfg.UID.状态 ? true : false
        Ban = cfg.封禁.状态 ? true : false
        /** QWQ 感觉好乱 逼死强迫症... */
    }

    return { GM, Mail, birthday, CheckIns, addCdk, CDK, State, UID, Ban }
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
        BanTitle = cfg.封禁.封禁文案
        BanTime = cfg.封禁.封禁时间
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
        if (!e.msg.includes("绑定")) {
            e.reply([segment.at(e.user_id), "\n请先绑定UID\n格式：绑定+UID\n举例：绑定100001"])
        }
    }
    else {
        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        uid = cfg.uid
        GioAdmin = cfg.Administrator ? true : false
    }
    return { scenes, uid, GioAdmin }
}

/** 黑白名单 */
export async function GetPassList(e, GioAdmin, msg) {
    let blocklist = ''
    let intercept = true
    let blacklists = true

    const other = Yaml.parse(fs.readFileSync(`${config}/other.yaml`, 'utf8'))

    for (let i = 0; i < other.blacklists.length; i++) {
        blocklist += `(${other.blacklists[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})|`
    }
    blocklist = blocklist.slice(0, -1)
    blacklists = !((new RegExp(`^.*(${blocklist})\\.*`)).test(msg))
    if (!blacklists && !e.isMaster) {
        e.reply([segment.at(e.user_id), `${msg} 已经被主人禁用`])
        return { blacklists, intercept }
    }

    blocklist = ''
    if (!other.whitelist || other.whitelist.length === 0) {
        for (let i = 0; i < other.blacklist.length; i++) {
            blocklist += `(${other.blacklist[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})|`
        }
        blocklist = blocklist.slice(0, -1)
        intercept = !((new RegExp(`^.*(${blocklist})\\.*`)).test(msg))
        if (!intercept && !e.isMaster && !GioAdmin) {
            e.reply([segment.at(e.user_id), `${msg} 已经被管理员禁用`])
            // logger.mark(`${msg} 存在黑名单中`)
        }
    }
    else {
        for (let i = 0; i < other.whitelist.length; i++) {
            blocklist += `(${other.whitelist[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})|`
        }
        blocklist = blocklist.slice(0, -1)
        intercept = (new RegExp(`^.*(${blocklist})\\.*`)).test(msg)
        if (!intercept && !e.isMaster && !GioAdmin) {
            e.reply([segment.at(e.user_id), `${msg} 已经被管理员禁用`])
            // logger.mark(`${msg} 不存在白名单中`)
        }
    }

    return { blacklists, intercept }
}