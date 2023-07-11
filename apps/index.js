import fs from 'fs'
import Yaml from 'yaml'
import moment from 'moment'
import crypto from 'crypto'
import fetch from 'node-fetch'

let _path = process.cwd() + '/plugins/ZyyGio-Plugin'
if (!fs.existsSync(_path)) {
  _path = process.cwd() + '/plugins/Zyy-GM-plugin'
}

/**
 * 获取路径
 * @returns {Promise<{
 * _path: "根目录路径",
 * data: "data路径",
 * config: "config路径",
 * resources: "resources路径"
 * }>}
 */
export async function getpath() {
  const data = _path + '/data'
  const config = _path + '/config'
  const resources = _path + '/resources'
  return { _path, data, config, resources }
}
const { data, config } = await getpath()

/**网页cdk生成文件转发至QQ群 */
export async function gettxt(txtfile = {}) {
  console.log(txtfile)
  Bot.pickGroup("279942511").fs.upload(txtfile)
}

/**
 * 场景相关
 * @returns {Promise<{
 * scenes: "当前场景ID",
 * value: ["QQ私聊", "QQ群聊", "QQ频道私聊", "QQ频道群聊"]
 * }>}
 */
export async function getScenes(e = {}) {
  let value = false
  let scenes = false
  if (e.sub_type === 'friend') {
    value = 'QQ私聊'
    scenes = e.user_id
  }
  else if (e.sub_type === 'group') {
    value = 'QQ频道私聊'
    scenes = e.sender.group_id
  }
  else if (e.sub_type === 'channel') {
    value = 'QQ频道群聊'
    scenes = e.channel_id
  }
  else if (e.sub_type === 'normal') {
    if (typeof e.member?.info?.group_id !== 'undefined') {
      if (e.group_id === e.member.info.group_id) {
        value = 'QQ群聊'
        scenes = e.group_id
      } else {
        value = 'QQ频道群聊'
        scenes = `${e.group_id}-${e.member.info.group_id}`
      }
    } else {
      value = 'QQ群聊'
      scenes = e.group_id
    }
  } else {
    value = 'QQ频道群聊'
    scenes = e.group_id.replace("qg_", "")
  }
  return { value, scenes }
}


/**
 * @param 功能状态
 * @returns {Promise<{
 * gm: "GM命令功能状态",
 * mail: "邮件功能状态",
 * birthday: "生日邮件功能状态",
 * CheckIns: "签到功能状态",
 * generatecdk: "生成cdk功能状态",
 * cdk: "cdk兑换功能状态",
 * ping: "在线玩家功能状态"
 * }>}
 */
export async function getmode(e = {}) {
  const { value, scenes } = await getScenes(e)
  const file = `${data}/group/${scenes}/config.yaml`
  if (!fs.existsSync(file)) {
    console.error(`当前${value} ${scenes} 未初始化`)
    return { gm: false, mail: false, birthday: false, CheckIns: false, generatecdk: false, cdk: false }
  }
  const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
  const gm = cfg.gm.mode ? true : false
  const mail = cfg.mail.mode ? true : false
  const birthday = cfg.birthday.mode ? true : false
  const CheckIns = cfg.CheckIns.mode ? true : false
  const generatecdk = cfg.generatecdk.mode ? true : false
  const cdk = cfg.cdk.mode ? true : false
  const ping = cfg.ping.mode ? true : false
  return { gm, mail, birthday, CheckIns, generatecdk, cdk, ping }
}


/**
 * @param 请求参数
 * @returns {Promise<{
 * ip: "muip请求ip",
 * port: "muip请求端口",
 * region: "muip请求区服",
 * sign: "muip请求签名",
 * ticketping: "muip请求令牌",
 * mailsender: "普通邮件发件人",
 * CheckInssender: "每日签到-发件人",
 * CheckInstitle: "每日签到-标题",
 * CheckInscontent: "每日签到-内容",
 * cdksender: "cdk兑换-发件人",
 * cdktitle: "cdk兑换-标题",
 * cdkcontent: "cdk兑换-内容",
 * keycdk: "cdk生成-自定义加密key",
 * groupcdk: "cdk生成-cdk使用群id",
 * }>}
 */
