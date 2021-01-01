# ファイル形式をトリガーします

[**英語**] [[简体中文](./zh-CN/RaidbossGuide.md)]

## ファイル構造

Each trigger file is a module that exports a single trigger set.

```javascript
import ZoneId from '../path/to/resources/zone_id.js';
// Other imports here.

export default {
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  overrideTimelineFile: false,
  timelineFile: 'filename.txt',
  timeline: `hideall`,
  timelineReplace: [
  {
     locale: 'en',
     replaceText: {
      'regexSearch': 'strReplace',
     },
     replaceSync: {
      'regexSearch': 'strReplace',
     },
   },
  ],
  resetWhenOutOfCombat: true,
  triggers: [
    { /* ..trigger 1.. * /}、
    {/ * ..トリガー2.。 * /}、
    {/ * ..トリガー3.。 */ },
  ]
};
```

### Trigger Set Properties

**zoneId** A shortened name for the zone to use these triggers in. The set of id names can be found in [zone_id.js](../resources/zone_id.js). Prefer using this over zoneRegex. A trigger set must have one of zoneId or zoneRegex to specify the zone (but not both).

**zoneRegex** A regular expression that matches against the zone name (coming from ACT). If the regular expression matches, then the triggers will apply to that zone.

**overrideTimelineFile** An optional boolean value that specifies that the `timelineFile` and `timeline` specified in this trigger set override all timelines previously found. This is a way to replace timelines in user files and is not used inside cactbot itself.

**timelineFile** An optional timeline file to load for this zone. Timeline files in cactbot should be named the same as the `.js` file they come from, but with a `.txt` extension instead. These files live alongside their parent trigger file in the appropriate folder. (As for example `raidboss/data/04-sb/raid/`).

**timeline** Optional extra lines to include as part of the timeline.

**locale** Optional locale to restrict the trigger file to, e.g. 'en', 'ko', 'fr'. If not present, applies to all locales.

**replaceText** Key:value pairs to search and replace in timeline ability names. The display name for that ability is changed, but all `hideall`, `infotext`, `alerttext`, `alarmtext`, etc all refer to the original name. This enables translation/localization of the timeline files without having to edit those files directly.

**replaceSync** Key:value pairs to search and replace in timeline file sync expressions. Necessary if localized names differ in the sync regexes.

**resetWhenOutOfCombat** Boolean, defaults to true. If true, timelines and triggers will reset automatically when the game is out of combat. Otherwise it's necessary to manually call `data.StopCombat()`.

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

Almost all trigger fields can either return a value or a `function(data, matches, output)`. For such functions:

- `データ` は、すべてのトリガーに渡される一貫性のあるオブジェクトです。 値は 設定でき、次の関数を使用するためにそこにあります。
- `マッチ` トリガーからマッチ、ある 特異 `matches.groups` フィールド。
- `出力` のフィールドを回転させるための特別な目的である `outputStrings` リターンを文字列に。 参照してください `outputStringsに` より多くの情報については、以下のセクションを。 トリガリターン番号、例えばそのために `delaySeconds` または `durationSeconds` と の出力は何もないトリガーの、例えば `プレラン` または `の実行`、 出力フィールドは、大部分が無意味です。

### Trigger Properties

**id string** An id string for the trigger. Every built-in trigger in cactbot has a unique id, and it is recommended but not required that user triggers also have them.

Trigger ids must be unique. If a trigger is found with the same id as a previous trigger, then the first trigger will be skipped entirely and the second trigger will override it and take its place. This allows easier for copying and pasting of triggers into user overrides for edits. Triggers without ids cannot be overridden.

The current structure for `Regexes/NetRegexes` does not require that the ability/effect/whatever name be present as part of the expression. Because of this, it is extremely important that that information is somewhere close by. Recommended practice is either to have the effect/ability/NPC name in the trigger ID itself, or in an explanatory comment alongside. Context solely from the trigger body is not necessarily sufficient! (As with the id, only triggers intended for the cactbot repository must have this information.)

**disabled: false** If this is true, the trigger is completely disabled and ignored. Defaults to false.

**netRegex / regex** The regular expression cactbot will run against each log line to determine whether the trigger will activate. The `netRegex` version matches against network log lines, while the `regex` version matches against regular ACT log lines.

