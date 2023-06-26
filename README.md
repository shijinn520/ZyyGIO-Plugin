使用`Yunzai`执行`hk4e`的GM指令

## 安装Yunzai

* 根据自己的需求任选其一安装即可
* Miao-Yunzai：[Gitee](https://gitee.com/yoimiya-kokomi/Miao-Yunzai) | [Github](https://github.com/yoimiya-kokomi/Miao-Yunzai)
* TRSS-Yunzai：[Gitee](https://gitee.com/TimeRainStarSky/Yunzai) | [Github](https://github.com/TimeRainStarSky/Yunzai)

| 支持的协议       | QQ群 | QQ频道 | QQ频道-官方 | WeChat | Telegram | Discord | KOOK |
|-------------|-----|------|---------|--------|----------|---------|------|
| Miao-Yunzai | ✔   |      | ✔       |        |          |         |      |
| TRSS-Yunzai | ✔   | ✔    | ✔       | ✔      | ✔        | ✔       | ✔    |

## 安装插件

在`Yunzai`根目录执行，任选其一

Gitee：
```
git clone --depth 1 https://gitee.com/Zyy955/ZyyGio-Plugin ./plugins/ZyyGio-Plugin
```

Github：
```
git clone --depth 1 https://github.com/Zyy955/ZyyGio-Plugin ./plugins/ZyyGio-Plugin
```
## 温馨提示：
* 初次使用需要先配置`ZyyGio-Plugin/config/server.yaml`
* 如需使用`cdk-快捷生成`，请配置`ZyyGio-Plugin/config/cdk.yaml`

## 插件结构

config：

| 文件           | 作用        |
|:------------:|:---------:|
| cdk.yaml     | 快捷生成cdk配置 |
| command.yaml | 命令别名配置    |
| items.yaml   | 签到物品配置    |
| mail.yaml    | 邮件别名配置    |
| other.yaml   | 黑白名单      |
| server.yaml  | 服务器配置     |


## 效果展示：

在线玩家：

![在线玩家示例](https://i.328888.xyz/2023/05/13/iuRFgt.png)

GM指令：

![别名指令示例](https://i.328888.xyz/2023/04/30/iKq4VU.png)
![普通指令示例](https://i.328888.xyz/2023/04/30/iKqAbv.png)
![添加命令示例](https://i.328888.xyz/2023/05/13/iuRGKJ.png)

邮件：

![邮件别名示例](https://i.328888.xyz/2023/04/30/iKYK3N.png)
![普通指令示例](https://i.328888.xyz/2023/04/30/iKqUQy.png)
![添加邮件示例](https://i.328888.xyz/2023/05/13/iuRhUc.png)



## 功能相关-主人可用
* 请注意其中的空格
```
<开启|关闭><gm|GM>
<开启|关闭><邮件>
<开启|关闭><签到>
<开启|关闭><生日>
<开启|关闭><cdk|CDK>
<开启|关闭><cdk|CDK><生成>
<开启|关闭><ping|在线玩家>
<功能列表|当前功能>

[/]<设置|绑定><管理>
[/]<解除|解绑><管理>

[/]<服务器>
[/]<切换服务器><ID>
[/]<切换生日服务器><ID>
[/]<添加><UID|Uid|uid> <起始UID> <截止UID>

[/]<gm|Gm|GM><更新>
[/]<更新><gm|Gm|GM>
[/]<gm|Gm|GM><强制更新>
[/]<强制更新><gm|Gm|GM>
```


## 管理员相关-主人、管理可用
* 请注意其中的空格
```
[/]<绑定><UID><@玩家>

[/]<全服邮件> <别名>
[/]<全服邮件> <标题> <内容> <物品ID:数量,物品ID:数量>

// 别名和指令都只有一个，不需要带`/`，邮件的多个物品也是。
[/]<添加命令> <主别名/别名2> </指令1/指令2>
[/]<添加邮件> <主别名/别名2> <标题> <内容> <物品ID:数量,物品ID:数量>

[/]<查看命令><主别名>
[/]<查看邮件><主别名>

[/]<添加命令别名> <主别名> <新别名>
[/]<添加邮件别名> <主别名> <新别名>

[/]<删除命令> <主别名>
[/]<删除邮件> <主别名>

[/]<生成cdk帮助>
[/]<生成cdk>
[/]<快捷生成列表>
[/]<快捷生成><键名>
[/]<自定义cdk-兑换类型-兑换码-总使用次数-单uid使用次数-对应命令>
[/]<随机cdk-兑换类型-生成数量-TXT前缀-对应命令>
```


## * 玩家相关-所有人可用
* 请注意其中的空格
```
[/]<绑定><UID>

</><别名|gm指令>

<签到>

<ping|状态|在线玩家|在线人数>
<子区>

[/]<邮件> <别名>
[/]<邮件> <标题> <内容> <物品ID:数量,物品ID:数量>

[/]<兑换><兑换码>

[/]<帮助|help>
[/]<指令|命令><别名>
[/]<邮件别名>
[/]<别名帮助>

[/]<我的><ID|id>
```

## 其他

* 插件会覆盖默认的`Yunzai`帮助，如果想使用默认帮助，发送`指令|云崽帮助`即可

## 鸣谢：
[Miao-Yunzai](https://github.com/yoimiya-kokomi/Miao-Yunzai)

[TRSS-Yunzai](https://github.com/TimeRainStarSky/Yunzai)

[喵喵插件](https://github.com/yoimiya-kokomi/miao-plugin)

[白纸插件](https://github.com/HeadmasterTan/zhi-plugin)

## 免责声明：
使用此插件产生的一切后果与本人均无关

请不要用于任何商业性行为

插件所有资源都来自互联网，侵删
