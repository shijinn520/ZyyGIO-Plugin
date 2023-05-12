import fs from 'fs'
import Yaml from 'yaml'
import moment from 'moment'
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

  if (e.message_type === 'group') {
    if (typeof e.member?.info?.group_id !== 'undefined') {
      value = '频道-官方'
      scenes = e.member.info.group_id
    } else {
      value = 'QQ群'
      scenes = e.group_id
    }
  } else if (e.message_type === 'guild') {
    value = '频道'
    scenes = e.channel_id
  } else if (e.message_type === 'private') {
    value = '私聊'
    scenes = e.user_id
  }
  return { value, scenes }
}


// 处理GM状态  
export async function getmode(e = {}) {
  const config = Yaml.parse(fs.readFileSync(_path + '/config/config.yaml', 'utf8'))
  const { value, scenes } = await getScenes(e)
  let mode
  if (!config[scenes]) {
    e.reply(`此${value}的GM插件未初始化`)
    mode = undefined
    return
  }
  else if (config[scenes]?.mode === false) {
    mode = false
    e.reply(`GM在此${value}已经关闭`)
    return
  }
  else if (config[scenes]?.mode === true) {
    mode = true
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
  return { ip, port, region, sign, sender, ticketping }
}


// 处理uid
export async function getuid(e = {}) {
  const config = Yaml.parse(fs.readFileSync(_path + '/config/config.yaml', 'utf8'))
  const { scenes } = await getScenes(e)
  const uuid = e.user_id.toString()
  const cfg = config[scenes].uid
  let uid = cfg.find((item) => Object.keys(item)[0] === uuid)
  if (uid === undefined) {
    setTimeout(() => {
      e.reply([segment.at(e.user_id), `请绑定UID\n格式：绑定+你的uid\n\n温馨提示：每位玩家仅拥有1次绑定机会\nBot会自动去除消息中的空格、字母、符号，UID正确即不用担心会绑定错误`])
    }, 500)
    uid = undefined
  } else {
    uid = Object.values(uid)[0]
  }
  return { uid }
}
