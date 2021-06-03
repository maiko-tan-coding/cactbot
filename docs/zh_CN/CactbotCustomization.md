# Cactbot自定义教程

🌎 [[English](../CactbotCustomization.md)] [**简体中文**] [[繁體中文](./zh-TW/CactbotCustomization.md)] [[한국어](../ko-KR/CactbotCustomization.md)]

- [使用cactbot配置界面](#使用cactbot配置界面)
- [通过cactbot配置界面改变触发器文本](#通过cactbot配置界面改变触发器文本)
- [用户文件夹概览](#用户文件夹概览)
- [设置您自己的用户文件夹](#设置您自己的用户文件夹)
- [样式自定义](#样式自定义)
- [Raidboss触发器自定义](#raidboss触发器自定义)
  - [例1：改变输出文本](#例1改变输出文本)
  - [例2：使挑衅提示适用于全职业](#例2使挑衅提示适用于全职业)
  - [例3：添加自定义触发器](#例3添加自定义触发器)
- [Raidboss时间轴自定义](#raidboss时间轴自定义)
- [行为自定义](#行为自定义)
- [用户文件的调试](#用户文件的调试)
  - [检查OverlayPlugin的错误日志](#检查OverlayPlugin的错误日志)
  - [检查文件是否加载](#检查文件是否加载)
  - [检查文件是否有错误](#检查文件是否有错误)

## 使用cactbot配置界面

自定义cactbot时，推荐使用cactbot的配置界面进行操作。 该界面位于 ACT -> Plugins -> OverlayPlugin.dll -> Cactbot。

它可以提供如下功能：

- 设置触发器输出TTS
- 禁用触发器
- 改变触发器输出
- 改变cactbot语言
- 音量设置
- 隐藏奶酪图标

您可能无法通过cactbot配置界面以配置所有您想要的更改。 但是它是最容易的方法，适合作为您定制化的第一步。 以后此界面会添加更多的选项。

此处的选项会存储于 `%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json` 文件中。 但您并不需要也不应当直接修改该文件。

## 通过cactbot配置界面改变触发器文本

在位于ACT-> 插件> OverlayPlugin.dll-> Cactbot-> Raidboss的cactbot配置界面中， 罗列着所有的触发器。 这里的列表让您可以更改每个触发器支持外部更改的配置设置。

名称旁边带有铃铛(🔔) 的设置项的触发器输出文本是可以被覆盖的。 举个例子，假设有一个🔔onTarget字段，其文本为 `死刑点${player}`。 当某人接到死刑技能时，这个字符串将出现在屏幕上（或通过tts播报）。 `${player}` 是一个将由触发器动态设置的参数。 任何类似于 `${param}` 的字符串都是动态参数。

比如，您可以将这个文本更改为 `${player} 即将死亡！`。 或者，也许您不关心谁是目标，那么您可以将其改为 `死刑` 以使文本更加简短。 如果您想撤消自己的更改，只需清空文本框即可。

但这个方式有一定的限制。 例如，您无法更改逻辑。 而且在大多数情况下，您无法使 `tts` 的播报与 `alarmText` 不同。 您无法添加更多的参数。 如果您想要对触发器做出更加复杂的覆盖操作， 那么您需要查看 [Raidboss触发器自定义](#raidboss触发器自定义) 小节。

## 用户文件夹概览

若cactbot配置界面不存在您所需的选项，您可能需要考虑以用户文件覆盖的方式进行自定义。 您需要编写JavaScript代码和CSS样式，这意味着您可能需要掌握一点点编程知识。

Cactbot的设计哲学要求任何用户的自定义配置应当存放于用户文件夹的文件中。 同时这也能防止您所做的更改在今后cactbot的更新中被覆盖失效。 另外，目前您无法通过直接修改cactbot的文件应用您的更改，除非您了解如何构建您自己的项目。

所有的cactbot模块都会从 [user/](../../user/) 文件夹加载用户设置。 `raidboss` 模块会加载 `user/raidboss.js` 与 `user/raidboss.css`，以及所有`user/raidboss/` 目录下及其子目录下的 `.js` 和 `.css` 文件。 (时间轴`.txt`文件必须与引用它们的`.js`文件放在同一个文件夹中。) 这些用户自定义文件将在cactbot自身加载完毕后被加载，并可以覆盖对应的模块的设置。

`oopsyraidsy` 模块会加载 `user/oopsyraidsy.js` 与 `user/oopsyraidsy.css`，以及`user/oopsyraidsy/` 目录下的所有 `.js` 和 `.css` 文件。 依此类推，每个模块都支持以此方式（以文件名）加载对应自定义文件。

cactbot将按照字母顺序优先加载user文件夹中的子文件夹里的文件，其次加载子文件夹外的文件。 这就是为什么`user/raidboss.js`文件总是最后被加载并可以覆盖`user/raidboss/`文件夹中任何文件中的配置。 例如，`user/alphascape/some_file.js` 先加载， `user/mystatic/some_file.js` 再加载，最后是`user/raidboss.js` 加载。 `.css` 文件遵循同样的顺序。

在本文档中，“用户自定义js文件”指代以上两者。 除了加载顺序以外，`user/raidboss.js` 和 `user/raidboss/some_file.js` 没有区别。 同样地，“用户自定义css文件”同时指代 `user/radar.css` 和 `user/radar/some_file.css` 二者。 用户文件夹中分出子目录是为了让分享触发器和自定义配置更容易。

当开发者模式开启时，你可以从[调试信息](#检查文件是否加载)中得到更多关于加载顺序的信息。

`user/` 文件夹中包含了一部分示例配置文件，您可以对其重命名并直接使用。 如 [user/raidboss-example.js](../../user/raidboss-example.js) 文件 可被重命名为 `user/raidboss.js`，对其所做的更改可应用于 `raidboss` 模块。

在修改了这些文件之后，单击ACT中OverlayPlugin插件对应悬浮窗设置中的“重载悬浮窗”按钮，即可应用更改。

## 设置您自己的用户文件夹

您可以通过cactbot配置界面设置用户文件夹： ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> cactbot用户文件夹。 单击 `选择文件夹` 按钮，选择磁盘上的一个文件夹。

如果没有选择，cactbot将自动选择其安装目录下的默认文件夹。

建议您选择cactbot安装目录下的 `cactbot/user` 文件夹。 该文件夹通常为位于 `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`。 有部分示例配置文件位于 [此文件夹](../../user) 下。

## 样式自定义

用户自定义css文件可以对UI模块的位置、尺寸、颜色等进行自定义。 可用的选择器可以通过阅览 `ui/<name>/<name>.css` 文件找到。

例如您在 [ui/raidboss/raidboss.css](../../ui/raidboss/raidboss.css) 中，可发现诸如 `#popup-text-container` 与 `#timeline-container` 等选择器， 则您可以在 `user/raidboss.css` 中对其位置进行自定义。 您可以在 `user/raidboss.css` 中或其他 `user/raidboss/` 下的 `.css` 中添加更多的样式。

同样地，您可以在 `.info-text` 类中添加新的CSS规则，对信息文字的尺寸和颜色进行自定义。 例如：

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

简单地说，您可以认为cactbot会将用户文件中的CSS规则添加至内置CSS文件的末尾。 也就是说，您需要注意 [CSS优先级规则](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)， 例如添加 `!important` 让您的规则可以强制覆盖。 另一方面，您可能需要重置某些属性为默认的 `auto` 值。

我们推荐使用 [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) 以调试CSS问题。 您可以通过 ACT -> Plugins -> OverlayPlugin.dll -> 您的悬浮窗名字 -> 启动Debug工具 以开启DevTools。

**注意**：某些组件的自定义较为困难，甚至无法进行自定义，如时间轴的进度条等。 原因是，这些组件属于自定义HTML元素，且没有开放外部配置的接口。 如果您有特别的需求，但是不知道如何修改，您可以提出一个 [github issue](https://github.com/quisquous/cactbot/issues/new/choose)。

**警告**：cactbot不保证CSS的向后兼容性。 在以后的更改中，cactbot可能会重新组织网页结构，改变元素名称和类名称，甚至完全重构所有样式。 因此，您需知晓您的自定义CSS有在将来出现问题的风险。

## Raidboss触发器自定义

您可以通过用户自定义js文件(例如 `user/raidboss.js` 或 `user/raidboss/` 目录下的任意`.js` 文件)自定义触发器行为。 您可以修改输出文本、适用职业、文本显示的时间等等。

You can see readable JavaScript versions of all of the cactbot triggers in this branch: <https://github.com/quisquous/cactbot/tree/triggers> This is the preferred reference to use for viewing, copying, and pasting. Triggers in the main branch or shipped in a cactbot release are often in unreadable bundles or are TypeScript which is not supported in user folders.

In your user-defined js file for raidboss, there is an `Options.Triggers` list that contains a list of trigger sets. You can use this to append new triggers and modify existing triggers. If a user file contains a trigger with the same id as any previous trigger (including triggers in cactbot), then that trigger will override it.

If you are going to modify triggers, it is worth reading the [trigger guide](RaidbossGuide.md) to understand what the various fields of each trigger means.

In general, the pattern to follow is to add a block of code to your user-defined js file (e.g. `user/raidboss.js`) that looks like this:

```javascript
Options.Triggers.push({
  // 在文件开头定义ZoneId，
  // 例如 ZoneId.MatchAll (指定所有区域) 或 ZoneId.TheBozjanSouthernFront 等
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // 这里定义的是触发器(trigger)对象。
      // 例如 id, netRegex或infoText等
    },
  ],
});
```

The easiest approach to modify triggers is to copy and paste the block of code above for each trigger. Modify the `zoneId` line to have the zone id for the zone you care about, usually from the top of the cactbot trigger file. [This file](../resources/zone_id.js) has a list of all the zone ids. If you specify one incorrectly, you will get a warning in the OverlayPlugin log window. Then, [copy the trigger text](https://github.com/quisquous/cactbot/tree/triggers) into this block. Edit as needed. Repeat for all the triggers you want to modify. Reload your raidboss overlay to apply your changes.

**Note**: This method completely removes the original trigger, and so do not delete any logic when making edits. Also, this is JavaScript, and so it still needs to be valid JavaScript. If you are not a programmer, be extra careful with what and how you edit.

### 例1：改变输出文本

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
      // infoText 是绿色的文字。
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

### 例2：使挑衅提示适用于全职业

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

### 例3：添加自定义触发器

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

## Raidboss时间轴自定义

Overriding a raidboss timeline is similar to [overriding a trigger](#overriding-raidboss-triggers).

The steps to override a timeline are:

1) Copy the timeline text file out of cactbot and into your user folder

    例如，您可以复制
    [ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt](../ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt)
    至 `user/the_epic_of_alexander.txt`。

1) Add a section to your user/raidboss.js file to override this.

    如同我们添加触发器一样，您依旧需要定义 `zoneId`、 `overrideTimelineFile: true`，
    以及定义文本文件名称的`timelineFile` 属性。

    ```javascript
    Options.Triggers.push({
      zoneId: ZoneId.TheEpicOfAlexanderUltimate,
      overrideTimelineFile: true,
      timelineFile: 'the_epic_of_alexander.txt',
    });
    ```


    （假设您已经做完了第一步，并且该文本文件的名称为 `user/the_epic_of_alexander.txt` ）
    
    设置 `overrideTimelineFile: true` 是为了告诉cactbot将内置的时间轴完全替换为您添加的文件。

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

## 用户文件的调试

### 检查OverlayPlugin的错误日志

The OverlayPlugin log is scrolling window of text that can be found by going to ACT -> Plugins -> OverlayPlugin.dll, and looking at the bottom of the window.

If there are errors, they will appear here.

### 检查文件是否加载

First, turn on debug mode for raidboss. Go to the cactbot configuration UI, enable `Show developer options` and reload the page. Then, enable `Enable debug mode` under Raidboss, and reload again.

When raidboss debug mode is on, it will print more information to the OverlayPlugin log. It will list lines for each local user file it loads: `[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

Verify that your user file is loaded at all.

The order that the filenames are printed is the order in which they are loaded.

### 检查文件是否有错误

User files are JavaScript, and so if you write incorrect JavaScript, there will be errors and your user file will be skipped and it will not load. Check the OverlayPlugin log for errors when loading.

Here's an example:

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.js:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 96)
```
