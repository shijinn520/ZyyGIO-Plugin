export const admin = [
    {
        reg: /^\#(开启|关闭).+$/gi,
        fnc: 'AppsList',
        permission: 'master'
    },
    {
        reg: /^#(设置|绑定|解绑|解除)管理/g,
        fnc: 'manage',
        permission: 'master'
    },
    {
        reg: /^\/?绑定.+$/g,
        fnc: 'personalUID',
    },
    {
        reg: /^\#切换服务器.+$/g,
        fnc: '切换服务器',
        permission: 'master'
    },
    {
        reg: /^\#服务器$/,
        fnc: 'ServerList',
        permission: 'master'
    },
    {
        reg: /^\#添加uid.+$/gi,
        fnc: 'addUID',
        permission: 'master'
    },
    {
        reg: /^\#(功能列表|当前功能)$/g,
        fnc: 'AppStatus',
        permission: 'master'
    },
    {
        reg: /^#gio(强制)?更新$/gi,
        fnc: 'update',
        permission: 'master'
    }
]

export const cdk = [
    {
        reg: /^#快捷生成(列表|.+)/,
        fnc: 'FastAddCdk'
    },
    {
        reg: /^#自定义cdk.*$/gi,
        fnc: 'addCustomizeCdk'
    },
    {
        reg: /^#随机cdk.*$/gi,
        fnc: 'addRandomCdk'
    },
    {
        reg: /^#删除兑换码.+$/gi,
        fnc: 'delCdk'
    },
    {
        reg: /^#查看兑换码.+$/gi,
        fnc: 'lookCdk'
    }
]


export const construct = [
    {
        reg: /^\/?签到$/,
        fnc: '签到'
    },
    {
        reg: /^(完成(父)?|添加|清除父)任务.+|^\/.+/,
        fnc: 'GMCommand'
    },
    {
        reg: /^\/?兑换.+$/,
        fnc: '兑换码'
    },
    {
        reg: /^\/?(ping|在线玩家|在线人数|状态)$/,
        fnc: '服务器状态',
    },
    {
        reg: /^\/?(子区|子服)$/,
        fnc: '子区',
    },
    {
        reg: /^\/?邮件 .+$/,
        fnc: '邮件'
    },
    {
        reg: /^\/?(一键|解除)?封禁.+$/g,
        fnc: '封禁玩家',
        permission: 'master'
    }
]

export const other = [
    {
        reg: /^\/?(帮助|help)$/,
        fnc: 'help',
    },
    {
        reg: /^#(.*)别名(列表)?$/,
        fnc: 'aliasList',
    },
    {
        reg: /^#兑换码列表$/gi,
        fnc: 'CdkList'
    },
    {
        reg: /^#添加(命令|邮件) (.*)$/,
        fnc: 'addalias',
    },
    {
        reg: /^#删除(命令|邮件)(.*)$/,
        fnc: 'delalias'
    },
    {
        reg: /\/?查找(.*)$/,
        fnc: 'lookupQuest'
    },
    {
        reg: /^#我的id$/gi,
        fnc: 'Information'
    }
]
