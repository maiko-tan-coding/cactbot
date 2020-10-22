# Cactbot自定义教程

- [使用cactbot配置界面](#using-the-cactbot-ui)
- [用户文件夹概览](#user-directory-overview)
- [设置您自己的用户文件夹](#setting-your-user-directory)
- [样式自定义](#customizing-appearance)
- [Raidboss触发器自定义](#overriding-raidboss-triggers)
  - [例1：改变输出文本](#example-1--changing-the-output-text)
  - [例2：使挑衅提示适用于全职业](#example-2--making-provoke-work-for-all-jobs)
  - [例3：添加自定义触发器](#example-3--adding-custom-triggers)
- [Raidboss时间轴自定义](#overriding-raidboss-timelines)
- [行为自定义](#customizing-behavior)
- [用户文件的调试](#debugging-user-files)
  - [检查OverlayPlugin的错误日志](#check-the-overlayplugin-log-for-errors)
  - [检查文件是否加载](#check-if-your-file-is-loaded)
  - [检查文件是否有错误](#check-if-your-user-file-has-errors)

## 使用cactbot配置界面

自定义cactbot时，推荐使用cactbot的配置界面进行操作。 该界面位于 ACT -> Plugins -> OverlayPlugin.dll -> Cactbot。

它可以提供如下功能：

- 设置触发器输出TTS
- 禁用触发器
- 改变cactbot语言
- 音量设置
- 隐藏奶酪图标

您可能无法通过cactbot配置界面以配置所有您想要的更改。 但是，作为定制化的起步，这是最简单的方式。 以后此界面会添加更多的选项。

此处的选项会存储于 `%APPDATA%\Advanced Combat Tracker\Config\RainbowMage.OverlayPlugin.config.json` 文件中。 但您并不需要也不应当直接修改该文件。

## 用户文件夹概览

若cactbot配置界面不存在您所需的选项，您可能需要考虑以用户文件覆盖的方式进行自定义。 您需要编写JavaScript代码和CSS样式，这意味着您可能需要掌握一些编程知识。

Cactbot的设计哲学要求任何用户的自定义配置应当存放于用户文件夹的文件中。 同时这也能防止您所做的更改在今后cactbot的更新中被覆盖失效。 不仅如此，以后您无法通过直接修改cactbot的文件应用您的更改，除非您了解如何构建您自己的项目。

所有的cactbot模块都会从 [user/](../user/) 文件夹加载用户设置。 `raidboss` 模块会加载 `user/raidboss.js` 与 `user/raidboss.css`。 `oopsyraidsy` 模块会加载 `user/oopsyraidsy.js` 与 `user/oopsyraidsy.css`。 以此类推，每一个模块都支持此方式。 这些文件在cactbot自身加载完成后被加载，并可以覆盖对应的模块的设置。

`user/` 文件夹中包含了一部分示例配置文件，您可以对其重命名并直接使用。 如 [user/raidboss-example.js](../user/raidboss-example.js) 文件 可被重命名为 `user/raidboss.js`，对其所做的更改可应用于 `raidboss` 模块。

在修改了这些文件之后，单击ACT中OverlayPlugin插件设置中的“重载悬浮窗”按钮，即可应用更改。

## 设置您自己的用户文件夹

您可以通过cactbot配置界面设置此用户文件夹： ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> cactbot用户文件夹 单击 `选择文件夹` 按钮，选择磁盘上的一个文件夹。

若您没有做出有效选择，cactbot会尝试使用自己的安装目录作为其值。

理想情况下，您应当选择cactbot安装目录下的 `cactbot/user` 文件夹。 该文件夹通常为位于 `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`。 有部分示例配置文件位于 [此文件夹](../docs) 下。

## 样式自定义

您可以通过修改 `user/<name>.css` 文件 (<0>name<0>为模块名称，下同)，对UI模块的位置、尺寸、颜色等进行自定义。 您可以通过阅览 `ui/<name>/<name>.css` 文件，寻找可用的选择器。

如您在 [ui/raidboss/raidboss.css](../ui/raidboss/raidboss.css) 中 可发现诸如 `#popup-text-container` 与 `#timeline-container` 等选择器， 则您可以在 `user/raidboss.css` 中对其位置进行自定义。 您可以在 `user/raidboss.css` 中添加更多的样式。

同样地，您可以通过修改 `.info-text` 类，添加新的CSS规则，以对信息文字的尺寸和颜色进行自定义。

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

简单地说，您可以认为cactbot会将用户文件中的CSS规则添加至内置CSS规则的末尾。 也就是说，您需要注意 [CSS优先级规则](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)， 例如添加 `!important` 让您的规则可以强制覆盖。 另一方面，您可能需要重置某些属性为默认的 `auto` 值。

我们推荐使用 [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) 以调试CSS问题。 您可以通过 ACT -> Plugins -> OverlayPlugin.dll -> 您的悬浮窗名字 -> 启动Debug工具 以开启DevTools。

**注意**：某些组件的自定义较为困难，甚至无法进行自定义，如时间轴的进度条等。 原因是，这些组件属于自定义HTML元素，且没有导出所有的可配置项。 如果您有特别的需求，但是您不知道如何修改此进度条，您可以提出一个 [github issue](https://github.com/quisquous/cactbot/issues/new/choose)。

**警告**：cactbot不保证CSS的向后兼容性。 在以后的更改中，cactbot可能会重新组织网页结构，改变元素名称和类名称，甚至完全重构所有样式。 因此，您应当承担您的自定义CSS的问题的风险。

## Raidboss触发器自定义

您可以通过 `cactbot/user/raidboss.js` 文件自定义触发器行为。 您可以修改输出文本、适用职业、界面滞留时间等等。

在 `cactbot/user/raidboss.js` 文件中， `Options.Triggers` 是一个存放了触发器集合的列表。 您可以通过此变量添加新触发器，或修改已有的触发器。 若用户文件中存在了与现有的触发器 (cactbot官方提供的) 相同id的触发器，则新触发器会覆盖其行为。

在您修改触发器前，我们推荐阅读 [trigger guide](RaidbossGuide.md) 以了解各触发器的诸多字段的含义。

通常情况下，在 `cactbot/user/raidboss.js` 中添加的代码应当是如下所示：

```javascript
Options.Triggers.push({
  // 在文件开头定义ZoneId，
  // 例如 ZoneId.MatchAll (指定所有区域) 或ZoneId.TheBozjanSouthernFront 等
  zoneId: ZoneId.PutTheZoneFromTheTopOfTheFileHere,
  triggers: [
    {
      // 这里定义的是触发器(trigger)对象。
      // 例如 id, netRegex或infoText等
    },
  ],
});
```

最简单的方式是直接复制对应的触发器代码并粘贴到此文件再进行修改。 您可以修改 `zoneId` 一行为您想要触发器响应的区域id，这一行通常位于cactbot触发器文件的顶部。 [该文件](../resources/zone_id.js) 列出了所有可用的区域id。 若您定义了错误的id，OverlayPlugin的日志窗口将会输出警告信息。 然后复制触发器文本并粘贴至此。 按您的喜好进行修改。 对您想修改的所有触发器均进行此步骤。 重载raidboss悬浮窗以应用更改。

**注意**：此方式会将原触发器完全移除，因此请在修改时不要删除任何逻辑。 此外，触发器均采用JavaScript编写，因此必须采用标准JavaScript语法。 若您不是程序员，您需要格外注意编辑方法。

### 例1：改变输出文本

Let's say hypothetically that you are doing UCOB and your group decides that they are going to do fire out first instead of fire in first like cactbot calls it by default.

其中一种调整方式是编辑触发器的输出。 您可以在 [ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js](https://github.com/quisquous/cactbot/blob/cce8bc6b10d2210fa512bd1c8edd39c260cc3df8/ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js#L715-L743) 中找到原本的 fireball #1 触发器。

您需要将以下的代码粘贴至您的 `cactbot/user/raidboss.js` 中。

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

### Example 2: making provoke work for all jobs

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

### Example 3: adding custom triggers

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

## Overriding Raidboss Timelines

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

## Customizing Behavior

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

## Debugging User Files

### Check the OverlayPlugin log for errors

The OverlayPlugin log is scrolling window of text that can be found by going to ACT -> Plugins -> OverlayPlugin.dll, and looking at the bottom of the window.

If there are errors, they will appear here.

### Check if your file is loaded

First, turn on debug mode for raidboss. Go to the cactbot configuration UI, enable `Show developer options` and reload the page. Then, enable `Enable debug mode` under Raidboss, and reload again.

When raidboss debug mode is on, it will print more information to the OverlayPlugin log. It will list lines for each local user file it loads: `[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

Verify that your user file is loaded at all.

### Check if your user file has errors

User files are JavaScript, and so if you write incorrect JavaScript, there will be errors and your user file will be skipped and it will not load. Check the OverlayPlugin log for errors when loading.

Here's an example:

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.js:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 96)
```
