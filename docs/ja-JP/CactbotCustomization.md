# Cactbotカスタム化

🌎[**英語**] [[简体中文](./zh-CN/CactbotCustomization.md)] [[한국어](./ko-KR/CactbotCustomization.md)]

- [Cactbot UIを利用する](#using-the-cactbot-ui)
- [cactbotUIを使用したトリガーテキストの変更](#changing-trigger-text-with-the-cactbot-ui)
- [ユーザーディレクトリ概要](#user-directory-overview)
- [ユーザーディレクトリの設定](#setting-your-user-directory)
- [外観カスタム化](#customizing-appearance)
- [Raidbossトリガーの上書き](#overriding-raidboss-triggers)
  - [例１：出力テキストを変更する](#example-1-changing-the-output-text)
  - [例２：挑発トリガーを全ジョブに適用する](#example-2-making-provoke-work-for-all-jobs)
  - [例３：カスタムトリガーを追加する](#example-3-adding-custom-triggers)
- [Raidbossタイムラインの上書き](#overriding-raidboss-timelines)
- [動作のカスタマイズ](#customizing-behavior)
- [ユーザーファイルのデバッグ](#debugging-user-files)
  - [OverlayPlugin logにエラーを確認する](#check-the-overlayplugin-log-for-errors)
  - [ファイルがロードされているかどうかを確認する](#check-if-your-file-is-loaded)
  - [ユーザーファイルにエラーがないか確認する](#check-if-your-user-file-has-errors)

## Cactbot UIを利用

Cactbot設定UIを介して、cactbotにカスタマイズすることがおすすめです。 設定UIは ACT -> Plugins -> OverlayPlugin.dll -> Cactbot に開けられます。

いくつかの機能があります：

- トリガーのTTS出力
- トリガーの無効化
- トリガーの出力を変更する
- cactbot言語を変更する
- 音量設定
- チーズアイコンを隠す

Cactbot設定UIにすべての設定を行うことはできません。 だけど、はじめはこのUIを通じて、最も簡単なのです。 より多くのオプションは後でそこに追加されます。

これらのオプションは「`%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json`」ファイルに保存されています。 そのファイルを直接編集する必要はありません。

## Cactbot UIでトリガーテキストを変更する

Cactbot設定UIは、 ACT -> プラグイン-> OverlayPlugin.dll -> Cactbot -> Raidbossにあります。中には各トリガーの調整ができます。 これらのリストを使用して、トリガーごとに公開されているさまざまな構成設定を変更できます。

名前の横にベル（🔔）が付いている設定は、ほとんどの場合、オーバーライドできる出力をトリガーします。 たとえば、テキストが ${name}</code>`タンクバスターである🔔onTargetフィールドがあるかもしれません。
これは、誰かにタンクバスターがいるときに画面上で（またはttsを介して）再生される文字列です。
<code>${name}` ここでは、トリガーによって動的に設定されるパラメーターです。 `${param}` ように見えるものはすべて、そのような動的パラメーターです。

これを変更して、 `${name} が死ぬと言うことができます！代わりに`。 または、誰がオンになっているかを気にせず、テキストを `バスター` に編集して簡潔にすることもできます。 オーバーライドを元に戻したい場合は、テキストをクリアしてください。

このオーバーライドにはいくつかの制限があります。 ロジックを変更することはできません。 あなたは作ることができない `TTS` より別の何かを言うために `alarmText` ほとんどの場合。 パラメータを追加することはできません。 これらのより複雑なオーバーライド（ いずれかを実行する場合は、 [オーバーライドレイドボストリガー](#overriding-raidboss-triggers) セクションを確認する必要があります。

## ユーザーディレクトリ概要

Cactbot UIにお探しのオプションがない場合は、 ユーザーファイルの上書きを検討する必要があるかもしれません。 つまり、JavaScriptとCSSを書くことです。 少しプログラミングの知識が必要になるかもしれません。

Cactbotに一般的な考え方は、 ユーザー設定はユーザーディレクトリ内のファイルにのみ記述するというものです。 これにより、将来cactbotが更新する時に変更内容が上書きされるのを防ぐことができます。 さらに、将来的には、cactbotリリースから直接cactbotファイルを変更しても、 ビルド手順を実行しなければ正しく機能しません。

すべてのcactbot UIモジュールは、[user/](../../user/)ディレクトリからユーザー設定を読み込むことができます。 つまり、`raidboss` モジュールは`user/raidboss.js` と `user/raidboss.css` をロードします。 `Oopsyraidsy` モジュールは、`user/oopsyraidsy.js` と `user/oopsyraidsy.css` をロードします。 といったように、各モジュールは、ロード機能があります。 これらのファイルはcactbotのファイルの後に含まれられ、元の設定を上書きすることができます。

`user/`ディレクトリには、すでにいくつかの設定ファイルの例が含まれています。 名前を変更すれば使用することができます。 たとえば、[user/raidboss-example.js](../../user/raidboss-example.js)ファイルの名前を`user/raidboss.js`に変更し、 内容を編集すると、`raidboss`モジュールの動作を変更することがあります。

これらのファイルに変更をした後、 「オーバーレイの再読み込み」ボタンを押し、 ACTのOverlayPluginに対応したオーバーレイに対して、変更が適用されます。

## ユーザーディレクトリの設定

Cactbotユーザーディレクトリは、cactbot設定UIから設定できます： ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> Cactbotユーザーディレクトリ。 「`ディレクトリを選択`」ボタンを押し、ディスクに任意フォルダを選択します。

選択していない場合は、設定値はcactbotのインストールした場所に基づいて選択しようとします。

Cactbotのインストール先に`cactbot/user`フォルダを選択してください。 このフォルダは`%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`にあることが多いです。 [このフォルダー](../user) は、カスタマイズファイルの例があります。

## 外観カスタム化

`user/<name>.css`ファイルを変更することにより、UIモジュールの位置、サイズ、色などをカスタマイズできます。 カスタマイズできるセレクターは`ui/<name>/<name>.css`ファイルを参照してください。

例えば、[ui/raidboss/raidboss.css](../../ui/raidboss/raidboss.css)には、 `#popup-text-container` や `#timeline-container`があります。 `user/raidboss.css`に介してUIコンポーネントの位置をカスタマイズすることができます。 `user/raidboss.css` に他のCSS規則も追加しましょう。

情報テキストのサイズと色は、以下のような `.info-text`クラスのCSS規則を作成することで 変更することもできます：

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

ユーザーファイルのCSS規則は、Cactbotの組み込みのCSSファイルの最後に追加されていると考えましょう。 そのため、[CSS詳細度](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)を覚えておく必要があります。 時には、規則を強制的に上書きさせるために`!important`を追加しましょう。 さらに、一部の属性をデフォルトの`auto`値にリセットする必要があります。

CSSをデバッグするには、[Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)というツールがおすすめです。 ACT -> Plugins -> OverlayPlugin.dll -> 対応オーバーレイ -> DevToolsを開く によって、オーバーレイのDevToolsを起動しましょう。

**メモ**：タイムラインバーなど、カスタマイズが難しいものや、カスタマイズ不可能なものがあります。 それらはカスタムエレメントを使っている、エクスポートした設定項目が少ないだから。 もしタイムラインバーについて変更したいことがあれば、[github issue](https://github.com/quisquous/cactbot/issues/new/choose)を提出してください。

**注意**：cactbotはCSSの後方互換性を保証できません。 将来の更新により、cactbotはエレメントの配置を変更したり、 エレメント名やクラスを変更したり、 スタイルを完全に変更したりする可能性があります。 一般的には、cactbotのCSSやスタイルを変更したい場合は、自己責任でお願いします。

## Raidbossトリガーの上書き

`cactbot/user/raidboss.js` ファイルによって、トリガーの動作を上書きすることができます。 例えば、出力テキストや、 適用ジョブや、 表示時間などの変更が可能です。

`cactbot/user/raidboss.js` ファイルに、 変数`Options.Triggers`はトリガーセットを含まれたリストです。 この変数を使い、新規トリガーや既存トリガーの変更が可能です。 ユーザーファイルに登録した新規トリガーのIDは既存のトリガー （cactbotが提供した内臓トリガー）と同じでしたら、そのトリガーが上書きされます。

[トリガーガイド](RaidbossGuide.md)にはトリガーの属性や仕様が記載されます。 トリガーを変更する前に、このガイドを読むことがおすすめです。

簡単に言うと、`cactbot/user/raidboss.js`ファイルに追加されるコードこのような形と思われます：

```javascript
Options.Triggers.push({
  // ファイルの先頭にZoneIdを探します
  // 例：ZoneId.MatchAll (全てのゾーン) や ZoneId.TheBozjanSouthernFront など
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // トリガーオブジェクトはここに
      // 例えば id や netRegex や infoText など
    },
  ],
});
```

こちらのコードをコピーし、ユーザーファイルに貼付け、トリガーをそれぞれ変更することは最も簡単なのです。 `zoneId`行を変更して、関心のあるゾーンのIDを設定します。 通常、cactbotトリガーファイルの先頭から分かります。 [こちらのファイル](../../resources/zone_id.js)にゾーンIDを含まれたリストがあります。 不適切なIDが指定されたら、OverlayPluginのログ窓に警告が出力する。 そして、トリガーコードをこちらに貼り付く、 自分が思うままに編集しよう。 変更したいすべてのトリガーをこのように編集して、 Raidbossオーバーレイを再読み込み、変更が適用されます。

**メモ**：この手順によると、元のトリガーは完全に放棄される。編集時にロジックを削除することが防げる必要があります。 CactbotはJavaScriptによって構成されたから、ユーザーファイルにも有効なJavaScriptしか使えません。 もしプログラミングに慣れていないなら、コードを編集する時に気にする必要があります。

### 例１：出力テキストを変更する

あなたがUCOBやっている仮説としましょう し、あなたのグループは、彼らが最初に「うちの火」をやろうとしていると判断した 最初cactbotのように、デフォルトではそれを呼び出す「に火」の代わりに。 さらに、あなたは *も* も、このトリガーに対してttsに何か違うことを言わせたいと思っています。 あなたは外に出るのを忘れ続けているので、それを数回繰り返したいと思います。

あなただけ変更したい場合は `情報テキスト`、 あなたは経由でこれを行うことが [cactbotのUIでの変更トリガテキスト](#changing-trigger-text-with-the-cactbot-ui)。

そのために、トリガーの出力テキストを調整しましょう。 元の fireball #1トリガーは [ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js](https://github.com/quisquous/cactbot/blob/cce8bc6b10d2210fa512bd1c8edd39c260cc3df8/ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js#L715-L743)に探せます。

以降のコードを `cactbot/user/raidboss.js` に貼り付きましょう。

```javascript
Options.Triggers.push({
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  triggers: [
    {
      id: 'UCU Nael Fireball 1',
      netRegex: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Ragnarök', id: '26B8', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ラグナロク', id: '26B8', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '诸神黄昏', id: '26B8', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '라그나로크', id: '26B8', capture: false }),
      delaySeconds: 35,
      suppressSeconds: 99999,
      // infoText は緑のテキストです。
      情報テキスト： {
        en: 'Fire OUT',
      }、
      TTS： {
        en: 'out out out out out',
      }、
      ラン：機能（データ）{
        data.naelFireballCount = 1。
      }、
    }、
  ]、
}）;
```

この編集により、英語以外の言語も削除されました。

### 例２：挑発トリガーを全ジョブに適用する

現在、挑発トリガーはアライアンスメンバーや、一部のジョブしか適用しません。 この例は、すべてのプレーヤーに適用させる方法を示しています。 元の挑発トリガーは [ui/raidboss/data/00-misc/general.js](https://github.com/quisquous/cactbot/blob/cce8bc6b10d2210fa512bd1c8edd39c260cc3df8/ui/raidboss/data/00-misc/general.js#L11-L30)に探せます。

こちらの例に、 `condition` 関数を変更しましょう。 トリガーのidは `General Provoke`、 cactbotに内蔵されたトリガーと同じidですから、 元のトリガーに上書きされます。

以降のコードを `cactbot/user/raidboss.js` に貼り付きましょう。

```javascript
Options.Triggers.push([{
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      id: 'General Provoke',
      netRegex: NetRegexes.ability({ id: '1D6D' }),
      condition: function(data, matches) {
        // すべての挑発メッセージを見たい！
        // パーティーメンバーじゃなくや、自分がタンクじゃなくでも。
        return true;
      },
      infoText: function(data, matches) {
        let name = data.ShortName(matches.source);
        return {
          en: 'Provoke: ' + name,
          de: 'Herausforderung: ' + name,
          fr: 'Provocation: ' + name,
          ja: '挑発: ' + name,
          cn: '挑衅: ' + name,
          ko: '도발: ' + name,
        };
      },
    },
  ],
]);
```

もとより、`condition`関数を丸ごと削除することも方法でしょう。条件関数がないなら、トリガー自体は正規表現がマッチ毎に起動できます。

### 例３：カスタムトリガーを追加する

カスタムトリガーを追加することも簡単なのです。

こちらはトリガーの例があります。「Forked Lightning」という効果が受けたから１秒後、「Get out!!!」が表示しようとする。

```javascript
Options.Triggers.push([
  {
    zoneId: ZoneId.MatchAll,
    triggers: [
      {
        // カスタムidだから、内蔵されたトリガーに上書きしません。
        id: 'Personal Forked Lightning',
        regex: Regexes.gainsEffect({ effect: 'Forked Lightning' }),
        condition: (data, matches) => { return matches.target === data.me; },
        delaySeconds: 1,
        alertText: 'Get out!!!',
      },

      // ... 他のトリガー
    ],
  },

  // ... 他のゾーン
]);
```

トリガーを実装する前に、[トリガーガイド](RaidbossGuide.md)を読むことがおすすめです。 [ui/raidboss/data](../../ui/raidboss/data) ディレクトリにトリガーコードも参考になれる。

## Raidbossタイムラインの上書き

Raidbossタイムラインの上書きは[トリガーの上書き](#overriding-raidboss-triggers)と似ています。

タイムラインを上書きする手順は以下の通りです。

1) Cactbotからタイムラインのテキストファイルをコピーし、ユーザーディレクトリに貼り付けましょう。

    例えば、
    [ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt](../ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt)
    を `user/the_epic_of_alexander.txt`にコピーしましょう。

1) user/raidboss.js にコードを追加しよう。

    トリガーを追加するように、あなたは`zoneId`、とのセクションを追加
    true`を、：` overrideTimelineFileとともに
    とテキストファイルの名前で`timelineFile`。

    ```javascript
    Options.Triggers.push（{
      zoneId：ZoneId.TheEpicOfAlexanderUltimate、
      overrideTimelineFile：true、
      timelineFile： 'the_epic_of_alexander.txt'、
}）;
    ```


    この場合、これはあなたがステップ1に続いていることを前提と
    と`ユーザー/ the_epic_of_alexander.txt`ファイルがあります。
    
    `overrideTimelineFile設定することによって：true`を、
    それは内蔵のタイムライン完全に置き換えるためにcactbotを告げる
    追加する任意の新しいタイムラインで。

1）必要に応じて、ユーザーフォルダ内の新しいタイムラインファイルを編集します

    タイムライン形式の詳細については、[タイムラインガイド]（TimelineGuide.md）を参照してください。

**注**：特定のタイムラインテキストを参照するタイムライントリガーが存在する可能性があるため、タイムラインの編集には少しリスクがあります 。 例えば、TEAでのタイムライントリガある `流体スイング` 及び `プロペラ風`等 これらの名前が変更または削除されると、タイムライントリガーも壊れます。

## 動作のカスタマイズ

このセクションでは、cactbotモジュールに対して行うことができる他の種類のカスタマイズについて説明します。 構成UIになく、トリガーでもない変数がいくつかあります。

各cactbotモジュールには、さまざまなオプションを制御する `オプション` 変数があります。 変更できるオプションは、に記載されて `オプション` 部 それぞれの上部に `UI /<name>/<name>の.js` ファイル。

たとえばで [UI / raidboss / raidboss.js](../ui/raidboss/raidboss.js)、 、あなたが見る `PlayerNicks` あなたは人々にニックネーム与えることができますオプション 、その名前が呼び出されたときに

```javascript
Options.PlayerNicks = {
  // '名姓'： 'ニックネーム'、
  'バナナナナ'、 'ナナ'、
  '偉大な\' 1」、 'ジョー'、// Great'one => ジョーアポストロフィ
  のバックスラッシュが必要です 'カットシーンの表示'： 'カット'、
  //など、より多くのニックネーム
};
```

**警告**：ユーザーディレクトリ内のファイルは、cactbot構成UIから設定された設定 をサイレントに上書きします。 これは、混乱することができます 、それは設定ツールセットあなたができることはすべて、聞かせすることが一般的に好ましいですので コンフィグツールがないことをセットのものにするためにのみ使用するユーザーファイルを へのアクセスを提供します。

## ユーザーファイルのデバッグ

### OverlayPlugin logにエラーを確認する

OverlayPluginログは、に行くことによって見つけることができるテキストのウィンドウスクロールさ - ACT> プラグイン-> OverlayPlugin.dll、 、ウィンドウの一番下を見て。

エラーがある場合は、ここに表示されます。

### ファイルがロードされているかどうかを確認する

まず、raidbossのデバッグモードをオンにします。 cactbot構成UIに移動し、 有効 `開発者オプションを表示` そしてページをリロードします。 次に、 `有効にします。Raidbossでデバッグモード` 有効にして、再度リロードします。

raidbossデバッグモードがオンの場合、 場合、OverlayPluginログに詳細情報が出力されます。 それはそれを各ローカルユーザーファイルの負荷を行が一覧表示されます： `[2020年10月19日6時18分27秒PM]インフォメーション：raidbossy：BrowserConsole：ローカルユーザーのファイル：C：\ユーザーは\tinipoutini \ cactbot \ユーザー\raidbossを。 js`

ユーザーファイルがロードされていることを確認します。

### ユーザーファイルにエラーがないか確認する

ユーザーファイルはJavaScriptであるため、間違ったJavaScriptを書き込むと、エラー が発生し、ユーザーファイルはスキップされて読み込まれません。 ロード時のエラーについては、OverlayPluginログを確認してください。

次に例を示します。

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.js:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 96)
```
