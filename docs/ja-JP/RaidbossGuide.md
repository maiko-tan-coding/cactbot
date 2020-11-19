# ファイル形式をトリガーします

[**英語**] [[简体中文](./zh-CN/RaidbossGuide.md)]

## ファイル構造

```javascript
[{
  するzoneid：ZoneId.TheWeaponsRefrainUltimate、
  overrideTimelineFile：偽、
  timelineFile： 'ファイル名.txt'、
  タイムライン： `hideall`、
  timelineReplace：[
  {
     ロケール： 'EN'、
     のreplaceText： {
      'regexSearch': 'strReplace',
     }、
     replaceSync ： {
      'regexSearch': 'strReplace',
     }、
   }、
  ]、
  resetWhenOutOfCombat：真、
  トリガ：[
    {/ * ..trigger 1 .. * /}、
    {/ * ..トリガー2.。 * /}、
    {/ * ..トリガー3.。 * /}、
  ]
}、
{
  zoneRegex：/ Eureka Hydatos /、
  トリガー：[
    {/ * ..トリガー1.。 * /}、
    {/ * ..トリガー2.。 * /}、
    {/ * ..トリガー3.。 * /}、
  ]
}]
```

### 要素

**するzoneid** に、これらのトリガーを使用するゾーンのA短縮名。 ID名のセットはで見つけることができます [zone_id.js](../resources/zone_id.js)。 zoneRegexよりもこれを使用することをお勧めします。 トリガーセットには、ゾーン を指定するためにzoneIdまたはzoneRegexのいずれかが必要です（両方ではありません）。

**zoneRegex** ゾーン名（ACTから取得）と一致する正規表現。 正規表現が一致する場合、トリガーはそのゾーンに適用されます。

**overrideTimelineFile** を指定しているその任意のブール値 `timelineFile` 及び `タイムライン` すべてのタイムラインが以前に見出され、このトリガ組オーバーライドで指定されました。 これは、ユーザーファイルのタイムラインを置き換える方法であり、cactbot自体の内部では使用されません。

**timelineFile** このゾーンの負荷にするオプションのタイムラインファイル。 これらのファイルは、適切なフォルダー内の親トリガーファイルと一緒に存在します。 （たとえば、 `raidboss / data / 04-sb / raid /`）。

**タイムライン** オプションの余分な行は、タイムラインの一部として含めます。

**ロケール** 「KO」、「FR」、例えば「EN」にトリガファイルを制限するためのオプションのロケール。 存在しない場合は、すべてのロケールに適用されます。

**replaceText** タイムライン能力名で検索および置換するキー：値のペア。 その能力の表示名が変更されたが、全て `hideall`、 `情報テキスト`、 `alerttext`、 `alarmtext`などすべてが元の名前を参照します。 これにより、タイムラインファイルを直接編集しなくても、それらのファイルの翻訳/ローカリゼーションが可能になります。

**replaceSync** タイムラインファイル同期式で検索および置換するキーと値のペア。 ローカライズされた名前が同期正規表現で異なる場合に必要です。

**resetWhenOutOfCombat** ブール値、デフォルトはtrue。 trueの場合、ゲームが戦闘から外れると、タイムラインとトリガーが自動的にリセットされます。 それ以外の場合は、手動で `data.StopCombat（）`呼び出す必要があります。

## トリガー構造

```javascript
{
  id： 'id string'、
  disable：false、
  //注： [regexes.js]の正規表現ヘルパーを使用することをお勧めします（https://github.com/quisquous/cactbot/blob/main/resources/regexes.js）
  netRegex：/ trigger-regex-for-network-log-lines /、
  netRegexFr：/ trigger-regex-for-network-log-lines-but-in-French /
  regex：/ trigger-regex-for-act -logライン/、
  regexFr：/トリガ正規表現のための-ACTログライン-が、インフランス語/、
  条件：関数（データ一致、出力） { return true if it should run }、
  プレラン：機能（データ、マッチ、出力）{何かをする。。 }、
  delaySeconds：0、
  durationSeconds：3、
  suppressSeconds：0、
  約束：機能（データ一致、出力） { return promise to wait for resolution of }、
  音： ''、
  soundVolume：1、
  応答：Responses.doSomething（重症度） 、
  alarmText： {en: 'Alarm Popup'}、
  alertText： {en: 'Alert Popup'}、
  情報テキスト： {en: 'Info Popup'}、
  TTS： {en: 'TTS text'}、
  ラン：機能（データ一致、出力）{ものを行います.. }、
  outputStrings：{
    key1：{en： 'output1 ${value}'}、
    key2：{en： 'output2 ${value}'}、
  }、
}、
```

