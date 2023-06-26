import fs from 'fs'
import Yaml from 'yaml'
import crypto from 'crypto'
import fetch from 'node-fetch'
import schedule from 'node-schedule'
import { commands } from './rule.js'
import plugin from '../../../lib/plugins/plugin.js'
import { getmode, getserver, getuid, getpath, getcommand, getmail, getadmin, getintercept } from './index.js'

const { data, config } = await getpath()

export class Command extends plugin {
  constructor() {
    super({
      name: 'Command',
      dsc: '游戏指令',
      event: 'message',
      priority: -50,
      rule: commands
    })
  }

  async 签到(e) {
    const { CheckIns } = await getmode(e)
    if (!CheckIns) return
    const { uid } = await getuid(e)
    if (!uid) return

    const mode = "CheckIns"
    getmail(e, mode)
  }

  async GM命令(e) {
    const { gm } = await getmode(e)
    if (!gm) return
    const { gioadmin } = await getadmin(e)
    if (!e.isMaster && !gioadmin) {
      const { intercept } = await getintercept(e)
      if (!intercept) return
    }
    const { uid } = await getuid(e)
    if (!uid) return

    let msg = [e.msg.slice(e.msg.indexOf('/') + 1)]
    const cfg = Yaml.parse(fs.readFileSync(config + '/command.yaml', 'utf8'))

    for (const key in cfg) {
      const obj = cfg[key]
      const names = obj[0].names
      if (names && names.includes(msg[0])) {
        msg = obj[1].command
        break
      }
    }
    const mode = "gm"
    getcommand(e, mode, msg)
  }

  async 服务器状态(e) {
    const { gm, mail, birthday, CheckIns, generatecdk, cdk, ping } = await getmode(e)
    if (!gm && !mail && !birthday && !CheckIns && !generatecdk && !cdk && !ping) return
    const { ip, port, region, sign, ticketping } = await getserver(e)
    const signingkey = { cmd: '1129', region: region, ticket: ticketping }
    const base = Object.keys(signingkey).sort().map(key => `${key}=${signingkey[key]}`).join('&')
    const newsign = `&sign=` + crypto.createHash('sha256').update(base + sign).digest('hex')
    const url = `http://${ip}:${port}/api?${encodeURI(base)}${newsign}`
    try {
      const response = await fetch(url)
      if (response.ok) {
        const json = await response.json()
        if (json.retcode === 0) {
          const data = json.data
          e.reply(`啾咪φ(>ω<*) \n在线人数：${data.online_player_num}\nPC：${data.platform_player_num.PC}\nAndroid：${data.platform_player_num.ANDROID}\nIOS：${data.platform_player_num.IOS}`)
        }
        else {
          console.log("完整响应：", json)
          e.reply("发生未知错误，请自行前往控制台查看完整响应")
        }
      } else {
        console.log("完整响应：", json)
        e.reply("发生未知错误，请自行前往控制台查看错误信息")
        console.error('请求失败:', response.status)
      }
    } catch (error) {
      e.reply("发生网络请求错误，请检查服务器是否正确配置")
      console.error('网络请求错误:', error)
    }
  }
  async 子区(e) {
    const { gm, mail, birthday, CheckIns, generatecdk, cdk, ping } = await getmode(e)
    if (!gm && !mail && !birthday && !CheckIns && !generatecdk && !cdk && !ping) return
    const { ip, port, region, sign, ticketping } = await getserver(e)
    const signingkey = { cmd: '1101', region: region, ticket: ticketping }
    const base = Object.keys(signingkey).sort().map(key => `${key}=${signingkey[key]}`).join('&')
    const newsign = `&sign=` + crypto.createHash('sha256').update(base + sign).digest('hex')
    const url = `http://${ip}:${port}/api?${encodeURI(base)}${newsign}`
    try {
      const response = await fetch(url)
      if (response.ok) {
        const json = await response.json()
        if (json.retcode === 0) {
          const data = json.data
          const jsonString = JSON.stringify(data.gameserver_player_num)
          const formattedString = jsonString.replace(/,/g, '\n').replace(/"/g, '').replace(/:/g, '：').slice(1, -1).trim()
          const lines = formattedString.split('\n')
          const sortedLines = lines.sort((a, b) => {
            const numA = parseFloat(a.split('：')[0])
            const numB = parseFloat(b.split('：')[0])
            return numB - numA
          })
          const sortedString = sortedLines.join('\n')
          e.reply(`game数量：${Object.keys(data.gameserver_player_num).length}\n详细人数：\n${sortedString}`)
        }
        else {
          console.log("完整响应：", json)
          e.reply("发生未知错误，请自行前往控制台查看完整响应")
        }
      } else {
        console.log("完整响应：", json)
        e.reply("发生未知错误，请自行前往控制台查看错误信息")
        console.error('请求失败:', response.status)
      }
    } catch (error) {
      e.reply("发生网络请求错误，请检查服务器是否正确配置")
      console.error('网络请求错误:', error)
    }
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