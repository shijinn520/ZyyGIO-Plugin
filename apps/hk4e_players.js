import plugin from '../../../lib/plugins/plugin.js'
import puppeteerRender from '../resources/render.js'
import fs from 'fs'
import Yaml from 'yaml'
import { players } from './rule.js'
import { getScenes, getmode } from './index.js'

let _path = process.cwd() + '/plugins/Zyy-GM-plugin/resources/hk4e'
const helpPath = process.cwd() + `/plugins/Zyy-GM-plugin/resources/help`
let helpList = [];
if (fs.existsSync(helpPath + "/index.json")) {
    helpList = JSON.parse(fs.readFileSync(helpPath + "/index.json", "utf8")) || [];
}

export class hk4e extends plugin {
    constructor() {
        super({
            name: 'hk4e-players',
            dsc: 'hk4e-玩家',
            event: 'message',
            priority: -200,
            rule: players
        })
    }


    async 小钰帮助(e) {
        if (helpList.length === 0) {
            e.reply("叫你乱改！文档都给你删了！");
            return;
        }

        let helpGroup = [];
        helpList.forEach((group) => {
            if (group.auth && group.auth === "master" && !this.e.isMaster) {
                return;
            }

            helpGroup.push(group);
        });

        let res = await puppeteerRender.render('help', 'index', { helpGroup });
        return e.reply(res);
    }

    async 别名帮助(e) {
        const base64 = Buffer.from(fs.readFileSync(process.cwd() + '/plugins/Zyy-GM-plugin/resources/players/help-alias.png')).toString('base64');
        await e.reply(segment.image(`base64://${base64}`));
    }

