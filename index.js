import fs from 'fs'
import { exec } from "child_process"

let ret = []
let apps = {}
let appfile = './plugins/ZyyGio-Plugin'
let _path = process.cwd() + '/plugins/ZyyGio-Plugin'

if (!fs.existsSync(process.cwd() + appfile)) {
  appfile = './plugins/Zyy-GM-plugin'
}

if (!fs.existsSync(_path)) {
  _path = process.cwd() + '/plugins/Zyy-GM-plugin'
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
if (!fs.existsSync(_path + '/config')) {
  fs.mkdirSync(_path + '/config')
}

const configfiles = (fs.readdirSync(`${_path}/default_config`))
  .filter(file => !(fs.readdirSync(`${_path}/config`))
    .includes(file) && !'请勿修改此文件夹下的任何文件.txt'.includes(file))

configfiles.forEach(file => {
  fs.copyFileSync(`${_path}/default_config/${file}`, `${_path}/config/${file}`)
  logger.mark(`GIO插件：缺少文件...创建完成(${file})`)
})


if (!global.segment) {
  global.segment = (await import("oicq")).segment
}

console.log('\x1b[36m%s\x1b[0m', '-----------------------------')
console.log('\x1b[36m%s\x1b[0m', 'GM插件0.0.5初始化~')
console.log('\x1b[36m%s\x1b[0m', 'Hi~这里是Zyy.小钰！')
console.log('\x1b[2m%s\x1b[0m', '---------------------')

//加载插件
const files = fs.readdirSync(`${appfile}/apps`).filter(file => file.endsWith('.js'))


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
exec('git config --get remote.origin.url', (err, stdout, stderr) => {
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
    exec("git remote set-url origin https://gitee.com/Zyy955/ZyyGio-Plugin", (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        return
      }
      console.log('Git 仓库源已成功修改！')
    })
  }
  else if (github.includes(stdout.trim())) {
    exec("git remote set-url origin https://gitee.com/Zyy955/ZyyGio-Plugin", (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        return
      }
      console.log('Git 仓库源已成功修改！')
    })
  }
})

export { apps }