More commonly, however, a regex replacement is used instead of a bare regex. Helper functions defined in [regexes.js](https://github.com/quisquous/cactbot/blob/main/resources/regexes.js) and in [netregexes.js](https://github.com/quisquous/cactbot/blob/main/resources/netregexes.js) take the parameters that would otherwise be extracted via match groups. From here, the functions automatically construct the regex that should be matched against. Unsurprisingly, for `netRegex` use the `NetRegexes` helper and for `regex` use the `Regexes` helper.

**netRegexFr / regexFr** Example of a locale-based regular expression for the 'fr' locale. If `Options.ParserLanguage == 'fr'`, then `regexFr` (if it exists) takes precedence over `regex`. Otherwise, it is ignored.  This is only an example for french, but other locales behave the same, e.g. regexEn, regexKo. Like `netRegex` vs `regex`, `netRegexFr` matches against network log lines in French while `regexFr` matches against ACT log lines in French.

Locale regexes do not have a defined ordering. Current practice is to order them as `de`, `fr`, `ja`, `cn`, `ko`, however. Additionally, as with bare `regex` elements, current practice is to use regex replacements instead.

(Ideally, at some point in the future, we could get to the point where we don't need individual locale regexes. Instead, we could use the translations provided in the `timelineReplace` object to do this automagically. We're not there yet, but there's always someday.)

**condition: function(data, matches, output)** Activates the trigger if the function returns `true`. If it does not return `true`, nothing is shown/sounded/run. If multiple functions are present on the trigger, this has first priority to run. (Pre-made "canned" conditions are available within [conditions.js](https://github.com/quisquous/cactbot/blob/main/resources/conditions.js). Generally speaking it's best to use one of these if it fits the situation.)

**preRun: function(data, matches, output)** If the trigger activates, the function will run as the first action after the activation condition is met.

**delaySeconds** An amount of time, in seconds, to wait from the time the regex match is detected until the trigger activates. May be a number or a `function(data, matches, output)` that returns a number. This runs after `preRun` and before the `promise`.

**promise: function(data, matches, output)** If present and a function which returns a promise, will wait for promise to resolve before continuing with trigger. This runs after the delay from `delaySeconds`.

**durationSeconds** Time, in seconds, to display the trigger text. May be a number or a `function(data, matches, output)` that returns a number. If not specified, defaults to 3.

**suppressSeconds** Time to wait, in seconds, before showing this trigger again. May be a number or a `function(data, matches, output)`. The time to wait begins at the time of the initial regex match and is unaffected by presence or absence of a delaySeconds value. Once a trigger with this element activates, it will not activate again until after its timeout period is over.

**sound** Sound file to play, or one of 'Info', 'Alert', 'Alarm', or 'Long'. Paths to sound files are relative to the ui/raidboss/ directory.

**soundVolume** Volume between 0 and 1 to play the sound associated with the trigger.

**response** A way to return infoText/alertText/alarmText/tts all from a single entrypoint. Also used by `resources/responses.js`. Response has less priority than an explicitly specified text or tts, and so can be overridden. (As with `regex` and `condition`, "canned" responses are available within [responses.js](https://github.com/quisquous/cactbot/blob/main/resources/responses.js).)

**alarmText** Displays a text popup with Alarm importance when the trigger activates. This is for high-priority events where failure is guaranteed to kill you, is likely to wipe the encounter, or will otherwise make successful completion much more difficult. (Examples include Allagan Rot in T2, Cursed Shriek in T7, or Ultros' Stoneskin cast in O7s.) 文字列または文字列を返す `関数（データ、一致、出力）` があります。

**alertText** Displays a text popup with Alert importance when the trigger activates. This is for medium-priority events that might kill you, or inflict party-wide damage/debuffs. (For example, warning the main tank that a buster is incoming, or warning the entire party of an upcoming knockback.) 文字列または文字列を返す `関数（データ、一致、出力）` があります。

**infoText** Displays a text popup with Info importance when the trigger activates. This is for low-priority events that will be merely annoying if not attended to immediately. (For example, warning of an add spawn, or informing healers of incoming raid damage.) 文字列または文字列を返す `関数（データ、一致、出力）` があります。

**tts** An alternative text string for the chosen TTS option to use for callouts. This can be a localized object just like the text popups.

**run: function(data, matches, ouptut)** If the trigger activates, the function will run as the last action before the trigger ends.

**outputStrings** `outputStrings` is an optional indirection so that cactbot can provide customizable UI for overriding trigger strings. If you are writing your own triggers, you don't need to use this, and you can just return strings directly from output functions like `alarmText`, `alertText`, `infoText`, etc.

The `outputStrings` field is an object mapping `outputStrings` keys to translatable objects. These translatable objects should have a string entry per language. In the string, you can use `${param}` constructions to allow for functions to pass variables in.

Here are two example `outputStrings` entries for a tank buster:

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

`noTarget` and `onTarget` are the two keys for the `outputStrings`.

Here's an example using these `outputStrings`, passing parameters to the `onTarget` version:

```javascript
alarmText：（data、matches、output）=> {
  return output.onTarget（{ name: matches.target }）;
}、
```

Calling `output.onTarget()` finds the string in `outputStrings.onTarget` for the current language. For each `param` passed in, it replaces `${param}` in the string with the value. Then it returns the replaced string for `alarmText` to use.

Similarly, this is another trigger example, without any parameters.

```javascript
infoText：（data、matches、output）=> {
  return output.noTarget（）;
}、
```

Triggers that use `response` with `outputStrings` are slightly different. `outputStrings` should not be set on the trigger itself, and instead `response` should return a function that calls `output.responseOutputStrings = {};` where `{}` is the outputStrings object you would have returned from the trigger `outputStrings` field. This is a bit awkward, but allows response to both return and use `outputStrings`, and keeps [resources/responses.js](../resources/responses.js) more encapsulated.

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

Any field that can return a function (e.g. `infoText`, `alertText`, `alarmText`, `tts`) can also return a localized object, e.g. instead of returning 'Get Out', they can return {en: 'Get Out', fr: 'something french'} instead. Fields can also return a function that return a localized object as well. If the current locale does not exist in the object, the 'en' result will be returned.

Trigger elements are evaluated in this order, and must be listed in this order:

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
- tts
- 実行
- outputStrings

## 正規表現の拡張

If you're familiar with regular expressions, you'll note the the `\y{Name}` and `\y{AbilityCode}` are unfamiliar. These are extensions provided by cactbot for convenience to avoid having to match against all possible unicode characters or to know the details of how the FFXIV ACT plugin writes things.

The set of extensions are:

- `\ y{Float}`：浮動小数点数に一致し、ロケール固有のエンコーディングを考慮します。
- `\ y{Name}`：任意の文字名に一致します（FFXIV ACTプラグインが不明な場合に生成できる空の文字列を含む）。
- `\ y{ObjectId}`：ネットワークログ行の8文字の16進オブジェクトIDと一致します。
- `\ y{AbilityCode}`：呪文や能力の番号コードのFFXIVACTプラグインのフォーマットと一致します。
- `\ Y{Timestamp}`：のような各ログ・イベントの前にタイムスタンプが一致 `[：23：34.123 10]`。
- `\ y{LogType}`：各ログイベントの前面近くにあるログイベントのタイプを説明する番号コードのFFXIVACTプラグインの形式と一致します。

## 缶詰のヘルパー関数

In order to unify trigger construction and reduce the manual burden of translation, cactbot makes widespread use of "canned" trigger elements. Use of these helpers makes automated testing significantly easier, and allows humans to catch errors and inconsistencies more easily when reviewing pull requests.

Currently, three separate elements have pre-made structures defined: [Condition](https://github.com/quisquous/cactbot/blob/main/resources/conditions.js), [Regex](https://github.com/quisquous/cactbot/blob/main/resources/regexes.js), and [Response](https://github.com/quisquous/cactbot/blob/main/resources/responses.js). `Condition` functions take no arguments. Almost all `Response` functions take one optional argument, `severity`, used to determine what level of popup text to display to the user when the trigger activates. `Regex` functions can take several arguments [(`gainsEffect()` is a good example)](https://github.com/quisquous/cactbot/blob/dcdf3ee4cd1b6d5bdfb9a8052cc9e4c9b10844d8/resources/regexes.js#L176) depending on which log line is being matched against, but generally a contributor would include the `source`, (name of the caster/user of the ability to match,) the `id`, (the hex ability ID, such as `2478`,) and whether or not the regex should capture the matches (`capture: false`.) `Regex` functions capture by default, but standard practice is to specify non-capturing unless a trigger element requires captures.

A sample trigger that makes use of all these elements:

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

While this doesn't reduce the number of lines we need to match the locale regexes, this is far less verbose than:

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

Use of bare regexes is deprecated. *Always* use the appropriate canned function unless there is a very specific reason not to. Attempting to use a bare regex will cause a build failure when the pull request is submitted. If a bare regex must be used for whatever reason (if, say, a new log line is added to ACT,) pull requests to update `regexes.js` are strongly encouraged.

(Note that if you are writing triggers for just your personal use, you are free to do what you want. This deprecation applies only to work intended for the cactbot repository.)

Use of canned conditions and responses is recommended where possible, although given Square's extremely talented fight design team, it's not always going to *be* possible.

## タイムライン情報

The trigger subfolders may contain timeline text files in the format defined by ACT Timeline plugin, which described in here: <http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin>

Each timeline file Cactbot uses has to be loaded by a relative directory reference from the given [TRIGGER-FILE].js. Typically the filename for the timeline file will match the name of the trigger file, and for specific encounters the filenames should at least loosely match the zone name.

Cactbot implements some extensions to the original format. These extensions can appear in the file itself or in the `timeline` field in the triggers:

**infotext "event name" before 1** Show a info-priority text popup on screen before an event will occur. The `event name` matches a timed event in the file and will be shown before each occurrence of events with that name. By default the name of the event will be shown, but you may specify the text to be shown at the end of the line if it should be different. The `before` parameter must be present, but can be 0 if the text should be shown at the same time the event happens. Negative values can be used to show the text after the event.

**Example infotext which shows the event name 1s before the event happens** `infotext "event name" before 1`

**Example infotext which specifies different text to be shown earlier** `infotext "event name" before 2.3 "alternate text"`

**Example alert-priority popups using the same parameters** `alerttext "event name" before 1` `alerttext "event name" before 2.3 "alternate text"`

**Example alarm-priority popups using the same parameters** `alarmtext "event name" before 1` `alarmtext "event name" before 2.3 "alternate text"`
