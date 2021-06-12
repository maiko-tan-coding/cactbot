(self["webpackChunkcactbot"] = self["webpackChunkcactbot"] || []).push([[727],{

/***/ 384:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ oopsy_manifest)
});

// EXTERNAL MODULE: ./resources/netregexes.ts
var netregexes = __webpack_require__(381);
// EXTERNAL MODULE: ./resources/zone_id.ts
var zone_id = __webpack_require__(438);
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/00-misc/buffs.js



// Abilities seem instant.
const abilityCollectSeconds = 0.5;
// Observation: up to ~1.2 seconds for a buff to roll through the party.
const effectCollectSeconds = 2.0;

// args: triggerId, netRegex, field, type, ignoreSelf
const missedFunc = (args) => {
  return {
    // Sure, not all of these are "buffs" per se, but they're all in the buffs file.
    id: 'Buff ' + args.triggerId,
    netRegex: args.netRegex,
    condition: (_evt, data, matches) => {
      const sourceId = matches.sourceId.toUpperCase();
      if (data.party.partyIds.includes(sourceId))
        return true;

      if (data.petIdToOwnerId) {
        const ownerId = data.petIdToOwnerId[sourceId];
        if (ownerId && data.party.partyIds.includes(ownerId))
          return true;
      }

      return false;
    },
    collectSeconds: args.collectSeconds,
    mistake: (_allEvents, data, allMatches) => {
      const partyNames = data.party.partyNames;

      // TODO: consider dead people somehow
      const gotBuffMap = {};
      for (const name of partyNames)
        gotBuffMap[name] = false;

      const firstMatch = allMatches[0];
      let sourceName = firstMatch.source;
      // Blame pet mistakes on owners.
      if (data.petIdToOwnerId) {
        const petId = firstMatch.sourceId.toUpperCase();
        const ownerId = data.petIdToOwnerId[petId];
        if (ownerId) {
          const ownerName = data.party.nameFromId(ownerId);
          if (ownerName)
            sourceName = ownerName;
          else
            console.error(`Couldn't find name for ${ownerId} from pet ${petId}`);
        }
      }

      if (args.ignoreSelf)
        gotBuffMap[sourceName] = true;

      const thingName = firstMatch[args.field];
      for (const matches of allMatches) {
        // In case you have multiple party members who hit the same cooldown at the same
        // time (lol?), then ignore anybody who wasn't the first.
        if (matches.source !== firstMatch.source)
          continue;

        gotBuffMap[matches.target] = true;
      }

      const missed = Object.keys(gotBuffMap).filter((x) => !gotBuffMap[x]);
      if (missed.length === 0)
        return;

      // TODO: oopsy could really use mouseover popups for details.
      // TODO: alternatively, if we have a death report, it'd be good to
      // explicitly call out that other people got a heal this person didn't.
      if (missed.length < 4) {
        return {
          type: args.type,
          blame: sourceName,
          text: {
            en: thingName + ' missed ' + missed.map((x) => data.ShortName(x)).join(', '),
            de: thingName + ' verfehlt ' + missed.map((x) => data.ShortName(x)).join(', '),
            fr: thingName + ' manqué(e) sur ' + missed.map((x) => data.ShortName(x)).join(', '),
            ja: '(' + missed.map((x) => data.ShortName(x)).join(', ') + ') が' + thingName + 'を受けなかった',
            cn: missed.map((x) => data.ShortName(x)).join(', ') + ' 没受到 ' + thingName,
            ko: thingName + ' ' + missed.map((x) => data.ShortName(x)).join(', ') + '에게 적용안됨',
          },
        };
      }
      // If there's too many people, just list the number of people missed.
      // TODO: we could also list everybody on separate lines?
      return {
        type: args.type,
        blame: sourceName,
        text: {
          en: thingName + ' missed ' + missed.length + ' people',
          de: thingName + ' verfehlte ' + missed.length + ' Personen',
          fr: thingName + ' manqué(e) sur ' + missed.length + ' personnes',
          ja: missed.length + '人が' + thingName + 'を受けなかった',
          cn: '有' + missed.length + '人没受到 ' + thingName,
          ko: thingName + ' ' + missed.length + '명에게 적용안됨',
        },
      };
    },
  };
};

const missedMitigationBuff = (args) => {
  if (!args.effectId)
    console.error('Missing effectId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: args.effectId }),
    field: 'effect',
    type: 'heal',
    ignoreSelf: args.ignoreSelf,
    collectSeconds: args.collectSeconds ? args.collectSeconds : effectCollectSeconds,
  });
};

const missedDamageAbility = (args) => {
  if (!args.abilityId)
    console.error('Missing abilityId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: netregexes/* default.ability */.Z.ability({ id: args.abilityId }),
    field: 'ability',
    type: 'damage',
    ignoreSelf: args.ignoreSelf,
    collectSeconds: args.collectSeconds ? args.collectSeconds : abilityCollectSeconds,
  });
};

const missedHeal = (args) => {
  if (!args.abilityId)
    console.error('Missing abilityId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: netregexes/* default.ability */.Z.ability({ id: args.abilityId }),
    field: 'ability',
    type: 'heal',
    collectSeconds: args.collectSeconds ? args.collectSeconds : abilityCollectSeconds,
  });
};

const missedMitigationAbility = missedHeal;

