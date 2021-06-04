# 远程Cactbot

这篇文章将指导您可以让其他人在不运行ACT的情况下可以获得自己的cactbot提示和DPS数字等。 这对于PS4用户和DX9用户来说是一大助力。

本文档推荐使用OverlayPlugin内置的端口转发功能实现。 端口转发可以为连接的每个人提供定制触发器。 此方式同样支持让他人实时查看dps数据，或是其他类型的悬浮窗。

## Alternatives

另一种方式是使用 [discord bot plugin](https://github.com/Makar8000/ACT-Discord-Triggers/wiki/First-Time-Setup-Guide)。 Discord Bot可以播放cactbot的所有语音提示给其他队友。

For cactbot, this is less great because many cactbot triggers are personalized and it is not meant to be a generalized "raid caller" even if it sort of works that way. 而且，当前cactbot的音频不能通过该插件播放。

If a single discord tts raidcaller is what you are really looking for, [Triggernometry](https://github.com/Aho-Senpai/Aho-Triggers/blob/main/Triggernometry/Docs/FAQ.md#discord-callouts-ready) will be a better fit than cactbot for what you are trying to do.

## 端口转发概述

开启ACT后，您需要按照以下步骤进行操作：

- [配置 OverlayPlugin WSServer](#配置-overlayplugin-wsserver)
- [测试连接](#测试连接)
- [连接至远程ACT](#连接至远程act)
- [配置 Raidboss](#配置-raidboss)

更多信息，请参阅 [HALP](#halp) 部分。

## 配置 OverlayPlugin WSServer

OverlayPlugin会启动一个服务器，接受 [WebSocket](https://en.wikipedia.org/wiki/WebSocket) 连接，让其他程序可以使用ACT的数据。 (该功能与早已不再维护的ACTWebSocket不同，cactbot也不支持ACTWebSocket。) OverlayPlugin还内置了ngrok的端口转发功能， 使局域网以外的其他人也可以连接到该WebSocket服务器。

要启用该功能，请至 **Plugins** -> **OverlayPlugin WSServer** -> **共享 Overlay**。

![image](images/remote_wsserver.png)

在此页面选择您的地区。 单击 `开始`。 此时ACT应当会输出形如 `Launching ngrok...Done!` 的文本。 并且在窗口上端会有 `状态: 已启动` 的字样。

### 测试连接

此时，您已经建立了端口转发，请测试连接。 在本文档的所有示例中，您应当将 `a31a5403.ngrok.io` 替换为日志窗口中显示的URL。 使用浏览器访问 <https://a31a5403.ngrok.io/> (当然此处应当替换为您自己的服务器URL) 应该会显示"It Works"。

![image](images/remote_itworks.png)

当配置完毕后，您可以选择一个悬浮窗预设，如 `Cactbot Test`，OverlayPlugin会帮您生成一个可直接在浏览器中打开的URL，如： <https://quisquous.github.io/cactbot/ui/test/test.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>

这是Github的服务器提供的网页，但悬浮窗网页会读取查询字符串中给出的网址并连接到ACT。 在ACT和FFXIV都打开的情况下，您应该可以看到测试数据随着游戏内的操作不断更新。

![image](images/remote_testui.png)

若悬浮窗没有正常工作，也看不到任何信息，请参阅 [HALP](#halp) 部分。

## 连接至远程ACT

现在，你的队友可以远程连接到您的ACT。 但是，所有悬浮窗页面都必须是远程托管的页面。 与直接读取文件（即 `C:\Users\tinipoutini\cactbot\ui\raidboss\raidboss.html`）不同，此时您应当使用Github的网址，如 `https://quisquous.github.io/cactbot/ui/raidboss/raidboss.html`。

您可以使用OverlayPlugin标签页底部的URL生成器生成任何预设的悬浮窗的URL。

比如：

- cactbot raidboss 悬浮窗: <https://quisquous.github.io/cactbot/ui/raidboss/raidboss.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>
- rdmty DPS 悬浮窗: <https://quisquous.github.io/cactbot/ui/dps/rdmty/dps.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>
- cactbot oopsy 悬浮窗: <https://quisquous.github.io/cactbot/ui/oopsyraidsy/oopsyraidsy.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>

### 配置 Raidboss

远程加载raidboss悬浮窗时，您将看到一个玩家选择对话框。

![image](images/remote_playerselect.png)

进入副本后，团队成员会被填充至玩家列表。 选择自己的名字，然后点击 `启用悬浮窗` 开始使用。

如果您需要TTS，但提供远程服务的队友没有开启该功能， 您可以通过勾选 `强制启用TTS` 复选框以强制启用。

但需要注意的是，目前cactbot的所有自定义内容都是本地化的，远程玩家会继承提供远程服务的队友的所有自定义配置。 目前您可以覆盖的设置仅有启用TTS。

以后可能会添加参数以加载您自己的用户文件夹，但目前还没有。

### 其他悬浮窗

并非所有的悬浮窗都能远程运行。 目前仅支持raidboss、oopsy、pullcounter和dps悬浮窗等。

radar、jobs和fisher需要玩家的更多信息才能工作，因此目前不支持。

## HALP

若您卡在某一步骤，或对其有疑问，您可以在[FFXIV ACT discord](https://discord.gg/ahFKcmx)的#troubleshooting频道进行询问。 Cactbot没有属于自己的discord。

端口转发并不是 cactbot 的功能，github issue仅受理 raidboss 队员选择的问题。

### 疑难解答

在浏览器访问形如 <https://quisquous.github.io/cactbot/ui/test/test.html?OVERLAY_WS=wss://127.0.0.1:10501/ws> 的网址时，但没有输出任何信息，在确认自己已经开启了游戏客户端、ACT以及WSServer后仍无法解决，您应当关注Devtools中的信息。

在Chrome中，右键单击页面，选择 `检查元素` (或使用组合键 Ctrl+Shift+I)。 然后单击 `Console`，观察控制台输出：

![image](images/remote_devtools.png)

这将为您提供更多信息以帮助诊断您的问题。
