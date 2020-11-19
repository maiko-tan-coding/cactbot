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

ファイトタイムラインがために設計されたファイルで提供されている [ACTタイムライン](https://github.com/grindingcoil/act_timeline) プラグイン、 [ここでは、文書化](http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin) と [いくつかの拡張機能](docs/TimelineGuide.md)。

：エスカレート重要度の順にテキストアラートの三つのレベル、あり `情報`、 `警告`、および `アラーム`。 テキストメッセージはこれらのいずれかになり、より重要なレベルはより大きく、より目を引く色になります。  画面のテキストよりも音声合成を設定したい場合は、音声合成を設定できます。

タイムラインのファイルが中に発見された [UI / raidboss /データ/タイムライン](ui/raidboss/data/timelines)。 トリガ テキストと音アラートがで発見された [UI / raidboss /データ/トリガ](ui/raidboss/data/triggers)。

このスクリーンショットでは、raidbossモジュールが強調表示され、タイムラインが赤で囲まれ、 テキストアラートが黄色で囲まれ、 `アラート`レベルのテキストメッセージが表示されています。

![raidbossのスクリーンショット](screenshots/Raidboss.png)

### raidbossエミュレーター

：あなたがトリガやタイムラインを書き、それらをテストしたい場合は、raidbossエミュレータを使用することができます **UI / raidboss / raidemulator.html**。

これは現在、ブラウザにのみロードでき、オーバーレイとしてはロードできません。 これはクロム、現在のバージョンで動作します と同様に他のブラウザでも動作するはずですが、これはあまりテストされています。

指示：

1. ACTを開始します。
1. -確かWS Serverは、プラグイン経由で開始されていることを確認> OverlayPlugin WSServer -> ストリーム/ローカルオーバーレイ。
1. 選択 `Cactbot Raidboss（複合アラートおよびタイムライン）` URLジェネレータリストから。
1. 編集言うのURL `raidemulator.html` の代わりに、 `raidboss.html`。
1. この編集したURLをコピーしてChromeに貼り付けます。
1. [ネットワークログ](/docs/FAQ-Troubleshooting.md#how-to-find-a-network-log) をページにドラッグアンドドロップします。
1. ゾーンとの出会いを選択し、[OK]をクリックします `ロード出会い`。

エミュレータが機能していない場合は、インスペクタのコンソールログでエラーを確認してください。 WebSocketを介してACTに接続されるまで、ボタンは機能しません。

![raidbossエミュレータのスクリーンショット](screenshots/raidboss_emulator.png)

### [oopsyraidsy](ui/oopsyraidsy) モジュール

このモジュールは、使用するには 点のcactbotを **UI / oopsyraidsy / oopsyraidsy.html** 又は使用 `Cactbot OopsyRaidsy` プリセット。

このモジュールは、ミス追跡と死亡報告を提供します。  Oopsy raidsyは、戦いで何がうまくいかなかったのか、人々がどのように死んだのかを理解するために無駄な時間を減らすことを目的としています。  戦闘中は（混乱を避けるために）限られた数のミスのみが表示されますが、その後は完全なスクロール可能なリストが表示されます。

誰かが死んだとき、彼らが最後にダメージを受けたものがログにリストされます。  たとえば、ログに「:skull: Poutine：Iron Chariot（82173/23703）」と指定されている場合、これは、PoutineがIron Chariotで死亡した可能性が高く、82173のダメージを受け、その時点で23703の体力を持っていることを意味します。  ヘルス値自体は完全ではなく、ホットティックまたは複数の同時ダメージソースが原因で、わずかに1秒遅れている可能性があります。

回避可能なミスが発生すると、oopsyは警告（:warning:）メッセージと失敗（:no_entry_sign:）メッセージをログに記録し、何が悪かったのかを説明します。

ミストリガーは、内の個々の戦いのために指定されている [UI / oopsyraidsy /データ](ui/oopsyraidsy/data) フォルダー。

![おっと、スクリーンショット](screenshots/promo_oopsy.png)

### [ジョブ](ui/jobs) モジュール

このモジュールを使用する の点cactbot **UI /ジョブ/ jobs.html** 又は使用 `Cactbotジョブ` プリセット。

このモジュールは、ヘルス、マナ、およびtpバーに加えて、 TheBalanceやTrickAttackなどの大きなレイドバフ用のアイコンとタイマーバーを提供します。 また、レベリング またはレイド時にフードバフを維持するためのフードバフ警告、および視覚的なプルカウントダウンも備えています。

これは、より多くのいくつかの仕事をサポートして肉付けが、あるい *強く* 他の人のための作業進行中。

* 赤魔道士：白/黒のマナを表示し、Verstone、Verfire、Impactのprocを追跡し、進行中の近接コンボの状態を表示します。
* ウォリアー：獣の量を表示し、残りのストームズアイバフ時間をgcdで追跡します。
* モンク：チャクラの数、残りのグリースを塗った稲妻の時間を表示し、モンクのバフとデバフを追跡します。

このスクリーンショットでは、RedMageジョブのジョブモジュールが強調表示されています。 ヘルスバーとマナバー、および とレッドメイジの白/黒のマナトラッキングは紫色で囲まれ、大きなレイドバフトラッキングはオレンジ色の横にある 指しています。 近接コンボの最初のステップが実行されました。これは、ヘルスバーの上に黄色の ボックスとして表示されます。 procトラッキングは、下の緑色の丸で囲まれています。

![仕事のスクリーンショット](screenshots/Jobs.png)

### [ユーレカ](ui/eureka) モジュール

このモジュールは、使用するには 点のcactbotを **UI /ユーレカ/ eureka.html** 又は使用 `Cactbotユーレカ` プリセット。

このモジュールは、ポップされた、または が強制終了されたNMの自動追跡を提供します。  強風/ナイトタイマーと、チャットに貼り付けられたローカルトラッカーリンク が表示されます。  チャットでのすべてのフラグは、一時的でもある 地図上含まれています。

現在、トラッカー情報を直接読み取ることはありません。  ただし、 あなたは、左/をクリックした場合は、トラッカーにしてボタン「コピーNMSに殺された」RED あなたは例えば、ゲームでそれを貼り付けることができ、現在、死者のNMのリストをコピー `/エコー？ クールダウン時のNM：セルケト（7m） > ジュリカ（24m） > ポリ（54m）`

あなたは絵文字が表示されない場合は、必ずインストールしている作る [このWindowsの更新プログラム](https://support.microsoft.com/en-us/help/2729094/an-update-for-the-segoe-ui-symbol-font-in-windows-7-and-in-windows-ser)。

![eurekaスクリーンショット](screenshots/promo_eureka.png)

### [レーダー](ui/radar) モジュール

このモジュールは、使用するには 点のcactbotを **UI /レーダー/ radar.html** 又は使用 `Cactbotレーダー` プリセット。

このモジュールでは、近くのハントモブ（Sランク、Aランクなど）について知ることができます。 ポップすると、矢印（キャラクターの見出しに基づく） と暴徒までの距離が表示されます。

誰が暴徒を引いたかを示すオプション、 、およびレーダーの表示を構成するオプションがあります。 さまざまなランク （たとえば、Sランクでは音を立てるが、Bランクでは無音にする）、 または任意のMob名にカスタムトリガーを設定することもできます。

参照してください `cactbot /ユーザー/レーダー-example.js` より多くのオプションのために。

![レーダーのスクリーンショット](screenshots/promo_radar.png)

### [フィッシャー](ui/fisher) モジュール

このモジュールは、使用するには 点のcactbotを **UI /フィッシャー/ fisher.html** 又は使用 `Cactbotフィッシャー` プリセット。

釣り場でラインをキャストするとき、このモジュールは特定の魚をリールするタイミングを追跡し、フックしたときに何が得られるかを把握します。

![釣りのスクリーンショット](screenshots/promo_fishing.png)

現在、キャスト時間は釣りをしているときにのみ記録されるため、各魚を捕まえるまでデータはありません。 緑のバーは軽いタグボートを表し、黄色は中程度のタグボートを表し、赤いバーは伝説的/重いタグボートを表します。

[さまざまなタグボートの種類の例については、ここ](https://www.youtube.com/watch?v=GHgWIA-Zhug) を参照してください。

一般的なトラブルシューティングのヒントについては、 [ここ](docs/FAQ-Troubleshooting.md#fisher-module) を確認してください。

### [DPS](ui/dps) メートル

cactbotはOverlayPluginのminiparseのために設計された任意のDPSメーターオーバーレイで使用することができます cactbotの追加のJavascriptを通じてより多くの機能を構築するためのオプションで、アドオン のAPI。  cactbotはワイプでの戦闘も自動停止するため、ACTの戦闘時間を 無限大に構成できます。

[xephero](ui/dps/xephero) dpsメーターは、ミニ解析用に構築された同じdpsメーターに基づいており、 は、追加の列に表示される、フェーズごとのdpsトラッキングを実行する追加機能を備えています。 以下のスクリーンショットでは、フェーズの名前はB1、B2、B3です。  これらはダンジョンのボスから自動生成されますが、レイドファイトフェーズを区別するために使用できます。

![xepheroスクリーンショット](screenshots/xephero.png)

[rdmty](ui/dps/rdmty) DPS計はminiparseに対して同じDPSメーターに基づいて、更新された Stormbloodジョブのと一致するように再着色 [fflogs](http://fflogs.com)。

![rdmtyスクリーンショット](screenshots/rdmty.png)

### [プルカウンター](ui/pullcounter) モジュール

この小さなモジュールは、画面上のボスを襲撃するための現在のプルカウントを固定します。 これは主に、多くのストリーミングを行い、ビデオ映像を確認したい人向けです。 画面に数字があると、ビデオを簡単にスクラブして、レビューする特定のプルを 見つけることができます。

ほとんどの場合、 `/ echo pullcounter reset`入力すると、現在のボス/ゾーンのカウントをリセットできます。 また、あなたに直接カウントを編集することができます `%APPDATA%\高度な戦闘トラッカー\ Configを\RainbowMage.OverlayPlugin.config.json` ファイル。

![プルカウンターのスクリーンショット](screenshots/pullcounter.png)

### [テスト](ui/test) モジュール

このモジュールは、使用するには 点のcactbotを **UI /試験/ test.htmlという** 又は使用 `Cactbotテスト` プリセット。

このモジュールは、cactbot変数の画面上のテストであり、再生中に使用することを意図したものではありません。 すべてが期待どおりに機能していることを確認したり、オーバーレイの問題のデバッグに使用したりすると便利です。

![テストのスクリーンショット](screenshots/test.png)

## トラブルシューティング

一般的なFAQは、一般的なCactbotの問題の解決策を含む [ここ](docs/FAQ-Troubleshooting.md) ます。

## Cactbotのカスタマイズ

最も一般的なcactbotの構成は、ACT内の のコントロールパネルを介して行うことができます。

![設定パネル](screenshots/config_panel.png)

これは、 プラグイン> OverlayPlugin.dll-> Cactbotイベントソース に移動し、そこでオプションをクリックすることで見つけることができます。

特に、 あなたは、raidbossアラートのためにスピーチへのテキストを使用したい場合は あなたはあることを「デフォルトのアラート出力」を変更することができます 「のみTTS」または「テキストとTTS」。 これは、トリガーごとに変更することもできます。

それとも、何らかの理由であれば（???）あなたは、準備チェック警告音を望んでいない あなたは同じオプションパネルを経由して、これを無効にすることができます。 - Raidbossに行く> 一般的なトリガ-> 一般-> 一般的な準備のチェック、 し、それを設定する `障害者` の代わりに、 `デフォルト`。

これらのオプションは、あなたの中に保存されている `%APPDATA%\高度な戦闘トラッカー\ Configを\RainbowMage.OverlayPlugin.config.json` ファイル。 これは、このファイルを直接編集するにはお勧めしません それがでなければならないとして [厳格なJSON](https://jsonlint.com/) と、ファイルが誤って記述されている場合、ACTは、負荷に失敗することがあります。

ほとんどの構成は、ユーザーファイルではなく、このコントロールパネル を介して行うことをお勧めします。 `cactbot / user /` ファイルはより強力で 、コントロールパネルから何でも上書きできます。 ただし、これは、コントロールパネルが何か 適切に調整せず、 `cactbot / user /` ファイルがサイレントにオーバーライドされている場合にも混乱を招く可能性があります。

参照してください。 [この文書](docs/CactbotCustomization.md#user-folder-config-overrides) 、ユーザのjavascriptとcssファイルの詳細については。

## サポートされている言語

cactbotはテストされ、現在の 国際（英語、ドイツ語、フランス語、日本語）バージョン、 現在の中国語バージョン、 および現在の韓国語バージョンで動作します。 一部の翻訳はまだ進行中です。
