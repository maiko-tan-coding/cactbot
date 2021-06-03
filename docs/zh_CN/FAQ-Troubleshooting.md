# 潜在错误与解决方式

1. [通用 FFXIV ACT 疑难解答](#general-ffxiv-act-troubleshooting)
1. [Cactbot相关问题](#problems-using-cactbot)
1. [捕鱼人模块](#fisher-module)
1. [其他问题](#other-issues)

## 通用 FFXIV ACT 疑难解答

ngld ([OverlayPlugin](https://github.com/ngld/OverlayPlugin)的开发者，Cactbot依赖于此插件) 关于FFXIV ACT Plugin与OverlayPlugin的问题撰写了一篇毛举缕析的常见问题解答，您可以点击 [此处](https://gist.github.com/ngld/e2217563bbbe1750c0917217f136687d) 直达该文章。

若您遇到无法找到 **FFXIV_ACT_Plugin.dll**的错误，请确保 `%APPDATA%\Advanced Combat Tracker\Plugins` 文件夹中存在 **FFXIV_ACT_Plugin.dll** 文件。 您可以通过ACT开始向导 **FFXIV_ACT_Plugin.dll**。

## Cactbot安装中问题

如果您在OverlayPlugin的日志窗口中见到如下或类似的错误： `Error: JS Handler call failed: System.Exception: Tried to call missing handler "cactbotLoadUser"!`，说明你依旧在用hibiyasleep版本的OverlayPlugin插件，您需要更新至ngld版本的[OverlayPlugin](https://github.com/ngld/OverlayPlugin/releases/latest) 。

如果您在OverlayPlugin的日志窗口中见到如下或类似的错误：`Error: LoadAddons: Cactbot.PluginLoader: RainbowMage.OverlayPlugin.TinyIoCResolutionException: Unable to resolve type: Cactbot.CactbotEventSource`，则您很有可能将`CactbotOverlay.dll` 安装至 `OverlayPlugin/addons`。  请按照[安装Cactbot](https://github.com/quisquous/cactbot#installing-cactbot)操作步骤中的描述，将cactbot移动至独立文件夹中。

如果您在OverlayPlugin日志窗口中见到如下或类似的错误：`System.MissingMethodException: Method not found: '!!0[] System.Array.Empty()`，则您安装了错误的 .Net framework 版本。  请安装4.6.1版本及以上的[.NET Framework](https://www.microsoft.com/net/download/framework)。

如果您在启用OverlayPlugin时见到 [CAS policy](https://blogs.msdn.microsoft.com/drew/2009/12/23/xunit-and-td-net-fixing-the-attempt-was-made-to-load-an-assembly-from-a-network-location-problem/) 错误，类似于`An attempt was made to load an assembly from a network location which would have caused the assembly to be sandboxed in previous version of the .NET Framework.`，这意味着您没有解锁DLL文件 (hibiyasleep 或 cactbot)。  首先，终止ACT。  其次，解锁所有文件：相对于多次解锁单个文件，最便捷的方式是解锁原本的zip文件，然后重新解压即可。  最后，重启ACT。

如果您见到类似于如下错误：`Error: (overlay): Exception in SendFastRateEvents: Could not load file or assembly 'FFXIV_ACT_Plugin, Version=(version), Culture=neutral, PublicKeyToken=null' or one of its dependencies. The system cannot find the file specified.`，可能意味着您需要解锁FFXIV插件。  详见上方的DLL解锁步骤。

如果您见到错误窗口提示 `Plugin Load Failure` 以及 `The downloaded file did not contain a plugin that could be loaded`， 则可能有多个潜在问题。

- 请确认您是否正确 [安装 OverlayPlugin](https://github.com/quisquous/cactbot#install-ngld-overlayplugin)。
- 从 **Plugins** -> **Plugin Listing** -> **OverlayPlugin.dll** 检查 OverlayPlugin 版本。 若与 [该版本](https://github.com/ngld/OverlayPlugin/releases/latest)不匹配， 则将其移除并重新 [安装ngld版本的OverlayPlugin](https://github.com/quisquous/cactbot#install-ngld-overlayplugin)。
- 请确认您正在运行的是x64版本的ACT (`Advanced Combat Tracker.exe`) 而非x86 (`ACTx86.exe`)。
- 最后，在成功安装OverlayPlugin之后必须重新启动ACT。

如果您见到类似于如下的错误：`Invalid Plugin: This assembly does not have a class that implements ACT's plugin interface, or scanning the assembly threw an error.` 或者是 `Load Error: Method 'LoadConfig' in type 'CactbotEventSource' etc etc does not have an implementation`， 则您应当确保在 **Plugins**标签页的**Plugins Listing**标签页中`CactbotOverlay.dll`在`OverlayPlugin.dll`之后载入

## Cactbot相关问题

若触发器或某些UI组件不工作,，请确保FFXIV解析插件设置中的“禁止解析网络数据”选项**没有**被勾选。 网络数据是触发器准确触发的前提条件。

若您使用cactbot进行DPS统计，但您的DPS统计悬浮窗中没有任何数据，请首先确保您将`OverlayPlugin.dll`插件中的`基本设置`选项卡内的`DPS更新间隔`设为了一个0以上的数字。  将其设置为3是一个很好的默认设置。

## 捕鱼人模块

### 我看不到悬浮窗

此悬浮窗在一般情况下是隐藏的，直到您在钓场抛竿时自动显示。

### 在钓鱼时不显示

如果在一杆中悬浮窗未记录抛竿/咬钩/捕获，则需要检查以下几点：

- **游戏中的消息过滤设置**

![image](images/troubleshooting_chatlogfilter.png)

您必须至少设置在一个聊天日志中显示`自己的采集信息`。您可以在`角色设置`->`消息窗口设置`->`消息过滤设置`->`通知`中找到这一选项。

- **ACT的FFXIV解析插件内选项**

![image](images/troubleshooting_hidechatlog.png)

您必须禁用 `隐藏聊天信息（保护隐私）` 选项。

在更改FFXIV解析插件的游戏语言后，您必须重新启动ACT。

## 获取帮助

- 在[FFXIV ACT Discord](https://discord.gg/ahFKcmx)的#troubleshooting频道中询问
- 发起[github issue](https://github.com/quisquous/cactbot/issues)进行询问

## 如何获取网络日志

如果您在触发器或时间轴方面遇到问题，ACT所生成的[网络日志](LogGuide.md#network-log-lines)十分有用，它们可以回放并从中检查错误。

如需获取您的网络日志，请转到ACT中的 **Plugins** 标签，打开**FFXIV 解析插件**标签页，然后单击**打开 FFXIV 日志文件夹**。

![image](images/troubleshooting_openlogfolder.png)

此行为将打开一个包含文件的文件夹窗口。 您将可以看到名称类似于**Network_XXX_XXX.log**的文件。 这些文件是以您的FFXIV解析插件的版本以及日志生成的日期命名的。

![image](images/troubleshooting_networklog.png)

这些文件通常都很大，因此请先将它们打包为压缩文件。

您可以将它们直接附加到github issue中， 或者上传到网盘中（推荐使用服务器位于国外的网盘，如Google云盘，Dropbox，MEGA网盘等）并在github issue中附加网盘链接。
