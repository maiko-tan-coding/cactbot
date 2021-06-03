# OopsyRaidsyトリガーフォーマット

## ファイル構造

Each file is a module that exports a single trigger set, and should be listed in **oopsy_manifest.txt**.

```javascript
import ZoneId from '../path/to/resources/zone_id.js';
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
    { /* ..trigger 1.. * /}、
    {/ * ..トリガー2.。 * /}、
    {/ * ..トリガー3.。 */ },
  ]
};
```

### Trigger Set Properties

**zoneId**: A shortened name for the zone to use these triggers in. The set of id names can be found in [zone_id.js](../resources/zone_id.js). Prefer using this over zoneRegex. A trigger set must have one of zoneId or zoneRegex to specify the zone (but not both).

**zoneRegex**: A regular expression that matches against the zone name (coming from ACT). If the regular expression matches, then the triggers will apply to that zone.

**damageWarn** and **damageFail**: An object contains properties like `'trigger id': 'damage action id'`, which provides an easy way to apply triggers via damage action id (in hex). When a player was hit by these action, a message (default to action name) would be shown.

**damageWarn** shows the message as `warn`, and **damageFail** shows it as `fail`.

**gainsEffectWarn** and **gainsEffectFail**: Just like **damageWarn** and **damageFail**, but triggered when hit by an effect (id in hex).

**shareWarn** and **shareFail**: Just like **damageWarn** and **damageFail**, triggered when multiple players share damage which should only be on one player.

**triggers**: An array of triggers in the trigger set. See below for the format of each of individual triggers.

## トリガー構造

Each trigger is an object with the following fields.  All fields are optional.

* `id`：トリガーを無効にするために使用する、このトリガーを表す文字列。  参照してください [oopsyraidsy-example.js](../users/oopsyraidsy-example.js)。
* `条件`：このトリガーを実行するかどうかのブール値を返す関数。
* `正規表現`：行全体に一致する正規表現。
* `damageRegex`：のみダメージを与える能力のIDと一致します正規表現。
* `healRegex`：回復能力のIDにのみ一致する正規表現。
* `gainsEffectRegex`：名前でゲイン効果に一致する正規表現。
* `lostEffectRegex`：一致する正規表現は名前による効果を失います。
* `abilityRegex`：能力のいずれかのタイプのIDを一致する正規表現。
* `collectSeconds`：float（またはfloatを返す関数）
* `delaySeconds`：このトリガーを実行する前に待機する時間のfloat（またはfloatを返す関数）。  場合は無視されます `collectSeconds > 0`。
* `suppressSeconds`: float (or function returning float) for how long to ignore future matches to this trigger (including additional collection).
* `deathReason`: overrides the reason that a player died if the player dies without taking any more damage.  This is for things that kill you without an obvious log line, e.g. forgetting to clear Beyond Death.
* `mistake`: returns a single mistake or an array of mistakes to add to the live list.  See below for the `mistake` format.
* `run`: function that just runs, but does not return anything

### `mistake` format

* `タイプ` はアイコンです：引っ張る、警告する、失敗する、ポーション、死ぬ、拭く（:arrow_forward::warning::no_entry_sign::cocktail::skull::toilet:）。
* `name` は、この間違いが発生したときにリストするオプションのフルプレーヤー名です。  これにより、ライブリストで名前が先頭に追加されます。
* `非難` は、この間違いのせいにするオプションの完全なプレーヤー名（または完全なプレーヤー名の配列）です。  `名前` が指定されていない場合、 `名前` は `非難` プレーヤーになります。
* `テキスト` は、間違いのオプションの理由です。  責任のあるプレーヤーの短い名前（存在する場合）が前に付けられます。
* `fullText` が存在する場合は、誰が非難されているかに関係なく、行のテキスト全体になります。

This will print ":no_entry_sign: Latke: Dynamo" in the live log.

```javascript
間違い：function（event、data、matches）{
  return {
    type: 'fail',
    blame: e.targetName,
    text: 'Dynamo'
  };
}、
```

This will print ":warning: WHOOPS" in the live log, even though a player was blamed.

```javascript
間違い：function（event、data、matches）{
  return {
    type： 'warn'、
    blame：e.targetName、
    fullText： 'WHOOPS'、
  };
}、
```

### `deathReason` format

* `名前` は、次の死亡理由を上書きする完全なプレーヤー名です。
* `理由` は使用する文字列です。

If this following trigger is used, then if a player dies without taking any other damage, the log would show ":skull: Chippy: Doom Debuff" instead of assigning it to the last damage the player took before this trigger, which might incorrectly look more like ":skull: Chippy: Auto (3034/38471)".

```javascript
deathReason：関数（イベント、データ、マッチ）{
  リターン {
    name: event.targetName,
    reason: 'Doom Debuff',
  }、
}、
```

## Oopsyトリガー関数パラメーター

Every function in an oopsy trigger gets three parameters: `event`, `data`, `matches` in that order.

### Event Fields

Every function specified in a trigger gets an event (or events) object.  This object has different fields depending on which type of regex was used to match the trigger.

#### すべてのイベント

* `event.line`：文字列。ログ行全体を表します。

#### エフェクトイベント（gainsEffectRegex、losesEffectRegex）

* `event.targetName`：文字列、ターゲットのフルネーム。
* `event.effectName`：文字列、獲得したバフ名、例：「BeyondDeath」。
* `event.gains`：bool、バフが得られた場合はtrue、バフが失われた場合はfalse。
* `event.attackerName`：文字列、ターゲットにこのバフを与えた攻撃者のフルネーム。
* `event.durationSeconds`：float、このバフが獲得された期間。  バフが失われたかどうかは未定義です。

