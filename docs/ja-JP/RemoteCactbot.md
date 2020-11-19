# リモートCactbot

これは、他の人がACTを実行せずに独自のcactbotコールアウトとDPS番号を取得できるようにするためのガイドです。 これは、DX9ユーザーだけでなくACTも使用できないPS4ユーザーにとって理想的です。

推奨される方法は、OverlayPluginに組み込まれているポート転送を使用することです。 ポートフォワーディングは、接続されている各人にパーソナライズされたトリガーを与えることができます。 この方法では、他の人がdpsメーター または他の種類のオーバーレイを表示することもできます。

もう1つの方法は、 [不和ボットプラグイン](https://github.com/Makar8000/ACT-Discord-Triggers/wiki/First-Time-Setup-Guide)を使用することです。 不和ボットは、 が聞こえるcactbotからのすべてのttを再生し、パーティーの残りの部分で再生します。 これは、それほど素晴らしいです 多くのcactbotのトリガーがパーソナライズされているので、 、一般の「RAIDの発信者」であることを意味していない たとえそれが一種の作品のその方法。 現在、cactbotサウンドはプラグインを介して再生されません。

このガイドでは、ポート転送についてのみ説明します。 （パッチは、ACT Discord Triggers + cactbotに固有の説明を歓迎します。）

## ポートフォワーディングの概要

ACTを実行する人として従う必要のある手順は次のとおりです。

- [OverlayPluginWSServerのセットアップ](#setup-overlayplugin-wsserver)
- [接続をテストする](#test-your-connection)
- [リモートACTに接続します](#connect-to-remote-act)
- [Raidbossを構成する](#configure-raidboss)

あなたが迷子にした場合、参照 [HALP](#halp) セクションを。

## OverlayPluginWSServerのセットアップ

OverlayPluginは受け入れるサーバーで実行さ [のWebSocket](https://en.wikipedia.org/wiki/WebSocket) 接続 他のアプリケーションがACTのデータを使用することができます。 （これは、 維持されなくなり、cactbotがサポートしないACTWebSocketとは異なります。） また、ngrokのサポートが組み込まれており、ポート転送 を有効にして、ローカルネットワーク外の他のユーザーがそのWebSocketサーバーに接続できるようにします。

ACTでこれを有効にするには、 GO TO **プラグイン** -> **OverlayPlugin WSServer** -> **共有オーバーレイ**

![画像](images/remote_wsserver.png)

このページで、地域を選択します。 `開始`クリックし` 。
画面が持つ上記の画像のようになります。
<code>起動ngrok ...完了します！` それは言うべき `ステータス：アクティブ` 画面の上部にあります。

### 接続をテストする

ポートフォワーディングを確立したので、接続をテストします。 ドキュメントの残りの部分でこれらのすべての例では、 置き換える `a31a5403.ngrok.io` ログウィンドウに表示されるURLと。 <https://a31a5403.ngrok.io/> （サーバーのURLを置き換える）に移動すると、次の「ItWorks」ページが表示されます。

![画像](images/remote_itworks.png)

これが適切に設定されている場合、 `Cactbot Test` ようなオーバーレイプリセットを選択すると、ブラウザで開くためのURLが提供されます（例： [https://quisquous.github.io/cactbot/ui/）。 test / test.html？OVERLAY_WS = wss：//a31a5403.ngrok.io/ws](https://quisquous.github.io/cactbot/ui/test/test.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws)

そのファイルはgithub、 によって提供されているWebページですが、クエリ文字列はオーバーレイWebページにACTインスタンスに接続するように指示します。 ACTとFFXIVを開くと、ゲーム内のアクションに基づいてテストデータが更新されます。

![画像](images/remote_testui.png)

これが機能していないか、あなたはすべての情報が表示されない場合、参照 [HALP](#halp) セクションを。

## リモートACTに接続します

これで、友達はあなたのACTにリモートで接続できます。 残念ながら、すべてのオーバーレイHTMLページはリモートでホストする必要があります。 むしろのようなあなたのファイルシステムからローカルのURLをロードするよりも `C：\ユーザー\tinipoutini \ cactbot \ UI\raidboss\raidboss.html` あなたのようgithubのURLを使用する必要が `https://quisquous.github.io/cactbot/ UI / raidboss / raidboss.html`。

一般に、OverlayPluginタブ 下部にあるURLジェネレーターを使用して、任意のプリセットのURLを生成できます。

例えば：

- cactbot raidbossオーバーレイ： <https://quisquous.github.io/cactbot/ui/raidboss/raidboss.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>
- rdmty DPSオーバーレイ： <https://quisquous.github.io/cactbot/ui/dps/rdmty/dps.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>
- cactbot oopsy： <https://quisquous.github.io/cactbot/ui/oopsyraidsy/oopsyraidsy.html?OVERLAY_WS=wss://a31a5403.ngrok.io/ws>

### Raidbossを構成する

raidbossをリモートでロードすると、プレーヤー選択ダイアログが表示されます。

![画像](images/remote_playerselect.png)

インスタンスに入ると、プレーヤーのリストが表示されます。 このリストから自分を選択し、[ `] [オーバーレイの開始` ]をクリックしてレイドボスを開始します。

あなたはTTSおよびホスティング人はTTSがオンになっていないが、必要な場合 あなたがこれを有効にすることができます `フォーステキストを音声に有効` チェックボックスをオンにします。

残念ながら現時点では、 すべてのcactbotカスタマイズのは、地元である と任意のリモートプレイヤーがホストのカスタマイズを継承します。 現在オーバーライドできる唯一のオプションは、TTSを有効にすることです。

将来的には、にいくつかの追加のパラメータを追加することも可能である ではなく、現在、負荷独自のユーザーディレクトリ。

### その他のオーバーレイ

すべてのオーバーレイをリモートで実行できるわけではありません。 cactbot、oopsy、pullcounter、およびdpsオーバーレイがサポートされています。

レーダー、ジョブ、フィッシャーは、プレーヤーに関する詳細情報を必要とするため、 では機能しません。

## HALP

あなたが立ち往生したり、これらのステップのいずれかで混乱している場合、 ヘルプを表示するのに最適な場所です [FFXIV ACTが不和](https://discord.gg/ahFKcmx) #troubleshootingチャンネルを。 サボテンの不和はありません。ここに行くべきです。

ポートフォワーディングは実際にはcactbotの一部ではないため、 なので、raidbossパーティのオーバーライドが機能しない場合にのみ、cactbotgithubの問題を報告してください。

### トラブルシューティングのヒント

あなたは次のようにブラウザにURLを見ている場合は <https://quisquous.github.io/cactbot/ui/test/test.html?OVERLAY_WS=wss://127.0.0.1:10501/ws> 、あなたはドンゲーム中、 ACTが実行中、 、ACT WSServerが実行中であっても、データが表示されない場合は、devtoolsを確認する必要があります。

Chromeで、ページを右クリックして `Inspect` 移動し` （またはCtrl + Shift + Iを押します）。
次に、 <code>コンソール` をクリックして、コンソール出力を表示します。

![画像](images/remote_devtools.png)

これにより、問題の診断に役立つ詳細情報が得られます。
