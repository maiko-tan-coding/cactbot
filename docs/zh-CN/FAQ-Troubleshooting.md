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
- 从 **Plugins** -> **Plugin Listing** -> **OverlayPlugin.dll** 检查 OverlayPlugin 版本。 若与 [该版本](https://github.com/ngld/OverlayPlugin/releases/latest)不匹配， 则将其移除并重新 [安装ngld版本地OverlayPlugin](https://github.com/quisquous/cactbot#install-ngld-overlayplugin)。
- 请确认您正在运行的是x64版本的ACT (`Advanced Combat Tracker.exe`) 而非x86 (`ACTx86.exe`)。
- 最后，在成功安装OverlayPlugin之后必须重新启动ACT。

如果您见到类似于如下的错误：`Invalid Plugin: This assembly does not have a class that implements ACT's plugin interface, or scanning the assembly threw an error.` 或者是 `Load Error: Method 'LoadConfig' in type 'CactbotEventSource' etc etc does not have an implementation`， 则您应当确保在 **Plugins**标签页的**Plugins Listing**标签页中`CactbotOverlay.dll`在`OverlayPlugin.dll`之后载入

## Cactbot相关问题

If triggers or pieces of the UI do not work, ensure that "Disable Parsing from Network Data" is **not** checked in the FFXIV plugin settings. Network data is required for accurate trigger timing.

If you are using cactbot for dps parsing and you don't get any data, make sure that the `DPS update interval seconds` is set to a number higher than zero in your `OverlayPlugin.dll` -> `MiniParse Event Source` config.  Setting it to 3 is a good default.

## 捕鱼人模块

### I can't see the overlay

The overlay is hidden by default until you cast your line at a fishing hole.

### It doesn't show up when fishing

If the overlay doesn't register your casting/catches/reeling in your rod there are a few options you need to check:

- **Ingame chat log filter**

![image](images/troubleshooting_chatlogfilter.png)

You need to have at least one chat log set to show `Own Gathering Messages` You can find this option in `Character Configuration` -> `Log Window Settings` -> `Log Filters 1/2/3/4` -> `Announcements`

- **ACT FFXIV Plugin options**

![image](images/troubleshooting_hidechatlog.png)

You must have the `Hide Chat Log (for privacy)` option disabled.

- Supported language Korean is not supported at this time. You will need to restart ACT after you change parser language.

## Places To Get Help

- ask in the [FFXIV ACT discord](https://discord.gg/ahFKcmx) #troubleshooting channel
- open a [github issue](https://github.com/quisquous/cactbot/issues)

## How To Find A Network Log

If you are having issues with triggers or timelines, it can be useful to attach a network log from ACT so that the [network logs](LogGuide.md#network-log-lines) can be replayed and investigated for errors.

To find your network logs, go to the **Plugins** tab in ACT, click the **FFXIV Settings** button, and then click **Open FFXIV Log Folder**.

![image](images/troubleshooting_openlogfolder.png)

This will open up a folder window with files in it. Select a file named something like **Network_etc.log**. The files are named with your FFXIV ACT Plugin version and the date.

![image](images/troubleshooting_networklog.png)

These files are often large, so zip them up first.

You can attach these to github issues directly. Alternatively, find some file hosting site, upload the files there, and then attach the link.
