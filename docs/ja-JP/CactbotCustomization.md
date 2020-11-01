# Cactbotカスタム化

🌎 [**English**] [[简体中文](./zh-CN/CactbotCustomization.md)] [[한국어](./ko-KR/CactbotCustomization.md)]

- [Cactbot UIを利用する](#using-the-cactbot-ui)
- [Changing Trigger Text with the cactbot UI](#changing-trigger-text-with-the-cactbot-ui)
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
- changing the output of triggers
- cactbot言語を変更する
- 音量設定
- チーズアイコンを隠す

Cactbot設定UIにすべての設定を行うことはできません。 だけど、はじめはこのUIを通じて、最も簡単なのです。 より多くのオプションは後でそこに追加されます。

これらのオプションは「`%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json`」ファイルに保存されています。 そのファイルを直接編集する必要はありません。

## Changing Trigger Text with the cactbot UI

In the cactbot configuration UI, under ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> Raidboss, there are individual trigger listings. You can use these listings to change various exposed configuration settings per trigger.

Settings with a bell (🔔) next to their name are trigger mostly outputs that you can override. For example, maybe there's an 🔔onTarget field whose text is `Tank Buster on ${name}`. This is the string that will get played on screen (or via tts) when there is a tank buster on some person. `${name}` here is a parameter that will be set dynamically by the trigger. Anything that looks like `${param}` is such a dynamic parameter.

You could change this to say `${name} is going to die!` instead. Or, maybe you don't care who it's on, and you can edit the text to `Buster` to be brief. If you want to undo your overriding, just clear the text.

There are some limitations to this overriding. You cannot change the logic. You cannot make `tts` to say something different than the `alarmText` in most cases. You cannot add additional parameters. If you want to do any of these more complicated overrides, then you will want to look at the [Overriding Raidboss Triggers](#overriding-raidboss-triggers) section.

## ユーザーディレクトリ概要

Cactbot UIにお探しのオプションがない場合は、 ユーザーファイルの上書きを検討する必要があるかもしれません。 つまり、JavaScriptとCSSを書くことです。 少しプログラミングの知識が必要になるかもしれません。

Cactbotに一般的な考え方は、 ユーザー設定はユーザーディレクトリ内のファイルにのみ記述するというものです。 これにより、将来cactbotが更新する時に変更内容が上書きされるのを防ぐことができます。 さらに、将来的には、cactbotリリースから直接cactbotファイルを変更しても、 ビルド手順を実行しなければ正しく機能しません。

すべてのcactbot UIモジュールは、[user/](../../user/)ディレクトリからユーザー設定を読み込むことができます。 つまり、`raidboss` モジュールは`user/raidboss.js` と `user/raidboss.css` をロードします。 `Oopsyraidsy` モジュールは、`user/oopsyraidsy.js` と `user/oopsyraidsy.css` をロードします。 といったように、各モジュールは、ロード機能があります。 これらのファイルはcactbotのファイルの後に含まれられ、元の設定を上書きすることができます。

`user/`ディレクトリには、すでにいくつかの設定ファイルの例が含まれています。 名前を変更すれば使用することができます。 たとえば、[user/raidboss-example.js](../../user/raidboss-example.js)ファイルの名前を`user/raidboss.js`に変更し、 内容を編集すると、`raidboss`モジュールの動作を変更することがあります。

これらのファイルに変更をした後、 「オーバーレイの再読み込み」ボタンを押し、 ACTのOverlayPluginに対応したオーバーレイに対して、変更が適用されます。

## ユーザーディレクトリの設定

Cactbotユーザーディレクトリは、cactbot設定UIから設定できます： ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> Cactbotユーザーディレクトリ。 「`ディレクトリを選択`」ボタンを押し、ディスクに任意フォルダを選択します。

選択していない場合は、設定値はcactbotのインストールした場所に基づいて選択しようとします。

Cactbotのインストール先に`cactbot/user`フォルダを選択してください。 このフォルダは`%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`にあることが多いです。 [This folder](../user) has example customization files.

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

Let's say hypothetically that you are doing UCOB and your group decides that they are going to do "fire out" first instead of "fire in" first like cactbot calls it by default. Additionally, you *also* want to have the tts say something different for this trigger. You keep forgetting to get out, so you want it to repeat a few times.

If you only wanted to change the `infoText`, you could do this via [Changing Trigger Text with the cactbot UI](#changing-trigger-text-with-the-cactbot-ui).

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
      infoText: {
        en: 'Fire OUT',
      },
      tts: {
        en: 'out out out out out',
      },
      run: function(data) {
        data.naelFireballCount = 1;
      },
    },
  ],
});
```

This edit also removed languages other than English.

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

    Like adding a trigger, you add a section with the `zoneId`,
    along with `overrideTimelineFile: true`,
    and a `timelineFile` with the name of the text file.

    ```javascript
    Options.Triggers.push({
      zoneId: ZoneId.TheEpicOfAlexanderUltimate,
      overrideTimelineFile: true,
      timelineFile: 'the_epic_of_alexander.txt',
    });
    ```


    In this case, this assumes that you have followed step 1
    and there is a `user/the_epic_of_alexander.txt` file.
    
    By setting `overrideTimelineFile: true`,
    it tells cactbot to replace the built-in timeline entirely
    with any new timeline that you add.

1) Edit your new timeline file in your user folder as needed

    Refer to the [timeline guide](TimelineGuide.md) for more documentation on the timeline format.

**Note**: Editing timelines is a bit risky, as there may be timeline triggers that refer to specific timeline text. For instance, in TEA, there are timeline triggers for `Fluid Swing` and `Propeller Wind`, etc. If these names are changed or removed, then the timeline triggers will also be broken.

## 動作のカスタマイズ

This section discusses other kinds of customizations you can make to cactbot modules. There are some variables that are not in the config UI and are also not triggers.

Each cactbot module has an `Options` variable that controls various options. The options that can be changed are documented in the `Options` section at the top of each `ui/<name>/<name>.js` file.

For example in [ui/raidboss/raidboss.js](../ui/raidboss/raidboss.js), you see the `PlayerNicks` option which allows you to give people nicknames when their names are called out

```javascript
Options.PlayerNicks = {
  // 'Firstname Lastname': 'Nickname',
  'Banana Nana', 'Nana',
  'The Great\'one', 'Joe', // The Great'one => Joe, needs a backslash for the apostrophe
  'Viewing Cutscene': 'Cut',
  // etc, with more nicknames
};
```

**Warning**: files inside of your user directory will silently overwrite settings that were set from the cactbot configuration UI. This can be confusing, so it's generally preferable to let the config tool set everything you can, and only use user files in order to set things that the config tool does not provide access to.

## ユーザーファイルのデバッグ

### OverlayPlugin logにエラーを確認する

The OverlayPlugin log is scrolling window of text that can be found by going to ACT -> Plugins -> OverlayPlugin.dll, and looking at the bottom of the window.

If there are errors, they will appear here.

### ファイルがロードされているかどうかを確認する

First, turn on debug mode for raidboss. Go to the cactbot configuration UI, enable `Show developer options` and reload the page. Then, enable `Enable debug mode` under Raidboss, and reload again.

When raidboss debug mode is on, it will print more information to the OverlayPlugin log. It will list lines for each local user file it loads: `[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

Verify that your user file is loaded at all.

### ユーザーファイルにエラーがないか確認する

User files are JavaScript, and so if you write incorrect JavaScript, there will be errors and your user file will be skipped and it will not load. Check the OverlayPlugin log for errors when loading.

Here's an example:

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.js:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 96)
```
