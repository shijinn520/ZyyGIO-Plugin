/*
 * @Author: Zyy.小钰 1072411694@qq.com
 * @Date: 2023-06-21 20:01:21
 * @LastEditors: Zyy.小钰 1072411694@qq.com
 * @LastEditTime: 2023-07-20 16:16:35
 * @FilePath: \Miao-Yunzai\plugins\Zyy-GM-plugin\apps\Administrator.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from 'fs'
import Yaml from 'yaml'
import { exec } from 'child_process'
import { GetUser, GetState } from './request.js'

const { _path, data, config } = global.ZhiYu

export class admin extends plugin {
  constructor() {
    super({
      name: 'zhiyu-plugin',
      dsc: '初始化对应功能',
      event: 'message',
      priority: -100,
      rule: [
        {
          reg: /^\#(开启|关闭).*$/gi,
          fnc: 'AppsList',
          permission: 'master'
        },
        {
          reg: /^\/?(设置|绑定|解绑|解除)管理$/,
          fnc: 'manage',
          permission: 'master'
        },
        {
          reg: /^\/?绑定(.*)$/,
          fnc: '绑定UID',
        },
        {
          reg: /^\#切换服务器(.*)$/,
          fnc: '切换服务器',
          permission: 'master'
        },
        {
          reg: /^\#服务器$/,
          fnc: 'ServerList',
          permission: 'master'
        },
        {
          reg: /^\#添加uid(.*)$/gi,
          fnc: '添加UID',
          permission: 'master'
        },
        {
          reg: /^\#(功能列表|当前功能)$/,
          fnc: 'AppStatus',
          permission: 'master'
        },
        {
          reg: /^#gio(强制)?更新$/gi,
          fnc: '插件更新',
          permission: 'master'
        }
      ]
    })
  }

  async AppsList(e) {
    const { scenes } = await GetUser(e)
    const server = Yaml.parse(fs.readFileSync(config + '/server.yaml', 'utf8'))
    /** 对应群聊配置文件夹的根路径 */
    const file = `${data}/group/${scenes}`

    /** 初始化对应群聊 */
    const create = (path) => {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
      }
    }
    create(file)
    create(`${file}/cdk`)
    create(`${file}/cdk/自定义`)
    create(`${file}/cdk/批量生成`)
    create(`${file}/txt`)

    if (!fs.existsSync(`${file}/config.yaml`)) {
      fs.writeFileSync(`${file}/config.yaml`, Yaml.stringify(Object.values(server)[0]))
    }
    const cfg = Yaml.parse(fs.readFileSync(`${file}/config.yaml`, 'utf8'))
    const alluids = `${data}/alluid/${cfg.server.ip}-${cfg.server.port}`

    if (!fs.existsSync(`${alluids}.yaml`)) {
      fs.writeFileSync(`${alluids}.yaml`, ' - "0"\n')
    }

    /** 这里默认创建一个生日邮件的初始配置 */
    const birthday = Yaml.parse(fs.readFileSync(config + '/birthday.yaml', 'utf8'))

    if (!birthday[scenes]) {
      birthday[scenes] = {
        mode: true,
        id: 99,
        ip: "192.168.1.1",
        port: 22100,
        region: "dev_gio",
        sign: ""
      }

      fs.writeFileSync(config + '/birthday.yaml', Yaml.stringify(birthday), 'utf8')
      e.reply("温馨提示：请使用 [切换服务器+ID] 进行配置默认服务器")
    }

    if (["开启CDK生成", "开启Cdk生成", "开启cdk生成"].includes(e.msg)) {
      if (cfg.生成cdk.状态 === true) {
        e.reply("CDK生成当前已经开启，无需重复开启")
        return
      }
      else {
        const getthefolder = (folder) =>
          fs.readdirSync(folder, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)

        const folder = `${data}/group`
        /** 初始化完成的群列表 */
        const allfolder = getthefolder(folder)
        if (!folder) {
          e.reply("目前没有任何初始化的群聊")
          return
        }
        const allgroup = allfolder.map((group, index) => `${index + 1}. ${group}`).join("\n")
        e.reply(`群聊列表：\n${allgroup}\n\n输入序号\n选择生成的cdk在哪个群聊使用`)
        this.setContext('CreateCDK')
      }
    } else {
      const actions = [
        { message: ["开启GM", "开启Gm", "开启gm"], feature: "GM", cfgkey: "GM" },
        { message: ["开启邮件"], feature: "邮件", cfgkey: "邮件" },
        { message: ["开启生日"], feature: "生日推送", cfgkey: "生日邮件" },
        { message: ["开启签到"], feature: "每日签到", cfgkey: "签到" },
        { message: ["开启CDK", "开启Cdk", "开启cdk"], feature: "CDK", cfgkey: "兑换码" },
        { message: ["开启在线玩家", "开启ping"], feature: "在线玩家", cfgkey: "在线玩家" },
        { message: ["开启绑定", "开启绑定UID", "开启绑定Uid", "开启绑定uid",], feature: "绑定UID", cfgkey: "UID" },
        { message: ["开启封禁", "开启封禁玩家"], feature: "封禁玩家", cfgkey: "封禁" },

        { message: ["关闭GM", "关闭Gm", "关闭gm"], feature: "GM", cfgkey: "GM" },
        { message: ["关闭邮件"], feature: "邮件", cfgkey: "邮件" },
        { message: ["关闭生日"], feature: "生日推送", cfgkey: "生日邮件" },
        { message: ["关闭签到"], feature: "每日签到", cfgkey: "签到" },
        { message: ["关闭CDK", "关闭Cdk", "关闭cdk"], feature: "CDK", cfgkey: "兑换码" },
        { message: ["关闭CDK生成", "关闭Cdk生成", "关闭cdk生成"], feature: "CDK生成", cfgkey: "生成cdk" },
        { message: ["关闭在线玩家", "关闭ping"], feature: "在线玩家", cfgkey: "在线玩家" },
        { message: ["关闭绑定", "关闭绑定UID", "关闭绑定Uid", "关闭绑定uid",], feature: "绑定UID", cfgkey: "UID" },
        { message: ["关闭封禁", "关闭封禁玩家"], feature: "封禁玩家", cfgkey: "封禁" }
      ]

      for (const action of actions) {
        if (action.message.includes(e.msg)) {
          const { feature, cfgkey } = action
          if (e.msg.includes("开启")) {
            if (cfg[cfgkey].状态 === true) {
              e.reply(`${feature}当前已经开启，无需重复开启`)
              return
            } else {
              cfg[cfgkey].状态 = true
              fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
              this.AppStatus(e)
              return
            }
          } else {
            if (cfg[cfgkey].状态 === false) {
              e.reply(`${feature}当前已经关闭，无需重复关闭`)
              return
            } else {
              cfg[cfgkey].状态 = false
              fs.writeFileSync(`${data}/group/${scenes}/config.yaml`, Yaml.stringify(cfg))
              this.AppStatus(e)
              return
            }
          }
        } else {
          e.reply(`无此功能`)
        }
      }

    }
  }

  async CreateCDK() {
    const { scenes } = await GetUser(this.e)
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
    cfg.生成cdk.状态 = true
    cfg.生成cdk.群聊id = allfolder[this.e.message[0].text - 1]

    fs.writeFileSync(file, Yaml.stringify(cfg))
    this.reply(`成功开启\n可使用指令：生成cdk\n当前群聊：${scenes}\ncdk兑换群聊：${cfg.生成cdk.group}`)
    this.finish('CreateCDK')
  }

  async AppStatus(e) {
    const { scenes } = await GetUser(e)
    if (!(fs.existsSync(`${data}/group/${scenes}`))) {
      e.reply(`当前${scenes}还未初始化`)
      return
    }

    const cfg = Yaml.parse(fs.readFileSync(`${data}/group/${scenes}/config.yaml`, 'utf8'))
    const gm = cfg.GM.状态 ? "✔️" : "关闭"
    const mail = cfg.邮件.状态 ? "✔️" : "关闭"
    const birthday = cfg.生日邮件.状态 ? "✔️" : "关闭"
    const CheckIns = cfg.签到.状态 ? "✔️" : "关闭"
    const generatecdk = cfg.生成cdk.状态 ? "✔️" : "关闭"
    const cdk = cfg.兑换码.状态 ? "✔️" : "关闭"
    const state = cfg.在线玩家.状态 ? "✔️" : "关闭"
    const UID = cfg.UID.状态 ? "✔️" : "关闭"
    const Ban = cfg.封禁.状态 ? "✔️" : "关闭"

    const server = Yaml.parse(fs.readFileSync(`${config}/server.yaml`, 'utf8'))
    const id = cfg.server.id
    let name
    for (const key in server) {
      if (server.hasOwnProperty(key) && server[key].server.id === id) {
        name = key
      }
    }

    e.reply(`功能列表：\nGM：${gm}\n邮件：${mail}\n生日推送：${birthday}\n每日签到：${CheckIns}\ncdk生成：${generatecdk}\ncdk：${cdk}\n在线玩家：${state}\n绑定UID：${UID}\n封禁玩家：${Ban}\n\n当前环境ID：${scenes}\n当前服务器ID：${id}\n当前服务器名称：${name}`)
  }

  /** 管理员相关 */
  async manage(e) {
    if (!e.at) {
      e.reply("请@需要成为管理的玩家")
      return
    }
    const file = `${data}/user/${e.at.toString().replace("qg_", "")}.yaml`
    if (!fs.existsSync(file)) {
      const admin = {
        uid: 0,
        Administrator: false,
        total_signin_count: 0,
        last_signin_time: "1999-12-12 00:00:00"
      }
      fs.writeFileSync(file, Yaml.stringify(admin))
    }
    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))

    if (["设置", "绑定"].includes(e.msg)) {
      if (cfg.Administrator) {
        e.reply(`已经是管理了哦(*^▽^*)`)
        return
      }
      cfg.Administrator = true
      fs.writeFileSync(file, Yaml.stringify(cfg))
      e.reply([segment.at(e.at), `呀，新的管理(〃'▽'〃)`])
    } else {
      if (!cfg.Administrator) {
        e.reply("你在搞什么，他又不是管理。ヽ(ー_ー)ノ")
        return
      }
      cfg.Administrator = false
      fs.writeFileSync(file, Yaml.stringify(cfg))
      e.reply("解绑成功(^_−)☆")
    }
  }

  async 绑定UID(e) {
    const { scenes, gioadmin } = await GetUser(e)
    const { UID } = await GetState(scenes)
    if (!UID) {
      if (e.isMaster || gioadmin) {
        e.reply(`\x1b[31m[ZhiYu]当前群聊 ${scenes} UID绑定功能 未初始化或已关闭\x1b[0m`)
      }
      return
    }

    const cfg = Yaml.parse(fs.readFileSync(`${data}/group/${scenes}/config.yaml`, 'utf8'))
    const uid = e.msg.replace(/[^0-9]/g, '')

    /** 检测UID是否为空 */
    if (!uid) return

    /** 读取设置的正则进行检测是否符合规则 */
    const regex = new RegExp(cfg.UID.正则)
    if (!regex.test(uid) && !e.isMaster && !gioadmin) {
      e.reply([segment.at(e.user_id), cfg.UID.提示])
      return
    }

    /** 玩家群聊ID */
    let user = e.user_id
    const alluid = `${data}/alluid/${cfg.server.ip}-${cfg.server.port}.yaml`

    /** 检测玩家是否为管理员  存在at则修改玩家id为被at的玩家 */
    if ((e.isMaster || gioadmin) && e.at) {
      user = e.at
    }

    /** 用户配置路径 */
    const file = `${data}/user/${user.toString().replace("qg_", "")}.yaml`
    // 检测是否存在对应的配置文件
    if (fs.existsSync(file)) {
      const UserCfg = Yaml.parse(fs.readFileSync(file, 'utf8'))

      if (e.isMaster || gioadmin) {
        UserCfg.uid = uid
        fs.writeFileSync(file, Yaml.stringify(UserCfg))
      } else {
        // 非管理员
        e.reply([segment.at(user), `\n当前已绑定的UID：${UserCfg.uid}\n如需换绑，请联系管理人员，请遵守规则哦`])
        return
      }
    } else {
      // 不存在配置文件
      const NewUser = {
        uid: uid,
        Administrator: false
      }
      fs.writeFileSync(file, Yaml.stringify(NewUser))
    }

    /** 添加检测防止崩溃 */
    if (!fs.existsSync(alluid)) {
      fs.writeFileSync(alluid, ' - "0"\n')
    }

    // 写入全服uid
    const existingstrings = []
    const readstream = fs.createReadStream(alluid, { encoding: 'utf8' })
    readstream.on('data', (chunk) => {
      existingstrings.push(chunk)
    })
    readstream.on('end', () => {
      const existingArray = Yaml.parse(existingstrings.join(''))
      const isUidExists = existingArray.includes(uid)

      if (!isUidExists) {
        const stream = fs.createWriteStream(alluid, { flags: 'a' })
        stream.write(` - "${parseInt(uid)}"\n`)
        stream.end()
      }
    })
    e.reply([segment.at(user), `绑定成功\n你的UID为：${uid}`])
  }

  async ServerList(e) {
    const { scenes } = await GetUser(e)
    const { GM, Mail, birthday, CheckIns, generatecdk, CDK, State, UID, Ban } = await GetState(scenes)
    if (!GM && !Mail && !birthday && !CheckIns && !generatecdk && !CDK && !State && !UID && !Ban) return

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

    /** 按照 serverid 进行升序排序 */
    list.sort((a, b) => {
      const serveridA = a.split("：")[0]
      const serveridB = b.split("：")[0]
      return serveridA.localeCompare(serveridB, undefined, { numeric: true, sensitivity: 'base' })
    })
    e.reply(`当前服务器列表:\n${list.join('\n')}\n通过【切换服务器+ID】进行切换`)
  }

  async 切换服务器(e) {
    const { scenes } = await GetUser(e)
    const { GM, Mail, birthday, CheckIns, generatecdk, CDK, State, UID, Ban } = await GetState(scenes)
    if (!GM && !Mail && !birthday && !CheckIns && !generatecdk && !CDK && !State && !UID && !Ban) return

    const list = []
    const file = `${data}/group/${scenes}/config.yaml`
    const cfg = Yaml.parse(fs.readFileSync(file, 'utf8'))
    const birthdaycfg = Yaml.parse(fs.readFileSync(`${config}/birthday.yaml`, 'utf8'))
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
      /** 写入主配置 */
      cfg.server = server[servername].server
      fs.writeFileSync(file, Yaml.stringify(cfg))

      /** 写入生日配置 */
      const gs = server[servername].server
      birthdaycfg[scenes] = {
        mode: birthday,
        id: gs.id,
        ip: gs.ip,
        port: gs.port,
        region: gs.region,
        sign: gs.sign
      }
      fs.writeFileSync(config + '/birthday.yaml', Yaml.stringify(birthdaycfg), 'utf8')

      Object.keys(server).forEach((key) => {
        const servername = key
        const serverid = server[key].server.id
        let element = `${serverid}：${servername}`
        if (serverid === cfg.server.id) {
          element += " ✔️"
        }
        list.push(element)
      })

      /** 按照 serverid 进行升序排序 */
      list.sort((a, b) => {
        const serveridA = a.split("：")[0]
        const serveridB = b.split("：")[0]
        return serveridA.localeCompare(serveridB, undefined, { numeric: true, sensitivity: 'base' })
      })
      e.reply(`当前服务器列表:\n${list.join('\n')}\n通过【切换服务器+ID】进行切换`)
    }
    else {
      e.reply("服务器ID错误")
    }
  }

  async 添加UID(e) {
    const { scenes } = await GetUser(e)
    const { UID } = await GetState(scenes)
    if (!UID) return

    const cfg = Yaml.parse(fs.readFileSync(`${data}/group/${scenes}/config.yaml`, 'utf8'))
    const yamlfile = `${data}/alluid/${cfg.server.ip}-${cfg.server.port}.yaml`
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
      e.reply(`处理完毕...已将${start}开始到${end}的所有UID添加到全服UID中`)
    })
  }

  async 插件更新(e) {
    let local
    e.reply("GM插件更新中...")

    let cmd = 'git pull --no-rebase'
    if (e.msg.includes("强制")) {
      cmd = 'git reset --hard origin/main'
    }
    const log = 'git log -1 --format="%h %cd %s" --date=iso'
    exec(cmd, { cwd: `${_path}` }, function (error, stdout) {
      if (/Already up[ -]to[ -]date/.test(stdout)) {
        exec(log, { cwd: `${_path}` }, function (error, stdout) {
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
        } else {
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
      exec(log, { cwd: `${_path}` }, function (error, stdout) {
        if (error) {
          console.error(`exec error: ${error}`)
          return
        }

        const gitlog = stdout.split(' ')
        local = gitlog
        e.reply(`更新成功...\n请手动重启...\n最新更新时间：${local[1] + ' ' + local[2]}\n最新提交信息：${local.slice(4).join(' ')}`)
      })
    })
  }
}
