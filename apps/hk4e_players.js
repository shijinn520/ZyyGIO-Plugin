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
                author: `当前${value}所有已绑定UID的玩家`
            };
            const res = await puppeteerRender.render('players', 'index', data);
            return e.reply(res);
        }
    }

    async 命令别名(e) {
        const { mode } = await getmode(e)
        if (mode === true) {
            const cfg = Yaml.parse(fs.readFileSync(_path + '/data.yaml', 'utf8'));
            const { value } = await getScenes(e)
            const keys = Object.keys(cfg);
            const data = {
                keys: keys,
                values: '',
                title: '命令别名',
                author: `当前${value}可使用的命令别名列表 ----- 使用方法：直接在别名前面加上“/”即可生效`,
            };
            const res = await puppeteerRender.render('players', 'index', data);
            return e.reply(res);
        }
    }

    async 邮件别名(e) {
        const { mode } = await getmode(e)
        if (mode === true) {
            const cfg = Yaml.parse(fs.readFileSync(_path + '/mail.yaml', 'utf8'));
            const { value } = await getScenes(e)
            const keys = Object.keys(cfg);
            const data = {
                keys: keys,
                values: '',
                title: '邮件别名',
                author: `当前${value}可使用的邮件别名列表 ----- 使用方法：直接在别名前面加上“邮件 ”即可生效，记得加空格`
            };
            const res = await puppeteerRender.render('players', 'index', data);
            return e.reply(res);
        }
    }

    async 添加命令别名(e) {
        const { mode } = await getmode(e)
        const { scenes } = await getScenes(e)
        if (mode === true) {
            if (!e.msg.includes('/')) {
                e.reply([segment.at(e.user_id), '格式错误\n正确的格式为：添加命令 别名名称 /指令1 /指令2\n示例：添加命令 货币 /mcoin 99 /hcoin 99']);
                return;
            }
            const msg = e.msg.replace('添加命令', '');
            let newmsg;
            if (msg.includes(' /')) {
                newmsg = msg.split(' /');
            } else {
                newmsg = msg.split('/');
            }

            const key = newmsg[0].replace(/^\s*([A-Za-z0-9\u4e00-\u9fa5]*)/, '$1');

            let values = [];

            for (let i = 1; i < newmsg.length; i++) {
                let value = newmsg[i].trim();
                values.push(value);
            }
            const data = Yaml.parse(fs.readFileSync(_path + '/data.yaml', 'utf8'));
            const cfg = Yaml.parse(fs.readFileSync(_path + '/config.yaml', 'utf8'));

            if (key in data) {
                if (cfg[scenes].Administrator.includes(String(e.user_id))) {
                } else {
                    e.reply([segment.at(e.user_id), `\n错误：您没有权限进行此操作`]);
                    return;
                }
            }

            data[key] = values;
            fs.writeFileSync(_path + '/data.yaml', Yaml.stringify(data), 'utf8');
            e.reply([segment.at(e.user_id), `成功\n已添加命令别名：${key}`])
        }
    }

    async 添加邮件别名(e) {
        const { mode } = await getmode(e)
        const { scenes } = await getScenes(e)
        if (mode === true) {
            const emsg = e.msg.split(' ');

            if (emsg.length !== 5) {
                e.reply([segment.at(e.user_id), '格式错误\n正确的格式为：\n添加邮件 别名名称 邮件标题 邮件内容 物品ID:数量,物品ID:数量\n\n示例：\n添加邮件 测试邮件 标题 内容 201:1,105003:1']);
                return;
            }

            if (!emsg[4].includes(':')) {
                e.reply([segment.at(e.user_id), '格式错误，最后一个元素必须包含一个冒号']);
                return;
            }

            const msg = e.msg.replace('添加邮件', '');
            const newmsg = msg.split(' ').filter(Boolean);
            const key = newmsg[0]
            const values = {
                title: newmsg[1],
                content: newmsg[2],
                item_list: newmsg[3]
            };
            const mail = Yaml.parse(fs.readFileSync(_path + '/mail.yaml', 'utf8'));
            const cfg = Yaml.parse(fs.readFileSync(_path + '/config.yaml', 'utf8'));

            if (key in mail) {
                if (cfg[scenes].Administrator.includes(String(e.user_id))) {
                } else {
                    e.reply([segment.at(e.user_id), `\n错误：此邮件别名已经存在，如需修改，请联系管理员`]);
                    return;
                }
            }

            mail[key] = values;
            fs.writeFileSync(_path + '/mail.yaml', Yaml.stringify(mail), 'utf8');
            e.reply([segment.at(e.user_id), `成功\n已添加邮件别名：${key}`]);

        }
    }
    async 用法(e) {
        e.reply([segment.at(e.user_id), `使用说明：\n1.先绑定你的游戏UID\n示例：绑定10002@你自己\n\n2.使用指令\n可使用普通指令跟邮件，详情看帮助！`])
    }
    async 救命(e) {
        e.reply([segment.at(e.user_id), `\n您好！\n我们已知悉您的问题，但我们的开发者可能过于忙碌，故可能无法第一时间告知您最佳解决方式。\n我们已经将您的问题记录并归档保存，您可能将在未来看到对此类问题的通用解决方式，请耐心等待。\n在此之前，您可以利用以下网站检索可能的解决方案:\n://www.baidu.com/\n警告:第三方网站可能包含未知的有害内容。您在第三方网站上做出任何的行为造成的损失，我们不负任何责任。\n希望能帮到您。\n\n祝好`])
    }

}