#### 能力イベント（healRegex、damageRegex、abilityRegex）

* `event.type`：ログ行タイプの16進文字列（例：ヘッドマーカーの場合は「1B」）。
* `event.attackerId`：攻撃者のIDの16進文字列
* `event.attackerName`：文字列、ターゲットのフルネーム。
* `event.targetId`：ターゲットのIDの16進文字列。
* `event.targetName`：文字列、ターゲットのフルネーム。
* `event.flags`：このダメージ値のフラグの16進文字列（詳細については、 **oopsyraidsy.js** コメントを参照してください）。
* `event.damage`：フロート、ダメージ、またはヒール値
* `event.damageStr`：文字列、 `見栄えの良いバージョンevent.damage` with！ と!! 批評家のために。
* `event.targetCurrentHp`：int文字列、この能力の時点でのターゲットの馬力。
* `event.targetMaxHp`：int文字列、この能力の時点でのターゲットの最大馬力。
* `event.targetCurrentMp`：int文字列、この能力の時点でのターゲットのmp。
* `event.targetMaxMp`：int文字列、この能力の時点でのターゲットの最大mp。
* `event.targetCurrentTp`：int文字列、この能力の時点でのターゲットのtp。
* `event.targetMaxTp`：int文字列、この能力の時点でのターゲットの最大tp。
* `event.targetX`：この能力が使用されたときのターゲットのx位置。
* `event.targetY`：この能力が使用されたときのターゲットのy位置。
* `event.targetZ`：この能力が使用されたときのターゲットのz位置。
* `event.attackerX`：この能力が使用されたときの攻撃者のx位置。
* `event.attackerY`：この能力が使用されたときの攻撃者のy位置。
* `event.attackerZ`：この能力が使用されたときの攻撃者のz位置。

`data.IsPlayerId(id)` can be used against the `attackerId` or the `targetId` to determine if that id represents a player.

Current hp/mp/tp values are not 100% precise.  ACT polls these values periodically and so it may be out of date by one HoT/DoT tick.  The most important consideration is that damage that does more than current hp may not actually be fatal, and vice versa that damage that does less than current hp may turn out to be fatal.  There's no way to know until the 'was defeated' message shows up two seconds later.

### Single Event Example

In most cases, a single event will be passed to every function.

```javascript
{
  // 26BBは、NaelのIronChariotの能力IDです。
  damageRegex '26BB'、
  間違い：機能（イベント、データ、マッチ）{
    ここ//イベントが単一のイベントオブジェクトである
    にconsole.log（event.targetName）。
  }、
}、
```

### Multiple Event Example (Collection)

If `collectSeconds` is used, then as soon as the trigger matches any line, it will wait `collectSeconds` and then pass that first trigger and any additional trigger that matches during that time period as an array.

`condition` always takes a single event and acts as a filter prior to collecting events.  If `condition` is not true, then it as if the log line didn't exist and the event is skipped, both for the initial match and for the collection.

`delaySeconds` is not called when collecting.

```javascript
{
  //扶助
  healRegex： 'BA'、
  collectSeconds：0.2、
  ミス：機能（イベント、データ、マッチ）{
    ここ//イベントは、イベントオブジェクトの配列である
    I = 0（VARのために、I < events.length; ++ i）
      console.log（events[i].targetName）;
  }、
}、
```

### Data Fields

`data` is an object that persists for an entire fight and is reset on wipe.  It is passed to every function.

`data` comes prepopulated with the following fields:

* `data.me`：文字列、プレイヤーのキャラクター名。
* `data.job`：文字列、プレーヤーのジョブ（例：WAR）。
* `data.role`：文字列、プレイヤーの仕事の役割：タンク、ヒーラー、dps-近接、dps-範囲、dps-キャスター、クラフト、収集。
* `data.inCombat`：bool、プレイヤーが戦闘中であるとゲームが考えるかどうか。  これは、ACTがプレイヤーが戦闘中であると考えるかどうかとは異なります。
* `data.ShortName`：完全なプレーヤー名を短い名前またはニックネームに変換するヘルパー関数。
* `data.IsPlayerId`：ターゲットまたは攻撃者IDがプレーヤーを表すかどうかをチェックするヘルパー関数（ペットまたは暴徒に対して）。

`data` is something that triggers can and should store state on, if state is needed to be tracked across multiple triggers.

For example, if you want to store a map of which players have doom or not, that could be stored in `data.hasDoom`.  This could then be used across multiple triggers.

```javascript
{
  //同じトリガーでゲインとロスの両方を一致させます。
  gainsEffectRegex： 'Doom'、
  lostEffectRegex： 'Doom'、
  実行：function（e、data）{
    data.hasDoom[e.targetName] = e.gains;
  }、
}、
```

### Match Fields

`matches` is literally the regex match object returned from whatever regex this trigger matched.  `matches[0]` is always the full match, with other array entries being any other groups from the regex (if any).  In the case of the single event above, `matches[0] === 'Iron Chariot'`.

However, if `matches` has any groups (which all the `Regexes` helper functions do), then matches will be the groups field directly, so that you can do things like `matches.target`.

## トリガーフィールド評価順序

The full order of evaluation of functions in a trigger is:

1. 正規表現との一致
1. かどうかを確認 `ID` 無効になっています
1. `状態`
1. `collectSeconds`
1. `delaySeconds` （収集していない場合のみ）
1. （遅延と収集の待機はここで発生します）
1. `間違い`
1. `deathReason`
1. `実行`