export async function getserver(e = {}) {
  const { scenes } = await getScenes(e)
  const cfg = Yaml.parse(fs.readFileSync(`${data}/group/${scenes}/config.yaml`, 'utf8'))
  const ip = cfg.server.ip
  const port = cfg.server.port
  const region = cfg.server.region

  let sign
  const signswitch = cfg.server.signswitch
  if (signswitch === "true") {
    sign = cfg.server.sign
  }
  if (signswitch === "false") {
    sign = ""
  }
  const timestamp = moment().format('YYYYMMDDHHmmss')
  const ticketping = (`Zyy${timestamp}`)
  const mailsender = cfg.mail.sender
  const CheckInssender = cfg.CheckIns.sender
  const CheckInstitle = cfg.CheckIns.title
  const CheckInscontent = cfg.CheckIns.content
  const cdktitle = cfg.cdk.title
  const cdksender = cfg.cdk.sender
  const cdkcontent = cfg.cdk.content
  const keycdk = cfg.generatecdk.key
  const groupcdk = cfg.generatecdk.group

  return {
    ip, port, region, sign, ticketping, mailsender, CheckInssender, CheckInstitle,
    CheckInscontent, cdksender, cdktitle, cdkcontent, keycdk, groupcdk
  }
}


/**
 * @param 玩家UID
 * @returns {Promise<{ uid: "玩家UID" }>}
 */
export async function getuid(e = {}) {
  let uid = false
  const file = `${data}/user/${e.user_id.toString().replace("qg_", "")}.yaml`
  if (!fs.existsSync(file)) {
    e.reply([segment.at(e.user_id), "\n清先绑定UID\n格式：绑定+UID\n举例：绑定100001"])
  }
  else {
    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
    uid = cfg.uid
  }
  return { uid }
}

/**
 * @param 服务器管理员
 * @returns {Promise<{ gioadmin: "服务器管理员" }>}
 */
export async function getadmin(e = {}) {
  let gioadmin = false
  const file = `${data}/user/${e.user_id.toString().replace("qg_", "")}.yaml`
  if (fs.existsSync(file)) {
    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
    if (cfg.Administrator) {
      gioadmin = true
    }
  }
  return { gioadmin }
}

/**
 * @param 黑白名单
 * @returns {Promise<{ 
 * intercept: [ 
 * "白名单存在：msg存在白名单中，返回true，不存在返回false",
 * "白名单不存在：msg存在黑名单中，返回false，不存在返回true"
 * ]
 * }>}
 */
export async function getintercept(e = {}) {
  let blocklist = ''
  let intercept = ''
  const cfg = Yaml.parse(fs.readFileSync(`${config}/other.yaml`, 'utf8'))

  if (!cfg.whitelist || cfg.whitelist.length === 0) {
    for (let i = 0; i < cfg.blacklist.length; i++) {
      blocklist += `(${cfg.blacklist[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})|`
    }
    blocklist = blocklist.slice(0, -1)
    intercept = !((new RegExp(`^.*(${blocklist})\\.*`)).test(e.msg))
    if (!intercept) {
      logger.mark(`${e.msg} 存在黑名单中`)
      e.reply([segment.at(e.user_id), "已被管理员禁用"])
    }
  }
  else {
    for (let i = 0; i < cfg.whitelist.length; i++) {
      blocklist += `(${cfg.whitelist[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})|`
    }
    blocklist = blocklist.slice(0, -1)
    intercept = (new RegExp(`^.*(${blocklist})\\.*`)).test(e.msg)
    if (!intercept) {
      logger.mark(`${e.msg} 不存在白名单中`)
    }
  }

  return { intercept }
}

