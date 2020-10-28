# 触发器文件格式

## 文件结构

```javascript
[{
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
    { /* ..trigger 1.. */ },
    { /* ..trigger 2.. */ },
    { /* ..trigger 3.. */ },
  ]
},
{
  zoneRegex: /Eureka Hydatos/,
  triggers: [
    { /* ..trigger 1.. */ },
    { /* ..trigger 2.. */ },
    { /* ..trigger 3.. */ },
  ]
}]
```

### 元素

**zoneId** 区域名缩写，用于规定触发器的适用范围。 这些区域名缩写可以在 [zone_id.js](../resources/zone_id.js) 文件中找到。 我们倾向于使用该属性，而非zoneRegex。 每个触发器集合都必须包含zoneId或zoneRegex(但二者不能并存)。

**zoneRegex** 用于匹配区域名称的正则表达式(匹配ACT读取的区域名)。 当正则表达式匹配到当前的区域名，则该集合中的触发器会应用于该区域。

**overrideTimelineFile** 可选属性，使该触发器集合中指定的 `timelineFile` 和 `timeline` 属性覆盖任何先前被读取的同区域的触发器文件。 此属性仅用于用户文件，cactbot本身不使用该值。

**timelineFile** 可选属性，指定当前区域对应的时间轴文件。 这些文件与触发器文件存放在同一文件夹中。 (例如 `raidboss/data/04-sb/raid/`)

**timeline** 可选属性，时间轴的补充行。

**locale** 可选属性，限定触发器仅用于特定语言。如 'en'、'ko'、'fr'。 若该属性未设置，则应用于所有语言。

**replaceText** 键值对，用于时间轴中搜索替换技能名。 对应的技能名会被替换，但 `hideall`、`infotext`、`alerttext`、`alarmtext` 等依旧指向其原名称。 这一属性使我们可以对时间轴文件进行翻译/本地化，不需要直接编辑时间轴文件。

**replaceSync** 键值对，用于时间轴中搜索替换同步正则表达式。 当同步正则表达式包含了本地化名称时，该属性是必要的。

**resetWhenOutOfCombat** 布尔值，默认为true。 该值为真时，时间轴和触发器均在脱战时自动重置。 否则，需要手动调用`data.StopCombat()`使其重置。

## 触发器结构

```javascript
{
  id: 'id string',
  disabled: false,
  // 提示：推荐使用 [regexes.js](https://github.com/quisquous/cactbot/blob/main/resources/regexes.js) 中的工具函数自动生成正则表达式
  netRegex: /trigger-regex-for-network-log-lines/,
  netRegexFr: /trigger-regex-for-network-log-lines-but-in-French/
  regex: /trigger-regex-for-act-log-lines/,
  regexFr: /trigger-regex-for-act-log-lines-but-in-French/,
  condition: function(data, matches) { return true if it should run },
  preRun: function(data, matches) { do stuff.. },
  delaySeconds: 0,
  durationSeconds: 3,
  suppressSeconds: 0,
  promise: function(data, matches) { return promise to wait for resolution of },
  sound: '',
  soundVolume: 1,
  response: Responses.doSomething(severity),
  alarmText: {en: 'Alarm Popup'},
  alertText: {en: 'Alert Popup'},
  infoText: {en: 'Info Popup'},
  tts: {en: 'TTS text'},
  run: function(data, matches) { do stuff.. },
},
```

### 触发器元素

**id string** 字符串，触发器id。 所有cactbot的内置触发器均包含一个独一无二的id， 同样推荐在用户自定义触发器中包含该属性，但不是必要属性。

触发器id不可重复。 若某个触发器的id与另一个触发器完全一致， 则原有的同id的触发器会被完全忽略， 该触发器会覆盖并替代原有的触发器。 这个机制让用户可以方便地复制粘贴触发器代码，以修改为他们自己喜欢的方式。 没有id的触发器无法被覆盖。

