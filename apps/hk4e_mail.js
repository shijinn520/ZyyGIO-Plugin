import plugin from '../../../lib/plugins/plugin.js'
import http from 'http'
import Yaml from 'yaml'
import fs from 'fs'
import crypto from 'crypto'
import { mail } from './rule.js';
import { getmode, getserver, getuid } from './index.js'

let _path = process.cwd() + '/plugins/Zyy-GM-plugin'

export class hk4e extends plugin {
    constructor() {
        super({
            name: 'hk4e-邮件',
            dsc: 'hk4e-邮件',
            event: 'message',
            priority: -100,
            rule: mail
        })
    }

    async 邮件(e) {
        e.reply([segment.at(e.user_id), `请等待执行完毕，禁止重复输入！`]);
        const maxRetries = 3;
        let retries = 0;
        let disposition;
        let result = null;
                
        const { mode } = await getmode(e);
        const { uid } = await getuid(e);
        if (mode === false || mode === undefined) {
            console.log(`重试请求已停止，因为GM的状态为 ${mode}。`);
            return;
        } else if (uid === undefined) {
            console.log(`此用户未绑定UID，已停止重试`);
            return;
          }
        
          while (retries < maxRetries) {
            try {
              disposition = await makeRequest();
              if (disposition) {
                result = disposition;
                break;
              }
            } catch (error) {
              console.error(`第 ${retries + 1} 次请求失败：${error.message}`);
              e.reply(`请求失败->正在重试->(${retries + 1} / ${maxRetries})`);
            }
            retries++;
            if (retries === maxRetries) {
              e.reply([segment.at(e.user_id), '请求全部失败，请检查你的在线状态、UID是否正确']);
            }
          }
        

        if (disposition) {
            const retcode = disposition.retcode;
            if (retcode === 0) {
                const dispositionuid = parseInt(disposition.data.uid)
                e.reply([segment.at(e.user_id), `\n成功 -> ${dispositionuid}`]);
            }
            else if (retcode === 617) {
                e.reply([segment.at(e.user_id), `\n失败 -> 邮件物品超过限制`]);
            }
            else if (retcode === 1002) {
                e.reply([segment.at(e.user_id), `\n失败 -> ${disposition.msg}`]);
            }
            else if (retcode === 1003) {
                e.reply([segment.at(e.user_id), `\n失败 -> 服务器验证签名错误`]);
            }
            else if (retcode === 1010) {
                e.reply([segment.at(e.user_id), `\n失败 -> 服务器区服错误`]);
            }
            else if (retcode === 1311) {
                e.reply([segment.at(e.user_id), `\n失败 -> 禁止发送「创世结晶」`]);
            }
            else if (retcode === 1312) {
                e.reply([segment.at(e.user_id), `\n失败 -> 游戏货币超限`]);
            }
            else if (retcode === 2028) {
                e.reply([segment.at(e.user_id), `\n失败 -> 邮件日期设置错误，请修改[expire_time]`]);
            }
            else {
                e.reply([segment.at(e.user_id), `\n失败 -> 请把此内容反馈给作者\n反馈内容：`,disposition]);
            }
        }

        async function makeRequest() {
            const { uid } = await getuid(e);
            const { ip, port, region, sign, ticketping, sender } = await getserver(e);
            const { mode } = await getmode(e);
            if (mode === true) {
                const config_id = '0';
                const now = Math.floor(Date.now() / 1000);
                const thirtyDaysLater = now + (30 * 24 * 60 * 60);
                const expire_time = thirtyDaysLater.toString();
                const importance = '0';
                const tag = '0';
                const source_type = '0';
                const item_limit_type = '1';
                const is_collectible = "false";
                const mail = Yaml.parse(fs.readFileSync(_path + '/resources/hk4e/mail.yaml', 'utf8'));
                const msg = e.msg.split(' ');
                let title = msg[1];
                let content = msg[2];
                let item_list = msg[3];

                const topLevelKeys = Object.keys(mail);
                for (let i = 0; i < topLevelKeys.length; i++) {
                    const key = topLevelKeys[i];
                    if (key === msg[1]) {
                        title = mail[key].title;
                        content = mail[key].content;
                        item_list = mail[key].item_list;
                        break;
                    }
                }
                // 计算签名
                const signingkey = {
                    cmd: '1005',
                    uid: uid,
                    region: region,
                    config_id: config_id,
                    content: content,
                    expire_time: expire_time,
                    importance: importance,
                    is_collectible: is_collectible,
                    item_limit_type: item_limit_type,
                    item_list: item_list,
                    source_type: source_type,
                    tag: tag,
                    sender: sender,
                    title: title,
                    ticket: ticketping,
                };
                const sortedParams = Object.keys(signingkey)
                    .sort()
                    .map(key => `${key}=${signingkey[key]}`)
                    .join('&');
                const signStr = sortedParams + sign;
                const newsign = `&sign=` + crypto.createHash('sha256').update(signStr).digest('hex');

                // 处理参数
                const original = {
                    cmd: '1005',
                    uid: uid,
                    region: region,
                    config_id: config_id,
                    content: encodeURIComponent(content),
                    expire_time: expire_time,
                    importance: importance,
                    is_collectible: is_collectible,
                    item_limit_type: item_limit_type,
                    item_list: item_list,
                    source_type: source_type,
                    tag: tag,
                    sender: encodeURIComponent(sender),
                    title: encodeURIComponent(title),
                    ticket: ticketping,
                };
                const parameter = Object.keys(original)
                    .sort()
                    .map(key => `${key}=${original[key]}`)
                    .join('&');

                return new Promise((resolve, reject) => {
                    const options = {
                        host: ip,
                        port: port,
                        path: `/api?${parameter}${newsign}`,
                        method: 'GET',
                        headers: {
                            'Host': `${ip}:${port}`
                        },
                        timeout: 5000
                    };

                    const req = http.request(options, (res) => {
                        console.log(options);
                        console.log(`响应状态码: ${res.statusCode}`);
                        console.log(`响应头: ${JSON.stringify(res.headers)}`);
                        res.setEncoding('utf8');
                        let rawData = '';
                        res.on('data', (chunk) => {
                            rawData += chunk;
                        });
                        res.on('end', () => {
                            console.log(`完整响应主体: ${rawData}`);
                            try {
                                const disposition = JSON.parse(rawData);
                                resolve(disposition)
                            } catch (error) {
                                reject(`解析响应数据时出错：${error.message}`);
                            }

                        });
                    });
                    req.setTimeout(5000, () => {
                        req.abort();
                    })
                    req.on('error', (e) => {
                        console.error(`请求错误: ${e.message}`);
                        reject(new Error(`哇!连接超时啦!o(╥﹏╥)o`));
                    });
                    req.end();
                });
            }
        }
    }

}
