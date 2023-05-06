export const admin = [
    {
        reg: '^(开启GM|开启gm|启用GM|启用gm)$',
        fnc: '开启GM',
        permission: 'master'
    },
    {
        reg: '^(关闭GM|关闭gm|停止gm|停止GM)$',
        fnc: '关闭GM',
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
    {
        reg: '^(小钰更新|GM更新|更新GM|更新gm|gm更新|Gm更新)$',
        fnc: '插件更新',
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
        reg: '^全服邮件$',
        fnc: '全服邮件',
        permission: 'master'
    },
    {
        reg: '^添加UID(.*)$',
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
        fnc: '添加命令别名',
    },
    {
        reg: '^添加邮件 (.*)$',
        fnc: '添加邮件别名',
    },
    {
        reg: '^修改命令 (.*)$',
        fnc: '修改命令别名',
    },
    {
        reg: '^修改邮件 (.*)$',
        fnc: '修改邮件别名',
    },
    {
        reg: '^别名帮助$',
        fnc: '别名帮助',
    }
]

