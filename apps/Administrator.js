/*
 * @Author: Zyy.小钰 1072411694@qq.com
 * @Date: 2023-06-21 20:01:21
 * @LastEditors: Zyy.小钰 1072411694@qq.com
 * @LastEditTime: 2023-07-01 13:11:15
 * @FilePath: \Miao-Yunzai\plugins\Zyy-GM-plugin\apps\Administrator.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from 'fs'
import Yaml from 'yaml'
import crypto from 'crypto'
import moment from 'moment'
import fetch from 'node-fetch'
import { admin } from './rule.js'
import { exec } from "child_process"
import plugin from '../../../lib/plugins/plugin.js'
import { getScenes, getmode, getpath, getadmin, getserver } from './index.js'

const { _path, data, config } = await getpath()

export class administrator extends plugin {
  constructor() {
    super({
      name: 'Administrator',
      dsc: '插件关键性功能',
      event: 'message',
      priority: -100,
      rule: admin
    })
  }

  async 开启功能(e) {
    let mode = false
    const { scenes } = await getScenes(e)
    const server = Yaml.parse(fs.readFileSync(config + '/server.yaml', 'utf8'))

    if (fs.existsSync(`${data}/group/${scenes}`)) {
      mode = true
    }

    if (mode === false) {
      fs.mkdirSync(`${data}/group/${scenes}`)
      const servervalues = Object.values(server)[0]
      fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(servervalues))
      fs.mkdirSync(`${data}/group/${scenes}/cdk`)
      fs.mkdirSync(`${data}/group/${scenes}/txt`)
      fs.writeFileSync(`${data}/group/${scenes}/alluid.yaml`, ' - "10001"\n')
    }

    const cfg = Yaml.parse(fs.readFileSync(`${data}/group/${scenes}/config.yaml`, 'utf8'))
    if (e.msg === "开启gm" || e.msg === "开启GM") {
      if (cfg.gm.mode === true) {
        e.reply("GM当前已经开启，无需重复开启")
        return
      }
      else {
        cfg.gm.mode = true
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "开启邮件") {
      if (cfg.mail.mode === true) {
        e.reply("邮件当前已经开启，无需重复开启")
        return
      }
      else {
        cfg.mail.mode = true
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "开启生日" || e.msg === "开启生日推送") {
      if (cfg.birthday.mode === true) {
        e.reply("生日推送当前已经开启，无需重复开启")
        return
      }
      else {
        const birthday = Yaml.parse(fs.readFileSync(config + '/birthday.yaml', 'utf8'))
        if (birthday[scenes]) {
          console.log("已存在对应的服务器配置，跳过创建")
        } else {
          birthday[scenes] = {
            mode: true,
            id: 99,
            ip: "192.168.1.1",
            port: 22100,
            region: "dev_gio",
            sign: ""
          }
          fs.writeFileSync(config + '/birthday.yaml', Yaml.stringify(birthday), 'utf8')
          e.reply("当前为首次开启，请使用“切换生日服务器+ID”进行配置服务器")
        }
        cfg.birthday.mode = true
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "开启签到") {
      if (cfg.CheckIns.mode === true) {
        e.reply("每日签到当前已经开启，无需重复开启")
        return
      }
      else {
        cfg.CheckIns.mode = true
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "开启cdk" || e.msg === "开启CDK") {
      if (cfg.cdk.mode === true) {
        e.reply("CDK当前已经开启，无需重复开启")
        return
      }
      else {
        cfg.cdk.mode = true
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "开启在线玩家" || e.msg === "开启ping") {
      if (cfg.ping.mode === true) {
        e.reply("在线玩家当前已经开启，无需重复开启")
        return
      }
      else {
        cfg.ping.mode = true
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "开启cdk生成" || e.msg === "开启CDK生成") {
      if (cfg.generatecdk.mode === true) {
        e.reply("CDK生成当前已经开启，无需重复开启")
        return
      }
      else {
        const getthefolder = (folder) =>
          fs.readdirSync(folder, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)

        const folder = `${data}/group`
        const allfolder = getthefolder(folder) // 得到所有已经初始化的群列表

        const allgroup = allfolder.map((group, index) => `${index + 1}. ${group}`).join("\n")
        e.reply(`群聊列表：\n${allgroup}\n\n输入序号\n选择生成的cdk在哪个群聊使用`)
        this.setContext('cdk1')
        return { scenes, allgroup }
      }
    }

    if (e.msg !== "开启cdk生成" && e.msg !== "开启CDK生成") {
      this.功能列表(e)
    }
  }

  async cdk1() {
    const { scenes } = await getScenes(this.e)
    const getthefolder = (folder) =>
      fs.readdirSync(folder, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)

    const folder = `${data}/group`
    const allfolder = getthefolder(folder)

    const file = `${data}/group/${scenes}/config.yaml`
    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
    if (!allfolder[this.e.message[0].text - 1]) {
      this.reply("序号错误")
      return
    }
    cfg.generatecdk.mode = true
    cfg.generatecdk.group = allfolder[this.e.message[0].text - 1]

    fs.writeFileSync(file, Yaml.stringify(cfg))
    this.reply(`成功开启\n可使用指令：生成cdk\n当前群聊：${scenes}\ncdk兑换群聊：${cfg.generatecdk.group}`)
    this.finish('cdk1')
  }

  async 关闭功能(e) {
    const { scenes } = await getScenes(e)
    if (!(fs.existsSync(`${data}/group/${scenes}`))) {
      e.reply(`当前${scenes}还未初始化`)
      return
    }

    const cfg = Yaml.parse(fs.readFileSync(`${data}/group/${scenes}/config.yaml`, 'utf8'))

    if (e.msg === "关闭gm" || e.msg === "关闭GM") {
      if (cfg.gm.mode === false) {
        e.reply("GM当前已经关闭，无需重复关闭")
        return
      }
      else {
        cfg.gm.mode = false
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "关闭邮件") {
      if (cfg.mail.mode === false) {
        e.reply("邮件当前已经关闭，无需重复关闭")
        return
      }
      else {
        cfg.mail.mode = false
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "关闭生日" || e.msg === "关闭生日推送") {
      if (cfg.birthday.mode === false) {
        e.reply("生日推送当前已经关闭，无需重复关闭")
        return
      }
      else {
        const birthday = Yaml.parse(fs.readFileSync(config + '/birthday.yaml', 'utf8'))
        birthday[scenes].mode = false
        fs.writeFileSync(config + '/birthday.yaml', Yaml.stringify(birthday), 'utf8')

        cfg.birthday.mode = false
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "关闭签到") {
      if (cfg.CheckIns.mode === false) {
        e.reply("每日签到当前已经关闭，无需重复关闭")
        return
      }
      else {
        cfg.CheckIns.mode = false
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "关闭cdk生成" || e.msg === "关闭CDK生成") {
      if (cfg.generatecdk.mode === false) {
        e.reply("CDK生成当前已经关闭，无需重复关闭")
        return
      }
      else {
        cfg.generatecdk.mode = false
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "关闭cdk" || e.msg === "关闭CDK") {
      if (cfg.cdk.mode === false) {
        e.reply("CDK当前已经关闭，无需重复关闭")
        return
      }
      else {
        cfg.cdk.mode = false
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }

    if (e.msg === "关闭在线玩家" || e.msg === "关闭ping") {
      if (cfg.ping.mode === false) {
        e.reply("在线玩家当前已经关闭，无需重复关闭")
        return
      }
      else {
        cfg.ping.mode = false
        fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      }
    }
    this.功能列表(e)
  }

  async 功能列表(e) {
    const { value, scenes } = await getScenes(e)
    if (!(fs.existsSync(`${data}/group/${scenes}`))) {
      e.reply(`当前${scenes}还未初始化`)
      return
    }

    const cfg = Yaml.parse(fs.readFileSync(`${data}/group/${scenes}/config.yaml`, 'utf8'))
    const gm = cfg.gm.mode ? "✔️" : "关闭"
    const mail = cfg.mail.mode ? "✔️" : "关闭"
    const birthday = cfg.birthday.mode ? "✔️" : "关闭"
    const CheckIns = cfg.CheckIns.mode ? "✔️" : "关闭"
    const generatecdk = cfg.generatecdk.mode ? "✔️" : "关闭"
    const cdk = cfg.cdk.mode ? "✔️" : "关闭"
    const ping = cfg.ping.mode ? "✔️" : "关闭"

    const server = Yaml.parse(fs.readFileSync(`${config}/server.yaml`, 'utf8'))
    const id = cfg.server.id
    let name
    for (const key in server) {
      if (server.hasOwnProperty(key) && server[key].server.id === id) {
        name = key
      }
    }

    e.reply(`功能列表：\nGM：${gm}\n邮件：${mail}\n生日推送：${birthday}\n每日签到：${CheckIns}\ncdk生成：${generatecdk}\ncdk：${cdk}\n在线玩家：${ping}\n\n当前环境：${value}\n当前环境ID：${scenes}\n当前服务器ID：${id}\n当前服务器名称：${name}`)
  }


  async 设置管理员(e) {
    const file = `${data}/user/${e.at}.yaml`
    if (fs.existsSync(file)) {
      const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
      if (cfg.Administrator) {
        e.reply(`这人已经是狗管理的一员了！`)
        return
      }
      cfg.Administrator = true
      fs.writeFileSync(file, Yaml.stringify(cfg))
      e.reply([segment.at(e.at), `￣へ￣\n恭喜你成为狗管理！`])
    }
    else {
      const admin = {
        uid: 0,
        Administrator: true,
        total_signin_count: 0,
        last_signin_time: "1999-12-12 00:00:00"
      }
      fs.writeFileSync(file, Yaml.stringify(admin))
      e.reply([segment.at(e.at), `￣へ￣\n恭喜你成为狗管理！`])
    }
  }

  async 解除管理员(e) {
    const file = `${data}/user/${e.at}.yaml`
    if (fs.existsSync(file)) {
      const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
      if (!cfg.Administrator) {
        e.reply("￣へ￣ 才不告诉你，这人都不是管理~")
        return
      }
      cfg.Administrator = false
      fs.writeFileSync(file, Yaml.stringify(cfg))
      e.reply([segment.at(e.at), "解绑成功"])
    }
    else {
      e.reply("￣へ￣ 才不告诉你，这人都不是管理~1")
    }
  }

  async 绑定UID(e) {
    const { gm, mail, birthday, CheckIns, generatecdk, cdk, ping } = await getmode(e)
    if (!gm && !mail && !birthday && !CheckIns && !generatecdk && !cdk && !ping) return
    const { scenes } = await getScenes(e)

    if (e.msg.includes('绑架')) {
      if (e.isMaster) {
        e.reply("qaq，不可以绑架主人哦~")
      } else if (gioadmin) {
        e.reply("qaq，不可以绑架管理员哦~")
      } else {
        if (Math.random() < 0.5) {
          e.reply("哼哼，绑架成功！这人是你的啦！")
        } else {
          e.reply("倒霉蛋，才不要被你绑架略略略！")
        }
      }
      return
    }

    let uid = e.msg.replace(/绑定|\s|\W/g, '').replace(/[^0-9]/g, '')

    if (!uid) {
      e.reply([segment.at(e.user_id), `￣へ￣ UID呢！我问你UID呢！`])
      return
    }

    if (!/^(100|137|138)\d{6}$/.test(uid)) {
      e.reply([segment.at(e.user_id), `非本服务器UID，请下载正版四叶草服`])
      return
    }

    let uuid = e.user_id
    let yamlfile = false
    const alluid = `${data}/group/${scenes}/alluid.yaml`
    const { gioadmin } = await getadmin(e)

    if (e.isMaster || gioadmin) {
      if (e.at) {
        uuid = e.at
      }
    }

    const file = `${data}/user/${uuid}.yaml`
    if (fs.existsSync(file)) {
      yamlfile = true
    }

    if (e.isMaster || gioadmin) {
      if (!yamlfile) {
        const admin = {
          uid: uid,
          Administrator: false,
          total_signin_count: 0,
          last_signin_time: "1999-12-12 00:00:00"
        }
        fs.writeFileSync(file, Yaml.stringify(admin))
      }
      if (yamlfile) {
        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        cfg.uid = uid
        fs.writeFileSync(file, Yaml.stringify(cfg))
      }
    }
    else {
      if (yamlfile) {
        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        e.reply([segment.at(uuid), `\n当前已绑定的UID：${cfg.uid}\n如需换绑，请联系管理人员，请遵守规则哦`])
        return
      }

      if (!yamlfile) {
        const admin = {
          uid: uid,
          Administrator: false,
          total_signin_count: 0,
          last_signin_time: "1999-12-12 00:00:00"
        }
        fs.writeFileSync(`${data}/user/${this.e.user_id}.yaml`, Yaml.stringify(admin))
      }
    }

    // 写入全服uid
    const existingstrings = []
    const readstream = fs.createReadStream(alluid, { encoding: 'utf8' })
    readstream.on('data', (chunk) => {
      existingstrings.push(chunk)
    })
    readstream.on('end', () => {
      const existingdata = existingstrings.join('')
      const existingArray = Yaml.parse(existingdata)
      const isUidExists = existingArray.includes(uid)

      if (!isUidExists) {
        const stream = fs.createWriteStream(alluid, { flags: 'a' })
        stream.write(` - "${parseInt(uid)}"\n`)
        stream.end()
      }
    })
    e.reply([segment.at(uuid), `绑定成功\n你的UID为：${uid}`])
  }

  async 服务器列表(e) {
    const { gm, mail, birthday, CheckIns, generatecdk, cdk, ping } = await getmode(e)
    if (!gm && !mail && !birthday && !CheckIns && !generatecdk && !cdk && !ping) return
    const { scenes } = await getScenes(e)
    const list = []
    const cfg = Yaml.parse(fs.readFileSync(`${data}/group/${scenes}/config.yaml`, 'utf8'))
    const server = Yaml.parse(fs.readFileSync(config + '/server.yaml', 'utf8'))

    Object.keys(server).forEach((key) => {
      const servername = key
      const serverid = server[key].server.id
      let element = `${serverid}：${servername}`
      if (serverid === cfg.server.id) {
        element += " ✔️"
      }
      list.push(element)
    })
    e.reply(`当前服务器列表:\n${list.join('\n')}\n通过【切换服务器+ID】进行切换`)
  }

  async 切换服务器(e) {
    const { gm, mail, birthday, CheckIns, generatecdk, cdk, ping } = await getmode(e)
    if (!gm && !mail && !birthday && !CheckIns && !generatecdk && !cdk && !ping) return
    const { scenes } = await getScenes(e)
    const list = []
    const cfg = Yaml.parse(fs.readFileSync(`${data}/group/${scenes}/config.yaml`, 'utf8'))
    const server = Yaml.parse(fs.readFileSync(config + '/server.yaml', 'utf8'))
    const id = parseInt(e.msg.replace(/\D/g, ''))

    function name(obj, value) {
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          if (obj[key].id === value) {
            return key
          } else {
            const result = name(obj[key], value)
            if (result) {
              return key
            }
          }
        }
      }
      return null
    }

    const servername = name(server, id)
    if (servername) {
      cfg.server = server[servername].server
      fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
      Object.keys(server).forEach((key) => {
        const servername = key
        const serverid = server[key].server.id
        let element = `${serverid}：${servername}`
        if (serverid === cfg.server.id) {
          element += " ✔️"
        }
        list.push(element)
      })
      e.reply(`当前服务器列表:\n${list.join('\n')}\n通过【切换服务器+ID】进行切换`)
    }
    else {
      e.reply("服务器ID错误")
    }
  }

  async 切换生日邮件服务器(e) {
    const { birthday } = await getmode(e)
    if (!birthday) return
    const { scenes } = await getScenes(e)
    const cfg = Yaml.parse(fs.readFileSync(config + '/birthday.yaml', 'utf8'))
    const server = Yaml.parse(fs.readFileSync(config + '/server.yaml', 'utf8'))
    const id = parseInt(e.msg.replace(/\D/g, ''))

    function name(obj, value) {
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          if (obj[key].id === value) {
            return key
          } else {
            const result = name(obj[key], value)
            if (result) {
              return key
            }
          }
        }
      }
      return null
    }

    const servername = name(server, id)
    if (servername) {
      cfg[scenes].id = server[servername].server.id
      cfg[scenes].ip = server[servername].server.ip
      cfg[scenes].port = server[servername].server.port
      cfg[scenes].region = server[servername].server.region
      if (server[servername].server.signswitch === "true") {
        cfg[scenes].sign = server[servername].server.sign
      } else {
        cfg[scenes].sign = ""
      }
      fs.writeFileSync(config + '/birthday.yaml', Yaml.stringify(cfg), 'utf8')
      const list = []
      Object.keys(server).forEach((key) => {
        const servername = key
        const serverid = server[key].server.id
        let element = `${serverid}：${servername}`
        if (serverid === cfg[scenes].id) {
          element += " ✔️"
        }
        list.push(element)
      })
      e.reply(`当前生日邮件服务器列表:\n${list.join('\n')}\n通过【切换生日服务器+ID】进行切换`)
    }
    else {
      e.reply("服务器ID错误")
    }
  }

  async 添加UID(e) {
    const { gm, mail, birthday, CheckIns, generatecdk, cdk } = await getmode(e)
    if (!gm && !mail && !birthday && !CheckIns && !generatecdk && !cdk) return
    const { scenes } = await getScenes(e)
    const yamlfile = `${data}/group/${scenes}/alluid.yaml`
    const msg = e.msg.split(' ')
    const start = parseInt(msg[1])
    const end = parseInt(msg[2])

    const numbers = Array.from({ length: end - start + 1 }, (_, i) => i + start)
    const strings = numbers.map(n => n.toString())
    const existingdata = fs.createReadStream(yamlfile, 'utf8')
    const existingstrings = []

    existingdata.on('data', chunk => {
      existingstrings.push(chunk)
    })

    existingdata.on('end', () => {
      const parsedExistingData = Yaml.parse(existingstrings.join(''))
      strings.push(...parsedExistingData)
      const uniquestrings = [...new Set(strings)]

      const writeStream = fs.createWriteStream(yamlfile)
      uniquestrings.forEach(s => writeStream.write(` - "${parseInt(s)}"\n`))
      writeStream.end()
      e.reply(`已将${start}开始到${end}的所有UID添加到全服UID中`)
    })
  }

  async 插件更新(e) {
    let local
    e.reply("GM插件更新中...")

    exec("git pull --no-rebase", { cwd: `${_path}` }, function (error, stdout) {
      if (/Already up[ -]to[ -]date/.test(stdout)) {
        exec('git log -1 --format="%h %cd %s" --date=iso', { cwd: `${_path}` }, function (error, stdout) {
          if (error) {
            console.error(`exec error: ${error}`)
            return
          }

          const gitlog = stdout.split(' ')
          local = gitlog
          e.reply(`GM插件已经是最新版本...\n最新更新时间：${local[1] + ' ' + local[2]}\n最新提交信息：${local.slice(4).join(' ')}`)
        })
        return true
      }

      if (error) {
        console.log(error)
        if (/be overwritten by merge/.test(error.message)) {
          const Error = error.message
            .replace(/Command failed/gi, '命令失败')
            .replace(/error: Your local changes to the following files would be overwritten by merge/gi, '错误：您对以下文件的本地更改将被合并覆盖')
            .replace(/Please commit your changes or stash them before you merge/gi, '请在合并之前提交更改或存储它们')
            .replace(/error: The following untracked working tree files would be overwritten by merge/gi, '错误：以下未跟踪的工作树文件将被合并覆盖')
            .replace(/Please move or remove them before you merge/gi, '请在合并之前移动或删除它们')
            .replace(/Aborting/gi, '中止')
          e.reply(`存在冲突：\n${Error}\n` + '请解决冲突后再更新，或者执行 强制更新GM，放弃本地修改')
          return
        }
        if (/Failed to connect|unable to access|CONFLICT/.test(error.message)) {
          const Error = error.message
            .replace(/Command failed/gi, '命令失败')
            .replace(/fatal: unable to access/gi, '致命：无法访问')
            .replace(/Recv failure: Connection was reset/gi, 'Recv 失败：连接已重置')
            .replace(/ Couldn't connect to server/gi, '无法连接到服务器')
            .replace(/port/gi, '端口')
            .replace(/Failed to connect to/gi, '无法连接到')
            .replace(/after/gi, '之后')
            .replace(/ms/gi, '毫秒')
          e.reply(`连接超时：\n${Error}\n` + '请检查网络连接')
          return
        }
      }
      exec('git log -1 --format="%h %cd %s" --date=iso', { cwd: `${_path}` }, function (error, stdout) {
        if (error) {
          console.error(`exec error: ${error}`)
          return
        }

        const gitlog = stdout.split(' ')
        local = gitlog
        e.reply(`更新成功...\n请手动重启...\n最新更新时间：${local[1] + ' ' + local[2]}\n最新提交信息：${local.slice(4).join(' ')}`)
      })
    })

    return true
  }

  async 强制更新(e) {
    let local
    e.reply("正在强制更新GM插件...")

    exec('git log -1 --format="%h %cd %s" --date=iso', { cwd: `${_path}` }, function (error, stdout) {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }

      const gitlog = stdout.split(' ')
      local = gitlog
    })

    exec("git reset --hard origin/syc", { cwd: `${_path}` }, function (error, stdout) {
      const hash = stdout.replace(/HEAD is now at /gi, '').split(' ')[0]
      if (hash === local[0]) {
        e.reply(`GM插件已经是最新版本...\n最新更新时间：${local[1] + ' ' + local[2]}\n最新提交信息：${local.slice(4).join(' ')}`)
        return
      }
      if (error) {
        console.log(`未知错误：\n`, error)
        return
      }

      exec('git log -1 --format="%h %cd %s" --date=iso', { cwd: `${_path}` }, function (error, stdout) {
        if (error) {
          console.error(`exec error: ${error}`)
          return
        }

        const gitlog = stdout.split(' ')
        local = gitlog
        e.reply(`强制更新完成，请手动重启\n最新更新时间：${local[1] + ' ' + local[2]}\n最新提交信息：${local.slice(4).join(' ')}`)
      })
    })
    return true
  }

  async 封禁玩家(e) {
    const { gm, mail, birthday, CheckIns, generatecdk, cdk, ping } = await getmode(e)
    if (!gm && !mail && !birthday && !CheckIns && !generatecdk && !cdk && !ping) return

    let time
    let uid = e.msg

    /** 封禁显示文本 */
    let msg = "数据异常，账号已被封禁..."

    /** 封建时间=当前时间 */
    const begin_time = moment().format('YYYY-MM-DD HH:mm:ss')

    /** 解禁时间=当前时间+10年 */
    let end_time = moment(begin_time).add(10, 'years').format('YYYY-MM-DD HH:mm:ss')

    if (e.msg.includes("一键")) {
      uid = [uid.replace(/[^0-9]/g, "")]
      if (!e.at && !uid) {
        e.reply([segment.at(e.user_id), "...uid捏！你不发UID等下我把你禁了~"])
        return
      }
      if (e.at) {
        const file = data + `/user/${e.at}.yaml`
        if (!fs.existsSync(file)) {
          e.reply([segment.at(e.user_id), "他没绑定过UID..."])
          return
        }
        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        uid = [cfg.uid]
      }
    } else if (e.msg.includes("解")) {
      end_time = moment(begin_time).add(2, 'seconds').format('YYYY-MM-DD HH:mm:ss')
      uid = [uid.replace(/[^0-9]/g, "")]
      if (!e.at && !uid) {
        e.reply("格式错误...\n格式1：封禁@玩家 90天 开挂\n格式2：封禁UID 90天 开挂\n格式3：一键封禁@玩家\n格式4：一键封禁uid\n\n温馨提示：\n封禁时长只支持(天|日|周|月|年)这些单位\n封禁理由请不要使用彩色文本，会导致请求错误...")
        return
      }
      if (e.at) {
        const file = data + `/user/${e.at}.yaml`
        if (!fs.existsSync(file)) {
          e.reply([segment.at(e.user_id), "他没绑定过UID..."])
          return
        }
        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        uid = [cfg.uid]
      }
    } else {
      const msgs = uid.replace(/拉黑|封禁/g, '').trim().split(' ')
      if (msgs.length === 2 && e.at) {
        const file = data + `/user/${e.at}.yaml`
        if (!fs.existsSync(file)) {
          e.reply([segment.at(e.user_id), "他没绑定过UID..."])
          return
        }
        const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
        uid = [cfg.uid]
        time = msgs[0]
        msg = msgs[1]
      } else if (msgs.length === 3) {
        uid = [msgs[0]]
        time = msgs[1]
        msg = msgs[2]
      } else {
        e.reply("格式错误...\n格式1：封禁@玩家 90天 开挂\n格式2：封禁UID 90天 开挂\n格式3：一键封禁@玩家\n格式4：一键封禁uid\n\n温馨提示：\n封禁时长只支持(天|日|周|月|年)这些单位\n封禁理由请不要使用彩色文本，会导致请求错误...")
        return
      }

      let duration = 0  // 获取需要增加的时间

      // 替换中文为数字
      time = time
        .replace(/一/g, '1')
        .replace(/二/g, '2')
        .replace(/三/g, '3')
        .replace(/四/g, '4')
        .replace(/五/g, '5')
        .replace(/六/g, '6')
        .replace(/七/g, '7')
        .replace(/八/g, '8')
        .replace(/九/g, '9')
        .replace(/十/g, '10')

      // 将用户输入的时间转为毫秒
      if (time.includes("天") || time.includes("日")) {
        duration = parseInt(time) * 24 * 60 * 60 * 1000
      } else if (time.includes("周")) {
        duration = parseInt(time) * 7 * 24 * 60 * 60 * 1000
      } else if (time.includes("月")) {
        duration = parseInt(time) * 30 * 24 * 60 * 60 * 1000
      } else if (time.includes("年")) {
        duration = parseInt(time) * 365 * 24 * 60 * 60 * 1000
      } else {
        // 不存在以上时间单位，输出错误
        e.reply("时间格式错误...\n格式1：封禁@玩家 90天 开挂\n格式2：封禁UID 90天 开挂\n\n温馨提示：\n封禁时长只支持(天|日|周|月|年)这些单位\n封禁理由请不要使用彩色文本，会导致请求错误...")
        return
      }
      end_time = moment(begin_time).add(duration).format('YYYY-MM-DD HH:mm:ss')
    }

    const { ip, port, region, sign, ticketping } = await getserver(e)
    const urls = []
    uid.forEach(uid => {
      const signingkey = { cmd: '1103', uid: uid, begin_time: begin_time, end_time: end_time, region: region, msg: msg, ticket: ticketping }
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
    Promise.all(fetchResults)
      .then(responses => {
        responses.forEach(response => {
          if (response.ok) {
            response.json()
              .then(outcome => {
                console.log("完整响应：", outcome)
                const retcode = outcome.retcode
                if (retcode === 0) {
                  logger.mark(`[error-ban][${e.sender.card || e.sender.nickname}(${e.user_id}-${uid})][${e.msg}][${JSON.stringify(outcome).replace(/[{}]/g, '')}]`)
                  if (e.msg.includes("解")) {
                    e.reply([segment.at(e.user_id), `已解除玩家${uid}的封禁`])
                  } else {
                    e.reply([segment.at(e.user_id), `\n封禁成功\n封禁玩家：${uid}\n封禁原因：${msg}\n解禁时间：${end_time}`])
                  }
                }
                else {
                  logger.mark(`[error-ban][${e.sender.card || e.sender.nickname}(${e.user_id}-${uid})][${e.msg}][${JSON.stringify(outcome).replace(/[{}]/g, '')}]`)
                  e.reply([segment.at(e.user_id), `\n失败 -> 请把此内容反馈给作者\nUID:${uid}\n反馈内容：\n${JSON.stringify(outcome)}`])
                }
              })
          } else {
            e.reply([segment.at(e.user_id), `请求错误，请前往控制台查看原因`])
          }
        })
      })
      .catch(error => {
        console.error(error)
        e.reply([segment.at(e.user_id), `请求错误，请前往控制台查看原因`])
      })
  }
}
