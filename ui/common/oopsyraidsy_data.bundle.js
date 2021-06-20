(self["webpackChunkcactbot"] = self["webpackChunkcactbot"] || []).push([[727],{

/***/ 8400:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ oopsy_manifest)
});

// EXTERNAL MODULE: ./resources/netregexes.ts
var netregexes = __webpack_require__(7641);
// EXTERNAL MODULE: ./resources/zone_id.ts
var zone_id = __webpack_require__(2248);
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/00-misc/buffs.js

 // Abilities seem instant.

const abilityCollectSeconds = 0.5; // Observation: up to ~1.2 seconds for a buff to roll through the party.

const effectCollectSeconds = 2.0; // args: triggerId, netRegex, field, type, ignoreSelf

const missedFunc = args => {
  return {
    // Sure, not all of these are "buffs" per se, but they're all in the buffs file.
    id: 'Buff ' + args.triggerId,
    netRegex: args.netRegex,
    condition: (_evt, data, matches) => {
      const sourceId = matches.sourceId.toUpperCase();
      if (data.party.partyIds.includes(sourceId)) return true;

      if (data.petIdToOwnerId) {
        const ownerId = data.petIdToOwnerId[sourceId];
        if (ownerId && data.party.partyIds.includes(ownerId)) return true;
      }

      return false;
    },
    collectSeconds: args.collectSeconds,
    mistake: (_allEvents, data, allMatches) => {
      const partyNames = data.party.partyNames; // TODO: consider dead people somehow

      const gotBuffMap = {};

      for (const name of partyNames) gotBuffMap[name] = false;

      const firstMatch = allMatches[0];
      let sourceName = firstMatch.source; // Blame pet mistakes on owners.

      if (data.petIdToOwnerId) {
        const petId = firstMatch.sourceId.toUpperCase();
        const ownerId = data.petIdToOwnerId[petId];

        if (ownerId) {
          const ownerName = data.party.nameFromId(ownerId);
          if (ownerName) sourceName = ownerName;else console.error(`Couldn't find name for ${ownerId} from pet ${petId}`);
        }
      }

      if (args.ignoreSelf) gotBuffMap[sourceName] = true;
      const thingName = firstMatch[args.field];

      for (const matches of allMatches) {
        // In case you have multiple party members who hit the same cooldown at the same
        // time (lol?), then ignore anybody who wasn't the first.
        if (matches.source !== firstMatch.source) continue;
        gotBuffMap[matches.target] = true;
      }

      const missed = Object.keys(gotBuffMap).filter(x => !gotBuffMap[x]);
      if (missed.length === 0) return; // TODO: oopsy could really use mouseover popups for details.
      // TODO: alternatively, if we have a death report, it'd be good to
      // explicitly call out that other people got a heal this person didn't.

      if (missed.length < 4) {
        return {
          type: args.type,
          blame: sourceName,
          text: {
            en: thingName + ' missed ' + missed.map(x => data.ShortName(x)).join(', '),
            de: thingName + ' verfehlt ' + missed.map(x => data.ShortName(x)).join(', '),
            fr: thingName + ' manqué(e) sur ' + missed.map(x => data.ShortName(x)).join(', '),
            ja: '(' + missed.map(x => data.ShortName(x)).join(', ') + ') が' + thingName + 'を受けなかった',
            cn: missed.map(x => data.ShortName(x)).join(', ') + ' 没受到 ' + thingName,
            ko: thingName + ' ' + missed.map(x => data.ShortName(x)).join(', ') + '에게 적용안됨'
          }
        };
      } // If there's too many people, just list the number of people missed.
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
          ko: thingName + ' ' + missed.length + '명에게 적용안됨'
        }
      };
    }
  };
};

const missedMitigationBuff = args => {
  if (!args.effectId) console.error('Missing effectId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: args.effectId
    }),
    field: 'effect',
    type: 'heal',
    ignoreSelf: args.ignoreSelf,
    collectSeconds: args.collectSeconds ? args.collectSeconds : effectCollectSeconds
  });
};

const missedDamageAbility = args => {
  if (!args.abilityId) console.error('Missing abilityId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: netregexes/* default.ability */.Z.ability({
      id: args.abilityId
    }),
    field: 'ability',
    type: 'damage',
    ignoreSelf: args.ignoreSelf,
    collectSeconds: args.collectSeconds ? args.collectSeconds : abilityCollectSeconds
  });
};

const missedHeal = args => {
  if (!args.abilityId) console.error('Missing abilityId: ' + JSON.stringify(args));
  return missedFunc({
    triggerId: args.id,
    netRegex: netregexes/* default.ability */.Z.ability({
      id: args.abilityId
    }),
    field: 'ability',
    type: 'heal',
    collectSeconds: args.collectSeconds ? args.collectSeconds : abilityCollectSeconds
  });
};

const missedMitigationAbility = missedHeal;
/* harmony default export */ const buffs = ({
  zoneId: zone_id/* default.MatchAll */.Z.MatchAll,
  triggers: [{
    id: 'Buff Pet To Owner Mapper',
    netRegex: netregexes/* default.addedCombatantFull */.Z.addedCombatantFull(),
    run: (_e, data, matches) => {
      if (matches.ownerId === '0') return;
      data.petIdToOwnerId = data.petIdToOwnerId || {}; // Fix any lowercase ids.

      data.petIdToOwnerId[matches.id.toUpperCase()] = matches.ownerId.toUpperCase();
    }
  }, {
    id: 'Buff Pet To Owner Clearer',
    netRegex: netregexes/* default.changeZone */.Z.changeZone(),
    run: (_e, data) => {
      // Clear this hash periodically so it doesn't have false positives.
      data.petIdToOwnerId = {};
    }
  }, // Prefer abilities to effects, as effects take longer to roll through the party.
  // However, some things are only effects and so there is no choice.
  // For things you can step in or out of, give a longer timer?  This isn't perfect.
  // TODO: include soil here??
  missedMitigationBuff({
    id: 'Collective Unconscious',
    effectId: '351',
    collectSeconds: 10
  }), missedMitigationBuff({
    id: 'Passage of Arms',
    effectId: '498',
    ignoreSelf: true,
    collectSeconds: 10
  }), missedMitigationBuff({
    id: 'Divine Veil',
    effectId: '2D7',
    ignoreSelf: true
  }), missedMitigationAbility({
    id: 'Heart Of Light',
    abilityId: '3F20'
  }), missedMitigationAbility({
    id: 'Dark Missionary',
    abilityId: '4057'
  }), missedMitigationAbility({
    id: 'Shake It Off',
    abilityId: '1CDC'
  }), // 3F44 is the correct Quadruple Technical Finish, others are Dinky Technical Finish.
  missedDamageAbility({
    id: 'Technical Finish',
    abilityId: '3F4[1-4]'
  }), missedDamageAbility({
    id: 'Divination',
    abilityId: '40A8'
  }), missedDamageAbility({
    id: 'Brotherhood',
    abilityId: '1CE4'
  }), missedDamageAbility({
    id: 'Battle Litany',
    abilityId: 'DE5'
  }), missedDamageAbility({
    id: 'Embolden',
    abilityId: '1D60'
  }), missedDamageAbility({
    id: 'Battle Voice',
    abilityId: '76',
    ignoreSelf: true
  }), // Too noisy (procs every three seconds, and bards often off doing mechanics).
  // missedDamageBuff({ id: 'Wanderer\'s Minuet', effectId: '8A8', ignoreSelf: true }),
  // missedDamageBuff({ id: 'Mage\'s Ballad', effectId: '8A9', ignoreSelf: true }),
  // missedDamageBuff({ id: 'Army\'s Paeon', effectId: '8AA', ignoreSelf: true }),
  missedMitigationAbility({
    id: 'Troubadour',
    abilityId: '1CED'
  }), missedMitigationAbility({
    id: 'Tactician',
    abilityId: '41F9'
  }), missedMitigationAbility({
    id: 'Shield Samba',
    abilityId: '3E8C'
  }), missedMitigationAbility({
    id: 'Mantra',
    abilityId: '41'
  }), missedDamageAbility({
    id: 'Devotion',
    abilityId: '1D1A'
  }), // Maybe using a healer LB1/LB2 should be an error for the healer. O:)
  // missedHeal({ id: 'Healing Wind', abilityId: 'CE' }),
  // missedHeal({ id: 'Breath of the Earth', abilityId: 'CF' }),
  missedHeal({
    id: 'Medica',
    abilityId: '7C'
  }), missedHeal({
    id: 'Medica II',
    abilityId: '85'
  }), missedHeal({
    id: 'Afflatus Rapture',
    abilityId: '4096'
  }), missedHeal({
    id: 'Temperance',
    abilityId: '751'
  }), missedHeal({
    id: 'Plenary Indulgence',
    abilityId: '1D09'
  }), missedHeal({
    id: 'Pulse of Life',
    abilityId: 'D0'
  }), missedHeal({
    id: 'Succor',
    abilityId: 'BA'
  }), missedHeal({
    id: 'Indomitability',
    abilityId: 'DFF'
  }), missedHeal({
    id: 'Deployment Tactics',
    abilityId: 'E01'
  }), missedHeal({
    id: 'Whispering Dawn',
    abilityId: '323'
  }), missedHeal({
    id: 'Fey Blessing',
    abilityId: '40A0'
  }), missedHeal({
    id: 'Consolation',
    abilityId: '40A3'
  }), missedHeal({
    id: 'Angel\'s Whisper',
    abilityId: '40A6'
  }), missedMitigationAbility({
    id: 'Fey Illumination',
    abilityId: '325'
  }), missedMitigationAbility({
    id: 'Seraphic Illumination',
    abilityId: '40A7'
  }), missedHeal({
    id: 'Angel Feathers',
    abilityId: '1097'
  }), missedHeal({
    id: 'Helios',
    abilityId: 'E10'
  }), missedHeal({
    id: 'Aspected Helios',
    abilityId: 'E11'
  }), missedHeal({
    id: 'Aspected Helios',
    abilityId: '3200'
  }), missedHeal({
    id: 'Celestial Opposition',
    abilityId: '40A9'
  }), missedHeal({
    id: 'Astral Stasis',
    abilityId: '1098'
  }), missedHeal({
    id: 'White Wind',
    abilityId: '2C8E'
  }), missedHeal({
    id: 'Gobskin',
    abilityId: '4780'
  }), // TODO: export all of these missed functions into their own helper
  // and then add this to the Delubrum Reginae files directly.
  missedMitigationAbility({
    id: 'Lost Aethershield',
    abilityId: '5753'
  })]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/00-misc/general.js

 // General mistakes; these apply everywhere.

/* harmony default export */ const general = ({
  zoneId: zone_id/* default.MatchAll */.Z.MatchAll,
  triggers: [{
    // Trigger id for internally generated early pull warning.
    id: 'General Early Pull'
  }, {
    id: 'General Food Buff',
    // Well Fed
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '48'
    }),
    condition: (_e, _data, matches) => {
      // Prevent "Eos loses the effect of Well Fed from Critlo Mcgee"
      return matches.target === matches.source;
    },
    mistake: (_e, data, matches) => {
      data.lostFood = data.lostFood || {}; // Well Fed buff happens repeatedly when it falls off (WHY),
      // so suppress multiple occurrences.

      if (!data.inCombat || data.lostFood[matches.target]) return;
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
          ko: '음식 버프 해제'
        }
      };
    }
  }, {
    id: 'General Well Fed',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '48'
    }),
    run: (_e, data, matches) => {
      if (!data.lostFood) return;
      delete data.lostFood[matches.target];
    }
  }, {
    id: 'General Rabbit Medium',
    abilityRegex: '8E0',
    condition: (e, data) => data.IsPlayerId(e.attackerId),
    mistake: e => {
      return {
        type: 'warn',
        blame: e.attackerName,
        text: {
          en: 'bunny',
          de: 'Hase',
          fr: 'lapin',
          ja: 'うさぎ',
          cn: '兔子',
          ko: '토끼'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/00-misc/test.js

 // Test mistake triggers.

/* harmony default export */ const test = ({
  zoneId: zone_id/* default.MiddleLaNoscea */.Z.MiddleLaNoscea,
  triggers: [{
    id: 'Test Bow',
    netRegex: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: 'You bow courteously to the striking dummy.*?'
    }),
    netRegexFr: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: 'Vous vous inclinez devant le mannequin d\'entraînement.*?'
    }),
    netRegexJa: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: '.*は木人にお辞儀した.*?'
    }),
    netRegexCn: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: '.*恭敬地对木人行礼.*?'
    }),
    netRegexKo: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: '.*나무인형에게 공손하게 인사합니다.*?'
    }),
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
          ko: '인사'
        }
      };
    }
  }, {
    id: 'Test Wipe',
    netRegex: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: 'You bid farewell to the striking dummy.*?'
    }),
    netRegexFr: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: 'Vous faites vos adieux au mannequin d\'entraînement.*?'
    }),
    netRegexJa: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: '.*は木人に別れの挨拶をした.*?'
    }),
    netRegexCn: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: '.*向木人告别.*?'
    }),
    netRegexKo: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: '.*나무인형에게 작별 인사를 합니다.*?'
    }),
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
          ko: '파티 전멸'
        }
      };
    }
  }, {
    id: 'Test Bootshine',
    damageRegex: '35',
    condition: (e, data) => {
      if (e.attackerName !== data.me) return false;
      const strikingDummyNames = ['Striking Dummy', 'Mannequin d\'entraînement', '木人', // Striking Dummy called `木人` in CN as well as JA
      '나무인형' // FIXME: add other languages here
      ];
      return strikingDummyNames.includes(e.targetName);
    },
    mistake: (e, data) => {
      data.bootCount = data.bootCount || 0;
      data.bootCount++;
      const text = e.abilityName + ' (' + data.bootCount + '): ' + e.damageStr;
      return {
        type: 'warn',
        blame: data.me,
        text: text
      };
    }
  }, {
    id: 'Test Leaden Fist',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '745'
    }),
    condition: (_e, data, matches) => matches.source === data.me,
    mistake: (_e, data, matches) => {
      return {
        type: 'good',
        blame: data.me,
        text: matches.effect
      };
    }
  }, {
    id: 'Test Oops',
    netRegex: netregexes/* default.echo */.Z.echo({
      line: '.*oops.*'
    }),
    suppressSeconds: 10,
    mistake: (_e, data, matches) => {
      return {
        type: 'fail',
        blame: data.me,
        text: matches.line
      };
    }
  }, {
    id: 'Test Poke',
    netRegex: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: 'You poke the striking dummy.*?'
    }),
    netRegexFr: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: 'Vous touchez légèrement le mannequin d\'entraînement du doigt.*?'
    }),
    netRegexJa: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: '.*は木人をつついた.*?'
    }),
    netRegexCn: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: '.*用手指戳向木人.*?'
    }),
    netRegexKo: netregexes/* default.gameNameLog */.Z.gameNameLog({
      line: '.*나무인형을 쿡쿡 찌릅니다.*?'
    }),
    collectSeconds: 5,
    mistake: (events, data) => {
      // When collectSeconds is specified, events are passed as an array.
      const pokes = events.length; // 1 poke at a time is fine, but more than one inside of
      // collectSeconds is (OBVIOUSLY) a mistake.

      if (pokes <= 1) return;
      const text = {
        en: 'Too many pokes (' + pokes + ')',
        de: 'Zu viele Piekser (' + pokes + ')',
        fr: 'Trop de touches (' + pokes + ')',
        ja: 'いっぱいつついた (' + pokes + ')',
        cn: '戳太多下啦 (' + pokes + ')',
        ko: '너무 많이 찌름 (' + pokes + '번)'
      };
      return {
        type: 'fail',
        blame: data.me,
        text: text
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/ifrit-nm.js
 // Ifrit Story Mode

/* harmony default export */ const ifrit_nm = ({
  zoneId: zone_id/* default.TheBowlOfEmbers */.Z.TheBowlOfEmbers,
  damageWarn: {
    'IfritNm Radiant Plume': '2DE'
  },
  triggers: [// Things that should only hit one person.
  {
    id: 'IfritNm Incinerate',
    damageRegex: '1C5',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'IfritNm Eruption',
    damageRegex: '2DD',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/titan-nm.js
 // Titan Story Mode

/* harmony default export */ const titan_nm = ({
  zoneId: zone_id/* default.TheNavel */.Z.TheNavel,
  damageWarn: {
    'TitanNm Weight Of The Land': '3CD'
  },
  damageFail: {
    'TitanNm Landslide': '28A'
  },
  shareWarn: {
    'TitanNm Rock Buster': '281'
  }
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
    'LeviEx Grand Fall': '82F',
    // very large circular aoe before spinny dives, applies heavy
    'LeviEx Hydro Shot': '748',
    // Wavespine Sahagin aoe that gives Dropsy effect
    'LeviEx Dreadstorm': '749' // Wavetooth Sahagin aoe that gives Hysteria effect

  },
  damageFail: {
    'LeviEx Body Slam': '82A',
    // levi slam that tilts the boat
    'LeviEx Spinning Dive 1': '88A',
    // levi dash across the boat with knockback
    'LeviEx Spinning Dive 2': '88B',
    // levi dash across the boat with knockback
    'LeviEx Spinning Dive 3': '82C' // levi dash across the boat with knockback

  },
  gainsEffectWarn: {
    'LeviEx Dropsy': '110' // standing in the hydro shot from the Wavespine Sahagin

  },
  gainsEffectFail: {
    'LeviEx Hysteria': '128' // standing in the dreadstorm from the Wavetooth Sahagin

  },
  triggers: [{
    id: 'LeviEx Body Slam Knocked Off',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '82A'
    }),
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
          ko: '넉백'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/shiva-hm.js

 // Shiva Hard

/* harmony default export */ const shiva_hm = ({
  zoneId: zone_id/* default.TheAkhAfahAmphitheatreHard */.Z.TheAkhAfahAmphitheatreHard,
  damageWarn: {
    // Large white circles.
    'ShivaHm Icicle Impact': '993',
    // Avoidable tank stun.
    'ShivaHm Glacier Bash': '9A1'
  },
  shareWarn: {
    // Knockback tank cleave.
    'ShivaHm Heavenly Strike': '9A0',
    // Hailstorm spread marker.
    'ShivaHm Hailstorm': '998'
  },
  shareFail: {
    // Tankbuster.  This is Shiva Hard mode, not Shiva Extreme.  Please!
    'ShivaHm Icebrand': '996'
  },
  triggers: [{
    id: 'ShivaHm Diamond Dust',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '98A'
    }),
    run: data => {
      data.seenDiamondDust = true;
    }
  }, {
    id: 'ShivaHm Deep Freeze',
    // Shiva also uses ability 9A3 on you, but it has the untranslated name
    // 透明：シヴァ：凍結レクト：ノックバック用. So, use the effect instead for free translation.
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '1E7'
    }),
    condition: (_e, data) => {
      // The intermission also gets this effect, so only a mistake after that.
      // Unlike extreme, this has the same 20 second duration as the intermission.
      return data.seenDiamondDust;
    },
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.effect
      };
    }
  }]
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
    'ShivaEx Glacier Bash': 'BE9'
  },
  damageFail: {
    // 270 degree attack.
    'ShivaEx Glass Dance': 'BDF'
  },
  shareWarn: {
    // Hailstorm spread marker.
    'ShivaEx Hailstorm': 'BE2'
  },
  shareFail: {
    // Laser.  TODO: maybe blame the person it's on??
    'ShivaEx Avalanche': 'BE0'
  },
  triggers: [{
    // Party shared tank buster.
    id: 'ShivaEx Icebrand',
    damageRegex: 'BE1',
    condition: e => {
      // Should be shared with friends.
      return e.type === '15';
    },
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'ShivaEx Deep Freeze',
    // Shiva also uses ability C8A on you, but it has the untranslated name
    // 透明：シヴァ：凍結レクト：ノックバック用/ヒロイック. So, use the effect instead for free translation.
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '1E7'
    }),
    condition: (_e, _data, matches) => {
      // The intermission also gets this effect, but for a shorter duration.
      return parseFloat(matches.duration) > 20;
    },
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.effect
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/titan-hm.js
 // Titan Hard

/* harmony default export */ const titan_hm = ({
  zoneId: zone_id/* default.TheNavelHard */.Z.TheNavelHard,
  damageWarn: {
    'TitanHm Weight Of The Land': '553',
    'TitanHm Burst': '41C'
  },
  damageFail: {
    'TitanHm Landslide': '554'
  },
  shareWarn: {
    'TitanHm Rock Buster': '550'
  },
  shareFail: {
    'TitanHm Mountain Buster': '283'
  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/titan-ex.js
 // Titan Extreme

/* harmony default export */ const titan_ex = ({
  zoneId: zone_id/* default.TheNavelExtreme */.Z.TheNavelExtreme,
  damageWarn: {
    'TitanEx Weight Of The Land': '5BE',
    'TitanEx Burst': '5BF'
  },
  damageFail: {
    'TitanEx Landslide': '5BB',
    'TitanEx Gaoler Landslide': '5C3'
  },
  shareWarn: {
    'TitanEx Rock Buster': '5B7'
  },
  shareFail: {
    'TitanEx Mountain Buster': '5B8'
  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/alliance/weeping_city.js


/* harmony default export */ const weeping_city = ({
  zoneId: zone_id/* default.TheWeepingCityOfMhach */.Z.TheWeepingCityOfMhach,
  damageWarn: {
    'Weeping Critical Bite': '1848',
    // Sarsuchus cone aoe
    'Weeping Realm Shaker': '183E',
    // First Daughter circle aoe
    'Weeping Silkscreen': '183C',
    // First Daughter line aoe
    'Weeping Silken Spray': '1824',
    // Arachne Eve rear conal aoe
    'Weeping Tremblor 1': '1837',
    // Arachne Eve disappear circle aoe 1
    'Weeping Tremblor 2': '1836',
    // Arachne Eve disappear circle aoe 2
    'Weeping Tremblor 3': '1835',
    // Arachne Eve disappear circle aoe 3
    'Weeping Spider Thread': '1839',
    // Arachne Eve spider line aoe
    'Weeping Fire II': '184E',
    // Black Mage Corpse circle aoe
    'Weeping Necropurge': '17D7',
    // Forgall Shriveled Talon line aoe
    'Weeping Rotten Breath': '17D0',
    // Forgall Dahak cone aoe
    'Weeping Mow': '17D2',
    // Forgall Haagenti unmarked cleave
    'Weeping Dark Eruption': '17C3',
    // Forgall puddle marker
    // 1806 is also Flare Star, but if you get by 1805 you also get hit by 1806?
    'Weeping Flare Star': '1805',
    // Ozma cube phase donut
    'Weeping Execration': '1829',
    // Ozma triangle laser
    'Weeping Haircut 1': '180B',
    // Calofisteri 180 cleave 1
    'Weeping Haircut 2': '180F',
    // Calofisteri 180 cleave 2
    'Weeping Entanglement': '181D',
    // Calofisteri landmine puddle proc
    'Weeping Evil Curl': '1816',
    // Calofisteri axe
    'Weeping Evil Tress': '1817',
    // Calofisteri bulb
    'Weeping Depth Charge': '1820',
    // Calofisteri charge to edge
    'Weeping Feint Particle Beam': '1928',
    // Calofisteri sky laser
    'Weeping Evil Switch': '1815' // Calofisteri lasers

  },
  shareWarn: {
    'Weeping Arachne Web': '185E',
    // Arachne Eve headmarker web aoe
    'Weeping Earth Aether': '1841',
    // Arachne Eve orbs
    'Weeping Epigraph': '1852',
    // Headstone untelegraphed laser line tank attack
    // This is too noisy.  Better to pop the balloons than worry about friends.
    // 'Weeping Explosion': '1807', // Ozmasphere Cube orb explosion
    'Weeping Split End 1': '180C',
    // Calofisteri tank cleave 1
    'Weeping Split End 2': '1810',
    // Calofisteri tank cleave 2
    'Weeping Bloodied Nail': '181F' // Calofisteri axe/bulb appearing

  },
  gainsEffectWarn: {
    'Weeping Hysteria': '128',
    // Arachne Eve Frond Affeard
    'Weeping Zombification': '173',
    // Forgall too many zombie puddles
    'Weeping Toad': '1B7',
    // Forgall Brand of the Fallen failure
    'Weeping Doom': '38E',
    // Forgall Haagenti Mortal Ray
    'Weeping Assimilation': '42C',
    // Ozmashade Assimilation look-away
    'Weeping Stun': '95' // Calofisteri Penetration look-away

  },
  triggers: [{
    id: 'Weeping Forgall Gradual Zombification Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '415'
    }),
    run: (_e, data, matches) => {
      data.zombie = data.zombie || {};
      data.zombie[matches.target] = true;
    }
  }, {
    id: 'Weeping Forgall Gradual Zombification Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '415'
    }),
    run: (_e, data, matches) => {
      data.zombie = data.zombie || {};
      data.zombie[matches.target] = false;
    }
  }, {
    id: 'Weeping Forgall Mega Death',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '17CA'
    }),
    condition: (_e, data, matches) => data.zombie && !data.zombie[matches.target],
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    id: 'Weeping Headstone Shield Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '15E'
    }),
    run: (_e, data, matches) => {
      data.shield = data.shield || {};
      data.shield[matches.target] = true;
    }
  }, {
    id: 'Weeping Headstone Shield Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '15E'
    }),
    run: (_e, data, matches) => {
      data.shield = data.shield || {};
      data.shield[matches.target] = false;
    }
  }, {
    id: 'Weeping Flaring Epigraph',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '1856'
    }),
    condition: (_e, data, matches) => data.shield && !data.shield[matches.target],
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    // This ability name is helpfully called "Attack" so name it something else.
    id: 'Weeping Ozma Tank Laser',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '1831'
    }),
    condition: e => e.type !== '15',
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
          ko: '탱커 레이저'
        }
      };
    }
  }, {
    id: 'Weeping Ozma Holy',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '182E'
    }),
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
          ko: '넉백됨!'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/dungeon/aetherochemical_research_facility.js

 // Aetherochemical Research Facility

/* harmony default export */ const aetherochemical_research_facility = ({
  zoneId: zone_id/* default.TheAetherochemicalResearchFacility */.Z.TheAetherochemicalResearchFacility,
  damageWarn: {
    'ARF Grand Sword': '216',
    // Conal AoE, Scrambled Iron Giant trash
    'ARF Cermet Drill': '20E',
    // Line AoE, 6th Legion Magitek Vanguard trash
    'ARF Magitek Slug': '10DB',
    // Line AoE, boss 1
    'ARF Aetherochemical Grenado': '10E2',
    // Large targeted circle AoE, Magitek Turret II, boss 1
    'ARF Magitek Spread': '10DC',
    // 270-degree roomwide AoE, boss 1
    'ARF Eerie Soundwave': '1170',
    // Targeted circle AoE, Cultured Empusa trash, before boss 2
    'ARF Tail Slap': '125F',
    // Conal AoE, Cultured Dancer trash, before boss 2
    'ARF Calcifying Mist': '123A',
    // Conal AoE, Cultured Naga trash, before boss 2
    'ARF Puncture': '1171',
    // Short line AoE, Cultured Empusa trash, before boss 2
    'ARF Sideswipe': '11A7',
    // Conal AoE, Cultured Reptoid trash, before boss 2
    'ARF Gust': '395',
    // Targeted small circle AoE, Cultured Mirrorknight trash, before boss 2
    'ARF Marrow Drain': 'D0E',
    // Conal AoE, Cultured Chimera trash, before boss 2
    'ARF Riddle Of The Sphinx': '10E4',
    // Targeted circle AoE, boss 2
    'ARF Ka': '106E',
    // Conal AoE, boss 2
    'ARF Rotoswipe': '11CC',
    // Conal AoE, Facility Dreadnought trash, before boss 3
    'ARF Auto-cannons': '12D9',
    // Line AoE, Monitoring Drone trash, before boss 3
    'ARF Death\'s Door': '4EC',
    // Line AoE, Cultured Shabti trash, before boss 3
    'ARF Spellsword': '4EB',
    // Conal AoE, Cultured Shabti trash, before boss 3
    'ARF End Of Days': '10FD',
    // Line AoE, boss 3
    'ARF Blizzard Burst': '10FE',
    // Fixed circle AoEs, Igeyorhm, boss 3
    'ARF Fire Burst': '10FF',
    // Fixed circle AoEs, Lahabrea, boss 3
    'ARF Sea Of Pitch': '12DE',
    // Targeted persistent circle AoEs, boss 3
    'ARF Dark Blizzard II': '10F3',
    // Random circle AoEs, Igeyorhm, boss 3
    'ARF Dark Fire II': '10F8',
    // Random circle AoEs, Lahabrea, boss 3
    'ARF Ancient Eruption': '1104',
    // Self-targeted circle AoE, boss 4
    'ARF Entropic Flame': '1108' // Line AoEs,  boss 4

  },
  shareWarn: {
    'ARF Chthonic Hush': '10E7',
    // Instant tank cleave, boss 2
    'ARF Height Of Chaos': '1101',
    // Tank cleave, boss 4
    'ARF Ancient Circle': '1102' // Targeted donut AoEs, boss 4

  },
  triggers: [{
    id: 'ARF Petrifaction',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '01'
    }),
    mistake: e => {
      return {
        type: 'warn',
        blame: e.target,
        text: e.effect
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/dungeon/fractal_continuum.js
 // Fractal Continuum

/* harmony default export */ const fractal_continuum = ({
  zoneId: zone_id/* default.TheFractalContinuum */.Z.TheFractalContinuum,
  damageWarn: {
    'Fractal Double Sever': 'F7D',
    // Conals, boss 1
    'Fractal Aetheric Compression': 'F80',
    // Ground AoE circles, boss 1
    'Fractal 11-Tonze Swipe': 'F81',
    // Frontal cone, boss 2
    'Fractal 10-Tonze Slash': 'F83',
    // Frontal line, boss 2
    'Fractal 111-Tonze Swing': 'F87',
    // Get-out AoE, boss 2
    'Fractal Broken Glass': 'F8E',
    // Glowing panels, boss 3
    'Fractal Mines': 'F90',
    'Fractal Seed of the Rivers': 'F91' // Ground AoE circles, boss 3

  },
  shareWarn: {
    'Fractal Sanctification': 'F89' // Instant conal buster, boss 3

  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/dungeon/gubal_library_hard.js


/* harmony default export */ const gubal_library_hard = ({
  zoneId: zone_id/* default.TheGreatGubalLibraryHard */.Z.TheGreatGubalLibraryHard,
  damageWarn: {
    'GubalHm Terror Eye': '930',
    // Circle AoE, Spine Breaker trash
    'GubalHm Batter': '198A',
    // Circle AoE, trash before boss 1
    'GubalHm Condemnation': '390',
    // Conal AoE, Bibliovore trash
    'GubalHm Discontinue 1': '1943',
    // Falling book shadow, boss 1
    'GubalHm Discontinue 2': '1940',
    // Rush AoE from ends, boss 1
    'GubalHm Discontinue 3': '1942',
    // Rush AoE across, boss 1
    'GubalHm Frightful Roar': '193B',
    // Get-Out AoE, boss 1
    'GubalHm Issue 1': '193D',
    // Initial end book warning AoE, boss 1
    'GubalHm Issue 2': '193F',
    // Initial end book warning AoE, boss 1
    'GubalHm Issue 3': '1941',
    // Initial side book warning AoE, boss 1
    'GubalHm Desolation': '198C',
    // Line AoE, Biblioclast trash
    'GubalHm Double Smash': '26A',
    // Conal AoE, Biblioclast trash
    'GubalHm Darkness': '3A0',
    // Conal AoE, Inkstain trash
    'GubalHm Firewater': '3BA',
    // Circle AoE, Biblioclast trash
    'GubalHm Elbow Drop': 'CBA',
    // Conal AoE, Biblioclast trash
    'GubalHm Dark': '19DF',
    // Large circle AoE, Inkstain trash
    'GubalHm Seals': '194A',
    // Sun/Moonseal failure, boss 2
    'GubalHm Water III': '1C67',
    // Large circle AoE, Porogo Pegist trash
    'GubalHm Raging Axe': '1703',
    // Small conal AoE, Mechanoservitor trash
    'GubalHm Magic Hammer': '1990',
    // Large circle AoE, Apanda mini-boss
    'GubalHm Properties Of Gravity': '1950',
    // Circle AoE from gravity puddles, boss 3
    'GubalHm Properties Of Levitation': '194F',
    // Circle AoE from levitation puddles, boss 3
    'GubalHm Comet': '1969' // Small circle AoE, intermission, boss 3

  },
  damageFail: {
    'GubalHm Ecliptic Meteor': '195C' // LoS mechanic, boss 3

  },
  shareWarn: {
    'GubalHm Searing Wind': '1944',
    // Tank cleave, boss 2
    'GubalHm Thunder': '19[AB]' // Spread marker, boss 3

  },
  triggers: [{
    // Fire gate in hallway to boss 2, magnet failure on boss 2
    id: 'GubalHm Burns',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '10B'
    }),
    mistake: e => {
      return {
        type: 'warn',
        blame: e.target,
        text: e.effect
      };
    }
  }, {
    // Helper for Thunder 3 failures
    id: 'GubalHm Imp Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '46E'
    }),
    run: (_e, data, matches) => {
      data.hasImp = data.hasImp || {};
      data.hasImp[matches.target] = true;
    }
  }, {
    id: 'GubalHm Imp Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '46E'
    }),
    run: (_e, data, matches) => {
      data.hasImp = data.hasImp || {};
      data.hasImp[matches.target] = false;
    }
  }, {
    // Targets with Imp when Thunder III resolves receive a vulnerability stack and brief stun
    id: 'GubalHm Imp Thunder',
    damageRegex: '195[AB]',
    condition: (e, data) => data.hasImp[e.targetName],
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: {
          en: 'Shocked Imp',
          de: 'Schockierter Imp',
          ja: 'カッパを解除しなかった',
          cn: '河童状态吃了暴雷'
        }
      };
    }
  }, {
    id: 'GubalHm Quake',
    damageRegex: '1956',
    condition: e => {
      // Always hits target, but if correctly resolved will deal 0 damage
      return e.damage > 0;
    },
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'GubalHm Tornado',
    damageRegex: '195[78]',
    condition: e => {
      // Always hits target, but if correctly resolved will deal 0 damage
      return e.damage > 0;
    },
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/dungeon/sohm_al_hard.js


/* harmony default export */ const sohm_al_hard = ({
  zoneId: zone_id/* default.SohmAlHard */.Z.SohmAlHard,
  damageWarn: {
    'SohmAlHm Deadly Vapor': '1DC9',
    // Environmental circle AoEs
    'SohmAlHm Deeproot': '1CDA',
    // Targeted circle AoE, Blooming Chichu trash
    'SohmAlHm Odious Air': '1CDB',
    // Conal AoE, Blooming Chichu trash
    'SohmAlHm Glorious Blaze': '1C33',
    // Circle AoE, Small Spore Sac, boss 1
    'SohmAlHm Foul Waters': '118A',
    // Conal AoE, Mountaintop Opken trash
    'SohmAlHm Plain Pound': '1187',
    // Targeted circle AoE, Mountaintop Hropken trash
    'SohmAlHm Palsynyxis': '1161',
    // Conal AoE, Overgrown Difflugia trash
    'SohmAlHm Surface Breach': '1E80',
    // Circle AoE, Giant Netherworm trash
    'SohmAlHm Freshwater Cannon': '119F',
    // Line AoE, Giant Netherworm trash
    'SohmAlHm Tail Smash': '1C35',
    // Untelegraphed rear conal AoE, Gowrow, boss 2
    'SohmAlHm Tail Swing': '1C36',
    // Untelegraphed circle AoE, Gowrow, boss 2
    'SohmAlHm Ripper Claw': '1C37',
    // Untelegraphed frontal AoE, Gowrow, boss 2
    'SohmAlHm Wind Slash': '1C38',
    // Circle AoE, Gowrow, boss 2
    'SohmAlHm Wild Charge': '1C39',
    // Dash attack, Gowrow, boss 2
    'SohmAlHm Hot Charge': '1C3A',
    // Dash attack, Gowrow, boss 2
    'SohmAlHm Fireball': '1C3B',
    // Untelegraphed targeted circle AoE, Gowrow, boss 2
    'SohmAlHm Lava Flow': '1C3C',
    // Untelegraphed conal AoE, Gowrow, boss 2
    'SohmAlHm Wild Horn': '1507',
    // Conal AoE, Abalathian Clay Golem trash
    'SohmAlHm Lava Breath': '1C4D',
    // Conal AoE, Lava Crab trash
    'SohmAlHm Ring of Fire': '1C4C',
    // Targeted circle AoE, Volcano Anala trash
    'SohmAlHm Molten Silk 1': '1C43',
    // 270-degree frontal AoE, Lava Scorpion, boss 3
    'SohmAlHm Molten Silk 2': '1C44',
    // 270-degree rear AoE, Lava Scorpion, boss 3
    'SohmAlHm Molten Silk 3': '1C42',
    // Ring AoE, Lava Scorpion, boss 3
    'SohmAlHm Realm Shaker': '1C41' // Circle AoE, Lava Scorpion, boss 3

  },
  triggers: [{
    // Warns if players step into the lava puddles. There is unfortunately no direct damage event.
    id: 'SohmAlHm Burns',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '11C'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/03-hw/raid/a12n.js


/* harmony default export */ const a12n = ({
  zoneId: zone_id/* default.AlexanderTheSoulOfTheCreator */.Z.AlexanderTheSoulOfTheCreator,
  damageWarn: {
    'A12N Sacrament': '1AE6',
    // Cross Lasers
    'A12N Gravitational Anomaly': '1AEB' // Gravity Puddles

  },
  shareWarn: {
    'A12N Divine Spear': '1AE3',
    // Instant conal tank cleave
    'A12N Blazing Scourge': '1AE9',
    // Orange head marker splash damage
    'A12N Plaint Of Severity': '1AF1',
    // Aggravated Assault splash damage
    'A12N Communion': '1AFC' // Tether Puddles

  },
  triggers: [{
    id: 'A12N Assault Collect',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '461'
    }),
    run: (_e, data, matches) => {
      data.assault = data.assault || [];
      data.assault.push(matches.target);
    }
  }, {
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
          cn: '没有散开!'
        }
      };
    }
  }, {
    id: 'A12N Assault Cleanup',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '461'
    }),
    delaySeconds: 20,
    suppressSeconds: 5,
    run: (_e, data) => {
      delete data.assault;
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/ala_mhigo.js


/* harmony default export */ const ala_mhigo = ({
  zoneId: zone_id/* default.AlaMhigo */.Z.AlaMhigo,
  damageWarn: {
    'Ala Mhigo Magitek Ray': '24CE',
    // Line AoE, Legion Predator trash, before boss 1
    'Ala Mhigo Lock On': '2047',
    // Homing circles, boss 1
    'Ala Mhigo Tail Laser 1': '2049',
    // Frontal line AoE, boss 1
    'Ala Mhigo Tail Laser 2': '204B',
    // Rear line AoE, boss 1
    'Ala Mhigo Tail Laser 3': '204C',
    // Rear line AoE, boss 1
    'Ala Mhigo Shoulder Cannon': '24D0',
    // Circle AoE, Legion Avenger trash, before boss 2
    'Ala Mhigo Cannonfire': '23ED',
    // Environmental circle AoE, path to boss 2
    'Ala Mhigo Aetherochemical Grenado': '205A',
    // Circle AoE, boss 2
    'Ala Mhigo Integrated Aetheromodulator': '205B',
    // Ring AoE, boss 2
    'Ala Mhigo Circle Of Death': '24D4',
    // Proximity circle AoE, Hexadrone trash, before boss 3
    'Ala Mhigo Exhaust': '24D3',
    // Line AoE, Legion Colossus trash, before boss 3
    'Ala Mhigo Grand Sword': '24D2',
    // Conal AoE, Legion Colossus trash, before boss 3
    'Ala Mhigo Art Of The Storm 1': '2066',
    // Proximity circle AoE, pre-intermission, boss 3
    'Ala Mhigo Art Of The Storm 2': '2587',
    // Proximity circle AoE, intermission, boss 3
    'Ala Mhigo Vein Splitter 1': '24B6',
    // Proximity circle AoE, primary entity, boss 3
    'Ala Mhigo Vein Splitter 2': '206C',
    // Proximity circle AoE, helper entity, boss 3
    'Ala Mhigo Lightless Spark': '206B' // Conal AoE, boss 3

  },
  shareWarn: {
    'Ala Mhigo Demimagicks': '205E',
    'Ala Mhigo Unmoving Troika': '2060',
    'Ala Mhigo Art Of The Sword 1': '2069',
    'Ala Mhigo Art Of The Sword 2': '2589'
  },
  triggers: [{
    // It's possible players might just wander into the bad on the outside,
    // but normally people get pushed into it.
    id: 'Ala Mhigo Art Of The Swell',
    // Damage Down
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '2B8'
    }),
    mistake: e => {
      return {
        type: 'warn',
        blame: e.target,
        text: e.effect
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/bardams_mettle.js

 // Bardam's Mettle
// For reasons not completely understood at the time this was merged,
// but likely related to the fact that no nameplates are visible during the encounter,
// and that nothing in the encounter actually does damage,
// we can't use damageWarn or gainsEffect helpers on the Bardam fight.
// Instead, we use this helper function to look for failure flags.
// If the flag is present,a full trigger object is returned that drops in seamlessly.

const abilityWarn = args => {
  if (!args.abilityId) console.error('Missing ability ' + JSON.stringify(args));
  return {
    id: args.id,
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: args.abilityId
    }),
    condition: (_e, _data, matches) => matches.flags.substr(-2) === '0E',
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  };
};

/* harmony default export */ const bardams_mettle = ({
  zoneId: zone_id/* default.BardamsMettle */.Z.BardamsMettle,
  damageWarn: {
    'Bardam Dirty Claw': '21A8',
    // Frontal cleave, Gulo Gulo trash
    'Bardam Epigraph': '23AF',
    // Line AoE, Wall of Bardam trash
    'Bardam The Dusk Star': '2187',
    // Circle AoE, environment before first boss
    'Bardam The Dawn Star': '2186',
    // Circle AoE, environment before first boss
    'Bardam Crumbling Crust': '1F13',
    // Circle AoEs, Garula, first boss
    'Bardam Ram Rush': '1EFC',
    // Line AoEs, Steppe Yamaa, first boss.
    'Bardam Lullaby': '24B2',
    // Circle AoEs, Steppe Sheep, first boss.
    'Bardam Heave': '1EF7',
    // Frontal cleave, Garula, first boss
    'Bardam Wide Blaster': '24B3',
    // Enormous frontal cleave, Steppe Coeurl, first boss
    'Bardam Double Smash': '26A',
    // Circle AoE, Mettling Dhara trash
    'Bardam Transonic Blast': '1262',
    // Circle AoE, Steppe Eagle trash
    'Bardam Wild Horn': '2208',
    // Frontal cleave, Khun Gurvel trash
    'Bardam Heavy Strike 1': '2578',
    // 1 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Heavy Strike 2': '2579',
    // 2 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Heavy Strike 3': '257A',
    // 3 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Tremblor 1': '257B',
    // 1 of 2 concentric ring AoEs, Bardam, second boss
    'Bardam Tremblor 2': '257C',
    // 2 of 2 concentric ring AoEs, Bardam, second boss
    'Bardam Throwing Spear': '257F',
    // Checkerboard AoE, Throwing Spear, second boss
    'Bardam Bardam\'s Ring': '2581',
    // Donut AoE headmarkers, Bardam, second boss
    'Bardam Comet': '257D',
    // Targeted circle AoEs, Bardam, second boss
    'Bardam Comet Impact': '2580',
    // Circle AoEs, Star Shard, second boss
    'Bardam Iron Sphere Attack': '16B6',
    // Contact damage, Iron Sphere trash, before third boss
    'Bardam Tornado': '247E',
    // Circle AoE, Khun Shavara trash
    'Bardam Pinion': '1F11',
    // Line AoE, Yol Feather, third boss
    'Bardam Feather Squall': '1F0E',
    // Dash attack, Yol, third boss
    'Bardam Flutterfall Untargeted': '1F12' // Rotating circle AoEs, Yol, third boss

  },
  shareWarn: {
    'Bardam Garula Rush': '1EF9',
    // Line AoE, Garula, first boss.
    'Bardam Flutterfall Targeted': '1F0C',
    // Circle AoE headmarker, Yol, third boss
    'Bardam Wingbeat': '1F0F' // Conal AoE headmarker, Yol, third boss

  },
  gainsEffectWarn: {
    'Bardam Confused': '0B' // Failed gaze attack, Yol, third boss

  },
  gainsEffectFail: {
    'Bardam Fetters': '56F' // Failing two mechanics in any one phase on Bardam, second boss.

  },
  triggers: [// 1 of 3 270-degree ring AoEs, Bardam, second boss
  abilityWarn({
    id: 'Bardam Heavy Strike 1',
    abilityId: '2578'
  }), // 2 of 3 270-degree ring AoEs, Bardam, second boss
  abilityWarn({
    id: 'Bardam Heavy Strike 2',
    abilityId: '2579'
  }), // 3 of 3 270-degree ring AoEs, Bardam, second boss
  abilityWarn({
    id: 'Bardam Heavy Strike 3',
    abilityId: '257A'
  }), // 1 of 2 concentric ring AoEs, Bardam, second boss
  abilityWarn({
    id: 'Bardam Tremblor 1',
    abilityId: '257B'
  }), // 2 of 2 concentric ring AoEs, Bardam, second boss
  abilityWarn({
    id: 'Bardam Tremblor 2',
    abilityId: '257C'
  }), // Checkerboard AoE, Throwing Spear, second boss
  abilityWarn({
    id: 'Bardam Throwing Spear',
    abilityId: '257F'
  }), // Gaze attack, Warrior of Bardam, second boss
  abilityWarn({
    id: 'Bardam Empty Gaze',
    abilityId: '1F04'
  }), // Donut AoE headmarkers, Bardam, second boss
  abilityWarn({
    id: 'Bardam\'s Ring',
    abilityId: '2581'
  }), // Targeted circle AoEs, Bardam, second boss
  abilityWarn({
    id: 'Bardam Comet',
    abilityId: '257D'
  }), // Circle AoEs, Star Shard, second boss
  abilityWarn({
    id: 'Bardam Comet Impact',
    abilityId: '2580'
  })]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/kugane_castle.js


/* harmony default export */ const kugane_castle = ({
  zoneId: zone_id/* default.KuganeCastle */.Z.KuganeCastle,
  damageWarn: {
    'Kugane Castle Tenka Gokken': '2329',
    // Frontal cone AoE,  Joi Blade trash, before boss 1
    'Kugane Castle Kenki Release Trash': '2330',
    // Chariot AoE, Joi Kiyofusa trash, before boss 1
    'Kugane Castle Clearout': '1E92',
    // Frontal cone AoE, Zuiko-Maru, boss 1
    'Kugane Castle Hara-Kiri 1': '1E96',
    // Giant circle AoE, Harakiri Kosho, boss 1
    'Kugane Castle Hara-Kiri 2': '24F9',
    // Giant circle AoE, Harakiri Kosho, boss 1
    'Kugane Castle Juji Shuriken 1': '232D',
    // Line AoE, Karakuri Onmitsu trash, before boss 2
    'Kugane Castle 1000 Barbs': '2198',
    // Line AoE, Joi Koja trash, before boss 2
    'Kugane Castle Juji Shuriken 2': '1E98',
    // Line AoE, Dojun Maru, boss 2
    'Kugane Castle Tatami-Gaeshi': '1E9D',
    // Floor tile line attack, Elkite Onmitsu, boss 2
    'Kugane Castle Juji Shuriken 3': '1EA0',
    // Line AoE, Elite Onmitsu, boss 2
    'Kugane Castle Auto Crossbow': '2333',
    // Frontal cone AoE, Karakuri Hanya trash, after boss 2
    'Kugane Castle Harakiri 3': '23C9',
    // Giant Circle AoE, Harakiri  Hanya trash, after boss 2
    'Kugane Castle Iai-Giri': '1EA2',
    // Chariot AoE, Yojimbo, boss 3
    'Kugane Castle Fragility': '1EAA',
    // Chariot AoE, Inoshikacho, boss 3
    'Kugane Castle Dragonfire': '1EAB' // Line AoE, Dragon Head, boss 3

  },
  shareWarn: {
    'Kugane Castle Issen': '1E97',
    // Instant frontal cleave, Dojun Maru, boss 2
    'Kugane Castle Clockwork Raiton': '1E9B' // Large lightning spread circles, Dojun Maru, boss 2

  },
  triggers: [{
    // Stack marker, Zuiko Maru, boss 1
    id: 'Kugane Castle Helm Crack',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '1E94'
    }),
    condition: (_e, _data, matches) => matches.type === '21',
    // Taking the stack solo is *probably* a mistake.
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
          ko: `${matches.ability} (혼자 맞음)`
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/st_mocianne_hard.js

/* harmony default export */ const st_mocianne_hard = ({
  zoneId: zone_id/* default.SaintMociannesArboretumHard */.Z.SaintMociannesArboretumHard,
  damageWarn: {
    'St Mocianne Hard Mudstream': '30D9',
    // Targeted circle AoE, Immaculate Apa trash, before boss 1
    'St Mocianne Hard Silken Spray': '3385',
    // Rear cone AoE, Withered Belladonna trash, before boss 1
    'St Mocianne Hard Muddy Puddles': '30DA',
    // Small targeted circle AoEs, Dorpokkur trash, before boss 1
    'St Mocianne Hard Odious Air': '2E49',
    // Frontal cone AoE, Nullchu, boss 1
    'St Mocianne Hard SLudge Bomb': '2E4E',
    // Targeted circle AoEs, Nullchu, boss 1
    'St Mocianne Hard Odious Atmosphere': '2E51',
    // Channeled 3/4 arena cleave, Nullchu, boss 1
    'St Mocianne Hard Creeping Ivy': '31A5',
    // Frontal cone AoE, Withered Kulak trash, before boss 2
    'St Mocianne Hard Rockslide': '3134',
    // Line AoE, Silt Golem, boss 2
    'St Mocianne Hard Earthquake Inner': '312E',
    // Chariot AoE, Lakhamu, boss 2
    'St Mocianne Hard Earthquake Outer': '312F',
    // Dynamo AoE, Lakhamu, boss 2
    'St Mocianne Hard Embalming Earth': '31A6',
    // Large Chariot AoE, Muddy Mata, after boss 2
    'St Mocianne Hard Quickmire': '3136',
    // Sewage surge avoided on platforms, Tokkapchi, boss 3
    'St Mocianne Hard Quagmire Platforms': '3139',
    // Quagmire explosion on platforms, Tokkapchi, boss 3
    'St Mocianne Hard Feculent Flood': '313C',
    // Targeted thin cone AoE, Tokkapchi, boss 3
    'St Mocianne Hard Corrupture': '33A0' // Mud Slime explosion, boss 3. (No explosion if done correctly.)

  },
  shareWarn: {
    'St Mocianne Hard Taproot': '2E4C',
    // Large orange spread circles, Nullchu, boss 1
    'St Mocianne Hard Earth Shaker': '3131' // Earth Shaker, Lakhamu, boss 2

  },
  gainsEffectWarn: {
    'St Mocianne Hard Seduced': '3DF',
    // Gaze failure, Withered Belladonna trash, before boss 1
    'St Mocianne Hard Pollen': '13',
    // Sludge puddles, Nullchu, boss 1
    'St Mocianne Hard Transfiguration': '648',
    // Roly-Poly AoE circle failure, BLooming Biloko trash, before boss 2
    'St Mocianne Hard Hysteria': '128',
    // Gaze failure, Lakhamu, boss 2
    'St Mocianne Hard Stab Wound': '45D' // Arena outer wall effect, boss 2

  },
  triggers: [{
    // Stack marker, Nullchu, boss 1
    id: 'St Mocianne Hard Fault Warren',
    damageRegex: '2E4A',
    condition: e => e.type === '15',
    // Taking the stack solo is *probably* a mistake.
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
          ko: `${matches.ability} (혼자 맞음)`
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/swallows_compass.js


/* harmony default export */ const swallows_compass = ({
  zoneId: zone_id/* default.TheSwallowsCompass */.Z.TheSwallowsCompass,
  damageWarn: {
    'Swallows Compass Ivy Fetters': '2C04',
    // Circle ground AoE, Sai Taisui trash, before boss 1
    'Swallows Compass Wildswind 1': '2C05',
    // Tornado ground AoE, placed by Sai Taisui trash, before boss 1
    'Swallows Compass Yama-Kagura': '2B96',
    // Frontal line AoE, Otengu, boss 1
    'Swallows Compass Flames Of Hate': '2B98',
    // Fire orb explosions, boss 1
    'Swallows Compass Conflagrate': '2B99',
    // Collision with fire orb, boss 1
    'Swallows Compass Upwell': '2C06',
    // Targeted circle ground AoE, Sai Taisui trash, before boss 2
    'Swallows Compass Bad Breath': '2C07',
    // Frontal cleave, Jinmenju trash, before boss 2
    'Swallows Compass Greater Palm 1': '2B9D',
    // Half arena right cleave, Daidarabotchi, boss 2
    'Swallows Compass Greater Palm 2': '2B9E',
    // Half arena left cleave, Daidarabotchi, boss 2
    'Swallows Compass Tributary': '2BA0',
    // Targeted thin conal ground AoEs, Daidarabotchi, boss 2
    'Swallows Compass Wildswind 2': '2C06',
    // Circle ground AoE, environment, after boss 2
    'Swallows Compass Wildswind 3': '2C07',
    // Circle ground AoE, placed by Sai Taisui trash, after boss 2
    'Swallows Compass Filoplumes': '2C76',
    // Frontal rectangle AoE, Dragon Bi Fang trash, after boss 2
    'Swallows Compass Both Ends 1': '2BA8',
    // Chariot AoE, Qitian Dasheng, boss 3
    'Swallows Compass Both Ends 2': '2BA9',
    // Dynamo AoE, Qitian Dasheng, boss 3
    'Swallows Compass Both Ends 3': '2BAE',
    // Chariot AoE, Shadow Of The Sage, boss 3
    'Swallows Compass Both Ends 4': '2BAF',
    // Dynamo AoE, Shadow Of The Sage, boss 3
    'Swallows Compass Equal Of Heaven': '2BB4' // Small circle ground AoEs, Qitian Dasheng, boss 3

  },
  shareWarn: {
    'Swallows Compass Mirage': '2BA2',
    // Prey-chasing puddles, Daidarabotchi, boss 2
    'Swallows Compass Mountain Falls': '2BA5',
    // Circle spread markers, Daidarabotchi, boss 2
    'Swallows Compass The Long End': '2BA7',
    // Laser tether, Qitian Dasheng  boss 3
    'Swallows Compass The Long End 2': '2BAD' // Laser Tether, Shadows Of The Sage, boss 3

  },
  gainsEffectWarn: {
    'Swallows Compass Hysteria': '128',
    // Gaze attack failure, Otengu, boss 1
    'Swallows Compass Bleeding': '112F' // Stepping outside the arena, boss 3

  },
  triggers: [{
    // Standing in the lake, Diadarabotchi, boss 2
    id: 'Swallows Compass Six Fulms Under',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '237'
    }),
    deathReason: (_e, _data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
        reason: matches.effect
      };
    }
  }, {
    // Stack marker, boss 3
    id: 'Swallows Compass Five Fingered Punishment',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: ['2BAB', '2BB0'],
      source: ['Qitian Dasheng', 'Shadow Of The Sage']
    }),
    condition: (_data, matches) => matches.type === '21',
    // Taking the stack solo is *probably* a mistake.
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
          ko: `${matches.ability} (혼자 맞음)`
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/temple_of_the_fist.js

/* harmony default export */ const temple_of_the_fist = ({
  zoneId: zone_id/* default.TheTempleOfTheFist */.Z.TheTempleOfTheFist,
  damageWarn: {
    'Temple Fire Break': '21ED',
    // Conal AoE, Bloodglider Monk trash
    'Temple Radial Blaster': '1FD3',
    // Circle AoE, boss 1
    'Temple Wide Blaster': '1FD4',
    // Conal AoE, boss 1
    'Temple Crippling Blow': '2016',
    // Line AoEs, environmental, before boss 2
    'Temple Broken Earth': '236E',
    // Circle AoE, Singha trash
    'Temple Shear': '1FDD',
    // Dual conal AoE, boss 2
    'Temple Counter Parry': '1FE0',
    // Retaliation for incorrect direction after Killer Instinct, boss 2
    'Temple Tapas': '',
    // Tracking circular ground AoEs, boss 2
    'Temple Hellseal': '200F',
    // Red/Blue symbol failure, boss 2
    'Temple Pure Will': '2017',
    // Circle AoE, Spirit Flame trash, before boss 3
    'Temple Megablaster': '163',
    // Conal AoE, Coeurl Prana trash, before boss 3
    'Temple Windburn': '1FE8',
    // Circle AoE, Twister wind, boss 3
    'Temple Hurricane Kick': '1FE5',
    // 270-degree frontal AoE, boss 3
    'Temple Silent Roar': '1FEB',
    // Frontal line AoE, boss 3
    'Temple Mighty Blow': '1FEA' // Contact with coeurl head, boss 3

  },
  shareWarn: {
    'Temple Heat Lightning': '1FD7' // Purple spread circles, boss 1

  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/dungeon/the_burn.js

/* harmony default export */ const the_burn = ({
  zoneId: zone_id/* default.TheBurn */.Z.TheBurn,
  damageWarn: {
    'The Burn Falling Rock': '31A3',
    // Environmental line AoE
    'The Burn Aetherial Blast': '328B',
    // Line AoE, Kukulkan trash
    'The Burn Mole-a-whack': '328D',
    // Circle AoE, Desert Desman trash
    'The Burn Head Butt': '328E',
    // Small conal AoE, Desert Desman trash
    'The Burn Shardfall': '3191',
    // Roomwide AoE, LoS for safety, Hedetet, boss 1
    'The Burn Dissonance': '3192',
    // Donut AoE, Hedetet, boss 1
    'The Burn Crystalline Fracture': '3197',
    // Circle AoE, Dim Crystal, boss 1
    'The Burn Resonant Frequency': '3198',
    // Circle AoE, Dim Crystal, boss 1
    'The Burn Rotoswipe': '3291',
    // Frontal cone AoE, Charred Dreadnaught trash
    'The Burn Wrecking Ball': '3292',
    // Circle AoE, Charred Dreadnaught trash
    'The Burn Shatter': '3294',
    // Large circle AoE, Charred Doblyn trash
    'The Burn Auto-Cannons': '3295',
    // Line AoE, Charred Drone trash
    'The Burn Self-Detonate': '3296',
    // Circle AoE, Charred Drone trash
    'The Burn Full Throttle': '2D75',
    // Line AoE, Defective Drone, boss 2
    'The Burn Throttle': '2D76',
    // Line AoE, Mining Drone adds, boss 2
    'The Burn Adit Driver': '2D78',
    // Line AoE, Rock Biter adds, boss 2
    'The Burn Tremblor': '3297',
    // Large circle AoE, Veiled Gigaworm trash
    'The Burn Desert Spice': '3298',
    // The frontal cleaves must flow
    'The Burn Toxic Spray': '329A',
    // Frontal cone AoE, Gigaworm Stalker trash
    'The Burn Venom Spray': '329B',
    // Targeted circle AoE, Gigaworm Stalker trash
    'The Burn White Death': '3143',
    // Reactive during invulnerability, Mist Dragon, boss 3
    'The Burn Fog Plume 1': '3145',
    // Star AoE, Mist Dragon, boss 3
    'The Burn Fog Plume 2': '3146',
    // Line AoEs after stars, Mist Dragon, boss 3
    'The Burn Cauterize': '3148' // Line/Swoop AoE, Mist Dragon, boss 3

  },
  damageFail: {
    'The Burn Cold Fog': '3142' // Growing circle AoE, Mist Dragon, boss 3

  },
  shareWarn: {
    'The Burn Hailfire': '3194',
    // Head marker line AoE, Hedetet, boss 1
    'The Burn Shardstrike': '3195',
    // Orange spread head markers, Hedetet, boss 1
    'The Burn Chilling Aspiration': '314D',
    // Head marker cleave, Mist Dragon, boss 3
    'The Burn Frost Breath': '314C' // Tank cleave, Mist Dragon, boss 3

  },
  gainsEffectWarn: {
    'The Burn Leaden': '43',
    // Puddle effect, boss 2. (Also inflicts 11F, Sludge.)
    'The Burn Puddle Frostbite': '11D' // Ice puddle effect, boss 3. (NOT the conal-inflicted one, 10C.)

  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o1n.js
 // O1N - Deltascape 1.0 Normal

/* harmony default export */ const o1n = ({
  zoneId: zone_id/* default.DeltascapeV10 */.Z.DeltascapeV10,
  damageWarn: {
    'O1N Burn': '23D5',
    // Fireball explosion circle AoEs
    'O1N Clamp': '23E2' // Frontal rectangle knockback AoE, Alte Roite

  },
  triggers: [{
    // Small spread circles
    id: 'O1N Levinbolt',
    damageRegex: '23DA',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o2n.js

 // O2N - Deltascape 2.0 Normal

/* harmony default export */ const o2n = ({
  zoneId: zone_id/* default.DeltascapeV20 */.Z.DeltascapeV20,
  damageWarn: {
    'O2N Main Quake': '24A5',
    // Non-telegraphed circle AoE, Fleshy Member
    'O2N Erosion': '2590' // Small circle AoEs, Fleshy Member

  },
  shareWarn: {
    'O2N Paranormal Wave': '250E' // Instant tank cleave

  },
  triggers: [{
    // We could try to separate out the mistake that led to the player being petrified.
    // However, it's Normal mode, why overthink it?
    id: 'O2N Petrification',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '262'
    }),
    // The user might get hit by another petrifying ability before the effect ends.
    // There's no point in notifying for that.
    suppressSeconds: 10,
    mistake: e => {
      return {
        type: 'warn',
        blame: e.target,
        text: e.effect
      };
    }
  }, {
    id: 'O2N Earthquake',
    damageRegex: '2515',
    condition: e => {
      // This deals damage only to non-floating targets.
      return e.damage > 0;
    },
    mistake: e => {
      return {
        type: 'warn',
        name: e.targetName,
        text: e.abilityName
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o3n.js

 // O3N - Deltascape 3.0 Normal

/* harmony default export */ const o3n = ({
  zoneId: zone_id/* default.DeltascapeV30 */.Z.DeltascapeV30,
  damageWarn: {
    'O3N Spellblade Fire III': '2460',
    // Donut AoE, Halicarnassus
    'O3N Spellblade Blizzard III': '2461',
    // Circle AoE, Halicarnassus
    'O3N Spellblade Thunder III': '2462',
    // Line AoE, Halicarnassus
    'O3N Cross Reaper': '246B',
    // Circle AoE, Soul Reaper
    'O3N Gusting Gouge': '246C',
    // Green line AoE, Soul Reaper
    'O3N Sword Dance': '2470',
    // Targeted thin cone AoE, Halicarnassus
    'O3N Uplift': '2473' // Ground spears, Queen's Waltz effect, Halicarnassus

  },
  damageFail: {
    'O3N Ultimum': '2477' // Instant kill. Used if the player does not exit the sand maze fast enough.

  },
  shareWarn: {
    'O3N Holy Blur': 2463 // Spread circles.

  },
  triggers: [{
    id: 'O3N Phase Tracker',
    netRegex: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '2304',
      source: 'Halicarnassus',
      capture: false
    }),
    netRegexDe: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '2304',
      source: 'Halikarnassos',
      capture: false
    }),
    netRegexFr: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '2304',
      source: 'Halicarnasse',
      capture: false
    }),
    netRegexJa: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '2304',
      source: 'ハリカルナッソス',
      capture: false
    }),
    netRegexCn: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '2304',
      source: '哈利卡纳苏斯',
      capture: false
    }),
    netRegexKo: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '2304',
      source: '할리카르나소스',
      capture: false
    }),
    run: (_e, data) => {
      data.phaseNumber += 1;
    }
  }, {
    // There's a lot to track, and in order to make it all clean, it's safest just to
    // initialize it all up front instead of trying to guard against undefined comparisons.
    id: 'O3N Initializing',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '367',
      source: 'Halicarnassus',
      capture: false
    }),
    netRegexDe: netregexes/* default.ability */.Z.ability({
      id: '367',
      source: 'Halikarnassos',
      capture: false
    }),
    netRegexFr: netregexes/* default.ability */.Z.ability({
      id: '367',
      source: 'Halicarnasse',
      capture: false
    }),
    netRegexJa: netregexes/* default.ability */.Z.ability({
      id: '367',
      source: 'ハリカルナッソス',
      capture: false
    }),
    netRegexCn: netregexes/* default.ability */.Z.ability({
      id: '367',
      source: '哈利卡纳苏斯',
      capture: false
    }),
    netRegexKo: netregexes/* default.ability */.Z.ability({
      id: '367',
      source: '할리카르나소스',
      capture: false
    }),
    condition: (_e, data) => !data.initialized,
    run: (_e, data) => {
      data.gameCount = 0; // Indexing phases at 1 so as to make phases match what humans expect.
      // 1: We start here.
      // 2: Cave phase with Uplifts.
      // 3: Post-intermission, with good and bad frogs.

      data.phaseNumber = 1;
      data.initialized = true;
    }
  }, {
    id: 'O3N Ribbit',
    abilityRegex: '2466',
    condition: (e, data) => {
      // We DO want to be hit by Toad/Ribbit if the next cast of The Game
      // is 4x toad panels.
      return !(data.phaseNumber === 3 && data.gameCount % 2 === 0) && e.targetId !== 'E0000000';
    },
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    // There's a lot we could do to track exactly how the player failed The Game.
    // Why overthink Normal mode, however?
    id: 'O3N The Game',
    // Guess what you just lost?
    abilityRegex: '246D',
    condition: e => {
      // If the player takes no damage, they did the mechanic correctly.
      return e.damage > 0;
    },
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    },
    run: (_e, data) => {
      data.gameCount += 1;
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o4n.js

 // O4N - Deltascape 4.0 Normal

/* harmony default export */ const o4n = ({
  zoneId: zone_id/* default.DeltascapeV40 */.Z.DeltascapeV40,
  damageWarn: {
    'O4N Blizzard III': '24BC',
    // Targeted circle AoEs, Exdeath
    'O4N Empowered Thunder III': '24C1',
    // Untelegraphed large circle AoE, Exdeath
    'O4N Zombie Breath': '24CB',
    // Conal, tree head after Decisive Battle
    'O4N Clearout': '24CC',
    // Overlapping cone AoEs, Deathly Vine (tentacles alongside tree head)
    'O4N Black Spark': '24C9' // Exploding Black Hole

  },
  shareWarn: {
    // Empowered Fire III inflicts the Pyretic debuff, which deals damage if the player
    // moves or acts before the debuff falls. Unfortunately it doesn't look like there's
    // currently a log line for this, so the only way to check for this is to collect
    // the debuffs and then warn if a player takes an action during that time. Not worth it
    // for Normal.
    'O4N Standard Fire': '24BA',
    'O4N Buster Thunder': '24BE' // A cleaving tank buster

  },
  triggers: [{
    id: 'O4N Doom',
    // Kills target if not cleansed
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '38E'
    }),
    deathReason: e => {
      return {
        type: 'fail',
        name: e.target,
        reason: {
          en: 'Cleansers missed Doom!',
          de: 'Doom-Reinigung vergessen!',
          fr: 'N\'a pas été dissipé(e) du Glas !',
          ja: '死の宣告',
          cn: '没解死宣'
        }
      };
    }
  }, {
    id: 'O4N Vacuum Wave',
    // Short knockback from Exdeath
    damageRegex: '24B8',
    deathReason: e => {
      return {
        type: 'fail',
        name: e.targetName,
        reason: {
          en: 'Pushed off!',
          de: 'Runter geschubst!',
          fr: 'A été poussé(e) !',
          ja: '落ちた',
          cn: '击退坠落'
        }
      };
    }
  }, {
    id: 'O4N Empowered Blizzard',
    // Room-wide AoE, freezes non-moving targets
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '4E6'
    }),
    mistake: e => {
      return {
        type: 'warn',
        blame: e.target,
        text: e.effect
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o4s.js

 // O4S - Deltascape 4.0 Savage

/* harmony default export */ const o4s = ({
  zoneId: zone_id/* default.DeltascapeV40Savage */.Z.DeltascapeV40Savage,
  damageWarn: {
    'O4S2 Neo Vacuum Wave': '241D',
    'O4S2 Acceleration Bomb': '2431',
    'O4S2 Emptiness': '2422'
  },
  damageFail: {
    'O4S2 Double Laser': '2415'
  },
  triggers: [{
    id: 'O4S2 Decisive Battle',
    abilityRegex: '2408',
    run: (_e, data) => {
      data.isDecisiveBattleElement = true;
    }
  }, {
    id: 'O4S1 Vacuum Wave',
    abilityRegex: '23FE',
    run: (_e, data) => {
      data.isDecisiveBattleElement = false;
    }
  }, {
    id: 'O4S2 Almagest',
    abilityRegex: '2417',
    run: (_e, data) => {
      data.isNeoExdeath = true;
    }
  }, {
    id: 'O4S2 Blizzard III',
    damageRegex: '23F8',
    condition: (e, data) => {
      // Ignore unavoidable raid aoe Blizzard III.
      return data.IsPlayerId(e.targetId) && !data.isDecisiveBattleElement;
    },
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'O4S2 Thunder III',
    damageRegex: '23FD',
    condition: (e, data) => {
      // Only consider this during random mechanic after decisive battle.
      return data.IsPlayerId(e.targetId) && data.isDecisiveBattleElement;
    },
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'O4S2 Petrified',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '262'
    }),
    mistake: (_e, data, matches) => {
      // On Neo, being petrified is because you looked at Shriek, so your fault.
      if (data.isNeoExdeath) return {
        type: 'fail',
        blame: matches.target,
        text: matches.effect
      }; // On normal ExDeath, this is due to White Hole.

      return {
        type: 'warn',
        name: matches.target,
        text: matches.effect
      };
    }
  }, {
    id: 'O4S2 Forked Lightning',
    damageRegex: '242E',
    condition: (e, data) => data.IsPlayerId(e.targetId),
    mistake: (e, data) => {
      const text = e.abilityName + ' => ' + data.ShortName(e.targetName);
      return {
        type: 'fail',
        blame: e.attackerName,
        text: text
      };
    }
  }, {
    id: 'O4S2 Double Attack',
    damageRegex: '241C',
    condition: (e, data) => data.IsPlayerId(e.targetId),
    collectSeconds: 0.5,
    mistake: e => {
      if (e.length <= 2) return; // Hard to know who should be in this and who shouldn't, but
      // it should never hit 3 people.

      return {
        type: 'fail',
        fullText: e[0].abilityName + ' x ' + e.length
      };
    }
  }, {
    id: 'O4S2 Beyond Death Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '566'
    }),
    run: (_e, data, matches) => {
      data.hasBeyondDeath = data.hasBeyondDeath || {};
      data.hasBeyondDeath[matches.target] = true;
    }
  }, {
    id: 'O4S2 Beyond Death Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '566'
    }),
    run: (_e, data, matches) => {
      data.hasBeyondDeath = data.hasBeyondDeath || {};
      data.hasBeyondDeath[matches.target] = false;
    }
  }, {
    id: 'O4S2 Beyond Death',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '566'
    }),
    delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (_e, data, matches) => {
      if (!data.hasBeyondDeath) return;
      if (!data.hasBeyondDeath[matches.target]) return;
      return {
        name: matches.target,
        reason: matches.effect
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o7s.js
 // O7S - Sigmascape 3.0 Savage

/* harmony default export */ const o7s = ({
  zoneId: zone_id/* default.SigmascapeV30Savage */.Z.SigmascapeV30Savage,
  damageFail: {
    'O7S Missile': '2782',
    'O7S Chain Cannon': '278F'
  },
  damageWarn: {
    'O7S Searing Wind': '2777'
  },
  triggers: [{
    id: 'O7S Stoneskin',
    abilityRegex: '2AB5',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/raid/o12s.js

 // TODO: could add Patch warnings for double/unbroken tethers
// TODO: Hello World could have any warnings (sorry)

/* harmony default export */ const o12s = ({
  zoneId: zone_id/* default.AlphascapeV40Savage */.Z.AlphascapeV40Savage,
  damageWarn: {
    'O12S1 Superliminal Motion 1': '3334',
    // 300+ degree cleave with back safe area
    'O12S1 Efficient Bladework 1': '3329',
    // Omega-M "get out" centered aoe after split
    'O12S1 Efficient Bladework 2': '332A',
    // Omega-M "get out" centered aoe during blades
    'O12S1 Beyond Strength': '3328',
    // Omega-M "get in" centered aoe during shield
    'O12S1 Superliminal Steel 1': '3330',
    // Omega-F "get front/back" blades phase
    'O12S1 Superliminal Steel 2': '3331',
    // Omega-F "get front/back" blades phase
    'O12S1 Optimized Blizzard III': '3332',
    // Omega-F giant cross
    'O12S2 Diffuse Wave Cannon': '3369',
    // back/sides lasers
    'O12S2 Right Arm Unit Hyper Pulse 1': '335A',
    // Rotating Archive Peripheral lasers
    'O12S2 Right Arm Unit Hyper Pulse 2': '335B',
    // Rotating Archive Peripheral lasers
    'O12S2 Right Arm Unit Colossal Blow': '335F',
    // Exploding Archive All hands
    'O12S2 Left Arm Unit Colossal Blow': '3360' // Exploding Archive All hands

  },
  damageFail: {
    'O12S1 Optical Laser': '3347',
    // middle laser from eye
    'O12S1 Advanced Optical Laser': '334A',
    // giant circle centered on eye
    'O12S2 Rear Power Unit Rear Lasers 1': '3361',
    // Archive All initial laser
    'O12S2 Rear Power Unit Rear Lasers 2': '3362' // Archive All rotating laser

  },
  shareWarn: {
    'O12S1 Optimized Fire III': '3337',
    // fire spread
    'O12S2 Hyper Pulse Tether': '335C',
    // Index And Archive Peripheral tethers
    'O12S2 Wave Cannon': '336B',
    // Index And Archive Peripheral baited lasers
    'O12S2 Optimized Fire III': '3379' // Archive All spread

  },
  shareFail: {
    'O12S1 Optimized Sagittarius Arrow': '334D',
    // Omega-M bard limit break
    'O12S2 Oversampled Wave Cannon': '3366',
    // Monitor tank busters
    'O12S2 Savage Wave Cannon': '336D' // Tank buster with the vuln first

  },
  triggers: [{
    id: 'O12S1 Discharger Knocked Off',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '3327'
    }),
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
          ko: '넉백'
        }
      };
    }
  }, {
    id: 'O12S1 Magic Vulnerability Up Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '472'
    }),
    run: (_e, data, matches) => {
      data.vuln = data.vuln || {};
      data.vuln[matches.target] = true;
    }
  }, {
    id: 'O12S1 Magic Vulnerability Up Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '472'
    }),
    run: (_e, data, matches) => {
      data.vuln = data.vuln || {};
      data.vuln[matches.target] = false;
    }
  }, {
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
          cn: `${matches.ability} (带易伤)`
        }
      };
    }
  }]
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
    'ByaEx Hunderfold Havoc 2': '27E6'
  },
  damageFail: {
    'ByaEx Sweep The Leg': '27DB',
    'ByaEx Fire and Lightning': '27DE',
    'ByaEx Distant Clap': '27DD',
    // Midphase line attack
    'ByaEx Imperial Guard': '27F1'
  },
  triggers: [{
    // Pink bubble collision
    id: 'ByaEx Ominous Wind',
    damageRegex: '27EC',
    condition: (e, data) => data.IsPlayerId(e.targetId),
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: {
          en: 'bubble collision',
          de: 'Blasen sind zusammengestoßen',
          fr: 'collision de bulles',
          ja: '衝突',
          cn: '相撞',
          ko: '장판 겹쳐서 터짐'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/trial/shinryu.js

 // Shinryu Normal

/* harmony default export */ const shinryu = ({
  zoneId: zone_id/* default.TheRoyalMenagerie */.Z.TheRoyalMenagerie,
  damageWarn: {
    'Shinryu Akh Rhai': '1FA6',
    // Sky lasers alongside Akh Morn.
    'Shinryu Blazing Trail': '221A',
    // Rectangle AoEs, intermission adds.
    'Shinryu Collapse': '2218',
    // Circle AoEs, intermission adds
    'Shinryu Dragonfist': '24F0',
    // Giant punchy circle in the center.
    'Shinryu Earth Breath': '1F9D',
    // Conal attacks that aren't actually Earth Shakers.
    'Shinryu Gyre Charge': '1FA8',
    // Green dive bomb attack.
    'Shinryu Spikesicle': '1FA`',
    // Blue-green line attacks from behind.
    'Shinryu Tail Slap': '1F93' // Red squares indicating the tail's landing spots.

  },
  shareWarn: {
    'Shinryu Levinbolt': '1F9C'
  },
  triggers: [{
    // Icy floor attack.
    id: 'Shinryu Diamond Dust',
    // Thin Ice
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '38F'
    }),
    deathReason: (_e, _data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
        reason: {
          en: 'Slid off!',
          de: 'Runter gerutscht!',
          fr: 'A glissé(e) !',
          ja: '滑った',
          cn: '滑落'
        }
      };
    }
  }, {
    id: 'Shinryu Tidal Wave',
    damageRegex: '1F8B',
    deathReason: e => {
      return {
        type: 'fail',
        name: e.targetName,
        reason: {
          en: 'Pushed off!',
          de: 'Runter geschubst!',
          fr: 'A été poussé(e) !',
          ja: '落ちた',
          cn: '击退坠落'
        }
      };
    }
  }, {
    // Knockback from center.
    id: 'Shinryu Aerial Blast',
    damageRegex: '1F90',
    deathReason: e => {
      return {
        type: 'fail',
        name: e.targetName,
        reason: {
          en: 'Pushed off!',
          de: 'Runter geschubst!',
          fr: 'A été pousser !',
          ja: '落ちた',
          cn: '击退坠落'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/trial/susano-ex.js
 // Susano Extreme

/* harmony default export */ const susano_ex = ({
  zoneId: zone_id/* default.ThePoolOfTributeExtreme */.Z.ThePoolOfTributeExtreme,
  damageWarn: {
    'SusEx Churning': '203F'
  },
  damageFail: {
    'SusEx Rasen Kaikyo': '202E'
  }
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
    'UWU Landslide2': '2B71'
  },
  damageFail: {
    'UWU Great Whirlwind': '2B41',
    'UWU Slipstream': '2B53',
    'UWU Wicked Wheel': '2B4E',
    'UWU Wicked Tornado': '2B4F'
  },
  triggers: [{
    id: 'UWU Windburn',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: 'EB'
    }),
    suppressSeconds: 2,
    mistake: e => {
      return {
        type: 'warn',
        blame: e.target,
        text: e.effect
      };
    }
  }, {
    // Featherlance explosion.  It seems like the person who pops it is the
    // first person listed damage-wise, so they are likely the culprit.
    id: 'UWU Featherlance',
    damageRegex: '2B43',
    collectSeconds: 0.5,
    suppressSeconds: 5,
    mistake: e => {
      return {
        type: 'fail',
        blame: e[0].targetName,
        text: e[0].attackerName
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/04-sb/ultimate/unending_coil_ultimate.js

 // UCU - The Unending Coil Of Bahamut (Ultimate)

/* harmony default export */ const unending_coil_ultimate = ({
  zoneId: zone_id/* default.TheUnendingCoilOfBahamutUltimate */.Z.TheUnendingCoilOfBahamutUltimate,
  damageFail: {
    'UCU Lunar Dynamo': '26BC',
    'UCU Iron Chariot': '26BB',
    'UCU Exaflare': '26EF',
    'UCU Wings Of Salvation': '26CA'
  },
  triggers: [{
    id: 'UCU Twister Death',
    damageRegex: '26AB',
    condition: (e, data) => {
      // Instant death uses '36' as its flags, differentiating
      // from the explosion damage you take when somebody else
      // pops one.
      return data.IsPlayerId(e.targetId) && e.flags === '36';
    },
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: {
          en: 'Twister Pop',
          de: 'Wirbelsturm berührt',
          fr: 'Apparition des tornades',
          ja: 'ツイスター',
          cn: '旋风',
          ko: '회오리 밟음'
        }
      };
    }
  }, {
    id: 'UCU Thermionic Burst',
    damageRegex: '26B9',
    condition: (e, data) => data.IsPlayerId(e.targetId),
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: {
          en: 'Pizza Slice',
          de: 'Pizzastück',
          fr: 'Parts de pizza',
          ja: 'サーミオニックバースト',
          cn: '天崩地裂',
          ko: '장판에 맞음'
        }
      };
    }
  }, {
    id: 'UCU Chain Lightning',
    damageRegex: '26C8',
    condition: (e, data) => data.IsPlayerId(e.targetId),
    mistake: e => {
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
          ko: '번개 맞음'
        }
      };
    }
  }, {
    id: 'UCU Burns',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: 'FA'
    }),
    mistake: e => {
      return {
        type: 'warn',
        blame: e.target,
        text: e.effect
      };
    }
  }, {
    id: 'UCU Sludge',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '11F'
    }),
    mistake: e => {
      return {
        type: 'fail',
        blame: e.target,
        text: e.effect
      };
    }
  }, {
    id: 'UCU Doom Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: 'D2'
    }),
    run: (_e, data, matches) => {
      data.hasDoom = data.hasDoom || {};
      data.hasDoom[matches.target] = true;
    }
  }, {
    id: 'UCU Doom Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: 'D2'
    }),
    run: (_e, data, matches) => {
      data.hasDoom = data.hasDoom || {};
      data.hasDoom[matches.target] = false;
    }
  }, {
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
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: 'D2'
    }),
    delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 1,
    deathReason: (e, data, matches) => {
      if (!data.hasDoom || !data.hasDoom[matches.target]) return;
      let reason;
      if (e.durationSeconds < 9) reason = matches.effect + ' #1';else if (e.durationSeconds < 14) reason = matches.effect + ' #2';else reason = matches.effect + ' #3';
      return {
        name: matches.target,
        reason: reason
      };
    }
  }]
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
    'Copied 9S Laser Suppression': '48E0',
    // Cannons
    'Copied 9S Ballistic Impact 1': '4974',
    'Copied 9S Ballistic Impact 2': '48DC',
    'Copied 9S Ballistic Impact 3': '48E4',
    'Copied 9S Ballistic Impact 4': '48E0',
    'Copied 9S Marx Impact': '48D4',
    'Copied 9S Tank Destruction 1': '48E8',
    'Copied 9S Tank Destruction 2': '48E9',
    'Copied 9S Serial Spin 1': '48A5',
    'Copied 9S Serial Spin 2': '48A7'
  },
  shareWarn: {
    'Copied Hobbes Short-Range Missile': '4815'
  }
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
    'Puppet Aegis Beam Cannons 1': '5074',
    // rotating separating white ground aoe
    'Puppet Aegis Beam Cannons 2': '5075',
    // rotating separating white ground aoe
    'Puppet Aegis Beam Cannons 3': '5076',
    // rotating separating white ground aoe
    'Puppet Aegis Collider Cannons': '507E',
    // rotating red ground aoe pinwheel
    'Puppet Aegis Surface Laser 1': '5091',
    // chasing laser initial
    'Puppet Aegis Surface Laser 2': '5092',
    // chasing laser chasing
    'Puppet Aegis Flight Path': '508C',
    // blue line aoe from flying untargetable adds
    'Puppet Aegis Refraction Cannons 1': '5081',
    // refraction cannons between wings
    'Puppet Aegis Life\'s Last Song': '53B3',
    // ring aoe with gap
    'Puppet Light Long-Barreled Laser': '5212',
    // line aoe from add
    'Puppet Light Surface Missile Impact': '520F',
    // untargeted ground aoe from No Restrictions
    'Puppet Superior Incendiary Bombing': '4FB9',
    // fire puddle initial
    'Puppet Superior Sharp Turn': '506D',
    // sharp turn dash
    'Puppet Superior Standard Surface Missile 1': '4FB1',
    // Lethal Revolution circles
    'Puppet Superior Standard Surface Missile 2': '4FB2',
    // Lethal Revolution circles
    'Puppet Superior Standard Surface Missile 3': '4FB3',
    // Lethal Revolution circles
    'Puppet Superior Sliding Swipe 1': '506F',
    // right-handed sliding swipe
    'Puppet Superior Sliding Swipe 2': '5070',
    // left-handed sliding swipe
    'Puppet Superior Guided Missile': '4FB8',
    // ground aoe during Area Bombardment
    'Puppet Superior High-Order Explosive Blast 1': '4FC0',
    // star aoe
    'Puppet Superior High-Order Explosive Blast 2': '4FC1',
    // star aoe
    'Puppet Heavy Energy Bombardment': '4FFC',
    // colored magic hammer-y ground aoe
    'Puppet Heavy Revolving Laser': '5000',
    // get under laser
    'Puppet Heavy Energy Bomb': '4FFA',
    // getting hit by ball during Active Suppressive Unit
    'Puppet Heavy R010 Laser': '4FF0',
    // laser pod
    'Puppet Heavy R030 Hammer': '4FF1',
    // circle aoe pod
    'Puppet Hallway High-Powered Laser': '50B1',
    // long aoe in the hallway section
    'Puppet Hallway Energy Bomb': '50B2',
    // running into a floating orb
    'Puppet Compound Mechanical Dissection': '51B3',
    // spinning vertical laser
    'Puppet Compound Mechanical Decapitation': '51B4',
    // get under laser
    'Puppet Compound Mechnical Contusion Untargeted': '51B7',
    // untargeted ground aoe
    'Puppet Compound 2P Relentless Spiral 1': '51AA',
    // triple untargeted ground aoes
    'Puppet Compound 2P Relentless Spiral 2': '51CB',
    // triple untargeted ground aoes
    'Puppet Compound 2P Prime Blade Out 1': '541F',
    // 2P prime blade get out
    'Puppet Compound 2P Prime Blade Out 2': '5198',
    // 2P/puppet teleporting/reproduce prime blade get out
    'Puppet Compound 2P Prime Blade Behind 1': '5420',
    // 2P prime blade get behind
    'Puppet Compound 2P Prime Blade Behind 2': '5199',
    // 2P teleporting prime blade get behind
    'Puppet Compound 2P Prime Blade In 1': '5421',
    // 2P prime blade get in
    'Puppet Compound 2P Prime Blade In 2': '519A',
    // 2P/puppet teleporting/reproduce prime blade get in
    'Puppet Compound 2P R012 Laser Ground': '51AE' // untargeted ground circle
    // This is... too noisy.
    // 'Puppet Compound 2P Four Parts Resolve 1': '51A0', // four parts resolve jump
    // 'Puppet Compound 2P Four Parts Resolve 2': '519F', // four parts resolve cleave

  },
  damageFail: {
    'Puppet Heavy Upper Laser 1': '5087',
    // upper laser initial
    'Puppet Heavy Upper Laser 2': '4FF7',
    // upper laser continuous
    'Puppet Heavy Lower Laser 1': '5086',
    // lower laser first section initial
    'Puppet Heavy Lower Laser 2': '4FF6',
    // lower laser first section continuous
    'Puppet Heavy Lower Laser 3': '5088',
    // lower laser second section initial
    'Puppet Heavy Lower Laser 4': '4FF8',
    // lower laser second section continuous
    'Puppet Heavy Lower Laser 5': '5089',
    // lower laser third section initial
    'Puppet Heavy Lower Laser 6': '4FF9',
    // lower laser third section continuous
    'Puppet Compound Incongruous Spin': '51B2' // find the safe spot double dash

  },
  shareWarn: {
    // This is pretty large and getting hit by initial without burns seems fine.
    // 'Puppet Light Homing Missile Impact': '5210', // targeted fire aoe from No Restrictions
    'Puppet Heavy Unconventional Voltage': '5004',
    // Pretty noisy.
    'Puppet Maneuver High-Powered Laser': '5002',
    // tank laser
    'Puppet Compound Mechnical Contusion Targeted': '51B6',
    // targeted spread marker
    'Puppet Compound 2P R012 Laser Tank': '51AE' // targeted spread pod laser on non-tank

  },
  shareFail: {
    'Puppet Aegis Anti-Personnel Laser': '5090',
    // tank buster marker
    'Puppet Superior Precision-Guided Missile': '4FC5',
    'Puppet Compound 2P R012 Laser Tank': '51AD' // targeted pod laser on tank

  },
  gainsEffectWarn: {
    'Puppet Burns': '10B' // standing in many various fire aoes

  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/alliance/the_tower_at_paradigms_breach.js

 // TODO: missing Shock Black 2?
// TODO: White/Black Dissonance damage is maybe when flags end in 03?

/* harmony default export */ const the_tower_at_paradigms_breach = ({
  zoneId: zone_id/* default.TheTowerAtParadigmsBreach */.Z.TheTowerAtParadigmsBreach,
  damageWarn: {
    'Tower Knave Colossal Impact Center 1': '5EA7',
    // Center aoe from Knave and clones
    'Tower Knave Colossal Impact Center 2': '60C8',
    // Center aoe from Knave during lunge
    'Tower Knave Colossal Impact Side 1': '5EA5',
    // Side aoes from Knave and clones
    'Tower Knave Colossal Impact Side 2': '5EA6',
    // Side aoes from Knave and clones
    'Tower Knave Colossal Impact Side 3': '60C6',
    // Side aoes from Knave during lunge
    'Tower Knave Colossal Impact Side 4': '60C7',
    // Side aoes from Knave during lunge
    'Tower Knave Burst': '5ED4',
    // Spheroid Knavish Bullets collision
    'Tower Knave Magic Barrage': '5EAC',
    // Spheroid line aoes
    'Tower Hansel Repay': '5C70',
    // Shield damage
    'Tower Hansel Explosion': '5C67',
    // Being hit by Magic Bullet during Passing Lance
    'Tower Hansel Impact': '5C5C',
    // Being hit by Magical Confluence during Wandering Trail
    'Tower Hansel Bloody Sweep 1': '5C6C',
    // Dual cleaves without tether
    'Tower Hansel Bloody Sweep 2': '5C6D',
    // Dual cleaves without tether
    'Tower Hansel Bloody Sweep 3': '5C6E',
    // Dual cleaves with tether
    'Tower Hansel Bloody Sweep 4': '5C6F',
    // Dual cleaves with tether
    'Tower Hansel Passing Lance': '5C66',
    // The Passing Lance charge itself
    'Tower Hansel Breaththrough 1': '55B3',
    // half room cleave during Wandering Trail
    'Tower Hansel Breaththrough 2': '5C5D',
    // half room cleave during Wandering Trail
    'Tower Hansel Breaththrough 3': '5C5E',
    // half room cleave during Wandering Trail
    'Tower Hansel Hungry Lance 1': '5C71',
    // 2xlarge conal cleave during Wandering Trail
    'Tower Hansel Hungry Lance 2': '5C72',
    // 2xlarge conal cleave during Wandering Trail
    'Tower Flight Unit Lightfast Blade': '5BFE',
    // large room cleave
    'Tower Flight Unit Standard Laser': '5BFF',
    // tracking laser
    'Tower 2P Whirling Assault': '5BFB',
    // line aoe from 2P clones
    'Tower 2P Balanced Edge': '5BFA',
    // circular aoe on 2P clones
    'Tower Red Girl Generate Barrier 1': '6006',
    // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 2': '6007',
    // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 3': '6008',
    // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 4': '6009',
    // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 5': '6310',
    // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 6': '6311',
    // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 7': '6312',
    // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 8': '6313',
    // being hit by barriers appearing
    'Tower Red Girl Shock White 1': '600F',
    // white shockwave circle not dropped on black
    'Tower Red Girl Shock White 2': '6010',
    // white shockwave circle not dropped on black
    'Tower Red Girl Shock Black 1': '6011',
    // black shockwave circle not dropped on white
    'Tower Red Girl Point White 1': '601F',
    // being hit by a white laser
    'Tower Red Girl Point White 2': '6021',
    // being hit by a white laser
    'Tower Red Girl Point Black 1': '6020',
    // being hit by a black laser
    'Tower Red Girl Point Black 2': '6022',
    // being hit by a black laser
    'Tower Red Girl Wipe White': '600C',
    // not line of sighting the white meteor
    'Tower Red Girl Wipe Black': '600D',
    // not line of sighting the black meteor
    'Tower Red Girl Diffuse Energy': '6056',
    // rotating clone bubble cleaves
    'Tower Red Girl Pylon Big Explosion': '6027',
    // not killing a pylon during hacking phase
    'Tower Red Girl Pylon Explosion': '6026',
    // pylon during Child's play
    'Tower Philosopher Deploy Armaments Middle': '5C02',
    // middle laser
    'Tower Philosopher Deploy Armaments Sides': '5C05',
    // sides laser
    'Tower Philosopher Deploy Armaments 3': '6078',
    // goes with 5C01
    'Tower Philosopher Deploy Armaments 4': '6079',
    // goes with 5C04
    'Tower Philosopher Energy Bomb': '5C05',
    // pink bubble
    'Tower False Idol Made Magic Right': '5BD7',
    // rotating wheel going right
    'Tower False Idol Made Magic Left': '5BD6',
    // rotating wheel going left
    'Tower False Idol Lighter Note': '5BDA',
    // lighter note moving aoes
    'Tower False Idol Magical Interference': '5BD5',
    // lasers during Rhythm Rings
    'Tower False Idol Scattered Magic': '5BDF',
    // circle aoes from Seed Of Magic
    'Tower Her Inflorescence Uneven Fotting': '5BE2',
    // building from Recreate Structure
    'Tower Her Inflorescence Crash': '5BE5',
    // trains from Mixed Signals
    'Tower Her Inflorescence Heavy Arms 1': '5BED',
    // heavy arms front/back attack
    'Tower Her Inflorescence Heavy Arms 2': '5BEF',
    // heavy arms sides attack
    'Tower Her Inflorescence Energy Scattered Magic': '5BE8' // orbs from Red Girl by train

  },
  damageFail: {
    'Tower Her Inflorescence Place Of Power': '5C0D' // instadeath middle circle before black/white rings

  },
  shareWarn: {
    'Tower Knave Magic Artillery Alpha': '5EAB',
    // Spread
    'Tower Hansel Seed Of Magic Alpha': '5C61' // Spread

  },
  shareFail: {
    'Tower Knave Magic Artillery Beta': '5EB3',
    // Tankbuster
    'Tower Red Girl Manipulate Energy': '601A',
    // Tankbuster
    'Tower False Idol Darker Note': '5BDC' // Tankbuster

  },
  triggers: [{
    id: 'Tower Knocked Off',
    // 5EB1 = Knave Lunge
    // 5BF2 = Her Infloresence Shockwave
    netRegex: netregexes/* default.ability */.Z.ability({
      id: ['5EB1', '5BF2']
    }),
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
          ko: '넉백'
        }
      };
    }
  }]
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
    'Anyder Winding Current': '3E1F' // 3E20 is being hit by the growing orbs, maybe?

  }
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
    'Amaurot Misfortune': '3CE2'
  },
  damageFail: {
    'Amaurot Apokalypsis': '3CD7'
  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/anamnesis_anyder.js

/* harmony default export */ const anamnesis_anyder = ({
  zoneId: zone_id/* default.AnamnesisAnyder */.Z.AnamnesisAnyder,
  damageWarn: {
    'Anamnesis Trench Phuabo Spine Lash': '4D1A',
    // frontal conal
    'Anamnesis Trench Anemone Falling Rock': '4E37',
    // ground circle aoe from Trench Anemone showing up
    'Anamnesis Trench Dagonite Sewer Water': '4D1C',
    // frontal conal from Trench Anemone (?!)
    'Anamnesis Trench Yovra Rock Hard': '4D21',
    // targeted circle aoe
    'Anamnesis Trench Yovra Torrential Torment': '4D21',
    // frontal conal
    'Anamnesis Unknown Luminous Ray': '4E27',
    // Unknown line aoe
    'Anamnesis Unknown Sinster Bubble Explosion': '4B6E',
    // Unknown explosions during Scrutiny
    'Anamnesis Unknown Reflection': '4B6F',
    // Unknown conal attack during Scrutiny
    'Anamnesis Unknown Clearout 1': '4B74',
    // Unknown frontal cone
    'Anamnesis Unknown Clearout 2': '4B6B',
    // Unknown frontal cone
    'Anamnesis Unknown Setback 1': '4B75',
    // Unknown rear cone
    'Anamnesis Unknown Setback 2': '5B6C',
    // Unknown rear cone
    'Anamnesis Anyder Clionid Acrid Stream': '4D24',
    // targeted circle aoe
    'Anamnesis Anyder Diviner Dreadstorm': '4D28',
    // ground circle aoe
    'Anamnesis Kyklops 2000-Mina Swing': '4B55',
    // Kyklops get out mechanic
    'Anamnesis Kyklops Terrible Hammer': '4B5D',
    // Kyklops Hammer/Blade alternating squares
    'Anamnesis Kyklops Terrible Blade': '4B5E',
    // Kyklops Hammer/Blade alternating squares
    'Anamnesis Kyklops Raging Glower': '4B56',
    // Kyklops line aoe
    'Anamnesis Kyklops Eye Of The Cyclone': '4B57',
    // Kyklops donut
    'Anamnesis Anyder Harpooner Hydroball': '4D26',
    // frontal conal
    'Anamnesis Rukshs Swift Shift': '4B83',
    // Rukshs Deem teleport N/S
    'Anamnesis Rukshs Depth Grip Wavebreaker': '33D4',
    // Rukshs Deem hand attacks
    'Anamnesis Rukshs Rising Tide': '4B8B',
    // Rukshs Deem cross aoe
    'Anamnesis Rukshs Command Current': '4B82' // Rukshs Deem protean-ish ground aoes

  },
  shareWarn: {
    'Anamnesis Trench Xzomit Mantle Drill': '4D19',
    // charge attack
    'Anamnesis Io Ousia Barreling Smash': '4E24',
    // charge attack
    'Anamnesis Kyklops Wanderer\'s Pyre': '4B5F' // Kyklops spread attack

  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/dohn_mheg.js

 // TODO: Missing Growing tethers on boss 2.
// (Maybe gather party member names on the previous TIIIIMBEEEEEER cast for comparison?)
// TODO: Failing to interrupt Dohnfaust Fuath on Watering Wheel casts?
// (15:........:Dohnfast Fuath:3DAA:Watering Wheel:........:(\y{Name}):)

/* harmony default export */ const dohn_mheg = ({
  zoneId: zone_id/* default.DohnMheg */.Z.DohnMheg,
  damageWarn: {
    'Dohn Mheg Geyser': '2260',
    // Water eruptions, boss 1
    'Dohn Mheg Hydrofall': '22BD',
    // Ground AoE marker, boss 1
    'Dohn Mheg Laughing Leap': '2294',
    // Ground AoE marker, boss 1
    'Dohn Mheg Swinge': '22CA',
    // Frontal cone, boss 2
    'Dohn Mheg Canopy': '3DB0',
    // Frontal cone, Dohnfaust Rowans throughout instance
    'Dohn Mheg Pinecone Bomb': '3DB1',
    // Circular ground AoE marker, Dohnfaust Rowans throughout instance
    'Dohn Mheg Bile Bombardment': '34EE',
    // Ground AoE marker, boss 3
    'Dohn Mheg Corrosive Bile': '34EC',
    // Frontal cone, boss 3
    'Dohn Mheg Flailing Tentacles': '3681'
  },
  triggers: [{
    id: 'Dohn Mheg Imp Choir',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '46E'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    id: 'Dohn Mheg Toad Choir',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '1B7'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    id: 'Dohn Mheg Fool\'s Tumble',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '183'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/heroes_gauntlet.js

 // TODO: Berserker 2nd/3rd wild anguish should be shared with just a rock

/* harmony default export */ const heroes_gauntlet = ({
  zoneId: zone_id/* default.TheHeroesGauntlet */.Z.TheHeroesGauntlet,
  damageWarn: {
    'THG Blade\'s Benison': '5228',
    // pld conal
    'THG Absolute Holy': '524B',
    // whm very large aoe
    'THG Hissatsu: Goka': '523D',
    // sam line aoe
    'THG Whole Self': '522D',
    // mnk wide line aoe
    'THG Randgrith': '5232',
    // drg very big line aoe
    'THG Vacuum Blade 1': '5061',
    // Spectral Thief circular ground aoe from marker
    'THG Vacuum Blade 2': '5062',
    // Spectral Thief circular ground aoe from marker
    'THG Coward\'s Cunning': '4FD7',
    // Spectral Thief Chicken Knife laser
    'THG Papercutter 1': '4FD1',
    // Spectral Thief line aoe from marker
    'THG Papercutter 2': '4FD2',
    // Spectral Thief line aoe from marker
    'THG Ring of Death': '5236',
    // drg circular aoe
    'THG Lunar Eclipse': '5227',
    // pld circular aoe
    'THG Absolute Gravity': '5248',
    // ink mage circular
    'THG Rain of Light': '5242',
    // bard large circule aoe
    'THG Dooming Force': '5239',
    // drg line aoe
    'THG Absolute Dark II': '4F61',
    // Necromancer 120 degree conal
    'THG Burst': '53B7',
    // Necromancer necroburst small zombie explosion
    'THG Pain Mire': '4FA4',
    // Necromancer very large green bleed puddle
    'THG Dark Deluge': '4F5D',
    // Necromancer ground aoe
    'THG Tekka Gojin': '523E',
    // sam 90 degree conal
    'THG Raging Slice 1': '520A',
    // Berserker line cleave
    'THG Raging Slice 2': '520B',
    // Berserker line cleave
    'THG Wild Rage': '5203' // Berserker blue knockback puck

  },
  shareWarn: {
    'THG Absolute Thunder IV': '5245',
    // headmarker aoe from blm
    'THG Moondiver': '5233',
    // headmarker aoe from drg
    'THG Spectral Gust': '53CF' // Spectral Thief headmarker aoe

  },
  shareFail: {
    'THG Falling Rock': '5205' // Berserker headmarker aoe that creates rubble

  },
  gainsEffectWarn: {
    'THG Bleeding': '828' // Standing in the Necromancer puddle or outside the Berserker arena

  },
  gainsEffectFail: {
    'THG Truly Berserk': '906' // Standing in the crater too long

  },
  triggers: [{
    id: 'THG Wild Anguish',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '5209'
    }),
    // This should always be shared.  On all times but the 2nd and 3rd, it's a party share.
    // TODO: on the 2nd and 3rd time this should only be shared with a rock.
    // TODO: alternatively warn on taking one of these with a 472 Magic Vulnerability Up effect
    condition: e => e.type === '15',
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    id: 'THG Wild Rampage',
    damageRegex: '5207',
    // This is zero damage if you are in the crater.
    condition: e => e.damage > 0,
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.ability
      };
    }
  }]
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
    'Holminster Left Knout': '3DE7'
  },
  damageFail: {
    'Holminster Aethersup': '3DE9'
  },
  shareWarn: {
    'Holminster Flagellation': '3DD6'
  },
  shareFail: {
    'Holminster Taphephobia': '4181'
  }
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
    'Malikah Earthshake': '3E39'
  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/matoyas_relict.js
 // TODO: could include 5484 Mudman Rocky Roll as a shareWarn, but it's low damage and common.

/* harmony default export */ const matoyas_relict = ({
  zoneId: zone_id/* default.MatoyasRelict */.Z.MatoyasRelict,
  damageWarn: {
    'Matoya Relict Werewood Ovation': '5518',
    // line aoe
    'Matoya Cave Tarantula Hawk Apitoxin': '5519',
    // big circle aoe
    'Matoya Spriggan Stonebearer Romp': '551A',
    // conal aoe
    'Matoya Sonny Of Ziggy Jittering Glare': '551C',
    // long narrow conal aoe
    'Matoya Mudman Quagmire': '5481',
    // Mudman aoe puddles
    'Matoya Mudman Brittle Breccia 1': '548E',
    // expanding circle aoe
    'Matoya Mudman Brittle Breccia 2': '548F',
    // expanding circle aoe
    'Matoya Mudman Brittle Breccia 3': '5490',
    // expanding circle aoe
    'Matoya Mudman Mud Bubble': '5487',
    // standing in mud puddle?
    'Matoya Cave Pugil Screwdriver': '551E',
    // conal aoe
    'Matoya Nixie Gurgle': '5992',
    // Nixie wall flush
    'Matoya Relict Molten Phoebad Pyroclastic Shot': '57EB',
    // the line aoes as you run to trash
    'Matoya Relict Flan Flood': '5523',
    // big circle aoe
    'Matoya Pyroduct Eldthurs Mash': '5527',
    // line aoe
    'Matyoa Pyroduct Eldthurs Spin': '5528',
    // very large circle aoe
    'Matoya Relict Bavarois Thunder III': '5525',
    // circle aoe
    'Matoya Relict Marshmallow Ancient Aero': '5524',
    // very large line groaoe
    'Matoya Relict Pudding Fire II': '5522',
    // circle aoe
    'Matoya Relict Molten Phoebad Hot Lava': '57E9',
    // conal aoe
    'Matoya Relict Molten Phoebad Volcanic Drop': '57E8',
    // circle aoe
    'Matoya Mother Porxie Medium Rear': '591D',
    // knockback into safe circle aoe
    'Matoya Mother Porxie Barbeque Line': '5917',
    // line aoe during bbq
    'Matoya Mother Porxie Barbeque Circle': '5918',
    // circle aoe during bbq
    'Matoya Mother Porxie To A Crisp': '5925',
    // getting to close to boss during bbq
    'Matoya Mother Proxie Buffet': '5926' // Aeolian Cave Sprite line aoe (is this a pun?)

  },
  damageFail: {
    'Matoya Nixie Sea Shanty': '598C' // Not taking the puddle up to the top? Failing add enrage?

  },
  shareWarn: {
    'Matoya Nixie Crack': '5990',
    // Nixie Crash-Smash tank tethers
    'Matoya Nixie Sputter': '5993' // Nixie spread marker

  }
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
    'Gulg Vena Amoris': '3D27'
  },
  damageFail: {
    'Gulg Lumen Infinitum': '41B2',
    'Gulg Right Palm': '37F8',
    'Gulg Left Palm': '37FA'
  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/paglthan.js
 // TODO: What to do about Kahn Rai 5B50?
// It seems impossible for the marked person to avoid entirely.

/* harmony default export */ const paglthan = ({
  zoneId: zone_id/* default.Paglthan */.Z.Paglthan,
  damageWarn: {
    'Paglthan Telovouivre Plague Swipe': '60FC',
    // frontal conal cleave
    'Paglthan Lesser Telodragon Engulfing Flames': '60F5',
    // frontal conal cleave
    'Paglthan Amhuluk Lightning Bolt': '5C4C',
    // circular lightning aoe (on self or post)
    'Paglthan Amhuluk Ball Of Levin Shock': '5C52',
    // pulsing small circular aoes
    'Paglthan Amhuluk Supercharged Ball Of Levin Shock': '5C53',
    // pulsing large circular aoe
    'Paglthan Amhuluk Wide Blaster': '60C5',
    // rear conal cleave
    'Paglthan Telobrobinyak Fall Of Man': '6148',
    // circular aoe
    'Paglthan Telotek Reaper Magitek Cannon': '6121',
    // circular aoe
    'Paglthan Telodragon Sheet of Ice': '60F8',
    // circular aoe
    'Paglthan Telodragon Frost Breath': '60F7',
    // very large conal cleave
    'Paglthan Magitek Core Stable Cannon': '5C94',
    // large line aoes
    'Paglthan Magitek Core 2-Tonze Magitek Missile': '5C95',
    // large circular aoe
    'Paglthan Telotek Sky Armor Aethershot': '5C9C',
    // circular aoe
    'Paglthan Mark II Telotek Colossus Exhaust': '5C99',
    // large line aoe
    'Paglthan Magitek Missile Explosive Force': '5C98',
    // slow moving horizontal missiles
    'Paglthan Tiamat Flamisphere': '610F',
    // very long line aoe
    'Paglthan Armored Telodragon Tortoise Stomp': '614B',
    // large circular aoe from turtle
    'Paglthan Telodragon Thunderous Breath': '6149',
    // large conal cleave
    'Paglthan Lunar Bahamut Lunar Nail Upburst': '605B',
    // small aoes before Big Burst
    'Paglthan Lunar Bahamut Lunar Nail Big Burst': '5B48',
    // large circular aoes from nails
    'Paglthan Lunar Bahamut Perigean Breath': '5B59',
    // large conal cleave
    'Paglthan Lunar Bahamut Megaflare': '5B4E',
    // megaflare pepperoni
    'Paglthan Lunar Bahamut Megaflare Dive': '5B52',
    // megaflare line aoe across the arena
    'Paglthan Lunar Bahamut Lunar Flare': '5B4A' // large purple shrinking circles

  },
  shareWarn: {
    'Paglthan Lunar Bahamut Megaflare': '5B4D' // megaflare spread markers

  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/dungeon/qitana_ravel.js

/* harmony default export */ const qitana_ravel = ({
  zoneId: zone_id/* default.TheQitanaRavel */.Z.TheQitanaRavel,
  damageWarn: {
    'Qitana Sun Toss': '3C8A',
    // Ground AoE, boss one
    'Qitana Ronkan Light 1': '3C8C',
    // Statue attack, boss one
    'Qitana Lozatl\'s Fury 1': '3C8F',
    // Semicircle cleave, boss one
    'Qitana Lozatl\'s Fury 2': '3C90',
    // Semicircle cleave, boss one
    'Qitana Falling Rock': '3C96',
    // Small ground AoE, boss two
    'Qitana Falling Boulder': '3C97',
    // Large ground AoE, boss two
    'Qitana Towerfall': '3C98',
    // Pillar collapse, boss two
    'Qitana Viper Poison 2': '3C9E',
    // Stationary poison puddles, boss three
    'Qitana Confession of Faith 1': '3CA2',
    // Dangerous middle during spread circles, boss three
    'Qitana Confession of Faith 3': '3CA6',
    // Dangerous sides during stack marker, boss three
    'Qitana Confession of Faith 4': '3CA7',
    // Dangerous sides during stack marker, boss three
    'Qitana Ronkan Light 2': '3D6D',
    // Statue attack, boss one
    'Qitana Wrath of the Ronka': '3E2C',
    // Statue line attack from mini-bosses before first boss
    'Qitana Sinspitter': '3E36',
    // Gorilla boulder toss AoE before third boss
    'Qitana Hound out of Heaven': '42B8',
    // Tether extension failure, boss three; 42B7 is correct execution
    'Qitana Ronkan Abyss': '43EB' // Ground AoE from mini-bosses before first boss

  },
  shareWarn: {
    'Qitana Viper Poison 1': '3C9D',
    // AoE from the 00AB poison head marker, boss three
    'Qitana Confession of Faith 2': '3CA3' // Overlapped circles failure on the spread circles version of the mechanic

  }
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
    'Cosmos Fire\'s Domain Tether': '475F'
  },
  shareWarn: {
    'Cosmos Dark Well': '476D',
    'Cosmos Far Wind Spread': '4724',
    'Cosmos Black Flame': '475D',
    'Cosmos Fire\'s Domain': '4760'
  }
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
    'Twinning High Gravity': '3DFA'
  },
  damageFail: {
    'Twinning 128 Tonze Swipe': '3DBA'
  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/eureka/delubrum_reginae.js
 // TODO: Dead Iron 5AB0 (earthshakers, but only if you take two?)

/* harmony default export */ const delubrum_reginae = ({
  zoneId: zone_id/* default.DelubrumReginae */.Z.DelubrumReginae,
  damageWarn: {
    'Delubrum Seeker Mercy Fourfold': '5B34',
    // Four glowing sword half room cleaves
    'Delubrum Seeker Baleful Swathe': '5AB4',
    // Ground aoe to either side of boss
    'Delubrum Seeker Baleful Blade': '5B28',
    // Hide behind pillars attack
    'Delubrum Seeker Iron Splitter Blue 1': '5AA4',
    // Blue ring explosion
    'Delubrum Seeker Iron Splitter Blue 2': '5AA5',
    // Blue ring explosion
    'Delubrum Seeker Iron Splitter Blue 3': '5AA6',
    // Blue ring explosion
    'Delubrum Seeker Iron Splitter White 1': '5AA7',
    // White ring explosion
    'Delubrum Seeker Iron Splitter White 2': '5AA8',
    // White ring explosion
    'Delubrum Seeker Iron Splitter White 3': '5AA9',
    // White ring explosion
    'Delubrum Seeker Scorching Shackle': '5AAE',
    // Chain damage
    'Delubrum Seeker Merciful Breeze': '5AAB',
    // Waffle criss-cross floor markers
    'Delubrum Seeker Merciful Blooms': '5AAD',
    // Purple growing circle
    'Delubrum Dahu Right-Sided Shockwave': '5761',
    // Right circular cleave
    'Delubrum Dahu Left-Sided Shockwave': '5762',
    // Left circular cleave
    'Delubrum Dahu Firebreathe': '5765',
    // Conal breath
    'Delubrum Dahu Firebreathe Rotating': '575A',
    // Conal breath, rotating
    'Delubrum Dahu Head Down': '5756',
    // line aoe charge from Marchosias add
    'Delubrum Dahu Hunter\'s Claw': '5757',
    // circular ground aoe centered on Marchosias add
    'Delubrum Dahu Falling Rock': '575C',
    // ground aoe from Reverberating Roar
    'Delubrum Dahu Hot Charge': '5764',
    // double charge
    'Delubrum Dahu Ripper Claw': '575D',
    // frontal cleave
    'Delubrum Dahu Tail Swing': '575F',
    // tail swing ;)
    'Delubrum Guard Pawn Off': '5806',
    // Queen's Soldier Secrets Revealed tethered clone aoe
    'Delubrum Guard Turret\'s Tour 1': '580D',
    // Queen's Gunner reflective turret shot
    'Delubrum Guard Turret\'s Tour 2': '580E',
    // Queen's Gunner reflective turret shot
    'Delubrum Guard Turret\'s Tour 3': '580F',
    // Queen's Gunner reflective turret shot
    'Delubrum Guard Optimal Play Shield': '57F3',
    // Queen's Knight shield get under
    'Delubrum Guard Optimal Play Sword': '57F2',
    // Queen's Knight sword get out
    'Delubrum Guard Counterplay': '57F6',
    // Hitting aetherial ward directional barrier
    'Delubrum Phantom Swirling Miasma 1': '57A9',
    // Initial phantom donut aoe from circle
    'Delubrum Phantom Swirling Miasma 2': '57AA',
    // Moving phantom donut aoes from circle
    'Delubrum Phantom Creeping Miasma': '57A5',
    // phantom line aoe from square
    'Delubrum Phantom Vile Wave': '57B1',
    // phantom conal aoe
    'Delubrum Avowed Fury Of Bozja': '5973',
    // Trinity Avowed Allegiant Arsenal "out"
    'Delubrum Avowed Flashvane': '5972',
    // Trinity Avowed Allegiant Arsenal "get behind"
    'Delubrum Avowed Infernal Slash': '5971',
    // Trinity Avowed Allegiant Arsenal "get front"
    'Delubrum Avowed Flames Of Bozja': '5968',
    // 80% floor aoe before shimmering shot swords
    'Delubrum Avowed Gleaming Arrow': '5974',
    // Trinity Avatar line aoes from outside
    'Delubrum Queen The Means 1': '59BB',
    // The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen The Means 2': '59BD',
    // The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen The End 1': '59BA',
    // Also The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen The End 2': '59BC',
    // Also The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen Northswain\'s Glow': '59C4',
    // expanding lines with explosion intersections
    'Delubrum Queen Judgment Blade Left': '5B83',
    // dash across room with left cleave
    'Delubrum Queen Judgment Blade Right': '5B83',
    // dash across room with right cleave
    'Delubrum Queen Queen\'s Justice': '59BF',
    // failing to walk the right number of squares
    'Delubrum Queen Turret\'s Tour 1': '59E0',
    // reflective turret shot during Queen
    'Delubrum Queen Turret\'s Tour 2': '59E1',
    // reflective turret shot during Queen
    'Delubrum Queen Turret\'s Tour 3': '59E2',
    // reflective turret shot during Queen
    'Delubrum Queen Pawn Off': '59DA',
    // Secrets Revealed tethered clone aoe during Queen
    'Delubrum Queen Optimal Play Shield': '59CE',
    // Queen's Knight shield get under during Queen
    'Delubrum Queen Optimal Play Sword': '59CC' // Queen's Knight sword get out during Queen

  },
  damageFail: {
    'Delubrum Hidden Trap Massive Explosion': '5A6E',
    // explosion trap
    'Delubrum Hidden Trap Poison Trap': '5A6F',
    // poison trap
    'Delubrum Avowed Heat Shock': '595E',
    // too much heat or failing to regulate temperature
    'Delubrum Avowed Cold Shock': '595F' // too much cold or failing to regulate temperature

  },
  shareFail: {
    'Delubrum Dahu Heat Breath': '5766',
    // tank cleave
    'Delubrum Avowed Wrath Of Bozja': '5975' // tank cleave

  },
  gainsEffectWarn: {
    'Delubrum Seeker Merciful Moon': '262' // "Petrification" from Aetherial Orb lookaway

  },
  triggers: [{
    // At least during The Queen, these ability ids can be ordered differently,
    // and the first explosion "hits" everyone, although with "1B" flags.
    id: 'Delubrum Lots Cast',
    damageRegex: ['565A', '565B', '57FD', '57FE', '5B86', '5B87', '59D2', '5D93'],
    condition: e => e.flags.slice(-2) === '03',
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }]
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
    'DelubrumSav Seeker Slimes Hellish Slash': '57EA',
    // Bozjan Soldier cleave
    'DelubrumSav Seeker Slimes Viscous Rupture': '5016',
    // Fully merged viscous slime aoe
    'DelubrumSav Seeker Golems Demolish': '5880',
    // interruptible Ruins Golem cast
    'DelubrumSav Seeker Baleful Swathe': '5AD1',
    // Ground aoe to either side of boss
    'DelubrumSav Seeker Baleful Blade': '5B2A',
    // Hide behind pillars attack
    'DelubrumSav Seeker Scorching Shackle': '5ACB',
    // Chains
    'DelubrumSav Seeker Mercy Fourfold 1': '5B94',
    // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 2': '5AB9',
    // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 3': '5ABA',
    // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 4': '5ABB',
    // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 5': '5ABC',
    // Four glowing sword half room cleaves
    'DelubrumSav Seeker Merciful Breeze': '5AC8',
    // Waffle criss-cross floor markers
    'DelubrumSav Seeker Baleful Comet': '5AD7',
    // Clone meteor dropping before charges
    'DelubrumSav Seeker Baleful Firestorm': '5AD8',
    // Clone charge after Baleful Comet
    'DelubrumSav Seeker Iron Rose': '5AD9',
    // Clone line aoes
    'DelubrumSav Seeker Iron Splitter Blue 1': '5AC1',
    // Blue rin g explosion
    'DelubrumSav Seeker Iron Splitter Blue 2': '5AC2',
    // Blue ring explosion
    'DelubrumSav Seeker Iron Splitter Blue 3': '5AC3',
    // Blue ring explosion
    'DelubrumSav Seeker Iron Splitter White 1': '5AC4',
    // White ring explosion
    'DelubrumSav Seeker Iron Splitter White 2': '5AC5',
    // White ring explosion
    'DelubrumSav Seeker Iron Splitter White 3': '5AC6',
    // White ring explosion
    'DelubrumSav Seeker Act Of Mercy': '5ACF',
    // cross-shaped line aoes
    'DelubrumSav Dahu Right-Sided Shockwave 1': '5770',
    // Right circular cleave
    'DelubrumSav Dahu Right-Sided Shockwave 2': '5772',
    // Right circular cleave
    'DelubrumSav Dahu Left-Sided Shockwave 1': '576F',
    // Left circular cleave
    'DelubrumSav Dahu Left-Sided Shockwave 2': '5771',
    // Left circular cleave
    'DelubrumSav Dahu Firebreathe': '5774',
    // Conal breath
    'DelubrumSav Dahu Firebreathe Rotating': '576C',
    // Conal breath, rotating
    'DelubrumSav Dahu Head Down': '5768',
    // line aoe charge from Marchosias add
    'DelubrumSav Dahu Hunter\'s Claw': '5769',
    // circular ground aoe centered on Marchosias add
    'DelubrumSav Dahu Falling Rock': '576E',
    // ground aoe from Reverberating Roar
    'DelubrumSav Dahu Hot Charge': '5773',
    // double charge
    'DelubrumSav Duel Massive Explosion': '579E',
    // bombs being cleared
    'DelubrumSav Duel Vicious Swipe': '5797',
    // circular aoe around boss
    'DelubrumSav Duel Focused Tremor 1': '578F',
    // square floor aoes
    'DelubrumSav Duel Focused Tremor 2': '5791',
    // square floor aoes
    'DelubrumSav Duel Devour': '5789',
    // conal aoe after withering curse
    'DelubrumSav Duel Flailing Strike 1': '578C',
    // initial rotating cleave
    'DelubrumSav Duel Flailing Strike 2': '578D',
    // rotating cleaves
    'DelubrumSav Guard Optimal Offensive Sword': '5819',
    // middle explosion
    'DelubrumSav Guard Optimal Offensive Shield': '581A',
    // middle explosion
    'DelubrumSav Guard Optimal Play Sword': '5816',
    // Optimal Play Sword "get out"
    'DelubrumSav Guard Optimal Play Shield': '5817',
    // Optimal play shield "get in"
    'DelubrumSav Guard Optimal Play Cleave': '5818',
    // Optimal Play cleaves for sword/shield
    'DelubrumSav Guard Unlucky Lot': '581D',
    // Queen's Knight orb explosion
    'DelubrumSav Guard Burn 1': '583D',
    // small fire adds
    'DelubrumSav Guard Burn 2': '583E',
    // large fire adds
    'DelubrumSav Guard Pawn Off': '583A',
    // Queen's Soldier Secrets Revealed tethered clone aoe
    'DelubrumSav Guard Turret\'s Tour Normal 1': '5847',
    // "normal mode" turrets, initial lines 1
    'DelubrumSav Guard Turret\'s Tour Normal 2': '5848',
    // "normal mode" turrets, initial lines 2
    'DelubrumSav Guard Turret\'s Tour Normal 3': '5849',
    // "normal mode" turrets, second lines
    'DelubrumSav Guard Counterplay': '58F5',
    // Hitting aetherial ward directional barrier
    'DelubrumSav Phantom Swirling Miasma 1': '57B8',
    // Initial phantom donut aoe
    'DelubrumSav Phantom Swirling Miasma 2': '57B9',
    // Moving phantom donut aoes
    'DelubrumSav Phantom Creeping Miasma 1': '57B4',
    // Initial phantom line aoe
    'DelubrumSav Phantom Creeping Miasma 2': '57B5',
    // Later phantom line aoe
    'DelubrumSav Phantom Lingering Miasma 1': '57B6',
    // Initial phantom circle aoe
    'DelubrumSav Phantom Lingering Miasma 2': '57B7',
    // Moving phantom circle aoe
    'DelubrumSav Phantom Vile Wave': '57BF',
    // phantom conal aoe
    'DelubrumSav Avowed Fury Of Bozja': '594C',
    // Trinity Avowed Allegiant Arsenal "out"
    'DelubrumSav Avowed Flashvane': '594B',
    // Trinity Avowed Allegiant Arsenal "get behind"
    'DelubrumSav Avowed Infernal Slash': '594A',
    // Trinity Avowed Allegiant Arsenal "get front"
    'DelubrumSav Avowed Flames Of Bozja': '5939',
    // 80% floor aoe before shimmering shot swords
    'DelubrumSav Avowed Gleaming Arrow': '594D',
    // Trinity Avatar line aoes from outside
    'DelubrumSav Lord Whack': '57D0',
    // cleave
    'DelubrumSav Lord Devastating Bolt 1': '57C5',
    // lightning rings
    'DelubrumSav Lord Devastating Bolt 2': '57C6',
    // lightning rings
    'DelubrumSav Lord Electrocution': '57CC',
    // random circle aoes
    'DelubrumSav Lord Rapid Bolts': '57C3',
    // dropped lightning aoes
    'DelubrumSav Lord 1111-Tonze Swing': '57D8',
    // very large "get out" swing
    'DelubrumSav Lord Monk Attack': '55A6',
    // Monk add auto-attack
    'DelubrumSav Queen Northswain\'s Glow': '59F4',
    // expanding lines with explosion intersections
    'DelubrumSav Queen The Means 1': '59E7',
    // The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen The Means 2': '59EA',
    // The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen The End 1': '59E8',
    // Also The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen The End 2': '59E9',
    // Also The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen Optimal Offensive Sword': '5A02',
    // middle explosion
    'DelubrumSav Queen Optimal Offensive Shield': '5A03',
    // middle explosion
    'DelubrumSav Queen Judgment Blade Left 1': '59F2',
    // dash across room with left cleave
    'DelubrumSav Queen Judgment Blade Left 2': '5B85',
    // dash across room with left cleave
    'DelubrumSav Queen Judgment Blade Right 1': '59F1',
    // dash across room with right cleave
    'DelubrumSav Queen Judgment Blade Right 2': '5B84',
    // dash across room with right cleave
    'DelubrumSav Queen Pawn Off': '5A1D',
    // Queen's Soldier Secrets Revealed tethered clone aoe
    'DelubrumSav Queen Optimal Play Sword': '59FF',
    // Optimal Play Sword "get out"
    'DelubrumSav Queen Optimal Play Shield': '5A00',
    // Optimal play shield "get in"
    'DelubrumSav Queen Optimal Play Cleave': '5A01',
    // Optimal Play cleaves for sword/shield
    'DelubrumSav Queen Turret\'s Tour Normal 1': '5A28',
    // "normal mode" turrets, initial lines 1
    'DelubrumSav Queen Turret\'s Tour Normal 2': '5A2A',
    // "normal mode" turrets, initial lines 2
    'DelubrumSav Queen Turret\'s Tour Normal 3': '5A29' // "normal mode" turrets, second lines

  },
  damageFail: {
    'DelubrumSav Avowed Heat Shock': '5927',
    // too much heat or failing to regulate temperature
    'DelubrumSav Avowed Cold Shock': '5928',
    // too much cold or failing to regulate temperature
    'DelubrumSav Queen Queen\'s Justice': '59EB',
    // failing to walk the right number of squares
    'DelubrumSav Queen Gunnhildr\'s Blades': '5B22',
    // not being in the chess blue safe square
    'DelubrumSav Queen Unlucky Lot': '55B6' // lightning orb attack

  },
  shareWarn: {
    'DelubrumSav Seeker Phantom Baleful Onslaught': '5AD6',
    // solo tank cleave
    'DelubrumSav Lord Foe Splitter': '57D7' // tank cleave

  },
  gainsEffectWarn: {
    'DelubrumSav Seeker Merciful Moon': '262' // "Petrification" from Aetherial Orb lookaway

  },
  triggers: [{
    // These ability ids can be ordered differently and "hit" people when levitating.
    id: 'DelubrumSav Guard Lots Cast',
    damageRegex: ['5827', '5828', '5B6C', '5B6D', '5BB6', '5BB7', '5B88', '5B89'],
    condition: e => e.flags.slice(-2) === '03',
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    id: 'DelubrumSav Golem Compaction',
    abilityRegex: '5746',
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        fullText: `${matches.source}: ${matches.ability}`
      };
    }
  }, {
    id: 'DelubrumSav Slime Sanguine Fusion',
    abilityRegex: '554D',
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        fullText: `${matches.source}: ${matches.ability}`
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e1n.js

/* harmony default export */ const e1n = ({
  zoneId: zone_id/* default.EdensGateResurrection */.Z.EdensGateResurrection,
  damageWarn: {
    'E1N Eden\'s Thunder III': '44ED',
    'E1N Eden\'s Blizzard III': '44EC',
    'E1N Pure Beam': '3D9E',
    'E1N Paradise Lost': '3DA0'
  },
  damageFail: {
    'E1N Eden\'s Flare': '3D97',
    'E1N Pure Light': '3DA3'
  },
  triggers: [// Things that should only hit one person.
  {
    id: 'E1N Fire III',
    damageRegex: '44EB',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'E1N Tank Lasers',
    // Vice Of Vanity
    damageRegex: '44E7',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'E1N DPS Puddles',
    // Vice Of Apathy
    damageRegex: '44E8',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
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
    'E1S Paradise Lost': '3D87'
  },
  damageFail: {
    'E1S Eden\'s Flare': '3D73',
    'E1S Pure Light': '3D8A'
  },
  triggers: [// Things that should only hit one person.
  {
    id: 'E1S Fire/Thunder III',
    damageRegex: '44FB',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'E1S Pure Beam Single',
    damageRegex: '3D81',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'E1S Tank Lasers',
    // Vice Of Vanity
    damageRegex: '44F1',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'E1S DPS Puddles',
    // Vice Of Apathy
    damageRegex: '44F2',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
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
    'E2N Doomvoid Guillotine': '3E3B'
  },
  triggers: [{
    id: 'E2N Nyx',
    damageRegex: '3E3D',
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: {
          en: 'Booped',
          de: e.abilityName,
          fr: 'Malus de dégâts',
          ja: e.abilityName,
          cn: e.abilityName,
          ko: '닉스'
        }
      };
    }
  }]
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
    'E3S Doomvoid Guillotine': '3E4F'
  },
  shareWarn: {
    'E2S Doomvoid Cleaver': '3E64'
  },
  triggers: [{
    id: 'E2S Shadoweye',
    // Stone Curse
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '589'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    id: 'E2S Nyx',
    damageRegex: '3E51',
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: {
          en: 'Booped',
          de: e.abilityName,
          fr: 'Malus de dégâts',
          ja: e.abilityName,
          cn: '攻击伤害降低',
          ko: '닉스'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e3n.js

/* harmony default export */ const e3n = ({
  zoneId: zone_id/* default.EdensGateInundation */.Z.EdensGateInundation,
  damageWarn: {
    'E3N Monster Wave 1': '3FCA',
    'E3N Monster Wave 2': '3FE9',
    'E3N Maelstrom': '3FD9',
    'E3N Swirling Tsunami': '3FD5'
  },
  damageFail: {
    'E3N Temporary Current 1': '3FCE',
    'E3N Temporary Current 2': '3FCD',
    'E3N Spinning Dive': '3FDB'
  },
  triggers: [{
    id: 'E3N Rip Current',
    damageRegex: '3FC7',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
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
    'E3S Swirling Tsunami': '3FF4'
  },
  damageFail: {
    'E3S Temporary Current 1': '3FEA',
    'E3S Temporary Current 2': '3FEB',
    'E3S Temporary Current 3': '3FEC',
    'E3S Temporary Current 4': '3FED',
    'E3S Spinning Dive': '3FFD'
  }
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
    'E4N Fault Line': '4101'
  }
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
    'E4S Seismic Wave': '4110'
  },
  damageFail: {
    'E4S Dual Earthen Fists 1': '4135',
    'E4S Dual Earthen Fists 2': '4687',
    'E4S Plate Fracture': '43EA',
    'E4S Earthen Fist 1': '43CA',
    'E4S Earthen Fist 2': '43C9'
  },
  triggers: [{
    id: 'E4S Fault Line Collect',
    netRegex: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '411E',
      source: 'Titan'
    }),
    netRegexDe: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '411E',
      source: 'Titan'
    }),
    netRegexFr: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '411E',
      source: 'Titan'
    }),
    netRegexJa: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '411E',
      source: 'タイタン'
    }),
    netRegexCn: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '411E',
      source: '泰坦'
    }),
    netRegexKo: netregexes/* default.startsUsing */.Z.startsUsing({
      id: '411E',
      source: '타이탄'
    }),
    run: (_e, data, matches) => {
      data.faultLineTarget = matches.target;
    }
  }, {
    id: 'E4S Fault Line',
    damageRegex: '411E',
    condition: (e, data) => data.faultLineTarget !== e.targetName,
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: {
          en: 'Run Over',
          de: e.abilityName,
          fr: 'A été écrasé(e)',
          ja: e.abilityName,
          cn: e.abilityName,
          ko: e.abilityName
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e5n.js


/* harmony default export */ const e5n = ({
  zoneId: zone_id/* default.EdensVerseFulmination */.Z.EdensVerseFulmination,
  damageWarn: {
    'E5N Impact': '4E3A',
    // Stratospear landing AoE
    'E5N Lightning Bolt': '4B9C',
    // Stormcloud standard attack
    'E5N Gallop': '4B97',
    // Sideways add charge
    'E5N Shock Strike': '4BA1',
    // Small AoE circles during Thunderstorm
    'E5N Volt Strike': '4CF2' // Large AoE circles during Thunderstorm

  },
  damageFail: {
    'E5N Judgment Jolt': '4B8F' // Stratospear explosions

  },
  triggers: [{
    // This happens when a player gets 4+ stacks of orbs. Don't be greedy!
    id: 'E5N Static Condensation',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '8B5'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    // Helper for orb pickup failures
    id: 'E5N Orb Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '8B4'
    }),
    run: (_e, data, matches) => {
      data.hasOrb = data.hasOrb || {};
      data.hasOrb[matches.target] = true;
    }
  }, {
    id: 'E5N Orb Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '8B4'
    }),
    run: (_e, data, matches) => {
      data.hasOrb = data.hasOrb || {};
      data.hasOrb[matches.target] = false;
    }
  }, {
    id: 'E5N Divine Judgement Volts',
    damageRegex: '4B9A',
    condition: (e, data) => !data.hasOrb[e.targetName],
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: {
          en: e.abilityName + ' (no orb)',
          de: e.abilityName + ' (kein Orb)',
          fr: e.abilityName + '(pas d\'orbe)',
          ja: e.abilityName + '(雷玉無し)',
          cn: e.abilityName + '(没吃球)'
        }
      };
    }
  }, {
    id: 'E5N Stormcloud Target Tracking',
    netRegex: netregexes/* default.headMarker */.Z.headMarker({
      id: '006E'
    }),
    run: (_e, data, matches) => {
      data.cloudMarkers = data.cloudMarkers || [];
      data.cloudMarkers.push(matches.target);
    }
  }, {
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
            cn: e.abilityName + '(雷云重叠)'
          }
        };
      }
    }
  }, {
    id: 'E5N Stormcloud cleanup',
    netRegex: netregexes/* default.headMarker */.Z.headMarker({
      id: '006E'
    }),
    delaySeconds: 30,
    // Stormclouds resolve well before this.
    run: (_e, data) => {
      delete data.cloudMarkers;
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e5s.js

 // TODO: is there a different ability if the shield duty action isn't used properly?
// TODO: is there an ability from Raiden (the bird) if you get eaten?
// TODO: maybe chain lightning warning if you get hit while you have system shock (8B8)

const noOrb = str => {
  return {
    en: str + ' (no orb)',
    de: str + ' (kein Orb)',
    fr: str + ' (pas d\'orbe)',
    ja: str + ' (雷玉無し)',
    cn: str + ' (没吃球)',
    ko: str + ' (구슬 없음)'
  };
};

/* harmony default export */ const e5s = ({
  zoneId: zone_id/* default.EdensVerseFulminationSavage */.Z.EdensVerseFulminationSavage,
  damageWarn: {
    'E5S Impact': '4E3B',
    // Stratospear landing AoE
    'E5S Gallop': '4BB4',
    // Sideways add charge
    'E5S Shock Strike': '4BC1',
    // Small AoE circles during Thunderstorm
    'E5S Stepped Leader Twister': '4BC7',
    // Twister stepped leader
    'E5S Stepped Leader Donut': '4BC8',
    // Donut stepped leader
    'E5S Shock': '4E3D' // Hated of Levin Stormcloud-cleansable exploding debuff

  },
  damageFail: {
    'E5S Judgment Jolt': '4BA7' // Stratospear explosions

  },
  shareWarn: {
    'E5S Volt Strike Double': '4BC3',
    // Large AoE circles during Thunderstorm
    'E5S Crippling Blow': '4BCA',
    'E5S Chain Lightning Double': '4BC5'
  },
  triggers: [{
    // Helper for orb pickup failures
    id: 'E5S Orb Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '8B4'
    }),
    run: (_e, data, matches) => {
      data.hasOrb = data.hasOrb || {};
      data.hasOrb[matches.target] = true;
    }
  }, {
    id: 'E5S Orb Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '8B4'
    }),
    run: (_e, data, matches) => {
      data.hasOrb = data.hasOrb || {};
      data.hasOrb[matches.target] = false;
    }
  }, {
    id: 'E5S Divine Judgement Volts',
    damageRegex: '4BB7',
    condition: (e, data) => !data.hasOrb || !data.hasOrb[e.targetName],
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: noOrb(e.abilityName)
      };
    }
  }, {
    id: 'E5S Volt Strike Orb',
    damageRegex: '4BC3',
    condition: (e, data) => !data.hasOrb || !data.hasOrb[e.targetName],
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: noOrb(e.abilityName)
      };
    }
  }, {
    id: 'E5S Deadly Discharge Big Knockback',
    damageRegex: '4BB2',
    condition: (e, data) => !data.hasOrb || !data.hasOrb[e.targetName],
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: noOrb(e.abilityName)
      };
    }
  }, {
    id: 'E5S Lightning Bolt',
    damageRegex: '4BB9',
    condition: (e, data) => {
      // Having a non-idempotent condition function is a bit <_<
      // Only consider lightning bolt damage if you have a debuff to clear.
      if (!data.hated || !data.hated[e.targetName]) return true;
      delete data.hated[e.targetName];
      return false;
    },
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'E5S Hated of Levin',
    netRegex: netregexes/* default.headMarker */.Z.headMarker({
      id: '00D2'
    }),
    run: (_e, data, matches) => {
      data.hated = data.hated || {};
      data.hated[matches.target] = true;
    }
  }, {
    id: 'E5S Stormcloud Target Tracking',
    netRegex: netregexes/* default.headMarker */.Z.headMarker({
      id: '006E'
    }),
    run: (_e, data, matches) => {
      data.cloudMarkers = data.cloudMarkers || [];
      data.cloudMarkers.push(matches.target);
    }
  }, {
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
            cn: e.abilityName + '(雷云重叠)'
          }
        };
      }
    }
  }, {
    id: 'E5S Stormcloud cleanup',
    netRegex: netregexes/* default.headMarker */.Z.headMarker({
      id: '006E'
    }),
    // Stormclouds resolve well before this.
    delaySeconds: 30,
    run: (_e, data) => {
      delete data.cloudMarkers;
      delete data.hated;
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e6n.js

/* harmony default export */ const e6n = ({
  zoneId: zone_id/* default.EdensVerseFuror */.Z.EdensVerseFuror,
  damageWarn: {
    'E6N Thorns': '4BDA',
    // AoE markers after Enumeration
    'E6N Ferostorm 1': '4BDD',
    'E6N Ferostorm 2': '4BE5',
    'E6N Storm Of Fury 1': '4BE0',
    // Circle AoE during tethers--Garuda
    'E6N Storm Of Fury 2': '4BE6',
    // Circle AoE during tethers--Raktapaksa
    'E6N Explosion': '4BE2',
    // AoE circles, Garuda orbs
    'E6N Heat Burst': '4BEC',
    'E6N Conflag Strike': '4BEE',
    // 270-degree frontal AoE
    'E6N Spike Of Flame': '4BF0',
    // Orb explosions after Strike Spark
    'E6N Radiant Plume': '4BF2',
    'E6N Eruption': '4BF4'
  },
  damageFail: {
    'E6N Vacuum Slice': '4BD5',
    // Dark line AoE from Garuda
    'E6N Downburst': '4BDB' // Blue knockback circle. Actual knockback is unknown ability 4C20

  },
  shareFail: {
    // Kills non-tanks who get hit by it.
    'E6N Instant Incineration': '4BED'
  }
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
    'E6S Thorns': '4BFA',
    // AoE markers after Enumeration
    'E6S Ferostorm 1': '4BFD',
    'E6S Ferostorm 2': '4C06',
    'E6S Storm Of Fury 1': '4C00',
    // Circle AoE during tethers--Garuda
    'E6S Storm Of Fury 2': '4C07',
    // Circle AoE during tethers--Raktapaksa
    'E6S Explosion': '4C03',
    // AoE circles, Garuda orbs
    'E6S Heat Burst': '4C1F',
    'E6S Conflag Strike': '4C10',
    // 270-degree frontal AoE
    'E6S Radiant Plume': '4C15',
    'E6S Eruption': '4C17',
    'E6S Wind Cutter': '4C02' // Tether-cutting line aoe

  },
  damageFail: {
    'E6S Vacuum Slice': '4BF5',
    // Dark line AoE from Garuda
    'E6S Downburst 1': '4BFB',
    // Blue knockback circle (Garuda).
    'E6S Downburst 2': '4BFC',
    // Blue knockback circle (Raktapaksa).
    'E6S Meteor Strike': '4C0F' // Frontal avoidable tank buster

  },
  shareWarn: {
    'E6S Hands of Hell': '4C0[BC]',
    // Tether charge
    'E6S Hands of Flame': '4C0A',
    // First Tankbuster
    'E6S Instant Incineration': '4C0E',
    // Second Tankbuster
    'E6S Blaze': '4C1B' // Flame Tornado Cleave

  },
  triggers: [{
    id: 'E6S Air Bump',
    damageRegex: '4BF9',
    condition: e => {
      // Needs to be taken with friends.
      // This can't tell if you have 2 or >2.
      return e.type === '15';
    },
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e7n.js



const wrongBuff = str => {
  return {
    en: str + ' (wrong buff)',
    de: str + ' (falscher Buff)',
    fr: str + ' (mauvais buff)',
    ja: str + ' (不適切なバフ)',
    cn: str + ' (Buff错了)',
    ko: str + ' (버프 틀림)'
  };
};

const noBuff = str => {
  return {
    en: str + ' (no buff)',
    de: str + ' (kein Buff)',
    fr: str + ' (pas de buff)',
    ja: str + ' (バフ無し)',
    cn: str + ' (没有Buff)',
    ko: str + '(버프 없음)'
  };
};

/* harmony default export */ const e7n = ({
  zoneId: zone_id/* default.EdensVerseIconoclasm */.Z.EdensVerseIconoclasm,
  damageWarn: {
    'E7N Stygian Sword': '4C55',
    // Circle ground AoEs after False Twilight
    'E7N Strength In Numbers Donut': '4C4C',
    // Large donut ground AoEs, intermission
    'E7N Strength In Numbers 2': '4C4D' // Large circle ground AoEs, intermission

  },
  damageFail: {},
  triggers: [{
    id: 'E7N Stygian Stake',
    // Laser tank buster, outside intermission phase
    damageRegex: '4C33',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'E5N Silver Shot',
    // Spread markers, intermission
    damageRegex: '4E7D',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'E7N Astral Effect Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '8BE'
    }),
    run: (_e, data, matches) => {
      data.hasAstral = data.hasAstral || {};
      data.hasAstral[matches.target] = true;
    }
  }, {
    id: 'E7N Astral Effect Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '8BE'
    }),
    run: (_e, data, matches) => {
      data.hasAstral = data.hasAstral || {};
      data.hasAstral[matches.target] = false;
    }
  }, {
    id: 'E7N Umbral Effect Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '8BF'
    }),
    run: (_e, data, matches) => {
      data.hasUmbral = data.hasUmbral || {};
      data.hasUmbral[matches.target] = true;
    }
  }, {
    id: 'E7N Umbral Effect Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '8BF'
    }),
    run: (_e, data, matches) => {
      data.hasUmbral = data.hasUmbral || {};
      data.hasUmbral[matches.target] = false;
    }
  }, {
    id: 'E7N Light\'s Course',
    damageRegex: ['4C3E', '4C40', '4C22', '4C3C', '4E63'],
    condition: (e, data) => {
      return !data.hasUmbral || !data.hasUmbral[e.targetName];
    },
    mistake: (e, data) => {
      if (data.hasAstral && data.hasAstral[e.targetName]) return {
        type: 'fail',
        blame: e.targetName,
        text: wrongBuff(e.abilityName)
      };
      return {
        type: 'warn',
        blame: e.targetName,
        text: noBuff(e.abilityName)
      };
    }
  }, {
    id: 'E7N Darks\'s Course',
    damageRegex: ['4C3D', '4C23', '4C41', '4C43'],
    condition: (e, data) => {
      return !data.hasAstral || !data.hasAstral[e.targetName];
    },
    mistake: (e, data) => {
      if (data.hasUmbral && data.hasUmbral[e.targetName]) return {
        type: 'fail',
        blame: e.targetName,
        text: wrongBuff(e.abilityName)
      }; // This case is probably impossible, as the debuff ticks after death,
      // but leaving it here in case there's some rez or disconnect timing
      // that could lead to this.

      return {
        type: 'warn',
        blame: e.targetName,
        text: noBuff(e.abilityName)
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e7s.js

 // TODO: missing an orb during tornado phase
// TODO: jumping in the tornado damage??
// TODO: taking sungrace(4C80) or moongrace(4C82) with wrong debuff
// TODO: stygian spear/silver spear with the wrong debuff
// TODO: taking explosion from the wrong Chiaro/Scuro orb
// TODO: handle 4C89 Silver Stake tankbuster 2nd hit, as it's ok to have two in.

const e7s_wrongBuff = str => {
  return {
    en: str + ' (wrong buff)',
    de: str + ' (falscher Buff)',
    fr: str + ' (mauvais buff)',
    ja: str + ' (不適切なバフ)',
    cn: str + ' (Buff错了)',
    ko: str + ' (버프 틀림)'
  };
};

const e7s_noBuff = str => {
  return {
    en: str + ' (no buff)',
    de: str + ' (kein Buff)',
    fr: str + ' (pas de buff)',
    ja: str + ' (バフ無し)',
    cn: str + ' (没有Buff)',
    ko: str + ' (버프 없음)'
  };
};

/* harmony default export */ const e7s = ({
  zoneId: zone_id/* default.EdensVerseIconoclasmSavage */.Z.EdensVerseIconoclasmSavage,
  damageWarn: {
    'E7S Silver Sword': '4C8E',
    // ground aoe
    'E7S Overwhelming Force': '4C73',
    // add phase ground aoe
    'E7S Strength in Numbers 1': '4C70',
    // add get under
    'E7S Strength in Numbers 2': '4C71',
    // add get out
    'E7S Paper Cut': '4C7D',
    // tornado ground aoes
    'E7S Buffet': '4C77' // tornado ground aoes also??

  },
  damageFail: {
    'E7S Betwixt Worlds': '4C6B',
    // purple ground line aoes
    'E7S Crusade': '4C58',
    // blue knockback circle (standing in it)
    'E7S Explosion': '4C6F' // didn't kill an add

  },
  triggers: [{
    // Laser tank buster 1
    id: 'E7S Stygian Stake',
    damageRegex: '4C34',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    // Spread markers
    id: 'E7S Silver Shot',
    damageRegex: '4C92',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    // Ice markers
    id: 'E7S Silver Scourge',
    damageRegex: '4C93',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    // Orb Explosion
    id: 'E7S Chiaro Scuro Explosion',
    damageRegex: '4D1[45]',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    // Interrupt
    id: 'E7S Advent Of Light',
    abilityRegex: '4C6E',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'E7S Astral Effect Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '8BE'
    }),
    run: (_e, data, matches) => {
      data.hasAstral = data.hasAstral || {};
      data.hasAstral[matches.target] = true;
    }
  }, {
    id: 'E7S Astral Effect Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '8BE'
    }),
    run: (_e, data, matches) => {
      data.hasAstral = data.hasAstral || {};
      data.hasAstral[matches.target] = false;
    }
  }, {
    id: 'E7S Umbral Effect Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '8BF'
    }),
    run: (_e, data, matches) => {
      data.hasUmbral = data.hasUmbral || {};
      data.hasUmbral[matches.target] = true;
    }
  }, {
    id: 'E7S Umbral Effect Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '8BF'
    }),
    run: (_e, data, matches) => {
      data.hasUmbral = data.hasUmbral || {};
      data.hasUmbral[matches.target] = false;
    }
  }, {
    id: 'E7S Light\'s Course',
    damageRegex: ['4C62', '4C63', '4C64', '4C5B', '4C5F'],
    condition: (e, data) => {
      return !data.hasUmbral || !data.hasUmbral[e.targetName];
    },
    mistake: (e, data) => {
      if (data.hasAstral && data.hasAstral[e.targetName]) return {
        type: 'fail',
        blame: e.targetName,
        text: e7s_wrongBuff(e.abilityName)
      };
      return {
        type: 'warn',
        blame: e.targetName,
        text: e7s_noBuff(e.abilityName)
      };
    }
  }, {
    id: 'E7S Darks\'s Course',
    damageRegex: ['4C65', '4C66', '4C67', '4C5A', '4C60'],
    condition: (e, data) => {
      return !data.hasAstral || !data.hasAstral[e.targetName];
    },
    mistake: (e, data) => {
      if (data.hasUmbral && data.hasUmbral[e.targetName]) return {
        type: 'fail',
        blame: e.targetName,
        text: e7s_wrongBuff(e.abilityName)
      }; // This case is probably impossible, as the debuff ticks after death,
      // but leaving it here in case there's some rez or disconnect timing
      // that could lead to this.

      return {
        type: 'warn',
        blame: e.targetName,
        text: e7s_noBuff(e.abilityName)
      };
    }
  }, {
    id: 'E7S Crusade Knockback',
    // 4C76 is the knockback damage, 4C58 is the damage for standing on the puck.
    damageRegex: '4C76',
    deathReason: e => {
      return {
        type: 'fail',
        name: e.targetName,
        reason: {
          en: 'Knocked off',
          de: 'Runtergefallen',
          fr: 'A été assommé(e)',
          ja: 'ノックバック',
          cn: '击退坠落'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e8n.js


/* harmony default export */ const e8n = ({
  zoneId: zone_id/* default.EdensVerseRefulgence */.Z.EdensVerseRefulgence,
  damageWarn: {
    'E8N Biting Frost': '4DDB',
    // 270-degree frontal AoE, Shiva
    'E8N Driving Frost': '4DDC',
    // Rear cone AoE, Shiva
    'E8N Frigid Stone': '4E66',
    // Small spread circles, phase 1
    'E8N Reflected Axe Kick': '4E00',
    // Large circle AoE, Frozen Mirror
    'E8N Reflected Scythe Kick': '4E01',
    // Donut AoE, Frozen Mirror
    'E8N Frigid Eruption': '4E09',
    // Small circle AoE puddles, phase 1
    'E8N Icicle Impact': '4E0A',
    // Large circle AoE puddles, phase 1
    'E8N Axe Kick': '4DE2',
    // Large circle AoE, Shiva
    'E8N Scythe Kick': '4DE3',
    // Donut AoE, Shiva
    'E8N Reflected Biting Frost': '4DFE',
    // 270-degree frontal AoE, Frozen Mirror
    'E8N Reflected Driving Frost': '4DFF' // Cone AoE, Frozen Mirror

  },
  damageFail: {},
  triggers: [{
    id: 'E8N Shining Armor',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '95'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    id: 'E8N Heavenly Strike',
    damageRegex: '4DD8',
    deathReason: e => {
      return {
        type: 'fail',
        name: e.targetName,
        reason: {
          en: 'Pushed off!',
          de: 'Runter gestoßen!',
          fr: 'A été poussé(e) !',
          ja: 'ノックバック',
          cn: '击退坠落',
          ko: '넉백됨!'
        }
      };
    }
  }, {
    id: 'E8N Frost Armor',
    // Thin Ice
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '38F'
    }),
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
          ko: '미끄러짐!'
        }
      };
    }
  }]
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
    'E8S Biting Frost': '4D66',
    // 270-degree frontal AoE, Shiva
    'E8S Driving Frost': '4D67',
    // Rear cone AoE, Shiva
    'E8S Axe Kick': '4D6D',
    // Large circle AoE, Shiva
    'E8S Scythe Kick': '4D6E',
    // Donut AoE, Shiva
    'E8S Reflected Axe Kick': '4DB9',
    // Large circle AoE, Frozen Mirror
    'E8S Reflected Scythe Kick': '4DBA',
    // Donut AoE, Frozen Mirror
    'E8S Frigid Eruption': '4D9F',
    // Small circle AoE puddles, phase 1
    'E8S Frigid Needle': '4D9D',
    // 8-way "flower" explosion
    'E8S Icicle Impact': '4DA0',
    // Large circle AoE puddles, phase 1
    'E8S Reflected Biting Frost 1': '4DB7',
    // 270-degree frontal AoE, Frozen Mirror
    'E8S Reflected Biting Frost 2': '4DC3',
    // 270-degree frontal AoE, Frozen Mirror
    'E8S Reflected Driving Frost 1': '4DB8',
    // Cone AoE, Frozen Mirror
    'E8S Reflected Driving Frost 2': '4DC4',
    // Cone AoE, Frozen Mirror
    'E8S Hallowed Wings 1': '4D75',
    // Left cleave
    'E8S Hallowed Wings 2': '4D76',
    // Right cleave
    'E8S Hallowed Wings 3': '4D77',
    // Knockback frontal cleave
    'E8S Reflected Hallowed Wings 1': '4D90',
    // Reflected left 2
    'E8S Reflected Hallowed Wings 2': '4DBB',
    // Reflected left 1
    'E8S Reflected Hallowed Wings 3': '4DC7',
    // Reflected right 2
    'E8S Reflected Hallowed Wings 4': '4D91',
    // Reflected right 1
    'E8S Twin Stillness 1': '4D68',
    'E8S Twin Stillness 2': '4D6B',
    'E8S Twin Silence 1': '4D69',
    'E8S Twin Silence 2': '4D6A',
    'E8S Akh Rhai': '4D99',
    'E8S Embittered Dance 1': '4D70',
    'E8S Embittered Dance 2': '4D71',
    'E8S Spiteful Dance 1': '4D6F',
    'E8S Spiteful Dance 2': '4D72'
  },
  damageFail: {
    // Broken tether.
    'E8S Refulgent Fate': '4DA4',
    // Shared orb, correct is Bright Pulse (4D95)
    'E8S Blinding Pulse': '4D96'
  },
  triggers: [{
    id: 'E8S Shining Armor',
    // Stun
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '95'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    // Interrupt
    id: 'E8S Stoneskin',
    abilityRegex: '4D85',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    // Protean
    id: 'E8S Path of Light',
    damageRegex: '4DA1',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e9n.js

/* harmony default export */ const e9n = ({
  zoneId: zone_id/* default.EdensPromiseUmbra */.Z.EdensPromiseUmbra,
  damageWarn: {
    'E9N The Art Of Darkness 1': '5223',
    // left-right cleave
    'E9N The Art Of Darkness 2': '5224',
    // left-right cleave
    'E9N Wide-Angle Particle Beam': '5AFF',
    // frontal cleave tutorial mechanic
    'E9N Wide-Angle Phaser': '55E1',
    // wide-angle "sides"
    'E9N Bad Vibrations': '55E6',
    // tethered outside giant tree ground aoes
    'E9N Earth-Shattering Particle Beam': '5225',
    // missing towers?
    'E9N Anti-Air Particle Beam': '55DC',
    // "get out" during panels
    'E9N Zero-Form Particle Beam 2': '55DB' // Clone line aoes w/ Anti-Air Particle Beam

  },
  damageFail: {
    'E9N Withdraw': '5534',
    // Slow to break seed chain, get sucked back in yikes
    'E9N Aetherosynthesis': '5535' // Standing on seeds during explosion (possibly via Withdraw)

  },
  shareWarn: {
    'E9N Zero-Form Particle Beam 1': '55EB' // tank laser with marker

  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e9s.js
 // TODO: 561D Evil Seed hits everyone, hard to know if there's a double tap
// TODO: falling through panel just does damage with no ability name, like a death wall
// TODO: what happens if you jump in seed thorns?

/* harmony default export */ const e9s = ({
  zoneId: zone_id/* default.EdensPromiseUmbraSavage */.Z.EdensPromiseUmbraSavage,
  damageWarn: {
    'E9S Bad Vibrations': '561C',
    // tethered outside giant tree ground aoes
    'E9S Wide-Angle Particle Beam': '5B00',
    // anti-air "sides"
    'E9S Wide-Angle Phaser Unlimited': '560E',
    // wide-angle "sides"
    'E9S Anti-Air Particle Beam': '5B01',
    // wide-angle "out"
    'E9S The Second Art Of Darkness 1': '5601',
    // left-right cleave
    'E9S The Second Art Of Darkness 2': '5602',
    // left-right cleave
    'E9S The Art Of Darkness 1': '5A95',
    // boss left-right summon/panel cleave
    'E9S The Art Of Darkness 2': '5A96',
    // boss left-right summon/panel cleave
    'E9S The Art Of Darkness Clone 1': '561E',
    // clone left-right summon cleave
    'E9S The Art Of Darkness Clone 2': '561F',
    // clone left-right summon cleave
    'E9S The Third Art Of Darkness 1': '5603',
    // third art left-right cleave initial
    'E9S The Third Art Of Darkness 2': '5604',
    // third art left-right cleave initial
    'E9S Art Of Darkness': '5606',
    // third art left-right cleave final
    'E9S Full-Perimiter Particle Beam': '5629',
    // panel "get in"
    'E9S Dark Chains': '5FAC' // Slow to break partner chains

  },
  damageFail: {
    'E9S Withdraw': '561A',
    // Slow to break seed chain, get sucked back in yikes
    'E9S Aetherosynthesis': '561B' // Standing on seeds during explosion (possibly via Withdraw)

  },
  shareWarn: {
    'E9S Hyper-Focused Particle Beam': '55FD' // Art Of Darkness protean

  },
  shareFail: {
    'E9S Condensed Wide-Angle Particle Beam': '5610' // wide-angle "tank laser"

  },
  gainsEffectWarn: {
    'E9S Stygian Tendrils': '952' // standing in the brambles

  },
  triggers: [{
    // Art Of Darkness Partner Stack
    id: 'E9S Multi-Pronged Particle Beam',
    damageRegex: '5600',
    condition: e => e.type === '15',
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
          ko: `${matches.ability} (혼자 맞음)`
        }
      };
    }
  }, {
    // Anti-air "tank spread".  This can be stacked by two tanks invulning.
    // Note: this will still show something for holmgang/living, but
    // arguably a healer might need to do something about that, so maybe
    // it's ok to still show as a warning??
    id: 'E9S Condensed Anti-Air Particle Beam',
    damageRegex: '5615',
    condition: e => e.type !== '15' && e.damage > 0,
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    // Anti-air "out".  This can be invulned by a tank along with the spread above.
    id: 'E9S Anti-Air Phaser Unlimited',
    damageRegex: '5612',
    condition: e => e.damage > 0,
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e10n.js

/* harmony default export */ const e10n = ({
  zoneId: zone_id/* default.EdensPromiseLitany */.Z.EdensPromiseLitany,
  damageWarn: {
    'E10N Forward Implosion': '56B4',
    // howl boss implosion
    'E10N Forward Shadow Implosion': '56B5',
    // howl shadow implosion
    'E10N Backward Implosion': '56B7',
    // tail boss implosion
    'E10N Backward Shadow Implosion': '56B8',
    // tail shadow implosion
    'E10N Barbs Of Agony 1': '56D9',
    // Shadow Warrior 3 dog room cleave
    'E10N Barbs Of Agony 2': '5B26',
    // Shadow Warrior 3 dog room cleave
    'E10N Cloak Of Shadows': '5B11',
    // non-squiggly line explosions
    'E10N Throne Of Shadow': '56C7',
    // standing up get out
    'E10N Right Giga Slash': '56AE',
    // boss right giga slash
    'E10N Right Shadow Slash': '56AF',
    // giga slash from shadow
    'E10N Left Giga Slash': '56B1',
    // boss left giga slash
    'E10N Left Shadow Slash': '56BD',
    // giga slash from shadow
    'E10N Shadowy Eruption': '56E1' // baited ground aoe markers paired with barbs

  },
  shareWarn: {
    'E10N Shadow\'s Edge': '56DB' // Tankbuster single target followup

  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e10s.js

 // TODO: hitting shadow of the hero with abilities can cause you to take damage, list those?
//       e.g. picking up your first pitch bog puddle will cause you to die to the damage
//       your shadow takes from Deepshadow Nova or Distant Scream.
// TODO: 573B Blighting Blitz issues during limit cut numbers

/* harmony default export */ const e10s = ({
  zoneId: zone_id/* default.EdensPromiseLitanySavage */.Z.EdensPromiseLitanySavage,
  damageWarn: {
    'E10S Implosion Single 1': '56F2',
    // single tail up shadow implosion
    'E10S Implosion Single 2': '56EF',
    // single howl shadow implosion
    'E10S Implosion Quadruple 1': '56EF',
    // quadruple set of shadow implosions
    'E10S Implosion Quadruple 2': '56F2',
    // quadruple set of shadow implosions
    'E10S Giga Slash Single 1': '56EC',
    // Giga slash single from shadow
    'E10S Giga Slash Single 2': '56ED',
    // Giga slash single from shadow
    'E10S Giga Slash Box 1': '5709',
    // Giga slash box from four ground shadows
    'E10S Giga Slash Box 2': '570D',
    // Giga slash box from four ground shadows
    'E10S Giga Slash Quadruple 1': '56EC',
    // quadruple set of giga slash cleaves
    'E10S Giga Slash Quadruple 2': '56E9',
    // quadruple set of giga slash cleaves
    'E10S Cloak Of Shadows 1': '5B13',
    // initial non-squiggly line explosions
    'E10S Cloak Of Shadows 2': '5B14',
    // second squiggly line explosions
    'E10S Throne Of Shadow': '5717',
    // standing up get out
    'E10S Shadowy Eruption': '5738' // baited ground aoe during amplifier

  },
  damageFail: {
    'E10S Swath Of Silence 1': '571A',
    // Shadow clone cleave (too close)
    'E10S Swath Of Silence 2': '5BBF' // Shadow clone cleave (timed)

  },
  shareWarn: {
    'E10S Shadefire': '5732',
    // purple tank umbral orbs
    'E10S Pitch Bog': '5722' // marker spread that drops a shadow puddle

  },
  shareFail: {
    'E10S Shadow\'s Edge': '5725' // Tankbuster single target followup

  },
  triggers: [{
    id: 'E10S Damage Down Orbs',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      source: 'Flameshadow',
      effectId: '82C'
    }),
    netRegexDe: netregexes/* default.gainsEffect */.Z.gainsEffect({
      source: 'Schattenflamme',
      effectId: '82C'
    }),
    netRegexFr: netregexes/* default.gainsEffect */.Z.gainsEffect({
      source: 'Flamme ombrale',
      effectId: '82C'
    }),
    netRegexJa: netregexes/* default.gainsEffect */.Z.gainsEffect({
      source: 'シャドウフレイム',
      effectId: '82C'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'damage',
        blame: matches.target,
        text: `${matches.effect} (partial stack)`
      };
    }
  }, {
    id: 'E10S Damage Down Boss',
    // Shackles being messed up appear to just give the Damage Down, with nothing else.
    // Messing up towers is the Thrice-Come Ruin effect (9E2), but also Damage Down.
    // TODO: some of these will be duplicated with others, like `E10S Throne Of Shadow`.
    // Maybe it'd be nice to figure out how to put the damage marker on that?
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      source: 'Shadowkeeper',
      effectId: '82C'
    }),
    netRegexDe: netregexes/* default.gainsEffect */.Z.gainsEffect({
      source: 'Schattenkönig',
      effectId: '82C'
    }),
    netRegexFr: netregexes/* default.gainsEffect */.Z.gainsEffect({
      source: 'Roi De L\'Ombre',
      effectId: '82C'
    }),
    netRegexJa: netregexes/* default.gainsEffect */.Z.gainsEffect({
      source: '影の王',
      effectId: '82C'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'damage',
        blame: matches.target,
        text: `${matches.effect}`
      };
    }
  }, {
    // Shadow Warrior 4 dog room cleave
    // This can be mitigated by the whole group, so add a damage condition.
    id: 'E10S Barbs Of Agony',
    damageRegex: ['572A', '5B27'],
    condition: e => e.damage > 0,
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e11n.js


/* harmony default export */ const e11n = ({
  zoneId: zone_id/* default.EdensPromiseAnamorphosis */.Z.EdensPromiseAnamorphosis,
  damageWarn: {
    'E11N Burnt Strike Lightning': '562E',
    // Line cleave
    'E11N Burnt Strike Fire': '562C',
    // Line cleave
    'E11N Burnt Strike Holy': '5630',
    // Line cleave
    'E11N Burnout': '562F',
    // Burnt Strike lightning expansion
    'E11N Shining Blade': '5631',
    // Baited explosion
    'E11N Halo Of Flame Brightfire': '563B',
    // Red circle intermission explosion
    'E11N Halo Of Levin Brightfire': '563C',
    // Blue circle intermission explosion
    'E11N Resounding Crack': '564D',
    // Demi-Gukumatz 270 degree frontal cleave
    'E11N Image Burnt Strike Lightning': '5645',
    // Fate Breaker's Image line cleave
    'E11N Image Burnt Strike Fire': '5643',
    // Fate Breaker's Image line cleave
    'E11N Image Burnout': '5646' // Fate Breaker's Image lightning expansion

  },
  damageFail: {
    'E11N Blasting Zone': '563E' // Prismatic Deception charges

  },
  shareWarn: {
    'E11N Burn Mark': '564F' // Powder Mark debuff explosion

  },
  triggers: [{
    id: 'E11N Blastburn Knocked Off',
    // 562D = Burnt Strike fire followup during most of the fight
    // 5644 = same thing, but from Fatebreaker's Image
    netRegex: netregexes/* default.ability */.Z.ability({
      id: ['562D', '5644']
    }),
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
          ko: '넉백'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e11s.js

 // 565A/568D Sinsmoke Bound Of Faith share
// 565E/5699 Bowshock hits target of 565D (twice) and two others

/* harmony default export */ const e11s = ({
  zoneId: zone_id/* default.EdensPromiseAnamorphosisSavage */.Z.EdensPromiseAnamorphosisSavage,
  damageWarn: {
    'E11S Burnt Strike Fire': '5652',
    // Line cleave
    'E11S Burnt Strike Lightning': '5654',
    // Line cleave
    'E11S Burnt Strike Holy': '5656',
    // Line cleave
    'E11S Shining Blade': '5657',
    // Baited explosion
    'E11S Burnt Strike Cycle Fire': '568E',
    // Line cleave during Cycle
    'E11S Burnt Strike Cycle Lightning': '5695',
    // Line cleave during Cycle
    'E11S Burnt Strike Cycle Holy': '569D',
    // Line cleave during Cycle
    'E11S Shining Blade Cycle': '569E',
    // Baited explosion during Cycle
    'E11S Halo Of Flame Brightfire': '566D',
    // Red circle intermission explosion
    'E11S Halo Of Levin Brightfire': '566C',
    // Blue circle intermission explosion
    'E11S Portal Of Flame Bright Pulse': '5671',
    // Red card intermission explosion
    'E11S Portal Of Levin Bright Pulse': '5670',
    // Blue card intermission explosion
    'E11S Resonant Winds': '5689',
    // Demi-Gukumatz "get in"
    'E11S Resounding Crack': '5688',
    // Demi-Gukumatz 270 degree frontal cleave
    'E11S Image Burnt Strike Lightning': '567B',
    // Fate Breaker's Image line cleave
    'E11N Image Burnout': '567C',
    // Fate Breaker's Image lightning expansion
    'E11N Image Burnt Strike Fire': '5679',
    // Fate Breaker's Image line cleave
    'E11N Image Burnt Strike Holy': '567B',
    // Fate Breaker's Image line cleave
    'E11N Image Shining Blade': '567E' // Fate Breaker's Image baited explosion

  },
  damageFail: {
    'E11S Burnout': '5655',
    // Burnt Strike lightning expansion
    'E11S Burnout Cycle': '5696',
    // Burnt Strike lightning expansion
    'E11S Blasting Zone': '5674' // Prismatic Deception charges

  },
  shareWarn: {
    'E11S Elemental Break': '5664',
    // Elemental Break protean
    'E11S Elemental Break Cycle': '568C',
    // Elemental Break protean during Cycle
    'E11S Sinsmite': '5667',
    // Lightning Elemental Break spread
    'E11S Sinsmite Cycle': '5694' // Lightning Elemental Break spread during Cycle

  },
  shareFail: {
    'E11S Burn Mark': '56A3',
    // Powder Mark debuff explosion
    'E11S Sinsight 1': '5661',
    // Holy Bound Of Faith tether
    'E11S Sinsight 2': '5BC7',
    // Holy Bound Of Faith tether from Fatebreaker's Image
    'E11S Sinsight 3': '56A0' // Holy Bound Of Faith tether during Cycle

  },
  triggers: [{
    id: 'E11S Holy Sinsight Group Share',
    damageRegex: '5669',
    condition: e => e.type === '15',
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
          ko: `${matches.ability} (혼자 맞음)`
        }
      };
    }
  }, {
    id: 'E11S Blastburn Knocked Off',
    // 5653 = Burnt Strike fire followup during most of the fight
    // 567A = same thing, but from Fatebreaker's Image
    // 568F = same thing, but during Cycle of Faith
    netRegex: netregexes/* default.ability */.Z.ability({
      id: ['5653', '567A', '568F']
    }),
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
          ko: '넉백'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e12n.js

/* harmony default export */ const e12n = ({
  zoneId: zone_id/* default.EdensPromiseEternity */.Z.EdensPromiseEternity,
  damageWarn: {
    'E12N Judgment Jolt Single': '585F',
    // Ramuh get out cast
    'E12N Judgment Jolt': '4E30',
    // Ramuh get out cast
    'E12N Temporary Current Single': '585C',
    // Levi get under cast
    'E12N Temporary Current': '4E2D',
    // Levi get under cast
    'E12N Conflag Strike Single': '585D',
    // Ifrit get sides cast
    'E12N Conflag Strike': '4E2E',
    // Ifrit get sides cast
    'E12N Ferostorm Single': '585E',
    // Garuda get intercardinals cast
    'E12N Ferostorm': '4E2F',
    // Garuda get intercardinals cast
    'E12N Rapturous Reach 1': '5878',
    // Haircut
    'E12N Rapturous Reach 2': '5877',
    // Haircut
    'E12N Bomb Explosion': '586D',
    // Small bomb explosion
    'E12N Titanic Bomb Explosion': '586F' // Large bomb explosion

  },
  shareWarn: {
    'E12N Earthshaker': '5885',
    // Earthshaker on first platform
    'E12N Promise Frigid Stone 1': '5867',
    // Shiva spread with sliding
    'E12N Promise Frigid Stone 2': '5869' // Shiva spread with Rapturous Reach

  }
});
// EXTERNAL MODULE: ./resources/outputs.ts
var outputs = __webpack_require__(4970);
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
  if (typeof data.decOffset === 'undefined') data.decOffset = parseInt(matches.id, 16) - firstHeadmarker; // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.

  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

/* harmony default export */ const e12s = ({
  zoneId: zone_id/* default.EdensPromiseEternitySavage */.Z.EdensPromiseEternitySavage,
  damageWarn: {
    'E12S Promise Rapturous Reach Left': '58AD',
    // Haircut with left safe side
    'E12S Promise Rapturous Reach Right': '58AE',
    // Haircut with right safe side
    'E12S Promise Temporary Current': '4E44',
    // Levi get under cast (damage down)
    'E12S Promise Conflag Strike': '4E45',
    // Ifrit get sides cast (damage down)
    'E12S Promise Ferostorm': '4E46',
    // Garuda get intercardinals cast (damage down)
    'E12S Promise Judgment Jolt': '4E47',
    // Ramuh get out cast (damage down)
    'E12S Promise Shatter': '589C',
    // Ice Pillar explosion if tether not gotten
    'E12S Promise Impact': '58A1',
    // Titan bomb drop
    'E12S Oracle Dark Blizzard III': '58D3',
    // Relativity donut mechanic
    'E12S Oracle Apocalypse': '58E6' // Light up circle explosions (damage down)

  },
  damageFail: {
    'E12S Oracle Maelstrom': '58DA' // Advanced Relativity traffic light aoe

  },
  shareWarn: {
    'E12S Promise Frigid Stone': '589E',
    // Shiva spread
    'E12S Oracle Darkest Dance': '4E33',
    // Farthest target bait + jump before knockback
    'E12S Oracle Dark Current': '58D8',
    // Baited traffic light lasers
    'E12S Oracle Spirit Taker': '58C6',
    // Random jump spread mechanic after Shell Crusher
    'E12S Oracle Somber Dance 1': '58BF',
    // Farthest target bait for Dual Apocalypse
    'E12S Oracle Somber Dance 2': '58C0' // Second somber dance jump

  },
  shareFail: {
    'E12S Promise Weight Of The World': '58A5',
    // Titan bomb blue marker
    'E12S Promise Pulse Of The Land': '58A3',
    // Titan bomb yellow marker
    'E12S Oracle Dark Eruption 1': '58CE',
    // Initial warmup spread mechanic
    'E12S Oracle Dark Eruption 2': '58CD',
    // Relativity spread mechanic
    'E12S Oracle Black Halo': '58C7' // Tankbuster cleave

  },
  gainsEffectFail: {
    'E12S Oracle Doom': '9D4' // Relativity punishment for multiple mistakes

  },
  triggers: [{
    // Big circle ground aoes during Shiva junction.
    // This can be shielded through as long as that person doesn't stack.
    id: 'E12S Icicle Impact',
    damageRegex: '4E5A',
    condition: e => e.damage > 0,
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    id: 'E12S Headmarker',
    netRegex: netregexes/* default.headMarker */.Z.headMarker({}),
    run: (_e, data, matches) => {
      const id = getHeadmarkerId(data, matches);
      const firstLaserMarker = '0091';
      const lastLaserMarker = '0098';

      if (id >= firstLaserMarker && id <= lastLaserMarker) {
        // ids are sequential: #1 square, #2 square, #3 square, #4 square, #1 triangle etc
        const decOffset = parseInt(id, 16) - parseInt(firstLaserMarker, 16); // decOffset is 0-7, so map 0-3 to 1-4 and 4-7 to 1-4.

        data.laserNameToNum = data.laserNameToNum || {};
        data.laserNameToNum[matches.target] = decOffset % 4 + 1;
      }
    }
  }, {
    // These sculptures are added at the start of the fight, so we need to check where they
    // use the "Classical Sculpture" ability and end up on the arena for real.
    id: 'E12S Promise Chiseled Sculpture Classical Sculpture',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      source: 'Chiseled Sculpture',
      id: '58B2'
    }),
    run: (_e, data, matches) => {
      // This will run per person that gets hit by the same sculpture, but that's fine.
      // Record the y position of each sculpture so we can use it for better text later.
      data.sculptureYPositions = data.sculptureYPositions || {};
      data.sculptureYPositions[matches.sourceId.toUpperCase()] = parseFloat(matches.y);
    }
  }, {
    // The source of the tether is the player, the target is the sculpture.
    id: 'E12S Promise Chiseled Sculpture Tether',
    netRegex: netregexes/* default.tether */.Z.tether({
      target: 'Chiseled Sculpture',
      id: '0011'
    }),
    run: (_e, data, matches) => {
      data.sculptureTetherNameToId = data.sculptureTetherNameToId || {};
      data.sculptureTetherNameToId[matches.source] = matches.targetId.toUpperCase();
    }
  }, {
    id: 'E12S Promise Blade Of Flame Counter',
    netRegex: netregexes/* default.ability */.Z.ability({
      source: 'Chiseled Sculpture',
      id: '58B3'
    }),
    delaySeconds: 1,
    suppressSeconds: 1,
    run: (_e, data) => {
      data.bladeOfFlameCount = data.bladeOfFlameCount || 0;
      data.bladeOfFlameCount++;
    }
  }, {
    // This is the Chiseled Sculpture laser with the limit cut dots.
    id: 'E12S Promise Blade Of Flame',
    netRegex: netregexes/* default.ability */.Z.ability({
      source: 'Chiseled Sculpture',
      id: '58B3'
    }),
    mistake: (e, data, matches) => {
      if (!data.laserNameToNum || !data.sculptureTetherNameToId || !data.sculptureYPositions) return; // Hitting only one person is just fine.

      if (e.type === '15') return; // Find the person who has this laser number and is tethered to this statue.

      const number = (data.bladeOfFlameCount || 0) + 1;
      const sourceId = matches.sourceId.toUpperCase();
      const names = Object.keys(data.laserNameToNum);
      const withNum = names.filter(name => data.laserNameToNum[name] === number);
      const owners = withNum.filter(name => data.sculptureTetherNameToId[name] === sourceId); // if some logic error, just abort.

      if (owners.length !== 1) return; // The owner hitting themselves isn't a mistake...technically.

      if (owners[0] === matches.target) return; // Now try to figure out which statue is which.
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
        ko: `${matches.ability} (대상자 "${ownerNick}", ${number}번)`
      };

      if (isStatuePositionKnown && isStatueNorth) {
        text = {
          en: `${matches.ability} (from ${ownerNick}, #${number} north)`,
          de: `${matches.ability} (von ${ownerNick}, #${number} norden)`,
          ja: `${matches.ability} (北の${ownerNick}から、#${number})`,
          cn: `${matches.ability} (来自北方${ownerNick}，#${number})`,
          ko: `${matches.ability} (대상자 "${ownerNick}", ${number}번 북쪽)`
        };
      } else if (isStatuePositionKnown && !isStatueNorth) {
        text = {
          en: `${matches.ability} (from ${ownerNick}, #${number} south)`,
          de: `${matches.ability} (von ${ownerNick}, #${number} Süden)`,
          ja: `${matches.ability} (南の${ownerNick}から、#${number})`,
          cn: `${matches.ability} (来自南方${ownerNick}，#${number})`,
          ko: `${matches.ability} (대상자 "${ownerNick}", ${number}번 남쪽)`
        };
      }

      return {
        type: 'fail',
        name: matches.target,
        blame: owner,
        text: text
      };
    }
  }, {
    id: 'E12S Promise Ice Pillar Tracker',
    netRegex: netregexes/* default.tether */.Z.tether({
      source: 'Ice Pillar',
      id: ['0001', '0039']
    }),
    run: (_e, data, matches) => {
      data.pillarIdToOwner = data.pillarIdToOwner || {};
      data.pillarIdToOwner[matches.sourceId] = matches.target;
    }
  }, {
    id: 'E12S Promise Ice Pillar Mistake',
    netRegex: netregexes/* default.ability */.Z.ability({
      source: 'Ice Pillar',
      id: '589B'
    }),
    condition: (_e, data, matches) => {
      if (!data.pillarIdToOwner) return false;
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
          ko: `${matches.ability} (대상자 "${pillarOwner}")`
        }
      };
    }
  }, {
    // Titan phase orange marker
    id: 'E12S Promise Force Of The Land',
    damageRegex: '58A4',
    condition: e => e.type === '15',
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
          ko: `${matches.ability} (혼자 맞음)`
        }
      };
    }
  }, {
    id: 'E12S Promise Gain Fire Resistance Down II',
    // The Beastly Sculpture gives a 3 second debuff, the Regal Sculpture gives a 14s one.
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '832'
    }),
    run: (_e, data, matches) => {
      data.fire = data.fire || {};
      data.fire[matches.target] = true;
    }
  }, {
    id: 'E12S Promise Lose Fire Resistance Down II',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '832'
    }),
    run: (_e, data, matches) => {
      data.fire = data.fire || {};
      data.fire[matches.target] = false;
    }
  }, {
    id: 'E12S Promise Small Lion Tether',
    netRegex: netregexes/* default.tether */.Z.tether({
      source: 'Beastly Sculpture',
      id: '0011'
    }),
    netRegexDe: netregexes/* default.tether */.Z.tether({
      source: 'Abbild Eines Löwen',
      id: '0011'
    }),
    netRegexFr: netregexes/* default.tether */.Z.tether({
      source: 'Création Léonine',
      id: '0011'
    }),
    netRegexJa: netregexes/* default.tether */.Z.tether({
      source: '創られた獅子',
      id: '0011'
    }),
    run: (_e, data, matches) => {
      data.smallLionIdToOwner = data.smallLionIdToOwner || {};
      data.smallLionIdToOwner[matches.sourceId.toUpperCase()] = matches.target;
      data.smallLionOwners = data.smallLionOwners || [];
      data.smallLionOwners.push(matches.target);
    }
  }, {
    id: 'E12S Promise Small Lion Lionsblaze',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      source: 'Beastly Sculpture',
      id: '58B9'
    }),
    netRegexDe: netregexes/* default.abilityFull */.Z.abilityFull({
      source: 'Abbild Eines Löwen',
      id: '58B9'
    }),
    netRegexFr: netregexes/* default.abilityFull */.Z.abilityFull({
      source: 'Création Léonine',
      id: '58B9'
    }),
    netRegexJa: netregexes/* default.abilityFull */.Z.abilityFull({
      source: '創られた獅子',
      id: '58B9'
    }),
    mistake: (_e, data, matches) => {
      // Folks baiting the big lion second can take the first small lion hit,
      // so it's not sufficient to check only the owner.
      if (!data.smallLionOwners) return;
      const owner = data.smallLionIdToOwner[matches.sourceId.toUpperCase()];
      if (!owner) return;
      if (matches.target === owner) return; // If the target also has a small lion tether, that is always a mistake.
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
          if (x > 0) dirObj = outputs/* default.dirNE */.Z.dirNE;else dirObj = outputs/* default.dirNW */.Z.dirNW;
        } else {
          if (x > 0) dirObj = outputs/* default.dirSE */.Z.dirSE;else dirObj = outputs/* default.dirSW */.Z.dirSW;
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
            ko: `${matches.ability} (대상자 "${ownerNick}", ${dirObj['ko']})`
          }
        };
      }
    }
  }, {
    id: 'E12S Promise North Big Lion',
    netRegex: netregexes/* default.addedCombatantFull */.Z.addedCombatantFull({
      name: 'Regal Sculpture'
    }),
    run: (_e, data, matches) => {
      const y = parseFloat(matches.y);
      const centerY = -75;
      if (y < centerY) data.northBigLion = matches.id.toUpperCase();
    }
  }, {
    id: 'E12S Promise Big Lion Kingsblaze',
    netRegex: netregexes/* default.ability */.Z.ability({
      source: 'Regal Sculpture',
      id: '4F9E'
    }),
    netRegexDe: netregexes/* default.ability */.Z.ability({
      source: 'Abbild eines großen Löwen',
      id: '4F9E'
    }),
    netRegexFr: netregexes/* default.ability */.Z.ability({
      source: 'création léonine royale',
      id: '4F9E'
    }),
    netRegexJa: netregexes/* default.ability */.Z.ability({
      source: '創られた獅子王',
      id: '4F9E'
    }),
    mistake: (_e, data, matches) => {
      const singleTarget = matches.type === '21';
      const hasFireDebuff = data.fire && data.fire[matches.target]; // Success if only one person takes it and they have no fire debuff.

      if (singleTarget && !hasFireDebuff) return;
      const output = {
        northBigLion: {
          en: 'north big lion',
          de: 'Nordem, großer Löwe',
          ja: '大ライオン(北)',
          cn: '北方大狮子',
          ko: '북쪽 큰 사자'
        },
        southBigLion: {
          en: 'south big lion',
          de: 'Süden, großer Löwe',
          ja: '大ライオン(南)',
          cn: '南方大狮子',
          ko: '남쪽 큰 사자'
        },
        shared: {
          en: 'shared',
          de: 'geteilt',
          ja: '重ねた',
          cn: '重叠',
          ko: '같이 맞음'
        },
        fireDebuff: {
          en: 'had fire',
          de: 'hatte Feuer',
          ja: '炎付き',
          cn: '火Debuff',
          ko: '화염 디버프 받음'
        }
      };
      const labels = [];

      if (data.northBigLion) {
        if (data.northBigLion === matches.sourceId) labels.push(output.northBigLion[data.parserLang] || output.northBigLion['en']);else labels.push(output.southBigLion[data.parserLang] || output.southBigLion['en']);
      }

      if (!singleTarget) labels.push(output.shared[data.parserLang] || output.shared['en']);
      if (hasFireDebuff) labels.push(output.fireDebuff[data.parserLang] || output.fireDebuff['en']);
      return {
        type: 'fail',
        name: matches.target,
        text: `${matches.ability} (${labels.join(', ')})`
      };
    }
  }, {
    id: 'E12S Knocked Off',
    // 589A = Ice Pillar (promise shiva phase)
    // 58B6 = Palm Of Temperance (promise statue hand)
    // 58B7 = Laser Eye (promise lion phase)
    // 58C1 = Darkest Dance (oracle tank jump + knockback in beginning and triple apoc)
    netRegex: netregexes/* default.ability */.Z.ability({
      id: ['589A', '58B6', '58B7', '58C1']
    }),
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
          ko: '넉백'
        }
      };
    }
  }, {
    id: 'E12S Oracle Shadoweye',
    damageRegex: '58D2',
    condition: e => e.damage > 0,
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.ability
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/diamond_weapon-ex.js

 // TODO: warning for taking Diamond Flash (5FA1) stack on your own?
// Diamond Weapon Extreme

/* harmony default export */ const diamond_weapon_ex = ({
  zoneId: zone_id/* default.TheCloudDeckExtreme */.Z.TheCloudDeckExtreme,
  damageWarn: {
    'DiamondEx Auri Arts 1': '5FAF',
    // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 2': '5FB2',
    // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 3': '5FCD',
    // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 4': '5FCE',
    // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 5': '5FCF',
    // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 6': '5FF8',
    // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 7': '6159',
    // Auri Arts dashes/explosions
    'DiamondEx Articulated Bit Aetherial Bullet': '5FAB',
    // bit lasers during all phases
    'DiamondEx Diamond Shrapnel 1': '5FCB',
    // chasing circles
    'DiamondEx Diamond Shrapnel 2': '5FCC' // chasing circles

  },
  damageFail: {
    'DiamondEx Claw Swipe Left': '5FC2',
    // Adamant Purge platform cleave
    'DiamondEx Claw Swipe Right': '5FC3',
    // Adamant Purge platform cleave
    'DiamondEx Auri Cyclone 1': '5FD1',
    // standing on the blue knockback puck
    'DiamondEx Auri Cyclone 2': '5FD2',
    // standing on the blue knockback puck
    'DiamondEx Airship\'s Bane 1': '5FFE',
    // destroying one of the platforms after Auri Cyclone
    'DiamondEx Airship\'s Bane 2': '5FD3' // destroying one of the platforms after Auri Cyclone

  },
  shareWarn: {
    'DiamondEx Tank Lasers': '5FC8',
    // cleaving yellow lasers on top two enmity
    'DiamondEx Homing Laser': '5FC4' // Adamante Purge spread

  },
  shareFail: {
    'DiamondEx Flood Ray': '5FC7' // "limit cut" cleaves

  },
  triggers: [{
    id: 'DiamondEx Vertical Cleave Knocked Off',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '5FD0'
    }),
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
          ko: '넉백'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/diamond_weapon.js

 // Diamond Weapon Normal

/* harmony default export */ const diamond_weapon = ({
  zoneId: zone_id/* default.TheCloudDeck */.Z.TheCloudDeck,
  damageWarn: {
    'Diamond Weapon Auri Arts': '5FE3',
    // Auri Arts dashes
    'Diamond Weapon Diamond Shrapnel Initial': '5FE1',
    // initial circle of Diamond Shrapnel
    'Diamond Weapon Diamond Shrapnel Chasing': '5FE2',
    // followup circles from Diamond Shrapnel
    'Diamond Weapon Aetherial Bullet': '5FD5' // bit lasers

  },
  damageFail: {
    'Diamond Weapon Claw Swipe Left': '5FD9',
    // Adamant Purge platform cleave
    'Diamond Weapon Claw Swipe Right': '5FDA',
    // Adamant Purge platform cleave
    'Diamond Weapon Auri Cyclone 1': '5FE6',
    // standing on the blue knockback puck
    'Diamond Weapon Auri Cyclone 2': '5FE7',
    // standing on the blue knockback puck
    'Diamond Weapon Airship\'s Bane 1': '5FE8',
    // destroying one of the platforms after Auri Cyclone
    'Diamond Weapon Airship\'s Bane 2': '5FFE' // destroying one of the platforms after Auri Cyclone

  },
  shareWarn: {
    'Diamond Weapon Homing Laser': '5FDB' // spread markers

  },
  triggers: [{
    id: 'Diamond Weapon Vertical Cleave Knocked Off',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '5FE5'
    }),
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
          ko: '넉백'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/emerald_weapon-ex.js

/* harmony default export */ const emerald_weapon_ex = ({
  zoneId: zone_id/* default.CastrumMarinumExtreme */.Z.CastrumMarinumExtreme,
  damageWarn: {
    'EmeraldEx Heat Ray': '5BD3',
    // Emerald Beam initial conal
    'EmeraldEx Photon Laser 1': '557B',
    // Emerald Beam inside circle
    'EmeraldEx Photon Laser 2': '557D',
    // Emerald Beam outside circle
    'EmeraldEx Heat Ray 1': '557A',
    // Emerald Beam rotating pulsing laser
    'EmeraldEx Heat Ray 2': '5579',
    // Emerald Beam rotating pulsing laser
    'EmeraldEx Explosion': '5596',
    // Magitek Mine explosion
    'EmeraldEx Tertius Terminus Est Initial': '55CD',
    // sword initial puddles
    'EmeraldEx Tertius Terminus Est Explosion': '55CE',
    // sword explosions
    'EmeraldEx Airborne Explosion': '55BD',
    // exaflare
    'EmeraldEx Sidescathe 1': '55D4',
    // left/right cleave
    'EmeraldEx Sidescathe 2': '55D5',
    // left/right cleave
    'EmeraldEx Shots Fired': '55B7',
    // rank and file soldiers
    'EmeraldEx Secundus Terminus Est': '55CB',
    // dropped + and x headmarkers
    'EmeraldEx Expire': '55D1',
    // ground aoe on boss "get out"
    'EmeraldEx Aire Tam Storm': '55D0' // expanding red and black ground aoe

  },
  shareWarn: {
    'EmeraldEx Divide Et Impera': '55D9',
    // non-tank protean spread
    'EmeraldEx Primus Terminus Est 1': '55C4',
    // knockback arrow
    'EmeraldEx Primus Terminus Est 2': '55C5',
    // knockback arrow
    'EmeraldEx Primus Terminus Est 3': '55C6',
    // knockback arrow
    'EmeraldEx Primus Terminus Est 4': '55C7' // knockback arrow

  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/emerald_weapon.js


/* harmony default export */ const emerald_weapon = ({
  zoneId: zone_id/* default.CastrumMarinum */.Z.CastrumMarinum,
  damageWarn: {
    'Emerald Weapon Heat Ray': '4F9D',
    // Emerald Beam initial conal
    'Emerald Weapon Photon Laser 1': '5534',
    // Emerald Beam inside circle
    'Emerald Weapon Photon Laser 2': '5536',
    // Emerald Beam middle circle
    'Emerald Weapon Photon Laser 3': '5538',
    // Emerald Beam outside circle
    'Emerald Weapon Heat Ray 1': '5532',
    // Emerald Beam rotating pulsing laser
    'Emerald Weapon Heat Ray 2': '5533',
    // Emerald Beam rotating pulsing laser
    'Emerald Weapon Magnetic Mine Explosion': '5B04',
    // repulsing mine explosions
    'Emerald Weapon Sidescathe 1': '553F',
    // left/right cleave
    'Emerald Weapon Sidescathe 2': '5540',
    // left/right cleave
    'Emerald Weapon Sidescathe 3': '5541',
    // left/right cleave
    'Emerald Weapon Sidescathe 4': '5542',
    // left/right cleave
    'Emerald Weapon Bit Storm': '554A',
    // "get in"
    'Emerald Weapon Emerald Crusher': '553C',
    // blue knockback puck
    'Emerald Weapon Pulse Laser': '5548',
    // line aoe
    'Emerald Weapon Energy Aetheroplasm': '5551',
    // hitting a glowy orb
    'Emerald Weapon Divide Et Impera Ground': '556F',
    // party targeted ground cones
    'Emerald Weapon Primus Terminus Est': '4B3E',
    // ground circle during arrow headmarkers
    'Emerald Weapon Secundus Terminus Est': '556A',
    // X / + headmarkers
    'Emerald Weapon Tertius Terminus Est': '556D',
    // triple swords
    'Emerald Weapon Shots Fired': '555F' // line aoes from soldiers

  },
  shareWarn: {
    'Emerald Weapon Divide Et Impera P1': '554E',
    // tankbuster, probably cleaves, phase 1
    'Emerald Weapon Divide Et Impera P2': '5570' // tankbuster, probably cleaves, phase 2

  },
  triggers: [{
    id: 'Emerald Weapon Emerald Crusher Knocked Off',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '553E'
    }),
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
          ko: '넉백'
        }
      };
    }
  }, {
    // Getting knocked into a wall from the arrow headmarker.
    id: 'Emerald Weapon Primus Terminus Est Wall',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: ['5563', '5564']
    }),
    deathReason: (_e, _data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
        reason: {
          en: 'Pushed into wall',
          de: 'Rückstoß in die Wand',
          ja: '壁へノックバック',
          cn: '击退至墙',
          ko: '넉백'
        }
      };
    }
  }]
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
    'HadesEx Dark Current 2': '47F2'
  },
  damageFail: {
    'HadesEx Comet': '47B9',
    // missed tower
    'HadesEx Ancient Eruption': '47D3',
    'HadesEx Purgation 1': '47EC',
    'HadesEx Purgation 2': '47ED',
    'HadesEx Shadow Stream': '47EA',
    'HadesEx Dead Space': '47EE'
  },
  shareWarn: {
    'HadesEx Shadow Spread Initial': '47A9',
    'HadesEx Ravenous Assault': '(?:47A6|47A7)',
    'HadesEx Dark Flame 1': '47C6',
    'HadesEx Dark Freeze 1': '47C4',
    'HadesEx Dark Freeze 2': '47DF'
  },
  triggers: [{
    id: 'HadesEx Dark II Tether',
    netRegex: netregexes/* default.tether */.Z.tether({
      source: 'Shadow of the Ancients',
      id: '0011'
    }),
    run: (_e, data, matches) => {
      data.hasDark = data.hasDark || [];
      data.hasDark.push(matches.target);
    }
  }, {
    id: 'HadesEx Dark II',
    damageRegex: '47BA',
    condition: (e, data) => {
      // Don't blame people who don't have tethers.
      return e.type !== '15' && data.me in data.hasDark;
    },
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'HadesEx Boss Tether',
    netRegex: netregexes/* default.tether */.Z.tether({
      source: ['Igeyorhm\'s Shade', 'Lahabrea\'s Shade'],
      id: '000E',
      capture: false
    }),
    mistake: {
      type: 'warn',
      text: {
        en: 'Bosses Too Close',
        de: 'Bosses zu Nahe',
        fr: 'Boss trop proches',
        ja: 'ボス近すぎる',
        cn: 'BOSS靠太近了',
        ko: '쫄들이 너무 가까움'
      }
    }
  }, {
    id: 'HadesEx Death Shriek',
    damageRegex: '47CB',
    condition: e => e.damage > 0,
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'HadesEx Beyond Death Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '566'
    }),
    run: (_e, data, matches) => {
      data.hasBeyondDeath = data.hasBeyondDeath || {};
      data.hasBeyondDeath[matches.target] = true;
    }
  }, {
    id: 'HadesEx Beyond Death Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '566'
    }),
    run: (_e, data, matches) => {
      data.hasBeyondDeath = data.hasBeyondDeath || {};
      data.hasBeyondDeath[matches.target] = false;
    }
  }, {
    id: 'HadesEx Beyond Death',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '566'
    }),
    delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (_e, data, matches) => {
      if (!data.hasBeyondDeath) return;
      if (!data.hasBeyondDeath[matches.target]) return;
      return {
        name: matches.target,
        reason: matches.effect
      };
    }
  }, {
    id: 'HadesEx Doom Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '6E9'
    }),
    run: (_e, data, matches) => {
      data.hasDoom = data.hasDoom || {};
      data.hasDoom[matches.target] = true;
    }
  }, {
    id: 'HadesEx Doom Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '6E9'
    }),
    run: (_e, data, matches) => {
      data.hasDoom = data.hasDoom || {};
      data.hasDoom[matches.target] = false;
    }
  }, {
    id: 'HadesEx Doom',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '6E9'
    }),
    delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (_e, data, matches) => {
      if (!data.hasDoom) return;
      if (!data.hasDoom[matches.target]) return;
      return {
        name: matches.target,
        reason: matches.effect
      };
    }
  }]
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
    'Hades Echo 2': '4164'
  },
  triggers: [// Things that should only hit one person.
  {
    id: 'Hades Nether Blast',
    damageRegex: '4163',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'Hades Ravenous Assault',
    damageRegex: '4158',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'Hades Ancient Darkness',
    damageRegex: '4593',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'Hades Dual Strike',
    damageRegex: '4162',
    condition: e => e.type !== '15',
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
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
    'InnoEx Explosion': '3EF0'
  }
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
    'Inno God Ray 4': '3EC0'
  }
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
    'LeviUn Grand Fall': '5CDF',
    // very large circular aoe before spinny dives, applies heavy
    'LeviUn Hydroshot': '5CD5',
    // Wavespine Sahagin aoe that gives Dropsy effect
    'LeviUn Dreadstorm': '5CD6' // Wavetooth Sahagin aoe that gives Hysteria effect

  },
  damageFail: {
    'LeviUn Body Slam': '5CD2',
    // levi slam that tilts the boat
    'LeviUn Spinning Dive 1': '5CDB',
    // levi dash across the boat with knockback
    'LeviUn Spinning Dive 2': '5CE3',
    // levi dash across the boat with knockback
    'LeviUn Spinning Dive 3': '5CE8',
    // levi dash across the boat with knockback
    'LeviUn Spinning Dive 4': '5CE9' // levi dash across the boat with knockback

  },
  gainsEffectWarn: {
    'LeviUn Dropsy': '110' // standing in the hydro shot from the Wavespine Sahagin

  },
  gainsEffectFail: {
    'LeviUn Hysteria': '128' // standing in the dreadstorm from the Wavetooth Sahagin

  },
  triggers: [{
    id: 'LeviUn Body Slam Knocked Off',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '5CD2'
    }),
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
          ko: '넉백'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/ruby_weapon-ex.js

 // TODO: taking two different High-Powered Homing Lasers (4AD8)
// TODO: could blame the tethered player for White Agony / White Fury failures?
// Ruby Weapon Extreme

/* harmony default export */ const ruby_weapon_ex = ({
  zoneId: zone_id/* default.CinderDriftExtreme */.Z.CinderDriftExtreme,
  damageWarn: {
    'RubyEx Ruby Bit Magitek Ray': '4AD2',
    // line aoes during helicoclaw
    'RubyEx Spike Of Flame 1': '4AD3',
    // initial explosion during helicoclaw
    'RubyEx Spike Of Flame 2': '4B2F',
    // followup helicoclaw explosions
    'RubyEx Spike Of Flame 3': '4D04',
    // ravensclaw explosion at ends of lines
    'RubyEx Spike Of Flame 4': '4D05',
    // ravensclaw explosion at ends of lines
    'RubyEx Spike Of Flame 5': '4ACD',
    // ravensclaw explosion at ends of lines
    'RubyEx Spike Of Flame 6': '4ACE',
    // ravensclaw explosion at ends of lines
    'RubyEx Undermine': '4AD0',
    // ground aoes under the ravensclaw patches
    'RubyEx Ruby Ray': '4B02',
    // frontal laser
    'RubyEx Ravensflight 1': '4AD9',
    // dash around the arena
    'RubyEx Ravensflight 2': '4ADA',
    // dash around the arena
    'RubyEx Ravensflight 3': '4ADD',
    // dash around the arena
    'RubyEx Ravensflight 4': '4ADE',
    // dash around the arena
    'RubyEx Ravensflight 5': '4ADF',
    // dash around the arena
    'RubyEx Ravensflight 6': '4AE0',
    // dash around the arena
    'RubyEx Ravensflight 7': '4AE1',
    // dash around the arena
    'RubyEx Ravensflight 8': '4AE2',
    // dash around the arena
    'RubyEx Ravensflight 9': '4AE3',
    // dash around the arena
    'RubyEx Ravensflight 10': '4AE4',
    // dash around the arena
    'RubyEx Ravensflight 11': '4AE5',
    // dash around the arena
    'RubyEx Ravensflight 12': '4AE6',
    // dash around the arena
    'RubyEx Ravensflight 13': '4AE7',
    // dash around the arena
    'RubyEx Ravensflight 14': '4AE8',
    // dash around the arena
    'RubyEx Ravensflight 15': '4AE9',
    // dash around the arena
    'RubyEx Ravensflight 16': '4AEA',
    // dash around the arena
    'RubyEx Ravensflight 17': '4E6B',
    // dash around the arena
    'RubyEx Ravensflight 18': '4E6C',
    // dash around the arena
    'RubyEx Ravensflight 19': '4E6D',
    // dash around the arena
    'RubyEx Ravensflight 20': '4E6E',
    // dash around the arena
    'RubyEx Ravensflight 21': '4E6F',
    // dash around the arena
    'RubyEx Ravensflight 22': '4E70',
    // dash around the arena
    'RubyEx Cut And Run 1': '4B05',
    // slow charge across arena after stacks
    'RubyEx Cut And Run 2': '4B06',
    // slow charge across arena after stacks
    'RubyEx Cut And Run 3': '4B07',
    // slow charge across arena after stacks
    'RubyEx Cut And Run 4': '4B08',
    // slow charge across arena after stacks
    'RubyEx Cut And Run 5': '4DOD',
    // slow charge across arena after stacks
    'RubyEx Meteor Burst': '4AF2',
    // meteor exploding
    'RubyEx Bradamante': '4E38',
    // headmarkers with line aoes
    'RubyEx Comet Heavy Impact': '4AF6' // letting a tank comet land

  },
  damageFail: {
    'RubyEx Ruby Sphere Burst': '4ACB',
    // exploding the red mine
    'RubyEx Lunar Dynamo': '4EB0',
    // "get in" from Raven's Image
    'RubyEx Iron Chariot': '4EB1',
    // "get out" from Raven's Image
    'RubyEx Heart In The Machine': '4AFA' // White Agony/Fury skull hitting players

  },
  shareWarn: {
    'RubyEx Homing Lasers': '4AD6',
    // spread markers during cut and run
    'RubyEx Meteor Stream': '4E68' // spread markers during P2

  },
  gainsEffectFail: {
    'RubyEx Hysteria': '128' // Negative Aura lookaway failure

  },
  triggers: [{
    id: 'RubyEx Screech',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '4AEE'
    }),
    deathReason: (_e, _data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
        reason: {
          en: 'Knocked into wall',
          de: 'Rückstoß in die Wand',
          ja: '壁へノックバック',
          cn: '击退至墙',
          ko: '넉백'
        }
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/ruby_weapon.js
 // Ruby Normal

/* harmony default export */ const ruby_weapon = ({
  zoneId: zone_id/* default.CinderDrift */.Z.CinderDrift,
  damageWarn: {
    'Ruby Ravensclaw': '4A93',
    // centered circle aoe for ravensclaw
    'Ruby Spike Of Flame 1': '4A9A',
    // initial explosion during helicoclaw
    'Ruby Spike Of Flame 2': '4B2E',
    // followup helicoclaw explosions
    'Ruby Spike Of Flame 3': '4A94',
    // ravensclaw explosion at ends of lines
    'Ruby Spike Of Flame 4': '4A95',
    // ravensclaw explosion at ends of lines
    'Ruby Spike Of Flame 5': '4D02',
    // ravensclaw explosion at ends of lines
    'Ruby Spike Of Flame 6': '4D03',
    // ravensclaw explosion at ends of lines
    'Ruby Ruby Ray': '4AC6',
    // frontal laser
    'Ruby Undermine': '4A97',
    // ground aoes under the ravensclaw patches
    'Ruby Ravensflight 1': '4E69',
    // dash around the arena
    'Ruby Ravensflight 2': '4E6A',
    // dash around the arena
    'Ruby Ravensflight 3': '4AA1',
    // dash around the arena
    'Ruby Ravensflight 4': '4AA2',
    // dash around the arena
    'Ruby Ravensflight 5': '4AA3',
    // dash around the arena
    'Ruby Ravensflight 6': '4AA4',
    // dash around the arena
    'Ruby Ravensflight 7': '4AA5',
    // dash around the arena
    'Ruby Ravensflight 8': '4AA6',
    // dash around the arena
    'Ruby Ravensflight 9': '4AA7',
    // dash around the arena
    'Ruby Ravensflight 10': '4C21',
    // dash around the arena
    'Ruby Ravensflight 11': '4C2A',
    // dash around the arena
    'Ruby Comet Burst': '4AB4',
    // meteor exploding
    'Ruby Bradamante': '4ABC' // headmarkers with line aoes

  },
  shareWarn: {
    'Ruby Homing Laser': '4AC5',
    // spread markers in P1
    'Ruby Meteor Stream': '4E67' // spread markers in P2

  }
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
    'ShivaEx Glacier Bash': '5375'
  },
  damageFail: {
    // 270 degree attack.
    'ShivaEx Glass Dance': '5378'
  },
  shareWarn: {
    // Hailstorm spread marker.
    'ShivaEx Hailstorm': '536F'
  },
  shareFail: {
    // Laser.  TODO: maybe blame the person it's on??
    'ShivaEx Avalanche': '5379'
  },
  triggers: [{
    // Party shared tank buster.
    id: 'ShivaEx Icebrand',
    damageRegex: '5373',
    condition: e => {
      // Should be shared with friends.
      return e.type === '15';
    },
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'ShivaEx Deep Freeze',
    // Shiva also uses ability 537A on you, but it has an unknown name.
    // So, use the effect instead for free translation.
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '1E7'
    }),
    condition: (_e, _data, matches) => {
      // The intermission also gets this effect, but for a shorter duration.
      return parseFloat(matches.duration) > 20;
    },
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.effect
      };
    }
  }]
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
    'Titania Leafstorm 2': '3E03'
  },
  damageFail: {
    'Titania Phantom Rune 1': '3D5D',
    'Titania Phantom Rune 2': '3D5E'
  },
  shareFail: {
    'Titania Divination Rune': '3D5B'
  }
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
    'TitaniaEx Leafstorm 2': '3D49'
  },
  damageFail: {
    'TitaniaEx Phantom Rune 1': '3D4C',
    'TitaniaEx Phantom Rune 2': '3D4D'
  },
  shareFail: {
    // TODO: This could maybe blame the person with the tether?
    'TitaniaEx Thunder Rune': '3D29',
    'TitaniaEx Divination Rune': '3D4A'
  }
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/trial/titan-un.js
 // Titan Unreal

/* harmony default export */ const titan_un = ({
  zoneId: zone_id/* default.TheNavelUnreal */.Z.TheNavelUnreal,
  damageWarn: {
    'TitanUn Weight Of The Land': '58FE',
    'TitanUn Burst': '5ADF'
  },
  damageFail: {
    'TitanUn Landslide': '5ADC',
    'TitanUn Gaoler Landslide': '5902'
  },
  shareWarn: {
    'TitanUn Rock Buster': '58F6'
  },
  shareFail: {
    'TitanUn Mountain Buster': '58F7'
  }
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
    'VarisEx Fortius Rotating': '4CE9'
  },
  damageFail: {
    // Don't hit the shields!
    'VarisEx Repay': '4CDD'
  },
  shareWarn: {
    // This is the "protean" fortius.
    'VarisEx Fortius Protean': '4CE7'
  },
  shareFail: {
    'VarisEx Magitek Burst': '4CDF',
    'VarisEx Aetherochemical Grenado': '4CED'
  },
  triggers: [{
    id: 'VarisEx Terminus Est',
    damageRegex: '4CB4',
    suppressSeconds: 1,
    mistake: e => {
      return {
        type: 'warn',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
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
    'WOL Solemn Confiteor': '4F2A',
    // ground puddles
    'WOL Coruscant Saber In': '4F10',
    // saber in
    'WOL Coruscant Saber Out': '4F11',
    // saber out
    'WOL Imbued Corusance Out': '4F4B',
    // saber out
    'WOL Imbued Corusance In': '4F4C',
    // saber in
    'WOL Shining Wave': '4F26',
    // sword triangle
    'WOL Cauterize': '4F25',
    'WOL Brimstone Earth 1': '4F1E',
    // corner growing circles, initial
    'WOL Brimstone Earth 2': '4F1F',
    // corner growing circles, growing
    'WOL Flare Breath': '4F24',
    'WOL Decimation': '4F23'
  },
  gainsEffectWarn: {
    'WOL Deep Freeze': '4E6'
  },
  triggers: [{
    id: 'WOL True Walking Dead',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '38E'
    }),
    delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (e, _data, matches) => {
      return {
        type: 'fail',
        name: e.target,
        reason: matches.effect
      };
    }
  }]
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
    'WOLEx Solemn Confiteor': '4F0C',
    // ground puddles
    'WOLEx Coruscant Saber In': '4EF2',
    // saber in
    'WOLEx Coruscant Saber Out': '4EF1',
    // saber out
    'WOLEx Imbued Corusance Out': '4F49',
    // saber out
    'WOLEx Imbued Corusance In': '4F4A',
    // saber in
    'WOLEx Shining Wave': '4F08',
    // sword triangle
    'WOLEx Cauterize': '4F07',
    'WOLEx Brimstone Earth': '4F00' // corner growing circles, growing

  },
  shareWarn: {
    'WOLEx Absolute Stone III': '4EEB',
    // protean wave imbued magic
    'WOLEx Flare Breath': '4F06',
    // tether from summoned bahamuts
    'WOLEx Perfect Decimation': '4F05' // smn/war phase marker

  },
  gainsEffectWarn: {
    'WOLEx Deep Freeze': '4E6',
    // failing Absolute Blizzard III
    'WOLEx Damage Down': '274' // failing Absolute Flash

  },
  triggers: [{
    id: 'WOLEx True Walking Dead',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '8FF'
    }),
    delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (e, _data, matches) => {
      return {
        type: 'fail',
        name: e.target,
        reason: matches.effect
      };
    }
  }, {
    id: 'WOLEx Tower',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '4F04',
      capture: false
    }),
    mistake: {
      type: 'fail',
      reason: {
        en: 'Missed Tower',
        de: 'Turm verpasst',
        fr: 'Tour manquée',
        ja: '塔を踏まなかった',
        cn: '没踩塔',
        ko: '장판 실수'
      }
    }
  }, {
    id: 'WOLEx True Hallowed Ground',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '4F44'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        reason: matches.ability
      };
    }
  }, {
    // For Berserk and Deep Darkside
    id: 'WOLEx Missed Interrupt',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: ['5156', '5158']
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'fail',
        reason: matches.ability
      };
    }
  }, {
    id: 'WolEx Katon San Share',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '4EFE'
    }),
    condition: e => e.type === '15',
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }]
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
    'TEA Almighty Judgment': '4890'
  },
  damageFail: {
    'TEA Hawk Blaster': '4830',
    'TEA Chakram': '4855',
    'TEA Enumeration': '4850',
    'TEA Apocalyptic Ray': '484C',
    'TEA Propeller Wind': '4832'
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
    'TEA Individual Reprobation': '488C'
  },
  triggers: [{
    // Balloon Popping.  It seems like the person who pops it is the
    // first person listed damage-wise, so they are likely the culprit.
    id: 'TEA Outburst',
    damageRegex: '482A',
    collectSeconds: 0.5,
    suppressSeconds: 5,
    mistake: e => {
      return {
        type: 'fail',
        blame: e[0].targetName,
        text: e[0].attackerName
      };
    }
  }, {
    // "too much luminous aetheroplasm"
    // When this happens, the target explodes, hitting nearby people
    // but also themselves.
    id: 'TEA Exhaust',
    damageRegex: '481F',
    condition: e => e.targetName === e.attackerName,
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: {
          en: 'luminous aetheroplasm',
          de: 'Luminiszentes Ätheroplasma',
          fr: 'Éthéroplasma lumineux',
          ja: '光性爆雷',
          cn: '光性爆雷'
        }
      };
    }
  }, {
    id: 'TEA Dropsy',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '121'
    }),
    mistake: (_e, _data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    id: 'TEA Tether Tracking',
    netRegex: netregexes/* default.tether */.Z.tether({
      source: 'Jagd Doll',
      id: '0011'
    }),
    run: (_e, data, matches) => {
      data.jagdTether = data.jagdTether || {};
      data.jagdTether[matches.sourceId] = matches.target;
    }
  }, {
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
          cn: '浮士德死亡'
        }
      };
    }
  }, {
    id: 'TEA Drainage',
    damageRegex: '4827',
    condition: (e, data) => {
      // TODO: remove this when ngld overlayplugin is the default
      if (!data.party.partyNames.length) return false;
      return data.IsPlayerId(e.targetId) && !data.party.isTank(e.targetName);
    },
    mistake: e => {
      return {
        type: 'fail',
        name: e.targetName,
        text: e.abilityName
      };
    }
  }, {
    id: 'TEA Throttle Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '2BC'
    }),
    run: (_e, data, matches) => {
      data.hasThrottle = data.hasThrottle || {};
      data.hasThrottle[matches.target] = true;
    }
  }, {
    id: 'TEA Throttle Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '2BC'
    }),
    run: (_e, data, matches) => {
      data.hasThrottle = data.hasThrottle || {};
      data.hasThrottle[matches.target] = false;
    }
  }, {
    id: 'TEA Throttle',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '2BC'
    }),
    delaySeconds: (_e, _data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (_e, data, matches) => {
      if (!data.hasThrottle) return;
      if (!data.hasThrottle[matches.target]) return;
      return {
        name: matches.target,
        reason: matches.effect
      };
    }
  }, {
    // Optical Stack
    id: 'TEA Collective Reprobation',
    damageRegex: '488D',
    condition: e => {
      // Single Tap
      return e.type === '15';
    },
    mistake: e => {
      return {
        type: 'fail',
        blame: e.targetName,
        text: e.abilityName
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/oopsy_manifest.txt

































































































/* harmony default export */ const oopsy_manifest = ({'00-misc/buffs.js': buffs,'00-misc/general.js': general,'00-misc/test.js': test,'02-arr/trial/ifrit-nm.js': ifrit_nm,'02-arr/trial/titan-nm.js': titan_nm,'02-arr/trial/levi-ex.js': levi_ex,'02-arr/trial/shiva-hm.js': shiva_hm,'02-arr/trial/shiva-ex.js': shiva_ex,'02-arr/trial/titan-hm.js': titan_hm,'02-arr/trial/titan-ex.js': titan_ex,'03-hw/alliance/weeping_city.js': weeping_city,'03-hw/dungeon/aetherochemical_research_facility.js': aetherochemical_research_facility,'03-hw/dungeon/fractal_continuum.js': fractal_continuum,'03-hw/dungeon/gubal_library_hard.js': gubal_library_hard,'03-hw/dungeon/sohm_al_hard.js': sohm_al_hard,'03-hw/raid/a12n.js': a12n,'04-sb/dungeon/ala_mhigo.js': ala_mhigo,'04-sb/dungeon/bardams_mettle.js': bardams_mettle,'04-sb/dungeon/kugane_castle.js': kugane_castle,'04-sb/dungeon/st_mocianne_hard.js': st_mocianne_hard,'04-sb/dungeon/swallows_compass.js': swallows_compass,'04-sb/dungeon/temple_of_the_fist.js': temple_of_the_fist,'04-sb/dungeon/the_burn.js': the_burn,'04-sb/raid/o1n.js': o1n,'04-sb/raid/o2n.js': o2n,'04-sb/raid/o3n.js': o3n,'04-sb/raid/o4n.js': o4n,'04-sb/raid/o4s.js': o4s,'04-sb/raid/o7s.js': o7s,'04-sb/raid/o12s.js': o12s,'04-sb/trial/byakko-ex.js': byakko_ex,'04-sb/trial/shinryu.js': shinryu,'04-sb/trial/susano-ex.js': susano_ex,'04-sb/ultimate/ultima_weapon_ultimate.js': ultima_weapon_ultimate,'04-sb/ultimate/unending_coil_ultimate.js': unending_coil_ultimate,'05-shb/alliance/the_copied_factory.js': the_copied_factory,'05-shb/alliance/the_puppets_bunker.js': the_puppets_bunker,'05-shb/alliance/the_tower_at_paradigms_breach.js': the_tower_at_paradigms_breach,'05-shb/dungeon/akadaemia_anyder.js': akadaemia_anyder,'05-shb/dungeon/amaurot.js': amaurot,'05-shb/dungeon/anamnesis_anyder.js': anamnesis_anyder,'05-shb/dungeon/dohn_mheg.js': dohn_mheg,'05-shb/dungeon/heroes_gauntlet.js': heroes_gauntlet,'05-shb/dungeon/holminster_switch.js': holminster_switch,'05-shb/dungeon/malikahs_well.js': malikahs_well,'05-shb/dungeon/matoyas_relict.js': matoyas_relict,'05-shb/dungeon/mt_gulg.js': mt_gulg,'05-shb/dungeon/paglthan.js': paglthan,'05-shb/dungeon/qitana_ravel.js': qitana_ravel,'05-shb/dungeon/the_grand_cosmos.js': the_grand_cosmos,'05-shb/dungeon/twinning.js': twinning,'05-shb/eureka/delubrum_reginae.js': delubrum_reginae,'05-shb/eureka/delubrum_reginae_savage.js': delubrum_reginae_savage,'05-shb/raid/e1n.js': e1n,'05-shb/raid/e1s.js': e1s,'05-shb/raid/e2n.js': e2n,'05-shb/raid/e2s.js': e2s,'05-shb/raid/e3n.js': e3n,'05-shb/raid/e3s.js': e3s,'05-shb/raid/e4n.js': e4n,'05-shb/raid/e4s.js': e4s,'05-shb/raid/e5n.js': e5n,'05-shb/raid/e5s.js': e5s,'05-shb/raid/e6n.js': e6n,'05-shb/raid/e6s.js': e6s,'05-shb/raid/e7n.js': e7n,'05-shb/raid/e7s.js': e7s,'05-shb/raid/e8n.js': e8n,'05-shb/raid/e8s.js': e8s,'05-shb/raid/e9n.js': e9n,'05-shb/raid/e9s.js': e9s,'05-shb/raid/e10n.js': e10n,'05-shb/raid/e10s.js': e10s,'05-shb/raid/e11n.js': e11n,'05-shb/raid/e11s.js': e11s,'05-shb/raid/e12n.js': e12n,'05-shb/raid/e12s.js': e12s,'05-shb/trial/diamond_weapon-ex.js': diamond_weapon_ex,'05-shb/trial/diamond_weapon.js': diamond_weapon,'05-shb/trial/emerald_weapon-ex.js': emerald_weapon_ex,'05-shb/trial/emerald_weapon.js': emerald_weapon,'05-shb/trial/hades-ex.js': hades_ex,'05-shb/trial/hades.js': hades,'05-shb/trial/innocence-ex.js': innocence_ex,'05-shb/trial/innocence.js': innocence,'05-shb/trial/levi-un.js': levi_un,'05-shb/trial/ruby_weapon-ex.js': ruby_weapon_ex,'05-shb/trial/ruby_weapon.js': ruby_weapon,'05-shb/trial/shiva-un.js': shiva_un,'05-shb/trial/titania.js': titania,'05-shb/trial/titania-ex.js': titania_ex,'05-shb/trial/titan-un.js': titan_un,'05-shb/trial/varis-ex.js': varis_ex,'05-shb/trial/wol.js': wol,'05-shb/trial/wol-ex.js': wol_ex,'05-shb/ultimate/the_epic_of_alexander.js': the_epic_of_alexander,});

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wMC1taXNjL2J1ZmZzLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzAwLW1pc2MvZ2VuZXJhbC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wMC1taXNjL3Rlc3QuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDItYXJyL3RyaWFsL2lmcml0LW5tLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzAyLWFyci90cmlhbC90aXRhbi1ubS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wMi1hcnIvdHJpYWwvbGV2aS1leC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wMi1hcnIvdHJpYWwvc2hpdmEtaG0uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDItYXJyL3RyaWFsL3NoaXZhLWV4LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzAyLWFyci90cmlhbC90aXRhbi1obS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wMi1hcnIvdHJpYWwvdGl0YW4tZXguanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDMtaHcvYWxsaWFuY2Uvd2VlcGluZ19jaXR5LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzAzLWh3L2R1bmdlb24vYWV0aGVyb2NoZW1pY2FsX3Jlc2VhcmNoX2ZhY2lsaXR5LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzAzLWh3L2R1bmdlb24vZnJhY3RhbF9jb250aW51dW0uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDMtaHcvZHVuZ2Vvbi9ndWJhbF9saWJyYXJ5X2hhcmQuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDMtaHcvZHVuZ2Vvbi9zb2htX2FsX2hhcmQuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDMtaHcvcmFpZC9hMTJuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA0LXNiL2R1bmdlb24vYWxhX21oaWdvLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA0LXNiL2R1bmdlb24vYmFyZGFtc19tZXR0bGUuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvZHVuZ2Vvbi9rdWdhbmVfY2FzdGxlLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA0LXNiL2R1bmdlb24vc3RfbW9jaWFubmVfaGFyZC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9kdW5nZW9uL3N3YWxsb3dzX2NvbXBhc3MuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvZHVuZ2Vvbi90ZW1wbGVfb2ZfdGhlX2Zpc3QuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvZHVuZ2Vvbi90aGVfYnVybi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL28xbi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL28ybi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL28zbi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL280bi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL280cy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL283cy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL28xMnMuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvdHJpYWwvYnlha2tvLWV4LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA0LXNiL3RyaWFsL3NoaW5yeXUuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvdHJpYWwvc3VzYW5vLWV4LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA0LXNiL3VsdGltYXRlL3VsdGltYV93ZWFwb25fdWx0aW1hdGUuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvdWx0aW1hdGUvdW5lbmRpbmdfY29pbF91bHRpbWF0ZS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvYWxsaWFuY2UvdGhlX2NvcGllZF9mYWN0b3J5LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9hbGxpYW5jZS90aGVfcHVwcGV0c19idW5rZXIuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL2FsbGlhbmNlL3RoZV90b3dlcl9hdF9wYXJhZGlnbXNfYnJlYWNoLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9kdW5nZW9uL2FrYWRhZW1pYV9hbnlkZXIuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL2R1bmdlb24vYW1hdXJvdC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZHVuZ2Vvbi9hbmFtbmVzaXNfYW55ZGVyLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9kdW5nZW9uL2RvaG5fbWhlZy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZHVuZ2Vvbi9oZXJvZXNfZ2F1bnRsZXQuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL2R1bmdlb24vaG9sbWluc3Rlcl9zd2l0Y2guanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL2R1bmdlb24vbWFsaWthaHNfd2VsbC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZHVuZ2Vvbi9tYXRveWFzX3JlbGljdC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZHVuZ2Vvbi9tdF9ndWxnLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9kdW5nZW9uL3BhZ2x0aGFuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9kdW5nZW9uL3FpdGFuYV9yYXZlbC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZHVuZ2Vvbi90aGVfZ3JhbmRfY29zbW9zLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9kdW5nZW9uL3R3aW5uaW5nLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9ldXJla2EvZGVsdWJydW1fcmVnaW5hZS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZXVyZWthL2RlbHVicnVtX3JlZ2luYWVfc2F2YWdlLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2Uxbi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lMXMuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTJuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2Uycy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lM24uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTNzLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2U0bi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lNHMuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTVuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2U1cy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lNm4uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTZzLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2U3bi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lN3MuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZThuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2U4cy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lOW4uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTlzLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2UxMG4uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTEwcy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lMTFuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2UxMXMuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTEybi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lMTJzLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi90cmlhbC9kaWFtb25kX3dlYXBvbi1leC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvZGlhbW9uZF93ZWFwb24uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL2VtZXJhbGRfd2VhcG9uLWV4LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi90cmlhbC9lbWVyYWxkX3dlYXBvbi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvaGFkZXMtZXguanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL2hhZGVzLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi90cmlhbC9pbm5vY2VuY2UtZXguanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL2lubm9jZW5jZS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvbGV2aS11bi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvcnVieV93ZWFwb24tZXguanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL3J1Ynlfd2VhcG9uLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi90cmlhbC9zaGl2YS11bi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvdGl0YW5pYS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvdGl0YW5pYS1leC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvdGl0YW4tdW4uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL3ZhcmlzLWV4LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi90cmlhbC93b2wuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL3dvbC1leC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdWx0aW1hdGUvdGhlX2VwaWNfb2ZfYWxleGFuZGVyLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhL29vcHN5X21hbmlmZXN0LnR4dCJdLCJuYW1lcyI6WyJhYmlsaXR5Q29sbGVjdFNlY29uZHMiLCJlZmZlY3RDb2xsZWN0U2Vjb25kcyIsIm1pc3NlZEZ1bmMiLCJhcmdzIiwiaWQiLCJ0cmlnZ2VySWQiLCJuZXRSZWdleCIsImNvbmRpdGlvbiIsIl9ldnQiLCJkYXRhIiwibWF0Y2hlcyIsInNvdXJjZUlkIiwidG9VcHBlckNhc2UiLCJwYXJ0eSIsInBhcnR5SWRzIiwiaW5jbHVkZXMiLCJwZXRJZFRvT3duZXJJZCIsIm93bmVySWQiLCJjb2xsZWN0U2Vjb25kcyIsIm1pc3Rha2UiLCJfYWxsRXZlbnRzIiwiYWxsTWF0Y2hlcyIsInBhcnR5TmFtZXMiLCJnb3RCdWZmTWFwIiwibmFtZSIsImZpcnN0TWF0Y2giLCJzb3VyY2VOYW1lIiwic291cmNlIiwicGV0SWQiLCJvd25lck5hbWUiLCJuYW1lRnJvbUlkIiwiY29uc29sZSIsImVycm9yIiwiaWdub3JlU2VsZiIsInRoaW5nTmFtZSIsImZpZWxkIiwidGFyZ2V0IiwibWlzc2VkIiwiT2JqZWN0Iiwia2V5cyIsImZpbHRlciIsIngiLCJsZW5ndGgiLCJ0eXBlIiwiYmxhbWUiLCJ0ZXh0IiwiZW4iLCJtYXAiLCJTaG9ydE5hbWUiLCJqb2luIiwiZGUiLCJmciIsImphIiwiY24iLCJrbyIsIm1pc3NlZE1pdGlnYXRpb25CdWZmIiwiZWZmZWN0SWQiLCJKU09OIiwic3RyaW5naWZ5IiwiTmV0UmVnZXhlcyIsIm1pc3NlZERhbWFnZUFiaWxpdHkiLCJhYmlsaXR5SWQiLCJtaXNzZWRIZWFsIiwibWlzc2VkTWl0aWdhdGlvbkFiaWxpdHkiLCJ6b25lSWQiLCJab25lSWQiLCJ0cmlnZ2VycyIsInJ1biIsIl9lIiwiX2RhdGEiLCJsb3N0Rm9vZCIsImluQ29tYmF0IiwiYWJpbGl0eVJlZ2V4IiwiZSIsIklzUGxheWVySWQiLCJhdHRhY2tlcklkIiwiYXR0YWNrZXJOYW1lIiwibGluZSIsIm5ldFJlZ2V4RnIiLCJuZXRSZWdleEphIiwibmV0UmVnZXhDbiIsIm5ldFJlZ2V4S28iLCJtZSIsImZ1bGxUZXh0IiwiZGFtYWdlUmVnZXgiLCJzdHJpa2luZ0R1bW15TmFtZXMiLCJ0YXJnZXROYW1lIiwiYm9vdENvdW50IiwiYWJpbGl0eU5hbWUiLCJkYW1hZ2VTdHIiLCJlZmZlY3QiLCJzdXBwcmVzc1NlY29uZHMiLCJldmVudHMiLCJwb2tlcyIsImRhbWFnZVdhcm4iLCJkYW1hZ2VGYWlsIiwic2hhcmVXYXJuIiwiZ2FpbnNFZmZlY3RXYXJuIiwiZ2FpbnNFZmZlY3RGYWlsIiwiZGVhdGhSZWFzb24iLCJyZWFzb24iLCJzaGFyZUZhaWwiLCJzZWVuRGlhbW9uZER1c3QiLCJwYXJzZUZsb2F0IiwiZHVyYXRpb24iLCJ6b21iaWUiLCJhYmlsaXR5Iiwic2hpZWxkIiwiaGFzSW1wIiwiZGFtYWdlIiwiYXNzYXVsdCIsInB1c2giLCJkZWxheVNlY29uZHMiLCJhYmlsaXR5V2FybiIsImZsYWdzIiwic3Vic3RyIiwiY2FwdHVyZSIsIm5ldFJlZ2V4RGUiLCJwaGFzZU51bWJlciIsImluaXRpYWxpemVkIiwiZ2FtZUNvdW50IiwidGFyZ2V0SWQiLCJpc0RlY2lzaXZlQmF0dGxlRWxlbWVudCIsImlzTmVvRXhkZWF0aCIsImhhc0JleW9uZERlYXRoIiwidnVsbiIsImhhc0Rvb20iLCJkdXJhdGlvblNlY29uZHMiLCJzbGljZSIsImZhdWx0TGluZVRhcmdldCIsImhhc09yYiIsImNsb3VkTWFya2VycyIsIm0iLCJub09yYiIsInN0ciIsImhhdGVkIiwid3JvbmdCdWZmIiwibm9CdWZmIiwiaGFzQXN0cmFsIiwiaGFzVW1icmFsIiwiZmlyc3RIZWFkbWFya2VyIiwicGFyc2VJbnQiLCJnZXRIZWFkbWFya2VySWQiLCJkZWNPZmZzZXQiLCJ0b1N0cmluZyIsInBhZFN0YXJ0IiwiZmlyc3RMYXNlck1hcmtlciIsImxhc3RMYXNlck1hcmtlciIsImxhc2VyTmFtZVRvTnVtIiwic2N1bHB0dXJlWVBvc2l0aW9ucyIsInkiLCJzY3VscHR1cmVUZXRoZXJOYW1lVG9JZCIsImJsYWRlT2ZGbGFtZUNvdW50IiwibnVtYmVyIiwibmFtZXMiLCJ3aXRoTnVtIiwib3duZXJzIiwibWluaW11bVlhbG1zRm9yU3RhdHVlcyIsImlzU3RhdHVlUG9zaXRpb25Lbm93biIsImlzU3RhdHVlTm9ydGgiLCJzY3VscHR1cmVJZHMiLCJvdGhlcklkIiwic291cmNlWSIsIm90aGVyWSIsInlEaWZmIiwiTWF0aCIsImFicyIsIm93bmVyIiwib3duZXJOaWNrIiwicGlsbGFySWRUb093bmVyIiwicGlsbGFyT3duZXIiLCJmaXJlIiwic21hbGxMaW9uSWRUb093bmVyIiwic21hbGxMaW9uT3duZXJzIiwiaGFzU21hbGxMaW9uIiwiaGFzRmlyZURlYnVmZiIsImNlbnRlclkiLCJkaXJPYmoiLCJPdXRwdXRzIiwibm9ydGhCaWdMaW9uIiwic2luZ2xlVGFyZ2V0Iiwib3V0cHV0Iiwic291dGhCaWdMaW9uIiwic2hhcmVkIiwiZmlyZURlYnVmZiIsImxhYmVscyIsInBhcnNlckxhbmciLCJoYXNEYXJrIiwiamFnZFRldGhlciIsInVuZGVmaW5lZCIsImlzVGFuayIsImhhc1Rocm90dGxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0NBR0E7O0FBQ0EsTUFBTUEscUJBQXFCLEdBQUcsR0FBOUIsQyxDQUNBOztBQUNBLE1BQU1DLG9C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TSw2QkFBNkIsU0FBTSw2Q0FBNkMsc0JBQU0sNkNBQTZDLHNCQUFNLDBDQUEwQyxrQkFBTSwwQ0FBMEMsa0JBQU0scURBQXFELDZCQUFNLHVDQUF1QyxnQkFBTSw4QkFBOEIsT0FBTSx1Q0FBdUMsZ0JBQU0sZ0NBQWdDLFNBQU0sc0NBQXNDLGVBQU0sd0NBQXdDLGlCQUFNLG9DQUFvQyxhQUFNLHFDQUFxQyxjQUFNLDhCQUE4QixPQUFNLCtCQUErQixRQUFNLG1DQUFtQyxZQUFNLHVDQUF1QyxnQkFBTSwrQkFBK0IsUUFBTSxzQ0FBc0MsZ0JBQU0sNkNBQTZDLHVCQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHVCQUF1QixHQUFNLHdCQUF3QixJQUFNLHdCQUF3QixJQUFNLHdCQUF3QixJQUFNLHdCQUF3QixJQUFNLHdCQUF3QixJQUFNLHdCQUF3QixJQUFNLHNDQUFzQyxpQkFBTSxtQ0FBbUMsY0FBTSxzQ0FBc0MsaUJBQU0sbUNBQW1DLGNBQU0sNkJBQTZCLFFBQU0sMEJBQTBCLEtBQU0saUNBQWlDLFlBQU0sOEJBQThCLFNBQU0sNEJBQTRCLE9BQU0sbUNBQW1DLGNBQU0sZ0NBQWdDLFdBQU0sNkJBQTZCLFFBQU0sNEJBQTRCLE9BQU0sK0JBQStCLFVBQU0sNkJBQTZCLFFBQU0sNkJBQTZCLFFBQU0sd0JBQXdCLEdBQU0sMkJBQTJCLE1BQU0sNkNBQTZDLHFCQUFNLEVBQUUsRSIsImZpbGUiOiJ1aS9jb21tb24vb29wc3lyYWlkc3lfZGF0YS5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gQWJpbGl0aWVzIHNlZW0gaW5zdGFudC5cclxuY29uc3QgYWJpbGl0eUNvbGxlY3RTZWNvbmRzID0gMC41O1xyXG4vLyBPYnNlcnZhdGlvbjogdXAgdG8gfjEuMiBzZWNvbmRzIGZvciBhIGJ1ZmYgdG8gcm9sbCB0aHJvdWdoIHRoZSBwYXJ0eS5cclxuY29uc3QgZWZmZWN0Q29sbGVjdFNlY29uZHMgPSAyLjA7XHJcblxyXG4vLyBhcmdzOiB0cmlnZ2VySWQsIG5ldFJlZ2V4LCBmaWVsZCwgdHlwZSwgaWdub3JlU2VsZlxyXG5jb25zdCBtaXNzZWRGdW5jID0gKGFyZ3MpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgLy8gU3VyZSwgbm90IGFsbCBvZiB0aGVzZSBhcmUgXCJidWZmc1wiIHBlciBzZSwgYnV0IHRoZXkncmUgYWxsIGluIHRoZSBidWZmcyBmaWxlLlxyXG4gICAgaWQ6ICdCdWZmICcgKyBhcmdzLnRyaWdnZXJJZCxcclxuICAgIG5ldFJlZ2V4OiBhcmdzLm5ldFJlZ2V4LFxyXG4gICAgY29uZGl0aW9uOiAoX2V2dCwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICBjb25zdCBzb3VyY2VJZCA9IG1hdGNoZXMuc291cmNlSWQudG9VcHBlckNhc2UoKTtcclxuICAgICAgaWYgKGRhdGEucGFydHkucGFydHlJZHMuaW5jbHVkZXMoc291cmNlSWQpKVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgaWYgKGRhdGEucGV0SWRUb093bmVySWQpIHtcclxuICAgICAgICBjb25zdCBvd25lcklkID0gZGF0YS5wZXRJZFRvT3duZXJJZFtzb3VyY2VJZF07XHJcbiAgICAgICAgaWYgKG93bmVySWQgJiYgZGF0YS5wYXJ0eS5wYXJ0eUlkcy5pbmNsdWRlcyhvd25lcklkKSlcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgY29sbGVjdFNlY29uZHM6IGFyZ3MuY29sbGVjdFNlY29uZHMsXHJcbiAgICBtaXN0YWtlOiAoX2FsbEV2ZW50cywgZGF0YSwgYWxsTWF0Y2hlcykgPT4ge1xyXG4gICAgICBjb25zdCBwYXJ0eU5hbWVzID0gZGF0YS5wYXJ0eS5wYXJ0eU5hbWVzO1xyXG5cclxuICAgICAgLy8gVE9ETzogY29uc2lkZXIgZGVhZCBwZW9wbGUgc29tZWhvd1xyXG4gICAgICBjb25zdCBnb3RCdWZmTWFwID0ge307XHJcbiAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwYXJ0eU5hbWVzKVxyXG4gICAgICAgIGdvdEJ1ZmZNYXBbbmFtZV0gPSBmYWxzZTtcclxuXHJcbiAgICAgIGNvbnN0IGZpcnN0TWF0Y2ggPSBhbGxNYXRjaGVzWzBdO1xyXG4gICAgICBsZXQgc291cmNlTmFtZSA9IGZpcnN0TWF0Y2guc291cmNlO1xyXG4gICAgICAvLyBCbGFtZSBwZXQgbWlzdGFrZXMgb24gb3duZXJzLlxyXG4gICAgICBpZiAoZGF0YS5wZXRJZFRvT3duZXJJZCkge1xyXG4gICAgICAgIGNvbnN0IHBldElkID0gZmlyc3RNYXRjaC5zb3VyY2VJZC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgIGNvbnN0IG93bmVySWQgPSBkYXRhLnBldElkVG9Pd25lcklkW3BldElkXTtcclxuICAgICAgICBpZiAob3duZXJJZCkge1xyXG4gICAgICAgICAgY29uc3Qgb3duZXJOYW1lID0gZGF0YS5wYXJ0eS5uYW1lRnJvbUlkKG93bmVySWQpO1xyXG4gICAgICAgICAgaWYgKG93bmVyTmFtZSlcclxuICAgICAgICAgICAgc291cmNlTmFtZSA9IG93bmVyTmFtZTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgQ291bGRuJ3QgZmluZCBuYW1lIGZvciAke293bmVySWR9IGZyb20gcGV0ICR7cGV0SWR9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYXJncy5pZ25vcmVTZWxmKVxyXG4gICAgICAgIGdvdEJ1ZmZNYXBbc291cmNlTmFtZV0gPSB0cnVlO1xyXG5cclxuICAgICAgY29uc3QgdGhpbmdOYW1lID0gZmlyc3RNYXRjaFthcmdzLmZpZWxkXTtcclxuICAgICAgZm9yIChjb25zdCBtYXRjaGVzIG9mIGFsbE1hdGNoZXMpIHtcclxuICAgICAgICAvLyBJbiBjYXNlIHlvdSBoYXZlIG11bHRpcGxlIHBhcnR5IG1lbWJlcnMgd2hvIGhpdCB0aGUgc2FtZSBjb29sZG93biBhdCB0aGUgc2FtZVxyXG4gICAgICAgIC8vIHRpbWUgKGxvbD8pLCB0aGVuIGlnbm9yZSBhbnlib2R5IHdobyB3YXNuJ3QgdGhlIGZpcnN0LlxyXG4gICAgICAgIGlmIChtYXRjaGVzLnNvdXJjZSAhPT0gZmlyc3RNYXRjaC5zb3VyY2UpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgZ290QnVmZk1hcFttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBtaXNzZWQgPSBPYmplY3Qua2V5cyhnb3RCdWZmTWFwKS5maWx0ZXIoKHgpID0+ICFnb3RCdWZmTWFwW3hdKTtcclxuICAgICAgaWYgKG1pc3NlZC5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgLy8gVE9ETzogb29wc3kgY291bGQgcmVhbGx5IHVzZSBtb3VzZW92ZXIgcG9wdXBzIGZvciBkZXRhaWxzLlxyXG4gICAgICAvLyBUT0RPOiBhbHRlcm5hdGl2ZWx5LCBpZiB3ZSBoYXZlIGEgZGVhdGggcmVwb3J0LCBpdCdkIGJlIGdvb2QgdG9cclxuICAgICAgLy8gZXhwbGljaXRseSBjYWxsIG91dCB0aGF0IG90aGVyIHBlb3BsZSBnb3QgYSBoZWFsIHRoaXMgcGVyc29uIGRpZG4ndC5cclxuICAgICAgaWYgKG1pc3NlZC5sZW5ndGggPCA0KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6IGFyZ3MudHlwZSxcclxuICAgICAgICAgIGJsYW1lOiBzb3VyY2VOYW1lLFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogdGhpbmdOYW1lICsgJyBtaXNzZWQgJyArIG1pc3NlZC5tYXAoKHgpID0+IGRhdGEuU2hvcnROYW1lKHgpKS5qb2luKCcsICcpLFxyXG4gICAgICAgICAgICBkZTogdGhpbmdOYW1lICsgJyB2ZXJmZWhsdCAnICsgbWlzc2VkLm1hcCgoeCkgPT4gZGF0YS5TaG9ydE5hbWUoeCkpLmpvaW4oJywgJyksXHJcbiAgICAgICAgICAgIGZyOiB0aGluZ05hbWUgKyAnIG1hbnF1w6koZSkgc3VyICcgKyBtaXNzZWQubWFwKCh4KSA9PiBkYXRhLlNob3J0TmFtZSh4KSkuam9pbignLCAnKSxcclxuICAgICAgICAgICAgamE6ICcoJyArIG1pc3NlZC5tYXAoKHgpID0+IGRhdGEuU2hvcnROYW1lKHgpKS5qb2luKCcsICcpICsgJykg44GMJyArIHRoaW5nTmFtZSArICfjgpLlj5fjgZHjgarjgYvjgaPjgZ8nLFxyXG4gICAgICAgICAgICBjbjogbWlzc2VkLm1hcCgoeCkgPT4gZGF0YS5TaG9ydE5hbWUoeCkpLmpvaW4oJywgJykgKyAnIOayoeWPl+WIsCAnICsgdGhpbmdOYW1lLFxyXG4gICAgICAgICAgICBrbzogdGhpbmdOYW1lICsgJyAnICsgbWlzc2VkLm1hcCgoeCkgPT4gZGF0YS5TaG9ydE5hbWUoeCkpLmpvaW4oJywgJykgKyAn7JeQ6rKMIOyggeyaqeyViOuQqCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgLy8gSWYgdGhlcmUncyB0b28gbWFueSBwZW9wbGUsIGp1c3QgbGlzdCB0aGUgbnVtYmVyIG9mIHBlb3BsZSBtaXNzZWQuXHJcbiAgICAgIC8vIFRPRE86IHdlIGNvdWxkIGFsc28gbGlzdCBldmVyeWJvZHkgb24gc2VwYXJhdGUgbGluZXM/XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYXJncy50eXBlLFxyXG4gICAgICAgIGJsYW1lOiBzb3VyY2VOYW1lLFxyXG4gICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgIGVuOiB0aGluZ05hbWUgKyAnIG1pc3NlZCAnICsgbWlzc2VkLmxlbmd0aCArICcgcGVvcGxlJyxcclxuICAgICAgICAgIGRlOiB0aGluZ05hbWUgKyAnIHZlcmZlaGx0ZSAnICsgbWlzc2VkLmxlbmd0aCArICcgUGVyc29uZW4nLFxyXG4gICAgICAgICAgZnI6IHRoaW5nTmFtZSArICcgbWFucXXDqShlKSBzdXIgJyArIG1pc3NlZC5sZW5ndGggKyAnIHBlcnNvbm5lcycsXHJcbiAgICAgICAgICBqYTogbWlzc2VkLmxlbmd0aCArICfkurrjgYwnICsgdGhpbmdOYW1lICsgJ+OCkuWPl+OBkeOBquOBi+OBo+OBnycsXHJcbiAgICAgICAgICBjbjogJ+aciScgKyBtaXNzZWQubGVuZ3RoICsgJ+S6uuayoeWPl+WIsCAnICsgdGhpbmdOYW1lLFxyXG4gICAgICAgICAga286IHRoaW5nTmFtZSArICcgJyArIG1pc3NlZC5sZW5ndGggKyAn66qF7JeQ6rKMIOyggeyaqeyViOuQqCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IG1pc3NlZE1pdGlnYXRpb25CdWZmID0gKGFyZ3MpID0+IHtcclxuICBpZiAoIWFyZ3MuZWZmZWN0SWQpXHJcbiAgICBjb25zb2xlLmVycm9yKCdNaXNzaW5nIGVmZmVjdElkOiAnICsgSlNPTi5zdHJpbmdpZnkoYXJncykpO1xyXG4gIHJldHVybiBtaXNzZWRGdW5jKHtcclxuICAgIHRyaWdnZXJJZDogYXJncy5pZCxcclxuICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6IGFyZ3MuZWZmZWN0SWQgfSksXHJcbiAgICBmaWVsZDogJ2VmZmVjdCcsXHJcbiAgICB0eXBlOiAnaGVhbCcsXHJcbiAgICBpZ25vcmVTZWxmOiBhcmdzLmlnbm9yZVNlbGYsXHJcbiAgICBjb2xsZWN0U2Vjb25kczogYXJncy5jb2xsZWN0U2Vjb25kcyA/IGFyZ3MuY29sbGVjdFNlY29uZHMgOiBlZmZlY3RDb2xsZWN0U2Vjb25kcyxcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IG1pc3NlZERhbWFnZUFiaWxpdHkgPSAoYXJncykgPT4ge1xyXG4gIGlmICghYXJncy5hYmlsaXR5SWQpXHJcbiAgICBjb25zb2xlLmVycm9yKCdNaXNzaW5nIGFiaWxpdHlJZDogJyArIEpTT04uc3RyaW5naWZ5KGFyZ3MpKTtcclxuICByZXR1cm4gbWlzc2VkRnVuYyh7XHJcbiAgICB0cmlnZ2VySWQ6IGFyZ3MuaWQsXHJcbiAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6IGFyZ3MuYWJpbGl0eUlkIH0pLFxyXG4gICAgZmllbGQ6ICdhYmlsaXR5JyxcclxuICAgIHR5cGU6ICdkYW1hZ2UnLFxyXG4gICAgaWdub3JlU2VsZjogYXJncy5pZ25vcmVTZWxmLFxyXG4gICAgY29sbGVjdFNlY29uZHM6IGFyZ3MuY29sbGVjdFNlY29uZHMgPyBhcmdzLmNvbGxlY3RTZWNvbmRzIDogYWJpbGl0eUNvbGxlY3RTZWNvbmRzLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgbWlzc2VkSGVhbCA9IChhcmdzKSA9PiB7XHJcbiAgaWYgKCFhcmdzLmFiaWxpdHlJZClcclxuICAgIGNvbnNvbGUuZXJyb3IoJ01pc3NpbmcgYWJpbGl0eUlkOiAnICsgSlNPTi5zdHJpbmdpZnkoYXJncykpO1xyXG4gIHJldHVybiBtaXNzZWRGdW5jKHtcclxuICAgIHRyaWdnZXJJZDogYXJncy5pZCxcclxuICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogYXJncy5hYmlsaXR5SWQgfSksXHJcbiAgICBmaWVsZDogJ2FiaWxpdHknLFxyXG4gICAgdHlwZTogJ2hlYWwnLFxyXG4gICAgY29sbGVjdFNlY29uZHM6IGFyZ3MuY29sbGVjdFNlY29uZHMgPyBhcmdzLmNvbGxlY3RTZWNvbmRzIDogYWJpbGl0eUNvbGxlY3RTZWNvbmRzLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgbWlzc2VkTWl0aWdhdGlvbkFiaWxpdHkgPSBtaXNzZWRIZWFsO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLk1hdGNoQWxsLFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnQnVmZiBQZXQgVG8gT3duZXIgTWFwcGVyJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWRkZWRDb21iYXRhbnRGdWxsKCksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgaWYgKG1hdGNoZXMub3duZXJJZCA9PT0gJzAnKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBkYXRhLnBldElkVG9Pd25lcklkID0gZGF0YS5wZXRJZFRvT3duZXJJZCB8fCB7fTtcclxuICAgICAgICAvLyBGaXggYW55IGxvd2VyY2FzZSBpZHMuXHJcbiAgICAgICAgZGF0YS5wZXRJZFRvT3duZXJJZFttYXRjaGVzLmlkLnRvVXBwZXJDYXNlKCldID0gbWF0Y2hlcy5vd25lcklkLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0J1ZmYgUGV0IFRvIE93bmVyIENsZWFyZXInLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5jaGFuZ2Vab25lKCksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgLy8gQ2xlYXIgdGhpcyBoYXNoIHBlcmlvZGljYWxseSBzbyBpdCBkb2Vzbid0IGhhdmUgZmFsc2UgcG9zaXRpdmVzLlxyXG4gICAgICAgIGRhdGEucGV0SWRUb093bmVySWQgPSB7fTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gUHJlZmVyIGFiaWxpdGllcyB0byBlZmZlY3RzLCBhcyBlZmZlY3RzIHRha2UgbG9uZ2VyIHRvIHJvbGwgdGhyb3VnaCB0aGUgcGFydHkuXHJcbiAgICAvLyBIb3dldmVyLCBzb21lIHRoaW5ncyBhcmUgb25seSBlZmZlY3RzIGFuZCBzbyB0aGVyZSBpcyBubyBjaG9pY2UuXHJcblxyXG4gICAgLy8gRm9yIHRoaW5ncyB5b3UgY2FuIHN0ZXAgaW4gb3Igb3V0IG9mLCBnaXZlIGEgbG9uZ2VyIHRpbWVyPyAgVGhpcyBpc24ndCBwZXJmZWN0LlxyXG4gICAgLy8gVE9ETzogaW5jbHVkZSBzb2lsIGhlcmU/P1xyXG4gICAgbWlzc2VkTWl0aWdhdGlvbkJ1ZmYoeyBpZDogJ0NvbGxlY3RpdmUgVW5jb25zY2lvdXMnLCBlZmZlY3RJZDogJzM1MScsIGNvbGxlY3RTZWNvbmRzOiAxMCB9KSxcclxuICAgIG1pc3NlZE1pdGlnYXRpb25CdWZmKHsgaWQ6ICdQYXNzYWdlIG9mIEFybXMnLCBlZmZlY3RJZDogJzQ5OCcsIGlnbm9yZVNlbGY6IHRydWUsIGNvbGxlY3RTZWNvbmRzOiAxMCB9KSxcclxuXHJcbiAgICBtaXNzZWRNaXRpZ2F0aW9uQnVmZih7IGlkOiAnRGl2aW5lIFZlaWwnLCBlZmZlY3RJZDogJzJENycsIGlnbm9yZVNlbGY6IHRydWUgfSksXHJcblxyXG4gICAgbWlzc2VkTWl0aWdhdGlvbkFiaWxpdHkoeyBpZDogJ0hlYXJ0IE9mIExpZ2h0JywgYWJpbGl0eUlkOiAnM0YyMCcgfSksXHJcbiAgICBtaXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSh7IGlkOiAnRGFyayBNaXNzaW9uYXJ5JywgYWJpbGl0eUlkOiAnNDA1NycgfSksXHJcbiAgICBtaXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSh7IGlkOiAnU2hha2UgSXQgT2ZmJywgYWJpbGl0eUlkOiAnMUNEQycgfSksXHJcblxyXG4gICAgLy8gM0Y0NCBpcyB0aGUgY29ycmVjdCBRdWFkcnVwbGUgVGVjaG5pY2FsIEZpbmlzaCwgb3RoZXJzIGFyZSBEaW5reSBUZWNobmljYWwgRmluaXNoLlxyXG4gICAgbWlzc2VkRGFtYWdlQWJpbGl0eSh7IGlkOiAnVGVjaG5pY2FsIEZpbmlzaCcsIGFiaWxpdHlJZDogJzNGNFsxLTRdJyB9KSxcclxuICAgIG1pc3NlZERhbWFnZUFiaWxpdHkoeyBpZDogJ0RpdmluYXRpb24nLCBhYmlsaXR5SWQ6ICc0MEE4JyB9KSxcclxuICAgIG1pc3NlZERhbWFnZUFiaWxpdHkoeyBpZDogJ0Jyb3RoZXJob29kJywgYWJpbGl0eUlkOiAnMUNFNCcgfSksXHJcbiAgICBtaXNzZWREYW1hZ2VBYmlsaXR5KHsgaWQ6ICdCYXR0bGUgTGl0YW55JywgYWJpbGl0eUlkOiAnREU1JyB9KSxcclxuICAgIG1pc3NlZERhbWFnZUFiaWxpdHkoeyBpZDogJ0VtYm9sZGVuJywgYWJpbGl0eUlkOiAnMUQ2MCcgfSksXHJcbiAgICBtaXNzZWREYW1hZ2VBYmlsaXR5KHsgaWQ6ICdCYXR0bGUgVm9pY2UnLCBhYmlsaXR5SWQ6ICc3NicsIGlnbm9yZVNlbGY6IHRydWUgfSksXHJcblxyXG4gICAgLy8gVG9vIG5vaXN5IChwcm9jcyBldmVyeSB0aHJlZSBzZWNvbmRzLCBhbmQgYmFyZHMgb2Z0ZW4gb2ZmIGRvaW5nIG1lY2hhbmljcykuXHJcbiAgICAvLyBtaXNzZWREYW1hZ2VCdWZmKHsgaWQ6ICdXYW5kZXJlclxcJ3MgTWludWV0JywgZWZmZWN0SWQ6ICc4QTgnLCBpZ25vcmVTZWxmOiB0cnVlIH0pLFxyXG4gICAgLy8gbWlzc2VkRGFtYWdlQnVmZih7IGlkOiAnTWFnZVxcJ3MgQmFsbGFkJywgZWZmZWN0SWQ6ICc4QTknLCBpZ25vcmVTZWxmOiB0cnVlIH0pLFxyXG4gICAgLy8gbWlzc2VkRGFtYWdlQnVmZih7IGlkOiAnQXJteVxcJ3MgUGFlb24nLCBlZmZlY3RJZDogJzhBQScsIGlnbm9yZVNlbGY6IHRydWUgfSksXHJcblxyXG4gICAgbWlzc2VkTWl0aWdhdGlvbkFiaWxpdHkoeyBpZDogJ1Ryb3ViYWRvdXInLCBhYmlsaXR5SWQ6ICcxQ0VEJyB9KSxcclxuICAgIG1pc3NlZE1pdGlnYXRpb25BYmlsaXR5KHsgaWQ6ICdUYWN0aWNpYW4nLCBhYmlsaXR5SWQ6ICc0MUY5JyB9KSxcclxuICAgIG1pc3NlZE1pdGlnYXRpb25BYmlsaXR5KHsgaWQ6ICdTaGllbGQgU2FtYmEnLCBhYmlsaXR5SWQ6ICczRThDJyB9KSxcclxuXHJcbiAgICBtaXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSh7IGlkOiAnTWFudHJhJywgYWJpbGl0eUlkOiAnNDEnIH0pLFxyXG5cclxuICAgIG1pc3NlZERhbWFnZUFiaWxpdHkoeyBpZDogJ0Rldm90aW9uJywgYWJpbGl0eUlkOiAnMUQxQScgfSksXHJcblxyXG4gICAgLy8gTWF5YmUgdXNpbmcgYSBoZWFsZXIgTEIxL0xCMiBzaG91bGQgYmUgYW4gZXJyb3IgZm9yIHRoZSBoZWFsZXIuIE86KVxyXG4gICAgLy8gbWlzc2VkSGVhbCh7IGlkOiAnSGVhbGluZyBXaW5kJywgYWJpbGl0eUlkOiAnQ0UnIH0pLFxyXG4gICAgLy8gbWlzc2VkSGVhbCh7IGlkOiAnQnJlYXRoIG9mIHRoZSBFYXJ0aCcsIGFiaWxpdHlJZDogJ0NGJyB9KSxcclxuXHJcbiAgICBtaXNzZWRIZWFsKHsgaWQ6ICdNZWRpY2EnLCBhYmlsaXR5SWQ6ICc3QycgfSksXHJcbiAgICBtaXNzZWRIZWFsKHsgaWQ6ICdNZWRpY2EgSUknLCBhYmlsaXR5SWQ6ICc4NScgfSksXHJcbiAgICBtaXNzZWRIZWFsKHsgaWQ6ICdBZmZsYXR1cyBSYXB0dXJlJywgYWJpbGl0eUlkOiAnNDA5NicgfSksXHJcbiAgICBtaXNzZWRIZWFsKHsgaWQ6ICdUZW1wZXJhbmNlJywgYWJpbGl0eUlkOiAnNzUxJyB9KSxcclxuICAgIG1pc3NlZEhlYWwoeyBpZDogJ1BsZW5hcnkgSW5kdWxnZW5jZScsIGFiaWxpdHlJZDogJzFEMDknIH0pLFxyXG4gICAgbWlzc2VkSGVhbCh7IGlkOiAnUHVsc2Ugb2YgTGlmZScsIGFiaWxpdHlJZDogJ0QwJyB9KSxcclxuXHJcbiAgICBtaXNzZWRIZWFsKHsgaWQ6ICdTdWNjb3InLCBhYmlsaXR5SWQ6ICdCQScgfSksXHJcbiAgICBtaXNzZWRIZWFsKHsgaWQ6ICdJbmRvbWl0YWJpbGl0eScsIGFiaWxpdHlJZDogJ0RGRicgfSksXHJcbiAgICBtaXNzZWRIZWFsKHsgaWQ6ICdEZXBsb3ltZW50IFRhY3RpY3MnLCBhYmlsaXR5SWQ6ICdFMDEnIH0pLFxyXG4gICAgbWlzc2VkSGVhbCh7IGlkOiAnV2hpc3BlcmluZyBEYXduJywgYWJpbGl0eUlkOiAnMzIzJyB9KSxcclxuICAgIG1pc3NlZEhlYWwoeyBpZDogJ0ZleSBCbGVzc2luZycsIGFiaWxpdHlJZDogJzQwQTAnIH0pLFxyXG4gICAgbWlzc2VkSGVhbCh7IGlkOiAnQ29uc29sYXRpb24nLCBhYmlsaXR5SWQ6ICc0MEEzJyB9KSxcclxuICAgIG1pc3NlZEhlYWwoeyBpZDogJ0FuZ2VsXFwncyBXaGlzcGVyJywgYWJpbGl0eUlkOiAnNDBBNicgfSksXHJcbiAgICBtaXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSh7IGlkOiAnRmV5IElsbHVtaW5hdGlvbicsIGFiaWxpdHlJZDogJzMyNScgfSksXHJcbiAgICBtaXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSh7IGlkOiAnU2VyYXBoaWMgSWxsdW1pbmF0aW9uJywgYWJpbGl0eUlkOiAnNDBBNycgfSksXHJcbiAgICBtaXNzZWRIZWFsKHsgaWQ6ICdBbmdlbCBGZWF0aGVycycsIGFiaWxpdHlJZDogJzEwOTcnIH0pLFxyXG5cclxuICAgIG1pc3NlZEhlYWwoeyBpZDogJ0hlbGlvcycsIGFiaWxpdHlJZDogJ0UxMCcgfSksXHJcbiAgICBtaXNzZWRIZWFsKHsgaWQ6ICdBc3BlY3RlZCBIZWxpb3MnLCBhYmlsaXR5SWQ6ICdFMTEnIH0pLFxyXG4gICAgbWlzc2VkSGVhbCh7IGlkOiAnQXNwZWN0ZWQgSGVsaW9zJywgYWJpbGl0eUlkOiAnMzIwMCcgfSksXHJcbiAgICBtaXNzZWRIZWFsKHsgaWQ6ICdDZWxlc3RpYWwgT3Bwb3NpdGlvbicsIGFiaWxpdHlJZDogJzQwQTknIH0pLFxyXG4gICAgbWlzc2VkSGVhbCh7IGlkOiAnQXN0cmFsIFN0YXNpcycsIGFiaWxpdHlJZDogJzEwOTgnIH0pLFxyXG5cclxuICAgIG1pc3NlZEhlYWwoeyBpZDogJ1doaXRlIFdpbmQnLCBhYmlsaXR5SWQ6ICcyQzhFJyB9KSxcclxuICAgIG1pc3NlZEhlYWwoeyBpZDogJ0dvYnNraW4nLCBhYmlsaXR5SWQ6ICc0NzgwJyB9KSxcclxuXHJcbiAgICAvLyBUT0RPOiBleHBvcnQgYWxsIG9mIHRoZXNlIG1pc3NlZCBmdW5jdGlvbnMgaW50byB0aGVpciBvd24gaGVscGVyXHJcbiAgICAvLyBhbmQgdGhlbiBhZGQgdGhpcyB0byB0aGUgRGVsdWJydW0gUmVnaW5hZSBmaWxlcyBkaXJlY3RseS5cclxuICAgIG1pc3NlZE1pdGlnYXRpb25BYmlsaXR5KHsgaWQ6ICdMb3N0IEFldGhlcnNoaWVsZCcsIGFiaWxpdHlJZDogJzU3NTMnIH0pLFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBHZW5lcmFsIG1pc3Rha2VzOyB0aGVzZSBhcHBseSBldmVyeXdoZXJlLlxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuTWF0Y2hBbGwsXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gVHJpZ2dlciBpZCBmb3IgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZWFybHkgcHVsbCB3YXJuaW5nLlxyXG4gICAgICBpZDogJ0dlbmVyYWwgRWFybHkgUHVsbCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0dlbmVyYWwgRm9vZCBCdWZmJyxcclxuICAgICAgLy8gV2VsbCBGZWRcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMubG9zZXNFZmZlY3QoeyBlZmZlY3RJZDogJzQ4JyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgLy8gUHJldmVudCBcIkVvcyBsb3NlcyB0aGUgZWZmZWN0IG9mIFdlbGwgRmVkIGZyb20gQ3JpdGxvIE1jZ2VlXCJcclxuICAgICAgICByZXR1cm4gbWF0Y2hlcy50YXJnZXQgPT09IG1hdGNoZXMuc291cmNlO1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmxvc3RGb29kID0gZGF0YS5sb3N0Rm9vZCB8fCB7fTtcclxuICAgICAgICAvLyBXZWxsIEZlZCBidWZmIGhhcHBlbnMgcmVwZWF0ZWRseSB3aGVuIGl0IGZhbGxzIG9mZiAoV0hZKSxcclxuICAgICAgICAvLyBzbyBzdXBwcmVzcyBtdWx0aXBsZSBvY2N1cnJlbmNlcy5cclxuICAgICAgICBpZiAoIWRhdGEuaW5Db21iYXQgfHwgZGF0YS5sb3N0Rm9vZFttYXRjaGVzLnRhcmdldF0pXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgZGF0YS5sb3N0Rm9vZFttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnd2FybicsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnbG9zdCBmb29kIGJ1ZmYnLFxyXG4gICAgICAgICAgICBkZTogJ05haHJ1bmdzYnVmZiB2ZXJsb3JlbicsXHJcbiAgICAgICAgICAgIGZyOiAnQnVmZiBub3Vycml0dXJlIHRlcm1pbsOpZScsXHJcbiAgICAgICAgICAgIGphOiAn6aOv5Yq55p6c44GM5aSx44Gj44GfJyxcclxuICAgICAgICAgICAgY246ICflpLHljrvpo5/nialCVUZGJyxcclxuICAgICAgICAgICAga286ICfsnYzsi50g67KE7ZSEIO2VtOygnCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0dlbmVyYWwgV2VsbCBGZWQnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnNDgnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGlmICghZGF0YS5sb3N0Rm9vZClcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBkZWxldGUgZGF0YS5sb3N0Rm9vZFttYXRjaGVzLnRhcmdldF07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0dlbmVyYWwgUmFiYml0IE1lZGl1bScsXHJcbiAgICAgIGFiaWxpdHlSZWdleDogJzhFMCcsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUsIGRhdGEpID0+IGRhdGEuSXNQbGF5ZXJJZChlLmF0dGFja2VySWQpLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnd2FybicsXHJcbiAgICAgICAgICBibGFtZTogZS5hdHRhY2tlck5hbWUsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnYnVubnknLFxyXG4gICAgICAgICAgICBkZTogJ0hhc2UnLFxyXG4gICAgICAgICAgICBmcjogJ2xhcGluJyxcclxuICAgICAgICAgICAgamE6ICfjgYbjgZXjgY4nLFxyXG4gICAgICAgICAgICBjbjogJ+WFlOWtkCcsXHJcbiAgICAgICAgICAgIGtvOiAn7Yag64G8JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRlc3QgbWlzdGFrZSB0cmlnZ2Vycy5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLk1pZGRsZUxhTm9zY2VhLFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVGVzdCBCb3cnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICdZb3UgYm93IGNvdXJ0ZW91c2x5IHRvIHRoZSBzdHJpa2luZyBkdW1teS4qPycgfSksXHJcbiAgICAgIG5ldFJlZ2V4RnI6IE5ldFJlZ2V4ZXMuZ2FtZU5hbWVMb2coeyBsaW5lOiAnVm91cyB2b3VzIGluY2xpbmV6IGRldmFudCBsZSBtYW5uZXF1aW4gZFxcJ2VudHJhw65uZW1lbnQuKj8nIH0pLFxyXG4gICAgICBuZXRSZWdleEphOiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJy4q44Gv5pyo5Lq644Gr44GK6L6e5YSA44GX44GfLio/JyB9KSxcclxuICAgICAgbmV0UmVnZXhDbjogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICcuKuaBreaVrOWcsOWvueacqOS6uuihjOekvC4qPycgfSksXHJcbiAgICAgIG5ldFJlZ2V4S286IE5ldFJlZ2V4ZXMuZ2FtZU5hbWVMb2coeyBsaW5lOiAnLirrgpjrrLTsnbjtmJXsl5Dqsowg6rO17IaQ7ZWY6rKMIOyduOyCrO2VqeuLiOuLpC4qPycgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgZGF0YSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAncHVsbCcsXHJcbiAgICAgICAgICBibGFtZTogZGF0YS5tZSxcclxuICAgICAgICAgIGZ1bGxUZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnQm93JyxcclxuICAgICAgICAgICAgZGU6ICdCb2dlbicsXHJcbiAgICAgICAgICAgIGZyOiAnU2FsdWVyJyxcclxuICAgICAgICAgICAgamE6ICfjgYrovp7lhIAnLFxyXG4gICAgICAgICAgICBjbjogJ+meoOi6rCcsXHJcbiAgICAgICAgICAgIGtvOiAn7J247IKsJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVGVzdCBXaXBlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FtZU5hbWVMb2coeyBsaW5lOiAnWW91IGJpZCBmYXJld2VsbCB0byB0aGUgc3RyaWtpbmcgZHVtbXkuKj8nIH0pLFxyXG4gICAgICBuZXRSZWdleEZyOiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJ1ZvdXMgZmFpdGVzIHZvcyBhZGlldXggYXUgbWFubmVxdWluIGRcXCdlbnRyYcOubmVtZW50Lio/JyB9KSxcclxuICAgICAgbmV0UmVnZXhKYTogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICcuKuOBr+acqOS6uuOBq+WIpeOCjOOBruaMqOaLtuOCkuOBl+OBny4qPycgfSksXHJcbiAgICAgIG5ldFJlZ2V4Q246IE5ldFJlZ2V4ZXMuZ2FtZU5hbWVMb2coeyBsaW5lOiAnLirlkJHmnKjkurrlkYrliKsuKj8nIH0pLFxyXG4gICAgICBuZXRSZWdleEtvOiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJy4q64KY66y07J247ZiV7JeQ6rKMIOyekeuzhCDsnbjsgqzrpbwg7ZWp64uI64ukLio/JyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9lLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICd3aXBlJyxcclxuICAgICAgICAgIGJsYW1lOiBkYXRhLm1lLFxyXG4gICAgICAgICAgZnVsbFRleHQ6IHtcclxuICAgICAgICAgICAgZW46ICdQYXJ0eSBXaXBlJyxcclxuICAgICAgICAgICAgZGU6ICdHcnVwcGVud2lwZScsXHJcbiAgICAgICAgICAgIGZyOiAnUGFydHkgV2lwZScsXHJcbiAgICAgICAgICAgIGphOiAn44Ov44Kk44OXJyxcclxuICAgICAgICAgICAgY246ICflm6Lnga0nLFxyXG4gICAgICAgICAgICBrbzogJ+2MjO2LsCDsoITrqbgnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdUZXN0IEJvb3RzaGluZScsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnMzUnLFxyXG4gICAgICBjb25kaXRpb246IChlLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgaWYgKGUuYXR0YWNrZXJOYW1lICE9PSBkYXRhLm1lKVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IHN0cmlraW5nRHVtbXlOYW1lcyA9IFtcclxuICAgICAgICAgICdTdHJpa2luZyBEdW1teScsXHJcbiAgICAgICAgICAnTWFubmVxdWluIGRcXCdlbnRyYcOubmVtZW50JyxcclxuICAgICAgICAgICfmnKjkuronLCAvLyBTdHJpa2luZyBEdW1teSBjYWxsZWQgYOacqOS6umAgaW4gQ04gYXMgd2VsbCBhcyBKQVxyXG4gICAgICAgICAgJ+uCmOustOyduO2YlScsXHJcbiAgICAgICAgICAvLyBGSVhNRTogYWRkIG90aGVyIGxhbmd1YWdlcyBoZXJlXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4gc3RyaWtpbmdEdW1teU5hbWVzLmluY2x1ZGVzKGUudGFyZ2V0TmFtZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIG1pc3Rha2U6IChlLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgZGF0YS5ib290Q291bnQgPSBkYXRhLmJvb3RDb3VudCB8fCAwO1xyXG4gICAgICAgIGRhdGEuYm9vdENvdW50Kys7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGUuYWJpbGl0eU5hbWUgKyAnICgnICsgZGF0YS5ib290Q291bnQgKyAnKTogJyArIGUuZGFtYWdlU3RyO1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGRhdGEubWUsIHRleHQ6IHRleHQgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVGVzdCBMZWFkZW4gRmlzdCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc3NDUnIH0pLFxyXG4gICAgICBjb25kaXRpb246IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4gbWF0Y2hlcy5zb3VyY2UgPT09IGRhdGEubWUsXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdnb29kJywgYmxhbWU6IGRhdGEubWUsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1Rlc3QgT29wcycsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmVjaG8oeyBsaW5lOiAnLipvb3BzLionIH0pLFxyXG4gICAgICBzdXBwcmVzc1NlY29uZHM6IDEwLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBkYXRhLm1lLCB0ZXh0OiBtYXRjaGVzLmxpbmUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVGVzdCBQb2tlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FtZU5hbWVMb2coeyBsaW5lOiAnWW91IHBva2UgdGhlIHN0cmlraW5nIGR1bW15Lio/JyB9KSxcclxuICAgICAgbmV0UmVnZXhGcjogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICdWb3VzIHRvdWNoZXogbMOpZ8OocmVtZW50IGxlIG1hbm5lcXVpbiBkXFwnZW50cmHDrm5lbWVudCBkdSBkb2lndC4qPycgfSksXHJcbiAgICAgIG5ldFJlZ2V4SmE6IE5ldFJlZ2V4ZXMuZ2FtZU5hbWVMb2coeyBsaW5lOiAnLirjga/mnKjkurrjgpLjgaTjgaTjgYTjgZ8uKj8nIH0pLFxyXG4gICAgICBuZXRSZWdleENuOiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJy4q55So5omL5oyH5oiz5ZCR5pyo5Lq6Lio/JyB9KSxcclxuICAgICAgbmV0UmVnZXhLbzogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICcuKuuCmOustOyduO2YleydhCDsv6Hsv6Eg7LCM66aF64uI64ukLio/JyB9KSxcclxuICAgICAgY29sbGVjdFNlY29uZHM6IDUsXHJcbiAgICAgIG1pc3Rha2U6IChldmVudHMsIGRhdGEpID0+IHtcclxuICAgICAgICAvLyBXaGVuIGNvbGxlY3RTZWNvbmRzIGlzIHNwZWNpZmllZCwgZXZlbnRzIGFyZSBwYXNzZWQgYXMgYW4gYXJyYXkuXHJcbiAgICAgICAgY29uc3QgcG9rZXMgPSBldmVudHMubGVuZ3RoO1xyXG5cclxuICAgICAgICAvLyAxIHBva2UgYXQgYSB0aW1lIGlzIGZpbmUsIGJ1dCBtb3JlIHRoYW4gb25lIGluc2lkZSBvZlxyXG4gICAgICAgIC8vIGNvbGxlY3RTZWNvbmRzIGlzIChPQlZJT1VTTFkpIGEgbWlzdGFrZS5cclxuICAgICAgICBpZiAocG9rZXMgPD0gMSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCB0ZXh0ID0ge1xyXG4gICAgICAgICAgZW46ICdUb28gbWFueSBwb2tlcyAoJyArIHBva2VzICsgJyknLFxyXG4gICAgICAgICAgZGU6ICdadSB2aWVsZSBQaWVrc2VyICgnICsgcG9rZXMgKyAnKScsXHJcbiAgICAgICAgICBmcjogJ1Ryb3AgZGUgdG91Y2hlcyAoJyArIHBva2VzICsgJyknLFxyXG4gICAgICAgICAgamE6ICfjgYTjgaPjgbHjgYTjgaTjgaTjgYTjgZ8gKCcgKyBwb2tlcyArICcpJyxcclxuICAgICAgICAgIGNuOiAn5oiz5aSq5aSa5LiL5ZWmICgnICsgcG9rZXMgKyAnKScsXHJcbiAgICAgICAgICBrbzogJ+uEiOustCDrp47snbQg7LCM66aEICgnICsgcG9rZXMgKyAn67KIKScsXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBkYXRhLm1lLCB0ZXh0OiB0ZXh0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gSWZyaXQgU3RvcnkgTW9kZVxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlQm93bE9mRW1iZXJzLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdJZnJpdE5tIFJhZGlhbnQgUGx1bWUnOiAnMkRFJyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICAvLyBUaGluZ3MgdGhhdCBzaG91bGQgb25seSBoaXQgb25lIHBlcnNvbi5cclxuICAgIHtcclxuICAgICAgaWQ6ICdJZnJpdE5tIEluY2luZXJhdGUnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzFDNScsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IGUudHlwZSAhPT0gJzE1JyxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnSWZyaXRObSBFcnVwdGlvbicsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnMkREJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSkgPT4gZS50eXBlICE9PSAnMTUnLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRpdGFuIFN0b3J5IE1vZGVcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZU5hdmVsLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdUaXRhbk5tIFdlaWdodCBPZiBUaGUgTGFuZCc6ICczQ0QnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ1RpdGFuTm0gTGFuZHNsaWRlJzogJzI4QScsXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdUaXRhbk5tIFJvY2sgQnVzdGVyJzogJzI4MScsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIEl0J3MgaGFyZCB0byBjYXB0dXJlIHRoZSByZWZsZWN0aW9uIGFiaWxpdGllcyBmcm9tIExldmlhdGhhbidzIEhlYWQgYW5kIFRhaWwgaWYgeW91IHVzZVxyXG4vLyByYW5nZWQgcGh5c2ljYWwgYXR0YWNrcyAvIG1hZ2ljIGF0dGFja3MgcmVzcGVjdGl2ZWx5LCBhcyB0aGUgYWJpbGl0eSBuYW1lcyBhcmUgdGhlXHJcbi8vIGFiaWxpdHkgeW91IHVzZWQgYW5kIGRvbid0IGFwcGVhciB0byBzaG93IHVwIGluIHRoZSBsb2cgYXMgbm9ybWFsIFwiYWJpbGl0eVwiIGxpbmVzLlxyXG4vLyBUaGF0IHNhaWQsIGRvdHMgc3RpbGwgdGljayBpbmRlcGVuZGVudGx5IG9uIGJvdGggc28gaXQncyBsaWtlbHkgdGhhdCBwZW9wbGUgd2lsbCBhdGFja1xyXG4vLyB0aGVtIGFueXdheS5cclxuXHJcbi8vIFRPRE86IEZpZ3VyZSBvdXQgd2h5IERyZWFkIFRpZGUgLyBXYXRlcnNwb3V0IGFwcGVhciBsaWtlIHNoYXJlcyAoaS5lLiAweDE2IGlkKS5cclxuLy8gRHJlYWQgVGlkZSA9IDgyMy84MjQvODI1LCBXYXRlcnNwb3V0ID0gODI5XHJcblxyXG4vLyBMZXZpYXRoYW4gRXh0cmVtZVxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlV2hvcmxlYXRlckV4dHJlbWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0xldmlFeCBHcmFuZCBGYWxsJzogJzgyRicsIC8vIHZlcnkgbGFyZ2UgY2lyY3VsYXIgYW9lIGJlZm9yZSBzcGlubnkgZGl2ZXMsIGFwcGxpZXMgaGVhdnlcclxuICAgICdMZXZpRXggSHlkcm8gU2hvdCc6ICc3NDgnLCAvLyBXYXZlc3BpbmUgU2FoYWdpbiBhb2UgdGhhdCBnaXZlcyBEcm9wc3kgZWZmZWN0XHJcbiAgICAnTGV2aUV4IERyZWFkc3Rvcm0nOiAnNzQ5JywgLy8gV2F2ZXRvb3RoIFNhaGFnaW4gYW9lIHRoYXQgZ2l2ZXMgSHlzdGVyaWEgZWZmZWN0XHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnTGV2aUV4IEJvZHkgU2xhbSc6ICc4MkEnLCAvLyBsZXZpIHNsYW0gdGhhdCB0aWx0cyB0aGUgYm9hdFxyXG4gICAgJ0xldmlFeCBTcGlubmluZyBEaXZlIDEnOiAnODhBJywgLy8gbGV2aSBkYXNoIGFjcm9zcyB0aGUgYm9hdCB3aXRoIGtub2NrYmFja1xyXG4gICAgJ0xldmlFeCBTcGlubmluZyBEaXZlIDInOiAnODhCJywgLy8gbGV2aSBkYXNoIGFjcm9zcyB0aGUgYm9hdCB3aXRoIGtub2NrYmFja1xyXG4gICAgJ0xldmlFeCBTcGlubmluZyBEaXZlIDMnOiAnODJDJywgLy8gbGV2aSBkYXNoIGFjcm9zcyB0aGUgYm9hdCB3aXRoIGtub2NrYmFja1xyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnTGV2aUV4IERyb3BzeSc6ICcxMTAnLCAvLyBzdGFuZGluZyBpbiB0aGUgaHlkcm8gc2hvdCBmcm9tIHRoZSBXYXZlc3BpbmUgU2FoYWdpblxyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RGYWlsOiB7XHJcbiAgICAnTGV2aUV4IEh5c3RlcmlhJzogJzEyOCcsIC8vIHN0YW5kaW5nIGluIHRoZSBkcmVhZHN0b3JtIGZyb20gdGhlIFdhdmV0b290aCBTYWhhZ2luXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0xldmlFeCBCb2R5IFNsYW0gS25vY2tlZCBPZmYnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICc4MkEnIH0pLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ0tub2NrZWQgb2ZmJyxcclxuICAgICAgICAgICAgZGU6ICdSdW50ZXJnZWZhbGxlbicsXHJcbiAgICAgICAgICAgIGZyOiAnQSDDqXTDqSBhc3NvbW3DqShlKScsXHJcbiAgICAgICAgICAgIGphOiAn44OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwsScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBTaGl2YSBIYXJkXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVBa2hBZmFoQW1waGl0aGVhdHJlSGFyZCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAvLyBMYXJnZSB3aGl0ZSBjaXJjbGVzLlxyXG4gICAgJ1NoaXZhSG0gSWNpY2xlIEltcGFjdCc6ICc5OTMnLFxyXG4gICAgLy8gQXZvaWRhYmxlIHRhbmsgc3R1bi5cclxuICAgICdTaGl2YUhtIEdsYWNpZXIgQmFzaCc6ICc5QTEnLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAvLyBLbm9ja2JhY2sgdGFuayBjbGVhdmUuXHJcbiAgICAnU2hpdmFIbSBIZWF2ZW5seSBTdHJpa2UnOiAnOUEwJyxcclxuICAgIC8vIEhhaWxzdG9ybSBzcHJlYWQgbWFya2VyLlxyXG4gICAgJ1NoaXZhSG0gSGFpbHN0b3JtJzogJzk5OCcsXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgIC8vIFRhbmtidXN0ZXIuICBUaGlzIGlzIFNoaXZhIEhhcmQgbW9kZSwgbm90IFNoaXZhIEV4dHJlbWUuICBQbGVhc2UhXHJcbiAgICAnU2hpdmFIbSBJY2VicmFuZCc6ICc5OTYnLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdTaGl2YUhtIERpYW1vbmQgRHVzdCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzk4QScgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEpID0+IHtcclxuICAgICAgICBkYXRhLnNlZW5EaWFtb25kRHVzdCA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1NoaXZhSG0gRGVlcCBGcmVlemUnLFxyXG4gICAgICAvLyBTaGl2YSBhbHNvIHVzZXMgYWJpbGl0eSA5QTMgb24geW91LCBidXQgaXQgaGFzIHRoZSB1bnRyYW5zbGF0ZWQgbmFtZVxyXG4gICAgICAvLyDpgI/mmI7vvJrjgrfjg7TjgqHvvJrlh43ntZDjg6zjgq/jg4jvvJrjg47jg4Pjgq/jg5Djg4Pjgq/nlKguIFNvLCB1c2UgdGhlIGVmZmVjdCBpbnN0ZWFkIGZvciBmcmVlIHRyYW5zbGF0aW9uLlxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMUU3JyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoX2UsIGRhdGEpID0+IHtcclxuICAgICAgICAvLyBUaGUgaW50ZXJtaXNzaW9uIGFsc28gZ2V0cyB0aGlzIGVmZmVjdCwgc28gb25seSBhIG1pc3Rha2UgYWZ0ZXIgdGhhdC5cclxuICAgICAgICAvLyBVbmxpa2UgZXh0cmVtZSwgdGhpcyBoYXMgdGhlIHNhbWUgMjAgc2Vjb25kIGR1cmF0aW9uIGFzIHRoZSBpbnRlcm1pc3Npb24uXHJcbiAgICAgICAgcmV0dXJuIGRhdGEuc2VlbkRpYW1vbmREdXN0O1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBTaGl2YSBFeHRyZW1lXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVBa2hBZmFoQW1waGl0aGVhdHJlRXh0cmVtZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAvLyBMYXJnZSB3aGl0ZSBjaXJjbGVzLlxyXG4gICAgJ1NoaXZhRXggSWNpY2xlIEltcGFjdCc6ICdCRUInLFxyXG4gICAgLy8gXCJnZXQgaW5cIiBhb2VcclxuICAgICdTaGl2YUV4IFdoaXRlb3V0JzogJ0JFQycsXHJcbiAgICAvLyBBdm9pZGFibGUgdGFuayBzdHVuLlxyXG4gICAgJ1NoaXZhRXggR2xhY2llciBCYXNoJzogJ0JFOScsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAvLyAyNzAgZGVncmVlIGF0dGFjay5cclxuICAgICdTaGl2YUV4IEdsYXNzIERhbmNlJzogJ0JERicsXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgIC8vIEhhaWxzdG9ybSBzcHJlYWQgbWFya2VyLlxyXG4gICAgJ1NoaXZhRXggSGFpbHN0b3JtJzogJ0JFMicsXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgIC8vIExhc2VyLiAgVE9ETzogbWF5YmUgYmxhbWUgdGhlIHBlcnNvbiBpdCdzIG9uPz9cclxuICAgICdTaGl2YUV4IEF2YWxhbmNoZSc6ICdCRTAnLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gUGFydHkgc2hhcmVkIHRhbmsgYnVzdGVyLlxyXG4gICAgICBpZDogJ1NoaXZhRXggSWNlYnJhbmQnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJ0JFMScsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IHtcclxuICAgICAgICAvLyBTaG91bGQgYmUgc2hhcmVkIHdpdGggZnJpZW5kcy5cclxuICAgICAgICByZXR1cm4gZS50eXBlID09PSAnMTUnO1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdTaGl2YUV4IERlZXAgRnJlZXplJyxcclxuICAgICAgLy8gU2hpdmEgYWxzbyB1c2VzIGFiaWxpdHkgQzhBIG9uIHlvdSwgYnV0IGl0IGhhcyB0aGUgdW50cmFuc2xhdGVkIG5hbWVcclxuICAgICAgLy8g6YCP5piO77ya44K344O044Kh77ya5YeN57WQ44Os44Kv44OI77ya44OO44OD44Kv44OQ44OD44Kv55SoL+ODkuODreOCpOODg+OCry4gU28sIHVzZSB0aGUgZWZmZWN0IGluc3RlYWQgZm9yIGZyZWUgdHJhbnNsYXRpb24uXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcxRTcnIH0pLFxyXG4gICAgICBjb25kaXRpb246IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICAvLyBUaGUgaW50ZXJtaXNzaW9uIGFsc28gZ2V0cyB0aGlzIGVmZmVjdCwgYnV0IGZvciBhIHNob3J0ZXIgZHVyYXRpb24uXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobWF0Y2hlcy5kdXJhdGlvbikgPiAyMDtcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRpdGFuIEhhcmRcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZU5hdmVsSGFyZCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnVGl0YW5IbSBXZWlnaHQgT2YgVGhlIExhbmQnOiAnNTUzJyxcclxuICAgICdUaXRhbkhtIEJ1cnN0JzogJzQxQycsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnVGl0YW5IbSBMYW5kc2xpZGUnOiAnNTU0JyxcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1RpdGFuSG0gUm9jayBCdXN0ZXInOiAnNTUwJyxcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgJ1RpdGFuSG0gTW91bnRhaW4gQnVzdGVyJzogJzI4MycsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUaXRhbiBFeHRyZW1lXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVOYXZlbEV4dHJlbWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1RpdGFuRXggV2VpZ2h0IE9mIFRoZSBMYW5kJzogJzVCRScsXHJcbiAgICAnVGl0YW5FeCBCdXJzdCc6ICc1QkYnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ1RpdGFuRXggTGFuZHNsaWRlJzogJzVCQicsXHJcbiAgICAnVGl0YW5FeCBHYW9sZXIgTGFuZHNsaWRlJzogJzVDMycsXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdUaXRhbkV4IFJvY2sgQnVzdGVyJzogJzVCNycsXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgICdUaXRhbkV4IE1vdW50YWluIEJ1c3Rlcic6ICc1QjgnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlV2VlcGluZ0NpdHlPZk1oYWNoLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdXZWVwaW5nIENyaXRpY2FsIEJpdGUnOiAnMTg0OCcsIC8vIFNhcnN1Y2h1cyBjb25lIGFvZVxyXG4gICAgJ1dlZXBpbmcgUmVhbG0gU2hha2VyJzogJzE4M0UnLCAvLyBGaXJzdCBEYXVnaHRlciBjaXJjbGUgYW9lXHJcbiAgICAnV2VlcGluZyBTaWxrc2NyZWVuJzogJzE4M0MnLCAvLyBGaXJzdCBEYXVnaHRlciBsaW5lIGFvZVxyXG4gICAgJ1dlZXBpbmcgU2lsa2VuIFNwcmF5JzogJzE4MjQnLCAvLyBBcmFjaG5lIEV2ZSByZWFyIGNvbmFsIGFvZVxyXG4gICAgJ1dlZXBpbmcgVHJlbWJsb3IgMSc6ICcxODM3JywgLy8gQXJhY2huZSBFdmUgZGlzYXBwZWFyIGNpcmNsZSBhb2UgMVxyXG4gICAgJ1dlZXBpbmcgVHJlbWJsb3IgMic6ICcxODM2JywgLy8gQXJhY2huZSBFdmUgZGlzYXBwZWFyIGNpcmNsZSBhb2UgMlxyXG4gICAgJ1dlZXBpbmcgVHJlbWJsb3IgMyc6ICcxODM1JywgLy8gQXJhY2huZSBFdmUgZGlzYXBwZWFyIGNpcmNsZSBhb2UgM1xyXG4gICAgJ1dlZXBpbmcgU3BpZGVyIFRocmVhZCc6ICcxODM5JywgLy8gQXJhY2huZSBFdmUgc3BpZGVyIGxpbmUgYW9lXHJcbiAgICAnV2VlcGluZyBGaXJlIElJJzogJzE4NEUnLCAvLyBCbGFjayBNYWdlIENvcnBzZSBjaXJjbGUgYW9lXHJcbiAgICAnV2VlcGluZyBOZWNyb3B1cmdlJzogJzE3RDcnLCAvLyBGb3JnYWxsIFNocml2ZWxlZCBUYWxvbiBsaW5lIGFvZVxyXG4gICAgJ1dlZXBpbmcgUm90dGVuIEJyZWF0aCc6ICcxN0QwJywgLy8gRm9yZ2FsbCBEYWhhayBjb25lIGFvZVxyXG4gICAgJ1dlZXBpbmcgTW93JzogJzE3RDInLCAvLyBGb3JnYWxsIEhhYWdlbnRpIHVubWFya2VkIGNsZWF2ZVxyXG4gICAgJ1dlZXBpbmcgRGFyayBFcnVwdGlvbic6ICcxN0MzJywgLy8gRm9yZ2FsbCBwdWRkbGUgbWFya2VyXHJcbiAgICAvLyAxODA2IGlzIGFsc28gRmxhcmUgU3RhciwgYnV0IGlmIHlvdSBnZXQgYnkgMTgwNSB5b3UgYWxzbyBnZXQgaGl0IGJ5IDE4MDY/XHJcbiAgICAnV2VlcGluZyBGbGFyZSBTdGFyJzogJzE4MDUnLCAvLyBPem1hIGN1YmUgcGhhc2UgZG9udXRcclxuICAgICdXZWVwaW5nIEV4ZWNyYXRpb24nOiAnMTgyOScsIC8vIE96bWEgdHJpYW5nbGUgbGFzZXJcclxuICAgICdXZWVwaW5nIEhhaXJjdXQgMSc6ICcxODBCJywgLy8gQ2Fsb2Zpc3RlcmkgMTgwIGNsZWF2ZSAxXHJcbiAgICAnV2VlcGluZyBIYWlyY3V0IDInOiAnMTgwRicsIC8vIENhbG9maXN0ZXJpIDE4MCBjbGVhdmUgMlxyXG4gICAgJ1dlZXBpbmcgRW50YW5nbGVtZW50JzogJzE4MUQnLCAvLyBDYWxvZmlzdGVyaSBsYW5kbWluZSBwdWRkbGUgcHJvY1xyXG4gICAgJ1dlZXBpbmcgRXZpbCBDdXJsJzogJzE4MTYnLCAvLyBDYWxvZmlzdGVyaSBheGVcclxuICAgICdXZWVwaW5nIEV2aWwgVHJlc3MnOiAnMTgxNycsIC8vIENhbG9maXN0ZXJpIGJ1bGJcclxuICAgICdXZWVwaW5nIERlcHRoIENoYXJnZSc6ICcxODIwJywgLy8gQ2Fsb2Zpc3RlcmkgY2hhcmdlIHRvIGVkZ2VcclxuICAgICdXZWVwaW5nIEZlaW50IFBhcnRpY2xlIEJlYW0nOiAnMTkyOCcsIC8vIENhbG9maXN0ZXJpIHNreSBsYXNlclxyXG4gICAgJ1dlZXBpbmcgRXZpbCBTd2l0Y2gnOiAnMTgxNScsIC8vIENhbG9maXN0ZXJpIGxhc2Vyc1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnV2VlcGluZyBBcmFjaG5lIFdlYic6ICcxODVFJywgLy8gQXJhY2huZSBFdmUgaGVhZG1hcmtlciB3ZWIgYW9lXHJcbiAgICAnV2VlcGluZyBFYXJ0aCBBZXRoZXInOiAnMTg0MScsIC8vIEFyYWNobmUgRXZlIG9yYnNcclxuICAgICdXZWVwaW5nIEVwaWdyYXBoJzogJzE4NTInLCAvLyBIZWFkc3RvbmUgdW50ZWxlZ3JhcGhlZCBsYXNlciBsaW5lIHRhbmsgYXR0YWNrXHJcbiAgICAvLyBUaGlzIGlzIHRvbyBub2lzeS4gIEJldHRlciB0byBwb3AgdGhlIGJhbGxvb25zIHRoYW4gd29ycnkgYWJvdXQgZnJpZW5kcy5cclxuICAgIC8vICdXZWVwaW5nIEV4cGxvc2lvbic6ICcxODA3JywgLy8gT3ptYXNwaGVyZSBDdWJlIG9yYiBleHBsb3Npb25cclxuICAgICdXZWVwaW5nIFNwbGl0IEVuZCAxJzogJzE4MEMnLCAvLyBDYWxvZmlzdGVyaSB0YW5rIGNsZWF2ZSAxXHJcbiAgICAnV2VlcGluZyBTcGxpdCBFbmQgMic6ICcxODEwJywgLy8gQ2Fsb2Zpc3RlcmkgdGFuayBjbGVhdmUgMlxyXG4gICAgJ1dlZXBpbmcgQmxvb2RpZWQgTmFpbCc6ICcxODFGJywgLy8gQ2Fsb2Zpc3RlcmkgYXhlL2J1bGIgYXBwZWFyaW5nXHJcbiAgfSxcclxuICBnYWluc0VmZmVjdFdhcm46IHtcclxuICAgICdXZWVwaW5nIEh5c3RlcmlhJzogJzEyOCcsIC8vIEFyYWNobmUgRXZlIEZyb25kIEFmZmVhcmRcclxuICAgICdXZWVwaW5nIFpvbWJpZmljYXRpb24nOiAnMTczJywgLy8gRm9yZ2FsbCB0b28gbWFueSB6b21iaWUgcHVkZGxlc1xyXG4gICAgJ1dlZXBpbmcgVG9hZCc6ICcxQjcnLCAvLyBGb3JnYWxsIEJyYW5kIG9mIHRoZSBGYWxsZW4gZmFpbHVyZVxyXG4gICAgJ1dlZXBpbmcgRG9vbSc6ICczOEUnLCAvLyBGb3JnYWxsIEhhYWdlbnRpIE1vcnRhbCBSYXlcclxuICAgICdXZWVwaW5nIEFzc2ltaWxhdGlvbic6ICc0MkMnLCAvLyBPem1hc2hhZGUgQXNzaW1pbGF0aW9uIGxvb2stYXdheVxyXG4gICAgJ1dlZXBpbmcgU3R1bic6ICc5NScsIC8vIENhbG9maXN0ZXJpIFBlbmV0cmF0aW9uIGxvb2stYXdheVxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdXZWVwaW5nIEZvcmdhbGwgR3JhZHVhbCBab21iaWZpY2F0aW9uIEdhaW4nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnNDE1JyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLnpvbWJpZSA9IGRhdGEuem9tYmllIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuem9tYmllW21hdGNoZXMudGFyZ2V0XSA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1dlZXBpbmcgRm9yZ2FsbCBHcmFkdWFsIFpvbWJpZmljYXRpb24gTG9zZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmxvc2VzRWZmZWN0KHsgZWZmZWN0SWQ6ICc0MTUnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuem9tYmllID0gZGF0YS56b21iaWUgfHwge307XHJcbiAgICAgICAgZGF0YS56b21iaWVbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1dlZXBpbmcgRm9yZ2FsbCBNZWdhIERlYXRoJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMTdDQScgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLnpvbWJpZSAmJiAhZGF0YS56b21iaWVbbWF0Y2hlcy50YXJnZXRdLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdXZWVwaW5nIEhlYWRzdG9uZSBTaGllbGQgR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcxNUUnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuc2hpZWxkID0gZGF0YS5zaGllbGQgfHwge307XHJcbiAgICAgICAgZGF0YS5zaGllbGRbbWF0Y2hlcy50YXJnZXRdID0gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnV2VlcGluZyBIZWFkc3RvbmUgU2hpZWxkIExvc2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnMTVFJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLnNoaWVsZCA9IGRhdGEuc2hpZWxkIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuc2hpZWxkW21hdGNoZXMudGFyZ2V0XSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdXZWVwaW5nIEZsYXJpbmcgRXBpZ3JhcGgnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICcxODU2JyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IGRhdGEuc2hpZWxkICYmICFkYXRhLnNoaWVsZFttYXRjaGVzLnRhcmdldF0sXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBUaGlzIGFiaWxpdHkgbmFtZSBpcyBoZWxwZnVsbHkgY2FsbGVkIFwiQXR0YWNrXCIgc28gbmFtZSBpdCBzb21ldGhpbmcgZWxzZS5cclxuICAgICAgaWQ6ICdXZWVwaW5nIE96bWEgVGFuayBMYXNlcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzE4MzEnIH0pLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ3dhcm4nLFxyXG4gICAgICAgICAgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogJ1RhbmsgTGFzZXInLFxyXG4gICAgICAgICAgICBkZTogJ1RhbmsgTGFzZXInLFxyXG4gICAgICAgICAgICBmcjogJ1RhbmsgTGFzZXInLFxyXG4gICAgICAgICAgICBqYTogJ+OCv+ODs+OCr+ODrOOCtuODvCcsXHJcbiAgICAgICAgICAgIGNuOiAn5Z2m5YWL5r+A5YWJJyxcclxuICAgICAgICAgICAga286ICftg7Hsu6Qg66CI7J207KCAJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnV2VlcGluZyBPem1hIEhvbHknLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICcxODJFJyB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdTbGlkIG9mZiEnLFxyXG4gICAgICAgICAgICBkZTogJ2lzdCBydW50ZXJnZXJ1dHNjaHQhJyxcclxuICAgICAgICAgICAgZnI6ICdBIGdsaXNzw6koZSkgIScsXHJcbiAgICAgICAgICAgIGphOiAn44OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDvvIEnLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwseuQqCEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gQWV0aGVyb2NoZW1pY2FsIFJlc2VhcmNoIEZhY2lsaXR5XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVBZXRoZXJvY2hlbWljYWxSZXNlYXJjaEZhY2lsaXR5LFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdBUkYgR3JhbmQgU3dvcmQnOiAnMjE2JywgLy8gQ29uYWwgQW9FLCBTY3JhbWJsZWQgSXJvbiBHaWFudCB0cmFzaFxyXG4gICAgJ0FSRiBDZXJtZXQgRHJpbGwnOiAnMjBFJywgLy8gTGluZSBBb0UsIDZ0aCBMZWdpb24gTWFnaXRlayBWYW5ndWFyZCB0cmFzaFxyXG4gICAgJ0FSRiBNYWdpdGVrIFNsdWcnOiAnMTBEQicsIC8vIExpbmUgQW9FLCBib3NzIDFcclxuICAgICdBUkYgQWV0aGVyb2NoZW1pY2FsIEdyZW5hZG8nOiAnMTBFMicsIC8vIExhcmdlIHRhcmdldGVkIGNpcmNsZSBBb0UsIE1hZ2l0ZWsgVHVycmV0IElJLCBib3NzIDFcclxuICAgICdBUkYgTWFnaXRlayBTcHJlYWQnOiAnMTBEQycsIC8vIDI3MC1kZWdyZWUgcm9vbXdpZGUgQW9FLCBib3NzIDFcclxuICAgICdBUkYgRWVyaWUgU291bmR3YXZlJzogJzExNzAnLCAvLyBUYXJnZXRlZCBjaXJjbGUgQW9FLCBDdWx0dXJlZCBFbXB1c2EgdHJhc2gsIGJlZm9yZSBib3NzIDJcclxuICAgICdBUkYgVGFpbCBTbGFwJzogJzEyNUYnLCAvLyBDb25hbCBBb0UsIEN1bHR1cmVkIERhbmNlciB0cmFzaCwgYmVmb3JlIGJvc3MgMlxyXG4gICAgJ0FSRiBDYWxjaWZ5aW5nIE1pc3QnOiAnMTIzQScsIC8vIENvbmFsIEFvRSwgQ3VsdHVyZWQgTmFnYSB0cmFzaCwgYmVmb3JlIGJvc3MgMlxyXG4gICAgJ0FSRiBQdW5jdHVyZSc6ICcxMTcxJywgLy8gU2hvcnQgbGluZSBBb0UsIEN1bHR1cmVkIEVtcHVzYSB0cmFzaCwgYmVmb3JlIGJvc3MgMlxyXG4gICAgJ0FSRiBTaWRlc3dpcGUnOiAnMTFBNycsIC8vIENvbmFsIEFvRSwgQ3VsdHVyZWQgUmVwdG9pZCB0cmFzaCwgYmVmb3JlIGJvc3MgMlxyXG4gICAgJ0FSRiBHdXN0JzogJzM5NScsIC8vIFRhcmdldGVkIHNtYWxsIGNpcmNsZSBBb0UsIEN1bHR1cmVkIE1pcnJvcmtuaWdodCB0cmFzaCwgYmVmb3JlIGJvc3MgMlxyXG4gICAgJ0FSRiBNYXJyb3cgRHJhaW4nOiAnRDBFJywgLy8gQ29uYWwgQW9FLCBDdWx0dXJlZCBDaGltZXJhIHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnQVJGIFJpZGRsZSBPZiBUaGUgU3BoaW54JzogJzEwRTQnLCAvLyBUYXJnZXRlZCBjaXJjbGUgQW9FLCBib3NzIDJcclxuICAgICdBUkYgS2EnOiAnMTA2RScsIC8vIENvbmFsIEFvRSwgYm9zcyAyXHJcbiAgICAnQVJGIFJvdG9zd2lwZSc6ICcxMUNDJywgLy8gQ29uYWwgQW9FLCBGYWNpbGl0eSBEcmVhZG5vdWdodCB0cmFzaCwgYmVmb3JlIGJvc3MgM1xyXG4gICAgJ0FSRiBBdXRvLWNhbm5vbnMnOiAnMTJEOScsIC8vIExpbmUgQW9FLCBNb25pdG9yaW5nIERyb25lIHRyYXNoLCBiZWZvcmUgYm9zcyAzXHJcbiAgICAnQVJGIERlYXRoXFwncyBEb29yJzogJzRFQycsIC8vIExpbmUgQW9FLCBDdWx0dXJlZCBTaGFidGkgdHJhc2gsIGJlZm9yZSBib3NzIDNcclxuICAgICdBUkYgU3BlbGxzd29yZCc6ICc0RUInLCAvLyBDb25hbCBBb0UsIEN1bHR1cmVkIFNoYWJ0aSB0cmFzaCwgYmVmb3JlIGJvc3MgM1xyXG4gICAgJ0FSRiBFbmQgT2YgRGF5cyc6ICcxMEZEJywgLy8gTGluZSBBb0UsIGJvc3MgM1xyXG4gICAgJ0FSRiBCbGl6emFyZCBCdXJzdCc6ICcxMEZFJywgLy8gRml4ZWQgY2lyY2xlIEFvRXMsIElnZXlvcmhtLCBib3NzIDNcclxuICAgICdBUkYgRmlyZSBCdXJzdCc6ICcxMEZGJywgLy8gRml4ZWQgY2lyY2xlIEFvRXMsIExhaGFicmVhLCBib3NzIDNcclxuICAgICdBUkYgU2VhIE9mIFBpdGNoJzogJzEyREUnLCAvLyBUYXJnZXRlZCBwZXJzaXN0ZW50IGNpcmNsZSBBb0VzLCBib3NzIDNcclxuICAgICdBUkYgRGFyayBCbGl6emFyZCBJSSc6ICcxMEYzJywgLy8gUmFuZG9tIGNpcmNsZSBBb0VzLCBJZ2V5b3JobSwgYm9zcyAzXHJcbiAgICAnQVJGIERhcmsgRmlyZSBJSSc6ICcxMEY4JywgLy8gUmFuZG9tIGNpcmNsZSBBb0VzLCBMYWhhYnJlYSwgYm9zcyAzXHJcbiAgICAnQVJGIEFuY2llbnQgRXJ1cHRpb24nOiAnMTEwNCcsIC8vIFNlbGYtdGFyZ2V0ZWQgY2lyY2xlIEFvRSwgYm9zcyA0XHJcbiAgICAnQVJGIEVudHJvcGljIEZsYW1lJzogJzExMDgnLCAvLyBMaW5lIEFvRXMsICBib3NzIDRcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0FSRiBDaHRob25pYyBIdXNoJzogJzEwRTcnLCAvLyBJbnN0YW50IHRhbmsgY2xlYXZlLCBib3NzIDJcclxuICAgICdBUkYgSGVpZ2h0IE9mIENoYW9zJzogJzExMDEnLCAvLyBUYW5rIGNsZWF2ZSwgYm9zcyA0XHJcbiAgICAnQVJGIEFuY2llbnQgQ2lyY2xlJzogJzExMDInLCAvLyBUYXJnZXRlZCBkb251dCBBb0VzLCBib3NzIDRcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnQVJGIFBldHJpZmFjdGlvbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcwMScgfSksXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogZS50YXJnZXQsIHRleHQ6IGUuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gRnJhY3RhbCBDb250aW51dW1cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUZyYWN0YWxDb250aW51dW0sXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0ZyYWN0YWwgRG91YmxlIFNldmVyJzogJ0Y3RCcsIC8vIENvbmFscywgYm9zcyAxXHJcbiAgICAnRnJhY3RhbCBBZXRoZXJpYyBDb21wcmVzc2lvbic6ICdGODAnLCAvLyBHcm91bmQgQW9FIGNpcmNsZXMsIGJvc3MgMVxyXG4gICAgJ0ZyYWN0YWwgMTEtVG9uemUgU3dpcGUnOiAnRjgxJywgLy8gRnJvbnRhbCBjb25lLCBib3NzIDJcclxuICAgICdGcmFjdGFsIDEwLVRvbnplIFNsYXNoJzogJ0Y4MycsIC8vIEZyb250YWwgbGluZSwgYm9zcyAyXHJcbiAgICAnRnJhY3RhbCAxMTEtVG9uemUgU3dpbmcnOiAnRjg3JywgLy8gR2V0LW91dCBBb0UsIGJvc3MgMlxyXG4gICAgJ0ZyYWN0YWwgQnJva2VuIEdsYXNzJzogJ0Y4RScsIC8vIEdsb3dpbmcgcGFuZWxzLCBib3NzIDNcclxuICAgICdGcmFjdGFsIE1pbmVzJzogJ0Y5MCcsXHJcbiAgICAnRnJhY3RhbCBTZWVkIG9mIHRoZSBSaXZlcnMnOiAnRjkxJywgLy8gR3JvdW5kIEFvRSBjaXJjbGVzLCBib3NzIDNcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0ZyYWN0YWwgU2FuY3RpZmljYXRpb24nOiAnRjg5JywgLy8gSW5zdGFudCBjb25hbCBidXN0ZXIsIGJvc3MgM1xyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlR3JlYXRHdWJhbExpYnJhcnlIYXJkLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdHdWJhbEhtIFRlcnJvciBFeWUnOiAnOTMwJywgLy8gQ2lyY2xlIEFvRSwgU3BpbmUgQnJlYWtlciB0cmFzaFxyXG4gICAgJ0d1YmFsSG0gQmF0dGVyJzogJzE5OEEnLCAvLyBDaXJjbGUgQW9FLCB0cmFzaCBiZWZvcmUgYm9zcyAxXHJcbiAgICAnR3ViYWxIbSBDb25kZW1uYXRpb24nOiAnMzkwJywgLy8gQ29uYWwgQW9FLCBCaWJsaW92b3JlIHRyYXNoXHJcbiAgICAnR3ViYWxIbSBEaXNjb250aW51ZSAxJzogJzE5NDMnLCAvLyBGYWxsaW5nIGJvb2sgc2hhZG93LCBib3NzIDFcclxuICAgICdHdWJhbEhtIERpc2NvbnRpbnVlIDInOiAnMTk0MCcsIC8vIFJ1c2ggQW9FIGZyb20gZW5kcywgYm9zcyAxXHJcbiAgICAnR3ViYWxIbSBEaXNjb250aW51ZSAzJzogJzE5NDInLCAvLyBSdXNoIEFvRSBhY3Jvc3MsIGJvc3MgMVxyXG4gICAgJ0d1YmFsSG0gRnJpZ2h0ZnVsIFJvYXInOiAnMTkzQicsIC8vIEdldC1PdXQgQW9FLCBib3NzIDFcclxuICAgICdHdWJhbEhtIElzc3VlIDEnOiAnMTkzRCcsIC8vIEluaXRpYWwgZW5kIGJvb2sgd2FybmluZyBBb0UsIGJvc3MgMVxyXG4gICAgJ0d1YmFsSG0gSXNzdWUgMic6ICcxOTNGJywgLy8gSW5pdGlhbCBlbmQgYm9vayB3YXJuaW5nIEFvRSwgYm9zcyAxXHJcbiAgICAnR3ViYWxIbSBJc3N1ZSAzJzogJzE5NDEnLCAvLyBJbml0aWFsIHNpZGUgYm9vayB3YXJuaW5nIEFvRSwgYm9zcyAxXHJcbiAgICAnR3ViYWxIbSBEZXNvbGF0aW9uJzogJzE5OEMnLCAvLyBMaW5lIEFvRSwgQmlibGlvY2xhc3QgdHJhc2hcclxuICAgICdHdWJhbEhtIERvdWJsZSBTbWFzaCc6ICcyNkEnLCAvLyBDb25hbCBBb0UsIEJpYmxpb2NsYXN0IHRyYXNoXHJcbiAgICAnR3ViYWxIbSBEYXJrbmVzcyc6ICczQTAnLCAvLyBDb25hbCBBb0UsIElua3N0YWluIHRyYXNoXHJcbiAgICAnR3ViYWxIbSBGaXJld2F0ZXInOiAnM0JBJywgLy8gQ2lyY2xlIEFvRSwgQmlibGlvY2xhc3QgdHJhc2hcclxuICAgICdHdWJhbEhtIEVsYm93IERyb3AnOiAnQ0JBJywgLy8gQ29uYWwgQW9FLCBCaWJsaW9jbGFzdCB0cmFzaFxyXG4gICAgJ0d1YmFsSG0gRGFyayc6ICcxOURGJywgLy8gTGFyZ2UgY2lyY2xlIEFvRSwgSW5rc3RhaW4gdHJhc2hcclxuICAgICdHdWJhbEhtIFNlYWxzJzogJzE5NEEnLCAvLyBTdW4vTW9vbnNlYWwgZmFpbHVyZSwgYm9zcyAyXHJcbiAgICAnR3ViYWxIbSBXYXRlciBJSUknOiAnMUM2NycsIC8vIExhcmdlIGNpcmNsZSBBb0UsIFBvcm9nbyBQZWdpc3QgdHJhc2hcclxuICAgICdHdWJhbEhtIFJhZ2luZyBBeGUnOiAnMTcwMycsIC8vIFNtYWxsIGNvbmFsIEFvRSwgTWVjaGFub3NlcnZpdG9yIHRyYXNoXHJcbiAgICAnR3ViYWxIbSBNYWdpYyBIYW1tZXInOiAnMTk5MCcsIC8vIExhcmdlIGNpcmNsZSBBb0UsIEFwYW5kYSBtaW5pLWJvc3NcclxuICAgICdHdWJhbEhtIFByb3BlcnRpZXMgT2YgR3Jhdml0eSc6ICcxOTUwJywgLy8gQ2lyY2xlIEFvRSBmcm9tIGdyYXZpdHkgcHVkZGxlcywgYm9zcyAzXHJcbiAgICAnR3ViYWxIbSBQcm9wZXJ0aWVzIE9mIExldml0YXRpb24nOiAnMTk0RicsIC8vIENpcmNsZSBBb0UgZnJvbSBsZXZpdGF0aW9uIHB1ZGRsZXMsIGJvc3MgM1xyXG4gICAgJ0d1YmFsSG0gQ29tZXQnOiAnMTk2OScsIC8vIFNtYWxsIGNpcmNsZSBBb0UsIGludGVybWlzc2lvbiwgYm9zcyAzXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnR3ViYWxIbSBFY2xpcHRpYyBNZXRlb3InOiAnMTk1QycsIC8vIExvUyBtZWNoYW5pYywgYm9zcyAzXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdHdWJhbEhtIFNlYXJpbmcgV2luZCc6ICcxOTQ0JywgLy8gVGFuayBjbGVhdmUsIGJvc3MgMlxyXG4gICAgJ0d1YmFsSG0gVGh1bmRlcic6ICcxOVtBQl0nLCAvLyBTcHJlYWQgbWFya2VyLCBib3NzIDNcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIEZpcmUgZ2F0ZSBpbiBoYWxsd2F5IHRvIGJvc3MgMiwgbWFnbmV0IGZhaWx1cmUgb24gYm9zcyAyXHJcbiAgICAgIGlkOiAnR3ViYWxIbSBCdXJucycsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcxMEInIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGUudGFyZ2V0LCB0ZXh0OiBlLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gSGVscGVyIGZvciBUaHVuZGVyIDMgZmFpbHVyZXNcclxuICAgICAgaWQ6ICdHdWJhbEhtIEltcCBHYWluJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzQ2RScgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNJbXAgPSBkYXRhLmhhc0ltcCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc0ltcFttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdHdWJhbEhtIEltcCBMb3NlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMubG9zZXNFZmZlY3QoeyBlZmZlY3RJZDogJzQ2RScgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNJbXAgPSBkYXRhLmhhc0ltcCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc0ltcFttYXRjaGVzLnRhcmdldF0gPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIFRhcmdldHMgd2l0aCBJbXAgd2hlbiBUaHVuZGVyIElJSSByZXNvbHZlcyByZWNlaXZlIGEgdnVsbmVyYWJpbGl0eSBzdGFjayBhbmQgYnJpZWYgc3R1blxyXG4gICAgICBpZDogJ0d1YmFsSG0gSW1wIFRodW5kZXInLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzE5NVtBQl0nLFxyXG4gICAgICBjb25kaXRpb246IChlLCBkYXRhKSA9PiBkYXRhLmhhc0ltcFtlLnRhcmdldE5hbWVdLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnd2FybicsXHJcbiAgICAgICAgICBibGFtZTogZS50YXJnZXROYW1lLFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogJ1Nob2NrZWQgSW1wJyxcclxuICAgICAgICAgICAgZGU6ICdTY2hvY2tpZXJ0ZXIgSW1wJyxcclxuICAgICAgICAgICAgamE6ICfjgqvjg4Pjg5HjgpLop6PpmaTjgZfjgarjgYvjgaPjgZ8nLFxyXG4gICAgICAgICAgICBjbjogJ+ays+erpeeKtuaAgeWQg+S6huaatOmbtycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0d1YmFsSG0gUXVha2UnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzE5NTYnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiB7XHJcbiAgICAgICAgLy8gQWx3YXlzIGhpdHMgdGFyZ2V0LCBidXQgaWYgY29ycmVjdGx5IHJlc29sdmVkIHdpbGwgZGVhbCAwIGRhbWFnZVxyXG4gICAgICAgIHJldHVybiBlLmRhbWFnZSA+IDA7XHJcbiAgICAgIH0sXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0d1YmFsSG0gVG9ybmFkbycsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnMTk1Wzc4XScsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IHtcclxuICAgICAgICAvLyBBbHdheXMgaGl0cyB0YXJnZXQsIGJ1dCBpZiBjb3JyZWN0bHkgcmVzb2x2ZWQgd2lsbCBkZWFsIDAgZGFtYWdlXHJcbiAgICAgICAgcmV0dXJuIGUuZGFtYWdlID4gMDtcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5Tb2htQWxIYXJkLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdTb2htQWxIbSBEZWFkbHkgVmFwb3InOiAnMURDOScsIC8vIEVudmlyb25tZW50YWwgY2lyY2xlIEFvRXNcclxuICAgICdTb2htQWxIbSBEZWVwcm9vdCc6ICcxQ0RBJywgLy8gVGFyZ2V0ZWQgY2lyY2xlIEFvRSwgQmxvb21pbmcgQ2hpY2h1IHRyYXNoXHJcbiAgICAnU29obUFsSG0gT2Rpb3VzIEFpcic6ICcxQ0RCJywgLy8gQ29uYWwgQW9FLCBCbG9vbWluZyBDaGljaHUgdHJhc2hcclxuICAgICdTb2htQWxIbSBHbG9yaW91cyBCbGF6ZSc6ICcxQzMzJywgLy8gQ2lyY2xlIEFvRSwgU21hbGwgU3BvcmUgU2FjLCBib3NzIDFcclxuICAgICdTb2htQWxIbSBGb3VsIFdhdGVycyc6ICcxMThBJywgLy8gQ29uYWwgQW9FLCBNb3VudGFpbnRvcCBPcGtlbiB0cmFzaFxyXG4gICAgJ1NvaG1BbEhtIFBsYWluIFBvdW5kJzogJzExODcnLCAvLyBUYXJnZXRlZCBjaXJjbGUgQW9FLCBNb3VudGFpbnRvcCBIcm9wa2VuIHRyYXNoXHJcbiAgICAnU29obUFsSG0gUGFsc3lueXhpcyc6ICcxMTYxJywgLy8gQ29uYWwgQW9FLCBPdmVyZ3Jvd24gRGlmZmx1Z2lhIHRyYXNoXHJcbiAgICAnU29obUFsSG0gU3VyZmFjZSBCcmVhY2gnOiAnMUU4MCcsIC8vIENpcmNsZSBBb0UsIEdpYW50IE5ldGhlcndvcm0gdHJhc2hcclxuICAgICdTb2htQWxIbSBGcmVzaHdhdGVyIENhbm5vbic6ICcxMTlGJywgLy8gTGluZSBBb0UsIEdpYW50IE5ldGhlcndvcm0gdHJhc2hcclxuICAgICdTb2htQWxIbSBUYWlsIFNtYXNoJzogJzFDMzUnLCAvLyBVbnRlbGVncmFwaGVkIHJlYXIgY29uYWwgQW9FLCBHb3dyb3csIGJvc3MgMlxyXG4gICAgJ1NvaG1BbEhtIFRhaWwgU3dpbmcnOiAnMUMzNicsIC8vIFVudGVsZWdyYXBoZWQgY2lyY2xlIEFvRSwgR293cm93LCBib3NzIDJcclxuICAgICdTb2htQWxIbSBSaXBwZXIgQ2xhdyc6ICcxQzM3JywgLy8gVW50ZWxlZ3JhcGhlZCBmcm9udGFsIEFvRSwgR293cm93LCBib3NzIDJcclxuICAgICdTb2htQWxIbSBXaW5kIFNsYXNoJzogJzFDMzgnLCAvLyBDaXJjbGUgQW9FLCBHb3dyb3csIGJvc3MgMlxyXG4gICAgJ1NvaG1BbEhtIFdpbGQgQ2hhcmdlJzogJzFDMzknLCAvLyBEYXNoIGF0dGFjaywgR293cm93LCBib3NzIDJcclxuICAgICdTb2htQWxIbSBIb3QgQ2hhcmdlJzogJzFDM0EnLCAvLyBEYXNoIGF0dGFjaywgR293cm93LCBib3NzIDJcclxuICAgICdTb2htQWxIbSBGaXJlYmFsbCc6ICcxQzNCJywgLy8gVW50ZWxlZ3JhcGhlZCB0YXJnZXRlZCBjaXJjbGUgQW9FLCBHb3dyb3csIGJvc3MgMlxyXG4gICAgJ1NvaG1BbEhtIExhdmEgRmxvdyc6ICcxQzNDJywgLy8gVW50ZWxlZ3JhcGhlZCBjb25hbCBBb0UsIEdvd3JvdywgYm9zcyAyXHJcbiAgICAnU29obUFsSG0gV2lsZCBIb3JuJzogJzE1MDcnLCAvLyBDb25hbCBBb0UsIEFiYWxhdGhpYW4gQ2xheSBHb2xlbSB0cmFzaFxyXG4gICAgJ1NvaG1BbEhtIExhdmEgQnJlYXRoJzogJzFDNEQnLCAvLyBDb25hbCBBb0UsIExhdmEgQ3JhYiB0cmFzaFxyXG4gICAgJ1NvaG1BbEhtIFJpbmcgb2YgRmlyZSc6ICcxQzRDJywgLy8gVGFyZ2V0ZWQgY2lyY2xlIEFvRSwgVm9sY2FubyBBbmFsYSB0cmFzaFxyXG4gICAgJ1NvaG1BbEhtIE1vbHRlbiBTaWxrIDEnOiAnMUM0MycsIC8vIDI3MC1kZWdyZWUgZnJvbnRhbCBBb0UsIExhdmEgU2NvcnBpb24sIGJvc3MgM1xyXG4gICAgJ1NvaG1BbEhtIE1vbHRlbiBTaWxrIDInOiAnMUM0NCcsIC8vIDI3MC1kZWdyZWUgcmVhciBBb0UsIExhdmEgU2NvcnBpb24sIGJvc3MgM1xyXG4gICAgJ1NvaG1BbEhtIE1vbHRlbiBTaWxrIDMnOiAnMUM0MicsIC8vIFJpbmcgQW9FLCBMYXZhIFNjb3JwaW9uLCBib3NzIDNcclxuICAgICdTb2htQWxIbSBSZWFsbSBTaGFrZXInOiAnMUM0MScsIC8vIENpcmNsZSBBb0UsIExhdmEgU2NvcnBpb24sIGJvc3MgM1xyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gV2FybnMgaWYgcGxheWVycyBzdGVwIGludG8gdGhlIGxhdmEgcHVkZGxlcy4gVGhlcmUgaXMgdW5mb3J0dW5hdGVseSBubyBkaXJlY3QgZGFtYWdlIGV2ZW50LlxyXG4gICAgICBpZDogJ1NvaG1BbEhtIEJ1cm5zJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzExQycgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5lZmZlY3QgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5BbGV4YW5kZXJUaGVTb3VsT2ZUaGVDcmVhdG9yLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdBMTJOIFNhY3JhbWVudCc6ICcxQUU2JywgLy8gQ3Jvc3MgTGFzZXJzXHJcbiAgICAnQTEyTiBHcmF2aXRhdGlvbmFsIEFub21hbHknOiAnMUFFQicsIC8vIEdyYXZpdHkgUHVkZGxlc1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnQTEyTiBEaXZpbmUgU3BlYXInOiAnMUFFMycsIC8vIEluc3RhbnQgY29uYWwgdGFuayBjbGVhdmVcclxuICAgICdBMTJOIEJsYXppbmcgU2NvdXJnZSc6ICcxQUU5JywgLy8gT3JhbmdlIGhlYWQgbWFya2VyIHNwbGFzaCBkYW1hZ2VcclxuICAgICdBMTJOIFBsYWludCBPZiBTZXZlcml0eSc6ICcxQUYxJywgLy8gQWdncmF2YXRlZCBBc3NhdWx0IHNwbGFzaCBkYW1hZ2VcclxuICAgICdBMTJOIENvbW11bmlvbic6ICcxQUZDJywgLy8gVGV0aGVyIFB1ZGRsZXNcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnQTEyTiBBc3NhdWx0IENvbGxlY3QnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnNDYxJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmFzc2F1bHQgPSBkYXRhLmFzc2F1bHQgfHwgW107XHJcbiAgICAgICAgZGF0YS5hc3NhdWx0LnB1c2gobWF0Y2hlcy50YXJnZXQpO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gSXQgaXMgYSBmYWlsdXJlIGZvciBhIFNldmVyaXR5IG1hcmtlciB0byBzdGFjayB3aXRoIHRoZSBTb2xpZGFyaXR5IGdyb3VwLlxyXG4gICAgICBpZDogJ0ExMk4gQXNzYXVsdCBGYWlsdXJlJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICcxQUYyJyxcclxuICAgICAgY29uZGl0aW9uOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IGRhdGEuYXNzYXVsdC5pbmNsdWRlcyhtYXRjaGVzLnRhcmdldCksXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogJ0RpZG5cXCd0IFNwcmVhZCEnLFxyXG4gICAgICAgICAgICBkZTogJ05pY2h0IHZlcnRlaWx0IScsXHJcbiAgICAgICAgICAgIGZyOiAnTmUgc1xcJ2VzdCBwYXMgZGlzcGVyc8OpKGUpICEnLFxyXG4gICAgICAgICAgICBqYTogJ+aVo+mWi+OBl+OBquOBi+OBo+OBnyEnLFxyXG4gICAgICAgICAgICBjbjogJ+ayoeacieaVo+W8gCEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdBMTJOIEFzc2F1bHQgQ2xlYW51cCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc0NjEnIH0pLFxyXG4gICAgICBkZWxheVNlY29uZHM6IDIwLFxyXG4gICAgICBzdXBwcmVzc1NlY29uZHM6IDUsXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgZGVsZXRlIGRhdGEuYXNzYXVsdDtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5BbGFNaGlnbyxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnQWxhIE1oaWdvIE1hZ2l0ZWsgUmF5JzogJzI0Q0UnLCAvLyBMaW5lIEFvRSwgTGVnaW9uIFByZWRhdG9yIHRyYXNoLCBiZWZvcmUgYm9zcyAxXHJcbiAgICAnQWxhIE1oaWdvIExvY2sgT24nOiAnMjA0NycsIC8vIEhvbWluZyBjaXJjbGVzLCBib3NzIDFcclxuICAgICdBbGEgTWhpZ28gVGFpbCBMYXNlciAxJzogJzIwNDknLCAvLyBGcm9udGFsIGxpbmUgQW9FLCBib3NzIDFcclxuICAgICdBbGEgTWhpZ28gVGFpbCBMYXNlciAyJzogJzIwNEInLCAvLyBSZWFyIGxpbmUgQW9FLCBib3NzIDFcclxuICAgICdBbGEgTWhpZ28gVGFpbCBMYXNlciAzJzogJzIwNEMnLCAvLyBSZWFyIGxpbmUgQW9FLCBib3NzIDFcclxuICAgICdBbGEgTWhpZ28gU2hvdWxkZXIgQ2Fubm9uJzogJzI0RDAnLCAvLyBDaXJjbGUgQW9FLCBMZWdpb24gQXZlbmdlciB0cmFzaCwgYmVmb3JlIGJvc3MgMlxyXG4gICAgJ0FsYSBNaGlnbyBDYW5ub25maXJlJzogJzIzRUQnLCAvLyBFbnZpcm9ubWVudGFsIGNpcmNsZSBBb0UsIHBhdGggdG8gYm9zcyAyXHJcbiAgICAnQWxhIE1oaWdvIEFldGhlcm9jaGVtaWNhbCBHcmVuYWRvJzogJzIwNUEnLCAvLyBDaXJjbGUgQW9FLCBib3NzIDJcclxuICAgICdBbGEgTWhpZ28gSW50ZWdyYXRlZCBBZXRoZXJvbW9kdWxhdG9yJzogJzIwNUInLCAvLyBSaW5nIEFvRSwgYm9zcyAyXHJcbiAgICAnQWxhIE1oaWdvIENpcmNsZSBPZiBEZWF0aCc6ICcyNEQ0JywgLy8gUHJveGltaXR5IGNpcmNsZSBBb0UsIEhleGFkcm9uZSB0cmFzaCwgYmVmb3JlIGJvc3MgM1xyXG4gICAgJ0FsYSBNaGlnbyBFeGhhdXN0JzogJzI0RDMnLCAvLyBMaW5lIEFvRSwgTGVnaW9uIENvbG9zc3VzIHRyYXNoLCBiZWZvcmUgYm9zcyAzXHJcbiAgICAnQWxhIE1oaWdvIEdyYW5kIFN3b3JkJzogJzI0RDInLCAvLyBDb25hbCBBb0UsIExlZ2lvbiBDb2xvc3N1cyB0cmFzaCwgYmVmb3JlIGJvc3MgM1xyXG4gICAgJ0FsYSBNaGlnbyBBcnQgT2YgVGhlIFN0b3JtIDEnOiAnMjA2NicsIC8vIFByb3hpbWl0eSBjaXJjbGUgQW9FLCBwcmUtaW50ZXJtaXNzaW9uLCBib3NzIDNcclxuICAgICdBbGEgTWhpZ28gQXJ0IE9mIFRoZSBTdG9ybSAyJzogJzI1ODcnLCAvLyBQcm94aW1pdHkgY2lyY2xlIEFvRSwgaW50ZXJtaXNzaW9uLCBib3NzIDNcclxuICAgICdBbGEgTWhpZ28gVmVpbiBTcGxpdHRlciAxJzogJzI0QjYnLCAvLyBQcm94aW1pdHkgY2lyY2xlIEFvRSwgcHJpbWFyeSBlbnRpdHksIGJvc3MgM1xyXG4gICAgJ0FsYSBNaGlnbyBWZWluIFNwbGl0dGVyIDInOiAnMjA2QycsIC8vIFByb3hpbWl0eSBjaXJjbGUgQW9FLCBoZWxwZXIgZW50aXR5LCBib3NzIDNcclxuICAgICdBbGEgTWhpZ28gTGlnaHRsZXNzIFNwYXJrJzogJzIwNkInLCAvLyBDb25hbCBBb0UsIGJvc3MgM1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnQWxhIE1oaWdvIERlbWltYWdpY2tzJzogJzIwNUUnLFxyXG4gICAgJ0FsYSBNaGlnbyBVbm1vdmluZyBUcm9pa2EnOiAnMjA2MCcsXHJcbiAgICAnQWxhIE1oaWdvIEFydCBPZiBUaGUgU3dvcmQgMSc6ICcyMDY5JyxcclxuICAgICdBbGEgTWhpZ28gQXJ0IE9mIFRoZSBTd29yZCAyJzogJzI1ODknLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gSXQncyBwb3NzaWJsZSBwbGF5ZXJzIG1pZ2h0IGp1c3Qgd2FuZGVyIGludG8gdGhlIGJhZCBvbiB0aGUgb3V0c2lkZSxcclxuICAgICAgLy8gYnV0IG5vcm1hbGx5IHBlb3BsZSBnZXQgcHVzaGVkIGludG8gaXQuXHJcbiAgICAgIGlkOiAnQWxhIE1oaWdvIEFydCBPZiBUaGUgU3dlbGwnLFxyXG4gICAgICAvLyBEYW1hZ2UgRG93blxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMkI4JyB9KSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBlLnRhcmdldCwgdGV4dDogZS5lZmZlY3QgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIEJhcmRhbSdzIE1ldHRsZVxyXG5cclxuXHJcbi8vIEZvciByZWFzb25zIG5vdCBjb21wbGV0ZWx5IHVuZGVyc3Rvb2QgYXQgdGhlIHRpbWUgdGhpcyB3YXMgbWVyZ2VkLFxyXG4vLyBidXQgbGlrZWx5IHJlbGF0ZWQgdG8gdGhlIGZhY3QgdGhhdCBubyBuYW1lcGxhdGVzIGFyZSB2aXNpYmxlIGR1cmluZyB0aGUgZW5jb3VudGVyLFxyXG4vLyBhbmQgdGhhdCBub3RoaW5nIGluIHRoZSBlbmNvdW50ZXIgYWN0dWFsbHkgZG9lcyBkYW1hZ2UsXHJcbi8vIHdlIGNhbid0IHVzZSBkYW1hZ2VXYXJuIG9yIGdhaW5zRWZmZWN0IGhlbHBlcnMgb24gdGhlIEJhcmRhbSBmaWdodC5cclxuLy8gSW5zdGVhZCwgd2UgdXNlIHRoaXMgaGVscGVyIGZ1bmN0aW9uIHRvIGxvb2sgZm9yIGZhaWx1cmUgZmxhZ3MuXHJcbi8vIElmIHRoZSBmbGFnIGlzIHByZXNlbnQsYSBmdWxsIHRyaWdnZXIgb2JqZWN0IGlzIHJldHVybmVkIHRoYXQgZHJvcHMgaW4gc2VhbWxlc3NseS5cclxuY29uc3QgYWJpbGl0eVdhcm4gPSAoYXJncykgPT4ge1xyXG4gIGlmICghYXJncy5hYmlsaXR5SWQpXHJcbiAgICBjb25zb2xlLmVycm9yKCdNaXNzaW5nIGFiaWxpdHkgJyArIEpTT04uc3RyaW5naWZ5KGFyZ3MpKTtcclxuICByZXR1cm4ge1xyXG4gICAgaWQ6IGFyZ3MuaWQsXHJcbiAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiBhcmdzLmFiaWxpdHlJZCB9KSxcclxuICAgIGNvbmRpdGlvbjogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4gbWF0Y2hlcy5mbGFncy5zdWJzdHIoLTIpID09PSAnMEUnLFxyXG4gICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuQmFyZGFtc01ldHRsZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnQmFyZGFtIERpcnR5IENsYXcnOiAnMjFBOCcsIC8vIEZyb250YWwgY2xlYXZlLCBHdWxvIEd1bG8gdHJhc2hcclxuICAgICdCYXJkYW0gRXBpZ3JhcGgnOiAnMjNBRicsIC8vIExpbmUgQW9FLCBXYWxsIG9mIEJhcmRhbSB0cmFzaFxyXG4gICAgJ0JhcmRhbSBUaGUgRHVzayBTdGFyJzogJzIxODcnLCAvLyBDaXJjbGUgQW9FLCBlbnZpcm9ubWVudCBiZWZvcmUgZmlyc3QgYm9zc1xyXG4gICAgJ0JhcmRhbSBUaGUgRGF3biBTdGFyJzogJzIxODYnLCAvLyBDaXJjbGUgQW9FLCBlbnZpcm9ubWVudCBiZWZvcmUgZmlyc3QgYm9zc1xyXG4gICAgJ0JhcmRhbSBDcnVtYmxpbmcgQ3J1c3QnOiAnMUYxMycsIC8vIENpcmNsZSBBb0VzLCBHYXJ1bGEsIGZpcnN0IGJvc3NcclxuICAgICdCYXJkYW0gUmFtIFJ1c2gnOiAnMUVGQycsIC8vIExpbmUgQW9FcywgU3RlcHBlIFlhbWFhLCBmaXJzdCBib3NzLlxyXG4gICAgJ0JhcmRhbSBMdWxsYWJ5JzogJzI0QjInLCAvLyBDaXJjbGUgQW9FcywgU3RlcHBlIFNoZWVwLCBmaXJzdCBib3NzLlxyXG4gICAgJ0JhcmRhbSBIZWF2ZSc6ICcxRUY3JywgLy8gRnJvbnRhbCBjbGVhdmUsIEdhcnVsYSwgZmlyc3QgYm9zc1xyXG4gICAgJ0JhcmRhbSBXaWRlIEJsYXN0ZXInOiAnMjRCMycsIC8vIEVub3Jtb3VzIGZyb250YWwgY2xlYXZlLCBTdGVwcGUgQ29ldXJsLCBmaXJzdCBib3NzXHJcbiAgICAnQmFyZGFtIERvdWJsZSBTbWFzaCc6ICcyNkEnLCAvLyBDaXJjbGUgQW9FLCBNZXR0bGluZyBEaGFyYSB0cmFzaFxyXG4gICAgJ0JhcmRhbSBUcmFuc29uaWMgQmxhc3QnOiAnMTI2MicsIC8vIENpcmNsZSBBb0UsIFN0ZXBwZSBFYWdsZSB0cmFzaFxyXG4gICAgJ0JhcmRhbSBXaWxkIEhvcm4nOiAnMjIwOCcsIC8vIEZyb250YWwgY2xlYXZlLCBLaHVuIEd1cnZlbCB0cmFzaFxyXG4gICAgJ0JhcmRhbSBIZWF2eSBTdHJpa2UgMSc6ICcyNTc4JywgLy8gMSBvZiAzIDI3MC1kZWdyZWUgcmluZyBBb0VzLCBCYXJkYW0sIHNlY29uZCBib3NzXHJcbiAgICAnQmFyZGFtIEhlYXZ5IFN0cmlrZSAyJzogJzI1NzknLCAvLyAyIG9mIDMgMjcwLWRlZ3JlZSByaW5nIEFvRXMsIEJhcmRhbSwgc2Vjb25kIGJvc3NcclxuICAgICdCYXJkYW0gSGVhdnkgU3RyaWtlIDMnOiAnMjU3QScsIC8vIDMgb2YgMyAyNzAtZGVncmVlIHJpbmcgQW9FcywgQmFyZGFtLCBzZWNvbmQgYm9zc1xyXG4gICAgJ0JhcmRhbSBUcmVtYmxvciAxJzogJzI1N0InLCAvLyAxIG9mIDIgY29uY2VudHJpYyByaW5nIEFvRXMsIEJhcmRhbSwgc2Vjb25kIGJvc3NcclxuICAgICdCYXJkYW0gVHJlbWJsb3IgMic6ICcyNTdDJywgLy8gMiBvZiAyIGNvbmNlbnRyaWMgcmluZyBBb0VzLCBCYXJkYW0sIHNlY29uZCBib3NzXHJcbiAgICAnQmFyZGFtIFRocm93aW5nIFNwZWFyJzogJzI1N0YnLCAvLyBDaGVja2VyYm9hcmQgQW9FLCBUaHJvd2luZyBTcGVhciwgc2Vjb25kIGJvc3NcclxuICAgICdCYXJkYW0gQmFyZGFtXFwncyBSaW5nJzogJzI1ODEnLCAvLyBEb251dCBBb0UgaGVhZG1hcmtlcnMsIEJhcmRhbSwgc2Vjb25kIGJvc3NcclxuICAgICdCYXJkYW0gQ29tZXQnOiAnMjU3RCcsIC8vIFRhcmdldGVkIGNpcmNsZSBBb0VzLCBCYXJkYW0sIHNlY29uZCBib3NzXHJcbiAgICAnQmFyZGFtIENvbWV0IEltcGFjdCc6ICcyNTgwJywgLy8gQ2lyY2xlIEFvRXMsIFN0YXIgU2hhcmQsIHNlY29uZCBib3NzXHJcbiAgICAnQmFyZGFtIElyb24gU3BoZXJlIEF0dGFjayc6ICcxNkI2JywgLy8gQ29udGFjdCBkYW1hZ2UsIElyb24gU3BoZXJlIHRyYXNoLCBiZWZvcmUgdGhpcmQgYm9zc1xyXG4gICAgJ0JhcmRhbSBUb3JuYWRvJzogJzI0N0UnLCAvLyBDaXJjbGUgQW9FLCBLaHVuIFNoYXZhcmEgdHJhc2hcclxuICAgICdCYXJkYW0gUGluaW9uJzogJzFGMTEnLCAvLyBMaW5lIEFvRSwgWW9sIEZlYXRoZXIsIHRoaXJkIGJvc3NcclxuICAgICdCYXJkYW0gRmVhdGhlciBTcXVhbGwnOiAnMUYwRScsIC8vIERhc2ggYXR0YWNrLCBZb2wsIHRoaXJkIGJvc3NcclxuICAgICdCYXJkYW0gRmx1dHRlcmZhbGwgVW50YXJnZXRlZCc6ICcxRjEyJywgLy8gUm90YXRpbmcgY2lyY2xlIEFvRXMsIFlvbCwgdGhpcmQgYm9zc1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnQmFyZGFtIEdhcnVsYSBSdXNoJzogJzFFRjknLCAvLyBMaW5lIEFvRSwgR2FydWxhLCBmaXJzdCBib3NzLlxyXG4gICAgJ0JhcmRhbSBGbHV0dGVyZmFsbCBUYXJnZXRlZCc6ICcxRjBDJywgLy8gQ2lyY2xlIEFvRSBoZWFkbWFya2VyLCBZb2wsIHRoaXJkIGJvc3NcclxuICAgICdCYXJkYW0gV2luZ2JlYXQnOiAnMUYwRicsIC8vIENvbmFsIEFvRSBoZWFkbWFya2VyLCBZb2wsIHRoaXJkIGJvc3NcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ0JhcmRhbSBDb25mdXNlZCc6ICcwQicsIC8vIEZhaWxlZCBnYXplIGF0dGFjaywgWW9sLCB0aGlyZCBib3NzXHJcbiAgfSxcclxuICBnYWluc0VmZmVjdEZhaWw6IHtcclxuICAgICdCYXJkYW0gRmV0dGVycyc6ICc1NkYnLCAvLyBGYWlsaW5nIHR3byBtZWNoYW5pY3MgaW4gYW55IG9uZSBwaGFzZSBvbiBCYXJkYW0sIHNlY29uZCBib3NzLlxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIC8vIDEgb2YgMyAyNzAtZGVncmVlIHJpbmcgQW9FcywgQmFyZGFtLCBzZWNvbmQgYm9zc1xyXG4gICAgYWJpbGl0eVdhcm4oeyBpZDogJ0JhcmRhbSBIZWF2eSBTdHJpa2UgMScsIGFiaWxpdHlJZDogJzI1NzgnIH0pLFxyXG4gICAgLy8gMiBvZiAzIDI3MC1kZWdyZWUgcmluZyBBb0VzLCBCYXJkYW0sIHNlY29uZCBib3NzXHJcbiAgICBhYmlsaXR5V2Fybih7IGlkOiAnQmFyZGFtIEhlYXZ5IFN0cmlrZSAyJywgYWJpbGl0eUlkOiAnMjU3OScgfSksXHJcbiAgICAvLyAzIG9mIDMgMjcwLWRlZ3JlZSByaW5nIEFvRXMsIEJhcmRhbSwgc2Vjb25kIGJvc3NcclxuICAgIGFiaWxpdHlXYXJuKHsgaWQ6ICdCYXJkYW0gSGVhdnkgU3RyaWtlIDMnLCBhYmlsaXR5SWQ6ICcyNTdBJyB9KSxcclxuICAgIC8vIDEgb2YgMiBjb25jZW50cmljIHJpbmcgQW9FcywgQmFyZGFtLCBzZWNvbmQgYm9zc1xyXG4gICAgYWJpbGl0eVdhcm4oeyBpZDogJ0JhcmRhbSBUcmVtYmxvciAxJywgYWJpbGl0eUlkOiAnMjU3QicgfSksXHJcbiAgICAvLyAyIG9mIDIgY29uY2VudHJpYyByaW5nIEFvRXMsIEJhcmRhbSwgc2Vjb25kIGJvc3NcclxuICAgIGFiaWxpdHlXYXJuKHsgaWQ6ICdCYXJkYW0gVHJlbWJsb3IgMicsIGFiaWxpdHlJZDogJzI1N0MnIH0pLFxyXG4gICAgLy8gQ2hlY2tlcmJvYXJkIEFvRSwgVGhyb3dpbmcgU3BlYXIsIHNlY29uZCBib3NzXHJcbiAgICBhYmlsaXR5V2Fybih7IGlkOiAnQmFyZGFtIFRocm93aW5nIFNwZWFyJywgYWJpbGl0eUlkOiAnMjU3RicgfSksXHJcbiAgICAvLyBHYXplIGF0dGFjaywgV2FycmlvciBvZiBCYXJkYW0sIHNlY29uZCBib3NzXHJcbiAgICBhYmlsaXR5V2Fybih7IGlkOiAnQmFyZGFtIEVtcHR5IEdhemUnLCBhYmlsaXR5SWQ6ICcxRjA0JyB9KSxcclxuICAgIC8vIERvbnV0IEFvRSBoZWFkbWFya2VycywgQmFyZGFtLCBzZWNvbmQgYm9zc1xyXG4gICAgYWJpbGl0eVdhcm4oeyBpZDogJ0JhcmRhbVxcJ3MgUmluZycsIGFiaWxpdHlJZDogJzI1ODEnIH0pLFxyXG4gICAgLy8gVGFyZ2V0ZWQgY2lyY2xlIEFvRXMsIEJhcmRhbSwgc2Vjb25kIGJvc3NcclxuICAgIGFiaWxpdHlXYXJuKHsgaWQ6ICdCYXJkYW0gQ29tZXQnLCBhYmlsaXR5SWQ6ICcyNTdEJyB9KSxcclxuICAgIC8vIENpcmNsZSBBb0VzLCBTdGFyIFNoYXJkLCBzZWNvbmQgYm9zc1xyXG4gICAgYWJpbGl0eVdhcm4oeyBpZDogJ0JhcmRhbSBDb21ldCBJbXBhY3QnLCBhYmlsaXR5SWQ6ICcyNTgwJyB9KSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkt1Z2FuZUNhc3RsZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnS3VnYW5lIENhc3RsZSBUZW5rYSBHb2trZW4nOiAnMjMyOScsIC8vIEZyb250YWwgY29uZSBBb0UsICBKb2kgQmxhZGUgdHJhc2gsIGJlZm9yZSBib3NzIDFcclxuICAgICdLdWdhbmUgQ2FzdGxlIEtlbmtpIFJlbGVhc2UgVHJhc2gnOiAnMjMzMCcsIC8vIENoYXJpb3QgQW9FLCBKb2kgS2l5b2Z1c2EgdHJhc2gsIGJlZm9yZSBib3NzIDFcclxuXHJcbiAgICAnS3VnYW5lIENhc3RsZSBDbGVhcm91dCc6ICcxRTkyJywgLy8gRnJvbnRhbCBjb25lIEFvRSwgWnVpa28tTWFydSwgYm9zcyAxXHJcbiAgICAnS3VnYW5lIENhc3RsZSBIYXJhLUtpcmkgMSc6ICcxRTk2JywgLy8gR2lhbnQgY2lyY2xlIEFvRSwgSGFyYWtpcmkgS29zaG8sIGJvc3MgMVxyXG4gICAgJ0t1Z2FuZSBDYXN0bGUgSGFyYS1LaXJpIDInOiAnMjRGOScsIC8vIEdpYW50IGNpcmNsZSBBb0UsIEhhcmFraXJpIEtvc2hvLCBib3NzIDFcclxuXHJcbiAgICAnS3VnYW5lIENhc3RsZSBKdWppIFNodXJpa2VuIDEnOiAnMjMyRCcsIC8vIExpbmUgQW9FLCBLYXJha3VyaSBPbm1pdHN1IHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnS3VnYW5lIENhc3RsZSAxMDAwIEJhcmJzJzogJzIxOTgnLCAvLyBMaW5lIEFvRSwgSm9pIEtvamEgdHJhc2gsIGJlZm9yZSBib3NzIDJcclxuXHJcbiAgICAnS3VnYW5lIENhc3RsZSBKdWppIFNodXJpa2VuIDInOiAnMUU5OCcsIC8vIExpbmUgQW9FLCBEb2p1biBNYXJ1LCBib3NzIDJcclxuICAgICdLdWdhbmUgQ2FzdGxlIFRhdGFtaS1HYWVzaGknOiAnMUU5RCcsIC8vIEZsb29yIHRpbGUgbGluZSBhdHRhY2ssIEVsa2l0ZSBPbm1pdHN1LCBib3NzIDJcclxuICAgICdLdWdhbmUgQ2FzdGxlIEp1amkgU2h1cmlrZW4gMyc6ICcxRUEwJywgLy8gTGluZSBBb0UsIEVsaXRlIE9ubWl0c3UsIGJvc3MgMlxyXG5cclxuICAgICdLdWdhbmUgQ2FzdGxlIEF1dG8gQ3Jvc3Nib3cnOiAnMjMzMycsIC8vIEZyb250YWwgY29uZSBBb0UsIEthcmFrdXJpIEhhbnlhIHRyYXNoLCBhZnRlciBib3NzIDJcclxuICAgICdLdWdhbmUgQ2FzdGxlIEhhcmFraXJpIDMnOiAnMjNDOScsIC8vIEdpYW50IENpcmNsZSBBb0UsIEhhcmFraXJpICBIYW55YSB0cmFzaCwgYWZ0ZXIgYm9zcyAyXHJcblxyXG4gICAgJ0t1Z2FuZSBDYXN0bGUgSWFpLUdpcmknOiAnMUVBMicsIC8vIENoYXJpb3QgQW9FLCBZb2ppbWJvLCBib3NzIDNcclxuICAgICdLdWdhbmUgQ2FzdGxlIEZyYWdpbGl0eSc6ICcxRUFBJywgLy8gQ2hhcmlvdCBBb0UsIElub3NoaWthY2hvLCBib3NzIDNcclxuICAgICdLdWdhbmUgQ2FzdGxlIERyYWdvbmZpcmUnOiAnMUVBQicsIC8vIExpbmUgQW9FLCBEcmFnb24gSGVhZCwgYm9zcyAzXHJcbiAgfSxcclxuXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnS3VnYW5lIENhc3RsZSBJc3Nlbic6ICcxRTk3JywgLy8gSW5zdGFudCBmcm9udGFsIGNsZWF2ZSwgRG9qdW4gTWFydSwgYm9zcyAyXHJcbiAgICAnS3VnYW5lIENhc3RsZSBDbG9ja3dvcmsgUmFpdG9uJzogJzFFOUInLCAvLyBMYXJnZSBsaWdodG5pbmcgc3ByZWFkIGNpcmNsZXMsIERvanVuIE1hcnUsIGJvc3MgMlxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gU3RhY2sgbWFya2VyLCBadWlrbyBNYXJ1LCBib3NzIDFcclxuICAgICAgaWQ6ICdLdWdhbmUgQ2FzdGxlIEhlbG0gQ3JhY2snLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICcxRTk0JyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiBtYXRjaGVzLnR5cGUgPT09ICcyMScsIC8vIFRha2luZyB0aGUgc3RhY2sgc29sbyBpcyAqcHJvYmFibHkqIGEgbWlzdGFrZS5cclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiBgJHttYXRjaGVzLmFiaWxpdHl9IChhbG9uZSlgLFxyXG4gICAgICAgICAgICBkZTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoYWxsZWluKWAsXHJcbiAgICAgICAgICAgIGZyOiBgJHttYXRjaGVzLmFiaWxpdHl9IChzZXVsKGUpKWAsXHJcbiAgICAgICAgICAgIGphOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjkuIDkuropYCxcclxuICAgICAgICAgICAgY246IGAke21hdGNoZXMuYWJpbGl0eX0gKOWNleWQgylgLFxyXG4gICAgICAgICAgICBrbzogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo7Zi87J6QIOunnuydjClgLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5TYWludE1vY2lhbm5lc0FyYm9yZXR1bUhhcmQsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1N0IE1vY2lhbm5lIEhhcmQgTXVkc3RyZWFtJzogJzMwRDknLCAvLyBUYXJnZXRlZCBjaXJjbGUgQW9FLCBJbW1hY3VsYXRlIEFwYSB0cmFzaCwgYmVmb3JlIGJvc3MgMVxyXG4gICAgJ1N0IE1vY2lhbm5lIEhhcmQgU2lsa2VuIFNwcmF5JzogJzMzODUnLCAvLyBSZWFyIGNvbmUgQW9FLCBXaXRoZXJlZCBCZWxsYWRvbm5hIHRyYXNoLCBiZWZvcmUgYm9zcyAxXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBNdWRkeSBQdWRkbGVzJzogJzMwREEnLCAvLyBTbWFsbCB0YXJnZXRlZCBjaXJjbGUgQW9FcywgRG9ycG9ra3VyIHRyYXNoLCBiZWZvcmUgYm9zcyAxXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBPZGlvdXMgQWlyJzogJzJFNDknLCAvLyBGcm9udGFsIGNvbmUgQW9FLCBOdWxsY2h1LCBib3NzIDFcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIFNMdWRnZSBCb21iJzogJzJFNEUnLCAvLyBUYXJnZXRlZCBjaXJjbGUgQW9FcywgTnVsbGNodSwgYm9zcyAxXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBPZGlvdXMgQXRtb3NwaGVyZSc6ICcyRTUxJywgLy8gQ2hhbm5lbGVkIDMvNCBhcmVuYSBjbGVhdmUsIE51bGxjaHUsIGJvc3MgMVxyXG4gICAgJ1N0IE1vY2lhbm5lIEhhcmQgQ3JlZXBpbmcgSXZ5JzogJzMxQTUnLCAvLyBGcm9udGFsIGNvbmUgQW9FLCBXaXRoZXJlZCBLdWxhayB0cmFzaCwgYmVmb3JlIGJvc3MgMlxyXG4gICAgJ1N0IE1vY2lhbm5lIEhhcmQgUm9ja3NsaWRlJzogJzMxMzQnLCAvLyBMaW5lIEFvRSwgU2lsdCBHb2xlbSwgYm9zcyAyXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBFYXJ0aHF1YWtlIElubmVyJzogJzMxMkUnLCAvLyBDaGFyaW90IEFvRSwgTGFraGFtdSwgYm9zcyAyXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBFYXJ0aHF1YWtlIE91dGVyJzogJzMxMkYnLCAvLyBEeW5hbW8gQW9FLCBMYWtoYW11LCBib3NzIDJcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIEVtYmFsbWluZyBFYXJ0aCc6ICczMUE2JywgLy8gTGFyZ2UgQ2hhcmlvdCBBb0UsIE11ZGR5IE1hdGEsIGFmdGVyIGJvc3MgMlxyXG4gICAgJ1N0IE1vY2lhbm5lIEhhcmQgUXVpY2ttaXJlJzogJzMxMzYnLCAvLyBTZXdhZ2Ugc3VyZ2UgYXZvaWRlZCBvbiBwbGF0Zm9ybXMsIFRva2thcGNoaSwgYm9zcyAzXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBRdWFnbWlyZSBQbGF0Zm9ybXMnOiAnMzEzOScsIC8vIFF1YWdtaXJlIGV4cGxvc2lvbiBvbiBwbGF0Zm9ybXMsIFRva2thcGNoaSwgYm9zcyAzXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBGZWN1bGVudCBGbG9vZCc6ICczMTNDJywgLy8gVGFyZ2V0ZWQgdGhpbiBjb25lIEFvRSwgVG9ra2FwY2hpLCBib3NzIDNcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIENvcnJ1cHR1cmUnOiAnMzNBMCcsIC8vIE11ZCBTbGltZSBleHBsb3Npb24sIGJvc3MgMy4gKE5vIGV4cGxvc2lvbiBpZiBkb25lIGNvcnJlY3RseS4pXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIFRhcHJvb3QnOiAnMkU0QycsIC8vIExhcmdlIG9yYW5nZSBzcHJlYWQgY2lyY2xlcywgTnVsbGNodSwgYm9zcyAxXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBFYXJ0aCBTaGFrZXInOiAnMzEzMScsIC8vIEVhcnRoIFNoYWtlciwgTGFraGFtdSwgYm9zcyAyXHJcbiAgfSxcclxuICBnYWluc0VmZmVjdFdhcm46IHtcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIFNlZHVjZWQnOiAnM0RGJywgLy8gR2F6ZSBmYWlsdXJlLCBXaXRoZXJlZCBCZWxsYWRvbm5hIHRyYXNoLCBiZWZvcmUgYm9zcyAxXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBQb2xsZW4nOiAnMTMnLCAvLyBTbHVkZ2UgcHVkZGxlcywgTnVsbGNodSwgYm9zcyAxXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBUcmFuc2ZpZ3VyYXRpb24nOiAnNjQ4JywgLy8gUm9seS1Qb2x5IEFvRSBjaXJjbGUgZmFpbHVyZSwgQkxvb21pbmcgQmlsb2tvIHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBIeXN0ZXJpYSc6ICcxMjgnLCAvLyBHYXplIGZhaWx1cmUsIExha2hhbXUsIGJvc3MgMlxyXG4gICAgJ1N0IE1vY2lhbm5lIEhhcmQgU3RhYiBXb3VuZCc6ICc0NUQnLCAvLyBBcmVuYSBvdXRlciB3YWxsIGVmZmVjdCwgYm9zcyAyXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBTdGFjayBtYXJrZXIsIE51bGxjaHUsIGJvc3MgMVxyXG4gICAgICBpZDogJ1N0IE1vY2lhbm5lIEhhcmQgRmF1bHQgV2FycmVuJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICcyRTRBJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSkgPT4gZS50eXBlID09PSAnMTUnLCAvLyBUYWtpbmcgdGhlIHN0YWNrIHNvbG8gaXMgKnByb2JhYmx5KiBhIG1pc3Rha2UuXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoYWxvbmUpYCxcclxuICAgICAgICAgICAgZGU6IGAke21hdGNoZXMuYWJpbGl0eX0gKGFsbGVpbilgLFxyXG4gICAgICAgICAgICBmcjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoc2V1bChlKSlgLFxyXG4gICAgICAgICAgICBqYTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5LiA5Lq6KWAsXHJcbiAgICAgICAgICAgIGNuOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjljZXlkIMpYCxcclxuICAgICAgICAgICAga286IGAke21hdGNoZXMuYWJpbGl0eX0gKO2YvOyekCDrp57snYwpYCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVTd2FsbG93c0NvbXBhc3MsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgSXZ5IEZldHRlcnMnOiAnMkMwNCcsIC8vIENpcmNsZSBncm91bmQgQW9FLCBTYWkgVGFpc3VpIHRyYXNoLCBiZWZvcmUgYm9zcyAxXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBXaWxkc3dpbmQgMSc6ICcyQzA1JywgLy8gVG9ybmFkbyBncm91bmQgQW9FLCBwbGFjZWQgYnkgU2FpIFRhaXN1aSB0cmFzaCwgYmVmb3JlIGJvc3MgMVxyXG5cclxuICAgICdTd2FsbG93cyBDb21wYXNzIFlhbWEtS2FndXJhJzogJzJCOTYnLCAvLyBGcm9udGFsIGxpbmUgQW9FLCBPdGVuZ3UsIGJvc3MgMVxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgRmxhbWVzIE9mIEhhdGUnOiAnMkI5OCcsIC8vIEZpcmUgb3JiIGV4cGxvc2lvbnMsIGJvc3MgMVxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgQ29uZmxhZ3JhdGUnOiAnMkI5OScsIC8vIENvbGxpc2lvbiB3aXRoIGZpcmUgb3JiLCBib3NzIDFcclxuXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBVcHdlbGwnOiAnMkMwNicsIC8vIFRhcmdldGVkIGNpcmNsZSBncm91bmQgQW9FLCBTYWkgVGFpc3VpIHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBCYWQgQnJlYXRoJzogJzJDMDcnLCAvLyBGcm9udGFsIGNsZWF2ZSwgSmlubWVuanUgdHJhc2gsIGJlZm9yZSBib3NzIDJcclxuXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBHcmVhdGVyIFBhbG0gMSc6ICcyQjlEJywgLy8gSGFsZiBhcmVuYSByaWdodCBjbGVhdmUsIERhaWRhcmFib3RjaGksIGJvc3MgMlxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgR3JlYXRlciBQYWxtIDInOiAnMkI5RScsIC8vIEhhbGYgYXJlbmEgbGVmdCBjbGVhdmUsIERhaWRhcmFib3RjaGksIGJvc3MgMlxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgVHJpYnV0YXJ5JzogJzJCQTAnLCAvLyBUYXJnZXRlZCB0aGluIGNvbmFsIGdyb3VuZCBBb0VzLCBEYWlkYXJhYm90Y2hpLCBib3NzIDJcclxuXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBXaWxkc3dpbmQgMic6ICcyQzA2JywgLy8gQ2lyY2xlIGdyb3VuZCBBb0UsIGVudmlyb25tZW50LCBhZnRlciBib3NzIDJcclxuICAgICdTd2FsbG93cyBDb21wYXNzIFdpbGRzd2luZCAzJzogJzJDMDcnLCAvLyBDaXJjbGUgZ3JvdW5kIEFvRSwgcGxhY2VkIGJ5IFNhaSBUYWlzdWkgdHJhc2gsIGFmdGVyIGJvc3MgMlxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgRmlsb3BsdW1lcyc6ICcyQzc2JywgLy8gRnJvbnRhbCByZWN0YW5nbGUgQW9FLCBEcmFnb24gQmkgRmFuZyB0cmFzaCwgYWZ0ZXIgYm9zcyAyXHJcblxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgQm90aCBFbmRzIDEnOiAnMkJBOCcsIC8vIENoYXJpb3QgQW9FLCBRaXRpYW4gRGFzaGVuZywgYm9zcyAzXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBCb3RoIEVuZHMgMic6ICcyQkE5JywgLy8gRHluYW1vIEFvRSwgUWl0aWFuIERhc2hlbmcsIGJvc3MgM1xyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgQm90aCBFbmRzIDMnOiAnMkJBRScsIC8vIENoYXJpb3QgQW9FLCBTaGFkb3cgT2YgVGhlIFNhZ2UsIGJvc3MgM1xyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgQm90aCBFbmRzIDQnOiAnMkJBRicsIC8vIER5bmFtbyBBb0UsIFNoYWRvdyBPZiBUaGUgU2FnZSwgYm9zcyAzXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBFcXVhbCBPZiBIZWF2ZW4nOiAnMkJCNCcsIC8vIFNtYWxsIGNpcmNsZSBncm91bmQgQW9FcywgUWl0aWFuIERhc2hlbmcsIGJvc3MgM1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBNaXJhZ2UnOiAnMkJBMicsIC8vIFByZXktY2hhc2luZyBwdWRkbGVzLCBEYWlkYXJhYm90Y2hpLCBib3NzIDJcclxuICAgICdTd2FsbG93cyBDb21wYXNzIE1vdW50YWluIEZhbGxzJzogJzJCQTUnLCAvLyBDaXJjbGUgc3ByZWFkIG1hcmtlcnMsIERhaWRhcmFib3RjaGksIGJvc3MgMlxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgVGhlIExvbmcgRW5kJzogJzJCQTcnLCAvLyBMYXNlciB0ZXRoZXIsIFFpdGlhbiBEYXNoZW5nICBib3NzIDNcclxuICAgICdTd2FsbG93cyBDb21wYXNzIFRoZSBMb25nIEVuZCAyJzogJzJCQUQnLCAvLyBMYXNlciBUZXRoZXIsIFNoYWRvd3MgT2YgVGhlIFNhZ2UsIGJvc3MgM1xyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBIeXN0ZXJpYSc6ICcxMjgnLCAvLyBHYXplIGF0dGFjayBmYWlsdXJlLCBPdGVuZ3UsIGJvc3MgMVxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgQmxlZWRpbmcnOiAnMTEyRicsIC8vIFN0ZXBwaW5nIG91dHNpZGUgdGhlIGFyZW5hLCBib3NzIDNcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIFN0YW5kaW5nIGluIHRoZSBsYWtlLCBEaWFkYXJhYm90Y2hpLCBib3NzIDJcclxuICAgICAgaWQ6ICdTd2FsbG93cyBDb21wYXNzIFNpeCBGdWxtcyBVbmRlcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcyMzcnIH0pLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjogbWF0Y2hlcy5lZmZlY3QsXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIFN0YWNrIG1hcmtlciwgYm9zcyAzXHJcbiAgICAgIGlkOiAnU3dhbGxvd3MgQ29tcGFzcyBGaXZlIEZpbmdlcmVkIFB1bmlzaG1lbnQnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6IFsnMkJBQicsICcyQkIwJ10sIHNvdXJjZTogWydRaXRpYW4gRGFzaGVuZycsICdTaGFkb3cgT2YgVGhlIFNhZ2UnXSB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoX2RhdGEsIG1hdGNoZXMpID0+IG1hdGNoZXMudHlwZSA9PT0gJzIxJywgLy8gVGFraW5nIHRoZSBzdGFjayBzb2xvIGlzICpwcm9iYWJseSogYSBtaXN0YWtlLlxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIGJsYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgZW46IGAke21hdGNoZXMuYWJpbGl0eX0gKGFsb25lKWAsXHJcbiAgICAgICAgICAgIGRlOiBgJHttYXRjaGVzLmFiaWxpdHl9IChhbGxlaW4pYCxcclxuICAgICAgICAgICAgZnI6IGAke21hdGNoZXMuYWJpbGl0eX0gKHNldWwoZSkpYCxcclxuICAgICAgICAgICAgamE6IGAke21hdGNoZXMuYWJpbGl0eX0gKOS4gOS6uilgLFxyXG4gICAgICAgICAgICBjbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5Y2V5ZCDKWAsXHJcbiAgICAgICAgICAgIGtvOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjtmLzsnpAg66ee7J2MKWAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZVRlbXBsZU9mVGhlRmlzdCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnVGVtcGxlIEZpcmUgQnJlYWsnOiAnMjFFRCcsIC8vIENvbmFsIEFvRSwgQmxvb2RnbGlkZXIgTW9uayB0cmFzaFxyXG4gICAgJ1RlbXBsZSBSYWRpYWwgQmxhc3Rlcic6ICcxRkQzJywgLy8gQ2lyY2xlIEFvRSwgYm9zcyAxXHJcbiAgICAnVGVtcGxlIFdpZGUgQmxhc3Rlcic6ICcxRkQ0JywgLy8gQ29uYWwgQW9FLCBib3NzIDFcclxuICAgICdUZW1wbGUgQ3JpcHBsaW5nIEJsb3cnOiAnMjAxNicsIC8vIExpbmUgQW9FcywgZW52aXJvbm1lbnRhbCwgYmVmb3JlIGJvc3MgMlxyXG4gICAgJ1RlbXBsZSBCcm9rZW4gRWFydGgnOiAnMjM2RScsIC8vIENpcmNsZSBBb0UsIFNpbmdoYSB0cmFzaFxyXG4gICAgJ1RlbXBsZSBTaGVhcic6ICcxRkREJywgLy8gRHVhbCBjb25hbCBBb0UsIGJvc3MgMlxyXG4gICAgJ1RlbXBsZSBDb3VudGVyIFBhcnJ5JzogJzFGRTAnLCAvLyBSZXRhbGlhdGlvbiBmb3IgaW5jb3JyZWN0IGRpcmVjdGlvbiBhZnRlciBLaWxsZXIgSW5zdGluY3QsIGJvc3MgMlxyXG4gICAgJ1RlbXBsZSBUYXBhcyc6ICcnLCAvLyBUcmFja2luZyBjaXJjdWxhciBncm91bmQgQW9FcywgYm9zcyAyXHJcbiAgICAnVGVtcGxlIEhlbGxzZWFsJzogJzIwMEYnLCAvLyBSZWQvQmx1ZSBzeW1ib2wgZmFpbHVyZSwgYm9zcyAyXHJcbiAgICAnVGVtcGxlIFB1cmUgV2lsbCc6ICcyMDE3JywgLy8gQ2lyY2xlIEFvRSwgU3Bpcml0IEZsYW1lIHRyYXNoLCBiZWZvcmUgYm9zcyAzXHJcbiAgICAnVGVtcGxlIE1lZ2FibGFzdGVyJzogJzE2MycsIC8vIENvbmFsIEFvRSwgQ29ldXJsIFByYW5hIHRyYXNoLCBiZWZvcmUgYm9zcyAzXHJcbiAgICAnVGVtcGxlIFdpbmRidXJuJzogJzFGRTgnLCAvLyBDaXJjbGUgQW9FLCBUd2lzdGVyIHdpbmQsIGJvc3MgM1xyXG4gICAgJ1RlbXBsZSBIdXJyaWNhbmUgS2ljayc6ICcxRkU1JywgLy8gMjcwLWRlZ3JlZSBmcm9udGFsIEFvRSwgYm9zcyAzXHJcbiAgICAnVGVtcGxlIFNpbGVudCBSb2FyJzogJzFGRUInLCAvLyBGcm9udGFsIGxpbmUgQW9FLCBib3NzIDNcclxuICAgICdUZW1wbGUgTWlnaHR5IEJsb3cnOiAnMUZFQScsIC8vIENvbnRhY3Qgd2l0aCBjb2V1cmwgaGVhZCwgYm9zcyAzXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdUZW1wbGUgSGVhdCBMaWdodG5pbmcnOiAnMUZENycsIC8vIFB1cnBsZSBzcHJlYWQgY2lyY2xlcywgYm9zcyAxXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlQnVybixcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnVGhlIEJ1cm4gRmFsbGluZyBSb2NrJzogJzMxQTMnLCAvLyBFbnZpcm9ubWVudGFsIGxpbmUgQW9FXHJcbiAgICAnVGhlIEJ1cm4gQWV0aGVyaWFsIEJsYXN0JzogJzMyOEInLCAvLyBMaW5lIEFvRSwgS3VrdWxrYW4gdHJhc2hcclxuICAgICdUaGUgQnVybiBNb2xlLWEtd2hhY2snOiAnMzI4RCcsIC8vIENpcmNsZSBBb0UsIERlc2VydCBEZXNtYW4gdHJhc2hcclxuICAgICdUaGUgQnVybiBIZWFkIEJ1dHQnOiAnMzI4RScsIC8vIFNtYWxsIGNvbmFsIEFvRSwgRGVzZXJ0IERlc21hbiB0cmFzaFxyXG4gICAgJ1RoZSBCdXJuIFNoYXJkZmFsbCc6ICczMTkxJywgLy8gUm9vbXdpZGUgQW9FLCBMb1MgZm9yIHNhZmV0eSwgSGVkZXRldCwgYm9zcyAxXHJcbiAgICAnVGhlIEJ1cm4gRGlzc29uYW5jZSc6ICczMTkyJywgLy8gRG9udXQgQW9FLCBIZWRldGV0LCBib3NzIDFcclxuICAgICdUaGUgQnVybiBDcnlzdGFsbGluZSBGcmFjdHVyZSc6ICczMTk3JywgLy8gQ2lyY2xlIEFvRSwgRGltIENyeXN0YWwsIGJvc3MgMVxyXG4gICAgJ1RoZSBCdXJuIFJlc29uYW50IEZyZXF1ZW5jeSc6ICczMTk4JywgLy8gQ2lyY2xlIEFvRSwgRGltIENyeXN0YWwsIGJvc3MgMVxyXG4gICAgJ1RoZSBCdXJuIFJvdG9zd2lwZSc6ICczMjkxJywgLy8gRnJvbnRhbCBjb25lIEFvRSwgQ2hhcnJlZCBEcmVhZG5hdWdodCB0cmFzaFxyXG4gICAgJ1RoZSBCdXJuIFdyZWNraW5nIEJhbGwnOiAnMzI5MicsIC8vIENpcmNsZSBBb0UsIENoYXJyZWQgRHJlYWRuYXVnaHQgdHJhc2hcclxuICAgICdUaGUgQnVybiBTaGF0dGVyJzogJzMyOTQnLCAvLyBMYXJnZSBjaXJjbGUgQW9FLCBDaGFycmVkIERvYmx5biB0cmFzaFxyXG4gICAgJ1RoZSBCdXJuIEF1dG8tQ2Fubm9ucyc6ICczMjk1JywgLy8gTGluZSBBb0UsIENoYXJyZWQgRHJvbmUgdHJhc2hcclxuICAgICdUaGUgQnVybiBTZWxmLURldG9uYXRlJzogJzMyOTYnLCAvLyBDaXJjbGUgQW9FLCBDaGFycmVkIERyb25lIHRyYXNoXHJcbiAgICAnVGhlIEJ1cm4gRnVsbCBUaHJvdHRsZSc6ICcyRDc1JywgLy8gTGluZSBBb0UsIERlZmVjdGl2ZSBEcm9uZSwgYm9zcyAyXHJcbiAgICAnVGhlIEJ1cm4gVGhyb3R0bGUnOiAnMkQ3NicsIC8vIExpbmUgQW9FLCBNaW5pbmcgRHJvbmUgYWRkcywgYm9zcyAyXHJcbiAgICAnVGhlIEJ1cm4gQWRpdCBEcml2ZXInOiAnMkQ3OCcsIC8vIExpbmUgQW9FLCBSb2NrIEJpdGVyIGFkZHMsIGJvc3MgMlxyXG4gICAgJ1RoZSBCdXJuIFRyZW1ibG9yJzogJzMyOTcnLCAvLyBMYXJnZSBjaXJjbGUgQW9FLCBWZWlsZWQgR2lnYXdvcm0gdHJhc2hcclxuICAgICdUaGUgQnVybiBEZXNlcnQgU3BpY2UnOiAnMzI5OCcsIC8vIFRoZSBmcm9udGFsIGNsZWF2ZXMgbXVzdCBmbG93XHJcbiAgICAnVGhlIEJ1cm4gVG94aWMgU3ByYXknOiAnMzI5QScsIC8vIEZyb250YWwgY29uZSBBb0UsIEdpZ2F3b3JtIFN0YWxrZXIgdHJhc2hcclxuICAgICdUaGUgQnVybiBWZW5vbSBTcHJheSc6ICczMjlCJywgLy8gVGFyZ2V0ZWQgY2lyY2xlIEFvRSwgR2lnYXdvcm0gU3RhbGtlciB0cmFzaFxyXG4gICAgJ1RoZSBCdXJuIFdoaXRlIERlYXRoJzogJzMxNDMnLCAvLyBSZWFjdGl2ZSBkdXJpbmcgaW52dWxuZXJhYmlsaXR5LCBNaXN0IERyYWdvbiwgYm9zcyAzXHJcbiAgICAnVGhlIEJ1cm4gRm9nIFBsdW1lIDEnOiAnMzE0NScsIC8vIFN0YXIgQW9FLCBNaXN0IERyYWdvbiwgYm9zcyAzXHJcbiAgICAnVGhlIEJ1cm4gRm9nIFBsdW1lIDInOiAnMzE0NicsIC8vIExpbmUgQW9FcyBhZnRlciBzdGFycywgTWlzdCBEcmFnb24sIGJvc3MgM1xyXG4gICAgJ1RoZSBCdXJuIENhdXRlcml6ZSc6ICczMTQ4JywgLy8gTGluZS9Td29vcCBBb0UsIE1pc3QgRHJhZ29uLCBib3NzIDNcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdUaGUgQnVybiBDb2xkIEZvZyc6ICczMTQyJywgLy8gR3Jvd2luZyBjaXJjbGUgQW9FLCBNaXN0IERyYWdvbiwgYm9zcyAzXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdUaGUgQnVybiBIYWlsZmlyZSc6ICczMTk0JywgLy8gSGVhZCBtYXJrZXIgbGluZSBBb0UsIEhlZGV0ZXQsIGJvc3MgMVxyXG4gICAgJ1RoZSBCdXJuIFNoYXJkc3RyaWtlJzogJzMxOTUnLCAvLyBPcmFuZ2Ugc3ByZWFkIGhlYWQgbWFya2VycywgSGVkZXRldCwgYm9zcyAxXHJcbiAgICAnVGhlIEJ1cm4gQ2hpbGxpbmcgQXNwaXJhdGlvbic6ICczMTREJywgLy8gSGVhZCBtYXJrZXIgY2xlYXZlLCBNaXN0IERyYWdvbiwgYm9zcyAzXHJcbiAgICAnVGhlIEJ1cm4gRnJvc3QgQnJlYXRoJzogJzMxNEMnLCAvLyBUYW5rIGNsZWF2ZSwgTWlzdCBEcmFnb24sIGJvc3MgM1xyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnVGhlIEJ1cm4gTGVhZGVuJzogJzQzJywgLy8gUHVkZGxlIGVmZmVjdCwgYm9zcyAyLiAoQWxzbyBpbmZsaWN0cyAxMUYsIFNsdWRnZS4pXHJcbiAgICAnVGhlIEJ1cm4gUHVkZGxlIEZyb3N0Yml0ZSc6ICcxMUQnLCAvLyBJY2UgcHVkZGxlIGVmZmVjdCwgYm9zcyAzLiAoTk9UIHRoZSBjb25hbC1pbmZsaWN0ZWQgb25lLCAxMEMuKVxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gTzFOIC0gRGVsdGFzY2FwZSAxLjAgTm9ybWFsXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5EZWx0YXNjYXBlVjEwLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdPMU4gQnVybic6ICcyM0Q1JywgLy8gRmlyZWJhbGwgZXhwbG9zaW9uIGNpcmNsZSBBb0VzXHJcbiAgICAnTzFOIENsYW1wJzogJzIzRTInLCAvLyBGcm9udGFsIHJlY3RhbmdsZSBrbm9ja2JhY2sgQW9FLCBBbHRlIFJvaXRlXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBTbWFsbCBzcHJlYWQgY2lyY2xlc1xyXG4gICAgICBpZDogJ08xTiBMZXZpbmJvbHQnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzIzREEnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBPMk4gLSBEZWx0YXNjYXBlIDIuMCBOb3JtYWxcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkRlbHRhc2NhcGVWMjAsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ08yTiBNYWluIFF1YWtlJzogJzI0QTUnLCAvLyBOb24tdGVsZWdyYXBoZWQgY2lyY2xlIEFvRSwgRmxlc2h5IE1lbWJlclxyXG4gICAgJ08yTiBFcm9zaW9uJzogJzI1OTAnLCAvLyBTbWFsbCBjaXJjbGUgQW9FcywgRmxlc2h5IE1lbWJlclxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnTzJOIFBhcmFub3JtYWwgV2F2ZSc6ICcyNTBFJywgLy8gSW5zdGFudCB0YW5rIGNsZWF2ZVxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gV2UgY291bGQgdHJ5IHRvIHNlcGFyYXRlIG91dCB0aGUgbWlzdGFrZSB0aGF0IGxlZCB0byB0aGUgcGxheWVyIGJlaW5nIHBldHJpZmllZC5cclxuICAgICAgLy8gSG93ZXZlciwgaXQncyBOb3JtYWwgbW9kZSwgd2h5IG92ZXJ0aGluayBpdD9cclxuICAgICAgaWQ6ICdPMk4gUGV0cmlmaWNhdGlvbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcyNjInIH0pLFxyXG4gICAgICAvLyBUaGUgdXNlciBtaWdodCBnZXQgaGl0IGJ5IGFub3RoZXIgcGV0cmlmeWluZyBhYmlsaXR5IGJlZm9yZSB0aGUgZWZmZWN0IGVuZHMuXHJcbiAgICAgIC8vIFRoZXJlJ3Mgbm8gcG9pbnQgaW4gbm90aWZ5aW5nIGZvciB0aGF0LlxyXG4gICAgICBzdXBwcmVzc1NlY29uZHM6IDEwLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGUudGFyZ2V0LCB0ZXh0OiBlLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdPMk4gRWFydGhxdWFrZScsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnMjUxNScsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IHtcclxuICAgICAgICAvLyBUaGlzIGRlYWxzIGRhbWFnZSBvbmx5IHRvIG5vbi1mbG9hdGluZyB0YXJnZXRzLlxyXG4gICAgICAgIHJldHVybiBlLmRhbWFnZSA+IDA7XHJcbiAgICAgIH0sXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBuYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIE8zTiAtIERlbHRhc2NhcGUgMy4wIE5vcm1hbFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRGVsdGFzY2FwZVYzMCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnTzNOIFNwZWxsYmxhZGUgRmlyZSBJSUknOiAnMjQ2MCcsIC8vIERvbnV0IEFvRSwgSGFsaWNhcm5hc3N1c1xyXG4gICAgJ08zTiBTcGVsbGJsYWRlIEJsaXp6YXJkIElJSSc6ICcyNDYxJywgLy8gQ2lyY2xlIEFvRSwgSGFsaWNhcm5hc3N1c1xyXG4gICAgJ08zTiBTcGVsbGJsYWRlIFRodW5kZXIgSUlJJzogJzI0NjInLCAvLyBMaW5lIEFvRSwgSGFsaWNhcm5hc3N1c1xyXG4gICAgJ08zTiBDcm9zcyBSZWFwZXInOiAnMjQ2QicsIC8vIENpcmNsZSBBb0UsIFNvdWwgUmVhcGVyXHJcbiAgICAnTzNOIEd1c3RpbmcgR291Z2UnOiAnMjQ2QycsIC8vIEdyZWVuIGxpbmUgQW9FLCBTb3VsIFJlYXBlclxyXG4gICAgJ08zTiBTd29yZCBEYW5jZSc6ICcyNDcwJywgLy8gVGFyZ2V0ZWQgdGhpbiBjb25lIEFvRSwgSGFsaWNhcm5hc3N1c1xyXG4gICAgJ08zTiBVcGxpZnQnOiAnMjQ3MycsIC8vIEdyb3VuZCBzcGVhcnMsIFF1ZWVuJ3MgV2FsdHogZWZmZWN0LCBIYWxpY2FybmFzc3VzXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnTzNOIFVsdGltdW0nOiAnMjQ3NycsIC8vIEluc3RhbnQga2lsbC4gVXNlZCBpZiB0aGUgcGxheWVyIGRvZXMgbm90IGV4aXQgdGhlIHNhbmQgbWF6ZSBmYXN0IGVub3VnaC5cclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ08zTiBIb2x5IEJsdXInOiAyNDYzLCAvLyBTcHJlYWQgY2lyY2xlcy5cclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzNOIFBoYXNlIFRyYWNrZXInLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5zdGFydHNVc2luZyh7IGlkOiAnMjMwNCcsIHNvdXJjZTogJ0hhbGljYXJuYXNzdXMnLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgbmV0UmVnZXhEZTogTmV0UmVnZXhlcy5zdGFydHNVc2luZyh7IGlkOiAnMjMwNCcsIHNvdXJjZTogJ0hhbGlrYXJuYXNzb3MnLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgbmV0UmVnZXhGcjogTmV0UmVnZXhlcy5zdGFydHNVc2luZyh7IGlkOiAnMjMwNCcsIHNvdXJjZTogJ0hhbGljYXJuYXNzZScsIGNhcHR1cmU6IGZhbHNlIH0pLFxyXG4gICAgICBuZXRSZWdleEphOiBOZXRSZWdleGVzLnN0YXJ0c1VzaW5nKHsgaWQ6ICcyMzA0Jywgc291cmNlOiAn44OP44Oq44Kr44Or44OK44OD44K944K5JywgY2FwdHVyZTogZmFsc2UgfSksXHJcbiAgICAgIG5ldFJlZ2V4Q246IE5ldFJlZ2V4ZXMuc3RhcnRzVXNpbmcoeyBpZDogJzIzMDQnLCBzb3VyY2U6ICflk4jliKnljaHnurPoi4/mlq8nLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgbmV0UmVnZXhLbzogTmV0UmVnZXhlcy5zdGFydHNVc2luZyh7IGlkOiAnMjMwNCcsIHNvdXJjZTogJ+2VoOumrOy5tOultOuCmOyGjOyKpCcsIGNhcHR1cmU6IGZhbHNlIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSkgPT4ge1xyXG4gICAgICAgIGRhdGEucGhhc2VOdW1iZXIgKz0gMTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIFRoZXJlJ3MgYSBsb3QgdG8gdHJhY2ssIGFuZCBpbiBvcmRlciB0byBtYWtlIGl0IGFsbCBjbGVhbiwgaXQncyBzYWZlc3QganVzdCB0b1xyXG4gICAgICAvLyBpbml0aWFsaXplIGl0IGFsbCB1cCBmcm9udCBpbnN0ZWFkIG9mIHRyeWluZyB0byBndWFyZCBhZ2FpbnN0IHVuZGVmaW5lZCBjb21wYXJpc29ucy5cclxuICAgICAgaWQ6ICdPM04gSW5pdGlhbGl6aW5nJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMzY3Jywgc291cmNlOiAnSGFsaWNhcm5hc3N1cycsIGNhcHR1cmU6IGZhbHNlIH0pLFxyXG4gICAgICBuZXRSZWdleERlOiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzM2NycsIHNvdXJjZTogJ0hhbGlrYXJuYXNzb3MnLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgbmV0UmVnZXhGcjogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICczNjcnLCBzb3VyY2U6ICdIYWxpY2FybmFzc2UnLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgbmV0UmVnZXhKYTogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICczNjcnLCBzb3VyY2U6ICfjg4/jg6rjgqvjg6vjg4rjg4Pjgr3jgrknLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgbmV0UmVnZXhDbjogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICczNjcnLCBzb3VyY2U6ICflk4jliKnljaHnurPoi4/mlq8nLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgbmV0UmVnZXhLbzogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICczNjcnLCBzb3VyY2U6ICftlaDrpqzsubTrpbTrgpjshozsiqQnLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoX2UsIGRhdGEpID0+ICFkYXRhLmluaXRpYWxpemVkLFxyXG4gICAgICBydW46IChfZSwgZGF0YSkgPT4ge1xyXG4gICAgICAgIGRhdGEuZ2FtZUNvdW50ID0gMDtcclxuICAgICAgICAvLyBJbmRleGluZyBwaGFzZXMgYXQgMSBzbyBhcyB0byBtYWtlIHBoYXNlcyBtYXRjaCB3aGF0IGh1bWFucyBleHBlY3QuXHJcbiAgICAgICAgLy8gMTogV2Ugc3RhcnQgaGVyZS5cclxuICAgICAgICAvLyAyOiBDYXZlIHBoYXNlIHdpdGggVXBsaWZ0cy5cclxuICAgICAgICAvLyAzOiBQb3N0LWludGVybWlzc2lvbiwgd2l0aCBnb29kIGFuZCBiYWQgZnJvZ3MuXHJcbiAgICAgICAgZGF0YS5waGFzZU51bWJlciA9IDE7XHJcbiAgICAgICAgZGF0YS5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ08zTiBSaWJiaXQnLFxyXG4gICAgICBhYmlsaXR5UmVnZXg6ICcyNDY2JyxcclxuICAgICAgY29uZGl0aW9uOiAoZSwgZGF0YSkgPT4ge1xyXG4gICAgICAgIC8vIFdlIERPIHdhbnQgdG8gYmUgaGl0IGJ5IFRvYWQvUmliYml0IGlmIHRoZSBuZXh0IGNhc3Qgb2YgVGhlIEdhbWVcclxuICAgICAgICAvLyBpcyA0eCB0b2FkIHBhbmVscy5cclxuICAgICAgICByZXR1cm4gIShkYXRhLnBoYXNlTnVtYmVyID09PSAzICYmIGRhdGEuZ2FtZUNvdW50ICUgMiA9PT0gMCkgJiYgZS50YXJnZXRJZCAhPT0gJ0UwMDAwMDAwJztcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIFRoZXJlJ3MgYSBsb3Qgd2UgY291bGQgZG8gdG8gdHJhY2sgZXhhY3RseSBob3cgdGhlIHBsYXllciBmYWlsZWQgVGhlIEdhbWUuXHJcbiAgICAgIC8vIFdoeSBvdmVydGhpbmsgTm9ybWFsIG1vZGUsIGhvd2V2ZXI/XHJcbiAgICAgIGlkOiAnTzNOIFRoZSBHYW1lJyxcclxuICAgICAgLy8gR3Vlc3Mgd2hhdCB5b3UganVzdCBsb3N0P1xyXG4gICAgICBhYmlsaXR5UmVnZXg6ICcyNDZEJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSkgPT4ge1xyXG4gICAgICAgIC8vIElmIHRoZSBwbGF5ZXIgdGFrZXMgbm8gZGFtYWdlLCB0aGV5IGRpZCB0aGUgbWVjaGFuaWMgY29ycmVjdGx5LlxyXG4gICAgICAgIHJldHVybiBlLmRhbWFnZSA+IDA7XHJcbiAgICAgIH0sXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgZGF0YS5nYW1lQ291bnQgKz0gMTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIE80TiAtIERlbHRhc2NhcGUgNC4wIE5vcm1hbFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRGVsdGFzY2FwZVY0MCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnTzROIEJsaXp6YXJkIElJSSc6ICcyNEJDJywgLy8gVGFyZ2V0ZWQgY2lyY2xlIEFvRXMsIEV4ZGVhdGhcclxuICAgICdPNE4gRW1wb3dlcmVkIFRodW5kZXIgSUlJJzogJzI0QzEnLCAvLyBVbnRlbGVncmFwaGVkIGxhcmdlIGNpcmNsZSBBb0UsIEV4ZGVhdGhcclxuICAgICdPNE4gWm9tYmllIEJyZWF0aCc6ICcyNENCJywgLy8gQ29uYWwsIHRyZWUgaGVhZCBhZnRlciBEZWNpc2l2ZSBCYXR0bGVcclxuICAgICdPNE4gQ2xlYXJvdXQnOiAnMjRDQycsIC8vIE92ZXJsYXBwaW5nIGNvbmUgQW9FcywgRGVhdGhseSBWaW5lICh0ZW50YWNsZXMgYWxvbmdzaWRlIHRyZWUgaGVhZClcclxuICAgICdPNE4gQmxhY2sgU3BhcmsnOiAnMjRDOScsIC8vIEV4cGxvZGluZyBCbGFjayBIb2xlXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgIC8vIEVtcG93ZXJlZCBGaXJlIElJSSBpbmZsaWN0cyB0aGUgUHlyZXRpYyBkZWJ1ZmYsIHdoaWNoIGRlYWxzIGRhbWFnZSBpZiB0aGUgcGxheWVyXHJcbiAgICAvLyBtb3ZlcyBvciBhY3RzIGJlZm9yZSB0aGUgZGVidWZmIGZhbGxzLiBVbmZvcnR1bmF0ZWx5IGl0IGRvZXNuJ3QgbG9vayBsaWtlIHRoZXJlJ3NcclxuICAgIC8vIGN1cnJlbnRseSBhIGxvZyBsaW5lIGZvciB0aGlzLCBzbyB0aGUgb25seSB3YXkgdG8gY2hlY2sgZm9yIHRoaXMgaXMgdG8gY29sbGVjdFxyXG4gICAgLy8gdGhlIGRlYnVmZnMgYW5kIHRoZW4gd2FybiBpZiBhIHBsYXllciB0YWtlcyBhbiBhY3Rpb24gZHVyaW5nIHRoYXQgdGltZS4gTm90IHdvcnRoIGl0XHJcbiAgICAvLyBmb3IgTm9ybWFsLlxyXG4gICAgJ080TiBTdGFuZGFyZCBGaXJlJzogJzI0QkEnLFxyXG4gICAgJ080TiBCdXN0ZXIgVGh1bmRlcic6ICcyNEJFJywgLy8gQSBjbGVhdmluZyB0YW5rIGJ1c3RlclxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdPNE4gRG9vbScsIC8vIEtpbGxzIHRhcmdldCBpZiBub3QgY2xlYW5zZWRcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzM4RScgfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBlLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ0NsZWFuc2VycyBtaXNzZWQgRG9vbSEnLFxyXG4gICAgICAgICAgICBkZTogJ0Rvb20tUmVpbmlndW5nIHZlcmdlc3NlbiEnLFxyXG4gICAgICAgICAgICBmcjogJ05cXCdhIHBhcyDDqXTDqSBkaXNzaXDDqShlKSBkdSBHbGFzICEnLFxyXG4gICAgICAgICAgICBqYTogJ+atu+OBruWuo+WRiicsXHJcbiAgICAgICAgICAgIGNuOiAn5rKh6Kej5q275a6jJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzROIFZhY3V1bSBXYXZlJywgLy8gU2hvcnQga25vY2tiYWNrIGZyb20gRXhkZWF0aFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzI0QjgnLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogZS50YXJnZXROYW1lLFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnUHVzaGVkIG9mZiEnLFxyXG4gICAgICAgICAgICBkZTogJ1J1bnRlciBnZXNjaHVic3QhJyxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIHBvdXNzw6koZSkgIScsXHJcbiAgICAgICAgICAgIGphOiAn6JC944Gh44GfJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdPNE4gRW1wb3dlcmVkIEJsaXp6YXJkJywgLy8gUm9vbS13aWRlIEFvRSwgZnJlZXplcyBub24tbW92aW5nIHRhcmdldHNcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzRFNicgfSksXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogZS50YXJnZXQsIHRleHQ6IGUuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBPNFMgLSBEZWx0YXNjYXBlIDQuMCBTYXZhZ2VcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkRlbHRhc2NhcGVWNDBTYXZhZ2UsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ080UzIgTmVvIFZhY3V1bSBXYXZlJzogJzI0MUQnLFxyXG4gICAgJ080UzIgQWNjZWxlcmF0aW9uIEJvbWInOiAnMjQzMScsXHJcbiAgICAnTzRTMiBFbXB0aW5lc3MnOiAnMjQyMicsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnTzRTMiBEb3VibGUgTGFzZXInOiAnMjQxNScsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ080UzIgRGVjaXNpdmUgQmF0dGxlJyxcclxuICAgICAgYWJpbGl0eVJlZ2V4OiAnMjQwOCcsXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgZGF0YS5pc0RlY2lzaXZlQmF0dGxlRWxlbWVudCA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ080UzEgVmFjdXVtIFdhdmUnLFxyXG4gICAgICBhYmlsaXR5UmVnZXg6ICcyM0ZFJyxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEpID0+IHtcclxuICAgICAgICBkYXRhLmlzRGVjaXNpdmVCYXR0bGVFbGVtZW50ID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ080UzIgQWxtYWdlc3QnLFxyXG4gICAgICBhYmlsaXR5UmVnZXg6ICcyNDE3JyxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEpID0+IHtcclxuICAgICAgICBkYXRhLmlzTmVvRXhkZWF0aCA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ080UzIgQmxpenphcmQgSUlJJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICcyM0Y4JyxcclxuICAgICAgY29uZGl0aW9uOiAoZSwgZGF0YSkgPT4ge1xyXG4gICAgICAgIC8vIElnbm9yZSB1bmF2b2lkYWJsZSByYWlkIGFvZSBCbGl6emFyZCBJSUkuXHJcbiAgICAgICAgcmV0dXJuIGRhdGEuSXNQbGF5ZXJJZChlLnRhcmdldElkKSAmJiAhZGF0YS5pc0RlY2lzaXZlQmF0dGxlRWxlbWVudDtcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzRTMiBUaHVuZGVyIElJSScsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnMjNGRCcsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUsIGRhdGEpID0+IHtcclxuICAgICAgICAvLyBPbmx5IGNvbnNpZGVyIHRoaXMgZHVyaW5nIHJhbmRvbSBtZWNoYW5pYyBhZnRlciBkZWNpc2l2ZSBiYXR0bGUuXHJcbiAgICAgICAgcmV0dXJuIGRhdGEuSXNQbGF5ZXJJZChlLnRhcmdldElkKSAmJiBkYXRhLmlzRGVjaXNpdmVCYXR0bGVFbGVtZW50O1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdPNFMyIFBldHJpZmllZCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcyNjInIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICAvLyBPbiBOZW8sIGJlaW5nIHBldHJpZmllZCBpcyBiZWNhdXNlIHlvdSBsb29rZWQgYXQgU2hyaWVrLCBzbyB5b3VyIGZhdWx0LlxyXG4gICAgICAgIGlmIChkYXRhLmlzTmVvRXhkZWF0aClcclxuICAgICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICAgIC8vIE9uIG5vcm1hbCBFeERlYXRoLCB0aGlzIGlzIGR1ZSB0byBXaGl0ZSBIb2xlLlxyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgbmFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ080UzIgRm9ya2VkIExpZ2h0bmluZycsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnMjQyRScsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUsIGRhdGEpID0+IGRhdGEuSXNQbGF5ZXJJZChlLnRhcmdldElkKSxcclxuICAgICAgbWlzdGFrZTogKGUsIGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gZS5hYmlsaXR5TmFtZSArICcgPT4gJyArIGRhdGEuU2hvcnROYW1lKGUudGFyZ2V0TmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS5hdHRhY2tlck5hbWUsIHRleHQ6IHRleHQgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzRTMiBEb3VibGUgQXR0YWNrJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICcyNDFDJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSwgZGF0YSkgPT4gZGF0YS5Jc1BsYXllcklkKGUudGFyZ2V0SWQpLFxyXG4gICAgICBjb2xsZWN0U2Vjb25kczogMC41LFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIGlmIChlLmxlbmd0aCA8PSAyKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vIEhhcmQgdG8ga25vdyB3aG8gc2hvdWxkIGJlIGluIHRoaXMgYW5kIHdobyBzaG91bGRuJ3QsIGJ1dFxyXG4gICAgICAgIC8vIGl0IHNob3VsZCBuZXZlciBoaXQgMyBwZW9wbGUuXHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBmdWxsVGV4dDogZVswXS5hYmlsaXR5TmFtZSArICcgeCAnICsgZS5sZW5ndGggfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzRTMiBCZXlvbmQgRGVhdGggR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc1NjYnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzQmV5b25kRGVhdGggPSBkYXRhLmhhc0JleW9uZERlYXRoIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzQmV5b25kRGVhdGhbbWF0Y2hlcy50YXJnZXRdID0gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzRTMiBCZXlvbmQgRGVhdGggTG9zZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmxvc2VzRWZmZWN0KHsgZWZmZWN0SWQ6ICc1NjYnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzQmV5b25kRGVhdGggPSBkYXRhLmhhc0JleW9uZERlYXRoIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzQmV5b25kRGVhdGhbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ080UzIgQmV5b25kIERlYXRoJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzU2NicgfSksXHJcbiAgICAgIGRlbGF5U2Vjb25kczogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4gcGFyc2VGbG9hdChtYXRjaGVzLmR1cmF0aW9uKSAtIDAuNSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGlmICghZGF0YS5oYXNCZXlvbmREZWF0aClcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAoIWRhdGEuaGFzQmV5b25kRGVhdGhbbWF0Y2hlcy50YXJnZXRdKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjogbWF0Y2hlcy5lZmZlY3QsXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBPN1MgLSBTaWdtYXNjYXBlIDMuMCBTYXZhZ2VcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlNpZ21hc2NhcGVWMzBTYXZhZ2UsXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ083UyBNaXNzaWxlJzogJzI3ODInLFxyXG4gICAgJ083UyBDaGFpbiBDYW5ub24nOiAnMjc4RicsXHJcbiAgfSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnTzdTIFNlYXJpbmcgV2luZCc6ICcyNzc3JyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzdTIFN0b25lc2tpbicsXHJcbiAgICAgIGFiaWxpdHlSZWdleDogJzJBQjUnLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogY291bGQgYWRkIFBhdGNoIHdhcm5pbmdzIGZvciBkb3VibGUvdW5icm9rZW4gdGV0aGVyc1xyXG4vLyBUT0RPOiBIZWxsbyBXb3JsZCBjb3VsZCBoYXZlIGFueSB3YXJuaW5ncyAoc29ycnkpXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuQWxwaGFzY2FwZVY0MFNhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnTzEyUzEgU3VwZXJsaW1pbmFsIE1vdGlvbiAxJzogJzMzMzQnLCAvLyAzMDArIGRlZ3JlZSBjbGVhdmUgd2l0aCBiYWNrIHNhZmUgYXJlYVxyXG4gICAgJ08xMlMxIEVmZmljaWVudCBCbGFkZXdvcmsgMSc6ICczMzI5JywgLy8gT21lZ2EtTSBcImdldCBvdXRcIiBjZW50ZXJlZCBhb2UgYWZ0ZXIgc3BsaXRcclxuICAgICdPMTJTMSBFZmZpY2llbnQgQmxhZGV3b3JrIDInOiAnMzMyQScsIC8vIE9tZWdhLU0gXCJnZXQgb3V0XCIgY2VudGVyZWQgYW9lIGR1cmluZyBibGFkZXNcclxuICAgICdPMTJTMSBCZXlvbmQgU3RyZW5ndGgnOiAnMzMyOCcsIC8vIE9tZWdhLU0gXCJnZXQgaW5cIiBjZW50ZXJlZCBhb2UgZHVyaW5nIHNoaWVsZFxyXG4gICAgJ08xMlMxIFN1cGVybGltaW5hbCBTdGVlbCAxJzogJzMzMzAnLCAvLyBPbWVnYS1GIFwiZ2V0IGZyb250L2JhY2tcIiBibGFkZXMgcGhhc2VcclxuICAgICdPMTJTMSBTdXBlcmxpbWluYWwgU3RlZWwgMic6ICczMzMxJywgLy8gT21lZ2EtRiBcImdldCBmcm9udC9iYWNrXCIgYmxhZGVzIHBoYXNlXHJcbiAgICAnTzEyUzEgT3B0aW1pemVkIEJsaXp6YXJkIElJSSc6ICczMzMyJywgLy8gT21lZ2EtRiBnaWFudCBjcm9zc1xyXG4gICAgJ08xMlMyIERpZmZ1c2UgV2F2ZSBDYW5ub24nOiAnMzM2OScsIC8vIGJhY2svc2lkZXMgbGFzZXJzXHJcbiAgICAnTzEyUzIgUmlnaHQgQXJtIFVuaXQgSHlwZXIgUHVsc2UgMSc6ICczMzVBJywgLy8gUm90YXRpbmcgQXJjaGl2ZSBQZXJpcGhlcmFsIGxhc2Vyc1xyXG4gICAgJ08xMlMyIFJpZ2h0IEFybSBVbml0IEh5cGVyIFB1bHNlIDInOiAnMzM1QicsIC8vIFJvdGF0aW5nIEFyY2hpdmUgUGVyaXBoZXJhbCBsYXNlcnNcclxuICAgICdPMTJTMiBSaWdodCBBcm0gVW5pdCBDb2xvc3NhbCBCbG93JzogJzMzNUYnLCAvLyBFeHBsb2RpbmcgQXJjaGl2ZSBBbGwgaGFuZHNcclxuICAgICdPMTJTMiBMZWZ0IEFybSBVbml0IENvbG9zc2FsIEJsb3cnOiAnMzM2MCcsIC8vIEV4cGxvZGluZyBBcmNoaXZlIEFsbCBoYW5kc1xyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ08xMlMxIE9wdGljYWwgTGFzZXInOiAnMzM0NycsIC8vIG1pZGRsZSBsYXNlciBmcm9tIGV5ZVxyXG4gICAgJ08xMlMxIEFkdmFuY2VkIE9wdGljYWwgTGFzZXInOiAnMzM0QScsIC8vIGdpYW50IGNpcmNsZSBjZW50ZXJlZCBvbiBleWVcclxuICAgICdPMTJTMiBSZWFyIFBvd2VyIFVuaXQgUmVhciBMYXNlcnMgMSc6ICczMzYxJywgLy8gQXJjaGl2ZSBBbGwgaW5pdGlhbCBsYXNlclxyXG4gICAgJ08xMlMyIFJlYXIgUG93ZXIgVW5pdCBSZWFyIExhc2VycyAyJzogJzMzNjInLCAvLyBBcmNoaXZlIEFsbCByb3RhdGluZyBsYXNlclxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnTzEyUzEgT3B0aW1pemVkIEZpcmUgSUlJJzogJzMzMzcnLCAvLyBmaXJlIHNwcmVhZFxyXG4gICAgJ08xMlMyIEh5cGVyIFB1bHNlIFRldGhlcic6ICczMzVDJywgLy8gSW5kZXggQW5kIEFyY2hpdmUgUGVyaXBoZXJhbCB0ZXRoZXJzXHJcbiAgICAnTzEyUzIgV2F2ZSBDYW5ub24nOiAnMzM2QicsIC8vIEluZGV4IEFuZCBBcmNoaXZlIFBlcmlwaGVyYWwgYmFpdGVkIGxhc2Vyc1xyXG4gICAgJ08xMlMyIE9wdGltaXplZCBGaXJlIElJSSc6ICczMzc5JywgLy8gQXJjaGl2ZSBBbGwgc3ByZWFkXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgICdPMTJTMSBPcHRpbWl6ZWQgU2FnaXR0YXJpdXMgQXJyb3cnOiAnMzM0RCcsIC8vIE9tZWdhLU0gYmFyZCBsaW1pdCBicmVha1xyXG4gICAgJ08xMlMyIE92ZXJzYW1wbGVkIFdhdmUgQ2Fubm9uJzogJzMzNjYnLCAvLyBNb25pdG9yIHRhbmsgYnVzdGVyc1xyXG4gICAgJ08xMlMyIFNhdmFnZSBXYXZlIENhbm5vbic6ICczMzZEJywgLy8gVGFuayBidXN0ZXIgd2l0aCB0aGUgdnVsbiBmaXJzdFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdPMTJTMSBEaXNjaGFyZ2VyIEtub2NrZWQgT2ZmJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMzMyNycgfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnS25vY2tlZCBvZmYnLFxyXG4gICAgICAgICAgICBkZTogJ1J1bnRlcmdlZmFsbGVuJyxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIGFzc29tbcOpKGUpJyxcclxuICAgICAgICAgICAgamE6ICfjg47jg4Pjgq/jg5Djg4Pjgq8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICAgIGtvOiAn64SJ67CxJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzEyUzEgTWFnaWMgVnVsbmVyYWJpbGl0eSBVcCBHYWluJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzQ3MicgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS52dWxuID0gZGF0YS52dWxuIHx8IHt9O1xyXG4gICAgICAgIGRhdGEudnVsblttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdPMTJTMSBNYWdpYyBWdWxuZXJhYmlsaXR5IFVwIExvc2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnNDcyJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLnZ1bG4gPSBkYXRhLnZ1bG4gfHwge307XHJcbiAgICAgICAgZGF0YS52dWxuW21hdGNoZXMudGFyZ2V0XSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdPMTJTMSBNYWdpYyBWdWxuZXJhYmlsaXR5IERhbWFnZScsXHJcbiAgICAgIC8vIDMzMkUgPSBQaWxlIFBpdGNoIHN0YWNrXHJcbiAgICAgIC8vIDMzM0UgPSBFbGVjdHJpYyBTbGlkZSAoT21lZ2EtTSBzcXVhcmUgMS00IGRhc2hlcylcclxuICAgICAgLy8gMzMzRiA9IEVsZWN0cmljIFNsaWRlIChPbWVnYS1GIHRyaWFuZ2xlIDEtNCBkYXNoZXMpXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiBbJzMzMkUnLCAnMzMzRScsICczMzNGJ10sXHJcbiAgICAgIGNvbmRpdGlvbjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLnZ1bG4gJiYgZGF0YS52dWxuW21hdGNoZXMudGFyZ2V0XSxcclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiBgJHttYXRjaGVzLmFiaWxpdHl9ICh3aXRoIHZ1bG4pYCxcclxuICAgICAgICAgICAgZGU6IGAke21hdGNoZXMuYWJpbGl0eX0gKG1pdCBWZXJ3dW5kYmFya2VpdClgLFxyXG4gICAgICAgICAgICBqYTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo6KKr44OA44Oh44O844K45LiK5piHKWAsXHJcbiAgICAgICAgICAgIGNuOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjluKbmmJPkvKQpYCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBCeWFra28gRXh0cmVtZVxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlSmFkZVN0b2FFeHRyZW1lLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgIC8vIFBvcHBpbmcgVW5yZWxlbnRpbmcgQW5ndWlzaCBidWJibGVzXHJcbiAgICAnQnlhRXggQXJhdGFtYSc6ICcyN0Y2JyxcclxuICAgIC8vIFN0ZXBwaW5nIGluIGdyb3dpbmcgb3JiXHJcbiAgICAnQnlhRXggVmFjdXVtIENsYXcnOiAnMjdFOScsXHJcbiAgICAvLyBMaWdodG5pbmcgUHVkZGxlc1xyXG4gICAgJ0J5YUV4IEh1bmRlcmZvbGQgSGF2b2MgMSc6ICcyN0U1JyxcclxuICAgICdCeWFFeCBIdW5kZXJmb2xkIEhhdm9jIDInOiAnMjdFNicsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnQnlhRXggU3dlZXAgVGhlIExlZyc6ICcyN0RCJyxcclxuICAgICdCeWFFeCBGaXJlIGFuZCBMaWdodG5pbmcnOiAnMjdERScsXHJcbiAgICAnQnlhRXggRGlzdGFudCBDbGFwJzogJzI3REQnLFxyXG4gICAgLy8gTWlkcGhhc2UgbGluZSBhdHRhY2tcclxuICAgICdCeWFFeCBJbXBlcmlhbCBHdWFyZCc6ICcyN0YxJyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIFBpbmsgYnViYmxlIGNvbGxpc2lvblxyXG4gICAgICBpZDogJ0J5YUV4IE9taW5vdXMgV2luZCcsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnMjdFQycsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUsIGRhdGEpID0+IGRhdGEuSXNQbGF5ZXJJZChlLnRhcmdldElkKSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ3dhcm4nLFxyXG4gICAgICAgICAgYmxhbWU6IGUudGFyZ2V0TmFtZSxcclxuICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgZW46ICdidWJibGUgY29sbGlzaW9uJyxcclxuICAgICAgICAgICAgZGU6ICdCbGFzZW4gc2luZCB6dXNhbW1lbmdlc3Rvw59lbicsXHJcbiAgICAgICAgICAgIGZyOiAnY29sbGlzaW9uIGRlIGJ1bGxlcycsXHJcbiAgICAgICAgICAgIGphOiAn6KGd56qBJyxcclxuICAgICAgICAgICAgY246ICfnm7jmkp4nLFxyXG4gICAgICAgICAgICBrbzogJ+yepe2MkCDqsrnss5DshJwg7YSw7KeQJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFNoaW5yeXUgTm9ybWFsXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlUm95YWxNZW5hZ2VyaWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1NoaW5yeXUgQWtoIFJoYWknOiAnMUZBNicsIC8vIFNreSBsYXNlcnMgYWxvbmdzaWRlIEFraCBNb3JuLlxyXG4gICAgJ1NoaW5yeXUgQmxhemluZyBUcmFpbCc6ICcyMjFBJywgLy8gUmVjdGFuZ2xlIEFvRXMsIGludGVybWlzc2lvbiBhZGRzLlxyXG4gICAgJ1NoaW5yeXUgQ29sbGFwc2UnOiAnMjIxOCcsIC8vIENpcmNsZSBBb0VzLCBpbnRlcm1pc3Npb24gYWRkc1xyXG4gICAgJ1NoaW5yeXUgRHJhZ29uZmlzdCc6ICcyNEYwJywgLy8gR2lhbnQgcHVuY2h5IGNpcmNsZSBpbiB0aGUgY2VudGVyLlxyXG4gICAgJ1NoaW5yeXUgRWFydGggQnJlYXRoJzogJzFGOUQnLCAvLyBDb25hbCBhdHRhY2tzIHRoYXQgYXJlbid0IGFjdHVhbGx5IEVhcnRoIFNoYWtlcnMuXHJcbiAgICAnU2hpbnJ5dSBHeXJlIENoYXJnZSc6ICcxRkE4JywgLy8gR3JlZW4gZGl2ZSBib21iIGF0dGFjay5cclxuICAgICdTaGlucnl1IFNwaWtlc2ljbGUnOiAnMUZBYCcsIC8vIEJsdWUtZ3JlZW4gbGluZSBhdHRhY2tzIGZyb20gYmVoaW5kLlxyXG4gICAgJ1NoaW5yeXUgVGFpbCBTbGFwJzogJzFGOTMnLCAvLyBSZWQgc3F1YXJlcyBpbmRpY2F0aW5nIHRoZSB0YWlsJ3MgbGFuZGluZyBzcG90cy5cclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1NoaW5yeXUgTGV2aW5ib2x0JzogJzFGOUMnLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gSWN5IGZsb29yIGF0dGFjay5cclxuICAgICAgaWQ6ICdTaGlucnl1IERpYW1vbmQgRHVzdCcsXHJcbiAgICAgIC8vIFRoaW4gSWNlXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICczOEYnIH0pLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ1NsaWQgb2ZmIScsXHJcbiAgICAgICAgICAgIGRlOiAnUnVudGVyIGdlcnV0c2NodCEnLFxyXG4gICAgICAgICAgICBmcjogJ0EgZ2xpc3PDqShlKSAhJyxcclxuICAgICAgICAgICAgamE6ICfmu5HjgaPjgZ8nLFxyXG4gICAgICAgICAgICBjbjogJ+a7keiQvScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1NoaW5yeXUgVGlkYWwgV2F2ZScsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnMUY4QicsXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBlLnRhcmdldE5hbWUsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdQdXNoZWQgb2ZmIScsXHJcbiAgICAgICAgICAgIGRlOiAnUnVudGVyIGdlc2NodWJzdCEnLFxyXG4gICAgICAgICAgICBmcjogJ0Egw6l0w6kgcG91c3PDqShlKSAhJyxcclxuICAgICAgICAgICAgamE6ICfokL3jgaHjgZ8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBLbm9ja2JhY2sgZnJvbSBjZW50ZXIuXHJcbiAgICAgIGlkOiAnU2hpbnJ5dSBBZXJpYWwgQmxhc3QnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzFGOTAnLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogZS50YXJnZXROYW1lLFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnUHVzaGVkIG9mZiEnLFxyXG4gICAgICAgICAgICBkZTogJ1J1bnRlciBnZXNjaHVic3QhJyxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIHBvdXNzZXIgIScsXHJcbiAgICAgICAgICAgIGphOiAn6JC944Gh44GfJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG5cclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBTdXNhbm8gRXh0cmVtZVxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlUG9vbE9mVHJpYnV0ZUV4dHJlbWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1N1c0V4IENodXJuaW5nJzogJzIwM0YnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ1N1c0V4IFJhc2VuIEthaWt5byc6ICcyMDJFJyxcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVWx0aW1hIFdlYXBvbiBVbHRpbWF0ZVxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlV2VhcG9uc1JlZnJhaW5VbHRpbWF0ZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnVVdVIFNlYXJpbmcgV2luZCc6ICcyQjVDJyxcclxuICAgICdVV1UgRXJ1cHRpb24nOiAnMkI1QScsXHJcbiAgICAnVVdVIFdlaWdodCc6ICcyQjY1JyxcclxuICAgICdVV1UgTGFuZHNsaWRlMSc6ICcyQjcwJyxcclxuICAgICdVV1UgTGFuZHNsaWRlMic6ICcyQjcxJyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdVV1UgR3JlYXQgV2hpcmx3aW5kJzogJzJCNDEnLFxyXG4gICAgJ1VXVSBTbGlwc3RyZWFtJzogJzJCNTMnLFxyXG4gICAgJ1VXVSBXaWNrZWQgV2hlZWwnOiAnMkI0RScsXHJcbiAgICAnVVdVIFdpY2tlZCBUb3JuYWRvJzogJzJCNEYnLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdVV1UgV2luZGJ1cm4nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnRUInIH0pLFxyXG4gICAgICBzdXBwcmVzc1NlY29uZHM6IDIsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogZS50YXJnZXQsIHRleHQ6IGUuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBGZWF0aGVybGFuY2UgZXhwbG9zaW9uLiAgSXQgc2VlbXMgbGlrZSB0aGUgcGVyc29uIHdobyBwb3BzIGl0IGlzIHRoZVxyXG4gICAgICAvLyBmaXJzdCBwZXJzb24gbGlzdGVkIGRhbWFnZS13aXNlLCBzbyB0aGV5IGFyZSBsaWtlbHkgdGhlIGN1bHByaXQuXHJcbiAgICAgIGlkOiAnVVdVIEZlYXRoZXJsYW5jZScsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnMkI0MycsXHJcbiAgICAgIGNvbGxlY3RTZWNvbmRzOiAwLjUsXHJcbiAgICAgIHN1cHByZXNzU2Vjb25kczogNSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBlWzBdLnRhcmdldE5hbWUsIHRleHQ6IGVbMF0uYXR0YWNrZXJOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBVQ1UgLSBUaGUgVW5lbmRpbmcgQ29pbCBPZiBCYWhhbXV0IChVbHRpbWF0ZSlcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZVVuZW5kaW5nQ29pbE9mQmFoYW11dFVsdGltYXRlLFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdVQ1UgTHVuYXIgRHluYW1vJzogJzI2QkMnLFxyXG4gICAgJ1VDVSBJcm9uIENoYXJpb3QnOiAnMjZCQicsXHJcbiAgICAnVUNVIEV4YWZsYXJlJzogJzI2RUYnLFxyXG4gICAgJ1VDVSBXaW5ncyBPZiBTYWx2YXRpb24nOiAnMjZDQScsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ1VDVSBUd2lzdGVyIERlYXRoJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICcyNkFCJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSwgZGF0YSkgPT4ge1xyXG4gICAgICAgIC8vIEluc3RhbnQgZGVhdGggdXNlcyAnMzYnIGFzIGl0cyBmbGFncywgZGlmZmVyZW50aWF0aW5nXHJcbiAgICAgICAgLy8gZnJvbSB0aGUgZXhwbG9zaW9uIGRhbWFnZSB5b3UgdGFrZSB3aGVuIHNvbWVib2R5IGVsc2VcclxuICAgICAgICAvLyBwb3BzIG9uZS5cclxuICAgICAgICByZXR1cm4gZGF0YS5Jc1BsYXllcklkKGUudGFyZ2V0SWQpICYmIGUuZmxhZ3MgPT09ICczNic7XHJcbiAgICAgIH0sXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIGJsYW1lOiBlLnRhcmdldE5hbWUsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnVHdpc3RlciBQb3AnLFxyXG4gICAgICAgICAgICBkZTogJ1dpcmJlbHN0dXJtIGJlcsO8aHJ0JyxcclxuICAgICAgICAgICAgZnI6ICdBcHBhcml0aW9uIGRlcyB0b3JuYWRlcycsXHJcbiAgICAgICAgICAgIGphOiAn44OE44Kk44K544K/44O8JyxcclxuICAgICAgICAgICAgY246ICfml4vpo44nLFxyXG4gICAgICAgICAgICBrbzogJ+2ajOyYpOumrCDrsJ/snYwnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdVQ1UgVGhlcm1pb25pYyBCdXJzdCcsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnMjZCOScsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUsIGRhdGEpID0+IGRhdGEuSXNQbGF5ZXJJZChlLnRhcmdldElkKSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgYmxhbWU6IGUudGFyZ2V0TmFtZSxcclxuICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgZW46ICdQaXp6YSBTbGljZScsXHJcbiAgICAgICAgICAgIGRlOiAnUGl6emFzdMO8Y2snLFxyXG4gICAgICAgICAgICBmcjogJ1BhcnRzIGRlIHBpenphJyxcclxuICAgICAgICAgICAgamE6ICfjgrXjg7zjg5/jgqrjg4vjg4Pjgq/jg5Djg7zjgrnjg4gnLFxyXG4gICAgICAgICAgICBjbjogJ+WkqeW0qeWcsOijgicsXHJcbiAgICAgICAgICAgIGtvOiAn7J6l7YyQ7JeQIOunnuydjCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1VDVSBDaGFpbiBMaWdodG5pbmcnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzI2QzgnLFxyXG4gICAgICBjb25kaXRpb246IChlLCBkYXRhKSA9PiBkYXRhLklzUGxheWVySWQoZS50YXJnZXRJZCksXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgLy8gSXQncyBoYXJkIHRvIGFzc2lnbiBibGFtZSBmb3IgbGlnaHRuaW5nLiAgVGhlIGRlYnVmZnNcclxuICAgICAgICAvLyBnbyBvdXQgYW5kIHRoZW4gZXhwbG9kZSBpbiBvcmRlciwgYnV0IHRoZSBhdHRhY2tlciBpc1xyXG4gICAgICAgIC8vIHRoZSBkcmFnb24gYW5kIG5vdCB0aGUgcGxheWVyLlxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnd2FybicsXHJcbiAgICAgICAgICBuYW1lOiBlLnRhcmdldE5hbWUsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnaGl0IGJ5IGxpZ2h0bmluZycsXHJcbiAgICAgICAgICAgIGRlOiAndm9tIEJsaXR6IGdldHJvZmZlbicsXHJcbiAgICAgICAgICAgIGZyOiAnZnJhcHDDqShlKSBwYXIgbGEgZm91ZHJlJyxcclxuICAgICAgICAgICAgamE6ICfjg4HjgqfjgqTjg7Pjg6njgqTjg4jjg4vjg7PjgrAnLFxyXG4gICAgICAgICAgICBjbjogJ+mbt+WFiemTvicsXHJcbiAgICAgICAgICAgIGtvOiAn67KI6rCcIOunnuydjCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1VDVSBCdXJucycsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICdGQScgfSksXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogZS50YXJnZXQsIHRleHQ6IGUuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1VDVSBTbHVkZ2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMTFGJyB9KSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBlLnRhcmdldCwgdGV4dDogZS5lZmZlY3QgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVUNVIERvb20gR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICdEMicgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNEb29tID0gZGF0YS5oYXNEb29tIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzRG9vbVttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdVQ1UgRG9vbSBMb3NlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMubG9zZXNFZmZlY3QoeyBlZmZlY3RJZDogJ0QyJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc0Rvb20gPSBkYXRhLmhhc0Rvb20gfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNEb29tW21hdGNoZXMudGFyZ2V0XSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gVGhlcmUgaXMgbm8gY2FsbG91dCBmb3IgXCJ5b3UgZm9yZ290IHRvIGNsZWFyIGRvb21cIi4gIFRoZSBsb2dzIGxvb2tcclxuICAgICAgLy8gc29tZXRoaW5nIGxpa2UgdGhpczpcclxuICAgICAgLy8gICBbMjA6MDI6MzAuNTY0XSAxQTpPa29ub21pIFlha2kgZ2FpbnMgdGhlIGVmZmVjdCBvZiBEb29tIGZyb20gIGZvciA2LjAwIFNlY29uZHMuXHJcbiAgICAgIC8vICAgWzIwOjAyOjM2LjQ0M10gMUU6T2tvbm9taSBZYWtpIGxvc2VzIHRoZSBlZmZlY3Qgb2YgUHJvdGVjdCBmcm9tIFRha28gWWFraS5cclxuICAgICAgLy8gICBbMjA6MDI6MzYuNDQzXSAxRTpPa29ub21pIFlha2kgbG9zZXMgdGhlIGVmZmVjdCBvZiBEb29tIGZyb20gLlxyXG4gICAgICAvLyAgIFsyMDowMjozOC41MjVdIDE5Ok9rb25vbWkgWWFraSB3YXMgZGVmZWF0ZWQgYnkgRmlyZWhvcm4uXHJcbiAgICAgIC8vIEluIG90aGVyIHdvcmRzLCBkb29tIGVmZmVjdCBpcyByZW1vdmVkICsvLSBuZXR3b3JrIGxhdGVuY3ksIGJ1dCBjYW4ndFxyXG4gICAgICAvLyB0ZWxsIHVudGlsIGxhdGVyIHRoYXQgaXQgd2FzIGEgZGVhdGguICBBcmd1YWJseSwgdGhpcyBjb3VsZCBoYXZlIGJlZW4gYVxyXG4gICAgICAvLyBjbG9zZS1idXQtc3VjY2Vzc2Z1bCBjbGVhcmluZyBvZiBkb29tIGFzIHdlbGwuICBJdCBsb29rcyB0aGUgc2FtZS5cclxuICAgICAgLy8gU3RyYXRlZ3k6IGlmIHlvdSBoYXZlbid0IGNsZWFyZWQgZG9vbSB3aXRoIDEgc2Vjb25kIHRvIGdvIHRoZW4geW91IHByb2JhYmx5XHJcbiAgICAgIC8vIGRpZWQgdG8gZG9vbS4gIFlvdSBjYW4gZ2V0IG5vbi1mYXRhbGx5IGljZWJhbGxlZCBvciBhdXRvJ2QgaW4gYmV0d2VlbixcclxuICAgICAgLy8gYnV0IHdoYXQgY2FuIHlvdSBkby5cclxuICAgICAgaWQ6ICdVQ1UgRG9vbSBEZWF0aCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICdEMicgfSksXHJcbiAgICAgIGRlbGF5U2Vjb25kczogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4gcGFyc2VGbG9hdChtYXRjaGVzLmR1cmF0aW9uKSAtIDEsXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGlmICghZGF0YS5oYXNEb29tIHx8ICFkYXRhLmhhc0Rvb21bbWF0Y2hlcy50YXJnZXRdKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGxldCByZWFzb247XHJcbiAgICAgICAgaWYgKGUuZHVyYXRpb25TZWNvbmRzIDwgOSlcclxuICAgICAgICAgIHJlYXNvbiA9IG1hdGNoZXMuZWZmZWN0ICsgJyAjMSc7XHJcbiAgICAgICAgZWxzZSBpZiAoZS5kdXJhdGlvblNlY29uZHMgPCAxNClcclxuICAgICAgICAgIHJlYXNvbiA9IG1hdGNoZXMuZWZmZWN0ICsgJyAjMic7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmVhc29uID0gbWF0Y2hlcy5lZmZlY3QgKyAnICMzJztcclxuICAgICAgICByZXR1cm4geyBuYW1lOiBtYXRjaGVzLnRhcmdldCwgcmVhc29uOiByZWFzb24gfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUaGUgQ29waWVkIEZhY3RvcnlcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUNvcGllZEZhY3RvcnksXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0NvcGllZCBTZXJpYWwgRW5lcmd5IEJvbWInOiAnNDhCNCcsXHJcbiAgICAvLyBNYWtlIHN1cmUgZW5lbWllcyBhcmUgaWdub3JlZCBvbiB0aGVzZVxyXG4gICAgJ0NvcGllZCBTZXJpYWwgRW5lcmd5IEJvbWJhcmRtZW50JzogJzQ4QjgnLFxyXG4gICAgJ0NvcGllZCBTZXJpYWwgRW5lcmd5IEFzc2F1bHQnOiAnNDhCNicsXHJcbiAgICAnQ29waWVkIFNlcmlhbCBIaWdoLVBvd2VyZWQgTGFzZXInOiAnNDhDNScsXHJcbiAgICAnQ29waWVkIFNlcmlhbCBTaWRlc3RyaWtpbmcgU3BpbiBTcGluIDEnOiAnNDhDQicsXHJcbiAgICAnQ29waWVkIFNlcmlhbCBTaWRlc3RyaWtpbmcgU3BpbiAyJzogJzQ4Q0MnLFxyXG4gICAgJ0NvcGllZCBTZXJpYWwgQ2VudHJpZnVnYWwgU3Bpbic6ICc0OEM5JyxcclxuICAgICdDb3BpZWQgU2VyaWFsIEFpci1Uby1TdXJmYWNlIEVuZXJneSc6ICc0OEJBJyxcclxuICAgICdDb3BpZWQgU2VyaWFsIEhpZ2gtQ2FsaWJlciBMYXNlcic6ICc0OEZBJyxcclxuICAgICdDb3BpZWQgU2VyaWFsIEVuZXJneSBSaW5nIDEnOiAnNDhCQycsXHJcbiAgICAnQ29waWVkIFNlcmlhbCBFbmVyZ3kgUmluZyAyJzogJzQ4QkQnLFxyXG4gICAgJ0NvcGllZCBTZXJpYWwgRW5lcmd5IFJpbmcgMyc6ICc0OEJFJyxcclxuICAgICdDb3BpZWQgU2VyaWFsIEVuZXJneSBSaW5nIDQnOiAnNDhDMCcsXHJcbiAgICAnQ29waWVkIFNlcmlhbCBFbmVyZ3kgUmluZyA1JzogJzQ4QzEnLFxyXG4gICAgJ0NvcGllZCBTZXJpYWwgRW5lcmd5IFJpbmcgNic6ICc0OEMyJyxcclxuXHJcbiAgICAnQ29waWVkIFRyYXNoIEVuZXJneSBCb21iJzogJzQ5MUQnLFxyXG4gICAgJ0NvcGllZCBUcmFzaCBGcm9udGFsIFNvbWVyc2F1bHQnOiAnNDkxQicsXHJcbiAgICAnQ29waWVkIFRyYXNoIEhpZ2gtRnJlcXVlbmN5IExhc2VyJzogJzQ5MUUnLFxyXG5cclxuICAgICdDb3BpZWQgSG9iYmVzIFNob2NraW5nIERpc2NoYXJnZSc6ICc0ODBCJyxcclxuICAgICdDb3BpZWQgSG9iYmVzIFZhcmlhYmxlIENvbWJhdCBUZXN0IDEnOiAnNDlDNScsXHJcbiAgICAnQ29waWVkIEhvYmJlcyBWYXJpYWJsZSBDb21iYXQgVGVzdCAyJzogJzQ5QzYnLFxyXG4gICAgJ0NvcGllZCBIb2JiZXMgVmFyaWFibGUgQ29tYmF0IFRlc3QgMyc6ICc0OUM3JyxcclxuICAgICdDb3BpZWQgSG9iYmVzIFZhcmlhYmxlIENvbWJhdCBUZXN0IDQnOiAnNDgwRicsXHJcbiAgICAnQ29waWVkIEhvYmJlcyBWYXJpYWJsZSBDb21iYXQgVGVzdCA1JzogJzQ4MTAnLFxyXG4gICAgJ0NvcGllZCBIb2JiZXMgVmFyaWFibGUgQ29tYmF0IFRlc3QgNic6ICc0ODExJyxcclxuXHJcbiAgICAnQ29waWVkIEhvYmJlcyBSaW5nIExhc2VyIDEnOiAnNDgwMicsXHJcbiAgICAnQ29waWVkIEhvYmJlcyBSaW5nIExhc2VyIDInOiAnNDgwMycsXHJcbiAgICAnQ29waWVkIEhvYmJlcyBSaW5nIExhc2VyIDMnOiAnNDgwNCcsXHJcblxyXG4gICAgJ0NvcGllZCBIb2JiZXMgVG93ZXJmYWxsJzogJzQ4MTMnLFxyXG5cclxuICAgICdDb3BpZWQgSG9iYmVzIEZpcmUtUmVpc3RhbmNlIFRlc3QgMSc6ICc0ODE2JyxcclxuICAgICdDb3BpZWQgSG9iYmVzIEZpcmUtUmVpc3RhbmNlIFRlc3QgMic6ICc0ODE3JyxcclxuICAgICdDb3BpZWQgSG9iYmVzIEZpcmUtUmVpc3RhbmNlIFRlc3QgMyc6ICc0ODE4JyxcclxuXHJcbiAgICAnQ29waWVkIEhvYmJlcyBPaWwgV2VsbCc6ICc0ODFCJyxcclxuICAgICdDb3BpZWQgSG9iYmVzIEVsZWN0cm9tYWduZXRpYyBQdWxzZSc6ICc0ODE5JyxcclxuICAgIC8vIFRPRE86IHdoYXQncyB0aGUgZWxlY3RyaWZpZWQgZmxvb3Igd2l0aCBjb252ZXlvciBiZWx0cz9cclxuXHJcbiAgICAnQ29waWVkIEdvbGlhdGggRW5lcmd5IFJpbmcgMSc6ICc0OTM3JyxcclxuICAgICdDb3BpZWQgR29saWF0aCBFbmVyZ3kgUmluZyAyJzogJzQ5MzgnLFxyXG4gICAgJ0NvcGllZCBHb2xpYXRoIEVuZXJneSBSaW5nIDMnOiAnNDkzOScsXHJcbiAgICAnQ29waWVkIEdvbGlhdGggRW5lcmd5IFJpbmcgNCc6ICc0OTNBJyxcclxuICAgICdDb3BpZWQgR29saWF0aCBFbmVyZ3kgUmluZyA1JzogJzQ5MzcnLFxyXG4gICAgJ0NvcGllZCBHb2xpYXRoIExhc2VyIFR1cnJldCc6ICc0OEU2JyxcclxuXHJcbiAgICAnQ29waWVkIEZsaWdodCBVbml0IEFyZWEgQm9tYmluZyc6ICc0OTQzJyxcclxuICAgICdDb3BpZWQgRmxpZ2h0IFVuaXQgTGlnaHRmYXN0IEJsYWRlJzogJzQ5NDAnLFxyXG5cclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggMSc6ICc0NzI5JyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggMic6ICc0NzI4JyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggMyc6ICc0NzJGJyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggNCc6ICc0NzMxJyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggNSc6ICc0NzJCJyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggNic6ICc0NzJEJyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggNyc6ICc0NzMyJyxcclxuXHJcbiAgICAnQ29waWVkIEVuZ2VscyBJbmNlbmRpYXJ5IEJvbWJpbmcnOiAnNDczOScsXHJcbiAgICAnQ29waWVkIEVuZ2VscyBHdWlkZWQgTWlzc2lsZSc6ICc0NzM2JyxcclxuICAgICdDb3BpZWQgRW5nZWxzIFN1cmZhY2UgTWlzc2lsZSc6ICc0NzM0JyxcclxuICAgICdDb3BpZWQgRW5nZWxzIExhc2VyIFNpZ2h0JzogJzQ3M0InLFxyXG4gICAgJ0NvcGllZCBFbmdlbHMgRnJhY2snOiAnNDc0RCcsXHJcblxyXG4gICAgJ0NvcGllZCBFbmdlbHMgTWFyeCBDcnVzaCc6ICc0OEZDJyxcclxuICAgICdDb3BpZWQgRW5nZWxzIENydXNoaW5nIFdoZWVsJzogJzQ3NEInLFxyXG4gICAgJ0NvcGllZCBFbmdlbHMgTWFyeCBUaHJ1c3QnOiAnNDhGQycsXHJcblxyXG4gICAgJ0NvcGllZCA5UyBMYXNlciBTdXBwcmVzc2lvbic6ICc0OEUwJywgLy8gQ2Fubm9uc1xyXG4gICAgJ0NvcGllZCA5UyBCYWxsaXN0aWMgSW1wYWN0IDEnOiAnNDk3NCcsXHJcbiAgICAnQ29waWVkIDlTIEJhbGxpc3RpYyBJbXBhY3QgMic6ICc0OERDJyxcclxuICAgICdDb3BpZWQgOVMgQmFsbGlzdGljIEltcGFjdCAzJzogJzQ4RTQnLFxyXG4gICAgJ0NvcGllZCA5UyBCYWxsaXN0aWMgSW1wYWN0IDQnOiAnNDhFMCcsXHJcblxyXG4gICAgJ0NvcGllZCA5UyBNYXJ4IEltcGFjdCc6ICc0OEQ0JyxcclxuXHJcbiAgICAnQ29waWVkIDlTIFRhbmsgRGVzdHJ1Y3Rpb24gMSc6ICc0OEU4JyxcclxuICAgICdDb3BpZWQgOVMgVGFuayBEZXN0cnVjdGlvbiAyJzogJzQ4RTknLFxyXG5cclxuICAgICdDb3BpZWQgOVMgU2VyaWFsIFNwaW4gMSc6ICc0OEE1JyxcclxuICAgICdDb3BpZWQgOVMgU2VyaWFsIFNwaW4gMic6ICc0OEE3JyxcclxuXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdDb3BpZWQgSG9iYmVzIFNob3J0LVJhbmdlIE1pc3NpbGUnOiAnNDgxNScsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiA1MDkzIHRha2luZyBIaWdoLVBvd2VyZWQgTGFzZXIgd2l0aCBhIHZ1bG4gKGJlY2F1c2Ugb2YgdGFraW5nIHR3bylcclxuLy8gVE9ETzogNEZCNSB0YWtpbmcgSGlnaC1Qb3dlcmVkIExhc2VyIHdpdGggYSB2dWxuIChiZWNhdXNlIG9mIHRha2luZyB0d28pXHJcbi8vIFRPRE86IDUwRDMgQWVyaWFsIFN1cHBvcnQ6IEJvbWJhcmRtZW50IGdvaW5nIG9mZiBmcm9tIGFkZFxyXG4vLyBUT0RPOiA1MjExIE1hbmV1dmVyOiBWb2x0IEFycmF5IG5vdCBnZXR0aW5nIGludGVycnVwdGVkXHJcbi8vIFRPRE86IDRGRjQvNEZGNSBPbmUgb2YgdGhlc2UgaXMgZmFpbGluZyBjaGVtaWNhbCBjb25mbGFncmF0aW9uXHJcbi8vIFRPRE86IHN0YW5kaW5nIGluIHdyb25nIHRlbGVwb3J0ZXI/PyBtYXliZSA1MzYzP1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZVB1cHBldHNCdW5rZXIsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1B1cHBldCBBZWdpcyBCZWFtIENhbm5vbnMgMSc6ICc1MDc0JywgLy8gcm90YXRpbmcgc2VwYXJhdGluZyB3aGl0ZSBncm91bmQgYW9lXHJcbiAgICAnUHVwcGV0IEFlZ2lzIEJlYW0gQ2Fubm9ucyAyJzogJzUwNzUnLCAvLyByb3RhdGluZyBzZXBhcmF0aW5nIHdoaXRlIGdyb3VuZCBhb2VcclxuICAgICdQdXBwZXQgQWVnaXMgQmVhbSBDYW5ub25zIDMnOiAnNTA3NicsIC8vIHJvdGF0aW5nIHNlcGFyYXRpbmcgd2hpdGUgZ3JvdW5kIGFvZVxyXG4gICAgJ1B1cHBldCBBZWdpcyBDb2xsaWRlciBDYW5ub25zJzogJzUwN0UnLCAvLyByb3RhdGluZyByZWQgZ3JvdW5kIGFvZSBwaW53aGVlbFxyXG4gICAgJ1B1cHBldCBBZWdpcyBTdXJmYWNlIExhc2VyIDEnOiAnNTA5MScsIC8vIGNoYXNpbmcgbGFzZXIgaW5pdGlhbFxyXG4gICAgJ1B1cHBldCBBZWdpcyBTdXJmYWNlIExhc2VyIDInOiAnNTA5MicsIC8vIGNoYXNpbmcgbGFzZXIgY2hhc2luZ1xyXG4gICAgJ1B1cHBldCBBZWdpcyBGbGlnaHQgUGF0aCc6ICc1MDhDJywgLy8gYmx1ZSBsaW5lIGFvZSBmcm9tIGZseWluZyB1bnRhcmdldGFibGUgYWRkc1xyXG4gICAgJ1B1cHBldCBBZWdpcyBSZWZyYWN0aW9uIENhbm5vbnMgMSc6ICc1MDgxJywgLy8gcmVmcmFjdGlvbiBjYW5ub25zIGJldHdlZW4gd2luZ3NcclxuICAgICdQdXBwZXQgQWVnaXMgTGlmZVxcJ3MgTGFzdCBTb25nJzogJzUzQjMnLCAvLyByaW5nIGFvZSB3aXRoIGdhcFxyXG4gICAgJ1B1cHBldCBMaWdodCBMb25nLUJhcnJlbGVkIExhc2VyJzogJzUyMTInLCAvLyBsaW5lIGFvZSBmcm9tIGFkZFxyXG4gICAgJ1B1cHBldCBMaWdodCBTdXJmYWNlIE1pc3NpbGUgSW1wYWN0JzogJzUyMEYnLCAvLyB1bnRhcmdldGVkIGdyb3VuZCBhb2UgZnJvbSBObyBSZXN0cmljdGlvbnNcclxuICAgICdQdXBwZXQgU3VwZXJpb3IgSW5jZW5kaWFyeSBCb21iaW5nJzogJzRGQjknLCAvLyBmaXJlIHB1ZGRsZSBpbml0aWFsXHJcbiAgICAnUHVwcGV0IFN1cGVyaW9yIFNoYXJwIFR1cm4nOiAnNTA2RCcsIC8vIHNoYXJwIHR1cm4gZGFzaFxyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBTdGFuZGFyZCBTdXJmYWNlIE1pc3NpbGUgMSc6ICc0RkIxJywgLy8gTGV0aGFsIFJldm9sdXRpb24gY2lyY2xlc1xyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBTdGFuZGFyZCBTdXJmYWNlIE1pc3NpbGUgMic6ICc0RkIyJywgLy8gTGV0aGFsIFJldm9sdXRpb24gY2lyY2xlc1xyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBTdGFuZGFyZCBTdXJmYWNlIE1pc3NpbGUgMyc6ICc0RkIzJywgLy8gTGV0aGFsIFJldm9sdXRpb24gY2lyY2xlc1xyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBTbGlkaW5nIFN3aXBlIDEnOiAnNTA2RicsIC8vIHJpZ2h0LWhhbmRlZCBzbGlkaW5nIHN3aXBlXHJcbiAgICAnUHVwcGV0IFN1cGVyaW9yIFNsaWRpbmcgU3dpcGUgMic6ICc1MDcwJywgLy8gbGVmdC1oYW5kZWQgc2xpZGluZyBzd2lwZVxyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBHdWlkZWQgTWlzc2lsZSc6ICc0RkI4JywgLy8gZ3JvdW5kIGFvZSBkdXJpbmcgQXJlYSBCb21iYXJkbWVudFxyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBIaWdoLU9yZGVyIEV4cGxvc2l2ZSBCbGFzdCAxJzogJzRGQzAnLCAvLyBzdGFyIGFvZVxyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBIaWdoLU9yZGVyIEV4cGxvc2l2ZSBCbGFzdCAyJzogJzRGQzEnLCAvLyBzdGFyIGFvZVxyXG4gICAgJ1B1cHBldCBIZWF2eSBFbmVyZ3kgQm9tYmFyZG1lbnQnOiAnNEZGQycsIC8vIGNvbG9yZWQgbWFnaWMgaGFtbWVyLXkgZ3JvdW5kIGFvZVxyXG4gICAgJ1B1cHBldCBIZWF2eSBSZXZvbHZpbmcgTGFzZXInOiAnNTAwMCcsIC8vIGdldCB1bmRlciBsYXNlclxyXG4gICAgJ1B1cHBldCBIZWF2eSBFbmVyZ3kgQm9tYic6ICc0RkZBJywgLy8gZ2V0dGluZyBoaXQgYnkgYmFsbCBkdXJpbmcgQWN0aXZlIFN1cHByZXNzaXZlIFVuaXRcclxuICAgICdQdXBwZXQgSGVhdnkgUjAxMCBMYXNlcic6ICc0RkYwJywgLy8gbGFzZXIgcG9kXHJcbiAgICAnUHVwcGV0IEhlYXZ5IFIwMzAgSGFtbWVyJzogJzRGRjEnLCAvLyBjaXJjbGUgYW9lIHBvZFxyXG4gICAgJ1B1cHBldCBIYWxsd2F5IEhpZ2gtUG93ZXJlZCBMYXNlcic6ICc1MEIxJywgLy8gbG9uZyBhb2UgaW4gdGhlIGhhbGx3YXkgc2VjdGlvblxyXG4gICAgJ1B1cHBldCBIYWxsd2F5IEVuZXJneSBCb21iJzogJzUwQjInLCAvLyBydW5uaW5nIGludG8gYSBmbG9hdGluZyBvcmJcclxuICAgICdQdXBwZXQgQ29tcG91bmQgTWVjaGFuaWNhbCBEaXNzZWN0aW9uJzogJzUxQjMnLCAvLyBzcGlubmluZyB2ZXJ0aWNhbCBsYXNlclxyXG4gICAgJ1B1cHBldCBDb21wb3VuZCBNZWNoYW5pY2FsIERlY2FwaXRhdGlvbic6ICc1MUI0JywgLy8gZ2V0IHVuZGVyIGxhc2VyXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIE1lY2huaWNhbCBDb250dXNpb24gVW50YXJnZXRlZCc6ICc1MUI3JywgLy8gdW50YXJnZXRlZCBncm91bmQgYW9lXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFJlbGVudGxlc3MgU3BpcmFsIDEnOiAnNTFBQScsIC8vIHRyaXBsZSB1bnRhcmdldGVkIGdyb3VuZCBhb2VzXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFJlbGVudGxlc3MgU3BpcmFsIDInOiAnNTFDQicsIC8vIHRyaXBsZSB1bnRhcmdldGVkIGdyb3VuZCBhb2VzXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFByaW1lIEJsYWRlIE91dCAxJzogJzU0MUYnLCAvLyAyUCBwcmltZSBibGFkZSBnZXQgb3V0XHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFByaW1lIEJsYWRlIE91dCAyJzogJzUxOTgnLCAvLyAyUC9wdXBwZXQgdGVsZXBvcnRpbmcvcmVwcm9kdWNlIHByaW1lIGJsYWRlIGdldCBvdXRcclxuICAgICdQdXBwZXQgQ29tcG91bmQgMlAgUHJpbWUgQmxhZGUgQmVoaW5kIDEnOiAnNTQyMCcsIC8vIDJQIHByaW1lIGJsYWRlIGdldCBiZWhpbmRcclxuICAgICdQdXBwZXQgQ29tcG91bmQgMlAgUHJpbWUgQmxhZGUgQmVoaW5kIDInOiAnNTE5OScsIC8vIDJQIHRlbGVwb3J0aW5nIHByaW1lIGJsYWRlIGdldCBiZWhpbmRcclxuICAgICdQdXBwZXQgQ29tcG91bmQgMlAgUHJpbWUgQmxhZGUgSW4gMSc6ICc1NDIxJywgLy8gMlAgcHJpbWUgYmxhZGUgZ2V0IGluXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFByaW1lIEJsYWRlIEluIDInOiAnNTE5QScsIC8vIDJQL3B1cHBldCB0ZWxlcG9ydGluZy9yZXByb2R1Y2UgcHJpbWUgYmxhZGUgZ2V0IGluXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFIwMTIgTGFzZXIgR3JvdW5kJzogJzUxQUUnLCAvLyB1bnRhcmdldGVkIGdyb3VuZCBjaXJjbGVcclxuICAgIC8vIFRoaXMgaXMuLi4gdG9vIG5vaXN5LlxyXG4gICAgLy8gJ1B1cHBldCBDb21wb3VuZCAyUCBGb3VyIFBhcnRzIFJlc29sdmUgMSc6ICc1MUEwJywgLy8gZm91ciBwYXJ0cyByZXNvbHZlIGp1bXBcclxuICAgIC8vICdQdXBwZXQgQ29tcG91bmQgMlAgRm91ciBQYXJ0cyBSZXNvbHZlIDInOiAnNTE5RicsIC8vIGZvdXIgcGFydHMgcmVzb2x2ZSBjbGVhdmVcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdQdXBwZXQgSGVhdnkgVXBwZXIgTGFzZXIgMSc6ICc1MDg3JywgLy8gdXBwZXIgbGFzZXIgaW5pdGlhbFxyXG4gICAgJ1B1cHBldCBIZWF2eSBVcHBlciBMYXNlciAyJzogJzRGRjcnLCAvLyB1cHBlciBsYXNlciBjb250aW51b3VzXHJcbiAgICAnUHVwcGV0IEhlYXZ5IExvd2VyIExhc2VyIDEnOiAnNTA4NicsIC8vIGxvd2VyIGxhc2VyIGZpcnN0IHNlY3Rpb24gaW5pdGlhbFxyXG4gICAgJ1B1cHBldCBIZWF2eSBMb3dlciBMYXNlciAyJzogJzRGRjYnLCAvLyBsb3dlciBsYXNlciBmaXJzdCBzZWN0aW9uIGNvbnRpbnVvdXNcclxuICAgICdQdXBwZXQgSGVhdnkgTG93ZXIgTGFzZXIgMyc6ICc1MDg4JywgLy8gbG93ZXIgbGFzZXIgc2Vjb25kIHNlY3Rpb24gaW5pdGlhbFxyXG4gICAgJ1B1cHBldCBIZWF2eSBMb3dlciBMYXNlciA0JzogJzRGRjgnLCAvLyBsb3dlciBsYXNlciBzZWNvbmQgc2VjdGlvbiBjb250aW51b3VzXHJcbiAgICAnUHVwcGV0IEhlYXZ5IExvd2VyIExhc2VyIDUnOiAnNTA4OScsIC8vIGxvd2VyIGxhc2VyIHRoaXJkIHNlY3Rpb24gaW5pdGlhbFxyXG4gICAgJ1B1cHBldCBIZWF2eSBMb3dlciBMYXNlciA2JzogJzRGRjknLCAvLyBsb3dlciBsYXNlciB0aGlyZCBzZWN0aW9uIGNvbnRpbnVvdXNcclxuICAgICdQdXBwZXQgQ29tcG91bmQgSW5jb25ncnVvdXMgU3Bpbic6ICc1MUIyJywgLy8gZmluZCB0aGUgc2FmZSBzcG90IGRvdWJsZSBkYXNoXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgIC8vIFRoaXMgaXMgcHJldHR5IGxhcmdlIGFuZCBnZXR0aW5nIGhpdCBieSBpbml0aWFsIHdpdGhvdXQgYnVybnMgc2VlbXMgZmluZS5cclxuICAgIC8vICdQdXBwZXQgTGlnaHQgSG9taW5nIE1pc3NpbGUgSW1wYWN0JzogJzUyMTAnLCAvLyB0YXJnZXRlZCBmaXJlIGFvZSBmcm9tIE5vIFJlc3RyaWN0aW9uc1xyXG4gICAgJ1B1cHBldCBIZWF2eSBVbmNvbnZlbnRpb25hbCBWb2x0YWdlJzogJzUwMDQnLFxyXG4gICAgLy8gUHJldHR5IG5vaXN5LlxyXG4gICAgJ1B1cHBldCBNYW5ldXZlciBIaWdoLVBvd2VyZWQgTGFzZXInOiAnNTAwMicsIC8vIHRhbmsgbGFzZXJcclxuICAgICdQdXBwZXQgQ29tcG91bmQgTWVjaG5pY2FsIENvbnR1c2lvbiBUYXJnZXRlZCc6ICc1MUI2JywgLy8gdGFyZ2V0ZWQgc3ByZWFkIG1hcmtlclxyXG4gICAgJ1B1cHBldCBDb21wb3VuZCAyUCBSMDEyIExhc2VyIFRhbmsnOiAnNTFBRScsIC8vIHRhcmdldGVkIHNwcmVhZCBwb2QgbGFzZXIgb24gbm9uLXRhbmtcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgJ1B1cHBldCBBZWdpcyBBbnRpLVBlcnNvbm5lbCBMYXNlcic6ICc1MDkwJywgLy8gdGFuayBidXN0ZXIgbWFya2VyXHJcbiAgICAnUHVwcGV0IFN1cGVyaW9yIFByZWNpc2lvbi1HdWlkZWQgTWlzc2lsZSc6ICc0RkM1JyxcclxuICAgICdQdXBwZXQgQ29tcG91bmQgMlAgUjAxMiBMYXNlciBUYW5rJzogJzUxQUQnLCAvLyB0YXJnZXRlZCBwb2QgbGFzZXIgb24gdGFua1xyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnUHVwcGV0IEJ1cm5zJzogJzEwQicsIC8vIHN0YW5kaW5nIGluIG1hbnkgdmFyaW91cyBmaXJlIGFvZXNcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogbWlzc2luZyBTaG9jayBCbGFjayAyP1xyXG4vLyBUT0RPOiBXaGl0ZS9CbGFjayBEaXNzb25hbmNlIGRhbWFnZSBpcyBtYXliZSB3aGVuIGZsYWdzIGVuZCBpbiAwMz9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVUb3dlckF0UGFyYWRpZ21zQnJlYWNoLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdUb3dlciBLbmF2ZSBDb2xvc3NhbCBJbXBhY3QgQ2VudGVyIDEnOiAnNUVBNycsIC8vIENlbnRlciBhb2UgZnJvbSBLbmF2ZSBhbmQgY2xvbmVzXHJcbiAgICAnVG93ZXIgS25hdmUgQ29sb3NzYWwgSW1wYWN0IENlbnRlciAyJzogJzYwQzgnLCAvLyBDZW50ZXIgYW9lIGZyb20gS25hdmUgZHVyaW5nIGx1bmdlXHJcbiAgICAnVG93ZXIgS25hdmUgQ29sb3NzYWwgSW1wYWN0IFNpZGUgMSc6ICc1RUE1JywgLy8gU2lkZSBhb2VzIGZyb20gS25hdmUgYW5kIGNsb25lc1xyXG4gICAgJ1Rvd2VyIEtuYXZlIENvbG9zc2FsIEltcGFjdCBTaWRlIDInOiAnNUVBNicsIC8vIFNpZGUgYW9lcyBmcm9tIEtuYXZlIGFuZCBjbG9uZXNcclxuICAgICdUb3dlciBLbmF2ZSBDb2xvc3NhbCBJbXBhY3QgU2lkZSAzJzogJzYwQzYnLCAvLyBTaWRlIGFvZXMgZnJvbSBLbmF2ZSBkdXJpbmcgbHVuZ2VcclxuICAgICdUb3dlciBLbmF2ZSBDb2xvc3NhbCBJbXBhY3QgU2lkZSA0JzogJzYwQzcnLCAvLyBTaWRlIGFvZXMgZnJvbSBLbmF2ZSBkdXJpbmcgbHVuZ2VcclxuICAgICdUb3dlciBLbmF2ZSBCdXJzdCc6ICc1RUQ0JywgLy8gU3BoZXJvaWQgS25hdmlzaCBCdWxsZXRzIGNvbGxpc2lvblxyXG4gICAgJ1Rvd2VyIEtuYXZlIE1hZ2ljIEJhcnJhZ2UnOiAnNUVBQycsIC8vIFNwaGVyb2lkIGxpbmUgYW9lc1xyXG4gICAgJ1Rvd2VyIEhhbnNlbCBSZXBheSc6ICc1QzcwJywgLy8gU2hpZWxkIGRhbWFnZVxyXG4gICAgJ1Rvd2VyIEhhbnNlbCBFeHBsb3Npb24nOiAnNUM2NycsIC8vIEJlaW5nIGhpdCBieSBNYWdpYyBCdWxsZXQgZHVyaW5nIFBhc3NpbmcgTGFuY2VcclxuICAgICdUb3dlciBIYW5zZWwgSW1wYWN0JzogJzVDNUMnLCAvLyBCZWluZyBoaXQgYnkgTWFnaWNhbCBDb25mbHVlbmNlIGR1cmluZyBXYW5kZXJpbmcgVHJhaWxcclxuICAgICdUb3dlciBIYW5zZWwgQmxvb2R5IFN3ZWVwIDEnOiAnNUM2QycsIC8vIER1YWwgY2xlYXZlcyB3aXRob3V0IHRldGhlclxyXG4gICAgJ1Rvd2VyIEhhbnNlbCBCbG9vZHkgU3dlZXAgMic6ICc1QzZEJywgLy8gRHVhbCBjbGVhdmVzIHdpdGhvdXQgdGV0aGVyXHJcbiAgICAnVG93ZXIgSGFuc2VsIEJsb29keSBTd2VlcCAzJzogJzVDNkUnLCAvLyBEdWFsIGNsZWF2ZXMgd2l0aCB0ZXRoZXJcclxuICAgICdUb3dlciBIYW5zZWwgQmxvb2R5IFN3ZWVwIDQnOiAnNUM2RicsIC8vIER1YWwgY2xlYXZlcyB3aXRoIHRldGhlclxyXG4gICAgJ1Rvd2VyIEhhbnNlbCBQYXNzaW5nIExhbmNlJzogJzVDNjYnLCAvLyBUaGUgUGFzc2luZyBMYW5jZSBjaGFyZ2UgaXRzZWxmXHJcbiAgICAnVG93ZXIgSGFuc2VsIEJyZWF0aHRocm91Z2ggMSc6ICc1NUIzJywgLy8gaGFsZiByb29tIGNsZWF2ZSBkdXJpbmcgV2FuZGVyaW5nIFRyYWlsXHJcbiAgICAnVG93ZXIgSGFuc2VsIEJyZWF0aHRocm91Z2ggMic6ICc1QzVEJywgLy8gaGFsZiByb29tIGNsZWF2ZSBkdXJpbmcgV2FuZGVyaW5nIFRyYWlsXHJcbiAgICAnVG93ZXIgSGFuc2VsIEJyZWF0aHRocm91Z2ggMyc6ICc1QzVFJywgLy8gaGFsZiByb29tIGNsZWF2ZSBkdXJpbmcgV2FuZGVyaW5nIFRyYWlsXHJcbiAgICAnVG93ZXIgSGFuc2VsIEh1bmdyeSBMYW5jZSAxJzogJzVDNzEnLCAvLyAyeGxhcmdlIGNvbmFsIGNsZWF2ZSBkdXJpbmcgV2FuZGVyaW5nIFRyYWlsXHJcbiAgICAnVG93ZXIgSGFuc2VsIEh1bmdyeSBMYW5jZSAyJzogJzVDNzInLCAvLyAyeGxhcmdlIGNvbmFsIGNsZWF2ZSBkdXJpbmcgV2FuZGVyaW5nIFRyYWlsXHJcbiAgICAnVG93ZXIgRmxpZ2h0IFVuaXQgTGlnaHRmYXN0IEJsYWRlJzogJzVCRkUnLCAvLyBsYXJnZSByb29tIGNsZWF2ZVxyXG4gICAgJ1Rvd2VyIEZsaWdodCBVbml0IFN0YW5kYXJkIExhc2VyJzogJzVCRkYnLCAvLyB0cmFja2luZyBsYXNlclxyXG4gICAgJ1Rvd2VyIDJQIFdoaXJsaW5nIEFzc2F1bHQnOiAnNUJGQicsIC8vIGxpbmUgYW9lIGZyb20gMlAgY2xvbmVzXHJcbiAgICAnVG93ZXIgMlAgQmFsYW5jZWQgRWRnZSc6ICc1QkZBJywgLy8gY2lyY3VsYXIgYW9lIG9uIDJQIGNsb25lc1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgMSc6ICc2MDA2JywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgMic6ICc2MDA3JywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgMyc6ICc2MDA4JywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgNCc6ICc2MDA5JywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgNSc6ICc2MzEwJywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgNic6ICc2MzExJywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgNyc6ICc2MzEyJywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgOCc6ICc2MzEzJywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIFNob2NrIFdoaXRlIDEnOiAnNjAwRicsIC8vIHdoaXRlIHNob2Nrd2F2ZSBjaXJjbGUgbm90IGRyb3BwZWQgb24gYmxhY2tcclxuICAgICdUb3dlciBSZWQgR2lybCBTaG9jayBXaGl0ZSAyJzogJzYwMTAnLCAvLyB3aGl0ZSBzaG9ja3dhdmUgY2lyY2xlIG5vdCBkcm9wcGVkIG9uIGJsYWNrXHJcbiAgICAnVG93ZXIgUmVkIEdpcmwgU2hvY2sgQmxhY2sgMSc6ICc2MDExJywgLy8gYmxhY2sgc2hvY2t3YXZlIGNpcmNsZSBub3QgZHJvcHBlZCBvbiB3aGl0ZVxyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIFBvaW50IFdoaXRlIDEnOiAnNjAxRicsIC8vIGJlaW5nIGhpdCBieSBhIHdoaXRlIGxhc2VyXHJcbiAgICAnVG93ZXIgUmVkIEdpcmwgUG9pbnQgV2hpdGUgMic6ICc2MDIxJywgLy8gYmVpbmcgaGl0IGJ5IGEgd2hpdGUgbGFzZXJcclxuICAgICdUb3dlciBSZWQgR2lybCBQb2ludCBCbGFjayAxJzogJzYwMjAnLCAvLyBiZWluZyBoaXQgYnkgYSBibGFjayBsYXNlclxyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIFBvaW50IEJsYWNrIDInOiAnNjAyMicsIC8vIGJlaW5nIGhpdCBieSBhIGJsYWNrIGxhc2VyXHJcbiAgICAnVG93ZXIgUmVkIEdpcmwgV2lwZSBXaGl0ZSc6ICc2MDBDJywgLy8gbm90IGxpbmUgb2Ygc2lnaHRpbmcgdGhlIHdoaXRlIG1ldGVvclxyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIFdpcGUgQmxhY2snOiAnNjAwRCcsIC8vIG5vdCBsaW5lIG9mIHNpZ2h0aW5nIHRoZSBibGFjayBtZXRlb3JcclxuICAgICdUb3dlciBSZWQgR2lybCBEaWZmdXNlIEVuZXJneSc6ICc2MDU2JywgLy8gcm90YXRpbmcgY2xvbmUgYnViYmxlIGNsZWF2ZXNcclxuICAgICdUb3dlciBSZWQgR2lybCBQeWxvbiBCaWcgRXhwbG9zaW9uJzogJzYwMjcnLCAvLyBub3Qga2lsbGluZyBhIHB5bG9uIGR1cmluZyBoYWNraW5nIHBoYXNlXHJcbiAgICAnVG93ZXIgUmVkIEdpcmwgUHlsb24gRXhwbG9zaW9uJzogJzYwMjYnLCAvLyBweWxvbiBkdXJpbmcgQ2hpbGQncyBwbGF5XHJcbiAgICAnVG93ZXIgUGhpbG9zb3BoZXIgRGVwbG95IEFybWFtZW50cyBNaWRkbGUnOiAnNUMwMicsIC8vIG1pZGRsZSBsYXNlclxyXG4gICAgJ1Rvd2VyIFBoaWxvc29waGVyIERlcGxveSBBcm1hbWVudHMgU2lkZXMnOiAnNUMwNScsIC8vIHNpZGVzIGxhc2VyXHJcbiAgICAnVG93ZXIgUGhpbG9zb3BoZXIgRGVwbG95IEFybWFtZW50cyAzJzogJzYwNzgnLCAvLyBnb2VzIHdpdGggNUMwMVxyXG4gICAgJ1Rvd2VyIFBoaWxvc29waGVyIERlcGxveSBBcm1hbWVudHMgNCc6ICc2MDc5JywgLy8gZ29lcyB3aXRoIDVDMDRcclxuICAgICdUb3dlciBQaGlsb3NvcGhlciBFbmVyZ3kgQm9tYic6ICc1QzA1JywgLy8gcGluayBidWJibGVcclxuICAgICdUb3dlciBGYWxzZSBJZG9sIE1hZGUgTWFnaWMgUmlnaHQnOiAnNUJENycsIC8vIHJvdGF0aW5nIHdoZWVsIGdvaW5nIHJpZ2h0XHJcbiAgICAnVG93ZXIgRmFsc2UgSWRvbCBNYWRlIE1hZ2ljIExlZnQnOiAnNUJENicsIC8vIHJvdGF0aW5nIHdoZWVsIGdvaW5nIGxlZnRcclxuICAgICdUb3dlciBGYWxzZSBJZG9sIExpZ2h0ZXIgTm90ZSc6ICc1QkRBJywgLy8gbGlnaHRlciBub3RlIG1vdmluZyBhb2VzXHJcbiAgICAnVG93ZXIgRmFsc2UgSWRvbCBNYWdpY2FsIEludGVyZmVyZW5jZSc6ICc1QkQ1JywgLy8gbGFzZXJzIGR1cmluZyBSaHl0aG0gUmluZ3NcclxuICAgICdUb3dlciBGYWxzZSBJZG9sIFNjYXR0ZXJlZCBNYWdpYyc6ICc1QkRGJywgLy8gY2lyY2xlIGFvZXMgZnJvbSBTZWVkIE9mIE1hZ2ljXHJcbiAgICAnVG93ZXIgSGVyIEluZmxvcmVzY2VuY2UgVW5ldmVuIEZvdHRpbmcnOiAnNUJFMicsIC8vIGJ1aWxkaW5nIGZyb20gUmVjcmVhdGUgU3RydWN0dXJlXHJcbiAgICAnVG93ZXIgSGVyIEluZmxvcmVzY2VuY2UgQ3Jhc2gnOiAnNUJFNScsIC8vIHRyYWlucyBmcm9tIE1peGVkIFNpZ25hbHNcclxuICAgICdUb3dlciBIZXIgSW5mbG9yZXNjZW5jZSBIZWF2eSBBcm1zIDEnOiAnNUJFRCcsIC8vIGhlYXZ5IGFybXMgZnJvbnQvYmFjayBhdHRhY2tcclxuICAgICdUb3dlciBIZXIgSW5mbG9yZXNjZW5jZSBIZWF2eSBBcm1zIDInOiAnNUJFRicsIC8vIGhlYXZ5IGFybXMgc2lkZXMgYXR0YWNrXHJcbiAgICAnVG93ZXIgSGVyIEluZmxvcmVzY2VuY2UgRW5lcmd5IFNjYXR0ZXJlZCBNYWdpYyc6ICc1QkU4JywgLy8gb3JicyBmcm9tIFJlZCBHaXJsIGJ5IHRyYWluXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnVG93ZXIgSGVyIEluZmxvcmVzY2VuY2UgUGxhY2UgT2YgUG93ZXInOiAnNUMwRCcsIC8vIGluc3RhZGVhdGggbWlkZGxlIGNpcmNsZSBiZWZvcmUgYmxhY2svd2hpdGUgcmluZ3NcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1Rvd2VyIEtuYXZlIE1hZ2ljIEFydGlsbGVyeSBBbHBoYSc6ICc1RUFCJywgLy8gU3ByZWFkXHJcbiAgICAnVG93ZXIgSGFuc2VsIFNlZWQgT2YgTWFnaWMgQWxwaGEnOiAnNUM2MScsIC8vIFNwcmVhZFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnVG93ZXIgS25hdmUgTWFnaWMgQXJ0aWxsZXJ5IEJldGEnOiAnNUVCMycsIC8vIFRhbmtidXN0ZXJcclxuICAgICdUb3dlciBSZWQgR2lybCBNYW5pcHVsYXRlIEVuZXJneSc6ICc2MDFBJywgLy8gVGFua2J1c3RlclxyXG4gICAgJ1Rvd2VyIEZhbHNlIElkb2wgRGFya2VyIE5vdGUnOiAnNUJEQycsIC8vIFRhbmtidXN0ZXJcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVG93ZXIgS25vY2tlZCBPZmYnLFxyXG4gICAgICAvLyA1RUIxID0gS25hdmUgTHVuZ2VcclxuICAgICAgLy8gNUJGMiA9IEhlciBJbmZsb3Jlc2VuY2UgU2hvY2t3YXZlXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogWyc1RUIxJywgJzVCRjInXSB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdLbm9ja2VkIG9mZicsXHJcbiAgICAgICAgICAgIGRlOiAnUnVudGVyZ2VmYWxsZW4nLFxyXG4gICAgICAgICAgICBmcjogJ0Egw6l0w6kgYXNzb21tw6koZSknLFxyXG4gICAgICAgICAgICBqYTogJ+ODjuODg+OCr+ODkOODg+OCrycsXHJcbiAgICAgICAgICAgIGNuOiAn5Ye76YCA5Z2g6JC9JyxcclxuICAgICAgICAgICAga286ICfrhInrsLEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5Ba2FkYWVtaWFBbnlkZXIsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0FueWRlciBBY3JpZCBTdHJlYW0nOiAnNDMwNCcsXHJcbiAgICAnQW55ZGVyIFdhdGVyc3BvdXQnOiAnNDMwNicsXHJcbiAgICAnQW55ZGVyIFJhZ2luZyBXYXRlcnMnOiAnNDMwMicsXHJcbiAgICAnQW55ZGVyIFZpb2xlbnQgQnJlYWNoJzogJzQzMDUnLFxyXG4gICAgJ0FueWRlciBUaWRhbCBHdWlsbG90aW5lIDEnOiAnM0UwOCcsXHJcbiAgICAnQW55ZGVyIFRpZGFsIEd1aWxsb3RpbmUgMic6ICczRTBBJyxcclxuICAgICdBbnlkZXIgUGVsYWdpYyBDbGVhdmVyIDEnOiAnM0UwOScsXHJcbiAgICAnQW55ZGVyIFBlbGFnaWMgQ2xlYXZlciAyJzogJzNFMEInLFxyXG4gICAgJ0FueWRlciBBcXVhdGljIExhbmNlJzogJzNFMDUnLFxyXG4gICAgJ0FueWRlciBTeXJ1cCBTcG91dCc6ICc0MzA4JyxcclxuICAgICdBbnlkZXIgTmVlZGxlIFN0b3JtJzogJzQzMDknLFxyXG4gICAgJ0FueWRlciBFeHRlbnNpYmxlIFRlbmRyaWxzIDEnOiAnM0UxMCcsXHJcbiAgICAnQW55ZGVyIEV4dGVuc2libGUgVGVuZHJpbHMgMic6ICczRTExJyxcclxuICAgICdBbnlkZXIgUHV0cmlkIEJyZWF0aCc6ICczRTEyJyxcclxuICAgICdBbnlkZXIgRGV0b25hdG9yJzogJzQzMEYnLFxyXG4gICAgJ0FueWRlciBEb21pbmlvbiBTbGFzaCc6ICc0MzBEJyxcclxuICAgICdBbnlkZXIgUXVhc2FyJzogJzQzMEInLFxyXG4gICAgJ0FueWRlciBEYXJrIEFycml2aXNtZSc6ICc0MzBFJyxcclxuICAgICdBbnlkZXIgVGh1bmRlcnN0b3JtJzogJzNFMUMnLFxyXG4gICAgJ0FueWRlciBXaW5kaW5nIEN1cnJlbnQnOiAnM0UxRicsXHJcbiAgICAvLyAzRTIwIGlzIGJlaW5nIGhpdCBieSB0aGUgZ3Jvd2luZyBvcmJzLCBtYXliZT9cclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5BbWF1cm90LFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdBbWF1cm90IEJ1cm5pbmcgU2t5JzogJzM1NEEnLFxyXG4gICAgJ0FtYXVyb3QgV2hhY2snOiAnMzUzQycsXHJcbiAgICAnQW1hdXJvdCBBZXRoZXJzcGlrZSc6ICczNTNCJyxcclxuICAgICdBbWF1cm90IFZlbmVtb3VzIEJyZWF0aCc6ICczQ0NFJyxcclxuICAgICdBbWF1cm90IENvc21pYyBTaHJhcG5lbCc6ICc0RDI2JyxcclxuICAgICdBbWF1cm90IEVhcnRocXVha2UnOiAnM0NDRCcsXHJcbiAgICAnQW1hdXJvdCBNZXRlb3IgUmFpbic6ICczQ0M2JyxcclxuICAgICdBbWF1cm90IEZpbmFsIFNreSc6ICczQ0NCJyxcclxuICAgICdBbWF1cm90IE1hbGV2b2xlbmNlJzogJzM1NDEnLFxyXG4gICAgJ0FtYXVyb3QgVHVybmFib3V0JzogJzM1NDInLFxyXG4gICAgJ0FtYXVyb3QgU2lja2x5IEluZmVybm8nOiAnM0RFMycsXHJcbiAgICAnQW1hdXJvdCBEaXNxdWlldGluZyBHbGVhbSc6ICczNTQ2JyxcclxuICAgICdBbWF1cm90IEJsYWNrIERlYXRoJzogJzM1NDMnLFxyXG4gICAgJ0FtYXVyb3QgRm9yY2Ugb2YgTG9hdGhpbmcnOiAnMzU0NCcsXHJcbiAgICAnQW1hdXJvdCBEYW1uaW5nIFJheSAxJzogJzNFMDAnLFxyXG4gICAgJ0FtYXVyb3QgRGFtbmluZyBSYXkgMic6ICczRTAxJyxcclxuICAgICdBbWF1cm90IERlYWRseSBUZW50YWNsZXMnOiAnMzU0NycsXHJcbiAgICAnQW1hdXJvdCBNaXNmb3J0dW5lJzogJzNDRTInLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0FtYXVyb3QgQXBva2FseXBzaXMnOiAnM0NENycsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuQW5hbW5lc2lzQW55ZGVyLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdBbmFtbmVzaXMgVHJlbmNoIFBodWFibyBTcGluZSBMYXNoJzogJzREMUEnLCAvLyBmcm9udGFsIGNvbmFsXHJcbiAgICAnQW5hbW5lc2lzIFRyZW5jaCBBbmVtb25lIEZhbGxpbmcgUm9jayc6ICc0RTM3JywgLy8gZ3JvdW5kIGNpcmNsZSBhb2UgZnJvbSBUcmVuY2ggQW5lbW9uZSBzaG93aW5nIHVwXHJcbiAgICAnQW5hbW5lc2lzIFRyZW5jaCBEYWdvbml0ZSBTZXdlciBXYXRlcic6ICc0RDFDJywgLy8gZnJvbnRhbCBjb25hbCBmcm9tIFRyZW5jaCBBbmVtb25lICg/ISlcclxuICAgICdBbmFtbmVzaXMgVHJlbmNoIFlvdnJhIFJvY2sgSGFyZCc6ICc0RDIxJywgLy8gdGFyZ2V0ZWQgY2lyY2xlIGFvZVxyXG4gICAgJ0FuYW1uZXNpcyBUcmVuY2ggWW92cmEgVG9ycmVudGlhbCBUb3JtZW50JzogJzREMjEnLCAvLyBmcm9udGFsIGNvbmFsXHJcbiAgICAnQW5hbW5lc2lzIFVua25vd24gTHVtaW5vdXMgUmF5JzogJzRFMjcnLCAvLyBVbmtub3duIGxpbmUgYW9lXHJcbiAgICAnQW5hbW5lc2lzIFVua25vd24gU2luc3RlciBCdWJibGUgRXhwbG9zaW9uJzogJzRCNkUnLCAvLyBVbmtub3duIGV4cGxvc2lvbnMgZHVyaW5nIFNjcnV0aW55XHJcbiAgICAnQW5hbW5lc2lzIFVua25vd24gUmVmbGVjdGlvbic6ICc0QjZGJywgLy8gVW5rbm93biBjb25hbCBhdHRhY2sgZHVyaW5nIFNjcnV0aW55XHJcbiAgICAnQW5hbW5lc2lzIFVua25vd24gQ2xlYXJvdXQgMSc6ICc0Qjc0JywgLy8gVW5rbm93biBmcm9udGFsIGNvbmVcclxuICAgICdBbmFtbmVzaXMgVW5rbm93biBDbGVhcm91dCAyJzogJzRCNkInLCAvLyBVbmtub3duIGZyb250YWwgY29uZVxyXG4gICAgJ0FuYW1uZXNpcyBVbmtub3duIFNldGJhY2sgMSc6ICc0Qjc1JywgLy8gVW5rbm93biByZWFyIGNvbmVcclxuICAgICdBbmFtbmVzaXMgVW5rbm93biBTZXRiYWNrIDInOiAnNUI2QycsIC8vIFVua25vd24gcmVhciBjb25lXHJcbiAgICAnQW5hbW5lc2lzIEFueWRlciBDbGlvbmlkIEFjcmlkIFN0cmVhbSc6ICc0RDI0JywgLy8gdGFyZ2V0ZWQgY2lyY2xlIGFvZVxyXG4gICAgJ0FuYW1uZXNpcyBBbnlkZXIgRGl2aW5lciBEcmVhZHN0b3JtJzogJzREMjgnLCAvLyBncm91bmQgY2lyY2xlIGFvZVxyXG4gICAgJ0FuYW1uZXNpcyBLeWtsb3BzIDIwMDAtTWluYSBTd2luZyc6ICc0QjU1JywgLy8gS3lrbG9wcyBnZXQgb3V0IG1lY2hhbmljXHJcbiAgICAnQW5hbW5lc2lzIEt5a2xvcHMgVGVycmlibGUgSGFtbWVyJzogJzRCNUQnLCAvLyBLeWtsb3BzIEhhbW1lci9CbGFkZSBhbHRlcm5hdGluZyBzcXVhcmVzXHJcbiAgICAnQW5hbW5lc2lzIEt5a2xvcHMgVGVycmlibGUgQmxhZGUnOiAnNEI1RScsIC8vIEt5a2xvcHMgSGFtbWVyL0JsYWRlIGFsdGVybmF0aW5nIHNxdWFyZXNcclxuICAgICdBbmFtbmVzaXMgS3lrbG9wcyBSYWdpbmcgR2xvd2VyJzogJzRCNTYnLCAvLyBLeWtsb3BzIGxpbmUgYW9lXHJcbiAgICAnQW5hbW5lc2lzIEt5a2xvcHMgRXllIE9mIFRoZSBDeWNsb25lJzogJzRCNTcnLCAvLyBLeWtsb3BzIGRvbnV0XHJcbiAgICAnQW5hbW5lc2lzIEFueWRlciBIYXJwb29uZXIgSHlkcm9iYWxsJzogJzREMjYnLCAvLyBmcm9udGFsIGNvbmFsXHJcbiAgICAnQW5hbW5lc2lzIFJ1a3NocyBTd2lmdCBTaGlmdCc6ICc0QjgzJywgLy8gUnVrc2hzIERlZW0gdGVsZXBvcnQgTi9TXHJcbiAgICAnQW5hbW5lc2lzIFJ1a3NocyBEZXB0aCBHcmlwIFdhdmVicmVha2VyJzogJzMzRDQnLCAvLyBSdWtzaHMgRGVlbSBoYW5kIGF0dGFja3NcclxuICAgICdBbmFtbmVzaXMgUnVrc2hzIFJpc2luZyBUaWRlJzogJzRCOEInLCAvLyBSdWtzaHMgRGVlbSBjcm9zcyBhb2VcclxuICAgICdBbmFtbmVzaXMgUnVrc2hzIENvbW1hbmQgQ3VycmVudCc6ICc0QjgyJywgLy8gUnVrc2hzIERlZW0gcHJvdGVhbi1pc2ggZ3JvdW5kIGFvZXNcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0FuYW1uZXNpcyBUcmVuY2ggWHpvbWl0IE1hbnRsZSBEcmlsbCc6ICc0RDE5JywgLy8gY2hhcmdlIGF0dGFja1xyXG4gICAgJ0FuYW1uZXNpcyBJbyBPdXNpYSBCYXJyZWxpbmcgU21hc2gnOiAnNEUyNCcsIC8vIGNoYXJnZSBhdHRhY2tcclxuICAgICdBbmFtbmVzaXMgS3lrbG9wcyBXYW5kZXJlclxcJ3MgUHlyZSc6ICc0QjVGJywgLy8gS3lrbG9wcyBzcHJlYWQgYXR0YWNrXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRPRE86IE1pc3NpbmcgR3Jvd2luZyB0ZXRoZXJzIG9uIGJvc3MgMi5cclxuLy8gKE1heWJlIGdhdGhlciBwYXJ0eSBtZW1iZXIgbmFtZXMgb24gdGhlIHByZXZpb3VzIFRJSUlJTUJFRUVFRUVSIGNhc3QgZm9yIGNvbXBhcmlzb24/KVxyXG4vLyBUT0RPOiBGYWlsaW5nIHRvIGludGVycnVwdCBEb2huZmF1c3QgRnVhdGggb24gV2F0ZXJpbmcgV2hlZWwgY2FzdHM/XHJcbi8vICgxNTouLi4uLi4uLjpEb2huZmFzdCBGdWF0aDozREFBOldhdGVyaW5nIFdoZWVsOi4uLi4uLi4uOihcXHl7TmFtZX0pOilcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5Eb2huTWhlZyxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRG9obiBNaGVnIEdleXNlcic6ICcyMjYwJywgLy8gV2F0ZXIgZXJ1cHRpb25zLCBib3NzIDFcclxuICAgICdEb2huIE1oZWcgSHlkcm9mYWxsJzogJzIyQkQnLCAvLyBHcm91bmQgQW9FIG1hcmtlciwgYm9zcyAxXHJcbiAgICAnRG9obiBNaGVnIExhdWdoaW5nIExlYXAnOiAnMjI5NCcsIC8vIEdyb3VuZCBBb0UgbWFya2VyLCBib3NzIDFcclxuICAgICdEb2huIE1oZWcgU3dpbmdlJzogJzIyQ0EnLCAvLyBGcm9udGFsIGNvbmUsIGJvc3MgMlxyXG4gICAgJ0RvaG4gTWhlZyBDYW5vcHknOiAnM0RCMCcsIC8vIEZyb250YWwgY29uZSwgRG9obmZhdXN0IFJvd2FucyB0aHJvdWdob3V0IGluc3RhbmNlXHJcbiAgICAnRG9obiBNaGVnIFBpbmVjb25lIEJvbWInOiAnM0RCMScsIC8vIENpcmN1bGFyIGdyb3VuZCBBb0UgbWFya2VyLCBEb2huZmF1c3QgUm93YW5zIHRocm91Z2hvdXQgaW5zdGFuY2VcclxuICAgICdEb2huIE1oZWcgQmlsZSBCb21iYXJkbWVudCc6ICczNEVFJywgLy8gR3JvdW5kIEFvRSBtYXJrZXIsIGJvc3MgM1xyXG4gICAgJ0RvaG4gTWhlZyBDb3Jyb3NpdmUgQmlsZSc6ICczNEVDJywgLy8gRnJvbnRhbCBjb25lLCBib3NzIDNcclxuICAgICdEb2huIE1oZWcgRmxhaWxpbmcgVGVudGFjbGVzJzogJzM2ODEnLFxyXG5cclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRG9obiBNaGVnIEltcCBDaG9pcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc0NkUnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0RvaG4gTWhlZyBUb2FkIENob2lyJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzFCNycgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5lZmZlY3QgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRG9obiBNaGVnIEZvb2xcXCdzIFR1bWJsZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcxODMnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBCZXJzZXJrZXIgMm5kLzNyZCB3aWxkIGFuZ3Vpc2ggc2hvdWxkIGJlIHNoYXJlZCB3aXRoIGp1c3QgYSByb2NrXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlSGVyb2VzR2F1bnRsZXQsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1RIRyBCbGFkZVxcJ3MgQmVuaXNvbic6ICc1MjI4JywgLy8gcGxkIGNvbmFsXHJcbiAgICAnVEhHIEFic29sdXRlIEhvbHknOiAnNTI0QicsIC8vIHdobSB2ZXJ5IGxhcmdlIGFvZVxyXG4gICAgJ1RIRyBIaXNzYXRzdTogR29rYSc6ICc1MjNEJywgLy8gc2FtIGxpbmUgYW9lXHJcbiAgICAnVEhHIFdob2xlIFNlbGYnOiAnNTIyRCcsIC8vIG1uayB3aWRlIGxpbmUgYW9lXHJcbiAgICAnVEhHIFJhbmRncml0aCc6ICc1MjMyJywgLy8gZHJnIHZlcnkgYmlnIGxpbmUgYW9lXHJcbiAgICAnVEhHIFZhY3V1bSBCbGFkZSAxJzogJzUwNjEnLCAvLyBTcGVjdHJhbCBUaGllZiBjaXJjdWxhciBncm91bmQgYW9lIGZyb20gbWFya2VyXHJcbiAgICAnVEhHIFZhY3V1bSBCbGFkZSAyJzogJzUwNjInLCAvLyBTcGVjdHJhbCBUaGllZiBjaXJjdWxhciBncm91bmQgYW9lIGZyb20gbWFya2VyXHJcbiAgICAnVEhHIENvd2FyZFxcJ3MgQ3VubmluZyc6ICc0RkQ3JywgLy8gU3BlY3RyYWwgVGhpZWYgQ2hpY2tlbiBLbmlmZSBsYXNlclxyXG4gICAgJ1RIRyBQYXBlcmN1dHRlciAxJzogJzRGRDEnLCAvLyBTcGVjdHJhbCBUaGllZiBsaW5lIGFvZSBmcm9tIG1hcmtlclxyXG4gICAgJ1RIRyBQYXBlcmN1dHRlciAyJzogJzRGRDInLCAvLyBTcGVjdHJhbCBUaGllZiBsaW5lIGFvZSBmcm9tIG1hcmtlclxyXG4gICAgJ1RIRyBSaW5nIG9mIERlYXRoJzogJzUyMzYnLCAvLyBkcmcgY2lyY3VsYXIgYW9lXHJcbiAgICAnVEhHIEx1bmFyIEVjbGlwc2UnOiAnNTIyNycsIC8vIHBsZCBjaXJjdWxhciBhb2VcclxuICAgICdUSEcgQWJzb2x1dGUgR3Jhdml0eSc6ICc1MjQ4JywgLy8gaW5rIG1hZ2UgY2lyY3VsYXJcclxuICAgICdUSEcgUmFpbiBvZiBMaWdodCc6ICc1MjQyJywgLy8gYmFyZCBsYXJnZSBjaXJjdWxlIGFvZVxyXG4gICAgJ1RIRyBEb29taW5nIEZvcmNlJzogJzUyMzknLCAvLyBkcmcgbGluZSBhb2VcclxuICAgICdUSEcgQWJzb2x1dGUgRGFyayBJSSc6ICc0RjYxJywgLy8gTmVjcm9tYW5jZXIgMTIwIGRlZ3JlZSBjb25hbFxyXG4gICAgJ1RIRyBCdXJzdCc6ICc1M0I3JywgLy8gTmVjcm9tYW5jZXIgbmVjcm9idXJzdCBzbWFsbCB6b21iaWUgZXhwbG9zaW9uXHJcbiAgICAnVEhHIFBhaW4gTWlyZSc6ICc0RkE0JywgLy8gTmVjcm9tYW5jZXIgdmVyeSBsYXJnZSBncmVlbiBibGVlZCBwdWRkbGVcclxuICAgICdUSEcgRGFyayBEZWx1Z2UnOiAnNEY1RCcsIC8vIE5lY3JvbWFuY2VyIGdyb3VuZCBhb2VcclxuICAgICdUSEcgVGVra2EgR29qaW4nOiAnNTIzRScsIC8vIHNhbSA5MCBkZWdyZWUgY29uYWxcclxuICAgICdUSEcgUmFnaW5nIFNsaWNlIDEnOiAnNTIwQScsIC8vIEJlcnNlcmtlciBsaW5lIGNsZWF2ZVxyXG4gICAgJ1RIRyBSYWdpbmcgU2xpY2UgMic6ICc1MjBCJywgLy8gQmVyc2Vya2VyIGxpbmUgY2xlYXZlXHJcbiAgICAnVEhHIFdpbGQgUmFnZSc6ICc1MjAzJywgLy8gQmVyc2Vya2VyIGJsdWUga25vY2tiYWNrIHB1Y2tcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1RIRyBBYnNvbHV0ZSBUaHVuZGVyIElWJzogJzUyNDUnLCAvLyBoZWFkbWFya2VyIGFvZSBmcm9tIGJsbVxyXG4gICAgJ1RIRyBNb29uZGl2ZXInOiAnNTIzMycsIC8vIGhlYWRtYXJrZXIgYW9lIGZyb20gZHJnXHJcbiAgICAnVEhHIFNwZWN0cmFsIEd1c3QnOiAnNTNDRicsIC8vIFNwZWN0cmFsIFRoaWVmIGhlYWRtYXJrZXIgYW9lXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgICdUSEcgRmFsbGluZyBSb2NrJzogJzUyMDUnLCAvLyBCZXJzZXJrZXIgaGVhZG1hcmtlciBhb2UgdGhhdCBjcmVhdGVzIHJ1YmJsZVxyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnVEhHIEJsZWVkaW5nJzogJzgyOCcsIC8vIFN0YW5kaW5nIGluIHRoZSBOZWNyb21hbmNlciBwdWRkbGUgb3Igb3V0c2lkZSB0aGUgQmVyc2Vya2VyIGFyZW5hXHJcbiAgfSxcclxuICBnYWluc0VmZmVjdEZhaWw6IHtcclxuICAgICdUSEcgVHJ1bHkgQmVyc2Vyayc6ICc5MDYnLCAvLyBTdGFuZGluZyBpbiB0aGUgY3JhdGVyIHRvbyBsb25nXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ1RIRyBXaWxkIEFuZ3Vpc2gnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICc1MjA5JyB9KSxcclxuICAgICAgLy8gVGhpcyBzaG91bGQgYWx3YXlzIGJlIHNoYXJlZC4gIE9uIGFsbCB0aW1lcyBidXQgdGhlIDJuZCBhbmQgM3JkLCBpdCdzIGEgcGFydHkgc2hhcmUuXHJcbiAgICAgIC8vIFRPRE86IG9uIHRoZSAybmQgYW5kIDNyZCB0aW1lIHRoaXMgc2hvdWxkIG9ubHkgYmUgc2hhcmVkIHdpdGggYSByb2NrLlxyXG4gICAgICAvLyBUT0RPOiBhbHRlcm5hdGl2ZWx5IHdhcm4gb24gdGFraW5nIG9uZSBvZiB0aGVzZSB3aXRoIGEgNDcyIE1hZ2ljIFZ1bG5lcmFiaWxpdHkgVXAgZWZmZWN0XHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IGUudHlwZSA9PT0gJzE1JyxcclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmFiaWxpdHkgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVEhHIFdpbGQgUmFtcGFnZScsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNTIwNycsXHJcbiAgICAgIC8vIFRoaXMgaXMgemVybyBkYW1hZ2UgaWYgeW91IGFyZSBpbiB0aGUgY3JhdGVyLlxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLmRhbWFnZSA+IDAsXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkhvbG1pbnN0ZXJTd2l0Y2gsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0hvbG1pbnN0ZXIgVGh1bWJzY3Jldyc6ICczREM2JyxcclxuICAgICdIb2xtaW5zdGVyIFdvb2RlbiBob3JzZSc6ICczREM3JyxcclxuICAgICdIb2xtaW5zdGVyIExpZ2h0IFNob3QnOiAnM0RDOCcsXHJcbiAgICAnSG9sbWluc3RlciBIZXJldGljXFwncyBGb3JrJzogJzNEQ0UnLFxyXG4gICAgJ0hvbG1pbnN0ZXIgSG9seSBXYXRlcic6ICczREQ0JyxcclxuICAgICdIb2xtaW5zdGVyIEZpZXJjZSBCZWF0aW5nIDEnOiAnM0RERCcsXHJcbiAgICAnSG9sbWluc3RlciBGaWVyY2UgQmVhdGluZyAyJzogJzNEREUnLFxyXG4gICAgJ0hvbG1pbnN0ZXIgRmllcmNlIEJlYXRpbmcgMyc6ICczRERGJyxcclxuICAgICdIb2xtaW5zdGVyIENhdCBPXFwnIE5pbmUgVGFpbHMnOiAnM0RFMScsXHJcbiAgICAnSG9sbWluc3RlciBSaWdodCBLbm91dCc6ICczREU2JyxcclxuICAgICdIb2xtaW5zdGVyIExlZnQgS25vdXQnOiAnM0RFNycsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnSG9sbWluc3RlciBBZXRoZXJzdXAnOiAnM0RFOScsXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdIb2xtaW5zdGVyIEZsYWdlbGxhdGlvbic6ICczREQ2JyxcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgJ0hvbG1pbnN0ZXIgVGFwaGVwaG9iaWEnOiAnNDE4MScsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuTWFsaWthaHNXZWxsLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdNYWxpa2FoIEZhbGxpbmcgUm9jayc6ICczQ0VBJyxcclxuICAgICdNYWxpa2FoIFdlbGxib3JlJzogJzNDRUQnLFxyXG4gICAgJ01hbGlrYWggR2V5c2VyIEVydXB0aW9uJzogJzNDRUUnLFxyXG4gICAgJ01hbGlrYWggU3dpZnQgU3BpbGwnOiAnM0NGMCcsXHJcbiAgICAnTWFsaWthaCBCcmVha2luZyBXaGVlbCAxJzogJzNDRjUnLFxyXG4gICAgJ01hbGlrYWggQ3J5c3RhbCBOYWlsJzogJzNDRjcnLFxyXG4gICAgJ01hbGlrYWggSGVyZXRpY1xcJ3MgRm9yayAxJzogJzNDRjknLFxyXG4gICAgJ01hbGlrYWggQnJlYWtpbmcgV2hlZWwgMic6ICczQ0ZBJyxcclxuICAgICdNYWxpa2FoIEhlcmV0aWNcXCdzIEZvcmsgMic6ICczRTBFJyxcclxuICAgICdNYWxpa2FoIEVhcnRoc2hha2UnOiAnM0UzOScsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBjb3VsZCBpbmNsdWRlIDU0ODQgTXVkbWFuIFJvY2t5IFJvbGwgYXMgYSBzaGFyZVdhcm4sIGJ1dCBpdCdzIGxvdyBkYW1hZ2UgYW5kIGNvbW1vbi5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5NYXRveWFzUmVsaWN0LFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdNYXRveWEgUmVsaWN0IFdlcmV3b29kIE92YXRpb24nOiAnNTUxOCcsIC8vIGxpbmUgYW9lXHJcbiAgICAnTWF0b3lhIENhdmUgVGFyYW50dWxhIEhhd2sgQXBpdG94aW4nOiAnNTUxOScsIC8vIGJpZyBjaXJjbGUgYW9lXHJcbiAgICAnTWF0b3lhIFNwcmlnZ2FuIFN0b25lYmVhcmVyIFJvbXAnOiAnNTUxQScsIC8vIGNvbmFsIGFvZVxyXG4gICAgJ01hdG95YSBTb25ueSBPZiBaaWdneSBKaXR0ZXJpbmcgR2xhcmUnOiAnNTUxQycsIC8vIGxvbmcgbmFycm93IGNvbmFsIGFvZVxyXG4gICAgJ01hdG95YSBNdWRtYW4gUXVhZ21pcmUnOiAnNTQ4MScsIC8vIE11ZG1hbiBhb2UgcHVkZGxlc1xyXG4gICAgJ01hdG95YSBNdWRtYW4gQnJpdHRsZSBCcmVjY2lhIDEnOiAnNTQ4RScsIC8vIGV4cGFuZGluZyBjaXJjbGUgYW9lXHJcbiAgICAnTWF0b3lhIE11ZG1hbiBCcml0dGxlIEJyZWNjaWEgMic6ICc1NDhGJywgLy8gZXhwYW5kaW5nIGNpcmNsZSBhb2VcclxuICAgICdNYXRveWEgTXVkbWFuIEJyaXR0bGUgQnJlY2NpYSAzJzogJzU0OTAnLCAvLyBleHBhbmRpbmcgY2lyY2xlIGFvZVxyXG4gICAgJ01hdG95YSBNdWRtYW4gTXVkIEJ1YmJsZSc6ICc1NDg3JywgLy8gc3RhbmRpbmcgaW4gbXVkIHB1ZGRsZT9cclxuICAgICdNYXRveWEgQ2F2ZSBQdWdpbCBTY3Jld2RyaXZlcic6ICc1NTFFJywgLy8gY29uYWwgYW9lXHJcbiAgICAnTWF0b3lhIE5peGllIEd1cmdsZSc6ICc1OTkyJywgLy8gTml4aWUgd2FsbCBmbHVzaFxyXG4gICAgJ01hdG95YSBSZWxpY3QgTW9sdGVuIFBob2ViYWQgUHlyb2NsYXN0aWMgU2hvdCc6ICc1N0VCJywgLy8gdGhlIGxpbmUgYW9lcyBhcyB5b3UgcnVuIHRvIHRyYXNoXHJcbiAgICAnTWF0b3lhIFJlbGljdCBGbGFuIEZsb29kJzogJzU1MjMnLCAvLyBiaWcgY2lyY2xlIGFvZVxyXG4gICAgJ01hdG95YSBQeXJvZHVjdCBFbGR0aHVycyBNYXNoJzogJzU1MjcnLCAvLyBsaW5lIGFvZVxyXG4gICAgJ01hdHlvYSBQeXJvZHVjdCBFbGR0aHVycyBTcGluJzogJzU1MjgnLCAvLyB2ZXJ5IGxhcmdlIGNpcmNsZSBhb2VcclxuICAgICdNYXRveWEgUmVsaWN0IEJhdmFyb2lzIFRodW5kZXIgSUlJJzogJzU1MjUnLCAvLyBjaXJjbGUgYW9lXHJcbiAgICAnTWF0b3lhIFJlbGljdCBNYXJzaG1hbGxvdyBBbmNpZW50IEFlcm8nOiAnNTUyNCcsIC8vIHZlcnkgbGFyZ2UgbGluZSBncm9hb2VcclxuICAgICdNYXRveWEgUmVsaWN0IFB1ZGRpbmcgRmlyZSBJSSc6ICc1NTIyJywgLy8gY2lyY2xlIGFvZVxyXG4gICAgJ01hdG95YSBSZWxpY3QgTW9sdGVuIFBob2ViYWQgSG90IExhdmEnOiAnNTdFOScsIC8vIGNvbmFsIGFvZVxyXG4gICAgJ01hdG95YSBSZWxpY3QgTW9sdGVuIFBob2ViYWQgVm9sY2FuaWMgRHJvcCc6ICc1N0U4JywgLy8gY2lyY2xlIGFvZVxyXG4gICAgJ01hdG95YSBNb3RoZXIgUG9yeGllIE1lZGl1bSBSZWFyJzogJzU5MUQnLCAvLyBrbm9ja2JhY2sgaW50byBzYWZlIGNpcmNsZSBhb2VcclxuICAgICdNYXRveWEgTW90aGVyIFBvcnhpZSBCYXJiZXF1ZSBMaW5lJzogJzU5MTcnLCAvLyBsaW5lIGFvZSBkdXJpbmcgYmJxXHJcbiAgICAnTWF0b3lhIE1vdGhlciBQb3J4aWUgQmFyYmVxdWUgQ2lyY2xlJzogJzU5MTgnLCAvLyBjaXJjbGUgYW9lIGR1cmluZyBiYnFcclxuICAgICdNYXRveWEgTW90aGVyIFBvcnhpZSBUbyBBIENyaXNwJzogJzU5MjUnLCAvLyBnZXR0aW5nIHRvIGNsb3NlIHRvIGJvc3MgZHVyaW5nIGJicVxyXG4gICAgJ01hdG95YSBNb3RoZXIgUHJveGllIEJ1ZmZldCc6ICc1OTI2JywgLy8gQWVvbGlhbiBDYXZlIFNwcml0ZSBsaW5lIGFvZSAoaXMgdGhpcyBhIHB1bj8pXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnTWF0b3lhIE5peGllIFNlYSBTaGFudHknOiAnNTk4QycsIC8vIE5vdCB0YWtpbmcgdGhlIHB1ZGRsZSB1cCB0byB0aGUgdG9wPyBGYWlsaW5nIGFkZCBlbnJhZ2U/XHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdNYXRveWEgTml4aWUgQ3JhY2snOiAnNTk5MCcsIC8vIE5peGllIENyYXNoLVNtYXNoIHRhbmsgdGV0aGVyc1xyXG4gICAgJ01hdG95YSBOaXhpZSBTcHV0dGVyJzogJzU5OTMnLCAvLyBOaXhpZSBzcHJlYWQgbWFya2VyXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuTXRHdWxnLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdHdWxnIEltbW9sYXRpb24nOiAnNDFBQScsXHJcbiAgICAnR3VsZyBUYWlsIFNtYXNoJzogJzQxQUInLFxyXG4gICAgJ0d1bGcgSGVhdmVuc2xhc2gnOiAnNDFBOScsXHJcbiAgICAnR3VsZyBUeXBob29uIFdpbmcgMSc6ICczRDAwJyxcclxuICAgICdHdWxnIFR5cGhvb24gV2luZyAyJzogJzNEMDEnLFxyXG4gICAgJ0d1bGcgSHVycmljYW5lIFdpbmcnOiAnM0QwMycsXHJcbiAgICAnR3VsZyBFYXJ0aCBTaGFrZXInOiAnMzdGNScsXHJcbiAgICAnR3VsZyBTYW5jdGlmaWNhdGlvbic6ICc0MUFFJyxcclxuICAgICdHdWxnIEV4ZWdlc2lzJzogJzNEMDcnLFxyXG4gICAgJ0d1bGcgUGVyZmVjdCBDb250cml0aW9uJzogJzNEMEUnLFxyXG4gICAgJ0d1bGcgU2FuY3RpZmllZCBBZXJvJzogJzQxQUQnLFxyXG4gICAgJ0d1bGcgRGl2aW5lIERpbWludWVuZG8gMSc6ICczRDE2JyxcclxuICAgICdHdWxnIERpdmluZSBEaW1pbnVlbmRvIDInOiAnM0QxOCcsXHJcbiAgICAnR3VsZyBEaXZpbmUgRGltaW51ZW5kbyAzJzogJzQ2NjknLFxyXG4gICAgJ0d1bGcgRGl2aW5lIERpbWludWVuZG8gNCc6ICczRDE5JyxcclxuICAgICdHdWxnIERpdmluZSBEaW1pbnVlbmRvIDUnOiAnM0QyMScsXHJcbiAgICAnR3VsZyBDb252aWN0aW9uIE1hcmNhdG8gMSc6ICczRDFBJyxcclxuICAgICdHdWxnIENvbnZpY3Rpb24gTWFyY2F0byAyJzogJzNEMUInLFxyXG4gICAgJ0d1bGcgQ29udmljdGlvbiBNYXJjYXRvIDMnOiAnM0QyMCcsXHJcbiAgICAnR3VsZyBWZW5hIEFtb3Jpcyc6ICczRDI3JyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdHdWxnIEx1bWVuIEluZmluaXR1bSc6ICc0MUIyJyxcclxuICAgICdHdWxnIFJpZ2h0IFBhbG0nOiAnMzdGOCcsXHJcbiAgICAnR3VsZyBMZWZ0IFBhbG0nOiAnMzdGQScsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBXaGF0IHRvIGRvIGFib3V0IEthaG4gUmFpIDVCNTA/XHJcbi8vIEl0IHNlZW1zIGltcG9zc2libGUgZm9yIHRoZSBtYXJrZWQgcGVyc29uIHRvIGF2b2lkIGVudGlyZWx5LlxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlBhZ2x0aGFuLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdQYWdsdGhhbiBUZWxvdm91aXZyZSBQbGFndWUgU3dpcGUnOiAnNjBGQycsIC8vIGZyb250YWwgY29uYWwgY2xlYXZlXHJcbiAgICAnUGFnbHRoYW4gTGVzc2VyIFRlbG9kcmFnb24gRW5ndWxmaW5nIEZsYW1lcyc6ICc2MEY1JywgLy8gZnJvbnRhbCBjb25hbCBjbGVhdmVcclxuICAgICdQYWdsdGhhbiBBbWh1bHVrIExpZ2h0bmluZyBCb2x0JzogJzVDNEMnLCAvLyBjaXJjdWxhciBsaWdodG5pbmcgYW9lIChvbiBzZWxmIG9yIHBvc3QpXHJcbiAgICAnUGFnbHRoYW4gQW1odWx1ayBCYWxsIE9mIExldmluIFNob2NrJzogJzVDNTInLCAvLyBwdWxzaW5nIHNtYWxsIGNpcmN1bGFyIGFvZXNcclxuICAgICdQYWdsdGhhbiBBbWh1bHVrIFN1cGVyY2hhcmdlZCBCYWxsIE9mIExldmluIFNob2NrJzogJzVDNTMnLCAvLyBwdWxzaW5nIGxhcmdlIGNpcmN1bGFyIGFvZVxyXG4gICAgJ1BhZ2x0aGFuIEFtaHVsdWsgV2lkZSBCbGFzdGVyJzogJzYwQzUnLCAvLyByZWFyIGNvbmFsIGNsZWF2ZVxyXG4gICAgJ1BhZ2x0aGFuIFRlbG9icm9iaW55YWsgRmFsbCBPZiBNYW4nOiAnNjE0OCcsIC8vIGNpcmN1bGFyIGFvZVxyXG4gICAgJ1BhZ2x0aGFuIFRlbG90ZWsgUmVhcGVyIE1hZ2l0ZWsgQ2Fubm9uJzogJzYxMjEnLCAvLyBjaXJjdWxhciBhb2VcclxuICAgICdQYWdsdGhhbiBUZWxvZHJhZ29uIFNoZWV0IG9mIEljZSc6ICc2MEY4JywgLy8gY2lyY3VsYXIgYW9lXHJcbiAgICAnUGFnbHRoYW4gVGVsb2RyYWdvbiBGcm9zdCBCcmVhdGgnOiAnNjBGNycsIC8vIHZlcnkgbGFyZ2UgY29uYWwgY2xlYXZlXHJcbiAgICAnUGFnbHRoYW4gTWFnaXRlayBDb3JlIFN0YWJsZSBDYW5ub24nOiAnNUM5NCcsIC8vIGxhcmdlIGxpbmUgYW9lc1xyXG4gICAgJ1BhZ2x0aGFuIE1hZ2l0ZWsgQ29yZSAyLVRvbnplIE1hZ2l0ZWsgTWlzc2lsZSc6ICc1Qzk1JywgLy8gbGFyZ2UgY2lyY3VsYXIgYW9lXHJcbiAgICAnUGFnbHRoYW4gVGVsb3RlayBTa3kgQXJtb3IgQWV0aGVyc2hvdCc6ICc1QzlDJywgLy8gY2lyY3VsYXIgYW9lXHJcbiAgICAnUGFnbHRoYW4gTWFyayBJSSBUZWxvdGVrIENvbG9zc3VzIEV4aGF1c3QnOiAnNUM5OScsIC8vIGxhcmdlIGxpbmUgYW9lXHJcbiAgICAnUGFnbHRoYW4gTWFnaXRlayBNaXNzaWxlIEV4cGxvc2l2ZSBGb3JjZSc6ICc1Qzk4JywgLy8gc2xvdyBtb3ZpbmcgaG9yaXpvbnRhbCBtaXNzaWxlc1xyXG4gICAgJ1BhZ2x0aGFuIFRpYW1hdCBGbGFtaXNwaGVyZSc6ICc2MTBGJywgLy8gdmVyeSBsb25nIGxpbmUgYW9lXHJcbiAgICAnUGFnbHRoYW4gQXJtb3JlZCBUZWxvZHJhZ29uIFRvcnRvaXNlIFN0b21wJzogJzYxNEInLCAvLyBsYXJnZSBjaXJjdWxhciBhb2UgZnJvbSB0dXJ0bGVcclxuICAgICdQYWdsdGhhbiBUZWxvZHJhZ29uIFRodW5kZXJvdXMgQnJlYXRoJzogJzYxNDknLCAvLyBsYXJnZSBjb25hbCBjbGVhdmVcclxuICAgICdQYWdsdGhhbiBMdW5hciBCYWhhbXV0IEx1bmFyIE5haWwgVXBidXJzdCc6ICc2MDVCJywgLy8gc21hbGwgYW9lcyBiZWZvcmUgQmlnIEJ1cnN0XHJcbiAgICAnUGFnbHRoYW4gTHVuYXIgQmFoYW11dCBMdW5hciBOYWlsIEJpZyBCdXJzdCc6ICc1QjQ4JywgLy8gbGFyZ2UgY2lyY3VsYXIgYW9lcyBmcm9tIG5haWxzXHJcbiAgICAnUGFnbHRoYW4gTHVuYXIgQmFoYW11dCBQZXJpZ2VhbiBCcmVhdGgnOiAnNUI1OScsIC8vIGxhcmdlIGNvbmFsIGNsZWF2ZVxyXG4gICAgJ1BhZ2x0aGFuIEx1bmFyIEJhaGFtdXQgTWVnYWZsYXJlJzogJzVCNEUnLCAvLyBtZWdhZmxhcmUgcGVwcGVyb25pXHJcbiAgICAnUGFnbHRoYW4gTHVuYXIgQmFoYW11dCBNZWdhZmxhcmUgRGl2ZSc6ICc1QjUyJywgLy8gbWVnYWZsYXJlIGxpbmUgYW9lIGFjcm9zcyB0aGUgYXJlbmFcclxuICAgICdQYWdsdGhhbiBMdW5hciBCYWhhbXV0IEx1bmFyIEZsYXJlJzogJzVCNEEnLCAvLyBsYXJnZSBwdXJwbGUgc2hyaW5raW5nIGNpcmNsZXNcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1BhZ2x0aGFuIEx1bmFyIEJhaGFtdXQgTWVnYWZsYXJlJzogJzVCNEQnLCAvLyBtZWdhZmxhcmUgc3ByZWFkIG1hcmtlcnNcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVRaXRhbmFSYXZlbCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnUWl0YW5hIFN1biBUb3NzJzogJzNDOEEnLCAvLyBHcm91bmQgQW9FLCBib3NzIG9uZVxyXG4gICAgJ1FpdGFuYSBSb25rYW4gTGlnaHQgMSc6ICczQzhDJywgLy8gU3RhdHVlIGF0dGFjaywgYm9zcyBvbmVcclxuICAgICdRaXRhbmEgTG96YXRsXFwncyBGdXJ5IDEnOiAnM0M4RicsIC8vIFNlbWljaXJjbGUgY2xlYXZlLCBib3NzIG9uZVxyXG4gICAgJ1FpdGFuYSBMb3phdGxcXCdzIEZ1cnkgMic6ICczQzkwJywgLy8gU2VtaWNpcmNsZSBjbGVhdmUsIGJvc3Mgb25lXHJcbiAgICAnUWl0YW5hIEZhbGxpbmcgUm9jayc6ICczQzk2JywgLy8gU21hbGwgZ3JvdW5kIEFvRSwgYm9zcyB0d29cclxuICAgICdRaXRhbmEgRmFsbGluZyBCb3VsZGVyJzogJzNDOTcnLCAvLyBMYXJnZSBncm91bmQgQW9FLCBib3NzIHR3b1xyXG4gICAgJ1FpdGFuYSBUb3dlcmZhbGwnOiAnM0M5OCcsIC8vIFBpbGxhciBjb2xsYXBzZSwgYm9zcyB0d29cclxuICAgICdRaXRhbmEgVmlwZXIgUG9pc29uIDInOiAnM0M5RScsIC8vIFN0YXRpb25hcnkgcG9pc29uIHB1ZGRsZXMsIGJvc3MgdGhyZWVcclxuICAgICdRaXRhbmEgQ29uZmVzc2lvbiBvZiBGYWl0aCAxJzogJzNDQTInLCAvLyBEYW5nZXJvdXMgbWlkZGxlIGR1cmluZyBzcHJlYWQgY2lyY2xlcywgYm9zcyB0aHJlZVxyXG4gICAgJ1FpdGFuYSBDb25mZXNzaW9uIG9mIEZhaXRoIDMnOiAnM0NBNicsIC8vIERhbmdlcm91cyBzaWRlcyBkdXJpbmcgc3RhY2sgbWFya2VyLCBib3NzIHRocmVlXHJcbiAgICAnUWl0YW5hIENvbmZlc3Npb24gb2YgRmFpdGggNCc6ICczQ0E3JywgLy8gRGFuZ2Vyb3VzIHNpZGVzIGR1cmluZyBzdGFjayBtYXJrZXIsIGJvc3MgdGhyZWVcclxuICAgICdRaXRhbmEgUm9ua2FuIExpZ2h0IDInOiAnM0Q2RCcsIC8vIFN0YXR1ZSBhdHRhY2ssIGJvc3Mgb25lXHJcbiAgICAnUWl0YW5hIFdyYXRoIG9mIHRoZSBSb25rYSc6ICczRTJDJywgLy8gU3RhdHVlIGxpbmUgYXR0YWNrIGZyb20gbWluaS1ib3NzZXMgYmVmb3JlIGZpcnN0IGJvc3NcclxuICAgICdRaXRhbmEgU2luc3BpdHRlcic6ICczRTM2JywgLy8gR29yaWxsYSBib3VsZGVyIHRvc3MgQW9FIGJlZm9yZSB0aGlyZCBib3NzXHJcbiAgICAnUWl0YW5hIEhvdW5kIG91dCBvZiBIZWF2ZW4nOiAnNDJCOCcsIC8vIFRldGhlciBleHRlbnNpb24gZmFpbHVyZSwgYm9zcyB0aHJlZTsgNDJCNyBpcyBjb3JyZWN0IGV4ZWN1dGlvblxyXG4gICAgJ1FpdGFuYSBSb25rYW4gQWJ5c3MnOiAnNDNFQicsIC8vIEdyb3VuZCBBb0UgZnJvbSBtaW5pLWJvc3NlcyBiZWZvcmUgZmlyc3QgYm9zc1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnUWl0YW5hIFZpcGVyIFBvaXNvbiAxJzogJzNDOUQnLCAvLyBBb0UgZnJvbSB0aGUgMDBBQiBwb2lzb24gaGVhZCBtYXJrZXIsIGJvc3MgdGhyZWVcclxuICAgICdRaXRhbmEgQ29uZmVzc2lvbiBvZiBGYWl0aCAyJzogJzNDQTMnLCAvLyBPdmVybGFwcGVkIGNpcmNsZXMgZmFpbHVyZSBvbiB0aGUgc3ByZWFkIGNpcmNsZXMgdmVyc2lvbiBvZiB0aGUgbWVjaGFuaWNcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRoZSBHcmFuZCBDb3Ntb3NcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUdyYW5kQ29zbW9zLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdDb3Ntb3MgSXJvbiBKdXN0aWNlJzogJzQ5MUYnLFxyXG4gICAgJ0Nvc21vcyBTbWl0ZSBPZiBSYWdlJzogJzQ5MjEnLFxyXG5cclxuICAgICdDb3Ntb3MgVHJpYnVsYXRpb24nOiAnNDlBNCcsXHJcbiAgICAnQ29zbW9zIERhcmsgU2hvY2snOiAnNDc2RicsXHJcbiAgICAnQ29zbW9zIFN3ZWVwJzogJzQ3NzAnLFxyXG4gICAgJ0Nvc21vcyBEZWVwIENsZWFuJzogJzQ3NzEnLFxyXG5cclxuICAgICdDb3Ntb3MgU2hhZG93IEJ1cnN0JzogJzQ5MjQnLFxyXG4gICAgJ0Nvc21vcyBCbG9vZHkgQ2FyZXNzJzogJzQ5MjcnLFxyXG4gICAgJ0Nvc21vcyBOZXBlbnRoaWMgUGx1bmdlJzogJzQ5MjgnLFxyXG4gICAgJ0Nvc21vcyBCcmV3aW5nIFN0b3JtJzogJzQ5MjknLFxyXG5cclxuICAgICdDb3Ntb3MgT2RlIFRvIEZhbGxlbiBQZXRhbHMnOiAnNDk1MCcsXHJcbiAgICAnQ29zbW9zIEZhciBXaW5kIEdyb3VuZCc6ICc0MjczJyxcclxuXHJcbiAgICAnQ29zbW9zIEZpcmUgQnJlYXRoJzogJzQ5MkInLFxyXG4gICAgJ0Nvc21vcyBSb25rYW4gRnJlZXplJzogJzQ5MkUnLFxyXG4gICAgJ0Nvc21vcyBPdmVycG93ZXInOiAnNDkyRCcsXHJcblxyXG4gICAgJ0Nvc21vcyBTY29yY2hpbmcgTGVmdCc6ICc0NzYzJyxcclxuICAgICdDb3Ntb3MgU2NvcmNoaW5nIFJpZ2h0JzogJzQ3NjInLFxyXG4gICAgJ0Nvc21vcyBPdGhlcndvcmRseSBIZWF0JzogJzQ3NUMnLFxyXG4gICAgJ0Nvc21vcyBGaXJlXFwncyBJcmUnOiAnNDc2MScsXHJcbiAgICAnQ29zbW9zIFBsdW1tZXQnOiAnNDc2NycsXHJcblxyXG4gICAgJ0Nvc21vcyBGaXJlXFwncyBEb21haW4gVGV0aGVyJzogJzQ3NUYnLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnQ29zbW9zIERhcmsgV2VsbCc6ICc0NzZEJyxcclxuICAgICdDb3Ntb3MgRmFyIFdpbmQgU3ByZWFkJzogJzQ3MjQnLFxyXG4gICAgJ0Nvc21vcyBCbGFjayBGbGFtZSc6ICc0NzVEJyxcclxuICAgICdDb3Ntb3MgRmlyZVxcJ3MgRG9tYWluJzogJzQ3NjAnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZVR3aW5uaW5nLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdUd2lubmluZyBBdXRvIENhbm5vbnMnOiAnNDNBOScsXHJcbiAgICAnVHdpbm5pbmcgSGVhdmUnOiAnM0RCOScsXHJcbiAgICAnVHdpbm5pbmcgMzIgVG9uemUgU3dpcGUnOiAnM0RCQicsXHJcbiAgICAnVHdpbm5pbmcgU2lkZXN3aXBlJzogJzNEQkYnLFxyXG4gICAgJ1R3aW5uaW5nIFdpbmQgU3BvdXQnOiAnM0RCRScsXHJcbiAgICAnVHdpbm5pbmcgU2hvY2snOiAnM0RGMScsXHJcbiAgICAnVHdpbm5pbmcgTGFzZXJibGFkZSc6ICczREVDJyxcclxuICAgICdUd2lubmluZyBWb3JwYWwgQmxhZGUnOiAnM0RDMicsXHJcbiAgICAnVHdpbm5pbmcgVGhyb3duIEZsYW1lcyc6ICczREMzJyxcclxuICAgICdUd2lubmluZyBNYWdpdGVrIFJheSc6ICczREYzJyxcclxuICAgICdUd2lubmluZyBIaWdoIEdyYXZpdHknOiAnM0RGQScsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnVHdpbm5pbmcgMTI4IFRvbnplIFN3aXBlJzogJzNEQkEnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogRGVhZCBJcm9uIDVBQjAgKGVhcnRoc2hha2VycywgYnV0IG9ubHkgaWYgeW91IHRha2UgdHdvPylcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5EZWx1YnJ1bVJlZ2luYWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0RlbHVicnVtIFNlZWtlciBNZXJjeSBGb3VyZm9sZCc6ICc1QjM0JywgLy8gRm91ciBnbG93aW5nIHN3b3JkIGhhbGYgcm9vbSBjbGVhdmVzXHJcbiAgICAnRGVsdWJydW0gU2Vla2VyIEJhbGVmdWwgU3dhdGhlJzogJzVBQjQnLCAvLyBHcm91bmQgYW9lIHRvIGVpdGhlciBzaWRlIG9mIGJvc3NcclxuICAgICdEZWx1YnJ1bSBTZWVrZXIgQmFsZWZ1bCBCbGFkZSc6ICc1QjI4JywgLy8gSGlkZSBiZWhpbmQgcGlsbGFycyBhdHRhY2tcclxuICAgICdEZWx1YnJ1bSBTZWVrZXIgSXJvbiBTcGxpdHRlciBCbHVlIDEnOiAnNUFBNCcsIC8vIEJsdWUgcmluZyBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bSBTZWVrZXIgSXJvbiBTcGxpdHRlciBCbHVlIDInOiAnNUFBNScsIC8vIEJsdWUgcmluZyBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bSBTZWVrZXIgSXJvbiBTcGxpdHRlciBCbHVlIDMnOiAnNUFBNicsIC8vIEJsdWUgcmluZyBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bSBTZWVrZXIgSXJvbiBTcGxpdHRlciBXaGl0ZSAxJzogJzVBQTcnLCAvLyBXaGl0ZSByaW5nIGV4cGxvc2lvblxyXG4gICAgJ0RlbHVicnVtIFNlZWtlciBJcm9uIFNwbGl0dGVyIFdoaXRlIDInOiAnNUFBOCcsIC8vIFdoaXRlIHJpbmcgZXhwbG9zaW9uXHJcbiAgICAnRGVsdWJydW0gU2Vla2VyIElyb24gU3BsaXR0ZXIgV2hpdGUgMyc6ICc1QUE5JywgLy8gV2hpdGUgcmluZyBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bSBTZWVrZXIgU2NvcmNoaW5nIFNoYWNrbGUnOiAnNUFBRScsIC8vIENoYWluIGRhbWFnZVxyXG4gICAgJ0RlbHVicnVtIFNlZWtlciBNZXJjaWZ1bCBCcmVlemUnOiAnNUFBQicsIC8vIFdhZmZsZSBjcmlzcy1jcm9zcyBmbG9vciBtYXJrZXJzXHJcbiAgICAnRGVsdWJydW0gU2Vla2VyIE1lcmNpZnVsIEJsb29tcyc6ICc1QUFEJywgLy8gUHVycGxlIGdyb3dpbmcgY2lyY2xlXHJcbiAgICAnRGVsdWJydW0gRGFodSBSaWdodC1TaWRlZCBTaG9ja3dhdmUnOiAnNTc2MScsIC8vIFJpZ2h0IGNpcmN1bGFyIGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtIERhaHUgTGVmdC1TaWRlZCBTaG9ja3dhdmUnOiAnNTc2MicsIC8vIExlZnQgY2lyY3VsYXIgY2xlYXZlXHJcbiAgICAnRGVsdWJydW0gRGFodSBGaXJlYnJlYXRoZSc6ICc1NzY1JywgLy8gQ29uYWwgYnJlYXRoXHJcbiAgICAnRGVsdWJydW0gRGFodSBGaXJlYnJlYXRoZSBSb3RhdGluZyc6ICc1NzVBJywgLy8gQ29uYWwgYnJlYXRoLCByb3RhdGluZ1xyXG4gICAgJ0RlbHVicnVtIERhaHUgSGVhZCBEb3duJzogJzU3NTYnLCAvLyBsaW5lIGFvZSBjaGFyZ2UgZnJvbSBNYXJjaG9zaWFzIGFkZFxyXG4gICAgJ0RlbHVicnVtIERhaHUgSHVudGVyXFwncyBDbGF3JzogJzU3NTcnLCAvLyBjaXJjdWxhciBncm91bmQgYW9lIGNlbnRlcmVkIG9uIE1hcmNob3NpYXMgYWRkXHJcbiAgICAnRGVsdWJydW0gRGFodSBGYWxsaW5nIFJvY2snOiAnNTc1QycsIC8vIGdyb3VuZCBhb2UgZnJvbSBSZXZlcmJlcmF0aW5nIFJvYXJcclxuICAgICdEZWx1YnJ1bSBEYWh1IEhvdCBDaGFyZ2UnOiAnNTc2NCcsIC8vIGRvdWJsZSBjaGFyZ2VcclxuICAgICdEZWx1YnJ1bSBEYWh1IFJpcHBlciBDbGF3JzogJzU3NUQnLCAvLyBmcm9udGFsIGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtIERhaHUgVGFpbCBTd2luZyc6ICc1NzVGJywgLy8gdGFpbCBzd2luZyA7KVxyXG4gICAgJ0RlbHVicnVtIEd1YXJkIFBhd24gT2ZmJzogJzU4MDYnLCAvLyBRdWVlbidzIFNvbGRpZXIgU2VjcmV0cyBSZXZlYWxlZCB0ZXRoZXJlZCBjbG9uZSBhb2VcclxuICAgICdEZWx1YnJ1bSBHdWFyZCBUdXJyZXRcXCdzIFRvdXIgMSc6ICc1ODBEJywgLy8gUXVlZW4ncyBHdW5uZXIgcmVmbGVjdGl2ZSB0dXJyZXQgc2hvdFxyXG4gICAgJ0RlbHVicnVtIEd1YXJkIFR1cnJldFxcJ3MgVG91ciAyJzogJzU4MEUnLCAvLyBRdWVlbidzIEd1bm5lciByZWZsZWN0aXZlIHR1cnJldCBzaG90XHJcbiAgICAnRGVsdWJydW0gR3VhcmQgVHVycmV0XFwncyBUb3VyIDMnOiAnNTgwRicsIC8vIFF1ZWVuJ3MgR3VubmVyIHJlZmxlY3RpdmUgdHVycmV0IHNob3RcclxuICAgICdEZWx1YnJ1bSBHdWFyZCBPcHRpbWFsIFBsYXkgU2hpZWxkJzogJzU3RjMnLCAvLyBRdWVlbidzIEtuaWdodCBzaGllbGQgZ2V0IHVuZGVyXHJcbiAgICAnRGVsdWJydW0gR3VhcmQgT3B0aW1hbCBQbGF5IFN3b3JkJzogJzU3RjInLCAvLyBRdWVlbidzIEtuaWdodCBzd29yZCBnZXQgb3V0XHJcbiAgICAnRGVsdWJydW0gR3VhcmQgQ291bnRlcnBsYXknOiAnNTdGNicsIC8vIEhpdHRpbmcgYWV0aGVyaWFsIHdhcmQgZGlyZWN0aW9uYWwgYmFycmllclxyXG4gICAgJ0RlbHVicnVtIFBoYW50b20gU3dpcmxpbmcgTWlhc21hIDEnOiAnNTdBOScsIC8vIEluaXRpYWwgcGhhbnRvbSBkb251dCBhb2UgZnJvbSBjaXJjbGVcclxuICAgICdEZWx1YnJ1bSBQaGFudG9tIFN3aXJsaW5nIE1pYXNtYSAyJzogJzU3QUEnLCAvLyBNb3ZpbmcgcGhhbnRvbSBkb251dCBhb2VzIGZyb20gY2lyY2xlXHJcbiAgICAnRGVsdWJydW0gUGhhbnRvbSBDcmVlcGluZyBNaWFzbWEnOiAnNTdBNScsIC8vIHBoYW50b20gbGluZSBhb2UgZnJvbSBzcXVhcmVcclxuICAgICdEZWx1YnJ1bSBQaGFudG9tIFZpbGUgV2F2ZSc6ICc1N0IxJywgLy8gcGhhbnRvbSBjb25hbCBhb2VcclxuICAgICdEZWx1YnJ1bSBBdm93ZWQgRnVyeSBPZiBCb3pqYSc6ICc1OTczJywgLy8gVHJpbml0eSBBdm93ZWQgQWxsZWdpYW50IEFyc2VuYWwgXCJvdXRcIlxyXG4gICAgJ0RlbHVicnVtIEF2b3dlZCBGbGFzaHZhbmUnOiAnNTk3MicsIC8vIFRyaW5pdHkgQXZvd2VkIEFsbGVnaWFudCBBcnNlbmFsIFwiZ2V0IGJlaGluZFwiXHJcbiAgICAnRGVsdWJydW0gQXZvd2VkIEluZmVybmFsIFNsYXNoJzogJzU5NzEnLCAvLyBUcmluaXR5IEF2b3dlZCBBbGxlZ2lhbnQgQXJzZW5hbCBcImdldCBmcm9udFwiXHJcbiAgICAnRGVsdWJydW0gQXZvd2VkIEZsYW1lcyBPZiBCb3pqYSc6ICc1OTY4JywgLy8gODAlIGZsb29yIGFvZSBiZWZvcmUgc2hpbW1lcmluZyBzaG90IHN3b3Jkc1xyXG4gICAgJ0RlbHVicnVtIEF2b3dlZCBHbGVhbWluZyBBcnJvdyc6ICc1OTc0JywgLy8gVHJpbml0eSBBdmF0YXIgbGluZSBhb2VzIGZyb20gb3V0c2lkZVxyXG4gICAgJ0RlbHVicnVtIFF1ZWVuIFRoZSBNZWFucyAxJzogJzU5QkInLCAvLyBUaGUgUXVlZW4ncyBCZWNrIGFuZCBDYWxsIGNyb3NzIGFvZSBmcm9tIGFkZHNcclxuICAgICdEZWx1YnJ1bSBRdWVlbiBUaGUgTWVhbnMgMic6ICc1OUJEJywgLy8gVGhlIFF1ZWVuJ3MgQmVjayBhbmQgQ2FsbCBjcm9zcyBhb2UgZnJvbSBhZGRzXHJcbiAgICAnRGVsdWJydW0gUXVlZW4gVGhlIEVuZCAxJzogJzU5QkEnLCAvLyBBbHNvIFRoZSBRdWVlbidzIEJlY2sgYW5kIENhbGwgY3Jvc3MgYW9lIGZyb20gYWRkc1xyXG4gICAgJ0RlbHVicnVtIFF1ZWVuIFRoZSBFbmQgMic6ICc1OUJDJywgLy8gQWxzbyBUaGUgUXVlZW4ncyBCZWNrIGFuZCBDYWxsIGNyb3NzIGFvZSBmcm9tIGFkZHNcclxuICAgICdEZWx1YnJ1bSBRdWVlbiBOb3J0aHN3YWluXFwncyBHbG93JzogJzU5QzQnLCAvLyBleHBhbmRpbmcgbGluZXMgd2l0aCBleHBsb3Npb24gaW50ZXJzZWN0aW9uc1xyXG4gICAgJ0RlbHVicnVtIFF1ZWVuIEp1ZGdtZW50IEJsYWRlIExlZnQnOiAnNUI4MycsIC8vIGRhc2ggYWNyb3NzIHJvb20gd2l0aCBsZWZ0IGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtIFF1ZWVuIEp1ZGdtZW50IEJsYWRlIFJpZ2h0JzogJzVCODMnLCAvLyBkYXNoIGFjcm9zcyByb29tIHdpdGggcmlnaHQgY2xlYXZlXHJcbiAgICAnRGVsdWJydW0gUXVlZW4gUXVlZW5cXCdzIEp1c3RpY2UnOiAnNTlCRicsIC8vIGZhaWxpbmcgdG8gd2FsayB0aGUgcmlnaHQgbnVtYmVyIG9mIHNxdWFyZXNcclxuICAgICdEZWx1YnJ1bSBRdWVlbiBUdXJyZXRcXCdzIFRvdXIgMSc6ICc1OUUwJywgLy8gcmVmbGVjdGl2ZSB0dXJyZXQgc2hvdCBkdXJpbmcgUXVlZW5cclxuICAgICdEZWx1YnJ1bSBRdWVlbiBUdXJyZXRcXCdzIFRvdXIgMic6ICc1OUUxJywgLy8gcmVmbGVjdGl2ZSB0dXJyZXQgc2hvdCBkdXJpbmcgUXVlZW5cclxuICAgICdEZWx1YnJ1bSBRdWVlbiBUdXJyZXRcXCdzIFRvdXIgMyc6ICc1OUUyJywgLy8gcmVmbGVjdGl2ZSB0dXJyZXQgc2hvdCBkdXJpbmcgUXVlZW5cclxuICAgICdEZWx1YnJ1bSBRdWVlbiBQYXduIE9mZic6ICc1OURBJywgLy8gU2VjcmV0cyBSZXZlYWxlZCB0ZXRoZXJlZCBjbG9uZSBhb2UgZHVyaW5nIFF1ZWVuXHJcbiAgICAnRGVsdWJydW0gUXVlZW4gT3B0aW1hbCBQbGF5IFNoaWVsZCc6ICc1OUNFJywgLy8gUXVlZW4ncyBLbmlnaHQgc2hpZWxkIGdldCB1bmRlciBkdXJpbmcgUXVlZW5cclxuICAgICdEZWx1YnJ1bSBRdWVlbiBPcHRpbWFsIFBsYXkgU3dvcmQnOiAnNTlDQycsIC8vIFF1ZWVuJ3MgS25pZ2h0IHN3b3JkIGdldCBvdXQgZHVyaW5nIFF1ZWVuXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRGVsdWJydW0gSGlkZGVuIFRyYXAgTWFzc2l2ZSBFeHBsb3Npb24nOiAnNUE2RScsIC8vIGV4cGxvc2lvbiB0cmFwXHJcbiAgICAnRGVsdWJydW0gSGlkZGVuIFRyYXAgUG9pc29uIFRyYXAnOiAnNUE2RicsIC8vIHBvaXNvbiB0cmFwXHJcbiAgICAnRGVsdWJydW0gQXZvd2VkIEhlYXQgU2hvY2snOiAnNTk1RScsIC8vIHRvbyBtdWNoIGhlYXQgb3IgZmFpbGluZyB0byByZWd1bGF0ZSB0ZW1wZXJhdHVyZVxyXG4gICAgJ0RlbHVicnVtIEF2b3dlZCBDb2xkIFNob2NrJzogJzU5NUYnLCAvLyB0b28gbXVjaCBjb2xkIG9yIGZhaWxpbmcgdG8gcmVndWxhdGUgdGVtcGVyYXR1cmVcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgJ0RlbHVicnVtIERhaHUgSGVhdCBCcmVhdGgnOiAnNTc2NicsIC8vIHRhbmsgY2xlYXZlXHJcbiAgICAnRGVsdWJydW0gQXZvd2VkIFdyYXRoIE9mIEJvemphJzogJzU5NzUnLCAvLyB0YW5rIGNsZWF2ZVxyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnRGVsdWJydW0gU2Vla2VyIE1lcmNpZnVsIE1vb24nOiAnMjYyJywgLy8gXCJQZXRyaWZpY2F0aW9uXCIgZnJvbSBBZXRoZXJpYWwgT3JiIGxvb2thd2F5XHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBBdCBsZWFzdCBkdXJpbmcgVGhlIFF1ZWVuLCB0aGVzZSBhYmlsaXR5IGlkcyBjYW4gYmUgb3JkZXJlZCBkaWZmZXJlbnRseSxcclxuICAgICAgLy8gYW5kIHRoZSBmaXJzdCBleHBsb3Npb24gXCJoaXRzXCIgZXZlcnlvbmUsIGFsdGhvdWdoIHdpdGggXCIxQlwiIGZsYWdzLlxyXG4gICAgICBpZDogJ0RlbHVicnVtIExvdHMgQ2FzdCcsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiBbJzU2NUEnLCAnNTY1QicsICc1N0ZEJywgJzU3RkUnLCAnNUI4NicsICc1Qjg3JywgJzU5RDInLCAnNUQ5MyddLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLmZsYWdzLnNsaWNlKC0yKSA9PT0gJzAzJyxcclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmFiaWxpdHkgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBEYWh1IDU3NzYgU3BpdCBGbGFtZSBzaG91bGQgYWx3YXlzIGhpdCBhIE1hcmNob3NpYXNcclxuLy8gVE9ETzogaGl0dGluZyBwaGFudG9tIHdpdGggaWNlIHNwaWtlcyB3aXRoIGFueXRoaW5nIGJ1dCBkaXNwZWw/XHJcbi8vIFRPRE86IGZhaWxpbmcgaWN5L2ZpZXJ5IHBvcnRlbnQgKGd1YXJkIGFuZCBxdWVlbilcclxuLy8gICAgICAgYDE4OlB5cmV0aWMgRG9UIFRpY2sgb24gJHtuYW1lfSBmb3IgJHtkYW1hZ2V9IGRhbWFnZS5gXHJcbi8vIFRPRE86IFdpbmRzIE9mIEZhdGUgLyBXZWlnaHQgT2YgRm9ydHVuZT9cclxuLy8gVE9ETzogVHVycmV0J3MgVG91cj9cclxuLy8gZ2VuZXJhbCB0cmFwczogZXhwbG9zaW9uOiA1QTcxLCBwb2lzb24gdHJhcDogNUE3MiwgbWluaTogNUE3M1xyXG4vLyBkdWVsIHRyYXBzOiBtaW5pOiA1N0ExLCBpY2U6IDU3OUYsIHRvYWQ6IDU3QTBcclxuLy8gVE9ETzogdGFraW5nIG1hbmEgZmxhbWUgd2l0aG91dCByZWZsZWN0XHJcbi8vIFRPRE86IHRha2luZyBNYWVsc3Ryb20ncyBCb2x0IHdpdGhvdXQgbGlnaHRuaW5nIGJ1ZmZcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5EZWx1YnJ1bVJlZ2luYWVTYXZhZ2UsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBTbGltZXMgSGVsbGlzaCBTbGFzaCc6ICc1N0VBJywgLy8gQm96amFuIFNvbGRpZXIgY2xlYXZlXHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIFNsaW1lcyBWaXNjb3VzIFJ1cHR1cmUnOiAnNTAxNicsIC8vIEZ1bGx5IG1lcmdlZCB2aXNjb3VzIHNsaW1lIGFvZVxyXG5cclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgR29sZW1zIERlbW9saXNoJzogJzU4ODAnLCAvLyBpbnRlcnJ1cHRpYmxlIFJ1aW5zIEdvbGVtIGNhc3RcclxuXHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIEJhbGVmdWwgU3dhdGhlJzogJzVBRDEnLCAvLyBHcm91bmQgYW9lIHRvIGVpdGhlciBzaWRlIG9mIGJvc3NcclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgQmFsZWZ1bCBCbGFkZSc6ICc1QjJBJywgLy8gSGlkZSBiZWhpbmQgcGlsbGFycyBhdHRhY2tcclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgU2NvcmNoaW5nIFNoYWNrbGUnOiAnNUFDQicsIC8vIENoYWluc1xyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBNZXJjeSBGb3VyZm9sZCAxJzogJzVCOTQnLCAvLyBGb3VyIGdsb3dpbmcgc3dvcmQgaGFsZiByb29tIGNsZWF2ZXNcclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgTWVyY3kgRm91cmZvbGQgMic6ICc1QUI5JywgLy8gRm91ciBnbG93aW5nIHN3b3JkIGhhbGYgcm9vbSBjbGVhdmVzXHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIE1lcmN5IEZvdXJmb2xkIDMnOiAnNUFCQScsIC8vIEZvdXIgZ2xvd2luZyBzd29yZCBoYWxmIHJvb20gY2xlYXZlc1xyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBNZXJjeSBGb3VyZm9sZCA0JzogJzVBQkInLCAvLyBGb3VyIGdsb3dpbmcgc3dvcmQgaGFsZiByb29tIGNsZWF2ZXNcclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgTWVyY3kgRm91cmZvbGQgNSc6ICc1QUJDJywgLy8gRm91ciBnbG93aW5nIHN3b3JkIGhhbGYgcm9vbSBjbGVhdmVzXHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIE1lcmNpZnVsIEJyZWV6ZSc6ICc1QUM4JywgLy8gV2FmZmxlIGNyaXNzLWNyb3NzIGZsb29yIG1hcmtlcnNcclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgQmFsZWZ1bCBDb21ldCc6ICc1QUQ3JywgLy8gQ2xvbmUgbWV0ZW9yIGRyb3BwaW5nIGJlZm9yZSBjaGFyZ2VzXHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIEJhbGVmdWwgRmlyZXN0b3JtJzogJzVBRDgnLCAvLyBDbG9uZSBjaGFyZ2UgYWZ0ZXIgQmFsZWZ1bCBDb21ldFxyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBJcm9uIFJvc2UnOiAnNUFEOScsIC8vIENsb25lIGxpbmUgYW9lc1xyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBJcm9uIFNwbGl0dGVyIEJsdWUgMSc6ICc1QUMxJywgLy8gQmx1ZSByaW4gZyBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgSXJvbiBTcGxpdHRlciBCbHVlIDInOiAnNUFDMicsIC8vIEJsdWUgcmluZyBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgSXJvbiBTcGxpdHRlciBCbHVlIDMnOiAnNUFDMycsIC8vIEJsdWUgcmluZyBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgSXJvbiBTcGxpdHRlciBXaGl0ZSAxJzogJzVBQzQnLCAvLyBXaGl0ZSByaW5nIGV4cGxvc2lvblxyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBJcm9uIFNwbGl0dGVyIFdoaXRlIDInOiAnNUFDNScsIC8vIFdoaXRlIHJpbmcgZXhwbG9zaW9uXHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIElyb24gU3BsaXR0ZXIgV2hpdGUgMyc6ICc1QUM2JywgLy8gV2hpdGUgcmluZyBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgQWN0IE9mIE1lcmN5JzogJzVBQ0YnLCAvLyBjcm9zcy1zaGFwZWQgbGluZSBhb2VzXHJcblxyXG4gICAgJ0RlbHVicnVtU2F2IERhaHUgUmlnaHQtU2lkZWQgU2hvY2t3YXZlIDEnOiAnNTc3MCcsIC8vIFJpZ2h0IGNpcmN1bGFyIGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtU2F2IERhaHUgUmlnaHQtU2lkZWQgU2hvY2t3YXZlIDInOiAnNTc3MicsIC8vIFJpZ2h0IGNpcmN1bGFyIGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtU2F2IERhaHUgTGVmdC1TaWRlZCBTaG9ja3dhdmUgMSc6ICc1NzZGJywgLy8gTGVmdCBjaXJjdWxhciBjbGVhdmVcclxuICAgICdEZWx1YnJ1bVNhdiBEYWh1IExlZnQtU2lkZWQgU2hvY2t3YXZlIDInOiAnNTc3MScsIC8vIExlZnQgY2lyY3VsYXIgY2xlYXZlXHJcbiAgICAnRGVsdWJydW1TYXYgRGFodSBGaXJlYnJlYXRoZSc6ICc1Nzc0JywgLy8gQ29uYWwgYnJlYXRoXHJcbiAgICAnRGVsdWJydW1TYXYgRGFodSBGaXJlYnJlYXRoZSBSb3RhdGluZyc6ICc1NzZDJywgLy8gQ29uYWwgYnJlYXRoLCByb3RhdGluZ1xyXG4gICAgJ0RlbHVicnVtU2F2IERhaHUgSGVhZCBEb3duJzogJzU3NjgnLCAvLyBsaW5lIGFvZSBjaGFyZ2UgZnJvbSBNYXJjaG9zaWFzIGFkZFxyXG4gICAgJ0RlbHVicnVtU2F2IERhaHUgSHVudGVyXFwncyBDbGF3JzogJzU3NjknLCAvLyBjaXJjdWxhciBncm91bmQgYW9lIGNlbnRlcmVkIG9uIE1hcmNob3NpYXMgYWRkXHJcbiAgICAnRGVsdWJydW1TYXYgRGFodSBGYWxsaW5nIFJvY2snOiAnNTc2RScsIC8vIGdyb3VuZCBhb2UgZnJvbSBSZXZlcmJlcmF0aW5nIFJvYXJcclxuICAgICdEZWx1YnJ1bVNhdiBEYWh1IEhvdCBDaGFyZ2UnOiAnNTc3MycsIC8vIGRvdWJsZSBjaGFyZ2VcclxuXHJcbiAgICAnRGVsdWJydW1TYXYgRHVlbCBNYXNzaXZlIEV4cGxvc2lvbic6ICc1NzlFJywgLy8gYm9tYnMgYmVpbmcgY2xlYXJlZFxyXG4gICAgJ0RlbHVicnVtU2F2IER1ZWwgVmljaW91cyBTd2lwZSc6ICc1Nzk3JywgLy8gY2lyY3VsYXIgYW9lIGFyb3VuZCBib3NzXHJcbiAgICAnRGVsdWJydW1TYXYgRHVlbCBGb2N1c2VkIFRyZW1vciAxJzogJzU3OEYnLCAvLyBzcXVhcmUgZmxvb3IgYW9lc1xyXG4gICAgJ0RlbHVicnVtU2F2IER1ZWwgRm9jdXNlZCBUcmVtb3IgMic6ICc1NzkxJywgLy8gc3F1YXJlIGZsb29yIGFvZXNcclxuICAgICdEZWx1YnJ1bVNhdiBEdWVsIERldm91cic6ICc1Nzg5JywgLy8gY29uYWwgYW9lIGFmdGVyIHdpdGhlcmluZyBjdXJzZVxyXG4gICAgJ0RlbHVicnVtU2F2IER1ZWwgRmxhaWxpbmcgU3RyaWtlIDEnOiAnNTc4QycsIC8vIGluaXRpYWwgcm90YXRpbmcgY2xlYXZlXHJcbiAgICAnRGVsdWJydW1TYXYgRHVlbCBGbGFpbGluZyBTdHJpa2UgMic6ICc1NzhEJywgLy8gcm90YXRpbmcgY2xlYXZlc1xyXG5cclxuICAgICdEZWx1YnJ1bVNhdiBHdWFyZCBPcHRpbWFsIE9mZmVuc2l2ZSBTd29yZCc6ICc1ODE5JywgLy8gbWlkZGxlIGV4cGxvc2lvblxyXG4gICAgJ0RlbHVicnVtU2F2IEd1YXJkIE9wdGltYWwgT2ZmZW5zaXZlIFNoaWVsZCc6ICc1ODFBJywgLy8gbWlkZGxlIGV4cGxvc2lvblxyXG4gICAgJ0RlbHVicnVtU2F2IEd1YXJkIE9wdGltYWwgUGxheSBTd29yZCc6ICc1ODE2JywgLy8gT3B0aW1hbCBQbGF5IFN3b3JkIFwiZ2V0IG91dFwiXHJcbiAgICAnRGVsdWJydW1TYXYgR3VhcmQgT3B0aW1hbCBQbGF5IFNoaWVsZCc6ICc1ODE3JywgLy8gT3B0aW1hbCBwbGF5IHNoaWVsZCBcImdldCBpblwiXHJcbiAgICAnRGVsdWJydW1TYXYgR3VhcmQgT3B0aW1hbCBQbGF5IENsZWF2ZSc6ICc1ODE4JywgLy8gT3B0aW1hbCBQbGF5IGNsZWF2ZXMgZm9yIHN3b3JkL3NoaWVsZFxyXG4gICAgJ0RlbHVicnVtU2F2IEd1YXJkIFVubHVja3kgTG90JzogJzU4MUQnLCAvLyBRdWVlbidzIEtuaWdodCBvcmIgZXhwbG9zaW9uXHJcbiAgICAnRGVsdWJydW1TYXYgR3VhcmQgQnVybiAxJzogJzU4M0QnLCAvLyBzbWFsbCBmaXJlIGFkZHNcclxuICAgICdEZWx1YnJ1bVNhdiBHdWFyZCBCdXJuIDInOiAnNTgzRScsIC8vIGxhcmdlIGZpcmUgYWRkc1xyXG4gICAgJ0RlbHVicnVtU2F2IEd1YXJkIFBhd24gT2ZmJzogJzU4M0EnLCAvLyBRdWVlbidzIFNvbGRpZXIgU2VjcmV0cyBSZXZlYWxlZCB0ZXRoZXJlZCBjbG9uZSBhb2VcclxuICAgICdEZWx1YnJ1bVNhdiBHdWFyZCBUdXJyZXRcXCdzIFRvdXIgTm9ybWFsIDEnOiAnNTg0NycsIC8vIFwibm9ybWFsIG1vZGVcIiB0dXJyZXRzLCBpbml0aWFsIGxpbmVzIDFcclxuICAgICdEZWx1YnJ1bVNhdiBHdWFyZCBUdXJyZXRcXCdzIFRvdXIgTm9ybWFsIDInOiAnNTg0OCcsIC8vIFwibm9ybWFsIG1vZGVcIiB0dXJyZXRzLCBpbml0aWFsIGxpbmVzIDJcclxuICAgICdEZWx1YnJ1bVNhdiBHdWFyZCBUdXJyZXRcXCdzIFRvdXIgTm9ybWFsIDMnOiAnNTg0OScsIC8vIFwibm9ybWFsIG1vZGVcIiB0dXJyZXRzLCBzZWNvbmQgbGluZXNcclxuICAgICdEZWx1YnJ1bVNhdiBHdWFyZCBDb3VudGVycGxheSc6ICc1OEY1JywgLy8gSGl0dGluZyBhZXRoZXJpYWwgd2FyZCBkaXJlY3Rpb25hbCBiYXJyaWVyXHJcblxyXG4gICAgJ0RlbHVicnVtU2F2IFBoYW50b20gU3dpcmxpbmcgTWlhc21hIDEnOiAnNTdCOCcsIC8vIEluaXRpYWwgcGhhbnRvbSBkb251dCBhb2VcclxuICAgICdEZWx1YnJ1bVNhdiBQaGFudG9tIFN3aXJsaW5nIE1pYXNtYSAyJzogJzU3QjknLCAvLyBNb3ZpbmcgcGhhbnRvbSBkb251dCBhb2VzXHJcbiAgICAnRGVsdWJydW1TYXYgUGhhbnRvbSBDcmVlcGluZyBNaWFzbWEgMSc6ICc1N0I0JywgLy8gSW5pdGlhbCBwaGFudG9tIGxpbmUgYW9lXHJcbiAgICAnRGVsdWJydW1TYXYgUGhhbnRvbSBDcmVlcGluZyBNaWFzbWEgMic6ICc1N0I1JywgLy8gTGF0ZXIgcGhhbnRvbSBsaW5lIGFvZVxyXG4gICAgJ0RlbHVicnVtU2F2IFBoYW50b20gTGluZ2VyaW5nIE1pYXNtYSAxJzogJzU3QjYnLCAvLyBJbml0aWFsIHBoYW50b20gY2lyY2xlIGFvZVxyXG4gICAgJ0RlbHVicnVtU2F2IFBoYW50b20gTGluZ2VyaW5nIE1pYXNtYSAyJzogJzU3QjcnLCAvLyBNb3ZpbmcgcGhhbnRvbSBjaXJjbGUgYW9lXHJcbiAgICAnRGVsdWJydW1TYXYgUGhhbnRvbSBWaWxlIFdhdmUnOiAnNTdCRicsIC8vIHBoYW50b20gY29uYWwgYW9lXHJcblxyXG4gICAgJ0RlbHVicnVtU2F2IEF2b3dlZCBGdXJ5IE9mIEJvemphJzogJzU5NEMnLCAvLyBUcmluaXR5IEF2b3dlZCBBbGxlZ2lhbnQgQXJzZW5hbCBcIm91dFwiXHJcbiAgICAnRGVsdWJydW1TYXYgQXZvd2VkIEZsYXNodmFuZSc6ICc1OTRCJywgLy8gVHJpbml0eSBBdm93ZWQgQWxsZWdpYW50IEFyc2VuYWwgXCJnZXQgYmVoaW5kXCJcclxuICAgICdEZWx1YnJ1bVNhdiBBdm93ZWQgSW5mZXJuYWwgU2xhc2gnOiAnNTk0QScsIC8vIFRyaW5pdHkgQXZvd2VkIEFsbGVnaWFudCBBcnNlbmFsIFwiZ2V0IGZyb250XCJcclxuICAgICdEZWx1YnJ1bVNhdiBBdm93ZWQgRmxhbWVzIE9mIEJvemphJzogJzU5MzknLCAvLyA4MCUgZmxvb3IgYW9lIGJlZm9yZSBzaGltbWVyaW5nIHNob3Qgc3dvcmRzXHJcbiAgICAnRGVsdWJydW1TYXYgQXZvd2VkIEdsZWFtaW5nIEFycm93JzogJzU5NEQnLCAvLyBUcmluaXR5IEF2YXRhciBsaW5lIGFvZXMgZnJvbSBvdXRzaWRlXHJcblxyXG4gICAgJ0RlbHVicnVtU2F2IExvcmQgV2hhY2snOiAnNTdEMCcsIC8vIGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtU2F2IExvcmQgRGV2YXN0YXRpbmcgQm9sdCAxJzogJzU3QzUnLCAvLyBsaWdodG5pbmcgcmluZ3NcclxuICAgICdEZWx1YnJ1bVNhdiBMb3JkIERldmFzdGF0aW5nIEJvbHQgMic6ICc1N0M2JywgLy8gbGlnaHRuaW5nIHJpbmdzXHJcbiAgICAnRGVsdWJydW1TYXYgTG9yZCBFbGVjdHJvY3V0aW9uJzogJzU3Q0MnLCAvLyByYW5kb20gY2lyY2xlIGFvZXNcclxuICAgICdEZWx1YnJ1bVNhdiBMb3JkIFJhcGlkIEJvbHRzJzogJzU3QzMnLCAvLyBkcm9wcGVkIGxpZ2h0bmluZyBhb2VzXHJcbiAgICAnRGVsdWJydW1TYXYgTG9yZCAxMTExLVRvbnplIFN3aW5nJzogJzU3RDgnLCAvLyB2ZXJ5IGxhcmdlIFwiZ2V0IG91dFwiIHN3aW5nXHJcbiAgICAnRGVsdWJydW1TYXYgTG9yZCBNb25rIEF0dGFjayc6ICc1NUE2JywgLy8gTW9uayBhZGQgYXV0by1hdHRhY2tcclxuXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gTm9ydGhzd2FpblxcJ3MgR2xvdyc6ICc1OUY0JywgLy8gZXhwYW5kaW5nIGxpbmVzIHdpdGggZXhwbG9zaW9uIGludGVyc2VjdGlvbnNcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBUaGUgTWVhbnMgMSc6ICc1OUU3JywgLy8gVGhlIFF1ZWVuJ3MgQmVjayBhbmQgQ2FsbCBjcm9zcyBhb2UgZnJvbSBhZGRzXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gVGhlIE1lYW5zIDInOiAnNTlFQScsIC8vIFRoZSBRdWVlbidzIEJlY2sgYW5kIENhbGwgY3Jvc3MgYW9lIGZyb20gYWRkc1xyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIFRoZSBFbmQgMSc6ICc1OUU4JywgLy8gQWxzbyBUaGUgUXVlZW4ncyBCZWNrIGFuZCBDYWxsIGNyb3NzIGFvZSBmcm9tIGFkZHNcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBUaGUgRW5kIDInOiAnNTlFOScsIC8vIEFsc28gVGhlIFF1ZWVuJ3MgQmVjayBhbmQgQ2FsbCBjcm9zcyBhb2UgZnJvbSBhZGRzXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gT3B0aW1hbCBPZmZlbnNpdmUgU3dvcmQnOiAnNUEwMicsIC8vIG1pZGRsZSBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBPcHRpbWFsIE9mZmVuc2l2ZSBTaGllbGQnOiAnNUEwMycsIC8vIG1pZGRsZSBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBKdWRnbWVudCBCbGFkZSBMZWZ0IDEnOiAnNTlGMicsIC8vIGRhc2ggYWNyb3NzIHJvb20gd2l0aCBsZWZ0IGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIEp1ZGdtZW50IEJsYWRlIExlZnQgMic6ICc1Qjg1JywgLy8gZGFzaCBhY3Jvc3Mgcm9vbSB3aXRoIGxlZnQgY2xlYXZlXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gSnVkZ21lbnQgQmxhZGUgUmlnaHQgMSc6ICc1OUYxJywgLy8gZGFzaCBhY3Jvc3Mgcm9vbSB3aXRoIHJpZ2h0IGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIEp1ZGdtZW50IEJsYWRlIFJpZ2h0IDInOiAnNUI4NCcsIC8vIGRhc2ggYWNyb3NzIHJvb20gd2l0aCByaWdodCBjbGVhdmVcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBQYXduIE9mZic6ICc1QTFEJywgLy8gUXVlZW4ncyBTb2xkaWVyIFNlY3JldHMgUmV2ZWFsZWQgdGV0aGVyZWQgY2xvbmUgYW9lXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gT3B0aW1hbCBQbGF5IFN3b3JkJzogJzU5RkYnLCAvLyBPcHRpbWFsIFBsYXkgU3dvcmQgXCJnZXQgb3V0XCJcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBPcHRpbWFsIFBsYXkgU2hpZWxkJzogJzVBMDAnLCAvLyBPcHRpbWFsIHBsYXkgc2hpZWxkIFwiZ2V0IGluXCJcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBPcHRpbWFsIFBsYXkgQ2xlYXZlJzogJzVBMDEnLCAvLyBPcHRpbWFsIFBsYXkgY2xlYXZlcyBmb3Igc3dvcmQvc2hpZWxkXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gVHVycmV0XFwncyBUb3VyIE5vcm1hbCAxJzogJzVBMjgnLCAvLyBcIm5vcm1hbCBtb2RlXCIgdHVycmV0cywgaW5pdGlhbCBsaW5lcyAxXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gVHVycmV0XFwncyBUb3VyIE5vcm1hbCAyJzogJzVBMkEnLCAvLyBcIm5vcm1hbCBtb2RlXCIgdHVycmV0cywgaW5pdGlhbCBsaW5lcyAyXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gVHVycmV0XFwncyBUb3VyIE5vcm1hbCAzJzogJzVBMjknLCAvLyBcIm5vcm1hbCBtb2RlXCIgdHVycmV0cywgc2Vjb25kIGxpbmVzXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRGVsdWJydW1TYXYgQXZvd2VkIEhlYXQgU2hvY2snOiAnNTkyNycsIC8vIHRvbyBtdWNoIGhlYXQgb3IgZmFpbGluZyB0byByZWd1bGF0ZSB0ZW1wZXJhdHVyZVxyXG4gICAgJ0RlbHVicnVtU2F2IEF2b3dlZCBDb2xkIFNob2NrJzogJzU5MjgnLCAvLyB0b28gbXVjaCBjb2xkIG9yIGZhaWxpbmcgdG8gcmVndWxhdGUgdGVtcGVyYXR1cmVcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBRdWVlblxcJ3MgSnVzdGljZSc6ICc1OUVCJywgLy8gZmFpbGluZyB0byB3YWxrIHRoZSByaWdodCBudW1iZXIgb2Ygc3F1YXJlc1xyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIEd1bm5oaWxkclxcJ3MgQmxhZGVzJzogJzVCMjInLCAvLyBub3QgYmVpbmcgaW4gdGhlIGNoZXNzIGJsdWUgc2FmZSBzcXVhcmVcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBVbmx1Y2t5IExvdCc6ICc1NUI2JywgLy8gbGlnaHRuaW5nIG9yYiBhdHRhY2tcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBQaGFudG9tIEJhbGVmdWwgT25zbGF1Z2h0JzogJzVBRDYnLCAvLyBzb2xvIHRhbmsgY2xlYXZlXHJcbiAgICAnRGVsdWJydW1TYXYgTG9yZCBGb2UgU3BsaXR0ZXInOiAnNTdENycsIC8vIHRhbmsgY2xlYXZlXHJcbiAgfSxcclxuICBnYWluc0VmZmVjdFdhcm46IHtcclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgTWVyY2lmdWwgTW9vbic6ICcyNjInLCAvLyBcIlBldHJpZmljYXRpb25cIiBmcm9tIEFldGhlcmlhbCBPcmIgbG9va2F3YXlcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIFRoZXNlIGFiaWxpdHkgaWRzIGNhbiBiZSBvcmRlcmVkIGRpZmZlcmVudGx5IGFuZCBcImhpdFwiIHBlb3BsZSB3aGVuIGxldml0YXRpbmcuXHJcbiAgICAgIGlkOiAnRGVsdWJydW1TYXYgR3VhcmQgTG90cyBDYXN0JyxcclxuICAgICAgZGFtYWdlUmVnZXg6IFsnNTgyNycsICc1ODI4JywgJzVCNkMnLCAnNUI2RCcsICc1QkI2JywgJzVCQjcnLCAnNUI4OCcsICc1Qjg5J10sXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IGUuZmxhZ3Muc2xpY2UoLTIpID09PSAnMDMnLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdEZWx1YnJ1bVNhdiBHb2xlbSBDb21wYWN0aW9uJyxcclxuICAgICAgYWJpbGl0eVJlZ2V4OiAnNTc0NicsXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGZ1bGxUZXh0OiBgJHttYXRjaGVzLnNvdXJjZX06ICR7bWF0Y2hlcy5hYmlsaXR5fWAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRGVsdWJydW1TYXYgU2xpbWUgU2FuZ3VpbmUgRnVzaW9uJyxcclxuICAgICAgYWJpbGl0eVJlZ2V4OiAnNTU0RCcsXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGZ1bGxUZXh0OiBgJHttYXRjaGVzLnNvdXJjZX06ICR7bWF0Y2hlcy5hYmlsaXR5fWAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNHYXRlUmVzdXJyZWN0aW9uLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFMU4gRWRlblxcJ3MgVGh1bmRlciBJSUknOiAnNDRFRCcsXHJcbiAgICAnRTFOIEVkZW5cXCdzIEJsaXp6YXJkIElJSSc6ICc0NEVDJyxcclxuICAgICdFMU4gUHVyZSBCZWFtJzogJzNEOUUnLFxyXG4gICAgJ0UxTiBQYXJhZGlzZSBMb3N0JzogJzNEQTAnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0UxTiBFZGVuXFwncyBGbGFyZSc6ICczRDk3JyxcclxuICAgICdFMU4gUHVyZSBMaWdodCc6ICczREEzJyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICAvLyBUaGluZ3MgdGhhdCBzaG91bGQgb25seSBoaXQgb25lIHBlcnNvbi5cclxuICAgIHtcclxuICAgICAgaWQ6ICdFMU4gRmlyZSBJSUknLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzQ0RUInLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0UxTiBUYW5rIExhc2VycycsXHJcbiAgICAgIC8vIFZpY2UgT2YgVmFuaXR5XHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNDRFNycsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IGUudHlwZSAhPT0gJzE1JyxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTFOIERQUyBQdWRkbGVzJyxcclxuICAgICAgLy8gVmljZSBPZiBBcGF0aHlcclxuICAgICAgZGFtYWdlUmVnZXg6ICc0NEU4JyxcclxuICAgICAgY29uZGl0aW9uOiAoZSkgPT4gZS50eXBlICE9PSAnMTUnLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRPRE86IGZhaWxpbmcgdG8gaW50ZXJydXB0IE1hbmEgQm9vc3QgKDNEOEQpXHJcbi8vIFRPRE86IGZhaWxpbmcgdG8gcGFzcyBoZWFsZXIgZGVidWZmP1xyXG4vLyBUT0RPOiB3aGF0IGhhcHBlbnMgaWYgeW91IGRvbid0IGtpbGwgYSBtZXRlb3IgZHVyaW5nIGZvdXIgb3Jicz9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zR2F0ZVJlc3VycmVjdGlvblNhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTFTIEVkZW5cXCdzIFRodW5kZXIgSUlJJzogJzQ0RjcnLFxyXG4gICAgJ0UxUyBFZGVuXFwncyBCbGl6emFyZCBJSUknOiAnNDRGNicsXHJcbiAgICAnRTFTIEVkZW5cXCdzIFJlZ2FpbmVkIEJsaXp6YXJkIElJSSc6ICc0NEZBJyxcclxuICAgICdFMVMgUHVyZSBCZWFtIFRyaWRlbnQgMSc6ICczRDgzJyxcclxuICAgICdFMVMgUHVyZSBCZWFtIFRyaWRlbnQgMic6ICczRDg0JyxcclxuICAgICdFMVMgUGFyYWRpc2UgTG9zdCc6ICczRDg3JyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdFMVMgRWRlblxcJ3MgRmxhcmUnOiAnM0Q3MycsXHJcbiAgICAnRTFTIFB1cmUgTGlnaHQnOiAnM0Q4QScsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAgLy8gVGhpbmdzIHRoYXQgc2hvdWxkIG9ubHkgaGl0IG9uZSBwZXJzb24uXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTFTIEZpcmUvVGh1bmRlciBJSUknLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzQ0RkInLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0UxUyBQdXJlIEJlYW0gU2luZ2xlJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICczRDgxJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSkgPT4gZS50eXBlICE9PSAnMTUnLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMVMgVGFuayBMYXNlcnMnLFxyXG4gICAgICAvLyBWaWNlIE9mIFZhbml0eVxyXG4gICAgICBkYW1hZ2VSZWdleDogJzQ0RjEnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0UxUyBEUFMgUHVkZGxlcycsXHJcbiAgICAgIC8vIFZpY2UgT2YgQXBhdGh5XHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNDRGMicsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IGUudHlwZSAhPT0gJzE1JyxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBzaGFkb3dleWUgZmFpbHVyZSAodG9wIGxpbmUgZmFpbCwgYm90dG9tIGxpbmUgc3VjY2VzcywgZWZmZWN0IHRoZXJlIHRvbylcclxuLy8gWzE2OjE3OjM1Ljk2Nl0gMTY6NDAwMTEwRkU6Vm9pZHdhbGtlcjo0MEI3OlNoYWRvd2V5ZToxMDYxMjM0NTpUaW5pIFBvdXRpbmk6RjoxMDAwMDoxMDAxOTBGOlxyXG4vLyBbMTY6MTc6MzUuOTY2XSAxNjo0MDAxMTBGRTpWb2lkd2Fsa2VyOjQwQjc6U2hhZG93ZXllOjEwNjc4OTBBOlBvdGF0byBDaGlwcHk6MTowOjFDOjgwMDA6XHJcbi8vIGdhaW5zIHRoZSBlZmZlY3Qgb2YgUGV0cmlmaWNhdGlvbiBmcm9tIFZvaWR3YWxrZXIgZm9yIDEwLjAwIFNlY29uZHMuXHJcbi8vIFRPRE86IHB1ZGRsZSBmYWlsdXJlP1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNHYXRlRGVzY2VudCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTJOIERvb212b2lkIFNsaWNlcic6ICczRTNDJyxcclxuICAgICdFMk4gRG9vbXZvaWQgR3VpbGxvdGluZSc6ICczRTNCJyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTJOIE55eCcsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnM0UzRCcsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICd3YXJuJyxcclxuICAgICAgICAgIGJsYW1lOiBlLnRhcmdldE5hbWUsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnQm9vcGVkJyxcclxuICAgICAgICAgICAgZGU6IGUuYWJpbGl0eU5hbWUsXHJcbiAgICAgICAgICAgIGZyOiAnTWFsdXMgZGUgZMOpZ8OidHMnLFxyXG4gICAgICAgICAgICBqYTogZS5hYmlsaXR5TmFtZSxcclxuICAgICAgICAgICAgY246IGUuYWJpbGl0eU5hbWUsXHJcbiAgICAgICAgICAgIGtvOiAn64uJ7IqkJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRPRE86IHNoYWRvd2V5ZSBmYWlsdXJlXHJcbi8vIFRPRE86IEVtcHR5IEhhdGUgKDNFNTkvM0U1QSkgaGl0cyBldmVyeWJvZHksIHNvIGhhcmQgdG8gdGVsbCBhYm91dCBrbm9ja2JhY2tcclxuLy8gVE9ETzogbWF5YmUgbWFyayBoZWxsIHdpbmQgcGVvcGxlIHdobyBnb3QgY2xpcHBlZCBieSBzdGFjaz9cclxuLy8gVE9ETzogbWlzc2luZyBwdWRkbGVzP1xyXG4vLyBUT0RPOiBtaXNzaW5nIGxpZ2h0L2RhcmsgY2lyY2xlIHN0YWNrXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc0dhdGVEZXNjZW50U2F2YWdlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFMlMgRG9vbXZvaWQgU2xpY2VyJzogJzNFNTAnLFxyXG4gICAgJ0UzUyBFbXB0eSBSYWdlJzogJzNFNkMnLFxyXG4gICAgJ0UzUyBEb29tdm9pZCBHdWlsbG90aW5lJzogJzNFNEYnLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRTJTIERvb212b2lkIENsZWF2ZXInOiAnM0U2NCcsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0UyUyBTaGFkb3dleWUnLFxyXG4gICAgICAvLyBTdG9uZSBDdXJzZVxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnNTg5JyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMlMgTnl4JyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICczRTUxJyxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ3dhcm4nLFxyXG4gICAgICAgICAgYmxhbWU6IGUudGFyZ2V0TmFtZSxcclxuICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgZW46ICdCb29wZWQnLFxyXG4gICAgICAgICAgICBkZTogZS5hYmlsaXR5TmFtZSxcclxuICAgICAgICAgICAgZnI6ICdNYWx1cyBkZSBkw6lnw6J0cycsXHJcbiAgICAgICAgICAgIGphOiBlLmFiaWxpdHlOYW1lLFxyXG4gICAgICAgICAgICBjbjogJ+aUu+WHu+S8pOWus+mZjeS9jicsXHJcbiAgICAgICAgICAgIGtvOiAn64uJ7IqkJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNHYXRlSW51bmRhdGlvbixcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTNOIE1vbnN0ZXIgV2F2ZSAxJzogJzNGQ0EnLFxyXG4gICAgJ0UzTiBNb25zdGVyIFdhdmUgMic6ICczRkU5JyxcclxuICAgICdFM04gTWFlbHN0cm9tJzogJzNGRDknLFxyXG4gICAgJ0UzTiBTd2lybGluZyBUc3VuYW1pJzogJzNGRDUnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0UzTiBUZW1wb3JhcnkgQ3VycmVudCAxJzogJzNGQ0UnLFxyXG4gICAgJ0UzTiBUZW1wb3JhcnkgQ3VycmVudCAyJzogJzNGQ0QnLFxyXG4gICAgJ0UzTiBTcGlubmluZyBEaXZlJzogJzNGREInLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdFM04gUmlwIEN1cnJlbnQnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzNGQzcnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogU2NvdXJpbmcgVHN1bmFtaSAoM0NFMCkgb24gc29tZWJvZHkgb3RoZXIgdGhhbiB0YXJnZXRcclxuLy8gVE9ETzogU3dlZXBpbmcgVHN1bmFtaSAoM0ZGNSkgb24gc29tZWJvZHkgb3RoZXIgdGhhbiB0YW5rc1xyXG4vLyBUT0RPOiBSaXAgQ3VycmVudCAoM0ZFMCwgM0ZFMSkgb24gc29tZWJvZHkgb3RoZXIgdGhhbiB0YXJnZXQvdGFua3NcclxuLy8gVE9ETzogQm9pbGVkIEFsaXZlICg0MDA2KSBpcyBmYWlsaW5nIHB1ZGRsZXM/Pz9cclxuLy8gVE9ETzogZmFpbGluZyB0byBjbGVhbnNlIFNwbGFzaGluZyBXYXRlcnNcclxuLy8gVE9ETzogZG9lcyBnZXR0aW5nIGhpdCBieSB1bmRlcnNlYSBxdWFrZSBjYXVzZSBhbiBhYmlsaXR5P1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNHYXRlSW51bmRhdGlvblNhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTNTIE1vbnN0ZXIgV2F2ZSAxJzogJzNGRTUnLFxyXG4gICAgJ0UzUyBNb25zdGVyIFdhdmUgMic6ICczRkU5JyxcclxuICAgICdFM1MgTWFlbHN0cm9tJzogJzNGRkInLFxyXG4gICAgJ0UzUyBTd2lybGluZyBUc3VuYW1pJzogJzNGRjQnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0UzUyBUZW1wb3JhcnkgQ3VycmVudCAxJzogJzNGRUEnLFxyXG4gICAgJ0UzUyBUZW1wb3JhcnkgQ3VycmVudCAyJzogJzNGRUInLFxyXG4gICAgJ0UzUyBUZW1wb3JhcnkgQ3VycmVudCAzJzogJzNGRUMnLFxyXG4gICAgJ0UzUyBUZW1wb3JhcnkgQ3VycmVudCA0JzogJzNGRUQnLFxyXG4gICAgJ0UzUyBTcGlubmluZyBEaXZlJzogJzNGRkQnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zR2F0ZVNlcHVsdHVyZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTROIFdlaWdodCBvZiB0aGUgTGFuZCc6ICc0MEVCJyxcclxuICAgICdFNE4gRXZpbCBFYXJ0aCc6ICc0MEVGJyxcclxuICAgICdFNE4gQWZ0ZXJzaG9jayAxJzogJzQxQjQnLFxyXG4gICAgJ0U0TiBBZnRlcnNob2NrIDInOiAnNDBGMCcsXHJcbiAgICAnRTROIEV4cGxvc2lvbiAxJzogJzQwRUQnLFxyXG4gICAgJ0U0TiBFeHBsb3Npb24gMic6ICc0MEY1JyxcclxuICAgICdFNE4gTGFuZHNsaWRlJzogJzQxMUInLFxyXG4gICAgJ0U0TiBSaWdodHdhcmQgTGFuZHNsaWRlJzogJzQxMDAnLFxyXG4gICAgJ0U0TiBMZWZ0d2FyZCBMYW5kc2xpZGUnOiAnNDBGRicsXHJcbiAgICAnRTROIE1hc3NpdmUgTGFuZHNsaWRlJzogJzQwRkMnLFxyXG4gICAgJ0U0TiBTZWlzbWljIFdhdmUnOiAnNDBGMycsXHJcbiAgICAnRTROIEZhdWx0IExpbmUnOiAnNDEwMScsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRPRE86IGNvdWxkIHRyYWNrIHBlb3BsZSBnZXQgaGl0dGluZyBieSBtYXJrZXJzIHRoZXkgc2hvdWxkbid0XHJcbi8vIFRPRE86IGNvdWxkIHRyYWNrIG5vbi10YW5rcyBnZXR0aW5nIGhpdCBieSB0YW5rYnVzdGVycywgbWVnYWxpdGhzXHJcbi8vIFRPRE86IGNvdWxkIHRyYWNrIG5vbi10YXJnZXQgZ2V0dGluZyBoaXQgYnkgdGFua2J1c3RlclxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNHYXRlU2VwdWx0dXJlU2F2YWdlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFNFMgV2VpZ2h0IG9mIHRoZSBMYW5kJzogJzQxMDgnLFxyXG4gICAgJ0U0UyBFdmlsIEVhcnRoJzogJzQxMEMnLFxyXG4gICAgJ0U0UyBBZnRlcnNob2NrIDEnOiAnNDFCNScsXHJcbiAgICAnRTRTIEFmdGVyc2hvY2sgMic6ICc0MTBEJyxcclxuICAgICdFNFMgRXhwbG9zaW9uJzogJzQxMEEnLFxyXG4gICAgJ0U0UyBMYW5kc2xpZGUnOiAnNDExQicsXHJcbiAgICAnRTRTIFJpZ2h0d2FyZCBMYW5kc2xpZGUnOiAnNDExRCcsXHJcbiAgICAnRTRTIExlZnR3YXJkIExhbmRzbGlkZSc6ICc0MTFDJyxcclxuICAgICdFNFMgTWFzc2l2ZSBMYW5kc2xpZGUgMSc6ICc0MTE4JyxcclxuICAgICdFNFMgTWFzc2l2ZSBMYW5kc2xpZGUgMic6ICc0MTE5JyxcclxuICAgICdFNFMgU2Vpc21pYyBXYXZlJzogJzQxMTAnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0U0UyBEdWFsIEVhcnRoZW4gRmlzdHMgMSc6ICc0MTM1JyxcclxuICAgICdFNFMgRHVhbCBFYXJ0aGVuIEZpc3RzIDInOiAnNDY4NycsXHJcbiAgICAnRTRTIFBsYXRlIEZyYWN0dXJlJzogJzQzRUEnLFxyXG4gICAgJ0U0UyBFYXJ0aGVuIEZpc3QgMSc6ICc0M0NBJyxcclxuICAgICdFNFMgRWFydGhlbiBGaXN0IDInOiAnNDNDOScsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0U0UyBGYXVsdCBMaW5lIENvbGxlY3QnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5zdGFydHNVc2luZyh7IGlkOiAnNDExRScsIHNvdXJjZTogJ1RpdGFuJyB9KSxcclxuICAgICAgbmV0UmVnZXhEZTogTmV0UmVnZXhlcy5zdGFydHNVc2luZyh7IGlkOiAnNDExRScsIHNvdXJjZTogJ1RpdGFuJyB9KSxcclxuICAgICAgbmV0UmVnZXhGcjogTmV0UmVnZXhlcy5zdGFydHNVc2luZyh7IGlkOiAnNDExRScsIHNvdXJjZTogJ1RpdGFuJyB9KSxcclxuICAgICAgbmV0UmVnZXhKYTogTmV0UmVnZXhlcy5zdGFydHNVc2luZyh7IGlkOiAnNDExRScsIHNvdXJjZTogJ+OCv+OCpOOCv+ODsycgfSksXHJcbiAgICAgIG5ldFJlZ2V4Q246IE5ldFJlZ2V4ZXMuc3RhcnRzVXNpbmcoeyBpZDogJzQxMUUnLCBzb3VyY2U6ICfms7DlnaYnIH0pLFxyXG4gICAgICBuZXRSZWdleEtvOiBOZXRSZWdleGVzLnN0YXJ0c1VzaW5nKHsgaWQ6ICc0MTFFJywgc291cmNlOiAn7YOA7J207YOEJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmZhdWx0TGluZVRhcmdldCA9IG1hdGNoZXMudGFyZ2V0O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNFMgRmF1bHQgTGluZScsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNDExRScsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUsIGRhdGEpID0+IGRhdGEuZmF1bHRMaW5lVGFyZ2V0ICE9PSBlLnRhcmdldE5hbWUsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIGJsYW1lOiBlLnRhcmdldE5hbWUsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnUnVuIE92ZXInLFxyXG4gICAgICAgICAgICBkZTogZS5hYmlsaXR5TmFtZSxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIMOpY3Jhc8OpKGUpJyxcclxuICAgICAgICAgICAgamE6IGUuYWJpbGl0eU5hbWUsXHJcbiAgICAgICAgICAgIGNuOiBlLmFiaWxpdHlOYW1lLFxyXG4gICAgICAgICAgICBrbzogZS5hYmlsaXR5TmFtZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc1ZlcnNlRnVsbWluYXRpb24sXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0U1TiBJbXBhY3QnOiAnNEUzQScsIC8vIFN0cmF0b3NwZWFyIGxhbmRpbmcgQW9FXHJcbiAgICAnRTVOIExpZ2h0bmluZyBCb2x0JzogJzRCOUMnLCAvLyBTdG9ybWNsb3VkIHN0YW5kYXJkIGF0dGFja1xyXG4gICAgJ0U1TiBHYWxsb3AnOiAnNEI5NycsIC8vIFNpZGV3YXlzIGFkZCBjaGFyZ2VcclxuICAgICdFNU4gU2hvY2sgU3RyaWtlJzogJzRCQTEnLCAvLyBTbWFsbCBBb0UgY2lyY2xlcyBkdXJpbmcgVGh1bmRlcnN0b3JtXHJcbiAgICAnRTVOIFZvbHQgU3RyaWtlJzogJzRDRjInLCAvLyBMYXJnZSBBb0UgY2lyY2xlcyBkdXJpbmcgVGh1bmRlcnN0b3JtXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRTVOIEp1ZGdtZW50IEpvbHQnOiAnNEI4RicsIC8vIFN0cmF0b3NwZWFyIGV4cGxvc2lvbnNcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIGEgcGxheWVyIGdldHMgNCsgc3RhY2tzIG9mIG9yYnMuIERvbid0IGJlIGdyZWVkeSFcclxuICAgICAgaWQ6ICdFNU4gU3RhdGljIENvbmRlbnNhdGlvbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc4QjUnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBIZWxwZXIgZm9yIG9yYiBwaWNrdXAgZmFpbHVyZXNcclxuICAgICAgaWQ6ICdFNU4gT3JiIEdhaW4nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnOEI0JyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc09yYiA9IGRhdGEuaGFzT3JiIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzT3JiW21hdGNoZXMudGFyZ2V0XSA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U1TiBPcmIgTG9zZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmxvc2VzRWZmZWN0KHsgZWZmZWN0SWQ6ICc4QjQnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzT3JiID0gZGF0YS5oYXNPcmIgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNPcmJbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U1TiBEaXZpbmUgSnVkZ2VtZW50IFZvbHRzJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICc0QjlBJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSwgZGF0YSkgPT4gIWRhdGEuaGFzT3JiW2UudGFyZ2V0TmFtZV0sXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIGJsYW1lOiBlLnRhcmdldE5hbWUsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiBlLmFiaWxpdHlOYW1lICsgJyAobm8gb3JiKScsXHJcbiAgICAgICAgICAgIGRlOiBlLmFiaWxpdHlOYW1lICsgJyAoa2VpbiBPcmIpJyxcclxuICAgICAgICAgICAgZnI6IGUuYWJpbGl0eU5hbWUgKyAnKHBhcyBkXFwnb3JiZSknLFxyXG4gICAgICAgICAgICBqYTogZS5hYmlsaXR5TmFtZSArICco6Zu3546J54Sh44GXKScsXHJcbiAgICAgICAgICAgIGNuOiBlLmFiaWxpdHlOYW1lICsgJyjmsqHlkIPnkIMpJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTVOIFN0b3JtY2xvdWQgVGFyZ2V0IFRyYWNraW5nJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuaGVhZE1hcmtlcih7IGlkOiAnMDA2RScgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5jbG91ZE1hcmtlcnMgPSBkYXRhLmNsb3VkTWFya2VycyB8fCBbXTtcclxuICAgICAgICBkYXRhLmNsb3VkTWFya2Vycy5wdXNoKG1hdGNoZXMudGFyZ2V0KTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIFRoaXMgYWJpbGl0eSBpcyBzZWVuIG9ubHkgaWYgcGxheWVycyBzdGFja2VkIHRoZSBjbG91ZHMgaW5zdGVhZCBvZiBzcHJlYWRpbmcgdGhlbS5cclxuICAgICAgaWQ6ICdFNU4gVGhlIFBhcnRpbmcgQ2xvdWRzJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICc0QjlEJyxcclxuICAgICAgc3VwcHJlc3NTZWNvbmRzOiAzMCxcclxuICAgICAgbWlzdGFrZTogKGUsIGRhdGEpID0+IHtcclxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgZGF0YS5jbG91ZE1hcmtlcnMpIHtcclxuICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgICAgYmxhbWU6IGRhdGEuY2xvdWRNYXJrZXJzW21dLFxyXG4gICAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgICAgZW46IGUuYWJpbGl0eU5hbWUgKyAnKGNsb3VkcyB0b28gY2xvc2UpJyxcclxuICAgICAgICAgICAgICBkZTogZS5hYmlsaXR5TmFtZSArICcoV29sa2VuIHp1IG5haGUpJyxcclxuICAgICAgICAgICAgICBmcjogZS5hYmlsaXR5TmFtZSArICcobnVhZ2VzIHRyb3AgcHJvY2hlcyknLFxyXG4gICAgICAgICAgICAgIGphOiBlLmFiaWxpdHlOYW1lICsgJyjpm7Lov5HjgZnjgY4pJyxcclxuICAgICAgICAgICAgICBjbjogZS5hYmlsaXR5TmFtZSArICco6Zu35LqR6YeN5Y+gKScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTVOIFN0b3JtY2xvdWQgY2xlYW51cCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmhlYWRNYXJrZXIoeyBpZDogJzAwNkUnIH0pLFxyXG4gICAgICBkZWxheVNlY29uZHM6IDMwLCAvLyBTdG9ybWNsb3VkcyByZXNvbHZlIHdlbGwgYmVmb3JlIHRoaXMuXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgZGVsZXRlIGRhdGEuY2xvdWRNYXJrZXJzO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogaXMgdGhlcmUgYSBkaWZmZXJlbnQgYWJpbGl0eSBpZiB0aGUgc2hpZWxkIGR1dHkgYWN0aW9uIGlzbid0IHVzZWQgcHJvcGVybHk/XHJcbi8vIFRPRE86IGlzIHRoZXJlIGFuIGFiaWxpdHkgZnJvbSBSYWlkZW4gKHRoZSBiaXJkKSBpZiB5b3UgZ2V0IGVhdGVuP1xyXG4vLyBUT0RPOiBtYXliZSBjaGFpbiBsaWdodG5pbmcgd2FybmluZyBpZiB5b3UgZ2V0IGhpdCB3aGlsZSB5b3UgaGF2ZSBzeXN0ZW0gc2hvY2sgKDhCOClcclxuXHJcbmNvbnN0IG5vT3JiID0gKHN0cikgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBlbjogc3RyICsgJyAobm8gb3JiKScsXHJcbiAgICBkZTogc3RyICsgJyAoa2VpbiBPcmIpJyxcclxuICAgIGZyOiBzdHIgKyAnIChwYXMgZFxcJ29yYmUpJyxcclxuICAgIGphOiBzdHIgKyAnICjpm7fnjonnhKHjgZcpJyxcclxuICAgIGNuOiBzdHIgKyAnICjmsqHlkIPnkIMpJyxcclxuICAgIGtvOiBzdHIgKyAnICjqtazsiqwg7JeG7J2MKScsXHJcbiAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc1ZlcnNlRnVsbWluYXRpb25TYXZhZ2UsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0U1UyBJbXBhY3QnOiAnNEUzQicsIC8vIFN0cmF0b3NwZWFyIGxhbmRpbmcgQW9FXHJcbiAgICAnRTVTIEdhbGxvcCc6ICc0QkI0JywgLy8gU2lkZXdheXMgYWRkIGNoYXJnZVxyXG4gICAgJ0U1UyBTaG9jayBTdHJpa2UnOiAnNEJDMScsIC8vIFNtYWxsIEFvRSBjaXJjbGVzIGR1cmluZyBUaHVuZGVyc3Rvcm1cclxuICAgICdFNVMgU3RlcHBlZCBMZWFkZXIgVHdpc3Rlcic6ICc0QkM3JywgLy8gVHdpc3RlciBzdGVwcGVkIGxlYWRlclxyXG4gICAgJ0U1UyBTdGVwcGVkIExlYWRlciBEb251dCc6ICc0QkM4JywgLy8gRG9udXQgc3RlcHBlZCBsZWFkZXJcclxuICAgICdFNVMgU2hvY2snOiAnNEUzRCcsIC8vIEhhdGVkIG9mIExldmluIFN0b3JtY2xvdWQtY2xlYW5zYWJsZSBleHBsb2RpbmcgZGVidWZmXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRTVTIEp1ZGdtZW50IEpvbHQnOiAnNEJBNycsIC8vIFN0cmF0b3NwZWFyIGV4cGxvc2lvbnNcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0U1UyBWb2x0IFN0cmlrZSBEb3VibGUnOiAnNEJDMycsIC8vIExhcmdlIEFvRSBjaXJjbGVzIGR1cmluZyBUaHVuZGVyc3Rvcm1cclxuICAgICdFNVMgQ3JpcHBsaW5nIEJsb3cnOiAnNEJDQScsXHJcbiAgICAnRTVTIENoYWluIExpZ2h0bmluZyBEb3VibGUnOiAnNEJDNScsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBIZWxwZXIgZm9yIG9yYiBwaWNrdXAgZmFpbHVyZXNcclxuICAgICAgaWQ6ICdFNVMgT3JiIEdhaW4nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnOEI0JyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc09yYiA9IGRhdGEuaGFzT3JiIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzT3JiW21hdGNoZXMudGFyZ2V0XSA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U1UyBPcmIgTG9zZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmxvc2VzRWZmZWN0KHsgZWZmZWN0SWQ6ICc4QjQnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzT3JiID0gZGF0YS5oYXNPcmIgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNPcmJbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U1UyBEaXZpbmUgSnVkZ2VtZW50IFZvbHRzJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICc0QkI3JyxcclxuICAgICAgY29uZGl0aW9uOiAoZSwgZGF0YSkgPT4gIWRhdGEuaGFzT3JiIHx8ICFkYXRhLmhhc09yYltlLnRhcmdldE5hbWVdLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogbm9PcmIoZS5hYmlsaXR5TmFtZSkgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTVTIFZvbHQgU3RyaWtlIE9yYicsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNEJDMycsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUsIGRhdGEpID0+ICFkYXRhLmhhc09yYiB8fCAhZGF0YS5oYXNPcmJbZS50YXJnZXROYW1lXSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IG5vT3JiKGUuYWJpbGl0eU5hbWUpIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U1UyBEZWFkbHkgRGlzY2hhcmdlIEJpZyBLbm9ja2JhY2snLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzRCQjInLFxyXG4gICAgICBjb25kaXRpb246IChlLCBkYXRhKSA9PiAhZGF0YS5oYXNPcmIgfHwgIWRhdGEuaGFzT3JiW2UudGFyZ2V0TmFtZV0sXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBub09yYihlLmFiaWxpdHlOYW1lKSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNVMgTGlnaHRuaW5nIEJvbHQnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzRCQjknLFxyXG4gICAgICBjb25kaXRpb246IChlLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgLy8gSGF2aW5nIGEgbm9uLWlkZW1wb3RlbnQgY29uZGl0aW9uIGZ1bmN0aW9uIGlzIGEgYml0IDxfPFxyXG4gICAgICAgIC8vIE9ubHkgY29uc2lkZXIgbGlnaHRuaW5nIGJvbHQgZGFtYWdlIGlmIHlvdSBoYXZlIGEgZGVidWZmIHRvIGNsZWFyLlxyXG4gICAgICAgIGlmICghZGF0YS5oYXRlZCB8fCAhZGF0YS5oYXRlZFtlLnRhcmdldE5hbWVdKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGRlbGV0ZSBkYXRhLmhhdGVkW2UudGFyZ2V0TmFtZV07XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNVMgSGF0ZWQgb2YgTGV2aW4nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5oZWFkTWFya2VyKHsgaWQ6ICcwMEQyJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhdGVkID0gZGF0YS5oYXRlZCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhdGVkW21hdGNoZXMudGFyZ2V0XSA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U1UyBTdG9ybWNsb3VkIFRhcmdldCBUcmFja2luZycsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmhlYWRNYXJrZXIoeyBpZDogJzAwNkUnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuY2xvdWRNYXJrZXJzID0gZGF0YS5jbG91ZE1hcmtlcnMgfHwgW107XHJcbiAgICAgICAgZGF0YS5jbG91ZE1hcmtlcnMucHVzaChtYXRjaGVzLnRhcmdldCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBUaGlzIGFiaWxpdHkgaXMgc2VlbiBvbmx5IGlmIHBsYXllcnMgc3RhY2tlZCB0aGUgY2xvdWRzIGluc3RlYWQgb2Ygc3ByZWFkaW5nIHRoZW0uXHJcbiAgICAgIGlkOiAnRTVTIFRoZSBQYXJ0aW5nIENsb3VkcycsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNEJCQScsXHJcbiAgICAgIHN1cHByZXNzU2Vjb25kczogMzAsXHJcbiAgICAgIG1pc3Rha2U6IChlLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgZm9yIChjb25zdCBtIG9mIGRhdGEuY2xvdWRNYXJrZXJzKSB7XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICAgIGJsYW1lOiBkYXRhLmNsb3VkTWFya2Vyc1ttXSxcclxuICAgICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICAgIGVuOiBlLmFiaWxpdHlOYW1lICsgJyhjbG91ZHMgdG9vIGNsb3NlKScsXHJcbiAgICAgICAgICAgICAgZGU6IGUuYWJpbGl0eU5hbWUgKyAnKFdvbGtlbiB6dSBuYWhlKScsXHJcbiAgICAgICAgICAgICAgZnI6IGUuYWJpbGl0eU5hbWUgKyAnKG51YWdlcyB0cm9wIHByb2NoZXMpJyxcclxuICAgICAgICAgICAgICBqYTogZS5hYmlsaXR5TmFtZSArICco6Zuy6L+R44GZ44GOKScsXHJcbiAgICAgICAgICAgICAgY246IGUuYWJpbGl0eU5hbWUgKyAnKOmbt+S6kemHjeWPoCknLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U1UyBTdG9ybWNsb3VkIGNsZWFudXAnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5oZWFkTWFya2VyKHsgaWQ6ICcwMDZFJyB9KSxcclxuICAgICAgLy8gU3Rvcm1jbG91ZHMgcmVzb2x2ZSB3ZWxsIGJlZm9yZSB0aGlzLlxyXG4gICAgICBkZWxheVNlY29uZHM6IDMwLFxyXG4gICAgICBydW46IChfZSwgZGF0YSkgPT4ge1xyXG4gICAgICAgIGRlbGV0ZSBkYXRhLmNsb3VkTWFya2VycztcclxuICAgICAgICBkZWxldGUgZGF0YS5oYXRlZDtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNWZXJzZUZ1cm9yLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFNk4gVGhvcm5zJzogJzRCREEnLCAvLyBBb0UgbWFya2VycyBhZnRlciBFbnVtZXJhdGlvblxyXG4gICAgJ0U2TiBGZXJvc3Rvcm0gMSc6ICc0QkREJyxcclxuICAgICdFNk4gRmVyb3N0b3JtIDInOiAnNEJFNScsXHJcbiAgICAnRTZOIFN0b3JtIE9mIEZ1cnkgMSc6ICc0QkUwJywgLy8gQ2lyY2xlIEFvRSBkdXJpbmcgdGV0aGVycy0tR2FydWRhXHJcbiAgICAnRTZOIFN0b3JtIE9mIEZ1cnkgMic6ICc0QkU2JywgLy8gQ2lyY2xlIEFvRSBkdXJpbmcgdGV0aGVycy0tUmFrdGFwYWtzYVxyXG4gICAgJ0U2TiBFeHBsb3Npb24nOiAnNEJFMicsIC8vIEFvRSBjaXJjbGVzLCBHYXJ1ZGEgb3Jic1xyXG4gICAgJ0U2TiBIZWF0IEJ1cnN0JzogJzRCRUMnLFxyXG4gICAgJ0U2TiBDb25mbGFnIFN0cmlrZSc6ICc0QkVFJywgLy8gMjcwLWRlZ3JlZSBmcm9udGFsIEFvRVxyXG4gICAgJ0U2TiBTcGlrZSBPZiBGbGFtZSc6ICc0QkYwJywgLy8gT3JiIGV4cGxvc2lvbnMgYWZ0ZXIgU3RyaWtlIFNwYXJrXHJcbiAgICAnRTZOIFJhZGlhbnQgUGx1bWUnOiAnNEJGMicsXHJcbiAgICAnRTZOIEVydXB0aW9uJzogJzRCRjQnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0U2TiBWYWN1dW0gU2xpY2UnOiAnNEJENScsIC8vIERhcmsgbGluZSBBb0UgZnJvbSBHYXJ1ZGFcclxuICAgICdFNk4gRG93bmJ1cnN0JzogJzRCREInLCAvLyBCbHVlIGtub2NrYmFjayBjaXJjbGUuIEFjdHVhbCBrbm9ja2JhY2sgaXMgdW5rbm93biBhYmlsaXR5IDRDMjBcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgLy8gS2lsbHMgbm9uLXRhbmtzIHdobyBnZXQgaGl0IGJ5IGl0LlxyXG4gICAgJ0U2TiBJbnN0YW50IEluY2luZXJhdGlvbic6ICc0QkVEJyxcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRPRE86IGNoZWNrIHRldGhlcnMgYmVpbmcgY3V0ICh3aGVuIHRoZXkgc2hvdWxkbid0KVxyXG4vLyBUT0RPOiBjaGVjayBmb3IgY29uY3Vzc2VkIGRlYnVmZlxyXG4vLyBUT0RPOiBjaGVjayBmb3IgdGFraW5nIHRhbmtidXN0ZXIgd2l0aCBsaWdodGhlYWRlZFxyXG4vLyBUT0RPOiBjaGVjayBmb3Igb25lIHBlcnNvbiB0YWtpbmcgbXVsdGlwbGUgU3Rvcm0gT2YgRnVyeSBUZXRoZXJzICg0QzAxLzRDMDgpXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNWZXJzZUZ1cm9yU2F2YWdlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgIC8vIEl0J3MgY29tbW9uIHRvIGp1c3QgaWdub3JlIGZ1dGJvbCBtZWNoYW5pY3MsIHNvIGRvbid0IHdhcm4gb24gU3RyaWtlIFNwYXJrLlxyXG4gICAgLy8gJ1NwaWtlIE9mIEZsYW1lJzogJzRDMTMnLCAvLyBPcmIgZXhwbG9zaW9ucyBhZnRlciBTdHJpa2UgU3BhcmtcclxuXHJcbiAgICAnRTZTIFRob3Jucyc6ICc0QkZBJywgLy8gQW9FIG1hcmtlcnMgYWZ0ZXIgRW51bWVyYXRpb25cclxuICAgICdFNlMgRmVyb3N0b3JtIDEnOiAnNEJGRCcsXHJcbiAgICAnRTZTIEZlcm9zdG9ybSAyJzogJzRDMDYnLFxyXG4gICAgJ0U2UyBTdG9ybSBPZiBGdXJ5IDEnOiAnNEMwMCcsIC8vIENpcmNsZSBBb0UgZHVyaW5nIHRldGhlcnMtLUdhcnVkYVxyXG4gICAgJ0U2UyBTdG9ybSBPZiBGdXJ5IDInOiAnNEMwNycsIC8vIENpcmNsZSBBb0UgZHVyaW5nIHRldGhlcnMtLVJha3RhcGFrc2FcclxuICAgICdFNlMgRXhwbG9zaW9uJzogJzRDMDMnLCAvLyBBb0UgY2lyY2xlcywgR2FydWRhIG9yYnNcclxuICAgICdFNlMgSGVhdCBCdXJzdCc6ICc0QzFGJyxcclxuICAgICdFNlMgQ29uZmxhZyBTdHJpa2UnOiAnNEMxMCcsIC8vIDI3MC1kZWdyZWUgZnJvbnRhbCBBb0VcclxuICAgICdFNlMgUmFkaWFudCBQbHVtZSc6ICc0QzE1JyxcclxuICAgICdFNlMgRXJ1cHRpb24nOiAnNEMxNycsXHJcbiAgICAnRTZTIFdpbmQgQ3V0dGVyJzogJzRDMDInLCAvLyBUZXRoZXItY3V0dGluZyBsaW5lIGFvZVxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0U2UyBWYWN1dW0gU2xpY2UnOiAnNEJGNScsIC8vIERhcmsgbGluZSBBb0UgZnJvbSBHYXJ1ZGFcclxuICAgICdFNlMgRG93bmJ1cnN0IDEnOiAnNEJGQicsIC8vIEJsdWUga25vY2tiYWNrIGNpcmNsZSAoR2FydWRhKS5cclxuICAgICdFNlMgRG93bmJ1cnN0IDInOiAnNEJGQycsIC8vIEJsdWUga25vY2tiYWNrIGNpcmNsZSAoUmFrdGFwYWtzYSkuXHJcbiAgICAnRTZTIE1ldGVvciBTdHJpa2UnOiAnNEMwRicsIC8vIEZyb250YWwgYXZvaWRhYmxlIHRhbmsgYnVzdGVyXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdFNlMgSGFuZHMgb2YgSGVsbCc6ICc0QzBbQkNdJywgLy8gVGV0aGVyIGNoYXJnZVxyXG4gICAgJ0U2UyBIYW5kcyBvZiBGbGFtZSc6ICc0QzBBJywgLy8gRmlyc3QgVGFua2J1c3RlclxyXG4gICAgJ0U2UyBJbnN0YW50IEluY2luZXJhdGlvbic6ICc0QzBFJywgLy8gU2Vjb25kIFRhbmtidXN0ZXJcclxuICAgICdFNlMgQmxhemUnOiAnNEMxQicsIC8vIEZsYW1lIFRvcm5hZG8gQ2xlYXZlXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0U2UyBBaXIgQnVtcCcsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNEJGOScsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IHtcclxuICAgICAgICAvLyBOZWVkcyB0byBiZSB0YWtlbiB3aXRoIGZyaWVuZHMuXHJcbiAgICAgICAgLy8gVGhpcyBjYW4ndCB0ZWxsIGlmIHlvdSBoYXZlIDIgb3IgPjIuXHJcbiAgICAgICAgcmV0dXJuIGUudHlwZSA9PT0gJzE1JztcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmNvbnN0IHdyb25nQnVmZiA9IChzdHIpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgZW46IHN0ciArICcgKHdyb25nIGJ1ZmYpJyxcclxuICAgIGRlOiBzdHIgKyAnIChmYWxzY2hlciBCdWZmKScsXHJcbiAgICBmcjogc3RyICsgJyAobWF1dmFpcyBidWZmKScsXHJcbiAgICBqYTogc3RyICsgJyAo5LiN6YGp5YiH44Gq44OQ44OVKScsXHJcbiAgICBjbjogc3RyICsgJyAoQnVmZumUmeS6hiknLFxyXG4gICAga286IHN0ciArICcgKOuyhO2UhCDti4DrprwpJyxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3Qgbm9CdWZmID0gKHN0cikgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBlbjogc3RyICsgJyAobm8gYnVmZiknLFxyXG4gICAgZGU6IHN0ciArICcgKGtlaW4gQnVmZiknLFxyXG4gICAgZnI6IHN0ciArICcgKHBhcyBkZSBidWZmKScsXHJcbiAgICBqYTogc3RyICsgJyAo44OQ44OV54Sh44GXKScsXHJcbiAgICBjbjogc3RyICsgJyAo5rKh5pyJQnVmZiknLFxyXG4gICAga286IHN0ciArICco67KE7ZSEIOyXhuydjCknLFxyXG4gIH07XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNWZXJzZUljb25vY2xhc20sXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0U3TiBTdHlnaWFuIFN3b3JkJzogJzRDNTUnLCAvLyBDaXJjbGUgZ3JvdW5kIEFvRXMgYWZ0ZXIgRmFsc2UgVHdpbGlnaHRcclxuICAgICdFN04gU3RyZW5ndGggSW4gTnVtYmVycyBEb251dCc6ICc0QzRDJywgLy8gTGFyZ2UgZG9udXQgZ3JvdW5kIEFvRXMsIGludGVybWlzc2lvblxyXG4gICAgJ0U3TiBTdHJlbmd0aCBJbiBOdW1iZXJzIDInOiAnNEM0RCcsIC8vIExhcmdlIGNpcmNsZSBncm91bmQgQW9FcywgaW50ZXJtaXNzaW9uXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0U3TiBTdHlnaWFuIFN0YWtlJywgLy8gTGFzZXIgdGFuayBidXN0ZXIsIG91dHNpZGUgaW50ZXJtaXNzaW9uIHBoYXNlXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNEMzMycsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IGUudHlwZSAhPT0gJzE1JyxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTVOIFNpbHZlciBTaG90JywgLy8gU3ByZWFkIG1hcmtlcnMsIGludGVybWlzc2lvblxyXG4gICAgICBkYW1hZ2VSZWdleDogJzRFN0QnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U3TiBBc3RyYWwgRWZmZWN0IEdhaW4nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnOEJFJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc0FzdHJhbCA9IGRhdGEuaGFzQXN0cmFsIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzQXN0cmFsW21hdGNoZXMudGFyZ2V0XSA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U3TiBBc3RyYWwgRWZmZWN0IExvc2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnOEJFJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc0FzdHJhbCA9IGRhdGEuaGFzQXN0cmFsIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzQXN0cmFsW21hdGNoZXMudGFyZ2V0XSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN04gVW1icmFsIEVmZmVjdCBHYWluJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzhCRicgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNVbWJyYWwgPSBkYXRhLmhhc1VtYnJhbCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc1VtYnJhbFttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN04gVW1icmFsIEVmZmVjdCBMb3NlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMubG9zZXNFZmZlY3QoeyBlZmZlY3RJZDogJzhCRicgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNVbWJyYWwgPSBkYXRhLmhhc1VtYnJhbCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc1VtYnJhbFttYXRjaGVzLnRhcmdldF0gPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTdOIExpZ2h0XFwncyBDb3Vyc2UnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogWyc0QzNFJywgJzRDNDAnLCAnNEMyMicsICc0QzNDJywgJzRFNjMnXSxcclxuICAgICAgY29uZGl0aW9uOiAoZSwgZGF0YSkgPT4ge1xyXG4gICAgICAgIHJldHVybiAhZGF0YS5oYXNVbWJyYWwgfHwgIWRhdGEuaGFzVW1icmFsW2UudGFyZ2V0TmFtZV07XHJcbiAgICAgIH0sXHJcbiAgICAgIG1pc3Rha2U6IChlLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgaWYgKGRhdGEuaGFzQXN0cmFsICYmIGRhdGEuaGFzQXN0cmFsW2UudGFyZ2V0TmFtZV0pXHJcbiAgICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IHdyb25nQnVmZihlLmFiaWxpdHlOYW1lKSB9O1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogbm9CdWZmKGUuYWJpbGl0eU5hbWUpIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U3TiBEYXJrc1xcJ3MgQ291cnNlJyxcclxuICAgICAgZGFtYWdlUmVnZXg6IFsnNEMzRCcsICc0QzIzJywgJzRDNDEnLCAnNEM0MyddLFxyXG4gICAgICBjb25kaXRpb246IChlLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuICFkYXRhLmhhc0FzdHJhbCB8fCAhZGF0YS5oYXNBc3RyYWxbZS50YXJnZXROYW1lXTtcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKGUsIGRhdGEpID0+IHtcclxuICAgICAgICBpZiAoZGF0YS5oYXNVbWJyYWwgJiYgZGF0YS5oYXNVbWJyYWxbZS50YXJnZXROYW1lXSlcclxuICAgICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogd3JvbmdCdWZmKGUuYWJpbGl0eU5hbWUpIH07XHJcbiAgICAgICAgLy8gVGhpcyBjYXNlIGlzIHByb2JhYmx5IGltcG9zc2libGUsIGFzIHRoZSBkZWJ1ZmYgdGlja3MgYWZ0ZXIgZGVhdGgsXHJcbiAgICAgICAgLy8gYnV0IGxlYXZpbmcgaXQgaGVyZSBpbiBjYXNlIHRoZXJlJ3Mgc29tZSByZXogb3IgZGlzY29ubmVjdCB0aW1pbmdcclxuICAgICAgICAvLyB0aGF0IGNvdWxkIGxlYWQgdG8gdGhpcy5cclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IG5vQnVmZihlLmFiaWxpdHlOYW1lKSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogbWlzc2luZyBhbiBvcmIgZHVyaW5nIHRvcm5hZG8gcGhhc2VcclxuLy8gVE9ETzoganVtcGluZyBpbiB0aGUgdG9ybmFkbyBkYW1hZ2U/P1xyXG4vLyBUT0RPOiB0YWtpbmcgc3VuZ3JhY2UoNEM4MCkgb3IgbW9vbmdyYWNlKDRDODIpIHdpdGggd3JvbmcgZGVidWZmXHJcbi8vIFRPRE86IHN0eWdpYW4gc3BlYXIvc2lsdmVyIHNwZWFyIHdpdGggdGhlIHdyb25nIGRlYnVmZlxyXG4vLyBUT0RPOiB0YWtpbmcgZXhwbG9zaW9uIGZyb20gdGhlIHdyb25nIENoaWFyby9TY3VybyBvcmJcclxuLy8gVE9ETzogaGFuZGxlIDRDODkgU2lsdmVyIFN0YWtlIHRhbmtidXN0ZXIgMm5kIGhpdCwgYXMgaXQncyBvayB0byBoYXZlIHR3byBpbi5cclxuXHJcbmNvbnN0IHdyb25nQnVmZiA9IChzdHIpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgZW46IHN0ciArICcgKHdyb25nIGJ1ZmYpJyxcclxuICAgIGRlOiBzdHIgKyAnIChmYWxzY2hlciBCdWZmKScsXHJcbiAgICBmcjogc3RyICsgJyAobWF1dmFpcyBidWZmKScsXHJcbiAgICBqYTogc3RyICsgJyAo5LiN6YGp5YiH44Gq44OQ44OVKScsXHJcbiAgICBjbjogc3RyICsgJyAoQnVmZumUmeS6hiknLFxyXG4gICAga286IHN0ciArICcgKOuyhO2UhCDti4DrprwpJyxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3Qgbm9CdWZmID0gKHN0cikgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBlbjogc3RyICsgJyAobm8gYnVmZiknLFxyXG4gICAgZGU6IHN0ciArICcgKGtlaW4gQnVmZiknLFxyXG4gICAgZnI6IHN0ciArICcgKHBhcyBkZSBidWZmKScsXHJcbiAgICBqYTogc3RyICsgJyAo44OQ44OV54Sh44GXKScsXHJcbiAgICBjbjogc3RyICsgJyAo5rKh5pyJQnVmZiknLFxyXG4gICAga286IHN0ciArICcgKOuyhO2UhCDsl4bsnYwpJyxcclxuICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zVmVyc2VJY29ub2NsYXNtU2F2YWdlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFN1MgU2lsdmVyIFN3b3JkJzogJzRDOEUnLCAvLyBncm91bmQgYW9lXHJcbiAgICAnRTdTIE92ZXJ3aGVsbWluZyBGb3JjZSc6ICc0QzczJywgLy8gYWRkIHBoYXNlIGdyb3VuZCBhb2VcclxuICAgICdFN1MgU3RyZW5ndGggaW4gTnVtYmVycyAxJzogJzRDNzAnLCAvLyBhZGQgZ2V0IHVuZGVyXHJcbiAgICAnRTdTIFN0cmVuZ3RoIGluIE51bWJlcnMgMic6ICc0QzcxJywgLy8gYWRkIGdldCBvdXRcclxuICAgICdFN1MgUGFwZXIgQ3V0JzogJzRDN0QnLCAvLyB0b3JuYWRvIGdyb3VuZCBhb2VzXHJcbiAgICAnRTdTIEJ1ZmZldCc6ICc0Qzc3JywgLy8gdG9ybmFkbyBncm91bmQgYW9lcyBhbHNvPz9cclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdFN1MgQmV0d2l4dCBXb3JsZHMnOiAnNEM2QicsIC8vIHB1cnBsZSBncm91bmQgbGluZSBhb2VzXHJcbiAgICAnRTdTIENydXNhZGUnOiAnNEM1OCcsIC8vIGJsdWUga25vY2tiYWNrIGNpcmNsZSAoc3RhbmRpbmcgaW4gaXQpXHJcbiAgICAnRTdTIEV4cGxvc2lvbic6ICc0QzZGJywgLy8gZGlkbid0IGtpbGwgYW4gYWRkXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBMYXNlciB0YW5rIGJ1c3RlciAxXHJcbiAgICAgIGlkOiAnRTdTIFN0eWdpYW4gU3Rha2UnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzRDMzQnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBTcHJlYWQgbWFya2Vyc1xyXG4gICAgICBpZDogJ0U3UyBTaWx2ZXIgU2hvdCcsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNEM5MicsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IGUudHlwZSAhPT0gJzE1JyxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIEljZSBtYXJrZXJzXHJcbiAgICAgIGlkOiAnRTdTIFNpbHZlciBTY291cmdlJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICc0QzkzJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSkgPT4gZS50eXBlICE9PSAnMTUnLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gT3JiIEV4cGxvc2lvblxyXG4gICAgICBpZDogJ0U3UyBDaGlhcm8gU2N1cm8gRXhwbG9zaW9uJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICc0RDFbNDVdJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSkgPT4gZS50eXBlICE9PSAnMTUnLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gSW50ZXJydXB0XHJcbiAgICAgIGlkOiAnRTdTIEFkdmVudCBPZiBMaWdodCcsXHJcbiAgICAgIGFiaWxpdHlSZWdleDogJzRDNkUnLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN1MgQXN0cmFsIEVmZmVjdCBHYWluJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzhCRScgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNBc3RyYWwgPSBkYXRhLmhhc0FzdHJhbCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc0FzdHJhbFttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN1MgQXN0cmFsIEVmZmVjdCBMb3NlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMubG9zZXNFZmZlY3QoeyBlZmZlY3RJZDogJzhCRScgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNBc3RyYWwgPSBkYXRhLmhhc0FzdHJhbCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc0FzdHJhbFttYXRjaGVzLnRhcmdldF0gPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTdTIFVtYnJhbCBFZmZlY3QgR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc4QkYnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzVW1icmFsID0gZGF0YS5oYXNVbWJyYWwgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNVbWJyYWxbbWF0Y2hlcy50YXJnZXRdID0gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTdTIFVtYnJhbCBFZmZlY3QgTG9zZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmxvc2VzRWZmZWN0KHsgZWZmZWN0SWQ6ICc4QkYnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzVW1icmFsID0gZGF0YS5oYXNVbWJyYWwgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNVbWJyYWxbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U3UyBMaWdodFxcJ3MgQ291cnNlJyxcclxuICAgICAgZGFtYWdlUmVnZXg6IFsnNEM2MicsICc0QzYzJywgJzRDNjQnLCAnNEM1QicsICc0QzVGJ10sXHJcbiAgICAgIGNvbmRpdGlvbjogKGUsIGRhdGEpID0+IHtcclxuICAgICAgICByZXR1cm4gIWRhdGEuaGFzVW1icmFsIHx8ICFkYXRhLmhhc1VtYnJhbFtlLnRhcmdldE5hbWVdO1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoZSwgZGF0YSkgPT4ge1xyXG4gICAgICAgIGlmIChkYXRhLmhhc0FzdHJhbCAmJiBkYXRhLmhhc0FzdHJhbFtlLnRhcmdldE5hbWVdKVxyXG4gICAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiB3cm9uZ0J1ZmYoZS5hYmlsaXR5TmFtZSkgfTtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IG5vQnVmZihlLmFiaWxpdHlOYW1lKSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN1MgRGFya3NcXCdzIENvdXJzZScsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiBbJzRDNjUnLCAnNEM2NicsICc0QzY3JywgJzRDNUEnLCAnNEM2MCddLFxyXG4gICAgICBjb25kaXRpb246IChlLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuICFkYXRhLmhhc0FzdHJhbCB8fCAhZGF0YS5oYXNBc3RyYWxbZS50YXJnZXROYW1lXTtcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKGUsIGRhdGEpID0+IHtcclxuICAgICAgICBpZiAoZGF0YS5oYXNVbWJyYWwgJiYgZGF0YS5oYXNVbWJyYWxbZS50YXJnZXROYW1lXSlcclxuICAgICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogd3JvbmdCdWZmKGUuYWJpbGl0eU5hbWUpIH07XHJcbiAgICAgICAgLy8gVGhpcyBjYXNlIGlzIHByb2JhYmx5IGltcG9zc2libGUsIGFzIHRoZSBkZWJ1ZmYgdGlja3MgYWZ0ZXIgZGVhdGgsXHJcbiAgICAgICAgLy8gYnV0IGxlYXZpbmcgaXQgaGVyZSBpbiBjYXNlIHRoZXJlJ3Mgc29tZSByZXogb3IgZGlzY29ubmVjdCB0aW1pbmdcclxuICAgICAgICAvLyB0aGF0IGNvdWxkIGxlYWQgdG8gdGhpcy5cclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IG5vQnVmZihlLmFiaWxpdHlOYW1lKSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN1MgQ3J1c2FkZSBLbm9ja2JhY2snLFxyXG4gICAgICAvLyA0Qzc2IGlzIHRoZSBrbm9ja2JhY2sgZGFtYWdlLCA0QzU4IGlzIHRoZSBkYW1hZ2UgZm9yIHN0YW5kaW5nIG9uIHRoZSBwdWNrLlxyXG4gICAgICBkYW1hZ2VSZWdleDogJzRDNzYnLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogZS50YXJnZXROYW1lLFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnS25vY2tlZCBvZmYnLFxyXG4gICAgICAgICAgICBkZTogJ1J1bnRlcmdlZmFsbGVuJyxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIGFzc29tbcOpKGUpJyxcclxuICAgICAgICAgICAgamE6ICfjg47jg4Pjgq/jg5Djg4Pjgq8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNWZXJzZVJlZnVsZ2VuY2UsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0U4TiBCaXRpbmcgRnJvc3QnOiAnNEREQicsIC8vIDI3MC1kZWdyZWUgZnJvbnRhbCBBb0UsIFNoaXZhXHJcbiAgICAnRThOIERyaXZpbmcgRnJvc3QnOiAnNEREQycsIC8vIFJlYXIgY29uZSBBb0UsIFNoaXZhXHJcbiAgICAnRThOIEZyaWdpZCBTdG9uZSc6ICc0RTY2JywgLy8gU21hbGwgc3ByZWFkIGNpcmNsZXMsIHBoYXNlIDFcclxuICAgICdFOE4gUmVmbGVjdGVkIEF4ZSBLaWNrJzogJzRFMDAnLCAvLyBMYXJnZSBjaXJjbGUgQW9FLCBGcm96ZW4gTWlycm9yXHJcbiAgICAnRThOIFJlZmxlY3RlZCBTY3l0aGUgS2ljayc6ICc0RTAxJywgLy8gRG9udXQgQW9FLCBGcm96ZW4gTWlycm9yXHJcbiAgICAnRThOIEZyaWdpZCBFcnVwdGlvbic6ICc0RTA5JywgLy8gU21hbGwgY2lyY2xlIEFvRSBwdWRkbGVzLCBwaGFzZSAxXHJcbiAgICAnRThOIEljaWNsZSBJbXBhY3QnOiAnNEUwQScsIC8vIExhcmdlIGNpcmNsZSBBb0UgcHVkZGxlcywgcGhhc2UgMVxyXG4gICAgJ0U4TiBBeGUgS2ljayc6ICc0REUyJywgLy8gTGFyZ2UgY2lyY2xlIEFvRSwgU2hpdmFcclxuICAgICdFOE4gU2N5dGhlIEtpY2snOiAnNERFMycsIC8vIERvbnV0IEFvRSwgU2hpdmFcclxuICAgICdFOE4gUmVmbGVjdGVkIEJpdGluZyBGcm9zdCc6ICc0REZFJywgLy8gMjcwLWRlZ3JlZSBmcm9udGFsIEFvRSwgRnJvemVuIE1pcnJvclxyXG4gICAgJ0U4TiBSZWZsZWN0ZWQgRHJpdmluZyBGcm9zdCc6ICc0REZGJywgLy8gQ29uZSBBb0UsIEZyb3plbiBNaXJyb3JcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRThOIFNoaW5pbmcgQXJtb3InLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnOTUnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U4TiBIZWF2ZW5seSBTdHJpa2UnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzRERDgnLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogZS50YXJnZXROYW1lLFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnUHVzaGVkIG9mZiEnLFxyXG4gICAgICAgICAgICBkZTogJ1J1bnRlciBnZXN0b8OfZW4hJyxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIHBvdXNzw6koZSkgIScsXHJcbiAgICAgICAgICAgIGphOiAn44OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwseuQqCEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFOE4gRnJvc3QgQXJtb3InLFxyXG4gICAgICAvLyBUaGluIEljZVxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMzhGJyB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdTbGlkIG9mZiEnLFxyXG4gICAgICAgICAgICBkZTogJ3J1bnRlcmdlcnV0c2NodCEnLFxyXG4gICAgICAgICAgICBmcjogJ0EgZ2xpc3PDqShlKSAhJyxcclxuICAgICAgICAgICAgamE6ICfmu5HjgaPjgZ8nLFxyXG4gICAgICAgICAgICBjbjogJ+a7keiQvScsXHJcbiAgICAgICAgICAgIGtvOiAn66+464GE65+s7KeQIScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBydXNoIGhpdHRpbmcgdGhlIGNyeXN0YWxcclxuLy8gVE9ETzogYWRkcyBub3QgYmVpbmcga2lsbGVkXHJcbi8vIFRPRE86IHRha2luZyB0aGUgcnVzaCB0d2ljZSAod2hlbiB5b3UgaGF2ZSBkZWJ1ZmYpXHJcbi8vIFRPRE86IG5vdCBoaXR0aW5nIHRoZSBkcmFnb24gZm91ciB0aW1lcyBkdXJpbmcgd3lybSdzIGxhbWVudFxyXG4vLyBUT0RPOiBkZWF0aCByZWFzb25zIGZvciBub3QgcGlja2luZyB1cCBwdWRkbGVcclxuLy8gVE9ETzogbm90IGJlaW5nIGluIHRoZSB0b3dlciB3aGVuIHlvdSBzaG91bGRcclxuLy8gVE9ETzogcGlja2luZyB1cCB0b28gbWFueSBzdGFja3NcclxuXHJcbi8vIE5vdGU6IEJhbmlzaCBJSUkgKDREQTgpIGFuZCBCYW5pc2ggSWlpIERpdmlkZWQgKDREQTkpIGJvdGggYXJlIHR5cGU9MHgxNiBsaW5lcy5cclxuLy8gVGhlIHNhbWUgaXMgdHJ1ZSBmb3IgQmFuaXNoICg0REE2KSBhbmQgQmFuaXNoIERpdmlkZWQgKDREQTcpLlxyXG4vLyBJJ20gbm90IHN1cmUgdGhpcyBtYWtlcyBhbnkgc2Vuc2U/IEJ1dCBjYW4ndCB0ZWxsIGlmIHRoZSBzcHJlYWQgd2FzIGEgbWlzdGFrZSBvciBub3QuXHJcbi8vIE1heWJlIHdlIGNvdWxkIGNoZWNrIGZvciBcIk1hZ2ljIFZ1bG5lcmFiaWxpdHkgVXBcIj9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc1ZlcnNlUmVmdWxnZW5jZVNhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRThTIEJpdGluZyBGcm9zdCc6ICc0RDY2JywgLy8gMjcwLWRlZ3JlZSBmcm9udGFsIEFvRSwgU2hpdmFcclxuICAgICdFOFMgRHJpdmluZyBGcm9zdCc6ICc0RDY3JywgLy8gUmVhciBjb25lIEFvRSwgU2hpdmFcclxuICAgICdFOFMgQXhlIEtpY2snOiAnNEQ2RCcsIC8vIExhcmdlIGNpcmNsZSBBb0UsIFNoaXZhXHJcbiAgICAnRThTIFNjeXRoZSBLaWNrJzogJzRENkUnLCAvLyBEb251dCBBb0UsIFNoaXZhXHJcbiAgICAnRThTIFJlZmxlY3RlZCBBeGUgS2ljayc6ICc0REI5JywgLy8gTGFyZ2UgY2lyY2xlIEFvRSwgRnJvemVuIE1pcnJvclxyXG4gICAgJ0U4UyBSZWZsZWN0ZWQgU2N5dGhlIEtpY2snOiAnNERCQScsIC8vIERvbnV0IEFvRSwgRnJvemVuIE1pcnJvclxyXG4gICAgJ0U4UyBGcmlnaWQgRXJ1cHRpb24nOiAnNEQ5RicsIC8vIFNtYWxsIGNpcmNsZSBBb0UgcHVkZGxlcywgcGhhc2UgMVxyXG4gICAgJ0U4UyBGcmlnaWQgTmVlZGxlJzogJzREOUQnLCAvLyA4LXdheSBcImZsb3dlclwiIGV4cGxvc2lvblxyXG4gICAgJ0U4UyBJY2ljbGUgSW1wYWN0JzogJzREQTAnLCAvLyBMYXJnZSBjaXJjbGUgQW9FIHB1ZGRsZXMsIHBoYXNlIDFcclxuICAgICdFOFMgUmVmbGVjdGVkIEJpdGluZyBGcm9zdCAxJzogJzREQjcnLCAvLyAyNzAtZGVncmVlIGZyb250YWwgQW9FLCBGcm96ZW4gTWlycm9yXHJcbiAgICAnRThTIFJlZmxlY3RlZCBCaXRpbmcgRnJvc3QgMic6ICc0REMzJywgLy8gMjcwLWRlZ3JlZSBmcm9udGFsIEFvRSwgRnJvemVuIE1pcnJvclxyXG4gICAgJ0U4UyBSZWZsZWN0ZWQgRHJpdmluZyBGcm9zdCAxJzogJzREQjgnLCAvLyBDb25lIEFvRSwgRnJvemVuIE1pcnJvclxyXG4gICAgJ0U4UyBSZWZsZWN0ZWQgRHJpdmluZyBGcm9zdCAyJzogJzREQzQnLCAvLyBDb25lIEFvRSwgRnJvemVuIE1pcnJvclxyXG5cclxuICAgICdFOFMgSGFsbG93ZWQgV2luZ3MgMSc6ICc0RDc1JywgLy8gTGVmdCBjbGVhdmVcclxuICAgICdFOFMgSGFsbG93ZWQgV2luZ3MgMic6ICc0RDc2JywgLy8gUmlnaHQgY2xlYXZlXHJcbiAgICAnRThTIEhhbGxvd2VkIFdpbmdzIDMnOiAnNEQ3NycsIC8vIEtub2NrYmFjayBmcm9udGFsIGNsZWF2ZVxyXG4gICAgJ0U4UyBSZWZsZWN0ZWQgSGFsbG93ZWQgV2luZ3MgMSc6ICc0RDkwJywgLy8gUmVmbGVjdGVkIGxlZnQgMlxyXG4gICAgJ0U4UyBSZWZsZWN0ZWQgSGFsbG93ZWQgV2luZ3MgMic6ICc0REJCJywgLy8gUmVmbGVjdGVkIGxlZnQgMVxyXG4gICAgJ0U4UyBSZWZsZWN0ZWQgSGFsbG93ZWQgV2luZ3MgMyc6ICc0REM3JywgLy8gUmVmbGVjdGVkIHJpZ2h0IDJcclxuICAgICdFOFMgUmVmbGVjdGVkIEhhbGxvd2VkIFdpbmdzIDQnOiAnNEQ5MScsIC8vIFJlZmxlY3RlZCByaWdodCAxXHJcbiAgICAnRThTIFR3aW4gU3RpbGxuZXNzIDEnOiAnNEQ2OCcsXHJcbiAgICAnRThTIFR3aW4gU3RpbGxuZXNzIDInOiAnNEQ2QicsXHJcbiAgICAnRThTIFR3aW4gU2lsZW5jZSAxJzogJzRENjknLFxyXG4gICAgJ0U4UyBUd2luIFNpbGVuY2UgMic6ICc0RDZBJyxcclxuICAgICdFOFMgQWtoIFJoYWknOiAnNEQ5OScsXHJcbiAgICAnRThTIEVtYml0dGVyZWQgRGFuY2UgMSc6ICc0RDcwJyxcclxuICAgICdFOFMgRW1iaXR0ZXJlZCBEYW5jZSAyJzogJzRENzEnLFxyXG4gICAgJ0U4UyBTcGl0ZWZ1bCBEYW5jZSAxJzogJzRENkYnLFxyXG4gICAgJ0U4UyBTcGl0ZWZ1bCBEYW5jZSAyJzogJzRENzInLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgLy8gQnJva2VuIHRldGhlci5cclxuICAgICdFOFMgUmVmdWxnZW50IEZhdGUnOiAnNERBNCcsXHJcbiAgICAvLyBTaGFyZWQgb3JiLCBjb3JyZWN0IGlzIEJyaWdodCBQdWxzZSAoNEQ5NSlcclxuICAgICdFOFMgQmxpbmRpbmcgUHVsc2UnOiAnNEQ5NicsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0U4UyBTaGluaW5nIEFybW9yJyxcclxuICAgICAgLy8gU3R1blxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnOTUnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBJbnRlcnJ1cHRcclxuICAgICAgaWQ6ICdFOFMgU3RvbmVza2luJyxcclxuICAgICAgYWJpbGl0eVJlZ2V4OiAnNEQ4NScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBQcm90ZWFuXHJcbiAgICAgIGlkOiAnRThTIFBhdGggb2YgTGlnaHQnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzREQTEnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zUHJvbWlzZVVtYnJhLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFOU4gVGhlIEFydCBPZiBEYXJrbmVzcyAxJzogJzUyMjMnLCAvLyBsZWZ0LXJpZ2h0IGNsZWF2ZVxyXG4gICAgJ0U5TiBUaGUgQXJ0IE9mIERhcmtuZXNzIDInOiAnNTIyNCcsIC8vIGxlZnQtcmlnaHQgY2xlYXZlXHJcbiAgICAnRTlOIFdpZGUtQW5nbGUgUGFydGljbGUgQmVhbSc6ICc1QUZGJywgLy8gZnJvbnRhbCBjbGVhdmUgdHV0b3JpYWwgbWVjaGFuaWNcclxuICAgICdFOU4gV2lkZS1BbmdsZSBQaGFzZXInOiAnNTVFMScsIC8vIHdpZGUtYW5nbGUgXCJzaWRlc1wiXHJcbiAgICAnRTlOIEJhZCBWaWJyYXRpb25zJzogJzU1RTYnLCAvLyB0ZXRoZXJlZCBvdXRzaWRlIGdpYW50IHRyZWUgZ3JvdW5kIGFvZXNcclxuICAgICdFOU4gRWFydGgtU2hhdHRlcmluZyBQYXJ0aWNsZSBCZWFtJzogJzUyMjUnLCAvLyBtaXNzaW5nIHRvd2Vycz9cclxuICAgICdFOU4gQW50aS1BaXIgUGFydGljbGUgQmVhbSc6ICc1NURDJywgLy8gXCJnZXQgb3V0XCIgZHVyaW5nIHBhbmVsc1xyXG4gICAgJ0U5TiBaZXJvLUZvcm0gUGFydGljbGUgQmVhbSAyJzogJzU1REInLCAvLyBDbG9uZSBsaW5lIGFvZXMgdy8gQW50aS1BaXIgUGFydGljbGUgQmVhbVxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0U5TiBXaXRoZHJhdyc6ICc1NTM0JywgLy8gU2xvdyB0byBicmVhayBzZWVkIGNoYWluLCBnZXQgc3Vja2VkIGJhY2sgaW4geWlrZXNcclxuICAgICdFOU4gQWV0aGVyb3N5bnRoZXNpcyc6ICc1NTM1JywgLy8gU3RhbmRpbmcgb24gc2VlZHMgZHVyaW5nIGV4cGxvc2lvbiAocG9zc2libHkgdmlhIFdpdGhkcmF3KVxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRTlOIFplcm8tRm9ybSBQYXJ0aWNsZSBCZWFtIDEnOiAnNTVFQicsIC8vIHRhbmsgbGFzZXIgd2l0aCBtYXJrZXJcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRPRE86IDU2MUQgRXZpbCBTZWVkIGhpdHMgZXZlcnlvbmUsIGhhcmQgdG8ga25vdyBpZiB0aGVyZSdzIGEgZG91YmxlIHRhcFxyXG4vLyBUT0RPOiBmYWxsaW5nIHRocm91Z2ggcGFuZWwganVzdCBkb2VzIGRhbWFnZSB3aXRoIG5vIGFiaWxpdHkgbmFtZSwgbGlrZSBhIGRlYXRoIHdhbGxcclxuLy8gVE9ETzogd2hhdCBoYXBwZW5zIGlmIHlvdSBqdW1wIGluIHNlZWQgdGhvcm5zP1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zUHJvbWlzZVVtYnJhU2F2YWdlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFOVMgQmFkIFZpYnJhdGlvbnMnOiAnNTYxQycsIC8vIHRldGhlcmVkIG91dHNpZGUgZ2lhbnQgdHJlZSBncm91bmQgYW9lc1xyXG4gICAgJ0U5UyBXaWRlLUFuZ2xlIFBhcnRpY2xlIEJlYW0nOiAnNUIwMCcsIC8vIGFudGktYWlyIFwic2lkZXNcIlxyXG4gICAgJ0U5UyBXaWRlLUFuZ2xlIFBoYXNlciBVbmxpbWl0ZWQnOiAnNTYwRScsIC8vIHdpZGUtYW5nbGUgXCJzaWRlc1wiXHJcbiAgICAnRTlTIEFudGktQWlyIFBhcnRpY2xlIEJlYW0nOiAnNUIwMScsIC8vIHdpZGUtYW5nbGUgXCJvdXRcIlxyXG4gICAgJ0U5UyBUaGUgU2Vjb25kIEFydCBPZiBEYXJrbmVzcyAxJzogJzU2MDEnLCAvLyBsZWZ0LXJpZ2h0IGNsZWF2ZVxyXG4gICAgJ0U5UyBUaGUgU2Vjb25kIEFydCBPZiBEYXJrbmVzcyAyJzogJzU2MDInLCAvLyBsZWZ0LXJpZ2h0IGNsZWF2ZVxyXG4gICAgJ0U5UyBUaGUgQXJ0IE9mIERhcmtuZXNzIDEnOiAnNUE5NScsIC8vIGJvc3MgbGVmdC1yaWdodCBzdW1tb24vcGFuZWwgY2xlYXZlXHJcbiAgICAnRTlTIFRoZSBBcnQgT2YgRGFya25lc3MgMic6ICc1QTk2JywgLy8gYm9zcyBsZWZ0LXJpZ2h0IHN1bW1vbi9wYW5lbCBjbGVhdmVcclxuICAgICdFOVMgVGhlIEFydCBPZiBEYXJrbmVzcyBDbG9uZSAxJzogJzU2MUUnLCAvLyBjbG9uZSBsZWZ0LXJpZ2h0IHN1bW1vbiBjbGVhdmVcclxuICAgICdFOVMgVGhlIEFydCBPZiBEYXJrbmVzcyBDbG9uZSAyJzogJzU2MUYnLCAvLyBjbG9uZSBsZWZ0LXJpZ2h0IHN1bW1vbiBjbGVhdmVcclxuICAgICdFOVMgVGhlIFRoaXJkIEFydCBPZiBEYXJrbmVzcyAxJzogJzU2MDMnLCAvLyB0aGlyZCBhcnQgbGVmdC1yaWdodCBjbGVhdmUgaW5pdGlhbFxyXG4gICAgJ0U5UyBUaGUgVGhpcmQgQXJ0IE9mIERhcmtuZXNzIDInOiAnNTYwNCcsIC8vIHRoaXJkIGFydCBsZWZ0LXJpZ2h0IGNsZWF2ZSBpbml0aWFsXHJcbiAgICAnRTlTIEFydCBPZiBEYXJrbmVzcyc6ICc1NjA2JywgLy8gdGhpcmQgYXJ0IGxlZnQtcmlnaHQgY2xlYXZlIGZpbmFsXHJcbiAgICAnRTlTIEZ1bGwtUGVyaW1pdGVyIFBhcnRpY2xlIEJlYW0nOiAnNTYyOScsIC8vIHBhbmVsIFwiZ2V0IGluXCJcclxuICAgICdFOVMgRGFyayBDaGFpbnMnOiAnNUZBQycsIC8vIFNsb3cgdG8gYnJlYWsgcGFydG5lciBjaGFpbnNcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdFOVMgV2l0aGRyYXcnOiAnNTYxQScsIC8vIFNsb3cgdG8gYnJlYWsgc2VlZCBjaGFpbiwgZ2V0IHN1Y2tlZCBiYWNrIGluIHlpa2VzXHJcbiAgICAnRTlTIEFldGhlcm9zeW50aGVzaXMnOiAnNTYxQicsIC8vIFN0YW5kaW5nIG9uIHNlZWRzIGR1cmluZyBleHBsb3Npb24gKHBvc3NpYmx5IHZpYSBXaXRoZHJhdylcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0U5UyBIeXBlci1Gb2N1c2VkIFBhcnRpY2xlIEJlYW0nOiAnNTVGRCcsIC8vIEFydCBPZiBEYXJrbmVzcyBwcm90ZWFuXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgICdFOVMgQ29uZGVuc2VkIFdpZGUtQW5nbGUgUGFydGljbGUgQmVhbSc6ICc1NjEwJywgLy8gd2lkZS1hbmdsZSBcInRhbmsgbGFzZXJcIlxyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnRTlTIFN0eWdpYW4gVGVuZHJpbHMnOiAnOTUyJywgLy8gc3RhbmRpbmcgaW4gdGhlIGJyYW1ibGVzXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBBcnQgT2YgRGFya25lc3MgUGFydG5lciBTdGFja1xyXG4gICAgICBpZDogJ0U5UyBNdWx0aS1Qcm9uZ2VkIFBhcnRpY2xlIEJlYW0nLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzU2MDAnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgPT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ3dhcm4nLFxyXG4gICAgICAgICAgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoYWxvbmUpYCxcclxuICAgICAgICAgICAgZGU6IGAke21hdGNoZXMuYWJpbGl0eX0gKGFsbGVpbilgLFxyXG4gICAgICAgICAgICBmcjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoc2V1bChlKSlgLFxyXG4gICAgICAgICAgICBqYTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5LiA5Lq6KWAsXHJcbiAgICAgICAgICAgIGNuOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjljZXlkIMpYCxcclxuICAgICAgICAgICAga286IGAke21hdGNoZXMuYWJpbGl0eX0gKO2YvOyekCDrp57snYwpYCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIEFudGktYWlyIFwidGFuayBzcHJlYWRcIi4gIFRoaXMgY2FuIGJlIHN0YWNrZWQgYnkgdHdvIHRhbmtzIGludnVsbmluZy5cclxuICAgICAgLy8gTm90ZTogdGhpcyB3aWxsIHN0aWxsIHNob3cgc29tZXRoaW5nIGZvciBob2xtZ2FuZy9saXZpbmcsIGJ1dFxyXG4gICAgICAvLyBhcmd1YWJseSBhIGhlYWxlciBtaWdodCBuZWVkIHRvIGRvIHNvbWV0aGluZyBhYm91dCB0aGF0LCBzbyBtYXliZVxyXG4gICAgICAvLyBpdCdzIG9rIHRvIHN0aWxsIHNob3cgYXMgYSB3YXJuaW5nPz9cclxuICAgICAgaWQ6ICdFOVMgQ29uZGVuc2VkIEFudGktQWlyIFBhcnRpY2xlIEJlYW0nLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzU2MTUnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScgJiYgZS5kYW1hZ2UgPiAwLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gQW50aS1haXIgXCJvdXRcIi4gIFRoaXMgY2FuIGJlIGludnVsbmVkIGJ5IGEgdGFuayBhbG9uZyB3aXRoIHRoZSBzcHJlYWQgYWJvdmUuXHJcbiAgICAgIGlkOiAnRTlTIEFudGktQWlyIFBoYXNlciBVbmxpbWl0ZWQnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzU2MTInLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLmRhbWFnZSA+IDAsXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zUHJvbWlzZUxpdGFueSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTEwTiBGb3J3YXJkIEltcGxvc2lvbic6ICc1NkI0JywgLy8gaG93bCBib3NzIGltcGxvc2lvblxyXG4gICAgJ0UxME4gRm9yd2FyZCBTaGFkb3cgSW1wbG9zaW9uJzogJzU2QjUnLCAvLyBob3dsIHNoYWRvdyBpbXBsb3Npb25cclxuICAgICdFMTBOIEJhY2t3YXJkIEltcGxvc2lvbic6ICc1NkI3JywgLy8gdGFpbCBib3NzIGltcGxvc2lvblxyXG4gICAgJ0UxME4gQmFja3dhcmQgU2hhZG93IEltcGxvc2lvbic6ICc1NkI4JywgLy8gdGFpbCBzaGFkb3cgaW1wbG9zaW9uXHJcbiAgICAnRTEwTiBCYXJicyBPZiBBZ29ueSAxJzogJzU2RDknLCAvLyBTaGFkb3cgV2FycmlvciAzIGRvZyByb29tIGNsZWF2ZVxyXG4gICAgJ0UxME4gQmFyYnMgT2YgQWdvbnkgMic6ICc1QjI2JywgLy8gU2hhZG93IFdhcnJpb3IgMyBkb2cgcm9vbSBjbGVhdmVcclxuICAgICdFMTBOIENsb2FrIE9mIFNoYWRvd3MnOiAnNUIxMScsIC8vIG5vbi1zcXVpZ2dseSBsaW5lIGV4cGxvc2lvbnNcclxuICAgICdFMTBOIFRocm9uZSBPZiBTaGFkb3cnOiAnNTZDNycsIC8vIHN0YW5kaW5nIHVwIGdldCBvdXRcclxuICAgICdFMTBOIFJpZ2h0IEdpZ2EgU2xhc2gnOiAnNTZBRScsIC8vIGJvc3MgcmlnaHQgZ2lnYSBzbGFzaFxyXG4gICAgJ0UxME4gUmlnaHQgU2hhZG93IFNsYXNoJzogJzU2QUYnLCAvLyBnaWdhIHNsYXNoIGZyb20gc2hhZG93XHJcbiAgICAnRTEwTiBMZWZ0IEdpZ2EgU2xhc2gnOiAnNTZCMScsIC8vIGJvc3MgbGVmdCBnaWdhIHNsYXNoXHJcbiAgICAnRTEwTiBMZWZ0IFNoYWRvdyBTbGFzaCc6ICc1NkJEJywgLy8gZ2lnYSBzbGFzaCBmcm9tIHNoYWRvd1xyXG4gICAgJ0UxME4gU2hhZG93eSBFcnVwdGlvbic6ICc1NkUxJywgLy8gYmFpdGVkIGdyb3VuZCBhb2UgbWFya2VycyBwYWlyZWQgd2l0aCBiYXJic1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRTEwTiBTaGFkb3dcXCdzIEVkZ2UnOiAnNTZEQicsIC8vIFRhbmtidXN0ZXIgc2luZ2xlIHRhcmdldCBmb2xsb3d1cFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBoaXR0aW5nIHNoYWRvdyBvZiB0aGUgaGVybyB3aXRoIGFiaWxpdGllcyBjYW4gY2F1c2UgeW91IHRvIHRha2UgZGFtYWdlLCBsaXN0IHRob3NlP1xyXG4vLyAgICAgICBlLmcuIHBpY2tpbmcgdXAgeW91ciBmaXJzdCBwaXRjaCBib2cgcHVkZGxlIHdpbGwgY2F1c2UgeW91IHRvIGRpZSB0byB0aGUgZGFtYWdlXHJcbi8vICAgICAgIHlvdXIgc2hhZG93IHRha2VzIGZyb20gRGVlcHNoYWRvdyBOb3ZhIG9yIERpc3RhbnQgU2NyZWFtLlxyXG4vLyBUT0RPOiA1NzNCIEJsaWdodGluZyBCbGl0eiBpc3N1ZXMgZHVyaW5nIGxpbWl0IGN1dCBudW1iZXJzXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNQcm9taXNlTGl0YW55U2F2YWdlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFMTBTIEltcGxvc2lvbiBTaW5nbGUgMSc6ICc1NkYyJywgLy8gc2luZ2xlIHRhaWwgdXAgc2hhZG93IGltcGxvc2lvblxyXG4gICAgJ0UxMFMgSW1wbG9zaW9uIFNpbmdsZSAyJzogJzU2RUYnLCAvLyBzaW5nbGUgaG93bCBzaGFkb3cgaW1wbG9zaW9uXHJcbiAgICAnRTEwUyBJbXBsb3Npb24gUXVhZHJ1cGxlIDEnOiAnNTZFRicsIC8vIHF1YWRydXBsZSBzZXQgb2Ygc2hhZG93IGltcGxvc2lvbnNcclxuICAgICdFMTBTIEltcGxvc2lvbiBRdWFkcnVwbGUgMic6ICc1NkYyJywgLy8gcXVhZHJ1cGxlIHNldCBvZiBzaGFkb3cgaW1wbG9zaW9uc1xyXG4gICAgJ0UxMFMgR2lnYSBTbGFzaCBTaW5nbGUgMSc6ICc1NkVDJywgLy8gR2lnYSBzbGFzaCBzaW5nbGUgZnJvbSBzaGFkb3dcclxuICAgICdFMTBTIEdpZ2EgU2xhc2ggU2luZ2xlIDInOiAnNTZFRCcsIC8vIEdpZ2Egc2xhc2ggc2luZ2xlIGZyb20gc2hhZG93XHJcbiAgICAnRTEwUyBHaWdhIFNsYXNoIEJveCAxJzogJzU3MDknLCAvLyBHaWdhIHNsYXNoIGJveCBmcm9tIGZvdXIgZ3JvdW5kIHNoYWRvd3NcclxuICAgICdFMTBTIEdpZ2EgU2xhc2ggQm94IDInOiAnNTcwRCcsIC8vIEdpZ2Egc2xhc2ggYm94IGZyb20gZm91ciBncm91bmQgc2hhZG93c1xyXG4gICAgJ0UxMFMgR2lnYSBTbGFzaCBRdWFkcnVwbGUgMSc6ICc1NkVDJywgLy8gcXVhZHJ1cGxlIHNldCBvZiBnaWdhIHNsYXNoIGNsZWF2ZXNcclxuICAgICdFMTBTIEdpZ2EgU2xhc2ggUXVhZHJ1cGxlIDInOiAnNTZFOScsIC8vIHF1YWRydXBsZSBzZXQgb2YgZ2lnYSBzbGFzaCBjbGVhdmVzXHJcbiAgICAnRTEwUyBDbG9hayBPZiBTaGFkb3dzIDEnOiAnNUIxMycsIC8vIGluaXRpYWwgbm9uLXNxdWlnZ2x5IGxpbmUgZXhwbG9zaW9uc1xyXG4gICAgJ0UxMFMgQ2xvYWsgT2YgU2hhZG93cyAyJzogJzVCMTQnLCAvLyBzZWNvbmQgc3F1aWdnbHkgbGluZSBleHBsb3Npb25zXHJcbiAgICAnRTEwUyBUaHJvbmUgT2YgU2hhZG93JzogJzU3MTcnLCAvLyBzdGFuZGluZyB1cCBnZXQgb3V0XHJcbiAgICAnRTEwUyBTaGFkb3d5IEVydXB0aW9uJzogJzU3MzgnLCAvLyBiYWl0ZWQgZ3JvdW5kIGFvZSBkdXJpbmcgYW1wbGlmaWVyXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRTEwUyBTd2F0aCBPZiBTaWxlbmNlIDEnOiAnNTcxQScsIC8vIFNoYWRvdyBjbG9uZSBjbGVhdmUgKHRvbyBjbG9zZSlcclxuICAgICdFMTBTIFN3YXRoIE9mIFNpbGVuY2UgMic6ICc1QkJGJywgLy8gU2hhZG93IGNsb25lIGNsZWF2ZSAodGltZWQpXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdFMTBTIFNoYWRlZmlyZSc6ICc1NzMyJywgLy8gcHVycGxlIHRhbmsgdW1icmFsIG9yYnNcclxuICAgICdFMTBTIFBpdGNoIEJvZyc6ICc1NzIyJywgLy8gbWFya2VyIHNwcmVhZCB0aGF0IGRyb3BzIGEgc2hhZG93IHB1ZGRsZVxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnRTEwUyBTaGFkb3dcXCdzIEVkZ2UnOiAnNTcyNScsIC8vIFRhbmtidXN0ZXIgc2luZ2xlIHRhcmdldCBmb2xsb3d1cFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTBTIERhbWFnZSBEb3duIE9yYnMnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IHNvdXJjZTogJ0ZsYW1lc2hhZG93JywgZWZmZWN0SWQ6ICc4MkMnIH0pLFxyXG4gICAgICBuZXRSZWdleERlOiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgc291cmNlOiAnU2NoYXR0ZW5mbGFtbWUnLCBlZmZlY3RJZDogJzgyQycgfSksXHJcbiAgICAgIG5ldFJlZ2V4RnI6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBzb3VyY2U6ICdGbGFtbWUgb21icmFsZScsIGVmZmVjdElkOiAnODJDJyB9KSxcclxuICAgICAgbmV0UmVnZXhKYTogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IHNvdXJjZTogJ+OCt+ODo+ODieOCpuODleODrOOCpOODoCcsIGVmZmVjdElkOiAnODJDJyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdkYW1hZ2UnLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IGAke21hdGNoZXMuZWZmZWN0fSAocGFydGlhbCBzdGFjaylgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0UxMFMgRGFtYWdlIERvd24gQm9zcycsXHJcbiAgICAgIC8vIFNoYWNrbGVzIGJlaW5nIG1lc3NlZCB1cCBhcHBlYXIgdG8ganVzdCBnaXZlIHRoZSBEYW1hZ2UgRG93biwgd2l0aCBub3RoaW5nIGVsc2UuXHJcbiAgICAgIC8vIE1lc3NpbmcgdXAgdG93ZXJzIGlzIHRoZSBUaHJpY2UtQ29tZSBSdWluIGVmZmVjdCAoOUUyKSwgYnV0IGFsc28gRGFtYWdlIERvd24uXHJcbiAgICAgIC8vIFRPRE86IHNvbWUgb2YgdGhlc2Ugd2lsbCBiZSBkdXBsaWNhdGVkIHdpdGggb3RoZXJzLCBsaWtlIGBFMTBTIFRocm9uZSBPZiBTaGFkb3dgLlxyXG4gICAgICAvLyBNYXliZSBpdCdkIGJlIG5pY2UgdG8gZmlndXJlIG91dCBob3cgdG8gcHV0IHRoZSBkYW1hZ2UgbWFya2VyIG9uIHRoYXQ/XHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgc291cmNlOiAnU2hhZG93a2VlcGVyJywgZWZmZWN0SWQ6ICc4MkMnIH0pLFxyXG4gICAgICBuZXRSZWdleERlOiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgc291cmNlOiAnU2NoYXR0ZW5rw7ZuaWcnLCBlZmZlY3RJZDogJzgyQycgfSksXHJcbiAgICAgIG5ldFJlZ2V4RnI6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBzb3VyY2U6ICdSb2kgRGUgTFxcJ09tYnJlJywgZWZmZWN0SWQ6ICc4MkMnIH0pLFxyXG4gICAgICBuZXRSZWdleEphOiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgc291cmNlOiAn5b2x44Gu546LJywgZWZmZWN0SWQ6ICc4MkMnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2RhbWFnZScsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogYCR7bWF0Y2hlcy5lZmZlY3R9YCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gU2hhZG93IFdhcnJpb3IgNCBkb2cgcm9vbSBjbGVhdmVcclxuICAgICAgLy8gVGhpcyBjYW4gYmUgbWl0aWdhdGVkIGJ5IHRoZSB3aG9sZSBncm91cCwgc28gYWRkIGEgZGFtYWdlIGNvbmRpdGlvbi5cclxuICAgICAgaWQ6ICdFMTBTIEJhcmJzIE9mIEFnb255JyxcclxuICAgICAgZGFtYWdlUmVnZXg6IFsnNTcyQScsICc1QjI3J10sXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IGUuZGFtYWdlID4gMCxcclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmFiaWxpdHkgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc1Byb21pc2VBbmFtb3JwaG9zaXMsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0UxMU4gQnVybnQgU3RyaWtlIExpZ2h0bmluZyc6ICc1NjJFJywgLy8gTGluZSBjbGVhdmVcclxuICAgICdFMTFOIEJ1cm50IFN0cmlrZSBGaXJlJzogJzU2MkMnLCAvLyBMaW5lIGNsZWF2ZVxyXG4gICAgJ0UxMU4gQnVybnQgU3RyaWtlIEhvbHknOiAnNTYzMCcsIC8vIExpbmUgY2xlYXZlXHJcbiAgICAnRTExTiBCdXJub3V0JzogJzU2MkYnLCAvLyBCdXJudCBTdHJpa2UgbGlnaHRuaW5nIGV4cGFuc2lvblxyXG4gICAgJ0UxMU4gU2hpbmluZyBCbGFkZSc6ICc1NjMxJywgLy8gQmFpdGVkIGV4cGxvc2lvblxyXG4gICAgJ0UxMU4gSGFsbyBPZiBGbGFtZSBCcmlnaHRmaXJlJzogJzU2M0InLCAvLyBSZWQgY2lyY2xlIGludGVybWlzc2lvbiBleHBsb3Npb25cclxuICAgICdFMTFOIEhhbG8gT2YgTGV2aW4gQnJpZ2h0ZmlyZSc6ICc1NjNDJywgLy8gQmx1ZSBjaXJjbGUgaW50ZXJtaXNzaW9uIGV4cGxvc2lvblxyXG4gICAgJ0UxMU4gUmVzb3VuZGluZyBDcmFjayc6ICc1NjREJywgLy8gRGVtaS1HdWt1bWF0eiAyNzAgZGVncmVlIGZyb250YWwgY2xlYXZlXHJcbiAgICAnRTExTiBJbWFnZSBCdXJudCBTdHJpa2UgTGlnaHRuaW5nJzogJzU2NDUnLCAvLyBGYXRlIEJyZWFrZXIncyBJbWFnZSBsaW5lIGNsZWF2ZVxyXG4gICAgJ0UxMU4gSW1hZ2UgQnVybnQgU3RyaWtlIEZpcmUnOiAnNTY0MycsIC8vIEZhdGUgQnJlYWtlcidzIEltYWdlIGxpbmUgY2xlYXZlXHJcbiAgICAnRTExTiBJbWFnZSBCdXJub3V0JzogJzU2NDYnLCAvLyBGYXRlIEJyZWFrZXIncyBJbWFnZSBsaWdodG5pbmcgZXhwYW5zaW9uXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRTExTiBCbGFzdGluZyBab25lJzogJzU2M0UnLCAvLyBQcmlzbWF0aWMgRGVjZXB0aW9uIGNoYXJnZXNcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0UxMU4gQnVybiBNYXJrJzogJzU2NEYnLCAvLyBQb3dkZXIgTWFyayBkZWJ1ZmYgZXhwbG9zaW9uXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0UxMU4gQmxhc3RidXJuIEtub2NrZWQgT2ZmJyxcclxuICAgICAgLy8gNTYyRCA9IEJ1cm50IFN0cmlrZSBmaXJlIGZvbGxvd3VwIGR1cmluZyBtb3N0IG9mIHRoZSBmaWdodFxyXG4gICAgICAvLyA1NjQ0ID0gc2FtZSB0aGluZywgYnV0IGZyb20gRmF0ZWJyZWFrZXIncyBJbWFnZVxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6IFsnNTYyRCcsICc1NjQ0J10gfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnS25vY2tlZCBvZmYnLFxyXG4gICAgICAgICAgICBkZTogJ1J1bnRlcmdlZmFsbGVuJyxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIGFzc29tbcOpKGUpJyxcclxuICAgICAgICAgICAgamE6ICfjg47jg4Pjgq/jg5Djg4Pjgq8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICAgIGtvOiAn64SJ67CxJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIDU2NUEvNTY4RCBTaW5zbW9rZSBCb3VuZCBPZiBGYWl0aCBzaGFyZVxyXG4vLyA1NjVFLzU2OTkgQm93c2hvY2sgaGl0cyB0YXJnZXQgb2YgNTY1RCAodHdpY2UpIGFuZCB0d28gb3RoZXJzXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNQcm9taXNlQW5hbW9ycGhvc2lzU2F2YWdlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFMTFTIEJ1cm50IFN0cmlrZSBGaXJlJzogJzU2NTInLCAvLyBMaW5lIGNsZWF2ZVxyXG4gICAgJ0UxMVMgQnVybnQgU3RyaWtlIExpZ2h0bmluZyc6ICc1NjU0JywgLy8gTGluZSBjbGVhdmVcclxuICAgICdFMTFTIEJ1cm50IFN0cmlrZSBIb2x5JzogJzU2NTYnLCAvLyBMaW5lIGNsZWF2ZVxyXG4gICAgJ0UxMVMgU2hpbmluZyBCbGFkZSc6ICc1NjU3JywgLy8gQmFpdGVkIGV4cGxvc2lvblxyXG4gICAgJ0UxMVMgQnVybnQgU3RyaWtlIEN5Y2xlIEZpcmUnOiAnNTY4RScsIC8vIExpbmUgY2xlYXZlIGR1cmluZyBDeWNsZVxyXG4gICAgJ0UxMVMgQnVybnQgU3RyaWtlIEN5Y2xlIExpZ2h0bmluZyc6ICc1Njk1JywgLy8gTGluZSBjbGVhdmUgZHVyaW5nIEN5Y2xlXHJcbiAgICAnRTExUyBCdXJudCBTdHJpa2UgQ3ljbGUgSG9seSc6ICc1NjlEJywgLy8gTGluZSBjbGVhdmUgZHVyaW5nIEN5Y2xlXHJcbiAgICAnRTExUyBTaGluaW5nIEJsYWRlIEN5Y2xlJzogJzU2OUUnLCAvLyBCYWl0ZWQgZXhwbG9zaW9uIGR1cmluZyBDeWNsZVxyXG4gICAgJ0UxMVMgSGFsbyBPZiBGbGFtZSBCcmlnaHRmaXJlJzogJzU2NkQnLCAvLyBSZWQgY2lyY2xlIGludGVybWlzc2lvbiBleHBsb3Npb25cclxuICAgICdFMTFTIEhhbG8gT2YgTGV2aW4gQnJpZ2h0ZmlyZSc6ICc1NjZDJywgLy8gQmx1ZSBjaXJjbGUgaW50ZXJtaXNzaW9uIGV4cGxvc2lvblxyXG4gICAgJ0UxMVMgUG9ydGFsIE9mIEZsYW1lIEJyaWdodCBQdWxzZSc6ICc1NjcxJywgLy8gUmVkIGNhcmQgaW50ZXJtaXNzaW9uIGV4cGxvc2lvblxyXG4gICAgJ0UxMVMgUG9ydGFsIE9mIExldmluIEJyaWdodCBQdWxzZSc6ICc1NjcwJywgLy8gQmx1ZSBjYXJkIGludGVybWlzc2lvbiBleHBsb3Npb25cclxuICAgICdFMTFTIFJlc29uYW50IFdpbmRzJzogJzU2ODknLCAvLyBEZW1pLUd1a3VtYXR6IFwiZ2V0IGluXCJcclxuICAgICdFMTFTIFJlc291bmRpbmcgQ3JhY2snOiAnNTY4OCcsIC8vIERlbWktR3VrdW1hdHogMjcwIGRlZ3JlZSBmcm9udGFsIGNsZWF2ZVxyXG4gICAgJ0UxMVMgSW1hZ2UgQnVybnQgU3RyaWtlIExpZ2h0bmluZyc6ICc1NjdCJywgLy8gRmF0ZSBCcmVha2VyJ3MgSW1hZ2UgbGluZSBjbGVhdmVcclxuICAgICdFMTFOIEltYWdlIEJ1cm5vdXQnOiAnNTY3QycsIC8vIEZhdGUgQnJlYWtlcidzIEltYWdlIGxpZ2h0bmluZyBleHBhbnNpb25cclxuICAgICdFMTFOIEltYWdlIEJ1cm50IFN0cmlrZSBGaXJlJzogJzU2NzknLCAvLyBGYXRlIEJyZWFrZXIncyBJbWFnZSBsaW5lIGNsZWF2ZVxyXG4gICAgJ0UxMU4gSW1hZ2UgQnVybnQgU3RyaWtlIEhvbHknOiAnNTY3QicsIC8vIEZhdGUgQnJlYWtlcidzIEltYWdlIGxpbmUgY2xlYXZlXHJcbiAgICAnRTExTiBJbWFnZSBTaGluaW5nIEJsYWRlJzogJzU2N0UnLCAvLyBGYXRlIEJyZWFrZXIncyBJbWFnZSBiYWl0ZWQgZXhwbG9zaW9uXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRTExUyBCdXJub3V0JzogJzU2NTUnLCAvLyBCdXJudCBTdHJpa2UgbGlnaHRuaW5nIGV4cGFuc2lvblxyXG4gICAgJ0UxMVMgQnVybm91dCBDeWNsZSc6ICc1Njk2JywgLy8gQnVybnQgU3RyaWtlIGxpZ2h0bmluZyBleHBhbnNpb25cclxuICAgICdFMTFTIEJsYXN0aW5nIFpvbmUnOiAnNTY3NCcsIC8vIFByaXNtYXRpYyBEZWNlcHRpb24gY2hhcmdlc1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRTExUyBFbGVtZW50YWwgQnJlYWsnOiAnNTY2NCcsIC8vIEVsZW1lbnRhbCBCcmVhayBwcm90ZWFuXHJcbiAgICAnRTExUyBFbGVtZW50YWwgQnJlYWsgQ3ljbGUnOiAnNTY4QycsIC8vIEVsZW1lbnRhbCBCcmVhayBwcm90ZWFuIGR1cmluZyBDeWNsZVxyXG4gICAgJ0UxMVMgU2luc21pdGUnOiAnNTY2NycsIC8vIExpZ2h0bmluZyBFbGVtZW50YWwgQnJlYWsgc3ByZWFkXHJcbiAgICAnRTExUyBTaW5zbWl0ZSBDeWNsZSc6ICc1Njk0JywgLy8gTGlnaHRuaW5nIEVsZW1lbnRhbCBCcmVhayBzcHJlYWQgZHVyaW5nIEN5Y2xlXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgICdFMTFTIEJ1cm4gTWFyayc6ICc1NkEzJywgLy8gUG93ZGVyIE1hcmsgZGVidWZmIGV4cGxvc2lvblxyXG4gICAgJ0UxMVMgU2luc2lnaHQgMSc6ICc1NjYxJywgLy8gSG9seSBCb3VuZCBPZiBGYWl0aCB0ZXRoZXJcclxuICAgICdFMTFTIFNpbnNpZ2h0IDInOiAnNUJDNycsIC8vIEhvbHkgQm91bmQgT2YgRmFpdGggdGV0aGVyIGZyb20gRmF0ZWJyZWFrZXIncyBJbWFnZVxyXG4gICAgJ0UxMVMgU2luc2lnaHQgMyc6ICc1NkEwJywgLy8gSG9seSBCb3VuZCBPZiBGYWl0aCB0ZXRoZXIgZHVyaW5nIEN5Y2xlXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0UxMVMgSG9seSBTaW5zaWdodCBHcm91cCBTaGFyZScsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNTY2OScsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IGUudHlwZSA9PT0gJzE1JyxcclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiBgJHttYXRjaGVzLmFiaWxpdHl9IChhbG9uZSlgLFxyXG4gICAgICAgICAgICBkZTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoYWxsZWluKWAsXHJcbiAgICAgICAgICAgIGZyOiBgJHttYXRjaGVzLmFiaWxpdHl9IChzZXVsKGUpKWAsXHJcbiAgICAgICAgICAgIGphOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjkuIDkuropYCxcclxuICAgICAgICAgICAgY246IGAke21hdGNoZXMuYWJpbGl0eX0gKOWNleWQgylgLFxyXG4gICAgICAgICAgICBrbzogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo7Zi87J6QIOunnuydjClgLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTFTIEJsYXN0YnVybiBLbm9ja2VkIE9mZicsXHJcbiAgICAgIC8vIDU2NTMgPSBCdXJudCBTdHJpa2UgZmlyZSBmb2xsb3d1cCBkdXJpbmcgbW9zdCBvZiB0aGUgZmlnaHRcclxuICAgICAgLy8gNTY3QSA9IHNhbWUgdGhpbmcsIGJ1dCBmcm9tIEZhdGVicmVha2VyJ3MgSW1hZ2VcclxuICAgICAgLy8gNTY4RiA9IHNhbWUgdGhpbmcsIGJ1dCBkdXJpbmcgQ3ljbGUgb2YgRmFpdGhcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiBbJzU2NTMnLCAnNTY3QScsICc1NjhGJ10gfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnS25vY2tlZCBvZmYnLFxyXG4gICAgICAgICAgICBkZTogJ1J1bnRlcmdlZmFsbGVuJyxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIGFzc29tbcOpKGUpJyxcclxuICAgICAgICAgICAgamE6ICfjg47jg4Pjgq/jg5Djg4Pjgq8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICAgIGtvOiAn64SJ67CxJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNQcm9taXNlRXRlcm5pdHksXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0UxMk4gSnVkZ21lbnQgSm9sdCBTaW5nbGUnOiAnNTg1RicsIC8vIFJhbXVoIGdldCBvdXQgY2FzdFxyXG4gICAgJ0UxMk4gSnVkZ21lbnQgSm9sdCc6ICc0RTMwJywgLy8gUmFtdWggZ2V0IG91dCBjYXN0XHJcbiAgICAnRTEyTiBUZW1wb3JhcnkgQ3VycmVudCBTaW5nbGUnOiAnNTg1QycsIC8vIExldmkgZ2V0IHVuZGVyIGNhc3RcclxuICAgICdFMTJOIFRlbXBvcmFyeSBDdXJyZW50JzogJzRFMkQnLCAvLyBMZXZpIGdldCB1bmRlciBjYXN0XHJcbiAgICAnRTEyTiBDb25mbGFnIFN0cmlrZSBTaW5nbGUnOiAnNTg1RCcsIC8vIElmcml0IGdldCBzaWRlcyBjYXN0XHJcbiAgICAnRTEyTiBDb25mbGFnIFN0cmlrZSc6ICc0RTJFJywgLy8gSWZyaXQgZ2V0IHNpZGVzIGNhc3RcclxuICAgICdFMTJOIEZlcm9zdG9ybSBTaW5nbGUnOiAnNTg1RScsIC8vIEdhcnVkYSBnZXQgaW50ZXJjYXJkaW5hbHMgY2FzdFxyXG4gICAgJ0UxMk4gRmVyb3N0b3JtJzogJzRFMkYnLCAvLyBHYXJ1ZGEgZ2V0IGludGVyY2FyZGluYWxzIGNhc3RcclxuICAgICdFMTJOIFJhcHR1cm91cyBSZWFjaCAxJzogJzU4NzgnLCAvLyBIYWlyY3V0XHJcbiAgICAnRTEyTiBSYXB0dXJvdXMgUmVhY2ggMic6ICc1ODc3JywgLy8gSGFpcmN1dFxyXG4gICAgJ0UxMk4gQm9tYiBFeHBsb3Npb24nOiAnNTg2RCcsIC8vIFNtYWxsIGJvbWIgZXhwbG9zaW9uXHJcbiAgICAnRTEyTiBUaXRhbmljIEJvbWIgRXhwbG9zaW9uJzogJzU4NkYnLCAvLyBMYXJnZSBib21iIGV4cGxvc2lvblxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRTEyTiBFYXJ0aHNoYWtlcic6ICc1ODg1JywgLy8gRWFydGhzaGFrZXIgb24gZmlyc3QgcGxhdGZvcm1cclxuICAgICdFMTJOIFByb21pc2UgRnJpZ2lkIFN0b25lIDEnOiAnNTg2NycsIC8vIFNoaXZhIHNwcmVhZCB3aXRoIHNsaWRpbmdcclxuICAgICdFMTJOIFByb21pc2UgRnJpZ2lkIFN0b25lIDInOiAnNTg2OScsIC8vIFNoaXZhIHNwcmVhZCB3aXRoIFJhcHR1cm91cyBSZWFjaFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IE91dHB1dHMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL291dHB1dHMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRPRE86IGFkZCBzZXBhcmF0ZSBkYW1hZ2VXYXJuLWVzcXVlIGljb24gZm9yIGRhbWFnZSBkb3ducz9cclxuLy8gVE9ETzogNThBNiBVbmRlciBUaGUgV2VpZ2h0IC8gNThCMiBDbGFzc2ljYWwgU2N1bHB0dXJlIG1pc3Npbmcgc29tZWJvZHkgaW4gcGFydHkgd2FybmluZz9cclxuLy8gVE9ETzogNThDQSBEYXJrIFdhdGVyIElJSSAvIDU4QzUgU2hlbGwgQ3J1c2hlciBzaG91bGQgaGl0IGV2ZXJ5b25lIGluIHBhcnR5XHJcbi8vIFRPRE86IERhcmsgQWVybyBJSUkgNThENCBzaG91bGQgbm90IGJlIGEgc2hhcmUgZXhjZXB0IG9uIGFkdmFuY2VkIHJlbGF0aXZpdHkgZm9yIGRvdWJsZSBhZXJvLlxyXG4vLyAoZm9yIGdhaW5zIGVmZmVjdCwgc2luZ2xlIGFlcm8gPSB+MjMgc2Vjb25kcywgZG91YmxlIGFlcm8gPSB+MzEgc2Vjb25kcyBkdXJhdGlvbilcclxuXHJcbi8vIER1ZSB0byBjaGFuZ2VzIGludHJvZHVjZWQgaW4gcGF0Y2ggNS4yLCBvdmVyaGVhZCBtYXJrZXJzIG5vdyBoYXZlIGEgcmFuZG9tIG9mZnNldFxyXG4vLyBhZGRlZCB0byB0aGVpciBJRC4gVGhpcyBvZmZzZXQgY3VycmVudGx5IGFwcGVhcnMgdG8gYmUgc2V0IHBlciBpbnN0YW5jZSwgc29cclxuLy8gd2UgY2FuIGRldGVybWluZSB3aGF0IGl0IGlzIGZyb20gdGhlIGZpcnN0IG92ZXJoZWFkIG1hcmtlciB3ZSBzZWUuXHJcbi8vIFRoZSBmaXJzdCAxQiBtYXJrZXIgaW4gdGhlIGVuY291bnRlciBpcyB0aGUgZm9ybWxlc3MgdGFua2J1c3RlciwgSUQgMDA0Ri5cclxuY29uc3QgZmlyc3RIZWFkbWFya2VyID0gcGFyc2VJbnQoJzAwREEnLCAxNik7XHJcbmNvbnN0IGdldEhlYWRtYXJrZXJJZCA9IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgLy8gSWYgd2UgbmFpdmVseSBqdXN0IGNoZWNrICFkYXRhLmRlY09mZnNldCBhbmQgbGVhdmUgaXQsIGl0IGJyZWFrcyBpZiB0aGUgZmlyc3QgbWFya2VyIGlzIDAwREEuXHJcbiAgLy8gKFRoaXMgbWFrZXMgdGhlIG9mZnNldCAwLCBhbmQgITAgaXMgdHJ1ZS4pXHJcbiAgaWYgKHR5cGVvZiBkYXRhLmRlY09mZnNldCA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICBkYXRhLmRlY09mZnNldCA9IHBhcnNlSW50KG1hdGNoZXMuaWQsIDE2KSAtIGZpcnN0SGVhZG1hcmtlcjtcclxuICAvLyBUaGUgbGVhZGluZyB6ZXJvZXMgYXJlIHN0cmlwcGVkIHdoZW4gY29udmVydGluZyBiYWNrIHRvIHN0cmluZywgc28gd2UgcmUtYWRkIHRoZW0gaGVyZS5cclxuICAvLyBGb3J0dW5hdGVseSwgd2UgZG9uJ3QgaGF2ZSB0byB3b3JyeSBhYm91dCB3aGV0aGVyIG9yIG5vdCB0aGlzIGlzIHJvYnVzdCxcclxuICAvLyBzaW5jZSB3ZSBrbm93IGFsbCB0aGUgSURzIHRoYXQgd2lsbCBiZSBwcmVzZW50IGluIHRoZSBlbmNvdW50ZXIuXHJcbiAgcmV0dXJuIChwYXJzZUludChtYXRjaGVzLmlkLCAxNikgLSBkYXRhLmRlY09mZnNldCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkucGFkU3RhcnQoNCwgJzAnKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc1Byb21pc2VFdGVybml0eVNhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTEyUyBQcm9taXNlIFJhcHR1cm91cyBSZWFjaCBMZWZ0JzogJzU4QUQnLCAvLyBIYWlyY3V0IHdpdGggbGVmdCBzYWZlIHNpZGVcclxuICAgICdFMTJTIFByb21pc2UgUmFwdHVyb3VzIFJlYWNoIFJpZ2h0JzogJzU4QUUnLCAvLyBIYWlyY3V0IHdpdGggcmlnaHQgc2FmZSBzaWRlXHJcbiAgICAnRTEyUyBQcm9taXNlIFRlbXBvcmFyeSBDdXJyZW50JzogJzRFNDQnLCAvLyBMZXZpIGdldCB1bmRlciBjYXN0IChkYW1hZ2UgZG93bilcclxuICAgICdFMTJTIFByb21pc2UgQ29uZmxhZyBTdHJpa2UnOiAnNEU0NScsIC8vIElmcml0IGdldCBzaWRlcyBjYXN0IChkYW1hZ2UgZG93bilcclxuICAgICdFMTJTIFByb21pc2UgRmVyb3N0b3JtJzogJzRFNDYnLCAvLyBHYXJ1ZGEgZ2V0IGludGVyY2FyZGluYWxzIGNhc3QgKGRhbWFnZSBkb3duKVxyXG4gICAgJ0UxMlMgUHJvbWlzZSBKdWRnbWVudCBKb2x0JzogJzRFNDcnLCAvLyBSYW11aCBnZXQgb3V0IGNhc3QgKGRhbWFnZSBkb3duKVxyXG4gICAgJ0UxMlMgUHJvbWlzZSBTaGF0dGVyJzogJzU4OUMnLCAvLyBJY2UgUGlsbGFyIGV4cGxvc2lvbiBpZiB0ZXRoZXIgbm90IGdvdHRlblxyXG4gICAgJ0UxMlMgUHJvbWlzZSBJbXBhY3QnOiAnNThBMScsIC8vIFRpdGFuIGJvbWIgZHJvcFxyXG4gICAgJ0UxMlMgT3JhY2xlIERhcmsgQmxpenphcmQgSUlJJzogJzU4RDMnLCAvLyBSZWxhdGl2aXR5IGRvbnV0IG1lY2hhbmljXHJcbiAgICAnRTEyUyBPcmFjbGUgQXBvY2FseXBzZSc6ICc1OEU2JywgLy8gTGlnaHQgdXAgY2lyY2xlIGV4cGxvc2lvbnMgKGRhbWFnZSBkb3duKVxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0UxMlMgT3JhY2xlIE1hZWxzdHJvbSc6ICc1OERBJywgLy8gQWR2YW5jZWQgUmVsYXRpdml0eSB0cmFmZmljIGxpZ2h0IGFvZVxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRTEyUyBQcm9taXNlIEZyaWdpZCBTdG9uZSc6ICc1ODlFJywgLy8gU2hpdmEgc3ByZWFkXHJcbiAgICAnRTEyUyBPcmFjbGUgRGFya2VzdCBEYW5jZSc6ICc0RTMzJywgLy8gRmFydGhlc3QgdGFyZ2V0IGJhaXQgKyBqdW1wIGJlZm9yZSBrbm9ja2JhY2tcclxuICAgICdFMTJTIE9yYWNsZSBEYXJrIEN1cnJlbnQnOiAnNThEOCcsIC8vIEJhaXRlZCB0cmFmZmljIGxpZ2h0IGxhc2Vyc1xyXG4gICAgJ0UxMlMgT3JhY2xlIFNwaXJpdCBUYWtlcic6ICc1OEM2JywgLy8gUmFuZG9tIGp1bXAgc3ByZWFkIG1lY2hhbmljIGFmdGVyIFNoZWxsIENydXNoZXJcclxuICAgICdFMTJTIE9yYWNsZSBTb21iZXIgRGFuY2UgMSc6ICc1OEJGJywgLy8gRmFydGhlc3QgdGFyZ2V0IGJhaXQgZm9yIER1YWwgQXBvY2FseXBzZVxyXG4gICAgJ0UxMlMgT3JhY2xlIFNvbWJlciBEYW5jZSAyJzogJzU4QzAnLCAvLyBTZWNvbmQgc29tYmVyIGRhbmNlIGp1bXBcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgJ0UxMlMgUHJvbWlzZSBXZWlnaHQgT2YgVGhlIFdvcmxkJzogJzU4QTUnLCAvLyBUaXRhbiBib21iIGJsdWUgbWFya2VyXHJcbiAgICAnRTEyUyBQcm9taXNlIFB1bHNlIE9mIFRoZSBMYW5kJzogJzU4QTMnLCAvLyBUaXRhbiBib21iIHllbGxvdyBtYXJrZXJcclxuICAgICdFMTJTIE9yYWNsZSBEYXJrIEVydXB0aW9uIDEnOiAnNThDRScsIC8vIEluaXRpYWwgd2FybXVwIHNwcmVhZCBtZWNoYW5pY1xyXG4gICAgJ0UxMlMgT3JhY2xlIERhcmsgRXJ1cHRpb24gMic6ICc1OENEJywgLy8gUmVsYXRpdml0eSBzcHJlYWQgbWVjaGFuaWNcclxuICAgICdFMTJTIE9yYWNsZSBCbGFjayBIYWxvJzogJzU4QzcnLCAvLyBUYW5rYnVzdGVyIGNsZWF2ZVxyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RGYWlsOiB7XHJcbiAgICAnRTEyUyBPcmFjbGUgRG9vbSc6ICc5RDQnLCAvLyBSZWxhdGl2aXR5IHB1bmlzaG1lbnQgZm9yIG11bHRpcGxlIG1pc3Rha2VzXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBCaWcgY2lyY2xlIGdyb3VuZCBhb2VzIGR1cmluZyBTaGl2YSBqdW5jdGlvbi5cclxuICAgICAgLy8gVGhpcyBjYW4gYmUgc2hpZWxkZWQgdGhyb3VnaCBhcyBsb25nIGFzIHRoYXQgcGVyc29uIGRvZXNuJ3Qgc3RhY2suXHJcbiAgICAgIGlkOiAnRTEyUyBJY2ljbGUgSW1wYWN0JyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICc0RTVBJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSkgPT4gZS5kYW1hZ2UgPiAwLFxyXG4gICAgICBtaXN0YWtlOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIEhlYWRtYXJrZXInLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5oZWFkTWFya2VyKHt9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBjb25zdCBpZCA9IGdldEhlYWRtYXJrZXJJZChkYXRhLCBtYXRjaGVzKTtcclxuICAgICAgICBjb25zdCBmaXJzdExhc2VyTWFya2VyID0gJzAwOTEnO1xyXG4gICAgICAgIGNvbnN0IGxhc3RMYXNlck1hcmtlciA9ICcwMDk4JztcclxuICAgICAgICBpZiAoaWQgPj0gZmlyc3RMYXNlck1hcmtlciAmJiBpZCA8PSBsYXN0TGFzZXJNYXJrZXIpIHtcclxuICAgICAgICAgIC8vIGlkcyBhcmUgc2VxdWVudGlhbDogIzEgc3F1YXJlLCAjMiBzcXVhcmUsICMzIHNxdWFyZSwgIzQgc3F1YXJlLCAjMSB0cmlhbmdsZSBldGNcclxuICAgICAgICAgIGNvbnN0IGRlY09mZnNldCA9IHBhcnNlSW50KGlkLCAxNikgLSBwYXJzZUludChmaXJzdExhc2VyTWFya2VyLCAxNik7XHJcblxyXG4gICAgICAgICAgLy8gZGVjT2Zmc2V0IGlzIDAtNywgc28gbWFwIDAtMyB0byAxLTQgYW5kIDQtNyB0byAxLTQuXHJcbiAgICAgICAgICBkYXRhLmxhc2VyTmFtZVRvTnVtID0gZGF0YS5sYXNlck5hbWVUb051bSB8fCB7fTtcclxuICAgICAgICAgIGRhdGEubGFzZXJOYW1lVG9OdW1bbWF0Y2hlcy50YXJnZXRdID0gZGVjT2Zmc2V0ICUgNCArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gVGhlc2Ugc2N1bHB0dXJlcyBhcmUgYWRkZWQgYXQgdGhlIHN0YXJ0IG9mIHRoZSBmaWdodCwgc28gd2UgbmVlZCB0byBjaGVjayB3aGVyZSB0aGV5XHJcbiAgICAgIC8vIHVzZSB0aGUgXCJDbGFzc2ljYWwgU2N1bHB0dXJlXCIgYWJpbGl0eSBhbmQgZW5kIHVwIG9uIHRoZSBhcmVuYSBmb3IgcmVhbC5cclxuICAgICAgaWQ6ICdFMTJTIFByb21pc2UgQ2hpc2VsZWQgU2N1bHB0dXJlIENsYXNzaWNhbCBTY3VscHR1cmUnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IHNvdXJjZTogJ0NoaXNlbGVkIFNjdWxwdHVyZScsIGlkOiAnNThCMicgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgLy8gVGhpcyB3aWxsIHJ1biBwZXIgcGVyc29uIHRoYXQgZ2V0cyBoaXQgYnkgdGhlIHNhbWUgc2N1bHB0dXJlLCBidXQgdGhhdCdzIGZpbmUuXHJcbiAgICAgICAgLy8gUmVjb3JkIHRoZSB5IHBvc2l0aW9uIG9mIGVhY2ggc2N1bHB0dXJlIHNvIHdlIGNhbiB1c2UgaXQgZm9yIGJldHRlciB0ZXh0IGxhdGVyLlxyXG4gICAgICAgIGRhdGEuc2N1bHB0dXJlWVBvc2l0aW9ucyA9IGRhdGEuc2N1bHB0dXJlWVBvc2l0aW9ucyB8fCB7fTtcclxuICAgICAgICBkYXRhLnNjdWxwdHVyZVlQb3NpdGlvbnNbbWF0Y2hlcy5zb3VyY2VJZC50b1VwcGVyQ2FzZSgpXSA9IHBhcnNlRmxvYXQobWF0Y2hlcy55KTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIFRoZSBzb3VyY2Ugb2YgdGhlIHRldGhlciBpcyB0aGUgcGxheWVyLCB0aGUgdGFyZ2V0IGlzIHRoZSBzY3VscHR1cmUuXHJcbiAgICAgIGlkOiAnRTEyUyBQcm9taXNlIENoaXNlbGVkIFNjdWxwdHVyZSBUZXRoZXInLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy50ZXRoZXIoeyB0YXJnZXQ6ICdDaGlzZWxlZCBTY3VscHR1cmUnLCBpZDogJzAwMTEnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuc2N1bHB0dXJlVGV0aGVyTmFtZVRvSWQgPSBkYXRhLnNjdWxwdHVyZVRldGhlck5hbWVUb0lkIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuc2N1bHB0dXJlVGV0aGVyTmFtZVRvSWRbbWF0Y2hlcy5zb3VyY2VdID0gbWF0Y2hlcy50YXJnZXRJZC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIFByb21pc2UgQmxhZGUgT2YgRmxhbWUgQ291bnRlcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBzb3VyY2U6ICdDaGlzZWxlZCBTY3VscHR1cmUnLCBpZDogJzU4QjMnIH0pLFxyXG4gICAgICBkZWxheVNlY29uZHM6IDEsXHJcbiAgICAgIHN1cHByZXNzU2Vjb25kczogMSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEpID0+IHtcclxuICAgICAgICBkYXRhLmJsYWRlT2ZGbGFtZUNvdW50ID0gZGF0YS5ibGFkZU9mRmxhbWVDb3VudCB8fCAwO1xyXG4gICAgICAgIGRhdGEuYmxhZGVPZkZsYW1lQ291bnQrKztcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIFRoaXMgaXMgdGhlIENoaXNlbGVkIFNjdWxwdHVyZSBsYXNlciB3aXRoIHRoZSBsaW1pdCBjdXQgZG90cy5cclxuICAgICAgaWQ6ICdFMTJTIFByb21pc2UgQmxhZGUgT2YgRmxhbWUnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgc291cmNlOiAnQ2hpc2VsZWQgU2N1bHB0dXJlJywgaWQ6ICc1OEIzJyB9KSxcclxuICAgICAgbWlzdGFrZTogKGUsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBpZiAoIWRhdGEubGFzZXJOYW1lVG9OdW0gfHwgIWRhdGEuc2N1bHB0dXJlVGV0aGVyTmFtZVRvSWQgfHwgIWRhdGEuc2N1bHB0dXJlWVBvc2l0aW9ucylcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gSGl0dGluZyBvbmx5IG9uZSBwZXJzb24gaXMganVzdCBmaW5lLlxyXG4gICAgICAgIGlmIChlLnR5cGUgPT09ICcxNScpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIHBlcnNvbiB3aG8gaGFzIHRoaXMgbGFzZXIgbnVtYmVyIGFuZCBpcyB0ZXRoZXJlZCB0byB0aGlzIHN0YXR1ZS5cclxuICAgICAgICBjb25zdCBudW1iZXIgPSAoZGF0YS5ibGFkZU9mRmxhbWVDb3VudCB8fCAwKSArIDE7XHJcbiAgICAgICAgY29uc3Qgc291cmNlSWQgPSBtYXRjaGVzLnNvdXJjZUlkLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgY29uc3QgbmFtZXMgPSBPYmplY3Qua2V5cyhkYXRhLmxhc2VyTmFtZVRvTnVtKTtcclxuICAgICAgICBjb25zdCB3aXRoTnVtID0gbmFtZXMuZmlsdGVyKChuYW1lKSA9PiBkYXRhLmxhc2VyTmFtZVRvTnVtW25hbWVdID09PSBudW1iZXIpO1xyXG4gICAgICAgIGNvbnN0IG93bmVycyA9IHdpdGhOdW0uZmlsdGVyKChuYW1lKSA9PiBkYXRhLnNjdWxwdHVyZVRldGhlck5hbWVUb0lkW25hbWVdID09PSBzb3VyY2VJZCk7XHJcblxyXG4gICAgICAgIC8vIGlmIHNvbWUgbG9naWMgZXJyb3IsIGp1c3QgYWJvcnQuXHJcbiAgICAgICAgaWYgKG93bmVycy5sZW5ndGggIT09IDEpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIFRoZSBvd25lciBoaXR0aW5nIHRoZW1zZWx2ZXMgaXNuJ3QgYSBtaXN0YWtlLi4udGVjaG5pY2FsbHkuXHJcbiAgICAgICAgaWYgKG93bmVyc1swXSA9PT0gbWF0Y2hlcy50YXJnZXQpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIE5vdyB0cnkgdG8gZmlndXJlIG91dCB3aGljaCBzdGF0dWUgaXMgd2hpY2guXHJcbiAgICAgICAgLy8gUGVvcGxlIGNhbiBwdXQgdGhlc2Ugd2hlcmV2ZXIuICBUaGV5IGNvdWxkIGdvIHNpZGV3YXlzLCBvciBkaWFnb25hbCwgb3Igd2hhdGV2ZXIuXHJcbiAgICAgICAgLy8gSXQgc2VlbXMgbW9vb29vc3QgcGVvcGxlIHB1dCB0aGVzZSBub3J0aCAvIHNvdXRoIChvbiB0aGUgc291dGggZWRnZSBvZiB0aGUgYXJlbmEpLlxyXG4gICAgICAgIC8vIExldCdzIHNheSBhIG1pbmltdW0gb2YgMiB5YWxtcyBhcGFydCBpbiB0aGUgeSBkaXJlY3Rpb24gdG8gY29uc2lkZXIgdGhlbSBcIm5vcnRoL3NvdXRoXCIuXHJcbiAgICAgICAgY29uc3QgbWluaW11bVlhbG1zRm9yU3RhdHVlcyA9IDI7XHJcblxyXG4gICAgICAgIGxldCBpc1N0YXR1ZVBvc2l0aW9uS25vd24gPSBmYWxzZTtcclxuICAgICAgICBsZXQgaXNTdGF0dWVOb3J0aCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IHNjdWxwdHVyZUlkcyA9IE9iamVjdC5rZXlzKGRhdGEuc2N1bHB0dXJlWVBvc2l0aW9ucyk7XHJcbiAgICAgICAgaWYgKHNjdWxwdHVyZUlkcy5sZW5ndGggPT09IDIgJiYgc2N1bHB0dXJlSWRzLmluY2x1ZGVzKHNvdXJjZUlkKSkge1xyXG4gICAgICAgICAgY29uc3Qgb3RoZXJJZCA9IHNjdWxwdHVyZUlkc1swXSA9PT0gc291cmNlSWQgPyBzY3VscHR1cmVJZHNbMV0gOiBzY3VscHR1cmVJZHNbMF07XHJcbiAgICAgICAgICBjb25zdCBzb3VyY2VZID0gZGF0YS5zY3VscHR1cmVZUG9zaXRpb25zW3NvdXJjZUlkXTtcclxuICAgICAgICAgIGNvbnN0IG90aGVyWSA9IGRhdGEuc2N1bHB0dXJlWVBvc2l0aW9uc1tvdGhlcklkXTtcclxuICAgICAgICAgIGNvbnN0IHlEaWZmID0gTWF0aC5hYnMoc291cmNlWSAtIG90aGVyWSk7XHJcbiAgICAgICAgICBpZiAoeURpZmYgPiBtaW5pbXVtWWFsbXNGb3JTdGF0dWVzKSB7XHJcbiAgICAgICAgICAgIGlzU3RhdHVlUG9zaXRpb25Lbm93biA9IHRydWU7XHJcbiAgICAgICAgICAgIGlzU3RhdHVlTm9ydGggPSBzb3VyY2VZIDwgb3RoZXJZO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgb3duZXIgPSBvd25lcnNbMF07XHJcbiAgICAgICAgY29uc3Qgb3duZXJOaWNrID0gZGF0YS5TaG9ydE5hbWUob3duZXIpO1xyXG4gICAgICAgIGxldCB0ZXh0ID0ge1xyXG4gICAgICAgICAgZW46IGAke21hdGNoZXMuYWJpbGl0eX0gKGZyb20gJHtvd25lck5pY2t9LCAjJHtudW1iZXJ9KWAsXHJcbiAgICAgICAgICBkZTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAodm9uICR7b3duZXJOaWNrfSwgIyR7bnVtYmVyfSlgLFxyXG4gICAgICAgICAgamE6IGAke21hdGNoZXMuYWJpbGl0eX0gKCR7b3duZXJOaWNrfeOBi+OCieOAgSMke251bWJlcn0pYCxcclxuICAgICAgICAgIGNuOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjmnaXoh6oke293bmVyTmlja33vvIwjJHtudW1iZXJ9KWAsXHJcbiAgICAgICAgICBrbzogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo64yA7IOB7J6QIFwiJHtvd25lck5pY2t9XCIsICR7bnVtYmVyfeuyiClgLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGlzU3RhdHVlUG9zaXRpb25Lbm93biAmJiBpc1N0YXR1ZU5vcnRoKSB7XHJcbiAgICAgICAgICB0ZXh0ID0ge1xyXG4gICAgICAgICAgICBlbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoZnJvbSAke293bmVyTmlja30sICMke251bWJlcn0gbm9ydGgpYCxcclxuICAgICAgICAgICAgZGU6IGAke21hdGNoZXMuYWJpbGl0eX0gKHZvbiAke293bmVyTmlja30sICMke251bWJlcn0gbm9yZGVuKWAsXHJcbiAgICAgICAgICAgIGphOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjljJfjga4ke293bmVyTmlja33jgYvjgonjgIEjJHtudW1iZXJ9KWAsXHJcbiAgICAgICAgICAgIGNuOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjmnaXoh6rljJfmlrkke293bmVyTmlja33vvIwjJHtudW1iZXJ9KWAsXHJcbiAgICAgICAgICAgIGtvOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjrjIDsg4HsnpAgXCIke293bmVyTmlja31cIiwgJHtudW1iZXJ967KIIOu2geyqvSlgLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKGlzU3RhdHVlUG9zaXRpb25Lbm93biAmJiAhaXNTdGF0dWVOb3J0aCkge1xyXG4gICAgICAgICAgdGV4dCA9IHtcclxuICAgICAgICAgICAgZW46IGAke21hdGNoZXMuYWJpbGl0eX0gKGZyb20gJHtvd25lck5pY2t9LCAjJHtudW1iZXJ9IHNvdXRoKWAsXHJcbiAgICAgICAgICAgIGRlOiBgJHttYXRjaGVzLmFiaWxpdHl9ICh2b24gJHtvd25lck5pY2t9LCAjJHtudW1iZXJ9IFPDvGRlbilgLFxyXG4gICAgICAgICAgICBqYTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5Y2X44GuJHtvd25lck5pY2t944GL44KJ44CBIyR7bnVtYmVyfSlgLFxyXG4gICAgICAgICAgICBjbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5p2l6Ieq5Y2X5pa5JHtvd25lck5pY2t977yMIyR7bnVtYmVyfSlgLFxyXG4gICAgICAgICAgICBrbzogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo64yA7IOB7J6QIFwiJHtvd25lck5pY2t9XCIsICR7bnVtYmVyfeuyiCDrgqjsqr0pYCxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICBibGFtZTogb3duZXIsXHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0UxMlMgUHJvbWlzZSBJY2UgUGlsbGFyIFRyYWNrZXInLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy50ZXRoZXIoeyBzb3VyY2U6ICdJY2UgUGlsbGFyJywgaWQ6IFsnMDAwMScsICcwMDM5J10gfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5waWxsYXJJZFRvT3duZXIgPSBkYXRhLnBpbGxhcklkVG9Pd25lciB8fCB7fTtcclxuICAgICAgICBkYXRhLnBpbGxhcklkVG9Pd25lclttYXRjaGVzLnNvdXJjZUlkXSA9IG1hdGNoZXMudGFyZ2V0O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIFByb21pc2UgSWNlIFBpbGxhciBNaXN0YWtlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IHNvdXJjZTogJ0ljZSBQaWxsYXInLCBpZDogJzU4OUInIH0pLFxyXG4gICAgICBjb25kaXRpb246IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGlmICghZGF0YS5waWxsYXJJZFRvT3duZXIpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIG1hdGNoZXMudGFyZ2V0ICE9PSBkYXRhLnBpbGxhcklkVG9Pd25lclttYXRjaGVzLnNvdXJjZUlkXTtcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGlsbGFyT3duZXIgPSBkYXRhLlNob3J0TmFtZShkYXRhLnBpbGxhcklkVG9Pd25lclttYXRjaGVzLnNvdXJjZUlkXSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIGJsYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgZW46IGAke21hdGNoZXMuYWJpbGl0eX0gKGZyb20gJHtwaWxsYXJPd25lcn0pYCxcclxuICAgICAgICAgICAgZGU6IGAke21hdGNoZXMuYWJpbGl0eX0gKHZvbiAke3BpbGxhck93bmVyfSlgLFxyXG4gICAgICAgICAgICBmcjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoZGUgJHtwaWxsYXJPd25lcn0pYCxcclxuICAgICAgICAgICAgamE6IGAke21hdGNoZXMuYWJpbGl0eX0gKCR7cGlsbGFyT3duZXJ944GL44KJKWAsXHJcbiAgICAgICAgICAgIGNuOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjmnaXoh6oke3BpbGxhck93bmVyfSlgLFxyXG4gICAgICAgICAgICBrbzogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo64yA7IOB7J6QIFwiJHtwaWxsYXJPd25lcn1cIilgLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gVGl0YW4gcGhhc2Ugb3JhbmdlIG1hcmtlclxyXG4gICAgICBpZDogJ0UxMlMgUHJvbWlzZSBGb3JjZSBPZiBUaGUgTGFuZCcsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNThBNCcsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IGUudHlwZSA9PT0gJzE1JyxcclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnd2FybicsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiBgJHttYXRjaGVzLmFiaWxpdHl9IChhbG9uZSlgLFxyXG4gICAgICAgICAgICBkZTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoYWxsZWluKWAsXHJcbiAgICAgICAgICAgIGZyOiBgJHttYXRjaGVzLmFiaWxpdHl9IChzZXVsKGUpKWAsXHJcbiAgICAgICAgICAgIGphOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjkuIDkuropYCxcclxuICAgICAgICAgICAgY246IGAke21hdGNoZXMuYWJpbGl0eX0gKOWNleWQgylgLFxyXG4gICAgICAgICAgICBrbzogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo7Zi87J6QIOunnuydjClgLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIFByb21pc2UgR2FpbiBGaXJlIFJlc2lzdGFuY2UgRG93biBJSScsXHJcbiAgICAgIC8vIFRoZSBCZWFzdGx5IFNjdWxwdHVyZSBnaXZlcyBhIDMgc2Vjb25kIGRlYnVmZiwgdGhlIFJlZ2FsIFNjdWxwdHVyZSBnaXZlcyBhIDE0cyBvbmUuXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc4MzInIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuZmlyZSA9IGRhdGEuZmlyZSB8fCB7fTtcclxuICAgICAgICBkYXRhLmZpcmVbbWF0Y2hlcy50YXJnZXRdID0gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTEyUyBQcm9taXNlIExvc2UgRmlyZSBSZXNpc3RhbmNlIERvd24gSUknLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnODMyJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmZpcmUgPSBkYXRhLmZpcmUgfHwge307XHJcbiAgICAgICAgZGF0YS5maXJlW21hdGNoZXMudGFyZ2V0XSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIFByb21pc2UgU21hbGwgTGlvbiBUZXRoZXInLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy50ZXRoZXIoeyBzb3VyY2U6ICdCZWFzdGx5IFNjdWxwdHVyZScsIGlkOiAnMDAxMScgfSksXHJcbiAgICAgIG5ldFJlZ2V4RGU6IE5ldFJlZ2V4ZXMudGV0aGVyKHsgc291cmNlOiAnQWJiaWxkIEVpbmVzIEzDtndlbicsIGlkOiAnMDAxMScgfSksXHJcbiAgICAgIG5ldFJlZ2V4RnI6IE5ldFJlZ2V4ZXMudGV0aGVyKHsgc291cmNlOiAnQ3LDqWF0aW9uIEzDqW9uaW5lJywgaWQ6ICcwMDExJyB9KSxcclxuICAgICAgbmV0UmVnZXhKYTogTmV0UmVnZXhlcy50ZXRoZXIoeyBzb3VyY2U6ICflibXjgonjgozjgZ/njYXlrZAnLCBpZDogJzAwMTEnIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuc21hbGxMaW9uSWRUb093bmVyID0gZGF0YS5zbWFsbExpb25JZFRvT3duZXIgfHwge307XHJcbiAgICAgICAgZGF0YS5zbWFsbExpb25JZFRvT3duZXJbbWF0Y2hlcy5zb3VyY2VJZC50b1VwcGVyQ2FzZSgpXSA9IG1hdGNoZXMudGFyZ2V0O1xyXG4gICAgICAgIGRhdGEuc21hbGxMaW9uT3duZXJzID0gZGF0YS5zbWFsbExpb25Pd25lcnMgfHwgW107XHJcbiAgICAgICAgZGF0YS5zbWFsbExpb25Pd25lcnMucHVzaChtYXRjaGVzLnRhcmdldCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0UxMlMgUHJvbWlzZSBTbWFsbCBMaW9uIExpb25zYmxhemUnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IHNvdXJjZTogJ0JlYXN0bHkgU2N1bHB0dXJlJywgaWQ6ICc1OEI5JyB9KSxcclxuICAgICAgbmV0UmVnZXhEZTogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IHNvdXJjZTogJ0FiYmlsZCBFaW5lcyBMw7Z3ZW4nLCBpZDogJzU4QjknIH0pLFxyXG4gICAgICBuZXRSZWdleEZyOiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgc291cmNlOiAnQ3LDqWF0aW9uIEzDqW9uaW5lJywgaWQ6ICc1OEI5JyB9KSxcclxuICAgICAgbmV0UmVnZXhKYTogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IHNvdXJjZTogJ+WJteOCieOCjOOBn+eNheWtkCcsIGlkOiAnNThCOScgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIC8vIEZvbGtzIGJhaXRpbmcgdGhlIGJpZyBsaW9uIHNlY29uZCBjYW4gdGFrZSB0aGUgZmlyc3Qgc21hbGwgbGlvbiBoaXQsXHJcbiAgICAgICAgLy8gc28gaXQncyBub3Qgc3VmZmljaWVudCB0byBjaGVjayBvbmx5IHRoZSBvd25lci5cclxuICAgICAgICBpZiAoIWRhdGEuc21hbGxMaW9uT3duZXJzKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IG93bmVyID0gZGF0YS5zbWFsbExpb25JZFRvT3duZXJbbWF0Y2hlcy5zb3VyY2VJZC50b1VwcGVyQ2FzZSgpXTtcclxuICAgICAgICBpZiAoIW93bmVyKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmIChtYXRjaGVzLnRhcmdldCA9PT0gb3duZXIpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSB0YXJnZXQgYWxzbyBoYXMgYSBzbWFsbCBsaW9uIHRldGhlciwgdGhhdCBpcyBhbHdheXMgYSBtaXN0YWtlLlxyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgaXQncyBvbmx5IGEgbWlzdGFrZSBpZiB0aGUgdGFyZ2V0IGhhcyBhIGZpcmUgZGVidWZmLlxyXG4gICAgICAgIGNvbnN0IGhhc1NtYWxsTGlvbiA9IGRhdGEuc21hbGxMaW9uT3duZXJzLmluY2x1ZGVzKG1hdGNoZXMudGFyZ2V0KTtcclxuICAgICAgICBjb25zdCBoYXNGaXJlRGVidWZmID0gZGF0YS5maXJlICYmIGRhdGEuZmlyZVttYXRjaGVzLnRhcmdldF07XHJcblxyXG4gICAgICAgIGlmIChoYXNTbWFsbExpb24gfHwgaGFzRmlyZURlYnVmZikge1xyXG4gICAgICAgICAgY29uc3Qgb3duZXJOaWNrID0gZGF0YS5TaG9ydE5hbWUob3duZXIpO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGNlbnRlclkgPSAtNzU7XHJcbiAgICAgICAgICBjb25zdCB4ID0gcGFyc2VGbG9hdChtYXRjaGVzLngpO1xyXG4gICAgICAgICAgY29uc3QgeSA9IHBhcnNlRmxvYXQobWF0Y2hlcy55KTtcclxuICAgICAgICAgIGxldCBkaXJPYmogPSBudWxsO1xyXG4gICAgICAgICAgaWYgKHkgPCBjZW50ZXJZKSB7XHJcbiAgICAgICAgICAgIGlmICh4ID4gMClcclxuICAgICAgICAgICAgICBkaXJPYmogPSBPdXRwdXRzLmRpck5FO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgZGlyT2JqID0gT3V0cHV0cy5kaXJOVztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh4ID4gMClcclxuICAgICAgICAgICAgICBkaXJPYmogPSBPdXRwdXRzLmRpclNFO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgZGlyT2JqID0gT3V0cHV0cy5kaXJTVztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICAgIGJsYW1lOiBvd25lcixcclxuICAgICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgICBlbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoZnJvbSAke293bmVyTmlja30sICR7ZGlyT2JqWydlbiddfSlgLFxyXG4gICAgICAgICAgICAgIGRlOiBgJHttYXRjaGVzLmFiaWxpdHl9ICh2b24gJHtvd25lck5pY2t9LCAke2Rpck9ialsnZGUnXX0pYCxcclxuICAgICAgICAgICAgICBmcjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoZGUgJHtvd25lck5pY2t9LCAke2Rpck9ialsnZnInXX0pYCxcclxuICAgICAgICAgICAgICBqYTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoJHtvd25lck5pY2t944GL44KJLCAke2Rpck9ialsnamEnXX0pYCxcclxuICAgICAgICAgICAgICBjbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5p2l6IeqJHtvd25lck5pY2t9LCAke2Rpck9ialsnY24nXX1gLFxyXG4gICAgICAgICAgICAgIGtvOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjrjIDsg4HsnpAgXCIke293bmVyTmlja31cIiwgJHtkaXJPYmpbJ2tvJ119KWAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTEyUyBQcm9taXNlIE5vcnRoIEJpZyBMaW9uJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWRkZWRDb21iYXRhbnRGdWxsKHsgbmFtZTogJ1JlZ2FsIFNjdWxwdHVyZScgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeSA9IHBhcnNlRmxvYXQobWF0Y2hlcy55KTtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gLTc1O1xyXG4gICAgICAgIGlmICh5IDwgY2VudGVyWSlcclxuICAgICAgICAgIGRhdGEubm9ydGhCaWdMaW9uID0gbWF0Y2hlcy5pZC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIFByb21pc2UgQmlnIExpb24gS2luZ3NibGF6ZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBzb3VyY2U6ICdSZWdhbCBTY3VscHR1cmUnLCBpZDogJzRGOUUnIH0pLFxyXG4gICAgICBuZXRSZWdleERlOiBOZXRSZWdleGVzLmFiaWxpdHkoeyBzb3VyY2U6ICdBYmJpbGQgZWluZXMgZ3Jvw59lbiBMw7Z3ZW4nLCBpZDogJzRGOUUnIH0pLFxyXG4gICAgICBuZXRSZWdleEZyOiBOZXRSZWdleGVzLmFiaWxpdHkoeyBzb3VyY2U6ICdjcsOpYXRpb24gbMOpb25pbmUgcm95YWxlJywgaWQ6ICc0RjlFJyB9KSxcclxuICAgICAgbmV0UmVnZXhKYTogTmV0UmVnZXhlcy5hYmlsaXR5KHsgc291cmNlOiAn5Ym144KJ44KM44Gf542F5a2Q546LJywgaWQ6ICc0RjlFJyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2luZ2xlVGFyZ2V0ID0gbWF0Y2hlcy50eXBlID09PSAnMjEnO1xyXG4gICAgICAgIGNvbnN0IGhhc0ZpcmVEZWJ1ZmYgPSBkYXRhLmZpcmUgJiYgZGF0YS5maXJlW21hdGNoZXMudGFyZ2V0XTtcclxuXHJcbiAgICAgICAgLy8gU3VjY2VzcyBpZiBvbmx5IG9uZSBwZXJzb24gdGFrZXMgaXQgYW5kIHRoZXkgaGF2ZSBubyBmaXJlIGRlYnVmZi5cclxuICAgICAgICBpZiAoc2luZ2xlVGFyZ2V0ICYmICFoYXNGaXJlRGVidWZmKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBvdXRwdXQgPSB7XHJcbiAgICAgICAgICBub3J0aEJpZ0xpb246IHtcclxuICAgICAgICAgICAgZW46ICdub3J0aCBiaWcgbGlvbicsXHJcbiAgICAgICAgICAgIGRlOiAnTm9yZGVtLCBncm/Dn2VyIEzDtndlJyxcclxuICAgICAgICAgICAgamE6ICflpKfjg6njgqTjgqrjg7Mo5YyXKScsXHJcbiAgICAgICAgICAgIGNuOiAn5YyX5pa55aSn54uu5a2QJyxcclxuICAgICAgICAgICAga286ICfrtoHsqr0g7YGwIOyCrOyekCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc291dGhCaWdMaW9uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnc291dGggYmlnIGxpb24nLFxyXG4gICAgICAgICAgICBkZTogJ1PDvGRlbiwgZ3Jvw59lciBMw7Z3ZScsXHJcbiAgICAgICAgICAgIGphOiAn5aSn44Op44Kk44Kq44OzKOWNlyknLFxyXG4gICAgICAgICAgICBjbjogJ+WNl+aWueWkp+eLruWtkCcsXHJcbiAgICAgICAgICAgIGtvOiAn64Ko7Kq9IO2BsCDsgqzsnpAnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNoYXJlZDoge1xyXG4gICAgICAgICAgICBlbjogJ3NoYXJlZCcsXHJcbiAgICAgICAgICAgIGRlOiAnZ2V0ZWlsdCcsXHJcbiAgICAgICAgICAgIGphOiAn6YeN44Gt44GfJyxcclxuICAgICAgICAgICAgY246ICfph43lj6AnLFxyXG4gICAgICAgICAgICBrbzogJ+qwmeydtCDrp57snYwnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZpcmVEZWJ1ZmY6IHtcclxuICAgICAgICAgICAgZW46ICdoYWQgZmlyZScsXHJcbiAgICAgICAgICAgIGRlOiAnaGF0dGUgRmV1ZXInLFxyXG4gICAgICAgICAgICBqYTogJ+eCjuS7mOOBjScsXHJcbiAgICAgICAgICAgIGNuOiAn54GrRGVidWZmJyxcclxuICAgICAgICAgICAga286ICftmZTsl7wg65SU67KE7ZSEIOuwm+ydjCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGxhYmVscyA9IFtdO1xyXG4gICAgICAgIGlmIChkYXRhLm5vcnRoQmlnTGlvbikge1xyXG4gICAgICAgICAgaWYgKGRhdGEubm9ydGhCaWdMaW9uID09PSBtYXRjaGVzLnNvdXJjZUlkKVxyXG4gICAgICAgICAgICBsYWJlbHMucHVzaChvdXRwdXQubm9ydGhCaWdMaW9uW2RhdGEucGFyc2VyTGFuZ10gfHwgb3V0cHV0Lm5vcnRoQmlnTGlvblsnZW4nXSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGxhYmVscy5wdXNoKG91dHB1dC5zb3V0aEJpZ0xpb25bZGF0YS5wYXJzZXJMYW5nXSB8fCBvdXRwdXQuc291dGhCaWdMaW9uWydlbiddKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzaW5nbGVUYXJnZXQpXHJcbiAgICAgICAgICBsYWJlbHMucHVzaChvdXRwdXQuc2hhcmVkW2RhdGEucGFyc2VyTGFuZ10gfHwgb3V0cHV0LnNoYXJlZFsnZW4nXSk7XHJcbiAgICAgICAgaWYgKGhhc0ZpcmVEZWJ1ZmYpXHJcbiAgICAgICAgICBsYWJlbHMucHVzaChvdXRwdXQuZmlyZURlYnVmZltkYXRhLnBhcnNlckxhbmddIHx8IG91dHB1dC5maXJlRGVidWZmWydlbiddKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgdGV4dDogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoJHtsYWJlbHMuam9pbignLCAnKX0pYCxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIEtub2NrZWQgT2ZmJyxcclxuICAgICAgLy8gNTg5QSA9IEljZSBQaWxsYXIgKHByb21pc2Ugc2hpdmEgcGhhc2UpXHJcbiAgICAgIC8vIDU4QjYgPSBQYWxtIE9mIFRlbXBlcmFuY2UgKHByb21pc2Ugc3RhdHVlIGhhbmQpXHJcbiAgICAgIC8vIDU4QjcgPSBMYXNlciBFeWUgKHByb21pc2UgbGlvbiBwaGFzZSlcclxuICAgICAgLy8gNThDMSA9IERhcmtlc3QgRGFuY2UgKG9yYWNsZSB0YW5rIGp1bXAgKyBrbm9ja2JhY2sgaW4gYmVnaW5uaW5nIGFuZCB0cmlwbGUgYXBvYylcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiBbJzU4OUEnLCAnNThCNicsICc1OEI3JywgJzU4QzEnXSB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdLbm9ja2VkIG9mZicsXHJcbiAgICAgICAgICAgIGRlOiAnUnVudGVyZ2VmYWxsZW4nLFxyXG4gICAgICAgICAgICBmcjogJ0Egw6l0w6kgYXNzb21tw6koZSknLFxyXG4gICAgICAgICAgICBqYTogJ+ODjuODg+OCr+ODkOODg+OCrycsXHJcbiAgICAgICAgICAgIGNuOiAn5Ye76YCA5Z2g6JC9JyxcclxuICAgICAgICAgICAga286ICfrhInrsLEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIE9yYWNsZSBTaGFkb3dleWUnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzU4RDInLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLmRhbWFnZSA+IDAsXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiB3YXJuaW5nIGZvciB0YWtpbmcgRGlhbW9uZCBGbGFzaCAoNUZBMSkgc3RhY2sgb24geW91ciBvd24/XHJcblxyXG4vLyBEaWFtb25kIFdlYXBvbiBFeHRyZW1lXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVDbG91ZERlY2tFeHRyZW1lLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdEaWFtb25kRXggQXVyaSBBcnRzIDEnOiAnNUZBRicsIC8vIEF1cmkgQXJ0cyBkYXNoZXMvZXhwbG9zaW9uc1xyXG4gICAgJ0RpYW1vbmRFeCBBdXJpIEFydHMgMic6ICc1RkIyJywgLy8gQXVyaSBBcnRzIGRhc2hlcy9leHBsb3Npb25zXHJcbiAgICAnRGlhbW9uZEV4IEF1cmkgQXJ0cyAzJzogJzVGQ0QnLCAvLyBBdXJpIEFydHMgZGFzaGVzL2V4cGxvc2lvbnNcclxuICAgICdEaWFtb25kRXggQXVyaSBBcnRzIDQnOiAnNUZDRScsIC8vIEF1cmkgQXJ0cyBkYXNoZXMvZXhwbG9zaW9uc1xyXG4gICAgJ0RpYW1vbmRFeCBBdXJpIEFydHMgNSc6ICc1RkNGJywgLy8gQXVyaSBBcnRzIGRhc2hlcy9leHBsb3Npb25zXHJcbiAgICAnRGlhbW9uZEV4IEF1cmkgQXJ0cyA2JzogJzVGRjgnLCAvLyBBdXJpIEFydHMgZGFzaGVzL2V4cGxvc2lvbnNcclxuICAgICdEaWFtb25kRXggQXVyaSBBcnRzIDcnOiAnNjE1OScsIC8vIEF1cmkgQXJ0cyBkYXNoZXMvZXhwbG9zaW9uc1xyXG4gICAgJ0RpYW1vbmRFeCBBcnRpY3VsYXRlZCBCaXQgQWV0aGVyaWFsIEJ1bGxldCc6ICc1RkFCJywgLy8gYml0IGxhc2VycyBkdXJpbmcgYWxsIHBoYXNlc1xyXG4gICAgJ0RpYW1vbmRFeCBEaWFtb25kIFNocmFwbmVsIDEnOiAnNUZDQicsIC8vIGNoYXNpbmcgY2lyY2xlc1xyXG4gICAgJ0RpYW1vbmRFeCBEaWFtb25kIFNocmFwbmVsIDInOiAnNUZDQycsIC8vIGNoYXNpbmcgY2lyY2xlc1xyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0RpYW1vbmRFeCBDbGF3IFN3aXBlIExlZnQnOiAnNUZDMicsIC8vIEFkYW1hbnQgUHVyZ2UgcGxhdGZvcm0gY2xlYXZlXHJcbiAgICAnRGlhbW9uZEV4IENsYXcgU3dpcGUgUmlnaHQnOiAnNUZDMycsIC8vIEFkYW1hbnQgUHVyZ2UgcGxhdGZvcm0gY2xlYXZlXHJcbiAgICAnRGlhbW9uZEV4IEF1cmkgQ3ljbG9uZSAxJzogJzVGRDEnLCAvLyBzdGFuZGluZyBvbiB0aGUgYmx1ZSBrbm9ja2JhY2sgcHVja1xyXG4gICAgJ0RpYW1vbmRFeCBBdXJpIEN5Y2xvbmUgMic6ICc1RkQyJywgLy8gc3RhbmRpbmcgb24gdGhlIGJsdWUga25vY2tiYWNrIHB1Y2tcclxuICAgICdEaWFtb25kRXggQWlyc2hpcFxcJ3MgQmFuZSAxJzogJzVGRkUnLCAvLyBkZXN0cm95aW5nIG9uZSBvZiB0aGUgcGxhdGZvcm1zIGFmdGVyIEF1cmkgQ3ljbG9uZVxyXG4gICAgJ0RpYW1vbmRFeCBBaXJzaGlwXFwncyBCYW5lIDInOiAnNUZEMycsIC8vIGRlc3Ryb3lpbmcgb25lIG9mIHRoZSBwbGF0Zm9ybXMgYWZ0ZXIgQXVyaSBDeWNsb25lXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdEaWFtb25kRXggVGFuayBMYXNlcnMnOiAnNUZDOCcsIC8vIGNsZWF2aW5nIHllbGxvdyBsYXNlcnMgb24gdG9wIHR3byBlbm1pdHlcclxuICAgICdEaWFtb25kRXggSG9taW5nIExhc2VyJzogJzVGQzQnLCAvLyBBZGFtYW50ZSBQdXJnZSBzcHJlYWRcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgJ0RpYW1vbmRFeCBGbG9vZCBSYXknOiAnNUZDNycsIC8vIFwibGltaXQgY3V0XCIgY2xlYXZlc1xyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdEaWFtb25kRXggVmVydGljYWwgQ2xlYXZlIEtub2NrZWQgT2ZmJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnNUZEMCcgfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnS25vY2tlZCBvZmYnLFxyXG4gICAgICAgICAgICBkZTogJ1J1bnRlcmdlZmFsbGVuJyxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIGFzc29tbcOpKGUpJyxcclxuICAgICAgICAgICAgamE6ICfjg47jg4Pjgq/jg5Djg4Pjgq8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICAgIGtvOiAn64SJ67CxJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIERpYW1vbmQgV2VhcG9uIE5vcm1hbFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlQ2xvdWREZWNrLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdEaWFtb25kIFdlYXBvbiBBdXJpIEFydHMnOiAnNUZFMycsIC8vIEF1cmkgQXJ0cyBkYXNoZXNcclxuICAgICdEaWFtb25kIFdlYXBvbiBEaWFtb25kIFNocmFwbmVsIEluaXRpYWwnOiAnNUZFMScsIC8vIGluaXRpYWwgY2lyY2xlIG9mIERpYW1vbmQgU2hyYXBuZWxcclxuICAgICdEaWFtb25kIFdlYXBvbiBEaWFtb25kIFNocmFwbmVsIENoYXNpbmcnOiAnNUZFMicsIC8vIGZvbGxvd3VwIGNpcmNsZXMgZnJvbSBEaWFtb25kIFNocmFwbmVsXHJcbiAgICAnRGlhbW9uZCBXZWFwb24gQWV0aGVyaWFsIEJ1bGxldCc6ICc1RkQ1JywgLy8gYml0IGxhc2Vyc1xyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0RpYW1vbmQgV2VhcG9uIENsYXcgU3dpcGUgTGVmdCc6ICc1RkQ5JywgLy8gQWRhbWFudCBQdXJnZSBwbGF0Zm9ybSBjbGVhdmVcclxuICAgICdEaWFtb25kIFdlYXBvbiBDbGF3IFN3aXBlIFJpZ2h0JzogJzVGREEnLCAvLyBBZGFtYW50IFB1cmdlIHBsYXRmb3JtIGNsZWF2ZVxyXG4gICAgJ0RpYW1vbmQgV2VhcG9uIEF1cmkgQ3ljbG9uZSAxJzogJzVGRTYnLCAvLyBzdGFuZGluZyBvbiB0aGUgYmx1ZSBrbm9ja2JhY2sgcHVja1xyXG4gICAgJ0RpYW1vbmQgV2VhcG9uIEF1cmkgQ3ljbG9uZSAyJzogJzVGRTcnLCAvLyBzdGFuZGluZyBvbiB0aGUgYmx1ZSBrbm9ja2JhY2sgcHVja1xyXG4gICAgJ0RpYW1vbmQgV2VhcG9uIEFpcnNoaXBcXCdzIEJhbmUgMSc6ICc1RkU4JywgLy8gZGVzdHJveWluZyBvbmUgb2YgdGhlIHBsYXRmb3JtcyBhZnRlciBBdXJpIEN5Y2xvbmVcclxuICAgICdEaWFtb25kIFdlYXBvbiBBaXJzaGlwXFwncyBCYW5lIDInOiAnNUZGRScsIC8vIGRlc3Ryb3lpbmcgb25lIG9mIHRoZSBwbGF0Zm9ybXMgYWZ0ZXIgQXVyaSBDeWNsb25lXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdEaWFtb25kIFdlYXBvbiBIb21pbmcgTGFzZXInOiAnNUZEQicsIC8vIHNwcmVhZCBtYXJrZXJzXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0RpYW1vbmQgV2VhcG9uIFZlcnRpY2FsIENsZWF2ZSBLbm9ja2VkIE9mZicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzVGRTUnIH0pLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ0tub2NrZWQgb2ZmJyxcclxuICAgICAgICAgICAgZGU6ICdSdW50ZXJnZWZhbGxlbicsXHJcbiAgICAgICAgICAgIGZyOiAnQSDDqXTDqSBhc3NvbW3DqShlKScsXHJcbiAgICAgICAgICAgIGphOiAn44OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwsScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkNhc3RydW1NYXJpbnVtRXh0cmVtZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRW1lcmFsZEV4IEhlYXQgUmF5JzogJzVCRDMnLCAvLyBFbWVyYWxkIEJlYW0gaW5pdGlhbCBjb25hbFxyXG4gICAgJ0VtZXJhbGRFeCBQaG90b24gTGFzZXIgMSc6ICc1NTdCJywgLy8gRW1lcmFsZCBCZWFtIGluc2lkZSBjaXJjbGVcclxuICAgICdFbWVyYWxkRXggUGhvdG9uIExhc2VyIDInOiAnNTU3RCcsIC8vIEVtZXJhbGQgQmVhbSBvdXRzaWRlIGNpcmNsZVxyXG4gICAgJ0VtZXJhbGRFeCBIZWF0IFJheSAxJzogJzU1N0EnLCAvLyBFbWVyYWxkIEJlYW0gcm90YXRpbmcgcHVsc2luZyBsYXNlclxyXG4gICAgJ0VtZXJhbGRFeCBIZWF0IFJheSAyJzogJzU1NzknLCAvLyBFbWVyYWxkIEJlYW0gcm90YXRpbmcgcHVsc2luZyBsYXNlclxyXG4gICAgJ0VtZXJhbGRFeCBFeHBsb3Npb24nOiAnNTU5NicsIC8vIE1hZ2l0ZWsgTWluZSBleHBsb3Npb25cclxuICAgICdFbWVyYWxkRXggVGVydGl1cyBUZXJtaW51cyBFc3QgSW5pdGlhbCc6ICc1NUNEJywgLy8gc3dvcmQgaW5pdGlhbCBwdWRkbGVzXHJcbiAgICAnRW1lcmFsZEV4IFRlcnRpdXMgVGVybWludXMgRXN0IEV4cGxvc2lvbic6ICc1NUNFJywgLy8gc3dvcmQgZXhwbG9zaW9uc1xyXG4gICAgJ0VtZXJhbGRFeCBBaXJib3JuZSBFeHBsb3Npb24nOiAnNTVCRCcsIC8vIGV4YWZsYXJlXHJcbiAgICAnRW1lcmFsZEV4IFNpZGVzY2F0aGUgMSc6ICc1NUQ0JywgLy8gbGVmdC9yaWdodCBjbGVhdmVcclxuICAgICdFbWVyYWxkRXggU2lkZXNjYXRoZSAyJzogJzU1RDUnLCAvLyBsZWZ0L3JpZ2h0IGNsZWF2ZVxyXG4gICAgJ0VtZXJhbGRFeCBTaG90cyBGaXJlZCc6ICc1NUI3JywgLy8gcmFuayBhbmQgZmlsZSBzb2xkaWVyc1xyXG4gICAgJ0VtZXJhbGRFeCBTZWN1bmR1cyBUZXJtaW51cyBFc3QnOiAnNTVDQicsIC8vIGRyb3BwZWQgKyBhbmQgeCBoZWFkbWFya2Vyc1xyXG4gICAgJ0VtZXJhbGRFeCBFeHBpcmUnOiAnNTVEMScsIC8vIGdyb3VuZCBhb2Ugb24gYm9zcyBcImdldCBvdXRcIlxyXG4gICAgJ0VtZXJhbGRFeCBBaXJlIFRhbSBTdG9ybSc6ICc1NUQwJywgLy8gZXhwYW5kaW5nIHJlZCBhbmQgYmxhY2sgZ3JvdW5kIGFvZVxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRW1lcmFsZEV4IERpdmlkZSBFdCBJbXBlcmEnOiAnNTVEOScsIC8vIG5vbi10YW5rIHByb3RlYW4gc3ByZWFkXHJcbiAgICAnRW1lcmFsZEV4IFByaW11cyBUZXJtaW51cyBFc3QgMSc6ICc1NUM0JywgLy8ga25vY2tiYWNrIGFycm93XHJcbiAgICAnRW1lcmFsZEV4IFByaW11cyBUZXJtaW51cyBFc3QgMic6ICc1NUM1JywgLy8ga25vY2tiYWNrIGFycm93XHJcbiAgICAnRW1lcmFsZEV4IFByaW11cyBUZXJtaW51cyBFc3QgMyc6ICc1NUM2JywgLy8ga25vY2tiYWNrIGFycm93XHJcbiAgICAnRW1lcmFsZEV4IFByaW11cyBUZXJtaW51cyBFc3QgNCc6ICc1NUM3JywgLy8ga25vY2tiYWNrIGFycm93XHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5DYXN0cnVtTWFyaW51bSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRW1lcmFsZCBXZWFwb24gSGVhdCBSYXknOiAnNEY5RCcsIC8vIEVtZXJhbGQgQmVhbSBpbml0aWFsIGNvbmFsXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gUGhvdG9uIExhc2VyIDEnOiAnNTUzNCcsIC8vIEVtZXJhbGQgQmVhbSBpbnNpZGUgY2lyY2xlXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gUGhvdG9uIExhc2VyIDInOiAnNTUzNicsIC8vIEVtZXJhbGQgQmVhbSBtaWRkbGUgY2lyY2xlXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gUGhvdG9uIExhc2VyIDMnOiAnNTUzOCcsIC8vIEVtZXJhbGQgQmVhbSBvdXRzaWRlIGNpcmNsZVxyXG4gICAgJ0VtZXJhbGQgV2VhcG9uIEhlYXQgUmF5IDEnOiAnNTUzMicsIC8vIEVtZXJhbGQgQmVhbSByb3RhdGluZyBwdWxzaW5nIGxhc2VyXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gSGVhdCBSYXkgMic6ICc1NTMzJywgLy8gRW1lcmFsZCBCZWFtIHJvdGF0aW5nIHB1bHNpbmcgbGFzZXJcclxuICAgICdFbWVyYWxkIFdlYXBvbiBNYWduZXRpYyBNaW5lIEV4cGxvc2lvbic6ICc1QjA0JywgLy8gcmVwdWxzaW5nIG1pbmUgZXhwbG9zaW9uc1xyXG4gICAgJ0VtZXJhbGQgV2VhcG9uIFNpZGVzY2F0aGUgMSc6ICc1NTNGJywgLy8gbGVmdC9yaWdodCBjbGVhdmVcclxuICAgICdFbWVyYWxkIFdlYXBvbiBTaWRlc2NhdGhlIDInOiAnNTU0MCcsIC8vIGxlZnQvcmlnaHQgY2xlYXZlXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gU2lkZXNjYXRoZSAzJzogJzU1NDEnLCAvLyBsZWZ0L3JpZ2h0IGNsZWF2ZVxyXG4gICAgJ0VtZXJhbGQgV2VhcG9uIFNpZGVzY2F0aGUgNCc6ICc1NTQyJywgLy8gbGVmdC9yaWdodCBjbGVhdmVcclxuICAgICdFbWVyYWxkIFdlYXBvbiBCaXQgU3Rvcm0nOiAnNTU0QScsIC8vIFwiZ2V0IGluXCJcclxuICAgICdFbWVyYWxkIFdlYXBvbiBFbWVyYWxkIENydXNoZXInOiAnNTUzQycsIC8vIGJsdWUga25vY2tiYWNrIHB1Y2tcclxuICAgICdFbWVyYWxkIFdlYXBvbiBQdWxzZSBMYXNlcic6ICc1NTQ4JywgLy8gbGluZSBhb2VcclxuICAgICdFbWVyYWxkIFdlYXBvbiBFbmVyZ3kgQWV0aGVyb3BsYXNtJzogJzU1NTEnLCAvLyBoaXR0aW5nIGEgZ2xvd3kgb3JiXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gRGl2aWRlIEV0IEltcGVyYSBHcm91bmQnOiAnNTU2RicsIC8vIHBhcnR5IHRhcmdldGVkIGdyb3VuZCBjb25lc1xyXG4gICAgJ0VtZXJhbGQgV2VhcG9uIFByaW11cyBUZXJtaW51cyBFc3QnOiAnNEIzRScsIC8vIGdyb3VuZCBjaXJjbGUgZHVyaW5nIGFycm93IGhlYWRtYXJrZXJzXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gU2VjdW5kdXMgVGVybWludXMgRXN0JzogJzU1NkEnLCAvLyBYIC8gKyBoZWFkbWFya2Vyc1xyXG4gICAgJ0VtZXJhbGQgV2VhcG9uIFRlcnRpdXMgVGVybWludXMgRXN0JzogJzU1NkQnLCAvLyB0cmlwbGUgc3dvcmRzXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gU2hvdHMgRmlyZWQnOiAnNTU1RicsIC8vIGxpbmUgYW9lcyBmcm9tIHNvbGRpZXJzXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdFbWVyYWxkIFdlYXBvbiBEaXZpZGUgRXQgSW1wZXJhIFAxJzogJzU1NEUnLCAvLyB0YW5rYnVzdGVyLCBwcm9iYWJseSBjbGVhdmVzLCBwaGFzZSAxXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gRGl2aWRlIEV0IEltcGVyYSBQMic6ICc1NTcwJywgLy8gdGFua2J1c3RlciwgcHJvYmFibHkgY2xlYXZlcywgcGhhc2UgMlxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdFbWVyYWxkIFdlYXBvbiBFbWVyYWxkIENydXNoZXIgS25vY2tlZCBPZmYnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICc1NTNFJyB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdLbm9ja2VkIG9mZicsXHJcbiAgICAgICAgICAgIGRlOiAnUnVudGVyZ2VmYWxsZW4nLFxyXG4gICAgICAgICAgICBmcjogJ0Egw6l0w6kgYXNzb21tw6koZSknLFxyXG4gICAgICAgICAgICBqYTogJ+ODjuODg+OCr+ODkOODg+OCrycsXHJcbiAgICAgICAgICAgIGNuOiAn5Ye76YCA5Z2g6JC9JyxcclxuICAgICAgICAgICAga286ICfrhInrsLEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gR2V0dGluZyBrbm9ja2VkIGludG8gYSB3YWxsIGZyb20gdGhlIGFycm93IGhlYWRtYXJrZXIuXHJcbiAgICAgIGlkOiAnRW1lcmFsZCBXZWFwb24gUHJpbXVzIFRlcm1pbnVzIEVzdCBXYWxsJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiBbJzU1NjMnLCAnNTU2NCddIH0pLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ1B1c2hlZCBpbnRvIHdhbGwnLFxyXG4gICAgICAgICAgICBkZTogJ1LDvGNrc3Rvw58gaW4gZGllIFdhbmQnLFxyXG4gICAgICAgICAgICBqYTogJ+WjgeOBuOODjuODg+OCr+ODkOODg+OCrycsXHJcbiAgICAgICAgICAgIGNuOiAn5Ye76YCA6Iez5aKZJyxcclxuICAgICAgICAgICAga286ICfrhInrsLEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gSGFkZXMgRXhcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZU1pbnN0cmVsc0JhbGxhZEhhZGVzc0VsZWd5LFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdIYWRlc0V4IFNoYWRvdyBTcHJlYWQgMic6ICc0N0FBJyxcclxuICAgICdIYWRlc0V4IFNoYWRvdyBTcHJlYWQgMyc6ICc0N0U0JyxcclxuICAgICdIYWRlc0V4IFNoYWRvdyBTcHJlYWQgNCc6ICc0N0U1JyxcclxuICAgIC8vIEV2ZXJ5Ym9keSBzdGFja3MgaW4gZ29vZCBmYWl0aCBmb3IgQmFkIEZhaXRoLCBzbyBkb24ndCBjYWxsIGl0IGEgbWlzdGFrZS5cclxuICAgIC8vICdIYWRlc0V4IEJhZCBGYWl0aCAxJzogJzQ3QUQnLFxyXG4gICAgLy8gJ0hhZGVzRXggQmFkIEZhaXRoIDInOiAnNDdCMCcsXHJcbiAgICAvLyAnSGFkZXNFeCBCYWQgRmFpdGggMyc6ICc0N0FFJyxcclxuICAgIC8vICdIYWRlc0V4IEJhZCBGYWl0aCA0JzogJzQ3QUYnLFxyXG4gICAgJ0hhZGVzRXggQnJva2VuIEZhaXRoJzogJzQ3QjInLFxyXG4gICAgJ0hhZGVzRXggTWFnaWMgU3BlYXInOiAnNDdCNicsXHJcbiAgICAnSGFkZXNFeCBNYWdpYyBDaGFrcmFtJzogJzQ3QjUnLFxyXG4gICAgJ0hhZGVzRXggRm9ya2VkIExpZ2h0bmluZyc6ICc0N0M5JyxcclxuICAgICdIYWRlc0V4IERhcmsgQ3VycmVudCAxJzogJzQ3RjEnLFxyXG4gICAgJ0hhZGVzRXggRGFyayBDdXJyZW50IDInOiAnNDdGMicsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnSGFkZXNFeCBDb21ldCc6ICc0N0I5JywgLy8gbWlzc2VkIHRvd2VyXHJcbiAgICAnSGFkZXNFeCBBbmNpZW50IEVydXB0aW9uJzogJzQ3RDMnLFxyXG4gICAgJ0hhZGVzRXggUHVyZ2F0aW9uIDEnOiAnNDdFQycsXHJcbiAgICAnSGFkZXNFeCBQdXJnYXRpb24gMic6ICc0N0VEJyxcclxuICAgICdIYWRlc0V4IFNoYWRvdyBTdHJlYW0nOiAnNDdFQScsXHJcbiAgICAnSGFkZXNFeCBEZWFkIFNwYWNlJzogJzQ3RUUnLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnSGFkZXNFeCBTaGFkb3cgU3ByZWFkIEluaXRpYWwnOiAnNDdBOScsXHJcbiAgICAnSGFkZXNFeCBSYXZlbm91cyBBc3NhdWx0JzogJyg/OjQ3QTZ8NDdBNyknLFxyXG4gICAgJ0hhZGVzRXggRGFyayBGbGFtZSAxJzogJzQ3QzYnLFxyXG4gICAgJ0hhZGVzRXggRGFyayBGcmVlemUgMSc6ICc0N0M0JyxcclxuICAgICdIYWRlc0V4IERhcmsgRnJlZXplIDInOiAnNDdERicsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0hhZGVzRXggRGFyayBJSSBUZXRoZXInLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy50ZXRoZXIoeyBzb3VyY2U6ICdTaGFkb3cgb2YgdGhlIEFuY2llbnRzJywgaWQ6ICcwMDExJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc0RhcmsgPSBkYXRhLmhhc0RhcmsgfHwgW107XHJcbiAgICAgICAgZGF0YS5oYXNEYXJrLnB1c2gobWF0Y2hlcy50YXJnZXQpO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdIYWRlc0V4IERhcmsgSUknLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzQ3QkEnLFxyXG4gICAgICBjb25kaXRpb246IChlLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgLy8gRG9uJ3QgYmxhbWUgcGVvcGxlIHdobyBkb24ndCBoYXZlIHRldGhlcnMuXHJcbiAgICAgICAgcmV0dXJuIGUudHlwZSAhPT0gJzE1JyAmJiBkYXRhLm1lIGluIGRhdGEuaGFzRGFyaztcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnSGFkZXNFeCBCb3NzIFRldGhlcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLnRldGhlcih7IHNvdXJjZTogWydJZ2V5b3JobVxcJ3MgU2hhZGUnLCAnTGFoYWJyZWFcXCdzIFNoYWRlJ10sIGlkOiAnMDAwRScsIGNhcHR1cmU6IGZhbHNlIH0pLFxyXG4gICAgICBtaXN0YWtlOiB7XHJcbiAgICAgICAgdHlwZTogJ3dhcm4nLFxyXG4gICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgIGVuOiAnQm9zc2VzIFRvbyBDbG9zZScsXHJcbiAgICAgICAgICBkZTogJ0Jvc3NlcyB6dSBOYWhlJyxcclxuICAgICAgICAgIGZyOiAnQm9zcyB0cm9wIHByb2NoZXMnLFxyXG4gICAgICAgICAgamE6ICfjg5zjgrnov5HjgZnjgY7jgosnLFxyXG4gICAgICAgICAgY246ICdCT1NT6Z2g5aSq6L+R5LqGJyxcclxuICAgICAgICAgIGtvOiAn7KuE65Ok7J20IOuEiOustCDqsIDquYzsm4AnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0hhZGVzRXggRGVhdGggU2hyaWVrJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICc0N0NCJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSkgPT4gZS5kYW1hZ2UgPiAwLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdIYWRlc0V4IEJleW9uZCBEZWF0aCBHYWluJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzU2NicgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNCZXlvbmREZWF0aCA9IGRhdGEuaGFzQmV5b25kRGVhdGggfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNCZXlvbmREZWF0aFttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdIYWRlc0V4IEJleW9uZCBEZWF0aCBMb3NlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMubG9zZXNFZmZlY3QoeyBlZmZlY3RJZDogJzU2NicgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNCZXlvbmREZWF0aCA9IGRhdGEuaGFzQmV5b25kRGVhdGggfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNCZXlvbmREZWF0aFttYXRjaGVzLnRhcmdldF0gPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnSGFkZXNFeCBCZXlvbmQgRGVhdGgnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnNTY2JyB9KSxcclxuICAgICAgZGVsYXlTZWNvbmRzOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiBwYXJzZUZsb2F0KG1hdGNoZXMuZHVyYXRpb24pIC0gMC41LFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgaWYgKCFkYXRhLmhhc0JleW9uZERlYXRoKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmICghZGF0YS5oYXNCZXlvbmREZWF0aFttYXRjaGVzLnRhcmdldF0pXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiBtYXRjaGVzLmVmZmVjdCxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdIYWRlc0V4IERvb20gR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc2RTknIH0pLFxyXG4gICAgICBydW46IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzRG9vbSA9IGRhdGEuaGFzRG9vbSB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc0Rvb21bbWF0Y2hlcy50YXJnZXRdID0gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnSGFkZXNFeCBEb29tIExvc2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnNkU5JyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc0Rvb20gPSBkYXRhLmhhc0Rvb20gfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNEb29tW21hdGNoZXMudGFyZ2V0XSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdIYWRlc0V4IERvb20nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnNkU5JyB9KSxcclxuICAgICAgZGVsYXlTZWNvbmRzOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiBwYXJzZUZsb2F0KG1hdGNoZXMuZHVyYXRpb24pIC0gMC41LFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgaWYgKCFkYXRhLmhhc0Rvb20pXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKCFkYXRhLmhhc0Rvb21bbWF0Y2hlcy50YXJnZXRdKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjogbWF0Y2hlcy5lZmZlY3QsXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBIYWRlcyBOb3JtYWxcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUR5aW5nR2FzcCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnSGFkZXMgQmFkIEZhaXRoIDEnOiAnNDE0QicsXHJcbiAgICAnSGFkZXMgQmFkIEZhaXRoIDInOiAnNDE0QycsXHJcbiAgICAnSGFkZXMgRGFyayBFcnVwdGlvbic6ICc0MTUyJyxcclxuICAgICdIYWRlcyBTaGFkb3cgU3ByZWFkIDEnOiAnNDE1NicsXHJcbiAgICAnSGFkZXMgU2hhZG93IFNwcmVhZCAyJzogJzQxNTcnLFxyXG4gICAgJ0hhZGVzIEJyb2tlbiBGYWl0aCc6ICc0MTRFJyxcclxuICAgICdIYWRlcyBIZWxsYm9ybiBZYXdwJzogJzQxNkYnLFxyXG4gICAgJ0hhZGVzIFB1cmdhdGlvbic6ICc0MTcyJyxcclxuICAgICdIYWRlcyBTaGFkb3cgU3RyZWFtJzogJzQxNUMnLFxyXG4gICAgJ0hhZGVzIEFlcm8nOiAnNDU5NScsXHJcbiAgICAnSGFkZXMgRWNobyAxJzogJzQxNjMnLFxyXG4gICAgJ0hhZGVzIEVjaG8gMic6ICc0MTY0JyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICAvLyBUaGluZ3MgdGhhdCBzaG91bGQgb25seSBoaXQgb25lIHBlcnNvbi5cclxuICAgIHtcclxuICAgICAgaWQ6ICdIYWRlcyBOZXRoZXIgQmxhc3QnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzQxNjMnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0hhZGVzIFJhdmVub3VzIEFzc2F1bHQnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzQxNTgnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0hhZGVzIEFuY2llbnQgRGFya25lc3MnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzQ1OTMnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgIT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0hhZGVzIER1YWwgU3RyaWtlJyxcclxuICAgICAgZGFtYWdlUmVnZXg6ICc0MTYyJyxcclxuICAgICAgY29uZGl0aW9uOiAoZSkgPT4gZS50eXBlICE9PSAnMTUnLFxyXG4gICAgICBtaXN0YWtlOiAoZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IGUudGFyZ2V0TmFtZSwgdGV4dDogZS5hYmlsaXR5TmFtZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIElubm9jZW5jZSBFeHRyZW1lXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVDcm93bk9mVGhlSW1tYWN1bGF0ZUV4dHJlbWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0lubm9FeCBEdWVsIERlc2NlbnQnOiAnM0VEMicsXHJcbiAgICAnSW5ub0V4IFJlcHJvYmF0aW9uIDEnOiAnM0VFMCcsXHJcbiAgICAnSW5ub0V4IFJlcHJvYmF0aW9uIDInOiAnM0VDQycsXHJcbiAgICAnSW5ub0V4IFN3b3JkIG9mIENvbmRlbW5hdGlvbiAxJzogJzNFREUnLFxyXG4gICAgJ0lubm9FeCBTd29yZCBvZiBDb25kZW1uYXRpb24gMic6ICczRURGJyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgMSc6ICczRUQzJyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgMic6ICczRUQ0JyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgMyc6ICczRUQ1JyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgNCc6ICczRUQ2JyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgNSc6ICczRUZCJyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgNic6ICczRUZDJyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgNyc6ICczRUZEJyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgOCc6ICczRUZFJyxcclxuICAgICdJbm5vRXggSG9seSBUcmluaXR5JzogJzNFREInLFxyXG4gICAgJ0lubm9FeCBTb3VsIGFuZCBCb2R5IDEnOiAnM0VENycsXHJcbiAgICAnSW5ub0V4IFNvdWwgYW5kIEJvZHkgMic6ICczRUQ4JyxcclxuICAgICdJbm5vRXggU291bCBhbmQgQm9keSAzJzogJzNFRDknLFxyXG4gICAgJ0lubm9FeCBTb3VsIGFuZCBCb2R5IDQnOiAnM0VEQScsXHJcbiAgICAnSW5ub0V4IFNvdWwgYW5kIEJvZHkgNSc6ICczRUZGJyxcclxuICAgICdJbm5vRXggU291bCBhbmQgQm9keSA2JzogJzNGMDAnLFxyXG4gICAgJ0lubm9FeCBTb3VsIGFuZCBCb2R5IDcnOiAnM0YwMScsXHJcbiAgICAnSW5ub0V4IFNvdWwgYW5kIEJvZHkgOCc6ICczRjAyJyxcclxuICAgICdJbm5vRXggR29kIFJheSAxJzogJzNFRTYnLFxyXG4gICAgJ0lubm9FeCBHb2QgUmF5IDInOiAnM0VFNycsXHJcbiAgICAnSW5ub0V4IEdvZCBSYXkgMyc6ICczRUU4JyxcclxuICAgICdJbm5vRXggRXhwbG9zaW9uJzogJzNFRjAnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gSW5ub2NlbmNlIE5vcm1hbFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlQ3Jvd25PZlRoZUltbWFjdWxhdGUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0lubm8gRGF5YnJlYWsnOiAnM0U5RCcsXHJcbiAgICAnSW5ubyBIb2x5IFRyaW5pdHknOiAnM0VCMycsXHJcblxyXG4gICAgJ0lubm8gUmVwcm9iYXRpb24gMSc6ICczRUI2JyxcclxuICAgICdJbm5vIFJlcHJvYmF0aW9uIDInOiAnM0VCOCcsXHJcbiAgICAnSW5ubyBSZXByb2JhdGlvbiAzJzogJzNFQ0InLFxyXG4gICAgJ0lubm8gUmVwcm9iYXRpb24gNCc6ICczRUI3JyxcclxuXHJcbiAgICAnSW5ubyBTb3VsIGFuZCBCb2R5IDEnOiAnM0VCMScsXHJcbiAgICAnSW5ubyBTb3VsIGFuZCBCb2R5IDInOiAnM0VCMicsXHJcbiAgICAnSW5ubyBTb3VsIGFuZCBCb2R5IDMnOiAnM0VGOScsXHJcbiAgICAnSW5ubyBTb3VsIGFuZCBCb2R5IDQnOiAnM0VGQScsXHJcblxyXG4gICAgJ0lubm8gR29kIFJheSAxJzogJzNFQkQnLFxyXG4gICAgJ0lubm8gR29kIFJheSAyJzogJzNFQkUnLFxyXG4gICAgJ0lubm8gR29kIFJheSAzJzogJzNFQkYnLFxyXG4gICAgJ0lubm8gR29kIFJheSA0JzogJzNFQzAnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBJdCdzIGhhcmQgdG8gY2FwdHVyZSB0aGUgcmVmbGVjdGlvbiBhYmlsaXRpZXMgZnJvbSBMZXZpYXRoYW4ncyBIZWFkIGFuZCBUYWlsIGlmIHlvdSB1c2VcclxuLy8gcmFuZ2VkIHBoeXNpY2FsIGF0dGFja3MgLyBtYWdpYyBhdHRhY2tzIHJlc3BlY3RpdmVseSwgYXMgdGhlIGFiaWxpdHkgbmFtZXMgYXJlIHRoZVxyXG4vLyBhYmlsaXR5IHlvdSB1c2VkIGFuZCBkb24ndCBhcHBlYXIgdG8gc2hvdyB1cCBpbiB0aGUgbG9nIGFzIG5vcm1hbCBcImFiaWxpdHlcIiBsaW5lcy5cclxuLy8gVGhhdCBzYWlkLCBkb3RzIHN0aWxsIHRpY2sgaW5kZXBlbmRlbnRseSBvbiBib3RoIHNvIGl0J3MgbGlrZWx5IHRoYXQgcGVvcGxlIHdpbGwgYXRhY2tcclxuLy8gdGhlbSBhbnl3YXkuXHJcblxyXG4vLyBUT0RPOiBGaWd1cmUgb3V0IHdoeSBEcmVhZCBUaWRlIC8gV2F0ZXJzcG91dCBhcHBlYXIgbGlrZSBzaGFyZXMgKGkuZS4gMHgxNiBpZCkuXHJcbi8vIERyZWFkIFRpZGUgPSA1Q0NBLzVDQ0IvNUNDQywgV2F0ZXJzcG91dCA9IDVDRDFcclxuXHJcbi8vIExldmlhdGhhbiBVbnJlYWxcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZVdob3JsZWF0ZXJVbnJlYWwsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0xldmlVbiBHcmFuZCBGYWxsJzogJzVDREYnLCAvLyB2ZXJ5IGxhcmdlIGNpcmN1bGFyIGFvZSBiZWZvcmUgc3Bpbm55IGRpdmVzLCBhcHBsaWVzIGhlYXZ5XHJcbiAgICAnTGV2aVVuIEh5ZHJvc2hvdCc6ICc1Q0Q1JywgLy8gV2F2ZXNwaW5lIFNhaGFnaW4gYW9lIHRoYXQgZ2l2ZXMgRHJvcHN5IGVmZmVjdFxyXG4gICAgJ0xldmlVbiBEcmVhZHN0b3JtJzogJzVDRDYnLCAvLyBXYXZldG9vdGggU2FoYWdpbiBhb2UgdGhhdCBnaXZlcyBIeXN0ZXJpYSBlZmZlY3RcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdMZXZpVW4gQm9keSBTbGFtJzogJzVDRDInLCAvLyBsZXZpIHNsYW0gdGhhdCB0aWx0cyB0aGUgYm9hdFxyXG4gICAgJ0xldmlVbiBTcGlubmluZyBEaXZlIDEnOiAnNUNEQicsIC8vIGxldmkgZGFzaCBhY3Jvc3MgdGhlIGJvYXQgd2l0aCBrbm9ja2JhY2tcclxuICAgICdMZXZpVW4gU3Bpbm5pbmcgRGl2ZSAyJzogJzVDRTMnLCAvLyBsZXZpIGRhc2ggYWNyb3NzIHRoZSBib2F0IHdpdGgga25vY2tiYWNrXHJcbiAgICAnTGV2aVVuIFNwaW5uaW5nIERpdmUgMyc6ICc1Q0U4JywgLy8gbGV2aSBkYXNoIGFjcm9zcyB0aGUgYm9hdCB3aXRoIGtub2NrYmFja1xyXG4gICAgJ0xldmlVbiBTcGlubmluZyBEaXZlIDQnOiAnNUNFOScsIC8vIGxldmkgZGFzaCBhY3Jvc3MgdGhlIGJvYXQgd2l0aCBrbm9ja2JhY2tcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ0xldmlVbiBEcm9wc3knOiAnMTEwJywgLy8gc3RhbmRpbmcgaW4gdGhlIGh5ZHJvIHNob3QgZnJvbSB0aGUgV2F2ZXNwaW5lIFNhaGFnaW5cclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0RmFpbDoge1xyXG4gICAgJ0xldmlVbiBIeXN0ZXJpYSc6ICcxMjgnLCAvLyBzdGFuZGluZyBpbiB0aGUgZHJlYWRzdG9ybSBmcm9tIHRoZSBXYXZldG9vdGggU2FoYWdpblxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdMZXZpVW4gQm9keSBTbGFtIEtub2NrZWQgT2ZmJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnNUNEMicgfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2UsIF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnS25vY2tlZCBvZmYnLFxyXG4gICAgICAgICAgICBkZTogJ1J1bnRlcmdlZmFsbGVuJyxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIGFzc29tbcOpKGUpJyxcclxuICAgICAgICAgICAgamE6ICfjg47jg4Pjgq/jg5Djg4Pjgq8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICAgIGtvOiAn64SJ67CxJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRPRE86IHRha2luZyB0d28gZGlmZmVyZW50IEhpZ2gtUG93ZXJlZCBIb21pbmcgTGFzZXJzICg0QUQ4KVxyXG4vLyBUT0RPOiBjb3VsZCBibGFtZSB0aGUgdGV0aGVyZWQgcGxheWVyIGZvciBXaGl0ZSBBZ29ueSAvIFdoaXRlIEZ1cnkgZmFpbHVyZXM/XHJcblxyXG4vLyBSdWJ5IFdlYXBvbiBFeHRyZW1lXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5DaW5kZXJEcmlmdEV4dHJlbWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1J1YnlFeCBSdWJ5IEJpdCBNYWdpdGVrIFJheSc6ICc0QUQyJywgLy8gbGluZSBhb2VzIGR1cmluZyBoZWxpY29jbGF3XHJcbiAgICAnUnVieUV4IFNwaWtlIE9mIEZsYW1lIDEnOiAnNEFEMycsIC8vIGluaXRpYWwgZXhwbG9zaW9uIGR1cmluZyBoZWxpY29jbGF3XHJcbiAgICAnUnVieUV4IFNwaWtlIE9mIEZsYW1lIDInOiAnNEIyRicsIC8vIGZvbGxvd3VwIGhlbGljb2NsYXcgZXhwbG9zaW9uc1xyXG4gICAgJ1J1YnlFeCBTcGlrZSBPZiBGbGFtZSAzJzogJzREMDQnLCAvLyByYXZlbnNjbGF3IGV4cGxvc2lvbiBhdCBlbmRzIG9mIGxpbmVzXHJcbiAgICAnUnVieUV4IFNwaWtlIE9mIEZsYW1lIDQnOiAnNEQwNScsIC8vIHJhdmVuc2NsYXcgZXhwbG9zaW9uIGF0IGVuZHMgb2YgbGluZXNcclxuICAgICdSdWJ5RXggU3Bpa2UgT2YgRmxhbWUgNSc6ICc0QUNEJywgLy8gcmF2ZW5zY2xhdyBleHBsb3Npb24gYXQgZW5kcyBvZiBsaW5lc1xyXG4gICAgJ1J1YnlFeCBTcGlrZSBPZiBGbGFtZSA2JzogJzRBQ0UnLCAvLyByYXZlbnNjbGF3IGV4cGxvc2lvbiBhdCBlbmRzIG9mIGxpbmVzXHJcbiAgICAnUnVieUV4IFVuZGVybWluZSc6ICc0QUQwJywgLy8gZ3JvdW5kIGFvZXMgdW5kZXIgdGhlIHJhdmVuc2NsYXcgcGF0Y2hlc1xyXG4gICAgJ1J1YnlFeCBSdWJ5IFJheSc6ICc0QjAyJywgLy8gZnJvbnRhbCBsYXNlclxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMSc6ICc0QUQ5JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAyJzogJzRBREEnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5RXggUmF2ZW5zZmxpZ2h0IDMnOiAnNEFERCcsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgNCc6ICc0QURFJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCA1JzogJzRBREYnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5RXggUmF2ZW5zZmxpZ2h0IDYnOiAnNEFFMCcsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgNyc6ICc0QUUxJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCA4JzogJzRBRTInLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5RXggUmF2ZW5zZmxpZ2h0IDknOiAnNEFFMycsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMTAnOiAnNEFFNCcsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMTEnOiAnNEFFNScsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMTInOiAnNEFFNicsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMTMnOiAnNEFFNycsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMTQnOiAnNEFFOCcsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMTUnOiAnNEFFOScsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMTYnOiAnNEFFQScsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMTcnOiAnNEU2QicsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMTgnOiAnNEU2QycsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMTknOiAnNEU2RCcsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMjAnOiAnNEU2RScsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMjEnOiAnNEU2RicsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMjInOiAnNEU3MCcsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBDdXQgQW5kIFJ1biAxJzogJzRCMDUnLCAvLyBzbG93IGNoYXJnZSBhY3Jvc3MgYXJlbmEgYWZ0ZXIgc3RhY2tzXHJcbiAgICAnUnVieUV4IEN1dCBBbmQgUnVuIDInOiAnNEIwNicsIC8vIHNsb3cgY2hhcmdlIGFjcm9zcyBhcmVuYSBhZnRlciBzdGFja3NcclxuICAgICdSdWJ5RXggQ3V0IEFuZCBSdW4gMyc6ICc0QjA3JywgLy8gc2xvdyBjaGFyZ2UgYWNyb3NzIGFyZW5hIGFmdGVyIHN0YWNrc1xyXG4gICAgJ1J1YnlFeCBDdXQgQW5kIFJ1biA0JzogJzRCMDgnLCAvLyBzbG93IGNoYXJnZSBhY3Jvc3MgYXJlbmEgYWZ0ZXIgc3RhY2tzXHJcbiAgICAnUnVieUV4IEN1dCBBbmQgUnVuIDUnOiAnNERPRCcsIC8vIHNsb3cgY2hhcmdlIGFjcm9zcyBhcmVuYSBhZnRlciBzdGFja3NcclxuICAgICdSdWJ5RXggTWV0ZW9yIEJ1cnN0JzogJzRBRjInLCAvLyBtZXRlb3IgZXhwbG9kaW5nXHJcbiAgICAnUnVieUV4IEJyYWRhbWFudGUnOiAnNEUzOCcsIC8vIGhlYWRtYXJrZXJzIHdpdGggbGluZSBhb2VzXHJcbiAgICAnUnVieUV4IENvbWV0IEhlYXZ5IEltcGFjdCc6ICc0QUY2JywgLy8gbGV0dGluZyBhIHRhbmsgY29tZXQgbGFuZFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ1J1YnlFeCBSdWJ5IFNwaGVyZSBCdXJzdCc6ICc0QUNCJywgLy8gZXhwbG9kaW5nIHRoZSByZWQgbWluZVxyXG4gICAgJ1J1YnlFeCBMdW5hciBEeW5hbW8nOiAnNEVCMCcsIC8vIFwiZ2V0IGluXCIgZnJvbSBSYXZlbidzIEltYWdlXHJcbiAgICAnUnVieUV4IElyb24gQ2hhcmlvdCc6ICc0RUIxJywgLy8gXCJnZXQgb3V0XCIgZnJvbSBSYXZlbidzIEltYWdlXHJcbiAgICAnUnVieUV4IEhlYXJ0IEluIFRoZSBNYWNoaW5lJzogJzRBRkEnLCAvLyBXaGl0ZSBBZ29ueS9GdXJ5IHNrdWxsIGhpdHRpbmcgcGxheWVyc1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnUnVieUV4IEhvbWluZyBMYXNlcnMnOiAnNEFENicsIC8vIHNwcmVhZCBtYXJrZXJzIGR1cmluZyBjdXQgYW5kIHJ1blxyXG4gICAgJ1J1YnlFeCBNZXRlb3IgU3RyZWFtJzogJzRFNjgnLCAvLyBzcHJlYWQgbWFya2VycyBkdXJpbmcgUDJcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0RmFpbDoge1xyXG4gICAgJ1J1YnlFeCBIeXN0ZXJpYSc6ICcxMjgnLCAvLyBOZWdhdGl2ZSBBdXJhIGxvb2thd2F5IGZhaWx1cmVcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnUnVieUV4IFNjcmVlY2gnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICc0QUVFJyB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdLbm9ja2VkIGludG8gd2FsbCcsXHJcbiAgICAgICAgICAgIGRlOiAnUsO8Y2tzdG/DnyBpbiBkaWUgV2FuZCcsXHJcbiAgICAgICAgICAgIGphOiAn5aOB44G444OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDoh7PlopknLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwsScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gUnVieSBOb3JtYWxcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkNpbmRlckRyaWZ0LFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdSdWJ5IFJhdmVuc2NsYXcnOiAnNEE5MycsIC8vIGNlbnRlcmVkIGNpcmNsZSBhb2UgZm9yIHJhdmVuc2NsYXdcclxuICAgICdSdWJ5IFNwaWtlIE9mIEZsYW1lIDEnOiAnNEE5QScsIC8vIGluaXRpYWwgZXhwbG9zaW9uIGR1cmluZyBoZWxpY29jbGF3XHJcbiAgICAnUnVieSBTcGlrZSBPZiBGbGFtZSAyJzogJzRCMkUnLCAvLyBmb2xsb3d1cCBoZWxpY29jbGF3IGV4cGxvc2lvbnNcclxuICAgICdSdWJ5IFNwaWtlIE9mIEZsYW1lIDMnOiAnNEE5NCcsIC8vIHJhdmVuc2NsYXcgZXhwbG9zaW9uIGF0IGVuZHMgb2YgbGluZXNcclxuICAgICdSdWJ5IFNwaWtlIE9mIEZsYW1lIDQnOiAnNEE5NScsIC8vIHJhdmVuc2NsYXcgZXhwbG9zaW9uIGF0IGVuZHMgb2YgbGluZXNcclxuICAgICdSdWJ5IFNwaWtlIE9mIEZsYW1lIDUnOiAnNEQwMicsIC8vIHJhdmVuc2NsYXcgZXhwbG9zaW9uIGF0IGVuZHMgb2YgbGluZXNcclxuICAgICdSdWJ5IFNwaWtlIE9mIEZsYW1lIDYnOiAnNEQwMycsIC8vIHJhdmVuc2NsYXcgZXhwbG9zaW9uIGF0IGVuZHMgb2YgbGluZXNcclxuICAgICdSdWJ5IFJ1YnkgUmF5JzogJzRBQzYnLCAvLyBmcm9udGFsIGxhc2VyXHJcbiAgICAnUnVieSBVbmRlcm1pbmUnOiAnNEE5NycsIC8vIGdyb3VuZCBhb2VzIHVuZGVyIHRoZSByYXZlbnNjbGF3IHBhdGNoZXNcclxuICAgICdSdWJ5IFJhdmVuc2ZsaWdodCAxJzogJzRFNjknLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5IFJhdmVuc2ZsaWdodCAyJzogJzRFNkEnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5IFJhdmVuc2ZsaWdodCAzJzogJzRBQTEnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5IFJhdmVuc2ZsaWdodCA0JzogJzRBQTInLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5IFJhdmVuc2ZsaWdodCA1JzogJzRBQTMnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5IFJhdmVuc2ZsaWdodCA2JzogJzRBQTQnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5IFJhdmVuc2ZsaWdodCA3JzogJzRBQTUnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5IFJhdmVuc2ZsaWdodCA4JzogJzRBQTYnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5IFJhdmVuc2ZsaWdodCA5JzogJzRBQTcnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5IFJhdmVuc2ZsaWdodCAxMCc6ICc0QzIxJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieSBSYXZlbnNmbGlnaHQgMTEnOiAnNEMyQScsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnkgQ29tZXQgQnVyc3QnOiAnNEFCNCcsIC8vIG1ldGVvciBleHBsb2RpbmdcclxuICAgICdSdWJ5IEJyYWRhbWFudGUnOiAnNEFCQycsIC8vIGhlYWRtYXJrZXJzIHdpdGggbGluZSBhb2VzXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdSdWJ5IEhvbWluZyBMYXNlcic6ICc0QUM1JywgLy8gc3ByZWFkIG1hcmtlcnMgaW4gUDFcclxuICAgICdSdWJ5IE1ldGVvciBTdHJlYW0nOiAnNEU2NycsIC8vIHNwcmVhZCBtYXJrZXJzIGluIFAyXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFNoaXZhIFVucmVhbFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlQWtoQWZhaEFtcGhpdGhlYXRyZVVucmVhbCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAvLyBMYXJnZSB3aGl0ZSBjaXJjbGVzLlxyXG4gICAgJ1NoaXZhRXggSWNpY2xlIEltcGFjdCc6ICc1MzdCJyxcclxuICAgIC8vIFwiZ2V0IGluXCIgYW9lXHJcbiAgICAnU2hpdmFFeCBXaGl0ZW91dCc6ICc1Mzc2JyxcclxuICAgIC8vIEF2b2lkYWJsZSB0YW5rIHN0dW4uXHJcbiAgICAnU2hpdmFFeCBHbGFjaWVyIEJhc2gnOiAnNTM3NScsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAvLyAyNzAgZGVncmVlIGF0dGFjay5cclxuICAgICdTaGl2YUV4IEdsYXNzIERhbmNlJzogJzUzNzgnLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAvLyBIYWlsc3Rvcm0gc3ByZWFkIG1hcmtlci5cclxuICAgICdTaGl2YUV4IEhhaWxzdG9ybSc6ICc1MzZGJyxcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgLy8gTGFzZXIuICBUT0RPOiBtYXliZSBibGFtZSB0aGUgcGVyc29uIGl0J3Mgb24/P1xyXG4gICAgJ1NoaXZhRXggQXZhbGFuY2hlJzogJzUzNzknLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gUGFydHkgc2hhcmVkIHRhbmsgYnVzdGVyLlxyXG4gICAgICBpZDogJ1NoaXZhRXggSWNlYnJhbmQnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzUzNzMnLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiB7XHJcbiAgICAgICAgLy8gU2hvdWxkIGJlIHNoYXJlZCB3aXRoIGZyaWVuZHMuXHJcbiAgICAgICAgcmV0dXJuIGUudHlwZSA9PT0gJzE1JztcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnU2hpdmFFeCBEZWVwIEZyZWV6ZScsXHJcbiAgICAgIC8vIFNoaXZhIGFsc28gdXNlcyBhYmlsaXR5IDUzN0Egb24geW91LCBidXQgaXQgaGFzIGFuIHVua25vd24gbmFtZS5cclxuICAgICAgLy8gU28sIHVzZSB0aGUgZWZmZWN0IGluc3RlYWQgZm9yIGZyZWUgdHJhbnNsYXRpb24uXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcxRTcnIH0pLFxyXG4gICAgICBjb25kaXRpb246IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICAvLyBUaGUgaW50ZXJtaXNzaW9uIGFsc28gZ2V0cyB0aGlzIGVmZmVjdCwgYnV0IGZvciBhIHNob3J0ZXIgZHVyYXRpb24uXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobWF0Y2hlcy5kdXJhdGlvbikgPiAyMDtcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVEYW5jaW5nUGxhZ3VlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdUaXRhbmlhIFdvb2RcXCdzIEVtYnJhY2UnOiAnM0Q1MCcsXHJcbiAgICAvLyAnVGl0YW5pYSBGcm9zdCBSdW5lJzogJzNENEUnLFxyXG4gICAgJ1RpdGFuaWEgR2VudGxlIEJyZWV6ZSc6ICczRjgzJyxcclxuICAgICdUaXRhbmlhIExlYWZzdG9ybSAxJzogJzNENTUnLFxyXG4gICAgJ1RpdGFuaWEgUHVja1xcJ3MgUmVidWtlJzogJzNENTgnLFxyXG4gICAgJ1RpdGFuaWEgTGVhZnN0b3JtIDInOiAnM0UwMycsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnVGl0YW5pYSBQaGFudG9tIFJ1bmUgMSc6ICczRDVEJyxcclxuICAgICdUaXRhbmlhIFBoYW50b20gUnVuZSAyJzogJzNENUUnLFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnVGl0YW5pYSBEaXZpbmF0aW9uIFJ1bmUnOiAnM0Q1QicsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlRGFuY2luZ1BsYWd1ZUV4dHJlbWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1RpdGFuaWFFeCBXb29kXFwncyBFbWJyYWNlJzogJzNEMkYnLFxyXG4gICAgLy8gJ1RpdGFuaWFFeCBGcm9zdCBSdW5lJzogJzNEMkInLFxyXG4gICAgJ1RpdGFuaWFFeCBHZW50bGUgQnJlZXplJzogJzNGODInLFxyXG4gICAgJ1RpdGFuaWFFeCBMZWFmc3Rvcm0gMSc6ICczRDM5JyxcclxuICAgICdUaXRhbmlhRXggUHVja1xcJ3MgUmVidWtlJzogJzNENDMnLFxyXG4gICAgJ1RpdGFuaWFFeCBXYWxsb3AnOiAnM0QzQicsXHJcbiAgICAnVGl0YW5pYUV4IExlYWZzdG9ybSAyJzogJzNENDknLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ1RpdGFuaWFFeCBQaGFudG9tIFJ1bmUgMSc6ICczRDRDJyxcclxuICAgICdUaXRhbmlhRXggUGhhbnRvbSBSdW5lIDInOiAnM0Q0RCcsXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgIC8vIFRPRE86IFRoaXMgY291bGQgbWF5YmUgYmxhbWUgdGhlIHBlcnNvbiB3aXRoIHRoZSB0ZXRoZXI/XHJcbiAgICAnVGl0YW5pYUV4IFRodW5kZXIgUnVuZSc6ICczRDI5JyxcclxuICAgICdUaXRhbmlhRXggRGl2aW5hdGlvbiBSdW5lJzogJzNENEEnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVGl0YW4gVW5yZWFsXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVOYXZlbFVucmVhbCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnVGl0YW5VbiBXZWlnaHQgT2YgVGhlIExhbmQnOiAnNThGRScsXHJcbiAgICAnVGl0YW5VbiBCdXJzdCc6ICc1QURGJyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdUaXRhblVuIExhbmRzbGlkZSc6ICc1QURDJyxcclxuICAgICdUaXRhblVuIEdhb2xlciBMYW5kc2xpZGUnOiAnNTkwMicsXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdUaXRhblVuIFJvY2sgQnVzdGVyJzogJzU4RjYnLFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnVGl0YW5VbiBNb3VudGFpbiBCdXN0ZXInOiAnNThGNycsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuTWVtb3JpYU1pc2VyYUV4dHJlbWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1ZhcmlzRXggQWxlYSBJYWN0YSBFc3QgMSc6ICc0Q0QyJyxcclxuICAgICdWYXJpc0V4IEFsZWEgSWFjdGEgRXN0IDInOiAnNENEMycsXHJcbiAgICAnVmFyaXNFeCBBbGVhIElhY3RhIEVzdCAzJzogJzRDRDQnLFxyXG4gICAgJ1ZhcmlzRXggQWxlYSBJYWN0YSBFc3QgNCc6ICc0Q0Q1JyxcclxuICAgICdWYXJpc0V4IEFsZWEgSWFjdGEgRXN0IDUnOiAnNENENicsXHJcbiAgICAnVmFyaXNFeCBJZ25pcyBFc3QgMSc6ICc0Q0I1JyxcclxuICAgICdWYXJpc0V4IElnbmlzIEVzdCAyJzogJzRDQzUnLFxyXG4gICAgJ1ZhcmlzRXggVmVudHVzIEVzdCAxJzogJzRDQzcnLFxyXG4gICAgJ1ZhcmlzRXggVmVudHVzIEVzdCAyJzogJzRDQzgnLFxyXG4gICAgJ1ZhcmlzRXggQXNzYXVsdCBDYW5ub24nOiAnNENFNScsXHJcbiAgICAnVmFyaXNFeCBGb3J0aXVzIFJvdGF0aW5nJzogJzRDRTknLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgLy8gRG9uJ3QgaGl0IHRoZSBzaGllbGRzIVxyXG4gICAgJ1ZhcmlzRXggUmVwYXknOiAnNENERCcsXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgIC8vIFRoaXMgaXMgdGhlIFwicHJvdGVhblwiIGZvcnRpdXMuXHJcbiAgICAnVmFyaXNFeCBGb3J0aXVzIFByb3RlYW4nOiAnNENFNycsXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgICdWYXJpc0V4IE1hZ2l0ZWsgQnVyc3QnOiAnNENERicsXHJcbiAgICAnVmFyaXNFeCBBZXRoZXJvY2hlbWljYWwgR3JlbmFkbyc6ICc0Q0VEJyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVmFyaXNFeCBUZXJtaW51cyBFc3QnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzRDQjQnLFxyXG4gICAgICBzdXBwcmVzc1NlY29uZHM6IDEsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogZS50YXJnZXROYW1lLCB0ZXh0OiBlLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBSYWRpYW50IEJyYXZlciBpcyA0RjE2LzRGMTcoeDIpLCBzaG91bGRuJ3QgZ2V0IGhpdCBieSBib3RoP1xyXG4vLyBUT0RPOiBSYWRpYW50IERlc3BlcmFkbyBpcyA0RjE4LzRGMTksIHNob3VsZG4ndCBnZXQgaGl0IGJ5IGJvdGg/XHJcbi8vIFRPRE86IFJhZGlhbnQgTWV0ZW9yIGlzIDRGMUEsIGFuZCBzaG91bGRuJ3QgZ2V0IGhpdCBieSBtb3JlIHRoYW4gMT9cclxuLy8gVE9ETzogbWlzc2luZyBhIHRvd2VyP1xyXG5cclxuLy8gTm90ZTogRGVsaWJlcmF0ZWx5IG5vdCBpbmNsdWRpbmcgcHlyZXRpYyBkYW1hZ2UgYXMgYW4gZXJyb3IuXHJcbi8vIE5vdGU6IEl0IGRvZXNuJ3QgYXBwZWFyIHRoYXQgdGhlcmUncyBhbnkgd2F5IHRvIHRlbGwgd2hvIGZhaWxlZCB0aGUgY3V0c2NlbmUuXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlU2VhdE9mU2FjcmlmaWNlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdXT0wgU29sZW1uIENvbmZpdGVvcic6ICc0RjJBJywgLy8gZ3JvdW5kIHB1ZGRsZXNcclxuICAgICdXT0wgQ29ydXNjYW50IFNhYmVyIEluJzogJzRGMTAnLCAvLyBzYWJlciBpblxyXG4gICAgJ1dPTCBDb3J1c2NhbnQgU2FiZXIgT3V0JzogJzRGMTEnLCAvLyBzYWJlciBvdXRcclxuICAgICdXT0wgSW1idWVkIENvcnVzYW5jZSBPdXQnOiAnNEY0QicsIC8vIHNhYmVyIG91dFxyXG4gICAgJ1dPTCBJbWJ1ZWQgQ29ydXNhbmNlIEluJzogJzRGNEMnLCAvLyBzYWJlciBpblxyXG4gICAgJ1dPTCBTaGluaW5nIFdhdmUnOiAnNEYyNicsIC8vIHN3b3JkIHRyaWFuZ2xlXHJcbiAgICAnV09MIENhdXRlcml6ZSc6ICc0RjI1JyxcclxuICAgICdXT0wgQnJpbXN0b25lIEVhcnRoIDEnOiAnNEYxRScsIC8vIGNvcm5lciBncm93aW5nIGNpcmNsZXMsIGluaXRpYWxcclxuICAgICdXT0wgQnJpbXN0b25lIEVhcnRoIDInOiAnNEYxRicsIC8vIGNvcm5lciBncm93aW5nIGNpcmNsZXMsIGdyb3dpbmdcclxuICAgICdXT0wgRmxhcmUgQnJlYXRoJzogJzRGMjQnLFxyXG4gICAgJ1dPTCBEZWNpbWF0aW9uJzogJzRGMjMnLFxyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnV09MIERlZXAgRnJlZXplJzogJzRFNicsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ1dPTCBUcnVlIFdhbGtpbmcgRGVhZCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICczOEUnIH0pLFxyXG4gICAgICBkZWxheVNlY29uZHM6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHBhcnNlRmxvYXQobWF0Y2hlcy5kdXJhdGlvbikgLSAwLjUsXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIG5hbWU6IGUudGFyZ2V0LCByZWFzb246IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBSYWRpYW50IEJyYXZlciBpcyA0RUY3LzRFRjgoeDIpLCBzaG91bGRuJ3QgZ2V0IGhpdCBieSBib3RoP1xyXG4vLyBUT0RPOiBSYWRpYW50IERlc3BlcmFkbyBpcyA0RUY5LzRFRkEsIHNob3VsZG4ndCBnZXQgaGl0IGJ5IGJvdGg/XHJcbi8vIFRPRE86IFJhZGlhbnQgTWV0ZW9yIGlzIDRFRkMsIGFuZCBzaG91bGRuJ3QgZ2V0IGhpdCBieSBtb3JlIHRoYW4gMT9cclxuLy8gVE9ETzogQWJzb2x1dGUgSG9seSBzaG91bGQgYmUgc2hhcmVkP1xyXG4vLyBUT0RPOiBpbnRlcnNlY3RpbmcgYnJpbXN0b25lcz9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVTZWF0T2ZTYWNyaWZpY2VFeHRyZW1lLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdXT0xFeCBTb2xlbW4gQ29uZml0ZW9yJzogJzRGMEMnLCAvLyBncm91bmQgcHVkZGxlc1xyXG4gICAgJ1dPTEV4IENvcnVzY2FudCBTYWJlciBJbic6ICc0RUYyJywgLy8gc2FiZXIgaW5cclxuICAgICdXT0xFeCBDb3J1c2NhbnQgU2FiZXIgT3V0JzogJzRFRjEnLCAvLyBzYWJlciBvdXRcclxuICAgICdXT0xFeCBJbWJ1ZWQgQ29ydXNhbmNlIE91dCc6ICc0RjQ5JywgLy8gc2FiZXIgb3V0XHJcbiAgICAnV09MRXggSW1idWVkIENvcnVzYW5jZSBJbic6ICc0RjRBJywgLy8gc2FiZXIgaW5cclxuICAgICdXT0xFeCBTaGluaW5nIFdhdmUnOiAnNEYwOCcsIC8vIHN3b3JkIHRyaWFuZ2xlXHJcbiAgICAnV09MRXggQ2F1dGVyaXplJzogJzRGMDcnLFxyXG4gICAgJ1dPTEV4IEJyaW1zdG9uZSBFYXJ0aCc6ICc0RjAwJywgLy8gY29ybmVyIGdyb3dpbmcgY2lyY2xlcywgZ3Jvd2luZ1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnV09MRXggQWJzb2x1dGUgU3RvbmUgSUlJJzogJzRFRUInLCAvLyBwcm90ZWFuIHdhdmUgaW1idWVkIG1hZ2ljXHJcbiAgICAnV09MRXggRmxhcmUgQnJlYXRoJzogJzRGMDYnLCAvLyB0ZXRoZXIgZnJvbSBzdW1tb25lZCBiYWhhbXV0c1xyXG4gICAgJ1dPTEV4IFBlcmZlY3QgRGVjaW1hdGlvbic6ICc0RjA1JywgLy8gc21uL3dhciBwaGFzZSBtYXJrZXJcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ1dPTEV4IERlZXAgRnJlZXplJzogJzRFNicsIC8vIGZhaWxpbmcgQWJzb2x1dGUgQmxpenphcmQgSUlJXHJcbiAgICAnV09MRXggRGFtYWdlIERvd24nOiAnMjc0JywgLy8gZmFpbGluZyBBYnNvbHV0ZSBGbGFzaFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdXT0xFeCBUcnVlIFdhbGtpbmcgRGVhZCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc4RkYnIH0pLFxyXG4gICAgICBkZWxheVNlY29uZHM6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHBhcnNlRmxvYXQobWF0Y2hlcy5kdXJhdGlvbikgLSAwLjUsXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIG5hbWU6IGUudGFyZ2V0LCByZWFzb246IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1dPTEV4IFRvd2VyJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnNEYwNCcsIGNhcHR1cmU6IGZhbHNlIH0pLFxyXG4gICAgICBtaXN0YWtlOiB7XHJcbiAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgZW46ICdNaXNzZWQgVG93ZXInLFxyXG4gICAgICAgICAgZGU6ICdUdXJtIHZlcnBhc3N0JyxcclxuICAgICAgICAgIGZyOiAnVG91ciBtYW5xdcOpZScsXHJcbiAgICAgICAgICBqYTogJ+WhlOOCkui4j+OBvuOBquOBi+OBo+OBnycsXHJcbiAgICAgICAgICBjbjogJ+ayoei4qeWhlCcsXHJcbiAgICAgICAgICBrbzogJ+yepe2MkCDsi6TsiJgnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1dPTEV4IFRydWUgSGFsbG93ZWQgR3JvdW5kJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnNEY0NCcgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIHJlYXNvbjogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBGb3IgQmVyc2VyayBhbmQgRGVlcCBEYXJrc2lkZVxyXG4gICAgICBpZDogJ1dPTEV4IE1pc3NlZCBJbnRlcnJ1cHQnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6IFsnNTE1NicsICc1MTU4J10gfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIHJlYXNvbjogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1dvbEV4IEthdG9uIFNhbiBTaGFyZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzRFRkUnIH0pLFxyXG4gICAgICBjb25kaXRpb246IChlKSA9PiBlLnR5cGUgPT09ICcxNScsXHJcbiAgICAgIG1pc3Rha2U6IChfZSwgX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBGSVggbHVtaW5vdXMgYWV0aGVyb3BsYXNtIHdhcm5pbmcgbm90IHdvcmtpbmdcclxuLy8gVE9ETzogRklYIGRvbGwgZGVhdGggbm90IHdvcmtpbmdcclxuLy8gVE9ETzogZmFpbGluZyBoYW5kIG9mIHBhaW4vcGFydGluZyAoY2hlY2sgZm9yIGhpZ2ggZGFtYWdlPylcclxuLy8gVE9ETzogbWFrZSBzdXJlIGV2ZXJ5Ym9keSB0YWtlcyBleGFjdGx5IG9uZSBwcm90ZWFuIChyYXRoZXIgdGhhbiB3YXRjaGluZyBkb3VibGUgaGl0cylcclxuLy8gVE9ETzogdGh1bmRlciBub3QgaGl0dGluZyBleGFjdGx5IDI/XHJcbi8vIFRPRE86IHBlcnNvbiB3aXRoIHdhdGVyL3RodW5kZXIgZGVidWZmIGR5aW5nXHJcbi8vIFRPRE86IGJhZCBuaXNpIHBhc3NcclxuLy8gVE9ETzogZmFpbGVkIGdhdmVsIG1lY2hhbmljXHJcbi8vIFRPRE86IGRvdWJsZSByb2NrZXQgcHVuY2ggbm90IGhpdHRpbmcgZXhhY3RseSAyPyAob3IgdGFua3MpXHJcbi8vIFRPRE86IHN0YW5kaW5nIGluIHNsdWRnZSBwdWRkbGVzIGJlZm9yZSBoaWRkZW4gbWluZT9cclxuLy8gVE9ETzogaGlkZGVuIG1pbmUgZmFpbHVyZT9cclxuLy8gVE9ETzogZmFpbHVyZXMgb2Ygb3JkYWluZWQgbW90aW9uIC8gc3RpbGxuZXNzXHJcbi8vIFRPRE86IGZhaWx1cmVzIG9mIHBsYWludCBvZiBzZXZlcml0eSAodGV0aGVycylcclxuLy8gVE9ETzogZmFpbHVyZXMgb2YgcGxhaW50IG9mIHNvbGlkYXJpdHkgKHNoYXJlZCBzZW50ZW5jZSlcclxuLy8gVE9ETzogb3JkYWluZWQgY2FwaXRhbCBwdW5pc2htZW50IGhpdHRpbmcgbm9uLXRhbmtzXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlRXBpY09mQWxleGFuZGVyVWx0aW1hdGUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1RFQSBTbHVpY2UnOiAnNDlCMScsXHJcbiAgICAnVEVBIFByb3RlYW4gV2F2ZSAxJzogJzQ4MjQnLFxyXG4gICAgJ1RFQSBQcm90ZWFuIFdhdmUgMic6ICc0OUI1JyxcclxuICAgICdURUEgU3BpbiBDcnVzaGVyJzogJzRBNzInLFxyXG4gICAgJ1RFQSBTYWNyYW1lbnQnOiAnNDg1RicsXHJcbiAgICAnVEVBIFJhZGlhbnQgU2FjcmFtZW50JzogJzQ4ODYnLFxyXG4gICAgJ1RFQSBBbG1pZ2h0eSBKdWRnbWVudCc6ICc0ODkwJyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdURUEgSGF3ayBCbGFzdGVyJzogJzQ4MzAnLFxyXG4gICAgJ1RFQSBDaGFrcmFtJzogJzQ4NTUnLFxyXG4gICAgJ1RFQSBFbnVtZXJhdGlvbic6ICc0ODUwJyxcclxuICAgICdURUEgQXBvY2FseXB0aWMgUmF5JzogJzQ4NEMnLFxyXG4gICAgJ1RFQSBQcm9wZWxsZXIgV2luZCc6ICc0ODMyJyxcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1RFQSBQcm90ZWFuIFdhdmUgRG91YmxlIDEnOiAnNDlCNicsXHJcbiAgICAnVEVBIFByb3RlYW4gV2F2ZSBEb3VibGUgMic6ICc0ODI1JyxcclxuICAgICdURUEgRmx1aWQgU3dpbmcnOiAnNDlCMCcsXHJcbiAgICAnVEVBIEZsdWlkIFN0cmlrZSc6ICc0OUI3JyxcclxuICAgICdURUEgSGlkZGVuIE1pbmUnOiAnNDg1MicsXHJcbiAgICAnVEVBIEFscGhhIFN3b3JkJzogJzQ4NkInLFxyXG4gICAgJ1RFQSBGbGFyZXRocm93ZXInOiAnNDg2QicsXHJcbiAgICAnVEVBIENoYXN0ZW5pbmcgSGVhdCc6ICc0QTgwJyxcclxuICAgICdURUEgRGl2aW5lIFNwZWFyJzogJzRBODInLFxyXG4gICAgJ1RFQSBPcmRhaW5lZCBQdW5pc2htZW50JzogJzQ4OTEnLFxyXG4gICAgLy8gT3B0aWNhbCBTcHJlYWRcclxuICAgICdURUEgSW5kaXZpZHVhbCBSZXByb2JhdGlvbic6ICc0ODhDJyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIEJhbGxvb24gUG9wcGluZy4gIEl0IHNlZW1zIGxpa2UgdGhlIHBlcnNvbiB3aG8gcG9wcyBpdCBpcyB0aGVcclxuICAgICAgLy8gZmlyc3QgcGVyc29uIGxpc3RlZCBkYW1hZ2Utd2lzZSwgc28gdGhleSBhcmUgbGlrZWx5IHRoZSBjdWxwcml0LlxyXG4gICAgICBpZDogJ1RFQSBPdXRidXJzdCcsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNDgyQScsXHJcbiAgICAgIGNvbGxlY3RTZWNvbmRzOiAwLjUsXHJcbiAgICAgIHN1cHByZXNzU2Vjb25kczogNSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBlWzBdLnRhcmdldE5hbWUsIHRleHQ6IGVbMF0uYXR0YWNrZXJOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBcInRvbyBtdWNoIGx1bWlub3VzIGFldGhlcm9wbGFzbVwiXHJcbiAgICAgIC8vIFdoZW4gdGhpcyBoYXBwZW5zLCB0aGUgdGFyZ2V0IGV4cGxvZGVzLCBoaXR0aW5nIG5lYXJieSBwZW9wbGVcclxuICAgICAgLy8gYnV0IGFsc28gdGhlbXNlbHZlcy5cclxuICAgICAgaWQ6ICdURUEgRXhoYXVzdCcsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNDgxRicsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IGUudGFyZ2V0TmFtZSA9PT0gZS5hdHRhY2tlck5hbWUsXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIGJsYW1lOiBlLnRhcmdldE5hbWUsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnbHVtaW5vdXMgYWV0aGVyb3BsYXNtJyxcclxuICAgICAgICAgICAgZGU6ICdMdW1pbmlzemVudGVzIMOEdGhlcm9wbGFzbWEnLFxyXG4gICAgICAgICAgICBmcjogJ8OJdGjDqXJvcGxhc21hIGx1bWluZXV4JyxcclxuICAgICAgICAgICAgamE6ICflhYnmgKfniIbpm7cnLFxyXG4gICAgICAgICAgICBjbjogJ+WFieaAp+eIhumbtycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1RFQSBEcm9wc3knLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMTIxJyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdURUEgVGV0aGVyIFRyYWNraW5nJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMudGV0aGVyKHsgc291cmNlOiAnSmFnZCBEb2xsJywgaWQ6ICcwMDExJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmphZ2RUZXRoZXIgPSBkYXRhLmphZ2RUZXRoZXIgfHwge307XHJcbiAgICAgICAgZGF0YS5qYWdkVGV0aGVyW21hdGNoZXMuc291cmNlSWRdID0gbWF0Y2hlcy50YXJnZXQ7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1RFQSBSZWR1Y2libGUgQ29tcGxleGl0eScsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNDgyMScsXHJcbiAgICAgIG1pc3Rha2U6IChlLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIC8vIFRoaXMgbWF5IGJlIHVuZGVmaW5lZCwgd2hpY2ggaXMgZmluZS5cclxuICAgICAgICAgIG5hbWU6IGRhdGEuamFnZFRldGhlciA/IGRhdGEuamFnZFRldGhlcltlLmF0dGFja2VySWRdIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogJ0RvbGwgRGVhdGgnLFxyXG4gICAgICAgICAgICBkZTogJ1B1cHBlIFRvdCcsXHJcbiAgICAgICAgICAgIGZyOiAnUG91cMOpZSBtb3J0ZScsXHJcbiAgICAgICAgICAgIGphOiAn44OJ44O844Or44GM5q2744KT44GgJyxcclxuICAgICAgICAgICAgY246ICfmta7lo6vlvrfmrbvkuqEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdURUEgRHJhaW5hZ2UnLFxyXG4gICAgICBkYW1hZ2VSZWdleDogJzQ4MjcnLFxyXG4gICAgICBjb25kaXRpb246IChlLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgLy8gVE9ETzogcmVtb3ZlIHRoaXMgd2hlbiBuZ2xkIG92ZXJsYXlwbHVnaW4gaXMgdGhlIGRlZmF1bHRcclxuICAgICAgICBpZiAoIWRhdGEucGFydHkucGFydHlOYW1lcy5sZW5ndGgpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhLklzUGxheWVySWQoZS50YXJnZXRJZCkgJiYgIWRhdGEucGFydHkuaXNUYW5rKGUudGFyZ2V0TmFtZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIG1pc3Rha2U6IChlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBuYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVEVBIFRocm90dGxlIEdhaW4nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMkJDJyB9KSxcclxuICAgICAgcnVuOiAoX2UsIGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc1Rocm90dGxlID0gZGF0YS5oYXNUaHJvdHRsZSB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc1Rocm90dGxlW21hdGNoZXMudGFyZ2V0XSA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1RFQSBUaHJvdHRsZSBMb3NlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMubG9zZXNFZmZlY3QoeyBlZmZlY3RJZDogJzJCQycgfSksXHJcbiAgICAgIHJ1bjogKF9lLCBkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNUaHJvdHRsZSA9IGRhdGEuaGFzVGhyb3R0bGUgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNUaHJvdHRsZVttYXRjaGVzLnRhcmdldF0gPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVEVBIFRocm90dGxlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzJCQycgfSksXHJcbiAgICAgIGRlbGF5U2Vjb25kczogKF9lLCBfZGF0YSwgbWF0Y2hlcykgPT4gcGFyc2VGbG9hdChtYXRjaGVzLmR1cmF0aW9uKSAtIDAuNSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZSwgZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGlmICghZGF0YS5oYXNUaHJvdHRsZSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAoIWRhdGEuaGFzVGhyb3R0bGVbbWF0Y2hlcy50YXJnZXRdKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjogbWF0Y2hlcy5lZmZlY3QsXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIE9wdGljYWwgU3RhY2tcclxuICAgICAgaWQ6ICdURUEgQ29sbGVjdGl2ZSBSZXByb2JhdGlvbicsXHJcbiAgICAgIGRhbWFnZVJlZ2V4OiAnNDg4RCcsXHJcbiAgICAgIGNvbmRpdGlvbjogKGUpID0+IHtcclxuICAgICAgICAvLyBTaW5nbGUgVGFwXHJcbiAgICAgICAgcmV0dXJuIGUudHlwZSA9PT0gJzE1JztcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKGUpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBlLnRhcmdldE5hbWUsIHRleHQ6IGUuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IGZpbGUwIGZyb20gJy4vMDAtbWlzYy9idWZmcy5qcyc7XG5pbXBvcnQgZmlsZTEgZnJvbSAnLi8wMC1taXNjL2dlbmVyYWwuanMnO1xuaW1wb3J0IGZpbGUyIGZyb20gJy4vMDAtbWlzYy90ZXN0LmpzJztcbmltcG9ydCBmaWxlMyBmcm9tICcuLzAyLWFyci90cmlhbC9pZnJpdC1ubS5qcyc7XG5pbXBvcnQgZmlsZTQgZnJvbSAnLi8wMi1hcnIvdHJpYWwvdGl0YW4tbm0uanMnO1xuaW1wb3J0IGZpbGU1IGZyb20gJy4vMDItYXJyL3RyaWFsL2xldmktZXguanMnO1xuaW1wb3J0IGZpbGU2IGZyb20gJy4vMDItYXJyL3RyaWFsL3NoaXZhLWhtLmpzJztcbmltcG9ydCBmaWxlNyBmcm9tICcuLzAyLWFyci90cmlhbC9zaGl2YS1leC5qcyc7XG5pbXBvcnQgZmlsZTggZnJvbSAnLi8wMi1hcnIvdHJpYWwvdGl0YW4taG0uanMnO1xuaW1wb3J0IGZpbGU5IGZyb20gJy4vMDItYXJyL3RyaWFsL3RpdGFuLWV4LmpzJztcbmltcG9ydCBmaWxlMTAgZnJvbSAnLi8wMy1ody9hbGxpYW5jZS93ZWVwaW5nX2NpdHkuanMnO1xuaW1wb3J0IGZpbGUxMSBmcm9tICcuLzAzLWh3L2R1bmdlb24vYWV0aGVyb2NoZW1pY2FsX3Jlc2VhcmNoX2ZhY2lsaXR5LmpzJztcbmltcG9ydCBmaWxlMTIgZnJvbSAnLi8wMy1ody9kdW5nZW9uL2ZyYWN0YWxfY29udGludXVtLmpzJztcbmltcG9ydCBmaWxlMTMgZnJvbSAnLi8wMy1ody9kdW5nZW9uL2d1YmFsX2xpYnJhcnlfaGFyZC5qcyc7XG5pbXBvcnQgZmlsZTE0IGZyb20gJy4vMDMtaHcvZHVuZ2Vvbi9zb2htX2FsX2hhcmQuanMnO1xuaW1wb3J0IGZpbGUxNSBmcm9tICcuLzAzLWh3L3JhaWQvYTEybi5qcyc7XG5pbXBvcnQgZmlsZTE2IGZyb20gJy4vMDQtc2IvZHVuZ2Vvbi9hbGFfbWhpZ28uanMnO1xuaW1wb3J0IGZpbGUxNyBmcm9tICcuLzA0LXNiL2R1bmdlb24vYmFyZGFtc19tZXR0bGUuanMnO1xuaW1wb3J0IGZpbGUxOCBmcm9tICcuLzA0LXNiL2R1bmdlb24va3VnYW5lX2Nhc3RsZS5qcyc7XG5pbXBvcnQgZmlsZTE5IGZyb20gJy4vMDQtc2IvZHVuZ2Vvbi9zdF9tb2NpYW5uZV9oYXJkLmpzJztcbmltcG9ydCBmaWxlMjAgZnJvbSAnLi8wNC1zYi9kdW5nZW9uL3N3YWxsb3dzX2NvbXBhc3MuanMnO1xuaW1wb3J0IGZpbGUyMSBmcm9tICcuLzA0LXNiL2R1bmdlb24vdGVtcGxlX29mX3RoZV9maXN0LmpzJztcbmltcG9ydCBmaWxlMjIgZnJvbSAnLi8wNC1zYi9kdW5nZW9uL3RoZV9idXJuLmpzJztcbmltcG9ydCBmaWxlMjMgZnJvbSAnLi8wNC1zYi9yYWlkL28xbi5qcyc7XG5pbXBvcnQgZmlsZTI0IGZyb20gJy4vMDQtc2IvcmFpZC9vMm4uanMnO1xuaW1wb3J0IGZpbGUyNSBmcm9tICcuLzA0LXNiL3JhaWQvbzNuLmpzJztcbmltcG9ydCBmaWxlMjYgZnJvbSAnLi8wNC1zYi9yYWlkL280bi5qcyc7XG5pbXBvcnQgZmlsZTI3IGZyb20gJy4vMDQtc2IvcmFpZC9vNHMuanMnO1xuaW1wb3J0IGZpbGUyOCBmcm9tICcuLzA0LXNiL3JhaWQvbzdzLmpzJztcbmltcG9ydCBmaWxlMjkgZnJvbSAnLi8wNC1zYi9yYWlkL28xMnMuanMnO1xuaW1wb3J0IGZpbGUzMCBmcm9tICcuLzA0LXNiL3RyaWFsL2J5YWtrby1leC5qcyc7XG5pbXBvcnQgZmlsZTMxIGZyb20gJy4vMDQtc2IvdHJpYWwvc2hpbnJ5dS5qcyc7XG5pbXBvcnQgZmlsZTMyIGZyb20gJy4vMDQtc2IvdHJpYWwvc3VzYW5vLWV4LmpzJztcbmltcG9ydCBmaWxlMzMgZnJvbSAnLi8wNC1zYi91bHRpbWF0ZS91bHRpbWFfd2VhcG9uX3VsdGltYXRlLmpzJztcbmltcG9ydCBmaWxlMzQgZnJvbSAnLi8wNC1zYi91bHRpbWF0ZS91bmVuZGluZ19jb2lsX3VsdGltYXRlLmpzJztcbmltcG9ydCBmaWxlMzUgZnJvbSAnLi8wNS1zaGIvYWxsaWFuY2UvdGhlX2NvcGllZF9mYWN0b3J5LmpzJztcbmltcG9ydCBmaWxlMzYgZnJvbSAnLi8wNS1zaGIvYWxsaWFuY2UvdGhlX3B1cHBldHNfYnVua2VyLmpzJztcbmltcG9ydCBmaWxlMzcgZnJvbSAnLi8wNS1zaGIvYWxsaWFuY2UvdGhlX3Rvd2VyX2F0X3BhcmFkaWdtc19icmVhY2guanMnO1xuaW1wb3J0IGZpbGUzOCBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL2FrYWRhZW1pYV9hbnlkZXIuanMnO1xuaW1wb3J0IGZpbGUzOSBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL2FtYXVyb3QuanMnO1xuaW1wb3J0IGZpbGU0MCBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL2FuYW1uZXNpc19hbnlkZXIuanMnO1xuaW1wb3J0IGZpbGU0MSBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL2RvaG5fbWhlZy5qcyc7XG5pbXBvcnQgZmlsZTQyIGZyb20gJy4vMDUtc2hiL2R1bmdlb24vaGVyb2VzX2dhdW50bGV0LmpzJztcbmltcG9ydCBmaWxlNDMgZnJvbSAnLi8wNS1zaGIvZHVuZ2Vvbi9ob2xtaW5zdGVyX3N3aXRjaC5qcyc7XG5pbXBvcnQgZmlsZTQ0IGZyb20gJy4vMDUtc2hiL2R1bmdlb24vbWFsaWthaHNfd2VsbC5qcyc7XG5pbXBvcnQgZmlsZTQ1IGZyb20gJy4vMDUtc2hiL2R1bmdlb24vbWF0b3lhc19yZWxpY3QuanMnO1xuaW1wb3J0IGZpbGU0NiBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL210X2d1bGcuanMnO1xuaW1wb3J0IGZpbGU0NyBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL3BhZ2x0aGFuLmpzJztcbmltcG9ydCBmaWxlNDggZnJvbSAnLi8wNS1zaGIvZHVuZ2Vvbi9xaXRhbmFfcmF2ZWwuanMnO1xuaW1wb3J0IGZpbGU0OSBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL3RoZV9ncmFuZF9jb3Ntb3MuanMnO1xuaW1wb3J0IGZpbGU1MCBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL3R3aW5uaW5nLmpzJztcbmltcG9ydCBmaWxlNTEgZnJvbSAnLi8wNS1zaGIvZXVyZWthL2RlbHVicnVtX3JlZ2luYWUuanMnO1xuaW1wb3J0IGZpbGU1MiBmcm9tICcuLzA1LXNoYi9ldXJla2EvZGVsdWJydW1fcmVnaW5hZV9zYXZhZ2UuanMnO1xuaW1wb3J0IGZpbGU1MyBmcm9tICcuLzA1LXNoYi9yYWlkL2Uxbi5qcyc7XG5pbXBvcnQgZmlsZTU0IGZyb20gJy4vMDUtc2hiL3JhaWQvZTFzLmpzJztcbmltcG9ydCBmaWxlNTUgZnJvbSAnLi8wNS1zaGIvcmFpZC9lMm4uanMnO1xuaW1wb3J0IGZpbGU1NiBmcm9tICcuLzA1LXNoYi9yYWlkL2Uycy5qcyc7XG5pbXBvcnQgZmlsZTU3IGZyb20gJy4vMDUtc2hiL3JhaWQvZTNuLmpzJztcbmltcG9ydCBmaWxlNTggZnJvbSAnLi8wNS1zaGIvcmFpZC9lM3MuanMnO1xuaW1wb3J0IGZpbGU1OSBmcm9tICcuLzA1LXNoYi9yYWlkL2U0bi5qcyc7XG5pbXBvcnQgZmlsZTYwIGZyb20gJy4vMDUtc2hiL3JhaWQvZTRzLmpzJztcbmltcG9ydCBmaWxlNjEgZnJvbSAnLi8wNS1zaGIvcmFpZC9lNW4uanMnO1xuaW1wb3J0IGZpbGU2MiBmcm9tICcuLzA1LXNoYi9yYWlkL2U1cy5qcyc7XG5pbXBvcnQgZmlsZTYzIGZyb20gJy4vMDUtc2hiL3JhaWQvZTZuLmpzJztcbmltcG9ydCBmaWxlNjQgZnJvbSAnLi8wNS1zaGIvcmFpZC9lNnMuanMnO1xuaW1wb3J0IGZpbGU2NSBmcm9tICcuLzA1LXNoYi9yYWlkL2U3bi5qcyc7XG5pbXBvcnQgZmlsZTY2IGZyb20gJy4vMDUtc2hiL3JhaWQvZTdzLmpzJztcbmltcG9ydCBmaWxlNjcgZnJvbSAnLi8wNS1zaGIvcmFpZC9lOG4uanMnO1xuaW1wb3J0IGZpbGU2OCBmcm9tICcuLzA1LXNoYi9yYWlkL2U4cy5qcyc7XG5pbXBvcnQgZmlsZTY5IGZyb20gJy4vMDUtc2hiL3JhaWQvZTluLmpzJztcbmltcG9ydCBmaWxlNzAgZnJvbSAnLi8wNS1zaGIvcmFpZC9lOXMuanMnO1xuaW1wb3J0IGZpbGU3MSBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMG4uanMnO1xuaW1wb3J0IGZpbGU3MiBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMHMuanMnO1xuaW1wb3J0IGZpbGU3MyBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMW4uanMnO1xuaW1wb3J0IGZpbGU3NCBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMXMuanMnO1xuaW1wb3J0IGZpbGU3NSBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMm4uanMnO1xuaW1wb3J0IGZpbGU3NiBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMnMuanMnO1xuaW1wb3J0IGZpbGU3NyBmcm9tICcuLzA1LXNoYi90cmlhbC9kaWFtb25kX3dlYXBvbi1leC5qcyc7XG5pbXBvcnQgZmlsZTc4IGZyb20gJy4vMDUtc2hiL3RyaWFsL2RpYW1vbmRfd2VhcG9uLmpzJztcbmltcG9ydCBmaWxlNzkgZnJvbSAnLi8wNS1zaGIvdHJpYWwvZW1lcmFsZF93ZWFwb24tZXguanMnO1xuaW1wb3J0IGZpbGU4MCBmcm9tICcuLzA1LXNoYi90cmlhbC9lbWVyYWxkX3dlYXBvbi5qcyc7XG5pbXBvcnQgZmlsZTgxIGZyb20gJy4vMDUtc2hiL3RyaWFsL2hhZGVzLWV4LmpzJztcbmltcG9ydCBmaWxlODIgZnJvbSAnLi8wNS1zaGIvdHJpYWwvaGFkZXMuanMnO1xuaW1wb3J0IGZpbGU4MyBmcm9tICcuLzA1LXNoYi90cmlhbC9pbm5vY2VuY2UtZXguanMnO1xuaW1wb3J0IGZpbGU4NCBmcm9tICcuLzA1LXNoYi90cmlhbC9pbm5vY2VuY2UuanMnO1xuaW1wb3J0IGZpbGU4NSBmcm9tICcuLzA1LXNoYi90cmlhbC9sZXZpLXVuLmpzJztcbmltcG9ydCBmaWxlODYgZnJvbSAnLi8wNS1zaGIvdHJpYWwvcnVieV93ZWFwb24tZXguanMnO1xuaW1wb3J0IGZpbGU4NyBmcm9tICcuLzA1LXNoYi90cmlhbC9ydWJ5X3dlYXBvbi5qcyc7XG5pbXBvcnQgZmlsZTg4IGZyb20gJy4vMDUtc2hiL3RyaWFsL3NoaXZhLXVuLmpzJztcbmltcG9ydCBmaWxlODkgZnJvbSAnLi8wNS1zaGIvdHJpYWwvdGl0YW5pYS5qcyc7XG5pbXBvcnQgZmlsZTkwIGZyb20gJy4vMDUtc2hiL3RyaWFsL3RpdGFuaWEtZXguanMnO1xuaW1wb3J0IGZpbGU5MSBmcm9tICcuLzA1LXNoYi90cmlhbC90aXRhbi11bi5qcyc7XG5pbXBvcnQgZmlsZTkyIGZyb20gJy4vMDUtc2hiL3RyaWFsL3ZhcmlzLWV4LmpzJztcbmltcG9ydCBmaWxlOTMgZnJvbSAnLi8wNS1zaGIvdHJpYWwvd29sLmpzJztcbmltcG9ydCBmaWxlOTQgZnJvbSAnLi8wNS1zaGIvdHJpYWwvd29sLWV4LmpzJztcbmltcG9ydCBmaWxlOTUgZnJvbSAnLi8wNS1zaGIvdWx0aW1hdGUvdGhlX2VwaWNfb2ZfYWxleGFuZGVyLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgeycwMC1taXNjL2J1ZmZzLmpzJzogZmlsZTAsJzAwLW1pc2MvZ2VuZXJhbC5qcyc6IGZpbGUxLCcwMC1taXNjL3Rlc3QuanMnOiBmaWxlMiwnMDItYXJyL3RyaWFsL2lmcml0LW5tLmpzJzogZmlsZTMsJzAyLWFyci90cmlhbC90aXRhbi1ubS5qcyc6IGZpbGU0LCcwMi1hcnIvdHJpYWwvbGV2aS1leC5qcyc6IGZpbGU1LCcwMi1hcnIvdHJpYWwvc2hpdmEtaG0uanMnOiBmaWxlNiwnMDItYXJyL3RyaWFsL3NoaXZhLWV4LmpzJzogZmlsZTcsJzAyLWFyci90cmlhbC90aXRhbi1obS5qcyc6IGZpbGU4LCcwMi1hcnIvdHJpYWwvdGl0YW4tZXguanMnOiBmaWxlOSwnMDMtaHcvYWxsaWFuY2Uvd2VlcGluZ19jaXR5LmpzJzogZmlsZTEwLCcwMy1ody9kdW5nZW9uL2FldGhlcm9jaGVtaWNhbF9yZXNlYXJjaF9mYWNpbGl0eS5qcyc6IGZpbGUxMSwnMDMtaHcvZHVuZ2Vvbi9mcmFjdGFsX2NvbnRpbnV1bS5qcyc6IGZpbGUxMiwnMDMtaHcvZHVuZ2Vvbi9ndWJhbF9saWJyYXJ5X2hhcmQuanMnOiBmaWxlMTMsJzAzLWh3L2R1bmdlb24vc29obV9hbF9oYXJkLmpzJzogZmlsZTE0LCcwMy1ody9yYWlkL2ExMm4uanMnOiBmaWxlMTUsJzA0LXNiL2R1bmdlb24vYWxhX21oaWdvLmpzJzogZmlsZTE2LCcwNC1zYi9kdW5nZW9uL2JhcmRhbXNfbWV0dGxlLmpzJzogZmlsZTE3LCcwNC1zYi9kdW5nZW9uL2t1Z2FuZV9jYXN0bGUuanMnOiBmaWxlMTgsJzA0LXNiL2R1bmdlb24vc3RfbW9jaWFubmVfaGFyZC5qcyc6IGZpbGUxOSwnMDQtc2IvZHVuZ2Vvbi9zd2FsbG93c19jb21wYXNzLmpzJzogZmlsZTIwLCcwNC1zYi9kdW5nZW9uL3RlbXBsZV9vZl90aGVfZmlzdC5qcyc6IGZpbGUyMSwnMDQtc2IvZHVuZ2Vvbi90aGVfYnVybi5qcyc6IGZpbGUyMiwnMDQtc2IvcmFpZC9vMW4uanMnOiBmaWxlMjMsJzA0LXNiL3JhaWQvbzJuLmpzJzogZmlsZTI0LCcwNC1zYi9yYWlkL28zbi5qcyc6IGZpbGUyNSwnMDQtc2IvcmFpZC9vNG4uanMnOiBmaWxlMjYsJzA0LXNiL3JhaWQvbzRzLmpzJzogZmlsZTI3LCcwNC1zYi9yYWlkL283cy5qcyc6IGZpbGUyOCwnMDQtc2IvcmFpZC9vMTJzLmpzJzogZmlsZTI5LCcwNC1zYi90cmlhbC9ieWFra28tZXguanMnOiBmaWxlMzAsJzA0LXNiL3RyaWFsL3NoaW5yeXUuanMnOiBmaWxlMzEsJzA0LXNiL3RyaWFsL3N1c2Fuby1leC5qcyc6IGZpbGUzMiwnMDQtc2IvdWx0aW1hdGUvdWx0aW1hX3dlYXBvbl91bHRpbWF0ZS5qcyc6IGZpbGUzMywnMDQtc2IvdWx0aW1hdGUvdW5lbmRpbmdfY29pbF91bHRpbWF0ZS5qcyc6IGZpbGUzNCwnMDUtc2hiL2FsbGlhbmNlL3RoZV9jb3BpZWRfZmFjdG9yeS5qcyc6IGZpbGUzNSwnMDUtc2hiL2FsbGlhbmNlL3RoZV9wdXBwZXRzX2J1bmtlci5qcyc6IGZpbGUzNiwnMDUtc2hiL2FsbGlhbmNlL3RoZV90b3dlcl9hdF9wYXJhZGlnbXNfYnJlYWNoLmpzJzogZmlsZTM3LCcwNS1zaGIvZHVuZ2Vvbi9ha2FkYWVtaWFfYW55ZGVyLmpzJzogZmlsZTM4LCcwNS1zaGIvZHVuZ2Vvbi9hbWF1cm90LmpzJzogZmlsZTM5LCcwNS1zaGIvZHVuZ2Vvbi9hbmFtbmVzaXNfYW55ZGVyLmpzJzogZmlsZTQwLCcwNS1zaGIvZHVuZ2Vvbi9kb2huX21oZWcuanMnOiBmaWxlNDEsJzA1LXNoYi9kdW5nZW9uL2hlcm9lc19nYXVudGxldC5qcyc6IGZpbGU0MiwnMDUtc2hiL2R1bmdlb24vaG9sbWluc3Rlcl9zd2l0Y2guanMnOiBmaWxlNDMsJzA1LXNoYi9kdW5nZW9uL21hbGlrYWhzX3dlbGwuanMnOiBmaWxlNDQsJzA1LXNoYi9kdW5nZW9uL21hdG95YXNfcmVsaWN0LmpzJzogZmlsZTQ1LCcwNS1zaGIvZHVuZ2Vvbi9tdF9ndWxnLmpzJzogZmlsZTQ2LCcwNS1zaGIvZHVuZ2Vvbi9wYWdsdGhhbi5qcyc6IGZpbGU0NywnMDUtc2hiL2R1bmdlb24vcWl0YW5hX3JhdmVsLmpzJzogZmlsZTQ4LCcwNS1zaGIvZHVuZ2Vvbi90aGVfZ3JhbmRfY29zbW9zLmpzJzogZmlsZTQ5LCcwNS1zaGIvZHVuZ2Vvbi90d2lubmluZy5qcyc6IGZpbGU1MCwnMDUtc2hiL2V1cmVrYS9kZWx1YnJ1bV9yZWdpbmFlLmpzJzogZmlsZTUxLCcwNS1zaGIvZXVyZWthL2RlbHVicnVtX3JlZ2luYWVfc2F2YWdlLmpzJzogZmlsZTUyLCcwNS1zaGIvcmFpZC9lMW4uanMnOiBmaWxlNTMsJzA1LXNoYi9yYWlkL2Uxcy5qcyc6IGZpbGU1NCwnMDUtc2hiL3JhaWQvZTJuLmpzJzogZmlsZTU1LCcwNS1zaGIvcmFpZC9lMnMuanMnOiBmaWxlNTYsJzA1LXNoYi9yYWlkL2Uzbi5qcyc6IGZpbGU1NywnMDUtc2hiL3JhaWQvZTNzLmpzJzogZmlsZTU4LCcwNS1zaGIvcmFpZC9lNG4uanMnOiBmaWxlNTksJzA1LXNoYi9yYWlkL2U0cy5qcyc6IGZpbGU2MCwnMDUtc2hiL3JhaWQvZTVuLmpzJzogZmlsZTYxLCcwNS1zaGIvcmFpZC9lNXMuanMnOiBmaWxlNjIsJzA1LXNoYi9yYWlkL2U2bi5qcyc6IGZpbGU2MywnMDUtc2hiL3JhaWQvZTZzLmpzJzogZmlsZTY0LCcwNS1zaGIvcmFpZC9lN24uanMnOiBmaWxlNjUsJzA1LXNoYi9yYWlkL2U3cy5qcyc6IGZpbGU2NiwnMDUtc2hiL3JhaWQvZThuLmpzJzogZmlsZTY3LCcwNS1zaGIvcmFpZC9lOHMuanMnOiBmaWxlNjgsJzA1LXNoYi9yYWlkL2U5bi5qcyc6IGZpbGU2OSwnMDUtc2hiL3JhaWQvZTlzLmpzJzogZmlsZTcwLCcwNS1zaGIvcmFpZC9lMTBuLmpzJzogZmlsZTcxLCcwNS1zaGIvcmFpZC9lMTBzLmpzJzogZmlsZTcyLCcwNS1zaGIvcmFpZC9lMTFuLmpzJzogZmlsZTczLCcwNS1zaGIvcmFpZC9lMTFzLmpzJzogZmlsZTc0LCcwNS1zaGIvcmFpZC9lMTJuLmpzJzogZmlsZTc1LCcwNS1zaGIvcmFpZC9lMTJzLmpzJzogZmlsZTc2LCcwNS1zaGIvdHJpYWwvZGlhbW9uZF93ZWFwb24tZXguanMnOiBmaWxlNzcsJzA1LXNoYi90cmlhbC9kaWFtb25kX3dlYXBvbi5qcyc6IGZpbGU3OCwnMDUtc2hiL3RyaWFsL2VtZXJhbGRfd2VhcG9uLWV4LmpzJzogZmlsZTc5LCcwNS1zaGIvdHJpYWwvZW1lcmFsZF93ZWFwb24uanMnOiBmaWxlODAsJzA1LXNoYi90cmlhbC9oYWRlcy1leC5qcyc6IGZpbGU4MSwnMDUtc2hiL3RyaWFsL2hhZGVzLmpzJzogZmlsZTgyLCcwNS1zaGIvdHJpYWwvaW5ub2NlbmNlLWV4LmpzJzogZmlsZTgzLCcwNS1zaGIvdHJpYWwvaW5ub2NlbmNlLmpzJzogZmlsZTg0LCcwNS1zaGIvdHJpYWwvbGV2aS11bi5qcyc6IGZpbGU4NSwnMDUtc2hiL3RyaWFsL3J1Ynlfd2VhcG9uLWV4LmpzJzogZmlsZTg2LCcwNS1zaGIvdHJpYWwvcnVieV93ZWFwb24uanMnOiBmaWxlODcsJzA1LXNoYi90cmlhbC9zaGl2YS11bi5qcyc6IGZpbGU4OCwnMDUtc2hiL3RyaWFsL3RpdGFuaWEuanMnOiBmaWxlODksJzA1LXNoYi90cmlhbC90aXRhbmlhLWV4LmpzJzogZmlsZTkwLCcwNS1zaGIvdHJpYWwvdGl0YW4tdW4uanMnOiBmaWxlOTEsJzA1LXNoYi90cmlhbC92YXJpcy1leC5qcyc6IGZpbGU5MiwnMDUtc2hiL3RyaWFsL3dvbC5qcyc6IGZpbGU5MywnMDUtc2hiL3RyaWFsL3dvbC1leC5qcyc6IGZpbGU5NCwnMDUtc2hiL3VsdGltYXRlL3RoZV9lcGljX29mX2FsZXhhbmRlci5qcyc6IGZpbGU5NSx9OyJdLCJzb3VyY2VSb290IjoiIn0=