当前的 `Regexes/NetRegexes` 结构并不要求将技能名/效果名等名称作为正则表达式的一部分。 因此，将辅助信息写在旁边尤为重要。 对此的推荐方式是将效果名/技能名/NPC名称等写进触发器id， 或者在旁边撰写详尽的注释并包含这些名称。 仅仅依赖触发器本体的上下文信息并不足以了解其用处。 (与id一样，仅针对提交到cactbot仓库的触发器提出这些补充信息的要求。)

**disabled: false** 若该值为真，则该触发器将被完全禁用/忽略。 默认为false。

**netRegex / regex** 正则表达式，cactbot会将该正则表达式与每一条日志行做比对， 并触发可以匹配的触发器。 `netRegex` 版本用于匹配网络日志行， 而 `regex` 版本用于匹配普通的ACT日志。

更加准确地说，相对于“直白”的正则表达式，我们更加推荐使用正则替换函数。 定义在 [regexes.js](https://github.com/quisquous/cactbot/blob/main/resources/regexes.js) 和 [netregexes.js](https://github.com/quisquous/cactbot/blob/main/resources/netregexes.js) 中的辅助函数 使用传入参数进行匹配，若对应的参数未定义，则可以通过匹配组提取字符串。 自此，函数可以自动构建可以匹配对应日志行的正则表达式。 顾名思义，`netRegex` 使用 `NetRegexes` 辅助函数， 而 `regex` 使用 `Regexes` 辅助函数。

**netRegexFr / regexFr** 正则表达式，但该正则表达式仅用于 fr 语言。 若设置了 `Options.ParserLanguage == 'fr'`，则 `regexFr` (如果存在的话) 优先于 `regex` 对日志行进行匹配。 否则，该值将会被忽略。  这只是针对法语的例子，你也可以使用其他的。例如：regexEn, regexKo。 就像 `netRegex` 对于 `regex` 一样， `netRegexFr` 匹配法语的网络日志行 而 `regexFr` 匹配法语的ACT日志行。

语言区域并没有指定的优先级。 尽管一般情况下我们会使用 `de`、`fr`、`ja`、`cn`、`ko` 的顺序。 同样，与其使用 `正则表达式`，当前的最佳实践是使用正则表达式替换函数。

(理论上，以后我们可能不再需要独立的语言特定正则表达式。 相反，我们可以采用 `timelineReplace` 对象自动地替换这些正则表达式。 我们还没有确定具体的实现方式，但条条大路通罗马。)

**condition: function(data, matches)** 当函数返回 `true` 时激活该触发器。 若返回的不是 `true`，则不会有任何响应。 当触发器定义了多个函数，这个函数总是第一个执行。 ([conditions.js](https://github.com/quisquous/cactbot/blob/main/resources/conditions.js) 中定义了一部分高阶条件函数。 一般情况下，如果与情境相符，使用这些函数是最佳解决方案。)

**preRun: function(data, matches)** 当触发器被激活时，该函数会在条件判定成功后立刻执行。

**promise: function(data, matches)** 设置该属性为返回Promise的函数，则触发器会在其resolve之前等待。 这个函数会在 `preRun` 之后执行，在计算 `delaySeconds` 之前等待。

**delaySeconds** 一定的时间长度，单位为秒，在触发器激活后等待一段时间。 其值可以是数字或返回数字的 `function(data, matches)`。

**durationSeconds** 时间，单位为秒，显示触发器文本的时长。 其值可以是数字或返回数字的 `function(data, matches)`。 若该值未设置，默认为3。

**suppressSeconds** 等待时间，单位为秒，重新触发该触发器的冷却时间。  其值可以是数字或返回数字的 function(data, matches)。  该时间从正则表达式匹配之时开始计算，并且不受 delaySeconds 设置与否的影响。 当设置了此元素的触发器被激活后，它在这段时间内无法再次被激活，直到时间结束。

**sound** 用于播放声音的音频文件，也可以是 'Info'，'Alert'，'Alarm' 或者 'Long'。 文件路径是对于 ui/raidboss/ 文件夹的相对路径。

**soundVolume** 从0到1的音量数值，触发器激活时播放的音量大小。

**response** 用于返回 infoText/alertText/alarmText/tts 的快捷方法。 这些函数定义于 `resources/responses.js`。 Response 的优先级比显式指定的文字或TTS低，因此可以被覆盖。 (如同 `regex` 和 `condition` 一样，[responses.js](https://github.com/quisquous/cactbot/blob/main/resources/responses.js) 存在一部分便于使用的高阶函数。)

**alarmText** 当触发器激活时显示“警报”级别的文本。 该属性一般用于高危事件，如处理失败会致死的机制、会导致团灭的机制，或处理失败会导致通关变得更加困难的机制等。 (例如T2的亚拉戈病毒，T7的诅咒之嚎，或是O7s里奥尔特罗斯先生的石肤等。 ) 其值可以是字符串或返回字符串的 `function(data, matches)`。

**alertText** 当触发器激活时显示“警告”级别的文本。 该属性一般用于中危事件，如处理失败可能会致死的机制、会造成全队伤害或全队Debuff的机制等等。(例如，针对坦克的死刑预告，或针对全队的击退预告等。) 其值可以是字符串或返回字符串的 `function(data, matches)`。

**infoText** 当触发器激活时显示“信息”级别的文本。 该属性一般用于低优先级的事件，不需要玩家立即做出反应。 (例如，小怪出现时的警告，或针对治疗职业的全体伤害预告等等。) 其值可以是字符串或返回字符串的 `function(data, matches)`。

**tts** 字符串，用于输出TTS的另一种方式。 该值可以是包含本地化字符串的对象，与触发器文本类似。

**run: function(data, matches)** 当触发器被激活时，该函数会作为触发器最末尾的步骤执行。

## 触发器杂项属性

任何元素都可以返回一个函数 (如 `infoText`、`alertText`、`alarmText` 和 `tts`)， 也可以返回一个含有本地化字符串的对象，例如不仅仅返回英语的'Get Out'，还可以这样子： {en: 'Get Out', fr: 'something french'} 。  当然，其值也可以是返回本地化字符串对象的函数。  若当前的区域语言不存在于该对象中，则会返回 en 的值。

触发器元素的运行顺序如下，同时，该顺序也是定义触发器对象时的顺序：

- id
- disabled
- netRegex (以及 netRegexDe、netRegexFr 等等)
- regex (以及 regexDe、regexFr 等等)
- beforeSeconds (仅存在于 timelineTriggers 中)
- (休眠的触发器会在此处直接退出)
- condition
- preRun
- delaySeconds
- durationSeconds
- suppressSeconds
- (delaySeconds 在此处计时完毕)
- promise
- (等待Promise执行完成)
- sound
- soundVolume
- response
- alarmText
- alertText
- infoText
- groupTTS
- tts
- run

## 正则表达式扩展

若您对正则表达式已经轻车熟路， 您可能对于 `\y{Name}` 和 `\y{AbilityCode}` 感到陌生。 这些是cactbot提供的便捷扩展， 不需要针对所有可能出现的Unicode字符撰写正则表达式， 也不需要完整学习 FFXIV ACT Plugin 的输出格式。

目前可用的扩展名如下所示：

- `\y{Float}`：匹配浮点数，包含某些区域特定的编码。
- `\y{Name}`：匹配任意角色名称 (同样包括 FFXIV ACT Plugin 针对未知名字生成的空字符串)。
- `\y{ObjectId}`：在网络日志行中匹配8位十六进制的角色对象id。
- `\y{AbilityCode}`：匹配 FFXIV ACT Plugin 针对读条技能或能力技生成的数字格式。
- `\y{Timestamp}`：匹配所有日志前端的时间戳，如 `[10:23:34.123]`。
- `\y{LogType}`：匹配 FFXIV ACT Plugin 生成的用于表达日志类型的数字格式，位于每行日志的稍前方。

## 高阶辅助函数

为统一触发器构造，以及减轻翻译时的手动负担， cactbot的触发器元素广泛运用了高阶函数。 诸如此类的工具函数使自动化测试更为简单， 并让人们在审查拉取更改时更容易捕获错误及不一致。

目前我们拥有的预定义独立元素如下所示： [Condition](https://github.com/quisquous/cactbot/blob/main/resources/conditions.js)、[Regex](https://github.com/quisquous/cactbot/blob/main/resources/regexes.js) 以及 [Response](https://github.com/quisquous/cactbot/blob/main/resources/responses.js)。 `Condition` 函数不接受参数。 几乎所有的 `Response` 都接受一个参数，称为 `severity`， 用于定义触发器被激活时输出的警报文本的等级。 `Regex` 函数根据匹配的日志行，接受若干数量参数 [(`gainsEffect()` 可作为例子)](https://github.com/quisquous/cactbot/blob/dcdf3ee4cd1b6d5bdfb9a8052cc9e4c9b10844d8/resources/regexes.js#L176)， 但一般情况下，构造函数接受 `source` 属性 (技能的咏唱者/释放者的名称)， `id` 属性 (十六进制的技能ID，例如 `2478`)， 以及正则表达式是否要捕获匹配组 (`capture: false`)。 `Regex` 函数默认开启捕获，但标准实践中应当仅针对需要读取捕获组数据的触发器开启捕获。

以下是使用了这三种元素的示例触发器：

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

尽管由于我们需要定义所有语言的正则表达式，该方法并未减少代码行数，但仍然远远优于：

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
    cn: '大AoE伤害！',
    ko: '강한 전체 공격!',
  },
},
```

正则表达式字面量的方式已被废弃。 *请务必*使用上述的高阶函数生成对应的正则表达式，除非您有特别的原因必须要这样做。 目前在拉取请求发布时使用正则表达式字面量会导致构建失败。 当的确存在特定的需求，不得不使用正则表达式字面量时 (例如ACT新增了其他类型的日志行)， 我们强烈推荐开启一个拉取请求，直接更新 `regexes.js` 文件。

(当然，若您正在撰写仅用于您个人的触发器，您可以随意发挥。 此处的警告仅针对想为cactbot项目提交贡献的人们。)

若程序中可以使用在conditions和responses中定义的高阶函数时，直接使用这些函数是推荐的做法。然而对SE的战斗天才设计组来说，这个方法也不*是*通用的。

## 关于时间轴

触发器子目录内可能包含了一部分采用 ACT Timeline 插件格式定义的时间轴文本文件，您可以通过此链接了解： <http://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin>

Cactbot的每一个时间轴文件均由同文件夹下某个对应的 [TRIGGER-FILE].js 加载。 通常情况下，时间轴文件的名称需与触发器文件一致，同时此文件名应当至少与副本区域名称可以一一对应，即不具有歧义。

Cactbot在原基础上实现了一部分扩展语法。 扩展语法可以在文本文件内或 `timeline` 属性中使用。

**infotext "event name" before 1** 在某个事件发生之前显示一个信息警报文本。 `event name` 与文件中的某个特定时间的事件名称匹配，并且在此事件发生前均会显示指定文本。 默认显示的文本为事件名称，但若您需要显示其他文本，添加指定文本至行末即可。 `before` 参数是必填项，但您可以将其设置为0，则文本显示时间会与事件发生的时间相同。 当您需要使文本在时间之后显示，也可以设置负值。

**例子：在事件发生前1秒时显示信息警报** `infotext "event name" before 1`

**例子：在事件发生更早时间显示的信息警报，并修改了默认文本** `infotext "event name" before 2.3 "alternate text"`

**例子：与前述同事件名的警告文本** `alerttext "event name" before 1` `alerttext "event name" before 2.3 "alternate text"`

**例子：与前述同事件名的警报文本** `alarmtext "event name" before 1` `alarmtext "event name" before 2.3 "alternate text"`
