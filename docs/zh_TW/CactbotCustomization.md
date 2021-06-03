# Cactbot自定義教學

🌎 [[English](../CactbotCustomization.md)] [[简体中文](../zh-CN/CactbotCustomization.md)] [**繁體中文**] [[한국어](../ko-KR/CactbotCustomization.md)]

- [使用cactbot使用者介面](#使用cactbot使用者介面)
- [透過cactbot使用者介面改變觸發器文本](#透過cactbot使用者介面改變觸發器文本)
- [使用者資料夾概況](#使用者資料夾概況)
- [設置您自己的使用者資料夾](#設置您自己的使用者資料夾)
- [樣式自定義](#樣式自定義)
- [Raidboss觸發器自定義](#raidboss觸發器自定義)
  - [例1：改變輸出文本](#例1改變輸出文本)
  - [例2：使挑釁提示適用於全職業](#例2使挑釁提示適用於全職業)
  - [例3：添加自定義觸發器](#例3添加自定義觸發器)
- [Raidboss時間軸自定義](#raidboss時間軸自定義)
- [行為自定義](#行為自定義)
- [使用者檔案的除錯](#使用者檔案的除錯)
  - [檢查OverlayPlugin的錯誤日誌](#檢查OverlayPlugin的錯誤日誌)
  - [檢查檔案是否載入](#檢查檔案是否載入)
  - [檢查檔案是否有錯誤](#檢查檔案是否有錯誤)

## 使用cactbot使用者介面

自定義cactbot時，推薦透過cactbot的使用者介面進行操作。 該介面處於 ACT -> Plugins -> OverlayPlugin.dll -> Cactbot。

它可以提供如下功能：

- 設置觸發器輸出TTS
- 禁用觸發器
- 改變觸發器輸出
- 改變cactbot語言
- 音量設置
- 隱藏起司圖標

您可能無法透過cactbot使用者介面以配置所有您想要的更改。 但是它是最容易的方法，適合作為您定制化的第一步。 以後此介面會添加更多的選項。

此處的選項會存儲於 `%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json` 檔案中。 但您並不需要也不應當直接修改該檔案。

## 透過cactbot使用者介面改變觸發器文本

在位於ACT-> 插件> OverlayPlugin.dll-> Cactbot-> Raidboss的cactbot使用者介面中， 羅列著所有的觸發器。 這裡的列表讓您可以更改每個觸發器支持外部更改的配置設置。

名稱旁邊帶有鈴鐺(🔔) 的設置項的觸發器輸出文本是可以被覆蓋的。 舉個例子，假設有一個🔔onTarget欄位，其文字為 `死刑點${player}`。 當某人接到死刑技能時，這個字符串將出現在熒幕上（或通過tts播報）。 `${player}` 是一個將由觸發器動態設置的引數。 任何類似於 `${param}` 的字符串都是動態引數。

比如，您可以將這個文字更改為 `${player} 即將死亡！ `。 或者，也許您不關心誰是目標，那麼您可以將其改為 `死刑` 以使文字更加簡短。 如果您想撤消自己的更改，只需清空文字框即可。

但這個方式有一定的限制。 例如，您無法更改邏輯。 而且在大多數情況下，您無法使 `tts` 的播報與 `alarmText` 不同。 您無法新增更多的引數。 如果您想要對觸發器做出更加複雜的覆蓋操作， 那麼您需要檢視 [Raidboss觸發器自定義](#overriding-raidboss-triggers) 小節。

## 使用者資料夾概覽

若cactbot使用者介面不存在您所需的選項，您可能需要考慮以使用者檔案覆蓋的方式進行自定義。 您需要編寫JavaScript程式碼和CSS樣式，這意味著您可能需要掌握一點點程式設計知識。

Cactbot的設計哲學要求任何使用者的自定義配置應當存放於使用者資料夾的檔案中。 同時這也能防止您所做的更改在今後cactbot的更新中被覆蓋失效。 另外，目前您無法透過直接修改cactbot的檔案應用您的更改，除非您瞭解如何構建您自己的專案。

所有的cactbot模組都會從 [user/](../../user/) 資料夾載入使用者設定。 `raidboss` 模組會載入 `user/raidboss.js` 與 `user/raidboss.css`，以及所有`user/raidboss/` 目錄下及其子目錄下的 `.js` 和 `.css` 檔案。 (時間軸`.txt`檔案必須與引用它們的`.js`檔案放在同一個資料夾中。) 這些使用者自定義檔案將在cactbot自身載入完畢後被載入，並可以覆蓋對應的模組的設定。

`oopsyraidsy` 模組會載入 `user/oopsyraidsy.js` 與 `user/oopsyraidsy.css`。 依此類推，每個模組都支援以此方式（以檔名）載入對應自定義檔案。

cactbot將按照字母順序優先載入user資料夾中的子資料夾裡的檔案，其次載入子資料夾外的檔案。 這就是為什麼`user/raidboss.js`檔案總是最後被載入並可以覆蓋`user/raidboss/`資料夾中任何檔案中的配置。 例如，`user/alphascape/some_file.js` 先載入， `user/mystatic/some_file.js` 再載入，最後是`user/raidboss.js` 載入。 `.css` 檔案遵循同樣的順序。

在本文件中，“使用者自定義js檔案”指代以上兩者。 除了載入順序以外，`user/raidboss.js` 和 `user/raidboss/some_file.js` 沒有區別。 同樣地，“使用者自定義css檔案”同時指代 `user/radar.css` 和 `user/radar/some_file.css` 二者。 使用者資料夾中分出子目錄是為了讓分享觸發器和自定義配置更容易。

當開發者模式開啟時，你可以從[除錯資訊](#檢查檔案是否載入)中得到更多關於載入順序的資訊。

`user/` 資料夾中包含了一部分示例配置檔案，您可以對其重新命名並直接使用。 如 [user/raidboss-example.js](../../user/raidboss-example.js) 檔案 可被重新命名為 `user/raidboss.js`，對其所做的更改可應用於 `raidboss` 模組。

在修改了這些檔案之後，單擊ACT中OverlayPlugin外掛對應懸浮窗設定中的“重載懸浮窗”按鈕，即可應用更改。

## 設定您自己的使用者資料夾

您可以透過cactbot配置介面設定使用者資料夾： ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> cactbot使用者資料夾。 單擊 `選擇資料夾` 按鈕，選擇磁碟上的一個資料夾。

如果沒有選擇，cactbot將自動選擇其安裝目錄下的預設資料夾。

建議您選擇cactbot安裝目錄下的 `cactbot/user` 資料夾。 該資料夾通常為位於 `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`。 有部分示例配置檔案位於 [此資料夾](../../user) 下。

## 樣式自定義

使用者自定義css檔案可以對UI模組的位置、尺寸、顏色等進行自定義。 可用的選擇器可以透過閱覽 `ui/<name>/<name>.css` 檔案找到。

例如您在 [ui/raidboss/raidboss.css](../../ui/raidboss/raidboss.css) 中，可發現諸如 `#popup-text-container` 與 `#timeline-container` 等選擇器， 則您可以在 `user/raidboss.css` 中對其位置進行自定義。 您可以在 `user/raidboss.css` 中或其他 `user/raidboss/` 下的 `.css` 中新增更多的樣式。

同樣地，您可以在 `.info-text` 類中新增新的CSS規則，對資訊文字的尺寸和顏色進行自定義。 例如：

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

簡單地說，您可以認為cactbot會將使用者檔案中的CSS規則新增至內建CSS檔案的末尾。 也就是說，您需要注意 [CSS優先順序規則](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)， 例如新增 `!important` 讓您的規則可以強制覆蓋。 另一方面，您可能需要重置某些屬性為預設的 `auto` 值。

我們推薦使用 [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) 以除錯CSS問題。 您可以透過 ACT -> Plugins -> OverlayPlugin.dll -> 您的懸浮窗名字 -> 啟動Debug工具 以開啟DevTools。

**注意**：某些元件的自定義較為困難，甚至無法進行自定義，如時間軸的進度條等。 原因是，這些元件屬於自定義HTML元素，且沒有開放外部配置的介面。 如果您有特別的需求，但是不知道如何修改，您可以提出一個 [github issue](https://github.com/quisquous/cactbot/issues/new/choose)。

**警告**：cactbot不保證CSS的向後相容性。 在以後的更改中，cactbot可能會重新組織網頁結構，改變元素名稱和類名稱，甚至完全重構所有樣式。 因此，您需知曉您的自定義CSS有在將來出現問題的風險。

## Raidboss觸發器自定義

您可以透過使用者自定義js檔案(例如 `user/raidboss.js` 或 `user/raidboss/` 目錄下的任意`.js` 檔案)自定義觸發器行為。 您可以修改輸出文字、適用職業、文字顯示的時間等等。

You can see readable JavaScript versions of all of the cactbot triggers in this branch: <https://github.com/quisquous/cactbot/tree/triggers> This is the preferred reference to use for viewing, copying, and pasting. Triggers in the main branch or shipped in a cactbot release are often in unreadable bundles or are TypeScript which is not supported in user folders.

In your user-defined js file for raidboss, there is an `Options.Triggers` list that contains a list of trigger sets. You can use this to append new triggers and modify existing triggers. If a user file contains a trigger with the same id as any previous trigger (including triggers in cactbot), then that trigger will override it.

If you are going to modify triggers, it is worth reading the [trigger guide](RaidbossGuide.md) to understand what the various fields of each trigger means.

In general, the pattern to follow is to add a block of code to your user-defined js file (e.g. `user/raidboss.js`) that looks like this:

```javascript
Options.Triggers.push({
  // 在檔案開頭定義ZoneId，
  // 例如 ZoneId.MatchAll (指定所有區域) 或 ZoneId.TheBozjanSouthernFront 等
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // 這裡定義的是觸發器(trigger)物件。
      // 例如 id, netRegex或infoText等
    },
  ],
});
```

The easiest approach to modify triggers is to copy and paste the block of code above for each trigger. Modify the `zoneId` line to have the zone id for the zone you care about, usually from the top of the cactbot trigger file. [This file](../resources/zone_id.js) has a list of all the zone ids. If you specify one incorrectly, you will get a warning in the OverlayPlugin log window. Then, [copy the trigger text](https://github.com/quisquous/cactbot/tree/triggers) into this block. Edit as needed. Repeat for all the triggers you want to modify. Reload your raidboss overlay to apply your changes.

**Note**: This method completely removes the original trigger, and so do not delete any logic when making edits. Also, this is JavaScript, and so it still needs to be valid JavaScript. If you are not a programmer, be extra careful with what and how you edit.

### 例1：改變輸出文字

Let's say hypothetically that you are doing UCOB and your group decides that they are going to do "fire out" first instead of "fire in" first like cactbot calls it by default. Additionally, you *also* want to have the tts say something different for this trigger. You keep forgetting to get out, so you want it to repeat a few times.

If you only wanted to change the `infoText`, you could do this via [Changing Trigger Text with the cactbot UI](#changing-trigger-text-with-the-cactbot-ui).

One way to adjust this is to edit the trigger output for this trigger. You can find the original fireball #1 trigger in [ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js](https://github.com/quisquous/cactbot/blob/triggers/04-sb/ultimate/unending_coil_ultimate.js#:~:text=UCU%20Nael%20Fireball%201).

This chunk of code is what you would paste into the bottom of your user-defined js file.

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
      // infoText 是綠色的文字。
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

### 例2：使挑釁提示適用於全職業

Currently, provoke only works for players in your alliance and not for all jobs. This example shows how to make it work for all players. The provoke trigger can be found in [ui/raidboss/data/00-misc/general.js](https://github.com/quisquous/cactbot/blob/triggers/00-misc/general.js#:~:text=General%20Provoke).

Here is a modified version with a different `condition` function. Because this shares the same `General Provoke` id with the built-in cactbot trigger, it will override the built-in version.

This chunk of code is what you would paste into the bottom of your user-defined js file.

```javascript
Options.Triggers.push({
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      id: 'General Provoke',
      netRegex: NetRegexes.ability({ id: '1D6D' }),
      condition: function(data, matches) {
        // I want to see all provokes, even they are not in the party,
        // or I am not a tank.
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
});
```

You could also just delete the `condition` function entirely here, as triggers without conditions will always run when their regex matches.

### 例3：添加自定義觸發器

You can also use this same pattern to add your own custom triggers.

Here's an example of a custom trigger that prints "Get out!!!", one second after you receive an effect called "Forked Lightning".

```javascript
Options.Triggers.push({
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      // This id is made up, and is not overriding a cactbot trigger.
      id: 'Personal Forked Lightning',
      regex: Regexes.gainsEffect({ effect: 'Forked Lightning' }),
      condition: (data, matches) => { return matches.target === data.me; },
      delaySeconds: 1,
      alertText: 'Get out!!!',
    },

    // ... other triggers here, if you want
  ],
});
```

Your best resources for learning how to write cactbot triggers is the [trigger guide](RaidbossGuide.md) and also reading through existing triggers in [ui/raidboss/data](../ui/raidboss/data).

## Raidboss時間軸自定義

Overriding a raidboss timeline is similar to [overriding a trigger](#overriding-raidboss-triggers).

The steps to override a timeline are:

1) Copy the timeline text file out of cactbot and into your user folder

    例如，您可以複製
    [ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt](../ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt)
    至 `user/the_epic_of_alexander.txt`。

1) Add a section to your user/raidboss.js file to override this.

    如同我們新增觸發器一樣，您依舊需要定義 `zoneId`、 `overrideTimelineFile: true`，
    以及定義文字檔名稱的`timelineFile` 屬性。

    ```javascript
    Options.Triggers.push({
      zoneId: ZoneId.TheEpicOfAlexanderUltimate,
      overrideTimelineFile: true,
      timelineFile: 'the_epic_of_alexander.txt',
    });
    ```


    （假設您已經做完了第一步，並且該文本檔案的名稱為 `user/the_epic_of_alexander.txt` ）
    
    設置 `overrideTimelineFile: true` 是為了告訴cactbot將內置的時間軸完全替換為您添加的檔案。

1) Edit your new timeline file in your user folder as needed

    閱讀 [時間軸指南](TimelineGuide.md) 學習更多關於時間軸的知識。

**Note**: Editing timelines is a bit risky, as there may be timeline triggers that refer to specific timeline text. For instance, in TEA, there are timeline triggers for `Fluid Swing` and `Propeller Wind`, etc. If these names are changed or removed, then the timeline triggers will also be broken.

## 行為自定義

This section discusses other kinds of customizations you can make to cactbot modules. There are some variables that are not in the config UI and are also not triggers.

Each cactbot module has an `Options` variable that controls various options. The options that can be changed are documented in the `Options` section at the top of each `ui/<name>/<name>.js` file.

For example in [ui/raidboss/raidboss.js](../ui/raidboss/raidboss.js), you see the `PlayerNicks` option which allows you to give people nicknames when their names are called out

```javascript
Options.PlayerNicks = {
  // 'Firstname Lastname': 'Nickname',
  'Banana Nana': 'Nana',
  'The Great\'one': 'Joe', // The Great'one => Joe, needs a backslash for the apostrophe
  'Viewing Cutscene': 'Cut',
  // etc, with more nicknames
};
```

**Warning**: files inside of your user directory will silently overwrite settings that were set from the cactbot configuration UI. This can be confusing, so it's generally preferable to let the config tool set everything you can, and only use user files in order to set things that the config tool does not provide access to.

## Global Trigger File Imports

User files are `eval`'d in JavaScript, and thus cannot `import` in the same way that built-in trigger files do. User javascript files have access to the following globals:

- [Conditions](../resources/conditions.ts)
- [ContentType](../resources/content_type.js)
- [NetRegexes](../resources/netregexes.ts)
- [Regexes](../resources/regexes.ts)
- [Responses](../resources/responses.js)
- [Outputs](../resources/outputs.ts)
- [Util](../resources/util.ts)
- [ZoneId](../resources/zone_id.js)
- [ZoneInfo](../resources/zone_info.js)

## 使用者檔案的除錯

### 檢查OverlayPlugin的錯誤日誌

The OverlayPlugin log is scrolling window of text that can be found by going to ACT -> Plugins -> OverlayPlugin.dll, and looking at the bottom of the window.

If there are errors, they will appear here.

### 檢查檔案是否載入

First, turn on debug mode for raidboss. Go to the cactbot configuration UI, enable `Show developer options` and reload the page. Then, enable `Enable debug mode` under Raidboss, and reload again.

When raidboss debug mode is on, it will print more information to the OverlayPlugin log. It will list lines for each local user file it loads: `[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

Verify that your user file is loaded at all.

The order that the filenames are printed is the order in which they are loaded.

### 檢查檔案是否有錯誤

User files are JavaScript, and so if you write incorrect JavaScript, there will be errors and your user file will be skipped and it will not load. Check the OverlayPlugin log for errors when loading.

Here's an example:

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.js:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 96)
```
