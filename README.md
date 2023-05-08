使用`Yunzai`执行`hk4e`的GM指令

# 效果展示：

在线玩家：

![在线玩家示例](https://i.328888.xyz/2023/04/30/iKYK3N.png)

GM指令：

![别名指令示例](https://i.328888.xyz/2023/04/30/iKq4VU.png)
![普通指令示例](https://i.328888.xyz/2023/04/30/iKqAbv.png)

邮件：

![邮件别名示例](https://i.328888.xyz/2023/04/30/iKYK3N.png)
![普通指令示例](https://i.328888.xyz/2023/04/30/iKqUQy.png)

# 安装Yunzai
根据自己的需求任选其一安装即可
Miao-Yunzai：[Gitee](https://gitee.com/yoimiya-kokomi/Miao-Yunzai) | [Github](https://github.com/yoimiya-kokomi/Miao-Yunzai)

TRSS-Yunzai：[Gitee](https://gitee.com/TimeRainStarSky/Yunzai) | [Github](https://github.com/TimeRainStarSky/Yunzai)

| 支持的协议       | QQ群 | QQ频道 | QQ频道-官方 | WeChat | Telegram | Discord | KOOK |
|-------------|-----|------|---------|--------|----------|---------|------|
| Miao-Yunzai | ✔   |      | ✔       |        |          |         |      |
| TRSS-Yunzai | ✔   | ✔    | ✔       | ✔      | ✔        | ✔       | ✔    |

# 安装插件

在`Yunzai`根目录执行，任选其一

Gitee：
```
git clone --depth 1 https://gitee.com/ZYY-Yu/Zyy-GM-plugin plugins/Zyy-GM-plugin
```

Github：
```
git clone --depth 1 https://github.com/ZYY-Yu/Zyy-GM-plugin plugins/Zyy-GM-plugin
```

# 插件结构
以下所有文件都在此路径`Zyy-GM-plugin\resources\hk4e`

目前只有`server.yaml`文件需要手动进行添加服务器，其他文件都不推荐进行手动修改。
* `config.yaml`：存放每个群聊的服务器，管理员，玩家UID

* `command.json`：存放命令别名。小白不推荐手动修改，最好使用命令添加。

* `mail.json`：存放邮件别名。小白不推荐手动修改，最好使用命令添加。

* `server.yaml`：存放服务器列表，方便服主快捷在多个群聊切换服务器。

# 注意事项：
* 你需要往`server.yaml`里面添加你要使用的服务器信息
* 请保持服务器的键名和ID为唯一，切换服务器指令使用的是服务器的ID
* 如果你的服务器启用了`sign`，请在配置中把 `signswitch: "false"` 修改为 `signswitch: "true"` 

以下是各项配置的解析
```
"小钰-3.2":                 // 这里是键名，如果你不知道怎么改，按照name-版本这样填写即可
  id: "1"                   // 这里是id，请保持唯一，用于机器人区分多服务器
  name: "小钰"              // 服务器名称
  version: "3.2"            // 服务器版本
  ip: "192.168.56.128"      // 服务器IP
  port: 20011               // 服务器端口
  region: "dev_gio"         // 服务器区服
  sign: "zyy"               // 服务器签名
  signswitch: "false"       // 签名开关

```

# 关于别名模板
下面是插件提供的一些模板，部分别名来自群友

初次运行，需要先启动一次`Yunzai`，需要生成配置文件

以下内容，可直接覆盖到对应的文件内

<details><summary>command.json</summary>

```
[
    {
        "60": [
            "60",
            "60级"
        ],
        "command": [
            "player level 60"
        ]
    },
    {
        "90": [
            "90"
        ],
        "command": [
            "break 6",
            "skill all 10",
            "talent unlock all",
            "level 90",
            "item add 105  99999"
        ]
    },
    {
        "无限体力": [
            "无限体力",
            "体力"
        ],
        "command": [
            "stamina infinite on"
        ]
    },
    {
        "无限体力off": [
            "无限体力off",
            "体力off",
            "体力关"
        ],
        "command": [
            "stamina infinite off"
        ]
    },
    {
        "Q无限充能": [
            "Q无限充能",
            "q",
            "Q"
        ],
        "command": [
            "energy infinite on"
        ]
    },
    {
        "Q无限充能off": [
            "Q无限充能off",
            "qoff",
            "Qoff"
        ],
        "command": [
            "energy infinite off"
        ]
    },
    {
        "玩家无敌": [
            "玩家无敌",
            "无敌"
        ],
        "command": [
            "wudi global avatar on"
        ]
    },
    {
        "玩家无敌off": [
            "玩家无敌off",
            "无敌off"
        ],
        "command": [
            "wudi global avatar off"
        ]
    },
    {
        "怪物无敌": [
            "怪物无敌"
        ],
        "command": [
            "wudi global monster on"
        ]
    },
    {
        "怪物无敌off": [
            "怪物无敌off"
        ],
        "command": [
            "wudi global monster off"
        ]
    },
    {
        "解锁命座": [
            "解锁命座",
            "解锁命之座"
        ],
        "command": [
            "talent unlock all"
        ]
    },
    {
        "全神瞳": [
            "全神瞳",
            "所有神瞳"
        ],
        "command": [
            "item add 107001 1000",
            "item add 107003 1000",
            "item add 107014 1000",
            "item add 107017 1000"
        ]
    },
    {
        "风神瞳": [
            "风神瞳"
        ],
        "command": [
            "item add 107001 1000"
        ]
    },
    {
        "岩神瞳": [
            "岩神瞳"
        ],
        "command": [
            "item add 107003 1000"
        ]
    },
    {
        "雷神瞳": [
            "雷神瞳"
        ],
        "command": [
            "item add 107014 1000"
        ]
    },
    {
        "草神瞳": [
            "草神瞳"
        ],
        "command": [
            "item add 107017 1000"
        ]
    },
    {
        "西风剑": [
            "西风剑"
        ],
        "command": [
            "equip add 11401 90 6 5"
        ]
    },
    {
        "笛剑": [
            "笛剑"
        ],
        "command": [
            "equip add 11402 90 6 5"
        ]
    },
    {
        "祭礼剑": [
            "祭礼剑"
        ],
        "command": [
            "equip add 11403 90 6 5"
        ]
    },
    {
        "宗室长剑": [
            "宗室长剑"
        ],
        "command": [
            "equip add 11404 90 6 5"
        ]
    },
    {
        "匣里龙吟": [
            "匣里龙吟"
        ],
        "command": [
            "equip add 11405 90 6 5"
        ]
    },
    {
        "试作斩岩": [
            "试作斩岩"
        ],
        "command": [
            "equip add 11406 90 6 5"
        ]
    },
    {
        "铁蜂刺": [
            "铁蜂刺"
        ],
        "command": [
            "equip add 11407 90 6 5"
        ]
    },
    {
        "黑岩长剑": [
            "黑岩长剑"
        ],
        "command": [
            "equip add 11408 90 6 5"
        ]
    },
    {
        "黑剑": [
            "黑剑"
        ],
        "command": [
            "equip add 11409 90 6 5"
        ]
    },
    {
        "暗巷闪光": [
            "暗巷闪光"
        ],
        "command": [
            "equip add 11410 90 6 5"
        ]
    },
    {
        "降临之剑": [
            "降临之剑"
        ],
        "command": [
            "equip add 11412 90 6 5"
        ]
    },
    {
        "腐殖之剑": [
            "腐殖之剑"
        ],
        "command": [
            "equip add 11413 90 6 5"
        ]
    },
    {
        "天目影打刀": [
            "天目影打刀",
            "天目"
        ],
        "command": [
            "equip add 11414 90 6 5"
        ]
    },
    {
        "辰砂之纺锤": [
            "辰砂之纺锤",
            "辰砂"
        ],
        "command": [
            "equip add 11415 90 6 5"
        ]
    },
    {
        "笼钓瓶一心": [
            "笼钓瓶一心"
        ],
        "command": [
            "equip add 11416 90 6 5"
        ]
    },
    {
        "原木刀": [
            "原木刀"
        ],
        "command": [
            "equip add 11417 90 6 5"
        ]
    },
    {
        "西福斯的月光": [
            "西福斯的月光"
        ],
        "command": [
            "equip add 11418 90 6 5"
        ]
    },
    {
        "一心传名刀": [
            "一心传名刀"
        ],
        "command": [
            "equip add 11421 90 6 5"
        ]
    },
    {
        "东花坊时雨": [
            "东花坊时雨"
        ],
        "command": [
            "equip add 11422 90 6 5"
        ]
    },
    {
        "风鹰剑": [
            "风鹰剑"
        ],
        "command": [
            "equip add 11501 90 6 5"
        ]
    },
    {
        "天空之刃": [
            "天空之刃"
        ],
        "command": [
            "equip add 11502 90 6 5"
        ]
    },
    {
        "苍古自由之誓": [
            "苍古自由之誓",
            "苍古"
        ],
        "command": [
            "equip add 11503 90 6 5"
        ]
    },
    {
        "斫峰之刃": [
            "斫峰之刃",
            "盾剑"
        ],
        "command": [
            "equip add 11504 90 6 5"
        ]
    },
    {
        "磐岩结绿": [
            "磐岩结绿",
            "绿箭"
        ],
        "command": [
            "equip add 11505 90 6 5"
        ]
    },
    {
        "雾切之回光": [
            "雾切之回光",
            "雾切"
        ],
        "command": [
            "equip add 11509 90 6 5"
        ]
    },
    {
        "波乱月白经津": [
            "波乱月白经津",
            "波乱"
        ],
        "command": [
            "equip add 11510 90 6 5"
        ]
    },
    {
        "圣显之钥": [
            "圣显之钥",
            "圣显"
        ],
        "command": [
            "equip add 11511 90 6 5"
        ]
    },
    {
        "裁叶萃光": [
            "裁叶萃光",
            "裁叶"
        ],
        "command": [
            "equip add 11512 90 6 5"
        ]
    },
    {
        "以理服人": [
            "以理服人"
        ],
        "command": [
            "equip add 12305 90 6 5"
        ]
    },
    {
        "西风大剑": [
            "西风大剑"
        ],
        "command": [
            "equip add 12401 90 6 5"
        ]
    },
    {
        "钟剑": [
            "钟剑"
        ],
        "command": [
            "equip add 12402 90 6 5"
        ]
    },
    {
        "祭礼大剑": [
            "祭礼大剑"
        ],
        "command": [
            "equip add 12403 90 6 5"
        ]
    },
    {
        "宗室大剑": [
            "宗室大剑"
        ],
        "command": [
            "equip add 12404 90 6 5"
        ]
    },
    {
        "雨裁": [
            "雨裁"
        ],
        "command": [
            "equip add 12405 90 6 5"
        ]
    },
    {
        "试作古华": [
            "试作古华"
        ],
        "command": [
            "equip add 12406 90 6 5"
        ]
    },
    {
        "白影剑": [
            "白影剑"
        ],
        "command": [
            "equip add 12407 90 6 5"
        ]
    },
    {
        "黑岩斩刀": [
            "黑岩斩刀"
        ],
        "command": [
            "equip add 12408 90 6 5"
        ]
    },
    {
        "螭骨剑": [
            "螭骨剑",
            "螭骨"
        ],
        "command": [
            "equip add 12409 90 6 5"
        ]
    },
    {
        "千岩古剑": [
            "千岩古剑"
        ],
        "command": [
            "equip add 12410 90 6 5"
        ]
    },
    {
        "雪葬的星银": [
            "雪葬的星银",
            "雪葬"
        ],
        "command": [
            "equip add 12411 90 6 5"
        ]
    },
    {
        "衔珠海皇": [
            "衔珠海皇",
            "咸鱼大剑",
            "咸鱼"
        ],
        "command": [
            "equip add 12412 90 6 5"
        ]
    },
    {
        "桂木斩长正": [
            "桂木斩长正"
        ],
        "command": [
            "equip add 12414 90 6 5"
        ]
    },
    {
        "玛海菈的水色": [
            "玛海菈的水色"
        ],
        "command": [
            "equip add 12415 90 6 5"
        ]
    },
    {
        "恶王丸": [
            "恶王丸"
        ],
        "command": [
            "equip add 12416 90 6 5"
        ]
    },
    {
        "森林王器": [
            "森林王器"
        ],
        "command": [
            "equip add 12417 90 6 5"
        ]
    },
    {
        "饰铁之花": [
            "饰铁之花"
        ],
        "command": [
            "equip add 12418 90 6 5"
        ]
    },
    {
        "天空之傲": [
            "天空之傲"
        ],
        "command": [
            "equip add 12501 90 6 5"
        ]
    },
    {
        "狼的末路": [
            "狼的末路",
            "狼末"
        ],
        "command": [
            "equip add 12502 90 6 5"
        ]
    },
    {
        "松籁响起之时": [
            "松籁响起之时",
            "松籁"
        ],
        "command": [
            "equip add 12503 90 6 5"
        ]
    },
    {
        "无工之剑": [
            "无工之剑",
            "蜈蚣",
            "无工"
        ],
        "command": [
            "equip add 12504 90 6 5"
        ]
    },
    {
        "赤角石溃杵": [
            "赤角石溃杵",
            "赤角"
        ],
        "command": [
            "equip add 12510 90 6 5"
        ]
    },
    {
        "苇海信标": [
            "苇海信标"
        ],
        "command": [
            "equip add 12511 90 6 5"
        ]
    },
    {
        "白缨枪": [
            "白缨枪"
        ],
        "command": [
            "equip add 13301 90 6 5"
        ]
    },
    {
        "钺矛": [
            "钺矛"
        ],
        "command": [
            "equip add 13302 90 6 5"
        ]
    },
    {
        "黑缨枪": [
            "黑缨枪"
        ],
        "command": [
            "equip add 13303 90 6 5"
        ]
    },
    {
        "旗杆": [
            "旗杆"
        ],
        "command": [
            "equip add 13304 90 6 5"
        ]
    },
    {
        "匣里灭辰": [
            "匣里灭辰",
            "匣里"
        ],
        "command": [
            "equip add 13401 90 6 5"
        ]
    },
    {
        "试作星镰": [
            "试作星镰"
        ],
        "command": [
            "equip add 13402 90 6 5"
        ]
    },
    {
        "流月针": [
            "流月针"
        ],
        "command": [
            "equip add 13403 90 6 5"
        ]
    },
    {
        "黑岩刺枪": [
            "黑岩刺枪"
        ],
        "command": [
            "equip add 13404 90 6 5"
        ]
    },
    {
        "决斗之枪": [
            "决斗之枪"
        ],
        "command": [
            "equip add 13405 90 6 5"
        ]
    },
    {
        "千岩长枪": [
            "千岩长枪"
        ],
        "command": [
            "equip add 13406 90 6 5"
        ]
    },
    {
        "西风长枪": [
            "西风长枪",
            "西风枪"
        ],
        "command": [
            "equip add 13407 90 6 5"
        ]
    },
    {
        "宗室猎枪": [
            "宗室猎枪"
        ],
        "command": [
            "equip add 13408 90 6 5"
        ]
    },
    {
        "龙脊长枪": [
            "龙脊长枪"
        ],
        "command": [
            "equip add 13409 90 6 5"
        ]
    },
    {
        "喜多院十文字": [
            "喜多院十文字"
        ],
        "command": [
            "equip add 13414 90 6 5"
        ]
    },
    {
        "渔获": [
            "渔获",
            "鱼叉"
        ],
        "command": [
            "equip add 13415 90 6 5"
        ]
    },
    {
        "断浪长鳍": [
            "断浪长鳍",
            "断浪"
        ],
        "command": [
            "equip add 13416 90 6 5"
        ]
    },
    {
        "贯月矢": [
            "贯月矢"
        ],
        "command": [
            "equip add 13417 90 6 5"
        ]
    },
    {
        "风信之锋": [
            "风信之锋"
        ],
        "command": [
            "equip add 13419 90 6 5"
        ]
    },
    {
        "护摩之杖": [
            "护摩之杖",
            "护摩"
        ],
        "command": [
            "equip add 13501 90 6 5"
        ]
    },
    {
        "天空之脊": [
            "天空之脊"
        ],
        "command": [
            "equip add 13502 90 6 5"
        ]
    },
    {
        "贯虹之槊": [
            "贯虹之槊",
            "盾枪"
        ],
        "command": [
            "equip add 13504 90 6 5"
        ]
    },
    {
        "和璞鸢": [
            "和璞鸢",
            "鸟枪"
        ],
        "command": [
            "equip add 13505 90 6 5"
        ]
    },
    {
        "息灾": [
            "息灾"
        ],
        "command": [
            "equip add 13507 90 6 5"
        ]
    },
    {
        "薙草之稻光": [
            "薙草之稻光",
            "薙草",
            "雷神专武"
        ],
        "command": [
            "equip add 13509 90 6 5"
        ]
    },
    {
        "赤沙之杖": [
            "赤沙之杖",
            "赤沙"
        ],
        "command": [
            "equip add 13511 90 6 5"
        ]
    },
    {
        "讨龙英杰谭": [
            "讨龙英杰谭"
        ],
        "command": [
            "equip add 14302 90 6 5"
        ]
    },
    {
        "异世界行记": [
            "异世界行记"
        ],
        "command": [
            "equip add 14303 90 6 5"
        ]
    },
    {
        "翡玉法球": [
            "翡玉法球"
        ],
        "command": [
            "equip add 14304 90 6 5"
        ]
    },
    {
        "甲级宝珏": [
            "甲级宝珏"
        ],
        "command": [
            "equip add 14305 90 6 5"
        ]
    },
    {
        "琥珀玥": [
            "琥珀玥"
        ],
        "command": [
            "equip add 14306 90 6 5"
        ]
    },
    {
        "西风秘典": [
            "西风秘典"
        ],
        "command": [
            "equip add 14401 90 6 5"
        ]
    },
    {
        "流浪乐章": [
            "流浪乐章"
        ],
        "command": [
            "equip add 14402 90 6 5"
        ]
    },
    {
        "祭礼残章": [
            "祭礼残章"
        ],
        "command": [
            "equip add 14403 90 6 5"
        ]
    },
    {
        "宗室秘法录": [
            "宗室秘法录"
        ],
        "command": [
            "equip add 14404 90 6 5"
        ]
    },
    {
        "匣里日月": [
            "匣里日月"
        ],
        "command": [
            "equip add 14405 90 6 5"
        ]
    },
    {
        "试作金珀": [
            "试作金珀"
        ],
        "command": [
            "equip add 14406 90 6 5"
        ]
    },
    {
        "万国诸海图谱": [
            "万国诸海图谱"
        ],
        "command": [
            "equip add 14407 90 6 5"
        ]
    },
    {
        "黑岩绯玉": [
            "黑岩绯玉"
        ],
        "command": [
            "equip add 14408 90 6 5"
        ]
    },
    {
        "昭心": [
            "昭心"
        ],
        "command": [
            "equip add 14409 90 6 5"
        ]
    },
    {
        "暗巷的酒与诗": [
            "暗巷的酒与诗"
        ],
        "command": [
            "equip add 14410 90 6 5"
        ]
    },
    {
        "忍冬之果": [
            "忍冬之果"
        ],
        "command": [
            "equip add 14412 90 6 5"
        ]
    },
    {
        "嘟嘟可故事集": [
            "嘟嘟可故事集"
        ],
        "command": [
            "equip add 14413 90 6 5"
        ]
    },
    {
        "白辰之环": [
            "白辰之环"
        ],
        "command": [
            "equip add 14414 90 6 5"
        ]
    },
    {
        "证誓之明瞳": [
            "证誓之明瞳"
        ],
        "command": [
            "equip add 14415 90 6 5"
        ]
    },
    {
        "流浪的晚星": [
            "流浪的晚星"
        ],
        "command": [
            "equip add 14416 90 6 5"
        ]
    },
    {
        "盈满之实": [
            "盈满之实"
        ],
        "command": [
            "equip add 14417 90 6 5"
        ]
    },
    {
        "天空之卷": [
            "天空之卷"
        ],
        "command": [
            "equip add 14501 90 6 5"
        ]
    },
    {
        "四风原典": [
            "四风原典"
        ],
        "command": [
            "equip add 14502 90 6 5"
        ]
    },
    {
        "尘世之锁": [
            "尘世之锁"
        ],
        "command": [
            "equip add 14504 90 6 5"
        ]
    },
    {
        "不灭月华": [
            "不灭月华"
        ],
        "command": [
            "equip add 14506 90 6 5"
        ]
    },
    {
        "神乐之真意": [
            "神乐之真意",
            "神乐"
        ],
        "command": [
            "equip add 14509 90 6 5"
        ]
    },
    {
        "千夜浮梦": [
            "千夜浮梦",
            "千夜"
        ],
        "command": [
            "equip add 14511 90 6 5"
        ]
    },
    {
        "图莱杜拉的回忆": [
            "图莱杜拉的回忆",
            "散兵专武"
        ],
        "command": [
            "equip add 14512 90 6 5"
        ]
    },
    {
        "猎弓": [
            "猎弓"
        ],
        "command": [
            "equip add 15101 90 6 5"
        ]
    },
    {
        "历练的猎弓": [
            "历练的猎弓"
        ],
        "command": [
            "equip add 15201 90 6 5"
        ]
    },
    {
        "鸦羽弓": [
            "鸦羽弓"
        ],
        "command": [
            "equip add 15301 90 6 5"
        ]
    },
    {
        "神射手之誓": [
            "神射手之誓"
        ],
        "command": [
            "equip add 15302 90 6 5"
        ]
    },
    {
        "反曲弓": [
            "反曲弓"
        ],
        "command": [
            "equip add 15303 90 6 5"
        ]
    },
    {
        "弹弓": [
            "弹弓"
        ],
        "command": [
            "equip add 15304 90 6 5"
        ]
    },
    {
        "信使": [
            "信使"
        ],
        "command": [
            "equip add 15305 90 6 5"
        ]
    },
    {
        "黑檀弓": [
            "黑檀弓"
        ],
        "command": [
            "equip add 15306 90 6 5"
        ]
    },
    {
        "西风猎弓": [
            "西风猎弓"
        ],
        "command": [
            "equip add 15401 90 6 5"
        ]
    },
    {
        "绝弦": [
            "绝弦"
        ],
        "command": [
            "equip add 15402 90 6 5"
        ]
    },
    {
        "祭礼弓": [
            "祭礼弓"
        ],
        "command": [
            "equip add 15403 90 6 5"
        ]
    },
    {
        "宗室长弓": [
            "宗室长弓"
        ],
        "command": [
            "equip add 15404 90 6 5"
        ]
    },
    {
        "弓藏": [
            "弓藏"
        ],
        "command": [
            "equip add 15405 90 6 5"
        ]
    },
    {
        "试作澹月": [
            "试作澹月"
        ],
        "command": [
            "equip add 15406 90 6 5"
        ]
    },
    {
        "钢轮弓": [
            "钢轮弓"
        ],
        "command": [
            "equip add 15407 90 6 5"
        ]
    },
    {
        "黑岩战弓": [
            "黑岩战弓"
        ],
        "command": [
            "equip add 15408 90 6 5"
        ]
    },
    {
        "苍翠猎弓": [
            "苍翠猎弓"
        ],
        "command": [
            "equip add 15409 90 6 5"
        ]
    },
    {
        "暗巷猎手": [
            "暗巷猎手"
        ],
        "command": [
            "equip add 15410 90 6 5"
        ]
    },
    {
        "落霞": [
            "落霞"
        ],
        "command": [
            "equip add 15411 90 6 5"
        ]
    },
    {
        "幽夜华尔兹": [
            "幽夜华尔兹"
        ],
        "command": [
            "equip add 15412 90 6 5"
        ]
    },
    {
        "风花之颂": [
            "风花之颂"
        ],
        "command": [
            "equip add 15413 90 6 5"
        ]
    },
    {
        "破魔之弓": [
            "破魔之弓",
            "破魔"
        ],
        "command": [
            "equip add 15414 90 6 5"
        ]
    },
    {
        "掠食者": [
            "掠食者"
        ],
        "command": [
            "equip add 15415 90 6 5"
        ]
    },
    {
        "曚云之月": [
            "曚云之月"
        ],
        "command": [
            "equip add 15416 90 6 5"
        ]
    },
    {
        "王下近侍": [
            "王下近侍"
        ],
        "command": [
            "equip add 15417 90 6 5"
        ]
    },
    {
        "竭泽": [
            "竭泽"
        ],
        "command": [
            "equip add 15418 90 6 5"
        ]
    },
    {
        "天空之翼": [
            "天空之翼"
        ],
        "command": [
            "equip add 15501 90 6 5"
        ]
    },
    {
        "阿莫斯之弓": [
            "阿莫斯之弓",
            "阿莫斯"
        ],
        "command": [
            "equip add 15502 90 6 5"
        ]
    },
    {
        "终末嗟叹之诗": [
            "终末嗟叹之诗",
            "终末"
        ],
        "command": [
            "equip add 15503 90 6 5"
        ]
    },
    {
        "冬极白星": [
            "冬极白星",
            "冬极"
        ],
        "command": [
            "equip add 15507 90 6 5"
        ]
    },
    {
        "若水": [
            "若水"
        ],
        "command": [
            "equip add 15508 90 6 5"
        ]
    },
    {
        "飞雷之弦振": [
            "飞雷之弦振",
            "飞雷"
        ],
        "command": [
            "equip add 15509 90 6 5"
        ]
    },
    {
        "猎人之径": [
            "猎人之径",
            "猎人",
            "绿弓"
        ],
        "command": [
            "equip add 15511 90 6 5"
        ]
    },
    {
        "神里绫华": [
            "神里绫华",
            "凌华",
            "绫华"
        ],
        "command": [
            "avatar add 10000002"
        ]
    },
    {
        "琴": [
            "琴",
            "琴团长"
        ],
        "command": [
            "avatar add 10000003"
        ]
    },
    {
        "空": [
            "空",
            "男主"
        ],
        "command": [
            "avatar add 10000005"
        ]
    },
    {
        "丽莎": [
            "丽莎"
        ],
        "command": [
            "avatar add 10000006"
        ]
    },
    {
        "荧": [
            "荧",
            "女主"
        ],
        "command": [
            "avatar add 10000007"
        ]
    },
    {
        "芭芭拉": [
            "芭芭拉"
        ],
        "command": [
            "avatar add 10000014"
        ]
    },
    {
        "凯亚": [
            "凯亚"
        ],
        "command": [
            "avatar add 10000015"
        ]
    },
    {
        "迪卢克": [
            "迪卢克"
        ],
        "command": [
            "avatar add 10000016"
        ]
    },
    {
        "雷泽": [
            "雷泽"
        ],
        "command": [
            "avatar add 10000020"
        ]
    },
    {
        "安柏": [
            "安柏"
        ],
        "command": [
            "avatar add 10000021"
        ]
    },
    {
        "温迪": [
            "温迪"
        ],
        "command": [
            "avatar add 10000022"
        ]
    },
    {
        "香菱": [
            "香菱"
        ],
        "command": [
            "avatar add 10000023"
        ]
    },
    {
        "北斗": [
            "北斗"
        ],
        "command": [
            "avatar add 10000024"
        ]
    },
    {
        "行秋": [
            "行秋"
        ],
        "command": [
            "avatar add 10000025"
        ]
    },
    {
        "魈": [
            "魈"
        ],
        "command": [
            "avatar add 10000026"
        ]
    },
    {
        "凝光": [
            "凝光"
        ],
        "command": [
            "avatar add 10000027"
        ]
    },
    {
        "可莉": [
            "可莉"
        ],
        "command": [
            "avatar add 10000029"
        ]
    },
    {
        "钟离": [
            "钟离"
        ],
        "command": [
            "avatar add 10000030"
        ]
    },
    {
        "菲谢尔": [
            "菲谢尔"
        ],
        "command": [
            "avatar add 10000031"
        ]
    },
    {
        "班尼特": [
            "班尼特"
        ],
        "command": [
            "avatar add 10000032"
        ]
    },
    {
        "达达利亚": [
            "达达利亚",
            "公子"
        ],
        "command": [
            "avatar add 10000033"
        ]
    },
    {
        "诺艾尔": [
            "诺艾尔",
            "女仆"
        ],
        "command": [
            "avatar add 10000034"
        ]
    },
    {
        "七七": [
            "七七"
        ],
        "command": [
            "avatar add 10000035"
        ]
    },
    {
        "重云": [
            "重云"
        ],
        "command": [
            "avatar add 10000036"
        ]
    },
    {
        "甘雨": [
            "甘雨"
        ],
        "command": [
            "avatar add 10000037"
        ]
    },
    {
        "阿贝多": [
            "阿贝多"
        ],
        "command": [
            "avatar add 10000038"
        ]
    },
    {
        "迪奥娜": [
            "迪奥娜"
        ],
        "command": [
            "avatar add 10000039"
        ]
    },
    {
        "莫娜": [
            "莫娜"
        ],
        "command": [
            "avatar add 10000041"
        ]
    },
    {
        "刻晴": [
            "刻晴"
        ],
        "command": [
            "avatar add 10000042"
        ]
    },
    {
        "砂糖": [
            "砂糖"
        ],
        "command": [
            "avatar add 10000043"
        ]
    },
    {
        "辛焱": [
            "辛焱"
        ],
        "command": [
            "avatar add 10000044"
        ]
    },
    {
        "罗莎莉亚": [
            "罗莎莉亚"
        ],
        "command": [
            "avatar add 10000045"
        ]
    },
    {
        "胡桃": [
            "胡桃"
        ],
        "command": [
            "avatar add 10000046"
        ]
    },
    {
        "枫原万叶": [
            "枫原万叶",
            "万叶"
        ],
        "command": [
            "avatar add 10000047"
        ]
    },
    {
        "烟绯": [
            "烟绯"
        ],
        "command": [
            "avatar add 10000048"
        ]
    },
    {
        "宵宫": [
            "宵宫"
        ],
        "command": [
            "avatar add 10000049"
        ]
    },
    {
        "托马": [
            "托马"
        ],
        "command": [
            "avatar add 10000050"
        ]
    },
    {
        "优菈": [
            "优菈"
        ],
        "command": [
            "avatar add 10000051"
        ]
    },
    {
        "雷电将军": [
            "雷电将军",
            "雷神",
            "影"
        ],
        "command": [
            "avatar add 10000052"
        ]
    },
    {
        "早柚": [
            "早柚"
        ],
        "command": [
            "avatar add 10000053"
        ]
    },
    {
        "珊瑚宫心海": [
            "珊瑚宫心海",
            "心海"
        ],
        "command": [
            "avatar add 10000054"
        ]
    },
    {
        "五郎": [
            "五郎"
        ],
        "command": [
            "avatar add 10000055"
        ]
    },
    {
        "九条裟罗": [
            "九条裟罗",
            "九条"
        ],
        "command": [
            "avatar add 10000056"
        ]
    },
    {
        "荒泷一斗": [
            "荒泷一斗",
            "一抖",
            "一斗"
        ],
        "command": [
            "avatar add 10000057"
        ]
    },
    {
        "八重神子": [
            "八重神子",
            "八重",
            "神子"
        ],
        "command": [
            "avatar add 10000058"
        ]
    },
    {
        "鹿野院平藏": [
            "鹿野院平藏",
            "小鹿"
        ],
        "command": [
            "avatar add 10000059"
        ]
    },
    {
        "夜兰": [
            "夜兰"
        ],
        "command": [
            "avatar add 10000060"
        ]
    },
    {
        "埃洛伊": [
            "埃洛伊"
        ],
        "command": [
            "avatar add 10000062"
        ]
    },
    {
        "申鹤": [
            "申鹤",
            "小姨"
        ],
        "command": [
            "avatar add 10000063"
        ]
    },
    {
        "云堇": [
            "云堇"
        ],
        "command": [
            "avatar add 10000064"
        ]
    },
    {
        "久岐忍": [
            "久岐忍",
            "97忍"
        ],
        "command": [
            "avatar add 10000065"
        ]
    },
    {
        "神里绫人": [
            "神里绫人",
            "绫人",
            "凌人"
        ],
        "command": [
            "avatar add 10000066"
        ]
    },
    {
        "柯莱": [
            "柯莱"
        ],
        "command": [
            "avatar add 10000067"
        ]
    },
    {
        "多莉": [
            "多莉"
        ],
        "command": [
            "avatar add 10000068"
        ]
    },
    {
        "提纳里": [
            "提纳里"
        ],
        "command": [
            "avatar add 10000069"
        ]
    },
    {
        "妮露": [
            "妮露"
        ],
        "command": [
            "avatar add 10000070"
        ]
    },
    {
        "赛诺": [
            "赛诺"
        ],
        "command": [
            "avatar add 10000071"
        ]
    },
    {
        "坎蒂丝": [
            "坎蒂丝"
        ],
        "command": [
            "avatar add 10000072"
        ]
    },
    {
        "纳西妲": [
            "纳西妲",
            "草神"
        ],
        "command": [
            "avatar add 10000073"
        ]
    },
    {
        "莱依拉": [
            "莱依拉"
        ],
        "command": [
            "avatar add 10000074"
        ]
    },
    {
        "解锁神像": [
            "解锁神像",
            "解锁地图",
            "解锁锚点"
        ],
        "command": [
            "quest finish 30302",
            "quest finish 30303",
            "quest finish 30304",
            "quest finish 30305",
            "quest finish 30306",
            "quest finish 30307",
            "quest finish 30308",
            "quest finish 30309",
            "quest finish 30310",
            "quest finish 30311",
            "quest finish 30312",
            "quest finish 30313",
            "quest finish 30314",
            "quest finish 30315",
            "quest finish 30316",
            "quest finish 30317",
            "quest finish 30318",
            "quest finish 30319",
            "quest finish 30320",
            "quest finish 30321",
            "quest finish 30322",
            "quest finish 30323",
            "quest finish 30224",
            "quest finish 30325",
            "quest finish 30326",
            "quest finish 30327",
            "point 3 all"
        ]
    },
    {
        "结晶": [
            "结晶",
            "创世结晶"
        ],
        "command": [
            "mcoin 99999"
        ]
    },
    {
        "原石": [
            "原石"
        ],
        "command": [
            "hcoin 99999"
        ]
    },
    {
        "摩拉": [
            "摩拉"
        ],
        "command": [
            "scoin 99999"
        ]
    },
    {
        "洞天宝钱": [
            "洞天宝钱",
            "家园币"
        ],
        "command": [
            "home_coin 99999"
        ]
    },
    {
        "浓缩": [
            "浓缩",
            "浓缩树脂"
        ],
        "command": [
            "item add 220007 20"
        ]
    },
    {
        "奶": [
            "奶",
            "回血",
            "hp"
        ],
        "command": [
            "revive"
        ]
    },
    {
        "杀怪": [
            "杀怪",
            "清怪",
            "清图"
        ],
        "command": [
            "kill monster all"
        ]
    },
    {
        "无相全家桶": [
            "无相全家桶",
            "五香全家桶"
        ],
        "command": [
            "monster 20040101 1 100",
            "monster 20040201 1 100",
            "monster 20040301 1 100",
            "monster 20040401 1 100",
            "monster 20040501 1 100",
            "monster 20040601 1 100",
            "monster 20040701 1 100"
        ]
    },
    {
        "大伟哥": [
            "大伟哥",
            "大伟丘"
        ],
        "command": [
            "monster 21011501 20 200"
        ]
    },
    {
        "煮饭婆": [
            "煮饭婆",
            "周本雷神",
            "怪物雷神"
        ],
        "command": [
            "monster 29060203 2 200"
        ]
    },
    {
        "玩具大使": [
            "玩具大使"
        ],
        "command": [
            "monster 29030103 20 200",
            "monster 29030103 20 200",
            "monster 29030103 20 200"
        ]
    },
    {
        "狼王": [
            "狼王"
        ],
        "command": [
            "monster 29020101 5 200"
        ]
    },
    {
        "巨蛇": [
            "巨蛇"
        ],
        "command": [
            "monster 24010401 20 200"
        ]
    },
    {
        "雷鸟": [
            "雷鸟"
        ],
        "command": [
            "monster 20070101 5 200"
        ]
    },
    {
        "好哥哥": [
            "好哥哥"
        ],
        "command": [
            "monster 29030103 20 200"
        ]
    },
    {
        "若陀": [
            "若陀",
            "肥陀",
            "若陀龙王"
        ],
        "command": [
            "monster 29040101 2 200"
        ]
    },
    {
        "树脂": [
            "树脂"
        ],
        "command": [
            "item add 220007 100"
        ]
    },
    {
        "火法": [
            "火法"
        ],
        "command": [
            "monster 22010102 10 200"
        ]
    },
    {
        "水晶块": [
            "水晶块"
        ],
        "command": [
            "item add 101003 500"
        ]
    },
    {
        "白铁块": [
            "白铁块"
        ],
        "command": [
            "item add 101002 500"
        ]
    },
    {
        "祝圣精华": [
            "祝圣精华"
        ],
        "command": [
            "item add 105003 5000"
        ]
    },
    {
        "草之印": [
            "草之印"
        ],
        "command": [
            "item add 303 5200"
        ]
    },
    {
        "雷之印": [
            "雷之印"
        ],
        "command": [
            "item add 304 5200"
        ]
    },
    {
        "全部角色": [
            "全部角色"
        ],
        "command": [
            "item add avatar all"
        ]
    },
    {
        "式小将": [
            "式小将"
        ],
        "command": [
            "item add 220045"
        ]
    },
    {
        "缥锦机关": [
            "缥锦机关"
        ],
        "command": [
            "item add 220074"
        ]
    },
    {
        "魔女": [
            "魔女"
        ],
        "command": [
            "equip add 23361 1 15008 501241 6 501031 1 501201 1 501221 1",
            "equip add 23365 1 10002 501231 1 501241 1 501201 1 501221 6",
            "equip add 23362 1 10003 501031 1 501241 1 501221 1 501201 6",
            "equip add 23364 1 10001 501241 1 501031 1 501201 6 501221 1",
            "equip add 23363 1 30960 501031 1 501231 1 501241 6 501221 1"
        ]
    },
    {
        "删除安柏": [
            "删除安柏"
        ],
        "command": [
            "avatar del 10000021"
        ]
    },
    {
        "冰法": [
            "冰法"
        ],
        "command": [
            "monster 22010201 20 200",
            "monster 22010201 20 200",
            "monster 22010201 20 200"
        ]
    },
    {
        "普通人": [
            "普通人"
        ],
        "command": [
            "monster 21010101 20 200",
            "monster 21010101 20 200",
            "monster 21010101 20 200"
        ]
    },
    {
        "丘盔": [
            "丘盔"
        ],
        "command": [
            "monster 21020501 20 200",
            "monster 21020501 20 200"
        ]
    },
    {
        "雷法": [
            "雷法"
        ],
        "command": [
            "monster 22010403 20 200",
            "monster 22010403 20 200"
        ]
    },
    {
        "会飞": [
            "会飞"
        ],
        "command": [
            "monster 20050901 20 200",
            "monster 20050901 20 200"
        ]
    },
    {
        "三剑客": [
            "三剑客"
        ],
        "command": [
            "monster 25090201 5 200",
            "monster 25090301 5 200",
            "monster 25090401 5 200"
        ]
    },
    {
        "冰块": [
            "冰块"
        ],
        "command": [
            "monster 20040501 20 200"
        ]
    },
    {
        "七印礼": [
            "七印礼"
        ],
        "command": [
            "item add 301 1314",
            "item add 302 1314",
            "item add 303 1314",
            "item add 304 1314",
            "item add 305 1314",
            "item add 306 1314",
            "item add 307 1314"
        ]
    },
    {
        "夏天": [
            "夏天"
        ],
        "command": [
            "monster 20040601 5 200",
            "monster 20040601 5 200",
            "monster 20040601 5 200"
        ]
    },
    {
        "内鬼": [
            "内鬼"
        ],
        "command": [
            "monster 21030101 20 200",
            "monster 21030101 20 200",
            "monster 21030101 20 200"
        ]
    },
    {
        "大风车": [
            "大风车"
        ],
        "command": [
            "monster 24010109 20 200",
            "monster 24010108 20 200",
            "monster 24010101 20 200"
        ]
    },
    {
        "愚人众": [
            "愚人众"
        ],
        "command": [
            "monster 23020101 20 200",
            "monster 23010601 20 200",
            "monster 23010501 20 200",
            "monster 23010401 20 200",
            "monster 23010301 20 200",
            "monster 23010201 20 200"
        ]
    },
    {
        "千岩军": [
            "千岩军"
        ],
        "command": [
            "monster 25050201 20 200",
            "monster 25050101 20 200"
        ]
    },
    {
        "花呗多": [
            "花呗多"
        ],
        "command": [
            "monster 26010301 20 200",
            "monster 26010201 20 200",
            "monster 26010104 20 200",
            "monster 26010103 20 200",
            "monster 26010102 20 200",
            "monster 26010101 20 200"
        ]
    },
    {
        "两棵树": [
            "两棵树"
        ],
        "command": [
            "monster 26030101 20 200",
            "monster 26020201 20 200",
            "monster 26020102 20 200",
            "monster 26020101 20 200"
        ]
    },
    {
        "盗宝团": [
            "盗宝团"
        ],
        "command": [
            "monster 25040102 20 200",
            "monster 25030301 20 200",
            "monster 25030201 20 200",
            "monster 25030101 20 200",
            "monster 25020201 20 200",
            "monster 25020101 20 200",
            "monster 25010701 20 200",
            "monster 25010701 20 200",
            "monster 25010601 20 200",
            "monster   25010501 20 200",
            "monster 25010401 20 200",
            "monster 25010301 20 200",
            "monster 25010201 20 200",
            "monster 25010101 20 200"
        ]
    },
    {
        "朋友": [
            "朋友"
        ],
        "command": [
            "monster 29040111 1 200",
            "monster 29040104 1 200",
            "monster 29040103 1 200",
            "monster 29040102 1 200",
            "monster 29040101 1 200"
        ]
    },
    {
        "开会": [
            "开会"
        ],
        "command": [
            "monster 20011501 20 200",
            "monster 20011301 20 200",
            "monster 20011101 20 200",
            "monster 20010901 20 200",
            "monster 20010701 20 200",
            "monster 20010601 20 200"
        ]
    },
    {
        "猜猜看": [
            "猜猜看"
        ],
        "command": [
            "monster 21030601 20 200",
            "monster 21030501 20 200",
            "monster 21030401 20 200",
            "monster 21030101 20 200",
            "monster 21030301 20 200",
            "monster 21030201 20 200"
        ]
    },
    {
        "暴走团": [
            "暴走团"
        ],
        "command": [
            "monster 21020301 20 200",
            "monster 21020801 20 200",
            "monster 21020701 20 200",
            "monster 21020601 20 200",
            "monster 21020201 20 200",
            "monster 21020101 20 200"
        ]
    },
    {
        "萝卜开会": [
            "萝卜开会"
        ],
        "command": [
            "monster 26050401 20 200",
            "monster 26050301 20 200",
            "monster 26050201 20 200",
            "monster 26050101 20 200",
            "monster 26050101 20 200",
            "monster 26040101 20 200",
            "monster 26030101 20 200"
        ]
    },
    {
        "哈士奇": [
            "哈士奇"
        ],
        "command": [
            "monster 22060101 1 200",
            "monster 22050201 20 200",
            "monster 22050101 20 200",
            "monster 22040201 20 200",
            "monster 22040101 20 200"
        ]
    },
    {
        "阅兵": [
            "阅兵"
        ],
        "command": [
            "monster 21011501 20 200",
            "monster 21020501 20 200",
            "monster 21020501 20 200",
            "monster 21020501 20 200",
            "monster 21020501 20 200",
            "monster 21020501 20 200",
            "monster 21020501 20 200",
            "monster 21020501 20 200",
            "monster 21020501 20 200",
            "monster 21020501 20 200"
        ]
    },
    {
        "叉烧粉": [
            "叉烧粉"
        ],
        "command": [
            "monster 21011602 20 200",
            "monster 21011601 20 200",
            "monster 21011501 20 200",
            "monster 21011403 20 200",
            "monster 21011401 20 200",
            "monster 21011302 20 200",
            "monster 21011301 20 200",
            "monster 21011201 20 200",
            "monster 21011002 20 200",
            "monster 21011001 20 200",
            "monster 21010902 20 200",
            "monster 21010901 20 200",
            "monster 21010701 20 200",
            "monster 21010603 20 200",
            "monster 21010601 20 200",
            "monster 21010502 20 200",
            "monster 21010501 20 200",
            "monster 21010402 20 200",
            "monster 21010401 20 200",
            "monster 21010301 20 200",
            "monster 21010201 20 200"
        ]
    },
    {
        "冰淇淋": [
            "冰淇淋"
        ],
        "command": [
            "monster 20050901 20 200",
            "monster 20050801 20 200",
            "monster 20050701 20 200",
            "monster 20050601 20 200",
            "monster 20050501 20 200",
            "monster 20050401 20 200",
            "monster 20050301 20 200",
            "monster 20050201 20 200"
        ]
    },
    {
        "三叶草": [
            "三叶草"
        ],
        "command": [
            "monster 22030201 20 200",
            "monster 22030101 20 200",
            "monster 22020101 20 200"
        ]
    },
    {
        "摸鱼": [
            "摸鱼"
        ],
        "command": [
            "monster 26060301 20 200",
            "monster 26060201 20 200",
            "monster 26060101 20 200",
            "monster 20060601 20 200",
            "monster 20060501 20 200",
            "monster 20060401 20 200",
            "monster 20060301 20 200",
            "monster 20060201 20 200",
            "monster 20060101 20 200"
        ]
    },
    {
        "男团": [
            "男团"
        ],
        "command": [
            "monster 25100401 20 200",
            "monster 25100201 20 200",
            "monster 25100301 20 200",
            "monster 25100101 20 200",
            "monster 25080401 20 200",
            "monster 25080301 20 200",
            "monster 25080202 20 200",
            "monster 25080201 20 200",
            "monster 25080101 20 200",
            "monster 25050501 20 200",
            "monster 25050401 20 200",
            "monster 25050301 20 200"
        ]
    },
    {
        "辞别": [
            "辞别"
        ],
        "command": [
            "monster 24021101 20 200",
            "monster 24020401 20 200",
            "monster 24020301 20 200",
            "monster 24020201 20 200",
            "monster 24020101 20 200",
            "monster 24010401 20 200",
            "monster 24010301 20 200",
            "monster 24010201 20 200",
            "monster 24010101 20 200"
        ]
    },
    {
        "白菜汤": [
            "白菜汤"
        ],
        "command": [
            "monster 25100401 20 200",
            "monster 25100201 20 200",
            "monster 25100301 20 200",
            "monster 25100101 20 200",
            "monster 25080401 20 200",
            "monster 25080301 20 200",
            "monster 25080202 20 200",
            "monster 25080201 20 200",
            "monster 25080101 20 200",
            "monster 25050501 20 200",
            "monster 25050401 20 200",
            "monster 25050301 20 200"
        ]
    },
    {
        "神龛钥匙": [
            "神龛钥匙"
        ],
        "command": [
            "item add 107006 20 item add 107007 20 item add 107008 20"
        ]
    },
    {
        "传说钥匙": [
            "传说钥匙"
        ],
        "command": [
            "item add 107 5"
        ]
    },
    {
        "四风记忆": [
            "四风记忆"
        ],
        "command": [
            "item add 915 1"
        ]
    },
    {
        "不动记忆": [
            "不动记忆"
        ],
        "command": [
            "item add 917 1"
        ]
    },
    {
        "草木记忆": [
            "草木记忆"
        ],
        "command": [
            "item add 913 1"
        ]
    },
    {
        "苍雷记忆": [
            "苍雷记忆"
        ],
        "command": [
            "item add 914 1"
        ]
    },
    {
        "降级": [
            "降级"
        ],
        "command": [
            "player level 1"
        ]
    },
    {
        "纱雾": [
            "纱雾"
        ],
        "command": [
            "monster 29060203 20 200",
            "monster 20040601 20 200",
            "monster 20040501 20 200",
            "monster 20040401 20 200",
            "monster 20040302 20 200",
            "monster 20040301 20 200",
            "monster 20040202 20 200",
            "monster 20040201 20 200",
            "monster 20040102 20 200",
            "monster 20040101 20 200"
        ]
    },
    {
        "风套": [
            "风套"
        ],
        "command": [
            "item add 23401 5",
            "item add 23402 5",
            "item add 23403 5",
            "item add 23404 5",
            "item add 23405 5"
        ]
    },
    {
        "璃月钥匙": [
            "璃月钥匙"
        ],
        "command": [
            "item add 107007 20"
        ]
    },
    {
        "蒙德钥匙": [
            "蒙德钥匙"
        ],
        "command": [
            "item add 107006 20"
        ]
    },
    {
        "稻妻钥匙": [
            "稻妻钥匙"
        ],
        "command": [
            "item add 107008 20"
        ]
    },
    {
        "仙速瓶": [
            "仙速瓶"
        ],
        "command": [
            "item add 107013 50"
        ]
    },
    {
        "无主星辉": [
            "无主星辉"
        ],
        "command": [
            "item add 221 99999"
        ]
    },
    {
        "无主星尘": [
            "无主星尘"
        ],
        "command": [
            "item add 222 99999"
        ]
    },    
    {
        "重登": [
            "重登"
        ],
        "command": [
            "kick"
        ]
    },
    {
        "水套": [
            "水套"
        ],
        "command": [
            "item add 23531 5",
            "item add 23532 5",
            "item add 23533 5",
            "item add 23534 5",
            "item add 23535 5"
        ]
    },
    {
        "纯水": [
            "纯水"
        ],
        "command": [
            "monster 20050101 5 200"
        ]
    },
    {
        "漂浮灵": [
            "漂浮灵"
        ],
        "command": [
            "monster 20060101 100 2"
        ]
    },
    {
        "翅膀": [
            "翅膀"
        ],
        "command": [
            "item add 14002 1",
            "item add 14003 1",
            "item add 14004 1",
            "item add 14005 1",
            "item add 14006 1",
            "item add 14007 1",
            "item add 14008 1",
            "item add 14009 1",
            "item add 140010 1"
        ]
    },
    {
        "全声望": [
            "全声望",
            "声望",
            "声望满级"
        ],
        "command": [
            "item add 314 9999",
            "item add 315 9999",
            "item add 316 9999",
            "item add 317 9999"
        ]
    }
]
```

</details>

<details><summary>mail.json</summary>

```
[
    {
        "邮件模板": [
            "邮件模板",
            "别名2"
        ],
        "title": "这里填标题",
        "content": "这里填写邮件内容",
        "item_list": "201:100"
    },
    {
        "风之翼": [
            "风之翼",
            "翅膀"
        ],
        "title": "风之翼",
        "content": "看，没我不行吧~",
        "item_list": "140001:1,140002:1,140003:1,140004:1,140005:1,140006:1,140007:1,140008:1,140009:1,140010:1"
    },
    {
        "时装": [
            "时装",
            "时装大礼包"
        ],
        "title": "时装大礼包",
        "content": "看，好看的衣服！",
        "item_list": "340000:1,340001:1,340002:1,340003:1,340004:1,340005:1,340006:1,340007:1,340008:1,340009:1"
    },
    {
        "神瞳": [
            "神瞳",
            "神瞳大礼包"
        ],
        "title": "神瞳大礼包",
        "content": "哒哒哒，你的神瞳礼包已到位",
        "item_list": "107001:500,107003:500,107014:500,107017:500"
    },
    {
        "木材": [
            "木材",
            "木材礼包",
            "木材大礼包"
        ],
        "title": "「木材大礼包」",
        "content": "亲爱的旅行者\\n欢迎来到提瓦特大陆！作为一个新手玩家，你将要开始一段充满冒险和挑战的旅程。在这个美丽的世界里，你将会遇到各种神秘的生物，探索古老的遗迹，挑战强大的敌人，还有许多奇妙的地方等待你去发现。\\n作为旅行者，你有一个非常重要的任务，就是解开提瓦特大陆的谜团。为了完成这个任务，你需要探索这个世界的每一个角落，找到隐藏在各处的线索和秘密。你可以和其他旅行者组成队伍，一起完成任务和挑战，也可以独自行动，体验更多的冒险。\\n在这个世界里，你将会拥有不同的角色和技能。每个角色都有独特的特点和技能，你需要根据情况选择不同的角色来完成任务和挑战。通过战斗和任务，你可以获得经验和奖励，提升自己的能力，成为更强大的旅行者。\\n我希望这封邮件可以帮助你更好地了解提瓦特大陆这个世界。如果你有任何问题或困惑，请不要犹豫，随时与我们联系。祝你在这个神秘的世界里玩得开心！\\n祝好！",
        "item_list": "101301:1000,101302:1000,101303:1000,101304:1000,101307:1000,101308:1000,101309:1000,101310:1000,101311:1000,101312:1000,101313:1000,101314:1000,101315:1000,101316:1000,101317:1000"
    },
    {
        "新手礼包": [
            "新手礼包"
        ],
        "title": "「新手礼包」",
        "content": "亲爱的旅行者\\n欢迎来到提瓦特大陆！作为一个新手玩家，你将要开始一段充满冒险和挑战的旅程。在这个美丽的世界里，你将会遇到各种神秘的生物，探索古老的遗迹，挑战强大的敌人，还有许多奇妙的地方等待你去发现。\\n作为旅行者，你有一个非常重要的任务，就是解开提瓦特大陆的谜团。为了完成这个任务，你需要探索这个世界的每一个角落，找到隐藏在各处的线索和秘密。你可以和其他旅行者组成队伍，一起完成任务和挑战，也可以独自行动，体验更多的冒险。\\n在这个世界里，你将会拥有不同的角色和技能。每个角色都有独特的特点和技能，你需要根据情况选择不同的角色来完成任务和挑战。通过战斗和任务，你可以获得经验和奖励，提升自己的能力，成为更强大的旅行者。\\n我希望这封邮件可以帮助你更好地了解提瓦特大陆这个世界。如果你有任何问题或困惑，请不要犹豫，随时与我们联系。祝你在这个神秘的世界里玩得开心！\\n祝好！",
        "item_list": "220007:5,105003:999,1202:3,201:1000"
    }
]
```

</details>

# 使用流程

### 超级管理流程

##### 1.开启GM
配置好服务器后，在想使用的群聊发送 开启GN
随后发送 切换服务器2
参数说明，这里的2是指你自己设置的服务器ID，自己更改即可，配置完成即可到玩家流程。


### 玩家流程：
首先需要绑定自己的UID

在已经开启GM的群聊发送`绑定+UID`即可。


# 指令说明
插件会覆盖默认的`Yunzai`帮助，如果想使用默认帮助，发送`指令|云崽帮助`即可

### 玩家指令

帮助
```
指令说明：查看插件帮助
```

/指令
```
权限：所有玩家
指令说明：机器人会监控所有`/`开头的指令，可搭配`别名指令`以实现快捷的输入指令。
```

指令别名|命令别名
```
权限：所有玩家
指令说明：查看已有的指令别名
```

邮件别名
```
权限：所有玩家
指令说明：查看已有的邮件别名
```
玩家列表
```
权限：所有玩家
指令说明：查看已经绑定UID的玩家
```

* 添加别名 - 玩家

* 添加命令别名
    * 指令结构：[添加命令] [主别名/别名1/别名2] [/指令1 /指令2 /指令3]
* 详解：
    * 参数1`添加命令`是固定的，这是触发指令
    * 参数2`主别名/别名1`是触发的指令，搭配`/`使用，多个别名使用`/`分割
    * 参数3`/指令1 /指令2 /指令3`是你实际要执行的指令，每一个指令前面要加上`/`，多个指令需要使用空格隔开
* 举例：添加命令 90/一键满级 /break 6 /skill all 10 /talent unlock all /level 90
    * 使用: `/90` 或者 `/一键满级`  此时机器人会自动执行上面添加的4条指令
    * 注意事项：目前玩家`只能添加`，无法修改。在添加别名之前，请先测试指令是否能执行！并且无论是任何别名，只要在`命令别名`里面存在，都无法再次添加，每一个别名都需要保证唯一性

* 添加邮件别名    
    * 指令结构：[添加邮件] [主别名/别名1/别名2] [邮件标题] [邮件内容] [物品ID:数量,物品ID:数量]
* 详解：
    * 参数1`添加邮件`是固定的，这是触发指令
    * 参数2`主别名/别名1`是触发的指令，搭配`邮件 `使用，多个别名使用`/`分割
    * 参数3`邮件标题`，填写你想要的标题
    * 参数4`邮件内容`，填写你想要的邮件内容
    * 参数5`物品ID:数量`,填写你需要的物品ID:物品数量，多个物品使用`,`连接
* 举例：添加邮件 新手礼包/测试礼包 新手礼包 这是测试用的 201:1,201:2
    * 使用: `邮件 新手礼包` 或者 `邮件 测试礼包`  此时机器人会给你发邮件。
    * 注意事项：目前玩家`只能添加`，无法修改。在添加别名之前，请先测试指令是否能执行！并且无论是任何别名，只要在`邮件别名`里面存在，都无法再次添加，每一个别名都需要保证唯一性

### 管理员指令
没什么太大的区别，指令都是一致的，只是管理员可以为玩家换绑，修改现有别名的内容。

修改别名 - 管理员

* 修改命令别名
    * 指令结构：[修改命令] [需要修改的主别名] [主别名/修改后的别名1/修改后的别名2] [/指令1 /指令2 /指令3]
    * 详解：
        * 参数1`修改命令`是固定的，这是触发指令
        * 参数2`需要修改的主别名`和参数3的主别名需要一致，如果你不知道主别名是哪个，发送`命令别名`，每一个别名都带有一个`-`，`-`前面的就是主别名
        * 参数3`主别名/修改后的别名1` 这里的参数会覆盖掉原有的别名组。多个别名使用`/`分隔
        * 参数4`/指令1 /指令2 /指令3`这里的参数会覆盖掉原有的指令组。多个指令使用空格分隔，注意每个指令前面必须带`/`
    * 举例：修改命令  90 90/满级 /break 6 /skill all 10 /talent unlock all /level 90
    * 使用: 修改完成可使用`/90` 或者 `/满级`
    * 注意事项：在修改别名之前，请先测试指令是否能执行！并且无论是任何别名，只要在`命令别名`里面存在，都无法再次修改，每一个别名都需要保证唯一性

* 修改邮件别名    
    * 指令结构：[修改邮件] [需要修改的主别名] [主别名/别名1/别名2] [邮件标题] [邮件内容] [物品ID:数量,物品ID:数量]
* 详解：
    * 参数1`修改邮件`是固定的，这是触发指令
    * 参数2`需要修改的主别名`和参数3的主别名需要一致，如果你不知道主别名是哪个，发送`邮件别名`，每一个别名都带有一个`-`，`-`前面的就是主别名
    * 参数3`主别名/别名1` 这里的参数会覆盖掉原有的别名组。多个别名使用`/`分隔
    * 参数4`邮件标题`，填写你想要的标题
    * 参数5`邮件内容`，填写你想要的邮件内容
    * 参数6`物品ID:数量`,填写修改后的`物品ID:物品数量`，多个物品使用`,`连接
* 举例：修改邮件 新手礼包 新手礼包/测试 新手礼包 这是测试用的 201:1,201:2
    * 使用: `邮件 新手礼包` 或者 `邮件 测试`
    * 注意事项：在修改别名之前，请先测试指令是否能执行！并且无论是任何别名，只要在`邮件别名`里面存在，都无法再次修改，每一个别名都需要保证唯一性

### 超级管理指令(主人)

`没什么区别的啦，自己发帮助看`

# 免责声明
遇到问题最好自行解决

大部分代码来自[喵喵插件](https://github.com/yoimiya-kokomi/miao-plugin)和[白纸插件](https://github.com/HeadmasterTan/zhi-plugin)

本插件所有资源都来自互联网，请不要把此插件用于任何商业性行为，侵权请联系我删除。
