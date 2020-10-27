# Cactbot自定义教程

🌎 [**English**] [[한국어](./ko-KR/CactbotCustomization.md)]

- [使用cactbot配置界面](#使用cactbot配置界面)
- [用户文件夹概览](#用户文件夹概览)
- [设置您自己的用户文件夹](#设置您自己的用户文件夹)
- [样式自定义](#样式自定义)
- [Raidboss触发器自定义](#raidboss触发器自定义)
  - [例1：改变输出文本](#example-1-changing-the-output-text)
  - [例2：使挑衅提示适用于全职业](#example-2-making-provoke-work-for-all-jobs)
  - [例3：添加自定义触发器](#example-3-adding-custom-triggers)
- [Raidboss时间轴自定义](#raidboss时间轴自定义)
- [行为自定义](#行为自定义)
- [用户文件的调试](#用户文件的调试)
  - [检查OverlayPlugin的错误日志](#检查OverlayPlugin的错误日志)
  - [检查文件是否加载](#检查文件是否加载)
  - [检查文件是否有错误](#检查文件是否有错误)

## 使用cactbot配置界面

The best way to customize cactbot is to use the cactbot configuration UI. This is under ACT -> Plugins -> OverlayPlugin.dll -> Cactbot.

This has options for things like:

- 设置触发器输出TTS
- 禁用触发器
- 改变cactbot语言
- 音量设置
- 隐藏奶酪图标

It is not possible to configure everything you might want through the cactbot configuration UI. However, it is the easiest place to start with. Over time, more options will be added there.

These options are stored in your `%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json` file. You should not need to edit that file directly.

## 用户文件夹概览

If the cactbot UI doesn't have the option you are looking for, then you may need to consider user file overrides. At this point, you are writing JavaScript and CSS, and so you might need a little bit of programming savvy.

The general philosophy of cactbot is that any user configuration should only go in files in the user directory. This will prevent your changes from being overwritten during future cactbot updates. Additionally, in the future modifying cactbot files directly from a cactbot release will not work properly without running extra build steps.

All cactbot UI modules can load user settings from the [user/](../user/) directory. The `raidboss` module loads `user/raidboss.js` and `user/raidboss.css`. The `oopsyraidsy` module loads `user/oopsyraidsy.js` and `user/oopsyraidsy.css`. And so on, for each module. These files are included after cactbot's files and can override its settings.

The `user/` directory already includes some example configuration files, which you can rename and use. For example the [user/raidboss-example.js](../user/raidboss-example.js) file can be renamed to `user/raidboss.js` and edited to change the behavior of the `raidboss` module.

After making any changes to these files, pressing the "Reload overlay" button for the appropriate overlay in ACT's OverlayPlugin settings will apply the changes.

## 设置您自己的用户文件夹

The cactbot user directory can be set via the cactbot configuration UI: ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> Cactbot user directory. Click the `Choose Directory` button and select a folder on disk.

If you haven't selected one, it will try to select one based on where you have installed cactbot on disk.

Ideally, you should select the `cactbot/user` folder from your cactbot installation. This is often in `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`. [This folder](../user) has example customization files.

## 样式自定义

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

## Raidboss触发器自定义

You can use your `cactbot/user/raidboss.js` to override how triggers behave. You can change the text that they output, what jobs they run for, and how long they stay on screen, and anything else.

In `cactbot/user/raidboss.js`, there is an `Options.Triggers` list that contains a list of trigger sets. You can use this to append new triggers and modify existing triggers. If a user file contains a trigger with the same id as any previous trigger (including triggers in cactbot), then that trigger will override it.

If you are going to modify triggers, it is worth reading the [trigger guide](RaidbossGuide.md) to understand what the various fields of each trigger means.

In general, the pattern to follow is to add a block of code to your `cactbot/user/raidboss.js` line that looks like this:

```javascript
Options.Triggers.push({
  // 在文件开头定义ZoneId，
  // 例如 ZoneId.MatchAll (指定所有区域) 或ZoneId.TheBozjanSouthernFront 等
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // 这里定义的是触发器(trigger)对象。
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // 这里定义的是触发器(trigger)对象。
      // 例如 id, netRegex或infoText等
    },
  ],
});
```

The easiest approach to modify triggers is to copy and paste the block of code above for each trigger. Modify the `zoneId` line to have the zone id for the zone you care about, usually from the top of the cactbot trigger file. [This file](../resources/zone_id.js) has a list of all the zone ids. If you specify one incorrectly, you will get a warning in the OverlayPlugin log window. Then, copy the trigger text into this block. Edit as needed. Repeat for all the triggers you want to modify. Reload your raidboss overlay to apply your changes.

**Note**: This method completely removes the original trigger, and so do not delete any logic when making edits. Also, this is JavaScript, and so it still needs to be valid JavaScript. If you are not a programmer, be extra careful with what and how you edit.

### 例1：改变输出文本

Let's say hypothetically that you are doing UCOB and your group decides that they are going to do fire out first instead of fire in first like cactbot calls it by default.

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
      // infoText 是绿色的文字。
      infoText: {
        en: 'Fire OUT',
      },
      run: function(data) {
        data.naelFireballCount = 1;
      },
    },
  ],
});
```

This edit also replaced the `tts` section and removed other languages other than English.

### 例2：使挑衅提示适用于全职业

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
        // 我希望看到所有的挑衅提示，即便他们不在我的队伍中，
        // 即便我不是坦克。
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

### 例3：添加自定义触发器

You can also use this same pattern to add your own custom triggers.

Here's an example of a custom trigger that prints "Get out!!!", one second after you receive an effect called "Forked Lightning".

```javascript
Options.Triggers.push([
  {
    zoneId: ZoneId.MatchAll,
    triggers: [
      {
        // 这是一个自定义的id，因此不会覆盖任何现有的触发器。
        id: 'Personal Forked Lightning',
        regex: Regexes.gainsEffect({ effect: 'Forked Lightning' }),
        condition: (data, matches) => { return matches.target === data.me; },
        delaySeconds: 1,
        alertText: 'Get out!!!',
      },

      // 您的其他触发器……
    ],
  },

  // 其他区域的触发器集合……
]);
```

Your best resources for learning how to write cactbot triggers is the [trigger guide](RaidbossGuide.md) and also reading through existing triggers in [ui/raidboss/data](../ui/raidboss/data).

## Raidboss时间轴自定义

Overriding a raidboss timeline is similar to [overriding a trigger](#overriding-raidboss-triggers).

The steps to override a timeline are:

1) Copy the timeline text file out of cactbot and into your user folder

    例如，您可以复制
    [ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt](../ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt)
    至 `user/the_epic_of_alexander.txt`。

1) Add a section to your user/raidboss.js file to override this.

    如同我们添加触发器一样，您依旧需要定义 `zoneId`，
    以及 `overrideTimelineFile: true`，
    `timelineFile` 的值必须是文本文件的名称。

    ```javascript
    Options.Triggers.push({
      zoneId: ZoneId.TheEpicOfAlexanderUltimate,
      overrideTimelineFile: true,
      timelineFile: 'the_epic_of_alexander.txt',
    });
    ```


    此时，我们假设您已经做完了第一步，并且该文本文件的名称为 `user/the_epic_of_alexander.txt` 。
    
    设置 `overrideTimelineFile: true`，
    告诉cactbot将内置的时间轴完全替换为您添加的文件。

1) Edit your new timeline file in your user folder as needed

    阅读 [时间轴指南](TimelineGuide.md) 学习更多关于时间轴的知识。

**Note**: Editing timelines is a bit risky, as there may be timeline triggers that refer to specific timeline text. For instance, in TEA, there are timeline triggers for `Fluid Swing` and `Propeller Wind`, etc. If these names are changed or removed, then the timeline triggers will also be broken.

## 行为自定义

This section discusses other kinds of customizations you can make to cactbot modules. There are some variables that are not in the config UI and are also not triggers.

Each cactbot module has an `Options` variable that controls various options. The options that can be changed are documented in the `Options` section at the top of each `ui/<name>/<name>.js` file.

For example in [ui/raidboss/raidboss.js](../ui/raidboss/raidboss.js), you see the `PlayerNicks` option which allows you to give people nicknames when their names are called out

```javascript
Options.PlayerNicks = {
  // 'Firstname Lastname': 'Nickname',
  'Banana Nana', 'Nana',
  'The Great\'one', 'Joe', // The Great'one => Joe 这里需要一个反斜杠转义单引号
  'Viewing Cutscene': 'Cut',
  // 等等
};
```

**Warning**: files inside of your user directory will silently overwrite settings that were set from the cactbot configuration UI. This can be confusing, so it's generally preferable to let the config tool set everything you can, and only use user files in order to set things that the config tool does not provide access to.

## 用户文件的调试

### 检查OverlayPlugin的错误日志

The OverlayPlugin log is scrolling window of text that can be found by going to ACT -> Plugins -> OverlayPlugin.dll, and looking at the bottom of the window.

If there are errors, they will appear here.

### 检查文件是否加载

First, turn on debug mode for raidboss. Go to the cactbot configuration UI, enable `Show developer options` and reload the page. Then, enable `Enable debug mode` under Raidboss, and reload again.

When raidboss debug mode is on, it will print more information to the OverlayPlugin log. It will list lines for each local user file it loads: `[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

Verify that your user file is loaded at all.

### 检查文件是否有错误

User files are JavaScript, and so if you write incorrect JavaScript, there will be errors and your user file will be skipped and it will not load. Check the OverlayPlugin log for errors when loading.

Here's an example:

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.js:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 96)
```
