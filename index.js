import fs from 'fs'

if (!global.segment) {
  global.segment = (await import("oicq")).segment
}
console.log('\x1b[36m%s\x1b[0m', '-----------------------------');
console.log('\x1b[36m%s\x1b[0m', 'GM插件0.0.2初始化~');
console.log('\x1b[36m%s\x1b[0m', 'Hi~这里是Zyy.小钰！');
console.log('\x1b[2m%s\x1b[0m', '---------------------');
//加载插件
const files = fs.readdirSync('./plugins/Zyy-GM-plugin/apps').filter(file => file.endsWith('.js'))

let ret = []

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})
console.log('\x1b[36m%s\x1b[0m', '插件加载完成啦~');
console.log('\x1b[36m%s\x1b[0m', '祝旅行者在提瓦特玩得开心哦~');
console.log('\x1b[36m%s\x1b[0m', '-----------------------------');
ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')

  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

export { apps }


