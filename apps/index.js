import fs from 'fs'
import Yaml from 'yaml'
import moment from 'moment'
import crypto from 'crypto'
let _path = process.cwd() + '/plugins/Zyy-GM-plugin'

if (!fs.existsSync(_path + '/config')) {
  fs.mkdirSync(_path + '/config')
  fs.readdirSync(_path + '/default_config').forEach(file => {
    if (file !== '请勿修改此文件夹下的任何文件.txt') {
      fs.copyFileSync(_path + '/default_config' + '/' + file, _path + '/config' + '/' + file)
    }
  })
}

// 处理使用环境
export async function getScenes(e = {}) {
  let value
  let scenes
  if (e.sub_type === 'friend') {
    // 通用
    value = '私聊'
    scenes = e.user_id
  }
  else if (e.sub_type === 'channel') {
    // TRSS-Yunzai 使用go-cqhttp消息段
    value = 'QQ频道'
    scenes = e.channel_id
  }
  else if (e.sub_type === 'normal') {
    // Miao-Yunzai的频道插件
    if (typeof e.member?.info?.group_id !== 'undefined') {
      value = 'QQ频道'
      scenes = e.member.info.group_id
    } else {
      value = 'QQ群'
      scenes = e.group_id
    }
  }
  return { value, scenes }
}


// 处理GM状态  
export async function getmode(e = {}) {
  // 将开关修改为功能的名称
  const config = Yaml.parse(fs.readFileSync(_path + '/config/config.yaml', 'utf8'))
  const { value, scenes } = await getScenes(e)
  let mode
  if (!config[scenes]) {
    if (e.isMaster) {
      e.reply(`此${value}的GM插件未初始化`)
      return
    }
    return
  }
  else if (config[scenes]?.mode === false) {
    mode = false
    if (e.isMaster) {
      e.reply(`GM在此${value}已经关闭`)
      return
    }
    return
  }
  else if (config[scenes]?.mode === 'gm') {
    mode = 'gm'
  }
  else if (config[scenes]?.mode === 'CheckIns') {
    mode = 'CheckIns'
  }
  return { mode }
}


// 处理server
export async function getserver(e = {}) {
  const config = Yaml.parse(fs.readFileSync(_path + '/config/config.yaml', 'utf8'))
  const { scenes } = await getScenes(e)

  const ip = config[scenes]?.server.ip
  const port = config[scenes]?.server.port
  const region = config[scenes]?.server.region
  const sender = 'Zyy.小钰'

  let sign
  const signswitch = config[scenes]?.server.signswitch
  if (signswitch === "true") {
    sign = config[scenes]?.server.sign
  }
  if (signswitch === "false") {
    sign = ""
  }
  const timestamp = moment().format('YYYYMMDDHHmmss')
  const ticketping = (`Zyy${timestamp}`)
  const title = config[scenes]?.server.title
  const content = config[scenes]?.server.content
  return { ip, port, region, sign, sender, ticketping, title, content }
}


// 处理uid
export async function getuid(e = {}) {
  const config = Yaml.parse(fs.readFileSync(_path + '/config/config.yaml', 'utf8'))
  const { scenes } = await getScenes(e)
  const cfg = config[scenes].uid
  let uid = cfg.find((item) => Object.keys(item)[0] === e.user_id.toString())
  if (!uid) {
    setTimeout(() => {
      e.reply([segment.at(e.user_id), `请绑定UID\n格式：绑定+你的uid\n\n温馨提示：每位玩家仅拥有1次绑定机会\n\nBot会自动去除消息中的空格、字母、符号，UID正确即不用担心会绑定错误`])
    }, 500)
    return
  } else {
    uid = Object.values(uid)[0] || {}
  }
  return { uid }
}


// 处理邮件参数
export async function getmail(e = {}) {
  const { scenes } = await getScenes(e)
  let uid
  if (e.msg.includes('全服邮件')) {
    const cfg = Yaml.parse(fs.readFileSync(_path + '/config/full_server_mail.yaml', 'utf8'))
    uid = cfg[scenes]
  }
  else {
    uid = await getuid(e) || {}
    uid = uid.uid
    if (!uid) return
  }

  let msglength = true
  const { region, sign, ticketping, sender } = await getserver(e)
  const config_id = '0'
  const now = Math.floor(Date.now() / 1000)
  const thirtyDaysLater = now + (30 * 24 * 60 * 60)
  const expire_time = thirtyDaysLater.toString()
  const importance = '0'
  const tag = '0'
  const source_type = '0'
  const item_limit_type = '1'
  const is_collectible = "false"

  const mail = Yaml.parse(fs.readFileSync(_path + '/config/mail.yaml', 'utf8'))
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
  let original
  if (e.msg.includes('全服邮件')) {
    original = {
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
  }
  else {
    original = {
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
  }
  const parameter = Object.keys(original)
    .sort()
    .map(key => `${key}=${original[key]}`)
    .join('&')
  return { parameter, newsign, uid, msglength }
}
