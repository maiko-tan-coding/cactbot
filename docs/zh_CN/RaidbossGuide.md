# 触发器文件格式

[[English](../RaidbossGuide.md)] [**简体中文**]

## 文件结构

每个触发器文件都是一个JS模块，该模块导出一个触发器集合。

```javascript
import ZoneId from '../path/to/resources/zone_id.js';
// 导入其他引用

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
    { /* ..触发器1.. */ },
    { /* ..触发器2.. */ },
    { /* ..触发器3.. */ },
  ]
};
```

### 触发器集合属性

**zoneId** 区域名缩写，用于指定触发器的适用区域。 [zone_id.js](../../resources/zone_id.js) 文件中列出了当前版本所有的区域名缩写。 我们倾向于使用该属性，而非zoneRegex。 每个触发器集合都必须包含zoneId或zoneRegex之一(但二者不能并存)。

**zoneRegex** 正则表达式，用于匹配区域名称(ACT读取的区域名)。 当正则表达式匹配到当前的区域名，则该集合中的触发器会应用于该区域。

For players in CN/KR, zone names can be Chinese/Korean, though other players always see English. Your Regex should cover them. The current zone name can be found on title or main UI of ACT.

**overrideTimelineFile** An optional boolean value that specifies that the `timelineFile` and `timeline` specified in this trigger set override all timelines previously found. This is a way to replace timelines in user files and is not used inside cactbot itself.

**timelineFile** An optional timeline file to load for this zone. Timeline files in cactbot should be named the same as the `.js` file they come from, but with a `.txt` extension instead. These files live alongside their parent trigger file in the appropriate folder. (As for example `raidboss/data/04-sb/raid/`).

**timeline** Optional extra lines to include as part of the timeline. The value may be a string or an array of strings, or a `function(data)` that returns string or an array of strings, or an array contains different kinds of items above.

There is a complete example that uses the **timeline** property in [test.js](../ui/raidboss/data/00-misc/test.js).

**locale** Optional locale to restrict the trigger file to, e.g. 'en', 'ko', 'fr'. If not present, applies to all locales.

**replaceText** Key:value pairs to search and replace in timeline ability names. The display name for that ability is changed, but all `hideall`, `infotext`, `alerttext`, `alarmtext`, etc all refer to the original name. This enables translation/localization of the timeline files without having to edit those files directly.

**replaceSync** Key:value pairs to search and replace in timeline file sync expressions. Necessary if localized names differ in the sync regexes.

**resetWhenOutOfCombat** Boolean, defaults to true. If true, timelines and triggers will reset automatically when the game is out of combat. Otherwise it's necessary to manually call `data.StopCombat()`.

## 触发器结构

```javascript
{
  id: 'id string',
  disabled: false,
  // Note: prefer to use the regex helpers from [netregexes.ts](https://github.com/quisquous/cactbot/blob/main/resources/netregexes.ts)
  netRegex: /trigger-regex-for-network-log-lines/,
  netRegexFr: /trigger-regex-for-network-log-lines-but-in-French/
  // Note: prefer to use the regex helpers from [regexes.ts](https://github.com/quisquous/cactbot/blob/main/resources/regexes.ts)
  regex: /trigger-regex-for-act-log-lines/,
  regexFr: /trigger-regex-for-act-log-lines-but-in-French/,
  condition: function(data, matches, output) { return true if it should run },
  preRun: function(data, matches, output) { do stuff.. },
  delaySeconds: 0,
  durationSeconds: 3,
  suppressSeconds: 0,
  promise: function(data, matches, output) { return promise to wait for resolution of },
  sound: '',
  soundVolume: 1,
  response: Responses.doSomething(severity),
  alarmText: {en: 'Alarm Popup'},
  alertText: {en: 'Alert Popup'},
  infoText: {en: 'Info Popup'},
  tts: {en: 'TTS text'},
  run: function(data, matches, output) { do stuff.. },
  outputStrings: {
    key1: { en: 'output1 ${value}'},
    key2: { en: 'output2 ${value}'},
  },
},
```

### 触发器元素

Almost all trigger fields can either return a value or a `function(data, matches, output)`. For such functions:

