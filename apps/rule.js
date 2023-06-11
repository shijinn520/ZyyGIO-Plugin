export const admin = [
    {
        reg: '^(开启GM|开启gm|开启邮件|开启签到|开启cdk|开启CDK|开启cdk生成|开启CDK生成|开启在线玩家|开启ping)$',
        fnc: '开启功能',
        permission: 'master'
    },
    {
        reg: '^(关闭GM|关闭gm|关闭邮件|关闭签到|关闭cdk|关闭CDK|关闭cdk生成|关闭CDK生成|关闭在线玩家|关闭ping)$',
        fnc: '关闭功能',
        permission: 'master'
    },
    {
        reg: '^\/?(设置管理|绑定管理)$',
        fnc: '设置管理员',
        permission: 'master'
    },
    {
        reg: '^\/?(解除管理|解绑管理)$',
        fnc: '解除管理员',
        permission: 'master'
    },
    {
        reg: '^\/?绑定(.*)$',
        fnc: '绑定UID',
    },
    {
        reg: '^\/?(切换服务器)(.*)$',
        fnc: '切换服务器',
        permission: 'master'
    },
    {
        reg: '^\/?服务器$',
        fnc: '服务器列表',
        permission: 'master'
    },
    {
        reg: '^\/?添加(UID|uid|Uid) (.*)$',
        fnc: '添加UID',
        permission: 'master'
    },
    {
        reg: '^(功能列表|当前功能)$',
        fnc: '功能列表',
        permission: 'master'
    },
    {
        reg: '^\/?(GM更新|Gm更新|gm更新|更新GM|更新Gm|更新gm)$',
        fnc: '插件更新',
        permission: 'master'
    },
    {
        reg: '^\/?(GM强制更新|Gm强制更新|gm强制更新|强制更新GM|强制更新Gm|强制更新gm)$',
        fnc: '强制更新',
        permission: 'master'
    }
]

export const commands = [
    {
        reg: '^签到$',
        fnc: '签到'
    },
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
    }
]

export const players = [
    {
        reg: '^\/?(帮助|help)$',
        fnc: '小钰帮助',
    },
    // 先不改，有空再说
    // {
    //     reg: '^\/?玩家列表$',
    //     fnc: '玩家列表',
    // },
    {
        reg: '^\/?(指令别名|命令别名)$',
        fnc: '命令别名',
    },
    {
        reg: '^\/?邮件别名$',
        fnc: '邮件别名',
    },
    {
        reg: '^\/?添加命令 (.*)$',
        fnc: '添加命令',
    },
    {
        reg: '^\/?添加邮件 (.*)$',
        fnc: '添加邮件',
    },
    {
        reg: '^\/?别名帮助$',
        fnc: '别名帮助',
    },
    {
        reg: '^\/?查看(命令|邮件)(.*)$',
        fnc: '查看别名信息'
    },
    {
        reg: '^\/?添加命令别名(.*)$',
        fnc: '添加命令别名'
    },
    {
        reg: '^\/?添加邮件别名(.*)$',
        fnc: '添加邮件别名'
    },
    {
        reg: '^\/?删除命令(.*)$',
        fnc: '删除命令别名'
    },
    {
        reg: '^\/?删除邮件(.*)$',
        fnc: '删除邮件别名'
    },
    {
        reg: '^\/?(我的ID|我的id)$',
        fnc: '查看ID'
    }
]

export const cdk = [
    {
        reg: '^\/?兑换(.*)$',
        fnc: '兑换码'
    },
    {
        reg: '^\/?生成cdk$',
        fnc: '生成兑换码'
    },
    {
        reg: '^\/?快捷生成(?!列表)(.*)$',
        fnc: '快捷生成cdk'
    },
    {
        reg: '^\/?快捷生成列表$',
        fnc: '快捷生成列表'
    },
    {
        reg: '^\/?自定义cdk(.*)$',
        fnc: '快捷生成自定义cdk'
    },
    {
        reg: '^\/?随机cdk(.*)$',
        fnc: '快捷生成随机cdk'
    },
    {
        reg: '^\/?生成cdk帮助$',
        fnc: '生成cdk帮助'
    }
]
