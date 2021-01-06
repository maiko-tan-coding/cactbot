# Cactbot自定義教學

🌎 [[English](../CactbotCustomization.md)] [[简体中文](./zh-CN/CactbotCustomization.md)] [**繁體中文**] [[한국어](../ko-KR/CactbotCustomization.md)]

- [使用cactbot使用者介面](#使用cactbot使用者介面)
- [透過cactbot使用者介面改變觸發器文本](#透過cactbot使用者介面改變觸發器文本)
- [用戶資料夾概況](#用戶資料夾概況)
- [設置您自己的用戶資料夾](#設置您自己的用戶資料夾)
- [樣式自定義](#樣式自定義)
- [Raidboss觸發器自定義](#raidboss觸發器自定義)
  - [例1：改變輸出文本](#例1改變輸出文本)
  - [例2：使挑釁提示適用於全職業](#例2使挑釁提示適用於全職業)
  - [例3：添加自定義觸發器](#例3添加自定義觸發器)
- [Raidboss時間軸自定義](#raidboss時間軸自定義)
- [行為自定義](#行為自定義)
- [用戶檔案的除錯](#用戶檔案的除錯)
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

名稱旁邊帶有鈴鐺(🔔) 的設置項的觸發器輸出文本是可以被覆蓋的。 舉個例子，假設有一個🔔onTarget字段，其文本為 `死刑點${player}`。 當某人接到死刑技能時，這個字符串將出現在熒幕上（或通過tts播報）。 `${player}` 是一個將由觸發器動態設置的參數。 任何類似於 `${param}` 的字符串都是動態參數。

比如，您可以將這個文本更改為 `${player} 即將死亡！ `。 或者，也許您不關心誰是目標，那麼您可以將其改為 `死刑` 以使文本更加簡短。 如果您想撤消自己的更改，只需清空文本框即可。

但這個方式有一定的限制。 例如，您無法更改邏輯。 而且在大多數情況下，您無法使 `tts` 的播報與 `alarmText` 不同。 您無法添加更多的參數。 如果您想要對觸發器做出更加複雜的覆蓋操作， 那麼您需要查看 [Raidboss觸發器自定義](#raidboss觸發器自定義) 小節。

## 用戶資料夾概況

若cactbot使用者介面不存在您所需的選項，您可能需要考慮以用戶檔案覆蓋的方式進行自定義。 您需要編寫JavaScript程式碼和CSS樣式，這意味著您可能需要掌握一點點編程知識。

Cactbot的設計哲學要求任何用戶的自定義配置應當存放於用戶資料夾的檔案中。 同時這也能防止您所做的更改在今後cactbot的更新中被覆蓋失效。 不僅如此，以後您將無法通過直接修改cactbot的檔案應用您的更改，除非您了解如何編譯您自己的項目。

所有的cactbot模組都會從 [user/](../../user/) 資料夾載入用戶設置。 `raidboss` 模組會載入 `user/raidboss.js` 與 `user/raidboss.css`。 (Timeline `.txt` files must be directly in the same folder as the `.js` that refers to them.) These user-defined files are included after cactbot's files and can override its settings.

`oopsyraidsy` 模組會載入 `user/oopsyraidsy.js` 與 `user/oopsyraidsy.css`。 And so on, for each module by name.

cactbot loads files in subdirectories (alphabetically) before loading files in outer directories. This is so that `user/raidboss.js` will always be loaded last and can override anything that is set inside a file inside of `user/raidboss/`. For example, `user/alphascape/some_file.js` will load before `user/mystatic/some_file.js`, which will both load before `user/raidboss.js`. The same ordering applies to `.css` files.

In this documentation, any reference to "user-defined js file" applies to both of these. There is no difference between `user/raidboss.js` and `user/raidboss/some_file.js`, other than the order in which they load. Similarly, "user-defined css file" means both `user/radar.css` and `user/radar/some_file.css`. Subdirectories in the user folder are intended to make it easier to share triggers and customizations with others.

若您沒有選擇，cactbot會嘗試選擇安裝目錄下的默認資料夾。

`user/` 資料夾中包含了一部分示例配置檔案，您可以對其重命名並直接使用。 如 [user/raidboss-example.js](../../user/raidboss-example.js) 檔案可被重命名為`user/raidboss.js` ，對其所做的更改可應用於`raidboss` 模組。

在修改了這些檔案之後，單擊ACT中OverlayPlugin外掛設置中的“重載懸浮窗”按鈕，即可應用更改。

## 設置您自己的用戶資料夾

您可以透過cactbot使用者介面設置用戶資料夾： ACT -> Plugins -> OverlayPlugin.dll -> Cactbot -> cactbot用戶文件夾。 單擊 `選擇文件夾` 按鈕，選擇硬碟上的一個資料夾。

若您沒有選擇，cactbot會嘗試選擇安裝目錄下的默認資料夾。

建議您選擇cactbot安裝目錄下的 `cactbot/user` 資料夾。 該資料夾通常位於 `%APPDATA%\Advanced Combat Tracker\Plugins\cactbot-version\cactbot\user`。 有部分示例配置檔案位於 [此資料夾](../../user) 下。

## 樣式自定義

您可以通過修改 `user/<name >.css` 等檔案，對UI模組的位置、尺寸、顏色等進行自定義。 可用的選擇器可以通過閱覽 `ui/<name>/<name>.css` 檔案找到。

如您在[ui/raidboss/raidboss.css](../../ui/raidboss/raidboss.css) 中可發現諸如`#popup-text-container` 與`#timeline-container` 等選擇器， 則您可以在`user/raidboss.css` 中對其位置進行自定義。 您可以在 `user/raidboss.css` 中添加更多的樣式。

同樣地，您可以在 `.info-text` 類中添加新的CSS規則，對信息文字的尺寸和顏色進行自定義。 例如：

```css
.info-text {
  font-size: 200%;
  color: rgb(50, 100, 50);
}
```

簡單地說，您可以認為cactbot會將用戶檔案中的CSS規則添加至內置CSS檔案的末尾。 也就是說，您需要注意 [CSS優先級規則](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)， 例如添加 `!important` 讓您的規則可以強制覆蓋。 另一方面，您可能需要重置某些屬性為默認的 `auto` 值。

我們推薦使用 [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) 以除錯CSS問題。 您可以通過 ACT -> Plugins -> OverlayPlugin.dll -> 您的懸浮窗名字 -> 啟動Debug工具 以開啟DevTools。

**注意**：某些組件的自定義較為困難，甚至無法進行自定義，如時間軸的進度條等。 原因是，這些組件屬於自定義HTML元素，且沒有開放外部配置的接口。 如果您有特別的需求，但是您不知道如何修改此進度條，您可以提出一個 [github issue](https://github.com/quisquous/cactbot/issues/new/choose)。

**警告**：cactbot不保證CSS的向後兼容性。 在以後的更改中，cactbot可能會重新組織網頁結構，改變元素名稱和類名稱，甚至完全重構所有樣式。 因此，您需知曉您的自定義CSS有在將來出現問題的風險。

## Raidboss觸發器自定義

您可以通過 `cactbot/user/raidboss.js` 檔案自定義觸發器行為。 您可以修改輸出文本、適用職業、文本顯示的時間等等。

在 `cactbot/user/raidboss.js` 檔案中， `Options.Triggers` 是一個存放了觸發器集合的列表。 您可以通過此變量添加新觸發器，或修改已有的觸發器。 若用戶檔案中存在與現有觸發器 (cactbot官方提供的) 相同id的觸發器，則會將後者其覆蓋。

在您修改觸發器前，我們推薦閱讀 [觸發器指南](RaidbossGuide.md) 以了解各觸發器的諸多屬性的含義。

我們推薦閱讀 \[觸發器指南\](RaidbossGuide. md) 以瞭解如何撰寫cactbot的觸發器， 當然您也可以直接看 [ui/raidboss/data](../../ui/raidboss/data) 中現有的觸發器程式碼。

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

最簡單的定制觸發器方式是直接複製上面那一大塊程式碼粘貼到此檔案再進行修改。 您可以修改 `zoneId` 一行為您想要觸發器響應的區域id，這一行通常位於cactbot觸發器檔案的頂部。 [該檔案](../../resources/zone_id.js) 列出了所有可用的區域id。 若您定義了錯誤的id，OverlayPlugin的日誌窗口將會輸出警告信息。 然後複製觸發器文本並粘貼至此， 按您的喜好進行修改。 當你改完所有你想改的觸發器後， 重載raidboss懸浮窗以應用更改。

**注意**：此方式會將原觸發器完全移除，因此請在修改時不要刪除任何邏輯。 此外，觸發器均採用JavaScript編寫，因此必須採用標準JavaScript語法。 若您不是程式員，您需要格外注意編輯方法。

### 例1：改變輸出文本

假定您正在攻略巴哈姆特絕境戰(UCOB)， 您的固定隊採用的不是cactbot默認的火1集合吃的打法， 而是先單吃火1。 另外，您 *同時* 還想讓觸發器通過tts播報與文本不同的內容。 比如，您總是忘記出人群，因此您想讓它重復播報數次。

我們推薦閱讀 [觸發器指南](RaidbossGuide. md) 以瞭解如何撰寫cactbot的觸發器， 當然您也可以直接看 [ui/raidboss/data](../../ui/raidboss/data) 中現有的觸發器程式碼。

其中一種調整方式是編輯觸發器的輸出。 您可以在 [ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js](https://github.com/quisquous/cactbot/blob/cce8bc6b10d2210fa512bd1c8edd39c260cc3df8/ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate.js#L715-L743) 中找到原本的 fireball #1 觸發器。

您需要將以下的程式碼粘貼至您的 `cactbot/user/raidboss.js` 中。

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

當然，您也可以直接刪除整個 `condition` 函數， 因為沒有condition的觸發器只要正則匹配成功就會運行。

### 例2：使挑釁提示適用於全職業

目前，只有團隊成員的挑釁會觸發提示，並且不是所有職業都能收到提示。 該例子展示了如何使其適用於所有職業。 該挑釁觸發器可以在 [ui/raidboss/data/00-misc/general.js](https://github.com/quisquous/cactbot/blob/cce8bc6b10d2210fa512bd1c8edd39c260cc3df8/ui/raidboss/data/00-misc/general.js#L11-L30) 中找到。

我們需要修改 `condition` 函數(function)。 由於此處的id與內置的 `General Provoke` 觸發器一致，因此會覆蓋同名的內置觸發器。

我們推薦閱讀 [觸發器指南](RaidbossGuide.md) 以瞭解如何撰寫cactbot的觸發器， 當然您也可以直接看 [ui/raidboss/data](../../ui/raidboss/data) 中現有的觸發器程式碼。

```javascript
Options.Triggers.push([{
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      id: 'General Provoke',
      netRegex: NetRegexes.ability({ id: '1D6D' }),
      condition: function(data, matches) {
        // 我希望看到所有的挑釁提示，即便他們不在我的隊伍中，
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

自定義時間軸與 [自定義觸發器](#overriding-raidboss-triggers) 差不多。

### 例3：添加自定義觸發器

自定義時間軸的步驟如下：

1) 複製原有的時間軸文本檔案內容至您的用戶資料夾

```javascript
Options.Triggers.push([
  {
    zoneId: ZoneId.MatchAll,
    triggers: [
      {
        // 這是一個自定義的id，因此不會覆蓋任何現有的觸發器。
        id: 'Personal Forked Lightning',
        regex: Regexes.gainsEffect({ effect: 'Forked Lightning' }),
        condition: (data, matches) => { return matches.target === data.me; },
        delaySeconds: 1,
        alertText: 'Get out!!!',
      },

      // 您的其他觸發器……
    ],
  },

  // 其他區域的觸發器集合……
]);
```

1) 在 user/raidboss.js 中添加程式碼

## Raidboss時間軸自定義

1) 按您的喜好編輯您自己的時間軸檔案

時間軸的步驟如下：

1) 複製原有的時間軸文本檔案內容至您的用戶資料夾

    例如，您可以複製
    [ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt](../ui/raidboss/data/05-shb/ultimate/the_epic_of_alexander.txt)
    至 `user/the_epic_of_alexander.txt`。

1) 在 user/raidboss.js 中添加程式碼

    如同我們添加觸發器一樣，您依舊需要定義 `zoneId`、 `overrideTimelineFile: true`，
    以及定義文本檔案名稱的`timelineFile` 属性。

    ```javascript
    Options.Triggers.push({
      zoneId: ZoneId.TheEpicOfAlexanderUltimate,
      overrideTimelineFile: true,
      timelineFile: 'the_epic_of_alexander.txt',
    });
    ```


    （假設您已經做完了第一步，並且該文本檔案的名稱為 `user/the_epic_of_alexander.txt` ）
    
    設置 `overrideTimelineFile: true` 是為了告訴cactbot將內置的時間軸完全替換為您添加的檔案。

例如在 [ui/raidboss/raidboss.js](../../ui/raidboss/raidboss.js) 檔案中， 您可以通過 `PlayerNicks` 選項定義玩家的暱稱。

    閱讀 [時間軸指南](TimelineGuide.md) 學習更多關於時間軸的知識。

**注意**：編輯時間軸檔案有一定的風險， 這是因為部分觸發器依賴於時間軸的特定文字。 例如在絕亞歷山大中，`Fluid Swing` 與 `Propeller Wind` 都有對應的時間軸觸發器。 如果這些文字被替換或移除，時間軸觸發器也同樣會失效。

## 行為自定義

這一文段將討論cactbot的其他方式。 Cactbot中有一些不在使用者介面顯示，也不是觸發器的變量。

每個cactbot模塊都有一個名為 `Options` 的變量，它包含了若干控制選項。 可用的 `Options` 變量會在每個 `ui/<name>/<name>.js` 檔案的頂部列出。

例如在 [ui/raidboss/raidboss.js](../../ui/raidboss/raidboss.js) 檔案中， 您可以通過 `PlayerNicks` 選項定義玩家的暱稱。

```javascript
Options.PlayerNicks = {
  // 'Firstname Lastname': 'Nickname',
  'Banana Nana', 'Nana',
  'The Great\'one', 'Joe', //  =>  這裡需要一個反斜槓轉義單引號
  'Viewing Cutscene': 'Cut',
  // 等等
};
```

**警告**：用戶資料夾中的檔案會靜默覆蓋cactbot使用者介面的同名選項。 該行為可能會造成一些困惑，因此您應當直接通過使用者介面設置這些變量， 僅當使用者介面不提供設置方法時採用此方式覆蓋默認行為。

## 用戶檔案的除錯

### 檢查OverlayPlugin的錯誤日誌

確認您的用戶檔案是否正常載入。

當運行錯誤時，錯誤信息會顯示在此處。

### 檢查檔案是否載入

首先，您需要開啓raidboss模組的除錯模式。 打開cactbot使用者介面，啓用 `顯示開發者選項` ，然後重新加載懸浮窗。 然後，勾選raidboss模組下的 `啓用除錯模式`，再次重載懸浮窗。

當raidboss模組的除錯模式啓用時，OverlayPlugin的日誌窗口中會打印更多信息。 每次本地的用戶檔案加載時都會輸出類似於這樣的信息： `[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js`

確認您的用戶檔案是否正常載入。

The order that the filenames are printed is the order in which they are loaded.

### 檢查檔案是否有錯誤

用戶檔案採用JavaScript編寫，若程式碼語法本身有錯誤，日誌窗口會輸出錯誤，您的用戶檔案也會被跳過而不會被加載。 在檔案載入時檢查OverlayPlugin的錯誤日誌。

此處有一個例子：

```log
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: local user file: C:\Users\tinipoutini\cactbot\user\raidboss.js (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 83)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: *** ERROR IN USER FILE *** (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 95)
[10/19/2020 6:18:27 PM] Info: raidbossy: BrowserConsole: SyntaxError: Unexpected token :
    at loadUser (file:///C:/Users/tinipoutini/cactbot/resources/user_config.js:92:28) (Source: file:///C:/Users/tinipoutini/cactbot/resources/user_config.js, Line: 96)
```
