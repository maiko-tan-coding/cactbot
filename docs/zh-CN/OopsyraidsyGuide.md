# Oopsy Raidsy 触发器格式

## 文件结构

Each file is a module that exports a single trigger set, and should be listed in **oopsy_manifest.txt**.

```javascript
import ZoneId from '../path/to/resources/zone_id';
// Other imports here.

export default {
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  damageWarn: {
    'UCU Lunar Dynamo': '26BC',
    // ...
  },
  damageFail: {
    'UCU Twister': '26AB',
    // ...
  },
  gainsEffectWarn: {
    'UCU Doom': 'D2',
    // ...
  },
  gainsEffectFail: {
    'UCU Doom': 'D2',
    // ...
  },
  shareWarn: {
    'UCU Megaflare': '26DB',
    // ...
  },
  shareFail: {
    'UCU Megaflare': '26DB',
    // ...
  },
  triggers: [
    { /* ..trigger 1.. */ },
    { /* ..触发器2.. */ },
    { /* ..触发器3.. */ },
  ]
};
```

### 触发器集合属性

**zoneId**: 区域名缩写，用于规定触发器的适用范围。 这些区域名缩写可以在 [zone_id.ts](../resources/zone_id.ts) 文件中找到。 我们倾向于使用该属性，而非zoneRegex。 每个触发器集合都必须包含zoneId或zoneRegex之一(但二者不能并存)。

**zoneRegex**: 用于匹配区域名称的正则表达式(匹配ACT读取的区域名)。 当正则表达式匹配到当前的区域名，则该集合中的触发器会应用于该区域。

**damageWarn** 和 **damageFail**: 一个包含了形如 `'trigger id': 'damage action id'` 的属性的对象， 可提供一种更简便的编写监控 (十六进制) 的技能id的触发器的方式。 当这些技能击中玩家时，会显示一条默认为技能名称的信息。

**damageWarn** 中的技能会显示为 `warn` 级别， 而 **damageFail** 则是 `fail`。

**gainsEffectWarn** 和 **gainsEffectFail**: 与 **damageWarn** 和 **damageFail** 类似，但此处触发条件是玩家受到特定(十六进制)id的效果。

**shareWarn** 与 **shareFail**: 与 **damageWarn** 和 **damageFail**，但此处触发条件时玩家应该单吃的技能击中了多人。

**triggers**: 包含触发器的数组。 有关每个触发器的格式，请参见下文。

## 触发器结构

触发器的字段如下所示，  所有字段均为可选项。

* `id`: 字符串，用于识别与禁用触发器。  参见 [oopsyraidsy-example.js](../users/oopsyraidsy-example.js)。
* `condition`: 函数，返回一个布尔值，表示该触发器是否应当运行。
* `regex`: 正则表达式，匹配日志行。
* `damageRegex`: 正则表达式，仅匹配造成伤害的技能id。
* `healRegex`: 正则表达式，仅匹配造成治疗的技能id。
* `gainsEffectRegex`: 正则表达式，仅匹配获得的效果名称。
* `gainsEffectRegex`: 正则表达式，仅匹配失效的效果名称。
* `abilityRegex`: 正则表达式，匹配任意技能id。
* `collectSeconds`: 浮点数 (或返回浮点数的函数)。
* `delaySeconds`: 浮点数 (或返回浮点数的函数)，在正则成功匹配后经过多长时间运行该触发器。  当 `collectSeconds > 0` 时忽略该参数。
* `suppressSeconds`: float (or function returning float) for how long to ignore future matches to this trigger (including additional collection).
* `deathReason`: overrides the reason that a player died if the player dies without taking any more damage.  This is for things that kill you without an obvious log line, e.g. forgetting to clear Beyond Death.
* `mistake`: returns a single mistake or an array of mistakes to add to the live list.  See below for the `mistake` format.
* `run`: function that just runs, but does not return anything

### `mistake` format

* `type` is the icon: pull, warn, fail, potion, death, wipe (:arrow_forward::warning::no_entry_sign::cocktail::skull::toilet:).
* `name` is an optional full player name to list as this mistake happening to.  This will prepend their name in the live list.
* `blame` is an optional full player name (or array of full player names) to blame for this mistake.  If `name` is not specified, then the `name` will be the `blame` player.
* `text` is an optional reason for the mistake.  It will be prepended by the blamed player's short name (if it exists).
* `fullText` if it exists will be the entire text of the line, regardless of who is blamed.

This will print ":no_entry_sign: Latke: Dynamo" in the live log.

```javascript
mistake: function(event, data, matches) {
  return {
    type: 'fail',
    blame: e.targetName,
    text: 'Dynamo'
  };
},
```

This will print ":warning: WHOOPS" in the live log, even though a player was blamed.

```javascript
mistake: function(event, data, matches) {
  return {
    type: 'warn',
    blame: e.targetName,
    fullText: 'WHOOPS',
  };
},
```

### `deathReason` format

* `name` is the full player name to override the next death reason for.
* `reason` is the string to use.

If this following trigger is used, then if a player dies without taking any other damage, the log would show ":skull: Chippy: Doom Debuff" instead of assigning it to the last damage the player took before this trigger, which might incorrectly look more like ":skull: Chippy: Auto (3034/38471)".

```javascript
deathReason: function(event, data, matches) {
  return {
    name: event.targetName,
    reason: 'Doom Debuff',
  },
},
```

