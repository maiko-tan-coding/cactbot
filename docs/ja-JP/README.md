# cactbot (ffxivレイドオーバーレイ)

<img align="right" src="https://raw.githubusercontent.com/quisquous/cactbot/main/screenshots/cactbot-logo-320x320.png" />

[![GitHubワークフローステータス（ブランチ）](https://img.shields.io/github/workflow/status/quisquous/cactbot/Test/main)](https://github.com/quisquous/cactbot/actions?query=workflow%3ATest+branch%3Amain) [![GitHubリリース（最新のSemVer）](https://img.shields.io/github/v/release/quisquous/cactbot?color=brightgreen&sort=semver)](https://github.com/quisquous/cactbot/releases/latest)

🌎 [**English**] [[한국어](docs/ko-KR/README.md)]

1. [Cactbotについて](#about)
1. [インストール](#installing)
1. [ソースコードからのビルド](#building-from-source)
1. [UIモジュールの概要](#ui-module-overview)
1. [トラブルシューティング](#troubleshooting)
1. [Cactbotカスタム化](#cactbot-customization)
1. [サポートされている言語](#supported-languages)

## Cactbotについて

cactbotは[ファイナルファンタジーXIV](http://www.finalfantasyxiv.com/)のために提供するACTオーバーレイプラグインです。 このプロジェクトは、[Advanced Combat Tracker](http://advancedcombattracker.com/) のプラグインである[ngld様が作ったOverlayPlugin](https://github.com/ngld/OverlayPlugin) のオーバーレイプラグインです。

cactbotは、次のモジュールを提供します。

* raidboss：タイムラインとトリガー

![タイムラインのスクリーンショット](screenshots/promo_raidboss_timeline.png) ![スクリーンショットをトリガーします](screenshots/promo_raidboss_triggers.png)

* oopsyraidsy：ミスと死の報告

![おっと、スクリーンショット](screenshots/promo_oopsy.png)

* ジョブ：バフとprocトラッキングを備えた凝縮ゲージ

![rdmジョブのスクリーンショット](screenshots/promo_jobs.png)

* eureka：EurekaNMトラッキングマップ

![eurekaスクリーンショット](screenshots/promo_eureka.png)

* フィッシャー：釣りキャストタイムトラッキング

![フィッシャーのスクリーンショット](screenshots/promo_fishing.png)

* レーダー：暴徒の方向を追跡し、引き手に通知

![レーダーのスクリーンショット](screenshots/promo_radar.png)

* dps：dpsメーターの追加機能

![xepheroスクリーンショット](screenshots/xephero.png)

### ビデオの例

* [O4Sレイドボス+僧侶の仕事](https://www.twitch.tv/videos/209562337)
* [O3Sスペルブレードコールアウト](https://clips.twitch.tv/StrangeHungryGarageShadyLulu)

## インストール

### 依存関係

インストール [.NET Frameworkの](https://www.microsoft.com/net/download/framework) バージョン4.6.1以上が。

あなたは持っている必要があります [のDirectX 11](http://imgur.com/TjcnjmG) ファイナルファンタジーXIVのために有効。

64ビット版のインストール [高度な戦闘トラッカー](http://advancedcombattracker.com/)お持ちでない場合は、。

### FFXIVACTプラグインをインストールする

ACT、 インストールしたばかりの場合は、スタートアップウィザードが表示されます。 、そうでない場合は、スタートアップウィザードに取得するには にクリック `オプション` 、次にをクリックしてください `表示スタートアップウィザード`。

![スタートアップウィザードのスクリーンショット](screenshots/ffxiv_plugin_show_startup_wizard.png)

スタートアップウィザードでは、 選択 `FFXIV解析プラグイン` [OK]をクリックします `ダウンロード/プラグインを有効に` ボタンを。 これにより、 `%APPDATA%Advanced Combat Tracker \ Plugins \ FFXIV_ACT_Plugin.dll` がダウンロードされ、プラグインのリストで有効になります。

![スタートアップウィザードのダウンロードスクリーンショット](screenshots/ffxiv_plugin_parsing_plugin.png)

さらに、ネットワークからの解析を有効にし、ACTがファイアウォールで保護されていないことを確認する必要があります。 FFXIVプラグインの設定で、[トリガーにHPを含める]ボタンがオンになっていることを確認してください。 これは、下にある `プラグイン` ->`FFXIV設定` -> `オプション`。

代替FFXIVプラグインガイド：

* [fflogsビデオガイド](https://www.fflogs.com/help/start/)
* [TomRichterガイド](https://gist.github.com/TomRichter/e044a3dff5c50024cf514ffb20a201a9#installing-act--ffxiv-plugin)

### ngldOverlayPluginをインストールします

あなたが選択した場合、この時点では、 `プラグイン` ]タブをしてまで行く `プラグインのリスト`、 プラグインのリストは次のようになります。

![空白のプラグインリストのスクリーンショット](screenshots/get_plugins_blank.png)

`Get Plugins` をクリックして、ACTプラグインインストーラーを開きます。

`オーバーレイプラグイン` を選択し、 `をクリックしてダウンロードして有効にします`。

![オーバーレイプラグイン選択のスクリーンショット](screenshots/get_plugins_overlayplugin.png)

これは、にngld OverlayPluginをダウンロードする `%APPDATA%Advanced戦闘トラッカー\プラグイン\ OverlayPlugin` 及びイネーブル `OverlayPlugin.dll` プラグインのリストです。

注意点として、あなたが使用する必要があります [ngld](https://github.com/ngld) のバージョン OverlayPluginとないオリジナルRainbowMageバージョンまたはhibiyasleepフォークを。

### cactbotのインストール

ここでも、に進みます `プラグイン` タブおよびに行く `プラグインのリスト`、 、次に選択 `取得プラグイン`。

`Cactbot` を選択し、[ `ダウンロードして有効にする`]をクリックします。

![cactbot選択のスクリーンショット](screenshots/get_plugins_cactbot.png)

これは、にcactbotをダウンロードします `%APPDATA%Advanced戦闘トラッカー\プラグイン\ cactbotバージョン\ cactbot` 及びイネーブル `CactbotOverlay.dll` プラグインのリストに。

**注**：ACTは、アーカイブがあることを期待する方法の違いによる 及びcactbotは、そのzipファイルを生成する方法、 のようなものがあるでしょう `cactbot-0.15.2` フォルダ あなたはcactbotをダウンロードしたことを最初のバージョンへの対応。 このフォルダ名は重要ではなく、見栄えがします。

プラグインが正しい順序になっていることを確認します。 順序は、最初にFFXIVプラグイン、次にOverlayPlugin、次にcactbotの順になります。 上記の手順に従っている場合は、次のようになります。

![プラグインの注文](screenshots/get_plugins_complete.png)

最後に、ACTを再起動します。

## オーバーレイモジュールの追加

これは、レイドボスオーバーレイモジュールを設定する方法の例です。 他のcactbotオーバーレイの設定も同じように機能します。

1. ACTを開きます。
1. cactbotプラグインを追加した後、ACTを再起動したことを確認してください。
1. ナビゲートに `プラグイン` ACTのタブし、次いで `OverlayPlugin.dll` その内部タブ。
1. 「新規」ボタンをクリックして選択 `Cactbot Raidboss` プリセットリストに。

    ![新しいオーバーレイプラグインのスクリーンショット](screenshots/overlay_plugin_new.png)

1. この時点で、いくつかのテストUIが画面に表示されるはずです。 cactbotは、デフォルトのテストUI、 の大きな赤い破線の境界線、 、および画面上のオーバーレイのサイズ変更と配置に役立つ青い背景を提供します。 これらはすべて、オーバーレイの構成パネルでオーバーレイがロックされると消えます。 サイズ変更と配置が完了したら、常にオーバーレイをロックする必要があります。

    ![raidbossプラグインのロックが解除されました](screenshots/overlay_plugin_new_raidboss_unlocked.png)

1. このオーバーレイの名前として任意の名前を入力します（例： `raidbossy`。
1. `OK` ボタンをクリックして、これをオーバーレイとして追加します。 それは今ではオーバーレイのリストに表示されます `プラグイン` -> `OverlayPlugin.dll` タブ。

1. オーバーレイをドラッグして、目的の場所にサイズ変更します。

1. で `一般` のタブ `Raidboss` オーバーレイ、クリック `ロックオーバーレイ` および `クリックスルーの有効化` チェックボックスを。 オーバーレイがロックされると、テストバー、デバッグテキスト、赤い破線の境界線、および青い影付きの背景が消えます。

    ![raidbossプラグイン構成](screenshots/overlay_plugin_new_raidboss_locked.png)

1. Summerford農場にあなたがraidbossプラグインをテストしたい場合は、テレポート、および行う `/カウントダウン5`。

1. 他のcactbotオーバーレイの追加も同様のプロセスです。 同じプロセスに従いますが、別のcactbotプリセットを選択します。

## ソースからの構築

最初にcactbotをインストールするには、上記のすべての手順に従ってください。 依存関係をインストールするには2つの方法があります： **スクリプトごとに** と **を手動で**

### 依存関係：スクリプトメソッド

1. `curl` インストールする必要があります（これは依存関係をダウンロードするために使用されます）
1. 実行 `./utils/fetch_deps.py` スクリプトを
1. </strong>を構築するための **ステップに進みます</li> </ol>

### 依存関係：手動による方法

1. 最新のZipファイルをダウンロードしてください <https://github.com/EQAditu/AdvancedCombatTracker/releases/>
1. 抽出 `高度戦闘Tracker.exe` に `cactbot /プラグイン/サードパーティー/ ACT /`
1. [https://github.com/ravahn/FFXIV_ACT_Plugin/](https://github.com/ravahn/FFXIV_ACT_Plugin/) から最新のSDKZipファイルをダウンロードしてください（ファイルの名前にSDKが含まれていることを確認してください）
1. 抽出 `フォルダSDK` 並びに `FFXIV_ACT_Plugin.dll` に `cactbot /プラグイン/サードパーティー/ FFXIV_ACT /`
1. 最新のZipファイルをダウンロードしてください <https://github.com/ngld/OverlayPlugin/releases/>
1. 抽出 `フォルダLIBS` 並びに `OverlayPlugin.dll` へ `cactbot /プラグイン/サードパーティー/ OverlayPlugin /`
1. </strong>を構築するための **ステップに進みます</li> </ol>

フォルダは次のようになります（ファイルは将来の更新で変更される可能性があることに注意してください）。

```plaintext
サードパーティ
| -ACT
| | -Advanced Combat Tracker.exe
| -FFXIV_ACT
| | -SDK
| | | -FFXIV_ACT_Plugin.Common.dll
| | | -FFXIV_ACT_Plugin.Config.dll
| | | -FFXIV_ACT_Plugin.LogFile.dll
| | | -FFXIV_ACT_Plugin.Memory.dll
| | | -FFXIV_ACT_Plugin.Network.dll
| | | -FFXIV_ACT_Plugin.Overlay.dll
| | | -FFXIV_ACT_Plugin.Parse.dll
| | | -FFXIV_ACT_Plugin.Resource.dll
| | -FFXIV_ACT_Plugin.dll
| -OverlayPlugin
   | -libs
   | | -HtmlRenderer.dll
   | | -Markdig.Signed.dll
   | | -Newtonsoft.Json.dll
   | | -OverlayPlugin.Common.dll
   | | -OverlayPlugin.Core.dll
   | | -OverlayPlugin.Updater.dll
   | | -SharpCompress.dll
   | | -System.ValueTuple.dll
   | | -websocket-sharp.dll
   | -OverlayPlugin.dll
```

### 構築する手順

1. Visual Studioでソリューションを開きます（Visual Studio 2017でテスト済み）。
1. 「リリース」および「x64」用にビルドします。
1. プラグインは、として構築されます **ビン/ x64の/リリース/ CactbotOverlay.dll**。
1. ビルドされたプラグインをACTプラグインとして直接追加します。  - ACTで> プラグイン-> プラグインのリスト]タブをクリックします `[参照` ]ボタンをして見つける **ビン/ x64の/リリース/ CactbotOverlay.dll** このファイルが建設されました。  次に、[ `プラグインの追加/有効化`]をクリックします。

## UIモジュールの概要

[ui /](ui/) ディレクトリには、cactbotのuiモジュールが含まれています。 上記の手順に従ってcactbotをインストールした場合、 これはおそらく `%APPDATA%Advanced Combat Tracker \ Plugins \ cactbot-version \ cactbot \ ui \`になります。

各cactbotuiモジュールは、個別のオーバーレイとして追加する必要があります。 セットアップの詳細については、 [オーバーレイモジュールの追加](#adding-overlay-modules) セクションを参照してください。

### [レイドボス](ui/raidboss) モジュール

このモジュールは、使用するには 点のcactbotを **UI / raidboss / raidboss.html** 又は使用 `Cactbot Raidboss` プリセット。

このモジュールは、戦闘での今後のイベントの視覚的なタイムラインと、レイドの認識を高めるのに役立つテキストと音声の 通知を提供します。 テキストと音声によるアラートは、ファイト タイムラインに基づくことも、ACTの「カスタムトリガー」と同様にゲーム内で発生するログメッセージから取得することもできます。 モジュールを見て、に似て感じるように設計されて [大物Bossmods](https://mods.curse.com/addons/wow/big-wigs) World of Warcraftのためのアドオン。

[This page](https://quisquous.github.io/cactbot/util/coverage/coverage.html) lists the currently supported set of content in cactbot. Support is continually added over time (patches welcome!) but a lot of old content may not be supported yet.

Fight timelines are provided in files designed for the [ACT Timeline](https://github.com/grindingcoil/act_timeline) plugin, [documented here](http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin) with [some extensions](docs/TimelineGuide.md).

There are three levels of text alerts, in order of escalating importance: `info`, `alert`, and `alarm`. Text messages will be in one of these, and more important levels are larger and more eye grabbing colors.  Text-to-speech can be configured if you prefer that over on screen text.

Timeline files are found in [ui/raidboss/data/timelines](ui/raidboss/data/timelines). Triggers for text and sound alerts are found in [ui/raidboss/data/triggers](ui/raidboss/data/triggers).

In this screenshot, the raidboss module is highlighted, with the timeline circled in red, and the text alerts circled in yellow, with an `alert`-level text message visible.

![raidboss screenshot](screenshots/Raidboss.png)

### raidbossエミュレーター

If you are writing triggers or timelines and want to test them, you can use the raidboss emulator: **ui/raidboss/raidemulator.html**.

This currently can only be loaded in a browser and not as an overlay. This will work in current version of Chrome, and should work in other browsers as well but this is less tested.

Instructions:

1. ACTを開始します。
1. -確かWS Serverは、プラグイン経由で開始されていることを確認> OverlayPlugin WSServer -> ストリーム/ローカルオーバーレイ。
1. 選択 `Cactbot Raidboss（複合アラートおよびタイムライン）` URLジェネレータリストから。
1. 編集言うのURL `raidemulator.html` の代わりに、 `raidboss.html`。
1. この編集したURLをコピーしてChromeに貼り付けます。
1. [ネットワークログ](/docs/FAQ-Troubleshooting.md#how-to-find-a-network-log) をページにドラッグアンドドロップします。
1. ゾーンとの出会いを選択し、[OK]をクリックします `ロード出会い`。

If the emulator is not working, check the console log in the inspector for errors. No buttons will work until it is connected to ACT via websocket.

![raidboss emulator screenshot](screenshots/raidboss_emulator.png)

### [oopsyraidsy](ui/oopsyraidsy) モジュール

To use this module, point cactbot at **ui/oopsyraidsy/oopsyraidsy.html** or use the `Cactbot OopsyRaidsy` preset.

This module provides mistake tracking and death reporting.  Oopsy raidsy is meant to reduce the time wasted understanding what went wrong on fights and how people died.  During the fight, only a limited number of mistakes are shown (to avoid clutter), but afterwards a full scrollable list is displayed.

When somebody dies, the last thing they took damage from is listed in the log.  For example, if the log specifies: ":skull: Poutine: Iron Chariot (82173/23703)" this means that Poutine most likely died to Iron Chariot, taking 82173 damage and having 23703 health at the time.  The health value itself is not perfect and may be slightly out of date by a ~second due to a hot tick or multiple simultaneous damage sources.

When mistakes are made that are avoidable, oopsy logs warning (:warning:) and failure (:no_entry_sign:) messages, explaining what went wrong.

Mistake triggers are specified for individual fights in the [ui/oopsyraidsy/data](ui/oopsyraidsy/data) folder.

![oopsy screenshot](screenshots/promo_oopsy.png)

### [ジョブ](ui/jobs) モジュール

To use this module, point cactbot at **ui/jobs/jobs.html** or use the `Cactbot Jobs` preset.

This module provides health and mana bars, as well as icons and timer bars for big raid buffs such as The Balance and Trick Attack. It also features a food buff warning to keep up your food buff when leveling or raiding, and a visual pull countdown.

It has more fleshed out support for some jobs but is *strongly* a Work In Progress for others.

* 赤魔道士：白/黒のマナを表示し、Verstone、Verfire、Impactのprocを追跡し、進行中の近接コンボの状態を表示します。
* ウォリアー：獣の量を表示し、残りのストームズアイバフ時間をgcdで追跡します。
* モンク：チャクラの数、残りのグリースを塗った稲妻の時間を表示し、モンクのバフとデバフを追跡します。

In this screenshot, the jobs module is highlighted for the Red Mage job. The health and mana bars, as well as Red Mage white/black mana tracking is circled in purple, with the large raid buff tracking pointed to beside it in orange. The first step of the melee combo has been executed, which is displayed as the yellow box above the health bar. The proc tracking is circled below in green.

![jobs screenshot](screenshots/Jobs.png)

### [ユーレカ](ui/eureka) モジュール

To use this module, point cactbot at **ui/eureka/eureka.html** or use the `Cactbot Eureka` preset.

This module provides automatic tracking of NMs that are popped or have been killed.  It shows gales/night timers and any local tracker link that has been pasted in chat.  Any flags in chat are also temporarily included on the map.

It currently does not read the tracker information directly.  However, if you click on the left/red "Copy killed NMs" button in the tracker to copy the list of currently dead NMs, you can paste it in game, e.g. `/echo ? NMs on cooldown: Serket (7m) > Julika (24m) > Poly (54m)`

If you do not see the emoji, make sure you have installed [this Windows update](https://support.microsoft.com/en-us/help/2729094/an-update-for-the-segoe-ui-symbol-font-in-windows-7-and-in-windows-ser).

![eureka screenshot](screenshots/promo_eureka.png)

### [レーダー](ui/radar) モジュール

To use this module, point cactbot at **ui/radar/radar.html** or use the `Cactbot Radar` preset.

This module lets you know about nearby hunt mobs (S-rank, A-rank, etc). When one pops, it gives you an arrow (based on your character's heading) and a distance to the mob.

There are options to show who pulled the mob, as well as to configure the display of the radar. You can also set up custom options for different ranks (e.g. make noises for S rank, but be silent for B ranks), or set up custom triggers for any mob name you would like.

See the `cactbot/user/radar-example.js` for more options.

![radar screenshot](screenshots/promo_radar.png)

### [フィッシャー](ui/fisher) モジュール

To use this module, point cactbot at **ui/fisher/fisher.html** or use the `Cactbot Fisher` preset.

When you cast your line at a fishing hole, this module keeps track of when you reel in particular fish so that you know what you might be getting when you hook it.

![fishing screenshot](screenshots/promo_fishing.png)

Cast times are currently only logged as you fish, so there won't be any data until you've caught each fish. Green bars represent light tugs, yellow is a medium tug and red bars are legendary/heavy tugs.

[See here](https://www.youtube.com/watch?v=GHgWIA-Zhug) for examples of the different tug types.

Check [here](docs/FAQ-Troubleshooting.md#fisher-module) for common troubleshooting tips.

### [DPS](ui/dps) メートル

cactbot can be used with any dps meter overlay designed for OverlayPlugin's miniparse addon, with the option to build out more features through cactbot's additional Javascript APIs.  cactbot also auto-stops fights on wipes, so you can configure ACT's fight time to infinity.

The [xephero](ui/dps/xephero) dps meter is based on the same dps meter built for miniparse, with the additional ability to do per-phase dps tracking, displayed in additional columns. In the screenshot below the phases are named B1, B2, B3.  These autogenerate from dungeon bosses, but could be used to differentiate raid fight phases.

![xephero screenshot](screenshots/xephero.png)

The [rdmty](ui/dps/rdmty) dps meter is based on the same dps meter for miniparse, and updated for Stormblood jobs and recolored to match [fflogs](http://fflogs.com).

![rdmty screenshot](screenshots/rdmty.png)

### [プルカウンター](ui/pullcounter) モジュール

This small module sticks the current pull count for raiding bosses on screen. This is primarily for folks who stream a lot and want to review video footage. Having a number on screen makes it easy to scrub through video and find particular pulls to review.

In most cases, you can reset the count for the current boss/zone by typing `/echo pullcounter reset`. You can also edit the counts directly in your `%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json` file.

![pull counter screenshot](screenshots/pullcounter.png)

### [テスト](ui/test) モジュール

To use this module, point cactbot at **ui/test/test.html** or use the `Cactbot Test` preset.

This module is just an onscreen test of cactbot variables and is not meant to be used while playing. It can be useful to try out to make sure everything is working as expected or to use to help debug overlay issues.

![test screenshot](screenshots/test.png)

## トラブルシューティング

A general FAQ can be found [here](docs/FAQ-Troubleshooting.md) containing solutions to common Cactbot issues.

## Cactbotのカスタマイズ

Most common cactbot configuration can be done via the control panel, inside of ACT.

![config panel](screenshots/config_panel.png)

This can be found by going to Plugins -> OverlayPlugin.dll -> Cactbot Event Source, and then clicking on options there.

In particular, if you want to use text to speech for raidboss alerts, you can change the "Default alert output" to be "TTS Only" or "Text and TTS". You can also change this on a per trigger basis.

Or, if for some reason (???) you don't want the ready check sound alert, you can disable this via the same options panel. Go to Raidboss -> General Triggers -> General -> General Ready Check, and set it to `Disabled` instead of `Defaults`.

These options are stored in your `%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json` file. It is not recommended to edit this file directly, as it must be [strict json](https://jsonlint.com/) and ACT might fail to load if the file is written incorrectly.

It is recommended that you do most of your configuration via this control panel rather than with user files. Files in `cactbot/user/` are more powerful and can override anything from the control panel. However, this can also be confusing when the control panel doesn't adjust something properly that a `cactbot/user/` file is overriding silently.

See [this documentation](docs/CactbotCustomization.md#user-folder-config-overrides) for more details about user javascript and css files.

## サポートされている言語

cactbot is tested and works with the current international (English, German, French, Japanese) version, the current Chinese version, and the current Korean version. Some translations are still a work in progress.
