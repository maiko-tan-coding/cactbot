# 潜在的なエラーと回避策

1. [一般的なFFXIVACTのトラブルシューティング](#general-ffxiv-act-troubleshooting)
1. [Cactbotの使用に関する問題](#problems-using-cactbot)
1. [フィッシャーモジュール](#fisher-module)
1. [その他の問題](#other-issues)

## 一般的なFFXIVACTのトラブルシューティング

ngld（Cactbotが使用する [OverlayPlugin](https://github.com/ngld/OverlayPlugin) 開発者）は、FFXIVACTプラグインとOverlayPluginの一般的な問題に関する優れたFAQを作成しました。2 [ここにあります](https://gist.github.com/ngld/e2217563bbbe1750c0917217f136687d)。

あなたはそれを見つけることができないというエラーが出た場合 **FFXIV_ACT_Plugin.dll**、確認してください **FFXIV_ACT_Plugin.dll** にある `%APPDATA%\高度な戦闘トラッカー\プラグイン` フォルダ。 あなたは、インストールすることができます **FFXIV_ACT_Plugin.dll** ACTスタートアップウィザードからを。

## Cactbotのインストール中の問題

OverlayPluginコンソールで `ようなエラーが発生した場合エラー：JSハンドラーの呼び出しに失敗しました：System.Exception：欠落しているハンドラー「cactbotLoadUser」を呼び出そうとしました！` あなたはまだhibiyasleepのOverlayPluginのバージョンとngldの最新バージョンにアップグレードする必要が使用している [OverlayPlugin](https://github.com/ngld/OverlayPlugin/releases/latest) の代わりに。

あなたは次のようにOverlayPluginコンソールでエラーが出た場合 `Cactbot.CactbotEventSource：LoadAddons：：Cactbot.PluginLoader：RainbowMage.OverlayPlugin.TinyIoCResolutionException：解決型にできません。エラー` 、あなたは可能性がインストールされている `CactbotOverlay.dll` に `OverlayPlugin /アドオン` フォルダ。  [Cactbot](https://github.com/quisquous/cactbot#installing-cactbot) インストール手順の説明に従って、Cactbotファイルを独自の別のフォルダーに移動してください。

あなたがに似OverlayPluginコンソールでエラーが出た場合 `メソッドが見つかりません：：System.MissingMethodException「!! 0 [] System.Array.Empty（）` 、あなたは間違った.NETフレームワークのバージョンがインストールされています。  インストールしてください [.NET Frameworkの](https://www.microsoft.com/net/download/framework) バージョン4.6.1以上が。

あなたが得る場合は [CASポリシー](https://blogs.msdn.microsoft.com/drew/2009/12/23/xunit-and-td-net-fixing-the-attempt-was-made-to-load-an-assembly-from-a-network-location-problem/) OverlayPluginの開始に関するエラーを、のような `アンの試みは、アセンブリは、.NET Frameworkの以前のバージョンでサンドボックス化させていたネットワーク上の場所からアセンブリをロードするために作られました。` これは、DLLの一部またはすべて（hibiyasleepまたはcactbot）のブロックを解除するのを忘れたことを意味します。  まず、ACTを停止します。  次に、すべてのブロックを解除します。最も簡単な方法は、すべてのファイルのブロックを個別に解除するのではなく、元のzipファイルのブロックを解除して再抽出することです。  最後に、ACTを再起動します。

`ようなオーバーレイプラグインエラーが発生した場合エラー:(オーバーレイ）：SendFastRateEventsの例外：ファイルまたはアセンブリを読み込めませんでした 'FFXIV_ACT_Plugin、Version =（version）、Culture = neutral、PublicKeyToken = null'またはその依存関係の1つ。 システムは、指定されたファイルを見つけることができません。` 次に、ffxivプラグインのブロックを解除する必要があります。  DLLのブロックを解除するには、上記の手順を参照してください。

あなたが言うエラーが出た場合 `プラグインの読み込みエラー` と `ダウンロードしたファイルをロードすることができ、プラグイン含まれていませんでした`、 いくつかの潜在的な問題があるかもしれません。

- あなたがしたことを確認してください [OverlayPluginインストール](https://github.com/quisquous/cactbot#install-ngld-overlayplugin)。
- であなたのOverlayPluginのバージョンを確認してください **プラグイン** -> **プラグインのリスト** -> **OverlayPlugin.dll**。 これと同じバージョンでない場合は [このリリース](https://github.com/ngld/OverlayPlugin/releases/latest)、 、それを削除して再従う [インストール手順](https://github.com/quisquous/cactbot#install-ngld-overlayplugin)。
- x86 ACT（`ACTx86.exe`）ではなく、x64 ACT（`Advanced Combat Tracker.exe`）を実行していることを確認してください。
- 最後に、OverlayPluginをインストールしたら、ACTをリロードしたことを確認してください。

`無効なプラグインのようなエラーが発生した場合：このアセンブリには、ACTのプラグインインターフェイスを実装するクラスがないか、アセンブリをスキャンするとエラーが発生しました。` または `読み込みエラー：型のメソッド'LoadConfig「CactbotEventSource」などなどは実装していません` あなたがことを確認するべきである `CactbotOverlay.dll` 後に表示されている `OverlayPlugin.dll` に **プラグイン** -> **プラグインリスト**。

## Cactbotの使用に関する問題

UIのトリガやピースが仕事をしない場合、「ネットワーク・データから無効化解析」のことを確認している **ない** FFXIVプラグインの設定でチェック。 正確なトリガータイミングにはネットワークデータが必要です。

あなたがパースDPS用cactbotを使用していて、任意のデータを取得しない場合は、ことを確認してください `DPSは、間隔秒を更新` あなたに高いゼロより数に設定されている `OverlayPlugin.dll` -> `MiniParseイベントソース` 設定。  3に設定するのが適切なデフォルトです。

## フィッシャーモジュール

### オーバーレイが見えない

釣り穴にラインをキャストするまで、オーバーレイはデフォルトで非表示になっています。

### 釣りをしていると出てこない

オーバーレイがキャスティング/キャッチ/リールをロッドに登録しない場合は、チェックする必要のあるいくつかのオプションがあります。

- **ゲーム内チャットログフィルター**

![画像](images/troubleshooting_chatlogfilter.png)

あなたは、表示するために少なくとも一つのチャットログセットを持っている必要があります `自身の収集メッセージ` あなたは、このオプションを見つけることができる `コンフィギュレーションキャラ` -> `ログインウィンドウ設定` -> `ログ1/2/3/4フィルタ` -> `アナウンス`

- **ACTFFXIVプラグインオプション**

![画像](images/troubleshooting_hidechatlog.png)

`チャットログの非表示（プライバシーのため）` オプションを無効にする必要があります。

- サポートされている言語 韓国語は現在サポートされていません。 パーサー言語を変更した後、ACTを再起動する必要があります。

## ヘルプを得る場所

- [FFXIVACT不和](https://discord.gg/ahFKcmx) ＃troubleshootingチャンネルで尋ねる
- オープン [githubの問題を](https://github.com/quisquous/cactbot/issues)

## ネットワークログを見つける方法

あなたがトリガーやタイムラインに問題がある場合、 ACTからネットワークログを添付することが有用であることができ ので、 [ネットワークのログ](LogGuide.md#network-log-lines) 再生し、エラーを調べることができます。

ネットワークログを見つけるには、ACTの[ **プラグイン** ]タブに移動し、 [ **FFXIV設定** ]ボタンをクリックし、 、[ **]をクリックします。FFXIVログフォルダー**開きます。

![画像](images/troubleshooting_openlogfolder.png)

これにより、ファイルを含むフォルダウィンドウが開きます。 以下のようなものという名前のファイルを選択 **Network_etc.log**。 ファイルには、FFXIVACTプラグインのバージョンと日付が付けられています。

![画像](images/troubleshooting_networklog.png)

これらのファイルは大きいことが多いので、最初に圧縮してください。

これらをgithubの問題に直接添付できます。 または、ファイルホスティングサイトを見つけて、 そこにファイルをアップロードし、 次にリンクを添付します。
