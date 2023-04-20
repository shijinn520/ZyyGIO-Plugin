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
        reg: '^绑定(.*)$',
        fnc: '绑定UID',
    },
    {
        reg: '^(服务器|当前服务器|切换服务器)(.*)$',
        fnc: '切换服务器',
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
        reg: '^邮件(.*)$',
        fnc: '邮件'
    }
]