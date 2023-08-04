import fs from 'fs'
import Yaml from 'yaml'
import moment from 'moment'
import schedule from 'node-schedule'
import { construct } from './regex.js'
import { ComputeGM, ComputeMail, Request } from './request.js'
import { GetServer, GetUser, GetState, GetPassList } from './app.js'

const { data, config, alias } = global.ZhiYu

export class ZhiYu extends plugin {
  constructor() {
    super({
      name: 'zhiyu-plugin',
      dsc: '构建请求参数',
      event: 'message',
      priority: -50,
      rule: construct
    })
  }

  async 签到(e) {
    const { scenes, uid } = await GetUser(e)
    const { CheckIns } = await GetState(scenes)
    if (!CheckIns || !uid) return

    const file = `${data}/user/${e.user_id.toString().replace("qg_", "")}.yaml`
    const user = Yaml.parse(fs.readFileSync(file, 'utf8'))

    /** 检测玩家在当前群聊是否存在配置 */
    if (!user.hasOwnProperty(scenes)) {
      user[scenes] = {
        total_signin_count: 0,
        last_signin_time: "1999-12-12 00:00:00"
      }
      fs.writeFileSync(file, Yaml.stringify(user), 'utf8')
    }

    const { ip, port, region, sign, ticket,
      CheckInSender, CheckInTitle, CheckInContent } = await GetServer(e)

    const cfg = Yaml.parse(fs.readFileSync(config + '/items.yaml', 'utf8'))
    const players = Yaml.parse(fs.readFileSync(`${data}/user/${e.user_id.toString().replace("qg_", "")}.yaml`, 'utf8'))
    // 得到今天时间
    const getNow = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')

    const logTime = players[scenes].last_signin_time
    let checkInSum = players[scenes].total_signin_count

    // 对比用户上次签到时间
    if (logTime.slice(0, 10) === getNow.slice(0, 10)) {
      e.reply([segment.at(e.user_id), `\n今日已签到\n当前UID：${uid}\n累计签到：${checkInSum} 天\n签到时间：${logTime}`])
      return
    }
    checkInSum = checkInSum + 1
    let title = CheckInTitle
    let content = CheckInContent
    let sender = CheckInSender
    let item_list = cfg.CheckIns[checkInSum].item_list
    const now = Math.floor(Date.now() / 1000)
    const expire_time = (now + (30 * 24 * 60 * 60)).toString()

    const request = await ComputeMail(uid, region, content, expire_time, item_list, sender, title, ticket, sign)

    const urls = [`http://${ip}:${port}/api?${request}`]
    const mode = "签到"
    Request(e, mode, urls, uid)
  }

  async 邮件(e) {
    const { scenes, uid, GioAdmin } = await GetUser(e)
    const { Mail } = await GetState(scenes)
    if (!Mail || !uid) return

    const { ip, port, region, sign, ticket, MailSender } = await GetServer(e)
    const mails = Yaml.parse(fs.readFileSync(`${alias}/mail/mail.yaml`, 'utf8'))
    /** 为什么要加这个... 因为坑逼频道插件没有转码 */
    const msg = (e.msg.replace(/&lt;color=([^&]+)&gt;([^&]+)&lt;\/color&gt;/g, '<color=$1>$2</color>')).split(' ')

    let title = msg[1]
    let content = msg[2]
    let item_list = msg[3]
    let sender = MailSender

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
      e.reply([segment.at(e.user_id), `邮件格式错误\n\n格式：邮件 [标题] [内容] [ID:数量,ID:数量]\n举例：邮件 测试 你好 201:1`])
      return
    }

    /** 黑白名单 */
    const { blacklists, intercept } = await GetPassList(e, GioAdmin, item_list)
    if (!e.isMaster && !blacklists) return
    if (!e.isMaster && !GioAdmin && !intercept) return

    const now = Math.floor(Date.now() / 1000)
    const expire_time = (now + (30 * 24 * 60 * 60)).toString()
    const request = await ComputeMail(uid, region, content, expire_time, item_list, sender, title, ticket, sign)

