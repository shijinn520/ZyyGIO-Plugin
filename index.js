import fs from 'fs'
import Yaml from 'yaml'
import { exec } from "child_process"

let ret = []
let apps = {}
const _plugin = `${import.meta.url.split('/').slice(-2, -1)[0]}`
const _path = `${process.cwd()}/plugins/${_plugin}`

logger.info('\x1b[2m%s\x1b[0m', '---------------------')
logger.info('\x1b[36m%s\x1b[0m', 'GIO插件加载中...')
logger.info('\x1b[2m%s\x1b[0m', '---------------------')

const basisfile = [
  "config/alias",
  "config/config",
  "config/Quest",
  'data',
  'data/group',
  'data/user',
  'data/alluid'
]

basisfile.forEach(folder => {
  const fullPath = `${_path}/${folder}`
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath)
  }
})

/** 配置文件检测 */
function copyFolder(source, target) {
  if (!fs.existsSync(source)) return
  if (!fs.existsSync(target)) fs.mkdirSync(target)

  const files = fs.readdirSync(source)
  files.forEach(file => {
    const sourceFile = `${source}/${file}`
    const targetFile = `${target}/${file}`
    const stats = fs.statSync(sourceFile)

    if (stats.isFile()) {
      if (!fs.existsSync(targetFile)) {
        fs.copyFileSync(sourceFile, targetFile)
        logger.info(`缺少文件...创建完成：${file}`)
      } else {
        logger.debug(`文件已存在...跳过创建：${file}`)
      }
    } else if (stats.isDirectory()) {
      if (!fs.existsSync(targetFile)) {
        copyFolder(sourceFile, targetFile)
        logger.info(`缺少文件夹...创建完成：${file}`)
      } else {
        logger.debug(`文件夹已存在...跳过创建：${file}`)
      }
    }
  })
}

['alias', 'config', 'Quest'].forEach(subDir => {
  copyFolder(`${_path}/config/default/${subDir}`, `${_path}/config/${subDir}`)
})


/** 定义全局变量ZhiYu */
global.ZhiYu = {
  _plugin: _plugin,
  _path: _path,
  apps: `${_path}/apps`,
  config: `${_path}/config/config`,
  data: `${_path}/data`,
  resources: `${_path}/resources`,
  alias: `${_path}/config/alias`,
  Quest: `${_path}/config/Quest`,
  Yzversion: JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`, 'utf8')).version,
  version: "0.0.6",
  list: {},
  Questlist: {}
}

const aliasPath = `${_path}/config/alias/command`

/** 加载命令别名列表 */
async function lists() {
  try {
    const alias = {}
    /** 每个系统加载的顺序可能不一致，得到的可能不一致，重复的键名会被后加载的覆盖 */
    const files = await fs.promises.readdir(aliasPath)
    for (const file of files) {
      if (file.endsWith('.yaml')) {
        const cfgpath = `${aliasPath}/${file}`
        const cfg = Yaml.parse(await fs.promises.readFile(cfgpath, 'utf8'))
        Object.assign(alias, cfg)
      }
    }
    /** 加载自定义GMCommand */
    const oldcfg = Yaml.parse(await fs.promises.readFile(global.ZhiYu.alias + '/command.yaml', 'utf8'))
    Object.assign(alias, oldcfg)
    global.ZhiYu.list = alias

    /** 加载任务id */
    const questPath = `${global.ZhiYu.Quest}/Quest.yaml`
    const questData = await fs.promises.readFile(questPath, 'utf8')
    const questList = Yaml.parse(questData)
    Object.assign(global.ZhiYu.Questlist, questList)

    /* 保留方法
      const Questlist = Yaml.parse(fs.readFileSync(global.ZhiYu.Quest + '/Quest.yaml', 'utf8'))
      Object.assign(global.ZhiYu.Questlist, Questlist)
       */
    logger.info("[zhiyu-plugin] 所有别名加载完毕！")
  } catch (e) {
    logger.error(`无法读取配置文件夹 ${aliasPath}:`, e)
  }
}

lists()

if (!global.segment) {
  global.segment = (await import("oicq")).segment
}

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

logger.info('\x1b[36m%s\x1b[0m', `zhiyi-plugin ${global.ZhiYu.version} 初始化~`)
logger.info('\x1b[36m%s\x1b[0m', '祝旅行者在提瓦特玩得开心哦~')
logger.info('\x1b[36m%s\x1b[0m', '-----------------------------')

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