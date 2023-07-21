import fs from 'fs'
import Yaml from 'yaml'
import { exec } from "child_process"

let ret = []
let apps = {}
let _path = process.cwd()

if (fs.existsSync(`${_path}/plugins/ZyyGio-Plugin`)) {
  _path = `${_path}/plugins/ZyyGio-Plugin`
} else if (fs.existsSync(`${_path}/plugins/Zyy-GM-plugin`)) {
  _path = `${_path}/plugins/Zyy-GM-plugin`
} else {
  _path = `${_path}/plugins/ZhiYu-plugin`
}

if (!fs.existsSync(_path + '/data')) {
  fs.mkdirSync(_path + '/data')
}
if (!fs.existsSync(_path + '/data/group')) {
  fs.mkdirSync(_path + '/data/group')
}
if (!fs.existsSync(_path + '/data/user')) {
  fs.mkdirSync(_path + '/data/user')
}
if (!fs.existsSync(_path + '/data/alluid')) {
  fs.mkdirSync(_path + '/data/alluid')
}
if (!fs.existsSync(_path + '/config')) {
  fs.mkdirSync(_path + '/config')
}

const configfiles = (fs.readdirSync(`${_path}/config/default/config`))
  .filter(file => !(fs.readdirSync(`${_path}/config/config`))
    .includes(file) && !'请勿修改此文件夹下的任何文件.txt'.includes(file))

configfiles.forEach(file => {
  fs.copyFileSync(`${_path}/config/default_config/${file}`, `${_path}/config/config/${file}`)
  logger.mark(`GIO插件：缺少文件...创建完成(${file})`)
})

/** 定义全局变量ZhiYu */
global.ZhiYu = {
  _path: _path,
  apps: `${_path}/apps`,
  config: `${_path}/config/config`,
  data: `${_path}/data`,
  resources: `${_path}/resources`,
  alias: {},
  AliasList: `${_path}/config/alias`,
  Yzversion: JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`, 'utf8')).version,
  version: "0.0.6"
}

const aliasPath = `${_path}/config/alias`

try {
  const alias = {}
  /** 每个系统加载的顺序可能不一致，得到的可能不一致，重复的键名会被后加载的覆盖 */
  fs.readdirSync(aliasPath).forEach((file) => {
    if (file.endsWith('.yaml')) {
      const cfgpath = `${aliasPath}/${file}`
      const cfg = Yaml.parse(fs.readFileSync(cfgpath, 'utf8'))
      Object.assign(alias, cfg)
    }
  })
  /*   const oldcfg = Yaml.parse(fs.readFileSync(global.ZhiYu.config + '/command.yaml', 'utf8'))
    Object.assign(alias, oldcfg) */
  global.ZhiYu.alias = alias
} catch (e) {
  console.error(`无法读取配置文件夹 ${aliasPath}:`, e)
}


if (!global.segment) {
  global.segment = (await import("oicq")).segment
}

console.log('\x1b[36m%s\x1b[0m', '-----------------------------')
console.log('\x1b[36m%s\x1b[0m', 'GM插件0.0.5初始化~')
console.log('\x1b[36m%s\x1b[0m', 'Hi~这里是Zyy.小钰！')
console.log('\x1b[2m%s\x1b[0m', '---------------------')

//加载插件
const files = fs.readdirSync(`${_path}/apps`).filter(file => file.endsWith('.js'))


files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})
ret = await Promise.allSettled(ret)

for (let i in files) {
  let name = files[i].replace('.js', '')

  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

console.log('\x1b[36m%s\x1b[0m', '插件加载完成啦~')
console.log('\x1b[36m%s\x1b[0m', '祝旅行者在提瓦特玩得开心哦~')
console.log('\x1b[36m%s\x1b[0m', '-----------------------------')

// 当前的远程仓库地址
exec('git config --get remote.origin.url', { cwd: `${_path}` }, (err, stdout, stderr) => {
  if (err) {
    console.error(err)
    return
  }

  // 检测当前的远程仓库地址是否等于指定地址
  const gitee = [
    'https://gitee.com/Zyy955/Zyy-GM-plugin',
    'https://gitee.com/ZYY-Yu/Zyy-GM-plugin'
  ]

  const github = [
    'https://github.com/Zyy955/Zyy-GM-plugin',
    'https://github.com/ZYY-Yu/Zyy-GM-plugin'
  ]

  if (gitee.includes(stdout.trim())) {
    exec("git remote set-url origin https://gitee.com/Zyy955/ZyyGio-Plugin.git", { cwd: `${_path}` }, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        return
      }
      logger.mark('GIO插件：检测到旧的 Gitee 仓库源，已修改为最新的 Gitee 仓库！')
    })
  }
  else if (github.includes(stdout.trim())) {
    exec("git remote set-url origin https://github.com/Zyy955/ZyyGio-Plugin.git", { cwd: `${_path}` }, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        return
      }
      logger.mark('GIO插件：检测到旧的 Github 仓库源，已修改为最新的 Github 仓库！')
    })
  }
})

export { apps }