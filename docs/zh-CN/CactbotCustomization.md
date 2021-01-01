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

当开发者模式开启时，你可以从[调试信息](#check-if-your-file-is-loaded)中得到更多关于加载顺序的信息。

`user/` 文件夹中包含了一部分示例配置文件，您可以对其重命名并直接使用。 如 [user/raidboss-example.js](../../user/raidboss-example.js) 文件 可被重命名为 `user/raidboss.js`，对其所做的更改可应用于 `raidboss` 模块。

在修改了这些文件之后，单击ACT中OverlayPlugin插件对应悬浮窗设置中的“重载悬浮窗”按钮，即可应用更改。

## 设置您自己的用户文件夹

您可以通过cactbot配置界面设置用户文件夹： ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> cactbot用户文件夹。 单击 `选择文件夹` 按钮，选择磁盘上的一个文件夹。

如果没有选择，cactbot将自动选择其安装目录下的默认文件夹。

建议您选择cactbot安装目录下的 `cactbot/user` 文件夹。 该文件夹通常为位于 `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`。 有部分示例配置文件位于 [此文件夹](../../user) 下。

## 样式自定义

用户自定义css文件可以对UI模块的位置、尺寸、颜色等进行自定义。 可用的选择器可以通过阅览 `ui/<name>/<name>.css` 文件找到。

例如您在 [ui/raidboss/raidboss.css](../ui/raidboss/raidboss.css) 中，可发现诸如 `#popup-text-container` 与 `#timeline-container` 等选择器， 则您可以在 `user/raidboss.css` 中对其位置进行自定义。 您可以在 `user/raidboss.css` 中或其他 `user/raidboss/` 下的 `.css` 中添加更多的样式。

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

在 `cactbot/user/raidboss.js` 文件中， `Options.Triggers` 是一个存放了触发器集合的列表。 您可以通过此变量添加新触发器，或修改已有的触发器。 若用户文件中存在与现有触发器 (cactbot官方提供的) 相同id的触发器，则会将后者其覆盖。

在您修改触发器前，我们推荐阅读 [触发器指南](RaidbossGuide.md) 以了解各触发器的诸多属性的含义。

若您只是想修改 `信息文本`，你可以 [通过cactbot配置界面改变触发器文本](#changing-trigger-text-with-the-cactbot-ui) 实现。

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

最简单的定制触发器方式是直接复制上面那一大块代码再进行修改。 您可以修改 `zoneId` 一行为您想要触发器响应的区域id，这一行通常位于cactbot触发器文件的顶部。 [该文件](../../resources/zone_id.js) 列出了所有可用的区域id。 若您定义了错误的id，OverlayPlugin的日志窗口将会输出警告信息。 Then, copy the trigger text into this block. Edit as needed. Repeat for all the triggers you want to modify. Reload your raidboss overlay to apply your changes.

**注意**：此方式会将原触发器完全移除，因此请在修改时不要删除任何逻辑。 此外，触发器均采用JavaScript编写，因此必须采用标准JavaScript语法。 若您不是程序员，您需要格外注意编辑方法。

### 例1：改变输出文本

假定您正在攻略巴哈姆特绝境战(UCOB)， 您的固定队采用的不是cactbot默认的火1集合吃的打法， 而是先单吃火1。 另外，您 *同时* 还想让触发器通过tts播报与文本不同的内容。 比如，您总是忘记出人群，因此您想让它重复播报数次。

If you only wanted to change the `infoText`, you could do this via [Changing Trigger Text with the cactbot UI](#changing-trigger-text-with-the-cactbot-ui).

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

当然，您也可以直接删除整个 `condition` 函数， 因为没有condition的触发器只要正则匹配成功就会运行。

### 例2：使挑衅提示适用于全职业

目前，只有团队成员的挑衅会触发提示，并且不是所有职业都能收到提示。 该例子展示了如何使其适用于所有职业。 该挑衅触发器可以在 [ui/raidboss/data/00-misc/general.js](https://github.com/quisquous/cactbot/blob/cce8bc6b10d2210fa512bd1c8edd39c260cc3df8/ui/raidboss/data/00-misc/general.js#L11-L30) 中找到。

我们需要修改 `condition` 函数(function)。 由于此处的id与内置的 `General Provoke` 触发器一致，因此会覆盖同名的内置触发器。

我们推荐阅读 [触发器指南](RaidbossGuide.md) 以了解如何撰写cactbot的触发器， 当然您也可以直接看 [ui/raidboss/data](../../ui/raidboss/data) 中现有的触发器代码。

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

自定义时间轴与 [自定义触发器](#overriding-raidboss-triggers) 差不多。

### 例3：添加自定义触发器

自定义时间轴的步骤如下：

1) 复制原有的时间轴文本文件内容至您的用户文件夹

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

1) 在 user/raidboss.js 中添加代码

## Raidboss时间轴自定义

1) 按您的喜好编辑您自己的时间轴文件

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

例如在 [ui/raidboss/raidboss.js](../../ui/raidboss/raidboss.js) 文件中， 您可以通过 `PlayerNicks` 选项定义玩家的昵称。

    阅读 [时间轴指南](TimelineGuide.md) 学习更多关于时间轴的知识。

**注意**：编辑时间轴文件有一定的风险， 这是因为部分触发器依赖于时间轴的特定文字。 例如在绝亚历山大中，`Fluid Swing` 与 `Propeller Wind` 都有对应的时间轴触发器。 如果这些文字被替换或移除，时间轴触发器也同样会失效。

## 行为自定义

这一文段将讨论自定义cactbot的其他方式。 Cactbot中有一些不在配置界面显示，也不是触发器的变量。

每个cactbot模块都有一个名为 `Options` 的变量，它包含了若干控制选项。 可用的 `Options` 变量会在每个 `ui/<name>/<name>.js` 文件的顶部列出。

For example in [ui/raidboss/raidboss.js](../ui/raidboss/raidboss.js), you see the `PlayerNicks` option which allows you to give people nicknames when their names are called out

```javascript
Options.PlayerNicks = {
  // 'Firstname Lastname': 'Nickname',
  'Banana Nana', 'Nana',
  'The Great\'one', 'Joe', //  =>  这里需要一个反斜杠转义单引号
  'Viewing Cutscene': 'Cut',
  // 等等
};
```

**警告**：用户文件夹中的文件会静默覆盖cactbot配置窗口的同名选项。 该行为可能会造成一些困惑，因此您应当直接通过配置窗口设置这些变量， 仅当配置窗口不提供设置方法时采用此方式覆盖默认行为。

## 用户文件的调试

### 检查OverlayPlugin的错误日志

确认您的用户文件是否正常加载。

当运行错误时，错误信息会显示在此处。

### 检查文件是否加载

首先，您需要开启raidboss模块的调试模式。 打开cactbot配置窗口，启用 `显示开发者选项` ，然后重新加载悬浮窗。 然后，勾选raidboss模块下的 `启用调试模式`，再次重载悬浮窗。

当raidboss模块的调试模式启用时，OverlayPlugin的日志窗口中会打印更多信息。 每次本地的用户文件加载时都会输出类似于这样的信息： `[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

Verify that your user file is loaded at all.

The order that the filenames are printed is the order in which they are loaded.

### 检查文件是否有错误

用户文件采用JavaScript编写，若代码语法本身有错误，日志窗口会输出错误，您的用户文件也会被跳过而不会被加载。 在文件加载时检查OverlayPlugin的错误日志。

此处有一个例子：

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.js:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 96)
```