// command
export async function getcommand(e = {}, mode, msg) {
  const { uid } = await getuid(e)
  const { scenes } = await getScenes(e)
  const { ip, port, region, sign, ticketping } = await getserver(e)
  const urls = []
  msg.forEach(msg => {
    const signingkey = { cmd: '1116', uid: uid, region: region, msg: msg, ticket: ticketping }
    const base = Object.keys(signingkey).sort().map(key => `${key}=${signingkey[key]}`).join('&')
    const newsign = `&sign=` + crypto.createHash('sha256').update(base + sign).digest('hex')
    const url = `http://${ip}:${port}/api?${encodeURI(base)}${newsign}`
    urls.push(url)
  })
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

  const newmsg = []
  const fail = []
  Promise.all(fetchResults)
    .then(responses => {
      responses.forEach(response => {
        if (response.ok) {
          response.json()
            .then(outcome => {
              const retcode = outcome.retcode
              if (retcode !== 0) {
                logger.mark(`[error-command][${e.sender.card || e.sender.nickname}(${e.user_id.toString().replace("qg_", "")}-${uid})][${e.msg}][${JSON.stringify(outcome).replace(/[{}]/g, '')}]`)
              }
              let datamsg = outcome.data?.msg || {}
              if (retcode === 0) {
                newmsg.push(`成功：${datamsg}  ->  ${uid}`)
              }
              else if (retcode === -1) {
                const dataret = outcome.data.retmsg.replace(/can't find gm command/g, '找不到GM命令').replace(/command/g, '命令').replace(/execute fails/g, '执行失败').replace(/invalid param/g, '无效参数')
                fail.push(`失败：${datamsg} -> ${uid}\n原因：${dataret}`)
              }
              else if (retcode === 4) {
                fail.push(`又不在线，再发我顺着网线打死你！╭(╯^╰)╮`)
              }
              else if (retcode === 617) {
                fail.push(`失败：${datamsg}  ->  ${uid}\n原因：数量超出限制`)
              }
              else if (retcode === 627) {
                fail.push(`失败：${datamsg}  ->  ${uid}\n原因：数量超出限制`)
              }
              else if (retcode === 1003) {
                fail.push(`失败，服务器验证签名错误`)
              }
              else if (retcode === 1010) {
                fail.push(`失败，服务器区服不匹配`)
              }
              else if (retcode === 1117) {
                e.reply([segment.at(e.user_id), `失败 -> 未达到副本要求等级`])
              }
              else if (retcode === 8002) {
                fail.push(`失败，传说钥匙超过限制`)
              }
              else {
                fail.push(`失败 -> 请把此内容反馈给作者\nUID:${uid}\n反馈内容：\n${JSON.stringify(outcome)}`)
              }
              if (urls.length === (newmsg.length + fail.length)) {
                if (mode === "cdk") {
                  // 如果存在多个请求，哪怕失败多个，只要成功一个都会被判定为成功
                  if (newmsg.length > 0) {
                    let uidstate = false
                    const name = e.msg.replace(/兑换/g, '').trim()
                    let file = `${data}/group/${scenes}/cdk/自定义/${name}.yaml`
                    if (name.length === 32) {
                      file = `${data}/group/${scenes}/cdk/批量生成/${name}.yaml`
                    }
                    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
                    if (cfg.redeemlimit <= (Number(cfg.used) + 1)) {
                      fs.unlink(file, (err) => {
                        if (err) {
                          console.error(err)
                          return
                        }
                        console.log(`兑换码可使用次数为0，已删除文件：${file} `)
                      })
                      e.reply([segment.at(e.user_id), `\n兑换成功\nUID：${uid}\n发放方式：在线GM发放\n备注：请直接查看对应物品、内容`])
                      return
                    }

                    if (uid in cfg.uid) {
                      uidstate = true
                    }
                    if (uidstate === false) {
                      cfg.uid[uid] = Number(1)
                      cfg.used += 1
                      fs.writeFileSync(file, Yaml.stringify(cfg), 'utf8')
                      e.reply([segment.at(e.user_id), `\n兑换成功\nUID：${uid}\n发放方式：在线GM发放\n备注：请直接查看对应物品、内容`])
                      return
                    }
                    if (uidstate === true) {
                      cfg.used += 1
                      cfg.uid[uid] = Number(cfg.uid[uid]) + 1
                      fs.writeFileSync(file, Yaml.stringify(cfg), 'utf8')
                      e.reply([segment.at(e.user_id), `\n兑换成功\nUID：${uid}\n发放方式：在线GM发放\n备注：请直接查看对应物品、内容`])
                      return
                    }
                  }
                  else {
                    e.reply([segment.at(e.user_id), `\n兑换失败\n${fail.join('\n')}`])
                    return
                  }
                }
                else if (mode === "gm") {
                  if (newmsg.length === 0) {
                    e.reply([segment.at(e.user_id), `\n${fail.join('\n')}`])
                    return
                  }
                  if (fail.length === 0) {
                    e.reply([segment.at(e.user_id), `\n${newmsg.join('\n')}`])
                    return
                  }
                  if (newmsg.length > 0 && fail.length > 0) {
                    e.reply([segment.at(e.user_id), `\n${newmsg.join('\n')}\n\n${fail.join('\n')}`])
                    return
                  }
                }
              }
            })
        } else {
          console.error('请求失败')
        }
      })
    })
    .catch(error => {
      console.error(error.message)
      if (mode === "cdk") {
      }
      e.reply([segment.at(e.user_id), `\nUID：${uid}\n走开，你都不在线 ￣へ￣`])
    })
}

// 邮件
export async function getmail(e = {}, mode, item) {
  const { scenes } = await getScenes(e)
  const { ip, port, region, sign, ticketping, mailsender, CheckInssender,
    CheckInstitle, CheckInscontent, cdksender, cdktitle, cdkcontent } = await getserver(e)
  const { uid } = await getuid(e)
  const mail = Yaml.parse(fs.readFileSync(`${config}/mail.yaml`, 'utf8'))
  const msg = (e.msg.replace(/&lt;color=([^&]+)&gt;([^&]+)&lt;\/color&gt;/g, '<color=$1>$2</color>')).split(' ')

  let title = msg[1]
  let content = msg[2]
  let item_list = msg[3]
  let sender = mailsender

  if (mode === "mail") {
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
        return
      }
    }
  }

  if (mode === "CheckIns") {
    const CheckIns = Yaml.parse(fs.readFileSync(config + '/items.yaml', 'utf8'))
    const players = Yaml.parse(fs.readFileSync(`${data}/user/${e.user_id.toString().replace("qg_", "")}.yaml`, 'utf8'))
    // 得到今天时间
    const getNow = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')

    const logTime = players[scenes].last_signin_time
    let checkInSum = players[scenes].total_signin_count
    // 对比用户上次签到时间
    if (logTime.slice(0, 10) === getNow.slice(0, 10)) {
      e.reply([segment.at(e.user_id), `\n今日已签到\n累计签到：${checkInSum} 天\n签到时间：${logTime}`])
      return
    }
    checkInSum = checkInSum + 1
    title = CheckInstitle
    content = CheckInscontent
    sender = CheckInssender
    item_list = CheckIns.CheckIns[checkInSum].item_list
  }

  if (mode === "cdk") {
    title = cdktitle
    content = cdkcontent
    sender = cdksender
    item_list = item
  }
  const config_id = '0'
  const now = Math.floor(Date.now() / 1000)
  const thirtyDaysLater = now + (30 * 24 * 60 * 60)
  const expire_time = thirtyDaysLater.toString()
  const importance = '0'
  const tag = '0'
  const source_type = '0'
  const item_limit_type = '1'
  const is_collectible = "false"

  const urls = []
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
  const base = Object.keys(signingkey).sort().map(key => `${key}=${signingkey[key]}`).join('&')
  const newsign = `&sign=` + crypto.createHash('sha256').update(base + sign).digest('hex')

  const constitute = {
    cmd: '1005',
    uid: uid,
    region: region,
    config_id: config_id,
    content: encodeURIComponent(content),
    expire_time: expire_time,
    importance: importance,
    is_collectible: is_collectible,
    item_limit_type: item_limit_type,
    item_list: encodeURIComponent(item_list),
    source_type: source_type,
    tag: tag,
    sender: encodeURIComponent(sender),
    title: encodeURIComponent(title),
    ticket: ticketping,
  }

  const parameter = Object.keys(constitute).sort().map(key => `${key}=${constitute[key]}`).join('&')

  const url = `http://${ip}:${port}/api?${parameter}${newsign}`
  urls.push(url)

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 1000
  }

  const fetchResults = [].concat(urls).map(url => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('超过1秒未响应，中断请求'))
      }, 1000)
    })

    const fetchPromise = fetch(url, options)

    return Promise.race([fetchPromise, timeoutPromise])
  })

  Promise.all(fetchResults)
    .then(responses => {
      responses.forEach(response => {
        if (response.ok) {
          response.json()
            .then(outcome => {
              const retcode = outcome.retcode
              if (retcode !== 0) {
                logger.mark(`[error-mail][${e.sender.card || e.sender.nickname}(${e.user_id.toString().replace("qg_", "")}-${uid})][${e.msg}][${JSON.stringify(outcome).replace(/[{}]/g, '')}]`)
              }
              if (retcode === 0) {
                if (mode === "mail") {
                  e.reply([segment.at(e.user_id), `成功 -> ${parseInt(outcome.data.uid)}`])
                  return
                }

                if (mode === "CheckIns") {
                  const file = `${data}/user/${e.user_id.toString().replace("qg_", "")}.yaml`
                  const CheckIns = Yaml.parse(fs.readFileSync(config + '/items.yaml', 'utf8'))
                  const players = Yaml.parse(fs.readFileSync(file, 'utf8'))
                  const getNow = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
                  let checkInSum = players[scenes].total_signin_count + 1
                  const name = CheckIns.CheckIns[checkInSum].name
                  players[scenes].total_signin_count = checkInSum
                  players[scenes].last_signin_time = getNow
                  fs.writeFileSync(file, Yaml.stringify(players))
                  e.reply([segment.at(e.user_id), `\n签到成功\n当前UID：${parseInt(outcome.data.uid)}\n累计签到：${checkInSum} 天\n签到时间：${getNow}`])
                  return
                }

                if (mode = "cdk") {
                  let uidstate = false
                  const msg = e.msg.replace(/兑换/g, '').trim()
                  let file = `${data}/group/${scenes}/cdk/自定义/${msg}.yaml`
                  if (msg.length === 32) {
                    file = `${data}/group/${scenes}/cdk/批量生成/${msg}.yaml`
                  }
                  const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
                  if (cfg.redeemlimit <= (Number(cfg.used) + 1)) {
                    fs.unlink(file, (err) => {
                      if (err) {
                        console.error(err)
                        return
                      }
                      console.log(`兑换码可使用次数为0，已删除文件：${file} `)
                    })
                    e.reply([segment.at(e.user_id), `\n兑换成功\nUID：${uid}\n发放方式：邮件发放\n备注：请在游戏内查看邮件`])
                    return
                  }

                  if (uid in cfg.uid) {
                    uidstate = true
                  }
                  if (uidstate === false) {
                    // yaml中uid不存在，创建并写入，cdk总次数+1
                    cfg.uid[uid] = Number(1)
                    cfg.used += 1
                    fs.writeFileSync(file, Yaml.stringify(cfg), 'utf8')
                    e.reply([segment.at(e.user_id), `\n兑换成功\nUID：${uid}\n发放方式：邮件发放\n备注：请在游戏内查看邮件`])
                    return
                  }
                  if (uidstate === true) {
                    // 存在uid，总次数+1，uid兑换次数+1
                    // 更新 cfg 对象的值
                    cfg.used += 1
                    cfg.uid[uid] = Number(cfg.uid[uid]) + 1
                    fs.writeFileSync(file, Yaml.stringify(cfg), 'utf8')
                    e.reply([segment.at(e.user_id), `\n兑换成功\nUID：${uid}\n发放方式：邮件发放\n备注：请在游戏内查看邮件`])
                    return
                  }
                }
              }
              else if (retcode === -1) {
                e.reply([segment.at(e.user_id), `失败 -> 发生未知错误，请检查指令`])
              }
              else if (retcode === 17) {
                e.reply([segment.at(e.user_id), `\n失败 -> 账户不存在\nuid：${uid}`])
              }
              else if (retcode === 617) {
                e.reply([segment.at(e.user_id), `失败 -> 邮件物品超过限制`])
              }
              else if (retcode === 1002) {
                e.reply([segment.at(e.user_id), `失败 -> ${outcome.msg.replace(/para error/g, '段落错误')}`])
              }
              else if (retcode === 1003) {
                e.reply([segment.at(e.user_id), `失败 -> 服务器验证签名错误`])
              }
              else if (retcode === 1010) {
                e.reply([segment.at(e.user_id), `失败 -> 服务器区服错误`])
              }
              else if (retcode === 1202) {
                e.reply([segment.at(e.user_id), `失败 -> 处于多人模式非房主`])
              }
              else if (retcode === 1311) {
                e.reply([segment.at(e.user_id), `失败 -> 禁止发送「创世结晶」`])
              }
              else if (retcode === 1312) {
                if (mode === "cdk") {
                }
                e.reply([segment.at(e.user_id), `失败 -> 游戏货币超限`])
              }
              else if (retcode === 1316) {
                if (mode === "cdk") {
                }
                e.reply([segment.at(e.user_id), `失败 -> 游戏货币超限`])
              }
              else if (retcode === 2006) {
                e.reply([segment.at(e.user_id), `失败 -> 禁止重复发送邮件`])
              }
              else if (retcode === 2028) {
                e.reply([segment.at(e.user_id), `失败 -> 邮件日期设置错误，请修改[expire_time`])
              }
              else {
                e.reply([segment.at(e.user_id), `\n失败 -> 请把此内容反馈给作者\nUID:${uid}\n反馈内容：\n${JSON.stringify(outcome)}`])
              }
            })
        }
      })
    })
    .catch(error => {
      console.error(error)
      e.reply([segment.at(e.user_id), `发生未知错误，请重试`])
    })
}