# 时间轴指南

本指南旨在解释时间轴文件，主要基于cactbot的格式。

![导入屏幕截图](../images/timelineguide_timeline.png)

cactbot在 [raidboss模块](https://github.com/quisquous/cactbot#raidboss-module) 中定义触发器和时间轴。 这两者是紧密结合的，因此您既可以基于技能编写触发器， 也可以基于时间轴编写触发器。

## 目录

* [历史](#历史)
* [时间轴文件语法](#时间轴文件语法)
  * [注释](#注释)
  * [条目](#条目)
  * [指令](#指令)
  * [示例](#示例)
  * [测试](#测试)
  * [Shasta Kota的指南](#shasta-kota的指南)
* [Cactbot样式指南](#cactbot样式指南)
* [基于时间轴的触发器](#基于时间轴的触发器)
* [时间轴注入](#时间轴注入)
* [时间轴翻译](#时间轴翻译)
* [创建时间轴示例](#创建时间轴示例)
  * [多次攻略副本](#多次攻略副本)
  * [软件需求](#软件需求)
  * [时间轴基础骨架](#时间轴基础骨架)
  * [生成初始时间轴文件](#生成初始时间轴文件)
  * [构建循环](#构建循环)
  * [添加战斗阶段](#添加战斗阶段)
  * [下一个阶段](#下一个阶段)
  * [最终阶段](#最终阶段)
  * [样板附注](#样板附注)
  * [循环循环](#循环循环)
  * [珠联璧合](#珠联璧合)
  * [测试时间轴](#测试时间轴)
  * [测试其他时间轴](#测试其他时间轴)

## 历史

2016年，Shasta Kota在the Death and Taxes网站上发布了一篇 [指南](https://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin) 讲解如何使用anoyetta的 [ACT timeline 插件](https://github.com/anoyetta/ACT.Hojoring)。 此插件现在已经成为了Hojoring的一部分。

在anoyetta之前也有过一个更旧 [kaizoban](https://github.com/090/act_timeline/releases) 版本，有一部分玩家也曾使用过该插件。

cactbot的时间轴文件原本设计要向后兼容这些文件格式， 因此cactbot的扩展语法需要通过触发器文件注入。

## 时间轴文件语法

时间轴文件的每一行都会被当作时间轴的条目。 条目之间没有绝对的顺序。 时间轴文件中按一定顺序排列仅仅是方便读者阅读而已。

### 注释

任何一行中，`#` 符号用于定义注释。 其后的所有内容均会被忽略。

### 条目

以下是一些时间轴条目的语法示例。 每一行的条目均以事件时间和事件名称开始。

`数字 "字符串" (duration 数字)`

`数字 "字符串" sync /正则/ (window 数字,数字) (jump 数字) (duration 数字)`

此处的括号表示可选部分，并不是语法的组成部分。

数字可以是整数，如 `34`；也可以是浮点数，如 `84.381`。

字符串一般为事件名，如 `"坠落"` 或 `"双重攻击"`。

正则是一个标准的 [Javascript 正则表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)。

事件时间与事件名称永远在最前方，但 `window`、`jump`、`duration`、以及 `sync` 并没有明确的顺序规定。 但是在代码规范里，sync通常放在前面。

`duration 数字` 规定了显示该技能的时间长度，单位为秒。 通常情况下，时间轴条目在倒数到0后会立刻消失。但有时需要表示一个正在释放或持续释放的技能时，便可使用此参数，例如要使用单行条目表示五次连续的巴哈姆特之爪时， 您就可以使用 `duration` 参数规定显示时间长度。 这个语法不需要配合sync属性。

`window 数字,数字` 规定了同步的时间范围。 若 `window` 未设置，cactbot默认将其视同为设置了 `window 2.5,2.5`。  也就是，相对于当前事件时间的前2.5秒至后2.5秒之间。 例如，对于此时间轴条目：`3118.9 "Lancing Bolt" sync /:Raiden:3876:/`， 当正则表达式`/:Raiden:3876:/` 在 3116.4 到 3121.4 之间的任意时间点被匹配到时，时间轴会同步并回溯至 3118.9。 时间轴通常在独一无二的技能上使用较大的window值， 以确保时间轴即使在战斗中启动也可以正确地同步到正确的位置。

`jump 数字` 告诉时间轴在匹配sync成功时跳转至指定的时间点。 跳转至0意味着停止时间轴。 通常用于阶段跳转或循环。 尽管我们一般跳转至时间轴中已有的其他条目的时间点， 但并不意味着一定要跳转到已有条目的时间点。

### 指令

您可以使用 `hideall` 隐藏某个事件。 绝大多数时间轴都会定义 `hideall "--sync--"` 来隐藏与游戏战斗阶段同步化的条目，因为玩家没有必要看到这些控制性条目。

此外还有一些基于时间轴条目的用于生成警报文本的指令。 该指令尽管目前依旧支持，但文档中并没有记载， 因为在cactbot中您应当使用 [基于时间轴的触发器](#timeline-triggers) 来实现此需求。

### 示例

```bash
677.0 "Heavensfall Trio"
1044 "Enrage" # ???
35.2 "Flare Breath x3" duration 4
1608.1 "Petrifaction" sync /:Melusine:7B1:/ window 1610,5
1141.4 "Leg Shot" sync /:Mustadio:3738:/ duration 20
# 这是一个注释
hideall "--sync--"

28.0 "Damning Edict?" sync /:Chaos:3150:/ window 30,10 jump 2028.0
524.9 "Allagan Field" sync /:The Avatar:7C4:/ duration 31 jump 444.9
1032.0 "Control Tower" duration 13.5 sync /:Hashmal, Bringer Of Order starts using Control Tower on Hashmal/ window 20,20 # 从开始读条到塔坠落
```

### 测试

在cactbot中运行 `npm run test` 会在node中执行 **test/check_timelines.js** 以验证语法。

### Shasta Kota的指南

您也可以阅读Shasta Kota的原版 [指南](https://dtguilds.enjin.com/forum/m/37032836/viewthread/26353492-act-timeline-plugin)， 它至今看来仍然十分优秀。

## Cactbot样式指南

以下是cactbot中对于时间轴的推荐方案：

* 为所有可能发生的事件添加同步正则
* 总是添加Engage!(战斗开始！) 的独立条目，但仍然需要添加同步正则，以防玩家没有使用倒计时。
* 若Boss的第一个技能是自动攻击，应把该自动攻击添加为独立条目以启动时间轴。 (需要注意的是，有的Boss的自动攻击的技能名并不是“攻击”)
* 在顶部的注释中添加用于生成时间轴的命令行参数
* 添加同步正则时，除非同步NPC台词是唯一的可行方式，否则应当优先考虑技能。
* 当用NPC台词同步阶段时，应当为下一个技能添加一个较大的window值
* 同步正则尽可能短
* 尽可能使用游戏中的原名
* 循环应当使用 `jump`，而不是给循环的技能设定较大的window
* 适当换行和注释以提升时间轴的可读性
* 触发器/TTS/提示文本应当与时间轴分离
* 使用 [基于时间轴的触发器](#timeline-triggers) 来显示提示文本
* 出现循环时，应额外在循环后方添加至少30秒的后续时间轴
* 将7秒内发动的技能的同步正则注释在后方 (使将来的维护人员可以很方便地获知技能ID)

### 触发器文件名

通常触发器的文件名应与玩家社区对此副本的称呼一致。 讨伐战一般以Boss名字称呼， raid则通常是带有数字的缩写， 而迷宫挑战通常采用副本区域名称。

文件名中应使用下划线分割单词。 讨伐战中的 `nm` (假神)，`hm` (真神) 与 `ex` (极神)， 则以减号分割。 高难度迷宫挑战的名字中应当写出完整的单词“hard”。 冠词如 `The` 可以省略。 Raid通常会有一定顺序的数字称呼。 例如 `t1` 到 `t13` 以及 `a1s` 到 `a12s` 等。 零式讨伐通常需要加上 `s` 后缀， 而普通难度则采用'n'后缀。 (然而，众所周知巴哈姆特大迷宫里部分层没有零式难度。)

示例:

* 魔法宫殿宇宙宫(The Grand Cosmos): `grand_cosmos`
* 泰坦歼殛战(Titan Extreme): `titan-ex`
* 红宝石神兵狂想作战(Ruby Weapon Extreme): `ruby_weapon-ex`
* 秘本宝库迦巴勒幻想图书馆(The Great Gubal Library (Hard)): `great_gubal_library_hard`
* 欧米茄零式时空狭缝 西格玛幻境2(Sigmascape V2.0 (Savage)): `o6s`
* 亚历山大机神城 启动之章3(Alexander - The Arm of the Father): `a3n`
* 巴哈姆特大迷宫 真源之章4(The Final Coil of Bahamut): `t13`

## 基于时间轴的触发器

Cactbot的触发器文件支持添加基于时间轴的触发器。 这是由于人们对于默认启用的触发器有特定的偏好， cactbot时间轴语法扩展又与其他时间轴插件不兼容， 所以cactbot在触发器文件中添加了基于时间轴的触发器的功能。

您只需要添加 `timelineTriggers` 至触发器文件即可。

示例:

* [乐欲之所瓯博讷修道院](https://github.com/quisquous/cactbot/blob/main/ui/raidboss/data/04-sb/alliance/orbonne_monastery.js)
* [T9](https://github.com/quisquous/cactbot/blob/main/ui/raidboss/data/02-arr/raid/t9.js)
* [O12 普通难度](https://github.com/quisquous/cactbot/blob/main/ui/raidboss/data/04-sb/raid/o12n.js)

这些触发器和普通的触发器拥有 [相同的语法](https://github.com/quisquous/cactbot/blob/main/ui/raidboss/data/README.txt)。 这意味着您依旧可以使用函数，返回任何您想要的东西。 您也可以使用 [condition](https://github.com/quisquous/cactbot/blob/5a7011c662d65f44c12c2fbff255484f2d31b8ef/ui/raidboss/data/02-arr/raid/t9.js#L10)，使其仅针对特定职业/职能激活。

但是，他们之间仍然有一些区别：

例如 `regex` 部分不能翻译，而且必须与时间轴文件中的某个条目完全一致。 也就是说，它需要匹配时间轴的某一行中用双引号括起来的技能名。 函数中的 `matches` 参数也返回此名字。

此触发器还支持 `beforeSeconds` 参数， 使您可以指定触发器相对于技能提前提示的时间。

## 时间轴注入

理论上经过精心构造的时间轴适用于任何人。 但是，有时候人们想要隐藏时间轴的某些部分，或者添加一些其他项。

Cactbot默认并不包含这些配置，这个功能更适合用户自行配置。

触发器文件有一个名为 `timeline` 的参数入口， 这是一个数组，其中元素会添加到时间轴中。 若元素都是字符串，则会直接添加。 若元素是函数，那么cactbot会调用该函数，并添加其返回值至时间轴中。 (但是传入函数的 `data` 参数仅仅包含了玩家的职能和职业，不包含其他参数。)

测试时间轴可以在盛夏农庄通过倒计时或对木人行礼后触发。  另行参见：[test.js](https://github.com/quisquous/cactbot/blob/79239abda888dd7a277da0501a7d4ac60d8cf963/ui/raidboss/data/triggers/test.js#L10)。

您也可以在 **cactbot/user/raidboss.js** 文件中添加定制化的时间轴和触发器。  另行参见：[user/raidboss.js](https://github.com/quisquous/cactbot-user/blob/641488590e3ea499cc3b54cc9f2f2f856dee4ad8/raidboss.js#L28)。

## 时间轴翻译

为支持多语言，cactbot的触发器文件中支持 `timelineReplace` 参数集。 [o12s.js](https://github.com/quisquous/cactbot/blob/ecbb723f097328c7bd0476352e5135bd5f776248/ui/raidboss/data/triggers/o12s.js#L608) 是一个不错的例子。 该文件的参数集中包含了许多用于替换同步正则、文字和效果名的正则表达式。 这有两个目的：

其一是为了让工具软件能为触发器自动生成正则表达式翻译。

其二是为了能在运行中动态替换时间轴文字和正则。 cactbot会使用 `replaceSync` 参数集自动替换 `sync /text`/ 中的任意文字， 同样地，`replaceText` 参数集则用于自动替换技能名文字。

正则表达式仅匹配上述定义的部分文字，不匹配整行。 因此您需要格外注意，替换的正则表达式可能匹配到非预期的元素导致翻译错误。

## 创建时间轴示例

这里有一个例子，展示了如何使用cactbot提供的工具制作里塔提恩强攻战的时间轴。 这个副本的逻辑非常简单，而且可以单人进行测试，是一个绝佳的实例副本。

### 多次攻略副本

制作时间轴的第一步是生成一些ACT日志。

您也可以通过fflogs的通关记录生成时间轴，但这个方式会丢失许多日志行， 例如NPC台词、区域封锁/解锁的提示文本以及对象实体刷新信息。

当您攻略副本之后，您可以获得一些 [网络日志文件](LogGuide.md#network-log-lines)。

找到对应的副本攻略记录，点击 **Raw**，然后右键选择 **Save As**，将其保存到磁盘上。

要获得一份好的日志，你应当：

1. 尽量延长攻略时间，直到狂暴
1. 带足够的队员以看到所有机制 (例如 t11 中连线机制至少要两人才出现)
1. 对于每个阶段，拖够时间直到看到机制循环
1. 攻略多次以便于之后的测试

### 软件需求

* [Python 3](https://www.python.org/downloads/release/python-373/)
* 一份cactbot的 [源代码](https://github.com/quisquous/cactbot/archive/main.zip)拷贝

安装Python 3时，推荐为该系统上的所有用户安装， 这是因为此安装方式会将Python写入Windows的PATH变量中， 使您可以从命令提示符方便地运行Python。

### 时间轴基础骨架

在cactbot中创建时间轴有三大步骤。

(1) 创建一个空文件。

新建一个文本文件名为 **ui/raidboss/data/timelines/cape_westwind.txt**。 内容保持空白即可。

(2) 若没有触发器文件，则新建一个。

新建 **ui/raidboss/data/02-arr/trial/cape_westwind.js**。 此文件可任意命名。 时间轴文件仅能被触发器文件加载， 因此触发器文件总是必须的。

最初的触发器文件应当如下所示：

```javascript
'use strict';

[{
  zoneId: ZoneId.CapeWestwind,
  timelineFile: 'cape_westwind.txt',
  triggers: [
  ],
}];
```

(3) 更新manifest文件。

在 **ui/raidboss/data/manifest.txt** 文件中添加您所新建的触发器文件与时间轴文件的路径。

(4) 重载raidboss悬浮窗

若您已经对这些文件进行了修改，则可以通过重载cactbot的raidboss悬浮窗以应用更改。

### 生成初始时间轴文件

在你拿到网络日志文件后，您应该找到战斗的开始与结束时间点。

[在ACT中查看日志](LogGuide.md#viewing-logs-after-a-fight)，找到开始与结束。

![战斗记录截图](images/timelineguide_encounterlogs.png)

例如，对于此战斗记录，您可以看到与之关联的日志行与时间。

```log
[18:42:23.614] 15:105E5703:Potato Chippy:2E:Tomahawk:4000EE16:Rhitahtyn sas Arvina:710003:9450000:1C:2E8000:0:0:0:0:0:0:0:0:0:0:0:0:140279:140279:8010:8010:1000:1000:-707.8608:-822.4221:67.74045:3858:74095:4560:0:1000:1000:-693.7162:-816.4633:65.55687:
[18:49:22.934] 19:Rhitahtyn Sas Arvina was defeated by Potato Chippy.
```

(已知缺陷：有时处理来自于他人的网络日志时可能需要转换时差。  欢迎补充相关代码。)

基于这些时间，您可以通过下面的命令生成时间轴。

```bash
python util/make_timeline.py -f CapeWestwind.log -s 18:42:23.614 -e 18:49:22.934

0 "Start"
2.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
10.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
19.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
24.4 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/
29.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
38.4 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
46.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
52.2 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/
57.7 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
66.2 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
74.7 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
80.2 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/
85.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
94.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
102.5 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
106.1 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
110.4 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
114.9 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
119.2 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
123.5 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
127.8 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
132.1 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
136.4 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
140.7 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
145.2 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
149.8 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
154.3 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
158.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
163.3 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
167.8 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
172.3 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
175.8 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/
179.3 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
184.5 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
189.0 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
193.7 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
195.9 "Fast Blade" sync /:7th Cohort Optio:2CD:/
196.1 "Fast Blade" sync /:7th Cohort Optio:2CD:/
198.2 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
202.7 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
202.9 "Fast Blade" sync /:7th Cohort Optio:2CD:/
203.3 "Fast Blade" sync /:7th Cohort Optio:2CD:/
207.2 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
207.6 "Rampart" sync /:7th Cohort Optio:0A:/
210.0 "Fast Blade" sync /:7th Cohort Optio:2CD:/
211.7 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
212.6 "Shield Bash" sync /:7th Cohort Optio:2CE:/
214.3 "Fast Blade" sync /:7th Cohort Optio:2CD:/
214.9 "Fight Or Flight" sync /:7th Cohort Optio:14:/
216.2 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
217.3 "Rampart" sync /:7th Cohort Optio:0A:/
218.0 "Celeris" sync /:7th Cohort Optio:194:/
220.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
222.0 "Fight Or Flight" sync /:7th Cohort Optio:14:/
225.2 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
226.3 "Fast Blade" sync /:7th Cohort Optio:2CD:/
229.9 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
234.4 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
239.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
243.4 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
259.1 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
263.6 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
267.9 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
269.1 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/
274.2 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
278.5 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
282.8 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
299.3 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
303.8 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
308.1 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
309.3 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/
314.4 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
318.7 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
323.0 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
339.5 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
344.0 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
348.3 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
349.5 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/
354.6 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
358.9 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
363.2 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
378.7 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
383.2 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
387.5 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
388.7 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/
393.8 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
398.1 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
402.4 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
```

(注意：您也可以通过 `-lf` 列出网络日志中所有的独立战斗记录。

```bash
python make_timeline.py -f CapeWestwind.log -lf
1. 02:03:44.018 02:16:53.632 Cape Westwind
2. 18:32:52.981 18:36:14.086 Cape Westwind
3. 18:42:23.614 18:49:22.934 Cape Westwind
4. 18:57:09.114 19:10:13.200 Cape Westwind
5. 19:29:42.265 19:36:22.437 Cape Westwind
6. 19:40:20.606 19:46:44.342 Cape Westwind
```

基于此，您可以加上战斗记录id然后重新运行命令，比如`-lf 3`。)

当然，此时间轴仍无法使用，但是千里之行，始于足下。 将输出粘贴至**ui/raidboss/data/timelines/cape_westwind.txt**。

若您正在使用的终端是Windows的命令提示符或者MINGW32， 则您可以点击窗口左上方的图标， 然后分别点击**编辑** -> **标记**。 然后您可以用鼠标选择文本，被选中的文本会高亮显示。 按下回车键后选中的文本会复制到剪贴板，然后您就可以随意粘贴了。

![标记截图](images/timelineguide_copy.png)

应当注意的是，日志中来自于小怪的无用日志行不胜枚举。 大多数情况下，我们不可依赖小怪的时间去推测Boss的机制， 因此通常我们会移除小怪的相关日志。

make_timeline.py 脚本支持两个选项以提供此功能。 其一为“忽略实体”，其一为“忽略id”。 如 `-ic "7Th Cohort Optio"` 或 `-ii 0A 2CD 2CE 194 14` 就可以隐藏这些技能。 我们在这里使用忽略id的功能。

重新运行命令，这次带上忽略id的选项： `python util/make_timeline.py -f CapeWestwind.log -s 18:42:23.614 -e 18:49:22.934 -ii 0A 2CD 2CE 194 14`

您最好再次阅览生成的时间轴，以确认是否还有小怪的日志行。 我们通常要手动添加 [added combatant (添加实体)](LogGuide.md#03-addcombatant) 或用于匹配的NPC话语的 [game log lines (游戏日志行)](LogGuide.md#00-logline)。 您可以自己研究如何将其添加进时间轴中。 (欢迎向 **make_timeline.py** 贡献代码以自动实现这一步骤。)

相关日志如下所示：

```log
[18:45:27.041] 03:Added new combatant 7Th Cohort Optio.  Job: 0 Level: 49 Max HP: 24057 Max MP: 8010 Pos: (-665.5159,-804.6631,62.33055).
[18:45:27.041] 03:Added new combatant 7Th Cohort Optio.  Job: 0 Level: 49 Max HP: 24057 Max MP: 8010 Pos: (-665.5013,-807.1013,62.45256).
[18:42:24.000] 00:0044:Rhitahtyn sas Arvina:I will suffer none to oppose Lord van Baelsar!
[18:44:08.000] 00:0044:Rhitahtyn sas Arvina:My shields are impregnable! Join the countless challengers who have dashed themselves against them!
[18:46:27.000] 00:0044:Rhitahtyn sas Arvina:Your defeat will bring Lord van Baelsar's noble conquest one step closer to fruition!
[18:48:27.000] 00:0044:Rhitahtyn sas Arvina:Ungh... Though it cost me my life...I will strike you down!
```

您可以将其出现的时间与战斗开始时间相减，即可得到正确的相对时间。 对于此实例，小怪出现在183.5秒 (通过 18:45:27.041 - 18:42:23.614 得到)。

### 构建循环

下一步是在每个阶段内构建循环。 观察可得，此处有若干个不同阶段。

这是我们的初始阶段划分，此处加了一些空行以便清晰的分辨。

```bash
2.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
10.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
19.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
24.4 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/

29.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
38.4 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
46.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
52.2 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/

57.7 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
66.2 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
74.7 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
80.2 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/
```

可以看出来，这里的循环长度大约在27.8到27.9之间。 我们假定它是27.8吧。

对于构建循环，我们有个优秀的工具**util/timeline_adjust.py**。 这个脚本可以遍历整个时间轴文件，并以可正可负的一定偏移值调整时间轴， 最后将调整后的时间轴输出。 (注意：该脚本不会调整jump。)

下面是通过该脚本调整后的时间轴的一部分：

```bash
python util/timeline_adjust.py --file=ui/raidboss/data/timelines/cape_westwind.txt --adjust=27.8

29.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
38.4 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
46.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
52.2 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/

57.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
66.2 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
74.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
80.0 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/

85.5 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
94.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
102.5 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
108.0 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/
```

相比于原本的时间轴，该循环已经接近完美。 第一个循环非常完美，但第二个则略有一点偏移， 这里调整后的时间为57.6、74.6、80.0， 但原本是57.7、74.7、80.2。  虽然不够完美，但已经很接近了。

在cactbot中，有一个配置窗口可以设置显示多久之后的时间轴。  默认是30秒，因此您应额外在循环后方添加至少30秒的后续时间轴。

那么第一阶段的最终版本就完成了。

注意，我们倾向于使用 **timeline_adjust.py** 生成的时间，而不是原本的时间。 这样我们从52.2跳转到24.4的时候，时间差依旧是正确的。  每次 `Gate Of Tartarus` 释放后5.4秒总会出现 `Shield Skewer`。

之后我们会添加jump。现在它如下所示：

```bash
2.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
10.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
19.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
24.4 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/

29.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
38.4 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
46.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
52.2 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/

57.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
66.2 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
74.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
80.0 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:471:/
```

### 添加战斗阶段

Now on to the second phase. From observation, it's clear that at 80% the boss does some rp text and then starts doing some different abilities.

Unfortunately for us, it looks like the boss starts phase 2 by doing another `Shield Skewer` which it does a lot of in phase 1, so it won't be easy to sync to that.

**make_timeline.py** has an option to move the first usage of an ability to a particular time. As cactbot usually has a window of 30 seconds ahead, feel free to generously move phases ahead in time.

Let's move phase 2 to start its first ability at time=200. Since `Shrapnel Shell` starts 4.3 seconds after that, let's adjust the first usage of `Shrapnel Shell` (ability id 474) to time=204.3.

Here's the new command line we've built up to: `python util/make_timeline.py -f CapeWestwind.log -s 18:42:23.614 -e 18:49:22.934 -ii 0A 2CD 2CE 194 14 -p 474:204.3`

This gets us the following output for phase 2, with manually added blank lines to break out the loops.

```bash
# manually added in
199.0 "--sync--" sync /00:0044:[^:]*:My shields are impregnable/
200.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/

# output of make_timeline
204.3 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
208.8 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
213.1 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

217.4 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
221.7 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
226.0 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
230.3 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

234.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
239.1 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
243.7 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
248.2 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

252.7 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
257.2 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
261.7 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
266.2 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
```

It looks like there's a clear loop here, where every iteration of the loop has 2x `Firebomb` and 2x `Shield Skewer`. The loop time is 34.6.  Time to break out **timeline_adjust.py** again.

Running `python util/timeline_adjust.py --file=ui/raidboss/data/timelines/cape_westwind.txt --adjust=27.8`, the relevant output is:

```bash
234.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
238.9 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
243.4 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
247.7 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

252.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
256.3 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
260.6 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
264.9 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
```

This has diverged a fair bit from the original times, with the last Firebomb being 264.9 vs 266.2. If you want to be more precise, this is where you would compare against some other runs.

However, this is good enough for Cape Westwind, so we will replace the second loop with this output from **timeline_adjust.py**.

The current state of our timeline is now:

```bash
0 "Start"
2.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
10.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
19.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
24.4 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/

29.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
38.4 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
46.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
52.2 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/

57.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
66.2 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
74.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
80.0 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/

# 80%
199.0 "--sync--" sync /00:0044:[^:]*:My shields are impregnable/
200.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
204.3 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
208.8 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
213.1 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

217.4 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
221.7 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
226.0 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
230.3 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

234.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
238.9 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
243.4 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
247.7 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

252.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
256.3 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
260.6 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
264.9 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

# 60%
```

### 下一个阶段

From observation, I know that the next phase starts at 60% and there's two adds.

From reading the timeline, there's a random "Gate of Tartarus" around the time the adds show up.

This is the original timeline, before any phases were adjusted:

```bash
175.8 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/
183.5 "Adds"
```

Unfortunately, the boss uses `Gate of Tartarus` in phase 1, so we can't add it using `-p` like we did for phase 2. (Patches welcome to add more options to make this possible?)

Instead, we can just use **timeline_adjust.py** to just shift the timeline forward automatically. If we adjust the original timeline by 400-175.8=224.2 then we can start phase 3 at t=400.

Here's the adjusted output, with the adds manually added back in:

```bash
400.0 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/
403.5 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/

407.7 "Adds"
408.7 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
413.2 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
417.9 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
422.4 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

426.9 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
431.4 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
435.9 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
440.4 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

445.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
449.4 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
454.1 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
458.6 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

463.2 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
467.6 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/

# 40% phase push??
483.3 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
487.8 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
492.1 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/

493.3 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/
407.7 "Adds"
```

Without recorded video, it's not 100% clear from the logs whether the `Shrapnel Shell` is part of phase 3 or phase 4. I know from observation that `Magitek Missiles` is the last phase, so because the Shrapnel Shell breaks the pattern let's assume it starts phase 4. We'll test this later.

It looks a bit like there's another loop just like phase 2.

One consideration is to see if it's exactly the same as phase 2. You can use **timeline_adjust.py** with an adjustment of 208.7 to move phase 2's `Shield Skewer` on top of phase 3. However, you can see from that output that it's not quite the same. Therefore, we'll need to build phase 3 separately.

It's pretty clear that this loop is also a 36.2 second loop. Using **timeline_adjust.py** with a 36.2 adjustment gets this output:

```bash
445.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
449.5 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
454.2 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
458.7 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

463.2 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
467.7 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
472.2 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
476.7 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
```

This is really close to the original times, so let's consider that our loop.

### 最终阶段

Finally, we need the phase that starts at 40%. We assumed that the `Shrapnel Shell` started this phase. However, this isn't a unique skill. `Magitek Missiles` is the first unique skill in this phase and that starts 10 seconds after "Shrapnel Shell". Let's start phase 4 at 600 seconds, so we'll adjust the first use of `Magitek Missile` (ability id 478) to be t=610.

Here's the final command line, including this second phase: `python util/make_timeline.py -f CapeWestwind.log -s 18:42:23.614 -e 18:49:22.934 -ii 0A 2CD 2CE 194 14 -p 474:204.3 478:610`

```bash
# manually added in
595.0 "--sync--" sync /00:0044:[^:]*:Your defeat will bring/ window 600,0
600.0 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
604.5 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
608.8 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/

# partial output from make_timeline
610.0 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/
615.1 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
619.4 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
623.7 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
640.2 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
644.7 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
649.0 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/

650.2 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/
655.3 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
659.6 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
663.9 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
680.4 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
684.9 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
689.2 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/

690.4 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/
695.5 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
699.8 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
704.1 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
719.6 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
724.1 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
728.4 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/

729.6 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/
734.7 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
739.0 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
743.3 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
```

This sure looks like a 40.2 second loop. Using **timeline_adjust.py**, with a 40.2 second adjustment, we get the following output:

```bash
650.2 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/
655.3 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
659.6 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
663.9 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
680.4 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
684.9 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
689.2 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
```

This is a perfect match for the original times, so there's our loop.

### 样板附注

In general, most timelines should include some boilerplate at the top like this:

```bash
# Cape Westwind
# -ii 0A 2CD 2CE 194 14 -p 474:204 478:610

hideall "--Reset--"
hideall "--sync--"

0.0 "--Reset--" sync / 21:........:40000010:/ window 10000 jump 0

0 "Start"
0.0 "--sync--" sync /:Engage!/ window 0,1
2.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
```

It's good practice to include the command line you used to generate this so that other people can come back and see what you skipped.

`hideall` hides all instances of a line, so that players don't see `--sync--` show up visually, but the timeline itself will still sync to those lines. There can be anything in the text, it is just called `--sync--` for convenience.

It's good practice to have a Reset line to stop the timeline when there's a wipe. On fights where the entire zone resets (e.g. all of omegascape, a4s, a8s, a12s, t9, t13), `sync / 21:........:40000010:/` is a good sync to use. On fights with zones that seal and unseal, (e.g. a1s,  t1-8) you should use the zone sealing message itself to reset.

Finally, to start a fight, you should always include an Engage! sync for countdowns. If the first boss ability is slow to happen, you should also include the first auto so that the timeline starts.

For instances, on o11s, the first two lines are:

```bash
0.0 "--sync--" sync /:Engage!/ window 0,1
2.5 "--sync--" sync /:Omega:368:/ window 3,0
```

### 循环循环

Here's the phase 1 loop, again. We're going to edit this so that whenever we get to 52.2 seconds it will jump back to 24.4 seconds seamlessly.

```bash
2.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
10.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
19.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
24.4 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/

29.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
38.4 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
46.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
52.2 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/

57.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
66.2 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
74.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
80.0 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/
```

On the 52.2 line, add the following `window 10,100 jump 24.4`. This means, if you see this ability 10 seconds in the past or 100 seconds in the future, jump to t=24.4. By default, all syncs are `window 5,5` unless otherwise specified, meaning they sync against the ability any time within the last 5 seconds or 5 seconds in the future.

The abilities from 57.6 to 80.0 will never be synced against because as soon as the ability at 52.2 is seen, we will want to jump back.  So, we will remove those syncs.

Finally, because sometimes log lines get dropped or ACT starts mid-combat, it can be good to put large syncs on infrequent or important abilities so that the timeline can sync there.

This leaves us with this final version of the initial loop.

```bash
2.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
10.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
19.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
24.4 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/ window 30,10

29.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
38.4 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
46.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
52.2 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/ window 10,100 jump 24.4

# fake loop
57.6 "Shield Skewer"
66.2 "Shield Skewer"
74.6 "Shield Skewer"
80.0 "Gate Of Tartarus"
```

This is done on all the following loops as well.

### 珠联璧合

Putting all the loops that we have created together leaves us with the following timeline.

Because there are so many `Shield Skewer` abilities, any loops are on less frequent abilities just to be more careful.

```bash
# Cape Westwind
# -ii 0A 2CD 2CE 194 14 -p 474:204 478:610

hideall "--Reset--"
hideall "--sync--"

0.0 "--Reset--" sync / 21:........:40000010:/ window 10000 jump 0

### Phase 1: skewers and stuns
0 "Start"
0.0 "--sync--" sync /:Engage!/ window 0,1
2.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
10.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
19.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
24.4 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/ window 30,10

29.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
38.4 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
46.8 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
52.2 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/ window 10,100 jump 24.4

57.6 "Shield Skewer"
66.2 "Shield Skewer"
74.6 "Shield Skewer"
80.0 "Gate Of Tartarus"


### Phase 2 (80%): firebombs
199.0 "--sync--" sync /00:0044:[^:]*:My shields are impregnable/ window 200,0
200.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
204.3 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/ window 205,10
208.8 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
213.1 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

217.4 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
221.7 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
226.0 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
230.3 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

234.6 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
238.9 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/ window 20,100 jump 204.3
243.4 "Winds Of Tartarus"
247.7 "Firebomb"

252.0 "Shield Skewer"
256.3 "Drill Shot"
260.6 "Winds Of Tartarus"
264.9 "Firebomb"


### Phase 3 (60%): Adds
400.0 "Gate Of Tartarus" sync /:Rhitahtyn sas Arvina:473:/ window 200,20
403.5 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/

407.7 "Adds"
408.7 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
413.2 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/ window 20,20
417.9 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
422.4 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

426.9 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
431.4 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
435.9 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
440.4 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/

445.0 "Shield Skewer" sync /:Rhitahtyn sas Arvina:471:/
449.5 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/ window 20,100 jump 413.2
454.2 "Winds Of Tartarus"
458.7 "Firebomb"

463.2 "Shield Skewer"
467.7 "Drill Shot"
472.2 "Winds Of Tartarus"
476.7 "Firebomb"


### Phase 4 (40%): magitek missiles
595.0 "--sync--" sync /00:0044:[^:]*:Your defeat will bring/ window 600,0

600.0 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
604.5 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
608.8 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/

610.0 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/ window 610,30
615.1 "Drill Shot" sync /:Rhitahtyn sas Arvina:475:/
619.4 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
623.7 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/
640.2 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
644.7 "Firebomb" sync /:Rhitahtyn sas Arvina:476:/
649.0 "Winds Of Tartarus" sync /:Rhitahtyn sas Arvina:472:/

650.2 "Magitek Missiles" sync /:Rhitahtyn sas Arvina:478:/ window 20,100 jump 610.0
655.3 "Drill Shot"
659.6 "Firebomb"
663.9 "Winds Of Tartarus"
680.4 "Shrapnel Shell"
684.9 "Firebomb"
689.2 "Winds Of Tartarus"
```

### 测试时间轴

cactbot has a testing tool called **util/test_timeline.py** that can test a network log file or an fflogs fight against an existing timeline.

The test tool will tell you when a sync in your timeline is not matched against the fight, and if a future sync is hit, it will let you know that some were skipped over. It will not do the reverse, and tell you about abilities in the fight that have no timeline entries.

It will also tell you about how far off the sync was, which can help with adjusting timelines to be more accurate.

Here's an example. The `-t` parameter here refers to the file name of the timeline you want to test against in the **ui/raidboss/data/timelines** folder, minus the .txt extension. (As with `make_timeline`, you can use the `-lf` parameter to list encounters.)

```bash
$ python util/test_timeline.py -f CapeWestwind.log -s 18:42:23.614 -e 18:49:22.
934 -t cape_westwind
0.000: Matched entry: 2.0 Shield Skewer (+2.000s)
10.556: Matched entry: 10.6 Shield Skewer (+0.044s)
18.985: Matched entry: 19.0 Shield Skewer (+0.015s)
24.411: Matched entry: 24.4 Gate Of Tartarus (-0.011s)
29.810: Matched entry: 29.8 Shield Skewer (-0.010s)
38.372: Matched entry: 38.4 Shield Skewer (+0.028s)
46.835: Matched entry: 46.8 Shield Skewer (-0.035s)
52.239: Matched entry: 52.2 Gate Of Tartarus (-0.039s)
    Jumping to 24.400
29.897: Matched entry: 29.8 Shield Skewer (-0.097s)
38.286: Matched entry: 38.4 Shield Skewer (+0.114s)
46.851: Matched entry: 46.8 Shield Skewer (-0.051s)
52.291: Matched entry: 52.2 Gate Of Tartarus (-0.091s)
    Jumping to 24.400
29.831: Matched entry: 29.8 Shield Skewer (-0.031s)
38.204: Matched entry: 38.4 Shield Skewer (+0.196s)
46.888: Matched entry: 46.8 Shield Skewer (-0.088s)
48.695: Matched entry: 199.0 --sync-- (+150.305s)
    Missed sync: Gate Of Tartarus at 52.2 (last seen at 24.411)
200.693: Matched entry: 200.0 Shield Skewer (-0.693s)
204.273: Matched entry: 204.3 Shrapnel Shell (+0.027s)
208.809: Matched entry: 208.8 Winds Of Tartarus (-0.009s)
213.111: Matched entry: 213.1 Firebomb (-0.011s)
217.417: Matched entry: 217.4 Shield Skewer (-0.017s)
221.711: Matched entry: 221.7 Drill Shot (-0.011s)
226.017: Matched entry: 226.0 Winds Of Tartarus (-0.017s)
230.313: Matched entry: 230.3 Firebomb (-0.013s)
234.642: Matched entry: 234.6 Shield Skewer (-0.042s)
239.144: Matched entry: 238.9 Shrapnel Shell (-0.244s)
    Jumping to 204.300
208.885: Matched entry: 208.8 Winds Of Tartarus (-0.085s)
213.304: Matched entry: 213.1 Firebomb (-0.204s)
217.623: Matched entry: 217.4 Shield Skewer (-0.223s)
221.857: Matched entry: 221.7 Drill Shot (-0.157s)
226.191: Matched entry: 226.0 Winds Of Tartarus (-0.191s)
230.480: Matched entry: 230.3 Firebomb (-0.180s)
233.846: Matched entry: 400.0 Gate Of Tartarus (+166.154s)
    Missed sync: Shield Skewer at 234.6 (last seen at 217.623)
    Missed sync: Shrapnel Shell at 238.9 (last seen at 204.273)
403.546: Matched entry: 403.5 Shield Skewer (-0.046s)
408.741: Matched entry: 408.7 Shield Skewer (-0.041s)
413.195: Matched entry: 413.2 Shrapnel Shell (+0.005s)
417.897: Matched entry: 417.9 Winds Of Tartarus (+0.003s)
422.385: Matched entry: 422.4 Firebomb (+0.015s)
426.890: Matched entry: 426.9 Shield Skewer (+0.010s)
431.389: Matched entry: 431.4 Drill Shot (+0.011s)
435.882: Matched entry: 435.9 Winds Of Tartarus (+0.018s)
440.393: Matched entry: 440.4 Firebomb (+0.007s)
444.969: Matched entry: 445.0 Shield Skewer (+0.031s)
449.380: Matched entry: 449.5 Shrapnel Shell (+0.120s)
    Jumping to 413.200
417.884: Matched entry: 417.9 Winds Of Tartarus (+0.016s)
422.366: Matched entry: 422.4 Firebomb (+0.034s)
426.975: Matched entry: 426.9 Shield Skewer (-0.075s)
431.292: Matched entry: 431.4 Drill Shot (+0.108s)
431.400: Matched entry: 595.0 --sync-- (+163.600s)
    Missed sync: Winds Of Tartarus at 435.9 (last seen at 417.884)
    Missed sync: Firebomb at 440.4 (last seen at 422.366)
    Missed sync: Shield Skewer at 445.0 (last seen at 426.97499999999997)
    Missed sync: Shrapnel Shell at 449.5 (last seen at 413.195)
620.783: Matched entry: 610.0 Magitek Missiles (-10.783s)
    Missed sync: Shrapnel Shell at 600.0 (last seen at 610.739)
    Missed sync: Firebomb at 604.5 (last seen at 615.247)
    Missed sync: Winds Of Tartarus at 608.8 (last seen at 619.564)
615.098: Matched entry: 615.1 Drill Shot (+0.002s)
619.409: Matched entry: 619.4 Firebomb (-0.009s)
623.711: Matched entry: 623.7 Winds Of Tartarus (-0.011s)
640.166: Matched entry: 640.2 Shrapnel Shell (+0.034s)
644.715: Matched entry: 644.7 Firebomb (-0.015s)
649.012: Matched entry: 649.0 Winds Of Tartarus (-0.012s)
650.179: Matched entry: 650.2 Magitek Missiles (+0.021s)
    Jumping to 610.000
615.137: Matched entry: 615.1 Drill Shot (-0.037s)
619.413: Matched entry: 619.4 Firebomb (-0.013s)
623.709: Matched entry: 623.7 Winds Of Tartarus (-0.009s)
640.170: Matched entry: 640.2 Shrapnel Shell (+0.030s)
644.712: Matched entry: 644.7 Firebomb (-0.012s)
649.013: Matched entry: 649.0 Winds Of Tartarus (-0.013s)
650.177: Matched entry: 650.2 Magitek Missiles (+0.023s)
    Jumping to 610.000
615.135: Matched entry: 615.1 Drill Shot (-0.035s)
619.418: Matched entry: 619.4 Firebomb (-0.018s)
623.709: Matched entry: 623.7 Winds Of Tartarus (-0.009s)
639.166: Matched entry: 640.2 Shrapnel Shell (+1.034s)
644.713: Matched entry: 644.7 Firebomb (-0.013s)
649.014: Matched entry: 649.0 Winds Of Tartarus (-0.014s)
650.175: Matched entry: 650.2 Magitek Missiles (+0.025s)
    Jumping to 610.000
615.131: Matched entry: 615.1 Drill Shot (-0.031s)
619.413: Matched entry: 619.4 Firebomb (-0.013s)
623.709: Matched entry: 623.7 Winds Of Tartarus (-0.009s)
```

As this timeline was generated against this network log, it's not surprising that most of these timings are very accurate.

The `Missed sync` lines are the ones to look at more closely.

These three examples aren't worrisome because they are just the end of the loop and we've skipped forward in time to the next phase. (Patches welcome to figure out how to not warn on this sort of jump.)

```text
48.695: Matched entry: 199.0 --sync-- (+150.305s)
    Missed sync: Gate Of Tartarus at 52.2 (last seen at 24.411)

233.846: Matched entry: 400.0 Gate Of Tartarus (+166.154s)
    Missed sync: Shield Skewer at 234.6 (last seen at 217.623)
    Missed sync: Shrapnel Shell at 238.9 (last seen at 204.273)

431.400: Matched entry: 595.0 --sync-- (+163.600s)
    Missed sync: Winds Of Tartarus at 435.9 (last seen at 417.884)
    Missed sync: Firebomb at 440.4 (last seen at 422.366)
    Missed sync: Shield Skewer at 445.0 (last seen at 426.97499999999997)
    Missed sync: Shrapnel Shell at 449.5 (last seen at 413.195)
```

However, this looks like a problem:

```text
620.783: Matched entry: 610.0 Magitek Missiles (-10.783s)
    Missed sync: Shrapnel Shell at 600.0 (last seen at 610.739)
    Missed sync: Firebomb at 604.5 (last seen at 615.247)
    Missed sync: Winds Of Tartarus at 608.8 (last seen at 619.564)
```

It seems pretty likely that we've put the rp text sync in the wrong place. Because we added such a large window on `Magitek Missile` the timeline resynced (thank goodness), but some of the abilities before that were wrong.

The original timeline is:

```bash
595.0 "--sync--" sync /00:0044:[^:]*:Your defeat will bring/ window 600,0
600.0 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
```

However, Shrapnel Shell is off by 10.7 seconds, as the tester output mentioned `(last seen at 610.739)`. The fix is to move the rp text sync back in time by that amount. The new time will be 595 - 10.7 = 584.3.

```bash
584.3 "--sync--" sync /00:0044:[^:]*:Your defeat will bring/ window 600,0
600.0 "Shrapnel Shell" sync /:Rhitahtyn sas Arvina:474:/
```

Rerunning the tester (most output omitted)

```bash
$ python util/test_timeline.py -f CapeWestwind.log -s 18:42:23.614 -e 18:49:22.
934 -t cape_westwind

431.400: Matched entry: 584.3 --sync-- (+152.900s)
    Missed sync: Winds Of Tartarus at 435.9 (last seen at 417.884)
    Missed sync: Firebomb at 440.4 (last seen at 422.366)
    Missed sync: Shield Skewer at 445.0 (last seen at 426.97499999999997)
    Missed sync: Shrapnel Shell at 449.5 (last seen at 413.195)
600.039: Matched entry: 600.0 Shrapnel Shell (-0.039s)
604.508: Matched entry: 604.5 Firebomb (-0.008s)
608.817: Matched entry: 608.8 Winds Of Tartarus (-0.017s)
610.019: Matched entry: 610.0 Magitek Missiles (-0.019s)
```

This is what we want to see. As before, these missed syncs are just from the phase push, but `Shrapnel Shell` is now in the right spot.

### 测试其他时间轴

It's important to test against multiple fight instances to make sure that the timeline is good. Here's an example of running against the **CapeWestwind2.log** file.

If you run `python util/test_timeline.py -f CapeWestwind2.log -s 13:21:00.688 -e 13:29:36.976 -t cape_westwind` yourself, you can spot at least two problems.

One minor problem is that this boss is inconsistent:

```text
447.329: Matched entry: 445.0 Shield Skewer (-2.329s)
443.789: Matched entry: 445.0 Shield Skewer (+1.211s)
444.792: Matched entry: 445.0 Shield Skewer (+0.208s)
447.361: Matched entry: 445.0 Shield Skewer (-2.361s)
```

This `Shield Skewer` in phase 3 comes at wildly different times. However, the abilities before and after seem to be just fine. Often if there are inconsistencies like this, the best thing to do is make sure there are larger windows around surrounding abilities to make sure that even if one ability is inconsistent the entire timeline doesn't get derailed.

However, one major problem is that there's a missing `Shield Skewer`:

```text
403.454: Matched entry: 403.5 Shield Skewer (+0.046s)
407.876: Matched entry: 413.2 Shrapnel Shell (+5.324s)
    Missed sync: Shield Skewer at 408.7 (last seen at 403.454)
417.748: Matched entry: 417.9 Winds Of Tartarus (+0.152s)
```

One timeline has two `Shield Skewer`s and one only has one. And the `Shrapnel Shell` is horribly mistimed here.

What to do in this case is subjective. Here are some options:

* get more data, and make a timeline for the most common case
* leave a comment in the timeline
* if this is an important ability (e.g. tankbuster) put a question mark on it so players know it's not guaranteed