- `data` 是传递给所有触发器的同一对象。 您可以在该对象上设置值，并可以通过下述的任意函数使用。
- `\y{Float}`：匹配浮点数，包含某些区域特定的编码。
- `output` 是一个特殊对象，用于将 `outputStrings` 字段转换为要返回的字符串。 更多信息请参见下面的 `outputStrings` 部分。 对于返回数字的触发器字段（如 `delaySeconds` 或 `durationSeconds`）以及 不输出任何东西的触发器（如 `preRun` 或 `run`）来说，该output字段并没有什么用处。

### 触发器属性

**id string** An id string for the trigger. Every built-in trigger in cactbot has a unique id, and it is recommended but not required that user triggers also have them.

Trigger ids must be unique. If a trigger is found with the same id as a previous trigger, then the first trigger will be skipped entirely and the second trigger will override it and take its place. This allows easier for copying and pasting of triggers into user overrides for edits. Triggers without ids cannot be overridden.

The current structure for `Regexes/NetRegexes` does not require that the ability/effect/whatever name be present as part of the expression. Because of this, it is extremely important that that information is somewhere close by. Recommended practice is either to have the effect/ability/NPC name in the trigger ID itself, or in an explanatory comment alongside. Context solely from the trigger body is not necessarily sufficient! (As with the id, only triggers intended for the cactbot repository must have this information.)

**disabled: false** If this is true, the trigger is completely disabled and ignored. Defaults to false.

**netRegex / regex** The regular expression cactbot will run against each log line to determine whether the trigger will activate. The `netRegex` version matches against network log lines, while the `regex` version matches against regular ACT log lines.

