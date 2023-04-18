import fs from 'fs'
import Yaml from 'yaml'
import moment from 'moment'
let _path = process.cwd() + '/plugins/Zyy-GM-plugin'

// 处理使用环境
export async function getScenes(e = {}) {
  let value;
  let scenes;
  if (e.message_type === 'group') {
    value = 'QQ群';
    scenes = e.group_id;
  } else if (e.message_type === 'guild') {
    value = '频道';
    scenes = e.guild_id;
  } else if (e.message_type === 'private') {
    value = '私聊';
    scenes = e.user_id;
  }
  return { value, scenes };
}


// 处理GM状态  
export async function getmode(e = {}) {
  const config = Yaml.parse(fs.readFileSync(_path + '/resources/hk4e/config.yaml', 'utf8'));
  const { value, scenes } = await getScenes(e)
  let mode
  const modeEnabled = config[scenes]?.mode;
  if (modeEnabled === true) {
    mode = true;
  } else if (modeEnabled === false) {
    mode = false;
    e.reply(`GM在此${value}已经关闭`);
  } else if (modeEnabled === undefined) {
    mode = undefined;
    e.reply(`此${value}的GM插件未初始化`);
  }
  return { mode};
}


// 处理server
export async function getserver(e = {}) {
  const config = Yaml.parse(fs.readFileSync(_path + '/resources/hk4e/config.yaml', 'utf8'));
  const { scenes } = await getScenes(e)

  const ip = config[scenes]?.server.ip;
  const port = config[scenes]?.server.port;
  const region = config[scenes]?.server.region;
  const sender = 'Zyy.小钰'

  let sign
  const signswitch = config[scenes]?.server.signswitch;
  if (signswitch === "true") {
    sign = config[scenes]?.server.sign
  }
  if (signswitch === "false") {
    sign = "";
  }
  const timestamp = moment().format('YYYYMMDDHHmmss')
  const ticketping = (`Zyy${timestamp}`)
  return { ip, port, region, sign, sender, ticketping };
}


// 处理uid
export async function getuid(e = {}) {
  const config = Yaml.parse(fs.readFileSync(_path + '/resources/hk4e/config.yaml', 'utf8'));
  const { scenes } = await getScenes(e)
  const uuid = e.user_id.toString();
  const cfg = config[scenes].uid;
  let uid = cfg.find((item) => Object.keys(item)[0] === uuid);
  if (uid === undefined) {
    await this.reply([segment.at(e.user_id), `\n请先绑定UID\n格式：绑定UID@zyy\n示例：绑定10002`, segment.at(e.user_id), `\n\n温馨提示，你只有一次绑定次数，请确认你的UID再进行绑定`]);
    return;
  } else {
    uid = Object.values(uid)[0];
  }
  return { uid };
}