### データ、一致、出力

ほとんどすべてのトリガーフィールドは、値または `関数（データ、一致、出力）`返すことができます。 そのような機能の場合：

- `データ` は、すべてのトリガーに渡される一貫性のあるオブジェクトです。 値は 設定でき、次の関数を使用するためにそこにあります。
- `マッチ` トリガーからマッチ、ある 特異 `matches.groups` フィールド。
- `出力` のフィールドを回転させるための特別な目的である `outputStrings` リターンを文字列に。 参照してください `outputStringsに` より多くの情報については、以下のセクションを。 トリガリターン番号、例えばそのために `delaySeconds` または `durationSeconds` と の出力は何もないトリガーの、例えば `プレラン` または `の実行`、 出力フィールドは、大部分が無意味です。

### トリガー要素

**ID列** トリガのアンID文字列。 内蔵のトリガーcactbotにすべては、一意のIDを持っている 、それはお勧めしますが、ユーザートリガーはまた、それらを持っている必要はありません。

トリガーIDは一意である必要があります。 前のトリガーと同じIDである トリガーが見つかった場合、最初のトリガーは完全にスキップされ 番目のトリガーはそれをオーバーライドしてその場所に配置されます。 これにより、編集用のユーザーオーバーライドへのトリガーのコピーと貼り付けが簡単になります。 IDのないトリガーはオーバーライドできません。

`Regexes / NetRegexes` の現在の構造では、能力/効果/名前が式の一部として存在する必要はありません。 このため、その情報がどこかにあることが非常に重要です。 推奨される方法は、トリガーID自体、 または説明コメントに効果/能力/ NPC名を一緒に含めることです。 トリガー本体からのコンテキストだけでは必ずしも十分ではありません。 （idと同様に、cactbotリポジトリーを対象としたトリガーのみがこの情報を持っている必要があります。）

**無効：false** これがtrueの場合、トリガーは完全に無効になり、無視されます。 デフォルトはfalseです。

**netRegex / regex** 正規表現cactbotは、各ログ行 に対して実行され、トリガーがアクティブになるかどうかを判別します。 `netRegex` ネットワークログ株に対するバージョンが一致、 ながら `正規表現` 正規ACTログ株に対するバージョンが一致。