## Oopsy Trigger Function Parameters

Every function in an oopsy trigger gets three parameters: `event`, `data`, `matches` in that order.

### Event Fields

Every function specified in a trigger gets an event (or events) object.  This object has different fields depending on which type of regex was used to match the trigger.

#### All Events

* `event.line`: string, representing the entire log line.

#### Effect Events (gainsEffectRegex, losesEffectRegex)

* `event.targetName`: string, the target's full name.
* `event.effectName`: string, the buff name gained, e.g. 'Beyond Death'.
* `event.gains`: bool, true if the buff was gained, false if the buff was lost.
* `event.attackerName`: string, the full name of the attacker that gave the target this buff.
* `event.durationSeconds`: float, the duration this buff was gained for.  undefined if the buff was lost.

#### Ability Events (healRegex, damageRegex, abilityRegex)

* `event.type`: hex string of the log line type (e.g. '1B' for head markers).
* `event.attackerId`: hex string of the attacker's id
* `event.attackerName`: string, full name of the target.
* `event.targetId`: hex string of the target's id.
* `event.targetName`: string, full name of the target.
* `event.flags`: hex string of flags for this damage value (see comments in **oopsyraidsy.js** for more information).
* `event.damage`: float, damage or heal value
* `event.damageStr`: string, nicer looking version of `event.damage` with ! and !! for crits.
* `event.targetCurrentHp`: int string, target's hp at the time of this ability.
* `event.targetMaxHp`: int string, target's max hp at the time of this ability.
* `event.targetCurrentMp`: int string, target's mp at the time of this ability.
* `event.targetMaxMp`: int string, target's max mp at the time of this ability.
* `event.targetCurrentTp`: int string, target's tp at the time of this ability.
* `event.targetMaxTp`: int string, target's max tp at the time of this ability.
* `event.targetX`: x position of the target when this ability was used.
* `event.targetY`: y position of the target when this ability was used.
* `event.targetZ`: z position of the target when this ability was used.
* `event.attackerX`: x position of the attacker when this ability was used.
* `event.attackerY`: y position of the attacker when this ability was used.
* `event.attackerZ`: z position of the attacker when this ability was used.

`data.IsPlayerId(id)` can be used against the `attackerId` or the `targetId` to determine if that id represents a player.

Current hp/mp/tp values are not 100% precise.  ACT polls these values periodically and so it may be out of date by one HoT/DoT tick.  The most important consideration is that damage that does more than current hp may not actually be fatal, and vice versa that damage that does less than current hp may turn out to be fatal.  There's no way to know until the 'was defeated' message shows up two seconds later.

### Single Event Example

In most cases, a single event will be passed to every function.

```javascript
{
  // 26BB is the ability id for Nael's Iron Chariot.
  damageRegex: '26BB',
  mistake: function(event, data, matches) {
    // event here is a single event object
    console.log(event.targetName);
  },
},
```

### Multiple Event Example (Collection)

If `collectSeconds` is used, then as soon as the trigger matches any line, it will wait `collectSeconds` and then pass that first trigger and any additional trigger that matches during that time period as an array.

`condition` always takes a single event and acts as a filter prior to collecting events.  If `condition` is not true, then it as if the log line didn't exist and the event is skipped, both for the initial match and for the collection.

`delaySeconds` is not called when collecting.

```javascript
{
  // Succor
  healRegex: 'BA',
  collectSeconds: 0.2,
  mistake: function(events, data, matches) {
    // events here is an array of event objects
    for (var i = 0; i < events.length; ++i)
      console.log(events[i].targetName);
  },
},
```

### Data Fields

`data` is an object that persists for an entire fight and is reset on wipe.  It is passed to every function.

`data` comes prepopulated with the following fields:

* `data.me`: string, the player's character name.
* `data.job`: string, the player's job, e.g. WAR.
* `data.role`: string, the role of the player's job: tank, healer, dps-melee, dps-ranged, dps-caster, crafting, gathering.
* `data.inCombat`: bool, whether or not the game thinks the player is in combat.  This is different than whether ACT thinks the player is in combat.
* `data.ShortName`: helper function to turn full player names into shorter names or nicknames.
* `data.IsPlayerId`: helper function to check if a target or attacker id represents a player (vs a pet or a mob).

`data` is something that triggers can and should store state on, if state is needed to be tracked across multiple triggers.

For example, if you want to store a map of which players have doom or not, that could be stored in `data.hasDoom`.  This could then be used across multiple triggers.

```javascript
{
  // Match both gains and loses in the same trigger.
  gainsEffectRegex: 'Doom',
  losesEffectRegex: 'Doom',
  run: function(e, data) {
    data.hasDoom[e.targetName] = e.gains;
  },
},
```

### Match Fields

`matches` is literally the regex match object returned from whatever regex this trigger matched.  `matches[0]` is always the full match, with other array entries being any other groups from the regex (if any).  In the case of the single event above, `matches[0] === 'Iron Chariot'`.

However, if `matches` has any groups (which all the `Regexes` helper functions do), then matches will be the groups field directly, so that you can do things like `matches.target`.

## Trigger Field Evaluation Order

The full order of evaluation of functions in a trigger is:

1. match against regex
1. check if `id` is disabled
1. `condition`
1. `collectSeconds`
1. `delaySeconds` (only if not collecting)
1. (delay and waiting for collecting happens here)
1. `mistake`
1. `deathReason`
1. `run`
