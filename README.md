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


需要手动修改的是`server.yaml`，你需要添加你的服务器,按照文件内的说明添加即可。
其他文件无需手动添加，都有配置指令。

```
# 请注意保持每个服务器的键名、名称、id为唯一一个，切换服务器使用
# 如果你服务器启用了sign，请把signswitch设置为true
# 这是默认配置的服务器，群|频道|微信初始化的使用使用此服务器
"小钰-3.2":
  id: "1"
  name: "小钰"
  version: "3.2"
  ip: "192.168.56.128"
  port: 20011
  region: "dev_gio"
  sign: "zyy"
  signswitch: "false"


# 自定义服务器1，可按需求添加
"小钰-3.5":
  id: "2"
  name: "小钰"
  version: "3.5"
  ip: "192.168.56.128"
  port: 20011
  region: "dev_gio"
  sign: "zyy"
  signswitch: "false"
```
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
插件会覆盖默认的`Yunzai`帮助，如果想使用默认帮助，发送`云崽帮助`即可

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

开启GM

关闭GM

绑定管理@玩家

解绑管理@玩家

全局拉黑@玩家

解除拉黑@玩家

服务器

切换服务器+ID



# 其他
本人不太懂代码，所以碰到问题能自行解决最好。

大部分代码来自[喵喵插件](https://github.com/yoimiya-kokomi/miao-plugin)和[白纸插件](https://github.com/HeadmasterTan/zhi-plugin)

本插件所有资源都来自互联网，请不要把此插件用于任何商业性行为，侵权请联系我删除。
