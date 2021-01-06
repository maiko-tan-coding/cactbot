# cactbot (ffxivレイドオーバーレイ)

<img align="right" src="https://raw.githubusercontent.com/quisquous/cactbot/main/screenshots/cactbot-logo-320x320.png" />

[![GitHubワークフローステータス（ブランチ）](https://img.shields.io/github/workflow/status/quisquous/cactbot/Test/main)](https://github.com/quisquous/cactbot/actions?query=workflow%3ATest+branch%3Amain) [![GitHubリリース（最新のSemVer）](https://img.shields.io/github/v/release/quisquous/cactbot?color=brightgreen&sort=semver)](https://github.com/quisquous/cactbot/releases/latest)

🌎 [**English**] [[简体中文](docs/zh-CN/README.md)] [[한국어](docs/ko-KR/README.md)]

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
1. Execute the `./util/fetch_deps.py` script
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

### Steps to build plugin

1. Visual Studioでソリューションを開きます（Visual Studio 2017でテスト済み）。
1. 「リリース」および「x64」用にビルドします。
1. プラグインは、として構築されます **ビン/ x64の/リリース/ CactbotOverlay.dll**。
1. ビルドされたプラグインをACTプラグインとして直接追加します。  - ACTで> プラグイン-> プラグインのリスト]タブをクリックします `[参照` ]ボタンをして見つける **ビン/ x64の/リリース/ CactbotOverlay.dll** このファイルが建設されました。  次に、[ `プラグインの追加/有効化`]をクリックします。

### npm and webpack

If you are not a cactbot developer and are trying to modify cactbot for your own personal triggers, you should instead refer to the [customization documentation](docs/CactbotCustomization.md) instead of changing your local cactbot files.

To install npm and start Webpack, follow these steps:

1. Install [nodejs and npm](https://nodejs.org/en/download/)
1. Run `npm install` in the root of the cactbot directory.
1. Run `npm run build` or `npm start`.

See the [contributing](CONTRIBUTING.md#validating-changes-via-webpack) documentation for more details about using Webpack.

## UIモジュールの概要

The [ui/](ui/) directory contains cactbot's ui modules. If you installed cactbot following the instructions above, this will most likely be `%APPDATA%Advanced Combat Tracker\Plugins\cactbot-version\cactbot\ui\`.

Each cactbot ui module should be added as a separate overlay. See the [Adding Overlay Modules](#adding-overlay-modules) section for more details about setup.

### [raidboss](ui/raidboss) module

To use this module, point cactbot at **ui/raidboss/raidboss.html** or use the `Cactbot Raidboss` preset.

This module provides a visual timeline of upcoming events in a fight, as well as text and audio notifications to help increase raid awareness. Text and sound alerts can be based on the fight timeline, or come from log messages that occur in the game, similar to ACT's "Custom Triggers". The module is designed to look and feel similar to the [BigWigs Bossmods](https://www.curseforge.com/wow/addons/big-wigs) addon for World of Warcraft.

[This page](https://quisquous.github.io/cactbot/util/coverage/coverage.html) lists the currently supported set of content in cactbot. Support is continually added over time (patches welcome!) but a lot of old content may not be supported yet.

Fight timelines are provided in files designed for the [ACT Timeline](https://github.com/grindingcoil/act_timeline) plugin, [documented here](http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin) with [some extensions](docs/TimelineGuide.md).

There are three levels of text alerts, in order of escalating importance: `info`, `alert`, and `alarm`. Text messages will be in one of these, and more important levels are larger and more eye grabbing colors.  Text-to-speech can be configured if you prefer that over on screen text.

Timeline files and triggers for text and sound alerts are found in [ui/raidboss/data](ui/raidboss/data), timeline files with `.txt` extension and trigger files with `.js` extension.

In this screenshot, the raidboss module is highlighted, with the timeline circled in red, and the text alerts circled in yellow, with an `alert`-level text message visible.

![raidboss screenshot](screenshots/Raidboss.png)

### raidboss emulator

If you are writing triggers or timelines and want to test them, you can use the raidboss emulator: **ui/raidboss/raidemulator.html**.

This currently can only be loaded in a browser and not as an overlay. This will work in current version of Chrome, and should work in other browsers as well but this is less tested.

Instructions:

1. Start ACT.
1. Make sure the WS Server is started via Plugins -> OverlayPlugin WSServer -> Stream/Local Overlay.
1. Select `Cactbot Raidboss (Combined Alerts and Timelines)` from the URL Generator list.
1. Edit the url to say `raidemulator.html` instead of `raidboss.html`.
1. Copy and paste this edited url into Chrome.
1. Drag and drop a [network log](/docs/FAQ-Troubleshooting.md#how-to-find-a-network-log) onto the page.
1. Select the zone and encounter, and then click `Load Encounter`.

If the emulator is not working, check the console log in the inspector for errors. No buttons will work until it is connected to ACT via websocket.

![raidboss emulator screenshot](screenshots/raidboss_emulator.png)

### [oopsyraidsy](ui/oopsyraidsy) module

To use this module, point cactbot at **ui/oopsyraidsy/oopsyraidsy.html** or use the `Cactbot OopsyRaidsy` preset.

This module provides mistake tracking and death reporting.  Oopsy raidsy is meant to reduce the time wasted understanding what went wrong on fights and how people died.  During the fight, only a limited number of mistakes are shown (to avoid clutter), but afterwards a full scrollable list is displayed.

When somebody dies, the last thing they took damage from is listed in the log.  For example, if the log specifies: ":skull: Poutine: Iron Chariot (82173/23703)" this means that Poutine most likely died to Iron Chariot, taking 82173 damage and having 23703 health at the time.  The health value itself is not perfect and may be slightly out of date by a ~second due to a hot tick or multiple simultaneous damage sources.

When mistakes are made that are avoidable, oopsy logs warning (:warning:) and failure (:no_entry_sign:) messages, explaining what went wrong.

Mistake triggers are specified for individual fights in the [ui/oopsyraidsy/data](ui/oopsyraidsy/data) folder.

![おっと、スクリーンショット](screenshots/promo_oopsy.png)

### [jobs](ui/jobs) module

To use this module, point cactbot at **ui/jobs/jobs.html** or use the `Cactbot Jobs` preset.

This module provides health and mana bars, as well as icons and timer bars for big raid buffs such as The Balance and Trick Attack. It also features a food buff warning to keep up your food buff when leveling or raiding, and a visual pull countdown.

It has more fleshed out support for some jobs but is *strongly* a Work In Progress for others.

<details>
<summary>Supported Jobs (Click to expand)</summary>

|                                                  Job                                                   |                                                                                                Feature                                                                                                 |
|:------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   <img src="./resources/ffxiv/jobs/pld-large.png" width="30px" /><br> Paladin   |                                                             Shows current Oath amount, and atonement stacks. Also tracks Goring Blade DoT.                                                             |
|   <img src="./resources/ffxiv/jobs/war-large.png" width="30px" /><br> Warrior   |                                            Shows the beast amount, and tracks the remaining Storm's Eye buff time in gcds, and shows combo time remaining.                                             |
| <img src="./resources/ffxiv/jobs/drk-large.png" width="30px" /><br> Dark Knight |                                                               Shows the blood amount and darkside time, and shows combo time remaining.                                                                |
| <img src="./resources/ffxiv/jobs/gnb-large.png" width="30px" /><br> Gunbreaker  |                                         Shows No Mercy duration&cooldown, Bloodfest&Gnashing Fang cooldown, Cartridge amount, and shows combo time remaining.                                          |
| <img src="./resources/ffxiv/jobs/whm-large.png" width="30px" /><br> White Mage  |                                            Shows Heal&Blood Lily amount, time to next Lily, DoTs remaining time, and shows Assize&Lucid Dreaming cooldown.                                             |
|   <img src="./resources/ffxiv/jobs/sch-large.png" width="30px" /><br> Scholar   |                                     Shows Aetherflow stacks, Fairy gauge amount/time remaining, DoTs remaining time, and shows Aetherflow&Lucid Dreaming cooldown.                                     |
| <img src="./resources/ffxiv/jobs/ast-large.png" width="30px" /><br> Astrologian |                                    Shows Seals amount, notify who or whether to play the current card, DoTs remaining time, and shows Draw&Lucid Dreaming cooldown.                                    |
|    <img src="./resources/ffxiv/jobs/mnk-large.png" width="30px" /><br> Monk     |                                           Shows chakra count, <del>remaining greased lightning time</del> and form time, and tracks monk buffs and debuffs.                                            |
|   <img src="./resources/ffxiv/jobs/drg-large.png" width="30px" /><br> Dragoon   |                                           Shows blood&eye amount, remaining Disembowel time, jump cooldown, and Lance Charge&Dragon Sight duration/cooldown.                                           |
|    <img src="./resources/ffxiv/jobs/nin-large.png" width="30px" /><br> Ninja    |                                   Shows Ninki amount, Huton remaining time, Trick Attack duration&cooldown, Bunshin&Mudras cooldown, and shows combo time remaining.                                   |
|   <img src="./resources/ffxiv/jobs/sam-large.png" width="30px" /><br> Samurai   |                                                                                       ⨉ Not supported currently.                                                                                       |
|    <img src="./resources/ffxiv/jobs/brd-large.png" width="30px" /><br> Bard     |                Shows songs playing and remaining time, Repertoire stack, Soul Voice amount, StraightShotReady track, DoT remaining time, and a bar that show when your DoTs will tick.                 |
|  <img src="./resources/ffxiv/jobs/mch-large.png" width="30px" /><br> Machinist  | Shows Heat gauge, Battery gauge, Combo Timer, Drill/Bioblaster&Air Anchor Cooldown, Wild Fire Cooldown&Duration. When Wild Fire is active, there will be a gauge to show how many GCD you have landed. |
|   <img src="./resources/ffxiv/jobs/dnc-large.png" width="30px" /><br> Dancer    |                                          Shows Combo Timer, Feather Guage, Esprit Guage, Standard Step Cooldown, Technical Step&Flourish Cooldown & Duration.                                          |
| <img src="./resources/ffxiv/jobs/blm-large.png" width="30px" /><br> Black Mage  |                                Shows DoTs remaining time, firestarter&thundercloud proc duration, time to next xeno, MP ticker, Fire/Ice stack and umbral heart stack.                                 |
|  <img src="./resources/ffxiv/jobs/smn-large.png" width="30px" /><br> Summoner   |                                 Shows DoTs remaining time, Energy Drain Cooldown, Trance Cooldown, Aetherflow stack, Demi-Summoning time and FurtherRuin Stack Guage.                                  |
|  <img src="./resources/ffxiv/jobs/rdm-large.png" width="30px" /><br> Red Mage   |                                                     Shows white/black mana, tracks procs for Verstone&Verfire and show cooldown of lucid dreaming.                                                     |
|  <img src="./resources/ffxiv/jobs/blu-large.png" width="30px" /><br> Blue Mage  |                                                           Shows cooldown of offguard&lucid dreaming, and Song Of Torment DoT remaining time.                                                           |

</details>

In this screenshot, the jobs module is highlighted for the Red Mage job. The health and mana bars, as well as Red Mage white/black mana tracking is circled in purple, with the large raid buff tracking pointed to beside it in orange. <del>The first step of the melee combo has been executed, which is displayed as the yellow box above the health bar.</del> The proc tracking is circled below in green.

![jobs screenshot](screenshots/Jobs.png)

### [eureka](ui/eureka) module

To use this module, point cactbot at **ui/eureka/eureka.html** or use the `Cactbot Eureka` preset.

This module provides automatic tracking of NMs that are popped or have been killed.  It shows gales/night timers and any local tracker link that has been pasted in chat.  Any flags in chat are also temporarily included on the map.

It currently does not read the tracker information directly.  However, if you click on the left/red "Copy killed NMs" button in the tracker to copy the list of currently dead NMs, you can paste it in game, e.g. `/echo ? NMs on cooldown: Serket (7m) > Julika (24m) > Poly (54m)`

If you do not see the emoji, make sure you have installed [this Windows update](https://support.microsoft.com/en-us/help/2729094/an-update-for-the-segoe-ui-symbol-font-in-windows-7-and-in-windows-ser).

![eurekaスクリーンショット](screenshots/promo_eureka.png)

### [radar](ui/radar) module

To use this module, point cactbot at **ui/radar/radar.html** or use the `Cactbot Radar` preset.

This module lets you know about nearby hunt mobs (S-rank, A-rank, etc). When one pops, it gives you an arrow (based on your character's heading) and a distance to the mob.

There are options to show who pulled the mob, as well as to configure the display of the radar. You can also set up custom options for different ranks (e.g. make noises for S rank, but be silent for B ranks), or set up custom triggers for any mob name you would like.

See the `cactbot/user/radar-example.js` for more options.

![レーダーのスクリーンショット](screenshots/promo_radar.png)

### [fisher](ui/fisher) module

To use this module, point cactbot at **ui/fisher/fisher.html** or use the `Cactbot Fisher` preset.

When you cast your line at a fishing hole, this module keeps track of when you reel in particular fish so that you know what you might be getting when you hook it.

![fishing screenshot](screenshots/promo_fishing.png)

Cast times are currently only logged as you fish, so there won't be any data until you've caught each fish. Green bars represent light tugs, yellow is a medium tug and red bars are legendary/heavy tugs.

[See here](https://www.youtube.com/watch?v=GHgWIA-Zhug) for examples of the different tug types.

Check [here](docs/FAQ-Troubleshooting.md#fisher-module) for common troubleshooting tips.

### [dps](ui/dps) meters

cactbot can be used with any dps meter overlay designed for OverlayPlugin's miniparse addon, with the option to build out more features through cactbot's additional Javascript APIs.  cactbot also auto-stops fights on wipes, so you can configure ACT's fight time to infinity.

The [xephero](ui/dps/xephero) dps meter is based on the same dps meter built for miniparse, with the additional ability to do per-phase dps tracking, displayed in additional columns. In the screenshot below the phases are named B1, B2, B3.  These autogenerate from dungeon bosses, but could be used to differentiate raid fight phases.

![xepheroスクリーンショット](screenshots/xephero.png)

The [rdmty](ui/dps/rdmty) dps meter is based on the same dps meter for miniparse, and updated for Stormblood jobs and recolored to match [fflogs](http://fflogs.com).

![rdmty screenshot](screenshots/rdmty.png)

### [pull counter](ui/pullcounter) module

This small module sticks the current pull count for raiding bosses on screen. This is primarily for folks who stream a lot and want to review video footage. Having a number on screen makes it easy to scrub through video and find particular pulls to review.

In most cases, you can reset the count for the current boss/zone by typing `/echo pullcounter reset`. You can also edit the counts directly in your `%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json` file.

![pull counter screenshot](screenshots/pullcounter.png)

### [test](ui/test) module

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

これらのオプションは「`%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json`」ファイルに保存されています。 It is not recommended to edit this file directly, as it must be [strict json](https://jsonlint.com/) and ACT might fail to load if the file is written incorrectly.

It is recommended that you do most of your configuration via this control panel rather than with user files. Files in `cactbot/user/` are more powerful and can override anything from the control panel. However, this can also be confusing when the control panel doesn't adjust something properly that a `cactbot/user/` file is overriding silently.

See [this documentation](docs/CactbotCustomization.md#user-folder-config-overrides) for more details about user javascript and css files.

## サポートされている言語

cactbot is tested and works with the current international (English, German, French, Japanese) version, the current Chinese version, and the current Korean version. Some translations are still a work in progress.

## Licensing, Trademarks, Copyright

cactbot is open source under the [Apache License, Version 2.0](LICENSE).

FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd.

Final Fantasy art and icons reused non-commercially under the [FINAL FANTASY® XIV Materials Usage License](https://support.na.square-enix.com/rule.php?id=5382).

See the [LICENSE](LICENSE) file for more details about other bundled projects.
