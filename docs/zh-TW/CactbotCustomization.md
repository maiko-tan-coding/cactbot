# Cactbot自訂教學

🌎 [**English**] [[简体中文](./zh-CN/CactbotCustomization.md)] [[한국어](./ko-KR/CactbotCustomization.md)]

- [藉由cactbot使用者介面](#藉由cactbot使用者介面)
- [透過cactbot使用者介面改變觸發器文本](#changing-trigger-text-with-the-cactbot-ui)
- [用戶資料夾概況](#user-directory-overview)
- [設置您自己的用戶資料夾](#setting-your-user-directory)
- [樣式自定義](#customizing-appearance)
- [Raidboss觸發器自訂](#overriding-raidboss-triggers)
  - [例1：改變輸出文本](#example-1-changing-the-output-text)
  - [例2：使挑釁提示適用於全職業](#example-2-making-provoke-work-for-all-jobs)
  - [例3：添加自訂觸發器](#example-3-adding-custom-triggers)
- [Raidboss時間軸自訂](#overriding-raidboss-timelines)
- [行為自訂](#customizing-behavior)
- [用戶檔案的除錯](#debugging-user-files)
  - [檢查OverlayPlugin的錯誤日誌](#check-the-overlayplugin-log-for-errors)
  - [檢查檔案是否載入](#check-if-your-file-is-loaded)
  - [檢查檔案是否有錯誤](#check-if-your-user-file-has-errors)

## 藉由cactbot使用者介面

自訂cactbot時，推薦透過cactbot的使用者介面進行操作。 該介面處於 ACT -> Plugins -> OverlayPlugin.dll -> Cactbot。

它可以提供如下功能：

- 設置觸發器輸出TTS
- 禁用觸發器
- 改變觸發器輸出
- 改變cactbot語言
- 音量設置
- 隱藏起司圖標

您可能無法透過cactbot使用者介面更改所有配置項。 但是它是最容易的方法，適合作為您定制化的第一步。 以後此介面會添加更多的選項。

此處的選項會存儲於 `%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json` 檔案中。 但您並不需要也不應當直接修改該檔案。

## 透過cactbot使用者介面改變觸發器文本

In the cactbot configuration UI, under ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> Raidboss, there are individual trigger listings. You can use these listings to change various exposed configuration settings per trigger.

Settings with a bell (🔔) next to their name are trigger mostly outputs that you can override. For example, maybe there's an 🔔onTarget field whose text is `Tank Buster on ${name}`. This is the string that will get played on screen (or via tts) when there is a tank buster on some person. `${name}` here is a parameter that will be set dynamically by the trigger. Anything that looks like `${param}` is such a dynamic parameter.

You could change this to say `${name} is going to die!` instead. Or, maybe you don't care who it's on, and you can edit the text to `Buster` to be brief. If you want to undo your overriding, just clear the text.

There are some limitations to this overriding. You cannot change the logic. You cannot make `tts` to say something different than the `alarmText` in most cases. You cannot add additional parameters. If you want to do any of these more complicated overrides, then you will want to look at the [Overriding Raidboss Triggers](#overriding-raidboss-triggers) section.

## 用戶資料夾概況

若cactbot使用者介面不存在您所需的選項，您可能需要考慮以用戶檔案覆蓋的方式進行自訂。 您需要編寫JavaScript程式碼和CSS樣式，這意味著您可能需要掌握一點點編程知識。

Cactbot的設計哲學要求任何用戶的自訂配置應當存放於用戶資料夾的檔案中。 同時這也能防止您所做的更改在今後cactbot的更新中被覆蓋失效。 不僅如此，以後您將無法通過直接修改cactbot的檔案應用您的更改，除非您了解如何編譯您自己的項目。

所有的cactbot模組都會從 [user/](../../user/) 資料夾載入用戶設置。 `raidboss` 模組會載入 `user/raidboss.js` 與 `user/raidboss.css`。 `oopsyraidsy` 模組會載入 `user/oopsyraidsy.js` 與 `user/oopsyraidsy.css`。 以此類推，每一個模組都支持此方式。 這些檔案在cactbot自身載入完成後被載入，並可以覆蓋對應的模組的設置。

`user/` 資料夾中包含了一部分示例配置檔案，您可以對其重命名並直接使用。 如 [user/raidboss-example.js](../../user/raidboss-example.js) 檔案可被重命名為`user/raidboss.js` ，對其所做的更改可應用於`raidboss` 模組。

在修改了這些檔案之後，單擊ACT中OverlayPlugin外掛設置中的“重載懸浮窗”按鈕，即可應用更改。

## 設置您自己的用戶資料夾

您可以透過cactbot配置界面設置用戶資料夾： ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> cactbot用戶文件夾。 單擊 `選擇文件夾` 按鈕，選擇硬碟上的一個資料夾。

If you haven't selected one, it will try to select one based on where you have installed cactbot on disk.

Ideally, you should select the `cactbot/user` folder from your cactbot installation. This is often in `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`. [This folder](../user) has example customization files.

## 樣式自定義

The `user/<name>.css` file can change positions, sizes, colors, etc. for components of the UI module. See the `ui/<name>/<name>.css` to find the selectors you can modify.

For example in [ui/raidboss/raidboss.css](../ui/raidboss/raidboss.css), you see the `#popup-text-container` and `#timeline-container` which can be changed via `user/raidboss.css` to different positions as desired. You can use `user/raidboss.css` to add additional styling.

The size and color of info text alerts can also be changed by making a CSS rule for the `.info-text` class such as below:

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

You can think about the CSS in the user file as being appended to the end of any built-in cactbot CSS file. Therefore, you need to keep in mind [CSS specificity rules](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity), possibly adding `!important` to force your rule to override. Additionally, you may need to unset properties by setting them to `auto`.

The best way to debug CSS issues is to use [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools). You can open DevTools for an overlay by going to ACT -> Plugins -> OverlayPlugin.dll -> your overlay -> Open DevTools.

**Note**: some things are hard or impossible to customize, such as the timeline bars. This is because they use custom elements, and they don't expose a lot of knobs to tune. If you have particular things you want to change about the timeline bars that you can't, please feel free to submit a [github issue](https://github.com/quisquous/cactbot/issues/new/choose).

**Warning**: cactbot makes no guarantees about preserving CSS backwards compatability. Future changes to cactbot may rearrange elements, change element names and classes, or change styling entirely. In general, you are on your own if you want to style cactbot with CSS.

## Raidboss觸發器自訂

You can use your `cactbot/user/raidboss.js` to override how triggers behave. You can change the text that they output, what jobs they run for, and how long they stay on screen, and anything else.

In `cactbot/user/raidboss.js`, there is an `Options.Triggers` list that contains a list of trigger sets. You can use this to append new triggers and modify existing triggers. If a user file contains a trigger with the same id as any previous trigger (including triggers in cactbot), then that trigger will override it.

If you are going to modify triggers, it is worth reading the [trigger guide](RaidbossGuide.md) to understand what the various fields of each trigger means.

In general, the pattern to follow is to add a block of code to your `cactbot/user/raidboss.js` line that looks like this:

```javascript
Options.Triggers.push({
  // Find the ZoneId from the top of the file,
  // e.g. ZoneId.MatchAll (for all zones) or ZoneId.TheBozjanSouthernFront.
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // This is where you put the trigger object.
      // e.g. id or netRegex or infoText
    },
  ],
});
```

The easiest approach to modify triggers is to copy and paste the block of code above for each trigger. Modify the `zoneId` line to have the zone id for the zone you care about, usually from the top of the cactbot trigger file. [This file](../resources/zone_id.js) has a list of all the zone ids. If you specify one incorrectly, you will get a warning in the OverlayPlugin log window. Then, copy the trigger text into this block. Edit as needed. Repeat for all the triggers you want to modify. Reload your raidboss overlay to apply your changes.

**Note**: This method completely removes the original trigger, and so do not delete any logic when making edits. Also, this is JavaScript, and so it still needs to be valid JavaScript. If you are not a programmer, be extra careful with what and how you edit.

### 例1：改變輸出文本

Let's say hypothetically that you are doing UCOB and your group decides that they are going to do "fire out" first instead of "fire in" first like cactbot calls it by default. Additionally, you *also* want to have the tts say something different for this trigger. You keep forgetting to get out, so you want it to repeat a few times.

If you only wanted to change the `infoText`, you could do this via [Changing Trigger Text with the cactbot UI](#changing-trigger-text-with-the-cactbot-ui).

One way to adjust this is to edit the trigger output for this trigger. You can find the original fireball #1 trigger in [ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js](https://github.com/quisquous/cactbot/blob/cce8bc6b10d2210fa512bd1c8edd39c260cc3df8/ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js#L715-L743).

This chunk of code is what you would paste into the bottom of your `cactbot/user/raidboss.js` file.

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
      // The infoText is what appears on screen in green.
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

Currently, provoke only works for players in your alliance and not for all jobs. This example shows how to make it work for all players. The provoke trigger can be found in [ui/raidboss/data/00-misc/general.js](https://github.com/quisquous/cactbot/blob/cce8bc6b10d2210fa512bd1c8edd39c260cc3df8/ui/raidboss/data/00-misc/general.js#L11-L30).

Here is a modified version with a different `condition` function. Because this shares the same `General Provoke` id with the built-in cactbot trigger, it will override the built-in version.

This chunk of code is what you would paste into the bottom of your `cactbot/user/raidboss.js` file.

```javascript
Options.Triggers.push([{
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
]);
```

You could also just delete the `condition` function entirely here, as triggers without conditions will always run when their regex matches.

### 例3：添加自訂觸發器

You can also use this same pattern to add your own custom triggers.

Here's an example of a custom trigger that prints "Get out!!!", one second after you receive an effect called "Forked Lightning".

```javascript
Options.Triggers.push([
  {
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
  },

  // ... other zones here, if you want
]);
```

Your best resources for learning how to write cactbot triggers is the [trigger guide](RaidbossGuide.md) and also reading through existing triggers in [ui/raidboss/data](../ui/raidboss/data).

## Raidboss時間軸自訂

Overriding a raidboss timeline is similar to [overriding a trigger](#overriding-raidboss-triggers).

The steps to override a timeline are:

1) Copy the timeline text file out of cactbot and into your user folder

    For example, you could copy
    [ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt](../ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt)
    to `user/the_epic_of_alexander.txt`.

1) Add a section to your user/raidboss.js file to override this.

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

## 行為自訂

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

## 用戶檔案的除錯

### 檢查OverlayPlugin的錯誤日誌

The OverlayPlugin log is scrolling window of text that can be found by going to ACT -> Plugins -> OverlayPlugin.dll, and looking at the bottom of the window.

If there are errors, they will appear here.

### 檢查檔案是否載入

First, turn on debug mode for raidboss. Go to the cactbot configuration UI, enable `Show developer options` and reload the page. Then, enable `Enable debug mode` under Raidboss, and reload again.

When raidboss debug mode is on, it will print more information to the OverlayPlugin log. It will list lines for each local user file it loads: `[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

Verify that your user file is loaded at all.

### 檢查檔案是否有錯誤

User files are JavaScript, and so if you write incorrect JavaScript, there will be errors and your user file will be skipped and it will not load. Check the OverlayPlugin log for errors when loading.

Here's an example:

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.js:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 96)
```
