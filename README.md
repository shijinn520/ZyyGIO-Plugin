此插件可以让你在QQ群、QQ频道执行hk4e的GM指令

理论来说，`Miao-Yunzai`应该也适配此插件，如果你只需要在QQ群使用，可以帮我测试。

# 安装TRSS-Yunzai
Gitee:[TRSS-Yunzai](https://gitee.com/TimeRainStarSky/Yunzai)

Github:[TRSS-Yunzai](https://gitee.com/TimeRainStarSky/Yunzai)

参考教程：[点击前往TRSS-Yunzai安装教程](https://rainkavik.com/archives/339/)

一些注意事项：貌似如果想在频道使用，go-cqhttp的协议只能设置为`1:安卓协议`或者`6:aPad`，其他协议我已经测试了`2:Android Watch`和`3:MacOS`，都是不可接频道消息的。
# 安装插件

克隆仓库

Gitee：
```
git clone --depth 1 https://gitee.com/ZYY-Yu/Zyy-GM-plugin plugins/Zyy-GM-plugin
```

Github：
```
git clone --depth 1 https://github.com/ZYY-Yu/Zyy-GM-plugin plugins/Zyy-GM-plugin
```

# 配置插件
* 存储群配置：`Zyy-GM-plugin\resources\hk4e\config.yaml`

* 存储指令别名：`Zyy-GM-plugin\resources\hk4e\data.yaml`

* 存储邮件别名：`Zyy-GM-plugin\resources\hk4e\mail.yaml`

* 存储服务器：`Zyy-GM-plugin\resources\hk4e\server.yaml`


需要手动修改`server.yaml`，你需要添加你的服务器,文件内有一个模板，请复制该模板在进行修改，以防出错`(你是大佬当我没说)`

注意事项：

* 请保持服务器的键名和ID为唯一
* 如果你的服务器启用了 `sign` ，请在配置中把 `signswitch: "false"` 修改为 `signswitch: "true"` 

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


关于别名这一块，在最开始的版本中是直接克隆仓库会自带了，现版本删除以防止更新发生频繁错误，需要自行手动填入。

#### 以下是我提供的一些自定义配置
<details><summary>data.yaml</summary>
```
无限体力: 
  - stamina infinite on
无限体力off: 
  - stamina infinite off
Q无限充能:
  - energy infinite on
q无限充能:
  - energy infinite on
Q无限充能off:
  - energy infinite off
q无限充能off:
  - energy infinite off
玩家无敌:
  - wudi global avatar on
玩家无敌off:
  - wudi global avatar off
怪物无敌:
  - wudi global monster on
怪物无敌off:
  - wudi global monster off
解锁命座:
  - talent unlock all
解锁命之座:
  - talent unlock all
90:
  - break 6
  - skill all 10
  - talent unlock all
  - level 90
无锋剑:
  - equip add 11101 90 6 5
银剑:
  - equip add 11201 90 6 5
冷刃:
  - equip add 11301 90 6 5
黎明神剑:
  - equip add 11302 90 6 5
旅行剑:
  - equip add 11303 90 6 5
暗铁剑:
  - equip add 11304 90 6 5
吃虎鱼刀:
  - equip add 11305 90 6 5
飞天御剑:
  - equip add 11306 90 6 5
西风剑:
  - equip add 11401 90 6 5
笛剑:
  - equip add 11402 90 6 5
祭礼剑:
  - equip add 11403 90 6 5
宗室长剑:
  - equip add 11404 90 6 5
匣里龙吟:
  - equip add 11405 90 6 5
试作斩岩:
  - equip add 11406 90 6 5
铁蜂刺:
  - equip add 11407 90 6 5
黑岩长剑:
  - equip add 11408 90 6 5
黑剑:
  - equip add 11409 90 6 5
暗巷闪光:
  - equip add 11410 90 6 5
降临之剑:
  - equip add 11412 90 6 5
腐殖之剑:
  - equip add 11413 90 6 5
天目影打刀:
  - equip add 11414 90 6 5
辰砂之纺锤:
  - equip add 11415 90 6 5
笼钓瓶一心:
  - equip add 11416 90 6 5
原木刀:
  - equip add 11417 90 6 5
西福斯的月光:
  - equip add 11418 90 6 5
一心传名刀:
  - equip add 11421 90 6 5
东花坊时雨:
  - equip add 11422 90 6 5
风鹰剑:
  - equip add 11501 90 6 5
天空之刃:
  - equip add 11502 90 6 5
苍古自由之誓:
  - equip add 11503 90 6 5
斫峰之刃:
  - equip add 11504 90 6 5
磐岩结绿:
  - equip add 11505 90 6 5
雾切之回光:
  - equip add 11509 90 6 5
波乱月白经津:
  - equip add 11510 90 6 5
圣显之钥:
  - equip add 11511 90 6 5
裁叶萃光:
  - equip add 11512 90 6 5
训练大剑:
  - equip add 12101 90 6 5
佣兵重剑:
  - equip add 12201 90 6 5
铁影阔剑:
  - equip add 12301 90 6 5
沐浴龙血的剑:
  - equip add 12302 90 6 5
白铁大剑:
  - equip add 12303 90 6 5
石英大剑:
  - equip add 12304 90 6 5
以理服人:
  - equip add 12305 90 6 5
飞天大御剑:
  - equip add 12306 90 6 5
西风大剑:
  - equip add 12401 90 6 5
钟剑:
  - equip add 12402 90 6 5
祭礼大剑:
  - equip add 12403 90 6 5
宗室大剑:
  - equip add 12404 90 6 5
雨裁:
  - equip add 12405 90 6 5
试作古华:
  - equip add 12406 90 6 5
白影剑:
  - equip add 12407 90 6 5
黑岩斩刀:
  - equip add 12408 90 6 5
螭骨剑:
  - equip add 12409 90 6 5
千岩古剑:
  - equip add 12410 90 6 5
雪葬的星银:
  - equip add 12411 90 6 5
衔珠海皇:
  - equip add 12412 90 6 5
桂木斩长正:
  - equip add 12414 90 6 5
玛海菈的水色:
  - equip add 12415 90 6 5
恶王丸:
  - equip add 12416 90 6 5
森林王器:
  - equip add 12417 90 6 5
饰铁之花:
  - equip add 12418 90 6 5
天空之傲:
  - equip add 12501 90 6 5
狼的末路:
  - equip add 12502 90 6 5
松籁响起之时:
  - equip add 12503 90 6 5
无工之剑:
  - equip add 12504 90 6 5
赤角石溃杵:
  - equip add 12510 90 6 5
苇海信标:
  - equip add 12511 90 6 5
新手长枪:
  - equip add 13101 90 6 5
铁尖枪:
  - equip add 13201 90 6 5
白缨枪:
  - equip add 13301 90 6 5
钺矛:
  - equip add 13302 90 6 5
黑缨枪:
  - equip add 13303 90 6 5
旗杆:
  - equip add 13304 90 6 5
匣里灭辰:
  - equip add 13401 90 6 5
试作星镰:
  - equip add 13402 90 6 5
流月针:
  - equip add 13403 90 6 5
黑岩刺枪:
  - equip add 13404 90 6 5
决斗之枪:
  - equip add 13405 90 6 5
千岩长枪:
  - equip add 13406 90 6 5
西风长枪:
  - equip add 13407 90 6 5
宗室猎枪:
  - equip add 13408 90 6 5
龙脊长枪:
  - equip add 13409 90 6 5
喜多院十文字:
  - equip add 13414 90 6 5
渔获:
  - equip add 13415 90 6 5
断浪长鳍:
  - equip add 13416 90 6 5
贯月矢:
  - equip add 13417 90 6 5
风信之锋:
  - equip add 13419 90 6 5
护摩之杖:
  - equip add 13501 90 6 5
天空之脊:
  - equip add 13502 90 6 5
贯虹之槊:
  - equip add 13504 90 6 5
和璞鸢:
  - equip add 13505 90 6 5
息灾:
  - equip add 13507 90 6 5
薙草之稻光:
  - equip add 13509 90 6 5
赤沙之杖:
  - equip add 13511 90 6 5
学徒笔记:
  - equip add 14101 90 6 5
口袋魔导书:
  - equip add 14201 90 6 5
魔导绪论:
  - equip add 14301 90 6 5
讨龙英杰谭:
  - equip add 14302 90 6 5
异世界行记:
  - equip add 14303 90 6 5
翡玉法球:
  - equip add 14304 90 6 5
甲级宝珏:
  - equip add 14305 90 6 5
琥珀玥:
  - equip add 14306 90 6 5
西风秘典:
  - equip add 14401 90 6 5
流浪乐章:
  - equip add 14402 90 6 5
祭礼残章:
  - equip add 14403 90 6 5
宗室秘法录:
  - equip add 14404 90 6 5
匣里日月:
  - equip add 14405 90 6 5
试作金珀:
  - equip add 14406 90 6 5
万国诸海图谱:
  - equip add 14407 90 6 5
黑岩绯玉:
  - equip add 14408 90 6 5
昭心:
  - equip add 14409 90 6 5
暗巷的酒与诗:
  - equip add 14410 90 6 5
忍冬之果:
  - equip add 14412 90 6 5
嘟嘟可故事集:
  - equip add 14413 90 6 5
白辰之环:
  - equip add 14414 90 6 5
证誓之明瞳:
  - equip add 14415 90 6 5
流浪的晚星:
  - equip add 14416 90 6 5
盈满之实:
  - equip add 14417 90 6 5
天空之卷:
  - equip add 14501 90 6 5
四风原典:
  - equip add 14502 90 6 5
尘世之锁:
  - equip add 14504 90 6 5
不灭月华:
  - equip add 14506 90 6 5
神乐之真意:
  - equip add 14509 90 6 5
千夜浮梦:
  - equip add 14511 90 6 5
图莱杜拉的回忆:
  - equip add 14512 90 6 5
猎弓:
  - equip add 15101 90 6 5
历练的猎弓:
  - equip add 15201 90 6 5
鸦羽弓:
  - equip add 15301 90 6 5
神射手之誓:
  - equip add 15302 90 6 5
反曲弓:
  - equip add 15303 90 6 5
弹弓:
  - equip add 15304 90 6 5
信使:
  - equip add 15305 90 6 5
黑檀弓:
  - equip add 15306 90 6 5
西风猎弓:
  - equip add 15401 90 6 5
绝弦:
  - equip add 15402 90 6 5
祭礼弓:
  - equip add 15403 90 6 5
宗室长弓:
  - equip add 15404 90 6 5
弓藏:
  - equip add 15405 90 6 5
试作澹月:
  - equip add 15406 90 6 5
钢轮弓:
  - equip add 15407 90 6 5
黑岩战弓:
  - equip add 15408 90 6 5
苍翠猎弓:
  - equip add 15409 90 6 5
暗巷猎手:
  - equip add 15410 90 6 5
落霞:
  - equip add 15411 90 6 5
幽夜华尔兹:
  - equip add 15412 90 6 5
风花之颂:
  - equip add 15413 90 6 5
破魔之弓:
  - equip add 15414 90 6 5
掠食者:
  - equip add 15415 90 6 5
曚云之月:
  - equip add 15416 90 6 5
王下近侍:
  - equip add 15417 90 6 5
竭泽:
  - equip add 15418 90 6 5
天空之翼:
  - equip add 15501 90 6 5
阿莫斯之弓:
  - equip add 15502 90 6 5
终末嗟叹之诗:
  - equip add 15503 90 6 5
冬极白星:
  - equip add 15507 90 6 5
若水:
  - equip add 15508 90 6 5
飞雷之弦振:
  - equip add 15509 90 6 5
猎人之径:
  - equip add 15511 90 6 5
5星武器:
  - equip add 1151 90 6 5
  - equip add 1251 90 6 5
  - equip add 1351 90 6 5
  - equip add 1451 90 6 5
  - equip add 1551 90 6 5
  - equip add 1152 90 6 5
  - equip add 1252 90 6 5
  - equip add 1352 90 6 5
  - equip add 1452 90 6 5
  - equip add 1552 90 6 5
  - equip add 1153 90 6 5
  - equip add 1253 90 6 5
  - equip add 1553 90 6 5
  - equip add 1154 90 6 5
  - equip add 1254 90 6 5
  - equip add 1354 90 6 5
  - equip add 1454 90 6 5
  - equip add 1155 90 6 5
  - equip add 1355 90 6 5
  - equip add 1456 90 6 5
  - equip add 1357 90 6 5
  - equip add 1557 90 6 5
  - equip add 1558 90 6 5
  - equip add 1159 90 6 5
  - equip add 1359 90 6 5
  - equip add 1459 90 6 5
  - equip add 1559 90 6 5
  - equip add 11510 90 6 5
  - equip add 12510 90 6 5
  - equip add 11511 90 6 5
  - equip add 12511 90 6 5
  - equip add 13511 90 6 5
  - equip add 14511 90 6 5
  - equip add 15511 90 6 5
  - equip add 11512 90 6 5
  - equip add 14512 90 6 5
五星武器:
  - equip add 1151 90 6 5
  - equip add 1251 90 6 5
  - equip add 1351 90 6 5
  - equip add 1451 90 6 5
  - equip add 1551 90 6 5
  - equip add 1152 90 6 5
  - equip add 1252 90 6 5
  - equip add 1352 90 6 5
  - equip add 1452 90 6 5
  - equip add 1552 90 6 5
  - equip add 1153 90 6 5
  - equip add 1253 90 6 5
  - equip add 1553 90 6 5
  - equip add 1154 90 6 5
  - equip add 1254 90 6 5
  - equip add 1354 90 6 5
  - equip add 1454 90 6 5
  - equip add 1155 90 6 5
  - equip add 1355 90 6 5
  - equip add 1456 90 6 5
  - equip add 1357 90 6 5
  - equip add 1557 90 6 5
  - equip add 1558 90 6 5
  - equip add 1159 90 6 5
  - equip add 1359 90 6 5
  - equip add 1459 90 6 5
  - equip add 1559 90 6 5
  - equip add 11510 90 6 5
  - equip add 12510 90 6 5
  - equip add 11511 90 6 5
  - equip add 12511 90 6 5
  - equip add 13511 90 6 5
  - equip add 14511 90 6 5
  - equip add 15511 90 6 5
  - equip add 11512 90 6 5
  - equip add 14512 90 6 5
四星武器:
  - equip add 1432 90 6 5
  - equip add 1141 90 6 5
  - equip add 1241 90 6 5
  - equip add 1341 90 6 5
  - equip add 1441 90 6 5
  - equip add 1541 90 6 5
  - equip add 1142 90 6 5
  - equip add 1242 90 6 5
  - equip add 1342 90 6 5
  - equip add 1442 90 6 5
  - equip add 1542 90 6 5
  - equip add 1143 90 6 5
  - equip add 1243 90 6 5
  - equip add 1343 90 6 5
  - equip add 1443 90 6 5
  - equip add 1543 90 6 5
  - equip add 1144 90 6 5
  - equip add 1244 90 6 5
  - equip add 1344 90 6 5
  - equip add 1444 90 6 5
  - equip add 1544 90 6 5
  - equip add 1145 90 6 5
  - equip add 1245 90 6 5
  - equip add 1345 90 6 5
  - equip add 1445 90 6 5
  - equip add 1545 90 6 5
  - equip add 1146 90 6 5
  - equip add 1246 90 6 5
  - equip add 1346 90 6 5
  - equip add 1446 90 6 5
  - equip add 1546 90 6 5
  - equip add 1147 90 6 5
  - equip add 1247 90 6 5
  - equip add 1347 90 6 5
  - equip add 1447 90 6 5
  - equip add 1547 90 6 5
  - equip add 1148 90 6 5
  - equip add 1248 90 6 5
  - equip add 1348 90 6 5
  - equip add 1448 90 6 5
  - equip add 1548 90 6 5
  - equip add 1149 90 6 5
  - equip add 1249 90 6 5
  - equip add 1349 90 6 5
  - equip add 1449 90 6 5
  - equip add 1549 90 6 5
  - equip add 11410 90 6 5
  - equip add 12410 90 6 5
  - equip add 14410 90 6 5
  - equip add 15410 90 6 5
  - equip add 12411 90 6 5
  - equip add 15411 90 6 5
  - equip add 11412 90 6 5
  - equip add 12412 90 6 5
  - equip add 14412 90 6 5
  - equip add 15412 90 6 5
  - equip add 11413 90 6 5
  - equip add 14413 90 6 5
  - equip add 15413 90 6 5
  - equip add 11414 90 6 5
  - equip add 12414 90 6 5
  - equip add 13414 90 6 5
  - equip add 14414 90 6 5
  - equip add 15414 90 6 5
  - equip add 11415 90 6 5
  - equip add 12415 90 6 5
  - equip add 13415 90 6 5
  - equip add 14415 90 6 5
  - equip add 15415 90 6 5
  - equip add 11416 90 6 5
  - equip add 12416 90 6 5
  - equip add 13416 90 6 5
  - equip add 14416 90 6 5
  - equip add 15416 90 6 5
  - equip add 11417 90 6 5
  - equip add 12417 90 6 5
  - equip add 13417 90 6 5
  - equip add 14417 90 6 5
  - equip add 15417 90 6 5
  - equip add 11418 90 6 5
  - equip add 12418 90 6 5
  - equip add 15418 90 6 5
  - equip add 11419 90 6 5
  - equip add 13419 90 6 5
  - equip add 11420 90 6 5
  - equip add 11421 90 6 5
  - equip add 11422 90 6 5
4星武器:
  - equip add 1432 90 6 5
  - equip add 1141 90 6 5
  - equip add 1241 90 6 5
  - equip add 1341 90 6 5
  - equip add 1441 90 6 5
  - equip add 1541 90 6 5
  - equip add 1142 90 6 5
  - equip add 1242 90 6 5
  - equip add 1342 90 6 5
  - equip add 1442 90 6 5
  - equip add 1542 90 6 5
  - equip add 1143 90 6 5
  - equip add 1243 90 6 5
  - equip add 1343 90 6 5
  - equip add 1443 90 6 5
  - equip add 1543 90 6 5
  - equip add 1144 90 6 5
  - equip add 1244 90 6 5
  - equip add 1344 90 6 5
  - equip add 1444 90 6 5
  - equip add 1544 90 6 5
  - equip add 1145 90 6 5
  - equip add 1245 90 6 5
  - equip add 1345 90 6 5
  - equip add 1445 90 6 5
  - equip add 1545 90 6 5
  - equip add 1146 90 6 5
  - equip add 1246 90 6 5
  - equip add 1346 90 6 5
  - equip add 1446 90 6 5
  - equip add 1546 90 6 5
  - equip add 1147 90 6 5
  - equip add 1247 90 6 5
  - equip add 1347 90 6 5
  - equip add 1447 90 6 5
  - equip add 1547 90 6 5
  - equip add 1148 90 6 5
  - equip add 1248 90 6 5
  - equip add 1348 90 6 5
  - equip add 1448 90 6 5
  - equip add 1548 90 6 5
  - equip add 1149 90 6 5
  - equip add 1249 90 6 5
  - equip add 1349 90 6 5
  - equip add 1449 90 6 5
  - equip add 1549 90 6 5
  - equip add 11410 90 6 5
  - equip add 12410 90 6 5
  - equip add 14410 90 6 5
  - equip add 15410 90 6 5
  - equip add 12411 90 6 5
  - equip add 15411 90 6 5
  - equip add 11412 90 6 5
  - equip add 12412 90 6 5
  - equip add 14412 90 6 5
  - equip add 15412 90 6 5
  - equip add 11413 90 6 5
  - equip add 14413 90 6 5
  - equip add 15413 90 6 5
  - equip add 11414 90 6 5
  - equip add 12414 90 6 5
  - equip add 13414 90 6 5
  - equip add 14414 90 6 5
  - equip add 15414 90 6 5
  - equip add 11415 90 6 5
  - equip add 12415 90 6 5
  - equip add 13415 90 6 5
  - equip add 14415 90 6 5
  - equip add 15415 90 6 5
  - equip add 11416 90 6 5
  - equip add 12416 90 6 5
  - equip add 13416 90 6 5
  - equip add 14416 90 6 5
  - equip add 15416 90 6 5
  - equip add 11417 90 6 5
  - equip add 12417 90 6 5
  - equip add 13417 90 6 5
  - equip add 14417 90 6 5
  - equip add 15417 90 6 5
  - equip add 11418 90 6 5
  - equip add 12418 90 6 5
  - equip add 15418 90 6 5
  - equip add 11419 90 6 5
  - equip add 13419 90 6 5
  - equip add 11420 90 6 5
  - equip add 11421 90 6 5
  - equip add 11422 90 6 5
杀怪:
  - kill monster all
q:
  - energy infinite on
Q:
  - energy infinite on
雷神专武:
  - equip add 13509 90 6 5
雾切:
  - equip add 11509 90 6 5
阿莫斯:
  - equip add 15502 90 6 5
大伟丘:
  - monster 21011501 20 200
狼王:
  - monster 29020101 5 200
巨蛇:
  - monster 24010401 20 200
雷鸟:
  - monster 20070101 5 200
肥陀:
  - monster 29040101 2 200
树脂:
  - item add 220007 100
好感:
  - item add 105  99999
火法:
  - monster 22010102 10 200
Q充能:
  - energy infinite on
水晶块:
  - item add 101003 500
白铁块:
  - item add 101002 500
雷神瞳:
  - item add 107014 500
草神瞳:
  - item add 107017 500
祝圣精华:
  - item add 105003 5000
草之印:
  - item add 303 5200
雷之印:
  - item add 304 5200
全部角色:
  - item add avatar all
式小将:
  - item add 220045
缥锦机关:
  - item add 220074
魔女:
  - equip add 23361 1 15008 501241 6 501031 1 501201 1 501221 1
  - equip add 23365 1 10002 501231 1 501241 1 501201 1 501221 6
  - equip add 23362 1 10003 501031 1 501241 1 501221 1 501201 6
  - equip add 23364 1 10001 501241 1 501031 1 501201 6 501221 1
  - equip add 23363 1 30960 501031 1 501231 1 501241 6 501221 1
神里绫华: 
  - avatar add 10000002
琴: 
  - avatar add 10000003
空: 
  - avatar add 10000005
丽莎: 
  - avatar add 10000006
荧: 
  - avatar add 10000007
芭芭拉: 
  - avatar add 10000014
凯亚: 
  - avatar add 10000015
迪卢克: 
  - avatar add 10000016
雷泽: 
  - avatar add 10000020
安柏: 
  - avatar add 10000021
温迪: 
  - avatar add 10000022
香菱: 
  - avatar add 10000023
北斗: 
  - avatar add 10000024
行秋: 
  - avatar add 10000025
魈: 
  - avatar add 10000026
凝光: 
  - avatar add 10000027
可莉: 
  - avatar add 10000029
钟离: 
  - avatar add 10000030
菲谢尔: 
  - avatar add 10000031
班尼特: 
  - avatar add 10000032
达达利亚: 
  - avatar add 10000033
诺艾尔: 
  - avatar add 10000034
七七: 
  - avatar add 10000035
重云: 
  - avatar add 10000036
甘雨: 
  - avatar add 10000037
阿贝多: 
  - avatar add 10000038
迪奥娜: 
  - avatar add 10000039
莫娜: 
  - avatar add 10000041
刻晴: 
  - avatar add 10000042
砂糖: 
  - avatar add 10000043
辛焱: 
  - avatar add 10000044
罗莎莉亚: 
  - avatar add 10000045
胡桃: 
  - avatar add 10000046
枫原万叶: 
  - avatar add 10000047
烟绯: 
  - avatar add 10000048
宵宫: 
  - avatar add 10000049
托马: 
  - avatar add 10000050
优菈: 
  - avatar add 10000051
雷电将军: 
  - avatar add 10000052
早柚: 
  - avatar add 10000053
珊瑚宫心海: 
  - avatar add 10000054
五郎: 
  - avatar add 10000055
九条裟罗: 
  - avatar add 10000056
荒泷一斗: 
  - avatar add 10000057
八重神子: 
  - avatar add 10000058
鹿野院平藏: 
  - avatar add 10000059
夜兰: 
  - avatar add 10000060
埃洛伊: 
  - avatar add 10000062
申鹤: 
  - avatar add 10000063
云堇: 
  - avatar add 10000064
久岐忍: 
  - avatar add 10000065
神里绫人: 
  - avatar add 10000066
柯莱: 
  - avatar add 10000067
多莉: 
  - avatar add 10000068
提纳里: 
  - avatar add 10000069
妮露: 
  - avatar add 10000070
赛诺: 
  - avatar add 10000071
坎蒂丝: 
  - avatar add 10000072
纳西妲: 
  - avatar add 10000073
莱依拉: 
  - avatar add 10000074
解锁神像:
  - quest finish 30302
  - quest finish 30303
  - quest finish 30304
  - quest finish 30305
  - quest finish 30306
  - quest finish 30307
  - quest finish 30308
  - quest finish 30309
  - quest finish 30310
  - quest finish 30311
  - quest finish 30312
  - quest finish 30313
  - quest finish 30314
  - quest finish 30315
  - quest finish 30316
  - quest finish 30317
  - quest finish 30318
  - quest finish 30319
  - quest finish 30320
  - quest finish 30321
  - quest finish 30322
  - quest finish 30323
  - quest finish 30224
  - quest finish 30325
  - quest finish 30326
  - quest finish 30327
  - quest finish 30322
解锁锚点:
  - point 3 all
解锁地图:
  - point 3 all
  - quest finish 30302
  - quest finish 30303
  - quest finish 30304
  - quest finish 30305
  - quest finish 30306
  - quest finish 30307
  - quest finish 30308
  - quest finish 30309
  - quest finish 30310
  - quest finish 30311
  - quest finish 30312
  - quest finish 30313
  - quest finish 30314
  - quest finish 30315
  - quest finish 30316
  - quest finish 30317
  - quest finish 30318
  - quest finish 30319
  - quest finish 30320
  - quest finish 30321
  - quest finish 30322
  - quest finish 30323
  - quest finish 30224
  - quest finish 30325
  - quest finish 30326
  - quest finish 30327
  - quest finish 30322
结晶:
  - mcoin 99999
原石:
  - hcoin 99999
摩拉:
  - scoin 99999
洞天宝钱:
  - home_coin 99999
浓缩:
  - item add 220007 20
hp:
  - revive
```
</details>

<details><summary>mail.yaml</summary>
```
新手礼包:
  title: 「新手礼包」
  content: 亲爱的旅行者\n欢迎来到提瓦特大陆！作为一个新手玩家，你将要开始一段充满冒险和挑战的旅程。在这个美丽的世界里，你将会遇到各种神秘的生物，探索古老的遗迹，挑战强大的敌人，还有许多奇妙的地方等待你去发现。\n作为旅行者，你有一个非常重要的任务，就是解开提瓦特大陆的谜团。为了完成这个任务，你需要探索这个世界的每一个角落，找到隐藏在各处的线索和秘密。你可以和其他旅行者组成队伍，一起完成任务和挑战，也可以独自行动，体验更多的冒险。\n在这个世界里，你将会拥有不同的角色和技能。每个角色都有独特的特点和技能，你需要根据情况选择不同的角色来完成任务和挑战。通过战斗和任务，你可以获得经验和奖励，提升自己的能力，成为更强大的旅行者。\n我希望这封邮件可以帮助你更好地了解提瓦特大陆这个世界。如果你有任何问题或困惑，请不要犹豫，随时与我们联系。祝你在这个神秘的世界里玩得开心！\n祝好！
  item_list: 220007:5,105003:999,1202:3,201:1000
木材大礼包:
  title: 「木材大礼包」
  content: 亲爱的旅行者\n欢迎来到提瓦特大陆！作为一个新手玩家，你将要开始一段充满冒险和挑战的旅程。在这个美丽的世界里，你将会遇到各种神秘的生物，探索古老的遗迹，挑战强大的敌人，还有许多奇妙的地方等待你去发现。\n作为旅行者，你有一个非常重要的任务，就是解开提瓦特大陆的谜团。为了完成这个任务，你需要探索这个世界的每一个角落，找到隐藏在各处的线索和秘密。你可以和其他旅行者组成队伍，一起完成任务和挑战，也可以独自行动，体验更多的冒险。\n在这个世界里，你将会拥有不同的角色和技能。每个角色都有独特的特点和技能，你需要根据情况选择不同的角色来完成任务和挑战。通过战斗和任务，你可以获得经验和奖励，提升自己的能力，成为更强大的旅行者。\n我希望这封邮件可以帮助你更好地了解提瓦特大陆这个世界。如果你有任何问题或困惑，请不要犹豫，随时与我们联系。祝你在这个神秘的世界里玩得开心！\n祝好！
  item_list: 101301:1000,101302:1000,101303:1000,101304:1000,101307:1000,101308:1000,101309:1000,101310:1000,101311:1000,101312:1000,101313:1000,101314:1000,101315:1000,101316:1000,101317:1000
神瞳大礼包:
  title: 神瞳大礼包
  content: 哒哒哒，你的神瞳礼包已到位
  item_list: 107001:500,107003:500,107014:500,107017:500
时装大礼包:
  title: 时装大礼包
  content: 看，好看的衣服！
  item_list: 340000:1,340001:1,340002:1,340003:1,340004:1,340005:1,340006:1,340007:1,340008:1,340009:1
```
</details>

# 使用流程

### 超级管理流程

##### 1.开启GM
配置好服务器后，在想使用的群聊、频道发送 开启GN
随后发送 切换服务器2
参数说明，这里的2是指你自己设置的服务器ID，自己更改即可，配置完成即可到玩家流程。


### 玩家流程：
##### 1.绑定UID
绑定10002@自己

参数说明：绑定+UID+@自己

2.享受即可


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

添加命令
```
权限：普通玩家可添加不可修改，管理员可直接修改
参数要求：添加命令 [别名名称] [/指令1 /指令2]

示例：添加命令 90 /break 6 /skill all 10 /talent unlock all /level 90
使用：/90

指令说明：使用指令添加别名，添加后在别名前面加上`/`即可使用。
```
添加邮件
```
权限：普通玩家可添加不可修改，管理员可直接修改
参数要求：添加邮件 [邮件别名] [邮件标题] [邮件内容] [物品ID:数量,物品ID:数量]

示例：添加邮件 新手礼包 新手礼包 给你的新手礼包 201:
使用：邮件 新手礼包

指令说明：使用指令添加邮件别名，添加后在别名前面加上`邮件 `即可使用。

```

### 管理员指令
没什么太大的区别，指令都是一致的，只是管理员可以为玩家换绑，修改现有别名的内容。

### 超级管理指令(主人)

`没什么区别的啦，自己发帮助看`

# 其他
本人不太懂代码，所以碰到问题能自行解决最好。

大部分代码来自[喵喵插件](https://github.com/yoimiya-kokomi/miao-plugin)和[白纸插件](https://github.com/HeadmasterTan/zhi-plugin)

本插件所有资源都来自互联网，请不要把此插件用于任何商业性行为，侵权请联系我删除。