More commonly, however, a regex replacement is used instead of a bare regex. Helper functions defined in [regexes.ts](https://github.com/quisquous/cactbot/blob/main/resources/regexes.ts) and in [netregexes.ts](https://github.com/quisquous/cactbot/blob/main/resources/netregexes.ts) take the parameters that would otherwise be extracted via match groups. From here, the functions automatically construct the regex that should be matched against. Unsurprisingly, for `netRegex` use the `NetRegexes` helper and for `regex` use the `Regexes` helper.

**netRegexFr / regexFr** Example of a locale-based regular expression for the 'fr' locale. If `Options.ParserLanguage == 'fr'`, then `regexFr` (if it exists) takes precedence over `regex`. Otherwise, it is ignored.  This is only an example for french, but other locales behave the same, e.g. regexEn, regexKo. Like `netRegex` vs `regex`, `netRegexFr` matches against network log lines in French while `regexFr` matches against ACT log lines in French.

Locale regexes do not have a defined ordering. Current practice is to order them as `de`, `fr`, `ja`, `cn`, `ko`, however. Additionally, as with bare `regex` elements, current practice is to use regex replacements instead.

(Ideally, at some point in the future, we could get to the point where we don't need individual locale regexes. Instead, we could use the translations provided in the `timelineReplace` object to do this automagically. We're not there yet, but there's always someday.)

**condition: function(data, matches, output)** Activates the trigger if the function returns `true`. If it does not return `true`, nothing is shown/sounded/run. If multiple functions are present on the trigger, this has first priority to run. (Pre-made "canned" conditions are available within [conditions.ts](https://github.com/quisquous/cactbot/blob/main/resources/conditions.ts). Generally speaking it's best to use one of these if it fits the situation.)

**preRun: function(data, matches, output)** If the trigger activates, the function will run as the first action after the activation condition is met.

**delaySeconds** An amount of time, in seconds, to wait from the time the regex match is detected until the trigger activates. 其值可以是数字或返回数字的 `function(data, matches)`。 This runs after `preRun` and before the `promise`.

**promise: function(data, matches, output)** If present and a function which returns a promise, will wait for promise to resolve before continuing with trigger. This runs after the delay from `delaySeconds`.

**durationSeconds** Time, in seconds, to display the trigger text. 其值可以是数字或返回数字的 `function(data, matches)`。 If not specified, defaults to 3.

**suppressSeconds** Time to wait, in seconds, before showing this trigger again. May be a number or a `function(data, matches, output)`. The time to wait begins at the time of the initial regex match and is unaffected by presence or absence of a delaySeconds value. Once a trigger with this element activates, it will not activate again until after its timeout period is over.

**sound** Sound file to play, or one of 'Info', 'Alert', 'Alarm', or 'Long'. Paths to sound files are relative to the ui/raidboss/ directory.

**soundVolume** Volume between 0 and 1 to play the sound associated with the trigger.

**response** A way to return infoText/alertText/alarmText/tts all from a single entrypoint. Also used by `resources/responses.js`. Response has less priority than an explicitly specified text or tts, and so can be overridden. (As with `regex` and `condition`, "canned" responses are available within [responses.js](https://github.com/quisquous/cactbot/blob/main/resources/responses.js).)

**alarmText** Displays a text popup with Alarm importance when the trigger activates. This is for high-priority events where failure is guaranteed to kill you, is likely to wipe the encounter, or will otherwise make successful completion much more difficult. (Examples include Allagan Rot in T2, Cursed Shriek in T7, or Ultros' Stoneskin cast in O7s.) ) 其值可以是字符串或返回字符串的 `function(data, matches)`。

**alertText** Displays a text popup with Alert importance when the trigger activates. This is for medium-priority events that might kill you, or inflict party-wide damage/debuffs. (For example, warning the main tank that a buster is incoming, or warning the entire party of an upcoming knockback.) ) 其值可以是字符串或返回字符串的 `function(data, matches)`。

**infoText** Displays a text popup with Info importance when the trigger activates. This is for low-priority events that will be merely annoying if not attended to immediately. (For example, warning of an add spawn, or informing healers of incoming raid damage.) ) 其值可以是字符串或返回字符串的 `function(data, matches)`。

**tts** An alternative text string for the chosen TTS option to use for callouts. This can be a localized object just like the text popups.

**run: function(data, matches, output)** If the trigger activates, the function will run as the last action before the trigger ends.

**outputStrings** `outputStrings` is an optional indirection so that cactbot can provide customizable UI for overriding trigger strings. If you are writing your own triggers, you don't need to use this, and you can just return strings directly from output functions like `alarmText`, `alertText`, `infoText`, etc.

The `outputStrings` field is an object mapping `outputStrings` keys to translatable objects. These translatable objects should have a string entry per language. In the string, you can use `${param}` constructions to allow for functions to pass variables in.

Here are two example `outputStrings` entries for a tank buster:

```javascript
outputStrings: {
  noTarget: {
    en: 'Tank Buster',
    de: 'Tank buster',
    fr: 'Tank buster',
    ja: 'タンクバスター',
    cn: '坦克死刑',
    ko: '탱버',
  },
  onTarget: {
    en: 'Tank Buster on ${name}',
    de: 'Tank buster auf ${name}',
    fr: 'Tank buster sur ${name}',
    ja: '${name}にタンクバスター',
    cn: '死刑 点 ${name}',
    ko: '"${name}" 탱버',
  },
},
```

`noTarget` and `onTarget` are the two keys for the `outputStrings`.

Here's an example using these `outputStrings`, passing parameters to the `onTarget` version:

```javascript
alarmText: (data, matches, output) => {
  return output.onTarget({ name: matches.target });
},
```

Calling `output.onTarget()` finds the string in `outputStrings.onTarget` for the current language. For each `param` passed in, it replaces `${param}` in the string with the value. Then it returns the replaced string for `alarmText` to use.

Similarly, this is another trigger example, without any parameters.

```javascript
infoText: (data, matches, output) => {
  return output.noTarget();
},
```

Triggers that use `response` with `outputStrings` are slightly different. `outputStrings` should not be set on the trigger itself, and instead `response` should return a function that calls `output.responseOutputStrings = {};` where `{}` is the outputStrings object you would have returned from the trigger `outputStrings` field. This is a bit awkward, but allows response to both return and use `outputStrings`, and keeps [resources/responses.js](../resources/responses.js) more encapsulated.

比如：

```javascript
response: (data, matches, output) => {
  output.responseOutputStrings = { text: { en: 'Some Text: ${words}' } };
  return {
    alarmText: output.text({ words: 'words word words' }),
  };
},
```

## 触发器杂项属性

Any field that can return a function (e.g. `infoText`, `alertText`, `alarmText`, `tts`) can also return a localized object, e.g. instead of returning 'Get Out', they can return {en: 'Get Out', fr: 'something french'} instead. Fields can also return a function that return a localized object as well. If the current locale does not exist in the object, the 'en' result will be returned.

Trigger elements are evaluated in this order, and must be listed in this order:

- id
- disabled
- `\y{ObjectId}`：在网络日志行中匹配8位十六进制的角色对象id。
- `\y{AbilityCode}`：匹配 FFXIV ACT Plugin 针对技能或能力生成的数字格式。
- `\y{Timestamp}`：匹配所有日志前端的时间戳，如 `[10:23:34.123]`。
- `\y{LogType}`：匹配 FFXIV ACT Plugin 生成的用于描述日志类型的数字格式，位于每行日志的稍前方。
- condition
- preRun
- delaySeconds
- durationSeconds
- suppressSeconds
- (等待delaySeconds延迟结束)
- promise
- (等待Promise执行完成)
- sound
- soundVolume
- response
- alarmText
- alertText
- infoText
- tts
- run
- outputStrings

## 正则表达式扩展

If you're familiar with regular expressions, you'll note the the `\y{Name}` and `\y{AbilityCode}` are unfamiliar. These are extensions provided by cactbot for convenience to avoid having to match against all possible unicode characters or to know the details of how the FFXIV ACT plugin writes things.

The set of extensions are:

- `\y{Float}`：匹配浮点数，包含某些区域特定的编码。
- `\y{Name}`：匹配任意角色名称 (同样包括 FFXIV ACT Plugin 针对未知名字生成的空字符串)。
- `\y{ObjectId}`：在网络日志行中匹配8位十六进制的角色对象id。
- `\y{AbilityCode}`：匹配 FFXIV ACT Plugin 针对技能或能力生成的数字格式。
- `\y{Timestamp}`：匹配所有日志前端的时间戳，如 `[10:23:34.123]`。
- `\y{LogType}`：匹配 FFXIV ACT Plugin 生成的用于描述日志类型的数字格式，位于每行日志的稍前方。

## 高阶辅助函数

In order to unify trigger construction and reduce the manual burden of translation, cactbot makes widespread use of "canned" trigger elements. Use of these helpers makes automated testing significantly easier, and allows humans to catch errors and inconsistencies more easily when reviewing pull requests.

Currently, three separate elements have pre-made structures defined: [Condition](https://github.com/quisquous/cactbot/blob/main/resources/conditions.ts), [Regex](https://github.com/quisquous/cactbot/blob/main/resources/regexes.ts), [NetRegex](https://github.com/quisquous/cactbot/blob/main/resources/netregexes.ts), and [Response](https://github.com/quisquous/cactbot/blob/main/resources/responses.js). `Condition` functions take no arguments. Almost all `Response` functions take one optional argument, `severity`, used to determine what level of popup text to display to the user when the trigger activates. `Regex`(`NetRegex`) functions can take several arguments [(`gainsEffect()` is a good example)](https://github.com/quisquous/cactbot/blob/dcdf3ee4cd1b6d5bdfb9a8052cc9e4c9b10844d8/resources/regexes.js#L176) depending on which log line is being matched against, but generally a contributor would include the `source`, (name of the caster/user of the ability to match,) the `id`, (the hex ability ID, such as `2478`,) and whether or not the regex should capture the matches (`capture: false`.) `Regex`(`NetRegex`) functions capture by default, but standard practice is to specify non-capturing unless a trigger element requires captures.

A sample trigger that makes use of all these elements:

```javascript
{
  id: 'TEA Mega Holy Modified',
  regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '4A83', capture: false }),
  regexDe: Regexes.startsUsing({ source: 'Prim-Alexander', id: '4A83', capture: false }),
  regexFr: Regexes.startsUsing({ source: 'Primo-Alexander', id: '4A83', capture: false }),
  regexJa: Regexes.startsUsing({ source: 'アレキサンダー・プライム', id: '4A83', capture: false }),
  regexCn: Regexes.startsUsing({ source: '至尊亚历山大', id: '4A83', capture: false }),
  regexKo: Regexes.startsUsing({ source: '알렉산더 프라임', id: '4A83', capture: false }),
  condition: Conditions.caresAboutMagical(),
  response: Responses.bigAoe('alert'),
},
```

While this doesn't reduce the number of lines we need to match the locale regexes, this is far less verbose than:

```javascript
{
  id: 'TEA Mega Holy Modified',
  regex:  / 14:........:Alexander Prime starts using Mega Holy/,
  regexDe: / 14:........:Prim-Alexander starts using Super-Sanctus/,
  regexFr: / 14:........:Primo-Alexander starts using Méga Miracle/,
  regexJa: / 14:........:アレキサンダー・プライム starts using メガホーリー/,
  regexCn: / 14:........:至尊亚历山大 starts using 百万神圣/,
  regexKo: / 14:........:알렉산더 프라임 starts using 지진/,
  condition: function(data) {
    return data.role == 'tank' || data.role == 'healer' || data.CanAddle();
  },
  alertText: {
    en: 'big aoe!',
    de: 'Große AoE!',
    fr: 'Grosse AoE !',
    ja: '大ダメージAoE',
    cn: '大AoE伤害！ ',
    ko: '강한 전체 공격!',
  },
},
```

Use of bare regexes is deprecated. *Always* use the appropriate canned function unless there is a very specific reason not to. Attempting to use a bare regex will cause a build failure when the pull request is submitted. If a bare regex must be used for whatever reason (if, say, a new log line is added to ACT,) pull requests to update `regexes.ts` are strongly encouraged.

(Note that if you are writing triggers for just your personal use, you are free to do what you want. This deprecation applies only to work intended for the cactbot repository.)

Use of canned conditions and responses is recommended where possible, although given Square's extremely talented fight design team, it's not always going to *be* possible.

## Outputs

In order to reduce duplications across trigger sets, cactbot has a set of locale strings that includes text repeatedly used by triggers. When writing triggers, prefer using `Outputs` if possible to avoid duplication.

A simple example using `outputStrings` and `Outputs` as below:

```javascript
{
  id: 'E9S Zero-Form Devouring Dark',
  netRegex: NetRegexes.startsUsing({ id: '5623', source: 'Cloud Of Darkness' }),
  durationSeconds: 4,
  alertText: function(data, matches, output) {
    if (data.me === matches.target)
      return output.tankBusterOnYou();

    if (data.role === 'tank')
      return output.tankSwap();

    if (data.role === 'healer')
      return output.tankBusters({ player: data.ShortName(matches.target) });
  },
  infoText: function(data, _matches, output) {
    if (data.role !== 'tank' && data.role !== 'healer')
      return output.avoidLaser();
  },
  outputStrings: {
    tankBusterOnYou: Outputs.tankBusterOnYou,
    tankBusters: Outputs.tankBusters,
    tankSwap: Outputs.tankSwap,
    avoidLaser: {
      en: 'Avoid Laser',
      de: 'Laser ausweichen',
      fr: 'Évitez le laser',
      ja: 'レーザー注意',
      cn: '躲避击退激光',
      ko: '레이저 피하기',
    },
  },
},
```

## Timeline Info

The trigger subfolders may contain timeline text files in the format defined by ACT Timeline plugin, which described in here: <http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin>

Each timeline file Cactbot uses has to be loaded by a relative directory reference from the given [TRIGGER-FILE].js. Typically the filename for the timeline file will match the name of the trigger file, and for specific encounters the filenames should at least loosely match the zone name.

Cactbot implements some extensions to the original format. These extensions can appear in the file itself or in the `timeline` field in the triggers:

**infotext "event name" before 1** Show a info-priority text popup on screen before an event will occur. The `event name` matches a timed event in the file and will be shown before each occurrence of events with that name. By default the name of the event will be shown, but you may specify the text to be shown at the end of the line if it should be different. The `before` parameter must be present, but can be 0 if the text should be shown at the same time the event happens. Negative values can be used to show the text after the event.

**Example infotext which shows the event name 1s before the event happens** `infotext "event name" before 1`

**Example infotext which specifies different text to be shown earlier** `infotext "event name" before 2.3 "alternate text"`

**Example alert-priority popups using the same parameters** `alerttext "event name" before 1` `alerttext "event name" before 2.3 "alternate text"`

**Example alarm-priority popups using the same parameters** `alarmtext "event name" before 1` `alarmtext "event name" before 2.3 "alternate text"`
