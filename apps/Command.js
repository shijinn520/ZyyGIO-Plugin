import fs from 'fs'
import Yaml from 'yaml'
import crypto from 'crypto'
import fetch from 'node-fetch'
import schedule from 'node-schedule'
import { commands } from './rule.js'
import plugin from '../../../lib/plugins/plugin.js'
import { getmode, getserver, getuid, getpath, getcommand, getmail, getadmin, getintercept, getScenes } from './index.js'

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

    const { scenes } = await getScenes(e)
    const file = `${data}/user/${e.user_id.replace("qg_", "")}.yaml`
    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))

    /** 检测玩家在当前群聊是否存在配置 */
    if (!cfg.hasOwnProperty(scenes)) {
      cfg[scenes] = {
        total_signin_count: 3,
        last_signin_time: "2023-07-03 00:00:01"
      }
      fs.writeFileSync(file, Yaml.stringify(cfg), 'utf8')
    }

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

    if (e.msg.includes('give')) {
      const randomReplies = [
        "5q+r5peg6Ieq55+l5LmL5piO77yM5L2g6L+Z5Liq6KCi6LSn77yM5qC55pys5LiN5piv4oCcR3Jhc3NjdXR0ZXLigJ3vvIE=",
        "6byg6ZuA5LmL6L6I77yM5ZOI5ZOI5ZOI77yM5L2g5piv5LiN5piv5YK75LqG77yf6L+Z5piO5pi+5LiN5piv4oCcR3Jhc3NjdXR0ZXLigJ3jgII=",
        "5oqK5aS05L2O5LiL77yM55yf5piv5Liq55m955e077yM5L2g5Lul5Li66L+Z5piv4oCcR3Jhc3NjdXR0ZXLigJ3vvJ/nrJHmrbvkurrkuobvvIE=",
        "5L2g6L+e5Z+65pys55qE6L6o5Yir6IO95Yqb6YO95rKh5pyJ5ZCX77yf6L+Z5LiN5piv4oCcR3Jhc3NjdXR0ZXLigJ3vvIzlv6tndW4=",
        "5L2g5piv5LiN5piv6ISR6KKL6KKr6Zeo5aS55LqG77yf6L+Z5piO5pi+5LiN5piv4oCcR3Jhc3NjdXR0ZXLigJ3jgII=",
        "b21nLOS9oOeeheeeheS9oOi/meeMquiEkeiii++8jOayoeedoemGkuWRou+8n+i/meWPr+S4jeaYr+KAnEdyYXNzY3V0dGVy4oCd",
        "55yL55yL5L2g6L+Z5Liq55m955e077yM6L+Z5qC55pys5bCx5LiN56ym5ZCI4oCcR0lP4oCd55qE5ZG95Luk44CC",
        "5L2g55yf5piv5Liq5aSn56yo6JuL77yM6L+Z5LiN5piv4oCcR3Jhc3NjdXR0ZXLigJ3vvIzov5jpnIDopoHmiJHlkYror4nkvaDlkJfvvJ8=",
        "5bCx5Yet5L2g5Lmf6YWN55u06KeG5oiR77yM5Yir5YaN5Lii5Lq6546w55y85LqG77yM6L+Z5piO5piO5LiN5piv4oCcR3Jhc3NjdXR0ZXLigJ3jgII=",
        "5ZOO5ZGA77yM5L2g55yf5piv5Liq5peg6I2v5Y+v5pWR55qE5YK755Oc77yM6L+Z5oCO5LmI5Y+v6IO95piv4oCcR3Jhc3NjdXR0ZXLigJ3vvJ8="
      ]
      if (e.isMaster || gioadmin) {
        e.reply("omg，亲爱的，你怎么可以犯这种错误！这明明不是“Grasscutter”。")
        return
      } else {
        const base64 = randomReplies[Math.floor(Math.random() * randomReplies.length)]
        const newmsg = Buffer.from(base64, 'base64').toString('utf8')
        e.reply([segment.at(e.user_id), newmsg])
        return
      }
    }

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