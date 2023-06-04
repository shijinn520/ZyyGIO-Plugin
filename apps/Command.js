import fs from 'fs'
import Yaml from 'yaml'
import crypto from 'crypto'
import fetch from 'node-fetch'
import { commands } from './rule.js'
import plugin from '../../../lib/plugins/plugin.js'
import { getmode, getserver, getuid, getpath, getcommand, getmail } from './index.js'

const { config } = await getpath()

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
    const { gm, mail, birthday, CheckIns, generatecdk, cdk } = await getmode(e)
    if (!gm && !mail && !birthday && !CheckIns && !generatecdk && !cdk) return
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
}

// 咕咕咕
/* function autoTask() {
    schedule.scheduleJob('0 0 1 * *', () => {
        try {
            const playersContent = fs.readFileSync(_path + '/CheckIns.yaml', 'utf8')
            const players = Yaml.parse(playersContent)
            const updateNestedKey = (obj) => {
                for (const key in obj) {
                    if (typeof obj[key] === 'object') {
                        updateNestedKey(obj[key])
                    } else if (key === 'total_signin_count') {
                        obj[key] = 0
                    }
                }
            }
            updateNestedKey(players)
            fs.writeFileSync(_path + '/CheckIns.yaml', Yaml.stringify(players), 'utf8')
            console.log('现在是新的一月，已经将所有玩家的签到状态清空')
        } catch (error) {
            console.error('读取或写入文件时出现错误:', error)
        }
    })
}

autoTask() */