    async 玩家列表(e) {
        const { mode } = await getmode(e)
        if (mode === true) {
            const cfg = Yaml.parse(fs.readFileSync(_path + '/config.yaml', 'utf8'));
            const { value, scenes } = await getScenes(e)
            const uid = cfg[scenes].uid;
            const keys = Object.keys(uid);
            const values = Object.values(uid).map(obj => JSON.stringify(obj).replace(/[{}"]/g, ''));
            const data = {
                keys: keys,
                values: values,
                title: '玩家列表',
                description1: `当前${value}所有已绑定UID的玩家`
            };
            const res = await puppeteerRender.render('players', 'index', data);
            return e.reply(res);
        }
    }

    async 命令别名(e) {
        const { mode } = await getmode(e)
        if (mode === true) {
            const cfg = JSON.parse(fs.readFileSync(_path + '/command.json', 'utf8'));
            const keys = cfg.map(obj => {
                const key = obj[Object.keys(obj)[0]].join(' ');
                return `${Object.keys(obj)[0]} - ${key}`;
            });
            const data = {
                keys: keys,
                values: '',
                title: '命令别名',
                description1: `结构解析：[命令主别名]-[主别名] [别名1] [别名2]`,
                description2: `使用方法：在每个别名前面加上“/”，一个命令别名可以存在多个触发别名`
            };
            const res = await puppeteerRender.render('players', 'index', data);
            return e.reply(res);
        }
    }

    async 邮件别名(e) {
        const { mode } = await getmode(e)
        if (mode === true) {
            const cfg = JSON.parse(fs.readFileSync(_path + '/mail.json', 'utf8'));
            const keys = cfg.map(obj => {
                const key = obj[Object.keys(obj)[0]].join(' ');
                return `${Object.keys(obj)[0]} - ${key}`;
            });
            const data = {
                keys: keys,
                values: '',
                title: '邮件别名',
                description1: `结构解析：[邮件主别名]-[主别名] [别名1] [别名2]`,
                description2: '使用方法：在每个别名前面加上“/”，一个邮件别名可以存在多个触发别名'
            };
            const res = await puppeteerRender.render('players', 'index', data);
            return e.reply(res);
        }
    }

    async 添加命令别名(e) {
        const { mode } = await getmode(e)
        if (mode === true) {
            if (!e.msg.includes('/')) {
                e.reply([segment.at(e.user_id), '格式错误\n正确的格式为：添加命令 别名名称 /指令1 /指令2\n示例：添加命令 货币 /mcoin 99 /hcoin 99']);
                return;
            }
            let msg = e.msg.split(' ')
            const alias = msg[1].includes('/') ? msg[1].split('/') : [msg[1]]
            const key = msg[1].includes('/') ? alias[0] : alias;

            msg = msg.slice(1)
            msg = msg.join(' ')
            msg = ' ' + msg
            msg = msg.split(' /');
            msg = msg.slice(1)

            const cfg = {
                [key]: alias,
                command: msg
            }
            const data = JSON.parse(fs.readFileSync(_path + "/command.json", 'utf8'));
            let match = null;
            for (let i = 0; i < alias.length && !match; i++) {
                for (let j = 0; j < data.length && !match; j++) {
                    const values = Object.values(data[j]);
                    if ((values.some(v => Array.isArray(v) ? v.includes(alias[i]) : v === alias[i]))) {
                        match = alias[i];
                        e.reply([segment.at(e.user_id), `添加失败\n该别名 "${match}" 在 "${Object.keys(data[j])[0]}" 对象中已存在。\n如需修改该对象，请联系管理员修改`]);
                    }
                }
            }
            if (match) {
                console.log(`添加失败：命令别名 "${match}" 已存在于 JSON 文件中。`);
            } else {
                data.push(cfg);
                fs.writeFileSync(_path + "/command.json", JSON.stringify(data));
                e.reply([segment.at(e.user_id), `添加成功`]);
            }
        }
    }

    async 添加邮件别名(e) {
        const { mode } = await getmode(e)
        if (mode === true) {
            const emsg = e.msg.split(' ');
            if (emsg.length !== 5) {
                e.reply([segment.at(e.user_id), '格式错误\n正确的格式为：\n添加邮件 别名名称 邮件标题 邮件内容 物品ID:数量,物品ID:数量\n\n示例：\n添加邮件 测试邮件 标题 内容 201:1,105003:1']);
                return;
            }
            if (!emsg[4].includes(':')) {
                e.reply([segment.at(e.user_id), '格式错误，请检查 [物品ID:数量]']);
                return;
            }
            const msg = e.msg.replace('添加邮件', '');
            const newmsg = msg.split(' ').filter(Boolean);
            const alias = newmsg[0].includes('/') ? newmsg[0].split('/') : [newmsg[0]];
            const names = newmsg[0].includes('/') ? alias[0] : alias;
            const mail = {
                [names]: alias.slice(),
                title: newmsg[1],
                content: newmsg[2],
                item_list: newmsg[3]
            };
            const data = JSON.parse(fs.readFileSync(_path + "/mail.json", 'utf8'));
            let match = null;
            for (let i = 0; i < alias.length && !match; i++) {
                for (let j = 0; j < data.length && !match; j++) {
                    const values = data[j][Object.keys(data[j])[0]];
                    if ((Array.isArray(values) && values.includes(alias[i])) || values === alias[i]) {
                        match = alias[i];
                        e.reply([segment.at(e.user_id), `添加失败\n该别名 "${match}" 在 "${Object.keys(data[j])[0]}" 对象中已存在。\n如需修改该对象，请联系管理员修改`]);
                    }
                }
            }
            if (match) {
                console.log(`添加失败：邮件别名 "${match}" 已存在于 JSON 文件中。`);
            } else {
                data.push(mail);
                fs.writeFileSync(_path + "/mail.json", JSON.stringify(data));
                e.reply([segment.at(e.user_id), `添加成功：邮件别名[${newmsg[0]}]已成功添加`]);
            }
        }
    }

    async 修改命令别名(e) {
        const { mode } = await getmode(e)
        if (mode === true) {
            const config = Yaml.parse(fs.readFileSync(_path + '/config.yaml', 'utf8'));
            const { scenes } = await getScenes(e)
            const admin = config[scenes]?.Administrator;
            if (!admin || !admin.includes(e.user_id.toString())) {
                e.reply(`只有管理员才能命令我哦~\n(*/ω＼*)`)
                return;
            }
            let msg = e.msg.split(' ')
            // 处理新的指令组 newmsg
            let newmsg
            if (msg.length < 4 || msg[3].indexOf('/') === -1) {
                e.reply([segment.at(e.user_id), `格式错误\n参数：修改命令 [主别名] [主别名/别名1] [/指令1 /指令2]\n\n示例：修改命令 测试 测试/测试1 /item add 201 /item add 201`])
                return
            } else {
                newmsg = msg[3].replace('/', '')
            }
            if (msg.length > 4) {
                newmsg = msg.slice(3).join(' ').split('/').map((item) => item.trim()).filter((item) => item !== '');
            }
            // 获取旧别名
            const oldalias = msg[1]

            // 获取修改后的主别名
            const newalias = msg[2].includes('/') ? msg[2].split('/')[0] : msg[2];

            // 获取修改后的别名组
            const alias = msg[2].includes('/') ? msg[2].split('/') : msg[2];

            // 检测主别名是否一致
            if (oldalias !== newalias) {
                e.reply([segment.at(e.user_id), `${oldalias} & ${newalias} 不一致`])
                return
            }

            // 检测主别名是否存在
            const data = JSON.parse(fs.readFileSync(_path + "/command.json", 'utf8'));
            const aliasExists = data.some(command => Object.keys(command)[0] === oldalias);

            if (!aliasExists) {
                e.reply([segment.at(e.user_id), `主别名 ${oldalias} 不存在，请先添加`])
            } else {
                const cfg = data.map(command => {
                    const key = Object.keys(command)[0];
                    return { [key]: alias, command: newmsg };
                });
                fs.writeFileSync(_path + "/command.json", JSON.stringify(cfg));
                e.reply([segment.at(e.user_id), `修改成功\n${oldalias}：\n[ /${Array.isArray(alias) ? alias.join(' /') : alias} ]\n\ncommand:\n/${Array.isArray(newmsg) ? newmsg.join('\n/') : newmsg}`]);
            }
        }
    }


    async 修改邮件别名(e) {
        const { mode } = await getmode(e)
        if (mode === true) {
            const config = Yaml.parse(fs.readFileSync(_path + '/config.yaml', 'utf8'));
            const { scenes } = await getScenes(e)
            const admin = config[scenes]?.Administrator;
            if (!admin || !admin.includes(e.user_id.toString())) {
                e.reply(`只有管理员才能命令我哦~\n(*/ω＼*)`)
                return;
            }

            let msg = e.msg.split(' ')
            const title = msg[3]
            const content = msg[4]
            const item_list = msg[5]

            if (msg.length !== 6 || !msg[5].includes(':')) {
                e.reply([segment.at(e.user_id), `格式错误\n参数：修改邮件 [主别名] [主别名/别名1] [标题] [内容] [ID:数量]\n\n示例：修改邮件 测试 测试/测试1 标题 内容 201:1,201:1`])
                return
            }
            // 获取旧别名
            const oldalias = msg[1]

            // 获取修改后的主别名
            const newalias = msg[2].includes('/') ? msg[2].split('/')[0] : msg[2];

            // 获取修改后的别名组
            const alias = msg[2].includes('/') ? msg[2].split('/') : msg[2];

            // 检测主别名是否一致
            if (oldalias !== newalias) {
                e.reply([segment.at(e.user_id), `${oldalias} & ${newalias} 不一致`])
                return
            }

            // 检测主别名是否存在
            const data = JSON.parse(fs.readFileSync(_path + "/mail.json", 'utf8'));
            const aliasExists = data.some(command => Object.keys(command)[0] === oldalias);

            if (!aliasExists) {
                e.reply([segment.at(e.user_id), `主别名 ${oldalias} 不存在，请先添加`])
            } else {
                const cfg = data.map(command => {
                    const key = Object.keys(command)[0];
                    return { [key]: alias, title: title, content: content, item_list: item_list };
                });
                fs.writeFileSync(_path + "/mail.json", JSON.stringify(cfg));
                e.reply([segment.at(e.user_id), `修改成功\n${oldalias}：\n[ ${Array.isArray(alias) ? alias.join(' ') : alias} ]\n\n标题: ${title}\n内容: ${content}\n物品: ${item_list}`]);
            }
        }
    }

    async 用法(e) {
        e.reply([segment.at(e.user_id), `使用说明：\n1.先绑定你的游戏UID\n示例：绑定10002@你自己\n\n2.使用指令\n可使用普通指令跟邮件，详情看帮助！`])
    }
    async 救命(e) {
        e.reply([segment.at(e.user_id), `\n您好！\n我们已知悉您的问题，但我们的开发者可能过于忙碌，故可能无法第一时间告知您最佳解决方式。\n我们已经将您的问题记录并归档保存，您可能将在未来看到对此类问题的通用解决方式，请耐心等待。\n在此之前，您可以利用以下网站检索可能的解决方案:\n://www.baidu.com/\n警告:第三方网站可能包含未知的有害内容。您在第三方网站上做出任何的行为造成的损失，我们不负任何责任。\n希望能帮到您。\n\n祝好`])
    }

}