/* harmony default export */ const buffs = ({
  zoneId: zone_id/* default.MatchAll */.Z.MatchAll,
  triggers: [
    {
      id: 'Buff Pet To Owner Mapper',
      netRegex: netregexes/* default.addedCombatantFull */.Z.addedCombatantFull(),
      run: (_e, data, matches) => {
        if (matches.ownerId === '0')
          return;

        data.petIdToOwnerId = data.petIdToOwnerId || {};
        // Fix any lowercase ids.
        data.petIdToOwnerId[matches.id.toUpperCase()] = matches.ownerId.toUpperCase();
      },
    },
    {
      id: 'Buff Pet To Owner Clearer',
      netRegex: netregexes/* default.changeZone */.Z.changeZone(),
      run: (_e, data) => {
        // Clear this hash periodically so it doesn't have false positives.
        data.petIdToOwnerId = {};
      },
    },

    // Prefer abilities to effects, as effects take longer to roll through the party.
    // However, some things are only effects and so there is no choice.

    // For things you can step in or out of, give a longer timer?  This isn't perfect.
    // TODO: include soil here??
    missedMitigationBuff({ id: 'Collective Unconscious', effectId: '351', collectSeconds: 10 }),
    missedMitigationBuff({ id: 'Passage of Arms', effectId: '498', ignoreSelf: true, collectSeconds: 10 }),

    missedMitigationBuff({ id: 'Divine Veil', effectId: '2D7', ignoreSelf: true }),

    missedMitigationAbility({ id: 'Heart Of Light', abilityId: '3F20' }),
    missedMitigationAbility({ id: 'Dark Missionary', abilityId: '4057' }),
    missedMitigationAbility({ id: 'Shake It Off', abilityId: '1CDC' }),

    // 3F44 is the correct Quadruple Technical Finish, others are Dinky Technical Finish.
    missedDamageAbility({ id: 'Technical Finish', abilityId: '3F4[1-4]' }),
    missedDamageAbility({ id: 'Divination', abilityId: '40A8' }),
    missedDamageAbility({ id: 'Brotherhood', abilityId: '1CE4' }),
    missedDamageAbility({ id: 'Battle Litany', abilityId: 'DE5' }),
    missedDamageAbility({ id: 'Embolden', abilityId: '1D60' }),
    missedDamageAbility({ id: 'Battle Voice', abilityId: '76', ignoreSelf: true }),

    // Too noisy (procs every three seconds, and bards often off doing mechanics).
    // missedDamageBuff({ id: 'Wanderer\'s Minuet', effectId: '8A8', ignoreSelf: true }),
    // missedDamageBuff({ id: 'Mage\'s Ballad', effectId: '8A9', ignoreSelf: true }),
    // missedDamageBuff({ id: 'Army\'s Paeon', effectId: '8AA', ignoreSelf: true }),

    missedMitigationAbility({ id: 'Troubadour', abilityId: '1CED' }),
    missedMitigationAbility({ id: 'Tactician', abilityId: '41F9' }),
    missedMitigationAbility({ id: 'Shield Samba', abilityId: '3E8C' }),

    missedMitigationAbility({ id: 'Mantra', abilityId: '41' }),

    missedDamageAbility({ id: 'Devotion', abilityId: '1D1A' }),

    // Maybe using a healer LB1/LB2 should be an error for the healer. O:)
    // missedHeal({ id: 'Healing Wind', abilityId: 'CE' }),
    // missedHeal({ id: 'Breath of the Earth', abilityId: 'CF' }),

    missedHeal({ id: 'Medica', abilityId: '7C' }),
    missedHeal({ id: 'Medica II', abilityId: '85' }),
    missedHeal({ id: 'Afflatus Rapture', abilityId: '4096' }),
    missedHeal({ id: 'Temperance', abilityId: '751' }),
    missedHeal({ id: 'Plenary Indulgence', abilityId: '1D09' }),
    missedHeal({ id: 'Pulse of Life', abilityId: 'D0' }),

    missedHeal({ id: 'Succor', abilityId: 'BA' }),
    missedHeal({ id: 'Indomitability', abilityId: 'DFF' }),
    missedHeal({ id: 'Deployment Tactics', abilityId: 'E01' }),
    missedHeal({ id: 'Whispering Dawn', abilityId: '323' }),
    missedHeal({ id: 'Fey Blessing', abilityId: '40A0' }),
    missedHeal({ id: 'Consolation', abilityId: '40A3' }),
    missedHeal({ id: 'Angel\'s Whisper', abilityId: '40A6' }),
    missedMitigationAbility({ id: 'Fey Illumination', abilityId: '325' }),
    missedMitigationAbility({ id: 'Seraphic Illumination', abilityId: '40A7' }),
    missedHeal({ id: 'Angel Feathers', abilityId: '1097' }),

    missedHeal({ id: 'Helios', abilityId: 'E10' }),
    missedHeal({ id: 'Aspected Helios', abilityId: 'E11' }),
    missedHeal({ id: 'Aspected Helios', abilityId: '3200' }),
    missedHeal({ id: 'Celestial Opposition', abilityId: '40A9' }),
    missedHeal({ id: 'Astral Stasis', abilityId: '1098' }),

    missedHeal({ id: 'White Wind', abilityId: '2C8E' }),
    missedHeal({ id: 'Gobskin', abilityId: '4780' }),

    // TODO: export all of these missed functions into their own helper
    // and then add this to the Delubrum Reginae files directly.
    missedMitigationAbility({ id: 'Lost Aethershield', abilityId: '5753' }),
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/00-misc/general.js



// General mistakes; these apply everywhere.
/* harmony default export */ const general = ({
  zoneId: zone_id/* default.MatchAll */.Z.MatchAll,
  triggers: [
    {
      // Trigger id for internally generated early pull warning.
      id: 'General Early Pull',
    },
    {
      id: 'General Food Buff',
      // Well Fed
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '48' }),
      condition: (_e, _data, matches) => {
        // Prevent "Eos loses the effect of Well Fed from Critlo Mcgee"
        return matches.target === matches.source;
      },
      mistake: (_e, data, matches) => {
        data.lostFood = data.lostFood || {};
        // Well Fed buff happens repeatedly when it falls off (WHY),
        // so suppress multiple occurrences.
        if (!data.inCombat || data.lostFood[matches.target])
          return;
        data.lostFood[matches.target] = true;
        return {
          type: 'warn',
          blame: matches.target,
          text: {
            en: 'lost food buff',
            de: 'Nahrungsbuff verloren',
            fr: 'Buff nourriture terminée',
            ja: '飯効果が失った',
            cn: '失去食物BUFF',
            ko: '음식 버프 해제',
          },
        };
      },
    },
    {
      id: 'General Well Fed',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '48' }),
      run: (_e, data, matches) => {
        if (!data.lostFood)
          return;
        delete data.lostFood[matches.target];
      },
    },
    {
      id: 'General Rabbit Medium',
      abilityRegex: '8E0',
      condition: (e, data) => data.IsPlayerId(e.attackerId),
      mistake: (e) => {
        return {
          type: 'warn',
          blame: e.attackerName,
          text: {
            en: 'bunny',
            de: 'Hase',
            fr: 'lapin',
            ja: 'うさぎ',
            cn: '兔子',
            ko: '토끼',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/00-misc/test.js



// Test mistake triggers.
/* harmony default export */ const test = ({
  zoneId: zone_id/* default.MiddleLaNoscea */.Z.MiddleLaNoscea,
  triggers: [
    {
      id: 'Test Bow',
      netRegex: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: 'You bow courteously to the striking dummy.*?' }),
      netRegexFr: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: 'Vous vous inclinez devant le mannequin d\'entraînement.*?' }),
      netRegexJa: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: '.*は木人にお辞儀した.*?' }),
      netRegexCn: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: '.*恭敬地对木人行礼.*?' }),
      netRegexKo: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: '.*나무인형에게 공손하게 인사합니다.*?' }),
      mistake: (_e, data) => {
        return {
          type: 'pull',
          blame: data.me,
          fullText: {
            en: 'Bow',
            de: 'Bogen',
            fr: 'Saluer',
            ja: 'お辞儀',
            cn: '鞠躬',
            ko: '인사',
          },
        };
      },
    },
    {
      id: 'Test Wipe',
      netRegex: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: 'You bid farewell to the striking dummy.*?' }),
      netRegexFr: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: 'Vous faites vos adieux au mannequin d\'entraînement.*?' }),
      netRegexJa: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: '.*は木人に別れの挨拶をした.*?' }),
      netRegexCn: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: '.*向木人告别.*?' }),
      netRegexKo: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: '.*나무인형에게 작별 인사를 합니다.*?' }),
      mistake: (_e, data) => {
        return {
          type: 'wipe',
          blame: data.me,
          fullText: {
            en: 'Party Wipe',
            de: 'Gruppenwipe',
            fr: 'Party Wipe',
            ja: 'ワイプ',
            cn: '团灭',
            ko: '파티 전멸',
          },
        };
      },
    },
    {
      id: 'Test Bootshine',
      damageRegex: '35',
      condition: (e, data) => {
        if (e.attackerName !== data.me)
          return false;
        const strikingDummyNames = [
          'Striking Dummy',
          'Mannequin d\'entraînement',
          '木人', // Striking Dummy called `木人` in CN as well as JA
          '나무인형',
          // FIXME: add other languages here
        ];
        return strikingDummyNames.includes(e.targetName);
      },
      mistake: (e, data) => {
        data.bootCount = data.bootCount || 0;
        data.bootCount++;
        const text = e.abilityName + ' (' + data.bootCount + '): ' + e.damageStr;
        return { type: 'warn', blame: data.me, text: text };
      },
    },
    {
      id: 'Test Leaden Fist',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '745' }),
      condition: (_e, data, matches) => matches.source === data.me,
      mistake: (_e, data, matches) => {
        return { type: 'good', blame: data.me, text: matches.effect };
      },
    },
    {
      id: 'Test Oops',
      netRegex: netregexes/* default.echo */.Z.echo({ line: '.*oops.*' }),
      suppressSeconds: 10,
      mistake: (_e, data, matches) => {
        return { type: 'fail', blame: data.me, text: matches.line };
      },
    },
    {
      id: 'Test Poke',
      netRegex: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: 'You poke the striking dummy.*?' }),
      netRegexFr: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: 'Vous touchez légèrement le mannequin d\'entraînement du doigt.*?' }),
      netRegexJa: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: '.*は木人をつついた.*?' }),
      netRegexCn: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: '.*用手指戳向木人.*?' }),
      netRegexKo: netregexes/* default.gameNameLog */.Z.gameNameLog({ line: '.*나무인형을 쿡쿡 찌릅니다.*?' }),
      collectSeconds: 5,
      mistake: (events, data) => {
        // When collectSeconds is specified, events are passed as an array.
        const pokes = events.length;

        // 1 poke at a time is fine, but more than one inside of
        // collectSeconds is (OBVIOUSLY) a mistake.
        if (pokes <= 1)
          return;
        const text = {
          en: 'Too many pokes (' + pokes + ')',
          de: 'Zu viele Piekser (' + pokes + ')',
          fr: 'Trop de touches (' + pokes + ')',
          ja: 'いっぱいつついた (' + pokes + ')',
          cn: '戳太多下啦 (' + pokes + ')',
          ko: '너무 많이 찌름 (' + pokes + '번)',
        };
        return { type: 'fail', blame: data.me, text: text };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/ifrit-nm.js


// Ifrit Story Mode
/* harmony default export */ const ifrit_nm = ({
  zoneId: zone_id/* default.TheBowlOfEmbers */.Z.TheBowlOfEmbers,
  damageWarn: {
    'IfritNm Radiant Plume': '2DE',
  },
  triggers: [
    // Things that should only hit one person.
    {
      id: 'IfritNm Incinerate',
      damageRegex: '1C5',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'IfritNm Eruption',
      damageRegex: '2DD',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/levi-ex.js



// It's hard to capture the reflection abilities from Leviathan's Head and Tail if you use
// ranged physical attacks / magic attacks respectively, as the ability names are the
// ability you used and don't appear to show up in the log as normal "ability" lines.
// That said, dots still tick independently on both so it's likely that people will atack
// them anyway.

// TODO: Figure out why Dread Tide / Waterspout appear like shares (i.e. 0x16 id).
// Dread Tide = 823/824/825, Waterspout = 829

// Leviathan Extreme
/* harmony default export */ const levi_ex = ({
  zoneId: zone_id/* default.TheWhorleaterExtreme */.Z.TheWhorleaterExtreme,
  damageWarn: {
    'LeviEx Grand Fall': '82F', // very large circular aoe before spinny dives, applies heavy
    'LeviEx Hydro Shot': '748', // Wavespine Sahagin aoe that gives Dropsy effect
    'LeviEx Dreadstorm': '749', // Wavetooth Sahagin aoe that gives Hysteria effect
  },
  damageFail: {
    'LeviEx Body Slam': '82A', // levi slam that tilts the boat
    'LeviEx Spinning Dive 1': '88A', // levi dash across the boat with knockback
    'LeviEx Spinning Dive 2': '88B', // levi dash across the boat with knockback
    'LeviEx Spinning Dive 3': '82C', // levi dash across the boat with knockback
  },
  gainsEffectWarn: {
    'LeviEx Dropsy': '110', // standing in the hydro shot from the Wavespine Sahagin
  },
  gainsEffectFail: {
    'LeviEx Hysteria': '128', // standing in the dreadstorm from the Wavetooth Sahagin
  },
  triggers: [
    {
      id: 'LeviEx Body Slam Knocked Off',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '82A' }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/shiva-hm.js



// Shiva Hard
/* harmony default export */ const shiva_hm = ({
  zoneId: zone_id/* default.TheAkhAfahAmphitheatreHard */.Z.TheAkhAfahAmphitheatreHard,
  damageWarn: {
    // Large white circles.
    'ShivaHm Icicle Impact': '993',
    // Avoidable tank stun.
    'ShivaHm Glacier Bash': '9A1',
  },
  shareWarn: {
    // Knockback tank cleave.
    'ShivaHm Heavenly Strike': '9A0',
    // Hailstorm spread marker.
    'ShivaHm Hailstorm': '998',
  },
  shareFail: {
    // Tankbuster.  This is Shiva Hard mode, not Shiva Extreme.  Please!
    'ShivaHm Icebrand': '996',
  },
  triggers: [
    {
      id: 'ShivaHm Diamond Dust',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '98A' }),
      run: (data) => {
        data.seenDiamondDust = true;
      },
    },
    {
      id: 'ShivaHm Deep Freeze',
      // Shiva also uses ability 9A3 on you, but it has the untranslated name
      // 透明：シヴァ：凍結レクト：ノックバック用. So, use the effect instead for free translation.
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '1E7' }),
      condition: (_e, data) => {
        // The intermission also gets this effect, so only a mistake after that.
        // Unlike extreme, this has the same 20 second duration as the intermission.
        return data.seenDiamondDust;
      },
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/shiva-ex.js



// Shiva Extreme
/* harmony default export */ const shiva_ex = ({
  zoneId: zone_id/* default.TheAkhAfahAmphitheatreExtreme */.Z.TheAkhAfahAmphitheatreExtreme,
  damageWarn: {
    // Large white circles.
    'ShivaEx Icicle Impact': 'BEB',
    // "get in" aoe
    'ShivaEx Whiteout': 'BEC',
    // Avoidable tank stun.
    'ShivaEx Glacier Bash': 'BE9',
  },
  damageFail: {
    // 270 degree attack.
    'ShivaEx Glass Dance': 'BDF',
  },
  shareWarn: {
    // Hailstorm spread marker.
    'ShivaEx Hailstorm': 'BE2',
  },
  shareFail: {
    // Laser.  TODO: maybe blame the person it's on??
    'ShivaEx Avalanche': 'BE0',
  },
  triggers: [
    {
      // Party shared tank buster.
      id: 'ShivaEx Icebrand',
      damageRegex: 'BE1',
      condition: (e) => {
        // Should be shared with friends.
        return e.type === '15';
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'ShivaEx Deep Freeze',
      // Shiva also uses ability C8A on you, but it has the untranslated name
      // 透明：シヴァ：凍結レクト：ノックバック用/ヒロイック. So, use the effect instead for free translation.
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '1E7' }),
      condition: (_e, _data, matches) => {
        // The intermission also gets this effect, but for a shorter duration.
        return parseFloat(matches.duration) > 20;
      },
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/titan-hm.js


// Titan Hard
/* harmony default export */ const titan_hm = ({
  zoneId: zone_id/* default.TheNavelHard */.Z.TheNavelHard,
  damageWarn: {
    'TitanHm Weight Of The Land': '553',
    'TitanHm Burst': '41C',
  },
  damageFail: {
    'TitanHm Landslide': '554',
  },
  shareWarn: {
    'TitanHm Rock Buster': '550',
  },
  shareFail: {
    'TitanHm Mountain Buster': '283',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/titan-ex.js


// Titan Extreme
/* harmony default export */ const titan_ex = ({
  zoneId: zone_id/* default.TheNavelExtreme */.Z.TheNavelExtreme,
  damageWarn: {
    'TitanEx Weight Of The Land': '5BE',
    'TitanEx Burst': '5BF',
  },
  damageFail: {
    'TitanEx Landslide': '5BB',
    'TitanEx Gaoler Landslide': '5C3',
  },
  shareWarn: {
    'TitanEx Rock Buster': '5B7',
  },
  shareFail: {
    'TitanEx Mountain Buster': '5B8',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/alliance/weeping_city.js



/* harmony default export */ const weeping_city = ({
  zoneId: zone_id/* default.TheWeepingCityOfMhach */.Z.TheWeepingCityOfMhach,
  damageWarn: {
    'Weeping Critical Bite': '1848', // Sarsuchus cone aoe
    'Weeping Realm Shaker': '183E', // First Daughter circle aoe
    'Weeping Silkscreen': '183C', // First Daughter line aoe
    'Weeping Silken Spray': '1824', // Arachne Eve rear conal aoe
    'Weeping Tremblor 1': '1837', // Arachne Eve disappear circle aoe 1
    'Weeping Tremblor 2': '1836', // Arachne Eve disappear circle aoe 2
    'Weeping Tremblor 3': '1835', // Arachne Eve disappear circle aoe 3
    'Weeping Spider Thread': '1839', // Arachne Eve spider line aoe
    'Weeping Fire II': '184E', // Black Mage Corpse circle aoe
    'Weeping Necropurge': '17D7', // Forgall Shriveled Talon line aoe
    'Weeping Rotten Breath': '17D0', // Forgall Dahak cone aoe
    'Weeping Mow': '17D2', // Forgall Haagenti unmarked cleave
    'Weeping Dark Eruption': '17C3', // Forgall puddle marker
    // 1806 is also Flare Star, but if you get by 1805 you also get hit by 1806?
    'Weeping Flare Star': '1805', // Ozma cube phase donut
    'Weeping Execration': '1829', // Ozma triangle laser
    'Weeping Haircut 1': '180B', // Calofisteri 180 cleave 1
    'Weeping Haircut 2': '180F', // Calofisteri 180 cleave 2
    'Weeping Entanglement': '181D', // Calofisteri landmine puddle proc
    'Weeping Evil Curl': '1816', // Calofisteri axe
    'Weeping Evil Tress': '1817', // Calofisteri bulb
    'Weeping Depth Charge': '1820', // Calofisteri charge to edge
    'Weeping Feint Particle Beam': '1928', // Calofisteri sky laser
    'Weeping Evil Switch': '1815', // Calofisteri lasers
  },
  shareWarn: {
    'Weeping Arachne Web': '185E', // Arachne Eve headmarker web aoe
    'Weeping Earth Aether': '1841', // Arachne Eve orbs
    'Weeping Epigraph': '1852', // Headstone untelegraphed laser line tank attack
    // This is too noisy.  Better to pop the balloons than worry about friends.
    // 'Weeping Explosion': '1807', // Ozmasphere Cube orb explosion
    'Weeping Split End 1': '180C', // Calofisteri tank cleave 1
    'Weeping Split End 2': '1810', // Calofisteri tank cleave 2
    'Weeping Bloodied Nail': '181F', // Calofisteri axe/bulb appearing
  },
  gainsEffectWarn: {
    'Weeping Hysteria': '128', // Arachne Eve Frond Affeard
    'Weeping Zombification': '173', // Forgall too many zombie puddles
    'Weeping Toad': '1B7', // Forgall Brand of the Fallen failure
    'Weeping Doom': '38E', // Forgall Haagenti Mortal Ray
    'Weeping Assimilation': '42C', // Ozmashade Assimilation look-away
    'Weeping Stun': '95', // Calofisteri Penetration look-away
  },
  triggers: [
    {
      id: 'Weeping Forgall Gradual Zombification Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '415' }),
      run: (_e, data, matches) => {
        data.zombie = data.zombie || {};
        data.zombie[matches.target] = true;
      },
    },
    {
      id: 'Weeping Forgall Gradual Zombification Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '415' }),
      run: (_e, data, matches) => {
        data.zombie = data.zombie || {};
        data.zombie[matches.target] = false;
      },
    },
    {
      id: 'Weeping Forgall Mega Death',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '17CA' }),
      condition: (_e, data, matches) => data.zombie && !data.zombie[matches.target],
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'Weeping Headstone Shield Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '15E' }),
      run: (_e, data, matches) => {
        data.shield = data.shield || {};
        data.shield[matches.target] = true;
      },
    },
    {
      id: 'Weeping Headstone Shield Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '15E' }),
      run: (_e, data, matches) => {
        data.shield = data.shield || {};
        data.shield[matches.target] = false;
      },
    },
    {
      id: 'Weeping Flaring Epigraph',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '1856' }),
      condition: (_e, data, matches) => data.shield && !data.shield[matches.target],
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
    {
      // This ability name is helpfully called "Attack" so name it something else.
      id: 'Weeping Ozma Tank Laser',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '1831' }),
      condition: (e) => e.type !== '15',
      mistake: (_e, _data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          text: {
            en: 'Tank Laser',
            de: 'Tank Laser',
            fr: 'Tank Laser',
            ja: 'タンクレザー',
            cn: '坦克激光',
            ko: '탱커 레이저',
          },
        };
      },
    },
    {
      id: 'Weeping Ozma Holy',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '182E' }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Slid off!',
            de: 'ist runtergerutscht!',
            fr: 'A glissé(e) !',
            ja: 'ノックバック',
            cn: '击退！',
            ko: '넉백됨!',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/dungeon/aetherochemical_research_facility.js



// Aetherochemical Research Facility
/* harmony default export */ const aetherochemical_research_facility = ({
  zoneId: zone_id/* default.TheAetherochemicalResearchFacility */.Z.TheAetherochemicalResearchFacility,
  damageWarn: {
    'ARF Grand Sword': '216', // Conal AoE, Scrambled Iron Giant trash
    'ARF Cermet Drill': '20E', // Line AoE, 6th Legion Magitek Vanguard trash
    'ARF Magitek Slug': '10DB', // Line AoE, boss 1
    'ARF Aetherochemical Grenado': '10E2', // Large targeted circle AoE, Magitek Turret II, boss 1
    'ARF Magitek Spread': '10DC', // 270-degree roomwide AoE, boss 1
    'ARF Eerie Soundwave': '1170', // Targeted circle AoE, Cultured Empusa trash, before boss 2
    'ARF Tail Slap': '125F', // Conal AoE, Cultured Dancer trash, before boss 2
    'ARF Calcifying Mist': '123A', // Conal AoE, Cultured Naga trash, before boss 2
    'ARF Puncture': '1171', // Short line AoE, Cultured Empusa trash, before boss 2
    'ARF Sideswipe': '11A7', // Conal AoE, Cultured Reptoid trash, before boss 2
    'ARF Gust': '395', // Targeted small circle AoE, Cultured Mirrorknight trash, before boss 2
    'ARF Marrow Drain': 'D0E', // Conal AoE, Cultured Chimera trash, before boss 2
    'ARF Riddle Of The Sphinx': '10E4', // Targeted circle AoE, boss 2
    'ARF Ka': '106E', // Conal AoE, boss 2
    'ARF Rotoswipe': '11CC', // Conal AoE, Facility Dreadnought trash, before boss 3
    'ARF Auto-cannons': '12D9', // Line AoE, Monitoring Drone trash, before boss 3
    'ARF Death\'s Door': '4EC', // Line AoE, Cultured Shabti trash, before boss 3
    'ARF Spellsword': '4EB', // Conal AoE, Cultured Shabti trash, before boss 3
    'ARF End Of Days': '10FD', // Line AoE, boss 3
    'ARF Blizzard Burst': '10FE', // Fixed circle AoEs, Igeyorhm, boss 3
    'ARF Fire Burst': '10FF', // Fixed circle AoEs, Lahabrea, boss 3
    'ARF Sea Of Pitch': '12DE', // Targeted persistent circle AoEs, boss 3
    'ARF Dark Blizzard II': '10F3', // Random circle AoEs, Igeyorhm, boss 3
    'ARF Dark Fire II': '10F8', // Random circle AoEs, Lahabrea, boss 3
    'ARF Ancient Eruption': '1104', // Self-targeted circle AoE, boss 4
    'ARF Entropic Flame': '1108', // Line AoEs,  boss 4
  },
  shareWarn: {
    'ARF Chthonic Hush': '10E7', // Instant tank cleave, boss 2
    'ARF Height Of Chaos': '1101', // Tank cleave, boss 4
    'ARF Ancient Circle': '1102', // Targeted donut AoEs, boss 4
  },
  triggers: [
    {
      id: 'ARF Petrifaction',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '01' }),
      mistake: (e) => {
        return { type: 'warn', blame: e.target, text: e.effect };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/dungeon/fractal_continuum.js


// Fractal Continuum
/* harmony default export */ const fractal_continuum = ({
  zoneId: zone_id/* default.TheFractalContinuum */.Z.TheFractalContinuum,
  damageWarn: {
    'Fractal Double Sever': 'F7D', // Conals, boss 1
    'Fractal Aetheric Compression': 'F80', // Ground AoE circles, boss 1
    'Fractal 11-Tonze Swipe': 'F81', // Frontal cone, boss 2
    'Fractal 10-Tonze Slash': 'F83', // Frontal line, boss 2
    'Fractal 111-Tonze Swing': 'F87', // Get-out AoE, boss 2
    'Fractal Broken Glass': 'F8E', // Glowing panels, boss 3
    'Fractal Mines': 'F90',
    'Fractal Seed of the Rivers': 'F91', // Ground AoE circles, boss 3
  },
  shareWarn: {
    'Fractal Sanctification': 'F89', // Instant conal buster, boss 3
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/dungeon/gubal_library_hard.js



/* harmony default export */ const gubal_library_hard = ({
  zoneId: zone_id/* default.TheGreatGubalLibraryHard */.Z.TheGreatGubalLibraryHard,
  damageWarn: {
    'GubalHm Terror Eye': '930', // Circle AoE, Spine Breaker trash
    'GubalHm Batter': '198A', // Circle AoE, trash before boss 1
    'GubalHm Condemnation': '390', // Conal AoE, Bibliovore trash
    'GubalHm Discontinue 1': '1943', // Falling book shadow, boss 1
    'GubalHm Discontinue 2': '1940', // Rush AoE from ends, boss 1
    'GubalHm Discontinue 3': '1942', // Rush AoE across, boss 1
    'GubalHm Frightful Roar': '193B', // Get-Out AoE, boss 1
    'GubalHm Issue 1': '193D', // Initial end book warning AoE, boss 1
    'GubalHm Issue 2': '193F', // Initial end book warning AoE, boss 1
    'GubalHm Issue 3': '1941', // Initial side book warning AoE, boss 1
    'GubalHm Desolation': '198C', // Line AoE, Biblioclast trash
    'GubalHm Double Smash': '26A', // Conal AoE, Biblioclast trash
    'GubalHm Darkness': '3A0', // Conal AoE, Inkstain trash
    'GubalHm Firewater': '3BA', // Circle AoE, Biblioclast trash
    'GubalHm Elbow Drop': 'CBA', // Conal AoE, Biblioclast trash
    'GubalHm Dark': '19DF', // Large circle AoE, Inkstain trash
    'GubalHm Seals': '194A', // Sun/Moonseal failure, boss 2
    'GubalHm Water III': '1C67', // Large circle AoE, Porogo Pegist trash
    'GubalHm Raging Axe': '1703', // Small conal AoE, Mechanoservitor trash
    'GubalHm Magic Hammer': '1990', // Large circle AoE, Apanda mini-boss
    'GubalHm Properties Of Gravity': '1950', // Circle AoE from gravity puddles, boss 3
    'GubalHm Properties Of Levitation': '194F', // Circle AoE from levitation puddles, boss 3
    'GubalHm Comet': '1969', // Small circle AoE, intermission, boss 3
  },
  damageFail: {
    'GubalHm Ecliptic Meteor': '195C', // LoS mechanic, boss 3
  },
  shareWarn: {
    'GubalHm Searing Wind': '1944', // Tank cleave, boss 2
    'GubalHm Thunder': '19[AB]', // Spread marker, boss 3
  },
  triggers: [
    {
      // Fire gate in hallway to boss 2, magnet failure on boss 2
      id: 'GubalHm Burns',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '10B' }),
      mistake: (e) => {
        return { type: 'warn', blame: e.target, text: e.effect };
      },
    },
    {
      // Helper for Thunder 3 failures
      id: 'GubalHm Imp Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '46E' }),
      run: (_e, data, matches) => {
        data.hasImp = data.hasImp || {};
        data.hasImp[matches.target] = true;
      },
    },
    {
      id: 'GubalHm Imp Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '46E' }),
      run: (_e, data, matches) => {
        data.hasImp = data.hasImp || {};
        data.hasImp[matches.target] = false;
      },
    },
    {
      // Targets with Imp when Thunder III resolves receive a vulnerability stack and brief stun
      id: 'GubalHm Imp Thunder',
      damageRegex: '195[AB]',
      condition: (e, data) => data.hasImp[e.targetName],
      mistake: (e) => {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'Shocked Imp',
            de: 'Schockierter Imp',
            ja: 'カッパを解除しなかった',
            cn: '河童状态吃了暴雷',
          },
        };
      },
    },
    {
      id: 'GubalHm Quake',
      damageRegex: '1956',
      condition: (e) => {
        // Always hits target, but if correctly resolved will deal 0 damage
        return e.damage > 0;
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'GubalHm Tornado',
      damageRegex: '195[78]',
      condition: (e) => {
        // Always hits target, but if correctly resolved will deal 0 damage
        return e.damage > 0;
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/dungeon/sohm_al_hard.js



/* harmony default export */ const sohm_al_hard = ({
  zoneId: zone_id/* default.SohmAlHard */.Z.SohmAlHard,
  damageWarn: {
    'SohmAlHm Deadly Vapor': '1DC9', // Environmental circle AoEs
    'SohmAlHm Deeproot': '1CDA', // Targeted circle AoE, Blooming Chichu trash
    'SohmAlHm Odious Air': '1CDB', // Conal AoE, Blooming Chichu trash
    'SohmAlHm Glorious Blaze': '1C33', // Circle AoE, Small Spore Sac, boss 1
    'SohmAlHm Foul Waters': '118A', // Conal AoE, Mountaintop Opken trash
    'SohmAlHm Plain Pound': '1187', // Targeted circle AoE, Mountaintop Hropken trash
    'SohmAlHm Palsynyxis': '1161', // Conal AoE, Overgrown Difflugia trash
    'SohmAlHm Surface Breach': '1E80', // Circle AoE, Giant Netherworm trash
    'SohmAlHm Freshwater Cannon': '119F', // Line AoE, Giant Netherworm trash
    'SohmAlHm Tail Smash': '1C35', // Untelegraphed rear conal AoE, Gowrow, boss 2
    'SohmAlHm Tail Swing': '1C36', // Untelegraphed circle AoE, Gowrow, boss 2
    'SohmAlHm Ripper Claw': '1C37', // Untelegraphed frontal AoE, Gowrow, boss 2
    'SohmAlHm Wind Slash': '1C38', // Circle AoE, Gowrow, boss 2
    'SohmAlHm Wild Charge': '1C39', // Dash attack, Gowrow, boss 2
    'SohmAlHm Hot Charge': '1C3A', // Dash attack, Gowrow, boss 2
    'SohmAlHm Fireball': '1C3B', // Untelegraphed targeted circle AoE, Gowrow, boss 2
    'SohmAlHm Lava Flow': '1C3C', // Untelegraphed conal AoE, Gowrow, boss 2
    'SohmAlHm Wild Horn': '1507', // Conal AoE, Abalathian Clay Golem trash
    'SohmAlHm Lava Breath': '1C4D', // Conal AoE, Lava Crab trash
    'SohmAlHm Ring of Fire': '1C4C', // Targeted circle AoE, Volcano Anala trash
    'SohmAlHm Molten Silk 1': '1C43', // 270-degree frontal AoE, Lava Scorpion, boss 3
    'SohmAlHm Molten Silk 2': '1C44', // 270-degree rear AoE, Lava Scorpion, boss 3
    'SohmAlHm Molten Silk 3': '1C42', // Ring AoE, Lava Scorpion, boss 3
    'SohmAlHm Realm Shaker': '1C41', // Circle AoE, Lava Scorpion, boss 3
  },
  triggers: [
    {
      // Warns if players step into the lava puddles. There is unfortunately no direct damage event.
      id: 'SohmAlHm Burns',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '11C' }),
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/raid/a12n.js



/* harmony default export */ const a12n = ({
  zoneId: zone_id/* default.AlexanderTheSoulOfTheCreator */.Z.AlexanderTheSoulOfTheCreator,
  damageWarn: {
    'A12N Sacrament': '1AE6', // Cross Lasers
    'A12N Gravitational Anomaly': '1AEB', // Gravity Puddles
  },
  shareWarn: {
    'A12N Divine Spear': '1AE3', // Instant conal tank cleave
    'A12N Blazing Scourge': '1AE9', // Orange head marker splash damage
    'A12N Plaint Of Severity': '1AF1', // Aggravated Assault splash damage
    'A12N Communion': '1AFC', // Tether Puddles
  },
  triggers: [
    {
      id: 'A12N Assault Collect',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '461' }),
      run: (_e, data, matches) => {
        data.assault = data.assault || [];
        data.assault.push(matches.target);
      },
    },
    {
      // It is a failure for a Severity marker to stack with the Solidarity group.
      id: 'A12N Assault Failure',
      damageRegex: '1AF2',
      condition: (_e, data, matches) => data.assault.includes(matches.target),
      mistake: (_e, _data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: 'Didn\'t Spread!',
            de: 'Nicht verteilt!',
            fr: 'Ne s\'est pas dispersé(e) !',
            ja: '散開しなかった!',
            cn: '没有散开!',
          },
        };
      },
    },
    {
      id: 'A12N Assault Cleanup',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '461' }),
      suppressSeconds: 5,
      delaySeconds: 20,
      run: (_e, data) => {
        delete data.assault;
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/ala_mhigo.js



/* harmony default export */ const ala_mhigo = ({
  zoneId: zone_id/* default.AlaMhigo */.Z.AlaMhigo,
  damageWarn: {
    'Ala Mhigo Magitek Ray': '24CE', // Line AoE, Legion Predator trash, before boss 1
    'Ala Mhigo Lock On': '2047', // Homing circles, boss 1
    'Ala Mhigo Tail Laser 1': '2049', // Frontal line AoE, boss 1
    'Ala Mhigo Tail Laser 2': '204B', // Rear line AoE, boss 1
    'Ala Mhigo Tail Laser 3': '204C', // Rear line AoE, boss 1
    'Ala Mhigo Shoulder Cannon': '24D0', // Circle AoE, Legion Avenger trash, before boss 2
    'Ala Mhigo Cannonfire': '23ED', // Environmental circle AoE, path to boss 2
    'Ala Mhigo Aetherochemical Grenado': '205A', // Circle AoE, boss 2
    'Ala Mhigo Integrated Aetheromodulator': '205B', // Ring AoE, boss 2
    'Ala Mhigo Circle Of Death': '24D4', // Proximity circle AoE, Hexadrone trash, before boss 3
    'Ala Mhigo Exhaust': '24D3', // Line AoE, Legion Colossus trash, before boss 3
    'Ala Mhigo Grand Sword': '24D2', // Conal AoE, Legion Colossus trash, before boss 3
    'Ala Mhigo Art Of The Storm 1': '2066', // Proximity circle AoE, pre-intermission, boss 3
    'Ala Mhigo Art Of The Storm 2': '2587', // Proximity circle AoE, intermission, boss 3
    'Ala Mhigo Vein Splitter 1': '24B6', // Proximity circle AoE, primary entity, boss 3
    'Ala Mhigo Vein Splitter 2': '206C', // Proximity circle AoE, helper entity, boss 3
    'Ala Mhigo Lightless Spark': '206B', // Conal AoE, boss 3
  },
  shareWarn: {
    'Ala Mhigo Demimagicks': '205E',
    'Ala Mhigo Unmoving Troika': '2060',
    'Ala Mhigo Art Of The Sword 1': '2069',
    'Ala Mhigo Art Of The Sword 2': '2589',
  },
  triggers: [
    {
      // It's possible players might just wander into the bad on the outside,
      // but normally people get pushed into it.
      id: 'Ala Mhigo Art Of The Swell',
      // Damage Down
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '2B8' }),
      mistake: (e) => {
        return { type: 'warn', blame: e.target, text: e.effect };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/bardams_mettle.js



// Bardam's Mettle


// For reasons not completely understood at the time this was merged,
// but likely related to the fact that no nameplates are visible during the encounter,
// and that nothing in the encounter actually does damage,
// we can't use damageWarn or gainsEffect helpers on the Bardam fight.
// Instead, we use this helper function to look for failure flags.
// If the flag is present,a full trigger object is returned that drops in seamlessly.
const abilityWarn = (args) => {
  if (!args.abilityId)
    console.error('Missing ability ' + JSON.stringify(args));
  return {
    id: args.id,
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({ id: args.abilityId }),
    condition: (_e, _data, matches) => matches.flags.substr(-2) === '0E',
    mistake: (_e, _data, matches) => {
      return { type: 'warn', blame: matches.target, text: matches.ability };
    },
  };
};

/* harmony default export */ const bardams_mettle = ({
  zoneId: zone_id/* default.BardamsMettle */.Z.BardamsMettle,
  damageWarn: {
    'Bardam Dirty Claw': '21A8', // Frontal cleave, Gulo Gulo trash
    'Bardam Epigraph': '23AF', // Line AoE, Wall of Bardam trash
    'Bardam The Dusk Star': '2187', // Circle AoE, environment before first boss
    'Bardam The Dawn Star': '2186', // Circle AoE, environment before first boss
    'Bardam Crumbling Crust': '1F13', // Circle AoEs, Garula, first boss
    'Bardam Ram Rush': '1EFC', // Line AoEs, Steppe Yamaa, first boss.
    'Bardam Lullaby': '24B2', // Circle AoEs, Steppe Sheep, first boss.
    'Bardam Heave': '1EF7', // Frontal cleave, Garula, first boss
    'Bardam Wide Blaster': '24B3', // Enormous frontal cleave, Steppe Coeurl, first boss
    'Bardam Double Smash': '26A', // Circle AoE, Mettling Dhara trash
    'Bardam Transonic Blast': '1262', // Circle AoE, Steppe Eagle trash
    'Bardam Wild Horn': '2208', // Frontal cleave, Khun Gurvel trash
    'Bardam Heavy Strike 1': '2578', // 1 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Heavy Strike 2': '2579', // 2 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Heavy Strike 3': '257A', // 3 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Tremblor 1': '257B', // 1 of 2 concentric ring AoEs, Bardam, second boss
    'Bardam Tremblor 2': '257C', // 2 of 2 concentric ring AoEs, Bardam, second boss
    'Bardam Throwing Spear': '257F', // Checkerboard AoE, Throwing Spear, second boss
    'Bardam Bardam\'s Ring': '2581', // Donut AoE headmarkers, Bardam, second boss
    'Bardam Comet': '257D', // Targeted circle AoEs, Bardam, second boss
    'Bardam Comet Impact': '2580', // Circle AoEs, Star Shard, second boss
    'Bardam Iron Sphere Attack': '16B6', // Contact damage, Iron Sphere trash, before third boss
    'Bardam Tornado': '247E', // Circle AoE, Khun Shavara trash
    'Bardam Pinion': '1F11', // Line AoE, Yol Feather, third boss
    'Bardam Feather Squall': '1F0E', // Dash attack, Yol, third boss
    'Bardam Flutterfall Untargeted': '1F12', // Rotating circle AoEs, Yol, third boss
  },
  shareWarn: {
    'Bardam Garula Rush': '1EF9', // Line AoE, Garula, first boss.
    'Bardam Flutterfall Targeted': '1F0C', // Circle AoE headmarker, Yol, third boss
    'Bardam Wingbeat': '1F0F', // Conal AoE headmarker, Yol, third boss
  },
  gainsEffectWarn: {
    'Bardam Confused': '0B', // Failed gaze attack, Yol, third boss
  },
  gainsEffectFail: {
    'Bardam Fetters': '56F', // Failing two mechanics in any one phase on Bardam, second boss.
  },
  triggers: [
    // 1 of 3 270-degree ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Heavy Strike 1', abilityId: '2578' }),
    // 2 of 3 270-degree ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Heavy Strike 2', abilityId: '2579' }),
    // 3 of 3 270-degree ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Heavy Strike 3', abilityId: '257A' }),
    // 1 of 2 concentric ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Tremblor 1', abilityId: '257B' }),
    // 2 of 2 concentric ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Tremblor 2', abilityId: '257C' }),
    // Checkerboard AoE, Throwing Spear, second boss
    abilityWarn({ id: 'Bardam Throwing Spear', abilityId: '257F' }),
    // Gaze attack, Warrior of Bardam, second boss
    abilityWarn({ id: 'Bardam Empty Gaze', abilityId: '1F04' }),
    // Donut AoE headmarkers, Bardam, second boss
    abilityWarn({ id: 'Bardam\'s Ring', abilityId: '2581' }),
    // Targeted circle AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Comet', abilityId: '257D' }),
    // Circle AoEs, Star Shard, second boss
    abilityWarn({ id: 'Bardam Comet Impact', abilityId: '2580' }),
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/kugane_castle.js



/* harmony default export */ const kugane_castle = ({
  zoneId: zone_id/* default.KuganeCastle */.Z.KuganeCastle,
  damageWarn: {
    'Kugane Castle Tenka Gokken': '2329', // Frontal cone AoE,  Joi Blade trash, before boss 1
    'Kugane Castle Kenki Release Trash': '2330', // Chariot AoE, Joi Kiyofusa trash, before boss 1

    'Kugane Castle Clearout': '1E92', // Frontal cone AoE, Zuiko-Maru, boss 1
    'Kugane Castle Hara-Kiri 1': '1E96', // Giant circle AoE, Harakiri Kosho, boss 1
    'Kugane Castle Hara-Kiri 2': '24F9', // Giant circle AoE, Harakiri Kosho, boss 1

    'Kugane Castle Juji Shuriken 1': '232D', // Line AoE, Karakuri Onmitsu trash, before boss 2
    'Kugane Castle 1000 Barbs': '2198', // Line AoE, Joi Koja trash, before boss 2

    'Kugane Castle Juji Shuriken 2': '1E98', // Line AoE, Dojun Maru, boss 2
    'Kugane Castle Tatami-Gaeshi': '1E9D', // Floor tile line attack, Elkite Onmitsu, boss 2
    'Kugane Castle Juji Shuriken 3': '1EA0', // Line AoE, Elite Onmitsu, boss 2

    'Kugane Castle Auto Crossbow': '2333', // Frontal cone AoE, Karakuri Hanya trash, after boss 2
    'Kugane Castle Harakiri 3': '23C9', // Giant Circle AoE, Harakiri  Hanya trash, after boss 2

    'Kugane Castle Iai-Giri': '1EA2', // Chariot AoE, Yojimbo, boss 3
    'Kugane Castle Fragility': '1EAA', // Chariot AoE, Inoshikacho, boss 3
    'Kugane Castle Dragonfire': '1EAB', // Line AoE, Dragon Head, boss 3
  },

  shareWarn: {
    'Kugane Castle Issen': '1E97', // Instant frontal cleave, Dojun Maru, boss 2
    'Kugane Castle Clockwork Raiton': '1E9B', // Large lightning spread circles, Dojun Maru, boss 2
  },
  triggers: [
    {
      // Stack marker, Zuiko Maru, boss 1
      id: 'Kugane Castle Helm Crack',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '1E94' }),
      condition: (_e, _data, matches) => matches.type === '21', // Taking the stack solo is *probably* a mistake.
      mistake: (_e, _data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (alone)`,
            de: `${matches.ability} (allein)`,
            fr: `${matches.ability} (seul(e))`,
            ja: `${matches.ability} (一人)`,
            cn: `${matches.ability} (单吃)`,
            ko: `${matches.ability} (혼자 맞음)`,
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/st_mocianne_hard.js


/* harmony default export */ const st_mocianne_hard = ({
  zoneId: zone_id/* default.SaintMociannesArboretumHard */.Z.SaintMociannesArboretumHard,
  damageWarn: {
    'St Mocianne Hard Mudstream': '30D9', // Targeted circle AoE, Immaculate Apa trash, before boss 1
    'St Mocianne Hard Silken Spray': '3385', // Rear cone AoE, Withered Belladonna trash, before boss 1
    'St Mocianne Hard Muddy Puddles': '30DA', // Small targeted circle AoEs, Dorpokkur trash, before boss 1
    'St Mocianne Hard Odious Air': '2E49', // Frontal cone AoE, Nullchu, boss 1
    'St Mocianne Hard SLudge Bomb': '2E4E', // Targeted circle AoEs, Nullchu, boss 1
    'St Mocianne Hard Odious Atmosphere': '2E51', // Channeled 3/4 arena cleave, Nullchu, boss 1
    'St Mocianne Hard Creeping Ivy': '31A5', // Frontal cone AoE, Withered Kulak trash, before boss 2
    'St Mocianne Hard Rockslide': '3134', // Line AoE, Silt Golem, boss 2
    'St Mocianne Hard Earthquake Inner': '312E', // Chariot AoE, Lakhamu, boss 2
    'St Mocianne Hard Earthquake Outer': '312F', // Dynamo AoE, Lakhamu, boss 2
    'St Mocianne Hard Embalming Earth': '31A6', // Large Chariot AoE, Muddy Mata, after boss 2
    'St Mocianne Hard Quickmire': '3136', // Sewage surge avoided on platforms, Tokkapchi, boss 3
    'St Mocianne Hard Quagmire Platforms': '3139', // Quagmire explosion on platforms, Tokkapchi, boss 3
    'St Mocianne Hard Feculent Flood': '313C', // Targeted thin cone AoE, Tokkapchi, boss 3
    'St Mocianne Hard Corrupture': '33A0', // Mud Slime explosion, boss 3. (No explosion if done correctly.)
  },
  shareWarn: {
    'St Mocianne Hard Taproot': '2E4C', // Large orange spread circles, Nullchu, boss 1
    'St Mocianne Hard Earth Shaker': '3131', // Earth Shaker, Lakhamu, boss 2
  },
  gainsEffectWarn: {
    'St Mocianne Hard Seduced': '3DF', // Gaze failure, Withered Belladonna trash, before boss 1
    'St Mocianne Hard Pollen': '13', // Sludge puddles, Nullchu, boss 1
    'St Mocianne Hard Transfiguration': '648', // Roly-Poly AoE circle failure, BLooming Biloko trash, before boss 2
    'St Mocianne Hard Hysteria': '128', // Gaze failure, Lakhamu, boss 2
    'St Mocianne Hard Stab Wound': '45D', // Arena outer wall effect, boss 2
  },
  triggers: [
    {
      // Stack marker, Nullchu, boss 1
      id: 'St Mocianne Hard Fault Warren',
      damageRegex: '2E4A',
      condition: (e) => e.type === '15', // Taking the stack solo is *probably* a mistake.
      mistake: (_e, _data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (alone)`,
            de: `${matches.ability} (allein)`,
            fr: `${matches.ability} (seul(e))`,
            ja: `${matches.ability} (一人)`,
            cn: `${matches.ability} (单吃)`,
            ko: `${matches.ability} (혼자 맞음)`,
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/swallows_compass.js



/* harmony default export */ const swallows_compass = ({
  zoneId: zone_id/* default.TheSwallowsCompass */.Z.TheSwallowsCompass,
  damageWarn: {
    'Swallows Compass Ivy Fetters': '2C04', // Circle ground AoE, Sai Taisui trash, before boss 1
    'Swallows Compass Wildswind 1': '2C05', // Tornado ground AoE, placed by Sai Taisui trash, before boss 1

    'Swallows Compass Yama-Kagura': '2B96', // Frontal line AoE, Otengu, boss 1
    'Swallows Compass Flames Of Hate': '2B98', // Fire orb explosions, boss 1
    'Swallows Compass Conflagrate': '2B99', // Collision with fire orb, boss 1

    'Swallows Compass Upwell': '2C06', // Targeted circle ground AoE, Sai Taisui trash, before boss 2
    'Swallows Compass Bad Breath': '2C07', // Frontal cleave, Jinmenju trash, before boss 2

    'Swallows Compass Greater Palm 1': '2B9D', // Half arena right cleave, Daidarabotchi, boss 2
    'Swallows Compass Greater Palm 2': '2B9E', // Half arena left cleave, Daidarabotchi, boss 2
    'Swallows Compass Tributary': '2BA0', // Targeted thin conal ground AoEs, Daidarabotchi, boss 2

    'Swallows Compass Wildswind 2': '2C06', // Circle ground AoE, environment, after boss 2
    'Swallows Compass Wildswind 3': '2C07', // Circle ground AoE, placed by Sai Taisui trash, after boss 2
    'Swallows Compass Filoplumes': '2C76', // Frontal rectangle AoE, Dragon Bi Fang trash, after boss 2

    'Swallows Compass Both Ends 1': '2BA8', // Chariot AoE, Qitian Dasheng, boss 3
    'Swallows Compass Both Ends 2': '2BA9', // Dynamo AoE, Qitian Dasheng, boss 3
    'Swallows Compass Both Ends 3': '2BAE', // Chariot AoE, Shadow Of The Sage, boss 3
    'Swallows Compass Both Ends 4': '2BAF', // Dynamo AoE, Shadow Of The Sage, boss 3
    'Swallows Compass Equal Of Heaven': '2BB4', // Small circle ground AoEs, Qitian Dasheng, boss 3
  },
  shareWarn: {
    'Swallows Compass Mirage': '2BA2', // Prey-chasing puddles, Daidarabotchi, boss 2
    'Swallows Compass Mountain Falls': '2BA5', // Circle spread markers, Daidarabotchi, boss 2
    'Swallows Compass The Long End': '2BA7', // Laser tether, Qitian Dasheng  boss 3
    'Swallows Compass The Long End 2': '2BAD', // Laser Tether, Shadows Of The Sage, boss 3
  },
  gainsEffectWarn: {
    'Swallows Compass Hysteria': '128', // Gaze attack failure, Otengu, boss 1
    'Swallows Compass Bleeding': '112F', // Stepping outside the arena, boss 3
  },
  triggers: [
    {
      // Standing in the lake, Diadarabotchi, boss 2
      id: 'Swallows Compass Six Fulms Under',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '237' }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: matches.effect,
        };
      },
    },
    {
      // Stack marker, boss 3
      id: 'Swallows Compass Five Fingered Punishment',
      netRegex: netregexes/* default.ability */.Z.ability({ id: ['2BAB', '2BB0'], source: ['Qitian Dasheng', 'Shadow Of The Sage'] }),
      condition: (_data, matches) => matches.type === '21', // Taking the stack solo is *probably* a mistake.
      mistake: (_e, _data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (alone)`,
            de: `${matches.ability} (allein)`,
            fr: `${matches.ability} (seul(e))`,
            ja: `${matches.ability} (一人)`,
            cn: `${matches.ability} (单吃)`,
            ko: `${matches.ability} (혼자 맞음)`,
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/temple_of_the_fist.js


/* harmony default export */ const temple_of_the_fist = ({
  zoneId: zone_id/* default.TheTempleOfTheFist */.Z.TheTempleOfTheFist,
  damageWarn: {
    'Temple Fire Break': '21ED', // Conal AoE, Bloodglider Monk trash
    'Temple Radial Blaster': '1FD3', // Circle AoE, boss 1
    'Temple Wide Blaster': '1FD4', // Conal AoE, boss 1
    'Temple Crippling Blow': '2016', // Line AoEs, environmental, before boss 2
    'Temple Broken Earth': '236E', // Circle AoE, Singha trash
    'Temple Shear': '1FDD', // Dual conal AoE, boss 2
    'Temple Counter Parry': '1FE0', // Retaliation for incorrect direction after Killer Instinct, boss 2
    'Temple Tapas': '', // Tracking circular ground AoEs, boss 2
    'Temple Hellseal': '200F', // Red/Blue symbol failure, boss 2
    'Temple Pure Will': '2017', // Circle AoE, Spirit Flame trash, before boss 3
    'Temple Megablaster': '163', // Conal AoE, Coeurl Prana trash, before boss 3
    'Temple Windburn': '1FE8', // Circle AoE, Twister wind, boss 3
    'Temple Hurricane Kick': '1FE5', // 270-degree frontal AoE, boss 3
    'Temple Silent Roar': '1FEB', // Frontal line AoE, boss 3
    'Temple Mighty Blow': '1FEA', // Contact with coeurl head, boss 3
  },
  shareWarn: {
    'Temple Heat Lightning': '1FD7', // Purple spread circles, boss 1
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/the_burn.js


/* harmony default export */ const the_burn = ({
  zoneId: zone_id/* default.TheBurn */.Z.TheBurn,
  damageWarn: {
    'The Burn Falling Rock': '31A3', // Environmental line AoE
    'The Burn Aetherial Blast': '328B', // Line AoE, Kukulkan trash
    'The Burn Mole-a-whack': '328D', // Circle AoE, Desert Desman trash
    'The Burn Head Butt': '328E', // Small conal AoE, Desert Desman trash
    'The Burn Shardfall': '3191', // Roomwide AoE, LoS for safety, Hedetet, boss 1
    'The Burn Dissonance': '3192', // Donut AoE, Hedetet, boss 1
    'The Burn Crystalline Fracture': '3197', // Circle AoE, Dim Crystal, boss 1
    'The Burn Resonant Frequency': '3198', // Circle AoE, Dim Crystal, boss 1
    'The Burn Rotoswipe': '3291', // Frontal cone AoE, Charred Dreadnaught trash
    'The Burn Wrecking Ball': '3292', // Circle AoE, Charred Dreadnaught trash
    'The Burn Shatter': '3294', // Large circle AoE, Charred Doblyn trash
    'The Burn Auto-Cannons': '3295', // Line AoE, Charred Drone trash
    'The Burn Self-Detonate': '3296', // Circle AoE, Charred Drone trash
    'The Burn Full Throttle': '2D75', // Line AoE, Defective Drone, boss 2
    'The Burn Throttle': '2D76', // Line AoE, Mining Drone adds, boss 2
    'The Burn Adit Driver': '2D78', // Line AoE, Rock Biter adds, boss 2
    'The Burn Tremblor': '3297', // Large circle AoE, Veiled Gigaworm trash
    'The Burn Desert Spice': '3298', // The frontal cleaves must flow
    'The Burn Toxic Spray': '329A', // Frontal cone AoE, Gigaworm Stalker trash
    'The Burn Venom Spray': '329B', // Targeted circle AoE, Gigaworm Stalker trash
    'The Burn White Death': '3143', // Reactive during invulnerability, Mist Dragon, boss 3
    'The Burn Fog Plume 1': '3145', // Star AoE, Mist Dragon, boss 3
    'The Burn Fog Plume 2': '3146', // Line AoEs after stars, Mist Dragon, boss 3
    'The Burn Cauterize': '3148', // Line/Swoop AoE, Mist Dragon, boss 3
  },
  damageFail: {
    'The Burn Cold Fog': '3142', // Growing circle AoE, Mist Dragon, boss 3
  },
  shareWarn: {
    'The Burn Hailfire': '3194', // Head marker line AoE, Hedetet, boss 1
    'The Burn Shardstrike': '3195', // Orange spread head markers, Hedetet, boss 1
    'The Burn Chilling Aspiration': '314D', // Head marker cleave, Mist Dragon, boss 3
    'The Burn Frost Breath': '314C', // Tank cleave, Mist Dragon, boss 3
  },
  gainsEffectWarn: {
    'The Burn Leaden': '43', // Puddle effect, boss 2. (Also inflicts 11F, Sludge.)
    'The Burn Puddle Frostbite': '11D', // Ice puddle effect, boss 3. (NOT the conal-inflicted one, 10C.)
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o1n.js


// O1N - Deltascape 1.0 Normal
/* harmony default export */ const o1n = ({
  zoneId: zone_id/* default.DeltascapeV10 */.Z.DeltascapeV10,
  damageWarn: {
    'O1N Burn': '23D5', // Fireball explosion circle AoEs
    'O1N Clamp': '23E2', // Frontal rectangle knockback AoE, Alte Roite
  },
  triggers: [
    {
      // Small spread circles
      id: 'O1N Levinbolt',
      damageRegex: '23DA',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o2n.js



// O2N - Deltascape 2.0 Normal
/* harmony default export */ const o2n = ({
  zoneId: zone_id/* default.DeltascapeV20 */.Z.DeltascapeV20,
  damageWarn: {
    'O2N Main Quake': '24A5', // Non-telegraphed circle AoE, Fleshy Member
    'O2N Erosion': '2590', // Small circle AoEs, Fleshy Member
  },
  shareWarn: {
    'O2N Paranormal Wave': '250E', // Instant tank cleave
  },
  triggers: [
    {
      // We could try to separate out the mistake that led to the player being petrified.
      // However, it's Normal mode, why overthink it?
      id: 'O2N Petrification',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '262' }),
      // The user might get hit by another petrifying ability before the effect ends.
      // There's no point in notifying for that.
      suppressSeconds: 10,
      mistake: (e) => {
        return { type: 'warn', blame: e.target, text: e.effect };
      },
    },
    {
      id: 'O2N Earthquake',
      damageRegex: '2515',
      condition: (e) => {
        // This deals damage only to non-floating targets.
        return e.damage > 0;
      },
      mistake: (e) => {
        return { type: 'warn', name: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o3n.js



// O3N - Deltascape 3.0 Normal
/* harmony default export */ const o3n = ({
  zoneId: zone_id/* default.DeltascapeV30 */.Z.DeltascapeV30,
  damageWarn: {
    'O3N Spellblade Fire III': '2460', // Donut AoE, Halicarnassus
    'O3N Spellblade Blizzard III': '2461', // Circle AoE, Halicarnassus
    'O3N Spellblade Thunder III': '2462', // Line AoE, Halicarnassus
    'O3N Cross Reaper': '246B', // Circle AoE, Soul Reaper
    'O3N Gusting Gouge': '246C', // Green line AoE, Soul Reaper
    'O3N Sword Dance': '2470', // Targeted thin cone AoE, Halicarnassus
    'O3N Uplift': '2473', // Ground spears, Queen's Waltz effect, Halicarnassus
  },
  damageFail: {
    'O3N Ultimum': '2477', // Instant kill. Used if the player does not exit the sand maze fast enough.
  },
  shareWarn: {
    'O3N Holy Blur': 2463, // Spread circles.
  },
  triggers: [
    {
      id: 'O3N Phase Tracker',
      netRegex: netregexes/* default.startsUsing */.Z.startsUsing({ id: '2304', source: 'Halicarnassus', capture: false }),
      netRegexDe: netregexes/* default.startsUsing */.Z.startsUsing({ id: '2304', source: 'Halikarnassos', capture: false }),
      netRegexFr: netregexes/* default.startsUsing */.Z.startsUsing({ id: '2304', source: 'Halicarnasse', capture: false }),
      netRegexJa: netregexes/* default.startsUsing */.Z.startsUsing({ id: '2304', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: netregexes/* default.startsUsing */.Z.startsUsing({ id: '2304', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: netregexes/* default.startsUsing */.Z.startsUsing({ id: '2304', source: '할리카르나소스', capture: false }),
      run: (_e, data) => {
        data.phaseNumber += 1;
      },
    },
    {
      // There's a lot to track, and in order to make it all clean, it's safest just to
      // initialize it all up front instead of trying to guard against undefined comparisons.
      id: 'O3N Initializing',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '367', source: 'Halicarnassus', capture: false }),
      netRegexDe: netregexes/* default.ability */.Z.ability({ id: '367', source: 'Halikarnassos', capture: false }),
      netRegexFr: netregexes/* default.ability */.Z.ability({ id: '367', source: 'Halicarnasse', capture: false }),
      netRegexJa: netregexes/* default.ability */.Z.ability({ id: '367', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: netregexes/* default.ability */.Z.ability({ id: '367', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: netregexes/* default.ability */.Z.ability({ id: '367', source: '할리카르나소스', capture: false }),
      condition: (_e, data) => !data.initialized,
      run: (_e, data) => {
        data.gameCount = 0;
        // Indexing phases at 1 so as to make phases match what humans expect.
        // 1: We start here.
        // 2: Cave phase with Uplifts.
        // 3: Post-intermission, with good and bad frogs.
        data.phaseNumber = 1;
        data.initialized = true;
      },
    },
    {
      id: 'O3N Ribbit',
      abilityRegex: '2466',
      condition: (e, data) => {
        // We DO want to be hit by Toad/Ribbit if the next cast of The Game
        // is 4x toad panels.
        return !(data.phaseNumber === 3 && data.gameCount % 2 === 0) && e.targetId !== 'E0000000';
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // There's a lot we could do to track exactly how the player failed The Game.
      // Why overthink Normal mode, however?
      id: 'O3N The Game',
      // Guess what you just lost?
      abilityRegex: '246D',
      condition: (e) => {
        // If the player takes no damage, they did the mechanic correctly.
        return e.damage > 0;
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
      run: (_e, data) => {
        data.gameCount += 1;
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o4n.js



// O4N - Deltascape 4.0 Normal
/* harmony default export */ const o4n = ({
  zoneId: zone_id/* default.DeltascapeV40 */.Z.DeltascapeV40,
  damageWarn: {
    'O4N Blizzard III': '24BC', // Targeted circle AoEs, Exdeath
    'O4N Empowered Thunder III': '24C1', // Untelegraphed large circle AoE, Exdeath
    'O4N Zombie Breath': '24CB', // Conal, tree head after Decisive Battle
    'O4N Clearout': '24CC', // Overlapping cone AoEs, Deathly Vine (tentacles alongside tree head)
    'O4N Black Spark': '24C9', // Exploding Black Hole
  },
  shareWarn: {
    // Empowered Fire III inflicts the Pyretic debuff, which deals damage if the player
    // moves or acts before the debuff falls. Unfortunately it doesn't look like there's
    // currently a log line for this, so the only way to check for this is to collect
    // the debuffs and then warn if a player takes an action during that time. Not worth it
    // for Normal.
    'O4N Standard Fire': '24BA',
    'O4N Buster Thunder': '24BE', // A cleaving tank buster
  },
  triggers: [
    {
      id: 'O4N Doom', // Kills target if not cleansed
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '38E' }),
      deathReason: (e) => {
        return {
          type: 'fail',
          name: e.target,
          reason: {
            en: 'Cleansers missed Doom!',
            de: 'Doom-Reinigung vergessen!',
            fr: 'N\'a pas été dissipé(e) du Glas !',
            ja: '死の宣告',
            cn: '没解死宣',
          },
        };
      },
    },
    {
      id: 'O4N Vacuum Wave', // Short knockback from Exdeath
      damageRegex: '24B8',
      deathReason: (e) => {
        return {
          type: 'fail',
          name: e.targetName,
          reason: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'A été poussé(e) !',
            ja: '落ちた',
            cn: '击退坠落',
          },
        };
      },
    },
    {
      id: 'O4N Empowered Blizzard', // Room-wide AoE, freezes non-moving targets
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '4E6' }),
      mistake: (e) => {
        return { type: 'warn', blame: e.target, text: e.effect };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o4s.js



// O4S - Deltascape 4.0 Savage
/* harmony default export */ const o4s = ({
  zoneId: zone_id/* default.DeltascapeV40Savage */.Z.DeltascapeV40Savage,
  damageWarn: {
    'O4S2 Neo Vacuum Wave': '241D',
    'O4S2 Acceleration Bomb': '2431',
    'O4S2 Emptiness': '2422',
  },
  damageFail: {
    'O4S2 Double Laser': '2415',
  },
  triggers: [
    {
      id: 'O4S2 Decisive Battle',
      abilityRegex: '2408',
      run: (_e, data) => {
        data.isDecisiveBattleElement = true;
      },
    },
    {
      id: 'O4S1 Vacuum Wave',
      abilityRegex: '23FE',
      run: (_e, data) => {
        data.isDecisiveBattleElement = false;
      },
    },
    {
      id: 'O4S2 Almagest',
      abilityRegex: '2417',
      run: (_e, data) => {
        data.isNeoExdeath = true;
      },
    },
    {
      id: 'O4S2 Blizzard III',
      damageRegex: '23F8',
      condition: (e, data) => {
        // Ignore unavoidable raid aoe Blizzard III.
        return data.IsPlayerId(e.targetId) && !data.isDecisiveBattleElement;
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'O4S2 Thunder III',
      damageRegex: '23FD',
      condition: (e, data) => {
        // Only consider this during random mechanic after decisive battle.
        return data.IsPlayerId(e.targetId) && data.isDecisiveBattleElement;
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'O4S2 Petrified',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '262' }),
      mistake: (_e, data, matches) => {
        // On Neo, being petrified is because you looked at Shriek, so your fault.
        if (data.isNeoExdeath)
          return { type: 'fail', blame: matches.target, text: matches.effect };
        // On normal ExDeath, this is due to White Hole.
        return { type: 'warn', name: matches.target, text: matches.effect };
      },
    },
    {
      id: 'O4S2 Forked Lightning',
      damageRegex: '242E',
      condition: (e, data) => data.IsPlayerId(e.targetId),
      mistake: (e, data) => {
        const text = e.abilityName + ' => ' + data.ShortName(e.targetName);
        return { type: 'fail', blame: e.attackerName, text: text };
      },
    },
    {
      id: 'O4S2 Double Attack',
      damageRegex: '241C',
      condition: (e, data) => data.IsPlayerId(e.targetId),
      collectSeconds: 0.5,
      mistake: (e) => {
        if (e.length <= 2)
          return;
        // Hard to know who should be in this and who shouldn't, but
        // it should never hit 3 people.
        return { type: 'fail', fullText: e[0].abilityName + ' x ' + e.length };
      },
    },
    {
      id: 'O4S2 Beyond Death Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '566' }),
      run: (_e, data, matches) => {
        data.hasBeyondDeath = data.hasBeyondDeath || {};
        data.hasBeyondDeath[matches.target] = true;
      },
    },
    {
      id: 'O4S2 Beyond Death Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '566' }),
      run: (_e, data, matches) => {
        data.hasBeyondDeath = data.hasBeyondDeath || {};
        data.hasBeyondDeath[matches.target] = false;
      },
    },
    {
      id: 'O4S2 Beyond Death',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '566' }),
      delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (_e, data, matches) => {
        if (!data.hasBeyondDeath)
          return;
        if (!data.hasBeyondDeath[matches.target])
          return;
        return {
          name: matches.target,
          reason: matches.effect,
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o7s.js


// O7S - Sigmascape 3.0 Savage
/* harmony default export */ const o7s = ({
  zoneId: zone_id/* default.SigmascapeV30Savage */.Z.SigmascapeV30Savage,
  damageFail: {
    'O7S Missile': '2782',
    'O7S Chain Cannon': '278F',
  },
  damageWarn: {
    'O7S Searing Wind': '2777',
  },
  triggers: [
    {
      id: 'O7S Stoneskin',
      abilityRegex: '2AB5',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o12s.js



// TODO: could add Patch warnings for double/unbroken tethers
// TODO: Hello World could have any warnings (sorry)

/* harmony default export */ const o12s = ({
  zoneId: zone_id/* default.AlphascapeV40Savage */.Z.AlphascapeV40Savage,
  damageWarn: {
    'O12S1 Superliminal Motion 1': '3334', // 300+ degree cleave with back safe area
    'O12S1 Efficient Bladework 1': '3329', // Omega-M "get out" centered aoe after split
    'O12S1 Efficient Bladework 2': '332A', // Omega-M "get out" centered aoe during blades
    'O12S1 Beyond Strength': '3328', // Omega-M "get in" centered aoe during shield
    'O12S1 Superliminal Steel 1': '3330', // Omega-F "get front/back" blades phase
    'O12S1 Superliminal Steel 2': '3331', // Omega-F "get front/back" blades phase
    'O12S1 Optimized Blizzard III': '3332', // Omega-F giant cross
    'O12S2 Diffuse Wave Cannon': '3369', // back/sides lasers
    'O12S2 Right Arm Unit Hyper Pulse 1': '335A', // Rotating Archive Peripheral lasers
    'O12S2 Right Arm Unit Hyper Pulse 2': '335B', // Rotating Archive Peripheral lasers
    'O12S2 Right Arm Unit Colossal Blow': '335F', // Exploding Archive All hands
    'O12S2 Left Arm Unit Colossal Blow': '3360', // Exploding Archive All hands
  },
  damageFail: {
    'O12S1 Optical Laser': '3347', // middle laser from eye
    'O12S1 Advanced Optical Laser': '334A', // giant circle centered on eye
    'O12S2 Rear Power Unit Rear Lasers 1': '3361', // Archive All initial laser
    'O12S2 Rear Power Unit Rear Lasers 2': '3362', // Archive All rotating laser
  },
  shareWarn: {
    'O12S1 Optimized Fire III': '3337', // fire spread
    'O12S2 Hyper Pulse Tether': '335C', // Index And Archive Peripheral tethers
    'O12S2 Wave Cannon': '336B', // Index And Archive Peripheral baited lasers
    'O12S2 Optimized Fire III': '3379', // Archive All spread
  },
  shareFail: {
    'O12S1 Optimized Sagittarius Arrow': '334D', // Omega-M bard limit break
    'O12S2 Oversampled Wave Cannon': '3366', // Monitor tank busters
    'O12S2 Savage Wave Cannon': '336D', // Tank buster with the vuln first
  },
  triggers: [
    {
      id: 'O12S1 Discharger Knocked Off',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '3327' }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
    {
      id: 'O12S1 Magic Vulnerability Up Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '472' }),
      run: (_e, data, matches) => {
        data.vuln = data.vuln || {};
        data.vuln[matches.target] = true;
      },
    },
    {
      id: 'O12S1 Magic Vulnerability Up Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '472' }),
      run: (_e, data, matches) => {
        data.vuln = data.vuln || {};
        data.vuln[matches.target] = false;
      },
    },
    {
      id: 'O12S1 Magic Vulnerability Damage',
      // 332E = Pile Pitch stack
      // 333E = Electric Slide (Omega-M square 1-4 dashes)
      // 333F = Electric Slide (Omega-F triangle 1-4 dashes)
      damageRegex: ['332E', '333E', '333F'],
      condition: (_e, data, matches) => data.vuln && data.vuln[matches.target],
      mistake: (_e, _data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (with vuln)`,
            de: `${matches.ability} (mit Verwundbarkeit)`,
            ja: `${matches.ability} (被ダメージ上昇)`,
            cn: `${matches.ability} (带易伤)`,
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/trial/byakko-ex.js


// Byakko Extreme
/* harmony default export */ const byakko_ex = ({
  zoneId: zone_id/* default.TheJadeStoaExtreme */.Z.TheJadeStoaExtreme,
  damageWarn: {
    // Popping Unrelenting Anguish bubbles
    'ByaEx Aratama': '27F6',
    // Stepping in growing orb
    'ByaEx Vacuum Claw': '27E9',
    // Lightning Puddles
    'ByaEx Hunderfold Havoc 1': '27E5',
    'ByaEx Hunderfold Havoc 2': '27E6',
  },
  damageFail: {
    'ByaEx Sweep The Leg': '27DB',
    'ByaEx Fire and Lightning': '27DE',
    'ByaEx Distant Clap': '27DD',
    // Midphase line attack
    'ByaEx Imperial Guard': '27F1',
  },
  triggers: [
    {
      // Pink bubble collision
      id: 'ByaEx Ominous Wind',
      damageRegex: '27EC',
      condition: (e, data) => data.IsPlayerId(e.targetId),
      mistake: (e) => {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'bubble collision',
            de: 'Blasen sind zusammengestoßen',
            fr: 'collision de bulles',
            ja: '衝突',
            cn: '相撞',
            ko: '장판 겹쳐서 터짐',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/trial/shinryu.js



// Shinryu Normal

/* harmony default export */ const shinryu = ({
  zoneId: zone_id/* default.TheRoyalMenagerie */.Z.TheRoyalMenagerie,
  damageWarn: {
    'Shinryu Akh Rhai': '1FA6', // Sky lasers alongside Akh Morn.
    'Shinryu Blazing Trail': '221A', // Rectangle AoEs, intermission adds.
    'Shinryu Collapse': '2218', // Circle AoEs, intermission adds
    'Shinryu Dragonfist': '24F0', // Giant punchy circle in the center.
    'Shinryu Earth Breath': '1F9D', // Conal attacks that aren't actually Earth Shakers.
    'Shinryu Gyre Charge': '1FA8', // Green dive bomb attack.
    'Shinryu Spikesicle': '1FA`', // Blue-green line attacks from behind.
    'Shinryu Tail Slap': '1F93', // Red squares indicating the tail's landing spots.
  },
  shareWarn: {
    'Shinryu Levinbolt': '1F9C',
  },
  triggers: [
    {
      // Icy floor attack.
      id: 'Shinryu Diamond Dust',
      // Thin Ice
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '38F' }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Slid off!',
            de: 'Runter gerutscht!',
            fr: 'A glissé(e) !',
            ja: '滑った',
            cn: '滑落',
          },
        };
      },
    },
    {
      id: 'Shinryu Tidal Wave',
      damageRegex: '1F8B',
      deathReason: (e) => {
        return {
          type: 'fail',
          name: e.targetName,
          reason: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'A été poussé(e) !',
            ja: '落ちた',
            cn: '击退坠落',
          },
        };
      },
    },
    {
      // Knockback from center.
      id: 'Shinryu Aerial Blast',
      damageRegex: '1F90',
      deathReason: (e) => {
        return {
          type: 'fail',
          name: e.targetName,
          reason: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'A été pousser !',
            ja: '落ちた',
            cn: '击退坠落',
          },
        };
      },
    },
  ],
});


;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/trial/susano-ex.js


// Susano Extreme
/* harmony default export */ const susano_ex = ({
  zoneId: zone_id/* default.ThePoolOfTributeExtreme */.Z.ThePoolOfTributeExtreme,
  damageWarn: {
    'SusEx Churning': '203F',
  },
  damageFail: {
    'SusEx Rasen Kaikyo': '202E',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/ultimate/ultima_weapon_ultimate.js



// Ultima Weapon Ultimate
/* harmony default export */ const ultima_weapon_ultimate = ({
  zoneId: zone_id/* default.TheWeaponsRefrainUltimate */.Z.TheWeaponsRefrainUltimate,
  damageWarn: {
    'UWU Searing Wind': '2B5C',
    'UWU Eruption': '2B5A',
    'UWU Weight': '2B65',
    'UWU Landslide1': '2B70',
    'UWU Landslide2': '2B71',
  },
  damageFail: {
    'UWU Great Whirlwind': '2B41',
    'UWU Slipstream': '2B53',
    'UWU Wicked Wheel': '2B4E',
    'UWU Wicked Tornado': '2B4F',
  },
  triggers: [
    {
      id: 'UWU Windburn',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: 'EB' }),
      suppressSeconds: 2,
      mistake: (e) => {
        return { type: 'warn', blame: e.target, text: e.effect };
      },
    },
    {
      // Featherlance explosion.  It seems like the person who pops it is the
      // first person listed damage-wise, so they are likely the culprit.
      id: 'UWU Featherlance',
      damageRegex: '2B43',
      collectSeconds: 0.5,
      suppressSeconds: 5,
      mistake: (e) => {
        return { type: 'fail', blame: e[0].targetName, text: e[0].attackerName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/ultimate/unending_coil_ultimate.js



// UCU - The Unending Coil Of Bahamut (Ultimate)
/* harmony default export */ const unending_coil_ultimate = ({
  zoneId: zone_id/* default.TheUnendingCoilOfBahamutUltimate */.Z.TheUnendingCoilOfBahamutUltimate,
  damageFail: {
    'UCU Lunar Dynamo': '26BC',
    'UCU Iron Chariot': '26BB',
    'UCU Exaflare': '26EF',
    'UCU Wings Of Salvation': '26CA',
  },
  triggers: [
    {
      id: 'UCU Twister Death',
      damageRegex: '26AB',
      condition: (e, data) => {
        // Instant death uses '36' as its flags, differentiating
        // from the explosion damage you take when somebody else
        // pops one.
        return data.IsPlayerId(e.targetId) && e.flags === '36';
      },
      mistake: (e) => {
        return {
          type: 'fail',
          blame: e.targetName,
          text: {
            en: 'Twister Pop',
            de: 'Wirbelsturm berührt',
            fr: 'Apparition des tornades',
            ja: 'ツイスター',
            cn: '旋风',
            ko: '회오리 밟음',
          },
        };
      },
    },
    {
      id: 'UCU Thermionic Burst',
      damageRegex: '26B9',
      condition: (e, data) => data.IsPlayerId(e.targetId),
      mistake: (e) => {
        return {
          type: 'fail',
          blame: e.targetName,
          text: {
            en: 'Pizza Slice',
            de: 'Pizzastück',
            fr: 'Parts de pizza',
            ja: 'サーミオニックバースト',
            cn: '天崩地裂',
            ko: '장판에 맞음',
          },
        };
      },
    },
    {
      id: 'UCU Chain Lightning',
      damageRegex: '26C8',
      condition: (e, data) => data.IsPlayerId(e.targetId),
      mistake: (e) => {
        // It's hard to assign blame for lightning.  The debuffs
        // go out and then explode in order, but the attacker is
        // the dragon and not the player.
        return {
          type: 'warn',
          name: e.targetName,
          text: {
            en: 'hit by lightning',
            de: 'vom Blitz getroffen',
            fr: 'frappé(e) par la foudre',
            ja: 'チェインライトニング',
            cn: '雷光链',
            ko: '번개 맞음',
          },
        };
      },
    },
    {
      id: 'UCU Burns',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: 'FA' }),
      mistake: (e) => {
        return { type: 'warn', blame: e.target, text: e.effect };
      },
    },
    {
      id: 'UCU Sludge',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '11F' }),
      mistake: (e) => {
        return { type: 'fail', blame: e.target, text: e.effect };
      },
    },
    {
      id: 'UCU Doom Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: 'D2' }),
      run: (_e, data, matches) => {
        data.hasDoom = data.hasDoom || {};
        data.hasDoom[matches.target] = true;
      },
    },
    {
      id: 'UCU Doom Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: 'D2' }),
      run: (_e, data, matches) => {
        data.hasDoom = data.hasDoom || {};
        data.hasDoom[matches.target] = false;
      },
    },
    {
      // There is no callout for "you forgot to clear doom".  The logs look
      // something like this:
      //   [20:02:30.564] 1A:Okonomi Yaki gains the effect of Doom from  for 6.00 Seconds.
      //   [20:02:36.443] 1E:Okonomi Yaki loses the effect of Protect from Tako Yaki.
      //   [20:02:36.443] 1E:Okonomi Yaki loses the effect of Doom from .
      //   [20:02:38.525] 19:Okonomi Yaki was defeated by Firehorn.
      // In other words, doom effect is removed +/- network latency, but can't
      // tell until later that it was a death.  Arguably, this could have been a
      // close-but-successful clearing of doom as well.  It looks the same.
      // Strategy: if you haven't cleared doom with 1 second to go then you probably
      // died to doom.  You can get non-fatally iceballed or auto'd in between,
      // but what can you do.
      id: 'UCU Doom Death',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: 'D2' }),
      delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 1,
      deathReason: (e, data, matches) => {
        if (!data.hasDoom || !data.hasDoom[matches.target])
          return;
        let reason;
        if (e.durationSeconds < 9)
          reason = matches.effect + ' #1';
        else if (e.durationSeconds < 14)
          reason = matches.effect + ' #2';
        else
          reason = matches.effect + ' #3';
        return { name: matches.target, reason: reason };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/alliance/the_copied_factory.js


// The Copied Factory
/* harmony default export */ const the_copied_factory = ({
  zoneId: zone_id/* default.TheCopiedFactory */.Z.TheCopiedFactory,
  damageWarn: {
    'Copied Serial Energy Bomb': '48B4',
    // Make sure enemies are ignored on these
    'Copied Serial Energy Bombardment': '48B8',
    'Copied Serial Energy Assault': '48B6',
    'Copied Serial High-Powered Laser': '48C5',
    'Copied Serial Sidestriking Spin Spin 1': '48CB',
    'Copied Serial Sidestriking Spin 2': '48CC',
    'Copied Serial Centrifugal Spin': '48C9',
    'Copied Serial Air-To-Surface Energy': '48BA',
    'Copied Serial High-Caliber Laser': '48FA',
    'Copied Serial Energy Ring 1': '48BC',
    'Copied Serial Energy Ring 2': '48BD',
    'Copied Serial Energy Ring 3': '48BE',
    'Copied Serial Energy Ring 4': '48C0',
    'Copied Serial Energy Ring 5': '48C1',
    'Copied Serial Energy Ring 6': '48C2',

    'Copied Trash Energy Bomb': '491D',
    'Copied Trash Frontal Somersault': '491B',
    'Copied Trash High-Frequency Laser': '491E',

    'Copied Hobbes Shocking Discharge': '480B',
    'Copied Hobbes Variable Combat Test 1': '49C5',
    'Copied Hobbes Variable Combat Test 2': '49C6',
    'Copied Hobbes Variable Combat Test 3': '49C7',
    'Copied Hobbes Variable Combat Test 4': '480F',
    'Copied Hobbes Variable Combat Test 5': '4810',
    'Copied Hobbes Variable Combat Test 6': '4811',

    'Copied Hobbes Ring Laser 1': '4802',
    'Copied Hobbes Ring Laser 2': '4803',
    'Copied Hobbes Ring Laser 3': '4804',

    'Copied Hobbes Towerfall': '4813',

    'Copied Hobbes Fire-Reistance Test 1': '4816',
    'Copied Hobbes Fire-Reistance Test 2': '4817',
    'Copied Hobbes Fire-Reistance Test 3': '4818',

    'Copied Hobbes Oil Well': '481B',
    'Copied Hobbes Electromagnetic Pulse': '4819',
    // TODO: what's the electrified floor with conveyor belts?

    'Copied Goliath Energy Ring 1': '4937',
    'Copied Goliath Energy Ring 2': '4938',
    'Copied Goliath Energy Ring 3': '4939',
    'Copied Goliath Energy Ring 4': '493A',
    'Copied Goliath Energy Ring 5': '4937',
    'Copied Goliath Laser Turret': '48E6',

    'Copied Flight Unit Area Bombing': '4943',
    'Copied Flight Unit Lightfast Blade': '4940',

    'Copied Engels Marx Smash 1': '4729',
    'Copied Engels Marx Smash 2': '4728',
    'Copied Engels Marx Smash 3': '472F',
    'Copied Engels Marx Smash 4': '4731',
    'Copied Engels Marx Smash 5': '472B',
    'Copied Engels Marx Smash 6': '472D',
    'Copied Engels Marx Smash 7': '4732',

    'Copied Engels Incendiary Bombing': '4739',
    'Copied Engels Guided Missile': '4736',
    'Copied Engels Surface Missile': '4734',
    'Copied Engels Laser Sight': '473B',
    'Copied Engels Frack': '474D',

    'Copied Engels Marx Crush': '48FC',
    'Copied Engels Crushing Wheel': '474B',
    'Copied Engels Marx Thrust': '48FC',

    'Copied 9S Laser Suppression': '48E0', // Cannons
    'Copied 9S Ballistic Impact 1': '4974',
    'Copied 9S Ballistic Impact 2': '48DC',
    'Copied 9S Ballistic Impact 3': '48E4',
    'Copied 9S Ballistic Impact 4': '48E0',

    'Copied 9S Marx Impact': '48D4',

    'Copied 9S Tank Destruction 1': '48E8',
    'Copied 9S Tank Destruction 2': '48E9',

    'Copied 9S Serial Spin 1': '48A5',
    'Copied 9S Serial Spin 2': '48A7',

  },
  shareWarn: {
    'Copied Hobbes Short-Range Missile': '4815',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/alliance/the_puppets_bunker.js


// TODO: 5093 taking High-Powered Laser with a vuln (because of taking two)
// TODO: 4FB5 taking High-Powered Laser with a vuln (because of taking two)
// TODO: 50D3 Aerial Support: Bombardment going off from add
// TODO: 5211 Maneuver: Volt Array not getting interrupted
// TODO: 4FF4/4FF5 One of these is failing chemical conflagration
// TODO: standing in wrong teleporter?? maybe 5363?

/* harmony default export */ const the_puppets_bunker = ({
  zoneId: zone_id/* default.ThePuppetsBunker */.Z.ThePuppetsBunker,
  damageWarn: {
    'Puppet Aegis Beam Cannons 1': '5074', // rotating separating white ground aoe
    'Puppet Aegis Beam Cannons 2': '5075', // rotating separating white ground aoe
    'Puppet Aegis Beam Cannons 3': '5076', // rotating separating white ground aoe
    'Puppet Aegis Collider Cannons': '507E', // rotating red ground aoe pinwheel
    'Puppet Aegis Surface Laser 1': '5091', // chasing laser initial
    'Puppet Aegis Surface Laser 2': '5092', // chasing laser chasing
    'Puppet Aegis Flight Path': '508C', // blue line aoe from flying untargetable adds
    'Puppet Aegis Refraction Cannons 1': '5081', // refraction cannons between wings
    'Puppet Aegis Life\'s Last Song': '53B3', // ring aoe with gap
    'Puppet Light Long-Barreled Laser': '5212', // line aoe from add
    'Puppet Light Surface Missile Impact': '520F', // untargeted ground aoe from No Restrictions
    'Puppet Superior Incendiary Bombing': '4FB9', // fire puddle initial
    'Puppet Superior Sharp Turn': '506D', // sharp turn dash
    'Puppet Superior Standard Surface Missile 1': '4FB1', // Lethal Revolution circles
    'Puppet Superior Standard Surface Missile 2': '4FB2', // Lethal Revolution circles
    'Puppet Superior Standard Surface Missile 3': '4FB3', // Lethal Revolution circles
    'Puppet Superior Sliding Swipe 1': '506F', // right-handed sliding swipe
    'Puppet Superior Sliding Swipe 2': '5070', // left-handed sliding swipe
    'Puppet Superior Guided Missile': '4FB8', // ground aoe during Area Bombardment
    'Puppet Superior High-Order Explosive Blast 1': '4FC0', // star aoe
    'Puppet Superior High-Order Explosive Blast 2': '4FC1', // star aoe
    'Puppet Heavy Energy Bombardment': '4FFC', // colored magic hammer-y ground aoe
    'Puppet Heavy Revolving Laser': '5000', // get under laser
    'Puppet Heavy Energy Bomb': '4FFA', // getting hit by ball during Active Suppressive Unit
    'Puppet Heavy R010 Laser': '4FF0', // laser pod
    'Puppet Heavy R030 Hammer': '4FF1', // circle aoe pod
    'Puppet Hallway High-Powered Laser': '50B1', // long aoe in the hallway section
    'Puppet Hallway Energy Bomb': '50B2', // running into a floating orb
    'Puppet Compound Mechanical Dissection': '51B3', // spinning vertical laser
    'Puppet Compound Mechanical Decapitation': '51B4', // get under laser
    'Puppet Compound Mechnical Contusion Untargeted': '51B7', // untargeted ground aoe
    'Puppet Compound 2P Relentless Spiral 1': '51AA', // triple untargeted ground aoes
    'Puppet Compound 2P Relentless Spiral 2': '51CB', // triple untargeted ground aoes
    'Puppet Compound 2P Prime Blade Out 1': '541F', // 2P prime blade get out
    'Puppet Compound 2P Prime Blade Out 2': '5198', // 2P/puppet teleporting/reproduce prime blade get out
    'Puppet Compound 2P Prime Blade Behind 1': '5420', // 2P prime blade get behind
    'Puppet Compound 2P Prime Blade Behind 2': '5199', // 2P teleporting prime blade get behind
    'Puppet Compound 2P Prime Blade In 1': '5421', // 2P prime blade get in
    'Puppet Compound 2P Prime Blade In 2': '519A', // 2P/puppet teleporting/reproduce prime blade get in
    'Puppet Compound 2P R012 Laser Ground': '51AE', // untargeted ground circle
    // This is... too noisy.
    // 'Puppet Compound 2P Four Parts Resolve 1': '51A0', // four parts resolve jump
    // 'Puppet Compound 2P Four Parts Resolve 2': '519F', // four parts resolve cleave
  },
  damageFail: {
    'Puppet Heavy Upper Laser 1': '5087', // upper laser initial
    'Puppet Heavy Upper Laser 2': '4FF7', // upper laser continuous
    'Puppet Heavy Lower Laser 1': '5086', // lower laser first section initial
    'Puppet Heavy Lower Laser 2': '4FF6', // lower laser first section continuous
    'Puppet Heavy Lower Laser 3': '5088', // lower laser second section initial
    'Puppet Heavy Lower Laser 4': '4FF8', // lower laser second section continuous
    'Puppet Heavy Lower Laser 5': '5089', // lower laser third section initial
    'Puppet Heavy Lower Laser 6': '4FF9', // lower laser third section continuous
    'Puppet Compound Incongruous Spin': '51B2', // find the safe spot double dash
  },
  shareWarn: {
    // This is pretty large and getting hit by initial without burns seems fine.
    // 'Puppet Light Homing Missile Impact': '5210', // targeted fire aoe from No Restrictions
    'Puppet Heavy Unconventional Voltage': '5004',
    // Pretty noisy.
    'Puppet Maneuver High-Powered Laser': '5002', // tank laser
    'Puppet Compound Mechnical Contusion Targeted': '51B6', // targeted spread marker
    'Puppet Compound 2P R012 Laser Tank': '51AE', // targeted spread pod laser on non-tank
  },
  shareFail: {
    'Puppet Aegis Anti-Personnel Laser': '5090', // tank buster marker
    'Puppet Superior Precision-Guided Missile': '4FC5',
    'Puppet Compound 2P R012 Laser Tank': '51AD', // targeted pod laser on tank
  },
  gainsEffectWarn: {
    'Puppet Burns': '10B', // standing in many various fire aoes
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/alliance/the_tower_at_paradigms_breach.js



// TODO: missing Shock Black 2?
// TODO: White/Black Dissonance damage is maybe when flags end in 03?

/* harmony default export */ const the_tower_at_paradigms_breach = ({
  zoneId: zone_id/* default.TheTowerAtParadigmsBreach */.Z.TheTowerAtParadigmsBreach,
  damageWarn: {
    'Tower Knave Colossal Impact Center 1': '5EA7', // Center aoe from Knave and clones
    'Tower Knave Colossal Impact Center 2': '60C8', // Center aoe from Knave during lunge
    'Tower Knave Colossal Impact Side 1': '5EA5', // Side aoes from Knave and clones
    'Tower Knave Colossal Impact Side 2': '5EA6', // Side aoes from Knave and clones
    'Tower Knave Colossal Impact Side 3': '60C6', // Side aoes from Knave during lunge
    'Tower Knave Colossal Impact Side 4': '60C7', // Side aoes from Knave during lunge
    'Tower Knave Burst': '5ED4', // Spheroid Knavish Bullets collision
    'Tower Knave Magic Barrage': '5EAC', // Spheroid line aoes
    'Tower Hansel Repay': '5C70', // Shield damage
    'Tower Hansel Explosion': '5C67', // Being hit by Magic Bullet during Passing Lance
    'Tower Hansel Impact': '5C5C', // Being hit by Magical Confluence during Wandering Trail
    'Tower Hansel Bloody Sweep 1': '5C6C', // Dual cleaves without tether
    'Tower Hansel Bloody Sweep 2': '5C6D', // Dual cleaves without tether
    'Tower Hansel Bloody Sweep 3': '5C6E', // Dual cleaves with tether
    'Tower Hansel Bloody Sweep 4': '5C6F', // Dual cleaves with tether
    'Tower Hansel Passing Lance': '5C66', // The Passing Lance charge itself
    'Tower Hansel Breaththrough 1': '55B3', // half room cleave during Wandering Trail
    'Tower Hansel Breaththrough 2': '5C5D', // half room cleave during Wandering Trail
    'Tower Hansel Breaththrough 3': '5C5E', // half room cleave during Wandering Trail
    'Tower Hansel Hungry Lance 1': '5C71', // 2xlarge conal cleave during Wandering Trail
    'Tower Hansel Hungry Lance 2': '5C72', // 2xlarge conal cleave during Wandering Trail
    'Tower Flight Unit Lightfast Blade': '5BFE', // large room cleave
    'Tower Flight Unit Standard Laser': '5BFF', // tracking laser
    'Tower 2P Whirling Assault': '5BFB', // line aoe from 2P clones
    'Tower 2P Balanced Edge': '5BFA', // circular aoe on 2P clones
    'Tower Red Girl Generate Barrier 1': '6006', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 2': '6007', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 3': '6008', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 4': '6009', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 5': '6310', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 6': '6311', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 7': '6312', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 8': '6313', // being hit by barriers appearing
    'Tower Red Girl Shock White 1': '600F', // white shockwave circle not dropped on black
    'Tower Red Girl Shock White 2': '6010', // white shockwave circle not dropped on black
    'Tower Red Girl Shock Black 1': '6011', // black shockwave circle not dropped on white
    'Tower Red Girl Point White 1': '601F', // being hit by a white laser
    'Tower Red Girl Point White 2': '6021', // being hit by a white laser
    'Tower Red Girl Point Black 1': '6020', // being hit by a black laser
    'Tower Red Girl Point Black 2': '6022', // being hit by a black laser
    'Tower Red Girl Wipe White': '600C', // not line of sighting the white meteor
    'Tower Red Girl Wipe Black': '600D', // not line of sighting the black meteor
    'Tower Red Girl Diffuse Energy': '6056', // rotating clone bubble cleaves
    'Tower Red Girl Pylon Big Explosion': '6027', // not killing a pylon during hacking phase
    'Tower Red Girl Pylon Explosion': '6026', // pylon during Child's play
    'Tower Philosopher Deploy Armaments Middle': '5C02', // middle laser
    'Tower Philosopher Deploy Armaments Sides': '5C05', // sides laser
    'Tower Philosopher Deploy Armaments 3': '6078', // goes with 5C01
    'Tower Philosopher Deploy Armaments 4': '6079', // goes with 5C04
    'Tower Philosopher Energy Bomb': '5C05', // pink bubble
    'Tower False Idol Made Magic Right': '5BD7', // rotating wheel going right
    'Tower False Idol Made Magic Left': '5BD6', // rotating wheel going left
    'Tower False Idol Lighter Note': '5BDA', // lighter note moving aoes
    'Tower False Idol Magical Interference': '5BD5', // lasers during Rhythm Rings
    'Tower False Idol Scattered Magic': '5BDF', // circle aoes from Seed Of Magic
    'Tower Her Inflorescence Uneven Fotting': '5BE2', // building from Recreate Structure
    'Tower Her Inflorescence Crash': '5BE5', // trains from Mixed Signals
    'Tower Her Inflorescence Heavy Arms 1': '5BED', // heavy arms front/back attack
    'Tower Her Inflorescence Heavy Arms 2': '5BEF', // heavy arms sides attack
    'Tower Her Inflorescence Energy Scattered Magic': '5BE8', // orbs from Red Girl by train
  },
  damageFail: {
    'Tower Her Inflorescence Place Of Power': '5C0D', // instadeath middle circle before black/white rings
  },
  shareWarn: {
    'Tower Knave Magic Artillery Alpha': '5EAB', // Spread
    'Tower Hansel Seed Of Magic Alpha': '5C61', // Spread
  },
  shareFail: {
    'Tower Knave Magic Artillery Beta': '5EB3', // Tankbuster
    'Tower Red Girl Manipulate Energy': '601A', // Tankbuster
    'Tower False Idol Darker Note': '5BDC', // Tankbuster
  },
  triggers: [
    {
      id: 'Tower Knocked Off',
      // 5EB1 = Knave Lunge
      // 5BF2 = Her Infloresence Shockwave
      netRegex: netregexes/* default.ability */.Z.ability({ id: ['5EB1', '5BF2'] }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/akadaemia_anyder.js


/* harmony default export */ const akadaemia_anyder = ({
  zoneId: zone_id/* default.AkadaemiaAnyder */.Z.AkadaemiaAnyder,
  damageWarn: {
    'Anyder Acrid Stream': '4304',
    'Anyder Waterspout': '4306',
    'Anyder Raging Waters': '4302',
    'Anyder Violent Breach': '4305',
    'Anyder Tidal Guillotine 1': '3E08',
    'Anyder Tidal Guillotine 2': '3E0A',
    'Anyder Pelagic Cleaver 1': '3E09',
    'Anyder Pelagic Cleaver 2': '3E0B',
    'Anyder Aquatic Lance': '3E05',
    'Anyder Syrup Spout': '4308',
    'Anyder Needle Storm': '4309',
    'Anyder Extensible Tendrils 1': '3E10',
    'Anyder Extensible Tendrils 2': '3E11',
    'Anyder Putrid Breath': '3E12',
    'Anyder Detonator': '430F',
    'Anyder Dominion Slash': '430D',
    'Anyder Quasar': '430B',
    'Anyder Dark Arrivisme': '430E',
    'Anyder Thunderstorm': '3E1C',
    'Anyder Winding Current': '3E1F',
    // 3E20 is being hit by the growing orbs, maybe?
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/amaurot.js


/* harmony default export */ const amaurot = ({
  zoneId: zone_id/* default.Amaurot */.Z.Amaurot,
  damageWarn: {
    'Amaurot Burning Sky': '354A',
    'Amaurot Whack': '353C',
    'Amaurot Aetherspike': '353B',
    'Amaurot Venemous Breath': '3CCE',
    'Amaurot Cosmic Shrapnel': '4D26',
    'Amaurot Earthquake': '3CCD',
    'Amaurot Meteor Rain': '3CC6',
    'Amaurot Final Sky': '3CCB',
    'Amaurot Malevolence': '3541',
    'Amaurot Turnabout': '3542',
    'Amaurot Sickly Inferno': '3DE3',
    'Amaurot Disquieting Gleam': '3546',
    'Amaurot Black Death': '3543',
    'Amaurot Force of Loathing': '3544',
    'Amaurot Damning Ray 1': '3E00',
    'Amaurot Damning Ray 2': '3E01',
    'Amaurot Deadly Tentacles': '3547',
    'Amaurot Misfortune': '3CE2',
  },
  damageFail: {
    'Amaurot Apokalypsis': '3CD7',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/anamnesis_anyder.js


/* harmony default export */ const anamnesis_anyder = ({
  zoneId: zone_id/* default.AnamnesisAnyder */.Z.AnamnesisAnyder,
  damageWarn: {
    'Anamnesis Trench Phuabo Spine Lash': '4D1A', // frontal conal
    'Anamnesis Trench Anemone Falling Rock': '4E37', // ground circle aoe from Trench Anemone showing up
    'Anamnesis Trench Dagonite Sewer Water': '4D1C', // frontal conal from Trench Anemone (?!)
    'Anamnesis Trench Yovra Rock Hard': '4D21', // targeted circle aoe
    'Anamnesis Trench Yovra Torrential Torment': '4D21', // frontal conal
    'Anamnesis Unknown Luminous Ray': '4E27', // Unknown line aoe
    'Anamnesis Unknown Sinster Bubble Explosion': '4B6E', // Unknown explosions during Scrutiny
    'Anamnesis Unknown Reflection': '4B6F', // Unknown conal attack during Scrutiny
    'Anamnesis Unknown Clearout 1': '4B74', // Unknown frontal cone
    'Anamnesis Unknown Clearout 2': '4B6B', // Unknown frontal cone
    'Anamnesis Unknown Setback 1': '4B75', // Unknown rear cone
    'Anamnesis Unknown Setback 2': '5B6C', // Unknown rear cone
    'Anamnesis Anyder Clionid Acrid Stream': '4D24', // targeted circle aoe
    'Anamnesis Anyder Diviner Dreadstorm': '4D28', // ground circle aoe
    'Anamnesis Kyklops 2000-Mina Swing': '4B55', // Kyklops get out mechanic
    'Anamnesis Kyklops Terrible Hammer': '4B5D', // Kyklops Hammer/Blade alternating squares
    'Anamnesis Kyklops Terrible Blade': '4B5E', // Kyklops Hammer/Blade alternating squares
    'Anamnesis Kyklops Raging Glower': '4B56', // Kyklops line aoe
    'Anamnesis Kyklops Eye Of The Cyclone': '4B57', // Kyklops donut
    'Anamnesis Anyder Harpooner Hydroball': '4D26', // frontal conal
    'Anamnesis Rukshs Swift Shift': '4B83', // Rukshs Deem teleport N/S
    'Anamnesis Rukshs Depth Grip Wavebreaker': '33D4', // Rukshs Deem hand attacks
    'Anamnesis Rukshs Rising Tide': '4B8B', // Rukshs Deem cross aoe
    'Anamnesis Rukshs Command Current': '4B82', // Rukshs Deem protean-ish ground aoes
  },
  shareWarn: {
    'Anamnesis Trench Xzomit Mantle Drill': '4D19', // charge attack
    'Anamnesis Io Ousia Barreling Smash': '4E24', // charge attack
    'Anamnesis Kyklops Wanderer\'s Pyre': '4B5F', // Kyklops spread attack
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/dohn_mheg.js



// TODO: Missing Growing tethers on boss 2.
// (Maybe gather party member names on the previous TIIIIMBEEEEEER cast for comparison?)
// TODO: Failing to interrupt Dohnfaust Fuath on Watering Wheel casts?
// (15:........:Dohnfast Fuath:3DAA:Watering Wheel:........:(\y{Name}):)

/* harmony default export */ const dohn_mheg = ({
  zoneId: zone_id/* default.DohnMheg */.Z.DohnMheg,
  damageWarn: {
    'Dohn Mheg Geyser': '2260', // Water eruptions, boss 1
    'Dohn Mheg Hydrofall': '22BD', // Ground AoE marker, boss 1
    'Dohn Mheg Laughing Leap': '2294', // Ground AoE marker, boss 1
    'Dohn Mheg Swinge': '22CA', // Frontal cone, boss 2
    'Dohn Mheg Canopy': '3DB0', // Frontal cone, Dohnfaust Rowans throughout instance
    'Dohn Mheg Pinecone Bomb': '3DB1', // Circular ground AoE marker, Dohnfaust Rowans throughout instance
    'Dohn Mheg Bile Bombardment': '34EE', // Ground AoE marker, boss 3
    'Dohn Mheg Corrosive Bile': '34EC', // Frontal cone, boss 3
    'Dohn Mheg Flailing Tentacles': '3681',

  },
  triggers: [
    {
      id: 'Dohn Mheg Imp Choir',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '46E' }),
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'Dohn Mheg Toad Choir',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '1B7' }),
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'Dohn Mheg Fool\'s Tumble',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '183' }),
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/heroes_gauntlet.js



// TODO: Berserker 2nd/3rd wild anguish should be shared with just a rock

/* harmony default export */ const heroes_gauntlet = ({
  zoneId: zone_id/* default.TheHeroesGauntlet */.Z.TheHeroesGauntlet,
  damageWarn: {
    'THG Blade\'s Benison': '5228', // pld conal
    'THG Absolute Holy': '524B', // whm very large aoe
    'THG Hissatsu: Goka': '523D', // sam line aoe
    'THG Whole Self': '522D', // mnk wide line aoe
    'THG Randgrith': '5232', // drg very big line aoe
    'THG Vacuum Blade 1': '5061', // Spectral Thief circular ground aoe from marker
    'THG Vacuum Blade 2': '5062', // Spectral Thief circular ground aoe from marker
    'THG Coward\'s Cunning': '4FD7', // Spectral Thief Chicken Knife laser
    'THG Papercutter 1': '4FD1', // Spectral Thief line aoe from marker
    'THG Papercutter 2': '4FD2', // Spectral Thief line aoe from marker
    'THG Ring of Death': '5236', // drg circular aoe
    'THG Lunar Eclipse': '5227', // pld circular aoe
    'THG Absolute Gravity': '5248', // ink mage circular
    'THG Rain of Light': '5242', // bard large circule aoe
    'THG Dooming Force': '5239', // drg line aoe
    'THG Absolute Dark II': '4F61', // Necromancer 120 degree conal
    'THG Burst': '53B7', // Necromancer necroburst small zombie explosion
    'THG Pain Mire': '4FA4', // Necromancer very large green bleed puddle
    'THG Dark Deluge': '4F5D', // Necromancer ground aoe
    'THG Tekka Gojin': '523E', // sam 90 degree conal
    'THG Raging Slice 1': '520A', // Berserker line cleave
    'THG Raging Slice 2': '520B', // Berserker line cleave
    'THG Wild Rage': '5203', // Berserker blue knockback puck
  },
  shareWarn: {
    'THG Absolute Thunder IV': '5245', // headmarker aoe from blm
    'THG Moondiver': '5233', // headmarker aoe from drg
    'THG Spectral Gust': '53CF', // Spectral Thief headmarker aoe
  },
  shareFail: {
    'THG Falling Rock': '5205', // Berserker headmarker aoe that creates rubble
  },
  gainsEffectWarn: {
    'THG Bleeding': '828', // Standing in the Necromancer puddle or outside the Berserker arena
  },
  gainsEffectFail: {
    'THG Truly Berserk': '906', // Standing in the crater too long
  },
  triggers: [
    {
      id: 'THG Wild Anguish',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '5209' }),
      // This should always be shared.  On all times but the 2nd and 3rd, it's a party share.
      // TODO: on the 2nd and 3rd time this should only be shared with a rock.
      // TODO: alternatively warn on taking one of these with a 472 Magic Vulnerability Up effect
      condition: (e) => e.type === '15',
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'THG Wild Rampage',
      damageRegex: '5207',
      // This is zero damage if you are in the crater.
      condition: (e) => e.damage > 0,
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/holminster_switch.js


/* harmony default export */ const holminster_switch = ({
  zoneId: zone_id/* default.HolminsterSwitch */.Z.HolminsterSwitch,
  damageWarn: {
    'Holminster Thumbscrew': '3DC6',
    'Holminster Wooden horse': '3DC7',
    'Holminster Light Shot': '3DC8',
    'Holminster Heretic\'s Fork': '3DCE',
    'Holminster Holy Water': '3DD4',
    'Holminster Fierce Beating 1': '3DDD',
    'Holminster Fierce Beating 2': '3DDE',
    'Holminster Fierce Beating 3': '3DDF',
    'Holminster Cat O\' Nine Tails': '3DE1',
    'Holminster Right Knout': '3DE6',
    'Holminster Left Knout': '3DE7',
  },
  damageFail: {
    'Holminster Aethersup': '3DE9',
  },
  shareWarn: {
    'Holminster Flagellation': '3DD6',
  },
  shareFail: {
    'Holminster Taphephobia': '4181',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/malikahs_well.js


/* harmony default export */ const malikahs_well = ({
  zoneId: zone_id/* default.MalikahsWell */.Z.MalikahsWell,
  damageWarn: {
    'Malikah Falling Rock': '3CEA',
    'Malikah Wellbore': '3CED',
    'Malikah Geyser Eruption': '3CEE',
    'Malikah Swift Spill': '3CF0',
    'Malikah Breaking Wheel 1': '3CF5',
    'Malikah Crystal Nail': '3CF7',
    'Malikah Heretic\'s Fork 1': '3CF9',
    'Malikah Breaking Wheel 2': '3CFA',
    'Malikah Heretic\'s Fork 2': '3E0E',
    'Malikah Earthshake': '3E39',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/matoyas_relict.js


// TODO: could include 5484 Mudman Rocky Roll as a shareWarn, but it's low damage and common.

/* harmony default export */ const matoyas_relict = ({
  zoneId: zone_id/* default.MatoyasRelict */.Z.MatoyasRelict,
  damageWarn: {
    'Matoya Relict Werewood Ovation': '5518', // line aoe
    'Matoya Cave Tarantula Hawk Apitoxin': '5519', // big circle aoe
    'Matoya Spriggan Stonebearer Romp': '551A', // conal aoe
    'Matoya Sonny Of Ziggy Jittering Glare': '551C', // long narrow conal aoe
    'Matoya Mudman Quagmire': '5481', // Mudman aoe puddles
    'Matoya Mudman Brittle Breccia 1': '548E', // expanding circle aoe
    'Matoya Mudman Brittle Breccia 2': '548F', // expanding circle aoe
    'Matoya Mudman Brittle Breccia 3': '5490', // expanding circle aoe
    'Matoya Mudman Mud Bubble': '5487', // standing in mud puddle?
    'Matoya Cave Pugil Screwdriver': '551E', // conal aoe
    'Matoya Nixie Gurgle': '5992', // Nixie wall flush
    'Matoya Relict Molten Phoebad Pyroclastic Shot': '57EB', // the line aoes as you run to trash
    'Matoya Relict Flan Flood': '5523', // big circle aoe
    'Matoya Pyroduct Eldthurs Mash': '5527', // line aoe
    'Matyoa Pyroduct Eldthurs Spin': '5528', // very large circle aoe
    'Matoya Relict Bavarois Thunder III': '5525', // circle aoe
    'Matoya Relict Marshmallow Ancient Aero': '5524', // very large line groaoe
    'Matoya Relict Pudding Fire II': '5522', // circle aoe
    'Matoya Relict Molten Phoebad Hot Lava': '57E9', // conal aoe
    'Matoya Relict Molten Phoebad Volcanic Drop': '57E8', // circle aoe
    'Matoya Mother Porxie Medium Rear': '591D', // knockback into safe circle aoe
    'Matoya Mother Porxie Barbeque Line': '5917', // line aoe during bbq
    'Matoya Mother Porxie Barbeque Circle': '5918', // circle aoe during bbq
    'Matoya Mother Porxie To A Crisp': '5925', // getting to close to boss during bbq
    'Matoya Mother Proxie Buffet': '5926', // Aeolian Cave Sprite line aoe (is this a pun?)
  },
  damageFail: {
    'Matoya Nixie Sea Shanty': '598C', // Not taking the puddle up to the top? Failing add enrage?
  },
  shareWarn: {
    'Matoya Nixie Crack': '5990', // Nixie Crash-Smash tank tethers
    'Matoya Nixie Sputter': '5993', // Nixie spread marker
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/mt_gulg.js


/* harmony default export */ const mt_gulg = ({
  zoneId: zone_id/* default.MtGulg */.Z.MtGulg,
  damageWarn: {
    'Gulg Immolation': '41AA',
    'Gulg Tail Smash': '41AB',
    'Gulg Heavenslash': '41A9',
    'Gulg Typhoon Wing 1': '3D00',
    'Gulg Typhoon Wing 2': '3D01',
    'Gulg Hurricane Wing': '3D03',
    'Gulg Earth Shaker': '37F5',
    'Gulg Sanctification': '41AE',
    'Gulg Exegesis': '3D07',
    'Gulg Perfect Contrition': '3D0E',
    'Gulg Sanctified Aero': '41AD',
    'Gulg Divine Diminuendo 1': '3D16',
    'Gulg Divine Diminuendo 2': '3D18',
    'Gulg Divine Diminuendo 3': '4669',
    'Gulg Divine Diminuendo 4': '3D19',
    'Gulg Divine Diminuendo 5': '3D21',
    'Gulg Conviction Marcato 1': '3D1A',
    'Gulg Conviction Marcato 2': '3D1B',
    'Gulg Conviction Marcato 3': '3D20',
    'Gulg Vena Amoris': '3D27',
  },
  damageFail: {
    'Gulg Lumen Infinitum': '41B2',
    'Gulg Right Palm': '37F8',
    'Gulg Left Palm': '37FA',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/paglthan.js


// TODO: What to do about Kahn Rai 5B50?
// It seems impossible for the marked person to avoid entirely.

/* harmony default export */ const paglthan = ({
  zoneId: zone_id/* default.Paglthan */.Z.Paglthan,
  damageWarn: {
    'Paglthan Telovouivre Plague Swipe': '60FC', // frontal conal cleave
    'Paglthan Lesser Telodragon Engulfing Flames': '60F5', // frontal conal cleave
    'Paglthan Amhuluk Lightning Bolt': '5C4C', // circular lightning aoe (on self or post)
    'Paglthan Amhuluk Ball Of Levin Shock': '5C52', // pulsing small circular aoes
    'Paglthan Amhuluk Supercharged Ball Of Levin Shock': '5C53', // pulsing large circular aoe
    'Paglthan Amhuluk Wide Blaster': '60C5', // rear conal cleave
    'Paglthan Telobrobinyak Fall Of Man': '6148', // circular aoe
    'Paglthan Telotek Reaper Magitek Cannon': '6121', // circular aoe
    'Paglthan Telodragon Sheet of Ice': '60F8', // circular aoe
    'Paglthan Telodragon Frost Breath': '60F7', // very large conal cleave
    'Paglthan Magitek Core Stable Cannon': '5C94', // large line aoes
    'Paglthan Magitek Core 2-Tonze Magitek Missile': '5C95', // large circular aoe
    'Paglthan Telotek Sky Armor Aethershot': '5C9C', // circular aoe
    'Paglthan Mark II Telotek Colossus Exhaust': '5C99', // large line aoe
    'Paglthan Magitek Missile Explosive Force': '5C98', // slow moving horizontal missiles
    'Paglthan Tiamat Flamisphere': '610F', // very long line aoe
    'Paglthan Armored Telodragon Tortoise Stomp': '614B', // large circular aoe from turtle
    'Paglthan Telodragon Thunderous Breath': '6149', // large conal cleave
    'Paglthan Lunar Bahamut Lunar Nail Upburst': '605B', // small aoes before Big Burst
    'Paglthan Lunar Bahamut Lunar Nail Big Burst': '5B48', // large circular aoes from nails
    'Paglthan Lunar Bahamut Perigean Breath': '5B59', // large conal cleave
    'Paglthan Lunar Bahamut Megaflare': '5B4E', // megaflare pepperoni
    'Paglthan Lunar Bahamut Megaflare Dive': '5B52', // megaflare line aoe across the arena
    'Paglthan Lunar Bahamut Lunar Flare': '5B4A', // large purple shrinking circles
  },
  shareWarn: {
    'Paglthan Lunar Bahamut Megaflare': '5B4D', // megaflare spread markers
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/qitana_ravel.js


/* harmony default export */ const qitana_ravel = ({
  zoneId: zone_id/* default.TheQitanaRavel */.Z.TheQitanaRavel,
  damageWarn: {
    'Qitana Sun Toss': '3C8A', // Ground AoE, boss one
    'Qitana Ronkan Light 1': '3C8C', // Statue attack, boss one
    'Qitana Lozatl\'s Fury 1': '3C8F', // Semicircle cleave, boss one
    'Qitana Lozatl\'s Fury 2': '3C90', // Semicircle cleave, boss one
    'Qitana Falling Rock': '3C96', // Small ground AoE, boss two
    'Qitana Falling Boulder': '3C97', // Large ground AoE, boss two
    'Qitana Towerfall': '3C98', // Pillar collapse, boss two
    'Qitana Viper Poison 2': '3C9E', // Stationary poison puddles, boss three
    'Qitana Confession of Faith 1': '3CA2', // Dangerous middle during spread circles, boss three
    'Qitana Confession of Faith 3': '3CA6', // Dangerous sides during stack marker, boss three
    'Qitana Confession of Faith 4': '3CA7', // Dangerous sides during stack marker, boss three
    'Qitana Ronkan Light 2': '3D6D', // Statue attack, boss one
    'Qitana Wrath of the Ronka': '3E2C', // Statue line attack from mini-bosses before first boss
    'Qitana Sinspitter': '3E36', // Gorilla boulder toss AoE before third boss
    'Qitana Hound out of Heaven': '42B8', // Tether extension failure, boss three; 42B7 is correct execution
    'Qitana Ronkan Abyss': '43EB', // Ground AoE from mini-bosses before first boss
  },
  shareWarn: {
    'Qitana Viper Poison 1': '3C9D', // AoE from the 00AB poison head marker, boss three
    'Qitana Confession of Faith 2': '3CA3', // Overlapped circles failure on the spread circles version of the mechanic
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/the_grand_cosmos.js


// The Grand Cosmos
/* harmony default export */ const the_grand_cosmos = ({
  zoneId: zone_id/* default.TheGrandCosmos */.Z.TheGrandCosmos,
  damageWarn: {
    'Cosmos Iron Justice': '491F',
    'Cosmos Smite Of Rage': '4921',

    'Cosmos Tribulation': '49A4',
    'Cosmos Dark Shock': '476F',
    'Cosmos Sweep': '4770',
    'Cosmos Deep Clean': '4771',

    'Cosmos Shadow Burst': '4924',
    'Cosmos Bloody Caress': '4927',
    'Cosmos Nepenthic Plunge': '4928',
    'Cosmos Brewing Storm': '4929',

    'Cosmos Ode To Fallen Petals': '4950',
    'Cosmos Far Wind Ground': '4273',

    'Cosmos Fire Breath': '492B',
    'Cosmos Ronkan Freeze': '492E',
    'Cosmos Overpower': '492D',

    'Cosmos Scorching Left': '4763',
    'Cosmos Scorching Right': '4762',
    'Cosmos Otherwordly Heat': '475C',
    'Cosmos Fire\'s Ire': '4761',
    'Cosmos Plummet': '4767',

    'Cosmos Fire\'s Domain Tether': '475F',
  },
  shareWarn: {
    'Cosmos Dark Well': '476D',
    'Cosmos Far Wind Spread': '4724',
    'Cosmos Black Flame': '475D',
    'Cosmos Fire\'s Domain': '4760',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/twinning.js


/* harmony default export */ const twinning = ({
  zoneId: zone_id/* default.TheTwinning */.Z.TheTwinning,
  damageWarn: {
    'Twinning Auto Cannons': '43A9',
    'Twinning Heave': '3DB9',
    'Twinning 32 Tonze Swipe': '3DBB',
    'Twinning Sideswipe': '3DBF',
    'Twinning Wind Spout': '3DBE',
    'Twinning Shock': '3DF1',
    'Twinning Laserblade': '3DEC',
    'Twinning Vorpal Blade': '3DC2',
    'Twinning Thrown Flames': '3DC3',
    'Twinning Magitek Ray': '3DF3',
    'Twinning High Gravity': '3DFA',
  },
  damageFail: {
    'Twinning 128 Tonze Swipe': '3DBA',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/eureka/delubrum_reginae.js


// TODO: Dead Iron 5AB0 (earthshakers, but only if you take two?)

/* harmony default export */ const delubrum_reginae = ({
  zoneId: zone_id/* default.DelubrumReginae */.Z.DelubrumReginae,
  damageWarn: {
    'Delubrum Seeker Mercy Fourfold': '5B34', // Four glowing sword half room cleaves
    'Delubrum Seeker Baleful Swathe': '5AB4', // Ground aoe to either side of boss
    'Delubrum Seeker Baleful Blade': '5B28', // Hide behind pillars attack
    'Delubrum Seeker Iron Splitter Blue 1': '5AA4', // Blue ring explosion
    'Delubrum Seeker Iron Splitter Blue 2': '5AA5', // Blue ring explosion
    'Delubrum Seeker Iron Splitter Blue 3': '5AA6', // Blue ring explosion
    'Delubrum Seeker Iron Splitter White 1': '5AA7', // White ring explosion
    'Delubrum Seeker Iron Splitter White 2': '5AA8', // White ring explosion
    'Delubrum Seeker Iron Splitter White 3': '5AA9', // White ring explosion
    'Delubrum Seeker Scorching Shackle': '5AAE', // Chain damage
    'Delubrum Seeker Merciful Breeze': '5AAB', // Waffle criss-cross floor markers
    'Delubrum Seeker Merciful Blooms': '5AAD', // Purple growing circle
    'Delubrum Dahu Right-Sided Shockwave': '5761', // Right circular cleave
    'Delubrum Dahu Left-Sided Shockwave': '5762', // Left circular cleave
    'Delubrum Dahu Firebreathe': '5765', // Conal breath
    'Delubrum Dahu Firebreathe Rotating': '575A', // Conal breath, rotating
    'Delubrum Dahu Head Down': '5756', // line aoe charge from Marchosias add
    'Delubrum Dahu Hunter\'s Claw': '5757', // circular ground aoe centered on Marchosias add
    'Delubrum Dahu Falling Rock': '575C', // ground aoe from Reverberating Roar
    'Delubrum Dahu Hot Charge': '5764', // double charge
    'Delubrum Dahu Ripper Claw': '575D', // frontal cleave
    'Delubrum Dahu Tail Swing': '575F', // tail swing ;)
    'Delubrum Guard Pawn Off': '5806', // Queen's Soldier Secrets Revealed tethered clone aoe
    'Delubrum Guard Turret\'s Tour 1': '580D', // Queen's Gunner reflective turret shot
    'Delubrum Guard Turret\'s Tour 2': '580E', // Queen's Gunner reflective turret shot
    'Delubrum Guard Turret\'s Tour 3': '580F', // Queen's Gunner reflective turret shot
    'Delubrum Guard Optimal Play Shield': '57F3', // Queen's Knight shield get under
    'Delubrum Guard Optimal Play Sword': '57F2', // Queen's Knight sword get out
    'Delubrum Guard Counterplay': '57F6', // Hitting aetherial ward directional barrier
    'Delubrum Phantom Swirling Miasma 1': '57A9', // Initial phantom donut aoe from circle
    'Delubrum Phantom Swirling Miasma 2': '57AA', // Moving phantom donut aoes from circle
    'Delubrum Phantom Creeping Miasma': '57A5', // phantom line aoe from square
    'Delubrum Phantom Vile Wave': '57B1', // phantom conal aoe
    'Delubrum Avowed Fury Of Bozja': '5973', // Trinity Avowed Allegiant Arsenal "out"
    'Delubrum Avowed Flashvane': '5972', // Trinity Avowed Allegiant Arsenal "get behind"
    'Delubrum Avowed Infernal Slash': '5971', // Trinity Avowed Allegiant Arsenal "get front"
    'Delubrum Avowed Flames Of Bozja': '5968', // 80% floor aoe before shimmering shot swords
    'Delubrum Avowed Gleaming Arrow': '5974', // Trinity Avatar line aoes from outside
    'Delubrum Queen The Means 1': '59BB', // The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen The Means 2': '59BD', // The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen The End 1': '59BA', // Also The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen The End 2': '59BC', // Also The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen Northswain\'s Glow': '59C4', // expanding lines with explosion intersections
    'Delubrum Queen Judgment Blade Left': '5B83', // dash across room with left cleave
    'Delubrum Queen Judgment Blade Right': '5B83', // dash across room with right cleave
    'Delubrum Queen Queen\'s Justice': '59BF', // failing to walk the right number of squares
    'Delubrum Queen Turret\'s Tour 1': '59E0', // reflective turret shot during Queen
    'Delubrum Queen Turret\'s Tour 2': '59E1', // reflective turret shot during Queen
    'Delubrum Queen Turret\'s Tour 3': '59E2', // reflective turret shot during Queen
    'Delubrum Queen Pawn Off': '59DA', // Secrets Revealed tethered clone aoe during Queen
    'Delubrum Queen Optimal Play Shield': '59CE', // Queen's Knight shield get under during Queen
    'Delubrum Queen Optimal Play Sword': '59CC', // Queen's Knight sword get out during Queen
  },
  damageFail: {
    'Delubrum Hidden Trap Massive Explosion': '5A6E', // explosion trap
    'Delubrum Hidden Trap Poison Trap': '5A6F', // poison trap
    'Delubrum Avowed Heat Shock': '595E', // too much heat or failing to regulate temperature
    'Delubrum Avowed Cold Shock': '595F', // too much cold or failing to regulate temperature
  },
  shareFail: {
    'Delubrum Dahu Heat Breath': '5766', // tank cleave
    'Delubrum Avowed Wrath Of Bozja': '5975', // tank cleave
  },
  gainsEffectWarn: {
    'Delubrum Seeker Merciful Moon': '262', // "Petrification" from Aetherial Orb lookaway
  },
  triggers: [
    {
      // At least during The Queen, these ability ids can be ordered differently,
      // and the first explosion "hits" everyone, although with "1B" flags.
      id: 'Delubrum Lots Cast',
      damageRegex: ['565A', '565B', '57FD', '57FE', '5B86', '5B87', '59D2', '5D93'],
      condition: (e) => e.flags.slice(-2) === '03',
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/eureka/delubrum_reginae_savage.js


// TODO: Dahu 5776 Spit Flame should always hit a Marchosias
// TODO: hitting phantom with ice spikes with anything but dispel?
// TODO: failing icy/fiery portent (guard and queen)
//       `18:Pyretic DoT Tick on ${name} for ${damage} damage.`
// TODO: Winds Of Fate / Weight Of Fortune?
// TODO: Turret's Tour?
// general traps: explosion: 5A71, poison trap: 5A72, mini: 5A73
// duel traps: mini: 57A1, ice: 579F, toad: 57A0
// TODO: taking mana flame without reflect
// TODO: taking Maelstrom's Bolt without lightning buff

/* harmony default export */ const delubrum_reginae_savage = ({
  zoneId: zone_id/* default.DelubrumReginaeSavage */.Z.DelubrumReginaeSavage,
  damageWarn: {
    'DelubrumSav Seeker Slimes Hellish Slash': '57EA', // Bozjan Soldier cleave
    'DelubrumSav Seeker Slimes Viscous Rupture': '5016', // Fully merged viscous slime aoe

    'DelubrumSav Seeker Golems Demolish': '5880', // interruptible Ruins Golem cast

    'DelubrumSav Seeker Baleful Swathe': '5AD1', // Ground aoe to either side of boss
    'DelubrumSav Seeker Baleful Blade': '5B2A', // Hide behind pillars attack
    'DelubrumSav Seeker Scorching Shackle': '5ACB', // Chains
    'DelubrumSav Seeker Mercy Fourfold 1': '5B94', // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 2': '5AB9', // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 3': '5ABA', // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 4': '5ABB', // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 5': '5ABC', // Four glowing sword half room cleaves
    'DelubrumSav Seeker Merciful Breeze': '5AC8', // Waffle criss-cross floor markers
    'DelubrumSav Seeker Baleful Comet': '5AD7', // Clone meteor dropping before charges
    'DelubrumSav Seeker Baleful Firestorm': '5AD8', // Clone charge after Baleful Comet
    'DelubrumSav Seeker Iron Rose': '5AD9', // Clone line aoes
    'DelubrumSav Seeker Iron Splitter Blue 1': '5AC1', // Blue rin g explosion
    'DelubrumSav Seeker Iron Splitter Blue 2': '5AC2', // Blue ring explosion
    'DelubrumSav Seeker Iron Splitter Blue 3': '5AC3', // Blue ring explosion
    'DelubrumSav Seeker Iron Splitter White 1': '5AC4', // White ring explosion
    'DelubrumSav Seeker Iron Splitter White 2': '5AC5', // White ring explosion
    'DelubrumSav Seeker Iron Splitter White 3': '5AC6', // White ring explosion
    'DelubrumSav Seeker Act Of Mercy': '5ACF', // cross-shaped line aoes

    'DelubrumSav Dahu Right-Sided Shockwave 1': '5770', // Right circular cleave
    'DelubrumSav Dahu Right-Sided Shockwave 2': '5772', // Right circular cleave
    'DelubrumSav Dahu Left-Sided Shockwave 1': '576F', // Left circular cleave
    'DelubrumSav Dahu Left-Sided Shockwave 2': '5771', // Left circular cleave
    'DelubrumSav Dahu Firebreathe': '5774', // Conal breath
    'DelubrumSav Dahu Firebreathe Rotating': '576C', // Conal breath, rotating
    'DelubrumSav Dahu Head Down': '5768', // line aoe charge from Marchosias add
    'DelubrumSav Dahu Hunter\'s Claw': '5769', // circular ground aoe centered on Marchosias add
    'DelubrumSav Dahu Falling Rock': '576E', // ground aoe from Reverberating Roar
    'DelubrumSav Dahu Hot Charge': '5773', // double charge

    'DelubrumSav Duel Massive Explosion': '579E', // bombs being cleared
    'DelubrumSav Duel Vicious Swipe': '5797', // circular aoe around boss
    'DelubrumSav Duel Focused Tremor 1': '578F', // square floor aoes
    'DelubrumSav Duel Focused Tremor 2': '5791', // square floor aoes
    'DelubrumSav Duel Devour': '5789', // conal aoe after withering curse
    'DelubrumSav Duel Flailing Strike 1': '578C', // initial rotating cleave
    'DelubrumSav Duel Flailing Strike 2': '578D', // rotating cleaves

    'DelubrumSav Guard Optimal Offensive Sword': '5819', // middle explosion
    'DelubrumSav Guard Optimal Offensive Shield': '581A', // middle explosion
    'DelubrumSav Guard Optimal Play Sword': '5816', // Optimal Play Sword "get out"
    'DelubrumSav Guard Optimal Play Shield': '5817', // Optimal play shield "get in"
    'DelubrumSav Guard Optimal Play Cleave': '5818', // Optimal Play cleaves for sword/shield
    'DelubrumSav Guard Unlucky Lot': '581D', // Queen's Knight orb explosion
    'DelubrumSav Guard Burn 1': '583D', // small fire adds
    'DelubrumSav Guard Burn 2': '583E', // large fire adds
    'DelubrumSav Guard Pawn Off': '583A', // Queen's Soldier Secrets Revealed tethered clone aoe
    'DelubrumSav Guard Turret\'s Tour Normal 1': '5847', // "normal mode" turrets, initial lines 1
    'DelubrumSav Guard Turret\'s Tour Normal 2': '5848', // "normal mode" turrets, initial lines 2
    'DelubrumSav Guard Turret\'s Tour Normal 3': '5849', // "normal mode" turrets, second lines
    'DelubrumSav Guard Counterplay': '58F5', // Hitting aetherial ward directional barrier

    'DelubrumSav Phantom Swirling Miasma 1': '57B8', // Initial phantom donut aoe
    'DelubrumSav Phantom Swirling Miasma 2': '57B9', // Moving phantom donut aoes
    'DelubrumSav Phantom Creeping Miasma 1': '57B4', // Initial phantom line aoe
    'DelubrumSav Phantom Creeping Miasma 2': '57B5', // Later phantom line aoe
    'DelubrumSav Phantom Lingering Miasma 1': '57B6', // Initial phantom circle aoe
    'DelubrumSav Phantom Lingering Miasma 2': '57B7', // Moving phantom circle aoe
    'DelubrumSav Phantom Vile Wave': '57BF', // phantom conal aoe

    'DelubrumSav Avowed Fury Of Bozja': '594C', // Trinity Avowed Allegiant Arsenal "out"
    'DelubrumSav Avowed Flashvane': '594B', // Trinity Avowed Allegiant Arsenal "get behind"
    'DelubrumSav Avowed Infernal Slash': '594A', // Trinity Avowed Allegiant Arsenal "get front"
    'DelubrumSav Avowed Flames Of Bozja': '5939', // 80% floor aoe before shimmering shot swords
    'DelubrumSav Avowed Gleaming Arrow': '594D', // Trinity Avatar line aoes from outside

    'DelubrumSav Lord Whack': '57D0', // cleave
    'DelubrumSav Lord Devastating Bolt 1': '57C5', // lightning rings
    'DelubrumSav Lord Devastating Bolt 2': '57C6', // lightning rings
    'DelubrumSav Lord Electrocution': '57CC', // random circle aoes
    'DelubrumSav Lord Rapid Bolts': '57C3', // dropped lightning aoes
    'DelubrumSav Lord 1111-Tonze Swing': '57D8', // very large "get out" swing
    'DelubrumSav Lord Monk Attack': '55A6', // Monk add auto-attack

    'DelubrumSav Queen Northswain\'s Glow': '59F4', // expanding lines with explosion intersections
    'DelubrumSav Queen The Means 1': '59E7', // The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen The Means 2': '59EA', // The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen The End 1': '59E8', // Also The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen The End 2': '59E9', // Also The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen Optimal Offensive Sword': '5A02', // middle explosion
    'DelubrumSav Queen Optimal Offensive Shield': '5A03', // middle explosion
    'DelubrumSav Queen Judgment Blade Left 1': '59F2', // dash across room with left cleave
    'DelubrumSav Queen Judgment Blade Left 2': '5B85', // dash across room with left cleave
    'DelubrumSav Queen Judgment Blade Right 1': '59F1', // dash across room with right cleave
    'DelubrumSav Queen Judgment Blade Right 2': '5B84', // dash across room with right cleave
    'DelubrumSav Queen Pawn Off': '5A1D', // Queen's Soldier Secrets Revealed tethered clone aoe
    'DelubrumSav Queen Optimal Play Sword': '59FF', // Optimal Play Sword "get out"
    'DelubrumSav Queen Optimal Play Shield': '5A00', // Optimal play shield "get in"
    'DelubrumSav Queen Optimal Play Cleave': '5A01', // Optimal Play cleaves for sword/shield
    'DelubrumSav Queen Turret\'s Tour Normal 1': '5A28', // "normal mode" turrets, initial lines 1
    'DelubrumSav Queen Turret\'s Tour Normal 2': '5A2A', // "normal mode" turrets, initial lines 2
    'DelubrumSav Queen Turret\'s Tour Normal 3': '5A29', // "normal mode" turrets, second lines
  },
  damageFail: {
    'DelubrumSav Avowed Heat Shock': '5927', // too much heat or failing to regulate temperature
    'DelubrumSav Avowed Cold Shock': '5928', // too much cold or failing to regulate temperature
    'DelubrumSav Queen Queen\'s Justice': '59EB', // failing to walk the right number of squares
    'DelubrumSav Queen Gunnhildr\'s Blades': '5B22', // not being in the chess blue safe square
    'DelubrumSav Queen Unlucky Lot': '55B6', // lightning orb attack
  },
  shareWarn: {
    'DelubrumSav Seeker Phantom Baleful Onslaught': '5AD6', // solo tank cleave
    'DelubrumSav Lord Foe Splitter': '57D7', // tank cleave
  },
  gainsEffectWarn: {
    'DelubrumSav Seeker Merciful Moon': '262', // "Petrification" from Aetherial Orb lookaway
  },
  triggers: [
    {
      // These ability ids can be ordered differently and "hit" people when levitating.
      id: 'DelubrumSav Guard Lots Cast',
      damageRegex: ['5827', '5828', '5B6C', '5B6D', '5BB6', '5BB7', '5B88', '5B89'],
      condition: (e) => e.flags.slice(-2) === '03',
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'DelubrumSav Golem Compaction',
      abilityRegex: '5746',
      mistake: (_e, _data, matches) => {
        return { type: 'fail', fullText: `${matches.source}: ${matches.ability}` };
      },
    },
    {
      id: 'DelubrumSav Slime Sanguine Fusion',
      abilityRegex: '554D',
      mistake: (_e, _data, matches) => {
        return { type: 'fail', fullText: `${matches.source}: ${matches.ability}` };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e1n.js


/* harmony default export */ const e1n = ({
  zoneId: zone_id/* default.EdensGateResurrection */.Z.EdensGateResurrection,
  damageWarn: {
    'E1N Eden\'s Thunder III': '44ED',
    'E1N Eden\'s Blizzard III': '44EC',
    'E1N Pure Beam': '3D9E',
    'E1N Paradise Lost': '3DA0',
  },
  damageFail: {
    'E1N Eden\'s Flare': '3D97',
    'E1N Pure Light': '3DA3',
  },
  triggers: [
    // Things that should only hit one person.
    {
      id: 'E1N Fire III',
      damageRegex: '44EB',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E1N Tank Lasers',
      // Vice Of Vanity
      damageRegex: '44E7',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E1N DPS Puddles',
      // Vice Of Apathy
      damageRegex: '44E8',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e1s.js


// TODO: failing to interrupt Mana Boost (3D8D)
// TODO: failing to pass healer debuff?
// TODO: what happens if you don't kill a meteor during four orbs?
/* harmony default export */ const e1s = ({
  zoneId: zone_id/* default.EdensGateResurrectionSavage */.Z.EdensGateResurrectionSavage,
  damageWarn: {
    'E1S Eden\'s Thunder III': '44F7',
    'E1S Eden\'s Blizzard III': '44F6',
    'E1S Eden\'s Regained Blizzard III': '44FA',
    'E1S Pure Beam Trident 1': '3D83',
    'E1S Pure Beam Trident 2': '3D84',
    'E1S Paradise Lost': '3D87',
  },
  damageFail: {
    'E1S Eden\'s Flare': '3D73',
    'E1S Pure Light': '3D8A',
  },
  triggers: [
    // Things that should only hit one person.
    {
      id: 'E1S Fire/Thunder III',
      damageRegex: '44FB',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E1S Pure Beam Single',
      damageRegex: '3D81',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E1S Tank Lasers',
      // Vice Of Vanity
      damageRegex: '44F1',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E1S DPS Puddles',
      // Vice Of Apathy
      damageRegex: '44F2',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e2n.js


// TODO: shadoweye failure (top line fail, bottom line success, effect there too)
// [16:17:35.966] 16:400110FE:Voidwalker:40B7:Shadoweye:10612345:Tini Poutini:F:10000:100190F:
// [16:17:35.966] 16:400110FE:Voidwalker:40B7:Shadoweye:1067890A:Potato Chippy:1:0:1C:8000:
// gains the effect of Petrification from Voidwalker for 10.00 Seconds.
// TODO: puddle failure?
/* harmony default export */ const e2n = ({
  zoneId: zone_id/* default.EdensGateDescent */.Z.EdensGateDescent,
  damageWarn: {
    'E2N Doomvoid Slicer': '3E3C',
    'E2N Doomvoid Guillotine': '3E3B',
  },
  triggers: [
    {
      id: 'E2N Nyx',
      damageRegex: '3E3D',
      mistake: (e) => {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'Booped',
            de: e.abilityName,
            fr: 'Malus de dégâts',
            ja: e.abilityName,
            cn: e.abilityName,
            ko: '닉스',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e2s.js



// TODO: shadoweye failure
// TODO: Empty Hate (3E59/3E5A) hits everybody, so hard to tell about knockback
// TODO: maybe mark hell wind people who got clipped by stack?
// TODO: missing puddles?
// TODO: missing light/dark circle stack
/* harmony default export */ const e2s = ({
  zoneId: zone_id/* default.EdensGateDescentSavage */.Z.EdensGateDescentSavage,
  damageWarn: {
    'E2S Doomvoid Slicer': '3E50',
    'E3S Empty Rage': '3E6C',
    'E3S Doomvoid Guillotine': '3E4F',
  },
  shareWarn: {
    'E2S Doomvoid Cleaver': '3E64',
  },
  triggers: [
    {
      id: 'E2S Shadoweye',
      // Stone Curse
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '589' }),
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'E2S Nyx',
      damageRegex: '3E51',
      mistake: (e) => {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'Booped',
            de: e.abilityName,
            fr: 'Malus de dégâts',
            ja: e.abilityName,
            cn: '攻击伤害降低',
            ko: '닉스',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e3n.js


/* harmony default export */ const e3n = ({
  zoneId: zone_id/* default.EdensGateInundation */.Z.EdensGateInundation,
  damageWarn: {
    'E3N Monster Wave 1': '3FCA',
    'E3N Monster Wave 2': '3FE9',
    'E3N Maelstrom': '3FD9',
    'E3N Swirling Tsunami': '3FD5',
  },
  damageFail: {
    'E3N Temporary Current 1': '3FCE',
    'E3N Temporary Current 2': '3FCD',
    'E3N Spinning Dive': '3FDB',
  },
  triggers: [
    {
      id: 'E3N Rip Current',
      damageRegex: '3FC7',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e3s.js


// TODO: Scouring Tsunami (3CE0) on somebody other than target
// TODO: Sweeping Tsunami (3FF5) on somebody other than tanks
// TODO: Rip Current (3FE0, 3FE1) on somebody other than target/tanks
// TODO: Boiled Alive (4006) is failing puddles???
// TODO: failing to cleanse Splashing Waters
// TODO: does getting hit by undersea quake cause an ability?
/* harmony default export */ const e3s = ({
  zoneId: zone_id/* default.EdensGateInundationSavage */.Z.EdensGateInundationSavage,
  damageWarn: {
    'E3S Monster Wave 1': '3FE5',
    'E3S Monster Wave 2': '3FE9',
    'E3S Maelstrom': '3FFB',
    'E3S Swirling Tsunami': '3FF4',
  },
  damageFail: {
    'E3S Temporary Current 1': '3FEA',
    'E3S Temporary Current 2': '3FEB',
    'E3S Temporary Current 3': '3FEC',
    'E3S Temporary Current 4': '3FED',
    'E3S Spinning Dive': '3FFD',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e4n.js


/* harmony default export */ const e4n = ({
  zoneId: zone_id/* default.EdensGateSepulture */.Z.EdensGateSepulture,
  damageWarn: {
    'E4N Weight of the Land': '40EB',
    'E4N Evil Earth': '40EF',
    'E4N Aftershock 1': '41B4',
    'E4N Aftershock 2': '40F0',
    'E4N Explosion 1': '40ED',
    'E4N Explosion 2': '40F5',
    'E4N Landslide': '411B',
    'E4N Rightward Landslide': '4100',
    'E4N Leftward Landslide': '40FF',
    'E4N Massive Landslide': '40FC',
    'E4N Seismic Wave': '40F3',
    'E4N Fault Line': '4101',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e4s.js



// TODO: could track people get hitting by markers they shouldn't
// TODO: could track non-tanks getting hit by tankbusters, megaliths
// TODO: could track non-target getting hit by tankbuster
/* harmony default export */ const e4s = ({
  zoneId: zone_id/* default.EdensGateSepultureSavage */.Z.EdensGateSepultureSavage,
  damageWarn: {
    'E4S Weight of the Land': '4108',
    'E4S Evil Earth': '410C',
    'E4S Aftershock 1': '41B5',
    'E4S Aftershock 2': '410D',
    'E4S Explosion': '410A',
    'E4S Landslide': '411B',
    'E4S Rightward Landslide': '411D',
    'E4S Leftward Landslide': '411C',
    'E4S Massive Landslide 1': '4118',
    'E4S Massive Landslide 2': '4119',
    'E4S Seismic Wave': '4110',
  },
  damageFail: {
    'E4S Dual Earthen Fists 1': '4135',
    'E4S Dual Earthen Fists 2': '4687',
    'E4S Plate Fracture': '43EA',
    'E4S Earthen Fist 1': '43CA',
    'E4S Earthen Fist 2': '43C9',
  },
  triggers: [
    {
      id: 'E4S Fault Line Collect',
      netRegex: netregexes/* default.startsUsing */.Z.startsUsing({ id: '411E', source: 'Titan' }),
      netRegexDe: netregexes/* default.startsUsing */.Z.startsUsing({ id: '411E', source: 'Titan' }),
      netRegexFr: netregexes/* default.startsUsing */.Z.startsUsing({ id: '411E', source: 'Titan' }),
      netRegexJa: netregexes/* default.startsUsing */.Z.startsUsing({ id: '411E', source: 'タイタン' }),
      netRegexCn: netregexes/* default.startsUsing */.Z.startsUsing({ id: '411E', source: '泰坦' }),
      netRegexKo: netregexes/* default.startsUsing */.Z.startsUsing({ id: '411E', source: '타이탄' }),
      run: (_e, data, matches) => {
        data.faultLineTarget = matches.target;
      },
    },
    {
      id: 'E4S Fault Line',
      damageRegex: '411E',
      condition: (e, data) => data.faultLineTarget !== e.targetName,
      mistake: (e) => {
        return {
          type: 'fail',
          blame: e.targetName,
          text: {
            en: 'Run Over',
            de: e.abilityName,
            fr: 'A été écrasé(e)',
            ja: e.abilityName,
            cn: e.abilityName,
            ko: e.abilityName,
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e5n.js



/* harmony default export */ const e5n = ({
  zoneId: zone_id/* default.EdensVerseFulmination */.Z.EdensVerseFulmination,
  damageWarn: {
    'E5N Impact': '4E3A', // Stratospear landing AoE
    'E5N Lightning Bolt': '4B9C', // Stormcloud standard attack
    'E5N Gallop': '4B97', // Sideways add charge
    'E5N Shock Strike': '4BA1', // Small AoE circles during Thunderstorm
    'E5N Volt Strike': '4CF2', // Large AoE circles during Thunderstorm
  },
  damageFail: {
    'E5N Judgment Jolt': '4B8F', // Stratospear explosions
  },
  triggers: [
    {
      // This happens when a player gets 4+ stacks of orbs. Don't be greedy!
      id: 'E5N Static Condensation',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '8B5' }),
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      // Helper for orb pickup failures
      id: 'E5N Orb Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '8B4' }),
      run: (_e, data, matches) => {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[matches.target] = true;
      },
    },
    {
      id: 'E5N Orb Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '8B4' }),
      run: (_e, data, matches) => {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[matches.target] = false;
      },
    },
    {
      id: 'E5N Divine Judgement Volts',
      damageRegex: '4B9A',
      condition: (e, data) => !data.hasOrb[e.targetName],
      mistake: (e) => {
        return {
          type: 'fail',
          blame: e.targetName,
          text: {
            en: e.abilityName + ' (no orb)',
            de: e.abilityName + ' (kein Orb)',
            fr: e.abilityName + '(pas d\'orbe)',
            ja: e.abilityName + '(雷玉無し)',
            cn: e.abilityName + '(没吃球)',
          },
        };
      },
    },
    {
      id: 'E5N Stormcloud Target Tracking',
      netRegex: netregexes/* default.headMarker */.Z.headMarker({ id: '006E' }),
      run: (_e, data, matches) => {
        data.cloudMarkers = data.cloudMarkers || [];
        data.cloudMarkers.push(matches.target);
      },
    },
    {
      // This ability is seen only if players stacked the clouds instead of spreading them.
      id: 'E5N The Parting Clouds',
      damageRegex: '4B9D',
      suppressSeconds: 30,
      mistake: (e, data) => {
        for (const m of data.cloudMarkers) {
          return {
            type: 'fail',
            blame: data.cloudMarkers[m],
            text: {
              en: e.abilityName + '(clouds too close)',
              de: e.abilityName + '(Wolken zu nahe)',
              fr: e.abilityName + '(nuages trop proches)',
              ja: e.abilityName + '(雲近すぎ)',
              cn: e.abilityName + '(雷云重叠)',
            },
          };
        }
      },
    },
    {
      id: 'E5N Stormcloud cleanup',
      netRegex: netregexes/* default.headMarker */.Z.headMarker({ id: '006E' }),
      delaySeconds: 30, // Stormclouds resolve well before this.
      run: (_e, data) => {
        delete data.cloudMarkers;
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e5s.js



// TODO: is there a different ability if the shield duty action isn't used properly?
// TODO: is there an ability from Raiden (the bird) if you get eaten?
// TODO: maybe chain lightning warning if you get hit while you have system shock (8B8)

const noOrb = (str) => {
  return {
    en: str + ' (no orb)',
    de: str + ' (kein Orb)',
    fr: str + ' (pas d\'orbe)',
    ja: str + ' (雷玉無し)',
    cn: str + ' (没吃球)',
    ko: str + ' (구슬 없음)',
  };
};

/* harmony default export */ const e5s = ({
  zoneId: zone_id/* default.EdensVerseFulminationSavage */.Z.EdensVerseFulminationSavage,
  damageWarn: {
    'E5S Impact': '4E3B', // Stratospear landing AoE
    'E5S Gallop': '4BB4', // Sideways add charge
    'E5S Shock Strike': '4BC1', // Small AoE circles during Thunderstorm
    'E5S Stepped Leader Twister': '4BC7', // Twister stepped leader
    'E5S Stepped Leader Donut': '4BC8', // Donut stepped leader
    'E5S Shock': '4E3D', // Hated of Levin Stormcloud-cleansable exploding debuff
  },
  damageFail: {
    'E5S Judgment Jolt': '4BA7', // Stratospear explosions
  },
  shareWarn: {
    'E5S Volt Strike Double': '4BC3', // Large AoE circles during Thunderstorm
    'E5S Crippling Blow': '4BCA',
    'E5S Chain Lightning Double': '4BC5',
  },
  triggers: [
    {
      // Helper for orb pickup failures
      id: 'E5S Orb Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '8B4' }),
      run: (_e, data, matches) => {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[matches.target] = true;
      },
    },
    {
      id: 'E5S Orb Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '8B4' }),
      run: (_e, data, matches) => {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[matches.target] = false;
      },
    },
    {
      id: 'E5S Divine Judgement Volts',
      damageRegex: '4BB7',
      condition: (e, data) => !data.hasOrb || !data.hasOrb[e.targetName],
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: noOrb(e.abilityName) };
      },
    },
    {
      id: 'E5S Volt Strike Orb',
      damageRegex: '4BC3',
      condition: (e, data) => !data.hasOrb || !data.hasOrb[e.targetName],
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: noOrb(e.abilityName) };
      },
    },
    {
      id: 'E5S Deadly Discharge Big Knockback',
      damageRegex: '4BB2',
      condition: (e, data) => !data.hasOrb || !data.hasOrb[e.targetName],
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: noOrb(e.abilityName) };
      },
    },
    {
      id: 'E5S Lightning Bolt',
      damageRegex: '4BB9',
      condition: (e, data) => {
        // Having a non-idempotent condition function is a bit <_<
        // Only consider lightning bolt damage if you have a debuff to clear.
        if (!data.hated || !data.hated[e.targetName])
          return true;

        delete data.hated[e.targetName];
        return false;
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E5S Hated of Levin',
      netRegex: netregexes/* default.headMarker */.Z.headMarker({ id: '00D2' }),
      run: (_e, data, matches) => {
        data.hated = data.hated || {};
        data.hated[matches.target] = true;
      },
    },
    {
      id: 'E5S Stormcloud Target Tracking',
      netRegex: netregexes/* default.headMarker */.Z.headMarker({ id: '006E' }),
      run: (_e, data, matches) => {
        data.cloudMarkers = data.cloudMarkers || [];
        data.cloudMarkers.push(matches.target);
      },
    },
    {
      // This ability is seen only if players stacked the clouds instead of spreading them.
      id: 'E5S The Parting Clouds',
      damageRegex: '4BBA',
      suppressSeconds: 30,
      mistake: (e, data) => {
        for (const m of data.cloudMarkers) {
          return {
            type: 'fail',
            blame: data.cloudMarkers[m],
            text: {
              en: e.abilityName + '(clouds too close)',
              de: e.abilityName + '(Wolken zu nahe)',
              fr: e.abilityName + '(nuages trop proches)',
              ja: e.abilityName + '(雲近すぎ)',
              cn: e.abilityName + '(雷云重叠)',
            },
          };
        }
      },
    },
    {
      id: 'E5S Stormcloud cleanup',
      netRegex: netregexes/* default.headMarker */.Z.headMarker({ id: '006E' }),
      // Stormclouds resolve well before this.
      delaySeconds: 30,
      run: (_e, data) => {
        delete data.cloudMarkers;
        delete data.hated;
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e6n.js


/* harmony default export */ const e6n = ({
  zoneId: zone_id/* default.EdensVerseFuror */.Z.EdensVerseFuror,
  damageWarn: {
    'E6N Thorns': '4BDA', // AoE markers after Enumeration
    'E6N Ferostorm 1': '4BDD',
    'E6N Ferostorm 2': '4BE5',
    'E6N Storm Of Fury 1': '4BE0', // Circle AoE during tethers--Garuda
    'E6N Storm Of Fury 2': '4BE6', // Circle AoE during tethers--Raktapaksa
    'E6N Explosion': '4BE2', // AoE circles, Garuda orbs
    'E6N Heat Burst': '4BEC',
    'E6N Conflag Strike': '4BEE', // 270-degree frontal AoE
    'E6N Spike Of Flame': '4BF0', // Orb explosions after Strike Spark
    'E6N Radiant Plume': '4BF2',
    'E6N Eruption': '4BF4',
  },
  damageFail: {
    'E6N Vacuum Slice': '4BD5', // Dark line AoE from Garuda
    'E6N Downburst': '4BDB', // Blue knockback circle. Actual knockback is unknown ability 4C20
  },
  shareFail: {
    // Kills non-tanks who get hit by it.
    'E6N Instant Incineration': '4BED',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e6s.js


// TODO: check tethers being cut (when they shouldn't)
// TODO: check for concussed debuff
// TODO: check for taking tankbuster with lightheaded
// TODO: check for one person taking multiple Storm Of Fury Tethers (4C01/4C08)

/* harmony default export */ const e6s = ({
  zoneId: zone_id/* default.EdensVerseFurorSavage */.Z.EdensVerseFurorSavage,
  damageWarn: {
    // It's common to just ignore futbol mechanics, so don't warn on Strike Spark.
    // 'Spike Of Flame': '4C13', // Orb explosions after Strike Spark

    'E6S Thorns': '4BFA', // AoE markers after Enumeration
    'E6S Ferostorm 1': '4BFD',
    'E6S Ferostorm 2': '4C06',
    'E6S Storm Of Fury 1': '4C00', // Circle AoE during tethers--Garuda
    'E6S Storm Of Fury 2': '4C07', // Circle AoE during tethers--Raktapaksa
    'E6S Explosion': '4C03', // AoE circles, Garuda orbs
    'E6S Heat Burst': '4C1F',
    'E6S Conflag Strike': '4C10', // 270-degree frontal AoE
    'E6S Radiant Plume': '4C15',
    'E6S Eruption': '4C17',
    'E6S Wind Cutter': '4C02', // Tether-cutting line aoe
  },
  damageFail: {
    'E6S Vacuum Slice': '4BF5', // Dark line AoE from Garuda
    'E6S Downburst 1': '4BFB', // Blue knockback circle (Garuda).
    'E6S Downburst 2': '4BFC', // Blue knockback circle (Raktapaksa).
    'E6S Meteor Strike': '4C0F', // Frontal avoidable tank buster
  },
  shareWarn: {
    'E6S Hands of Hell': '4C0[BC]', // Tether charge
    'E6S Hands of Flame': '4C0A', // First Tankbuster
    'E6S Instant Incineration': '4C0E', // Second Tankbuster
    'E6S Blaze': '4C1B', // Flame Tornado Cleave
  },
  triggers: [
    {
      id: 'E6S Air Bump',
      damageRegex: '4BF9',
      condition: (e) => {
        // Needs to be taken with friends.
        // This can't tell if you have 2 or >2.
        return e.type === '15';
      },
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e7n.js



const wrongBuff = (str) => {
  return {
    en: str + ' (wrong buff)',
    de: str + ' (falscher Buff)',
    fr: str + ' (mauvais buff)',
    ja: str + ' (不適切なバフ)',
    cn: str + ' (Buff错了)',
    ko: str + ' (버프 틀림)',
  };
};

const noBuff = (str) => {
  return {
    en: str + ' (no buff)',
    de: str + ' (kein Buff)',
    fr: str + ' (pas de buff)',
    ja: str + ' (バフ無し)',
    cn: str + ' (没有Buff)',
    ko: str + '(버프 없음)',
  };
};

/* harmony default export */ const e7n = ({
  zoneId: zone_id/* default.EdensVerseIconoclasm */.Z.EdensVerseIconoclasm,
  damageWarn: {
    'E7N Stygian Sword': '4C55', // Circle ground AoEs after False Twilight
    'E7N Strength In Numbers Donut': '4C4C', // Large donut ground AoEs, intermission
    'E7N Strength In Numbers 2': '4C4D', // Large circle ground AoEs, intermission
  },
  damageFail: {
  },
  triggers: [
    {
      id: 'E7N Stygian Stake', // Laser tank buster, outside intermission phase
      damageRegex: '4C33',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E5N Silver Shot', // Spread markers, intermission
      damageRegex: '4E7D',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E7N Astral Effect Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '8BE' }),
      run: (_e, data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = true;
      },
    },
    {
      id: 'E7N Astral Effect Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '8BE' }),
      run: (_e, data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = false;
      },
    },
    {
      id: 'E7N Umbral Effect Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '8BF' }),
      run: (_e, data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = true;
      },
    },
    {
      id: 'E7N Umbral Effect Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '8BF' }),
      run: (_e, data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = false;
      },
    },
    {
      id: 'E7N Light\'s Course',
      damageRegex: ['4C3E', '4C40', '4C22', '4C3C', '4E63'],
      condition: (e, data) => {
        return !data.hasUmbral || !data.hasUmbral[e.targetName];
      },
      mistake: (e, data) => {
        if (data.hasAstral && data.hasAstral[e.targetName])
          return { type: 'fail', blame: e.targetName, text: wrongBuff(e.abilityName) };
        return { type: 'warn', blame: e.targetName, text: noBuff(e.abilityName) };
      },
    },
    {
      id: 'E7N Darks\'s Course',
      damageRegex: ['4C3D', '4C23', '4C41', '4C43'],
      condition: (e, data) => {
        return !data.hasAstral || !data.hasAstral[e.targetName];
      },
      mistake: (e, data) => {
        if (data.hasUmbral && data.hasUmbral[e.targetName])
          return { type: 'fail', blame: e.targetName, text: wrongBuff(e.abilityName) };
        // This case is probably impossible, as the debuff ticks after death,
        // but leaving it here in case there's some rez or disconnect timing
        // that could lead to this.
        return { type: 'warn', blame: e.targetName, text: noBuff(e.abilityName) };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e7s.js



// TODO: missing an orb during tornado phase
// TODO: jumping in the tornado damage??
// TODO: taking sungrace(4C80) or moongrace(4C82) with wrong debuff
// TODO: stygian spear/silver spear with the wrong debuff
// TODO: taking explosion from the wrong Chiaro/Scuro orb
// TODO: handle 4C89 Silver Stake tankbuster 2nd hit, as it's ok to have two in.

const e7s_wrongBuff = (str) => {
  return {
    en: str + ' (wrong buff)',
    de: str + ' (falscher Buff)',
    fr: str + ' (mauvais buff)',
    ja: str + ' (不適切なバフ)',
    cn: str + ' (Buff错了)',
    ko: str + ' (버프 틀림)',
  };
};

const e7s_noBuff = (str) => {
  return {
    en: str + ' (no buff)',
    de: str + ' (kein Buff)',
    fr: str + ' (pas de buff)',
    ja: str + ' (バフ無し)',
    cn: str + ' (没有Buff)',
    ko: str + ' (버프 없음)',
  };
};

/* harmony default export */ const e7s = ({
  zoneId: zone_id/* default.EdensVerseIconoclasmSavage */.Z.EdensVerseIconoclasmSavage,
  damageWarn: {
    'E7S Silver Sword': '4C8E', // ground aoe
    'E7S Overwhelming Force': '4C73', // add phase ground aoe
    'E7S Strength in Numbers 1': '4C70', // add get under
    'E7S Strength in Numbers 2': '4C71', // add get out
    'E7S Paper Cut': '4C7D', // tornado ground aoes
    'E7S Buffet': '4C77', // tornado ground aoes also??
  },
  damageFail: {
    'E7S Betwixt Worlds': '4C6B', // purple ground line aoes
    'E7S Crusade': '4C58', // blue knockback circle (standing in it)
    'E7S Explosion': '4C6F', // didn't kill an add
  },
  triggers: [
    {
      // Laser tank buster 1
      id: 'E7S Stygian Stake',
      damageRegex: '4C34',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Spread markers
      id: 'E7S Silver Shot',
      damageRegex: '4C92',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Ice markers
      id: 'E7S Silver Scourge',
      damageRegex: '4C93',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Orb Explosion
      id: 'E7S Chiaro Scuro Explosion',
      damageRegex: '4D1[45]',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Interrupt
      id: 'E7S Advent Of Light',
      abilityRegex: '4C6E',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E7S Astral Effect Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '8BE' }),
      run: (_e, data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = true;
      },
    },
    {
      id: 'E7S Astral Effect Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '8BE' }),
      run: (_e, data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = false;
      },
    },
    {
      id: 'E7S Umbral Effect Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '8BF' }),
      run: (_e, data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = true;
      },
    },
    {
      id: 'E7S Umbral Effect Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '8BF' }),
      run: (_e, data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = false;
      },
    },
    {
      id: 'E7S Light\'s Course',
      damageRegex: ['4C62', '4C63', '4C64', '4C5B', '4C5F'],
      condition: (e, data) => {
        return !data.hasUmbral || !data.hasUmbral[e.targetName];
      },
      mistake: (e, data) => {
        if (data.hasAstral && data.hasAstral[e.targetName])
          return { type: 'fail', blame: e.targetName, text: e7s_wrongBuff(e.abilityName) };
        return { type: 'warn', blame: e.targetName, text: e7s_noBuff(e.abilityName) };
      },
    },
    {
      id: 'E7S Darks\'s Course',
      damageRegex: ['4C65', '4C66', '4C67', '4C5A', '4C60'],
      condition: (e, data) => {
        return !data.hasAstral || !data.hasAstral[e.targetName];
      },
      mistake: (e, data) => {
        if (data.hasUmbral && data.hasUmbral[e.targetName])
          return { type: 'fail', blame: e.targetName, text: e7s_wrongBuff(e.abilityName) };
        // This case is probably impossible, as the debuff ticks after death,
        // but leaving it here in case there's some rez or disconnect timing
        // that could lead to this.
        return { type: 'warn', blame: e.targetName, text: e7s_noBuff(e.abilityName) };
      },
    },
    {
      id: 'E7S Crusade Knockback',
      // 4C76 is the knockback damage, 4C58 is the damage for standing on the puck.
      damageRegex: '4C76',
      deathReason: (e) => {
        return {
          type: 'fail',
          name: e.targetName,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e8n.js



/* harmony default export */ const e8n = ({
  zoneId: zone_id/* default.EdensVerseRefulgence */.Z.EdensVerseRefulgence,
  damageWarn: {
    'E8N Biting Frost': '4DDB', // 270-degree frontal AoE, Shiva
    'E8N Driving Frost': '4DDC', // Rear cone AoE, Shiva
    'E8N Frigid Stone': '4E66', // Small spread circles, phase 1
    'E8N Reflected Axe Kick': '4E00', // Large circle AoE, Frozen Mirror
    'E8N Reflected Scythe Kick': '4E01', // Donut AoE, Frozen Mirror
    'E8N Frigid Eruption': '4E09', // Small circle AoE puddles, phase 1
    'E8N Icicle Impact': '4E0A', // Large circle AoE puddles, phase 1
    'E8N Axe Kick': '4DE2', // Large circle AoE, Shiva
    'E8N Scythe Kick': '4DE3', // Donut AoE, Shiva
    'E8N Reflected Biting Frost': '4DFE', // 270-degree frontal AoE, Frozen Mirror
    'E8N Reflected Driving Frost': '4DFF', // Cone AoE, Frozen Mirror
  },
  damageFail: {
  },
  triggers: [
    {
      id: 'E8N Shining Armor',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '95' }),
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'E8N Heavenly Strike',
      damageRegex: '4DD8',
      deathReason: (e) => {
        return {
          type: 'fail',
          name: e.targetName,
          reason: {
            en: 'Pushed off!',
            de: 'Runter gestoßen!',
            fr: 'A été poussé(e) !',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백됨!',
          },
        };
      },
    },
    {
      id: 'E8N Frost Armor',
      // Thin Ice
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '38F' }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Slid off!',
            de: 'runtergerutscht!',
            fr: 'A glissé(e) !',
            ja: '滑った',
            cn: '滑落',
            ko: '미끄러짐!',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e8s.js



// TODO: rush hitting the crystal
// TODO: adds not being killed
// TODO: taking the rush twice (when you have debuff)
// TODO: not hitting the dragon four times during wyrm's lament
// TODO: death reasons for not picking up puddle
// TODO: not being in the tower when you should
// TODO: picking up too many stacks

// Note: Banish III (4DA8) and Banish Iii Divided (4DA9) both are type=0x16 lines.
// The same is true for Banish (4DA6) and Banish Divided (4DA7).
// I'm not sure this makes any sense? But can't tell if the spread was a mistake or not.
// Maybe we could check for "Magic Vulnerability Up"?

/* harmony default export */ const e8s = ({
  zoneId: zone_id/* default.EdensVerseRefulgenceSavage */.Z.EdensVerseRefulgenceSavage,
  damageWarn: {
    'E8S Biting Frost': '4D66', // 270-degree frontal AoE, Shiva
    'E8S Driving Frost': '4D67', // Rear cone AoE, Shiva
    'E8S Axe Kick': '4D6D', // Large circle AoE, Shiva
    'E8S Scythe Kick': '4D6E', // Donut AoE, Shiva
    'E8S Reflected Axe Kick': '4DB9', // Large circle AoE, Frozen Mirror
    'E8S Reflected Scythe Kick': '4DBA', // Donut AoE, Frozen Mirror
    'E8S Frigid Eruption': '4D9F', // Small circle AoE puddles, phase 1
    'E8S Frigid Needle': '4D9D', // 8-way "flower" explosion
    'E8S Icicle Impact': '4DA0', // Large circle AoE puddles, phase 1
    'E8S Reflected Biting Frost 1': '4DB7', // 270-degree frontal AoE, Frozen Mirror
    'E8S Reflected Biting Frost 2': '4DC3', // 270-degree frontal AoE, Frozen Mirror
    'E8S Reflected Driving Frost 1': '4DB8', // Cone AoE, Frozen Mirror
    'E8S Reflected Driving Frost 2': '4DC4', // Cone AoE, Frozen Mirror

    'E8S Hallowed Wings 1': '4D75', // Left cleave
    'E8S Hallowed Wings 2': '4D76', // Right cleave
    'E8S Hallowed Wings 3': '4D77', // Knockback frontal cleave
    'E8S Reflected Hallowed Wings 1': '4D90', // Reflected left 2
    'E8S Reflected Hallowed Wings 2': '4DBB', // Reflected left 1
    'E8S Reflected Hallowed Wings 3': '4DC7', // Reflected right 2
    'E8S Reflected Hallowed Wings 4': '4D91', // Reflected right 1
    'E8S Twin Stillness 1': '4D68',
    'E8S Twin Stillness 2': '4D6B',
    'E8S Twin Silence 1': '4D69',
    'E8S Twin Silence 2': '4D6A',
    'E8S Akh Rhai': '4D99',
    'E8S Embittered Dance 1': '4D70',
    'E8S Embittered Dance 2': '4D71',
    'E8S Spiteful Dance 1': '4D6F',
    'E8S Spiteful Dance 2': '4D72',
  },
  damageFail: {
    // Broken tether.
    'E8S Refulgent Fate': '4DA4',
    // Shared orb, correct is Bright Pulse (4D95)
    'E8S Blinding Pulse': '4D96',
  },
  triggers: [
    {
      id: 'E8S Shining Armor',
      // Stun
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '95' }),
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
    {
      // Interrupt
      id: 'E8S Stoneskin',
      abilityRegex: '4D85',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Protean
      id: 'E8S Path of Light',
      damageRegex: '4DA1',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e9n.js


/* harmony default export */ const e9n = ({
  zoneId: zone_id/* default.EdensPromiseUmbra */.Z.EdensPromiseUmbra,
  damageWarn: {
    'E9N The Art Of Darkness 1': '5223', // left-right cleave
    'E9N The Art Of Darkness 2': '5224', // left-right cleave
    'E9N Wide-Angle Particle Beam': '5AFF', // frontal cleave tutorial mechanic
    'E9N Wide-Angle Phaser': '55E1', // wide-angle "sides"
    'E9N Bad Vibrations': '55E6', // tethered outside giant tree ground aoes
    'E9N Earth-Shattering Particle Beam': '5225', // missing towers?
    'E9N Anti-Air Particle Beam': '55DC', // "get out" during panels
    'E9N Zero-Form Particle Beam 2': '55DB', // Clone line aoes w/ Anti-Air Particle Beam
  },
  damageFail: {
    'E9N Withdraw': '5534', // Slow to break seed chain, get sucked back in yikes
    'E9N Aetherosynthesis': '5535', // Standing on seeds during explosion (possibly via Withdraw)
  },
  shareWarn: {
    'E9N Zero-Form Particle Beam 1': '55EB', // tank laser with marker
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e9s.js


// TODO: 561D Evil Seed hits everyone, hard to know if there's a double tap
// TODO: falling through panel just does damage with no ability name, like a death wall
// TODO: what happens if you jump in seed thorns?

/* harmony default export */ const e9s = ({
  zoneId: zone_id/* default.EdensPromiseUmbraSavage */.Z.EdensPromiseUmbraSavage,
  damageWarn: {
    'E9S Bad Vibrations': '561C', // tethered outside giant tree ground aoes
    'E9S Wide-Angle Particle Beam': '5B00', // anti-air "sides"
    'E9S Wide-Angle Phaser Unlimited': '560E', // wide-angle "sides"
    'E9S Anti-Air Particle Beam': '5B01', // wide-angle "out"
    'E9S The Second Art Of Darkness 1': '5601', // left-right cleave
    'E9S The Second Art Of Darkness 2': '5602', // left-right cleave
    'E9S The Art Of Darkness 1': '5A95', // boss left-right summon/panel cleave
    'E9S The Art Of Darkness 2': '5A96', // boss left-right summon/panel cleave
    'E9S The Art Of Darkness Clone 1': '561E', // clone left-right summon cleave
    'E9S The Art Of Darkness Clone 2': '561F', // clone left-right summon cleave
    'E9S The Third Art Of Darkness 1': '5603', // third art left-right cleave initial
    'E9S The Third Art Of Darkness 2': '5604', // third art left-right cleave initial
    'E9S Art Of Darkness': '5606', // third art left-right cleave final
    'E9S Full-Perimiter Particle Beam': '5629', // panel "get in"
    'E9S Dark Chains': '5FAC', // Slow to break partner chains
  },
  damageFail: {
    'E9S Withdraw': '561A', // Slow to break seed chain, get sucked back in yikes
    'E9S Aetherosynthesis': '561B', // Standing on seeds during explosion (possibly via Withdraw)
  },
  shareWarn: {
    'E9S Hyper-Focused Particle Beam': '55FD', // Art Of Darkness protean
  },
  shareFail: {
    'E9S Condensed Wide-Angle Particle Beam': '5610', // wide-angle "tank laser"
  },
  gainsEffectWarn: {
    'E9S Stygian Tendrils': '952', // standing in the brambles
  },
  triggers: [
    {
      // Art Of Darkness Partner Stack
      id: 'E9S Multi-Pronged Particle Beam',
      damageRegex: '5600',
      condition: (e) => e.type === '15',
      mistake: (_e, _data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          text: {
            en: `${matches.ability} (alone)`,
            de: `${matches.ability} (allein)`,
            fr: `${matches.ability} (seul(e))`,
            ja: `${matches.ability} (一人)`,
            cn: `${matches.ability} (单吃)`,
            ko: `${matches.ability} (혼자 맞음)`,
          },
        };
      },
    },
    {
      // Anti-air "tank spread".  This can be stacked by two tanks invulning.
      // Note: this will still show something for holmgang/living, but
      // arguably a healer might need to do something about that, so maybe
      // it's ok to still show as a warning??
      id: 'E9S Condensed Anti-Air Particle Beam',
      damageRegex: '5615',
      condition: (e) => e.type !== '15' && e.damage > 0,
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
    {
      // Anti-air "out".  This can be invulned by a tank along with the spread above.
      id: 'E9S Anti-Air Phaser Unlimited',
      damageRegex: '5612',
      condition: (e) => e.damage > 0,
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e10n.js


/* harmony default export */ const e10n = ({
  zoneId: zone_id/* default.EdensPromiseLitany */.Z.EdensPromiseLitany,
  damageWarn: {
    'E10N Forward Implosion': '56B4', // howl boss implosion
    'E10N Forward Shadow Implosion': '56B5', // howl shadow implosion
    'E10N Backward Implosion': '56B7', // tail boss implosion
    'E10N Backward Shadow Implosion': '56B8', // tail shadow implosion
    'E10N Barbs Of Agony 1': '56D9', // Shadow Warrior 3 dog room cleave
    'E10N Barbs Of Agony 2': '5B26', // Shadow Warrior 3 dog room cleave
    'E10N Cloak Of Shadows': '5B11', // non-squiggly line explosions
    'E10N Throne Of Shadow': '56C7', // standing up get out
    'E10N Right Giga Slash': '56AE', // boss right giga slash
    'E10N Right Shadow Slash': '56AF', // giga slash from shadow
    'E10N Left Giga Slash': '56B1', // boss left giga slash
    'E10N Left Shadow Slash': '56BD', // giga slash from shadow
    'E10N Shadowy Eruption': '56E1', // baited ground aoe markers paired with barbs
  },
  shareWarn: {
    'E10N Shadow\'s Edge': '56DB', // Tankbuster single target followup
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e10s.js



// TODO: hitting shadow of the hero with abilities can cause you to take damage, list those?
//       e.g. picking up your first pitch bog puddle will cause you to die to the damage
//       your shadow takes from Deepshadow Nova or Distant Scream.
// TODO: 573B Blighting Blitz issues during limit cut numbers

/* harmony default export */ const e10s = ({
  zoneId: zone_id/* default.EdensPromiseLitanySavage */.Z.EdensPromiseLitanySavage,
  damageWarn: {
    'E10S Implosion Single 1': '56F2', // single tail up shadow implosion
    'E10S Implosion Single 2': '56EF', // single howl shadow implosion
    'E10S Implosion Quadruple 1': '56EF', // quadruple set of shadow implosions
    'E10S Implosion Quadruple 2': '56F2', // quadruple set of shadow implosions
    'E10S Giga Slash Single 1': '56EC', // Giga slash single from shadow
    'E10S Giga Slash Single 2': '56ED', // Giga slash single from shadow
    'E10S Giga Slash Box 1': '5709', // Giga slash box from four ground shadows
    'E10S Giga Slash Box 2': '570D', // Giga slash box from four ground shadows
    'E10S Giga Slash Quadruple 1': '56EC', // quadruple set of giga slash cleaves
    'E10S Giga Slash Quadruple 2': '56E9', // quadruple set of giga slash cleaves
    'E10S Cloak Of Shadows 1': '5B13', // initial non-squiggly line explosions
    'E10S Cloak Of Shadows 2': '5B14', // second squiggly line explosions
    'E10S Throne Of Shadow': '5717', // standing up get out
    'E10S Shadowy Eruption': '5738', // baited ground aoe during amplifier
  },
  damageFail: {
    'E10S Swath Of Silence 1': '571A', // Shadow clone cleave (too close)
    'E10S Swath Of Silence 2': '5BBF', // Shadow clone cleave (timed)
  },
  shareWarn: {
    'E10S Shadefire': '5732', // purple tank umbral orbs
    'E10S Pitch Bog': '5722', // marker spread that drops a shadow puddle
  },
  shareFail: {
    'E10S Shadow\'s Edge': '5725', // Tankbuster single target followup
  },
  triggers: [
    {
      id: 'E10S Damage Down Orbs',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ source: 'Flameshadow', effectId: '82C' }),
      netRegexDe: netregexes/* default.gainsEffect */.Z.gainsEffect({ source: 'Schattenflamme', effectId: '82C' }),
      netRegexFr: netregexes/* default.gainsEffect */.Z.gainsEffect({ source: 'Flamme ombrale', effectId: '82C' }),
      netRegexJa: netregexes/* default.gainsEffect */.Z.gainsEffect({ source: 'シャドウフレイム', effectId: '82C' }),
      mistake: (_e, _data, matches) => {
        return { type: 'damage', blame: matches.target, text: `${matches.effect} (partial stack)` };
      },
    },
    {
      id: 'E10S Damage Down Boss',
      // Shackles being messed up appear to just give the Damage Down, with nothing else.
      // Messing up towers is the Thrice-Come Ruin effect (9E2), but also Damage Down.
      // TODO: some of these will be duplicated with others, like `E10S Throne Of Shadow`.
      // Maybe it'd be nice to figure out how to put the damage marker on that?
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ source: 'Shadowkeeper', effectId: '82C' }),
      netRegexDe: netregexes/* default.gainsEffect */.Z.gainsEffect({ source: 'Schattenkönig', effectId: '82C' }),
      netRegexFr: netregexes/* default.gainsEffect */.Z.gainsEffect({ source: 'Roi De L\'Ombre', effectId: '82C' }),
      netRegexJa: netregexes/* default.gainsEffect */.Z.gainsEffect({ source: '影の王', effectId: '82C' }),
      mistake: (_e, _data, matches) => {
        return { type: 'damage', blame: matches.target, text: `${matches.effect}` };
      },
    },
    {
      // Shadow Warrior 4 dog room cleave
      // This can be mitigated by the whole group, so add a damage condition.
      id: 'E10S Barbs Of Agony',
      damageRegex: ['572A', '5B27'],
      condition: (e) => e.damage > 0,
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e11n.js



/* harmony default export */ const e11n = ({
  zoneId: zone_id/* default.EdensPromiseAnamorphosis */.Z.EdensPromiseAnamorphosis,
  damageWarn: {
    'E11N Burnt Strike Lightning': '562E', // Line cleave
    'E11N Burnt Strike Fire': '562C', // Line cleave
    'E11N Burnt Strike Holy': '5630', // Line cleave
    'E11N Burnout': '562F', // Burnt Strike lightning expansion
    'E11N Shining Blade': '5631', // Baited explosion
    'E11N Halo Of Flame Brightfire': '563B', // Red circle intermission explosion
    'E11N Halo Of Levin Brightfire': '563C', // Blue circle intermission explosion
    'E11N Resounding Crack': '564D', // Demi-Gukumatz 270 degree frontal cleave
    'E11N Image Burnt Strike Lightning': '5645', // Fate Breaker's Image line cleave
    'E11N Image Burnt Strike Fire': '5643', // Fate Breaker's Image line cleave
    'E11N Image Burnout': '5646', // Fate Breaker's Image lightning expansion
  },
  damageFail: {
    'E11N Blasting Zone': '563E', // Prismatic Deception charges
  },
  shareWarn: {
    'E11N Burn Mark': '564F', // Powder Mark debuff explosion
  },
  triggers: [
    {
      id: 'E11N Blastburn Knocked Off',
      // 562D = Burnt Strike fire followup during most of the fight
      // 5644 = same thing, but from Fatebreaker's Image
      netRegex: netregexes/* default.ability */.Z.ability({ id: ['562D', '5644'] }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e11s.js



// 565A/568D Sinsmoke Bound Of Faith share
// 565E/5699 Bowshock hits target of 565D (twice) and two others

/* harmony default export */ const e11s = ({
  zoneId: zone_id/* default.EdensPromiseAnamorphosisSavage */.Z.EdensPromiseAnamorphosisSavage,
  damageWarn: {
    'E11S Burnt Strike Fire': '5652', // Line cleave
    'E11S Burnt Strike Lightning': '5654', // Line cleave
    'E11S Burnt Strike Holy': '5656', // Line cleave
    'E11S Shining Blade': '5657', // Baited explosion
    'E11S Burnt Strike Cycle Fire': '568E', // Line cleave during Cycle
    'E11S Burnt Strike Cycle Lightning': '5695', // Line cleave during Cycle
    'E11S Burnt Strike Cycle Holy': '569D', // Line cleave during Cycle
    'E11S Shining Blade Cycle': '569E', // Baited explosion during Cycle
    'E11S Halo Of Flame Brightfire': '566D', // Red circle intermission explosion
    'E11S Halo Of Levin Brightfire': '566C', // Blue circle intermission explosion
    'E11S Portal Of Flame Bright Pulse': '5671', // Red card intermission explosion
    'E11S Portal Of Levin Bright Pulse': '5670', // Blue card intermission explosion
    'E11S Resonant Winds': '5689', // Demi-Gukumatz "get in"
    'E11S Resounding Crack': '5688', // Demi-Gukumatz 270 degree frontal cleave
    'E11S Image Burnt Strike Lightning': '567B', // Fate Breaker's Image line cleave
    'E11N Image Burnout': '567C', // Fate Breaker's Image lightning expansion
    'E11N Image Burnt Strike Fire': '5679', // Fate Breaker's Image line cleave
    'E11N Image Burnt Strike Holy': '567B', // Fate Breaker's Image line cleave
    'E11N Image Shining Blade': '567E', // Fate Breaker's Image baited explosion
  },
  damageFail: {
    'E11S Burnout': '5655', // Burnt Strike lightning expansion
    'E11S Burnout Cycle': '5696', // Burnt Strike lightning expansion
    'E11S Blasting Zone': '5674', // Prismatic Deception charges
  },
  shareWarn: {
    'E11S Elemental Break': '5664', // Elemental Break protean
    'E11S Elemental Break Cycle': '568C', // Elemental Break protean during Cycle
    'E11S Sinsmite': '5667', // Lightning Elemental Break spread
    'E11S Sinsmite Cycle': '5694', // Lightning Elemental Break spread during Cycle
  },
  shareFail: {
    'E11S Burn Mark': '56A3', // Powder Mark debuff explosion
    'E11S Sinsight 1': '5661', // Holy Bound Of Faith tether
    'E11S Sinsight 2': '5BC7', // Holy Bound Of Faith tether from Fatebreaker's Image
    'E11S Sinsight 3': '56A0', // Holy Bound Of Faith tether during Cycle
  },
  triggers: [
    {
      id: 'E11S Holy Sinsight Group Share',
      damageRegex: '5669',
      condition: (e) => e.type === '15',
      mistake: (_e, _data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (alone)`,
            de: `${matches.ability} (allein)`,
            fr: `${matches.ability} (seul(e))`,
            ja: `${matches.ability} (一人)`,
            cn: `${matches.ability} (单吃)`,
            ko: `${matches.ability} (혼자 맞음)`,
          },
        };
      },
    },
    {
      id: 'E11S Blastburn Knocked Off',
      // 5653 = Burnt Strike fire followup during most of the fight
      // 567A = same thing, but from Fatebreaker's Image
      // 568F = same thing, but during Cycle of Faith
      netRegex: netregexes/* default.ability */.Z.ability({ id: ['5653', '567A', '568F'] }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e12n.js


/* harmony default export */ const e12n = ({
  zoneId: zone_id/* default.EdensPromiseEternity */.Z.EdensPromiseEternity,
  damageWarn: {
    'E12N Judgment Jolt Single': '585F', // Ramuh get out cast
    'E12N Judgment Jolt': '4E30', // Ramuh get out cast
    'E12N Temporary Current Single': '585C', // Levi get under cast
    'E12N Temporary Current': '4E2D', // Levi get under cast
    'E12N Conflag Strike Single': '585D', // Ifrit get sides cast
    'E12N Conflag Strike': '4E2E', // Ifrit get sides cast
    'E12N Ferostorm Single': '585E', // Garuda get intercardinals cast
    'E12N Ferostorm': '4E2F', // Garuda get intercardinals cast
    'E12N Rapturous Reach 1': '5878', // Haircut
    'E12N Rapturous Reach 2': '5877', // Haircut
    'E12N Bomb Explosion': '586D', // Small bomb explosion
    'E12N Titanic Bomb Explosion': '586F', // Large bomb explosion
  },
  shareWarn: {
    'E12N Earthshaker': '5885', // Earthshaker on first platform
    'E12N Promise Frigid Stone 1': '5867', // Shiva spread with sliding
    'E12N Promise Frigid Stone 2': '5869', // Shiva spread with Rapturous Reach
  },
});

// EXTERNAL MODULE: ./resources/outputs.ts
var outputs = __webpack_require__(273);
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e12s.js




// TODO: add separate damageWarn-esque icon for damage downs?
// TODO: 58A6 Under The Weight / 58B2 Classical Sculpture missing somebody in party warning?
// TODO: 58CA Dark Water III / 58C5 Shell Crusher should hit everyone in party
// TODO: Dark Aero III 58D4 should not be a share except on advanced relativity for double aero.
// (for gains effect, single aero = ~23 seconds, double aero = ~31 seconds duration)

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is the formless tankbuster, ID 004F.
const firstHeadmarker = parseInt('00DA', 16);
const getHeadmarkerId = (data, matches) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

/* harmony default export */ const e12s = ({
  zoneId: zone_id/* default.EdensPromiseEternitySavage */.Z.EdensPromiseEternitySavage,
  damageWarn: {
    'E12S Promise Rapturous Reach Left': '58AD', // Haircut with left safe side
    'E12S Promise Rapturous Reach Right': '58AE', // Haircut with right safe side
    'E12S Promise Temporary Current': '4E44', // Levi get under cast (damage down)
    'E12S Promise Conflag Strike': '4E45', // Ifrit get sides cast (damage down)
    'E12S Promise Ferostorm': '4E46', // Garuda get intercardinals cast (damage down)
    'E12S Promise Judgment Jolt': '4E47', // Ramuh get out cast (damage down)
    'E12S Promise Shatter': '589C', // Ice Pillar explosion if tether not gotten
    'E12S Promise Impact': '58A1', // Titan bomb drop
    'E12S Oracle Dark Blizzard III': '58D3', // Relativity donut mechanic
    'E12S Oracle Apocalypse': '58E6', // Light up circle explosions (damage down)
  },
  damageFail: {
    'E12S Oracle Maelstrom': '58DA', // Advanced Relativity traffic light aoe
  },
  shareWarn: {
    'E12S Promise Frigid Stone': '589E', // Shiva spread
    'E12S Oracle Darkest Dance': '4E33', // Farthest target bait + jump before knockback
    'E12S Oracle Dark Current': '58D8', // Baited traffic light lasers
    'E12S Oracle Spirit Taker': '58C6', // Random jump spread mechanic after Shell Crusher
    'E12S Oracle Somber Dance 1': '58BF', // Farthest target bait for Dual Apocalypse
    'E12S Oracle Somber Dance 2': '58C0', // Second somber dance jump
  },
  shareFail: {
    'E12S Promise Weight Of The World': '58A5', // Titan bomb blue marker
    'E12S Promise Pulse Of The Land': '58A3', // Titan bomb yellow marker
    'E12S Oracle Dark Eruption 1': '58CE', // Initial warmup spread mechanic
    'E12S Oracle Dark Eruption 2': '58CD', // Relativity spread mechanic
    'E12S Oracle Black Halo': '58C7', // Tankbuster cleave
  },
  gainsEffectFail: {
    'E12S Oracle Doom': '9D4', // Relativity punishment for multiple mistakes
  },
  triggers: [
    {
      // Big circle ground aoes during Shiva junction.
      // This can be shielded through as long as that person doesn't stack.
      id: 'E12S Icicle Impact',
      damageRegex: '4E5A',
      condition: (e) => e.damage > 0,
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'E12S Headmarker',
      netRegex: netregexes/* default.headMarker */.Z.headMarker({}),
      run: (_e, data, matches) => {
        const id = getHeadmarkerId(data, matches);
        const firstLaserMarker = '0091';
        const lastLaserMarker = '0098';
        if (id >= firstLaserMarker && id <= lastLaserMarker) {
          // ids are sequential: #1 square, #2 square, #3 square, #4 square, #1 triangle etc
          const decOffset = parseInt(id, 16) - parseInt(firstLaserMarker, 16);

          // decOffset is 0-7, so map 0-3 to 1-4 and 4-7 to 1-4.
          data.laserNameToNum = data.laserNameToNum || {};
          data.laserNameToNum[matches.target] = decOffset % 4 + 1;
        }
      },
    },
    {
      // These sculptures are added at the start of the fight, so we need to check where they
      // use the "Classical Sculpture" ability and end up on the arena for real.
      id: 'E12S Promise Chiseled Sculpture Classical Sculpture',
      netRegex: netregexes/* default.abilityFull */.Z.abilityFull({ source: 'Chiseled Sculpture', id: '58B2' }),
      run: (_e, data, matches) => {
        // This will run per person that gets hit by the same sculpture, but that's fine.
        // Record the y position of each sculpture so we can use it for better text later.
        data.sculptureYPositions = data.sculptureYPositions || {};
        data.sculptureYPositions[matches.sourceId.toUpperCase()] = parseFloat(matches.y);
      },
    },
    {
      // The source of the tether is the player, the target is the sculpture.
      id: 'E12S Promise Chiseled Sculpture Tether',
      netRegex: netregexes/* default.tether */.Z.tether({ target: 'Chiseled Sculpture', id: '0011' }),
      run: (_e, data, matches) => {
        data.sculptureTetherNameToId = data.sculptureTetherNameToId || {};
        data.sculptureTetherNameToId[matches.source] = matches.targetId.toUpperCase();
      },
    },
    {
      id: 'E12S Promise Blade Of Flame Counter',
      netRegex: netregexes/* default.ability */.Z.ability({ source: 'Chiseled Sculpture', id: '58B3' }),
      suppressSeconds: 1,
      delaySeconds: 1,
      run: (_e, data) => {
        data.bladeOfFlameCount = data.bladeOfFlameCount || 0;
        data.bladeOfFlameCount++;
      },
    },
    {
      // This is the Chiseled Sculpture laser with the limit cut dots.
      id: 'E12S Promise Blade Of Flame',
      netRegex: netregexes/* default.ability */.Z.ability({ source: 'Chiseled Sculpture', id: '58B3' }),
      mistake: (e, data, matches) => {
        if (!data.laserNameToNum || !data.sculptureTetherNameToId || !data.sculptureYPositions)
          return;

        // Hitting only one person is just fine.
        if (e.type === '15')
          return;

        // Find the person who has this laser number and is tethered to this statue.
        const number = (data.bladeOfFlameCount || 0) + 1;
        const sourceId = matches.sourceId.toUpperCase();
        const names = Object.keys(data.laserNameToNum);
        const withNum = names.filter((name) => data.laserNameToNum[name] === number);
        const owners = withNum.filter((name) => data.sculptureTetherNameToId[name] === sourceId);

        // if some logic error, just abort.
        if (owners.length !== 1)
          return;

        // The owner hitting themselves isn't a mistake...technically.
        if (owners[0] === matches.target)
          return;

        // Now try to figure out which statue is which.
        // People can put these wherever.  They could go sideways, or diagonal, or whatever.
        // It seems mooooost people put these north / south (on the south edge of the arena).
        // Let's say a minimum of 2 yalms apart in the y direction to consider them "north/south".
        const minimumYalmsForStatues = 2;

        let isStatuePositionKnown = false;
        let isStatueNorth = false;
        const sculptureIds = Object.keys(data.sculptureYPositions);
        if (sculptureIds.length === 2 && sculptureIds.includes(sourceId)) {
          const otherId = sculptureIds[0] === sourceId ? sculptureIds[1] : sculptureIds[0];
          const sourceY = data.sculptureYPositions[sourceId];
          const otherY = data.sculptureYPositions[otherId];
          const yDiff = Math.abs(sourceY - otherY);
          if (yDiff > minimumYalmsForStatues) {
            isStatuePositionKnown = true;
            isStatueNorth = sourceY < otherY;
          }
        }

        const owner = owners[0];
        const ownerNick = data.ShortName(owner);
        let text = {
          en: `${matches.ability} (from ${ownerNick}, #${number})`,
          de: `${matches.ability} (von ${ownerNick}, #${number})`,
          ja: `${matches.ability} (${ownerNick}から、#${number})`,
          cn: `${matches.ability} (来自${ownerNick}，#${number})`,
          ko: `${matches.ability} (대상자 "${ownerNick}", ${number}번)`,
        };
        if (isStatuePositionKnown && isStatueNorth) {
          text = {
            en: `${matches.ability} (from ${ownerNick}, #${number} north)`,
            de: `${matches.ability} (von ${ownerNick}, #${number} norden)`,
            ja: `${matches.ability} (北の${ownerNick}から、#${number})`,
            cn: `${matches.ability} (来自北方${ownerNick}，#${number})`,
            ko: `${matches.ability} (대상자 "${ownerNick}", ${number}번 북쪽)`,
          };
        } else if (isStatuePositionKnown && !isStatueNorth) {
          text = {
            en: `${matches.ability} (from ${ownerNick}, #${number} south)`,
            de: `${matches.ability} (von ${ownerNick}, #${number} Süden)`,
            ja: `${matches.ability} (南の${ownerNick}から、#${number})`,
            cn: `${matches.ability} (来自南方${ownerNick}，#${number})`,
            ko: `${matches.ability} (대상자 "${ownerNick}", ${number}번 남쪽)`,
          };
        }

        return {
          type: 'fail',
          name: matches.target,
          blame: owner,
          text: text,
        };
      },
    },
    {
      id: 'E12S Promise Ice Pillar Tracker',
      netRegex: netregexes/* default.tether */.Z.tether({ source: 'Ice Pillar', id: ['0001', '0039'] }),
      run: (_e, data, matches) => {
        data.pillarIdToOwner = data.pillarIdToOwner || {};
        data.pillarIdToOwner[matches.sourceId] = matches.target;
      },
    },
    {
      id: 'E12S Promise Ice Pillar Mistake',
      netRegex: netregexes/* default.ability */.Z.ability({ source: 'Ice Pillar', id: '589B' }),
      condition: (_e, data, matches) => {
        if (!data.pillarIdToOwner)
          return false;
        return matches.target !== data.pillarIdToOwner[matches.sourceId];
      },
      mistake: (_e, data, matches) => {
        const pillarOwner = data.ShortName(data.pillarIdToOwner[matches.sourceId]);
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (from ${pillarOwner})`,
            de: `${matches.ability} (von ${pillarOwner})`,
            fr: `${matches.ability} (de ${pillarOwner})`,
            ja: `${matches.ability} (${pillarOwner}から)`,
            cn: `${matches.ability} (来自${pillarOwner})`,
            ko: `${matches.ability} (대상자 "${pillarOwner}")`,
          },
        };
      },
    },
    {
      // Titan phase orange marker
      id: 'E12S Promise Force Of The Land',
      damageRegex: '58A4',
      condition: (e) => e.type === '15',
      mistake: (_e, _data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          text: {
            en: `${matches.ability} (alone)`,
            de: `${matches.ability} (allein)`,
            fr: `${matches.ability} (seul(e))`,
            ja: `${matches.ability} (一人)`,
            cn: `${matches.ability} (单吃)`,
            ko: `${matches.ability} (혼자 맞음)`,
          },
        };
      },
    },
    {
      id: 'E12S Promise Gain Fire Resistance Down II',
      // The Beastly Sculpture gives a 3 second debuff, the Regal Sculpture gives a 14s one.
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '832' }),
      run: (_e, data, matches) => {
        data.fire = data.fire || {};
        data.fire[matches.target] = true;
      },
    },
    {
      id: 'E12S Promise Lose Fire Resistance Down II',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '832' }),
      run: (_e, data, matches) => {
        data.fire = data.fire || {};
        data.fire[matches.target] = false;
      },
    },
    {
      id: 'E12S Promise Small Lion Tether',
      netRegex: netregexes/* default.tether */.Z.tether({ source: 'Beastly Sculpture', id: '0011' }),
      netRegexDe: netregexes/* default.tether */.Z.tether({ source: 'Abbild Eines Löwen', id: '0011' }),
      netRegexFr: netregexes/* default.tether */.Z.tether({ source: 'Création Léonine', id: '0011' }),
      netRegexJa: netregexes/* default.tether */.Z.tether({ source: '創られた獅子', id: '0011' }),
      run: (_e, data, matches) => {
        data.smallLionIdToOwner = data.smallLionIdToOwner || {};
        data.smallLionIdToOwner[matches.sourceId.toUpperCase()] = matches.target;
        data.smallLionOwners = data.smallLionOwners || [];
        data.smallLionOwners.push(matches.target);
      },
    },
    {
      id: 'E12S Promise Small Lion Lionsblaze',
      netRegex: netregexes/* default.abilityFull */.Z.abilityFull({ source: 'Beastly Sculpture', id: '58B9' }),
      netRegexDe: netregexes/* default.abilityFull */.Z.abilityFull({ source: 'Abbild Eines Löwen', id: '58B9' }),
      netRegexFr: netregexes/* default.abilityFull */.Z.abilityFull({ source: 'Création Léonine', id: '58B9' }),
      netRegexJa: netregexes/* default.abilityFull */.Z.abilityFull({ source: '創られた獅子', id: '58B9' }),
      mistake: (_e, data, matches) => {
        // Folks baiting the big lion second can take the first small lion hit,
        // so it's not sufficient to check only the owner.
        if (!data.smallLionOwners)
          return;
        const owner = data.smallLionIdToOwner[matches.sourceId.toUpperCase()];
        if (!owner)
          return;
        if (matches.target === owner)
          return;

        // If the target also has a small lion tether, that is always a mistake.
        // Otherwise, it's only a mistake if the target has a fire debuff.
        const hasSmallLion = data.smallLionOwners.includes(matches.target);
        const hasFireDebuff = data.fire && data.fire[matches.target];

        if (hasSmallLion || hasFireDebuff) {
          const ownerNick = data.ShortName(owner);

          const centerY = -75;
          const x = parseFloat(matches.x);
          const y = parseFloat(matches.y);
          let dirObj = null;
          if (y < centerY) {
            if (x > 0)
              dirObj = outputs/* default.dirNE */.Z.dirNE;
            else
              dirObj = outputs/* default.dirNW */.Z.dirNW;
          } else {
            if (x > 0)
              dirObj = outputs/* default.dirSE */.Z.dirSE;
            else
              dirObj = outputs/* default.dirSW */.Z.dirSW;
          }

          return {
            type: 'fail',
            blame: owner,
            name: matches.target,
            text: {
              en: `${matches.ability} (from ${ownerNick}, ${dirObj['en']})`,
              de: `${matches.ability} (von ${ownerNick}, ${dirObj['de']})`,
              fr: `${matches.ability} (de ${ownerNick}, ${dirObj['fr']})`,
              ja: `${matches.ability} (${ownerNick}から, ${dirObj['ja']})`,
              cn: `${matches.ability} (来自${ownerNick}, ${dirObj['cn']}`,
              ko: `${matches.ability} (대상자 "${ownerNick}", ${dirObj['ko']})`,
            },
          };
        }
      },
    },
    {
      id: 'E12S Promise North Big Lion',
      netRegex: netregexes/* default.addedCombatantFull */.Z.addedCombatantFull({ name: 'Regal Sculpture' }),
      run: (_e, data, matches) => {
        const y = parseFloat(matches.y);
        const centerY = -75;
        if (y < centerY)
          data.northBigLion = matches.id.toUpperCase();
      },
    },
    {
      id: 'E12S Promise Big Lion Kingsblaze',
      netRegex: netregexes/* default.ability */.Z.ability({ source: 'Regal Sculpture', id: '4F9E' }),
      netRegexDe: netregexes/* default.ability */.Z.ability({ source: 'Abbild eines großen Löwen', id: '4F9E' }),
      netRegexFr: netregexes/* default.ability */.Z.ability({ source: 'création léonine royale', id: '4F9E' }),
      netRegexJa: netregexes/* default.ability */.Z.ability({ source: '創られた獅子王', id: '4F9E' }),
      mistake: (_e, data, matches) => {
        const singleTarget = matches.type === '21';
        const hasFireDebuff = data.fire && data.fire[matches.target];

        // Success if only one person takes it and they have no fire debuff.
        if (singleTarget && !hasFireDebuff)
          return;

        const output = {
          northBigLion: {
            en: 'north big lion',
            de: 'Nordem, großer Löwe',
            ja: '大ライオン(北)',
            cn: '北方大狮子',
            ko: '북쪽 큰 사자',
          },
          southBigLion: {
            en: 'south big lion',
            de: 'Süden, großer Löwe',
            ja: '大ライオン(南)',
            cn: '南方大狮子',
            ko: '남쪽 큰 사자',
          },
          shared: {
            en: 'shared',
            de: 'geteilt',
            ja: '重ねた',
            cn: '重叠',
            ko: '같이 맞음',
          },
          fireDebuff: {
            en: 'had fire',
            de: 'hatte Feuer',
            ja: '炎付き',
            cn: '火Debuff',
            ko: '화염 디버프 받음',
          },
        };

        const labels = [];
        if (data.northBigLion) {
          if (data.northBigLion === matches.sourceId)
            labels.push(output.northBigLion[data.parserLang] || output.northBigLion['en']);
          else
            labels.push(output.southBigLion[data.parserLang] || output.southBigLion['en']);
        }
        if (!singleTarget)
          labels.push(output.shared[data.parserLang] || output.shared['en']);
        if (hasFireDebuff)
          labels.push(output.fireDebuff[data.parserLang] || output.fireDebuff['en']);

        return {
          type: 'fail',
          name: matches.target,
          text: `${matches.ability} (${labels.join(', ')})`,
        };
      },
    },
    {
      id: 'E12S Knocked Off',
      // 589A = Ice Pillar (promise shiva phase)
      // 58B6 = Palm Of Temperance (promise statue hand)
      // 58B7 = Laser Eye (promise lion phase)
      // 58C1 = Darkest Dance (oracle tank jump + knockback in beginning and triple apoc)
      netRegex: netregexes/* default.ability */.Z.ability({ id: ['589A', '58B6', '58B7', '58C1'] }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
    {
      id: 'E12S Oracle Shadoweye',
      damageRegex: '58D2',
      condition: (e) => e.damage > 0,
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/diamond_weapon-ex.js



// TODO: warning for taking Diamond Flash (5FA1) stack on your own?

// Diamond Weapon Extreme
/* harmony default export */ const diamond_weapon_ex = ({
  zoneId: zone_id/* default.TheCloudDeckExtreme */.Z.TheCloudDeckExtreme,
  damageWarn: {
    'DiamondEx Auri Arts 1': '5FAF', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 2': '5FB2', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 3': '5FCD', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 4': '5FCE', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 5': '5FCF', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 6': '5FF8', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 7': '6159', // Auri Arts dashes/explosions
    'DiamondEx Articulated Bit Aetherial Bullet': '5FAB', // bit lasers during all phases
    'DiamondEx Diamond Shrapnel 1': '5FCB', // chasing circles
    'DiamondEx Diamond Shrapnel 2': '5FCC', // chasing circles
  },
  damageFail: {
    'DiamondEx Claw Swipe Left': '5FC2', // Adamant Purge platform cleave
    'DiamondEx Claw Swipe Right': '5FC3', // Adamant Purge platform cleave
    'DiamondEx Auri Cyclone 1': '5FD1', // standing on the blue knockback puck
    'DiamondEx Auri Cyclone 2': '5FD2', // standing on the blue knockback puck
    'DiamondEx Airship\'s Bane 1': '5FFE', // destroying one of the platforms after Auri Cyclone
    'DiamondEx Airship\'s Bane 2': '5FD3', // destroying one of the platforms after Auri Cyclone
  },
  shareWarn: {
    'DiamondEx Tank Lasers': '5FC8', // cleaving yellow lasers on top two enmity
    'DiamondEx Homing Laser': '5FC4', // Adamante Purge spread
  },
  shareFail: {
    'DiamondEx Flood Ray': '5FC7', // "limit cut" cleaves
  },
  triggers: [
    {
      id: 'DiamondEx Vertical Cleave Knocked Off',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '5FD0' }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/diamond_weapon.js



// Diamond Weapon Normal
/* harmony default export */ const diamond_weapon = ({
  zoneId: zone_id/* default.TheCloudDeck */.Z.TheCloudDeck,
  damageWarn: {
    'Diamond Weapon Auri Arts': '5FE3', // Auri Arts dashes
    'Diamond Weapon Diamond Shrapnel Initial': '5FE1', // initial circle of Diamond Shrapnel
    'Diamond Weapon Diamond Shrapnel Chasing': '5FE2', // followup circles from Diamond Shrapnel
    'Diamond Weapon Aetherial Bullet': '5FD5', // bit lasers
  },
  damageFail: {
    'Diamond Weapon Claw Swipe Left': '5FD9', // Adamant Purge platform cleave
    'Diamond Weapon Claw Swipe Right': '5FDA', // Adamant Purge platform cleave
    'Diamond Weapon Auri Cyclone 1': '5FE6', // standing on the blue knockback puck
    'Diamond Weapon Auri Cyclone 2': '5FE7', // standing on the blue knockback puck
    'Diamond Weapon Airship\'s Bane 1': '5FE8', // destroying one of the platforms after Auri Cyclone
    'Diamond Weapon Airship\'s Bane 2': '5FFE', // destroying one of the platforms after Auri Cyclone
  },
  shareWarn: {
    'Diamond Weapon Homing Laser': '5FDB', // spread markers
  },
  triggers: [
    {
      id: 'Diamond Weapon Vertical Cleave Knocked Off',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '5FE5' }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/emerald_weapon-ex.js


/* harmony default export */ const emerald_weapon_ex = ({
  zoneId: zone_id/* default.CastrumMarinumExtreme */.Z.CastrumMarinumExtreme,
  damageWarn: {
    'EmeraldEx Heat Ray': '5BD3', // Emerald Beam initial conal
    'EmeraldEx Photon Laser 1': '557B', // Emerald Beam inside circle
    'EmeraldEx Photon Laser 2': '557D', // Emerald Beam outside circle
    'EmeraldEx Heat Ray 1': '557A', // Emerald Beam rotating pulsing laser
    'EmeraldEx Heat Ray 2': '5579', // Emerald Beam rotating pulsing laser
    'EmeraldEx Explosion': '5596', // Magitek Mine explosion
    'EmeraldEx Tertius Terminus Est Initial': '55CD', // sword initial puddles
    'EmeraldEx Tertius Terminus Est Explosion': '55CE', // sword explosions
    'EmeraldEx Airborne Explosion': '55BD', // exaflare
    'EmeraldEx Sidescathe 1': '55D4', // left/right cleave
    'EmeraldEx Sidescathe 2': '55D5', // left/right cleave
    'EmeraldEx Shots Fired': '55B7', // rank and file soldiers
    'EmeraldEx Secundus Terminus Est': '55CB', // dropped + and x headmarkers
    'EmeraldEx Expire': '55D1', // ground aoe on boss "get out"
    'EmeraldEx Aire Tam Storm': '55D0', // expanding red and black ground aoe
  },
  shareWarn: {
    'EmeraldEx Divide Et Impera': '55D9', // non-tank protean spread
    'EmeraldEx Primus Terminus Est 1': '55C4', // knockback arrow
    'EmeraldEx Primus Terminus Est 2': '55C5', // knockback arrow
    'EmeraldEx Primus Terminus Est 3': '55C6', // knockback arrow
    'EmeraldEx Primus Terminus Est 4': '55C7', // knockback arrow
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/emerald_weapon.js



/* harmony default export */ const emerald_weapon = ({
  zoneId: zone_id/* default.CastrumMarinum */.Z.CastrumMarinum,
  damageWarn: {
    'Emerald Weapon Heat Ray': '4F9D', // Emerald Beam initial conal
    'Emerald Weapon Photon Laser 1': '5534', // Emerald Beam inside circle
    'Emerald Weapon Photon Laser 2': '5536', // Emerald Beam middle circle
    'Emerald Weapon Photon Laser 3': '5538', // Emerald Beam outside circle
    'Emerald Weapon Heat Ray 1': '5532', // Emerald Beam rotating pulsing laser
    'Emerald Weapon Heat Ray 2': '5533', // Emerald Beam rotating pulsing laser
    'Emerald Weapon Magnetic Mine Explosion': '5B04', // repulsing mine explosions
    'Emerald Weapon Sidescathe 1': '553F', // left/right cleave
    'Emerald Weapon Sidescathe 2': '5540', // left/right cleave
    'Emerald Weapon Sidescathe 3': '5541', // left/right cleave
    'Emerald Weapon Sidescathe 4': '5542', // left/right cleave
    'Emerald Weapon Bit Storm': '554A', // "get in"
    'Emerald Weapon Emerald Crusher': '553C', // blue knockback puck
    'Emerald Weapon Pulse Laser': '5548', // line aoe
    'Emerald Weapon Energy Aetheroplasm': '5551', // hitting a glowy orb
    'Emerald Weapon Divide Et Impera Ground': '556F', // party targeted ground cones
    'Emerald Weapon Primus Terminus Est': '4B3E', // ground circle during arrow headmarkers
    'Emerald Weapon Secundus Terminus Est': '556A', // X / + headmarkers
    'Emerald Weapon Tertius Terminus Est': '556D', // triple swords
    'Emerald Weapon Shots Fired': '555F', // line aoes from soldiers
  },
  shareWarn: {
    'Emerald Weapon Divide Et Impera P1': '554E', // tankbuster, probably cleaves, phase 1
    'Emerald Weapon Divide Et Impera P2': '5570', // tankbuster, probably cleaves, phase 2
  },
  triggers: [
    {
      id: 'Emerald Weapon Emerald Crusher Knocked Off',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '553E' }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
    {
      // Getting knocked into a wall from the arrow headmarker.
      id: 'Emerald Weapon Primus Terminus Est Wall',
      netRegex: netregexes/* default.ability */.Z.ability({ id: ['5563', '5564'] }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Pushed into wall',
            de: 'Rückstoß in die Wand',
            ja: '壁へノックバック',
            cn: '击退至墙',
            ko: '넉백',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/hades-ex.js



// Hades Ex
/* harmony default export */ const hades_ex = ({
  zoneId: zone_id/* default.TheMinstrelsBalladHadessElegy */.Z.TheMinstrelsBalladHadessElegy,
  damageWarn: {
    'HadesEx Shadow Spread 2': '47AA',
    'HadesEx Shadow Spread 3': '47E4',
    'HadesEx Shadow Spread 4': '47E5',
    // Everybody stacks in good faith for Bad Faith, so don't call it a mistake.
    // 'HadesEx Bad Faith 1': '47AD',
    // 'HadesEx Bad Faith 2': '47B0',
    // 'HadesEx Bad Faith 3': '47AE',
    // 'HadesEx Bad Faith 4': '47AF',
    'HadesEx Broken Faith': '47B2',
    'HadesEx Magic Spear': '47B6',
    'HadesEx Magic Chakram': '47B5',
    'HadesEx Forked Lightning': '47C9',
    'HadesEx Dark Current 1': '47F1',
    'HadesEx Dark Current 2': '47F2',
  },
  damageFail: {
    'HadesEx Comet': '47B9', // missed tower
    'HadesEx Ancient Eruption': '47D3',
    'HadesEx Purgation 1': '47EC',
    'HadesEx Purgation 2': '47ED',
    'HadesEx Shadow Stream': '47EA',
    'HadesEx Dead Space': '47EE',
  },
  shareWarn: {
    'HadesEx Shadow Spread Initial': '47A9',
    'HadesEx Ravenous Assault': '(?:47A6|47A7)',
    'HadesEx Dark Flame 1': '47C6',
    'HadesEx Dark Freeze 1': '47C4',
    'HadesEx Dark Freeze 2': '47DF',
  },
  triggers: [
    {
      id: 'HadesEx Dark II Tether',
      netRegex: netregexes/* default.tether */.Z.tether({ source: 'Shadow of the Ancients', id: '0011' }),
      run: (_e, data, matches) => {
        data.hasDark = data.hasDark || [];
        data.hasDark.push(matches.target);
      },
    },
    {
      id: 'HadesEx Dark II',
      damageRegex: '47BA',
      condition: (e, data) => {
        // Don't blame people who don't have tethers.
        return e.type !== '15' && data.me in data.hasDark;
      },
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'HadesEx Boss Tether',
      netRegex: netregexes/* default.tether */.Z.tether({ source: ['Igeyorhm\'s Shade', 'Lahabrea\'s Shade'], id: '000E', capture: false }),
      mistake: {
        type: 'warn',
        text: {
          en: 'Bosses Too Close',
          de: 'Bosses zu Nahe',
          fr: 'Boss trop proches',
          ja: 'ボス近すぎる',
          cn: 'BOSS靠太近了',
          ko: '쫄들이 너무 가까움',
        },
      },
    },
    {
      id: 'HadesEx Death Shriek',
      damageRegex: '47CB',
      condition: (e) => e.damage > 0,
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'HadesEx Beyond Death Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '566' }),
      run: (_e, data, matches) => {
        data.hasBeyondDeath = data.hasBeyondDeath || {};
        data.hasBeyondDeath[matches.target] = true;
      },
    },
    {
      id: 'HadesEx Beyond Death Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '566' }),
      run: (_e, data, matches) => {
        data.hasBeyondDeath = data.hasBeyondDeath || {};
        data.hasBeyondDeath[matches.target] = false;
      },
    },
    {
      id: 'HadesEx Beyond Death',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '566' }),
      delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (_e, data, matches) => {
        if (!data.hasBeyondDeath)
          return;
        if (!data.hasBeyondDeath[matches.target])
          return;
        return {
          name: matches.target,
          reason: matches.effect,
        };
      },
    },
    {
      id: 'HadesEx Doom Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '6E9' }),
      run: (_e, data, matches) => {
        data.hasDoom = data.hasDoom || {};
        data.hasDoom[matches.target] = true;
      },
    },
    {
      id: 'HadesEx Doom Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '6E9' }),
      run: (_e, data, matches) => {
        data.hasDoom = data.hasDoom || {};
        data.hasDoom[matches.target] = false;
      },
    },
    {
      id: 'HadesEx Doom',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '6E9' }),
      delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (_e, data, matches) => {
        if (!data.hasDoom)
          return;
        if (!data.hasDoom[matches.target])
          return;
        return {
          name: matches.target,
          reason: matches.effect,
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/hades.js


// Hades Normal
/* harmony default export */ const hades = ({
  zoneId: zone_id/* default.TheDyingGasp */.Z.TheDyingGasp,
  damageWarn: {
    'Hades Bad Faith 1': '414B',
    'Hades Bad Faith 2': '414C',
    'Hades Dark Eruption': '4152',
    'Hades Shadow Spread 1': '4156',
    'Hades Shadow Spread 2': '4157',
    'Hades Broken Faith': '414E',
    'Hades Hellborn Yawp': '416F',
    'Hades Purgation': '4172',
    'Hades Shadow Stream': '415C',
    'Hades Aero': '4595',
    'Hades Echo 1': '4163',
    'Hades Echo 2': '4164',
  },
  triggers: [
    // Things that should only hit one person.
    {
      id: 'Hades Nether Blast',
      damageRegex: '4163',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Hades Ravenous Assault',
      damageRegex: '4158',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Hades Ancient Darkness',
      damageRegex: '4593',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Hades Dual Strike',
      damageRegex: '4162',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/innocence-ex.js


// Innocence Extreme
/* harmony default export */ const innocence_ex = ({
  zoneId: zone_id/* default.TheCrownOfTheImmaculateExtreme */.Z.TheCrownOfTheImmaculateExtreme,
  damageWarn: {
    'InnoEx Duel Descent': '3ED2',
    'InnoEx Reprobation 1': '3EE0',
    'InnoEx Reprobation 2': '3ECC',
    'InnoEx Sword of Condemnation 1': '3EDE',
    'InnoEx Sword of Condemnation 2': '3EDF',
    'InnoEx Dream of the Rood 1': '3ED3',
    'InnoEx Dream of the Rood 2': '3ED4',
    'InnoEx Dream of the Rood 3': '3ED5',
    'InnoEx Dream of the Rood 4': '3ED6',
    'InnoEx Dream of the Rood 5': '3EFB',
    'InnoEx Dream of the Rood 6': '3EFC',
    'InnoEx Dream of the Rood 7': '3EFD',
    'InnoEx Dream of the Rood 8': '3EFE',
    'InnoEx Holy Trinity': '3EDB',
    'InnoEx Soul and Body 1': '3ED7',
    'InnoEx Soul and Body 2': '3ED8',
    'InnoEx Soul and Body 3': '3ED9',
    'InnoEx Soul and Body 4': '3EDA',
    'InnoEx Soul and Body 5': '3EFF',
    'InnoEx Soul and Body 6': '3F00',
    'InnoEx Soul and Body 7': '3F01',
    'InnoEx Soul and Body 8': '3F02',
    'InnoEx God Ray 1': '3EE6',
    'InnoEx God Ray 2': '3EE7',
    'InnoEx God Ray 3': '3EE8',
    'InnoEx Explosion': '3EF0',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/innocence.js


// Innocence Normal
/* harmony default export */ const innocence = ({
  zoneId: zone_id/* default.TheCrownOfTheImmaculate */.Z.TheCrownOfTheImmaculate,
  damageWarn: {
    'Inno Daybreak': '3E9D',
    'Inno Holy Trinity': '3EB3',

    'Inno Reprobation 1': '3EB6',
    'Inno Reprobation 2': '3EB8',
    'Inno Reprobation 3': '3ECB',
    'Inno Reprobation 4': '3EB7',

    'Inno Soul and Body 1': '3EB1',
    'Inno Soul and Body 2': '3EB2',
    'Inno Soul and Body 3': '3EF9',
    'Inno Soul and Body 4': '3EFA',

    'Inno God Ray 1': '3EBD',
    'Inno God Ray 2': '3EBE',
    'Inno God Ray 3': '3EBF',
    'Inno God Ray 4': '3EC0',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/levi-un.js



// It's hard to capture the reflection abilities from Leviathan's Head and Tail if you use
// ranged physical attacks / magic attacks respectively, as the ability names are the
// ability you used and don't appear to show up in the log as normal "ability" lines.
// That said, dots still tick independently on both so it's likely that people will atack
// them anyway.

// TODO: Figure out why Dread Tide / Waterspout appear like shares (i.e. 0x16 id).
// Dread Tide = 5CCA/5CCB/5CCC, Waterspout = 5CD1

// Leviathan Unreal
/* harmony default export */ const levi_un = ({
  zoneId: zone_id/* default.TheWhorleaterUnreal */.Z.TheWhorleaterUnreal,
  damageWarn: {
    'LeviUn Grand Fall': '5CDF', // very large circular aoe before spinny dives, applies heavy
    'LeviUn Hydroshot': '5CD5', // Wavespine Sahagin aoe that gives Dropsy effect
    'LeviUn Dreadstorm': '5CD6', // Wavetooth Sahagin aoe that gives Hysteria effect
  },
  damageFail: {
    'LeviUn Body Slam': '5CD2', // levi slam that tilts the boat
    'LeviUn Spinning Dive 1': '5CDB', // levi dash across the boat with knockback
    'LeviUn Spinning Dive 2': '5CE3', // levi dash across the boat with knockback
    'LeviUn Spinning Dive 3': '5CE8', // levi dash across the boat with knockback
    'LeviUn Spinning Dive 4': '5CE9', // levi dash across the boat with knockback
  },
  gainsEffectWarn: {
    'LeviUn Dropsy': '110', // standing in the hydro shot from the Wavespine Sahagin
  },
  gainsEffectFail: {
    'LeviUn Hysteria': '128', // standing in the dreadstorm from the Wavetooth Sahagin
  },
  triggers: [
    {
      id: 'LeviUn Body Slam Knocked Off',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '5CD2' }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/ruby_weapon-ex.js



// TODO: taking two different High-Powered Homing Lasers (4AD8)
// TODO: could blame the tethered player for White Agony / White Fury failures?

// Ruby Weapon Extreme
/* harmony default export */ const ruby_weapon_ex = ({
  zoneId: zone_id/* default.CinderDriftExtreme */.Z.CinderDriftExtreme,
  damageWarn: {
    'RubyEx Ruby Bit Magitek Ray': '4AD2', // line aoes during helicoclaw
    'RubyEx Spike Of Flame 1': '4AD3', // initial explosion during helicoclaw
    'RubyEx Spike Of Flame 2': '4B2F', // followup helicoclaw explosions
    'RubyEx Spike Of Flame 3': '4D04', // ravensclaw explosion at ends of lines
    'RubyEx Spike Of Flame 4': '4D05', // ravensclaw explosion at ends of lines
    'RubyEx Spike Of Flame 5': '4ACD', // ravensclaw explosion at ends of lines
    'RubyEx Spike Of Flame 6': '4ACE', // ravensclaw explosion at ends of lines
    'RubyEx Undermine': '4AD0', // ground aoes under the ravensclaw patches
    'RubyEx Ruby Ray': '4B02', // frontal laser
    'RubyEx Ravensflight 1': '4AD9', // dash around the arena
    'RubyEx Ravensflight 2': '4ADA', // dash around the arena
    'RubyEx Ravensflight 3': '4ADD', // dash around the arena
    'RubyEx Ravensflight 4': '4ADE', // dash around the arena
    'RubyEx Ravensflight 5': '4ADF', // dash around the arena
    'RubyEx Ravensflight 6': '4AE0', // dash around the arena
    'RubyEx Ravensflight 7': '4AE1', // dash around the arena
    'RubyEx Ravensflight 8': '4AE2', // dash around the arena
    'RubyEx Ravensflight 9': '4AE3', // dash around the arena
    'RubyEx Ravensflight 10': '4AE4', // dash around the arena
    'RubyEx Ravensflight 11': '4AE5', // dash around the arena
    'RubyEx Ravensflight 12': '4AE6', // dash around the arena
    'RubyEx Ravensflight 13': '4AE7', // dash around the arena
    'RubyEx Ravensflight 14': '4AE8', // dash around the arena
    'RubyEx Ravensflight 15': '4AE9', // dash around the arena
    'RubyEx Ravensflight 16': '4AEA', // dash around the arena
    'RubyEx Ravensflight 17': '4E6B', // dash around the arena
    'RubyEx Ravensflight 18': '4E6C', // dash around the arena
    'RubyEx Ravensflight 19': '4E6D', // dash around the arena
    'RubyEx Ravensflight 20': '4E6E', // dash around the arena
    'RubyEx Ravensflight 21': '4E6F', // dash around the arena
    'RubyEx Ravensflight 22': '4E70', // dash around the arena
    'RubyEx Cut And Run 1': '4B05', // slow charge across arena after stacks
    'RubyEx Cut And Run 2': '4B06', // slow charge across arena after stacks
    'RubyEx Cut And Run 3': '4B07', // slow charge across arena after stacks
    'RubyEx Cut And Run 4': '4B08', // slow charge across arena after stacks
    'RubyEx Cut And Run 5': '4DOD', // slow charge across arena after stacks
    'RubyEx Meteor Burst': '4AF2', // meteor exploding
    'RubyEx Bradamante': '4E38', // headmarkers with line aoes
    'RubyEx Comet Heavy Impact': '4AF6', // letting a tank comet land
  },
  damageFail: {
    'RubyEx Ruby Sphere Burst': '4ACB', // exploding the red mine
    'RubyEx Lunar Dynamo': '4EB0', // "get in" from Raven's Image
    'RubyEx Iron Chariot': '4EB1', // "get out" from Raven's Image
    'RubyEx Heart In The Machine': '4AFA', // White Agony/Fury skull hitting players
  },
  shareWarn: {
    'RubyEx Homing Lasers': '4AD6', // spread markers during cut and run
    'RubyEx Meteor Stream': '4E68', // spread markers during P2
  },
  gainsEffectFail: {
    'RubyEx Hysteria': '128', // Negative Aura lookaway failure
  },
  triggers: [
    {
      id: 'RubyEx Screech',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '4AEE' }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked into wall',
            de: 'Rückstoß in die Wand',
            ja: '壁へノックバック',
            cn: '击退至墙',
            ko: '넉백',
          },
        };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/ruby_weapon.js


// Ruby Normal
/* harmony default export */ const ruby_weapon = ({
  zoneId: zone_id/* default.CinderDrift */.Z.CinderDrift,
  damageWarn: {
    'Ruby Ravensclaw': '4A93', // centered circle aoe for ravensclaw
    'Ruby Spike Of Flame 1': '4A9A', // initial explosion during helicoclaw
    'Ruby Spike Of Flame 2': '4B2E', // followup helicoclaw explosions
    'Ruby Spike Of Flame 3': '4A94', // ravensclaw explosion at ends of lines
    'Ruby Spike Of Flame 4': '4A95', // ravensclaw explosion at ends of lines
    'Ruby Spike Of Flame 5': '4D02', // ravensclaw explosion at ends of lines
    'Ruby Spike Of Flame 6': '4D03', // ravensclaw explosion at ends of lines
    'Ruby Ruby Ray': '4AC6', // frontal laser
    'Ruby Undermine': '4A97', // ground aoes under the ravensclaw patches
    'Ruby Ravensflight 1': '4E69', // dash around the arena
    'Ruby Ravensflight 2': '4E6A', // dash around the arena
    'Ruby Ravensflight 3': '4AA1', // dash around the arena
    'Ruby Ravensflight 4': '4AA2', // dash around the arena
    'Ruby Ravensflight 5': '4AA3', // dash around the arena
    'Ruby Ravensflight 6': '4AA4', // dash around the arena
    'Ruby Ravensflight 7': '4AA5', // dash around the arena
    'Ruby Ravensflight 8': '4AA6', // dash around the arena
    'Ruby Ravensflight 9': '4AA7', // dash around the arena
    'Ruby Ravensflight 10': '4C21', // dash around the arena
    'Ruby Ravensflight 11': '4C2A', // dash around the arena
    'Ruby Comet Burst': '4AB4', // meteor exploding
    'Ruby Bradamante': '4ABC', // headmarkers with line aoes
  },
  shareWarn: {
    'Ruby Homing Laser': '4AC5', // spread markers in P1
    'Ruby Meteor Stream': '4E67', // spread markers in P2
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/shiva-un.js



// Shiva Unreal
/* harmony default export */ const shiva_un = ({
  zoneId: zone_id/* default.TheAkhAfahAmphitheatreUnreal */.Z.TheAkhAfahAmphitheatreUnreal,
  damageWarn: {
    // Large white circles.
    'ShivaEx Icicle Impact': '537B',
    // "get in" aoe
    'ShivaEx Whiteout': '5376',
    // Avoidable tank stun.
    'ShivaEx Glacier Bash': '5375',
  },
  damageFail: {
    // 270 degree attack.
    'ShivaEx Glass Dance': '5378',
  },
  shareWarn: {
    // Hailstorm spread marker.
    'ShivaEx Hailstorm': '536F',
  },
  shareFail: {
    // Laser.  TODO: maybe blame the person it's on??
    'ShivaEx Avalanche': '5379',
  },
  triggers: [
    {
      // Party shared tank buster.
      id: 'ShivaEx Icebrand',
      damageRegex: '5373',
      condition: (e) => {
        // Should be shared with friends.
        return e.type === '15';
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'ShivaEx Deep Freeze',
      // Shiva also uses ability 537A on you, but it has an unknown name.
      // So, use the effect instead for free translation.
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '1E7' }),
      condition: (_e, _data, matches) => {
        // The intermission also gets this effect, but for a shorter duration.
        return parseFloat(matches.duration) > 20;
      },
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/titania.js


/* harmony default export */ const titania = ({
  zoneId: zone_id/* default.TheDancingPlague */.Z.TheDancingPlague,
  damageWarn: {
    'Titania Wood\'s Embrace': '3D50',
    // 'Titania Frost Rune': '3D4E',
    'Titania Gentle Breeze': '3F83',
    'Titania Leafstorm 1': '3D55',
    'Titania Puck\'s Rebuke': '3D58',
    'Titania Leafstorm 2': '3E03',
  },
  damageFail: {
    'Titania Phantom Rune 1': '3D5D',
    'Titania Phantom Rune 2': '3D5E',
  },
  shareFail: {
    'Titania Divination Rune': '3D5B',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/titania-ex.js


/* harmony default export */ const titania_ex = ({
  zoneId: zone_id/* default.TheDancingPlagueExtreme */.Z.TheDancingPlagueExtreme,
  damageWarn: {
    'TitaniaEx Wood\'s Embrace': '3D2F',
    // 'TitaniaEx Frost Rune': '3D2B',
    'TitaniaEx Gentle Breeze': '3F82',
    'TitaniaEx Leafstorm 1': '3D39',
    'TitaniaEx Puck\'s Rebuke': '3D43',
    'TitaniaEx Wallop': '3D3B',
    'TitaniaEx Leafstorm 2': '3D49',
  },
  damageFail: {
    'TitaniaEx Phantom Rune 1': '3D4C',
    'TitaniaEx Phantom Rune 2': '3D4D',
  },
  shareFail: {
    // TODO: This could maybe blame the person with the tether?
    'TitaniaEx Thunder Rune': '3D29',
    'TitaniaEx Divination Rune': '3D4A',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/titan-un.js


// Titan Unreal
/* harmony default export */ const titan_un = ({
  zoneId: zone_id/* default.TheNavelUnreal */.Z.TheNavelUnreal,
  damageWarn: {
    'TitanUn Weight Of The Land': '58FE',
    'TitanUn Burst': '5ADF',
  },
  damageFail: {
    'TitanUn Landslide': '5ADC',
    'TitanUn Gaoler Landslide': '5902',
  },
  shareWarn: {
    'TitanUn Rock Buster': '58F6',
  },
  shareFail: {
    'TitanUn Mountain Buster': '58F7',
  },
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/varis-ex.js


/* harmony default export */ const varis_ex = ({
  zoneId: zone_id/* default.MemoriaMiseraExtreme */.Z.MemoriaMiseraExtreme,
  damageWarn: {
    'VarisEx Alea Iacta Est 1': '4CD2',
    'VarisEx Alea Iacta Est 2': '4CD3',
    'VarisEx Alea Iacta Est 3': '4CD4',
    'VarisEx Alea Iacta Est 4': '4CD5',
    'VarisEx Alea Iacta Est 5': '4CD6',
    'VarisEx Ignis Est 1': '4CB5',
    'VarisEx Ignis Est 2': '4CC5',
    'VarisEx Ventus Est 1': '4CC7',
    'VarisEx Ventus Est 2': '4CC8',
    'VarisEx Assault Cannon': '4CE5',
    'VarisEx Fortius Rotating': '4CE9',
  },
  damageFail: {
    // Don't hit the shields!
    'VarisEx Repay': '4CDD',
  },
  shareWarn: {
    // This is the "protean" fortius.
    'VarisEx Fortius Protean': '4CE7',
  },
  shareFail: {
    'VarisEx Magitek Burst': '4CDF',
    'VarisEx Aetherochemical Grenado': '4CED',
  },
  triggers: [
    {
      id: 'VarisEx Terminus Est',
      damageRegex: '4CB4',
      suppressSeconds: 1,
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/wol.js



// TODO: Radiant Braver is 4F16/4F17(x2), shouldn't get hit by both?
// TODO: Radiant Desperado is 4F18/4F19, shouldn't get hit by both?
// TODO: Radiant Meteor is 4F1A, and shouldn't get hit by more than 1?
// TODO: missing a tower?

// Note: Deliberately not including pyretic damage as an error.
// Note: It doesn't appear that there's any way to tell who failed the cutscene.

/* harmony default export */ const wol = ({
  zoneId: zone_id/* default.TheSeatOfSacrifice */.Z.TheSeatOfSacrifice,
  damageWarn: {
    'WOL Solemn Confiteor': '4F2A', // ground puddles
    'WOL Coruscant Saber In': '4F10', // saber in
    'WOL Coruscant Saber Out': '4F11', // saber out
    'WOL Imbued Corusance Out': '4F4B', // saber out
    'WOL Imbued Corusance In': '4F4C', // saber in
    'WOL Shining Wave': '4F26', // sword triangle
    'WOL Cauterize': '4F25',
    'WOL Brimstone Earth 1': '4F1E', // corner growing circles, initial
    'WOL Brimstone Earth 2': '4F1F', // corner growing circles, growing
    'WOL Flare Breath': '4F24',
    'WOL Decimation': '4F23',
  },
  gainsEffectWarn: {
    'WOL Deep Freeze': '4E6',
  },
  triggers: [
    {
      id: 'WOL True Walking Dead',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '38E' }),
      delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (e, _data, matches) => {
        return { type: 'fail', name: e.target, reason: matches.effect };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/wol-ex.js



// TODO: Radiant Braver is 4EF7/4EF8(x2), shouldn't get hit by both?
// TODO: Radiant Desperado is 4EF9/4EFA, shouldn't get hit by both?
// TODO: Radiant Meteor is 4EFC, and shouldn't get hit by more than 1?
// TODO: Absolute Holy should be shared?
// TODO: intersecting brimstones?

/* harmony default export */ const wol_ex = ({
  zoneId: zone_id/* default.TheSeatOfSacrificeExtreme */.Z.TheSeatOfSacrificeExtreme,
  damageWarn: {
    'WOLEx Solemn Confiteor': '4F0C', // ground puddles
    'WOLEx Coruscant Saber In': '4EF2', // saber in
    'WOLEx Coruscant Saber Out': '4EF1', // saber out
    'WOLEx Imbued Corusance Out': '4F49', // saber out
    'WOLEx Imbued Corusance In': '4F4A', // saber in
    'WOLEx Shining Wave': '4F08', // sword triangle
    'WOLEx Cauterize': '4F07',
    'WOLEx Brimstone Earth': '4F00', // corner growing circles, growing
  },
  shareWarn: {
    'WOLEx Absolute Stone III': '4EEB', // protean wave imbued magic
    'WOLEx Flare Breath': '4F06', // tether from summoned bahamuts
    'WOLEx Perfect Decimation': '4F05', // smn/war phase marker
  },
  gainsEffectWarn: {
    'WOLEx Deep Freeze': '4E6', // failing Absolute Blizzard III
    'WOLEx Damage Down': '274', // failing Absolute Flash
  },
  triggers: [
    {
      id: 'WOLEx True Walking Dead',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '8FF' }),
      delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (e, _data, matches) => {
        return { type: 'fail', name: e.target, reason: matches.effect };
      },
    },
    {
      id: 'WOLEx Tower',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '4F04', capture: false }),
      mistake: {
        type: 'fail',
        reason: {
          en: 'Missed Tower',
          de: 'Turm verpasst',
          fr: 'Tour manquée',
          ja: '塔を踏まなかった',
          cn: '没踩塔',
          ko: '장판 실수',
        },
      },
    },
    {
      id: 'WOLEx True Hallowed Ground',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '4F44' }),
      mistake: (_e, _data, matches) => {
        return { type: 'fail', reason: matches.ability };
      },
    },
    {
      // For Berserk and Deep Darkside
      id: 'WOLEx Missed Interrupt',
      netRegex: netregexes/* default.ability */.Z.ability({ id: ['5156', '5158'] }),
      mistake: (_e, _data, matches) => {
        return { type: 'fail', reason: matches.ability };
      },
    },
    {
      id: 'WolEx Katon San Share',
      netRegex: netregexes/* default.ability */.Z.ability({ id: '4EFE' }),
      condition: (e) => e.type === '15',
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/ultimate/the_epic_of_alexander.js



// TODO: FIX luminous aetheroplasm warning not working
// TODO: FIX doll death not working
// TODO: failing hand of pain/parting (check for high damage?)
// TODO: make sure everybody takes exactly one protean (rather than watching double hits)
// TODO: thunder not hitting exactly 2?
// TODO: person with water/thunder debuff dying
// TODO: bad nisi pass
// TODO: failed gavel mechanic
// TODO: double rocket punch not hitting exactly 2? (or tanks)
// TODO: standing in sludge puddles before hidden mine?
// TODO: hidden mine failure?
// TODO: failures of ordained motion / stillness
// TODO: failures of plaint of severity (tethers)
// TODO: failures of plaint of solidarity (shared sentence)
// TODO: ordained capital punishment hitting non-tanks

/* harmony default export */ const the_epic_of_alexander = ({
  zoneId: zone_id/* default.TheEpicOfAlexanderUltimate */.Z.TheEpicOfAlexanderUltimate,
  damageWarn: {
    'TEA Sluice': '49B1',
    'TEA Protean Wave 1': '4824',
    'TEA Protean Wave 2': '49B5',
    'TEA Spin Crusher': '4A72',
    'TEA Sacrament': '485F',
    'TEA Radiant Sacrament': '4886',
    'TEA Almighty Judgment': '4890',
  },
  damageFail: {
    'TEA Hawk Blaster': '4830',
    'TEA Chakram': '4855',
    'TEA Enumeration': '4850',
    'TEA Apocalyptic Ray': '484C',
    'TEA Propeller Wind': '4832',
  },
  shareWarn: {
    'TEA Protean Wave Double 1': '49B6',
    'TEA Protean Wave Double 2': '4825',
    'TEA Fluid Swing': '49B0',
    'TEA Fluid Strike': '49B7',
    'TEA Hidden Mine': '4852',
    'TEA Alpha Sword': '486B',
    'TEA Flarethrower': '486B',
    'TEA Chastening Heat': '4A80',
    'TEA Divine Spear': '4A82',
    'TEA Ordained Punishment': '4891',
    // Optical Spread
    'TEA Individual Reprobation': '488C',
  },
  triggers: [
    {
      // Balloon Popping.  It seems like the person who pops it is the
      // first person listed damage-wise, so they are likely the culprit.
      id: 'TEA Outburst',
      damageRegex: '482A',
      collectSeconds: 0.5,
      suppressSeconds: 5,
      mistake: (e) => {
        return { type: 'fail', blame: e[0].targetName, text: e[0].attackerName };
      },
    },
    {
      // "too much luminous aetheroplasm"
      // When this happens, the target explodes, hitting nearby people
      // but also themselves.
      id: 'TEA Exhaust',
      damageRegex: '481F',
      condition: (e) => e.targetName === e.attackerName,
      mistake: (e) => {
        return {
          type: 'fail',
          blame: e.targetName,
          text: {
            en: 'luminous aetheroplasm',
            de: 'Luminiszentes Ätheroplasma',
            fr: 'Éthéroplasma lumineux',
            ja: '光性爆雷',
            cn: '光性爆雷',
          },
        };
      },
    },
    {
      id: 'TEA Dropsy',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '121' }),
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'TEA Tether Tracking',
      netRegex: netregexes/* default.tether */.Z.tether({ source: 'Jagd Doll', id: '0011' }),
      run: (_e, data, matches) => {
        data.jagdTether = data.jagdTether || {};
        data.jagdTether[matches.sourceId] = matches.target;
      },
    },
    {
      id: 'TEA Reducible Complexity',
      damageRegex: '4821',
      mistake: (e, data) => {
        return {
          type: 'fail',
          // This may be undefined, which is fine.
          name: data.jagdTether ? data.jagdTether[e.attackerId] : undefined,
          text: {
            en: 'Doll Death',
            de: 'Puppe Tot',
            fr: 'Poupée morte',
            ja: 'ドールが死んだ',
            cn: '浮士德死亡',
          },
        };
      },
    },
    {
      id: 'TEA Drainage',
      damageRegex: '4827',
      condition: (e, data) => {
        // TODO: remove this when ngld overlayplugin is the default
        if (!data.party.partyNames.length)
          return false;

        return data.IsPlayerId(e.targetId) && !data.party.isTank(e.targetName);
      },
      mistake: (e) => {
        return { type: 'fail', name: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'TEA Throttle Gain',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '2BC' }),
      run: (_e, data, matches) => {
        data.hasThrottle = data.hasThrottle || {};
        data.hasThrottle[matches.target] = true;
      },
    },
    {
      id: 'TEA Throttle Lose',
      netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '2BC' }),
      run: (_e, data, matches) => {
        data.hasThrottle = data.hasThrottle || {};
        data.hasThrottle[matches.target] = false;
      },
    },
    {
      id: 'TEA Throttle',
      netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '2BC' }),
      delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (_e, data, matches) => {
        if (!data.hasThrottle)
          return;
        if (!data.hasThrottle[matches.target])
          return;
        return {
          name: matches.target,
          reason: matches.effect,
        };
      },
    },
    {
      // Optical Stack
      id: 'TEA Collective Reprobation',
      damageRegex: '488D',
      condition: (e) => {
        // Single Tap
        return e.type === '15';
      },
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
});

;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/oopsy_manifest.txt
































































































/* harmony default export */ const oopsy_manifest = ({'00-misc/buffs.js': buffs,'00-misc/general.js': general,'00-misc/test.js': test,'02-arr/trial/ifrit-nm.js': ifrit_nm,'02-arr/trial/levi-ex.js': levi_ex,'02-arr/trial/shiva-hm.js': shiva_hm,'02-arr/trial/shiva-ex.js': shiva_ex,'02-arr/trial/titan-hm.js': titan_hm,'02-arr/trial/titan-ex.js': titan_ex,'03-hw/alliance/weeping_city.js': weeping_city,'03-hw/dungeon/aetherochemical_research_facility.js': aetherochemical_research_facility,'03-hw/dungeon/fractal_continuum.js': fractal_continuum,'03-hw/dungeon/gubal_library_hard.js': gubal_library_hard,'03-hw/dungeon/sohm_al_hard.js': sohm_al_hard,'03-hw/raid/a12n.js': a12n,'04-sb/dungeon/ala_mhigo.js': ala_mhigo,'04-sb/dungeon/bardams_mettle.js': bardams_mettle,'04-sb/dungeon/kugane_castle.js': kugane_castle,'04-sb/dungeon/st_mocianne_hard.js': st_mocianne_hard,'04-sb/dungeon/swallows_compass.js': swallows_compass,'04-sb/dungeon/temple_of_the_fist.js': temple_of_the_fist,'04-sb/dungeon/the_burn.js': the_burn,'04-sb/raid/o1n.js': o1n,'04-sb/raid/o2n.js': o2n,'04-sb/raid/o3n.js': o3n,'04-sb/raid/o4n.js': o4n,'04-sb/raid/o4s.js': o4s,'04-sb/raid/o7s.js': o7s,'04-sb/raid/o12s.js': o12s,'04-sb/trial/byakko-ex.js': byakko_ex,'04-sb/trial/shinryu.js': shinryu,'04-sb/trial/susano-ex.js': susano_ex,'04-sb/ultimate/ultima_weapon_ultimate.js': ultima_weapon_ultimate,'04-sb/ultimate/unending_coil_ultimate.js': unending_coil_ultimate,'05-shb/alliance/the_copied_factory.js': the_copied_factory,'05-shb/alliance/the_puppets_bunker.js': the_puppets_bunker,'05-shb/alliance/the_tower_at_paradigms_breach.js': the_tower_at_paradigms_breach,'05-shb/dungeon/akadaemia_anyder.js': akadaemia_anyder,'05-shb/dungeon/amaurot.js': amaurot,'05-shb/dungeon/anamnesis_anyder.js': anamnesis_anyder,'05-shb/dungeon/dohn_mheg.js': dohn_mheg,'05-shb/dungeon/heroes_gauntlet.js': heroes_gauntlet,'05-shb/dungeon/holminster_switch.js': holminster_switch,'05-shb/dungeon/malikahs_well.js': malikahs_well,'05-shb/dungeon/matoyas_relict.js': matoyas_relict,'05-shb/dungeon/mt_gulg.js': mt_gulg,'05-shb/dungeon/paglthan.js': paglthan,'05-shb/dungeon/qitana_ravel.js': qitana_ravel,'05-shb/dungeon/the_grand_cosmos.js': the_grand_cosmos,'05-shb/dungeon/twinning.js': twinning,'05-shb/eureka/delubrum_reginae.js': delubrum_reginae,'05-shb/eureka/delubrum_reginae_savage.js': delubrum_reginae_savage,'05-shb/raid/e1n.js': e1n,'05-shb/raid/e1s.js': e1s,'05-shb/raid/e2n.js': e2n,'05-shb/raid/e2s.js': e2s,'05-shb/raid/e3n.js': e3n,'05-shb/raid/e3s.js': e3s,'05-shb/raid/e4n.js': e4n,'05-shb/raid/e4s.js': e4s,'05-shb/raid/e5n.js': e5n,'05-shb/raid/e5s.js': e5s,'05-shb/raid/e6n.js': e6n,'05-shb/raid/e6s.js': e6s,'05-shb/raid/e7n.js': e7n,'05-shb/raid/e7s.js': e7s,'05-shb/raid/e8n.js': e8n,'05-shb/raid/e8s.js': e8s,'05-shb/raid/e9n.js': e9n,'05-shb/raid/e9s.js': e9s,'05-shb/raid/e10n.js': e10n,'05-shb/raid/e10s.js': e10s,'05-shb/raid/e11n.js': e11n,'05-shb/raid/e11s.js': e11s,'05-shb/raid/e12n.js': e12n,'05-shb/raid/e12s.js': e12s,'05-shb/trial/diamond_weapon-ex.js': diamond_weapon_ex,'05-shb/trial/diamond_weapon.js': diamond_weapon,'05-shb/trial/emerald_weapon-ex.js': emerald_weapon_ex,'05-shb/trial/emerald_weapon.js': emerald_weapon,'05-shb/trial/hades-ex.js': hades_ex,'05-shb/trial/hades.js': hades,'05-shb/trial/innocence-ex.js': innocence_ex,'05-shb/trial/innocence.js': innocence,'05-shb/trial/levi-un.js': levi_un,'05-shb/trial/ruby_weapon-ex.js': ruby_weapon_ex,'05-shb/trial/ruby_weapon.js': ruby_weapon,'05-shb/trial/shiva-un.js': shiva_un,'05-shb/trial/titania.js': titania,'05-shb/trial/titania-ex.js': titania_ex,'05-shb/trial/titan-un.js': titan_un,'05-shb/trial/varis-ex.js': varis_ex,'05-shb/trial/wol.js': wol,'05-shb/trial/wol-ex.js': wol_ex,'05-shb/ultimate/the_epic_of_alexander.js': the_epic_of_alexander,});

/***/ })

}]);