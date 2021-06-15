/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 838:
/***/ ((__unused_webpack___webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: ./resources/util.ts
var util = __webpack_require__(779);
;// CONCATENATED MODULE: ./resources/party.ts

const emptyRoleToPartyNames = () => {
    return {
        tank: [],
        healer: [],
        dps: [],
        crafter: [],
        gatherer: [],
        none: [],
    };
};
class PartyTracker {
    constructor() {
        this.details = [];
        this.partyNames_ = [];
        this.partyIds_ = [];
        this.allianceNames_ = [];
        this.allianceIds_ = [];
        this.nameToRole_ = {};
        this.idToName_ = {};
        this.roleToPartyNames_ = emptyRoleToPartyNames();
    }
    // Bind this to PartyChanged events.
    onPartyChanged(e) {
        if (!e || !e.party)
            return;
        this.reset();
        this.details = e.party;
        for (const p of e.party) {
            this.allianceIds_.push(p.id);
            this.allianceNames_.push(p.name);
            const jobName = util/* default.jobEnumToJob */.Z.jobEnumToJob(p.job);
            const role = util/* default.jobToRole */.Z.jobToRole(jobName);
            this.idToName_[p.id] = p.name;
            this.nameToRole_[p.name] = role;
            if (p.inParty) {
                this.partyIds_.push(p.id);
                this.partyNames_.push(p.name);
                this.roleToPartyNames_[role].push(p.name);
            }
        }
    }
    reset() {
        // original event data
        this.details = [];
        this.partyNames_ = [];
        this.partyIds_ = [];
        this.allianceNames_ = [];
        this.allianceIds_ = [];
        this.nameToRole_ = {};
        this.idToName_ = {};
        // role -> [names] but only for party
        this.roleToPartyNames_ = emptyRoleToPartyNames();
    }
    // returns an array of the names of players in your immediate party
    get partyNames() {
        return this.partyNames_;
    }
    get partyIds() {
        return this.partyIds_;
    }
    // returns an array of the names of players in your alliance
    get allianceNames() {
        return this.allianceNames_;
    }
    // returns an array of the names of tanks in your immediate party
    get tankNames() {
        return this.roleToPartyNames_['tank'];
    }
    // returns an array of the names of healers in your immediate party
    get healerNames() {
        return this.roleToPartyNames_['healer'];
    }
    // returns an array of the names of dps players in your immediate party
    get dpsNames() {
        return this.roleToPartyNames_['dps'];
    }
    // returns true if the named player in your alliance is a particular role
    isRole(name, role) {
        return this.nameToRole_[name] === role;
    }
    // returns true if the named player in your alliance is a tank
    isTank(name) {
        return this.isRole(name, 'tank');
    }
    // returns true if the named player in your alliance is a healer
    isHealer(name) {
        return this.isRole(name, 'healer');
    }
    // returns true if the named player in your alliance is a dps
    isDPS(name) {
        return this.isRole(name, 'dps');
    }
    // returns true if the named player is in your immediate party
    inParty(name) {
        return this.partyNames.includes(name);
    }
    // returns true if the named player is in your alliance
    inAlliance(name) {
        return this.allianceNames.includes(name);
    }
    // for a named player, returns the other tank in your immediate party
    // if named player is not a tank, or there's not exactly two tanks
    // in your immediate party, returns null.
    otherTank(name) {
        const names = this.tankNames;
        if (names.length !== 2)
            return;
        if (names[0] === name)
            return names[1];
        if (names[1] === name)
            return names[0];
    }
    // see: otherTank, but for healers.
    otherHealer(name) {
        const names = this.roleToPartyNames_['healer'];
        if (names.length !== 2)
            return;
        if (names[0] === name)
            return names[1];
        if (names[1] === name)
            return names[0];
    }
    // returns the job name of the specified party member
    jobName(name) {
        var _a;
        const partyIndex = this.partyNames.indexOf(name);
        if (partyIndex >= 0)
            return util/* default.jobEnumToJob */.Z.jobEnumToJob((_a = this.details[partyIndex]) === null || _a === void 0 ? void 0 : _a.job);
    }
    nameFromId(id) {
        return this.idToName_[id];
    }
}

// EXTERNAL MODULE: ./resources/regexes.ts
var resources_regexes = __webpack_require__(201);
// EXTERNAL MODULE: ./resources/responses.ts
var responses = __webpack_require__(163);
// EXTERNAL MODULE: ./resources/user_config.ts
var user_config = __webpack_require__(970);
// EXTERNAL MODULE: ./ui/raidboss/data/raidboss_manifest.txt + 328 modules
var raidboss_manifest = __webpack_require__(484);
;// CONCATENATED MODULE: ./ui/raidboss/raidboss_options.ts

// These options are ones that are not auto-defined by raidboss_config.js.
const defaultRaidbossNonConfigOptions = {
    PlayerNicks: {},
    InfoSound: '../../resources/sounds/freesound/percussion_hit.ogg',
    AlertSound: '../../resources/sounds/BigWigs/Alert.ogg',
    AlarmSound: '../../resources/sounds/BigWigs/Alarm.ogg',
    LongSound: '../../resources/sounds/BigWigs/Long.ogg',
    PullSound: '../../resources/sounds/freesound/sonar.ogg',
    AudioAllowed: true,
    DisabledTriggers: {},
    PerTriggerAutoConfig: {},
    PerTriggerOptions: {},
    Triggers: [],
    IsRemoteRaidboss: false,
    TransformTts: (t) => t,
};
// TODO: figure out how to get this type from raidboss_config??
// These values are overwritten and are just here for typing.
const defaultRaidbossConfigOptions = {
    Debug: false,
    DefaultAlertOutput: 'textAndSound',
    AlertsLanguage: undefined,
    TimelineLanguage: undefined,
    TimelineEnabled: true,
    AlertsEnabled: true,
    ShowTimerBarsAtSeconds: 30,
    KeepExpiredTimerBarsForSeconds: 0.7,
    BarExpiresSoonSeconds: 6,
    MaxNumberOfTimerBars: 6,
    DisplayAlarmTextForSeconds: 3,
    DisplayAlertTextForSeconds: 3,
    DisplayInfoTextForSeconds: 3,
    AlarmSoundVolume: 1,
    AlertSoundVolume: 1,
    InfoSoundVolume: 1,
    LongSoundVolume: 1,
    PullSoundVolume: 1,
    cactbotWormholeStrat: false,
    cactbote8sUptimeKnockbackStrat: false,
};
// See user/raidboss-example.js for documentation.
const Options = {
    ...user_config/* default.getDefaultBaseOptions */.Z.getDefaultBaseOptions(),
    ...defaultRaidbossNonConfigOptions,
    ...defaultRaidbossConfigOptions,
};
/* harmony default export */ const raidboss_options = (Options);

;// CONCATENATED MODULE: ./ui/raidboss/raidboss_config.js







const kOptionKeys = {
  output: 'Output',
  duration: 'Duration',
  beforeSeconds: 'BeforeSeconds',
  outputStrings: 'OutputStrings'
}; // No sound only option, because that's silly.

const kTriggerOptions = {
  default: {
    label: {
      en: '✔ Defaults',
      de: '✔ Standards',
      fr: '✔ Défauts',
      ja: '✔ 初期設定',
      cn: '✔ 默认设置',
      ko: '✔ 기본'
    }
  },
  textAndSound: {
    label: {
      en: '🆙🔊 Text and Sound',
      de: '🆙🔊 Text und Ton',
      fr: '🆙🔊 Texte et son',
      ja: '🆙🔊 テキストと音声',
      cn: '🆙🔊 文字显示与提示音',
      ko: '🆙🔊 텍스트와 소리'
    }
  },
  ttsAndText: {
    label: {
      en: '🆙💬 Text and TTS',
      de: '🆙💬 Text und TTS',
      fr: '🆙💬 Texte et TTS',
      ja: '🆙💬 テキストとTTS',
      cn: '🆙💬 文字显示与TTS',
      ko: '🆙💬 텍스트와 TTS'
    }
  },
  ttsOnly: {
    label: {
      en: '💬 TTS Only',
      de: '💬 Nur TTS',
      fr: '💬 TTS Seulement',
      ja: '💬 TTSのみ',
      cn: '💬 只使用TTS',
      ko: '💬 TTS만'
    }
  },
  textOnly: {
    label: {
      en: '🆙 Text Only',
      de: '🆙 Nur Text',
      fr: '🆙 Texte seulement',
      ja: '🆙 テキストのみ',
      cn: '🆙 只使用文字显示',
      ko: '🆙 텍스트만'
    }
  },
  disabled: {
    label: {
      en: '❌ Disabled',
      de: '❌ Deaktiviert',
      fr: '❌ Désactivé',
      ja: '❌ 無効',
      cn: '❌ 禁用',
      ko: '❌ 비활성화'
    }
  }
};
const kDetailKeys = {
  'triggerRegex': {
    label: {
      en: 'regex',
      de: 'regex',
      fr: 'regex',
      ja: '正規表現',
      cn: '正则表达式',
      ko: '정규식'
    },
    cls: 'regex-text',
    debugOnly: true
  },
  'triggerNetRegex': {
    label: {
      en: 'netregex',
      de: 'netregex',
      fr: 'netregex',
      ja: 'ネット正規表現',
      cn: '网络日志正则表达式'
    },
    cls: 'regex-text',
    debugOnly: true
  },
  'timelineRegex': {
    label: {
      en: 'timeline',
      de: 'timeline',
      fr: 'timeline',
      ja: 'タイムライン',
      cn: '时间轴',
      ko: '타임라인'
    },
    cls: 'regex-text',
    debugOnly: true
  },
  'beforeSeconds': {
    label: {
      en: 'before (sec)',
      de: 'Vorher (Sekunden)',
      fr: 'avant (seconde)',
      ja: 'その前に (秒)',
      cn: '提前 (秒)',
      ko: '앞당김 (초)'
    },
    cls: 'before-seconds-text',
    generatedManually: true
  },
  'condition': {
    label: {
      en: 'condition',
      de: 'condition',
      fr: 'condition',
      ja: '条件',
      cn: '条件',
      ko: '조건'
    },
    cls: 'condition-text',
    debugOnly: true
  },
  'duration': {
    label: {
      en: 'duration (sec)',
      de: 'Dauer (Sekunden)',
      fr: 'Durée (secondes)',
      ja: '存続時間 (秒)',
      cn: '持续时间 (秒)',
      ko: '지속 시간 (초)'
    },
    cls: 'duration-text',
    generatedManually: true
  },
  'preRun': {
    label: {
      en: 'preRun',
      de: 'preRun',
      fr: 'preRun',
      ja: 'プレ実行',
      cn: '预运行',
      ko: '사전 실행'
    },
    cls: 'prerun-text',
    debugOnly: true
  },
  'alarmText': {
    label: {
      en: 'alarm',
      de: 'alarm',
      fr: 'alarme',
      ja: '警報',
      cn: '警报文本',
      ko: '경고'
    },
    cls: 'alarm-text'
  },
  'alertText': {
    label: {
      en: 'alert',
      de: 'alert',
      fr: 'alerte',
      ja: '警告',
      cn: '警告文本',
      ko: '주의'
    },
    cls: 'alert-text'
  },
  'infoText': {
    label: {
      en: 'info',
      de: 'info',
      fr: 'info',
      ja: '情報',
      cn: '信息文本',
      ko: '안내'
    },
    cls: 'info-text'
  },
  'tts': {
    label: {
      en: 'tts',
      de: 'tts',
      fr: 'tts',
      ja: 'TTS',
      cn: 'TTS',
      ko: 'TTS'
    },
    cls: 'tts-text'
  },
  'sound': {
    label: {
      en: 'sound',
      de: 'sound',
      fr: 'son',
      ja: '音声',
      cn: '提示音',
      ko: '소리'
    },
    cls: 'sound-text'
  },
  'run': {
    label: {
      en: 'run',
      de: 'run',
      fr: 'run',
      ja: '実行',
      cn: '运行',
      ko: '실행'
    },
    cls: 'run-text',
    debugOnly: true
  }
};
const kMiscTranslations = {
  // Shows up for un-set values.
  valueDefault: {
    en: '(default)',
    de: '(Standard)',
    fr: '(Défaut)',
    ja: '(初期値)',
    cn: '(默认值)',
    ko: '(기본값)'
  },
  // Shown when the UI can't decipher the output of a function.
  valueIsFunction: {
    en: '(function)',
    de: '(Funktion)',
    fr: '(Fonction)',
    ja: '(関数)',
    cn: '(函数)',
    ko: '(함수)'
  },
  // Warning label for triggers without ids or overridden triggers.
  warning: {
    en: '⚠️ warning',
    de: '⚠️ Warnung',
    fr: '⚠️ Attention',
    ja: '⚠️ 警告',
    cn: '⚠️ 警告',
    ko: '⚠️ 주의'
  },
  // Shows up for triggers without ids.
  missingId: {
    en: 'missing id field',
    de: 'Fehlendes ID Feld',
    fr: 'Champ ID manquant',
    ja: 'idがありません',
    cn: '缺少id属性',
    ko: 'ID 필드값 없음'
  },
  // Shows up for triggers that are overridden by other triggers.
  overriddenByFile: {
    en: 'overridden by "${file}"',
    de: 'Überschrieben durch "${file}"',
    fr: 'Écrasé(e) par "${file}"',
    ja: '"${file}"に上書きました',
    cn: '被"${file}"文件覆盖',
    ko: '"${file}" 파일에서 덮어씌움'
  },
  // Opens trigger file on Github.
  viewTriggerSource: {
    en: 'View Trigger Source',
    de: 'Zeige Trigger Quelle',
    ja: 'トリガーのコードを表示',
    cn: '显示触发器源码',
    ko: '트리거 출처 열기'
  }
};

const validDurationOrUndefined = val => {
  val = parseFloat(val);
  if (!isNaN(val) && val >= 0) return val;
  return undefined;
};

const canBeConfigured = trig => !trig.isMissingId && !trig.overriddenByFile;

const addTriggerDetail = (container, labelText, detailText, detailCls) => {
  const label = document.createElement('div');
  label.innerText = labelText;
  label.classList.add('trigger-label');
  container.appendChild(label);
  const detail = document.createElement('div');
  detail.classList.add('trigger-detail');
  detail.innerText = detailText;
  container.appendChild(detail);
  if (detailCls) detail.classList.add(detailCls);
}; // This is used both for top level Options and for PerTriggerAutoConfig settings.
// Unfortunately due to poor decisions in the past, PerTriggerOptions has different
// fields here.  This should be fixed.


function setOptionsFromOutputValue(options, value) {
  if (value === 'default') {// Nothing.
  } else if (value === 'textAndSound') {
    options.TextAlertsEnabled = true;
    options.SoundAlertsEnabled = true;
    options.SpokenAlertsEnabled = false;
  } else if (value === 'ttsAndText') {
    options.TextAlertsEnabled = true;
    options.SoundAlertsEnabled = true;
    options.SpokenAlertsEnabled = true;
  } else if (value === 'ttsOnly') {
    options.TextAlertsEnabled = false;
    options.SoundAlertsEnabled = true;
    options.SpokenAlertsEnabled = true;
  } else if (value === 'textOnly') {
    options.TextAlertsEnabled = true;
    options.SoundAlertsEnabled = false;
    options.SpokenAlertsEnabled = false;
  } else if (value === 'disabled') {
    options.TextAlertsEnabled = false;
    options.SoundAlertsEnabled = false;
    options.SpokenAlertsEnabled = false;
  } else {
    console.error('unknown output type: ' + value);
  }
} // Helper for doing nothing during trigger eval, but still recording any
// calls to `output.responseOutputStrings = x;` via callback.


class DoNothingFuncProxy {
  constructor(outputStringsCallback) {
    return new Proxy(this, {
      set(target, property, value) {
        if (property === 'responseOutputStrings') {
          outputStringsCallback(value);
          return true;
        } // Ignore other property setting here.

      },

      get(target, name) {
        return () => {};
      }

    });
  }

}

class RaidbossConfigurator {
  constructor(cactbotConfigurator) {
    this.base = cactbotConfigurator; // TODO: is it worth adding the complexity to reflect this change in triggers that use it?
    // This is probably where using something like vue or react would be easier.
    // For the moment, folks can just reload, for real.

    this.alertsLang = this.base.getOption('raidboss', 'AlertsLanguage', this.base.lang);
    this.timelineLang = this.base.getOption('raidboss', 'TimelineLanguage', this.base.lang);
  }

  buildUI(container, raidbossFiles, userOptions) {
    const fileMap = this.processRaidbossFiles(raidbossFiles, userOptions);
    const expansionDivs = {};

    for (const key in fileMap) {
      const info = fileMap[key]; // "expansion" here is technically section, which includes "general triggers"
      // and one section per user file.

      const expansion = info.section;
      if (Object.keys(info.triggers).length === 0) continue;

      if (!expansionDivs[expansion]) {
        const expansionContainer = document.createElement('div');
        expansionContainer.classList.add('trigger-expansion-container', 'collapsed');
        container.appendChild(expansionContainer);
        const expansionHeader = document.createElement('div');
        expansionHeader.classList.add('trigger-expansion-header');

        expansionHeader.onclick = () => {
          expansionContainer.classList.toggle('collapsed');
        };

        expansionHeader.innerText = expansion;
        expansionContainer.appendChild(expansionHeader);
        expansionDivs[expansion] = expansionContainer;
      }

      const triggerContainer = document.createElement('div');
      triggerContainer.classList.add('trigger-file-container', 'collapsed');
      expansionDivs[expansion].appendChild(triggerContainer);
      const headerDiv = document.createElement('div');
      headerDiv.classList.add('trigger-file-header');

      headerDiv.onclick = () => {
        triggerContainer.classList.toggle('collapsed');
      };

      const parts = [info.title, info.type, info.prefix];

      for (let i = 0; i < parts.length; ++i) {
        if (!parts[i]) continue;
        const partDiv = document.createElement('div');
        partDiv.classList.add('trigger-file-header-part');
        partDiv.innerText = parts[i];
        headerDiv.appendChild(partDiv);
      }

      triggerContainer.appendChild(headerDiv);
      const triggerOptions = document.createElement('div');
      triggerOptions.classList.add('trigger-file-options');
      triggerContainer.appendChild(triggerOptions);

      for (const id in info.triggers) {
        const trig = info.triggers[id]; // Don't construct triggers that won't show anything.

        let hasOutputFunc = false;

        for (const func of responses/* triggerOutputFunctions */.ug) {
          if (trig[func]) {
            hasOutputFunc = true;
            break;
          }
        }

        if (!hasOutputFunc && !this.base.developerOptions) continue; // Build the trigger label.

        const triggerDiv = document.createElement('div');
        triggerDiv.innerHTML = trig.isMissingId ? '(???)' : trig.id;
        triggerDiv.classList.add('trigger');
        triggerOptions.appendChild(triggerDiv); // Container for the right side ui (select boxes, all of the info).

        const triggerDetails = document.createElement('div');
        triggerDetails.classList.add('trigger-details');
        triggerOptions.appendChild(triggerDetails);
        if (canBeConfigured(trig)) triggerDetails.appendChild(this.buildTriggerOptions(trig, triggerDiv));

        if (trig.isMissingId) {
          addTriggerDetail(triggerDetails, this.base.translate(kMiscTranslations.warning), this.base.translate(kMiscTranslations.missingId));
        }

        if (trig.overriddenByFile) {
          const baseText = this.base.translate(kMiscTranslations.overriddenByFile);
          const detailText = baseText.replace('${file}', trig.overriddenByFile);
          addTriggerDetail(triggerDetails, this.base.translate(kMiscTranslations.warning), detailText);
        } // Append some details about the trigger so it's more obvious what it is.


        for (const detailKey in kDetailKeys) {
          if (kDetailKeys[detailKey].generatedManually) continue;
          if (!this.base.developerOptions && kDetailKeys[detailKey].debugOnly) continue;
          if (!trig[detailKey] && !trig.output[detailKey]) continue;
          const detailCls = [kDetailKeys[detailKey].cls];
          let detailText;

          if (trig.output[detailKey]) {
            detailText = trig.output[detailKey];
          } else if (typeof trig[detailKey] === 'function') {
            detailText = this.base.translate(kMiscTranslations.valueIsFunction);
            detailCls.push('function-text');
          } else {
            detailText = trig[detailKey];
          }

          addTriggerDetail(triggerDetails, this.base.translate(kDetailKeys[detailKey].label), detailText, detailCls);
        }

        if (!canBeConfigured(trig)) continue; // Add beforeSeconds manually for timeline triggers.

        if (trig.isTimelineTrigger) {
          const detailKey = 'beforeSeconds';
          const optionKey = kOptionKeys.beforeSeconds;
          const label = document.createElement('div');
          label.innerText = this.base.translate(kDetailKeys[detailKey].label);
          label.classList.add('trigger-label');
          triggerDetails.appendChild(label);
          const div = document.createElement('div');
          div.classList.add('option-input-container', 'trigger-before-seconds');
          const input = document.createElement('input');
          div.appendChild(input);
          input.type = 'text';
          input.step = 'any'; // Say "(default)" for more complicated things like functions.

          let defaultValue = kMiscTranslations.valueDefault;
          if (trig.beforeSeconds === undefined) defaultValue = 0;else if (typeof trig.beforeSeconds === 'number') defaultValue = trig.beforeSeconds;
          input.placeholder = this.base.translate(defaultValue);
          input.value = this.base.getOption('raidboss', 'triggers', trig.id, optionKey, '');

          const setFunc = () => {
            const val = validDurationOrUndefined(input.value) || '';
            this.base.setOption('raidboss', 'triggers', trig.id, optionKey, val);
          };

          input.onchange = setFunc;
          input.oninput = setFunc;
          triggerDetails.appendChild(div);
        } // Add duration manually with an input to override.


        if (hasOutputFunc) {
          const detailKey = 'duration';
          const optionKey = kOptionKeys.duration;
          const label = document.createElement('div');
          label.innerText = this.base.translate(kDetailKeys[detailKey].label);
          label.classList.add('trigger-label');
          triggerDetails.appendChild(label);
          const div = document.createElement('div');
          div.classList.add('option-input-container', 'trigger-duration');
          const input = document.createElement('input');
          div.appendChild(input);
          input.type = 'text';
          input.step = 'any';
          input.placeholder = this.base.translate(kMiscTranslations.valueDefault);
          input.value = this.base.getOption('raidboss', 'triggers', trig.id, optionKey, '');

          const setFunc = () => {
            const val = validDurationOrUndefined(input.value) || '';
            this.base.setOption('raidboss', 'triggers', trig.id, optionKey, val);
          };

          input.onchange = setFunc;
          input.oninput = setFunc;
          triggerDetails.appendChild(div);
        } // Add output strings manually


        const outputStrings = trig.outputStrings || {};

        for (const key in outputStrings) {
          const optionKey = kOptionKeys.outputStrings;
          const template = this.base.translate(outputStrings[key]);
          const label = document.createElement('div');
          label.innerText = key;
          label.classList.add('trigger-outputstring-label');
          triggerDetails.appendChild(label);
          const div = document.createElement('div');
          div.classList.add('option-input-container', 'trigger-outputstring');
          const input = document.createElement('input');
          div.appendChild(input);
          input.type = 'text';
          input.placeholder = template;
          input.value = this.base.getOption('raidboss', 'triggers', trig.id, optionKey, key, '');

          const setFunc = () => this.base.setOption('raidboss', 'triggers', trig.id, optionKey, key, input.value);

          input.onchange = setFunc;
          input.oninput = setFunc;
          triggerDetails.appendChild(div);
        }

        const label = document.createElement('div');
        triggerDetails.appendChild(label);
        const div = document.createElement('div');
        div.classList.add('option-input-container', 'trigger-source');
        const baseUrl = 'https://github.com/quisquous/cactbot/blob/triggers';
        const path = key.split('-');
        let urlFilepath;

        if (path.length === 3) {
          // 00-misc/general.js
          urlFilepath = `${path[0]}-${path[1]}/${[...path].slice(2).join('-')}`;
        } else {
          // 02-arr/raids/t1.js
          urlFilepath = `${path[0]}-${path[1]}/${path[2]}/${[...path].slice(3).join('-')}`;
        }

        const escapedTriggerId = trig.id.replace(/'/g, '\\\'');
        const uriComponent = encodeURIComponent(`id: '${escapedTriggerId}'`).replace(/'/g, '%27');
        const urlString = `${baseUrl}/${urlFilepath}.js#:~:text=${uriComponent}`;
        div.innerHTML = `<a href="${urlString}" target="_blank">(${this.base.translate(kMiscTranslations.viewTriggerSource)})</a>`;
        triggerDetails.appendChild(div);
      }
    }
  } // This duplicates the raidboss function of the same name.


  valueOrFunction(f, data, matches, output) {
    const result = typeof f === 'function' ? f(data, matches, output) : f;
    if (result !== Object(result)) return result;
    if (result[this.alertsLang]) return this.valueOrFunction(result[this.alertsLang]);
    if (result[this.timelineLang]) return this.valueOrFunction(result[this.timelineLang]); // For partially localized results where this localization doesn't
    // exist, prefer English over nothing.

    return this.valueOrFunction(result['en']);
  }

  processTrigger(trig) {
    // TODO: with some hackiness (e.g. regexes?) we could figure out which
    // output string came from which alert type (alarm, alert, info, tts).
    trig.output = new DoNothingFuncProxy(outputStrings => {
      trig.outputStrings = trig.outputStrings || {};
      Object.assign(trig.outputStrings, outputStrings);
    });
    const kBaseFakeData = {
      party: new PartyTracker(),
      lang: this.base.lang,
      currentHP: 1000,
      options: this.base.configOptions,
      ShortName: x => x,
      StopCombat: () => {},
      ParseLocaleFloat: parseFloat,
      CanStun: () => util/* default.canStun */.Z.canStun(this.job),
      CanSilence: () => util/* default.canSilence */.Z.canSilence(this.job),
      CanSleep: () => util/* default.canSleep */.Z.canSleep(this.job),
      CanCleanse: () => util/* default.canCleanse */.Z.canCleanse(this.job),
      CanFeint: () => util/* default.canFeint */.Z.canFeint(this.job),
      CanAddle: () => util/* default.canAddle */.Z.canAddle(this.job)
    };
    const kFakeData = [{
      me: 'Tini Poutini',
      job: 'GNB',
      role: 'tank'
    }, {
      me: 'Potato Chippy',
      job: 'WHM',
      role: 'healer'
    }, {
      me: 'Tater Tot',
      job: 'BLM',
      role: 'dps'
    }, {
      me: 'Hash Brown',
      job: 'DRG',
      role: 'dps'
    }, {
      me: 'Aloo Gobi',
      job: 'BLU',
      role: 'dps'
    }];

    for (let i = 0; i < kFakeData.length; ++i) kFakeData[i] = Object.assign({}, kFakeData[i], kBaseFakeData);

    const kFakeMatches = {
      // TODO: really should convert all triggers to use regexes.js.
      // Mooooost triggers use matches[1] to be a name.
      1: kFakeData[0].me,
      sourceId: '41234567',
      source: 'Enemy',
      id: '1234',
      ability: 'Ability',
      targetId: '1234567',
      target: kFakeData[0].me,
      flags: '',
      x: 100,
      y: 100,
      z: 0,
      heading: 0,
      npcId: undefined,
      effect: 'Effect',
      duration: 30,
      code: '00',
      line: '',
      name: 'Name',
      capture: true
    };
    const output = {};
    const keys = ['alarmText', 'alertText', 'infoText', 'tts', 'sound']; // Try to determine some sample output?
    // This could get much more complicated if we wanted it to.

    const evalTrigger = (trig, key, idx) => {
      try {
        const result = this.valueOrFunction(trig[key], kFakeData[idx], kFakeMatches, trig.output);
        if (!result) return false; // Super hack:

        if (result.includes('undefined') || result.includes('NaN')) return false;
        output[key] = result;
        return true;
      } catch (e) {
        // This is all totally bogus.  Many triggers assume fields on data
        // are properly defined when these calls happen, so will throw errors.
        // So just silently ignore.
        return false;
      }
    }; // Handle 'response' first.


    if (trig.response) {
      const r = trig.response;

      for (let d = 0; d < kFakeData.length; ++d) {
        try {
          // Can't use ValueOrFunction here as r returns a non-localizable object.
          // FIXME: this hackily replicates some raidboss logic too.
          let response = r;

          while (typeof response === 'function') {
            // TODO: check if this has builtInResponseStr first.
            response = response(kFakeData[d], kFakeMatches, trig.output);
          }

          if (!response) continue;

          if (!trig.outputStrings) {
            for (const key of keys) evalTrigger(response, key, d);
          }

          break;
        } catch (e) {
          continue;
        }
      }
    } // Only evaluate fields if there are not outputStrings.
    // outputStrings will indicate more clearly what the trigger says.


    if (!trig.outputStrings) {
      for (const key of keys) {
        if (!trig[key]) continue;

        for (let d = 0; d < kFakeData.length; ++d) {
          if (evalTrigger(trig, key, d)) break;
        }
      }
    }

    trig.output = output;
    const lang = this.base.lang;

    const getRegex = baseField => {
      const shortLanguage = lang.charAt(0).toUpperCase() + lang.slice(1);
      const langSpecificRegex = trig[baseField + shortLanguage] || trig[baseField];
      if (!langSpecificRegex) return;
      const baseRegex = resources_regexes/* default.parse */.Z.parse(langSpecificRegex);
      if (!baseRegex) return;
      return resources_regexes/* default.parse */.Z.parse(baseRegex);
    };

    if (trig.isTimelineTrigger) {
      trig.timelineRegex = getRegex('regex');
    } else {
      trig.triggerRegex = getRegex('regex');
      trig.triggerNetRegex = getRegex('netRegex');
    }

    return trig;
  }

  processRaidbossFiles(files, userOptions) {
    // `files` is map of filename => triggerSet (for trigger files)
    // `map` is a sorted map of shortened zone key => { various fields, triggerSet }
    const map = this.base.processFiles(files, userOptions.Triggers);
    let triggerIdx = 0; // While walking through triggers, record any previous triggers with the same
    // id so that the ui can disable overriding information.

    const previousTriggerWithId = {};

    for (const item of Object.values(map)) {
      // TODO: maybe each trigger set needs a zone name, and we should
      // use that instead of the filename???
      const rawTriggers = {
        trigger: [],
        timeline: []
      };
      const triggerSet = item.triggerSet;
      if (triggerSet.triggers) rawTriggers.trigger.push(...triggerSet.triggers);
      if (triggerSet.timelineTriggers) rawTriggers.timeline.push(...triggerSet.timelineTriggers);
      item.triggers = {};

      for (const key in rawTriggers) {
        for (const trig of rawTriggers[key]) {
          triggerIdx++;

          if (!trig.id) {
            // Give triggers with no id some "unique" string so that they can
            // still be added to the set and show up in the ui.
            trig.id = `!!NoIdTrigger${triggerIdx}`;
            trig.isMissingId = true;
          } // Track if this trigger overrides any previous trigger.


          const previous = previousTriggerWithId[trig.id];
          if (previous) previous.overriddenByFile = triggerSet.filename;
          previousTriggerWithId[trig.id] = trig;
          trig.isTimelineTrigger = key === 'timeline'; // Also, if a user has two of the same id in the same triggerSet (?!)
          // then only the second trigger will show up.

          item.triggers[trig.id] = this.processTrigger(trig);
        }
      }
    }

    return map;
  }

  buildTriggerOptions(trig, labelDiv) {
    const optionKey = kOptionKeys.output;
    const div = document.createElement('div');
    div.classList.add('trigger-options');

    const updateLabel = input => {
      if (input.value === 'hidden' || input.value === 'disabled') labelDiv.classList.add('disabled');else labelDiv.classList.remove('disabled');
    };

    const input = document.createElement('select');
    div.appendChild(input);
    const selectValue = this.base.getOption('raidboss', 'triggers', trig.id, optionKey, 'default');

    for (const key in kTriggerOptions) {
      // Hide debug only options unless they are selected.
      // Otherwise, it will look weird to pick something like 'Disabled',
      // but then not show it when developer options are turned off.
      if (!this.base.developerOptions && kTriggerOptions[key].debugOnly && key !== selectValue) continue;
      const elem = document.createElement('option');
      elem.innerHTML = this.base.translate(kTriggerOptions[key].label);
      elem.value = key;
      elem.selected = key === selectValue;
      input.appendChild(elem);
      updateLabel(input);

      input.onchange = () => {
        updateLabel(input);
        let value = input.value;
        if (value.includes('default')) value = 'default';
        this.base.setOption('raidboss', 'triggers', trig.id, optionKey, input.value);
      };
    }

    return div;
  }

} // Raidboss needs to do some extra processing of user files.


const userFileHandler = (name, files, options, basePath) => {
  if (!options.Triggers) return;

  for (const set of options.Triggers) {
    // Annotate triggers with where they came from.  Note, options is passed in repeatedly
    // as multiple sets of user files add triggers, so only process each file once.
    if (set.isUserTriggerSet) continue; // `filename` here is just cosmetic for better debug printing to make it more clear
    // where a trigger or an override is coming from.

    set.filename = `${basePath}${name}`;
    set.isUserTriggerSet = true; // Convert set.timelineFile to set.timeline.

    if (set.timelineFile) {
      const lastIndex = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\')); // If lastIndex === -1, truncate name to the empty string.
      // if lastIndex > -1, truncate name after the final slash.

      const dir = name.substring(0, lastIndex + 1);
      const timelineFile = `${dir}${set.timelineFile}`;
      delete set.timelineFile;

      if (!(timelineFile in files)) {
        console.log(`ERROR: '${name}' specifies non-existent timeline file '${timelineFile}'.`);
        continue;
      } // set.timeline is processed recursively.


      set.timeline = [set.timeline, files[timelineFile]];
    }
  }
};

const templateOptions = {
  buildExtraUI: (base, container) => {
    const builder = new RaidbossConfigurator(base);
    const userOptions = { ...raidboss_options
    };
    user_config/* default.loadUserFiles */.Z.loadUserFiles('raidboss', userOptions, () => {
      builder.buildUI(container, raidboss_manifest/* default */.Z, userOptions);
    });
  },
  processExtraOptions: (options, savedConfig) => {
    // raidboss will look up this.options.PerTriggerAutoConfig to find these values.
    const optionName = 'PerTriggerAutoConfig';
    options[optionName] = options[optionName] || {};
    const triggers = savedConfig.triggers;
    if (!triggers) return;
    const perTrigger = options[optionName];
    const outputObjs = {};
    const keys = Object.keys(kTriggerOptions);

    for (const key of keys) {
      outputObjs[key] = {};
      setOptionsFromOutputValue(outputObjs[key], key);
    }

    for (const id in triggers) {
      const autoConfig = {};
      const output = triggers[id][kOptionKeys.output];
      if (output) Object.assign(autoConfig, outputObjs[output]);
      const duration = validDurationOrUndefined(triggers[id][kOptionKeys.duration]);
      if (duration) autoConfig[kOptionKeys.duration] = duration;
      const beforeSeconds = validDurationOrUndefined(triggers[id][kOptionKeys.beforeSeconds]);
      if (beforeSeconds) autoConfig[kOptionKeys.beforeSeconds] = beforeSeconds;
      const outputStrings = triggers[id][kOptionKeys.outputStrings];
      if (outputStrings) autoConfig[kOptionKeys.outputStrings] = outputStrings;
      if (output || duration || outputStrings) perTrigger[id] = autoConfig;
    }
  },
  options: [{
    id: 'Debug',
    name: {
      en: 'Enable debug mode',
      de: 'Aktiviere Debugmodus',
      fr: 'Activer le mode debug',
      ja: 'デバッグモードを有効にする',
      cn: '启用调试模式',
      ko: '디버그 모드 활성화'
    },
    type: 'checkbox',
    debugOnly: true
  }, {
    id: 'DefaultAlertOutput',
    name: {
      en: 'Default alert output',
      de: 'Standard Alert Ausgabe',
      fr: 'Alerte par défaut',
      ja: '警告情報出力既定値',
      cn: '默认警报提示信息输出方式',
      ko: '기본 알람 출력 방식'
    },
    type: 'select',
    options: {
      en: {
        '🆙🔊 Text and Sound': 'textAndSound',
        '🆙💬 Text and TTS': 'ttsAndText',
        '💬 TTS Only': 'ttsOnly',
        '🆙 Text Only': 'textOnly',
        '❌ Disabled': 'disabled'
      },
      de: {
        '🆙🔊 Text und Ton': 'textAndSound',
        '🆙💬 Text und TTS': 'ttsAndText',
        '💬 Nur TTS': 'ttsOnly',
        '🆙 Nur Text': 'textOnly',
        '❌ Deaktiviert': 'disabled'
      },
      fr: {
        '🆙🔊 Texte et son': 'textAndSound',
        '🆙💬 Texte et TTS': 'ttsAndText',
        '💬 TTS seulement': 'ttsOnly',
        '🆙 Texte seulement': 'textOnly',
        '❌ Désactivé': 'disabled'
      },
      ja: {
        '🆙🔊 テキストと音声': 'textAndSound',
        '🆙💬 テキストとTTS': 'ttsAndText',
        '💬 TTSのみ': 'ttsOnly',
        '🆙 テキストのみ': 'textOnly',
        '❌ 無効': 'disabled'
      },
      cn: {
        '🆙🔊 文字显示与提示音': 'textAndSound',
        '🆙💬 文字显示与TTS': 'ttsAndText',
        '💬 只使用TTS': 'ttsOnly',
        '🆙 只使用文字显示': 'textOnly',
        '❌ 禁用': 'disabled'
      },
      ko: {
        '🆙🔊 텍스트와 소리': 'textAndSound',
        '🆙💬 텍스트와 TTS': 'ttsAndText',
        '💬 TTS만': 'ttsOnly',
        '🆙 텍스트만': 'textOnly',
        '❌ 비활성화': 'disabled'
      }
    },
    default: 'textAndSound',
    setterFunc: setOptionsFromOutputValue
  }, {
    id: 'AlertsLanguage',
    name: {
      en: 'Alerts language',
      de: 'Alert Sprache',
      fr: 'Langue des alertes',
      ja: '警告情報の言語',
      cn: '警报提示文字的语言',
      ko: '알람 언어'
    },
    type: 'select',
    options: {
      en: {
        'Use Display Language': 'default',
        'English (en)': 'en',
        'Chinese (cn)': 'cn',
        'German (de)': 'de',
        'French (fr)': 'fr',
        'Japanese (ja)': 'ja',
        'Korean (ko)': 'ko'
      },
      fr: {
        'Utiliser la langue d\'affichage': 'default',
        'Anglais (en)': 'en',
        'Chinois (cn)': 'cn',
        'Allemand (de)': 'de',
        'Français (fr)': 'fr',
        'Japonais (ja)': 'ja',
        'Coréen (ko)': 'ko'
      },
      ja: {
        '表示言語既定値': 'default',
        '英語 (en)': 'en',
        '中国語 (cn)': 'cn',
        'ドイツ語 (de)': 'de',
        'フランス語 (fr)': 'fr',
        '日本語 (ja)': 'ja',
        '韓国語 (ko)': 'ko'
      },
      cn: {
        '使用显示语言': 'default',
        '英语 (en)': 'en',
        '汉语 (cn)': 'cn',
        '德语 (de)': 'de',
        '法语 (fr)': 'fr',
        '日语 (ja)': 'ja',
        '韩语 (ko)': 'ko'
      },
      ko: {
        '주 사용 언어 사용': 'default',
        '영어 (en)': 'en',
        '중국어 (cn)': 'cn',
        '독일어 (de)': 'de',
        '프랑스어 (fr)': 'fr',
        '일본어 (ja)': 'ja',
        '한국어 (ko)': 'ko'
      }
    },
    default: 'default',
    debug: true,
    setterFunc: (options, value) => {
      if (value === 'default') return;
      options['AlertsLanguage'] = value;
    }
  }, {
    id: 'TimelineLanguage',
    name: {
      en: 'Timeline language',
      de: 'Timeline Sprache',
      fr: 'Langue de la timeline',
      ja: 'タイムラインの言語',
      cn: '时间轴文本的语言',
      ko: '타임라인 언어'
    },
    type: 'select',
    options: {
      en: {
        'Use FFXIV Plugin Language': 'default',
        'English (en)': 'en',
        'Chinese (cn)': 'cn',
        'German (de)': 'de',
        'French (fr)': 'fr',
        'Japanese (ja)': 'ja',
        'Korean (ko)': 'ko'
      },
      de: {
        'Benutze FFXIV Plugin Sprache': 'default',
        'Englisch (en)': 'en',
        'Chinesisch (cn)': 'cn',
        'Deutsch (de)': 'de',
        'Französisch (fr)': 'fr',
        'Japanisch (ja)': 'ja',
        'Koreanisch (ko)': 'ko'
      },
      fr: {
        'Utiliser la langue du Plugin FFXIV': 'default',
        'Anglais (en)': 'en',
        'Chinois (cn)': 'cn',
        'Allemand (de)': 'de',
        'Français (fr)': 'fr',
        'Japonais (ja)': 'ja',
        'Coréen (ko)': 'ko'
      },
      ja: {
        'FFXIV Pluginの言語設定': 'default',
        '英語 (en)': 'en',
        '中国語 (cn)': 'cn',
        'ドイツ語 (de)': 'de',
        'フランス語 (fr)': 'fr',
        '日本語 (ja)': 'ja',
        '韓国語 (ko)': 'ko'
      },
      cn: {
        '使用最终幻想XIV解析插件设置的语言': 'default',
        '英语 (en)': 'en',
        '汉语 (cn)': 'cn',
        '德语 (de)': 'de',
        '法语 (fr)': 'fr',
        '日语 (ja)': 'ja',
        '韩语 (ko)': 'ko'
      },
      ko: {
        'FFXIV Plugin 언어 사용': 'default',
        '영어 (en)': 'en',
        '중국어 (cn)': 'cn',
        '독일어 (de)': 'de',
        '프랑스어 (fr)': 'fr',
        '일본어 (ja)': 'ja',
        '한국어 (ko)': 'ko'
      }
    },
    default: 'default',
    debug: true,
    setterFunc: (options, value) => {
      if (value === 'default') return;
      options['TimelineLanguage'] = value;
    }
  }, {
    id: 'Skin',
    name: {
      en: 'Raidboss Skin',
      de: 'Raidboss Skin',
      fr: 'Raidboss Skin',
      ja: 'Raidbossのスキン',
      cn: 'Raidboss皮肤',
      ko: 'Raidboss 스킨'
    },
    type: 'select',
    options: {
      en: {
        'Default': 'default',
        'lippe': 'lippe'
      },
      de: {
        'Default': 'default',
        'lippe': 'lippe'
      },
      fr: {
        'Défaut': 'default',
        'lippe': 'lippe'
      },
      ja: {
        '初期設定': 'default',
        'lippe': 'lippe'
      },
      cn: {
        '默认': 'default',
        'lippe': 'lippe'
      },
      ko: {
        '기본': 'default',
        'lippe': 'lippe'
      }
    },
    default: 'default'
  }, {
    id: 'TimelineEnabled',
    name: {
      en: 'Timeline enabled',
      de: 'Timeline aktiviert',
      fr: 'Timeline activée',
      ja: 'タイムラインを有効にする',
      cn: '启用时间轴',
      ko: '타임라인 활성화'
    },
    type: 'checkbox',
    default: true
  }, {
    id: 'AlertsEnabled',
    name: {
      en: 'Alerts enabled',
      de: 'Alerts aktiviert',
      fr: 'Alertes activées',
      ja: '警告情報を有効にする',
      cn: '启用提示文本显示',
      ko: '알람 활성화'
    },
    type: 'checkbox',
    default: true
  }, {
    id: 'ShowTimerBarsAtSeconds',
    name: {
      en: 'Timer bar show window (seconds)',
      de: 'Timer-Bar Anzeigedauer (in Sekunden)',
      fr: 'Fenêtre d\'affichage de la barre de temps (secondes)',
      ja: 'タイムバーに時間表示 (秒)',
      cn: '计时条显示时长 (秒)',
      ko: '타임라인을 표시할 기준 시간 (초 이하)'
    },
    type: 'float',
    default: 30
  }, {
    id: 'KeepExpiredTimerBarsForSeconds',
    name: {
      en: 'Keep expired timer bar (seconds)',
      de: 'Behalte abgelaufene Timer-Bar (in Sekunden)',
      fr: 'Garder la barre de temps expirée (secondes)',
      ja: '終了したタイムバーが消えるまでの待ち時間 (秒)',
      cn: '已失效的计时条的淡出时间 (秒)',
      ko: '만료된 타임라인이 사라지기까지의 시간 (초)'
    },
    type: 'float',
    default: 0.7
  }, {
    id: 'BarExpiresSoonSeconds',
    name: {
      en: 'Time to recolor timer as expiring soon (seconds)',
      de: 'Zeit bis ein bald auslaufender Timer umgefärbt wird (in Sekunden)',
      fr: 'Recolorisation de la barre de temps avant expiration (secondes)',
      ja: 'タイムバーが終了前に再度色付けの残り時間 (秒)',
      cn: '倒计时小于该值时当前计时条变色 (秒)',
      ko: '타임라인의 색상을 바꿀 기준 시간 (초 이하)'
    },
    type: 'integer',
    default: 6
  }, {
    id: 'MaxNumberOfTimerBars',
    name: {
      en: 'Max number of timer bars',
      de: 'Max Anzahl an Timer-Bars',
      fr: 'Nombre max de barres de temps',
      ja: 'タイムバーの最大数',
      cn: '计时条最大数量',
      ko: '표시할 타임라인의 최대 개수'
    },
    type: 'integer',
    default: 6
  }, {
    id: 'DisplayAlarmTextForSeconds',
    name: {
      en: 'Alarm text display duration (seconds)',
      de: 'Alarm-Text Anzeigedauer (in Sekunden)',
      fr: 'Durée d\'affichage du texte d\'alarme (secondes)',
      ja: '警報テキスト表示時間の長さ (秒)',
      cn: '警报文字显示持续时间 (秒)',
      ko: '경고 텍스트를 표시할 시간 (초)'
    },
    type: 'float',
    default: 3
  }, {
    id: 'DisplayAlertTextForSeconds',
    name: {
      en: 'Alert text display duration (seconds)',
      de: 'Alert-Text Anzeigedauer (in Sekunden)',
      fr: 'Durée d\'affichage du texte d\'alerte (secondes)',
      ja: '警告テキスト表示時間の長さ (秒)',
      cn: '警告文字显示持续时间 (秒)',
      ko: '주의 텍스트를 표시할 시간 (초)'
    },
    type: 'float',
    default: 3
  }, {
    id: 'DisplayInfoTextForSeconds',
    name: {
      en: 'Info text display duration (seconds)',
      de: 'Info-Text Anzeigedauer (in Sekunden)',
      fr: 'Durée d\'affichage du texte d\'information (secondes)',
      ja: '情報テキスト表示時間の長さ (秒)',
      cn: '信息文字显示持续时间 (秒)',
      ko: '안내 텍스트를 표시할 시간 (초)'
    },
    type: 'float',
    default: 3
  }, {
    id: 'AlarmSoundVolume',
    name: {
      en: 'Alarm sound volume (0-1)',
      de: 'Alarm Lautstärke (0-1)',
      fr: 'Volume de l\'alarme (0-1)',
      ja: '警報音声の音量 (0-1)',
      cn: '警报提示音的音量 (0-1)',
      ko: '경고 소리 크기 (0-1)'
    },
    type: 'float',
    default: 1
  }, {
    id: 'AlertSoundVolume',
    name: {
      en: 'Alert sound volume (0-1)',
      de: 'Alert Lautstärke (0-1)',
      fr: 'Volume de l\'alerte (0-1)',
      ja: '警告音声の音量 (0-1)',
      cn: '警告提示音的音量 (0-1)',
      ko: '주의 소리 크기 (0-1)'
    },
    type: 'float',
    default: 1
  }, {
    id: 'InfoSoundVolume',
    name: {
      en: 'Info sound volume (0-1)',
      de: 'Info Lautstärke (0-1)',
      fr: 'Volume de l\'info (0-1)',
      ja: '情報音声の音量 (0-1)',
      cn: '信息提示音的音量 (0-1)',
      ko: '안내 소리 크기 (0-1)'
    },
    type: 'float',
    default: 1
  }, {
    id: 'LongSoundVolume',
    name: {
      en: 'Long sound volume (0-1)',
      de: 'Langer Ton Lautstärke (0-1)',
      fr: 'Volume du son long (0-1)',
      ja: '長い音声の音量 (0-1)',
      cn: '长提示音的音量 (0-1)',
      ko: '긴 소리 크기 (0-1)'
    },
    type: 'float',
    default: 1
  }, {
    id: 'PullSoundVolume',
    name: {
      en: 'Pull sound volume (0-1)',
      de: 'Pull Lautstärke (0-1)',
      fr: 'Volume du son de pull (0-1)',
      ja: 'タゲ取る効果音の音量 (0-1)',
      cn: '开怪提示音的音量 (0-1)',
      ko: '풀링 소리 크기 (0-1)'
    },
    type: 'float',
    default: 1
  }, {
    id: 'cactbotWormholeStrat',
    // TODO: maybe need some way to group these kinds of
    // options if we end up having a lot?
    name: {
      en: 'Alex Ultimate: enable cactbot Wormhole strat',
      de: 'Alex Ultimate: aktiviere cactbot Wormhole Strategie',
      fr: 'Alex fatal : activer cactbot pour Wormhole strat',
      ja: '絶アレキサンダー討滅戦：cactbot「次元断絶のマーチ」ギミック',
      cn: '亚历山大绝境战：cactbot灵泉辅助功能',
      ko: '절 알렉: cactbot 웜홀 공략방식 활성화'
    },
    type: 'checkbox',
    default: false
  }, {
    id: 'cactbote8sUptimeKnockbackStrat',
    name: {
      en: 'e8s: enable cactbot Uptime Knockback strat',
      de: 'e8s: aktiviere cactbot Uptime Knockback Strategie',
      fr: 'e8s : activer cactbot pour Uptime Knockback strat',
      ja: 'エデン零式共鳴編４層：cactbot「ヘヴンリーストライク (ノックバック)」ギミック',
      cn: 'E8S: 启用cactbot的击退提示功能',
      ko: '공명 영웅 4층: cactbot 정확한 타이밍 넉백방지 공략 활성화'
    },
    type: 'checkbox',
    default: false
  }]
};
user_config/* default.registerOptions */.Z.registerOptions('raidboss', templateOptions, userFileHandler);
;// CONCATENATED MODULE: ./ui/raidboss/emulator/ui/EmulatedMap.js
class EmulatedMap {
  constructor(emulator) {}

}
// EXTERNAL MODULE: ./resources/netregexes.ts
var netregexes = __webpack_require__(381);
;// CONCATENATED MODULE: ./resources/translations.ts


// Fill in LocaleRegex so that things like LocaleRegex.countdownStart.de is a valid regex.
const localeLines = {
    countdownStart: {
        en: 'Battle commencing in (?<time>\\y{Float}) seconds! \\((?<player>.*?)\\)',
        de: 'Noch (?<time>\\y{Float}) Sekunden bis Kampfbeginn! \\((?<player>.*?)\\)',
        fr: 'Début du combat dans (?<time>\\y{Float}) secondes[ ]?! \\((?<player>.*?)\\)',
        ja: '戦闘開始まで(?<time>\\y{Float})秒！ \\((?<player>.*?)\\)',
        cn: '距离战斗开始还有(?<time>\\y{Float})秒！ （(?<player>.*?)）',
        ko: '전투 시작 (?<time>\\y{Float})초 전! \\((?<player>.*?)\\)',
    },
    countdownEngage: {
        en: 'Engage!',
        de: 'Start!',
        fr: 'À l\'attaque[ ]?!',
        ja: '戦闘開始！',
        cn: '战斗开始！',
        ko: '전투 시작!',
    },
    countdownCancel: {
        en: 'Countdown canceled by (?<player>\\y{Name})',
        de: '(?<player>\\y{Name}) hat den Countdown abgebrochen',
        fr: 'Le compte à rebours a été interrompu par (?<player>\\y{Name})[ ]?\\.',
        ja: '(?<player>\\y{Name})により、戦闘開始カウントがキャンセルされました。',
        cn: '(?<player>\\y{Name})取消了战斗开始倒计时。',
        ko: '(?<player>\\y{Name}) 님이 초읽기를 취소했습니다\\.',
    },
    areaSeal: {
        en: '(?<area>.*?) will be sealed off in (?<time>\\y{Float}) seconds!',
        de: 'Noch (?<time>\\y{Float}) Sekunden, bis sich (?<area>.*?) schließt',
        fr: 'Fermeture (?<area>.*?) dans (?<time>\\y{Float}) secondes[ ]?\\.',
        ja: '(?<area>.*?)の封鎖まであと(?<time>\\y{Float})秒',
        cn: '距(?<area>.*?)被封锁还有(?<time>\\y{Float})秒',
        ko: '(?<time>\\y{Float})초 후에 (?<area>.*?)(이|가) 봉쇄됩니다\\.',
    },
    areaUnseal: {
        en: '(?<area>.*?) is no longer sealed.',
        de: '(?<area>.*?) öffnet sich erneut.',
        fr: 'Ouverture (?<area>.*?)[ ]?!',
        ja: '(?<area>.*?)の封鎖が解かれた……',
        cn: '(?<area>.*?)的封锁解除了',
        ko: '(?<area>.*?)의 봉쇄가 해제되었습니다\\.',
    },
    // Recipe name always start with \ue0bb
    // HQ icon is \ue03c
    craftingStart: {
        en: 'You begin synthesizing (?<count>(an?|\\d+) )?\ue0bb(?<recipe>.*)\\.',
        de: 'Du hast begonnen, durch Synthese (?<count>(ein(e|es|em|er)?|\\d+) )?\ue0bb(?<recipe>.*) herzustellen\\.',
        fr: 'Vous commencez à fabriquer (?<count>(une?|\\d+) )?\ue0bb(?<recipe>.*)\\.',
        ja: '(?<player>\\y{Name})は\ue0bb(?<recipe>.*)(×(?<count>\\d+))?の製作を開始した。',
        cn: '(?<player>\\y{Name})开始制作“\ue0bb(?<recipe>.*)”(×(?<count>\\d+))?。',
        ko: '\ue0bb(?<recipe>.*)(×(?<count>\\d+)개)? 제작을 시작합니다\\.',
    },
    trialCraftingStart: {
        en: 'You begin trial synthesis of \ue0bb(?<recipe>.*)\\.',
        de: 'Du hast mit der Testsynthese von \ue0bb(?<recipe>.*) begonnen\\.',
        fr: 'Vous commencez une synthèse d\'essai pour une? \ue0bb(?<recipe>.*)\\.',
        ja: '(?<player>\\y{Name})は\ue0bb(?<recipe>.*)の製作練習を開始した。',
        cn: '(?<player>\\y{Name})开始练习制作\ue0bb(?<recipe>.*)。',
        ko: '\ue0bb(?<recipe>.*) 제작 연습을 시작합니다\\.',
    },
    craftingFinish: {
        en: 'You synthesize (?<count>(an?|\\d+) )?\ue0bb(?<recipe>.*)(\ue03c)?\\.',
        de: 'Du hast erfolgreich (?<count>(ein(e|es|em|er)?|\\d+) )?(?<recipe>.*)(\ue03c)? hergestellt\\.',
        fr: 'Vous fabriquez (?<count>(une?|\\d+) )?\ue0bb(?<recipe>.*)(\ue03c)?\\.',
        ja: '(?<player>\\y{Name})は\ue0bb(?<recipe>.*)(\ue03c)?(×(?<count>\\d+))?を完成させた！',
        cn: '(?<player>\\y{Name})制作“\ue0bb(?<recipe>.*)(\ue03c)?”(×(?<count>\\d+))?成功！',
        ko: '(?<player>\\y{Name}) 님이 \ue0bb(?<recipe>.*)(\ue03c)?(×(?<count>\\d+)개)?(을|를) 완성했습니다!',
    },
    trialCraftingFinish: {
        en: 'Your trial synthesis of \ue0bb(?<recipe>.*) proved a success!',
        de: 'Die Testsynthese von \ue0bb(?<recipe>.*) war erfolgreich!',
        fr: 'Votre synthèse d\'essai pour fabriquer \ue0bb(?<recipe>.*) a été couronnée de succès!',
        ja: '(?<player>\\y{Name})は\ue0bb(?<recipe>.*)の製作練習に成功した！',
        cn: '(?<player>\\y{Name})练习制作\ue0bb(?<recipe>.*)成功了！',
        ko: '\ue0bb(?<recipe>.*) 제작 연습에 성공했습니다!',
    },
    craftingFail: {
        en: 'Your synthesis fails!',
        de: 'Deine Synthese ist fehlgeschlagen!',
        fr: 'La synthèse échoue\\.{3}',
        ja: '(?<player>\\y{Name})は製作に失敗した……',
        cn: '(?<player>\\y{Name})制作失败了……',
        ko: '제작에 실패했습니다……\\.',
    },
    trialCraftingFail: {
        en: 'Your trial synthesis of \ue0bb(?<recipe>.*) failed\\.{3}',
        de: 'Die Testsynthese von \ue0bb(?<recipe>.*) ist fehlgeschlagen\\.{3}',
        fr: 'Votre synthèse d\'essai pour fabriquer \ue0bb(?<recipe>.*) s\'est soldée par un échec\\.{3}',
        ja: '(?<player>\\y{Name})は\ue0bb(?<recipe>.*)の製作練習に失敗した……',
        cn: '(?<player>\\y{Name})练习制作\ue0bb(?<recipe>.*)失败了……',
        ko: '\ue0bb(?<recipe>.*) 제작 연습에 실패했습니다……\\.',
    },
    craftingCancel: {
        en: 'You cancel the synthesis\\.',
        de: 'Du hast die Synthese abgebrochen\\.',
        fr: 'La synthèse est annulée\\.',
        ja: '(?<player>\\y{Name})は製作を中止した。',
        cn: '(?<player>\\y{Name})中止了制作作业。',
        ko: '제작을 중지했습니다\\.',
    },
    trialCraftingCancel: {
        en: 'You abandoned trial synthesis\\.',
        de: 'Testsynthese abgebrochen\\.',
        fr: 'Vous avez interrompu la synthèse d\'essai\\.',
        ja: '(?<player>\\y{Name})は製作練習を中止した。',
        cn: '(?<player>\\y{Name})停止了练习。',
        ko: '제작 연습을 중지했습니다\\.',
    },
};
class RegexSet {
    get localeRegex() {
        if (this.regexes)
            return this.regexes;
        this.regexes = this.buildLocaleRegexes(localeLines, (s) => resources_regexes/* default.gameLog */.Z.gameLog({ line: s + '.*?' }));
        return this.regexes;
    }
    get localeNetRegex() {
        if (this.netRegexes)
            return this.netRegexes;
        this.netRegexes = this.buildLocaleRegexes(localeLines, (s) => netregexes/* default.gameLog */.Z.gameLog({ line: s + '[^|]*?' }));
        return this.netRegexes;
    }
    buildLocaleRegexes(locales, builder) {
        return Object.fromEntries(Object
            .entries(locales)
            .map(([key, lines]) => [key, this.buildLocaleRegex(lines, builder)]));
    }
    buildLocaleRegex(lines, builder) {
        const regexEn = builder(lines.en);
        return {
            en: regexEn,
            de: lines.de ? builder(lines.de) : regexEn,
            fr: lines.fr ? builder(lines.fr) : regexEn,
            ja: lines.ja ? builder(lines.ja) : regexEn,
            cn: lines.cn ? builder(lines.cn) : regexEn,
            ko: lines.ko ? builder(lines.ko) : regexEn,
        };
    }
}
const regexSet = new RegexSet();
const LocaleRegex = regexSet.localeRegex;
const LocaleNetRegex = regexSet.localeNetRegex;

;// CONCATENATED MODULE: ./ui/raidboss/emulator/EmulatorCommon.ts


class EmulatorCommon_EmulatorCommon {
    static cloneData(data, exclude = ['options', 'party']) {
        const ret = {};
        // Use extra logic for top-level extend for property exclusion
        // This cut the execution time of this code from 41,000ms to 50ms when parsing a 12 minute pull
        for (const i in data) {
            if (exclude.includes(i))
                continue;
            if (typeof data[i] === 'object')
                ret[i] = EmulatorCommon_EmulatorCommon._cloneData(data[i]);
            else
                // Assignment of any to any. See DataType definition above for reasoning.
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ret[i] = data[i];
        }
        return ret;
    }
    static _cloneData(data) {
        if (typeof data === 'object') {
            if (Array.isArray(data)) {
                const ret = [];
                for (let i = 0; i < data.length; ++i)
                    ret[i] = EmulatorCommon_EmulatorCommon._cloneData(data[i]);
                return ret;
            }
            if (data === null)
                return null;
            if (data instanceof RegExp)
                return new RegExp(data);
            const ret = {};
            for (const i in data)
                ret[i] = EmulatorCommon_EmulatorCommon._cloneData(data[i]);
            return ret;
        }
        return data;
    }
    static timeToString(time, includeMillis = true) {
        const negative = time < 0 ? '-' : '';
        time = Math.abs(time);
        const millisNum = time % 1000;
        const secsNum = ((time % (60 * 1000)) - millisNum) / 1000;
        // Milliseconds
        const millis = `00${millisNum}`.substr(-3);
        const secs = `0${secsNum}`.substr(-2);
        const mins = `0${((((time % (60 * 60 * 1000)) - millisNum) / 1000) - secsNum) / 60}`.substr(-2);
        return negative + mins + ':' + secs + (includeMillis ? '.' + millis : '');
    }
    static timeToDateString(time) {
        return this.dateObjectToDateString(new Date(time));
    }
    static dateObjectToDateString(date) {
        const year = date.getFullYear();
        const month = EmulatorCommon_EmulatorCommon.zeroPad((date.getMonth() + 1).toString());
        const day = EmulatorCommon_EmulatorCommon.zeroPad(date.getDate().toString());
        return `${year}-${month}-${day}`;
    }
    static timeToTimeString(time, includeMillis = false) {
        return this.dateObjectToTimeString(new Date(time), includeMillis);
    }
    static dateObjectToTimeString(date, includeMillis = false) {
        const hour = EmulatorCommon_EmulatorCommon.zeroPad(date.getHours().toString());
        const minute = EmulatorCommon_EmulatorCommon.zeroPad(date.getMinutes().toString());
        const second = EmulatorCommon_EmulatorCommon.zeroPad(date.getSeconds().toString());
        let ret = `${hour}:${minute}:${second}`;
        if (includeMillis)
            ret = ret + `.${date.getMilliseconds()}`;
        return ret;
    }
    static msToDuration(ms) {
        const tmp = EmulatorCommon_EmulatorCommon.timeToString(ms, false);
        return tmp.replace(':', 'm') + 's';
    }
    static dateTimeToString(time, includeMillis = false) {
        const date = new Date(time);
        return `${this.dateObjectToDateString(date)} ${this.dateObjectToTimeString(date, includeMillis)}`;
    }
    static zeroPad(str, len = 2) {
        return ('' + str).padStart(len, '0');
    }
    static properCase(str) {
        return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    static spacePadLeft(str, len) {
        return str.padStart(len, ' ');
    }
    static doesLineMatch(line, regexes) {
        if (regexes instanceof RegExp)
            return regexes.exec(line);
        for (const langStr in regexes) {
            const lang = langStr;
            const res = regexes[lang].exec(line);
            if (res) {
                if (res.groups)
                    res.groups.language = lang;
                return res;
            }
        }
        return null;
    }
    static matchStart(line) {
        var _a, _b, _c, _d;
        let res;
        // Currently all of these regexes have groups if they match at all,
        // but be robust to that changing in the future.
        res = EmulatorCommon_EmulatorCommon.doesLineMatch(line, EmulatorCommon_EmulatorCommon.countdownRegexes);
        if (res) {
            (_a = res.groups) !== null && _a !== void 0 ? _a : (res.groups = {});
            res.groups.StartIn = (parseInt((_b = res.groups.time) !== null && _b !== void 0 ? _b : '0') * 1000).toString();
            res.groups.StartType = 'Countdown';
            return res;
        }
        res = EmulatorCommon_EmulatorCommon.doesLineMatch(line, EmulatorCommon_EmulatorCommon.sealRegexes);
        if (res) {
            (_c = res.groups) !== null && _c !== void 0 ? _c : (res.groups = {});
            res.groups.StartIn = '0';
            res.groups.StartType = 'Seal';
            return res;
        }
        res = EmulatorCommon_EmulatorCommon.doesLineMatch(line, EmulatorCommon_EmulatorCommon.engageRegexes);
        if (res) {
            (_d = res.groups) !== null && _d !== void 0 ? _d : (res.groups = {});
            res.groups.StartIn = '0';
            res.groups.StartType = 'Engage';
            return res;
        }
    }
    static matchEnd(line) {
        var _a, _b, _c, _d;
        let res;
        // Currently all of these regexes have groups if they match at all,
        // but be robust to that changing in the future.
        res = EmulatorCommon_EmulatorCommon.doesLineMatch(line, EmulatorCommon_EmulatorCommon.winRegex);
        if (res) {
            (_a = res.groups) !== null && _a !== void 0 ? _a : (res.groups = {});
            res.groups.EndType = 'Win';
            return res;
        }
        res = EmulatorCommon_EmulatorCommon.doesLineMatch(line, EmulatorCommon_EmulatorCommon.wipeRegex);
        if (res) {
            (_b = res.groups) !== null && _b !== void 0 ? _b : (res.groups = {});
            res.groups.EndType = 'Wipe';
            return res;
        }
        res = EmulatorCommon_EmulatorCommon.doesLineMatch(line, EmulatorCommon_EmulatorCommon.cactbotWipeRegex);
        if (res) {
            (_c = res.groups) !== null && _c !== void 0 ? _c : (res.groups = {});
            res.groups.EndType = 'Cactbot Wipe';
            return res;
        }
        res = EmulatorCommon_EmulatorCommon.doesLineMatch(line, EmulatorCommon_EmulatorCommon.unsealRegexes);
        if (res) {
            (_d = res.groups) !== null && _d !== void 0 ? _d : (res.groups = {});
            res.groups.EndType = 'Unseal';
            return res;
        }
    }
}
EmulatorCommon_EmulatorCommon.sealRegexes = LocaleNetRegex.areaSeal;
EmulatorCommon_EmulatorCommon.engageRegexes = LocaleNetRegex.countdownEngage;
EmulatorCommon_EmulatorCommon.countdownRegexes = LocaleNetRegex.countdownStart;
EmulatorCommon_EmulatorCommon.unsealRegexes = LocaleNetRegex.areaUnseal;
EmulatorCommon_EmulatorCommon.wipeRegex = netregexes/* default.network6d */.Z.network6d({ command: '40000010' });
EmulatorCommon_EmulatorCommon.winRegex = netregexes/* default.network6d */.Z.network6d({ command: '40000003' });
EmulatorCommon_EmulatorCommon.cactbotWipeRegex = netregexes/* default.echo */.Z.echo({ line: 'cactbot wipe.*?' });

;// CONCATENATED MODULE: ./ui/raidboss/emulator/EventBus.ts
/**
 * This is a base class that classes can extend to inherit event bus capabilities.
 * This allows other classes to listen for events with the `on` function.
 * The inheriting class can fire those events with the `dispatch` function.
 */
class EventBus_EventBus {
    constructor() {
        this.listeners = {};
    }
    /**
     * Subscribe to an event
     *
     * @param event The event(s) to subscribe to, space separated
     * @param callback The callback to invoke
     * @param scope Optional. The scope to apply the function against
     * @returns The callbacks registered to the event(s)
     */
    on(event, callback, scope) {
        var _a, _b;
        var _c;
        const events = event.split(' ');
        const ret = [];
        scope = scope !== null && scope !== void 0 ? scope : (typeof window === 'undefined' ? {} : window);
        for (const event of events) {
            const events = (_a = (_c = this.listeners)[event]) !== null && _a !== void 0 ? _a : (_c[event] = []);
            if (callback !== undefined)
                events.push({ event: event, scope: scope, callback: callback });
            ret.push(...((_b = this.listeners[event]) !== null && _b !== void 0 ? _b : []));
        }
        return ret;
    }
    /**
     * Dispatch an event to any subscribers
     *
     * @param event The event to dispatch
     * @param eventArguments The event arguments to pass to listeners
     * @returns A promise that can be await'd or ignored
     */
    async dispatch(event, ...eventArguments) {
        var _a;
        if (this.listeners[event] === undefined)
            return;
        for (const l of (_a = this.listeners[event]) !== null && _a !== void 0 ? _a : []) {
            const res = l.callback.apply(l.scope, eventArguments);
            await Promise.resolve(res);
        }
    }
}

// EXTERNAL MODULE: ./resources/not_reached.ts
var not_reached = __webpack_require__(500);
;// CONCATENATED MODULE: ./ui/raidboss/emulator/ui/Tooltip.ts

const hideEvents = [
    'mouseleave',
    'blur',
];
const validDirections = (/* unused pure expression or super */ null && ([
    'top',
    'right',
    'bottom',
    'left',
]));
const showEvents = [
    'mouseenter',
    'focus',
];
const toPx = (px) => `${px}px`;
class Tooltip {
    constructor(
    // @TODO: Refactor this to only accept HTMLElement after upstream classes are converted
    targetRef, direction, text, autoShow = true, autoHide = true) {
        this.offset = {
            x: 0,
            y: 0,
        };
        Tooltip.initializeTemplates();
        let target;
        if (typeof targetRef === 'string')
            target = document.querySelector(targetRef);
        else
            target = targetRef;
        if (!(target instanceof HTMLElement)) {
            const msg = 'Invalid selector or element passed to Tooltip';
            console.error(msg);
            throw new Error(msg);
        }
        this.target = target;
        this.direction = direction;
        this.tooltip = Tooltip.cloneTemplate(direction);
        const innerElem = this.tooltip.querySelector('.tooltip-inner');
        if (!(innerElem instanceof HTMLElement))
            throw new not_reached/* UnreachableCode */.$();
        this.inner = innerElem;
        const arrowElem = this.tooltip.querySelector('.arrow');
        if (!(arrowElem instanceof HTMLElement))
            throw new not_reached/* UnreachableCode */.$();
        this.arrow = arrowElem;
        this.setText(text);
        document.body.append(this.tooltip);
        if (autoShow) {
            showEvents.forEach((e) => {
                this.target.addEventListener(e, () => {
                    this.show();
                });
            });
        }
        if (autoHide) {
            hideEvents.forEach((e) => {
                this.target.addEventListener(e, () => {
                    this.hide();
                });
            });
        }
    }
    setText(text) {
        this.inner.textContent = text;
    }
    show() {
        const targetRect = this.target.getBoundingClientRect();
        const targetMiddle = {
            x: targetRect.x + (targetRect.width / 2),
            y: targetRect.y + (targetRect.height / 2),
        };
        const tooltipRect = this.tooltip.getBoundingClientRect();
        // Middle of tooltip - half of arrow height
        const lrArrowHeight = (tooltipRect.height / 2) -
            (this.arrow.getBoundingClientRect().height / 2);
        switch (this.direction) {
            case 'top':
                this.tooltip.style.left = toPx((targetMiddle.x - (tooltipRect.width / 2)) + this.offset.x);
                this.tooltip.style.bottom = toPx((targetRect.y - tooltipRect.height) + this.offset.y);
                break;
            case 'right':
                this.tooltip.style.left = toPx(targetRect.right + this.offset.x);
                this.tooltip.style.top = toPx((targetMiddle.y - (tooltipRect.height / 2)) + this.offset.y);
                this.arrow.style.top = toPx(lrArrowHeight);
                break;
            case 'bottom':
                this.tooltip.style.left = toPx((targetMiddle.x - (tooltipRect.width / 2)) + this.offset.x);
                this.tooltip.style.top = toPx(targetRect.bottom + this.offset.y);
                break;
            case 'left':
                this.tooltip.style.left = toPx((targetRect.left - tooltipRect.width) + this.offset.x);
                this.tooltip.style.top = toPx((targetMiddle.y - (tooltipRect.height / 2)) + this.offset.y);
                this.arrow.style.top = toPx(lrArrowHeight);
                break;
        }
        this.tooltip.classList.add('show');
        this.tooltip.setAttribute('data-show', '');
    }
    hide() {
        this.tooltip.classList.remove('show');
        this.tooltip.removeAttribute('data-show');
    }
    static initializeTemplates() {
        if (Tooltip.templates)
            return;
        Tooltip.templates = {
            top: Tooltip.getTemplate('top'),
            right: Tooltip.getTemplate('right'),
            bottom: Tooltip.getTemplate('bottom'),
            left: Tooltip.getTemplate('left'),
        };
    }
    static getTemplate(dir) {
        const elemName = `${dir}TooltipTemplate`;
        const ret = document.getElementById(elemName);
        if (ret instanceof HTMLElement)
            return ret;
        throw new not_reached/* UnreachableCode */.$();
    }
    static cloneTemplate(direction) {
        var _a;
        const template = Tooltip.templates[direction];
        const node = (_a = template.content.querySelector('.tooltip')) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
        if (node instanceof HTMLElement)
            return node;
        throw new not_reached/* UnreachableCode */.$();
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/ui/EmulatedPartyInfo.js




class EmulatedPartyInfo extends EventBus_EventBus {
  constructor(emulator) {
    super();
    this.tooltips = [];
    this.emulator = emulator;
    this.$partyInfo = document.querySelector('.partyInfoColumn .party');
    this.$triggerInfo = document.querySelector('.triggerInfoColumn');
    this.$triggerHideSkippedCheckbox = document.querySelector('.triggerHideSkipped');
    this.$triggerHideCollectCheckbox = document.querySelector('.triggerHideCollector');
    this.$triggerBar = document.querySelector('.playerTriggers');
    this.triggerBars = [];
    this.latestDisplayedState = 0;
    this.displayedParty = {};
    this.currentPerspective = null;

    for (let i = 0; i < 8; ++i) this.triggerBars[i] = this.$triggerBar.querySelector('.player' + i);

    emulator.on('tick', (currentLogTime, lastLogLineTime) => {
      if (lastLogLineTime) {
        this.updatePartyInfo(emulator, lastLogLineTime);
        this.latestDisplayedState = Math.max(this.latestDisplayedState, lastLogLineTime);
      }
    });
    emulator.on('currentEncounterChanged', encounter => {
      this.resetPartyInfo(encounter);
    });
    emulator.on('preSeek', time => {
      this.latestDisplayedState = 0;
    });
    emulator.on('postSeek', time => {
      this.updatePartyInfo(emulator, time);
      this.latestDisplayedState = Math.max(this.latestDisplayedState, time);
    });

    this.updateTriggerState = () => {
      if (this.$triggerHideSkippedCheckbox.checked) this.hideNonExecutedTriggers();else this.showNonExecutedTriggers();
      if (this.$triggerHideCollectCheckbox.checked) this.hideCollectorTriggers();else this.showCollectorTriggers();
    };

    this.$triggerHideSkippedCheckbox.addEventListener('change', this.updateTriggerState);
    this.$triggerHideCollectCheckbox.addEventListener('change', this.updateTriggerState);
    this.$triggerItemTemplate = document.querySelector('template.triggerItem').content.firstElementChild;
    this.$playerInfoRowTemplate = document.querySelector('template.playerInfoRow').content.firstElementChild;
    this.$playerTriggerInfoTemplate = document.querySelector('template.playerTriggerInfo').content.firstElementChild;
    this.$jsonViewerTemplate = document.querySelector('template.jsonViewer').content.firstElementChild;
    this.$triggerLabelTemplate = document.querySelector('template.triggerLabel').content.firstElementChild;
    this.$wrapCollapseTemplate = document.querySelector('template.wrapCollapse').content.firstElementChild;
  }

  hideNonExecutedTriggers() {
    this.$triggerInfo.querySelectorAll('.trigger-not-executed').forEach(n => {
      n.classList.add('d-none');
    });
  }

  showNonExecutedTriggers() {
    this.$triggerInfo.querySelectorAll('.trigger-not-executed').forEach(n => {
      n.classList.remove('d-none');
    });
  }

  hideCollectorTriggers() {
    this.$triggerInfo.querySelectorAll('.trigger-no-output').forEach(n => {
      n.classList.add('d-none');
    });
  }

  showCollectorTriggers() {
    this.$triggerInfo.querySelectorAll('.trigger-no-output').forEach(n => {
      n.classList.remove('d-none');
    });
  }
  /**
   * @param {RaidEmulator} emulator
   * @param {string} timestamp
   */


  updatePartyInfo(emulator, timestamp) {
    for (const id in this.displayedParty) this.updateCombatantInfo(emulator.currentEncounter, id, timestamp);
  }
  /**
   * @param {AnalyzedEncounter} encounter
   */


  resetPartyInfo(encounter) {
    this.tooltips.map(tt => {
      tt.tooltip.remove();
      return null;
    });
    this.tooltips = [];
    this.currentPerspective = null;
    this.displayedParty = {};
    this.latestDisplayedState = 0;
    this.$partyInfo.innerHTML = '';
    this.$triggerBar.querySelectorAll('.triggerItem').forEach(n => {
      n.remove();
    });
    const membersToDisplay = encounter.encounter.combatantTracker.partyMembers.sort((l, r) => {
      const a = encounter.encounter.combatantTracker.combatants[l];
      const b = encounter.encounter.combatantTracker.combatants[r];
      return EmulatedPartyInfo.jobOrder.indexOf(a.job) - EmulatedPartyInfo.jobOrder.indexOf(b.job);
    }).slice(0, 8);
    document.querySelectorAll('.playerTriggerInfo').forEach(n => {
      n.remove();
    });

    for (let i = 0; i < membersToDisplay.length; ++i) {
      const id = membersToDisplay[i];
      const obj = this.getPartyInfoObjectFor(encounter, id);
      this.displayedParty[id] = obj;
      this.updateCombatantInfo(encounter, id);
      this.$partyInfo.append(obj.$rootElem);
      this.$triggerInfo.append(obj.$triggerElem);
      this.triggerBars[i].classList.remove('tank');
      this.triggerBars[i].classList.remove('healer');
      this.triggerBars[i].classList.remove('dps');

      if (encounter.encounter.combatantTracker.combatants[id].job) {
        this.triggerBars[i].classList.add(util/* default.jobToRole */.Z.jobToRole(encounter.encounter.combatantTracker.combatants[id].job));
      }

      for (const triggerIndex in encounter.perspectives[id].triggers) {
        const trigger = encounter.perspectives[id].triggers[triggerIndex];
        if (!trigger.status.executed || trigger.resolvedOffset > encounter.encounter.duration) continue;
        const $e = this.$triggerItemTemplate.cloneNode(true);
        $e.style.left = trigger.resolvedOffset / encounter.encounter.duration * 100 + '%';
        this.tooltips.push(new Tooltip($e, 'bottom', trigger.triggerHelper.trigger.id));
        this.triggerBars[i].append($e);
      }
    }

    this.updateTriggerState();
    this.selectPerspective(membersToDisplay[0]);
  }

  selectPerspective(id) {
    if (id === this.currentPerspective) return;
    if (!this.emulator.currentEncounter.encounter.combatantTracker.combatants[id].job) return;
    this.currentPerspective = id;
    this.$triggerInfo.querySelectorAll('.playerTriggerInfo').forEach(r => r.classList.add('d-none'));
    this.displayedParty[id].$triggerElem.classList.remove('d-none');
    this.$partyInfo.querySelectorAll('.playerInfoRow').forEach(r => {
      r.classList.remove('border');
      r.classList.remove('border-success');
    });
    this.displayedParty[id].$rootElem.classList.add('border');
    this.displayedParty[id].$rootElem.classList.add('border-success');
    this.dispatch('selectPerspective', id);
  }

  updateCombatantInfo(encounter, id, stateID = null) {
    if (stateID <= this.latestDisplayedState) return;
    const combatant = encounter.encounter.combatantTracker.combatants[id];
    if (!combatant) return;
    stateID = stateID || combatant.getState(0);
    const State = combatant.getState(stateID);
    if (State === undefined) return;
    const hpProg = State.hp / State.maxHp * 100;
    let hpLabel = State.hp + '/' + State.maxHp;
    hpLabel = EmulatorCommon_EmulatorCommon.spacePadLeft(hpLabel, State.maxHp.toString().length * 2 + 1);
    this.displayedParty[id].$hpProgElem.ariaValueNow = State.hp;
    this.displayedParty[id].$hpProgElem.ariaValueMax = State.maxHp;
    this.displayedParty[id].$hpProgElem.style.width = hpProg + '%';
    this.displayedParty[id].$hpLabelElem.textContent = hpLabel;
    const mpProg = State.mp / State.maxMp * 100;
    let mpLabel = State.mp + '/' + State.maxMp;
    mpLabel = EmulatorCommon_EmulatorCommon.spacePadLeft(mpLabel, State.maxMp.toString().length * 2 + 1);
    this.displayedParty[id].$mpProgElem.ariaValueNow = State.mp;
    this.displayedParty[id].$mpProgElem.ariaValueMax = State.maxMp;
    this.displayedParty[id].$mpProgElem.style.width = mpProg + '%';
    this.displayedParty[id].$mpLabelElem.textContent = mpLabel;
  }

  getPartyInfoObjectFor(encounter, id) {
    const $e = this.$playerInfoRowTemplate.cloneNode(true);
    const $hp = $e.querySelector('.hp');
    const $mp = $e.querySelector('.mp');
    const $name = $e.querySelector('.playerName');
    const ret = {
      $rootElem: $e,
      $iconElem: $e.querySelector('jobicon'),
      $hpElem: $hp,
      $hpLabelElem: $hp.querySelector('.label'),
      $hpProgElem: $hp.querySelector('.progress-bar'),
      $mpElem: $mp,
      $mpLabelElem: $mp.querySelector('.label'),
      $mpProgElem: $mp.querySelector('.progress-bar'),
      $nameElem: $name,
      id: id,
      $triggerElem: this.getTriggerInfoObjectFor(encounter, id)
    };
    const combatant = encounter.encounter.combatantTracker.combatants[id];
    ret.$rootElem.classList.add((combatant.job || '').toUpperCase());
    this.tooltips.push(new Tooltip(ret.$rootElem, 'left', combatant.name));
    $name.innerHTML = combatant.name;
    ret.$rootElem.addEventListener('click', e => {
      this.selectPerspective(id);
    });
    ret.$triggerElem.setAttribute('data-id', id);
    return ret;
  }

  getTriggerInfoObjectFor(encounter, id) {
    const $ret = this.$playerTriggerInfoTemplate.cloneNode(true);
    const $container = $ret.querySelector('.d-flex.flex-column');
    const per = encounter.perspectives[id];
    const $initDataViewer = this.$jsonViewerTemplate.cloneNode(true);
    $initDataViewer.textContent = JSON.stringify(per.initialData, null, 2);
    $container.append(this._wrapCollapse({
      time: '00:00',
      name: 'Initial Data',
      classes: ['data'],
      $obj: $initDataViewer
    }));
    const $triggerContainer = $container.querySelector('.d-flex.flex-column');

    for (const i in per.triggers.sort((l, r) => l.resolvedOffset - r.resolvedOffset)) {
      const $triggerDataViewer = this.$jsonViewerTemplate.cloneNode(true);
      $triggerDataViewer.textContent = JSON.stringify(per.triggers[i], null, 2);
      const triggerText = this.getTriggerLabelText(per.triggers[i]);

      const $trigger = this._wrapCollapse({
        time: this.getTriggerResolvedLabelTime(per.triggers[i]),
        name: per.triggers[i].triggerHelper.trigger.id,
        icon: this.getTriggerLabelIcon(per.triggers[i]),
        text: triggerText,
        classes: [per.triggers[i].status.responseType],
        $obj: $triggerDataViewer
      });

      if (per.triggers[i].status.executed) $trigger.classList.add('trigger-executed');else $trigger.classList.add('trigger-not-executed');
      if (triggerText === undefined) $trigger.classList.add('trigger-no-output');else $trigger.classList.add('trigger-output');
      $triggerContainer.append($trigger);
    }

    $container.append($triggerContainer);
    const $finalDataViewer = this.$jsonViewerTemplate.cloneNode(true);
    $finalDataViewer.textContent = JSON.stringify(per.finalData, null, 2);
    $container.append(this._wrapCollapse({
      time: EmulatorCommon_EmulatorCommon.timeToString(encounter.encounter.duration - encounter.encounter.initialOffset, false),
      name: 'Final Data',
      classes: ['data'],
      $obj: $finalDataViewer
    }));
    return $ret;
  }

  getTriggerLabelText(trigger) {
    let ret = trigger.status.responseLabel;
    if (typeof ret === 'object') ret = trigger.triggerHelper.valueOrFunction(ret);
    if (typeof ret === 'boolean') ret = undefined;else if (typeof ret === 'undefined') ret = undefined;else if (typeof ret !== 'string') ret = 'Invalid Result?';
    if (ret === '') ret = undefined;
    return ret;
  }

  getTriggerLabelIcon(trigger) {
    const type = trigger.status.responseType;

    switch (type) {
      case 'info':
        return 'info';

      case 'alert':
        return 'bell';

      case 'alarm':
        return 'exclamation';

      case 'tts':
        return 'bullhorn';

      case 'audiofile':
        return 'volume-up';
    }

    return undefined;
  }

  getTriggerFiredLabelTime(Trigger) {
    return EmulatorCommon_EmulatorCommon.timeToString(Trigger.logLine.offset - this.emulator.currentEncounter.encounter.initialOffset, false);
  }

  getTriggerResolvedLabelTime(Trigger) {
    return EmulatorCommon_EmulatorCommon.timeToString(Trigger.resolvedOffset - this.emulator.currentEncounter.encounter.initialOffset, false);
  }
  /**
   * @param {object} params Parameters to use for the wrapper.
   * @param {Element} params.$obj Object to wrap in a collapseable button
   * @param {string} [params.time] Time to display
   * @param {string} [params.name] Name/label of the button
   * @param {string} [params.icon] FontAwesome icon to display
   * @param {[string]} [params.classes] Array of classes to add to the button
   * @param {CallableFunction} [params.onclick] Callback to trigger when clicking the button
   */


  _wrapCollapse(params) {
    const $ret = this.$wrapCollapseTemplate.cloneNode(true);
    const $button = $ret.querySelector('.btn');
    const $time = $ret.querySelector('.trigger-label-time');
    const $name = $ret.querySelector('.trigger-label-name');
    const $icon = $ret.querySelector('.trigger-label-icon');
    const $text = $ret.querySelector('.trigger-label-text');
    if (params.name === undefined) $name.parentNode.removeChild($name);else $name.textContent = params.name;
    if (params.time === undefined) $time.parentNode.removeChild($time);else $time.textContent = params.time;
    if (params.text === undefined) $text.parentNode.removeChild($text);else $text.textContent = params.text;
    if (params.icon === undefined) $icon.parentNode.removeChild($icon);else $icon.innerHTML = `<i class="fa fa-${params.icon}" aria-hidden="true"></i>`;
    if (Array.isArray(params.classes)) params.classes.forEach(c => $button.classList.add('triggertype-' + c));
    const $wrapper = $ret.querySelector('.wrap-collapse-wrapper');
    $button.addEventListener('click', () => {
      if ($wrapper.classList.contains('d-none')) $wrapper.classList.remove('d-none');else $wrapper.classList.add('d-none');
      typeof params.onclick === 'function' && params.onclick();
    });
    $wrapper.append(params.$obj);
    return $ret;
  }

}
EmulatedPartyInfo.jobOrder = ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'MNK', 'DRG', 'NIN', 'SAM', 'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM', 'BLU'];
;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/Combatant.ts

class Combatant {
    constructor(id, name) {
        this.name = '';
        this.server = '';
        this.states = {};
        this.significantStates = [];
        this.latestTimestamp = -1;
        this.id = id;
        this.setName(name);
    }
    setName(name) {
        var _a, _b, _c;
        // Sometimes network lines arrive after the combatant has been cleared
        // from memory in the client, so the network line will have a valid ID
        // but the name will be blank. Since we're tracking the name for the
        // entire fight and not on a state-by-state basis, we don't want to
        // blank out a name in this case.
        // If a combatant actually has a blank name, that's still allowed by
        // the constructor.
        if (name === '')
            return;
        const parts = name.split('(');
        this.name = (_a = parts[0]) !== null && _a !== void 0 ? _a : '';
        if (parts.length > 1)
            this.server = (_c = (_b = parts[1]) === null || _b === void 0 ? void 0 : _b.replace(/\)$/, '')) !== null && _c !== void 0 ? _c : '';
    }
    hasState(timestamp) {
        return this.states[timestamp] !== undefined;
    }
    pushState(timestamp, state) {
        this.states[timestamp] = state;
        this.latestTimestamp = timestamp;
        if (!this.significantStates.includes(timestamp))
            this.significantStates.push(timestamp);
    }
    nextSignificantState(timestamp) {
        var _a;
        // Shortcut out if this is significant or if there's no higher significant state
        const index = this.significantStates.indexOf(timestamp);
        const lastSignificantStateIndex = this.significantStates.length - 1;
        // If timestamp is a significant state already, and it's not the last one, return the next
        if (index >= 0 && index < lastSignificantStateIndex)
            return this.getStateByIndex(index + 1);
        // If timestamp is the last significant state or the timestamp is past the last significant
        // state, return the last significant state
        else if (index === lastSignificantStateIndex ||
            timestamp > ((_a = this.significantStates[lastSignificantStateIndex]) !== null && _a !== void 0 ? _a : 0))
            return this.getStateByIndex(lastSignificantStateIndex);
        for (let i = 0; i < this.significantStates.length; ++i) {
            const stateIndex = this.significantStates[i];
            if (stateIndex && stateIndex > timestamp)
                return this.getStateByIndex(i);
        }
        return this.getStateByIndex(this.significantStates.length - 1);
    }
    pushPartialState(timestamp, props) {
        var _a;
        if (this.states[timestamp] === undefined) {
            // Clone the last state before this timestamp
            const stateTimestamp = (_a = this.significantStates
                .filter((s) => s < timestamp)
                .sort((a, b) => b - a)[0]) !== null && _a !== void 0 ? _a : this.significantStates[0];
            if (stateTimestamp === undefined)
                throw new not_reached/* UnreachableCode */.$();
            const state = this.states[stateTimestamp];
            if (!state)
                throw new not_reached/* UnreachableCode */.$();
            this.states[timestamp] = state.partialClone(props);
        }
        else {
            const state = this.states[timestamp];
            if (!state)
                throw new not_reached/* UnreachableCode */.$();
            this.states[timestamp] = state.partialClone(props);
        }
        this.latestTimestamp = Math.max(this.latestTimestamp, timestamp);
        const lastSignificantStateTimestamp = this.significantStates[this.significantStates.length - 1];
        if (!lastSignificantStateTimestamp)
            throw new not_reached/* UnreachableCode */.$();
        const oldStateJSON = JSON.stringify(this.states[lastSignificantStateTimestamp]);
        const newStateJSON = JSON.stringify(this.states[timestamp]);
        if (lastSignificantStateTimestamp !== timestamp && newStateJSON !== oldStateJSON)
            this.significantStates.push(timestamp);
    }
    getState(timestamp) {
        const stateByTimestamp = this.states[timestamp];
        if (stateByTimestamp)
            return stateByTimestamp;
        const initialTimestamp = this.significantStates[0];
        if (initialTimestamp === undefined)
            throw new not_reached/* UnreachableCode */.$();
        if (timestamp < initialTimestamp)
            return this.getStateByIndex(0);
        let i = 0;
        for (; i < this.significantStates.length; ++i) {
            const prevTimestamp = this.significantStates[i];
            if (prevTimestamp === undefined)
                throw new not_reached/* UnreachableCode */.$();
            if (prevTimestamp > timestamp)
                return this.getStateByIndex(i - 1);
        }
        return this.getStateByIndex(i - 1);
    }
    // Should only be called when `index` is valid.
    getStateByIndex(index) {
        const stateIndex = this.significantStates[index];
        if (stateIndex === undefined)
            throw new not_reached/* UnreachableCode */.$();
        const state = this.states[stateIndex];
        if (state === undefined)
            throw new not_reached/* UnreachableCode */.$();
        return state;
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/CombatantJobSearch.ts
class CombatantJobSearch {
    static getJob(abilityId) {
        var _a;
        for (const job in CombatantJobSearch.abilities) {
            if ((_a = CombatantJobSearch.abilities[job]) === null || _a === void 0 ? void 0 : _a.includes(abilityId))
                return job;
        }
    }
}
CombatantJobSearch.abilityMatchRegex = /[a-fA-F0-9]{1,4}/i;
CombatantJobSearch.abilities = {
    PLD: [
        12959, 12961, 12964, 12967, 12968, 12969, 12970, 12971, 12972, 12973, 12974, 12975,
        12976, 12978, 12980, 12981, 12982, 12983, 12984, 12985, 12986, 12987, 12988, 12989,
        12991, 12992, 12993, 12994, 12996, 13000, 13001, 13006, 14480, 16457, 16458, 16459,
        16460, 16461, 17669, 17671, 17672, 17691, 17692, 17693, 17694, 17866, 18050, 27, 29,
        30, 3538, 3539, 3540, 3541, 3542, 4284, 4285, 4286, 50207, 50209, 50246, 50260, 50261,
        50262, 50263, 50264, 7382, 7383, 7384, 7385, 8746, 8749, 8750, 8751, 8752, 8754, 8755,
        8756,
    ],
    WAR: [
        16462, 16463, 16464, 16465, 17695, 17696, 17697, 17698, 17889, 3549, 3550, 3551, 3552,
        4289, 4290, 4291, 49, 50157, 50218, 50249, 50265, 50266, 50267, 50268, 50269, 51, 52,
        7386, 7387, 7388, 7389, 8758, 8761, 8762, 8763, 8764, 8765, 8767, 8768,
    ],
    DRK: [
        16466, 16467, 16468, 16469, 16470, 16471, 16472, 17700, 17701, 17702, 3617, 3621, 3623,
        3624, 3625, 3629, 3632, 3634, 3636, 3638, 3639, 3640, 3641, 3643, 4303, 4304, 4305, 4306,
        4307, 4308, 4309, 4310, 4311, 4312, 4680, 50158, 50159, 50271, 50272, 50319, 7390, 7391,
        7392, 7393, 8769, 8772, 8773, 8775, 8776, 8777, 8778, 8779,
    ],
    GNB: [
        17703, 17704, 17705, 17706, 17707, 17708, 17709, 17710, 17711, 17712, 17713, 17714,
        17716, 17717, 17890, 17891, 16137, 50320, 16138, 16139, 16140, 16141, 16142, 16143,
        16144, 16145, 16162, 50257, 16148, 16149, 16151, 16152, 50258, 16153, 16154, 16146,
        16147, 16150, 16159, 16160, 16161, 16155, 16156, 16157, 16158, 16163, 16164, 16165,
        50259,
    ],
    WHM: [
        12958, 12962, 12965, 12997, 13002, 13003, 13004, 13005, 131, 136, 137, 139, 140, 14481,
        1584, 16531, 16532, 16533, 16534, 16535, 16536, 17688, 17689, 17690, 17789, 17790, 17791,
        17793, 17794, 17832, 3568, 3569, 3570, 3571, 4296, 4297, 50181, 50182, 50196, 50307,
        50308, 50309, 50310, 7430, 7431, 7432, 7433, 8895, 8896, 8900, 9621, 127, 133,
    ],
    SCH: [
        16537, 16538, 16539, 16540, 16541, 16542, 16543, 16544, 16545, 16546, 16547, 16548, 16550,
        16551, 166, 167, 17215, 17216, 17795, 17796, 17797, 17798, 17802, 17864, 17865, 17869,
        17870, 17990, 185, 186, 188, 189, 190, 3583, 3584, 3585, 3586, 3587, 4300, 50184, 50214,
        50311, 50312, 50313, 50324, 7434, 7435, 7436, 7437, 7438, 7869, 802, 803, 805, 8904, 8905,
        8909, 9622,
    ],
    AST: [
        10027, 10028, 10029, 16552, 16553, 16554, 16555, 16556, 16557, 16558, 16559, 17055, 17151,
        17152, 17804, 17805, 17806, 17807, 17809, 17991, 3590, 3593, 3594, 3595, 3596, 3598, 3599,
        3600, 3601, 3603, 3604, 3605, 3606, 3608, 3610, 3612, 3613, 3614, 3615, 4301, 4302, 4401,
        4402, 4403, 4404, 4405, 4406, 4677, 4678, 4679, 50122, 50124, 50125, 50186, 50187, 50188,
        50189, 50314, 50315, 50316, 7439, 7440, 7441, 7442, 7443, 7444, 7445, 7448, 8324, 8913,
        8914, 8916, 9629,
    ],
    MNK: [
        12960, 12963, 12966, 12977, 12979, 12990, 12995, 12998, 12999, 14476, 14478, 16473, 16474,
        16475, 16476, 17674, 17675, 17676, 17677, 17719, 17720, 17721, 17722, 17723, 17724, 17725,
        17726, 3543, 3545, 3546, 3547, 4262, 4287, 4288, 50160, 50161, 50245, 50273, 50274, 63, 70,
        71, 7394, 7395, 7396, 74, 8780, 8781, 8782, 8783, 8784, 8785, 8787, 8789, 8925,
    ],
    DRG: [
        16477, 16478, 16479, 16480, 17728, 17729, 3553, 3554, 3555, 3556, 3557, 4292, 4293, 50162,
        50163, 50247, 50275, 50276, 7397, 7398, 7399, 7400, 86, 8791, 8792, 8793, 8794, 8795,
        8796, 8797, 8798, 8799, 8802, 8803, 8804, 8805, 8806, 92, 94, 95, 96, 9640, 75, 78,
    ],
    NIN: [
        16488, 16489, 16491, 16492, 16493, 17413, 17414, 17415, 17416, 17417, 17418, 17419, 17420,
        17732, 17733, 17734, 17735, 17736, 17737, 17738, 17739, 2246, 2259, 2260, 2261, 2262,
        2263, 2264, 2265, 2266, 2267, 2268, 2269, 2270, 2271, 2272, 3563, 3566, 4295, 50165,
        50166, 50167, 50250, 50279, 50280, 7401, 7402, 7403, 8807, 8808, 8809, 8810, 8812, 8814,
        8815, 8816, 8820, 9461,
    ],
    SAM: [
        16481, 16482, 16483, 16484, 16485, 16486, 16487, 17740, 17741, 17742, 17743, 17744, 50208,
        50215, 50277, 50278, 7477, 7478, 7479, 7480, 7481, 7482, 7483, 7484, 7485, 7486, 7487,
        7488, 7489, 7490, 7491, 7492, 7493, 7494, 7495, 7496, 7497, 7498, 7499, 7501, 7502, 7855,
        7857, 7867, 8821, 8822, 8823, 8824, 8825, 8826, 8828, 8829, 8830, 8831, 8833,
    ],
    BRD: [
        10023, 114, 116, 117, 118, 13007, 14479, 16494, 16495, 16496, 17678, 17679, 17680, 17681,
        17682, 17745, 17747, 3558, 3559, 3560, 3561, 3562, 4294, 50168, 50169, 50282, 50283, 50284,
        50285, 50286, 50287, 7404, 7405, 7406, 7407, 7408, 7409, 8836, 8837, 8838, 8839, 8841,
        8842, 8843, 8844, 9625, 106,
    ],
    MCH: [
        16497, 16498, 16499, 16500, 16501, 16502, 16503, 16504, 16766, 16889, 17206, 17209, 17749,
        17750, 17751, 17752, 17753, 17754, 2864, 2866, 2868, 2870, 2872, 2873, 2874, 2876, 2878,
        2890, 4276, 4675, 4676, 50117, 50119, 50288, 50289, 50290, 50291, 50292, 50293, 50294,
        7410, 7411, 7412, 7413, 7414, 7415, 7416, 7418, 8848, 8849, 8850, 8851, 8853, 8855,
    ],
    DNC: [
        17756, 17757, 17758, 17759, 17760, 17761, 17762, 17763, 17764, 17765, 17766, 17767,
        17768, 17769, 17770, 17771, 17772, 17773, 17824, 17825, 17826, 17827, 17828, 17829,
        18076, 15989, 15990, 15993, 15997, 15999, 16000, 16001, 16002, 16003, 16191, 16192,
        15991, 15994, 16007, 50252, 15995, 15992, 15996, 16008, 16010, 50251, 16015, 16012,
        16006, 18073, 50253, 16011, 16009, 50254, 15998, 16004, 16193, 16194, 16195, 16196,
        16013, 16005, 50255, 50256, 16014,
    ],
    BLM: [
        14477, 153, 154, 158, 159, 162, 16505, 16506, 16507, 17683, 17684, 17685, 17686, 17687,
        17774, 17775, 3573, 3574, 3575, 3576, 3577, 4298, 50171, 50172, 50173, 50174, 50295,
        50296, 50297, 50321, 50322, 7419, 7420, 7421, 7422, 8858, 8859, 8860, 8861, 8862, 8863,
        8864, 8865, 8866, 8867, 8869, 9637, 149, 155, 141, 152,
    ],
    SMN: [
        16510, 16511, 16513, 16514, 16515, 16516, 16517, 16518, 16519, 16522, 16523, 16549,
        16795, 16796, 16797, 16798, 16799, 16800, 16801, 16802, 16803, 17777, 17778, 17779,
        17780, 17781, 17782, 17783, 17784, 17785, 180, 184, 3578, 3579, 3580, 3581, 3582, 4299,
        50176, 50177, 50178, 50213, 50217, 50298, 50299, 50300, 50301, 50302, 7423, 7424, 7425,
        7426, 7427, 7428, 7429, 7449, 7450, 787, 788, 791, 792, 794, 796, 797, 798, 800, 801,
        8872, 8873, 8874, 8877, 8878, 8879, 8880, 8881, 9014, 9432,
    ],
    RDM: [
        10025, 16524, 16525, 16526, 16527, 16528, 16529, 16530, 17786, 17787, 17788, 50195,
        50200, 50201, 50216, 50303, 50304, 50305, 50306, 7503, 7504, 7505, 7506, 7507, 7509,
        7510, 7511, 7512, 7513, 7514, 7515, 7516, 7517, 7518, 7519, 7520, 7521, 7523, 7524,
        7525, 7526, 7527, 7528, 7529, 7530, 8882, 8883, 8884, 8885, 8887, 8888, 8889, 8890,
        8891, 8892, 9433, 9434,
    ],
    BLU: [
        11715, 11383, 11384, 11385, 11386, 11387, 11388, 11389, 11390, 11391, 11392, 11393,
        11394, 11395, 11396, 11397, 11398, 11399, 11400, 11401, 11402, 11403, 11404, 11405,
        11406, 11407, 11408, 11409, 11410, 11411, 11412, 11413, 11414, 11415, 11416, 11417,
        11418, 11419, 11420, 11421, 11422, 11423, 11424, 11425, 11426, 11427, 11428, 11429,
        11430, 11431, 50219, 50220, 50221, 50222, 50223, 50224,
    ],
};

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/CombatantState.ts
class CombatantState {
    constructor(posX, posY, posZ, heading, targetable, hp, maxHp, mp, maxMp) {
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.heading = heading;
        this.targetable = targetable;
        this.hp = hp;
        this.maxHp = maxHp;
        this.mp = mp;
        this.maxMp = maxMp;
    }
    partialClone(props) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return new CombatantState((_a = props.posX) !== null && _a !== void 0 ? _a : this.posX, (_b = props.posY) !== null && _b !== void 0 ? _b : this.posY, (_c = props.posZ) !== null && _c !== void 0 ? _c : this.posZ, (_d = props.heading) !== null && _d !== void 0 ? _d : this.heading, (_e = props.targetable) !== null && _e !== void 0 ? _e : this.targetable, (_f = props.hp) !== null && _f !== void 0 ? _f : this.hp, (_g = props.maxHp) !== null && _g !== void 0 ? _g : this.maxHp, (_h = props.mp) !== null && _h !== void 0 ? _h : this.mp, (_j = props.maxMp) !== null && _j !== void 0 ? _j : this.maxMp);
    }
    toPluginState() {
        return {
            PosX: this.posX,
            PosY: this.posY,
            PosZ: this.posZ,
            Heading: this.heading,
            CurrentHP: this.hp,
            MaxHP: this.maxHp,
            CurrentMP: this.mp,
            MaxMP: this.maxMp,
        };
    }
}

;// CONCATENATED MODULE: ./resources/pet_names.ts
// Auto-generated from gen_pet_names.py
// DO NOT EDIT THIS FILE DIRECTLY
const data = {
    'cn': [
        '绿宝石兽',
        '黄宝石兽',
        '伊弗利特之灵',
        '泰坦之灵',
        '迦楼罗之灵',
        '朝日小仙女',
        '夕月小仙女',
        '车式浮空炮塔',
        '象式浮空炮塔',
        '亚灵神巴哈姆特',
        '亚灵神不死鸟',
        '炽天使',
        '月长宝石兽',
        '英雄的掠影',
        '后式自走人偶',
        '分身',
    ],
    'de': [
        'Smaragd-Karfunkel',
        'Topas-Karfunkel',
        'Ifrit-Egi',
        'Titan-Egi',
        'Garuda-Egi',
        'Eos',
        'Selene',
        'Selbstschuss-Gyrocopter TURM',
        'Selbstschuss-Gyrocopter LÄUFER',
        'Demi-Bahamut',
        'Demi-Phönix',
        'Seraph',
        'Mondstein-Karfunkel',
        'Schattenschemen',
        'Automaton DAME',
        'Gedoppeltes Ich',
    ],
    'en': [
        'Emerald Carbuncle',
        'Topaz Carbuncle',
        'Ifrit-Egi',
        'Titan-Egi',
        'Garuda-Egi',
        'Eos',
        'Selene',
        'Rook Autoturret',
        'Bishop Autoturret',
        'Demi-Bahamut',
        'Demi-Phoenix',
        'Seraph',
        'Moonstone Carbuncle',
        'Esteem',
        'Automaton Queen',
        'Bunshin',
    ],
    'fr': [
        'Carbuncle émeraude',
        'Carbuncle topaze',
        'Ifrit-Egi',
        'Titan-Egi',
        'Garuda-Egi',
        'Eos',
        'Selene',
        'Auto-tourelle Tour',
        'Auto-tourelle Fou',
        'Demi-Bahamut',
        'Demi-Phénix',
        'Séraphin',
        'Carbuncle hécatolite',
        'Estime',
        'Automate Reine',
        'Ombre',
    ],
    'ja': [
        'カーバンクル・エメラルド',
        'カーバンクル・トパーズ',
        'イフリート・エギ',
        'タイタン・エギ',
        'ガルーダ・エギ',
        'フェアリー・エオス',
        'フェアリー・セレネ',
        'オートタレット・ルーク',
        'オートタレット・ビショップ',
        'デミ・バハムート',
        'デミ・フェニックス',
        'セラフィム',
        'カーバンクル・ムーンストーン',
        '英雄の影身',
        'オートマトン・クイーン',
        '分身',
    ],
    'ko': [
        '카벙클 에메랄드',
        '카벙클 토파즈',
        '이프리트 에기',
        '타이탄 에기',
        '가루다 에기',
        '요정 에오스',
        '요정 셀레네',
        '자동포탑 룩',
        '자동포탑 비숍',
        '데미바하무트',
        '데미피닉스',
        '세라핌',
        '카벙클 문스톤',
        '영웅의 환영',
        '자동인형 퀸',
        '분신',
    ],
};
/* harmony default export */ const pet_names = (data);

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent.ts

const fields = {
    event: 0,
    timestamp: 1,
};
/**
 * Generic class to track an FFXIV log line
 */
class LineEvent {
    constructor(repo, networkLine, parts) {
        var _a, _b, _c;
        this.networkLine = networkLine;
        this.offset = 0;
        this.invalid = false;
        this.index = 0;
        this.decEvent = parseInt((_a = parts[fields.event]) !== null && _a !== void 0 ? _a : '0');
        this.hexEvent = EmulatorCommon_EmulatorCommon.zeroPad(this.decEvent.toString(16).toUpperCase());
        this.timestamp = new Date((_b = parts[fields.timestamp]) !== null && _b !== void 0 ? _b : '0').getTime();
        this.checksum = (_c = parts.slice(-1)[0]) !== null && _c !== void 0 ? _c : '';
        repo.updateTimestamp(this.timestamp);
        this.convertedLine = this.prefix() + (parts.join(':')).replace('|', ':');
    }
    prefix() {
        return '[' + EmulatorCommon_EmulatorCommon.timeToTimeString(this.timestamp, true) + '] ' + this.hexEvent + ':';
    }
    static isDamageHallowed(damage) {
        return (parseInt(damage, 16) & parseInt('1000', 16)) > 0;
    }
    static isDamageBig(damage) {
        return (parseInt(damage, 16) & parseInt('4000', 16)) > 0;
    }
    static calculateDamage(damage) {
        if (LineEvent.isDamageHallowed(damage))
            return 0;
        damage = EmulatorCommon_EmulatorCommon.zeroPad(damage, 8);
        const parts = [
            damage.substr(0, 2),
            damage.substr(2, 2),
            damage.substr(4, 2),
            damage.substr(6, 2),
        ];
        if (!LineEvent.isDamageBig(damage))
            return parseInt(parts.slice(0, 2).reverse().join(''), 16);
        return parseInt((parts[3] + parts[0]) +
            (parseInt(parts[1], 16) - parseInt(parts[3], 16)).toString(16), 16);
    }
}
const isLineEventSource = (line) => {
    return 'isSource' in line;
};
const isLineEventTarget = (line) => {
    return 'isTarget' in line;
};
const isLineEventJobLevel = (line) => {
    return 'isJobLevel' in line;
};
const isLineEventAbility = (line) => {
    return 'isAbility' in line;
};

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/CombatantTracker.ts





class CombatantTracker {
    constructor(logLines, language) {
        this.combatants = {};
        this.partyMembers = [];
        this.enemies = [];
        this.others = [];
        this.pets = [];
        this.initialStates = {};
        this.language = language;
        this.firstTimestamp = Number.MAX_SAFE_INTEGER;
        this.lastTimestamp = 0;
        this.initialize(logLines);
        // Clear initialStates after we initialize, we don't need it anymore
        this.initialStates = {};
    }
    initialize(logLines) {
        var _a, _b, _c, _d, _e, _f, _g;
        // First pass: Get list of combatants, figure out where they
        // start at if possible
        for (const line of logLines) {
            this.firstTimestamp = Math.min(this.firstTimestamp, line.timestamp);
            this.lastTimestamp = Math.max(this.lastTimestamp, line.timestamp);
            if (isLineEventSource(line))
                this.addCombatantFromLine(line);
            if (isLineEventTarget(line))
                this.addCombatantFromTargetLine(line);
        }
        // Between passes: Create our initial combatant states
        for (const id in this.initialStates) {
            const state = (_a = this.initialStates[id]) !== null && _a !== void 0 ? _a : {};
            (_b = this.combatants[id]) === null || _b === void 0 ? void 0 : _b.pushState(this.firstTimestamp, new CombatantState(Number(state.posX), Number(state.posY), Number(state.posZ), Number(state.heading), (_c = state.targetable) !== null && _c !== void 0 ? _c : false, Number(state.hp), Number(state.maxHp), Number(state.mp), Number(state.maxMp)));
        }
        // Second pass: Analyze combatant information for tracking
        const eventTracker = {};
        for (const line of logLines) {
            if (isLineEventSource(line)) {
                const state = this.extractStateFromLine(line);
                if (state) {
                    eventTracker[line.id] = (_d = eventTracker[line.id]) !== null && _d !== void 0 ? _d : 0;
                    ++eventTracker[line.id];
                    (_e = this.combatants[line.id]) === null || _e === void 0 ? void 0 : _e.pushPartialState(line.timestamp, state);
                }
            }
            if (isLineEventTarget(line)) {
                const state = this.extractStateFromTargetLine(line);
                if (state) {
                    eventTracker[line.targetId] = (_f = eventTracker[line.targetId]) !== null && _f !== void 0 ? _f : 0;
                    ++eventTracker[line.targetId];
                    (_g = this.combatants[line.targetId]) === null || _g === void 0 ? void 0 : _g.pushPartialState(line.timestamp, state);
                }
            }
        }
        // Figure out party/enemy/other status
        const petNames = pet_names[this.language];
        this.others = this.others.filter((ID) => {
            var _a, _b, _c, _d, _e;
            if (((_a = this.combatants[ID]) === null || _a === void 0 ? void 0 : _a.job) !== undefined &&
                ((_b = this.combatants[ID]) === null || _b === void 0 ? void 0 : _b.job) !== 'NONE' &&
                ID.startsWith('1')) {
                this.partyMembers.push(ID);
                return false;
            }
            else if (petNames.includes((_d = (_c = this.combatants[ID]) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '')) {
                this.pets.push(ID);
                return false;
            }
            else if (((_e = eventTracker[ID]) !== null && _e !== void 0 ? _e : 0) > 0) {
                this.enemies.push(ID);
                return false;
            }
            return true;
        });
        // Main combatant is the one that took the most actions
        this.mainCombatantID = this.enemies.sort((l, r) => {
            var _a, _b;
            return ((_a = eventTracker[r]) !== null && _a !== void 0 ? _a : 0) - ((_b = eventTracker[l]) !== null && _b !== void 0 ? _b : 0);
        })[0];
    }
    addCombatantFromLine(line) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        const combatant = this.initCombatant(line.id, line.name);
        const initState = (_a = this.initialStates[line.id]) !== null && _a !== void 0 ? _a : {};
        const extractedState = (_b = this.extractStateFromLine(line)) !== null && _b !== void 0 ? _b : {};
        initState.posX = (_c = initState.posX) !== null && _c !== void 0 ? _c : extractedState.posX;
        initState.posY = (_d = initState.posY) !== null && _d !== void 0 ? _d : extractedState.posY;
        initState.posZ = (_e = initState.posZ) !== null && _e !== void 0 ? _e : extractedState.posZ;
        initState.heading = (_f = initState.heading) !== null && _f !== void 0 ? _f : extractedState.heading;
        initState.targetable = (_g = initState.targetable) !== null && _g !== void 0 ? _g : extractedState.targetable;
        initState.hp = (_h = initState.hp) !== null && _h !== void 0 ? _h : extractedState.hp;
        initState.maxHp = (_j = initState.maxHp) !== null && _j !== void 0 ? _j : extractedState.maxHp;
        initState.mp = (_k = initState.mp) !== null && _k !== void 0 ? _k : extractedState.mp;
        initState.maxMp = (_l = initState.maxMp) !== null && _l !== void 0 ? _l : extractedState.maxMp;
        if (isLineEventJobLevel(line)) {
            combatant.job = (_o = (_m = this.combatants[line.id]) === null || _m === void 0 ? void 0 : _m.job) !== null && _o !== void 0 ? _o : line.job;
            combatant.level = (_q = (_p = this.combatants[line.id]) === null || _p === void 0 ? void 0 : _p.level) !== null && _q !== void 0 ? _q : line.level;
        }
        if (isLineEventAbility(line)) {
            if (!combatant.job && !line.id.startsWith('4') && line.abilityId !== undefined)
                combatant.job = CombatantJobSearch.getJob(line.abilityId);
        }
        if (combatant.job)
            combatant.job = combatant.job.toUpperCase();
    }
    addCombatantFromTargetLine(line) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.initCombatant(line.targetId, line.targetName);
        const initState = (_a = this.initialStates[line.targetId]) !== null && _a !== void 0 ? _a : {};
        const extractedState = (_b = this.extractStateFromTargetLine(line)) !== null && _b !== void 0 ? _b : {};
        initState.posX = (_c = initState.posX) !== null && _c !== void 0 ? _c : extractedState.posX;
        initState.posY = (_d = initState.posY) !== null && _d !== void 0 ? _d : extractedState.posY;
        initState.posZ = (_e = initState.posZ) !== null && _e !== void 0 ? _e : extractedState.posZ;
        initState.heading = (_f = initState.heading) !== null && _f !== void 0 ? _f : extractedState.heading;
        initState.hp = (_g = initState.hp) !== null && _g !== void 0 ? _g : extractedState.hp;
        initState.maxHp = (_h = initState.maxHp) !== null && _h !== void 0 ? _h : extractedState.maxHp;
        initState.mp = (_j = initState.mp) !== null && _j !== void 0 ? _j : extractedState.mp;
        initState.maxMp = (_k = initState.maxMp) !== null && _k !== void 0 ? _k : extractedState.maxMp;
    }
    extractStateFromLine(line) {
        const state = {};
        if (line.x !== undefined)
            state.posX = line.x;
        if (line.y !== undefined)
            state.posY = line.y;
        if (line.z !== undefined)
            state.posZ = line.z;
        if (line.heading !== undefined)
            state.heading = line.heading;
        if (line.targetable !== undefined)
            state.targetable = line.targetable;
        if (line.hp !== undefined)
            state.hp = line.hp;
        if (line.maxHp !== undefined)
            state.maxHp = line.maxHp;
        if (line.mp !== undefined)
            state.mp = line.mp;
        if (line.maxMp !== undefined)
            state.maxMp = line.maxMp;
        return state;
    }
    extractStateFromTargetLine(line) {
        const state = {};
        if (line.targetX !== undefined)
            state.posX = line.targetX;
        if (line.targetY !== undefined)
            state.posY = line.targetY;
        if (line.targetZ !== undefined)
            state.posZ = line.targetZ;
        if (line.targetHeading !== undefined)
            state.heading = line.targetHeading;
        if (line.targetHp !== undefined)
            state.hp = line.targetHp;
        if (line.targetMaxHp !== undefined)
            state.maxHp = line.targetMaxHp;
        if (line.targetMp !== undefined)
            state.mp = line.targetMp;
        if (line.targetMaxMp !== undefined)
            state.maxMp = line.targetMaxMp;
        return state;
    }
    initCombatant(id, name) {
        let combatant = this.combatants[id];
        if (combatant === undefined) {
            combatant = this.combatants[id] = new Combatant(id, name);
            this.others.push(id);
            this.initialStates[id] = {
                targetable: true,
            };
        }
        else if (combatant.name === '') {
            combatant.setName(name);
        }
        return combatant;
    }
    getMainCombatantName() {
        var _a, _b;
        if (this.mainCombatantID)
            return (_b = (_a = this.combatants[this.mainCombatantID]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Unknown';
        return 'Unknown';
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LogRepository.ts
class LogRepository {
    constructor() {
        this.Combatants = {};
        this.firstTimestamp = Number.MAX_SAFE_INTEGER;
    }
    updateTimestamp(timestamp) {
        this.firstTimestamp = Math.min(this.firstTimestamp, timestamp);
    }
    updateCombatant(id, c) {
        id = id.toUpperCase();
        if (id && id.length) {
            let combatant = this.Combatants[id];
            if (combatant === undefined) {
                combatant = {
                    name: c.name,
                    job: c.job,
                    spawn: c.spawn,
                    despawn: c.despawn,
                };
                this.Combatants[id] = combatant;
            }
            else {
                combatant.name = c.name || combatant.name;
                combatant.job = c.job || combatant.job;
                combatant.spawn = Math.min(combatant.spawn, c.spawn);
                combatant.despawn = Math.max(combatant.despawn, c.despawn);
            }
        }
    }
    resolveName(id, name, fallbackId = null, fallbackName = null) {
        var _a, _b;
        let ret = name;
        if (fallbackId !== null) {
            if (id === 'E0000000' && ret === '') {
                if (fallbackId.startsWith('4'))
                    ret = fallbackName !== null && fallbackName !== void 0 ? fallbackName : '';
                else
                    ret = 'Unknown';
            }
        }
        if (ret === '')
            ret = (_b = (_a = this.Combatants[id]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '';
        return ret;
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x00.ts

const LineEvent0x00_fields = {
    type: 2,
    speaker: 3,
};
// Chat event
class LineEvent0x00 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b;
        super(repo, line, parts);
        this.type = (_a = parts[LineEvent0x00_fields.type]) !== null && _a !== void 0 ? _a : '';
        this.speaker = (_b = parts[LineEvent0x00_fields.speaker]) !== null && _b !== void 0 ? _b : '';
        this.message = parts.slice(4, -1).join('|');
        // The exact reason for this check isn't clear anymore but may be related to
        // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/250
        if (this.message.split('\u001f\u001f').length > 1)
            this.invalid = true;
        this.convertedLine =
            this.prefix() + this.type + ':' +
                // If speaker is blank, it's excluded from the converted line
                (this.speaker !== '' ? this.speaker + ':' : '') +
                this.message.trim();
        this.convertedLine = LineEvent00.replaceChatSymbols(this.convertedLine);
    }
    static replaceChatSymbols(line) {
        for (const rep of LineEvent00.chatSymbolReplacements)
            line = line.replace(rep.Search, rep.Replace);
        return line;
    }
}
LineEvent0x00.chatSymbolReplacements = [
    {
        Search: /:\uE06F/g,
        Replace: ':⇒',
        Type: 'Symbol',
    },
    {
        Search: / \uE0BB\uE05C/g,
        Replace: ' ',
        Type: 'Positive Effect',
    },
    {
        Search: / \uE0BB\uE05B/g,
        Replace: ' ',
        Type: 'Negative Effect',
    },
];
class LineEvent00 extends LineEvent0x00 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x01.ts


const LineEvent0x01_fields = {
    zoneId: 2,
    zoneName: 3,
};
// Zone change event
class LineEvent0x01_LineEvent0x01 extends LineEvent {
    constructor(repo, networkLine, parts) {
        var _a, _b;
        super(repo, networkLine, parts);
        this.zoneId = (_a = parts[LineEvent0x01_fields.zoneId]) !== null && _a !== void 0 ? _a : '';
        this.zoneName = (_b = parts[LineEvent0x01_fields.zoneName]) !== null && _b !== void 0 ? _b : '';
        this.zoneNameProperCase = EmulatorCommon_EmulatorCommon.properCase(this.zoneName);
        this.convertedLine = this.prefix() +
            'Changed Zone to ' + this.zoneName + '.';
        this.properCaseConvertedLine = this.prefix() +
            'Changed Zone to ' + this.zoneNameProperCase + '.';
    }
}
class LineEvent01 extends LineEvent0x01_LineEvent0x01 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x02.ts

const LineEvent0x02_fields = {
    id: 2,
    name: 3,
};
// Player change event
class LineEvent0x02 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c;
        super(repo, line, parts);
        this.id = (_b = (_a = parts[LineEvent0x02_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x02_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.convertedLine = this.prefix() + 'Changed primary player to ' + this.name + '.';
    }
}
class LineEvent02 extends LineEvent0x02 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x03.ts



const LineEvent0x03_fields = {
    id: 2,
    name: 3,
    jobIdHex: 4,
    levelString: 5,
    ownerId: 6,
    worldId: 7,
    worldName: 8,
    npcNameId: 9,
    npcBaseId: 10,
    currentHp: 11,
    maxHpString: 14,
    currentMp: 13,
    maxMpString: 14,
    currentTp: 15,
    maxTp: 16,
    xString: 17,
    yString: 18,
    zString: 19,
    heading: 20,
};
// Added combatant event
class LineEvent0x03 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        super(repo, line, parts);
        this.isSource = true;
        this.isJobLevel = true;
        this.id = (_b = (_a = parts[LineEvent0x03_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x03_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.jobIdHex = (_e = (_d = parts[LineEvent0x03_fields.jobIdHex]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '';
        this.jobId = parseInt(this.jobIdHex, 16);
        this.job = util/* default.jobEnumToJob */.Z.jobEnumToJob(this.jobId);
        this.levelString = (_f = parts[LineEvent0x03_fields.levelString]) !== null && _f !== void 0 ? _f : '';
        this.level = parseFloat(this.levelString);
        this.ownerId = (_h = (_g = parts[LineEvent0x03_fields.ownerId]) === null || _g === void 0 ? void 0 : _g.toUpperCase()) !== null && _h !== void 0 ? _h : '';
        this.worldId = (_j = parts[LineEvent0x03_fields.worldId]) !== null && _j !== void 0 ? _j : '';
        this.worldName = (_k = parts[LineEvent0x03_fields.worldName]) !== null && _k !== void 0 ? _k : '';
        this.npcNameId = (_l = parts[LineEvent0x03_fields.npcNameId]) !== null && _l !== void 0 ? _l : '';
        this.npcBaseId = (_m = parts[LineEvent0x03_fields.npcBaseId]) !== null && _m !== void 0 ? _m : '';
        this.hp = parseFloat((_o = parts[LineEvent0x03_fields.currentHp]) !== null && _o !== void 0 ? _o : '');
        this.maxHpString = (_p = parts[LineEvent0x03_fields.maxHpString]) !== null && _p !== void 0 ? _p : '';
        this.maxHp = parseFloat(this.maxHpString);
        this.mp = parseFloat((_q = parts[LineEvent0x03_fields.currentMp]) !== null && _q !== void 0 ? _q : '');
        this.maxMpString = (_r = parts[LineEvent0x03_fields.maxMpString]) !== null && _r !== void 0 ? _r : '';
        this.maxMp = parseFloat(this.maxMpString);
        this.tp = parseFloat((_s = parts[LineEvent0x03_fields.currentTp]) !== null && _s !== void 0 ? _s : '');
        this.maxTp = parseFloat((_t = parts[LineEvent0x03_fields.maxTp]) !== null && _t !== void 0 ? _t : '');
        this.xString = (_u = parts[LineEvent0x03_fields.xString]) !== null && _u !== void 0 ? _u : '';
        this.x = parseFloat(this.xString);
        this.yString = (_v = parts[LineEvent0x03_fields.yString]) !== null && _v !== void 0 ? _v : '';
        this.y = parseFloat(this.yString);
        this.zString = (_w = parts[LineEvent0x03_fields.zString]) !== null && _w !== void 0 ? _w : '';
        this.z = parseFloat(this.zString);
        this.heading = parseFloat((_x = parts[LineEvent0x03_fields.heading]) !== null && _x !== void 0 ? _x : '');
        repo.updateCombatant(this.id, {
            name: this.name,
            spawn: this.timestamp,
            despawn: this.timestamp,
            job: this.jobIdHex,
        });
        let combatantName = this.name;
        if (this.worldName !== '')
            combatantName = combatantName + '(' + this.worldName + ')';
        this.convertedLine = this.prefix() + this.id.toUpperCase() +
            ':Added new combatant ' + combatantName +
            '.  Job: ' + this.job +
            ' Level: ' + this.levelString +
            ' Max HP: ' + this.maxHpString +
            ' Max MP: ' + this.maxMpString +
            ' Pos: (' + this.xString + ',' + this.yString + ',' + this.zString + ')';
        // This last part is guesswork for the area between 9 and 10.
        const unknownValue = this.npcNameId +
            EmulatorCommon_EmulatorCommon.zeroPad(this.npcBaseId, 8 + Math.max(0, 6 - this.npcNameId.length));
        if (unknownValue !== '00000000000000')
            this.convertedLine += ' (' + unknownValue + ')';
        this.convertedLine += '.';
    }
}
class LineEvent03 extends LineEvent0x03 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x04.ts

// Removed combatant event
// Extend the add combatant event to reduce duplicate code since they're
// the same from a data perspective
class LineEvent0x04 extends LineEvent0x03 {
    constructor(repo, line, parts) {
        super(repo, line, parts);
        this.convertedLine = this.prefix() + this.id.toUpperCase() +
            ':Removing combatant ' + this.name +
            '. Max MP: ' + this.maxMpString +
            '. Pos: (' + this.xString + ',' + this.yString + ',' + this.zString + ')';
    }
}
class LineEvent04 extends LineEvent0x04 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x0C.ts

const LineEvent0x0C_fields = {
    class: 2,
    strength: 3,
    dexterity: 4,
    vitality: 5,
    intelligence: 6,
    mind: 7,
    piety: 8,
    attackPower: 9,
    directHit: 10,
    criticalHit: 11,
    attackMagicPotency: 12,
    healMagicPotency: 13,
    determination: 14,
    skillSpeed: 15,
    spellSpeed: 16,
    tenacity: 18,
};
// Player stats event
class LineEvent0x0C extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        super(repo, line, parts);
        this.class = (_a = parts[LineEvent0x0C_fields.class]) !== null && _a !== void 0 ? _a : '';
        this.strength = (_b = parts[LineEvent0x0C_fields.strength]) !== null && _b !== void 0 ? _b : '';
        this.dexterity = (_c = parts[LineEvent0x0C_fields.dexterity]) !== null && _c !== void 0 ? _c : '';
        this.vitality = (_d = parts[LineEvent0x0C_fields.vitality]) !== null && _d !== void 0 ? _d : '';
        this.intelligence = (_e = parts[LineEvent0x0C_fields.intelligence]) !== null && _e !== void 0 ? _e : '';
        this.mind = (_f = parts[LineEvent0x0C_fields.mind]) !== null && _f !== void 0 ? _f : '';
        this.piety = (_g = parts[LineEvent0x0C_fields.piety]) !== null && _g !== void 0 ? _g : '';
        this.attackPower = (_h = parts[LineEvent0x0C_fields.attackPower]) !== null && _h !== void 0 ? _h : '';
        this.directHit = (_j = parts[LineEvent0x0C_fields.directHit]) !== null && _j !== void 0 ? _j : '';
        this.criticalHit = (_k = parts[LineEvent0x0C_fields.criticalHit]) !== null && _k !== void 0 ? _k : '';
        this.attackMagicPotency = (_l = parts[LineEvent0x0C_fields.attackMagicPotency]) !== null && _l !== void 0 ? _l : '';
        this.healMagicPotency = (_m = parts[LineEvent0x0C_fields.healMagicPotency]) !== null && _m !== void 0 ? _m : '';
        this.determination = (_o = parts[LineEvent0x0C_fields.determination]) !== null && _o !== void 0 ? _o : '';
        this.skillSpeed = (_p = parts[LineEvent0x0C_fields.skillSpeed]) !== null && _p !== void 0 ? _p : '';
        this.spellSpeed = (_q = parts[LineEvent0x0C_fields.spellSpeed]) !== null && _q !== void 0 ? _q : '';
        this.tenacity = (_r = parts[LineEvent0x0C_fields.tenacity]) !== null && _r !== void 0 ? _r : '';
        this.convertedLine = this.prefix() +
            'Player Stats: ' + parts.slice(2, parts.length - 1).join(':').replace(/\|/g, ':');
    }
}
class LineEvent12 extends LineEvent0x0C {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x14.ts


const LineEvent0x14_fields = {
    id: 2,
    name: 3,
    abilityId: 4,
    abilityName: 5,
    targetId: 6,
    targetName: 7,
    duration: 8,
};
// Ability use event
class LineEvent0x14 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        super(repo, line, parts);
        this.isSource = true;
        this.isTarget = true;
        this.isAbility = true;
        this.id = (_b = (_a = parts[LineEvent0x14_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x14_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.abilityIdHex = (_e = (_d = parts[LineEvent0x14_fields.abilityId]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '';
        this.abilityId = parseInt(this.abilityIdHex);
        this.abilityName = (_f = parts[LineEvent0x14_fields.abilityName]) !== null && _f !== void 0 ? _f : '';
        this.targetId = (_h = (_g = parts[LineEvent0x14_fields.targetId]) === null || _g === void 0 ? void 0 : _g.toUpperCase()) !== null && _h !== void 0 ? _h : '';
        this.targetName = (_j = parts[LineEvent0x14_fields.targetName]) !== null && _j !== void 0 ? _j : '';
        this.duration = (_k = parts[LineEvent0x14_fields.duration]) !== null && _k !== void 0 ? _k : '';
        repo.updateCombatant(this.id, {
            job: undefined,
            name: this.name,
            spawn: this.timestamp,
            despawn: this.timestamp,
        });
        repo.updateCombatant(this.targetId, {
            job: undefined,
            name: this.targetName,
            spawn: this.timestamp,
            despawn: this.timestamp,
        });
        const target = this.targetName.length === 0 ? 'Unknown' : this.targetName;
        this.convertedLine = this.prefix() + this.abilityIdHex +
            ':' + this.name +
            ' starts using ' + this.abilityName +
            ' on ' + target + '.';
        this.properCaseConvertedLine = this.prefix() + this.abilityIdHex +
            ':' + EmulatorCommon_EmulatorCommon.properCase(this.name) +
            ' starts using ' + this.abilityName +
            ' on ' + EmulatorCommon_EmulatorCommon.properCase(target) + '.';
    }
}
class LineEvent20 extends LineEvent0x14 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x15.ts

const LineEvent0x15_fields = {
    id: 2,
    name: 3,
    flags: 8,
    damage: 9,
    abilityId: 4,
    abilityName: 5,
    targetId: 6,
    targetName: 7,
    targetHp: 24,
    targetMaxHp: 25,
    targetMp: 26,
    targetMaxMp: 27,
    targetX: 30,
    targetY: 31,
    targetZ: 32,
    targetHeading: 33,
    sourceHp: 34,
    sourceMaxHp: 35,
    sourceMp: 36,
    sourceMaxMp: 37,
    x: 40,
    y: 41,
    z: 42,
    heading: 43,
};
// Ability hit single target event
class LineEvent0x15 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        super(repo, line, parts);
        this.isSource = true;
        this.isTarget = true;
        this.isAbility = true;
        this.id = (_b = (_a = parts[LineEvent0x15_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x15_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.flags = (_d = parts[LineEvent0x15_fields.flags]) !== null && _d !== void 0 ? _d : '';
        const fieldOffset = this.flags === '3F' ? 2 : 0;
        this.damage = LineEvent.calculateDamage((_e = parts[LineEvent0x15_fields.damage + fieldOffset]) !== null && _e !== void 0 ? _e : '');
        this.abilityId = parseInt((_g = (_f = parts[LineEvent0x15_fields.abilityId]) === null || _f === void 0 ? void 0 : _f.toUpperCase()) !== null && _g !== void 0 ? _g : '');
        this.abilityName = (_h = parts[LineEvent0x15_fields.abilityName]) !== null && _h !== void 0 ? _h : '';
        this.targetId = (_k = (_j = parts[LineEvent0x15_fields.targetId]) === null || _j === void 0 ? void 0 : _j.toUpperCase()) !== null && _k !== void 0 ? _k : '';
        this.targetName = (_l = parts[LineEvent0x15_fields.targetName]) !== null && _l !== void 0 ? _l : '';
        this.targetHp = parseInt((_m = parts[LineEvent0x15_fields.targetHp + fieldOffset]) !== null && _m !== void 0 ? _m : '');
        this.targetMaxHp = parseInt((_o = parts[LineEvent0x15_fields.targetMaxHp + fieldOffset]) !== null && _o !== void 0 ? _o : '');
        this.targetMp = parseInt((_p = parts[LineEvent0x15_fields.targetMp + fieldOffset]) !== null && _p !== void 0 ? _p : '');
        this.targetMaxMp = parseInt((_q = parts[LineEvent0x15_fields.targetMaxMp + fieldOffset]) !== null && _q !== void 0 ? _q : '');
        this.targetX = parseFloat((_r = parts[LineEvent0x15_fields.targetX + fieldOffset]) !== null && _r !== void 0 ? _r : '');
        this.targetY = parseFloat((_s = parts[LineEvent0x15_fields.targetY + fieldOffset]) !== null && _s !== void 0 ? _s : '');
        this.targetZ = parseFloat((_t = parts[LineEvent0x15_fields.targetZ + fieldOffset]) !== null && _t !== void 0 ? _t : '');
        this.targetHeading = parseFloat((_u = parts[LineEvent0x15_fields.targetHeading + fieldOffset]) !== null && _u !== void 0 ? _u : '');
        this.hp = parseInt((_v = parts[LineEvent0x15_fields.sourceHp + fieldOffset]) !== null && _v !== void 0 ? _v : '');
        this.maxHp = parseInt((_w = parts[LineEvent0x15_fields.sourceMaxHp + fieldOffset]) !== null && _w !== void 0 ? _w : '');
        this.mp = parseInt((_x = parts[LineEvent0x15_fields.sourceMp + fieldOffset]) !== null && _x !== void 0 ? _x : '');
        this.maxMp = parseInt((_y = parts[LineEvent0x15_fields.sourceMaxMp + fieldOffset]) !== null && _y !== void 0 ? _y : '');
        this.x = parseFloat((_z = parts[LineEvent0x15_fields.x + fieldOffset]) !== null && _z !== void 0 ? _z : '');
        this.y = parseFloat((_0 = parts[LineEvent0x15_fields.y + fieldOffset]) !== null && _0 !== void 0 ? _0 : '');
        this.z = parseFloat((_1 = parts[LineEvent0x15_fields.z + fieldOffset]) !== null && _1 !== void 0 ? _1 : '');
        this.heading = parseFloat((_2 = parts[LineEvent0x15_fields.heading + fieldOffset]) !== null && _2 !== void 0 ? _2 : '');
        repo.updateCombatant(this.id, {
            job: undefined,
            name: this.name,
            spawn: this.timestamp,
            despawn: this.timestamp,
        });
        repo.updateCombatant(this.targetId, {
            job: undefined,
            name: this.targetName,
            spawn: this.timestamp,
            despawn: this.timestamp,
        });
    }
}
class LineEvent21 extends LineEvent0x15 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x16.ts

// Ability hit multiple/no target event
// Duplicate of 0x15 as far as data
class LineEvent0x16 extends LineEvent0x15 {
    constructor(repo, line, parts) {
        super(repo, line, parts);
    }
}
class LineEvent22 extends LineEvent0x16 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x17.ts

const LineEvent0x17_fields = {
    id: 2,
    name: 3,
    abilityId: 4,
    abilityName: 5,
    reason: 6,
};
// Cancel ability event
class LineEvent0x17 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g;
        super(repo, line, parts);
        this.isSource = true;
        this.isAbility = true;
        this.id = (_b = (_a = parts[LineEvent0x17_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x17_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.abilityId = parseInt((_e = (_d = parts[LineEvent0x17_fields.abilityId]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '');
        this.abilityName = (_f = parts[LineEvent0x17_fields.abilityName]) !== null && _f !== void 0 ? _f : '';
        this.reason = (_g = parts[LineEvent0x17_fields.reason]) !== null && _g !== void 0 ? _g : '';
    }
}
class LineEvent23 extends LineEvent0x17 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x18.ts


const LineEvent0x18_fields = {
    id: 2,
    name: 3,
    type: 4,
    effectId: 5,
    damage: 6,
    currentHp: 7,
    maxHp: 8,
    currentMp: 9,
    maxMp: 10,
    currentTp: 11,
    maxTp: 12,
    x: 13,
    y: 14,
    z: 15,
    heading: 16,
};
// DoT/HoT event
class LineEvent0x18 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        super(repo, line, parts);
        this.isSource = true;
        this.id = (_b = (_a = parts[LineEvent0x18_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x18_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.type = (_d = parts[LineEvent0x18_fields.type]) !== null && _d !== void 0 ? _d : '';
        this.effectId = (_f = (_e = parts[LineEvent0x18_fields.effectId]) === null || _e === void 0 ? void 0 : _e.toUpperCase()) !== null && _f !== void 0 ? _f : '';
        this.damage = parseInt((_g = parts[LineEvent0x18_fields.damage]) !== null && _g !== void 0 ? _g : '', 16);
        this.hp = parseInt((_h = parts[LineEvent0x18_fields.currentHp]) !== null && _h !== void 0 ? _h : '');
        this.maxHp = parseInt((_j = parts[LineEvent0x18_fields.maxHp]) !== null && _j !== void 0 ? _j : '');
        this.mp = parseInt((_k = parts[LineEvent0x18_fields.currentMp]) !== null && _k !== void 0 ? _k : '');
        this.maxMp = parseInt((_l = parts[LineEvent0x18_fields.maxMp]) !== null && _l !== void 0 ? _l : '');
        this.tp = parseInt((_m = parts[LineEvent0x18_fields.currentTp]) !== null && _m !== void 0 ? _m : '');
        this.maxTp = parseInt((_o = parts[LineEvent0x18_fields.maxTp]) !== null && _o !== void 0 ? _o : '');
        this.x = parseFloat((_p = parts[LineEvent0x18_fields.x]) !== null && _p !== void 0 ? _p : '');
        this.y = parseFloat((_q = parts[LineEvent0x18_fields.y]) !== null && _q !== void 0 ? _q : '');
        this.z = parseFloat((_r = parts[LineEvent0x18_fields.z]) !== null && _r !== void 0 ? _r : '');
        this.heading = parseFloat((_s = parts[LineEvent0x18_fields.heading]) !== null && _s !== void 0 ? _s : '');
        repo.updateCombatant(this.id, {
            job: undefined,
            name: this.name,
            spawn: this.timestamp,
            despawn: this.timestamp,
        });
        let effectName = '';
        const resolvedName = repo.resolveName(this.id, this.name);
        if (this.effectId in LineEvent0x18.showEffectNamesFor)
            effectName = (_t = LineEvent0x18.showEffectNamesFor[this.effectId]) !== null && _t !== void 0 ? _t : '';
        let effectPart = '';
        if (effectName)
            effectPart = effectName + ' ';
        this.convertedLine = this.prefix() + effectPart + this.type +
            ' Tick on ' + resolvedName +
            ' for ' + this.damage.toString() + ' damage.';
        this.properCaseConvertedLine = this.prefix() + effectPart + this.type +
            ' Tick on ' + EmulatorCommon_EmulatorCommon.properCase(resolvedName) +
            ' for ' + this.damage.toString() + ' damage.';
    }
}
LineEvent0x18.showEffectNamesFor = {
    '4C4': 'Excognition',
    '35D': 'Wildfire',
    '1F5': 'Doton',
    '2ED': 'Salted Earth',
    '4B5': 'Flamethrower',
    '2E3': 'Asylum',
    '777': 'Asylum',
    '798': 'Sacred Soil',
    '4C7': 'Fey Union',
    '742': 'Nascent Glint',
};
class LineEvent24 extends LineEvent0x18 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x19.ts


const LineEvent0x19_fields = {
    id: 2,
    name: 3,
    targetId: 4,
    targetName: 5,
};
// Combatant defeated event
class LineEvent0x19 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f;
        super(repo, line, parts);
        this.id = (_b = (_a = parts[LineEvent0x19_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x19_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.targetId = (_e = (_d = parts[LineEvent0x19_fields.targetId]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '';
        this.targetName = (_f = parts[LineEvent0x19_fields.targetName]) !== null && _f !== void 0 ? _f : '';
        repo.updateCombatant(this.id, {
            job: undefined,
            name: this.name,
            spawn: this.timestamp,
            despawn: this.timestamp,
        });
        repo.updateCombatant(this.targetId, {
            job: undefined,
            name: this.targetName,
            spawn: this.timestamp,
            despawn: this.timestamp,
        });
        let resolvedName = undefined;
        let resolvedTargetName = undefined;
        if (this.id !== '00')
            resolvedName = repo.resolveName(this.id, this.name);
        if (this.targetId !== '00')
            resolvedTargetName = repo.resolveName(this.targetId, this.targetName);
        const defeatedName = (resolvedName !== null && resolvedName !== void 0 ? resolvedName : this.name);
        const killerName = (resolvedTargetName !== null && resolvedTargetName !== void 0 ? resolvedTargetName : this.targetName);
        this.convertedLine = this.prefix() + defeatedName +
            ' was defeated by ' + killerName + '.';
        this.properCaseConvertedLine = this.prefix() + EmulatorCommon_EmulatorCommon.properCase(defeatedName) +
            ' was defeated by ' + EmulatorCommon_EmulatorCommon.properCase(killerName) + '.';
    }
}
class LineEvent25 extends LineEvent0x19 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1A.ts


const LineEvent0x1A_fields = {
    abilityId: 2,
    abilityName: 3,
    durationString: 4,
    id: 5,
    name: 6,
    targetId: 7,
    targetName: 8,
    stacks: 9,
    targetHp: 10,
    sourceHp: 11,
};
// Gain status effect event
// Deliberately don't flag this as LineEventSource or LineEventTarget
// because 0x1A line values aren't accurate
class LineEvent0x1A extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        super(repo, line, parts);
        this.isAbility = true;
        this.abilityId = parseInt((_b = (_a = parts[LineEvent0x1A_fields.abilityId]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '');
        this.abilityName = (_c = parts[LineEvent0x1A_fields.abilityName]) !== null && _c !== void 0 ? _c : '';
        this.durationString = (_d = parts[LineEvent0x1A_fields.durationString]) !== null && _d !== void 0 ? _d : '';
        this.durationFloat = parseFloat(this.durationString);
        this.id = (_f = (_e = parts[LineEvent0x1A_fields.id]) === null || _e === void 0 ? void 0 : _e.toUpperCase()) !== null && _f !== void 0 ? _f : '';
        this.name = (_g = parts[LineEvent0x1A_fields.name]) !== null && _g !== void 0 ? _g : '';
        this.targetId = (_j = (_h = parts[LineEvent0x1A_fields.targetId]) === null || _h === void 0 ? void 0 : _h.toUpperCase()) !== null && _j !== void 0 ? _j : '';
        this.targetName = (_k = parts[LineEvent0x1A_fields.targetName]) !== null && _k !== void 0 ? _k : '';
        this.stacks = parseInt((_l = parts[LineEvent0x1A_fields.stacks]) !== null && _l !== void 0 ? _l : '0');
        this.targetHp = parseInt((_m = parts[LineEvent0x1A_fields.targetHp]) !== null && _m !== void 0 ? _m : '');
        this.hp = parseInt((_o = parts[LineEvent0x1A_fields.sourceHp]) !== null && _o !== void 0 ? _o : '');
        repo.updateCombatant(this.id, {
            name: this.name,
            spawn: this.timestamp,
            despawn: this.timestamp,
            job: undefined,
        });
        repo.updateCombatant(this.targetId, {
            name: this.targetName,
            spawn: this.timestamp,
            despawn: this.timestamp,
            job: undefined,
        });
        this.resolvedName = repo.resolveName(this.id, this.name);
        this.resolvedTargetName = repo.resolveName(this.targetId, this.targetName);
        this.fallbackResolvedTargetName =
            repo.resolveName(this.id, this.name, this.targetId, this.targetName);
        let stackCountText = '';
        if (this.stacks > 0 && this.stacks < 20 &&
            LineEvent0x1A.showStackCountFor.includes(this.abilityId))
            stackCountText = ' (' + this.stacks.toString() + ')';
        this.convertedLine = this.prefix() + this.targetId +
            ':' + this.targetName +
            ' gains the effect of ' + this.abilityName +
            ' from ' + this.fallbackResolvedTargetName +
            ' for ' + this.durationString + ' Seconds.' + stackCountText;
        this.properCaseConvertedLine = this.prefix() + this.targetId +
            ':' + EmulatorCommon_EmulatorCommon.properCase(this.targetName) +
            ' gains the effect of ' + this.abilityName +
            ' from ' + EmulatorCommon_EmulatorCommon.properCase(this.fallbackResolvedTargetName) +
            ' for ' + this.durationString + ' Seconds.' + stackCountText;
    }
}
LineEvent0x1A.showStackCountFor = [
    304,
    406,
    350,
    714,
    505,
    1239,
    1297,
];
class LineEvent26 extends LineEvent0x1A {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1B.ts

const LineEvent0x1B_fields = {
    targetId: 2,
    targetName: 3,
    headmarkerId: 6,
};
// Head marker event
class LineEvent0x1B extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d;
        super(repo, line, parts);
        this.isSource = true;
        this.id = (_b = (_a = parts[LineEvent0x1B_fields.targetId]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x1B_fields.targetName]) !== null && _c !== void 0 ? _c : '';
        this.headmarkerId = (_d = parts[LineEvent0x1B_fields.headmarkerId]) !== null && _d !== void 0 ? _d : '';
    }
}
class LineEvent27 extends LineEvent0x1B {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1C.ts

const LineEvent0x1C_fields = {
    operation: 2,
    waymark: 3,
    id: 4,
    name: 5,
    x: 6,
    y: 7,
    z: 8,
};
// Floor waymarker event
class LineEvent0x1C extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        super(repo, line, parts);
        this.operation = (_a = parts[LineEvent0x1C_fields.operation]) !== null && _a !== void 0 ? _a : '';
        this.waymark = (_b = parts[LineEvent0x1C_fields.waymark]) !== null && _b !== void 0 ? _b : '';
        this.id = (_d = (_c = parts[LineEvent0x1C_fields.id]) === null || _c === void 0 ? void 0 : _c.toUpperCase()) !== null && _d !== void 0 ? _d : '';
        this.name = (_e = parts[LineEvent0x1C_fields.name]) !== null && _e !== void 0 ? _e : '';
        this.x = (_f = parts[LineEvent0x1C_fields.x]) !== null && _f !== void 0 ? _f : '';
        this.y = (_g = parts[LineEvent0x1C_fields.y]) !== null && _g !== void 0 ? _g : '';
        this.z = (_h = parts[LineEvent0x1C_fields.z]) !== null && _h !== void 0 ? _h : '';
    }
}
class LineEvent28 extends LineEvent0x1C {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1D.ts

const LineEvent0x1D_fields = {
    operation: 2,
    waymark: 3,
    id: 4,
    name: 5,
    targetId: 6,
    targetName: 7,
};
// Waymarker
class LineEvent0x1D extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        super(repo, line, parts);
        this.operation = (_a = parts[LineEvent0x1D_fields.operation]) !== null && _a !== void 0 ? _a : '';
        this.waymark = (_b = parts[LineEvent0x1D_fields.waymark]) !== null && _b !== void 0 ? _b : '';
        this.id = (_d = (_c = parts[LineEvent0x1D_fields.id]) === null || _c === void 0 ? void 0 : _c.toUpperCase()) !== null && _d !== void 0 ? _d : '';
        this.name = (_e = parts[LineEvent0x1D_fields.name]) !== null && _e !== void 0 ? _e : '';
        this.targetId = (_g = (_f = parts[LineEvent0x1D_fields.targetId]) === null || _f === void 0 ? void 0 : _f.toUpperCase()) !== null && _g !== void 0 ? _g : '';
        this.targetName = (_h = parts[LineEvent0x1D_fields.targetName]) !== null && _h !== void 0 ? _h : '';
    }
}
class LineEvent29 extends LineEvent0x1D {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1E.ts


// Lose status effect event
// Extend the gain status event to reduce duplicate code since they're
// the same from a data perspective
class LineEvent0x1E extends LineEvent0x1A {
    constructor(repo, line, parts) {
        super(repo, line, parts);
        let stackCountText = '';
        if (this.stacks > 0 && this.stacks < 20 &&
            LineEvent0x1A.showStackCountFor.includes(this.abilityId))
            stackCountText = ' (' + this.stacks.toString() + ')';
        this.convertedLine = this.prefix() + this.targetId +
            ':' + this.targetName +
            ' loses the effect of ' + this.abilityName +
            ' from ' + this.fallbackResolvedTargetName +
            ' for ' + this.durationString + ' Seconds.' + stackCountText;
        this.properCaseConvertedLine = this.prefix() + this.targetId +
            ':' + EmulatorCommon_EmulatorCommon.properCase(this.targetName) +
            ' loses the effect of ' + this.abilityName +
            ' from ' + EmulatorCommon_EmulatorCommon.properCase(this.fallbackResolvedTargetName) +
            ' for ' + this.durationString + ' Seconds.' + stackCountText;
    }
}
class LineEvent30 extends LineEvent0x1E {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1F.ts


const splitFunc = (s) => [
    s.substr(6, 2),
    s.substr(4, 2),
    s.substr(2, 2),
    s.substr(0, 2),
];
const LineEvent0x1F_fields = {
    id: 2,
    dataBytes1: 3,
    dataBytes2: 4,
    dataBytes3: 5,
    dataBytes4: 6,
};
// Job gauge event
class LineEvent0x1F extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        super(repo, line, parts);
        this.id = (_b = (_a = parts[LineEvent0x1F_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.dataBytes1 = EmulatorCommon_EmulatorCommon.zeroPad((_c = parts[LineEvent0x1F_fields.dataBytes1]) !== null && _c !== void 0 ? _c : '');
        this.dataBytes2 = EmulatorCommon_EmulatorCommon.zeroPad((_d = parts[LineEvent0x1F_fields.dataBytes2]) !== null && _d !== void 0 ? _d : '');
        this.dataBytes3 = EmulatorCommon_EmulatorCommon.zeroPad((_e = parts[LineEvent0x1F_fields.dataBytes3]) !== null && _e !== void 0 ? _e : '');
        this.dataBytes4 = EmulatorCommon_EmulatorCommon.zeroPad((_f = parts[LineEvent0x1F_fields.dataBytes4]) !== null && _f !== void 0 ? _f : '');
        this.jobGaugeBytes = [
            ...splitFunc(this.dataBytes1),
            ...splitFunc(this.dataBytes2),
            ...splitFunc(this.dataBytes3),
            ...splitFunc(this.dataBytes4),
        ];
        this.name = ((_g = repo.Combatants[this.id]) === null || _g === void 0 ? void 0 : _g.name) || '';
        repo.updateCombatant(this.id, {
            name: (_h = repo.Combatants[this.id]) === null || _h === void 0 ? void 0 : _h.name,
            spawn: this.timestamp,
            despawn: this.timestamp,
            job: (_j = this.jobGaugeBytes[0]) === null || _j === void 0 ? void 0 : _j.toUpperCase(),
        });
        this.convertedLine = this.prefix() +
            this.id + ':' + this.name +
            ':' + this.dataBytes1 +
            ':' + this.dataBytes2 +
            ':' + this.dataBytes3 +
            ':' + this.dataBytes4;
        this.properCaseConvertedLine = this.prefix() +
            this.id + ':' + (EmulatorCommon_EmulatorCommon.properCase(this.name)) +
            ':' + this.dataBytes1 +
            ':' + this.dataBytes2 +
            ':' + this.dataBytes3 +
            ':' + this.dataBytes4;
    }
}
class LineEvent31 extends LineEvent0x1F {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x22.ts

const LineEvent0x22_fields = {
    id: 2,
    name: 3,
    targetId: 4,
    targetName: 5,
    targetable: 6,
};
// Nameplate toggle
class LineEvent0x22 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g;
        super(repo, line, parts);
        this.isSource = true;
        this.id = (_b = (_a = parts[LineEvent0x22_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x22_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.targetId = (_e = (_d = parts[LineEvent0x22_fields.targetId]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '';
        this.targetName = (_f = parts[LineEvent0x22_fields.targetName]) !== null && _f !== void 0 ? _f : '';
        this.targetable = !!parseInt((_g = parts[LineEvent0x22_fields.targetable]) !== null && _g !== void 0 ? _g : '', 16);
    }
}
class LineEvent34 extends LineEvent0x22 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x23.ts

const LineEvent0x23_fields = {
    id: 2,
    name: 3,
    targetId: 4,
    targetName: 5,
    tetherId: 8,
};
// Tether event
class LineEvent0x23 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g;
        super(repo, line, parts);
        this.id = (_b = (_a = parts[LineEvent0x23_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x23_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.targetId = (_e = (_d = parts[LineEvent0x23_fields.targetId]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '';
        this.targetName = (_f = parts[LineEvent0x23_fields.targetName]) !== null && _f !== void 0 ? _f : '';
        this.tetherId = (_g = parts[LineEvent0x23_fields.tetherId]) !== null && _g !== void 0 ? _g : '';
    }
}
class LineEvent35 extends LineEvent0x23 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x24.ts

const LineEvent0x24_fields = {
    valueHex: 2,
    bars: 3,
};
// Limit gauge event
class LineEvent0x24 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b;
        super(repo, line, parts);
        this.valueHex = (_a = parts[LineEvent0x24_fields.valueHex]) !== null && _a !== void 0 ? _a : '';
        this.valueDec = parseInt(this.valueHex, 16);
        this.bars = (_b = parts[LineEvent0x24_fields.bars]) !== null && _b !== void 0 ? _b : '';
        this.convertedLine = this.prefix() + 'Limit Break: ' + this.valueHex;
    }
}
class LineEvent36 extends LineEvent0x24 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x25.ts

const LineEvent0x25_fields = {
    id: 2,
    name: 3,
    sequenceId: 4,
    currentHp: 5,
    maxHp: 6,
    currentMp: 7,
    maxMp: 8,
    currentTp: 9,
    maxTp: 10,
    x: 11,
    y: 12,
    z: 13,
    heading: 14,
};
// Action sync event
class LineEvent0x25 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        super(repo, line, parts);
        this.isSource = true;
        this.id = (_b = (_a = parts[LineEvent0x25_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x25_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.sequenceId = (_d = parts[LineEvent0x25_fields.sequenceId]) !== null && _d !== void 0 ? _d : '';
        this.hp = parseInt((_e = parts[LineEvent0x25_fields.currentHp]) !== null && _e !== void 0 ? _e : '');
        this.maxHp = parseInt((_f = parts[LineEvent0x25_fields.maxHp]) !== null && _f !== void 0 ? _f : '');
        this.mp = parseInt((_g = parts[LineEvent0x25_fields.currentMp]) !== null && _g !== void 0 ? _g : '');
        this.maxMp = parseInt((_h = parts[LineEvent0x25_fields.maxMp]) !== null && _h !== void 0 ? _h : '');
        this.tp = parseInt((_j = parts[LineEvent0x25_fields.currentTp]) !== null && _j !== void 0 ? _j : '');
        this.maxTp = parseInt((_k = parts[LineEvent0x25_fields.maxTp]) !== null && _k !== void 0 ? _k : '');
        this.x = parseFloat((_l = parts[LineEvent0x25_fields.x]) !== null && _l !== void 0 ? _l : '');
        this.y = parseFloat((_m = parts[LineEvent0x25_fields.y]) !== null && _m !== void 0 ? _m : '');
        this.z = parseFloat((_o = parts[LineEvent0x25_fields.z]) !== null && _o !== void 0 ? _o : '');
        this.heading = parseFloat((_p = parts[LineEvent0x25_fields.heading]) !== null && _p !== void 0 ? _p : '');
    }
}
class LineEvent37 extends LineEvent0x25 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x26.ts



const LineEvent0x26_fields = {
    id: 2,
    name: 3,
    jobLevelData: 4,
    currentHp: 5,
    maxHp: 6,
    currentMp: 7,
    maxMp: 8,
    currentTp: 9,
    maxTp: 10,
    x: 11,
    y: 12,
    z: 13,
    heading: 14,
};
// Network status effect event
class LineEvent0x26 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        super(repo, line, parts);
        this.isSource = true;
        this.isJobLevel = true;
        this.id = (_b = (_a = parts[LineEvent0x26_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x26_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.jobLevelData = (_d = parts[LineEvent0x26_fields.jobLevelData]) !== null && _d !== void 0 ? _d : '';
        this.hp = parseInt((_e = parts[LineEvent0x26_fields.currentHp]) !== null && _e !== void 0 ? _e : '');
        this.maxHp = parseInt((_f = parts[LineEvent0x26_fields.maxHp]) !== null && _f !== void 0 ? _f : '');
        this.mp = parseInt((_g = parts[LineEvent0x26_fields.currentMp]) !== null && _g !== void 0 ? _g : '');
        this.maxMp = parseInt((_h = parts[LineEvent0x26_fields.maxMp]) !== null && _h !== void 0 ? _h : '');
        this.tp = parseInt((_j = parts[LineEvent0x26_fields.currentTp]) !== null && _j !== void 0 ? _j : '');
        this.maxTp = parseInt((_k = parts[LineEvent0x26_fields.maxTp]) !== null && _k !== void 0 ? _k : '');
        this.x = parseFloat((_l = parts[LineEvent0x26_fields.x]) !== null && _l !== void 0 ? _l : '');
        this.y = parseFloat((_m = parts[LineEvent0x26_fields.y]) !== null && _m !== void 0 ? _m : '');
        this.z = parseFloat((_o = parts[LineEvent0x26_fields.z]) !== null && _o !== void 0 ? _o : '');
        this.heading = parseFloat((_p = parts[LineEvent0x26_fields.heading]) !== null && _p !== void 0 ? _p : '');
        const padded = EmulatorCommon_EmulatorCommon.zeroPad(this.jobLevelData, 8);
        this.jobIdHex = padded.substr(6, 2).toUpperCase();
        this.jobId = parseInt(this.jobIdHex, 16);
        this.job = util/* default.jobEnumToJob */.Z.jobEnumToJob(this.jobId);
        this.level = parseInt(padded.substr(4, 2), 16);
    }
}
class LineEvent38 extends LineEvent0x26 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x27.ts

const LineEvent0x27_fields = {
    id: 2,
    name: 3,
    currentHp: 4,
    maxHp: 5,
    currentMp: 6,
    maxMp: 7,
    currentTp: 8,
    maxTp: 9,
    x: 10,
    y: 11,
    z: 12,
    heading: 13,
};
// Network update hp event
class LineEvent0x27 extends LineEvent {
    constructor(repo, line, parts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        super(repo, line, parts);
        this.isSource = true;
        this.id = (_b = (_a = parts[LineEvent0x27_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = parts[LineEvent0x27_fields.name]) !== null && _c !== void 0 ? _c : '';
        this.hp = parseInt((_d = parts[LineEvent0x27_fields.currentHp]) !== null && _d !== void 0 ? _d : '');
        this.maxHp = parseInt((_e = parts[LineEvent0x27_fields.maxHp]) !== null && _e !== void 0 ? _e : '');
        this.mp = parseInt((_f = parts[LineEvent0x27_fields.currentMp]) !== null && _f !== void 0 ? _f : '');
        this.maxMp = parseInt((_g = parts[LineEvent0x27_fields.maxMp]) !== null && _g !== void 0 ? _g : '');
        this.tp = parseInt((_h = parts[LineEvent0x27_fields.currentTp]) !== null && _h !== void 0 ? _h : '');
        this.maxTp = parseInt((_j = parts[LineEvent0x27_fields.maxTp]) !== null && _j !== void 0 ? _j : '');
        this.x = parseFloat((_k = parts[LineEvent0x27_fields.x]) !== null && _k !== void 0 ? _k : '');
        this.y = parseFloat((_l = parts[LineEvent0x27_fields.y]) !== null && _l !== void 0 ? _l : '');
        this.z = parseFloat((_m = parts[LineEvent0x27_fields.z]) !== null && _m !== void 0 ? _m : '');
        this.heading = parseFloat((_o = parts[LineEvent0x27_fields.heading]) !== null && _o !== void 0 ? _o : '');
    }
}
class LineEvent39 extends LineEvent0x27 {
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/ParseLine.ts

























class ParseLine {
    static parse(repo, line) {
        let ret;
        const parts = line.split('|');
        const event = parts[0];
        // Don't parse raw network packet lines
        if (!event || event === '252')
            return;
        // This is ugly, but Webpack prefers being explicit
        switch ('LineEvent' + event) {
            case 'LineEvent00':
                ret = new LineEvent00(repo, line, parts);
                break;
            case 'LineEvent01':
                ret = new LineEvent01(repo, line, parts);
                break;
            case 'LineEvent02':
                ret = new LineEvent02(repo, line, parts);
                break;
            case 'LineEvent03':
                ret = new LineEvent03(repo, line, parts);
                break;
            case 'LineEvent04':
                ret = new LineEvent04(repo, line, parts);
                break;
            case 'LineEvent12':
                ret = new LineEvent12(repo, line, parts);
                break;
            case 'LineEvent20':
                ret = new LineEvent20(repo, line, parts);
                break;
            case 'LineEvent21':
                ret = new LineEvent21(repo, line, parts);
                break;
            case 'LineEvent22':
                ret = new LineEvent22(repo, line, parts);
                break;
            case 'LineEvent23':
                ret = new LineEvent23(repo, line, parts);
                break;
            case 'LineEvent24':
                ret = new LineEvent24(repo, line, parts);
                break;
            case 'LineEvent25':
                ret = new LineEvent25(repo, line, parts);
                break;
            case 'LineEvent26':
                ret = new LineEvent26(repo, line, parts);
                break;
            case 'LineEvent27':
                ret = new LineEvent27(repo, line, parts);
                break;
            case 'LineEvent28':
                ret = new LineEvent28(repo, line, parts);
                break;
            case 'LineEvent29':
                ret = new LineEvent29(repo, line, parts);
                break;
            case 'LineEvent30':
                ret = new LineEvent30(repo, line, parts);
                break;
            case 'LineEvent31':
                ret = new LineEvent31(repo, line, parts);
                break;
            case 'LineEvent34':
                ret = new LineEvent34(repo, line, parts);
                break;
            case 'LineEvent35':
                ret = new LineEvent35(repo, line, parts);
                break;
            case 'LineEvent36':
                ret = new LineEvent36(repo, line, parts);
                break;
            case 'LineEvent37':
                ret = new LineEvent37(repo, line, parts);
                break;
            case 'LineEvent38':
                ret = new LineEvent38(repo, line, parts);
                break;
            case 'LineEvent39':
                ret = new LineEvent39(repo, line, parts);
                break;
            default:
                ret = new LineEvent(repo, line, parts);
        }
        // Also don't parse lines with a non-sane date. This is 2000-01-01 00:00:00
        if (ret && ret.timestamp < 946684800)
            return;
        // Finally, if the object marks itself as invalid, skip it
        if (ret && ret.invalid)
            return;
        return ret;
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/NetworkLogConverter.ts



const isLineEvent = (line) => {
    return !!line;
};
class NetworkLogConverter extends EventBus_EventBus {
    convertFile(data) {
        const repo = new LogRepository();
        return this.convertLines(
        // Split data into an array of separate lines, removing any blank lines.
        data.split(NetworkLogConverter.lineSplitRegex).filter((l) => l !== ''), repo);
    }
    convertLines(lines, repo) {
        let lineEvents = lines.map((l) => ParseLine.parse(repo, l)).filter(isLineEvent);
        // Call `convert` to convert the network line to non-network format and update indexing values
        lineEvents = lineEvents.map((l, i) => {
            l.index = i;
            return l;
        });
        // Sort the lines based on `${timestamp}_${index}` to handle out-of-order lines properly
        // @TODO: Remove this once underlying CombatantTracker update issues are resolved
        return lineEvents.sort((l, r) => (`${l.timestamp}_${l.index}`).localeCompare(`${r.timestamp}_${r.index}`));
    }
}
NetworkLogConverter.lineSplitRegex = /\r?\n/gm;

;// CONCATENATED MODULE: ./resources/languages.ts
const languages = ['en', 'de', 'fr', 'ja', 'cn', 'ko'];
const isLang = (lang) => {
    const langStrs = languages;
    if (!lang)
        return false;
    return langStrs.includes(lang);
};

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/Encounter.ts








const isPetName = (name, language) => {
    if (language)
        return pet_names[language].includes(name);
    for (const lang in pet_names) {
        if (!isLang(lang))
            throw new not_reached/* UnreachableCode */.$();
        if (pet_names[lang].includes(name))
            return true;
    }
    return false;
};
const isValidTimestamp = (timestamp) => {
    return timestamp > 0 && timestamp < Number.MAX_SAFE_INTEGER;
};
class Encounter {
    constructor(encounterDay, encounterZoneId, encounterZoneName, logLines) {
        this.encounterDay = encounterDay;
        this.encounterZoneId = encounterZoneId;
        this.encounterZoneName = encounterZoneName;
        this.logLines = logLines;
        this.initialOffset = Number.MAX_SAFE_INTEGER;
        this.endStatus = 'Unknown';
        this.startStatus = 'Unknown';
        this.engageAt = Number.MAX_SAFE_INTEGER;
        this.firstPlayerAbility = Number.MAX_SAFE_INTEGER;
        this.firstEnemyAbility = Number.MAX_SAFE_INTEGER;
        this.firstLineIndex = 0;
        this.startTimestamp = 0;
        this.endTimestamp = 0;
        this.duration = 0;
        this.playbackOffset = 0;
        this.language = 'en';
        this.version = Encounter.encounterVersion;
    }
    initialize() {
        const startStatuses = new Set();
        this.logLines.forEach((line, i) => {
            var _a, _b, _c, _d;
            if (!line)
                throw new not_reached/* UnreachableCode */.$();
            let res = EmulatorCommon_EmulatorCommon.matchStart(line.networkLine);
            if (res) {
                this.firstLineIndex = i;
                if ((_a = res.groups) === null || _a === void 0 ? void 0 : _a.StartType)
                    startStatuses.add(res.groups.StartType);
                if ((_b = res.groups) === null || _b === void 0 ? void 0 : _b.StartIn) {
                    const startIn = parseInt(res.groups.StartIn);
                    if (startIn >= 0)
                        this.engageAt = Math.min(line.timestamp + startIn, this.engageAt);
                }
            }
            else {
                res = EmulatorCommon_EmulatorCommon.matchEnd(line.networkLine);
                if (res) {
                    if ((_c = res.groups) === null || _c === void 0 ? void 0 : _c.EndType)
                        this.endStatus = res.groups.EndType;
                }
                else if (isLineEventSource(line) && isLineEventTarget(line)) {
                    if (line.id.startsWith('1') ||
                        (line.id.startsWith('4') && isPetName(line.name, this.language))) {
                        // Player or pet ability
                        if (line.targetId.startsWith('4') && !isPetName(line.targetName, this.language)) {
                            // Targetting non player or pet
                            this.firstPlayerAbility = Math.min(this.firstPlayerAbility, line.timestamp);
                        }
                    }
                    else if (line.id.startsWith('4') && !isPetName(line.name, this.language)) {
                        // Non-player ability
                        if (line.targetId.startsWith('1') || isPetName(line.targetName, this.language)) {
                            // Targetting player or pet
                            this.firstEnemyAbility = Math.min(this.firstEnemyAbility, line.timestamp);
                        }
                    }
                }
            }
            const matchedLang = (_d = res === null || res === void 0 ? void 0 : res.groups) === null || _d === void 0 ? void 0 : _d.language;
            if (isLang(matchedLang))
                this.language = matchedLang;
        });
        this.combatantTracker = new CombatantTracker(this.logLines, this.language);
        this.startTimestamp = this.combatantTracker.firstTimestamp;
        this.endTimestamp = this.combatantTracker.lastTimestamp;
        this.duration = this.endTimestamp - this.startTimestamp;
        if (this.initialOffset === Number.MAX_SAFE_INTEGER) {
            if (this.engageAt < Number.MAX_SAFE_INTEGER)
                this.initialOffset = this.engageAt - this.startTimestamp;
            else if (this.firstPlayerAbility < Number.MAX_SAFE_INTEGER)
                this.initialOffset = this.firstPlayerAbility - this.startTimestamp;
            else if (this.firstEnemyAbility < Number.MAX_SAFE_INTEGER)
                this.initialOffset = this.firstEnemyAbility - this.startTimestamp;
            else
                this.initialOffset = 0;
        }
        const firstLine = this.logLines[this.firstLineIndex];
        if (firstLine && firstLine.offset)
            this.playbackOffset = firstLine.offset;
        this.startStatus = [...startStatuses].sort().join(', ');
    }
    get initialTimestamp() {
        return this.startTimestamp + this.initialOffset;
    }
    shouldPersistFight() {
        return isValidTimestamp(this.firstPlayerAbility) && isValidTimestamp(this.firstEnemyAbility);
    }
    upgrade(version) {
        if (Encounter.encounterVersion <= version)
            return false;
        const repo = new LogRepository();
        const converter = new NetworkLogConverter();
        this.logLines = converter.convertLines(this.logLines.map((l) => l.networkLine), repo);
        this.version = Encounter.encounterVersion;
        this.initialize();
        return true;
    }
}
Encounter.encounterVersion = 1;

;// CONCATENATED MODULE: ./ui/raidboss/emulator/ui/EncounterTab.js


class EncounterTab extends EventBus_EventBus {
  constructor(persistor) {
    super();
    this.persistor = persistor;
    this.$zoneColumn = document.querySelector('#encountersTab .zoneList');
    this.$dateColumn = document.querySelector('#encountersTab .dateList');
    this.$encounterColumn = document.querySelector('#encountersTab .encounterList');
    this.$infoColumn = document.querySelector('#encountersTab .encounterInfo');
    this.$encounterTabRowTemplate = document.querySelector('template.encounterTabRow').content.firstElementChild;
    this.$encounterTabEncounterRowTemplate = document.querySelector('template.encounterTabEncounterRow').content.firstElementChild;
    this.$encounterInfoTemplate = document.querySelector('template.encounterInfo').content.firstElementChild;
  }

  refresh() {
    this.encounters = {};
    this.persistor.listEncounters().then(encounters => {
      for (const i in encounters) {
        const enc = encounters[i];
        const zone = enc.zoneName;
        const encDate = EmulatorCommon_EmulatorCommon.timeToDateString(enc.start);
        const encTime = EmulatorCommon_EmulatorCommon.timeToTimeString(enc.start);
        const encDuration = EmulatorCommon_EmulatorCommon.msToDuration(enc.duration);
        this.encounters[zone] = this.encounters[zone] || {};
        this.encounters[zone][encDate] = this.encounters[zone][encDate] || [];
        this.encounters[zone][encDate].push({
          start: encTime,
          name: enc.name,
          duration: encDuration,
          encounter: enc
        });
      }

      this.refreshUI();
    });
  }

  refreshUI() {
    this.refreshZones();
    this.refreshDates();
    this.refreshEncounters();
    this.refreshInfo();
  }

  refreshZones() {
    this.$zoneColumn.innerHTML = '';
    let clear = true;
    const zones = new Set(Object.keys(this.encounters));

    for (const zone of [...zones].sort()) {
      const $row = this.$encounterTabRowTemplate.cloneNode(true);
      $row.innerText = zone;

      if (zone === this.currentZone) {
        clear = false;
        $row.classList.add('selected');
      }

      $row.addEventListener('click', ev => {
        const t = ev.currentTarget;
        t.parentElement.querySelectorAll('.selectorRow.selected').forEach(n => {
          n.classList.remove('selected');
        });
        t.classList.add('selected');
        this.currentZone = t.textContent;
        this.refreshUI();
      });
      this.$zoneColumn.append($row);
    }

    if (clear) this.currentZone = undefined;
  }

  refreshDates() {
    this.$dateColumn.innerHTML = '';
    let clear = true;

    if (this.currentZone !== undefined) {
      const dates = new Set(Object.keys(this.encounters[this.currentZone]));

      for (const date of [...dates].sort()) {
        const $row = this.$encounterTabRowTemplate.cloneNode(true);
        $row.innerText = date;

        if (date === this.currentDate) {
          clear = false;
          $row.classList.add('selected');
        }

        $row.addEventListener('click', ev => {
          const t = ev.currentTarget;
          t.parentElement.querySelectorAll('.selectorRow.selected').forEach(n => {
            n.classList.remove('selected');
          });
          t.classList.add('selected');
          this.currentDate = t.textContent;
          this.refreshUI();
        });
        this.$dateColumn.append($row);
      }
    }

    if (clear) this.currentDate = undefined;
  }

  refreshEncounters() {
    this.$encounterColumn.innerHTML = '';
    let clear = true;

    if (this.currentZone !== undefined && this.currentDate !== undefined) {
      const sortedEncounters = this.encounters[this.currentZone][this.currentDate].sort((l, r) => {
        return l.start.localeCompare(r.start);
      });

      for (const i in sortedEncounters) {
        const enc = this.encounters[this.currentZone][this.currentDate][i];
        const $row = this.$encounterTabEncounterRowTemplate.cloneNode(true);
        $row.setAttribute('data-index', i);

        if (i === this.currentEncounter) {
          clear = false;
          $row.classList.add('selected');
        }

        $row.querySelector('.encounterStart').innerText = '[' + enc.start + ']';
        $row.querySelector('.encounterName').innerText = enc.name;
        $row.querySelector('.encounterDuration').innerText = '(' + enc.duration + ')';
        $row.addEventListener('click', ev => {
          const t = ev.currentTarget;
          t.parentElement.querySelectorAll('.selectorRow.selected').forEach(n => {
            n.classList.remove('selected');
          });
          t.classList.add('selected');
          this.currentEncounter = t.getAttribute('data-index');
          this.refreshUI();
        });
        this.$encounterColumn.append($row);
      }
    }

    if (clear) this.currentEncounter = undefined;
  }

  refreshInfo() {
    this.$infoColumn.innerHTML = '';

    if (this.currentZone !== undefined && this.currentDate !== undefined && this.currentEncounter !== undefined) {
      /**
       * @type PersistorEncounter
       */
      const enc = this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter;
      let pullAt = 'N/A';
      if (!isNaN(enc.offset)) pullAt = EmulatorCommon_EmulatorCommon.timeToString(enc.offset, false);
      const $info = this.$encounterInfoTemplate.cloneNode(true);
      $info.querySelector('.encounterLoad').addEventListener('click', () => {
        this.dispatch('load', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
      });
      $info.querySelector('.encounterParse').addEventListener('click', () => {
        this.dispatch('parse', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
      });
      $info.querySelector('.encounterPrune').addEventListener('click', () => {
        this.dispatch('prune', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
      });
      $info.querySelector('.encounterDelete').addEventListener('click', () => {
        this.dispatch('delete', this.encounters[this.currentZone][this.currentDate][this.currentEncounter].encounter.id);
      });
      $info.querySelector('.encounterZone .label').textContent = enc.zoneName;
      $info.querySelector('.encounterStart .label').textContent = EmulatorCommon_EmulatorCommon.dateTimeToString(enc.start);
      $info.querySelector('.encounterDuration .label').textContent = EmulatorCommon_EmulatorCommon.timeToString(enc.duration, false);
      $info.querySelector('.encounterOffset .label').textContent = pullAt;
      $info.querySelector('.encounterName .label').textContent = enc.name;
      $info.querySelector('.encounterStartStatus .label').textContent = enc.startStatus;
      $info.querySelector('.encounterEndStatus .label').textContent = enc.endStatus;
      this.$infoColumn.append($info);
    }
  }

}
;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/LogEventHandler.ts



class LogEventHandler extends (/* unused pure expression or super */ null && (EventBus)) {
    constructor() {
        super(...arguments);
        this.currentFight = [];
        this.currentZoneName = 'Unknown';
        this.currentZoneId = '-1';
    }
    parseLogs(logs) {
        for (const lineObj of logs) {
            this.currentFight.push(lineObj);
            lineObj.offset = lineObj.timestamp - this.currentFightStart;
            const res = EmulatorCommon.matchEnd(lineObj.networkLine);
            if (res) {
                this.endFight();
            }
            else if (lineObj instanceof LineEvent0x01) {
                this.currentZoneId = lineObj.zoneId;
                this.currentZoneName = lineObj.zoneName;
                this.endFight();
            }
        }
    }
    get currentFightStart() {
        var _a, _b;
        return (_b = (_a = this.currentFight[0]) === null || _a === void 0 ? void 0 : _a.timestamp) !== null && _b !== void 0 ? _b : 0;
    }
    get currentFightEnd() {
        var _a, _b;
        return (_b = (_a = this.currentFight.slice(-1)[0]) === null || _a === void 0 ? void 0 : _a.timestamp) !== null && _b !== void 0 ? _b : 0;
    }
    endFight() {
        if (this.currentFight.length < 2)
            return;
        const start = new Date(this.currentFightStart).toISOString();
        const end = new Date(this.currentFightEnd).toISOString();
        console.debug(`Dispatching new fight
Start: ${start}
End: ${end}
Zone: ${this.currentZoneName}
Line Count: ${this.currentFight.length}
`);
        void this.dispatch('fight', start.substr(0, 10), this.currentZoneId, this.currentZoneName, this.currentFight);
        this.currentFight = [];
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/PersistorEncounter.js
class PersistorEncounter {
  constructor(encounter) {
    this.id = encounter.id;
    this.name = encounter.combatantTracker.getMainCombatantName();
    this.start = encounter.startTimestamp;
    this.offset = encounter.initialOffset;
    this.startStatus = encounter.startStatus;
    this.endStatus = encounter.endStatus;
    this.zoneId = encounter.encounterZoneId;
    this.zoneName = encounter.encounterZoneName;
    this.duration = encounter.endTimestamp - encounter.startTimestamp;
  }

}
;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/Persistor.js




class Persistor extends EventBus_EventBus {
  constructor() {
    super();
    this.DB = null;
    this.initializeDB();
  }

  initializeDB() {
    const request = window.indexedDB.open('RaidEmulatorEncounters', Persistor.dbVersion);
    request.addEventListener('success', ev => {
      this.DB = ev.target.result;
      this.dispatch('ready');
    });
    request.addEventListener('upgradeneeded', ev => {
      const promises = [];
      let encountersStorage;
      let encounterSummariesStorage; // We deliberately avoid using breaks for this switch/case to allow
      // incremental upgrades to apply in sequence

      switch (ev.oldVersion) {
        case 0:
          encountersStorage = ev.target.result.createObjectStore('Encounters', {
            keyPath: 'id',
            autoIncrement: true
          });
          encounterSummariesStorage = ev.target.result.createObjectStore('EncounterSummaries', {
            keyPath: 'id',
            autoIncrement: true
          });
          encounterSummariesStorage.createIndex('zoneName', 'zoneName');
          encounterSummariesStorage.createIndex('start', 'start');
          encounterSummariesStorage.createIndex('zoneName_start', ['zoneName', 'start']);
      }

      promises.push(new Promise(res => {
        encountersStorage.transaction.addEventListener('complete', tev => {
          res();
        });
      }));
      promises.push(new Promise(res => {
        encounterSummariesStorage.transaction.addEventListener('complete', tev => {
          res();
        });
      }));
      let completed = 0;

      for (const i in promises) {
        promises[i].then(() => {
          ++completed;

          if (completed === promises.length) {
            this.DB = ev.target.result;
            this.dispatch('ready');
          }
        });
      }
    });
  }

  persistEncounter(baseEncounter) {
    let ret;

    if (this.DB !== null) {
      let resolver;
      ret = new Promise(res => {
        resolver = res;
      });
      const encounter = EmulatorCommon_EmulatorCommon.cloneData(baseEncounter, []);
      delete encounter.combatantTracker;
      const encountersStorage = this.encountersStorage;
      let req;

      if (encounter.id === null) {
        delete encounter.id;
        req = encountersStorage.add(encounter);
      } else {
        req = encountersStorage.put(encounter);
      }

      req.addEventListener('success', ev => {
        baseEncounter.id = encounter.id = ev.target.result;
        const encounterSummariesStorage = this.encounterSummariesStorage;
        const summary = new PersistorEncounter(baseEncounter);
        const req2 = encounterSummariesStorage.put(summary);
        req2.addEventListener('success', ev => {
          resolver();
        });
      });
    } else {
      ret = new Promise(r => r());
    }

    return ret;
  }

  loadEncounter(id) {
    return new Promise(res => {
      if (this.DB !== null) {
        const encountersStorage = this.encountersStorage;
        const req = encountersStorage.get(id);
        req.addEventListener('success', ev => {
          const enc = req.result;
          const ret = new Encounter(enc.encounterDay, enc.encounterZoneId, enc.encounterZoneName, enc.logLines);
          ret.id = enc.id; // Check for encounter upgrade, re-save encounter if it's upgraded.

          if (ret.upgrade(enc.version)) {
            this.persistEncounter(ret).then(() => {
              res(ret);
            });
          } else {
            ret.initialize();
            res(ret);
          }
        });
      } else {
        res(null);
      }
    });
  }

  deleteEncounter(id) {
    return new Promise(res => {
      if (this.DB !== null) {
        const encountersStorage = this.encountersStorage;
        const req = encountersStorage.delete(id);
        req.addEventListener('success', ev => {
          const encounterSummariesStorage = this.encounterSummariesStorage;
          const req = encounterSummariesStorage.delete(id);
          req.addEventListener('success', ev => {
            res(true);
          });
          req.addEventListener('error', ev => {
            res(false);
          });
        });
        req.addEventListener('error', ev => {
          res(false);
        });
      } else {
        res(null);
      }
    });
  }

  listEncounters(zoneName = null, startTimestamp = null, endTimestamp = null) {
    return new Promise(res => {
      if (this.DB !== null) {
        const encounterSummariesStorage = this.encounterSummariesStorage;
        let keyRange = null;
        let index = null;

        if (zoneName !== null) {
          if (startTimestamp !== null) {
            index = encounterSummariesStorage.index('zoneName_start');

            if (endTimestamp !== null) {
              keyRange = IDBKeyRange.bound([zoneName, startTimestamp], [zoneName, endTimestamp], [true, true], [true, true]);
            } else {
              keyRange = IDBKeyRange.lowerBound([zoneName, startTimestamp], [true, true]);
            }
          } else {
            index = encounterSummariesStorage.index('zoneName');
            keyRange = IDBKeyRange.only(zoneName);
          }
        } else if (startTimestamp !== null) {
          index = encounterSummariesStorage.index('start');
          if (endTimestamp !== null) keyRange = IDBKeyRange.bound(startTimestamp, endTimestamp, true, true);else keyRange = IDBKeyRange.lowerBound(startTimestamp, true);
        }

        let req;
        if (keyRange !== null) req = index.getAll(keyRange);else req = encounterSummariesStorage.getAll();
        req.addEventListener('success', ev => {
          res(req.result);
        });
      } else {
        res([]);
      }
    });
  }

  async clearDB() {
    let p1Res;
    const p1 = new Promise(res => {
      p1Res = res;
    });
    let p2Res;
    const p2 = new Promise(res => {
      p2Res = res;
    });
    this.encountersStorage.clear().addEventListener('success', () => {
      p1Res();
    });
    this.encounterSummariesStorage.clear().addEventListener('success', () => {
      p2Res();
    });
    await p1;
    await p2;
  }

  async exportDB() {
    const ret = {
      encounters: []
    };
    const summaries = await this.listEncounters();

    for (const summary of summaries) {
      const enc = await this.loadEncounter(summary.id);
      ret.encounters.push({
        encounterDay: EmulatorCommon_EmulatorCommon.timeToDateString(summary.Start),
        encounterZoneName: summary.ZoneName,
        encounterZoneId: summary.ZoneId,
        encounterLines: enc.logLines
      });
    }

    return ret;
  }

  async importDB(DB) {
    DB.encounters.forEach(enc => {
      this.persistEncounter(new Encounter(enc.encounterDay, enc.encounterZoneId, enc.encounterZoneName, enc.encounterLines));
    });
  }

  get encountersStorage() {
    return this.DB.transaction('Encounters', 'readwrite').objectStore('Encounters');
  }

  get encounterSummariesStorage() {
    return this.DB.transaction('EncounterSummaries', 'readwrite').objectStore('EncounterSummaries');
  }

}
Persistor.dbVersion = 3;
// EXTERNAL MODULE: ./resources/overlay_plugin_api.ts
var overlay_plugin_api = __webpack_require__(906);
;// CONCATENATED MODULE: ./ui/raidboss/autoplay_helper.ts
class AutoplayHelper {
    static Check() {
        const context = new AudioContext();
        return context.state === 'suspended';
    }
    static Prompt() {
        const button = document.createElement('button');
        button.innerText = 'Click to enable audio';
        button.classList.add('autoplay-helper-button');
        button.onclick = function () {
            button.remove();
        };
        document.body.appendChild(button);
    }
    static CheckAndPrompt() {
        if (AutoplayHelper.Check())
            AutoplayHelper.Prompt();
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/browser_tts_engine.ts
class TTSItem {
    constructor(text, lang, voice) {
        this.text = text;
        this.item = new SpeechSynthesisUtterance(text);
        if (lang)
            this.item.lang = lang;
        if (voice)
            this.item.voice = voice;
    }
    play() {
        window.speechSynthesis.speak(this.item);
    }
}
class BrowserTTSEngine {
    constructor(lang) {
        this.ttsItems = {};
        const cactbotLangToSpeechLang = {
            en: 'en-US',
            de: 'de-DE',
            fr: 'fr-FR',
            ja: 'ja-JP',
            // TODO: maybe need to provide an option of zh-CN, zh-HK, zh-TW?
            cn: 'zh-CN',
            ko: 'ko-KR',
        };
        // figure out what TTS engine type we need
        if (window.speechSynthesis !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => {
                const speechLang = cactbotLangToSpeechLang[lang];
                const voice = window.speechSynthesis.getVoices().find((voice) => voice.lang === speechLang);
                if (voice) {
                    this.speechLang = speechLang;
                    this.speechVoice = voice;
                    window.speechSynthesis.onvoiceschanged = null;
                }
                else {
                    console.error('BrowserTTS error: could not find voice');
                }
            };
        }
        else {
            console.error('BrowserTTS error: no browser support for window.speechSynthesis');
        }
    }
    play(text) {
        if (!this.speechVoice)
            return;
        try {
            let ttsItem = this.ttsItems[text];
            if (!ttsItem) {
                ttsItem = new TTSItem(text, this.speechLang, this.speechVoice);
                this.ttsItems[text] = ttsItem;
            }
            ttsItem.play();
        }
        catch (e) {
            console.error('Exception performing TTS', e);
        }
    }
}

;// CONCATENATED MODULE: ./resources/player_override.ts


// @TODO: Swap the order of these arguments, make playerName optional instead
const addPlayerChangedOverrideListener = (func, playerName) => {
    if (!func)
        return;
    let lastPlayerChangedEvent = null;
    let lastPlayerJob = null;
    const onPlayerChanged = (e) => {
        if (playerName) {
            e.detail.name = playerName;
            if (lastPlayerJob) {
                // Use the non-overridden job if we don't know an overridden one.
                e.detail.job = lastPlayerJob;
            }
        }
        lastPlayerChangedEvent = e;
        func(e);
    };
    (0,overlay_plugin_api/* addOverlayListener */.PS)('onPlayerChangedEvent', onPlayerChanged);
    if (!playerName)
        return;
    (0,overlay_plugin_api/* addOverlayListener */.PS)('PartyChanged', (e) => {
        const player = e.party.find((p) => p.name === playerName);
        if (!player)
            return;
        const newJob = util/* default.jobEnumToJob */.Z.jobEnumToJob(player.job);
        if (newJob === lastPlayerJob)
            return;
        lastPlayerJob = newJob;
        // This event may come before the first onPlayerChangedEvent.
        if (lastPlayerChangedEvent)
            onPlayerChanged(lastPlayerChangedEvent);
    });
};
// Common UI for selecting a player.
// Only used for raidboss, but could ostensibly be reused for oopsy,
// if there's ever player specific stuff.
// TODO: it would be nice to show the "connected / not connected" bit in the UI.
const addRemotePlayerSelectUI = (lang) => {
    const instructionTextByLang = {
        en: 'Select a Player\n(the list will update when in an instance)',
        de: 'Wähle einen Spieler\n(Diese Liste aktualisiert sich, sobald eine Instance betretten wird)',
        fr: 'Sélectionner un joueur\n (la liste se mettra à jour dans une instance)',
        ja: 'プレーヤー名を選択してください\n(インスタンスに入るとリストが更新する)',
        cn: '请选择玩家名称\n(此列表将会在进入副本后更新)',
        ko: '플레이어를 선택하세요\n(인스턴스에 있으면 리스트가 업데이트됩니다.)',
    };
    const forceTTSByLang = {
        en: 'Force Enable Text To Speech',
        de: 'Erzwinge Text in Sprache (TTS)',
        fr: 'Forcer l\'activation de la synthèse vocale (TTS)',
        ja: 'TTSを強制的に有効化する',
        cn: '强制启用TTS',
        ko: 'TTS 기능을 활성화하기',
    };
    const buttonTextByLang = {
        en: 'Start Overlay',
        de: 'Start Overlay',
        fr: 'Démarrer l\'Overlay',
        ja: 'オーバーレイを起動',
        cn: '启用悬浮窗',
        ko: '오버레이 시작',
    };
    const defaultTextByLang = {
        en: '(no override)',
        de: '(kein überschreiben)',
        fr: '(pas de dérogation)',
        ja: '(既定値)',
        cn: '(默认值)',
        ko: '(플레이어 지정 안함)',
    };
    // TODO: probably should save forceTTS as well, maybe save some {} options?
    const kStorageKey = 'cactbot-last-selected-player';
    const savePlayerName = (name) => {
        window.localStorage.setItem(kStorageKey, name);
    };
    const loadPlayerName = () => {
        return window.localStorage.getItem(kStorageKey);
    };
    // Add common UI to select a player.
    const container = document.createElement('div');
    container.id = 'player-select';
    document.body.appendChild(container);
    const instructionElem = document.createElement('div');
    instructionElem.id = 'player-select-instructions';
    instructionElem.innerHTML = instructionTextByLang[lang] || instructionTextByLang['en'];
    container.appendChild(instructionElem);
    const listElem = document.createElement('div');
    listElem.id = 'player-select-list';
    container.appendChild(listElem);
    const ttsElem = document.createElement('input');
    ttsElem.type = 'checkbox';
    ttsElem.id = 'player-select-tts';
    ttsElem.name = 'player-select-tts';
    container.appendChild(ttsElem);
    const ttsLabel = document.createElement('label');
    ttsLabel.id = 'player-select-tts-label';
    ttsLabel.htmlFor = 'player-select-tts';
    ttsLabel.innerHTML = forceTTSByLang[lang] || forceTTSByLang['en'];
    container.appendChild(ttsLabel);
    const buttonElem = document.createElement('button');
    buttonElem.id = 'player-select-button';
    buttonElem.name = 'player-select-button';
    buttonElem.innerHTML = buttonTextByLang[lang] || buttonTextByLang['en'];
    container.appendChild(buttonElem);
    buttonElem.addEventListener('click', () => {
        const forceTTS = ttsElem.checked;
        let playerName = '';
        let radioIndex = 0;
        for (;;) {
            radioIndex++;
            const elem = document.getElementById(`player-radio-${radioIndex}`);
            if (!elem || !(elem instanceof HTMLInputElement))
                break;
            if (!elem.checked)
                continue;
            playerName = elem.value;
            break;
        }
        if (playerName)
            savePlayerName(playerName);
        // Preserve existing parameters.
        const currentParams = new URLSearchParams(window.location.search);
        const paramMap = {};
        // Yes, this is (v, k) and not (k, v).
        currentParams.forEach((v, k) => paramMap[k] = decodeURIComponent(v));
        paramMap.player = playerName;
        // Use 1/0 to be consistent with other query parameters rather than string true/false.
        paramMap.forceTTS = forceTTS ? 1 : 0;
        // TODO: overlay_plugin_api.js doesn't support uri encoded OVERLAY_WS parameters.
        // So this can't use URLSearchParams.toString yet.  Manually build string.
        let search = '?';
        for (const [k, v] of Object.entries(paramMap))
            search += `${k}=${v}&`;
        // Reload the page with more options.
        window.location.search = search;
    });
    const lastSelectedPlayer = loadPlayerName();
    const buildList = (party) => {
        while (listElem.firstChild) {
            if (listElem.lastChild)
                listElem.removeChild(listElem.lastChild);
        }
        let radioCount = 0;
        const addRadio = (name, value, extraClass) => {
            radioCount++;
            const inputName = `player-radio-${radioCount}`;
            const inputElem = document.createElement('input');
            inputElem.type = 'radio';
            inputElem.value = value;
            inputElem.id = inputName;
            inputElem.name = 'player-radio';
            inputElem.classList.add('player-radio', extraClass);
            listElem.appendChild(inputElem);
            const labelElem = document.createElement('label');
            labelElem.htmlFor = inputName;
            labelElem.innerHTML = name;
            listElem.appendChild(labelElem);
            return inputElem;
        };
        const defaultText = defaultTextByLang[lang] || defaultTextByLang['en'];
        const defaultElem = addRadio(defaultText, '', 'player-radio-default');
        defaultElem.checked = true;
        if (lastSelectedPlayer) {
            const last = addRadio(lastSelectedPlayer, lastSelectedPlayer, 'player-radio-last');
            last.checked = true;
        }
        const partyPlayers = party.filter((p) => p.inParty && p.name !== lastSelectedPlayer);
        const partyNames = partyPlayers.map((p) => p.name).sort();
        for (const name of partyNames)
            addRadio(name, name, 'player-radio-party');
        const alliancePlayers = party.filter((p) => !p.inParty && p.name !== lastSelectedPlayer);
        const allianceNames = alliancePlayers.map((p) => p.name).sort();
        for (const name of allianceNames)
            addRadio(name, name, 'player-radio-alliance');
    };
    addOverlayListener('PartyChanged', (e) => {
        buildList(e.party);
    });
    buildList([]);
};

// EXTERNAL MODULE: ./resources/zone_id.ts
var zone_id = __webpack_require__(438);
;// CONCATENATED MODULE: ./ui/raidboss/popup-text.ts









const isRaidbossLooseTimelineTrigger = (trigger) => {
    return 'isTimelineTrigger' in trigger;
};
const isNetRegexTrigger = (trigger) => {
    if (trigger && !isRaidbossLooseTimelineTrigger(trigger))
        return 'netRegex' in trigger;
    return false;
};
const isRegexTrigger = (trigger) => {
    if (trigger && !isRaidbossLooseTimelineTrigger(trigger))
        return 'regex' in trigger;
    return false;
};
// There should be (at most) six lines of instructions.
const raidbossInstructions = {
    en: [
        'Instructions as follows:',
        'This is debug text for resizing.',
        'It goes away when you lock the overlay',
        'along with the blue background.',
        'Timelines and triggers will show up in supported zones.',
        'Test raidboss with a /countdown in Summerford Farms.',
    ],
    de: [
        'Anweisungen wie folgt:',
        'Dies ist ein Debug-Text zur Größenänderung.',
        'Er verschwindet, wenn du das Overlay sperrst,',
        'zusammen mit dem blauen Hintergrund.',
        'Timeline und Trigger werden in den unterstützten Zonen angezeigt.',
        'Testen Sie Raidboss mit einem /countdown in Sommerfurt-Höfe.',
    ],
    fr: [
        'Instructions :',
        'Ceci est un texte de test pour redimensionner.',
        'Il disparaitra \(ainsi que le fond bleu\) quand',
        'l\'overlay sera bloqué.',
        'Les timelines et triggers seront affichés dans les zones supportées.',
        'Testez raidboss avec un /countdown aux Vergers d\'Estival',
    ],
    ja: [
        '操作手順：',
        'デバッグ用のテキストです。',
        '青色のオーバーレイを',
        'ロックすれば消える。',
        'サポートするゾーンにタイムラインとトリガーテキストが表示できる。',
        'サマーフォード庄に/countdownコマンドを実行し、raidbossをテストできる。',
    ],
    cn: [
        '请按以下步骤操作：',
        '这是供用户调整悬浮窗大小的调试用文本',
        '当你锁定此蓝色背景的悬浮窗',
        '该文本即会消失。',
        '在支持的区域中会自动加载时间轴和触发器。',
        '可在盛夏农庄使用/countdown命令测试该raidboss模块。',
    ],
    ko: [
        '<조작 설명>',
        '크기 조정을 위한 디버그 창입니다',
        '파란 배경과 이 텍스트는',
        '오버레이를 위치잠금하면 사라집니다',
        '지원되는 구역에서 타임라인과 트리거가 표시됩니다',
        '여름여울 농장에서 초읽기를 실행하여 테스트 해볼 수 있습니다',
    ],
};
// Because apparently people don't understand uppercase greek letters,
// add a special case to not uppercase them.
const triggerUpperCase = (str) => {
    return str.replace(/[^αβγδ]/g, (x) => x.toUpperCase());
};
// Disable no-explicit-any due to catch clauses requiring any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onTriggerException = (trigger, e) => {
    var _a, _b;
    // When a fight ends and there are open promises, from delaySeconds or promise itself,
    // all promises will be rejected.  In this case there is no error; simply return without logging.
    if (!e)
        return;
    let str = 'Error in trigger: ' + (trigger.id ? trigger.id : '[unknown trigger id]');
    if (trigger.filename)
        str += ' (' + trigger.filename + ')';
    console.error(str);
    if (e instanceof Error) {
        const lines = (_b = (_a = e.stack) === null || _a === void 0 ? void 0 : _a.split('\n')) !== null && _b !== void 0 ? _b : [];
        for (let i = 0; i < lines.length; ++i)
            console.error(lines[i]);
    }
};
const sounds = ['Alarm', 'Alert', 'Info', 'Long', 'Pull'];
const soundStrs = sounds;
const texts = (/* unused pure expression or super */ null && (['info', 'alert', 'alarm']));
const textMap = {
    info: {
        text: 'infoText',
        upperText: 'InfoText',
        upperSound: 'InfoSound',
        upperSoundVolume: 'InfoSoundVolume',
    },
    alert: {
        text: 'alertText',
        upperText: 'AlertText',
        upperSound: 'AlertSound',
        upperSoundVolume: 'AlertSoundVolume',
    },
    alarm: {
        text: 'alarmText',
        upperText: 'AlarmText',
        upperSound: 'AlarmSound',
        upperSoundVolume: 'AlarmSoundVolume',
    },
};
// Helper for handling trigger overrides.
//
// asList will return a list of triggers in the same order as append was called, except:
// If a later trigger has the same id as a previous trigger, it will replace the previous trigger
// and appear in the same order that the previous trigger appeared.
// e.g. a, b1, c, b2 (where b1 and b2 share the same id) yields [a, b2, c] as the final list.
//
// JavaScript dictionaries are *almost* ordered automatically as we would want,
// but want to handle missing ids and integer ids (you shouldn't, but just in case).
class OrderedTriggerList {
    constructor() {
        this.triggers = [];
        this.idToIndex = {};
    }
    push(trigger) {
        const idx = trigger.id ? this.idToIndex[trigger.id] : undefined;
        if (idx && trigger.id) {
            const oldTrigger = this.triggers[idx];
            if (oldTrigger === undefined)
                throw new not_reached/* UnreachableCode */.$();
            // TODO: be verbose now while this is fresh, but hide this output behind debug flags later.
            const triggerFile = (trigger) => trigger.filename ? `'${trigger.filename}'` : 'user override';
            const oldFile = triggerFile(oldTrigger);
            const newFile = triggerFile(trigger);
            console.log(`Overriding '${trigger.id}' from ${oldFile} with ${newFile}.`);
            this.triggers[idx] = trigger;
            return;
        }
        // Normal case of a new trigger, with no overriding.
        if (trigger.id)
            this.idToIndex[trigger.id] = this.triggers.length;
        this.triggers.push(trigger);
    }
    asList() {
        return this.triggers;
    }
}
const isObject = (x) => x instanceof Object;
class TriggerOutputProxy {
    constructor(trigger, displayLang, perTriggerAutoConfig) {
        var _a;
        this.trigger = trigger;
        this.displayLang = displayLang;
        this.perTriggerAutoConfig = perTriggerAutoConfig;
        this.overrideStrings = {};
        this.responseOutputStrings = {};
        this.unknownValue = '???';
        this.outputStrings = (_a = trigger.outputStrings) !== null && _a !== void 0 ? _a : {};
        if (trigger.id && perTriggerAutoConfig) {
            const config = perTriggerAutoConfig[trigger.id];
            if (config && config.OutputStrings)
                this.overrideStrings = config.OutputStrings;
        }
        return new Proxy(this, {
            // Response output string subtlety:
            // Take this example response:
            //
            //    response: (data, matches, output) => {
            //      return {
            //        alarmText: output.someAlarm(),
            //        outputStrings: { someAlarm: 'string' }, // <- impossible
            //      };
            //    },
            //
            // Because the object being returned is evaluated all at once, the object
            // cannot simultaneously define outputStrings and use those outputStrings.
            // So, instead, responses need to set `output.responseOutputStrings`.
            // HOWEVER, this also has its own issues!  This value is set for the trigger
            // (which may have multiple active in flight instances).  This *should* be
            // ok because we guarantee that response/alarmText/alertText/infoText/tts
            // are evaluated sequentially for a single trigger before any other trigger
            // instance evaluates that set of triggers.  Finally, for ease of automating
            // the config ui, the response should return the exact same set of
            // outputStrings every time.  Thank you for coming to my TED talk.
            set(target, property, value) {
                var _a;
                if (property === 'responseOutputStrings') {
                    if (isObject(value)) {
                        target[property] = value;
                        return true;
                    }
                    console.error(`Invalid responseOutputStrings on trigger ${(_a = target.trigger.id) !== null && _a !== void 0 ? _a : 'Unknown'}`);
                    return false;
                }
                // Be kind to user triggers that do weird things, and just console error this
                // instead of throwing an exception.
                console.error(`Invalid property '${String(property)}' on output.`);
                return false;
            },
            get(target, name) {
                // TODO: add a test that verifies nobody does this.
                if (name === 'toJSON' || typeof name !== 'string')
                    return '{}';
                // Because output.func() must exist at the time of trigger eval,
                // always provide a function even before we know which keys are valid.
                return (params) => {
                    var _a, _b;
                    const id = (_a = target.trigger.id) !== null && _a !== void 0 ? _a : 'Unknown Trigger';
                    // Priority: per-trigger config from ui > response > built-in trigger
                    // Ideally, response provides everything and trigger provides nothing,
                    // or there's no response and trigger provides everything.  Having
                    // this well-defined smooths out the collision edge cases.
                    let str = target.getReplacement(target.overrideStrings[name], params, name, id);
                    if (str === undefined) {
                        const responseString = target.responseOutputStrings[name];
                        if (isObject(responseString))
                            str = target.getReplacement(responseString, params, name, id);
                    }
                    if (str === undefined)
                        str = target.getReplacement(target.outputStrings[name], params, name, id);
                    if (str === undefined) {
                        console.error(`Trigger ${(_b = target.trigger.id) !== null && _b !== void 0 ? _b : ''} has missing outputString ${name}.`);
                        return target.unknownValue;
                    }
                    return str;
                };
            },
        });
    }
    getReplacement(
    // Can't use optional modifier for this arg since the others aren't optional
    template, params, name, id) {
        var _a;
        if (!template)
            return;
        let value;
        if (typeof template === 'string')
            // user config
            value = template;
        else
            value = (_a = template[this.displayLang]) !== null && _a !== void 0 ? _a : template['en'];
        if (typeof value !== 'string') {
            console.error(`Trigger ${id} has invalid outputString ${name}.`, JSON.stringify(template));
            return;
        }
        return value.replace(/\${\s*([^}\s]+)\s*}/g, (_fullMatch, key) => {
            if (params && key in params) {
                const str = params[key];
                if (typeof str !== 'string' && typeof str !== 'number') {
                    console.error(`Trigger ${id} has non-string param value ${key}.`);
                    return this.unknownValue;
                }
                return str;
            }
            console.error(`Trigger ${id} can't replace ${key} in ${JSON.stringify(template)}.`);
            return this.unknownValue;
        });
    }
    static makeOutput(trigger, displayLang, perTriggerAutoConfig) {
        // `Output` is the common type used for the trigger data interface to support arbitrary
        // string keys and always returns a string. However, TypeScript doesn't have good support
        // for the Proxy representing this structure so we need to cast Proxy => unknown => Output
        return new TriggerOutputProxy(trigger, displayLang, perTriggerAutoConfig);
    }
}
const defaultOutput = TriggerOutputProxy.makeOutput({}, 'en');
class PopupText {
    constructor(options, timelineLoader, raidbossDataFiles) {
        var _a, _b, _c, _d;
        this.options = options;
        this.timelineLoader = timelineLoader;
        this.raidbossDataFiles = raidbossDataFiles;
        this.triggers = [];
        this.netTriggers = [];
        this.timers = {};
        this.triggerSuppress = {};
        this.currentTriggerID = 0;
        this.inCombat = false;
        this.resetWhenOutOfCombat = true;
        this.partyTracker = new PartyTracker();
        this.kMaxRowsOfText = 2;
        this.me = '';
        this.job = 'NONE';
        this.role = 'none';
        this.triggerSets = [];
        this.zoneName = '';
        this.zoneId = -1;
        this.dataInitializers = [];
        this.options = options;
        this.timelineLoader = timelineLoader;
        this.ProcessDataFiles(raidbossDataFiles);
        this.infoText = document.getElementById('popup-text-info');
        this.alertText = document.getElementById('popup-text-alert');
        this.alarmText = document.getElementById('popup-text-alarm');
        this.parserLang = (_a = this.options.ParserLanguage) !== null && _a !== void 0 ? _a : 'en';
        this.displayLang = (_d = (_c = (_b = this.options.AlertsLanguage) !== null && _b !== void 0 ? _b : this.options.DisplayLanguage) !== null && _c !== void 0 ? _c : this.options.ParserLanguage) !== null && _d !== void 0 ? _d : 'en';
        if (this.options.IsRemoteRaidboss) {
            this.ttsEngine = new BrowserTTSEngine(this.displayLang);
            this.ttsSay = (text) => {
                var _a;
                (_a = this.ttsEngine) === null || _a === void 0 ? void 0 : _a.play(this.options.TransformTts(text));
            };
        }
        else {
            this.ttsSay = (text) => {
                void (0,overlay_plugin_api/* callOverlayHandler */.ae)({
                    call: 'cactbotSay',
                    text: this.options.TransformTts(text),
                });
            };
        }
        this.data = this.getDataObject();
        // check to see if we need user interaction to play audio
        // only if audio is enabled in options
        if (this.options.AudioAllowed)
            AutoplayHelper.CheckAndPrompt();
        this.Reset();
        this.AddDebugInstructions();
        this.HookOverlays();
    }
    AddDebugInstructions() {
        raidbossInstructions[this.displayLang].forEach((line, i) => {
            const elem = document.getElementById(`instructions-${i}`);
            if (!elem)
                return;
            elem.innerHTML = line;
        });
    }
    HookOverlays() {
        (0,overlay_plugin_api/* addOverlayListener */.PS)('PartyChanged', (e) => {
            this.partyTracker.onPartyChanged(e);
        });
        addPlayerChangedOverrideListener((e) => {
            this.OnPlayerChange(e);
        }, this.options.PlayerNameOverride);
        (0,overlay_plugin_api/* addOverlayListener */.PS)('ChangeZone', (e) => {
            this.OnChangeZone(e);
        });
        (0,overlay_plugin_api/* addOverlayListener */.PS)('onInCombatChangedEvent', (e) => {
            this.OnInCombatChange(e.detail.inGameCombat);
        });
        (0,overlay_plugin_api/* addOverlayListener */.PS)('onLogEvent', (e) => {
            this.OnLog(e);
        });
        (0,overlay_plugin_api/* addOverlayListener */.PS)('LogLine', (e) => {
            this.OnNetLog(e);
        });
    }
    OnPlayerChange(e) {
        if (this.job !== e.detail.job || this.me !== e.detail.name)
            this.OnJobChange(e);
        this.data.currentHP = e.detail.currentHP;
    }
    ProcessDataFiles(files) {
        this.triggerSets = [];
        for (const [filename, json] of Object.entries(files)) {
            if (!filename.endsWith('.js') && !filename.endsWith('.ts'))
                continue;
            if (typeof json !== 'object') {
                console.log('Unexpected JSON from ' + filename + ', expected an array');
                continue;
            }
            if (!json.triggers) {
                console.log('Unexpected JSON from ' + filename + ', expected a triggers');
                continue;
            }
            if (typeof json.triggers !== 'object' || !(json.triggers.length >= 0)) {
                console.log('Unexpected JSON from ' + filename + ', expected triggers to be an array');
                continue;
            }
            this.triggerSets.push({
                filename: filename,
                ...json,
            });
        }
        // User triggers must come last so that they override built-in files.
        Array.prototype.push.apply(this.triggerSets, this.options.Triggers);
    }
    OnChangeZone(e) {
        if (this.zoneName !== e.zoneName) {
            this.zoneName = e.zoneName;
            this.zoneId = e.zoneID;
            this.ReloadTimelines();
        }
    }
    ReloadTimelines() {
        var _a, _b, _c;
        if (!this.triggerSets || !this.me || !this.zoneName || !this.timelineLoader.IsReady())
            return;
        // Drop the triggers and timelines from the previous zone, so we can add new ones.
        this.triggers = [];
        this.netTriggers = [];
        let timelineFiles = [];
        let timelines = [];
        const replacements = [];
        const timelineStyles = [];
        this.resetWhenOutOfCombat = true;
        const orderedTriggers = new OrderedTriggerList();
        // Recursively/iteratively process timeline entries for triggers.
        // Functions get called with data, arrays get iterated, strings get appended.
        const addTimeline = (function (obj) {
            if (Array.isArray(obj)) {
                for (const objVal of obj)
                    addTimeline(objVal);
            }
            else if (typeof obj === 'function') {
                addTimeline(obj(this.data));
            }
            else if (obj) {
                timelines.push(obj);
            }
        }).bind(this);
        // construct something like regexDe or regexFr.
        const langSuffix = this.parserLang.charAt(0).toUpperCase() + this.parserLang.slice(1);
        const regexParserLang = 'regex' + langSuffix;
        const netRegexParserLang = 'netRegex' + langSuffix;
        for (const set of this.triggerSets) {
            // zoneRegex can be undefined, a regex, or translatable object of regex.
            const haveZoneRegex = 'zoneRegex' in set;
            const haveZoneId = 'zoneId' in set;
            if (!haveZoneRegex && !haveZoneId || haveZoneRegex && haveZoneId) {
                console.error(`Trigger set must include exactly one of zoneRegex or zoneId property`);
                continue;
            }
            if (haveZoneId && set.zoneId === undefined) {
                const filename = set.filename ? `'${set.filename}'` : '(user file)';
                console.error(`Trigger set has zoneId, but with nothing specified in ${filename}.  ` +
                    `Did you misspell the ZoneId.ZoneName?`);
                continue;
            }
            if (set.zoneId) {
                if (set.zoneId !== zone_id/* default.MatchAll */.Z.MatchAll && set.zoneId !== this.zoneId && !(typeof set.zoneId === 'object' && set.zoneId.includes(this.zoneId)))
                    continue;
            }
            else if (set.zoneRegex) {
                let zoneRegex = set.zoneRegex;
                if (typeof zoneRegex !== 'object') {
                    console.error('zoneRegex must be translatable object or regexp: ' + JSON.stringify(set.zoneRegex));
                    continue;
                }
                else if (!(zoneRegex instanceof RegExp)) {
                    const parserLangRegex = zoneRegex[this.parserLang];
                    if (parserLangRegex) {
                        zoneRegex = parserLangRegex;
                    }
                    else if (zoneRegex['en']) {
                        zoneRegex = zoneRegex['en'];
                    }
                    else {
                        console.error('unknown zoneRegex parser language: ' + JSON.stringify(set.zoneRegex));
                        continue;
                    }
                    if (!(zoneRegex instanceof RegExp)) {
                        console.error('zoneRegex must be regexp: ' + JSON.stringify(set.zoneRegex));
                        continue;
                    }
                }
                if (this.zoneName.search(resources_regexes/* default.parse */.Z.parse(zoneRegex)) < 0)
                    continue;
            }
            if (this.options.Debug) {
                if (set.filename)
                    console.log('Loading ' + set.filename);
                else
                    console.log('Loading user triggers for zone');
            }
            const setFilename = (_a = set.filename) !== null && _a !== void 0 ? _a : 'Unknown';
            if (set.initData) {
                this.dataInitializers.push({
                    file: setFilename,
                    func: set.initData,
                });
            }
            // Adjust triggers for the parser language.
            if (set.triggers && this.options.AlertsEnabled) {
                for (const trigger of set.triggers) {
                    // Add an additional resolved regex here to save
                    // time later.  This will clobber each time we
                    // load this, but that's ok.
                    trigger.filename = setFilename;
                    const id = trigger.id;
                    if (!isRegexTrigger(trigger) && !isNetRegexTrigger(trigger)) {
                        console.error(`Trigger ${id}: has no regex property specified`);
                        continue;
                    }
                    this.ProcessTrigger(trigger);
                    let found = false;
                    const triggerObject = trigger;
                    // parser-language-based regex takes precedence.
                    if (isRegexTrigger(trigger)) {
                        const regex = (_b = triggerObject[regexParserLang]) !== null && _b !== void 0 ? _b : trigger.regex;
                        if (regex instanceof RegExp) {
                            trigger.localRegex = resources_regexes/* default.parse */.Z.parse(regex);
                            orderedTriggers.push(trigger);
                            found = true;
                        }
                    }
                    if (isNetRegexTrigger(trigger)) {
                        const netRegex = (_c = triggerObject[netRegexParserLang]) !== null && _c !== void 0 ? _c : trigger.netRegex;
                        if (netRegex instanceof RegExp) {
                            trigger.localNetRegex = resources_regexes/* default.parse */.Z.parse(netRegex);
                            orderedTriggers.push(trigger);
                            found = true;
                        }
                    }
                    if (!found) {
                        console.error('Trigger ' + trigger.id + ': missing regex and netRegex');
                        continue;
                    }
                }
            }
            if (set.overrideTimelineFile) {
                const filename = set.filename ? `'${set.filename}'` : '(user file)';
                console.log(`Overriding timeline from ${filename}.`);
                // If the timeline file override is set, all previously loaded timeline info is dropped.
                // Styles, triggers, and translations are kept, as they may still apply to the new one.
                timelineFiles = [];
                timelines = [];
            }
            // And set the timeline files/timelines from each set that matches.
            if (set.timelineFile) {
                if (set.filename) {
                    const dir = set.filename.substring(0, set.filename.lastIndexOf('/'));
                    timelineFiles.push(dir + '/' + set.timelineFile);
                }
                else {
                    // Note: For user files, this should get handled by raidboss_config.js,
                    // where `timelineFile` should get converted to `timeline`.
                    console.error('Can\'t specify timelineFile in non-manifest file:' + set.timelineFile);
                }
            }
            if (set.timeline)
                addTimeline(set.timeline);
            if (set.timelineReplace)
                replacements.push(...set.timelineReplace);
            if (set.timelineTriggers) {
                for (const trigger of set.timelineTriggers) {
                    this.ProcessTrigger(trigger);
                    trigger.isTimelineTrigger = true;
                    orderedTriggers.push(trigger);
                }
            }
            if (set.timelineStyles)
                timelineStyles.push(...set.timelineStyles);
            if (set.resetWhenOutOfCombat !== undefined)
                this.resetWhenOutOfCombat && (this.resetWhenOutOfCombat = set.resetWhenOutOfCombat);
        }
        // Store all the collected triggers in order, and filter out disabled triggers.
        const filterEnabled = (trigger) => !('disabled' in trigger && trigger.disabled);
        const allTriggers = orderedTriggers.asList().filter(filterEnabled);
        this.triggers = allTriggers.filter(isRegexTrigger);
        this.netTriggers = allTriggers.filter(isNetRegexTrigger);
        const timelineTriggers = allTriggers.filter(isRaidbossLooseTimelineTrigger);
        this.Reset();
        this.timelineLoader.SetTimelines(timelineFiles, timelines, replacements, timelineTriggers, timelineStyles);
    }
    ProcessTrigger(trigger) {
        // These properties are used internally by ReloadTimelines only and should
        // not exist on user triggers.  However, the trigger objects themselves are
        // reused when reloading pages, and so it is impossible to verify that
        // these properties don't exist.  Therefore, just delete them silently.
        if (isRaidbossLooseTimelineTrigger(trigger))
            delete trigger.isTimelineTrigger;
        delete trigger.localRegex;
        delete trigger.localNetRegex;
        trigger.output = TriggerOutputProxy.makeOutput(trigger, this.options.DisplayLanguage, this.options.PerTriggerAutoConfig);
    }
    OnJobChange(e) {
        this.me = e.detail.name;
        this.job = e.detail.job;
        this.role = util/* default.jobToRole */.Z.jobToRole(this.job);
        this.ReloadTimelines();
    }
    OnInCombatChange(inCombat) {
        if (this.inCombat === inCombat)
            return;
        if (this.resetWhenOutOfCombat)
            this.SetInCombat(inCombat);
    }
    SetInCombat(inCombat) {
        if (this.inCombat === inCombat)
            return;
        // Stop timers when stopping combat to stop any active timers that
        // are delayed.  However, also reset when starting combat.
        // This prevents late attacks from affecting |data| which
        // throws off the next run, potentially.
        this.inCombat = inCombat;
        if (!this.inCombat) {
            this.StopTimers();
            this.timelineLoader.StopCombat();
        }
        if (this.inCombat)
            this.Reset();
    }
    ShortNamify(name) {
        // TODO: make this unique among the party in case of first name collisions.
        // TODO: probably this should be a general cactbot utility.
        if (typeof name !== 'string') {
            console.error('called ShortNamify with non-string');
            return '???';
        }
        const nick = this.options.PlayerNicks[name];
        if (nick)
            return nick;
        const idx = name.indexOf(' ');
        return idx < 0 ? name : name.substr(0, idx);
    }
    Reset() {
        this.data = this.getDataObject();
        this.StopTimers();
        this.triggerSuppress = {};
        for (const initObj of this.dataInitializers) {
            const init = initObj.func;
            const data = init();
            if (typeof data === 'object') {
                this.data = {
                    ...data,
                    ...this.data,
                };
            }
            else {
                console.log(`Error in file: ${initObj.file}: these triggers may not work;
        initData function returned invalid object: ${init.toString()}`);
            }
        }
    }
    StopTimers() {
        this.timers = {};
    }
    OnLog(e) {
        var _a;
        // This could conceivably be determined based on the line's contents as well, but
        // not sure if that's worth the effort
        const currentTime = +new Date();
        for (const log of e.detail.logs) {
            if (log.includes('00:0038:cactbot wipe'))
                this.SetInCombat(false);
            for (const trigger of this.triggers) {
                const r = (_a = trigger.localRegex) === null || _a === void 0 ? void 0 : _a.exec(log);
                if (r)
                    this.OnTrigger(trigger, r, currentTime);
            }
        }
    }
    OnNetLog(e) {
        var _a;
        const log = e.rawLine;
        // This could conceivably be determined based on `new Date(e.line[1])` as well, but
        // not sure if that's worth the effort
        const currentTime = +new Date();
        for (const trigger of this.netTriggers) {
            const r = (_a = trigger.localNetRegex) === null || _a === void 0 ? void 0 : _a.exec(log);
            if (r)
                this.OnTrigger(trigger, r, currentTime);
        }
    }
    OnTrigger(trigger, matches, currentTime) {
        try {
            this.OnTriggerInternal(trigger, matches, currentTime);
        }
        catch (e) {
            onTriggerException(trigger, e);
        }
    }
    OnTriggerInternal(trigger, matches, currentTime) {
        if (this._onTriggerInternalCheckSuppressed(trigger, currentTime))
            return;
        let groups = {};
        // If using named groups, treat matches.groups as matches
        // so triggers can do things like matches.target.
        if (matches && matches.groups)
            groups = matches.groups;
        // Set up a helper object so we don't have to throw
        // a ton of info back and forth between subfunctions
        const triggerHelper = this._onTriggerInternalGetHelper(trigger, groups, currentTime);
        if (!this._onTriggerInternalCondition(triggerHelper))
            return;
        this._onTriggerInternalPreRun(triggerHelper);
        // Evaluate for delay here, but run delay later
        const delayPromise = this._onTriggerInternalDelaySeconds(triggerHelper);
        this._onTriggerInternalDurationSeconds(triggerHelper);
        this._onTriggerInternalSuppressSeconds(triggerHelper);
        const triggerPostDelay = () => {
            const promise = this._onTriggerInternalPromise(triggerHelper);
            const triggerPostPromise = () => {
                this._onTriggerInternalSound(triggerHelper);
                this._onTriggerInternalSoundVolume(triggerHelper);
                this._onTriggerInternalResponse(triggerHelper);
                this._onTriggerInternalAlarmText(triggerHelper);
                this._onTriggerInternalAlertText(triggerHelper);
                this._onTriggerInternalInfoText(triggerHelper);
                // Priority audio order:
                // * user disabled (play nothing)
                // * if tts options are enabled globally or for this trigger:
                //   * user TTS triggers tts override
                //   * tts entries in the trigger
                //   * default alarm tts
                //   * default alert tts
                //   * default info tts
                // * if sound options are enabled globally or for this trigger:
                //   * user trigger sound overrides
                //   * sound entries in the trigger
                //   * alarm noise
                //   * alert noise
                //   * info noise
                // * else, nothing
                //
                // In general, tts comes before sounds and user overrides come
                // before defaults.  If a user trigger or tts entry is specified as
                // being valid but empty, this will take priority over the default
                // tts texts from alarm/alert/info and will prevent tts from playing
                // and allowing sounds to be played instead.
                this._onTriggerInternalTTS(triggerHelper);
                this._onTriggerInternalPlayAudio(triggerHelper);
                this._onTriggerInternalRun(triggerHelper);
            };
            // The trigger body must run synchronously when there is no promise.
            if (promise)
                promise.then(triggerPostPromise, (e) => onTriggerException(trigger, e));
            else
                triggerPostPromise();
        };
        // The trigger body must run synchronously when there is no delay.
        if (delayPromise)
            delayPromise.then(triggerPostDelay, (e) => onTriggerException(trigger, e));
        else
            triggerPostDelay();
    }
    // Build a default triggerHelper object for this trigger
    _onTriggerInternalGetHelper(trigger, matches, now) {
        var _a, _b, _c;
        const id = trigger.id;
        let options = {};
        let config = {};
        let suppressed = false;
        if (id) {
            options = (_a = this.options.PerTriggerOptions[id]) !== null && _a !== void 0 ? _a : options;
            config = (_b = this.options.PerTriggerAutoConfig[id]) !== null && _b !== void 0 ? _b : config;
            suppressed = (_c = this.options.DisabledTriggers[id]) !== null && _c !== void 0 ? _c : suppressed;
        }
        const triggerHelper = {
            trigger: trigger,
            now: now,
            triggerOptions: options,
            triggerAutoConfig: config,
            // This setting only suppresses output, trigger still runs for data/logic purposes
            userSuppressedOutput: suppressed,
            matches: matches,
            // Default options
            textAlertsEnabled: this.options.TextAlertsEnabled,
            soundAlertsEnabled: this.options.SoundAlertsEnabled,
            spokenAlertsEnabled: this.options.SpokenAlertsEnabled,
            groupSpokenAlertsEnabled: this.options.GroupSpokenAlertsEnabled,
            valueOrFunction: (f) => {
                var _a;
                let result = f;
                if (typeof result === 'function')
                    result = result(this.data, triggerHelper.matches, triggerHelper.output);
                // All triggers return either a string directly, or an object
                // whose keys are different parser language based names.  For simplicity,
                // this is valid to do for any trigger entry that can handle a function.
                // In case anybody wants to encapsulate any fancy grammar, the values
                // in this object can also be functions.
                if (typeof result !== 'object' || result === null)
                    return result;
                return triggerHelper.valueOrFunction((_a = result[this.displayLang]) !== null && _a !== void 0 ? _a : result['en']);
            },
            get output() {
                var _a;
                if (this.trigger.output)
                    return this.trigger.output;
                console.log(`Missing trigger.output for trigger ${(_a = trigger.id) !== null && _a !== void 0 ? _a : 'Unknown'}`);
                return defaultOutput;
            },
        };
        this._onTriggerInternalHelperDefaults(triggerHelper);
        return triggerHelper;
    }
    _onTriggerInternalCheckSuppressed(trigger, when) {
        const id = trigger.id;
        if (id !== undefined) {
            const suppress = this.triggerSuppress[id];
            if (suppress !== undefined) {
                if (suppress > when)
                    return true;
                delete this.triggerSuppress[id];
            }
        }
        return false;
    }
    _onTriggerInternalCondition(triggerHelper) {
        var _a;
        const condition = (_a = triggerHelper.triggerOptions.Condition) !== null && _a !== void 0 ? _a : triggerHelper.trigger.condition;
        if (condition) {
            if (condition === true)
                return true;
            if (!condition(this.data, triggerHelper.matches, triggerHelper.output))
                return false;
        }
        return true;
    }
    // Set defaults for triggerHelper object (anything that won't change based on
    // other trigger functions running)
    _onTriggerInternalHelperDefaults(triggerHelper) {
        if (triggerHelper.triggerAutoConfig) {
            const textAlertsEnabled = triggerHelper.triggerAutoConfig.TextAlertsEnabled;
            if (textAlertsEnabled !== undefined)
                triggerHelper.textAlertsEnabled = textAlertsEnabled;
            const soundAlertsEnabled = triggerHelper.triggerAutoConfig.SoundAlertsEnabled;
            if (soundAlertsEnabled !== undefined)
                triggerHelper.soundAlertsEnabled = soundAlertsEnabled;
            const spokenAlertsEnabled = triggerHelper.triggerAutoConfig.SpokenAlertsEnabled;
            if (spokenAlertsEnabled !== undefined)
                triggerHelper.spokenAlertsEnabled = spokenAlertsEnabled;
        }
        if (triggerHelper.triggerOptions) {
            const textAlertsEnabled = triggerHelper.triggerOptions.TextAlert;
            if (textAlertsEnabled !== undefined)
                triggerHelper.textAlertsEnabled = textAlertsEnabled;
            const soundAlertsEnabled = triggerHelper.triggerOptions.SoundAlert;
            if (soundAlertsEnabled !== undefined)
                triggerHelper.soundAlertsEnabled = soundAlertsEnabled;
            const spokenAlertsEnabled = triggerHelper.triggerOptions.SpeechAlert;
            if (spokenAlertsEnabled !== undefined)
                triggerHelper.spokenAlertsEnabled = spokenAlertsEnabled;
            const groupSpokenAlertsEnabled = triggerHelper.triggerOptions.GroupSpeechAlert;
            if (groupSpokenAlertsEnabled !== undefined)
                triggerHelper.groupSpokenAlertsEnabled = groupSpokenAlertsEnabled;
        }
        if (triggerHelper.userSuppressedOutput) {
            triggerHelper.textAlertsEnabled = false;
            triggerHelper.soundAlertsEnabled = false;
            triggerHelper.spokenAlertsEnabled = false;
            triggerHelper.groupSpokenAlertsEnabled = false;
        }
        if (!this.options.AudioAllowed) {
            triggerHelper.soundAlertsEnabled = false;
            triggerHelper.spokenAlertsEnabled = false;
            triggerHelper.groupSpokenAlertsEnabled = false;
        }
    }
    _onTriggerInternalPreRun(triggerHelper) {
        var _a, _b;
        (_b = (_a = triggerHelper.trigger) === null || _a === void 0 ? void 0 : _a.preRun) === null || _b === void 0 ? void 0 : _b.call(_a, this.data, triggerHelper.matches, triggerHelper.output);
    }
    _onTriggerInternalDelaySeconds(triggerHelper) {
        const delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;
        if (!delay || delay <= 0 || typeof delay !== 'number')
            return;
        const triggerID = this.currentTriggerID++;
        this.timers[triggerID] = true;
        return new Promise((res, rej) => {
            window.setTimeout(() => {
                if (this.timers[triggerID])
                    res();
                else if (rej)
                    rej();
                delete this.timers[triggerID];
            }, delay * 1000);
        });
    }
    _onTriggerInternalDurationSeconds(triggerHelper) {
        let valueDuration = triggerHelper.valueOrFunction(triggerHelper.trigger.durationSeconds);
        if (typeof valueDuration !== 'number')
            valueDuration = undefined;
        triggerHelper.duration = {
            fromConfig: triggerHelper.triggerAutoConfig.Duration,
            fromTrigger: valueDuration,
            alarmText: this.options.DisplayAlarmTextForSeconds,
            alertText: this.options.DisplayAlertTextForSeconds,
            infoText: this.options.DisplayInfoTextForSeconds,
        };
    }
    _onTriggerInternalSuppressSeconds(triggerHelper) {
        const suppress = 'suppressSeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.suppressSeconds) : 0;
        if (typeof suppress !== 'number')
            return;
        if (triggerHelper.trigger.id && suppress > 0)
            this.triggerSuppress[triggerHelper.trigger.id] = triggerHelper.now + (suppress * 1000);
    }
    _onTriggerInternalPromise(triggerHelper) {
        var _a;
        let promise;
        if ('promise' in triggerHelper.trigger) {
            const id = (_a = triggerHelper.trigger.id) !== null && _a !== void 0 ? _a : 'Unknown';
            if (typeof triggerHelper.trigger.promise === 'function') {
                promise = triggerHelper.trigger.promise(this.data, triggerHelper.matches, triggerHelper.output);
                // Make sure we actually get a Promise back from the function
                if (Promise.resolve(promise) !== promise) {
                    console.error(`Trigger ${id}: promise function did not return a promise`);
                    promise = undefined;
                }
            }
            else {
                console.error(`Trigger ${id}: promise defined but not a function`);
            }
        }
        return promise;
    }
    _onTriggerInternalSound(triggerHelper) {
        const result = triggerHelper.valueOrFunction(triggerHelper.trigger.sound);
        if (typeof result === 'string')
            triggerHelper.soundUrl = result;
    }
    _onTriggerInternalSoundVolume(triggerHelper) {
        const result = triggerHelper.valueOrFunction(triggerHelper.trigger.soundVolume);
        if (typeof result === 'number')
            triggerHelper.triggerSoundVol = result;
    }
    _onTriggerInternalResponse(triggerHelper) {
        let response = {};
        const trigger = triggerHelper.trigger;
        if (trigger.response) {
            // Can't use ValueOrFunction here as r returns a non-localizable object.
            response = trigger.response;
            while (typeof response === 'function')
                response = response(this.data, triggerHelper.matches, triggerHelper.output);
            // Turn falsy values into a default no-op response.
            if (!response)
                response = {};
        }
        triggerHelper.response = response;
    }
    _onTriggerInternalAlarmText(triggerHelper) {
        this._addTextFor('alarm', triggerHelper);
    }
    _onTriggerInternalAlertText(triggerHelper) {
        this._addTextFor('alert', triggerHelper);
    }
    _onTriggerInternalInfoText(triggerHelper) {
        this._addTextFor('info', triggerHelper);
    }
    _onTriggerInternalTTS(triggerHelper) {
        if (!triggerHelper.groupSpokenAlertsEnabled || typeof triggerHelper.ttsText === 'undefined') {
            let result = undefined;
            if (triggerHelper.triggerOptions.TTSText) {
                result = triggerHelper.valueOrFunction(triggerHelper.triggerOptions.TTSText);
            }
            else if (triggerHelper.trigger.tts) {
                result = triggerHelper.valueOrFunction(triggerHelper.trigger.tts);
            }
            else if (triggerHelper.response) {
                const resp = triggerHelper.response;
                if (resp.tts)
                    result = triggerHelper.valueOrFunction(resp.tts);
            }
            // Allow false or null to disable tts entirely
            // Undefined will fall back to defaultTTSText
            if (result !== undefined) {
                if (result)
                    triggerHelper.ttsText = result === null || result === void 0 ? void 0 : result.toString();
            }
            else {
                triggerHelper.ttsText = triggerHelper.defaultTTSText;
            }
        }
    }
    _onTriggerInternalPlayAudio(triggerHelper) {
        var _a, _b, _c;
        if (triggerHelper.trigger.sound &&
            triggerHelper.soundUrl &&
            soundStrs.includes(triggerHelper.soundUrl)) {
            const namedSound = triggerHelper.soundUrl + 'Sound';
            const namedSoundVolume = triggerHelper.soundUrl + 'SoundVolume';
            const sound = this.options[namedSound];
            if (typeof sound === 'string') {
                triggerHelper.soundUrl = sound;
                const soundVol = this.options[namedSoundVolume];
                if (typeof soundVol === 'number')
                    triggerHelper.soundVol = soundVol;
            }
        }
        triggerHelper.soundUrl = (_a = triggerHelper.triggerOptions.SoundOverride) !== null && _a !== void 0 ? _a : triggerHelper.soundUrl;
        triggerHelper.soundVol = (_c = (_b = triggerHelper.triggerOptions.VolumeOverride) !== null && _b !== void 0 ? _b : triggerHelper.triggerSoundVol) !== null && _c !== void 0 ? _c : triggerHelper.soundVol;
        // Text to speech overrides all other sounds.  This is so
        // that a user who prefers tts can still get the benefit
        // of infoText triggers without tts entries by turning
        // on (speech=true, text=true, sound=true) but this will
        // not cause tts to play over top of sounds or noises.
        if (triggerHelper.ttsText && triggerHelper.spokenAlertsEnabled) {
            // Heuristics for auto tts.
            // * In case this is an integer.
            triggerHelper.ttsText = triggerHelper.ttsText.toString();
            // * Remove a bunch of chars.
            triggerHelper.ttsText = triggerHelper.ttsText.replace(/[#!]/g, '');
            // * slashes between mechanics
            triggerHelper.ttsText = triggerHelper.ttsText.replace('/', ' ');
            // * tildes at the end for emphasis
            triggerHelper.ttsText = triggerHelper.ttsText.replace(/~+$/, '');
            // * arrows helping visually simple to understand e.g. ↖ Front left / Back right ↘
            triggerHelper.ttsText = triggerHelper.ttsText.replace(/[↖-↙]/g, '');
            // * Korean TTS reads wrong with '1번째'
            triggerHelper.ttsText = triggerHelper.ttsText.replace('1번째', '첫번째');
            // * arrows at the front or the end are directions, e.g. "east =>"
            triggerHelper.ttsText = triggerHelper.ttsText.replace(/[-=]>\s*$/g, '');
            triggerHelper.ttsText = triggerHelper.ttsText.replace(/^\s*<[-=]/g, '');
            // * arrows in the middle are a sequence, e.g. "in => out => spread"
            const arrowReplacement = {
                en: ' then ',
                de: ' dann ',
                fr: ' puis ',
                ja: 'や',
                cn: '然后',
                ko: ' 그리고 ',
            };
            triggerHelper.ttsText = triggerHelper.ttsText.replace(/\s*(<[-=]|[=-]>)\s*/g, arrowReplacement[this.displayLang]);
            this.ttsSay(triggerHelper.ttsText);
        }
        else if (triggerHelper.soundUrl && triggerHelper.soundAlertsEnabled) {
            this._playAudioFile(triggerHelper, triggerHelper.soundUrl, triggerHelper.soundVol);
        }
    }
    _onTriggerInternalRun(triggerHelper) {
        var _a, _b;
        (_b = (_a = triggerHelper.trigger) === null || _a === void 0 ? void 0 : _a.run) === null || _b === void 0 ? void 0 : _b.call(_a, this.data, triggerHelper.matches, triggerHelper.output);
    }
    _createTextFor(triggerHelper, text, textType, lowerTextKey, duration) {
        var _a, _b;
        // info-text
        const textElementClass = textType + '-text';
        if (textType !== 'info')
            text = triggerUpperCase(text);
        const holder = (_a = this[lowerTextKey]) === null || _a === void 0 ? void 0 : _a.getElementsByClassName('holder')[0];
        const div = this._makeTextElement(triggerHelper, text, textElementClass);
        if (!holder)
            throw new not_reached/* UnreachableCode */.$();
        holder.appendChild(div);
        if (holder.children.length > this.kMaxRowsOfText)
            (_b = holder.firstChild) === null || _b === void 0 ? void 0 : _b.remove();
        window.setTimeout(() => {
            if (holder.contains(div))
                holder.removeChild(div);
        }, duration * 1000);
    }
    _addTextFor(textType, triggerHelper) {
        var _a, _b, _c, _d;
        // infoText
        const lowerTextKey = textMap[textType].text;
        // InfoText
        const upperTextKey = textMap[textType].upperText;
        // InfoSound
        const upperSound = textMap[textType].upperSound;
        // InfoSoundVolume
        const upperSoundVolume = textMap[textType].upperSoundVolume;
        let textObj = triggerHelper.triggerOptions[upperTextKey];
        if (!textObj && triggerHelper.trigger[lowerTextKey])
            textObj = triggerHelper.trigger[lowerTextKey];
        if (!textObj && triggerHelper.response)
            textObj = triggerHelper.response[lowerTextKey];
        if (textObj) {
            let text = triggerHelper.valueOrFunction(textObj);
            if (!text)
                return;
            if (typeof text === 'number')
                text = text.toString();
            if (typeof text !== 'string')
                text = String(text);
            triggerHelper.defaultTTSText = (_a = triggerHelper.defaultTTSText) !== null && _a !== void 0 ? _a : text;
            if (text && typeof text === 'string' && triggerHelper.textAlertsEnabled) {
                // per-trigger option > trigger field > option duration by text type
                let duration = (_c = (_b = triggerHelper.duration) === null || _b === void 0 ? void 0 : _b.fromConfig) !== null && _c !== void 0 ? _c : (_d = triggerHelper.duration) === null || _d === void 0 ? void 0 : _d.fromTrigger;
                if (duration === undefined && triggerHelper.duration)
                    duration = triggerHelper.duration[lowerTextKey];
                if (duration === undefined)
                    duration = 0;
                this._createTextFor(triggerHelper, text, textType, lowerTextKey, duration);
                if (!triggerHelper.soundUrl) {
                    triggerHelper.soundUrl = this.options[upperSound];
                    triggerHelper.soundVol = this.options[upperSoundVolume];
                }
            }
        }
    }
    _makeTextElement(_triggerHelper, text, className) {
        const div = document.createElement('div');
        div.classList.add(className);
        div.classList.add('animate-text');
        div.innerText = text;
        return div;
    }
    _playAudioFile(triggerHelper, url, volume) {
        const audio = new Audio(url);
        audio.volume = volume !== null && volume !== void 0 ? volume : 1;
        void audio.play();
    }
    getDataObject() {
        let preserveHP = 0;
        if (this.data && this.data.currentHP)
            preserveHP = this.data.currentHP;
        // TODO: make a breaking change at some point and
        // make all this style consistent, sorry.
        return {
            me: this.me,
            job: this.job,
            role: this.role,
            party: this.partyTracker,
            lang: this.parserLang,
            parserLang: this.parserLang,
            displayLang: this.displayLang,
            currentHP: preserveHP,
            options: this.options,
            ShortName: this.ShortNamify.bind(this),
            StopCombat: () => this.SetInCombat(false),
            ParseLocaleFloat: parseFloat,
            CanStun: () => util/* default.canStun */.Z.canStun(this.job),
            CanSilence: () => util/* default.canSilence */.Z.canSilence(this.job),
            CanSleep: () => util/* default.canSleep */.Z.canSleep(this.job),
            CanCleanse: () => util/* default.canCleanse */.Z.canCleanse(this.job),
            CanFeint: () => util/* default.canFeint */.Z.canFeint(this.job),
            CanAddle: () => util/* default.canAddle */.Z.canAddle(this.job),
        };
    }
}
class PopupTextGenerator {
    constructor(popupText) {
        this.popupText = popupText;
    }
    Info(text, currentTime) {
        this.popupText.OnTrigger({
            infoText: text,
            tts: text,
        }, null, currentTime);
    }
    Alert(text, currentTime) {
        this.popupText.OnTrigger({
            alertText: text,
            tts: text,
        }, null, currentTime);
    }
    Alarm(text, currentTime) {
        this.popupText.OnTrigger({
            alarmText: text,
            tts: text,
        }, null, currentTime);
    }
    TTS(text, currentTime) {
        this.popupText.OnTrigger({
            infoText: text,
            tts: text,
        }, null, currentTime);
    }
    Trigger(trigger, matches, currentTime) {
        this.popupText.OnTrigger(trigger, matches, currentTime);
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/ui/ProgressBar.js


class ProgressBar {
  constructor(emulator) {
    this.$progressBarTooltip = new Tooltip('.encounterProgressBar', 'bottom', '', false);
    this.$progressBarCurrent = document.querySelector('.current-timestamp');
    this.$progressBarDuration = document.querySelector('.duration-timestamp');
    this.$progress = document.querySelector('.encounterProgressBar');
    this.$progressBar = document.querySelector('.encounterProgressBar .progress-bar');
    this.$engageIndicator = document.querySelector('.progressBarRow .engageIndicator');
    new Tooltip(this.$engageIndicator, 'bottom', 'Fight Begins');
    this.emulator = emulator;
    this.$progress.addEventListener('mousemove', e => {
      if (this.emulator.currentEncounter) {
        const percent = e.offsetX / e.currentTarget.offsetWidth;
        const time = Math.floor(this.emulator.currentEncounter.encounter.duration * percent) - this.emulator.currentEncounter.encounter.initialOffset;
        this.$progressBarTooltip.offset.x = e.offsetX - e.currentTarget.offsetWidth / 2;
        this.$progressBarTooltip.setText(EmulatorCommon_EmulatorCommon.timeToString(time));
        this.$progressBarTooltip.show();
      }
    });
    this.$progress.addEventListener('click', e => {
      if (this.emulator.currentEncounter) {
        const percent = e.offsetX / e.currentTarget.offsetWidth;
        const time = Math.floor(this.emulator.currentEncounter.encounter.duration * percent);
        this.emulator.seek(time);
      }
    });
    emulator.on('currentEncounterChanged', encounter => {
      this.$progressBarCurrent.textContent = EmulatorCommon_EmulatorCommon.timeToString(0, false);
      this.$progressBarDuration.textContent = EmulatorCommon_EmulatorCommon.timeToString(encounter.encounter.duration - encounter.encounter.initialOffset, false);
      this.$progressBar.style.width = '0%';
      this.$progressBar.setAttribute('ariaValueMax', encounter.encounter.duration);

      if (isNaN(encounter.encounter.initialOffset)) {
        this.$engageIndicator.classList.add('d-none');
      } else {
        const initialPercent = encounter.encounter.initialOffset / emulator.currentEncounter.encounter.duration * 100;
        this.$engageIndicator.classList.remove('d-none');
        this.$engageIndicator.style.left = initialPercent + '%';
      }
    });
    emulator.on('tick', currentLogTime => {
      const currentOffset = currentLogTime - emulator.currentEncounter.encounter.startTimestamp;
      const progPercent = currentOffset / emulator.currentEncounter.encounter.duration * 100;
      const progValue = currentLogTime - emulator.currentEncounter.encounter.initialTimestamp;
      this.$progressBarCurrent.textContent = EmulatorCommon_EmulatorCommon.timeToString(progValue, false);
      this.$progressBar.setAttribute('ariaValueNow', progValue);
      this.$progressBar.style.width = progPercent + '%';
    });
    const $play = document.querySelector('.progressBarRow button.play');
    const $pause = document.querySelector('.progressBarRow button.pause');
    $play.addEventListener('click', () => {
      if (this.emulator.play()) {
        $play.classList.add('d-none');
        $pause.classList.remove('d-none');
      }
    });
    $pause.addEventListener('click', () => {
      if (this.emulator.pause()) {
        $pause.classList.add('d-none');
        $play.classList.remove('d-none');
      }
    });
  }

}
;// CONCATENATED MODULE: ./ui/raidboss/common_replacement.ts
// TODO: maybe this should be structured identically to a timelineReplace section.
// It's awkward to refer to these string keys, so name them as replaceSync[keys.sealKey].
const syncKeys = {
    // Match Regexes, NetRegexes, and timeline constructions of seal log lines.
    seal: '(?<=00:0839:|00\\|[^|]*\\|0839\\|\\|)(.*) will be sealed off(?: in (?:[0-9]+ seconds)?)?',
    unseal: 'is no longer sealed',
    engage: 'Engage!',
};
const textKeys = {
    // Match directions in replaceText
    // eg: `(N)`, `(SW)`, `(NE/NW)`, etc.
    E: '(?<= \\(|\\/)E(?=\\)|\\/)',
    N: '(?<= \\(|\\/)N(?=\\)|\\/)',
    S: '(?<= \\(|\\/)S(?=\\)|\\/)',
    W: '(?<= \\(|\\/)W(?=\\)|\\/)',
    NE: '(?<= \\(|\\/)NE(?=\\)|\\/)',
    NW: '(?<= \\(|\\/)NW(?=\\)|\\/)',
    SE: '(?<= \\(|\\/)SE(?=\\)|\\/)',
    SW: '(?<= \\(|\\/)SW(?=\\)|\\/)',
    // Match Roles in replaceText
    // eg: `(Tank)`, `(Healer)`, `(DPS)`, etc
    Tank: '(?<= \\(|\\/)Tanks?(?=\\)|\\/)',
    Healer: '(?<= \\(|\\/)Healers?(?=\\)|\\/)',
    DPS: '(?<= \\(|\\/)DPS(?=\\)|\\/)',
    // Match `--1--` style text.
    Number: '--(\\s*\\d+\\s*)--',
};
const commonReplacement = {
    replaceSync: {
        [syncKeys.seal]: {
            en: '$1 will be sealed off',
            de: 'Noch 15 Sekunden, bis sich (?:(?:der|die|das) )?(?:Zugang zu(?:[rm]| den)? )?$1 schließt',
            fr: 'Fermeture d(?:e|u|es) $1 dans',
            ja: '$1の封鎖まであと',
            cn: '距$1被封锁还有',
            ko: '15초 후에 $1(?:이|가) 봉쇄됩니다',
        },
        [syncKeys.unseal]: {
            en: 'is no longer sealed',
            de: 'öffnet sich (?:wieder|erneut)',
            fr: 'Ouverture ',
            ja: 'の封鎖が解かれた',
            cn: '的封锁解除了',
            ko: '의 봉쇄가 해제되었습니다',
        },
        [syncKeys.engage]: {
            en: 'Engage!',
            de: 'Start!',
            fr: 'À l\'attaque',
            ja: '戦闘開始！',
            cn: '战斗开始！',
            ko: '전투 시작!',
        },
    },
    replaceText: {
        '--adds spawn--': {
            de: '--Adds erscheinen--',
            fr: '--Apparition d\'adds--',
            ja: '--雑魚出現--',
            cn: '--小怪出现--',
            ko: '--쫄 소환--',
        },
        '--adds targetable--': {
            de: '--Adds anvisierbar--',
            fr: '--Adds ciblables--',
            ja: '--雑魚ターゲット可能--',
            cn: '--小怪可选中--',
            ko: '--쫄 타겟 가능--',
        },
        '--center--': {
            de: '--Mitte--',
            fr: '--Centre--',
            ja: '--センター--',
            cn: '--中央--',
            ko: '--중앙--',
        },
        '\\(center\\)': {
            de: '(Mitte)',
            fr: '(Centre)',
            ja: '(センター)',
            cn: '(中央)',
            ko: '(중앙)',
        },
        '--clones appear--': {
            de: '--Klone erscheinen--',
            fr: '--Apparition des clones--',
            ja: '--幻影出現--',
            cn: '--克隆 体 出现--',
            ko: '--분신 소환--',
        },
        '--corner--': {
            de: '--Ecke--',
            fr: '--Coin--',
            ja: '--コーナー--',
            cn: '--角落--',
            ko: '--구석--',
        },
        '--dps burn--': {
            de: '--DPS burn--',
            fr: '--Burn dps--',
            ja: '--火力出せ--',
            cn: '--转火--',
            ko: '--딜 체크--',
        },
        '--east--': {
            de: '--Osten--',
            fr: '--Est--',
            ja: '--東--',
            cn: '--东--',
            ko: '--동쪽--',
        },
        '\\(east\\)': {
            de: '(Osten)',
            fr: '(Est)',
            ja: '(東)',
            cn: '(东)',
            ko: '(동쪽)',
        },
        'Enrage': {
            de: 'Finalangriff',
            fr: 'Enrage',
            ja: '時間切れ',
            cn: '狂暴',
            ko: '전멸기',
        },
        '--frozen--': {
            de: '--eingefroren--',
            fr: '--Gelé--',
            ja: '--凍結--',
            cn: '--冻结--',
            ko: '--동결--',
        },
        '--in--': {
            de: '--Rein--',
            fr: '--Intérieur--',
            ja: '--中--',
            cn: '--内--',
            ko: '--안--',
        },
        '\\(In\\)': {
            de: '(Rein)',
            fr: '(Intérieur)',
            ja: '(中)',
            cn: '(内)',
            ko: '(안)',
        },
        '\\(inner\\)': {
            de: '(innen)',
            fr: '(intérieur)',
            ja: '(中)',
            cn: '(内)',
            ko: '(안)',
        },
        '--jump--': {
            de: '--Sprung--',
            fr: '--Saut--',
            ja: '--ジャンプ--',
            cn: '--跳--',
            ko: '--점프--',
        },
        '--knockback--': {
            de: '--Rückstoß--',
            fr: '--Poussée--',
            ja: '--ノックバック--',
            cn: '--击退--',
            ko: '--넉백--',
        },
        '--middle--': {
            de: '--Mitte--',
            fr: '--Milieu--',
            ja: '--中央--',
            cn: '--中间--',
            ko: '--중앙--',
        },
        '\\(middle\\)': {
            de: '(Mitte)',
            fr: '(Milieu)',
            ja: '(中央)',
            cn: '(中间)',
            ko: '(중앙)',
        },
        '--north--': {
            de: '--Norden--',
            fr: '--Nord--',
            ja: '--北--',
            cn: '--北--',
            ko: '--북쪽--',
        },
        '\\(north\\)': {
            de: '(Norden)',
            fr: '(Nord)',
            ja: '(北)',
            cn: '(北)',
            ko: '(북쪽)',
        },
        '--northeast--': {
            de: '--Nordosten--',
            fr: '--Nord-Est--',
            ja: '--北東--',
            cn: '--东北--',
            ko: '--북동--',
        },
        '--northwest--': {
            de: '--Nordwesten--',
            fr: '--Nord-Ouest--',
            ja: '--北西--',
            cn: '--西北--',
            ko: '--북서--',
        },
        '--out--': {
            de: '--Raus--',
            fr: '--Extérieur--',
            ja: '--外--',
            cn: '--外--',
            ko: '--밖--',
        },
        '\\(Out\\)': {
            de: '(Raus)',
            fr: '(Extérieur)',
            ja: '(外)',
            cn: '(外)',
            ko: '(밖)',
        },
        '\\(outer\\)': {
            de: '(außen)',
            fr: '(extérieur)',
            ja: '(外)',
            cn: '(外)',
            ko: '(밖)',
        },
        '\\(outside\\)': {
            de: '(Draußen)',
            fr: '(À l\'extérieur)',
            ja: '(外)',
            cn: '(外面)',
            ko: '(바깥)',
        },
        '--rotate--': {
            de: '--rotieren--',
            fr: '--rotation--',
            ja: '--回転--',
            cn: '--龙回转--',
            ko: '--회전--',
        },
        '--south--': {
            de: '--Süden--',
            fr: '--Sud--',
            ja: '--南--',
            cn: '--南--',
            ko: '--남쪽--',
        },
        '\\(south\\)': {
            de: '(Süden)',
            fr: '(Sud)',
            ja: '(南)',
            cn: '(南)',
            ko: '(남쪽)',
        },
        '--southeast--': {
            de: '--Südosten--',
            fr: '--Sud-Est--',
            ja: '--南東--',
            cn: '--东南--',
            ko: '--남동--',
        },
        '--southwest--': {
            de: '--Südwesten--',
            fr: '--Sud-Ouest--',
            ja: '--南西--',
            cn: '--西南--',
            ko: '--남서--',
        },
        '--split--': {
            de: '--teilen--',
            fr: '--division--',
            ja: '--分裂--',
            cn: '--分裂--',
            ko: '--분열--',
        },
        '--stun--': {
            de: '--Betäubung--',
            fr: '--Étourdissement--',
            ja: '--スタン--',
            cn: '--击晕--',
            ko: '--기절--',
        },
        '--sync--': {
            de: '--synchronisation--',
            fr: '--synchronisation--',
            ja: '--シンク--',
            cn: '--同步化--',
            ko: '--동기화--',
        },
        '--([0-9]+x )?targetable--': {
            de: '--$1anvisierbar--',
            fr: '--$1ciblable--',
            ja: '--$1ターゲット可能--',
            cn: '--$1可选中--',
            ko: '--$1타겟 가능--',
        },
        '--teleport--': {
            de: '--teleportation--',
            fr: '--téléportation--',
            ja: '--テレポート--',
            cn: '--傳送--',
            ko: '--순간 이동--',
        },
        '--untargetable--': {
            de: '--nich anvisierbar--',
            fr: '--non ciblable--',
            ja: '--ターゲット不可--',
            cn: '--无法选中--',
            ko: '--타겟 불가능--',
        },
        '--west--': {
            de: '--Westen--',
            fr: '--Ouest--',
            ja: '--西--',
            cn: '--西--',
            ko: '--서쪽--',
        },
        [textKeys.E]: {
            de: 'O',
            fr: 'E',
            ja: '東',
            cn: '东',
            ko: '동',
        },
        [textKeys.N]: {
            de: 'N',
            fr: 'N',
            ja: '北',
            cn: '北',
            ko: '북',
        },
        [textKeys.S]: {
            de: 'S',
            fr: 'S',
            ja: '南',
            cn: '南',
            ko: '남',
        },
        [textKeys.W]: {
            de: 'W',
            fr: 'O',
            ja: '西',
            cn: '西',
            ko: '서',
        },
        [textKeys.NE]: {
            de: 'NO',
            fr: 'NE',
            ja: '北東',
            cn: '东北',
            ko: '북동',
        },
        [textKeys.NW]: {
            de: 'NW',
            fr: 'NO',
            ja: '北西',
            cn: '西北',
            ko: '북서',
        },
        [textKeys.SE]: {
            de: 'SO',
            fr: 'SE',
            ja: '南東',
            cn: '东南',
            ko: '남동',
        },
        [textKeys.SW]: {
            de: 'SW',
            fr: 'SO',
            ja: '南西',
            cn: '西南',
            ko: '남서',
        },
        [textKeys.Tank]: {
            de: 'Tank',
            fr: 'Tank',
            ja: 'タンク',
            cn: '坦克',
            ko: '탱커',
        },
        [textKeys.Healer]: {
            de: 'Heiler',
            fr: 'Healer',
            ja: 'ヒーラー',
            cn: '治疗',
            ko: '힐러',
        },
        [textKeys.DPS]: {
            de: 'DPS',
            fr: 'DPS',
            ja: 'DPS',
            cn: 'DPS',
            ko: '딜러',
        },
        [textKeys.Number]: {
            de: '--$1--',
            fr: '--$1--',
            ja: '--$1--',
            cn: '--$1--',
            ko: '--$1--',
        },
    },
};
// Keys into commonReplacement objects that represent "partial" translations,
// in the sense that even if it applies, there still needs to be another
// translation for it to be complete.  These keys should be exactly the same
// as the keys from the commonReplacement block above.
const partialCommonReplacementKeys = [
    // Because the zone name needs to be translated here, this is partial.
    syncKeys.seal,
    // Directions
    textKeys.E,
    textKeys.N,
    textKeys.S,
    textKeys.W,
    textKeys.NE,
    textKeys.NW,
    textKeys.SE,
    textKeys.SW,
    // Roles
    textKeys.Tank,
    textKeys.Healer,
    textKeys.DPS,
];

;// CONCATENATED MODULE: ./ui/raidboss/timeline.ts




const kBig = 1000000000; // Something bigger than any fight length in seconds.
const timelineInstructions = {
    en: [
        'These lines are',
        'debug timeline entries.',
        'If you lock the overlay,',
        'they will disappear!',
        'Real timelines automatically',
        'appear when supported.',
    ],
    de: [
        'Diese Zeilen sind',
        'Timeline Debug-Einträge.',
        'Wenn du das Overlay sperrst,',
        'werden sie verschwinden!',
        'Echte Timelines erscheinen automatisch,',
        'wenn sie unterstützt werden.',
    ],
    fr: [
        'Ces lignes sont',
        'des timelines de test.',
        'Si vous bloquez l\'overlay,',
        'elles disparaîtront !',
        'Les vraies Timelines',
        'apparaîtront automatiquement.',
    ],
    ja: [
        'こちらはデバッグ用の',
        'タイムラインです。',
        'オーバーレイをロックすれば、',
        'デバッグ用テキストも消える',
        'サポートするゾーンにはタイム',
        'ラインを動的にロードする。',
    ],
    cn: [
        '显示在此处的是',
        '调试用时间轴。',
        '将此悬浮窗锁定',
        '则会立刻消失',
        '真实的时间轴会根据',
        '当前区域动态加载并显示',
    ],
    ko: [
        '이 막대바는 디버그용',
        '타임라인 입니다.',
        '오버레이를 위치잠금하면,',
        '이 막대바도 사라집니다.',
        '지원되는 구역에서 타임라인이',
        '자동으로 표시됩니다.',
    ],
};
const activeText = {
    en: 'Active:',
    de: 'Aktiv:',
    fr: 'Active :',
    ja: '(進行):',
    cn: '(进行中):',
    ko: '시전중:',
};
// TODO: Duplicated in 'jobs'
const computeBackgroundColorFrom = (element, classList) => {
    const div = document.createElement('div');
    const classes = classList.split('.');
    for (const cls of classes)
        div.classList.add(cls);
    element.appendChild(div);
    const color = window.getComputedStyle(div).backgroundColor;
    element.removeChild(div);
    return color;
};
// This class reads the format of ACT Timeline plugin, described in
// docs/TimelineGuide.md
class Timeline {
    constructor(text, replacements, triggers, styles, options) {
        this.timebase = 0;
        this.nextEvent = 0;
        this.nextText = 0;
        this.nextSyncStart = 0;
        this.nextSyncEnd = 0;
        this.addTimerCallback = null;
        this.removeTimerCallback = null;
        this.showInfoTextCallback = null;
        this.showAlertTextCallback = null;
        this.showAlarmTextCallback = null;
        this.speakTTSCallback = null;
        this.triggerCallback = null;
        this.syncTimeCallback = null;
        this.updateTimer = 0;
        this.options = options || {};
        this.perTriggerAutoConfig = this.options['PerTriggerAutoConfig'] || {};
        this.replacements = replacements;
        const lang = this.options.TimelineLanguage || this.options.ParserLanguage || 'en';
        this.activeText = lang in activeText ? activeText[lang] : activeText['en'];
        // A set of names which will not be notified about.
        this.ignores = {};
        // Sorted by event occurrence time.
        this.events = [];
        // Sorted by event occurrence time.
        this.texts = [];
        // Sorted by sync.start time.
        this.syncStarts = [];
        // Sorted by sync.end time.
        this.syncEnds = [];
        // Not sorted.
        this.activeSyncs = [];
        // Sorted by event occurrence time.
        this.activeEvents = [];
        // Sorted by line.
        this.errors = [];
        this.LoadFile(text, triggers, styles);
        this.Stop();
    }
    GetReplacedHelper(text, replaceKey, replaceLang, isGlobal) {
        if (!this.replacements)
            return text;
        for (const r of this.replacements) {
            if (r.locale && r.locale !== replaceLang)
                continue;
            const reps = r[replaceKey];
            if (!reps)
                continue;
            for (const [key, value] of Object.entries(reps))
                text = text.replace(resources_regexes/* default.parse */.Z.parse(key), value);
        }
        // Common Replacements
        const replacement = commonReplacement[replaceKey];
        if (!replacement)
            return text;
        for (const [key, value] of Object.entries(replacement)) {
            const repl = value[replaceLang];
            if (!repl)
                continue;
            const regex = isGlobal ? resources_regexes/* default.parseGlobal */.Z.parseGlobal(key) : resources_regexes/* default.parse */.Z.parse(key);
            text = text.replace(regex, repl);
        }
        return text;
    }
    GetReplacedText(text) {
        if (!this.replacements)
            return text;
        const replaceLang = this.options.TimelineLanguage || this.options.ParserLanguage || 'en';
        const isGlobal = false;
        return this.GetReplacedHelper(text, 'replaceText', replaceLang, isGlobal);
    }
    GetReplacedSync(sync) {
        if (!this.replacements)
            return sync;
        const replaceLang = this.options.ParserLanguage || 'en';
        const isGlobal = true;
        return this.GetReplacedHelper(sync, 'replaceSync', replaceLang, isGlobal);
    }
    GetMissingTranslationsToIgnore() {
        return [
            '--Reset--',
            '--sync--',
            'Start',
            '^ ?21:',
            '^(\\(\\?\\<timestamp\\>\\^\\.\\{14\\}\\)) (1B|21|23):',
            '^(\\^\\.\\{14\\})? ?(1B|21|23):',
            '^::\\y{AbilityCode}:$',
            '^\\.\\*$',
        ].map((x) => resources_regexes/* default.parse */.Z.parse(x));
    }
    LoadFile(text, triggers, styles) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.events = [];
        this.syncStarts = [];
        this.syncEnds = [];
        let uniqueid = 1;
        const texts = {};
        const regexes = {
            comment: /^\s*#/,
            commentLine: /#.*$/,
            durationCommand: /(?:[^#]*?\s)?(?<text>duration\s+(?<seconds>[0-9]+(?:\.[0-9]+)?))(\s.*)?$/,
            ignore: /^hideall\s+\"(?<id>[^"]+)\"$/,
            jumpCommand: /(?:[^#]*?\s)?(?<text>jump\s+(?<seconds>[0-9]+(?:\.[0-9]+)?))(?:\s.*)?$/,
            line: /^(?<text>(?<time>[0-9]+(?:\.[0-9]+)?)\s+"(?<name>.*?)")(\s+(.*))?/,
            popupText: /^(?<type>info|alert|alarm)text\s+\"(?<id>[^"]+)\"\s+before\s+(?<beforeSeconds>-?[0-9]+(?:\.[0-9]+)?)(?:\s+\"(?<text>[^"]+)\")?$/,
            soundAlert: /^define\s+soundalert\s+"[^"]*"\s+"[^"]*"$/,
            speaker: /define speaker "[^"]*"(\s+"[^"]*")?\s+(-?[0-9]+(?:\.[0-9]+)?)\s+(-?[0-9]+(?:\.[0-9]+)?)/,
            syncCommand: /(?:[^#]*?\s)?(?<text>sync\s*\/(?<regex>.*)\/)(?<args>\s.*)?$/,
            tts: /^alertall\s+"(?<id>[^"]*)"\s+before\s+(?<beforeSeconds>-?[0-9]+(?:\.[0-9]+)?)\s+(?<command>sound|speak\s+"[^"]*")\s+"(?<text>[^"]*)"$/,
            windowCommand: /(?:[^#]*?\s)?(?<text>window\s+(?:(?<start>[0-9]+(?:\.[0-9]+)?),)?(?<end>[0-9]+(?:\.[0-9]+)?))(?:\s.*)?$/,
        };
        // Make all regexes case insensitive, and parse any special \y{} groups.
        for (const trigger of triggers !== null && triggers !== void 0 ? triggers : []) {
            if (trigger.regex)
                trigger.regex = resources_regexes/* default.parse */.Z.parse(trigger.regex);
        }
        const lines = text.split('\n');
        let lineNumber = 0;
        for (let line of lines) {
            ++lineNumber;
            line = line.trim();
            // Drop comments and empty lines.
            if (!line || regexes.comment.test(line))
                continue;
            const originalLine = line;
            let match = regexes.ignore.exec(line);
            if (match && match['groups']) {
                const ignore = match['groups'];
                if (ignore.id)
                    this.ignores[ignore.id] = true;
                continue;
            }
            match = regexes.tts.exec(line);
            if (match && match['groups']) {
                const tts = match['groups'];
                if (!tts.id || !tts.beforeSeconds || !tts.command)
                    throw new not_reached/* UnreachableCode */.$();
                // TODO: Support alert sounds?
                if (tts.command === 'sound')
                    continue;
                const ttsItems = texts[tts.id] || [];
                texts[tts.id] = ttsItems;
                ttsItems.push({
                    type: 'tts',
                    secondsBefore: parseFloat(tts.beforeSeconds),
                    text: tts.text ? tts.text : tts.id,
                });
                continue;
            }
            match = regexes.soundAlert.exec(line);
            if (match)
                continue;
            match = regexes.speaker.exec(line);
            if (match)
                continue;
            match = regexes.popupText.exec(line);
            if (match && match['groups']) {
                const popupText = match['groups'];
                if (!popupText.type || !popupText.id || !popupText.beforeSeconds)
                    throw new not_reached/* UnreachableCode */.$();
                const popupTextItems = texts[popupText.id] || [];
                texts[popupText.id] = popupTextItems;
                const type = popupText.type;
                if (type !== 'info' && type !== 'alert' && type !== 'alarm')
                    continue;
                popupTextItems.push({
                    type: type,
                    secondsBefore: parseFloat(popupText.beforeSeconds),
                    text: popupText.text ? popupText.text : popupText.id,
                });
                continue;
            }
            match = regexes.line.exec(line);
            if (!(match && match['groups'])) {
                this.errors.push({
                    lineNumber: lineNumber,
                    line: originalLine,
                    error: 'Invalid format',
                });
                console.log('Unknown timeline: ' + originalLine);
                continue;
            }
            const parsedLine = match['groups'];
            // Technically the name can be empty
            if (!parsedLine.text || !parsedLine.time || parsedLine.name === undefined)
                throw new not_reached/* UnreachableCode */.$();
            line = line.replace(parsedLine.text, '').trim();
            // There can be # in the ability name, but probably not in the regex.
            line = line.replace(regexes.commentLine, '').trim();
            const seconds = parseFloat(parsedLine.time);
            const e = {
                id: uniqueid++,
                time: seconds,
                // The original ability name in the timeline.  Used for hideall, infotext, etc.
                name: parsedLine.name,
                // The text to display.  Not used for any logic.
                text: this.GetReplacedText(parsedLine.name),
                activeTime: 0,
                lineNumber: lineNumber,
            };
            if (line) {
                let commandMatch = regexes.durationCommand.exec(line);
                if (commandMatch && commandMatch['groups']) {
                    const durationCommand = commandMatch['groups'];
                    if (!durationCommand.text || !durationCommand.seconds)
                        throw new not_reached/* UnreachableCode */.$();
                    line = line.replace(durationCommand.text, '').trim();
                    e.duration = parseFloat(durationCommand.seconds);
                }
                commandMatch = regexes.syncCommand.exec(line);
                if (commandMatch && commandMatch['groups']) {
                    const syncCommand = commandMatch['groups'];
                    if (!syncCommand.text || !syncCommand.regex)
                        throw new not_reached/* UnreachableCode */.$();
                    line = line.replace(syncCommand.text, '').trim();
                    const sync = {
                        id: uniqueid,
                        origRegexStr: syncCommand.regex,
                        regex: resources_regexes/* default.parse */.Z.parse(this.GetReplacedSync(syncCommand.regex)),
                        start: seconds - 2.5,
                        end: seconds + 2.5,
                        time: seconds,
                        lineNumber: lineNumber,
                    };
                    if (syncCommand.args) {
                        let argMatch = regexes.windowCommand.exec(syncCommand.args);
                        if (argMatch && argMatch['groups']) {
                            const windowCommand = argMatch['groups'];
                            if (!windowCommand.text || !windowCommand.end)
                                throw new not_reached/* UnreachableCode */.$();
                            line = line.replace(windowCommand.text, '').trim();
                            if (windowCommand.start) {
                                sync.start = seconds - parseFloat(windowCommand.start);
                                sync.end = seconds + parseFloat(windowCommand.end);
                            }
                            else {
                                sync.start = seconds - (parseFloat(windowCommand.end) / 2);
                                sync.end = seconds + (parseFloat(windowCommand.end) / 2);
                            }
                        }
                        argMatch = regexes.jumpCommand.exec(syncCommand.args);
                        if (argMatch && argMatch['groups']) {
                            const jumpCommand = argMatch['groups'];
                            if (!jumpCommand.text || !jumpCommand.seconds)
                                throw new not_reached/* UnreachableCode */.$();
                            line = line.replace(jumpCommand.text, '').trim();
                            sync.jump = parseFloat(jumpCommand.seconds);
                        }
                    }
                    this.syncStarts.push(sync);
                    this.syncEnds.push(sync);
                }
            }
            // If there's text left that isn't a comment then we didn't parse that text so report it.
            if (line && !regexes.comment.exec(line)) {
                console.log(`Unknown content '${line}' in timeline: ${originalLine}`);
                this.errors.push({
                    lineNumber: lineNumber,
                    line: originalLine,
                    error: 'Extra text',
                });
            }
            else {
                this.events.push(e);
            }
        }
        // Validate that all timeline triggers match something.
        for (const trigger of triggers !== null && triggers !== void 0 ? triggers : []) {
            let found = false;
            for (const event of this.events) {
                if (trigger.regex && trigger.regex.test(event.name)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                const text = `No match for timeline trigger ${(_b = (_a = trigger.regex) === null || _a === void 0 ? void 0 : _a.source) !== null && _b !== void 0 ? _b : ''} in ${(_c = trigger.id) !== null && _c !== void 0 ? _c : ''}`;
                this.errors.push({ error: text });
                console.error(`*** ERROR: ${text}`);
            }
        }
        for (const e of this.events) {
            for (const matchedTextEvent of (_d = texts[e.name]) !== null && _d !== void 0 ? _d : []) {
                const type = matchedTextEvent.type;
                if (type !== 'info' && type !== 'alert' && type !== 'alarm')
                    continue;
                this.texts.push({
                    type: type,
                    time: e.time - (matchedTextEvent.secondsBefore || 0),
                    text: (_e = matchedTextEvent.text) !== null && _e !== void 0 ? _e : '',
                });
            }
            // Rather than matching triggers at run time, pre-match all the triggers
            // against timeline text and insert them as text events to run.
            for (const trigger of triggers !== null && triggers !== void 0 ? triggers : []) {
                const m = (_f = trigger.regex) === null || _f === void 0 ? void 0 : _f.exec(e.name);
                if (!m)
                    continue;
                // TODO: beforeSeconds should support being a function.
                const autoConfig = trigger.id && this.perTriggerAutoConfig[trigger.id] || {};
                const beforeSeconds = (_g = autoConfig['BeforeSeconds']) !== null && _g !== void 0 ? _g : trigger.beforeSeconds;
                this.texts.push({
                    type: 'trigger',
                    time: e.time - (beforeSeconds || 0),
                    trigger: trigger,
                    matches: m,
                });
            }
            for (const style of styles !== null && styles !== void 0 ? styles : []) {
                if (!style.regex.test(e.name))
                    continue;
                e.style = style.style;
            }
        }
        // Sort by time, but when the time is the same, sort by file order.
        // Then assign a sortKey to each event so that we can maintain that order.
        this.events.sort((a, b) => {
            if (a.time === b.time)
                return a.id - b.id;
            return a.time - b.time;
        });
        this.events.forEach((event, idx) => event.sortKey = idx);
        this.texts.sort((a, b) => {
            return a.time - b.time;
        });
        this.syncStarts.sort((a, b) => {
            return a.start - b.start;
        });
        this.syncEnds.sort((a, b) => {
            return a.end - b.end;
        });
    }
    Stop() {
        this.timebase = 0;
        this.nextEvent = 0;
        this.nextText = 0;
        this.nextSyncStart = 0;
        this.nextSyncEnd = 0;
        const fightNow = 0;
        this._AdvanceTimeTo(fightNow);
        this._CollectActiveSyncs(fightNow);
        this._ClearTimers();
        this._CancelUpdate();
        if (this.syncTimeCallback)
            this.syncTimeCallback(fightNow, false);
    }
    SyncTo(fightNow, currentTime) {
        // This records the actual time which aligns with "0" in the timeline.
        const newTimebase = new Date(currentTime - fightNow * 1000).valueOf();
        // Skip syncs that are too close.  Many syncs happen on abilities that
        // hit 8 to 24 people, and so this is a lot of churn.
        if (Math.abs(newTimebase - this.timebase) <= 2)
            return;
        this.timebase = newTimebase;
        this.nextEvent = 0;
        this.nextText = 0;
        this.nextSyncStart = 0;
        this.nextSyncEnd = 0;
        // This will skip text events without running them.
        this._AdvanceTimeTo(fightNow);
        this._CollectActiveSyncs(fightNow);
        // Clear all timers except any synthetic duration events.
        // This is because if the sync goes even a hair into the future, then
        // the duration ending event will get dropped here.
        // FIXME: we could be smarter here and know ahead of time where all the duration
        // events are, so that we could skip ahead into the future where a duration
        // event has started but not expired and have that work properly.
        this._AddDurationTimers(fightNow);
        this._ClearExceptRunningDurationTimers(fightNow);
        this._AddUpcomingTimers(fightNow);
        this._CancelUpdate();
        this._ScheduleUpdate(fightNow);
        if (this.syncTimeCallback)
            this.syncTimeCallback(fightNow, true);
    }
    _CollectActiveSyncs(fightNow) {
        this.activeSyncs = [];
        for (let i = this.nextSyncEnd; i < this.syncEnds.length; ++i) {
            const syncEnd = this.syncEnds[i];
            if (syncEnd && syncEnd.start <= fightNow)
                this.activeSyncs.push(syncEnd);
        }
    }
    OnLogLine(line, currentTime) {
        for (const sync of this.activeSyncs) {
            if (line.search(sync.regex) >= 0) {
                if ('jump' in sync) {
                    if (!sync.jump)
                        this.Stop();
                    else
                        this.SyncTo(sync.jump, currentTime);
                }
                else {
                    this.SyncTo(sync.time, currentTime);
                }
                break;
            }
        }
    }
    _AdvanceTimeTo(fightNow) {
        let event = this.events[this.nextEvent];
        while (this.nextEvent < this.events.length && event && event.time <= fightNow)
            event = this.events[++this.nextEvent];
        let text = this.texts[this.nextText];
        while (this.nextText < this.texts.length && text && text.time <= fightNow)
            text = this.texts[++this.nextText];
        let syncStart = this.syncStarts[this.nextSyncStart];
        while (this.nextSyncStart < this.syncStarts.length && syncStart && syncStart.start <= fightNow)
            syncStart = this.syncStarts[++this.nextSyncStart];
        let syncEnd = this.syncEnds[this.nextSyncEnd];
        while (this.nextSyncEnd < this.syncEnds.length && syncEnd && syncEnd.end <= fightNow)
            syncEnd = this.syncEnds[++this.nextSyncEnd];
    }
    _ClearTimers() {
        if (this.removeTimerCallback) {
            for (const activeEvent of this.activeEvents)
                this.removeTimerCallback(activeEvent, false);
        }
        this.activeEvents = [];
    }
    _ClearExceptRunningDurationTimers(fightNow) {
        const durationEvents = [];
        for (const event of this.activeEvents) {
            if (event.isDur && event.time > fightNow) {
                durationEvents.push(event);
                continue;
            }
            if (this.removeTimerCallback)
                this.removeTimerCallback(event, false, true);
        }
        this.activeEvents = durationEvents;
    }
    _RemoveExpiredTimers(fightNow) {
        let activeEvent = this.activeEvents[0];
        while (this.activeEvents.length && activeEvent && activeEvent.time <= fightNow) {
            if (this.removeTimerCallback)
                this.removeTimerCallback(activeEvent, true);
            this.activeEvents.splice(0, 1);
            activeEvent = this.activeEvents[0];
        }
    }
    _AddDurationTimers(fightNow) {
        const events = [];
        for (let i = 0; i < this.activeEvents.length; ++i) {
            const e = this.activeEvents[i];
            if (e && e.time <= fightNow && e.duration) {
                const durationEvent = {
                    id: e.id,
                    time: e.time + e.duration,
                    sortKey: e.sortKey,
                    name: e.name,
                    text: `${this.activeText} ${e.text}`,
                    isDur: true,
                };
                events.push(durationEvent);
                this.activeEvents.splice(i, 1);
                if (this.addTimerCallback)
                    this.addTimerCallback(fightNow, durationEvent, true);
                --i;
            }
        }
        if (events.length)
            Array.prototype.push.apply(this.activeEvents, events);
        this.activeEvents.sort((a, b) => {
            return a.time - b.time;
        });
    }
    _AddUpcomingTimers(fightNow) {
        while (this.nextEvent < this.events.length &&
            this.activeEvents.length < this.options.MaxNumberOfTimerBars) {
            const e = this.events[this.nextEvent];
            if (!e)
                break;
            if (e.time - fightNow > this.options.ShowTimerBarsAtSeconds)
                break;
            if (fightNow < e.time && !(e.name in this.ignores)) {
                this.activeEvents.push(e);
                if (this.addTimerCallback)
                    this.addTimerCallback(fightNow, e, false);
            }
            ++this.nextEvent;
        }
    }
    _AddPassedTexts(fightNow) {
        while (this.nextText < this.texts.length) {
            const t = this.texts[this.nextText];
            if (!t)
                break;
            if (t.time > fightNow)
                break;
            if (t.type === 'info') {
                if (this.showInfoTextCallback)
                    this.showInfoTextCallback(t.text, this.timebase);
            }
            else if (t.type === 'alert') {
                if (this.showAlertTextCallback)
                    this.showAlertTextCallback(t.text, this.timebase);
            }
            else if (t.type === 'alarm') {
                if (this.showAlarmTextCallback)
                    this.showAlarmTextCallback(t.text, this.timebase);
            }
            else if (t.type === 'tts') {
                if (this.speakTTSCallback)
                    this.speakTTSCallback(t.text, this.timebase);
            }
            else if (t.type === 'trigger') {
                if (this.triggerCallback)
                    this.triggerCallback(t.trigger, t.matches, this.timebase);
            }
            ++this.nextText;
        }
    }
    _CancelUpdate() {
        if (this.updateTimer) {
            window.clearTimeout(this.updateTimer);
            this.updateTimer = 0;
        }
    }
    _ScheduleUpdate(fightNow) {
        console.assert(this.timebase, '_ScheduleUpdate called while stopped');
        let nextEventStarting = kBig;
        let nextTextOccurs = kBig;
        let nextEventEnding = kBig;
        let nextSyncStarting = kBig;
        let nextSyncEnding = kBig;
        if (this.nextEvent < this.events.length) {
            const nextEvent = this.events[this.nextEvent];
            if (nextEvent) {
                const nextEventEndsAt = nextEvent.time;
                console.assert(nextEventStarting > fightNow, 'nextEvent wasn\'t updated before calling _ScheduleUpdate');
                // There might be more events than we can show, so the next event might be in
                // the past. If that happens, then ignore it, as we can't use that for our timer.
                const showNextEventAt = nextEventEndsAt - this.options.ShowTimerBarsAtSeconds;
                if (showNextEventAt > fightNow)
                    nextEventStarting = showNextEventAt;
            }
        }
        if (this.nextText < this.texts.length) {
            const nextText = this.texts[this.nextText];
            if (nextText) {
                nextTextOccurs = nextText.time;
                console.assert(nextTextOccurs > fightNow, 'nextText wasn\'t updated before calling _ScheduleUpdate');
            }
        }
        if (this.activeEvents.length > 0) {
            const activeEvent = this.activeEvents[0];
            if (activeEvent) {
                nextEventEnding = activeEvent.time;
                console.assert(nextEventEnding > fightNow, 'Expired activeEvents weren\'t pruned before calling _ScheduleUpdate');
            }
        }
        if (this.nextSyncStart < this.syncStarts.length) {
            const syncStarts = this.syncStarts[this.nextSyncStart];
            if (syncStarts) {
                nextSyncStarting = syncStarts.start;
                console.assert(nextSyncStarting > fightNow, 'nextSyncStart wasn\'t updated before calling _ScheduleUpdate');
            }
        }
        if (this.nextSyncEnd < this.syncEnds.length) {
            const syncEnds = this.syncEnds[this.nextSyncEnd];
            if (syncEnds) {
                nextSyncEnding = syncEnds.end;
                console.assert(nextSyncEnding > fightNow, 'nextSyncEnd wasn\'t updated before calling _ScheduleUpdate');
            }
        }
        const nextTime = Math.min(nextEventStarting, nextEventEnding, nextTextOccurs, nextSyncStarting, nextSyncEnding);
        if (nextTime !== kBig) {
            console.assert(nextTime > fightNow, 'nextTime is in the past');
            this.updateTimer = window.setTimeout(() => {
                this._OnUpdateTimer(Date.now());
            }, (nextTime - fightNow) * 1000);
        }
    }
    _OnUpdateTimer(currentTime) {
        console.assert(this.timebase, '_OnTimerUpdate called while stopped');
        // This is the number of seconds into the fight (subtracting Dates gives milliseconds).
        const fightNow = (currentTime - this.timebase) / 1000;
        // Send text events now or they'd be skipped by _AdvanceTimeTo().
        this._AddPassedTexts(fightNow);
        this._AdvanceTimeTo(fightNow);
        this._CollectActiveSyncs(fightNow);
        this._AddDurationTimers(fightNow);
        this._RemoveExpiredTimers(fightNow);
        this._AddUpcomingTimers(fightNow);
        this._ScheduleUpdate(fightNow);
    }
    SetAddTimer(c) {
        this.addTimerCallback = c;
    }
    SetRemoveTimer(c) {
        this.removeTimerCallback = c;
    }
    SetShowInfoText(c) {
        this.showInfoTextCallback = c;
    }
    SetShowAlertText(c) {
        this.showAlertTextCallback = c;
    }
    SetShowAlarmText(c) {
        this.showAlarmTextCallback = c;
    }
    SetSpeakTTS(c) {
        this.speakTTSCallback = c;
    }
    SetTrigger(c) {
        this.triggerCallback = c;
    }
    SetSyncTime(c) {
        this.syncTimeCallback = c;
    }
}
class TimelineUI {
    constructor(options) {
        this.options = options;
        this.root = null;
        this.barColor = null;
        this.barExpiresSoonColor = null;
        this.timerlist = null;
        this.activeBars = {};
        this.expireTimers = {};
        this.debugElement = null;
        this.debugFightTimer = null;
        this.timeline = null;
        this.options = options;
        this.init = false;
        this.lang = this.options.TimelineLanguage || this.options.ParserLanguage || 'en';
        this.AddDebugInstructions();
    }
    Init() {
        if (this.init)
            return;
        this.init = true;
        this.root = document.getElementById('timeline-container');
        if (!this.root)
            throw new Error('can\'t find timeline-container');
        this.root.classList.add(`lang-${this.lang}`);
        if (this.options.Skin)
            this.root.classList.add(`skin-${this.options.Skin}`);
        this.barColor = computeBackgroundColorFrom(this.root, 'timeline-bar-color');
        this.barExpiresSoonColor = computeBackgroundColorFrom(this.root, 'timeline-bar-color.soon');
        this.timerlist = document.getElementById('timeline');
        if (this.timerlist)
            this.timerlist.style.gridTemplateRows = `repeat(${this.options.MaxNumberOfTimerBars}, min-content)`;
        this.activeBars = {};
        this.expireTimers = {};
    }
    AddDebugInstructions() {
        var _a;
        const lang = this.lang in timelineInstructions ? this.lang : 'en';
        const instructions = timelineInstructions[lang];
        // Helper for positioning/resizing when locked.
        const helper = document.getElementById('timeline-resize-helper');
        if (!helper)
            return;
        const rows = Math.max(6, this.options.MaxNumberOfTimerBars);
        helper.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        for (let i = 0; i < this.options.MaxNumberOfTimerBars; ++i) {
            const helperBar = document.createElement('div');
            if (!helperBar)
                continue;
            helperBar.classList.add('text');
            helperBar.classList.add('resize-helper-bar');
            helperBar.classList.add('timeline-bar-color');
            if (i < 1)
                helperBar.classList.add('soon');
            if (i < instructions.length)
                helperBar.innerText = (_a = instructions[i]) !== null && _a !== void 0 ? _a : '';
            else
                helperBar.innerText = `${i + 1}`;
            helper.appendChild(helperBar);
        }
        // For simplicity in code, always make debugElement valid,
        // however it does not exist in the raid emulator.
        this.debugElement = document.getElementById('timeline-debug');
        if (!this.debugElement)
            this.debugElement = document.createElement('div');
    }
    SetPopupTextInterface(popupText) {
        this.popupText = popupText;
    }
    SetTimeline(timeline) {
        this.Init();
        if (this.timeline) {
            this.timeline.SetAddTimer(null);
            this.timeline.SetRemoveTimer(null);
            this.timeline.SetShowInfoText(null);
            this.timeline.SetShowAlertText(null);
            this.timeline.SetShowAlarmText(null);
            this.timeline.SetSpeakTTS(null);
            this.timeline.SetTrigger(null);
            this.timeline.SetSyncTime(null);
            while (this.timerlist && this.timerlist.lastChild)
                this.timerlist.removeChild(this.timerlist.lastChild);
            if (this.debugElement)
                this.debugElement.innerHTML = '';
            this.debugFightTimer = null;
            this.activeBars = {};
        }
        this.timeline = timeline;
        if (this.timeline) {
            this.timeline.SetAddTimer(this.OnAddTimer.bind(this));
            this.timeline.SetRemoveTimer(this.OnRemoveTimer.bind(this));
            this.timeline.SetShowInfoText(this.OnShowInfoText.bind(this));
            this.timeline.SetShowAlertText(this.OnShowAlertText.bind(this));
            this.timeline.SetShowAlarmText(this.OnShowAlarmText.bind(this));
            this.timeline.SetSpeakTTS(this.OnSpeakTTS.bind(this));
            this.timeline.SetTrigger(this.OnTrigger.bind(this));
            this.timeline.SetSyncTime(this.OnSyncTime.bind(this));
        }
    }
    OnAddTimer(fightNow, e, channeling) {
        var _a, _b;
        const div = document.createElement('div');
        const bar = document.createElement('timer-bar');
        div.classList.add('timer-bar');
        div.appendChild(bar);
        bar.duration = `${channeling ? e.time - fightNow : this.options.ShowTimerBarsAtSeconds}`;
        bar.value = `${e.time - fightNow}`;
        bar.righttext = 'remain';
        bar.lefttext = e.text;
        bar.toward = 'right';
        bar.stylefill = !channeling ? 'fill' : 'empty';
        if (e.style)
            bar.applyStyles(e.style);
        if (!channeling && e.time - fightNow > this.options.BarExpiresSoonSeconds) {
            bar.fg = this.barColor;
            window.setTimeout(this.OnTimerExpiresSoon.bind(this, e.id), (e.time - fightNow - this.options.BarExpiresSoonSeconds) * 1000);
        }
        else {
            bar.fg = this.barExpiresSoonColor;
        }
        // Adding a timer with the same id immediately removes the previous.
        const activeBar = this.activeBars[e.id];
        if (activeBar) {
            const div = activeBar.parentNode;
            (_a = div === null || div === void 0 ? void 0 : div.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(div);
        }
        if (e.sortKey)
            div.style.order = e.sortKey.toString();
        div.id = e.id.toString();
        (_b = this.timerlist) === null || _b === void 0 ? void 0 : _b.appendChild(div);
        this.activeBars[e.id] = bar;
        if (e.id in this.expireTimers) {
            window.clearTimeout(this.expireTimers[e.id]);
            delete this.expireTimers[e.id];
        }
    }
    OnTimerExpiresSoon(id) {
        const bar = this.activeBars[id];
        if (bar)
            bar.fg = this.barExpiresSoonColor;
    }
    OnRemoveTimer(e, expired, force = false) {
        if (!force && expired && this.options.KeepExpiredTimerBarsForSeconds) {
            this.expireTimers[e.id] = window.setTimeout(this.OnRemoveTimer.bind(this, e, false), this.options.KeepExpiredTimerBarsForSeconds * 1000);
            return;
        }
        else if (e.id in this.expireTimers) {
            window.clearTimeout(this.expireTimers[e.id]);
            delete this.expireTimers[e.id];
        }
        const bar = this.activeBars[e.id];
        if (!bar)
            return;
        const div = bar.parentNode;
        const element = document.getElementById(e.id.toString());
        if (!element)
            return;
        const removeBar = () => {
            var _a;
            (_a = div === null || div === void 0 ? void 0 : div.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(div);
            delete this.activeBars[e.id];
        };
        if (!force)
            element.classList.add('animate-timer-bar-removed');
        if (window.getComputedStyle(element).animationName !== 'none') {
            // Wait for animation to finish
            element.addEventListener('animationend', removeBar);
        }
        else {
            removeBar();
        }
    }
    OnShowInfoText(text, currentTime) {
        if (this.popupText)
            this.popupText.Info(text, currentTime);
    }
    OnShowAlertText(text, currentTime) {
        if (this.popupText)
            this.popupText.Alert(text, currentTime);
    }
    OnShowAlarmText(text, currentTime) {
        if (this.popupText)
            this.popupText.Alarm(text, currentTime);
    }
    OnSpeakTTS(text, currentTime) {
        if (this.popupText)
            this.popupText.TTS(text, currentTime);
    }
    OnTrigger(trigger, matches, currentTime) {
        if (this.popupText)
            this.popupText.Trigger(trigger, matches, currentTime);
    }
    OnSyncTime(fightNow, running) {
        if (!this.options.Debug || !this.debugElement)
            return;
        if (!running) {
            if (this.debugFightTimer)
                this.debugElement.removeChild(this.debugFightTimer);
            this.debugFightTimer = null;
            return;
        }
        if (!this.debugFightTimer) {
            this.debugFightTimer = document.createElement('timer-bar');
            this.debugFightTimer.width = '100px';
            this.debugFightTimer.height = '17px';
            this.debugFightTimer.duration = `${kBig}`;
            this.debugFightTimer.lefttext = 'elapsed';
            this.debugFightTimer.toward = 'right';
            this.debugFightTimer.stylefill = 'fill';
            this.debugFightTimer.bg = 'transparent';
            this.debugFightTimer.fg = 'transparent';
            this.debugElement.appendChild(this.debugFightTimer);
        }
        // Force this to be reset.
        this.debugFightTimer.elapsed = '0';
        this.debugFightTimer.elapsed = fightNow.toString();
    }
}
class TimelineController {
    constructor(options, ui, raidbossDataFiles) {
        this.options = options;
        this.ui = ui;
        this.activeTimeline = null;
        this.options = options;
        this.ui = ui;
        this.timelines = {};
        for (const [filename, file] of Object.entries(raidbossDataFiles)) {
            if (!filename.endsWith('.txt'))
                continue;
            this.timelines[filename] = file;
        }
        // Used to suppress any Engage! if there's a wipe between /countdown and Engage!.
        this.suppressNextEngage = false;
        this.wipeRegex = resources_regexes/* default.network6d */.Z.network6d({ command: '40000010' });
    }
    SetPopupTextInterface(popupText) {
        this.ui.SetPopupTextInterface(popupText);
    }
    SetInCombat(inCombat) {
        // Wipe lines come before combat is false, but because OnLogEvent doesn't process
        // lines when out of combat, suppress any engages that come before the next countdown
        // just as a safety, especially for old ARR content where wipe lines don't happen.
        if (!inCombat)
            this.suppressNextEngage = true;
        if (!inCombat && this.activeTimeline)
            this.activeTimeline.Stop();
    }
    OnLogEvent(e) {
        if (!this.activeTimeline)
            return;
        const currentTime = Date.now();
        for (const log of e.detail.logs) {
            if (LocaleRegex.countdownStart[this.options.ParserLanguage].test(log)) {
                // As you can't start a countdown while in combat, the next engage is real.
                this.suppressNextEngage = false;
            }
            else if (LocaleRegex.countdownEngage[this.options.ParserLanguage].test(log)) {
                // If we see an engage after a wipe, but before combat has started otherwise
                // (e.g. countdown > wipe > face pull > engage), don't process this engage line
                if (this.suppressNextEngage)
                    continue;
            }
            else if (this.wipeRegex.test(log)) {
                // If we see a wipe, ignore the next engage.  If we see a countdown before that wipe,
                // we will clear this.  Therefore, this will only apply to active countdowns.
                this.suppressNextEngage = true;
            }
            this.activeTimeline.OnLogLine(log, currentTime);
        }
    }
    SetActiveTimeline(timelineFiles, timelines, replacements, triggers, styles) {
        this.activeTimeline = null;
        let text = '';
        // Get the text from each file in |timelineFiles|.
        for (const timelineFile of timelineFiles) {
            const name = this.timelines[timelineFile];
            if (name)
                text = `${text}\n${name}`;
            else
                console.log(`Timeline file not found: ${timelineFile}`);
        }
        // Append text from each block in |timelines|.
        for (const timeline of timelines)
            text = `${text}\n${timeline}`;
        if (text)
            this.activeTimeline = new Timeline(text, replacements, triggers, styles, this.options);
        this.ui.SetTimeline(this.activeTimeline);
    }
    IsReady() {
        return this.timelines !== null;
    }
}
class TimelineLoader {
    constructor(timelineController) {
        this.timelineController = timelineController;
        this.timelineController = timelineController;
    }
    SetTimelines(timelineFiles, timelines, replacements, triggers, styles) {
        this.timelineController.SetActiveTimeline(timelineFiles, timelines, replacements, triggers, styles);
    }
    IsReady() {
        return this.timelineController.IsReady();
    }
    StopCombat() {
        this.timelineController.SetInCombat(false);
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/overrides/RaidEmulatorTimeline.ts

class RaidEmulatorTimeline extends Timeline {
    constructor(text, replacements, triggers, styles, options) {
        super(text, replacements, triggers, styles, options);
        this.emulatedStatus = 'pause';
    }
    bindTo(emulator) {
        this.emulator = emulator;
        emulator.on('play', () => {
            this.emulatedStatus = 'play';
        });
        emulator.on('pause', () => {
            this.emulatedStatus = 'pause';
        });
    }
    emulatedSync(currentLogTime) {
        var _a, _b, _c;
        if (!currentLogTime)
            return;
        // This is a bit complicated due to jumps in timelines. If we've already got a timebase,
        // fightNow needs to be calculated based off of that instead of initialOffset
        // timebase = 0 when not set
        const baseTimestamp = this.timebase || ((_c = (_b = (_a = this.emulator) === null || _a === void 0 ? void 0 : _a.currentEncounter) === null || _b === void 0 ? void 0 : _b.encounter) === null || _c === void 0 ? void 0 : _c.initialTimestamp) ||
            currentLogTime;
        const fightNow = (currentLogTime - baseTimestamp) / 1000;
        this.SyncTo(fightNow, currentLogTime);
        this._OnUpdateTimer(currentLogTime);
    }
    _ScheduleUpdate(_fightNow) {
        // Override
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/overrides/RaidEmulatorTimelineController.ts


class RaidEmulatorTimelineController extends TimelineController {
    constructor() {
        super(...arguments);
        this.activeTimeline = null;
    }
    bindTo(emulator) {
        this.emulator = emulator;
        if (this.activeTimeline)
            this.activeTimeline.bindTo(emulator);
    }
    // Override
    SetActiveTimeline(timelineFiles, timelines, replacements, triggers, styles) {
        this.activeTimeline = null;
        let text = '';
        // Get the text from each file in |timelineFiles|.
        for (const timelineFile of timelineFiles) {
            const name = this.timelines[timelineFile];
            if (name)
                text = `${text}\n${name}`;
            else
                console.log(`Timeline file not found: ${timelineFile}`);
        }
        // Append text from each block in |timelines|.
        for (const timeline of timelines)
            text = `${text}\n${timeline}`;
        if (text) {
            this.activeTimeline =
                new RaidEmulatorTimeline(text, replacements, triggers, styles, this.options);
            if (this.emulator)
                this.activeTimeline.bindTo(this.emulator);
        }
        this.ui.SetTimeline(this.activeTimeline);
    }
    // Override
    OnLogEvent(e) {
        if (!this.activeTimeline)
            return;
        for (const line of e.detail.logs) {
            this.activeTimeline.OnLogLine(line.properCaseConvertedLine || line.convertedLine, line.timestamp);
            // Only call _OnUpdateTimer if we have a timebase from the previous call to OnLogLine
            // This avoids spamming the console with a ton of messages
            if (this.activeTimeline.timebase)
                this.activeTimeline._OnUpdateTimer(line.timestamp);
        }
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/overrides/StubbedPopupText.ts

class StubbedPopupText extends PopupText {
    constructor(options, timelineLoader, raidbossFileData) {
        super(options, timelineLoader, raidbossFileData);
    }
    HookOverlays() {
        // Stubbed, we don't want overlay hooks
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/PopupTextAnalysis.ts


class Resolver {
    constructor(status) {
        this.status = status;
    }
    async isResolved(log) {
        if (this.delayUntil) {
            if (this.delayUntil < log.timestamp) {
                delete this.delayUntil;
                if (this.delayResolver)
                    this.delayResolver();
                await this.delayPromise;
            }
            else {
                return false;
            }
        }
        if (this.promise)
            await this.promise;
        if (this.run)
            this.run();
        if (this.final)
            this.final();
        return true;
    }
    setDelay(delayUntil) {
        this.delayUntil = delayUntil;
        return this.delayPromise = new Promise((res) => {
            this.delayResolver = res;
        });
    }
    setPromise(promise) {
        this.promise = promise;
    }
    setRun(run) {
        this.run = run;
    }
    setFinal(final) {
        this.final = final;
    }
    setHelper(triggerHelper) {
        this.triggerHelper = triggerHelper;
    }
}
class PopupTextAnalysis extends StubbedPopupText {
    constructor() {
        super(...arguments);
        this.triggerResolvers = [];
    }
    // Override `OnTrigger` so we can use our own exception handler
    OnTrigger(trigger, matches, currentTime) {
        try {
            this.OnTriggerInternal(trigger, matches, currentTime);
        }
        catch (e) {
            console.log(trigger, e);
        }
    }
    async OnLog(e) {
        var _a, _b;
        for (const logObj of e.detail.logs) {
            const log = (_a = logObj.properCaseConvertedLine) !== null && _a !== void 0 ? _a : logObj.convertedLine;
            if (log.includes('00:0038:cactbot wipe'))
                this.SetInCombat(false);
            for (const trigger of this.triggers) {
                const r = (_b = trigger.localRegex) === null || _b === void 0 ? void 0 : _b.exec(log);
                if (!r)
                    continue;
                const resolver = this.currentResolver = new Resolver({
                    initialData: EmulatorCommon_EmulatorCommon.cloneData(this.data),
                    suppressed: false,
                    executed: false,
                });
                this.triggerResolvers.push(resolver);
                this.OnTrigger(trigger, r, logObj.timestamp);
                resolver.setFinal(() => {
                    var _a;
                    resolver.status.finalData = EmulatorCommon_EmulatorCommon.cloneData(this.data);
                    (_a = resolver.triggerHelper) === null || _a === void 0 ? true : delete _a.resolver;
                    if (this.callback)
                        this.callback(logObj, resolver.triggerHelper, resolver.status, this.data);
                });
            }
            await this.checkResolved(logObj);
        }
    }
    async OnNetLog(e) {
        var _a, _b;
        for (const logObj of e.detail.logs) {
            const log = logObj.networkLine;
            for (const trigger of this.netTriggers) {
                const r = (_a = trigger.localNetRegex) === null || _a === void 0 ? void 0 : _a.exec(log);
                if (r) {
                    const resolver = this.currentResolver = new Resolver({
                        initialData: EmulatorCommon_EmulatorCommon.cloneData(this.data),
                        suppressed: false,
                        executed: false,
                    });
                    this.triggerResolvers.push(resolver);
                    const matches = (_b = r.groups) !== null && _b !== void 0 ? _b : {};
                    this._onTriggerInternalGetHelper(trigger, matches, logObj.timestamp);
                    this.OnTrigger(trigger, r, logObj.timestamp);
                    resolver.setFinal(() => {
                        var _a;
                        resolver.status.finalData = EmulatorCommon_EmulatorCommon.cloneData(this.data);
                        (_a = resolver.triggerHelper) === null || _a === void 0 ? true : delete _a.resolver;
                        if (this.callback)
                            this.callback(logObj, resolver.triggerHelper, resolver.status, this.data);
                    });
                }
            }
            await this.checkResolved(logObj);
        }
    }
    async checkResolved(logObj) {
        await Promise.all(this.triggerResolvers.map(async (resolver) => await resolver.isResolved(logObj)))
            .then((results) => {
            this.triggerResolvers = this.triggerResolvers.filter((_, index) => !results[index]);
        });
    }
    _onTriggerInternalCondition(triggerHelper) {
        const ret = super._onTriggerInternalCondition(triggerHelper);
        if (triggerHelper.resolver)
            triggerHelper.resolver.status.condition = ret;
        return ret;
    }
    _onTriggerInternalDelaySeconds(triggerHelper) {
        var _a;
        // Can't inherit the default logic for delay since we don't
        // want to delay for mass processing of the timeline
        const delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;
        if (typeof delay === 'number') {
            if (triggerHelper.resolver)
                triggerHelper.resolver.status.delay = delay;
            if (!delay || delay <= 0)
                return;
            return (_a = triggerHelper.resolver) === null || _a === void 0 ? void 0 : _a.setDelay(triggerHelper.now + (delay * 1000));
        }
    }
    _onTriggerInternalPromise(triggerHelper) {
        const ret = super._onTriggerInternalPromise(triggerHelper);
        if (triggerHelper.resolver)
            triggerHelper.resolver.status.promise = ret;
        if (!ret)
            return ret;
        if (triggerHelper.resolver)
            triggerHelper.resolver.setPromise(ret);
        return;
    }
    _onTriggerInternalTTS(triggerHelper) {
        super._onTriggerInternalTTS(triggerHelper);
        if (triggerHelper.ttsText !== undefined &&
            triggerHelper.resolver &&
            triggerHelper.resolver.status.responseType === undefined) {
            triggerHelper.resolver.status.responseType = 'tts';
            triggerHelper.resolver.status.responseLabel = triggerHelper.ttsText;
        }
    }
    _onTriggerInternalRun(triggerHelper) {
        var _a;
        (_a = triggerHelper.resolver) === null || _a === void 0 ? void 0 : _a.setRun(() => {
            if (triggerHelper.resolver)
                triggerHelper.resolver.status.executed = true;
            super._onTriggerInternalRun(triggerHelper);
        });
    }
    _makeTextElement(triggerHelper, text, _className) {
        var _a;
        var _b;
        if (triggerHelper.resolver)
            (_a = (_b = triggerHelper.resolver.status).result) !== null && _a !== void 0 ? _a : (_b.result = text);
        return document.createElement('div');
    }
    _createTextFor(triggerHelper, text, textType, _lowerTextKey, _duration) {
        // No-op for functionality, but store off this info for feedback
        if (triggerHelper.resolver) {
            triggerHelper.resolver.status.responseType = textType;
            triggerHelper.resolver.status.responseLabel = text;
        }
    }
    _playAudioFile(triggerHelper, url, _volume) {
        // No-op for functionality, but store off this info for feedback
        if (triggerHelper.resolver) {
            // If we already have text and this is a default alert sound, don't override that info
            if (triggerHelper.resolver.status.responseType) {
                if (triggerHelper.resolver.status.responseType === 'info' &&
                    url === this.options.InfoSound)
                    return;
                if (triggerHelper.resolver.status.responseType === 'alert' &&
                    url === this.options.AlertSound)
                    return;
                if (triggerHelper.resolver.status.responseType === 'alarm' &&
                    url === this.options.AlarmSound)
                    return;
            }
            triggerHelper.resolver.status.responseType = 'audiofile';
            triggerHelper.resolver.status.responseLabel = url;
        }
    }
    _onTriggerInternalGetHelper(trigger, matches, now) {
        var _a;
        const ret = {
            ...super._onTriggerInternalGetHelper(trigger, matches, now),
        };
        ret.resolver = this.currentResolver;
        (_a = ret.resolver) === null || _a === void 0 ? void 0 : _a.setHelper(ret);
        return ret;
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/overrides/RaidEmulatorTimelineUI.ts



class RaidEmulatorTimelineUI extends TimelineUI {
    constructor(options) {
        super(options);
        this.emulatedTimerBars = [];
        this.emulatedStatus = 'pause';
        const container = document.querySelector('.timer-bar-container');
        if (!(container instanceof HTMLElement))
            throw new not_reached/* UnreachableCode */.$();
        this.$barContainer = container;
        const pTemplate = document.querySelector('template.progress');
        if (!(pTemplate instanceof HTMLTemplateElement))
            throw new not_reached/* UnreachableCode */.$();
        if (!(pTemplate.content.firstElementChild instanceof HTMLElement))
            throw new not_reached/* UnreachableCode */.$();
        this.$progressTemplate = pTemplate.content.firstElementChild;
    }
    bindTo(emulator) {
        emulator.on('tick', (currentLogTime, lastLogLineTime) => {
            for (const bar of this.emulatedTimerBars)
                this.updateBar(bar, currentLogTime);
            const toRemove = this.emulatedTimerBars
                .filter((bar) => bar.forceRemoveAt <= currentLogTime);
            for (const bar of toRemove)
                bar.$progress.remove();
            this.emulatedTimerBars = this.emulatedTimerBars.filter((bar) => {
                return bar.forceRemoveAt > currentLogTime;
            });
            this.timeline && this.timeline.timebase && this.timeline._OnUpdateTimer(lastLogLineTime);
        });
        emulator.on('play', () => {
            this.emulatedStatus = 'play';
            if (this.timeline instanceof RaidEmulatorTimeline)
                this.timeline.emulatedSync(emulator.currentLogTime);
        });
        emulator.on('pause', () => {
            this.emulatedStatus = 'pause';
        });
        emulator.on('preSeek', (_time) => {
            this.timeline && this.timeline.Stop();
            for (const bar of this.emulatedTimerBars)
                bar.$progress.remove();
            this.emulatedTimerBars = [];
        });
        emulator.on('postSeek', (currentLogTime) => {
            if (this.timeline instanceof RaidEmulatorTimeline)
                this.timeline.emulatedSync(currentLogTime);
            for (const bar of this.emulatedTimerBars)
                this.updateBar(bar, currentLogTime);
        });
        emulator.on('currentEncounterChanged', this.stop.bind(this));
    }
    stop() {
        this.timeline && this.timeline.Stop();
        for (const bar of this.emulatedTimerBars)
            bar.$progress.remove();
        this.emulatedTimerBars = [];
    }
    updateBar(bar, currentLogTime) {
        const barElapsed = currentLogTime - bar.start;
        let barProg = Math.min((barElapsed / bar.duration) * 100, 100);
        if (bar.style === 'empty')
            barProg = 100 - barProg;
        let rightText = ((bar.duration - barElapsed) / 1000).toFixed(1);
        if (barProg >= 100)
            rightText = '';
        bar.$leftLabel.textContent = bar.event.text;
        bar.$rightLabel.textContent = rightText;
        bar.$bar.style.width = `${barProg}%`;
    }
    Init() {
        // This space intentionally left blank
    }
    AddDebugInstructions() {
        // This space intentionally left blank
    }
    // Override
    OnAddTimer(fightNow, e, channeling) {
        if (!this.timeline)
            throw new not_reached/* UnreachableCode */.$();
        const end = this.timeline.timebase + (e.time * 1000);
        const start = end - (this.options.ShowTimerBarsAtSeconds * 1000);
        const $progress = this.$progressTemplate.cloneNode(true);
        if (!($progress instanceof HTMLElement))
            throw new not_reached/* UnreachableCode */.$();
        const $progBar = $progress.querySelector('.progress-bar');
        const $progLeft = $progress.querySelector('.timer-bar-left-label');
        const $progRight = $progress.querySelector('.timer-bar-right-label');
        if (!($progBar instanceof HTMLDivElement &&
            $progLeft instanceof HTMLElement &&
            $progRight instanceof HTMLElement))
            throw new not_reached/* UnreachableCode */.$();
        const bar = {
            $progress: $progress,
            $bar: $progBar,
            $leftLabel: $progLeft,
            $rightLabel: $progRight,
            start: start,
            style: !channeling ? 'fill' : 'empty',
            duration: (channeling ? e.time - fightNow : this.options.ShowTimerBarsAtSeconds) * 1000,
            event: e,
            forceRemoveAt: 0,
        };
        bar.forceRemoveAt = bar.start + bar.duration;
        if (this.options.KeepExpiredTimerBarsForSeconds)
            bar.forceRemoveAt += this.options.KeepExpiredTimerBarsForSeconds * 1000;
        this.emulatedTimerBars.push(bar);
        this.$barContainer.append(bar.$progress);
        this.updateBar(bar, bar.start);
    }
    // Override
    OnRemoveTimer(e, expired) {
        const bars = this.emulatedTimerBars.filter((bar) => bar.event.id === e.id);
        bars.forEach((bar) => {
            if (!this.timeline)
                throw new not_reached/* UnreachableCode */.$();
            bar.forceRemoveAt = this.timeline.timebase;
            if (expired && this.options.KeepExpiredTimerBarsForSeconds)
                bar.forceRemoveAt += this.options.KeepExpiredTimerBarsForSeconds * 1000;
        });
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/overrides/RaidEmulatorAnalysisTimelineUI.ts

class RaidEmulatorAnalysisTimelineUI extends RaidEmulatorTimelineUI {
    constructor(options) {
        super(options);
        // Use orphaned child div to prevent DOM updates
        this.$barContainer = document.createElement('div');
    }
    updateBar(_bar, _currentLogTime) {
        // Stubbed out for performance
    }
    OnAddTimer(_fightNow, _e, _channeling) {
        // Stubbed out for performance
    }
    OnRemoveTimer(_e, _expired) {
        // Stubbed out for performance
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/AnalyzedEncounter.js










class AnalyzedEncounter extends EventBus_EventBus {
  /**
   * @param {Encounter} encounter
   */
  constructor(options, encounter, emulator) {
    super();
    this.options = options;
    this.popupText = null;
    this.perspectives = {};
    this.encounter = encounter;
    this.emulator = emulator;
  }

  selectPerspective(ID) {
    const partyMember = this.encounter.combatantTracker.combatants[ID];
    this.popupText.partyTracker.onPartyChanged({
      party: this.encounter.combatantTracker.partyMembers.map(ID => {
        return {
          name: this.encounter.combatantTracker.combatants[ID].name,
          job: util/* default.jobToJobEnum */.Z.jobToJobEnum(this.encounter.combatantTracker.combatants[ID].job),
          inParty: true
        };
      })
    });
    this.popupText.OnPlayerChange({
      detail: {
        name: partyMember.name,
        job: partyMember.job,
        currentHP: partyMember.getState(this.encounter.logLines[0].timestamp).HP
      }
    });
    this.popupText.OnChangeZone({
      zoneName: this.encounter.encounterZoneName,
      zoneID: parseInt(this.encounter.encounterZoneId, 16)
    });
  }

  async analyze(popupText) {
    this.popupText = popupText; // @TODO: Make this run in parallel sometime in the future, since it could be really slow?

    for (const index in this.encounter.combatantTracker.partyMembers) await this.analyzeFor(this.encounter.combatantTracker.partyMembers[index]);

    this.dispatch('analyzed');
  }

  async analyzeFor(ID) {
    let currentLogIndex = 0;
    const partyMember = this.encounter.combatantTracker.combatants[ID];

    if (!partyMember.job) {
      this.perspectives[ID] = {
        initialData: {},
        triggers: []
      };
      return;
    }

    const timelineUI = new RaidEmulatorAnalysisTimelineUI(this.options);
    const timelineController = new RaidEmulatorTimelineController(this.options, timelineUI, raidboss_manifest/* default */.Z);
    timelineController.bindTo(this.emulator);
    const popupText = new PopupTextAnalysis(this.popupText.options, new TimelineLoader(timelineController), raidboss_manifest/* default */.Z);
    timelineUI.popupText = popupText;
    timelineController.SetPopupTextInterface(new PopupTextGenerator(popupText));
    popupText.partyTracker.onPartyChanged({
      party: this.encounter.combatantTracker.partyMembers.map(ID => {
        return {
          name: this.encounter.combatantTracker.combatants[ID].name,
          job: util/* default.jobToJobEnum */.Z.jobToJobEnum(this.encounter.combatantTracker.combatants[ID].job),
          inParty: true
        };
      })
    });
    popupText.OnPlayerChange({
      detail: {
        name: partyMember.name,
        job: partyMember.job,
        currentHP: partyMember.getState(this.encounter.logLines[0].timestamp).HP
      }
    });
    popupText.OnChangeZone({
      zoneName: this.encounter.encounterZoneName,
      zoneID: parseInt(this.encounter.encounterZoneId, 16)
    });

    if (timelineController.activeTimeline) {
      timelineController.activeTimeline.SetTrigger(async (trigger, matches) => {
        // Some async magic here, force waiting for the entirety of
        // the trigger execution before continuing
        const delayPromise = new Promise(res => {
          popupText.delayResolver = res;
        });
        const promisePromise = new Promise(res => {
          popupText.promiseResolver = res;
        });
        const runPromise = new Promise(res => {
          popupText.runResolver = res;
        });
        const currentLine = this.encounter.logLines[currentLogIndex];
        popupText.OnTrigger(trigger, matches, currentLine.timestamp);
        await delayPromise;
        await promisePromise;
        const triggerHelper = await runPromise;
        triggerHelper.resolver.status.finalData = EmulatorCommon_EmulatorCommon.cloneData(popupText.data);
        popupText.callback(currentLine, triggerHelper, triggerHelper.resolver.status);
      });
    }

    popupText.callback = (log, triggerHelper, currentTriggerStatus, finalData) => {
      this.perspectives[ID].triggers.push({
        triggerHelper: triggerHelper,
        status: currentTriggerStatus,
        logLine: log,
        resolvedOffset: log.timestamp - this.encounter.startTimestamp + currentTriggerStatus.delay * 1000
      });
    };

    popupText.triggerResolvers = [];
    this.perspectives[ID] = {
      initialData: EmulatorCommon_EmulatorCommon.cloneData(popupText.data, []),
      triggers: [],
      finalData: popupText.data
    };

    for (; currentLogIndex < this.encounter.logLines.length; ++currentLogIndex) {
      const log = this.encounter.logLines[currentLogIndex];
      await this.dispatch('analyzeLine', log);

      if (this.encounter.combatantTracker.combatants[ID].hasState(log.timestamp)) {
        popupText.OnPlayerChange({
          detail: {
            name: this.encounter.combatantTracker.combatants[ID].name,
            job: this.encounter.combatantTracker.combatants[ID].job,
            currentHP: this.encounter.combatantTracker.combatants[ID].getState(log.timestamp).HP
          }
        });
      }

      const event = {
        detail: {
          logs: [log]
        }
      };
      await popupText.OnLog(event);
      await popupText.OnNetLog(event);
      timelineController.OnLogEvent(event);
    }

    timelineUI.stop();
  }

}
;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/RaidEmulator.js


class RaidEmulator extends EventBus_EventBus {
  constructor(options) {
    super();
    this.options = options;
    this.encounters = [];
    this.currentEncounter = null;
    this.playingInterval = null;
    this.currentLogLineIndex = null;
    this.lastLogLineTime = null;
    this.lastTickTime = null;
  }

  addEncounter(encounter) {
    this.encounters.push(encounter);
  }

  setCurrent(index) {
    const enc = this.encounters[index]; // If language was autodetected from the encounter, set the current ParserLanguage
    // appropriately

    if (enc.language) this.options.ParserLanguage = enc.language;
    this.currentEncounter = new AnalyzedEncounter(this.options, enc, this);
    this.dispatch('preCurrentEncounterChanged', this.currentEncounter);
    this.currentEncounter.analyze(this.popupText).then(() => {
      this.dispatch('currentEncounterChanged', this.currentEncounter);
    });
  }

  setCurrentByID(id) {
    const index = this.encounters.findIndex(v => v.id === id);
    if (index === -1) return false;
    this.setCurrent(index);
    return true;
  }

  selectPerspective(ID) {
    this.currentEncounter.selectPerspective(ID);
    this.seekTo(this.currentLogTime);
  }

  play() {
    if (this.currentEncounter === null) return false;
    const firstIndex = this.currentEncounter.encounter.firstLineIndex;
    this.currentLogTime = this.currentLogTime || this.currentEncounter.encounter.logLines[firstIndex].timestamp;
    this.currentLogLineIndex = this.currentLogLineIndex || firstIndex - 1;
    this.lastTickTime = Date.now();
    this.playingInterval = window.setInterval(this.tick.bind(this), RaidEmulator.playbackSpeed);
    this.dispatch('play');
    return true;
  }

  pause() {
    window.clearInterval(this.playingInterval);
    this.lastTickTime = null;
    this.playingInterval = null;
    this.dispatch('pause');
    return true;
  }

  async seek(timeOffset) {
    const seekTimestamp = this.currentEncounter.encounter.startTimestamp + timeOffset;
    return await this.seekTo(seekTimestamp);
  }

  async seekTo(seekTimestamp) {
    await this.dispatch('preSeek', seekTimestamp);
    this.currentLogLineIndex = -1;
    let logs = [];
    const playing = this.playingInterval !== null;
    if (playing) this.pause();

    for (let i = this.currentLogLineIndex + 1; i < this.currentEncounter.encounter.logLines.length; ++i) {
      const line = this.currentEncounter.encounter.logLines[i];

      if (line.timestamp <= seekTimestamp) {
        logs.push(line); // Bunch emitted lines for performance reasons

        if (logs.length > 100) {
          await this.dispatch('emitLogs', {
            logs: logs
          });
          logs = [];
        }

        this.currentLogTime = this.lastLogLineTime = line.timestamp;
        ++this.currentLogLineIndex;
        await this.dispatch('midSeek', line);
        continue;
      }

      break;
    } // Emit any remaining lines if needed


    if (logs.length) {
      await this.dispatch('emitLogs', {
        logs: logs
      });
      await this.dispatch('midSeek', logs.pop());
    }

    await this.dispatch('postSeek', seekTimestamp);
    await this.dispatch('tick', this.currentLogTime, this.lastLogLineTime);
    if (playing) this.play();
  }

  async tick() {
    if (this.currentLogLineIndex + 1 >= this.currentEncounter.encounter.logLines.length) {
      this.pause();
      return;
    }

    if (this.playingInterval === null) return;
    const logs = [];
    const timeDiff = Date.now() - this.lastTickTime;
    const lastTimestamp = this.currentLogTime + timeDiff;

    for (let i = this.currentLogLineIndex + 1; i < this.currentEncounter.encounter.logLines.length; ++i) {
      if (this.currentEncounter.encounter.logLines[i].timestamp <= lastTimestamp) {
        logs.push(this.currentEncounter.encounter.logLines[i]);
        this.lastLogLineTime = this.currentEncounter.encounter.logLines[i].timestamp;
        ++this.currentLogLineIndex;
        continue;
      }

      break;
    }

    this.currentLogTime += timeDiff;
    this.lastTickTime += timeDiff;
    if (logs.length) await this.dispatch('emitLogs', {
      logs: logs
    });
    await this.dispatch('tick', this.currentLogTime, this.lastLogLineTime);
  }

  setPopupText(popupText) {
    this.popupText = popupText;
  }

}
RaidEmulator.playbackSpeed = 10;
;// CONCATENATED MODULE: ./ui/raidboss/emulator/overrides/RaidEmulatorOverlayApiHook.js

class RaidEmulatorOverlayApiHook {
  constructor(emulator) {
    this.emulator = emulator;
    this.originalCall = (0,overlay_plugin_api/* setCallOverlayHandlerOverride */.GL)(this.call.bind(this));
    this.currentLogTime = 0;
    emulator.on('tick', currentLogTime => {
      this.currentLogTime = currentLogTime;
    });
    emulator.on('preSeek', currentLogTime => {
      this.currentLogTime = 0;
    });
    emulator.on('preCurrentEncounterChanged', encounter => {
      this.currentLogTime = 0;
      encounter.on('analyzeLine', log => {
        this.currentLogTime = log.timestamp;
      });
    });
  }

  call(msg) {
    if (msg.call === 'getCombatants') {
      const tracker = this.emulator.currentEncounter.encounter.combatantTracker;
      const timestamp = this.currentLogTime;
      return new Promise(res => {
        const combatants = [];
        const hasIds = msg.ids !== undefined && msg.ids.length > 0;
        const hasNames = msg.names !== undefined && msg.names.length > 0;

        for (const [id, combatant] of Object.entries(tracker.combatants)) {
          // nextSignificantState is a bit inefficient but given that this isn't run every tick
          // we can afford to be a bit inefficient for readability's sake
          const combatantState = {
            ID: combatant.id,
            Name: combatant.name,
            Level: combatant.level,
            Job: combatant.job,
            ...combatant.nextSignificantState(timestamp).toPluginState()
          };
          if (!hasIds && !hasNames) combatants.push(combatantState);else if (hasIds && msg.ids.includes(parseInt(id, 16))) combatants.push(combatantState);else if (hasNames && msg.names.includes(tracker.combatants[id].name)) combatants.push(combatantState);
        } // @TODO: Move this to track properly on the Combatant object


        combatants.forEach(c => {
          const lines = this.emulator.currentEncounter.encounter.logLines.filter(l => l.decEvent === 3 && l.id === c.ID);

          if (lines.length > 0) {
            c.OwnerID = parseInt(lines[0].ownerId);
            c.BNpcNameID = parseInt(lines[0].npcNameId);
            c.BNpcID = parseInt(lines[0].npcBaseId);
          }
        });
        res({
          combatants: combatants
        });
      });
    }

    return this.originalCall(msg);
  }

}
;// CONCATENATED MODULE: ./ui/raidboss/emulator/overrides/RaidEmulatorPopupText.js

class RaidEmulatorPopupText extends StubbedPopupText {
  constructor(options, timelineLoader, raidbossFileData) {
    super(options, timelineLoader, raidbossFileData);
    this.$popupTextContainerWrapper = document.querySelector('.popup-text-container-outer');
    this.emulatedOffset = 0;
    this.emulator = null;
    this.displayedText = [];
    this.scheduledTriggers = [];
    this.seeking = false;
    this.$textElementTemplate = document.querySelector('template.textElement').content.firstElementChild;
    this.audioDebugTextDuration = 2000;
  }

  async doUpdate(currentLogTime) {
    this.emulatedOffset = currentLogTime;

    for (const t of this.scheduledTriggers) {
      const remaining = t.expires - currentLogTime;

      if (remaining <= 0) {
        t.resolver();
        await t.promise;
      }
    }

    this.scheduledTriggers = this.scheduledTriggers.filter(t => {
      return t.expires - currentLogTime > 0;
    });
    this.displayedText = this.displayedText.filter(t => {
      const remaining = t.expires - currentLogTime;

      if (remaining > 0) {
        t.element.querySelector('.popup-text-remaining').textContent = '(' + (remaining / 1000).toFixed(1) + ')';
        return true;
      }

      t.element.remove();
      return false;
    });
  }

  OnLog(logs) {
    for (const l of logs) {
      const log = l.properCaseConvertedLine || l.convertedLine;
      const currentTime = l.timestamp;
      if (log.includes('00:0038:cactbot wipe')) this.SetInCombat(false);

      for (const trigger of this.triggers) {
        const r = log.match(trigger.localRegex);
        if (r) this.OnTrigger(trigger, r, currentTime);
      }
    }
  }

  OnNetLog(logs) {
    for (const l of logs) {
      const log = l.networkLine;
      const currentTime = l.timestamp;

      for (const trigger of this.netTriggers) {
        const r = log.match(trigger.localNetRegex);
        if (r) this.OnTrigger(trigger, r, currentTime);
      }
    }
  }

  bindTo(emulator) {
    this.emulator = emulator;
    emulator.on('emitLogs', event => {
      this.OnLog(event.logs);
      this.OnNetLog(event.logs);
    });
    emulator.on('tick', async currentLogTime => {
      await this.doUpdate(currentLogTime);
    });
    emulator.on('midSeek', async line => {
      await this.doUpdate(line.timestamp);
    });
    emulator.on('preSeek', time => {
      this.seeking = true;

      this._emulatorReset();
    });
    emulator.on('postSeek', async time => {
      // This is a hacky fix for audio still playing during seek
      window.setTimeout(() => {
        this.seeking = false;
      }, 5);
    });
    emulator.on('currentEncounterChanged', () => {
      this._emulatorReset();

      this.OnChangeZone({
        zoneName: emulator.currentEncounter.encounter.encounterZoneName,
        zoneID: parseInt(emulator.currentEncounter.encounter.encounterZoneId, 16)
      });
    });
  }

  _emulatorReset() {
    for (const i of this.scheduledTriggers) i.rejecter();

    this.scheduledTriggers = [];
    this.displayedText = this.displayedText.filter(t => {
      t.element.remove();
      return false;
    });
    this.triggerSuppress = [];
  }

  _createTextFor(triggerHelper, text, textType, lowerTextKey, duration) {
    const textElementClass = textType + '-text';

    const e = this._makeTextElement(triggerHelper, text, textElementClass);

    this.addDisplayText(e, this.emulatedOffset + duration * 1000);
  }

  _onTriggerInternalDelaySeconds(triggerHelper) {
    const delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;
    if (!delay || delay <= 0) return null;
    let resolver;
    let rejecter;
    const ret = new Promise((res, rej) => {
      resolver = res;
      rejecter = rej;
    });
    this.scheduledTriggers.push({
      expires: this.emulatedOffset + delay * 1000,
      promise: ret,
      resolver: resolver,
      rejecter: rejecter
    });
    return ret;
  }

  _playAudioFile(triggerHelper, url, volume) {
    if (![this.options.InfoSound, this.options.AlertSound, this.options.AlarmSound].includes(url)) {
      const div = this._makeTextElement(triggerHelper, url, 'audio-file');

      this.addDisplayText(div, this.emulatedOffset + this.audioDebugTextDuration);
    }

    if (this.seeking) return;

    super._playAudioFile(triggerHelper, url, volume);
  }

  ttsSay(ttsText) {
    if (this.seeking) return;

    const div = this._makeTextElement(triggerHelper, ttsText, 'tts-text');

    this.addDisplayText(div, this.emulatedOffset + this.audioDebugTextDuration);
    super.ttsSay(ttsText);
  }

  _makeTextElement(triggerHelper, text, className) {
    const $ret = this.$textElementTemplate.cloneNode(true);
    $ret.classList.add(className);
    $ret.querySelector('.popup-text').textContent = text;
    return $ret;
  }

  addDisplayText($e, endTimestamp) {
    const remaining = (endTimestamp - this.emulatedOffset) / 1000;
    $e.querySelector('.popup-text-remaining').textContent = '(' + remaining.toFixed(1) + ')';
    this.$popupTextContainerWrapper.append($e);
    this.displayedText.push({
      element: $e,
      expires: endTimestamp
    });
  }

}
// EXTERNAL MODULE: ./node_modules/worker-loader/dist/runtime/inline.js
var inline = __webpack_require__(477);
;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/NetworkLogConverterWorker.js



function Worker_fn() {
  return inline("/******/ (() => { // webpackBootstrap\n/******/ \t\"use strict\";\nvar __webpack_exports__ = {};\n\n;// CONCATENATED MODULE: ./resources/regexes.ts\nconst startsUsingParams = ['timestamp', 'source', 'id', 'ability', 'target', 'capture'];\nconst abilityParams = ['timestamp', 'source', 'sourceId', 'id', 'ability', 'targetId', 'target', 'capture'];\nconst abilityFullParams = [\n    'timestamp',\n    'sourceId',\n    'source',\n    'id',\n    'ability',\n    'targetId',\n    'target',\n    'flags',\n    'flag0',\n    'flag1',\n    'flag2',\n    'flag3',\n    'flag4',\n    'flag5',\n    'flag6',\n    'flag7',\n    'flag8',\n    'flag9',\n    'flag10',\n    'flag11',\n    'flag12',\n    'flag13',\n    'flag14',\n    'targetHp',\n    'targetMaxHp',\n    'targetMp',\n    'targetMaxMp',\n    'targetX',\n    'targetY',\n    'targetZ',\n    'targetHeading',\n    'hp',\n    'maxHp',\n    'mp',\n    'maxMp',\n    'x',\n    'y',\n    'z',\n    'heading',\n    'capture',\n];\nconst headMarkerParams = ['timestamp', 'targetId', 'target', 'id', 'capture'];\nconst addedCombatantParams = ['timestamp', 'name', 'capture'];\nconst addedCombatantFullParams = [\n    'timestamp',\n    'id',\n    'name',\n    'job',\n    'level',\n    'hp',\n    'x',\n    'y',\n    'z',\n    'npcId',\n    'capture',\n];\nconst removingCombatantParams = [\n    'timestamp',\n    'id',\n    'name',\n    'hp',\n    'x',\n    'y',\n    'z',\n    'capture',\n];\nconst gainsEffectParams = ['timestamp', 'targetId', 'target', 'effect', 'source', 'duration', 'capture'];\nconst statusEffectExplicitParams = [\n    'timestamp',\n    'targetId',\n    'target',\n    'job',\n    'hp',\n    'maxHp',\n    'mp',\n    'maxMp',\n    'x',\n    'y',\n    'z',\n    'heading',\n    'data0',\n    'data1',\n    'data2',\n    'data3',\n    'data4',\n    'capture',\n];\nconst losesEffectParams = ['timestamp', 'targetId', 'target', 'effect', 'source', 'capture'];\nconst statChangeParams = [\n    'timestamp',\n    'job',\n    'strength',\n    'dexterity',\n    'vitality',\n    'intelligence',\n    'mind',\n    'piety',\n    'attackPower',\n    'directHit',\n    'criticalHit',\n    'attackMagicPotency',\n    'healMagicPotency',\n    'determination',\n    'skillSpeed',\n    'spellSpeed',\n    'tenacity',\n    'capture',\n];\nconst tetherParams = ['timestamp', 'source', 'sourceId', 'target', 'targetId', 'id', 'capture'];\nconst wasDefeatedParams = ['timestamp', 'target', 'source', 'capture'];\nconst hasHPParams = ['timestamp', 'name', 'hp', 'capture'];\nconst echoParams = ['timestamp', 'code', 'line', 'capture'];\nconst dialogParams = ['timestamp', 'code', 'line', 'name', 'capture'];\nconst messageParams = ['timestamp', 'code', 'line', 'capture'];\nconst gameLogParams = ['timestamp', 'code', 'line', 'capture'];\nconst gameNameLogParams = ['timestamp', 'code', 'name', 'line', 'capture'];\nconst changeZoneParams = ['timestamp', 'name', 'capture'];\nconst network6dParams = ['timestamp', 'instance', 'command', 'data0', 'data1', 'data2', 'data3', 'capture'];\nclass Regexes {\n    /**\n     * fields: source, id, ability, target, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting\n     */\n    static startsUsing(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'startsUsing', startsUsingParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        let str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 14:' +\n            Regexes.maybeCapture(capture, 'id', f.id, '\\\\y{AbilityCode}') + ':';\n        if (f.source || f.id || f.target || capture)\n            str += Regexes.maybeCapture(capture, 'source', f.source, '.*?') + ' starts using ';\n        if (f.ability || f.target || capture)\n            str += Regexes.maybeCapture(capture, 'ability', f.ability, '.*?') + ' on ';\n        if (f.target || capture)\n            str += Regexes.maybeCapture(capture, 'target', f.target, '.*?') + '\\\\.';\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: sourceId, source, id, ability, targetId, target, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability\n     */\n    static ability(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'ability', abilityParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        let str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 1[56]:' + Regexes.maybeCapture(capture, 'sourceId', '\\\\y{ObjectId}') + ':' +\n            Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':';\n        if (f.id || f.ability || f.target || f.targetId || capture)\n            str += Regexes.maybeCapture(capture, 'id', f.id, '\\\\y{AbilityCode}') + ':';\n        if (f.ability || f.target || f.targetId || capture)\n            str += Regexes.maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':';\n        if (f.target || f.targetId || capture)\n            str += Regexes.maybeCapture(capture, 'targetId', '\\\\y{ObjectId}') + ':';\n        if (f.target || capture)\n            str += Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':';\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: sourceId, source, id, ability, targetId, target, flags, x, y, z, heading, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability\n     */\n    static abilityFull(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'abilityFull', abilityFullParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 1[56]:' +\n            Regexes.maybeCapture(capture, 'sourceId', f.sourceId, '\\\\y{ObjectId}') + ':' +\n            Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'id', f.id, '\\\\y{AbilityCode}') + ':' +\n            Regexes.maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\\\y{ObjectId}') + ':' +\n            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flags', f.flags, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag0', f.flag0, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag1', f.flag1, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag2', f.flag2, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag3', f.flag3, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag4', f.flag4, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag5', f.flag5, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag6', f.flag6, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag7', f.flag7, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag8', f.flag8, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag9', f.flag9, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag10', f.flag10, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag11', f.flag11, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag12', f.flag12, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag13', f.flag13, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'flag14', f.flag13, '[^:]*?') + ':' +\n            Regexes.optional(Regexes.maybeCapture(capture, 'targetHp', f.targetHp, '\\\\y{Float}')) + ':' +\n            Regexes.optional(Regexes.maybeCapture(capture, 'targetMaxHp', f.targetMaxHp, '\\\\y{Float}')) + ':' +\n            Regexes.optional(Regexes.maybeCapture(capture, 'targetMp', f.targetMp, '\\\\y{Float}')) + ':' +\n            Regexes.optional(Regexes.maybeCapture(capture, 'targetMaxMp', f.targetMaxMp, '\\\\y{Float}')) + ':' +\n            Regexes.optional('\\\\y{Float}') + ':' + // Target TP\n            Regexes.optional('\\\\y{Float}') + ':' + // Target Max TP\n            Regexes.optional(Regexes.maybeCapture(capture, 'targetX', f.targetX, '\\\\y{Float}')) + ':' +\n            Regexes.optional(Regexes.maybeCapture(capture, 'targetY', f.targetY, '\\\\y{Float}')) + ':' +\n            Regexes.optional(Regexes.maybeCapture(capture, 'targetZ', f.targetZ, '\\\\y{Float}')) + ':' +\n            Regexes.optional(Regexes.maybeCapture(capture, 'targetHeading', f.targetHeading, '\\\\y{Float}')) + ':' +\n            Regexes.maybeCapture(capture, 'hp', f.hp, '\\\\y{Float}') + ':' +\n            Regexes.maybeCapture(capture, 'maxHp', f.maxHp, '\\\\y{Float}') + ':' +\n            Regexes.maybeCapture(capture, 'mp', f.mp, '\\\\y{Float}') + ':' +\n            Regexes.maybeCapture(capture, 'maxMp', f.maxMp, '\\\\y{Float}') + ':' +\n            '\\\\y{Float}:' + // Source TP\n            '\\\\y{Float}:' + // Source Max TP\n            Regexes.maybeCapture(capture, 'x', f.x, '\\\\y{Float}') + ':' +\n            Regexes.maybeCapture(capture, 'y', f.y, '\\\\y{Float}') + ':' +\n            Regexes.maybeCapture(capture, 'z', f.z, '\\\\y{Float}') + ':' +\n            Regexes.maybeCapture(capture, 'heading', f.heading, '\\\\y{Float}') + ':' +\n            '.*?$'; // Unknown last field\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: targetId, target, id, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1b-networktargeticon-head-markers\n     */\n    static headMarker(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'headMarker', headMarkerParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 1B:' +\n            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\\\y{ObjectId}') + ':' +\n            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':....:....:' +\n            Regexes.maybeCapture(capture, 'id', f.id, '....') + ':';\n        return Regexes.parse(str);\n    }\n    // fields: name, capture\n    // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant\n    static addedCombatant(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'addedCombatant', addedCombatantParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 03:\\\\y{ObjectId}:Added new combatant ' +\n            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\\\.';\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: id, name, hp, x, y, z, npcId, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant\n     */\n    static addedCombatantFull(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'addedCombatantFull', addedCombatantFullParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 03:' + Regexes.maybeCapture(capture, 'id', f.id, '\\\\y{ObjectId}') +\n            ':Added new combatant ' + Regexes.maybeCapture(capture, 'name', f.name, '[^:]*?') +\n            '\\\\. {2}Job: ' + Regexes.maybeCapture(capture, 'job', f.job, '[^:]*?') +\n            ' Level: ' + Regexes.maybeCapture(capture, 'level', f.level, '[^:]*?') +\n            ' Max HP: ' + Regexes.maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\\.' +\n            '.*?Pos: \\\\(' +\n            Regexes.maybeCapture(capture, 'x', f.x, '\\\\y{Float}') + ',' +\n            Regexes.maybeCapture(capture, 'y', f.y, '\\\\y{Float}') + ',' +\n            Regexes.maybeCapture(capture, 'z', f.z, '\\\\y{Float}') + '\\\\)' +\n            '(?: \\\\(' + Regexes.maybeCapture(capture, 'npcId', f.npcId, '.*?') + '\\\\))?\\\\.';\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: id, name, hp, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#04-removecombatant\n     */\n    static removingCombatant(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'removingCombatant', removingCombatantParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 04:' + Regexes.maybeCapture(capture, 'id', '\\\\y{ObjectId}') +\n            ':Removing combatant ' +\n            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\\\.' +\n            '.*?Max HP: ' + Regexes.maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\\.' +\n            Regexes.optional('.*?Pos: \\\\(' +\n                Regexes.maybeCapture(capture, 'x', f.x, '\\\\y{Float}') + ',' +\n                Regexes.maybeCapture(capture, 'y', f.y, '\\\\y{Float}') + ',' +\n                Regexes.maybeCapture(capture, 'z', f.z, '\\\\y{Float}') + '\\\\)');\n        return Regexes.parse(str);\n    }\n    // fields: targetId, target, effect, source, duration, capture\n    // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1a-networkbuff\n    static gainsEffect(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'gainsEffect', gainsEffectParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 1A:' +\n            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\\\y{ObjectId}') + ':' +\n            Regexes.maybeCapture(capture, 'target', f.target, '.*?') +\n            ' gains the effect of ' +\n            Regexes.maybeCapture(capture, 'effect', f.effect, '.*?') +\n            ' from ' +\n            Regexes.maybeCapture(capture, 'source', f.source, '.*?') +\n            ' for ' +\n            Regexes.maybeCapture(capture, 'duration', f.duration, '\\\\y{Float}') +\n            ' Seconds\\\\.';\n        return Regexes.parse(str);\n    }\n    /**\n     * Prefer gainsEffect over this function unless you really need extra data.\n     * fields: targetId, target, job, hp, maxHp, mp, maxMp, x, y, z, heading,\n     *         data0, data1, data2, data3, data4\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#26-networkstatuseffects\n     */\n    static statusEffectExplicit(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'statusEffectExplicit', statusEffectExplicitParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const kField = '.*?:';\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 26:' +\n            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\\\y{ObjectId}') + ':' +\n            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +\n            '[0-9A-F]{0,6}' + Regexes.maybeCapture(capture, 'job', f.job, '[0-9A-F]{0,2}') + ':' +\n            Regexes.maybeCapture(capture, 'hp', f.hp, '\\\\y{Float}') + ':' +\n            Regexes.maybeCapture(capture, 'maxHp', f.maxHp, '\\\\y{Float}') + ':' +\n            Regexes.maybeCapture(capture, 'mp', f.mp, '\\\\y{Float}') + ':' +\n            Regexes.maybeCapture(capture, 'maxMp', f.maxMp, '\\\\y{Float}') + ':' +\n            kField + // tp lol\n            kField + // max tp extra lol\n            // x, y, z heading may be blank\n            Regexes.optional(Regexes.maybeCapture(capture, 'x', f.x, '\\\\y{Float}')) + ':' +\n            Regexes.optional(Regexes.maybeCapture(capture, 'y', f.y, '\\\\y{Float}')) + ':' +\n            Regexes.optional(Regexes.maybeCapture(capture, 'z', f.z, '\\\\y{Float}')) + ':' +\n            Regexes.optional(Regexes.maybeCapture(capture, 'heading', f.heading, '\\\\y{Float}')) + ':' +\n            Regexes.maybeCapture(capture, 'data0', f.data0, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'data1', f.data1, '[^:]*?') + ':' +\n            // data2, 3, 4 may not exist and the line may terminate.\n            Regexes.optional(Regexes.maybeCapture(capture, 'data2', f.data2, '[^:]*?') + ':') +\n            Regexes.optional(Regexes.maybeCapture(capture, 'data3', f.data3, '[^:]*?') + ':') +\n            Regexes.optional(Regexes.maybeCapture(capture, 'data4', f.data4, '[^:]*?') + ':');\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: targetId, target, effect, source, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1e-networkbuffremove\n     */\n    static losesEffect(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'losesEffect', losesEffectParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 1E:' +\n            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\\\y{ObjectId}') + ':' +\n            Regexes.maybeCapture(capture, 'target', f.target, '.*?') +\n            ' loses the effect of ' +\n            Regexes.maybeCapture(capture, 'effect', f.effect, '.*?') +\n            ' from ' +\n            Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\\\.';\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: source, sourceId, target, targetId, id, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#23-networktether\n     */\n    static tether(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'tether', tetherParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 23:' +\n            Regexes.maybeCapture(capture, 'sourceId', f.sourceId, '\\\\y{ObjectId}') + ':' +\n            Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +\n            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\\\y{ObjectId}') + ':' +\n            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') +\n            ':....:....:' +\n            Regexes.maybeCapture(capture, 'id', f.id, '....') + ':';\n        return Regexes.parse(str);\n    }\n    /**\n     * 'target' was defeated by 'source'\n     * fields: target, source, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#19-networkdeath\n     */\n    static wasDefeated(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'wasDefeated', wasDefeatedParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 19:' +\n            Regexes.maybeCapture(capture, 'target', f.target, '.*?') +\n            ' was defeated by ' +\n            Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\\\.';\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: name, hp, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0d-combatanthp\n     */\n    static hasHP(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'hasHP', hasHPParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 0D:' +\n            Regexes.maybeCapture(capture, 'name', f.name, '.*?') +\n            ' HP at ' +\n            Regexes.maybeCapture(capture, 'hp', f.hp, '\\\\d+') + '%';\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: code, line, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline\n     */\n    static echo(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'echo', echoParams);\n        return Regexes.gameLog({\n            line: f.line,\n            capture: f.capture,\n            code: '0038',\n        });\n    }\n    /**\n     * fields: code, line, name, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline\n     */\n    static dialog(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'dialog', dialogParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 00:' +\n            Regexes.maybeCapture(capture, 'code', '0044') + ':' +\n            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + ':' +\n            Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: code, line, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline\n     */\n    static message(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'message', messageParams);\n        return Regexes.gameLog({\n            line: f.line,\n            capture: f.capture,\n            code: '0839',\n        });\n    }\n    /**\n     * fields: code, line, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline\n     */\n    static gameLog(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'gameLog', gameLogParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 00:' +\n            Regexes.maybeCapture(capture, 'code', f.code, '....') + ':' +\n            Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: code, name, line, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline\n     * Some game log lines have names in them, but not all.  All network log lines for these\n     * have empty fields, but these get dropped by the ACT FFXV plugin.\n     */\n    static gameNameLog(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'gameNameLog', gameNameLogParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 00:' +\n            Regexes.maybeCapture(capture, 'code', f.code, '....') + ':' +\n            Regexes.maybeCapture(capture, 'name', f.name, '[^:]*') + ':' +\n            Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: job, strength, dexterity, vitality, intelligence, mind, piety, attackPower,\n     *         directHit, criticalHit, attackMagicPotency, healMagicPotency, determination,\n     *         skillSpeed, spellSpeed, tenacity, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats\n     */\n    static statChange(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'statChange', statChangeParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 0C:Player Stats: ' +\n            Regexes.maybeCapture(capture, 'job', f.job, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'strength', f.strength, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'dexterity', f.dexterity, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'vitality', f.vitality, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'intelligence', f.intelligence, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'mind', f.mind, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'piety', f.piety, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'attackPower', f.attackPower, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'directHit', f.directHit, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'criticalHit', f.criticalHit, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'attackMagicPotency', f.attackMagicPotency, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'healMagicPotency', f.healMagicPotency, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'determination', f.determination, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'skillSpeed', f.skillSpeed, '\\\\d+') + ':' +\n            Regexes.maybeCapture(capture, 'spellSpeed', f.spellSpeed, '\\\\d+') +\n            ':0:' +\n            Regexes.maybeCapture(capture, 'tenacity', f.tenacity, '\\\\d+');\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: name, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#01-changezone\n     */\n    static changeZone(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'changeZone', changeZoneParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 01:Changed Zone to ' +\n            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\\\.';\n        return Regexes.parse(str);\n    }\n    /**\n     * fields: instance, command, data0, data1, data2, data3\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#21-network6d-actor-control-lines\n     */\n    static network6d(f) {\n        if (typeof f === 'undefined')\n            f = {};\n        Regexes.validateParams(f, 'network6d', network6dParams);\n        const capture = Regexes.trueIfUndefined(f.capture);\n        const str = Regexes.maybeCapture(capture, 'timestamp', '\\\\y{Timestamp}') +\n            ' 21:' +\n            Regexes.maybeCapture(capture, 'instance', f.instance, '.*?') + ':' +\n            Regexes.maybeCapture(capture, 'command', f.command, '.*?') + ':' +\n            Regexes.maybeCapture(capture, 'data0', f.data0, '.*?') + ':' +\n            Regexes.maybeCapture(capture, 'data1', f.data1, '.*?') + ':' +\n            Regexes.maybeCapture(capture, 'data2', f.data2, '.*?') + ':' +\n            Regexes.maybeCapture(capture, 'data3', f.data3, '.*?') + '$';\n        return Regexes.parse(str);\n    }\n    /**\n     * Helper function for building named capture group\n     */\n    static maybeCapture(capture, name, value, defaultValue) {\n        if (!value)\n            value = defaultValue;\n        value = Regexes.anyOf(value);\n        return capture ? Regexes.namedCapture(name, value) : value;\n    }\n    static optional(str) {\n        return `(?:${str})?`;\n    }\n    // Creates a named regex capture group named |name| for the match |value|.\n    static namedCapture(name, value) {\n        if (name.includes('>'))\n            console.error('\"' + name + '\" contains \">\".');\n        if (name.includes('<'))\n            console.error('\"' + name + '\" contains \">\".');\n        return '(?<' + name + '>' + value + ')';\n    }\n    /**\n     * Convenience for turning multiple args into a unioned regular expression.\n     * anyOf(x, y, z) or anyOf([x, y, z]) do the same thing, and return (?:x|y|z).\n     * anyOf(x) or anyOf(x) on its own simplifies to just x.\n     * args may be strings or RegExp, although any additional markers to RegExp\n     * like /insensitive/i are dropped.\n     */\n    static anyOf(...args) {\n        const anyOfArray = (array) => {\n            return `(?:${array.map((elem) => elem instanceof RegExp ? elem.source : elem).join('|')})`;\n        };\n        let array = [];\n        if (args.length === 1) {\n            if (Array.isArray(args[0]))\n                array = args[0];\n            else if (args[0])\n                array = [args[0]];\n            else\n                array = [];\n        }\n        else {\n            // TODO: more accurate type instead of `as` cast\n            array = args;\n        }\n        return anyOfArray(array);\n    }\n    static parse(regexpString) {\n        const kCactbotCategories = {\n            Timestamp: '^.{14}',\n            NetTimestamp: '.{33}',\n            NetField: '(?:[^|]*\\\\|)',\n            LogType: '[0-9A-Fa-f]{2}',\n            AbilityCode: '[0-9A-Fa-f]{1,8}',\n            ObjectId: '[0-9A-F]{8}',\n            // Matches any character name (including empty strings which the FFXIV\n            // ACT plugin can generate when unknown).\n            Name: '(?:[^\\\\s:|]+(?: [^\\\\s:|]+)?|)',\n            // Floats can have comma as separator in FFXIV plugin output: https://github.com/ravahn/FFXIV_ACT_Plugin/issues/137\n            Float: '-?[0-9]+(?:[.,][0-9]+)?(?:E-?[0-9]+)?',\n        };\n        // All regexes in cactbot are case insensitive.\n        // This avoids headaches as things like `Vice and Vanity` turns into\n        // `Vice And Vanity`, especially for French and German.  It appears to\n        // have a ~20% regex parsing overhead, but at least they work.\n        let modifiers = 'i';\n        if (regexpString instanceof RegExp) {\n            modifiers += (regexpString.global ? 'g' : '') +\n                (regexpString.multiline ? 'm' : '');\n            regexpString = regexpString.source;\n        }\n        regexpString = regexpString.replace(/\\\\y\\{(.*?)\\}/g, (match, group) => {\n            return kCactbotCategories[group] || match;\n        });\n        return new RegExp(regexpString, modifiers);\n    }\n    // Like Regex.Regexes.parse, but force global flag.\n    static parseGlobal(regexpString) {\n        const regex = Regexes.parse(regexpString);\n        let modifiers = 'gi';\n        if (regexpString instanceof RegExp)\n            modifiers += (regexpString.multiline ? 'm' : '');\n        return new RegExp(regex.source, modifiers);\n    }\n    static trueIfUndefined(value) {\n        if (typeof (value) === 'undefined')\n            return true;\n        return !!value;\n    }\n    static validateParams(f, funcName, params) {\n        if (f === null)\n            return;\n        if (typeof f !== 'object')\n            return;\n        const keys = Object.keys(f);\n        for (let k = 0; k < keys.length; ++k) {\n            const key = keys[k];\n            if (key && !params.includes(key)) {\n                throw new Error(`${funcName}: invalid parameter '${key}'.  ` +\n                    `Valid params: ${JSON.stringify(params)}`);\n            }\n        }\n    }\n}\n\n;// CONCATENATED MODULE: ./resources/netregexes.ts\n\n// Differences from Regexes:\n// * may have more fields\n// * AddedCombatant npc id is broken up into npcNameId and npcBaseId\n// * gameLog always splits name into its own field (but previously wouldn't)\nconst separator = '\\\\|';\nconst matchDefault = '[^|]*';\nconst netregexes_startsUsingParams = (/* unused pure expression or super */ null && (['timestamp', 'sourceId', 'source', 'id', 'ability', 'targetId', 'target', 'castTime']));\nconst netregexes_abilityParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'id', 'ability', 'targetId', 'target']));\nconst netregexes_abilityFullParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'id', 'ability', 'targetId', 'target', 'flags', 'damage', 'targetCurrentHp', 'targetMaxHp', 'x', 'y', 'z', 'heading']));\nconst netregexes_headMarkerParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'id']));\nconst netregexes_addedCombatantParams = (/* unused pure expression or super */ null && (['id', 'name']));\nconst netregexes_addedCombatantFullParams = (/* unused pure expression or super */ null && (['id', 'name', 'job', 'level', 'ownerId', 'world', 'npcNameId', 'npcBaseId', 'currentHp', 'hp', 'x', 'y', 'z', 'heading']));\nconst netregexes_removingCombatantParams = (/* unused pure expression or super */ null && (['id', 'name', 'hp']));\nconst netregexes_gainsEffectParams = (/* unused pure expression or super */ null && (['effectId', 'effect', 'duration', 'sourceId', 'source', 'targetId', 'target', 'count']));\nconst netregexes_statusEffectExplicitParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'hp', 'maxHp', 'x', 'y', 'z', 'heading', 'data0', 'data1', 'data2', 'data3', 'data4']));\nconst netregexes_losesEffectParams = (/* unused pure expression or super */ null && (['effectId', 'effect', 'sourceId', 'source', 'targetId', 'target', 'count']));\nconst netregexes_tetherParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'targetId', 'target', 'id']));\nconst netregexes_wasDefeatedParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'sourceId', 'source']));\nconst netregexes_echoParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));\nconst netregexes_dialogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));\nconst netregexes_messageParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));\nconst netregexes_gameLogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));\nconst netregexes_gameNameLogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));\nconst netregexes_statChangeParams = (/* unused pure expression or super */ null && (['job', 'strength', 'dexterity', 'vitality', 'intelligence', 'mind', 'piety', 'attackPower', 'directHit', 'criticalHit', 'attackMagicPotency', 'healMagicPotency', 'determination', 'skillSpeed', 'spellSpeed', 'tenacity']));\nconst netregexes_changeZoneParams = (/* unused pure expression or super */ null && (['id', 'name']));\nconst netregexes_network6dParams = (/* unused pure expression or super */ null && (['instance', 'command', 'data0', 'data1', 'data2', 'data3']));\nconst nameToggleParams = (/* unused pure expression or super */ null && (['id', 'name', 'toggle']));\n// If NetRegexes.setFlagTranslationsNeeded is set to true, then any\n// regex created that requires a translation will begin with this string\n// and match the magicStringRegex.  This is maybe a bit goofy, but is\n// a pretty straightforward way to mark regexes for translations.\n// If issue #1306 is ever resolved, we can remove this.\nconst magicTranslationString = `^^`;\nconst magicStringRegex = /^\\^\\^/;\nconst keysThatRequireTranslation = [\n    'ability',\n    'name',\n    'source',\n    'target',\n    'line',\n];\nconst parseHelper = (params, funcName, fields) => {\n    var _a, _b, _c, _d, _e, _f;\n    params = params !== null && params !== void 0 ? params : {};\n    const validFields = [];\n    for (const value of Object.values(fields)) {\n        if (typeof value !== 'object')\n            continue;\n        validFields.push(value.field);\n    }\n    Regexes.validateParams(params, funcName, ['capture', ...validFields]);\n    // Find the last key we care about, so we can shorten the regex if needed.\n    const capture = Regexes.trueIfUndefined(params.capture);\n    const fieldKeys = Object.keys(fields);\n    let maxKey;\n    if (capture) {\n        maxKey = fieldKeys[fieldKeys.length - 1];\n    }\n    else {\n        maxKey = 0;\n        for (const key of fieldKeys) {\n            const value = (_a = fields[key]) !== null && _a !== void 0 ? _a : {};\n            if (typeof value !== 'object')\n                continue;\n            const fieldName = (_b = fields[key]) === null || _b === void 0 ? void 0 : _b.field;\n            if (fieldName && fieldName in params)\n                maxKey = key;\n        }\n    }\n    // For testing, it's useful to know if this is a regex that requires\n    // translation.  We test this by seeing if there are any specified\n    // fields, and if so, inserting a magic string that we can detect.\n    // This lets us differentiate between \"regex that should be translated\"\n    // e.g. a regex with `target` specified, and \"regex that shouldn't\"\n    // e.g. a gains effect with just effectId specified.\n    const transParams = Object.keys(params).filter((k) => keysThatRequireTranslation.includes(k));\n    const needsTranslations = NetRegexes.flagTranslationsNeeded && transParams.length > 0;\n    // Build the regex from the fields.\n    let str = needsTranslations ? magicTranslationString : '^';\n    let lastKey = -1;\n    for (const _key in fields) {\n        const key = parseInt(_key);\n        // Fill in blanks.\n        const missingFields = key - lastKey - 1;\n        if (missingFields === 1)\n            str += '\\\\y{NetField}';\n        else if (missingFields > 1)\n            str += `\\\\y{NetField}{${missingFields}}`;\n        lastKey = key;\n        const value = fields[key];\n        if (typeof value !== 'object')\n            throw new Error(`${funcName}: invalid value: ${JSON.stringify(value)}`);\n        const fieldName = (_c = fields[key]) === null || _c === void 0 ? void 0 : _c.field;\n        const fieldValue = (_f = (_e = (_d = fields[key]) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : matchDefault;\n        if (fieldName) {\n            str += Regexes.maybeCapture(\n            // more accurate type instead of `as` cast\n            // maybe this function needs a refactoring\n            capture, fieldName, params[fieldName], fieldValue) +\n                separator;\n        }\n        else {\n            str += fieldValue + separator;\n        }\n        // Stop if we're not capturing and don't care about future fields.\n        if (key >= (maxKey !== null && maxKey !== void 0 ? maxKey : 0))\n            break;\n    }\n    return Regexes.parse(str);\n};\nclass NetRegexes {\n    static setFlagTranslationsNeeded(value) {\n        NetRegexes.flagTranslationsNeeded = value;\n    }\n    static doesNetRegexNeedTranslation(regex) {\n        // Need to `setFlagTranslationsNeeded` before calling this function.\n        console.assert(NetRegexes.flagTranslationsNeeded);\n        const str = typeof regex === 'string' ? regex : regex.source;\n        return !!magicStringRegex.exec(str);\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting\n     */\n    static startsUsing(params) {\n        return parseHelper(params, 'startsUsing', {\n            0: { field: 'type', value: '20' },\n            1: { field: 'timestamp' },\n            2: { field: 'sourceId' },\n            3: { field: 'source' },\n            4: { field: 'id' },\n            5: { field: 'ability' },\n            6: { field: 'targetId' },\n            7: { field: 'target' },\n            8: { field: 'castTime' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability\n     */\n    static ability(params) {\n        return parseHelper(params, 'ability', {\n            0: { field: 'type', value: '2[12]' },\n            1: { field: 'timestamp' },\n            2: { field: 'sourceId' },\n            3: { field: 'source' },\n            4: { field: 'id' },\n            5: { field: 'ability' },\n            6: { field: 'targetId' },\n            7: { field: 'target' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability\n     */\n    static abilityFull(params) {\n        return parseHelper(params, 'abilityFull', {\n            0: { field: 'type', value: '2[12]' },\n            1: { field: 'timestamp' },\n            2: { field: 'sourceId' },\n            3: { field: 'source' },\n            4: { field: 'id' },\n            5: { field: 'ability' },\n            6: { field: 'targetId' },\n            7: { field: 'target' },\n            8: { field: 'flags' },\n            9: { field: 'damage' },\n            24: { field: 'targetCurrentHp' },\n            25: { field: 'targetMaxHp' },\n            40: { field: 'x' },\n            41: { field: 'y' },\n            42: { field: 'z' },\n            43: { field: 'heading' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1b-networktargeticon-head-markers\n     */\n    static headMarker(params) {\n        return parseHelper(params, 'headMarker', {\n            0: { field: 'type', value: '27' },\n            1: { field: 'timestamp' },\n            2: { field: 'targetId' },\n            3: { field: 'target' },\n            6: { field: 'id' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant\n     */\n    static addedCombatant(params) {\n        return parseHelper(params, 'addedCombatant', {\n            0: { field: 'type', value: '03' },\n            1: { field: 'timestamp' },\n            2: { field: 'id' },\n            3: { field: 'name' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant\n     */\n    static addedCombatantFull(params) {\n        return parseHelper(params, 'addedCombatantFull', {\n            0: { field: 'type', value: '03' },\n            1: { field: 'timestamp' },\n            2: { field: 'id' },\n            3: { field: 'name' },\n            4: { field: 'job' },\n            5: { field: 'level' },\n            6: { field: 'ownerId' },\n            8: { field: 'world' },\n            9: { field: 'npcNameId' },\n            10: { field: 'npcBaseId' },\n            11: { field: 'currentHp' },\n            12: { field: 'hp' },\n            17: { field: 'x' },\n            18: { field: 'y' },\n            19: { field: 'z' },\n            20: { field: 'heading' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#04-removecombatant\n     */\n    static removingCombatant(params) {\n        return parseHelper(params, 'removingCombatant', {\n            0: { field: 'type', value: '04' },\n            1: { field: 'timestamp' },\n            2: { field: 'id' },\n            3: { field: 'name' },\n            12: { field: 'hp' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1a-networkbuff\n     */\n    static gainsEffect(params) {\n        return parseHelper(params, 'gainsEffect', {\n            0: { field: 'type', value: '26' },\n            1: { field: 'timestamp' },\n            2: { field: 'effectId' },\n            3: { field: 'effect' },\n            4: { field: 'duration' },\n            5: { field: 'sourceId' },\n            6: { field: 'source' },\n            7: { field: 'targetId' },\n            8: { field: 'target' },\n            9: { field: 'count' },\n        });\n    }\n    /**\n     * Prefer gainsEffect over this function unless you really need extra data.\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#26-networkstatuseffects\n     */\n    static statusEffectExplicit(params) {\n        return parseHelper(params, 'statusEffectExplicit', {\n            0: { field: 'type', value: '38' },\n            1: { field: 'timestamp' },\n            2: { field: 'targetId' },\n            3: { field: 'target' },\n            5: { field: 'hp' },\n            6: { field: 'maxHp' },\n            11: { field: 'x' },\n            12: { field: 'y' },\n            13: { field: 'z' },\n            14: { field: 'heading' },\n            15: { field: 'data0' },\n            16: { field: 'data1' },\n            17: { field: 'data2' },\n            18: { field: 'data3' },\n            19: { field: 'data4' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1e-networkbuffremove\n     */\n    static losesEffect(params) {\n        return parseHelper(params, 'losesEffect', {\n            0: { field: 'type', value: '30' },\n            1: { field: 'timestamp' },\n            2: { field: 'effectId' },\n            3: { field: 'effect' },\n            5: { field: 'sourceId' },\n            6: { field: 'source' },\n            7: { field: 'targetId' },\n            8: { field: 'target' },\n            9: { field: 'count' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#23-networktether\n     */\n    static tether(params) {\n        return parseHelper(params, 'tether', {\n            0: { field: 'type', value: '35' },\n            1: { field: 'timestamp' },\n            2: { field: 'sourceId' },\n            3: { field: 'source' },\n            4: { field: 'targetId' },\n            5: { field: 'target' },\n            8: { field: 'id' },\n        });\n    }\n    /**\n     * 'target' was defeated by 'source'\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#19-networkdeath\n     */\n    static wasDefeated(params) {\n        return parseHelper(params, 'wasDefeated', {\n            0: { field: 'type', value: '25' },\n            1: { field: 'timestamp' },\n            2: { field: 'targetId' },\n            3: { field: 'target' },\n            4: { field: 'sourceId' },\n            5: { field: 'source' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline\n     */\n    static echo(params) {\n        if (typeof params === 'undefined')\n            params = {};\n        Regexes.validateParams(params, 'echo', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);\n        params.code = '0038';\n        return NetRegexes.gameLog(params);\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline\n     */\n    static dialog(params) {\n        if (typeof params === 'undefined')\n            params = {};\n        Regexes.validateParams(params, 'dialog', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);\n        params.code = '0044';\n        return NetRegexes.gameLog(params);\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline\n     */\n    static message(params) {\n        if (typeof params === 'undefined')\n            params = {};\n        Regexes.validateParams(params, 'message', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);\n        params.code = '0839';\n        return NetRegexes.gameLog(params);\n    }\n    /**\n     * fields: code, name, line, capture\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline\n     */\n    static gameLog(params) {\n        return parseHelper(params, 'gameLog', {\n            0: { field: 'type', value: '00' },\n            1: { field: 'timestamp' },\n            2: { field: 'code' },\n            3: { field: 'name' },\n            4: { field: 'line' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline\n     */\n    static gameNameLog(params) {\n        // for compat with Regexes.\n        return NetRegexes.gameLog(params);\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats\n     */\n    static statChange(params) {\n        return parseHelper(params, 'statChange', {\n            0: { field: 'type', value: '12' },\n            1: { field: 'timestamp' },\n            2: { field: 'job' },\n            3: { field: 'strength' },\n            4: { field: 'dexterity' },\n            5: { field: 'vitality' },\n            6: { field: 'intelligence' },\n            7: { field: 'mind' },\n            8: { field: 'piety' },\n            9: { field: 'attackPower' },\n            10: { field: 'directHit' },\n            11: { field: 'criticalHit' },\n            12: { field: 'attackMagicPotency' },\n            13: { field: 'healMagicPotency' },\n            14: { field: 'determination' },\n            15: { field: 'skillSpeed' },\n            16: { field: 'spellSpeed' },\n            18: { field: 'tenacity' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#01-changezone\n     */\n    static changeZone(params) {\n        return parseHelper(params, 'changeZone', {\n            0: { field: 'type', value: '01' },\n            1: { field: 'timestamp' },\n            2: { field: 'id' },\n            3: { field: 'name' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#21-network6d-actor-control-lines\n     */\n    static network6d(params) {\n        return parseHelper(params, 'network6d', {\n            0: { field: 'type', value: '33' },\n            1: { field: 'timestamp' },\n            2: { field: 'instance' },\n            3: { field: 'command' },\n            4: { field: 'data0' },\n            5: { field: 'data1' },\n            6: { field: 'data2' },\n            7: { field: 'data3' },\n        });\n    }\n    /**\n     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#22-networknametoggle\n     */\n    static nameToggle(params) {\n        return parseHelper(params, 'nameToggle', {\n            0: { field: 'type', value: '34' },\n            1: { field: 'timestamp' },\n            2: { field: 'id' },\n            3: { field: 'name' },\n            6: { field: 'toggle' },\n        });\n    }\n}\nNetRegexes.flagTranslationsNeeded = false;\n\n;// CONCATENATED MODULE: ./resources/translations.ts\n\n\n// Fill in LocaleRegex so that things like LocaleRegex.countdownStart.de is a valid regex.\nconst localeLines = {\n    countdownStart: {\n        en: 'Battle commencing in (?<time>\\\\y{Float}) seconds! \\\\((?<player>.*?)\\\\)',\n        de: 'Noch (?<time>\\\\y{Float}) Sekunden bis Kampfbeginn! \\\\((?<player>.*?)\\\\)',\n        fr: 'Début du combat dans (?<time>\\\\y{Float}) secondes[ ]?! \\\\((?<player>.*?)\\\\)',\n        ja: '戦闘開始まで(?<time>\\\\y{Float})秒！ \\\\((?<player>.*?)\\\\)',\n        cn: '距离战斗开始还有(?<time>\\\\y{Float})秒！ （(?<player>.*?)）',\n        ko: '전투 시작 (?<time>\\\\y{Float})초 전! \\\\((?<player>.*?)\\\\)',\n    },\n    countdownEngage: {\n        en: 'Engage!',\n        de: 'Start!',\n        fr: 'À l\\'attaque[ ]?!',\n        ja: '戦闘開始！',\n        cn: '战斗开始！',\n        ko: '전투 시작!',\n    },\n    countdownCancel: {\n        en: 'Countdown canceled by (?<player>\\\\y{Name})',\n        de: '(?<player>\\\\y{Name}) hat den Countdown abgebrochen',\n        fr: 'Le compte à rebours a été interrompu par (?<player>\\\\y{Name})[ ]?\\\\.',\n        ja: '(?<player>\\\\y{Name})により、戦闘開始カウントがキャンセルされました。',\n        cn: '(?<player>\\\\y{Name})取消了战斗开始倒计时。',\n        ko: '(?<player>\\\\y{Name}) 님이 초읽기를 취소했습니다\\\\.',\n    },\n    areaSeal: {\n        en: '(?<area>.*?) will be sealed off in (?<time>\\\\y{Float}) seconds!',\n        de: 'Noch (?<time>\\\\y{Float}) Sekunden, bis sich (?<area>.*?) schließt',\n        fr: 'Fermeture (?<area>.*?) dans (?<time>\\\\y{Float}) secondes[ ]?\\\\.',\n        ja: '(?<area>.*?)の封鎖まであと(?<time>\\\\y{Float})秒',\n        cn: '距(?<area>.*?)被封锁还有(?<time>\\\\y{Float})秒',\n        ko: '(?<time>\\\\y{Float})초 후에 (?<area>.*?)(이|가) 봉쇄됩니다\\\\.',\n    },\n    areaUnseal: {\n        en: '(?<area>.*?) is no longer sealed.',\n        de: '(?<area>.*?) öffnet sich erneut.',\n        fr: 'Ouverture (?<area>.*?)[ ]?!',\n        ja: '(?<area>.*?)の封鎖が解かれた……',\n        cn: '(?<area>.*?)的封锁解除了',\n        ko: '(?<area>.*?)의 봉쇄가 해제되었습니다\\\\.',\n    },\n    // Recipe name always start with \\ue0bb\n    // HQ icon is \\ue03c\n    craftingStart: {\n        en: 'You begin synthesizing (?<count>(an?|\\\\d+) )?\\ue0bb(?<recipe>.*)\\\\.',\n        de: 'Du hast begonnen, durch Synthese (?<count>(ein(e|es|em|er)?|\\\\d+) )?\\ue0bb(?<recipe>.*) herzustellen\\\\.',\n        fr: 'Vous commencez à fabriquer (?<count>(une?|\\\\d+) )?\\ue0bb(?<recipe>.*)\\\\.',\n        ja: '(?<player>\\\\y{Name})は\\ue0bb(?<recipe>.*)(×(?<count>\\\\d+))?の製作を開始した。',\n        cn: '(?<player>\\\\y{Name})开始制作“\\ue0bb(?<recipe>.*)”(×(?<count>\\\\d+))?。',\n        ko: '\\ue0bb(?<recipe>.*)(×(?<count>\\\\d+)개)? 제작을 시작합니다\\\\.',\n    },\n    trialCraftingStart: {\n        en: 'You begin trial synthesis of \\ue0bb(?<recipe>.*)\\\\.',\n        de: 'Du hast mit der Testsynthese von \\ue0bb(?<recipe>.*) begonnen\\\\.',\n        fr: 'Vous commencez une synthèse d\\'essai pour une? \\ue0bb(?<recipe>.*)\\\\.',\n        ja: '(?<player>\\\\y{Name})は\\ue0bb(?<recipe>.*)の製作練習を開始した。',\n        cn: '(?<player>\\\\y{Name})开始练习制作\\ue0bb(?<recipe>.*)。',\n        ko: '\\ue0bb(?<recipe>.*) 제작 연습을 시작합니다\\\\.',\n    },\n    craftingFinish: {\n        en: 'You synthesize (?<count>(an?|\\\\d+) )?\\ue0bb(?<recipe>.*)(\\ue03c)?\\\\.',\n        de: 'Du hast erfolgreich (?<count>(ein(e|es|em|er)?|\\\\d+) )?(?<recipe>.*)(\\ue03c)? hergestellt\\\\.',\n        fr: 'Vous fabriquez (?<count>(une?|\\\\d+) )?\\ue0bb(?<recipe>.*)(\\ue03c)?\\\\.',\n        ja: '(?<player>\\\\y{Name})は\\ue0bb(?<recipe>.*)(\\ue03c)?(×(?<count>\\\\d+))?を完成させた！',\n        cn: '(?<player>\\\\y{Name})制作“\\ue0bb(?<recipe>.*)(\\ue03c)?”(×(?<count>\\\\d+))?成功！',\n        ko: '(?<player>\\\\y{Name}) 님이 \\ue0bb(?<recipe>.*)(\\ue03c)?(×(?<count>\\\\d+)개)?(을|를) 완성했습니다!',\n    },\n    trialCraftingFinish: {\n        en: 'Your trial synthesis of \\ue0bb(?<recipe>.*) proved a success!',\n        de: 'Die Testsynthese von \\ue0bb(?<recipe>.*) war erfolgreich!',\n        fr: 'Votre synthèse d\\'essai pour fabriquer \\ue0bb(?<recipe>.*) a été couronnée de succès!',\n        ja: '(?<player>\\\\y{Name})は\\ue0bb(?<recipe>.*)の製作練習に成功した！',\n        cn: '(?<player>\\\\y{Name})练习制作\\ue0bb(?<recipe>.*)成功了！',\n        ko: '\\ue0bb(?<recipe>.*) 제작 연습에 성공했습니다!',\n    },\n    craftingFail: {\n        en: 'Your synthesis fails!',\n        de: 'Deine Synthese ist fehlgeschlagen!',\n        fr: 'La synthèse échoue\\\\.{3}',\n        ja: '(?<player>\\\\y{Name})は製作に失敗した……',\n        cn: '(?<player>\\\\y{Name})制作失败了……',\n        ko: '제작에 실패했습니다……\\\\.',\n    },\n    trialCraftingFail: {\n        en: 'Your trial synthesis of \\ue0bb(?<recipe>.*) failed\\\\.{3}',\n        de: 'Die Testsynthese von \\ue0bb(?<recipe>.*) ist fehlgeschlagen\\\\.{3}',\n        fr: 'Votre synthèse d\\'essai pour fabriquer \\ue0bb(?<recipe>.*) s\\'est soldée par un échec\\\\.{3}',\n        ja: '(?<player>\\\\y{Name})は\\ue0bb(?<recipe>.*)の製作練習に失敗した……',\n        cn: '(?<player>\\\\y{Name})练习制作\\ue0bb(?<recipe>.*)失败了……',\n        ko: '\\ue0bb(?<recipe>.*) 제작 연습에 실패했습니다……\\\\.',\n    },\n    craftingCancel: {\n        en: 'You cancel the synthesis\\\\.',\n        de: 'Du hast die Synthese abgebrochen\\\\.',\n        fr: 'La synthèse est annulée\\\\.',\n        ja: '(?<player>\\\\y{Name})は製作を中止した。',\n        cn: '(?<player>\\\\y{Name})中止了制作作业。',\n        ko: '제작을 중지했습니다\\\\.',\n    },\n    trialCraftingCancel: {\n        en: 'You abandoned trial synthesis\\\\.',\n        de: 'Testsynthese abgebrochen\\\\.',\n        fr: 'Vous avez interrompu la synthèse d\\'essai\\\\.',\n        ja: '(?<player>\\\\y{Name})は製作練習を中止した。',\n        cn: '(?<player>\\\\y{Name})停止了练习。',\n        ko: '제작 연습을 중지했습니다\\\\.',\n    },\n};\nclass RegexSet {\n    get localeRegex() {\n        if (this.regexes)\n            return this.regexes;\n        this.regexes = this.buildLocaleRegexes(localeLines, (s) => Regexes.gameLog({ line: s + '.*?' }));\n        return this.regexes;\n    }\n    get localeNetRegex() {\n        if (this.netRegexes)\n            return this.netRegexes;\n        this.netRegexes = this.buildLocaleRegexes(localeLines, (s) => NetRegexes.gameLog({ line: s + '[^|]*?' }));\n        return this.netRegexes;\n    }\n    buildLocaleRegexes(locales, builder) {\n        return Object.fromEntries(Object\n            .entries(locales)\n            .map(([key, lines]) => [key, this.buildLocaleRegex(lines, builder)]));\n    }\n    buildLocaleRegex(lines, builder) {\n        const regexEn = builder(lines.en);\n        return {\n            en: regexEn,\n            de: lines.de ? builder(lines.de) : regexEn,\n            fr: lines.fr ? builder(lines.fr) : regexEn,\n            ja: lines.ja ? builder(lines.ja) : regexEn,\n            cn: lines.cn ? builder(lines.cn) : regexEn,\n            ko: lines.ko ? builder(lines.ko) : regexEn,\n        };\n    }\n}\nconst regexSet = new RegexSet();\nconst LocaleRegex = regexSet.localeRegex;\nconst LocaleNetRegex = regexSet.localeNetRegex;\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/EmulatorCommon.ts\n\n\nclass EmulatorCommon {\n    static cloneData(data, exclude = ['options', 'party']) {\n        const ret = {};\n        // Use extra logic for top-level extend for property exclusion\n        // This cut the execution time of this code from 41,000ms to 50ms when parsing a 12 minute pull\n        for (const i in data) {\n            if (exclude.includes(i))\n                continue;\n            if (typeof data[i] === 'object')\n                ret[i] = EmulatorCommon._cloneData(data[i]);\n            else\n                // Assignment of any to any. See DataType definition above for reasoning.\n                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment\n                ret[i] = data[i];\n        }\n        return ret;\n    }\n    static _cloneData(data) {\n        if (typeof data === 'object') {\n            if (Array.isArray(data)) {\n                const ret = [];\n                for (let i = 0; i < data.length; ++i)\n                    ret[i] = EmulatorCommon._cloneData(data[i]);\n                return ret;\n            }\n            if (data === null)\n                return null;\n            if (data instanceof RegExp)\n                return new RegExp(data);\n            const ret = {};\n            for (const i in data)\n                ret[i] = EmulatorCommon._cloneData(data[i]);\n            return ret;\n        }\n        return data;\n    }\n    static timeToString(time, includeMillis = true) {\n        const negative = time < 0 ? '-' : '';\n        time = Math.abs(time);\n        const millisNum = time % 1000;\n        const secsNum = ((time % (60 * 1000)) - millisNum) / 1000;\n        // Milliseconds\n        const millis = `00${millisNum}`.substr(-3);\n        const secs = `0${secsNum}`.substr(-2);\n        const mins = `0${((((time % (60 * 60 * 1000)) - millisNum) / 1000) - secsNum) / 60}`.substr(-2);\n        return negative + mins + ':' + secs + (includeMillis ? '.' + millis : '');\n    }\n    static timeToDateString(time) {\n        return this.dateObjectToDateString(new Date(time));\n    }\n    static dateObjectToDateString(date) {\n        const year = date.getFullYear();\n        const month = EmulatorCommon.zeroPad((date.getMonth() + 1).toString());\n        const day = EmulatorCommon.zeroPad(date.getDate().toString());\n        return `${year}-${month}-${day}`;\n    }\n    static timeToTimeString(time, includeMillis = false) {\n        return this.dateObjectToTimeString(new Date(time), includeMillis);\n    }\n    static dateObjectToTimeString(date, includeMillis = false) {\n        const hour = EmulatorCommon.zeroPad(date.getHours().toString());\n        const minute = EmulatorCommon.zeroPad(date.getMinutes().toString());\n        const second = EmulatorCommon.zeroPad(date.getSeconds().toString());\n        let ret = `${hour}:${minute}:${second}`;\n        if (includeMillis)\n            ret = ret + `.${date.getMilliseconds()}`;\n        return ret;\n    }\n    static msToDuration(ms) {\n        const tmp = EmulatorCommon.timeToString(ms, false);\n        return tmp.replace(':', 'm') + 's';\n    }\n    static dateTimeToString(time, includeMillis = false) {\n        const date = new Date(time);\n        return `${this.dateObjectToDateString(date)} ${this.dateObjectToTimeString(date, includeMillis)}`;\n    }\n    static zeroPad(str, len = 2) {\n        return ('' + str).padStart(len, '0');\n    }\n    static properCase(str) {\n        return str.replace(/([^\\W_]+[^\\s-]*) */g, (txt) => {\n            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();\n        });\n    }\n    static spacePadLeft(str, len) {\n        return str.padStart(len, ' ');\n    }\n    static doesLineMatch(line, regexes) {\n        if (regexes instanceof RegExp)\n            return regexes.exec(line);\n        for (const langStr in regexes) {\n            const lang = langStr;\n            const res = regexes[lang].exec(line);\n            if (res) {\n                if (res.groups)\n                    res.groups.language = lang;\n                return res;\n            }\n        }\n        return null;\n    }\n    static matchStart(line) {\n        var _a, _b, _c, _d;\n        let res;\n        // Currently all of these regexes have groups if they match at all,\n        // but be robust to that changing in the future.\n        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.countdownRegexes);\n        if (res) {\n            (_a = res.groups) !== null && _a !== void 0 ? _a : (res.groups = {});\n            res.groups.StartIn = (parseInt((_b = res.groups.time) !== null && _b !== void 0 ? _b : '0') * 1000).toString();\n            res.groups.StartType = 'Countdown';\n            return res;\n        }\n        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.sealRegexes);\n        if (res) {\n            (_c = res.groups) !== null && _c !== void 0 ? _c : (res.groups = {});\n            res.groups.StartIn = '0';\n            res.groups.StartType = 'Seal';\n            return res;\n        }\n        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.engageRegexes);\n        if (res) {\n            (_d = res.groups) !== null && _d !== void 0 ? _d : (res.groups = {});\n            res.groups.StartIn = '0';\n            res.groups.StartType = 'Engage';\n            return res;\n        }\n    }\n    static matchEnd(line) {\n        var _a, _b, _c, _d;\n        let res;\n        // Currently all of these regexes have groups if they match at all,\n        // but be robust to that changing in the future.\n        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.winRegex);\n        if (res) {\n            (_a = res.groups) !== null && _a !== void 0 ? _a : (res.groups = {});\n            res.groups.EndType = 'Win';\n            return res;\n        }\n        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.wipeRegex);\n        if (res) {\n            (_b = res.groups) !== null && _b !== void 0 ? _b : (res.groups = {});\n            res.groups.EndType = 'Wipe';\n            return res;\n        }\n        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.cactbotWipeRegex);\n        if (res) {\n            (_c = res.groups) !== null && _c !== void 0 ? _c : (res.groups = {});\n            res.groups.EndType = 'Cactbot Wipe';\n            return res;\n        }\n        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.unsealRegexes);\n        if (res) {\n            (_d = res.groups) !== null && _d !== void 0 ? _d : (res.groups = {});\n            res.groups.EndType = 'Unseal';\n            return res;\n        }\n    }\n}\nEmulatorCommon.sealRegexes = LocaleNetRegex.areaSeal;\nEmulatorCommon.engageRegexes = LocaleNetRegex.countdownEngage;\nEmulatorCommon.countdownRegexes = LocaleNetRegex.countdownStart;\nEmulatorCommon.unsealRegexes = LocaleNetRegex.areaUnseal;\nEmulatorCommon.wipeRegex = NetRegexes.network6d({ command: '40000010' });\nEmulatorCommon.winRegex = NetRegexes.network6d({ command: '40000003' });\nEmulatorCommon.cactbotWipeRegex = NetRegexes.echo({ line: 'cactbot wipe.*?' });\n\n;// CONCATENATED MODULE: ./resources/not_reached.ts\n// Helper Error for TypeScript situations where the programmer thinks they\n// know better than TypeScript that some situation will never occur.\n// The intention here is that the programmer does not expect a particular\n// bit of code to happen, and so has not written careful error handling.\n// If it does occur, at least there will be an error and we can figure out why.\n// This is preferable to casting or disabling TypeScript altogether in order to\n// avoid syntax errors.\n// One common example is a regex, where if the regex matches then all of the\n// (non-optional) regex groups will also be valid, but TypeScript doesn't know.\nclass UnreachableCode extends Error {\n    constructor() {\n        super('This code shouldn\\'t be reached');\n    }\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/Combatant.ts\n\nclass Combatant {\n    constructor(id, name) {\n        this.name = '';\n        this.server = '';\n        this.states = {};\n        this.significantStates = [];\n        this.latestTimestamp = -1;\n        this.id = id;\n        this.setName(name);\n    }\n    setName(name) {\n        var _a, _b, _c;\n        // Sometimes network lines arrive after the combatant has been cleared\n        // from memory in the client, so the network line will have a valid ID\n        // but the name will be blank. Since we're tracking the name for the\n        // entire fight and not on a state-by-state basis, we don't want to\n        // blank out a name in this case.\n        // If a combatant actually has a blank name, that's still allowed by\n        // the constructor.\n        if (name === '')\n            return;\n        const parts = name.split('(');\n        this.name = (_a = parts[0]) !== null && _a !== void 0 ? _a : '';\n        if (parts.length > 1)\n            this.server = (_c = (_b = parts[1]) === null || _b === void 0 ? void 0 : _b.replace(/\\)$/, '')) !== null && _c !== void 0 ? _c : '';\n    }\n    hasState(timestamp) {\n        return this.states[timestamp] !== undefined;\n    }\n    pushState(timestamp, state) {\n        this.states[timestamp] = state;\n        this.latestTimestamp = timestamp;\n        if (!this.significantStates.includes(timestamp))\n            this.significantStates.push(timestamp);\n    }\n    nextSignificantState(timestamp) {\n        var _a;\n        // Shortcut out if this is significant or if there's no higher significant state\n        const index = this.significantStates.indexOf(timestamp);\n        const lastSignificantStateIndex = this.significantStates.length - 1;\n        // If timestamp is a significant state already, and it's not the last one, return the next\n        if (index >= 0 && index < lastSignificantStateIndex)\n            return this.getStateByIndex(index + 1);\n        // If timestamp is the last significant state or the timestamp is past the last significant\n        // state, return the last significant state\n        else if (index === lastSignificantStateIndex ||\n            timestamp > ((_a = this.significantStates[lastSignificantStateIndex]) !== null && _a !== void 0 ? _a : 0))\n            return this.getStateByIndex(lastSignificantStateIndex);\n        for (let i = 0; i < this.significantStates.length; ++i) {\n            const stateIndex = this.significantStates[i];\n            if (stateIndex && stateIndex > timestamp)\n                return this.getStateByIndex(i);\n        }\n        return this.getStateByIndex(this.significantStates.length - 1);\n    }\n    pushPartialState(timestamp, props) {\n        var _a;\n        if (this.states[timestamp] === undefined) {\n            // Clone the last state before this timestamp\n            const stateTimestamp = (_a = this.significantStates\n                .filter((s) => s < timestamp)\n                .sort((a, b) => b - a)[0]) !== null && _a !== void 0 ? _a : this.significantStates[0];\n            if (stateTimestamp === undefined)\n                throw new UnreachableCode();\n            const state = this.states[stateTimestamp];\n            if (!state)\n                throw new UnreachableCode();\n            this.states[timestamp] = state.partialClone(props);\n        }\n        else {\n            const state = this.states[timestamp];\n            if (!state)\n                throw new UnreachableCode();\n            this.states[timestamp] = state.partialClone(props);\n        }\n        this.latestTimestamp = Math.max(this.latestTimestamp, timestamp);\n        const lastSignificantStateTimestamp = this.significantStates[this.significantStates.length - 1];\n        if (!lastSignificantStateTimestamp)\n            throw new UnreachableCode();\n        const oldStateJSON = JSON.stringify(this.states[lastSignificantStateTimestamp]);\n        const newStateJSON = JSON.stringify(this.states[timestamp]);\n        if (lastSignificantStateTimestamp !== timestamp && newStateJSON !== oldStateJSON)\n            this.significantStates.push(timestamp);\n    }\n    getState(timestamp) {\n        const stateByTimestamp = this.states[timestamp];\n        if (stateByTimestamp)\n            return stateByTimestamp;\n        const initialTimestamp = this.significantStates[0];\n        if (initialTimestamp === undefined)\n            throw new UnreachableCode();\n        if (timestamp < initialTimestamp)\n            return this.getStateByIndex(0);\n        let i = 0;\n        for (; i < this.significantStates.length; ++i) {\n            const prevTimestamp = this.significantStates[i];\n            if (prevTimestamp === undefined)\n                throw new UnreachableCode();\n            if (prevTimestamp > timestamp)\n                return this.getStateByIndex(i - 1);\n        }\n        return this.getStateByIndex(i - 1);\n    }\n    // Should only be called when `index` is valid.\n    getStateByIndex(index) {\n        const stateIndex = this.significantStates[index];\n        if (stateIndex === undefined)\n            throw new UnreachableCode();\n        const state = this.states[stateIndex];\n        if (state === undefined)\n            throw new UnreachableCode();\n        return state;\n    }\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/CombatantJobSearch.ts\nclass CombatantJobSearch {\n    static getJob(abilityId) {\n        var _a;\n        for (const job in CombatantJobSearch.abilities) {\n            if ((_a = CombatantJobSearch.abilities[job]) === null || _a === void 0 ? void 0 : _a.includes(abilityId))\n                return job;\n        }\n    }\n}\nCombatantJobSearch.abilityMatchRegex = /[a-fA-F0-9]{1,4}/i;\nCombatantJobSearch.abilities = {\n    PLD: [\n        12959, 12961, 12964, 12967, 12968, 12969, 12970, 12971, 12972, 12973, 12974, 12975,\n        12976, 12978, 12980, 12981, 12982, 12983, 12984, 12985, 12986, 12987, 12988, 12989,\n        12991, 12992, 12993, 12994, 12996, 13000, 13001, 13006, 14480, 16457, 16458, 16459,\n        16460, 16461, 17669, 17671, 17672, 17691, 17692, 17693, 17694, 17866, 18050, 27, 29,\n        30, 3538, 3539, 3540, 3541, 3542, 4284, 4285, 4286, 50207, 50209, 50246, 50260, 50261,\n        50262, 50263, 50264, 7382, 7383, 7384, 7385, 8746, 8749, 8750, 8751, 8752, 8754, 8755,\n        8756,\n    ],\n    WAR: [\n        16462, 16463, 16464, 16465, 17695, 17696, 17697, 17698, 17889, 3549, 3550, 3551, 3552,\n        4289, 4290, 4291, 49, 50157, 50218, 50249, 50265, 50266, 50267, 50268, 50269, 51, 52,\n        7386, 7387, 7388, 7389, 8758, 8761, 8762, 8763, 8764, 8765, 8767, 8768,\n    ],\n    DRK: [\n        16466, 16467, 16468, 16469, 16470, 16471, 16472, 17700, 17701, 17702, 3617, 3621, 3623,\n        3624, 3625, 3629, 3632, 3634, 3636, 3638, 3639, 3640, 3641, 3643, 4303, 4304, 4305, 4306,\n        4307, 4308, 4309, 4310, 4311, 4312, 4680, 50158, 50159, 50271, 50272, 50319, 7390, 7391,\n        7392, 7393, 8769, 8772, 8773, 8775, 8776, 8777, 8778, 8779,\n    ],\n    GNB: [\n        17703, 17704, 17705, 17706, 17707, 17708, 17709, 17710, 17711, 17712, 17713, 17714,\n        17716, 17717, 17890, 17891, 16137, 50320, 16138, 16139, 16140, 16141, 16142, 16143,\n        16144, 16145, 16162, 50257, 16148, 16149, 16151, 16152, 50258, 16153, 16154, 16146,\n        16147, 16150, 16159, 16160, 16161, 16155, 16156, 16157, 16158, 16163, 16164, 16165,\n        50259,\n    ],\n    WHM: [\n        12958, 12962, 12965, 12997, 13002, 13003, 13004, 13005, 131, 136, 137, 139, 140, 14481,\n        1584, 16531, 16532, 16533, 16534, 16535, 16536, 17688, 17689, 17690, 17789, 17790, 17791,\n        17793, 17794, 17832, 3568, 3569, 3570, 3571, 4296, 4297, 50181, 50182, 50196, 50307,\n        50308, 50309, 50310, 7430, 7431, 7432, 7433, 8895, 8896, 8900, 9621, 127, 133,\n    ],\n    SCH: [\n        16537, 16538, 16539, 16540, 16541, 16542, 16543, 16544, 16545, 16546, 16547, 16548, 16550,\n        16551, 166, 167, 17215, 17216, 17795, 17796, 17797, 17798, 17802, 17864, 17865, 17869,\n        17870, 17990, 185, 186, 188, 189, 190, 3583, 3584, 3585, 3586, 3587, 4300, 50184, 50214,\n        50311, 50312, 50313, 50324, 7434, 7435, 7436, 7437, 7438, 7869, 802, 803, 805, 8904, 8905,\n        8909, 9622,\n    ],\n    AST: [\n        10027, 10028, 10029, 16552, 16553, 16554, 16555, 16556, 16557, 16558, 16559, 17055, 17151,\n        17152, 17804, 17805, 17806, 17807, 17809, 17991, 3590, 3593, 3594, 3595, 3596, 3598, 3599,\n        3600, 3601, 3603, 3604, 3605, 3606, 3608, 3610, 3612, 3613, 3614, 3615, 4301, 4302, 4401,\n        4402, 4403, 4404, 4405, 4406, 4677, 4678, 4679, 50122, 50124, 50125, 50186, 50187, 50188,\n        50189, 50314, 50315, 50316, 7439, 7440, 7441, 7442, 7443, 7444, 7445, 7448, 8324, 8913,\n        8914, 8916, 9629,\n    ],\n    MNK: [\n        12960, 12963, 12966, 12977, 12979, 12990, 12995, 12998, 12999, 14476, 14478, 16473, 16474,\n        16475, 16476, 17674, 17675, 17676, 17677, 17719, 17720, 17721, 17722, 17723, 17724, 17725,\n        17726, 3543, 3545, 3546, 3547, 4262, 4287, 4288, 50160, 50161, 50245, 50273, 50274, 63, 70,\n        71, 7394, 7395, 7396, 74, 8780, 8781, 8782, 8783, 8784, 8785, 8787, 8789, 8925,\n    ],\n    DRG: [\n        16477, 16478, 16479, 16480, 17728, 17729, 3553, 3554, 3555, 3556, 3557, 4292, 4293, 50162,\n        50163, 50247, 50275, 50276, 7397, 7398, 7399, 7400, 86, 8791, 8792, 8793, 8794, 8795,\n        8796, 8797, 8798, 8799, 8802, 8803, 8804, 8805, 8806, 92, 94, 95, 96, 9640, 75, 78,\n    ],\n    NIN: [\n        16488, 16489, 16491, 16492, 16493, 17413, 17414, 17415, 17416, 17417, 17418, 17419, 17420,\n        17732, 17733, 17734, 17735, 17736, 17737, 17738, 17739, 2246, 2259, 2260, 2261, 2262,\n        2263, 2264, 2265, 2266, 2267, 2268, 2269, 2270, 2271, 2272, 3563, 3566, 4295, 50165,\n        50166, 50167, 50250, 50279, 50280, 7401, 7402, 7403, 8807, 8808, 8809, 8810, 8812, 8814,\n        8815, 8816, 8820, 9461,\n    ],\n    SAM: [\n        16481, 16482, 16483, 16484, 16485, 16486, 16487, 17740, 17741, 17742, 17743, 17744, 50208,\n        50215, 50277, 50278, 7477, 7478, 7479, 7480, 7481, 7482, 7483, 7484, 7485, 7486, 7487,\n        7488, 7489, 7490, 7491, 7492, 7493, 7494, 7495, 7496, 7497, 7498, 7499, 7501, 7502, 7855,\n        7857, 7867, 8821, 8822, 8823, 8824, 8825, 8826, 8828, 8829, 8830, 8831, 8833,\n    ],\n    BRD: [\n        10023, 114, 116, 117, 118, 13007, 14479, 16494, 16495, 16496, 17678, 17679, 17680, 17681,\n        17682, 17745, 17747, 3558, 3559, 3560, 3561, 3562, 4294, 50168, 50169, 50282, 50283, 50284,\n        50285, 50286, 50287, 7404, 7405, 7406, 7407, 7408, 7409, 8836, 8837, 8838, 8839, 8841,\n        8842, 8843, 8844, 9625, 106,\n    ],\n    MCH: [\n        16497, 16498, 16499, 16500, 16501, 16502, 16503, 16504, 16766, 16889, 17206, 17209, 17749,\n        17750, 17751, 17752, 17753, 17754, 2864, 2866, 2868, 2870, 2872, 2873, 2874, 2876, 2878,\n        2890, 4276, 4675, 4676, 50117, 50119, 50288, 50289, 50290, 50291, 50292, 50293, 50294,\n        7410, 7411, 7412, 7413, 7414, 7415, 7416, 7418, 8848, 8849, 8850, 8851, 8853, 8855,\n    ],\n    DNC: [\n        17756, 17757, 17758, 17759, 17760, 17761, 17762, 17763, 17764, 17765, 17766, 17767,\n        17768, 17769, 17770, 17771, 17772, 17773, 17824, 17825, 17826, 17827, 17828, 17829,\n        18076, 15989, 15990, 15993, 15997, 15999, 16000, 16001, 16002, 16003, 16191, 16192,\n        15991, 15994, 16007, 50252, 15995, 15992, 15996, 16008, 16010, 50251, 16015, 16012,\n        16006, 18073, 50253, 16011, 16009, 50254, 15998, 16004, 16193, 16194, 16195, 16196,\n        16013, 16005, 50255, 50256, 16014,\n    ],\n    BLM: [\n        14477, 153, 154, 158, 159, 162, 16505, 16506, 16507, 17683, 17684, 17685, 17686, 17687,\n        17774, 17775, 3573, 3574, 3575, 3576, 3577, 4298, 50171, 50172, 50173, 50174, 50295,\n        50296, 50297, 50321, 50322, 7419, 7420, 7421, 7422, 8858, 8859, 8860, 8861, 8862, 8863,\n        8864, 8865, 8866, 8867, 8869, 9637, 149, 155, 141, 152,\n    ],\n    SMN: [\n        16510, 16511, 16513, 16514, 16515, 16516, 16517, 16518, 16519, 16522, 16523, 16549,\n        16795, 16796, 16797, 16798, 16799, 16800, 16801, 16802, 16803, 17777, 17778, 17779,\n        17780, 17781, 17782, 17783, 17784, 17785, 180, 184, 3578, 3579, 3580, 3581, 3582, 4299,\n        50176, 50177, 50178, 50213, 50217, 50298, 50299, 50300, 50301, 50302, 7423, 7424, 7425,\n        7426, 7427, 7428, 7429, 7449, 7450, 787, 788, 791, 792, 794, 796, 797, 798, 800, 801,\n        8872, 8873, 8874, 8877, 8878, 8879, 8880, 8881, 9014, 9432,\n    ],\n    RDM: [\n        10025, 16524, 16525, 16526, 16527, 16528, 16529, 16530, 17786, 17787, 17788, 50195,\n        50200, 50201, 50216, 50303, 50304, 50305, 50306, 7503, 7504, 7505, 7506, 7507, 7509,\n        7510, 7511, 7512, 7513, 7514, 7515, 7516, 7517, 7518, 7519, 7520, 7521, 7523, 7524,\n        7525, 7526, 7527, 7528, 7529, 7530, 8882, 8883, 8884, 8885, 8887, 8888, 8889, 8890,\n        8891, 8892, 9433, 9434,\n    ],\n    BLU: [\n        11715, 11383, 11384, 11385, 11386, 11387, 11388, 11389, 11390, 11391, 11392, 11393,\n        11394, 11395, 11396, 11397, 11398, 11399, 11400, 11401, 11402, 11403, 11404, 11405,\n        11406, 11407, 11408, 11409, 11410, 11411, 11412, 11413, 11414, 11415, 11416, 11417,\n        11418, 11419, 11420, 11421, 11422, 11423, 11424, 11425, 11426, 11427, 11428, 11429,\n        11430, 11431, 50219, 50220, 50221, 50222, 50223, 50224,\n    ],\n};\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/CombatantState.ts\nclass CombatantState {\n    constructor(posX, posY, posZ, heading, targetable, hp, maxHp, mp, maxMp) {\n        this.posX = posX;\n        this.posY = posY;\n        this.posZ = posZ;\n        this.heading = heading;\n        this.targetable = targetable;\n        this.hp = hp;\n        this.maxHp = maxHp;\n        this.mp = mp;\n        this.maxMp = maxMp;\n    }\n    partialClone(props) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j;\n        return new CombatantState((_a = props.posX) !== null && _a !== void 0 ? _a : this.posX, (_b = props.posY) !== null && _b !== void 0 ? _b : this.posY, (_c = props.posZ) !== null && _c !== void 0 ? _c : this.posZ, (_d = props.heading) !== null && _d !== void 0 ? _d : this.heading, (_e = props.targetable) !== null && _e !== void 0 ? _e : this.targetable, (_f = props.hp) !== null && _f !== void 0 ? _f : this.hp, (_g = props.maxHp) !== null && _g !== void 0 ? _g : this.maxHp, (_h = props.mp) !== null && _h !== void 0 ? _h : this.mp, (_j = props.maxMp) !== null && _j !== void 0 ? _j : this.maxMp);\n    }\n    toPluginState() {\n        return {\n            PosX: this.posX,\n            PosY: this.posY,\n            PosZ: this.posZ,\n            Heading: this.heading,\n            CurrentHP: this.hp,\n            MaxHP: this.maxHp,\n            CurrentMP: this.mp,\n            MaxMP: this.maxMp,\n        };\n    }\n}\n\n;// CONCATENATED MODULE: ./resources/pet_names.ts\n// Auto-generated from gen_pet_names.py\n// DO NOT EDIT THIS FILE DIRECTLY\nconst data = {\n    'cn': [\n        '绿宝石兽',\n        '黄宝石兽',\n        '伊弗利特之灵',\n        '泰坦之灵',\n        '迦楼罗之灵',\n        '朝日小仙女',\n        '夕月小仙女',\n        '车式浮空炮塔',\n        '象式浮空炮塔',\n        '亚灵神巴哈姆特',\n        '亚灵神不死鸟',\n        '炽天使',\n        '月长宝石兽',\n        '英雄的掠影',\n        '后式自走人偶',\n        '分身',\n    ],\n    'de': [\n        'Smaragd-Karfunkel',\n        'Topas-Karfunkel',\n        'Ifrit-Egi',\n        'Titan-Egi',\n        'Garuda-Egi',\n        'Eos',\n        'Selene',\n        'Selbstschuss-Gyrocopter TURM',\n        'Selbstschuss-Gyrocopter LÄUFER',\n        'Demi-Bahamut',\n        'Demi-Phönix',\n        'Seraph',\n        'Mondstein-Karfunkel',\n        'Schattenschemen',\n        'Automaton DAME',\n        'Gedoppeltes Ich',\n    ],\n    'en': [\n        'Emerald Carbuncle',\n        'Topaz Carbuncle',\n        'Ifrit-Egi',\n        'Titan-Egi',\n        'Garuda-Egi',\n        'Eos',\n        'Selene',\n        'Rook Autoturret',\n        'Bishop Autoturret',\n        'Demi-Bahamut',\n        'Demi-Phoenix',\n        'Seraph',\n        'Moonstone Carbuncle',\n        'Esteem',\n        'Automaton Queen',\n        'Bunshin',\n    ],\n    'fr': [\n        'Carbuncle émeraude',\n        'Carbuncle topaze',\n        'Ifrit-Egi',\n        'Titan-Egi',\n        'Garuda-Egi',\n        'Eos',\n        'Selene',\n        'Auto-tourelle Tour',\n        'Auto-tourelle Fou',\n        'Demi-Bahamut',\n        'Demi-Phénix',\n        'Séraphin',\n        'Carbuncle hécatolite',\n        'Estime',\n        'Automate Reine',\n        'Ombre',\n    ],\n    'ja': [\n        'カーバンクル・エメラルド',\n        'カーバンクル・トパーズ',\n        'イフリート・エギ',\n        'タイタン・エギ',\n        'ガルーダ・エギ',\n        'フェアリー・エオス',\n        'フェアリー・セレネ',\n        'オートタレット・ルーク',\n        'オートタレット・ビショップ',\n        'デミ・バハムート',\n        'デミ・フェニックス',\n        'セラフィム',\n        'カーバンクル・ムーンストーン',\n        '英雄の影身',\n        'オートマトン・クイーン',\n        '分身',\n    ],\n    'ko': [\n        '카벙클 에메랄드',\n        '카벙클 토파즈',\n        '이프리트 에기',\n        '타이탄 에기',\n        '가루다 에기',\n        '요정 에오스',\n        '요정 셀레네',\n        '자동포탑 룩',\n        '자동포탑 비숍',\n        '데미바하무트',\n        '데미피닉스',\n        '세라핌',\n        '카벙클 문스톤',\n        '영웅의 환영',\n        '자동인형 퀸',\n        '분신',\n    ],\n};\n/* harmony default export */ const pet_names = (data);\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent.ts\n\nconst fields = {\n    event: 0,\n    timestamp: 1,\n};\n/**\n * Generic class to track an FFXIV log line\n */\nclass LineEvent {\n    constructor(repo, networkLine, parts) {\n        var _a, _b, _c;\n        this.networkLine = networkLine;\n        this.offset = 0;\n        this.invalid = false;\n        this.index = 0;\n        this.decEvent = parseInt((_a = parts[fields.event]) !== null && _a !== void 0 ? _a : '0');\n        this.hexEvent = EmulatorCommon.zeroPad(this.decEvent.toString(16).toUpperCase());\n        this.timestamp = new Date((_b = parts[fields.timestamp]) !== null && _b !== void 0 ? _b : '0').getTime();\n        this.checksum = (_c = parts.slice(-1)[0]) !== null && _c !== void 0 ? _c : '';\n        repo.updateTimestamp(this.timestamp);\n        this.convertedLine = this.prefix() + (parts.join(':')).replace('|', ':');\n    }\n    prefix() {\n        return '[' + EmulatorCommon.timeToTimeString(this.timestamp, true) + '] ' + this.hexEvent + ':';\n    }\n    static isDamageHallowed(damage) {\n        return (parseInt(damage, 16) & parseInt('1000', 16)) > 0;\n    }\n    static isDamageBig(damage) {\n        return (parseInt(damage, 16) & parseInt('4000', 16)) > 0;\n    }\n    static calculateDamage(damage) {\n        if (LineEvent.isDamageHallowed(damage))\n            return 0;\n        damage = EmulatorCommon.zeroPad(damage, 8);\n        const parts = [\n            damage.substr(0, 2),\n            damage.substr(2, 2),\n            damage.substr(4, 2),\n            damage.substr(6, 2),\n        ];\n        if (!LineEvent.isDamageBig(damage))\n            return parseInt(parts.slice(0, 2).reverse().join(''), 16);\n        return parseInt((parts[3] + parts[0]) +\n            (parseInt(parts[1], 16) - parseInt(parts[3], 16)).toString(16), 16);\n    }\n}\nconst isLineEventSource = (line) => {\n    return 'isSource' in line;\n};\nconst isLineEventTarget = (line) => {\n    return 'isTarget' in line;\n};\nconst isLineEventJobLevel = (line) => {\n    return 'isJobLevel' in line;\n};\nconst isLineEventAbility = (line) => {\n    return 'isAbility' in line;\n};\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/CombatantTracker.ts\n\n\n\n\n\nclass CombatantTracker {\n    constructor(logLines, language) {\n        this.combatants = {};\n        this.partyMembers = [];\n        this.enemies = [];\n        this.others = [];\n        this.pets = [];\n        this.initialStates = {};\n        this.language = language;\n        this.firstTimestamp = Number.MAX_SAFE_INTEGER;\n        this.lastTimestamp = 0;\n        this.initialize(logLines);\n        // Clear initialStates after we initialize, we don't need it anymore\n        this.initialStates = {};\n    }\n    initialize(logLines) {\n        var _a, _b, _c, _d, _e, _f, _g;\n        // First pass: Get list of combatants, figure out where they\n        // start at if possible\n        for (const line of logLines) {\n            this.firstTimestamp = Math.min(this.firstTimestamp, line.timestamp);\n            this.lastTimestamp = Math.max(this.lastTimestamp, line.timestamp);\n            if (isLineEventSource(line))\n                this.addCombatantFromLine(line);\n            if (isLineEventTarget(line))\n                this.addCombatantFromTargetLine(line);\n        }\n        // Between passes: Create our initial combatant states\n        for (const id in this.initialStates) {\n            const state = (_a = this.initialStates[id]) !== null && _a !== void 0 ? _a : {};\n            (_b = this.combatants[id]) === null || _b === void 0 ? void 0 : _b.pushState(this.firstTimestamp, new CombatantState(Number(state.posX), Number(state.posY), Number(state.posZ), Number(state.heading), (_c = state.targetable) !== null && _c !== void 0 ? _c : false, Number(state.hp), Number(state.maxHp), Number(state.mp), Number(state.maxMp)));\n        }\n        // Second pass: Analyze combatant information for tracking\n        const eventTracker = {};\n        for (const line of logLines) {\n            if (isLineEventSource(line)) {\n                const state = this.extractStateFromLine(line);\n                if (state) {\n                    eventTracker[line.id] = (_d = eventTracker[line.id]) !== null && _d !== void 0 ? _d : 0;\n                    ++eventTracker[line.id];\n                    (_e = this.combatants[line.id]) === null || _e === void 0 ? void 0 : _e.pushPartialState(line.timestamp, state);\n                }\n            }\n            if (isLineEventTarget(line)) {\n                const state = this.extractStateFromTargetLine(line);\n                if (state) {\n                    eventTracker[line.targetId] = (_f = eventTracker[line.targetId]) !== null && _f !== void 0 ? _f : 0;\n                    ++eventTracker[line.targetId];\n                    (_g = this.combatants[line.targetId]) === null || _g === void 0 ? void 0 : _g.pushPartialState(line.timestamp, state);\n                }\n            }\n        }\n        // Figure out party/enemy/other status\n        const petNames = pet_names[this.language];\n        this.others = this.others.filter((ID) => {\n            var _a, _b, _c, _d, _e;\n            if (((_a = this.combatants[ID]) === null || _a === void 0 ? void 0 : _a.job) !== undefined &&\n                ((_b = this.combatants[ID]) === null || _b === void 0 ? void 0 : _b.job) !== 'NONE' &&\n                ID.startsWith('1')) {\n                this.partyMembers.push(ID);\n                return false;\n            }\n            else if (petNames.includes((_d = (_c = this.combatants[ID]) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '')) {\n                this.pets.push(ID);\n                return false;\n            }\n            else if (((_e = eventTracker[ID]) !== null && _e !== void 0 ? _e : 0) > 0) {\n                this.enemies.push(ID);\n                return false;\n            }\n            return true;\n        });\n        // Main combatant is the one that took the most actions\n        this.mainCombatantID = this.enemies.sort((l, r) => {\n            var _a, _b;\n            return ((_a = eventTracker[r]) !== null && _a !== void 0 ? _a : 0) - ((_b = eventTracker[l]) !== null && _b !== void 0 ? _b : 0);\n        })[0];\n    }\n    addCombatantFromLine(line) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;\n        const combatant = this.initCombatant(line.id, line.name);\n        const initState = (_a = this.initialStates[line.id]) !== null && _a !== void 0 ? _a : {};\n        const extractedState = (_b = this.extractStateFromLine(line)) !== null && _b !== void 0 ? _b : {};\n        initState.posX = (_c = initState.posX) !== null && _c !== void 0 ? _c : extractedState.posX;\n        initState.posY = (_d = initState.posY) !== null && _d !== void 0 ? _d : extractedState.posY;\n        initState.posZ = (_e = initState.posZ) !== null && _e !== void 0 ? _e : extractedState.posZ;\n        initState.heading = (_f = initState.heading) !== null && _f !== void 0 ? _f : extractedState.heading;\n        initState.targetable = (_g = initState.targetable) !== null && _g !== void 0 ? _g : extractedState.targetable;\n        initState.hp = (_h = initState.hp) !== null && _h !== void 0 ? _h : extractedState.hp;\n        initState.maxHp = (_j = initState.maxHp) !== null && _j !== void 0 ? _j : extractedState.maxHp;\n        initState.mp = (_k = initState.mp) !== null && _k !== void 0 ? _k : extractedState.mp;\n        initState.maxMp = (_l = initState.maxMp) !== null && _l !== void 0 ? _l : extractedState.maxMp;\n        if (isLineEventJobLevel(line)) {\n            combatant.job = (_o = (_m = this.combatants[line.id]) === null || _m === void 0 ? void 0 : _m.job) !== null && _o !== void 0 ? _o : line.job;\n            combatant.level = (_q = (_p = this.combatants[line.id]) === null || _p === void 0 ? void 0 : _p.level) !== null && _q !== void 0 ? _q : line.level;\n        }\n        if (isLineEventAbility(line)) {\n            if (!combatant.job && !line.id.startsWith('4') && line.abilityId !== undefined)\n                combatant.job = CombatantJobSearch.getJob(line.abilityId);\n        }\n        if (combatant.job)\n            combatant.job = combatant.job.toUpperCase();\n    }\n    addCombatantFromTargetLine(line) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;\n        this.initCombatant(line.targetId, line.targetName);\n        const initState = (_a = this.initialStates[line.targetId]) !== null && _a !== void 0 ? _a : {};\n        const extractedState = (_b = this.extractStateFromTargetLine(line)) !== null && _b !== void 0 ? _b : {};\n        initState.posX = (_c = initState.posX) !== null && _c !== void 0 ? _c : extractedState.posX;\n        initState.posY = (_d = initState.posY) !== null && _d !== void 0 ? _d : extractedState.posY;\n        initState.posZ = (_e = initState.posZ) !== null && _e !== void 0 ? _e : extractedState.posZ;\n        initState.heading = (_f = initState.heading) !== null && _f !== void 0 ? _f : extractedState.heading;\n        initState.hp = (_g = initState.hp) !== null && _g !== void 0 ? _g : extractedState.hp;\n        initState.maxHp = (_h = initState.maxHp) !== null && _h !== void 0 ? _h : extractedState.maxHp;\n        initState.mp = (_j = initState.mp) !== null && _j !== void 0 ? _j : extractedState.mp;\n        initState.maxMp = (_k = initState.maxMp) !== null && _k !== void 0 ? _k : extractedState.maxMp;\n    }\n    extractStateFromLine(line) {\n        const state = {};\n        if (line.x !== undefined)\n            state.posX = line.x;\n        if (line.y !== undefined)\n            state.posY = line.y;\n        if (line.z !== undefined)\n            state.posZ = line.z;\n        if (line.heading !== undefined)\n            state.heading = line.heading;\n        if (line.targetable !== undefined)\n            state.targetable = line.targetable;\n        if (line.hp !== undefined)\n            state.hp = line.hp;\n        if (line.maxHp !== undefined)\n            state.maxHp = line.maxHp;\n        if (line.mp !== undefined)\n            state.mp = line.mp;\n        if (line.maxMp !== undefined)\n            state.maxMp = line.maxMp;\n        return state;\n    }\n    extractStateFromTargetLine(line) {\n        const state = {};\n        if (line.targetX !== undefined)\n            state.posX = line.targetX;\n        if (line.targetY !== undefined)\n            state.posY = line.targetY;\n        if (line.targetZ !== undefined)\n            state.posZ = line.targetZ;\n        if (line.targetHeading !== undefined)\n            state.heading = line.targetHeading;\n        if (line.targetHp !== undefined)\n            state.hp = line.targetHp;\n        if (line.targetMaxHp !== undefined)\n            state.maxHp = line.targetMaxHp;\n        if (line.targetMp !== undefined)\n            state.mp = line.targetMp;\n        if (line.targetMaxMp !== undefined)\n            state.maxMp = line.targetMaxMp;\n        return state;\n    }\n    initCombatant(id, name) {\n        let combatant = this.combatants[id];\n        if (combatant === undefined) {\n            combatant = this.combatants[id] = new Combatant(id, name);\n            this.others.push(id);\n            this.initialStates[id] = {\n                targetable: true,\n            };\n        }\n        else if (combatant.name === '') {\n            combatant.setName(name);\n        }\n        return combatant;\n    }\n    getMainCombatantName() {\n        var _a, _b;\n        if (this.mainCombatantID)\n            return (_b = (_a = this.combatants[this.mainCombatantID]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Unknown';\n        return 'Unknown';\n    }\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LogRepository.ts\nclass LogRepository {\n    constructor() {\n        this.Combatants = {};\n        this.firstTimestamp = Number.MAX_SAFE_INTEGER;\n    }\n    updateTimestamp(timestamp) {\n        this.firstTimestamp = Math.min(this.firstTimestamp, timestamp);\n    }\n    updateCombatant(id, c) {\n        id = id.toUpperCase();\n        if (id && id.length) {\n            let combatant = this.Combatants[id];\n            if (combatant === undefined) {\n                combatant = {\n                    name: c.name,\n                    job: c.job,\n                    spawn: c.spawn,\n                    despawn: c.despawn,\n                };\n                this.Combatants[id] = combatant;\n            }\n            else {\n                combatant.name = c.name || combatant.name;\n                combatant.job = c.job || combatant.job;\n                combatant.spawn = Math.min(combatant.spawn, c.spawn);\n                combatant.despawn = Math.max(combatant.despawn, c.despawn);\n            }\n        }\n    }\n    resolveName(id, name, fallbackId = null, fallbackName = null) {\n        var _a, _b;\n        let ret = name;\n        if (fallbackId !== null) {\n            if (id === 'E0000000' && ret === '') {\n                if (fallbackId.startsWith('4'))\n                    ret = fallbackName !== null && fallbackName !== void 0 ? fallbackName : '';\n                else\n                    ret = 'Unknown';\n            }\n        }\n        if (ret === '')\n            ret = (_b = (_a = this.Combatants[id]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '';\n        return ret;\n    }\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/EventBus.ts\n/**\n * This is a base class that classes can extend to inherit event bus capabilities.\n * This allows other classes to listen for events with the `on` function.\n * The inheriting class can fire those events with the `dispatch` function.\n */\nclass EventBus {\n    constructor() {\n        this.listeners = {};\n    }\n    /**\n     * Subscribe to an event\n     *\n     * @param event The event(s) to subscribe to, space separated\n     * @param callback The callback to invoke\n     * @param scope Optional. The scope to apply the function against\n     * @returns The callbacks registered to the event(s)\n     */\n    on(event, callback, scope) {\n        var _a, _b;\n        var _c;\n        const events = event.split(' ');\n        const ret = [];\n        scope = scope !== null && scope !== void 0 ? scope : (typeof window === 'undefined' ? {} : window);\n        for (const event of events) {\n            const events = (_a = (_c = this.listeners)[event]) !== null && _a !== void 0 ? _a : (_c[event] = []);\n            if (callback !== undefined)\n                events.push({ event: event, scope: scope, callback: callback });\n            ret.push(...((_b = this.listeners[event]) !== null && _b !== void 0 ? _b : []));\n        }\n        return ret;\n    }\n    /**\n     * Dispatch an event to any subscribers\n     *\n     * @param event The event to dispatch\n     * @param eventArguments The event arguments to pass to listeners\n     * @returns A promise that can be await'd or ignored\n     */\n    async dispatch(event, ...eventArguments) {\n        var _a;\n        if (this.listeners[event] === undefined)\n            return;\n        for (const l of (_a = this.listeners[event]) !== null && _a !== void 0 ? _a : []) {\n            const res = l.callback.apply(l.scope, eventArguments);\n            await Promise.resolve(res);\n        }\n    }\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x00.ts\n\nconst LineEvent0x00_fields = {\n    type: 2,\n    speaker: 3,\n};\n// Chat event\nclass LineEvent0x00 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b;\n        super(repo, line, parts);\n        this.type = (_a = parts[LineEvent0x00_fields.type]) !== null && _a !== void 0 ? _a : '';\n        this.speaker = (_b = parts[LineEvent0x00_fields.speaker]) !== null && _b !== void 0 ? _b : '';\n        this.message = parts.slice(4, -1).join('|');\n        // The exact reason for this check isn't clear anymore but may be related to\n        // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/250\n        if (this.message.split('\\u001f\\u001f').length > 1)\n            this.invalid = true;\n        this.convertedLine =\n            this.prefix() + this.type + ':' +\n                // If speaker is blank, it's excluded from the converted line\n                (this.speaker !== '' ? this.speaker + ':' : '') +\n                this.message.trim();\n        this.convertedLine = LineEvent00.replaceChatSymbols(this.convertedLine);\n    }\n    static replaceChatSymbols(line) {\n        for (const rep of LineEvent00.chatSymbolReplacements)\n            line = line.replace(rep.Search, rep.Replace);\n        return line;\n    }\n}\nLineEvent0x00.chatSymbolReplacements = [\n    {\n        Search: /:\\uE06F/g,\n        Replace: ':⇒',\n        Type: 'Symbol',\n    },\n    {\n        Search: / \\uE0BB\\uE05C/g,\n        Replace: ' ',\n        Type: 'Positive Effect',\n    },\n    {\n        Search: / \\uE0BB\\uE05B/g,\n        Replace: ' ',\n        Type: 'Negative Effect',\n    },\n];\nclass LineEvent00 extends LineEvent0x00 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x01.ts\n\n\nconst LineEvent0x01_fields = {\n    zoneId: 2,\n    zoneName: 3,\n};\n// Zone change event\nclass LineEvent0x01 extends LineEvent {\n    constructor(repo, networkLine, parts) {\n        var _a, _b;\n        super(repo, networkLine, parts);\n        this.zoneId = (_a = parts[LineEvent0x01_fields.zoneId]) !== null && _a !== void 0 ? _a : '';\n        this.zoneName = (_b = parts[LineEvent0x01_fields.zoneName]) !== null && _b !== void 0 ? _b : '';\n        this.zoneNameProperCase = EmulatorCommon.properCase(this.zoneName);\n        this.convertedLine = this.prefix() +\n            'Changed Zone to ' + this.zoneName + '.';\n        this.properCaseConvertedLine = this.prefix() +\n            'Changed Zone to ' + this.zoneNameProperCase + '.';\n    }\n}\nclass LineEvent01 extends LineEvent0x01 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x02.ts\n\nconst LineEvent0x02_fields = {\n    id: 2,\n    name: 3,\n};\n// Player change event\nclass LineEvent0x02 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c;\n        super(repo, line, parts);\n        this.id = (_b = (_a = parts[LineEvent0x02_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x02_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.convertedLine = this.prefix() + 'Changed primary player to ' + this.name + '.';\n    }\n}\nclass LineEvent02 extends LineEvent0x02 {\n}\n\n;// CONCATENATED MODULE: ./resources/util.ts\n// TODO: it'd be nice to not repeat job names, but at least Record enforces that all are set.\nconst nameToJobEnum = {\n    NONE: 0,\n    GLA: 1,\n    PGL: 2,\n    MRD: 3,\n    LNC: 4,\n    ARC: 5,\n    CNJ: 6,\n    THM: 7,\n    CRP: 8,\n    BSM: 9,\n    ARM: 10,\n    GSM: 11,\n    LTW: 12,\n    WVR: 13,\n    ALC: 14,\n    CUL: 15,\n    MIN: 16,\n    BTN: 17,\n    FSH: 18,\n    PLD: 19,\n    MNK: 20,\n    WAR: 21,\n    DRG: 22,\n    BRD: 23,\n    WHM: 24,\n    BLM: 25,\n    ACN: 26,\n    SMN: 27,\n    SCH: 28,\n    ROG: 29,\n    NIN: 30,\n    MCH: 31,\n    DRK: 32,\n    AST: 33,\n    SAM: 34,\n    RDM: 35,\n    BLU: 36,\n    GNB: 37,\n    DNC: 38,\n};\nconst allJobs = Object.keys(nameToJobEnum);\nconst allRoles = ['tank', 'healer', 'dps', 'crafter', 'gatherer', 'none'];\nconst tankJobs = ['GLA', 'PLD', 'MRD', 'WAR', 'DRK', 'GNB'];\nconst healerJobs = ['CNJ', 'WHM', 'SCH', 'AST'];\nconst meleeDpsJobs = ['PGL', 'MNK', 'LNC', 'DRG', 'ROG', 'NIN', 'SAM'];\nconst rangedDpsJobs = ['ARC', 'BRD', 'DNC', 'MCH'];\nconst casterDpsJobs = ['BLU', 'RDM', 'BLM', 'SMN', 'ACN', 'THM'];\nconst dpsJobs = [...meleeDpsJobs, ...rangedDpsJobs, ...casterDpsJobs];\nconst craftingJobs = ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'];\nconst gatheringJobs = ['MIN', 'BTN', 'FSH'];\nconst stunJobs = ['BLU', ...tankJobs, ...meleeDpsJobs];\nconst silenceJobs = ['BLU', ...tankJobs, ...rangedDpsJobs];\nconst sleepJobs = ['BLM', 'BLU', ...healerJobs];\nconst feintJobs = [...meleeDpsJobs];\nconst addleJobs = [...casterDpsJobs];\nconst cleanseJobs = ['BLU', 'BRD', ...healerJobs];\nconst jobToRoleMap = (() => {\n    const addToMap = (map, jobs, role) => {\n        jobs.forEach((job) => map.set(job, role));\n    };\n    const map = new Map([['NONE', 'none']]);\n    addToMap(map, tankJobs, 'tank');\n    addToMap(map, healerJobs, 'healer');\n    addToMap(map, dpsJobs, 'dps');\n    addToMap(map, craftingJobs, 'crafter');\n    addToMap(map, gatheringJobs, 'gatherer');\n    return map;\n})();\nconst Util = {\n    jobEnumToJob: (id) => {\n        const job = allJobs.find((job) => nameToJobEnum[job] === id);\n        return job !== null && job !== void 0 ? job : 'NONE';\n    },\n    jobToJobEnum: (job) => nameToJobEnum[job],\n    jobToRole: (job) => {\n        const role = jobToRoleMap.get(job);\n        return role !== null && role !== void 0 ? role : 'none';\n    },\n    getAllRoles: () => allRoles,\n    isTankJob: (job) => tankJobs.includes(job),\n    isHealerJob: (job) => healerJobs.includes(job),\n    isMeleeDpsJob: (job) => meleeDpsJobs.includes(job),\n    isRangedDpsJob: (job) => rangedDpsJobs.includes(job),\n    isCasterDpsJob: (job) => casterDpsJobs.includes(job),\n    isDpsJob: (job) => dpsJobs.includes(job),\n    isCraftingJob: (job) => craftingJobs.includes(job),\n    isGatheringJob: (job) => gatheringJobs.includes(job),\n    isCombatJob: (job) => {\n        return !craftingJobs.includes(job) && !gatheringJobs.includes(job);\n    },\n    canStun: (job) => stunJobs.includes(job),\n    canSilence: (job) => silenceJobs.includes(job),\n    canSleep: (job) => sleepJobs.includes(job),\n    canCleanse: (job) => cleanseJobs.includes(job),\n    canFeint: (job) => feintJobs.includes(job),\n    canAddle: (job) => addleJobs.includes(job),\n};\n/* harmony default export */ const util = (Util);\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x03.ts\n\n\n\nconst LineEvent0x03_fields = {\n    id: 2,\n    name: 3,\n    jobIdHex: 4,\n    levelString: 5,\n    ownerId: 6,\n    worldId: 7,\n    worldName: 8,\n    npcNameId: 9,\n    npcBaseId: 10,\n    currentHp: 11,\n    maxHpString: 14,\n    currentMp: 13,\n    maxMpString: 14,\n    currentTp: 15,\n    maxTp: 16,\n    xString: 17,\n    yString: 18,\n    zString: 19,\n    heading: 20,\n};\n// Added combatant event\nclass LineEvent0x03 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;\n        super(repo, line, parts);\n        this.isSource = true;\n        this.isJobLevel = true;\n        this.id = (_b = (_a = parts[LineEvent0x03_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x03_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.jobIdHex = (_e = (_d = parts[LineEvent0x03_fields.jobIdHex]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '';\n        this.jobId = parseInt(this.jobIdHex, 16);\n        this.job = util.jobEnumToJob(this.jobId);\n        this.levelString = (_f = parts[LineEvent0x03_fields.levelString]) !== null && _f !== void 0 ? _f : '';\n        this.level = parseFloat(this.levelString);\n        this.ownerId = (_h = (_g = parts[LineEvent0x03_fields.ownerId]) === null || _g === void 0 ? void 0 : _g.toUpperCase()) !== null && _h !== void 0 ? _h : '';\n        this.worldId = (_j = parts[LineEvent0x03_fields.worldId]) !== null && _j !== void 0 ? _j : '';\n        this.worldName = (_k = parts[LineEvent0x03_fields.worldName]) !== null && _k !== void 0 ? _k : '';\n        this.npcNameId = (_l = parts[LineEvent0x03_fields.npcNameId]) !== null && _l !== void 0 ? _l : '';\n        this.npcBaseId = (_m = parts[LineEvent0x03_fields.npcBaseId]) !== null && _m !== void 0 ? _m : '';\n        this.hp = parseFloat((_o = parts[LineEvent0x03_fields.currentHp]) !== null && _o !== void 0 ? _o : '');\n        this.maxHpString = (_p = parts[LineEvent0x03_fields.maxHpString]) !== null && _p !== void 0 ? _p : '';\n        this.maxHp = parseFloat(this.maxHpString);\n        this.mp = parseFloat((_q = parts[LineEvent0x03_fields.currentMp]) !== null && _q !== void 0 ? _q : '');\n        this.maxMpString = (_r = parts[LineEvent0x03_fields.maxMpString]) !== null && _r !== void 0 ? _r : '';\n        this.maxMp = parseFloat(this.maxMpString);\n        this.tp = parseFloat((_s = parts[LineEvent0x03_fields.currentTp]) !== null && _s !== void 0 ? _s : '');\n        this.maxTp = parseFloat((_t = parts[LineEvent0x03_fields.maxTp]) !== null && _t !== void 0 ? _t : '');\n        this.xString = (_u = parts[LineEvent0x03_fields.xString]) !== null && _u !== void 0 ? _u : '';\n        this.x = parseFloat(this.xString);\n        this.yString = (_v = parts[LineEvent0x03_fields.yString]) !== null && _v !== void 0 ? _v : '';\n        this.y = parseFloat(this.yString);\n        this.zString = (_w = parts[LineEvent0x03_fields.zString]) !== null && _w !== void 0 ? _w : '';\n        this.z = parseFloat(this.zString);\n        this.heading = parseFloat((_x = parts[LineEvent0x03_fields.heading]) !== null && _x !== void 0 ? _x : '');\n        repo.updateCombatant(this.id, {\n            name: this.name,\n            spawn: this.timestamp,\n            despawn: this.timestamp,\n            job: this.jobIdHex,\n        });\n        let combatantName = this.name;\n        if (this.worldName !== '')\n            combatantName = combatantName + '(' + this.worldName + ')';\n        this.convertedLine = this.prefix() + this.id.toUpperCase() +\n            ':Added new combatant ' + combatantName +\n            '.  Job: ' + this.job +\n            ' Level: ' + this.levelString +\n            ' Max HP: ' + this.maxHpString +\n            ' Max MP: ' + this.maxMpString +\n            ' Pos: (' + this.xString + ',' + this.yString + ',' + this.zString + ')';\n        // This last part is guesswork for the area between 9 and 10.\n        const unknownValue = this.npcNameId +\n            EmulatorCommon.zeroPad(this.npcBaseId, 8 + Math.max(0, 6 - this.npcNameId.length));\n        if (unknownValue !== '00000000000000')\n            this.convertedLine += ' (' + unknownValue + ')';\n        this.convertedLine += '.';\n    }\n}\nclass LineEvent03 extends LineEvent0x03 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x04.ts\n\n// Removed combatant event\n// Extend the add combatant event to reduce duplicate code since they're\n// the same from a data perspective\nclass LineEvent0x04 extends LineEvent0x03 {\n    constructor(repo, line, parts) {\n        super(repo, line, parts);\n        this.convertedLine = this.prefix() + this.id.toUpperCase() +\n            ':Removing combatant ' + this.name +\n            '. Max MP: ' + this.maxMpString +\n            '. Pos: (' + this.xString + ',' + this.yString + ',' + this.zString + ')';\n    }\n}\nclass LineEvent04 extends LineEvent0x04 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x0C.ts\n\nconst LineEvent0x0C_fields = {\n    class: 2,\n    strength: 3,\n    dexterity: 4,\n    vitality: 5,\n    intelligence: 6,\n    mind: 7,\n    piety: 8,\n    attackPower: 9,\n    directHit: 10,\n    criticalHit: 11,\n    attackMagicPotency: 12,\n    healMagicPotency: 13,\n    determination: 14,\n    skillSpeed: 15,\n    spellSpeed: 16,\n    tenacity: 18,\n};\n// Player stats event\nclass LineEvent0x0C extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;\n        super(repo, line, parts);\n        this.class = (_a = parts[LineEvent0x0C_fields.class]) !== null && _a !== void 0 ? _a : '';\n        this.strength = (_b = parts[LineEvent0x0C_fields.strength]) !== null && _b !== void 0 ? _b : '';\n        this.dexterity = (_c = parts[LineEvent0x0C_fields.dexterity]) !== null && _c !== void 0 ? _c : '';\n        this.vitality = (_d = parts[LineEvent0x0C_fields.vitality]) !== null && _d !== void 0 ? _d : '';\n        this.intelligence = (_e = parts[LineEvent0x0C_fields.intelligence]) !== null && _e !== void 0 ? _e : '';\n        this.mind = (_f = parts[LineEvent0x0C_fields.mind]) !== null && _f !== void 0 ? _f : '';\n        this.piety = (_g = parts[LineEvent0x0C_fields.piety]) !== null && _g !== void 0 ? _g : '';\n        this.attackPower = (_h = parts[LineEvent0x0C_fields.attackPower]) !== null && _h !== void 0 ? _h : '';\n        this.directHit = (_j = parts[LineEvent0x0C_fields.directHit]) !== null && _j !== void 0 ? _j : '';\n        this.criticalHit = (_k = parts[LineEvent0x0C_fields.criticalHit]) !== null && _k !== void 0 ? _k : '';\n        this.attackMagicPotency = (_l = parts[LineEvent0x0C_fields.attackMagicPotency]) !== null && _l !== void 0 ? _l : '';\n        this.healMagicPotency = (_m = parts[LineEvent0x0C_fields.healMagicPotency]) !== null && _m !== void 0 ? _m : '';\n        this.determination = (_o = parts[LineEvent0x0C_fields.determination]) !== null && _o !== void 0 ? _o : '';\n        this.skillSpeed = (_p = parts[LineEvent0x0C_fields.skillSpeed]) !== null && _p !== void 0 ? _p : '';\n        this.spellSpeed = (_q = parts[LineEvent0x0C_fields.spellSpeed]) !== null && _q !== void 0 ? _q : '';\n        this.tenacity = (_r = parts[LineEvent0x0C_fields.tenacity]) !== null && _r !== void 0 ? _r : '';\n        this.convertedLine = this.prefix() +\n            'Player Stats: ' + parts.slice(2, parts.length - 1).join(':').replace(/\\|/g, ':');\n    }\n}\nclass LineEvent12 extends LineEvent0x0C {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x14.ts\n\n\nconst LineEvent0x14_fields = {\n    id: 2,\n    name: 3,\n    abilityId: 4,\n    abilityName: 5,\n    targetId: 6,\n    targetName: 7,\n    duration: 8,\n};\n// Ability use event\nclass LineEvent0x14 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;\n        super(repo, line, parts);\n        this.isSource = true;\n        this.isTarget = true;\n        this.isAbility = true;\n        this.id = (_b = (_a = parts[LineEvent0x14_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x14_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.abilityIdHex = (_e = (_d = parts[LineEvent0x14_fields.abilityId]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '';\n        this.abilityId = parseInt(this.abilityIdHex);\n        this.abilityName = (_f = parts[LineEvent0x14_fields.abilityName]) !== null && _f !== void 0 ? _f : '';\n        this.targetId = (_h = (_g = parts[LineEvent0x14_fields.targetId]) === null || _g === void 0 ? void 0 : _g.toUpperCase()) !== null && _h !== void 0 ? _h : '';\n        this.targetName = (_j = parts[LineEvent0x14_fields.targetName]) !== null && _j !== void 0 ? _j : '';\n        this.duration = (_k = parts[LineEvent0x14_fields.duration]) !== null && _k !== void 0 ? _k : '';\n        repo.updateCombatant(this.id, {\n            job: undefined,\n            name: this.name,\n            spawn: this.timestamp,\n            despawn: this.timestamp,\n        });\n        repo.updateCombatant(this.targetId, {\n            job: undefined,\n            name: this.targetName,\n            spawn: this.timestamp,\n            despawn: this.timestamp,\n        });\n        const target = this.targetName.length === 0 ? 'Unknown' : this.targetName;\n        this.convertedLine = this.prefix() + this.abilityIdHex +\n            ':' + this.name +\n            ' starts using ' + this.abilityName +\n            ' on ' + target + '.';\n        this.properCaseConvertedLine = this.prefix() + this.abilityIdHex +\n            ':' + EmulatorCommon.properCase(this.name) +\n            ' starts using ' + this.abilityName +\n            ' on ' + EmulatorCommon.properCase(target) + '.';\n    }\n}\nclass LineEvent20 extends LineEvent0x14 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x15.ts\n\nconst LineEvent0x15_fields = {\n    id: 2,\n    name: 3,\n    flags: 8,\n    damage: 9,\n    abilityId: 4,\n    abilityName: 5,\n    targetId: 6,\n    targetName: 7,\n    targetHp: 24,\n    targetMaxHp: 25,\n    targetMp: 26,\n    targetMaxMp: 27,\n    targetX: 30,\n    targetY: 31,\n    targetZ: 32,\n    targetHeading: 33,\n    sourceHp: 34,\n    sourceMaxHp: 35,\n    sourceMp: 36,\n    sourceMaxMp: 37,\n    x: 40,\n    y: 41,\n    z: 42,\n    heading: 43,\n};\n// Ability hit single target event\nclass LineEvent0x15 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;\n        super(repo, line, parts);\n        this.isSource = true;\n        this.isTarget = true;\n        this.isAbility = true;\n        this.id = (_b = (_a = parts[LineEvent0x15_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x15_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.flags = (_d = parts[LineEvent0x15_fields.flags]) !== null && _d !== void 0 ? _d : '';\n        const fieldOffset = this.flags === '3F' ? 2 : 0;\n        this.damage = LineEvent.calculateDamage((_e = parts[LineEvent0x15_fields.damage + fieldOffset]) !== null && _e !== void 0 ? _e : '');\n        this.abilityId = parseInt((_g = (_f = parts[LineEvent0x15_fields.abilityId]) === null || _f === void 0 ? void 0 : _f.toUpperCase()) !== null && _g !== void 0 ? _g : '');\n        this.abilityName = (_h = parts[LineEvent0x15_fields.abilityName]) !== null && _h !== void 0 ? _h : '';\n        this.targetId = (_k = (_j = parts[LineEvent0x15_fields.targetId]) === null || _j === void 0 ? void 0 : _j.toUpperCase()) !== null && _k !== void 0 ? _k : '';\n        this.targetName = (_l = parts[LineEvent0x15_fields.targetName]) !== null && _l !== void 0 ? _l : '';\n        this.targetHp = parseInt((_m = parts[LineEvent0x15_fields.targetHp + fieldOffset]) !== null && _m !== void 0 ? _m : '');\n        this.targetMaxHp = parseInt((_o = parts[LineEvent0x15_fields.targetMaxHp + fieldOffset]) !== null && _o !== void 0 ? _o : '');\n        this.targetMp = parseInt((_p = parts[LineEvent0x15_fields.targetMp + fieldOffset]) !== null && _p !== void 0 ? _p : '');\n        this.targetMaxMp = parseInt((_q = parts[LineEvent0x15_fields.targetMaxMp + fieldOffset]) !== null && _q !== void 0 ? _q : '');\n        this.targetX = parseFloat((_r = parts[LineEvent0x15_fields.targetX + fieldOffset]) !== null && _r !== void 0 ? _r : '');\n        this.targetY = parseFloat((_s = parts[LineEvent0x15_fields.targetY + fieldOffset]) !== null && _s !== void 0 ? _s : '');\n        this.targetZ = parseFloat((_t = parts[LineEvent0x15_fields.targetZ + fieldOffset]) !== null && _t !== void 0 ? _t : '');\n        this.targetHeading = parseFloat((_u = parts[LineEvent0x15_fields.targetHeading + fieldOffset]) !== null && _u !== void 0 ? _u : '');\n        this.hp = parseInt((_v = parts[LineEvent0x15_fields.sourceHp + fieldOffset]) !== null && _v !== void 0 ? _v : '');\n        this.maxHp = parseInt((_w = parts[LineEvent0x15_fields.sourceMaxHp + fieldOffset]) !== null && _w !== void 0 ? _w : '');\n        this.mp = parseInt((_x = parts[LineEvent0x15_fields.sourceMp + fieldOffset]) !== null && _x !== void 0 ? _x : '');\n        this.maxMp = parseInt((_y = parts[LineEvent0x15_fields.sourceMaxMp + fieldOffset]) !== null && _y !== void 0 ? _y : '');\n        this.x = parseFloat((_z = parts[LineEvent0x15_fields.x + fieldOffset]) !== null && _z !== void 0 ? _z : '');\n        this.y = parseFloat((_0 = parts[LineEvent0x15_fields.y + fieldOffset]) !== null && _0 !== void 0 ? _0 : '');\n        this.z = parseFloat((_1 = parts[LineEvent0x15_fields.z + fieldOffset]) !== null && _1 !== void 0 ? _1 : '');\n        this.heading = parseFloat((_2 = parts[LineEvent0x15_fields.heading + fieldOffset]) !== null && _2 !== void 0 ? _2 : '');\n        repo.updateCombatant(this.id, {\n            job: undefined,\n            name: this.name,\n            spawn: this.timestamp,\n            despawn: this.timestamp,\n        });\n        repo.updateCombatant(this.targetId, {\n            job: undefined,\n            name: this.targetName,\n            spawn: this.timestamp,\n            despawn: this.timestamp,\n        });\n    }\n}\nclass LineEvent21 extends LineEvent0x15 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x16.ts\n\n// Ability hit multiple/no target event\n// Duplicate of 0x15 as far as data\nclass LineEvent0x16 extends LineEvent0x15 {\n    constructor(repo, line, parts) {\n        super(repo, line, parts);\n    }\n}\nclass LineEvent22 extends LineEvent0x16 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x17.ts\n\nconst LineEvent0x17_fields = {\n    id: 2,\n    name: 3,\n    abilityId: 4,\n    abilityName: 5,\n    reason: 6,\n};\n// Cancel ability event\nclass LineEvent0x17 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g;\n        super(repo, line, parts);\n        this.isSource = true;\n        this.isAbility = true;\n        this.id = (_b = (_a = parts[LineEvent0x17_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x17_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.abilityId = parseInt((_e = (_d = parts[LineEvent0x17_fields.abilityId]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '');\n        this.abilityName = (_f = parts[LineEvent0x17_fields.abilityName]) !== null && _f !== void 0 ? _f : '';\n        this.reason = (_g = parts[LineEvent0x17_fields.reason]) !== null && _g !== void 0 ? _g : '';\n    }\n}\nclass LineEvent23 extends LineEvent0x17 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x18.ts\n\n\nconst LineEvent0x18_fields = {\n    id: 2,\n    name: 3,\n    type: 4,\n    effectId: 5,\n    damage: 6,\n    currentHp: 7,\n    maxHp: 8,\n    currentMp: 9,\n    maxMp: 10,\n    currentTp: 11,\n    maxTp: 12,\n    x: 13,\n    y: 14,\n    z: 15,\n    heading: 16,\n};\n// DoT/HoT event\nclass LineEvent0x18 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;\n        super(repo, line, parts);\n        this.isSource = true;\n        this.id = (_b = (_a = parts[LineEvent0x18_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x18_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.type = (_d = parts[LineEvent0x18_fields.type]) !== null && _d !== void 0 ? _d : '';\n        this.effectId = (_f = (_e = parts[LineEvent0x18_fields.effectId]) === null || _e === void 0 ? void 0 : _e.toUpperCase()) !== null && _f !== void 0 ? _f : '';\n        this.damage = parseInt((_g = parts[LineEvent0x18_fields.damage]) !== null && _g !== void 0 ? _g : '', 16);\n        this.hp = parseInt((_h = parts[LineEvent0x18_fields.currentHp]) !== null && _h !== void 0 ? _h : '');\n        this.maxHp = parseInt((_j = parts[LineEvent0x18_fields.maxHp]) !== null && _j !== void 0 ? _j : '');\n        this.mp = parseInt((_k = parts[LineEvent0x18_fields.currentMp]) !== null && _k !== void 0 ? _k : '');\n        this.maxMp = parseInt((_l = parts[LineEvent0x18_fields.maxMp]) !== null && _l !== void 0 ? _l : '');\n        this.tp = parseInt((_m = parts[LineEvent0x18_fields.currentTp]) !== null && _m !== void 0 ? _m : '');\n        this.maxTp = parseInt((_o = parts[LineEvent0x18_fields.maxTp]) !== null && _o !== void 0 ? _o : '');\n        this.x = parseFloat((_p = parts[LineEvent0x18_fields.x]) !== null && _p !== void 0 ? _p : '');\n        this.y = parseFloat((_q = parts[LineEvent0x18_fields.y]) !== null && _q !== void 0 ? _q : '');\n        this.z = parseFloat((_r = parts[LineEvent0x18_fields.z]) !== null && _r !== void 0 ? _r : '');\n        this.heading = parseFloat((_s = parts[LineEvent0x18_fields.heading]) !== null && _s !== void 0 ? _s : '');\n        repo.updateCombatant(this.id, {\n            job: undefined,\n            name: this.name,\n            spawn: this.timestamp,\n            despawn: this.timestamp,\n        });\n        let effectName = '';\n        const resolvedName = repo.resolveName(this.id, this.name);\n        if (this.effectId in LineEvent0x18.showEffectNamesFor)\n            effectName = (_t = LineEvent0x18.showEffectNamesFor[this.effectId]) !== null && _t !== void 0 ? _t : '';\n        let effectPart = '';\n        if (effectName)\n            effectPart = effectName + ' ';\n        this.convertedLine = this.prefix() + effectPart + this.type +\n            ' Tick on ' + resolvedName +\n            ' for ' + this.damage.toString() + ' damage.';\n        this.properCaseConvertedLine = this.prefix() + effectPart + this.type +\n            ' Tick on ' + EmulatorCommon.properCase(resolvedName) +\n            ' for ' + this.damage.toString() + ' damage.';\n    }\n}\nLineEvent0x18.showEffectNamesFor = {\n    '4C4': 'Excognition',\n    '35D': 'Wildfire',\n    '1F5': 'Doton',\n    '2ED': 'Salted Earth',\n    '4B5': 'Flamethrower',\n    '2E3': 'Asylum',\n    '777': 'Asylum',\n    '798': 'Sacred Soil',\n    '4C7': 'Fey Union',\n    '742': 'Nascent Glint',\n};\nclass LineEvent24 extends LineEvent0x18 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x19.ts\n\n\nconst LineEvent0x19_fields = {\n    id: 2,\n    name: 3,\n    targetId: 4,\n    targetName: 5,\n};\n// Combatant defeated event\nclass LineEvent0x19 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f;\n        super(repo, line, parts);\n        this.id = (_b = (_a = parts[LineEvent0x19_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x19_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.targetId = (_e = (_d = parts[LineEvent0x19_fields.targetId]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '';\n        this.targetName = (_f = parts[LineEvent0x19_fields.targetName]) !== null && _f !== void 0 ? _f : '';\n        repo.updateCombatant(this.id, {\n            job: undefined,\n            name: this.name,\n            spawn: this.timestamp,\n            despawn: this.timestamp,\n        });\n        repo.updateCombatant(this.targetId, {\n            job: undefined,\n            name: this.targetName,\n            spawn: this.timestamp,\n            despawn: this.timestamp,\n        });\n        let resolvedName = undefined;\n        let resolvedTargetName = undefined;\n        if (this.id !== '00')\n            resolvedName = repo.resolveName(this.id, this.name);\n        if (this.targetId !== '00')\n            resolvedTargetName = repo.resolveName(this.targetId, this.targetName);\n        const defeatedName = (resolvedName !== null && resolvedName !== void 0 ? resolvedName : this.name);\n        const killerName = (resolvedTargetName !== null && resolvedTargetName !== void 0 ? resolvedTargetName : this.targetName);\n        this.convertedLine = this.prefix() + defeatedName +\n            ' was defeated by ' + killerName + '.';\n        this.properCaseConvertedLine = this.prefix() + EmulatorCommon.properCase(defeatedName) +\n            ' was defeated by ' + EmulatorCommon.properCase(killerName) + '.';\n    }\n}\nclass LineEvent25 extends LineEvent0x19 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1A.ts\n\n\nconst LineEvent0x1A_fields = {\n    abilityId: 2,\n    abilityName: 3,\n    durationString: 4,\n    id: 5,\n    name: 6,\n    targetId: 7,\n    targetName: 8,\n    stacks: 9,\n    targetHp: 10,\n    sourceHp: 11,\n};\n// Gain status effect event\n// Deliberately don't flag this as LineEventSource or LineEventTarget\n// because 0x1A line values aren't accurate\nclass LineEvent0x1A extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;\n        super(repo, line, parts);\n        this.isAbility = true;\n        this.abilityId = parseInt((_b = (_a = parts[LineEvent0x1A_fields.abilityId]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '');\n        this.abilityName = (_c = parts[LineEvent0x1A_fields.abilityName]) !== null && _c !== void 0 ? _c : '';\n        this.durationString = (_d = parts[LineEvent0x1A_fields.durationString]) !== null && _d !== void 0 ? _d : '';\n        this.durationFloat = parseFloat(this.durationString);\n        this.id = (_f = (_e = parts[LineEvent0x1A_fields.id]) === null || _e === void 0 ? void 0 : _e.toUpperCase()) !== null && _f !== void 0 ? _f : '';\n        this.name = (_g = parts[LineEvent0x1A_fields.name]) !== null && _g !== void 0 ? _g : '';\n        this.targetId = (_j = (_h = parts[LineEvent0x1A_fields.targetId]) === null || _h === void 0 ? void 0 : _h.toUpperCase()) !== null && _j !== void 0 ? _j : '';\n        this.targetName = (_k = parts[LineEvent0x1A_fields.targetName]) !== null && _k !== void 0 ? _k : '';\n        this.stacks = parseInt((_l = parts[LineEvent0x1A_fields.stacks]) !== null && _l !== void 0 ? _l : '0');\n        this.targetHp = parseInt((_m = parts[LineEvent0x1A_fields.targetHp]) !== null && _m !== void 0 ? _m : '');\n        this.hp = parseInt((_o = parts[LineEvent0x1A_fields.sourceHp]) !== null && _o !== void 0 ? _o : '');\n        repo.updateCombatant(this.id, {\n            name: this.name,\n            spawn: this.timestamp,\n            despawn: this.timestamp,\n            job: undefined,\n        });\n        repo.updateCombatant(this.targetId, {\n            name: this.targetName,\n            spawn: this.timestamp,\n            despawn: this.timestamp,\n            job: undefined,\n        });\n        this.resolvedName = repo.resolveName(this.id, this.name);\n        this.resolvedTargetName = repo.resolveName(this.targetId, this.targetName);\n        this.fallbackResolvedTargetName =\n            repo.resolveName(this.id, this.name, this.targetId, this.targetName);\n        let stackCountText = '';\n        if (this.stacks > 0 && this.stacks < 20 &&\n            LineEvent0x1A.showStackCountFor.includes(this.abilityId))\n            stackCountText = ' (' + this.stacks.toString() + ')';\n        this.convertedLine = this.prefix() + this.targetId +\n            ':' + this.targetName +\n            ' gains the effect of ' + this.abilityName +\n            ' from ' + this.fallbackResolvedTargetName +\n            ' for ' + this.durationString + ' Seconds.' + stackCountText;\n        this.properCaseConvertedLine = this.prefix() + this.targetId +\n            ':' + EmulatorCommon.properCase(this.targetName) +\n            ' gains the effect of ' + this.abilityName +\n            ' from ' + EmulatorCommon.properCase(this.fallbackResolvedTargetName) +\n            ' for ' + this.durationString + ' Seconds.' + stackCountText;\n    }\n}\nLineEvent0x1A.showStackCountFor = [\n    304,\n    406,\n    350,\n    714,\n    505,\n    1239,\n    1297,\n];\nclass LineEvent26 extends LineEvent0x1A {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1B.ts\n\nconst LineEvent0x1B_fields = {\n    targetId: 2,\n    targetName: 3,\n    headmarkerId: 6,\n};\n// Head marker event\nclass LineEvent0x1B extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d;\n        super(repo, line, parts);\n        this.isSource = true;\n        this.id = (_b = (_a = parts[LineEvent0x1B_fields.targetId]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x1B_fields.targetName]) !== null && _c !== void 0 ? _c : '';\n        this.headmarkerId = (_d = parts[LineEvent0x1B_fields.headmarkerId]) !== null && _d !== void 0 ? _d : '';\n    }\n}\nclass LineEvent27 extends LineEvent0x1B {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1C.ts\n\nconst LineEvent0x1C_fields = {\n    operation: 2,\n    waymark: 3,\n    id: 4,\n    name: 5,\n    x: 6,\n    y: 7,\n    z: 8,\n};\n// Floor waymarker event\nclass LineEvent0x1C extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h;\n        super(repo, line, parts);\n        this.operation = (_a = parts[LineEvent0x1C_fields.operation]) !== null && _a !== void 0 ? _a : '';\n        this.waymark = (_b = parts[LineEvent0x1C_fields.waymark]) !== null && _b !== void 0 ? _b : '';\n        this.id = (_d = (_c = parts[LineEvent0x1C_fields.id]) === null || _c === void 0 ? void 0 : _c.toUpperCase()) !== null && _d !== void 0 ? _d : '';\n        this.name = (_e = parts[LineEvent0x1C_fields.name]) !== null && _e !== void 0 ? _e : '';\n        this.x = (_f = parts[LineEvent0x1C_fields.x]) !== null && _f !== void 0 ? _f : '';\n        this.y = (_g = parts[LineEvent0x1C_fields.y]) !== null && _g !== void 0 ? _g : '';\n        this.z = (_h = parts[LineEvent0x1C_fields.z]) !== null && _h !== void 0 ? _h : '';\n    }\n}\nclass LineEvent28 extends LineEvent0x1C {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1D.ts\n\nconst LineEvent0x1D_fields = {\n    operation: 2,\n    waymark: 3,\n    id: 4,\n    name: 5,\n    targetId: 6,\n    targetName: 7,\n};\n// Waymarker\nclass LineEvent0x1D extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h;\n        super(repo, line, parts);\n        this.operation = (_a = parts[LineEvent0x1D_fields.operation]) !== null && _a !== void 0 ? _a : '';\n        this.waymark = (_b = parts[LineEvent0x1D_fields.waymark]) !== null && _b !== void 0 ? _b : '';\n        this.id = (_d = (_c = parts[LineEvent0x1D_fields.id]) === null || _c === void 0 ? void 0 : _c.toUpperCase()) !== null && _d !== void 0 ? _d : '';\n        this.name = (_e = parts[LineEvent0x1D_fields.name]) !== null && _e !== void 0 ? _e : '';\n        this.targetId = (_g = (_f = parts[LineEvent0x1D_fields.targetId]) === null || _f === void 0 ? void 0 : _f.toUpperCase()) !== null && _g !== void 0 ? _g : '';\n        this.targetName = (_h = parts[LineEvent0x1D_fields.targetName]) !== null && _h !== void 0 ? _h : '';\n    }\n}\nclass LineEvent29 extends LineEvent0x1D {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1E.ts\n\n\n// Lose status effect event\n// Extend the gain status event to reduce duplicate code since they're\n// the same from a data perspective\nclass LineEvent0x1E extends LineEvent0x1A {\n    constructor(repo, line, parts) {\n        super(repo, line, parts);\n        let stackCountText = '';\n        if (this.stacks > 0 && this.stacks < 20 &&\n            LineEvent0x1A.showStackCountFor.includes(this.abilityId))\n            stackCountText = ' (' + this.stacks.toString() + ')';\n        this.convertedLine = this.prefix() + this.targetId +\n            ':' + this.targetName +\n            ' loses the effect of ' + this.abilityName +\n            ' from ' + this.fallbackResolvedTargetName +\n            ' for ' + this.durationString + ' Seconds.' + stackCountText;\n        this.properCaseConvertedLine = this.prefix() + this.targetId +\n            ':' + EmulatorCommon.properCase(this.targetName) +\n            ' loses the effect of ' + this.abilityName +\n            ' from ' + EmulatorCommon.properCase(this.fallbackResolvedTargetName) +\n            ' for ' + this.durationString + ' Seconds.' + stackCountText;\n    }\n}\nclass LineEvent30 extends LineEvent0x1E {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x1F.ts\n\n\nconst splitFunc = (s) => [\n    s.substr(6, 2),\n    s.substr(4, 2),\n    s.substr(2, 2),\n    s.substr(0, 2),\n];\nconst LineEvent0x1F_fields = {\n    id: 2,\n    dataBytes1: 3,\n    dataBytes2: 4,\n    dataBytes3: 5,\n    dataBytes4: 6,\n};\n// Job gauge event\nclass LineEvent0x1F extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j;\n        super(repo, line, parts);\n        this.id = (_b = (_a = parts[LineEvent0x1F_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.dataBytes1 = EmulatorCommon.zeroPad((_c = parts[LineEvent0x1F_fields.dataBytes1]) !== null && _c !== void 0 ? _c : '');\n        this.dataBytes2 = EmulatorCommon.zeroPad((_d = parts[LineEvent0x1F_fields.dataBytes2]) !== null && _d !== void 0 ? _d : '');\n        this.dataBytes3 = EmulatorCommon.zeroPad((_e = parts[LineEvent0x1F_fields.dataBytes3]) !== null && _e !== void 0 ? _e : '');\n        this.dataBytes4 = EmulatorCommon.zeroPad((_f = parts[LineEvent0x1F_fields.dataBytes4]) !== null && _f !== void 0 ? _f : '');\n        this.jobGaugeBytes = [\n            ...splitFunc(this.dataBytes1),\n            ...splitFunc(this.dataBytes2),\n            ...splitFunc(this.dataBytes3),\n            ...splitFunc(this.dataBytes4),\n        ];\n        this.name = ((_g = repo.Combatants[this.id]) === null || _g === void 0 ? void 0 : _g.name) || '';\n        repo.updateCombatant(this.id, {\n            name: (_h = repo.Combatants[this.id]) === null || _h === void 0 ? void 0 : _h.name,\n            spawn: this.timestamp,\n            despawn: this.timestamp,\n            job: (_j = this.jobGaugeBytes[0]) === null || _j === void 0 ? void 0 : _j.toUpperCase(),\n        });\n        this.convertedLine = this.prefix() +\n            this.id + ':' + this.name +\n            ':' + this.dataBytes1 +\n            ':' + this.dataBytes2 +\n            ':' + this.dataBytes3 +\n            ':' + this.dataBytes4;\n        this.properCaseConvertedLine = this.prefix() +\n            this.id + ':' + (EmulatorCommon.properCase(this.name)) +\n            ':' + this.dataBytes1 +\n            ':' + this.dataBytes2 +\n            ':' + this.dataBytes3 +\n            ':' + this.dataBytes4;\n    }\n}\nclass LineEvent31 extends LineEvent0x1F {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x22.ts\n\nconst LineEvent0x22_fields = {\n    id: 2,\n    name: 3,\n    targetId: 4,\n    targetName: 5,\n    targetable: 6,\n};\n// Nameplate toggle\nclass LineEvent0x22 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g;\n        super(repo, line, parts);\n        this.isSource = true;\n        this.id = (_b = (_a = parts[LineEvent0x22_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x22_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.targetId = (_e = (_d = parts[LineEvent0x22_fields.targetId]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '';\n        this.targetName = (_f = parts[LineEvent0x22_fields.targetName]) !== null && _f !== void 0 ? _f : '';\n        this.targetable = !!parseInt((_g = parts[LineEvent0x22_fields.targetable]) !== null && _g !== void 0 ? _g : '', 16);\n    }\n}\nclass LineEvent34 extends LineEvent0x22 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x23.ts\n\nconst LineEvent0x23_fields = {\n    id: 2,\n    name: 3,\n    targetId: 4,\n    targetName: 5,\n    tetherId: 8,\n};\n// Tether event\nclass LineEvent0x23 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g;\n        super(repo, line, parts);\n        this.id = (_b = (_a = parts[LineEvent0x23_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x23_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.targetId = (_e = (_d = parts[LineEvent0x23_fields.targetId]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : '';\n        this.targetName = (_f = parts[LineEvent0x23_fields.targetName]) !== null && _f !== void 0 ? _f : '';\n        this.tetherId = (_g = parts[LineEvent0x23_fields.tetherId]) !== null && _g !== void 0 ? _g : '';\n    }\n}\nclass LineEvent35 extends LineEvent0x23 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x24.ts\n\nconst LineEvent0x24_fields = {\n    valueHex: 2,\n    bars: 3,\n};\n// Limit gauge event\nclass LineEvent0x24 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b;\n        super(repo, line, parts);\n        this.valueHex = (_a = parts[LineEvent0x24_fields.valueHex]) !== null && _a !== void 0 ? _a : '';\n        this.valueDec = parseInt(this.valueHex, 16);\n        this.bars = (_b = parts[LineEvent0x24_fields.bars]) !== null && _b !== void 0 ? _b : '';\n        this.convertedLine = this.prefix() + 'Limit Break: ' + this.valueHex;\n    }\n}\nclass LineEvent36 extends LineEvent0x24 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x25.ts\n\nconst LineEvent0x25_fields = {\n    id: 2,\n    name: 3,\n    sequenceId: 4,\n    currentHp: 5,\n    maxHp: 6,\n    currentMp: 7,\n    maxMp: 8,\n    currentTp: 9,\n    maxTp: 10,\n    x: 11,\n    y: 12,\n    z: 13,\n    heading: 14,\n};\n// Action sync event\nclass LineEvent0x25 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;\n        super(repo, line, parts);\n        this.isSource = true;\n        this.id = (_b = (_a = parts[LineEvent0x25_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x25_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.sequenceId = (_d = parts[LineEvent0x25_fields.sequenceId]) !== null && _d !== void 0 ? _d : '';\n        this.hp = parseInt((_e = parts[LineEvent0x25_fields.currentHp]) !== null && _e !== void 0 ? _e : '');\n        this.maxHp = parseInt((_f = parts[LineEvent0x25_fields.maxHp]) !== null && _f !== void 0 ? _f : '');\n        this.mp = parseInt((_g = parts[LineEvent0x25_fields.currentMp]) !== null && _g !== void 0 ? _g : '');\n        this.maxMp = parseInt((_h = parts[LineEvent0x25_fields.maxMp]) !== null && _h !== void 0 ? _h : '');\n        this.tp = parseInt((_j = parts[LineEvent0x25_fields.currentTp]) !== null && _j !== void 0 ? _j : '');\n        this.maxTp = parseInt((_k = parts[LineEvent0x25_fields.maxTp]) !== null && _k !== void 0 ? _k : '');\n        this.x = parseFloat((_l = parts[LineEvent0x25_fields.x]) !== null && _l !== void 0 ? _l : '');\n        this.y = parseFloat((_m = parts[LineEvent0x25_fields.y]) !== null && _m !== void 0 ? _m : '');\n        this.z = parseFloat((_o = parts[LineEvent0x25_fields.z]) !== null && _o !== void 0 ? _o : '');\n        this.heading = parseFloat((_p = parts[LineEvent0x25_fields.heading]) !== null && _p !== void 0 ? _p : '');\n    }\n}\nclass LineEvent37 extends LineEvent0x25 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x26.ts\n\n\n\nconst LineEvent0x26_fields = {\n    id: 2,\n    name: 3,\n    jobLevelData: 4,\n    currentHp: 5,\n    maxHp: 6,\n    currentMp: 7,\n    maxMp: 8,\n    currentTp: 9,\n    maxTp: 10,\n    x: 11,\n    y: 12,\n    z: 13,\n    heading: 14,\n};\n// Network status effect event\nclass LineEvent0x26 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;\n        super(repo, line, parts);\n        this.isSource = true;\n        this.isJobLevel = true;\n        this.id = (_b = (_a = parts[LineEvent0x26_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x26_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.jobLevelData = (_d = parts[LineEvent0x26_fields.jobLevelData]) !== null && _d !== void 0 ? _d : '';\n        this.hp = parseInt((_e = parts[LineEvent0x26_fields.currentHp]) !== null && _e !== void 0 ? _e : '');\n        this.maxHp = parseInt((_f = parts[LineEvent0x26_fields.maxHp]) !== null && _f !== void 0 ? _f : '');\n        this.mp = parseInt((_g = parts[LineEvent0x26_fields.currentMp]) !== null && _g !== void 0 ? _g : '');\n        this.maxMp = parseInt((_h = parts[LineEvent0x26_fields.maxMp]) !== null && _h !== void 0 ? _h : '');\n        this.tp = parseInt((_j = parts[LineEvent0x26_fields.currentTp]) !== null && _j !== void 0 ? _j : '');\n        this.maxTp = parseInt((_k = parts[LineEvent0x26_fields.maxTp]) !== null && _k !== void 0 ? _k : '');\n        this.x = parseFloat((_l = parts[LineEvent0x26_fields.x]) !== null && _l !== void 0 ? _l : '');\n        this.y = parseFloat((_m = parts[LineEvent0x26_fields.y]) !== null && _m !== void 0 ? _m : '');\n        this.z = parseFloat((_o = parts[LineEvent0x26_fields.z]) !== null && _o !== void 0 ? _o : '');\n        this.heading = parseFloat((_p = parts[LineEvent0x26_fields.heading]) !== null && _p !== void 0 ? _p : '');\n        const padded = EmulatorCommon.zeroPad(this.jobLevelData, 8);\n        this.jobIdHex = padded.substr(6, 2).toUpperCase();\n        this.jobId = parseInt(this.jobIdHex, 16);\n        this.job = util.jobEnumToJob(this.jobId);\n        this.level = parseInt(padded.substr(4, 2), 16);\n    }\n}\nclass LineEvent38 extends LineEvent0x26 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/LineEvent0x27.ts\n\nconst LineEvent0x27_fields = {\n    id: 2,\n    name: 3,\n    currentHp: 4,\n    maxHp: 5,\n    currentMp: 6,\n    maxMp: 7,\n    currentTp: 8,\n    maxTp: 9,\n    x: 10,\n    y: 11,\n    z: 12,\n    heading: 13,\n};\n// Network update hp event\nclass LineEvent0x27 extends LineEvent {\n    constructor(repo, line, parts) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;\n        super(repo, line, parts);\n        this.isSource = true;\n        this.id = (_b = (_a = parts[LineEvent0x27_fields.id]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';\n        this.name = (_c = parts[LineEvent0x27_fields.name]) !== null && _c !== void 0 ? _c : '';\n        this.hp = parseInt((_d = parts[LineEvent0x27_fields.currentHp]) !== null && _d !== void 0 ? _d : '');\n        this.maxHp = parseInt((_e = parts[LineEvent0x27_fields.maxHp]) !== null && _e !== void 0 ? _e : '');\n        this.mp = parseInt((_f = parts[LineEvent0x27_fields.currentMp]) !== null && _f !== void 0 ? _f : '');\n        this.maxMp = parseInt((_g = parts[LineEvent0x27_fields.maxMp]) !== null && _g !== void 0 ? _g : '');\n        this.tp = parseInt((_h = parts[LineEvent0x27_fields.currentTp]) !== null && _h !== void 0 ? _h : '');\n        this.maxTp = parseInt((_j = parts[LineEvent0x27_fields.maxTp]) !== null && _j !== void 0 ? _j : '');\n        this.x = parseFloat((_k = parts[LineEvent0x27_fields.x]) !== null && _k !== void 0 ? _k : '');\n        this.y = parseFloat((_l = parts[LineEvent0x27_fields.y]) !== null && _l !== void 0 ? _l : '');\n        this.z = parseFloat((_m = parts[LineEvent0x27_fields.z]) !== null && _m !== void 0 ? _m : '');\n        this.heading = parseFloat((_o = parts[LineEvent0x27_fields.heading]) !== null && _o !== void 0 ? _o : '');\n    }\n}\nclass LineEvent39 extends LineEvent0x27 {\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/network_log_converter/ParseLine.ts\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nclass ParseLine {\n    static parse(repo, line) {\n        let ret;\n        const parts = line.split('|');\n        const event = parts[0];\n        // Don't parse raw network packet lines\n        if (!event || event === '252')\n            return;\n        // This is ugly, but Webpack prefers being explicit\n        switch ('LineEvent' + event) {\n            case 'LineEvent00':\n                ret = new LineEvent00(repo, line, parts);\n                break;\n            case 'LineEvent01':\n                ret = new LineEvent01(repo, line, parts);\n                break;\n            case 'LineEvent02':\n                ret = new LineEvent02(repo, line, parts);\n                break;\n            case 'LineEvent03':\n                ret = new LineEvent03(repo, line, parts);\n                break;\n            case 'LineEvent04':\n                ret = new LineEvent04(repo, line, parts);\n                break;\n            case 'LineEvent12':\n                ret = new LineEvent12(repo, line, parts);\n                break;\n            case 'LineEvent20':\n                ret = new LineEvent20(repo, line, parts);\n                break;\n            case 'LineEvent21':\n                ret = new LineEvent21(repo, line, parts);\n                break;\n            case 'LineEvent22':\n                ret = new LineEvent22(repo, line, parts);\n                break;\n            case 'LineEvent23':\n                ret = new LineEvent23(repo, line, parts);\n                break;\n            case 'LineEvent24':\n                ret = new LineEvent24(repo, line, parts);\n                break;\n            case 'LineEvent25':\n                ret = new LineEvent25(repo, line, parts);\n                break;\n            case 'LineEvent26':\n                ret = new LineEvent26(repo, line, parts);\n                break;\n            case 'LineEvent27':\n                ret = new LineEvent27(repo, line, parts);\n                break;\n            case 'LineEvent28':\n                ret = new LineEvent28(repo, line, parts);\n                break;\n            case 'LineEvent29':\n                ret = new LineEvent29(repo, line, parts);\n                break;\n            case 'LineEvent30':\n                ret = new LineEvent30(repo, line, parts);\n                break;\n            case 'LineEvent31':\n                ret = new LineEvent31(repo, line, parts);\n                break;\n            case 'LineEvent34':\n                ret = new LineEvent34(repo, line, parts);\n                break;\n            case 'LineEvent35':\n                ret = new LineEvent35(repo, line, parts);\n                break;\n            case 'LineEvent36':\n                ret = new LineEvent36(repo, line, parts);\n                break;\n            case 'LineEvent37':\n                ret = new LineEvent37(repo, line, parts);\n                break;\n            case 'LineEvent38':\n                ret = new LineEvent38(repo, line, parts);\n                break;\n            case 'LineEvent39':\n                ret = new LineEvent39(repo, line, parts);\n                break;\n            default:\n                ret = new LineEvent(repo, line, parts);\n        }\n        // Also don't parse lines with a non-sane date. This is 2000-01-01 00:00:00\n        if (ret && ret.timestamp < 946684800)\n            return;\n        // Finally, if the object marks itself as invalid, skip it\n        if (ret && ret.invalid)\n            return;\n        return ret;\n    }\n}\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/NetworkLogConverter.ts\n\n\n\nconst isLineEvent = (line) => {\n    return !!line;\n};\nclass NetworkLogConverter extends EventBus {\n    convertFile(data) {\n        const repo = new LogRepository();\n        return this.convertLines(\n        // Split data into an array of separate lines, removing any blank lines.\n        data.split(NetworkLogConverter.lineSplitRegex).filter((l) => l !== ''), repo);\n    }\n    convertLines(lines, repo) {\n        let lineEvents = lines.map((l) => ParseLine.parse(repo, l)).filter(isLineEvent);\n        // Call `convert` to convert the network line to non-network format and update indexing values\n        lineEvents = lineEvents.map((l, i) => {\n            l.index = i;\n            return l;\n        });\n        // Sort the lines based on `${timestamp}_${index}` to handle out-of-order lines properly\n        // @TODO: Remove this once underlying CombatantTracker update issues are resolved\n        return lineEvents.sort((l, r) => (`${l.timestamp}_${l.index}`).localeCompare(`${r.timestamp}_${r.index}`));\n    }\n}\nNetworkLogConverter.lineSplitRegex = /\\r?\\n/gm;\n\n;// CONCATENATED MODULE: ./resources/languages.ts\nconst languages = ['en', 'de', 'fr', 'ja', 'cn', 'ko'];\nconst isLang = (lang) => {\n    const langStrs = languages;\n    if (!lang)\n        return false;\n    return langStrs.includes(lang);\n};\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/Encounter.ts\n\n\n\n\n\n\n\n\nconst isPetName = (name, language) => {\n    if (language)\n        return pet_names[language].includes(name);\n    for (const lang in pet_names) {\n        if (!isLang(lang))\n            throw new UnreachableCode();\n        if (pet_names[lang].includes(name))\n            return true;\n    }\n    return false;\n};\nconst isValidTimestamp = (timestamp) => {\n    return timestamp > 0 && timestamp < Number.MAX_SAFE_INTEGER;\n};\nclass Encounter {\n    constructor(encounterDay, encounterZoneId, encounterZoneName, logLines) {\n        this.encounterDay = encounterDay;\n        this.encounterZoneId = encounterZoneId;\n        this.encounterZoneName = encounterZoneName;\n        this.logLines = logLines;\n        this.initialOffset = Number.MAX_SAFE_INTEGER;\n        this.endStatus = 'Unknown';\n        this.startStatus = 'Unknown';\n        this.engageAt = Number.MAX_SAFE_INTEGER;\n        this.firstPlayerAbility = Number.MAX_SAFE_INTEGER;\n        this.firstEnemyAbility = Number.MAX_SAFE_INTEGER;\n        this.firstLineIndex = 0;\n        this.startTimestamp = 0;\n        this.endTimestamp = 0;\n        this.duration = 0;\n        this.playbackOffset = 0;\n        this.language = 'en';\n        this.version = Encounter.encounterVersion;\n    }\n    initialize() {\n        const startStatuses = new Set();\n        this.logLines.forEach((line, i) => {\n            var _a, _b, _c, _d;\n            if (!line)\n                throw new UnreachableCode();\n            let res = EmulatorCommon.matchStart(line.networkLine);\n            if (res) {\n                this.firstLineIndex = i;\n                if ((_a = res.groups) === null || _a === void 0 ? void 0 : _a.StartType)\n                    startStatuses.add(res.groups.StartType);\n                if ((_b = res.groups) === null || _b === void 0 ? void 0 : _b.StartIn) {\n                    const startIn = parseInt(res.groups.StartIn);\n                    if (startIn >= 0)\n                        this.engageAt = Math.min(line.timestamp + startIn, this.engageAt);\n                }\n            }\n            else {\n                res = EmulatorCommon.matchEnd(line.networkLine);\n                if (res) {\n                    if ((_c = res.groups) === null || _c === void 0 ? void 0 : _c.EndType)\n                        this.endStatus = res.groups.EndType;\n                }\n                else if (isLineEventSource(line) && isLineEventTarget(line)) {\n                    if (line.id.startsWith('1') ||\n                        (line.id.startsWith('4') && isPetName(line.name, this.language))) {\n                        // Player or pet ability\n                        if (line.targetId.startsWith('4') && !isPetName(line.targetName, this.language)) {\n                            // Targetting non player or pet\n                            this.firstPlayerAbility = Math.min(this.firstPlayerAbility, line.timestamp);\n                        }\n                    }\n                    else if (line.id.startsWith('4') && !isPetName(line.name, this.language)) {\n                        // Non-player ability\n                        if (line.targetId.startsWith('1') || isPetName(line.targetName, this.language)) {\n                            // Targetting player or pet\n                            this.firstEnemyAbility = Math.min(this.firstEnemyAbility, line.timestamp);\n                        }\n                    }\n                }\n            }\n            const matchedLang = (_d = res === null || res === void 0 ? void 0 : res.groups) === null || _d === void 0 ? void 0 : _d.language;\n            if (isLang(matchedLang))\n                this.language = matchedLang;\n        });\n        this.combatantTracker = new CombatantTracker(this.logLines, this.language);\n        this.startTimestamp = this.combatantTracker.firstTimestamp;\n        this.endTimestamp = this.combatantTracker.lastTimestamp;\n        this.duration = this.endTimestamp - this.startTimestamp;\n        if (this.initialOffset === Number.MAX_SAFE_INTEGER) {\n            if (this.engageAt < Number.MAX_SAFE_INTEGER)\n                this.initialOffset = this.engageAt - this.startTimestamp;\n            else if (this.firstPlayerAbility < Number.MAX_SAFE_INTEGER)\n                this.initialOffset = this.firstPlayerAbility - this.startTimestamp;\n            else if (this.firstEnemyAbility < Number.MAX_SAFE_INTEGER)\n                this.initialOffset = this.firstEnemyAbility - this.startTimestamp;\n            else\n                this.initialOffset = 0;\n        }\n        const firstLine = this.logLines[this.firstLineIndex];\n        if (firstLine && firstLine.offset)\n            this.playbackOffset = firstLine.offset;\n        this.startStatus = [...startStatuses].sort().join(', ');\n    }\n    get initialTimestamp() {\n        return this.startTimestamp + this.initialOffset;\n    }\n    shouldPersistFight() {\n        return isValidTimestamp(this.firstPlayerAbility) && isValidTimestamp(this.firstEnemyAbility);\n    }\n    upgrade(version) {\n        if (Encounter.encounterVersion <= version)\n            return false;\n        const repo = new LogRepository();\n        const converter = new NetworkLogConverter();\n        this.logLines = converter.convertLines(this.logLines.map((l) => l.networkLine), repo);\n        this.version = Encounter.encounterVersion;\n        this.initialize();\n        return true;\n    }\n}\nEncounter.encounterVersion = 1;\n\n;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/LogEventHandler.ts\n\n\n\nclass LogEventHandler extends EventBus {\n    constructor() {\n        super(...arguments);\n        this.currentFight = [];\n        this.currentZoneName = 'Unknown';\n        this.currentZoneId = '-1';\n    }\n    parseLogs(logs) {\n        for (const lineObj of logs) {\n            this.currentFight.push(lineObj);\n            lineObj.offset = lineObj.timestamp - this.currentFightStart;\n            const res = EmulatorCommon.matchEnd(lineObj.networkLine);\n            if (res) {\n                this.endFight();\n            }\n            else if (lineObj instanceof LineEvent0x01) {\n                this.currentZoneId = lineObj.zoneId;\n                this.currentZoneName = lineObj.zoneName;\n                this.endFight();\n            }\n        }\n    }\n    get currentFightStart() {\n        var _a, _b;\n        return (_b = (_a = this.currentFight[0]) === null || _a === void 0 ? void 0 : _a.timestamp) !== null && _b !== void 0 ? _b : 0;\n    }\n    get currentFightEnd() {\n        var _a, _b;\n        return (_b = (_a = this.currentFight.slice(-1)[0]) === null || _a === void 0 ? void 0 : _a.timestamp) !== null && _b !== void 0 ? _b : 0;\n    }\n    endFight() {\n        if (this.currentFight.length < 2)\n            return;\n        const start = new Date(this.currentFightStart).toISOString();\n        const end = new Date(this.currentFightEnd).toISOString();\n        console.debug(`Dispatching new fight\r\nStart: ${start}\r\nEnd: ${end}\r\nZone: ${this.currentZoneName}\r\nLine Count: ${this.currentFight.length}\r\n`);\n        void this.dispatch('fight', start.substr(0, 10), this.currentZoneId, this.currentZoneName, this.currentFight);\n        this.currentFight = [];\n    }\n}\n\n;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[1].use!./ui/raidboss/emulator/data/NetworkLogConverterWorker.js\n\n\n\n\n\n\nonmessage = async msg => {\n  const logConverter = new NetworkLogConverter();\n  const localLogHandler = new LogEventHandler();\n  const repo = new LogRepository(); // Listen for LogEventHandler to dispatch fights and persist them\n\n  localLogHandler.on('fight', async (day, zoneId, zoneName, lines) => {\n    const enc = new Encounter(day, zoneId, zoneName, lines);\n    enc.initialize();\n\n    if (enc.shouldPersistFight()) {\n      postMessage({\n        type: 'encounter',\n        encounter: enc,\n        name: enc.combatantTracker.getMainCombatantName()\n      });\n    }\n  }); // Convert the message manually due to memory issues with extremely large files\n\n  const decoder = new TextDecoder('UTF-8');\n  let buf = new Uint8Array(msg.data);\n  let nextOffset = 0;\n  let lines = [];\n  let lineCount = 0;\n\n  for (let currentOffset = nextOffset; nextOffset < buf.length && nextOffset !== -1; currentOffset = nextOffset) {\n    nextOffset = buf.indexOf(0x0A, nextOffset + 1);\n    const line = decoder.decode(buf.slice(currentOffset, nextOffset)).trim();\n\n    if (line.length) {\n      ++lineCount;\n      lines.push(line);\n    }\n\n    if (lines.length >= 1000) {\n      lines = logConverter.convertLines(lines, repo);\n      localLogHandler.parseLogs(lines);\n      postMessage({\n        type: 'progress',\n        lines: lineCount,\n        bytes: nextOffset,\n        totalBytes: buf.length\n      });\n      lines = [];\n    }\n  }\n\n  if (lines.length > 0) {\n    lines = logConverter.convertLines(lines, repo);\n    localLogHandler.parseLogs(lines);\n    lines = [];\n  }\n\n  postMessage({\n    type: 'progress',\n    lines: lineCount,\n    bytes: buf.length,\n    totalBytes: buf.length\n  });\n  buf = null;\n  localLogHandler.endFight();\n  postMessage({\n    type: 'done'\n  });\n};\n/******/ })()\n;", "Worker", {"type":"classic","name":"NetworkLogConverterWorker"}, __webpack_require__.p + "NetworkLogConverterWorker.bundle.worker.js");
}

;// CONCATENATED MODULE: ./ui/raidboss/raidemulator.js


















 // eslint can't detect the custom loader for the worker
// eslint-disable-next-line import/default






(() => {
  let emulator;
  let progressBar;
  let timelineController;
  let popupText;
  let persistor;
  let encounterTab;
  let emulatedPartyInfo;
  let emulatedMap;
  let emulatedWebSocket;
  let timelineUI;
  let logConverterWorker;
  document.addEventListener('DOMContentLoaded', () => {
    emulator = new RaidEmulator(raidboss_options);
    progressBar = new ProgressBar(emulator);
    persistor = new Persistor();
    encounterTab = new EncounterTab(persistor);
    emulatedPartyInfo = new EmulatedPartyInfo(emulator);
    emulatedMap = new EmulatedMap(emulator);
    emulatedWebSocket = new RaidEmulatorOverlayApiHook(emulator);
    logConverterWorker = new Worker_fn(); // Listen for the user to click a player in the party list on the right
    // and persist that over to the emulator

    emulatedPartyInfo.on('selectPerspective', id => {
      emulator.selectPerspective(id);
    });
    emulator.on('currentEncounterChanged', enc => {
      // Store our current loaded encounter to auto-load next time
      window.localStorage.setItem('currentEncounter', enc.encounter.id); // Once we've loaded the encounter, seek to the start of the encounter

      if (!isNaN(enc.encounter.initialOffset)) emulator.seek(enc.encounter.initialOffset);
    }); // Listen for the user to attempt to load an encounter from the encounters pane

    encounterTab.on('load', id => {
      // Attempt to set the current emulated encounter
      if (!emulator.setCurrentByID(id)) {
        // If that encounter isn't loaded, load it
        persistor.loadEncounter(id).then(enc => {
          emulator.addEncounter(enc);
          emulator.setCurrentByID(id);
        });
      }
    }); // Listen for the user to select re-parse on the encounters tab, then refresh it in the DB

    encounterTab.on('parse', id => {
      persistor.loadEncounter(id).then(async enc => {
        enc.initialize();
        await persistor.persistEncounter(enc);
        encounterTab.refresh();
      });
    }); // Listen for the user to select prune on the encounters tab

    encounterTab.on('prune', id => {
      persistor.loadEncounter(id).then(async enc => {
        // Trim log lines
        enc.logLines = enc.logLines.slice(enc.firstLineIndex - 1); // Update precalculated offsets

        const firstTimestamp = enc.logLines[0].timestamp;

        for (let i = 0; i < enc.logLines.length; ++i) enc.logLines[i].offset = enc.logLines[i].timestamp - firstTimestamp;

        enc.firstLineIndex = 0;
        enc.initialize();
        await persistor.persistEncounter(enc);
        encounterTab.refresh();
      });
    }); // Listen for the user to select delete on the encounters tab, then do it.

    encounterTab.on('delete', id => {
      persistor.deleteEncounter(id).then(() => {
        encounterTab.refresh();
      });
    }); // Listen for the emulator to event log lines, then dispatch them to the timeline controller
    // @TODO: Probably a better place to listen for this?

    emulator.on('emitLogs', logs => {
      timelineController.OnLogEvent({
        type: 'onLogEvent',
        detail: logs
      });
    }); // Wait for the DB to be ready before doing anything that might invoke the DB

    persistor.on('ready', () => {
      user_config/* default.getUserConfigLocation */.Z.getUserConfigLocation('raidboss', raidboss_options, e => {
        document.querySelector('.websocketConnected').classList.remove('d-none');
        document.querySelector('.websocketDisconnected').classList.add('d-none'); // Initialize the Raidboss components, bind them to the emulator for event listeners

        timelineUI = new RaidEmulatorTimelineUI(raidboss_options);
        timelineUI.bindTo(emulator);
        timelineController = new RaidEmulatorTimelineController(raidboss_options, timelineUI, raidboss_manifest/* default */.Z);
        timelineController.bindTo(emulator);
        popupText = new RaidEmulatorPopupText(raidboss_options, new TimelineLoader(timelineController), raidboss_manifest/* default */.Z);
        popupText.bindTo(emulator);
        timelineController.SetPopupTextInterface(new PopupTextGenerator(popupText));
        emulator.setPopupText(popupText); // Load the encounter metadata from the DB

        encounterTab.refresh(); // If we don't have any encounters stored, show the intro modal

        persistor.listEncounters().then(encounters => {
          if (encounters.length === 0) {
            showModal('.introModal');
          } else {
            let lastEncounter = window.localStorage.getItem('currentEncounter');

            if (lastEncounter !== undefined) {
              lastEncounter = parseInt(lastEncounter);
              const matchedEncounters = encounters.filter(e => e.id === lastEncounter);
              if (matchedEncounters.length) encounterTab.dispatch('load', lastEncounter);
            }
          }
        });

        const checkFile = async file => {
          if (file.type === 'application/json') {
            // Import a DB file by passing it to Persistor
            // DB files are just json representations of the DB
            file.text().then(txt => {
              const DB = JSON.parse(txt);
              persistor.importDB(DB).then(() => {
                encounterTab.refresh();
              });
            });
          } else {
            // Assume it's a log file?
            const importModal = showModal('.importProgressModal');
            const bar = importModal.querySelector('.progress-bar');
            bar.style.width = '0px';
            const label = importModal.querySelector('.label');
            label.innerText = '';
            const encLabel = importModal.querySelector('.encounterLabel');
            encLabel.innerText = 'N/A';
            const doneButton = importModal.querySelector('.btn');
            doneButton.disabled = true;
            const doneButtonTimeout = doneButton.querySelector('.doneBtnTimeout');
            const promises = [];

            logConverterWorker.onmessage = msg => {
              switch (msg.data.type) {
                case 'progress':
                  {
                    const percent = (msg.data.bytes / msg.data.totalBytes * 100).toFixed(2);
                    bar.style.width = percent + '%';
                    label.innerText = `${msg.data.bytes}/${msg.data.totalBytes} bytes, ${msg.data.lines} lines (${percent}%)`;
                  }
                  break;

                case 'encounter':
                  {
                    const enc = msg.data.encounter;
                    encLabel.innerText = `
                  Zone: ${enc.encounterZoneName}
                  Encounter: ${msg.data.name}
                  Start: ${new Date(enc.startTimestamp)}
                  End: ${new Date(enc.endTimestamp)}
                  Duration: ${EmulatorCommon_EmulatorCommon.msToDuration(enc.endTimestamp - enc.startTimestamp)}
                  Pull Duration: ${EmulatorCommon_EmulatorCommon.msToDuration(enc.endTimestamp - enc.initialTimestamp)}
                  Started By: ${enc.startStatus}
                  End Status: ${enc.endStatus}
                  Line Count: ${enc.logLines.length}
                  `; // Objects sent via message are raw objects, not typed.
                    // Need to get the name another way and override for Persistor.

                    enc.combatantTracker.getMainCombatantName = () => msg.data.name;

                    promises.push(persistor.persistEncounter(enc));
                  }
                  break;

                case 'done':
                  Promise.all(promises).then(() => {
                    encounterTab.refresh();
                    doneButton.disabled = false;
                    let seconds = 5;
                    doneButtonTimeout.innerText = ` (${seconds})`;
                    const interval = window.setInterval(() => {
                      --seconds;
                      doneButtonTimeout.innerText = ` (${seconds})`;

                      if (seconds === 0) {
                        window.clearInterval(interval);
                        hideModal('.importProgressModal');
                      }
                    }, 1000);
                  });
                  break;
              }
            };

            file.arrayBuffer().then(b => {
              logConverterWorker.postMessage(b, [b]);
            });
          }
        };

        const ignoreEvent = e => {
          e.preventDefault();
          e.stopPropagation();
        }; // Handle drag+drop of files. Have to ignore dragenter/dragover for compatibility reasons.


        document.body.addEventListener('dragenter', ignoreEvent);
        document.body.addEventListener('dragover', ignoreEvent);
        document.body.addEventListener('drop', async e => {
          e.preventDefault();
          e.stopPropagation();
          const dt = e.dataTransfer;
          const files = dt.files;

          for (let i = 0; i < files.length; ++i) {
            const file = files[i];
            await checkFile(file);
          }
        });
        const $exportButton = document.querySelector('.exportDBButton');
        new Tooltip($exportButton, 'bottom', 'Export DB is very slow and shows a 0 byte download, but it does work eventually.'); // Auto initialize all collapse elements on the page

        document.querySelectorAll('[data-toggle="collapse"]').forEach(n => {
          const target = document.querySelector(n.getAttribute('data-target'));
          n.addEventListener('click', () => {
            if (n.getAttribute('aria-expanded') === 'false') {
              n.setAttribute('aria-expanded', 'true');
              target.classList.add('show');
            } else {
              n.setAttribute('aria-expanded', 'false');
              target.classList.remove('show');
            }
          });
        }); // Handle DB export

        $exportButton.addEventListener('click', e => {
          persistor.exportDB().then(obj => {
            // Convert encounter DB to json, then base64 encode it
            // Encounters can have unicode, can't use btoa for base64 encode
            const blob = new Blob([JSON.stringify(obj)], {
              type: 'application/json'
            });
            obj = null; // Offer download to user

            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.setAttribute('download', 'RaidEmulator_DBExport_' + +new Date() + '.json');
            a.click(); // After a second (so after user accepts/declines)
            // remove the object URL to avoid memory issues

            window.setTimeout(() => {
              URL.revokeObjectURL(a.href);
            }, 1000);
          });
        });
        const $fileInput = document.querySelector('.loadFileInput'); // Handle the `Load Network Log` button when user selects files

        $fileInput.addEventListener('change', async e => {
          for (let i = 0; i < e.target.files.length; ++i) {
            const file = e.target.files[i];
            checkFile(file);
          }
        }); // Prompt user to select files if they click the `Load Network Log` or `Import DB` buttons.
        // These buttons really do the same thing.

        document.querySelectorAll('.importDBButton, .loadNetworkLogButton').forEach(n => {
          n.addEventListener('click', e => {
            $fileInput.click();
          });
        }); // Handle all modal close buttons

        document.querySelectorAll('.modal button.close, [data-dismiss="modal"]').forEach(n => {
          n.addEventListener('click', e => {
            // Find the parent modal from the close button and close it
            let target = e.currentTarget;

            while (!target.classList.contains('modal') && target !== document.body) target = target.parentElement;

            if (target !== document.body) hideModal('.' + [...target.classList].join('.'));
          });
        }); // Handle closing all modals if the user clicks outside the modal

        document.querySelectorAll('.modal').forEach(n => {
          n.addEventListener('click', e => {
            // Only close the modal if the user actually clicked outside it, not child clicks
            if (e.target === n) hideModal();
          });
        }); // Ask the user if they're really sure they want to clear the DB

        document.querySelector('.clearDBButton').addEventListener('click', e => {
          showModal('.deleteDBModal');
        }); // Handle user saying they're really sure they want to clear the DB by wiping it then
        // refreshing the encounter tab

        document.querySelector('.deleteDBModal .btn-primary').addEventListener('click', e => {
          persistor.clearDB().then(() => {
            encounterTab.refresh();
            hideModal('.deleteDBModal');
          });
        }); // Make the emulator state available for debugging

        window.raidEmulator = {
          emulator: emulator,
          progressBar: progressBar,
          timelineController: timelineController,
          popupText: popupText,
          persistor: persistor,
          encounterTab: encounterTab,
          emulatedPartyInfo: emulatedPartyInfo,
          emulatedMap: emulatedMap,
          emulatedWebSocket: emulatedWebSocket,
          timelineUI: timelineUI
        };
      });
    });
  });
})();

function showModal(selector) {
  const modal = document.querySelector(selector);
  const body = document.body;
  const backdrop = document.querySelector('.modal-backdrop');
  body.classList.add('modal-open');
  backdrop.classList.add('show');
  backdrop.classList.remove('hide');
  modal.classList.add('show');
  modal.style.display = 'block';
  return modal;
}

function hideModal(selector = '.modal.show') {
  const modal = document.querySelector(selector);
  const body = document.body;
  const backdrop = document.querySelector('.modal-backdrop');
  body.classList.remove('modal-open');
  backdrop.classList.remove('show');
  backdrop.classList.add('hide');
  modal.classList.remove('show');
  modal.style.display = '';
  return modal;
}

/***/ }),

/***/ 152:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// For consistency with Responses, Conditions
// are also functions.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    targetIsYou() {
        return (data, matches) => data.me === (matches === null || matches === void 0 ? void 0 : matches.target);
    },
    targetIsNotYou() {
        return (data, matches) => data.me !== (matches === null || matches === void 0 ? void 0 : matches.target);
    },
    caresAboutAOE() {
        return (data) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
    },
    caresAboutMagical() {
        return (data) => data.role === 'tank' || data.role === 'healer' || data.CanAddle() || data.job === 'BLU';
    },
    caresAboutPhysical() {
        return (data) => data.role === 'tank' || data.role === 'healer' || data.CanFeint() || data.job === 'BLU';
    },
});


/***/ }),

/***/ 5:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Auto-generated from gen_zone_id_and_info.py
// DO NOT EDIT THIS FILE DIRECTLY
const data = {
    'BeastTribeQuests': 13,
    'Companions': 12,
    'CustomDeliveries': 25,
    'DeepDungeons': 21,
    'DisciplesOfTheHand': 17,
    'DisciplesOfTheLand': 16,
    'Dungeons': 2,
    'DutyRoulette': 1,
    'Eureka': 26,
    'Fates': 8,
    'GoldSaucer': 19,
    'GrandCompany': 11,
    'Guildhests': 3,
    'Levequests': 10,
    'OverallCompletion': 14,
    'PlayerCommendation': 15,
    'Pvp': 6,
    'QuestBattles': 7,
    'Raids': 5,
    'RetainerVentures': 18,
    'TreasureHunt': 9,
    'Trials': 4,
    'UltimateRaids': 28,
    'WondrousTails': 24,
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (data);


/***/ }),

/***/ 381:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ NetRegexes)
/* harmony export */ });
/* harmony import */ var _regexes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(201);

// Differences from Regexes:
// * may have more fields
// * AddedCombatant npc id is broken up into npcNameId and npcBaseId
// * gameLog always splits name into its own field (but previously wouldn't)
const separator = '\\|';
const matchDefault = '[^|]*';
const startsUsingParams = (/* unused pure expression or super */ null && (['timestamp', 'sourceId', 'source', 'id', 'ability', 'targetId', 'target', 'castTime']));
const abilityParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'id', 'ability', 'targetId', 'target']));
const abilityFullParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'id', 'ability', 'targetId', 'target', 'flags', 'damage', 'targetCurrentHp', 'targetMaxHp', 'x', 'y', 'z', 'heading']));
const headMarkerParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'id']));
const addedCombatantParams = (/* unused pure expression or super */ null && (['id', 'name']));
const addedCombatantFullParams = (/* unused pure expression or super */ null && (['id', 'name', 'job', 'level', 'ownerId', 'world', 'npcNameId', 'npcBaseId', 'currentHp', 'hp', 'x', 'y', 'z', 'heading']));
const removingCombatantParams = (/* unused pure expression or super */ null && (['id', 'name', 'hp']));
const gainsEffectParams = (/* unused pure expression or super */ null && (['effectId', 'effect', 'duration', 'sourceId', 'source', 'targetId', 'target', 'count']));
const statusEffectExplicitParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'hp', 'maxHp', 'x', 'y', 'z', 'heading', 'data0', 'data1', 'data2', 'data3', 'data4']));
const losesEffectParams = (/* unused pure expression or super */ null && (['effectId', 'effect', 'sourceId', 'source', 'targetId', 'target', 'count']));
const tetherParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'targetId', 'target', 'id']));
const wasDefeatedParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'sourceId', 'source']));
const echoParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const dialogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const messageParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const gameLogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const gameNameLogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const statChangeParams = (/* unused pure expression or super */ null && (['job', 'strength', 'dexterity', 'vitality', 'intelligence', 'mind', 'piety', 'attackPower', 'directHit', 'criticalHit', 'attackMagicPotency', 'healMagicPotency', 'determination', 'skillSpeed', 'spellSpeed', 'tenacity']));
const changeZoneParams = (/* unused pure expression or super */ null && (['id', 'name']));
const network6dParams = (/* unused pure expression or super */ null && (['instance', 'command', 'data0', 'data1', 'data2', 'data3']));
const nameToggleParams = (/* unused pure expression or super */ null && (['id', 'name', 'toggle']));
// If NetRegexes.setFlagTranslationsNeeded is set to true, then any
// regex created that requires a translation will begin with this string
// and match the magicStringRegex.  This is maybe a bit goofy, but is
// a pretty straightforward way to mark regexes for translations.
// If issue #1306 is ever resolved, we can remove this.
const magicTranslationString = `^^`;
const magicStringRegex = /^\^\^/;
const keysThatRequireTranslation = [
    'ability',
    'name',
    'source',
    'target',
    'line',
];
const parseHelper = (params, funcName, fields) => {
    var _a, _b, _c, _d, _e, _f;
    params = params !== null && params !== void 0 ? params : {};
    const validFields = [];
    for (const value of Object.values(fields)) {
        if (typeof value !== 'object')
            continue;
        validFields.push(value.field);
    }
    _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.validateParams */ .Z.validateParams(params, funcName, ['capture', ...validFields]);
    // Find the last key we care about, so we can shorten the regex if needed.
    const capture = _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.trueIfUndefined */ .Z.trueIfUndefined(params.capture);
    const fieldKeys = Object.keys(fields);
    let maxKey;
    if (capture) {
        maxKey = fieldKeys[fieldKeys.length - 1];
    }
    else {
        maxKey = 0;
        for (const key of fieldKeys) {
            const value = (_a = fields[key]) !== null && _a !== void 0 ? _a : {};
            if (typeof value !== 'object')
                continue;
            const fieldName = (_b = fields[key]) === null || _b === void 0 ? void 0 : _b.field;
            if (fieldName && fieldName in params)
                maxKey = key;
        }
    }
    // For testing, it's useful to know if this is a regex that requires
    // translation.  We test this by seeing if there are any specified
    // fields, and if so, inserting a magic string that we can detect.
    // This lets us differentiate between "regex that should be translated"
    // e.g. a regex with `target` specified, and "regex that shouldn't"
    // e.g. a gains effect with just effectId specified.
    const transParams = Object.keys(params).filter((k) => keysThatRequireTranslation.includes(k));
    const needsTranslations = NetRegexes.flagTranslationsNeeded && transParams.length > 0;
    // Build the regex from the fields.
    let str = needsTranslations ? magicTranslationString : '^';
    let lastKey = -1;
    for (const _key in fields) {
        const key = parseInt(_key);
        // Fill in blanks.
        const missingFields = key - lastKey - 1;
        if (missingFields === 1)
            str += '\\y{NetField}';
        else if (missingFields > 1)
            str += `\\y{NetField}{${missingFields}}`;
        lastKey = key;
        const value = fields[key];
        if (typeof value !== 'object')
            throw new Error(`${funcName}: invalid value: ${JSON.stringify(value)}`);
        const fieldName = (_c = fields[key]) === null || _c === void 0 ? void 0 : _c.field;
        const fieldValue = (_f = (_e = (_d = fields[key]) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : matchDefault;
        if (fieldName) {
            str += _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.maybeCapture */ .Z.maybeCapture(
            // more accurate type instead of `as` cast
            // maybe this function needs a refactoring
            capture, fieldName, params[fieldName], fieldValue) +
                separator;
        }
        else {
            str += fieldValue + separator;
        }
        // Stop if we're not capturing and don't care about future fields.
        if (key >= (maxKey !== null && maxKey !== void 0 ? maxKey : 0))
            break;
    }
    return _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.parse */ .Z.parse(str);
};
class NetRegexes {
    static setFlagTranslationsNeeded(value) {
        NetRegexes.flagTranslationsNeeded = value;
    }
    static doesNetRegexNeedTranslation(regex) {
        // Need to `setFlagTranslationsNeeded` before calling this function.
        console.assert(NetRegexes.flagTranslationsNeeded);
        const str = typeof regex === 'string' ? regex : regex.source;
        return !!magicStringRegex.exec(str);
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting
     */
    static startsUsing(params) {
        return parseHelper(params, 'startsUsing', {
            0: { field: 'type', value: '20' },
            1: { field: 'timestamp' },
            2: { field: 'sourceId' },
            3: { field: 'source' },
            4: { field: 'id' },
            5: { field: 'ability' },
            6: { field: 'targetId' },
            7: { field: 'target' },
            8: { field: 'castTime' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
     */
    static ability(params) {
        return parseHelper(params, 'ability', {
            0: { field: 'type', value: '2[12]' },
            1: { field: 'timestamp' },
            2: { field: 'sourceId' },
            3: { field: 'source' },
            4: { field: 'id' },
            5: { field: 'ability' },
            6: { field: 'targetId' },
            7: { field: 'target' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
     */
    static abilityFull(params) {
        return parseHelper(params, 'abilityFull', {
            0: { field: 'type', value: '2[12]' },
            1: { field: 'timestamp' },
            2: { field: 'sourceId' },
            3: { field: 'source' },
            4: { field: 'id' },
            5: { field: 'ability' },
            6: { field: 'targetId' },
            7: { field: 'target' },
            8: { field: 'flags' },
            9: { field: 'damage' },
            24: { field: 'targetCurrentHp' },
            25: { field: 'targetMaxHp' },
            40: { field: 'x' },
            41: { field: 'y' },
            42: { field: 'z' },
            43: { field: 'heading' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1b-networktargeticon-head-markers
     */
    static headMarker(params) {
        return parseHelper(params, 'headMarker', {
            0: { field: 'type', value: '27' },
            1: { field: 'timestamp' },
            2: { field: 'targetId' },
            3: { field: 'target' },
            6: { field: 'id' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
     */
    static addedCombatant(params) {
        return parseHelper(params, 'addedCombatant', {
            0: { field: 'type', value: '03' },
            1: { field: 'timestamp' },
            2: { field: 'id' },
            3: { field: 'name' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
     */
    static addedCombatantFull(params) {
        return parseHelper(params, 'addedCombatantFull', {
            0: { field: 'type', value: '03' },
            1: { field: 'timestamp' },
            2: { field: 'id' },
            3: { field: 'name' },
            4: { field: 'job' },
            5: { field: 'level' },
            6: { field: 'ownerId' },
            8: { field: 'world' },
            9: { field: 'npcNameId' },
            10: { field: 'npcBaseId' },
            11: { field: 'currentHp' },
            12: { field: 'hp' },
            17: { field: 'x' },
            18: { field: 'y' },
            19: { field: 'z' },
            20: { field: 'heading' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#04-removecombatant
     */
    static removingCombatant(params) {
        return parseHelper(params, 'removingCombatant', {
            0: { field: 'type', value: '04' },
            1: { field: 'timestamp' },
            2: { field: 'id' },
            3: { field: 'name' },
            12: { field: 'hp' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1a-networkbuff
     */
    static gainsEffect(params) {
        return parseHelper(params, 'gainsEffect', {
            0: { field: 'type', value: '26' },
            1: { field: 'timestamp' },
            2: { field: 'effectId' },
            3: { field: 'effect' },
            4: { field: 'duration' },
            5: { field: 'sourceId' },
            6: { field: 'source' },
            7: { field: 'targetId' },
            8: { field: 'target' },
            9: { field: 'count' },
        });
    }
    /**
     * Prefer gainsEffect over this function unless you really need extra data.
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#26-networkstatuseffects
     */
    static statusEffectExplicit(params) {
        return parseHelper(params, 'statusEffectExplicit', {
            0: { field: 'type', value: '38' },
            1: { field: 'timestamp' },
            2: { field: 'targetId' },
            3: { field: 'target' },
            5: { field: 'hp' },
            6: { field: 'maxHp' },
            11: { field: 'x' },
            12: { field: 'y' },
            13: { field: 'z' },
            14: { field: 'heading' },
            15: { field: 'data0' },
            16: { field: 'data1' },
            17: { field: 'data2' },
            18: { field: 'data3' },
            19: { field: 'data4' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1e-networkbuffremove
     */
    static losesEffect(params) {
        return parseHelper(params, 'losesEffect', {
            0: { field: 'type', value: '30' },
            1: { field: 'timestamp' },
            2: { field: 'effectId' },
            3: { field: 'effect' },
            5: { field: 'sourceId' },
            6: { field: 'source' },
            7: { field: 'targetId' },
            8: { field: 'target' },
            9: { field: 'count' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#23-networktether
     */
    static tether(params) {
        return parseHelper(params, 'tether', {
            0: { field: 'type', value: '35' },
            1: { field: 'timestamp' },
            2: { field: 'sourceId' },
            3: { field: 'source' },
            4: { field: 'targetId' },
            5: { field: 'target' },
            8: { field: 'id' },
        });
    }
    /**
     * 'target' was defeated by 'source'
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#19-networkdeath
     */
    static wasDefeated(params) {
        return parseHelper(params, 'wasDefeated', {
            0: { field: 'type', value: '25' },
            1: { field: 'timestamp' },
            2: { field: 'targetId' },
            3: { field: 'target' },
            4: { field: 'sourceId' },
            5: { field: 'source' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static echo(params) {
        if (typeof params === 'undefined')
            params = {};
        _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.validateParams */ .Z.validateParams(params, 'echo', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
        params.code = '0038';
        return NetRegexes.gameLog(params);
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static dialog(params) {
        if (typeof params === 'undefined')
            params = {};
        _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.validateParams */ .Z.validateParams(params, 'dialog', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
        params.code = '0044';
        return NetRegexes.gameLog(params);
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static message(params) {
        if (typeof params === 'undefined')
            params = {};
        _regexes__WEBPACK_IMPORTED_MODULE_0__/* .default.validateParams */ .Z.validateParams(params, 'message', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
        params.code = '0839';
        return NetRegexes.gameLog(params);
    }
    /**
     * fields: code, name, line, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static gameLog(params) {
        return parseHelper(params, 'gameLog', {
            0: { field: 'type', value: '00' },
            1: { field: 'timestamp' },
            2: { field: 'code' },
            3: { field: 'name' },
            4: { field: 'line' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static gameNameLog(params) {
        // for compat with Regexes.
        return NetRegexes.gameLog(params);
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats
     */
    static statChange(params) {
        return parseHelper(params, 'statChange', {
            0: { field: 'type', value: '12' },
            1: { field: 'timestamp' },
            2: { field: 'job' },
            3: { field: 'strength' },
            4: { field: 'dexterity' },
            5: { field: 'vitality' },
            6: { field: 'intelligence' },
            7: { field: 'mind' },
            8: { field: 'piety' },
            9: { field: 'attackPower' },
            10: { field: 'directHit' },
            11: { field: 'criticalHit' },
            12: { field: 'attackMagicPotency' },
            13: { field: 'healMagicPotency' },
            14: { field: 'determination' },
            15: { field: 'skillSpeed' },
            16: { field: 'spellSpeed' },
            18: { field: 'tenacity' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#01-changezone
     */
    static changeZone(params) {
        return parseHelper(params, 'changeZone', {
            0: { field: 'type', value: '01' },
            1: { field: 'timestamp' },
            2: { field: 'id' },
            3: { field: 'name' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#21-network6d-actor-control-lines
     */
    static network6d(params) {
        return parseHelper(params, 'network6d', {
            0: { field: 'type', value: '33' },
            1: { field: 'timestamp' },
            2: { field: 'instance' },
            3: { field: 'command' },
            4: { field: 'data0' },
            5: { field: 'data1' },
            6: { field: 'data2' },
            7: { field: 'data3' },
        });
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#22-networknametoggle
     */
    static nameToggle(params) {
        return parseHelper(params, 'nameToggle', {
            0: { field: 'type', value: '34' },
            1: { field: 'timestamp' },
            2: { field: 'id' },
            3: { field: 'name' },
            6: { field: 'toggle' },
        });
    }
}
NetRegexes.flagTranslationsNeeded = false;


/***/ }),

/***/ 500:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": () => (/* binding */ UnreachableCode)
/* harmony export */ });
// Helper Error for TypeScript situations where the programmer thinks they
// know better than TypeScript that some situation will never occur.
// The intention here is that the programmer does not expect a particular
// bit of code to happen, and so has not written careful error handling.
// If it does occur, at least there will be an error and we can figure out why.
// This is preferable to casting or disabling TypeScript altogether in order to
// avoid syntax errors.
// One common example is a regex, where if the regex matches then all of the
// (non-optional) regex groups will also be valid, but TypeScript doesn't know.
class UnreachableCode extends Error {
    constructor() {
        super('This code shouldn\'t be reached');
    }
}


/***/ }),

/***/ 273:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Output strings for now require a field for every language, so this is a
// helper function to generate one for literal numbers.
const numberToOutputString = function (n) {
    const str = n.toString();
    return {
        en: str,
        de: str,
        fr: str,
        ja: str,
        cn: str,
        ko: str,
    };
};
// General guidelines:
// * property names should closely match English text
// * use OnPlayer suffix for things with `${player}`
// * use OnTarget suffix for things with `${name}`
// * any other parameters (of which there are none, currently) should use consistent suffixes.
// * the value of each property should be a single object with localized keys
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    aoe: {
        en: 'aoe',
        de: 'AoE',
        fr: 'AoE',
        ja: 'AoE',
        cn: 'AoE',
        ko: '전체 공격',
    },
    bigAoe: {
        en: 'big aoe!',
        de: 'Große AoE!',
        fr: 'Grosse AoE !',
        ja: '大ダメージAoE',
        cn: '大AoE伤害！',
        ko: '강한 전체 공격!',
    },
    tankBuster: {
        en: 'Tank Buster',
        de: 'Tank buster',
        fr: 'Tank buster',
        ja: 'タンクバスター',
        cn: '坦克死刑',
        ko: '탱버',
    },
    miniBuster: {
        en: 'Mini Buster',
        de: 'Kleiner Tankbuster',
        fr: 'Mini Buster',
        ja: 'ミニバスター',
        cn: '小死刑',
        ko: '약한 탱버',
    },
    tankBusterOnPlayer: {
        en: 'Tank Buster on ${player}',
        de: 'Tank buster auf ${player}',
        fr: 'Tank buster sur ${player}',
        ja: '${player}にタンクバスター',
        cn: '死刑 点 ${player}',
        ko: '"${player}" 탱버',
    },
    tankBusterOnYou: {
        en: 'Tank Buster on YOU',
        de: 'Tank buster auf DIR',
        fr: 'Tank buster sur VOUS',
        ja: '自分にタンクバスター',
        cn: '死刑点名',
        ko: '탱버 대상자',
    },
    // when there are multiple tankbusters going out
    tankBusters: {
        en: 'Tank Busters',
        de: 'Tank buster',
        fr: 'Tank busters',
        ja: 'タンクバスター',
        cn: '坦克死刑',
        ko: '탱버',
    },
    tankCleave: {
        en: 'Tank cleave',
        de: 'Tank Cleave',
        fr: 'Tank cleave',
        ja: '前方範囲攻撃',
        cn: '顺劈',
        ko: '광역 탱버',
    },
    avoidTankCleave: {
        en: 'Avoid tank cleave',
        de: 'Tank Cleave ausweichen',
        fr: 'Évitez le tank cleave',
        ja: '前方範囲攻撃を避ける',
        cn: '远离顺劈',
        ko: '광역 탱버 피하기',
    },
    tankCleaveOnYou: {
        en: 'Tank cleave on YOU',
        de: 'Tank Cleave aud DIR',
        fr: 'Tank cleave sur VOUS',
        ja: '自分に前方範囲攻撃',
        cn: '顺劈点名',
        ko: '나에게 광역 탱버',
    },
    tankSwap: {
        en: 'Tank Swap!',
        de: 'Tankwechsel!',
        fr: 'Tank swap !',
        ja: 'タンクスイッチ!',
        cn: '换T！',
        ko: '탱 교대',
    },
    spread: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
        ja: '散開',
        cn: '分散',
        ko: '산개',
    },
    stackMarker: {
        // for stack marker situations
        en: 'Stack',
        de: 'Sammeln',
        fr: 'Packez-vous',
        ja: '頭割り',
        cn: '分摊',
        ko: '쉐어뎀',
    },
    getTogether: {
        // for getting together without stack marker
        en: 'Stack',
        de: 'Sammeln',
        fr: 'Packez-vous',
        ja: '集合',
        cn: '集合',
        ko: '쉐어뎀',
    },
    stackOnYou: {
        en: 'Stack on YOU',
        de: 'Auf DIR sammeln',
        fr: 'Package sur VOUS',
        ja: '自分に集合',
        cn: '集合点名',
        ko: '쉐어징 대상자',
    },
    stackOnPlayer: {
        en: 'Stack on ${player}',
        de: 'Auf ${player} sammeln',
        fr: 'Packez-vous sur ${player}',
        ja: '${player}に集合',
        cn: '靠近 ${player}集合',
        ko: '"${player}" 쉐어징',
    },
    stackMiddle: {
        en: 'Stack in middle',
        de: 'In der Mitte sammeln',
        fr: 'Packez-vous au milieu',
        ja: '中央で集合',
        cn: '中间集合',
        ko: '중앙에서 모이기',
    },
    doritoStack: {
        en: 'Dorito Stack',
        de: 'Mit Marker sammeln',
        fr: 'Packez les marquages',
        ja: 'マーカー付けた人と集合',
        cn: '点名集合',
        ko: '징끼리 모이기',
    },
    spreadThenStack: {
        en: 'Spread => Stack',
        de: 'Verteilen => Sammeln',
        fr: 'Dispersion => Package',
        ja: '散開 => 集合',
        cn: '分散 => 集合',
        ko: '산개 => 집합',
    },
    stackThenSpread: {
        en: 'Stack => Spread',
        de: 'Sammeln => Verteilen',
        fr: 'Package => Dispersion',
        ja: 'スタック => 散開',
        cn: '集合 => 分散',
        ko: '집합 => 산개',
    },
    knockback: {
        en: 'Knockback',
        de: 'Rückstoß',
        fr: 'Poussée',
        ja: 'ノックバック',
        cn: '击退',
        ko: '넉백',
    },
    knockbackOnYou: {
        en: 'Knockback on YOU',
        de: 'Rückstoß auf DIR',
        fr: 'Poussée sur VOUS',
        ja: '自分にノックバック',
        cn: '击退点名',
        ko: '넉백징 대상자',
    },
    knockbackOnPlayer: {
        en: 'Knockback on ${player}',
        de: 'Rückstoß auf ${player}',
        fr: 'Poussée sur ${player}',
        ja: '${player}にノックバック',
        cn: '击退点名${player}',
        ko: '"${player}" 넉백징',
    },
    lookTowardsBoss: {
        en: 'Look Towards Boss',
        de: 'Anschauen Boss',
        fr: 'Regardez le boss',
        ja: 'ボスを見る',
        cn: '面向Boss',
        ko: '쳐다보기',
    },
    lookAway: {
        en: 'Look Away',
        de: 'Wegschauen',
        fr: 'Regardez ailleurs',
        ja: 'ボスを見ない',
        cn: '背对Boss',
        ko: '뒤돌기',
    },
    lookAwayFromPlayer: {
        en: 'Look Away from ${player}',
        de: 'Schau weg von ${player}',
        fr: 'Ne regardez pas ${player}',
        ja: '${player}を見ない',
        cn: '背对${player}',
        ko: '${player}에게서 뒤돌기',
    },
    lookAwayFromTarget: {
        en: 'Look Away from ${name}',
        de: 'Schau weg von ${name}',
        fr: 'Ne regardez pas ${name}',
        ja: '${name}を見ない',
        cn: '背对${name}',
        ko: '${name}에게서 뒤돌기',
    },
    getBehind: {
        en: 'Get Behind',
        de: 'Hinter ihn',
        fr: 'Passez derrière',
        ja: '背面へ',
        cn: '去背后',
        ko: '보스 뒤로',
    },
    goFrontOrSides: {
        en: 'Go Front / Sides',
        de: 'Gehe nach Vorne/ zu den Seiten',
        fr: 'Allez Devant / Côtés',
        ja: '前／横へ',
        cn: '去前侧方',
        ko: '보스 후방 피하기',
    },
    goFront: {
        en: 'Go Front',
        de: 'Geh nach vorn',
        fr: 'Allez Devant',
        ja: '前へ',
        cn: '去前面',
        ko: '앞으로',
    },
    // getUnder is used when you have to get into the bosses hitbox
    getUnder: {
        en: 'Get Under',
        de: 'Unter ihn',
        fr: 'En dessous',
        ja: 'ボスに貼り付く',
        cn: '去脚下',
        ko: '보스 아래로',
    },
    // in is more like "get close but maybe even melee range is fine"
    in: {
        en: 'In',
        de: 'Rein',
        fr: 'Intérieur',
        ja: '中へ',
        cn: '靠近',
        ko: '안으로',
    },
    // out means get far away
    out: {
        en: 'Out',
        de: 'Raus',
        fr: 'Exterieur',
        ja: '外へ',
        cn: '远离',
        ko: '밖으로',
    },
    outOfMelee: {
        en: 'Out of melee',
        de: 'Raus aus Nahkampf',
        fr: 'Sortez de la mêlée',
        ja: '近接最大レンジ',
        cn: '近战最远距离回避',
        ko: '근접범위 밖으로',
    },
    inThenOut: {
        en: 'In, then out',
        de: 'Rein, dann raus',
        fr: 'Intérieur, puis extérieur',
        ja: '中 => 外',
        cn: '先靠近，再远离',
        ko: '안으로 => 밖으로',
    },
    outThenIn: {
        en: 'Out, then in',
        de: 'Raus, dann rein',
        fr: 'Extérieur, puis intérieur',
        ja: '外 => 中',
        cn: '先远离，再靠近',
        ko: '밖으로 => 안으로',
    },
    backThenFront: {
        en: 'Back Then Front',
        de: 'Nach Hinten, danach nach Vorne',
        fr: 'Derrière puis devant',
        ja: '後ろ => 前',
        cn: '后 => 前',
        ko: '뒤로 => 앞으로',
    },
    frontThenBack: {
        en: 'Front Then Back',
        de: 'Nach Vorne, danach nach Hinten',
        fr: 'Devant puis derrière',
        ja: '前 => 後ろ',
        cn: '前 => 后',
        ko: '앞으로 => 뒤로',
    },
    goIntoMiddle: {
        en: 'go into middle',
        de: 'in die Mitte gehen',
        fr: 'Allez au milieu',
        ja: '中へ',
        cn: '去中间',
        ko: '중앙으로',
    },
    right: {
        en: 'Right',
        de: 'Rechts',
        fr: 'À droite',
        ja: '右へ',
        cn: '右',
        ko: '오른쪽',
    },
    left: {
        en: 'Left',
        de: 'Links',
        fr: 'À gauche',
        ja: '左へ',
        cn: '左',
        ko: '왼쪽',
    },
    getLeftAndWest: {
        en: '<= Get Left/West',
        de: '<= Nach Links/Westen',
        fr: '<= Allez à Gauche/Ouest',
        ja: '<= 左/西へ',
        cn: '<= 去左/西边',
        ko: '<= 왼쪽으로',
    },
    getRightAndEast: {
        en: 'Get Right/East =>',
        de: 'Nach Rechts/Osten =>',
        fr: 'Allez à Droite/Est =>',
        ja: '右/東へ =>',
        cn: '去右/东边 =>',
        ko: '오른쪽으로 =>',
    },
    goFrontBack: {
        en: 'Go Front/Back',
        de: 'Geh nach Vorne/Hinten',
        fr: 'Allez Devant/Derrière',
        ja: '縦へ',
        cn: '去前后',
        ko: '앞/뒤로',
    },
    sides: {
        en: 'Sides',
        de: 'Seiten',
        fr: 'Côtés',
        ja: '横へ',
        cn: '去侧面',
        ko: '양옆으로',
    },
    middle: {
        en: 'Middle',
        de: 'Mitte',
        fr: 'Milieu',
        ja: '中へ',
        cn: '中间',
        ko: '중앙',
    },
    // killAdds is used for adds that will always be available
    killAdds: {
        en: 'Kill adds',
        de: 'Adds besiegen',
        fr: 'Tuez les adds',
        ja: '雑魚を処理',
        cn: '击杀小怪',
        ko: '쫄 잡기',
    },
    // killExtraAdd is used for adds that appear if a mechanic was not played correctly
    killExtraAdd: {
        en: 'Kill Extra Add',
        de: 'Add besiegen',
        fr: 'Tuez l\'add',
        ja: '雑魚を倒す',
        cn: '击杀小怪',
        ko: '쫄 잡기',
    },
    awayFromFront: {
        en: 'Away From Front',
        de: 'Weg von Vorne',
        fr: 'Éloignez-vous du devant',
        ja: '前方から離れる',
        cn: '远离正面',
        ko: '보스 전방 피하기',
    },
    sleepTarget: {
        en: 'Sleep ${name}',
        de: 'Schlaf auf ${name}',
        fr: 'Sommeil sur ${name}',
        ja: '${name} にスリプル',
        cn: '催眠 ${name}',
        ko: '${name} 슬리플',
    },
    stunTarget: {
        en: 'Stun ${name}',
        de: 'Betäubung auf ${name}',
        fr: 'Étourdissez ${name}',
        ja: '${name} にスタン',
        cn: '眩晕 ${name}',
        ko: '${name}기절',
    },
    interruptTarget: {
        en: 'interrupt ${name}',
        de: 'unterbreche ${name}',
        fr: 'Interrompez ${name}',
        ja: '${name} に沈黙',
        cn: '打断${name}',
        ko: '${name}기술 시전 끊기',
    },
    preyOnYou: {
        en: 'Prey on YOU',
        de: 'Marker auf DIR',
        fr: 'Marquage sur VOUS',
        ja: '自分に捕食',
        cn: '掠食点名',
        ko: '홍옥징 대상자',
    },
    preyOnPlayer: {
        en: 'Prey on ${player}',
        de: 'Marker auf ${player}',
        fr: 'Marquage sur ${player}',
        ja: '${player}に捕食',
        cn: '掠食点名${player}',
        ko: '"${player}" 홍옥징',
    },
    awayFromGroup: {
        en: 'Away from Group',
        de: 'Weg von der Gruppe',
        fr: 'Éloignez-vous du groupe',
        ja: '外へ',
        cn: '远离人群',
        ko: '다른 사람들이랑 떨어지기',
    },
    awayFromPlayer: {
        en: 'Away from ${player}',
        de: 'Weg von ${player}',
        fr: 'Éloignez-vous de ${player}',
        ja: '${player}から離れる',
        cn: '远离${player}',
        ko: '"${player}"에서 멀어지기',
    },
    meteorOnYou: {
        en: 'Meteor on YOU',
        de: 'Meteor auf DIR',
        fr: 'Météore sur VOUS',
        ja: '自分にメテオ',
        cn: '陨石点名',
        ko: '나에게 메테오징',
    },
    stopMoving: {
        en: 'Stop Moving!',
        de: 'Bewegung stoppen!',
        fr: 'Ne bougez pas !',
        ja: '移動禁止！',
        cn: '停止移动！',
        ko: '이동 멈추기!',
    },
    stopEverything: {
        en: 'Stop Everything!',
        de: 'Stoppe Alles!',
        fr: 'Arrêtez TOUT !',
        ja: '行動禁止！',
        cn: '停止行动！',
        ko: '행동 멈추기!',
    },
    moveAway: {
        // move away to dodge aoes
        en: 'Move!',
        de: 'Bewegen!',
        fr: 'Bougez !',
        ja: '避けて！',
        cn: '快躲开！',
        ko: '이동하기!',
    },
    moveAround: {
        // move around (e.g. jumping) to avoid being frozen
        en: 'Move!',
        de: 'Bewegen!',
        fr: 'Bougez !',
        ja: '動く！',
        cn: '快动！',
        ko: '움직이기!',
    },
    breakChains: {
        en: 'Break chains',
        de: 'Kette zerbrechen',
        fr: 'Brisez les chaines',
        ja: '線を切る',
        cn: '切断连线',
        ko: '선 끊기',
    },
    moveChainsTogether: {
        en: 'Move chains together',
        de: 'Ketten zusammen bewegen',
        fr: 'Bougez les chaines ensemble',
        ja: '線同士一緒に移動',
        cn: '连线一起移动',
        ko: '선 붙어서 같이 움직이기',
    },
    earthshakerOnYou: {
        en: 'Earth Shaker on YOU',
        de: 'Erdstoß auf DIR',
        fr: 'Marque de terre sur VOUS',
        ja: '自分にアースシェイカー',
        cn: '大地摇动点名',
        ko: '어스징 대상자',
    },
    wakeUp: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'RÉVEILLES-TOI',
        ja: '目を覚まして！',
        cn: '醒醒！动一动！！',
        ko: '강제 퇴장 7분 전',
    },
    closeTethersWithPlayer: {
        en: 'Close Tethers (${player})',
        de: 'Nahe Verbindungen (${player})',
        fr: 'Liens proches avec (${player})',
        ja: '(${player})に近づく',
        cn: '靠近连线 (${player})',
        ko: '상대와 가까이 붙기 (${player})',
    },
    farTethersWithPlayer: {
        en: 'Far Tethers (${player})',
        de: 'Entfernte Verbindungen (${player})',
        fr: 'Liens éloignés avec (${player})',
        ja: ' (${player})から離れる',
        cn: '远离连线 (${player})',
        ko: '상대와 떨어지기 (${player})',
    },
    unknown: {
        en: '???',
        de: '???',
        fr: '???',
        ja: '???',
        cn: '???',
        ko: '???',
    },
    north: {
        en: 'North',
        de: 'Norden',
        fr: 'Nord',
        ja: '北',
        cn: '上(北)',
        ko: '북쪽',
    },
    south: {
        en: 'South',
        de: 'Süden',
        fr: 'Sud',
        ja: '南',
        cn: '下(南)',
        ko: '남쪽',
    },
    east: {
        en: 'East',
        de: 'Osten',
        fr: 'Est',
        ja: '東',
        cn: '右(东)',
        ko: '동쪽',
    },
    west: {
        en: 'West',
        de: 'Westen',
        fr: 'Ouest',
        ja: '西',
        cn: '左(西)',
        ko: '서쪽',
    },
    northwest: {
        en: 'Northwest',
        de: 'Nordwesten',
        fr: 'nord-ouest',
        ja: '北西',
        cn: '左上(西北)',
        ko: '북서',
    },
    northeast: {
        en: 'Northeast',
        de: 'Nordosten',
        fr: 'nord-est',
        ja: '北東',
        cn: '右上(东北)',
        ko: '북동',
    },
    southwest: {
        en: 'Southwest',
        de: 'Südwesten',
        fr: 'sud-ouest',
        ja: '南西',
        cn: '左下(西南)',
        ko: '남서',
    },
    southeast: {
        en: 'Southeast',
        de: 'Südosten',
        fr: 'sud-est',
        ja: '南東',
        cn: '右下(东南)',
        ko: '남동',
    },
    dirN: {
        en: 'N',
        de: 'N',
        fr: 'N',
        ja: '北',
        cn: '上(北)',
        ko: '북쪽',
    },
    dirS: {
        en: 'S',
        de: 'S',
        fr: 'S',
        ja: '南',
        cn: '下(南)',
        ko: '남쪽',
    },
    dirE: {
        en: 'E',
        de: 'O',
        fr: 'E',
        ja: '東',
        cn: '右(东)',
        ko: '동쪽',
    },
    dirW: {
        en: 'W',
        de: 'W',
        fr: 'O',
        ja: '西',
        cn: '左(西)',
        ko: '서쪽',
    },
    dirNW: {
        en: 'NW',
        de: 'NW',
        fr: 'NO',
        ja: '北西',
        cn: '左上(西北)',
        ko: '북서',
    },
    dirNE: {
        en: 'NE',
        de: 'NO',
        fr: 'NE',
        ja: '北東',
        cn: '右上(东北)',
        ko: '북동',
    },
    dirSW: {
        en: 'SW',
        de: 'SW',
        fr: 'SO',
        ja: '南西',
        cn: '左下(西南)',
        ko: '남서',
    },
    dirSE: {
        en: 'SE',
        de: 'SO',
        fr: 'SE',
        ja: '南東',
        cn: '右下(东南)',
        ko: '남동',
    },
    // Literal numbers.
    num0: numberToOutputString(0),
    num1: numberToOutputString(1),
    num2: numberToOutputString(2),
    num3: numberToOutputString(3),
    num4: numberToOutputString(4),
    num5: numberToOutputString(5),
    num6: numberToOutputString(6),
    num7: numberToOutputString(7),
    num8: numberToOutputString(8),
    num9: numberToOutputString(9),
});


/***/ }),

/***/ 906:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PS": () => (/* binding */ addOverlayListener),
/* harmony export */   "ae": () => (/* binding */ callOverlayHandler),
/* harmony export */   "GL": () => (/* binding */ setCallOverlayHandlerOverride)
/* harmony export */ });
/* unused harmony exports dispatchOverlayEvent, removeOverlayListener, init */
// OverlayPlugin API setup
let inited = false;
let wsUrl = null;
let ws = null;
let queue = [];
let rseqCounter = 0;
const responsePromises = {};
const subscribers = {};
const sendMessage = (msg, cb) => {
    if (ws) {
        if (queue)
            queue.push(msg);
        else
            ws.send(JSON.stringify(msg));
    }
    else {
        if (queue)
            queue.push([msg, cb]);
        else
            window.OverlayPluginApi.callHandler(JSON.stringify(msg), cb);
    }
};
const processEvent = (msg) => {
    init();
    const subs = subscribers[msg.type];
    subs === null || subs === void 0 ? void 0 : subs.forEach((sub) => sub(msg));
};
const dispatchOverlayEvent = processEvent;
const addOverlayListener = (event, cb) => {
    var _a;
    init();
    if (!subscribers[event]) {
        subscribers[event] = [];
        if (!queue) {
            sendMessage({
                call: 'subscribe',
                events: [event],
            });
        }
    }
    (_a = subscribers[event]) === null || _a === void 0 ? void 0 : _a.push(cb);
};
const removeOverlayListener = (event, cb) => {
    init();
    if (subscribers[event]) {
        const list = subscribers[event];
        const pos = list === null || list === void 0 ? void 0 : list.indexOf(cb);
        if (pos && pos > -1)
            list === null || list === void 0 ? void 0 : list.splice(pos, 1);
    }
};
const callOverlayHandlerInternal = (_msg) => {
    init();
    const msg = {
        ..._msg,
        rseq: 0,
    };
    let p;
    if (ws) {
        msg.rseq = rseqCounter++;
        p = new Promise((resolve) => {
            responsePromises[msg.rseq] = resolve;
        });
        sendMessage(msg);
    }
    else {
        p = new Promise((resolve) => {
            sendMessage(msg, (data) => {
                resolve(data === null ? null : JSON.parse(data));
            });
        });
    }
    return p;
};
let callOverlayHandlerOverride;
const callOverlayHandler = (_msg) => {
    init();
    if (callOverlayHandlerOverride) {
        return callOverlayHandlerOverride(_msg);
    }
    return callOverlayHandlerInternal(_msg);
};
const setCallOverlayHandlerOverride = (override) => {
    callOverlayHandlerOverride = override;
    return callOverlayHandlerInternal;
};
const init = () => {
    if (inited)
        return;
    if (typeof window !== 'undefined') {
        wsUrl = /[\?&]OVERLAY_WS=([^&]+)/.exec(window.location.href);
        if (wsUrl) {
            const connectWs = function () {
                ws = new WebSocket(wsUrl === null || wsUrl === void 0 ? void 0 : wsUrl[1]);
                ws.addEventListener('error', (e) => {
                    console.error(e);
                });
                ws.addEventListener('open', () => {
                    console.log('Connected!');
                    const q = queue !== null && queue !== void 0 ? queue : [];
                    queue = null;
                    sendMessage({
                        call: 'subscribe',
                        events: Object.keys(subscribers),
                    });
                    for (const msg of q) {
                        if (!Array.isArray(msg))
                            sendMessage(msg);
                    }
                });
                ws.addEventListener('message', (_msg) => {
                    var _a;
                    try {
                        const msg = JSON.parse(_msg.data);
                        if (msg.rseq !== undefined && responsePromises[msg.rseq]) {
                            (_a = responsePromises[msg.rseq]) === null || _a === void 0 ? void 0 : _a.call(responsePromises, msg);
                            delete responsePromises[msg.rseq];
                        }
                        else {
                            processEvent(msg);
                        }
                    }
                    catch (e) {
                        console.error('Invalid message received: ', _msg);
                        return;
                    }
                });
                ws.addEventListener('close', () => {
                    queue = null;
                    console.log('Trying to reconnect...');
                    // Don't spam the server with retries.
                    setTimeout(() => {
                        connectWs();
                    }, 300);
                });
            };
            connectWs();
        }
        else {
            const waitForApi = function () {
                if (!window.OverlayPluginApi || !window.OverlayPluginApi.ready) {
                    setTimeout(waitForApi, 300);
                    return;
                }
                const q = queue !== null && queue !== void 0 ? queue : [];
                queue = null;
                window.__OverlayCallback = processEvent;
                sendMessage({
                    call: 'subscribe',
                    events: Object.keys(subscribers),
                });
                for (const item of q) {
                    if (Array.isArray(item))
                        sendMessage(item[0], item[1]);
                }
            };
            waitForApi();
        }
        // Here the OverlayPlugin API is registered to the window object,
        // but this is mainly for backwards compatibility.For cactbot's built-in files,
        // it is recommended to use the various functions exported in resources/overlay_plugin_api.ts.
        window.addOverlayListener = addOverlayListener;
        window.removeOverlayListener = removeOverlayListener;
        window.callOverlayHandler = callOverlayHandler;
        window.dispatchOverlayEvent = dispatchOverlayEvent;
    }
    inited = true;
};


/***/ }),

/***/ 201:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Regexes)
/* harmony export */ });
const startsUsingParams = ['timestamp', 'source', 'id', 'ability', 'target', 'capture'];
const abilityParams = ['timestamp', 'source', 'sourceId', 'id', 'ability', 'targetId', 'target', 'capture'];
const abilityFullParams = [
    'timestamp',
    'sourceId',
    'source',
    'id',
    'ability',
    'targetId',
    'target',
    'flags',
    'flag0',
    'flag1',
    'flag2',
    'flag3',
    'flag4',
    'flag5',
    'flag6',
    'flag7',
    'flag8',
    'flag9',
    'flag10',
    'flag11',
    'flag12',
    'flag13',
    'flag14',
    'targetHp',
    'targetMaxHp',
    'targetMp',
    'targetMaxMp',
    'targetX',
    'targetY',
    'targetZ',
    'targetHeading',
    'hp',
    'maxHp',
    'mp',
    'maxMp',
    'x',
    'y',
    'z',
    'heading',
    'capture',
];
const headMarkerParams = ['timestamp', 'targetId', 'target', 'id', 'capture'];
const addedCombatantParams = ['timestamp', 'name', 'capture'];
const addedCombatantFullParams = [
    'timestamp',
    'id',
    'name',
    'job',
    'level',
    'hp',
    'x',
    'y',
    'z',
    'npcId',
    'capture',
];
const removingCombatantParams = [
    'timestamp',
    'id',
    'name',
    'hp',
    'x',
    'y',
    'z',
    'capture',
];
const gainsEffectParams = ['timestamp', 'targetId', 'target', 'effect', 'source', 'duration', 'capture'];
const statusEffectExplicitParams = [
    'timestamp',
    'targetId',
    'target',
    'job',
    'hp',
    'maxHp',
    'mp',
    'maxMp',
    'x',
    'y',
    'z',
    'heading',
    'data0',
    'data1',
    'data2',
    'data3',
    'data4',
    'capture',
];
const losesEffectParams = ['timestamp', 'targetId', 'target', 'effect', 'source', 'capture'];
const statChangeParams = [
    'timestamp',
    'job',
    'strength',
    'dexterity',
    'vitality',
    'intelligence',
    'mind',
    'piety',
    'attackPower',
    'directHit',
    'criticalHit',
    'attackMagicPotency',
    'healMagicPotency',
    'determination',
    'skillSpeed',
    'spellSpeed',
    'tenacity',
    'capture',
];
const tetherParams = ['timestamp', 'source', 'sourceId', 'target', 'targetId', 'id', 'capture'];
const wasDefeatedParams = ['timestamp', 'target', 'source', 'capture'];
const hasHPParams = ['timestamp', 'name', 'hp', 'capture'];
const echoParams = ['timestamp', 'code', 'line', 'capture'];
const dialogParams = ['timestamp', 'code', 'line', 'name', 'capture'];
const messageParams = ['timestamp', 'code', 'line', 'capture'];
const gameLogParams = ['timestamp', 'code', 'line', 'capture'];
const gameNameLogParams = ['timestamp', 'code', 'name', 'line', 'capture'];
const changeZoneParams = ['timestamp', 'name', 'capture'];
const network6dParams = ['timestamp', 'instance', 'command', 'data0', 'data1', 'data2', 'data3', 'capture'];
class Regexes {
    /**
     * fields: source, id, ability, target, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting
     */
    static startsUsing(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'startsUsing', startsUsingParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 14:' +
            Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':';
        if (f.source || f.id || f.target || capture)
            str += Regexes.maybeCapture(capture, 'source', f.source, '.*?') + ' starts using ';
        if (f.ability || f.target || capture)
            str += Regexes.maybeCapture(capture, 'ability', f.ability, '.*?') + ' on ';
        if (f.target || capture)
            str += Regexes.maybeCapture(capture, 'target', f.target, '.*?') + '\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: sourceId, source, id, ability, targetId, target, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
     */
    static ability(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'ability', abilityParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 1[56]:' + Regexes.maybeCapture(capture, 'sourceId', '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':';
        if (f.id || f.ability || f.target || f.targetId || capture)
            str += Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':';
        if (f.ability || f.target || f.targetId || capture)
            str += Regexes.maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':';
        if (f.target || f.targetId || capture)
            str += Regexes.maybeCapture(capture, 'targetId', '\\y{ObjectId}') + ':';
        if (f.target || capture)
            str += Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':';
        return Regexes.parse(str);
    }
    /**
     * fields: sourceId, source, id, ability, targetId, target, flags, x, y, z, heading, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
     */
    static abilityFull(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'abilityFull', abilityFullParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 1[56]:' +
            Regexes.maybeCapture(capture, 'sourceId', f.sourceId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':' +
            Regexes.maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flags', f.flags, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag0', f.flag0, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag1', f.flag1, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag2', f.flag2, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag3', f.flag3, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag4', f.flag4, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag5', f.flag5, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag6', f.flag6, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag7', f.flag7, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag8', f.flag8, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag9', f.flag9, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag10', f.flag10, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag11', f.flag11, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag12', f.flag12, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag13', f.flag13, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'flag14', f.flag13, '[^:]*?') + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetHp', f.targetHp, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetMaxHp', f.targetMaxHp, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetMp', f.targetMp, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetMaxMp', f.targetMaxMp, '\\y{Float}')) + ':' +
            Regexes.optional('\\y{Float}') + ':' + // Target TP
            Regexes.optional('\\y{Float}') + ':' + // Target Max TP
            Regexes.optional(Regexes.maybeCapture(capture, 'targetX', f.targetX, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetY', f.targetY, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetZ', f.targetZ, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'targetHeading', f.targetHeading, '\\y{Float}')) + ':' +
            Regexes.maybeCapture(capture, 'hp', f.hp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'maxHp', f.maxHp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'mp', f.mp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'maxMp', f.maxMp, '\\y{Float}') + ':' +
            '\\y{Float}:' + // Source TP
            '\\y{Float}:' + // Source Max TP
            Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'heading', f.heading, '\\y{Float}') + ':' +
            '.*?$'; // Unknown last field
        return Regexes.parse(str);
    }
    /**
     * fields: targetId, target, id, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1b-networktargeticon-head-markers
     */
    static headMarker(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'headMarker', headMarkerParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 1B:' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':....:....:' +
            Regexes.maybeCapture(capture, 'id', f.id, '....') + ':';
        return Regexes.parse(str);
    }
    // fields: name, capture
    // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
    static addedCombatant(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'addedCombatant', addedCombatantParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 03:\\y{ObjectId}:Added new combatant ' +
            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: id, name, hp, x, y, z, npcId, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
     */
    static addedCombatantFull(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'addedCombatantFull', addedCombatantFullParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 03:' + Regexes.maybeCapture(capture, 'id', f.id, '\\y{ObjectId}') +
            ':Added new combatant ' + Regexes.maybeCapture(capture, 'name', f.name, '[^:]*?') +
            '\\. {2}Job: ' + Regexes.maybeCapture(capture, 'job', f.job, '[^:]*?') +
            ' Level: ' + Regexes.maybeCapture(capture, 'level', f.level, '[^:]*?') +
            ' Max HP: ' + Regexes.maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\.' +
            '.*?Pos: \\(' +
            Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ',' +
            Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ',' +
            Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + '\\)' +
            '(?: \\(' + Regexes.maybeCapture(capture, 'npcId', f.npcId, '.*?') + '\\))?\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: id, name, hp, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#04-removecombatant
     */
    static removingCombatant(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'removingCombatant', removingCombatantParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 04:' + Regexes.maybeCapture(capture, 'id', '\\y{ObjectId}') +
            ':Removing combatant ' +
            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.' +
            '.*?Max HP: ' + Regexes.maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\.' +
            Regexes.optional('.*?Pos: \\(' +
                Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ',' +
                Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ',' +
                Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + '\\)');
        return Regexes.parse(str);
    }
    // fields: targetId, target, effect, source, duration, capture
    // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1a-networkbuff
    static gainsEffect(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'gainsEffect', gainsEffectParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 1A:' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
            ' gains the effect of ' +
            Regexes.maybeCapture(capture, 'effect', f.effect, '.*?') +
            ' from ' +
            Regexes.maybeCapture(capture, 'source', f.source, '.*?') +
            ' for ' +
            Regexes.maybeCapture(capture, 'duration', f.duration, '\\y{Float}') +
            ' Seconds\\.';
        return Regexes.parse(str);
    }
    /**
     * Prefer gainsEffect over this function unless you really need extra data.
     * fields: targetId, target, job, hp, maxHp, mp, maxMp, x, y, z, heading,
     *         data0, data1, data2, data3, data4
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#26-networkstatuseffects
     */
    static statusEffectExplicit(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'statusEffectExplicit', statusEffectExplicitParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const kField = '.*?:';
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 26:' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +
            '[0-9A-F]{0,6}' + Regexes.maybeCapture(capture, 'job', f.job, '[0-9A-F]{0,2}') + ':' +
            Regexes.maybeCapture(capture, 'hp', f.hp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'maxHp', f.maxHp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'mp', f.mp, '\\y{Float}') + ':' +
            Regexes.maybeCapture(capture, 'maxMp', f.maxMp, '\\y{Float}') + ':' +
            kField + // tp lol
            kField + // max tp extra lol
            // x, y, z heading may be blank
            Regexes.optional(Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}')) + ':' +
            Regexes.optional(Regexes.maybeCapture(capture, 'heading', f.heading, '\\y{Float}')) + ':' +
            Regexes.maybeCapture(capture, 'data0', f.data0, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'data1', f.data1, '[^:]*?') + ':' +
            // data2, 3, 4 may not exist and the line may terminate.
            Regexes.optional(Regexes.maybeCapture(capture, 'data2', f.data2, '[^:]*?') + ':') +
            Regexes.optional(Regexes.maybeCapture(capture, 'data3', f.data3, '[^:]*?') + ':') +
            Regexes.optional(Regexes.maybeCapture(capture, 'data4', f.data4, '[^:]*?') + ':');
        return Regexes.parse(str);
    }
    /**
     * fields: targetId, target, effect, source, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1e-networkbuffremove
     */
    static losesEffect(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'losesEffect', losesEffectParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 1E:' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
            ' loses the effect of ' +
            Regexes.maybeCapture(capture, 'effect', f.effect, '.*?') +
            ' from ' +
            Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: source, sourceId, target, targetId, id, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#23-networktether
     */
    static tether(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'tether', tetherParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 23:' +
            Regexes.maybeCapture(capture, 'sourceId', f.sourceId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +
            Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
            Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') +
            ':....:....:' +
            Regexes.maybeCapture(capture, 'id', f.id, '....') + ':';
        return Regexes.parse(str);
    }
    /**
     * 'target' was defeated by 'source'
     * fields: target, source, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#19-networkdeath
     */
    static wasDefeated(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'wasDefeated', wasDefeatedParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 19:' +
            Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
            ' was defeated by ' +
            Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: name, hp, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0d-combatanthp
     */
    static hasHP(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'hasHP', hasHPParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 0D:' +
            Regexes.maybeCapture(capture, 'name', f.name, '.*?') +
            ' HP at ' +
            Regexes.maybeCapture(capture, 'hp', f.hp, '\\d+') + '%';
        return Regexes.parse(str);
    }
    /**
     * fields: code, line, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static echo(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'echo', echoParams);
        return Regexes.gameLog({
            line: f.line,
            capture: f.capture,
            code: '0038',
        });
    }
    /**
     * fields: code, line, name, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static dialog(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'dialog', dialogParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 00:' +
            Regexes.maybeCapture(capture, 'code', '0044') + ':' +
            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
        return Regexes.parse(str);
    }
    /**
     * fields: code, line, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static message(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'message', messageParams);
        return Regexes.gameLog({
            line: f.line,
            capture: f.capture,
            code: '0839',
        });
    }
    /**
     * fields: code, line, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static gameLog(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'gameLog', gameLogParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 00:' +
            Regexes.maybeCapture(capture, 'code', f.code, '....') + ':' +
            Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
        return Regexes.parse(str);
    }
    /**
     * fields: code, name, line, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     * Some game log lines have names in them, but not all.  All network log lines for these
     * have empty fields, but these get dropped by the ACT FFXV plugin.
     */
    static gameNameLog(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'gameNameLog', gameNameLogParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 00:' +
            Regexes.maybeCapture(capture, 'code', f.code, '....') + ':' +
            Regexes.maybeCapture(capture, 'name', f.name, '[^:]*') + ':' +
            Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
        return Regexes.parse(str);
    }
    /**
     * fields: job, strength, dexterity, vitality, intelligence, mind, piety, attackPower,
     *         directHit, criticalHit, attackMagicPotency, healMagicPotency, determination,
     *         skillSpeed, spellSpeed, tenacity, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats
     */
    static statChange(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'statChange', statChangeParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 0C:Player Stats: ' +
            Regexes.maybeCapture(capture, 'job', f.job, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'strength', f.strength, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'dexterity', f.dexterity, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'vitality', f.vitality, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'intelligence', f.intelligence, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'mind', f.mind, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'piety', f.piety, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'attackPower', f.attackPower, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'directHit', f.directHit, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'criticalHit', f.criticalHit, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'attackMagicPotency', f.attackMagicPotency, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'healMagicPotency', f.healMagicPotency, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'determination', f.determination, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'skillSpeed', f.skillSpeed, '\\d+') + ':' +
            Regexes.maybeCapture(capture, 'spellSpeed', f.spellSpeed, '\\d+') +
            ':0:' +
            Regexes.maybeCapture(capture, 'tenacity', f.tenacity, '\\d+');
        return Regexes.parse(str);
    }
    /**
     * fields: name, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#01-changezone
     */
    static changeZone(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'changeZone', changeZoneParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 01:Changed Zone to ' +
            Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.';
        return Regexes.parse(str);
    }
    /**
     * fields: instance, command, data0, data1, data2, data3
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#21-network6d-actor-control-lines
     */
    static network6d(f) {
        if (typeof f === 'undefined')
            f = {};
        Regexes.validateParams(f, 'network6d', network6dParams);
        const capture = Regexes.trueIfUndefined(f.capture);
        const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
            ' 21:' +
            Regexes.maybeCapture(capture, 'instance', f.instance, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'command', f.command, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'data0', f.data0, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'data1', f.data1, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'data2', f.data2, '.*?') + ':' +
            Regexes.maybeCapture(capture, 'data3', f.data3, '.*?') + '$';
        return Regexes.parse(str);
    }
    /**
     * Helper function for building named capture group
     */
    static maybeCapture(capture, name, value, defaultValue) {
        if (!value)
            value = defaultValue;
        value = Regexes.anyOf(value);
        return capture ? Regexes.namedCapture(name, value) : value;
    }
    static optional(str) {
        return `(?:${str})?`;
    }
    // Creates a named regex capture group named |name| for the match |value|.
    static namedCapture(name, value) {
        if (name.includes('>'))
            console.error('"' + name + '" contains ">".');
        if (name.includes('<'))
            console.error('"' + name + '" contains ">".');
        return '(?<' + name + '>' + value + ')';
    }
    /**
     * Convenience for turning multiple args into a unioned regular expression.
     * anyOf(x, y, z) or anyOf([x, y, z]) do the same thing, and return (?:x|y|z).
     * anyOf(x) or anyOf(x) on its own simplifies to just x.
     * args may be strings or RegExp, although any additional markers to RegExp
     * like /insensitive/i are dropped.
     */
    static anyOf(...args) {
        const anyOfArray = (array) => {
            return `(?:${array.map((elem) => elem instanceof RegExp ? elem.source : elem).join('|')})`;
        };
        let array = [];
        if (args.length === 1) {
            if (Array.isArray(args[0]))
                array = args[0];
            else if (args[0])
                array = [args[0]];
            else
                array = [];
        }
        else {
            // TODO: more accurate type instead of `as` cast
            array = args;
        }
        return anyOfArray(array);
    }
    static parse(regexpString) {
        const kCactbotCategories = {
            Timestamp: '^.{14}',
            NetTimestamp: '.{33}',
            NetField: '(?:[^|]*\\|)',
            LogType: '[0-9A-Fa-f]{2}',
            AbilityCode: '[0-9A-Fa-f]{1,8}',
            ObjectId: '[0-9A-F]{8}',
            // Matches any character name (including empty strings which the FFXIV
            // ACT plugin can generate when unknown).
            Name: '(?:[^\\s:|]+(?: [^\\s:|]+)?|)',
            // Floats can have comma as separator in FFXIV plugin output: https://github.com/ravahn/FFXIV_ACT_Plugin/issues/137
            Float: '-?[0-9]+(?:[.,][0-9]+)?(?:E-?[0-9]+)?',
        };
        // All regexes in cactbot are case insensitive.
        // This avoids headaches as things like `Vice and Vanity` turns into
        // `Vice And Vanity`, especially for French and German.  It appears to
        // have a ~20% regex parsing overhead, but at least they work.
        let modifiers = 'i';
        if (regexpString instanceof RegExp) {
            modifiers += (regexpString.global ? 'g' : '') +
                (regexpString.multiline ? 'm' : '');
            regexpString = regexpString.source;
        }
        regexpString = regexpString.replace(/\\y\{(.*?)\}/g, (match, group) => {
            return kCactbotCategories[group] || match;
        });
        return new RegExp(regexpString, modifiers);
    }
    // Like Regex.Regexes.parse, but force global flag.
    static parseGlobal(regexpString) {
        const regex = Regexes.parse(regexpString);
        let modifiers = 'gi';
        if (regexpString instanceof RegExp)
            modifiers += (regexpString.multiline ? 'm' : '');
        return new RegExp(regex.source, modifiers);
    }
    static trueIfUndefined(value) {
        if (typeof (value) === 'undefined')
            return true;
        return !!value;
    }
    static validateParams(f, funcName, params) {
        if (f === null)
            return;
        if (typeof f !== 'object')
            return;
        const keys = Object.keys(f);
        for (let k = 0; k < keys.length; ++k) {
            const key = keys[k];
            if (key && !params.includes(key)) {
                throw new Error(`${funcName}: invalid parameter '${key}'.  ` +
                    `Valid params: ${JSON.stringify(params)}`);
            }
        }
    }
}


/***/ }),

/***/ 163:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ug": () => (/* binding */ triggerOutputFunctions),
/* harmony export */   "n3": () => (/* binding */ Responses)
/* harmony export */ });
/* unused harmony exports builtInResponseStr, triggerFunctions, triggerTextOutputFunctions, severityMap */
/* harmony import */ var _outputs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(273);
// This is meant to be used in a trigger as such:
// {
//   id: 'Some tankbuster',
//   regex: Regexes.startsUsing({source: 'Ye Olde Bosse', id: '666'}),
//   condition: Conditions.caresAboutMagical(data),
//   response: Responses.tankbuster(),
// },
//
// Note: Breaking out the condition like this lets people override it if they
// always (or never) want to know about it, rather than hiding the logic inside
// the tankbuster callback with a "is healer" check.
//
// If data.role is used, it should be only to differentiate between alert levels,
// and not whether a message is sent at all.
//
// Although this is not true of `response: ` fields on triggers in general,
// all responses in this file should either return an object or a single
// function that sets outputStrings and returns an object without doing
// anything with data or matches.  See `responses_test.js`.

const builtInResponseStr = 'cactbot-builtin-response';
// All valid trigger fields.
const triggerFunctions = (/* unused pure expression or super */ null && ([
    'alarmText',
    'alertText',
    'condition',
    'delaySeconds',
    'disabled',
    'durationSeconds',
    'id',
    'infoText',
    'preRun',
    'promise',
    'response',
    'run',
    'sound',
    'soundVolume',
    'suppressSeconds',
    'tts',
    'outputStrings',
]));
// Trigger fields that can produce text output.
const triggerTextOutputFunctions = [
    'alarmText',
    'alertText',
    'infoText',
    'response',
    'tts',
];
// If a trigger has any of these, then it has a visible/audio effect.
const triggerOutputFunctions = [
    ...triggerTextOutputFunctions,
    'sound',
];
const severityMap = {
    'info': 'infoText',
    'alert': 'alertText',
    'alarm': 'alarmText',
};
const getText = (sev) => {
    if (!(sev in severityMap))
        throw new Error(`Invalid severity: ${sev}.`);
    return severityMap[sev];
};
const defaultInfoText = (sev) => {
    if (!sev)
        return 'infoText';
    return getText(sev);
};
const defaultAlertText = (sev) => {
    if (!sev)
        return 'alertText';
    return getText(sev);
};
const defaultAlarmText = (sev) => {
    if (!sev)
        return 'alarmText';
    return getText(sev);
};
const getTarget = (matches) => {
    // Often tankbusters can be casted by the boss on the boss.
    // Consider this as "not having a target".
    if (!matches || matches.target === matches.source)
        return;
    return matches.target;
};
const getSource = (matches) => {
    return matches === null || matches === void 0 ? void 0 : matches.source;
};
// FIXME: make this work for any number of pairs of params
const combineFuncs = function (text1, func1, text2, func2) {
    const obj = {};
    if (text1 !== text2) {
        obj[text1] = func1;
        obj[text2] = func2;
    }
    else {
        obj[text1] = (data, matches, output) => {
            return func1(data, matches, output) || func2(data, matches, output);
        };
    }
    return obj;
};
const isPlayerId = (id) => {
    return id && id[0] !== '4';
};
// For responses that unconditionally return static text.
const staticResponse = (field, text) => {
    return (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            text: text,
        };
        return {
            [field]: (_data, _matches, output) => { var _a; return (_a = output.text) === null || _a === void 0 ? void 0 : _a.call(output); },
        };
    };
};
const Responses = {
    tankBuster: (targetSev, otherSev) => {
        const outputStrings = {
            noTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankBuster */ .Z.tankBuster,
            busterOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankBusterOnYou */ .Z.tankBusterOnYou,
            busterOnTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankBusterOnPlayer */ .Z.tankBusterOnPlayer,
        };
        const targetFunc = (data, matches, output) => {
            var _a, _b;
            const target = getTarget(matches);
            if (!target) {
                if (data.role !== 'tank' && data.role !== 'healer')
                    return;
                return (_a = output.noTarget) === null || _a === void 0 ? void 0 : _a.call(output);
            }
            if (target === data.me)
                return (_b = output.busterOnYou) === null || _b === void 0 ? void 0 : _b.call(output);
        };
        const otherFunc = (data, matches, output) => {
            var _a, _b;
            const target = getTarget(matches);
            if (!target) {
                if (data.role === 'tank' || data.role === 'healer')
                    return;
                return (_a = output.noTarget) === null || _a === void 0 ? void 0 : _a.call(output);
            }
            if (target === data.me)
                return;
            return (_b = output.busterOnTarget) === null || _b === void 0 ? void 0 : _b.call(output, { player: data.ShortName(target) });
        };
        const combined = combineFuncs(defaultAlertText(targetSev), targetFunc, defaultInfoText(otherSev), otherFunc);
        return (_data, _matches, output) => {
            // cactbot-builtin-response
            output.responseOutputStrings = outputStrings;
            return combined;
        };
    },
    tankBusterSwap: (busterSev, swapSev) => {
        const outputStrings = {
            tankSwap: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankSwap */ .Z.tankSwap,
            busterOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankBusterOnYou */ .Z.tankBusterOnYou,
            busterOnTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankBusterOnPlayer */ .Z.tankBusterOnPlayer,
        };
        // Note: busterSev and swapSev can be the same priority.
        const tankSwapFunc = (data, matches, output) => {
            var _a;
            const target = getTarget(matches);
            if (data.role === 'tank' && target !== data.me)
                return (_a = output.tankSwap) === null || _a === void 0 ? void 0 : _a.call(output);
        };
        const busterFunc = (data, matches, output) => {
            var _a, _b;
            const target = getTarget(matches);
            if (data.role === 'tank' && target !== data.me)
                return;
            if (target === data.me)
                return (_a = output.busterOnYou) === null || _a === void 0 ? void 0 : _a.call(output);
            return (_b = output.busterOnTarget) === null || _b === void 0 ? void 0 : _b.call(output, { player: data.ShortName(target) });
        };
        const combined = combineFuncs(defaultAlarmText(swapSev), tankSwapFunc, defaultAlertText(busterSev), busterFunc);
        return (_data, _matches, output) => {
            // cactbot-builtin-response
            output.responseOutputStrings = outputStrings;
            return combined;
        };
    },
    tankCleave: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            cleaveOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankCleaveOnYou */ .Z.tankCleaveOnYou,
            cleaveNoTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.tankCleave */ .Z.tankCleave,
            avoidCleave: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.avoidTankCleave */ .Z.avoidTankCleave,
        };
        return {
            [defaultInfoText(sev)]: (data, matches, output) => {
                var _a, _b, _c;
                const target = getTarget(matches);
                if (target === data.me)
                    return (_a = output.cleaveOnYou) === null || _a === void 0 ? void 0 : _a.call(output);
                if (data.role === 'tank' || data.job === 'BLU') {
                    // targetless tank cleave
                    // BLU players should always get this generic cleave message.
                    // We have no robust way to determine whether they have tank Mimicry on,
                    // and it's really annoying for a BLU tank to be told to avoid cleaves when they can't.
                    return (_b = output.cleaveNoTarget) === null || _b === void 0 ? void 0 : _b.call(output);
                }
                return (_c = output.avoidCleave) === null || _c === void 0 ? void 0 : _c.call(output);
            },
        };
    },
    miniBuster: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.miniBuster */ .Z.miniBuster),
    aoe: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.aoe */ .Z.aoe),
    bigAoe: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.bigAoe */ .Z.bigAoe),
    spread: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.spread */ .Z.spread),
    // for stack marker situations.
    stackMarker: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stackMarker */ .Z.stackMarker),
    // for getting together without stack marker
    getTogether: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.getTogether */ .Z.getTogether),
    stackMarkerOn: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            stackOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stackOnYou */ .Z.stackOnYou,
            stackOnTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stackOnPlayer */ .Z.stackOnPlayer,
        };
        return {
            [defaultAlertText(sev)]: (data, matches, output) => {
                var _a, _b;
                const target = getTarget(matches);
                if (target === data.me)
                    return (_a = output.stackOnYou) === null || _a === void 0 ? void 0 : _a.call(output);
                return (_b = output.stackOnTarget) === null || _b === void 0 ? void 0 : _b.call(output, { player: data.ShortName(target) });
            },
        };
    },
    stackMiddle: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stackMiddle */ .Z.stackMiddle),
    doritoStack: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.doritoStack */ .Z.doritoStack),
    spreadThenStack: (sev) => {
        return staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.spreadThenStack */ .Z.spreadThenStack);
    },
    stackThenSpread: (sev) => {
        return staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stackThenSpread */ .Z.stackThenSpread);
    },
    knockback: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.knockback */ .Z.knockback),
    knockbackOn: (targetSev, otherSev) => {
        const outputStrings = {
            knockbackOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.knockbackOnYou */ .Z.knockbackOnYou,
            knockbackOnTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.knockbackOnPlayer */ .Z.knockbackOnPlayer,
        };
        const targetFunc = (data, matches, output) => {
            var _a;
            const target = getTarget(matches);
            if (target === data.me)
                return (_a = output.knockbackOnYou) === null || _a === void 0 ? void 0 : _a.call(output);
        };
        const otherFunc = (data, matches, output) => {
            var _a;
            const target = getTarget(matches);
            if (target !== data.me)
                return (_a = output.knockbackOnTarget) === null || _a === void 0 ? void 0 : _a.call(output, { player: data.ShortName(target) });
        };
        const combined = combineFuncs(defaultInfoText(targetSev), targetFunc, defaultInfoText(otherSev), otherFunc);
        return (_data, _matches, output) => {
            // cactbot-builtin-response
            output.responseOutputStrings = outputStrings;
            return combined;
        };
    },
    lookTowards: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.lookTowardsBoss */ .Z.lookTowardsBoss),
    lookAway: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.lookAway */ .Z.lookAway),
    lookAwayFromTarget: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            lookAwayFrom: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.lookAwayFromTarget */ .Z.lookAwayFromTarget,
        };
        return {
            [defaultAlertText(sev)]: (data, matches, output) => {
                var _a;
                const target = getTarget(matches);
                if (target === data.me)
                    return;
                const name = isPlayerId(matches === null || matches === void 0 ? void 0 : matches.targetId) ? data.ShortName(target) : target;
                return (_a = output.lookAwayFrom) === null || _a === void 0 ? void 0 : _a.call(output, { name: name });
            },
        };
    },
    lookAwayFromSource: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            lookAwayFrom: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.lookAwayFromTarget */ .Z.lookAwayFromTarget,
        };
        return {
            [defaultAlertText(sev)]: (data, matches, output) => {
                var _a;
                const source = getSource(matches);
                if (source === data.me)
                    return;
                const name = isPlayerId(matches === null || matches === void 0 ? void 0 : matches.sourceId) ? data.ShortName(source) : source;
                return (_a = output.lookAwayFrom) === null || _a === void 0 ? void 0 : _a.call(output, { name: name });
            },
        };
    },
    getBehind: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.getBehind */ .Z.getBehind),
    goFrontOrSides: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.goFrontOrSides */ .Z.goFrontOrSides),
    // .getUnder() is used when you have to get into the bosses hitbox
    getUnder: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.getUnder */ .Z.getUnder),
    // .getIn() is more like "get close but maybe even melee range is fine"
    getIn: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.in */ .Z.in),
    // .getOut() means get far away
    getOut: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.out */ .Z.out),
    outOfMelee: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.outOfMelee */ .Z.outOfMelee),
    getInThenOut: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.inThenOut */ .Z.inThenOut),
    getOutThenIn: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.outThenIn */ .Z.outThenIn),
    getBackThenFront: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.backThenFront */ .Z.backThenFront),
    getFrontThenBack: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.frontThenBack */ .Z.frontThenBack),
    goMiddle: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.goIntoMiddle */ .Z.goIntoMiddle),
    goRight: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.right */ .Z.right),
    goLeft: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.left */ .Z.left),
    goWest: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.getLeftAndWest */ .Z.getLeftAndWest),
    goEast: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.getRightAndEast */ .Z.getRightAndEast),
    goFrontBack: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.goFrontBack */ .Z.goFrontBack),
    goSides: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.sides */ .Z.sides),
    // .killAdds() is used for adds that will always be available
    killAdds: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.killAdds */ .Z.killAdds),
    // .killExtraAdd() is used for adds that appear if a mechanic was not played correctly
    killExtraAdd: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.killExtraAdd */ .Z.killExtraAdd),
    awayFromFront: (sev) => staticResponse(defaultAlertText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.awayFromFront */ .Z.awayFromFront),
    sleep: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            sleep: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.sleepTarget */ .Z.sleepTarget,
        };
        return {
            [defaultAlertText(sev)]: (_data, matches, output) => {
                var _a;
                const source = getSource(matches);
                return (_a = output.sleep) === null || _a === void 0 ? void 0 : _a.call(output, { name: source });
            },
        };
    },
    stun: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            stun: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stunTarget */ .Z.stunTarget,
        };
        return {
            [defaultAlertText(sev)]: (_data, matches, output) => {
                var _a;
                const source = getSource(matches);
                return (_a = output.stun) === null || _a === void 0 ? void 0 : _a.call(output, { name: source });
            },
        };
    },
    interrupt: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            interrupt: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.interruptTarget */ .Z.interruptTarget,
        };
        return {
            [defaultAlertText(sev)]: (_data, matches, output) => {
                var _a;
                const source = getSource(matches);
                return (_a = output.interrupt) === null || _a === void 0 ? void 0 : _a.call(output, { name: source });
            },
        };
    },
    preyOn: (targetSev, otherSev) => {
        const outputStrings = {
            preyOnYou: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.preyOnYou */ .Z.preyOnYou,
            preyOnTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.preyOnPlayer */ .Z.preyOnPlayer,
        };
        const targetFunc = (data, matches, output) => {
            var _a;
            const target = getTarget(matches);
            if (data.me === target)
                return (_a = output.preyOnYou) === null || _a === void 0 ? void 0 : _a.call(output);
        };
        const otherFunc = (data, matches, output) => {
            var _a;
            const target = getTarget(matches);
            if (target !== data.me)
                return (_a = output.preyOnTarget) === null || _a === void 0 ? void 0 : _a.call(output, { player: data.ShortName(target) });
        };
        const combined = combineFuncs(defaultAlertText(targetSev), targetFunc, defaultInfoText(otherSev), otherFunc);
        return (_data, _matches, output) => {
            // cactbot-builtin-response
            output.responseOutputStrings = outputStrings;
            return combined;
        };
    },
    awayFrom: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            awayFromGroup: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.awayFromGroup */ .Z.awayFromGroup,
            awayFromTarget: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.awayFromPlayer */ .Z.awayFromPlayer,
        };
        return {
            [defaultAlertText(sev)]: (data, matches, output) => {
                var _a, _b;
                const target = getTarget(matches);
                if (data.me === target)
                    return (_a = output.awayFromGroup) === null || _a === void 0 ? void 0 : _a.call(output);
                return (_b = output.awayFromTarget) === null || _b === void 0 ? void 0 : _b.call(output, { player: data.ShortName(target) });
            },
        };
    },
    meteorOnYou: (sev) => staticResponse(defaultAlarmText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.meteorOnYou */ .Z.meteorOnYou),
    stopMoving: (sev) => staticResponse(defaultAlarmText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stopMoving */ .Z.stopMoving),
    stopEverything: (sev) => staticResponse(defaultAlarmText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.stopEverything */ .Z.stopEverything),
    // move away to dodge aoes
    moveAway: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.moveAway */ .Z.moveAway),
    // move around (e.g. jumping) to avoid being frozen
    moveAround: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.moveAround */ .Z.moveAround),
    breakChains: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.breakChains */ .Z.breakChains),
    moveChainsTogether: (sev) => staticResponse(defaultInfoText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.moveChainsTogether */ .Z.moveChainsTogether),
    earthshaker: (sev) => (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
            earthshaker: _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.earthshakerOnYou */ .Z.earthshakerOnYou,
        };
        return {
            [defaultAlertText(sev)]: (data, matches, output) => {
                var _a;
                const target = getTarget(matches);
                if (target !== data.me)
                    return;
                return (_a = output.earthshaker) === null || _a === void 0 ? void 0 : _a.call(output);
            },
        };
    },
    wakeUp: (sev) => staticResponse(defaultAlarmText(sev), _outputs__WEBPACK_IMPORTED_MODULE_0__/* .default.wakeUp */ .Z.wakeUp),
};
// Don't give `Responses` a type in its declaration so that it can be treated as more strict
// than `ResponsesMap`, but do assert that its type is correct.  This allows callers to know
// which properties are defined in Responses without having to conditionally check for undefined.
const responseMapTypeAssertion = Responses;
// Suppress unused variable warning.
console.assert(responseMapTypeAssertion);


/***/ }),

/***/ 970:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(906);
/* harmony import */ var _not_reached__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(500);
/* harmony import */ var _conditions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(152);
/* harmony import */ var _content_type__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
/* harmony import */ var _netregexes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(381);
/* harmony import */ var _regexes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(201);
/* harmony import */ var _responses__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(163);
/* harmony import */ var _outputs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(273);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(779);
/* harmony import */ var _zone_id__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(438);
/* harmony import */ var _zone_info__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(810);


// TODO:
// The convention of "import X as _X; const X = _X;" is currently
// being used as a method to workaround for downstream code
// that is running via eval(). Because importing statements do not
// create a variable of the same name, the eval()'d code does not know
// about the import, and thus throws ReferenceErrors.
// Used by downstream eval

const Conditions = _conditions__WEBPACK_IMPORTED_MODULE_2__/* .default */ .Z;

const ContentType = _content_type__WEBPACK_IMPORTED_MODULE_3__/* .default */ .Z;

const NetRegexes = _netregexes__WEBPACK_IMPORTED_MODULE_4__/* .default */ .Z;

const Regexes = _regexes__WEBPACK_IMPORTED_MODULE_5__/* .default */ .Z;

const Responses = _responses__WEBPACK_IMPORTED_MODULE_6__/* .Responses */ .n3;

const Outputs = _outputs__WEBPACK_IMPORTED_MODULE_7__/* .default */ .Z;

const Util = _util__WEBPACK_IMPORTED_MODULE_8__/* .default */ .Z;

const ZoneId = _zone_id__WEBPACK_IMPORTED_MODULE_9__/* .default */ .Z;

const ZoneInfo = _zone_info__WEBPACK_IMPORTED_MODULE_10__/* .default */ .Z;
// Convince TypeScript and eslint that these are used.  TypeScript doesn't have a great way
// to disable individual rules, so this is safer than disabling all rules.
console.assert(Conditions && ContentType && NetRegexes && Regexes &&
    Responses && Outputs && Util && ZoneId && ZoneInfo);
class UserConfig {
    constructor() {
        this.optionTemplates = {};
        this.savedConfig = {};
        this.userFileCallbacks = {};
    }
    getDefaultBaseOptions() {
        return {
            ParserLanguage: 'en',
            ShortLocale: 'en',
            DisplayLanguage: 'en',
            TextAlertsEnabled: true,
            SoundAlertsEnabled: true,
            SpokenAlertsEnabled: false,
            GroupSpokenAlertsEnabled: false,
        };
    }
    evalUserFile(content, options) {
        const Options = options;
        console.assert(Options); // Used by eval.
        // This is the one eval cactbot should ever need, which is for handling user files.
        // Because user files can be located anywhere on disk and there's backwards compat
        // issues, it's unlikely that these will be able to be anything but eval forever.
        //
        /* eslint-disable no-eval */
        eval(content);
        /* eslint-enable no-eval */
    }
    registerOptions(overlayName, optionTemplate, userFileCallback) {
        this.optionTemplates[overlayName] = optionTemplate;
        if (userFileCallback)
            this.userFileCallbacks[overlayName] = userFileCallback;
    }
    sortUserFiles(keys) {
        // Helper data structure for subdirectories.
        const splitKeyMap = {};
        for (const key of keys)
            splitKeyMap[key] = key.toUpperCase().split(/[/\\]/);
        // Sort paths as a depth-first case-insensitive alphabetical subdirectory walk, followed by
        // all files sorted case-insensitive alphabetically once a subdir has been processed, e.g.
        //  * a/some.js
        //  * b/subdir1/z/z/z/nested_file.js
        //  * b/subdir1/file.js
        //  * b/subdir2/first.js
        //  * b/subdir2/second.js
        //  * b/some_file.js
        //  * root_file1.js
        //  * root_file2.js
        return keys.sort((keyA, keyB) => {
            const listA = splitKeyMap[keyA];
            const listB = splitKeyMap[keyB];
            if (listA === undefined || listB === undefined)
                throw new _not_reached__WEBPACK_IMPORTED_MODULE_1__/* .UnreachableCode */ .$();
            const maxLen = Math.max(listA.length, listB.length);
            for (let idx = 0; idx < maxLen; ++idx) {
                const entryA = listA[idx];
                const entryB = listB[idx];
                // In practice, there's always at least one entry.
                if (entryA === undefined || entryB === undefined)
                    throw new _not_reached__WEBPACK_IMPORTED_MODULE_1__/* .UnreachableCode */ .$();
                // If both subdirectories or both files, then compare names.
                const isLastA = listA.length - 1 === idx;
                const isLastB = listB.length - 1 === idx;
                if (isLastA && isLastB) {
                    // If both last, then this is a filename comparison.
                    // First, compare filename without extension.
                    const fileA = entryA.replace(/\.[^\.]*$/, '');
                    const fileB = entryB.replace(/\.[^\.]*$/, '');
                    const filenameOnlyDiff = fileA.localeCompare(fileB);
                    if (filenameOnlyDiff)
                        return filenameOnlyDiff;
                    // Second, compare including the extension.
                    // Always return something here, see note below.
                    return entryA.localeCompare(entryB);
                }
                else if (!isLastA && !isLastB) {
                    // If both not last, this is a subdirectory comparison.
                    const diff = entryA.localeCompare(entryB);
                    if (diff)
                        return diff;
                }
                // At this point, if idx is the final for each, we would have returned above.
                // So, check if either a or b is at the final entry in splitKeyMap.
                // If so, then there's a mismatch in number of directories, and we know one
                // the one with a filename should be sorted last.
                if (listA.length - 1 <= idx) {
                    // a has fewer subdirectories, so should be sorted last.
                    return 1;
                }
                if (listB.length - 1 <= idx) {
                    // a has more subdirectories, so should be sorted first.
                    return -1;
                }
            }
            return 0;
        });
    }
    // Given a set of paths, an overlayName, and an extension, return all paths with
    // that extension that have `overlayName` either as their entire filename (no subdir)
    // or are inside a root-level subdirectory named `overlayName`/  The extension should
    // include the period separator, e.g. ".js".  All comparisons are case insensitive.
    filterUserFiles(paths, origOverlayName, origExtension) {
        const extension = origExtension.toLowerCase();
        const overlayName = origOverlayName.toLowerCase();
        return paths.filter((origPath) => {
            const path = origPath.toLowerCase();
            if (!path.endsWith(extension))
                return false;
            if (path === `${overlayName}${extension}`)
                return true;
            if (path.startsWith(`${overlayName}/`) || path.startsWith(`${overlayName}\\`))
                return true;
            return false;
        });
    }
    getUserConfigLocation(overlayName, options, callback) {
        let currentlyReloading = false;
        const reloadOnce = () => {
            if (currentlyReloading)
                return;
            currentlyReloading = true;
            window.location.reload();
        };
        (0,_overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__/* .addOverlayListener */ .PS)('onUserFileChanged', () => {
            reloadOnce();
        });
        (0,_overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__/* .addOverlayListener */ .PS)('onForceReload', () => {
            reloadOnce();
        });
        this.loadUserFiles(overlayName, options, callback);
    }
    loadUserFiles(overlayName, options, callback) {
        const readOptions = (0,_overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__/* .callOverlayHandler */ .ae)({
            call: 'cactbotLoadData',
            overlay: 'options',
        });
        const loadUser = async (e) => {
            var _a, _b, _c, _d, _e, _f, _g;
            // The basePath isn't using for anything other than cosmetic printing of full paths,
            // so replace any slashes here for uniformity.  In case anybody is using cactbot on
            // Linux (?!?), support any style of slashes elsewhere.
            const basePath = e.detail.userLocation.replace(/[/\\]*$/, '') + '\\';
            const localFiles = e.detail.localUserFiles;
            // The plugin auto-detects the language, so set this first.
            // If options files want to override it, they can for testing.
            // Backward compatibility (language is now separated to three types.)
            if (e.detail.language) {
                options.ParserLanguage = e.detail.language;
                options.ShortLocale = e.detail.language;
                options.DisplayLanguage = e.detail.language;
            }
            // Parser Language
            if (e.detail.parserLanguage) {
                options.ParserLanguage = e.detail.parserLanguage;
                // Backward compatibility, everything "Language" should be changed to "ParserLanguage"
                options.Language = e.detail.parserLanguage;
            }
            const supportedLanguage = ['en', 'de', 'fr', 'ja', 'cn', 'ko'];
            // System Language
            if (e.detail.systemLocale) {
                options.SystemLocale = e.detail.systemLocale;
                options.ShortLocale = e.detail.systemLocale.substring(0, 2);
                if (options.ShortLocale === 'zh')
                    options.ShortLocale = 'cn';
                if (!supportedLanguage.includes(options.ShortLocale))
                    options.ShortLocale = options.ParserLanguage;
            }
            // User's setting Language
            options.DisplayLanguage = e.detail.displayLanguage;
            if (!supportedLanguage.includes(options.DisplayLanguage))
                options.DisplayLanguage = options.ParserLanguage || 'en';
            document.body.classList.add(`lang-${options.DisplayLanguage}`);
            this.addUnlockText(options.DisplayLanguage);
            // Handle processOptions after default language selection above,
            // but before css below which may load skin files.
            // processOptions needs to be called whether or not there are
            // any userOptions saved, as it sets up the defaults.
            this.savedConfig = (_b = (_a = (await readOptions)) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {};
            this.processOptions(options, (_c = this.savedConfig[overlayName]) !== null && _c !== void 0 ? _c : {}, this.optionTemplates[overlayName]);
            // If the overlay has a "Debug" setting, set to true via the config tool,
            // then also print out user files that have been loaded.
            const printUserFile = options.Debug ? (x) => console.log(x) : () => { };
            // With user files being arbitrary javascript, and having multiple files
            // in user folders, it's possible for later files to accidentally remove
            // things that previous files have added.  Warn about this, since most
            // users are not programmers.
            const warnOnVariableResetMap = {
                raidboss: [
                    'Triggers',
                ],
            };
            warnOnVariableResetMap[overlayName] = warnOnVariableResetMap[overlayName] || [];
            // The values of each `warnOnVariableResetMap` field are initially set
            // after the first file, so that if there is only one file, there are
            // not any warnings.
            // The fields that a user file sets in Options can be anything (pun not intended)
            // and so we use `any` here.  The only operation done on this field is a !==
            // for change detection to see if the the user file has modified it.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const variableTracker = {};
            if (localFiles) {
                // localFiles may be null if there is no valid user directory.
                const sortedFiles = this.sortUserFiles(Object.keys(localFiles));
                const jsFiles = this.filterUserFiles(sortedFiles, overlayName, '.js');
                const cssFiles = this.filterUserFiles(sortedFiles, overlayName, '.css');
                for (const jsFile of jsFiles) {
                    try {
                        printUserFile(`local user file: ${basePath}${jsFile}`);
                        this.evalUserFile((_d = localFiles[jsFile]) !== null && _d !== void 0 ? _d : '', options);
                        for (const field of (_e = warnOnVariableResetMap[overlayName]) !== null && _e !== void 0 ? _e : []) {
                            if (variableTracker[field] && variableTracker[field] !== options[field]) {
                                // Ideally users should do something like `Options.Triggers.push([etc]);`
                                // instead of `Options.Triggers = [etc];`
                                console.log(`*** WARNING: ${basePath}${jsFile} overwrites Options.${field} from previous files.`);
                            }
                            variableTracker[field] = options[field];
                        }
                        (_g = (_f = this.userFileCallbacks)[overlayName]) === null || _g === void 0 ? void 0 : _g.call(_f, jsFile, localFiles, options, basePath);
                    }
                    catch (e) {
                        // Be very visible for users.
                        console.log('*** ERROR IN USER FILE ***');
                        console.log(e);
                    }
                }
                // This is a bit awkward to handle skin settings here, but
                // doing it after user config files and before user css files
                // allows user css to override skin-specific css as well.
                if (options.Skin)
                    this.handleSkin(options.Skin);
                for (const cssFile of cssFiles) {
                    printUserFile(`local user file: ${basePath}${cssFile}`);
                    const userCssText = document.createElement('style');
                    const contents = localFiles[cssFile];
                    if (contents)
                        userCssText.innerText = contents;
                    const head = document.getElementsByTagName('head')[0];
                    if (head)
                        head.appendChild(userCssText);
                }
            }
            // Post this callback so that the js and css can be executed first.
            if (callback)
                callback();
            void (0,_overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__/* .callOverlayHandler */ .ae)({ call: 'cactbotRequestState' });
        };
        void (0,_overlay_plugin_api__WEBPACK_IMPORTED_MODULE_0__/* .callOverlayHandler */ .ae)({
            call: 'cactbotLoadUser',
            source: location.href,
            overlayName: overlayName,
        }).then((e) => {
            // Wait for DOMContentLoaded if needed.
            if (document.readyState !== 'loading') {
                void loadUser(e);
                return;
            }
            document.addEventListener('DOMContentLoaded', () => {
                void loadUser(e);
            });
        });
    }
    handleSkin(skinName) {
        if (!skinName || skinName === 'default')
            return;
        let basePath = document.location.toString();
        const slashIdx = basePath.lastIndexOf('/');
        if (slashIdx !== -1)
            basePath = basePath.substr(0, slashIdx);
        if (basePath.slice(-1) !== '/')
            basePath += '/';
        const skinHref = basePath + 'skins/' + skinName + '/' + skinName + '.css';
        this.appendCSSLink(skinHref);
    }
    appendJSLink(src) {
        const userJS = document.createElement('script');
        userJS.setAttribute('type', 'text/javascript');
        userJS.setAttribute('src', src);
        userJS.setAttribute('async', 'false');
        const head = document.getElementsByTagName('head')[0];
        if (head)
            head.appendChild(userJS);
    }
    appendCSSLink(href) {
        const userCSS = document.createElement('link');
        userCSS.setAttribute('rel', 'stylesheet');
        userCSS.setAttribute('type', 'text/css');
        userCSS.setAttribute('href', href);
        const head = document.getElementsByTagName('head')[0];
        if (head)
            head.appendChild(userCSS);
    }
    processOptions(options, savedConfig, template) {
        // Take options from the template, find them in savedConfig,
        // and apply them to options. This also handles setting
        // defaults for anything in the template, even if it does not
        // exist in savedConfig.
        if (Array.isArray(template)) {
            for (let i = 0; i < template.length; ++i)
                this.processOptions(options, savedConfig, template[i]);
            return;
        }
        // Not all overlays have option templates.
        if (!template)
            return;
        const templateOptions = template.options || [];
        for (const opt of templateOptions) {
            // Grab the saved value or the default to set in options.
            let value = opt.default;
            if (typeof savedConfig === 'object' && !Array.isArray(savedConfig)) {
                if (opt.id in savedConfig) {
                    const newValue = savedConfig[opt.id];
                    if (newValue !== undefined)
                        value = newValue;
                }
            }
            // Options can provide custom logic to turn a value into options settings.
            // If this doesn't exist, just set the value directly.
            // Option template ids are identical to field names on Options.
            if (opt.setterFunc) {
                opt.setterFunc(options, value);
            }
            else if (opt.type === 'integer') {
                if (typeof value === 'number')
                    options[opt.id] = Math.floor(value);
                else if (typeof value === 'string')
                    options[opt.id] = parseInt(value);
            }
            else if (opt.type === 'float') {
                if (typeof value === 'number')
                    options[opt.id] = value;
                else if (typeof value === 'string')
                    options[opt.id] = parseFloat(value);
            }
            else {
                options[opt.id] = value;
            }
        }
        // For things like raidboss that build extra UI, also give them a chance
        // to handle anything that has been set on that UI.
        if (template.processExtraOptions)
            template.processExtraOptions(options, savedConfig);
    }
    addUnlockText(lang) {
        const unlockText = {
            en: '🔓 Unlocked (lock overlay before using)',
            de: '🔓 Entsperrt (Sperre das Overlay vor der Nutzung)',
            fr: '🔓 Débloqué (Bloquez l\'overlay avant utilisation)',
            ja: '🔓 ロック解除 (オーバーレイを使用する前にロックしてください)',
            cn: '🔓 已解除锁定 (你需要将此悬浮窗锁定后方可使用)',
            ko: '🔓 위치 잠금 해제됨 (사용하기 전에 위치 잠금을 설정하세요)',
        };
        const id = 'cactbot-unlocked-text';
        let textElem = document.getElementById(id);
        if (!textElem) {
            textElem = document.createElement('div');
            textElem.id = id;
            textElem.classList.add('text');
            // Set element display to none in case the page has not included defaults.css.
            textElem.style.display = 'none';
            document.body.append(textElem);
        }
        textElem.innerHTML = unlockText[lang] || unlockText['en'];
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new UserConfig());
if (typeof document !== 'undefined') {
    // This event comes early and is not cached, so set up event listener immediately.
    document.addEventListener('onOverlayStateUpdate', (e) => {
        const docClassList = document.documentElement.classList;
        if (e.detail.isLocked)
            docClassList.remove('resizeHandle', 'unlocked');
        else
            docClassList.add('resizeHandle', 'unlocked');
    });
}


/***/ }),

/***/ 779:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// TODO: it'd be nice to not repeat job names, but at least Record enforces that all are set.
const nameToJobEnum = {
    NONE: 0,
    GLA: 1,
    PGL: 2,
    MRD: 3,
    LNC: 4,
    ARC: 5,
    CNJ: 6,
    THM: 7,
    CRP: 8,
    BSM: 9,
    ARM: 10,
    GSM: 11,
    LTW: 12,
    WVR: 13,
    ALC: 14,
    CUL: 15,
    MIN: 16,
    BTN: 17,
    FSH: 18,
    PLD: 19,
    MNK: 20,
    WAR: 21,
    DRG: 22,
    BRD: 23,
    WHM: 24,
    BLM: 25,
    ACN: 26,
    SMN: 27,
    SCH: 28,
    ROG: 29,
    NIN: 30,
    MCH: 31,
    DRK: 32,
    AST: 33,
    SAM: 34,
    RDM: 35,
    BLU: 36,
    GNB: 37,
    DNC: 38,
};
const allJobs = Object.keys(nameToJobEnum);
const allRoles = ['tank', 'healer', 'dps', 'crafter', 'gatherer', 'none'];
const tankJobs = ['GLA', 'PLD', 'MRD', 'WAR', 'DRK', 'GNB'];
const healerJobs = ['CNJ', 'WHM', 'SCH', 'AST'];
const meleeDpsJobs = ['PGL', 'MNK', 'LNC', 'DRG', 'ROG', 'NIN', 'SAM'];
const rangedDpsJobs = ['ARC', 'BRD', 'DNC', 'MCH'];
const casterDpsJobs = ['BLU', 'RDM', 'BLM', 'SMN', 'ACN', 'THM'];
const dpsJobs = [...meleeDpsJobs, ...rangedDpsJobs, ...casterDpsJobs];
const craftingJobs = ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'];
const gatheringJobs = ['MIN', 'BTN', 'FSH'];
const stunJobs = ['BLU', ...tankJobs, ...meleeDpsJobs];
const silenceJobs = ['BLU', ...tankJobs, ...rangedDpsJobs];
const sleepJobs = ['BLM', 'BLU', ...healerJobs];
const feintJobs = [...meleeDpsJobs];
const addleJobs = [...casterDpsJobs];
const cleanseJobs = ['BLU', 'BRD', ...healerJobs];
const jobToRoleMap = (() => {
    const addToMap = (map, jobs, role) => {
        jobs.forEach((job) => map.set(job, role));
    };
    const map = new Map([['NONE', 'none']]);
    addToMap(map, tankJobs, 'tank');
    addToMap(map, healerJobs, 'healer');
    addToMap(map, dpsJobs, 'dps');
    addToMap(map, craftingJobs, 'crafter');
    addToMap(map, gatheringJobs, 'gatherer');
    return map;
})();
const Util = {
    jobEnumToJob: (id) => {
        const job = allJobs.find((job) => nameToJobEnum[job] === id);
        return job !== null && job !== void 0 ? job : 'NONE';
    },
    jobToJobEnum: (job) => nameToJobEnum[job],
    jobToRole: (job) => {
        const role = jobToRoleMap.get(job);
        return role !== null && role !== void 0 ? role : 'none';
    },
    getAllRoles: () => allRoles,
    isTankJob: (job) => tankJobs.includes(job),
    isHealerJob: (job) => healerJobs.includes(job),
    isMeleeDpsJob: (job) => meleeDpsJobs.includes(job),
    isRangedDpsJob: (job) => rangedDpsJobs.includes(job),
    isCasterDpsJob: (job) => casterDpsJobs.includes(job),
    isDpsJob: (job) => dpsJobs.includes(job),
    isCraftingJob: (job) => craftingJobs.includes(job),
    isGatheringJob: (job) => gatheringJobs.includes(job),
    isCombatJob: (job) => {
        return !craftingJobs.includes(job) && !gatheringJobs.includes(job);
    },
    canStun: (job) => stunJobs.includes(job),
    canSilence: (job) => silenceJobs.includes(job),
    canSleep: (job) => sleepJobs.includes(job),
    canCleanse: (job) => cleanseJobs.includes(job),
    canFeint: (job) => feintJobs.includes(job),
    canAddle: (job) => addleJobs.includes(job),
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Util);


/***/ }),

/***/ 438:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Auto-generated from gen_zone_id_and_info.py
// DO NOT EDIT THIS FILE DIRECTLY
const data = {
    'ABloodyReunion': 560,
    'ARelicRebornTheChimera': 368,
    'ARelicRebornTheHydra': 369,
    'ARequiemForHeroes': 830,
    'ASleepDisturbed': 914,
    'ASpectacleForTheAges': 533,
    'AccrueEnmityFromMultipleTargets': 540,
    'AirForceOne': 832,
    'AkadaemiaAnyder': 841,
    'AlaMhigo': 689,
    'AlexanderTheArmOfTheFather': 444,
    'AlexanderTheArmOfTheFatherSavage': 451,
    'AlexanderTheArmOfTheSon': 522,
    'AlexanderTheArmOfTheSonSavage': 531,
    'AlexanderTheBreathOfTheCreator': 581,
    'AlexanderTheBreathOfTheCreatorSavage': 585,
    'AlexanderTheBurdenOfTheFather': 445,
    'AlexanderTheBurdenOfTheFatherSavage': 452,
    'AlexanderTheBurdenOfTheSon': 523,
    'AlexanderTheBurdenOfTheSonSavage': 532,
    'AlexanderTheCuffOfTheFather': 443,
    'AlexanderTheCuffOfTheFatherSavage': 450,
    'AlexanderTheCuffOfTheSon': 521,
    'AlexanderTheCuffOfTheSonSavage': 530,
    'AlexanderTheEyesOfTheCreator': 580,
    'AlexanderTheEyesOfTheCreatorSavage': 584,
    'AlexanderTheFistOfTheFather': 442,
    'AlexanderTheFistOfTheFatherSavage': 449,
    'AlexanderTheFistOfTheSon': 520,
    'AlexanderTheFistOfTheSonSavage': 529,
    'AlexanderTheHeartOfTheCreator': 582,
    'AlexanderTheHeartOfTheCreatorSavage': 586,
    'AlexanderTheSoulOfTheCreator': 583,
    'AlexanderTheSoulOfTheCreatorSavage': 587,
    'AllsWellThatEndsInTheWell': 220,
    'AllsWellThatStartsWell': 796,
    'AlphascapeV10': 798,
    'AlphascapeV10Savage': 802,
    'AlphascapeV20': 799,
    'AlphascapeV20Savage': 803,
    'AlphascapeV30': 800,
    'AlphascapeV30Savage': 804,
    'AlphascapeV40': 801,
    'AlphascapeV40Savage': 805,
    'Amaurot': 838,
    'AmdaporKeep': 167,
    'AmdaporKeepHard': 189,
    'AmhAraeng': 815,
    'AnamnesisAnyder': 898,
    'AnnoyTheVoid': 222,
    'AsTheHeartBids': 894,
    'AssistAlliesInDefeatingATarget': 544,
    'Astragalos': 729,
    'AvoidAreaOfEffectAttacks': 537,
    'AzysLla': 402,
    'BaelsarsWall': 615,
    'BardamsMettle': 623,
    'BasicTrainingEnemyParties': 214,
    'BasicTrainingEnemyStrongholds': 215,
    'BattleInTheBigKeep': 396,
    'BattleOnTheBigBridge': 366,
    'BloodOnTheDeck': 708,
    'BrayfloxsLongstop': 158,
    'BrayfloxsLongstopHard': 362,
    'CapeWestwind': 332,
    'CastrumAbania': 661,
    'CastrumFluminis': 778,
    'CastrumMarinum': 934,
    'CastrumMarinumDrydocks': 967,
    'CastrumMarinumExtreme': 935,
    'CastrumMeridianum': 217,
    'CentralShroud': 148,
    'CentralThanalan': 141,
    'ChocoboRaceCostaDelSol': 389,
    'ChocoboRaceSagoliiRoad': 390,
    'ChocoboRaceTranquilPaths': 391,
    'ChocoboRaceTutorial': 417,
    'CinderDrift': 897,
    'CinderDriftExtreme': 912,
    'CoerthasCentralHighlands': 155,
    'CoerthasWesternHighlands': 397,
    'ComingClean': 860,
    'ContainmentBayP1T6': 576,
    'ContainmentBayP1T6Extreme': 577,
    'ContainmentBayS1T7': 517,
    'ContainmentBayS1T7Extreme': 524,
    'ContainmentBayZ1T9': 637,
    'ContainmentBayZ1T9Extreme': 638,
    'CopperbellMines': 161,
    'CopperbellMinesHard': 349,
    'CuriousGorgeMeetsHisMatch': 717,
    'CuttersCry': 170,
    'DarkAsTheNightSky': 713,
    'DeathUntoDawn': 977,
    'DefeatAnOccupiedTarget': 545,
    'DeltascapeV10': 691,
    'DeltascapeV10Savage': 695,
    'DeltascapeV20': 692,
    'DeltascapeV20Savage': 696,
    'DeltascapeV30': 693,
    'DeltascapeV30Savage': 697,
    'DeltascapeV40': 694,
    'DeltascapeV40Savage': 698,
    'DelubrumReginae': 936,
    'DelubrumReginaeSavage': 937,
    'DohnMheg': 821,
    'DomaCastle': 660,
    'DragonSound': 714,
    'DunScaith': 627,
    'DzemaelDarkhold': 171,
    'EastShroud': 152,
    'EasternLaNoscea': 137,
    'EasternThanalan': 145,
    'EdensGateDescent': 850,
    'EdensGateDescentSavage': 854,
    'EdensGateInundation': 851,
    'EdensGateInundationSavage': 855,
    'EdensGateResurrection': 849,
    'EdensGateResurrectionSavage': 853,
    'EdensGateSepulture': 852,
    'EdensGateSepultureSavage': 856,
    'EdensPromiseAnamorphosis': 944,
    'EdensPromiseAnamorphosisSavage': 948,
    'EdensPromiseEternity': 945,
    'EdensPromiseEternitySavage': 949,
    'EdensPromiseLitany': 943,
    'EdensPromiseLitanySavage': 947,
    'EdensPromiseUmbra': 942,
    'EdensPromiseUmbraSavage': 946,
    'EdensVerseFulmination': 902,
    'EdensVerseFulminationSavage': 906,
    'EdensVerseFuror': 903,
    'EdensVerseFurorSavage': 907,
    'EdensVerseIconoclasm': 904,
    'EdensVerseIconoclasmSavage': 908,
    'EdensVerseRefulgence': 905,
    'EdensVerseRefulgenceSavage': 909,
    'Emanation': 719,
    'EmanationExtreme': 720,
    'EmissaryOfTheDawn': 769,
    'EngageMultipleTargets': 541,
    'Eulmore': 820,
    'ExecuteAComboInBattle': 539,
    'ExecuteAComboToIncreaseEnmity': 538,
    'ExecuteARangedAttackToIncreaseEnmity': 542,
    'FadedMemories': 932,
    'FinalExercise': 552,
    'FitForAQueen': 955,
    'FlickingSticksAndTakingNames': 219,
    'Foundation': 418,
    'FourPlayerMahjongQuickMatchKuitanDisabled': 831,
    'Halatali': 162,
    'HalataliHard': 360,
    'HaukkeManor': 166,
    'HaukkeManorHard': 350,
    'HealAnAlly': 549,
    'HealMultipleAllies': 550,
    'HeavenOnHighFloors11_20': 771,
    'HeavenOnHighFloors1_10': 770,
    'HeavenOnHighFloors21_30': 772,
    'HeavenOnHighFloors31_40': 782,
    'HeavenOnHighFloors41_50': 773,
    'HeavenOnHighFloors51_60': 783,
    'HeavenOnHighFloors61_70': 774,
    'HeavenOnHighFloors71_80': 784,
    'HeavenOnHighFloors81_90': 775,
    'HeavenOnHighFloors91_100': 785,
    'HellsKier': 810,
    'HellsKierExtreme': 811,
    'HellsLid': 742,
    'HeroOnTheHalfShell': 216,
    'HiddenGorge': 791,
    'HolminsterSwitch': 837,
    'HullbreakerIsle': 361,
    'HullbreakerIsleHard': 557,
    'Idyllshire': 478,
    'IlMheg': 816,
    'InThalsName': 705,
    'InteractWithTheBattlefield': 548,
    'InterdimensionalRift': 690,
    'ItsProbablyATrap': 665,
    'Kholusia': 814,
    'Kugane': 628,
    'KuganeCastle': 662,
    'KuganeOhashi': 806,
    'Lakeland': 813,
    'LegendOfTheNotSoHiddenTemple': 859,
    'LimsaLominsaLowerDecks': 129,
    'LimsaLominsaUpperDecks': 128,
    'LongLiveTheQueen': 298,
    'LovmMasterTournament': 506,
    'LovmPlayerBattleNonRp': 591,
    'LovmPlayerBattleRp': 589,
    'LovmTournament': 590,
    'LowerLaNoscea': 135,
    'MalikahsWell': 836,
    'MatchAll': null,
    'MatoyasRelict': 933,
    'MatsubaMayhem': 710,
    'MemoriaMiseraExtreme': 913,
    'MessengerOfTheWinds': 834,
    'MiddleLaNoscea': 134,
    'Mist': 136,
    'MorDhona': 156,
    'MoreThanAFeeler': 221,
    'MtGulg': 822,
    'Naadam': 688,
    'Neverreap': 420,
    'NewGridania': 132,
    'NorthShroud': 154,
    'NorthernThanalan': 147,
    'NyelbertsLament': 876,
    'OceanFishing': 900,
    'OldGridania': 133,
    'OneLifeForOneWorld': 592,
    'OnsalHakairDanshigNaadam': 888,
    'OurCompromise': 716,
    'OurUnsungHeroes': 722,
    'OuterLaNoscea': 180,
    'Paglthan': 938,
    'PharosSirius': 160,
    'PharosSiriusHard': 510,
    'PullingPoisonPosies': 191,
    'RaisingTheSword': 706,
    'ReturnOfTheBull': 403,
    'RhalgrsReach': 635,
    'SaintMociannesArboretum': 511,
    'SaintMociannesArboretumHard': 788,
    'Sastasha': 157,
    'SastashaHard': 387,
    'SealRockSeize': 431,
    'ShadowAndClaw': 223,
    'ShisuiOfTheVioletTides': 616,
    'SigmascapeV10': 748,
    'SigmascapeV10Savage': 752,
    'SigmascapeV20': 749,
    'SigmascapeV20Savage': 753,
    'SigmascapeV30': 750,
    'SigmascapeV30Savage': 754,
    'SigmascapeV40': 751,
    'SigmascapeV40Savage': 755,
    'Snowcloak': 371,
    'SohmAl': 441,
    'SohmAlHard': 617,
    'SohrKhai': 555,
    'SolemnTrinity': 300,
    'SouthShroud': 153,
    'SouthernThanalan': 146,
    'SpecialEventI': 353,
    'SpecialEventIi': 354,
    'SpecialEventIii': 509,
    'StingingBack': 192,
    'SyrcusTower': 372,
    'TheAery': 435,
    'TheAetherochemicalResearchFacility': 438,
    'TheAkhAfahAmphitheatreExtreme': 378,
    'TheAkhAfahAmphitheatreHard': 377,
    'TheAkhAfahAmphitheatreUnreal': 930,
    'TheAntitower': 516,
    'TheAquapolis': 558,
    'TheAurumVale': 172,
    'TheAzimSteppe': 622,
    'TheBattleOnBekko': 711,
    'TheBindingCoilOfBahamutTurn1': 241,
    'TheBindingCoilOfBahamutTurn2': 242,
    'TheBindingCoilOfBahamutTurn3': 243,
    'TheBindingCoilOfBahamutTurn4': 244,
    'TheBindingCoilOfBahamutTurn5': 245,
    'TheBorderlandRuinsSecure': 376,
    'TheBowlOfEmbers': 202,
    'TheBowlOfEmbersExtreme': 295,
    'TheBowlOfEmbersHard': 292,
    'TheBozjaIncident': 911,
    'TheBozjanSouthernFront': 920,
    'TheBurn': 789,
    'TheCalamityRetold': 790,
    'TheCarteneauFlatsHeliodrome': 633,
    'TheChrysalis': 426,
    'TheChurningMists': 400,
    'TheCloudDeck': 950,
    'TheCloudDeckExtreme': 951,
    'TheCopiedFactory': 882,
    'TheCrownOfTheImmaculate': 846,
    'TheCrownOfTheImmaculateExtreme': 848,
    'TheCrystarium': 819,
    'TheDancingPlague': 845,
    'TheDancingPlagueExtreme': 858,
    'TheDiadem': 929,
    'TheDiademEasy': 512,
    'TheDiademHard': 515,
    'TheDiademHuntingGrounds': 625,
    'TheDiademHuntingGroundsEasy': 624,
    'TheDiademTrialsOfTheFury': 630,
    'TheDiademTrialsOfTheMatron': 656,
    'TheDomanEnclave': 759,
    'TheDragonsNeck': 142,
    'TheDravanianForelands': 398,
    'TheDravanianHinterlands': 399,
    'TheDrownedCityOfSkalla': 731,
    'TheDungeonsOfLyheGhiah': 879,
    'TheDuskVigil': 434,
    'TheDyingGasp': 847,
    'TheEpicOfAlexanderUltimate': 887,
    'TheFaceOfTrueEvil': 709,
    'TheFeastCustomMatchCrystalTower': 767,
    'TheFeastCustomMatchFeastingGrounds': 619,
    'TheFeastCustomMatchLichenweed': 646,
    'TheFeastRanked': 765,
    'TheFeastTeamRanked': 745,
    'TheFeastTraining': 766,
    'TheFieldsOfGloryShatter': 554,
    'TheFinalCoilOfBahamutTurn1': 193,
    'TheFinalCoilOfBahamutTurn2': 194,
    'TheFinalCoilOfBahamutTurn3': 195,
    'TheFinalCoilOfBahamutTurn4': 196,
    'TheFinalStepsOfFaith': 559,
    'TheForbiddenLandEurekaAnemos': 732,
    'TheForbiddenLandEurekaHydatos': 827,
    'TheForbiddenLandEurekaPagos': 763,
    'TheForbiddenLandEurekaPyros': 795,
    'TheFractalContinuum': 430,
    'TheFractalContinuumHard': 743,
    'TheFringes': 612,
    'TheGhimlytDark': 793,
    'TheGrandCosmos': 884,
    'TheGreatGubalLibrary': 416,
    'TheGreatGubalLibraryHard': 578,
    'TheGreatHunt': 761,
    'TheGreatHuntExtreme': 762,
    'TheGreatShipVylbrand': 954,
    'TheHardenedHeart': 873,
    'TheHauntedManor': 571,
    'TheHeartOfTheProblem': 718,
    'TheHeroesGauntlet': 916,
    'TheHiddenCanalsOfUznair': 725,
    'TheHowlingEye': 208,
    'TheHowlingEyeExtreme': 297,
    'TheHowlingEyeHard': 294,
    'TheHuntersLegacy': 875,
    'TheJadeStoa': 746,
    'TheJadeStoaExtreme': 758,
    'TheKeeperOfTheLake': 150,
    'TheLabyrinthOfTheAncients': 174,
    'TheLimitlessBlueExtreme': 447,
    'TheLimitlessBlueHard': 436,
    'TheLochs': 621,
    'TheLostAndTheFound': 874,
    'TheLostCanalsOfUznair': 712,
    'TheLostCityOfAmdapor': 363,
    'TheLostCityOfAmdaporHard': 519,
    'TheMinstrelsBalladHadessElegy': 885,
    'TheMinstrelsBalladNidhoggsRage': 566,
    'TheMinstrelsBalladShinryusDomain': 730,
    'TheMinstrelsBalladThordansReign': 448,
    'TheMinstrelsBalladTsukuyomisPain': 779,
    'TheMinstrelsBalladUltimasBane': 348,
    'TheNavel': 206,
    'TheNavelExtreme': 296,
    'TheNavelHard': 293,
    'TheNavelUnreal': 953,
    'TheOrbonneMonastery': 826,
    'TheOrphansAndTheBrokenBlade': 715,
    'ThePalaceOfTheDeadFloors101_110': 598,
    'ThePalaceOfTheDeadFloors111_120': 599,
    'ThePalaceOfTheDeadFloors11_20': 562,
    'ThePalaceOfTheDeadFloors121_130': 600,
    'ThePalaceOfTheDeadFloors131_140': 601,
    'ThePalaceOfTheDeadFloors141_150': 602,
    'ThePalaceOfTheDeadFloors151_160': 603,
    'ThePalaceOfTheDeadFloors161_170': 604,
    'ThePalaceOfTheDeadFloors171_180': 605,
    'ThePalaceOfTheDeadFloors181_190': 606,
    'ThePalaceOfTheDeadFloors191_200': 607,
    'ThePalaceOfTheDeadFloors1_10': 561,
    'ThePalaceOfTheDeadFloors21_30': 563,
    'ThePalaceOfTheDeadFloors31_40': 564,
    'ThePalaceOfTheDeadFloors41_50': 565,
    'ThePalaceOfTheDeadFloors51_60': 593,
    'ThePalaceOfTheDeadFloors61_70': 594,
    'ThePalaceOfTheDeadFloors71_80': 595,
    'ThePalaceOfTheDeadFloors81_90': 596,
    'ThePalaceOfTheDeadFloors91_100': 597,
    'ThePeaks': 620,
    'ThePillars': 419,
    'ThePoolOfTribute': 674,
    'ThePoolOfTributeExtreme': 677,
    'ThePraetorium': 224,
    'ThePuppetsBunker': 917,
    'TheQitanaRavel': 823,
    'TheRaktikaGreatwood': 817,
    'TheResonant': 684,
    'TheRidoranaLighthouse': 776,
    'TheRoyalCityOfRabanastre': 734,
    'TheRoyalMenagerie': 679,
    'TheRubySea': 613,
    'TheSeaOfClouds': 401,
    'TheSeatOfSacrifice': 922,
    'TheSeatOfSacrificeExtreme': 923,
    'TheSecondCoilOfBahamutSavageTurn1': 380,
    'TheSecondCoilOfBahamutSavageTurn2': 381,
    'TheSecondCoilOfBahamutSavageTurn3': 382,
    'TheSecondCoilOfBahamutSavageTurn4': 383,
    'TheSecondCoilOfBahamutTurn1': 355,
    'TheSecondCoilOfBahamutTurn2': 356,
    'TheSecondCoilOfBahamutTurn3': 357,
    'TheSecondCoilOfBahamutTurn4': 358,
    'TheShiftingAltarsOfUznair': 794,
    'TheShiftingOubliettesOfLyheGhiah': 924,
    'TheSingularityReactor': 437,
    'TheSirensongSea': 626,
    'TheStepsOfFaith': 143,
    'TheStoneVigil': 168,
    'TheStoneVigilHard': 365,
    'TheStrikingTreeExtreme': 375,
    'TheStrikingTreeHard': 374,
    'TheSunkenTempleOfQarn': 163,
    'TheSunkenTempleOfQarnHard': 367,
    'TheSwallowsCompass': 768,
    'TheTamTaraDeepcroft': 164,
    'TheTamTaraDeepcroftHard': 373,
    'TheTempest': 818,
    'TheTempleOfTheFist': 663,
    'TheThousandMawsOfTotoRak': 169,
    'TheTowerAtParadigmsBreach': 966,
    'TheTripleTriadBattlehall': 579,
    'TheTwinning': 840,
    'TheUnendingCoilOfBahamutUltimate': 733,
    'TheValentionesCeremony': 741,
    'TheVault': 421,
    'TheVoidArk': 508,
    'TheWanderersPalace': 159,
    'TheWanderersPalaceHard': 188,
    'TheWeaponsRefrainUltimate': 777,
    'TheWeepingCityOfMhach': 556,
    'TheWhorleaterExtreme': 359,
    'TheWhorleaterHard': 281,
    'TheWhorleaterUnreal': 972,
    'TheWillOfTheMoon': 797,
    'TheWorldOfDarkness': 151,
    'TheWreathOfSnakes': 824,
    'TheWreathOfSnakesExtreme': 825,
    'ThokAstThokExtreme': 446,
    'ThokAstThokHard': 432,
    'ThornmarchExtreme': 364,
    'ThornmarchHard': 207,
    'TripleTriadInvitationalParlor': 941,
    'TripleTriadOpenTournament': 940,
    'UldahStepsOfNald': 130,
    'UldahStepsOfThal': 131,
    'UnderTheArmor': 190,
    'UpperLaNoscea': 139,
    'UrthsFount': 394,
    'VowsOfVirtueDeedsOfCruelty': 893,
    'WardUp': 299,
    'WesternLaNoscea': 138,
    'WesternThanalan': 140,
    'WhenClansCollide': 723,
    'WithHeartAndSteel': 707,
    'WolvesDenPier': 250,
    'Xelphatol': 572,
    'Yanxia': 614,
    'Zadnor': 975,
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (data);


/***/ }),

/***/ 810:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Auto-generated from gen_zone_id_and_info.py
// DO NOT EDIT THIS FILE DIRECTLY
const data = {
    128: {
        'exVersion': 0,
        'name': {
            'cn': '利姆萨·罗敏萨上层甲板',
            'de': 'Obere Decks',
            'en': 'Limsa Lominsa Upper Decks',
            'fr': 'Limsa Lominsa - Le Tillac',
            'ja': 'リムサ・ロミンサ：上甲板層',
            'ko': '림사 로민사 상층 갑판',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 14,
    },
    129: {
        'exVersion': 0,
        'name': {
            'cn': '利姆萨·罗敏萨下层甲板',
            'de': 'Untere Decks',
            'en': 'Limsa Lominsa Lower Decks',
            'fr': 'Limsa Lominsa - L\'Entrepont',
            'ja': 'リムサ・ロミンサ：下甲板層',
            'ko': '림사 로민사 하층 갑판',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 15,
    },
    130: {
        'exVersion': 0,
        'name': {
            'cn': '乌尔达哈现世回廊',
            'de': 'Nald-Kreuzgang',
            'en': 'Ul\'dah - Steps of Nald',
            'fr': 'Ul\'dah - Faubourg de Nald',
            'ja': 'ウルダハ：ナル回廊',
            'ko': '울다하 날 회랑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 7,
    },
    131: {
        'exVersion': 0,
        'name': {
            'cn': '乌尔达哈来生回廊',
            'de': 'Thal-Kreuzgang',
            'en': 'Ul\'dah - Steps of Thal',
            'fr': 'Ul\'dah - Faubourg de Thal',
            'ja': 'ウルダハ：ザル回廊',
            'ko': '울다하 달 회랑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 8,
    },
    132: {
        'exVersion': 0,
        'name': {
            'cn': '格里达尼亚新街',
            'de': 'Neu-Gridania',
            'en': 'New Gridania',
            'fr': 'Nouvelle Gridania',
            'ja': 'グリダニア：新市街',
            'ko': '그리다니아 신시가지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 1,
    },
    133: {
        'exVersion': 0,
        'name': {
            'cn': '格里达尼亚旧街',
            'de': 'Alt-Gridania',
            'en': 'Old Gridania',
            'fr': 'Vieille Gridania',
            'ja': 'グリダニア：旧市街',
            'ko': '그리다니아 구시가지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 2,
    },
    134: {
        'exVersion': 0,
        'name': {
            'cn': '中拉诺西亚',
            'de': 'Zentrales La Noscea',
            'en': 'Middle La Noscea',
            'fr': 'Noscea centrale',
            'ja': '中央ラノシア',
            'ko': '중부 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 16,
    },
    135: {
        'exVersion': 0,
        'name': {
            'cn': '拉诺西亚低地',
            'de': 'Unteres La Noscea',
            'en': 'Lower La Noscea',
            'fr': 'Basse-Noscea',
            'ja': '低地ラノシア',
            'ko': '저지 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 17,
    },
    136: {
        'exVersion': 0,
        'name': {
            'cn': '海雾村',
            'de': 'Dorf des Nebels',
            'en': 'Mist',
            'fr': 'Brumée',
            'ja': 'ミスト・ヴィレッジ',
            'ko': '안갯빛 마을',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 14,
    },
    137: {
        'exVersion': 0,
        'name': {
            'cn': '东拉诺西亚',
            'de': 'Östliches La Noscea',
            'en': 'Eastern La Noscea',
            'fr': 'Noscea orientale',
            'ja': '東ラノシア',
            'ko': '동부 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 18,
    },
    138: {
        'exVersion': 0,
        'name': {
            'cn': '西拉诺西亚',
            'de': 'Westliches La Noscea',
            'en': 'Western La Noscea',
            'fr': 'Noscea occidentale',
            'ja': '西ラノシア',
            'ko': '서부 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 19,
    },
    139: {
        'exVersion': 0,
        'name': {
            'cn': '拉诺西亚高地',
            'de': 'Oberes La Noscea',
            'en': 'Upper La Noscea',
            'fr': 'Haute-Noscea',
            'ja': '高地ラノシア',
            'ko': '고지 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 20,
    },
    140: {
        'exVersion': 0,
        'name': {
            'cn': '西萨纳兰',
            'de': 'Westliches Thanalan',
            'en': 'Western Thanalan',
            'fr': 'Thanalan occidental',
            'ja': '西ザナラーン',
            'ko': '서부 다날란',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 9,
    },
    141: {
        'exVersion': 0,
        'name': {
            'cn': '中萨纳兰',
            'de': 'Zentrales Thanalan',
            'en': 'Central Thanalan',
            'fr': 'Thanalan central',
            'ja': '中央ザナラーン',
            'ko': '중부 다날란',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 10,
    },
    142: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '艾玛吉娜杯斗技大会决赛',
            'de': 'Das Drachenhals-Kolosseum',
            'en': 'The Dragon\'s Neck',
            'fr': 'Le Col du dragon',
            'ja': 'アマジナ杯闘技会決勝戦',
            'ko': '아마지나배 투기대회 결승전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    143: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '皇都伊修加德保卫战',
            'de': 'Der Schicksalsweg',
            'en': 'The Steps of Faith',
            'fr': 'Le Siège de la sainte Cité d\'Ishgard',
            'ja': '皇都イシュガルド防衛戦',
            'ko': '성도 이슈가르드 방어전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    145: {
        'exVersion': 0,
        'name': {
            'cn': '东萨纳兰',
            'de': 'Östliches Thanalan',
            'en': 'Eastern Thanalan',
            'fr': 'Thanalan oriental',
            'ja': '東ザナラーン',
            'ko': '동부 다날란',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 11,
    },
    146: {
        'exVersion': 0,
        'name': {
            'cn': '南萨纳兰',
            'de': 'Südliches Thanalan',
            'en': 'Southern Thanalan',
            'fr': 'Thanalan méridional',
            'ja': '南ザナラーン',
            'ko': '남부 다날란',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 12,
    },
    147: {
        'exVersion': 0,
        'name': {
            'cn': '北萨纳兰',
            'de': 'Nördliches Thanalan',
            'en': 'Northern Thanalan',
            'fr': 'Thanalan septentrional',
            'ja': '北ザナラーン',
            'ko': '북부 다날란',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 13,
    },
    148: {
        'exVersion': 0,
        'name': {
            'cn': '黑衣森林中央林区',
            'de': 'Tiefer Wald',
            'en': 'Central Shroud',
            'fr': 'Forêt centrale',
            'ja': '黒衣森：中央森林',
            'ko': '검은장막 숲 중부삼림',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 3,
    },
    150: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '幻龙残骸密约之塔',
            'de': 'Hüter des Sees',
            'en': 'The Keeper of the Lake',
            'fr': 'Le Gardien du lac',
            'ja': '幻龍残骸 黙約の塔',
            'ko': '묵약의 탑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 74,
    },
    151: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '水晶塔 暗之世界',
            'de': 'Die Welt der Dunkelheit',
            'en': 'The World of Darkness',
            'fr': 'La Tour de Cristal - Monde des Ténèbres',
            'ja': 'クリスタルタワー：闇の世界',
            'ko': '크리스탈 타워: 어둠의 세계',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    152: {
        'exVersion': 0,
        'name': {
            'cn': '黑衣森林东部林区',
            'de': 'Ostwald',
            'en': 'East Shroud',
            'fr': 'Forêt de l\'est',
            'ja': '黒衣森：東部森林',
            'ko': '검은장막 숲 동부삼림',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 4,
    },
    153: {
        'exVersion': 0,
        'name': {
            'cn': '黑衣森林南部林区',
            'de': 'Südwald',
            'en': 'South Shroud',
            'fr': 'Forêt du sud',
            'ja': '黒衣森：南部森林',
            'ko': '검은장막 숲 남부삼림',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 5,
    },
    154: {
        'exVersion': 0,
        'name': {
            'cn': '黑衣森林北部林区',
            'de': 'Nordwald',
            'en': 'North Shroud',
            'fr': 'Forêt du nord',
            'ja': '黒衣森：北部森林',
            'ko': '검은장막 숲 북부삼림',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 6,
    },
    155: {
        'exVersion': 0,
        'name': {
            'cn': '库尔札斯中央高地',
            'de': 'Zentrales Hochland von Coerthas',
            'en': 'Coerthas Central Highlands',
            'fr': 'Hautes terres du Coerthas central',
            'ja': 'クルザス中央高地',
            'ko': '커르다스 중앙고지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 21,
    },
    156: {
        'exVersion': 0,
        'name': {
            'cn': '摩杜纳',
            'de': 'Mor Dhona',
            'en': 'Mor Dhona',
            'fr': 'Mor Dhona',
            'ja': 'モードゥナ',
            'ko': '모르도나',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 22,
    },
    157: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '天然要害沙斯塔夏溶洞',
            'de': 'Sastasha',
            'en': 'Sastasha',
            'fr': 'Sastasha',
            'ja': '天然要害 サスタシャ浸食洞',
            'ko': '사스타샤 침식 동굴',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    158: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '休养胜地布雷福洛克斯野营地',
            'de': 'Brüllvolx\' Langrast',
            'en': 'Brayflox\'s Longstop',
            'fr': 'Le Bivouac de Brayflox',
            'ja': '奪還支援 ブレイフロクスの野営地',
            'ko': '브레이플록스의 야영지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    159: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '神灵圣域放浪神古神殿',
            'de': 'Palast des Wanderers',
            'en': 'The Wanderer\'s Palace',
            'fr': 'Le Palais du Vagabond',
            'ja': '旅神聖域 ワンダラーパレス',
            'ko': '방랑자의 궁전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    160: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '领航明灯天狼星灯塔',
            'de': 'Pharos Sirius',
            'en': 'Pharos Sirius',
            'fr': 'Le Phare de Sirius',
            'ja': '怪鳥巨塔 シリウス大灯台',
            'ko': '시리우스 대등대',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    161: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '封锁坑道铜铃铜山',
            'de': 'Kupferglocken-Mine',
            'en': 'Copperbell Mines',
            'fr': 'Les Mines de Clochecuivre',
            'ja': '封鎖坑道 カッパーベル銅山',
            'ko': '구리종 광산',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    162: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '魔兽领域日影地修炼所',
            'de': 'Halatali',
            'en': 'Halatali',
            'fr': 'Halatali',
            'ja': '魔獣領域 ハラタリ修練所',
            'ko': '할라탈리 수련장',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    163: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '古代遗迹喀恩埋没圣堂',
            'de': 'Versunkener Tempel von Qarn',
            'en': 'The Sunken Temple of Qarn',
            'fr': 'Le Temple enseveli de Qarn',
            'ja': '遺跡探索 カルン埋没寺院',
            'ko': '카른의 무너진 사원',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    164: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '地下灵殿塔姆·塔拉墓园',
            'de': 'Totenacker Tam-Tara',
            'en': 'The Tam–Tara Deepcroft',
            'fr': 'L\'Hypogée de Tam-Tara',
            'ja': '地下霊殿 タムタラの墓所',
            'ko': '탐타라 묘소',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 300,
        'weatherRate': 0,
    },
    166: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '名门府邸静语庄园',
            'de': 'Haukke-Herrenhaus',
            'en': 'Haukke Manor',
            'fr': 'Le Manoir des Haukke',
            'ja': '名門屋敷 ハウケタ御用邸',
            'ko': '하우케타 별궁',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    167: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '邪教驻地无限城古堡',
            'de': 'Die Ruinen von Amdapor',
            'en': 'Amdapor Keep',
            'fr': 'Le Château d\'Amdapor',
            'ja': '邪教排撃 古城アムダプール',
            'ko': '옛 암다포르 성',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    168: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '对龙城塞石卫塔',
            'de': 'Steinerne Wacht',
            'en': 'The Stone Vigil',
            'fr': 'Le Vigile de Pierre',
            'ja': '城塞攻略 ストーンヴィジル',
            'ko': '돌방패 경계초소',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 27,
    },
    169: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '监狱废墟托托·拉克千狱',
            'de': 'Tausend Löcher von Toto-Rak',
            'en': 'The Thousand Maws of Toto–Rak',
            'fr': 'Les Mille Gueules de Toto-Rak',
            'ja': '監獄廃墟 トトラクの千獄',
            'ko': '토토라크 감옥',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    170: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '流沙迷宫樵鸣洞',
            'de': 'Sägerschrei',
            'en': 'Cutter\'s Cry',
            'fr': 'Le Gouffre hurlant',
            'ja': '流砂迷宮 カッターズクライ',
            'ko': '나무꾼의 비명',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    171: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '山中战线泽梅尔要塞',
            'de': 'Die Feste Dzemael',
            'en': 'Dzemael Darkhold',
            'fr': 'La Forteresse de Dzemael',
            'ja': '掃討作戦 ゼーメル要塞',
            'ko': '제멜 요새',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    172: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '毒雾洞窟黄金谷',
            'de': 'Goldklamm',
            'en': 'The Aurum Vale',
            'fr': 'Le Val d\'Aurum',
            'ja': '霧中行軍 オーラムヴェイル',
            'ko': '금빛 골짜기',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    174: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '水晶塔 古代人迷宫',
            'de': 'Kristallturm - Das Labyrinth der Alten',
            'en': 'The Labyrinth of the Ancients',
            'fr': 'La Tour de Cristal - Dédale antique',
            'ja': 'クリスタルタワー：古代の民の迷宮',
            'ko': '크리스탈 타워: 고대인의 미궁',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    180: {
        'exVersion': 0,
        'name': {
            'cn': '拉诺西亚外地',
            'de': 'Äußeres La Noscea',
            'en': 'Outer La Noscea',
            'fr': 'Noscea extérieure',
            'ja': '外地ラノシア',
            'ko': '외지 라노시아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 24,
    },
    188: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '武装圣域放浪神古神殿',
            'de': 'Palast des Wanderers (schwer)',
            'en': 'The Wanderer\'s Palace (Hard)',
            'fr': 'Le Palais du Vagabond (brutal)',
            'ja': '武装聖域 ワンダラーパレス (Hard)',
            'ko': '방랑자의 궁전(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 40,
    },
    189: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '邪念妖地无限城古堡',
            'de': 'Die Ruinen von Amdapor (schwer)',
            'en': 'Amdapor Keep (Hard)',
            'fr': 'Le Château d\'Amdapor (brutal)',
            'ja': '邪念排撃 古城アムダプール (Hard)',
            'ko': '옛 암다포르 성(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 40,
    },
    190: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '讨伐彷徨死灵！',
            'de': 'Bockmanns Gefolge',
            'en': 'Under the Armor',
            'fr': 'Chasse au fantôme fantoche',
            'ja': '彷徨う死霊を討て！',
            'ko': '방황하는 사령을 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 3,
    },
    191: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '驱除剧毒妖花！',
            'de': 'Unkraut jäten',
            'en': 'Pulling Poison Posies',
            'fr': 'Opération fleurs du mal',
            'ja': '有毒妖花を駆除せよ！',
            'ko': '독성 요괴꽃을 제거하라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 4,
    },
    192: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '消灭恶徒团伙寄生蜂团！',
            'de': 'Ins Wespennest stechen',
            'en': 'Stinging Back',
            'fr': 'Expédition punitive contre les Ventrerouge',
            'ja': '無法者「似我蜂団」を撃滅せよ！',
            'ko': '무법자 집단 \'나나니단\'을 섬멸하라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 5,
    },
    193: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 真源之章1',
            'de': 'Verschlungene Schatten 3 - 1',
            'en': 'The Final Coil of Bahamut - Turn 1',
            'fr': 'L\'Abîme de Bahamut I',
            'ja': '大迷宮バハムート：真成編1',
            'ko': '대미궁 바하무트: 진성편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    194: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 真源之章2',
            'de': 'Verschlungene Schatten 3 - 2',
            'en': 'The Final Coil of Bahamut - Turn 2',
            'fr': 'L\'Abîme de Bahamut II',
            'ja': '大迷宮バハムート：真成編2',
            'ko': '대미궁 바하무트: 진성편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    195: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 真源之章3',
            'de': 'Verschlungene Schatten 3 - 3',
            'en': 'The Final Coil of Bahamut - Turn 3',
            'fr': 'L\'Abîme de Bahamut III',
            'ja': '大迷宮バハムート：真成編3',
            'ko': '대미궁 바하무트: 진성편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    196: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 真源之章4',
            'de': 'Verschlungene Schatten 3 - 4',
            'en': 'The Final Coil of Bahamut - Turn 4',
            'fr': 'L\'Abîme de Bahamut IV',
            'ja': '大迷宮バハムート：真成編4',
            'ko': '대미궁 바하무트: 진성편 4',
        },
        'offsetX': -448,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 44,
    },
    202: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '伊弗利特讨伐战',
            'de': 'Das Grab der Lohe',
            'en': 'The Bowl of Embers',
            'fr': 'Le Cratère des tisons',
            'ja': 'イフリート討伐戦',
            'ko': '이프리트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 25,
    },
    206: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '泰坦讨伐战',
            'de': 'Der Nabel',
            'en': 'The Navel',
            'fr': 'Le Nombril',
            'ja': 'タイタン討伐戦',
            'ko': '타이탄 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    207: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '莫古力贤王歼灭战',
            'de': 'Königliche Konfrontation (schwer)',
            'en': 'Thornmarch (Hard)',
            'fr': 'La Lisière de ronces (brutal)',
            'ja': '善王モグル・モグXII世討滅戦',
            'ko': '선왕 모그루 모그 XII세 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 30,
    },
    208: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '迦楼罗讨伐战',
            'de': 'Das Tosende Auge',
            'en': 'The Howling Eye',
            'fr': 'Hurlœil',
            'ja': 'ガルーダ討伐戦',
            'ko': '가루다 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 26,
    },
    214: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '完成集团战训练！',
            'de': 'Einer für alle, alle für einen',
            'en': 'Basic Training: Enemy Parties',
            'fr': 'Entraînement<Indent/>: groupes d\'ennemis',
            'ja': '集団戦訓練をくぐり抜けろ！',
            'ko': '집단전 훈련을 완수하라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 16,
    },
    215: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '突破所有关门，讨伐最深处的敌人！',
            'de': 'Sturmkommando',
            'en': 'Basic Training: Enemy Strongholds',
            'fr': 'Entraînement<Indent/>: in<SoftHyphen/>fil<SoftHyphen/>tra<SoftHyphen/>tion en base ennemie',
            'ja': '全関門を突破し、最深部の敵を討て！',
            'ko': '관문을 돌파하고 최심부의 적을 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 9,
    },
    216: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '捕获金币龟！',
            'de': 'Gil oder Leben',
            'en': 'Hero on the Half Shell',
            'fr': 'Reconquête d\'une carapace escamotée',
            'ja': 'ギルガメを捕獲せよ！',
            'ko': '길거북을 사로잡아라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 10,
    },
    217: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '帝国南方堡外围激战',
            'de': 'Castrum Meridianum - Außenbereich',
            'en': 'Castrum Meridianum',
            'fr': 'Castrum Meridianum',
            'ja': '外郭攻略 カストルム・メリディアヌム',
            'ko': '카스트룸 메리디아눔',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    219: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '击溃哥布林炸弹军团！',
            'de': 'Bombige Goblins',
            'en': 'Flicking Sticks and Taking Names',
            'fr': 'Les Gobelins bombardiers',
            'ja': '爆弾魔ゴブリン軍団を撃滅せよ！',
            'ko': '폭탄광 고블린 군단을 섬멸하라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 3,
    },
    220: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '讨伐梦幻之布拉奇希奥！',
            'de': 'Briaxio ausschalten',
            'en': 'All\'s Well that Ends in the Well',
            'fr': 'Briaxio à bras raccourcis',
            'ja': '夢幻のブラキシオを討て！',
            'ko': '몽환의 브라크시오를 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 5,
    },
    221: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '讨伐污染源头魔界花！',
            'de': 'Tödliches Rankenspiel',
            'en': 'More than a Feeler',
            'fr': 'Sus au morbol pollueur',
            'ja': '汚染源モルボルを討て！',
            'ko': '오염원 몰볼을 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 20,
    },
    222: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '讨伐坑道中出现的妖异！',
            'de': 'Gefahr aus dem Nichts',
            'en': 'Annoy the Void',
            'fr': 'Buso l\'immolateur',
            'ja': '坑道に現れた妖異ブソを討て！',
            'ko': '갱도에 나타난 요마 부소를 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 17,
    },
    223: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '注意无敌的眷属，讨伐大型妖异！',
            'de': 'Kampf gegen Schatten',
            'en': 'Shadow and Claw',
            'fr': 'Ombres et griffes',
            'ja': '無敵の眷属を従えし、大型妖異を討て！',
            'ko': '무적의 부하를 조종하는 요마를 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 21,
    },
    224: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '天幕魔导城最终决战',
            'de': 'Castrum Meridianum - Praetorium',
            'en': 'The Praetorium',
            'fr': 'Le Praetorium',
            'ja': '最終決戦 魔導城プラエトリウム',
            'ko': '마도성 프라이토리움',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    241: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 邂逅之章1',
            'de': 'Verschlungene Schatten 1',
            'en': 'The Binding Coil of Bahamut - Turn 1',
            'fr': 'Le Labyrinthe de Bahamut I',
            'ja': '大迷宮バハムート：邂逅編1',
            'ko': '대미궁 바하무트: 해후편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    242: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 邂逅之章2',
            'de': 'Verschlungene Schatten 2',
            'en': 'The Binding Coil of Bahamut - Turn 2',
            'fr': 'Le Labyrinthe de Bahamut II',
            'ja': '大迷宮バハムート：邂逅編2',
            'ko': '대미궁 바하무트: 해후편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    243: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 邂逅之章3',
            'de': 'Verschlungene Schatten 3',
            'en': 'The Binding Coil of Bahamut - Turn 3',
            'fr': 'Le Labyrinthe de Bahamut III',
            'ja': '大迷宮バハムート：邂逅編3',
            'ko': '대미궁 바하무트: 해후편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    244: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 邂逅之章4',
            'de': 'Verschlungene Schatten 4',
            'en': 'The Binding Coil of Bahamut - Turn 4',
            'fr': 'Le Labyrinthe de Bahamut IV',
            'ja': '大迷宮バハムート：邂逅編4',
            'ko': '대미궁 바하무트: 해후편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    245: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 邂逅之章5',
            'de': 'Verschlungene Schatten 5',
            'en': 'The Binding Coil of Bahamut - Turn 5',
            'fr': 'Le Labyrinthe de Bahamut V',
            'ja': '大迷宮バハムート：邂逅編5',
            'ko': '대미궁 바하무트: 해후편 5',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    250: {
        'exVersion': 0,
        'name': {
            'cn': '狼狱停船场',
            'de': 'Wolfshöhlen-Pier',
            'en': 'Wolves\' Den Pier',
            'fr': 'Jetée de l\'Antre des loups',
            'ja': 'ウルヴズジェイル係船場',
            'ko': '늑대우리 부두',
        },
        'offsetX': -77,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 29,
    },
    281: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '利维亚桑歼灭战',
            'de': 'Götterdämmerung - Leviathan',
            'en': 'The <Emphasis>Whorleater</Emphasis> (Hard)',
            'fr': 'Le Briseur de marées (brutal)',
            'ja': '真リヴァイアサン討滅戦',
            'ko': '진 리바이어선 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 38,
    },
    292: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '伊弗利特歼灭战',
            'de': 'Götterdämmerung - Ifrit',
            'en': 'The Bowl of Embers (Hard)',
            'fr': 'Le Cratère des tisons (brutal)',
            'ja': '真イフリート討滅戦',
            'ko': '진 이프리트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 25,
    },
    293: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '泰坦歼灭战',
            'de': 'Götterdämmerung - Titan',
            'en': 'The Navel (Hard)',
            'fr': 'Le Nombril (brutal)',
            'ja': '真タイタン討滅戦',
            'ko': '진 타이탄 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    294: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '迦楼罗歼灭战',
            'de': 'Götterdämmerung - Garuda',
            'en': 'The Howling Eye (Hard)',
            'fr': 'Hurlœil (brutal)',
            'ja': '真ガルーダ討滅戦',
            'ko': '진 가루다 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 26,
    },
    295: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '伊弗利特歼殛战',
            'de': 'Zenit der Götter - Ifrit',
            'en': 'The Bowl of Embers (Extreme)',
            'fr': 'Le Cratère des tisons (extrême)',
            'ja': '極イフリート討滅戦',
            'ko': '극 이프리트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 25,
    },
    296: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '泰坦歼殛战',
            'de': 'Zenit der Götter - Titan',
            'en': 'The Navel (Extreme)',
            'fr': 'Le Nombril (extrême)',
            'ja': '極タイタン討滅戦',
            'ko': '극 타이탄 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    297: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '迦楼罗歼殛战',
            'de': 'Zenit der Götter - Garuda',
            'en': 'The Howling Eye (Extreme)',
            'fr': 'Hurlœil (extrême)',
            'ja': '極ガルーダ討滅戦',
            'ko': '극 가루다 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 26,
    },
    298: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '讨伐爆弹怪的女王！',
            'de': 'Miss Bombastic',
            'en': 'Long Live the Queen',
            'fr': 'Longue vie à la Reine',
            'ja': 'ボムを率いる「ボムクイーン」を討て！',
            'ko': '봄을 거느린 \'봄 여왕\'을 쓰러뜨려라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 21,
    },
    299: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '歼灭特殊阵型的妖异！',
            'de': 'Unzertrennlich',
            'en': 'Ward Up',
            'fr': 'Quintettes infernaux',
            'ja': '不気味な陣形を組む妖異をせん滅せよ！',
            'ko': '불길한 진형을 짜는 요마를 섬멸하라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 22,
    },
    300: {
        'contentType': 3,
        'exVersion': 0,
        'name': {
            'cn': '制止三方混战的巨人族，守住遗物！',
            'de': 'Wuchtige Dreifaltigkeit',
            'en': 'Solemn Trinity',
            'fr': 'Trinité sinistre',
            'ja': '三つ巴の巨人族を制し、遺物を守れ！',
            'ko': '세 거인족을 제압하여 유물을 지켜내라!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 22,
    },
    332: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '里塔提恩强攻战',
            'de': 'Kap Westwind',
            'en': 'Cape Westwind',
            'fr': 'Le Cap Vendouest',
            'ja': 'リットアティン強襲戦',
            'ko': '리트아틴 강습전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 9,
    },
    348: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '究极神兵破坏作战',
            'de': 'Heldenlied von Ultima',
            'en': 'The Minstrel\'s Ballad: Ultima\'s Bane',
            'fr': 'Le fléau d\'Ultima',
            'ja': '究極幻想 アルテマウェポン破壊作戦',
            'ko': '알테마 웨폰 파괴작전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 31,
    },
    349: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '骚乱坑道铜铃铜山',
            'de': 'Kupferglocken-Mine (schwer)',
            'en': 'Copperbell Mines (Hard)',
            'fr': 'Les Mines de Clochecuivre (brutal)',
            'ja': '騒乱坑道 カッパーベル銅山 (Hard)',
            'ko': '구리종 광산(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    350: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '恶灵府邸静语庄园',
            'de': 'Haukke-Herrenhaus (schwer)',
            'en': 'Haukke Manor (Hard)',
            'fr': 'Le Manoir des Haukke (brutal)',
            'ja': '妖異屋敷 ハウケタ御用邸 (Hard)',
            'ko': '하우케타 별궁(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    353: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '活动挑战2',
            'de': 'Event-Inhalt 1',
            'en': 'Special Event I',
            'fr': 'Défi spécial I',
            'ja': 'イベント用コンテンツ：1',
            'ko': '이벤트용 임무: 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    354: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '活动挑战3',
            'de': 'Event-Inhalt 2',
            'en': 'Special Event II',
            'fr': 'Défi spécial II',
            'ja': 'イベント用コンテンツ：2',
            'ko': '이벤트용 임무: 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 103,
    },
    355: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 入侵之章1',
            'de': 'Verschlungene Schatten 2 - 1',
            'en': 'The Second Coil of Bahamut - Turn 1',
            'fr': 'Les Méandres de Bahamut I',
            'ja': '大迷宮バハムート：侵攻編1',
            'ko': '대미궁 바하무트: 침공편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    356: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 入侵之章2',
            'de': 'Verschlungene Schatten 2 - 2',
            'en': 'The Second Coil of Bahamut - Turn 2',
            'fr': 'Les Méandres de Bahamut II',
            'ja': '大迷宮バハムート：侵攻編2',
            'ko': '대미궁 바하무트: 침공편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    357: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 入侵之章3',
            'de': 'Verschlungene Schatten 2 - 3',
            'en': 'The Second Coil of Bahamut - Turn 3',
            'fr': 'Les Méandres de Bahamut III',
            'ja': '大迷宮バハムート：侵攻編3',
            'ko': '대미궁 바하무트: 침공편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    358: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特大迷宫 入侵之章4',
            'de': 'Verschlungene Schatten 2 - 4',
            'en': 'The Second Coil of Bahamut - Turn 4',
            'fr': 'Les Méandres de Bahamut IV',
            'ja': '大迷宮バハムート：侵攻編4',
            'ko': '대미궁 바하무트: 침공편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    359: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '利维亚桑歼殛战',
            'de': 'Zenit der Götter - Leviathan',
            'en': 'The <Emphasis>Whorleater</Emphasis> (Extreme)',
            'fr': 'Le Briseur de marées (extrême)',
            'ja': '極リヴァイアサン討滅戦',
            'ko': '극 리바이어선 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 38,
    },
    360: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '剑斗领域日影地修炼所',
            'de': 'Halatali (schwer)',
            'en': 'Halatali (Hard)',
            'fr': 'Halatali (brutal)',
            'ja': '剣闘領域 ハラタリ修練所 (Hard)',
            'ko': '할라탈리 수련장(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    361: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '财宝传说破舰岛',
            'de': 'Schiffbrecher-Insel',
            'en': 'Hullbreaker Isle',
            'fr': 'L\'Île de Crèvecarène',
            'ja': '財宝伝説 ハルブレーカー・アイル',
            'ko': '난파선의 섬',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    362: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '纷争要地布雷福洛克斯野营地',
            'de': 'Brüllvolx\' Langrast (schwer)',
            'en': 'Brayflox\'s Longstop (Hard)',
            'fr': 'Le Bivouac de Brayflox (brutal)',
            'ja': '盟友支援 ブレイフロクスの野営地 (Hard)',
            'ko': '브레이플록스의 야영지(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 37,
    },
    363: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '腐坏遗迹无限城市街古迹',
            'de': 'Historisches Amdapor',
            'en': 'The Lost City of Amdapor',
            'fr': 'Les Vestiges de la cité d\'Amdapor',
            'ja': '腐敗遺跡 古アムダプール市街',
            'ko': '옛 암다포르 시가지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 40,
    },
    364: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '莫古力贤王歼殛战',
            'de': 'Königliche Konfrontation (extrem)',
            'en': 'Thornmarch (Extreme)',
            'fr': 'La Lisière de ronces (extrême)',
            'ja': '極王モグル・モグXII世討滅戦',
            'ko': '극왕 모그루 모그 XII세 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 30,
    },
    365: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '激战城塞石卫塔',
            'de': 'Steinerne Wacht (schwer)',
            'en': 'The Stone Vigil (Hard)',
            'fr': 'Le Vigile de Pierre (brutal)',
            'ja': '城塞奪回 ストーンヴィジル (Hard)',
            'ko': '돌방패 경계초소(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 42,
    },
    366: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '大桥上的决斗',
            'de': 'Duell auf der großen Brücke',
            'en': 'Battle on the Big Bridge',
            'fr': 'Affrontement sur le grand pont',
            'ja': 'ギルガメッシュ討伐戦',
            'ko': '길가메시 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    367: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '苏醒遗迹喀恩埋没圣堂',
            'de': 'Versunkener Tempel von Qarn (schwer)',
            'en': 'The Sunken Temple of Qarn (Hard)',
            'fr': 'Le Temple enseveli de Qarn (brutal)',
            'ja': '遺跡救援 カルン埋没寺院 (Hard)',
            'ko': '카른의 무너진 사원(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 41,
    },
    368: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '死化奇美拉讨伐战',
            'de': 'Kampf gegen die Dhorme-Chimära',
            'en': 'A Relic Reborn: the Chimera',
            'fr': 'La chimère dhorme du Coerthas',
            'ja': 'ドルムキマイラ討伐戦',
            'ko': '도름 키마이라 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 21,
    },
    369: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '海德拉讨伐战',
            'de': 'Kampf gegen die Hydra',
            'en': 'A Relic Reborn: the Hydra',
            'fr': 'L\'hydre d\'Halatali',
            'ja': 'ハイドラ討伐戦',
            'ko': '하이드라 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    371: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '凛冽洞天披雪大冰壁',
            'de': 'Das Schneekleid',
            'en': 'Snowcloak',
            'fr': 'Manteneige',
            'ja': '氷結潜窟 スノークローク大氷壁',
            'ko': '얼음외투 대빙벽',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 42,
    },
    372: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '水晶塔 希尔科斯塔',
            'de': 'Kristallturm - Der Syrcus-Turm',
            'en': 'Syrcus Tower',
            'fr': 'La Tour de Cristal - Tour de Syrcus',
            'ja': 'クリスタルタワー：シルクスの塔',
            'ko': '크리스탈 타워: 시르쿠스 탑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    373: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '惨剧灵殿塔姆·塔拉墓园',
            'de': 'Totenacker Tam-Tara (schwer)',
            'en': 'The Tam–Tara Deepcroft (Hard)',
            'fr': 'L\'Hypogée de Tam-Tara (brutal)',
            'ja': '惨劇霊殿 タムタラの墓所 (Hard)',
            'ko': '탐타라 묘소(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 300,
        'weatherRate': 0,
    },
    374: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '拉姆歼灭战',
            'de': 'Götterdämmerung - Ramuh',
            'en': 'The Striking Tree (Hard)',
            'fr': 'L\'Arbre du jugement (brutal)',
            'ja': '真ラムウ討滅戦',
            'ko': '진 라무 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 43,
    },
    375: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '拉姆歼殛战',
            'de': 'Zenit der Götter - Ramuh',
            'en': 'The Striking Tree (Extreme)',
            'fr': 'L\'Arbre du jugement (extrême)',
            'ja': '極ラムウ討滅戦',
            'ko': '극 라무 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 43,
    },
    376: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '周边遗迹群 (阵地战)',
            'de': 'Äußere Ruinen (Sicherung)',
            'en': 'The Borderland Ruins (Secure)',
            'fr': 'Les Ruines frontalières (annexion)',
            'ja': '外縁遺跡群 (制圧戦)',
            'ko': '외곽 유적지대(제압전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    377: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '希瓦歼灭战',
            'de': 'Götterdämmerung - Shiva',
            'en': 'The Akh Afah Amphitheatre (Hard)',
            'fr': 'L\'Amphithéâtre d\'Akh Afah (brutal)',
            'ja': '真シヴァ討滅戦',
            'ko': '진 시바 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 46,
    },
    378: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '希瓦歼殛战',
            'de': 'Zenit der Götter - Shiva',
            'en': 'The Akh Afah Amphitheatre (Extreme)',
            'fr': 'L\'Amphithéâtre d\'Akh Afah (extrême)',
            'ja': '極シヴァ討滅戦',
            'ko': '극 시바 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 46,
    },
    380: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特零式大迷宫 入侵之章1',
            'de': 'Verschlungene Schatten 2 - 1 (episch)',
            'en': 'The Second Coil of Bahamut (Savage) - Turn 1',
            'fr': 'Les Méandres de Bahamut I (sadique)',
            'ja': '大迷宮バハムート零式：侵攻編1',
            'ko': '대미궁 바하무트: 침공편(영웅) 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    381: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特零式大迷宫 入侵之章2',
            'de': 'Verschlungene Schatten 2 - 2 (episch)',
            'en': 'The Second Coil of Bahamut (Savage) - Turn 2',
            'fr': 'Les Méandres de Bahamut II (sadique)',
            'ja': '大迷宮バハムート零式：侵攻編2',
            'ko': '대미궁 바하무트: 침공편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    382: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特零式大迷宫 入侵之章3',
            'de': 'Verschlungene Schatten 2 - 3 (episch)',
            'en': 'The Second Coil of Bahamut (Savage) - Turn 3',
            'fr': 'Les Méandres de Bahamut III (sadique)',
            'ja': '大迷宮バハムート零式：侵攻編3',
            'ko': '대미궁 바하무트: 침공편(영웅) 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    383: {
        'contentType': 5,
        'exVersion': 0,
        'name': {
            'cn': '巴哈姆特零式大迷宫 入侵之章4',
            'de': 'Verschlungene Schatten 2 - 4 (episch)',
            'en': 'The Second Coil of Bahamut (Savage) - Turn 4',
            'fr': 'Les Méandres de Bahamut IV (sadique)',
            'ja': '大迷宮バハムート零式：侵攻編4',
            'ko': '대미궁 바하무트: 침공편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    387: {
        'contentType': 2,
        'exVersion': 0,
        'name': {
            'cn': '逆转要害沙斯塔夏溶洞',
            'de': 'Sastasha (schwer)',
            'en': 'Sastasha (Hard)',
            'fr': 'Sastasha (brutal)',
            'ja': '逆襲要害 サスタシャ浸食洞 (Hard)',
            'ko': '사스타샤 침식 동굴(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    389: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '陆行鸟竞赛：太阳海岸',
            'de': 'Chocobo-Rennen: Sonnenküste',
            'en': 'Chocobo Race: Costa del Sol',
            'fr': 'Course de chocobos<Indent/>: Costa del Sol',
            'ja': 'チョコボレース：コスタ・デル・ソル',
            'ko': '초코보 경주: 코스타 델 솔',
        },
        'offsetX': -472,
        'offsetY': -424,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    390: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '陆行鸟竞赛：荒野大道',
            'de': 'Chocobo-Rennen: Sagolii-Straße',
            'en': 'Chocobo Race: Sagolii Road',
            'fr': 'Course de chocobos<Indent/>: Route de Sagolii',
            'ja': 'チョコボレース：サゴリーロード',
            'ko': '초코보 경주: 사골리 사막',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    391: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '陆行鸟竞赛：恬静小路',
            'de': 'Chocobo-Rennen: Pfad der Seelenruhe',
            'en': 'Chocobo Race: Tranquil Paths',
            'fr': 'Course de chocobos<Indent/>: Sentes tranquilles',
            'ja': 'チョコボレース：トランキルパス',
            'ko': '초코보 경주: 고요한 야영지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    394: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '奥丁歼灭战',
            'de': 'Jenseits Urths Quelle',
            'en': 'Urth\'s Fount',
            'fr': 'La Fontaine d\'Urth',
            'ja': '闘神オーディン討滅戦',
            'ko': '투신 오딘 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 45,
    },
    396: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '无限城的死斗',
            'de': 'Revanche in den Ruinen',
            'en': 'Battle in the Big Keep',
            'fr': 'Revanche au vieux château',
            'ja': '真ギルガメッシュ討滅戦',
            'ko': '진 길가메시 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    397: {
        'exVersion': 1,
        'name': {
            'cn': '库尔札斯西部高地',
            'de': 'Westliches Hochland von Coerthas',
            'en': 'Coerthas Western Highlands',
            'fr': 'Hautes terres du Coerthas occidental',
            'ja': 'クルザス西部高地',
            'ko': '커르다스 서부고지',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 49,
    },
    398: {
        'exVersion': 1,
        'name': {
            'cn': '龙堡参天高地',
            'de': 'Dravanisches Vorland',
            'en': 'The Dravanian Forelands',
            'fr': 'Avant-pays dravanien',
            'ja': '高地ドラヴァニア',
            'ko': '고지 드라바니아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 50,
    },
    399: {
        'exVersion': 1,
        'name': {
            'cn': '龙堡内陆低地',
            'de': 'Dravanisches Hinterland',
            'en': 'The Dravanian Hinterlands',
            'fr': 'Arrière-pays dravanien',
            'ja': '低地ドラヴァニア',
            'ko': '저지 드라바니아',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 51,
    },
    400: {
        'exVersion': 1,
        'name': {
            'cn': '翻云雾海',
            'de': 'Wallende Nebel',
            'en': 'The Churning Mists',
            'fr': 'L\'Écume des cieux de Dravania',
            'ja': 'ドラヴァニア雲海',
            'ko': '드라바니아 구름바다',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 52,
    },
    401: {
        'exVersion': 1,
        'name': {
            'cn': '阿巴拉提亚云海',
            'de': 'Abalathisches Wolkenmeer',
            'en': 'The Sea of Clouds',
            'fr': 'L\'Écume des cieux d\'Abalathia',
            'ja': 'アバラシア雲海',
            'ko': '아발라시아 구름바다',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 53,
    },
    402: {
        'exVersion': 1,
        'name': {
            'cn': '魔大陆阿济兹拉',
            'de': 'Azys Lla',
            'en': 'Azys Lla',
            'fr': 'Azys Lla',
            'ja': 'アジス・ラー',
            'ko': '아지스 라',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 54,
    },
    403: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '英雄归来',
            'de': 'Verrat der Qalyana',
            'en': 'Return of the Bull',
            'fr': 'Retour au bercail',
            'ja': '英雄の帰還',
            'ko': '영웅의 귀환',
        },
        'offsetX': -250,
        'offsetY': 128,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    416: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '学识宝库迦巴勒幻想图书馆',
            'de': 'Große Gubal-Bibliothek',
            'en': 'The Great Gubal Library',
            'fr': 'La Grande bibliothèque de Gubal',
            'ja': '禁書回収 グブラ幻想図書館',
            'ko': '구브라 환상도서관',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    417: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '陆行鸟竞赛：竞赛教学',
            'de': 'Chocobo-Rennen: Übungsbahn',
            'en': 'Chocobo Race: Tutorial',
            'fr': 'Course d\'appentissage',
            'ja': 'チョコボレース：チュートリアル',
            'ko': '초코보 경주: 튜토리얼',
        },
        'offsetX': 0,
        'offsetY': -690,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    418: {
        'exVersion': 1,
        'name': {
            'cn': '伊修加德基础层',
            'de': 'Fundamente',
            'en': 'Foundation',
            'fr': 'Ishgard - L\'Assise',
            'ja': 'イシュガルド：下層',
            'ko': '이슈가르드 하층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 47,
    },
    419: {
        'exVersion': 1,
        'name': {
            'cn': '伊修加德砥柱层',
            'de': 'Strebewerk',
            'en': 'The Pillars',
            'fr': 'Ishgard - Les Contreforts',
            'ja': 'イシュガルド：上層',
            'ko': '이슈가르드 상층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 48,
    },
    420: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '空中神域不获岛',
            'de': 'Nimmerreich',
            'en': 'Neverreap',
            'fr': 'Nalloncques',
            'ja': '神域浮島 ネバーリープ',
            'ko': '거두지 않는 섬',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    421: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '圣教中枢伊修加德教皇厅',
            'de': 'Erzbasilika',
            'en': 'The Vault',
            'fr': 'La Voûte',
            'ja': '強硬突入 イシュガルド教皇庁',
            'ko': '이슈가르드 교황청',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    426: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '那布里亚勒斯讨伐战',
            'de': 'Chrysalis',
            'en': 'The Chrysalis',
            'fr': 'La Chrysalide',
            'ja': 'アシエン・ナプリアレス討伐戦',
            'ko': '아씨엔 나브리알레스 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    430: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '博物战舰无限回廊',
            'de': 'Die Fraktal-Kontinuum',
            'en': 'The Fractal Continuum',
            'fr': 'Le Continuum fractal',
            'ja': '博物戦艦 フラクタル・コンティニアム',
            'ko': '무한연속 박물함',
        },
        'offsetX': 0,
        'offsetY': -213,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    431: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '尘封秘岩 (争夺战)',
            'de': 'Robbenholm (Eroberung)',
            'en': 'Seal Rock (Seize)',
            'fr': 'Le Rocher des tréfonds (invasion)',
            'ja': 'シールロック (争奪戦)',
            'ko': '봉인된 바위섬(쟁탈전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 59,
    },
    432: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '罗波那歼灭战',
            'de': 'Götterdämmerung - Ravana',
            'en': 'Thok ast Thok (Hard)',
            'fr': 'Thok ast Thok (brutal)',
            'ja': '真ラーヴァナ討滅戦',
            'ko': '진 라바나 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 57,
    },
    434: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '冰雪废堡暮卫塔',
            'de': 'Abendrot-Wacht',
            'en': 'The Dusk Vigil',
            'fr': 'Le Vigile du Crépuscule',
            'ja': '廃砦捜索 ダスクヴィジル',
            'ko': '어스름 요새',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 42,
    },
    435: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '邪龙王座龙巢神殿',
            'de': 'Nest des Drachen',
            'en': 'The Aery',
            'fr': 'L\'Aire',
            'ja': '邪竜血戦 ドラゴンズエアリー',
            'ko': '용의 둥지',
        },
        'offsetX': -40,
        'offsetY': 55,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    436: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '俾斯麦歼灭战',
            'de': 'Götterdämmerung - Bismarck',
            'en': 'The Limitless Blue (Hard)',
            'fr': 'L\'Immensité bleue (brutal)',
            'ja': '真ビスマルク討滅戦',
            'ko': '진 비스마르크 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 28,
    },
    437: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '圆桌骑士歼灭战',
            'de': 'Singularitäts-Reaktor',
            'en': 'The Singularity Reactor',
            'fr': 'Le Réacteur de singularité',
            'ja': 'ナイツ・オブ・ラウンド討滅戦',
            'ko': '나이츠 오브 라운드 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 56,
    },
    438: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '血战苍穹魔科学研究所',
            'de': 'Ätherochemisches For<SoftHyphen/>schungs<SoftHyphen/>labor',
            'en': 'The Aetherochemical Research Facility',
            'fr': 'Le Laboratoire de magismologie',
            'ja': '蒼天聖戦 魔科学研究所',
            'ko': '마과학 연구소',
        },
        'offsetX': -18,
        'offsetY': 149,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    441: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '天山绝顶索姆阿尔灵峰',
            'de': 'Sohm Al',
            'en': 'Sohm Al',
            'fr': 'Sohm Al',
            'ja': '霊峰踏破 ソーム・アル',
            'ko': '솜 알',
        },
        'offsetX': 185,
        'offsetY': 51,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    442: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 启动之章1',
            'de': 'Alexander - Faust des Vaters',
            'en': 'Alexander - The Fist of the Father',
            'fr': 'Alexander - Le Poing du Père',
            'ja': '機工城アレキサンダー：起動編1',
            'ko': '기공성 알렉산더: 기동편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    443: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 启动之章2',
            'de': 'Alexander - Elle des Vaters',
            'en': 'Alexander - The Cuff of the Father',
            'fr': 'Alexander - Le Poignet du Père',
            'ja': '機工城アレキサンダー：起動編2',
            'ko': '기공성 알렉산더: 기동편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    444: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 启动之章3',
            'de': 'Alexander - Arm des Vaters',
            'en': 'Alexander - The Arm of the Father',
            'fr': 'Alexander - Le Bras du Père',
            'ja': '機工城アレキサンダー：起動編3',
            'ko': '기공성 알렉산더: 기동편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    445: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 启动之章4',
            'de': 'Alexander - Last des Vaters',
            'en': 'Alexander - The Burden of the Father',
            'fr': 'Alexander - Le Fardeau du Père',
            'ja': '機工城アレキサンダー：起動編4',
            'ko': '기공성 알렉산더: 기동편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    446: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '罗波那歼殛战',
            'de': 'Zenit der Götter - Ravana',
            'en': 'Thok ast Thok (Extreme)',
            'fr': 'Thok ast Thok (extrême)',
            'ja': '極ラーヴァナ討滅戦',
            'ko': '극 라바나 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 57,
    },
    447: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '俾斯麦歼殛战',
            'de': 'Zenit der Götter - Bismarck',
            'en': 'The Limitless Blue (Extreme)',
            'fr': 'L\'Immensité bleue (extrême)',
            'ja': '極ビスマルク討滅戦',
            'ko': '극 비스마르크 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 28,
    },
    448: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '圆桌骑士幻想歼灭战',
            'de': 'Heldenlied von Thordans Fall',
            'en': 'The Minstrel\'s Ballad: Thordan\'s Reign',
            'fr': 'Le règne de Thordan',
            'ja': '蒼天幻想 ナイツ・オブ・ラウンド討滅戦',
            'ko': '극 나이츠 오브 라운드 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 56,
    },
    449: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 启动之章1',
            'de': 'Alexander - Faust des Vaters (episch)',
            'en': 'Alexander - The Fist of the Father (Savage)',
            'fr': 'Alexander - Le Poing du Père (sadique)',
            'ja': '機工城アレキサンダー零式：起動編1',
            'ko': '기공성 알렉산더: 기동편(영웅) 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    450: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 启动之章2',
            'de': 'Alexander - Elle des Vaters (episch)',
            'en': 'Alexander - The Cuff of the Father (Savage)',
            'fr': 'Alexander - Le Poignet du Père (sadique)',
            'ja': '機工城アレキサンダー零式：起動編2',
            'ko': '기공성 알렉산더: 기동편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    451: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 启动之章3',
            'de': 'Alexander - Arm des Vaters (episch)',
            'en': 'Alexander - The Arm of the Father (Savage)',
            'fr': 'Alexander - Le Bras du Père (sadique)',
            'ja': '機工城アレキサンダー零式：起動編3',
            'ko': '기공성 알렉산더: 기동편(영웅) 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    452: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 启动之章4',
            'de': 'Alexander - Last des Vaters (episch)',
            'en': 'Alexander - The Burden of the Father (Savage)',
            'fr': 'Alexander - Le Fardeau du Père (sadique)',
            'ja': '機工城アレキサンダー零式：起動編4',
            'ko': '기공성 알렉산더: 기동편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    478: {
        'exVersion': 1,
        'name': {
            'cn': '田园郡',
            'de': 'Frohehalde',
            'en': 'Idyllshire',
            'fr': 'Idyllée',
            'ja': 'イディルシャイア',
            'ko': '이딜샤이어',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 55,
    },
    506: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '萌宠之王：大赛对战（人机对战）',
            'de': 'Kampf der Trabanten: Turnier (gegen Arenameister)',
            'en': 'LoVM: Master Tournament',
            'fr': 'Bataille de tournoi contre l\'ordinateur',
            'ja': 'LoVM：大会対戦 (CPU対戦)',
            'ko': '꼬마 친구 공방전: 대회 대결(인공 지능 대결)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    508: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '魔航船虚无方舟',
            'de': 'Die Nichts-Arche',
            'en': 'The Void Ark',
            'fr': 'L\'Arche du néant',
            'ja': '魔航船ヴォイドアーク',
            'ko': '보이드의 방주',
        },
        'offsetX': 289,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 37,
    },
    509: {
        'contentType': 4,
        'exVersion': 0,
        'name': {
            'cn': '活动挑战1',
            'de': 'Event-Inhalt 3',
            'en': 'Special Event III',
            'fr': 'Défi spécial III',
            'ja': 'イベント用コンテンツ：3',
            'ko': '이벤트용 임무: 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    510: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '地脉灵灯天狼星灯塔',
            'de': 'Pharos Sirius (schwer)',
            'en': 'Pharos Sirius (Hard)',
            'fr': 'Le Phare de Sirius (brutal)',
            'ja': '制圧巨塔 シリウス大灯台 (Hard)',
            'ko': '시리우스 대등대(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    511: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '草木庭园圣茉夏娜植物园',
            'de': 'Sankt Mocianne-Arboretum',
            'en': 'Saint Mocianne\'s Arboretum',
            'fr': 'L\'Arboretum Sainte-Mocianne',
            'ja': '草木庭園 聖モシャーヌ植物園',
            'ko': '성 모샨 식물원',
        },
        'offsetX': 40,
        'offsetY': 6,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    512: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛白昼探索',
            'de': 'Das Diadem (leicht)',
            'en': 'The Diadem (Easy)',
            'fr': 'Le Diadème (facile)',
            'ja': '雲海探索 ディアデム諸島 (Easy)',
            'ko': '디아뎀 제도(쉬움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 60,
    },
    515: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛夜晚探索',
            'de': 'Das Diadem (schwer)',
            'en': 'The Diadem (Hard)',
            'fr': 'Le Diadème (brutal)',
            'ja': '雲海探索 ディアデム諸島 (Hard)',
            'ko': '디아뎀 제도(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 62,
    },
    516: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '星海空间颠倒塔',
            'de': 'Antiturm',
            'en': 'The Antitower',
            'fr': 'L\'Antitour',
            'ja': '星海観測 逆さの塔 ',
            'ko': '거꾸로 선 탑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    517: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '萨菲洛特歼灭战',
            'de': 'Götterdämmerung - Sephirot',
            'en': 'Containment Bay S1T7',
            'fr': 'Unité de contention S1P7',
            'ja': '魔神セフィロト討滅戦',
            'ko': '마신 세피로트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 66,
    },
    519: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '神圣遗迹无限城市街古迹',
            'de': 'Historisches Amdapor (schwer)',
            'en': 'The Lost City of Amdapor (Hard)',
            'fr': 'Les Vestiges de la cité d\'Amdapor (brutal)',
            'ja': '神聖遺跡 古アムダプール市街 (Hard)',
            'ko': '옛 암다포르 시가지(어려움)',
        },
        'offsetX': 64,
        'offsetY': 315,
        'sizeFactor': 200,
        'weatherRate': 63,
    },
    520: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 律动之章1',
            'de': 'Alexander - Faust des Sohnes',
            'en': 'Alexander - The Fist of the Son',
            'fr': 'Alexander - Le Poing du Fils',
            'ja': '機工城アレキサンダー：律動編1',
            'ko': '기공성 알렉산더: 율동편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    521: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 律动之章2',
            'de': 'Alexander - Elle des Sohnes',
            'en': 'Alexander - The Cuff of the Son',
            'fr': 'Alexander - Le Poignet du Fils',
            'ja': '機工城アレキサンダー：律動編2',
            'ko': '기공성 알렉산더: 율동편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    522: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 律动之章3',
            'de': 'Alexander - Arm des Sohnes',
            'en': 'Alexander - The Arm of the Son',
            'fr': 'Alexander - Le Bras du Fils',
            'ja': '機工城アレキサンダー：律動編3',
            'ko': '기공성 알렉산더: 율동편 3',
        },
        'offsetX': -110,
        'offsetY': -170,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    523: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 律动之章4',
            'de': 'Alexander - Last des Sohnes',
            'en': 'Alexander - The Burden of the Son',
            'fr': 'Alexander - Le Fardeau du Fils',
            'ja': '機工城アレキサンダー：律動編4',
            'ko': '기공성 알렉산더: 율동편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    524: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '萨菲洛特歼殛战',
            'de': 'Zenit der Götter - Sephirot',
            'en': 'Containment Bay S1T7 (Extreme)',
            'fr': 'Unité de contention S1P7 (extrême)',
            'ja': '極魔神セフィロト討滅戦',
            'ko': '극 마신 세피로트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 66,
    },
    525: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (4对4 / 练习赛)',
            'de': 'The Feast (4 gegen 4, Übungskampf)',
            'en': 'The Feast (4 on 4 - Training)',
            'fr': 'The Feast (4x4/en<SoftHyphen/>traî<SoftHyphen/>ne<SoftHyphen/>ment)',
            'ja': 'ザ・フィースト (4対4 / カジュアルマッチ)',
            'ko': '더 피스트 (4 대 4 / 일반전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 65,
    },
    527: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (4对4 / 段位赛)',
            'de': 'The Feast (4 gegen 4, gewertet)',
            'en': 'The Feast (4 on 4 - Ranked)',
            'fr': 'The Feast (4x4/classé)',
            'ja': 'ザ・フィースト (4対4 / ランクマッチ)',
            'ko': '더 피스트 (4 대 4 / 등급전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 65,
    },
    529: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 律动之章1',
            'de': 'Alexander - Faust des Sohnes (episch)',
            'en': 'Alexander - The Fist of the Son (Savage)',
            'fr': 'Alexander - Le Poing du Fils (sadique)',
            'ja': '機工城アレキサンダー零式：律動編1',
            'ko': '기공성 알렉산더: 율동편(영웅) 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    530: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 律动之章2',
            'de': 'Alexander - Elle des Sohnes (episch)',
            'en': 'Alexander - The Cuff of the Son (Savage)',
            'fr': 'Alexander - Le Poignet du Fils (sadique)',
            'ja': '機工城アレキサンダー零式：律動編2',
            'ko': '기공성 알렉산더: 율동편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    531: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 律动之章3',
            'de': 'Alexander - Arm des Sohnes (episch)',
            'en': 'Alexander - The Arm of the Son (Savage)',
            'fr': 'Alexander - Le Bras du Fils (sadique)',
            'ja': '機工城アレキサンダー零式：律動編3',
            'ko': '기공성 알렉산더: 율동편(영웅) 3',
        },
        'offsetX': -110,
        'offsetY': -170,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    532: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 律动之章4',
            'de': 'Alexander - Last des Sohnes (episch)',
            'en': 'Alexander - The Burden of the Son (Savage)',
            'fr': 'Alexander - Le Fardeau du Fils (sadique)',
            'ja': '機工城アレキサンダー零式：律動編4',
            'ko': '기공성 알렉산더: 율동편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    533: {
        'contentType': 7,
        'exVersion': 1,
        'name': {
            'cn': '四国联合军演',
            'de': 'Truppenübung der Eorzäischen Allianz',
            'en': 'A Spectacle for the Ages',
            'fr': 'La grande manœuvre éorzéenne',
            'ja': '四国合同演習',
            'ko': '4개국 합동 훈련',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    537: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '躲避范围攻击',
            'de': 'Flächenangriffen ausweichen',
            'en': 'Avoid Area of Effect Attacks',
            'fr': 'Éviter les attaques à aire d\'effet',
            'ja': '範囲攻撃を避けよう！',
            'ko': '범위 공격을 피하자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    538: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '掌握仇恨连击',
            'de': 'Mit Kombos Feindseligkeit auf sich ziehen',
            'en': 'Execute a Combo to Increase Enmity',
            'fr': 'Générer de l\'inimitié avec un combo',
            'ja': 'コンボで敵視を集めよう！',
            'ko': '콤보를 이어 적개심을 끌자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    539: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '控制敌人的仇恨',
            'de': 'Kombos im Kampf einsetzen',
            'en': 'Execute a Combo in Battle',
            'fr': 'Effectuer le combo en combat',
            'ja': '実戦でコンボに挑戦しよう！',
            'ko': '실전에서 콤보를 사용해보자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    540: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '控制多个敌人的仇恨',
            'de': 'Feindseligkeit mehrerer Gegner auf sich ziehen',
            'en': 'Accrue Enmity from Multiple Targets',
            'fr': 'Attirer l\'inimitié de plusieurs ennemis sur soi',
            'ja': '複数の敵から敵視を集めよう！',
            'ko': '다수의 적에게서 적개심을 끌자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    541: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '实战控制多个敌人的仇恨',
            'de': 'Gegen mehrere Gegner auf einmal kämpfen',
            'en': 'Engage Multiple Targets',
            'fr': 'Affronter plusieurs ennemis',
            'ja': '実戦で複数の敵と戦ってみよう！',
            'ko': '실전에서 다수의 적과 싸워보자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    542: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '控制远处敌人的仇恨',
            'de': 'Aus der Ferne Feindseligkeit auf sich ziehen',
            'en': 'Execute a Ranged Attack to Increase Enmity',
            'fr': 'Générer de l\'inimitié à distance',
            'ja': '遠距離から敵視を集めよう！',
            'ko': '멀리서 적개심을 끌자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    543: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '留心增援的敌人',
            'de': 'Feindliche Verstärkung aufhalten',
            'en': 'Engage Enemy Reinforcements',
            'fr': 'Faire face à des renforts ennemis',
            'ja': '敵の増援に対応しよう！',
            'ko': '적 지원군에 대처하자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    544: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '配合防护职业打倒单个敌人',
            'de': 'Gegner gemeinsam besiegen',
            'en': 'Assist Allies in Defeating a Target',
            'fr': 'Vaincre un ennemi en assistant des alliés',
            'ja': '味方と協力して敵を倒そう！',
            'ko': '파티원과 협력하여 적을 물리치자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    545: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '配合防护职业打倒多个敌人',
            'de': 'Den Gegner eines Verbündeten besiegen',
            'en': 'Defeat an Occupied Target',
            'fr': 'Vaincre un ennemi occupé par un allié',
            'ja': '味方が引きつけている敵を倒そう！',
            'ko': '파티원과 같은 적을 공격하자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    546: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '躲避范围攻击的同时进行战斗',
            'de': 'Angriffen ausweichen',
            'en': 'Avoid Engaged Targets',
            'fr': 'Combattre en évitant les attaques ennemies',
            'ja': '敵の攻撃を避けながら戦おう！',
            'ko': '적의 공격을 피하면서 싸우자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    548: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '灵活运用场地机关',
            'de': 'Mit dem Gelände interagieren',
            'en': 'Interact with the Battlefield',
            'fr': 'Interagir avec le décor en combat',
            'ja': 'ギミックを活用して戦おう！',
            'ko': '특수 장치를 활용하며 싸우자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    549: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '治疗防护职业',
            'de': 'Verbündete heilen',
            'en': 'Heal an Ally',
            'fr': 'Soigner un allié',
            'ja': '味方を回復しよう！',
            'ko': '파티원을 회복시키자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    550: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '治疗小队队员',
            'de': 'Mehrere Verbündete heilen',
            'en': 'Heal Multiple Allies',
            'fr': 'Soigner plusieurs alliés',
            'ja': '複数の味方を回復しよう！',
            'ko': '다수의 파티원을 회복시키자!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    552: {
        'contentType': 20,
        'exVersion': 0,
        'name': {
            'cn': '最终训练',
            'de': 'Letzte Übung',
            'en': 'Final Exercise',
            'fr': 'Exercice final',
            'ja': '最終訓練！',
            'ko': '마지막 훈련!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    554: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '荣誉野 (碎冰战)',
            'de': 'Feld der Ehre (Zersplitterung)',
            'en': 'The Fields of Glory (Shatter)',
            'fr': 'Les Champs de la Gloire (brise-glace)',
            'ja': 'フィールド・オブ・グローリー (砕氷戦)',
            'ko': '영광의 평원(쇄빙전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 67,
    },
    555: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '天龙宫殿忆罪宫',
            'de': 'Sohr Khai',
            'en': 'Sohr Khai',
            'fr': 'Sohr Khai',
            'ja': '天竜宮殿 ソール・カイ',
            'ko': '소르 카이',
        },
        'offsetX': 370,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    556: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '禁忌城邦玛哈',
            'de': 'Die Stadt der Tränen',
            'en': 'The Weeping City of Mhach',
            'fr': 'La Cité défendue de Mhach',
            'ja': '禁忌都市マハ',
            'ko': '금기도시 마하',
        },
        'offsetX': -40,
        'offsetY': -40,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    557: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '黑涡传说破舰岛',
            'de': 'Schiffbrecher-Insel (schwer)',
            'en': 'Hullbreaker Isle (Hard)',
            'fr': 'L\'Île de Crèvecarène (brutal)',
            'ja': '黒渦伝説 ハルブレーカー・アイル (Hard)',
            'ko': '난파선의 섬(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 68,
    },
    558: {
        'contentType': 9,
        'exVersion': 0,
        'name': {
            'cn': '水城宝物库',
            'de': 'Aquapolis',
            'en': 'The Aquapolis',
            'fr': 'L\'Aquapole',
            'ja': '宝物庫 アクアポリス',
            'ko': '보물고 아쿠아폴리스',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    559: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '尼德霍格征龙战',
            'de': 'Der letzte Schicksalsweg',
            'en': 'The Final Steps of Faith',
            'fr': 'La Dernière avancée de la Foi',
            'ja': 'ニーズヘッグ征竜戦',
            'ko': '니드호그 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 28,
    },
    560: {
        'contentType': 7,
        'exVersion': 1,
        'name': {
            'cn': '雷古拉·范·休著斯追击战',
            'de': 'Blutiges Wieder<SoftHyphen/>sehen',
            'en': 'A Bloody Reunion',
            'fr': 'Course-poursuite dans le laboratoire',
            'ja': 'レグラ・ヴァン・ヒュドルス追撃戦',
            'ko': '레굴라 반 히드루스 추격전',
        },
        'offsetX': -18,
        'offsetY': 149,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    561: {
        'contentType': 21,
        'exVersion': 0,
        'name': {
            'cn': '死者宫殿 地下1～10层',
            'de': 'Palast der Toten (Ebenen 1-10)',
            'en': 'The Palace of the Dead (Floors 1-10)',
            'fr': 'Le Palais des morts (sous-sols 1-10)',
            'ja': '死者の宮殿 B1～B10',
            'ko': '망자의 궁전 B1~B10',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    562: {
        'contentType': 21,
        'exVersion': 0,
        'name': {
            'cn': '死者宫殿 地下11～20层',
            'de': 'Palast der Toten (Ebenen 11-20)',
            'en': 'The Palace of the Dead (Floors 11-20)',
            'fr': 'Le Palais des morts (sous-sols 11-20)',
            'ja': '死者の宮殿 B11～B20',
            'ko': '망자의 궁전 B11~B20',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    563: {
        'contentType': 21,
        'exVersion': 0,
        'name': {
            'cn': '死者宫殿 地下21～30层',
            'de': 'Palast der Toten (Ebenen 21-30)',
            'en': 'The Palace of the Dead (Floors 21-30)',
            'fr': 'Le Palais des morts (sous-sols 21-30)',
            'ja': '死者の宮殿 B21～B30',
            'ko': '망자의 궁전 B21~B30',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    564: {
        'contentType': 21,
        'exVersion': 0,
        'name': {
            'cn': '死者宫殿 地下31～40层',
            'de': 'Palast der Toten (Ebenen 31-40)',
            'en': 'The Palace of the Dead (Floors 31-40)',
            'fr': 'Le Palais des morts (sous-sols 31-40)',
            'ja': '死者の宮殿 B31～B40',
            'ko': '망자의 궁전 B31~B40',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    565: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下41～50层',
            'de': 'Palast der Toten (Ebenen 41-50)',
            'en': 'The Palace of the Dead (Floors 41-50)',
            'fr': 'Le Palais des morts (sous-sols 41-50)',
            'ja': '死者の宮殿 B41～B50',
            'ko': '망자의 궁전 B41~B50',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    566: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '尼德霍格传奇征龙战',
            'de': 'Das Lied von Nidhoggs letztem Ruf',
            'en': 'The Minstrel\'s Ballad: Nidhogg\'s Rage',
            'fr': 'L\'ire de Nidhogg',
            'ja': '極ニーズヘッグ征竜戦',
            'ko': '극 니드호그 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 28,
    },
    571: {
        'contentType': 22,
        'exVersion': 0,
        'name': {
            'cn': '亡灵府邸闹鬼庄园',
            'de': 'Das Geisterschloss',
            'en': 'The Haunted Manor',
            'fr': 'Le Manoir hanté',
            'ja': '亡霊屋敷 ホーンテッドマナー',
            'ko': '유령의 집',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    572: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '险峻峡谷塞尔法特尔溪谷',
            'de': 'Xelphatol',
            'en': 'Xelphatol',
            'fr': 'Xelphatol',
            'ja': '峻厳渓谷 ゼルファトル',
            'ko': '젤파톨',
        },
        'offsetX': -148,
        'offsetY': 35,
        'sizeFactor': 200,
        'weatherRate': 40,
    },
    576: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '索菲娅歼灭战',
            'de': 'Götterdämmerung - Sophia',
            'en': 'Containment Bay P1T6',
            'fr': 'Unité de contention P1P6',
            'ja': '女神ソフィア討滅戦',
            'ko': '여신 소피아 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 69,
    },
    577: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '索菲娅歼殛战',
            'de': 'Zenit der Götter - Sophia',
            'en': 'Containment Bay P1T6 (Extreme)',
            'fr': 'Unité de contention P1P6 (extrême)',
            'ja': '極女神ソフィア討滅戦',
            'ko': '극 여신 소피아 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 69,
    },
    578: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '秘本宝库迦巴勒幻想图书馆',
            'de': 'Große Gubal-Bibliothek (schwer)',
            'en': 'The Great Gubal Library (Hard)',
            'fr': 'La Grande bibliothèque de Gubal (brutal)',
            'ja': '稀書回収 グブラ幻想図書館 (Hard)',
            'ko': '구브라 환상도서관(어려움)',
        },
        'offsetX': 116,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    579: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '九宫幻卡：幻卡对局室',
            'de': 'Triple Triad: Weltensalon',
            'en': 'The Triple Triad Battlehall',
            'fr': 'Arène Triple Triade',
            'ja': 'トリプルトライアド：カードバトルルーム',
            'ko': '트리플 트라이어드: 카드 대결장',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 800,
        'weatherRate': 0,
    },
    580: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 天动之章1',
            'de': 'Alexander - Augen des Schöpfers',
            'en': 'Alexander - The Eyes of the Creator',
            'fr': 'Alexander - Les Yeux du Créateur',
            'ja': '機工城アレキサンダー：天動編1',
            'ko': '기공성 알렉산더: 천동편 1',
        },
        'offsetX': 75,
        'offsetY': 14,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    581: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 天动之章2',
            'de': 'Alexander - Atem des Schöpfers',
            'en': 'Alexander - The Breath of the Creator',
            'fr': 'Alexander - Le Souffle du Créateur',
            'ja': '機工城アレキサンダー：天動編2',
            'ko': '기공성 알렉산더: 천동편 2',
        },
        'offsetX': 0,
        'offsetY': -80,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    582: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 天动之章3',
            'de': 'Alexander - Herz des Schöpfers',
            'en': 'Alexander - The Heart of the Creator',
            'fr': 'Alexander - Le Cœur du Créateur',
            'ja': '機工城アレキサンダー：天動編3',
            'ko': '기공성 알렉산더: 천동편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    583: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大机神城 天动之章4',
            'de': 'Alexander - Seele des Schöpfers',
            'en': 'Alexander - The Soul of the Creator',
            'fr': 'Alexander - L\'Âme du Créateur',
            'ja': '機工城アレキサンダー：天動編4',
            'ko': '기공성 알렉산더: 천동편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    584: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 天动之章1',
            'de': 'Alexander - Augen des Schöpfers (episch)',
            'en': 'Alexander - The Eyes of the Creator (Savage)',
            'fr': 'Alexander - Les Yeux du Créateur (sadique)',
            'ja': '機工城アレキサンダー零式：天動編1',
            'ko': '기공성 알렉산더: 천동편(영웅) 1',
        },
        'offsetX': 75,
        'offsetY': 14,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    585: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 天动之章2',
            'de': 'Alexander - Atem des Schöpfers (episch)',
            'en': 'Alexander - The Breath of the Creator (Savage)',
            'fr': 'Alexander - Le Souffle du Créateur (sadique)',
            'ja': '機工城アレキサンダー零式：天動編2',
            'ko': '기공성 알렉산더: 천동편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': -80,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    586: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 天动之章3',
            'de': 'Alexander - Herz des Schöpfers (episch)',
            'en': 'Alexander - The Heart of the Creator (Savage)',
            'fr': 'Alexander - Le Cœur du Créateur (sadique)',
            'ja': '機工城アレキサンダー零式：天動編3',
            'ko': '기공성 알렉산더: 천동편(영웅) 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    587: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '亚历山大零式机神城 天动之章4',
            'de': 'Alexander - Seele des Schöpfers (episch)',
            'en': 'Alexander - The Soul of the Creator (Savage)',
            'fr': 'Alexander - L\'Âme du Créateur (sadique)',
            'ja': '機工城アレキサンダー零式：天動編4',
            'ko': '기공성 알렉산더: 천동편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    589: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '萌宠之王：玩家对战（绩点赛）',
            'de': 'Kampf der Trabanten: Gegen Spieler (um RP)',
            'en': 'LoVM: Player Battle (RP)',
            'fr': 'Bataille simple contre un joueur (avec PR)',
            'ja': 'LoVM：プレイヤー対戦 (RP変動あり)',
            'ko': '꼬마 친구 공방전: 플레이어 대결(RP 변동 있음)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    590: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '萌宠之王：大赛对战（玩家对战）',
            'de': 'Kampf der Trabanten: Turnier (gegen Spieler)',
            'en': 'LoVM: Tournament',
            'fr': 'Bataille de tournoi contre des joueurs',
            'ja': 'LoVM：大会対戦 (プレイヤー対戦）',
            'ko': '꼬마 친구 공방전: 대회 대결(플레이어 대결)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    591: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '萌宠之王：玩家对战（无绩点赛）',
            'de': 'Kampf der Trabanten: Gegen Spieler (ohne RP)',
            'en': 'LoVM: Player Battle (Non-RP)',
            'fr': 'Bataille simple contre un joueur (sans PR)',
            'ja': 'LoVM：プレイヤー対戦 (RP変動なし)',
            'ko': '꼬마 친구 공방전: 플레이어 대결(RP 변동 없음)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    592: {
        'contentType': 7,
        'exVersion': 1,
        'name': {
            'cn': '纠缠不清的宿命',
            'de': 'Weltenübergreifendes Schicksal',
            'en': 'One Life for One World',
            'fr': 'Destins entrecroisés',
            'ja': '絡み合う宿命',
            'ko': '뒤얽히는 숙명',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 28,
    },
    593: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下51～60层',
            'de': 'Palast der Toten (Ebenen 51 - 60)',
            'en': 'The Palace of the Dead (Floors 51-60)',
            'fr': 'Le Palais des morts (sous-sols 51-60)',
            'ja': '死者の宮殿 B51～B60',
            'ko': '망자의 궁전 B51~B60',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    594: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下61～70层',
            'de': 'Palast der Toten (Ebenen 61 - 70)',
            'en': 'The Palace of the Dead (Floors 61-70)',
            'fr': 'Le Palais des morts (sous-sols 61-70)',
            'ja': '死者の宮殿 B61～B70',
            'ko': '망자의 궁전 B61~B70',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    595: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下71～80层',
            'de': 'Palast der Toten (Ebenen 71 - 80)',
            'en': 'The Palace of the Dead (Floors 71-80)',
            'fr': 'Le Palais des morts (sous-sols 71-80)',
            'ja': '死者の宮殿 B71～B80',
            'ko': '망자의 궁전 B71~B80',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    596: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下81～90层',
            'de': 'Palast der Toten (Ebenen 81 - 90)',
            'en': 'The Palace of the Dead (Floors 81-90)',
            'fr': 'Le Palais des morts (sous-sols 81-90)',
            'ja': '死者の宮殿 B81～B90',
            'ko': '망자의 궁전 B81~B90',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    597: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下91～100层',
            'de': 'Palast der Toten (Ebenen 91 - 100)',
            'en': 'The Palace of the Dead (Floors 91-100)',
            'fr': 'Le Palais des morts (sous-sols 91-100)',
            'ja': '死者の宮殿 B91～B100',
            'ko': '망자의 궁전 B91~B100',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    598: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下101～110层',
            'de': 'Palast der Toten (Ebenen 101 - 110)',
            'en': 'The Palace of the Dead (Floors 101-110)',
            'fr': 'Le Palais des morts (sous-sols 101-110)',
            'ja': '死者の宮殿 B101～B110',
            'ko': '망자의 궁전 B101~B110',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    599: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下111～120层',
            'de': 'Palast der Toten (Ebenen 111 - 120)',
            'en': 'The Palace of the Dead (Floors 111-120)',
            'fr': 'Le Palais des morts (sous-sols 111-120)',
            'ja': '死者の宮殿 B111～B120',
            'ko': '망자의 궁전 B111~B120',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    600: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下121～130层',
            'de': 'Palast der Toten (Ebenen 121 - 130)',
            'en': 'The Palace of the Dead (Floors 121-130)',
            'fr': 'Le Palais des morts (sous-sols 121-130)',
            'ja': '死者の宮殿 B121～B130',
            'ko': '망자의 궁전 B121~B130',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    601: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下131～140层',
            'de': 'Palast der Toten (Ebenen 131 - 140)',
            'en': 'The Palace of the Dead (Floors 131-140)',
            'fr': 'Le Palais des morts (sous-sols 131-140)',
            'ja': '死者の宮殿 B131～B140',
            'ko': '망자의 궁전 B131~B140',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    602: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下141～150层',
            'de': 'Palast der Toten (Ebenen 141 - 150)',
            'en': 'The Palace of the Dead (Floors 141-150)',
            'fr': 'Le Palais des morts (sous-sols 141-150)',
            'ja': '死者の宮殿 B141～B150',
            'ko': '망자의 궁전 B141~B150',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    603: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下151～160层',
            'de': 'Palast der Toten (Ebenen 151 - 160)',
            'en': 'The Palace of the Dead (Floors 151-160)',
            'fr': 'Le Palais des morts (sous-sols 151-160)',
            'ja': '死者の宮殿 B151～B160',
            'ko': '망자의 궁전 B151~B160',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    604: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下161～170层',
            'de': 'Palast der Toten (Ebenen 161 - 170)',
            'en': 'The Palace of the Dead (Floors 161-170)',
            'fr': 'Le Palais des morts (sous-sols 161-170)',
            'ja': '死者の宮殿 B161～B170',
            'ko': '망자의 궁전 B161~B170',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    605: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下171～180层',
            'de': 'Palast der Toten (Ebenen 171 - 180)',
            'en': 'The Palace of the Dead (Floors 171-180)',
            'fr': 'Le Palais des morts (sous-sols 171-180)',
            'ja': '死者の宮殿 B171～B180',
            'ko': '망자의 궁전 B171~B180',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    606: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下181～190层',
            'de': 'Palast der Toten (Ebenen 181 - 190)',
            'en': 'The Palace of the Dead (Floors 181-190)',
            'fr': 'Le Palais des morts (sous-sols 181-190)',
            'ja': '死者の宮殿 B181～B190',
            'ko': '망자의 궁전 B181~B190',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    607: {
        'contentType': 21,
        'exVersion': 1,
        'name': {
            'cn': '死者宫殿 地下191～200层',
            'de': 'Palast der Toten (Ebenen 191 - 200)',
            'en': 'The Palace of the Dead (Floors 191-200)',
            'fr': 'Le Palais des morts (sous-sols 191-200)',
            'ja': '死者の宮殿 B191～B200',
            'ko': '망자의 궁전 B191~B200',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    612: {
        'exVersion': 2,
        'name': {
            'cn': '基拉巴尼亚边区',
            'de': 'Abanisches Grenzland',
            'en': 'The Fringes',
            'fr': 'Les Marges',
            'ja': 'ギラバニア辺境地帯',
            'ko': '기라바니아 변방지대',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 79,
    },
    613: {
        'exVersion': 2,
        'name': {
            'cn': '红玉海',
            'de': 'Rubinsee',
            'en': 'The Ruby Sea',
            'fr': 'Mer de Rubis',
            'ja': '紅玉海',
            'ko': '홍옥해',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 83,
    },
    614: {
        'exVersion': 2,
        'name': {
            'cn': '延夏',
            'de': 'Yanxia',
            'en': 'Yanxia',
            'fr': 'Yanxia',
            'ja': 'ヤンサ',
            'ko': '얀샤',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 84,
    },
    615: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '坚牢铁壁巴埃萨长城',
            'de': 'Baelsar-Wall',
            'en': 'Baelsar\'s Wall',
            'fr': 'La Muraille de Baelsar',
            'ja': '巨大防壁 バエサルの長城',
            'ko': '바일사르 장성',
        },
        'offsetX': 182,
        'offsetY': 32,
        'sizeFactor': 200,
        'weatherRate': 40,
    },
    616: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '海底宫殿紫水宫',
            'de': 'Shisui',
            'en': 'Shisui of the Violet Tides',
            'fr': 'Le Palais aux Marées violettes',
            'ja': '海底宮殿 紫水宮',
            'ko': '시스이 궁',
        },
        'offsetX': 0,
        'offsetY': 35,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    617: {
        'contentType': 2,
        'exVersion': 1,
        'name': {
            'cn': '天山深境索姆阿尔灵峰',
            'de': 'Sohm Al (schwer)',
            'en': 'Sohm Al (Hard)',
            'fr': 'Sohm Al (brutal)',
            'ja': '霊峰浄化 ソーム・アル (Hard)',
            'ko': '솜 알(어려움)',
        },
        'offsetX': 128,
        'offsetY': -32,
        'sizeFactor': 200,
        'weatherRate': 28,
    },
    619: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (狼狱演习场：自定赛)',
            'de': 'The Feast (Wolfshöhle: Schaukampf)',
            'en': 'The Feast (Custom Match - Feasting Grounds)',
            'fr': 'The Feast (personnalisé/Festin des loups)',
            'ja': 'ザ・フィースト (ウルヴズジェイル演習場：カスタムマッチ）',
            'ko': '더 피스트 (늑대우리 훈련장: 친선 경기)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 65,
    },
    620: {
        'exVersion': 2,
        'name': {
            'cn': '基拉巴尼亚山区',
            'de': 'Die Zinnen',
            'en': 'The Peaks',
            'fr': 'Les Pics',
            'ja': 'ギラバニア山岳地帯',
            'ko': '기라바니아 산악지대',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 80,
    },
    621: {
        'exVersion': 2,
        'name': {
            'cn': '基拉巴尼亚湖区',
            'de': 'Das Fenn',
            'en': 'The Lochs',
            'fr': 'Les Lacs',
            'ja': 'ギラバニア湖畔地帯',
            'ko': '기라바니아 호반지대',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 81,
    },
    622: {
        'exVersion': 2,
        'name': {
            'cn': '太阳神草原',
            'de': 'Azim-Steppe',
            'en': 'The Azim Steppe',
            'fr': 'Steppe d\'Azim',
            'ja': 'アジムステップ',
            'ko': '아짐 대초원',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 85,
    },
    623: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '试炼行路巴儿达木霸道',
            'de': 'Bardams Probe',
            'en': 'Bardam\'s Mettle',
            'fr': 'La Force de Bardam',
            'ja': '伝統試練 バルダム覇道',
            'ko': '바르담 패도',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    624: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛白昼探索（狩猎专用）',
            'de': 'Das Diadem - Jagdgründe (leicht)',
            'en': 'The Diadem Hunting Grounds (Easy)',
            'fr': 'Le Diadème<Indent/>: terrains de chasse (facile)',
            'ja': '雲海探索 ディアデム諸島：狩猟限定 (Easy)',
            'ko': '디아뎀 제도: 전투 한정(쉬움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 60,
    },
    625: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛黄昏探索（狩猎专用）',
            'de': 'Das Diadem - Jagdgründe',
            'en': 'The Diadem Hunting Grounds',
            'fr': 'Le Diadème<Indent/>: terrains de chasse',
            'ja': '雲海探索 ディアデム諸島：狩猟限定',
            'ko': '디아뎀 제도: 전투 한정',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 61,
    },
    626: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '漂流海域妖歌海',
            'de': 'Sirenen-See',
            'en': 'The Sirensong Sea',
            'fr': 'La Mer du Chant des sirènes',
            'ja': '漂流海域 セイレーン海',
            'ko': '세이렌 해',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 36,
    },
    627: {
        'contentType': 5,
        'exVersion': 1,
        'name': {
            'cn': '影之国',
            'de': 'Dun Scaith',
            'en': 'Dun Scaith',
            'fr': 'Dun Scaith',
            'ja': '影の国ダン・スカー',
            'ko': '둔 스카',
        },
        'offsetX': -350,
        'offsetY': -400,
        'sizeFactor': 200,
        'weatherRate': 58,
    },
    628: {
        'exVersion': 2,
        'name': {
            'cn': '黄金港',
            'de': 'Kugane',
            'en': 'Kugane',
            'fr': 'Kugane',
            'ja': 'クガネ',
            'ko': '쿠가네',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 82,
    },
    630: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛战争神猎场',
            'de': 'Das Diadem - Halones Prüfung',
            'en': 'The Diadem - Trials of the Fury',
            'fr': 'Le Diadème - Épreuves de Halone',
            'ja': '雲海探索 ディアデム諸島 (狩猟)',
            'ko': '디아뎀 제도: 전투',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 71,
    },
    633: {
        'contentType': 7,
        'exVersion': 1,
        'name': {
            'cn': '加尔提诺平原遭遇战',
            'de': 'Heliodrom',
            'en': 'The Carteneau Flats: Heliodrome',
            'fr': 'Rixe à l\'Héliodrome',
            'ja': 'カルテノー平原遭遇戦',
            'ko': '카르테노 평원 조우전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    635: {
        'exVersion': 2,
        'name': {
            'cn': '神拳痕',
            'de': 'Rhalgrs Wacht',
            'en': 'Rhalgr\'s Reach',
            'fr': 'L\'Étendue de Rhalgr',
            'ja': 'ラールガーズリーチ',
            'ko': '랄거의 손길',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 78,
    },
    637: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '祖尔宛歼灭战',
            'de': 'Götterdämmerung - Zurvan',
            'en': 'Containment Bay Z1T9',
            'fr': 'Unité de contention Z1P9',
            'ja': '鬼神ズルワーン討滅戦',
            'ko': '귀신 주르반 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 75,
    },
    638: {
        'contentType': 4,
        'exVersion': 1,
        'name': {
            'cn': '祖尔宛歼殛战',
            'de': 'Zenit der Götter - Zurvan',
            'en': 'Containment Bay Z1T9 (Extreme)',
            'fr': 'Unité de contention Z1P9 (extrême)',
            'ja': '極鬼神ズルワーン討滅戦',
            'ko': '극 귀신 주르반 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 75,
    },
    646: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (地衣宫演习场：自定赛)',
            'de': 'The Feast (Flechtenhain: Schaukampf)',
            'en': 'The Feast (Custom Match - Lichenweed)',
            'fr': 'The Feast (personnalisé/Pré-de-lichen)',
            'ja': 'ザ・フィースト (ライケンウィード演習場：カスタムマッチ）',
            'ko': '더 피스트 (잡초 훈련장: 친선 경기)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 73,
    },
    656: {
        'contentType': 23,
        'exVersion': 1,
        'name': {
            'cn': '云冠群岛丰饶神福地',
            'de': 'Das Diadem - Nophicas Prüfung',
            'en': 'The Diadem - Trials of the Matron',
            'fr': 'Le Diadème - Épreuves de Nophica',
            'ja': '雲海探索 ディアデム諸島 (採集)',
            'ko': '디아뎀 제도: 채집',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 71,
    },
    660: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '解放决战多玛王城',
            'de': 'Burg Doma',
            'en': 'Doma Castle',
            'fr': 'Le Château de Doma',
            'ja': '解放決戦 ドマ城',
            'ko': '도마 성',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    661: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '巨炮要塞帝国白山堡',
            'de': 'Castrum Abania',
            'en': 'Castrum Abania',
            'fr': 'Castrum Abania',
            'ja': '巨砲要塞 カストルム・アバニア',
            'ko': '카스트룸 아바니아',
        },
        'offsetX': 72,
        'offsetY': -186,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    662: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '恶党孤城黄金阁',
            'de': 'Schloss Kugane',
            'en': 'Kugane Castle',
            'fr': 'Le Château de Kugane',
            'ja': '悪党成敗 クガネ城',
            'ko': '쿠가네 성',
        },
        'offsetX': 70,
        'offsetY': 33,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    663: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '修行古刹星导寺',
            'de': 'Tempel der Faust',
            'en': 'The Temple of the Fist',
            'fr': 'Le Temple du Poing',
            'ja': '壊神修行 星導山寺院',
            'ko': '성도산 사원',
        },
        'offsetX': -427,
        'offsetY': -314,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    665: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '鱼道现身！',
            'de': 'Ein zweifelhaftes Angebot',
            'en': 'It\'s Probably a Trap',
            'fr': 'Un drôle de Namazu',
            'ja': 'ギョドウ現る！',
            'ko': '교도 등장!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    674: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '须佐之男歼灭战',
            'de': 'Götterdämmerung - Susano',
            'en': 'The Pool of Tribute',
            'fr': 'La Crique aux tributs',
            'ja': 'スサノオ討滅戦',
            'ko': '스사노오 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 77,
    },
    677: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '须佐之男歼殛战',
            'de': 'Zenit der Götter - Susano',
            'en': 'The Pool of Tribute (Extreme)',
            'fr': 'La Crique aux tributs (extrême)',
            'ja': '極スサノオ討滅戦',
            'ko': '극 스사노오 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 77,
    },
    679: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '神龙歼灭战',
            'de': 'Königliche Menagerie',
            'en': 'The Royal Menagerie',
            'fr': 'La Ménagerie royale',
            'ja': '神龍討滅戦',
            'ko': '신룡 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 76,
    },
    684: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '于里昂热的秘策',
            'de': 'Wege zur Transzendenz',
            'en': 'The Resonant',
            'fr': 'La ruse d\'Urianger',
            'ja': 'ウリエンジェの秘策',
            'ko': '위리앙제의 비책',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    688: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '那达慕',
            'de': 'Naadam',
            'en': 'Naadam',
            'fr': 'La grande bataille du Naadam',
            'ja': '終節の合戦',
            'ko': '계절끝 합전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    689: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '鏖战红莲阿拉米格',
            'de': 'Ala Mhigo',
            'en': 'Ala Mhigo',
            'fr': 'Ala Mhigo',
            'ja': '紅蓮決戦 アラミゴ',
            'ko': '알라미고',
        },
        'offsetX': 292,
        'offsetY': -163,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    690: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '时空狭缝外缘',
            'de': 'Interdimensionaler Riss',
            'en': 'Interdimensional Rift',
            'fr': 'Fissure interdimensionnelle',
            'ja': '次元の狭間：外縁',
            'ko': '차원의 틈: 외곽',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 88,
    },
    691: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 德尔塔幻境1',
            'de': 'Deltametrie 1.0',
            'en': 'Deltascape V1.0',
            'fr': 'Deltastice v1.0',
            'ja': '次元の狭間オメガ：デルタ編1',
            'ko': '차원의 틈 오메가: 델타편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    692: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 德尔塔幻境2',
            'de': 'Deltametrie 2.0',
            'en': 'Deltascape V2.0',
            'fr': 'Deltastice v2.0',
            'ja': '次元の狭間オメガ：デルタ編2',
            'ko': '차원의 틈 오메가: 델타편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    693: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 德尔塔幻境3',
            'de': 'Deltametrie 3.0',
            'en': 'Deltascape V3.0',
            'fr': 'Deltastice v3.0',
            'ja': '次元の狭間オメガ：デルタ編3',
            'ko': '차원의 틈 오메가: 델타편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    694: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 德尔塔幻境4',
            'de': 'Deltametrie 4.0',
            'en': 'Deltascape V4.0',
            'fr': 'Deltastice v4.0',
            'ja': '次元の狭間オメガ：デルタ編4',
            'ko': '차원의 틈 오메가: 델타편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    695: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 德尔塔幻境1',
            'de': 'Deltametrie 1.0 (episch)',
            'en': 'Deltascape V1.0 (Savage)',
            'fr': 'Deltastice v1.0 (sadique)',
            'ja': '次元の狭間オメガ零式：デルタ編1',
            'ko': '차원의 틈 오메가: 델타편(영웅) 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    696: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 德尔塔幻境2',
            'de': 'Deltametrie 2.0 (episch)',
            'en': 'Deltascape V2.0 (Savage)',
            'fr': 'Deltastice v2.0 (sadique)',
            'ja': '次元の狭間オメガ零式：デルタ編2',
            'ko': '차원의 틈 오메가: 델타편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    697: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 德尔塔幻境3',
            'de': 'Deltametrie 3.0 (episch)',
            'en': 'Deltascape V3.0 (Savage)',
            'fr': 'Deltastice v3.0 (sadique)',
            'ja': '次元の狭間オメガ零式：デルタ編3',
            'ko': '차원의 틈 오메가: 델타편(영웅) 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    698: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 德尔塔幻境4',
            'de': 'Deltametrie 4.0 (episch)',
            'en': 'Deltascape V4.0 (Savage)',
            'fr': 'Deltastice v4.0 (sadique)',
            'ja': '次元の狭間オメガ零式：デルタ編4',
            'ko': '차원의 틈 오메가: 델타편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 88,
    },
    705: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '大会开始',
            'de': 'Thal zu Ehren',
            'en': 'In Thal\'s Name',
            'fr': 'Le tournoi commémoratif du sultanat',
            'ja': 'ウル王杯闘技会の始まり',
            'ko': '울다하 왕실배 투기대회',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 8,
    },
    706: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '为了更强',
            'de': 'Die hohe Kunst des Schwertkampfs',
            'en': 'Raising the Sword',
            'fr': 'La finale des champions',
            'ja': 'さらなる剣術の高みへ',
            'ko': '더 높은 검술의 경지로',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 8,
    },
    707: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '抗争之力',
            'de': 'Die Kraft des Widerstands',
            'en': 'With Heart and Steel',
            'fr': 'Transmigration démoniaque',
            'ja': '抗う力',
            'ko': '맞서는 힘',
        },
        'offsetX': 298,
        'offsetY': 350,
        'sizeFactor': 200,
        'weatherRate': 37,
    },
    708: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '海都路人身首异',
            'de': 'Mord ist sein Hobby',
            'en': 'Blood on the Deck',
            'fr': 'La légende de Musosai<Indent/>: l\'assassin de Limsa Lominsa',
            'ja': '海都を震わす人斬りの宴！',
            'ko': '해양도시를 흔드는 살인자의 연회!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    709: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '极恶之人木枯',
            'de': 'Der Inbegriff des Bösen',
            'en': 'The Face of True Evil',
            'fr': 'L\'abominable Kogarashi',
            'ja': '極悪人コガラシ',
            'ko': '극악무도한 코가라시',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 49,
    },
    710: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '松叶门外之变',
            'de': 'Vorfall auf dem Matsuba-Platz',
            'en': 'Matsuba Mayhem',
            'fr': 'Règlement de compte au square Matsuba',
            'ja': '松葉門外の変',
            'ko': '마츠바 사변',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 82,
    },
    711: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '决战龟甲岛',
            'de': 'Ent<SoftHyphen/>schei<SoftHyphen/>dungs<SoftHyphen/>schlacht auf Bekko',
            'en': 'The Battle on Bekko',
            'fr': 'L\'af<SoftHyphen/>fron<SoftHyphen/>te<SoftHyphen/>ment de deux justices',
            'ja': 'ベッコウ島の決闘',
            'ko': '베코우 섬의 결투',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 83,
    },
    712: {
        'contentType': 9,
        'exVersion': 2,
        'name': {
            'cn': '运河宝物库',
            'de': 'Kanäle von Uznair',
            'en': 'The Lost Canals of Uznair',
            'fr': 'Les Canaux perdus d\'Uznair',
            'ja': '宝物庫 ウズネアカナル',
            'ko': '보물고 우즈네어 운하',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    713: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '漆黑的巨龙',
            'de': 'Der tobende Drache',
            'en': 'Dark as the Night Sky',
            'fr': 'Aussi sombre que la nuit',
            'ja': '漆黒の巨竜',
            'ko': '칠흑의 거룡',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 85,
    },
    714: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '红血之龙骑士',
            'de': 'Der Rubin-Drachenreiter',
            'en': 'Dragon Sound',
            'fr': 'Le Dragon écarlate',
            'ja': '紅の竜騎士',
            'ko': '붉은 용기사',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    715: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '遥远的憧憬',
            'de': 'Probe des Meisters',
            'en': 'The Orphans and the Broken Blade',
            'fr': 'L\'aspiration refoulée',
            'ja': 'あと三度、遥かな憧憬',
            'ko': '앞으로 세 번, 아득한 동경',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 95,
        'weatherRate': 86,
    },
    716: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '再次相见',
            'de': 'Aus der Tiefe des Herzens',
            'en': 'Our Compromise',
            'fr': 'La dernière séparation',
            'ja': 'あと一度、君に会えたら',
            'ko': '앞으로 한 번, 너와 만날 수 있다면',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 28,
    },
    717: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '原初的战士',
            'de': 'Die Urkraft in ihr',
            'en': 'Curious Gorge Meets His Match',
            'fr': 'L\'épreuve de force',
            'ja': '原初的な彼女',
            'ko': '원초적 그녀',
        },
        'offsetX': -77,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    718: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '燃烧吧高吉',
            'de': 'Kriegerische Leidenschaft',
            'en': 'The Heart of the Problem',
            'fr': 'Passion guerrière',
            'ja': '燃えよゴージ！',
            'ko': '불타올라라, 산골짜기!',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 85,
    },
    719: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '吉祥天女歼灭战',
            'de': 'Götterdämmerung - Lakshmi',
            'en': 'Emanation',
            'fr': 'Émanation',
            'ja': 'ラクシュミ討滅戦',
            'ko': '락슈미 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 87,
    },
    720: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '吉祥天女歼殛战',
            'de': 'Zenit der Götter - Lakshmi',
            'en': 'Emanation (Extreme)',
            'fr': 'Émanation (extrême)',
            'ja': '極ラクシュミ討滅戦',
            'ko': '극 락슈미 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 87,
    },
    722: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '穿越时空的夙愿',
            'de': 'Ein Wunsch aus alten Zeiten',
            'en': 'Our Unsung Heroes',
            'fr': 'L\'espoir en héritage',
            'ja': '時をかける願い',
            'ko': '시간을 뛰어넘은 염원',
        },
        'offsetX': -175,
        'offsetY': -297,
        'sizeFactor': 200,
        'weatherRate': 63,
    },
    723: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '影隐忍法贴',
            'de': 'Aus dem Verborgenen',
            'en': 'When Clans Collide',
            'fr': 'La bataille des clans',
            'ja': '影隠忍法帖',
            'ko': '그림자 인법첩',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 85,
    },
    725: {
        'contentType': 9,
        'exVersion': 2,
        'name': {
            'cn': '运河宝物库深层',
            'de': 'Vergessene Kanäle von Uznair',
            'en': 'The Hidden Canals of Uznair',
            'fr': 'Les Canaux cachés d\'Uznair',
            'ja': '宝物庫 ウズネアカナル深層',
            'ko': '보물고 우즈네어 운하 심층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    729: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '距骨研究所 (机动战)',
            'de': 'Astragalos',
            'en': 'Astragalos',
            'fr': 'Astragalos (machinerie)',
            'ja': 'アストラガロス (機工戦)',
            'ko': '아스트라갈로스(기공전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    730: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '神龙梦幻歼灭战',
            'de': 'Heldenlied von Shinryu',
            'en': 'The Minstrel\'s Ballad: Shinryu\'s Domain',
            'fr': 'Le domaine de Shinryu',
            'ja': '極神龍討滅戦',
            'ko': '극 신룡 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 76,
    },
    731: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '沉没神殿斯卡拉遗迹',
            'de': 'Die versunkene Stadt Skalla',
            'en': 'The Drowned City of Skalla',
            'fr': 'La Cité engloutie de Skalla',
            'ja': '水没遺構 スカラ',
            'ko': '스칼라 유적',
        },
        'offsetX': 185,
        'offsetY': 5,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    732: {
        'contentType': 26,
        'exVersion': 2,
        'name': {
            'cn': '禁地优雷卡 常风之地',
            'de': 'Eureka Anemos',
            'en': 'The Forbidden Land, Eureka Anemos',
            'fr': 'Eurêka Anemos',
            'ja': '禁断の地 エウレカ：アネモス編',
            'ko': '금단의 땅 에우레카: 아네모스편',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 91,
    },
    733: {
        'contentType': 28,
        'exVersion': 2,
        'name': {
            'cn': '巴哈姆特绝境战',
            'de': 'Endlose Schatten von Bahamut (fatal)',
            'en': 'The Unending Coil of Bahamut (Ultimate)',
            'fr': 'L\'Abîme infini de Bahamut (fatal)',
            'ja': '絶バハムート討滅戦',
            'ko': '절 바하무트 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    734: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '失落之都拉巴纳斯塔',
            'de': 'Rabanastre',
            'en': 'The Royal City of Rabanastre',
            'fr': 'La Cité royale de Rabanastre',
            'ja': '失われた都 ラバナスタ',
            'ko': '왕도 라바나스터',
        },
        'offsetX': 300,
        'offsetY': -100,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    741: {
        'contentType': 22,
        'exVersion': 0,
        'name': {
            'cn': '良缘仪式',
            'de': 'Valentionzeremonie',
            'en': 'The Valentione\'s Ceremony',
            'fr': 'La Cérémonie de la Valention',
            'ja': 'ヴァレンティオンセレモニー',
            'ko': '발렌티온 예식장',
        },
        'offsetX': 0,
        'offsetY': 125,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    742: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '红玉火山狱之盖',
            'de': 'Höllenspund',
            'en': 'Hells\' Lid',
            'fr': 'Le Couvercle des enfers',
            'ja': '紅玉火山 獄之蓋',
            'ko': '지옥뚜껑',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    743: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '疯狂战舰无限回廊',
            'de': 'Die Fraktal-Kontinuum (schwer)',
            'en': 'The Fractal Continuum (Hard)',
            'fr': 'Le Continuum fractal (brutal)',
            'ja': '暴走戦艦 フラクタル・コンティニアム (Hard)',
            'ko': '무한연속 박물함(어려움)',
        },
        'offsetX': 0,
        'offsetY': 350,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    745: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (战队段位赛)',
            'de': 'The Feast (Team, gewertet)',
            'en': 'The Feast (Team Ranked)',
            'fr': 'The Feast (classé/équipe JcJ)',
            'ja': 'ザ・フィースト (チーム用ランクマッチ)',
            'ko': '더 피스트 (팀 등급전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 90,
    },
    746: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '白虎镇魂战',
            'de': 'Seelentanz - Byakko',
            'en': 'The Jade Stoa',
            'fr': 'La Clairière de Jade',
            'ja': '白虎征魂戦',
            'ko': '백호 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 93,
    },
    748: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 西格玛幻境1',
            'de': 'Sigmametrie 1.0',
            'en': 'Sigmascape V1.0',
            'fr': 'Sigmastice v1.0',
            'ja': '次元の狭間オメガ：シグマ編1',
            'ko': '차원의 틈 오메가: 시그마편 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    749: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 西格玛幻境2',
            'de': 'Sigmametrie 2.0',
            'en': 'Sigmascape V2.0',
            'fr': 'Sigmastice v2.0',
            'ja': '次元の狭間オメガ：シグマ編2',
            'ko': '차원의 틈 오메가: 시그마편 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    750: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 西格玛幻境3',
            'de': 'Sigmametrie 3.0',
            'en': 'Sigmascape V3.0',
            'fr': 'Sigmastice v3.0',
            'ja': '次元の狭間オメガ：シグマ編3',
            'ko': '차원의 틈 오메가: 시그마편 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    751: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 西格玛幻境4',
            'de': 'Sigmametrie 4.0',
            'en': 'Sigmascape V4.0',
            'fr': 'Sigmastice v4.0',
            'ja': '次元の狭間オメガ：シグマ編4',
            'ko': '차원의 틈 오메가: 시그마편 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    752: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 西格玛幻境1',
            'de': 'Sigmametrie 1.0 (episch)',
            'en': 'Sigmascape V1.0 (Savage)',
            'fr': 'Sigmastice v1.0 (sadique)',
            'ja': '次元の狭間オメガ零式：シグマ編1',
            'ko': '차원의 틈 오메가: 시그마편(영웅) 1',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    753: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 西格玛幻境2',
            'de': 'Sigmametrie 2.0 (episch)',
            'en': 'Sigmascape V2.0 (Savage)',
            'fr': 'Sigmastice v2.0 (sadique)',
            'ja': '次元の狭間オメガ零式：シグマ編2',
            'ko': '차원의 틈 오메가: 시그마편(영웅) 2',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    754: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 西格玛幻境3',
            'de': 'Sigmametrie 3.0 (episch)',
            'en': 'Sigmascape V3.0 (Savage)',
            'fr': 'Sigmastice v3.0 (sadique)',
            'ja': '次元の狭間オメガ零式：シグマ編3',
            'ko': '차원의 틈 오메가: 시그마편(영웅) 3',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    755: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 西格玛幻境4',
            'de': 'Sigmametrie 4.0 (episch)',
            'en': 'Sigmascape V4.0 (Savage)',
            'fr': 'Sigmastice v4.0 (sadique)',
            'ja': '次元の狭間オメガ零式：シグマ編4',
            'ko': '차원의 틈 오메가: 시그마편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    758: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '白虎诗魂战',
            'de': 'Seelensturm - Byakko',
            'en': 'The Jade Stoa (Extreme)',
            'fr': 'La Clairière de Jade (extrême)',
            'ja': '極白虎征魂戦',
            'ko': '극 백호 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 93,
    },
    759: {
        'exVersion': 2,
        'name': {
            'cn': '多玛飞地',
            'de': 'Domanische Enklave',
            'en': 'The Doman Enclave',
            'fr': 'Quartier enclavé de Doma',
            'ja': 'ドマ町人地',
            'ko': '도마 도읍지',
        },
        'offsetX': 23,
        'offsetY': 34,
        'sizeFactor': 400,
        'weatherRate': 84,
    },
    761: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '火龙狩猎战',
            'de': 'Jagd auf Rathalos',
            'en': 'The Great Hunt',
            'fr': 'Chasse au Rathalos',
            'ja': 'リオレウス狩猟戦',
            'ko': '리오레우스 수렵전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    762: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '火龙上位狩猎战',
            'de': 'Jagd auf Rathalos (schwer)',
            'en': 'The Great Hunt (Extreme)',
            'fr': 'Chasse au Rathalos (extrême)',
            'ja': '極リオレウス狩猟戦',
            'ko': '극 리오레우스 수렵전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    763: {
        'contentType': 26,
        'exVersion': 2,
        'name': {
            'cn': '禁地优雷卡 恒冰之地',
            'de': 'Eureka Pagos',
            'en': 'The Forbidden Land, Eureka Pagos',
            'fr': 'Eurêka Pagos',
            'ja': '禁断の地 エウレカ：パゴス編',
            'ko': '금단의 땅 에우레카: 파고스편',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 94,
    },
    765: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (段位赛)',
            'de': 'The Feast (gewertet)',
            'en': 'The Feast (Ranked)',
            'fr': 'The Feast (classé)',
            'ja': 'ザ・フィースト (ランクマッチ)',
            'ko': '더 피스트 (등급전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 90,
    },
    766: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (练习赛)',
            'de': 'The Feast (Übungskampf)',
            'en': 'The Feast (Training)',
            'fr': 'The Feast (en<SoftHyphen/>traî<SoftHyphen/>ne<SoftHyphen/>ment)',
            'ja': 'ザ・フィースト (カジュアルマッチ)',
            'ko': '더 피스트 (일반전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 90,
    },
    767: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '群狼盛宴 (水晶塔演习场：自定赛)',
            'de': 'The Feast (Kristallturm-Arena: Schaukampf)',
            'en': 'The Feast (Custom Match - Crystal Tower)',
            'fr': 'The Feast (personnalisé/Tour de Cristal)',
            'ja': 'ザ・フィースト (クリスタルタワー演習場：カスタムマッチ）',
            'ko': '더 피스트 (크리스탈 타워 훈련장: 친선 경기)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 90,
    },
    768: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '风水灵庙岩燕庙',
            'de': 'Kompass der Schwalbe',
            'en': 'The Swallow\'s Compass',
            'fr': 'Le Compas de l\'Hirondelle',
            'ja': '風水霊殿 ガンエン廟',
            'ko': '강엔 종묘',
        },
        'offsetX': 240,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    769: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '拂晓的少年',
            'de': 'Der Knabe der Morgenröte',
            'en': 'Emissary of the Dawn',
            'fr': 'Voyage en terre hostile',
            'ja': '「暁」の少年',
            'ko': '\'새벽\'의 소년',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    770: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 1～10层',
            'de': 'Himmelssäule (Ebenen 1-10)',
            'en': 'Heaven-on-High  (Floors 1-10)',
            'fr': 'Le Pilier des Cieux (étages 1-10)',
            'ja': 'アメノミハシラ 1～10層',
            'ko': '천궁탑 1~10층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    771: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 11～20层',
            'de': 'Himmelssäule (Ebenen 11-20)',
            'en': 'Heaven-on-High  (Floors 11-20)',
            'fr': 'Le Pilier des Cieux (étages 11-20)',
            'ja': 'アメノミハシラ 11～20層',
            'ko': '천궁탑 11~20층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    772: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 21～30层',
            'de': 'Himmelssäule (Ebenen 21-30)',
            'en': 'Heaven-on-High  (Floors 21-30)',
            'fr': 'Le Pilier des Cieux (étages 21-30)',
            'ja': 'アメノミハシラ 21～30層',
            'ko': '천궁탑 21~30층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    773: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 41～50层',
            'de': 'Himmelssäule (Ebenen 41-50)',
            'en': 'Heaven-on-High  (Floors 41-50)',
            'fr': 'Le Pilier des Cieux (étages 41-50)',
            'ja': 'アメノミハシラ 41～50層',
            'ko': '천궁탑 41~50층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    774: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 61～70层',
            'de': 'Himmelssäule (Ebenen 61-70)',
            'en': 'Heaven-on-High  (Floors 61-70)',
            'fr': 'Le Pilier des Cieux (étages 61-70)',
            'ja': 'アメノミハシラ 61～70層',
            'ko': '천궁탑 61~70층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    775: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 81～90层',
            'de': 'Himmelssäule (Ebenen 81-90)',
            'en': 'Heaven-on-High  (Floors 81-90)',
            'fr': 'Le Pilier des Cieux (étages 81-90)',
            'ja': 'アメノミハシラ 81～90層',
            'ko': '천궁탑 81~90층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    776: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '封闭圣塔黎铎拉纳大灯塔',
            'de': 'Richtfeuer von Ridorana',
            'en': 'The Ridorana Lighthouse',
            'fr': 'Le Phare de Ridorana',
            'ja': '封じられた聖塔 リドルアナ',
            'ko': '대등대 리도르아나',
        },
        'offsetX': 202,
        'offsetY': -92,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    777: {
        'contentType': 28,
        'exVersion': 2,
        'name': {
            'cn': '究极神兵绝境战',
            'de': 'Heldenlied von Ultima (fatal)',
            'en': 'The Weapon\'s Refrain (Ultimate)',
            'fr': 'La Fantasmagorie d\'Ultima (fatal)',
            'ja': '絶アルテマウェポン破壊作戦',
            'ko': '절 알테마 웨폰 파괴작전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 26,
    },
    778: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '月读歼灭战',
            'de': 'Götterdämmerung - Tsukuyomi',
            'en': 'Castrum Fluminis',
            'fr': 'Castrum Fluminis',
            'ja': 'ツクヨミ討滅戦',
            'ko': '츠쿠요미 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    779: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '月读幽夜歼灭战',
            'de': 'Zenit der Götter - Tsukuyomi',
            'en': 'The Minstrel\'s Ballad: Tsukuyomi\'s Pain',
            'fr': 'Castrum Fluminis (extrême)',
            'ja': '極ツクヨミ討滅戦',
            'ko': '극 츠쿠요미 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    782: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 31～40层',
            'de': 'Himmelssäule (Ebenen 31-40)',
            'en': 'Heaven-on-High  (Floors 31-40)',
            'fr': 'Le Pilier des Cieux (étages 31-40)',
            'ja': 'アメノミハシラ 31～40層',
            'ko': '천궁탑 31~40층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    783: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 51～60层',
            'de': 'Himmelssäule (Ebenen 51-60)',
            'en': 'Heaven-on-High  (Floors 51-60)',
            'fr': 'Le Pilier des Cieux (étages 51-60)',
            'ja': 'アメノミハシラ 51～60層',
            'ko': '천궁탑 51~60층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    784: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 71～80层',
            'de': 'Himmelssäule (Ebenen 71-80)',
            'en': 'Heaven-on-High  (Floors 71-80)',
            'fr': 'Le Pilier des Cieux (étages 71-80)',
            'ja': 'アメノミハシラ 71～80層',
            'ko': '천궁탑 71~80층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    785: {
        'contentType': 21,
        'exVersion': 2,
        'name': {
            'cn': '天之御柱 91～100层',
            'de': 'Himmelssäule (Ebenen 91-100)',
            'en': 'Heaven-on-High  (Floors 91-100)',
            'fr': 'Le Pilier des Cieux (étages 91-100)',
            'ja': 'アメノミハシラ 91～100層',
            'ko': '천궁탑 91~100층',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    788: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '污染庭园圣茉夏娜植物园',
            'de': 'Sankt Mocianne-Arboretum (schwer)',
            'en': 'Saint Mocianne\'s Arboretum (Hard)',
            'fr': 'L\'Arboretum Sainte-Mocianne (brutal)',
            'ja': '草木汚染 聖モシャーヌ植物園 (Hard)',
            'ko': '성 모샨 식물원(어려움)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    789: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '死亡大地终末焦土',
            'de': 'Das Kargland',
            'en': 'The Burn',
            'fr': 'L\'Escarre',
            'ja': '永久焦土 ザ・バーン',
            'ko': '영구 초토지대',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 97,
    },
    790: {
        'contentType': 22,
        'exVersion': 0,
        'name': {
            'cn': '灾厄重现军事演习',
            'de': 'Gedenkschlacht der Eorzäischen Allianz',
            'en': 'The Calamity Retold',
            'fr': 'Les grandes manœuvres commémoratives',
            'ja': '新生祭軍事演習',
            'ko': '신생제 군사훈련',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 95,
    },
    791: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '隐塞 (机动战)',
            'de': 'Verborgene Schlucht',
            'en': 'Hidden Gorge',
            'fr': 'Gorge dérobée (machinerie)',
            'ja': 'ヒドゥンゴージ (機工戦)',
            'ko': '숨겨진 보루(기공전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    792: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '虚景跳跳乐大挑战',
            'de': 'Kaktor-Kletterwand',
            'en': 'Leap of Faith',
            'fr': 'Haute voltige',
            'ja': '挑戦！ ジャンピングアスレチック',
            'ko': '뛰어라! 점핑 운동회',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    793: {
        'contentType': 2,
        'exVersion': 2,
        'name': {
            'cn': '国境战线基姆利特暗区',
            'de': 'Die Ghimlyt-Finsternis',
            'en': 'The Ghimlyt Dark',
            'fr': 'Les Ténèbres de Ghimlyt',
            'ja': '境界戦線 ギムリトダーク',
            'ko': '김리트 황야',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    794: {
        'contentType': 9,
        'exVersion': 2,
        'name': {
            'cn': '运河宝物库神殿',
            'de': 'Glücksaltäre von Uznair',
            'en': 'The Shifting Altars of Uznair',
            'fr': 'Le Temple sacré d\'Uznair',
            'ja': '宝物庫 ウズネアカナル祭殿',
            'ko': '보물고 우즈네어 운하 제전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    795: {
        'contentType': 26,
        'exVersion': 2,
        'name': {
            'cn': '禁地优雷卡 涌火之地',
            'de': 'Eureka Pyros',
            'en': 'The Forbidden Land, Eureka Pyros',
            'fr': 'Eurêka Pyros',
            'ja': '禁断の地 エウレカ：ピューロス編',
            'ko': '금단의 땅 에우레카: 피로스편',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 96,
    },
    796: {
        'contentType': 27,
        'exVersion': 0,
        'name': {
            'cn': '出道战',
            'de': 'Debüt in der Himmlischen Arena',
            'en': 'All\'s Well That Starts Well',
            'fr': 'Début du spectacle',
            'ja': 'デビューマッチ',
            'ko': '데뷔전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    797: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '楔石洞',
            'de': 'Der Wille der Mondgöttin',
            'en': 'The Will of the Moon',
            'fr': 'Ralliement dans la steppe',
            'ja': '楔石の虚',
            'ko': '쐐기돌 동굴',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    798: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 阿尔法幻境1',
            'de': 'Alphametrie 1.0',
            'en': 'Alphascape V1.0',
            'fr': 'Alphastice v1.0',
            'ja': '次元の狭間オメガ：アルファ編1',
            'ko': '차원의 틈 오메가: 알파편 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    799: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 阿尔法幻境2',
            'de': 'Alphametrie 2.0',
            'en': 'Alphascape V2.0',
            'fr': 'Alphastice v2.0',
            'ja': '次元の狭間オメガ：アルファ編2',
            'ko': '차원의 틈 오메가: 알파편 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    800: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 阿尔法幻境3',
            'de': 'Alphametrie 3.0',
            'en': 'Alphascape V3.0',
            'fr': 'Alphastice v3.0',
            'ja': '次元の狭間オメガ：アルファ編3',
            'ko': '차원의 틈 오메가: 알파편 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    801: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄时空狭缝 阿尔法幻境4',
            'de': 'Alphametrie 4.0',
            'en': 'Alphascape V4.0',
            'fr': 'Alphastice v4.0',
            'ja': '次元の狭間オメガ：アルファ編4',
            'ko': '차원의 틈 오메가: 알파편 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    802: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 阿尔法幻境1',
            'de': 'Alphametrie 1.0 (episch)',
            'en': 'Alphascape V1.0 (Savage)',
            'fr': 'Alphastice v1.0 (sadique)',
            'ja': '次元の狭間オメガ零式：アルファ編1',
            'ko': '차원의 틈 오메가: 알파편(영웅) 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    803: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 阿尔法幻境2',
            'de': 'Alphametrie 2.0 (episch)',
            'en': 'Alphascape V2.0 (Savage)',
            'fr': 'Alphastice v2.0 (sadique)',
            'ja': '次元の狭間オメガ零式：アルファ編2',
            'ko': '차원의 틈 오메가: 알파편(영웅) 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    804: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 阿尔法幻境3',
            'de': 'Alphametrie 3.0 (episch)',
            'en': 'Alphascape V3.0 (Savage)',
            'fr': 'Alphastice v3.0 (sadique)',
            'ja': '次元の狭間オメガ零式：アルファ編3',
            'ko': '차원의 틈 오메가: 알파편(영웅) 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    805: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '欧米茄零式时空狭缝 阿尔法幻境4',
            'de': 'Alphametrie 4.0 (episch)',
            'en': 'Alphascape V4.0 (Savage)',
            'fr': 'Alphastice v4.0 (sadique)',
            'ja': '次元の狭間オメガ零式：アルファ編4',
            'ko': '차원의 틈 오메가: 알파편(영웅) 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 92,
    },
    806: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '保镖歼灭战',
            'de': 'Duell auf der Kugane-Brücke',
            'en': 'Kugane Ohashi',
            'fr': 'Le Pont Ohashi',
            'ja': '真ヨウジンボウ討滅戦',
            'ko': '진 요우진보 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    810: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '朱雀镇魂战',
            'de': 'Seelentanz - Suzaku',
            'en': 'Hells\' Kier',
            'fr': 'Le Nid des Lamentations',
            'ja': '朱雀征魂戦',
            'ko': '주작 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 98,
    },
    811: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '朱雀诗魂战',
            'de': 'Seelensturm - Suzaku',
            'en': 'Hells\' Kier (Extreme)',
            'fr': 'Le Nid des Lamentations (extrême)',
            'ja': '極朱雀征魂戦',
            'ko': '극 주작 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 98,
    },
    813: {
        'exVersion': 3,
        'name': {
            'cn': '雷克兰德',
            'de': 'Seenland',
            'en': 'Lakeland',
            'fr': 'Grand-Lac',
            'ja': 'レイクランド',
            'ko': '레이크랜드',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 106,
    },
    814: {
        'exVersion': 3,
        'name': {
            'cn': '珂露西亚岛',
            'de': 'Kholusia',
            'en': 'Kholusia',
            'fr': 'Kholusia',
            'ja': 'コルシア島',
            'ko': '콜루시아 섬',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 107,
    },
    815: {
        'exVersion': 3,
        'name': {
            'cn': '安穆·艾兰',
            'de': 'Amh Araeng',
            'en': 'Amh Araeng',
            'fr': 'Amh Araeng',
            'ja': 'アム・アレーン',
            'ko': '아므 아랭',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 108,
    },
    816: {
        'exVersion': 3,
        'name': {
            'cn': '伊尔美格',
            'de': 'Il Mheg',
            'en': 'Il Mheg',
            'fr': 'Il Mheg',
            'ja': 'イル・メグ',
            'ko': '일 메그',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 109,
    },
    817: {
        'exVersion': 3,
        'name': {
            'cn': '拉凯提卡大森林',
            'de': 'Der Große Wald Rak\'tika',
            'en': 'The Rak\'tika Greatwood',
            'fr': 'Rak\'tika',
            'ja': 'ラケティカ大森林',
            'ko': '라케티카 대삼림',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 110,
    },
    818: {
        'exVersion': 3,
        'name': {
            'cn': '黑风海',
            'de': 'Tempest',
            'en': 'The Tempest',
            'fr': 'La Tempête',
            'ja': 'テンペスト',
            'ko': '템페스트',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 111,
    },
    819: {
        'exVersion': 3,
        'name': {
            'cn': '水晶都',
            'de': 'Crystarium',
            'en': 'The Crystarium',
            'fr': 'Cristarium',
            'ja': 'クリスタリウム',
            'ko': '크리스타리움',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 112,
    },
    820: {
        'exVersion': 3,
        'name': {
            'cn': '游末邦',
            'de': 'Eulmore',
            'en': 'Eulmore',
            'fr': 'Eulmore',
            'ja': 'ユールモア',
            'ko': '율모어',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 113,
    },
    821: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '水妖幻园多恩美格禁园',
            'de': 'Dohn Mheg',
            'en': 'Dohn Mheg',
            'fr': 'Dohn Mheg',
            'ja': '水妖幻園 ドォーヌ・メグ',
            'ko': '도느 메그',
        },
        'offsetX': 0,
        'offsetY': 200,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    822: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '伪造天界格鲁格火山',
            'de': 'Der Gulg',
            'en': 'Mt. Gulg',
            'fr': 'Mont Gulg',
            'ja': '偽造天界 グルグ火山',
            'ko': '굴그 화산',
        },
        'offsetX': -188,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 102,
    },
    823: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '文明古迹奇坦那神影洞',
            'de': 'Irrungen der Qitari',
            'en': 'The Qitana Ravel',
            'fr': 'L\'Enchevêtrement des Qitari',
            'ja': '古跡探索 キタンナ神影洞',
            'ko': '키타나 신굴',
        },
        'offsetX': 0,
        'offsetY': -274,
        'sizeFactor': 200,
        'weatherRate': 102,
    },
    824: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '青龙镇魂战',
            'de': 'Seelentanz - Seiryu',
            'en': 'The Wreath of Snakes',
            'fr': 'L\'Îlot des Amertumes',
            'ja': '青龍征魂戦',
            'ko': '청룡 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 99,
    },
    825: {
        'contentType': 4,
        'exVersion': 2,
        'name': {
            'cn': '青龙诗魂战',
            'de': 'Seelensturm - Seiryu',
            'en': 'The Wreath of Snakes (Extreme)',
            'fr': 'L\'Îlot des Amertumes (extrême)',
            'ja': '極青龍征魂戦',
            'ko': '극 청룡 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 99,
    },
    826: {
        'contentType': 5,
        'exVersion': 2,
        'name': {
            'cn': '乐欲之所瓯博讷修道院',
            'de': 'Kloster von Orbonne',
            'en': 'The Orbonne Monastery',
            'fr': 'Le Monastère d\'Orbonne',
            'ja': '楽欲の僧院 オーボンヌ',
            'ko': '오본느 수도원',
        },
        'offsetX': -545,
        'offsetY': -663,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    827: {
        'contentType': 26,
        'exVersion': 2,
        'name': {
            'cn': '禁地优雷卡 丰水之地',
            'de': 'Eureka Hydatos',
            'en': 'The Forbidden Land, Eureka Hydatos',
            'fr': 'Eurêka Hydatos',
            'ja': '禁断の地 エウレカ：ヒュダトス編',
            'ko': '금단의 땅 에우레카: 히다토스편',
        },
        'offsetX': 0,
        'offsetY': 475,
        'sizeFactor': 100,
        'weatherRate': 100,
    },
    830: {
        'contentType': 7,
        'exVersion': 2,
        'name': {
            'cn': '英雄挽歌',
            'de': 'Requiem der Helden',
            'en': 'A Requiem for Heroes',
            'fr': 'Un requiem pour les héros',
            'ja': '英雄への鎮魂歌',
            'ko': '영웅을 위한 진혼가',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    831: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '多玛方城战：东风战4人亲友桌（不带食断）',
            'de': '4-Spieler-Mahjong (schnelle Partie, Kuitan deaktiviert)',
            'en': 'Four-player Mahjong (Quick Match, Kuitan Disabled)',
            'fr': 'Mahjong domien<Indent/>: 4 joueurs (partie rapide sans kuitan)',
            'ja': 'ドマ式麻雀：東風戦4人セット卓（クイタン無し）',
            'ko': '작패유희: 동풍전 4인용 탁자(부르기 단요구 없음)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    832: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '空军装甲驾驶员',
            'de': 'Luftwaffe, Feuer frei!',
            'en': 'Air Force One',
            'fr': 'As de l\'air',
            'ja': '出撃！ エアフォースパイロット',
            'ko': '출격! 에어포스 조종사',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    834: {
        'contentType': 7,
        'exVersion': 0,
        'name': {
            'cn': '风之使者',
            'de': 'Durch den Sturm und zurück',
            'en': 'Messenger of the Winds',
            'fr': 'La Messagère du vent',
            'ja': '来訪せし風の御使',
            'ko': '바람의 어사',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 101,
    },
    836: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '避暑离宫马利卡大井',
            'de': 'Malikahs Brunnen',
            'en': 'Malikah\'s Well',
            'fr': 'Le Puits de Malikah',
            'ja': '爽涼離宮 マリカの大井戸',
            'ko': '말리카 큰우물',
        },
        'offsetX': -65,
        'offsetY': -30,
        'sizeFactor': 200,
        'weatherRate': 102,
    },
    837: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '遇袭集落水滩村',
            'de': 'Holminster',
            'en': 'Holminster Switch',
            'fr': 'Holminster',
            'ja': '殺戮郷村 ホルミンスター',
            'ko': '홀민스터',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 102,
    },
    838: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '末日暗影亚马乌罗提',
            'de': 'Amaurot',
            'en': 'Amaurot',
            'fr': 'Amaurote',
            'ja': '終末幻想 アーモロート',
            'ko': '아모로트',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 105,
    },
    840: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '异界遗构希尔科斯孪晶塔',
            'de': 'Der Kristallzwilling',
            'en': 'The Twinning',
            'fr': 'La Macle de Syrcus',
            'ja': '異界遺構 シルクス・ツイニング',
            'ko': '쌍둥이 시르쿠스',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    841: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '创造机构阿尼德罗学院',
            'de': 'Akadaemia Anyder',
            'en': 'Akadaemia Anyder',
            'fr': 'Akadaemia Anydre',
            'ja': '創造機関 アナイダアカデミア',
            'ko': '애나이더 아카데미아',
        },
        'offsetX': 0,
        'offsetY': 30,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    845: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '缇坦妮雅歼灭战',
            'de': 'Offenbarung - Titania',
            'en': 'The Dancing Plague',
            'fr': 'La Valse du Monarque',
            'ja': 'ティターニア討滅戦',
            'ko': '티타니아 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 103,
    },
    846: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '无瑕灵君歼灭战',
            'de': 'Offenbarung - Innozenz',
            'en': 'The Crown of the Immaculate',
            'fr': 'La Couronne de l\'Immaculé',
            'ja': 'イノセンス討滅戦',
            'ko': '이노센스 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 104,
    },
    847: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '哈迪斯歼灭战',
            'de': 'Offenbarung - Hades',
            'en': 'The Dying Gasp',
            'fr': 'Le Râle de l\'Agonie',
            'ja': 'ハーデス討滅戦',
            'ko': '하데스 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 105,
    },
    848: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '无瑕灵君歼殛战',
            'de': 'Letzte Läuterung - Innozenz',
            'en': 'The Crown of the Immaculate (Extreme)',
            'fr': 'La Couronne de l\'Immaculé (extrême)',
            'ja': '極イノセンス討滅戦',
            'ko': '극 이노센스 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 104,
    },
    849: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 觉醒之章1',
            'de': 'Edens Erwachen - Auferstehung',
            'en': 'Eden\'s Gate: Resurrection',
            'fr': 'L\'Éveil d\'Éden - Résurrection',
            'ja': '希望の園エデン：覚醒編1',
            'ko': '희망의 낙원 에덴: 각성편 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    850: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 觉醒之章2',
            'de': 'Edens Erwachen - Niederkunft',
            'en': 'Eden\'s Gate: Descent',
            'fr': 'L\'Éveil d\'Éden - Descente',
            'ja': '希望の園エデン：覚醒編2',
            'ko': '희망의 낙원 에덴: 각성편 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    851: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 觉醒之章3',
            'de': 'Edens Erwachen - Überflutung',
            'en': 'Eden\'s Gate: Inundation',
            'fr': 'L\'Éveil d\'Éden - Déluge',
            'ja': '希望の園エデン：覚醒編3',
            'ko': '희망의 낙원 에덴: 각성편 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 38,
    },
    852: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 觉醒之章4',
            'de': 'Edens Erwachen - Beerdigung',
            'en': 'Eden\'s Gate: Sepulture',
            'fr': 'L\'Éveil d\'Éden - Inhumation',
            'ja': '希望の園エデン：覚醒編4',
            'ko': '희망의 낙원 에덴: 각성편 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    853: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 觉醒之章1',
            'de': 'Edens Erwachen - Auferstehung (episch)',
            'en': 'Eden\'s Gate: Resurrection (Savage)',
            'fr': 'L\'Éveil d\'Éden - Résurrection (sadique)',
            'ja': '希望の園エデン零式：覚醒編1',
            'ko': '희망의 낙원 에덴: 각성편(영웅) 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    854: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 觉醒之章2',
            'de': 'Edens Erwachen - Niederkunft (episch)',
            'en': 'Eden\'s Gate: Descent (Savage)',
            'fr': 'L\'Éveil d\'Éden - Descente (sadique)',
            'ja': '希望の園エデン零式：覚醒編2',
            'ko': '희망의 낙원 에덴: 각성편(영웅) 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    855: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 觉醒之章3',
            'de': 'Edens Erwachen - Überflutung (episch)',
            'en': 'Eden\'s Gate: Inundation (Savage)',
            'fr': 'L\'Éveil d\'Éden - Déluge (sadique)',
            'ja': '希望の園エデン零式：覚醒編3',
            'ko': '희망의 낙원 에덴: 각성편(영웅) 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 38,
    },
    856: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 觉醒之章4',
            'de': 'Edens Erwachen - Beerdigung (episch)',
            'en': 'Eden\'s Gate: Sepulture (Savage)',
            'fr': 'L\'Éveil d\'Éden - Inhumation (sadique)',
            'ja': '希望の園エデン零式：覚醒編4',
            'ko': '희망의 낙원 에덴: 각성편(영웅) 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    858: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '缇坦妮雅歼殛战',
            'de': 'Letzte Läuterung - Titania',
            'en': 'The Dancing Plague (Extreme)',
            'fr': 'La Valse du Monarque (extrême)',
            'ja': '極ティターニア討滅戦',
            'ko': '극 티타니아 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 103,
    },
    859: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '机关、诅咒、剧毒与……',
            'de': 'Der Beichtstuhl von Toupasa dem Älteren',
            'en': 'Legend of the Not-so-hidden Temple',
            'fr': 'Le Confessionnal de Toupasa l\'ancien',
            'ja': '仕掛けと呪いと毒と',
            'ko': '함정과 저주와 독',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 102,
    },
    860: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '废都拿巴示艾兰',
            'de': 'Vater und Bruder',
            'en': 'Coming Clean',
            'fr': 'Sur les rails de Nabaath Areng',
            'ja': '廃都ナバスアレン',
            'ko': '나바스아렝 폐허',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 102,
    },
    873: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '摇摆的天平',
            'de': 'Ob Mitleid oder Hass',
            'en': 'The Hardened Heart',
            'fr': 'Naissance d\'un bourreau',
            'ja': '揺れる天秤',
            'ko': '흔들리는 천칭',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    874: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '古代大再生魔法',
            'de': 'Alter Zauber',
            'en': 'The Lost and the Found',
            'fr': 'Magie ancestrale',
            'ja': '古の大再生魔法',
            'ko': '고대의 대재생 마법',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 110,
    },
    875: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '勇敢的猎人',
            'de': 'Der Legende auf der Spur',
            'en': 'The Hunter\'s Legacy',
            'fr': 'La chasseuse de légende',
            'ja': '勇気の狩人',
            'ko': '용기 있는 사냥꾼',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 63,
    },
    876: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '奈贝尔特的后悔',
            'de': 'Ein großes Opfer',
            'en': 'Nyelbert\'s Lament',
            'fr': 'Une cupidité bien généreuse',
            'ja': 'ナイルベルトの後悔',
            'ko': '나일베르트의 후회',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    879: {
        'contentType': 9,
        'exVersion': 3,
        'name': {
            'cn': '梦羽宝境',
            'de': 'Verliese von Lyhe Ghiah',
            'en': 'The Dungeons of Lyhe Ghiah',
            'fr': 'Le Donjon hypogéen du Lyhe Ghiah',
            'ja': '宝物庫 リェー・ギア・ダンジョン',
            'ko': '보물고 리예 기아 지하미궁',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    882: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '复制工厂废墟',
            'de': 'Die kopierte Fabrik',
            'en': 'The Copied Factory',
            'fr': 'La réplique de l\'usine désaffectée',
            'ja': '複製サレタ工場廃墟',
            'ko': '복제된 공장 폐허',
        },
        'offsetX': 610,
        'offsetY': 70,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    884: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '魔法宫殿宇宙宫',
            'de': 'Chateau Cosmea',
            'en': 'The Grand Cosmos',
            'fr': 'Le Cosmos coruscant',
            'ja': '魔法宮殿 グラン・コスモス',
            'ko': '그랑 코스모스',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    885: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '哈迪斯孤念歼灭战',
            'de': 'Letzte Läuterung - Hades',
            'en': 'The Minstrel\'s Ballad: Hades\'s Elegy',
            'fr': 'Le Râle de l\'Agonie (extrême)',
            'ja': '極ハーデス討滅戦',
            'ko': '극 하데스 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 105,
    },
    887: {
        'contentType': 28,
        'exVersion': 3,
        'name': {
            'cn': '亚历山大绝境战',
            'de': 'Alexander (fatal)',
            'en': 'The Epic of Alexander (Ultimate)',
            'fr': 'L\'Odyssée d\'Alexander (fatal)',
            'ja': '絶アレキサンダー討滅戦',
            'ko': '절 알렉산더 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    888: {
        'contentType': 6,
        'exVersion': 0,
        'name': {
            'cn': '昂萨哈凯尔（竞争战）',
            'de': 'Onsal Hakair (Danshig Naadam)',
            'en': 'Onsal Hakair (Danshig Naadam)',
            'fr': 'Onsal Hakair (Danshig Naadam)',
            'ja': 'オンサル・ハカイル (終節戦)',
            'ko': '온살 하카이르(계절끝 합전)',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 117,
    },
    893: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '纯白誓约、漆黑密约',
            'de': 'Der Wolf und der Drachenreiter',
            'en': 'Vows of Virtue, Deeds of Cruelty',
            'fr': 'Vœux de vertu, actes de cruauté',
            'ja': '白き誓約、黒き密約',
            'ko': '하얀 서약, 검은 밀약',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    894: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '我心依旧',
            'de': 'Trubel im Traumland',
            'en': 'As the Heart Bids',
            'fr': 'À l\'écoute de soi',
            'ja': 'この心が望むがままに',
            'ko': '이 마음이 원하는 대로',
        },
        'offsetX': -12,
        'offsetY': 50,
        'sizeFactor': 400,
        'weatherRate': 40,
    },
    897: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '红宝石神兵破坏作战',
            'de': 'Rubinfeuer - Entfesselung',
            'en': 'Cinder Drift',
            'fr': 'Les Nuées de Brandons',
            'ja': 'ルビーウェポン破壊作戦',
            'ko': '루비 웨폰 파괴작전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 28,
    },
    898: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '黑风海底阿尼德罗追忆馆',
            'de': 'Anamnesis Anyder',
            'en': 'Anamnesis Anyder',
            'fr': 'Anamnesis Anydre',
            'ja': '黒風海底 アニドラス・アナムネーシス',
            'ko': '애니드라스 아남네시스',
        },
        'offsetX': 100,
        'offsetY': -390,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    900: {
        'contentType': 16,
        'exVersion': 0,
        'name': {
            'cn': '出海垂钓',
            'de': 'Auf großer Fahrt',
            'en': 'Ocean Fishing',
            'fr': 'Pêche en mer',
            'ja': 'オーシャンフィッシング',
            'ko': '먼바다 낚시',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 14,
    },
    902: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 共鸣之章1',
            'de': 'Edens Resonanz - Entladung',
            'en': 'Eden\'s Verse: Fulmination',
            'fr': 'Les Accords d\'Éden - Fulmination',
            'ja': '希望の園エデン：共鳴編1',
            'ko': '희망의 낙원 에덴: 공명편 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    903: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 共鸣之章2',
            'de': 'Edens Resonanz - Raserei',
            'en': 'Eden\'s Verse: Furor',
            'fr': 'Les Accords d\'Éden - Fureur',
            'ja': '希望の園エデン：共鳴編2',
            'ko': '희망의 낙원 에덴: 공명편 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    904: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 共鸣之章3',
            'de': 'Edens Resonanz - Bildersturm',
            'en': 'Eden\'s Verse: Iconoclasm',
            'fr': 'Les Accords d\'Éden - Iconoclasme',
            'ja': '希望の園エデン：共鳴編3',
            'ko': '희망의 낙원 에덴: 공명편 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    905: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 共鸣之章4',
            'de': 'Edens Resonanz - Erstarrung',
            'en': 'Eden\'s Verse: Refulgence',
            'fr': 'Les Accords d\'Éden - Éclat',
            'ja': '希望の園エデン：共鳴編4',
            'ko': '희망의 낙원 에덴: 공명편 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 46,
    },
    906: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 共鸣之章1',
            'de': 'Edens Resonanz - Entladung (episch)',
            'en': 'Eden\'s Verse: Fulmination (Savage)',
            'fr': 'Les Accords d\'Éden - Fulmination (sadique)',
            'ja': '希望の園エデン零式：共鳴編1',
            'ko': '희망의 낙원 에덴: 공명편(영웅) 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    907: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 共鸣之章2',
            'de': 'Edens Resonanz - Raserei (episch)',
            'en': 'Eden\'s Verse: Furor (Savage)',
            'fr': 'Les Accords d\'Éden - Fureur (sadique)',
            'ja': '希望の園エデン零式：共鳴編2',
            'ko': '희망의 낙원 에덴: 공명편(영웅) 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    908: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 共鸣之章3',
            'de': 'Edens Resonanz - Bildersturm (episch)',
            'en': 'Eden\'s Verse: Iconoclasm (Savage)',
            'fr': 'Les Accords d\'Éden - Iconoclasme (sadique)',
            'ja': '希望の園エデン零式：共鳴編3',
            'ko': '희망의 낙원 에덴: 공명편(영웅) 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    909: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 共鸣之章4',
            'de': 'Edens Resonanz - Erstarrung (episch)',
            'en': 'Eden\'s Verse: Refulgence (Savage)',
            'fr': 'Les Accords d\'Éden - Éclat (sadique)',
            'ja': '希望の園エデン零式：共鳴編4',
            'ko': '희망의 낙원 에덴: 공명편(영웅) 4',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 46,
    },
    911: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '博兹雅堡垒蒸发事件',
            'de': 'Der Bozja-Vorfall',
            'en': 'The Bozja Incident',
            'fr': 'Prélude à la catastrophe',
            'ja': 'シタデル・ボズヤ蒸発事変',
            'ko': '보즈야 사건',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 123,
    },
    912: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '红宝石神兵狂想作战',
            'de': 'Rubinfeuer - Trauma',
            'en': 'Cinder Drift (Extreme)',
            'fr': 'Les Nuées de Brandons (extrême)',
            'ja': '極ルビーウェポン破壊作戦',
            'ko': '극 루비 웨폰 파괴작전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 28,
    },
    913: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '博兹雅堡垒追忆战',
            'de': 'Memoria Misera (extrem)',
            'en': 'Memoria Misera (Extreme)',
            'fr': 'Memoria Misera (extrême)',
            'ja': '極シタデル・ボズヤ追憶戦',
            'ko': '극 보즈야 추억전',
        },
        'offsetX': -35,
        'offsetY': 683,
        'sizeFactor': 400,
        'weatherRate': 123,
    },
    914: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '英雄无法安息',
            'de': 'Von schlafenden Helden',
            'en': 'A Sleep Disturbed',
            'fr': 'L\'épreuve ronka',
            'ja': '汝、英雄の眠り妨げるは',
            'ko': '그대, 영웅의 잠을 방해하는가',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 0,
    },
    916: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '暗影决战诺弗兰特',
            'de': 'Schlacht um Norvrandt',
            'en': 'The Heroes\' Gauntlet',
            'fr': 'La Traversée de Norvrandt',
            'ja': '漆黒決戦 ノルヴラント',
            'ko': '노르브란트',
        },
        'offsetX': 626,
        'offsetY': -611,
        'sizeFactor': 200,
        'weatherRate': 125,
    },
    917: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '人偶军事基地',
            'de': 'Die Puppenfestung',
            'en': 'The Puppets\' Bunker',
            'fr': 'La base militaire des Pantins',
            'ja': '人形タチノ軍事基地',
            'ko': '인형들의 군사 기지',
        },
        'offsetX': 290,
        'offsetY': -190,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    920: {
        'contentType': 29,
        'exVersion': 3,
        'name': {
            'cn': '南方博兹雅战线',
            'de': 'Bozja-Südfront',
            'en': 'The Bozjan Southern Front',
            'fr': 'Front sud de Bozja',
            'ja': '南方ボズヤ戦線',
            'ko': '남부 보즈야 전선',
        },
        'offsetX': -127,
        'offsetY': -424,
        'sizeFactor': 100,
        'weatherRate': 124,
    },
    922: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '光之战士歼灭战',
            'de': 'Krieger des Lichts',
            'en': 'The Seat of Sacrifice',
            'fr': 'Le Trône du Sacrifice',
            'ja': 'ウォーリア・オブ・ライト討滅戦',
            'ko': '빛의 전사 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 125,
    },
    923: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '光之战士幻耀歼灭战',
            'de': 'Krieger des Lichts (extrem)',
            'en': 'The Seat of Sacrifice (Extreme)',
            'fr': 'Le Trône du Sacrifice (extrême)',
            'ja': '極ウォーリア・オブ・ライト討滅戦',
            'ko': '극 빛의 전사 토벌전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 126,
    },
    924: {
        'contentType': 9,
        'exVersion': 3,
        'name': {
            'cn': '梦羽宝殿',
            'de': 'Das Karussell von Lyhe Ghiah',
            'en': 'The Shifting Oubliettes of Lyhe Ghiah',
            'fr': 'Le Jardin secret du Lyhe Ghiah',
            'ja': '宝物庫 リェー・ギア・ダンジョン祭殿',
            'ko': '보물고 리예 기아 지하미궁 제전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    925: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '飞翔吧，前往维尔利特！',
            'de': 'Luftangriff auf Werlyt',
            'en': 'Sleep Now in Sapphire',
            'fr': 'Sur la mer de saphir',
            'ja': '飛べ！ ウェルリトへ ',
            'ko': '날아라! 웰리트를 향하여',
        },
        'offsetX': 15,
        'offsetY': -610,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    929: {
        'contentType': 16,
        'exVersion': 1,
        'name': {
            'cn': '天上福地云冠群岛',
            'de': 'Das Diadem - Erschließung',
            'en': 'The Diadem',
            'fr': 'Le Diadème',
            'ja': '雲海採集 ディアデム諸島',
            'ko': '디아뎀 제도',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 68,
    },
    930: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '希瓦幻巧战',
            'de': 'Traumprüfung - Shiva',
            'en': 'The Akh Afah Amphitheatre (Unreal)',
            'fr': 'L\'Amphithéâtre d\'Akh Afah (irréel)',
            'ja': '幻シヴァ討滅戦',
            'ko': '환 시바 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 46,
    },
    932: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '褪色的记忆',
            'de': 'Verblasste Erinnerungen',
            'en': 'Faded Memories',
            'fr': 'Souvenir périssable',
            'ja': '色あせた記憶',
            'ko': '빛바랜 기억',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 114,
    },
    933: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'cn': '魔术工房玛托雅工作室',
            'de': 'Matoyas Atelier',
            'en': 'Matoya\'s Relict',
            'fr': 'L\'Atelier abandonné de Matoya',
            'ja': '魔術工房 マトーヤのアトリエ',
            'ko': '마토야의 공방',
        },
        'offsetX': 0,
        'offsetY': -75,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    934: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '绿宝石神兵破坏作战',
            'de': 'Smaragdsturm - Entfesselung',
            'en': 'Castrum Marinum',
            'fr': 'Castrum Marinum',
            'ja': 'エメラルドウェポン破壊作戦',
            'ko': '에메랄드 웨폰 파괴작전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    935: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '绿宝石神兵狂想作战',
            'de': 'Smaragdsturm - Trauma',
            'en': 'Castrum Marinum (Extreme)',
            'fr': 'Castrum Marinum (extrême)',
            'ja': '極エメラルドウェポン破壊作戦',
            'ko': '극 에메랄드 웨폰 파괴작전',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    936: {
        'contentType': 29,
        'exVersion': 3,
        'name': {
            'cn': '女王古殿',
            'de': 'Delubrum Reginae',
            'en': 'Delubrum Reginae',
            'fr': 'Delubrum Reginae',
            'ja': 'グンヒルド・ディルーブラム',
        },
        'offsetX': 0,
        'offsetY': -378,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    937: {
        'contentType': 29,
        'exVersion': 3,
        'name': {
            'cn': '零式女王古殿',
            'de': 'Delubrum Reginae (episch)',
            'en': 'Delubrum Reginae (Savage)',
            'fr': 'Delubrum Reginae (sadique)',
            'ja': 'グンヒルド・ディルーブラム零式',
        },
        'offsetX': 0,
        'offsetY': -378,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    938: {
        'contentType': 2,
        'exVersion': 3,
        'name': {
            'de': 'Die Goldene Ebene von Paglth\'an',
            'en': 'Paglth\'an',
            'fr': 'La grande prairie de Paglth\'an',
            'ja': '黄金平原 パガルザン',
        },
        'offsetX': 415,
        'offsetY': -110,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    940: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '九宫幻卡：官方锦标赛',
            'de': 'Triple Triad: Manderville-Turnier',
            'en': 'Triple Triad Open Tournament',
            'fr': 'Tournoi officiel de Triple Triade',
            'ja': 'トリプルトライアド：オフィシャルトーナメント',
            'ko': '트리플 트라이어드: 공식 토너먼트',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 800,
        'weatherRate': 0,
    },
    941: {
        'contentType': 19,
        'exVersion': 0,
        'name': {
            'cn': '九宫幻卡：锦标赛对局室',
            'de': 'Triple Triad: Privatturnier',
            'en': 'Triple Triad Invitational Parlor',
            'fr': 'Salle de tournoi libre de Triple Triade',
            'ja': 'トリプルトライアド：カスタムトーナメントルーム',
            'ko': '트리플 트라이어드: 친선 토너먼트',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 800,
        'weatherRate': 0,
    },
    942: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 再生之章1',
            'de': 'Edens Verheißung - Umbra',
            'en': 'Eden\'s Promise: Umbra',
            'fr': 'La Promesse d\'Éden - Nuée',
            'ja': '希望の園エデン：再生編1',
            'ko': '희망의 낙원 에덴: 재생편 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    943: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 再生之章2',
            'de': 'Edens Verheißung - Litanei',
            'en': 'Eden\'s Promise: Litany',
            'fr': 'La Promesse d\'Éden - Litanie',
            'ja': '希望の園エデン：再生編2',
            'ko': '희망의 낙원 에덴: 재생편 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    944: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 再生之章3',
            'de': 'Edens Verheißung - Anamorphose',
            'en': 'Eden\'s Promise: Anamorphosis',
            'fr': 'La Promesse d\'Éden - Anamorphose',
            'ja': '希望の園エデン：再生編3',
            'ko': '희망의 낙원 에덴: 재생편 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    945: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸希望乐园 再生之章4',
            'de': 'Edens Verheißung - Ewigkeit',
            'en': 'Eden\'s Promise: Eternity',
            'fr': 'La Promesse d\'Éden - Éternité',
            'ja': '希望の園エデン：再生編4',
            'ko': '희망의 낙원 에덴: 재생편 4',
        },
        'offsetX': -71,
        'offsetY': 23,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    946: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 再生之章1',
            'de': 'Edens Verheißung - Umbra (episch)',
            'en': 'Eden\'s Promise: Umbra (Savage)',
            'fr': 'La Promesse d\'Éden - Nuée (sadique)',
            'ja': '希望の園エデン零式：再生編1',
            'ko': '희망의 낙원 에덴: 재생편(영웅) 1',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    947: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 再生之章2',
            'de': 'Edens Verheißung - Litanei (episch)',
            'en': 'Eden\'s Promise: Litany (Savage)',
            'fr': 'La Promesse d\'Éden - Litanie (sadique)',
            'ja': '希望の園エデン零式：再生編2',
            'ko': '희망의 낙원 에덴: 재생편(영웅) 2',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    948: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 再生之章3',
            'de': 'Edens Verheißung - Anamorphose (episch)',
            'en': 'Eden\'s Promise: Anamorphosis (Savage)',
            'fr': 'La Promesse d\'Éden - Anamorphose (sadique)',
            'ja': '希望の園エデン零式：再生編3',
            'ko': '희망의 낙원 에덴: 재생편(영웅) 3',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    949: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'cn': '伊甸零式希望乐园 再生之章4',
            'de': 'Edens Verheißung - Ewigkeit (episch)',
            'en': 'Eden\'s Promise: Eternity (Savage)',
            'fr': 'La Promesse d\'Éden - Éternité (sadique)',
            'ja': '希望の園エデン零式：再生編4',
            'ko': '희망의 낙원 에덴: 재생편(영웅) 4',
        },
        'offsetX': 0,
        'offsetY': 75,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    950: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'de': 'Diamantblitz - Entfesselung',
            'en': 'The Cloud Deck',
            'fr': 'Le Tillac des Cirrus',
            'ja': 'ダイヤウェポン捕獲作戦',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    951: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'de': 'Diamantblitz - Trauma',
            'en': 'The Cloud Deck (Extreme)',
            'fr': 'Le Tillac des Cirrus (extrême)',
            'ja': '極ダイヤウェポン捕獲作戦',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    953: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'cn': '泰坦幻巧战',
            'de': 'Traumprüfung - Titan',
            'en': 'The Navel (Unreal)',
            'fr': 'Le Nombril (irréel)',
            'ja': '幻タイタン討滅戦',
            'ko': '환 타이탄 토벌전',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    954: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '威尔布兰德扬帆起航',
            'de': 'Gute Winde für Vylbrand',
            'en': 'The Great Ship Vylbrand',
            'fr': 'Un navire nommé Vylbrand',
            'ja': 'バイルブランドの船出',
            'ko': '바일브랜드 출항',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 23,
    },
    955: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'cn': '神佑女王',
            'de': 'Hinab in die Ruinen',
            'en': 'Fit for a Queen',
            'fr': 'Que les Dieux gardent la Reine',
            'ja': 'ゴッド・セイブ・ザ・クイーン',
        },
        'offsetX': 0,
        'offsetY': -750,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    966: {
        'contentType': 5,
        'exVersion': 3,
        'name': {
            'de': 'Der Turm, Paradigmenbrecher',
            'en': 'The Tower at Paradigm\'s Breach',
            'fr': 'La tour de la Contingence',
            'ja': '希望ノ砲台：「塔」',
        },
        'offsetX': 808,
        'offsetY': -772,
        'sizeFactor': 200,
        'weatherRate': 0,
    },
    967: {
        'exVersion': 3,
        'name': {
            'cn': '帝国海上基地干船坞',
            'de': 'Trockendock von Castrum Marinum',
            'en': 'Castrum Marinum Drydocks',
            'fr': 'Cale sèche de Castrum Marinum',
            'ja': 'カステッルム・マリヌム・ドライドック',
            'ko': '카스트룸 마리눔 건선거',
        },
        'offsetX': -100,
        'offsetY': -100,
        'sizeFactor': 400,
        'weatherRate': 0,
    },
    972: {
        'contentType': 4,
        'exVersion': 3,
        'name': {
            'de': 'Traumprüfung - Leviathan',
            'en': 'The <Emphasis>Whorleater</Emphasis> (Unreal)',
            'fr': 'Le Briseur de marées (irréel)',
            'ja': '幻リヴァイアサン討滅戦',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 400,
        'weatherRate': 38,
    },
    975: {
        'contentType': 29,
        'exVersion': 3,
        'name': {
            'de': 'Zadnor-Hochebene',
            'en': 'Zadnor',
            'fr': 'Hauts plateaux de Zadnor',
            'ja': 'ザトゥノル高原',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 130,
    },
    977: {
        'contentType': 7,
        'exVersion': 3,
        'name': {
            'de': 'Kampf im Morgengrauen',
            'en': 'Death Unto Dawn',
            'fr': 'Aube meurtrière',
            'ja': '黎明の死闘',
        },
        'offsetX': 0,
        'offsetY': 0,
        'sizeFactor': 100,
        'weatherRate': 114,
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (data);


/***/ }),

/***/ 477:
/***/ ((module) => {



/* eslint-env browser */

/* eslint-disable no-undef, no-use-before-define, new-cap */
module.exports = function (content, workerConstructor, workerOptions, url) {
  var globalScope = self || window;

  try {
    try {
      var blob;

      try {
        // New API
        blob = new globalScope.Blob([content]);
      } catch (e) {
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder = globalScope.BlobBuilder || globalScope.WebKitBlobBuilder || globalScope.MozBlobBuilder || globalScope.MSBlobBuilder;
        blob = new BlobBuilder();
        blob.append(content);
        blob = blob.getBlob();
      }

      var URL = globalScope.URL || globalScope.webkitURL;
      var objectURL = URL.createObjectURL(blob);
      var worker = new globalScope[workerConstructor](objectURL, workerOptions);
      URL.revokeObjectURL(objectURL);
      return worker;
    } catch (e) {
      return new globalScope[workerConstructor]("data:application/javascript,".concat(encodeURIComponent(content)), workerOptions);
    }
  } catch (e) {
    if (!url) {
      throw Error("Inline worker is not supported");
    }

    return new globalScope[workerConstructor](url, workerOptions);
  }
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					result = fn();
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			247: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcactbot"] = self["webpackChunkcactbot"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [890], () => (__webpack_require__(838)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;