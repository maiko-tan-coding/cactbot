# リモートCactbot

これは、他の人がACTを実行せずに独自のcactbotコールアウトとDPS番号を取得できるようにするためのガイドです。 これは、DX9ユーザーだけでなくACTも使用できないPS4ユーザーにとって理想的です。

推奨される方法は、OverlayPluginに組み込まれているポート転送を使用することです。 ポートフォワーディングは、接続されている各人にパーソナライズされたトリガーを与えることができます。 この方法では、他の人がdpsメーター または他の種類のオーバーレイを表示することもできます。

## Alternatives

もう1つの方法は、 [不和ボットプラグイン](https://github.com/Makar8000/ACT-Discord-Triggers/wiki/First-Time-Setup-Guide)を使用することです。 不和ボットは、 が聞こえるcactbotからのすべてのttを再生し、パーティーの残りの部分で再生します。

For cactbot, this is less great because many cactbot triggers are personalized and it is not meant to be a generalized "raid caller" even if it sort of works that way. Currently, cactbot sounds do not play through the plugin.

If a single discord tts raidcaller is what you are really looking for, [Triggernometry](https://github.com/Aho-Senpai/Aho-Triggers/blob/main/Triggernometry/Docs/FAQ.md#discord-callouts-ready) will be a better fit than cactbot for what you are trying to do.

## Port Forwarding Overview

Here are the steps you need to follow as the person running ACT:

- [OverlayPluginWSServerのセットアップ](#setup-overlayplugin-wsserver)
- [接続をテストする](#test-your-connection)
- [リモートACTに接続します](#connect-to-remote-act)
- [Raidbossを構成する](#configure-raidboss)

If you get lost, see the [HALP](#halp) section.

## OverlayPluginWSServerのセットアップ

OverlayPlugin runs a server which accepts [WebSocket](https://en.wikipedia.org/wiki/WebSocket) connections that allows other applications to use ACT's data. (This is different from ACTWebSocket which is no longer maintained and cactbot does not support.) It also has built in support for ngrok to enable port forwarding so that others outside your local network can connect to that WebSocket server.

To enable this in ACT, go to **Plugins** -> **OverlayPlugin WSServer** -> **Shared Overlay**

![画像](images/remote_wsserver.png)

On this page, select your region. Click `Start`. Your screen should look like the above image with `Launching ngrok...Done!` and it should say `Status: Active` at the top of the screen.

### 接続をテストする

Now that you've established port forwarding, test your connection. In all of these examples in the rest of the documentation, replace the `a31a5403.ngrok.io` with the url shown in the log window. Going to <https://a31a5403.ngrok.io/> (substituting your server url) should give you the following "It Works" page.

![画像](images/remote_itworks.png)

If this is set up properly, you can select an overlay preset like `Cactbot Test` and it will give you a url to open in a browser, e.g. <https://quisquous.github.io/cactbot/ui/test/test.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>

That file is a web page being served by github, but the query string tells the overlay web page to connect to your ACT instance. With ACT and FFXIV open, you should see the test data update based on your actions in game.

![画像](images/remote_testui.png)

If this is not working or you are not seeing any information, see the [HALP](#halp) section.

## リモートACTに接続します

Now, friends can connect to your ACT remotely. Unfortunately, all of the overlay html pages needs to be hosted remotely. Rather than loading local urls from your filesystem like `C:\Users\tinipoutini\cactbot\ui\raidboss\raidboss.html` you need to use github urls like `https://quisquous.github.io/cactbot/ui/raidboss/raidboss.html`.

In general, you can use the URL Generator at the bottom of the OverlayPlugin tab to generate urls for any presets.

例えば：

- cactbot raidbossオーバーレイ： <https://quisquous.github.io/cactbot/ui/raidboss/raidboss.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>
- rdmty DPSオーバーレイ： <https://quisquous.github.io/cactbot/ui/dps/rdmty/dps.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>
- cactbot oopsy： <https://quisquous.github.io/cactbot/ui/oopsyraidsy/oopsyraidsy.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>

### Raidbossを構成する

If you load raidboss remotely, you will see a player selection dialog.

![画像](images/remote_playerselect.png)

The list of players will populate once you are in an instance. Choose yourself in this list, and click `Start Overlay` to begin raidboss.

If you want TTS and the person hosting does not have TTS turned on, you can enable this with the `Force Enable Text To Speech` checkbox.

Unfortunately at the moment, all of the cactbot customization is local and any remote player will inherit the customization of the host. The only option you can override right now is to enable TTS.

In the future, it may be possible to append some additional parameters to load your own user directory, but not currently.

### その他のオーバーレイ

Not all overlays are able to be run remotely. cactbot, oopsy, pullcounter, and dps overlays are supported.

radar, jobs, and fisher will not work as they require more information about your player.

## HALP

If you get stuck or confused on any of these steps, the best place to get help is the [FFXIV ACT discord](https://discord.gg/ahFKcmx) #troubleshooting channel. There is no cactbot discord; you should go here.

Port forwarding is not really part of cactbot, so please only file a cactbot github issue if your raidboss party override doesn't work.

### トラブルシューティングのヒント

If you are looking at url in the browser like <https://quisquous.github.io/cactbot/ui/test/test.html?OVERLAY_WS=wss://127.0.0.1:10501/ws> and you don't see any data, even though you are in game, ACT is running, and the ACT WSServer is running, then you should look at devtools.

In Chrome, right click on the page and go to `Inspect` (or hit Ctrl+Shift+I). Then click on `Console` to show the console output:

![画像](images/remote_devtools.png)

This will give you more information to help diagnose your problem.