ただし、より一般的には、裸の正規表現の代わりに正規表現の置換が使用されます。 で定義されたヘルパー関数 [regexes.js](https://github.com/quisquous/cactbot/blob/main/resources/regexes.js) とで [netregexes.js](https://github.com/quisquous/cactbot/blob/main/resources/netregexes.js) それ以外の場合は一致基を介して抽出されるパラメータを取ります。 ここから、機能が自動的にすべき正規表現構築 と照合することを。 当然のことながら、用 `netRegex` 使用 `NetRegexes` ヘルパー とのための `正規表現` 利用 `正規表現` ヘルパー。

**netRegexFr / regexFr** 「FR」ロケールのロケールに基づく正規表現の例。 もし `Options.ParserLanguage == 'FR'`、次いで `regexFr` （存在する場合）よりも優先される `正規表現`。 それ以外の場合は無視されます。  これはフランス語の例にすぎませんが、regexEn、regexKoなど、他のロケールも同じように動作します。 様 `netRegex` 対 `正規表現`、 `netRegexFr` フランス語のネットワークログ株に対するマッチ ながら `regexFr` フレンチでACTログ株に対して一致。

ロケール正規表現には、定義された順序がありません。 現在の慣行は、それらを注文することである `デ`、 `、FR`、 `JA`、 `CN`、 `KO`しかし、。 さらに、裸の `正規表現` 要素と同様に、現在の慣行では、代わりに正規表現の置換を使用しています。

（理想的には、将来のある時点で、個々のロケール正規表現が不要になる可能性があります。 代わりに、 `timelineReplace` オブジェクトで提供される変換を使用して、これを自動的に行うことができます。 私たちはまだそこにいませんが、いつかは常にあります。）

**条件：関数（データ一致、出力）** アクティブトリガ機能が戻る場合 `真`。 `true`返さない場合、何も表示/発音/実行されません。 トリガーに複数の関数が存在する場合、これが最優先で実行されます。 （プレ製条件は内で使用可能な「缶詰」 [conditions.js](https://github.com/quisquous/cactbot/blob/main/resources/conditions.js)。 一般的に言えば、状況に合っている場合は、これらのいずれかを使用するのが最善です。）

**preRun：function（data、matches、output）** トリガーがアクティブになると、アクティブ化条件が満たされた後、関数が最初のアクションとして実行されます。

**delaySeconds** 正規表現の一致が検出されてからトリガーがアクティブになるまで待機する時間（秒単位）。 数値または数値を返す `関数（データ、一致、出力）` があります。 この実行後 `プレラン` 及び前 `約束`。

**promise：function（data、matches、output）** 存在し、promiseを返す関数の場合、 はpromiseが解決するのを待ってからトリガーを続行します。 これはからの遅延後に実行 `delaySeconds`。

**durationSeconds** トリガーテキストを表示する時間（秒単位）。 数値または数値を返す `関数（データ、一致、出力）` があります。 指定しない場合、デフォルトは3です。

**suppressSeconds** もう一度、このトリガーを示す前に、秒単位で、待機する時間。 数値または `関数（データ、一致、出力）`ます。 待機時間は、最初の正規表現の一致 の時点から始まり、delaySeconds値の有無による影響を受けません。 この要素を持つトリガーがアクティブに と、 タイムアウト期間が終了するまで、トリガーは再びアクティブになりません。

**音** 再生するサウンドファイル、または「情報」、「警告」、「アラーム」または「ロング」の一つ。 サウンドファイルへのパスは、ui / raidboss /ディレクトリからの相対パスです。

**soundVolume** 0と1との間の容積は、トリガーに関連付けられている音を再生します。

**応答** すべての単一エントリポイントから情報テキスト/ alertText / alarmText / TTSを返すAの方法。 また、で使用される `リソース/ responses.js`。 応答は、明示的に指定されたテキストまたはtts、 よりも優先度が低いため、オーバーライドできます。 （ `正規表現` および `条件`と同様に、「返信定型文」は [response.js](https://github.com/quisquous/cactbot/blob/main/resources/responses.js)内で利用できます。）

**alarmText** トリガーがアクティブになると、アラームの重要度を示すテキストポップアップを表示します。 これは、失敗があなたを殺すことが保証されている、 が遭遇を一掃する可能性が高い、 またはそうでなければ正常な完了をはるかに困難にする優先度の高いイベント用です。 （例としては、T2のAllagan Rot、T7のCursed Shriek、O7のUltros'Stoneskinキャストなどがあります。） 文字列または文字列を返す `関数（データ、一致、出力）` があります。

**alertText** トリガーがアクティブになると、アラートの重要度を示すテキストポップアップを表示します。 これは、あなたを殺す可能性がある中優先度のイベントのためである または負わパーティ全体のダメージ/デバフを。 （たとえば、バスターが入ってくることをメインタンクに警告したり、次のノックバックについてパーティ全体に警告したりします。） 文字列または文字列を返す `関数（データ、一致、出力）` があります。

**infoText** トリガーがアクティブになると、情報の重要度を示すテキストポップアップが表示されます。 これは、すぐに参加しないと単に迷惑になる優先度の低いイベント用です。 （たとえば、追加スポーンの警告、または入ってくるレイドダメージのヒーラーへの通知。） 文字列または文字列を返す `関数（データ、一致、出力）` があります。

**TTS** コールアウトに使用する選択したTTSオプションの代替テキスト文字列。 これは、テキストポップアップのようにローカライズされたオブジェクトにすることができます。

**run：function（data、matches、ouptut）** トリガーがアクティブになると、トリガーが終了する前の最後のアクションとして関数が実行されます。

**outputStrings** `outputStrings` はオプションの間接参照 ため、cactbotはトリガー文字列をオーバーライドするためのカスタマイズ可能なUIを提供できます。 独自のトリガを作成している場合は、この、使用する必要はありません し、あなただけの出力機能から直接文字列を返すことができます のような `alarmText`、 `alertText`、 `情報テキスト`など

`outputStrings` フィールドマッピング対象である `outputStrings` 並進オブジェクトにキー。 これらの翻訳可能なオブジェクトには、言語ごとに文字列エントリが必要です。 文字列では、 `${param}` 構文を使用して、関数が変数をに渡すことができるようにすることができます。

ここでは、2つの例であり、 `outputStrings` タンクバスターのためのエントリは：

```javascript
outputStrings：{
  noTarget：{
    en： 'タンクバスター'、
    de： 'タンクバスター'、
    fr： 'タンクバスター'、
    ja： 'タンクバスター'、
    cn： '今克死刑'、
    ko： ' 탱 버 '、
  }、
  ONTARGET：{
    エン： 'タンクバスターに ${name}'、
    デ： 'AUFタンクバスター ${name}'、
    FR： 'タンクバスターSUR ${name}'、
    JA： '${name}にタンクバスター' 、
    cn： '死刑点 ${name}'、
    ko： '"${name}"탱버'、
  }、
}、
```

`noTarget` 及び `ONTARGET` のための2つのキーで `outputStrings`。

ここで、これらの使用例です `outputStrings`にパラメータを渡す、 `ONTARGET` バージョン：

```javascript
alarmText：（data、matches、output）=> {
  return output.onTarget（{ name: matches.target }）;
}、
```

呼び出し `output.onTarget（）` 内で検出ストリング `outputStrings.onTarget` 現在の言語のために。 毎 `PARAM` 渡され、それが置き換え `${param}` 値を持つ文字列で。 そして、それがために置き換えた文字列を返す `alarmText` 使用します。

同様に、これはパラメータのない別のトリガーの例です。

```javascript
infoText：（data、matches、output）=> {
  return output.noTarget（）;
}、
```

使用トリガー `応答` と `outputStrings` わずかに異なっています。 `outputStrings` トリガー自体に設定されるべきではない、 、代わりに `対応` 関数呼び出し返すべき `= {} output.responseOutputStringsと、` ここで、 `{}` outputStringsあなたがトリガから返されるはずであるオブジェクト `outputStrings` フィールド。 これは少し厄介であるが、リターンおよび使用の両方に対応可能 `outputStrings`、 及び保つ [リソース/ responses.js](../resources/responses.js) より、カプセル化を。

例えば：

```javascript
応答:(データ、一致、出力）=> {
  output.responseOutputStrings = {text：{en： '一部のテキスト： ${words}'}};
  return {
    alarmText：output.text（{ words: 'words word words' }）、
  };
}、
```

## その他のトリガー情報

関数を返すことができる任意のフィールド（例えば `情報テキスト`、 `alertText`、 `alarmText`、 `TTS`） また、ローカライズされたオブジェクトを返すことができ 、代わりに「出る」復帰の例えば 彼らが返すことができる {en: 'Get Out', fr: 'something french'} 代わりに。 フィールドは、ローカライズされたオブジェクトを返す関数も返すことができます。 現在のロケールがオブジェクトに存在しない場合は、「en」の結果が返されます。

トリガー要素はこの順序で評価され、次の順序でリストする必要があります。

- id
- 無効
- netRegex（およびnetRegexDe、netRegexFrなど）
- 正規表現（およびregexDe、regexFrなど）
- beforeSeconds（timelineTriggersの場合）
- （ここで早期に抑制されたトリガー）
- 状態
- preRun
- delaySeconds
- 期間秒
- 抑制秒
- （delaySecondsはここで発生します）
- 約束する
- （約束を待つことはここで起こります）
- 音
- 音量
- 応答
- alarmText
- alertText
- infoText
- groupTTS
- tts
- 実行
- outputStrings

## 正規表現の拡張

正規表現としているお馴染みのあなたがいる場合、 あなたが注意しましょう `\ Y{Name}` および `\ Y{AbilityCode}` 慣れていません。 これらは、便利な ためにcactbotによって提供される拡張機能であり、考えられるすべてのUnicode文字 と一致する必要がないようにするため、またはFFXIVACTプラグインが物事を書き込む方法の詳細を知るためです。

拡張機能のセットは次のとおりです。

- `\ y{Float}`：浮動小数点数に一致し、ロケール固有のエンコーディングを考慮します。
- `\ y{Name}`：任意の文字名に一致します（FFXIV ACTプラグインが不明な場合に生成できる空の文字列を含む）。
- `\ y{ObjectId}`：ネットワークログ行の8文字の16進オブジェクトIDと一致します。
- `\ y{AbilityCode}`：呪文や能力の番号コードのFFXIVACTプラグインのフォーマットと一致します。
- `\ Y{Timestamp}`：のような各ログ・イベントの前にタイムスタンプが一致 `[：23：34.123 10]`。
- `\ y{LogType}`：各ログイベントの前面近くにあるログイベントのタイプを説明する番号コードのFFXIVACTプラグインの形式と一致します。

## 缶詰のヘルパー関数

統一トリガー構築するためには、翻訳の手動負担を軽減、 cactbotは「缶詰」トリガ要素の普及しています。 これらのヘルパーを使用すると、自動テストが大幅に簡単になり 、プルリクエストを確認するときに人間がエラーや不整合をより簡単にキャッチできるようになります。

現在、3つの別々の要素は、定義された構造予め作った [、条件](https://github.com/quisquous/cactbot/blob/main/resources/conditions.js)、 [正規表現](https://github.com/quisquous/cactbot/blob/main/resources/regexes.js)、及び [レスポンス](https://github.com/quisquous/cactbot/blob/main/resources/responses.js)。 `条件` 関数は引数を取りません。 ほぼすべて `レスポンス` の機能は、一つのオプション引数、取る `重大度`、 ユーザトリガをアクティブに表示するポップアップテキストのレベルを決定するために使用します。 `正規表現` 関数はいくつかの引数を取ることができます [（`gainsEffect（）` が良い例です）](https://github.com/quisquous/cactbot/blob/dcdf3ee4cd1b6d5bdfb9a8052cc9e4c9b10844d8/resources/regexes.js#L176) どのログ行が照合されるかに応じて 、しかし一般的に貢献者は `ソース`、（キャスター/ユーザーの名前一致する能力）の `ID`、（六角能力IDなど `2478`）と正規表現は（マッチをキャプチャするかどうかを`キャプチャ：×`）。 `正規表現` デフォルトでキャプチャを機能しますが、標準的な方法は、トリガー要素がキャプチャを必要としない限り、非キャプチャを指定することです。

これらすべての要素を利用するサンプルトリガー：

```javascript
{
  id： 'TEA Mega Holy Modified'、
  regex：Regexes.startsUsing（{ source: 'Alexander Prime', id: '4A83', capture: false }）、
  regexDe：Regexes.startsUsing（{ source: 'Prim-Alexander', id: '4A83', capture: false }）、
  regexFr：Regexes.startsUsing（{ source: 'Primo-Alexander', id: '4A83', capture: false }）、
  regexJa：Regexes.startsUsing（{source ： '正規表現ダー・プライム'、id： '4A83'、capture：false}）、
  regexCn：Regexes.startsUsing（{ source: '至尊亚历山大', id: '4A83', capture: false }）、
  regexKo：Regexes.startsUsing（{ source: '알렉산더 프라임', id: '4A83', capture: false }）、
  条件：Conditions.caresAboutMagical（）、
  応答：Responses.bigAoe（ 'alert'）、
}、
```

これにより、ロケールの正規表現に一致する必要のある行数が減ることはありませんが、これは次の場合よりもはるかに冗長ではありません。

```javascript
{
  id： 'TEA Mega Holy Modified'、
  regex：/ 14：........：AlexanderPrimeがMegaHoly /の使用を開始、
  regexDe：/ 14：........：Prim -AlexanderがSuper-Sanctus /、
  regexFr：/ 14：........：Primoの使用を開始-AlexanderがMégaMiracle/、
  regexJa：/ 14：........：アレキサンダー・プレスはメガホーリー/を使い始める、
  regexCn：/ 14：........：至尊亚历山大は百万神圣/を使い始める、
  regexKo：/ 14：........：알렉산더프라임は使い始める지진/、
  条件：function（data）{
    return data.role == 'tank' || data.role == 'ヒーラー' || data.CanAddle（）;
  }、
  alertText：{
    en： 'big aoe！'、
    de： 'GroßeAoE！'、
    fr： 'Grosse AoE！'、
    ja： '大到達AoE'、
    cn： '大AoE伤被害！ '、
    ko：'강한전체공격！ '、
  }、
}、
```

裸の正規表現の使用は非推奨です。 *常に* 非常に特定がない限り使用する適切な機能を缶詰 理由はしません。 ベア正規表現を使用しようとすると、プルリクエストが送信されたときにビルドが失敗します。 裸の正規表現が何らかの理由で使用しなければならない場合（たとえば、新しいログ行がACTに追加された、場合、） プル要求を更新する `regexes.jsを` 強く奨励されています。

（個人的な使用のためだけにトリガーを作成している場合は、自由に好きなことを行うことができます。 この非推奨は、cactbotリポジトリを対象とした作業にのみ適用されます。）

可能な場合は、缶詰の条件と対応を使用することをお勧めします。Squareの非常に才能のあるファイトデザインチームを考えると 、常に *が* なるとは限りません。

## タイムライン情報

：トリガーサブフォルダはここで説明したACTタイムラインプラグインによって定義されたフォーマットでタイムラインのテキストファイルが含まれていてもよい <http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin>

各タイムラインファイルCactbot用途所与の相対ディレクトリ参照によってロードされなければならない [TRIGGER-FILE]の.js。 通常、タイムラインファイルのファイル名はトリガーファイルの名前と一致し、特定の遭遇では、ファイル名は少なくともゾーン名と大まかに一致する必要があります。

Cactbotは、元の形式にいくつかの拡張機能を実装しています。 これらの拡張子は、ファイル 自体、またはトリガーの `タイムライン` フィールドに表示されます。

**infotext "event name" before 1** イベントが発生する前に、情報優先度のテキストポップアップを画面に表示します。 `イベント名` は、ファイル内の時限イベントと一致し、その名前のイベントが発生する前に表示されます。 デフォルトではイベントの名前が表示されますが、異なる場合は行末に表示するテキストを指定できます。 `before` パラメーターが存在する必要がありますが、イベントの発生と同時にテキストを表示する必要がある場合は0にすることができます。 負の値を使用して、イベント後のテキストを表示できます。

**イベントが発生する前に、イベント名1Sを示す例情報テキスト** `1前情報テキスト「イベント名を」`

**先に示しする異なるテキストを指定する例情報テキスト** `情報テキスト「イベント名」2.3「代替テキスト」の前の`

**同じパラメータを使用して、実施例アラート優先ポップアップ** `1の前に「イベント名」alerttext` `2.3「代替テキスト」前「イベント名」alerttext`

**同じパラメータを使用して、実施例アラーム優先度のポップアップ** `1の前に「イベント名」alarmtext` `2.3「代替テキスト」前「イベント名」alarmtext`