    const urls = [`http://${ip}:${port}/api?${request}`]
    const mode = "邮件"
    Request(e, mode, urls, uid)
  }

  async GMCommand(e) {
    const { scenes, uid, GioAdmin } = await GetUser(e)
    const { GM } = await GetState(scenes)
    if (!GM || !uid) return

    let msg = [e.msg.slice(e.msg.indexOf('/') + 1)]
    if (!e.msg.includes("/")) {
      const newmsg = e.msg.replace(/[\u4e00-\u9fff]+/g, '')
      if (!newmsg) {
        return e.reply("不存在的任务id")
      }

      const commands = {
        "添加任务": `quest accept ${newmsg}`,
        "完成任务": `quest finish ${newmsg}`,
        "清除父任务": `quest clear father ${newmsg}`,
        "完成父任务": `quest finish father ${newmsg}`
      }

      if (Object.keys(commands).some(keyword => e.msg.includes(keyword))) {
        const newcommands = Object.keys(commands).find(keyword => e.msg.includes(keyword))
        msg = [commands[newcommands]]
      } else {
        return e.reply("未知错误，请检查指令")
      }
    } else {
      /** 变量全局变量中的别名 寻找匹配的值 */
      for (const key in global.ZhiYu.list) {
        const obj = global.ZhiYu.list[key]
        const names = obj[0].names
        if (names && names.includes(msg[0])) {
          msg = obj[1].command
          break
        }
      }

      /** 非管理员判断是否命令是否存在黑名单中 */
      for (const key in msg) {
        const value = msg[key]
        const { blacklists, intercept } = await GetPassList(e, GioAdmin, value)
        if (!e.isMaster && !blacklists) return
        if (!e.isMaster && !GioAdmin && !intercept) return
      }

      /** 未找到匹配的值后还是中文后停止请求... */
      if (/[\u4e00-\u9fff]/.test(msg[0])) {
        return e.reply([segment.at(e.user_id), `无此别名，请使用[#别名列表]查看已有别名`])
      }
    }

    const urls = []
    const { ip, port, region, sign, ticket } = await GetServer(e)

    const asyncTasks = msg.map(async msg => {
      const signkey = { cmd: '1116', uid: uid, region: region, msg: msg, ticket: ticket }
      const request = await ComputeGM(signkey, sign)
      urls.push(`http://${ip}:${port}/api?${request}`)
    })

    /** 等待所有url计算完毕 */
    await Promise.all(asyncTasks)

    const mode = "gm"
    Request(e, mode, urls, uid)
  }

  async 兑换码(e) {
    const { scenes, uid } = await GetUser(e)
    const { CDK } = await GetState(scenes)
    if (!CDK || !uid) return

    const msg = e.msg.replace(/兑换|\/兑换/g, '').trim()

    let file = `${data}/group/${scenes}/cdk/自定义/${msg}.yaml`
    if (msg.length === 32) {
      file = `${data}/group/${scenes}/cdk/批量生成/${msg}.yaml`
    }

    // 撤回消息防止别的玩家使用他人兑换码
    e.group.recallMsg(e.message_id)

    if (!fs.existsSync(file)) return e.reply([segment.at(e.user_id), `无效的兑换码!`])

    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
    if (cfg.redeemlimit <= cfg.used) return e.reply([segment.at(e.user_id), "可兑换次数为0"])


    if (uid in cfg.uid) {
      if (cfg.uid[uid] >= cfg.uidusagelimit) return e.reply([segment.at(e.user_id), `使用次数达到上限`])
    }
    const { ip, port, region, sign, ticket,
      CdkSender, CdkTitle, CdkContent } = await GetServer(e)

    if (cfg.actiontype === 'command') {
      const msg = cfg.command.includes(',') ? cfg.command.split(',') : [cfg.command]
      const urls = []
      const asyncTasks = msg.map(async msg => {
        const signkey = { cmd: '1116', uid: uid, region: region, msg: msg, ticket: ticket }
        const request = await ComputeGM(signkey, sign)
        urls.push(`http://${ip}:${port}/api?${request}`)
      })

      /** 等待所有url计算完毕 */
      await Promise.all(asyncTasks)
      const mode = "兑换码"
      Request(e, mode, urls, uid)
    } else {
      const now = Math.floor(Date.now() / 1000)
      const expire_time = (now + (30 * 24 * 60 * 60)).toString()
      const title = CdkTitle
      const content = CdkContent
      const sender = CdkSender
      const item_list = cfg.command

      const request = await ComputeMail(uid, region, content,
        expire_time, item_list, sender, title, ticket, sign)

      const urls = [`http://${ip}:${port}/api?${request}`]
      const mode = "兑换码"
      Request(e, mode, urls, uid)
    }
  }

  async 服务器状态(e) {
    const { scenes } = await GetUser(e)
    const { State } = await GetState(scenes)
    if (!State) return

    const { ip, port, region, sign, ticket } = await GetServer(e)
    const signkey = { cmd: '1129', region: region, ticket: ticket }
    const request = await ComputeGM(signkey, sign)
    const urls = [`http://${ip}:${port}/api?${request}`]

    const mode = "在线玩家"
    Request(e, mode, urls)

  }

  async 子区(e) {
    const { scenes } = await GetUser(e)
    const { State } = await GetState(scenes)
    if (!State) return

    const { ip, port, region, sign, ticket } = await GetServer(e)
    const signkey = { cmd: '1101', region: region, ticket: ticket }
    const request = await ComputeGM(signkey, sign)
    const urls = [`http://${ip}:${port}/api?${request}`]

    const mode = "子服"
    Request(e, mode, urls)
  }

  async 封禁玩家(e) {
    const { scenes } = await GetUser(e)
    const { Ban } = await GetState(scenes)
    if (!Ban) return

    const uid = e.msg.replace(/[^0-9]/g, "")

    if (!uid) return e.reply([segment.at(e.user_id), "(｡・`ω´･)UID捏？"])

    const { BanTitle, BanTime } = await GetServer(e)
    /** 封建时间=当前时间 */
    const begin_time = moment().format('YYYY-MM-DD HH:mm:ss')
    /** 得到用户自定义的默认封禁时间 */
    let time = BanTime

    const chineseToNumber = {
      一: '1', 二: '2', 三: '3', 四: '4', 五: '5',
      六: '6', 七: '7', 八: '8', 九: '9', 十: '10'
    }

    const timeMultiplier = {
      天: 24 * 60 * 60 * 1000,
      日: 24 * 60 * 60 * 1000,
      周: 7 * 24 * 60 * 60 * 1000,
      月: 30 * 24 * 60 * 60 * 1000,
      年: 365 * 24 * 60 * 60 * 1000
    }
    let duration = 0
    time = time.replace(/[一二三四五六七八九十]/g, match => chineseToNumber[match])
    const unit = time.match(/[天日周月年]/)[0]
    if (!unit) return e.reply("时间格式错误...")

    duration = parseInt(time) * timeMultiplier[unit]
    /** 解禁时间 */
    let end_time = moment(begin_time).add(duration).format('YYYY-MM-DD HH:mm:ss')

    if (e.msg.includes("解")) {
      end_time = moment(begin_time).add(2, 'seconds').format('YYYY-MM-DD HH:mm:ss')
    }

    const { ip, port, region, sign, ticket } = await GetServer(e)
    const signkey = {
      cmd: '1103', uid: uid, begin_time: begin_time,
      end_time: end_time, region: region, msg: BanTitle, ticket: ticket
    }

    const request = await ComputeGM(signkey, sign)
    const urls = [`http://${ip}:${port}/api?${request}`]

    const mode = "封禁"
    Request(e, mode, urls, signkey)
  }

}


const _path = data + '/user'
schedule.scheduleJob('0 0 1 * *', async () => {
  try {
    const files = await fs.promises.readdir(_path)
    await Promise.all(files.map(async (file) => {
      if (file.endsWith('.yaml')) {
        const doc = Yaml.parse(await fs.promises.readFile(`${_path}/${file}`, { encoding: 'utf8' }))
        doc.total_signin_count = 0
        await fs.promises.writeFile(`${_path}/${file}`, Yaml.stringify(doc))
      }
    }))
    logger.mark('现在是每月1日，已将所有玩家的签到状态清空')
  } catch (err) {
    logger.mark(err)
  }
})
