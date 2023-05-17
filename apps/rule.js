export const admin = [
      // 将开关修改为功能的名称
    {
        reg: '^(开启GM|开启gm|开启gm|开启签到)$',
        fnc: '开启功能',
        permission: 'master'
    },
    {
        reg: '^(关闭GM|关闭Gm|关闭gm|关闭签到)$',
        fnc: '关闭功能',
        permission: 'master'
    },
    {
        reg: '^(绑定管理|添加管理|绑定管理员|添加管理员)(.*)$',
        fnc: '绑定管理员',
        permission: 'master'
    },
    {
        reg: '^(删除管理|解绑管理|删除管理员|解绑管理员)(.*)$',
        fnc: '解绑管理员',
        permission: 'master'
    },
    {
        reg: '^\/?绑定(.*)$',
        fnc: '绑定UID',
    },
    {
        reg: '^(切换服务器)(.*)$',
        fnc: '切换服务器',
        permission: 'master'
    },
    {
        reg: '^服务器$',
        fnc: '服务器列表',
        permission: 'master'
    },
    /* 有点小问题，先禁用
    {
        reg: '^(全局拉黑|拉黑)(.*)$',
        fnc: '全局拉黑',
        permission: 'master'
    },
    {
        reg: '^(解除拉黑|删除拉黑)(.*)$',
        fnc: '解除拉黑',
        permission: 'master'
    },
    */
    {
        reg: '^(GM更新|Gm更新|gm更新|更新GM|更新Gm|更新gm)$',
        fnc: '插件更新',
        permission: 'master'
    },
    {
        reg: '^(GM强制更新|Gm强制更新|gm强制更新|强制更新GM|强制更新Gm|更新gm)$',
        fnc: '强制更新',
        permission: 'master'
    }
]

export const commands = [
    {
        reg: '^/(.*)$',
        fnc: 'GM命令'
    },
    {
        reg: '^(ping|在线玩家|在线人数|状态)$',
        fnc: '服务器状态',
    }
]

export const mail = [
    {
        reg: '^\/?邮件 (.*)$',
        fnc: '邮件'
    },
    {
        reg: '^全服邮件 (.*)$',
        fnc: '全服邮件'
    },
    {
        reg: '^添加(UID|uid|Uid) (.*)$',
        fnc: '添加UID',
        permission: 'master'
    }
]

export const players = [
    {
        reg: '^(帮助|help)(.*)$',
        fnc: '小钰帮助',
    },
    {
        reg: '^玩家列表$',
        fnc: '玩家列表',
    },
    {
        reg: '^(指令别名|命令别名)$',
        fnc: '命令别名',
    },
    {
        reg: '^邮件别名$',
        fnc: '邮件别名',
    },
    {
        reg: '^添加命令 (.*)$',
        fnc: '添加命令',
    },
    {
        reg: '^添加邮件 (.*)$',
        fnc: '添加邮件',
    },
    {
        reg: '^别名帮助$',
        fnc: '别名帮助',
    },
    {
        reg: '^查看(命令|邮件)(?:别名)?(.*)$',
        fnc: '查看别名信息'
    },
    {
        reg: '^添加命令别名(.*)$',
        fnc: '添加命令别名'
    },
    {
        reg: '^添加邮件别名(.*)$',
        fnc: '添加邮件别名'
    },
    {
        reg: '^删除命令(?:别名)?(.*)$',
        fnc: '删除命令别名'
    },
    {
        reg: '^删除邮件(?:别名)?(.*)$',
        fnc: '删除邮件别名'
    }
]

export const cdk = [
    {
        reg: '^签到$',
        fnc: '签到'
    }
]