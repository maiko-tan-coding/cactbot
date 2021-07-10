(self["webpackChunkcactbot"] = self["webpackChunkcactbot"] || []).push([[727],{

/***/ 5661:
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

const effectCollectSeconds = 2.0;

const isInPartyConditionFunc = (data, matches) => {
  const sourceId = matches.sourceId.toUpperCase();
  if (data.party.partyIds.includes(sourceId)) return true;

  if (data.petIdToOwnerId) {
    const ownerId = data.petIdToOwnerId[sourceId];
    if (ownerId && data.party.partyIds.includes(ownerId)) return true;
  }

  return false;
}; // args: triggerId, netRegex, field, type, ignoreSelf


const missedFunc = args => [{
  // Sure, not all of these are "buffs" per se, but they're all in the buffs file.
  id: `Buff ${args.triggerId} Collect`,
  netRegex: args.netRegex,
  condition: isInPartyConditionFunc,
  run: (data, matches) => {
    data.generalBuffCollection = data.generalBuffCollection || {};
    data.generalBuffCollection[args.triggerId] = data.generalBuffCollection[args.triggerId] || [];
    data.generalBuffCollection[args.triggerId].push(matches);
  }
}, {
  id: `Buff ${args.triggerId}`,
  netRegex: args.netRegex,
  condition: isInPartyConditionFunc,
  delaySeconds: args.collectSeconds,
  suppressSeconds: args.collectSeconds,
  mistake: (data, _matches) => {
    if (!data.generalBuffCollection) return;
    const allMatches = data.generalBuffCollection[args.triggerId];
    if (!allMatches) return;
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
  },
  run: data => {
    if (data.generalBuffCollection) delete data.generalBuffCollection[args.triggerId];
  }
}];

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
    run: (data, matches) => {
      if (matches.ownerId === '0') return;
      data.petIdToOwnerId = data.petIdToOwnerId || {}; // Fix any lowercase ids.

      data.petIdToOwnerId[matches.id.toUpperCase()] = matches.ownerId.toUpperCase();
    }
  }, {
    id: 'Buff Pet To Owner Clearer',
    netRegex: netregexes/* default.changeZone */.Z.changeZone(),
    run: data => {
      // Clear this hash periodically so it doesn't have false positives.
      data.petIdToOwnerId = {};
    }
  }, // Prefer abilities to effects, as effects take longer to roll through the party.
  // However, some things are only effects and so there is no choice.
  // For things you can step in or out of, give a longer timer?  This isn't perfect.
  // TODO: include soil here??
  ...missedMitigationBuff({
    id: 'Collective Unconscious',
    effectId: '351',
    collectSeconds: 10
  }), // Arms Up = 498 (others), Passage Of Arms = 497 (you).  Use both in case everybody is missed.
  ...missedMitigationBuff({
    id: 'Passage of Arms',
    effectId: '49[78]',
    ignoreSelf: true,
    collectSeconds: 10
  }), ...missedMitigationBuff({
    id: 'Divine Veil',
    effectId: '2D7',
    ignoreSelf: true
  }), ...missedMitigationAbility({
    id: 'Heart Of Light',
    abilityId: '3F20'
  }), ...missedMitigationAbility({
    id: 'Dark Missionary',
    abilityId: '4057'
  }), ...missedMitigationAbility({
    id: 'Shake It Off',
    abilityId: '1CDC'
  }), // 3F44 is the correct Quadruple Technical Finish, others are Dinky Technical Finish.
  ...missedDamageAbility({
    id: 'Technical Finish',
    abilityId: '3F4[1-4]'
  }), ...missedDamageAbility({
    id: 'Divination',
    abilityId: '40A8'
  }), ...missedDamageAbility({
    id: 'Brotherhood',
    abilityId: '1CE4'
  }), ...missedDamageAbility({
    id: 'Battle Litany',
    abilityId: 'DE5'
  }), ...missedDamageAbility({
    id: 'Embolden',
    abilityId: '1D60'
  }), ...missedDamageAbility({
    id: 'Battle Voice',
    abilityId: '76',
    ignoreSelf: true
  }), // Too noisy (procs every three seconds, and bards often off doing mechanics).
  // missedDamageBuff({ id: 'Wanderer\'s Minuet', effectId: '8A8', ignoreSelf: true }),
  // missedDamageBuff({ id: 'Mage\'s Ballad', effectId: '8A9', ignoreSelf: true }),
  // missedDamageBuff({ id: 'Army\'s Paeon', effectId: '8AA', ignoreSelf: true }),
  ...missedMitigationAbility({
    id: 'Troubadour',
    abilityId: '1CED'
  }), ...missedMitigationAbility({
    id: 'Tactician',
    abilityId: '41F9'
  }), ...missedMitigationAbility({
    id: 'Shield Samba',
    abilityId: '3E8C'
  }), ...missedMitigationAbility({
    id: 'Mantra',
    abilityId: '41'
  }), ...missedDamageAbility({
    id: 'Devotion',
    abilityId: '1D1A'
  }), // Maybe using a healer LB1/LB2 should be an error for the healer. O:)
  // ...missedHeal({ id: 'Healing Wind', abilityId: 'CE' }),
  // ...missedHeal({ id: 'Breath of the Earth', abilityId: 'CF' }),
  ...missedHeal({
    id: 'Medica',
    abilityId: '7C'
  }), ...missedHeal({
    id: 'Medica II',
    abilityId: '85'
  }), ...missedHeal({
    id: 'Afflatus Rapture',
    abilityId: '4096'
  }), ...missedHeal({
    id: 'Temperance',
    abilityId: '751'
  }), ...missedHeal({
    id: 'Plenary Indulgence',
    abilityId: '1D09'
  }), ...missedHeal({
    id: 'Pulse of Life',
    abilityId: 'D0'
  }), ...missedHeal({
    id: 'Succor',
    abilityId: 'BA'
  }), ...missedHeal({
    id: 'Indomitability',
    abilityId: 'DFF'
  }), ...missedHeal({
    id: 'Deployment Tactics',
    abilityId: 'E01'
  }), ...missedHeal({
    id: 'Whispering Dawn',
    abilityId: '323'
  }), ...missedHeal({
    id: 'Fey Blessing',
    abilityId: '40A0'
  }), ...missedHeal({
    id: 'Consolation',
    abilityId: '40A3'
  }), ...missedHeal({
    id: 'Angel\'s Whisper',
    abilityId: '40A6'
  }), ...missedMitigationAbility({
    id: 'Fey Illumination',
    abilityId: '325'
  }), ...missedMitigationAbility({
    id: 'Seraphic Illumination',
    abilityId: '40A7'
  }), ...missedHeal({
    id: 'Angel Feathers',
    abilityId: '1097'
  }), ...missedHeal({
    id: 'Helios',
    abilityId: 'E10'
  }), ...missedHeal({
    id: 'Aspected Helios',
    abilityId: 'E11'
  }), ...missedHeal({
    id: 'Aspected Helios',
    abilityId: '3200'
  }), ...missedHeal({
    id: 'Celestial Opposition',
    abilityId: '40A9'
  }), ...missedHeal({
    id: 'Astral Stasis',
    abilityId: '1098'
  }), ...missedHeal({
    id: 'White Wind',
    abilityId: '2C8E'
  }), ...missedHeal({
    id: 'Gobskin',
    abilityId: '4780'
  }), // TODO: export all of these missed functions into their own helper
  // and then add this to the Delubrum Reginae files directly.
  ...missedMitigationAbility({
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
    condition: (_data, matches) => {
      // Prevent "Eos loses the effect of Well Fed from Critlo Mcgee"
      return matches.target === matches.source;
    },
    mistake: (data, matches) => {
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
    run: (data, matches) => {
      if (!data.lostFood) return;
      delete data.lostFood[matches.target];
    }
  }, {
    id: 'General Rabbit Medium',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '8E0'
    }),
    condition: (data, matches) => data.IsPlayerId(matches.sourceId),
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.source,
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
    mistake: data => {
      return {
        type: 'pull',
        blame: data.me,
        text: {
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
    mistake: data => {
      return {
        type: 'wipe',
        blame: data.me,
        text: {
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '35'
    }),
    condition: (data, matches) => {
      if (matches.source !== data.me) return false;
      const strikingDummyByLocale = {
        en: 'Striking Dummy',
        fr: 'Mannequin d\'entraînement',
        ja: '木人',
        cn: '木人',
        ko: '나무인형'
      };
      const strikingDummyNames = Object.values(strikingDummyByLocale);
      return strikingDummyNames.includes(matches.target);
    },
    mistake: (data, matches) => {
      data.bootCount = data.bootCount || 0;
      data.bootCount++;
      const text = `${matches.ability} (${data.bootCount}): ${data.DamageFromMatches(matches)}`;
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
    condition: (data, matches) => matches.source === data.me,
    mistake: (data, matches) => {
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
    mistake: (data, matches) => {
      return {
        type: 'fail',
        blame: data.me,
        text: matches.line
      };
    }
  }, {
    id: 'Test Poke Collect',
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
    run: data => {
      data.pokeCount = (data.pokeCount || 0) + 1;
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
    delaySeconds: 5,
    mistake: data => {
      // 1 poke at a time is fine, but more than one in 5 seconds is (OBVIOUSLY) a mistake.
      if (!data.pokeCount || data.pokeCount <= 1) return;
      return {
        type: 'fail',
        blame: data.me,
        text: {
          en: `Too many pokes (${data.pokeCount})`,
          de: `Zu viele Piekser (${data.pokeCount})`,
          fr: `Trop de touches (${data.pokeCount})`,
          ja: `いっぱいつついた (${data.pokeCount})`,
          cn: `戳太多下啦 (${data.pokeCount})`,
          ko: `너무 많이 찌름 (${data.pokeCount}번)`
        }
      };
    },
    run: data => delete data.pokeCount
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/02-arr/trial/ifrit-nm.js
 // Ifrit Story Mode

/* harmony default export */ const ifrit_nm = ({
  zoneId: zone_id/* default.TheBowlOfEmbers */.Z.TheBowlOfEmbers,
  damageWarn: {
    'IfritNm Radiant Plume': '2DE'
  },
  shareWarn: {
    'IfritNm Incinerate': '1C5',
    'IfritNm Eruption': '2DD'
  }
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
    deathReason: (_data, matches) => {
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
    condition: data => {
      // The intermission also gets this effect, so only a mistake after that.
      // Unlike extreme, this has the same 20 second duration as the intermission.
      return data.seenDiamondDust;
    },
    mistake: (_data, matches) => {
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
  soloWarn: {
    // Party shared tankbuster
    'ShivaEx Icebrand': 'BE1'
  },
  triggers: [{
    id: 'ShivaEx Deep Freeze',
    // Shiva also uses ability C8A on you, but it has the untranslated name
    // 透明：シヴァ：凍結レクト：ノックバック用/ヒロイック. So, use the effect instead for free translation.
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '1E7'
    }),
    condition: (_data, matches) => {
      // The intermission also gets this effect, but for a shorter duration.
      return parseFloat(matches.duration) > 20;
    },
    mistake: (_data, matches) => {
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
    run: (data, matches) => {
      data.zombie = data.zombie || {};
      data.zombie[matches.target] = true;
    }
  }, {
    id: 'Weeping Forgall Gradual Zombification Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '415'
    }),
    run: (data, matches) => {
      data.zombie = data.zombie || {};
      data.zombie[matches.target] = false;
    }
  }, {
    id: 'Weeping Forgall Mega Death',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '17CA'
    }),
    condition: (data, matches) => data.zombie && !data.zombie[matches.target],
    mistake: (_data, matches) => {
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
    run: (data, matches) => {
      data.shield = data.shield || {};
      data.shield[matches.target] = true;
    }
  }, {
    id: 'Weeping Headstone Shield Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '15E'
    }),
    run: (data, matches) => {
      data.shield = data.shield || {};
      data.shield[matches.target] = false;
    }
  }, {
    id: 'Weeping Flaring Epigraph',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '1856'
    }),
    condition: (data, matches) => data.shield && !data.shield[matches.target],
    mistake: (_data, matches) => {
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
      type: '22',
      id: '1831'
    }),
    mistake: (_data, matches) => {
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
    deathReason: (_data, matches) => {
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
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
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
// EXTERNAL MODULE: ./ui/oopsyraidsy/oopsy_common.ts
var oopsy_common = __webpack_require__(5013);
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
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    // Helper for Thunder 3 failures
    id: 'GubalHm Imp Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '46E'
    }),
    run: (data, matches) => {
      data.hasImp = data.hasImp || {};
      data.hasImp[matches.target] = true;
    }
  }, {
    id: 'GubalHm Imp Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '46E'
    }),
    run: (data, matches) => {
      data.hasImp = data.hasImp || {};
      data.hasImp[matches.target] = false;
    }
  }, {
    // Targets with Imp when Thunder III resolves receive a vulnerability stack and brief stun
    id: 'GubalHm Imp Thunder',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '195[AB]',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => data.hasImp[matches.target],
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '1956',
      ...oopsy_common/* playerDamageFields */.np
    }),
    // Always hits target, but if correctly resolved will deal 0 damage
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    id: 'GubalHm Tornado',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '195[78]',
      ...oopsy_common/* playerDamageFields */.np
    }),
    // Always hits target, but if correctly resolved will deal 0 damage
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
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
    mistake: (_data, matches) => {
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
    run: (data, matches) => {
      data.assault = data.assault || [];
      data.assault.push(matches.target);
    }
  }, {
    // It is a failure for a Severity marker to stack with the Solidarity group.
    id: 'A12N Assault Failure',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '1AF2',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => data.assault.includes(matches.target),
    mistake: (_data, matches) => {
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
    run: data => {
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
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
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
    condition: (_data, matches) => matches.flags.substr(-2) === '0E',
    mistake: (_data, matches) => {
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
    condition: (_data, matches) => matches.type === '21',
    // Taking the stack solo is *probably* a mistake.
    mistake: (_data, matches) => {
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
  soloFail: {
    'St Mocianne Hard Fault Warren': '2E4A' // Stack marker, Nullchu, boss 1

  }
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
    deathReason: (_data, matches) => {
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
    mistake: (_data, matches) => {
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
  shareWarn: {
    'O1N Levinbolt': '23DA' // small spread circles

  }
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
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    id: 'O2N Earthquake',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '2515',
      ...oopsy_common/* playerDamageFields */.np
    }),
    // This deals damage only to non-floating targets.
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
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
    run: data => {
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
    condition: data => !data.initialized,
    run: data => {
      data.gameCount = 0; // Indexing phases at 1 so as to make phases match what humans expect.
      // 1: We start here.
      // 2: Cave phase with Uplifts.
      // 3: Post-intermission, with good and bad frogs.

      data.phaseNumber = 1;
      data.initialized = true;
    }
  }, {
    id: 'O3N Ribbit',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '2466'
    }),
    condition: (data, matches) => {
      // We DO want to be hit by Toad/Ribbit if the next cast of The Game
      // is 4x toad panels.
      return !(data.phaseNumber === 3 && data.gameCount % 2 === 0) && matches.targetId !== 'E0000000';
    },
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    // There's a lot we could do to track exactly how the player failed The Game.
    // Why overthink Normal mode, however?
    id: 'O3N The Game',
    // Guess what you just lost?
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '246D'
    }),
    // If the player takes no damage, they did the mechanic correctly.
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    },
    run: data => {
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
    deathReason: (_data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
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
    // Short knockback from Exdeath
    id: 'O4N Vacuum Wave',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '24B8',
      ...oopsy_common/* playerDamageFields */.np
    }),
    deathReason: (_data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
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
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
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
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '2408',
      capture: false
    }),
    run: data => {
      data.isDecisiveBattleElement = true;
    }
  }, {
    id: 'O4S1 Vacuum Wave',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '23FE',
      capture: false
    }),
    run: data => {
      data.isDecisiveBattleElement = false;
    }
  }, {
    id: 'O4S2 Almagest',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '2417',
      capture: false
    }),
    run: data => {
      data.isNeoExdeath = true;
    }
  }, {
    id: 'O4S2 Blizzard III',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '23F8',
      ...oopsy_common/* playerDamageFields */.np
    }),
    // Ignore unavoidable raid aoe Blizzard III.
    condition: data => !data.isDecisiveBattleElement,
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.abilityName
      };
    }
  }, {
    id: 'O4S2 Thunder III',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '23FD',
      ...oopsy_common/* playerDamageFields */.np
    }),
    // Only consider this during random mechanic after decisive battle.
    condition: data => data.isDecisiveBattleElement,
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.abilityName
      };
    }
  }, {
    id: 'O4S2 Petrified',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '262'
    }),
    mistake: (data, matches) => {
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '242E',
      ...oopsy_common/* playerDamageFields */.np
    }),
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    id: 'O4S2 Beyond Death Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '566'
    }),
    run: (data, matches) => {
      data.hasBeyondDeath = data.hasBeyondDeath || {};
      data.hasBeyondDeath[matches.target] = true;
    }
  }, {
    id: 'O4S2 Beyond Death Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '566'
    }),
    run: (data, matches) => {
      data.hasBeyondDeath = data.hasBeyondDeath || {};
      data.hasBeyondDeath[matches.target] = false;
    }
  }, {
    id: 'O4S2 Beyond Death',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '566'
    }),
    delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (data, matches) => {
      if (!data.hasBeyondDeath) return;
      if (!data.hasBeyondDeath[matches.target]) return;
      return {
        name: matches.target,
        reason: matches.effect
      };
    }
  }, {
    id: 'O4S2 Double Attack Collect',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '241C',
      ...oopsy_common/* playerDamageFields */.np
    }),
    run: (data, matches) => {
      data.doubleAttackMatches = data.doubleAttackMatches || [];
      data.doubleAttackMatches.push(matches);
    }
  }, {
    id: 'O4S2 Double Attack',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '241C',
      ...oopsy_common/* playerDamageFields */.np
    }),
    mistake: data => {
      const arr = data.doubleAttackMatches;
      if (!arr) return;
      if (arr.length <= 2) return; // Hard to know who should be in this and who shouldn't, but
      // it should never hit 3 people.

      return {
        type: 'fail',
        text: `${arr[0].ability} x ${arr.length}`
      };
    },
    run: data => delete data.doubleAttackMatches
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
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '2AB5'
    }),
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.source,
        text: matches.ability
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
    deathReason: (_data, matches) => {
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
    run: (data, matches) => {
      data.vuln = data.vuln || {};
      data.vuln[matches.target] = true;
    }
  }, {
    id: 'O12S1 Magic Vulnerability Up Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '472'
    }),
    run: (data, matches) => {
      data.vuln = data.vuln || {};
      data.vuln[matches.target] = false;
    }
  }, {
    id: 'O12S1 Magic Vulnerability Damage',
    // 332E = Pile Pitch stack
    // 333E = Electric Slide (Omega-M square 1-4 dashes)
    // 333F = Electric Slide (Omega-F triangle 1-4 dashes)
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: ['332E', '333E', '333F'],
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => data.vuln && data.vuln[matches.target],
    mistake: (_data, matches) => {
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '27EC',
      ...oopsy_common/* playerDamageFields */.np
    }),
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
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
    deathReason: (_data, matches) => {
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '1F8B',
      ...oopsy_common/* playerDamageFields */.np
    }),
    deathReason: (_data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '1F90',
      ...oopsy_common/* playerDamageFields */.np
    }),
    deathReason: (_data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
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
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    // Featherlance explosion.  It seems like the person who pops it is the
    // first person listed damage-wise, so they are likely the culprit.
    id: 'UWU Featherlance',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '2B43',
      ...oopsy_common/* playerDamageFields */.np
    }),
    suppressSeconds: 5,
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.source
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
    // Instant death has a special flag value, differentiating
    // from the explosion damage you take when somebody else
    // pops one.
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '26AB',
      ...oopsy_common/* playerDamageFields */.np,
      flags: oopsy_common/* kFlagInstantDeath */.hm
    }),
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '26B9',
      ...oopsy_common/* playerDamageFields */.np
    }),
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '26C8',
      ...oopsy_common/* playerDamageFields */.np
    }),
    mistake: (_data, matches) => {
      // It's hard to assign blame for lightning.  The debuffs
      // go out and then explode in order, but the attacker is
      // the dragon and not the player.
      return {
        type: 'warn',
        name: matches.target,
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
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    id: 'UCU Sludge',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '11F'
    }),
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    id: 'UCU Doom Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: 'D2'
    }),
    run: (data, matches) => {
      data.hasDoom = data.hasDoom || {};
      data.hasDoom[matches.target] = true;
    }
  }, {
    id: 'UCU Doom Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: 'D2'
    }),
    run: (data, matches) => {
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
    delaySeconds: (_data, matches) => parseFloat(matches.duration) - 1,
    deathReason: (data, matches) => {
      if (!data.hasDoom || !data.hasDoom[matches.target]) return;
      let reason;
      const duration = parseFloat(matches.duration);
      if (duration < 9) reason = matches.effect + ' #1';else if (duration < 14) reason = matches.effect + ' #2';else reason = matches.effect + ' #3';
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
    deathReason: (_data, matches) => {
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
    mistake: (_data, matches) => {
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
    mistake: (_data, matches) => {
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
    mistake: (_data, matches) => {
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
  soloWarn: {
    // This should always be shared.  On all times but the 2nd and 3rd, it's a party share.
    // TODO: on the 2nd and 3rd time this should only be shared with a rock.
    // TODO: alternatively warn on taking one of these with a 472 Magic Vulnerability Up effect
    'THG Wild Anguish': '5209'
  },
  triggers: [{
    id: 'THG Wild Rampage',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '5207',
      ...oopsy_common/* playerDamageFields */.np
    }),
    // This is zero damage if you are in the crater.
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: ['565A', '565B', '57FD', '57FE', '5B86', '5B87', '59D2', '5D93'],
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (_data, matches) => matches.flags.slice(-2) === '03',
    mistake: (_data, matches) => {
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: ['5827', '5828', '5B6C', '5B6D', '5BB6', '5BB7', '5B88', '5B89'],
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (_data, matches) => matches.flags.slice(-2) === '03',
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    id: 'DelubrumSav Golem Compaction',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '5746'
    }),
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        text: `${matches.source}: ${matches.ability}`
      };
    }
  }, {
    id: 'DelubrumSav Slime Sanguine Fusion',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '554D'
    }),
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        text: `${matches.source}: ${matches.ability}`
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
  shareFail: {
    'E1N Fire III': '44EB',
    'E1N Vice Of Vanity': '44E7',
    // tank lasers
    'E1N Vice Of Apathy': '44E8' // dps puddles

  }
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
  shareFail: {
    'E1S Fire/Thunder III': '44FB',
    'E1S Pure Beam Single': '3D81',
    'E1S Vice Of Vanity': '44F1',
    // tank lasers
    'E1S Vice of Apathy': '44F2' // dps puddles

  }
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '3E3D',
      ...oopsy_common/* playerDamageFields */.np
    }),
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: {
          en: 'Booped',
          de: matches.ability,
          // FIXME
          fr: 'Malus de dégâts',
          ja: matches.ability,
          // FIXME
          cn: matches.ability,
          // FIXME
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
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    id: 'E2S Nyx',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '3E51',
      ...oopsy_common/* playerDamageFields */.np
    }),
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: {
          en: 'Booped',
          de: matches.ability,
          // FIXME
          fr: 'Malus de dégâts',
          ja: matches.ability,
          // FIXME
          cn: matches.ability,
          // FIXME
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
  shareFail: {
    'E3N Rip Current': '3FC7'
  }
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
    run: (data, matches) => {
      data.faultLineTarget = matches.target;
    }
  }, {
    id: 'E4S Fault Line',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '411E',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => data.faultLineTarget !== matches.target,
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: {
          en: 'Run Over',
          de: matches.ability,
          // FIXME
          fr: 'A été écrasé(e)',
          ja: matches.ability,
          // FIXME
          cn: matches.ability,
          // FIXME
          ko: matches.ability // FIXME

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
    mistake: (_data, matches) => {
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
    run: (data, matches) => {
      data.hasOrb = data.hasOrb || {};
      data.hasOrb[matches.target] = true;
    }
  }, {
    id: 'E5N Orb Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '8B4'
    }),
    run: (data, matches) => {
      data.hasOrb = data.hasOrb || {};
      data.hasOrb[matches.target] = false;
    }
  }, {
    id: 'E5N Divine Judgement Volts',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4B9A',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => !data.hasOrb[matches.target],
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: {
          en: `${matches.ability} (no orb)`,
          de: `${matches.ability} (kein Orb)`,
          fr: `${matches.ability} (pas d'orbe)`,
          ja: `${matches.ability} (雷玉無し)`,
          cn: `${matches.ability} (没吃球)`
        }
      };
    }
  }, {
    id: 'E5N Stormcloud Target Tracking',
    netRegex: netregexes/* default.headMarker */.Z.headMarker({
      id: '006E'
    }),
    run: (data, matches) => {
      data.cloudMarkers = data.cloudMarkers || [];
      data.cloudMarkers.push(matches.target);
    }
  }, {
    // This ability is seen only if players stacked the clouds instead of spreading them.
    id: 'E5N The Parting Clouds',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4B9D',
      ...oopsy_common/* playerDamageFields */.np
    }),
    suppressSeconds: 30,
    mistake: (data, matches) => {
      for (const m of data.cloudMarkers) {
        return {
          type: 'fail',
          blame: data.cloudMarkers[m],
          text: {
            en: `${matches.ability} (clouds too close)`,
            de: `${matches.ability} (Wolken zu nahe)`,
            fr: `${matches.ability} (nuages trop proches)`,
            ja: `${matches.ability} (雲近すぎ)`,
            cn: `${matches.ability} (雷云重叠)`
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
    run: data => {
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
    run: (data, matches) => {
      data.hasOrb = data.hasOrb || {};
      data.hasOrb[matches.target] = true;
    }
  }, {
    id: 'E5S Orb Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '8B4'
    }),
    run: (data, matches) => {
      data.hasOrb = data.hasOrb || {};
      data.hasOrb[matches.target] = false;
    }
  }, {
    id: 'E5S Divine Judgement Volts',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4BB7',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => !data.hasOrb || !data.hasOrb[matches.target],
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: noOrb(matches.ability)
      };
    }
  }, {
    id: 'E5S Volt Strike Orb',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4BC3',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => !data.hasOrb || !data.hasOrb[matches.target],
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: noOrb(matches.ability)
      };
    }
  }, {
    id: 'E5S Deadly Discharge Big Knockback',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4BB2',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => !data.hasOrb || !data.hasOrb[matches.target],
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: noOrb(matches.ability)
      };
    }
  }, {
    id: 'E5S Lightning Bolt',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4BB9',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => {
      // Having a non-idempotent condition function is a bit <_<
      // Only consider lightning bolt damage if you have a debuff to clear.
      if (!data.hated || !data.hated[matches.target]) return true;
      delete data.hated[matches.target];
      return false;
    },
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    id: 'E5S Hated of Levin',
    netRegex: netregexes/* default.headMarker */.Z.headMarker({
      id: '00D2'
    }),
    run: (data, matches) => {
      data.hated = data.hated || {};
      data.hated[matches.target] = true;
    }
  }, {
    id: 'E5S Stormcloud Target Tracking',
    netRegex: netregexes/* default.headMarker */.Z.headMarker({
      id: '006E'
    }),
    run: (data, matches) => {
      data.cloudMarkers = data.cloudMarkers || [];
      data.cloudMarkers.push(matches.target);
    }
  }, {
    // This ability is seen only if players stacked the clouds instead of spreading them.
    id: 'E5S The Parting Clouds',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4BBA',
      ...oopsy_common/* playerDamageFields */.np
    }),
    suppressSeconds: 30,
    mistake: (data, matches) => {
      for (const m of data.cloudMarkers) {
        return {
          type: 'fail',
          blame: data.cloudMarkers[m],
          text: {
            en: `${matches.ability} (clouds too close)`,
            de: `${matches.ability} (Wolken zu nahe)`,
            fr: `${matches.ability} (nuages trop proches)`,
            ja: `${matches.ability} (雲近すぎ)`,
            cn: `${matches.ability} (雷云重叠)`
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
    run: data => {
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
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e6s.ts

// TODO: check tethers being cut (when they shouldn't)
// TODO: check for concussed debuff
// TODO: check for taking tankbuster with lightheaded
// TODO: check for one person taking multiple Storm Of Fury Tethers (4C01/4C08)
const triggerSet = {
    zoneId: zone_id/* default.EdensVerseFurorSavage */.Z.EdensVerseFurorSavage,
    damageWarn: {
        // It's common to just ignore futbol mechanics, so don't warn on Strike Spark.
        // 'Spike Of Flame': '4C13', // Orb explosions after Strike Spark
        'E6S Thorns': '4BFA',
        'E6S Ferostorm 1': '4BFD',
        'E6S Ferostorm 2': '4C06',
        'E6S Storm Of Fury 1': '4C00',
        'E6S Storm Of Fury 2': '4C07',
        'E6S Explosion': '4C03',
        'E6S Heat Burst': '4C1F',
        'E6S Conflag Strike': '4C10',
        'E6S Radiant Plume': '4C15',
        'E6S Eruption': '4C17',
        'E6S Wind Cutter': '4C02',
    },
    damageFail: {
        'E6S Vacuum Slice': '4BF5',
        'E6S Downburst 1': '4BFB',
        'E6S Downburst 2': '4BFC',
        'E6S Meteor Strike': '4C0F',
    },
    shareWarn: {
        'E6S Hands of Hell': '4C0[BC]',
        'E6S Hands of Flame': '4C0A',
        'E6S Instant Incineration': '4C0E',
        'E6S Blaze': '4C1B',
    },
    soloFail: {
        'E6S Air Bump': '4BF9',
    },
};
/* harmony default export */ const e6s = (triggerSet);

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
  shareWarn: {
    'E7N Stygian Stake': '4C33',
    // Laser tank buster, outside intermission phase
    'E5N Silver Shot': '4E7D' // Spread markers, intermission

  },
  triggers: [{
    id: 'E7N Astral Effect Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '8BE'
    }),
    run: (data, matches) => {
      data.hasAstral = data.hasAstral || {};
      data.hasAstral[matches.target] = true;
    }
  }, {
    id: 'E7N Astral Effect Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '8BE'
    }),
    run: (data, matches) => {
      data.hasAstral = data.hasAstral || {};
      data.hasAstral[matches.target] = false;
    }
  }, {
    id: 'E7N Umbral Effect Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '8BF'
    }),
    run: (data, matches) => {
      data.hasUmbral = data.hasUmbral || {};
      data.hasUmbral[matches.target] = true;
    }
  }, {
    id: 'E7N Umbral Effect Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '8BF'
    }),
    run: (data, matches) => {
      data.hasUmbral = data.hasUmbral || {};
      data.hasUmbral[matches.target] = false;
    }
  }, {
    id: 'E7N Light\'s Course',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: ['4C3E', '4C40', '4C22', '4C3C', '4E63'],
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => {
      return !data.hasUmbral || !data.hasUmbral[matches.target];
    },
    mistake: (data, matches) => {
      if (data.hasAstral && data.hasAstral[matches.target]) return {
        type: 'fail',
        blame: matches.target,
        text: wrongBuff(matches.ability)
      };
      return {
        type: 'warn',
        blame: matches.target,
        text: noBuff(matches.ability)
      };
    }
  }, {
    id: 'E7N Darks\'s Course',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: ['4C3D', '4C23', '4C41', '4C43'],
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => {
      return !data.hasAstral || !data.hasAstral[matches.target];
    },
    mistake: (data, matches) => {
      if (data.hasUmbral && data.hasUmbral[matches.target]) return {
        type: 'fail',
        blame: matches.target,
        text: wrongBuff(matches.ability)
      }; // This case is probably impossible, as the debuff ticks after death,
      // but leaving it here in case there's some rez or disconnect timing
      // that could lead to this.

      return {
        type: 'warn',
        blame: matches.target,
        text: noBuff(matches.ability)
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/05-shb/raid/e7s.ts



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
const e7s_triggerSet = {
    zoneId: zone_id/* default.EdensVerseIconoclasmSavage */.Z.EdensVerseIconoclasmSavage,
    damageWarn: {
        'E7S Silver Sword': '4C8E',
        'E7S Overwhelming Force': '4C73',
        'E7S Strength in Numbers 1': '4C70',
        'E7S Strength in Numbers 2': '4C71',
        'E7S Paper Cut': '4C7D',
        'E7S Buffet': '4C77',
    },
    damageFail: {
        'E7S Betwixt Worlds': '4C6B',
        'E7S Crusade': '4C58',
        'E7S Explosion': '4C6F',
    },
    shareWarn: {
        'E7S Stygian Stake': '4C34',
        'E7S Silver Shot': '4C92',
        'E7S Silver Scourge': '4C93',
        'E7S Chiaro Scuro Explosion 1': '4D14',
        'E7S Chiaro Scuro Explosion 2': '4D15',
    },
    triggers: [
        {
            // Interrupt
            id: 'E7S Advent Of Light',
            type: 'Ability',
            netRegex: netregexes/* default.ability */.Z.ability({ id: '4C6E' }),
            mistake: (_data, matches) => {
                // TODO: is this blame correct? does this have a target?
                return { type: 'fail', blame: matches.target, text: matches.ability };
            },
        },
        {
            id: 'E7S Astral Effect Gain',
            type: 'GainsEffect',
            netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '8BE' }),
            run: (data, matches) => {
                data.hasAstral = data.hasAstral || {};
                data.hasAstral[matches.target] = true;
            },
        },
        {
            id: 'E7S Astral Effect Lose',
            type: 'LosesEffect',
            netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '8BE' }),
            run: (data, matches) => {
                data.hasAstral = data.hasAstral || {};
                data.hasAstral[matches.target] = false;
            },
        },
        {
            id: 'E7S Umbral Effect Gain',
            type: 'GainsEffect',
            netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({ effectId: '8BF' }),
            run: (data, matches) => {
                data.hasUmbral = data.hasUmbral || {};
                data.hasUmbral[matches.target] = true;
            },
        },
        {
            id: 'E7S Umbral Effect Lose',
            type: 'LosesEffect',
            netRegex: netregexes/* default.losesEffect */.Z.losesEffect({ effectId: '8BF' }),
            run: (data, matches) => {
                data.hasUmbral = data.hasUmbral || {};
                data.hasUmbral[matches.target] = false;
            },
        },
        {
            id: 'E7S Light\'s Course',
            type: 'Ability',
            netRegex: netregexes/* default.abilityFull */.Z.abilityFull({ id: ['4C62', '4C63', '4C64', '4C5B', '4C5F'], ...oopsy_common/* playerDamageFields */.np }),
            condition: (data, matches) => {
                return !data.hasUmbral || !data.hasUmbral[matches.target];
            },
            mistake: (data, matches) => {
                if (data.hasAstral && data.hasAstral[matches.target])
                    return { type: 'fail', blame: matches.target, text: e7s_wrongBuff(matches.ability) };
                return { type: 'warn', blame: matches.target, text: e7s_noBuff(matches.ability) };
            },
        },
        {
            id: 'E7S Darks\'s Course',
            type: 'Ability',
            netRegex: netregexes/* default.abilityFull */.Z.abilityFull({ id: ['4C65', '4C66', '4C67', '4C5A', '4C60'], ...oopsy_common/* playerDamageFields */.np }),
            condition: (data, matches) => {
                return !data.hasAstral || !data.hasAstral[matches.target];
            },
            mistake: (data, matches) => {
                if (data.hasUmbral && data.hasUmbral[matches.target])
                    return { type: 'fail', blame: matches.target, text: e7s_wrongBuff(matches.ability) };
                // This case is probably impossible, as the debuff ticks after death,
                // but leaving it here in case there's some rez or disconnect timing
                // that could lead to this.
                return { type: 'warn', blame: matches.target, text: e7s_noBuff(matches.ability) };
            },
        },
        {
            id: 'E7S Crusade Knockback',
            type: 'Ability',
            // 4C76 is the knockback damage, 4C58 is the damage for standing on the puck.
            netRegex: netregexes/* default.abilityFull */.Z.abilityFull({ id: '4C76', ...oopsy_common/* playerDamageFields */.np }),
            deathReason: (_data, matches) => {
                return {
                    type: 'fail',
                    name: matches.target,
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
};
/* harmony default export */ const e7s = (e7s_triggerSet);

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
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    id: 'E8N Heavenly Strike',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4DD8',
      ...oopsy_common/* playerDamageFields */.np
    }),
    deathReason: (_data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
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
    deathReason: (_data, matches) => {
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
  shareFail: {
    'E8S Path of Light': '4DA1' // Protean

  },
  triggers: [{
    id: 'E8S Shining Armor',
    // Stun
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '95'
    }),
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.effect
      };
    }
  }, {
    // Interrupt
    id: 'E8S Stoneskin',
    netRegex: netregexes/* default.ability */.Z.ability({
      id: '4D85'
    }),
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.ability
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
  soloWarn: {
    'E9S Multi-Pronged Particle Beam': '5600' // Art Of Darkness Partner Stack

  },
  triggers: [{
    // Anti-air "tank spread".  This can be stacked by two tanks invulning.
    // Note: this will still show something for holmgang/living, but
    // arguably a healer might need to do something about that, so maybe
    // it's ok to still show as a warning??
    id: 'E9S Condensed Anti-Air Particle Beam',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      type: '22',
      id: '5615',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    // Anti-air "out".  This can be invulned by a tank along with the spread above.
    id: 'E9S Anti-Air Phaser Unlimited',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '5612',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
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
    mistake: (_data, matches) => {
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
    mistake: (_data, matches) => {
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: ['572A', '5B27'],
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
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
    deathReason: (_data, matches) => {
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
  soloFail: {
    'E11S Holy Sinsight Group Share': '5669'
  },
  triggers: [{
    id: 'E11S Blastburn Knocked Off',
    // 5653 = Burnt Strike fire followup during most of the fight
    // 567A = same thing, but from Fatebreaker's Image
    // 568F = same thing, but during Cycle of Faith
    netRegex: netregexes/* default.ability */.Z.ability({
      id: ['5653', '567A', '568F']
    }),
    deathReason: (_data, matches) => {
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
  soloWarn: {
    'E12S Promise Force Of The Land': '58A4'
  },
  triggers: [{
    // Big circle ground aoes during Shiva junction.
    // This can be shielded through as long as that person doesn't stack.
    id: 'E12S Icicle Impact',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4E5A',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    id: 'E12S Headmarker',
    netRegex: netregexes/* default.headMarker */.Z.headMarker({}),
    run: (data, matches) => {
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
    run: (data, matches) => {
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
    run: (data, matches) => {
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
    run: data => {
      data.bladeOfFlameCount = data.bladeOfFlameCount || 0;
      data.bladeOfFlameCount++;
    }
  }, {
    // This is the Chiseled Sculpture laser with the limit cut dots.
    id: 'E12S Promise Blade Of Flame',
    netRegex: netregexes/* default.ability */.Z.ability({
      type: '22',
      source: 'Chiseled Sculpture',
      id: '58B3'
    }),
    mistake: (data, matches) => {
      if (!data.laserNameToNum || !data.sculptureTetherNameToId || !data.sculptureYPositions) return; // Find the person who has this laser number and is tethered to this statue.

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
    run: (data, matches) => {
      data.pillarIdToOwner = data.pillarIdToOwner || {};
      data.pillarIdToOwner[matches.sourceId] = matches.target;
    }
  }, {
    id: 'E12S Promise Ice Pillar Mistake',
    netRegex: netregexes/* default.ability */.Z.ability({
      source: 'Ice Pillar',
      id: '589B'
    }),
    condition: (data, matches) => {
      if (!data.pillarIdToOwner) return false;
      return matches.target !== data.pillarIdToOwner[matches.sourceId];
    },
    mistake: (data, matches) => {
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
    id: 'E12S Promise Gain Fire Resistance Down II',
    // The Beastly Sculpture gives a 3 second debuff, the Regal Sculpture gives a 14s one.
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '832'
    }),
    run: (data, matches) => {
      data.fire = data.fire || {};
      data.fire[matches.target] = true;
    }
  }, {
    id: 'E12S Promise Lose Fire Resistance Down II',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '832'
    }),
    run: (data, matches) => {
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
    run: (data, matches) => {
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
    mistake: (data, matches) => {
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
    run: (data, matches) => {
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
    mistake: (data, matches) => {
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
    deathReason: (_data, matches) => {
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '58D2',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
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
    deathReason: (_data, matches) => {
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
    deathReason: (_data, matches) => {
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
    deathReason: (_data, matches) => {
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
    deathReason: (_data, matches) => {
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
    run: (data, matches) => {
      data.hasDark = data.hasDark || [];
      data.hasDark.push(matches.target);
    }
  }, {
    id: 'HadesEx Dark II',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      type: '22',
      id: '47BA',
      ...oopsy_common/* playerDamageFields */.np
    }),
    // Don't blame people who don't have tethers.
    condition: (data, matches) => data.hasDark && data.hasDark.includes(matches.target),
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.ability
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '47CB',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
      };
    }
  }, {
    id: 'HadesEx Beyond Death Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '566'
    }),
    run: (data, matches) => {
      data.hasBeyondDeath = data.hasBeyondDeath || {};
      data.hasBeyondDeath[matches.target] = true;
    }
  }, {
    id: 'HadesEx Beyond Death Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '566'
    }),
    run: (data, matches) => {
      data.hasBeyondDeath = data.hasBeyondDeath || {};
      data.hasBeyondDeath[matches.target] = false;
    }
  }, {
    id: 'HadesEx Beyond Death',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '566'
    }),
    delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (data, matches) => {
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
    run: (data, matches) => {
      data.hasDoom = data.hasDoom || {};
      data.hasDoom[matches.target] = true;
    }
  }, {
    id: 'HadesEx Doom Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '6E9'
    }),
    run: (data, matches) => {
      data.hasDoom = data.hasDoom || {};
      data.hasDoom[matches.target] = false;
    }
  }, {
    id: 'HadesEx Doom',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '6E9'
    }),
    delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (data, matches) => {
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
  shareFail: {
    'Hades Nether Blast': '4163',
    'Hades Ravenous Assault': '4158',
    'Hades Ancient Darkness': '4593',
    'Hades Dual Strike': '4162'
  }
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
    deathReason: (_data, matches) => {
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
    deathReason: (_data, matches) => {
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
  soloWarn: {
    // Party shared tank buster.
    'ShivaEx Icebrand': '5373'
  },
  triggers: [{
    id: 'ShivaEx Deep Freeze',
    // Shiva also uses ability 537A on you, but it has an unknown name.
    // So, use the effect instead for free translation.
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '1E7'
    }),
    condition: (_data, matches) => {
      // The intermission also gets this effect, but for a shorter duration.
      return parseFloat(matches.duration) > 20;
    },
    mistake: (_data, matches) => {
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4CB4',
      ...oopsy_common/* playerDamageFields */.np
    }),
    suppressSeconds: 1,
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        text: matches.ability
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
    delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (_data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
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
  soloWarn: {
    'WolEx Katon San Share': '4EFE'
  },
  triggers: [{
    id: 'WOLEx True Walking Dead',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '8FF'
    }),
    delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (_data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
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
    mistake: (_data, matches) => {
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
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        reason: matches.ability
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
  soloFail: {
    // Optical Stack
    'TEA Collective Reprobation': '488D'
  },
  triggers: [{
    // "too much luminous aetheroplasm"
    // When this happens, the target explodes, hitting nearby people
    // but also themselves.
    id: 'TEA Exhaust',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '481F',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (_data, matches) => matches.target === matches.source,
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
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
    mistake: (_data, matches) => {
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
    run: (data, matches) => {
      data.jagdTether = data.jagdTether || {};
      data.jagdTether[matches.sourceId] = matches.target;
    }
  }, {
    id: 'TEA Reducible Complexity',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4821',
      ...oopsy_common/* playerDamageFields */.np
    }),
    mistake: (data, matches) => {
      return {
        type: 'fail',
        // This may be undefined, which is fine.
        name: data.jagdTether ? data.jagdTether[matches.sourceId] : undefined,
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
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '4827',
      ...oopsy_common/* playerDamageFields */.np
    }),
    condition: (data, matches) => !data.party.isTank(matches.target),
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        name: matches.target,
        text: matches.ability
      };
    }
  }, {
    id: 'TEA Throttle Gain',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '2BC'
    }),
    run: (data, matches) => {
      data.hasThrottle = data.hasThrottle || {};
      data.hasThrottle[matches.target] = true;
    }
  }, {
    id: 'TEA Throttle Lose',
    netRegex: netregexes/* default.losesEffect */.Z.losesEffect({
      effectId: '2BC'
    }),
    run: (data, matches) => {
      data.hasThrottle = data.hasThrottle || {};
      data.hasThrottle[matches.target] = false;
    }
  }, {
    id: 'TEA Throttle',
    netRegex: netregexes/* default.gainsEffect */.Z.gainsEffect({
      effectId: '2BC'
    }),
    delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
    deathReason: (data, matches) => {
      if (!data.hasThrottle) return;
      if (!data.hasThrottle[matches.target]) return;
      return {
        name: matches.target,
        reason: matches.effect
      };
    }
  }, {
    // Balloon Popping.  It seems like the person who pops it is the
    // first person listed damage-wise, so they are likely the culprit.
    id: 'TEA Outburst',
    netRegex: netregexes/* default.abilityFull */.Z.abilityFull({
      id: '482A',
      ...oopsy_common/* playerDamageFields */.np
    }),
    suppressSeconds: 5,
    mistake: (_data, matches) => {
      return {
        type: 'fail',
        blame: matches.target,
        text: matches.source
      };
    }
  }]
});
;// CONCATENATED MODULE: ./ui/oopsyraidsy/data/oopsy_manifest.txt

































































































/* harmony default export */ const oopsy_manifest = ({'00-misc/buffs.js': buffs,'00-misc/general.js': general,'00-misc/test.js': test,'02-arr/trial/ifrit-nm.js': ifrit_nm,'02-arr/trial/titan-nm.js': titan_nm,'02-arr/trial/levi-ex.js': levi_ex,'02-arr/trial/shiva-hm.js': shiva_hm,'02-arr/trial/shiva-ex.js': shiva_ex,'02-arr/trial/titan-hm.js': titan_hm,'02-arr/trial/titan-ex.js': titan_ex,'03-hw/alliance/weeping_city.js': weeping_city,'03-hw/dungeon/aetherochemical_research_facility.js': aetherochemical_research_facility,'03-hw/dungeon/fractal_continuum.js': fractal_continuum,'03-hw/dungeon/gubal_library_hard.js': gubal_library_hard,'03-hw/dungeon/sohm_al_hard.js': sohm_al_hard,'03-hw/raid/a12n.js': a12n,'04-sb/dungeon/ala_mhigo.js': ala_mhigo,'04-sb/dungeon/bardams_mettle.js': bardams_mettle,'04-sb/dungeon/kugane_castle.js': kugane_castle,'04-sb/dungeon/st_mocianne_hard.js': st_mocianne_hard,'04-sb/dungeon/swallows_compass.js': swallows_compass,'04-sb/dungeon/temple_of_the_fist.js': temple_of_the_fist,'04-sb/dungeon/the_burn.js': the_burn,'04-sb/raid/o1n.js': o1n,'04-sb/raid/o2n.js': o2n,'04-sb/raid/o3n.js': o3n,'04-sb/raid/o4n.js': o4n,'04-sb/raid/o4s.js': o4s,'04-sb/raid/o7s.js': o7s,'04-sb/raid/o12s.js': o12s,'04-sb/trial/byakko-ex.js': byakko_ex,'04-sb/trial/shinryu.js': shinryu,'04-sb/trial/susano-ex.js': susano_ex,'04-sb/ultimate/ultima_weapon_ultimate.js': ultima_weapon_ultimate,'04-sb/ultimate/unending_coil_ultimate.js': unending_coil_ultimate,'05-shb/alliance/the_copied_factory.js': the_copied_factory,'05-shb/alliance/the_puppets_bunker.js': the_puppets_bunker,'05-shb/alliance/the_tower_at_paradigms_breach.js': the_tower_at_paradigms_breach,'05-shb/dungeon/akadaemia_anyder.js': akadaemia_anyder,'05-shb/dungeon/amaurot.js': amaurot,'05-shb/dungeon/anamnesis_anyder.js': anamnesis_anyder,'05-shb/dungeon/dohn_mheg.js': dohn_mheg,'05-shb/dungeon/heroes_gauntlet.js': heroes_gauntlet,'05-shb/dungeon/holminster_switch.js': holminster_switch,'05-shb/dungeon/malikahs_well.js': malikahs_well,'05-shb/dungeon/matoyas_relict.js': matoyas_relict,'05-shb/dungeon/mt_gulg.js': mt_gulg,'05-shb/dungeon/paglthan.js': paglthan,'05-shb/dungeon/qitana_ravel.js': qitana_ravel,'05-shb/dungeon/the_grand_cosmos.js': the_grand_cosmos,'05-shb/dungeon/twinning.js': twinning,'05-shb/eureka/delubrum_reginae.js': delubrum_reginae,'05-shb/eureka/delubrum_reginae_savage.js': delubrum_reginae_savage,'05-shb/raid/e1n.js': e1n,'05-shb/raid/e1s.js': e1s,'05-shb/raid/e2n.js': e2n,'05-shb/raid/e2s.js': e2s,'05-shb/raid/e3n.js': e3n,'05-shb/raid/e3s.js': e3s,'05-shb/raid/e4n.js': e4n,'05-shb/raid/e4s.js': e4s,'05-shb/raid/e5n.js': e5n,'05-shb/raid/e5s.js': e5s,'05-shb/raid/e6n.js': e6n,'05-shb/raid/e6s.ts': e6s,'05-shb/raid/e7n.js': e7n,'05-shb/raid/e7s.ts': e7s,'05-shb/raid/e8n.js': e8n,'05-shb/raid/e8s.js': e8s,'05-shb/raid/e9n.js': e9n,'05-shb/raid/e9s.js': e9s,'05-shb/raid/e10n.js': e10n,'05-shb/raid/e10s.js': e10s,'05-shb/raid/e11n.js': e11n,'05-shb/raid/e11s.js': e11s,'05-shb/raid/e12n.js': e12n,'05-shb/raid/e12s.js': e12s,'05-shb/trial/diamond_weapon-ex.js': diamond_weapon_ex,'05-shb/trial/diamond_weapon.js': diamond_weapon,'05-shb/trial/emerald_weapon-ex.js': emerald_weapon_ex,'05-shb/trial/emerald_weapon.js': emerald_weapon,'05-shb/trial/hades-ex.js': hades_ex,'05-shb/trial/hades.js': hades,'05-shb/trial/innocence-ex.js': innocence_ex,'05-shb/trial/innocence.js': innocence,'05-shb/trial/levi-un.js': levi_un,'05-shb/trial/ruby_weapon-ex.js': ruby_weapon_ex,'05-shb/trial/ruby_weapon.js': ruby_weapon,'05-shb/trial/shiva-un.js': shiva_un,'05-shb/trial/titania.js': titania,'05-shb/trial/titania-ex.js': titania_ex,'05-shb/trial/titan-un.js': titan_un,'05-shb/trial/varis-ex.js': varis_ex,'05-shb/trial/wol.js': wol,'05-shb/trial/wol-ex.js': wol_ex,'05-shb/ultimate/the_epic_of_alexander.js': the_epic_of_alexander,});

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wMC1taXNjL2J1ZmZzLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzAwLW1pc2MvZ2VuZXJhbC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wMC1taXNjL3Rlc3QuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDItYXJyL3RyaWFsL2lmcml0LW5tLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzAyLWFyci90cmlhbC90aXRhbi1ubS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wMi1hcnIvdHJpYWwvbGV2aS1leC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wMi1hcnIvdHJpYWwvc2hpdmEtaG0uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDItYXJyL3RyaWFsL3NoaXZhLWV4LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzAyLWFyci90cmlhbC90aXRhbi1obS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wMi1hcnIvdHJpYWwvdGl0YW4tZXguanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDMtaHcvYWxsaWFuY2Uvd2VlcGluZ19jaXR5LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzAzLWh3L2R1bmdlb24vYWV0aGVyb2NoZW1pY2FsX3Jlc2VhcmNoX2ZhY2lsaXR5LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzAzLWh3L2R1bmdlb24vZnJhY3RhbF9jb250aW51dW0uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDMtaHcvZHVuZ2Vvbi9ndWJhbF9saWJyYXJ5X2hhcmQuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDMtaHcvZHVuZ2Vvbi9zb2htX2FsX2hhcmQuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDMtaHcvcmFpZC9hMTJuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA0LXNiL2R1bmdlb24vYWxhX21oaWdvLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA0LXNiL2R1bmdlb24vYmFyZGFtc19tZXR0bGUuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvZHVuZ2Vvbi9rdWdhbmVfY2FzdGxlLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA0LXNiL2R1bmdlb24vc3RfbW9jaWFubmVfaGFyZC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9kdW5nZW9uL3N3YWxsb3dzX2NvbXBhc3MuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvZHVuZ2Vvbi90ZW1wbGVfb2ZfdGhlX2Zpc3QuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvZHVuZ2Vvbi90aGVfYnVybi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL28xbi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL28ybi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL28zbi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL280bi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL280cy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL283cy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNC1zYi9yYWlkL28xMnMuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvdHJpYWwvYnlha2tvLWV4LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA0LXNiL3RyaWFsL3NoaW5yeXUuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvdHJpYWwvc3VzYW5vLWV4LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA0LXNiL3VsdGltYXRlL3VsdGltYV93ZWFwb25fdWx0aW1hdGUuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDQtc2IvdWx0aW1hdGUvdW5lbmRpbmdfY29pbF91bHRpbWF0ZS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvYWxsaWFuY2UvdGhlX2NvcGllZF9mYWN0b3J5LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9hbGxpYW5jZS90aGVfcHVwcGV0c19idW5rZXIuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL2FsbGlhbmNlL3RoZV90b3dlcl9hdF9wYXJhZGlnbXNfYnJlYWNoLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9kdW5nZW9uL2FrYWRhZW1pYV9hbnlkZXIuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL2R1bmdlb24vYW1hdXJvdC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZHVuZ2Vvbi9hbmFtbmVzaXNfYW55ZGVyLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9kdW5nZW9uL2RvaG5fbWhlZy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZHVuZ2Vvbi9oZXJvZXNfZ2F1bnRsZXQuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL2R1bmdlb24vaG9sbWluc3Rlcl9zd2l0Y2guanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL2R1bmdlb24vbWFsaWthaHNfd2VsbC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZHVuZ2Vvbi9tYXRveWFzX3JlbGljdC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZHVuZ2Vvbi9tdF9ndWxnLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9kdW5nZW9uL3BhZ2x0aGFuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9kdW5nZW9uL3FpdGFuYV9yYXZlbC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZHVuZ2Vvbi90aGVfZ3JhbmRfY29zbW9zLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9kdW5nZW9uL3R3aW5uaW5nLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9ldXJla2EvZGVsdWJydW1fcmVnaW5hZS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvZXVyZWthL2RlbHVicnVtX3JlZ2luYWVfc2F2YWdlLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2Uxbi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lMXMuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTJuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2Uycy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lM24uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTNzLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2U0bi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lNHMuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTVuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2U1cy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lNm4uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTZzLnRzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2U3bi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lN3MudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZThuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2U4cy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lOW4uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTlzLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2UxMG4uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTEwcy5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lMTFuLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi9yYWlkL2UxMXMuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3JhaWQvZTEybi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvcmFpZC9lMTJzLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi90cmlhbC9kaWFtb25kX3dlYXBvbi1leC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvZGlhbW9uZF93ZWFwb24uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL2VtZXJhbGRfd2VhcG9uLWV4LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi90cmlhbC9lbWVyYWxkX3dlYXBvbi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvaGFkZXMtZXguanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL2hhZGVzLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi90cmlhbC9pbm5vY2VuY2UtZXguanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL2lubm9jZW5jZS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvbGV2aS11bi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvcnVieV93ZWFwb24tZXguanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL3J1Ynlfd2VhcG9uLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi90cmlhbC9zaGl2YS11bi5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvdGl0YW5pYS5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvdGl0YW5pYS1leC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdHJpYWwvdGl0YW4tdW4uanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL3ZhcmlzLWV4LmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhLzA1LXNoYi90cmlhbC93b2wuanMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL29vcHN5cmFpZHN5L2RhdGEvMDUtc2hiL3RyaWFsL3dvbC1leC5qcyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvb29wc3lyYWlkc3kvZGF0YS8wNS1zaGIvdWx0aW1hdGUvdGhlX2VwaWNfb2ZfYWxleGFuZGVyLmpzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9vb3BzeXJhaWRzeS9kYXRhL29vcHN5X21hbmlmZXN0LnR4dCJdLCJuYW1lcyI6WyJhYmlsaXR5Q29sbGVjdFNlY29uZHMiLCJlZmZlY3RDb2xsZWN0U2Vjb25kcyIsImlzSW5QYXJ0eUNvbmRpdGlvbkZ1bmMiLCJkYXRhIiwibWF0Y2hlcyIsInNvdXJjZUlkIiwidG9VcHBlckNhc2UiLCJwYXJ0eSIsInBhcnR5SWRzIiwiaW5jbHVkZXMiLCJwZXRJZFRvT3duZXJJZCIsIm93bmVySWQiLCJtaXNzZWRGdW5jIiwiYXJncyIsImlkIiwidHJpZ2dlcklkIiwibmV0UmVnZXgiLCJjb25kaXRpb24iLCJydW4iLCJnZW5lcmFsQnVmZkNvbGxlY3Rpb24iLCJwdXNoIiwiZGVsYXlTZWNvbmRzIiwiY29sbGVjdFNlY29uZHMiLCJzdXBwcmVzc1NlY29uZHMiLCJtaXN0YWtlIiwiX21hdGNoZXMiLCJhbGxNYXRjaGVzIiwicGFydHlOYW1lcyIsImdvdEJ1ZmZNYXAiLCJuYW1lIiwiZmlyc3RNYXRjaCIsInNvdXJjZU5hbWUiLCJzb3VyY2UiLCJwZXRJZCIsIm93bmVyTmFtZSIsIm5hbWVGcm9tSWQiLCJjb25zb2xlIiwiZXJyb3IiLCJpZ25vcmVTZWxmIiwidGhpbmdOYW1lIiwiZmllbGQiLCJ0YXJnZXQiLCJtaXNzZWQiLCJPYmplY3QiLCJrZXlzIiwiZmlsdGVyIiwieCIsImxlbmd0aCIsInR5cGUiLCJibGFtZSIsInRleHQiLCJlbiIsIm1hcCIsIlNob3J0TmFtZSIsImpvaW4iLCJkZSIsImZyIiwiamEiLCJjbiIsImtvIiwibWlzc2VkTWl0aWdhdGlvbkJ1ZmYiLCJlZmZlY3RJZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJOZXRSZWdleGVzIiwibWlzc2VkRGFtYWdlQWJpbGl0eSIsImFiaWxpdHlJZCIsIm1pc3NlZEhlYWwiLCJtaXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSIsInpvbmVJZCIsIlpvbmVJZCIsInRyaWdnZXJzIiwiX2RhdGEiLCJsb3N0Rm9vZCIsImluQ29tYmF0IiwiSXNQbGF5ZXJJZCIsImxpbmUiLCJuZXRSZWdleEZyIiwibmV0UmVnZXhKYSIsIm5ldFJlZ2V4Q24iLCJuZXRSZWdleEtvIiwibWUiLCJzdHJpa2luZ0R1bW15QnlMb2NhbGUiLCJzdHJpa2luZ0R1bW15TmFtZXMiLCJ2YWx1ZXMiLCJib290Q291bnQiLCJhYmlsaXR5IiwiRGFtYWdlRnJvbU1hdGNoZXMiLCJlZmZlY3QiLCJwb2tlQ291bnQiLCJkYW1hZ2VXYXJuIiwic2hhcmVXYXJuIiwiZGFtYWdlRmFpbCIsImdhaW5zRWZmZWN0V2FybiIsImdhaW5zRWZmZWN0RmFpbCIsImRlYXRoUmVhc29uIiwicmVhc29uIiwic2hhcmVGYWlsIiwic2VlbkRpYW1vbmREdXN0Iiwic29sb1dhcm4iLCJwYXJzZUZsb2F0IiwiZHVyYXRpb24iLCJ6b21iaWUiLCJzaGllbGQiLCJoYXNJbXAiLCJwbGF5ZXJEYW1hZ2VGaWVsZHMiLCJhc3NhdWx0IiwiYWJpbGl0eVdhcm4iLCJmbGFncyIsInN1YnN0ciIsInNvbG9GYWlsIiwiY2FwdHVyZSIsIm5ldFJlZ2V4RGUiLCJwaGFzZU51bWJlciIsImluaXRpYWxpemVkIiwiZ2FtZUNvdW50IiwidGFyZ2V0SWQiLCJpc0RlY2lzaXZlQmF0dGxlRWxlbWVudCIsImlzTmVvRXhkZWF0aCIsImFiaWxpdHlOYW1lIiwiaGFzQmV5b25kRGVhdGgiLCJkb3VibGVBdHRhY2tNYXRjaGVzIiwiYXJyIiwidnVsbiIsImtGbGFnSW5zdGFudERlYXRoIiwiaGFzRG9vbSIsInNsaWNlIiwiZmF1bHRMaW5lVGFyZ2V0IiwiaGFzT3JiIiwiY2xvdWRNYXJrZXJzIiwibSIsIm5vT3JiIiwic3RyIiwiaGF0ZWQiLCJ3cm9uZ0J1ZmYiLCJub0J1ZmYiLCJoYXNBc3RyYWwiLCJoYXNVbWJyYWwiLCJmaXJzdEhlYWRtYXJrZXIiLCJwYXJzZUludCIsImdldEhlYWRtYXJrZXJJZCIsImRlY09mZnNldCIsInRvU3RyaW5nIiwicGFkU3RhcnQiLCJmaXJzdExhc2VyTWFya2VyIiwibGFzdExhc2VyTWFya2VyIiwibGFzZXJOYW1lVG9OdW0iLCJzY3VscHR1cmVZUG9zaXRpb25zIiwieSIsInNjdWxwdHVyZVRldGhlck5hbWVUb0lkIiwiYmxhZGVPZkZsYW1lQ291bnQiLCJudW1iZXIiLCJuYW1lcyIsIndpdGhOdW0iLCJvd25lcnMiLCJtaW5pbXVtWWFsbXNGb3JTdGF0dWVzIiwiaXNTdGF0dWVQb3NpdGlvbktub3duIiwiaXNTdGF0dWVOb3J0aCIsInNjdWxwdHVyZUlkcyIsIm90aGVySWQiLCJzb3VyY2VZIiwib3RoZXJZIiwieURpZmYiLCJNYXRoIiwiYWJzIiwib3duZXIiLCJvd25lck5pY2siLCJwaWxsYXJJZFRvT3duZXIiLCJwaWxsYXJPd25lciIsImZpcmUiLCJzbWFsbExpb25JZFRvT3duZXIiLCJzbWFsbExpb25Pd25lcnMiLCJoYXNTbWFsbExpb24iLCJoYXNGaXJlRGVidWZmIiwiY2VudGVyWSIsImRpck9iaiIsIk91dHB1dHMiLCJub3J0aEJpZ0xpb24iLCJzaW5nbGVUYXJnZXQiLCJvdXRwdXQiLCJzb3V0aEJpZ0xpb24iLCJzaGFyZWQiLCJmaXJlRGVidWZmIiwibGFiZWxzIiwicGFyc2VyTGFuZyIsImhhc0RhcmsiLCJqYWdkVGV0aGVyIiwidW5kZWZpbmVkIiwiaXNUYW5rIiwiaGFzVGhyb3R0bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Q0FHQTs7QUFDQSxNQUFNQSxxQkFBcUIsR0FBRyxHQUE5QixDLENBQ0E7O0FBQ0EsTUFBTUMsb0JBQW9CLEdBQUcsR0FBN0I7O0FBRUEsTUFBTUMsc0JBQXNCLEdBQUcsQ0FBQ0MsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ2hELFFBQU1DLFFBQVEsR0FBR0QsT0FBTyxDQUFDQyxRQUFSLENBQWlCQyxXQUFqQixFQUFqQjtBQUNBLE1BQUlILElBQUksQ0FBQ0ksS0FBTCxDQUFXQyxRQUFYLENBQW9CQyxRQUFwQixDQUE2QkosUUFBN0IsQ0FBSixFQUNFLE9BQU8sSUFBUDs7QUFFRixNQUFJRixJQUFJLENBQUNPLGNBQVQsRUFBeUI7QUFDdkIsVUFBTUMsT0FBTyxHQUFHUixJQUFJLENBQUNPLGNBQUwsQ0FBb0JMLFFBQXBCLENBQWhCO0FBQ0EsUUFBSU0sT0FBTyxJQUFJUixJQUFJLENBQUNJLEtBQUwsQ0FBV0MsUUFBWCxDQUFvQkMsUUFBcEIsQ0FBNkJFLE9BQTdCLENBQWYsRUFDRSxPQUFPLElBQVA7QUFDSDs7QUFFRCxTQUFPLEtBQVA7QUFDRCxDQVpELEMsQ0FjQTs7O0FBQ0EsTUFBTUMsVUFBVSxHQUFJQyxJQUFELElBQVUsQ0FDM0I7QUFDRTtBQUNBQyxJQUFFLEVBQUcsUUFBT0QsSUFBSSxDQUFDRSxTQUFVLFVBRjdCO0FBR0VDLFVBQVEsRUFBRUgsSUFBSSxDQUFDRyxRQUhqQjtBQUlFQyxXQUFTLEVBQUVmLHNCQUpiO0FBS0VnQixLQUFHLEVBQUUsQ0FBQ2YsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3RCRCxRQUFJLENBQUNnQixxQkFBTCxHQUE2QmhCLElBQUksQ0FBQ2dCLHFCQUFMLElBQThCLEVBQTNEO0FBQ0FoQixRQUFJLENBQUNnQixxQkFBTCxDQUEyQk4sSUFBSSxDQUFDRSxTQUFoQyxJQUE2Q1osSUFBSSxDQUFDZ0IscUJBQUwsQ0FBMkJOLElBQUksQ0FBQ0UsU0FBaEMsS0FBOEMsRUFBM0Y7QUFDQVosUUFBSSxDQUFDZ0IscUJBQUwsQ0FBMkJOLElBQUksQ0FBQ0UsU0FBaEMsRUFBMkNLLElBQTNDLENBQWdEaEIsT0FBaEQ7QUFDRDtBQVRILENBRDJCLEVBWTNCO0FBQ0VVLElBQUUsRUFBRyxRQUFPRCxJQUFJLENBQUNFLFNBQVUsRUFEN0I7QUFFRUMsVUFBUSxFQUFFSCxJQUFJLENBQUNHLFFBRmpCO0FBR0VDLFdBQVMsRUFBRWYsc0JBSGI7QUFJRW1CLGNBQVksRUFBRVIsSUFBSSxDQUFDUyxjQUpyQjtBQUtFQyxpQkFBZSxFQUFFVixJQUFJLENBQUNTLGNBTHhCO0FBTUVFLFNBQU8sRUFBRSxDQUFDckIsSUFBRCxFQUFPc0IsUUFBUCxLQUFvQjtBQUMzQixRQUFJLENBQUN0QixJQUFJLENBQUNnQixxQkFBVixFQUNFO0FBQ0YsVUFBTU8sVUFBVSxHQUFHdkIsSUFBSSxDQUFDZ0IscUJBQUwsQ0FBMkJOLElBQUksQ0FBQ0UsU0FBaEMsQ0FBbkI7QUFDQSxRQUFJLENBQUNXLFVBQUwsRUFDRTtBQUVGLFVBQU1DLFVBQVUsR0FBR3hCLElBQUksQ0FBQ0ksS0FBTCxDQUFXb0IsVUFBOUIsQ0FQMkIsQ0FTM0I7O0FBQ0EsVUFBTUMsVUFBVSxHQUFHLEVBQW5COztBQUNBLFNBQUssTUFBTUMsSUFBWCxJQUFtQkYsVUFBbkIsRUFDRUMsVUFBVSxDQUFDQyxJQUFELENBQVYsR0FBbUIsS0FBbkI7O0FBRUYsVUFBTUMsVUFBVSxHQUFHSixVQUFVLENBQUMsQ0FBRCxDQUE3QjtBQUNBLFFBQUlLLFVBQVUsR0FBR0QsVUFBVSxDQUFDRSxNQUE1QixDQWYyQixDQWdCM0I7O0FBQ0EsUUFBSTdCLElBQUksQ0FBQ08sY0FBVCxFQUF5QjtBQUN2QixZQUFNdUIsS0FBSyxHQUFHSCxVQUFVLENBQUN6QixRQUFYLENBQW9CQyxXQUFwQixFQUFkO0FBQ0EsWUFBTUssT0FBTyxHQUFHUixJQUFJLENBQUNPLGNBQUwsQ0FBb0J1QixLQUFwQixDQUFoQjs7QUFDQSxVQUFJdEIsT0FBSixFQUFhO0FBQ1gsY0FBTXVCLFNBQVMsR0FBRy9CLElBQUksQ0FBQ0ksS0FBTCxDQUFXNEIsVUFBWCxDQUFzQnhCLE9BQXRCLENBQWxCO0FBQ0EsWUFBSXVCLFNBQUosRUFDRUgsVUFBVSxHQUFHRyxTQUFiLENBREYsS0FHRUUsT0FBTyxDQUFDQyxLQUFSLENBQWUsMEJBQXlCMUIsT0FBUSxhQUFZc0IsS0FBTSxFQUFsRTtBQUNIO0FBQ0Y7O0FBRUQsUUFBSXBCLElBQUksQ0FBQ3lCLFVBQVQsRUFDRVYsVUFBVSxDQUFDRyxVQUFELENBQVYsR0FBeUIsSUFBekI7QUFFRixVQUFNUSxTQUFTLEdBQUdULFVBQVUsQ0FBQ2pCLElBQUksQ0FBQzJCLEtBQU4sQ0FBNUI7O0FBQ0EsU0FBSyxNQUFNcEMsT0FBWCxJQUFzQnNCLFVBQXRCLEVBQWtDO0FBQ2hDO0FBQ0E7QUFDQSxVQUFJdEIsT0FBTyxDQUFDNEIsTUFBUixLQUFtQkYsVUFBVSxDQUFDRSxNQUFsQyxFQUNFO0FBRUZKLGdCQUFVLENBQUN4QixPQUFPLENBQUNxQyxNQUFULENBQVYsR0FBNkIsSUFBN0I7QUFDRDs7QUFFRCxVQUFNQyxNQUFNLEdBQUdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZaEIsVUFBWixFQUF3QmlCLE1BQXhCLENBQWdDQyxDQUFELElBQU8sQ0FBQ2xCLFVBQVUsQ0FBQ2tCLENBQUQsQ0FBakQsQ0FBZjtBQUNBLFFBQUlKLE1BQU0sQ0FBQ0ssTUFBUCxLQUFrQixDQUF0QixFQUNFLE9BNUN5QixDQThDM0I7QUFDQTtBQUNBOztBQUNBLFFBQUlMLE1BQU0sQ0FBQ0ssTUFBUCxHQUFnQixDQUFwQixFQUF1QjtBQUNyQixhQUFPO0FBQ0xDLFlBQUksRUFBRW5DLElBQUksQ0FBQ21DLElBRE47QUFFTEMsYUFBSyxFQUFFbEIsVUFGRjtBQUdMbUIsWUFBSSxFQUFFO0FBQ0pDLFlBQUUsRUFBRVosU0FBUyxHQUFHLFVBQVosR0FBeUJHLE1BQU0sQ0FBQ1UsR0FBUCxDQUFZTixDQUFELElBQU8zQyxJQUFJLENBQUNrRCxTQUFMLENBQWVQLENBQWYsQ0FBbEIsRUFBcUNRLElBQXJDLENBQTBDLElBQTFDLENBRHpCO0FBRUpDLFlBQUUsRUFBRWhCLFNBQVMsR0FBRyxZQUFaLEdBQTJCRyxNQUFNLENBQUNVLEdBQVAsQ0FBWU4sQ0FBRCxJQUFPM0MsSUFBSSxDQUFDa0QsU0FBTCxDQUFlUCxDQUFmLENBQWxCLEVBQXFDUSxJQUFyQyxDQUEwQyxJQUExQyxDQUYzQjtBQUdKRSxZQUFFLEVBQUVqQixTQUFTLEdBQUcsaUJBQVosR0FBZ0NHLE1BQU0sQ0FBQ1UsR0FBUCxDQUFZTixDQUFELElBQU8zQyxJQUFJLENBQUNrRCxTQUFMLENBQWVQLENBQWYsQ0FBbEIsRUFBcUNRLElBQXJDLENBQTBDLElBQTFDLENBSGhDO0FBSUpHLFlBQUUsRUFBRSxNQUFNZixNQUFNLENBQUNVLEdBQVAsQ0FBWU4sQ0FBRCxJQUFPM0MsSUFBSSxDQUFDa0QsU0FBTCxDQUFlUCxDQUFmLENBQWxCLEVBQXFDUSxJQUFyQyxDQUEwQyxJQUExQyxDQUFOLEdBQXdELEtBQXhELEdBQWdFZixTQUFoRSxHQUE0RSxTQUo1RTtBQUtKbUIsWUFBRSxFQUFFaEIsTUFBTSxDQUFDVSxHQUFQLENBQVlOLENBQUQsSUFBTzNDLElBQUksQ0FBQ2tELFNBQUwsQ0FBZVAsQ0FBZixDQUFsQixFQUFxQ1EsSUFBckMsQ0FBMEMsSUFBMUMsSUFBa0QsT0FBbEQsR0FBNERmLFNBTDVEO0FBTUpvQixZQUFFLEVBQUVwQixTQUFTLEdBQUcsR0FBWixHQUFrQkcsTUFBTSxDQUFDVSxHQUFQLENBQVlOLENBQUQsSUFBTzNDLElBQUksQ0FBQ2tELFNBQUwsQ0FBZVAsQ0FBZixDQUFsQixFQUFxQ1EsSUFBckMsQ0FBMEMsSUFBMUMsQ0FBbEIsR0FBb0U7QUFOcEU7QUFIRCxPQUFQO0FBWUQsS0E5RDBCLENBK0QzQjtBQUNBOzs7QUFDQSxXQUFPO0FBQ0xOLFVBQUksRUFBRW5DLElBQUksQ0FBQ21DLElBRE47QUFFTEMsV0FBSyxFQUFFbEIsVUFGRjtBQUdMbUIsVUFBSSxFQUFFO0FBQ0pDLFVBQUUsRUFBRVosU0FBUyxHQUFHLFVBQVosR0FBeUJHLE1BQU0sQ0FBQ0ssTUFBaEMsR0FBeUMsU0FEekM7QUFFSlEsVUFBRSxFQUFFaEIsU0FBUyxHQUFHLGFBQVosR0FBNEJHLE1BQU0sQ0FBQ0ssTUFBbkMsR0FBNEMsV0FGNUM7QUFHSlMsVUFBRSxFQUFFakIsU0FBUyxHQUFHLGlCQUFaLEdBQWdDRyxNQUFNLENBQUNLLE1BQXZDLEdBQWdELFlBSGhEO0FBSUpVLFVBQUUsRUFBRWYsTUFBTSxDQUFDSyxNQUFQLEdBQWdCLElBQWhCLEdBQXVCUixTQUF2QixHQUFtQyxTQUpuQztBQUtKbUIsVUFBRSxFQUFFLE1BQU1oQixNQUFNLENBQUNLLE1BQWIsR0FBc0IsT0FBdEIsR0FBZ0NSLFNBTGhDO0FBTUpvQixVQUFFLEVBQUVwQixTQUFTLEdBQUcsR0FBWixHQUFrQkcsTUFBTSxDQUFDSyxNQUF6QixHQUFrQztBQU5sQztBQUhELEtBQVA7QUFZRCxHQW5GSDtBQW9GRTdCLEtBQUcsRUFBR2YsSUFBRCxJQUFVO0FBQ2IsUUFBSUEsSUFBSSxDQUFDZ0IscUJBQVQsRUFDRSxPQUFPaEIsSUFBSSxDQUFDZ0IscUJBQUwsQ0FBMkJOLElBQUksQ0FBQ0UsU0FBaEMsQ0FBUDtBQUNIO0FBdkZILENBWjJCLENBQTdCOztBQXVHQSxNQUFNNkMsb0JBQW9CLEdBQUkvQyxJQUFELElBQVU7QUFDckMsTUFBSSxDQUFDQSxJQUFJLENBQUNnRCxRQUFWLEVBQ0V6QixPQUFPLENBQUNDLEtBQVIsQ0FBYyx1QkFBdUJ5QixJQUFJLENBQUNDLFNBQUwsQ0FBZWxELElBQWYsQ0FBckM7QUFDRixTQUFPRCxVQUFVLENBQUM7QUFDaEJHLGFBQVMsRUFBRUYsSUFBSSxDQUFDQyxFQURBO0FBRWhCRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUVoRCxJQUFJLENBQUNnRDtBQUFqQixLQUF2QixDQUZNO0FBR2hCckIsU0FBSyxFQUFFLFFBSFM7QUFJaEJRLFFBQUksRUFBRSxNQUpVO0FBS2hCVixjQUFVLEVBQUV6QixJQUFJLENBQUN5QixVQUxEO0FBTWhCaEIsa0JBQWMsRUFBRVQsSUFBSSxDQUFDUyxjQUFMLEdBQXNCVCxJQUFJLENBQUNTLGNBQTNCLEdBQTRDckI7QUFONUMsR0FBRCxDQUFqQjtBQVFELENBWEQ7O0FBYUEsTUFBTWdFLG1CQUFtQixHQUFJcEQsSUFBRCxJQUFVO0FBQ3BDLE1BQUksQ0FBQ0EsSUFBSSxDQUFDcUQsU0FBVixFQUNFOUIsT0FBTyxDQUFDQyxLQUFSLENBQWMsd0JBQXdCeUIsSUFBSSxDQUFDQyxTQUFMLENBQWVsRCxJQUFmLENBQXRDO0FBQ0YsU0FBT0QsVUFBVSxDQUFDO0FBQ2hCRyxhQUFTLEVBQUVGLElBQUksQ0FBQ0MsRUFEQTtBQUVoQkUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWxELFFBQUUsRUFBRUQsSUFBSSxDQUFDcUQ7QUFBWCxLQUFuQixDQUZNO0FBR2hCMUIsU0FBSyxFQUFFLFNBSFM7QUFJaEJRLFFBQUksRUFBRSxRQUpVO0FBS2hCVixjQUFVLEVBQUV6QixJQUFJLENBQUN5QixVQUxEO0FBTWhCaEIsa0JBQWMsRUFBRVQsSUFBSSxDQUFDUyxjQUFMLEdBQXNCVCxJQUFJLENBQUNTLGNBQTNCLEdBQTRDdEI7QUFONUMsR0FBRCxDQUFqQjtBQVFELENBWEQ7O0FBYUEsTUFBTW1FLFVBQVUsR0FBSXRELElBQUQsSUFBVTtBQUMzQixNQUFJLENBQUNBLElBQUksQ0FBQ3FELFNBQVYsRUFDRTlCLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLHdCQUF3QnlCLElBQUksQ0FBQ0MsU0FBTCxDQUFlbEQsSUFBZixDQUF0QztBQUNGLFNBQU9ELFVBQVUsQ0FBQztBQUNoQkcsYUFBUyxFQUFFRixJQUFJLENBQUNDLEVBREE7QUFFaEJFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUVELElBQUksQ0FBQ3FEO0FBQVgsS0FBbkIsQ0FGTTtBQUdoQjFCLFNBQUssRUFBRSxTQUhTO0FBSWhCUSxRQUFJLEVBQUUsTUFKVTtBQUtoQjFCLGtCQUFjLEVBQUVULElBQUksQ0FBQ1MsY0FBTCxHQUFzQlQsSUFBSSxDQUFDUyxjQUEzQixHQUE0Q3RCO0FBTDVDLEdBQUQsQ0FBakI7QUFPRCxDQVZEOztBQVlBLE1BQU1vRSx1QkFBdUIsR0FBR0QsVUFBaEM7QUFFQSw0Q0FBZTtBQUNiRSxRQUFNLEVBQUVDLHdDQURLO0FBRWJDLFVBQVEsRUFBRSxDQUNSO0FBQ0V6RCxNQUFFLEVBQUUsMEJBRE47QUFFRUUsWUFBUSxFQUFFZ0QsK0RBQUEsRUFGWjtBQUdFOUMsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QixVQUFJQSxPQUFPLENBQUNPLE9BQVIsS0FBb0IsR0FBeEIsRUFDRTtBQUVGUixVQUFJLENBQUNPLGNBQUwsR0FBc0JQLElBQUksQ0FBQ08sY0FBTCxJQUF1QixFQUE3QyxDQUpzQixDQUt0Qjs7QUFDQVAsVUFBSSxDQUFDTyxjQUFMLENBQW9CTixPQUFPLENBQUNVLEVBQVIsQ0FBV1IsV0FBWCxFQUFwQixJQUFnREYsT0FBTyxDQUFDTyxPQUFSLENBQWdCTCxXQUFoQixFQUFoRDtBQUNEO0FBVkgsR0FEUSxFQWFSO0FBQ0VRLE1BQUUsRUFBRSwyQkFETjtBQUVFRSxZQUFRLEVBQUVnRCwrQ0FBQSxFQUZaO0FBR0U5QyxPQUFHLEVBQUdmLElBQUQsSUFBVTtBQUNiO0FBQ0FBLFVBQUksQ0FBQ08sY0FBTCxHQUFzQixFQUF0QjtBQUNEO0FBTkgsR0FiUSxFQXNCUjtBQUNBO0FBRUE7QUFDQTtBQUNBLEtBQUdrRCxvQkFBb0IsQ0FBQztBQUFFOUMsTUFBRSxFQUFFLHdCQUFOO0FBQWdDK0MsWUFBUSxFQUFFLEtBQTFDO0FBQWlEdkMsa0JBQWMsRUFBRTtBQUFqRSxHQUFELENBM0JmLEVBNEJSO0FBQ0EsS0FBR3NDLG9CQUFvQixDQUFDO0FBQUU5QyxNQUFFLEVBQUUsaUJBQU47QUFBeUIrQyxZQUFRLEVBQUUsUUFBbkM7QUFBNkN2QixjQUFVLEVBQUUsSUFBekQ7QUFBK0RoQixrQkFBYyxFQUFFO0FBQS9FLEdBQUQsQ0E3QmYsRUErQlIsR0FBR3NDLG9CQUFvQixDQUFDO0FBQUU5QyxNQUFFLEVBQUUsYUFBTjtBQUFxQitDLFlBQVEsRUFBRSxLQUEvQjtBQUFzQ3ZCLGNBQVUsRUFBRTtBQUFsRCxHQUFELENBL0JmLEVBaUNSLEdBQUc4Qix1QkFBdUIsQ0FBQztBQUFFdEQsTUFBRSxFQUFFLGdCQUFOO0FBQXdCb0QsYUFBUyxFQUFFO0FBQW5DLEdBQUQsQ0FqQ2xCLEVBa0NSLEdBQUdFLHVCQUF1QixDQUFDO0FBQUV0RCxNQUFFLEVBQUUsaUJBQU47QUFBeUJvRCxhQUFTLEVBQUU7QUFBcEMsR0FBRCxDQWxDbEIsRUFtQ1IsR0FBR0UsdUJBQXVCLENBQUM7QUFBRXRELE1BQUUsRUFBRSxjQUFOO0FBQXNCb0QsYUFBUyxFQUFFO0FBQWpDLEdBQUQsQ0FuQ2xCLEVBcUNSO0FBQ0EsS0FBR0QsbUJBQW1CLENBQUM7QUFBRW5ELE1BQUUsRUFBRSxrQkFBTjtBQUEwQm9ELGFBQVMsRUFBRTtBQUFyQyxHQUFELENBdENkLEVBdUNSLEdBQUdELG1CQUFtQixDQUFDO0FBQUVuRCxNQUFFLEVBQUUsWUFBTjtBQUFvQm9ELGFBQVMsRUFBRTtBQUEvQixHQUFELENBdkNkLEVBd0NSLEdBQUdELG1CQUFtQixDQUFDO0FBQUVuRCxNQUFFLEVBQUUsYUFBTjtBQUFxQm9ELGFBQVMsRUFBRTtBQUFoQyxHQUFELENBeENkLEVBeUNSLEdBQUdELG1CQUFtQixDQUFDO0FBQUVuRCxNQUFFLEVBQUUsZUFBTjtBQUF1Qm9ELGFBQVMsRUFBRTtBQUFsQyxHQUFELENBekNkLEVBMENSLEdBQUdELG1CQUFtQixDQUFDO0FBQUVuRCxNQUFFLEVBQUUsVUFBTjtBQUFrQm9ELGFBQVMsRUFBRTtBQUE3QixHQUFELENBMUNkLEVBMkNSLEdBQUdELG1CQUFtQixDQUFDO0FBQUVuRCxNQUFFLEVBQUUsY0FBTjtBQUFzQm9ELGFBQVMsRUFBRSxJQUFqQztBQUF1QzVCLGNBQVUsRUFBRTtBQUFuRCxHQUFELENBM0NkLEVBNkNSO0FBQ0E7QUFDQTtBQUNBO0FBRUEsS0FBRzhCLHVCQUF1QixDQUFDO0FBQUV0RCxNQUFFLEVBQUUsWUFBTjtBQUFvQm9ELGFBQVMsRUFBRTtBQUEvQixHQUFELENBbERsQixFQW1EUixHQUFHRSx1QkFBdUIsQ0FBQztBQUFFdEQsTUFBRSxFQUFFLFdBQU47QUFBbUJvRCxhQUFTLEVBQUU7QUFBOUIsR0FBRCxDQW5EbEIsRUFvRFIsR0FBR0UsdUJBQXVCLENBQUM7QUFBRXRELE1BQUUsRUFBRSxjQUFOO0FBQXNCb0QsYUFBUyxFQUFFO0FBQWpDLEdBQUQsQ0FwRGxCLEVBc0RSLEdBQUdFLHVCQUF1QixDQUFDO0FBQUV0RCxNQUFFLEVBQUUsUUFBTjtBQUFnQm9ELGFBQVMsRUFBRTtBQUEzQixHQUFELENBdERsQixFQXdEUixHQUFHRCxtQkFBbUIsQ0FBQztBQUFFbkQsTUFBRSxFQUFFLFVBQU47QUFBa0JvRCxhQUFTLEVBQUU7QUFBN0IsR0FBRCxDQXhEZCxFQTBEUjtBQUNBO0FBQ0E7QUFFQSxLQUFHQyxVQUFVLENBQUM7QUFBRXJELE1BQUUsRUFBRSxRQUFOO0FBQWdCb0QsYUFBUyxFQUFFO0FBQTNCLEdBQUQsQ0E5REwsRUErRFIsR0FBR0MsVUFBVSxDQUFDO0FBQUVyRCxNQUFFLEVBQUUsV0FBTjtBQUFtQm9ELGFBQVMsRUFBRTtBQUE5QixHQUFELENBL0RMLEVBZ0VSLEdBQUdDLFVBQVUsQ0FBQztBQUFFckQsTUFBRSxFQUFFLGtCQUFOO0FBQTBCb0QsYUFBUyxFQUFFO0FBQXJDLEdBQUQsQ0FoRUwsRUFpRVIsR0FBR0MsVUFBVSxDQUFDO0FBQUVyRCxNQUFFLEVBQUUsWUFBTjtBQUFvQm9ELGFBQVMsRUFBRTtBQUEvQixHQUFELENBakVMLEVBa0VSLEdBQUdDLFVBQVUsQ0FBQztBQUFFckQsTUFBRSxFQUFFLG9CQUFOO0FBQTRCb0QsYUFBUyxFQUFFO0FBQXZDLEdBQUQsQ0FsRUwsRUFtRVIsR0FBR0MsVUFBVSxDQUFDO0FBQUVyRCxNQUFFLEVBQUUsZUFBTjtBQUF1Qm9ELGFBQVMsRUFBRTtBQUFsQyxHQUFELENBbkVMLEVBcUVSLEdBQUdDLFVBQVUsQ0FBQztBQUFFckQsTUFBRSxFQUFFLFFBQU47QUFBZ0JvRCxhQUFTLEVBQUU7QUFBM0IsR0FBRCxDQXJFTCxFQXNFUixHQUFHQyxVQUFVLENBQUM7QUFBRXJELE1BQUUsRUFBRSxnQkFBTjtBQUF3Qm9ELGFBQVMsRUFBRTtBQUFuQyxHQUFELENBdEVMLEVBdUVSLEdBQUdDLFVBQVUsQ0FBQztBQUFFckQsTUFBRSxFQUFFLG9CQUFOO0FBQTRCb0QsYUFBUyxFQUFFO0FBQXZDLEdBQUQsQ0F2RUwsRUF3RVIsR0FBR0MsVUFBVSxDQUFDO0FBQUVyRCxNQUFFLEVBQUUsaUJBQU47QUFBeUJvRCxhQUFTLEVBQUU7QUFBcEMsR0FBRCxDQXhFTCxFQXlFUixHQUFHQyxVQUFVLENBQUM7QUFBRXJELE1BQUUsRUFBRSxjQUFOO0FBQXNCb0QsYUFBUyxFQUFFO0FBQWpDLEdBQUQsQ0F6RUwsRUEwRVIsR0FBR0MsVUFBVSxDQUFDO0FBQUVyRCxNQUFFLEVBQUUsYUFBTjtBQUFxQm9ELGFBQVMsRUFBRTtBQUFoQyxHQUFELENBMUVMLEVBMkVSLEdBQUdDLFVBQVUsQ0FBQztBQUFFckQsTUFBRSxFQUFFLGtCQUFOO0FBQTBCb0QsYUFBUyxFQUFFO0FBQXJDLEdBQUQsQ0EzRUwsRUE0RVIsR0FBR0UsdUJBQXVCLENBQUM7QUFBRXRELE1BQUUsRUFBRSxrQkFBTjtBQUEwQm9ELGFBQVMsRUFBRTtBQUFyQyxHQUFELENBNUVsQixFQTZFUixHQUFHRSx1QkFBdUIsQ0FBQztBQUFFdEQsTUFBRSxFQUFFLHVCQUFOO0FBQStCb0QsYUFBUyxFQUFFO0FBQTFDLEdBQUQsQ0E3RWxCLEVBOEVSLEdBQUdDLFVBQVUsQ0FBQztBQUFFckQsTUFBRSxFQUFFLGdCQUFOO0FBQXdCb0QsYUFBUyxFQUFFO0FBQW5DLEdBQUQsQ0E5RUwsRUFnRlIsR0FBR0MsVUFBVSxDQUFDO0FBQUVyRCxNQUFFLEVBQUUsUUFBTjtBQUFnQm9ELGFBQVMsRUFBRTtBQUEzQixHQUFELENBaEZMLEVBaUZSLEdBQUdDLFVBQVUsQ0FBQztBQUFFckQsTUFBRSxFQUFFLGlCQUFOO0FBQXlCb0QsYUFBUyxFQUFFO0FBQXBDLEdBQUQsQ0FqRkwsRUFrRlIsR0FBR0MsVUFBVSxDQUFDO0FBQUVyRCxNQUFFLEVBQUUsaUJBQU47QUFBeUJvRCxhQUFTLEVBQUU7QUFBcEMsR0FBRCxDQWxGTCxFQW1GUixHQUFHQyxVQUFVLENBQUM7QUFBRXJELE1BQUUsRUFBRSxzQkFBTjtBQUE4Qm9ELGFBQVMsRUFBRTtBQUF6QyxHQUFELENBbkZMLEVBb0ZSLEdBQUdDLFVBQVUsQ0FBQztBQUFFckQsTUFBRSxFQUFFLGVBQU47QUFBdUJvRCxhQUFTLEVBQUU7QUFBbEMsR0FBRCxDQXBGTCxFQXNGUixHQUFHQyxVQUFVLENBQUM7QUFBRXJELE1BQUUsRUFBRSxZQUFOO0FBQW9Cb0QsYUFBUyxFQUFFO0FBQS9CLEdBQUQsQ0F0RkwsRUF1RlIsR0FBR0MsVUFBVSxDQUFDO0FBQUVyRCxNQUFFLEVBQUUsU0FBTjtBQUFpQm9ELGFBQVMsRUFBRTtBQUE1QixHQUFELENBdkZMLEVBeUZSO0FBQ0E7QUFDQSxLQUFHRSx1QkFBdUIsQ0FBQztBQUFFdEQsTUFBRSxFQUFFLG1CQUFOO0FBQTJCb0QsYUFBUyxFQUFFO0FBQXRDLEdBQUQsQ0EzRmxCO0FBRkcsQ0FBZixFOztBQ3RLQTtDQUdBOztBQUNBLDhDQUFlO0FBQ2JHLFFBQU0sRUFBRUMsd0NBREs7QUFFYkMsVUFBUSxFQUFFLENBQ1I7QUFDRTtBQUNBekQsTUFBRSxFQUFFO0FBRk4sR0FEUSxFQUtSO0FBQ0VBLE1BQUUsRUFBRSxtQkFETjtBQUVFO0FBQ0FFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBSFo7QUFJRTVDLGFBQVMsRUFBRSxDQUFDdUQsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUM3QjtBQUNBLGFBQU9BLE9BQU8sQ0FBQ3FDLE1BQVIsS0FBbUJyQyxPQUFPLENBQUM0QixNQUFsQztBQUNELEtBUEg7QUFRRVIsV0FBTyxFQUFFLENBQUNyQixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDMUJELFVBQUksQ0FBQ3NFLFFBQUwsR0FBZ0J0RSxJQUFJLENBQUNzRSxRQUFMLElBQWlCLEVBQWpDLENBRDBCLENBRTFCO0FBQ0E7O0FBQ0EsVUFBSSxDQUFDdEUsSUFBSSxDQUFDdUUsUUFBTixJQUFrQnZFLElBQUksQ0FBQ3NFLFFBQUwsQ0FBY3JFLE9BQU8sQ0FBQ3FDLE1BQXRCLENBQXRCLEVBQ0U7QUFDRnRDLFVBQUksQ0FBQ3NFLFFBQUwsQ0FBY3JFLE9BQU8sQ0FBQ3FDLE1BQXRCLElBQWdDLElBQWhDO0FBQ0EsYUFBTztBQUNMTyxZQUFJLEVBQUUsTUFERDtBQUVMQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUZWO0FBR0xTLFlBQUksRUFBRTtBQUNKQyxZQUFFLEVBQUUsZ0JBREE7QUFFSkksWUFBRSxFQUFFLHVCQUZBO0FBR0pDLFlBQUUsRUFBRSwwQkFIQTtBQUlKQyxZQUFFLEVBQUUsU0FKQTtBQUtKQyxZQUFFLEVBQUUsVUFMQTtBQU1KQyxZQUFFLEVBQUU7QUFOQTtBQUhELE9BQVA7QUFZRDtBQTNCSCxHQUxRLEVBa0NSO0FBQ0U3QyxNQUFFLEVBQUUsa0JBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QixVQUFJLENBQUNELElBQUksQ0FBQ3NFLFFBQVYsRUFDRTtBQUNGLGFBQU90RSxJQUFJLENBQUNzRSxRQUFMLENBQWNyRSxPQUFPLENBQUNxQyxNQUF0QixDQUFQO0FBQ0Q7QUFQSCxHQWxDUSxFQTJDUjtBQUNFM0IsTUFBRSxFQUFFLHVCQUROO0FBRUVFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUFuQixDQUZaO0FBR0VHLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUJELElBQUksQ0FBQ3dFLFVBQUwsQ0FBZ0J2RSxPQUFPLENBQUNDLFFBQXhCLENBSGhDO0FBSUVtQixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTEMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDNEIsTUFGVjtBQUdMa0IsWUFBSSxFQUFFO0FBQ0pDLFlBQUUsRUFBRSxPQURBO0FBRUpJLFlBQUUsRUFBRSxNQUZBO0FBR0pDLFlBQUUsRUFBRSxPQUhBO0FBSUpDLFlBQUUsRUFBRSxLQUpBO0FBS0pDLFlBQUUsRUFBRSxJQUxBO0FBTUpDLFlBQUUsRUFBRTtBQU5BO0FBSEQsT0FBUDtBQVlEO0FBakJILEdBM0NRO0FBRkcsQ0FBZixFOztBQ0pBO0NBR0E7O0FBQ0EsMkNBQWU7QUFDYlUsUUFBTSxFQUFFQyxvREFESztBQUViQyxVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLFVBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRVksVUFBSSxFQUFFO0FBQVIsS0FBdkIsQ0FGWjtBQUdFQyxjQUFVLEVBQUViLGlEQUFBLENBQXVCO0FBQUVZLFVBQUksRUFBRTtBQUFSLEtBQXZCLENBSGQ7QUFJRUUsY0FBVSxFQUFFZCxpREFBQSxDQUF1QjtBQUFFWSxVQUFJLEVBQUU7QUFBUixLQUF2QixDQUpkO0FBS0VHLGNBQVUsRUFBRWYsaURBQUEsQ0FBdUI7QUFBRVksVUFBSSxFQUFFO0FBQVIsS0FBdkIsQ0FMZDtBQU1FSSxjQUFVLEVBQUVoQixpREFBQSxDQUF1QjtBQUFFWSxVQUFJLEVBQUU7QUFBUixLQUF2QixDQU5kO0FBT0VwRCxXQUFPLEVBQUdyQixJQUFELElBQVU7QUFDakIsYUFBTztBQUNMNkMsWUFBSSxFQUFFLE1BREQ7QUFFTEMsYUFBSyxFQUFFOUMsSUFBSSxDQUFDOEUsRUFGUDtBQUdML0IsWUFBSSxFQUFFO0FBQ0pDLFlBQUUsRUFBRSxLQURBO0FBRUpJLFlBQUUsRUFBRSxPQUZBO0FBR0pDLFlBQUUsRUFBRSxRQUhBO0FBSUpDLFlBQUUsRUFBRSxLQUpBO0FBS0pDLFlBQUUsRUFBRSxJQUxBO0FBTUpDLFlBQUUsRUFBRTtBQU5BO0FBSEQsT0FBUDtBQVlEO0FBcEJILEdBRFEsRUF1QlI7QUFDRTdDLE1BQUUsRUFBRSxXQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVZLFVBQUksRUFBRTtBQUFSLEtBQXZCLENBRlo7QUFHRUMsY0FBVSxFQUFFYixpREFBQSxDQUF1QjtBQUFFWSxVQUFJLEVBQUU7QUFBUixLQUF2QixDQUhkO0FBSUVFLGNBQVUsRUFBRWQsaURBQUEsQ0FBdUI7QUFBRVksVUFBSSxFQUFFO0FBQVIsS0FBdkIsQ0FKZDtBQUtFRyxjQUFVLEVBQUVmLGlEQUFBLENBQXVCO0FBQUVZLFVBQUksRUFBRTtBQUFSLEtBQXZCLENBTGQ7QUFNRUksY0FBVSxFQUFFaEIsaURBQUEsQ0FBdUI7QUFBRVksVUFBSSxFQUFFO0FBQVIsS0FBdkIsQ0FOZDtBQU9FcEQsV0FBTyxFQUFHckIsSUFBRCxJQUFVO0FBQ2pCLGFBQU87QUFDTDZDLFlBQUksRUFBRSxNQUREO0FBRUxDLGFBQUssRUFBRTlDLElBQUksQ0FBQzhFLEVBRlA7QUFHTC9CLFlBQUksRUFBRTtBQUNKQyxZQUFFLEVBQUUsWUFEQTtBQUVKSSxZQUFFLEVBQUUsYUFGQTtBQUdKQyxZQUFFLEVBQUUsWUFIQTtBQUlKQyxZQUFFLEVBQUUsS0FKQTtBQUtKQyxZQUFFLEVBQUUsSUFMQTtBQU1KQyxZQUFFLEVBQUU7QUFOQTtBQUhELE9BQVA7QUFZRDtBQXBCSCxHQXZCUSxFQTZDUjtBQUNFN0MsTUFBRSxFQUFFLGdCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUF2QixDQUZaO0FBR0VHLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDNUIsVUFBSUEsT0FBTyxDQUFDNEIsTUFBUixLQUFtQjdCLElBQUksQ0FBQzhFLEVBQTVCLEVBQ0UsT0FBTyxLQUFQO0FBQ0YsWUFBTUMscUJBQXFCLEdBQUc7QUFDNUIvQixVQUFFLEVBQUUsZ0JBRHdCO0FBRTVCSyxVQUFFLEVBQUUsMkJBRndCO0FBRzVCQyxVQUFFLEVBQUUsSUFId0I7QUFJNUJDLFVBQUUsRUFBRSxJQUp3QjtBQUs1QkMsVUFBRSxFQUFFO0FBTHdCLE9BQTlCO0FBT0EsWUFBTXdCLGtCQUFrQixHQUFHeEMsTUFBTSxDQUFDeUMsTUFBUCxDQUFjRixxQkFBZCxDQUEzQjtBQUNBLGFBQU9DLGtCQUFrQixDQUFDMUUsUUFBbkIsQ0FBNEJMLE9BQU8sQ0FBQ3FDLE1BQXBDLENBQVA7QUFDRCxLQWZIO0FBZ0JFakIsV0FBTyxFQUFFLENBQUNyQixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDMUJELFVBQUksQ0FBQ2tGLFNBQUwsR0FBaUJsRixJQUFJLENBQUNrRixTQUFMLElBQWtCLENBQW5DO0FBQ0FsRixVQUFJLENBQUNrRixTQUFMO0FBQ0EsWUFBTW5DLElBQUksR0FBSSxHQUFFOUMsT0FBTyxDQUFDa0YsT0FBUSxLQUFJbkYsSUFBSSxDQUFDa0YsU0FBVSxNQUFLbEYsSUFBSSxDQUFDb0YsaUJBQUwsQ0FBdUJuRixPQUF2QixDQUFnQyxFQUF4RjtBQUNBLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU5QyxJQUFJLENBQUM4RSxFQUE1QjtBQUFnQy9CLFlBQUksRUFBRUE7QUFBdEMsT0FBUDtBQUNEO0FBckJILEdBN0NRLEVBb0VSO0FBQ0VwQyxNQUFFLEVBQUUsa0JBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFNUMsYUFBUyxFQUFFLENBQUNkLElBQUQsRUFBT0MsT0FBUCxLQUFtQkEsT0FBTyxDQUFDNEIsTUFBUixLQUFtQjdCLElBQUksQ0FBQzhFLEVBSHhEO0FBSUV6RCxXQUFPLEVBQUUsQ0FBQ3JCLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUMxQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFOUMsSUFBSSxDQUFDOEUsRUFBNUI7QUFBZ0MvQixZQUFJLEVBQUU5QyxPQUFPLENBQUNvRjtBQUE5QyxPQUFQO0FBQ0Q7QUFOSCxHQXBFUSxFQTRFUjtBQUNFMUUsTUFBRSxFQUFFLFdBRE47QUFFRUUsWUFBUSxFQUFFZ0QsbUNBQUEsQ0FBZ0I7QUFBRVksVUFBSSxFQUFFO0FBQVIsS0FBaEIsQ0FGWjtBQUdFckQsbUJBQWUsRUFBRSxFQUhuQjtBQUlFQyxXQUFPLEVBQUUsQ0FBQ3JCLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUMxQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFOUMsSUFBSSxDQUFDOEUsRUFBNUI7QUFBZ0MvQixZQUFJLEVBQUU5QyxPQUFPLENBQUN3RTtBQUE5QyxPQUFQO0FBQ0Q7QUFOSCxHQTVFUSxFQW9GUjtBQUNFOUQsTUFBRSxFQUFFLG1CQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVZLFVBQUksRUFBRTtBQUFSLEtBQXZCLENBRlo7QUFHRUMsY0FBVSxFQUFFYixpREFBQSxDQUF1QjtBQUFFWSxVQUFJLEVBQUU7QUFBUixLQUF2QixDQUhkO0FBSUVFLGNBQVUsRUFBRWQsaURBQUEsQ0FBdUI7QUFBRVksVUFBSSxFQUFFO0FBQVIsS0FBdkIsQ0FKZDtBQUtFRyxjQUFVLEVBQUVmLGlEQUFBLENBQXVCO0FBQUVZLFVBQUksRUFBRTtBQUFSLEtBQXZCLENBTGQ7QUFNRUksY0FBVSxFQUFFaEIsaURBQUEsQ0FBdUI7QUFBRVksVUFBSSxFQUFFO0FBQVIsS0FBdkIsQ0FOZDtBQU9FMUQsT0FBRyxFQUFHZixJQUFELElBQVU7QUFDYkEsVUFBSSxDQUFDc0YsU0FBTCxHQUFpQixDQUFDdEYsSUFBSSxDQUFDc0YsU0FBTCxJQUFrQixDQUFuQixJQUF3QixDQUF6QztBQUNEO0FBVEgsR0FwRlEsRUErRlI7QUFDRTNFLE1BQUUsRUFBRSxXQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVZLFVBQUksRUFBRTtBQUFSLEtBQXZCLENBRlo7QUFHRUMsY0FBVSxFQUFFYixpREFBQSxDQUF1QjtBQUFFWSxVQUFJLEVBQUU7QUFBUixLQUF2QixDQUhkO0FBSUVFLGNBQVUsRUFBRWQsaURBQUEsQ0FBdUI7QUFBRVksVUFBSSxFQUFFO0FBQVIsS0FBdkIsQ0FKZDtBQUtFRyxjQUFVLEVBQUVmLGlEQUFBLENBQXVCO0FBQUVZLFVBQUksRUFBRTtBQUFSLEtBQXZCLENBTGQ7QUFNRUksY0FBVSxFQUFFaEIsaURBQUEsQ0FBdUI7QUFBRVksVUFBSSxFQUFFO0FBQVIsS0FBdkIsQ0FOZDtBQU9FdkQsZ0JBQVksRUFBRSxDQVBoQjtBQVFFRyxXQUFPLEVBQUdyQixJQUFELElBQVU7QUFDakI7QUFDQSxVQUFJLENBQUNBLElBQUksQ0FBQ3NGLFNBQU4sSUFBbUJ0RixJQUFJLENBQUNzRixTQUFMLElBQWtCLENBQXpDLEVBQ0U7QUFDRixhQUFPO0FBQ0x6QyxZQUFJLEVBQUUsTUFERDtBQUVMQyxhQUFLLEVBQUU5QyxJQUFJLENBQUM4RSxFQUZQO0FBR0wvQixZQUFJLEVBQUU7QUFDSkMsWUFBRSxFQUFHLG1CQUFrQmhELElBQUksQ0FBQ3NGLFNBQVUsR0FEbEM7QUFFSmxDLFlBQUUsRUFBRyxxQkFBb0JwRCxJQUFJLENBQUNzRixTQUFVLEdBRnBDO0FBR0pqQyxZQUFFLEVBQUcsb0JBQW1CckQsSUFBSSxDQUFDc0YsU0FBVSxHQUhuQztBQUlKaEMsWUFBRSxFQUFHLGFBQVl0RCxJQUFJLENBQUNzRixTQUFVLEdBSjVCO0FBS0ovQixZQUFFLEVBQUcsVUFBU3ZELElBQUksQ0FBQ3NGLFNBQVUsR0FMekI7QUFNSjlCLFlBQUUsRUFBRyxhQUFZeEQsSUFBSSxDQUFDc0YsU0FBVTtBQU41QjtBQUhELE9BQVA7QUFZRCxLQXhCSDtBQXlCRXZFLE9BQUcsRUFBR2YsSUFBRCxJQUFVLE9BQU9BLElBQUksQ0FBQ3NGO0FBekI3QixHQS9GUTtBQUZHLENBQWYsRTs7Q0NGQTs7QUFDQSwrQ0FBZTtBQUNicEIsUUFBTSxFQUFFQyxzREFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsNkJBQXlCO0FBRGYsR0FGQztBQUtiQyxXQUFTLEVBQUU7QUFDVCwwQkFBc0IsS0FEYjtBQUVULHdCQUFvQjtBQUZYO0FBTEUsQ0FBZixFOztDQ0RBOztBQUNBLCtDQUFlO0FBQ2J0QixRQUFNLEVBQUVDLHdDQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVixrQ0FBOEI7QUFEcEIsR0FGQztBQUtiRSxZQUFVLEVBQUU7QUFDVix5QkFBcUI7QUFEWCxHQUxDO0FBUWJELFdBQVMsRUFBRTtBQUNULDJCQUF1QjtBQURkO0FBUkUsQ0FBZixFOztBQ0hBO0NBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTs7QUFDQSw4Q0FBZTtBQUNidEIsUUFBTSxFQUFFQyxnRUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YseUJBQXFCLEtBRFg7QUFDa0I7QUFDNUIseUJBQXFCLEtBRlg7QUFFa0I7QUFDNUIseUJBQXFCLEtBSFgsQ0FHa0I7O0FBSGxCLEdBRkM7QUFPYkUsWUFBVSxFQUFFO0FBQ1Ysd0JBQW9CLEtBRFY7QUFDaUI7QUFDM0IsOEJBQTBCLEtBRmhCO0FBRXVCO0FBQ2pDLDhCQUEwQixLQUhoQjtBQUd1QjtBQUNqQyw4QkFBMEIsS0FKaEIsQ0FJdUI7O0FBSnZCLEdBUEM7QUFhYkMsaUJBQWUsRUFBRTtBQUNmLHFCQUFpQixLQURGLENBQ1M7O0FBRFQsR0FiSjtBQWdCYkMsaUJBQWUsRUFBRTtBQUNmLHVCQUFtQixLQURKLENBQ1c7O0FBRFgsR0FoQko7QUFtQmJ2QixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLDhCQUROO0FBRUVFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUFuQixDQUZaO0FBR0VpRixlQUFXLEVBQUUsQ0FBQ3ZCLEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDL0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTG5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BRlQ7QUFHTHVELGNBQU0sRUFBRTtBQUNON0MsWUFBRSxFQUFFLGFBREU7QUFFTkksWUFBRSxFQUFFLGdCQUZFO0FBR05DLFlBQUUsRUFBRSxrQkFIRTtBQUlOQyxZQUFFLEVBQUUsUUFKRTtBQUtOQyxZQUFFLEVBQUUsTUFMRTtBQU1OQyxZQUFFLEVBQUU7QUFORTtBQUhILE9BQVA7QUFZRDtBQWhCSCxHQURRO0FBbkJHLENBQWYsRTs7QUNiQTtDQUdBOztBQUNBLCtDQUFlO0FBQ2JVLFFBQU0sRUFBRUMsNEVBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWO0FBQ0EsNkJBQXlCLEtBRmY7QUFHVjtBQUNBLDRCQUF3QjtBQUpkLEdBRkM7QUFRYkMsV0FBUyxFQUFFO0FBQ1Q7QUFDQSwrQkFBMkIsS0FGbEI7QUFHVDtBQUNBLHlCQUFxQjtBQUpaLEdBUkU7QUFjYk0sV0FBUyxFQUFFO0FBQ1Q7QUFDQSx3QkFBb0I7QUFGWCxHQWRFO0FBa0JiMUIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSxzQkFETjtBQUVFRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFO0FBQU4sS0FBbkIsQ0FGWjtBQUdFSSxPQUFHLEVBQUdmLElBQUQsSUFBVTtBQUNiQSxVQUFJLENBQUMrRixlQUFMLEdBQXVCLElBQXZCO0FBQ0Q7QUFMSCxHQURRLEVBUVI7QUFDRXBGLE1BQUUsRUFBRSxxQkFETjtBQUVFO0FBQ0E7QUFDQUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FKWjtBQUtFNUMsYUFBUyxFQUFHZCxJQUFELElBQVU7QUFDbkI7QUFDQTtBQUNBLGFBQU9BLElBQUksQ0FBQytGLGVBQVo7QUFDRCxLQVRIO0FBVUUxRSxXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNvRjtBQUFyRCxPQUFQO0FBQ0Q7QUFaSCxHQVJRO0FBbEJHLENBQWYsRTs7QUNKQTtDQUdBOztBQUNBLCtDQUFlO0FBQ2JuQixRQUFNLEVBQUVDLGtGQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVjtBQUNBLDZCQUF5QixLQUZmO0FBR1Y7QUFDQSx3QkFBb0IsS0FKVjtBQUtWO0FBQ0EsNEJBQXdCO0FBTmQsR0FGQztBQVViRSxZQUFVLEVBQUU7QUFDVjtBQUNBLDJCQUF1QjtBQUZiLEdBVkM7QUFjYkQsV0FBUyxFQUFFO0FBQ1Q7QUFDQSx5QkFBcUI7QUFGWixHQWRFO0FBa0JiTSxXQUFTLEVBQUU7QUFDVDtBQUNBLHlCQUFxQjtBQUZaLEdBbEJFO0FBc0JiRSxVQUFRLEVBQUU7QUFDUjtBQUNBLHdCQUFvQjtBQUZaLEdBdEJHO0FBMEJiNUIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSxxQkFETjtBQUVFO0FBQ0E7QUFDQUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FKWjtBQUtFNUMsYUFBUyxFQUFFLENBQUN1RCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzdCO0FBQ0EsYUFBT2dHLFVBQVUsQ0FBQ2hHLE9BQU8sQ0FBQ2lHLFFBQVQsQ0FBVixHQUErQixFQUF0QztBQUNELEtBUkg7QUFTRTdFLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ29GO0FBQXJELE9BQVA7QUFDRDtBQVhILEdBRFE7QUExQkcsQ0FBZixFOztDQ0ZBOztBQUNBLCtDQUFlO0FBQ2JuQixRQUFNLEVBQUVDLGdEQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVixrQ0FBOEIsS0FEcEI7QUFFVixxQkFBaUI7QUFGUCxHQUZDO0FBTWJFLFlBQVUsRUFBRTtBQUNWLHlCQUFxQjtBQURYLEdBTkM7QUFTYkQsV0FBUyxFQUFFO0FBQ1QsMkJBQXVCO0FBRGQsR0FURTtBQVliTSxXQUFTLEVBQUU7QUFDVCwrQkFBMkI7QUFEbEI7QUFaRSxDQUFmLEU7O0NDREE7O0FBQ0EsK0NBQWU7QUFDYjVCLFFBQU0sRUFBRUMsc0RBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLGtDQUE4QixLQURwQjtBQUVWLHFCQUFpQjtBQUZQLEdBRkM7QUFNYkUsWUFBVSxFQUFFO0FBQ1YseUJBQXFCLEtBRFg7QUFFVixnQ0FBNEI7QUFGbEIsR0FOQztBQVViRCxXQUFTLEVBQUU7QUFDVCwyQkFBdUI7QUFEZCxHQVZFO0FBYWJNLFdBQVMsRUFBRTtBQUNULCtCQUEyQjtBQURsQjtBQWJFLENBQWYsRTs7QUNIQTtBQUNBO0FBRUEsbURBQWU7QUFDYjVCLFFBQU0sRUFBRUMsa0VBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLDZCQUF5QixNQURmO0FBQ3VCO0FBQ2pDLDRCQUF3QixNQUZkO0FBRXNCO0FBQ2hDLDBCQUFzQixNQUhaO0FBR29CO0FBQzlCLDRCQUF3QixNQUpkO0FBSXNCO0FBQ2hDLDBCQUFzQixNQUxaO0FBS29CO0FBQzlCLDBCQUFzQixNQU5aO0FBTW9CO0FBQzlCLDBCQUFzQixNQVBaO0FBT29CO0FBQzlCLDZCQUF5QixNQVJmO0FBUXVCO0FBQ2pDLHVCQUFtQixNQVRUO0FBU2lCO0FBQzNCLDBCQUFzQixNQVZaO0FBVW9CO0FBQzlCLDZCQUF5QixNQVhmO0FBV3VCO0FBQ2pDLG1CQUFlLE1BWkw7QUFZYTtBQUN2Qiw2QkFBeUIsTUFiZjtBQWF1QjtBQUNqQztBQUNBLDBCQUFzQixNQWZaO0FBZW9CO0FBQzlCLDBCQUFzQixNQWhCWjtBQWdCb0I7QUFDOUIseUJBQXFCLE1BakJYO0FBaUJtQjtBQUM3Qix5QkFBcUIsTUFsQlg7QUFrQm1CO0FBQzdCLDRCQUF3QixNQW5CZDtBQW1Cc0I7QUFDaEMseUJBQXFCLE1BcEJYO0FBb0JtQjtBQUM3QiwwQkFBc0IsTUFyQlo7QUFxQm9CO0FBQzlCLDRCQUF3QixNQXRCZDtBQXNCc0I7QUFDaEMsbUNBQStCLE1BdkJyQjtBQXVCNkI7QUFDdkMsMkJBQXVCLE1BeEJiLENBd0JxQjs7QUF4QnJCLEdBRkM7QUE0QmJDLFdBQVMsRUFBRTtBQUNULDJCQUF1QixNQURkO0FBQ3NCO0FBQy9CLDRCQUF3QixNQUZmO0FBRXVCO0FBQ2hDLHdCQUFvQixNQUhYO0FBR21CO0FBQzVCO0FBQ0E7QUFDQSwyQkFBdUIsTUFOZDtBQU1zQjtBQUMvQiwyQkFBdUIsTUFQZDtBQU9zQjtBQUMvQiw2QkFBeUIsTUFSaEIsQ0FRd0I7O0FBUnhCLEdBNUJFO0FBc0NiRSxpQkFBZSxFQUFFO0FBQ2Ysd0JBQW9CLEtBREw7QUFDWTtBQUMzQiw2QkFBeUIsS0FGVjtBQUVpQjtBQUNoQyxvQkFBZ0IsS0FIRDtBQUdRO0FBQ3ZCLG9CQUFnQixLQUpEO0FBSVE7QUFDdkIsNEJBQXdCLEtBTFQ7QUFLZ0I7QUFDL0Isb0JBQWdCLElBTkQsQ0FNTzs7QUFOUCxHQXRDSjtBQThDYnRCLFVBQVEsRUFBRSxDQUNSO0FBQ0V6RCxNQUFFLEVBQUUsNENBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDbUcsTUFBTCxHQUFjbkcsSUFBSSxDQUFDbUcsTUFBTCxJQUFlLEVBQTdCO0FBQ0FuRyxVQUFJLENBQUNtRyxNQUFMLENBQVlsRyxPQUFPLENBQUNxQyxNQUFwQixJQUE4QixJQUE5QjtBQUNEO0FBTkgsR0FEUSxFQVNSO0FBQ0UzQixNQUFFLEVBQUUsNENBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDbUcsTUFBTCxHQUFjbkcsSUFBSSxDQUFDbUcsTUFBTCxJQUFlLEVBQTdCO0FBQ0FuRyxVQUFJLENBQUNtRyxNQUFMLENBQVlsRyxPQUFPLENBQUNxQyxNQUFwQixJQUE4QixLQUE5QjtBQUNEO0FBTkgsR0FUUSxFQWlCUjtBQUNFM0IsTUFBRSxFQUFFLDRCQUROO0FBRUVFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUFuQixDQUZaO0FBR0VHLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUJELElBQUksQ0FBQ21HLE1BQUwsSUFBZSxDQUFDbkcsSUFBSSxDQUFDbUcsTUFBTCxDQUFZbEcsT0FBTyxDQUFDcUMsTUFBcEIsQ0FIaEQ7QUFJRWpCLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ2tGO0FBQXJELE9BQVA7QUFDRDtBQU5ILEdBakJRLEVBeUJSO0FBQ0V4RSxNQUFFLEVBQUUsK0JBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDb0csTUFBTCxHQUFjcEcsSUFBSSxDQUFDb0csTUFBTCxJQUFlLEVBQTdCO0FBQ0FwRyxVQUFJLENBQUNvRyxNQUFMLENBQVluRyxPQUFPLENBQUNxQyxNQUFwQixJQUE4QixJQUE5QjtBQUNEO0FBTkgsR0F6QlEsRUFpQ1I7QUFDRTNCLE1BQUUsRUFBRSwrQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0UzQyxPQUFHLEVBQUUsQ0FBQ2YsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3RCRCxVQUFJLENBQUNvRyxNQUFMLEdBQWNwRyxJQUFJLENBQUNvRyxNQUFMLElBQWUsRUFBN0I7QUFDQXBHLFVBQUksQ0FBQ29HLE1BQUwsQ0FBWW5HLE9BQU8sQ0FBQ3FDLE1BQXBCLElBQThCLEtBQTlCO0FBQ0Q7QUFOSCxHQWpDUSxFQXlDUjtBQUNFM0IsTUFBRSxFQUFFLDBCQUROO0FBRUVFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUFuQixDQUZaO0FBR0VHLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUJELElBQUksQ0FBQ29HLE1BQUwsSUFBZSxDQUFDcEcsSUFBSSxDQUFDb0csTUFBTCxDQUFZbkcsT0FBTyxDQUFDcUMsTUFBcEIsQ0FIaEQ7QUFJRWpCLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ2tGO0FBQXJELE9BQVA7QUFDRDtBQU5ILEdBekNRLEVBaURSO0FBQ0U7QUFDQXhFLE1BQUUsRUFBRSx5QkFGTjtBQUdFRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFaEIsVUFBSSxFQUFFLElBQVI7QUFBY2xDLFFBQUUsRUFBRTtBQUFsQixLQUFuQixDQUhaO0FBSUVVLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQ0w0QyxZQUFJLEVBQUUsTUFERDtBQUVMQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUZWO0FBR0xTLFlBQUksRUFBRTtBQUNKQyxZQUFFLEVBQUUsWUFEQTtBQUVKSSxZQUFFLEVBQUUsWUFGQTtBQUdKQyxZQUFFLEVBQUUsWUFIQTtBQUlKQyxZQUFFLEVBQUUsUUFKQTtBQUtKQyxZQUFFLEVBQUUsTUFMQTtBQU1KQyxZQUFFLEVBQUU7QUFOQTtBQUhELE9BQVA7QUFZRDtBQWpCSCxHQWpEUSxFQW9FUjtBQUNFN0MsTUFBRSxFQUFFLG1CQUROO0FBRUVFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUFuQixDQUZaO0FBR0VpRixlQUFXLEVBQUUsQ0FBQ3ZCLEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDL0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTG5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BRlQ7QUFHTHVELGNBQU0sRUFBRTtBQUNON0MsWUFBRSxFQUFFLFdBREU7QUFFTkksWUFBRSxFQUFFLHNCQUZFO0FBR05DLFlBQUUsRUFBRSxlQUhFO0FBSU5DLFlBQUUsRUFBRSxRQUpFO0FBS05DLFlBQUUsRUFBRSxLQUxFO0FBTU5DLFlBQUUsRUFBRTtBQU5FO0FBSEgsT0FBUDtBQVlEO0FBaEJILEdBcEVRO0FBOUNHLENBQWYsRTs7QUNIQTtDQUdBOztBQUNBLHdFQUFlO0FBQ2JVLFFBQU0sRUFBRUMsNEZBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLHVCQUFtQixLQURUO0FBQ2dCO0FBQzFCLHdCQUFvQixLQUZWO0FBRWlCO0FBQzNCLHdCQUFvQixNQUhWO0FBR2tCO0FBQzVCLG1DQUErQixNQUpyQjtBQUk2QjtBQUN2QywwQkFBc0IsTUFMWjtBQUtvQjtBQUM5QiwyQkFBdUIsTUFOYjtBQU1xQjtBQUMvQixxQkFBaUIsTUFQUDtBQU9lO0FBQ3pCLDJCQUF1QixNQVJiO0FBUXFCO0FBQy9CLG9CQUFnQixNQVROO0FBU2M7QUFDeEIscUJBQWlCLE1BVlA7QUFVZTtBQUN6QixnQkFBWSxLQVhGO0FBV1M7QUFDbkIsd0JBQW9CLEtBWlY7QUFZaUI7QUFDM0IsZ0NBQTRCLE1BYmxCO0FBYTBCO0FBQ3BDLGNBQVUsTUFkQTtBQWNRO0FBQ2xCLHFCQUFpQixNQWZQO0FBZWU7QUFDekIsd0JBQW9CLE1BaEJWO0FBZ0JrQjtBQUM1Qix5QkFBcUIsS0FqQlg7QUFpQmtCO0FBQzVCLHNCQUFrQixLQWxCUjtBQWtCZTtBQUN6Qix1QkFBbUIsTUFuQlQ7QUFtQmlCO0FBQzNCLDBCQUFzQixNQXBCWjtBQW9Cb0I7QUFDOUIsc0JBQWtCLE1BckJSO0FBcUJnQjtBQUMxQix3QkFBb0IsTUF0QlY7QUFzQmtCO0FBQzVCLDRCQUF3QixNQXZCZDtBQXVCc0I7QUFDaEMsd0JBQW9CLE1BeEJWO0FBd0JrQjtBQUM1Qiw0QkFBd0IsTUF6QmQ7QUF5QnNCO0FBQ2hDLDBCQUFzQixNQTFCWixDQTBCb0I7O0FBMUJwQixHQUZDO0FBOEJiQyxXQUFTLEVBQUU7QUFDVCx5QkFBcUIsTUFEWjtBQUNvQjtBQUM3QiwyQkFBdUIsTUFGZDtBQUVzQjtBQUMvQiwwQkFBc0IsTUFIYixDQUdxQjs7QUFIckIsR0E5QkU7QUFtQ2JwQixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLGtCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRXJDLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ29GO0FBQXJELE9BQVA7QUFDRDtBQUxILEdBRFE7QUFuQ0csQ0FBZixFOztDQ0ZBOztBQUNBLHdEQUFlO0FBQ2JuQixRQUFNLEVBQUVDLDhEQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViw0QkFBd0IsS0FEZDtBQUNxQjtBQUMvQixvQ0FBZ0MsS0FGdEI7QUFFNkI7QUFDdkMsOEJBQTBCLEtBSGhCO0FBR3VCO0FBQ2pDLDhCQUEwQixLQUpoQjtBQUl1QjtBQUNqQywrQkFBMkIsS0FMakI7QUFLd0I7QUFDbEMsNEJBQXdCLEtBTmQ7QUFNcUI7QUFDL0IscUJBQWlCLEtBUFA7QUFRVixrQ0FBOEIsS0FScEIsQ0FRMkI7O0FBUjNCLEdBRkM7QUFZYkMsV0FBUyxFQUFFO0FBQ1QsOEJBQTBCLEtBRGpCLENBQ3dCOztBQUR4QjtBQVpFLENBQWYsRTs7OztBQ0hBO0FBQ0E7QUFFQTtBQUVBLHlEQUFlO0FBQ2J0QixRQUFNLEVBQUVDLHdFQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViwwQkFBc0IsS0FEWjtBQUNtQjtBQUM3QixzQkFBa0IsTUFGUjtBQUVnQjtBQUMxQiw0QkFBd0IsS0FIZDtBQUdxQjtBQUMvQiw2QkFBeUIsTUFKZjtBQUl1QjtBQUNqQyw2QkFBeUIsTUFMZjtBQUt1QjtBQUNqQyw2QkFBeUIsTUFOZjtBQU11QjtBQUNqQyw4QkFBMEIsTUFQaEI7QUFPd0I7QUFDbEMsdUJBQW1CLE1BUlQ7QUFRaUI7QUFDM0IsdUJBQW1CLE1BVFQ7QUFTaUI7QUFDM0IsdUJBQW1CLE1BVlQ7QUFVaUI7QUFDM0IsMEJBQXNCLE1BWFo7QUFXb0I7QUFDOUIsNEJBQXdCLEtBWmQ7QUFZcUI7QUFDL0Isd0JBQW9CLEtBYlY7QUFhaUI7QUFDM0IseUJBQXFCLEtBZFg7QUFja0I7QUFDNUIsMEJBQXNCLEtBZlo7QUFlbUI7QUFDN0Isb0JBQWdCLE1BaEJOO0FBZ0JjO0FBQ3hCLHFCQUFpQixNQWpCUDtBQWlCZTtBQUN6Qix5QkFBcUIsTUFsQlg7QUFrQm1CO0FBQzdCLDBCQUFzQixNQW5CWjtBQW1Cb0I7QUFDOUIsNEJBQXdCLE1BcEJkO0FBb0JzQjtBQUNoQyxxQ0FBaUMsTUFyQnZCO0FBcUIrQjtBQUN6Qyx3Q0FBb0MsTUF0QjFCO0FBc0JrQztBQUM1QyxxQkFBaUIsTUF2QlAsQ0F1QmU7O0FBdkJmLEdBRkM7QUEyQmJFLFlBQVUsRUFBRTtBQUNWLCtCQUEyQixNQURqQixDQUN5Qjs7QUFEekIsR0EzQkM7QUE4QmJELFdBQVMsRUFBRTtBQUNULDRCQUF3QixNQURmO0FBQ3VCO0FBQ2hDLHVCQUFtQixRQUZWLENBRW9COztBQUZwQixHQTlCRTtBQWtDYnBCLFVBQVEsRUFBRSxDQUNSO0FBQ0U7QUFDQXpELE1BQUUsRUFBRSxlQUZOO0FBR0VFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBSFo7QUFJRXJDLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ29GO0FBQXJELE9BQVA7QUFDRDtBQU5ILEdBRFEsRUFTUjtBQUNFO0FBQ0ExRSxNQUFFLEVBQUUsa0JBRk47QUFHRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FIWjtBQUlFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDcUcsTUFBTCxHQUFjckcsSUFBSSxDQUFDcUcsTUFBTCxJQUFlLEVBQTdCO0FBQ0FyRyxVQUFJLENBQUNxRyxNQUFMLENBQVlwRyxPQUFPLENBQUNxQyxNQUFwQixJQUE4QixJQUE5QjtBQUNEO0FBUEgsR0FUUSxFQWtCUjtBQUNFM0IsTUFBRSxFQUFFLGtCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRTNDLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQ3FHLE1BQUwsR0FBY3JHLElBQUksQ0FBQ3FHLE1BQUwsSUFBZSxFQUE3QjtBQUNBckcsVUFBSSxDQUFDcUcsTUFBTCxDQUFZcEcsT0FBTyxDQUFDcUMsTUFBcEIsSUFBOEIsS0FBOUI7QUFDRDtBQU5ILEdBbEJRLEVBMEJSO0FBQ0U7QUFDQTNCLE1BQUUsRUFBRSxxQkFGTjtBQUdFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLFNBQU47QUFBaUIsU0FBRzJGLHVDQUFrQkE7QUFBdEMsS0FBdkIsQ0FIWjtBQUlFeEYsYUFBUyxFQUFFLENBQUNkLElBQUQsRUFBT0MsT0FBUCxLQUFtQkQsSUFBSSxDQUFDcUcsTUFBTCxDQUFZcEcsT0FBTyxDQUFDcUMsTUFBcEIsQ0FKaEM7QUFLRWpCLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQ0w0QyxZQUFJLEVBQUUsTUFERDtBQUVMQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUZWO0FBR0xTLFlBQUksRUFBRTtBQUNKQyxZQUFFLEVBQUUsYUFEQTtBQUVKSSxZQUFFLEVBQUUsa0JBRkE7QUFHSkUsWUFBRSxFQUFFLGFBSEE7QUFJSkMsWUFBRSxFQUFFO0FBSkE7QUFIRCxPQUFQO0FBVUQ7QUFoQkgsR0ExQlEsRUE0Q1I7QUFDRTVDLE1BQUUsRUFBRSxlQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBRlo7QUFHRTtBQUNBeEYsYUFBUyxFQUFFLENBQUNkLElBQUQsRUFBT0MsT0FBUCxLQUFtQkQsSUFBSSxDQUFDb0YsaUJBQUwsQ0FBdUJuRixPQUF2QixJQUFrQyxDQUpsRTtBQUtFb0IsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDa0Y7QUFBckQsT0FBUDtBQUNEO0FBUEgsR0E1Q1EsRUFxRFI7QUFDRXhFLE1BQUUsRUFBRSxpQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLFNBQU47QUFBaUIsU0FBRzJGLHVDQUFrQkE7QUFBdEMsS0FBdkIsQ0FGWjtBQUdFO0FBQ0F4RixhQUFTLEVBQUUsQ0FBQ2QsSUFBRCxFQUFPQyxPQUFQLEtBQW1CRCxJQUFJLENBQUNvRixpQkFBTCxDQUF1Qm5GLE9BQXZCLElBQWtDLENBSmxFO0FBS0VvQixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNrRjtBQUFyRCxPQUFQO0FBQ0Q7QUFQSCxHQXJEUTtBQWxDRyxDQUFmLEU7O0FDTEE7QUFDQTtBQUVBLG1EQUFlO0FBQ2JqQixRQUFNLEVBQUVDLDRDQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViw2QkFBeUIsTUFEZjtBQUN1QjtBQUNqQyx5QkFBcUIsTUFGWDtBQUVtQjtBQUM3QiwyQkFBdUIsTUFIYjtBQUdxQjtBQUMvQiwrQkFBMkIsTUFKakI7QUFJeUI7QUFDbkMsNEJBQXdCLE1BTGQ7QUFLc0I7QUFDaEMsNEJBQXdCLE1BTmQ7QUFNc0I7QUFDaEMsMkJBQXVCLE1BUGI7QUFPcUI7QUFDL0IsK0JBQTJCLE1BUmpCO0FBUXlCO0FBQ25DLGtDQUE4QixNQVRwQjtBQVM0QjtBQUN0QywyQkFBdUIsTUFWYjtBQVVxQjtBQUMvQiwyQkFBdUIsTUFYYjtBQVdxQjtBQUMvQiw0QkFBd0IsTUFaZDtBQVlzQjtBQUNoQywyQkFBdUIsTUFiYjtBQWFxQjtBQUMvQiw0QkFBd0IsTUFkZDtBQWNzQjtBQUNoQywyQkFBdUIsTUFmYjtBQWVxQjtBQUMvQix5QkFBcUIsTUFoQlg7QUFnQm1CO0FBQzdCLDBCQUFzQixNQWpCWjtBQWlCb0I7QUFDOUIsMEJBQXNCLE1BbEJaO0FBa0JvQjtBQUM5Qiw0QkFBd0IsTUFuQmQ7QUFtQnNCO0FBQ2hDLDZCQUF5QixNQXBCZjtBQW9CdUI7QUFDakMsOEJBQTBCLE1BckJoQjtBQXFCd0I7QUFDbEMsOEJBQTBCLE1BdEJoQjtBQXNCd0I7QUFDbEMsOEJBQTBCLE1BdkJoQjtBQXVCd0I7QUFDbEMsNkJBQXlCLE1BeEJmLENBd0J1Qjs7QUF4QnZCLEdBRkM7QUE0QmJuQixVQUFRLEVBQUUsQ0FDUjtBQUNFO0FBQ0F6RCxNQUFFLEVBQUUsZ0JBRk47QUFHRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FIWjtBQUlFckMsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDb0Y7QUFBckQsT0FBUDtBQUNEO0FBTkgsR0FEUTtBQTVCRyxDQUFmLEU7O0FDSEE7QUFDQTtBQUVBO0FBRUEsMkNBQWU7QUFDYm5CLFFBQU0sRUFBRUMsZ0ZBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLHNCQUFrQixNQURSO0FBQ2dCO0FBQzFCLGtDQUE4QixNQUZwQixDQUU0Qjs7QUFGNUIsR0FGQztBQU1iQyxXQUFTLEVBQUU7QUFDVCx5QkFBcUIsTUFEWjtBQUNvQjtBQUM3Qiw0QkFBd0IsTUFGZjtBQUV1QjtBQUNoQywrQkFBMkIsTUFIbEI7QUFHMEI7QUFDbkMsc0JBQWtCLE1BSlQsQ0FJaUI7O0FBSmpCLEdBTkU7QUFZYnBCLFVBQVEsRUFBRSxDQUNSO0FBQ0V6RCxNQUFFLEVBQUUsc0JBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDdUcsT0FBTCxHQUFldkcsSUFBSSxDQUFDdUcsT0FBTCxJQUFnQixFQUEvQjtBQUNBdkcsVUFBSSxDQUFDdUcsT0FBTCxDQUFhdEYsSUFBYixDQUFrQmhCLE9BQU8sQ0FBQ3FDLE1BQTFCO0FBQ0Q7QUFOSCxHQURRLEVBU1I7QUFDRTtBQUNBM0IsTUFBRSxFQUFFLHNCQUZOO0FBR0VFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBSFo7QUFJRXhGLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUJELElBQUksQ0FBQ3VHLE9BQUwsQ0FBYWpHLFFBQWIsQ0FBc0JMLE9BQU8sQ0FBQ3FDLE1BQTlCLENBSmhDO0FBS0VqQixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTEMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFGVjtBQUdMUyxZQUFJLEVBQUU7QUFDSkMsWUFBRSxFQUFFLGlCQURBO0FBRUpJLFlBQUUsRUFBRSxpQkFGQTtBQUdKQyxZQUFFLEVBQUUsNkJBSEE7QUFJSkMsWUFBRSxFQUFFLFVBSkE7QUFLSkMsWUFBRSxFQUFFO0FBTEE7QUFIRCxPQUFQO0FBV0Q7QUFqQkgsR0FUUSxFQTRCUjtBQUNFNUMsTUFBRSxFQUFFLHNCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRXhDLGdCQUFZLEVBQUUsRUFIaEI7QUFJRUUsbUJBQWUsRUFBRSxDQUpuQjtBQUtFTCxPQUFHLEVBQUdmLElBQUQsSUFBVTtBQUNiLGFBQU9BLElBQUksQ0FBQ3VHLE9BQVo7QUFDRDtBQVBILEdBNUJRO0FBWkcsQ0FBZixFOztBQ0xBO0FBQ0E7QUFFQSxnREFBZTtBQUNickMsUUFBTSxFQUFFQyx3Q0FESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsNkJBQXlCLE1BRGY7QUFDdUI7QUFDakMseUJBQXFCLE1BRlg7QUFFbUI7QUFDN0IsOEJBQTBCLE1BSGhCO0FBR3dCO0FBQ2xDLDhCQUEwQixNQUpoQjtBQUl3QjtBQUNsQyw4QkFBMEIsTUFMaEI7QUFLd0I7QUFDbEMsaUNBQTZCLE1BTm5CO0FBTTJCO0FBQ3JDLDRCQUF3QixNQVBkO0FBT3NCO0FBQ2hDLHlDQUFxQyxNQVIzQjtBQVFtQztBQUM3Qyw2Q0FBeUMsTUFUL0I7QUFTdUM7QUFDakQsaUNBQTZCLE1BVm5CO0FBVTJCO0FBQ3JDLHlCQUFxQixNQVhYO0FBV21CO0FBQzdCLDZCQUF5QixNQVpmO0FBWXVCO0FBQ2pDLG9DQUFnQyxNQWJ0QjtBQWE4QjtBQUN4QyxvQ0FBZ0MsTUFkdEI7QUFjOEI7QUFDeEMsaUNBQTZCLE1BZm5CO0FBZTJCO0FBQ3JDLGlDQUE2QixNQWhCbkI7QUFnQjJCO0FBQ3JDLGlDQUE2QixNQWpCbkIsQ0FpQjJCOztBQWpCM0IsR0FGQztBQXFCYkMsV0FBUyxFQUFFO0FBQ1QsNkJBQXlCLE1BRGhCO0FBRVQsaUNBQTZCLE1BRnBCO0FBR1Qsb0NBQWdDLE1BSHZCO0FBSVQsb0NBQWdDO0FBSnZCLEdBckJFO0FBMkJicEIsVUFBUSxFQUFFLENBQ1I7QUFDRTtBQUNBO0FBQ0F6RCxNQUFFLEVBQUUsNEJBSE47QUFJRTtBQUNBRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUxaO0FBTUVyQyxXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNvRjtBQUFyRCxPQUFQO0FBQ0Q7QUFSSCxHQURRO0FBM0JHLENBQWYsRTs7QUNIQTtDQUdBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLE1BQU1tQixXQUFXLEdBQUk5RixJQUFELElBQVU7QUFDNUIsTUFBSSxDQUFDQSxJQUFJLENBQUNxRCxTQUFWLEVBQ0U5QixPQUFPLENBQUNDLEtBQVIsQ0FBYyxxQkFBcUJ5QixJQUFJLENBQUNDLFNBQUwsQ0FBZWxELElBQWYsQ0FBbkM7QUFDRixTQUFPO0FBQ0xDLE1BQUUsRUFBRUQsSUFBSSxDQUFDQyxFQURKO0FBRUxFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUVELElBQUksQ0FBQ3FEO0FBQVgsS0FBdkIsQ0FGTDtBQUdMakQsYUFBUyxFQUFFLENBQUN1RCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CQSxPQUFPLENBQUN3RyxLQUFSLENBQWNDLE1BQWQsQ0FBcUIsQ0FBQyxDQUF0QixNQUE2QixJQUh2RDtBQUlMckYsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDa0Y7QUFBckQsT0FBUDtBQUNEO0FBTkksR0FBUDtBQVFELENBWEQ7O0FBYUEscURBQWU7QUFDYmpCLFFBQU0sRUFBRUMsa0RBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLHlCQUFxQixNQURYO0FBQ21CO0FBQzdCLHVCQUFtQixNQUZUO0FBRWlCO0FBQzNCLDRCQUF3QixNQUhkO0FBR3NCO0FBQ2hDLDRCQUF3QixNQUpkO0FBSXNCO0FBQ2hDLDhCQUEwQixNQUxoQjtBQUt3QjtBQUNsQyx1QkFBbUIsTUFOVDtBQU1pQjtBQUMzQixzQkFBa0IsTUFQUjtBQU9nQjtBQUMxQixvQkFBZ0IsTUFSTjtBQVFjO0FBQ3hCLDJCQUF1QixNQVRiO0FBU3FCO0FBQy9CLDJCQUF1QixLQVZiO0FBVW9CO0FBQzlCLDhCQUEwQixNQVhoQjtBQVd3QjtBQUNsQyx3QkFBb0IsTUFaVjtBQVlrQjtBQUM1Qiw2QkFBeUIsTUFiZjtBQWF1QjtBQUNqQyw2QkFBeUIsTUFkZjtBQWN1QjtBQUNqQyw2QkFBeUIsTUFmZjtBQWV1QjtBQUNqQyx5QkFBcUIsTUFoQlg7QUFnQm1CO0FBQzdCLHlCQUFxQixNQWpCWDtBQWlCbUI7QUFDN0IsNkJBQXlCLE1BbEJmO0FBa0J1QjtBQUNqQyw2QkFBeUIsTUFuQmY7QUFtQnVCO0FBQ2pDLG9CQUFnQixNQXBCTjtBQW9CYztBQUN4QiwyQkFBdUIsTUFyQmI7QUFxQnFCO0FBQy9CLGlDQUE2QixNQXRCbkI7QUFzQjJCO0FBQ3JDLHNCQUFrQixNQXZCUjtBQXVCZ0I7QUFDMUIscUJBQWlCLE1BeEJQO0FBd0JlO0FBQ3pCLDZCQUF5QixNQXpCZjtBQXlCdUI7QUFDakMscUNBQWlDLE1BMUJ2QixDQTBCK0I7O0FBMUIvQixHQUZDO0FBOEJiQyxXQUFTLEVBQUU7QUFDVCwwQkFBc0IsTUFEYjtBQUNxQjtBQUM5QixtQ0FBK0IsTUFGdEI7QUFFOEI7QUFDdkMsdUJBQW1CLE1BSFYsQ0FHa0I7O0FBSGxCLEdBOUJFO0FBbUNiRSxpQkFBZSxFQUFFO0FBQ2YsdUJBQW1CLElBREosQ0FDVTs7QUFEVixHQW5DSjtBQXNDYkMsaUJBQWUsRUFBRTtBQUNmLHNCQUFrQixLQURILENBQ1U7O0FBRFYsR0F0Q0o7QUF5Q2J2QixVQUFRLEVBQUUsQ0FDUjtBQUNBb0MsYUFBVyxDQUFDO0FBQUU3RixNQUFFLEVBQUUsdUJBQU47QUFBK0JvRCxhQUFTLEVBQUU7QUFBMUMsR0FBRCxDQUZILEVBR1I7QUFDQXlDLGFBQVcsQ0FBQztBQUFFN0YsTUFBRSxFQUFFLHVCQUFOO0FBQStCb0QsYUFBUyxFQUFFO0FBQTFDLEdBQUQsQ0FKSCxFQUtSO0FBQ0F5QyxhQUFXLENBQUM7QUFBRTdGLE1BQUUsRUFBRSx1QkFBTjtBQUErQm9ELGFBQVMsRUFBRTtBQUExQyxHQUFELENBTkgsRUFPUjtBQUNBeUMsYUFBVyxDQUFDO0FBQUU3RixNQUFFLEVBQUUsbUJBQU47QUFBMkJvRCxhQUFTLEVBQUU7QUFBdEMsR0FBRCxDQVJILEVBU1I7QUFDQXlDLGFBQVcsQ0FBQztBQUFFN0YsTUFBRSxFQUFFLG1CQUFOO0FBQTJCb0QsYUFBUyxFQUFFO0FBQXRDLEdBQUQsQ0FWSCxFQVdSO0FBQ0F5QyxhQUFXLENBQUM7QUFBRTdGLE1BQUUsRUFBRSx1QkFBTjtBQUErQm9ELGFBQVMsRUFBRTtBQUExQyxHQUFELENBWkgsRUFhUjtBQUNBeUMsYUFBVyxDQUFDO0FBQUU3RixNQUFFLEVBQUUsbUJBQU47QUFBMkJvRCxhQUFTLEVBQUU7QUFBdEMsR0FBRCxDQWRILEVBZVI7QUFDQXlDLGFBQVcsQ0FBQztBQUFFN0YsTUFBRSxFQUFFLGdCQUFOO0FBQXdCb0QsYUFBUyxFQUFFO0FBQW5DLEdBQUQsQ0FoQkgsRUFpQlI7QUFDQXlDLGFBQVcsQ0FBQztBQUFFN0YsTUFBRSxFQUFFLGNBQU47QUFBc0JvRCxhQUFTLEVBQUU7QUFBakMsR0FBRCxDQWxCSCxFQW1CUjtBQUNBeUMsYUFBVyxDQUFDO0FBQUU3RixNQUFFLEVBQUUscUJBQU47QUFBNkJvRCxhQUFTLEVBQUU7QUFBeEMsR0FBRCxDQXBCSDtBQXpDRyxDQUFmLEU7O0FDekJBO0FBQ0E7QUFFQSxvREFBZTtBQUNiRyxRQUFNLEVBQUVDLGdEQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVixrQ0FBOEIsTUFEcEI7QUFDNEI7QUFDdEMseUNBQXFDLE1BRjNCO0FBRW1DO0FBRTdDLDhCQUEwQixNQUpoQjtBQUl3QjtBQUNsQyxpQ0FBNkIsTUFMbkI7QUFLMkI7QUFDckMsaUNBQTZCLE1BTm5CO0FBTTJCO0FBRXJDLHFDQUFpQyxNQVJ2QjtBQVErQjtBQUN6QyxnQ0FBNEIsTUFUbEI7QUFTMEI7QUFFcEMscUNBQWlDLE1BWHZCO0FBVytCO0FBQ3pDLG1DQUErQixNQVpyQjtBQVk2QjtBQUN2QyxxQ0FBaUMsTUFidkI7QUFhK0I7QUFFekMsbUNBQStCLE1BZnJCO0FBZTZCO0FBQ3ZDLGdDQUE0QixNQWhCbEI7QUFnQjBCO0FBRXBDLDhCQUEwQixNQWxCaEI7QUFrQndCO0FBQ2xDLCtCQUEyQixNQW5CakI7QUFtQnlCO0FBQ25DLGdDQUE0QixNQXBCbEIsQ0FvQjBCOztBQXBCMUIsR0FGQztBQXlCYkMsV0FBUyxFQUFFO0FBQ1QsMkJBQXVCLE1BRGQ7QUFDc0I7QUFDL0Isc0NBQWtDLE1BRnpCLENBRWlDOztBQUZqQyxHQXpCRTtBQTZCYnBCLFVBQVEsRUFBRSxDQUNSO0FBQ0U7QUFDQXpELE1BQUUsRUFBRSwwQkFGTjtBQUdFRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFO0FBQU4sS0FBbkIsQ0FIWjtBQUlFRyxhQUFTLEVBQUUsQ0FBQ3VELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0JBLE9BQU8sQ0FBQzRDLElBQVIsS0FBaUIsSUFKbEQ7QUFJd0Q7QUFDdER4QixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTEMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFGVjtBQUdMUyxZQUFJLEVBQUU7QUFDSkMsWUFBRSxFQUFHLEdBQUUvQyxPQUFPLENBQUNrRixPQUFRLFVBRG5CO0FBRUovQixZQUFFLEVBQUcsR0FBRW5ELE9BQU8sQ0FBQ2tGLE9BQVEsV0FGbkI7QUFHSjlCLFlBQUUsRUFBRyxHQUFFcEQsT0FBTyxDQUFDa0YsT0FBUSxZQUhuQjtBQUlKN0IsWUFBRSxFQUFHLEdBQUVyRCxPQUFPLENBQUNrRixPQUFRLE9BSm5CO0FBS0o1QixZQUFFLEVBQUcsR0FBRXRELE9BQU8sQ0FBQ2tGLE9BQVEsT0FMbkI7QUFNSjNCLFlBQUUsRUFBRyxHQUFFdkQsT0FBTyxDQUFDa0YsT0FBUTtBQU5uQjtBQUhELE9BQVA7QUFZRDtBQWxCSCxHQURRO0FBN0JHLENBQWYsRTs7QUNIQTtBQUVBLHVEQUFlO0FBQ2JqQixRQUFNLEVBQUVDLDhFQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVixrQ0FBOEIsTUFEcEI7QUFDNEI7QUFDdEMscUNBQWlDLE1BRnZCO0FBRStCO0FBQ3pDLHNDQUFrQyxNQUh4QjtBQUdnQztBQUMxQyxtQ0FBK0IsTUFKckI7QUFJNkI7QUFDdkMsb0NBQWdDLE1BTHRCO0FBSzhCO0FBQ3hDLDBDQUFzQyxNQU41QjtBQU1vQztBQUM5QyxxQ0FBaUMsTUFQdkI7QUFPK0I7QUFDekMsa0NBQThCLE1BUnBCO0FBUTRCO0FBQ3RDLHlDQUFxQyxNQVQzQjtBQVNtQztBQUM3Qyx5Q0FBcUMsTUFWM0I7QUFVbUM7QUFDN0Msd0NBQW9DLE1BWDFCO0FBV2tDO0FBQzVDLGtDQUE4QixNQVpwQjtBQVk0QjtBQUN0QywyQ0FBdUMsTUFiN0I7QUFhcUM7QUFDL0MsdUNBQW1DLE1BZHpCO0FBY2lDO0FBQzNDLG1DQUErQixNQWZyQixDQWU2Qjs7QUFmN0IsR0FGQztBQW1CYkMsV0FBUyxFQUFFO0FBQ1QsZ0NBQTRCLE1BRG5CO0FBQzJCO0FBQ3BDLHFDQUFpQyxNQUZ4QixDQUVnQzs7QUFGaEMsR0FuQkU7QUF1QmJFLGlCQUFlLEVBQUU7QUFDZixnQ0FBNEIsS0FEYjtBQUNvQjtBQUNuQywrQkFBMkIsSUFGWjtBQUVrQjtBQUNqQyx3Q0FBb0MsS0FIckI7QUFHNEI7QUFDM0MsaUNBQTZCLEtBSmQ7QUFJcUI7QUFDcEMsbUNBQStCLEtBTGhCLENBS3VCOztBQUx2QixHQXZCSjtBQThCYmlCLFVBQVEsRUFBRTtBQUNSLHFDQUFpQyxNQUR6QixDQUNpQzs7QUFEakM7QUE5QkcsQ0FBZixFOztBQ0ZBO0FBQ0E7QUFFQSx1REFBZTtBQUNiekMsUUFBTSxFQUFFQyw0REFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1Ysb0NBQWdDLE1BRHRCO0FBQzhCO0FBQ3hDLG9DQUFnQyxNQUZ0QjtBQUU4QjtBQUV4QyxvQ0FBZ0MsTUFKdEI7QUFJOEI7QUFDeEMsdUNBQW1DLE1BTHpCO0FBS2lDO0FBQzNDLG9DQUFnQyxNQU50QjtBQU04QjtBQUV4QywrQkFBMkIsTUFSakI7QUFReUI7QUFDbkMsbUNBQStCLE1BVHJCO0FBUzZCO0FBRXZDLHVDQUFtQyxNQVh6QjtBQVdpQztBQUMzQyx1Q0FBbUMsTUFaekI7QUFZaUM7QUFDM0Msa0NBQThCLE1BYnBCO0FBYTRCO0FBRXRDLG9DQUFnQyxNQWZ0QjtBQWU4QjtBQUN4QyxvQ0FBZ0MsTUFoQnRCO0FBZ0I4QjtBQUN4QyxtQ0FBK0IsTUFqQnJCO0FBaUI2QjtBQUV2QyxvQ0FBZ0MsTUFuQnRCO0FBbUI4QjtBQUN4QyxvQ0FBZ0MsTUFwQnRCO0FBb0I4QjtBQUN4QyxvQ0FBZ0MsTUFyQnRCO0FBcUI4QjtBQUN4QyxvQ0FBZ0MsTUF0QnRCO0FBc0I4QjtBQUN4Qyx3Q0FBb0MsTUF2QjFCLENBdUJrQzs7QUF2QmxDLEdBRkM7QUEyQmJDLFdBQVMsRUFBRTtBQUNULCtCQUEyQixNQURsQjtBQUMwQjtBQUNuQyx1Q0FBbUMsTUFGMUI7QUFFa0M7QUFDM0MscUNBQWlDLE1BSHhCO0FBR2dDO0FBQ3pDLHVDQUFtQyxNQUoxQixDQUlrQzs7QUFKbEMsR0EzQkU7QUFpQ2JFLGlCQUFlLEVBQUU7QUFDZixpQ0FBNkIsS0FEZDtBQUNxQjtBQUNwQyxpQ0FBNkIsTUFGZCxDQUVzQjs7QUFGdEIsR0FqQ0o7QUFxQ2J0QixVQUFRLEVBQUUsQ0FDUjtBQUNFO0FBQ0F6RCxNQUFFLEVBQUUsa0NBRk47QUFHRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FIWjtBQUlFa0MsZUFBVyxFQUFFLENBQUN2QixLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQy9CLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUZUO0FBR0x1RCxjQUFNLEVBQUU1RixPQUFPLENBQUNvRjtBQUhYLE9BQVA7QUFLRDtBQVZILEdBRFEsRUFhUjtBQUNFO0FBQ0ExRSxNQUFFLEVBQUUsMkNBRk47QUFHRUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWxELFFBQUUsRUFBRSxDQUFDLE1BQUQsRUFBUyxNQUFULENBQU47QUFBd0JrQixZQUFNLEVBQUUsQ0FBQyxnQkFBRCxFQUFtQixvQkFBbkI7QUFBaEMsS0FBbkIsQ0FIWjtBQUlFZixhQUFTLEVBQUUsQ0FBQ3VELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0JBLE9BQU8sQ0FBQzRDLElBQVIsS0FBaUIsSUFKbEQ7QUFJd0Q7QUFDdER4QixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTEMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFGVjtBQUdMUyxZQUFJLEVBQUU7QUFDSkMsWUFBRSxFQUFHLEdBQUUvQyxPQUFPLENBQUNrRixPQUFRLFVBRG5CO0FBRUovQixZQUFFLEVBQUcsR0FBRW5ELE9BQU8sQ0FBQ2tGLE9BQVEsV0FGbkI7QUFHSjlCLFlBQUUsRUFBRyxHQUFFcEQsT0FBTyxDQUFDa0YsT0FBUSxZQUhuQjtBQUlKN0IsWUFBRSxFQUFHLEdBQUVyRCxPQUFPLENBQUNrRixPQUFRLE9BSm5CO0FBS0o1QixZQUFFLEVBQUcsR0FBRXRELE9BQU8sQ0FBQ2tGLE9BQVEsT0FMbkI7QUFNSjNCLFlBQUUsRUFBRyxHQUFFdkQsT0FBTyxDQUFDa0YsT0FBUTtBQU5uQjtBQUhELE9BQVA7QUFZRDtBQWxCSCxHQWJRO0FBckNHLENBQWYsRTs7QUNIQTtBQUVBLHlEQUFlO0FBQ2JqQixRQUFNLEVBQUVDLDREQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVix5QkFBcUIsTUFEWDtBQUNtQjtBQUM3Qiw2QkFBeUIsTUFGZjtBQUV1QjtBQUNqQywyQkFBdUIsTUFIYjtBQUdxQjtBQUMvQiw2QkFBeUIsTUFKZjtBQUl1QjtBQUNqQywyQkFBdUIsTUFMYjtBQUtxQjtBQUMvQixvQkFBZ0IsTUFOTjtBQU1jO0FBQ3hCLDRCQUF3QixNQVBkO0FBT3NCO0FBQ2hDLG9CQUFnQixFQVJOO0FBUVU7QUFDcEIsdUJBQW1CLE1BVFQ7QUFTaUI7QUFDM0Isd0JBQW9CLE1BVlY7QUFVa0I7QUFDNUIsMEJBQXNCLEtBWFo7QUFXbUI7QUFDN0IsdUJBQW1CLE1BWlQ7QUFZaUI7QUFDM0IsNkJBQXlCLE1BYmY7QUFhdUI7QUFDakMsMEJBQXNCLE1BZFo7QUFjb0I7QUFDOUIsMEJBQXNCLE1BZlosQ0Flb0I7O0FBZnBCLEdBRkM7QUFtQmJDLFdBQVMsRUFBRTtBQUNULDZCQUF5QixNQURoQixDQUN3Qjs7QUFEeEI7QUFuQkUsQ0FBZixFOztBQ0ZBO0FBRUEsK0NBQWU7QUFDYnRCLFFBQU0sRUFBRUMsc0NBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLDZCQUF5QixNQURmO0FBQ3VCO0FBQ2pDLGdDQUE0QixNQUZsQjtBQUUwQjtBQUNwQyw2QkFBeUIsTUFIZjtBQUd1QjtBQUNqQywwQkFBc0IsTUFKWjtBQUlvQjtBQUM5QiwwQkFBc0IsTUFMWjtBQUtvQjtBQUM5QiwyQkFBdUIsTUFOYjtBQU1xQjtBQUMvQixxQ0FBaUMsTUFQdkI7QUFPK0I7QUFDekMsbUNBQStCLE1BUnJCO0FBUTZCO0FBQ3ZDLDBCQUFzQixNQVRaO0FBU29CO0FBQzlCLDhCQUEwQixNQVZoQjtBQVV3QjtBQUNsQyx3QkFBb0IsTUFYVjtBQVdrQjtBQUM1Qiw2QkFBeUIsTUFaZjtBQVl1QjtBQUNqQyw4QkFBMEIsTUFiaEI7QUFhd0I7QUFDbEMsOEJBQTBCLE1BZGhCO0FBY3dCO0FBQ2xDLHlCQUFxQixNQWZYO0FBZW1CO0FBQzdCLDRCQUF3QixNQWhCZDtBQWdCc0I7QUFDaEMseUJBQXFCLE1BakJYO0FBaUJtQjtBQUM3Qiw2QkFBeUIsTUFsQmY7QUFrQnVCO0FBQ2pDLDRCQUF3QixNQW5CZDtBQW1Cc0I7QUFDaEMsNEJBQXdCLE1BcEJkO0FBb0JzQjtBQUNoQyw0QkFBd0IsTUFyQmQ7QUFxQnNCO0FBQ2hDLDRCQUF3QixNQXRCZDtBQXNCc0I7QUFDaEMsNEJBQXdCLE1BdkJkO0FBdUJzQjtBQUNoQywwQkFBc0IsTUF4QlosQ0F3Qm9COztBQXhCcEIsR0FGQztBQTRCYkUsWUFBVSxFQUFFO0FBQ1YseUJBQXFCLE1BRFgsQ0FDbUI7O0FBRG5CLEdBNUJDO0FBK0JiRCxXQUFTLEVBQUU7QUFDVCx5QkFBcUIsTUFEWjtBQUNvQjtBQUM3Qiw0QkFBd0IsTUFGZjtBQUV1QjtBQUNoQyxvQ0FBZ0MsTUFIdkI7QUFHK0I7QUFDeEMsNkJBQXlCLE1BSmhCLENBSXdCOztBQUp4QixHQS9CRTtBQXFDYkUsaUJBQWUsRUFBRTtBQUNmLHVCQUFtQixJQURKO0FBQ1U7QUFDekIsaUNBQTZCLEtBRmQsQ0FFcUI7O0FBRnJCO0FBckNKLENBQWYsRTs7Q0NBQTs7QUFDQSwwQ0FBZTtBQUNieEIsUUFBTSxFQUFFQyxrREFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsZ0JBQVksTUFERjtBQUNVO0FBQ3BCLGlCQUFhLE1BRkgsQ0FFVzs7QUFGWCxHQUZDO0FBTWJDLFdBQVMsRUFBRTtBQUNULHFCQUFpQixNQURSLENBQ2dCOztBQURoQjtBQU5FLENBQWYsRTs7QUNIQTtBQUNBO0NBSUE7O0FBQ0EsMENBQWU7QUFDYnRCLFFBQU0sRUFBRUMsa0RBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLHNCQUFrQixNQURSO0FBQ2dCO0FBQzFCLG1CQUFlLE1BRkwsQ0FFYTs7QUFGYixHQUZDO0FBTWJDLFdBQVMsRUFBRTtBQUNULDJCQUF1QixNQURkLENBQ3NCOztBQUR0QixHQU5FO0FBU2JwQixVQUFRLEVBQUUsQ0FDUjtBQUNFO0FBQ0E7QUFDQXpELE1BQUUsRUFBRSxtQkFITjtBQUlFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUpaO0FBS0U7QUFDQTtBQUNBdEMsbUJBQWUsRUFBRSxFQVBuQjtBQVFFQyxXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNvRjtBQUFyRCxPQUFQO0FBQ0Q7QUFWSCxHQURRLEVBYVI7QUFDRTFFLE1BQUUsRUFBRSxnQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBYyxTQUFHMkYsdUNBQWtCQTtBQUFuQyxLQUF2QixDQUZaO0FBR0U7QUFDQXhGLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUJELElBQUksQ0FBQ29GLGlCQUFMLENBQXVCbkYsT0FBdkIsSUFBa0MsQ0FKbEU7QUFLRW9CLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ2tGO0FBQXJELE9BQVA7QUFDRDtBQVBILEdBYlE7QUFURyxDQUFmLEU7O0FDTkE7Q0FHQTs7QUFDQSwwQ0FBZTtBQUNiakIsUUFBTSxFQUFFQyxrREFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsK0JBQTJCLE1BRGpCO0FBQ3lCO0FBQ25DLG1DQUErQixNQUZyQjtBQUU2QjtBQUN2QyxrQ0FBOEIsTUFIcEI7QUFHNEI7QUFDdEMsd0JBQW9CLE1BSlY7QUFJa0I7QUFDNUIseUJBQXFCLE1BTFg7QUFLbUI7QUFDN0IsdUJBQW1CLE1BTlQ7QUFNaUI7QUFDM0Isa0JBQWMsTUFQSixDQU9ZOztBQVBaLEdBRkM7QUFXYkUsWUFBVSxFQUFFO0FBQ1YsbUJBQWUsTUFETCxDQUNhOztBQURiLEdBWEM7QUFjYkQsV0FBUyxFQUFFO0FBQ1QscUJBQWlCLElBRFIsQ0FDYzs7QUFEZCxHQWRFO0FBaUJicEIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSxtQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBY2tCLFlBQU0sRUFBRSxlQUF0QjtBQUF1QytFLGFBQU8sRUFBRTtBQUFoRCxLQUF2QixDQUZaO0FBR0VDLGNBQVUsRUFBRWhELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFja0IsWUFBTSxFQUFFLGVBQXRCO0FBQXVDK0UsYUFBTyxFQUFFO0FBQWhELEtBQXZCLENBSGQ7QUFJRWxDLGNBQVUsRUFBRWIsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWNrQixZQUFNLEVBQUUsY0FBdEI7QUFBc0MrRSxhQUFPLEVBQUU7QUFBL0MsS0FBdkIsQ0FKZDtBQUtFakMsY0FBVSxFQUFFZCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBY2tCLFlBQU0sRUFBRSxVQUF0QjtBQUFrQytFLGFBQU8sRUFBRTtBQUEzQyxLQUF2QixDQUxkO0FBTUVoQyxjQUFVLEVBQUVmLGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFja0IsWUFBTSxFQUFFLFFBQXRCO0FBQWdDK0UsYUFBTyxFQUFFO0FBQXpDLEtBQXZCLENBTmQ7QUFPRS9CLGNBQVUsRUFBRWhCLGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFja0IsWUFBTSxFQUFFLFNBQXRCO0FBQWlDK0UsYUFBTyxFQUFFO0FBQTFDLEtBQXZCLENBUGQ7QUFRRTdGLE9BQUcsRUFBR2YsSUFBRCxJQUFVO0FBQ2JBLFVBQUksQ0FBQzhHLFdBQUwsSUFBb0IsQ0FBcEI7QUFDRDtBQVZILEdBRFEsRUFhUjtBQUNFO0FBQ0E7QUFDQW5HLE1BQUUsRUFBRSxrQkFITjtBQUlFRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFLEtBQU47QUFBYWtCLFlBQU0sRUFBRSxlQUFyQjtBQUFzQytFLGFBQU8sRUFBRTtBQUEvQyxLQUFuQixDQUpaO0FBS0VDLGNBQVUsRUFBRWhELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUUsS0FBTjtBQUFha0IsWUFBTSxFQUFFLGVBQXJCO0FBQXNDK0UsYUFBTyxFQUFFO0FBQS9DLEtBQW5CLENBTGQ7QUFNRWxDLGNBQVUsRUFBRWIseUNBQUEsQ0FBbUI7QUFBRWxELFFBQUUsRUFBRSxLQUFOO0FBQWFrQixZQUFNLEVBQUUsY0FBckI7QUFBcUMrRSxhQUFPLEVBQUU7QUFBOUMsS0FBbkIsQ0FOZDtBQU9FakMsY0FBVSxFQUFFZCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFLEtBQU47QUFBYWtCLFlBQU0sRUFBRSxVQUFyQjtBQUFpQytFLGFBQU8sRUFBRTtBQUExQyxLQUFuQixDQVBkO0FBUUVoQyxjQUFVLEVBQUVmLHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUUsS0FBTjtBQUFha0IsWUFBTSxFQUFFLFFBQXJCO0FBQStCK0UsYUFBTyxFQUFFO0FBQXhDLEtBQW5CLENBUmQ7QUFTRS9CLGNBQVUsRUFBRWhCLHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUUsS0FBTjtBQUFha0IsWUFBTSxFQUFFLFNBQXJCO0FBQWdDK0UsYUFBTyxFQUFFO0FBQXpDLEtBQW5CLENBVGQ7QUFVRTlGLGFBQVMsRUFBR2QsSUFBRCxJQUFVLENBQUNBLElBQUksQ0FBQytHLFdBVjdCO0FBV0VoRyxPQUFHLEVBQUdmLElBQUQsSUFBVTtBQUNiQSxVQUFJLENBQUNnSCxTQUFMLEdBQWlCLENBQWpCLENBRGEsQ0FFYjtBQUNBO0FBQ0E7QUFDQTs7QUFDQWhILFVBQUksQ0FBQzhHLFdBQUwsR0FBbUIsQ0FBbkI7QUFDQTlHLFVBQUksQ0FBQytHLFdBQUwsR0FBbUIsSUFBbkI7QUFDRDtBQW5CSCxHQWJRLEVBa0NSO0FBQ0VwRyxNQUFFLEVBQUUsWUFETjtBQUVFRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFO0FBQU4sS0FBbkIsQ0FGWjtBQUdFRyxhQUFTLEVBQUUsQ0FBQ2QsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQzVCO0FBQ0E7QUFDQSxhQUFPLEVBQUVELElBQUksQ0FBQzhHLFdBQUwsS0FBcUIsQ0FBckIsSUFBMEI5RyxJQUFJLENBQUNnSCxTQUFMLEdBQWlCLENBQWpCLEtBQXVCLENBQW5ELEtBQXlEL0csT0FBTyxDQUFDZ0gsUUFBUixLQUFxQixVQUFyRjtBQUNELEtBUEg7QUFRRTVGLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ2tGO0FBQXJELE9BQVA7QUFDRDtBQVZILEdBbENRLEVBOENSO0FBQ0U7QUFDQTtBQUNBeEUsTUFBRSxFQUFFLGNBSE47QUFJRTtBQUNBRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFO0FBQU4sS0FBbkIsQ0FMWjtBQU1FO0FBQ0FHLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUJELElBQUksQ0FBQ29GLGlCQUFMLENBQXVCbkYsT0FBdkIsSUFBa0MsQ0FQbEU7QUFRRW9CLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ2tGO0FBQXJELE9BQVA7QUFDRCxLQVZIO0FBV0VwRSxPQUFHLEVBQUdmLElBQUQsSUFBVTtBQUNiQSxVQUFJLENBQUNnSCxTQUFMLElBQWtCLENBQWxCO0FBQ0Q7QUFiSCxHQTlDUTtBQWpCRyxDQUFmLEU7O0FDSkE7QUFDQTtDQUdBOztBQUNBLDBDQUFlO0FBQ2I5QyxRQUFNLEVBQUVDLGtEQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVix3QkFBb0IsTUFEVjtBQUNrQjtBQUM1QixpQ0FBNkIsTUFGbkI7QUFFMkI7QUFDckMseUJBQXFCLE1BSFg7QUFHbUI7QUFDN0Isb0JBQWdCLE1BSk47QUFJYztBQUN4Qix1QkFBbUIsTUFMVCxDQUtpQjs7QUFMakIsR0FGQztBQVNiQyxXQUFTLEVBQUU7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXFCLE1BTlo7QUFPVCwwQkFBc0IsTUFQYixDQU9xQjs7QUFQckIsR0FURTtBQWtCYnBCLFVBQVEsRUFBRSxDQUNSO0FBQ0V6RCxNQUFFLEVBQUUsVUFETjtBQUNrQjtBQUNoQkUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFa0MsZUFBVyxFQUFFLENBQUN2QixLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQy9CLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUZUO0FBR0x1RCxjQUFNLEVBQUU7QUFDTjdDLFlBQUUsRUFBRSx3QkFERTtBQUVOSSxZQUFFLEVBQUUsMkJBRkU7QUFHTkMsWUFBRSxFQUFFLG1DQUhFO0FBSU5DLFlBQUUsRUFBRSxNQUpFO0FBS05DLFlBQUUsRUFBRTtBQUxFO0FBSEgsT0FBUDtBQVdEO0FBZkgsR0FEUSxFQWtCUjtBQUNFO0FBQ0E1QyxNQUFFLEVBQUUsaUJBRk47QUFHRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWMsU0FBRzJGLHVDQUFrQkE7QUFBbkMsS0FBdkIsQ0FIWjtBQUlFVixlQUFXLEVBQUUsQ0FBQ3ZCLEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDL0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTG5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BRlQ7QUFHTHVELGNBQU0sRUFBRTtBQUNON0MsWUFBRSxFQUFFLGFBREU7QUFFTkksWUFBRSxFQUFFLG1CQUZFO0FBR05DLFlBQUUsRUFBRSxtQkFIRTtBQUlOQyxZQUFFLEVBQUUsS0FKRTtBQUtOQyxZQUFFLEVBQUU7QUFMRTtBQUhILE9BQVA7QUFXRDtBQWhCSCxHQWxCUSxFQW9DUjtBQUNFNUMsTUFBRSxFQUFFLHdCQUROO0FBQ2dDO0FBQzlCRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0VyQyxXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNvRjtBQUFyRCxPQUFQO0FBQ0Q7QUFMSCxHQXBDUTtBQWxCRyxDQUFmLEU7O0FDTEE7QUFDQTtDQUlBOztBQUNBLDBDQUFlO0FBQ2JuQixRQUFNLEVBQUVDLDhEQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViw0QkFBd0IsTUFEZDtBQUVWLDhCQUEwQixNQUZoQjtBQUdWLHNCQUFrQjtBQUhSLEdBRkM7QUFPYkUsWUFBVSxFQUFFO0FBQ1YseUJBQXFCO0FBRFgsR0FQQztBQVVickIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSxzQkFETjtBQUVFRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBY2lHLGFBQU8sRUFBRTtBQUF2QixLQUFuQixDQUZaO0FBR0U3RixPQUFHLEVBQUdmLElBQUQsSUFBVTtBQUNiQSxVQUFJLENBQUNrSCx1QkFBTCxHQUErQixJQUEvQjtBQUNEO0FBTEgsR0FEUSxFQVFSO0FBQ0V2RyxNQUFFLEVBQUUsa0JBRE47QUFFRUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWNpRyxhQUFPLEVBQUU7QUFBdkIsS0FBbkIsQ0FGWjtBQUdFN0YsT0FBRyxFQUFHZixJQUFELElBQVU7QUFDYkEsVUFBSSxDQUFDa0gsdUJBQUwsR0FBK0IsS0FBL0I7QUFDRDtBQUxILEdBUlEsRUFlUjtBQUNFdkcsTUFBRSxFQUFFLGVBRE47QUFFRUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWNpRyxhQUFPLEVBQUU7QUFBdkIsS0FBbkIsQ0FGWjtBQUdFN0YsT0FBRyxFQUFHZixJQUFELElBQVU7QUFDYkEsVUFBSSxDQUFDbUgsWUFBTCxHQUFvQixJQUFwQjtBQUNEO0FBTEgsR0FmUSxFQXNCUjtBQUNFeEcsTUFBRSxFQUFFLG1CQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBRlo7QUFHRTtBQUNBeEYsYUFBUyxFQUFHZCxJQUFELElBQVUsQ0FBQ0EsSUFBSSxDQUFDa0gsdUJBSjdCO0FBS0U3RixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNtSDtBQUFyRCxPQUFQO0FBQ0Q7QUFQSCxHQXRCUSxFQStCUjtBQUNFekcsTUFBRSxFQUFFLGtCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBRlo7QUFHRTtBQUNBeEYsYUFBUyxFQUFHZCxJQUFELElBQVVBLElBQUksQ0FBQ2tILHVCQUo1QjtBQUtFN0YsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDbUg7QUFBckQsT0FBUDtBQUNEO0FBUEgsR0EvQlEsRUF3Q1I7QUFDRXpHLE1BQUUsRUFBRSxnQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0VyQyxXQUFPLEVBQUUsQ0FBQ3JCLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUMxQjtBQUNBLFVBQUlELElBQUksQ0FBQ21ILFlBQVQsRUFDRSxPQUFPO0FBQUV0RSxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ29GO0FBQXJELE9BQVAsQ0FId0IsQ0FJMUI7O0FBQ0EsYUFBTztBQUFFeEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUE5QjtBQUFzQ1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDb0Y7QUFBcEQsT0FBUDtBQUNEO0FBVEgsR0F4Q1EsRUFtRFI7QUFDRTFFLE1BQUUsRUFBRSx1QkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBYyxTQUFHMkYsdUNBQWtCQTtBQUFuQyxLQUF2QixDQUZaO0FBR0VqRixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNrRjtBQUFyRCxPQUFQO0FBQ0Q7QUFMSCxHQW5EUSxFQTBEUjtBQUNFeEUsTUFBRSxFQUFFLHdCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRTNDLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQ3FILGNBQUwsR0FBc0JySCxJQUFJLENBQUNxSCxjQUFMLElBQXVCLEVBQTdDO0FBQ0FySCxVQUFJLENBQUNxSCxjQUFMLENBQW9CcEgsT0FBTyxDQUFDcUMsTUFBNUIsSUFBc0MsSUFBdEM7QUFDRDtBQU5ILEdBMURRLEVBa0VSO0FBQ0UzQixNQUFFLEVBQUUsd0JBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDcUgsY0FBTCxHQUFzQnJILElBQUksQ0FBQ3FILGNBQUwsSUFBdUIsRUFBN0M7QUFDQXJILFVBQUksQ0FBQ3FILGNBQUwsQ0FBb0JwSCxPQUFPLENBQUNxQyxNQUE1QixJQUFzQyxLQUF0QztBQUNEO0FBTkgsR0FsRVEsRUEwRVI7QUFDRTNCLE1BQUUsRUFBRSxtQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0V4QyxnQkFBWSxFQUFFLENBQUNtRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CZ0csVUFBVSxDQUFDaEcsT0FBTyxDQUFDaUcsUUFBVCxDQUFWLEdBQStCLEdBSG5FO0FBSUVOLGVBQVcsRUFBRSxDQUFDNUYsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQzlCLFVBQUksQ0FBQ0QsSUFBSSxDQUFDcUgsY0FBVixFQUNFO0FBQ0YsVUFBSSxDQUFDckgsSUFBSSxDQUFDcUgsY0FBTCxDQUFvQnBILE9BQU8sQ0FBQ3FDLE1BQTVCLENBQUwsRUFDRTtBQUNGLGFBQU87QUFDTFosWUFBSSxFQUFFekIsT0FBTyxDQUFDcUMsTUFEVDtBQUVMdUQsY0FBTSxFQUFFNUYsT0FBTyxDQUFDb0Y7QUFGWCxPQUFQO0FBSUQ7QUFiSCxHQTFFUSxFQXlGUjtBQUNFMUUsTUFBRSxFQUFFLDRCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBRlo7QUFHRXZGLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQ3NILG1CQUFMLEdBQTJCdEgsSUFBSSxDQUFDc0gsbUJBQUwsSUFBNEIsRUFBdkQ7QUFDQXRILFVBQUksQ0FBQ3NILG1CQUFMLENBQXlCckcsSUFBekIsQ0FBOEJoQixPQUE5QjtBQUNEO0FBTkgsR0F6RlEsRUFpR1I7QUFDRVUsTUFBRSxFQUFFLG9CQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBRlo7QUFHRWpGLFdBQU8sRUFBR3JCLElBQUQsSUFBVTtBQUNqQixZQUFNdUgsR0FBRyxHQUFHdkgsSUFBSSxDQUFDc0gsbUJBQWpCO0FBQ0EsVUFBSSxDQUFDQyxHQUFMLEVBQ0U7QUFDRixVQUFJQSxHQUFHLENBQUMzRSxNQUFKLElBQWMsQ0FBbEIsRUFDRSxPQUxlLENBTWpCO0FBQ0E7O0FBQ0EsYUFBTztBQUFFQyxZQUFJLEVBQUUsTUFBUjtBQUFnQkUsWUFBSSxFQUFHLEdBQUV3RSxHQUFHLENBQUMsQ0FBRCxDQUFILENBQU9wQyxPQUFRLE1BQUtvQyxHQUFHLENBQUMzRSxNQUFPO0FBQXhELE9BQVA7QUFDRCxLQVpIO0FBYUU3QixPQUFHLEVBQUdmLElBQUQsSUFBVSxPQUFPQSxJQUFJLENBQUNzSDtBQWI3QixHQWpHUTtBQVZHLENBQWYsRTs7QUNOQTtDQUdBOztBQUNBLDBDQUFlO0FBQ2JwRCxRQUFNLEVBQUVDLDhEQURLO0FBRWJzQixZQUFVLEVBQUU7QUFDVixtQkFBZSxNQURMO0FBRVYsd0JBQW9CO0FBRlYsR0FGQztBQU1iRixZQUFVLEVBQUU7QUFDVix3QkFBb0I7QUFEVixHQU5DO0FBU2JuQixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLGVBRE47QUFFRUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWxELFFBQUUsRUFBRTtBQUFOLEtBQW5CLENBRlo7QUFHRVUsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUM0QixNQUEvQjtBQUF1Q2tCLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ2tGO0FBQXJELE9BQVA7QUFDRDtBQUxILEdBRFE7QUFURyxDQUFmLEU7O0FDSkE7QUFDQTtDQUlBO0FBQ0E7O0FBRUEsMkNBQWU7QUFDYmpCLFFBQU0sRUFBRUMsOERBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLG1DQUErQixNQURyQjtBQUM2QjtBQUN2QyxtQ0FBK0IsTUFGckI7QUFFNkI7QUFDdkMsbUNBQStCLE1BSHJCO0FBRzZCO0FBQ3ZDLDZCQUF5QixNQUpmO0FBSXVCO0FBQ2pDLGtDQUE4QixNQUxwQjtBQUs0QjtBQUN0QyxrQ0FBOEIsTUFOcEI7QUFNNEI7QUFDdEMsb0NBQWdDLE1BUHRCO0FBTzhCO0FBQ3hDLGlDQUE2QixNQVJuQjtBQVEyQjtBQUNyQywwQ0FBc0MsTUFUNUI7QUFTb0M7QUFDOUMsMENBQXNDLE1BVjVCO0FBVW9DO0FBQzlDLDBDQUFzQyxNQVg1QjtBQVdvQztBQUM5Qyx5Q0FBcUMsTUFaM0IsQ0FZbUM7O0FBWm5DLEdBRkM7QUFnQmJFLFlBQVUsRUFBRTtBQUNWLDJCQUF1QixNQURiO0FBQ3FCO0FBQy9CLG9DQUFnQyxNQUZ0QjtBQUU4QjtBQUN4QywyQ0FBdUMsTUFIN0I7QUFHcUM7QUFDL0MsMkNBQXVDLE1BSjdCLENBSXFDOztBQUpyQyxHQWhCQztBQXNCYkQsV0FBUyxFQUFFO0FBQ1QsZ0NBQTRCLE1BRG5CO0FBQzJCO0FBQ3BDLGdDQUE0QixNQUZuQjtBQUUyQjtBQUNwQyx5QkFBcUIsTUFIWjtBQUdvQjtBQUM3QixnQ0FBNEIsTUFKbkIsQ0FJMkI7O0FBSjNCLEdBdEJFO0FBNEJiTSxXQUFTLEVBQUU7QUFDVCx5Q0FBcUMsTUFENUI7QUFDb0M7QUFDN0MscUNBQWlDLE1BRnhCO0FBRWdDO0FBQ3pDLGdDQUE0QixNQUhuQixDQUcyQjs7QUFIM0IsR0E1QkU7QUFpQ2IxQixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLDhCQUROO0FBRUVFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUFuQixDQUZaO0FBR0VpRixlQUFXLEVBQUUsQ0FBQ3ZCLEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDL0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTG5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BRlQ7QUFHTHVELGNBQU0sRUFBRTtBQUNON0MsWUFBRSxFQUFFLGFBREU7QUFFTkksWUFBRSxFQUFFLGdCQUZFO0FBR05DLFlBQUUsRUFBRSxrQkFIRTtBQUlOQyxZQUFFLEVBQUUsUUFKRTtBQUtOQyxZQUFFLEVBQUUsTUFMRTtBQU1OQyxZQUFFLEVBQUU7QUFORTtBQUhILE9BQVA7QUFZRDtBQWhCSCxHQURRLEVBbUJSO0FBQ0U3QyxNQUFFLEVBQUUsbUNBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDd0gsSUFBTCxHQUFZeEgsSUFBSSxDQUFDd0gsSUFBTCxJQUFhLEVBQXpCO0FBQ0F4SCxVQUFJLENBQUN3SCxJQUFMLENBQVV2SCxPQUFPLENBQUNxQyxNQUFsQixJQUE0QixJQUE1QjtBQUNEO0FBTkgsR0FuQlEsRUEyQlI7QUFDRTNCLE1BQUUsRUFBRSxtQ0FETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0UzQyxPQUFHLEVBQUUsQ0FBQ2YsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3RCRCxVQUFJLENBQUN3SCxJQUFMLEdBQVl4SCxJQUFJLENBQUN3SCxJQUFMLElBQWEsRUFBekI7QUFDQXhILFVBQUksQ0FBQ3dILElBQUwsQ0FBVXZILE9BQU8sQ0FBQ3FDLE1BQWxCLElBQTRCLEtBQTVCO0FBQ0Q7QUFOSCxHQTNCUSxFQW1DUjtBQUNFM0IsTUFBRSxFQUFFLGtDQUROO0FBRUU7QUFDQTtBQUNBO0FBQ0FFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQixDQUFOO0FBQWdDLFNBQUcyRix1Q0FBa0JBO0FBQXJELEtBQXZCLENBTFo7QUFNRXhGLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUJELElBQUksQ0FBQ3dILElBQUwsSUFBYXhILElBQUksQ0FBQ3dILElBQUwsQ0FBVXZILE9BQU8sQ0FBQ3FDLE1BQWxCLENBTjdDO0FBT0VqQixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTEMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFGVjtBQUdMUyxZQUFJLEVBQUU7QUFDSkMsWUFBRSxFQUFHLEdBQUUvQyxPQUFPLENBQUNrRixPQUFRLGNBRG5CO0FBRUovQixZQUFFLEVBQUcsR0FBRW5ELE9BQU8sQ0FBQ2tGLE9BQVEsdUJBRm5CO0FBR0o3QixZQUFFLEVBQUcsR0FBRXJELE9BQU8sQ0FBQ2tGLE9BQVEsWUFIbkI7QUFJSjVCLFlBQUUsRUFBRyxHQUFFdEQsT0FBTyxDQUFDa0YsT0FBUTtBQUpuQjtBQUhELE9BQVA7QUFVRDtBQWxCSCxHQW5DUTtBQWpDRyxDQUFmLEU7O0FDUkE7QUFDQTtDQUlBOztBQUNBLGdEQUFlO0FBQ2JqQixRQUFNLEVBQUVDLDREQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVjtBQUNBLHFCQUFpQixNQUZQO0FBR1Y7QUFDQSx5QkFBcUIsTUFKWDtBQUtWO0FBQ0EsZ0NBQTRCLE1BTmxCO0FBT1YsZ0NBQTRCO0FBUGxCLEdBRkM7QUFXYkUsWUFBVSxFQUFFO0FBQ1YsMkJBQXVCLE1BRGI7QUFFVixnQ0FBNEIsTUFGbEI7QUFHViwwQkFBc0IsTUFIWjtBQUlWO0FBQ0EsNEJBQXdCO0FBTGQsR0FYQztBQWtCYnJCLFVBQVEsRUFBRSxDQUNSO0FBQ0U7QUFDQXpELE1BQUUsRUFBRSxvQkFGTjtBQUdFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBYyxTQUFHMkYsdUNBQWtCQTtBQUFuQyxLQUF2QixDQUhaO0FBSUVqRixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTEMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFGVjtBQUdMUyxZQUFJLEVBQUU7QUFDSkMsWUFBRSxFQUFFLGtCQURBO0FBRUpJLFlBQUUsRUFBRSw4QkFGQTtBQUdKQyxZQUFFLEVBQUUscUJBSEE7QUFJSkMsWUFBRSxFQUFFLElBSkE7QUFLSkMsWUFBRSxFQUFFLElBTEE7QUFNSkMsWUFBRSxFQUFFO0FBTkE7QUFIRCxPQUFQO0FBWUQ7QUFqQkgsR0FEUTtBQWxCRyxDQUFmLEU7O0FDTkE7QUFDQTtDQUlBOztBQUVBLDhDQUFlO0FBQ2JVLFFBQU0sRUFBRUMsMERBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLHdCQUFvQixNQURWO0FBQ2tCO0FBQzVCLDZCQUF5QixNQUZmO0FBRXVCO0FBQ2pDLHdCQUFvQixNQUhWO0FBR2tCO0FBQzVCLDBCQUFzQixNQUpaO0FBSW9CO0FBQzlCLDRCQUF3QixNQUxkO0FBS3NCO0FBQ2hDLDJCQUF1QixNQU5iO0FBTXFCO0FBQy9CLDBCQUFzQixNQVBaO0FBT29CO0FBQzlCLHlCQUFxQixNQVJYLENBUW1COztBQVJuQixHQUZDO0FBWWJDLFdBQVMsRUFBRTtBQUNULHlCQUFxQjtBQURaLEdBWkU7QUFlYnBCLFVBQVEsRUFBRSxDQUNSO0FBQ0U7QUFDQXpELE1BQUUsRUFBRSxzQkFGTjtBQUdFO0FBQ0FFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBSlo7QUFLRWtDLGVBQVcsRUFBRSxDQUFDdkIsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMvQixhQUFPO0FBQ0w0QyxZQUFJLEVBQUUsTUFERDtBQUVMbkIsWUFBSSxFQUFFekIsT0FBTyxDQUFDcUMsTUFGVDtBQUdMdUQsY0FBTSxFQUFFO0FBQ043QyxZQUFFLEVBQUUsV0FERTtBQUVOSSxZQUFFLEVBQUUsbUJBRkU7QUFHTkMsWUFBRSxFQUFFLGVBSEU7QUFJTkMsWUFBRSxFQUFFLEtBSkU7QUFLTkMsWUFBRSxFQUFFO0FBTEU7QUFISCxPQUFQO0FBV0Q7QUFqQkgsR0FEUSxFQW9CUjtBQUNFNUMsTUFBRSxFQUFFLG9CQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBRlo7QUFHRVYsZUFBVyxFQUFFLENBQUN2QixLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQy9CLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUZUO0FBR0x1RCxjQUFNLEVBQUU7QUFDTjdDLFlBQUUsRUFBRSxhQURFO0FBRU5JLFlBQUUsRUFBRSxtQkFGRTtBQUdOQyxZQUFFLEVBQUUsbUJBSEU7QUFJTkMsWUFBRSxFQUFFLEtBSkU7QUFLTkMsWUFBRSxFQUFFO0FBTEU7QUFISCxPQUFQO0FBV0Q7QUFmSCxHQXBCUSxFQXFDUjtBQUNFO0FBQ0E1QyxNQUFFLEVBQUUsc0JBRk47QUFHRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWMsU0FBRzJGLHVDQUFrQkE7QUFBbkMsS0FBdkIsQ0FIWjtBQUlFVixlQUFXLEVBQUUsQ0FBQ3ZCLEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDL0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTG5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BRlQ7QUFHTHVELGNBQU0sRUFBRTtBQUNON0MsWUFBRSxFQUFFLGFBREU7QUFFTkksWUFBRSxFQUFFLG1CQUZFO0FBR05DLFlBQUUsRUFBRSxpQkFIRTtBQUlOQyxZQUFFLEVBQUUsS0FKRTtBQUtOQyxZQUFFLEVBQUU7QUFMRTtBQUhILE9BQVA7QUFXRDtBQWhCSCxHQXJDUTtBQWZHLENBQWYsRTs7Q0NMQTs7QUFDQSxnREFBZTtBQUNiVyxRQUFNLEVBQUVDLHNFQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVixzQkFBa0I7QUFEUixHQUZDO0FBS2JFLFlBQVUsRUFBRTtBQUNWLDBCQUFzQjtBQURaO0FBTEMsQ0FBZixFOztBQ0hBO0FBQ0E7Q0FJQTs7QUFDQSw2REFBZTtBQUNidkIsUUFBTSxFQUFFQywwRUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1Ysd0JBQW9CLE1BRFY7QUFFVixvQkFBZ0IsTUFGTjtBQUdWLGtCQUFjLE1BSEo7QUFJVixzQkFBa0IsTUFKUjtBQUtWLHNCQUFrQjtBQUxSLEdBRkM7QUFTYkUsWUFBVSxFQUFFO0FBQ1YsMkJBQXVCLE1BRGI7QUFFVixzQkFBa0IsTUFGUjtBQUdWLHdCQUFvQixNQUhWO0FBSVYsMEJBQXNCO0FBSlosR0FUQztBQWVickIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSxjQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRXRDLG1CQUFlLEVBQUUsQ0FIbkI7QUFJRUMsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDb0Y7QUFBckQsT0FBUDtBQUNEO0FBTkgsR0FEUSxFQVNSO0FBQ0U7QUFDQTtBQUNBMUUsTUFBRSxFQUFFLGtCQUhOO0FBSUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBSlo7QUFLRWxGLG1CQUFlLEVBQUUsQ0FMbkI7QUFNRUMsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDNEI7QUFBckQsT0FBUDtBQUNEO0FBUkgsR0FUUTtBQWZHLENBQWYsRTs7QUNOQTtBQUNBO0NBSUE7O0FBQ0EsNkRBQWU7QUFDYnFDLFFBQU0sRUFBRUMsd0ZBREs7QUFFYnNCLFlBQVUsRUFBRTtBQUNWLHdCQUFvQixNQURWO0FBRVYsd0JBQW9CLE1BRlY7QUFHVixvQkFBZ0IsTUFITjtBQUlWLDhCQUEwQjtBQUpoQixHQUZDO0FBUWJyQixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLG1CQUROO0FBRUU7QUFDQTtBQUNBO0FBQ0FFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBakI7QUFBcUNHLFdBQUssRUFBRWdCLHNDQUFpQkE7QUFBN0QsS0FBdkIsQ0FMWjtBQU1FcEcsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BRlY7QUFHTFMsWUFBSSxFQUFFO0FBQ0pDLFlBQUUsRUFBRSxhQURBO0FBRUpJLFlBQUUsRUFBRSxxQkFGQTtBQUdKQyxZQUFFLEVBQUUseUJBSEE7QUFJSkMsWUFBRSxFQUFFLE9BSkE7QUFLSkMsWUFBRSxFQUFFLElBTEE7QUFNSkMsWUFBRSxFQUFFO0FBTkE7QUFIRCxPQUFQO0FBWUQ7QUFuQkgsR0FEUSxFQXNCUjtBQUNFN0MsTUFBRSxFQUFFLHNCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBRlo7QUFHRWpGLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQ0w0QyxZQUFJLEVBQUUsTUFERDtBQUVMQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUZWO0FBR0xTLFlBQUksRUFBRTtBQUNKQyxZQUFFLEVBQUUsYUFEQTtBQUVKSSxZQUFFLEVBQUUsWUFGQTtBQUdKQyxZQUFFLEVBQUUsZ0JBSEE7QUFJSkMsWUFBRSxFQUFFLGFBSkE7QUFLSkMsWUFBRSxFQUFFLE1BTEE7QUFNSkMsWUFBRSxFQUFFO0FBTkE7QUFIRCxPQUFQO0FBWUQ7QUFoQkgsR0F0QlEsRUF3Q1I7QUFDRTdDLE1BQUUsRUFBRSxxQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBYyxTQUFHMkYsdUNBQWtCQTtBQUFuQyxLQUF2QixDQUZaO0FBR0VqRixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTG5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BRlQ7QUFHTFMsWUFBSSxFQUFFO0FBQ0pDLFlBQUUsRUFBRSxrQkFEQTtBQUVKSSxZQUFFLEVBQUUscUJBRkE7QUFHSkMsWUFBRSxFQUFFLHlCQUhBO0FBSUpDLFlBQUUsRUFBRSxZQUpBO0FBS0pDLFlBQUUsRUFBRSxLQUxBO0FBTUpDLFlBQUUsRUFBRTtBQU5BO0FBSEQsT0FBUDtBQVlEO0FBbkJILEdBeENRLEVBNkRSO0FBQ0U3QyxNQUFFLEVBQUUsV0FETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0VyQyxXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNvRjtBQUFyRCxPQUFQO0FBQ0Q7QUFMSCxHQTdEUSxFQW9FUjtBQUNFMUUsTUFBRSxFQUFFLFlBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFckMsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDb0Y7QUFBckQsT0FBUDtBQUNEO0FBTEgsR0FwRVEsRUEyRVI7QUFDRTFFLE1BQUUsRUFBRSxlQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRTNDLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQzBILE9BQUwsR0FBZTFILElBQUksQ0FBQzBILE9BQUwsSUFBZ0IsRUFBL0I7QUFDQTFILFVBQUksQ0FBQzBILE9BQUwsQ0FBYXpILE9BQU8sQ0FBQ3FDLE1BQXJCLElBQStCLElBQS9CO0FBQ0Q7QUFOSCxHQTNFUSxFQW1GUjtBQUNFM0IsTUFBRSxFQUFFLGVBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDMEgsT0FBTCxHQUFlMUgsSUFBSSxDQUFDMEgsT0FBTCxJQUFnQixFQUEvQjtBQUNBMUgsVUFBSSxDQUFDMEgsT0FBTCxDQUFhekgsT0FBTyxDQUFDcUMsTUFBckIsSUFBK0IsS0FBL0I7QUFDRDtBQU5ILEdBbkZRLEVBMkZSO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EzQixNQUFFLEVBQUUsZ0JBYk47QUFjRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FkWjtBQWVFeEMsZ0JBQVksRUFBRSxDQUFDbUQsS0FBRCxFQUFRcEUsT0FBUixLQUFvQmdHLFVBQVUsQ0FBQ2hHLE9BQU8sQ0FBQ2lHLFFBQVQsQ0FBVixHQUErQixDQWZuRTtBQWdCRU4sZUFBVyxFQUFFLENBQUM1RixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDOUIsVUFBSSxDQUFDRCxJQUFJLENBQUMwSCxPQUFOLElBQWlCLENBQUMxSCxJQUFJLENBQUMwSCxPQUFMLENBQWF6SCxPQUFPLENBQUNxQyxNQUFyQixDQUF0QixFQUNFO0FBQ0YsVUFBSXVELE1BQUo7QUFDQSxZQUFNSyxRQUFRLEdBQUdELFVBQVUsQ0FBQ2hHLE9BQU8sQ0FBQ2lHLFFBQVQsQ0FBM0I7QUFDQSxVQUFJQSxRQUFRLEdBQUcsQ0FBZixFQUNFTCxNQUFNLEdBQUc1RixPQUFPLENBQUNvRixNQUFSLEdBQWlCLEtBQTFCLENBREYsS0FFSyxJQUFJYSxRQUFRLEdBQUcsRUFBZixFQUNITCxNQUFNLEdBQUc1RixPQUFPLENBQUNvRixNQUFSLEdBQWlCLEtBQTFCLENBREcsS0FHSFEsTUFBTSxHQUFHNUYsT0FBTyxDQUFDb0YsTUFBUixHQUFpQixLQUExQjtBQUNGLGFBQU87QUFBRTNELFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BQWhCO0FBQXdCdUQsY0FBTSxFQUFFQTtBQUFoQyxPQUFQO0FBQ0Q7QUE1QkgsR0EzRlE7QUFSRyxDQUFmLEU7O0NDSkE7O0FBQ0EseURBQWU7QUFDYjNCLFFBQU0sRUFBRUMsd0RBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLGlDQUE2QixNQURuQjtBQUVWO0FBQ0Esd0NBQW9DLE1BSDFCO0FBSVYsb0NBQWdDLE1BSnRCO0FBS1Ysd0NBQW9DLE1BTDFCO0FBTVYsOENBQTBDLE1BTmhDO0FBT1YseUNBQXFDLE1BUDNCO0FBUVYsc0NBQWtDLE1BUnhCO0FBU1YsMkNBQXVDLE1BVDdCO0FBVVYsd0NBQW9DLE1BVjFCO0FBV1YsbUNBQStCLE1BWHJCO0FBWVYsbUNBQStCLE1BWnJCO0FBYVYsbUNBQStCLE1BYnJCO0FBY1YsbUNBQStCLE1BZHJCO0FBZVYsbUNBQStCLE1BZnJCO0FBZ0JWLG1DQUErQixNQWhCckI7QUFrQlYsZ0NBQTRCLE1BbEJsQjtBQW1CVix1Q0FBbUMsTUFuQnpCO0FBb0JWLHlDQUFxQyxNQXBCM0I7QUFzQlYsd0NBQW9DLE1BdEIxQjtBQXVCViw0Q0FBd0MsTUF2QjlCO0FBd0JWLDRDQUF3QyxNQXhCOUI7QUF5QlYsNENBQXdDLE1BekI5QjtBQTBCViw0Q0FBd0MsTUExQjlCO0FBMkJWLDRDQUF3QyxNQTNCOUI7QUE0QlYsNENBQXdDLE1BNUI5QjtBQThCVixrQ0FBOEIsTUE5QnBCO0FBK0JWLGtDQUE4QixNQS9CcEI7QUFnQ1Ysa0NBQThCLE1BaENwQjtBQWtDViwrQkFBMkIsTUFsQ2pCO0FBb0NWLDJDQUF1QyxNQXBDN0I7QUFxQ1YsMkNBQXVDLE1BckM3QjtBQXNDViwyQ0FBdUMsTUF0QzdCO0FBd0NWLDhCQUEwQixNQXhDaEI7QUF5Q1YsMkNBQXVDLE1BekM3QjtBQTBDVjtBQUVBLG9DQUFnQyxNQTVDdEI7QUE2Q1Ysb0NBQWdDLE1BN0N0QjtBQThDVixvQ0FBZ0MsTUE5Q3RCO0FBK0NWLG9DQUFnQyxNQS9DdEI7QUFnRFYsb0NBQWdDLE1BaER0QjtBQWlEVixtQ0FBK0IsTUFqRHJCO0FBbURWLHVDQUFtQyxNQW5EekI7QUFvRFYsMENBQXNDLE1BcEQ1QjtBQXNEVixrQ0FBOEIsTUF0RHBCO0FBdURWLGtDQUE4QixNQXZEcEI7QUF3RFYsa0NBQThCLE1BeERwQjtBQXlEVixrQ0FBOEIsTUF6RHBCO0FBMERWLGtDQUE4QixNQTFEcEI7QUEyRFYsa0NBQThCLE1BM0RwQjtBQTREVixrQ0FBOEIsTUE1RHBCO0FBOERWLHdDQUFvQyxNQTlEMUI7QUErRFYsb0NBQWdDLE1BL0R0QjtBQWdFVixxQ0FBaUMsTUFoRXZCO0FBaUVWLGlDQUE2QixNQWpFbkI7QUFrRVYsMkJBQXVCLE1BbEViO0FBb0VWLGdDQUE0QixNQXBFbEI7QUFxRVYsb0NBQWdDLE1BckV0QjtBQXNFVixpQ0FBNkIsTUF0RW5CO0FBd0VWLG1DQUErQixNQXhFckI7QUF3RTZCO0FBQ3ZDLG9DQUFnQyxNQXpFdEI7QUEwRVYsb0NBQWdDLE1BMUV0QjtBQTJFVixvQ0FBZ0MsTUEzRXRCO0FBNEVWLG9DQUFnQyxNQTVFdEI7QUE4RVYsNkJBQXlCLE1BOUVmO0FBZ0ZWLG9DQUFnQyxNQWhGdEI7QUFpRlYsb0NBQWdDLE1BakZ0QjtBQW1GViwrQkFBMkIsTUFuRmpCO0FBb0ZWLCtCQUEyQjtBQXBGakIsR0FGQztBQXlGYkMsV0FBUyxFQUFFO0FBQ1QseUNBQXFDO0FBRDVCO0FBekZFLENBQWYsRTs7Q0NEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseURBQWU7QUFDYnRCLFFBQU0sRUFBRUMsd0RBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLG1DQUErQixNQURyQjtBQUM2QjtBQUN2QyxtQ0FBK0IsTUFGckI7QUFFNkI7QUFDdkMsbUNBQStCLE1BSHJCO0FBRzZCO0FBQ3ZDLHFDQUFpQyxNQUp2QjtBQUkrQjtBQUN6QyxvQ0FBZ0MsTUFMdEI7QUFLOEI7QUFDeEMsb0NBQWdDLE1BTnRCO0FBTThCO0FBQ3hDLGdDQUE0QixNQVBsQjtBQU8wQjtBQUNwQyx5Q0FBcUMsTUFSM0I7QUFRbUM7QUFDN0Msc0NBQWtDLE1BVHhCO0FBU2dDO0FBQzFDLHdDQUFvQyxNQVYxQjtBQVVrQztBQUM1QywyQ0FBdUMsTUFYN0I7QUFXcUM7QUFDL0MsMENBQXNDLE1BWjVCO0FBWW9DO0FBQzlDLGtDQUE4QixNQWJwQjtBQWE0QjtBQUN0QyxrREFBOEMsTUFkcEM7QUFjNEM7QUFDdEQsa0RBQThDLE1BZnBDO0FBZTRDO0FBQ3RELGtEQUE4QyxNQWhCcEM7QUFnQjRDO0FBQ3RELHVDQUFtQyxNQWpCekI7QUFpQmlDO0FBQzNDLHVDQUFtQyxNQWxCekI7QUFrQmlDO0FBQzNDLHNDQUFrQyxNQW5CeEI7QUFtQmdDO0FBQzFDLG9EQUFnRCxNQXBCdEM7QUFvQjhDO0FBQ3hELG9EQUFnRCxNQXJCdEM7QUFxQjhDO0FBQ3hELHVDQUFtQyxNQXRCekI7QUFzQmlDO0FBQzNDLG9DQUFnQyxNQXZCdEI7QUF1QjhCO0FBQ3hDLGdDQUE0QixNQXhCbEI7QUF3QjBCO0FBQ3BDLCtCQUEyQixNQXpCakI7QUF5QnlCO0FBQ25DLGdDQUE0QixNQTFCbEI7QUEwQjBCO0FBQ3BDLHlDQUFxQyxNQTNCM0I7QUEyQm1DO0FBQzdDLGtDQUE4QixNQTVCcEI7QUE0QjRCO0FBQ3RDLDZDQUF5QyxNQTdCL0I7QUE2QnVDO0FBQ2pELCtDQUEyQyxNQTlCakM7QUE4QnlDO0FBQ25ELHNEQUFrRCxNQS9CeEM7QUErQmdEO0FBQzFELDhDQUEwQyxNQWhDaEM7QUFnQ3dDO0FBQ2xELDhDQUEwQyxNQWpDaEM7QUFpQ3dDO0FBQ2xELDRDQUF3QyxNQWxDOUI7QUFrQ3NDO0FBQ2hELDRDQUF3QyxNQW5DOUI7QUFtQ3NDO0FBQ2hELCtDQUEyQyxNQXBDakM7QUFvQ3lDO0FBQ25ELCtDQUEyQyxNQXJDakM7QUFxQ3lDO0FBQ25ELDJDQUF1QyxNQXRDN0I7QUFzQ3FDO0FBQy9DLDJDQUF1QyxNQXZDN0I7QUF1Q3FDO0FBQy9DLDRDQUF3QyxNQXhDOUIsQ0F3Q3NDO0FBQ2hEO0FBQ0E7QUFDQTs7QUEzQ1UsR0FGQztBQStDYkUsWUFBVSxFQUFFO0FBQ1Ysa0NBQThCLE1BRHBCO0FBQzRCO0FBQ3RDLGtDQUE4QixNQUZwQjtBQUU0QjtBQUN0QyxrQ0FBOEIsTUFIcEI7QUFHNEI7QUFDdEMsa0NBQThCLE1BSnBCO0FBSTRCO0FBQ3RDLGtDQUE4QixNQUxwQjtBQUs0QjtBQUN0QyxrQ0FBOEIsTUFOcEI7QUFNNEI7QUFDdEMsa0NBQThCLE1BUHBCO0FBTzRCO0FBQ3RDLGtDQUE4QixNQVJwQjtBQVE0QjtBQUN0Qyx3Q0FBb0MsTUFUMUIsQ0FTa0M7O0FBVGxDLEdBL0NDO0FBMERiRCxXQUFTLEVBQUU7QUFDVDtBQUNBO0FBQ0EsMkNBQXVDLE1BSDlCO0FBSVQ7QUFDQSwwQ0FBc0MsTUFMN0I7QUFLcUM7QUFDOUMsb0RBQWdELE1BTnZDO0FBTStDO0FBQ3hELDBDQUFzQyxNQVA3QixDQU9xQzs7QUFQckMsR0ExREU7QUFtRWJNLFdBQVMsRUFBRTtBQUNULHlDQUFxQyxNQUQ1QjtBQUNvQztBQUM3QyxnREFBNEMsTUFGbkM7QUFHVCwwQ0FBc0MsTUFIN0IsQ0FHcUM7O0FBSHJDLEdBbkVFO0FBd0ViSixpQkFBZSxFQUFFO0FBQ2Ysb0JBQWdCLEtBREQsQ0FDUTs7QUFEUjtBQXhFSixDQUFmLEU7O0FDVEE7Q0FHQTtBQUNBOztBQUVBLG9FQUFlO0FBQ2J4QixRQUFNLEVBQUVDLDBFQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViw0Q0FBd0MsTUFEOUI7QUFDc0M7QUFDaEQsNENBQXdDLE1BRjlCO0FBRXNDO0FBQ2hELDBDQUFzQyxNQUg1QjtBQUdvQztBQUM5QywwQ0FBc0MsTUFKNUI7QUFJb0M7QUFDOUMsMENBQXNDLE1BTDVCO0FBS29DO0FBQzlDLDBDQUFzQyxNQU41QjtBQU1vQztBQUM5Qyx5QkFBcUIsTUFQWDtBQU9tQjtBQUM3QixpQ0FBNkIsTUFSbkI7QUFRMkI7QUFDckMsMEJBQXNCLE1BVFo7QUFTb0I7QUFDOUIsOEJBQTBCLE1BVmhCO0FBVXdCO0FBQ2xDLDJCQUF1QixNQVhiO0FBV3FCO0FBQy9CLG1DQUErQixNQVpyQjtBQVk2QjtBQUN2QyxtQ0FBK0IsTUFickI7QUFhNkI7QUFDdkMsbUNBQStCLE1BZHJCO0FBYzZCO0FBQ3ZDLG1DQUErQixNQWZyQjtBQWU2QjtBQUN2QyxrQ0FBOEIsTUFoQnBCO0FBZ0I0QjtBQUN0QyxvQ0FBZ0MsTUFqQnRCO0FBaUI4QjtBQUN4QyxvQ0FBZ0MsTUFsQnRCO0FBa0I4QjtBQUN4QyxvQ0FBZ0MsTUFuQnRCO0FBbUI4QjtBQUN4QyxtQ0FBK0IsTUFwQnJCO0FBb0I2QjtBQUN2QyxtQ0FBK0IsTUFyQnJCO0FBcUI2QjtBQUN2Qyx5Q0FBcUMsTUF0QjNCO0FBc0JtQztBQUM3Qyx3Q0FBb0MsTUF2QjFCO0FBdUJrQztBQUM1QyxpQ0FBNkIsTUF4Qm5CO0FBd0IyQjtBQUNyQyw4QkFBMEIsTUF6QmhCO0FBeUJ3QjtBQUNsQyx5Q0FBcUMsTUExQjNCO0FBMEJtQztBQUM3Qyx5Q0FBcUMsTUEzQjNCO0FBMkJtQztBQUM3Qyx5Q0FBcUMsTUE1QjNCO0FBNEJtQztBQUM3Qyx5Q0FBcUMsTUE3QjNCO0FBNkJtQztBQUM3Qyx5Q0FBcUMsTUE5QjNCO0FBOEJtQztBQUM3Qyx5Q0FBcUMsTUEvQjNCO0FBK0JtQztBQUM3Qyx5Q0FBcUMsTUFoQzNCO0FBZ0NtQztBQUM3Qyx5Q0FBcUMsTUFqQzNCO0FBaUNtQztBQUM3QyxvQ0FBZ0MsTUFsQ3RCO0FBa0M4QjtBQUN4QyxvQ0FBZ0MsTUFuQ3RCO0FBbUM4QjtBQUN4QyxvQ0FBZ0MsTUFwQ3RCO0FBb0M4QjtBQUN4QyxvQ0FBZ0MsTUFyQ3RCO0FBcUM4QjtBQUN4QyxvQ0FBZ0MsTUF0Q3RCO0FBc0M4QjtBQUN4QyxvQ0FBZ0MsTUF2Q3RCO0FBdUM4QjtBQUN4QyxvQ0FBZ0MsTUF4Q3RCO0FBd0M4QjtBQUN4QyxpQ0FBNkIsTUF6Q25CO0FBeUMyQjtBQUNyQyxpQ0FBNkIsTUExQ25CO0FBMEMyQjtBQUNyQyxxQ0FBaUMsTUEzQ3ZCO0FBMkMrQjtBQUN6QywwQ0FBc0MsTUE1QzVCO0FBNENvQztBQUM5QyxzQ0FBa0MsTUE3Q3hCO0FBNkNnQztBQUMxQyxpREFBNkMsTUE5Q25DO0FBOEMyQztBQUNyRCxnREFBNEMsTUEvQ2xDO0FBK0MwQztBQUNwRCw0Q0FBd0MsTUFoRDlCO0FBZ0RzQztBQUNoRCw0Q0FBd0MsTUFqRDlCO0FBaURzQztBQUNoRCxxQ0FBaUMsTUFsRHZCO0FBa0QrQjtBQUN6Qyx5Q0FBcUMsTUFuRDNCO0FBbURtQztBQUM3Qyx3Q0FBb0MsTUFwRDFCO0FBb0RrQztBQUM1QyxxQ0FBaUMsTUFyRHZCO0FBcUQrQjtBQUN6Qyw2Q0FBeUMsTUF0RC9CO0FBc0R1QztBQUNqRCx3Q0FBb0MsTUF2RDFCO0FBdURrQztBQUM1Qyw4Q0FBMEMsTUF4RGhDO0FBd0R3QztBQUNsRCxxQ0FBaUMsTUF6RHZCO0FBeUQrQjtBQUN6Qyw0Q0FBd0MsTUExRDlCO0FBMERzQztBQUNoRCw0Q0FBd0MsTUEzRDlCO0FBMkRzQztBQUNoRCxzREFBa0QsTUE1RHhDLENBNERnRDs7QUE1RGhELEdBRkM7QUFnRWJFLFlBQVUsRUFBRTtBQUNWLDhDQUEwQyxNQURoQyxDQUN3Qzs7QUFEeEMsR0FoRUM7QUFtRWJELFdBQVMsRUFBRTtBQUNULHlDQUFxQyxNQUQ1QjtBQUNvQztBQUM3Qyx3Q0FBb0MsTUFGM0IsQ0FFbUM7O0FBRm5DLEdBbkVFO0FBdUViTSxXQUFTLEVBQUU7QUFDVCx3Q0FBb0MsTUFEM0I7QUFDbUM7QUFDNUMsd0NBQW9DLE1BRjNCO0FBRW1DO0FBQzVDLG9DQUFnQyxNQUh2QixDQUcrQjs7QUFIL0IsR0F2RUU7QUE0RWIxQixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLG1CQUROO0FBRUU7QUFDQTtBQUNBRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFLENBQUMsTUFBRCxFQUFTLE1BQVQ7QUFBTixLQUFuQixDQUpaO0FBS0VpRixlQUFXLEVBQUUsQ0FBQ3ZCLEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDL0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTG5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BRlQ7QUFHTHVELGNBQU0sRUFBRTtBQUNON0MsWUFBRSxFQUFFLGFBREU7QUFFTkksWUFBRSxFQUFFLGdCQUZFO0FBR05DLFlBQUUsRUFBRSxrQkFIRTtBQUlOQyxZQUFFLEVBQUUsUUFKRTtBQUtOQyxZQUFFLEVBQUUsTUFMRTtBQU1OQyxZQUFFLEVBQUU7QUFORTtBQUhILE9BQVA7QUFZRDtBQWxCSCxHQURRO0FBNUVHLENBQWYsRTs7QUNOQTtBQUVBLHVEQUFlO0FBQ2JVLFFBQU0sRUFBRUMsc0RBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLDJCQUF1QixNQURiO0FBRVYseUJBQXFCLE1BRlg7QUFHViw0QkFBd0IsTUFIZDtBQUlWLDZCQUF5QixNQUpmO0FBS1YsaUNBQTZCLE1BTG5CO0FBTVYsaUNBQTZCLE1BTm5CO0FBT1YsZ0NBQTRCLE1BUGxCO0FBUVYsZ0NBQTRCLE1BUmxCO0FBU1YsNEJBQXdCLE1BVGQ7QUFVViwwQkFBc0IsTUFWWjtBQVdWLDJCQUF1QixNQVhiO0FBWVYsb0NBQWdDLE1BWnRCO0FBYVYsb0NBQWdDLE1BYnRCO0FBY1YsNEJBQXdCLE1BZGQ7QUFlVix3QkFBb0IsTUFmVjtBQWdCViw2QkFBeUIsTUFoQmY7QUFpQlYscUJBQWlCLE1BakJQO0FBa0JWLDZCQUF5QixNQWxCZjtBQW1CViwyQkFBdUIsTUFuQmI7QUFvQlYsOEJBQTBCLE1BcEJoQixDQXFCVjs7QUFyQlU7QUFGQyxDQUFmLEU7O0FDRkE7QUFFQSw4Q0FBZTtBQUNickIsUUFBTSxFQUFFQyxzQ0FESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsMkJBQXVCLE1BRGI7QUFFVixxQkFBaUIsTUFGUDtBQUdWLDJCQUF1QixNQUhiO0FBSVYsK0JBQTJCLE1BSmpCO0FBS1YsK0JBQTJCLE1BTGpCO0FBTVYsMEJBQXNCLE1BTlo7QUFPViwyQkFBdUIsTUFQYjtBQVFWLHlCQUFxQixNQVJYO0FBU1YsMkJBQXVCLE1BVGI7QUFVVix5QkFBcUIsTUFWWDtBQVdWLDhCQUEwQixNQVhoQjtBQVlWLGlDQUE2QixNQVpuQjtBQWFWLDJCQUF1QixNQWJiO0FBY1YsaUNBQTZCLE1BZG5CO0FBZVYsNkJBQXlCLE1BZmY7QUFnQlYsNkJBQXlCLE1BaEJmO0FBaUJWLGdDQUE0QixNQWpCbEI7QUFrQlYsMEJBQXNCO0FBbEJaLEdBRkM7QUFzQmJFLFlBQVUsRUFBRTtBQUNWLDJCQUF1QjtBQURiO0FBdEJDLENBQWYsRTs7QUNGQTtBQUVBLHVEQUFlO0FBQ2J2QixRQUFNLEVBQUVDLHNEQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViwwQ0FBc0MsTUFENUI7QUFDb0M7QUFDOUMsNkNBQXlDLE1BRi9CO0FBRXVDO0FBQ2pELDZDQUF5QyxNQUgvQjtBQUd1QztBQUNqRCx3Q0FBb0MsTUFKMUI7QUFJa0M7QUFDNUMsaURBQTZDLE1BTG5DO0FBSzJDO0FBQ3JELHNDQUFrQyxNQU54QjtBQU1nQztBQUMxQyxrREFBOEMsTUFQcEM7QUFPNEM7QUFDdEQsb0NBQWdDLE1BUnRCO0FBUThCO0FBQ3hDLG9DQUFnQyxNQVR0QjtBQVM4QjtBQUN4QyxvQ0FBZ0MsTUFWdEI7QUFVOEI7QUFDeEMsbUNBQStCLE1BWHJCO0FBVzZCO0FBQ3ZDLG1DQUErQixNQVpyQjtBQVk2QjtBQUN2Qyw2Q0FBeUMsTUFiL0I7QUFhdUM7QUFDakQsMkNBQXVDLE1BZDdCO0FBY3FDO0FBQy9DLHlDQUFxQyxNQWYzQjtBQWVtQztBQUM3Qyx5Q0FBcUMsTUFoQjNCO0FBZ0JtQztBQUM3Qyx3Q0FBb0MsTUFqQjFCO0FBaUJrQztBQUM1Qyx1Q0FBbUMsTUFsQnpCO0FBa0JpQztBQUMzQyw0Q0FBd0MsTUFuQjlCO0FBbUJzQztBQUNoRCw0Q0FBd0MsTUFwQjlCO0FBb0JzQztBQUNoRCxvQ0FBZ0MsTUFyQnRCO0FBcUI4QjtBQUN4QywrQ0FBMkMsTUF0QmpDO0FBc0J5QztBQUNuRCxvQ0FBZ0MsTUF2QnRCO0FBdUI4QjtBQUN4Qyx3Q0FBb0MsTUF4QjFCLENBd0JrQzs7QUF4QmxDLEdBRkM7QUE0QmJDLFdBQVMsRUFBRTtBQUNULDRDQUF3QyxNQUQvQjtBQUN1QztBQUNoRCwwQ0FBc0MsTUFGN0I7QUFFcUM7QUFDOUMsMENBQXNDLE1BSDdCLENBR3FDOztBQUhyQztBQTVCRSxDQUFmLEU7O0FDRkE7Q0FHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnREFBZTtBQUNidEIsUUFBTSxFQUFFQyx3Q0FESztBQUVib0IsWUFBVSxFQUFFO0FBQ1Ysd0JBQW9CLE1BRFY7QUFDa0I7QUFDNUIsMkJBQXVCLE1BRmI7QUFFcUI7QUFDL0IsK0JBQTJCLE1BSGpCO0FBR3lCO0FBQ25DLHdCQUFvQixNQUpWO0FBSWtCO0FBQzVCLHdCQUFvQixNQUxWO0FBS2tCO0FBQzVCLCtCQUEyQixNQU5qQjtBQU15QjtBQUNuQyxrQ0FBOEIsTUFQcEI7QUFPNEI7QUFDdEMsZ0NBQTRCLE1BUmxCO0FBUTBCO0FBQ3BDLG9DQUFnQztBQVR0QixHQUZDO0FBY2JuQixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLHFCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRXJDLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ29GO0FBQXJELE9BQVA7QUFDRDtBQUxILEdBRFEsRUFRUjtBQUNFMUUsTUFBRSxFQUFFLHNCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRXJDLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ29GO0FBQXJELE9BQVA7QUFDRDtBQUxILEdBUlEsRUFlUjtBQUNFMUUsTUFBRSxFQUFFLDBCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRXJDLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ29GO0FBQXJELE9BQVA7QUFDRDtBQUxILEdBZlE7QUFkRyxDQUFmLEU7O0FDUkE7QUFDQTtDQUlBOztBQUVBLHNEQUFlO0FBQ2JuQixRQUFNLEVBQUVDLDBEQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViw0QkFBd0IsTUFEZDtBQUNzQjtBQUNoQyx5QkFBcUIsTUFGWDtBQUVtQjtBQUM3QiwwQkFBc0IsTUFIWjtBQUdvQjtBQUM5QixzQkFBa0IsTUFKUjtBQUlnQjtBQUMxQixxQkFBaUIsTUFMUDtBQUtlO0FBQ3pCLDBCQUFzQixNQU5aO0FBTW9CO0FBQzlCLDBCQUFzQixNQVBaO0FBT29CO0FBQzlCLDZCQUF5QixNQVJmO0FBUXVCO0FBQ2pDLHlCQUFxQixNQVRYO0FBU21CO0FBQzdCLHlCQUFxQixNQVZYO0FBVW1CO0FBQzdCLHlCQUFxQixNQVhYO0FBV21CO0FBQzdCLHlCQUFxQixNQVpYO0FBWW1CO0FBQzdCLDRCQUF3QixNQWJkO0FBYXNCO0FBQ2hDLHlCQUFxQixNQWRYO0FBY21CO0FBQzdCLHlCQUFxQixNQWZYO0FBZW1CO0FBQzdCLDRCQUF3QixNQWhCZDtBQWdCc0I7QUFDaEMsaUJBQWEsTUFqQkg7QUFpQlc7QUFDckIscUJBQWlCLE1BbEJQO0FBa0JlO0FBQ3pCLHVCQUFtQixNQW5CVDtBQW1CaUI7QUFDM0IsdUJBQW1CLE1BcEJUO0FBb0JpQjtBQUMzQiwwQkFBc0IsTUFyQlo7QUFxQm9CO0FBQzlCLDBCQUFzQixNQXRCWjtBQXNCb0I7QUFDOUIscUJBQWlCLE1BdkJQLENBdUJlOztBQXZCZixHQUZDO0FBMkJiQyxXQUFTLEVBQUU7QUFDVCwrQkFBMkIsTUFEbEI7QUFDMEI7QUFDbkMscUJBQWlCLE1BRlI7QUFFZ0I7QUFDekIseUJBQXFCLE1BSFosQ0FHb0I7O0FBSHBCLEdBM0JFO0FBZ0NiTSxXQUFTLEVBQUU7QUFDVCx3QkFBb0IsTUFEWCxDQUNtQjs7QUFEbkIsR0FoQ0U7QUFtQ2JKLGlCQUFlLEVBQUU7QUFDZixvQkFBZ0IsS0FERCxDQUNROztBQURSLEdBbkNKO0FBc0NiQyxpQkFBZSxFQUFFO0FBQ2YseUJBQXFCLEtBRE4sQ0FDYTs7QUFEYixHQXRDSjtBQXlDYkssVUFBUSxFQUFFO0FBQ1I7QUFDQTtBQUNBO0FBQ0Esd0JBQW9CO0FBSlosR0F6Q0c7QUErQ2I1QixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLGtCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBRlo7QUFHRTtBQUNBeEYsYUFBUyxFQUFFLENBQUNkLElBQUQsRUFBT0MsT0FBUCxLQUFtQkQsSUFBSSxDQUFDb0YsaUJBQUwsQ0FBdUJuRixPQUF2QixJQUFrQyxDQUpsRTtBQUtFb0IsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDa0Y7QUFBckQsT0FBUDtBQUNEO0FBUEgsR0FEUTtBQS9DRyxDQUFmLEU7O0FDUEE7QUFFQSx3REFBZTtBQUNiakIsUUFBTSxFQUFFQyx3REFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsNkJBQXlCLE1BRGY7QUFFViwrQkFBMkIsTUFGakI7QUFHViw2QkFBeUIsTUFIZjtBQUlWLGtDQUE4QixNQUpwQjtBQUtWLDZCQUF5QixNQUxmO0FBTVYsbUNBQStCLE1BTnJCO0FBT1YsbUNBQStCLE1BUHJCO0FBUVYsbUNBQStCLE1BUnJCO0FBU1YscUNBQWlDLE1BVHZCO0FBVVYsOEJBQTBCLE1BVmhCO0FBV1YsNkJBQXlCO0FBWGYsR0FGQztBQWViRSxZQUFVLEVBQUU7QUFDViw0QkFBd0I7QUFEZCxHQWZDO0FBa0JiRCxXQUFTLEVBQUU7QUFDVCwrQkFBMkI7QUFEbEIsR0FsQkU7QUFxQmJNLFdBQVMsRUFBRTtBQUNULDhCQUEwQjtBQURqQjtBQXJCRSxDQUFmLEU7O0FDRkE7QUFFQSxvREFBZTtBQUNiNUIsUUFBTSxFQUFFQyxnREFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsNEJBQXdCLE1BRGQ7QUFFVix3QkFBb0IsTUFGVjtBQUdWLCtCQUEyQixNQUhqQjtBQUlWLDJCQUF1QixNQUpiO0FBS1YsZ0NBQTRCLE1BTGxCO0FBTVYsNEJBQXdCLE1BTmQ7QUFPVixpQ0FBNkIsTUFQbkI7QUFRVixnQ0FBNEIsTUFSbEI7QUFTVixpQ0FBNkIsTUFUbkI7QUFVViwwQkFBc0I7QUFWWjtBQUZDLENBQWYsRTs7Q0NBQTs7QUFFQSxxREFBZTtBQUNickIsUUFBTSxFQUFFQyxrREFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1Ysc0NBQWtDLE1BRHhCO0FBQ2dDO0FBQzFDLDJDQUF1QyxNQUY3QjtBQUVxQztBQUMvQyx3Q0FBb0MsTUFIMUI7QUFHa0M7QUFDNUMsNkNBQXlDLE1BSi9CO0FBSXVDO0FBQ2pELDhCQUEwQixNQUxoQjtBQUt3QjtBQUNsQyx1Q0FBbUMsTUFOekI7QUFNaUM7QUFDM0MsdUNBQW1DLE1BUHpCO0FBT2lDO0FBQzNDLHVDQUFtQyxNQVJ6QjtBQVFpQztBQUMzQyxnQ0FBNEIsTUFUbEI7QUFTMEI7QUFDcEMscUNBQWlDLE1BVnZCO0FBVStCO0FBQ3pDLDJCQUF1QixNQVhiO0FBV3FCO0FBQy9CLHFEQUFpRCxNQVp2QztBQVkrQztBQUN6RCxnQ0FBNEIsTUFibEI7QUFhMEI7QUFDcEMscUNBQWlDLE1BZHZCO0FBYytCO0FBQ3pDLHFDQUFpQyxNQWZ2QjtBQWUrQjtBQUN6QywwQ0FBc0MsTUFoQjVCO0FBZ0JvQztBQUM5Qyw4Q0FBMEMsTUFqQmhDO0FBaUJ3QztBQUNsRCxxQ0FBaUMsTUFsQnZCO0FBa0IrQjtBQUN6Qyw2Q0FBeUMsTUFuQi9CO0FBbUJ1QztBQUNqRCxrREFBOEMsTUFwQnBDO0FBb0I0QztBQUN0RCx3Q0FBb0MsTUFyQjFCO0FBcUJrQztBQUM1QywwQ0FBc0MsTUF0QjVCO0FBc0JvQztBQUM5Qyw0Q0FBd0MsTUF2QjlCO0FBdUJzQztBQUNoRCx1Q0FBbUMsTUF4QnpCO0FBd0JpQztBQUMzQyxtQ0FBK0IsTUF6QnJCLENBeUI2Qjs7QUF6QjdCLEdBRkM7QUE2QmJFLFlBQVUsRUFBRTtBQUNWLCtCQUEyQixNQURqQixDQUN5Qjs7QUFEekIsR0E3QkM7QUFnQ2JELFdBQVMsRUFBRTtBQUNULDBCQUFzQixNQURiO0FBQ3FCO0FBQzlCLDRCQUF3QixNQUZmLENBRXVCOztBQUZ2QjtBQWhDRSxDQUFmLEU7O0FDSkE7QUFFQSw4Q0FBZTtBQUNidEIsUUFBTSxFQUFFQyxvQ0FESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsdUJBQW1CLE1BRFQ7QUFFVix1QkFBbUIsTUFGVDtBQUdWLHdCQUFvQixNQUhWO0FBSVYsMkJBQXVCLE1BSmI7QUFLViwyQkFBdUIsTUFMYjtBQU1WLDJCQUF1QixNQU5iO0FBT1YseUJBQXFCLE1BUFg7QUFRViwyQkFBdUIsTUFSYjtBQVNWLHFCQUFpQixNQVRQO0FBVVYsK0JBQTJCLE1BVmpCO0FBV1YsNEJBQXdCLE1BWGQ7QUFZVixnQ0FBNEIsTUFabEI7QUFhVixnQ0FBNEIsTUFibEI7QUFjVixnQ0FBNEIsTUFkbEI7QUFlVixnQ0FBNEIsTUFmbEI7QUFnQlYsZ0NBQTRCLE1BaEJsQjtBQWlCVixpQ0FBNkIsTUFqQm5CO0FBa0JWLGlDQUE2QixNQWxCbkI7QUFtQlYsaUNBQTZCLE1BbkJuQjtBQW9CVix3QkFBb0I7QUFwQlYsR0FGQztBQXdCYkUsWUFBVSxFQUFFO0FBQ1YsNEJBQXdCLE1BRGQ7QUFFVix1QkFBbUIsTUFGVDtBQUdWLHNCQUFrQjtBQUhSO0FBeEJDLENBQWYsRTs7Q0NBQTtBQUNBOztBQUVBLCtDQUFlO0FBQ2J2QixRQUFNLEVBQUVDLHdDQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVix5Q0FBcUMsTUFEM0I7QUFDbUM7QUFDN0MsbURBQStDLE1BRnJDO0FBRTZDO0FBQ3ZELHVDQUFtQyxNQUh6QjtBQUdpQztBQUMzQyw0Q0FBd0MsTUFKOUI7QUFJc0M7QUFDaEQseURBQXFELE1BTDNDO0FBS21EO0FBQzdELHFDQUFpQyxNQU52QjtBQU0rQjtBQUN6QywwQ0FBc0MsTUFQNUI7QUFPb0M7QUFDOUMsOENBQTBDLE1BUmhDO0FBUXdDO0FBQ2xELHdDQUFvQyxNQVQxQjtBQVNrQztBQUM1Qyx3Q0FBb0MsTUFWMUI7QUFVa0M7QUFDNUMsMkNBQXVDLE1BWDdCO0FBV3FDO0FBQy9DLHFEQUFpRCxNQVp2QztBQVkrQztBQUN6RCw2Q0FBeUMsTUFiL0I7QUFhdUM7QUFDakQsaURBQTZDLE1BZG5DO0FBYzJDO0FBQ3JELGdEQUE0QyxNQWZsQztBQWUwQztBQUNwRCxtQ0FBK0IsTUFoQnJCO0FBZ0I2QjtBQUN2QyxrREFBOEMsTUFqQnBDO0FBaUI0QztBQUN0RCw2Q0FBeUMsTUFsQi9CO0FBa0J1QztBQUNqRCxpREFBNkMsTUFuQm5DO0FBbUIyQztBQUNyRCxtREFBK0MsTUFwQnJDO0FBb0I2QztBQUN2RCw4Q0FBMEMsTUFyQmhDO0FBcUJ3QztBQUNsRCx3Q0FBb0MsTUF0QjFCO0FBc0JrQztBQUM1Qyw2Q0FBeUMsTUF2Qi9CO0FBdUJ1QztBQUNqRCwwQ0FBc0MsTUF4QjVCLENBd0JvQzs7QUF4QnBDLEdBRkM7QUE0QmJDLFdBQVMsRUFBRTtBQUNULHdDQUFvQyxNQUQzQixDQUNtQzs7QUFEbkM7QUE1QkUsQ0FBZixFOztBQ0xBO0FBRUEsbURBQWU7QUFDYnRCLFFBQU0sRUFBRUMsb0RBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLHVCQUFtQixNQURUO0FBQ2lCO0FBQzNCLDZCQUF5QixNQUZmO0FBRXVCO0FBQ2pDLCtCQUEyQixNQUhqQjtBQUd5QjtBQUNuQywrQkFBMkIsTUFKakI7QUFJeUI7QUFDbkMsMkJBQXVCLE1BTGI7QUFLcUI7QUFDL0IsOEJBQTBCLE1BTmhCO0FBTXdCO0FBQ2xDLHdCQUFvQixNQVBWO0FBT2tCO0FBQzVCLDZCQUF5QixNQVJmO0FBUXVCO0FBQ2pDLG9DQUFnQyxNQVR0QjtBQVM4QjtBQUN4QyxvQ0FBZ0MsTUFWdEI7QUFVOEI7QUFDeEMsb0NBQWdDLE1BWHRCO0FBVzhCO0FBQ3hDLDZCQUF5QixNQVpmO0FBWXVCO0FBQ2pDLGlDQUE2QixNQWJuQjtBQWEyQjtBQUNyQyx5QkFBcUIsTUFkWDtBQWNtQjtBQUM3QixrQ0FBOEIsTUFmcEI7QUFlNEI7QUFDdEMsMkJBQXVCLE1BaEJiLENBZ0JxQjs7QUFoQnJCLEdBRkM7QUFvQmJDLFdBQVMsRUFBRTtBQUNULDZCQUF5QixNQURoQjtBQUN3QjtBQUNqQyxvQ0FBZ0MsTUFGdkIsQ0FFK0I7O0FBRi9CO0FBcEJFLENBQWYsRTs7Q0NBQTs7QUFDQSx1REFBZTtBQUNidEIsUUFBTSxFQUFFQyxvREFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsMkJBQXVCLE1BRGI7QUFFViw0QkFBd0IsTUFGZDtBQUlWLDBCQUFzQixNQUpaO0FBS1YseUJBQXFCLE1BTFg7QUFNVixvQkFBZ0IsTUFOTjtBQU9WLHlCQUFxQixNQVBYO0FBU1YsMkJBQXVCLE1BVGI7QUFVViw0QkFBd0IsTUFWZDtBQVdWLCtCQUEyQixNQVhqQjtBQVlWLDRCQUF3QixNQVpkO0FBY1YsbUNBQStCLE1BZHJCO0FBZVYsOEJBQTBCLE1BZmhCO0FBaUJWLDBCQUFzQixNQWpCWjtBQWtCViw0QkFBd0IsTUFsQmQ7QUFtQlYsd0JBQW9CLE1BbkJWO0FBcUJWLDZCQUF5QixNQXJCZjtBQXNCViw4QkFBMEIsTUF0QmhCO0FBdUJWLCtCQUEyQixNQXZCakI7QUF3QlYsMEJBQXNCLE1BeEJaO0FBeUJWLHNCQUFrQixNQXpCUjtBQTJCVixvQ0FBZ0M7QUEzQnRCLEdBRkM7QUErQmJDLFdBQVMsRUFBRTtBQUNULHdCQUFvQixNQURYO0FBRVQsOEJBQTBCLE1BRmpCO0FBR1QsMEJBQXNCLE1BSGI7QUFJVCw2QkFBeUI7QUFKaEI7QUEvQkUsQ0FBZixFOztBQ0hBO0FBRUEsK0NBQWU7QUFDYnRCLFFBQU0sRUFBRUMsOENBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLDZCQUF5QixNQURmO0FBRVYsc0JBQWtCLE1BRlI7QUFHViwrQkFBMkIsTUFIakI7QUFJViwwQkFBc0IsTUFKWjtBQUtWLDJCQUF1QixNQUxiO0FBTVYsc0JBQWtCLE1BTlI7QUFPViwyQkFBdUIsTUFQYjtBQVFWLDZCQUF5QixNQVJmO0FBU1YsOEJBQTBCLE1BVGhCO0FBVVYsNEJBQXdCLE1BVmQ7QUFXViw2QkFBeUI7QUFYZixHQUZDO0FBZWJFLFlBQVUsRUFBRTtBQUNWLGdDQUE0QjtBQURsQjtBQWZDLENBQWYsRTs7QUNGQTtBQUNBO0NBSUE7O0FBRUEsdURBQWU7QUFDYnZCLFFBQU0sRUFBRUMsc0RBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLHNDQUFrQyxNQUR4QjtBQUNnQztBQUMxQyxzQ0FBa0MsTUFGeEI7QUFFZ0M7QUFDMUMscUNBQWlDLE1BSHZCO0FBRytCO0FBQ3pDLDRDQUF3QyxNQUo5QjtBQUlzQztBQUNoRCw0Q0FBd0MsTUFMOUI7QUFLc0M7QUFDaEQsNENBQXdDLE1BTjlCO0FBTXNDO0FBQ2hELDZDQUF5QyxNQVAvQjtBQU91QztBQUNqRCw2Q0FBeUMsTUFSL0I7QUFRdUM7QUFDakQsNkNBQXlDLE1BVC9CO0FBU3VDO0FBQ2pELHlDQUFxQyxNQVYzQjtBQVVtQztBQUM3Qyx1Q0FBbUMsTUFYekI7QUFXaUM7QUFDM0MsdUNBQW1DLE1BWnpCO0FBWWlDO0FBQzNDLDJDQUF1QyxNQWI3QjtBQWFxQztBQUMvQywwQ0FBc0MsTUFkNUI7QUFjb0M7QUFDOUMsaUNBQTZCLE1BZm5CO0FBZTJCO0FBQ3JDLDBDQUFzQyxNQWhCNUI7QUFnQm9DO0FBQzlDLCtCQUEyQixNQWpCakI7QUFpQnlCO0FBQ25DLG9DQUFnQyxNQWxCdEI7QUFrQjhCO0FBQ3hDLGtDQUE4QixNQW5CcEI7QUFtQjRCO0FBQ3RDLGdDQUE0QixNQXBCbEI7QUFvQjBCO0FBQ3BDLGlDQUE2QixNQXJCbkI7QUFxQjJCO0FBQ3JDLGdDQUE0QixNQXRCbEI7QUFzQjBCO0FBQ3BDLCtCQUEyQixNQXZCakI7QUF1QnlCO0FBQ25DLHVDQUFtQyxNQXhCekI7QUF3QmlDO0FBQzNDLHVDQUFtQyxNQXpCekI7QUF5QmlDO0FBQzNDLHVDQUFtQyxNQTFCekI7QUEwQmlDO0FBQzNDLDBDQUFzQyxNQTNCNUI7QUEyQm9DO0FBQzlDLHlDQUFxQyxNQTVCM0I7QUE0Qm1DO0FBQzdDLGtDQUE4QixNQTdCcEI7QUE2QjRCO0FBQ3RDLDBDQUFzQyxNQTlCNUI7QUE4Qm9DO0FBQzlDLDBDQUFzQyxNQS9CNUI7QUErQm9DO0FBQzlDLHdDQUFvQyxNQWhDMUI7QUFnQ2tDO0FBQzVDLGtDQUE4QixNQWpDcEI7QUFpQzRCO0FBQ3RDLHFDQUFpQyxNQWxDdkI7QUFrQytCO0FBQ3pDLGlDQUE2QixNQW5DbkI7QUFtQzJCO0FBQ3JDLHNDQUFrQyxNQXBDeEI7QUFvQ2dDO0FBQzFDLHVDQUFtQyxNQXJDekI7QUFxQ2lDO0FBQzNDLHNDQUFrQyxNQXRDeEI7QUFzQ2dDO0FBQzFDLGtDQUE4QixNQXZDcEI7QUF1QzRCO0FBQ3RDLGtDQUE4QixNQXhDcEI7QUF3QzRCO0FBQ3RDLGdDQUE0QixNQXpDbEI7QUF5QzBCO0FBQ3BDLGdDQUE0QixNQTFDbEI7QUEwQzBCO0FBQ3BDLHlDQUFxQyxNQTNDM0I7QUEyQ21DO0FBQzdDLDBDQUFzQyxNQTVDNUI7QUE0Q29DO0FBQzlDLDJDQUF1QyxNQTdDN0I7QUE2Q3FDO0FBQy9DLHVDQUFtQyxNQTlDekI7QUE4Q2lDO0FBQzNDLHVDQUFtQyxNQS9DekI7QUErQ2lDO0FBQzNDLHVDQUFtQyxNQWhEekI7QUFnRGlDO0FBQzNDLHVDQUFtQyxNQWpEekI7QUFpRGlDO0FBQzNDLCtCQUEyQixNQWxEakI7QUFrRHlCO0FBQ25DLDBDQUFzQyxNQW5ENUI7QUFtRG9DO0FBQzlDLHlDQUFxQyxNQXBEM0IsQ0FvRG1DOztBQXBEbkMsR0FGQztBQXdEYkUsWUFBVSxFQUFFO0FBQ1YsOENBQTBDLE1BRGhDO0FBQ3dDO0FBQ2xELHdDQUFvQyxNQUYxQjtBQUVrQztBQUM1QyxrQ0FBOEIsTUFIcEI7QUFHNEI7QUFDdEMsa0NBQThCLE1BSnBCLENBSTRCOztBQUo1QixHQXhEQztBQThEYkssV0FBUyxFQUFFO0FBQ1QsaUNBQTZCLE1BRHBCO0FBQzRCO0FBQ3JDLHNDQUFrQyxNQUZ6QixDQUVpQzs7QUFGakMsR0E5REU7QUFrRWJKLGlCQUFlLEVBQUU7QUFDZixxQ0FBaUMsS0FEbEIsQ0FDeUI7O0FBRHpCLEdBbEVKO0FBcUVidEIsVUFBUSxFQUFFLENBQ1I7QUFDRTtBQUNBO0FBQ0F6RCxNQUFFLEVBQUUsb0JBSE47QUFJRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLE1BQWpCLEVBQXlCLE1BQXpCLEVBQWlDLE1BQWpDLEVBQXlDLE1BQXpDLEVBQWlELE1BQWpELEVBQXlELE1BQXpELENBQU47QUFBd0UsU0FBRzJGLHVDQUFrQkE7QUFBN0YsS0FBdkIsQ0FKWjtBQUtFeEYsYUFBUyxFQUFFLENBQUN1RCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CQSxPQUFPLENBQUN3RyxLQUFSLENBQWNrQixLQUFkLENBQW9CLENBQUMsQ0FBckIsTUFBNEIsSUFMN0Q7QUFNRXRHLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ2tGO0FBQXJELE9BQVA7QUFDRDtBQVJILEdBRFE7QUFyRUcsQ0FBZixFOztBQ1BBO0FBQ0E7Q0FJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4REFBZTtBQUNiakIsUUFBTSxFQUFFQyxrRUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsK0NBQTJDLE1BRGpDO0FBQ3lDO0FBQ25ELGlEQUE2QyxNQUZuQztBQUUyQztBQUVyRCwwQ0FBc0MsTUFKNUI7QUFJb0M7QUFFOUMseUNBQXFDLE1BTjNCO0FBTW1DO0FBQzdDLHdDQUFvQyxNQVAxQjtBQU9rQztBQUM1Qyw0Q0FBd0MsTUFSOUI7QUFRc0M7QUFDaEQsMkNBQXVDLE1BVDdCO0FBU3FDO0FBQy9DLDJDQUF1QyxNQVY3QjtBQVVxQztBQUMvQywyQ0FBdUMsTUFYN0I7QUFXcUM7QUFDL0MsMkNBQXVDLE1BWjdCO0FBWXFDO0FBQy9DLDJDQUF1QyxNQWI3QjtBQWFxQztBQUMvQywwQ0FBc0MsTUFkNUI7QUFjb0M7QUFDOUMsd0NBQW9DLE1BZjFCO0FBZWtDO0FBQzVDLDRDQUF3QyxNQWhCOUI7QUFnQnNDO0FBQ2hELG9DQUFnQyxNQWpCdEI7QUFpQjhCO0FBQ3hDLCtDQUEyQyxNQWxCakM7QUFrQnlDO0FBQ25ELCtDQUEyQyxNQW5CakM7QUFtQnlDO0FBQ25ELCtDQUEyQyxNQXBCakM7QUFvQnlDO0FBQ25ELGdEQUE0QyxNQXJCbEM7QUFxQjBDO0FBQ3BELGdEQUE0QyxNQXRCbEM7QUFzQjBDO0FBQ3BELGdEQUE0QyxNQXZCbEM7QUF1QjBDO0FBQ3BELHVDQUFtQyxNQXhCekI7QUF3QmlDO0FBRTNDLGdEQUE0QyxNQTFCbEM7QUEwQjBDO0FBQ3BELGdEQUE0QyxNQTNCbEM7QUEyQjBDO0FBQ3BELCtDQUEyQyxNQTVCakM7QUE0QnlDO0FBQ25ELCtDQUEyQyxNQTdCakM7QUE2QnlDO0FBQ25ELG9DQUFnQyxNQTlCdEI7QUE4QjhCO0FBQ3hDLDZDQUF5QyxNQS9CL0I7QUErQnVDO0FBQ2pELGtDQUE4QixNQWhDcEI7QUFnQzRCO0FBQ3RDLHVDQUFtQyxNQWpDekI7QUFpQ2lDO0FBQzNDLHFDQUFpQyxNQWxDdkI7QUFrQytCO0FBQ3pDLG1DQUErQixNQW5DckI7QUFtQzZCO0FBRXZDLDBDQUFzQyxNQXJDNUI7QUFxQ29DO0FBQzlDLHNDQUFrQyxNQXRDeEI7QUFzQ2dDO0FBQzFDLHlDQUFxQyxNQXZDM0I7QUF1Q21DO0FBQzdDLHlDQUFxQyxNQXhDM0I7QUF3Q21DO0FBQzdDLCtCQUEyQixNQXpDakI7QUF5Q3lCO0FBQ25DLDBDQUFzQyxNQTFDNUI7QUEwQ29DO0FBQzlDLDBDQUFzQyxNQTNDNUI7QUEyQ29DO0FBRTlDLGlEQUE2QyxNQTdDbkM7QUE2QzJDO0FBQ3JELGtEQUE4QyxNQTlDcEM7QUE4QzRDO0FBQ3RELDRDQUF3QyxNQS9DOUI7QUErQ3NDO0FBQ2hELDZDQUF5QyxNQWhEL0I7QUFnRHVDO0FBQ2pELDZDQUF5QyxNQWpEL0I7QUFpRHVDO0FBQ2pELHFDQUFpQyxNQWxEdkI7QUFrRCtCO0FBQ3pDLGdDQUE0QixNQW5EbEI7QUFtRDBCO0FBQ3BDLGdDQUE0QixNQXBEbEI7QUFvRDBCO0FBQ3BDLGtDQUE4QixNQXJEcEI7QUFxRDRCO0FBQ3RDLGlEQUE2QyxNQXREbkM7QUFzRDJDO0FBQ3JELGlEQUE2QyxNQXZEbkM7QUF1RDJDO0FBQ3JELGlEQUE2QyxNQXhEbkM7QUF3RDJDO0FBQ3JELHFDQUFpQyxNQXpEdkI7QUF5RCtCO0FBRXpDLDZDQUF5QyxNQTNEL0I7QUEyRHVDO0FBQ2pELDZDQUF5QyxNQTVEL0I7QUE0RHVDO0FBQ2pELDZDQUF5QyxNQTdEL0I7QUE2RHVDO0FBQ2pELDZDQUF5QyxNQTlEL0I7QUE4RHVDO0FBQ2pELDhDQUEwQyxNQS9EaEM7QUErRHdDO0FBQ2xELDhDQUEwQyxNQWhFaEM7QUFnRXdDO0FBQ2xELHFDQUFpQyxNQWpFdkI7QUFpRStCO0FBRXpDLHdDQUFvQyxNQW5FMUI7QUFtRWtDO0FBQzVDLG9DQUFnQyxNQXBFdEI7QUFvRThCO0FBQ3hDLHlDQUFxQyxNQXJFM0I7QUFxRW1DO0FBQzdDLDBDQUFzQyxNQXRFNUI7QUFzRW9DO0FBQzlDLHlDQUFxQyxNQXZFM0I7QUF1RW1DO0FBRTdDLDhCQUEwQixNQXpFaEI7QUF5RXdCO0FBQ2xDLDJDQUF1QyxNQTFFN0I7QUEwRXFDO0FBQy9DLDJDQUF1QyxNQTNFN0I7QUEyRXFDO0FBQy9DLHNDQUFrQyxNQTVFeEI7QUE0RWdDO0FBQzFDLG9DQUFnQyxNQTdFdEI7QUE2RThCO0FBQ3hDLHlDQUFxQyxNQTlFM0I7QUE4RW1DO0FBQzdDLG9DQUFnQyxNQS9FdEI7QUErRThCO0FBRXhDLDRDQUF3QyxNQWpGOUI7QUFpRnNDO0FBQ2hELHFDQUFpQyxNQWxGdkI7QUFrRitCO0FBQ3pDLHFDQUFpQyxNQW5GdkI7QUFtRitCO0FBQ3pDLG1DQUErQixNQXBGckI7QUFvRjZCO0FBQ3ZDLG1DQUErQixNQXJGckI7QUFxRjZCO0FBQ3ZDLGlEQUE2QyxNQXRGbkM7QUFzRjJDO0FBQ3JELGtEQUE4QyxNQXZGcEM7QUF1RjRDO0FBQ3RELCtDQUEyQyxNQXhGakM7QUF3RnlDO0FBQ25ELCtDQUEyQyxNQXpGakM7QUF5RnlDO0FBQ25ELGdEQUE0QyxNQTFGbEM7QUEwRjBDO0FBQ3BELGdEQUE0QyxNQTNGbEM7QUEyRjBDO0FBQ3BELGtDQUE4QixNQTVGcEI7QUE0RjRCO0FBQ3RDLDRDQUF3QyxNQTdGOUI7QUE2RnNDO0FBQ2hELDZDQUF5QyxNQTlGL0I7QUE4RnVDO0FBQ2pELDZDQUF5QyxNQS9GL0I7QUErRnVDO0FBQ2pELGlEQUE2QyxNQWhHbkM7QUFnRzJDO0FBQ3JELGlEQUE2QyxNQWpHbkM7QUFpRzJDO0FBQ3JELGlEQUE2QyxNQWxHbkMsQ0FrRzJDOztBQWxHM0MsR0FGQztBQXNHYkUsWUFBVSxFQUFFO0FBQ1YscUNBQWlDLE1BRHZCO0FBQytCO0FBQ3pDLHFDQUFpQyxNQUZ2QjtBQUUrQjtBQUN6QywwQ0FBc0MsTUFINUI7QUFHb0M7QUFDOUMsNkNBQXlDLE1BSi9CO0FBSXVDO0FBQ2pELHFDQUFpQyxNQUx2QixDQUsrQjs7QUFML0IsR0F0R0M7QUE2R2JELFdBQVMsRUFBRTtBQUNULG9EQUFnRCxNQUR2QztBQUMrQztBQUN4RCxxQ0FBaUMsTUFGeEIsQ0FFZ0M7O0FBRmhDLEdBN0dFO0FBaUhiRSxpQkFBZSxFQUFFO0FBQ2Ysd0NBQW9DLEtBRHJCLENBQzRCOztBQUQ1QixHQWpISjtBQW9IYnRCLFVBQVEsRUFBRSxDQUNSO0FBQ0U7QUFDQXpELE1BQUUsRUFBRSw2QkFGTjtBQUdFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsTUFBakIsRUFBeUIsTUFBekIsRUFBaUMsTUFBakMsRUFBeUMsTUFBekMsRUFBaUQsTUFBakQsRUFBeUQsTUFBekQsQ0FBTjtBQUF3RSxTQUFHMkYsdUNBQWtCQTtBQUE3RixLQUF2QixDQUhaO0FBSUV4RixhQUFTLEVBQUUsQ0FBQ3VELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0JBLE9BQU8sQ0FBQ3dHLEtBQVIsQ0FBY2tCLEtBQWQsQ0FBb0IsQ0FBQyxDQUFyQixNQUE0QixJQUo3RDtBQUtFdEcsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDa0Y7QUFBckQsT0FBUDtBQUNEO0FBUEgsR0FEUSxFQVVSO0FBQ0V4RSxNQUFFLEVBQUUsOEJBRE47QUFFRUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWxELFFBQUUsRUFBRTtBQUFOLEtBQW5CLENBRlo7QUFHRVUsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCRSxZQUFJLEVBQUcsR0FBRTlDLE9BQU8sQ0FBQzRCLE1BQU8sS0FBSTVCLE9BQU8sQ0FBQ2tGLE9BQVE7QUFBNUQsT0FBUDtBQUNEO0FBTEgsR0FWUSxFQWlCUjtBQUNFeEUsTUFBRSxFQUFFLG1DQUROO0FBRUVFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUFuQixDQUZaO0FBR0VVLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkUsWUFBSSxFQUFHLEdBQUU5QyxPQUFPLENBQUM0QixNQUFPLEtBQUk1QixPQUFPLENBQUNrRixPQUFRO0FBQTVELE9BQVA7QUFDRDtBQUxILEdBakJRO0FBcEhHLENBQWYsRTs7QUNoQkE7QUFFQSwwQ0FBZTtBQUNiakIsUUFBTSxFQUFFQyxrRUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsK0JBQTJCLE1BRGpCO0FBRVYsZ0NBQTRCLE1BRmxCO0FBR1YscUJBQWlCLE1BSFA7QUFJVix5QkFBcUI7QUFKWCxHQUZDO0FBUWJFLFlBQVUsRUFBRTtBQUNWLHlCQUFxQixNQURYO0FBRVYsc0JBQWtCO0FBRlIsR0FSQztBQVliSyxXQUFTLEVBQUU7QUFDVCxvQkFBZ0IsTUFEUDtBQUVULDBCQUFzQixNQUZiO0FBRXFCO0FBQzlCLDBCQUFzQixNQUhiLENBR3FCOztBQUhyQjtBQVpFLENBQWYsRTs7Q0NBQTtBQUNBO0FBQ0E7O0FBQ0EsMENBQWU7QUFDYjVCLFFBQU0sRUFBRUMsOEVBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLCtCQUEyQixNQURqQjtBQUVWLGdDQUE0QixNQUZsQjtBQUdWLHlDQUFxQyxNQUgzQjtBQUlWLCtCQUEyQixNQUpqQjtBQUtWLCtCQUEyQixNQUxqQjtBQU1WLHlCQUFxQjtBQU5YLEdBRkM7QUFVYkUsWUFBVSxFQUFFO0FBQ1YseUJBQXFCLE1BRFg7QUFFVixzQkFBa0I7QUFGUixHQVZDO0FBY2JLLFdBQVMsRUFBRTtBQUNULDRCQUF3QixNQURmO0FBRVQsNEJBQXdCLE1BRmY7QUFHVCwwQkFBc0IsTUFIYjtBQUdxQjtBQUM5QiwwQkFBc0IsTUFKYixDQUlxQjs7QUFKckI7QUFkRSxDQUFmLEU7O0FDTEE7QUFDQTtDQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsMENBQWU7QUFDYjVCLFFBQU0sRUFBRUMsd0RBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLDJCQUF1QixNQURiO0FBRVYsK0JBQTJCO0FBRmpCLEdBRkM7QUFNYm5CLFVBQVEsRUFBRSxDQUNSO0FBQ0V6RCxNQUFFLEVBQUUsU0FETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBYyxTQUFHMkYsdUNBQWtCQTtBQUFuQyxLQUF2QixDQUZaO0FBR0VqRixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTEMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFGVjtBQUdMUyxZQUFJLEVBQUU7QUFDSkMsWUFBRSxFQUFFLFFBREE7QUFFSkksWUFBRSxFQUFFbkQsT0FBTyxDQUFDa0YsT0FGUjtBQUVpQjtBQUNyQjlCLFlBQUUsRUFBRSxpQkFIQTtBQUlKQyxZQUFFLEVBQUVyRCxPQUFPLENBQUNrRixPQUpSO0FBSWlCO0FBQ3JCNUIsWUFBRSxFQUFFdEQsT0FBTyxDQUFDa0YsT0FMUjtBQUtpQjtBQUNyQjNCLFlBQUUsRUFBRTtBQU5BO0FBSEQsT0FBUDtBQVlEO0FBaEJILEdBRFE7QUFORyxDQUFmLEU7O0FDVkE7QUFDQTtDQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsMENBQWU7QUFDYlUsUUFBTSxFQUFFQyxvRUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsMkJBQXVCLE1BRGI7QUFFVixzQkFBa0IsTUFGUjtBQUdWLCtCQUEyQjtBQUhqQixHQUZDO0FBT2JDLFdBQVMsRUFBRTtBQUNULDRCQUF3QjtBQURmLEdBUEU7QUFVYnBCLFVBQVEsRUFBRSxDQUNSO0FBQ0V6RCxNQUFFLEVBQUUsZUFETjtBQUVFO0FBQ0FFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBSFo7QUFJRXJDLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ29GO0FBQXJELE9BQVA7QUFDRDtBQU5ILEdBRFEsRUFTUjtBQUNFMUUsTUFBRSxFQUFFLFNBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWMsU0FBRzJGLHVDQUFrQkE7QUFBbkMsS0FBdkIsQ0FGWjtBQUdFakYsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BRlY7QUFHTFMsWUFBSSxFQUFFO0FBQ0pDLFlBQUUsRUFBRSxRQURBO0FBRUpJLFlBQUUsRUFBRW5ELE9BQU8sQ0FBQ2tGLE9BRlI7QUFFaUI7QUFDckI5QixZQUFFLEVBQUUsaUJBSEE7QUFJSkMsWUFBRSxFQUFFckQsT0FBTyxDQUFDa0YsT0FKUjtBQUlpQjtBQUNyQjVCLFlBQUUsRUFBRXRELE9BQU8sQ0FBQ2tGLE9BTFI7QUFLaUI7QUFDckIzQixZQUFFLEVBQUU7QUFOQTtBQUhELE9BQVA7QUFZRDtBQWhCSCxHQVRRO0FBVkcsQ0FBZixFOztBQ1ZBO0FBRUEsMENBQWU7QUFDYlUsUUFBTSxFQUFFQyw4REFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsMEJBQXNCLE1BRFo7QUFFViwwQkFBc0IsTUFGWjtBQUdWLHFCQUFpQixNQUhQO0FBSVYsNEJBQXdCO0FBSmQsR0FGQztBQVFiRSxZQUFVLEVBQUU7QUFDViwrQkFBMkIsTUFEakI7QUFFViwrQkFBMkIsTUFGakI7QUFHVix5QkFBcUI7QUFIWCxHQVJDO0FBYWJLLFdBQVMsRUFBRTtBQUNULHVCQUFtQjtBQURWO0FBYkUsQ0FBZixFOztDQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSwwQ0FBZTtBQUNiNUIsUUFBTSxFQUFFQywwRUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsMEJBQXNCLE1BRFo7QUFFViwwQkFBc0IsTUFGWjtBQUdWLHFCQUFpQixNQUhQO0FBSVYsNEJBQXdCO0FBSmQsR0FGQztBQVFiRSxZQUFVLEVBQUU7QUFDViwrQkFBMkIsTUFEakI7QUFFViwrQkFBMkIsTUFGakI7QUFHViwrQkFBMkIsTUFIakI7QUFJViwrQkFBMkIsTUFKakI7QUFLVix5QkFBcUI7QUFMWDtBQVJDLENBQWYsRTs7QUNSQTtBQUVBLDBDQUFlO0FBQ2J2QixRQUFNLEVBQUVDLDREQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViw4QkFBMEIsTUFEaEI7QUFFVixzQkFBa0IsTUFGUjtBQUdWLHdCQUFvQixNQUhWO0FBSVYsd0JBQW9CLE1BSlY7QUFLVix1QkFBbUIsTUFMVDtBQU1WLHVCQUFtQixNQU5UO0FBT1YscUJBQWlCLE1BUFA7QUFRViwrQkFBMkIsTUFSakI7QUFTViw4QkFBMEIsTUFUaEI7QUFVViw2QkFBeUIsTUFWZjtBQVdWLHdCQUFvQixNQVhWO0FBWVYsc0JBQWtCO0FBWlI7QUFGQyxDQUFmLEU7O0FDRkE7QUFDQTtDQUlBO0FBQ0E7QUFDQTs7QUFDQSwwQ0FBZTtBQUNickIsUUFBTSxFQUFFQyx3RUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsOEJBQTBCLE1BRGhCO0FBRVYsc0JBQWtCLE1BRlI7QUFHVix3QkFBb0IsTUFIVjtBQUlWLHdCQUFvQixNQUpWO0FBS1YscUJBQWlCLE1BTFA7QUFNVixxQkFBaUIsTUFOUDtBQU9WLCtCQUEyQixNQVBqQjtBQVFWLDhCQUEwQixNQVJoQjtBQVNWLCtCQUEyQixNQVRqQjtBQVVWLCtCQUEyQixNQVZqQjtBQVdWLHdCQUFvQjtBQVhWLEdBRkM7QUFlYkUsWUFBVSxFQUFFO0FBQ1YsZ0NBQTRCLE1BRGxCO0FBRVYsZ0NBQTRCLE1BRmxCO0FBR1YsMEJBQXNCLE1BSFo7QUFJViwwQkFBc0IsTUFKWjtBQUtWLDBCQUFzQjtBQUxaLEdBZkM7QUFzQmJyQixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLHdCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFja0IsWUFBTSxFQUFFO0FBQXRCLEtBQXZCLENBRlo7QUFHRWdGLGNBQVUsRUFBRWhELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFja0IsWUFBTSxFQUFFO0FBQXRCLEtBQXZCLENBSGQ7QUFJRTZDLGNBQVUsRUFBRWIsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWNrQixZQUFNLEVBQUU7QUFBdEIsS0FBdkIsQ0FKZDtBQUtFOEMsY0FBVSxFQUFFZCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBY2tCLFlBQU0sRUFBRTtBQUF0QixLQUF2QixDQUxkO0FBTUUrQyxjQUFVLEVBQUVmLGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFja0IsWUFBTSxFQUFFO0FBQXRCLEtBQXZCLENBTmQ7QUFPRWdELGNBQVUsRUFBRWhCLGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFja0IsWUFBTSxFQUFFO0FBQXRCLEtBQXZCLENBUGQ7QUFRRWQsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDNEgsZUFBTCxHQUF1QjNILE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQ0Q7QUFWSCxHQURRLEVBYVI7QUFDRTNCLE1BQUUsRUFBRSxnQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBYyxTQUFHMkYsdUNBQWtCQTtBQUFuQyxLQUF2QixDQUZaO0FBR0V4RixhQUFTLEVBQUUsQ0FBQ2QsSUFBRCxFQUFPQyxPQUFQLEtBQW1CRCxJQUFJLENBQUM0SCxlQUFMLEtBQXlCM0gsT0FBTyxDQUFDcUMsTUFIakU7QUFJRWpCLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQ0w0QyxZQUFJLEVBQUUsTUFERDtBQUVMQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUZWO0FBR0xTLFlBQUksRUFBRTtBQUNKQyxZQUFFLEVBQUUsVUFEQTtBQUVKSSxZQUFFLEVBQUVuRCxPQUFPLENBQUNrRixPQUZSO0FBRWlCO0FBQ3JCOUIsWUFBRSxFQUFFLGlCQUhBO0FBSUpDLFlBQUUsRUFBRXJELE9BQU8sQ0FBQ2tGLE9BSlI7QUFJaUI7QUFDckI1QixZQUFFLEVBQUV0RCxPQUFPLENBQUNrRixPQUxSO0FBS2lCO0FBQ3JCM0IsWUFBRSxFQUFFdkQsT0FBTyxDQUFDa0YsT0FOUixDQU1pQjs7QUFOakI7QUFIRCxPQUFQO0FBWUQ7QUFqQkgsR0FiUTtBQXRCRyxDQUFmLEU7O0FDUkE7QUFDQTtBQUVBO0FBRUEsMENBQWU7QUFDYmpCLFFBQU0sRUFBRUMsa0VBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLGtCQUFjLE1BREo7QUFDWTtBQUN0QiwwQkFBc0IsTUFGWjtBQUVvQjtBQUM5QixrQkFBYyxNQUhKO0FBR1k7QUFDdEIsd0JBQW9CLE1BSlY7QUFJa0I7QUFDNUIsdUJBQW1CLE1BTFQsQ0FLaUI7O0FBTGpCLEdBRkM7QUFTYkUsWUFBVSxFQUFFO0FBQ1YseUJBQXFCLE1BRFgsQ0FDbUI7O0FBRG5CLEdBVEM7QUFZYnJCLFVBQVEsRUFBRSxDQUNSO0FBQ0U7QUFDQXpELE1BQUUsRUFBRSx5QkFGTjtBQUdFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUhaO0FBSUVyQyxXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNvRjtBQUFyRCxPQUFQO0FBQ0Q7QUFOSCxHQURRLEVBU1I7QUFDRTtBQUNBMUUsTUFBRSxFQUFFLGNBRk47QUFHRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FIWjtBQUlFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDNkgsTUFBTCxHQUFjN0gsSUFBSSxDQUFDNkgsTUFBTCxJQUFlLEVBQTdCO0FBQ0E3SCxVQUFJLENBQUM2SCxNQUFMLENBQVk1SCxPQUFPLENBQUNxQyxNQUFwQixJQUE4QixJQUE5QjtBQUNEO0FBUEgsR0FUUSxFQWtCUjtBQUNFM0IsTUFBRSxFQUFFLGNBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDNkgsTUFBTCxHQUFjN0gsSUFBSSxDQUFDNkgsTUFBTCxJQUFlLEVBQTdCO0FBQ0E3SCxVQUFJLENBQUM2SCxNQUFMLENBQVk1SCxPQUFPLENBQUNxQyxNQUFwQixJQUE4QixLQUE5QjtBQUNEO0FBTkgsR0FsQlEsRUEwQlI7QUFDRTNCLE1BQUUsRUFBRSw0QkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBYyxTQUFHMkYsdUNBQWtCQTtBQUFuQyxLQUF2QixDQUZaO0FBR0V4RixhQUFTLEVBQUUsQ0FBQ2QsSUFBRCxFQUFPQyxPQUFQLEtBQW1CLENBQUNELElBQUksQ0FBQzZILE1BQUwsQ0FBWTVILE9BQU8sQ0FBQ3FDLE1BQXBCLENBSGpDO0FBSUVqQixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTEMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFGVjtBQUdMUyxZQUFJLEVBQUU7QUFDSkMsWUFBRSxFQUFHLEdBQUUvQyxPQUFPLENBQUNrRixPQUFRLFdBRG5CO0FBRUovQixZQUFFLEVBQUcsR0FBRW5ELE9BQU8sQ0FBQ2tGLE9BQVEsYUFGbkI7QUFHSjlCLFlBQUUsRUFBRyxHQUFFcEQsT0FBTyxDQUFDa0YsT0FBUSxlQUhuQjtBQUlKN0IsWUFBRSxFQUFHLEdBQUVyRCxPQUFPLENBQUNrRixPQUFRLFNBSm5CO0FBS0o1QixZQUFFLEVBQUcsR0FBRXRELE9BQU8sQ0FBQ2tGLE9BQVE7QUFMbkI7QUFIRCxPQUFQO0FBV0Q7QUFoQkgsR0ExQlEsRUE0Q1I7QUFDRXhFLE1BQUUsRUFBRSxnQ0FETjtBQUVFRSxZQUFRLEVBQUVnRCwrQ0FBQSxDQUFzQjtBQUFFbEQsUUFBRSxFQUFFO0FBQU4sS0FBdEIsQ0FGWjtBQUdFSSxPQUFHLEVBQUUsQ0FBQ2YsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3RCRCxVQUFJLENBQUM4SCxZQUFMLEdBQW9COUgsSUFBSSxDQUFDOEgsWUFBTCxJQUFxQixFQUF6QztBQUNBOUgsVUFBSSxDQUFDOEgsWUFBTCxDQUFrQjdHLElBQWxCLENBQXVCaEIsT0FBTyxDQUFDcUMsTUFBL0I7QUFDRDtBQU5ILEdBNUNRLEVBb0RSO0FBQ0U7QUFDQTNCLE1BQUUsRUFBRSx3QkFGTjtBQUdFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBYyxTQUFHMkYsdUNBQWtCQTtBQUFuQyxLQUF2QixDQUhaO0FBSUVsRixtQkFBZSxFQUFFLEVBSm5CO0FBS0VDLFdBQU8sRUFBRSxDQUFDckIsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQzFCLFdBQUssTUFBTThILENBQVgsSUFBZ0IvSCxJQUFJLENBQUM4SCxZQUFyQixFQUFtQztBQUNqQyxlQUFPO0FBQ0xqRixjQUFJLEVBQUUsTUFERDtBQUVMQyxlQUFLLEVBQUU5QyxJQUFJLENBQUM4SCxZQUFMLENBQWtCQyxDQUFsQixDQUZGO0FBR0xoRixjQUFJLEVBQUU7QUFDSkMsY0FBRSxFQUFHLEdBQUUvQyxPQUFPLENBQUNrRixPQUFRLHFCQURuQjtBQUVKL0IsY0FBRSxFQUFHLEdBQUVuRCxPQUFPLENBQUNrRixPQUFRLG1CQUZuQjtBQUdKOUIsY0FBRSxFQUFHLEdBQUVwRCxPQUFPLENBQUNrRixPQUFRLHdCQUhuQjtBQUlKN0IsY0FBRSxFQUFHLEdBQUVyRCxPQUFPLENBQUNrRixPQUFRLFNBSm5CO0FBS0o1QixjQUFFLEVBQUcsR0FBRXRELE9BQU8sQ0FBQ2tGLE9BQVE7QUFMbkI7QUFIRCxTQUFQO0FBV0Q7QUFDRjtBQW5CSCxHQXBEUSxFQXlFUjtBQUNFeEUsTUFBRSxFQUFFLHdCQUROO0FBRUVFLFlBQVEsRUFBRWdELCtDQUFBLENBQXNCO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUF0QixDQUZaO0FBR0VPLGdCQUFZLEVBQUUsRUFIaEI7QUFHb0I7QUFDbEJILE9BQUcsRUFBR2YsSUFBRCxJQUFVO0FBQ2IsYUFBT0EsSUFBSSxDQUFDOEgsWUFBWjtBQUNEO0FBTkgsR0F6RVE7QUFaRyxDQUFmLEU7O0FDTEE7QUFDQTtDQUlBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNRSxLQUFLLEdBQUlDLEdBQUQsSUFBUztBQUNyQixTQUFPO0FBQ0xqRixNQUFFLEVBQUVpRixHQUFHLEdBQUcsV0FETDtBQUVMN0UsTUFBRSxFQUFFNkUsR0FBRyxHQUFHLGFBRkw7QUFHTDVFLE1BQUUsRUFBRTRFLEdBQUcsR0FBRyxnQkFITDtBQUlMM0UsTUFBRSxFQUFFMkUsR0FBRyxHQUFHLFNBSkw7QUFLTDFFLE1BQUUsRUFBRTBFLEdBQUcsR0FBRyxRQUxMO0FBTUx6RSxNQUFFLEVBQUV5RSxHQUFHLEdBQUc7QUFOTCxHQUFQO0FBUUQsQ0FURDs7QUFXQSwwQ0FBZTtBQUNiL0QsUUFBTSxFQUFFQyw4RUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1Ysa0JBQWMsTUFESjtBQUNZO0FBQ3RCLGtCQUFjLE1BRko7QUFFWTtBQUN0Qix3QkFBb0IsTUFIVjtBQUdrQjtBQUM1QixrQ0FBOEIsTUFKcEI7QUFJNEI7QUFDdEMsZ0NBQTRCLE1BTGxCO0FBSzBCO0FBQ3BDLGlCQUFhLE1BTkgsQ0FNVzs7QUFOWCxHQUZDO0FBVWJFLFlBQVUsRUFBRTtBQUNWLHlCQUFxQixNQURYLENBQ21COztBQURuQixHQVZDO0FBYWJELFdBQVMsRUFBRTtBQUNULDhCQUEwQixNQURqQjtBQUN5QjtBQUNsQywwQkFBc0IsTUFGYjtBQUdULGtDQUE4QjtBQUhyQixHQWJFO0FBa0JicEIsVUFBUSxFQUFFLENBQ1I7QUFDRTtBQUNBekQsTUFBRSxFQUFFLGNBRk47QUFHRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FIWjtBQUlFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDNkgsTUFBTCxHQUFjN0gsSUFBSSxDQUFDNkgsTUFBTCxJQUFlLEVBQTdCO0FBQ0E3SCxVQUFJLENBQUM2SCxNQUFMLENBQVk1SCxPQUFPLENBQUNxQyxNQUFwQixJQUE4QixJQUE5QjtBQUNEO0FBUEgsR0FEUSxFQVVSO0FBQ0UzQixNQUFFLEVBQUUsY0FETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0UzQyxPQUFHLEVBQUUsQ0FBQ2YsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3RCRCxVQUFJLENBQUM2SCxNQUFMLEdBQWM3SCxJQUFJLENBQUM2SCxNQUFMLElBQWUsRUFBN0I7QUFDQTdILFVBQUksQ0FBQzZILE1BQUwsQ0FBWTVILE9BQU8sQ0FBQ3FDLE1BQXBCLElBQThCLEtBQTlCO0FBQ0Q7QUFOSCxHQVZRLEVBa0JSO0FBQ0UzQixNQUFFLEVBQUUsNEJBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWMsU0FBRzJGLHVDQUFrQkE7QUFBbkMsS0FBdkIsQ0FGWjtBQUdFeEYsYUFBUyxFQUFFLENBQUNkLElBQUQsRUFBT0MsT0FBUCxLQUFtQixDQUFDRCxJQUFJLENBQUM2SCxNQUFOLElBQWdCLENBQUM3SCxJQUFJLENBQUM2SCxNQUFMLENBQVk1SCxPQUFPLENBQUNxQyxNQUFwQixDQUhqRDtBQUlFakIsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFaUYsS0FBSyxDQUFDL0gsT0FBTyxDQUFDa0YsT0FBVDtBQUFsRCxPQUFQO0FBQ0Q7QUFOSCxHQWxCUSxFQTBCUjtBQUNFeEUsTUFBRSxFQUFFLHFCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBRlo7QUFHRXhGLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUIsQ0FBQ0QsSUFBSSxDQUFDNkgsTUFBTixJQUFnQixDQUFDN0gsSUFBSSxDQUFDNkgsTUFBTCxDQUFZNUgsT0FBTyxDQUFDcUMsTUFBcEIsQ0FIakQ7QUFJRWpCLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRWlGLEtBQUssQ0FBQy9ILE9BQU8sQ0FBQ2tGLE9BQVQ7QUFBbEQsT0FBUDtBQUNEO0FBTkgsR0ExQlEsRUFrQ1I7QUFDRXhFLE1BQUUsRUFBRSxvQ0FETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBYyxTQUFHMkYsdUNBQWtCQTtBQUFuQyxLQUF2QixDQUZaO0FBR0V4RixhQUFTLEVBQUUsQ0FBQ2QsSUFBRCxFQUFPQyxPQUFQLEtBQW1CLENBQUNELElBQUksQ0FBQzZILE1BQU4sSUFBZ0IsQ0FBQzdILElBQUksQ0FBQzZILE1BQUwsQ0FBWTVILE9BQU8sQ0FBQ3FDLE1BQXBCLENBSGpEO0FBSUVqQixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUVpRixLQUFLLENBQUMvSCxPQUFPLENBQUNrRixPQUFUO0FBQWxELE9BQVA7QUFDRDtBQU5ILEdBbENRLEVBMENSO0FBQ0V4RSxNQUFFLEVBQUUsb0JBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWMsU0FBRzJGLHVDQUFrQkE7QUFBbkMsS0FBdkIsQ0FGWjtBQUdFeEYsYUFBUyxFQUFFLENBQUNkLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUM1QjtBQUNBO0FBQ0EsVUFBSSxDQUFDRCxJQUFJLENBQUNrSSxLQUFOLElBQWUsQ0FBQ2xJLElBQUksQ0FBQ2tJLEtBQUwsQ0FBV2pJLE9BQU8sQ0FBQ3FDLE1BQW5CLENBQXBCLEVBQ0UsT0FBTyxJQUFQO0FBRUYsYUFBT3RDLElBQUksQ0FBQ2tJLEtBQUwsQ0FBV2pJLE9BQU8sQ0FBQ3FDLE1BQW5CLENBQVA7QUFDQSxhQUFPLEtBQVA7QUFDRCxLQVhIO0FBWUVqQixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNrRjtBQUFyRCxPQUFQO0FBQ0Q7QUFkSCxHQTFDUSxFQTBEUjtBQUNFeEUsTUFBRSxFQUFFLG9CQUROO0FBRUVFLFlBQVEsRUFBRWdELCtDQUFBLENBQXNCO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUF0QixDQUZaO0FBR0VJLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQ2tJLEtBQUwsR0FBYWxJLElBQUksQ0FBQ2tJLEtBQUwsSUFBYyxFQUEzQjtBQUNBbEksVUFBSSxDQUFDa0ksS0FBTCxDQUFXakksT0FBTyxDQUFDcUMsTUFBbkIsSUFBNkIsSUFBN0I7QUFDRDtBQU5ILEdBMURRLEVBa0VSO0FBQ0UzQixNQUFFLEVBQUUsZ0NBRE47QUFFRUUsWUFBUSxFQUFFZ0QsK0NBQUEsQ0FBc0I7QUFBRWxELFFBQUUsRUFBRTtBQUFOLEtBQXRCLENBRlo7QUFHRUksT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDOEgsWUFBTCxHQUFvQjlILElBQUksQ0FBQzhILFlBQUwsSUFBcUIsRUFBekM7QUFDQTlILFVBQUksQ0FBQzhILFlBQUwsQ0FBa0I3RyxJQUFsQixDQUF1QmhCLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQ0Q7QUFOSCxHQWxFUSxFQTBFUjtBQUNFO0FBQ0EzQixNQUFFLEVBQUUsd0JBRk47QUFHRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWMsU0FBRzJGLHVDQUFrQkE7QUFBbkMsS0FBdkIsQ0FIWjtBQUlFbEYsbUJBQWUsRUFBRSxFQUpuQjtBQUtFQyxXQUFPLEVBQUUsQ0FBQ3JCLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUMxQixXQUFLLE1BQU04SCxDQUFYLElBQWdCL0gsSUFBSSxDQUFDOEgsWUFBckIsRUFBbUM7QUFDakMsZUFBTztBQUNMakYsY0FBSSxFQUFFLE1BREQ7QUFFTEMsZUFBSyxFQUFFOUMsSUFBSSxDQUFDOEgsWUFBTCxDQUFrQkMsQ0FBbEIsQ0FGRjtBQUdMaEYsY0FBSSxFQUFFO0FBQ0pDLGNBQUUsRUFBRyxHQUFFL0MsT0FBTyxDQUFDa0YsT0FBUSxxQkFEbkI7QUFFSi9CLGNBQUUsRUFBRyxHQUFFbkQsT0FBTyxDQUFDa0YsT0FBUSxtQkFGbkI7QUFHSjlCLGNBQUUsRUFBRyxHQUFFcEQsT0FBTyxDQUFDa0YsT0FBUSx3QkFIbkI7QUFJSjdCLGNBQUUsRUFBRyxHQUFFckQsT0FBTyxDQUFDa0YsT0FBUSxTQUpuQjtBQUtKNUIsY0FBRSxFQUFHLEdBQUV0RCxPQUFPLENBQUNrRixPQUFRO0FBTG5CO0FBSEQsU0FBUDtBQVdEO0FBQ0Y7QUFuQkgsR0ExRVEsRUErRlI7QUFDRXhFLE1BQUUsRUFBRSx3QkFETjtBQUVFRSxZQUFRLEVBQUVnRCwrQ0FBQSxDQUFzQjtBQUFFbEQsUUFBRSxFQUFFO0FBQU4sS0FBdEIsQ0FGWjtBQUdFO0FBQ0FPLGdCQUFZLEVBQUUsRUFKaEI7QUFLRUgsT0FBRyxFQUFHZixJQUFELElBQVU7QUFDYixhQUFPQSxJQUFJLENBQUM4SCxZQUFaO0FBQ0EsYUFBTzlILElBQUksQ0FBQ2tJLEtBQVo7QUFDRDtBQVJILEdBL0ZRO0FBbEJHLENBQWYsRTs7QUNwQkE7QUFFQSwwQ0FBZTtBQUNiaEUsUUFBTSxFQUFFQyxzREFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1Ysa0JBQWMsTUFESjtBQUNZO0FBQ3RCLHVCQUFtQixNQUZUO0FBR1YsdUJBQW1CLE1BSFQ7QUFJViwyQkFBdUIsTUFKYjtBQUlxQjtBQUMvQiwyQkFBdUIsTUFMYjtBQUtxQjtBQUMvQixxQkFBaUIsTUFOUDtBQU1lO0FBQ3pCLHNCQUFrQixNQVBSO0FBUVYsMEJBQXNCLE1BUlo7QUFRb0I7QUFDOUIsMEJBQXNCLE1BVFo7QUFTb0I7QUFDOUIseUJBQXFCLE1BVlg7QUFXVixvQkFBZ0I7QUFYTixHQUZDO0FBZWJFLFlBQVUsRUFBRTtBQUNWLHdCQUFvQixNQURWO0FBQ2tCO0FBQzVCLHFCQUFpQixNQUZQLENBRWU7O0FBRmYsR0FmQztBQW1CYkssV0FBUyxFQUFFO0FBQ1Q7QUFDQSxnQ0FBNEI7QUFGbkI7QUFuQkUsQ0FBZixFOztBQ0ZzRDtBQUd0RCxzREFBc0Q7QUFDdEQsbUNBQW1DO0FBQ25DLHFEQUFxRDtBQUNyRCwrRUFBK0U7QUFFL0UsTUFBTSxVQUFVLEdBQTBCO0lBQ3hDLE1BQU0sRUFBRSxrRUFBNEI7SUFDcEMsVUFBVSxFQUFFO1FBQ1YsOEVBQThFO1FBQzlFLGlFQUFpRTtRQUVqRSxZQUFZLEVBQUUsTUFBTTtRQUNwQixpQkFBaUIsRUFBRSxNQUFNO1FBQ3pCLGlCQUFpQixFQUFFLE1BQU07UUFDekIscUJBQXFCLEVBQUUsTUFBTTtRQUM3QixxQkFBcUIsRUFBRSxNQUFNO1FBQzdCLGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLGdCQUFnQixFQUFFLE1BQU07UUFDeEIsb0JBQW9CLEVBQUUsTUFBTTtRQUM1QixtQkFBbUIsRUFBRSxNQUFNO1FBQzNCLGNBQWMsRUFBRSxNQUFNO1FBQ3RCLGlCQUFpQixFQUFFLE1BQU07S0FDMUI7SUFDRCxVQUFVLEVBQUU7UUFDVixrQkFBa0IsRUFBRSxNQUFNO1FBQzFCLGlCQUFpQixFQUFFLE1BQU07UUFDekIsaUJBQWlCLEVBQUUsTUFBTTtRQUN6QixtQkFBbUIsRUFBRSxNQUFNO0tBQzVCO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsbUJBQW1CLEVBQUUsU0FBUztRQUM5QixvQkFBb0IsRUFBRSxNQUFNO1FBQzVCLDBCQUEwQixFQUFFLE1BQU07UUFDbEMsV0FBVyxFQUFFLE1BQU07S0FDcEI7SUFDRCxRQUFRLEVBQUU7UUFDUixjQUFjLEVBQUUsTUFBTTtLQUN2QjtDQUNGLENBQUM7QUFFRiwwQ0FBZSxVQUFVLEVBQUM7OztBQzNDMUI7QUFDQTtBQUVBOztBQUVBLE1BQU1xQyxTQUFTLEdBQUlGLEdBQUQsSUFBUztBQUN6QixTQUFPO0FBQ0xqRixNQUFFLEVBQUVpRixHQUFHLEdBQUcsZUFETDtBQUVMN0UsTUFBRSxFQUFFNkUsR0FBRyxHQUFHLGtCQUZMO0FBR0w1RSxNQUFFLEVBQUU0RSxHQUFHLEdBQUcsaUJBSEw7QUFJTDNFLE1BQUUsRUFBRTJFLEdBQUcsR0FBRyxXQUpMO0FBS0wxRSxNQUFFLEVBQUUwRSxHQUFHLEdBQUcsV0FMTDtBQU1MekUsTUFBRSxFQUFFeUUsR0FBRyxHQUFHO0FBTkwsR0FBUDtBQVFELENBVEQ7O0FBV0EsTUFBTUcsTUFBTSxHQUFJSCxHQUFELElBQVM7QUFDdEIsU0FBTztBQUNMakYsTUFBRSxFQUFFaUYsR0FBRyxHQUFHLFlBREw7QUFFTDdFLE1BQUUsRUFBRTZFLEdBQUcsR0FBRyxjQUZMO0FBR0w1RSxNQUFFLEVBQUU0RSxHQUFHLEdBQUcsZ0JBSEw7QUFJTDNFLE1BQUUsRUFBRTJFLEdBQUcsR0FBRyxTQUpMO0FBS0wxRSxNQUFFLEVBQUUwRSxHQUFHLEdBQUcsV0FMTDtBQU1MekUsTUFBRSxFQUFFeUUsR0FBRyxHQUFHO0FBTkwsR0FBUDtBQVFELENBVEQ7O0FBV0EsMENBQWU7QUFDYi9ELFFBQU0sRUFBRUMsZ0VBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLHlCQUFxQixNQURYO0FBQ21CO0FBQzdCLHFDQUFpQyxNQUZ2QjtBQUUrQjtBQUN6QyxpQ0FBNkIsTUFIbkIsQ0FHMkI7O0FBSDNCLEdBRkM7QUFPYkMsV0FBUyxFQUFFO0FBQ1QseUJBQXFCLE1BRFo7QUFDb0I7QUFDN0IsdUJBQW1CLE1BRlYsQ0FFa0I7O0FBRmxCLEdBUEU7QUFXYnBCLFVBQVEsRUFBRSxDQUNSO0FBQ0V6RCxNQUFFLEVBQUUsd0JBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDcUksU0FBTCxHQUFpQnJJLElBQUksQ0FBQ3FJLFNBQUwsSUFBa0IsRUFBbkM7QUFDQXJJLFVBQUksQ0FBQ3FJLFNBQUwsQ0FBZXBJLE9BQU8sQ0FBQ3FDLE1BQXZCLElBQWlDLElBQWpDO0FBQ0Q7QUFOSCxHQURRLEVBU1I7QUFDRTNCLE1BQUUsRUFBRSx3QkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0UzQyxPQUFHLEVBQUUsQ0FBQ2YsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3RCRCxVQUFJLENBQUNxSSxTQUFMLEdBQWlCckksSUFBSSxDQUFDcUksU0FBTCxJQUFrQixFQUFuQztBQUNBckksVUFBSSxDQUFDcUksU0FBTCxDQUFlcEksT0FBTyxDQUFDcUMsTUFBdkIsSUFBaUMsS0FBakM7QUFDRDtBQU5ILEdBVFEsRUFpQlI7QUFDRTNCLE1BQUUsRUFBRSx3QkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0UzQyxPQUFHLEVBQUUsQ0FBQ2YsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3RCRCxVQUFJLENBQUNzSSxTQUFMLEdBQWlCdEksSUFBSSxDQUFDc0ksU0FBTCxJQUFrQixFQUFuQztBQUNBdEksVUFBSSxDQUFDc0ksU0FBTCxDQUFlckksT0FBTyxDQUFDcUMsTUFBdkIsSUFBaUMsSUFBakM7QUFDRDtBQU5ILEdBakJRLEVBeUJSO0FBQ0UzQixNQUFFLEVBQUUsd0JBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDc0ksU0FBTCxHQUFpQnRJLElBQUksQ0FBQ3NJLFNBQUwsSUFBa0IsRUFBbkM7QUFDQXRJLFVBQUksQ0FBQ3NJLFNBQUwsQ0FBZXJJLE9BQU8sQ0FBQ3FDLE1BQXZCLElBQWlDLEtBQWpDO0FBQ0Q7QUFOSCxHQXpCUSxFQWlDUjtBQUNFM0IsTUFBRSxFQUFFLHFCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQixFQUF5QixNQUF6QixFQUFpQyxNQUFqQyxDQUFOO0FBQWdELFNBQUcyRix1Q0FBa0JBO0FBQXJFLEtBQXZCLENBRlo7QUFHRXhGLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDNUIsYUFBTyxDQUFDRCxJQUFJLENBQUNzSSxTQUFOLElBQW1CLENBQUN0SSxJQUFJLENBQUNzSSxTQUFMLENBQWVySSxPQUFPLENBQUNxQyxNQUF2QixDQUEzQjtBQUNELEtBTEg7QUFNRWpCLFdBQU8sRUFBRSxDQUFDckIsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQzFCLFVBQUlELElBQUksQ0FBQ3FJLFNBQUwsSUFBa0JySSxJQUFJLENBQUNxSSxTQUFMLENBQWVwSSxPQUFPLENBQUNxQyxNQUF2QixDQUF0QixFQUNFLE9BQU87QUFBRU8sWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUVvRixTQUFTLENBQUNsSSxPQUFPLENBQUNrRixPQUFUO0FBQXRELE9BQVA7QUFDRixhQUFPO0FBQUV0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRXFGLE1BQU0sQ0FBQ25JLE9BQU8sQ0FBQ2tGLE9BQVQ7QUFBbkQsT0FBUDtBQUNEO0FBVkgsR0FqQ1EsRUE2Q1I7QUFDRXhFLE1BQUUsRUFBRSxxQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsTUFBakIsRUFBeUIsTUFBekIsQ0FBTjtBQUF3QyxTQUFHMkYsdUNBQWtCQTtBQUE3RCxLQUF2QixDQUZaO0FBR0V4RixhQUFTLEVBQUUsQ0FBQ2QsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQzVCLGFBQU8sQ0FBQ0QsSUFBSSxDQUFDcUksU0FBTixJQUFtQixDQUFDckksSUFBSSxDQUFDcUksU0FBTCxDQUFlcEksT0FBTyxDQUFDcUMsTUFBdkIsQ0FBM0I7QUFDRCxLQUxIO0FBTUVqQixXQUFPLEVBQUUsQ0FBQ3JCLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUMxQixVQUFJRCxJQUFJLENBQUNzSSxTQUFMLElBQWtCdEksSUFBSSxDQUFDc0ksU0FBTCxDQUFlckksT0FBTyxDQUFDcUMsTUFBdkIsQ0FBdEIsRUFDRSxPQUFPO0FBQUVPLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFb0YsU0FBUyxDQUFDbEksT0FBTyxDQUFDa0YsT0FBVDtBQUF0RCxPQUFQLENBRndCLENBRzFCO0FBQ0E7QUFDQTs7QUFDQSxhQUFPO0FBQUV0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRXFGLE1BQU0sQ0FBQ25JLE9BQU8sQ0FBQ2tGLE9BQVQ7QUFBbkQsT0FBUDtBQUNEO0FBYkgsR0E3Q1E7QUFYRyxDQUFmLEU7O0FDM0I2RDtBQUNQO0FBR0s7QUFFM0QsNENBQTRDO0FBQzVDLHdDQUF3QztBQUN4QyxtRUFBbUU7QUFDbkUseURBQXlEO0FBQ3pELHlEQUF5RDtBQUN6RCxnRkFBZ0Y7QUFFaEYsTUFBTSxhQUFTLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRTtJQUNoQyxPQUFPO1FBQ0wsRUFBRSxFQUFFLEdBQUcsR0FBRyxlQUFlO1FBQ3pCLEVBQUUsRUFBRSxHQUFHLEdBQUcsa0JBQWtCO1FBQzVCLEVBQUUsRUFBRSxHQUFHLEdBQUcsaUJBQWlCO1FBQzNCLEVBQUUsRUFBRSxHQUFHLEdBQUcsV0FBVztRQUNyQixFQUFFLEVBQUUsR0FBRyxHQUFHLFdBQVc7UUFDckIsRUFBRSxFQUFFLEdBQUcsR0FBRyxVQUFVO0tBQ3JCLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixNQUFNLFVBQU0sR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO0lBQzdCLE9BQU87UUFDTCxFQUFFLEVBQUUsR0FBRyxHQUFHLFlBQVk7UUFDdEIsRUFBRSxFQUFFLEdBQUcsR0FBRyxjQUFjO1FBQ3hCLEVBQUUsRUFBRSxHQUFHLEdBQUcsZ0JBQWdCO1FBQzFCLEVBQUUsRUFBRSxHQUFHLEdBQUcsU0FBUztRQUNuQixFQUFFLEVBQUUsR0FBRyxHQUFHLFdBQVc7UUFDckIsRUFBRSxFQUFFLEdBQUcsR0FBRyxVQUFVO0tBQ3JCLENBQUM7QUFDSixDQUFDLENBQUM7QUFPRixNQUFNLGNBQVUsR0FBMEI7SUFDeEMsTUFBTSxFQUFFLDRFQUFpQztJQUN6QyxVQUFVLEVBQUU7UUFDVixrQkFBa0IsRUFBRSxNQUFNO1FBQzFCLHdCQUF3QixFQUFFLE1BQU07UUFDaEMsMkJBQTJCLEVBQUUsTUFBTTtRQUNuQywyQkFBMkIsRUFBRSxNQUFNO1FBQ25DLGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLFlBQVksRUFBRSxNQUFNO0tBQ3JCO0lBQ0QsVUFBVSxFQUFFO1FBQ1Ysb0JBQW9CLEVBQUUsTUFBTTtRQUM1QixhQUFhLEVBQUUsTUFBTTtRQUNyQixlQUFlLEVBQUUsTUFBTTtLQUN4QjtJQUNELFNBQVMsRUFBRTtRQUNULG1CQUFtQixFQUFFLE1BQU07UUFDM0IsaUJBQWlCLEVBQUUsTUFBTTtRQUN6QixvQkFBb0IsRUFBRSxNQUFNO1FBQzVCLDhCQUE4QixFQUFFLE1BQU07UUFDdEMsOEJBQThCLEVBQUUsTUFBTTtLQUN2QztJQUNELFFBQVEsRUFBRTtRQUNSO1lBQ0UsWUFBWTtZQUNaLEVBQUUsRUFBRSxxQkFBcUI7WUFDekIsSUFBSSxFQUFFLFNBQVM7WUFDZixRQUFRLEVBQUUseUNBQWtCLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUM7WUFDNUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUMxQix3REFBd0Q7Z0JBQ3hELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDeEUsQ0FBQztTQUNGO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsd0JBQXdCO1lBQzVCLElBQUksRUFBRSxhQUFhO1lBQ25CLFFBQVEsRUFBRSxpREFBc0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUNyRCxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztZQUN4QyxDQUFDO1NBQ0Y7UUFDRDtZQUNFLEVBQUUsRUFBRSx3QkFBd0I7WUFDNUIsSUFBSSxFQUFFLGFBQWE7WUFDbkIsUUFBUSxFQUFFLGlEQUFzQixDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDO1lBQ3JELEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3pDLENBQUM7U0FDRjtRQUNEO1lBQ0UsRUFBRSxFQUFFLHdCQUF3QjtZQUM1QixJQUFJLEVBQUUsYUFBYTtZQUNuQixRQUFRLEVBQUUsaURBQXNCLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7WUFDckQsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO2dCQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDeEMsQ0FBQztTQUNGO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsd0JBQXdCO1lBQzVCLElBQUksRUFBRSxhQUFhO1lBQ25CLFFBQVEsRUFBRSxpREFBc0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUNyRCxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUN6QyxDQUFDO1NBQ0Y7UUFDRDtZQUNFLEVBQUUsRUFBRSxxQkFBcUI7WUFDekIsSUFBSSxFQUFFLFNBQVM7WUFDZixRQUFRLEVBQUUsaURBQXNCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUUsR0FBRyx1Q0FBa0IsRUFBRSxDQUFDO1lBQ3pHLFNBQVMsRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1RCxDQUFDO1lBQ0QsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUN6QixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO29CQUNsRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNuRixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ2hGLENBQUM7U0FDRjtRQUNEO1lBQ0UsRUFBRSxFQUFFLHFCQUFxQjtZQUN6QixJQUFJLEVBQUUsU0FBUztZQUNmLFFBQVEsRUFBRSxpREFBc0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxHQUFHLHVDQUFrQixFQUFFLENBQUM7WUFDekcsU0FBUyxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUMzQixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVELENBQUM7WUFDRCxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7Z0JBQ3pCLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7b0JBQ2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ25GLHFFQUFxRTtnQkFDckUsb0VBQW9FO2dCQUNwRSwyQkFBMkI7Z0JBQzNCLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDaEYsQ0FBQztTQUNGO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsdUJBQXVCO1lBQzNCLElBQUksRUFBRSxTQUFTO1lBQ2YsNkVBQTZFO1lBQzdFLFFBQVEsRUFBRSxpREFBc0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyx1Q0FBa0IsRUFBRSxDQUFDO1lBQ3ZFLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDOUIsT0FBTztvQkFDTCxJQUFJLEVBQUUsTUFBTTtvQkFDWixJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU07b0JBQ3BCLE1BQU0sRUFBRTt3QkFDTixFQUFFLEVBQUUsYUFBYTt3QkFDakIsRUFBRSxFQUFFLGdCQUFnQjt3QkFDcEIsRUFBRSxFQUFFLGtCQUFrQjt3QkFDdEIsRUFBRSxFQUFFLFFBQVE7d0JBQ1osRUFBRSxFQUFFLE1BQU07cUJBQ1g7aUJBQ0YsQ0FBQztZQUNKLENBQUM7U0FDRjtLQUNGO0NBQ0YsQ0FBQztBQUVGLDBDQUFlLGNBQVUsRUFBQzs7O0FDaEsxQjtBQUNBO0FBRUE7QUFFQSwwQ0FBZTtBQUNiakIsUUFBTSxFQUFFQyxnRUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1Ysd0JBQW9CLE1BRFY7QUFDa0I7QUFDNUIseUJBQXFCLE1BRlg7QUFFbUI7QUFDN0Isd0JBQW9CLE1BSFY7QUFHa0I7QUFDNUIsOEJBQTBCLE1BSmhCO0FBSXdCO0FBQ2xDLGlDQUE2QixNQUxuQjtBQUsyQjtBQUNyQywyQkFBdUIsTUFOYjtBQU1xQjtBQUMvQix5QkFBcUIsTUFQWDtBQU9tQjtBQUM3QixvQkFBZ0IsTUFSTjtBQVFjO0FBQ3hCLHVCQUFtQixNQVRUO0FBU2lCO0FBQzNCLGtDQUE4QixNQVZwQjtBQVU0QjtBQUN0QyxtQ0FBK0IsTUFYckIsQ0FXNkI7O0FBWDdCLEdBRkM7QUFlYkUsWUFBVSxFQUFFLEVBZkM7QUFpQmJyQixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLG1CQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRXJDLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ29GO0FBQXJELE9BQVA7QUFDRDtBQUxILEdBRFEsRUFRUjtBQUNFMUUsTUFBRSxFQUFFLHFCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBRlo7QUFHRVYsZUFBVyxFQUFFLENBQUN2QixLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQy9CLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUZUO0FBR0x1RCxjQUFNLEVBQUU7QUFDTjdDLFlBQUUsRUFBRSxhQURFO0FBRU5JLFlBQUUsRUFBRSxrQkFGRTtBQUdOQyxZQUFFLEVBQUUsbUJBSEU7QUFJTkMsWUFBRSxFQUFFLFFBSkU7QUFLTkMsWUFBRSxFQUFFLE1BTEU7QUFNTkMsWUFBRSxFQUFFO0FBTkU7QUFISCxPQUFQO0FBWUQ7QUFoQkgsR0FSUSxFQTBCUjtBQUNFN0MsTUFBRSxFQUFFLGlCQUROO0FBRUU7QUFDQUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FIWjtBQUlFa0MsZUFBVyxFQUFFLENBQUN2QixLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQy9CLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUZUO0FBR0x1RCxjQUFNLEVBQUU7QUFDTjdDLFlBQUUsRUFBRSxXQURFO0FBRU5JLFlBQUUsRUFBRSxrQkFGRTtBQUdOQyxZQUFFLEVBQUUsZUFIRTtBQUlOQyxZQUFFLEVBQUUsS0FKRTtBQUtOQyxZQUFFLEVBQUUsSUFMRTtBQU1OQyxZQUFFLEVBQUU7QUFORTtBQUhILE9BQVA7QUFZRDtBQWpCSCxHQTFCUTtBQWpCRyxDQUFmLEU7O0FDTEE7Q0FHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDBDQUFlO0FBQ2JVLFFBQU0sRUFBRUMsNEVBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLHdCQUFvQixNQURWO0FBQ2tCO0FBQzVCLHlCQUFxQixNQUZYO0FBRW1CO0FBQzdCLG9CQUFnQixNQUhOO0FBR2M7QUFDeEIsdUJBQW1CLE1BSlQ7QUFJaUI7QUFDM0IsOEJBQTBCLE1BTGhCO0FBS3dCO0FBQ2xDLGlDQUE2QixNQU5uQjtBQU0yQjtBQUNyQywyQkFBdUIsTUFQYjtBQU9xQjtBQUMvQix5QkFBcUIsTUFSWDtBQVFtQjtBQUM3Qix5QkFBcUIsTUFUWDtBQVNtQjtBQUM3QixvQ0FBZ0MsTUFWdEI7QUFVOEI7QUFDeEMsb0NBQWdDLE1BWHRCO0FBVzhCO0FBQ3hDLHFDQUFpQyxNQVp2QjtBQVkrQjtBQUN6QyxxQ0FBaUMsTUFidkI7QUFhK0I7QUFFekMsNEJBQXdCLE1BZmQ7QUFlc0I7QUFDaEMsNEJBQXdCLE1BaEJkO0FBZ0JzQjtBQUNoQyw0QkFBd0IsTUFqQmQ7QUFpQnNCO0FBQ2hDLHNDQUFrQyxNQWxCeEI7QUFrQmdDO0FBQzFDLHNDQUFrQyxNQW5CeEI7QUFtQmdDO0FBQzFDLHNDQUFrQyxNQXBCeEI7QUFvQmdDO0FBQzFDLHNDQUFrQyxNQXJCeEI7QUFxQmdDO0FBQzFDLDRCQUF3QixNQXRCZDtBQXVCViw0QkFBd0IsTUF2QmQ7QUF3QlYsMEJBQXNCLE1BeEJaO0FBeUJWLDBCQUFzQixNQXpCWjtBQTBCVixvQkFBZ0IsTUExQk47QUEyQlYsOEJBQTBCLE1BM0JoQjtBQTRCViw4QkFBMEIsTUE1QmhCO0FBNkJWLDRCQUF3QixNQTdCZDtBQThCViw0QkFBd0I7QUE5QmQsR0FGQztBQWtDYkUsWUFBVSxFQUFFO0FBQ1Y7QUFDQSwwQkFBc0IsTUFGWjtBQUdWO0FBQ0EsMEJBQXNCO0FBSlosR0FsQ0M7QUF3Q2JLLFdBQVMsRUFBRTtBQUNULHlCQUFxQixNQURaLENBQ29COztBQURwQixHQXhDRTtBQTJDYjFCLFVBQVEsRUFBRSxDQUNSO0FBQ0V6RCxNQUFFLEVBQUUsbUJBRE47QUFFRTtBQUNBRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUhaO0FBSUVyQyxXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNvRjtBQUFyRCxPQUFQO0FBQ0Q7QUFOSCxHQURRLEVBU1I7QUFDRTtBQUNBMUUsTUFBRSxFQUFFLGVBRk47QUFHRUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWxELFFBQUUsRUFBRTtBQUFOLEtBQW5CLENBSFo7QUFJRVUsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDa0Y7QUFBckQsT0FBUDtBQUNEO0FBTkgsR0FUUTtBQTNDRyxDQUFmLEU7O0FDaEJBO0FBRUEsMENBQWU7QUFDYmpCLFFBQU0sRUFBRUMsMERBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLGlDQUE2QixNQURuQjtBQUMyQjtBQUNyQyxpQ0FBNkIsTUFGbkI7QUFFMkI7QUFDckMsb0NBQWdDLE1BSHRCO0FBRzhCO0FBQ3hDLDZCQUF5QixNQUpmO0FBSXVCO0FBQ2pDLDBCQUFzQixNQUxaO0FBS29CO0FBQzlCLDBDQUFzQyxNQU41QjtBQU1vQztBQUM5QyxrQ0FBOEIsTUFQcEI7QUFPNEI7QUFDdEMscUNBQWlDLE1BUnZCLENBUStCOztBQVIvQixHQUZDO0FBWWJFLFlBQVUsRUFBRTtBQUNWLG9CQUFnQixNQUROO0FBQ2M7QUFDeEIsNEJBQXdCLE1BRmQsQ0FFc0I7O0FBRnRCLEdBWkM7QUFnQmJELFdBQVMsRUFBRTtBQUNULHFDQUFpQyxNQUR4QixDQUNnQzs7QUFEaEM7QUFoQkUsQ0FBZixFOztBQ0ZBO0FBQ0E7Q0FJQTtBQUNBO0FBQ0E7O0FBRUEsMENBQWU7QUFDYnRCLFFBQU0sRUFBRUMsc0VBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLDBCQUFzQixNQURaO0FBQ29CO0FBQzlCLG9DQUFnQyxNQUZ0QjtBQUU4QjtBQUN4Qyx1Q0FBbUMsTUFIekI7QUFHaUM7QUFDM0Msa0NBQThCLE1BSnBCO0FBSTRCO0FBQ3RDLHdDQUFvQyxNQUwxQjtBQUtrQztBQUM1Qyx3Q0FBb0MsTUFOMUI7QUFNa0M7QUFDNUMsaUNBQTZCLE1BUG5CO0FBTzJCO0FBQ3JDLGlDQUE2QixNQVJuQjtBQVEyQjtBQUNyQyx1Q0FBbUMsTUFUekI7QUFTaUM7QUFDM0MsdUNBQW1DLE1BVnpCO0FBVWlDO0FBQzNDLHVDQUFtQyxNQVh6QjtBQVdpQztBQUMzQyx1Q0FBbUMsTUFaekI7QUFZaUM7QUFDM0MsMkJBQXVCLE1BYmI7QUFhcUI7QUFDL0Isd0NBQW9DLE1BZDFCO0FBY2tDO0FBQzVDLHVCQUFtQixNQWZULENBZWlCOztBQWZqQixHQUZDO0FBbUJiRSxZQUFVLEVBQUU7QUFDVixvQkFBZ0IsTUFETjtBQUNjO0FBQ3hCLDRCQUF3QixNQUZkLENBRXNCOztBQUZ0QixHQW5CQztBQXVCYkQsV0FBUyxFQUFFO0FBQ1QsdUNBQW1DLE1BRDFCLENBQ2tDOztBQURsQyxHQXZCRTtBQTBCYk0sV0FBUyxFQUFFO0FBQ1QsOENBQTBDLE1BRGpDLENBQ3lDOztBQUR6QyxHQTFCRTtBQTZCYkosaUJBQWUsRUFBRTtBQUNmLDRCQUF3QixLQURULENBQ2dCOztBQURoQixHQTdCSjtBQWdDYk0sVUFBUSxFQUFFO0FBQ1IsdUNBQW1DLE1BRDNCLENBQ21DOztBQURuQyxHQWhDRztBQW1DYjVCLFVBQVEsRUFBRSxDQUNSO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQXpELE1BQUUsRUFBRSxzQ0FMTjtBQU1FRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFaEIsVUFBSSxFQUFFLElBQVI7QUFBY2xDLFFBQUUsRUFBRSxNQUFsQjtBQUEwQixTQUFHMkYsdUNBQWtCQTtBQUEvQyxLQUF2QixDQU5aO0FBT0V4RixhQUFTLEVBQUUsQ0FBQ2QsSUFBRCxFQUFPQyxPQUFQLEtBQW1CRCxJQUFJLENBQUNvRixpQkFBTCxDQUF1Qm5GLE9BQXZCLElBQWtDLENBUGxFO0FBUUVvQixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNrRjtBQUFyRCxPQUFQO0FBQ0Q7QUFWSCxHQURRLEVBYVI7QUFDRTtBQUNBeEUsTUFBRSxFQUFFLCtCQUZOO0FBR0VFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBSFo7QUFJRXhGLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUJELElBQUksQ0FBQ29GLGlCQUFMLENBQXVCbkYsT0FBdkIsSUFBa0MsQ0FKbEU7QUFLRW9CLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ2tGO0FBQXJELE9BQVA7QUFDRDtBQVBILEdBYlE7QUFuQ0csQ0FBZixFOztBQ1RBO0FBRUEsMkNBQWU7QUFDYmpCLFFBQU0sRUFBRUMsNERBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLDhCQUEwQixNQURoQjtBQUN3QjtBQUNsQyxxQ0FBaUMsTUFGdkI7QUFFK0I7QUFDekMsK0JBQTJCLE1BSGpCO0FBR3lCO0FBQ25DLHNDQUFrQyxNQUp4QjtBQUlnQztBQUMxQyw2QkFBeUIsTUFMZjtBQUt1QjtBQUNqQyw2QkFBeUIsTUFOZjtBQU11QjtBQUNqQyw2QkFBeUIsTUFQZjtBQU91QjtBQUNqQyw2QkFBeUIsTUFSZjtBQVF1QjtBQUNqQyw2QkFBeUIsTUFUZjtBQVN1QjtBQUNqQywrQkFBMkIsTUFWakI7QUFVeUI7QUFDbkMsNEJBQXdCLE1BWGQ7QUFXc0I7QUFDaEMsOEJBQTBCLE1BWmhCO0FBWXdCO0FBQ2xDLDZCQUF5QixNQWJmLENBYXVCOztBQWJ2QixHQUZDO0FBaUJiQyxXQUFTLEVBQUU7QUFDVCwyQkFBdUIsTUFEZCxDQUNzQjs7QUFEdEI7QUFqQkUsQ0FBZixFOztBQ0ZBO0FBQ0E7Q0FJQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQ0FBZTtBQUNidEIsUUFBTSxFQUFFQyx3RUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsK0JBQTJCLE1BRGpCO0FBQ3lCO0FBQ25DLCtCQUEyQixNQUZqQjtBQUV5QjtBQUNuQyxrQ0FBOEIsTUFIcEI7QUFHNEI7QUFDdEMsa0NBQThCLE1BSnBCO0FBSTRCO0FBQ3RDLGdDQUE0QixNQUxsQjtBQUswQjtBQUNwQyxnQ0FBNEIsTUFObEI7QUFNMEI7QUFDcEMsNkJBQXlCLE1BUGY7QUFPdUI7QUFDakMsNkJBQXlCLE1BUmY7QUFRdUI7QUFDakMsbUNBQStCLE1BVHJCO0FBUzZCO0FBQ3ZDLG1DQUErQixNQVZyQjtBQVU2QjtBQUN2QywrQkFBMkIsTUFYakI7QUFXeUI7QUFDbkMsK0JBQTJCLE1BWmpCO0FBWXlCO0FBQ25DLDZCQUF5QixNQWJmO0FBYXVCO0FBQ2pDLDZCQUF5QixNQWRmLENBY3VCOztBQWR2QixHQUZDO0FBa0JiRSxZQUFVLEVBQUU7QUFDViwrQkFBMkIsTUFEakI7QUFDeUI7QUFDbkMsK0JBQTJCLE1BRmpCLENBRXlCOztBQUZ6QixHQWxCQztBQXNCYkQsV0FBUyxFQUFFO0FBQ1Qsc0JBQWtCLE1BRFQ7QUFDaUI7QUFDMUIsc0JBQWtCLE1BRlQsQ0FFaUI7O0FBRmpCLEdBdEJFO0FBMEJiTSxXQUFTLEVBQUU7QUFDVCwyQkFBdUIsTUFEZCxDQUNzQjs7QUFEdEIsR0ExQkU7QUE2QmIxQixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLHVCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVoQyxZQUFNLEVBQUUsYUFBVjtBQUF5QjZCLGNBQVEsRUFBRTtBQUFuQyxLQUF2QixDQUZaO0FBR0VtRCxjQUFVLEVBQUVoRCxpREFBQSxDQUF1QjtBQUFFaEMsWUFBTSxFQUFFLGdCQUFWO0FBQTRCNkIsY0FBUSxFQUFFO0FBQXRDLEtBQXZCLENBSGQ7QUFJRWdCLGNBQVUsRUFBRWIsaURBQUEsQ0FBdUI7QUFBRWhDLFlBQU0sRUFBRSxnQkFBVjtBQUE0QjZCLGNBQVEsRUFBRTtBQUF0QyxLQUF2QixDQUpkO0FBS0VpQixjQUFVLEVBQUVkLGlEQUFBLENBQXVCO0FBQUVoQyxZQUFNLEVBQUUsVUFBVjtBQUFzQjZCLGNBQVEsRUFBRTtBQUFoQyxLQUF2QixDQUxkO0FBTUVyQyxXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLFFBQVI7QUFBa0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQWpDO0FBQXlDUyxZQUFJLEVBQUcsR0FBRTlDLE9BQU8sQ0FBQ29GLE1BQU87QUFBakUsT0FBUDtBQUNEO0FBUkgsR0FEUSxFQVdSO0FBQ0UxRSxNQUFFLEVBQUUsdUJBRE47QUFFRTtBQUNBO0FBQ0E7QUFDQTtBQUNBRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFaEMsWUFBTSxFQUFFLGNBQVY7QUFBMEI2QixjQUFRLEVBQUU7QUFBcEMsS0FBdkIsQ0FOWjtBQU9FbUQsY0FBVSxFQUFFaEQsaURBQUEsQ0FBdUI7QUFBRWhDLFlBQU0sRUFBRSxlQUFWO0FBQTJCNkIsY0FBUSxFQUFFO0FBQXJDLEtBQXZCLENBUGQ7QUFRRWdCLGNBQVUsRUFBRWIsaURBQUEsQ0FBdUI7QUFBRWhDLFlBQU0sRUFBRSxpQkFBVjtBQUE2QjZCLGNBQVEsRUFBRTtBQUF2QyxLQUF2QixDQVJkO0FBU0VpQixjQUFVLEVBQUVkLGlEQUFBLENBQXVCO0FBQUVoQyxZQUFNLEVBQUUsS0FBVjtBQUFpQjZCLGNBQVEsRUFBRTtBQUEzQixLQUF2QixDQVRkO0FBVUVyQyxXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLFFBQVI7QUFBa0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQWpDO0FBQXlDUyxZQUFJLEVBQUcsR0FBRTlDLE9BQU8sQ0FBQ29GLE1BQU87QUFBakUsT0FBUDtBQUNEO0FBWkgsR0FYUSxFQXlCUjtBQUNFO0FBQ0E7QUFDQTFFLE1BQUUsRUFBRSxxQkFITjtBQUlFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBTjtBQUF3QixTQUFHMkYsdUNBQWtCQTtBQUE3QyxLQUF2QixDQUpaO0FBS0V4RixhQUFTLEVBQUUsQ0FBQ2QsSUFBRCxFQUFPQyxPQUFQLEtBQW1CRCxJQUFJLENBQUNvRixpQkFBTCxDQUF1Qm5GLE9BQXZCLElBQWtDLENBTGxFO0FBTUVvQixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNrRjtBQUFyRCxPQUFQO0FBQ0Q7QUFSSCxHQXpCUTtBQTdCRyxDQUFmLEU7O0FDVkE7QUFDQTtBQUVBLDJDQUFlO0FBQ2JqQixRQUFNLEVBQUVDLHdFQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVixtQ0FBK0IsTUFEckI7QUFDNkI7QUFDdkMsOEJBQTBCLE1BRmhCO0FBRXdCO0FBQ2xDLDhCQUEwQixNQUhoQjtBQUd3QjtBQUNsQyxvQkFBZ0IsTUFKTjtBQUljO0FBQ3hCLDBCQUFzQixNQUxaO0FBS29CO0FBQzlCLHFDQUFpQyxNQU52QjtBQU0rQjtBQUN6QyxxQ0FBaUMsTUFQdkI7QUFPK0I7QUFDekMsNkJBQXlCLE1BUmY7QUFRdUI7QUFDakMseUNBQXFDLE1BVDNCO0FBU21DO0FBQzdDLG9DQUFnQyxNQVZ0QjtBQVU4QjtBQUN4QywwQkFBc0IsTUFYWixDQVdvQjs7QUFYcEIsR0FGQztBQWViRSxZQUFVLEVBQUU7QUFDViwwQkFBc0IsTUFEWixDQUNvQjs7QUFEcEIsR0FmQztBQWtCYkQsV0FBUyxFQUFFO0FBQ1Qsc0JBQWtCLE1BRFQsQ0FDaUI7O0FBRGpCLEdBbEJFO0FBcUJicEIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSw0QkFETjtBQUVFO0FBQ0E7QUFDQUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWxELFFBQUUsRUFBRSxDQUFDLE1BQUQsRUFBUyxNQUFUO0FBQU4sS0FBbkIsQ0FKWjtBQUtFaUYsZUFBVyxFQUFFLENBQUN2QixLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQy9CLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUZUO0FBR0x1RCxjQUFNLEVBQUU7QUFDTjdDLFlBQUUsRUFBRSxhQURFO0FBRU5JLFlBQUUsRUFBRSxnQkFGRTtBQUdOQyxZQUFFLEVBQUUsa0JBSEU7QUFJTkMsWUFBRSxFQUFFLFFBSkU7QUFLTkMsWUFBRSxFQUFFLE1BTEU7QUFNTkMsWUFBRSxFQUFFO0FBTkU7QUFISCxPQUFQO0FBWUQ7QUFsQkgsR0FEUTtBQXJCRyxDQUFmLEU7O0FDSEE7Q0FHQTtBQUNBOztBQUVBLDJDQUFlO0FBQ2JVLFFBQU0sRUFBRUMsb0ZBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLDhCQUEwQixNQURoQjtBQUN3QjtBQUNsQyxtQ0FBK0IsTUFGckI7QUFFNkI7QUFDdkMsOEJBQTBCLE1BSGhCO0FBR3dCO0FBQ2xDLDBCQUFzQixNQUpaO0FBSW9CO0FBQzlCLG9DQUFnQyxNQUx0QjtBQUs4QjtBQUN4Qyx5Q0FBcUMsTUFOM0I7QUFNbUM7QUFDN0Msb0NBQWdDLE1BUHRCO0FBTzhCO0FBQ3hDLGdDQUE0QixNQVJsQjtBQVEwQjtBQUNwQyxxQ0FBaUMsTUFUdkI7QUFTK0I7QUFDekMscUNBQWlDLE1BVnZCO0FBVStCO0FBQ3pDLHlDQUFxQyxNQVgzQjtBQVdtQztBQUM3Qyx5Q0FBcUMsTUFaM0I7QUFZbUM7QUFDN0MsMkJBQXVCLE1BYmI7QUFhcUI7QUFDL0IsNkJBQXlCLE1BZGY7QUFjdUI7QUFDakMseUNBQXFDLE1BZjNCO0FBZW1DO0FBQzdDLDBCQUFzQixNQWhCWjtBQWdCb0I7QUFDOUIsb0NBQWdDLE1BakJ0QjtBQWlCOEI7QUFDeEMsb0NBQWdDLE1BbEJ0QjtBQWtCOEI7QUFDeEMsZ0NBQTRCLE1BbkJsQixDQW1CMEI7O0FBbkIxQixHQUZDO0FBdUJiRSxZQUFVLEVBQUU7QUFDVixvQkFBZ0IsTUFETjtBQUNjO0FBQ3hCLDBCQUFzQixNQUZaO0FBRW9CO0FBQzlCLDBCQUFzQixNQUhaLENBR29COztBQUhwQixHQXZCQztBQTRCYkQsV0FBUyxFQUFFO0FBQ1QsNEJBQXdCLE1BRGY7QUFDdUI7QUFDaEMsa0NBQThCLE1BRnJCO0FBRTZCO0FBQ3RDLHFCQUFpQixNQUhSO0FBR2dCO0FBQ3pCLDJCQUF1QixNQUpkLENBSXNCOztBQUp0QixHQTVCRTtBQWtDYk0sV0FBUyxFQUFFO0FBQ1Qsc0JBQWtCLE1BRFQ7QUFDaUI7QUFDMUIsdUJBQW1CLE1BRlY7QUFFa0I7QUFDM0IsdUJBQW1CLE1BSFY7QUFHa0I7QUFDM0IsdUJBQW1CLE1BSlYsQ0FJa0I7O0FBSmxCLEdBbENFO0FBd0NiYSxVQUFRLEVBQUU7QUFDUixzQ0FBa0M7QUFEMUIsR0F4Q0c7QUEyQ2J2QyxVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLDRCQUROO0FBRUU7QUFDQTtBQUNBO0FBQ0FFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUUsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQjtBQUFOLEtBQW5CLENBTFo7QUFNRWlGLGVBQVcsRUFBRSxDQUFDdkIsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMvQixhQUFPO0FBQ0w0QyxZQUFJLEVBQUUsTUFERDtBQUVMbkIsWUFBSSxFQUFFekIsT0FBTyxDQUFDcUMsTUFGVDtBQUdMdUQsY0FBTSxFQUFFO0FBQ043QyxZQUFFLEVBQUUsYUFERTtBQUVOSSxZQUFFLEVBQUUsZ0JBRkU7QUFHTkMsWUFBRSxFQUFFLGtCQUhFO0FBSU5DLFlBQUUsRUFBRSxRQUpFO0FBS05DLFlBQUUsRUFBRSxNQUxFO0FBTU5DLFlBQUUsRUFBRTtBQU5FO0FBSEgsT0FBUDtBQVlEO0FBbkJILEdBRFE7QUEzQ0csQ0FBZixFOztBQ05BO0FBRUEsMkNBQWU7QUFDYlUsUUFBTSxFQUFFQyxnRUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsaUNBQTZCLE1BRG5CO0FBQzJCO0FBQ3JDLDBCQUFzQixNQUZaO0FBRW9CO0FBQzlCLHFDQUFpQyxNQUh2QjtBQUcrQjtBQUN6Qyw4QkFBMEIsTUFKaEI7QUFJd0I7QUFDbEMsa0NBQThCLE1BTHBCO0FBSzRCO0FBQ3RDLDJCQUF1QixNQU5iO0FBTXFCO0FBQy9CLDZCQUF5QixNQVBmO0FBT3VCO0FBQ2pDLHNCQUFrQixNQVJSO0FBUWdCO0FBQzFCLDhCQUEwQixNQVRoQjtBQVN3QjtBQUNsQyw4QkFBMEIsTUFWaEI7QUFVd0I7QUFDbEMsMkJBQXVCLE1BWGI7QUFXcUI7QUFDL0IsbUNBQStCLE1BWnJCLENBWTZCOztBQVo3QixHQUZDO0FBZ0JiQyxXQUFTLEVBQUU7QUFDVCx3QkFBb0IsTUFEWDtBQUNtQjtBQUM1QixtQ0FBK0IsTUFGdEI7QUFFOEI7QUFDdkMsbUNBQStCLE1BSHRCLENBRzhCOztBQUg5QjtBQWhCRSxDQUFmLEU7Ozs7QUNGQTtBQUNBO0FBQ0E7Q0FJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsTUFBTStDLGVBQWUsR0FBR0MsUUFBUSxDQUFDLE1BQUQsRUFBUyxFQUFULENBQWhDOztBQUNBLE1BQU1DLGVBQWUsR0FBRyxDQUFDekksSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3pDO0FBQ0E7QUFDQSxNQUFJLE9BQU9ELElBQUksQ0FBQzBJLFNBQVosS0FBMEIsV0FBOUIsRUFDRTFJLElBQUksQ0FBQzBJLFNBQUwsR0FBaUJGLFFBQVEsQ0FBQ3ZJLE9BQU8sQ0FBQ1UsRUFBVCxFQUFhLEVBQWIsQ0FBUixHQUEyQjRILGVBQTVDLENBSnVDLENBS3pDO0FBQ0E7QUFDQTs7QUFDQSxTQUFPLENBQUNDLFFBQVEsQ0FBQ3ZJLE9BQU8sQ0FBQ1UsRUFBVCxFQUFhLEVBQWIsQ0FBUixHQUEyQlgsSUFBSSxDQUFDMEksU0FBakMsRUFBNENDLFFBQTVDLENBQXFELEVBQXJELEVBQXlEeEksV0FBekQsR0FBdUV5SSxRQUF2RSxDQUFnRixDQUFoRixFQUFtRixHQUFuRixDQUFQO0FBQ0QsQ0FURDs7QUFXQSwyQ0FBZTtBQUNiMUUsUUFBTSxFQUFFQyw0RUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YseUNBQXFDLE1BRDNCO0FBQ21DO0FBQzdDLDBDQUFzQyxNQUY1QjtBQUVvQztBQUM5QyxzQ0FBa0MsTUFIeEI7QUFHZ0M7QUFDMUMsbUNBQStCLE1BSnJCO0FBSTZCO0FBQ3ZDLDhCQUEwQixNQUxoQjtBQUt3QjtBQUNsQyxrQ0FBOEIsTUFOcEI7QUFNNEI7QUFDdEMsNEJBQXdCLE1BUGQ7QUFPc0I7QUFDaEMsMkJBQXVCLE1BUmI7QUFRcUI7QUFDL0IscUNBQWlDLE1BVHZCO0FBUytCO0FBQ3pDLDhCQUEwQixNQVZoQixDQVV3Qjs7QUFWeEIsR0FGQztBQWNiRSxZQUFVLEVBQUU7QUFDViw2QkFBeUIsTUFEZixDQUN1Qjs7QUFEdkIsR0FkQztBQWlCYkQsV0FBUyxFQUFFO0FBQ1QsaUNBQTZCLE1BRHBCO0FBQzRCO0FBQ3JDLGlDQUE2QixNQUZwQjtBQUU0QjtBQUNyQyxnQ0FBNEIsTUFIbkI7QUFHMkI7QUFDcEMsZ0NBQTRCLE1BSm5CO0FBSTJCO0FBQ3BDLGtDQUE4QixNQUxyQjtBQUs2QjtBQUN0QyxrQ0FBOEIsTUFOckIsQ0FNNkI7O0FBTjdCLEdBakJFO0FBeUJiTSxXQUFTLEVBQUU7QUFDVCx3Q0FBb0MsTUFEM0I7QUFDbUM7QUFDNUMsc0NBQWtDLE1BRnpCO0FBRWlDO0FBQzFDLG1DQUErQixNQUh0QjtBQUc4QjtBQUN2QyxtQ0FBK0IsTUFKdEI7QUFJOEI7QUFDdkMsOEJBQTBCLE1BTGpCLENBS3lCOztBQUx6QixHQXpCRTtBQWdDYkgsaUJBQWUsRUFBRTtBQUNmLHdCQUFvQixLQURMLENBQ1k7O0FBRFosR0FoQ0o7QUFtQ2JLLFVBQVEsRUFBRTtBQUNSLHNDQUFrQztBQUQxQixHQW5DRztBQXNDYjVCLFVBQVEsRUFBRSxDQUNSO0FBQ0U7QUFDQTtBQUNBekQsTUFBRSxFQUFFLG9CQUhOO0FBSUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBSlo7QUFLRXhGLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUJELElBQUksQ0FBQ29GLGlCQUFMLENBQXVCbkYsT0FBdkIsSUFBa0MsQ0FMbEU7QUFNRW9CLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ2tGO0FBQXJELE9BQVA7QUFDRDtBQVJILEdBRFEsRUFXUjtBQUNFeEUsTUFBRSxFQUFFLGlCQUROO0FBRUVFLFlBQVEsRUFBRWdELCtDQUFBLENBQXNCLEVBQXRCLENBRlo7QUFHRTlDLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEIsWUFBTVUsRUFBRSxHQUFHOEgsZUFBZSxDQUFDekksSUFBRCxFQUFPQyxPQUFQLENBQTFCO0FBQ0EsWUFBTTRJLGdCQUFnQixHQUFHLE1BQXpCO0FBQ0EsWUFBTUMsZUFBZSxHQUFHLE1BQXhCOztBQUNBLFVBQUluSSxFQUFFLElBQUlrSSxnQkFBTixJQUEwQmxJLEVBQUUsSUFBSW1JLGVBQXBDLEVBQXFEO0FBQ25EO0FBQ0EsY0FBTUosU0FBUyxHQUFHRixRQUFRLENBQUM3SCxFQUFELEVBQUssRUFBTCxDQUFSLEdBQW1CNkgsUUFBUSxDQUFDSyxnQkFBRCxFQUFtQixFQUFuQixDQUE3QyxDQUZtRCxDQUluRDs7QUFDQTdJLFlBQUksQ0FBQytJLGNBQUwsR0FBc0IvSSxJQUFJLENBQUMrSSxjQUFMLElBQXVCLEVBQTdDO0FBQ0EvSSxZQUFJLENBQUMrSSxjQUFMLENBQW9COUksT0FBTyxDQUFDcUMsTUFBNUIsSUFBc0NvRyxTQUFTLEdBQUcsQ0FBWixHQUFnQixDQUF0RDtBQUNEO0FBQ0Y7QUFmSCxHQVhRLEVBNEJSO0FBQ0U7QUFDQTtBQUNBL0gsTUFBRSxFQUFFLHFEQUhOO0FBSUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVoQyxZQUFNLEVBQUUsb0JBQVY7QUFBZ0NsQixRQUFFLEVBQUU7QUFBcEMsS0FBdkIsQ0FKWjtBQUtFSSxPQUFHLEVBQUUsQ0FBQ2YsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3RCO0FBQ0E7QUFDQUQsVUFBSSxDQUFDZ0osbUJBQUwsR0FBMkJoSixJQUFJLENBQUNnSixtQkFBTCxJQUE0QixFQUF2RDtBQUNBaEosVUFBSSxDQUFDZ0osbUJBQUwsQ0FBeUIvSSxPQUFPLENBQUNDLFFBQVIsQ0FBaUJDLFdBQWpCLEVBQXpCLElBQTJEOEYsVUFBVSxDQUFDaEcsT0FBTyxDQUFDZ0osQ0FBVCxDQUFyRTtBQUNEO0FBVkgsR0E1QlEsRUF3Q1I7QUFDRTtBQUNBdEksTUFBRSxFQUFFLHdDQUZOO0FBR0VFLFlBQVEsRUFBRWdELHVDQUFBLENBQWtCO0FBQUV2QixZQUFNLEVBQUUsb0JBQVY7QUFBZ0MzQixRQUFFLEVBQUU7QUFBcEMsS0FBbEIsQ0FIWjtBQUlFSSxPQUFHLEVBQUUsQ0FBQ2YsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3RCRCxVQUFJLENBQUNrSix1QkFBTCxHQUErQmxKLElBQUksQ0FBQ2tKLHVCQUFMLElBQWdDLEVBQS9EO0FBQ0FsSixVQUFJLENBQUNrSix1QkFBTCxDQUE2QmpKLE9BQU8sQ0FBQzRCLE1BQXJDLElBQStDNUIsT0FBTyxDQUFDZ0gsUUFBUixDQUFpQjlHLFdBQWpCLEVBQS9DO0FBQ0Q7QUFQSCxHQXhDUSxFQWlEUjtBQUNFUSxNQUFFLEVBQUUscUNBRE47QUFFRUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWhDLFlBQU0sRUFBRSxvQkFBVjtBQUFnQ2xCLFFBQUUsRUFBRTtBQUFwQyxLQUFuQixDQUZaO0FBR0VPLGdCQUFZLEVBQUUsQ0FIaEI7QUFJRUUsbUJBQWUsRUFBRSxDQUpuQjtBQUtFTCxPQUFHLEVBQUdmLElBQUQsSUFBVTtBQUNiQSxVQUFJLENBQUNtSixpQkFBTCxHQUF5Qm5KLElBQUksQ0FBQ21KLGlCQUFMLElBQTBCLENBQW5EO0FBQ0FuSixVQUFJLENBQUNtSixpQkFBTDtBQUNEO0FBUkgsR0FqRFEsRUEyRFI7QUFDRTtBQUNBeEksTUFBRSxFQUFFLDZCQUZOO0FBR0VFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVoQixVQUFJLEVBQUUsSUFBUjtBQUFjaEIsWUFBTSxFQUFFLG9CQUF0QjtBQUE0Q2xCLFFBQUUsRUFBRTtBQUFoRCxLQUFuQixDQUhaO0FBSUVVLFdBQU8sRUFBRSxDQUFDckIsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQzFCLFVBQUksQ0FBQ0QsSUFBSSxDQUFDK0ksY0FBTixJQUF3QixDQUFDL0ksSUFBSSxDQUFDa0osdUJBQTlCLElBQXlELENBQUNsSixJQUFJLENBQUNnSixtQkFBbkUsRUFDRSxPQUZ3QixDQUkxQjs7QUFDQSxZQUFNSSxNQUFNLEdBQUcsQ0FBQ3BKLElBQUksQ0FBQ21KLGlCQUFMLElBQTBCLENBQTNCLElBQWdDLENBQS9DO0FBQ0EsWUFBTWpKLFFBQVEsR0FBR0QsT0FBTyxDQUFDQyxRQUFSLENBQWlCQyxXQUFqQixFQUFqQjtBQUNBLFlBQU1rSixLQUFLLEdBQUc3RyxNQUFNLENBQUNDLElBQVAsQ0FBWXpDLElBQUksQ0FBQytJLGNBQWpCLENBQWQ7QUFDQSxZQUFNTyxPQUFPLEdBQUdELEtBQUssQ0FBQzNHLE1BQU4sQ0FBY2hCLElBQUQsSUFBVTFCLElBQUksQ0FBQytJLGNBQUwsQ0FBb0JySCxJQUFwQixNQUE4QjBILE1BQXJELENBQWhCO0FBQ0EsWUFBTUcsTUFBTSxHQUFHRCxPQUFPLENBQUM1RyxNQUFSLENBQWdCaEIsSUFBRCxJQUFVMUIsSUFBSSxDQUFDa0osdUJBQUwsQ0FBNkJ4SCxJQUE3QixNQUF1Q3hCLFFBQWhFLENBQWYsQ0FUMEIsQ0FXMUI7O0FBQ0EsVUFBSXFKLE1BQU0sQ0FBQzNHLE1BQVAsS0FBa0IsQ0FBdEIsRUFDRSxPQWJ3QixDQWUxQjs7QUFDQSxVQUFJMkcsTUFBTSxDQUFDLENBQUQsQ0FBTixLQUFjdEosT0FBTyxDQUFDcUMsTUFBMUIsRUFDRSxPQWpCd0IsQ0FtQjFCO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFlBQU1rSCxzQkFBc0IsR0FBRyxDQUEvQjtBQUVBLFVBQUlDLHFCQUFxQixHQUFHLEtBQTVCO0FBQ0EsVUFBSUMsYUFBYSxHQUFHLEtBQXBCO0FBQ0EsWUFBTUMsWUFBWSxHQUFHbkgsTUFBTSxDQUFDQyxJQUFQLENBQVl6QyxJQUFJLENBQUNnSixtQkFBakIsQ0FBckI7O0FBQ0EsVUFBSVcsWUFBWSxDQUFDL0csTUFBYixLQUF3QixDQUF4QixJQUE2QitHLFlBQVksQ0FBQ3JKLFFBQWIsQ0FBc0JKLFFBQXRCLENBQWpDLEVBQWtFO0FBQ2hFLGNBQU0wSixPQUFPLEdBQUdELFlBQVksQ0FBQyxDQUFELENBQVosS0FBb0J6SixRQUFwQixHQUErQnlKLFlBQVksQ0FBQyxDQUFELENBQTNDLEdBQWlEQSxZQUFZLENBQUMsQ0FBRCxDQUE3RTtBQUNBLGNBQU1FLE9BQU8sR0FBRzdKLElBQUksQ0FBQ2dKLG1CQUFMLENBQXlCOUksUUFBekIsQ0FBaEI7QUFDQSxjQUFNNEosTUFBTSxHQUFHOUosSUFBSSxDQUFDZ0osbUJBQUwsQ0FBeUJZLE9BQXpCLENBQWY7QUFDQSxjQUFNRyxLQUFLLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTSixPQUFPLEdBQUdDLE1BQW5CLENBQWQ7O0FBQ0EsWUFBSUMsS0FBSyxHQUFHUCxzQkFBWixFQUFvQztBQUNsQ0MsK0JBQXFCLEdBQUcsSUFBeEI7QUFDQUMsdUJBQWEsR0FBR0csT0FBTyxHQUFHQyxNQUExQjtBQUNEO0FBQ0Y7O0FBRUQsWUFBTUksS0FBSyxHQUFHWCxNQUFNLENBQUMsQ0FBRCxDQUFwQjtBQUNBLFlBQU1ZLFNBQVMsR0FBR25LLElBQUksQ0FBQ2tELFNBQUwsQ0FBZWdILEtBQWYsQ0FBbEI7QUFDQSxVQUFJbkgsSUFBSSxHQUFHO0FBQ1RDLFVBQUUsRUFBRyxHQUFFL0MsT0FBTyxDQUFDa0YsT0FBUSxVQUFTZ0YsU0FBVSxNQUFLZixNQUFPLEdBRDdDO0FBRVRoRyxVQUFFLEVBQUcsR0FBRW5ELE9BQU8sQ0FBQ2tGLE9BQVEsU0FBUWdGLFNBQVUsTUFBS2YsTUFBTyxHQUY1QztBQUdUOUYsVUFBRSxFQUFHLEdBQUVyRCxPQUFPLENBQUNrRixPQUFRLEtBQUlnRixTQUFVLE9BQU1mLE1BQU8sR0FIekM7QUFJVDdGLFVBQUUsRUFBRyxHQUFFdEQsT0FBTyxDQUFDa0YsT0FBUSxPQUFNZ0YsU0FBVSxLQUFJZixNQUFPLEdBSnpDO0FBS1Q1RixVQUFFLEVBQUcsR0FBRXZELE9BQU8sQ0FBQ2tGLE9BQVEsVUFBU2dGLFNBQVUsTUFBS2YsTUFBTztBQUw3QyxPQUFYOztBQU9BLFVBQUlLLHFCQUFxQixJQUFJQyxhQUE3QixFQUE0QztBQUMxQzNHLFlBQUksR0FBRztBQUNMQyxZQUFFLEVBQUcsR0FBRS9DLE9BQU8sQ0FBQ2tGLE9BQVEsVUFBU2dGLFNBQVUsTUFBS2YsTUFBTyxTQURqRDtBQUVMaEcsWUFBRSxFQUFHLEdBQUVuRCxPQUFPLENBQUNrRixPQUFRLFNBQVFnRixTQUFVLE1BQUtmLE1BQU8sVUFGaEQ7QUFHTDlGLFlBQUUsRUFBRyxHQUFFckQsT0FBTyxDQUFDa0YsT0FBUSxPQUFNZ0YsU0FBVSxPQUFNZixNQUFPLEdBSC9DO0FBSUw3RixZQUFFLEVBQUcsR0FBRXRELE9BQU8sQ0FBQ2tGLE9BQVEsU0FBUWdGLFNBQVUsS0FBSWYsTUFBTyxHQUovQztBQUtMNUYsWUFBRSxFQUFHLEdBQUV2RCxPQUFPLENBQUNrRixPQUFRLFVBQVNnRixTQUFVLE1BQUtmLE1BQU87QUFMakQsU0FBUDtBQU9ELE9BUkQsTUFRTyxJQUFJSyxxQkFBcUIsSUFBSSxDQUFDQyxhQUE5QixFQUE2QztBQUNsRDNHLFlBQUksR0FBRztBQUNMQyxZQUFFLEVBQUcsR0FBRS9DLE9BQU8sQ0FBQ2tGLE9BQVEsVUFBU2dGLFNBQVUsTUFBS2YsTUFBTyxTQURqRDtBQUVMaEcsWUFBRSxFQUFHLEdBQUVuRCxPQUFPLENBQUNrRixPQUFRLFNBQVFnRixTQUFVLE1BQUtmLE1BQU8sU0FGaEQ7QUFHTDlGLFlBQUUsRUFBRyxHQUFFckQsT0FBTyxDQUFDa0YsT0FBUSxPQUFNZ0YsU0FBVSxPQUFNZixNQUFPLEdBSC9DO0FBSUw3RixZQUFFLEVBQUcsR0FBRXRELE9BQU8sQ0FBQ2tGLE9BQVEsU0FBUWdGLFNBQVUsS0FBSWYsTUFBTyxHQUovQztBQUtMNUYsWUFBRSxFQUFHLEdBQUV2RCxPQUFPLENBQUNrRixPQUFRLFVBQVNnRixTQUFVLE1BQUtmLE1BQU87QUFMakQsU0FBUDtBQU9EOztBQUVELGFBQU87QUFDTHZHLFlBQUksRUFBRSxNQUREO0FBRUxuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUZUO0FBR0xRLGFBQUssRUFBRW9ILEtBSEY7QUFJTG5ILFlBQUksRUFBRUE7QUFKRCxPQUFQO0FBTUQ7QUE1RUgsR0EzRFEsRUF5SVI7QUFDRXBDLE1BQUUsRUFBRSxpQ0FETjtBQUVFRSxZQUFRLEVBQUVnRCx1Q0FBQSxDQUFrQjtBQUFFaEMsWUFBTSxFQUFFLFlBQVY7QUFBd0JsQixRQUFFLEVBQUUsQ0FBQyxNQUFELEVBQVMsTUFBVDtBQUE1QixLQUFsQixDQUZaO0FBR0VJLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQ29LLGVBQUwsR0FBdUJwSyxJQUFJLENBQUNvSyxlQUFMLElBQXdCLEVBQS9DO0FBQ0FwSyxVQUFJLENBQUNvSyxlQUFMLENBQXFCbkssT0FBTyxDQUFDQyxRQUE3QixJQUF5Q0QsT0FBTyxDQUFDcUMsTUFBakQ7QUFDRDtBQU5ILEdBeklRLEVBaUpSO0FBQ0UzQixNQUFFLEVBQUUsaUNBRE47QUFFRUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWhDLFlBQU0sRUFBRSxZQUFWO0FBQXdCbEIsUUFBRSxFQUFFO0FBQTVCLEtBQW5CLENBRlo7QUFHRUcsYUFBUyxFQUFFLENBQUNkLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUM1QixVQUFJLENBQUNELElBQUksQ0FBQ29LLGVBQVYsRUFDRSxPQUFPLEtBQVA7QUFDRixhQUFPbkssT0FBTyxDQUFDcUMsTUFBUixLQUFtQnRDLElBQUksQ0FBQ29LLGVBQUwsQ0FBcUJuSyxPQUFPLENBQUNDLFFBQTdCLENBQTFCO0FBQ0QsS0FQSDtBQVFFbUIsV0FBTyxFQUFFLENBQUNyQixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDMUIsWUFBTW9LLFdBQVcsR0FBR3JLLElBQUksQ0FBQ2tELFNBQUwsQ0FBZWxELElBQUksQ0FBQ29LLGVBQUwsQ0FBcUJuSyxPQUFPLENBQUNDLFFBQTdCLENBQWYsQ0FBcEI7QUFDQSxhQUFPO0FBQ0wyQyxZQUFJLEVBQUUsTUFERDtBQUVMQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUZWO0FBR0xTLFlBQUksRUFBRTtBQUNKQyxZQUFFLEVBQUcsR0FBRS9DLE9BQU8sQ0FBQ2tGLE9BQVEsVUFBU2tGLFdBQVksR0FEeEM7QUFFSmpILFlBQUUsRUFBRyxHQUFFbkQsT0FBTyxDQUFDa0YsT0FBUSxTQUFRa0YsV0FBWSxHQUZ2QztBQUdKaEgsWUFBRSxFQUFHLEdBQUVwRCxPQUFPLENBQUNrRixPQUFRLFFBQU9rRixXQUFZLEdBSHRDO0FBSUovRyxZQUFFLEVBQUcsR0FBRXJELE9BQU8sQ0FBQ2tGLE9BQVEsS0FBSWtGLFdBQVksS0FKbkM7QUFLSjlHLFlBQUUsRUFBRyxHQUFFdEQsT0FBTyxDQUFDa0YsT0FBUSxPQUFNa0YsV0FBWSxHQUxyQztBQU1KN0csWUFBRSxFQUFHLEdBQUV2RCxPQUFPLENBQUNrRixPQUFRLFVBQVNrRixXQUFZO0FBTnhDO0FBSEQsT0FBUDtBQVlEO0FBdEJILEdBakpRLEVBeUtSO0FBQ0UxSixNQUFFLEVBQUUsMkNBRE47QUFFRTtBQUNBRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUhaO0FBSUUzQyxPQUFHLEVBQUUsQ0FBQ2YsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3RCRCxVQUFJLENBQUNzSyxJQUFMLEdBQVl0SyxJQUFJLENBQUNzSyxJQUFMLElBQWEsRUFBekI7QUFDQXRLLFVBQUksQ0FBQ3NLLElBQUwsQ0FBVXJLLE9BQU8sQ0FBQ3FDLE1BQWxCLElBQTRCLElBQTVCO0FBQ0Q7QUFQSCxHQXpLUSxFQWtMUjtBQUNFM0IsTUFBRSxFQUFFLDJDQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRTNDLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQ3NLLElBQUwsR0FBWXRLLElBQUksQ0FBQ3NLLElBQUwsSUFBYSxFQUF6QjtBQUNBdEssVUFBSSxDQUFDc0ssSUFBTCxDQUFVckssT0FBTyxDQUFDcUMsTUFBbEIsSUFBNEIsS0FBNUI7QUFDRDtBQU5ILEdBbExRLEVBMExSO0FBQ0UzQixNQUFFLEVBQUUsZ0NBRE47QUFFRUUsWUFBUSxFQUFFZ0QsdUNBQUEsQ0FBa0I7QUFBRWhDLFlBQU0sRUFBRSxtQkFBVjtBQUErQmxCLFFBQUUsRUFBRTtBQUFuQyxLQUFsQixDQUZaO0FBR0VrRyxjQUFVLEVBQUVoRCx1Q0FBQSxDQUFrQjtBQUFFaEMsWUFBTSxFQUFFLG9CQUFWO0FBQWdDbEIsUUFBRSxFQUFFO0FBQXBDLEtBQWxCLENBSGQ7QUFJRStELGNBQVUsRUFBRWIsdUNBQUEsQ0FBa0I7QUFBRWhDLFlBQU0sRUFBRSxrQkFBVjtBQUE4QmxCLFFBQUUsRUFBRTtBQUFsQyxLQUFsQixDQUpkO0FBS0VnRSxjQUFVLEVBQUVkLHVDQUFBLENBQWtCO0FBQUVoQyxZQUFNLEVBQUUsUUFBVjtBQUFvQmxCLFFBQUUsRUFBRTtBQUF4QixLQUFsQixDQUxkO0FBTUVJLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQ3VLLGtCQUFMLEdBQTBCdkssSUFBSSxDQUFDdUssa0JBQUwsSUFBMkIsRUFBckQ7QUFDQXZLLFVBQUksQ0FBQ3VLLGtCQUFMLENBQXdCdEssT0FBTyxDQUFDQyxRQUFSLENBQWlCQyxXQUFqQixFQUF4QixJQUEwREYsT0FBTyxDQUFDcUMsTUFBbEU7QUFDQXRDLFVBQUksQ0FBQ3dLLGVBQUwsR0FBdUJ4SyxJQUFJLENBQUN3SyxlQUFMLElBQXdCLEVBQS9DO0FBQ0F4SyxVQUFJLENBQUN3SyxlQUFMLENBQXFCdkosSUFBckIsQ0FBMEJoQixPQUFPLENBQUNxQyxNQUFsQztBQUNEO0FBWEgsR0ExTFEsRUF1TVI7QUFDRTNCLE1BQUUsRUFBRSxvQ0FETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFaEMsWUFBTSxFQUFFLG1CQUFWO0FBQStCbEIsUUFBRSxFQUFFO0FBQW5DLEtBQXZCLENBRlo7QUFHRWtHLGNBQVUsRUFBRWhELGlEQUFBLENBQXVCO0FBQUVoQyxZQUFNLEVBQUUsb0JBQVY7QUFBZ0NsQixRQUFFLEVBQUU7QUFBcEMsS0FBdkIsQ0FIZDtBQUlFK0QsY0FBVSxFQUFFYixpREFBQSxDQUF1QjtBQUFFaEMsWUFBTSxFQUFFLGtCQUFWO0FBQThCbEIsUUFBRSxFQUFFO0FBQWxDLEtBQXZCLENBSmQ7QUFLRWdFLGNBQVUsRUFBRWQsaURBQUEsQ0FBdUI7QUFBRWhDLFlBQU0sRUFBRSxRQUFWO0FBQW9CbEIsUUFBRSxFQUFFO0FBQXhCLEtBQXZCLENBTGQ7QUFNRVUsV0FBTyxFQUFFLENBQUNyQixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDMUI7QUFDQTtBQUNBLFVBQUksQ0FBQ0QsSUFBSSxDQUFDd0ssZUFBVixFQUNFO0FBQ0YsWUFBTU4sS0FBSyxHQUFHbEssSUFBSSxDQUFDdUssa0JBQUwsQ0FBd0J0SyxPQUFPLENBQUNDLFFBQVIsQ0FBaUJDLFdBQWpCLEVBQXhCLENBQWQ7QUFDQSxVQUFJLENBQUMrSixLQUFMLEVBQ0U7QUFDRixVQUFJakssT0FBTyxDQUFDcUMsTUFBUixLQUFtQjRILEtBQXZCLEVBQ0UsT0FUd0IsQ0FXMUI7QUFDQTs7QUFDQSxZQUFNTyxZQUFZLEdBQUd6SyxJQUFJLENBQUN3SyxlQUFMLENBQXFCbEssUUFBckIsQ0FBOEJMLE9BQU8sQ0FBQ3FDLE1BQXRDLENBQXJCO0FBQ0EsWUFBTW9JLGFBQWEsR0FBRzFLLElBQUksQ0FBQ3NLLElBQUwsSUFBYXRLLElBQUksQ0FBQ3NLLElBQUwsQ0FBVXJLLE9BQU8sQ0FBQ3FDLE1BQWxCLENBQW5DOztBQUVBLFVBQUltSSxZQUFZLElBQUlDLGFBQXBCLEVBQW1DO0FBQ2pDLGNBQU1QLFNBQVMsR0FBR25LLElBQUksQ0FBQ2tELFNBQUwsQ0FBZWdILEtBQWYsQ0FBbEI7QUFFQSxjQUFNUyxPQUFPLEdBQUcsQ0FBQyxFQUFqQjtBQUNBLGNBQU1oSSxDQUFDLEdBQUdzRCxVQUFVLENBQUNoRyxPQUFPLENBQUMwQyxDQUFULENBQXBCO0FBQ0EsY0FBTXNHLENBQUMsR0FBR2hELFVBQVUsQ0FBQ2hHLE9BQU8sQ0FBQ2dKLENBQVQsQ0FBcEI7QUFDQSxZQUFJMkIsTUFBTSxHQUFHLElBQWI7O0FBQ0EsWUFBSTNCLENBQUMsR0FBRzBCLE9BQVIsRUFBaUI7QUFDZixjQUFJaEksQ0FBQyxHQUFHLENBQVIsRUFDRWlJLE1BQU0sR0FBR0Msa0NBQVQsQ0FERixLQUdFRCxNQUFNLEdBQUdDLGtDQUFUO0FBQ0gsU0FMRCxNQUtPO0FBQ0wsY0FBSWxJLENBQUMsR0FBRyxDQUFSLEVBQ0VpSSxNQUFNLEdBQUdDLGtDQUFULENBREYsS0FHRUQsTUFBTSxHQUFHQyxrQ0FBVDtBQUNIOztBQUVELGVBQU87QUFDTGhJLGNBQUksRUFBRSxNQUREO0FBRUxDLGVBQUssRUFBRW9ILEtBRkY7QUFHTHhJLGNBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BSFQ7QUFJTFMsY0FBSSxFQUFFO0FBQ0pDLGNBQUUsRUFBRyxHQUFFL0MsT0FBTyxDQUFDa0YsT0FBUSxVQUFTZ0YsU0FBVSxLQUFJUyxNQUFNLENBQUMsSUFBRCxDQUFPLEdBRHZEO0FBRUp4SCxjQUFFLEVBQUcsR0FBRW5ELE9BQU8sQ0FBQ2tGLE9BQVEsU0FBUWdGLFNBQVUsS0FBSVMsTUFBTSxDQUFDLElBQUQsQ0FBTyxHQUZ0RDtBQUdKdkgsY0FBRSxFQUFHLEdBQUVwRCxPQUFPLENBQUNrRixPQUFRLFFBQU9nRixTQUFVLEtBQUlTLE1BQU0sQ0FBQyxJQUFELENBQU8sR0FIckQ7QUFJSnRILGNBQUUsRUFBRyxHQUFFckQsT0FBTyxDQUFDa0YsT0FBUSxLQUFJZ0YsU0FBVSxPQUFNUyxNQUFNLENBQUMsSUFBRCxDQUFPLEdBSnBEO0FBS0pySCxjQUFFLEVBQUcsR0FBRXRELE9BQU8sQ0FBQ2tGLE9BQVEsT0FBTWdGLFNBQVUsS0FBSVMsTUFBTSxDQUFDLElBQUQsQ0FBTyxFQUxwRDtBQU1KcEgsY0FBRSxFQUFHLEdBQUV2RCxPQUFPLENBQUNrRixPQUFRLFVBQVNnRixTQUFVLE1BQUtTLE1BQU0sQ0FBQyxJQUFELENBQU87QUFOeEQ7QUFKRCxTQUFQO0FBYUQ7QUFDRjtBQXZESCxHQXZNUSxFQWdRUjtBQUNFakssTUFBRSxFQUFFLDZCQUROO0FBRUVFLFlBQVEsRUFBRWdELCtEQUFBLENBQThCO0FBQUVuQyxVQUFJLEVBQUU7QUFBUixLQUE5QixDQUZaO0FBR0VYLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEIsWUFBTWdKLENBQUMsR0FBR2hELFVBQVUsQ0FBQ2hHLE9BQU8sQ0FBQ2dKLENBQVQsQ0FBcEI7QUFDQSxZQUFNMEIsT0FBTyxHQUFHLENBQUMsRUFBakI7QUFDQSxVQUFJMUIsQ0FBQyxHQUFHMEIsT0FBUixFQUNFM0ssSUFBSSxDQUFDOEssWUFBTCxHQUFvQjdLLE9BQU8sQ0FBQ1UsRUFBUixDQUFXUixXQUFYLEVBQXBCO0FBQ0g7QUFSSCxHQWhRUSxFQTBRUjtBQUNFUSxNQUFFLEVBQUUsa0NBRE47QUFFRUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWhDLFlBQU0sRUFBRSxpQkFBVjtBQUE2QmxCLFFBQUUsRUFBRTtBQUFqQyxLQUFuQixDQUZaO0FBR0VrRyxjQUFVLEVBQUVoRCx5Q0FBQSxDQUFtQjtBQUFFaEMsWUFBTSxFQUFFLDJCQUFWO0FBQXVDbEIsUUFBRSxFQUFFO0FBQTNDLEtBQW5CLENBSGQ7QUFJRStELGNBQVUsRUFBRWIseUNBQUEsQ0FBbUI7QUFBRWhDLFlBQU0sRUFBRSx5QkFBVjtBQUFxQ2xCLFFBQUUsRUFBRTtBQUF6QyxLQUFuQixDQUpkO0FBS0VnRSxjQUFVLEVBQUVkLHlDQUFBLENBQW1CO0FBQUVoQyxZQUFNLEVBQUUsU0FBVjtBQUFxQmxCLFFBQUUsRUFBRTtBQUF6QixLQUFuQixDQUxkO0FBTUVVLFdBQU8sRUFBRSxDQUFDckIsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQzFCLFlBQU04SyxZQUFZLEdBQUc5SyxPQUFPLENBQUM0QyxJQUFSLEtBQWlCLElBQXRDO0FBQ0EsWUFBTTZILGFBQWEsR0FBRzFLLElBQUksQ0FBQ3NLLElBQUwsSUFBYXRLLElBQUksQ0FBQ3NLLElBQUwsQ0FBVXJLLE9BQU8sQ0FBQ3FDLE1BQWxCLENBQW5DLENBRjBCLENBSTFCOztBQUNBLFVBQUl5SSxZQUFZLElBQUksQ0FBQ0wsYUFBckIsRUFDRTtBQUVGLFlBQU1NLE1BQU0sR0FBRztBQUNiRixvQkFBWSxFQUFFO0FBQ1o5SCxZQUFFLEVBQUUsZ0JBRFE7QUFFWkksWUFBRSxFQUFFLHFCQUZRO0FBR1pFLFlBQUUsRUFBRSxVQUhRO0FBSVpDLFlBQUUsRUFBRSxPQUpRO0FBS1pDLFlBQUUsRUFBRTtBQUxRLFNBREQ7QUFRYnlILG9CQUFZLEVBQUU7QUFDWmpJLFlBQUUsRUFBRSxnQkFEUTtBQUVaSSxZQUFFLEVBQUUsb0JBRlE7QUFHWkUsWUFBRSxFQUFFLFVBSFE7QUFJWkMsWUFBRSxFQUFFLE9BSlE7QUFLWkMsWUFBRSxFQUFFO0FBTFEsU0FSRDtBQWViMEgsY0FBTSxFQUFFO0FBQ05sSSxZQUFFLEVBQUUsUUFERTtBQUVOSSxZQUFFLEVBQUUsU0FGRTtBQUdORSxZQUFFLEVBQUUsS0FIRTtBQUlOQyxZQUFFLEVBQUUsSUFKRTtBQUtOQyxZQUFFLEVBQUU7QUFMRSxTQWZLO0FBc0JiMkgsa0JBQVUsRUFBRTtBQUNWbkksWUFBRSxFQUFFLFVBRE07QUFFVkksWUFBRSxFQUFFLGFBRk07QUFHVkUsWUFBRSxFQUFFLEtBSE07QUFJVkMsWUFBRSxFQUFFLFNBSk07QUFLVkMsWUFBRSxFQUFFO0FBTE07QUF0QkMsT0FBZjtBQStCQSxZQUFNNEgsTUFBTSxHQUFHLEVBQWY7O0FBQ0EsVUFBSXBMLElBQUksQ0FBQzhLLFlBQVQsRUFBdUI7QUFDckIsWUFBSTlLLElBQUksQ0FBQzhLLFlBQUwsS0FBc0I3SyxPQUFPLENBQUNDLFFBQWxDLEVBQ0VrTCxNQUFNLENBQUNuSyxJQUFQLENBQVkrSixNQUFNLENBQUNGLFlBQVAsQ0FBb0I5SyxJQUFJLENBQUNxTCxVQUF6QixLQUF3Q0wsTUFBTSxDQUFDRixZQUFQLENBQW9CLElBQXBCLENBQXBELEVBREYsS0FHRU0sTUFBTSxDQUFDbkssSUFBUCxDQUFZK0osTUFBTSxDQUFDQyxZQUFQLENBQW9CakwsSUFBSSxDQUFDcUwsVUFBekIsS0FBd0NMLE1BQU0sQ0FBQ0MsWUFBUCxDQUFvQixJQUFwQixDQUFwRDtBQUNIOztBQUNELFVBQUksQ0FBQ0YsWUFBTCxFQUNFSyxNQUFNLENBQUNuSyxJQUFQLENBQVkrSixNQUFNLENBQUNFLE1BQVAsQ0FBY2xMLElBQUksQ0FBQ3FMLFVBQW5CLEtBQWtDTCxNQUFNLENBQUNFLE1BQVAsQ0FBYyxJQUFkLENBQTlDO0FBQ0YsVUFBSVIsYUFBSixFQUNFVSxNQUFNLENBQUNuSyxJQUFQLENBQVkrSixNQUFNLENBQUNHLFVBQVAsQ0FBa0JuTCxJQUFJLENBQUNxTCxVQUF2QixLQUFzQ0wsTUFBTSxDQUFDRyxVQUFQLENBQWtCLElBQWxCLENBQWxEO0FBRUYsYUFBTztBQUNMdEksWUFBSSxFQUFFLE1BREQ7QUFFTG5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BRlQ7QUFHTFMsWUFBSSxFQUFHLEdBQUU5QyxPQUFPLENBQUNrRixPQUFRLEtBQUlpRyxNQUFNLENBQUNqSSxJQUFQLENBQVksSUFBWixDQUFrQjtBQUgxQyxPQUFQO0FBS0Q7QUE5REgsR0ExUVEsRUEwVVI7QUFDRXhDLE1BQUUsRUFBRSxrQkFETjtBQUVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0FFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUUsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQixFQUF5QixNQUF6QjtBQUFOLEtBQW5CLENBTlo7QUFPRWlGLGVBQVcsRUFBRSxDQUFDdkIsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMvQixhQUFPO0FBQ0w0QyxZQUFJLEVBQUUsTUFERDtBQUVMbkIsWUFBSSxFQUFFekIsT0FBTyxDQUFDcUMsTUFGVDtBQUdMdUQsY0FBTSxFQUFFO0FBQ043QyxZQUFFLEVBQUUsYUFERTtBQUVOSSxZQUFFLEVBQUUsZ0JBRkU7QUFHTkMsWUFBRSxFQUFFLGtCQUhFO0FBSU5DLFlBQUUsRUFBRSxRQUpFO0FBS05DLFlBQUUsRUFBRSxNQUxFO0FBTU5DLFlBQUUsRUFBRTtBQU5FO0FBSEgsT0FBUDtBQVlEO0FBcEJILEdBMVVRLEVBZ1dSO0FBQ0U3QyxNQUFFLEVBQUUsdUJBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWMsU0FBRzJGLHVDQUFrQkE7QUFBbkMsS0FBdkIsQ0FGWjtBQUdFeEYsYUFBUyxFQUFFLENBQUNkLElBQUQsRUFBT0MsT0FBUCxLQUFtQkQsSUFBSSxDQUFDb0YsaUJBQUwsQ0FBdUJuRixPQUF2QixJQUFrQyxDQUhsRTtBQUlFb0IsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDa0Y7QUFBckQsT0FBUDtBQUNEO0FBTkgsR0FoV1E7QUF0Q0csQ0FBZixFOztBQzVCQTtDQUdBO0FBRUE7O0FBQ0Esd0RBQWU7QUFDYmpCLFFBQU0sRUFBRUMsOERBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLDZCQUF5QixNQURmO0FBQ3VCO0FBQ2pDLDZCQUF5QixNQUZmO0FBRXVCO0FBQ2pDLDZCQUF5QixNQUhmO0FBR3VCO0FBQ2pDLDZCQUF5QixNQUpmO0FBSXVCO0FBQ2pDLDZCQUF5QixNQUxmO0FBS3VCO0FBQ2pDLDZCQUF5QixNQU5mO0FBTXVCO0FBQ2pDLDZCQUF5QixNQVBmO0FBT3VCO0FBQ2pDLGtEQUE4QyxNQVJwQztBQVE0QztBQUN0RCxvQ0FBZ0MsTUFUdEI7QUFTOEI7QUFDeEMsb0NBQWdDLE1BVnRCLENBVThCOztBQVY5QixHQUZDO0FBY2JFLFlBQVUsRUFBRTtBQUNWLGlDQUE2QixNQURuQjtBQUMyQjtBQUNyQyxrQ0FBOEIsTUFGcEI7QUFFNEI7QUFDdEMsZ0NBQTRCLE1BSGxCO0FBRzBCO0FBQ3BDLGdDQUE0QixNQUpsQjtBQUkwQjtBQUNwQyxtQ0FBK0IsTUFMckI7QUFLNkI7QUFDdkMsbUNBQStCLE1BTnJCLENBTTZCOztBQU43QixHQWRDO0FBc0JiRCxXQUFTLEVBQUU7QUFDVCw2QkFBeUIsTUFEaEI7QUFDd0I7QUFDakMsOEJBQTBCLE1BRmpCLENBRXlCOztBQUZ6QixHQXRCRTtBQTBCYk0sV0FBUyxFQUFFO0FBQ1QsMkJBQXVCLE1BRGQsQ0FDc0I7O0FBRHRCLEdBMUJFO0FBNkJiMUIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSx1Q0FETjtBQUVFRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFO0FBQU4sS0FBbkIsQ0FGWjtBQUdFaUYsZUFBVyxFQUFFLENBQUN2QixLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQy9CLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUZUO0FBR0x1RCxjQUFNLEVBQUU7QUFDTjdDLFlBQUUsRUFBRSxhQURFO0FBRU5JLFlBQUUsRUFBRSxnQkFGRTtBQUdOQyxZQUFFLEVBQUUsa0JBSEU7QUFJTkMsWUFBRSxFQUFFLFFBSkU7QUFLTkMsWUFBRSxFQUFFLE1BTEU7QUFNTkMsWUFBRSxFQUFFO0FBTkU7QUFISCxPQUFQO0FBWUQ7QUFoQkgsR0FEUTtBQTdCRyxDQUFmLEU7O0FDTkE7Q0FHQTs7QUFDQSxxREFBZTtBQUNiVSxRQUFNLEVBQUVDLGdEQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVixnQ0FBNEIsTUFEbEI7QUFDMEI7QUFDcEMsK0NBQTJDLE1BRmpDO0FBRXlDO0FBQ25ELCtDQUEyQyxNQUhqQztBQUd5QztBQUNuRCx1Q0FBbUMsTUFKekIsQ0FJaUM7O0FBSmpDLEdBRkM7QUFRYkUsWUFBVSxFQUFFO0FBQ1Ysc0NBQWtDLE1BRHhCO0FBQ2dDO0FBQzFDLHVDQUFtQyxNQUZ6QjtBQUVpQztBQUMzQyxxQ0FBaUMsTUFIdkI7QUFHK0I7QUFDekMscUNBQWlDLE1BSnZCO0FBSStCO0FBQ3pDLHdDQUFvQyxNQUwxQjtBQUtrQztBQUM1Qyx3Q0FBb0MsTUFOMUIsQ0FNa0M7O0FBTmxDLEdBUkM7QUFnQmJELFdBQVMsRUFBRTtBQUNULG1DQUErQixNQUR0QixDQUM4Qjs7QUFEOUIsR0FoQkU7QUFtQmJwQixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLDRDQUROO0FBRUVFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUFuQixDQUZaO0FBR0VpRixlQUFXLEVBQUUsQ0FBQ3ZCLEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDL0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTG5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BRlQ7QUFHTHVELGNBQU0sRUFBRTtBQUNON0MsWUFBRSxFQUFFLGFBREU7QUFFTkksWUFBRSxFQUFFLGdCQUZFO0FBR05DLFlBQUUsRUFBRSxrQkFIRTtBQUlOQyxZQUFFLEVBQUUsUUFKRTtBQUtOQyxZQUFFLEVBQUUsTUFMRTtBQU1OQyxZQUFFLEVBQUU7QUFORTtBQUhILE9BQVA7QUFZRDtBQWhCSCxHQURRO0FBbkJHLENBQWYsRTs7QUNKQTtBQUVBLHdEQUFlO0FBQ2JVLFFBQU0sRUFBRUMsa0VBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLDBCQUFzQixNQURaO0FBQ29CO0FBQzlCLGdDQUE0QixNQUZsQjtBQUUwQjtBQUNwQyxnQ0FBNEIsTUFIbEI7QUFHMEI7QUFDcEMsNEJBQXdCLE1BSmQ7QUFJc0I7QUFDaEMsNEJBQXdCLE1BTGQ7QUFLc0I7QUFDaEMsMkJBQXVCLE1BTmI7QUFNcUI7QUFDL0IsOENBQTBDLE1BUGhDO0FBT3dDO0FBQ2xELGdEQUE0QyxNQVJsQztBQVEwQztBQUNwRCxvQ0FBZ0MsTUFUdEI7QUFTOEI7QUFDeEMsOEJBQTBCLE1BVmhCO0FBVXdCO0FBQ2xDLDhCQUEwQixNQVhoQjtBQVd3QjtBQUNsQyw2QkFBeUIsTUFaZjtBQVl1QjtBQUNqQyx1Q0FBbUMsTUFiekI7QUFhaUM7QUFDM0Msd0JBQW9CLE1BZFY7QUFja0I7QUFDNUIsZ0NBQTRCLE1BZmxCLENBZTBCOztBQWYxQixHQUZDO0FBbUJiQyxXQUFTLEVBQUU7QUFDVCxrQ0FBOEIsTUFEckI7QUFDNkI7QUFDdEMsdUNBQW1DLE1BRjFCO0FBRWtDO0FBQzNDLHVDQUFtQyxNQUgxQjtBQUdrQztBQUMzQyx1Q0FBbUMsTUFKMUI7QUFJa0M7QUFDM0MsdUNBQW1DLE1BTDFCLENBS2tDOztBQUxsQztBQW5CRSxDQUFmLEU7O0FDRkE7QUFDQTtBQUVBLHFEQUFlO0FBQ2J0QixRQUFNLEVBQUVDLG9EQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViwrQkFBMkIsTUFEakI7QUFDeUI7QUFDbkMscUNBQWlDLE1BRnZCO0FBRStCO0FBQ3pDLHFDQUFpQyxNQUh2QjtBQUcrQjtBQUN6QyxxQ0FBaUMsTUFKdkI7QUFJK0I7QUFDekMsaUNBQTZCLE1BTG5CO0FBSzJCO0FBQ3JDLGlDQUE2QixNQU5uQjtBQU0yQjtBQUNyQyw4Q0FBMEMsTUFQaEM7QUFPd0M7QUFDbEQsbUNBQStCLE1BUnJCO0FBUTZCO0FBQ3ZDLG1DQUErQixNQVRyQjtBQVM2QjtBQUN2QyxtQ0FBK0IsTUFWckI7QUFVNkI7QUFDdkMsbUNBQStCLE1BWHJCO0FBVzZCO0FBQ3ZDLGdDQUE0QixNQVpsQjtBQVkwQjtBQUNwQyxzQ0FBa0MsTUFieEI7QUFhZ0M7QUFDMUMsa0NBQThCLE1BZHBCO0FBYzRCO0FBQ3RDLDBDQUFzQyxNQWY1QjtBQWVvQztBQUM5Qyw4Q0FBMEMsTUFoQmhDO0FBZ0J3QztBQUNsRCwwQ0FBc0MsTUFqQjVCO0FBaUJvQztBQUM5Qyw0Q0FBd0MsTUFsQjlCO0FBa0JzQztBQUNoRCwyQ0FBdUMsTUFuQjdCO0FBbUJxQztBQUMvQyxrQ0FBOEIsTUFwQnBCLENBb0I0Qjs7QUFwQjVCLEdBRkM7QUF3QmJDLFdBQVMsRUFBRTtBQUNULDBDQUFzQyxNQUQ3QjtBQUNxQztBQUM5QywwQ0FBc0MsTUFGN0IsQ0FFcUM7O0FBRnJDLEdBeEJFO0FBNEJicEIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSw0Q0FETjtBQUVFRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFO0FBQU4sS0FBbkIsQ0FGWjtBQUdFaUYsZUFBVyxFQUFFLENBQUN2QixLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQy9CLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUZUO0FBR0x1RCxjQUFNLEVBQUU7QUFDTjdDLFlBQUUsRUFBRSxhQURFO0FBRU5JLFlBQUUsRUFBRSxnQkFGRTtBQUdOQyxZQUFFLEVBQUUsa0JBSEU7QUFJTkMsWUFBRSxFQUFFLFFBSkU7QUFLTkMsWUFBRSxFQUFFLE1BTEU7QUFNTkMsWUFBRSxFQUFFO0FBTkU7QUFISCxPQUFQO0FBWUQ7QUFoQkgsR0FEUSxFQW1CUjtBQUNFO0FBQ0E3QyxNQUFFLEVBQUUseUNBRk47QUFHRUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWxELFFBQUUsRUFBRSxDQUFDLE1BQUQsRUFBUyxNQUFUO0FBQU4sS0FBbkIsQ0FIWjtBQUlFaUYsZUFBVyxFQUFFLENBQUN2QixLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQy9CLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUZUO0FBR0x1RCxjQUFNLEVBQUU7QUFDTjdDLFlBQUUsRUFBRSxrQkFERTtBQUVOSSxZQUFFLEVBQUUsc0JBRkU7QUFHTkUsWUFBRSxFQUFFLFVBSEU7QUFJTkMsWUFBRSxFQUFFLE1BSkU7QUFLTkMsWUFBRSxFQUFFO0FBTEU7QUFISCxPQUFQO0FBV0Q7QUFoQkgsR0FuQlE7QUE1QkcsQ0FBZixFOztBQ0hBO0FBQ0E7Q0FJQTs7QUFDQSwrQ0FBZTtBQUNiVSxRQUFNLEVBQUVDLGtGQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViwrQkFBMkIsTUFEakI7QUFFViwrQkFBMkIsTUFGakI7QUFHViwrQkFBMkIsTUFIakI7QUFJVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQXdCLE1BVGQ7QUFVViwyQkFBdUIsTUFWYjtBQVdWLDZCQUF5QixNQVhmO0FBWVYsZ0NBQTRCLE1BWmxCO0FBYVYsOEJBQTBCLE1BYmhCO0FBY1YsOEJBQTBCO0FBZGhCLEdBRkM7QUFrQmJFLFlBQVUsRUFBRTtBQUNWLHFCQUFpQixNQURQO0FBQ2U7QUFDekIsZ0NBQTRCLE1BRmxCO0FBR1YsMkJBQXVCLE1BSGI7QUFJViwyQkFBdUIsTUFKYjtBQUtWLDZCQUF5QixNQUxmO0FBTVYsMEJBQXNCO0FBTlosR0FsQkM7QUEwQmJELFdBQVMsRUFBRTtBQUNULHFDQUFpQyxNQUR4QjtBQUVULGdDQUE0QixlQUZuQjtBQUdULDRCQUF3QixNQUhmO0FBSVQsNkJBQXlCLE1BSmhCO0FBS1QsNkJBQXlCO0FBTGhCLEdBMUJFO0FBaUNicEIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSx3QkFETjtBQUVFRSxZQUFRLEVBQUVnRCx1Q0FBQSxDQUFrQjtBQUFFaEMsWUFBTSxFQUFFLHdCQUFWO0FBQW9DbEIsUUFBRSxFQUFFO0FBQXhDLEtBQWxCLENBRlo7QUFHRUksT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDc0wsT0FBTCxHQUFldEwsSUFBSSxDQUFDc0wsT0FBTCxJQUFnQixFQUEvQjtBQUNBdEwsVUFBSSxDQUFDc0wsT0FBTCxDQUFhckssSUFBYixDQUFrQmhCLE9BQU8sQ0FBQ3FDLE1BQTFCO0FBQ0Q7QUFOSCxHQURRLEVBU1I7QUFDRTNCLE1BQUUsRUFBRSxpQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFaEIsVUFBSSxFQUFFLElBQVI7QUFBY2xDLFFBQUUsRUFBRSxNQUFsQjtBQUEwQixTQUFHMkYsdUNBQWtCQTtBQUEvQyxLQUF2QixDQUZaO0FBR0U7QUFDQXhGLGFBQVMsRUFBRSxDQUFDZCxJQUFELEVBQU9DLE9BQVAsS0FBbUJELElBQUksQ0FBQ3NMLE9BQUwsSUFBZ0J0TCxJQUFJLENBQUNzTCxPQUFMLENBQWFoTCxRQUFiLENBQXNCTCxPQUFPLENBQUNxQyxNQUE5QixDQUpoRDtBQUtFakIsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDa0Y7QUFBckQsT0FBUDtBQUNEO0FBUEgsR0FUUSxFQWtCUjtBQUNFeEUsTUFBRSxFQUFFLHFCQUROO0FBRUVFLFlBQVEsRUFBRWdELHVDQUFBLENBQWtCO0FBQUVoQyxZQUFNLEVBQUUsQ0FBQyxtQkFBRCxFQUFzQixtQkFBdEIsQ0FBVjtBQUFzRGxCLFFBQUUsRUFBRSxNQUExRDtBQUFrRWlHLGFBQU8sRUFBRTtBQUEzRSxLQUFsQixDQUZaO0FBR0V2RixXQUFPLEVBQUU7QUFDUHdCLFVBQUksRUFBRSxNQURDO0FBRVBFLFVBQUksRUFBRTtBQUNKQyxVQUFFLEVBQUUsa0JBREE7QUFFSkksVUFBRSxFQUFFLGdCQUZBO0FBR0pDLFVBQUUsRUFBRSxtQkFIQTtBQUlKQyxVQUFFLEVBQUUsUUFKQTtBQUtKQyxVQUFFLEVBQUUsVUFMQTtBQU1KQyxVQUFFLEVBQUU7QUFOQTtBQUZDO0FBSFgsR0FsQlEsRUFpQ1I7QUFDRTdDLE1BQUUsRUFBRSxzQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBYyxTQUFHMkYsdUNBQWtCQTtBQUFuQyxLQUF2QixDQUZaO0FBR0V4RixhQUFTLEVBQUUsQ0FBQ2QsSUFBRCxFQUFPQyxPQUFQLEtBQW1CRCxJQUFJLENBQUNvRixpQkFBTCxDQUF1Qm5GLE9BQXZCLElBQWtDLENBSGxFO0FBSUVvQixXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNrRjtBQUFyRCxPQUFQO0FBQ0Q7QUFOSCxHQWpDUSxFQXlDUjtBQUNFeEUsTUFBRSxFQUFFLDJCQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRTNDLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQ3FILGNBQUwsR0FBc0JySCxJQUFJLENBQUNxSCxjQUFMLElBQXVCLEVBQTdDO0FBQ0FySCxVQUFJLENBQUNxSCxjQUFMLENBQW9CcEgsT0FBTyxDQUFDcUMsTUFBNUIsSUFBc0MsSUFBdEM7QUFDRDtBQU5ILEdBekNRLEVBaURSO0FBQ0UzQixNQUFFLEVBQUUsMkJBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDcUgsY0FBTCxHQUFzQnJILElBQUksQ0FBQ3FILGNBQUwsSUFBdUIsRUFBN0M7QUFDQXJILFVBQUksQ0FBQ3FILGNBQUwsQ0FBb0JwSCxPQUFPLENBQUNxQyxNQUE1QixJQUFzQyxLQUF0QztBQUNEO0FBTkgsR0FqRFEsRUF5RFI7QUFDRTNCLE1BQUUsRUFBRSxzQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0V4QyxnQkFBWSxFQUFFLENBQUNtRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CZ0csVUFBVSxDQUFDaEcsT0FBTyxDQUFDaUcsUUFBVCxDQUFWLEdBQStCLEdBSG5FO0FBSUVOLGVBQVcsRUFBRSxDQUFDNUYsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQzlCLFVBQUksQ0FBQ0QsSUFBSSxDQUFDcUgsY0FBVixFQUNFO0FBQ0YsVUFBSSxDQUFDckgsSUFBSSxDQUFDcUgsY0FBTCxDQUFvQnBILE9BQU8sQ0FBQ3FDLE1BQTVCLENBQUwsRUFDRTtBQUNGLGFBQU87QUFDTFosWUFBSSxFQUFFekIsT0FBTyxDQUFDcUMsTUFEVDtBQUVMdUQsY0FBTSxFQUFFNUYsT0FBTyxDQUFDb0Y7QUFGWCxPQUFQO0FBSUQ7QUFiSCxHQXpEUSxFQXdFUjtBQUNFMUUsTUFBRSxFQUFFLG1CQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRTNDLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQzBILE9BQUwsR0FBZTFILElBQUksQ0FBQzBILE9BQUwsSUFBZ0IsRUFBL0I7QUFDQTFILFVBQUksQ0FBQzBILE9BQUwsQ0FBYXpILE9BQU8sQ0FBQ3FDLE1BQXJCLElBQStCLElBQS9CO0FBQ0Q7QUFOSCxHQXhFUSxFQWdGUjtBQUNFM0IsTUFBRSxFQUFFLG1CQUROO0FBRUVFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVILGNBQVEsRUFBRTtBQUFaLEtBQXZCLENBRlo7QUFHRTNDLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQzBILE9BQUwsR0FBZTFILElBQUksQ0FBQzBILE9BQUwsSUFBZ0IsRUFBL0I7QUFDQTFILFVBQUksQ0FBQzBILE9BQUwsQ0FBYXpILE9BQU8sQ0FBQ3FDLE1BQXJCLElBQStCLEtBQS9CO0FBQ0Q7QUFOSCxHQWhGUSxFQXdGUjtBQUNFM0IsTUFBRSxFQUFFLGNBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFeEMsZ0JBQVksRUFBRSxDQUFDbUQsS0FBRCxFQUFRcEUsT0FBUixLQUFvQmdHLFVBQVUsQ0FBQ2hHLE9BQU8sQ0FBQ2lHLFFBQVQsQ0FBVixHQUErQixHQUhuRTtBQUlFTixlQUFXLEVBQUUsQ0FBQzVGLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUM5QixVQUFJLENBQUNELElBQUksQ0FBQzBILE9BQVYsRUFDRTtBQUNGLFVBQUksQ0FBQzFILElBQUksQ0FBQzBILE9BQUwsQ0FBYXpILE9BQU8sQ0FBQ3FDLE1BQXJCLENBQUwsRUFDRTtBQUNGLGFBQU87QUFDTFosWUFBSSxFQUFFekIsT0FBTyxDQUFDcUMsTUFEVDtBQUVMdUQsY0FBTSxFQUFFNUYsT0FBTyxDQUFDb0Y7QUFGWCxPQUFQO0FBSUQ7QUFiSCxHQXhGUTtBQWpDRyxDQUFmLEU7O0NDSkE7O0FBQ0EsNENBQWU7QUFDYm5CLFFBQU0sRUFBRUMsZ0RBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLHlCQUFxQixNQURYO0FBRVYseUJBQXFCLE1BRlg7QUFHViwyQkFBdUIsTUFIYjtBQUlWLDZCQUF5QixNQUpmO0FBS1YsNkJBQXlCLE1BTGY7QUFNViwwQkFBc0IsTUFOWjtBQU9WLDJCQUF1QixNQVBiO0FBUVYsdUJBQW1CLE1BUlQ7QUFTViwyQkFBdUIsTUFUYjtBQVVWLGtCQUFjLE1BVko7QUFXVixvQkFBZ0IsTUFYTjtBQVlWLG9CQUFnQjtBQVpOLEdBRkM7QUFnQmJPLFdBQVMsRUFBRTtBQUNULDBCQUFzQixNQURiO0FBRVQsOEJBQTBCLE1BRmpCO0FBR1QsOEJBQTBCLE1BSGpCO0FBSVQseUJBQXFCO0FBSlo7QUFoQkUsQ0FBZixFOztDQ0RBOztBQUNBLG1EQUFlO0FBQ2I1QixRQUFNLEVBQUVDLG9GQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViwyQkFBdUIsTUFEYjtBQUVWLDRCQUF3QixNQUZkO0FBR1YsNEJBQXdCLE1BSGQ7QUFJVixzQ0FBa0MsTUFKeEI7QUFLVixzQ0FBa0MsTUFMeEI7QUFNVixrQ0FBOEIsTUFOcEI7QUFPVixrQ0FBOEIsTUFQcEI7QUFRVixrQ0FBOEIsTUFScEI7QUFTVixrQ0FBOEIsTUFUcEI7QUFVVixrQ0FBOEIsTUFWcEI7QUFXVixrQ0FBOEIsTUFYcEI7QUFZVixrQ0FBOEIsTUFacEI7QUFhVixrQ0FBOEIsTUFicEI7QUFjViwyQkFBdUIsTUFkYjtBQWVWLDhCQUEwQixNQWZoQjtBQWdCViw4QkFBMEIsTUFoQmhCO0FBaUJWLDhCQUEwQixNQWpCaEI7QUFrQlYsOEJBQTBCLE1BbEJoQjtBQW1CViw4QkFBMEIsTUFuQmhCO0FBb0JWLDhCQUEwQixNQXBCaEI7QUFxQlYsOEJBQTBCLE1BckJoQjtBQXNCViw4QkFBMEIsTUF0QmhCO0FBdUJWLHdCQUFvQixNQXZCVjtBQXdCVix3QkFBb0IsTUF4QlY7QUF5QlYsd0JBQW9CLE1BekJWO0FBMEJWLHdCQUFvQjtBQTFCVjtBQUZDLENBQWYsRTs7Q0NEQTs7QUFDQSxnREFBZTtBQUNickIsUUFBTSxFQUFFQyxzRUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YscUJBQWlCLE1BRFA7QUFFVix5QkFBcUIsTUFGWDtBQUlWLDBCQUFzQixNQUpaO0FBS1YsMEJBQXNCLE1BTFo7QUFNViwwQkFBc0IsTUFOWjtBQU9WLDBCQUFzQixNQVBaO0FBU1YsNEJBQXdCLE1BVGQ7QUFVViw0QkFBd0IsTUFWZDtBQVdWLDRCQUF3QixNQVhkO0FBWVYsNEJBQXdCLE1BWmQ7QUFjVixzQkFBa0IsTUFkUjtBQWVWLHNCQUFrQixNQWZSO0FBZ0JWLHNCQUFrQixNQWhCUjtBQWlCVixzQkFBa0I7QUFqQlI7QUFGQyxDQUFmLEU7O0FDSEE7Q0FHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOztBQUNBLDhDQUFlO0FBQ2JyQixRQUFNLEVBQUVDLDhEQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVix5QkFBcUIsTUFEWDtBQUNtQjtBQUM3Qix3QkFBb0IsTUFGVjtBQUVrQjtBQUM1Qix5QkFBcUIsTUFIWCxDQUdtQjs7QUFIbkIsR0FGQztBQU9iRSxZQUFVLEVBQUU7QUFDVix3QkFBb0IsTUFEVjtBQUNrQjtBQUM1Qiw4QkFBMEIsTUFGaEI7QUFFd0I7QUFDbEMsOEJBQTBCLE1BSGhCO0FBR3dCO0FBQ2xDLDhCQUEwQixNQUpoQjtBQUl3QjtBQUNsQyw4QkFBMEIsTUFMaEIsQ0FLd0I7O0FBTHhCLEdBUEM7QUFjYkMsaUJBQWUsRUFBRTtBQUNmLHFCQUFpQixLQURGLENBQ1M7O0FBRFQsR0FkSjtBQWlCYkMsaUJBQWUsRUFBRTtBQUNmLHVCQUFtQixLQURKLENBQ1c7O0FBRFgsR0FqQko7QUFvQmJ2QixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLDhCQUROO0FBRUVFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUU7QUFBTixLQUFuQixDQUZaO0FBR0VpRixlQUFXLEVBQUUsQ0FBQ3ZCLEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDL0IsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTG5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BRlQ7QUFHTHVELGNBQU0sRUFBRTtBQUNON0MsWUFBRSxFQUFFLGFBREU7QUFFTkksWUFBRSxFQUFFLGdCQUZFO0FBR05DLFlBQUUsRUFBRSxrQkFIRTtBQUlOQyxZQUFFLEVBQUUsUUFKRTtBQUtOQyxZQUFFLEVBQUUsTUFMRTtBQU1OQyxZQUFFLEVBQUU7QUFORTtBQUhILE9BQVA7QUFZRDtBQWhCSCxHQURRO0FBcEJHLENBQWYsRTs7QUNiQTtDQUdBO0FBQ0E7QUFFQTs7QUFDQSxxREFBZTtBQUNiVSxRQUFNLEVBQUVDLDREQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVixtQ0FBK0IsTUFEckI7QUFDNkI7QUFDdkMsK0JBQTJCLE1BRmpCO0FBRXlCO0FBQ25DLCtCQUEyQixNQUhqQjtBQUd5QjtBQUNuQywrQkFBMkIsTUFKakI7QUFJeUI7QUFDbkMsK0JBQTJCLE1BTGpCO0FBS3lCO0FBQ25DLCtCQUEyQixNQU5qQjtBQU15QjtBQUNuQywrQkFBMkIsTUFQakI7QUFPeUI7QUFDbkMsd0JBQW9CLE1BUlY7QUFRa0I7QUFDNUIsdUJBQW1CLE1BVFQ7QUFTaUI7QUFDM0IsNkJBQXlCLE1BVmY7QUFVdUI7QUFDakMsNkJBQXlCLE1BWGY7QUFXdUI7QUFDakMsNkJBQXlCLE1BWmY7QUFZdUI7QUFDakMsNkJBQXlCLE1BYmY7QUFhdUI7QUFDakMsNkJBQXlCLE1BZGY7QUFjdUI7QUFDakMsNkJBQXlCLE1BZmY7QUFldUI7QUFDakMsNkJBQXlCLE1BaEJmO0FBZ0J1QjtBQUNqQyw2QkFBeUIsTUFqQmY7QUFpQnVCO0FBQ2pDLDZCQUF5QixNQWxCZjtBQWtCdUI7QUFDakMsOEJBQTBCLE1BbkJoQjtBQW1Cd0I7QUFDbEMsOEJBQTBCLE1BcEJoQjtBQW9Cd0I7QUFDbEMsOEJBQTBCLE1BckJoQjtBQXFCd0I7QUFDbEMsOEJBQTBCLE1BdEJoQjtBQXNCd0I7QUFDbEMsOEJBQTBCLE1BdkJoQjtBQXVCd0I7QUFDbEMsOEJBQTBCLE1BeEJoQjtBQXdCd0I7QUFDbEMsOEJBQTBCLE1BekJoQjtBQXlCd0I7QUFDbEMsOEJBQTBCLE1BMUJoQjtBQTBCd0I7QUFDbEMsOEJBQTBCLE1BM0JoQjtBQTJCd0I7QUFDbEMsOEJBQTBCLE1BNUJoQjtBQTRCd0I7QUFDbEMsOEJBQTBCLE1BN0JoQjtBQTZCd0I7QUFDbEMsOEJBQTBCLE1BOUJoQjtBQThCd0I7QUFDbEMsOEJBQTBCLE1BL0JoQjtBQStCd0I7QUFDbEMsNEJBQXdCLE1BaENkO0FBZ0NzQjtBQUNoQyw0QkFBd0IsTUFqQ2Q7QUFpQ3NCO0FBQ2hDLDRCQUF3QixNQWxDZDtBQWtDc0I7QUFDaEMsNEJBQXdCLE1BbkNkO0FBbUNzQjtBQUNoQyw0QkFBd0IsTUFwQ2Q7QUFvQ3NCO0FBQ2hDLDJCQUF1QixNQXJDYjtBQXFDcUI7QUFDL0IseUJBQXFCLE1BdENYO0FBc0NtQjtBQUM3QixpQ0FBNkIsTUF2Q25CLENBdUMyQjs7QUF2QzNCLEdBRkM7QUEyQ2JFLFlBQVUsRUFBRTtBQUNWLGdDQUE0QixNQURsQjtBQUMwQjtBQUNwQywyQkFBdUIsTUFGYjtBQUVxQjtBQUMvQiwyQkFBdUIsTUFIYjtBQUdxQjtBQUMvQixtQ0FBK0IsTUFKckIsQ0FJNkI7O0FBSjdCLEdBM0NDO0FBaURiRCxXQUFTLEVBQUU7QUFDVCw0QkFBd0IsTUFEZjtBQUN1QjtBQUNoQyw0QkFBd0IsTUFGZixDQUV1Qjs7QUFGdkIsR0FqREU7QUFxRGJHLGlCQUFlLEVBQUU7QUFDZix1QkFBbUIsS0FESixDQUNXOztBQURYLEdBckRKO0FBd0RidkIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSxnQkFETjtBQUVFRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFO0FBQU4sS0FBbkIsQ0FGWjtBQUdFaUYsZUFBVyxFQUFFLENBQUN2QixLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQy9CLGFBQU87QUFDTDRDLFlBQUksRUFBRSxNQUREO0FBRUxuQixZQUFJLEVBQUV6QixPQUFPLENBQUNxQyxNQUZUO0FBR0x1RCxjQUFNLEVBQUU7QUFDTjdDLFlBQUUsRUFBRSxtQkFERTtBQUVOSSxZQUFFLEVBQUUsc0JBRkU7QUFHTkUsWUFBRSxFQUFFLFVBSEU7QUFJTkMsWUFBRSxFQUFFLE1BSkU7QUFLTkMsWUFBRSxFQUFFO0FBTEU7QUFISCxPQUFQO0FBV0Q7QUFmSCxHQURRO0FBeERHLENBQWYsRTs7Q0NMQTs7QUFDQSxrREFBZTtBQUNiVSxRQUFNLEVBQUVDLDhDQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVix1QkFBbUIsTUFEVDtBQUNpQjtBQUMzQiw2QkFBeUIsTUFGZjtBQUV1QjtBQUNqQyw2QkFBeUIsTUFIZjtBQUd1QjtBQUNqQyw2QkFBeUIsTUFKZjtBQUl1QjtBQUNqQyw2QkFBeUIsTUFMZjtBQUt1QjtBQUNqQyw2QkFBeUIsTUFOZjtBQU11QjtBQUNqQyw2QkFBeUIsTUFQZjtBQU91QjtBQUNqQyxxQkFBaUIsTUFSUDtBQVFlO0FBQ3pCLHNCQUFrQixNQVRSO0FBU2dCO0FBQzFCLDJCQUF1QixNQVZiO0FBVXFCO0FBQy9CLDJCQUF1QixNQVhiO0FBV3FCO0FBQy9CLDJCQUF1QixNQVpiO0FBWXFCO0FBQy9CLDJCQUF1QixNQWJiO0FBYXFCO0FBQy9CLDJCQUF1QixNQWRiO0FBY3FCO0FBQy9CLDJCQUF1QixNQWZiO0FBZXFCO0FBQy9CLDJCQUF1QixNQWhCYjtBQWdCcUI7QUFDL0IsMkJBQXVCLE1BakJiO0FBaUJxQjtBQUMvQiwyQkFBdUIsTUFsQmI7QUFrQnFCO0FBQy9CLDRCQUF3QixNQW5CZDtBQW1Cc0I7QUFDaEMsNEJBQXdCLE1BcEJkO0FBb0JzQjtBQUNoQyx3QkFBb0IsTUFyQlY7QUFxQmtCO0FBQzVCLHVCQUFtQixNQXRCVCxDQXNCaUI7O0FBdEJqQixHQUZDO0FBMEJiQyxXQUFTLEVBQUU7QUFDVCx5QkFBcUIsTUFEWjtBQUNvQjtBQUM3QiwwQkFBc0IsTUFGYixDQUVxQjs7QUFGckI7QUExQkUsQ0FBZixFOztBQ0hBO0NBR0E7O0FBQ0EsK0NBQWU7QUFDYnRCLFFBQU0sRUFBRUMsZ0ZBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWO0FBQ0EsNkJBQXlCLE1BRmY7QUFHVjtBQUNBLHdCQUFvQixNQUpWO0FBS1Y7QUFDQSw0QkFBd0I7QUFOZCxHQUZDO0FBVWJFLFlBQVUsRUFBRTtBQUNWO0FBQ0EsMkJBQXVCO0FBRmIsR0FWQztBQWNiRCxXQUFTLEVBQUU7QUFDVDtBQUNBLHlCQUFxQjtBQUZaLEdBZEU7QUFrQmJNLFdBQVMsRUFBRTtBQUNUO0FBQ0EseUJBQXFCO0FBRlosR0FsQkU7QUFzQmJFLFVBQVEsRUFBRTtBQUNSO0FBQ0Esd0JBQW9CO0FBRlosR0F0Qkc7QUEwQmI1QixVQUFRLEVBQUUsQ0FDUjtBQUNFekQsTUFBRSxFQUFFLHFCQUROO0FBRUU7QUFDQTtBQUNBRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUpaO0FBS0U1QyxhQUFTLEVBQUUsQ0FBQ3VELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDN0I7QUFDQSxhQUFPZ0csVUFBVSxDQUFDaEcsT0FBTyxDQUFDaUcsUUFBVCxDQUFWLEdBQStCLEVBQXRDO0FBQ0QsS0FSSDtBQVNFN0UsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUEvQjtBQUF1Q1MsWUFBSSxFQUFFOUMsT0FBTyxDQUFDb0Y7QUFBckQsT0FBUDtBQUNEO0FBWEgsR0FEUTtBQTFCRyxDQUFmLEU7O0FDSkE7QUFFQSw4Q0FBZTtBQUNibkIsUUFBTSxFQUFFQyx3REFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsK0JBQTJCLE1BRGpCO0FBRVY7QUFDQSw2QkFBeUIsTUFIZjtBQUlWLDJCQUF1QixNQUpiO0FBS1YsOEJBQTBCLE1BTGhCO0FBTVYsMkJBQXVCO0FBTmIsR0FGQztBQVViRSxZQUFVLEVBQUU7QUFDViw4QkFBMEIsTUFEaEI7QUFFViw4QkFBMEI7QUFGaEIsR0FWQztBQWNiSyxXQUFTLEVBQUU7QUFDVCwrQkFBMkI7QUFEbEI7QUFkRSxDQUFmLEU7O0FDRkE7QUFFQSxpREFBZTtBQUNiNUIsUUFBTSxFQUFFQyxzRUFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsaUNBQTZCLE1BRG5CO0FBRVY7QUFDQSwrQkFBMkIsTUFIakI7QUFJViw2QkFBeUIsTUFKZjtBQUtWLGdDQUE0QixNQUxsQjtBQU1WLHdCQUFvQixNQU5WO0FBT1YsNkJBQXlCO0FBUGYsR0FGQztBQVdiRSxZQUFVLEVBQUU7QUFDVixnQ0FBNEIsTUFEbEI7QUFFVixnQ0FBNEI7QUFGbEIsR0FYQztBQWViSyxXQUFTLEVBQUU7QUFDVDtBQUNBLDhCQUEwQixNQUZqQjtBQUdULGlDQUE2QjtBQUhwQjtBQWZFLENBQWYsRTs7Q0NBQTs7QUFDQSwrQ0FBZTtBQUNiNUIsUUFBTSxFQUFFQyxvREFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1Ysa0NBQThCLE1BRHBCO0FBRVYscUJBQWlCO0FBRlAsR0FGQztBQU1iRSxZQUFVLEVBQUU7QUFDVix5QkFBcUIsTUFEWDtBQUVWLGdDQUE0QjtBQUZsQixHQU5DO0FBVWJELFdBQVMsRUFBRTtBQUNULDJCQUF1QjtBQURkLEdBVkU7QUFhYk0sV0FBUyxFQUFFO0FBQ1QsK0JBQTJCO0FBRGxCO0FBYkUsQ0FBZixFOztBQ0hBO0FBQ0E7QUFFQTtBQUVBLCtDQUFlO0FBQ2I1QixRQUFNLEVBQUVDLGdFQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDVixnQ0FBNEIsTUFEbEI7QUFFVixnQ0FBNEIsTUFGbEI7QUFHVixnQ0FBNEIsTUFIbEI7QUFJVixnQ0FBNEIsTUFKbEI7QUFLVixnQ0FBNEIsTUFMbEI7QUFNViwyQkFBdUIsTUFOYjtBQU9WLDJCQUF1QixNQVBiO0FBUVYsNEJBQXdCLE1BUmQ7QUFTViw0QkFBd0IsTUFUZDtBQVVWLDhCQUEwQixNQVZoQjtBQVdWLGdDQUE0QjtBQVhsQixHQUZDO0FBZWJFLFlBQVUsRUFBRTtBQUNWO0FBQ0EscUJBQWlCO0FBRlAsR0FmQztBQW1CYkQsV0FBUyxFQUFFO0FBQ1Q7QUFDQSwrQkFBMkI7QUFGbEIsR0FuQkU7QUF1QmJNLFdBQVMsRUFBRTtBQUNULDZCQUF5QixNQURoQjtBQUVULHVDQUFtQztBQUYxQixHQXZCRTtBQTJCYjFCLFVBQVEsRUFBRSxDQUNSO0FBQ0V6RCxNQUFFLEVBQUUsc0JBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWMsU0FBRzJGLHVDQUFrQkE7QUFBbkMsS0FBdkIsQ0FGWjtBQUdFbEYsbUJBQWUsRUFBRSxDQUhuQjtBQUlFQyxXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNrRjtBQUFyRCxPQUFQO0FBQ0Q7QUFOSCxHQURRO0FBM0JHLENBQWYsRTs7QUNMQTtDQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQSwwQ0FBZTtBQUNiakIsUUFBTSxFQUFFQyw0REFESztBQUVib0IsWUFBVSxFQUFFO0FBQ1YsNEJBQXdCLE1BRGQ7QUFDc0I7QUFDaEMsOEJBQTBCLE1BRmhCO0FBRXdCO0FBQ2xDLCtCQUEyQixNQUhqQjtBQUd5QjtBQUNuQyxnQ0FBNEIsTUFKbEI7QUFJMEI7QUFDcEMsK0JBQTJCLE1BTGpCO0FBS3lCO0FBQ25DLHdCQUFvQixNQU5WO0FBTWtCO0FBQzVCLHFCQUFpQixNQVBQO0FBUVYsNkJBQXlCLE1BUmY7QUFRdUI7QUFDakMsNkJBQXlCLE1BVGY7QUFTdUI7QUFDakMsd0JBQW9CLE1BVlY7QUFXVixzQkFBa0I7QUFYUixHQUZDO0FBZWJHLGlCQUFlLEVBQUU7QUFDZix1QkFBbUI7QUFESixHQWZKO0FBa0JidEIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSx1QkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0V4QyxnQkFBWSxFQUFFLENBQUNtRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CZ0csVUFBVSxDQUFDaEcsT0FBTyxDQUFDaUcsUUFBVCxDQUFWLEdBQStCLEdBSG5FO0FBSUVOLGVBQVcsRUFBRSxDQUFDdkIsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMvQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQm5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BQTlCO0FBQXNDdUQsY0FBTSxFQUFFNUYsT0FBTyxDQUFDb0Y7QUFBdEQsT0FBUDtBQUNEO0FBTkgsR0FEUTtBQWxCRyxDQUFmLEU7O0FDWEE7Q0FHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUFlO0FBQ2JuQixRQUFNLEVBQUVDLDBFQURLO0FBRWJvQixZQUFVLEVBQUU7QUFDViw4QkFBMEIsTUFEaEI7QUFDd0I7QUFDbEMsZ0NBQTRCLE1BRmxCO0FBRTBCO0FBQ3BDLGlDQUE2QixNQUhuQjtBQUcyQjtBQUNyQyxrQ0FBOEIsTUFKcEI7QUFJNEI7QUFDdEMsaUNBQTZCLE1BTG5CO0FBSzJCO0FBQ3JDLDBCQUFzQixNQU5aO0FBTW9CO0FBQzlCLHVCQUFtQixNQVBUO0FBUVYsNkJBQXlCLE1BUmYsQ0FRdUI7O0FBUnZCLEdBRkM7QUFZYkMsV0FBUyxFQUFFO0FBQ1QsZ0NBQTRCLE1BRG5CO0FBQzJCO0FBQ3BDLDBCQUFzQixNQUZiO0FBRXFCO0FBQzlCLGdDQUE0QixNQUhuQixDQUcyQjs7QUFIM0IsR0FaRTtBQWlCYkUsaUJBQWUsRUFBRTtBQUNmLHlCQUFxQixLQUROO0FBQ2E7QUFDNUIseUJBQXFCLEtBRk4sQ0FFYTs7QUFGYixHQWpCSjtBQXFCYk0sVUFBUSxFQUFFO0FBQ1IsNkJBQXlCO0FBRGpCLEdBckJHO0FBd0JiNUIsVUFBUSxFQUFFLENBQ1I7QUFDRXpELE1BQUUsRUFBRSx5QkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0V4QyxnQkFBWSxFQUFFLENBQUNtRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CZ0csVUFBVSxDQUFDaEcsT0FBTyxDQUFDaUcsUUFBVCxDQUFWLEdBQStCLEdBSG5FO0FBSUVOLGVBQVcsRUFBRSxDQUFDdkIsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMvQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQm5CLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BQTlCO0FBQXNDdUQsY0FBTSxFQUFFNUYsT0FBTyxDQUFDb0Y7QUFBdEQsT0FBUDtBQUNEO0FBTkgsR0FEUSxFQVNSO0FBQ0UxRSxNQUFFLEVBQUUsYUFETjtBQUVFRSxZQUFRLEVBQUVnRCx5Q0FBQSxDQUFtQjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBY2lHLGFBQU8sRUFBRTtBQUF2QixLQUFuQixDQUZaO0FBR0V2RixXQUFPLEVBQUU7QUFDUHdCLFVBQUksRUFBRSxNQURDO0FBRVBnRCxZQUFNLEVBQUU7QUFDTjdDLFVBQUUsRUFBRSxjQURFO0FBRU5JLFVBQUUsRUFBRSxlQUZFO0FBR05DLFVBQUUsRUFBRSxjQUhFO0FBSU5DLFVBQUUsRUFBRSxVQUpFO0FBS05DLFVBQUUsRUFBRSxLQUxFO0FBTU5DLFVBQUUsRUFBRTtBQU5FO0FBRkQ7QUFIWCxHQVRRLEVBd0JSO0FBQ0U3QyxNQUFFLEVBQUUsNEJBRE47QUFFRUUsWUFBUSxFQUFFZ0QseUNBQUEsQ0FBbUI7QUFBRWxELFFBQUUsRUFBRTtBQUFOLEtBQW5CLENBRlo7QUFHRVUsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCZ0QsY0FBTSxFQUFFNUYsT0FBTyxDQUFDa0Y7QUFBaEMsT0FBUDtBQUNEO0FBTEgsR0F4QlEsRUErQlI7QUFDRTtBQUNBeEUsTUFBRSxFQUFFLHdCQUZOO0FBR0VFLFlBQVEsRUFBRWdELHlDQUFBLENBQW1CO0FBQUVsRCxRQUFFLEVBQUUsQ0FBQyxNQUFELEVBQVMsTUFBVDtBQUFOLEtBQW5CLENBSFo7QUFJRVUsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCZ0QsY0FBTSxFQUFFNUYsT0FBTyxDQUFDa0Y7QUFBaEMsT0FBUDtBQUNEO0FBTkgsR0EvQlE7QUF4QkcsQ0FBZixFOztBQ1RBO0FBQ0E7Q0FJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNERBQWU7QUFDYmpCLFFBQU0sRUFBRUMsNEVBREs7QUFFYm9CLFlBQVUsRUFBRTtBQUNWLGtCQUFjLE1BREo7QUFFViwwQkFBc0IsTUFGWjtBQUdWLDBCQUFzQixNQUhaO0FBSVYsd0JBQW9CLE1BSlY7QUFLVixxQkFBaUIsTUFMUDtBQU1WLDZCQUF5QixNQU5mO0FBT1YsNkJBQXlCO0FBUGYsR0FGQztBQVdiRSxZQUFVLEVBQUU7QUFDVix3QkFBb0IsTUFEVjtBQUVWLG1CQUFlLE1BRkw7QUFHVix1QkFBbUIsTUFIVDtBQUlWLDJCQUF1QixNQUpiO0FBS1YsMEJBQXNCO0FBTFosR0FYQztBQWtCYkQsV0FBUyxFQUFFO0FBQ1QsaUNBQTZCLE1BRHBCO0FBRVQsaUNBQTZCLE1BRnBCO0FBR1QsdUJBQW1CLE1BSFY7QUFJVCx3QkFBb0IsTUFKWDtBQUtULHVCQUFtQixNQUxWO0FBTVQsdUJBQW1CLE1BTlY7QUFPVCx3QkFBb0IsTUFQWDtBQVFULDJCQUF1QixNQVJkO0FBU1Qsd0JBQW9CLE1BVFg7QUFVVCwrQkFBMkIsTUFWbEI7QUFXVDtBQUNBLGtDQUE4QjtBQVpyQixHQWxCRTtBQWdDYm1CLFVBQVEsRUFBRTtBQUNSO0FBQ0Esa0NBQThCO0FBRnRCLEdBaENHO0FBb0NidkMsVUFBUSxFQUFFLENBQ1I7QUFDRTtBQUNBO0FBQ0E7QUFDQXpELE1BQUUsRUFBRSxhQUpOO0FBS0VFLFlBQVEsRUFBRWdELGlEQUFBLENBQXVCO0FBQUVsRCxRQUFFLEVBQUUsTUFBTjtBQUFjLFNBQUcyRix1Q0FBa0JBO0FBQW5DLEtBQXZCLENBTFo7QUFNRXhGLGFBQVMsRUFBRSxDQUFDdUQsS0FBRCxFQUFRcEUsT0FBUixLQUFvQkEsT0FBTyxDQUFDcUMsTUFBUixLQUFtQnJDLE9BQU8sQ0FBQzRCLE1BTjVEO0FBT0VSLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQ0w0QyxZQUFJLEVBQUUsTUFERDtBQUVMQyxhQUFLLEVBQUU3QyxPQUFPLENBQUNxQyxNQUZWO0FBR0xTLFlBQUksRUFBRTtBQUNKQyxZQUFFLEVBQUUsdUJBREE7QUFFSkksWUFBRSxFQUFFLDRCQUZBO0FBR0pDLFlBQUUsRUFBRSx1QkFIQTtBQUlKQyxZQUFFLEVBQUUsTUFKQTtBQUtKQyxZQUFFLEVBQUU7QUFMQTtBQUhELE9BQVA7QUFXRDtBQW5CSCxHQURRLEVBc0JSO0FBQ0U1QyxNQUFFLEVBQUUsWUFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0VyQyxXQUFPLEVBQUUsQ0FBQ2dELEtBQUQsRUFBUXBFLE9BQVIsS0FBb0I7QUFDM0IsYUFBTztBQUFFNEMsWUFBSSxFQUFFLE1BQVI7QUFBZ0JDLGFBQUssRUFBRTdDLE9BQU8sQ0FBQ3FDLE1BQS9CO0FBQXVDUyxZQUFJLEVBQUU5QyxPQUFPLENBQUNvRjtBQUFyRCxPQUFQO0FBQ0Q7QUFMSCxHQXRCUSxFQTZCUjtBQUNFMUUsTUFBRSxFQUFFLHFCQUROO0FBRUVFLFlBQVEsRUFBRWdELHVDQUFBLENBQWtCO0FBQUVoQyxZQUFNLEVBQUUsV0FBVjtBQUF1QmxCLFFBQUUsRUFBRTtBQUEzQixLQUFsQixDQUZaO0FBR0VJLE9BQUcsRUFBRSxDQUFDZixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDdEJELFVBQUksQ0FBQ3VMLFVBQUwsR0FBa0J2TCxJQUFJLENBQUN1TCxVQUFMLElBQW1CLEVBQXJDO0FBQ0F2TCxVQUFJLENBQUN1TCxVQUFMLENBQWdCdEwsT0FBTyxDQUFDQyxRQUF4QixJQUFvQ0QsT0FBTyxDQUFDcUMsTUFBNUM7QUFDRDtBQU5ILEdBN0JRLEVBcUNSO0FBQ0UzQixNQUFFLEVBQUUsMEJBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWMsU0FBRzJGLHVDQUFrQkE7QUFBbkMsS0FBdkIsQ0FGWjtBQUdFakYsV0FBTyxFQUFFLENBQUNyQixJQUFELEVBQU9DLE9BQVAsS0FBbUI7QUFDMUIsYUFBTztBQUNMNEMsWUFBSSxFQUFFLE1BREQ7QUFFTDtBQUNBbkIsWUFBSSxFQUFFMUIsSUFBSSxDQUFDdUwsVUFBTCxHQUFrQnZMLElBQUksQ0FBQ3VMLFVBQUwsQ0FBZ0J0TCxPQUFPLENBQUNDLFFBQXhCLENBQWxCLEdBQXNEc0wsU0FIdkQ7QUFJTHpJLFlBQUksRUFBRTtBQUNKQyxZQUFFLEVBQUUsWUFEQTtBQUVKSSxZQUFFLEVBQUUsV0FGQTtBQUdKQyxZQUFFLEVBQUUsY0FIQTtBQUlKQyxZQUFFLEVBQUUsU0FKQTtBQUtKQyxZQUFFLEVBQUU7QUFMQTtBQUpELE9BQVA7QUFZRDtBQWhCSCxHQXJDUSxFQXVEUjtBQUNFNUMsTUFBRSxFQUFFLGNBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRWxELFFBQUUsRUFBRSxNQUFOO0FBQWMsU0FBRzJGLHVDQUFrQkE7QUFBbkMsS0FBdkIsQ0FGWjtBQUdFeEYsYUFBUyxFQUFFLENBQUNkLElBQUQsRUFBT0MsT0FBUCxLQUFtQixDQUFDRCxJQUFJLENBQUNJLEtBQUwsQ0FBV3FMLE1BQVgsQ0FBa0J4TCxPQUFPLENBQUNxQyxNQUExQixDQUhqQztBQUlFakIsV0FBTyxFQUFFLENBQUNnRCxLQUFELEVBQVFwRSxPQUFSLEtBQW9CO0FBQzNCLGFBQU87QUFBRTRDLFlBQUksRUFBRSxNQUFSO0FBQWdCbkIsWUFBSSxFQUFFekIsT0FBTyxDQUFDcUMsTUFBOUI7QUFBc0NTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQ2tGO0FBQXBELE9BQVA7QUFDRDtBQU5ILEdBdkRRLEVBK0RSO0FBQ0V4RSxNQUFFLEVBQUUsbUJBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFM0MsT0FBRyxFQUFFLENBQUNmLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUN0QkQsVUFBSSxDQUFDMEwsV0FBTCxHQUFtQjFMLElBQUksQ0FBQzBMLFdBQUwsSUFBb0IsRUFBdkM7QUFDQTFMLFVBQUksQ0FBQzBMLFdBQUwsQ0FBaUJ6TCxPQUFPLENBQUNxQyxNQUF6QixJQUFtQyxJQUFuQztBQUNEO0FBTkgsR0EvRFEsRUF1RVI7QUFDRTNCLE1BQUUsRUFBRSxtQkFETjtBQUVFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFSCxjQUFRLEVBQUU7QUFBWixLQUF2QixDQUZaO0FBR0UzQyxPQUFHLEVBQUUsQ0FBQ2YsSUFBRCxFQUFPQyxPQUFQLEtBQW1CO0FBQ3RCRCxVQUFJLENBQUMwTCxXQUFMLEdBQW1CMUwsSUFBSSxDQUFDMEwsV0FBTCxJQUFvQixFQUF2QztBQUNBMUwsVUFBSSxDQUFDMEwsV0FBTCxDQUFpQnpMLE9BQU8sQ0FBQ3FDLE1BQXpCLElBQW1DLEtBQW5DO0FBQ0Q7QUFOSCxHQXZFUSxFQStFUjtBQUNFM0IsTUFBRSxFQUFFLGNBRE47QUFFRUUsWUFBUSxFQUFFZ0QsaURBQUEsQ0FBdUI7QUFBRUgsY0FBUSxFQUFFO0FBQVosS0FBdkIsQ0FGWjtBQUdFeEMsZ0JBQVksRUFBRSxDQUFDbUQsS0FBRCxFQUFRcEUsT0FBUixLQUFvQmdHLFVBQVUsQ0FBQ2hHLE9BQU8sQ0FBQ2lHLFFBQVQsQ0FBVixHQUErQixHQUhuRTtBQUlFTixlQUFXLEVBQUUsQ0FBQzVGLElBQUQsRUFBT0MsT0FBUCxLQUFtQjtBQUM5QixVQUFJLENBQUNELElBQUksQ0FBQzBMLFdBQVYsRUFDRTtBQUNGLFVBQUksQ0FBQzFMLElBQUksQ0FBQzBMLFdBQUwsQ0FBaUJ6TCxPQUFPLENBQUNxQyxNQUF6QixDQUFMLEVBQ0U7QUFDRixhQUFPO0FBQ0xaLFlBQUksRUFBRXpCLE9BQU8sQ0FBQ3FDLE1BRFQ7QUFFTHVELGNBQU0sRUFBRTVGLE9BQU8sQ0FBQ29GO0FBRlgsT0FBUDtBQUlEO0FBYkgsR0EvRVEsRUE4RlI7QUFDRTtBQUNBO0FBQ0ExRSxNQUFFLEVBQUUsY0FITjtBQUlFRSxZQUFRLEVBQUVnRCxpREFBQSxDQUF1QjtBQUFFbEQsUUFBRSxFQUFFLE1BQU47QUFBYyxTQUFHMkYsdUNBQWtCQTtBQUFuQyxLQUF2QixDQUpaO0FBS0VsRixtQkFBZSxFQUFFLENBTG5CO0FBTUVDLFdBQU8sRUFBRSxDQUFDZ0QsS0FBRCxFQUFRcEUsT0FBUixLQUFvQjtBQUMzQixhQUFPO0FBQUU0QyxZQUFJLEVBQUUsTUFBUjtBQUFnQkMsYUFBSyxFQUFFN0MsT0FBTyxDQUFDcUMsTUFBL0I7QUFBdUNTLFlBQUksRUFBRTlDLE9BQU8sQ0FBQzRCO0FBQXJELE9BQVA7QUFDRDtBQVJILEdBOUZRO0FBcENHLENBQWYsRTs7QUNyQnVDO0FBQ0U7QUFDSDtBQUNTO0FBQ0E7QUFDRDtBQUNDO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDb0I7QUFDaEI7QUFDQztBQUNOO0FBQ1g7QUFDUTtBQUNLO0FBQ0Q7QUFDRztBQUNBO0FBQ0U7QUFDVjtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ007QUFDRjtBQUNFO0FBQ2dCO0FBQ0E7QUFDSDtBQUNBO0FBQ1c7QUFDZDtBQUNUO0FBQ1M7QUFDUDtBQUNNO0FBQ0U7QUFDSjtBQUNDO0FBQ1A7QUFDQztBQUNJO0FBQ0k7QUFDUjtBQUNPO0FBQ087QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2M7QUFDSDtBQUNHO0FBQ0g7QUFDTjtBQUNIO0FBQ087QUFDSDtBQUNGO0FBQ087QUFDSDtBQUNIO0FBQ0Q7QUFDRztBQUNGO0FBQ0E7QUFDTDtBQUNHO0FBQ2tCOztBQUVoRSxxREFBZSxDQUFDLG9CQUFvQixLQUFLLHVCQUF1QixPQUFLLG9CQUFvQixJQUFLLDZCQUE2QixRQUFLLDZCQUE2QixRQUFLLDRCQUE0QixPQUFLLDZCQUE2QixRQUFLLDZCQUE2QixRQUFLLDZCQUE2QixRQUFLLDZCQUE2QixRQUFLLG1DQUFtQyxZQUFNLHVEQUF1RCxpQ0FBTSx1Q0FBdUMsaUJBQU0sd0NBQXdDLGtCQUFNLGtDQUFrQyxZQUFNLHVCQUF1QixJQUFNLCtCQUErQixTQUFNLG9DQUFvQyxjQUFNLG1DQUFtQyxhQUFNLHNDQUFzQyxnQkFBTSxzQ0FBc0MsZ0JBQU0sd0NBQXdDLGtCQUFNLDhCQUE4QixRQUFNLHNCQUFzQixHQUFNLHNCQUFzQixHQUFNLHNCQUFzQixHQUFNLHNCQUFzQixHQUFNLHNCQUFzQixHQUFNLHNCQUFzQixHQUFNLHVCQUF1QixJQUFNLDZCQUE2QixTQUFNLDJCQUEyQixPQUFNLDZCQUE2QixTQUFNLDZDQUE2QyxzQkFBTSw2Q0FBNkMsc0JBQU0sMENBQTBDLGtCQUFNLDBDQUEwQyxrQkFBTSxxREFBcUQsNkJBQU0sdUNBQXVDLGdCQUFNLDhCQUE4QixPQUFNLHVDQUF1QyxnQkFBTSxnQ0FBZ0MsU0FBTSxzQ0FBc0MsZUFBTSx3Q0FBd0MsaUJBQU0sb0NBQW9DLGFBQU0scUNBQXFDLGNBQU0sOEJBQThCLE9BQU0sK0JBQStCLFFBQU0sbUNBQW1DLFlBQU0sdUNBQXVDLGdCQUFNLCtCQUErQixRQUFNLHNDQUFzQyxnQkFBTSw2Q0FBNkMsdUJBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sdUJBQXVCLEdBQU0sd0JBQXdCLElBQU0sd0JBQXdCLElBQU0sd0JBQXdCLElBQU0sd0JBQXdCLElBQU0sd0JBQXdCLElBQU0sd0JBQXdCLElBQU0sc0NBQXNDLGlCQUFNLG1DQUFtQyxjQUFNLHNDQUFzQyxpQkFBTSxtQ0FBbUMsY0FBTSw2QkFBNkIsUUFBTSwwQkFBMEIsS0FBTSxpQ0FBaUMsWUFBTSw4QkFBOEIsU0FBTSw0QkFBNEIsT0FBTSxtQ0FBbUMsY0FBTSxnQ0FBZ0MsV0FBTSw2QkFBNkIsUUFBTSw0QkFBNEIsT0FBTSwrQkFBK0IsVUFBTSw2QkFBNkIsUUFBTSw2QkFBNkIsUUFBTSx3QkFBd0IsR0FBTSwyQkFBMkIsTUFBTSw2Q0FBNkMscUJBQU0sRUFBRSxFIiwiZmlsZSI6InVpL2NvbW1vbi9vb3BzeXJhaWRzeV9kYXRhLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBBYmlsaXRpZXMgc2VlbSBpbnN0YW50LlxyXG5jb25zdCBhYmlsaXR5Q29sbGVjdFNlY29uZHMgPSAwLjU7XHJcbi8vIE9ic2VydmF0aW9uOiB1cCB0byB+MS4yIHNlY29uZHMgZm9yIGEgYnVmZiB0byByb2xsIHRocm91Z2ggdGhlIHBhcnR5LlxyXG5jb25zdCBlZmZlY3RDb2xsZWN0U2Vjb25kcyA9IDIuMDtcclxuXHJcbmNvbnN0IGlzSW5QYXJ0eUNvbmRpdGlvbkZ1bmMgPSAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gIGNvbnN0IHNvdXJjZUlkID0gbWF0Y2hlcy5zb3VyY2VJZC50b1VwcGVyQ2FzZSgpO1xyXG4gIGlmIChkYXRhLnBhcnR5LnBhcnR5SWRzLmluY2x1ZGVzKHNvdXJjZUlkKSlcclxuICAgIHJldHVybiB0cnVlO1xyXG5cclxuICBpZiAoZGF0YS5wZXRJZFRvT3duZXJJZCkge1xyXG4gICAgY29uc3Qgb3duZXJJZCA9IGRhdGEucGV0SWRUb093bmVySWRbc291cmNlSWRdO1xyXG4gICAgaWYgKG93bmVySWQgJiYgZGF0YS5wYXJ0eS5wYXJ0eUlkcy5pbmNsdWRlcyhvd25lcklkKSlcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vLyBhcmdzOiB0cmlnZ2VySWQsIG5ldFJlZ2V4LCBmaWVsZCwgdHlwZSwgaWdub3JlU2VsZlxyXG5jb25zdCBtaXNzZWRGdW5jID0gKGFyZ3MpID0+IFtcclxuICB7XHJcbiAgICAvLyBTdXJlLCBub3QgYWxsIG9mIHRoZXNlIGFyZSBcImJ1ZmZzXCIgcGVyIHNlLCBidXQgdGhleSdyZSBhbGwgaW4gdGhlIGJ1ZmZzIGZpbGUuXHJcbiAgICBpZDogYEJ1ZmYgJHthcmdzLnRyaWdnZXJJZH0gQ29sbGVjdGAsXHJcbiAgICBuZXRSZWdleDogYXJncy5uZXRSZWdleCxcclxuICAgIGNvbmRpdGlvbjogaXNJblBhcnR5Q29uZGl0aW9uRnVuYyxcclxuICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgZGF0YS5nZW5lcmFsQnVmZkNvbGxlY3Rpb24gPSBkYXRhLmdlbmVyYWxCdWZmQ29sbGVjdGlvbiB8fCB7fTtcclxuICAgICAgZGF0YS5nZW5lcmFsQnVmZkNvbGxlY3Rpb25bYXJncy50cmlnZ2VySWRdID0gZGF0YS5nZW5lcmFsQnVmZkNvbGxlY3Rpb25bYXJncy50cmlnZ2VySWRdIHx8IFtdO1xyXG4gICAgICBkYXRhLmdlbmVyYWxCdWZmQ29sbGVjdGlvblthcmdzLnRyaWdnZXJJZF0ucHVzaChtYXRjaGVzKTtcclxuICAgIH0sXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogYEJ1ZmYgJHthcmdzLnRyaWdnZXJJZH1gLFxyXG4gICAgbmV0UmVnZXg6IGFyZ3MubmV0UmVnZXgsXHJcbiAgICBjb25kaXRpb246IGlzSW5QYXJ0eUNvbmRpdGlvbkZ1bmMsXHJcbiAgICBkZWxheVNlY29uZHM6IGFyZ3MuY29sbGVjdFNlY29uZHMsXHJcbiAgICBzdXBwcmVzc1NlY29uZHM6IGFyZ3MuY29sbGVjdFNlY29uZHMsXHJcbiAgICBtaXN0YWtlOiAoZGF0YSwgX21hdGNoZXMpID0+IHtcclxuICAgICAgaWYgKCFkYXRhLmdlbmVyYWxCdWZmQ29sbGVjdGlvbilcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIGNvbnN0IGFsbE1hdGNoZXMgPSBkYXRhLmdlbmVyYWxCdWZmQ29sbGVjdGlvblthcmdzLnRyaWdnZXJJZF07XHJcbiAgICAgIGlmICghYWxsTWF0Y2hlcylcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCBwYXJ0eU5hbWVzID0gZGF0YS5wYXJ0eS5wYXJ0eU5hbWVzO1xyXG5cclxuICAgICAgLy8gVE9ETzogY29uc2lkZXIgZGVhZCBwZW9wbGUgc29tZWhvd1xyXG4gICAgICBjb25zdCBnb3RCdWZmTWFwID0ge307XHJcbiAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwYXJ0eU5hbWVzKVxyXG4gICAgICAgIGdvdEJ1ZmZNYXBbbmFtZV0gPSBmYWxzZTtcclxuXHJcbiAgICAgIGNvbnN0IGZpcnN0TWF0Y2ggPSBhbGxNYXRjaGVzWzBdO1xyXG4gICAgICBsZXQgc291cmNlTmFtZSA9IGZpcnN0TWF0Y2guc291cmNlO1xyXG4gICAgICAvLyBCbGFtZSBwZXQgbWlzdGFrZXMgb24gb3duZXJzLlxyXG4gICAgICBpZiAoZGF0YS5wZXRJZFRvT3duZXJJZCkge1xyXG4gICAgICAgIGNvbnN0IHBldElkID0gZmlyc3RNYXRjaC5zb3VyY2VJZC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgIGNvbnN0IG93bmVySWQgPSBkYXRhLnBldElkVG9Pd25lcklkW3BldElkXTtcclxuICAgICAgICBpZiAob3duZXJJZCkge1xyXG4gICAgICAgICAgY29uc3Qgb3duZXJOYW1lID0gZGF0YS5wYXJ0eS5uYW1lRnJvbUlkKG93bmVySWQpO1xyXG4gICAgICAgICAgaWYgKG93bmVyTmFtZSlcclxuICAgICAgICAgICAgc291cmNlTmFtZSA9IG93bmVyTmFtZTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgQ291bGRuJ3QgZmluZCBuYW1lIGZvciAke293bmVySWR9IGZyb20gcGV0ICR7cGV0SWR9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYXJncy5pZ25vcmVTZWxmKVxyXG4gICAgICAgIGdvdEJ1ZmZNYXBbc291cmNlTmFtZV0gPSB0cnVlO1xyXG5cclxuICAgICAgY29uc3QgdGhpbmdOYW1lID0gZmlyc3RNYXRjaFthcmdzLmZpZWxkXTtcclxuICAgICAgZm9yIChjb25zdCBtYXRjaGVzIG9mIGFsbE1hdGNoZXMpIHtcclxuICAgICAgICAvLyBJbiBjYXNlIHlvdSBoYXZlIG11bHRpcGxlIHBhcnR5IG1lbWJlcnMgd2hvIGhpdCB0aGUgc2FtZSBjb29sZG93biBhdCB0aGUgc2FtZVxyXG4gICAgICAgIC8vIHRpbWUgKGxvbD8pLCB0aGVuIGlnbm9yZSBhbnlib2R5IHdobyB3YXNuJ3QgdGhlIGZpcnN0LlxyXG4gICAgICAgIGlmIChtYXRjaGVzLnNvdXJjZSAhPT0gZmlyc3RNYXRjaC5zb3VyY2UpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgZ290QnVmZk1hcFttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBtaXNzZWQgPSBPYmplY3Qua2V5cyhnb3RCdWZmTWFwKS5maWx0ZXIoKHgpID0+ICFnb3RCdWZmTWFwW3hdKTtcclxuICAgICAgaWYgKG1pc3NlZC5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgLy8gVE9ETzogb29wc3kgY291bGQgcmVhbGx5IHVzZSBtb3VzZW92ZXIgcG9wdXBzIGZvciBkZXRhaWxzLlxyXG4gICAgICAvLyBUT0RPOiBhbHRlcm5hdGl2ZWx5LCBpZiB3ZSBoYXZlIGEgZGVhdGggcmVwb3J0LCBpdCdkIGJlIGdvb2QgdG9cclxuICAgICAgLy8gZXhwbGljaXRseSBjYWxsIG91dCB0aGF0IG90aGVyIHBlb3BsZSBnb3QgYSBoZWFsIHRoaXMgcGVyc29uIGRpZG4ndC5cclxuICAgICAgaWYgKG1pc3NlZC5sZW5ndGggPCA0KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6IGFyZ3MudHlwZSxcclxuICAgICAgICAgIGJsYW1lOiBzb3VyY2VOYW1lLFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogdGhpbmdOYW1lICsgJyBtaXNzZWQgJyArIG1pc3NlZC5tYXAoKHgpID0+IGRhdGEuU2hvcnROYW1lKHgpKS5qb2luKCcsICcpLFxyXG4gICAgICAgICAgICBkZTogdGhpbmdOYW1lICsgJyB2ZXJmZWhsdCAnICsgbWlzc2VkLm1hcCgoeCkgPT4gZGF0YS5TaG9ydE5hbWUoeCkpLmpvaW4oJywgJyksXHJcbiAgICAgICAgICAgIGZyOiB0aGluZ05hbWUgKyAnIG1hbnF1w6koZSkgc3VyICcgKyBtaXNzZWQubWFwKCh4KSA9PiBkYXRhLlNob3J0TmFtZSh4KSkuam9pbignLCAnKSxcclxuICAgICAgICAgICAgamE6ICcoJyArIG1pc3NlZC5tYXAoKHgpID0+IGRhdGEuU2hvcnROYW1lKHgpKS5qb2luKCcsICcpICsgJykg44GMJyArIHRoaW5nTmFtZSArICfjgpLlj5fjgZHjgarjgYvjgaPjgZ8nLFxyXG4gICAgICAgICAgICBjbjogbWlzc2VkLm1hcCgoeCkgPT4gZGF0YS5TaG9ydE5hbWUoeCkpLmpvaW4oJywgJykgKyAnIOayoeWPl+WIsCAnICsgdGhpbmdOYW1lLFxyXG4gICAgICAgICAgICBrbzogdGhpbmdOYW1lICsgJyAnICsgbWlzc2VkLm1hcCgoeCkgPT4gZGF0YS5TaG9ydE5hbWUoeCkpLmpvaW4oJywgJykgKyAn7JeQ6rKMIOyggeyaqeyViOuQqCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgLy8gSWYgdGhlcmUncyB0b28gbWFueSBwZW9wbGUsIGp1c3QgbGlzdCB0aGUgbnVtYmVyIG9mIHBlb3BsZSBtaXNzZWQuXHJcbiAgICAgIC8vIFRPRE86IHdlIGNvdWxkIGFsc28gbGlzdCBldmVyeWJvZHkgb24gc2VwYXJhdGUgbGluZXM/XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogYXJncy50eXBlLFxyXG4gICAgICAgIGJsYW1lOiBzb3VyY2VOYW1lLFxyXG4gICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgIGVuOiB0aGluZ05hbWUgKyAnIG1pc3NlZCAnICsgbWlzc2VkLmxlbmd0aCArICcgcGVvcGxlJyxcclxuICAgICAgICAgIGRlOiB0aGluZ05hbWUgKyAnIHZlcmZlaGx0ZSAnICsgbWlzc2VkLmxlbmd0aCArICcgUGVyc29uZW4nLFxyXG4gICAgICAgICAgZnI6IHRoaW5nTmFtZSArICcgbWFucXXDqShlKSBzdXIgJyArIG1pc3NlZC5sZW5ndGggKyAnIHBlcnNvbm5lcycsXHJcbiAgICAgICAgICBqYTogbWlzc2VkLmxlbmd0aCArICfkurrjgYwnICsgdGhpbmdOYW1lICsgJ+OCkuWPl+OBkeOBquOBi+OBo+OBnycsXHJcbiAgICAgICAgICBjbjogJ+aciScgKyBtaXNzZWQubGVuZ3RoICsgJ+S6uuayoeWPl+WIsCAnICsgdGhpbmdOYW1lLFxyXG4gICAgICAgICAga286IHRoaW5nTmFtZSArICcgJyArIG1pc3NlZC5sZW5ndGggKyAn66qF7JeQ6rKMIOyggeyaqeyViOuQqCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBydW46IChkYXRhKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLmdlbmVyYWxCdWZmQ29sbGVjdGlvbilcclxuICAgICAgICBkZWxldGUgZGF0YS5nZW5lcmFsQnVmZkNvbGxlY3Rpb25bYXJncy50cmlnZ2VySWRdO1xyXG4gICAgfSxcclxuICB9LFxyXG5dO1xyXG5cclxuY29uc3QgbWlzc2VkTWl0aWdhdGlvbkJ1ZmYgPSAoYXJncykgPT4ge1xyXG4gIGlmICghYXJncy5lZmZlY3RJZClcclxuICAgIGNvbnNvbGUuZXJyb3IoJ01pc3NpbmcgZWZmZWN0SWQ6ICcgKyBKU09OLnN0cmluZ2lmeShhcmdzKSk7XHJcbiAgcmV0dXJuIG1pc3NlZEZ1bmMoe1xyXG4gICAgdHJpZ2dlcklkOiBhcmdzLmlkLFxyXG4gICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogYXJncy5lZmZlY3RJZCB9KSxcclxuICAgIGZpZWxkOiAnZWZmZWN0JyxcclxuICAgIHR5cGU6ICdoZWFsJyxcclxuICAgIGlnbm9yZVNlbGY6IGFyZ3MuaWdub3JlU2VsZixcclxuICAgIGNvbGxlY3RTZWNvbmRzOiBhcmdzLmNvbGxlY3RTZWNvbmRzID8gYXJncy5jb2xsZWN0U2Vjb25kcyA6IGVmZmVjdENvbGxlY3RTZWNvbmRzLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgbWlzc2VkRGFtYWdlQWJpbGl0eSA9IChhcmdzKSA9PiB7XHJcbiAgaWYgKCFhcmdzLmFiaWxpdHlJZClcclxuICAgIGNvbnNvbGUuZXJyb3IoJ01pc3NpbmcgYWJpbGl0eUlkOiAnICsgSlNPTi5zdHJpbmdpZnkoYXJncykpO1xyXG4gIHJldHVybiBtaXNzZWRGdW5jKHtcclxuICAgIHRyaWdnZXJJZDogYXJncy5pZCxcclxuICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogYXJncy5hYmlsaXR5SWQgfSksXHJcbiAgICBmaWVsZDogJ2FiaWxpdHknLFxyXG4gICAgdHlwZTogJ2RhbWFnZScsXHJcbiAgICBpZ25vcmVTZWxmOiBhcmdzLmlnbm9yZVNlbGYsXHJcbiAgICBjb2xsZWN0U2Vjb25kczogYXJncy5jb2xsZWN0U2Vjb25kcyA/IGFyZ3MuY29sbGVjdFNlY29uZHMgOiBhYmlsaXR5Q29sbGVjdFNlY29uZHMsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBtaXNzZWRIZWFsID0gKGFyZ3MpID0+IHtcclxuICBpZiAoIWFyZ3MuYWJpbGl0eUlkKVxyXG4gICAgY29uc29sZS5lcnJvcignTWlzc2luZyBhYmlsaXR5SWQ6ICcgKyBKU09OLnN0cmluZ2lmeShhcmdzKSk7XHJcbiAgcmV0dXJuIG1pc3NlZEZ1bmMoe1xyXG4gICAgdHJpZ2dlcklkOiBhcmdzLmlkLFxyXG4gICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiBhcmdzLmFiaWxpdHlJZCB9KSxcclxuICAgIGZpZWxkOiAnYWJpbGl0eScsXHJcbiAgICB0eXBlOiAnaGVhbCcsXHJcbiAgICBjb2xsZWN0U2Vjb25kczogYXJncy5jb2xsZWN0U2Vjb25kcyA/IGFyZ3MuY29sbGVjdFNlY29uZHMgOiBhYmlsaXR5Q29sbGVjdFNlY29uZHMsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBtaXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSA9IG1pc3NlZEhlYWw7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuTWF0Y2hBbGwsXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdCdWZmIFBldCBUbyBPd25lciBNYXBwZXInLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hZGRlZENvbWJhdGFudEZ1bGwoKSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGlmIChtYXRjaGVzLm93bmVySWQgPT09ICcwJylcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgZGF0YS5wZXRJZFRvT3duZXJJZCA9IGRhdGEucGV0SWRUb093bmVySWQgfHwge307XHJcbiAgICAgICAgLy8gRml4IGFueSBsb3dlcmNhc2UgaWRzLlxyXG4gICAgICAgIGRhdGEucGV0SWRUb093bmVySWRbbWF0Y2hlcy5pZC50b1VwcGVyQ2FzZSgpXSA9IG1hdGNoZXMub3duZXJJZC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdCdWZmIFBldCBUbyBPd25lciBDbGVhcmVyJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuY2hhbmdlWm9uZSgpLFxyXG4gICAgICBydW46IChkYXRhKSA9PiB7XHJcbiAgICAgICAgLy8gQ2xlYXIgdGhpcyBoYXNoIHBlcmlvZGljYWxseSBzbyBpdCBkb2Vzbid0IGhhdmUgZmFsc2UgcG9zaXRpdmVzLlxyXG4gICAgICAgIGRhdGEucGV0SWRUb093bmVySWQgPSB7fTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gUHJlZmVyIGFiaWxpdGllcyB0byBlZmZlY3RzLCBhcyBlZmZlY3RzIHRha2UgbG9uZ2VyIHRvIHJvbGwgdGhyb3VnaCB0aGUgcGFydHkuXHJcbiAgICAvLyBIb3dldmVyLCBzb21lIHRoaW5ncyBhcmUgb25seSBlZmZlY3RzIGFuZCBzbyB0aGVyZSBpcyBubyBjaG9pY2UuXHJcblxyXG4gICAgLy8gRm9yIHRoaW5ncyB5b3UgY2FuIHN0ZXAgaW4gb3Igb3V0IG9mLCBnaXZlIGEgbG9uZ2VyIHRpbWVyPyAgVGhpcyBpc24ndCBwZXJmZWN0LlxyXG4gICAgLy8gVE9ETzogaW5jbHVkZSBzb2lsIGhlcmU/P1xyXG4gICAgLi4ubWlzc2VkTWl0aWdhdGlvbkJ1ZmYoeyBpZDogJ0NvbGxlY3RpdmUgVW5jb25zY2lvdXMnLCBlZmZlY3RJZDogJzM1MScsIGNvbGxlY3RTZWNvbmRzOiAxMCB9KSxcclxuICAgIC8vIEFybXMgVXAgPSA0OTggKG90aGVycyksIFBhc3NhZ2UgT2YgQXJtcyA9IDQ5NyAoeW91KS4gIFVzZSBib3RoIGluIGNhc2UgZXZlcnlib2R5IGlzIG1pc3NlZC5cclxuICAgIC4uLm1pc3NlZE1pdGlnYXRpb25CdWZmKHsgaWQ6ICdQYXNzYWdlIG9mIEFybXMnLCBlZmZlY3RJZDogJzQ5Wzc4XScsIGlnbm9yZVNlbGY6IHRydWUsIGNvbGxlY3RTZWNvbmRzOiAxMCB9KSxcclxuXHJcbiAgICAuLi5taXNzZWRNaXRpZ2F0aW9uQnVmZih7IGlkOiAnRGl2aW5lIFZlaWwnLCBlZmZlY3RJZDogJzJENycsIGlnbm9yZVNlbGY6IHRydWUgfSksXHJcblxyXG4gICAgLi4ubWlzc2VkTWl0aWdhdGlvbkFiaWxpdHkoeyBpZDogJ0hlYXJ0IE9mIExpZ2h0JywgYWJpbGl0eUlkOiAnM0YyMCcgfSksXHJcbiAgICAuLi5taXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSh7IGlkOiAnRGFyayBNaXNzaW9uYXJ5JywgYWJpbGl0eUlkOiAnNDA1NycgfSksXHJcbiAgICAuLi5taXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSh7IGlkOiAnU2hha2UgSXQgT2ZmJywgYWJpbGl0eUlkOiAnMUNEQycgfSksXHJcblxyXG4gICAgLy8gM0Y0NCBpcyB0aGUgY29ycmVjdCBRdWFkcnVwbGUgVGVjaG5pY2FsIEZpbmlzaCwgb3RoZXJzIGFyZSBEaW5reSBUZWNobmljYWwgRmluaXNoLlxyXG4gICAgLi4ubWlzc2VkRGFtYWdlQWJpbGl0eSh7IGlkOiAnVGVjaG5pY2FsIEZpbmlzaCcsIGFiaWxpdHlJZDogJzNGNFsxLTRdJyB9KSxcclxuICAgIC4uLm1pc3NlZERhbWFnZUFiaWxpdHkoeyBpZDogJ0RpdmluYXRpb24nLCBhYmlsaXR5SWQ6ICc0MEE4JyB9KSxcclxuICAgIC4uLm1pc3NlZERhbWFnZUFiaWxpdHkoeyBpZDogJ0Jyb3RoZXJob29kJywgYWJpbGl0eUlkOiAnMUNFNCcgfSksXHJcbiAgICAuLi5taXNzZWREYW1hZ2VBYmlsaXR5KHsgaWQ6ICdCYXR0bGUgTGl0YW55JywgYWJpbGl0eUlkOiAnREU1JyB9KSxcclxuICAgIC4uLm1pc3NlZERhbWFnZUFiaWxpdHkoeyBpZDogJ0VtYm9sZGVuJywgYWJpbGl0eUlkOiAnMUQ2MCcgfSksXHJcbiAgICAuLi5taXNzZWREYW1hZ2VBYmlsaXR5KHsgaWQ6ICdCYXR0bGUgVm9pY2UnLCBhYmlsaXR5SWQ6ICc3NicsIGlnbm9yZVNlbGY6IHRydWUgfSksXHJcblxyXG4gICAgLy8gVG9vIG5vaXN5IChwcm9jcyBldmVyeSB0aHJlZSBzZWNvbmRzLCBhbmQgYmFyZHMgb2Z0ZW4gb2ZmIGRvaW5nIG1lY2hhbmljcykuXHJcbiAgICAvLyBtaXNzZWREYW1hZ2VCdWZmKHsgaWQ6ICdXYW5kZXJlclxcJ3MgTWludWV0JywgZWZmZWN0SWQ6ICc4QTgnLCBpZ25vcmVTZWxmOiB0cnVlIH0pLFxyXG4gICAgLy8gbWlzc2VkRGFtYWdlQnVmZih7IGlkOiAnTWFnZVxcJ3MgQmFsbGFkJywgZWZmZWN0SWQ6ICc4QTknLCBpZ25vcmVTZWxmOiB0cnVlIH0pLFxyXG4gICAgLy8gbWlzc2VkRGFtYWdlQnVmZih7IGlkOiAnQXJteVxcJ3MgUGFlb24nLCBlZmZlY3RJZDogJzhBQScsIGlnbm9yZVNlbGY6IHRydWUgfSksXHJcblxyXG4gICAgLi4ubWlzc2VkTWl0aWdhdGlvbkFiaWxpdHkoeyBpZDogJ1Ryb3ViYWRvdXInLCBhYmlsaXR5SWQ6ICcxQ0VEJyB9KSxcclxuICAgIC4uLm1pc3NlZE1pdGlnYXRpb25BYmlsaXR5KHsgaWQ6ICdUYWN0aWNpYW4nLCBhYmlsaXR5SWQ6ICc0MUY5JyB9KSxcclxuICAgIC4uLm1pc3NlZE1pdGlnYXRpb25BYmlsaXR5KHsgaWQ6ICdTaGllbGQgU2FtYmEnLCBhYmlsaXR5SWQ6ICczRThDJyB9KSxcclxuXHJcbiAgICAuLi5taXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSh7IGlkOiAnTWFudHJhJywgYWJpbGl0eUlkOiAnNDEnIH0pLFxyXG5cclxuICAgIC4uLm1pc3NlZERhbWFnZUFiaWxpdHkoeyBpZDogJ0Rldm90aW9uJywgYWJpbGl0eUlkOiAnMUQxQScgfSksXHJcblxyXG4gICAgLy8gTWF5YmUgdXNpbmcgYSBoZWFsZXIgTEIxL0xCMiBzaG91bGQgYmUgYW4gZXJyb3IgZm9yIHRoZSBoZWFsZXIuIE86KVxyXG4gICAgLy8gLi4ubWlzc2VkSGVhbCh7IGlkOiAnSGVhbGluZyBXaW5kJywgYWJpbGl0eUlkOiAnQ0UnIH0pLFxyXG4gICAgLy8gLi4ubWlzc2VkSGVhbCh7IGlkOiAnQnJlYXRoIG9mIHRoZSBFYXJ0aCcsIGFiaWxpdHlJZDogJ0NGJyB9KSxcclxuXHJcbiAgICAuLi5taXNzZWRIZWFsKHsgaWQ6ICdNZWRpY2EnLCBhYmlsaXR5SWQ6ICc3QycgfSksXHJcbiAgICAuLi5taXNzZWRIZWFsKHsgaWQ6ICdNZWRpY2EgSUknLCBhYmlsaXR5SWQ6ICc4NScgfSksXHJcbiAgICAuLi5taXNzZWRIZWFsKHsgaWQ6ICdBZmZsYXR1cyBSYXB0dXJlJywgYWJpbGl0eUlkOiAnNDA5NicgfSksXHJcbiAgICAuLi5taXNzZWRIZWFsKHsgaWQ6ICdUZW1wZXJhbmNlJywgYWJpbGl0eUlkOiAnNzUxJyB9KSxcclxuICAgIC4uLm1pc3NlZEhlYWwoeyBpZDogJ1BsZW5hcnkgSW5kdWxnZW5jZScsIGFiaWxpdHlJZDogJzFEMDknIH0pLFxyXG4gICAgLi4ubWlzc2VkSGVhbCh7IGlkOiAnUHVsc2Ugb2YgTGlmZScsIGFiaWxpdHlJZDogJ0QwJyB9KSxcclxuXHJcbiAgICAuLi5taXNzZWRIZWFsKHsgaWQ6ICdTdWNjb3InLCBhYmlsaXR5SWQ6ICdCQScgfSksXHJcbiAgICAuLi5taXNzZWRIZWFsKHsgaWQ6ICdJbmRvbWl0YWJpbGl0eScsIGFiaWxpdHlJZDogJ0RGRicgfSksXHJcbiAgICAuLi5taXNzZWRIZWFsKHsgaWQ6ICdEZXBsb3ltZW50IFRhY3RpY3MnLCBhYmlsaXR5SWQ6ICdFMDEnIH0pLFxyXG4gICAgLi4ubWlzc2VkSGVhbCh7IGlkOiAnV2hpc3BlcmluZyBEYXduJywgYWJpbGl0eUlkOiAnMzIzJyB9KSxcclxuICAgIC4uLm1pc3NlZEhlYWwoeyBpZDogJ0ZleSBCbGVzc2luZycsIGFiaWxpdHlJZDogJzQwQTAnIH0pLFxyXG4gICAgLi4ubWlzc2VkSGVhbCh7IGlkOiAnQ29uc29sYXRpb24nLCBhYmlsaXR5SWQ6ICc0MEEzJyB9KSxcclxuICAgIC4uLm1pc3NlZEhlYWwoeyBpZDogJ0FuZ2VsXFwncyBXaGlzcGVyJywgYWJpbGl0eUlkOiAnNDBBNicgfSksXHJcbiAgICAuLi5taXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSh7IGlkOiAnRmV5IElsbHVtaW5hdGlvbicsIGFiaWxpdHlJZDogJzMyNScgfSksXHJcbiAgICAuLi5taXNzZWRNaXRpZ2F0aW9uQWJpbGl0eSh7IGlkOiAnU2VyYXBoaWMgSWxsdW1pbmF0aW9uJywgYWJpbGl0eUlkOiAnNDBBNycgfSksXHJcbiAgICAuLi5taXNzZWRIZWFsKHsgaWQ6ICdBbmdlbCBGZWF0aGVycycsIGFiaWxpdHlJZDogJzEwOTcnIH0pLFxyXG5cclxuICAgIC4uLm1pc3NlZEhlYWwoeyBpZDogJ0hlbGlvcycsIGFiaWxpdHlJZDogJ0UxMCcgfSksXHJcbiAgICAuLi5taXNzZWRIZWFsKHsgaWQ6ICdBc3BlY3RlZCBIZWxpb3MnLCBhYmlsaXR5SWQ6ICdFMTEnIH0pLFxyXG4gICAgLi4ubWlzc2VkSGVhbCh7IGlkOiAnQXNwZWN0ZWQgSGVsaW9zJywgYWJpbGl0eUlkOiAnMzIwMCcgfSksXHJcbiAgICAuLi5taXNzZWRIZWFsKHsgaWQ6ICdDZWxlc3RpYWwgT3Bwb3NpdGlvbicsIGFiaWxpdHlJZDogJzQwQTknIH0pLFxyXG4gICAgLi4ubWlzc2VkSGVhbCh7IGlkOiAnQXN0cmFsIFN0YXNpcycsIGFiaWxpdHlJZDogJzEwOTgnIH0pLFxyXG5cclxuICAgIC4uLm1pc3NlZEhlYWwoeyBpZDogJ1doaXRlIFdpbmQnLCBhYmlsaXR5SWQ6ICcyQzhFJyB9KSxcclxuICAgIC4uLm1pc3NlZEhlYWwoeyBpZDogJ0dvYnNraW4nLCBhYmlsaXR5SWQ6ICc0NzgwJyB9KSxcclxuXHJcbiAgICAvLyBUT0RPOiBleHBvcnQgYWxsIG9mIHRoZXNlIG1pc3NlZCBmdW5jdGlvbnMgaW50byB0aGVpciBvd24gaGVscGVyXHJcbiAgICAvLyBhbmQgdGhlbiBhZGQgdGhpcyB0byB0aGUgRGVsdWJydW0gUmVnaW5hZSBmaWxlcyBkaXJlY3RseS5cclxuICAgIC4uLm1pc3NlZE1pdGlnYXRpb25BYmlsaXR5KHsgaWQ6ICdMb3N0IEFldGhlcnNoaWVsZCcsIGFiaWxpdHlJZDogJzU3NTMnIH0pLFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBHZW5lcmFsIG1pc3Rha2VzOyB0aGVzZSBhcHBseSBldmVyeXdoZXJlLlxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuTWF0Y2hBbGwsXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gVHJpZ2dlciBpZCBmb3IgaW50ZXJuYWxseSBnZW5lcmF0ZWQgZWFybHkgcHVsbCB3YXJuaW5nLlxyXG4gICAgICBpZDogJ0dlbmVyYWwgRWFybHkgUHVsbCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0dlbmVyYWwgRm9vZCBCdWZmJyxcclxuICAgICAgLy8gV2VsbCBGZWRcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMubG9zZXNFZmZlY3QoeyBlZmZlY3RJZDogJzQ4JyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICAvLyBQcmV2ZW50IFwiRW9zIGxvc2VzIHRoZSBlZmZlY3Qgb2YgV2VsbCBGZWQgZnJvbSBDcml0bG8gTWNnZWVcIlxyXG4gICAgICAgIHJldHVybiBtYXRjaGVzLnRhcmdldCA9PT0gbWF0Y2hlcy5zb3VyY2U7XHJcbiAgICAgIH0sXHJcbiAgICAgIG1pc3Rha2U6IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5sb3N0Rm9vZCA9IGRhdGEubG9zdEZvb2QgfHwge307XHJcbiAgICAgICAgLy8gV2VsbCBGZWQgYnVmZiBoYXBwZW5zIHJlcGVhdGVkbHkgd2hlbiBpdCBmYWxscyBvZmYgKFdIWSksXHJcbiAgICAgICAgLy8gc28gc3VwcHJlc3MgbXVsdGlwbGUgb2NjdXJyZW5jZXMuXHJcbiAgICAgICAgaWYgKCFkYXRhLmluQ29tYmF0IHx8IGRhdGEubG9zdEZvb2RbbWF0Y2hlcy50YXJnZXRdKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGRhdGEubG9zdEZvb2RbbWF0Y2hlcy50YXJnZXRdID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ3dhcm4nLFxyXG4gICAgICAgICAgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogJ2xvc3QgZm9vZCBidWZmJyxcclxuICAgICAgICAgICAgZGU6ICdOYWhydW5nc2J1ZmYgdmVybG9yZW4nLFxyXG4gICAgICAgICAgICBmcjogJ0J1ZmYgbm91cnJpdHVyZSB0ZXJtaW7DqWUnLFxyXG4gICAgICAgICAgICBqYTogJ+mjr+WKueaenOOBjOWkseOBo+OBnycsXHJcbiAgICAgICAgICAgIGNuOiAn5aSx5Y676aOf54mpQlVGRicsXHJcbiAgICAgICAgICAgIGtvOiAn7J2M7IudIOuyhO2UhCDtlbTsoJwnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdHZW5lcmFsIFdlbGwgRmVkJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzQ4JyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGlmICghZGF0YS5sb3N0Rm9vZClcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBkZWxldGUgZGF0YS5sb3N0Rm9vZFttYXRjaGVzLnRhcmdldF07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0dlbmVyYWwgUmFiYml0IE1lZGl1bScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzhFMCcgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKGRhdGEsIG1hdGNoZXMpID0+IGRhdGEuSXNQbGF5ZXJJZChtYXRjaGVzLnNvdXJjZUlkKSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICd3YXJuJyxcclxuICAgICAgICAgIGJsYW1lOiBtYXRjaGVzLnNvdXJjZSxcclxuICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgZW46ICdidW5ueScsXHJcbiAgICAgICAgICAgIGRlOiAnSGFzZScsXHJcbiAgICAgICAgICAgIGZyOiAnbGFwaW4nLFxyXG4gICAgICAgICAgICBqYTogJ+OBhuOBleOBjicsXHJcbiAgICAgICAgICAgIGNuOiAn5YWU5a2QJyxcclxuICAgICAgICAgICAga286ICfthqDrgbwnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVGVzdCBtaXN0YWtlIHRyaWdnZXJzLlxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuTWlkZGxlTGFOb3NjZWEsXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdUZXN0IEJvdycsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJ1lvdSBib3cgY291cnRlb3VzbHkgdG8gdGhlIHN0cmlraW5nIGR1bW15Lio/JyB9KSxcclxuICAgICAgbmV0UmVnZXhGcjogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICdWb3VzIHZvdXMgaW5jbGluZXogZGV2YW50IGxlIG1hbm5lcXVpbiBkXFwnZW50cmHDrm5lbWVudC4qPycgfSksXHJcbiAgICAgIG5ldFJlZ2V4SmE6IE5ldFJlZ2V4ZXMuZ2FtZU5hbWVMb2coeyBsaW5lOiAnLirjga/mnKjkurrjgavjgYrovp7lhIDjgZfjgZ8uKj8nIH0pLFxyXG4gICAgICBuZXRSZWdleENuOiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJy4q5oGt5pWs5Zyw5a+55pyo5Lq66KGM56S8Lio/JyB9KSxcclxuICAgICAgbmV0UmVnZXhLbzogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICcuKuuCmOustOyduO2YleyXkOqyjCDqs7XshpDtlZjqsowg7J247IKs7ZWp64uI64ukLio/JyB9KSxcclxuICAgICAgbWlzdGFrZTogKGRhdGEpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ3B1bGwnLFxyXG4gICAgICAgICAgYmxhbWU6IGRhdGEubWUsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnQm93JyxcclxuICAgICAgICAgICAgZGU6ICdCb2dlbicsXHJcbiAgICAgICAgICAgIGZyOiAnU2FsdWVyJyxcclxuICAgICAgICAgICAgamE6ICfjgYrovp7lhIAnLFxyXG4gICAgICAgICAgICBjbjogJ+meoOi6rCcsXHJcbiAgICAgICAgICAgIGtvOiAn7J247IKsJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVGVzdCBXaXBlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FtZU5hbWVMb2coeyBsaW5lOiAnWW91IGJpZCBmYXJld2VsbCB0byB0aGUgc3RyaWtpbmcgZHVtbXkuKj8nIH0pLFxyXG4gICAgICBuZXRSZWdleEZyOiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJ1ZvdXMgZmFpdGVzIHZvcyBhZGlldXggYXUgbWFubmVxdWluIGRcXCdlbnRyYcOubmVtZW50Lio/JyB9KSxcclxuICAgICAgbmV0UmVnZXhKYTogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICcuKuOBr+acqOS6uuOBq+WIpeOCjOOBruaMqOaLtuOCkuOBl+OBny4qPycgfSksXHJcbiAgICAgIG5ldFJlZ2V4Q246IE5ldFJlZ2V4ZXMuZ2FtZU5hbWVMb2coeyBsaW5lOiAnLirlkJHmnKjkurrlkYrliKsuKj8nIH0pLFxyXG4gICAgICBuZXRSZWdleEtvOiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJy4q64KY66y07J247ZiV7JeQ6rKMIOyekeuzhCDsnbjsgqzrpbwg7ZWp64uI64ukLio/JyB9KSxcclxuICAgICAgbWlzdGFrZTogKGRhdGEpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ3dpcGUnLFxyXG4gICAgICAgICAgYmxhbWU6IGRhdGEubWUsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnUGFydHkgV2lwZScsXHJcbiAgICAgICAgICAgIGRlOiAnR3J1cHBlbndpcGUnLFxyXG4gICAgICAgICAgICBmcjogJ1BhcnR5IFdpcGUnLFxyXG4gICAgICAgICAgICBqYTogJ+ODr+OCpOODlycsXHJcbiAgICAgICAgICAgIGNuOiAn5Zui54GtJyxcclxuICAgICAgICAgICAga286ICftjIzti7Ag7KCE66m4JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVGVzdCBCb290c2hpbmUnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiAnMzUnIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgaWYgKG1hdGNoZXMuc291cmNlICE9PSBkYXRhLm1lKVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IHN0cmlraW5nRHVtbXlCeUxvY2FsZSA9IHtcclxuICAgICAgICAgIGVuOiAnU3RyaWtpbmcgRHVtbXknLFxyXG4gICAgICAgICAgZnI6ICdNYW5uZXF1aW4gZFxcJ2VudHJhw65uZW1lbnQnLFxyXG4gICAgICAgICAgamE6ICfmnKjkuronLFxyXG4gICAgICAgICAgY246ICfmnKjkuronLFxyXG4gICAgICAgICAga286ICfrgpjrrLTsnbjtmJUnLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3Qgc3RyaWtpbmdEdW1teU5hbWVzID0gT2JqZWN0LnZhbHVlcyhzdHJpa2luZ0R1bW15QnlMb2NhbGUpO1xyXG4gICAgICAgIHJldHVybiBzdHJpa2luZ0R1bW15TmFtZXMuaW5jbHVkZXMobWF0Y2hlcy50YXJnZXQpO1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuYm9vdENvdW50ID0gZGF0YS5ib290Q291bnQgfHwgMDtcclxuICAgICAgICBkYXRhLmJvb3RDb3VudCsrO1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBgJHttYXRjaGVzLmFiaWxpdHl9ICgke2RhdGEuYm9vdENvdW50fSk6ICR7ZGF0YS5EYW1hZ2VGcm9tTWF0Y2hlcyhtYXRjaGVzKX1gO1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IGRhdGEubWUsIHRleHQ6IHRleHQgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVGVzdCBMZWFkZW4gRmlzdCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc3NDUnIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBtYXRjaGVzLnNvdXJjZSA9PT0gZGF0YS5tZSxcclxuICAgICAgbWlzdGFrZTogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZ29vZCcsIGJsYW1lOiBkYXRhLm1lLCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdUZXN0IE9vcHMnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5lY2hvKHsgbGluZTogJy4qb29wcy4qJyB9KSxcclxuICAgICAgc3VwcHJlc3NTZWNvbmRzOiAxMCxcclxuICAgICAgbWlzdGFrZTogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBkYXRhLm1lLCB0ZXh0OiBtYXRjaGVzLmxpbmUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVGVzdCBQb2tlIENvbGxlY3QnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICdZb3UgcG9rZSB0aGUgc3RyaWtpbmcgZHVtbXkuKj8nIH0pLFxyXG4gICAgICBuZXRSZWdleEZyOiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJ1ZvdXMgdG91Y2hleiBsw6lnw6hyZW1lbnQgbGUgbWFubmVxdWluIGRcXCdlbnRyYcOubmVtZW50IGR1IGRvaWd0Lio/JyB9KSxcclxuICAgICAgbmV0UmVnZXhKYTogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICcuKuOBr+acqOS6uuOCkuOBpOOBpOOBhOOBny4qPycgfSksXHJcbiAgICAgIG5ldFJlZ2V4Q246IE5ldFJlZ2V4ZXMuZ2FtZU5hbWVMb2coeyBsaW5lOiAnLirnlKjmiYvmjIfmiLPlkJHmnKjkurouKj8nIH0pLFxyXG4gICAgICBuZXRSZWdleEtvOiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJy4q64KY66y07J247ZiV7J2EIOy/oey/oSDssIzrpoXri4jri6QuKj8nIH0pLFxyXG4gICAgICBydW46IChkYXRhKSA9PiB7XHJcbiAgICAgICAgZGF0YS5wb2tlQ291bnQgPSAoZGF0YS5wb2tlQ291bnQgfHwgMCkgKyAxO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdUZXN0IFBva2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICdZb3UgcG9rZSB0aGUgc3RyaWtpbmcgZHVtbXkuKj8nIH0pLFxyXG4gICAgICBuZXRSZWdleEZyOiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJ1ZvdXMgdG91Y2hleiBsw6lnw6hyZW1lbnQgbGUgbWFubmVxdWluIGRcXCdlbnRyYcOubmVtZW50IGR1IGRvaWd0Lio/JyB9KSxcclxuICAgICAgbmV0UmVnZXhKYTogTmV0UmVnZXhlcy5nYW1lTmFtZUxvZyh7IGxpbmU6ICcuKuOBr+acqOS6uuOCkuOBpOOBpOOBhOOBny4qPycgfSksXHJcbiAgICAgIG5ldFJlZ2V4Q246IE5ldFJlZ2V4ZXMuZ2FtZU5hbWVMb2coeyBsaW5lOiAnLirnlKjmiYvmjIfmiLPlkJHmnKjkurouKj8nIH0pLFxyXG4gICAgICBuZXRSZWdleEtvOiBOZXRSZWdleGVzLmdhbWVOYW1lTG9nKHsgbGluZTogJy4q64KY66y07J247ZiV7J2EIOy/oey/oSDssIzrpoXri4jri6QuKj8nIH0pLFxyXG4gICAgICBkZWxheVNlY29uZHM6IDUsXHJcbiAgICAgIG1pc3Rha2U6IChkYXRhKSA9PiB7XHJcbiAgICAgICAgLy8gMSBwb2tlIGF0IGEgdGltZSBpcyBmaW5lLCBidXQgbW9yZSB0aGFuIG9uZSBpbiA1IHNlY29uZHMgaXMgKE9CVklPVVNMWSkgYSBtaXN0YWtlLlxyXG4gICAgICAgIGlmICghZGF0YS5wb2tlQ291bnQgfHwgZGF0YS5wb2tlQ291bnQgPD0gMSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgYmxhbWU6IGRhdGEubWUsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiBgVG9vIG1hbnkgcG9rZXMgKCR7ZGF0YS5wb2tlQ291bnR9KWAsXHJcbiAgICAgICAgICAgIGRlOiBgWnUgdmllbGUgUGlla3NlciAoJHtkYXRhLnBva2VDb3VudH0pYCxcclxuICAgICAgICAgICAgZnI6IGBUcm9wIGRlIHRvdWNoZXMgKCR7ZGF0YS5wb2tlQ291bnR9KWAsXHJcbiAgICAgICAgICAgIGphOiBg44GE44Gj44Gx44GE44Gk44Gk44GE44GfICgke2RhdGEucG9rZUNvdW50fSlgLFxyXG4gICAgICAgICAgICBjbjogYOaIs+WkquWkmuS4i+WVpiAoJHtkYXRhLnBva2VDb3VudH0pYCxcclxuICAgICAgICAgICAga286IGDrhIjrrLQg66eO7J20IOywjOumhCAoJHtkYXRhLnBva2VDb3VudH3rsogpYCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgICAgcnVuOiAoZGF0YSkgPT4gZGVsZXRlIGRhdGEucG9rZUNvdW50LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIElmcml0IFN0b3J5IE1vZGVcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUJvd2xPZkVtYmVycyxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnSWZyaXRObSBSYWRpYW50IFBsdW1lJzogJzJERScsXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdJZnJpdE5tIEluY2luZXJhdGUnOiAnMUM1JyxcclxuICAgICdJZnJpdE5tIEVydXB0aW9uJzogJzJERCcsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUaXRhbiBTdG9yeSBNb2RlXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVOYXZlbCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnVGl0YW5ObSBXZWlnaHQgT2YgVGhlIExhbmQnOiAnM0NEJyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdUaXRhbk5tIExhbmRzbGlkZSc6ICcyOEEnLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnVGl0YW5ObSBSb2NrIEJ1c3Rlcic6ICcyODEnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBJdCdzIGhhcmQgdG8gY2FwdHVyZSB0aGUgcmVmbGVjdGlvbiBhYmlsaXRpZXMgZnJvbSBMZXZpYXRoYW4ncyBIZWFkIGFuZCBUYWlsIGlmIHlvdSB1c2VcclxuLy8gcmFuZ2VkIHBoeXNpY2FsIGF0dGFja3MgLyBtYWdpYyBhdHRhY2tzIHJlc3BlY3RpdmVseSwgYXMgdGhlIGFiaWxpdHkgbmFtZXMgYXJlIHRoZVxyXG4vLyBhYmlsaXR5IHlvdSB1c2VkIGFuZCBkb24ndCBhcHBlYXIgdG8gc2hvdyB1cCBpbiB0aGUgbG9nIGFzIG5vcm1hbCBcImFiaWxpdHlcIiBsaW5lcy5cclxuLy8gVGhhdCBzYWlkLCBkb3RzIHN0aWxsIHRpY2sgaW5kZXBlbmRlbnRseSBvbiBib3RoIHNvIGl0J3MgbGlrZWx5IHRoYXQgcGVvcGxlIHdpbGwgYXRhY2tcclxuLy8gdGhlbSBhbnl3YXkuXHJcblxyXG4vLyBUT0RPOiBGaWd1cmUgb3V0IHdoeSBEcmVhZCBUaWRlIC8gV2F0ZXJzcG91dCBhcHBlYXIgbGlrZSBzaGFyZXMgKGkuZS4gMHgxNiBpZCkuXHJcbi8vIERyZWFkIFRpZGUgPSA4MjMvODI0LzgyNSwgV2F0ZXJzcG91dCA9IDgyOVxyXG5cclxuLy8gTGV2aWF0aGFuIEV4dHJlbWVcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZVdob3JsZWF0ZXJFeHRyZW1lLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdMZXZpRXggR3JhbmQgRmFsbCc6ICc4MkYnLCAvLyB2ZXJ5IGxhcmdlIGNpcmN1bGFyIGFvZSBiZWZvcmUgc3Bpbm55IGRpdmVzLCBhcHBsaWVzIGhlYXZ5XHJcbiAgICAnTGV2aUV4IEh5ZHJvIFNob3QnOiAnNzQ4JywgLy8gV2F2ZXNwaW5lIFNhaGFnaW4gYW9lIHRoYXQgZ2l2ZXMgRHJvcHN5IGVmZmVjdFxyXG4gICAgJ0xldmlFeCBEcmVhZHN0b3JtJzogJzc0OScsIC8vIFdhdmV0b290aCBTYWhhZ2luIGFvZSB0aGF0IGdpdmVzIEh5c3RlcmlhIGVmZmVjdFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0xldmlFeCBCb2R5IFNsYW0nOiAnODJBJywgLy8gbGV2aSBzbGFtIHRoYXQgdGlsdHMgdGhlIGJvYXRcclxuICAgICdMZXZpRXggU3Bpbm5pbmcgRGl2ZSAxJzogJzg4QScsIC8vIGxldmkgZGFzaCBhY3Jvc3MgdGhlIGJvYXQgd2l0aCBrbm9ja2JhY2tcclxuICAgICdMZXZpRXggU3Bpbm5pbmcgRGl2ZSAyJzogJzg4QicsIC8vIGxldmkgZGFzaCBhY3Jvc3MgdGhlIGJvYXQgd2l0aCBrbm9ja2JhY2tcclxuICAgICdMZXZpRXggU3Bpbm5pbmcgRGl2ZSAzJzogJzgyQycsIC8vIGxldmkgZGFzaCBhY3Jvc3MgdGhlIGJvYXQgd2l0aCBrbm9ja2JhY2tcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ0xldmlFeCBEcm9wc3knOiAnMTEwJywgLy8gc3RhbmRpbmcgaW4gdGhlIGh5ZHJvIHNob3QgZnJvbSB0aGUgV2F2ZXNwaW5lIFNhaGFnaW5cclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0RmFpbDoge1xyXG4gICAgJ0xldmlFeCBIeXN0ZXJpYSc6ICcxMjgnLCAvLyBzdGFuZGluZyBpbiB0aGUgZHJlYWRzdG9ybSBmcm9tIHRoZSBXYXZldG9vdGggU2FoYWdpblxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdMZXZpRXggQm9keSBTbGFtIEtub2NrZWQgT2ZmJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnODJBJyB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ0tub2NrZWQgb2ZmJyxcclxuICAgICAgICAgICAgZGU6ICdSdW50ZXJnZWZhbGxlbicsXHJcbiAgICAgICAgICAgIGZyOiAnQSDDqXTDqSBhc3NvbW3DqShlKScsXHJcbiAgICAgICAgICAgIGphOiAn44OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwsScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBTaGl2YSBIYXJkXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVBa2hBZmFoQW1waGl0aGVhdHJlSGFyZCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAvLyBMYXJnZSB3aGl0ZSBjaXJjbGVzLlxyXG4gICAgJ1NoaXZhSG0gSWNpY2xlIEltcGFjdCc6ICc5OTMnLFxyXG4gICAgLy8gQXZvaWRhYmxlIHRhbmsgc3R1bi5cclxuICAgICdTaGl2YUhtIEdsYWNpZXIgQmFzaCc6ICc5QTEnLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAvLyBLbm9ja2JhY2sgdGFuayBjbGVhdmUuXHJcbiAgICAnU2hpdmFIbSBIZWF2ZW5seSBTdHJpa2UnOiAnOUEwJyxcclxuICAgIC8vIEhhaWxzdG9ybSBzcHJlYWQgbWFya2VyLlxyXG4gICAgJ1NoaXZhSG0gSGFpbHN0b3JtJzogJzk5OCcsXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgIC8vIFRhbmtidXN0ZXIuICBUaGlzIGlzIFNoaXZhIEhhcmQgbW9kZSwgbm90IFNoaXZhIEV4dHJlbWUuICBQbGVhc2UhXHJcbiAgICAnU2hpdmFIbSBJY2VicmFuZCc6ICc5OTYnLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdTaGl2YUhtIERpYW1vbmQgRHVzdCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzk4QScgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEpID0+IHtcclxuICAgICAgICBkYXRhLnNlZW5EaWFtb25kRHVzdCA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1NoaXZhSG0gRGVlcCBGcmVlemUnLFxyXG4gICAgICAvLyBTaGl2YSBhbHNvIHVzZXMgYWJpbGl0eSA5QTMgb24geW91LCBidXQgaXQgaGFzIHRoZSB1bnRyYW5zbGF0ZWQgbmFtZVxyXG4gICAgICAvLyDpgI/mmI7vvJrjgrfjg7TjgqHvvJrlh43ntZDjg6zjgq/jg4jvvJrjg47jg4Pjgq/jg5Djg4Pjgq/nlKguIFNvLCB1c2UgdGhlIGVmZmVjdCBpbnN0ZWFkIGZvciBmcmVlIHRyYW5zbGF0aW9uLlxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMUU3JyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgIC8vIFRoZSBpbnRlcm1pc3Npb24gYWxzbyBnZXRzIHRoaXMgZWZmZWN0LCBzbyBvbmx5IGEgbWlzdGFrZSBhZnRlciB0aGF0LlxyXG4gICAgICAgIC8vIFVubGlrZSBleHRyZW1lLCB0aGlzIGhhcyB0aGUgc2FtZSAyMCBzZWNvbmQgZHVyYXRpb24gYXMgdGhlIGludGVybWlzc2lvbi5cclxuICAgICAgICByZXR1cm4gZGF0YS5zZWVuRGlhbW9uZER1c3Q7XHJcbiAgICAgIH0sXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gU2hpdmEgRXh0cmVtZVxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlQWtoQWZhaEFtcGhpdGhlYXRyZUV4dHJlbWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgLy8gTGFyZ2Ugd2hpdGUgY2lyY2xlcy5cclxuICAgICdTaGl2YUV4IEljaWNsZSBJbXBhY3QnOiAnQkVCJyxcclxuICAgIC8vIFwiZ2V0IGluXCIgYW9lXHJcbiAgICAnU2hpdmFFeCBXaGl0ZW91dCc6ICdCRUMnLFxyXG4gICAgLy8gQXZvaWRhYmxlIHRhbmsgc3R1bi5cclxuICAgICdTaGl2YUV4IEdsYWNpZXIgQmFzaCc6ICdCRTknLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgLy8gMjcwIGRlZ3JlZSBhdHRhY2suXHJcbiAgICAnU2hpdmFFeCBHbGFzcyBEYW5jZSc6ICdCREYnLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAvLyBIYWlsc3Rvcm0gc3ByZWFkIG1hcmtlci5cclxuICAgICdTaGl2YUV4IEhhaWxzdG9ybSc6ICdCRTInLFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAvLyBMYXNlci4gIFRPRE86IG1heWJlIGJsYW1lIHRoZSBwZXJzb24gaXQncyBvbj8/XHJcbiAgICAnU2hpdmFFeCBBdmFsYW5jaGUnOiAnQkUwJyxcclxuICB9LFxyXG4gIHNvbG9XYXJuOiB7XHJcbiAgICAvLyBQYXJ0eSBzaGFyZWQgdGFua2J1c3RlclxyXG4gICAgJ1NoaXZhRXggSWNlYnJhbmQnOiAnQkUxJyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnU2hpdmFFeCBEZWVwIEZyZWV6ZScsXHJcbiAgICAgIC8vIFNoaXZhIGFsc28gdXNlcyBhYmlsaXR5IEM4QSBvbiB5b3UsIGJ1dCBpdCBoYXMgdGhlIHVudHJhbnNsYXRlZCBuYW1lXHJcbiAgICAgIC8vIOmAj+aYju+8muOCt+ODtOOCoe+8muWHjee1kOODrOOCr+ODiO+8muODjuODg+OCr+ODkOODg+OCr+eUqC/jg5Ljg63jgqTjg4Pjgq8uIFNvLCB1c2UgdGhlIGVmZmVjdCBpbnN0ZWFkIGZvciBmcmVlIHRyYW5zbGF0aW9uLlxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMUU3JyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICAvLyBUaGUgaW50ZXJtaXNzaW9uIGFsc28gZ2V0cyB0aGlzIGVmZmVjdCwgYnV0IGZvciBhIHNob3J0ZXIgZHVyYXRpb24uXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobWF0Y2hlcy5kdXJhdGlvbikgPiAyMDtcclxuICAgICAgfSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVGl0YW4gSGFyZFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlTmF2ZWxIYXJkLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdUaXRhbkhtIFdlaWdodCBPZiBUaGUgTGFuZCc6ICc1NTMnLFxyXG4gICAgJ1RpdGFuSG0gQnVyc3QnOiAnNDFDJyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdUaXRhbkhtIExhbmRzbGlkZSc6ICc1NTQnLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnVGl0YW5IbSBSb2NrIEJ1c3Rlcic6ICc1NTAnLFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnVGl0YW5IbSBNb3VudGFpbiBCdXN0ZXInOiAnMjgzJyxcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRpdGFuIEV4dHJlbWVcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZU5hdmVsRXh0cmVtZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnVGl0YW5FeCBXZWlnaHQgT2YgVGhlIExhbmQnOiAnNUJFJyxcclxuICAgICdUaXRhbkV4IEJ1cnN0JzogJzVCRicsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnVGl0YW5FeCBMYW5kc2xpZGUnOiAnNUJCJyxcclxuICAgICdUaXRhbkV4IEdhb2xlciBMYW5kc2xpZGUnOiAnNUMzJyxcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1RpdGFuRXggUm9jayBCdXN0ZXInOiAnNUI3JyxcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgJ1RpdGFuRXggTW91bnRhaW4gQnVzdGVyJzogJzVCOCcsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVXZWVwaW5nQ2l0eU9mTWhhY2gsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1dlZXBpbmcgQ3JpdGljYWwgQml0ZSc6ICcxODQ4JywgLy8gU2Fyc3VjaHVzIGNvbmUgYW9lXHJcbiAgICAnV2VlcGluZyBSZWFsbSBTaGFrZXInOiAnMTgzRScsIC8vIEZpcnN0IERhdWdodGVyIGNpcmNsZSBhb2VcclxuICAgICdXZWVwaW5nIFNpbGtzY3JlZW4nOiAnMTgzQycsIC8vIEZpcnN0IERhdWdodGVyIGxpbmUgYW9lXHJcbiAgICAnV2VlcGluZyBTaWxrZW4gU3ByYXknOiAnMTgyNCcsIC8vIEFyYWNobmUgRXZlIHJlYXIgY29uYWwgYW9lXHJcbiAgICAnV2VlcGluZyBUcmVtYmxvciAxJzogJzE4MzcnLCAvLyBBcmFjaG5lIEV2ZSBkaXNhcHBlYXIgY2lyY2xlIGFvZSAxXHJcbiAgICAnV2VlcGluZyBUcmVtYmxvciAyJzogJzE4MzYnLCAvLyBBcmFjaG5lIEV2ZSBkaXNhcHBlYXIgY2lyY2xlIGFvZSAyXHJcbiAgICAnV2VlcGluZyBUcmVtYmxvciAzJzogJzE4MzUnLCAvLyBBcmFjaG5lIEV2ZSBkaXNhcHBlYXIgY2lyY2xlIGFvZSAzXHJcbiAgICAnV2VlcGluZyBTcGlkZXIgVGhyZWFkJzogJzE4MzknLCAvLyBBcmFjaG5lIEV2ZSBzcGlkZXIgbGluZSBhb2VcclxuICAgICdXZWVwaW5nIEZpcmUgSUknOiAnMTg0RScsIC8vIEJsYWNrIE1hZ2UgQ29ycHNlIGNpcmNsZSBhb2VcclxuICAgICdXZWVwaW5nIE5lY3JvcHVyZ2UnOiAnMTdENycsIC8vIEZvcmdhbGwgU2hyaXZlbGVkIFRhbG9uIGxpbmUgYW9lXHJcbiAgICAnV2VlcGluZyBSb3R0ZW4gQnJlYXRoJzogJzE3RDAnLCAvLyBGb3JnYWxsIERhaGFrIGNvbmUgYW9lXHJcbiAgICAnV2VlcGluZyBNb3cnOiAnMTdEMicsIC8vIEZvcmdhbGwgSGFhZ2VudGkgdW5tYXJrZWQgY2xlYXZlXHJcbiAgICAnV2VlcGluZyBEYXJrIEVydXB0aW9uJzogJzE3QzMnLCAvLyBGb3JnYWxsIHB1ZGRsZSBtYXJrZXJcclxuICAgIC8vIDE4MDYgaXMgYWxzbyBGbGFyZSBTdGFyLCBidXQgaWYgeW91IGdldCBieSAxODA1IHlvdSBhbHNvIGdldCBoaXQgYnkgMTgwNj9cclxuICAgICdXZWVwaW5nIEZsYXJlIFN0YXInOiAnMTgwNScsIC8vIE96bWEgY3ViZSBwaGFzZSBkb251dFxyXG4gICAgJ1dlZXBpbmcgRXhlY3JhdGlvbic6ICcxODI5JywgLy8gT3ptYSB0cmlhbmdsZSBsYXNlclxyXG4gICAgJ1dlZXBpbmcgSGFpcmN1dCAxJzogJzE4MEInLCAvLyBDYWxvZmlzdGVyaSAxODAgY2xlYXZlIDFcclxuICAgICdXZWVwaW5nIEhhaXJjdXQgMic6ICcxODBGJywgLy8gQ2Fsb2Zpc3RlcmkgMTgwIGNsZWF2ZSAyXHJcbiAgICAnV2VlcGluZyBFbnRhbmdsZW1lbnQnOiAnMTgxRCcsIC8vIENhbG9maXN0ZXJpIGxhbmRtaW5lIHB1ZGRsZSBwcm9jXHJcbiAgICAnV2VlcGluZyBFdmlsIEN1cmwnOiAnMTgxNicsIC8vIENhbG9maXN0ZXJpIGF4ZVxyXG4gICAgJ1dlZXBpbmcgRXZpbCBUcmVzcyc6ICcxODE3JywgLy8gQ2Fsb2Zpc3RlcmkgYnVsYlxyXG4gICAgJ1dlZXBpbmcgRGVwdGggQ2hhcmdlJzogJzE4MjAnLCAvLyBDYWxvZmlzdGVyaSBjaGFyZ2UgdG8gZWRnZVxyXG4gICAgJ1dlZXBpbmcgRmVpbnQgUGFydGljbGUgQmVhbSc6ICcxOTI4JywgLy8gQ2Fsb2Zpc3Rlcmkgc2t5IGxhc2VyXHJcbiAgICAnV2VlcGluZyBFdmlsIFN3aXRjaCc6ICcxODE1JywgLy8gQ2Fsb2Zpc3RlcmkgbGFzZXJzXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdXZWVwaW5nIEFyYWNobmUgV2ViJzogJzE4NUUnLCAvLyBBcmFjaG5lIEV2ZSBoZWFkbWFya2VyIHdlYiBhb2VcclxuICAgICdXZWVwaW5nIEVhcnRoIEFldGhlcic6ICcxODQxJywgLy8gQXJhY2huZSBFdmUgb3Jic1xyXG4gICAgJ1dlZXBpbmcgRXBpZ3JhcGgnOiAnMTg1MicsIC8vIEhlYWRzdG9uZSB1bnRlbGVncmFwaGVkIGxhc2VyIGxpbmUgdGFuayBhdHRhY2tcclxuICAgIC8vIFRoaXMgaXMgdG9vIG5vaXN5LiAgQmV0dGVyIHRvIHBvcCB0aGUgYmFsbG9vbnMgdGhhbiB3b3JyeSBhYm91dCBmcmllbmRzLlxyXG4gICAgLy8gJ1dlZXBpbmcgRXhwbG9zaW9uJzogJzE4MDcnLCAvLyBPem1hc3BoZXJlIEN1YmUgb3JiIGV4cGxvc2lvblxyXG4gICAgJ1dlZXBpbmcgU3BsaXQgRW5kIDEnOiAnMTgwQycsIC8vIENhbG9maXN0ZXJpIHRhbmsgY2xlYXZlIDFcclxuICAgICdXZWVwaW5nIFNwbGl0IEVuZCAyJzogJzE4MTAnLCAvLyBDYWxvZmlzdGVyaSB0YW5rIGNsZWF2ZSAyXHJcbiAgICAnV2VlcGluZyBCbG9vZGllZCBOYWlsJzogJzE4MUYnLCAvLyBDYWxvZmlzdGVyaSBheGUvYnVsYiBhcHBlYXJpbmdcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ1dlZXBpbmcgSHlzdGVyaWEnOiAnMTI4JywgLy8gQXJhY2huZSBFdmUgRnJvbmQgQWZmZWFyZFxyXG4gICAgJ1dlZXBpbmcgWm9tYmlmaWNhdGlvbic6ICcxNzMnLCAvLyBGb3JnYWxsIHRvbyBtYW55IHpvbWJpZSBwdWRkbGVzXHJcbiAgICAnV2VlcGluZyBUb2FkJzogJzFCNycsIC8vIEZvcmdhbGwgQnJhbmQgb2YgdGhlIEZhbGxlbiBmYWlsdXJlXHJcbiAgICAnV2VlcGluZyBEb29tJzogJzM4RScsIC8vIEZvcmdhbGwgSGFhZ2VudGkgTW9ydGFsIFJheVxyXG4gICAgJ1dlZXBpbmcgQXNzaW1pbGF0aW9uJzogJzQyQycsIC8vIE96bWFzaGFkZSBBc3NpbWlsYXRpb24gbG9vay1hd2F5XHJcbiAgICAnV2VlcGluZyBTdHVuJzogJzk1JywgLy8gQ2Fsb2Zpc3RlcmkgUGVuZXRyYXRpb24gbG9vay1hd2F5XHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ1dlZXBpbmcgRm9yZ2FsbCBHcmFkdWFsIFpvbWJpZmljYXRpb24gR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc0MTUnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS56b21iaWUgPSBkYXRhLnpvbWJpZSB8fCB7fTtcclxuICAgICAgICBkYXRhLnpvbWJpZVttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdXZWVwaW5nIEZvcmdhbGwgR3JhZHVhbCBab21iaWZpY2F0aW9uIExvc2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnNDE1JyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuem9tYmllID0gZGF0YS56b21iaWUgfHwge307XHJcbiAgICAgICAgZGF0YS56b21iaWVbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1dlZXBpbmcgRm9yZ2FsbCBNZWdhIERlYXRoJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMTdDQScgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKGRhdGEsIG1hdGNoZXMpID0+IGRhdGEuem9tYmllICYmICFkYXRhLnpvbWJpZVttYXRjaGVzLnRhcmdldF0sXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmFiaWxpdHkgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnV2VlcGluZyBIZWFkc3RvbmUgU2hpZWxkIEdhaW4nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMTVFJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuc2hpZWxkID0gZGF0YS5zaGllbGQgfHwge307XHJcbiAgICAgICAgZGF0YS5zaGllbGRbbWF0Y2hlcy50YXJnZXRdID0gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnV2VlcGluZyBIZWFkc3RvbmUgU2hpZWxkIExvc2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnMTVFJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuc2hpZWxkID0gZGF0YS5zaGllbGQgfHwge307XHJcbiAgICAgICAgZGF0YS5zaGllbGRbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1dlZXBpbmcgRmxhcmluZyBFcGlncmFwaCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzE4NTYnIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLnNoaWVsZCAmJiAhZGF0YS5zaGllbGRbbWF0Y2hlcy50YXJnZXRdLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBUaGlzIGFiaWxpdHkgbmFtZSBpcyBoZWxwZnVsbHkgY2FsbGVkIFwiQXR0YWNrXCIgc28gbmFtZSBpdCBzb21ldGhpbmcgZWxzZS5cclxuICAgICAgaWQ6ICdXZWVwaW5nIE96bWEgVGFuayBMYXNlcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyB0eXBlOiAnMjInLCBpZDogJzE4MzEnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ3dhcm4nLFxyXG4gICAgICAgICAgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogJ1RhbmsgTGFzZXInLFxyXG4gICAgICAgICAgICBkZTogJ1RhbmsgTGFzZXInLFxyXG4gICAgICAgICAgICBmcjogJ1RhbmsgTGFzZXInLFxyXG4gICAgICAgICAgICBqYTogJ+OCv+ODs+OCr+ODrOOCtuODvCcsXHJcbiAgICAgICAgICAgIGNuOiAn5Z2m5YWL5r+A5YWJJyxcclxuICAgICAgICAgICAga286ICftg7Hsu6Qg66CI7J207KCAJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnV2VlcGluZyBPem1hIEhvbHknLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICcxODJFJyB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ1NsaWQgb2ZmIScsXHJcbiAgICAgICAgICAgIGRlOiAnaXN0IHJ1bnRlcmdlcnV0c2NodCEnLFxyXG4gICAgICAgICAgICBmcjogJ0EgZ2xpc3PDqShlKSAhJyxcclxuICAgICAgICAgICAgamE6ICfjg47jg4Pjgq/jg5Djg4Pjgq8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgO+8gScsXHJcbiAgICAgICAgICAgIGtvOiAn64SJ67Cx65CoIScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBBZXRoZXJvY2hlbWljYWwgUmVzZWFyY2ggRmFjaWxpdHlcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUFldGhlcm9jaGVtaWNhbFJlc2VhcmNoRmFjaWxpdHksXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0FSRiBHcmFuZCBTd29yZCc6ICcyMTYnLCAvLyBDb25hbCBBb0UsIFNjcmFtYmxlZCBJcm9uIEdpYW50IHRyYXNoXHJcbiAgICAnQVJGIENlcm1ldCBEcmlsbCc6ICcyMEUnLCAvLyBMaW5lIEFvRSwgNnRoIExlZ2lvbiBNYWdpdGVrIFZhbmd1YXJkIHRyYXNoXHJcbiAgICAnQVJGIE1hZ2l0ZWsgU2x1Zyc6ICcxMERCJywgLy8gTGluZSBBb0UsIGJvc3MgMVxyXG4gICAgJ0FSRiBBZXRoZXJvY2hlbWljYWwgR3JlbmFkbyc6ICcxMEUyJywgLy8gTGFyZ2UgdGFyZ2V0ZWQgY2lyY2xlIEFvRSwgTWFnaXRlayBUdXJyZXQgSUksIGJvc3MgMVxyXG4gICAgJ0FSRiBNYWdpdGVrIFNwcmVhZCc6ICcxMERDJywgLy8gMjcwLWRlZ3JlZSByb29td2lkZSBBb0UsIGJvc3MgMVxyXG4gICAgJ0FSRiBFZXJpZSBTb3VuZHdhdmUnOiAnMTE3MCcsIC8vIFRhcmdldGVkIGNpcmNsZSBBb0UsIEN1bHR1cmVkIEVtcHVzYSB0cmFzaCwgYmVmb3JlIGJvc3MgMlxyXG4gICAgJ0FSRiBUYWlsIFNsYXAnOiAnMTI1RicsIC8vIENvbmFsIEFvRSwgQ3VsdHVyZWQgRGFuY2VyIHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnQVJGIENhbGNpZnlpbmcgTWlzdCc6ICcxMjNBJywgLy8gQ29uYWwgQW9FLCBDdWx0dXJlZCBOYWdhIHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnQVJGIFB1bmN0dXJlJzogJzExNzEnLCAvLyBTaG9ydCBsaW5lIEFvRSwgQ3VsdHVyZWQgRW1wdXNhIHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnQVJGIFNpZGVzd2lwZSc6ICcxMUE3JywgLy8gQ29uYWwgQW9FLCBDdWx0dXJlZCBSZXB0b2lkIHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnQVJGIEd1c3QnOiAnMzk1JywgLy8gVGFyZ2V0ZWQgc21hbGwgY2lyY2xlIEFvRSwgQ3VsdHVyZWQgTWlycm9ya25pZ2h0IHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnQVJGIE1hcnJvdyBEcmFpbic6ICdEMEUnLCAvLyBDb25hbCBBb0UsIEN1bHR1cmVkIENoaW1lcmEgdHJhc2gsIGJlZm9yZSBib3NzIDJcclxuICAgICdBUkYgUmlkZGxlIE9mIFRoZSBTcGhpbngnOiAnMTBFNCcsIC8vIFRhcmdldGVkIGNpcmNsZSBBb0UsIGJvc3MgMlxyXG4gICAgJ0FSRiBLYSc6ICcxMDZFJywgLy8gQ29uYWwgQW9FLCBib3NzIDJcclxuICAgICdBUkYgUm90b3N3aXBlJzogJzExQ0MnLCAvLyBDb25hbCBBb0UsIEZhY2lsaXR5IERyZWFkbm91Z2h0IHRyYXNoLCBiZWZvcmUgYm9zcyAzXHJcbiAgICAnQVJGIEF1dG8tY2Fubm9ucyc6ICcxMkQ5JywgLy8gTGluZSBBb0UsIE1vbml0b3JpbmcgRHJvbmUgdHJhc2gsIGJlZm9yZSBib3NzIDNcclxuICAgICdBUkYgRGVhdGhcXCdzIERvb3InOiAnNEVDJywgLy8gTGluZSBBb0UsIEN1bHR1cmVkIFNoYWJ0aSB0cmFzaCwgYmVmb3JlIGJvc3MgM1xyXG4gICAgJ0FSRiBTcGVsbHN3b3JkJzogJzRFQicsIC8vIENvbmFsIEFvRSwgQ3VsdHVyZWQgU2hhYnRpIHRyYXNoLCBiZWZvcmUgYm9zcyAzXHJcbiAgICAnQVJGIEVuZCBPZiBEYXlzJzogJzEwRkQnLCAvLyBMaW5lIEFvRSwgYm9zcyAzXHJcbiAgICAnQVJGIEJsaXp6YXJkIEJ1cnN0JzogJzEwRkUnLCAvLyBGaXhlZCBjaXJjbGUgQW9FcywgSWdleW9yaG0sIGJvc3MgM1xyXG4gICAgJ0FSRiBGaXJlIEJ1cnN0JzogJzEwRkYnLCAvLyBGaXhlZCBjaXJjbGUgQW9FcywgTGFoYWJyZWEsIGJvc3MgM1xyXG4gICAgJ0FSRiBTZWEgT2YgUGl0Y2gnOiAnMTJERScsIC8vIFRhcmdldGVkIHBlcnNpc3RlbnQgY2lyY2xlIEFvRXMsIGJvc3MgM1xyXG4gICAgJ0FSRiBEYXJrIEJsaXp6YXJkIElJJzogJzEwRjMnLCAvLyBSYW5kb20gY2lyY2xlIEFvRXMsIElnZXlvcmhtLCBib3NzIDNcclxuICAgICdBUkYgRGFyayBGaXJlIElJJzogJzEwRjgnLCAvLyBSYW5kb20gY2lyY2xlIEFvRXMsIExhaGFicmVhLCBib3NzIDNcclxuICAgICdBUkYgQW5jaWVudCBFcnVwdGlvbic6ICcxMTA0JywgLy8gU2VsZi10YXJnZXRlZCBjaXJjbGUgQW9FLCBib3NzIDRcclxuICAgICdBUkYgRW50cm9waWMgRmxhbWUnOiAnMTEwOCcsIC8vIExpbmUgQW9FcywgIGJvc3MgNFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnQVJGIENodGhvbmljIEh1c2gnOiAnMTBFNycsIC8vIEluc3RhbnQgdGFuayBjbGVhdmUsIGJvc3MgMlxyXG4gICAgJ0FSRiBIZWlnaHQgT2YgQ2hhb3MnOiAnMTEwMScsIC8vIFRhbmsgY2xlYXZlLCBib3NzIDRcclxuICAgICdBUkYgQW5jaWVudCBDaXJjbGUnOiAnMTEwMicsIC8vIFRhcmdldGVkIGRvbnV0IEFvRXMsIGJvc3MgNFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdBUkYgUGV0cmlmYWN0aW9uJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzAxJyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gRnJhY3RhbCBDb250aW51dW1cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUZyYWN0YWxDb250aW51dW0sXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0ZyYWN0YWwgRG91YmxlIFNldmVyJzogJ0Y3RCcsIC8vIENvbmFscywgYm9zcyAxXHJcbiAgICAnRnJhY3RhbCBBZXRoZXJpYyBDb21wcmVzc2lvbic6ICdGODAnLCAvLyBHcm91bmQgQW9FIGNpcmNsZXMsIGJvc3MgMVxyXG4gICAgJ0ZyYWN0YWwgMTEtVG9uemUgU3dpcGUnOiAnRjgxJywgLy8gRnJvbnRhbCBjb25lLCBib3NzIDJcclxuICAgICdGcmFjdGFsIDEwLVRvbnplIFNsYXNoJzogJ0Y4MycsIC8vIEZyb250YWwgbGluZSwgYm9zcyAyXHJcbiAgICAnRnJhY3RhbCAxMTEtVG9uemUgU3dpbmcnOiAnRjg3JywgLy8gR2V0LW91dCBBb0UsIGJvc3MgMlxyXG4gICAgJ0ZyYWN0YWwgQnJva2VuIEdsYXNzJzogJ0Y4RScsIC8vIEdsb3dpbmcgcGFuZWxzLCBib3NzIDNcclxuICAgICdGcmFjdGFsIE1pbmVzJzogJ0Y5MCcsXHJcbiAgICAnRnJhY3RhbCBTZWVkIG9mIHRoZSBSaXZlcnMnOiAnRjkxJywgLy8gR3JvdW5kIEFvRSBjaXJjbGVzLCBib3NzIDNcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0ZyYWN0YWwgU2FuY3RpZmljYXRpb24nOiAnRjg5JywgLy8gSW5zdGFudCBjb25hbCBidXN0ZXIsIGJvc3MgM1xyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5pbXBvcnQgeyBwbGF5ZXJEYW1hZ2VGaWVsZHMgfSBmcm9tICcuLi8uLi8uLi9vb3BzeV9jb21tb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUdyZWF0R3ViYWxMaWJyYXJ5SGFyZCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnR3ViYWxIbSBUZXJyb3IgRXllJzogJzkzMCcsIC8vIENpcmNsZSBBb0UsIFNwaW5lIEJyZWFrZXIgdHJhc2hcclxuICAgICdHdWJhbEhtIEJhdHRlcic6ICcxOThBJywgLy8gQ2lyY2xlIEFvRSwgdHJhc2ggYmVmb3JlIGJvc3MgMVxyXG4gICAgJ0d1YmFsSG0gQ29uZGVtbmF0aW9uJzogJzM5MCcsIC8vIENvbmFsIEFvRSwgQmlibGlvdm9yZSB0cmFzaFxyXG4gICAgJ0d1YmFsSG0gRGlzY29udGludWUgMSc6ICcxOTQzJywgLy8gRmFsbGluZyBib29rIHNoYWRvdywgYm9zcyAxXHJcbiAgICAnR3ViYWxIbSBEaXNjb250aW51ZSAyJzogJzE5NDAnLCAvLyBSdXNoIEFvRSBmcm9tIGVuZHMsIGJvc3MgMVxyXG4gICAgJ0d1YmFsSG0gRGlzY29udGludWUgMyc6ICcxOTQyJywgLy8gUnVzaCBBb0UgYWNyb3NzLCBib3NzIDFcclxuICAgICdHdWJhbEhtIEZyaWdodGZ1bCBSb2FyJzogJzE5M0InLCAvLyBHZXQtT3V0IEFvRSwgYm9zcyAxXHJcbiAgICAnR3ViYWxIbSBJc3N1ZSAxJzogJzE5M0QnLCAvLyBJbml0aWFsIGVuZCBib29rIHdhcm5pbmcgQW9FLCBib3NzIDFcclxuICAgICdHdWJhbEhtIElzc3VlIDInOiAnMTkzRicsIC8vIEluaXRpYWwgZW5kIGJvb2sgd2FybmluZyBBb0UsIGJvc3MgMVxyXG4gICAgJ0d1YmFsSG0gSXNzdWUgMyc6ICcxOTQxJywgLy8gSW5pdGlhbCBzaWRlIGJvb2sgd2FybmluZyBBb0UsIGJvc3MgMVxyXG4gICAgJ0d1YmFsSG0gRGVzb2xhdGlvbic6ICcxOThDJywgLy8gTGluZSBBb0UsIEJpYmxpb2NsYXN0IHRyYXNoXHJcbiAgICAnR3ViYWxIbSBEb3VibGUgU21hc2gnOiAnMjZBJywgLy8gQ29uYWwgQW9FLCBCaWJsaW9jbGFzdCB0cmFzaFxyXG4gICAgJ0d1YmFsSG0gRGFya25lc3MnOiAnM0EwJywgLy8gQ29uYWwgQW9FLCBJbmtzdGFpbiB0cmFzaFxyXG4gICAgJ0d1YmFsSG0gRmlyZXdhdGVyJzogJzNCQScsIC8vIENpcmNsZSBBb0UsIEJpYmxpb2NsYXN0IHRyYXNoXHJcbiAgICAnR3ViYWxIbSBFbGJvdyBEcm9wJzogJ0NCQScsIC8vIENvbmFsIEFvRSwgQmlibGlvY2xhc3QgdHJhc2hcclxuICAgICdHdWJhbEhtIERhcmsnOiAnMTlERicsIC8vIExhcmdlIGNpcmNsZSBBb0UsIElua3N0YWluIHRyYXNoXHJcbiAgICAnR3ViYWxIbSBTZWFscyc6ICcxOTRBJywgLy8gU3VuL01vb25zZWFsIGZhaWx1cmUsIGJvc3MgMlxyXG4gICAgJ0d1YmFsSG0gV2F0ZXIgSUlJJzogJzFDNjcnLCAvLyBMYXJnZSBjaXJjbGUgQW9FLCBQb3JvZ28gUGVnaXN0IHRyYXNoXHJcbiAgICAnR3ViYWxIbSBSYWdpbmcgQXhlJzogJzE3MDMnLCAvLyBTbWFsbCBjb25hbCBBb0UsIE1lY2hhbm9zZXJ2aXRvciB0cmFzaFxyXG4gICAgJ0d1YmFsSG0gTWFnaWMgSGFtbWVyJzogJzE5OTAnLCAvLyBMYXJnZSBjaXJjbGUgQW9FLCBBcGFuZGEgbWluaS1ib3NzXHJcbiAgICAnR3ViYWxIbSBQcm9wZXJ0aWVzIE9mIEdyYXZpdHknOiAnMTk1MCcsIC8vIENpcmNsZSBBb0UgZnJvbSBncmF2aXR5IHB1ZGRsZXMsIGJvc3MgM1xyXG4gICAgJ0d1YmFsSG0gUHJvcGVydGllcyBPZiBMZXZpdGF0aW9uJzogJzE5NEYnLCAvLyBDaXJjbGUgQW9FIGZyb20gbGV2aXRhdGlvbiBwdWRkbGVzLCBib3NzIDNcclxuICAgICdHdWJhbEhtIENvbWV0JzogJzE5NjknLCAvLyBTbWFsbCBjaXJjbGUgQW9FLCBpbnRlcm1pc3Npb24sIGJvc3MgM1xyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0d1YmFsSG0gRWNsaXB0aWMgTWV0ZW9yJzogJzE5NUMnLCAvLyBMb1MgbWVjaGFuaWMsIGJvc3MgM1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnR3ViYWxIbSBTZWFyaW5nIFdpbmQnOiAnMTk0NCcsIC8vIFRhbmsgY2xlYXZlLCBib3NzIDJcclxuICAgICdHdWJhbEhtIFRodW5kZXInOiAnMTlbQUJdJywgLy8gU3ByZWFkIG1hcmtlciwgYm9zcyAzXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBGaXJlIGdhdGUgaW4gaGFsbHdheSB0byBib3NzIDIsIG1hZ25ldCBmYWlsdXJlIG9uIGJvc3MgMlxyXG4gICAgICBpZDogJ0d1YmFsSG0gQnVybnMnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMTBCJyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBIZWxwZXIgZm9yIFRodW5kZXIgMyBmYWlsdXJlc1xyXG4gICAgICBpZDogJ0d1YmFsSG0gSW1wIEdhaW4nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnNDZFJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzSW1wID0gZGF0YS5oYXNJbXAgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNJbXBbbWF0Y2hlcy50YXJnZXRdID0gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnR3ViYWxIbSBJbXAgTG9zZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmxvc2VzRWZmZWN0KHsgZWZmZWN0SWQ6ICc0NkUnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNJbXAgPSBkYXRhLmhhc0ltcCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc0ltcFttYXRjaGVzLnRhcmdldF0gPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIFRhcmdldHMgd2l0aCBJbXAgd2hlbiBUaHVuZGVyIElJSSByZXNvbHZlcyByZWNlaXZlIGEgdnVsbmVyYWJpbGl0eSBzdGFjayBhbmQgYnJpZWYgc3R1blxyXG4gICAgICBpZDogJ0d1YmFsSG0gSW1wIFRodW5kZXInLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiAnMTk1W0FCXScsIC4uLnBsYXllckRhbWFnZUZpZWxkcyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoZGF0YSwgbWF0Y2hlcykgPT4gZGF0YS5oYXNJbXBbbWF0Y2hlcy50YXJnZXRdLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ3dhcm4nLFxyXG4gICAgICAgICAgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogJ1Nob2NrZWQgSW1wJyxcclxuICAgICAgICAgICAgZGU6ICdTY2hvY2tpZXJ0ZXIgSW1wJyxcclxuICAgICAgICAgICAgamE6ICfjgqvjg4Pjg5HjgpLop6PpmaTjgZfjgarjgYvjgaPjgZ8nLFxyXG4gICAgICAgICAgICBjbjogJ+ays+erpeeKtuaAgeWQg+S6huaatOmbtycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0d1YmFsSG0gUXVha2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiAnMTk1NicsIC4uLnBsYXllckRhbWFnZUZpZWxkcyB9KSxcclxuICAgICAgLy8gQWx3YXlzIGhpdHMgdGFyZ2V0LCBidXQgaWYgY29ycmVjdGx5IHJlc29sdmVkIHdpbGwgZGVhbCAwIGRhbWFnZVxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLkRhbWFnZUZyb21NYXRjaGVzKG1hdGNoZXMpID4gMCxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdHdWJhbEhtIFRvcm5hZG8nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiAnMTk1Wzc4XScsIC4uLnBsYXllckRhbWFnZUZpZWxkcyB9KSxcclxuICAgICAgLy8gQWx3YXlzIGhpdHMgdGFyZ2V0LCBidXQgaWYgY29ycmVjdGx5IHJlc29sdmVkIHdpbGwgZGVhbCAwIGRhbWFnZVxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLkRhbWFnZUZyb21NYXRjaGVzKG1hdGNoZXMpID4gMCxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlNvaG1BbEhhcmQsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1NvaG1BbEhtIERlYWRseSBWYXBvcic6ICcxREM5JywgLy8gRW52aXJvbm1lbnRhbCBjaXJjbGUgQW9Fc1xyXG4gICAgJ1NvaG1BbEhtIERlZXByb290JzogJzFDREEnLCAvLyBUYXJnZXRlZCBjaXJjbGUgQW9FLCBCbG9vbWluZyBDaGljaHUgdHJhc2hcclxuICAgICdTb2htQWxIbSBPZGlvdXMgQWlyJzogJzFDREInLCAvLyBDb25hbCBBb0UsIEJsb29taW5nIENoaWNodSB0cmFzaFxyXG4gICAgJ1NvaG1BbEhtIEdsb3Jpb3VzIEJsYXplJzogJzFDMzMnLCAvLyBDaXJjbGUgQW9FLCBTbWFsbCBTcG9yZSBTYWMsIGJvc3MgMVxyXG4gICAgJ1NvaG1BbEhtIEZvdWwgV2F0ZXJzJzogJzExOEEnLCAvLyBDb25hbCBBb0UsIE1vdW50YWludG9wIE9wa2VuIHRyYXNoXHJcbiAgICAnU29obUFsSG0gUGxhaW4gUG91bmQnOiAnMTE4NycsIC8vIFRhcmdldGVkIGNpcmNsZSBBb0UsIE1vdW50YWludG9wIEhyb3BrZW4gdHJhc2hcclxuICAgICdTb2htQWxIbSBQYWxzeW55eGlzJzogJzExNjEnLCAvLyBDb25hbCBBb0UsIE92ZXJncm93biBEaWZmbHVnaWEgdHJhc2hcclxuICAgICdTb2htQWxIbSBTdXJmYWNlIEJyZWFjaCc6ICcxRTgwJywgLy8gQ2lyY2xlIEFvRSwgR2lhbnQgTmV0aGVyd29ybSB0cmFzaFxyXG4gICAgJ1NvaG1BbEhtIEZyZXNod2F0ZXIgQ2Fubm9uJzogJzExOUYnLCAvLyBMaW5lIEFvRSwgR2lhbnQgTmV0aGVyd29ybSB0cmFzaFxyXG4gICAgJ1NvaG1BbEhtIFRhaWwgU21hc2gnOiAnMUMzNScsIC8vIFVudGVsZWdyYXBoZWQgcmVhciBjb25hbCBBb0UsIEdvd3JvdywgYm9zcyAyXHJcbiAgICAnU29obUFsSG0gVGFpbCBTd2luZyc6ICcxQzM2JywgLy8gVW50ZWxlZ3JhcGhlZCBjaXJjbGUgQW9FLCBHb3dyb3csIGJvc3MgMlxyXG4gICAgJ1NvaG1BbEhtIFJpcHBlciBDbGF3JzogJzFDMzcnLCAvLyBVbnRlbGVncmFwaGVkIGZyb250YWwgQW9FLCBHb3dyb3csIGJvc3MgMlxyXG4gICAgJ1NvaG1BbEhtIFdpbmQgU2xhc2gnOiAnMUMzOCcsIC8vIENpcmNsZSBBb0UsIEdvd3JvdywgYm9zcyAyXHJcbiAgICAnU29obUFsSG0gV2lsZCBDaGFyZ2UnOiAnMUMzOScsIC8vIERhc2ggYXR0YWNrLCBHb3dyb3csIGJvc3MgMlxyXG4gICAgJ1NvaG1BbEhtIEhvdCBDaGFyZ2UnOiAnMUMzQScsIC8vIERhc2ggYXR0YWNrLCBHb3dyb3csIGJvc3MgMlxyXG4gICAgJ1NvaG1BbEhtIEZpcmViYWxsJzogJzFDM0InLCAvLyBVbnRlbGVncmFwaGVkIHRhcmdldGVkIGNpcmNsZSBBb0UsIEdvd3JvdywgYm9zcyAyXHJcbiAgICAnU29obUFsSG0gTGF2YSBGbG93JzogJzFDM0MnLCAvLyBVbnRlbGVncmFwaGVkIGNvbmFsIEFvRSwgR293cm93LCBib3NzIDJcclxuICAgICdTb2htQWxIbSBXaWxkIEhvcm4nOiAnMTUwNycsIC8vIENvbmFsIEFvRSwgQWJhbGF0aGlhbiBDbGF5IEdvbGVtIHRyYXNoXHJcbiAgICAnU29obUFsSG0gTGF2YSBCcmVhdGgnOiAnMUM0RCcsIC8vIENvbmFsIEFvRSwgTGF2YSBDcmFiIHRyYXNoXHJcbiAgICAnU29obUFsSG0gUmluZyBvZiBGaXJlJzogJzFDNEMnLCAvLyBUYXJnZXRlZCBjaXJjbGUgQW9FLCBWb2xjYW5vIEFuYWxhIHRyYXNoXHJcbiAgICAnU29obUFsSG0gTW9sdGVuIFNpbGsgMSc6ICcxQzQzJywgLy8gMjcwLWRlZ3JlZSBmcm9udGFsIEFvRSwgTGF2YSBTY29ycGlvbiwgYm9zcyAzXHJcbiAgICAnU29obUFsSG0gTW9sdGVuIFNpbGsgMic6ICcxQzQ0JywgLy8gMjcwLWRlZ3JlZSByZWFyIEFvRSwgTGF2YSBTY29ycGlvbiwgYm9zcyAzXHJcbiAgICAnU29obUFsSG0gTW9sdGVuIFNpbGsgMyc6ICcxQzQyJywgLy8gUmluZyBBb0UsIExhdmEgU2NvcnBpb24sIGJvc3MgM1xyXG4gICAgJ1NvaG1BbEhtIFJlYWxtIFNoYWtlcic6ICcxQzQxJywgLy8gQ2lyY2xlIEFvRSwgTGF2YSBTY29ycGlvbiwgYm9zcyAzXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBXYXJucyBpZiBwbGF5ZXJzIHN0ZXAgaW50byB0aGUgbGF2YSBwdWRkbGVzLiBUaGVyZSBpcyB1bmZvcnR1bmF0ZWx5IG5vIGRpcmVjdCBkYW1hZ2UgZXZlbnQuXHJcbiAgICAgIGlkOiAnU29obUFsSG0gQnVybnMnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMTFDJyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5pbXBvcnQgeyBwbGF5ZXJEYW1hZ2VGaWVsZHMgfSBmcm9tICcuLi8uLi8uLi9vb3BzeV9jb21tb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkFsZXhhbmRlclRoZVNvdWxPZlRoZUNyZWF0b3IsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0ExMk4gU2FjcmFtZW50JzogJzFBRTYnLCAvLyBDcm9zcyBMYXNlcnNcclxuICAgICdBMTJOIEdyYXZpdGF0aW9uYWwgQW5vbWFseSc6ICcxQUVCJywgLy8gR3Jhdml0eSBQdWRkbGVzXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdBMTJOIERpdmluZSBTcGVhcic6ICcxQUUzJywgLy8gSW5zdGFudCBjb25hbCB0YW5rIGNsZWF2ZVxyXG4gICAgJ0ExMk4gQmxhemluZyBTY291cmdlJzogJzFBRTknLCAvLyBPcmFuZ2UgaGVhZCBtYXJrZXIgc3BsYXNoIGRhbWFnZVxyXG4gICAgJ0ExMk4gUGxhaW50IE9mIFNldmVyaXR5JzogJzFBRjEnLCAvLyBBZ2dyYXZhdGVkIEFzc2F1bHQgc3BsYXNoIGRhbWFnZVxyXG4gICAgJ0ExMk4gQ29tbXVuaW9uJzogJzFBRkMnLCAvLyBUZXRoZXIgUHVkZGxlc1xyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdBMTJOIEFzc2F1bHQgQ29sbGVjdCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc0NjEnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5hc3NhdWx0ID0gZGF0YS5hc3NhdWx0IHx8IFtdO1xyXG4gICAgICAgIGRhdGEuYXNzYXVsdC5wdXNoKG1hdGNoZXMudGFyZ2V0KTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIEl0IGlzIGEgZmFpbHVyZSBmb3IgYSBTZXZlcml0eSBtYXJrZXIgdG8gc3RhY2sgd2l0aCB0aGUgU29saWRhcml0eSBncm91cC5cclxuICAgICAgaWQ6ICdBMTJOIEFzc2F1bHQgRmFpbHVyZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICcxQUYyJywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLmFzc2F1bHQuaW5jbHVkZXMobWF0Y2hlcy50YXJnZXQpLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogJ0RpZG5cXCd0IFNwcmVhZCEnLFxyXG4gICAgICAgICAgICBkZTogJ05pY2h0IHZlcnRlaWx0IScsXHJcbiAgICAgICAgICAgIGZyOiAnTmUgc1xcJ2VzdCBwYXMgZGlzcGVyc8OpKGUpICEnLFxyXG4gICAgICAgICAgICBqYTogJ+aVo+mWi+OBl+OBquOBi+OBo+OBnyEnLFxyXG4gICAgICAgICAgICBjbjogJ+ayoeacieaVo+W8gCEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdBMTJOIEFzc2F1bHQgQ2xlYW51cCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc0NjEnIH0pLFxyXG4gICAgICBkZWxheVNlY29uZHM6IDIwLFxyXG4gICAgICBzdXBwcmVzc1NlY29uZHM6IDUsXHJcbiAgICAgIHJ1bjogKGRhdGEpID0+IHtcclxuICAgICAgICBkZWxldGUgZGF0YS5hc3NhdWx0O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkFsYU1oaWdvLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdBbGEgTWhpZ28gTWFnaXRlayBSYXknOiAnMjRDRScsIC8vIExpbmUgQW9FLCBMZWdpb24gUHJlZGF0b3IgdHJhc2gsIGJlZm9yZSBib3NzIDFcclxuICAgICdBbGEgTWhpZ28gTG9jayBPbic6ICcyMDQ3JywgLy8gSG9taW5nIGNpcmNsZXMsIGJvc3MgMVxyXG4gICAgJ0FsYSBNaGlnbyBUYWlsIExhc2VyIDEnOiAnMjA0OScsIC8vIEZyb250YWwgbGluZSBBb0UsIGJvc3MgMVxyXG4gICAgJ0FsYSBNaGlnbyBUYWlsIExhc2VyIDInOiAnMjA0QicsIC8vIFJlYXIgbGluZSBBb0UsIGJvc3MgMVxyXG4gICAgJ0FsYSBNaGlnbyBUYWlsIExhc2VyIDMnOiAnMjA0QycsIC8vIFJlYXIgbGluZSBBb0UsIGJvc3MgMVxyXG4gICAgJ0FsYSBNaGlnbyBTaG91bGRlciBDYW5ub24nOiAnMjREMCcsIC8vIENpcmNsZSBBb0UsIExlZ2lvbiBBdmVuZ2VyIHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnQWxhIE1oaWdvIENhbm5vbmZpcmUnOiAnMjNFRCcsIC8vIEVudmlyb25tZW50YWwgY2lyY2xlIEFvRSwgcGF0aCB0byBib3NzIDJcclxuICAgICdBbGEgTWhpZ28gQWV0aGVyb2NoZW1pY2FsIEdyZW5hZG8nOiAnMjA1QScsIC8vIENpcmNsZSBBb0UsIGJvc3MgMlxyXG4gICAgJ0FsYSBNaGlnbyBJbnRlZ3JhdGVkIEFldGhlcm9tb2R1bGF0b3InOiAnMjA1QicsIC8vIFJpbmcgQW9FLCBib3NzIDJcclxuICAgICdBbGEgTWhpZ28gQ2lyY2xlIE9mIERlYXRoJzogJzI0RDQnLCAvLyBQcm94aW1pdHkgY2lyY2xlIEFvRSwgSGV4YWRyb25lIHRyYXNoLCBiZWZvcmUgYm9zcyAzXHJcbiAgICAnQWxhIE1oaWdvIEV4aGF1c3QnOiAnMjREMycsIC8vIExpbmUgQW9FLCBMZWdpb24gQ29sb3NzdXMgdHJhc2gsIGJlZm9yZSBib3NzIDNcclxuICAgICdBbGEgTWhpZ28gR3JhbmQgU3dvcmQnOiAnMjREMicsIC8vIENvbmFsIEFvRSwgTGVnaW9uIENvbG9zc3VzIHRyYXNoLCBiZWZvcmUgYm9zcyAzXHJcbiAgICAnQWxhIE1oaWdvIEFydCBPZiBUaGUgU3Rvcm0gMSc6ICcyMDY2JywgLy8gUHJveGltaXR5IGNpcmNsZSBBb0UsIHByZS1pbnRlcm1pc3Npb24sIGJvc3MgM1xyXG4gICAgJ0FsYSBNaGlnbyBBcnQgT2YgVGhlIFN0b3JtIDInOiAnMjU4NycsIC8vIFByb3hpbWl0eSBjaXJjbGUgQW9FLCBpbnRlcm1pc3Npb24sIGJvc3MgM1xyXG4gICAgJ0FsYSBNaGlnbyBWZWluIFNwbGl0dGVyIDEnOiAnMjRCNicsIC8vIFByb3hpbWl0eSBjaXJjbGUgQW9FLCBwcmltYXJ5IGVudGl0eSwgYm9zcyAzXHJcbiAgICAnQWxhIE1oaWdvIFZlaW4gU3BsaXR0ZXIgMic6ICcyMDZDJywgLy8gUHJveGltaXR5IGNpcmNsZSBBb0UsIGhlbHBlciBlbnRpdHksIGJvc3MgM1xyXG4gICAgJ0FsYSBNaGlnbyBMaWdodGxlc3MgU3BhcmsnOiAnMjA2QicsIC8vIENvbmFsIEFvRSwgYm9zcyAzXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdBbGEgTWhpZ28gRGVtaW1hZ2lja3MnOiAnMjA1RScsXHJcbiAgICAnQWxhIE1oaWdvIFVubW92aW5nIFRyb2lrYSc6ICcyMDYwJyxcclxuICAgICdBbGEgTWhpZ28gQXJ0IE9mIFRoZSBTd29yZCAxJzogJzIwNjknLFxyXG4gICAgJ0FsYSBNaGlnbyBBcnQgT2YgVGhlIFN3b3JkIDInOiAnMjU4OScsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBJdCdzIHBvc3NpYmxlIHBsYXllcnMgbWlnaHQganVzdCB3YW5kZXIgaW50byB0aGUgYmFkIG9uIHRoZSBvdXRzaWRlLFxyXG4gICAgICAvLyBidXQgbm9ybWFsbHkgcGVvcGxlIGdldCBwdXNoZWQgaW50byBpdC5cclxuICAgICAgaWQ6ICdBbGEgTWhpZ28gQXJ0IE9mIFRoZSBTd2VsbCcsXHJcbiAgICAgIC8vIERhbWFnZSBEb3duXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcyQjgnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5lZmZlY3QgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIEJhcmRhbSdzIE1ldHRsZVxyXG5cclxuXHJcbi8vIEZvciByZWFzb25zIG5vdCBjb21wbGV0ZWx5IHVuZGVyc3Rvb2QgYXQgdGhlIHRpbWUgdGhpcyB3YXMgbWVyZ2VkLFxyXG4vLyBidXQgbGlrZWx5IHJlbGF0ZWQgdG8gdGhlIGZhY3QgdGhhdCBubyBuYW1lcGxhdGVzIGFyZSB2aXNpYmxlIGR1cmluZyB0aGUgZW5jb3VudGVyLFxyXG4vLyBhbmQgdGhhdCBub3RoaW5nIGluIHRoZSBlbmNvdW50ZXIgYWN0dWFsbHkgZG9lcyBkYW1hZ2UsXHJcbi8vIHdlIGNhbid0IHVzZSBkYW1hZ2VXYXJuIG9yIGdhaW5zRWZmZWN0IGhlbHBlcnMgb24gdGhlIEJhcmRhbSBmaWdodC5cclxuLy8gSW5zdGVhZCwgd2UgdXNlIHRoaXMgaGVscGVyIGZ1bmN0aW9uIHRvIGxvb2sgZm9yIGZhaWx1cmUgZmxhZ3MuXHJcbi8vIElmIHRoZSBmbGFnIGlzIHByZXNlbnQsYSBmdWxsIHRyaWdnZXIgb2JqZWN0IGlzIHJldHVybmVkIHRoYXQgZHJvcHMgaW4gc2VhbWxlc3NseS5cclxuY29uc3QgYWJpbGl0eVdhcm4gPSAoYXJncykgPT4ge1xyXG4gIGlmICghYXJncy5hYmlsaXR5SWQpXHJcbiAgICBjb25zb2xlLmVycm9yKCdNaXNzaW5nIGFiaWxpdHkgJyArIEpTT04uc3RyaW5naWZ5KGFyZ3MpKTtcclxuICByZXR1cm4ge1xyXG4gICAgaWQ6IGFyZ3MuaWQsXHJcbiAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiBhcmdzLmFiaWxpdHlJZCB9KSxcclxuICAgIGNvbmRpdGlvbjogKF9kYXRhLCBtYXRjaGVzKSA9PiBtYXRjaGVzLmZsYWdzLnN1YnN0cigtMikgPT09ICcwRScsXHJcbiAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgfSxcclxuICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkJhcmRhbXNNZXR0bGUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0JhcmRhbSBEaXJ0eSBDbGF3JzogJzIxQTgnLCAvLyBGcm9udGFsIGNsZWF2ZSwgR3VsbyBHdWxvIHRyYXNoXHJcbiAgICAnQmFyZGFtIEVwaWdyYXBoJzogJzIzQUYnLCAvLyBMaW5lIEFvRSwgV2FsbCBvZiBCYXJkYW0gdHJhc2hcclxuICAgICdCYXJkYW0gVGhlIER1c2sgU3Rhcic6ICcyMTg3JywgLy8gQ2lyY2xlIEFvRSwgZW52aXJvbm1lbnQgYmVmb3JlIGZpcnN0IGJvc3NcclxuICAgICdCYXJkYW0gVGhlIERhd24gU3Rhcic6ICcyMTg2JywgLy8gQ2lyY2xlIEFvRSwgZW52aXJvbm1lbnQgYmVmb3JlIGZpcnN0IGJvc3NcclxuICAgICdCYXJkYW0gQ3J1bWJsaW5nIENydXN0JzogJzFGMTMnLCAvLyBDaXJjbGUgQW9FcywgR2FydWxhLCBmaXJzdCBib3NzXHJcbiAgICAnQmFyZGFtIFJhbSBSdXNoJzogJzFFRkMnLCAvLyBMaW5lIEFvRXMsIFN0ZXBwZSBZYW1hYSwgZmlyc3QgYm9zcy5cclxuICAgICdCYXJkYW0gTHVsbGFieSc6ICcyNEIyJywgLy8gQ2lyY2xlIEFvRXMsIFN0ZXBwZSBTaGVlcCwgZmlyc3QgYm9zcy5cclxuICAgICdCYXJkYW0gSGVhdmUnOiAnMUVGNycsIC8vIEZyb250YWwgY2xlYXZlLCBHYXJ1bGEsIGZpcnN0IGJvc3NcclxuICAgICdCYXJkYW0gV2lkZSBCbGFzdGVyJzogJzI0QjMnLCAvLyBFbm9ybW91cyBmcm9udGFsIGNsZWF2ZSwgU3RlcHBlIENvZXVybCwgZmlyc3QgYm9zc1xyXG4gICAgJ0JhcmRhbSBEb3VibGUgU21hc2gnOiAnMjZBJywgLy8gQ2lyY2xlIEFvRSwgTWV0dGxpbmcgRGhhcmEgdHJhc2hcclxuICAgICdCYXJkYW0gVHJhbnNvbmljIEJsYXN0JzogJzEyNjInLCAvLyBDaXJjbGUgQW9FLCBTdGVwcGUgRWFnbGUgdHJhc2hcclxuICAgICdCYXJkYW0gV2lsZCBIb3JuJzogJzIyMDgnLCAvLyBGcm9udGFsIGNsZWF2ZSwgS2h1biBHdXJ2ZWwgdHJhc2hcclxuICAgICdCYXJkYW0gSGVhdnkgU3RyaWtlIDEnOiAnMjU3OCcsIC8vIDEgb2YgMyAyNzAtZGVncmVlIHJpbmcgQW9FcywgQmFyZGFtLCBzZWNvbmQgYm9zc1xyXG4gICAgJ0JhcmRhbSBIZWF2eSBTdHJpa2UgMic6ICcyNTc5JywgLy8gMiBvZiAzIDI3MC1kZWdyZWUgcmluZyBBb0VzLCBCYXJkYW0sIHNlY29uZCBib3NzXHJcbiAgICAnQmFyZGFtIEhlYXZ5IFN0cmlrZSAzJzogJzI1N0EnLCAvLyAzIG9mIDMgMjcwLWRlZ3JlZSByaW5nIEFvRXMsIEJhcmRhbSwgc2Vjb25kIGJvc3NcclxuICAgICdCYXJkYW0gVHJlbWJsb3IgMSc6ICcyNTdCJywgLy8gMSBvZiAyIGNvbmNlbnRyaWMgcmluZyBBb0VzLCBCYXJkYW0sIHNlY29uZCBib3NzXHJcbiAgICAnQmFyZGFtIFRyZW1ibG9yIDInOiAnMjU3QycsIC8vIDIgb2YgMiBjb25jZW50cmljIHJpbmcgQW9FcywgQmFyZGFtLCBzZWNvbmQgYm9zc1xyXG4gICAgJ0JhcmRhbSBUaHJvd2luZyBTcGVhcic6ICcyNTdGJywgLy8gQ2hlY2tlcmJvYXJkIEFvRSwgVGhyb3dpbmcgU3BlYXIsIHNlY29uZCBib3NzXHJcbiAgICAnQmFyZGFtIEJhcmRhbVxcJ3MgUmluZyc6ICcyNTgxJywgLy8gRG9udXQgQW9FIGhlYWRtYXJrZXJzLCBCYXJkYW0sIHNlY29uZCBib3NzXHJcbiAgICAnQmFyZGFtIENvbWV0JzogJzI1N0QnLCAvLyBUYXJnZXRlZCBjaXJjbGUgQW9FcywgQmFyZGFtLCBzZWNvbmQgYm9zc1xyXG4gICAgJ0JhcmRhbSBDb21ldCBJbXBhY3QnOiAnMjU4MCcsIC8vIENpcmNsZSBBb0VzLCBTdGFyIFNoYXJkLCBzZWNvbmQgYm9zc1xyXG4gICAgJ0JhcmRhbSBJcm9uIFNwaGVyZSBBdHRhY2snOiAnMTZCNicsIC8vIENvbnRhY3QgZGFtYWdlLCBJcm9uIFNwaGVyZSB0cmFzaCwgYmVmb3JlIHRoaXJkIGJvc3NcclxuICAgICdCYXJkYW0gVG9ybmFkbyc6ICcyNDdFJywgLy8gQ2lyY2xlIEFvRSwgS2h1biBTaGF2YXJhIHRyYXNoXHJcbiAgICAnQmFyZGFtIFBpbmlvbic6ICcxRjExJywgLy8gTGluZSBBb0UsIFlvbCBGZWF0aGVyLCB0aGlyZCBib3NzXHJcbiAgICAnQmFyZGFtIEZlYXRoZXIgU3F1YWxsJzogJzFGMEUnLCAvLyBEYXNoIGF0dGFjaywgWW9sLCB0aGlyZCBib3NzXHJcbiAgICAnQmFyZGFtIEZsdXR0ZXJmYWxsIFVudGFyZ2V0ZWQnOiAnMUYxMicsIC8vIFJvdGF0aW5nIGNpcmNsZSBBb0VzLCBZb2wsIHRoaXJkIGJvc3NcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0JhcmRhbSBHYXJ1bGEgUnVzaCc6ICcxRUY5JywgLy8gTGluZSBBb0UsIEdhcnVsYSwgZmlyc3QgYm9zcy5cclxuICAgICdCYXJkYW0gRmx1dHRlcmZhbGwgVGFyZ2V0ZWQnOiAnMUYwQycsIC8vIENpcmNsZSBBb0UgaGVhZG1hcmtlciwgWW9sLCB0aGlyZCBib3NzXHJcbiAgICAnQmFyZGFtIFdpbmdiZWF0JzogJzFGMEYnLCAvLyBDb25hbCBBb0UgaGVhZG1hcmtlciwgWW9sLCB0aGlyZCBib3NzXHJcbiAgfSxcclxuICBnYWluc0VmZmVjdFdhcm46IHtcclxuICAgICdCYXJkYW0gQ29uZnVzZWQnOiAnMEInLCAvLyBGYWlsZWQgZ2F6ZSBhdHRhY2ssIFlvbCwgdGhpcmQgYm9zc1xyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RGYWlsOiB7XHJcbiAgICAnQmFyZGFtIEZldHRlcnMnOiAnNTZGJywgLy8gRmFpbGluZyB0d28gbWVjaGFuaWNzIGluIGFueSBvbmUgcGhhc2Ugb24gQmFyZGFtLCBzZWNvbmQgYm9zcy5cclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICAvLyAxIG9mIDMgMjcwLWRlZ3JlZSByaW5nIEFvRXMsIEJhcmRhbSwgc2Vjb25kIGJvc3NcclxuICAgIGFiaWxpdHlXYXJuKHsgaWQ6ICdCYXJkYW0gSGVhdnkgU3RyaWtlIDEnLCBhYmlsaXR5SWQ6ICcyNTc4JyB9KSxcclxuICAgIC8vIDIgb2YgMyAyNzAtZGVncmVlIHJpbmcgQW9FcywgQmFyZGFtLCBzZWNvbmQgYm9zc1xyXG4gICAgYWJpbGl0eVdhcm4oeyBpZDogJ0JhcmRhbSBIZWF2eSBTdHJpa2UgMicsIGFiaWxpdHlJZDogJzI1NzknIH0pLFxyXG4gICAgLy8gMyBvZiAzIDI3MC1kZWdyZWUgcmluZyBBb0VzLCBCYXJkYW0sIHNlY29uZCBib3NzXHJcbiAgICBhYmlsaXR5V2Fybih7IGlkOiAnQmFyZGFtIEhlYXZ5IFN0cmlrZSAzJywgYWJpbGl0eUlkOiAnMjU3QScgfSksXHJcbiAgICAvLyAxIG9mIDIgY29uY2VudHJpYyByaW5nIEFvRXMsIEJhcmRhbSwgc2Vjb25kIGJvc3NcclxuICAgIGFiaWxpdHlXYXJuKHsgaWQ6ICdCYXJkYW0gVHJlbWJsb3IgMScsIGFiaWxpdHlJZDogJzI1N0InIH0pLFxyXG4gICAgLy8gMiBvZiAyIGNvbmNlbnRyaWMgcmluZyBBb0VzLCBCYXJkYW0sIHNlY29uZCBib3NzXHJcbiAgICBhYmlsaXR5V2Fybih7IGlkOiAnQmFyZGFtIFRyZW1ibG9yIDInLCBhYmlsaXR5SWQ6ICcyNTdDJyB9KSxcclxuICAgIC8vIENoZWNrZXJib2FyZCBBb0UsIFRocm93aW5nIFNwZWFyLCBzZWNvbmQgYm9zc1xyXG4gICAgYWJpbGl0eVdhcm4oeyBpZDogJ0JhcmRhbSBUaHJvd2luZyBTcGVhcicsIGFiaWxpdHlJZDogJzI1N0YnIH0pLFxyXG4gICAgLy8gR2F6ZSBhdHRhY2ssIFdhcnJpb3Igb2YgQmFyZGFtLCBzZWNvbmQgYm9zc1xyXG4gICAgYWJpbGl0eVdhcm4oeyBpZDogJ0JhcmRhbSBFbXB0eSBHYXplJywgYWJpbGl0eUlkOiAnMUYwNCcgfSksXHJcbiAgICAvLyBEb251dCBBb0UgaGVhZG1hcmtlcnMsIEJhcmRhbSwgc2Vjb25kIGJvc3NcclxuICAgIGFiaWxpdHlXYXJuKHsgaWQ6ICdCYXJkYW1cXCdzIFJpbmcnLCBhYmlsaXR5SWQ6ICcyNTgxJyB9KSxcclxuICAgIC8vIFRhcmdldGVkIGNpcmNsZSBBb0VzLCBCYXJkYW0sIHNlY29uZCBib3NzXHJcbiAgICBhYmlsaXR5V2Fybih7IGlkOiAnQmFyZGFtIENvbWV0JywgYWJpbGl0eUlkOiAnMjU3RCcgfSksXHJcbiAgICAvLyBDaXJjbGUgQW9FcywgU3RhciBTaGFyZCwgc2Vjb25kIGJvc3NcclxuICAgIGFiaWxpdHlXYXJuKHsgaWQ6ICdCYXJkYW0gQ29tZXQgSW1wYWN0JywgYWJpbGl0eUlkOiAnMjU4MCcgfSksXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5LdWdhbmVDYXN0bGUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0t1Z2FuZSBDYXN0bGUgVGVua2EgR29ra2VuJzogJzIzMjknLCAvLyBGcm9udGFsIGNvbmUgQW9FLCAgSm9pIEJsYWRlIHRyYXNoLCBiZWZvcmUgYm9zcyAxXHJcbiAgICAnS3VnYW5lIENhc3RsZSBLZW5raSBSZWxlYXNlIFRyYXNoJzogJzIzMzAnLCAvLyBDaGFyaW90IEFvRSwgSm9pIEtpeW9mdXNhIHRyYXNoLCBiZWZvcmUgYm9zcyAxXHJcblxyXG4gICAgJ0t1Z2FuZSBDYXN0bGUgQ2xlYXJvdXQnOiAnMUU5MicsIC8vIEZyb250YWwgY29uZSBBb0UsIFp1aWtvLU1hcnUsIGJvc3MgMVxyXG4gICAgJ0t1Z2FuZSBDYXN0bGUgSGFyYS1LaXJpIDEnOiAnMUU5NicsIC8vIEdpYW50IGNpcmNsZSBBb0UsIEhhcmFraXJpIEtvc2hvLCBib3NzIDFcclxuICAgICdLdWdhbmUgQ2FzdGxlIEhhcmEtS2lyaSAyJzogJzI0RjknLCAvLyBHaWFudCBjaXJjbGUgQW9FLCBIYXJha2lyaSBLb3NobywgYm9zcyAxXHJcblxyXG4gICAgJ0t1Z2FuZSBDYXN0bGUgSnVqaSBTaHVyaWtlbiAxJzogJzIzMkQnLCAvLyBMaW5lIEFvRSwgS2FyYWt1cmkgT25taXRzdSB0cmFzaCwgYmVmb3JlIGJvc3MgMlxyXG4gICAgJ0t1Z2FuZSBDYXN0bGUgMTAwMCBCYXJicyc6ICcyMTk4JywgLy8gTGluZSBBb0UsIEpvaSBLb2phIHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcblxyXG4gICAgJ0t1Z2FuZSBDYXN0bGUgSnVqaSBTaHVyaWtlbiAyJzogJzFFOTgnLCAvLyBMaW5lIEFvRSwgRG9qdW4gTWFydSwgYm9zcyAyXHJcbiAgICAnS3VnYW5lIENhc3RsZSBUYXRhbWktR2Flc2hpJzogJzFFOUQnLCAvLyBGbG9vciB0aWxlIGxpbmUgYXR0YWNrLCBFbGtpdGUgT25taXRzdSwgYm9zcyAyXHJcbiAgICAnS3VnYW5lIENhc3RsZSBKdWppIFNodXJpa2VuIDMnOiAnMUVBMCcsIC8vIExpbmUgQW9FLCBFbGl0ZSBPbm1pdHN1LCBib3NzIDJcclxuXHJcbiAgICAnS3VnYW5lIENhc3RsZSBBdXRvIENyb3NzYm93JzogJzIzMzMnLCAvLyBGcm9udGFsIGNvbmUgQW9FLCBLYXJha3VyaSBIYW55YSB0cmFzaCwgYWZ0ZXIgYm9zcyAyXHJcbiAgICAnS3VnYW5lIENhc3RsZSBIYXJha2lyaSAzJzogJzIzQzknLCAvLyBHaWFudCBDaXJjbGUgQW9FLCBIYXJha2lyaSAgSGFueWEgdHJhc2gsIGFmdGVyIGJvc3MgMlxyXG5cclxuICAgICdLdWdhbmUgQ2FzdGxlIElhaS1HaXJpJzogJzFFQTInLCAvLyBDaGFyaW90IEFvRSwgWW9qaW1ibywgYm9zcyAzXHJcbiAgICAnS3VnYW5lIENhc3RsZSBGcmFnaWxpdHknOiAnMUVBQScsIC8vIENoYXJpb3QgQW9FLCBJbm9zaGlrYWNobywgYm9zcyAzXHJcbiAgICAnS3VnYW5lIENhc3RsZSBEcmFnb25maXJlJzogJzFFQUInLCAvLyBMaW5lIEFvRSwgRHJhZ29uIEhlYWQsIGJvc3MgM1xyXG4gIH0sXHJcblxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0t1Z2FuZSBDYXN0bGUgSXNzZW4nOiAnMUU5NycsIC8vIEluc3RhbnQgZnJvbnRhbCBjbGVhdmUsIERvanVuIE1hcnUsIGJvc3MgMlxyXG4gICAgJ0t1Z2FuZSBDYXN0bGUgQ2xvY2t3b3JrIFJhaXRvbic6ICcxRTlCJywgLy8gTGFyZ2UgbGlnaHRuaW5nIHNwcmVhZCBjaXJjbGVzLCBEb2p1biBNYXJ1LCBib3NzIDJcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIFN0YWNrIG1hcmtlciwgWnVpa28gTWFydSwgYm9zcyAxXHJcbiAgICAgIGlkOiAnS3VnYW5lIENhc3RsZSBIZWxtIENyYWNrJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMUU5NCcgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKF9kYXRhLCBtYXRjaGVzKSA9PiBtYXRjaGVzLnR5cGUgPT09ICcyMScsIC8vIFRha2luZyB0aGUgc3RhY2sgc29sbyBpcyAqcHJvYmFibHkqIGEgbWlzdGFrZS5cclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIGJsYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgZW46IGAke21hdGNoZXMuYWJpbGl0eX0gKGFsb25lKWAsXHJcbiAgICAgICAgICAgIGRlOiBgJHttYXRjaGVzLmFiaWxpdHl9IChhbGxlaW4pYCxcclxuICAgICAgICAgICAgZnI6IGAke21hdGNoZXMuYWJpbGl0eX0gKHNldWwoZSkpYCxcclxuICAgICAgICAgICAgamE6IGAke21hdGNoZXMuYWJpbGl0eX0gKOS4gOS6uilgLFxyXG4gICAgICAgICAgICBjbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5Y2V5ZCDKWAsXHJcbiAgICAgICAgICAgIGtvOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjtmLzsnpAg66ee7J2MKWAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlNhaW50TW9jaWFubmVzQXJib3JldHVtSGFyZCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBNdWRzdHJlYW0nOiAnMzBEOScsIC8vIFRhcmdldGVkIGNpcmNsZSBBb0UsIEltbWFjdWxhdGUgQXBhIHRyYXNoLCBiZWZvcmUgYm9zcyAxXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBTaWxrZW4gU3ByYXknOiAnMzM4NScsIC8vIFJlYXIgY29uZSBBb0UsIFdpdGhlcmVkIEJlbGxhZG9ubmEgdHJhc2gsIGJlZm9yZSBib3NzIDFcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIE11ZGR5IFB1ZGRsZXMnOiAnMzBEQScsIC8vIFNtYWxsIHRhcmdldGVkIGNpcmNsZSBBb0VzLCBEb3Jwb2trdXIgdHJhc2gsIGJlZm9yZSBib3NzIDFcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIE9kaW91cyBBaXInOiAnMkU0OScsIC8vIEZyb250YWwgY29uZSBBb0UsIE51bGxjaHUsIGJvc3MgMVxyXG4gICAgJ1N0IE1vY2lhbm5lIEhhcmQgU0x1ZGdlIEJvbWInOiAnMkU0RScsIC8vIFRhcmdldGVkIGNpcmNsZSBBb0VzLCBOdWxsY2h1LCBib3NzIDFcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIE9kaW91cyBBdG1vc3BoZXJlJzogJzJFNTEnLCAvLyBDaGFubmVsZWQgMy80IGFyZW5hIGNsZWF2ZSwgTnVsbGNodSwgYm9zcyAxXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBDcmVlcGluZyBJdnknOiAnMzFBNScsIC8vIEZyb250YWwgY29uZSBBb0UsIFdpdGhlcmVkIEt1bGFrIHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBSb2Nrc2xpZGUnOiAnMzEzNCcsIC8vIExpbmUgQW9FLCBTaWx0IEdvbGVtLCBib3NzIDJcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIEVhcnRocXVha2UgSW5uZXInOiAnMzEyRScsIC8vIENoYXJpb3QgQW9FLCBMYWtoYW11LCBib3NzIDJcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIEVhcnRocXVha2UgT3V0ZXInOiAnMzEyRicsIC8vIER5bmFtbyBBb0UsIExha2hhbXUsIGJvc3MgMlxyXG4gICAgJ1N0IE1vY2lhbm5lIEhhcmQgRW1iYWxtaW5nIEVhcnRoJzogJzMxQTYnLCAvLyBMYXJnZSBDaGFyaW90IEFvRSwgTXVkZHkgTWF0YSwgYWZ0ZXIgYm9zcyAyXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBRdWlja21pcmUnOiAnMzEzNicsIC8vIFNld2FnZSBzdXJnZSBhdm9pZGVkIG9uIHBsYXRmb3JtcywgVG9ra2FwY2hpLCBib3NzIDNcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIFF1YWdtaXJlIFBsYXRmb3Jtcyc6ICczMTM5JywgLy8gUXVhZ21pcmUgZXhwbG9zaW9uIG9uIHBsYXRmb3JtcywgVG9ra2FwY2hpLCBib3NzIDNcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIEZlY3VsZW50IEZsb29kJzogJzMxM0MnLCAvLyBUYXJnZXRlZCB0aGluIGNvbmUgQW9FLCBUb2trYXBjaGksIGJvc3MgM1xyXG4gICAgJ1N0IE1vY2lhbm5lIEhhcmQgQ29ycnVwdHVyZSc6ICczM0EwJywgLy8gTXVkIFNsaW1lIGV4cGxvc2lvbiwgYm9zcyAzLiAoTm8gZXhwbG9zaW9uIGlmIGRvbmUgY29ycmVjdGx5LilcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1N0IE1vY2lhbm5lIEhhcmQgVGFwcm9vdCc6ICcyRTRDJywgLy8gTGFyZ2Ugb3JhbmdlIHNwcmVhZCBjaXJjbGVzLCBOdWxsY2h1LCBib3NzIDFcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIEVhcnRoIFNoYWtlcic6ICczMTMxJywgLy8gRWFydGggU2hha2VyLCBMYWtoYW11LCBib3NzIDJcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ1N0IE1vY2lhbm5lIEhhcmQgU2VkdWNlZCc6ICczREYnLCAvLyBHYXplIGZhaWx1cmUsIFdpdGhlcmVkIEJlbGxhZG9ubmEgdHJhc2gsIGJlZm9yZSBib3NzIDFcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIFBvbGxlbic6ICcxMycsIC8vIFNsdWRnZSBwdWRkbGVzLCBOdWxsY2h1LCBib3NzIDFcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIFRyYW5zZmlndXJhdGlvbic6ICc2NDgnLCAvLyBSb2x5LVBvbHkgQW9FIGNpcmNsZSBmYWlsdXJlLCBCTG9vbWluZyBCaWxva28gdHJhc2gsIGJlZm9yZSBib3NzIDJcclxuICAgICdTdCBNb2NpYW5uZSBIYXJkIEh5c3RlcmlhJzogJzEyOCcsIC8vIEdhemUgZmFpbHVyZSwgTGFraGFtdSwgYm9zcyAyXHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBTdGFiIFdvdW5kJzogJzQ1RCcsIC8vIEFyZW5hIG91dGVyIHdhbGwgZWZmZWN0LCBib3NzIDJcclxuICB9LFxyXG4gIHNvbG9GYWlsOiB7XHJcbiAgICAnU3QgTW9jaWFubmUgSGFyZCBGYXVsdCBXYXJyZW4nOiAnMkU0QScsIC8vIFN0YWNrIG1hcmtlciwgTnVsbGNodSwgYm9zcyAxXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVTd2FsbG93c0NvbXBhc3MsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgSXZ5IEZldHRlcnMnOiAnMkMwNCcsIC8vIENpcmNsZSBncm91bmQgQW9FLCBTYWkgVGFpc3VpIHRyYXNoLCBiZWZvcmUgYm9zcyAxXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBXaWxkc3dpbmQgMSc6ICcyQzA1JywgLy8gVG9ybmFkbyBncm91bmQgQW9FLCBwbGFjZWQgYnkgU2FpIFRhaXN1aSB0cmFzaCwgYmVmb3JlIGJvc3MgMVxyXG5cclxuICAgICdTd2FsbG93cyBDb21wYXNzIFlhbWEtS2FndXJhJzogJzJCOTYnLCAvLyBGcm9udGFsIGxpbmUgQW9FLCBPdGVuZ3UsIGJvc3MgMVxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgRmxhbWVzIE9mIEhhdGUnOiAnMkI5OCcsIC8vIEZpcmUgb3JiIGV4cGxvc2lvbnMsIGJvc3MgMVxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgQ29uZmxhZ3JhdGUnOiAnMkI5OScsIC8vIENvbGxpc2lvbiB3aXRoIGZpcmUgb3JiLCBib3NzIDFcclxuXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBVcHdlbGwnOiAnMkMwNicsIC8vIFRhcmdldGVkIGNpcmNsZSBncm91bmQgQW9FLCBTYWkgVGFpc3VpIHRyYXNoLCBiZWZvcmUgYm9zcyAyXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBCYWQgQnJlYXRoJzogJzJDMDcnLCAvLyBGcm9udGFsIGNsZWF2ZSwgSmlubWVuanUgdHJhc2gsIGJlZm9yZSBib3NzIDJcclxuXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBHcmVhdGVyIFBhbG0gMSc6ICcyQjlEJywgLy8gSGFsZiBhcmVuYSByaWdodCBjbGVhdmUsIERhaWRhcmFib3RjaGksIGJvc3MgMlxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgR3JlYXRlciBQYWxtIDInOiAnMkI5RScsIC8vIEhhbGYgYXJlbmEgbGVmdCBjbGVhdmUsIERhaWRhcmFib3RjaGksIGJvc3MgMlxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgVHJpYnV0YXJ5JzogJzJCQTAnLCAvLyBUYXJnZXRlZCB0aGluIGNvbmFsIGdyb3VuZCBBb0VzLCBEYWlkYXJhYm90Y2hpLCBib3NzIDJcclxuXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBXaWxkc3dpbmQgMic6ICcyQzA2JywgLy8gQ2lyY2xlIGdyb3VuZCBBb0UsIGVudmlyb25tZW50LCBhZnRlciBib3NzIDJcclxuICAgICdTd2FsbG93cyBDb21wYXNzIFdpbGRzd2luZCAzJzogJzJDMDcnLCAvLyBDaXJjbGUgZ3JvdW5kIEFvRSwgcGxhY2VkIGJ5IFNhaSBUYWlzdWkgdHJhc2gsIGFmdGVyIGJvc3MgMlxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgRmlsb3BsdW1lcyc6ICcyQzc2JywgLy8gRnJvbnRhbCByZWN0YW5nbGUgQW9FLCBEcmFnb24gQmkgRmFuZyB0cmFzaCwgYWZ0ZXIgYm9zcyAyXHJcblxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgQm90aCBFbmRzIDEnOiAnMkJBOCcsIC8vIENoYXJpb3QgQW9FLCBRaXRpYW4gRGFzaGVuZywgYm9zcyAzXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBCb3RoIEVuZHMgMic6ICcyQkE5JywgLy8gRHluYW1vIEFvRSwgUWl0aWFuIERhc2hlbmcsIGJvc3MgM1xyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgQm90aCBFbmRzIDMnOiAnMkJBRScsIC8vIENoYXJpb3QgQW9FLCBTaGFkb3cgT2YgVGhlIFNhZ2UsIGJvc3MgM1xyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgQm90aCBFbmRzIDQnOiAnMkJBRicsIC8vIER5bmFtbyBBb0UsIFNoYWRvdyBPZiBUaGUgU2FnZSwgYm9zcyAzXHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBFcXVhbCBPZiBIZWF2ZW4nOiAnMkJCNCcsIC8vIFNtYWxsIGNpcmNsZSBncm91bmQgQW9FcywgUWl0aWFuIERhc2hlbmcsIGJvc3MgM1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBNaXJhZ2UnOiAnMkJBMicsIC8vIFByZXktY2hhc2luZyBwdWRkbGVzLCBEYWlkYXJhYm90Y2hpLCBib3NzIDJcclxuICAgICdTd2FsbG93cyBDb21wYXNzIE1vdW50YWluIEZhbGxzJzogJzJCQTUnLCAvLyBDaXJjbGUgc3ByZWFkIG1hcmtlcnMsIERhaWRhcmFib3RjaGksIGJvc3MgMlxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgVGhlIExvbmcgRW5kJzogJzJCQTcnLCAvLyBMYXNlciB0ZXRoZXIsIFFpdGlhbiBEYXNoZW5nICBib3NzIDNcclxuICAgICdTd2FsbG93cyBDb21wYXNzIFRoZSBMb25nIEVuZCAyJzogJzJCQUQnLCAvLyBMYXNlciBUZXRoZXIsIFNoYWRvd3MgT2YgVGhlIFNhZ2UsIGJvc3MgM1xyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnU3dhbGxvd3MgQ29tcGFzcyBIeXN0ZXJpYSc6ICcxMjgnLCAvLyBHYXplIGF0dGFjayBmYWlsdXJlLCBPdGVuZ3UsIGJvc3MgMVxyXG4gICAgJ1N3YWxsb3dzIENvbXBhc3MgQmxlZWRpbmcnOiAnMTEyRicsIC8vIFN0ZXBwaW5nIG91dHNpZGUgdGhlIGFyZW5hLCBib3NzIDNcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIFN0YW5kaW5nIGluIHRoZSBsYWtlLCBEaWFkYXJhYm90Y2hpLCBib3NzIDJcclxuICAgICAgaWQ6ICdTd2FsbG93cyBDb21wYXNzIFNpeCBGdWxtcyBVbmRlcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcyMzcnIH0pLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiBtYXRjaGVzLmVmZmVjdCxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gU3RhY2sgbWFya2VyLCBib3NzIDNcclxuICAgICAgaWQ6ICdTd2FsbG93cyBDb21wYXNzIEZpdmUgRmluZ2VyZWQgUHVuaXNobWVudCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogWycyQkFCJywgJzJCQjAnXSwgc291cmNlOiBbJ1FpdGlhbiBEYXNoZW5nJywgJ1NoYWRvdyBPZiBUaGUgU2FnZSddIH0pLFxyXG4gICAgICBjb25kaXRpb246IChfZGF0YSwgbWF0Y2hlcykgPT4gbWF0Y2hlcy50eXBlID09PSAnMjEnLCAvLyBUYWtpbmcgdGhlIHN0YWNrIHNvbG8gaXMgKnByb2JhYmx5KiBhIG1pc3Rha2UuXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiBgJHttYXRjaGVzLmFiaWxpdHl9IChhbG9uZSlgLFxyXG4gICAgICAgICAgICBkZTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoYWxsZWluKWAsXHJcbiAgICAgICAgICAgIGZyOiBgJHttYXRjaGVzLmFiaWxpdHl9IChzZXVsKGUpKWAsXHJcbiAgICAgICAgICAgIGphOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjkuIDkuropYCxcclxuICAgICAgICAgICAgY246IGAke21hdGNoZXMuYWJpbGl0eX0gKOWNleWQgylgLFxyXG4gICAgICAgICAgICBrbzogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo7Zi87J6QIOunnuydjClgLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVUZW1wbGVPZlRoZUZpc3QsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1RlbXBsZSBGaXJlIEJyZWFrJzogJzIxRUQnLCAvLyBDb25hbCBBb0UsIEJsb29kZ2xpZGVyIE1vbmsgdHJhc2hcclxuICAgICdUZW1wbGUgUmFkaWFsIEJsYXN0ZXInOiAnMUZEMycsIC8vIENpcmNsZSBBb0UsIGJvc3MgMVxyXG4gICAgJ1RlbXBsZSBXaWRlIEJsYXN0ZXInOiAnMUZENCcsIC8vIENvbmFsIEFvRSwgYm9zcyAxXHJcbiAgICAnVGVtcGxlIENyaXBwbGluZyBCbG93JzogJzIwMTYnLCAvLyBMaW5lIEFvRXMsIGVudmlyb25tZW50YWwsIGJlZm9yZSBib3NzIDJcclxuICAgICdUZW1wbGUgQnJva2VuIEVhcnRoJzogJzIzNkUnLCAvLyBDaXJjbGUgQW9FLCBTaW5naGEgdHJhc2hcclxuICAgICdUZW1wbGUgU2hlYXInOiAnMUZERCcsIC8vIER1YWwgY29uYWwgQW9FLCBib3NzIDJcclxuICAgICdUZW1wbGUgQ291bnRlciBQYXJyeSc6ICcxRkUwJywgLy8gUmV0YWxpYXRpb24gZm9yIGluY29ycmVjdCBkaXJlY3Rpb24gYWZ0ZXIgS2lsbGVyIEluc3RpbmN0LCBib3NzIDJcclxuICAgICdUZW1wbGUgVGFwYXMnOiAnJywgLy8gVHJhY2tpbmcgY2lyY3VsYXIgZ3JvdW5kIEFvRXMsIGJvc3MgMlxyXG4gICAgJ1RlbXBsZSBIZWxsc2VhbCc6ICcyMDBGJywgLy8gUmVkL0JsdWUgc3ltYm9sIGZhaWx1cmUsIGJvc3MgMlxyXG4gICAgJ1RlbXBsZSBQdXJlIFdpbGwnOiAnMjAxNycsIC8vIENpcmNsZSBBb0UsIFNwaXJpdCBGbGFtZSB0cmFzaCwgYmVmb3JlIGJvc3MgM1xyXG4gICAgJ1RlbXBsZSBNZWdhYmxhc3Rlcic6ICcxNjMnLCAvLyBDb25hbCBBb0UsIENvZXVybCBQcmFuYSB0cmFzaCwgYmVmb3JlIGJvc3MgM1xyXG4gICAgJ1RlbXBsZSBXaW5kYnVybic6ICcxRkU4JywgLy8gQ2lyY2xlIEFvRSwgVHdpc3RlciB3aW5kLCBib3NzIDNcclxuICAgICdUZW1wbGUgSHVycmljYW5lIEtpY2snOiAnMUZFNScsIC8vIDI3MC1kZWdyZWUgZnJvbnRhbCBBb0UsIGJvc3MgM1xyXG4gICAgJ1RlbXBsZSBTaWxlbnQgUm9hcic6ICcxRkVCJywgLy8gRnJvbnRhbCBsaW5lIEFvRSwgYm9zcyAzXHJcbiAgICAnVGVtcGxlIE1pZ2h0eSBCbG93JzogJzFGRUEnLCAvLyBDb250YWN0IHdpdGggY29ldXJsIGhlYWQsIGJvc3MgM1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnVGVtcGxlIEhlYXQgTGlnaHRuaW5nJzogJzFGRDcnLCAvLyBQdXJwbGUgc3ByZWFkIGNpcmNsZXMsIGJvc3MgMVxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUJ1cm4sXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1RoZSBCdXJuIEZhbGxpbmcgUm9jayc6ICczMUEzJywgLy8gRW52aXJvbm1lbnRhbCBsaW5lIEFvRVxyXG4gICAgJ1RoZSBCdXJuIEFldGhlcmlhbCBCbGFzdCc6ICczMjhCJywgLy8gTGluZSBBb0UsIEt1a3Vsa2FuIHRyYXNoXHJcbiAgICAnVGhlIEJ1cm4gTW9sZS1hLXdoYWNrJzogJzMyOEQnLCAvLyBDaXJjbGUgQW9FLCBEZXNlcnQgRGVzbWFuIHRyYXNoXHJcbiAgICAnVGhlIEJ1cm4gSGVhZCBCdXR0JzogJzMyOEUnLCAvLyBTbWFsbCBjb25hbCBBb0UsIERlc2VydCBEZXNtYW4gdHJhc2hcclxuICAgICdUaGUgQnVybiBTaGFyZGZhbGwnOiAnMzE5MScsIC8vIFJvb213aWRlIEFvRSwgTG9TIGZvciBzYWZldHksIEhlZGV0ZXQsIGJvc3MgMVxyXG4gICAgJ1RoZSBCdXJuIERpc3NvbmFuY2UnOiAnMzE5MicsIC8vIERvbnV0IEFvRSwgSGVkZXRldCwgYm9zcyAxXHJcbiAgICAnVGhlIEJ1cm4gQ3J5c3RhbGxpbmUgRnJhY3R1cmUnOiAnMzE5NycsIC8vIENpcmNsZSBBb0UsIERpbSBDcnlzdGFsLCBib3NzIDFcclxuICAgICdUaGUgQnVybiBSZXNvbmFudCBGcmVxdWVuY3knOiAnMzE5OCcsIC8vIENpcmNsZSBBb0UsIERpbSBDcnlzdGFsLCBib3NzIDFcclxuICAgICdUaGUgQnVybiBSb3Rvc3dpcGUnOiAnMzI5MScsIC8vIEZyb250YWwgY29uZSBBb0UsIENoYXJyZWQgRHJlYWRuYXVnaHQgdHJhc2hcclxuICAgICdUaGUgQnVybiBXcmVja2luZyBCYWxsJzogJzMyOTInLCAvLyBDaXJjbGUgQW9FLCBDaGFycmVkIERyZWFkbmF1Z2h0IHRyYXNoXHJcbiAgICAnVGhlIEJ1cm4gU2hhdHRlcic6ICczMjk0JywgLy8gTGFyZ2UgY2lyY2xlIEFvRSwgQ2hhcnJlZCBEb2JseW4gdHJhc2hcclxuICAgICdUaGUgQnVybiBBdXRvLUNhbm5vbnMnOiAnMzI5NScsIC8vIExpbmUgQW9FLCBDaGFycmVkIERyb25lIHRyYXNoXHJcbiAgICAnVGhlIEJ1cm4gU2VsZi1EZXRvbmF0ZSc6ICczMjk2JywgLy8gQ2lyY2xlIEFvRSwgQ2hhcnJlZCBEcm9uZSB0cmFzaFxyXG4gICAgJ1RoZSBCdXJuIEZ1bGwgVGhyb3R0bGUnOiAnMkQ3NScsIC8vIExpbmUgQW9FLCBEZWZlY3RpdmUgRHJvbmUsIGJvc3MgMlxyXG4gICAgJ1RoZSBCdXJuIFRocm90dGxlJzogJzJENzYnLCAvLyBMaW5lIEFvRSwgTWluaW5nIERyb25lIGFkZHMsIGJvc3MgMlxyXG4gICAgJ1RoZSBCdXJuIEFkaXQgRHJpdmVyJzogJzJENzgnLCAvLyBMaW5lIEFvRSwgUm9jayBCaXRlciBhZGRzLCBib3NzIDJcclxuICAgICdUaGUgQnVybiBUcmVtYmxvcic6ICczMjk3JywgLy8gTGFyZ2UgY2lyY2xlIEFvRSwgVmVpbGVkIEdpZ2F3b3JtIHRyYXNoXHJcbiAgICAnVGhlIEJ1cm4gRGVzZXJ0IFNwaWNlJzogJzMyOTgnLCAvLyBUaGUgZnJvbnRhbCBjbGVhdmVzIG11c3QgZmxvd1xyXG4gICAgJ1RoZSBCdXJuIFRveGljIFNwcmF5JzogJzMyOUEnLCAvLyBGcm9udGFsIGNvbmUgQW9FLCBHaWdhd29ybSBTdGFsa2VyIHRyYXNoXHJcbiAgICAnVGhlIEJ1cm4gVmVub20gU3ByYXknOiAnMzI5QicsIC8vIFRhcmdldGVkIGNpcmNsZSBBb0UsIEdpZ2F3b3JtIFN0YWxrZXIgdHJhc2hcclxuICAgICdUaGUgQnVybiBXaGl0ZSBEZWF0aCc6ICczMTQzJywgLy8gUmVhY3RpdmUgZHVyaW5nIGludnVsbmVyYWJpbGl0eSwgTWlzdCBEcmFnb24sIGJvc3MgM1xyXG4gICAgJ1RoZSBCdXJuIEZvZyBQbHVtZSAxJzogJzMxNDUnLCAvLyBTdGFyIEFvRSwgTWlzdCBEcmFnb24sIGJvc3MgM1xyXG4gICAgJ1RoZSBCdXJuIEZvZyBQbHVtZSAyJzogJzMxNDYnLCAvLyBMaW5lIEFvRXMgYWZ0ZXIgc3RhcnMsIE1pc3QgRHJhZ29uLCBib3NzIDNcclxuICAgICdUaGUgQnVybiBDYXV0ZXJpemUnOiAnMzE0OCcsIC8vIExpbmUvU3dvb3AgQW9FLCBNaXN0IERyYWdvbiwgYm9zcyAzXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnVGhlIEJ1cm4gQ29sZCBGb2cnOiAnMzE0MicsIC8vIEdyb3dpbmcgY2lyY2xlIEFvRSwgTWlzdCBEcmFnb24sIGJvc3MgM1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnVGhlIEJ1cm4gSGFpbGZpcmUnOiAnMzE5NCcsIC8vIEhlYWQgbWFya2VyIGxpbmUgQW9FLCBIZWRldGV0LCBib3NzIDFcclxuICAgICdUaGUgQnVybiBTaGFyZHN0cmlrZSc6ICczMTk1JywgLy8gT3JhbmdlIHNwcmVhZCBoZWFkIG1hcmtlcnMsIEhlZGV0ZXQsIGJvc3MgMVxyXG4gICAgJ1RoZSBCdXJuIENoaWxsaW5nIEFzcGlyYXRpb24nOiAnMzE0RCcsIC8vIEhlYWQgbWFya2VyIGNsZWF2ZSwgTWlzdCBEcmFnb24sIGJvc3MgM1xyXG4gICAgJ1RoZSBCdXJuIEZyb3N0IEJyZWF0aCc6ICczMTRDJywgLy8gVGFuayBjbGVhdmUsIE1pc3QgRHJhZ29uLCBib3NzIDNcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ1RoZSBCdXJuIExlYWRlbic6ICc0MycsIC8vIFB1ZGRsZSBlZmZlY3QsIGJvc3MgMi4gKEFsc28gaW5mbGljdHMgMTFGLCBTbHVkZ2UuKVxyXG4gICAgJ1RoZSBCdXJuIFB1ZGRsZSBGcm9zdGJpdGUnOiAnMTFEJywgLy8gSWNlIHB1ZGRsZSBlZmZlY3QsIGJvc3MgMy4gKE5PVCB0aGUgY29uYWwtaW5mbGljdGVkIG9uZSwgMTBDLilcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIE8xTiAtIERlbHRhc2NhcGUgMS4wIE5vcm1hbFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRGVsdGFzY2FwZVYxMCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnTzFOIEJ1cm4nOiAnMjNENScsIC8vIEZpcmViYWxsIGV4cGxvc2lvbiBjaXJjbGUgQW9Fc1xyXG4gICAgJ08xTiBDbGFtcCc6ICcyM0UyJywgLy8gRnJvbnRhbCByZWN0YW5nbGUga25vY2tiYWNrIEFvRSwgQWx0ZSBSb2l0ZVxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnTzFOIExldmluYm9sdCc6ICcyM0RBJywgLy8gc21hbGwgc3ByZWFkIGNpcmNsZXNcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzIH0gZnJvbSAnLi4vLi4vLi4vb29wc3lfY29tbW9uJztcclxuXHJcbi8vIE8yTiAtIERlbHRhc2NhcGUgMi4wIE5vcm1hbFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRGVsdGFzY2FwZVYyMCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnTzJOIE1haW4gUXVha2UnOiAnMjRBNScsIC8vIE5vbi10ZWxlZ3JhcGhlZCBjaXJjbGUgQW9FLCBGbGVzaHkgTWVtYmVyXHJcbiAgICAnTzJOIEVyb3Npb24nOiAnMjU5MCcsIC8vIFNtYWxsIGNpcmNsZSBBb0VzLCBGbGVzaHkgTWVtYmVyXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdPMk4gUGFyYW5vcm1hbCBXYXZlJzogJzI1MEUnLCAvLyBJbnN0YW50IHRhbmsgY2xlYXZlXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBXZSBjb3VsZCB0cnkgdG8gc2VwYXJhdGUgb3V0IHRoZSBtaXN0YWtlIHRoYXQgbGVkIHRvIHRoZSBwbGF5ZXIgYmVpbmcgcGV0cmlmaWVkLlxyXG4gICAgICAvLyBIb3dldmVyLCBpdCdzIE5vcm1hbCBtb2RlLCB3aHkgb3ZlcnRoaW5rIGl0P1xyXG4gICAgICBpZDogJ08yTiBQZXRyaWZpY2F0aW9uJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzI2MicgfSksXHJcbiAgICAgIC8vIFRoZSB1c2VyIG1pZ2h0IGdldCBoaXQgYnkgYW5vdGhlciBwZXRyaWZ5aW5nIGFiaWxpdHkgYmVmb3JlIHRoZSBlZmZlY3QgZW5kcy5cclxuICAgICAgLy8gVGhlcmUncyBubyBwb2ludCBpbiBub3RpZnlpbmcgZm9yIHRoYXQuXHJcbiAgICAgIHN1cHByZXNzU2Vjb25kczogMTAsXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdPMk4gRWFydGhxdWFrZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICcyNTE1JywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICAvLyBUaGlzIGRlYWxzIGRhbWFnZSBvbmx5IHRvIG5vbi1mbG9hdGluZyB0YXJnZXRzLlxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLkRhbWFnZUZyb21NYXRjaGVzKG1hdGNoZXMpID4gMCxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gTzNOIC0gRGVsdGFzY2FwZSAzLjAgTm9ybWFsXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5EZWx0YXNjYXBlVjMwLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdPM04gU3BlbGxibGFkZSBGaXJlIElJSSc6ICcyNDYwJywgLy8gRG9udXQgQW9FLCBIYWxpY2FybmFzc3VzXHJcbiAgICAnTzNOIFNwZWxsYmxhZGUgQmxpenphcmQgSUlJJzogJzI0NjEnLCAvLyBDaXJjbGUgQW9FLCBIYWxpY2FybmFzc3VzXHJcbiAgICAnTzNOIFNwZWxsYmxhZGUgVGh1bmRlciBJSUknOiAnMjQ2MicsIC8vIExpbmUgQW9FLCBIYWxpY2FybmFzc3VzXHJcbiAgICAnTzNOIENyb3NzIFJlYXBlcic6ICcyNDZCJywgLy8gQ2lyY2xlIEFvRSwgU291bCBSZWFwZXJcclxuICAgICdPM04gR3VzdGluZyBHb3VnZSc6ICcyNDZDJywgLy8gR3JlZW4gbGluZSBBb0UsIFNvdWwgUmVhcGVyXHJcbiAgICAnTzNOIFN3b3JkIERhbmNlJzogJzI0NzAnLCAvLyBUYXJnZXRlZCB0aGluIGNvbmUgQW9FLCBIYWxpY2FybmFzc3VzXHJcbiAgICAnTzNOIFVwbGlmdCc6ICcyNDczJywgLy8gR3JvdW5kIHNwZWFycywgUXVlZW4ncyBXYWx0eiBlZmZlY3QsIEhhbGljYXJuYXNzdXNcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdPM04gVWx0aW11bSc6ICcyNDc3JywgLy8gSW5zdGFudCBraWxsLiBVc2VkIGlmIHRoZSBwbGF5ZXIgZG9lcyBub3QgZXhpdCB0aGUgc2FuZCBtYXplIGZhc3QgZW5vdWdoLlxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnTzNOIEhvbHkgQmx1cic6IDI0NjMsIC8vIFNwcmVhZCBjaXJjbGVzLlxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdPM04gUGhhc2UgVHJhY2tlcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLnN0YXJ0c1VzaW5nKHsgaWQ6ICcyMzA0Jywgc291cmNlOiAnSGFsaWNhcm5hc3N1cycsIGNhcHR1cmU6IGZhbHNlIH0pLFxyXG4gICAgICBuZXRSZWdleERlOiBOZXRSZWdleGVzLnN0YXJ0c1VzaW5nKHsgaWQ6ICcyMzA0Jywgc291cmNlOiAnSGFsaWthcm5hc3NvcycsIGNhcHR1cmU6IGZhbHNlIH0pLFxyXG4gICAgICBuZXRSZWdleEZyOiBOZXRSZWdleGVzLnN0YXJ0c1VzaW5nKHsgaWQ6ICcyMzA0Jywgc291cmNlOiAnSGFsaWNhcm5hc3NlJywgY2FwdHVyZTogZmFsc2UgfSksXHJcbiAgICAgIG5ldFJlZ2V4SmE6IE5ldFJlZ2V4ZXMuc3RhcnRzVXNpbmcoeyBpZDogJzIzMDQnLCBzb3VyY2U6ICfjg4/jg6rjgqvjg6vjg4rjg4Pjgr3jgrknLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgbmV0UmVnZXhDbjogTmV0UmVnZXhlcy5zdGFydHNVc2luZyh7IGlkOiAnMjMwNCcsIHNvdXJjZTogJ+WTiOWIqeWNoee6s+iLj+aWrycsIGNhcHR1cmU6IGZhbHNlIH0pLFxyXG4gICAgICBuZXRSZWdleEtvOiBOZXRSZWdleGVzLnN0YXJ0c1VzaW5nKHsgaWQ6ICcyMzA0Jywgc291cmNlOiAn7ZWg66as7Lm066W064KY7IaM7IqkJywgY2FwdHVyZTogZmFsc2UgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEpID0+IHtcclxuICAgICAgICBkYXRhLnBoYXNlTnVtYmVyICs9IDE7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBUaGVyZSdzIGEgbG90IHRvIHRyYWNrLCBhbmQgaW4gb3JkZXIgdG8gbWFrZSBpdCBhbGwgY2xlYW4sIGl0J3Mgc2FmZXN0IGp1c3QgdG9cclxuICAgICAgLy8gaW5pdGlhbGl6ZSBpdCBhbGwgdXAgZnJvbnQgaW5zdGVhZCBvZiB0cnlpbmcgdG8gZ3VhcmQgYWdhaW5zdCB1bmRlZmluZWQgY29tcGFyaXNvbnMuXHJcbiAgICAgIGlkOiAnTzNOIEluaXRpYWxpemluZycsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzM2NycsIHNvdXJjZTogJ0hhbGljYXJuYXNzdXMnLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgbmV0UmVnZXhEZTogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICczNjcnLCBzb3VyY2U6ICdIYWxpa2FybmFzc29zJywgY2FwdHVyZTogZmFsc2UgfSksXHJcbiAgICAgIG5ldFJlZ2V4RnI6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMzY3Jywgc291cmNlOiAnSGFsaWNhcm5hc3NlJywgY2FwdHVyZTogZmFsc2UgfSksXHJcbiAgICAgIG5ldFJlZ2V4SmE6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMzY3Jywgc291cmNlOiAn44OP44Oq44Kr44Or44OK44OD44K944K5JywgY2FwdHVyZTogZmFsc2UgfSksXHJcbiAgICAgIG5ldFJlZ2V4Q246IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMzY3Jywgc291cmNlOiAn5ZOI5Yip5Y2h57qz6IuP5pavJywgY2FwdHVyZTogZmFsc2UgfSksXHJcbiAgICAgIG5ldFJlZ2V4S286IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMzY3Jywgc291cmNlOiAn7ZWg66as7Lm066W064KY7IaM7IqkJywgY2FwdHVyZTogZmFsc2UgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKGRhdGEpID0+ICFkYXRhLmluaXRpYWxpemVkLFxyXG4gICAgICBydW46IChkYXRhKSA9PiB7XHJcbiAgICAgICAgZGF0YS5nYW1lQ291bnQgPSAwO1xyXG4gICAgICAgIC8vIEluZGV4aW5nIHBoYXNlcyBhdCAxIHNvIGFzIHRvIG1ha2UgcGhhc2VzIG1hdGNoIHdoYXQgaHVtYW5zIGV4cGVjdC5cclxuICAgICAgICAvLyAxOiBXZSBzdGFydCBoZXJlLlxyXG4gICAgICAgIC8vIDI6IENhdmUgcGhhc2Ugd2l0aCBVcGxpZnRzLlxyXG4gICAgICAgIC8vIDM6IFBvc3QtaW50ZXJtaXNzaW9uLCB3aXRoIGdvb2QgYW5kIGJhZCBmcm9ncy5cclxuICAgICAgICBkYXRhLnBoYXNlTnVtYmVyID0gMTtcclxuICAgICAgICBkYXRhLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzNOIFJpYmJpdCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzI0NjYnIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgLy8gV2UgRE8gd2FudCB0byBiZSBoaXQgYnkgVG9hZC9SaWJiaXQgaWYgdGhlIG5leHQgY2FzdCBvZiBUaGUgR2FtZVxyXG4gICAgICAgIC8vIGlzIDR4IHRvYWQgcGFuZWxzLlxyXG4gICAgICAgIHJldHVybiAhKGRhdGEucGhhc2VOdW1iZXIgPT09IDMgJiYgZGF0YS5nYW1lQ291bnQgJSAyID09PSAwKSAmJiBtYXRjaGVzLnRhcmdldElkICE9PSAnRTAwMDAwMDAnO1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBUaGVyZSdzIGEgbG90IHdlIGNvdWxkIGRvIHRvIHRyYWNrIGV4YWN0bHkgaG93IHRoZSBwbGF5ZXIgZmFpbGVkIFRoZSBHYW1lLlxyXG4gICAgICAvLyBXaHkgb3ZlcnRoaW5rIE5vcm1hbCBtb2RlLCBob3dldmVyP1xyXG4gICAgICBpZDogJ08zTiBUaGUgR2FtZScsXHJcbiAgICAgIC8vIEd1ZXNzIHdoYXQgeW91IGp1c3QgbG9zdD9cclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMjQ2RCcgfSksXHJcbiAgICAgIC8vIElmIHRoZSBwbGF5ZXIgdGFrZXMgbm8gZGFtYWdlLCB0aGV5IGRpZCB0aGUgbWVjaGFuaWMgY29ycmVjdGx5LlxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLkRhbWFnZUZyb21NYXRjaGVzKG1hdGNoZXMpID4gMCxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgICBydW46IChkYXRhKSA9PiB7XHJcbiAgICAgICAgZGF0YS5nYW1lQ291bnQgKz0gMTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzIH0gZnJvbSAnLi4vLi4vLi4vb29wc3lfY29tbW9uJztcclxuXHJcbi8vIE80TiAtIERlbHRhc2NhcGUgNC4wIE5vcm1hbFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRGVsdGFzY2FwZVY0MCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnTzROIEJsaXp6YXJkIElJSSc6ICcyNEJDJywgLy8gVGFyZ2V0ZWQgY2lyY2xlIEFvRXMsIEV4ZGVhdGhcclxuICAgICdPNE4gRW1wb3dlcmVkIFRodW5kZXIgSUlJJzogJzI0QzEnLCAvLyBVbnRlbGVncmFwaGVkIGxhcmdlIGNpcmNsZSBBb0UsIEV4ZGVhdGhcclxuICAgICdPNE4gWm9tYmllIEJyZWF0aCc6ICcyNENCJywgLy8gQ29uYWwsIHRyZWUgaGVhZCBhZnRlciBEZWNpc2l2ZSBCYXR0bGVcclxuICAgICdPNE4gQ2xlYXJvdXQnOiAnMjRDQycsIC8vIE92ZXJsYXBwaW5nIGNvbmUgQW9FcywgRGVhdGhseSBWaW5lICh0ZW50YWNsZXMgYWxvbmdzaWRlIHRyZWUgaGVhZClcclxuICAgICdPNE4gQmxhY2sgU3BhcmsnOiAnMjRDOScsIC8vIEV4cGxvZGluZyBCbGFjayBIb2xlXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgIC8vIEVtcG93ZXJlZCBGaXJlIElJSSBpbmZsaWN0cyB0aGUgUHlyZXRpYyBkZWJ1ZmYsIHdoaWNoIGRlYWxzIGRhbWFnZSBpZiB0aGUgcGxheWVyXHJcbiAgICAvLyBtb3ZlcyBvciBhY3RzIGJlZm9yZSB0aGUgZGVidWZmIGZhbGxzLiBVbmZvcnR1bmF0ZWx5IGl0IGRvZXNuJ3QgbG9vayBsaWtlIHRoZXJlJ3NcclxuICAgIC8vIGN1cnJlbnRseSBhIGxvZyBsaW5lIGZvciB0aGlzLCBzbyB0aGUgb25seSB3YXkgdG8gY2hlY2sgZm9yIHRoaXMgaXMgdG8gY29sbGVjdFxyXG4gICAgLy8gdGhlIGRlYnVmZnMgYW5kIHRoZW4gd2FybiBpZiBhIHBsYXllciB0YWtlcyBhbiBhY3Rpb24gZHVyaW5nIHRoYXQgdGltZS4gTm90IHdvcnRoIGl0XHJcbiAgICAvLyBmb3IgTm9ybWFsLlxyXG4gICAgJ080TiBTdGFuZGFyZCBGaXJlJzogJzI0QkEnLFxyXG4gICAgJ080TiBCdXN0ZXIgVGh1bmRlcic6ICcyNEJFJywgLy8gQSBjbGVhdmluZyB0YW5rIGJ1c3RlclxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdPNE4gRG9vbScsIC8vIEtpbGxzIHRhcmdldCBpZiBub3QgY2xlYW5zZWRcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzM4RScgfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdDbGVhbnNlcnMgbWlzc2VkIERvb20hJyxcclxuICAgICAgICAgICAgZGU6ICdEb29tLVJlaW5pZ3VuZyB2ZXJnZXNzZW4hJyxcclxuICAgICAgICAgICAgZnI6ICdOXFwnYSBwYXMgw6l0w6kgZGlzc2lww6koZSkgZHUgR2xhcyAhJyxcclxuICAgICAgICAgICAgamE6ICfmrbvjga7lrqPlkYonLFxyXG4gICAgICAgICAgICBjbjogJ+ayoeino+atu+WuoycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBTaG9ydCBrbm9ja2JhY2sgZnJvbSBFeGRlYXRoXHJcbiAgICAgIGlkOiAnTzROIFZhY3V1bSBXYXZlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzI0QjgnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdQdXNoZWQgb2ZmIScsXHJcbiAgICAgICAgICAgIGRlOiAnUnVudGVyIGdlc2NodWJzdCEnLFxyXG4gICAgICAgICAgICBmcjogJ0Egw6l0w6kgcG91c3PDqShlKSAhJyxcclxuICAgICAgICAgICAgamE6ICfokL3jgaHjgZ8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ080TiBFbXBvd2VyZWQgQmxpenphcmQnLCAvLyBSb29tLXdpZGUgQW9FLCBmcmVlemVzIG5vbi1tb3ZpbmcgdGFyZ2V0c1xyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnNEU2JyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5pbXBvcnQgeyBwbGF5ZXJEYW1hZ2VGaWVsZHMgfSBmcm9tICcuLi8uLi8uLi9vb3BzeV9jb21tb24nO1xyXG5cclxuLy8gTzRTIC0gRGVsdGFzY2FwZSA0LjAgU2F2YWdlXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5EZWx0YXNjYXBlVjQwU2F2YWdlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdPNFMyIE5lbyBWYWN1dW0gV2F2ZSc6ICcyNDFEJyxcclxuICAgICdPNFMyIEFjY2VsZXJhdGlvbiBCb21iJzogJzI0MzEnLFxyXG4gICAgJ080UzIgRW1wdGluZXNzJzogJzI0MjInLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ080UzIgRG91YmxlIExhc2VyJzogJzI0MTUnLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdPNFMyIERlY2lzaXZlIEJhdHRsZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzI0MDgnLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgcnVuOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGRhdGEuaXNEZWNpc2l2ZUJhdHRsZUVsZW1lbnQgPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdPNFMxIFZhY3V1bSBXYXZlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMjNGRScsIGNhcHR1cmU6IGZhbHNlIH0pLFxyXG4gICAgICBydW46IChkYXRhKSA9PiB7XHJcbiAgICAgICAgZGF0YS5pc0RlY2lzaXZlQmF0dGxlRWxlbWVudCA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdPNFMyIEFsbWFnZXN0JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnMjQxNycsIGNhcHR1cmU6IGZhbHNlIH0pLFxyXG4gICAgICBydW46IChkYXRhKSA9PiB7XHJcbiAgICAgICAgZGF0YS5pc05lb0V4ZGVhdGggPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdPNFMyIEJsaXp6YXJkIElJSScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICcyM0Y4JywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICAvLyBJZ25vcmUgdW5hdm9pZGFibGUgcmFpZCBhb2UgQmxpenphcmQgSUlJLlxyXG4gICAgICBjb25kaXRpb246IChkYXRhKSA9PiAhZGF0YS5pc0RlY2lzaXZlQmF0dGxlRWxlbWVudCxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eU5hbWUgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzRTMiBUaHVuZGVyIElJSScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICcyM0ZEJywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICAvLyBPbmx5IGNvbnNpZGVyIHRoaXMgZHVyaW5nIHJhbmRvbSBtZWNoYW5pYyBhZnRlciBkZWNpc2l2ZSBiYXR0bGUuXHJcbiAgICAgIGNvbmRpdGlvbjogKGRhdGEpID0+IGRhdGEuaXNEZWNpc2l2ZUJhdHRsZUVsZW1lbnQsXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmFiaWxpdHlOYW1lIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ080UzIgUGV0cmlmaWVkJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzI2MicgfSksXHJcbiAgICAgIG1pc3Rha2U6IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgLy8gT24gTmVvLCBiZWluZyBwZXRyaWZpZWQgaXMgYmVjYXVzZSB5b3UgbG9va2VkIGF0IFNocmllaywgc28geW91ciBmYXVsdC5cclxuICAgICAgICBpZiAoZGF0YS5pc05lb0V4ZGVhdGgpXHJcbiAgICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5lZmZlY3QgfTtcclxuICAgICAgICAvLyBPbiBub3JtYWwgRXhEZWF0aCwgdGhpcyBpcyBkdWUgdG8gV2hpdGUgSG9sZS5cclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIG5hbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdPNFMyIEZvcmtlZCBMaWdodG5pbmcnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiAnMjQyRScsIC4uLnBsYXllckRhbWFnZUZpZWxkcyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdPNFMyIEJleW9uZCBEZWF0aCBHYWluJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzU2NicgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc0JleW9uZERlYXRoID0gZGF0YS5oYXNCZXlvbmREZWF0aCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc0JleW9uZERlYXRoW21hdGNoZXMudGFyZ2V0XSA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ080UzIgQmV5b25kIERlYXRoIExvc2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnNTY2JyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzQmV5b25kRGVhdGggPSBkYXRhLmhhc0JleW9uZERlYXRoIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzQmV5b25kRGVhdGhbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ080UzIgQmV5b25kIERlYXRoJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzU2NicgfSksXHJcbiAgICAgIGRlbGF5U2Vjb25kczogKF9kYXRhLCBtYXRjaGVzKSA9PiBwYXJzZUZsb2F0KG1hdGNoZXMuZHVyYXRpb24pIC0gMC41LFxyXG4gICAgICBkZWF0aFJlYXNvbjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBpZiAoIWRhdGEuaGFzQmV5b25kRGVhdGgpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKCFkYXRhLmhhc0JleW9uZERlYXRoW21hdGNoZXMudGFyZ2V0XSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IG1hdGNoZXMuZWZmZWN0LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ080UzIgRG91YmxlIEF0dGFjayBDb2xsZWN0JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzI0MUMnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmRvdWJsZUF0dGFja01hdGNoZXMgPSBkYXRhLmRvdWJsZUF0dGFja01hdGNoZXMgfHwgW107XHJcbiAgICAgICAgZGF0YS5kb3VibGVBdHRhY2tNYXRjaGVzLnB1c2gobWF0Y2hlcyk7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ080UzIgRG91YmxlIEF0dGFjaycsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICcyNDFDJywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFyciA9IGRhdGEuZG91YmxlQXR0YWNrTWF0Y2hlcztcclxuICAgICAgICBpZiAoIWFycilcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA8PSAyKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vIEhhcmQgdG8ga25vdyB3aG8gc2hvdWxkIGJlIGluIHRoaXMgYW5kIHdobyBzaG91bGRuJ3QsIGJ1dFxyXG4gICAgICAgIC8vIGl0IHNob3VsZCBuZXZlciBoaXQgMyBwZW9wbGUuXHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCB0ZXh0OiBgJHthcnJbMF0uYWJpbGl0eX0geCAke2Fyci5sZW5ndGh9YCB9O1xyXG4gICAgICB9LFxyXG4gICAgICBydW46IChkYXRhKSA9PiBkZWxldGUgZGF0YS5kb3VibGVBdHRhY2tNYXRjaGVzLFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gTzdTIC0gU2lnbWFzY2FwZSAzLjAgU2F2YWdlXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5TaWdtYXNjYXBlVjMwU2F2YWdlLFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdPN1MgTWlzc2lsZSc6ICcyNzgyJyxcclxuICAgICdPN1MgQ2hhaW4gQ2Fubm9uJzogJzI3OEYnLFxyXG4gIH0sXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ083UyBTZWFyaW5nIFdpbmQnOiAnMjc3NycsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ083UyBTdG9uZXNraW4nLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICcyQUI1JyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogbWF0Y2hlcy5zb3VyY2UsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzIH0gZnJvbSAnLi4vLi4vLi4vb29wc3lfY29tbW9uJztcclxuXHJcbi8vIFRPRE86IGNvdWxkIGFkZCBQYXRjaCB3YXJuaW5ncyBmb3IgZG91YmxlL3VuYnJva2VuIHRldGhlcnNcclxuLy8gVE9ETzogSGVsbG8gV29ybGQgY291bGQgaGF2ZSBhbnkgd2FybmluZ3MgKHNvcnJ5KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkFscGhhc2NhcGVWNDBTYXZhZ2UsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ08xMlMxIFN1cGVybGltaW5hbCBNb3Rpb24gMSc6ICczMzM0JywgLy8gMzAwKyBkZWdyZWUgY2xlYXZlIHdpdGggYmFjayBzYWZlIGFyZWFcclxuICAgICdPMTJTMSBFZmZpY2llbnQgQmxhZGV3b3JrIDEnOiAnMzMyOScsIC8vIE9tZWdhLU0gXCJnZXQgb3V0XCIgY2VudGVyZWQgYW9lIGFmdGVyIHNwbGl0XHJcbiAgICAnTzEyUzEgRWZmaWNpZW50IEJsYWRld29yayAyJzogJzMzMkEnLCAvLyBPbWVnYS1NIFwiZ2V0IG91dFwiIGNlbnRlcmVkIGFvZSBkdXJpbmcgYmxhZGVzXHJcbiAgICAnTzEyUzEgQmV5b25kIFN0cmVuZ3RoJzogJzMzMjgnLCAvLyBPbWVnYS1NIFwiZ2V0IGluXCIgY2VudGVyZWQgYW9lIGR1cmluZyBzaGllbGRcclxuICAgICdPMTJTMSBTdXBlcmxpbWluYWwgU3RlZWwgMSc6ICczMzMwJywgLy8gT21lZ2EtRiBcImdldCBmcm9udC9iYWNrXCIgYmxhZGVzIHBoYXNlXHJcbiAgICAnTzEyUzEgU3VwZXJsaW1pbmFsIFN0ZWVsIDInOiAnMzMzMScsIC8vIE9tZWdhLUYgXCJnZXQgZnJvbnQvYmFja1wiIGJsYWRlcyBwaGFzZVxyXG4gICAgJ08xMlMxIE9wdGltaXplZCBCbGl6emFyZCBJSUknOiAnMzMzMicsIC8vIE9tZWdhLUYgZ2lhbnQgY3Jvc3NcclxuICAgICdPMTJTMiBEaWZmdXNlIFdhdmUgQ2Fubm9uJzogJzMzNjknLCAvLyBiYWNrL3NpZGVzIGxhc2Vyc1xyXG4gICAgJ08xMlMyIFJpZ2h0IEFybSBVbml0IEh5cGVyIFB1bHNlIDEnOiAnMzM1QScsIC8vIFJvdGF0aW5nIEFyY2hpdmUgUGVyaXBoZXJhbCBsYXNlcnNcclxuICAgICdPMTJTMiBSaWdodCBBcm0gVW5pdCBIeXBlciBQdWxzZSAyJzogJzMzNUInLCAvLyBSb3RhdGluZyBBcmNoaXZlIFBlcmlwaGVyYWwgbGFzZXJzXHJcbiAgICAnTzEyUzIgUmlnaHQgQXJtIFVuaXQgQ29sb3NzYWwgQmxvdyc6ICczMzVGJywgLy8gRXhwbG9kaW5nIEFyY2hpdmUgQWxsIGhhbmRzXHJcbiAgICAnTzEyUzIgTGVmdCBBcm0gVW5pdCBDb2xvc3NhbCBCbG93JzogJzMzNjAnLCAvLyBFeHBsb2RpbmcgQXJjaGl2ZSBBbGwgaGFuZHNcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdPMTJTMSBPcHRpY2FsIExhc2VyJzogJzMzNDcnLCAvLyBtaWRkbGUgbGFzZXIgZnJvbSBleWVcclxuICAgICdPMTJTMSBBZHZhbmNlZCBPcHRpY2FsIExhc2VyJzogJzMzNEEnLCAvLyBnaWFudCBjaXJjbGUgY2VudGVyZWQgb24gZXllXHJcbiAgICAnTzEyUzIgUmVhciBQb3dlciBVbml0IFJlYXIgTGFzZXJzIDEnOiAnMzM2MScsIC8vIEFyY2hpdmUgQWxsIGluaXRpYWwgbGFzZXJcclxuICAgICdPMTJTMiBSZWFyIFBvd2VyIFVuaXQgUmVhciBMYXNlcnMgMic6ICczMzYyJywgLy8gQXJjaGl2ZSBBbGwgcm90YXRpbmcgbGFzZXJcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ08xMlMxIE9wdGltaXplZCBGaXJlIElJSSc6ICczMzM3JywgLy8gZmlyZSBzcHJlYWRcclxuICAgICdPMTJTMiBIeXBlciBQdWxzZSBUZXRoZXInOiAnMzM1QycsIC8vIEluZGV4IEFuZCBBcmNoaXZlIFBlcmlwaGVyYWwgdGV0aGVyc1xyXG4gICAgJ08xMlMyIFdhdmUgQ2Fubm9uJzogJzMzNkInLCAvLyBJbmRleCBBbmQgQXJjaGl2ZSBQZXJpcGhlcmFsIGJhaXRlZCBsYXNlcnNcclxuICAgICdPMTJTMiBPcHRpbWl6ZWQgRmlyZSBJSUknOiAnMzM3OScsIC8vIEFyY2hpdmUgQWxsIHNwcmVhZFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnTzEyUzEgT3B0aW1pemVkIFNhZ2l0dGFyaXVzIEFycm93JzogJzMzNEQnLCAvLyBPbWVnYS1NIGJhcmQgbGltaXQgYnJlYWtcclxuICAgICdPMTJTMiBPdmVyc2FtcGxlZCBXYXZlIENhbm5vbic6ICczMzY2JywgLy8gTW9uaXRvciB0YW5rIGJ1c3RlcnNcclxuICAgICdPMTJTMiBTYXZhZ2UgV2F2ZSBDYW5ub24nOiAnMzM2RCcsIC8vIFRhbmsgYnVzdGVyIHdpdGggdGhlIHZ1bG4gZmlyc3RcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzEyUzEgRGlzY2hhcmdlciBLbm9ja2VkIE9mZicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzMzMjcnIH0pLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnS25vY2tlZCBvZmYnLFxyXG4gICAgICAgICAgICBkZTogJ1J1bnRlcmdlZmFsbGVuJyxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIGFzc29tbcOpKGUpJyxcclxuICAgICAgICAgICAgamE6ICfjg47jg4Pjgq/jg5Djg4Pjgq8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICAgIGtvOiAn64SJ67CxJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzEyUzEgTWFnaWMgVnVsbmVyYWJpbGl0eSBVcCBHYWluJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzQ3MicgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLnZ1bG4gPSBkYXRhLnZ1bG4gfHwge307XHJcbiAgICAgICAgZGF0YS52dWxuW21hdGNoZXMudGFyZ2V0XSA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ08xMlMxIE1hZ2ljIFZ1bG5lcmFiaWxpdHkgVXAgTG9zZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmxvc2VzRWZmZWN0KHsgZWZmZWN0SWQ6ICc0NzInIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS52dWxuID0gZGF0YS52dWxuIHx8IHt9O1xyXG4gICAgICAgIGRhdGEudnVsblttYXRjaGVzLnRhcmdldF0gPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnTzEyUzEgTWFnaWMgVnVsbmVyYWJpbGl0eSBEYW1hZ2UnLFxyXG4gICAgICAvLyAzMzJFID0gUGlsZSBQaXRjaCBzdGFja1xyXG4gICAgICAvLyAzMzNFID0gRWxlY3RyaWMgU2xpZGUgKE9tZWdhLU0gc3F1YXJlIDEtNCBkYXNoZXMpXHJcbiAgICAgIC8vIDMzM0YgPSBFbGVjdHJpYyBTbGlkZSAoT21lZ2EtRiB0cmlhbmdsZSAxLTQgZGFzaGVzKVxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiBbJzMzMkUnLCAnMzMzRScsICczMzNGJ10sIC4uLnBsYXllckRhbWFnZUZpZWxkcyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoZGF0YSwgbWF0Y2hlcykgPT4gZGF0YS52dWxuICYmIGRhdGEudnVsblttYXRjaGVzLnRhcmdldF0sXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiBgJHttYXRjaGVzLmFiaWxpdHl9ICh3aXRoIHZ1bG4pYCxcclxuICAgICAgICAgICAgZGU6IGAke21hdGNoZXMuYWJpbGl0eX0gKG1pdCBWZXJ3dW5kYmFya2VpdClgLFxyXG4gICAgICAgICAgICBqYTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo6KKr44OA44Oh44O844K45LiK5piHKWAsXHJcbiAgICAgICAgICAgIGNuOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjluKbmmJPkvKQpYCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmltcG9ydCB7IHBsYXllckRhbWFnZUZpZWxkcyB9IGZyb20gJy4uLy4uLy4uL29vcHN5X2NvbW1vbic7XHJcblxyXG4vLyBCeWFra28gRXh0cmVtZVxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlSmFkZVN0b2FFeHRyZW1lLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgIC8vIFBvcHBpbmcgVW5yZWxlbnRpbmcgQW5ndWlzaCBidWJibGVzXHJcbiAgICAnQnlhRXggQXJhdGFtYSc6ICcyN0Y2JyxcclxuICAgIC8vIFN0ZXBwaW5nIGluIGdyb3dpbmcgb3JiXHJcbiAgICAnQnlhRXggVmFjdXVtIENsYXcnOiAnMjdFOScsXHJcbiAgICAvLyBMaWdodG5pbmcgUHVkZGxlc1xyXG4gICAgJ0J5YUV4IEh1bmRlcmZvbGQgSGF2b2MgMSc6ICcyN0U1JyxcclxuICAgICdCeWFFeCBIdW5kZXJmb2xkIEhhdm9jIDInOiAnMjdFNicsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnQnlhRXggU3dlZXAgVGhlIExlZyc6ICcyN0RCJyxcclxuICAgICdCeWFFeCBGaXJlIGFuZCBMaWdodG5pbmcnOiAnMjdERScsXHJcbiAgICAnQnlhRXggRGlzdGFudCBDbGFwJzogJzI3REQnLFxyXG4gICAgLy8gTWlkcGhhc2UgbGluZSBhdHRhY2tcclxuICAgICdCeWFFeCBJbXBlcmlhbCBHdWFyZCc6ICcyN0YxJyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIFBpbmsgYnViYmxlIGNvbGxpc2lvblxyXG4gICAgICBpZDogJ0J5YUV4IE9taW5vdXMgV2luZCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICcyN0VDJywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ3dhcm4nLFxyXG4gICAgICAgICAgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogJ2J1YmJsZSBjb2xsaXNpb24nLFxyXG4gICAgICAgICAgICBkZTogJ0JsYXNlbiBzaW5kIHp1c2FtbWVuZ2VzdG/Dn2VuJyxcclxuICAgICAgICAgICAgZnI6ICdjb2xsaXNpb24gZGUgYnVsbGVzJyxcclxuICAgICAgICAgICAgamE6ICfooZ3nqoEnLFxyXG4gICAgICAgICAgICBjbjogJ+ebuOaSnicsXHJcbiAgICAgICAgICAgIGtvOiAn7J6l7YyQIOqyueyzkOyEnCDthLDsp5AnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzIH0gZnJvbSAnLi4vLi4vLi4vb29wc3lfY29tbW9uJztcclxuXHJcbi8vIFNoaW5yeXUgTm9ybWFsXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlUm95YWxNZW5hZ2VyaWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1NoaW5yeXUgQWtoIFJoYWknOiAnMUZBNicsIC8vIFNreSBsYXNlcnMgYWxvbmdzaWRlIEFraCBNb3JuLlxyXG4gICAgJ1NoaW5yeXUgQmxhemluZyBUcmFpbCc6ICcyMjFBJywgLy8gUmVjdGFuZ2xlIEFvRXMsIGludGVybWlzc2lvbiBhZGRzLlxyXG4gICAgJ1NoaW5yeXUgQ29sbGFwc2UnOiAnMjIxOCcsIC8vIENpcmNsZSBBb0VzLCBpbnRlcm1pc3Npb24gYWRkc1xyXG4gICAgJ1NoaW5yeXUgRHJhZ29uZmlzdCc6ICcyNEYwJywgLy8gR2lhbnQgcHVuY2h5IGNpcmNsZSBpbiB0aGUgY2VudGVyLlxyXG4gICAgJ1NoaW5yeXUgRWFydGggQnJlYXRoJzogJzFGOUQnLCAvLyBDb25hbCBhdHRhY2tzIHRoYXQgYXJlbid0IGFjdHVhbGx5IEVhcnRoIFNoYWtlcnMuXHJcbiAgICAnU2hpbnJ5dSBHeXJlIENoYXJnZSc6ICcxRkE4JywgLy8gR3JlZW4gZGl2ZSBib21iIGF0dGFjay5cclxuICAgICdTaGlucnl1IFNwaWtlc2ljbGUnOiAnMUZBYCcsIC8vIEJsdWUtZ3JlZW4gbGluZSBhdHRhY2tzIGZyb20gYmVoaW5kLlxyXG4gICAgJ1NoaW5yeXUgVGFpbCBTbGFwJzogJzFGOTMnLCAvLyBSZWQgc3F1YXJlcyBpbmRpY2F0aW5nIHRoZSB0YWlsJ3MgbGFuZGluZyBzcG90cy5cclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1NoaW5yeXUgTGV2aW5ib2x0JzogJzFGOUMnLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gSWN5IGZsb29yIGF0dGFjay5cclxuICAgICAgaWQ6ICdTaGlucnl1IERpYW1vbmQgRHVzdCcsXHJcbiAgICAgIC8vIFRoaW4gSWNlXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICczOEYnIH0pLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnU2xpZCBvZmYhJyxcclxuICAgICAgICAgICAgZGU6ICdSdW50ZXIgZ2VydXRzY2h0IScsXHJcbiAgICAgICAgICAgIGZyOiAnQSBnbGlzc8OpKGUpICEnLFxyXG4gICAgICAgICAgICBqYTogJ+a7keOBo+OBnycsXHJcbiAgICAgICAgICAgIGNuOiAn5ruR6JC9JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnU2hpbnJ5dSBUaWRhbCBXYXZlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzFGOEInLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdQdXNoZWQgb2ZmIScsXHJcbiAgICAgICAgICAgIGRlOiAnUnVudGVyIGdlc2NodWJzdCEnLFxyXG4gICAgICAgICAgICBmcjogJ0Egw6l0w6kgcG91c3PDqShlKSAhJyxcclxuICAgICAgICAgICAgamE6ICfokL3jgaHjgZ8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBLbm9ja2JhY2sgZnJvbSBjZW50ZXIuXHJcbiAgICAgIGlkOiAnU2hpbnJ5dSBBZXJpYWwgQmxhc3QnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiAnMUY5MCcsIC4uLnBsYXllckRhbWFnZUZpZWxkcyB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ1B1c2hlZCBvZmYhJyxcclxuICAgICAgICAgICAgZGU6ICdSdW50ZXIgZ2VzY2h1YnN0IScsXHJcbiAgICAgICAgICAgIGZyOiAnQSDDqXTDqSBwb3Vzc2VyICEnLFxyXG4gICAgICAgICAgICBqYTogJ+iQveOBoeOBnycsXHJcbiAgICAgICAgICAgIGNuOiAn5Ye76YCA5Z2g6JC9JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuXHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gU3VzYW5vIEV4dHJlbWVcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZVBvb2xPZlRyaWJ1dGVFeHRyZW1lLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdTdXNFeCBDaHVybmluZyc6ICcyMDNGJyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdTdXNFeCBSYXNlbiBLYWlreW8nOiAnMjAyRScsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmltcG9ydCB7IHBsYXllckRhbWFnZUZpZWxkcyB9IGZyb20gJy4uLy4uLy4uL29vcHN5X2NvbW1vbic7XHJcblxyXG4vLyBVbHRpbWEgV2VhcG9uIFVsdGltYXRlXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVXZWFwb25zUmVmcmFpblVsdGltYXRlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdVV1UgU2VhcmluZyBXaW5kJzogJzJCNUMnLFxyXG4gICAgJ1VXVSBFcnVwdGlvbic6ICcyQjVBJyxcclxuICAgICdVV1UgV2VpZ2h0JzogJzJCNjUnLFxyXG4gICAgJ1VXVSBMYW5kc2xpZGUxJzogJzJCNzAnLFxyXG4gICAgJ1VXVSBMYW5kc2xpZGUyJzogJzJCNzEnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ1VXVSBHcmVhdCBXaGlybHdpbmQnOiAnMkI0MScsXHJcbiAgICAnVVdVIFNsaXBzdHJlYW0nOiAnMkI1MycsXHJcbiAgICAnVVdVIFdpY2tlZCBXaGVlbCc6ICcyQjRFJyxcclxuICAgICdVV1UgV2lja2VkIFRvcm5hZG8nOiAnMkI0RicsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ1VXVSBXaW5kYnVybicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICdFQicgfSksXHJcbiAgICAgIHN1cHByZXNzU2Vjb25kczogMixcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBGZWF0aGVybGFuY2UgZXhwbG9zaW9uLiAgSXQgc2VlbXMgbGlrZSB0aGUgcGVyc29uIHdobyBwb3BzIGl0IGlzIHRoZVxyXG4gICAgICAvLyBmaXJzdCBwZXJzb24gbGlzdGVkIGRhbWFnZS13aXNlLCBzbyB0aGV5IGFyZSBsaWtlbHkgdGhlIGN1bHByaXQuXHJcbiAgICAgIGlkOiAnVVdVIEZlYXRoZXJsYW5jZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICcyQjQzJywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBzdXBwcmVzc1NlY29uZHM6IDUsXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLnNvdXJjZSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzLCBrRmxhZ0luc3RhbnREZWF0aCB9IGZyb20gJy4uLy4uLy4uL29vcHN5X2NvbW1vbic7XHJcblxyXG4vLyBVQ1UgLSBUaGUgVW5lbmRpbmcgQ29pbCBPZiBCYWhhbXV0IChVbHRpbWF0ZSlcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZVVuZW5kaW5nQ29pbE9mQmFoYW11dFVsdGltYXRlLFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdVQ1UgTHVuYXIgRHluYW1vJzogJzI2QkMnLFxyXG4gICAgJ1VDVSBJcm9uIENoYXJpb3QnOiAnMjZCQicsXHJcbiAgICAnVUNVIEV4YWZsYXJlJzogJzI2RUYnLFxyXG4gICAgJ1VDVSBXaW5ncyBPZiBTYWx2YXRpb24nOiAnMjZDQScsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ1VDVSBUd2lzdGVyIERlYXRoJyxcclxuICAgICAgLy8gSW5zdGFudCBkZWF0aCBoYXMgYSBzcGVjaWFsIGZsYWcgdmFsdWUsIGRpZmZlcmVudGlhdGluZ1xyXG4gICAgICAvLyBmcm9tIHRoZSBleHBsb3Npb24gZGFtYWdlIHlvdSB0YWtlIHdoZW4gc29tZWJvZHkgZWxzZVxyXG4gICAgICAvLyBwb3BzIG9uZS5cclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzI2QUInLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMsIGZsYWdzOiBrRmxhZ0luc3RhbnREZWF0aCB9KSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIGJsYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgZW46ICdUd2lzdGVyIFBvcCcsXHJcbiAgICAgICAgICAgIGRlOiAnV2lyYmVsc3R1cm0gYmVyw7xocnQnLFxyXG4gICAgICAgICAgICBmcjogJ0FwcGFyaXRpb24gZGVzIHRvcm5hZGVzJyxcclxuICAgICAgICAgICAgamE6ICfjg4TjgqTjgrnjgr/jg7wnLFxyXG4gICAgICAgICAgICBjbjogJ+aXi+mjjicsXHJcbiAgICAgICAgICAgIGtvOiAn7ZqM7Jik66asIOuwn+ydjCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1VDVSBUaGVybWlvbmljIEJ1cnN0JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzI2QjknLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnUGl6emEgU2xpY2UnLFxyXG4gICAgICAgICAgICBkZTogJ1Bpenphc3TDvGNrJyxcclxuICAgICAgICAgICAgZnI6ICdQYXJ0cyBkZSBwaXp6YScsXHJcbiAgICAgICAgICAgIGphOiAn44K144O844Of44Kq44OL44OD44Kv44OQ44O844K544OIJyxcclxuICAgICAgICAgICAgY246ICflpKnltKnlnLDoo4InLFxyXG4gICAgICAgICAgICBrbzogJ+yepe2MkOyXkCDrp57snYwnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdVQ1UgQ2hhaW4gTGlnaHRuaW5nJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzI2QzgnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIC8vIEl0J3MgaGFyZCB0byBhc3NpZ24gYmxhbWUgZm9yIGxpZ2h0bmluZy4gIFRoZSBkZWJ1ZmZzXHJcbiAgICAgICAgLy8gZ28gb3V0IGFuZCB0aGVuIGV4cGxvZGUgaW4gb3JkZXIsIGJ1dCB0aGUgYXR0YWNrZXIgaXNcclxuICAgICAgICAvLyB0aGUgZHJhZ29uIGFuZCBub3QgdGhlIHBsYXllci5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ3dhcm4nLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnaGl0IGJ5IGxpZ2h0bmluZycsXHJcbiAgICAgICAgICAgIGRlOiAndm9tIEJsaXR6IGdldHJvZmZlbicsXHJcbiAgICAgICAgICAgIGZyOiAnZnJhcHDDqShlKSBwYXIgbGEgZm91ZHJlJyxcclxuICAgICAgICAgICAgamE6ICfjg4HjgqfjgqTjg7Pjg6njgqTjg4jjg4vjg7PjgrAnLFxyXG4gICAgICAgICAgICBjbjogJ+mbt+WFiemTvicsXHJcbiAgICAgICAgICAgIGtvOiAn67KI6rCcIOunnuydjCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1VDVSBCdXJucycsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICdGQScgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdVQ1UgU2x1ZGdlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzExRicgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdVQ1UgRG9vbSBHYWluJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJ0QyJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzRG9vbSA9IGRhdGEuaGFzRG9vbSB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc0Rvb21bbWF0Y2hlcy50YXJnZXRdID0gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVUNVIERvb20gTG9zZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmxvc2VzRWZmZWN0KHsgZWZmZWN0SWQ6ICdEMicgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc0Rvb20gPSBkYXRhLmhhc0Rvb20gfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNEb29tW21hdGNoZXMudGFyZ2V0XSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gVGhlcmUgaXMgbm8gY2FsbG91dCBmb3IgXCJ5b3UgZm9yZ290IHRvIGNsZWFyIGRvb21cIi4gIFRoZSBsb2dzIGxvb2tcclxuICAgICAgLy8gc29tZXRoaW5nIGxpa2UgdGhpczpcclxuICAgICAgLy8gICBbMjA6MDI6MzAuNTY0XSAxQTpPa29ub21pIFlha2kgZ2FpbnMgdGhlIGVmZmVjdCBvZiBEb29tIGZyb20gIGZvciA2LjAwIFNlY29uZHMuXHJcbiAgICAgIC8vICAgWzIwOjAyOjM2LjQ0M10gMUU6T2tvbm9taSBZYWtpIGxvc2VzIHRoZSBlZmZlY3Qgb2YgUHJvdGVjdCBmcm9tIFRha28gWWFraS5cclxuICAgICAgLy8gICBbMjA6MDI6MzYuNDQzXSAxRTpPa29ub21pIFlha2kgbG9zZXMgdGhlIGVmZmVjdCBvZiBEb29tIGZyb20gLlxyXG4gICAgICAvLyAgIFsyMDowMjozOC41MjVdIDE5Ok9rb25vbWkgWWFraSB3YXMgZGVmZWF0ZWQgYnkgRmlyZWhvcm4uXHJcbiAgICAgIC8vIEluIG90aGVyIHdvcmRzLCBkb29tIGVmZmVjdCBpcyByZW1vdmVkICsvLSBuZXR3b3JrIGxhdGVuY3ksIGJ1dCBjYW4ndFxyXG4gICAgICAvLyB0ZWxsIHVudGlsIGxhdGVyIHRoYXQgaXQgd2FzIGEgZGVhdGguICBBcmd1YWJseSwgdGhpcyBjb3VsZCBoYXZlIGJlZW4gYVxyXG4gICAgICAvLyBjbG9zZS1idXQtc3VjY2Vzc2Z1bCBjbGVhcmluZyBvZiBkb29tIGFzIHdlbGwuICBJdCBsb29rcyB0aGUgc2FtZS5cclxuICAgICAgLy8gU3RyYXRlZ3k6IGlmIHlvdSBoYXZlbid0IGNsZWFyZWQgZG9vbSB3aXRoIDEgc2Vjb25kIHRvIGdvIHRoZW4geW91IHByb2JhYmx5XHJcbiAgICAgIC8vIGRpZWQgdG8gZG9vbS4gIFlvdSBjYW4gZ2V0IG5vbi1mYXRhbGx5IGljZWJhbGxlZCBvciBhdXRvJ2QgaW4gYmV0d2VlbixcclxuICAgICAgLy8gYnV0IHdoYXQgY2FuIHlvdSBkby5cclxuICAgICAgaWQ6ICdVQ1UgRG9vbSBEZWF0aCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICdEMicgfSksXHJcbiAgICAgIGRlbGF5U2Vjb25kczogKF9kYXRhLCBtYXRjaGVzKSA9PiBwYXJzZUZsb2F0KG1hdGNoZXMuZHVyYXRpb24pIC0gMSxcclxuICAgICAgZGVhdGhSZWFzb246IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgaWYgKCFkYXRhLmhhc0Rvb20gfHwgIWRhdGEuaGFzRG9vbVttYXRjaGVzLnRhcmdldF0pXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgbGV0IHJlYXNvbjtcclxuICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHBhcnNlRmxvYXQobWF0Y2hlcy5kdXJhdGlvbik7XHJcbiAgICAgICAgaWYgKGR1cmF0aW9uIDwgOSlcclxuICAgICAgICAgIHJlYXNvbiA9IG1hdGNoZXMuZWZmZWN0ICsgJyAjMSc7XHJcbiAgICAgICAgZWxzZSBpZiAoZHVyYXRpb24gPCAxNClcclxuICAgICAgICAgIHJlYXNvbiA9IG1hdGNoZXMuZWZmZWN0ICsgJyAjMic7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmVhc29uID0gbWF0Y2hlcy5lZmZlY3QgKyAnICMzJztcclxuICAgICAgICByZXR1cm4geyBuYW1lOiBtYXRjaGVzLnRhcmdldCwgcmVhc29uOiByZWFzb24gfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUaGUgQ29waWVkIEZhY3RvcnlcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUNvcGllZEZhY3RvcnksXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0NvcGllZCBTZXJpYWwgRW5lcmd5IEJvbWInOiAnNDhCNCcsXHJcbiAgICAvLyBNYWtlIHN1cmUgZW5lbWllcyBhcmUgaWdub3JlZCBvbiB0aGVzZVxyXG4gICAgJ0NvcGllZCBTZXJpYWwgRW5lcmd5IEJvbWJhcmRtZW50JzogJzQ4QjgnLFxyXG4gICAgJ0NvcGllZCBTZXJpYWwgRW5lcmd5IEFzc2F1bHQnOiAnNDhCNicsXHJcbiAgICAnQ29waWVkIFNlcmlhbCBIaWdoLVBvd2VyZWQgTGFzZXInOiAnNDhDNScsXHJcbiAgICAnQ29waWVkIFNlcmlhbCBTaWRlc3RyaWtpbmcgU3BpbiBTcGluIDEnOiAnNDhDQicsXHJcbiAgICAnQ29waWVkIFNlcmlhbCBTaWRlc3RyaWtpbmcgU3BpbiAyJzogJzQ4Q0MnLFxyXG4gICAgJ0NvcGllZCBTZXJpYWwgQ2VudHJpZnVnYWwgU3Bpbic6ICc0OEM5JyxcclxuICAgICdDb3BpZWQgU2VyaWFsIEFpci1Uby1TdXJmYWNlIEVuZXJneSc6ICc0OEJBJyxcclxuICAgICdDb3BpZWQgU2VyaWFsIEhpZ2gtQ2FsaWJlciBMYXNlcic6ICc0OEZBJyxcclxuICAgICdDb3BpZWQgU2VyaWFsIEVuZXJneSBSaW5nIDEnOiAnNDhCQycsXHJcbiAgICAnQ29waWVkIFNlcmlhbCBFbmVyZ3kgUmluZyAyJzogJzQ4QkQnLFxyXG4gICAgJ0NvcGllZCBTZXJpYWwgRW5lcmd5IFJpbmcgMyc6ICc0OEJFJyxcclxuICAgICdDb3BpZWQgU2VyaWFsIEVuZXJneSBSaW5nIDQnOiAnNDhDMCcsXHJcbiAgICAnQ29waWVkIFNlcmlhbCBFbmVyZ3kgUmluZyA1JzogJzQ4QzEnLFxyXG4gICAgJ0NvcGllZCBTZXJpYWwgRW5lcmd5IFJpbmcgNic6ICc0OEMyJyxcclxuXHJcbiAgICAnQ29waWVkIFRyYXNoIEVuZXJneSBCb21iJzogJzQ5MUQnLFxyXG4gICAgJ0NvcGllZCBUcmFzaCBGcm9udGFsIFNvbWVyc2F1bHQnOiAnNDkxQicsXHJcbiAgICAnQ29waWVkIFRyYXNoIEhpZ2gtRnJlcXVlbmN5IExhc2VyJzogJzQ5MUUnLFxyXG5cclxuICAgICdDb3BpZWQgSG9iYmVzIFNob2NraW5nIERpc2NoYXJnZSc6ICc0ODBCJyxcclxuICAgICdDb3BpZWQgSG9iYmVzIFZhcmlhYmxlIENvbWJhdCBUZXN0IDEnOiAnNDlDNScsXHJcbiAgICAnQ29waWVkIEhvYmJlcyBWYXJpYWJsZSBDb21iYXQgVGVzdCAyJzogJzQ5QzYnLFxyXG4gICAgJ0NvcGllZCBIb2JiZXMgVmFyaWFibGUgQ29tYmF0IFRlc3QgMyc6ICc0OUM3JyxcclxuICAgICdDb3BpZWQgSG9iYmVzIFZhcmlhYmxlIENvbWJhdCBUZXN0IDQnOiAnNDgwRicsXHJcbiAgICAnQ29waWVkIEhvYmJlcyBWYXJpYWJsZSBDb21iYXQgVGVzdCA1JzogJzQ4MTAnLFxyXG4gICAgJ0NvcGllZCBIb2JiZXMgVmFyaWFibGUgQ29tYmF0IFRlc3QgNic6ICc0ODExJyxcclxuXHJcbiAgICAnQ29waWVkIEhvYmJlcyBSaW5nIExhc2VyIDEnOiAnNDgwMicsXHJcbiAgICAnQ29waWVkIEhvYmJlcyBSaW5nIExhc2VyIDInOiAnNDgwMycsXHJcbiAgICAnQ29waWVkIEhvYmJlcyBSaW5nIExhc2VyIDMnOiAnNDgwNCcsXHJcblxyXG4gICAgJ0NvcGllZCBIb2JiZXMgVG93ZXJmYWxsJzogJzQ4MTMnLFxyXG5cclxuICAgICdDb3BpZWQgSG9iYmVzIEZpcmUtUmVpc3RhbmNlIFRlc3QgMSc6ICc0ODE2JyxcclxuICAgICdDb3BpZWQgSG9iYmVzIEZpcmUtUmVpc3RhbmNlIFRlc3QgMic6ICc0ODE3JyxcclxuICAgICdDb3BpZWQgSG9iYmVzIEZpcmUtUmVpc3RhbmNlIFRlc3QgMyc6ICc0ODE4JyxcclxuXHJcbiAgICAnQ29waWVkIEhvYmJlcyBPaWwgV2VsbCc6ICc0ODFCJyxcclxuICAgICdDb3BpZWQgSG9iYmVzIEVsZWN0cm9tYWduZXRpYyBQdWxzZSc6ICc0ODE5JyxcclxuICAgIC8vIFRPRE86IHdoYXQncyB0aGUgZWxlY3RyaWZpZWQgZmxvb3Igd2l0aCBjb252ZXlvciBiZWx0cz9cclxuXHJcbiAgICAnQ29waWVkIEdvbGlhdGggRW5lcmd5IFJpbmcgMSc6ICc0OTM3JyxcclxuICAgICdDb3BpZWQgR29saWF0aCBFbmVyZ3kgUmluZyAyJzogJzQ5MzgnLFxyXG4gICAgJ0NvcGllZCBHb2xpYXRoIEVuZXJneSBSaW5nIDMnOiAnNDkzOScsXHJcbiAgICAnQ29waWVkIEdvbGlhdGggRW5lcmd5IFJpbmcgNCc6ICc0OTNBJyxcclxuICAgICdDb3BpZWQgR29saWF0aCBFbmVyZ3kgUmluZyA1JzogJzQ5MzcnLFxyXG4gICAgJ0NvcGllZCBHb2xpYXRoIExhc2VyIFR1cnJldCc6ICc0OEU2JyxcclxuXHJcbiAgICAnQ29waWVkIEZsaWdodCBVbml0IEFyZWEgQm9tYmluZyc6ICc0OTQzJyxcclxuICAgICdDb3BpZWQgRmxpZ2h0IFVuaXQgTGlnaHRmYXN0IEJsYWRlJzogJzQ5NDAnLFxyXG5cclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggMSc6ICc0NzI5JyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggMic6ICc0NzI4JyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggMyc6ICc0NzJGJyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggNCc6ICc0NzMxJyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggNSc6ICc0NzJCJyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggNic6ICc0NzJEJyxcclxuICAgICdDb3BpZWQgRW5nZWxzIE1hcnggU21hc2ggNyc6ICc0NzMyJyxcclxuXHJcbiAgICAnQ29waWVkIEVuZ2VscyBJbmNlbmRpYXJ5IEJvbWJpbmcnOiAnNDczOScsXHJcbiAgICAnQ29waWVkIEVuZ2VscyBHdWlkZWQgTWlzc2lsZSc6ICc0NzM2JyxcclxuICAgICdDb3BpZWQgRW5nZWxzIFN1cmZhY2UgTWlzc2lsZSc6ICc0NzM0JyxcclxuICAgICdDb3BpZWQgRW5nZWxzIExhc2VyIFNpZ2h0JzogJzQ3M0InLFxyXG4gICAgJ0NvcGllZCBFbmdlbHMgRnJhY2snOiAnNDc0RCcsXHJcblxyXG4gICAgJ0NvcGllZCBFbmdlbHMgTWFyeCBDcnVzaCc6ICc0OEZDJyxcclxuICAgICdDb3BpZWQgRW5nZWxzIENydXNoaW5nIFdoZWVsJzogJzQ3NEInLFxyXG4gICAgJ0NvcGllZCBFbmdlbHMgTWFyeCBUaHJ1c3QnOiAnNDhGQycsXHJcblxyXG4gICAgJ0NvcGllZCA5UyBMYXNlciBTdXBwcmVzc2lvbic6ICc0OEUwJywgLy8gQ2Fubm9uc1xyXG4gICAgJ0NvcGllZCA5UyBCYWxsaXN0aWMgSW1wYWN0IDEnOiAnNDk3NCcsXHJcbiAgICAnQ29waWVkIDlTIEJhbGxpc3RpYyBJbXBhY3QgMic6ICc0OERDJyxcclxuICAgICdDb3BpZWQgOVMgQmFsbGlzdGljIEltcGFjdCAzJzogJzQ4RTQnLFxyXG4gICAgJ0NvcGllZCA5UyBCYWxsaXN0aWMgSW1wYWN0IDQnOiAnNDhFMCcsXHJcblxyXG4gICAgJ0NvcGllZCA5UyBNYXJ4IEltcGFjdCc6ICc0OEQ0JyxcclxuXHJcbiAgICAnQ29waWVkIDlTIFRhbmsgRGVzdHJ1Y3Rpb24gMSc6ICc0OEU4JyxcclxuICAgICdDb3BpZWQgOVMgVGFuayBEZXN0cnVjdGlvbiAyJzogJzQ4RTknLFxyXG5cclxuICAgICdDb3BpZWQgOVMgU2VyaWFsIFNwaW4gMSc6ICc0OEE1JyxcclxuICAgICdDb3BpZWQgOVMgU2VyaWFsIFNwaW4gMic6ICc0OEE3JyxcclxuXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdDb3BpZWQgSG9iYmVzIFNob3J0LVJhbmdlIE1pc3NpbGUnOiAnNDgxNScsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiA1MDkzIHRha2luZyBIaWdoLVBvd2VyZWQgTGFzZXIgd2l0aCBhIHZ1bG4gKGJlY2F1c2Ugb2YgdGFraW5nIHR3bylcclxuLy8gVE9ETzogNEZCNSB0YWtpbmcgSGlnaC1Qb3dlcmVkIExhc2VyIHdpdGggYSB2dWxuIChiZWNhdXNlIG9mIHRha2luZyB0d28pXHJcbi8vIFRPRE86IDUwRDMgQWVyaWFsIFN1cHBvcnQ6IEJvbWJhcmRtZW50IGdvaW5nIG9mZiBmcm9tIGFkZFxyXG4vLyBUT0RPOiA1MjExIE1hbmV1dmVyOiBWb2x0IEFycmF5IG5vdCBnZXR0aW5nIGludGVycnVwdGVkXHJcbi8vIFRPRE86IDRGRjQvNEZGNSBPbmUgb2YgdGhlc2UgaXMgZmFpbGluZyBjaGVtaWNhbCBjb25mbGFncmF0aW9uXHJcbi8vIFRPRE86IHN0YW5kaW5nIGluIHdyb25nIHRlbGVwb3J0ZXI/PyBtYXliZSA1MzYzP1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZVB1cHBldHNCdW5rZXIsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1B1cHBldCBBZWdpcyBCZWFtIENhbm5vbnMgMSc6ICc1MDc0JywgLy8gcm90YXRpbmcgc2VwYXJhdGluZyB3aGl0ZSBncm91bmQgYW9lXHJcbiAgICAnUHVwcGV0IEFlZ2lzIEJlYW0gQ2Fubm9ucyAyJzogJzUwNzUnLCAvLyByb3RhdGluZyBzZXBhcmF0aW5nIHdoaXRlIGdyb3VuZCBhb2VcclxuICAgICdQdXBwZXQgQWVnaXMgQmVhbSBDYW5ub25zIDMnOiAnNTA3NicsIC8vIHJvdGF0aW5nIHNlcGFyYXRpbmcgd2hpdGUgZ3JvdW5kIGFvZVxyXG4gICAgJ1B1cHBldCBBZWdpcyBDb2xsaWRlciBDYW5ub25zJzogJzUwN0UnLCAvLyByb3RhdGluZyByZWQgZ3JvdW5kIGFvZSBwaW53aGVlbFxyXG4gICAgJ1B1cHBldCBBZWdpcyBTdXJmYWNlIExhc2VyIDEnOiAnNTA5MScsIC8vIGNoYXNpbmcgbGFzZXIgaW5pdGlhbFxyXG4gICAgJ1B1cHBldCBBZWdpcyBTdXJmYWNlIExhc2VyIDInOiAnNTA5MicsIC8vIGNoYXNpbmcgbGFzZXIgY2hhc2luZ1xyXG4gICAgJ1B1cHBldCBBZWdpcyBGbGlnaHQgUGF0aCc6ICc1MDhDJywgLy8gYmx1ZSBsaW5lIGFvZSBmcm9tIGZseWluZyB1bnRhcmdldGFibGUgYWRkc1xyXG4gICAgJ1B1cHBldCBBZWdpcyBSZWZyYWN0aW9uIENhbm5vbnMgMSc6ICc1MDgxJywgLy8gcmVmcmFjdGlvbiBjYW5ub25zIGJldHdlZW4gd2luZ3NcclxuICAgICdQdXBwZXQgQWVnaXMgTGlmZVxcJ3MgTGFzdCBTb25nJzogJzUzQjMnLCAvLyByaW5nIGFvZSB3aXRoIGdhcFxyXG4gICAgJ1B1cHBldCBMaWdodCBMb25nLUJhcnJlbGVkIExhc2VyJzogJzUyMTInLCAvLyBsaW5lIGFvZSBmcm9tIGFkZFxyXG4gICAgJ1B1cHBldCBMaWdodCBTdXJmYWNlIE1pc3NpbGUgSW1wYWN0JzogJzUyMEYnLCAvLyB1bnRhcmdldGVkIGdyb3VuZCBhb2UgZnJvbSBObyBSZXN0cmljdGlvbnNcclxuICAgICdQdXBwZXQgU3VwZXJpb3IgSW5jZW5kaWFyeSBCb21iaW5nJzogJzRGQjknLCAvLyBmaXJlIHB1ZGRsZSBpbml0aWFsXHJcbiAgICAnUHVwcGV0IFN1cGVyaW9yIFNoYXJwIFR1cm4nOiAnNTA2RCcsIC8vIHNoYXJwIHR1cm4gZGFzaFxyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBTdGFuZGFyZCBTdXJmYWNlIE1pc3NpbGUgMSc6ICc0RkIxJywgLy8gTGV0aGFsIFJldm9sdXRpb24gY2lyY2xlc1xyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBTdGFuZGFyZCBTdXJmYWNlIE1pc3NpbGUgMic6ICc0RkIyJywgLy8gTGV0aGFsIFJldm9sdXRpb24gY2lyY2xlc1xyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBTdGFuZGFyZCBTdXJmYWNlIE1pc3NpbGUgMyc6ICc0RkIzJywgLy8gTGV0aGFsIFJldm9sdXRpb24gY2lyY2xlc1xyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBTbGlkaW5nIFN3aXBlIDEnOiAnNTA2RicsIC8vIHJpZ2h0LWhhbmRlZCBzbGlkaW5nIHN3aXBlXHJcbiAgICAnUHVwcGV0IFN1cGVyaW9yIFNsaWRpbmcgU3dpcGUgMic6ICc1MDcwJywgLy8gbGVmdC1oYW5kZWQgc2xpZGluZyBzd2lwZVxyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBHdWlkZWQgTWlzc2lsZSc6ICc0RkI4JywgLy8gZ3JvdW5kIGFvZSBkdXJpbmcgQXJlYSBCb21iYXJkbWVudFxyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBIaWdoLU9yZGVyIEV4cGxvc2l2ZSBCbGFzdCAxJzogJzRGQzAnLCAvLyBzdGFyIGFvZVxyXG4gICAgJ1B1cHBldCBTdXBlcmlvciBIaWdoLU9yZGVyIEV4cGxvc2l2ZSBCbGFzdCAyJzogJzRGQzEnLCAvLyBzdGFyIGFvZVxyXG4gICAgJ1B1cHBldCBIZWF2eSBFbmVyZ3kgQm9tYmFyZG1lbnQnOiAnNEZGQycsIC8vIGNvbG9yZWQgbWFnaWMgaGFtbWVyLXkgZ3JvdW5kIGFvZVxyXG4gICAgJ1B1cHBldCBIZWF2eSBSZXZvbHZpbmcgTGFzZXInOiAnNTAwMCcsIC8vIGdldCB1bmRlciBsYXNlclxyXG4gICAgJ1B1cHBldCBIZWF2eSBFbmVyZ3kgQm9tYic6ICc0RkZBJywgLy8gZ2V0dGluZyBoaXQgYnkgYmFsbCBkdXJpbmcgQWN0aXZlIFN1cHByZXNzaXZlIFVuaXRcclxuICAgICdQdXBwZXQgSGVhdnkgUjAxMCBMYXNlcic6ICc0RkYwJywgLy8gbGFzZXIgcG9kXHJcbiAgICAnUHVwcGV0IEhlYXZ5IFIwMzAgSGFtbWVyJzogJzRGRjEnLCAvLyBjaXJjbGUgYW9lIHBvZFxyXG4gICAgJ1B1cHBldCBIYWxsd2F5IEhpZ2gtUG93ZXJlZCBMYXNlcic6ICc1MEIxJywgLy8gbG9uZyBhb2UgaW4gdGhlIGhhbGx3YXkgc2VjdGlvblxyXG4gICAgJ1B1cHBldCBIYWxsd2F5IEVuZXJneSBCb21iJzogJzUwQjInLCAvLyBydW5uaW5nIGludG8gYSBmbG9hdGluZyBvcmJcclxuICAgICdQdXBwZXQgQ29tcG91bmQgTWVjaGFuaWNhbCBEaXNzZWN0aW9uJzogJzUxQjMnLCAvLyBzcGlubmluZyB2ZXJ0aWNhbCBsYXNlclxyXG4gICAgJ1B1cHBldCBDb21wb3VuZCBNZWNoYW5pY2FsIERlY2FwaXRhdGlvbic6ICc1MUI0JywgLy8gZ2V0IHVuZGVyIGxhc2VyXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIE1lY2huaWNhbCBDb250dXNpb24gVW50YXJnZXRlZCc6ICc1MUI3JywgLy8gdW50YXJnZXRlZCBncm91bmQgYW9lXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFJlbGVudGxlc3MgU3BpcmFsIDEnOiAnNTFBQScsIC8vIHRyaXBsZSB1bnRhcmdldGVkIGdyb3VuZCBhb2VzXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFJlbGVudGxlc3MgU3BpcmFsIDInOiAnNTFDQicsIC8vIHRyaXBsZSB1bnRhcmdldGVkIGdyb3VuZCBhb2VzXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFByaW1lIEJsYWRlIE91dCAxJzogJzU0MUYnLCAvLyAyUCBwcmltZSBibGFkZSBnZXQgb3V0XHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFByaW1lIEJsYWRlIE91dCAyJzogJzUxOTgnLCAvLyAyUC9wdXBwZXQgdGVsZXBvcnRpbmcvcmVwcm9kdWNlIHByaW1lIGJsYWRlIGdldCBvdXRcclxuICAgICdQdXBwZXQgQ29tcG91bmQgMlAgUHJpbWUgQmxhZGUgQmVoaW5kIDEnOiAnNTQyMCcsIC8vIDJQIHByaW1lIGJsYWRlIGdldCBiZWhpbmRcclxuICAgICdQdXBwZXQgQ29tcG91bmQgMlAgUHJpbWUgQmxhZGUgQmVoaW5kIDInOiAnNTE5OScsIC8vIDJQIHRlbGVwb3J0aW5nIHByaW1lIGJsYWRlIGdldCBiZWhpbmRcclxuICAgICdQdXBwZXQgQ29tcG91bmQgMlAgUHJpbWUgQmxhZGUgSW4gMSc6ICc1NDIxJywgLy8gMlAgcHJpbWUgYmxhZGUgZ2V0IGluXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFByaW1lIEJsYWRlIEluIDInOiAnNTE5QScsIC8vIDJQL3B1cHBldCB0ZWxlcG9ydGluZy9yZXByb2R1Y2UgcHJpbWUgYmxhZGUgZ2V0IGluXHJcbiAgICAnUHVwcGV0IENvbXBvdW5kIDJQIFIwMTIgTGFzZXIgR3JvdW5kJzogJzUxQUUnLCAvLyB1bnRhcmdldGVkIGdyb3VuZCBjaXJjbGVcclxuICAgIC8vIFRoaXMgaXMuLi4gdG9vIG5vaXN5LlxyXG4gICAgLy8gJ1B1cHBldCBDb21wb3VuZCAyUCBGb3VyIFBhcnRzIFJlc29sdmUgMSc6ICc1MUEwJywgLy8gZm91ciBwYXJ0cyByZXNvbHZlIGp1bXBcclxuICAgIC8vICdQdXBwZXQgQ29tcG91bmQgMlAgRm91ciBQYXJ0cyBSZXNvbHZlIDInOiAnNTE5RicsIC8vIGZvdXIgcGFydHMgcmVzb2x2ZSBjbGVhdmVcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdQdXBwZXQgSGVhdnkgVXBwZXIgTGFzZXIgMSc6ICc1MDg3JywgLy8gdXBwZXIgbGFzZXIgaW5pdGlhbFxyXG4gICAgJ1B1cHBldCBIZWF2eSBVcHBlciBMYXNlciAyJzogJzRGRjcnLCAvLyB1cHBlciBsYXNlciBjb250aW51b3VzXHJcbiAgICAnUHVwcGV0IEhlYXZ5IExvd2VyIExhc2VyIDEnOiAnNTA4NicsIC8vIGxvd2VyIGxhc2VyIGZpcnN0IHNlY3Rpb24gaW5pdGlhbFxyXG4gICAgJ1B1cHBldCBIZWF2eSBMb3dlciBMYXNlciAyJzogJzRGRjYnLCAvLyBsb3dlciBsYXNlciBmaXJzdCBzZWN0aW9uIGNvbnRpbnVvdXNcclxuICAgICdQdXBwZXQgSGVhdnkgTG93ZXIgTGFzZXIgMyc6ICc1MDg4JywgLy8gbG93ZXIgbGFzZXIgc2Vjb25kIHNlY3Rpb24gaW5pdGlhbFxyXG4gICAgJ1B1cHBldCBIZWF2eSBMb3dlciBMYXNlciA0JzogJzRGRjgnLCAvLyBsb3dlciBsYXNlciBzZWNvbmQgc2VjdGlvbiBjb250aW51b3VzXHJcbiAgICAnUHVwcGV0IEhlYXZ5IExvd2VyIExhc2VyIDUnOiAnNTA4OScsIC8vIGxvd2VyIGxhc2VyIHRoaXJkIHNlY3Rpb24gaW5pdGlhbFxyXG4gICAgJ1B1cHBldCBIZWF2eSBMb3dlciBMYXNlciA2JzogJzRGRjknLCAvLyBsb3dlciBsYXNlciB0aGlyZCBzZWN0aW9uIGNvbnRpbnVvdXNcclxuICAgICdQdXBwZXQgQ29tcG91bmQgSW5jb25ncnVvdXMgU3Bpbic6ICc1MUIyJywgLy8gZmluZCB0aGUgc2FmZSBzcG90IGRvdWJsZSBkYXNoXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgIC8vIFRoaXMgaXMgcHJldHR5IGxhcmdlIGFuZCBnZXR0aW5nIGhpdCBieSBpbml0aWFsIHdpdGhvdXQgYnVybnMgc2VlbXMgZmluZS5cclxuICAgIC8vICdQdXBwZXQgTGlnaHQgSG9taW5nIE1pc3NpbGUgSW1wYWN0JzogJzUyMTAnLCAvLyB0YXJnZXRlZCBmaXJlIGFvZSBmcm9tIE5vIFJlc3RyaWN0aW9uc1xyXG4gICAgJ1B1cHBldCBIZWF2eSBVbmNvbnZlbnRpb25hbCBWb2x0YWdlJzogJzUwMDQnLFxyXG4gICAgLy8gUHJldHR5IG5vaXN5LlxyXG4gICAgJ1B1cHBldCBNYW5ldXZlciBIaWdoLVBvd2VyZWQgTGFzZXInOiAnNTAwMicsIC8vIHRhbmsgbGFzZXJcclxuICAgICdQdXBwZXQgQ29tcG91bmQgTWVjaG5pY2FsIENvbnR1c2lvbiBUYXJnZXRlZCc6ICc1MUI2JywgLy8gdGFyZ2V0ZWQgc3ByZWFkIG1hcmtlclxyXG4gICAgJ1B1cHBldCBDb21wb3VuZCAyUCBSMDEyIExhc2VyIFRhbmsnOiAnNTFBRScsIC8vIHRhcmdldGVkIHNwcmVhZCBwb2QgbGFzZXIgb24gbm9uLXRhbmtcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgJ1B1cHBldCBBZWdpcyBBbnRpLVBlcnNvbm5lbCBMYXNlcic6ICc1MDkwJywgLy8gdGFuayBidXN0ZXIgbWFya2VyXHJcbiAgICAnUHVwcGV0IFN1cGVyaW9yIFByZWNpc2lvbi1HdWlkZWQgTWlzc2lsZSc6ICc0RkM1JyxcclxuICAgICdQdXBwZXQgQ29tcG91bmQgMlAgUjAxMiBMYXNlciBUYW5rJzogJzUxQUQnLCAvLyB0YXJnZXRlZCBwb2QgbGFzZXIgb24gdGFua1xyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnUHVwcGV0IEJ1cm5zJzogJzEwQicsIC8vIHN0YW5kaW5nIGluIG1hbnkgdmFyaW91cyBmaXJlIGFvZXNcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogbWlzc2luZyBTaG9jayBCbGFjayAyP1xyXG4vLyBUT0RPOiBXaGl0ZS9CbGFjayBEaXNzb25hbmNlIGRhbWFnZSBpcyBtYXliZSB3aGVuIGZsYWdzIGVuZCBpbiAwMz9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVUb3dlckF0UGFyYWRpZ21zQnJlYWNoLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdUb3dlciBLbmF2ZSBDb2xvc3NhbCBJbXBhY3QgQ2VudGVyIDEnOiAnNUVBNycsIC8vIENlbnRlciBhb2UgZnJvbSBLbmF2ZSBhbmQgY2xvbmVzXHJcbiAgICAnVG93ZXIgS25hdmUgQ29sb3NzYWwgSW1wYWN0IENlbnRlciAyJzogJzYwQzgnLCAvLyBDZW50ZXIgYW9lIGZyb20gS25hdmUgZHVyaW5nIGx1bmdlXHJcbiAgICAnVG93ZXIgS25hdmUgQ29sb3NzYWwgSW1wYWN0IFNpZGUgMSc6ICc1RUE1JywgLy8gU2lkZSBhb2VzIGZyb20gS25hdmUgYW5kIGNsb25lc1xyXG4gICAgJ1Rvd2VyIEtuYXZlIENvbG9zc2FsIEltcGFjdCBTaWRlIDInOiAnNUVBNicsIC8vIFNpZGUgYW9lcyBmcm9tIEtuYXZlIGFuZCBjbG9uZXNcclxuICAgICdUb3dlciBLbmF2ZSBDb2xvc3NhbCBJbXBhY3QgU2lkZSAzJzogJzYwQzYnLCAvLyBTaWRlIGFvZXMgZnJvbSBLbmF2ZSBkdXJpbmcgbHVuZ2VcclxuICAgICdUb3dlciBLbmF2ZSBDb2xvc3NhbCBJbXBhY3QgU2lkZSA0JzogJzYwQzcnLCAvLyBTaWRlIGFvZXMgZnJvbSBLbmF2ZSBkdXJpbmcgbHVuZ2VcclxuICAgICdUb3dlciBLbmF2ZSBCdXJzdCc6ICc1RUQ0JywgLy8gU3BoZXJvaWQgS25hdmlzaCBCdWxsZXRzIGNvbGxpc2lvblxyXG4gICAgJ1Rvd2VyIEtuYXZlIE1hZ2ljIEJhcnJhZ2UnOiAnNUVBQycsIC8vIFNwaGVyb2lkIGxpbmUgYW9lc1xyXG4gICAgJ1Rvd2VyIEhhbnNlbCBSZXBheSc6ICc1QzcwJywgLy8gU2hpZWxkIGRhbWFnZVxyXG4gICAgJ1Rvd2VyIEhhbnNlbCBFeHBsb3Npb24nOiAnNUM2NycsIC8vIEJlaW5nIGhpdCBieSBNYWdpYyBCdWxsZXQgZHVyaW5nIFBhc3NpbmcgTGFuY2VcclxuICAgICdUb3dlciBIYW5zZWwgSW1wYWN0JzogJzVDNUMnLCAvLyBCZWluZyBoaXQgYnkgTWFnaWNhbCBDb25mbHVlbmNlIGR1cmluZyBXYW5kZXJpbmcgVHJhaWxcclxuICAgICdUb3dlciBIYW5zZWwgQmxvb2R5IFN3ZWVwIDEnOiAnNUM2QycsIC8vIER1YWwgY2xlYXZlcyB3aXRob3V0IHRldGhlclxyXG4gICAgJ1Rvd2VyIEhhbnNlbCBCbG9vZHkgU3dlZXAgMic6ICc1QzZEJywgLy8gRHVhbCBjbGVhdmVzIHdpdGhvdXQgdGV0aGVyXHJcbiAgICAnVG93ZXIgSGFuc2VsIEJsb29keSBTd2VlcCAzJzogJzVDNkUnLCAvLyBEdWFsIGNsZWF2ZXMgd2l0aCB0ZXRoZXJcclxuICAgICdUb3dlciBIYW5zZWwgQmxvb2R5IFN3ZWVwIDQnOiAnNUM2RicsIC8vIER1YWwgY2xlYXZlcyB3aXRoIHRldGhlclxyXG4gICAgJ1Rvd2VyIEhhbnNlbCBQYXNzaW5nIExhbmNlJzogJzVDNjYnLCAvLyBUaGUgUGFzc2luZyBMYW5jZSBjaGFyZ2UgaXRzZWxmXHJcbiAgICAnVG93ZXIgSGFuc2VsIEJyZWF0aHRocm91Z2ggMSc6ICc1NUIzJywgLy8gaGFsZiByb29tIGNsZWF2ZSBkdXJpbmcgV2FuZGVyaW5nIFRyYWlsXHJcbiAgICAnVG93ZXIgSGFuc2VsIEJyZWF0aHRocm91Z2ggMic6ICc1QzVEJywgLy8gaGFsZiByb29tIGNsZWF2ZSBkdXJpbmcgV2FuZGVyaW5nIFRyYWlsXHJcbiAgICAnVG93ZXIgSGFuc2VsIEJyZWF0aHRocm91Z2ggMyc6ICc1QzVFJywgLy8gaGFsZiByb29tIGNsZWF2ZSBkdXJpbmcgV2FuZGVyaW5nIFRyYWlsXHJcbiAgICAnVG93ZXIgSGFuc2VsIEh1bmdyeSBMYW5jZSAxJzogJzVDNzEnLCAvLyAyeGxhcmdlIGNvbmFsIGNsZWF2ZSBkdXJpbmcgV2FuZGVyaW5nIFRyYWlsXHJcbiAgICAnVG93ZXIgSGFuc2VsIEh1bmdyeSBMYW5jZSAyJzogJzVDNzInLCAvLyAyeGxhcmdlIGNvbmFsIGNsZWF2ZSBkdXJpbmcgV2FuZGVyaW5nIFRyYWlsXHJcbiAgICAnVG93ZXIgRmxpZ2h0IFVuaXQgTGlnaHRmYXN0IEJsYWRlJzogJzVCRkUnLCAvLyBsYXJnZSByb29tIGNsZWF2ZVxyXG4gICAgJ1Rvd2VyIEZsaWdodCBVbml0IFN0YW5kYXJkIExhc2VyJzogJzVCRkYnLCAvLyB0cmFja2luZyBsYXNlclxyXG4gICAgJ1Rvd2VyIDJQIFdoaXJsaW5nIEFzc2F1bHQnOiAnNUJGQicsIC8vIGxpbmUgYW9lIGZyb20gMlAgY2xvbmVzXHJcbiAgICAnVG93ZXIgMlAgQmFsYW5jZWQgRWRnZSc6ICc1QkZBJywgLy8gY2lyY3VsYXIgYW9lIG9uIDJQIGNsb25lc1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgMSc6ICc2MDA2JywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgMic6ICc2MDA3JywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgMyc6ICc2MDA4JywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgNCc6ICc2MDA5JywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgNSc6ICc2MzEwJywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgNic6ICc2MzExJywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgNyc6ICc2MzEyJywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIEdlbmVyYXRlIEJhcnJpZXIgOCc6ICc2MzEzJywgLy8gYmVpbmcgaGl0IGJ5IGJhcnJpZXJzIGFwcGVhcmluZ1xyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIFNob2NrIFdoaXRlIDEnOiAnNjAwRicsIC8vIHdoaXRlIHNob2Nrd2F2ZSBjaXJjbGUgbm90IGRyb3BwZWQgb24gYmxhY2tcclxuICAgICdUb3dlciBSZWQgR2lybCBTaG9jayBXaGl0ZSAyJzogJzYwMTAnLCAvLyB3aGl0ZSBzaG9ja3dhdmUgY2lyY2xlIG5vdCBkcm9wcGVkIG9uIGJsYWNrXHJcbiAgICAnVG93ZXIgUmVkIEdpcmwgU2hvY2sgQmxhY2sgMSc6ICc2MDExJywgLy8gYmxhY2sgc2hvY2t3YXZlIGNpcmNsZSBub3QgZHJvcHBlZCBvbiB3aGl0ZVxyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIFBvaW50IFdoaXRlIDEnOiAnNjAxRicsIC8vIGJlaW5nIGhpdCBieSBhIHdoaXRlIGxhc2VyXHJcbiAgICAnVG93ZXIgUmVkIEdpcmwgUG9pbnQgV2hpdGUgMic6ICc2MDIxJywgLy8gYmVpbmcgaGl0IGJ5IGEgd2hpdGUgbGFzZXJcclxuICAgICdUb3dlciBSZWQgR2lybCBQb2ludCBCbGFjayAxJzogJzYwMjAnLCAvLyBiZWluZyBoaXQgYnkgYSBibGFjayBsYXNlclxyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIFBvaW50IEJsYWNrIDInOiAnNjAyMicsIC8vIGJlaW5nIGhpdCBieSBhIGJsYWNrIGxhc2VyXHJcbiAgICAnVG93ZXIgUmVkIEdpcmwgV2lwZSBXaGl0ZSc6ICc2MDBDJywgLy8gbm90IGxpbmUgb2Ygc2lnaHRpbmcgdGhlIHdoaXRlIG1ldGVvclxyXG4gICAgJ1Rvd2VyIFJlZCBHaXJsIFdpcGUgQmxhY2snOiAnNjAwRCcsIC8vIG5vdCBsaW5lIG9mIHNpZ2h0aW5nIHRoZSBibGFjayBtZXRlb3JcclxuICAgICdUb3dlciBSZWQgR2lybCBEaWZmdXNlIEVuZXJneSc6ICc2MDU2JywgLy8gcm90YXRpbmcgY2xvbmUgYnViYmxlIGNsZWF2ZXNcclxuICAgICdUb3dlciBSZWQgR2lybCBQeWxvbiBCaWcgRXhwbG9zaW9uJzogJzYwMjcnLCAvLyBub3Qga2lsbGluZyBhIHB5bG9uIGR1cmluZyBoYWNraW5nIHBoYXNlXHJcbiAgICAnVG93ZXIgUmVkIEdpcmwgUHlsb24gRXhwbG9zaW9uJzogJzYwMjYnLCAvLyBweWxvbiBkdXJpbmcgQ2hpbGQncyBwbGF5XHJcbiAgICAnVG93ZXIgUGhpbG9zb3BoZXIgRGVwbG95IEFybWFtZW50cyBNaWRkbGUnOiAnNUMwMicsIC8vIG1pZGRsZSBsYXNlclxyXG4gICAgJ1Rvd2VyIFBoaWxvc29waGVyIERlcGxveSBBcm1hbWVudHMgU2lkZXMnOiAnNUMwNScsIC8vIHNpZGVzIGxhc2VyXHJcbiAgICAnVG93ZXIgUGhpbG9zb3BoZXIgRGVwbG95IEFybWFtZW50cyAzJzogJzYwNzgnLCAvLyBnb2VzIHdpdGggNUMwMVxyXG4gICAgJ1Rvd2VyIFBoaWxvc29waGVyIERlcGxveSBBcm1hbWVudHMgNCc6ICc2MDc5JywgLy8gZ29lcyB3aXRoIDVDMDRcclxuICAgICdUb3dlciBQaGlsb3NvcGhlciBFbmVyZ3kgQm9tYic6ICc1QzA1JywgLy8gcGluayBidWJibGVcclxuICAgICdUb3dlciBGYWxzZSBJZG9sIE1hZGUgTWFnaWMgUmlnaHQnOiAnNUJENycsIC8vIHJvdGF0aW5nIHdoZWVsIGdvaW5nIHJpZ2h0XHJcbiAgICAnVG93ZXIgRmFsc2UgSWRvbCBNYWRlIE1hZ2ljIExlZnQnOiAnNUJENicsIC8vIHJvdGF0aW5nIHdoZWVsIGdvaW5nIGxlZnRcclxuICAgICdUb3dlciBGYWxzZSBJZG9sIExpZ2h0ZXIgTm90ZSc6ICc1QkRBJywgLy8gbGlnaHRlciBub3RlIG1vdmluZyBhb2VzXHJcbiAgICAnVG93ZXIgRmFsc2UgSWRvbCBNYWdpY2FsIEludGVyZmVyZW5jZSc6ICc1QkQ1JywgLy8gbGFzZXJzIGR1cmluZyBSaHl0aG0gUmluZ3NcclxuICAgICdUb3dlciBGYWxzZSBJZG9sIFNjYXR0ZXJlZCBNYWdpYyc6ICc1QkRGJywgLy8gY2lyY2xlIGFvZXMgZnJvbSBTZWVkIE9mIE1hZ2ljXHJcbiAgICAnVG93ZXIgSGVyIEluZmxvcmVzY2VuY2UgVW5ldmVuIEZvdHRpbmcnOiAnNUJFMicsIC8vIGJ1aWxkaW5nIGZyb20gUmVjcmVhdGUgU3RydWN0dXJlXHJcbiAgICAnVG93ZXIgSGVyIEluZmxvcmVzY2VuY2UgQ3Jhc2gnOiAnNUJFNScsIC8vIHRyYWlucyBmcm9tIE1peGVkIFNpZ25hbHNcclxuICAgICdUb3dlciBIZXIgSW5mbG9yZXNjZW5jZSBIZWF2eSBBcm1zIDEnOiAnNUJFRCcsIC8vIGhlYXZ5IGFybXMgZnJvbnQvYmFjayBhdHRhY2tcclxuICAgICdUb3dlciBIZXIgSW5mbG9yZXNjZW5jZSBIZWF2eSBBcm1zIDInOiAnNUJFRicsIC8vIGhlYXZ5IGFybXMgc2lkZXMgYXR0YWNrXHJcbiAgICAnVG93ZXIgSGVyIEluZmxvcmVzY2VuY2UgRW5lcmd5IFNjYXR0ZXJlZCBNYWdpYyc6ICc1QkU4JywgLy8gb3JicyBmcm9tIFJlZCBHaXJsIGJ5IHRyYWluXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnVG93ZXIgSGVyIEluZmxvcmVzY2VuY2UgUGxhY2UgT2YgUG93ZXInOiAnNUMwRCcsIC8vIGluc3RhZGVhdGggbWlkZGxlIGNpcmNsZSBiZWZvcmUgYmxhY2svd2hpdGUgcmluZ3NcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1Rvd2VyIEtuYXZlIE1hZ2ljIEFydGlsbGVyeSBBbHBoYSc6ICc1RUFCJywgLy8gU3ByZWFkXHJcbiAgICAnVG93ZXIgSGFuc2VsIFNlZWQgT2YgTWFnaWMgQWxwaGEnOiAnNUM2MScsIC8vIFNwcmVhZFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnVG93ZXIgS25hdmUgTWFnaWMgQXJ0aWxsZXJ5IEJldGEnOiAnNUVCMycsIC8vIFRhbmtidXN0ZXJcclxuICAgICdUb3dlciBSZWQgR2lybCBNYW5pcHVsYXRlIEVuZXJneSc6ICc2MDFBJywgLy8gVGFua2J1c3RlclxyXG4gICAgJ1Rvd2VyIEZhbHNlIElkb2wgRGFya2VyIE5vdGUnOiAnNUJEQycsIC8vIFRhbmtidXN0ZXJcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVG93ZXIgS25vY2tlZCBPZmYnLFxyXG4gICAgICAvLyA1RUIxID0gS25hdmUgTHVuZ2VcclxuICAgICAgLy8gNUJGMiA9IEhlciBJbmZsb3Jlc2VuY2UgU2hvY2t3YXZlXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogWyc1RUIxJywgJzVCRjInXSB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ0tub2NrZWQgb2ZmJyxcclxuICAgICAgICAgICAgZGU6ICdSdW50ZXJnZWZhbGxlbicsXHJcbiAgICAgICAgICAgIGZyOiAnQSDDqXTDqSBhc3NvbW3DqShlKScsXHJcbiAgICAgICAgICAgIGphOiAn44OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwsScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkFrYWRhZW1pYUFueWRlcixcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnQW55ZGVyIEFjcmlkIFN0cmVhbSc6ICc0MzA0JyxcclxuICAgICdBbnlkZXIgV2F0ZXJzcG91dCc6ICc0MzA2JyxcclxuICAgICdBbnlkZXIgUmFnaW5nIFdhdGVycyc6ICc0MzAyJyxcclxuICAgICdBbnlkZXIgVmlvbGVudCBCcmVhY2gnOiAnNDMwNScsXHJcbiAgICAnQW55ZGVyIFRpZGFsIEd1aWxsb3RpbmUgMSc6ICczRTA4JyxcclxuICAgICdBbnlkZXIgVGlkYWwgR3VpbGxvdGluZSAyJzogJzNFMEEnLFxyXG4gICAgJ0FueWRlciBQZWxhZ2ljIENsZWF2ZXIgMSc6ICczRTA5JyxcclxuICAgICdBbnlkZXIgUGVsYWdpYyBDbGVhdmVyIDInOiAnM0UwQicsXHJcbiAgICAnQW55ZGVyIEFxdWF0aWMgTGFuY2UnOiAnM0UwNScsXHJcbiAgICAnQW55ZGVyIFN5cnVwIFNwb3V0JzogJzQzMDgnLFxyXG4gICAgJ0FueWRlciBOZWVkbGUgU3Rvcm0nOiAnNDMwOScsXHJcbiAgICAnQW55ZGVyIEV4dGVuc2libGUgVGVuZHJpbHMgMSc6ICczRTEwJyxcclxuICAgICdBbnlkZXIgRXh0ZW5zaWJsZSBUZW5kcmlscyAyJzogJzNFMTEnLFxyXG4gICAgJ0FueWRlciBQdXRyaWQgQnJlYXRoJzogJzNFMTInLFxyXG4gICAgJ0FueWRlciBEZXRvbmF0b3InOiAnNDMwRicsXHJcbiAgICAnQW55ZGVyIERvbWluaW9uIFNsYXNoJzogJzQzMEQnLFxyXG4gICAgJ0FueWRlciBRdWFzYXInOiAnNDMwQicsXHJcbiAgICAnQW55ZGVyIERhcmsgQXJyaXZpc21lJzogJzQzMEUnLFxyXG4gICAgJ0FueWRlciBUaHVuZGVyc3Rvcm0nOiAnM0UxQycsXHJcbiAgICAnQW55ZGVyIFdpbmRpbmcgQ3VycmVudCc6ICczRTFGJyxcclxuICAgIC8vIDNFMjAgaXMgYmVpbmcgaGl0IGJ5IHRoZSBncm93aW5nIG9yYnMsIG1heWJlP1xyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkFtYXVyb3QsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0FtYXVyb3QgQnVybmluZyBTa3knOiAnMzU0QScsXHJcbiAgICAnQW1hdXJvdCBXaGFjayc6ICczNTNDJyxcclxuICAgICdBbWF1cm90IEFldGhlcnNwaWtlJzogJzM1M0InLFxyXG4gICAgJ0FtYXVyb3QgVmVuZW1vdXMgQnJlYXRoJzogJzNDQ0UnLFxyXG4gICAgJ0FtYXVyb3QgQ29zbWljIFNocmFwbmVsJzogJzREMjYnLFxyXG4gICAgJ0FtYXVyb3QgRWFydGhxdWFrZSc6ICczQ0NEJyxcclxuICAgICdBbWF1cm90IE1ldGVvciBSYWluJzogJzNDQzYnLFxyXG4gICAgJ0FtYXVyb3QgRmluYWwgU2t5JzogJzNDQ0InLFxyXG4gICAgJ0FtYXVyb3QgTWFsZXZvbGVuY2UnOiAnMzU0MScsXHJcbiAgICAnQW1hdXJvdCBUdXJuYWJvdXQnOiAnMzU0MicsXHJcbiAgICAnQW1hdXJvdCBTaWNrbHkgSW5mZXJubyc6ICczREUzJyxcclxuICAgICdBbWF1cm90IERpc3F1aWV0aW5nIEdsZWFtJzogJzM1NDYnLFxyXG4gICAgJ0FtYXVyb3QgQmxhY2sgRGVhdGgnOiAnMzU0MycsXHJcbiAgICAnQW1hdXJvdCBGb3JjZSBvZiBMb2F0aGluZyc6ICczNTQ0JyxcclxuICAgICdBbWF1cm90IERhbW5pbmcgUmF5IDEnOiAnM0UwMCcsXHJcbiAgICAnQW1hdXJvdCBEYW1uaW5nIFJheSAyJzogJzNFMDEnLFxyXG4gICAgJ0FtYXVyb3QgRGVhZGx5IFRlbnRhY2xlcyc6ICczNTQ3JyxcclxuICAgICdBbWF1cm90IE1pc2ZvcnR1bmUnOiAnM0NFMicsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnQW1hdXJvdCBBcG9rYWx5cHNpcyc6ICczQ0Q3JyxcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5BbmFtbmVzaXNBbnlkZXIsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0FuYW1uZXNpcyBUcmVuY2ggUGh1YWJvIFNwaW5lIExhc2gnOiAnNEQxQScsIC8vIGZyb250YWwgY29uYWxcclxuICAgICdBbmFtbmVzaXMgVHJlbmNoIEFuZW1vbmUgRmFsbGluZyBSb2NrJzogJzRFMzcnLCAvLyBncm91bmQgY2lyY2xlIGFvZSBmcm9tIFRyZW5jaCBBbmVtb25lIHNob3dpbmcgdXBcclxuICAgICdBbmFtbmVzaXMgVHJlbmNoIERhZ29uaXRlIFNld2VyIFdhdGVyJzogJzREMUMnLCAvLyBmcm9udGFsIGNvbmFsIGZyb20gVHJlbmNoIEFuZW1vbmUgKD8hKVxyXG4gICAgJ0FuYW1uZXNpcyBUcmVuY2ggWW92cmEgUm9jayBIYXJkJzogJzREMjEnLCAvLyB0YXJnZXRlZCBjaXJjbGUgYW9lXHJcbiAgICAnQW5hbW5lc2lzIFRyZW5jaCBZb3ZyYSBUb3JyZW50aWFsIFRvcm1lbnQnOiAnNEQyMScsIC8vIGZyb250YWwgY29uYWxcclxuICAgICdBbmFtbmVzaXMgVW5rbm93biBMdW1pbm91cyBSYXknOiAnNEUyNycsIC8vIFVua25vd24gbGluZSBhb2VcclxuICAgICdBbmFtbmVzaXMgVW5rbm93biBTaW5zdGVyIEJ1YmJsZSBFeHBsb3Npb24nOiAnNEI2RScsIC8vIFVua25vd24gZXhwbG9zaW9ucyBkdXJpbmcgU2NydXRpbnlcclxuICAgICdBbmFtbmVzaXMgVW5rbm93biBSZWZsZWN0aW9uJzogJzRCNkYnLCAvLyBVbmtub3duIGNvbmFsIGF0dGFjayBkdXJpbmcgU2NydXRpbnlcclxuICAgICdBbmFtbmVzaXMgVW5rbm93biBDbGVhcm91dCAxJzogJzRCNzQnLCAvLyBVbmtub3duIGZyb250YWwgY29uZVxyXG4gICAgJ0FuYW1uZXNpcyBVbmtub3duIENsZWFyb3V0IDInOiAnNEI2QicsIC8vIFVua25vd24gZnJvbnRhbCBjb25lXHJcbiAgICAnQW5hbW5lc2lzIFVua25vd24gU2V0YmFjayAxJzogJzRCNzUnLCAvLyBVbmtub3duIHJlYXIgY29uZVxyXG4gICAgJ0FuYW1uZXNpcyBVbmtub3duIFNldGJhY2sgMic6ICc1QjZDJywgLy8gVW5rbm93biByZWFyIGNvbmVcclxuICAgICdBbmFtbmVzaXMgQW55ZGVyIENsaW9uaWQgQWNyaWQgU3RyZWFtJzogJzREMjQnLCAvLyB0YXJnZXRlZCBjaXJjbGUgYW9lXHJcbiAgICAnQW5hbW5lc2lzIEFueWRlciBEaXZpbmVyIERyZWFkc3Rvcm0nOiAnNEQyOCcsIC8vIGdyb3VuZCBjaXJjbGUgYW9lXHJcbiAgICAnQW5hbW5lc2lzIEt5a2xvcHMgMjAwMC1NaW5hIFN3aW5nJzogJzRCNTUnLCAvLyBLeWtsb3BzIGdldCBvdXQgbWVjaGFuaWNcclxuICAgICdBbmFtbmVzaXMgS3lrbG9wcyBUZXJyaWJsZSBIYW1tZXInOiAnNEI1RCcsIC8vIEt5a2xvcHMgSGFtbWVyL0JsYWRlIGFsdGVybmF0aW5nIHNxdWFyZXNcclxuICAgICdBbmFtbmVzaXMgS3lrbG9wcyBUZXJyaWJsZSBCbGFkZSc6ICc0QjVFJywgLy8gS3lrbG9wcyBIYW1tZXIvQmxhZGUgYWx0ZXJuYXRpbmcgc3F1YXJlc1xyXG4gICAgJ0FuYW1uZXNpcyBLeWtsb3BzIFJhZ2luZyBHbG93ZXInOiAnNEI1NicsIC8vIEt5a2xvcHMgbGluZSBhb2VcclxuICAgICdBbmFtbmVzaXMgS3lrbG9wcyBFeWUgT2YgVGhlIEN5Y2xvbmUnOiAnNEI1NycsIC8vIEt5a2xvcHMgZG9udXRcclxuICAgICdBbmFtbmVzaXMgQW55ZGVyIEhhcnBvb25lciBIeWRyb2JhbGwnOiAnNEQyNicsIC8vIGZyb250YWwgY29uYWxcclxuICAgICdBbmFtbmVzaXMgUnVrc2hzIFN3aWZ0IFNoaWZ0JzogJzRCODMnLCAvLyBSdWtzaHMgRGVlbSB0ZWxlcG9ydCBOL1NcclxuICAgICdBbmFtbmVzaXMgUnVrc2hzIERlcHRoIEdyaXAgV2F2ZWJyZWFrZXInOiAnMzNENCcsIC8vIFJ1a3NocyBEZWVtIGhhbmQgYXR0YWNrc1xyXG4gICAgJ0FuYW1uZXNpcyBSdWtzaHMgUmlzaW5nIFRpZGUnOiAnNEI4QicsIC8vIFJ1a3NocyBEZWVtIGNyb3NzIGFvZVxyXG4gICAgJ0FuYW1uZXNpcyBSdWtzaHMgQ29tbWFuZCBDdXJyZW50JzogJzRCODInLCAvLyBSdWtzaHMgRGVlbSBwcm90ZWFuLWlzaCBncm91bmQgYW9lc1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnQW5hbW5lc2lzIFRyZW5jaCBYem9taXQgTWFudGxlIERyaWxsJzogJzREMTknLCAvLyBjaGFyZ2UgYXR0YWNrXHJcbiAgICAnQW5hbW5lc2lzIElvIE91c2lhIEJhcnJlbGluZyBTbWFzaCc6ICc0RTI0JywgLy8gY2hhcmdlIGF0dGFja1xyXG4gICAgJ0FuYW1uZXNpcyBLeWtsb3BzIFdhbmRlcmVyXFwncyBQeXJlJzogJzRCNUYnLCAvLyBLeWtsb3BzIHNwcmVhZCBhdHRhY2tcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogTWlzc2luZyBHcm93aW5nIHRldGhlcnMgb24gYm9zcyAyLlxyXG4vLyAoTWF5YmUgZ2F0aGVyIHBhcnR5IG1lbWJlciBuYW1lcyBvbiB0aGUgcHJldmlvdXMgVElJSUlNQkVFRUVFRVIgY2FzdCBmb3IgY29tcGFyaXNvbj8pXHJcbi8vIFRPRE86IEZhaWxpbmcgdG8gaW50ZXJydXB0IERvaG5mYXVzdCBGdWF0aCBvbiBXYXRlcmluZyBXaGVlbCBjYXN0cz9cclxuLy8gKDE1Oi4uLi4uLi4uOkRvaG5mYXN0IEZ1YXRoOjNEQUE6V2F0ZXJpbmcgV2hlZWw6Li4uLi4uLi46KFxceXtOYW1lfSk6KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkRvaG5NaGVnLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdEb2huIE1oZWcgR2V5c2VyJzogJzIyNjAnLCAvLyBXYXRlciBlcnVwdGlvbnMsIGJvc3MgMVxyXG4gICAgJ0RvaG4gTWhlZyBIeWRyb2ZhbGwnOiAnMjJCRCcsIC8vIEdyb3VuZCBBb0UgbWFya2VyLCBib3NzIDFcclxuICAgICdEb2huIE1oZWcgTGF1Z2hpbmcgTGVhcCc6ICcyMjk0JywgLy8gR3JvdW5kIEFvRSBtYXJrZXIsIGJvc3MgMVxyXG4gICAgJ0RvaG4gTWhlZyBTd2luZ2UnOiAnMjJDQScsIC8vIEZyb250YWwgY29uZSwgYm9zcyAyXHJcbiAgICAnRG9obiBNaGVnIENhbm9weSc6ICczREIwJywgLy8gRnJvbnRhbCBjb25lLCBEb2huZmF1c3QgUm93YW5zIHRocm91Z2hvdXQgaW5zdGFuY2VcclxuICAgICdEb2huIE1oZWcgUGluZWNvbmUgQm9tYic6ICczREIxJywgLy8gQ2lyY3VsYXIgZ3JvdW5kIEFvRSBtYXJrZXIsIERvaG5mYXVzdCBSb3dhbnMgdGhyb3VnaG91dCBpbnN0YW5jZVxyXG4gICAgJ0RvaG4gTWhlZyBCaWxlIEJvbWJhcmRtZW50JzogJzM0RUUnLCAvLyBHcm91bmQgQW9FIG1hcmtlciwgYm9zcyAzXHJcbiAgICAnRG9obiBNaGVnIENvcnJvc2l2ZSBCaWxlJzogJzM0RUMnLCAvLyBGcm9udGFsIGNvbmUsIGJvc3MgM1xyXG4gICAgJ0RvaG4gTWhlZyBGbGFpbGluZyBUZW50YWNsZXMnOiAnMzY4MScsXHJcblxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdEb2huIE1oZWcgSW1wIENob2lyJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzQ2RScgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdEb2huIE1oZWcgVG9hZCBDaG9pcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcxQjcnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5lZmZlY3QgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRG9obiBNaGVnIEZvb2xcXCdzIFR1bWJsZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcxODMnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5lZmZlY3QgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmltcG9ydCB7IHBsYXllckRhbWFnZUZpZWxkcyB9IGZyb20gJy4uLy4uLy4uL29vcHN5X2NvbW1vbic7XHJcblxyXG4vLyBUT0RPOiBCZXJzZXJrZXIgMm5kLzNyZCB3aWxkIGFuZ3Vpc2ggc2hvdWxkIGJlIHNoYXJlZCB3aXRoIGp1c3QgYSByb2NrXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlSGVyb2VzR2F1bnRsZXQsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1RIRyBCbGFkZVxcJ3MgQmVuaXNvbic6ICc1MjI4JywgLy8gcGxkIGNvbmFsXHJcbiAgICAnVEhHIEFic29sdXRlIEhvbHknOiAnNTI0QicsIC8vIHdobSB2ZXJ5IGxhcmdlIGFvZVxyXG4gICAgJ1RIRyBIaXNzYXRzdTogR29rYSc6ICc1MjNEJywgLy8gc2FtIGxpbmUgYW9lXHJcbiAgICAnVEhHIFdob2xlIFNlbGYnOiAnNTIyRCcsIC8vIG1uayB3aWRlIGxpbmUgYW9lXHJcbiAgICAnVEhHIFJhbmRncml0aCc6ICc1MjMyJywgLy8gZHJnIHZlcnkgYmlnIGxpbmUgYW9lXHJcbiAgICAnVEhHIFZhY3V1bSBCbGFkZSAxJzogJzUwNjEnLCAvLyBTcGVjdHJhbCBUaGllZiBjaXJjdWxhciBncm91bmQgYW9lIGZyb20gbWFya2VyXHJcbiAgICAnVEhHIFZhY3V1bSBCbGFkZSAyJzogJzUwNjInLCAvLyBTcGVjdHJhbCBUaGllZiBjaXJjdWxhciBncm91bmQgYW9lIGZyb20gbWFya2VyXHJcbiAgICAnVEhHIENvd2FyZFxcJ3MgQ3VubmluZyc6ICc0RkQ3JywgLy8gU3BlY3RyYWwgVGhpZWYgQ2hpY2tlbiBLbmlmZSBsYXNlclxyXG4gICAgJ1RIRyBQYXBlcmN1dHRlciAxJzogJzRGRDEnLCAvLyBTcGVjdHJhbCBUaGllZiBsaW5lIGFvZSBmcm9tIG1hcmtlclxyXG4gICAgJ1RIRyBQYXBlcmN1dHRlciAyJzogJzRGRDInLCAvLyBTcGVjdHJhbCBUaGllZiBsaW5lIGFvZSBmcm9tIG1hcmtlclxyXG4gICAgJ1RIRyBSaW5nIG9mIERlYXRoJzogJzUyMzYnLCAvLyBkcmcgY2lyY3VsYXIgYW9lXHJcbiAgICAnVEhHIEx1bmFyIEVjbGlwc2UnOiAnNTIyNycsIC8vIHBsZCBjaXJjdWxhciBhb2VcclxuICAgICdUSEcgQWJzb2x1dGUgR3Jhdml0eSc6ICc1MjQ4JywgLy8gaW5rIG1hZ2UgY2lyY3VsYXJcclxuICAgICdUSEcgUmFpbiBvZiBMaWdodCc6ICc1MjQyJywgLy8gYmFyZCBsYXJnZSBjaXJjdWxlIGFvZVxyXG4gICAgJ1RIRyBEb29taW5nIEZvcmNlJzogJzUyMzknLCAvLyBkcmcgbGluZSBhb2VcclxuICAgICdUSEcgQWJzb2x1dGUgRGFyayBJSSc6ICc0RjYxJywgLy8gTmVjcm9tYW5jZXIgMTIwIGRlZ3JlZSBjb25hbFxyXG4gICAgJ1RIRyBCdXJzdCc6ICc1M0I3JywgLy8gTmVjcm9tYW5jZXIgbmVjcm9idXJzdCBzbWFsbCB6b21iaWUgZXhwbG9zaW9uXHJcbiAgICAnVEhHIFBhaW4gTWlyZSc6ICc0RkE0JywgLy8gTmVjcm9tYW5jZXIgdmVyeSBsYXJnZSBncmVlbiBibGVlZCBwdWRkbGVcclxuICAgICdUSEcgRGFyayBEZWx1Z2UnOiAnNEY1RCcsIC8vIE5lY3JvbWFuY2VyIGdyb3VuZCBhb2VcclxuICAgICdUSEcgVGVra2EgR29qaW4nOiAnNTIzRScsIC8vIHNhbSA5MCBkZWdyZWUgY29uYWxcclxuICAgICdUSEcgUmFnaW5nIFNsaWNlIDEnOiAnNTIwQScsIC8vIEJlcnNlcmtlciBsaW5lIGNsZWF2ZVxyXG4gICAgJ1RIRyBSYWdpbmcgU2xpY2UgMic6ICc1MjBCJywgLy8gQmVyc2Vya2VyIGxpbmUgY2xlYXZlXHJcbiAgICAnVEhHIFdpbGQgUmFnZSc6ICc1MjAzJywgLy8gQmVyc2Vya2VyIGJsdWUga25vY2tiYWNrIHB1Y2tcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1RIRyBBYnNvbHV0ZSBUaHVuZGVyIElWJzogJzUyNDUnLCAvLyBoZWFkbWFya2VyIGFvZSBmcm9tIGJsbVxyXG4gICAgJ1RIRyBNb29uZGl2ZXInOiAnNTIzMycsIC8vIGhlYWRtYXJrZXIgYW9lIGZyb20gZHJnXHJcbiAgICAnVEhHIFNwZWN0cmFsIEd1c3QnOiAnNTNDRicsIC8vIFNwZWN0cmFsIFRoaWVmIGhlYWRtYXJrZXIgYW9lXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgICdUSEcgRmFsbGluZyBSb2NrJzogJzUyMDUnLCAvLyBCZXJzZXJrZXIgaGVhZG1hcmtlciBhb2UgdGhhdCBjcmVhdGVzIHJ1YmJsZVxyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnVEhHIEJsZWVkaW5nJzogJzgyOCcsIC8vIFN0YW5kaW5nIGluIHRoZSBOZWNyb21hbmNlciBwdWRkbGUgb3Igb3V0c2lkZSB0aGUgQmVyc2Vya2VyIGFyZW5hXHJcbiAgfSxcclxuICBnYWluc0VmZmVjdEZhaWw6IHtcclxuICAgICdUSEcgVHJ1bHkgQmVyc2Vyayc6ICc5MDYnLCAvLyBTdGFuZGluZyBpbiB0aGUgY3JhdGVyIHRvbyBsb25nXHJcbiAgfSxcclxuICBzb2xvV2Fybjoge1xyXG4gICAgLy8gVGhpcyBzaG91bGQgYWx3YXlzIGJlIHNoYXJlZC4gIE9uIGFsbCB0aW1lcyBidXQgdGhlIDJuZCBhbmQgM3JkLCBpdCdzIGEgcGFydHkgc2hhcmUuXHJcbiAgICAvLyBUT0RPOiBvbiB0aGUgMm5kIGFuZCAzcmQgdGltZSB0aGlzIHNob3VsZCBvbmx5IGJlIHNoYXJlZCB3aXRoIGEgcm9jay5cclxuICAgIC8vIFRPRE86IGFsdGVybmF0aXZlbHkgd2FybiBvbiB0YWtpbmcgb25lIG9mIHRoZXNlIHdpdGggYSA0NzIgTWFnaWMgVnVsbmVyYWJpbGl0eSBVcCBlZmZlY3RcclxuICAgICdUSEcgV2lsZCBBbmd1aXNoJzogJzUyMDknLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdUSEcgV2lsZCBSYW1wYWdlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzUyMDcnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIC8vIFRoaXMgaXMgemVybyBkYW1hZ2UgaWYgeW91IGFyZSBpbiB0aGUgY3JhdGVyLlxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLkRhbWFnZUZyb21NYXRjaGVzKG1hdGNoZXMpID4gMCxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5Ib2xtaW5zdGVyU3dpdGNoLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdIb2xtaW5zdGVyIFRodW1ic2NyZXcnOiAnM0RDNicsXHJcbiAgICAnSG9sbWluc3RlciBXb29kZW4gaG9yc2UnOiAnM0RDNycsXHJcbiAgICAnSG9sbWluc3RlciBMaWdodCBTaG90JzogJzNEQzgnLFxyXG4gICAgJ0hvbG1pbnN0ZXIgSGVyZXRpY1xcJ3MgRm9yayc6ICczRENFJyxcclxuICAgICdIb2xtaW5zdGVyIEhvbHkgV2F0ZXInOiAnM0RENCcsXHJcbiAgICAnSG9sbWluc3RlciBGaWVyY2UgQmVhdGluZyAxJzogJzNEREQnLFxyXG4gICAgJ0hvbG1pbnN0ZXIgRmllcmNlIEJlYXRpbmcgMic6ICczRERFJyxcclxuICAgICdIb2xtaW5zdGVyIEZpZXJjZSBCZWF0aW5nIDMnOiAnM0RERicsXHJcbiAgICAnSG9sbWluc3RlciBDYXQgT1xcJyBOaW5lIFRhaWxzJzogJzNERTEnLFxyXG4gICAgJ0hvbG1pbnN0ZXIgUmlnaHQgS25vdXQnOiAnM0RFNicsXHJcbiAgICAnSG9sbWluc3RlciBMZWZ0IEtub3V0JzogJzNERTcnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0hvbG1pbnN0ZXIgQWV0aGVyc3VwJzogJzNERTknLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnSG9sbWluc3RlciBGbGFnZWxsYXRpb24nOiAnM0RENicsXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgICdIb2xtaW5zdGVyIFRhcGhlcGhvYmlhJzogJzQxODEnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLk1hbGlrYWhzV2VsbCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnTWFsaWthaCBGYWxsaW5nIFJvY2snOiAnM0NFQScsXHJcbiAgICAnTWFsaWthaCBXZWxsYm9yZSc6ICczQ0VEJyxcclxuICAgICdNYWxpa2FoIEdleXNlciBFcnVwdGlvbic6ICczQ0VFJyxcclxuICAgICdNYWxpa2FoIFN3aWZ0IFNwaWxsJzogJzNDRjAnLFxyXG4gICAgJ01hbGlrYWggQnJlYWtpbmcgV2hlZWwgMSc6ICczQ0Y1JyxcclxuICAgICdNYWxpa2FoIENyeXN0YWwgTmFpbCc6ICczQ0Y3JyxcclxuICAgICdNYWxpa2FoIEhlcmV0aWNcXCdzIEZvcmsgMSc6ICczQ0Y5JyxcclxuICAgICdNYWxpa2FoIEJyZWFraW5nIFdoZWVsIDInOiAnM0NGQScsXHJcbiAgICAnTWFsaWthaCBIZXJldGljXFwncyBGb3JrIDInOiAnM0UwRScsXHJcbiAgICAnTWFsaWthaCBFYXJ0aHNoYWtlJzogJzNFMzknLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogY291bGQgaW5jbHVkZSA1NDg0IE11ZG1hbiBSb2NreSBSb2xsIGFzIGEgc2hhcmVXYXJuLCBidXQgaXQncyBsb3cgZGFtYWdlIGFuZCBjb21tb24uXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuTWF0b3lhc1JlbGljdCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnTWF0b3lhIFJlbGljdCBXZXJld29vZCBPdmF0aW9uJzogJzU1MTgnLCAvLyBsaW5lIGFvZVxyXG4gICAgJ01hdG95YSBDYXZlIFRhcmFudHVsYSBIYXdrIEFwaXRveGluJzogJzU1MTknLCAvLyBiaWcgY2lyY2xlIGFvZVxyXG4gICAgJ01hdG95YSBTcHJpZ2dhbiBTdG9uZWJlYXJlciBSb21wJzogJzU1MUEnLCAvLyBjb25hbCBhb2VcclxuICAgICdNYXRveWEgU29ubnkgT2YgWmlnZ3kgSml0dGVyaW5nIEdsYXJlJzogJzU1MUMnLCAvLyBsb25nIG5hcnJvdyBjb25hbCBhb2VcclxuICAgICdNYXRveWEgTXVkbWFuIFF1YWdtaXJlJzogJzU0ODEnLCAvLyBNdWRtYW4gYW9lIHB1ZGRsZXNcclxuICAgICdNYXRveWEgTXVkbWFuIEJyaXR0bGUgQnJlY2NpYSAxJzogJzU0OEUnLCAvLyBleHBhbmRpbmcgY2lyY2xlIGFvZVxyXG4gICAgJ01hdG95YSBNdWRtYW4gQnJpdHRsZSBCcmVjY2lhIDInOiAnNTQ4RicsIC8vIGV4cGFuZGluZyBjaXJjbGUgYW9lXHJcbiAgICAnTWF0b3lhIE11ZG1hbiBCcml0dGxlIEJyZWNjaWEgMyc6ICc1NDkwJywgLy8gZXhwYW5kaW5nIGNpcmNsZSBhb2VcclxuICAgICdNYXRveWEgTXVkbWFuIE11ZCBCdWJibGUnOiAnNTQ4NycsIC8vIHN0YW5kaW5nIGluIG11ZCBwdWRkbGU/XHJcbiAgICAnTWF0b3lhIENhdmUgUHVnaWwgU2NyZXdkcml2ZXInOiAnNTUxRScsIC8vIGNvbmFsIGFvZVxyXG4gICAgJ01hdG95YSBOaXhpZSBHdXJnbGUnOiAnNTk5MicsIC8vIE5peGllIHdhbGwgZmx1c2hcclxuICAgICdNYXRveWEgUmVsaWN0IE1vbHRlbiBQaG9lYmFkIFB5cm9jbGFzdGljIFNob3QnOiAnNTdFQicsIC8vIHRoZSBsaW5lIGFvZXMgYXMgeW91IHJ1biB0byB0cmFzaFxyXG4gICAgJ01hdG95YSBSZWxpY3QgRmxhbiBGbG9vZCc6ICc1NTIzJywgLy8gYmlnIGNpcmNsZSBhb2VcclxuICAgICdNYXRveWEgUHlyb2R1Y3QgRWxkdGh1cnMgTWFzaCc6ICc1NTI3JywgLy8gbGluZSBhb2VcclxuICAgICdNYXR5b2EgUHlyb2R1Y3QgRWxkdGh1cnMgU3Bpbic6ICc1NTI4JywgLy8gdmVyeSBsYXJnZSBjaXJjbGUgYW9lXHJcbiAgICAnTWF0b3lhIFJlbGljdCBCYXZhcm9pcyBUaHVuZGVyIElJSSc6ICc1NTI1JywgLy8gY2lyY2xlIGFvZVxyXG4gICAgJ01hdG95YSBSZWxpY3QgTWFyc2htYWxsb3cgQW5jaWVudCBBZXJvJzogJzU1MjQnLCAvLyB2ZXJ5IGxhcmdlIGxpbmUgZ3JvYW9lXHJcbiAgICAnTWF0b3lhIFJlbGljdCBQdWRkaW5nIEZpcmUgSUknOiAnNTUyMicsIC8vIGNpcmNsZSBhb2VcclxuICAgICdNYXRveWEgUmVsaWN0IE1vbHRlbiBQaG9lYmFkIEhvdCBMYXZhJzogJzU3RTknLCAvLyBjb25hbCBhb2VcclxuICAgICdNYXRveWEgUmVsaWN0IE1vbHRlbiBQaG9lYmFkIFZvbGNhbmljIERyb3AnOiAnNTdFOCcsIC8vIGNpcmNsZSBhb2VcclxuICAgICdNYXRveWEgTW90aGVyIFBvcnhpZSBNZWRpdW0gUmVhcic6ICc1OTFEJywgLy8ga25vY2tiYWNrIGludG8gc2FmZSBjaXJjbGUgYW9lXHJcbiAgICAnTWF0b3lhIE1vdGhlciBQb3J4aWUgQmFyYmVxdWUgTGluZSc6ICc1OTE3JywgLy8gbGluZSBhb2UgZHVyaW5nIGJicVxyXG4gICAgJ01hdG95YSBNb3RoZXIgUG9yeGllIEJhcmJlcXVlIENpcmNsZSc6ICc1OTE4JywgLy8gY2lyY2xlIGFvZSBkdXJpbmcgYmJxXHJcbiAgICAnTWF0b3lhIE1vdGhlciBQb3J4aWUgVG8gQSBDcmlzcCc6ICc1OTI1JywgLy8gZ2V0dGluZyB0byBjbG9zZSB0byBib3NzIGR1cmluZyBiYnFcclxuICAgICdNYXRveWEgTW90aGVyIFByb3hpZSBCdWZmZXQnOiAnNTkyNicsIC8vIEFlb2xpYW4gQ2F2ZSBTcHJpdGUgbGluZSBhb2UgKGlzIHRoaXMgYSBwdW4/KVxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ01hdG95YSBOaXhpZSBTZWEgU2hhbnR5JzogJzU5OEMnLCAvLyBOb3QgdGFraW5nIHRoZSBwdWRkbGUgdXAgdG8gdGhlIHRvcD8gRmFpbGluZyBhZGQgZW5yYWdlP1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnTWF0b3lhIE5peGllIENyYWNrJzogJzU5OTAnLCAvLyBOaXhpZSBDcmFzaC1TbWFzaCB0YW5rIHRldGhlcnNcclxuICAgICdNYXRveWEgTml4aWUgU3B1dHRlcic6ICc1OTkzJywgLy8gTml4aWUgc3ByZWFkIG1hcmtlclxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLk10R3VsZyxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnR3VsZyBJbW1vbGF0aW9uJzogJzQxQUEnLFxyXG4gICAgJ0d1bGcgVGFpbCBTbWFzaCc6ICc0MUFCJyxcclxuICAgICdHdWxnIEhlYXZlbnNsYXNoJzogJzQxQTknLFxyXG4gICAgJ0d1bGcgVHlwaG9vbiBXaW5nIDEnOiAnM0QwMCcsXHJcbiAgICAnR3VsZyBUeXBob29uIFdpbmcgMic6ICczRDAxJyxcclxuICAgICdHdWxnIEh1cnJpY2FuZSBXaW5nJzogJzNEMDMnLFxyXG4gICAgJ0d1bGcgRWFydGggU2hha2VyJzogJzM3RjUnLFxyXG4gICAgJ0d1bGcgU2FuY3RpZmljYXRpb24nOiAnNDFBRScsXHJcbiAgICAnR3VsZyBFeGVnZXNpcyc6ICczRDA3JyxcclxuICAgICdHdWxnIFBlcmZlY3QgQ29udHJpdGlvbic6ICczRDBFJyxcclxuICAgICdHdWxnIFNhbmN0aWZpZWQgQWVybyc6ICc0MUFEJyxcclxuICAgICdHdWxnIERpdmluZSBEaW1pbnVlbmRvIDEnOiAnM0QxNicsXHJcbiAgICAnR3VsZyBEaXZpbmUgRGltaW51ZW5kbyAyJzogJzNEMTgnLFxyXG4gICAgJ0d1bGcgRGl2aW5lIERpbWludWVuZG8gMyc6ICc0NjY5JyxcclxuICAgICdHdWxnIERpdmluZSBEaW1pbnVlbmRvIDQnOiAnM0QxOScsXHJcbiAgICAnR3VsZyBEaXZpbmUgRGltaW51ZW5kbyA1JzogJzNEMjEnLFxyXG4gICAgJ0d1bGcgQ29udmljdGlvbiBNYXJjYXRvIDEnOiAnM0QxQScsXHJcbiAgICAnR3VsZyBDb252aWN0aW9uIE1hcmNhdG8gMic6ICczRDFCJyxcclxuICAgICdHdWxnIENvbnZpY3Rpb24gTWFyY2F0byAzJzogJzNEMjAnLFxyXG4gICAgJ0d1bGcgVmVuYSBBbW9yaXMnOiAnM0QyNycsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnR3VsZyBMdW1lbiBJbmZpbml0dW0nOiAnNDFCMicsXHJcbiAgICAnR3VsZyBSaWdodCBQYWxtJzogJzM3RjgnLFxyXG4gICAgJ0d1bGcgTGVmdCBQYWxtJzogJzM3RkEnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogV2hhdCB0byBkbyBhYm91dCBLYWhuIFJhaSA1QjUwP1xyXG4vLyBJdCBzZWVtcyBpbXBvc3NpYmxlIGZvciB0aGUgbWFya2VkIHBlcnNvbiB0byBhdm9pZCBlbnRpcmVseS5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5QYWdsdGhhbixcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnUGFnbHRoYW4gVGVsb3ZvdWl2cmUgUGxhZ3VlIFN3aXBlJzogJzYwRkMnLCAvLyBmcm9udGFsIGNvbmFsIGNsZWF2ZVxyXG4gICAgJ1BhZ2x0aGFuIExlc3NlciBUZWxvZHJhZ29uIEVuZ3VsZmluZyBGbGFtZXMnOiAnNjBGNScsIC8vIGZyb250YWwgY29uYWwgY2xlYXZlXHJcbiAgICAnUGFnbHRoYW4gQW1odWx1ayBMaWdodG5pbmcgQm9sdCc6ICc1QzRDJywgLy8gY2lyY3VsYXIgbGlnaHRuaW5nIGFvZSAob24gc2VsZiBvciBwb3N0KVxyXG4gICAgJ1BhZ2x0aGFuIEFtaHVsdWsgQmFsbCBPZiBMZXZpbiBTaG9jayc6ICc1QzUyJywgLy8gcHVsc2luZyBzbWFsbCBjaXJjdWxhciBhb2VzXHJcbiAgICAnUGFnbHRoYW4gQW1odWx1ayBTdXBlcmNoYXJnZWQgQmFsbCBPZiBMZXZpbiBTaG9jayc6ICc1QzUzJywgLy8gcHVsc2luZyBsYXJnZSBjaXJjdWxhciBhb2VcclxuICAgICdQYWdsdGhhbiBBbWh1bHVrIFdpZGUgQmxhc3Rlcic6ICc2MEM1JywgLy8gcmVhciBjb25hbCBjbGVhdmVcclxuICAgICdQYWdsdGhhbiBUZWxvYnJvYmlueWFrIEZhbGwgT2YgTWFuJzogJzYxNDgnLCAvLyBjaXJjdWxhciBhb2VcclxuICAgICdQYWdsdGhhbiBUZWxvdGVrIFJlYXBlciBNYWdpdGVrIENhbm5vbic6ICc2MTIxJywgLy8gY2lyY3VsYXIgYW9lXHJcbiAgICAnUGFnbHRoYW4gVGVsb2RyYWdvbiBTaGVldCBvZiBJY2UnOiAnNjBGOCcsIC8vIGNpcmN1bGFyIGFvZVxyXG4gICAgJ1BhZ2x0aGFuIFRlbG9kcmFnb24gRnJvc3QgQnJlYXRoJzogJzYwRjcnLCAvLyB2ZXJ5IGxhcmdlIGNvbmFsIGNsZWF2ZVxyXG4gICAgJ1BhZ2x0aGFuIE1hZ2l0ZWsgQ29yZSBTdGFibGUgQ2Fubm9uJzogJzVDOTQnLCAvLyBsYXJnZSBsaW5lIGFvZXNcclxuICAgICdQYWdsdGhhbiBNYWdpdGVrIENvcmUgMi1Ub256ZSBNYWdpdGVrIE1pc3NpbGUnOiAnNUM5NScsIC8vIGxhcmdlIGNpcmN1bGFyIGFvZVxyXG4gICAgJ1BhZ2x0aGFuIFRlbG90ZWsgU2t5IEFybW9yIEFldGhlcnNob3QnOiAnNUM5QycsIC8vIGNpcmN1bGFyIGFvZVxyXG4gICAgJ1BhZ2x0aGFuIE1hcmsgSUkgVGVsb3RlayBDb2xvc3N1cyBFeGhhdXN0JzogJzVDOTknLCAvLyBsYXJnZSBsaW5lIGFvZVxyXG4gICAgJ1BhZ2x0aGFuIE1hZ2l0ZWsgTWlzc2lsZSBFeHBsb3NpdmUgRm9yY2UnOiAnNUM5OCcsIC8vIHNsb3cgbW92aW5nIGhvcml6b250YWwgbWlzc2lsZXNcclxuICAgICdQYWdsdGhhbiBUaWFtYXQgRmxhbWlzcGhlcmUnOiAnNjEwRicsIC8vIHZlcnkgbG9uZyBsaW5lIGFvZVxyXG4gICAgJ1BhZ2x0aGFuIEFybW9yZWQgVGVsb2RyYWdvbiBUb3J0b2lzZSBTdG9tcCc6ICc2MTRCJywgLy8gbGFyZ2UgY2lyY3VsYXIgYW9lIGZyb20gdHVydGxlXHJcbiAgICAnUGFnbHRoYW4gVGVsb2RyYWdvbiBUaHVuZGVyb3VzIEJyZWF0aCc6ICc2MTQ5JywgLy8gbGFyZ2UgY29uYWwgY2xlYXZlXHJcbiAgICAnUGFnbHRoYW4gTHVuYXIgQmFoYW11dCBMdW5hciBOYWlsIFVwYnVyc3QnOiAnNjA1QicsIC8vIHNtYWxsIGFvZXMgYmVmb3JlIEJpZyBCdXJzdFxyXG4gICAgJ1BhZ2x0aGFuIEx1bmFyIEJhaGFtdXQgTHVuYXIgTmFpbCBCaWcgQnVyc3QnOiAnNUI0OCcsIC8vIGxhcmdlIGNpcmN1bGFyIGFvZXMgZnJvbSBuYWlsc1xyXG4gICAgJ1BhZ2x0aGFuIEx1bmFyIEJhaGFtdXQgUGVyaWdlYW4gQnJlYXRoJzogJzVCNTknLCAvLyBsYXJnZSBjb25hbCBjbGVhdmVcclxuICAgICdQYWdsdGhhbiBMdW5hciBCYWhhbXV0IE1lZ2FmbGFyZSc6ICc1QjRFJywgLy8gbWVnYWZsYXJlIHBlcHBlcm9uaVxyXG4gICAgJ1BhZ2x0aGFuIEx1bmFyIEJhaGFtdXQgTWVnYWZsYXJlIERpdmUnOiAnNUI1MicsIC8vIG1lZ2FmbGFyZSBsaW5lIGFvZSBhY3Jvc3MgdGhlIGFyZW5hXHJcbiAgICAnUGFnbHRoYW4gTHVuYXIgQmFoYW11dCBMdW5hciBGbGFyZSc6ICc1QjRBJywgLy8gbGFyZ2UgcHVycGxlIHNocmlua2luZyBjaXJjbGVzXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdQYWdsdGhhbiBMdW5hciBCYWhhbXV0IE1lZ2FmbGFyZSc6ICc1QjREJywgLy8gbWVnYWZsYXJlIHNwcmVhZCBtYXJrZXJzXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlUWl0YW5hUmF2ZWwsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1FpdGFuYSBTdW4gVG9zcyc6ICczQzhBJywgLy8gR3JvdW5kIEFvRSwgYm9zcyBvbmVcclxuICAgICdRaXRhbmEgUm9ua2FuIExpZ2h0IDEnOiAnM0M4QycsIC8vIFN0YXR1ZSBhdHRhY2ssIGJvc3Mgb25lXHJcbiAgICAnUWl0YW5hIExvemF0bFxcJ3MgRnVyeSAxJzogJzNDOEYnLCAvLyBTZW1pY2lyY2xlIGNsZWF2ZSwgYm9zcyBvbmVcclxuICAgICdRaXRhbmEgTG96YXRsXFwncyBGdXJ5IDInOiAnM0M5MCcsIC8vIFNlbWljaXJjbGUgY2xlYXZlLCBib3NzIG9uZVxyXG4gICAgJ1FpdGFuYSBGYWxsaW5nIFJvY2snOiAnM0M5NicsIC8vIFNtYWxsIGdyb3VuZCBBb0UsIGJvc3MgdHdvXHJcbiAgICAnUWl0YW5hIEZhbGxpbmcgQm91bGRlcic6ICczQzk3JywgLy8gTGFyZ2UgZ3JvdW5kIEFvRSwgYm9zcyB0d29cclxuICAgICdRaXRhbmEgVG93ZXJmYWxsJzogJzNDOTgnLCAvLyBQaWxsYXIgY29sbGFwc2UsIGJvc3MgdHdvXHJcbiAgICAnUWl0YW5hIFZpcGVyIFBvaXNvbiAyJzogJzNDOUUnLCAvLyBTdGF0aW9uYXJ5IHBvaXNvbiBwdWRkbGVzLCBib3NzIHRocmVlXHJcbiAgICAnUWl0YW5hIENvbmZlc3Npb24gb2YgRmFpdGggMSc6ICczQ0EyJywgLy8gRGFuZ2Vyb3VzIG1pZGRsZSBkdXJpbmcgc3ByZWFkIGNpcmNsZXMsIGJvc3MgdGhyZWVcclxuICAgICdRaXRhbmEgQ29uZmVzc2lvbiBvZiBGYWl0aCAzJzogJzNDQTYnLCAvLyBEYW5nZXJvdXMgc2lkZXMgZHVyaW5nIHN0YWNrIG1hcmtlciwgYm9zcyB0aHJlZVxyXG4gICAgJ1FpdGFuYSBDb25mZXNzaW9uIG9mIEZhaXRoIDQnOiAnM0NBNycsIC8vIERhbmdlcm91cyBzaWRlcyBkdXJpbmcgc3RhY2sgbWFya2VyLCBib3NzIHRocmVlXHJcbiAgICAnUWl0YW5hIFJvbmthbiBMaWdodCAyJzogJzNENkQnLCAvLyBTdGF0dWUgYXR0YWNrLCBib3NzIG9uZVxyXG4gICAgJ1FpdGFuYSBXcmF0aCBvZiB0aGUgUm9ua2EnOiAnM0UyQycsIC8vIFN0YXR1ZSBsaW5lIGF0dGFjayBmcm9tIG1pbmktYm9zc2VzIGJlZm9yZSBmaXJzdCBib3NzXHJcbiAgICAnUWl0YW5hIFNpbnNwaXR0ZXInOiAnM0UzNicsIC8vIEdvcmlsbGEgYm91bGRlciB0b3NzIEFvRSBiZWZvcmUgdGhpcmQgYm9zc1xyXG4gICAgJ1FpdGFuYSBIb3VuZCBvdXQgb2YgSGVhdmVuJzogJzQyQjgnLCAvLyBUZXRoZXIgZXh0ZW5zaW9uIGZhaWx1cmUsIGJvc3MgdGhyZWU7IDQyQjcgaXMgY29ycmVjdCBleGVjdXRpb25cclxuICAgICdRaXRhbmEgUm9ua2FuIEFieXNzJzogJzQzRUInLCAvLyBHcm91bmQgQW9FIGZyb20gbWluaS1ib3NzZXMgYmVmb3JlIGZpcnN0IGJvc3NcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1FpdGFuYSBWaXBlciBQb2lzb24gMSc6ICczQzlEJywgLy8gQW9FIGZyb20gdGhlIDAwQUIgcG9pc29uIGhlYWQgbWFya2VyLCBib3NzIHRocmVlXHJcbiAgICAnUWl0YW5hIENvbmZlc3Npb24gb2YgRmFpdGggMic6ICczQ0EzJywgLy8gT3ZlcmxhcHBlZCBjaXJjbGVzIGZhaWx1cmUgb24gdGhlIHNwcmVhZCBjaXJjbGVzIHZlcnNpb24gb2YgdGhlIG1lY2hhbmljXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUaGUgR3JhbmQgQ29zbW9zXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVHcmFuZENvc21vcyxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnQ29zbW9zIElyb24gSnVzdGljZSc6ICc0OTFGJyxcclxuICAgICdDb3Ntb3MgU21pdGUgT2YgUmFnZSc6ICc0OTIxJyxcclxuXHJcbiAgICAnQ29zbW9zIFRyaWJ1bGF0aW9uJzogJzQ5QTQnLFxyXG4gICAgJ0Nvc21vcyBEYXJrIFNob2NrJzogJzQ3NkYnLFxyXG4gICAgJ0Nvc21vcyBTd2VlcCc6ICc0NzcwJyxcclxuICAgICdDb3Ntb3MgRGVlcCBDbGVhbic6ICc0NzcxJyxcclxuXHJcbiAgICAnQ29zbW9zIFNoYWRvdyBCdXJzdCc6ICc0OTI0JyxcclxuICAgICdDb3Ntb3MgQmxvb2R5IENhcmVzcyc6ICc0OTI3JyxcclxuICAgICdDb3Ntb3MgTmVwZW50aGljIFBsdW5nZSc6ICc0OTI4JyxcclxuICAgICdDb3Ntb3MgQnJld2luZyBTdG9ybSc6ICc0OTI5JyxcclxuXHJcbiAgICAnQ29zbW9zIE9kZSBUbyBGYWxsZW4gUGV0YWxzJzogJzQ5NTAnLFxyXG4gICAgJ0Nvc21vcyBGYXIgV2luZCBHcm91bmQnOiAnNDI3MycsXHJcblxyXG4gICAgJ0Nvc21vcyBGaXJlIEJyZWF0aCc6ICc0OTJCJyxcclxuICAgICdDb3Ntb3MgUm9ua2FuIEZyZWV6ZSc6ICc0OTJFJyxcclxuICAgICdDb3Ntb3MgT3ZlcnBvd2VyJzogJzQ5MkQnLFxyXG5cclxuICAgICdDb3Ntb3MgU2NvcmNoaW5nIExlZnQnOiAnNDc2MycsXHJcbiAgICAnQ29zbW9zIFNjb3JjaGluZyBSaWdodCc6ICc0NzYyJyxcclxuICAgICdDb3Ntb3MgT3RoZXJ3b3JkbHkgSGVhdCc6ICc0NzVDJyxcclxuICAgICdDb3Ntb3MgRmlyZVxcJ3MgSXJlJzogJzQ3NjEnLFxyXG4gICAgJ0Nvc21vcyBQbHVtbWV0JzogJzQ3NjcnLFxyXG5cclxuICAgICdDb3Ntb3MgRmlyZVxcJ3MgRG9tYWluIFRldGhlcic6ICc0NzVGJyxcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0Nvc21vcyBEYXJrIFdlbGwnOiAnNDc2RCcsXHJcbiAgICAnQ29zbW9zIEZhciBXaW5kIFNwcmVhZCc6ICc0NzI0JyxcclxuICAgICdDb3Ntb3MgQmxhY2sgRmxhbWUnOiAnNDc1RCcsXHJcbiAgICAnQ29zbW9zIEZpcmVcXCdzIERvbWFpbic6ICc0NzYwJyxcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVUd2lubmluZyxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnVHdpbm5pbmcgQXV0byBDYW5ub25zJzogJzQzQTknLFxyXG4gICAgJ1R3aW5uaW5nIEhlYXZlJzogJzNEQjknLFxyXG4gICAgJ1R3aW5uaW5nIDMyIFRvbnplIFN3aXBlJzogJzNEQkInLFxyXG4gICAgJ1R3aW5uaW5nIFNpZGVzd2lwZSc6ICczREJGJyxcclxuICAgICdUd2lubmluZyBXaW5kIFNwb3V0JzogJzNEQkUnLFxyXG4gICAgJ1R3aW5uaW5nIFNob2NrJzogJzNERjEnLFxyXG4gICAgJ1R3aW5uaW5nIExhc2VyYmxhZGUnOiAnM0RFQycsXHJcbiAgICAnVHdpbm5pbmcgVm9ycGFsIEJsYWRlJzogJzNEQzInLFxyXG4gICAgJ1R3aW5uaW5nIFRocm93biBGbGFtZXMnOiAnM0RDMycsXHJcbiAgICAnVHdpbm5pbmcgTWFnaXRlayBSYXknOiAnM0RGMycsXHJcbiAgICAnVHdpbm5pbmcgSGlnaCBHcmF2aXR5JzogJzNERkEnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ1R3aW5uaW5nIDEyOCBUb256ZSBTd2lwZSc6ICczREJBJyxcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzIH0gZnJvbSAnLi4vLi4vLi4vb29wc3lfY29tbW9uJztcclxuXHJcbi8vIFRPRE86IERlYWQgSXJvbiA1QUIwIChlYXJ0aHNoYWtlcnMsIGJ1dCBvbmx5IGlmIHlvdSB0YWtlIHR3bz8pXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRGVsdWJydW1SZWdpbmFlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdEZWx1YnJ1bSBTZWVrZXIgTWVyY3kgRm91cmZvbGQnOiAnNUIzNCcsIC8vIEZvdXIgZ2xvd2luZyBzd29yZCBoYWxmIHJvb20gY2xlYXZlc1xyXG4gICAgJ0RlbHVicnVtIFNlZWtlciBCYWxlZnVsIFN3YXRoZSc6ICc1QUI0JywgLy8gR3JvdW5kIGFvZSB0byBlaXRoZXIgc2lkZSBvZiBib3NzXHJcbiAgICAnRGVsdWJydW0gU2Vla2VyIEJhbGVmdWwgQmxhZGUnOiAnNUIyOCcsIC8vIEhpZGUgYmVoaW5kIHBpbGxhcnMgYXR0YWNrXHJcbiAgICAnRGVsdWJydW0gU2Vla2VyIElyb24gU3BsaXR0ZXIgQmx1ZSAxJzogJzVBQTQnLCAvLyBCbHVlIHJpbmcgZXhwbG9zaW9uXHJcbiAgICAnRGVsdWJydW0gU2Vla2VyIElyb24gU3BsaXR0ZXIgQmx1ZSAyJzogJzVBQTUnLCAvLyBCbHVlIHJpbmcgZXhwbG9zaW9uXHJcbiAgICAnRGVsdWJydW0gU2Vla2VyIElyb24gU3BsaXR0ZXIgQmx1ZSAzJzogJzVBQTYnLCAvLyBCbHVlIHJpbmcgZXhwbG9zaW9uXHJcbiAgICAnRGVsdWJydW0gU2Vla2VyIElyb24gU3BsaXR0ZXIgV2hpdGUgMSc6ICc1QUE3JywgLy8gV2hpdGUgcmluZyBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bSBTZWVrZXIgSXJvbiBTcGxpdHRlciBXaGl0ZSAyJzogJzVBQTgnLCAvLyBXaGl0ZSByaW5nIGV4cGxvc2lvblxyXG4gICAgJ0RlbHVicnVtIFNlZWtlciBJcm9uIFNwbGl0dGVyIFdoaXRlIDMnOiAnNUFBOScsIC8vIFdoaXRlIHJpbmcgZXhwbG9zaW9uXHJcbiAgICAnRGVsdWJydW0gU2Vla2VyIFNjb3JjaGluZyBTaGFja2xlJzogJzVBQUUnLCAvLyBDaGFpbiBkYW1hZ2VcclxuICAgICdEZWx1YnJ1bSBTZWVrZXIgTWVyY2lmdWwgQnJlZXplJzogJzVBQUInLCAvLyBXYWZmbGUgY3Jpc3MtY3Jvc3MgZmxvb3IgbWFya2Vyc1xyXG4gICAgJ0RlbHVicnVtIFNlZWtlciBNZXJjaWZ1bCBCbG9vbXMnOiAnNUFBRCcsIC8vIFB1cnBsZSBncm93aW5nIGNpcmNsZVxyXG4gICAgJ0RlbHVicnVtIERhaHUgUmlnaHQtU2lkZWQgU2hvY2t3YXZlJzogJzU3NjEnLCAvLyBSaWdodCBjaXJjdWxhciBjbGVhdmVcclxuICAgICdEZWx1YnJ1bSBEYWh1IExlZnQtU2lkZWQgU2hvY2t3YXZlJzogJzU3NjInLCAvLyBMZWZ0IGNpcmN1bGFyIGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtIERhaHUgRmlyZWJyZWF0aGUnOiAnNTc2NScsIC8vIENvbmFsIGJyZWF0aFxyXG4gICAgJ0RlbHVicnVtIERhaHUgRmlyZWJyZWF0aGUgUm90YXRpbmcnOiAnNTc1QScsIC8vIENvbmFsIGJyZWF0aCwgcm90YXRpbmdcclxuICAgICdEZWx1YnJ1bSBEYWh1IEhlYWQgRG93bic6ICc1NzU2JywgLy8gbGluZSBhb2UgY2hhcmdlIGZyb20gTWFyY2hvc2lhcyBhZGRcclxuICAgICdEZWx1YnJ1bSBEYWh1IEh1bnRlclxcJ3MgQ2xhdyc6ICc1NzU3JywgLy8gY2lyY3VsYXIgZ3JvdW5kIGFvZSBjZW50ZXJlZCBvbiBNYXJjaG9zaWFzIGFkZFxyXG4gICAgJ0RlbHVicnVtIERhaHUgRmFsbGluZyBSb2NrJzogJzU3NUMnLCAvLyBncm91bmQgYW9lIGZyb20gUmV2ZXJiZXJhdGluZyBSb2FyXHJcbiAgICAnRGVsdWJydW0gRGFodSBIb3QgQ2hhcmdlJzogJzU3NjQnLCAvLyBkb3VibGUgY2hhcmdlXHJcbiAgICAnRGVsdWJydW0gRGFodSBSaXBwZXIgQ2xhdyc6ICc1NzVEJywgLy8gZnJvbnRhbCBjbGVhdmVcclxuICAgICdEZWx1YnJ1bSBEYWh1IFRhaWwgU3dpbmcnOiAnNTc1RicsIC8vIHRhaWwgc3dpbmcgOylcclxuICAgICdEZWx1YnJ1bSBHdWFyZCBQYXduIE9mZic6ICc1ODA2JywgLy8gUXVlZW4ncyBTb2xkaWVyIFNlY3JldHMgUmV2ZWFsZWQgdGV0aGVyZWQgY2xvbmUgYW9lXHJcbiAgICAnRGVsdWJydW0gR3VhcmQgVHVycmV0XFwncyBUb3VyIDEnOiAnNTgwRCcsIC8vIFF1ZWVuJ3MgR3VubmVyIHJlZmxlY3RpdmUgdHVycmV0IHNob3RcclxuICAgICdEZWx1YnJ1bSBHdWFyZCBUdXJyZXRcXCdzIFRvdXIgMic6ICc1ODBFJywgLy8gUXVlZW4ncyBHdW5uZXIgcmVmbGVjdGl2ZSB0dXJyZXQgc2hvdFxyXG4gICAgJ0RlbHVicnVtIEd1YXJkIFR1cnJldFxcJ3MgVG91ciAzJzogJzU4MEYnLCAvLyBRdWVlbidzIEd1bm5lciByZWZsZWN0aXZlIHR1cnJldCBzaG90XHJcbiAgICAnRGVsdWJydW0gR3VhcmQgT3B0aW1hbCBQbGF5IFNoaWVsZCc6ICc1N0YzJywgLy8gUXVlZW4ncyBLbmlnaHQgc2hpZWxkIGdldCB1bmRlclxyXG4gICAgJ0RlbHVicnVtIEd1YXJkIE9wdGltYWwgUGxheSBTd29yZCc6ICc1N0YyJywgLy8gUXVlZW4ncyBLbmlnaHQgc3dvcmQgZ2V0IG91dFxyXG4gICAgJ0RlbHVicnVtIEd1YXJkIENvdW50ZXJwbGF5JzogJzU3RjYnLCAvLyBIaXR0aW5nIGFldGhlcmlhbCB3YXJkIGRpcmVjdGlvbmFsIGJhcnJpZXJcclxuICAgICdEZWx1YnJ1bSBQaGFudG9tIFN3aXJsaW5nIE1pYXNtYSAxJzogJzU3QTknLCAvLyBJbml0aWFsIHBoYW50b20gZG9udXQgYW9lIGZyb20gY2lyY2xlXHJcbiAgICAnRGVsdWJydW0gUGhhbnRvbSBTd2lybGluZyBNaWFzbWEgMic6ICc1N0FBJywgLy8gTW92aW5nIHBoYW50b20gZG9udXQgYW9lcyBmcm9tIGNpcmNsZVxyXG4gICAgJ0RlbHVicnVtIFBoYW50b20gQ3JlZXBpbmcgTWlhc21hJzogJzU3QTUnLCAvLyBwaGFudG9tIGxpbmUgYW9lIGZyb20gc3F1YXJlXHJcbiAgICAnRGVsdWJydW0gUGhhbnRvbSBWaWxlIFdhdmUnOiAnNTdCMScsIC8vIHBoYW50b20gY29uYWwgYW9lXHJcbiAgICAnRGVsdWJydW0gQXZvd2VkIEZ1cnkgT2YgQm96amEnOiAnNTk3MycsIC8vIFRyaW5pdHkgQXZvd2VkIEFsbGVnaWFudCBBcnNlbmFsIFwib3V0XCJcclxuICAgICdEZWx1YnJ1bSBBdm93ZWQgRmxhc2h2YW5lJzogJzU5NzInLCAvLyBUcmluaXR5IEF2b3dlZCBBbGxlZ2lhbnQgQXJzZW5hbCBcImdldCBiZWhpbmRcIlxyXG4gICAgJ0RlbHVicnVtIEF2b3dlZCBJbmZlcm5hbCBTbGFzaCc6ICc1OTcxJywgLy8gVHJpbml0eSBBdm93ZWQgQWxsZWdpYW50IEFyc2VuYWwgXCJnZXQgZnJvbnRcIlxyXG4gICAgJ0RlbHVicnVtIEF2b3dlZCBGbGFtZXMgT2YgQm96amEnOiAnNTk2OCcsIC8vIDgwJSBmbG9vciBhb2UgYmVmb3JlIHNoaW1tZXJpbmcgc2hvdCBzd29yZHNcclxuICAgICdEZWx1YnJ1bSBBdm93ZWQgR2xlYW1pbmcgQXJyb3cnOiAnNTk3NCcsIC8vIFRyaW5pdHkgQXZhdGFyIGxpbmUgYW9lcyBmcm9tIG91dHNpZGVcclxuICAgICdEZWx1YnJ1bSBRdWVlbiBUaGUgTWVhbnMgMSc6ICc1OUJCJywgLy8gVGhlIFF1ZWVuJ3MgQmVjayBhbmQgQ2FsbCBjcm9zcyBhb2UgZnJvbSBhZGRzXHJcbiAgICAnRGVsdWJydW0gUXVlZW4gVGhlIE1lYW5zIDInOiAnNTlCRCcsIC8vIFRoZSBRdWVlbidzIEJlY2sgYW5kIENhbGwgY3Jvc3MgYW9lIGZyb20gYWRkc1xyXG4gICAgJ0RlbHVicnVtIFF1ZWVuIFRoZSBFbmQgMSc6ICc1OUJBJywgLy8gQWxzbyBUaGUgUXVlZW4ncyBCZWNrIGFuZCBDYWxsIGNyb3NzIGFvZSBmcm9tIGFkZHNcclxuICAgICdEZWx1YnJ1bSBRdWVlbiBUaGUgRW5kIDInOiAnNTlCQycsIC8vIEFsc28gVGhlIFF1ZWVuJ3MgQmVjayBhbmQgQ2FsbCBjcm9zcyBhb2UgZnJvbSBhZGRzXHJcbiAgICAnRGVsdWJydW0gUXVlZW4gTm9ydGhzd2FpblxcJ3MgR2xvdyc6ICc1OUM0JywgLy8gZXhwYW5kaW5nIGxpbmVzIHdpdGggZXhwbG9zaW9uIGludGVyc2VjdGlvbnNcclxuICAgICdEZWx1YnJ1bSBRdWVlbiBKdWRnbWVudCBCbGFkZSBMZWZ0JzogJzVCODMnLCAvLyBkYXNoIGFjcm9zcyByb29tIHdpdGggbGVmdCBjbGVhdmVcclxuICAgICdEZWx1YnJ1bSBRdWVlbiBKdWRnbWVudCBCbGFkZSBSaWdodCc6ICc1QjgzJywgLy8gZGFzaCBhY3Jvc3Mgcm9vbSB3aXRoIHJpZ2h0IGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtIFF1ZWVuIFF1ZWVuXFwncyBKdXN0aWNlJzogJzU5QkYnLCAvLyBmYWlsaW5nIHRvIHdhbGsgdGhlIHJpZ2h0IG51bWJlciBvZiBzcXVhcmVzXHJcbiAgICAnRGVsdWJydW0gUXVlZW4gVHVycmV0XFwncyBUb3VyIDEnOiAnNTlFMCcsIC8vIHJlZmxlY3RpdmUgdHVycmV0IHNob3QgZHVyaW5nIFF1ZWVuXHJcbiAgICAnRGVsdWJydW0gUXVlZW4gVHVycmV0XFwncyBUb3VyIDInOiAnNTlFMScsIC8vIHJlZmxlY3RpdmUgdHVycmV0IHNob3QgZHVyaW5nIFF1ZWVuXHJcbiAgICAnRGVsdWJydW0gUXVlZW4gVHVycmV0XFwncyBUb3VyIDMnOiAnNTlFMicsIC8vIHJlZmxlY3RpdmUgdHVycmV0IHNob3QgZHVyaW5nIFF1ZWVuXHJcbiAgICAnRGVsdWJydW0gUXVlZW4gUGF3biBPZmYnOiAnNTlEQScsIC8vIFNlY3JldHMgUmV2ZWFsZWQgdGV0aGVyZWQgY2xvbmUgYW9lIGR1cmluZyBRdWVlblxyXG4gICAgJ0RlbHVicnVtIFF1ZWVuIE9wdGltYWwgUGxheSBTaGllbGQnOiAnNTlDRScsIC8vIFF1ZWVuJ3MgS25pZ2h0IHNoaWVsZCBnZXQgdW5kZXIgZHVyaW5nIFF1ZWVuXHJcbiAgICAnRGVsdWJydW0gUXVlZW4gT3B0aW1hbCBQbGF5IFN3b3JkJzogJzU5Q0MnLCAvLyBRdWVlbidzIEtuaWdodCBzd29yZCBnZXQgb3V0IGR1cmluZyBRdWVlblxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0RlbHVicnVtIEhpZGRlbiBUcmFwIE1hc3NpdmUgRXhwbG9zaW9uJzogJzVBNkUnLCAvLyBleHBsb3Npb24gdHJhcFxyXG4gICAgJ0RlbHVicnVtIEhpZGRlbiBUcmFwIFBvaXNvbiBUcmFwJzogJzVBNkYnLCAvLyBwb2lzb24gdHJhcFxyXG4gICAgJ0RlbHVicnVtIEF2b3dlZCBIZWF0IFNob2NrJzogJzU5NUUnLCAvLyB0b28gbXVjaCBoZWF0IG9yIGZhaWxpbmcgdG8gcmVndWxhdGUgdGVtcGVyYXR1cmVcclxuICAgICdEZWx1YnJ1bSBBdm93ZWQgQ29sZCBTaG9jayc6ICc1OTVGJywgLy8gdG9vIG11Y2ggY29sZCBvciBmYWlsaW5nIHRvIHJlZ3VsYXRlIHRlbXBlcmF0dXJlXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgICdEZWx1YnJ1bSBEYWh1IEhlYXQgQnJlYXRoJzogJzU3NjYnLCAvLyB0YW5rIGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtIEF2b3dlZCBXcmF0aCBPZiBCb3pqYSc6ICc1OTc1JywgLy8gdGFuayBjbGVhdmVcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ0RlbHVicnVtIFNlZWtlciBNZXJjaWZ1bCBNb29uJzogJzI2MicsIC8vIFwiUGV0cmlmaWNhdGlvblwiIGZyb20gQWV0aGVyaWFsIE9yYiBsb29rYXdheVxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gQXQgbGVhc3QgZHVyaW5nIFRoZSBRdWVlbiwgdGhlc2UgYWJpbGl0eSBpZHMgY2FuIGJlIG9yZGVyZWQgZGlmZmVyZW50bHksXHJcbiAgICAgIC8vIGFuZCB0aGUgZmlyc3QgZXhwbG9zaW9uIFwiaGl0c1wiIGV2ZXJ5b25lLCBhbHRob3VnaCB3aXRoIFwiMUJcIiBmbGFncy5cclxuICAgICAgaWQ6ICdEZWx1YnJ1bSBMb3RzIENhc3QnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiBbJzU2NUEnLCAnNTY1QicsICc1N0ZEJywgJzU3RkUnLCAnNUI4NicsICc1Qjg3JywgJzU5RDInLCAnNUQ5MyddLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKF9kYXRhLCBtYXRjaGVzKSA9PiBtYXRjaGVzLmZsYWdzLnNsaWNlKC0yKSA9PT0gJzAzJyxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzIH0gZnJvbSAnLi4vLi4vLi4vb29wc3lfY29tbW9uJztcclxuXHJcbi8vIFRPRE86IERhaHUgNTc3NiBTcGl0IEZsYW1lIHNob3VsZCBhbHdheXMgaGl0IGEgTWFyY2hvc2lhc1xyXG4vLyBUT0RPOiBoaXR0aW5nIHBoYW50b20gd2l0aCBpY2Ugc3Bpa2VzIHdpdGggYW55dGhpbmcgYnV0IGRpc3BlbD9cclxuLy8gVE9ETzogZmFpbGluZyBpY3kvZmllcnkgcG9ydGVudCAoZ3VhcmQgYW5kIHF1ZWVuKVxyXG4vLyAgICAgICBgMTg6UHlyZXRpYyBEb1QgVGljayBvbiAke25hbWV9IGZvciAke2RhbWFnZX0gZGFtYWdlLmBcclxuLy8gVE9ETzogV2luZHMgT2YgRmF0ZSAvIFdlaWdodCBPZiBGb3J0dW5lP1xyXG4vLyBUT0RPOiBUdXJyZXQncyBUb3VyP1xyXG4vLyBnZW5lcmFsIHRyYXBzOiBleHBsb3Npb246IDVBNzEsIHBvaXNvbiB0cmFwOiA1QTcyLCBtaW5pOiA1QTczXHJcbi8vIGR1ZWwgdHJhcHM6IG1pbmk6IDU3QTEsIGljZTogNTc5RiwgdG9hZDogNTdBMFxyXG4vLyBUT0RPOiB0YWtpbmcgbWFuYSBmbGFtZSB3aXRob3V0IHJlZmxlY3RcclxuLy8gVE9ETzogdGFraW5nIE1hZWxzdHJvbSdzIEJvbHQgd2l0aG91dCBsaWdodG5pbmcgYnVmZlxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkRlbHVicnVtUmVnaW5hZVNhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIFNsaW1lcyBIZWxsaXNoIFNsYXNoJzogJzU3RUEnLCAvLyBCb3pqYW4gU29sZGllciBjbGVhdmVcclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgU2xpbWVzIFZpc2NvdXMgUnVwdHVyZSc6ICc1MDE2JywgLy8gRnVsbHkgbWVyZ2VkIHZpc2NvdXMgc2xpbWUgYW9lXHJcblxyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBHb2xlbXMgRGVtb2xpc2gnOiAnNTg4MCcsIC8vIGludGVycnVwdGlibGUgUnVpbnMgR29sZW0gY2FzdFxyXG5cclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgQmFsZWZ1bCBTd2F0aGUnOiAnNUFEMScsIC8vIEdyb3VuZCBhb2UgdG8gZWl0aGVyIHNpZGUgb2YgYm9zc1xyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBCYWxlZnVsIEJsYWRlJzogJzVCMkEnLCAvLyBIaWRlIGJlaGluZCBwaWxsYXJzIGF0dGFja1xyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBTY29yY2hpbmcgU2hhY2tsZSc6ICc1QUNCJywgLy8gQ2hhaW5zXHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIE1lcmN5IEZvdXJmb2xkIDEnOiAnNUI5NCcsIC8vIEZvdXIgZ2xvd2luZyBzd29yZCBoYWxmIHJvb20gY2xlYXZlc1xyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBNZXJjeSBGb3VyZm9sZCAyJzogJzVBQjknLCAvLyBGb3VyIGdsb3dpbmcgc3dvcmQgaGFsZiByb29tIGNsZWF2ZXNcclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgTWVyY3kgRm91cmZvbGQgMyc6ICc1QUJBJywgLy8gRm91ciBnbG93aW5nIHN3b3JkIGhhbGYgcm9vbSBjbGVhdmVzXHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIE1lcmN5IEZvdXJmb2xkIDQnOiAnNUFCQicsIC8vIEZvdXIgZ2xvd2luZyBzd29yZCBoYWxmIHJvb20gY2xlYXZlc1xyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBNZXJjeSBGb3VyZm9sZCA1JzogJzVBQkMnLCAvLyBGb3VyIGdsb3dpbmcgc3dvcmQgaGFsZiByb29tIGNsZWF2ZXNcclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgTWVyY2lmdWwgQnJlZXplJzogJzVBQzgnLCAvLyBXYWZmbGUgY3Jpc3MtY3Jvc3MgZmxvb3IgbWFya2Vyc1xyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBCYWxlZnVsIENvbWV0JzogJzVBRDcnLCAvLyBDbG9uZSBtZXRlb3IgZHJvcHBpbmcgYmVmb3JlIGNoYXJnZXNcclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgQmFsZWZ1bCBGaXJlc3Rvcm0nOiAnNUFEOCcsIC8vIENsb25lIGNoYXJnZSBhZnRlciBCYWxlZnVsIENvbWV0XHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIElyb24gUm9zZSc6ICc1QUQ5JywgLy8gQ2xvbmUgbGluZSBhb2VzXHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIElyb24gU3BsaXR0ZXIgQmx1ZSAxJzogJzVBQzEnLCAvLyBCbHVlIHJpbiBnIGV4cGxvc2lvblxyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBJcm9uIFNwbGl0dGVyIEJsdWUgMic6ICc1QUMyJywgLy8gQmx1ZSByaW5nIGV4cGxvc2lvblxyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBJcm9uIFNwbGl0dGVyIEJsdWUgMyc6ICc1QUMzJywgLy8gQmx1ZSByaW5nIGV4cGxvc2lvblxyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBJcm9uIFNwbGl0dGVyIFdoaXRlIDEnOiAnNUFDNCcsIC8vIFdoaXRlIHJpbmcgZXhwbG9zaW9uXHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIElyb24gU3BsaXR0ZXIgV2hpdGUgMic6ICc1QUM1JywgLy8gV2hpdGUgcmluZyBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bVNhdiBTZWVrZXIgSXJvbiBTcGxpdHRlciBXaGl0ZSAzJzogJzVBQzYnLCAvLyBXaGl0ZSByaW5nIGV4cGxvc2lvblxyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBBY3QgT2YgTWVyY3knOiAnNUFDRicsIC8vIGNyb3NzLXNoYXBlZCBsaW5lIGFvZXNcclxuXHJcbiAgICAnRGVsdWJydW1TYXYgRGFodSBSaWdodC1TaWRlZCBTaG9ja3dhdmUgMSc6ICc1NzcwJywgLy8gUmlnaHQgY2lyY3VsYXIgY2xlYXZlXHJcbiAgICAnRGVsdWJydW1TYXYgRGFodSBSaWdodC1TaWRlZCBTaG9ja3dhdmUgMic6ICc1NzcyJywgLy8gUmlnaHQgY2lyY3VsYXIgY2xlYXZlXHJcbiAgICAnRGVsdWJydW1TYXYgRGFodSBMZWZ0LVNpZGVkIFNob2Nrd2F2ZSAxJzogJzU3NkYnLCAvLyBMZWZ0IGNpcmN1bGFyIGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtU2F2IERhaHUgTGVmdC1TaWRlZCBTaG9ja3dhdmUgMic6ICc1NzcxJywgLy8gTGVmdCBjaXJjdWxhciBjbGVhdmVcclxuICAgICdEZWx1YnJ1bVNhdiBEYWh1IEZpcmVicmVhdGhlJzogJzU3NzQnLCAvLyBDb25hbCBicmVhdGhcclxuICAgICdEZWx1YnJ1bVNhdiBEYWh1IEZpcmVicmVhdGhlIFJvdGF0aW5nJzogJzU3NkMnLCAvLyBDb25hbCBicmVhdGgsIHJvdGF0aW5nXHJcbiAgICAnRGVsdWJydW1TYXYgRGFodSBIZWFkIERvd24nOiAnNTc2OCcsIC8vIGxpbmUgYW9lIGNoYXJnZSBmcm9tIE1hcmNob3NpYXMgYWRkXHJcbiAgICAnRGVsdWJydW1TYXYgRGFodSBIdW50ZXJcXCdzIENsYXcnOiAnNTc2OScsIC8vIGNpcmN1bGFyIGdyb3VuZCBhb2UgY2VudGVyZWQgb24gTWFyY2hvc2lhcyBhZGRcclxuICAgICdEZWx1YnJ1bVNhdiBEYWh1IEZhbGxpbmcgUm9jayc6ICc1NzZFJywgLy8gZ3JvdW5kIGFvZSBmcm9tIFJldmVyYmVyYXRpbmcgUm9hclxyXG4gICAgJ0RlbHVicnVtU2F2IERhaHUgSG90IENoYXJnZSc6ICc1NzczJywgLy8gZG91YmxlIGNoYXJnZVxyXG5cclxuICAgICdEZWx1YnJ1bVNhdiBEdWVsIE1hc3NpdmUgRXhwbG9zaW9uJzogJzU3OUUnLCAvLyBib21icyBiZWluZyBjbGVhcmVkXHJcbiAgICAnRGVsdWJydW1TYXYgRHVlbCBWaWNpb3VzIFN3aXBlJzogJzU3OTcnLCAvLyBjaXJjdWxhciBhb2UgYXJvdW5kIGJvc3NcclxuICAgICdEZWx1YnJ1bVNhdiBEdWVsIEZvY3VzZWQgVHJlbW9yIDEnOiAnNTc4RicsIC8vIHNxdWFyZSBmbG9vciBhb2VzXHJcbiAgICAnRGVsdWJydW1TYXYgRHVlbCBGb2N1c2VkIFRyZW1vciAyJzogJzU3OTEnLCAvLyBzcXVhcmUgZmxvb3IgYW9lc1xyXG4gICAgJ0RlbHVicnVtU2F2IER1ZWwgRGV2b3VyJzogJzU3ODknLCAvLyBjb25hbCBhb2UgYWZ0ZXIgd2l0aGVyaW5nIGN1cnNlXHJcbiAgICAnRGVsdWJydW1TYXYgRHVlbCBGbGFpbGluZyBTdHJpa2UgMSc6ICc1NzhDJywgLy8gaW5pdGlhbCByb3RhdGluZyBjbGVhdmVcclxuICAgICdEZWx1YnJ1bVNhdiBEdWVsIEZsYWlsaW5nIFN0cmlrZSAyJzogJzU3OEQnLCAvLyByb3RhdGluZyBjbGVhdmVzXHJcblxyXG4gICAgJ0RlbHVicnVtU2F2IEd1YXJkIE9wdGltYWwgT2ZmZW5zaXZlIFN3b3JkJzogJzU4MTknLCAvLyBtaWRkbGUgZXhwbG9zaW9uXHJcbiAgICAnRGVsdWJydW1TYXYgR3VhcmQgT3B0aW1hbCBPZmZlbnNpdmUgU2hpZWxkJzogJzU4MUEnLCAvLyBtaWRkbGUgZXhwbG9zaW9uXHJcbiAgICAnRGVsdWJydW1TYXYgR3VhcmQgT3B0aW1hbCBQbGF5IFN3b3JkJzogJzU4MTYnLCAvLyBPcHRpbWFsIFBsYXkgU3dvcmQgXCJnZXQgb3V0XCJcclxuICAgICdEZWx1YnJ1bVNhdiBHdWFyZCBPcHRpbWFsIFBsYXkgU2hpZWxkJzogJzU4MTcnLCAvLyBPcHRpbWFsIHBsYXkgc2hpZWxkIFwiZ2V0IGluXCJcclxuICAgICdEZWx1YnJ1bVNhdiBHdWFyZCBPcHRpbWFsIFBsYXkgQ2xlYXZlJzogJzU4MTgnLCAvLyBPcHRpbWFsIFBsYXkgY2xlYXZlcyBmb3Igc3dvcmQvc2hpZWxkXHJcbiAgICAnRGVsdWJydW1TYXYgR3VhcmQgVW5sdWNreSBMb3QnOiAnNTgxRCcsIC8vIFF1ZWVuJ3MgS25pZ2h0IG9yYiBleHBsb3Npb25cclxuICAgICdEZWx1YnJ1bVNhdiBHdWFyZCBCdXJuIDEnOiAnNTgzRCcsIC8vIHNtYWxsIGZpcmUgYWRkc1xyXG4gICAgJ0RlbHVicnVtU2F2IEd1YXJkIEJ1cm4gMic6ICc1ODNFJywgLy8gbGFyZ2UgZmlyZSBhZGRzXHJcbiAgICAnRGVsdWJydW1TYXYgR3VhcmQgUGF3biBPZmYnOiAnNTgzQScsIC8vIFF1ZWVuJ3MgU29sZGllciBTZWNyZXRzIFJldmVhbGVkIHRldGhlcmVkIGNsb25lIGFvZVxyXG4gICAgJ0RlbHVicnVtU2F2IEd1YXJkIFR1cnJldFxcJ3MgVG91ciBOb3JtYWwgMSc6ICc1ODQ3JywgLy8gXCJub3JtYWwgbW9kZVwiIHR1cnJldHMsIGluaXRpYWwgbGluZXMgMVxyXG4gICAgJ0RlbHVicnVtU2F2IEd1YXJkIFR1cnJldFxcJ3MgVG91ciBOb3JtYWwgMic6ICc1ODQ4JywgLy8gXCJub3JtYWwgbW9kZVwiIHR1cnJldHMsIGluaXRpYWwgbGluZXMgMlxyXG4gICAgJ0RlbHVicnVtU2F2IEd1YXJkIFR1cnJldFxcJ3MgVG91ciBOb3JtYWwgMyc6ICc1ODQ5JywgLy8gXCJub3JtYWwgbW9kZVwiIHR1cnJldHMsIHNlY29uZCBsaW5lc1xyXG4gICAgJ0RlbHVicnVtU2F2IEd1YXJkIENvdW50ZXJwbGF5JzogJzU4RjUnLCAvLyBIaXR0aW5nIGFldGhlcmlhbCB3YXJkIGRpcmVjdGlvbmFsIGJhcnJpZXJcclxuXHJcbiAgICAnRGVsdWJydW1TYXYgUGhhbnRvbSBTd2lybGluZyBNaWFzbWEgMSc6ICc1N0I4JywgLy8gSW5pdGlhbCBwaGFudG9tIGRvbnV0IGFvZVxyXG4gICAgJ0RlbHVicnVtU2F2IFBoYW50b20gU3dpcmxpbmcgTWlhc21hIDInOiAnNTdCOScsIC8vIE1vdmluZyBwaGFudG9tIGRvbnV0IGFvZXNcclxuICAgICdEZWx1YnJ1bVNhdiBQaGFudG9tIENyZWVwaW5nIE1pYXNtYSAxJzogJzU3QjQnLCAvLyBJbml0aWFsIHBoYW50b20gbGluZSBhb2VcclxuICAgICdEZWx1YnJ1bVNhdiBQaGFudG9tIENyZWVwaW5nIE1pYXNtYSAyJzogJzU3QjUnLCAvLyBMYXRlciBwaGFudG9tIGxpbmUgYW9lXHJcbiAgICAnRGVsdWJydW1TYXYgUGhhbnRvbSBMaW5nZXJpbmcgTWlhc21hIDEnOiAnNTdCNicsIC8vIEluaXRpYWwgcGhhbnRvbSBjaXJjbGUgYW9lXHJcbiAgICAnRGVsdWJydW1TYXYgUGhhbnRvbSBMaW5nZXJpbmcgTWlhc21hIDInOiAnNTdCNycsIC8vIE1vdmluZyBwaGFudG9tIGNpcmNsZSBhb2VcclxuICAgICdEZWx1YnJ1bVNhdiBQaGFudG9tIFZpbGUgV2F2ZSc6ICc1N0JGJywgLy8gcGhhbnRvbSBjb25hbCBhb2VcclxuXHJcbiAgICAnRGVsdWJydW1TYXYgQXZvd2VkIEZ1cnkgT2YgQm96amEnOiAnNTk0QycsIC8vIFRyaW5pdHkgQXZvd2VkIEFsbGVnaWFudCBBcnNlbmFsIFwib3V0XCJcclxuICAgICdEZWx1YnJ1bVNhdiBBdm93ZWQgRmxhc2h2YW5lJzogJzU5NEInLCAvLyBUcmluaXR5IEF2b3dlZCBBbGxlZ2lhbnQgQXJzZW5hbCBcImdldCBiZWhpbmRcIlxyXG4gICAgJ0RlbHVicnVtU2F2IEF2b3dlZCBJbmZlcm5hbCBTbGFzaCc6ICc1OTRBJywgLy8gVHJpbml0eSBBdm93ZWQgQWxsZWdpYW50IEFyc2VuYWwgXCJnZXQgZnJvbnRcIlxyXG4gICAgJ0RlbHVicnVtU2F2IEF2b3dlZCBGbGFtZXMgT2YgQm96amEnOiAnNTkzOScsIC8vIDgwJSBmbG9vciBhb2UgYmVmb3JlIHNoaW1tZXJpbmcgc2hvdCBzd29yZHNcclxuICAgICdEZWx1YnJ1bVNhdiBBdm93ZWQgR2xlYW1pbmcgQXJyb3cnOiAnNTk0RCcsIC8vIFRyaW5pdHkgQXZhdGFyIGxpbmUgYW9lcyBmcm9tIG91dHNpZGVcclxuXHJcbiAgICAnRGVsdWJydW1TYXYgTG9yZCBXaGFjayc6ICc1N0QwJywgLy8gY2xlYXZlXHJcbiAgICAnRGVsdWJydW1TYXYgTG9yZCBEZXZhc3RhdGluZyBCb2x0IDEnOiAnNTdDNScsIC8vIGxpZ2h0bmluZyByaW5nc1xyXG4gICAgJ0RlbHVicnVtU2F2IExvcmQgRGV2YXN0YXRpbmcgQm9sdCAyJzogJzU3QzYnLCAvLyBsaWdodG5pbmcgcmluZ3NcclxuICAgICdEZWx1YnJ1bVNhdiBMb3JkIEVsZWN0cm9jdXRpb24nOiAnNTdDQycsIC8vIHJhbmRvbSBjaXJjbGUgYW9lc1xyXG4gICAgJ0RlbHVicnVtU2F2IExvcmQgUmFwaWQgQm9sdHMnOiAnNTdDMycsIC8vIGRyb3BwZWQgbGlnaHRuaW5nIGFvZXNcclxuICAgICdEZWx1YnJ1bVNhdiBMb3JkIDExMTEtVG9uemUgU3dpbmcnOiAnNTdEOCcsIC8vIHZlcnkgbGFyZ2UgXCJnZXQgb3V0XCIgc3dpbmdcclxuICAgICdEZWx1YnJ1bVNhdiBMb3JkIE1vbmsgQXR0YWNrJzogJzU1QTYnLCAvLyBNb25rIGFkZCBhdXRvLWF0dGFja1xyXG5cclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBOb3J0aHN3YWluXFwncyBHbG93JzogJzU5RjQnLCAvLyBleHBhbmRpbmcgbGluZXMgd2l0aCBleHBsb3Npb24gaW50ZXJzZWN0aW9uc1xyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIFRoZSBNZWFucyAxJzogJzU5RTcnLCAvLyBUaGUgUXVlZW4ncyBCZWNrIGFuZCBDYWxsIGNyb3NzIGFvZSBmcm9tIGFkZHNcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBUaGUgTWVhbnMgMic6ICc1OUVBJywgLy8gVGhlIFF1ZWVuJ3MgQmVjayBhbmQgQ2FsbCBjcm9zcyBhb2UgZnJvbSBhZGRzXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gVGhlIEVuZCAxJzogJzU5RTgnLCAvLyBBbHNvIFRoZSBRdWVlbidzIEJlY2sgYW5kIENhbGwgY3Jvc3MgYW9lIGZyb20gYWRkc1xyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIFRoZSBFbmQgMic6ICc1OUU5JywgLy8gQWxzbyBUaGUgUXVlZW4ncyBCZWNrIGFuZCBDYWxsIGNyb3NzIGFvZSBmcm9tIGFkZHNcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBPcHRpbWFsIE9mZmVuc2l2ZSBTd29yZCc6ICc1QTAyJywgLy8gbWlkZGxlIGV4cGxvc2lvblxyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIE9wdGltYWwgT2ZmZW5zaXZlIFNoaWVsZCc6ICc1QTAzJywgLy8gbWlkZGxlIGV4cGxvc2lvblxyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIEp1ZGdtZW50IEJsYWRlIExlZnQgMSc6ICc1OUYyJywgLy8gZGFzaCBhY3Jvc3Mgcm9vbSB3aXRoIGxlZnQgY2xlYXZlXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gSnVkZ21lbnQgQmxhZGUgTGVmdCAyJzogJzVCODUnLCAvLyBkYXNoIGFjcm9zcyByb29tIHdpdGggbGVmdCBjbGVhdmVcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBKdWRnbWVudCBCbGFkZSBSaWdodCAxJzogJzU5RjEnLCAvLyBkYXNoIGFjcm9zcyByb29tIHdpdGggcmlnaHQgY2xlYXZlXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gSnVkZ21lbnQgQmxhZGUgUmlnaHQgMic6ICc1Qjg0JywgLy8gZGFzaCBhY3Jvc3Mgcm9vbSB3aXRoIHJpZ2h0IGNsZWF2ZVxyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIFBhd24gT2ZmJzogJzVBMUQnLCAvLyBRdWVlbidzIFNvbGRpZXIgU2VjcmV0cyBSZXZlYWxlZCB0ZXRoZXJlZCBjbG9uZSBhb2VcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBPcHRpbWFsIFBsYXkgU3dvcmQnOiAnNTlGRicsIC8vIE9wdGltYWwgUGxheSBTd29yZCBcImdldCBvdXRcIlxyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIE9wdGltYWwgUGxheSBTaGllbGQnOiAnNUEwMCcsIC8vIE9wdGltYWwgcGxheSBzaGllbGQgXCJnZXQgaW5cIlxyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIE9wdGltYWwgUGxheSBDbGVhdmUnOiAnNUEwMScsIC8vIE9wdGltYWwgUGxheSBjbGVhdmVzIGZvciBzd29yZC9zaGllbGRcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBUdXJyZXRcXCdzIFRvdXIgTm9ybWFsIDEnOiAnNUEyOCcsIC8vIFwibm9ybWFsIG1vZGVcIiB0dXJyZXRzLCBpbml0aWFsIGxpbmVzIDFcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBUdXJyZXRcXCdzIFRvdXIgTm9ybWFsIDInOiAnNUEyQScsIC8vIFwibm9ybWFsIG1vZGVcIiB0dXJyZXRzLCBpbml0aWFsIGxpbmVzIDJcclxuICAgICdEZWx1YnJ1bVNhdiBRdWVlbiBUdXJyZXRcXCdzIFRvdXIgTm9ybWFsIDMnOiAnNUEyOScsIC8vIFwibm9ybWFsIG1vZGVcIiB0dXJyZXRzLCBzZWNvbmQgbGluZXNcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdEZWx1YnJ1bVNhdiBBdm93ZWQgSGVhdCBTaG9jayc6ICc1OTI3JywgLy8gdG9vIG11Y2ggaGVhdCBvciBmYWlsaW5nIHRvIHJlZ3VsYXRlIHRlbXBlcmF0dXJlXHJcbiAgICAnRGVsdWJydW1TYXYgQXZvd2VkIENvbGQgU2hvY2snOiAnNTkyOCcsIC8vIHRvbyBtdWNoIGNvbGQgb3IgZmFpbGluZyB0byByZWd1bGF0ZSB0ZW1wZXJhdHVyZVxyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIFF1ZWVuXFwncyBKdXN0aWNlJzogJzU5RUInLCAvLyBmYWlsaW5nIHRvIHdhbGsgdGhlIHJpZ2h0IG51bWJlciBvZiBzcXVhcmVzXHJcbiAgICAnRGVsdWJydW1TYXYgUXVlZW4gR3VubmhpbGRyXFwncyBCbGFkZXMnOiAnNUIyMicsIC8vIG5vdCBiZWluZyBpbiB0aGUgY2hlc3MgYmx1ZSBzYWZlIHNxdWFyZVxyXG4gICAgJ0RlbHVicnVtU2F2IFF1ZWVuIFVubHVja3kgTG90JzogJzU1QjYnLCAvLyBsaWdodG5pbmcgb3JiIGF0dGFja1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRGVsdWJydW1TYXYgU2Vla2VyIFBoYW50b20gQmFsZWZ1bCBPbnNsYXVnaHQnOiAnNUFENicsIC8vIHNvbG8gdGFuayBjbGVhdmVcclxuICAgICdEZWx1YnJ1bVNhdiBMb3JkIEZvZSBTcGxpdHRlcic6ICc1N0Q3JywgLy8gdGFuayBjbGVhdmVcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ0RlbHVicnVtU2F2IFNlZWtlciBNZXJjaWZ1bCBNb29uJzogJzI2MicsIC8vIFwiUGV0cmlmaWNhdGlvblwiIGZyb20gQWV0aGVyaWFsIE9yYiBsb29rYXdheVxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gVGhlc2UgYWJpbGl0eSBpZHMgY2FuIGJlIG9yZGVyZWQgZGlmZmVyZW50bHkgYW5kIFwiaGl0XCIgcGVvcGxlIHdoZW4gbGV2aXRhdGluZy5cclxuICAgICAgaWQ6ICdEZWx1YnJ1bVNhdiBHdWFyZCBMb3RzIENhc3QnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiBbJzU4MjcnLCAnNTgyOCcsICc1QjZDJywgJzVCNkQnLCAnNUJCNicsICc1QkI3JywgJzVCODgnLCAnNUI4OSddLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKF9kYXRhLCBtYXRjaGVzKSA9PiBtYXRjaGVzLmZsYWdzLnNsaWNlKC0yKSA9PT0gJzAzJyxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdEZWx1YnJ1bVNhdiBHb2xlbSBDb21wYWN0aW9uJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnNTc0NicgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgdGV4dDogYCR7bWF0Y2hlcy5zb3VyY2V9OiAke21hdGNoZXMuYWJpbGl0eX1gIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0RlbHVicnVtU2F2IFNsaW1lIFNhbmd1aW5lIEZ1c2lvbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzU1NEQnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIHRleHQ6IGAke21hdGNoZXMuc291cmNlfTogJHttYXRjaGVzLmFiaWxpdHl9YCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc0dhdGVSZXN1cnJlY3Rpb24sXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0UxTiBFZGVuXFwncyBUaHVuZGVyIElJSSc6ICc0NEVEJyxcclxuICAgICdFMU4gRWRlblxcJ3MgQmxpenphcmQgSUlJJzogJzQ0RUMnLFxyXG4gICAgJ0UxTiBQdXJlIEJlYW0nOiAnM0Q5RScsXHJcbiAgICAnRTFOIFBhcmFkaXNlIExvc3QnOiAnM0RBMCcsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRTFOIEVkZW5cXCdzIEZsYXJlJzogJzNEOTcnLFxyXG4gICAgJ0UxTiBQdXJlIExpZ2h0JzogJzNEQTMnLFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnRTFOIEZpcmUgSUlJJzogJzQ0RUInLFxyXG4gICAgJ0UxTiBWaWNlIE9mIFZhbml0eSc6ICc0NEU3JywgLy8gdGFuayBsYXNlcnNcclxuICAgICdFMU4gVmljZSBPZiBBcGF0aHknOiAnNDRFOCcsIC8vIGRwcyBwdWRkbGVzXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBmYWlsaW5nIHRvIGludGVycnVwdCBNYW5hIEJvb3N0ICgzRDhEKVxyXG4vLyBUT0RPOiBmYWlsaW5nIHRvIHBhc3MgaGVhbGVyIGRlYnVmZj9cclxuLy8gVE9ETzogd2hhdCBoYXBwZW5zIGlmIHlvdSBkb24ndCBraWxsIGEgbWV0ZW9yIGR1cmluZyBmb3VyIG9yYnM/XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc0dhdGVSZXN1cnJlY3Rpb25TYXZhZ2UsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0UxUyBFZGVuXFwncyBUaHVuZGVyIElJSSc6ICc0NEY3JyxcclxuICAgICdFMVMgRWRlblxcJ3MgQmxpenphcmQgSUlJJzogJzQ0RjYnLFxyXG4gICAgJ0UxUyBFZGVuXFwncyBSZWdhaW5lZCBCbGl6emFyZCBJSUknOiAnNDRGQScsXHJcbiAgICAnRTFTIFB1cmUgQmVhbSBUcmlkZW50IDEnOiAnM0Q4MycsXHJcbiAgICAnRTFTIFB1cmUgQmVhbSBUcmlkZW50IDInOiAnM0Q4NCcsXHJcbiAgICAnRTFTIFBhcmFkaXNlIExvc3QnOiAnM0Q4NycsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRTFTIEVkZW5cXCdzIEZsYXJlJzogJzNENzMnLFxyXG4gICAgJ0UxUyBQdXJlIExpZ2h0JzogJzNEOEEnLFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnRTFTIEZpcmUvVGh1bmRlciBJSUknOiAnNDRGQicsXHJcbiAgICAnRTFTIFB1cmUgQmVhbSBTaW5nbGUnOiAnM0Q4MScsXHJcbiAgICAnRTFTIFZpY2UgT2YgVmFuaXR5JzogJzQ0RjEnLCAvLyB0YW5rIGxhc2Vyc1xyXG4gICAgJ0UxUyBWaWNlIG9mIEFwYXRoeSc6ICc0NEYyJywgLy8gZHBzIHB1ZGRsZXNcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzIH0gZnJvbSAnLi4vLi4vLi4vb29wc3lfY29tbW9uJztcclxuXHJcbi8vIFRPRE86IHNoYWRvd2V5ZSBmYWlsdXJlICh0b3AgbGluZSBmYWlsLCBib3R0b20gbGluZSBzdWNjZXNzLCBlZmZlY3QgdGhlcmUgdG9vKVxyXG4vLyBbMTY6MTc6MzUuOTY2XSAxNjo0MDAxMTBGRTpWb2lkd2Fsa2VyOjQwQjc6U2hhZG93ZXllOjEwNjEyMzQ1OlRpbmkgUG91dGluaTpGOjEwMDAwOjEwMDE5MEY6XHJcbi8vIFsxNjoxNzozNS45NjZdIDE2OjQwMDExMEZFOlZvaWR3YWxrZXI6NDBCNzpTaGFkb3dleWU6MTA2Nzg5MEE6UG90YXRvIENoaXBweToxOjA6MUM6ODAwMDpcclxuLy8gZ2FpbnMgdGhlIGVmZmVjdCBvZiBQZXRyaWZpY2F0aW9uIGZyb20gVm9pZHdhbGtlciBmb3IgMTAuMDAgU2Vjb25kcy5cclxuLy8gVE9ETzogcHVkZGxlIGZhaWx1cmU/XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc0dhdGVEZXNjZW50LFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFMk4gRG9vbXZvaWQgU2xpY2VyJzogJzNFM0MnLFxyXG4gICAgJ0UyTiBEb29tdm9pZCBHdWlsbG90aW5lJzogJzNFM0InLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMk4gTnl4JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzNFM0QnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnd2FybicsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnQm9vcGVkJyxcclxuICAgICAgICAgICAgZGU6IG1hdGNoZXMuYWJpbGl0eSwgLy8gRklYTUVcclxuICAgICAgICAgICAgZnI6ICdNYWx1cyBkZSBkw6lnw6J0cycsXHJcbiAgICAgICAgICAgIGphOiBtYXRjaGVzLmFiaWxpdHksIC8vIEZJWE1FXHJcbiAgICAgICAgICAgIGNuOiBtYXRjaGVzLmFiaWxpdHksIC8vIEZJWE1FXHJcbiAgICAgICAgICAgIGtvOiAn64uJ7IqkJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmltcG9ydCB7IHBsYXllckRhbWFnZUZpZWxkcyB9IGZyb20gJy4uLy4uLy4uL29vcHN5X2NvbW1vbic7XHJcblxyXG4vLyBUT0RPOiBzaGFkb3dleWUgZmFpbHVyZVxyXG4vLyBUT0RPOiBFbXB0eSBIYXRlICgzRTU5LzNFNUEpIGhpdHMgZXZlcnlib2R5LCBzbyBoYXJkIHRvIHRlbGwgYWJvdXQga25vY2tiYWNrXHJcbi8vIFRPRE86IG1heWJlIG1hcmsgaGVsbCB3aW5kIHBlb3BsZSB3aG8gZ290IGNsaXBwZWQgYnkgc3RhY2s/XHJcbi8vIFRPRE86IG1pc3NpbmcgcHVkZGxlcz9cclxuLy8gVE9ETzogbWlzc2luZyBsaWdodC9kYXJrIGNpcmNsZSBzdGFja1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNHYXRlRGVzY2VudFNhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTJTIERvb212b2lkIFNsaWNlcic6ICczRTUwJyxcclxuICAgICdFM1MgRW1wdHkgUmFnZSc6ICczRTZDJyxcclxuICAgICdFM1MgRG9vbXZvaWQgR3VpbGxvdGluZSc6ICczRTRGJyxcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0UyUyBEb29tdm9pZCBDbGVhdmVyJzogJzNFNjQnLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMlMgU2hhZG93ZXllJyxcclxuICAgICAgLy8gU3RvbmUgQ3Vyc2VcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzU4OScgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMlMgTnl4JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzNFNTEnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnd2FybicsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnQm9vcGVkJyxcclxuICAgICAgICAgICAgZGU6IG1hdGNoZXMuYWJpbGl0eSwgLy8gRklYTUVcclxuICAgICAgICAgICAgZnI6ICdNYWx1cyBkZSBkw6lnw6J0cycsXHJcbiAgICAgICAgICAgIGphOiBtYXRjaGVzLmFiaWxpdHksIC8vIEZJWE1FXHJcbiAgICAgICAgICAgIGNuOiBtYXRjaGVzLmFiaWxpdHksIC8vIEZJWE1FXHJcbiAgICAgICAgICAgIGtvOiAn64uJ7IqkJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNHYXRlSW51bmRhdGlvbixcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTNOIE1vbnN0ZXIgV2F2ZSAxJzogJzNGQ0EnLFxyXG4gICAgJ0UzTiBNb25zdGVyIFdhdmUgMic6ICczRkU5JyxcclxuICAgICdFM04gTWFlbHN0cm9tJzogJzNGRDknLFxyXG4gICAgJ0UzTiBTd2lybGluZyBUc3VuYW1pJzogJzNGRDUnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0UzTiBUZW1wb3JhcnkgQ3VycmVudCAxJzogJzNGQ0UnLFxyXG4gICAgJ0UzTiBUZW1wb3JhcnkgQ3VycmVudCAyJzogJzNGQ0QnLFxyXG4gICAgJ0UzTiBTcGlubmluZyBEaXZlJzogJzNGREInLFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnRTNOIFJpcCBDdXJyZW50JzogJzNGQzcnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogU2NvdXJpbmcgVHN1bmFtaSAoM0NFMCkgb24gc29tZWJvZHkgb3RoZXIgdGhhbiB0YXJnZXRcclxuLy8gVE9ETzogU3dlZXBpbmcgVHN1bmFtaSAoM0ZGNSkgb24gc29tZWJvZHkgb3RoZXIgdGhhbiB0YW5rc1xyXG4vLyBUT0RPOiBSaXAgQ3VycmVudCAoM0ZFMCwgM0ZFMSkgb24gc29tZWJvZHkgb3RoZXIgdGhhbiB0YXJnZXQvdGFua3NcclxuLy8gVE9ETzogQm9pbGVkIEFsaXZlICg0MDA2KSBpcyBmYWlsaW5nIHB1ZGRsZXM/Pz9cclxuLy8gVE9ETzogZmFpbGluZyB0byBjbGVhbnNlIFNwbGFzaGluZyBXYXRlcnNcclxuLy8gVE9ETzogZG9lcyBnZXR0aW5nIGhpdCBieSB1bmRlcnNlYSBxdWFrZSBjYXVzZSBhbiBhYmlsaXR5P1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNHYXRlSW51bmRhdGlvblNhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTNTIE1vbnN0ZXIgV2F2ZSAxJzogJzNGRTUnLFxyXG4gICAgJ0UzUyBNb25zdGVyIFdhdmUgMic6ICczRkU5JyxcclxuICAgICdFM1MgTWFlbHN0cm9tJzogJzNGRkInLFxyXG4gICAgJ0UzUyBTd2lybGluZyBUc3VuYW1pJzogJzNGRjQnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0UzUyBUZW1wb3JhcnkgQ3VycmVudCAxJzogJzNGRUEnLFxyXG4gICAgJ0UzUyBUZW1wb3JhcnkgQ3VycmVudCAyJzogJzNGRUInLFxyXG4gICAgJ0UzUyBUZW1wb3JhcnkgQ3VycmVudCAzJzogJzNGRUMnLFxyXG4gICAgJ0UzUyBUZW1wb3JhcnkgQ3VycmVudCA0JzogJzNGRUQnLFxyXG4gICAgJ0UzUyBTcGlubmluZyBEaXZlJzogJzNGRkQnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zR2F0ZVNlcHVsdHVyZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTROIFdlaWdodCBvZiB0aGUgTGFuZCc6ICc0MEVCJyxcclxuICAgICdFNE4gRXZpbCBFYXJ0aCc6ICc0MEVGJyxcclxuICAgICdFNE4gQWZ0ZXJzaG9jayAxJzogJzQxQjQnLFxyXG4gICAgJ0U0TiBBZnRlcnNob2NrIDInOiAnNDBGMCcsXHJcbiAgICAnRTROIEV4cGxvc2lvbiAxJzogJzQwRUQnLFxyXG4gICAgJ0U0TiBFeHBsb3Npb24gMic6ICc0MEY1JyxcclxuICAgICdFNE4gTGFuZHNsaWRlJzogJzQxMUInLFxyXG4gICAgJ0U0TiBSaWdodHdhcmQgTGFuZHNsaWRlJzogJzQxMDAnLFxyXG4gICAgJ0U0TiBMZWZ0d2FyZCBMYW5kc2xpZGUnOiAnNDBGRicsXHJcbiAgICAnRTROIE1hc3NpdmUgTGFuZHNsaWRlJzogJzQwRkMnLFxyXG4gICAgJ0U0TiBTZWlzbWljIFdhdmUnOiAnNDBGMycsXHJcbiAgICAnRTROIEZhdWx0IExpbmUnOiAnNDEwMScsXHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmltcG9ydCB7IHBsYXllckRhbWFnZUZpZWxkcyB9IGZyb20gJy4uLy4uLy4uL29vcHN5X2NvbW1vbic7XHJcblxyXG4vLyBUT0RPOiBjb3VsZCB0cmFjayBwZW9wbGUgZ2V0IGhpdHRpbmcgYnkgbWFya2VycyB0aGV5IHNob3VsZG4ndFxyXG4vLyBUT0RPOiBjb3VsZCB0cmFjayBub24tdGFua3MgZ2V0dGluZyBoaXQgYnkgdGFua2J1c3RlcnMsIG1lZ2FsaXRoc1xyXG4vLyBUT0RPOiBjb3VsZCB0cmFjayBub24tdGFyZ2V0IGdldHRpbmcgaGl0IGJ5IHRhbmtidXN0ZXJcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zR2F0ZVNlcHVsdHVyZVNhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTRTIFdlaWdodCBvZiB0aGUgTGFuZCc6ICc0MTA4JyxcclxuICAgICdFNFMgRXZpbCBFYXJ0aCc6ICc0MTBDJyxcclxuICAgICdFNFMgQWZ0ZXJzaG9jayAxJzogJzQxQjUnLFxyXG4gICAgJ0U0UyBBZnRlcnNob2NrIDInOiAnNDEwRCcsXHJcbiAgICAnRTRTIEV4cGxvc2lvbic6ICc0MTBBJyxcclxuICAgICdFNFMgTGFuZHNsaWRlJzogJzQxMUInLFxyXG4gICAgJ0U0UyBSaWdodHdhcmQgTGFuZHNsaWRlJzogJzQxMUQnLFxyXG4gICAgJ0U0UyBMZWZ0d2FyZCBMYW5kc2xpZGUnOiAnNDExQycsXHJcbiAgICAnRTRTIE1hc3NpdmUgTGFuZHNsaWRlIDEnOiAnNDExOCcsXHJcbiAgICAnRTRTIE1hc3NpdmUgTGFuZHNsaWRlIDInOiAnNDExOScsXHJcbiAgICAnRTRTIFNlaXNtaWMgV2F2ZSc6ICc0MTEwJyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdFNFMgRHVhbCBFYXJ0aGVuIEZpc3RzIDEnOiAnNDEzNScsXHJcbiAgICAnRTRTIER1YWwgRWFydGhlbiBGaXN0cyAyJzogJzQ2ODcnLFxyXG4gICAgJ0U0UyBQbGF0ZSBGcmFjdHVyZSc6ICc0M0VBJyxcclxuICAgICdFNFMgRWFydGhlbiBGaXN0IDEnOiAnNDNDQScsXHJcbiAgICAnRTRTIEVhcnRoZW4gRmlzdCAyJzogJzQzQzknLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNFMgRmF1bHQgTGluZSBDb2xsZWN0JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuc3RhcnRzVXNpbmcoeyBpZDogJzQxMUUnLCBzb3VyY2U6ICdUaXRhbicgfSksXHJcbiAgICAgIG5ldFJlZ2V4RGU6IE5ldFJlZ2V4ZXMuc3RhcnRzVXNpbmcoeyBpZDogJzQxMUUnLCBzb3VyY2U6ICdUaXRhbicgfSksXHJcbiAgICAgIG5ldFJlZ2V4RnI6IE5ldFJlZ2V4ZXMuc3RhcnRzVXNpbmcoeyBpZDogJzQxMUUnLCBzb3VyY2U6ICdUaXRhbicgfSksXHJcbiAgICAgIG5ldFJlZ2V4SmE6IE5ldFJlZ2V4ZXMuc3RhcnRzVXNpbmcoeyBpZDogJzQxMUUnLCBzb3VyY2U6ICfjgr/jgqTjgr/jg7MnIH0pLFxyXG4gICAgICBuZXRSZWdleENuOiBOZXRSZWdleGVzLnN0YXJ0c1VzaW5nKHsgaWQ6ICc0MTFFJywgc291cmNlOiAn5rOw5Z2mJyB9KSxcclxuICAgICAgbmV0UmVnZXhLbzogTmV0UmVnZXhlcy5zdGFydHNVc2luZyh7IGlkOiAnNDExRScsIHNvdXJjZTogJ+2DgOydtO2DhCcgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmZhdWx0TGluZVRhcmdldCA9IG1hdGNoZXMudGFyZ2V0O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNFMgRmF1bHQgTGluZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICc0MTFFJywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLmZhdWx0TGluZVRhcmdldCAhPT0gbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiAnUnVuIE92ZXInLFxyXG4gICAgICAgICAgICBkZTogbWF0Y2hlcy5hYmlsaXR5LCAvLyBGSVhNRVxyXG4gICAgICAgICAgICBmcjogJ0Egw6l0w6kgw6ljcmFzw6koZSknLFxyXG4gICAgICAgICAgICBqYTogbWF0Y2hlcy5hYmlsaXR5LCAvLyBGSVhNRVxyXG4gICAgICAgICAgICBjbjogbWF0Y2hlcy5hYmlsaXR5LCAvLyBGSVhNRVxyXG4gICAgICAgICAgICBrbzogbWF0Y2hlcy5hYmlsaXR5LCAvLyBGSVhNRVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzIH0gZnJvbSAnLi4vLi4vLi4vb29wc3lfY29tbW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc1ZlcnNlRnVsbWluYXRpb24sXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0U1TiBJbXBhY3QnOiAnNEUzQScsIC8vIFN0cmF0b3NwZWFyIGxhbmRpbmcgQW9FXHJcbiAgICAnRTVOIExpZ2h0bmluZyBCb2x0JzogJzRCOUMnLCAvLyBTdG9ybWNsb3VkIHN0YW5kYXJkIGF0dGFja1xyXG4gICAgJ0U1TiBHYWxsb3AnOiAnNEI5NycsIC8vIFNpZGV3YXlzIGFkZCBjaGFyZ2VcclxuICAgICdFNU4gU2hvY2sgU3RyaWtlJzogJzRCQTEnLCAvLyBTbWFsbCBBb0UgY2lyY2xlcyBkdXJpbmcgVGh1bmRlcnN0b3JtXHJcbiAgICAnRTVOIFZvbHQgU3RyaWtlJzogJzRDRjInLCAvLyBMYXJnZSBBb0UgY2lyY2xlcyBkdXJpbmcgVGh1bmRlcnN0b3JtXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRTVOIEp1ZGdtZW50IEpvbHQnOiAnNEI4RicsIC8vIFN0cmF0b3NwZWFyIGV4cGxvc2lvbnNcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIGEgcGxheWVyIGdldHMgNCsgc3RhY2tzIG9mIG9yYnMuIERvbid0IGJlIGdyZWVkeSFcclxuICAgICAgaWQ6ICdFNU4gU3RhdGljIENvbmRlbnNhdGlvbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc4QjUnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5lZmZlY3QgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIEhlbHBlciBmb3Igb3JiIHBpY2t1cCBmYWlsdXJlc1xyXG4gICAgICBpZDogJ0U1TiBPcmIgR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc4QjQnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNPcmIgPSBkYXRhLmhhc09yYiB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc09yYlttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNU4gT3JiIExvc2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnOEI0JyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzT3JiID0gZGF0YS5oYXNPcmIgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNPcmJbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U1TiBEaXZpbmUgSnVkZ2VtZW50IFZvbHRzJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzRCOUEnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKGRhdGEsIG1hdGNoZXMpID0+ICFkYXRhLmhhc09yYlttYXRjaGVzLnRhcmdldF0sXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiBgJHttYXRjaGVzLmFiaWxpdHl9IChubyBvcmIpYCxcclxuICAgICAgICAgICAgZGU6IGAke21hdGNoZXMuYWJpbGl0eX0gKGtlaW4gT3JiKWAsXHJcbiAgICAgICAgICAgIGZyOiBgJHttYXRjaGVzLmFiaWxpdHl9IChwYXMgZCdvcmJlKWAsXHJcbiAgICAgICAgICAgIGphOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjpm7fnjonnhKHjgZcpYCxcclxuICAgICAgICAgICAgY246IGAke21hdGNoZXMuYWJpbGl0eX0gKOayoeWQg+eQgylgLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNU4gU3Rvcm1jbG91ZCBUYXJnZXQgVHJhY2tpbmcnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5oZWFkTWFya2VyKHsgaWQ6ICcwMDZFJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuY2xvdWRNYXJrZXJzID0gZGF0YS5jbG91ZE1hcmtlcnMgfHwgW107XHJcbiAgICAgICAgZGF0YS5jbG91ZE1hcmtlcnMucHVzaChtYXRjaGVzLnRhcmdldCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBUaGlzIGFiaWxpdHkgaXMgc2VlbiBvbmx5IGlmIHBsYXllcnMgc3RhY2tlZCB0aGUgY2xvdWRzIGluc3RlYWQgb2Ygc3ByZWFkaW5nIHRoZW0uXHJcbiAgICAgIGlkOiAnRTVOIFRoZSBQYXJ0aW5nIENsb3VkcycsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICc0QjlEJywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBzdXBwcmVzc1NlY29uZHM6IDMwLFxyXG4gICAgICBtaXN0YWtlOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGZvciAoY29uc3QgbSBvZiBkYXRhLmNsb3VkTWFya2Vycykge1xyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgICBibGFtZTogZGF0YS5jbG91ZE1hcmtlcnNbbV0sXHJcbiAgICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgICBlbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoY2xvdWRzIHRvbyBjbG9zZSlgLFxyXG4gICAgICAgICAgICAgIGRlOiBgJHttYXRjaGVzLmFiaWxpdHl9IChXb2xrZW4genUgbmFoZSlgLFxyXG4gICAgICAgICAgICAgIGZyOiBgJHttYXRjaGVzLmFiaWxpdHl9IChudWFnZXMgdHJvcCBwcm9jaGVzKWAsXHJcbiAgICAgICAgICAgICAgamE6IGAke21hdGNoZXMuYWJpbGl0eX0gKOmbsui/keOBmeOBjilgLFxyXG4gICAgICAgICAgICAgIGNuOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjpm7fkupHph43lj6ApYCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNU4gU3Rvcm1jbG91ZCBjbGVhbnVwJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuaGVhZE1hcmtlcih7IGlkOiAnMDA2RScgfSksXHJcbiAgICAgIGRlbGF5U2Vjb25kczogMzAsIC8vIFN0b3JtY2xvdWRzIHJlc29sdmUgd2VsbCBiZWZvcmUgdGhpcy5cclxuICAgICAgcnVuOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGRlbGV0ZSBkYXRhLmNsb3VkTWFya2VycztcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmltcG9ydCB7IHBsYXllckRhbWFnZUZpZWxkcyB9IGZyb20gJy4uLy4uLy4uL29vcHN5X2NvbW1vbic7XHJcblxyXG4vLyBUT0RPOiBpcyB0aGVyZSBhIGRpZmZlcmVudCBhYmlsaXR5IGlmIHRoZSBzaGllbGQgZHV0eSBhY3Rpb24gaXNuJ3QgdXNlZCBwcm9wZXJseT9cclxuLy8gVE9ETzogaXMgdGhlcmUgYW4gYWJpbGl0eSBmcm9tIFJhaWRlbiAodGhlIGJpcmQpIGlmIHlvdSBnZXQgZWF0ZW4/XHJcbi8vIFRPRE86IG1heWJlIGNoYWluIGxpZ2h0bmluZyB3YXJuaW5nIGlmIHlvdSBnZXQgaGl0IHdoaWxlIHlvdSBoYXZlIHN5c3RlbSBzaG9jayAoOEI4KVxyXG5cclxuY29uc3Qgbm9PcmIgPSAoc3RyKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGVuOiBzdHIgKyAnIChubyBvcmIpJyxcclxuICAgIGRlOiBzdHIgKyAnIChrZWluIE9yYiknLFxyXG4gICAgZnI6IHN0ciArICcgKHBhcyBkXFwnb3JiZSknLFxyXG4gICAgamE6IHN0ciArICcgKOmbt+eOieeEoeOBlyknLFxyXG4gICAgY246IHN0ciArICcgKOayoeWQg+eQgyknLFxyXG4gICAga286IHN0ciArICcgKOq1rOyKrCDsl4bsnYwpJyxcclxuICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zVmVyc2VGdWxtaW5hdGlvblNhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTVTIEltcGFjdCc6ICc0RTNCJywgLy8gU3RyYXRvc3BlYXIgbGFuZGluZyBBb0VcclxuICAgICdFNVMgR2FsbG9wJzogJzRCQjQnLCAvLyBTaWRld2F5cyBhZGQgY2hhcmdlXHJcbiAgICAnRTVTIFNob2NrIFN0cmlrZSc6ICc0QkMxJywgLy8gU21hbGwgQW9FIGNpcmNsZXMgZHVyaW5nIFRodW5kZXJzdG9ybVxyXG4gICAgJ0U1UyBTdGVwcGVkIExlYWRlciBUd2lzdGVyJzogJzRCQzcnLCAvLyBUd2lzdGVyIHN0ZXBwZWQgbGVhZGVyXHJcbiAgICAnRTVTIFN0ZXBwZWQgTGVhZGVyIERvbnV0JzogJzRCQzgnLCAvLyBEb251dCBzdGVwcGVkIGxlYWRlclxyXG4gICAgJ0U1UyBTaG9jayc6ICc0RTNEJywgLy8gSGF0ZWQgb2YgTGV2aW4gU3Rvcm1jbG91ZC1jbGVhbnNhYmxlIGV4cGxvZGluZyBkZWJ1ZmZcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdFNVMgSnVkZ21lbnQgSm9sdCc6ICc0QkE3JywgLy8gU3RyYXRvc3BlYXIgZXhwbG9zaW9uc1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRTVTIFZvbHQgU3RyaWtlIERvdWJsZSc6ICc0QkMzJywgLy8gTGFyZ2UgQW9FIGNpcmNsZXMgZHVyaW5nIFRodW5kZXJzdG9ybVxyXG4gICAgJ0U1UyBDcmlwcGxpbmcgQmxvdyc6ICc0QkNBJyxcclxuICAgICdFNVMgQ2hhaW4gTGlnaHRuaW5nIERvdWJsZSc6ICc0QkM1JyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIEhlbHBlciBmb3Igb3JiIHBpY2t1cCBmYWlsdXJlc1xyXG4gICAgICBpZDogJ0U1UyBPcmIgR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc4QjQnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNPcmIgPSBkYXRhLmhhc09yYiB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc09yYlttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNVMgT3JiIExvc2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnOEI0JyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzT3JiID0gZGF0YS5oYXNPcmIgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNPcmJbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U1UyBEaXZpbmUgSnVkZ2VtZW50IFZvbHRzJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzRCQjcnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKGRhdGEsIG1hdGNoZXMpID0+ICFkYXRhLmhhc09yYiB8fCAhZGF0YS5oYXNPcmJbbWF0Y2hlcy50YXJnZXRdLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbm9PcmIobWF0Y2hlcy5hYmlsaXR5KSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNVMgVm9sdCBTdHJpa2UgT3JiJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzRCQzMnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKGRhdGEsIG1hdGNoZXMpID0+ICFkYXRhLmhhc09yYiB8fCAhZGF0YS5oYXNPcmJbbWF0Y2hlcy50YXJnZXRdLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbm9PcmIobWF0Y2hlcy5hYmlsaXR5KSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNVMgRGVhZGx5IERpc2NoYXJnZSBCaWcgS25vY2tiYWNrJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzRCQjInLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKGRhdGEsIG1hdGNoZXMpID0+ICFkYXRhLmhhc09yYiB8fCAhZGF0YS5oYXNPcmJbbWF0Y2hlcy50YXJnZXRdLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbm9PcmIobWF0Y2hlcy5hYmlsaXR5KSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFNVMgTGlnaHRuaW5nIEJvbHQnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiAnNEJCOScsIC4uLnBsYXllckRhbWFnZUZpZWxkcyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIC8vIEhhdmluZyBhIG5vbi1pZGVtcG90ZW50IGNvbmRpdGlvbiBmdW5jdGlvbiBpcyBhIGJpdCA8XzxcclxuICAgICAgICAvLyBPbmx5IGNvbnNpZGVyIGxpZ2h0bmluZyBib2x0IGRhbWFnZSBpZiB5b3UgaGF2ZSBhIGRlYnVmZiB0byBjbGVhci5cclxuICAgICAgICBpZiAoIWRhdGEuaGF0ZWQgfHwgIWRhdGEuaGF0ZWRbbWF0Y2hlcy50YXJnZXRdKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGRlbGV0ZSBkYXRhLmhhdGVkW21hdGNoZXMudGFyZ2V0XTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmFiaWxpdHkgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTVTIEhhdGVkIG9mIExldmluJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuaGVhZE1hcmtlcih7IGlkOiAnMDBEMicgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhdGVkID0gZGF0YS5oYXRlZCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhdGVkW21hdGNoZXMudGFyZ2V0XSA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U1UyBTdG9ybWNsb3VkIFRhcmdldCBUcmFja2luZycsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmhlYWRNYXJrZXIoeyBpZDogJzAwNkUnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5jbG91ZE1hcmtlcnMgPSBkYXRhLmNsb3VkTWFya2VycyB8fCBbXTtcclxuICAgICAgICBkYXRhLmNsb3VkTWFya2Vycy5wdXNoKG1hdGNoZXMudGFyZ2V0KTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIFRoaXMgYWJpbGl0eSBpcyBzZWVuIG9ubHkgaWYgcGxheWVycyBzdGFja2VkIHRoZSBjbG91ZHMgaW5zdGVhZCBvZiBzcHJlYWRpbmcgdGhlbS5cclxuICAgICAgaWQ6ICdFNVMgVGhlIFBhcnRpbmcgQ2xvdWRzJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzRCQkEnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIHN1cHByZXNzU2Vjb25kczogMzAsXHJcbiAgICAgIG1pc3Rha2U6IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZm9yIChjb25zdCBtIG9mIGRhdGEuY2xvdWRNYXJrZXJzKSB7XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICAgIGJsYW1lOiBkYXRhLmNsb3VkTWFya2Vyc1ttXSxcclxuICAgICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICAgIGVuOiBgJHttYXRjaGVzLmFiaWxpdHl9IChjbG91ZHMgdG9vIGNsb3NlKWAsXHJcbiAgICAgICAgICAgICAgZGU6IGAke21hdGNoZXMuYWJpbGl0eX0gKFdvbGtlbiB6dSBuYWhlKWAsXHJcbiAgICAgICAgICAgICAgZnI6IGAke21hdGNoZXMuYWJpbGl0eX0gKG51YWdlcyB0cm9wIHByb2NoZXMpYCxcclxuICAgICAgICAgICAgICBqYTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo6Zuy6L+R44GZ44GOKWAsXHJcbiAgICAgICAgICAgICAgY246IGAke21hdGNoZXMuYWJpbGl0eX0gKOmbt+S6kemHjeWPoClgLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U1UyBTdG9ybWNsb3VkIGNsZWFudXAnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5oZWFkTWFya2VyKHsgaWQ6ICcwMDZFJyB9KSxcclxuICAgICAgLy8gU3Rvcm1jbG91ZHMgcmVzb2x2ZSB3ZWxsIGJlZm9yZSB0aGlzLlxyXG4gICAgICBkZWxheVNlY29uZHM6IDMwLFxyXG4gICAgICBydW46IChkYXRhKSA9PiB7XHJcbiAgICAgICAgZGVsZXRlIGRhdGEuY2xvdWRNYXJrZXJzO1xyXG4gICAgICAgIGRlbGV0ZSBkYXRhLmhhdGVkO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc1ZlcnNlRnVyb3IsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0U2TiBUaG9ybnMnOiAnNEJEQScsIC8vIEFvRSBtYXJrZXJzIGFmdGVyIEVudW1lcmF0aW9uXHJcbiAgICAnRTZOIEZlcm9zdG9ybSAxJzogJzRCREQnLFxyXG4gICAgJ0U2TiBGZXJvc3Rvcm0gMic6ICc0QkU1JyxcclxuICAgICdFNk4gU3Rvcm0gT2YgRnVyeSAxJzogJzRCRTAnLCAvLyBDaXJjbGUgQW9FIGR1cmluZyB0ZXRoZXJzLS1HYXJ1ZGFcclxuICAgICdFNk4gU3Rvcm0gT2YgRnVyeSAyJzogJzRCRTYnLCAvLyBDaXJjbGUgQW9FIGR1cmluZyB0ZXRoZXJzLS1SYWt0YXBha3NhXHJcbiAgICAnRTZOIEV4cGxvc2lvbic6ICc0QkUyJywgLy8gQW9FIGNpcmNsZXMsIEdhcnVkYSBvcmJzXHJcbiAgICAnRTZOIEhlYXQgQnVyc3QnOiAnNEJFQycsXHJcbiAgICAnRTZOIENvbmZsYWcgU3RyaWtlJzogJzRCRUUnLCAvLyAyNzAtZGVncmVlIGZyb250YWwgQW9FXHJcbiAgICAnRTZOIFNwaWtlIE9mIEZsYW1lJzogJzRCRjAnLCAvLyBPcmIgZXhwbG9zaW9ucyBhZnRlciBTdHJpa2UgU3BhcmtcclxuICAgICdFNk4gUmFkaWFudCBQbHVtZSc6ICc0QkYyJyxcclxuICAgICdFNk4gRXJ1cHRpb24nOiAnNEJGNCcsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRTZOIFZhY3V1bSBTbGljZSc6ICc0QkQ1JywgLy8gRGFyayBsaW5lIEFvRSBmcm9tIEdhcnVkYVxyXG4gICAgJ0U2TiBEb3duYnVyc3QnOiAnNEJEQicsIC8vIEJsdWUga25vY2tiYWNrIGNpcmNsZS4gQWN0dWFsIGtub2NrYmFjayBpcyB1bmtub3duIGFiaWxpdHkgNEMyMFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAvLyBLaWxscyBub24tdGFua3Mgd2hvIGdldCBoaXQgYnkgaXQuXHJcbiAgICAnRTZOIEluc3RhbnQgSW5jaW5lcmF0aW9uJzogJzRCRUQnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5pbXBvcnQgeyBTaW1wbGVPb3BzeVRyaWdnZXJTZXQgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vb3BzeSc7XHJcblxyXG4vLyBUT0RPOiBjaGVjayB0ZXRoZXJzIGJlaW5nIGN1dCAod2hlbiB0aGV5IHNob3VsZG4ndClcclxuLy8gVE9ETzogY2hlY2sgZm9yIGNvbmN1c3NlZCBkZWJ1ZmZcclxuLy8gVE9ETzogY2hlY2sgZm9yIHRha2luZyB0YW5rYnVzdGVyIHdpdGggbGlnaHRoZWFkZWRcclxuLy8gVE9ETzogY2hlY2sgZm9yIG9uZSBwZXJzb24gdGFraW5nIG11bHRpcGxlIFN0b3JtIE9mIEZ1cnkgVGV0aGVycyAoNEMwMS80QzA4KVxyXG5cclxuY29uc3QgdHJpZ2dlclNldDogU2ltcGxlT29wc3lUcmlnZ2VyU2V0ID0ge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zVmVyc2VGdXJvclNhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAvLyBJdCdzIGNvbW1vbiB0byBqdXN0IGlnbm9yZSBmdXRib2wgbWVjaGFuaWNzLCBzbyBkb24ndCB3YXJuIG9uIFN0cmlrZSBTcGFyay5cclxuICAgIC8vICdTcGlrZSBPZiBGbGFtZSc6ICc0QzEzJywgLy8gT3JiIGV4cGxvc2lvbnMgYWZ0ZXIgU3RyaWtlIFNwYXJrXHJcblxyXG4gICAgJ0U2UyBUaG9ybnMnOiAnNEJGQScsIC8vIEFvRSBtYXJrZXJzIGFmdGVyIEVudW1lcmF0aW9uXHJcbiAgICAnRTZTIEZlcm9zdG9ybSAxJzogJzRCRkQnLFxyXG4gICAgJ0U2UyBGZXJvc3Rvcm0gMic6ICc0QzA2JyxcclxuICAgICdFNlMgU3Rvcm0gT2YgRnVyeSAxJzogJzRDMDAnLCAvLyBDaXJjbGUgQW9FIGR1cmluZyB0ZXRoZXJzLS1HYXJ1ZGFcclxuICAgICdFNlMgU3Rvcm0gT2YgRnVyeSAyJzogJzRDMDcnLCAvLyBDaXJjbGUgQW9FIGR1cmluZyB0ZXRoZXJzLS1SYWt0YXBha3NhXHJcbiAgICAnRTZTIEV4cGxvc2lvbic6ICc0QzAzJywgLy8gQW9FIGNpcmNsZXMsIEdhcnVkYSBvcmJzXHJcbiAgICAnRTZTIEhlYXQgQnVyc3QnOiAnNEMxRicsXHJcbiAgICAnRTZTIENvbmZsYWcgU3RyaWtlJzogJzRDMTAnLCAvLyAyNzAtZGVncmVlIGZyb250YWwgQW9FXHJcbiAgICAnRTZTIFJhZGlhbnQgUGx1bWUnOiAnNEMxNScsXHJcbiAgICAnRTZTIEVydXB0aW9uJzogJzRDMTcnLFxyXG4gICAgJ0U2UyBXaW5kIEN1dHRlcic6ICc0QzAyJywgLy8gVGV0aGVyLWN1dHRpbmcgbGluZSBhb2VcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdFNlMgVmFjdXVtIFNsaWNlJzogJzRCRjUnLCAvLyBEYXJrIGxpbmUgQW9FIGZyb20gR2FydWRhXHJcbiAgICAnRTZTIERvd25idXJzdCAxJzogJzRCRkInLCAvLyBCbHVlIGtub2NrYmFjayBjaXJjbGUgKEdhcnVkYSkuXHJcbiAgICAnRTZTIERvd25idXJzdCAyJzogJzRCRkMnLCAvLyBCbHVlIGtub2NrYmFjayBjaXJjbGUgKFJha3RhcGFrc2EpLlxyXG4gICAgJ0U2UyBNZXRlb3IgU3RyaWtlJzogJzRDMEYnLCAvLyBGcm9udGFsIGF2b2lkYWJsZSB0YW5rIGJ1c3RlclxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRTZTIEhhbmRzIG9mIEhlbGwnOiAnNEMwW0JDXScsIC8vIFRldGhlciBjaGFyZ2VcclxuICAgICdFNlMgSGFuZHMgb2YgRmxhbWUnOiAnNEMwQScsIC8vIEZpcnN0IFRhbmtidXN0ZXJcclxuICAgICdFNlMgSW5zdGFudCBJbmNpbmVyYXRpb24nOiAnNEMwRScsIC8vIFNlY29uZCBUYW5rYnVzdGVyXHJcbiAgICAnRTZTIEJsYXplJzogJzRDMUInLCAvLyBGbGFtZSBUb3JuYWRvIENsZWF2ZVxyXG4gIH0sXHJcbiAgc29sb0ZhaWw6IHtcclxuICAgICdFNlMgQWlyIEJ1bXAnOiAnNEJGOScsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRyaWdnZXJTZXQ7XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5pbXBvcnQgeyBwbGF5ZXJEYW1hZ2VGaWVsZHMgfSBmcm9tICcuLi8uLi8uLi9vb3BzeV9jb21tb24nO1xyXG5cclxuY29uc3Qgd3JvbmdCdWZmID0gKHN0cikgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBlbjogc3RyICsgJyAod3JvbmcgYnVmZiknLFxyXG4gICAgZGU6IHN0ciArICcgKGZhbHNjaGVyIEJ1ZmYpJyxcclxuICAgIGZyOiBzdHIgKyAnIChtYXV2YWlzIGJ1ZmYpJyxcclxuICAgIGphOiBzdHIgKyAnICjkuI3pganliIfjgarjg5Djg5UpJyxcclxuICAgIGNuOiBzdHIgKyAnIChCdWZm6ZSZ5LqGKScsXHJcbiAgICBrbzogc3RyICsgJyAo67KE7ZSEIO2LgOumvCknLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBub0J1ZmYgPSAoc3RyKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGVuOiBzdHIgKyAnIChubyBidWZmKScsXHJcbiAgICBkZTogc3RyICsgJyAoa2VpbiBCdWZmKScsXHJcbiAgICBmcjogc3RyICsgJyAocGFzIGRlIGJ1ZmYpJyxcclxuICAgIGphOiBzdHIgKyAnICjjg5Djg5XnhKHjgZcpJyxcclxuICAgIGNuOiBzdHIgKyAnICjmsqHmnIlCdWZmKScsXHJcbiAgICBrbzogc3RyICsgJyjrsoTtlIQg7JeG7J2MKScsXHJcbiAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc1ZlcnNlSWNvbm9jbGFzbSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTdOIFN0eWdpYW4gU3dvcmQnOiAnNEM1NScsIC8vIENpcmNsZSBncm91bmQgQW9FcyBhZnRlciBGYWxzZSBUd2lsaWdodFxyXG4gICAgJ0U3TiBTdHJlbmd0aCBJbiBOdW1iZXJzIERvbnV0JzogJzRDNEMnLCAvLyBMYXJnZSBkb251dCBncm91bmQgQW9FcywgaW50ZXJtaXNzaW9uXHJcbiAgICAnRTdOIFN0cmVuZ3RoIEluIE51bWJlcnMgMic6ICc0QzREJywgLy8gTGFyZ2UgY2lyY2xlIGdyb3VuZCBBb0VzLCBpbnRlcm1pc3Npb25cclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0U3TiBTdHlnaWFuIFN0YWtlJzogJzRDMzMnLCAvLyBMYXNlciB0YW5rIGJ1c3Rlciwgb3V0c2lkZSBpbnRlcm1pc3Npb24gcGhhc2VcclxuICAgICdFNU4gU2lsdmVyIFNob3QnOiAnNEU3RCcsIC8vIFNwcmVhZCBtYXJrZXJzLCBpbnRlcm1pc3Npb25cclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTdOIEFzdHJhbCBFZmZlY3QgR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc4QkUnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNBc3RyYWwgPSBkYXRhLmhhc0FzdHJhbCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc0FzdHJhbFttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN04gQXN0cmFsIEVmZmVjdCBMb3NlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMubG9zZXNFZmZlY3QoeyBlZmZlY3RJZDogJzhCRScgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc0FzdHJhbCA9IGRhdGEuaGFzQXN0cmFsIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzQXN0cmFsW21hdGNoZXMudGFyZ2V0XSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN04gVW1icmFsIEVmZmVjdCBHYWluJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzhCRicgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc1VtYnJhbCA9IGRhdGEuaGFzVW1icmFsIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzVW1icmFsW21hdGNoZXMudGFyZ2V0XSA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U3TiBVbWJyYWwgRWZmZWN0IExvc2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnOEJGJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzVW1icmFsID0gZGF0YS5oYXNVbWJyYWwgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNVbWJyYWxbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U3TiBMaWdodFxcJ3MgQ291cnNlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogWyc0QzNFJywgJzRDNDAnLCAnNEMyMicsICc0QzNDJywgJzRFNjMnXSwgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuICFkYXRhLmhhc1VtYnJhbCB8fCAhZGF0YS5oYXNVbWJyYWxbbWF0Y2hlcy50YXJnZXRdO1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGlmIChkYXRhLmhhc0FzdHJhbCAmJiBkYXRhLmhhc0FzdHJhbFttYXRjaGVzLnRhcmdldF0pXHJcbiAgICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogd3JvbmdCdWZmKG1hdGNoZXMuYWJpbGl0eSkgfTtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnd2FybicsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbm9CdWZmKG1hdGNoZXMuYWJpbGl0eSkgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTdOIERhcmtzXFwncyBDb3Vyc2UnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiBbJzRDM0QnLCAnNEMyMycsICc0QzQxJywgJzRDNDMnXSwgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuICFkYXRhLmhhc0FzdHJhbCB8fCAhZGF0YS5oYXNBc3RyYWxbbWF0Y2hlcy50YXJnZXRdO1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGlmIChkYXRhLmhhc1VtYnJhbCAmJiBkYXRhLmhhc1VtYnJhbFttYXRjaGVzLnRhcmdldF0pXHJcbiAgICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogd3JvbmdCdWZmKG1hdGNoZXMuYWJpbGl0eSkgfTtcclxuICAgICAgICAvLyBUaGlzIGNhc2UgaXMgcHJvYmFibHkgaW1wb3NzaWJsZSwgYXMgdGhlIGRlYnVmZiB0aWNrcyBhZnRlciBkZWF0aCxcclxuICAgICAgICAvLyBidXQgbGVhdmluZyBpdCBoZXJlIGluIGNhc2UgdGhlcmUncyBzb21lIHJleiBvciBkaXNjb25uZWN0IHRpbWluZ1xyXG4gICAgICAgIC8vIHRoYXQgY291bGQgbGVhZCB0byB0aGlzLlxyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBub0J1ZmYobWF0Y2hlcy5hYmlsaXR5KSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5pbXBvcnQgeyBPb3BzeURhdGEgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9kYXRhJztcclxuaW1wb3J0IHsgT29wc3lUcmlnZ2VyU2V0IH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvb29wc3knO1xyXG5pbXBvcnQgeyBwbGF5ZXJEYW1hZ2VGaWVsZHMgfSBmcm9tICcuLi8uLi8uLi9vb3BzeV9jb21tb24nO1xyXG5cclxuLy8gVE9ETzogbWlzc2luZyBhbiBvcmIgZHVyaW5nIHRvcm5hZG8gcGhhc2VcclxuLy8gVE9ETzoganVtcGluZyBpbiB0aGUgdG9ybmFkbyBkYW1hZ2U/P1xyXG4vLyBUT0RPOiB0YWtpbmcgc3VuZ3JhY2UoNEM4MCkgb3IgbW9vbmdyYWNlKDRDODIpIHdpdGggd3JvbmcgZGVidWZmXHJcbi8vIFRPRE86IHN0eWdpYW4gc3BlYXIvc2lsdmVyIHNwZWFyIHdpdGggdGhlIHdyb25nIGRlYnVmZlxyXG4vLyBUT0RPOiB0YWtpbmcgZXhwbG9zaW9uIGZyb20gdGhlIHdyb25nIENoaWFyby9TY3VybyBvcmJcclxuLy8gVE9ETzogaGFuZGxlIDRDODkgU2lsdmVyIFN0YWtlIHRhbmtidXN0ZXIgMm5kIGhpdCwgYXMgaXQncyBvayB0byBoYXZlIHR3byBpbi5cclxuXHJcbmNvbnN0IHdyb25nQnVmZiA9IChzdHI6IHN0cmluZykgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBlbjogc3RyICsgJyAod3JvbmcgYnVmZiknLFxyXG4gICAgZGU6IHN0ciArICcgKGZhbHNjaGVyIEJ1ZmYpJyxcclxuICAgIGZyOiBzdHIgKyAnIChtYXV2YWlzIGJ1ZmYpJyxcclxuICAgIGphOiBzdHIgKyAnICjkuI3pganliIfjgarjg5Djg5UpJyxcclxuICAgIGNuOiBzdHIgKyAnIChCdWZm6ZSZ5LqGKScsXHJcbiAgICBrbzogc3RyICsgJyAo67KE7ZSEIO2LgOumvCknLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBub0J1ZmYgPSAoc3RyOiBzdHJpbmcpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgZW46IHN0ciArICcgKG5vIGJ1ZmYpJyxcclxuICAgIGRlOiBzdHIgKyAnIChrZWluIEJ1ZmYpJyxcclxuICAgIGZyOiBzdHIgKyAnIChwYXMgZGUgYnVmZiknLFxyXG4gICAgamE6IHN0ciArICcgKOODkOODleeEoeOBlyknLFxyXG4gICAgY246IHN0ciArICcgKOayoeaciUJ1ZmYpJyxcclxuICAgIGtvOiBzdHIgKyAnICjrsoTtlIQg7JeG7J2MKScsXHJcbiAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGF0YSBleHRlbmRzIE9vcHN5RGF0YSB7XHJcbiAgaGFzQXN0cmFsPzogeyBbbmFtZTogc3RyaW5nXTogYm9vbGVhbiB9O1xyXG4gIGhhc1VtYnJhbD86IHsgW25hbWU6IHN0cmluZ106IGJvb2xlYW4gfTtcclxufVxyXG5cclxuY29uc3QgdHJpZ2dlclNldDogT29wc3lUcmlnZ2VyU2V0PERhdGE+ID0ge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zVmVyc2VJY29ub2NsYXNtU2F2YWdlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFN1MgU2lsdmVyIFN3b3JkJzogJzRDOEUnLCAvLyBncm91bmQgYW9lXHJcbiAgICAnRTdTIE92ZXJ3aGVsbWluZyBGb3JjZSc6ICc0QzczJywgLy8gYWRkIHBoYXNlIGdyb3VuZCBhb2VcclxuICAgICdFN1MgU3RyZW5ndGggaW4gTnVtYmVycyAxJzogJzRDNzAnLCAvLyBhZGQgZ2V0IHVuZGVyXHJcbiAgICAnRTdTIFN0cmVuZ3RoIGluIE51bWJlcnMgMic6ICc0QzcxJywgLy8gYWRkIGdldCBvdXRcclxuICAgICdFN1MgUGFwZXIgQ3V0JzogJzRDN0QnLCAvLyB0b3JuYWRvIGdyb3VuZCBhb2VzXHJcbiAgICAnRTdTIEJ1ZmZldCc6ICc0Qzc3JywgLy8gdG9ybmFkbyBncm91bmQgYW9lcyBhbHNvPz9cclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdFN1MgQmV0d2l4dCBXb3JsZHMnOiAnNEM2QicsIC8vIHB1cnBsZSBncm91bmQgbGluZSBhb2VzXHJcbiAgICAnRTdTIENydXNhZGUnOiAnNEM1OCcsIC8vIGJsdWUga25vY2tiYWNrIGNpcmNsZSAoc3RhbmRpbmcgaW4gaXQpXHJcbiAgICAnRTdTIEV4cGxvc2lvbic6ICc0QzZGJywgLy8gZGlkbid0IGtpbGwgYW4gYWRkXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdFN1MgU3R5Z2lhbiBTdGFrZSc6ICc0QzM0JywgLy8gTGFzZXIgdGFuayBidXN0ZXIgMVxyXG4gICAgJ0U3UyBTaWx2ZXIgU2hvdCc6ICc0QzkyJywgLy8gU3ByZWFkIG1hcmtlcnNcclxuICAgICdFN1MgU2lsdmVyIFNjb3VyZ2UnOiAnNEM5MycsIC8vIEljZSBtYXJrZXJzXHJcbiAgICAnRTdTIENoaWFybyBTY3VybyBFeHBsb3Npb24gMSc6ICc0RDE0JywgLy8gb3JiIGV4cGxvc2lvblxyXG4gICAgJ0U3UyBDaGlhcm8gU2N1cm8gRXhwbG9zaW9uIDInOiAnNEQxNScsIC8vIG9yYiBleHBsb3Npb25cclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIC8vIEludGVycnVwdFxyXG4gICAgICBpZDogJ0U3UyBBZHZlbnQgT2YgTGlnaHQnLFxyXG4gICAgICB0eXBlOiAnQWJpbGl0eScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzRDNkUnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICAvLyBUT0RPOiBpcyB0aGlzIGJsYW1lIGNvcnJlY3Q/IGRvZXMgdGhpcyBoYXZlIGEgdGFyZ2V0P1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmFiaWxpdHkgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTdTIEFzdHJhbCBFZmZlY3QgR2FpbicsXHJcbiAgICAgIHR5cGU6ICdHYWluc0VmZmVjdCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc4QkUnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNBc3RyYWwgPSBkYXRhLmhhc0FzdHJhbCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc0FzdHJhbFttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN1MgQXN0cmFsIEVmZmVjdCBMb3NlJyxcclxuICAgICAgdHlwZTogJ0xvc2VzRWZmZWN0JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMubG9zZXNFZmZlY3QoeyBlZmZlY3RJZDogJzhCRScgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc0FzdHJhbCA9IGRhdGEuaGFzQXN0cmFsIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzQXN0cmFsW21hdGNoZXMudGFyZ2V0XSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN1MgVW1icmFsIEVmZmVjdCBHYWluJyxcclxuICAgICAgdHlwZTogJ0dhaW5zRWZmZWN0JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzhCRicgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc1VtYnJhbCA9IGRhdGEuaGFzVW1icmFsIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzVW1icmFsW21hdGNoZXMudGFyZ2V0XSA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U3UyBVbWJyYWwgRWZmZWN0IExvc2UnLFxyXG4gICAgICB0eXBlOiAnTG9zZXNFZmZlY3QnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnOEJGJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuaGFzVW1icmFsID0gZGF0YS5oYXNVbWJyYWwgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNVbWJyYWxbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U3UyBMaWdodFxcJ3MgQ291cnNlJyxcclxuICAgICAgdHlwZTogJ0FiaWxpdHknLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiBbJzRDNjInLCAnNEM2MycsICc0QzY0JywgJzRDNUInLCAnNEM1RiddLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4gIWRhdGEuaGFzVW1icmFsIHx8ICFkYXRhLmhhc1VtYnJhbFttYXRjaGVzLnRhcmdldF07XHJcbiAgICAgIH0sXHJcbiAgICAgIG1pc3Rha2U6IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgaWYgKGRhdGEuaGFzQXN0cmFsICYmIGRhdGEuaGFzQXN0cmFsW21hdGNoZXMudGFyZ2V0XSlcclxuICAgICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiB3cm9uZ0J1ZmYobWF0Y2hlcy5hYmlsaXR5KSB9O1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBub0J1ZmYobWF0Y2hlcy5hYmlsaXR5KSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN1MgRGFya3NcXCdzIENvdXJzZScsXHJcbiAgICAgIHR5cGU6ICdBYmlsaXR5JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogWyc0QzY1JywgJzRDNjYnLCAnNEM2NycsICc0QzVBJywgJzRDNjAnXSwgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuICFkYXRhLmhhc0FzdHJhbCB8fCAhZGF0YS5oYXNBc3RyYWxbbWF0Y2hlcy50YXJnZXRdO1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGlmIChkYXRhLmhhc1VtYnJhbCAmJiBkYXRhLmhhc1VtYnJhbFttYXRjaGVzLnRhcmdldF0pXHJcbiAgICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogd3JvbmdCdWZmKG1hdGNoZXMuYWJpbGl0eSkgfTtcclxuICAgICAgICAvLyBUaGlzIGNhc2UgaXMgcHJvYmFibHkgaW1wb3NzaWJsZSwgYXMgdGhlIGRlYnVmZiB0aWNrcyBhZnRlciBkZWF0aCxcclxuICAgICAgICAvLyBidXQgbGVhdmluZyBpdCBoZXJlIGluIGNhc2UgdGhlcmUncyBzb21lIHJleiBvciBkaXNjb25uZWN0IHRpbWluZ1xyXG4gICAgICAgIC8vIHRoYXQgY291bGQgbGVhZCB0byB0aGlzLlxyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBub0J1ZmYobWF0Y2hlcy5hYmlsaXR5KSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFN1MgQ3J1c2FkZSBLbm9ja2JhY2snLFxyXG4gICAgICB0eXBlOiAnQWJpbGl0eScsXHJcbiAgICAgIC8vIDRDNzYgaXMgdGhlIGtub2NrYmFjayBkYW1hZ2UsIDRDNTggaXMgdGhlIGRhbWFnZSBmb3Igc3RhbmRpbmcgb24gdGhlIHB1Y2suXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICc0Qzc2JywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnS25vY2tlZCBvZmYnLFxyXG4gICAgICAgICAgICBkZTogJ1J1bnRlcmdlZmFsbGVuJyxcclxuICAgICAgICAgICAgZnI6ICdBIMOpdMOpIGFzc29tbcOpKGUpJyxcclxuICAgICAgICAgICAgamE6ICfjg47jg4Pjgq/jg5Djg4Pjgq8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0cmlnZ2VyU2V0O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzIH0gZnJvbSAnLi4vLi4vLi4vb29wc3lfY29tbW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc1ZlcnNlUmVmdWxnZW5jZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRThOIEJpdGluZyBGcm9zdCc6ICc0RERCJywgLy8gMjcwLWRlZ3JlZSBmcm9udGFsIEFvRSwgU2hpdmFcclxuICAgICdFOE4gRHJpdmluZyBGcm9zdCc6ICc0RERDJywgLy8gUmVhciBjb25lIEFvRSwgU2hpdmFcclxuICAgICdFOE4gRnJpZ2lkIFN0b25lJzogJzRFNjYnLCAvLyBTbWFsbCBzcHJlYWQgY2lyY2xlcywgcGhhc2UgMVxyXG4gICAgJ0U4TiBSZWZsZWN0ZWQgQXhlIEtpY2snOiAnNEUwMCcsIC8vIExhcmdlIGNpcmNsZSBBb0UsIEZyb3plbiBNaXJyb3JcclxuICAgICdFOE4gUmVmbGVjdGVkIFNjeXRoZSBLaWNrJzogJzRFMDEnLCAvLyBEb251dCBBb0UsIEZyb3plbiBNaXJyb3JcclxuICAgICdFOE4gRnJpZ2lkIEVydXB0aW9uJzogJzRFMDknLCAvLyBTbWFsbCBjaXJjbGUgQW9FIHB1ZGRsZXMsIHBoYXNlIDFcclxuICAgICdFOE4gSWNpY2xlIEltcGFjdCc6ICc0RTBBJywgLy8gTGFyZ2UgY2lyY2xlIEFvRSBwdWRkbGVzLCBwaGFzZSAxXHJcbiAgICAnRThOIEF4ZSBLaWNrJzogJzRERTInLCAvLyBMYXJnZSBjaXJjbGUgQW9FLCBTaGl2YVxyXG4gICAgJ0U4TiBTY3l0aGUgS2ljayc6ICc0REUzJywgLy8gRG9udXQgQW9FLCBTaGl2YVxyXG4gICAgJ0U4TiBSZWZsZWN0ZWQgQml0aW5nIEZyb3N0JzogJzRERkUnLCAvLyAyNzAtZGVncmVlIGZyb250YWwgQW9FLCBGcm96ZW4gTWlycm9yXHJcbiAgICAnRThOIFJlZmxlY3RlZCBEcml2aW5nIEZyb3N0JzogJzRERkYnLCAvLyBDb25lIEFvRSwgRnJvemVuIE1pcnJvclxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdFOE4gU2hpbmluZyBBcm1vcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc5NScgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFOE4gSGVhdmVubHkgU3RyaWtlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzRERDgnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdQdXNoZWQgb2ZmIScsXHJcbiAgICAgICAgICAgIGRlOiAnUnVudGVyIGdlc3Rvw59lbiEnLFxyXG4gICAgICAgICAgICBmcjogJ0Egw6l0w6kgcG91c3PDqShlKSAhJyxcclxuICAgICAgICAgICAgamE6ICfjg47jg4Pjgq/jg5Djg4Pjgq8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOWdoOiQvScsXHJcbiAgICAgICAgICAgIGtvOiAn64SJ67Cx65CoIScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0U4TiBGcm9zdCBBcm1vcicsXHJcbiAgICAgIC8vIFRoaW4gSWNlXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICczOEYnIH0pLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnU2xpZCBvZmYhJyxcclxuICAgICAgICAgICAgZGU6ICdydW50ZXJnZXJ1dHNjaHQhJyxcclxuICAgICAgICAgICAgZnI6ICdBIGdsaXNzw6koZSkgIScsXHJcbiAgICAgICAgICAgIGphOiAn5ruR44Gj44GfJyxcclxuICAgICAgICAgICAgY246ICfmu5HokL0nLFxyXG4gICAgICAgICAgICBrbzogJ+uvuOuBhOufrOynkCEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogcnVzaCBoaXR0aW5nIHRoZSBjcnlzdGFsXHJcbi8vIFRPRE86IGFkZHMgbm90IGJlaW5nIGtpbGxlZFxyXG4vLyBUT0RPOiB0YWtpbmcgdGhlIHJ1c2ggdHdpY2UgKHdoZW4geW91IGhhdmUgZGVidWZmKVxyXG4vLyBUT0RPOiBub3QgaGl0dGluZyB0aGUgZHJhZ29uIGZvdXIgdGltZXMgZHVyaW5nIHd5cm0ncyBsYW1lbnRcclxuLy8gVE9ETzogZGVhdGggcmVhc29ucyBmb3Igbm90IHBpY2tpbmcgdXAgcHVkZGxlXHJcbi8vIFRPRE86IG5vdCBiZWluZyBpbiB0aGUgdG93ZXIgd2hlbiB5b3Ugc2hvdWxkXHJcbi8vIFRPRE86IHBpY2tpbmcgdXAgdG9vIG1hbnkgc3RhY2tzXHJcblxyXG4vLyBOb3RlOiBCYW5pc2ggSUlJICg0REE4KSBhbmQgQmFuaXNoIElpaSBEaXZpZGVkICg0REE5KSBib3RoIGFyZSB0eXBlPTB4MTYgbGluZXMuXHJcbi8vIFRoZSBzYW1lIGlzIHRydWUgZm9yIEJhbmlzaCAoNERBNikgYW5kIEJhbmlzaCBEaXZpZGVkICg0REE3KS5cclxuLy8gSSdtIG5vdCBzdXJlIHRoaXMgbWFrZXMgYW55IHNlbnNlPyBCdXQgY2FuJ3QgdGVsbCBpZiB0aGUgc3ByZWFkIHdhcyBhIG1pc3Rha2Ugb3Igbm90LlxyXG4vLyBNYXliZSB3ZSBjb3VsZCBjaGVjayBmb3IgXCJNYWdpYyBWdWxuZXJhYmlsaXR5IFVwXCI/XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuRWRlbnNWZXJzZVJlZnVsZ2VuY2VTYXZhZ2UsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0U4UyBCaXRpbmcgRnJvc3QnOiAnNEQ2NicsIC8vIDI3MC1kZWdyZWUgZnJvbnRhbCBBb0UsIFNoaXZhXHJcbiAgICAnRThTIERyaXZpbmcgRnJvc3QnOiAnNEQ2NycsIC8vIFJlYXIgY29uZSBBb0UsIFNoaXZhXHJcbiAgICAnRThTIEF4ZSBLaWNrJzogJzRENkQnLCAvLyBMYXJnZSBjaXJjbGUgQW9FLCBTaGl2YVxyXG4gICAgJ0U4UyBTY3l0aGUgS2ljayc6ICc0RDZFJywgLy8gRG9udXQgQW9FLCBTaGl2YVxyXG4gICAgJ0U4UyBSZWZsZWN0ZWQgQXhlIEtpY2snOiAnNERCOScsIC8vIExhcmdlIGNpcmNsZSBBb0UsIEZyb3plbiBNaXJyb3JcclxuICAgICdFOFMgUmVmbGVjdGVkIFNjeXRoZSBLaWNrJzogJzREQkEnLCAvLyBEb251dCBBb0UsIEZyb3plbiBNaXJyb3JcclxuICAgICdFOFMgRnJpZ2lkIEVydXB0aW9uJzogJzREOUYnLCAvLyBTbWFsbCBjaXJjbGUgQW9FIHB1ZGRsZXMsIHBoYXNlIDFcclxuICAgICdFOFMgRnJpZ2lkIE5lZWRsZSc6ICc0RDlEJywgLy8gOC13YXkgXCJmbG93ZXJcIiBleHBsb3Npb25cclxuICAgICdFOFMgSWNpY2xlIEltcGFjdCc6ICc0REEwJywgLy8gTGFyZ2UgY2lyY2xlIEFvRSBwdWRkbGVzLCBwaGFzZSAxXHJcbiAgICAnRThTIFJlZmxlY3RlZCBCaXRpbmcgRnJvc3QgMSc6ICc0REI3JywgLy8gMjcwLWRlZ3JlZSBmcm9udGFsIEFvRSwgRnJvemVuIE1pcnJvclxyXG4gICAgJ0U4UyBSZWZsZWN0ZWQgQml0aW5nIEZyb3N0IDInOiAnNERDMycsIC8vIDI3MC1kZWdyZWUgZnJvbnRhbCBBb0UsIEZyb3plbiBNaXJyb3JcclxuICAgICdFOFMgUmVmbGVjdGVkIERyaXZpbmcgRnJvc3QgMSc6ICc0REI4JywgLy8gQ29uZSBBb0UsIEZyb3plbiBNaXJyb3JcclxuICAgICdFOFMgUmVmbGVjdGVkIERyaXZpbmcgRnJvc3QgMic6ICc0REM0JywgLy8gQ29uZSBBb0UsIEZyb3plbiBNaXJyb3JcclxuXHJcbiAgICAnRThTIEhhbGxvd2VkIFdpbmdzIDEnOiAnNEQ3NScsIC8vIExlZnQgY2xlYXZlXHJcbiAgICAnRThTIEhhbGxvd2VkIFdpbmdzIDInOiAnNEQ3NicsIC8vIFJpZ2h0IGNsZWF2ZVxyXG4gICAgJ0U4UyBIYWxsb3dlZCBXaW5ncyAzJzogJzRENzcnLCAvLyBLbm9ja2JhY2sgZnJvbnRhbCBjbGVhdmVcclxuICAgICdFOFMgUmVmbGVjdGVkIEhhbGxvd2VkIFdpbmdzIDEnOiAnNEQ5MCcsIC8vIFJlZmxlY3RlZCBsZWZ0IDJcclxuICAgICdFOFMgUmVmbGVjdGVkIEhhbGxvd2VkIFdpbmdzIDInOiAnNERCQicsIC8vIFJlZmxlY3RlZCBsZWZ0IDFcclxuICAgICdFOFMgUmVmbGVjdGVkIEhhbGxvd2VkIFdpbmdzIDMnOiAnNERDNycsIC8vIFJlZmxlY3RlZCByaWdodCAyXHJcbiAgICAnRThTIFJlZmxlY3RlZCBIYWxsb3dlZCBXaW5ncyA0JzogJzREOTEnLCAvLyBSZWZsZWN0ZWQgcmlnaHQgMVxyXG4gICAgJ0U4UyBUd2luIFN0aWxsbmVzcyAxJzogJzRENjgnLFxyXG4gICAgJ0U4UyBUd2luIFN0aWxsbmVzcyAyJzogJzRENkInLFxyXG4gICAgJ0U4UyBUd2luIFNpbGVuY2UgMSc6ICc0RDY5JyxcclxuICAgICdFOFMgVHdpbiBTaWxlbmNlIDInOiAnNEQ2QScsXHJcbiAgICAnRThTIEFraCBSaGFpJzogJzREOTknLFxyXG4gICAgJ0U4UyBFbWJpdHRlcmVkIERhbmNlIDEnOiAnNEQ3MCcsXHJcbiAgICAnRThTIEVtYml0dGVyZWQgRGFuY2UgMic6ICc0RDcxJyxcclxuICAgICdFOFMgU3BpdGVmdWwgRGFuY2UgMSc6ICc0RDZGJyxcclxuICAgICdFOFMgU3BpdGVmdWwgRGFuY2UgMic6ICc0RDcyJyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgIC8vIEJyb2tlbiB0ZXRoZXIuXHJcbiAgICAnRThTIFJlZnVsZ2VudCBGYXRlJzogJzREQTQnLFxyXG4gICAgLy8gU2hhcmVkIG9yYiwgY29ycmVjdCBpcyBCcmlnaHQgUHVsc2UgKDREOTUpXHJcbiAgICAnRThTIEJsaW5kaW5nIFB1bHNlJzogJzREOTYnLFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnRThTIFBhdGggb2YgTGlnaHQnOiAnNERBMScsIC8vIFByb3RlYW5cclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRThTIFNoaW5pbmcgQXJtb3InLFxyXG4gICAgICAvLyBTdHVuXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc5NScgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gSW50ZXJydXB0XHJcbiAgICAgIGlkOiAnRThTIFN0b25lc2tpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzREODUnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zUHJvbWlzZVVtYnJhLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFOU4gVGhlIEFydCBPZiBEYXJrbmVzcyAxJzogJzUyMjMnLCAvLyBsZWZ0LXJpZ2h0IGNsZWF2ZVxyXG4gICAgJ0U5TiBUaGUgQXJ0IE9mIERhcmtuZXNzIDInOiAnNTIyNCcsIC8vIGxlZnQtcmlnaHQgY2xlYXZlXHJcbiAgICAnRTlOIFdpZGUtQW5nbGUgUGFydGljbGUgQmVhbSc6ICc1QUZGJywgLy8gZnJvbnRhbCBjbGVhdmUgdHV0b3JpYWwgbWVjaGFuaWNcclxuICAgICdFOU4gV2lkZS1BbmdsZSBQaGFzZXInOiAnNTVFMScsIC8vIHdpZGUtYW5nbGUgXCJzaWRlc1wiXHJcbiAgICAnRTlOIEJhZCBWaWJyYXRpb25zJzogJzU1RTYnLCAvLyB0ZXRoZXJlZCBvdXRzaWRlIGdpYW50IHRyZWUgZ3JvdW5kIGFvZXNcclxuICAgICdFOU4gRWFydGgtU2hhdHRlcmluZyBQYXJ0aWNsZSBCZWFtJzogJzUyMjUnLCAvLyBtaXNzaW5nIHRvd2Vycz9cclxuICAgICdFOU4gQW50aS1BaXIgUGFydGljbGUgQmVhbSc6ICc1NURDJywgLy8gXCJnZXQgb3V0XCIgZHVyaW5nIHBhbmVsc1xyXG4gICAgJ0U5TiBaZXJvLUZvcm0gUGFydGljbGUgQmVhbSAyJzogJzU1REInLCAvLyBDbG9uZSBsaW5lIGFvZXMgdy8gQW50aS1BaXIgUGFydGljbGUgQmVhbVxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0U5TiBXaXRoZHJhdyc6ICc1NTM0JywgLy8gU2xvdyB0byBicmVhayBzZWVkIGNoYWluLCBnZXQgc3Vja2VkIGJhY2sgaW4geWlrZXNcclxuICAgICdFOU4gQWV0aGVyb3N5bnRoZXNpcyc6ICc1NTM1JywgLy8gU3RhbmRpbmcgb24gc2VlZHMgZHVyaW5nIGV4cGxvc2lvbiAocG9zc2libHkgdmlhIFdpdGhkcmF3KVxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRTlOIFplcm8tRm9ybSBQYXJ0aWNsZSBCZWFtIDEnOiAnNTVFQicsIC8vIHRhbmsgbGFzZXIgd2l0aCBtYXJrZXJcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzIH0gZnJvbSAnLi4vLi4vLi4vb29wc3lfY29tbW9uJztcclxuXHJcbi8vIFRPRE86IDU2MUQgRXZpbCBTZWVkIGhpdHMgZXZlcnlvbmUsIGhhcmQgdG8ga25vdyBpZiB0aGVyZSdzIGEgZG91YmxlIHRhcFxyXG4vLyBUT0RPOiBmYWxsaW5nIHRocm91Z2ggcGFuZWwganVzdCBkb2VzIGRhbWFnZSB3aXRoIG5vIGFiaWxpdHkgbmFtZSwgbGlrZSBhIGRlYXRoIHdhbGxcclxuLy8gVE9ETzogd2hhdCBoYXBwZW5zIGlmIHlvdSBqdW1wIGluIHNlZWQgdGhvcm5zP1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zUHJvbWlzZVVtYnJhU2F2YWdlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFOVMgQmFkIFZpYnJhdGlvbnMnOiAnNTYxQycsIC8vIHRldGhlcmVkIG91dHNpZGUgZ2lhbnQgdHJlZSBncm91bmQgYW9lc1xyXG4gICAgJ0U5UyBXaWRlLUFuZ2xlIFBhcnRpY2xlIEJlYW0nOiAnNUIwMCcsIC8vIGFudGktYWlyIFwic2lkZXNcIlxyXG4gICAgJ0U5UyBXaWRlLUFuZ2xlIFBoYXNlciBVbmxpbWl0ZWQnOiAnNTYwRScsIC8vIHdpZGUtYW5nbGUgXCJzaWRlc1wiXHJcbiAgICAnRTlTIEFudGktQWlyIFBhcnRpY2xlIEJlYW0nOiAnNUIwMScsIC8vIHdpZGUtYW5nbGUgXCJvdXRcIlxyXG4gICAgJ0U5UyBUaGUgU2Vjb25kIEFydCBPZiBEYXJrbmVzcyAxJzogJzU2MDEnLCAvLyBsZWZ0LXJpZ2h0IGNsZWF2ZVxyXG4gICAgJ0U5UyBUaGUgU2Vjb25kIEFydCBPZiBEYXJrbmVzcyAyJzogJzU2MDInLCAvLyBsZWZ0LXJpZ2h0IGNsZWF2ZVxyXG4gICAgJ0U5UyBUaGUgQXJ0IE9mIERhcmtuZXNzIDEnOiAnNUE5NScsIC8vIGJvc3MgbGVmdC1yaWdodCBzdW1tb24vcGFuZWwgY2xlYXZlXHJcbiAgICAnRTlTIFRoZSBBcnQgT2YgRGFya25lc3MgMic6ICc1QTk2JywgLy8gYm9zcyBsZWZ0LXJpZ2h0IHN1bW1vbi9wYW5lbCBjbGVhdmVcclxuICAgICdFOVMgVGhlIEFydCBPZiBEYXJrbmVzcyBDbG9uZSAxJzogJzU2MUUnLCAvLyBjbG9uZSBsZWZ0LXJpZ2h0IHN1bW1vbiBjbGVhdmVcclxuICAgICdFOVMgVGhlIEFydCBPZiBEYXJrbmVzcyBDbG9uZSAyJzogJzU2MUYnLCAvLyBjbG9uZSBsZWZ0LXJpZ2h0IHN1bW1vbiBjbGVhdmVcclxuICAgICdFOVMgVGhlIFRoaXJkIEFydCBPZiBEYXJrbmVzcyAxJzogJzU2MDMnLCAvLyB0aGlyZCBhcnQgbGVmdC1yaWdodCBjbGVhdmUgaW5pdGlhbFxyXG4gICAgJ0U5UyBUaGUgVGhpcmQgQXJ0IE9mIERhcmtuZXNzIDInOiAnNTYwNCcsIC8vIHRoaXJkIGFydCBsZWZ0LXJpZ2h0IGNsZWF2ZSBpbml0aWFsXHJcbiAgICAnRTlTIEFydCBPZiBEYXJrbmVzcyc6ICc1NjA2JywgLy8gdGhpcmQgYXJ0IGxlZnQtcmlnaHQgY2xlYXZlIGZpbmFsXHJcbiAgICAnRTlTIEZ1bGwtUGVyaW1pdGVyIFBhcnRpY2xlIEJlYW0nOiAnNTYyOScsIC8vIHBhbmVsIFwiZ2V0IGluXCJcclxuICAgICdFOVMgRGFyayBDaGFpbnMnOiAnNUZBQycsIC8vIFNsb3cgdG8gYnJlYWsgcGFydG5lciBjaGFpbnNcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdFOVMgV2l0aGRyYXcnOiAnNTYxQScsIC8vIFNsb3cgdG8gYnJlYWsgc2VlZCBjaGFpbiwgZ2V0IHN1Y2tlZCBiYWNrIGluIHlpa2VzXHJcbiAgICAnRTlTIEFldGhlcm9zeW50aGVzaXMnOiAnNTYxQicsIC8vIFN0YW5kaW5nIG9uIHNlZWRzIGR1cmluZyBleHBsb3Npb24gKHBvc3NpYmx5IHZpYSBXaXRoZHJhdylcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0U5UyBIeXBlci1Gb2N1c2VkIFBhcnRpY2xlIEJlYW0nOiAnNTVGRCcsIC8vIEFydCBPZiBEYXJrbmVzcyBwcm90ZWFuXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgICdFOVMgQ29uZGVuc2VkIFdpZGUtQW5nbGUgUGFydGljbGUgQmVhbSc6ICc1NjEwJywgLy8gd2lkZS1hbmdsZSBcInRhbmsgbGFzZXJcIlxyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RXYXJuOiB7XHJcbiAgICAnRTlTIFN0eWdpYW4gVGVuZHJpbHMnOiAnOTUyJywgLy8gc3RhbmRpbmcgaW4gdGhlIGJyYW1ibGVzXHJcbiAgfSxcclxuICBzb2xvV2Fybjoge1xyXG4gICAgJ0U5UyBNdWx0aS1Qcm9uZ2VkIFBhcnRpY2xlIEJlYW0nOiAnNTYwMCcsIC8vIEFydCBPZiBEYXJrbmVzcyBQYXJ0bmVyIFN0YWNrXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBBbnRpLWFpciBcInRhbmsgc3ByZWFkXCIuICBUaGlzIGNhbiBiZSBzdGFja2VkIGJ5IHR3byB0YW5rcyBpbnZ1bG5pbmcuXHJcbiAgICAgIC8vIE5vdGU6IHRoaXMgd2lsbCBzdGlsbCBzaG93IHNvbWV0aGluZyBmb3IgaG9sbWdhbmcvbGl2aW5nLCBidXRcclxuICAgICAgLy8gYXJndWFibHkgYSBoZWFsZXIgbWlnaHQgbmVlZCB0byBkbyBzb21ldGhpbmcgYWJvdXQgdGhhdCwgc28gbWF5YmVcclxuICAgICAgLy8gaXQncyBvayB0byBzdGlsbCBzaG93IGFzIGEgd2FybmluZz8/XHJcbiAgICAgIGlkOiAnRTlTIENvbmRlbnNlZCBBbnRpLUFpciBQYXJ0aWNsZSBCZWFtJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyB0eXBlOiAnMjInLCBpZDogJzU2MTUnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKGRhdGEsIG1hdGNoZXMpID0+IGRhdGEuRGFtYWdlRnJvbU1hdGNoZXMobWF0Y2hlcykgPiAwLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBBbnRpLWFpciBcIm91dFwiLiAgVGhpcyBjYW4gYmUgaW52dWxuZWQgYnkgYSB0YW5rIGFsb25nIHdpdGggdGhlIHNwcmVhZCBhYm92ZS5cclxuICAgICAgaWQ6ICdFOVMgQW50aS1BaXIgUGhhc2VyIFVubGltaXRlZCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICc1NjEyJywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLkRhbWFnZUZyb21NYXRjaGVzKG1hdGNoZXMpID4gMCxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc1Byb21pc2VMaXRhbnksXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0UxME4gRm9yd2FyZCBJbXBsb3Npb24nOiAnNTZCNCcsIC8vIGhvd2wgYm9zcyBpbXBsb3Npb25cclxuICAgICdFMTBOIEZvcndhcmQgU2hhZG93IEltcGxvc2lvbic6ICc1NkI1JywgLy8gaG93bCBzaGFkb3cgaW1wbG9zaW9uXHJcbiAgICAnRTEwTiBCYWNrd2FyZCBJbXBsb3Npb24nOiAnNTZCNycsIC8vIHRhaWwgYm9zcyBpbXBsb3Npb25cclxuICAgICdFMTBOIEJhY2t3YXJkIFNoYWRvdyBJbXBsb3Npb24nOiAnNTZCOCcsIC8vIHRhaWwgc2hhZG93IGltcGxvc2lvblxyXG4gICAgJ0UxME4gQmFyYnMgT2YgQWdvbnkgMSc6ICc1NkQ5JywgLy8gU2hhZG93IFdhcnJpb3IgMyBkb2cgcm9vbSBjbGVhdmVcclxuICAgICdFMTBOIEJhcmJzIE9mIEFnb255IDInOiAnNUIyNicsIC8vIFNoYWRvdyBXYXJyaW9yIDMgZG9nIHJvb20gY2xlYXZlXHJcbiAgICAnRTEwTiBDbG9hayBPZiBTaGFkb3dzJzogJzVCMTEnLCAvLyBub24tc3F1aWdnbHkgbGluZSBleHBsb3Npb25zXHJcbiAgICAnRTEwTiBUaHJvbmUgT2YgU2hhZG93JzogJzU2QzcnLCAvLyBzdGFuZGluZyB1cCBnZXQgb3V0XHJcbiAgICAnRTEwTiBSaWdodCBHaWdhIFNsYXNoJzogJzU2QUUnLCAvLyBib3NzIHJpZ2h0IGdpZ2Egc2xhc2hcclxuICAgICdFMTBOIFJpZ2h0IFNoYWRvdyBTbGFzaCc6ICc1NkFGJywgLy8gZ2lnYSBzbGFzaCBmcm9tIHNoYWRvd1xyXG4gICAgJ0UxME4gTGVmdCBHaWdhIFNsYXNoJzogJzU2QjEnLCAvLyBib3NzIGxlZnQgZ2lnYSBzbGFzaFxyXG4gICAgJ0UxME4gTGVmdCBTaGFkb3cgU2xhc2gnOiAnNTZCRCcsIC8vIGdpZ2Egc2xhc2ggZnJvbSBzaGFkb3dcclxuICAgICdFMTBOIFNoYWRvd3kgRXJ1cHRpb24nOiAnNTZFMScsIC8vIGJhaXRlZCBncm91bmQgYW9lIG1hcmtlcnMgcGFpcmVkIHdpdGggYmFyYnNcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0UxME4gU2hhZG93XFwncyBFZGdlJzogJzU2REInLCAvLyBUYW5rYnVzdGVyIHNpbmdsZSB0YXJnZXQgZm9sbG93dXBcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuaW1wb3J0IHsgcGxheWVyRGFtYWdlRmllbGRzIH0gZnJvbSAnLi4vLi4vLi4vb29wc3lfY29tbW9uJztcclxuXHJcbi8vIFRPRE86IGhpdHRpbmcgc2hhZG93IG9mIHRoZSBoZXJvIHdpdGggYWJpbGl0aWVzIGNhbiBjYXVzZSB5b3UgdG8gdGFrZSBkYW1hZ2UsIGxpc3QgdGhvc2U/XHJcbi8vICAgICAgIGUuZy4gcGlja2luZyB1cCB5b3VyIGZpcnN0IHBpdGNoIGJvZyBwdWRkbGUgd2lsbCBjYXVzZSB5b3UgdG8gZGllIHRvIHRoZSBkYW1hZ2VcclxuLy8gICAgICAgeW91ciBzaGFkb3cgdGFrZXMgZnJvbSBEZWVwc2hhZG93IE5vdmEgb3IgRGlzdGFudCBTY3JlYW0uXHJcbi8vIFRPRE86IDU3M0IgQmxpZ2h0aW5nIEJsaXR6IGlzc3VlcyBkdXJpbmcgbGltaXQgY3V0IG51bWJlcnNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5FZGVuc1Byb21pc2VMaXRhbnlTYXZhZ2UsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0UxMFMgSW1wbG9zaW9uIFNpbmdsZSAxJzogJzU2RjInLCAvLyBzaW5nbGUgdGFpbCB1cCBzaGFkb3cgaW1wbG9zaW9uXHJcbiAgICAnRTEwUyBJbXBsb3Npb24gU2luZ2xlIDInOiAnNTZFRicsIC8vIHNpbmdsZSBob3dsIHNoYWRvdyBpbXBsb3Npb25cclxuICAgICdFMTBTIEltcGxvc2lvbiBRdWFkcnVwbGUgMSc6ICc1NkVGJywgLy8gcXVhZHJ1cGxlIHNldCBvZiBzaGFkb3cgaW1wbG9zaW9uc1xyXG4gICAgJ0UxMFMgSW1wbG9zaW9uIFF1YWRydXBsZSAyJzogJzU2RjInLCAvLyBxdWFkcnVwbGUgc2V0IG9mIHNoYWRvdyBpbXBsb3Npb25zXHJcbiAgICAnRTEwUyBHaWdhIFNsYXNoIFNpbmdsZSAxJzogJzU2RUMnLCAvLyBHaWdhIHNsYXNoIHNpbmdsZSBmcm9tIHNoYWRvd1xyXG4gICAgJ0UxMFMgR2lnYSBTbGFzaCBTaW5nbGUgMic6ICc1NkVEJywgLy8gR2lnYSBzbGFzaCBzaW5nbGUgZnJvbSBzaGFkb3dcclxuICAgICdFMTBTIEdpZ2EgU2xhc2ggQm94IDEnOiAnNTcwOScsIC8vIEdpZ2Egc2xhc2ggYm94IGZyb20gZm91ciBncm91bmQgc2hhZG93c1xyXG4gICAgJ0UxMFMgR2lnYSBTbGFzaCBCb3ggMic6ICc1NzBEJywgLy8gR2lnYSBzbGFzaCBib3ggZnJvbSBmb3VyIGdyb3VuZCBzaGFkb3dzXHJcbiAgICAnRTEwUyBHaWdhIFNsYXNoIFF1YWRydXBsZSAxJzogJzU2RUMnLCAvLyBxdWFkcnVwbGUgc2V0IG9mIGdpZ2Egc2xhc2ggY2xlYXZlc1xyXG4gICAgJ0UxMFMgR2lnYSBTbGFzaCBRdWFkcnVwbGUgMic6ICc1NkU5JywgLy8gcXVhZHJ1cGxlIHNldCBvZiBnaWdhIHNsYXNoIGNsZWF2ZXNcclxuICAgICdFMTBTIENsb2FrIE9mIFNoYWRvd3MgMSc6ICc1QjEzJywgLy8gaW5pdGlhbCBub24tc3F1aWdnbHkgbGluZSBleHBsb3Npb25zXHJcbiAgICAnRTEwUyBDbG9hayBPZiBTaGFkb3dzIDInOiAnNUIxNCcsIC8vIHNlY29uZCBzcXVpZ2dseSBsaW5lIGV4cGxvc2lvbnNcclxuICAgICdFMTBTIFRocm9uZSBPZiBTaGFkb3cnOiAnNTcxNycsIC8vIHN0YW5kaW5nIHVwIGdldCBvdXRcclxuICAgICdFMTBTIFNoYWRvd3kgRXJ1cHRpb24nOiAnNTczOCcsIC8vIGJhaXRlZCBncm91bmQgYW9lIGR1cmluZyBhbXBsaWZpZXJcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdFMTBTIFN3YXRoIE9mIFNpbGVuY2UgMSc6ICc1NzFBJywgLy8gU2hhZG93IGNsb25lIGNsZWF2ZSAodG9vIGNsb3NlKVxyXG4gICAgJ0UxMFMgU3dhdGggT2YgU2lsZW5jZSAyJzogJzVCQkYnLCAvLyBTaGFkb3cgY2xvbmUgY2xlYXZlICh0aW1lZClcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0UxMFMgU2hhZGVmaXJlJzogJzU3MzInLCAvLyBwdXJwbGUgdGFuayB1bWJyYWwgb3Jic1xyXG4gICAgJ0UxMFMgUGl0Y2ggQm9nJzogJzU3MjInLCAvLyBtYXJrZXIgc3ByZWFkIHRoYXQgZHJvcHMgYSBzaGFkb3cgcHVkZGxlXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgICdFMTBTIFNoYWRvd1xcJ3MgRWRnZSc6ICc1NzI1JywgLy8gVGFua2J1c3RlciBzaW5nbGUgdGFyZ2V0IGZvbGxvd3VwXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0UxMFMgRGFtYWdlIERvd24gT3JicycsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgc291cmNlOiAnRmxhbWVzaGFkb3cnLCBlZmZlY3RJZDogJzgyQycgfSksXHJcbiAgICAgIG5ldFJlZ2V4RGU6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBzb3VyY2U6ICdTY2hhdHRlbmZsYW1tZScsIGVmZmVjdElkOiAnODJDJyB9KSxcclxuICAgICAgbmV0UmVnZXhGcjogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IHNvdXJjZTogJ0ZsYW1tZSBvbWJyYWxlJywgZWZmZWN0SWQ6ICc4MkMnIH0pLFxyXG4gICAgICBuZXRSZWdleEphOiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgc291cmNlOiAn44K344Oj44OJ44Km44OV44Os44Kk44OgJywgZWZmZWN0SWQ6ICc4MkMnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZGFtYWdlJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBgJHttYXRjaGVzLmVmZmVjdH0gKHBhcnRpYWwgc3RhY2spYCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTBTIERhbWFnZSBEb3duIEJvc3MnLFxyXG4gICAgICAvLyBTaGFja2xlcyBiZWluZyBtZXNzZWQgdXAgYXBwZWFyIHRvIGp1c3QgZ2l2ZSB0aGUgRGFtYWdlIERvd24sIHdpdGggbm90aGluZyBlbHNlLlxyXG4gICAgICAvLyBNZXNzaW5nIHVwIHRvd2VycyBpcyB0aGUgVGhyaWNlLUNvbWUgUnVpbiBlZmZlY3QgKDlFMiksIGJ1dCBhbHNvIERhbWFnZSBEb3duLlxyXG4gICAgICAvLyBUT0RPOiBzb21lIG9mIHRoZXNlIHdpbGwgYmUgZHVwbGljYXRlZCB3aXRoIG90aGVycywgbGlrZSBgRTEwUyBUaHJvbmUgT2YgU2hhZG93YC5cclxuICAgICAgLy8gTWF5YmUgaXQnZCBiZSBuaWNlIHRvIGZpZ3VyZSBvdXQgaG93IHRvIHB1dCB0aGUgZGFtYWdlIG1hcmtlciBvbiB0aGF0P1xyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IHNvdXJjZTogJ1NoYWRvd2tlZXBlcicsIGVmZmVjdElkOiAnODJDJyB9KSxcclxuICAgICAgbmV0UmVnZXhEZTogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IHNvdXJjZTogJ1NjaGF0dGVua8O2bmlnJywgZWZmZWN0SWQ6ICc4MkMnIH0pLFxyXG4gICAgICBuZXRSZWdleEZyOiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgc291cmNlOiAnUm9pIERlIExcXCdPbWJyZScsIGVmZmVjdElkOiAnODJDJyB9KSxcclxuICAgICAgbmV0UmVnZXhKYTogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IHNvdXJjZTogJ+W9seOBrueOiycsIGVmZmVjdElkOiAnODJDJyB9KSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2RhbWFnZScsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogYCR7bWF0Y2hlcy5lZmZlY3R9YCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gU2hhZG93IFdhcnJpb3IgNCBkb2cgcm9vbSBjbGVhdmVcclxuICAgICAgLy8gVGhpcyBjYW4gYmUgbWl0aWdhdGVkIGJ5IHRoZSB3aG9sZSBncm91cCwgc28gYWRkIGEgZGFtYWdlIGNvbmRpdGlvbi5cclxuICAgICAgaWQ6ICdFMTBTIEJhcmJzIE9mIEFnb255JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogWyc1NzJBJywgJzVCMjcnXSwgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLkRhbWFnZUZyb21NYXRjaGVzKG1hdGNoZXMpID4gMCxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zUHJvbWlzZUFuYW1vcnBob3NpcyxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTExTiBCdXJudCBTdHJpa2UgTGlnaHRuaW5nJzogJzU2MkUnLCAvLyBMaW5lIGNsZWF2ZVxyXG4gICAgJ0UxMU4gQnVybnQgU3RyaWtlIEZpcmUnOiAnNTYyQycsIC8vIExpbmUgY2xlYXZlXHJcbiAgICAnRTExTiBCdXJudCBTdHJpa2UgSG9seSc6ICc1NjMwJywgLy8gTGluZSBjbGVhdmVcclxuICAgICdFMTFOIEJ1cm5vdXQnOiAnNTYyRicsIC8vIEJ1cm50IFN0cmlrZSBsaWdodG5pbmcgZXhwYW5zaW9uXHJcbiAgICAnRTExTiBTaGluaW5nIEJsYWRlJzogJzU2MzEnLCAvLyBCYWl0ZWQgZXhwbG9zaW9uXHJcbiAgICAnRTExTiBIYWxvIE9mIEZsYW1lIEJyaWdodGZpcmUnOiAnNTYzQicsIC8vIFJlZCBjaXJjbGUgaW50ZXJtaXNzaW9uIGV4cGxvc2lvblxyXG4gICAgJ0UxMU4gSGFsbyBPZiBMZXZpbiBCcmlnaHRmaXJlJzogJzU2M0MnLCAvLyBCbHVlIGNpcmNsZSBpbnRlcm1pc3Npb24gZXhwbG9zaW9uXHJcbiAgICAnRTExTiBSZXNvdW5kaW5nIENyYWNrJzogJzU2NEQnLCAvLyBEZW1pLUd1a3VtYXR6IDI3MCBkZWdyZWUgZnJvbnRhbCBjbGVhdmVcclxuICAgICdFMTFOIEltYWdlIEJ1cm50IFN0cmlrZSBMaWdodG5pbmcnOiAnNTY0NScsIC8vIEZhdGUgQnJlYWtlcidzIEltYWdlIGxpbmUgY2xlYXZlXHJcbiAgICAnRTExTiBJbWFnZSBCdXJudCBTdHJpa2UgRmlyZSc6ICc1NjQzJywgLy8gRmF0ZSBCcmVha2VyJ3MgSW1hZ2UgbGluZSBjbGVhdmVcclxuICAgICdFMTFOIEltYWdlIEJ1cm5vdXQnOiAnNTY0NicsIC8vIEZhdGUgQnJlYWtlcidzIEltYWdlIGxpZ2h0bmluZyBleHBhbnNpb25cclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdFMTFOIEJsYXN0aW5nIFpvbmUnOiAnNTYzRScsIC8vIFByaXNtYXRpYyBEZWNlcHRpb24gY2hhcmdlc1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRTExTiBCdXJuIE1hcmsnOiAnNTY0RicsIC8vIFBvd2RlciBNYXJrIGRlYnVmZiBleHBsb3Npb25cclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTExTiBCbGFzdGJ1cm4gS25vY2tlZCBPZmYnLFxyXG4gICAgICAvLyA1NjJEID0gQnVybnQgU3RyaWtlIGZpcmUgZm9sbG93dXAgZHVyaW5nIG1vc3Qgb2YgdGhlIGZpZ2h0XHJcbiAgICAgIC8vIDU2NDQgPSBzYW1lIHRoaW5nLCBidXQgZnJvbSBGYXRlYnJlYWtlcidzIEltYWdlXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogWyc1NjJEJywgJzU2NDQnXSB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ0tub2NrZWQgb2ZmJyxcclxuICAgICAgICAgICAgZGU6ICdSdW50ZXJnZWZhbGxlbicsXHJcbiAgICAgICAgICAgIGZyOiAnQSDDqXTDqSBhc3NvbW3DqShlKScsXHJcbiAgICAgICAgICAgIGphOiAn44OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwsScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyA1NjVBLzU2OEQgU2luc21va2UgQm91bmQgT2YgRmFpdGggc2hhcmVcclxuLy8gNTY1RS81Njk5IEJvd3Nob2NrIGhpdHMgdGFyZ2V0IG9mIDU2NUQgKHR3aWNlKSBhbmQgdHdvIG90aGVyc1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zUHJvbWlzZUFuYW1vcnBob3Npc1NhdmFnZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRTExUyBCdXJudCBTdHJpa2UgRmlyZSc6ICc1NjUyJywgLy8gTGluZSBjbGVhdmVcclxuICAgICdFMTFTIEJ1cm50IFN0cmlrZSBMaWdodG5pbmcnOiAnNTY1NCcsIC8vIExpbmUgY2xlYXZlXHJcbiAgICAnRTExUyBCdXJudCBTdHJpa2UgSG9seSc6ICc1NjU2JywgLy8gTGluZSBjbGVhdmVcclxuICAgICdFMTFTIFNoaW5pbmcgQmxhZGUnOiAnNTY1NycsIC8vIEJhaXRlZCBleHBsb3Npb25cclxuICAgICdFMTFTIEJ1cm50IFN0cmlrZSBDeWNsZSBGaXJlJzogJzU2OEUnLCAvLyBMaW5lIGNsZWF2ZSBkdXJpbmcgQ3ljbGVcclxuICAgICdFMTFTIEJ1cm50IFN0cmlrZSBDeWNsZSBMaWdodG5pbmcnOiAnNTY5NScsIC8vIExpbmUgY2xlYXZlIGR1cmluZyBDeWNsZVxyXG4gICAgJ0UxMVMgQnVybnQgU3RyaWtlIEN5Y2xlIEhvbHknOiAnNTY5RCcsIC8vIExpbmUgY2xlYXZlIGR1cmluZyBDeWNsZVxyXG4gICAgJ0UxMVMgU2hpbmluZyBCbGFkZSBDeWNsZSc6ICc1NjlFJywgLy8gQmFpdGVkIGV4cGxvc2lvbiBkdXJpbmcgQ3ljbGVcclxuICAgICdFMTFTIEhhbG8gT2YgRmxhbWUgQnJpZ2h0ZmlyZSc6ICc1NjZEJywgLy8gUmVkIGNpcmNsZSBpbnRlcm1pc3Npb24gZXhwbG9zaW9uXHJcbiAgICAnRTExUyBIYWxvIE9mIExldmluIEJyaWdodGZpcmUnOiAnNTY2QycsIC8vIEJsdWUgY2lyY2xlIGludGVybWlzc2lvbiBleHBsb3Npb25cclxuICAgICdFMTFTIFBvcnRhbCBPZiBGbGFtZSBCcmlnaHQgUHVsc2UnOiAnNTY3MScsIC8vIFJlZCBjYXJkIGludGVybWlzc2lvbiBleHBsb3Npb25cclxuICAgICdFMTFTIFBvcnRhbCBPZiBMZXZpbiBCcmlnaHQgUHVsc2UnOiAnNTY3MCcsIC8vIEJsdWUgY2FyZCBpbnRlcm1pc3Npb24gZXhwbG9zaW9uXHJcbiAgICAnRTExUyBSZXNvbmFudCBXaW5kcyc6ICc1Njg5JywgLy8gRGVtaS1HdWt1bWF0eiBcImdldCBpblwiXHJcbiAgICAnRTExUyBSZXNvdW5kaW5nIENyYWNrJzogJzU2ODgnLCAvLyBEZW1pLUd1a3VtYXR6IDI3MCBkZWdyZWUgZnJvbnRhbCBjbGVhdmVcclxuICAgICdFMTFTIEltYWdlIEJ1cm50IFN0cmlrZSBMaWdodG5pbmcnOiAnNTY3QicsIC8vIEZhdGUgQnJlYWtlcidzIEltYWdlIGxpbmUgY2xlYXZlXHJcbiAgICAnRTExTiBJbWFnZSBCdXJub3V0JzogJzU2N0MnLCAvLyBGYXRlIEJyZWFrZXIncyBJbWFnZSBsaWdodG5pbmcgZXhwYW5zaW9uXHJcbiAgICAnRTExTiBJbWFnZSBCdXJudCBTdHJpa2UgRmlyZSc6ICc1Njc5JywgLy8gRmF0ZSBCcmVha2VyJ3MgSW1hZ2UgbGluZSBjbGVhdmVcclxuICAgICdFMTFOIEltYWdlIEJ1cm50IFN0cmlrZSBIb2x5JzogJzU2N0InLCAvLyBGYXRlIEJyZWFrZXIncyBJbWFnZSBsaW5lIGNsZWF2ZVxyXG4gICAgJ0UxMU4gSW1hZ2UgU2hpbmluZyBCbGFkZSc6ICc1NjdFJywgLy8gRmF0ZSBCcmVha2VyJ3MgSW1hZ2UgYmFpdGVkIGV4cGxvc2lvblxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ0UxMVMgQnVybm91dCc6ICc1NjU1JywgLy8gQnVybnQgU3RyaWtlIGxpZ2h0bmluZyBleHBhbnNpb25cclxuICAgICdFMTFTIEJ1cm5vdXQgQ3ljbGUnOiAnNTY5NicsIC8vIEJ1cm50IFN0cmlrZSBsaWdodG5pbmcgZXhwYW5zaW9uXHJcbiAgICAnRTExUyBCbGFzdGluZyBab25lJzogJzU2NzQnLCAvLyBQcmlzbWF0aWMgRGVjZXB0aW9uIGNoYXJnZXNcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0UxMVMgRWxlbWVudGFsIEJyZWFrJzogJzU2NjQnLCAvLyBFbGVtZW50YWwgQnJlYWsgcHJvdGVhblxyXG4gICAgJ0UxMVMgRWxlbWVudGFsIEJyZWFrIEN5Y2xlJzogJzU2OEMnLCAvLyBFbGVtZW50YWwgQnJlYWsgcHJvdGVhbiBkdXJpbmcgQ3ljbGVcclxuICAgICdFMTFTIFNpbnNtaXRlJzogJzU2NjcnLCAvLyBMaWdodG5pbmcgRWxlbWVudGFsIEJyZWFrIHNwcmVhZFxyXG4gICAgJ0UxMVMgU2luc21pdGUgQ3ljbGUnOiAnNTY5NCcsIC8vIExpZ2h0bmluZyBFbGVtZW50YWwgQnJlYWsgc3ByZWFkIGR1cmluZyBDeWNsZVxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnRTExUyBCdXJuIE1hcmsnOiAnNTZBMycsIC8vIFBvd2RlciBNYXJrIGRlYnVmZiBleHBsb3Npb25cclxuICAgICdFMTFTIFNpbnNpZ2h0IDEnOiAnNTY2MScsIC8vIEhvbHkgQm91bmQgT2YgRmFpdGggdGV0aGVyXHJcbiAgICAnRTExUyBTaW5zaWdodCAyJzogJzVCQzcnLCAvLyBIb2x5IEJvdW5kIE9mIEZhaXRoIHRldGhlciBmcm9tIEZhdGVicmVha2VyJ3MgSW1hZ2VcclxuICAgICdFMTFTIFNpbnNpZ2h0IDMnOiAnNTZBMCcsIC8vIEhvbHkgQm91bmQgT2YgRmFpdGggdGV0aGVyIGR1cmluZyBDeWNsZVxyXG4gIH0sXHJcbiAgc29sb0ZhaWw6IHtcclxuICAgICdFMTFTIEhvbHkgU2luc2lnaHQgR3JvdXAgU2hhcmUnOiAnNTY2OScsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0UxMVMgQmxhc3RidXJuIEtub2NrZWQgT2ZmJyxcclxuICAgICAgLy8gNTY1MyA9IEJ1cm50IFN0cmlrZSBmaXJlIGZvbGxvd3VwIGR1cmluZyBtb3N0IG9mIHRoZSBmaWdodFxyXG4gICAgICAvLyA1NjdBID0gc2FtZSB0aGluZywgYnV0IGZyb20gRmF0ZWJyZWFrZXIncyBJbWFnZVxyXG4gICAgICAvLyA1NjhGID0gc2FtZSB0aGluZywgYnV0IGR1cmluZyBDeWNsZSBvZiBGYWl0aFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6IFsnNTY1MycsICc1NjdBJywgJzU2OEYnXSB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ0tub2NrZWQgb2ZmJyxcclxuICAgICAgICAgICAgZGU6ICdSdW50ZXJnZWZhbGxlbicsXHJcbiAgICAgICAgICAgIGZyOiAnQSDDqXTDqSBhc3NvbW3DqShlKScsXHJcbiAgICAgICAgICAgIGphOiAn44OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwsScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zUHJvbWlzZUV0ZXJuaXR5LFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFMTJOIEp1ZGdtZW50IEpvbHQgU2luZ2xlJzogJzU4NUYnLCAvLyBSYW11aCBnZXQgb3V0IGNhc3RcclxuICAgICdFMTJOIEp1ZGdtZW50IEpvbHQnOiAnNEUzMCcsIC8vIFJhbXVoIGdldCBvdXQgY2FzdFxyXG4gICAgJ0UxMk4gVGVtcG9yYXJ5IEN1cnJlbnQgU2luZ2xlJzogJzU4NUMnLCAvLyBMZXZpIGdldCB1bmRlciBjYXN0XHJcbiAgICAnRTEyTiBUZW1wb3JhcnkgQ3VycmVudCc6ICc0RTJEJywgLy8gTGV2aSBnZXQgdW5kZXIgY2FzdFxyXG4gICAgJ0UxMk4gQ29uZmxhZyBTdHJpa2UgU2luZ2xlJzogJzU4NUQnLCAvLyBJZnJpdCBnZXQgc2lkZXMgY2FzdFxyXG4gICAgJ0UxMk4gQ29uZmxhZyBTdHJpa2UnOiAnNEUyRScsIC8vIElmcml0IGdldCBzaWRlcyBjYXN0XHJcbiAgICAnRTEyTiBGZXJvc3Rvcm0gU2luZ2xlJzogJzU4NUUnLCAvLyBHYXJ1ZGEgZ2V0IGludGVyY2FyZGluYWxzIGNhc3RcclxuICAgICdFMTJOIEZlcm9zdG9ybSc6ICc0RTJGJywgLy8gR2FydWRhIGdldCBpbnRlcmNhcmRpbmFscyBjYXN0XHJcbiAgICAnRTEyTiBSYXB0dXJvdXMgUmVhY2ggMSc6ICc1ODc4JywgLy8gSGFpcmN1dFxyXG4gICAgJ0UxMk4gUmFwdHVyb3VzIFJlYWNoIDInOiAnNTg3NycsIC8vIEhhaXJjdXRcclxuICAgICdFMTJOIEJvbWIgRXhwbG9zaW9uJzogJzU4NkQnLCAvLyBTbWFsbCBib21iIGV4cGxvc2lvblxyXG4gICAgJ0UxMk4gVGl0YW5pYyBCb21iIEV4cGxvc2lvbic6ICc1ODZGJywgLy8gTGFyZ2UgYm9tYiBleHBsb3Npb25cclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0UxMk4gRWFydGhzaGFrZXInOiAnNTg4NScsIC8vIEVhcnRoc2hha2VyIG9uIGZpcnN0IHBsYXRmb3JtXHJcbiAgICAnRTEyTiBQcm9taXNlIEZyaWdpZCBTdG9uZSAxJzogJzU4NjcnLCAvLyBTaGl2YSBzcHJlYWQgd2l0aCBzbGlkaW5nXHJcbiAgICAnRTEyTiBQcm9taXNlIEZyaWdpZCBTdG9uZSAyJzogJzU4NjknLCAvLyBTaGl2YSBzcHJlYWQgd2l0aCBSYXB0dXJvdXMgUmVhY2hcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBPdXRwdXRzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9vdXRwdXRzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5pbXBvcnQgeyBwbGF5ZXJEYW1hZ2VGaWVsZHMgfSBmcm9tICcuLi8uLi8uLi9vb3BzeV9jb21tb24nO1xyXG5cclxuLy8gVE9ETzogYWRkIHNlcGFyYXRlIGRhbWFnZVdhcm4tZXNxdWUgaWNvbiBmb3IgZGFtYWdlIGRvd25zP1xyXG4vLyBUT0RPOiA1OEE2IFVuZGVyIFRoZSBXZWlnaHQgLyA1OEIyIENsYXNzaWNhbCBTY3VscHR1cmUgbWlzc2luZyBzb21lYm9keSBpbiBwYXJ0eSB3YXJuaW5nP1xyXG4vLyBUT0RPOiA1OENBIERhcmsgV2F0ZXIgSUlJIC8gNThDNSBTaGVsbCBDcnVzaGVyIHNob3VsZCBoaXQgZXZlcnlvbmUgaW4gcGFydHlcclxuLy8gVE9ETzogRGFyayBBZXJvIElJSSA1OEQ0IHNob3VsZCBub3QgYmUgYSBzaGFyZSBleGNlcHQgb24gYWR2YW5jZWQgcmVsYXRpdml0eSBmb3IgZG91YmxlIGFlcm8uXHJcbi8vIChmb3IgZ2FpbnMgZWZmZWN0LCBzaW5nbGUgYWVybyA9IH4yMyBzZWNvbmRzLCBkb3VibGUgYWVybyA9IH4zMSBzZWNvbmRzIGR1cmF0aW9uKVxyXG5cclxuLy8gRHVlIHRvIGNoYW5nZXMgaW50cm9kdWNlZCBpbiBwYXRjaCA1LjIsIG92ZXJoZWFkIG1hcmtlcnMgbm93IGhhdmUgYSByYW5kb20gb2Zmc2V0XHJcbi8vIGFkZGVkIHRvIHRoZWlyIElELiBUaGlzIG9mZnNldCBjdXJyZW50bHkgYXBwZWFycyB0byBiZSBzZXQgcGVyIGluc3RhbmNlLCBzb1xyXG4vLyB3ZSBjYW4gZGV0ZXJtaW5lIHdoYXQgaXQgaXMgZnJvbSB0aGUgZmlyc3Qgb3ZlcmhlYWQgbWFya2VyIHdlIHNlZS5cclxuLy8gVGhlIGZpcnN0IDFCIG1hcmtlciBpbiB0aGUgZW5jb3VudGVyIGlzIHRoZSBmb3JtbGVzcyB0YW5rYnVzdGVyLCBJRCAwMDRGLlxyXG5jb25zdCBmaXJzdEhlYWRtYXJrZXIgPSBwYXJzZUludCgnMDBEQScsIDE2KTtcclxuY29uc3QgZ2V0SGVhZG1hcmtlcklkID0gKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAvLyBJZiB3ZSBuYWl2ZWx5IGp1c3QgY2hlY2sgIWRhdGEuZGVjT2Zmc2V0IGFuZCBsZWF2ZSBpdCwgaXQgYnJlYWtzIGlmIHRoZSBmaXJzdCBtYXJrZXIgaXMgMDBEQS5cclxuICAvLyAoVGhpcyBtYWtlcyB0aGUgb2Zmc2V0IDAsIGFuZCAhMCBpcyB0cnVlLilcclxuICBpZiAodHlwZW9mIGRhdGEuZGVjT2Zmc2V0ID09PSAndW5kZWZpbmVkJylcclxuICAgIGRhdGEuZGVjT2Zmc2V0ID0gcGFyc2VJbnQobWF0Y2hlcy5pZCwgMTYpIC0gZmlyc3RIZWFkbWFya2VyO1xyXG4gIC8vIFRoZSBsZWFkaW5nIHplcm9lcyBhcmUgc3RyaXBwZWQgd2hlbiBjb252ZXJ0aW5nIGJhY2sgdG8gc3RyaW5nLCBzbyB3ZSByZS1hZGQgdGhlbSBoZXJlLlxyXG4gIC8vIEZvcnR1bmF0ZWx5LCB3ZSBkb24ndCBoYXZlIHRvIHdvcnJ5IGFib3V0IHdoZXRoZXIgb3Igbm90IHRoaXMgaXMgcm9idXN0LFxyXG4gIC8vIHNpbmNlIHdlIGtub3cgYWxsIHRoZSBJRHMgdGhhdCB3aWxsIGJlIHByZXNlbnQgaW4gdGhlIGVuY291bnRlci5cclxuICByZXR1cm4gKHBhcnNlSW50KG1hdGNoZXMuaWQsIDE2KSAtIGRhdGEuZGVjT2Zmc2V0KS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKS5wYWRTdGFydCg0LCAnMCcpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkVkZW5zUHJvbWlzZUV0ZXJuaXR5U2F2YWdlLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdFMTJTIFByb21pc2UgUmFwdHVyb3VzIFJlYWNoIExlZnQnOiAnNThBRCcsIC8vIEhhaXJjdXQgd2l0aCBsZWZ0IHNhZmUgc2lkZVxyXG4gICAgJ0UxMlMgUHJvbWlzZSBSYXB0dXJvdXMgUmVhY2ggUmlnaHQnOiAnNThBRScsIC8vIEhhaXJjdXQgd2l0aCByaWdodCBzYWZlIHNpZGVcclxuICAgICdFMTJTIFByb21pc2UgVGVtcG9yYXJ5IEN1cnJlbnQnOiAnNEU0NCcsIC8vIExldmkgZ2V0IHVuZGVyIGNhc3QgKGRhbWFnZSBkb3duKVxyXG4gICAgJ0UxMlMgUHJvbWlzZSBDb25mbGFnIFN0cmlrZSc6ICc0RTQ1JywgLy8gSWZyaXQgZ2V0IHNpZGVzIGNhc3QgKGRhbWFnZSBkb3duKVxyXG4gICAgJ0UxMlMgUHJvbWlzZSBGZXJvc3Rvcm0nOiAnNEU0NicsIC8vIEdhcnVkYSBnZXQgaW50ZXJjYXJkaW5hbHMgY2FzdCAoZGFtYWdlIGRvd24pXHJcbiAgICAnRTEyUyBQcm9taXNlIEp1ZGdtZW50IEpvbHQnOiAnNEU0NycsIC8vIFJhbXVoIGdldCBvdXQgY2FzdCAoZGFtYWdlIGRvd24pXHJcbiAgICAnRTEyUyBQcm9taXNlIFNoYXR0ZXInOiAnNTg5QycsIC8vIEljZSBQaWxsYXIgZXhwbG9zaW9uIGlmIHRldGhlciBub3QgZ290dGVuXHJcbiAgICAnRTEyUyBQcm9taXNlIEltcGFjdCc6ICc1OEExJywgLy8gVGl0YW4gYm9tYiBkcm9wXHJcbiAgICAnRTEyUyBPcmFjbGUgRGFyayBCbGl6emFyZCBJSUknOiAnNThEMycsIC8vIFJlbGF0aXZpdHkgZG9udXQgbWVjaGFuaWNcclxuICAgICdFMTJTIE9yYWNsZSBBcG9jYWx5cHNlJzogJzU4RTYnLCAvLyBMaWdodCB1cCBjaXJjbGUgZXhwbG9zaW9ucyAoZGFtYWdlIGRvd24pXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRTEyUyBPcmFjbGUgTWFlbHN0cm9tJzogJzU4REEnLCAvLyBBZHZhbmNlZCBSZWxhdGl2aXR5IHRyYWZmaWMgbGlnaHQgYW9lXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdFMTJTIFByb21pc2UgRnJpZ2lkIFN0b25lJzogJzU4OUUnLCAvLyBTaGl2YSBzcHJlYWRcclxuICAgICdFMTJTIE9yYWNsZSBEYXJrZXN0IERhbmNlJzogJzRFMzMnLCAvLyBGYXJ0aGVzdCB0YXJnZXQgYmFpdCArIGp1bXAgYmVmb3JlIGtub2NrYmFja1xyXG4gICAgJ0UxMlMgT3JhY2xlIERhcmsgQ3VycmVudCc6ICc1OEQ4JywgLy8gQmFpdGVkIHRyYWZmaWMgbGlnaHQgbGFzZXJzXHJcbiAgICAnRTEyUyBPcmFjbGUgU3Bpcml0IFRha2VyJzogJzU4QzYnLCAvLyBSYW5kb20ganVtcCBzcHJlYWQgbWVjaGFuaWMgYWZ0ZXIgU2hlbGwgQ3J1c2hlclxyXG4gICAgJ0UxMlMgT3JhY2xlIFNvbWJlciBEYW5jZSAxJzogJzU4QkYnLCAvLyBGYXJ0aGVzdCB0YXJnZXQgYmFpdCBmb3IgRHVhbCBBcG9jYWx5cHNlXHJcbiAgICAnRTEyUyBPcmFjbGUgU29tYmVyIERhbmNlIDInOiAnNThDMCcsIC8vIFNlY29uZCBzb21iZXIgZGFuY2UganVtcFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnRTEyUyBQcm9taXNlIFdlaWdodCBPZiBUaGUgV29ybGQnOiAnNThBNScsIC8vIFRpdGFuIGJvbWIgYmx1ZSBtYXJrZXJcclxuICAgICdFMTJTIFByb21pc2UgUHVsc2UgT2YgVGhlIExhbmQnOiAnNThBMycsIC8vIFRpdGFuIGJvbWIgeWVsbG93IG1hcmtlclxyXG4gICAgJ0UxMlMgT3JhY2xlIERhcmsgRXJ1cHRpb24gMSc6ICc1OENFJywgLy8gSW5pdGlhbCB3YXJtdXAgc3ByZWFkIG1lY2hhbmljXHJcbiAgICAnRTEyUyBPcmFjbGUgRGFyayBFcnVwdGlvbiAyJzogJzU4Q0QnLCAvLyBSZWxhdGl2aXR5IHNwcmVhZCBtZWNoYW5pY1xyXG4gICAgJ0UxMlMgT3JhY2xlIEJsYWNrIEhhbG8nOiAnNThDNycsIC8vIFRhbmtidXN0ZXIgY2xlYXZlXHJcbiAgfSxcclxuICBnYWluc0VmZmVjdEZhaWw6IHtcclxuICAgICdFMTJTIE9yYWNsZSBEb29tJzogJzlENCcsIC8vIFJlbGF0aXZpdHkgcHVuaXNobWVudCBmb3IgbXVsdGlwbGUgbWlzdGFrZXNcclxuICB9LFxyXG4gIHNvbG9XYXJuOiB7XHJcbiAgICAnRTEyUyBQcm9taXNlIEZvcmNlIE9mIFRoZSBMYW5kJzogJzU4QTQnLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgLy8gQmlnIGNpcmNsZSBncm91bmQgYW9lcyBkdXJpbmcgU2hpdmEganVuY3Rpb24uXHJcbiAgICAgIC8vIFRoaXMgY2FuIGJlIHNoaWVsZGVkIHRocm91Z2ggYXMgbG9uZyBhcyB0aGF0IHBlcnNvbiBkb2Vzbid0IHN0YWNrLlxyXG4gICAgICBpZDogJ0UxMlMgSWNpY2xlIEltcGFjdCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICc0RTVBJywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLkRhbWFnZUZyb21NYXRjaGVzKG1hdGNoZXMpID4gMCxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIEhlYWRtYXJrZXInLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5oZWFkTWFya2VyKHt9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlkID0gZ2V0SGVhZG1hcmtlcklkKGRhdGEsIG1hdGNoZXMpO1xyXG4gICAgICAgIGNvbnN0IGZpcnN0TGFzZXJNYXJrZXIgPSAnMDA5MSc7XHJcbiAgICAgICAgY29uc3QgbGFzdExhc2VyTWFya2VyID0gJzAwOTgnO1xyXG4gICAgICAgIGlmIChpZCA+PSBmaXJzdExhc2VyTWFya2VyICYmIGlkIDw9IGxhc3RMYXNlck1hcmtlcikge1xyXG4gICAgICAgICAgLy8gaWRzIGFyZSBzZXF1ZW50aWFsOiAjMSBzcXVhcmUsICMyIHNxdWFyZSwgIzMgc3F1YXJlLCAjNCBzcXVhcmUsICMxIHRyaWFuZ2xlIGV0Y1xyXG4gICAgICAgICAgY29uc3QgZGVjT2Zmc2V0ID0gcGFyc2VJbnQoaWQsIDE2KSAtIHBhcnNlSW50KGZpcnN0TGFzZXJNYXJrZXIsIDE2KTtcclxuXHJcbiAgICAgICAgICAvLyBkZWNPZmZzZXQgaXMgMC03LCBzbyBtYXAgMC0zIHRvIDEtNCBhbmQgNC03IHRvIDEtNC5cclxuICAgICAgICAgIGRhdGEubGFzZXJOYW1lVG9OdW0gPSBkYXRhLmxhc2VyTmFtZVRvTnVtIHx8IHt9O1xyXG4gICAgICAgICAgZGF0YS5sYXNlck5hbWVUb051bVttYXRjaGVzLnRhcmdldF0gPSBkZWNPZmZzZXQgJSA0ICsgMTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBUaGVzZSBzY3VscHR1cmVzIGFyZSBhZGRlZCBhdCB0aGUgc3RhcnQgb2YgdGhlIGZpZ2h0LCBzbyB3ZSBuZWVkIHRvIGNoZWNrIHdoZXJlIHRoZXlcclxuICAgICAgLy8gdXNlIHRoZSBcIkNsYXNzaWNhbCBTY3VscHR1cmVcIiBhYmlsaXR5IGFuZCBlbmQgdXAgb24gdGhlIGFyZW5hIGZvciByZWFsLlxyXG4gICAgICBpZDogJ0UxMlMgUHJvbWlzZSBDaGlzZWxlZCBTY3VscHR1cmUgQ2xhc3NpY2FsIFNjdWxwdHVyZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgc291cmNlOiAnQ2hpc2VsZWQgU2N1bHB0dXJlJywgaWQ6ICc1OEIyJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIC8vIFRoaXMgd2lsbCBydW4gcGVyIHBlcnNvbiB0aGF0IGdldHMgaGl0IGJ5IHRoZSBzYW1lIHNjdWxwdHVyZSwgYnV0IHRoYXQncyBmaW5lLlxyXG4gICAgICAgIC8vIFJlY29yZCB0aGUgeSBwb3NpdGlvbiBvZiBlYWNoIHNjdWxwdHVyZSBzbyB3ZSBjYW4gdXNlIGl0IGZvciBiZXR0ZXIgdGV4dCBsYXRlci5cclxuICAgICAgICBkYXRhLnNjdWxwdHVyZVlQb3NpdGlvbnMgPSBkYXRhLnNjdWxwdHVyZVlQb3NpdGlvbnMgfHwge307XHJcbiAgICAgICAgZGF0YS5zY3VscHR1cmVZUG9zaXRpb25zW21hdGNoZXMuc291cmNlSWQudG9VcHBlckNhc2UoKV0gPSBwYXJzZUZsb2F0KG1hdGNoZXMueSk7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBUaGUgc291cmNlIG9mIHRoZSB0ZXRoZXIgaXMgdGhlIHBsYXllciwgdGhlIHRhcmdldCBpcyB0aGUgc2N1bHB0dXJlLlxyXG4gICAgICBpZDogJ0UxMlMgUHJvbWlzZSBDaGlzZWxlZCBTY3VscHR1cmUgVGV0aGVyJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMudGV0aGVyKHsgdGFyZ2V0OiAnQ2hpc2VsZWQgU2N1bHB0dXJlJywgaWQ6ICcwMDExJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuc2N1bHB0dXJlVGV0aGVyTmFtZVRvSWQgPSBkYXRhLnNjdWxwdHVyZVRldGhlck5hbWVUb0lkIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuc2N1bHB0dXJlVGV0aGVyTmFtZVRvSWRbbWF0Y2hlcy5zb3VyY2VdID0gbWF0Y2hlcy50YXJnZXRJZC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIFByb21pc2UgQmxhZGUgT2YgRmxhbWUgQ291bnRlcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBzb3VyY2U6ICdDaGlzZWxlZCBTY3VscHR1cmUnLCBpZDogJzU4QjMnIH0pLFxyXG4gICAgICBkZWxheVNlY29uZHM6IDEsXHJcbiAgICAgIHN1cHByZXNzU2Vjb25kczogMSxcclxuICAgICAgcnVuOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGRhdGEuYmxhZGVPZkZsYW1lQ291bnQgPSBkYXRhLmJsYWRlT2ZGbGFtZUNvdW50IHx8IDA7XHJcbiAgICAgICAgZGF0YS5ibGFkZU9mRmxhbWVDb3VudCsrO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgLy8gVGhpcyBpcyB0aGUgQ2hpc2VsZWQgU2N1bHB0dXJlIGxhc2VyIHdpdGggdGhlIGxpbWl0IGN1dCBkb3RzLlxyXG4gICAgICBpZDogJ0UxMlMgUHJvbWlzZSBCbGFkZSBPZiBGbGFtZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyB0eXBlOiAnMjInLCBzb3VyY2U6ICdDaGlzZWxlZCBTY3VscHR1cmUnLCBpZDogJzU4QjMnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGlmICghZGF0YS5sYXNlck5hbWVUb051bSB8fCAhZGF0YS5zY3VscHR1cmVUZXRoZXJOYW1lVG9JZCB8fCAhZGF0YS5zY3VscHR1cmVZUG9zaXRpb25zKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBGaW5kIHRoZSBwZXJzb24gd2hvIGhhcyB0aGlzIGxhc2VyIG51bWJlciBhbmQgaXMgdGV0aGVyZWQgdG8gdGhpcyBzdGF0dWUuXHJcbiAgICAgICAgY29uc3QgbnVtYmVyID0gKGRhdGEuYmxhZGVPZkZsYW1lQ291bnQgfHwgMCkgKyAxO1xyXG4gICAgICAgIGNvbnN0IHNvdXJjZUlkID0gbWF0Y2hlcy5zb3VyY2VJZC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgIGNvbnN0IG5hbWVzID0gT2JqZWN0LmtleXMoZGF0YS5sYXNlck5hbWVUb051bSk7XHJcbiAgICAgICAgY29uc3Qgd2l0aE51bSA9IG5hbWVzLmZpbHRlcigobmFtZSkgPT4gZGF0YS5sYXNlck5hbWVUb051bVtuYW1lXSA9PT0gbnVtYmVyKTtcclxuICAgICAgICBjb25zdCBvd25lcnMgPSB3aXRoTnVtLmZpbHRlcigobmFtZSkgPT4gZGF0YS5zY3VscHR1cmVUZXRoZXJOYW1lVG9JZFtuYW1lXSA9PT0gc291cmNlSWQpO1xyXG5cclxuICAgICAgICAvLyBpZiBzb21lIGxvZ2ljIGVycm9yLCBqdXN0IGFib3J0LlxyXG4gICAgICAgIGlmIChvd25lcnMubGVuZ3RoICE9PSAxKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBUaGUgb3duZXIgaGl0dGluZyB0aGVtc2VsdmVzIGlzbid0IGEgbWlzdGFrZS4uLnRlY2huaWNhbGx5LlxyXG4gICAgICAgIGlmIChvd25lcnNbMF0gPT09IG1hdGNoZXMudGFyZ2V0KVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBOb3cgdHJ5IHRvIGZpZ3VyZSBvdXQgd2hpY2ggc3RhdHVlIGlzIHdoaWNoLlxyXG4gICAgICAgIC8vIFBlb3BsZSBjYW4gcHV0IHRoZXNlIHdoZXJldmVyLiAgVGhleSBjb3VsZCBnbyBzaWRld2F5cywgb3IgZGlhZ29uYWwsIG9yIHdoYXRldmVyLlxyXG4gICAgICAgIC8vIEl0IHNlZW1zIG1vb29vb3N0IHBlb3BsZSBwdXQgdGhlc2Ugbm9ydGggLyBzb3V0aCAob24gdGhlIHNvdXRoIGVkZ2Ugb2YgdGhlIGFyZW5hKS5cclxuICAgICAgICAvLyBMZXQncyBzYXkgYSBtaW5pbXVtIG9mIDIgeWFsbXMgYXBhcnQgaW4gdGhlIHkgZGlyZWN0aW9uIHRvIGNvbnNpZGVyIHRoZW0gXCJub3J0aC9zb3V0aFwiLlxyXG4gICAgICAgIGNvbnN0IG1pbmltdW1ZYWxtc0ZvclN0YXR1ZXMgPSAyO1xyXG5cclxuICAgICAgICBsZXQgaXNTdGF0dWVQb3NpdGlvbktub3duID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IGlzU3RhdHVlTm9ydGggPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBzY3VscHR1cmVJZHMgPSBPYmplY3Qua2V5cyhkYXRhLnNjdWxwdHVyZVlQb3NpdGlvbnMpO1xyXG4gICAgICAgIGlmIChzY3VscHR1cmVJZHMubGVuZ3RoID09PSAyICYmIHNjdWxwdHVyZUlkcy5pbmNsdWRlcyhzb3VyY2VJZCkpIHtcclxuICAgICAgICAgIGNvbnN0IG90aGVySWQgPSBzY3VscHR1cmVJZHNbMF0gPT09IHNvdXJjZUlkID8gc2N1bHB0dXJlSWRzWzFdIDogc2N1bHB0dXJlSWRzWzBdO1xyXG4gICAgICAgICAgY29uc3Qgc291cmNlWSA9IGRhdGEuc2N1bHB0dXJlWVBvc2l0aW9uc1tzb3VyY2VJZF07XHJcbiAgICAgICAgICBjb25zdCBvdGhlclkgPSBkYXRhLnNjdWxwdHVyZVlQb3NpdGlvbnNbb3RoZXJJZF07XHJcbiAgICAgICAgICBjb25zdCB5RGlmZiA9IE1hdGguYWJzKHNvdXJjZVkgLSBvdGhlclkpO1xyXG4gICAgICAgICAgaWYgKHlEaWZmID4gbWluaW11bVlhbG1zRm9yU3RhdHVlcykge1xyXG4gICAgICAgICAgICBpc1N0YXR1ZVBvc2l0aW9uS25vd24gPSB0cnVlO1xyXG4gICAgICAgICAgICBpc1N0YXR1ZU5vcnRoID0gc291cmNlWSA8IG90aGVyWTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG93bmVyID0gb3duZXJzWzBdO1xyXG4gICAgICAgIGNvbnN0IG93bmVyTmljayA9IGRhdGEuU2hvcnROYW1lKG93bmVyKTtcclxuICAgICAgICBsZXQgdGV4dCA9IHtcclxuICAgICAgICAgIGVuOiBgJHttYXRjaGVzLmFiaWxpdHl9IChmcm9tICR7b3duZXJOaWNrfSwgIyR7bnVtYmVyfSlgLFxyXG4gICAgICAgICAgZGU6IGAke21hdGNoZXMuYWJpbGl0eX0gKHZvbiAke293bmVyTmlja30sICMke251bWJlcn0pYCxcclxuICAgICAgICAgIGphOiBgJHttYXRjaGVzLmFiaWxpdHl9ICgke293bmVyTmlja33jgYvjgonjgIEjJHtudW1iZXJ9KWAsXHJcbiAgICAgICAgICBjbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5p2l6IeqJHtvd25lck5pY2t977yMIyR7bnVtYmVyfSlgLFxyXG4gICAgICAgICAga286IGAke21hdGNoZXMuYWJpbGl0eX0gKOuMgOyDgeyekCBcIiR7b3duZXJOaWNrfVwiLCAke251bWJlcn3rsogpYCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChpc1N0YXR1ZVBvc2l0aW9uS25vd24gJiYgaXNTdGF0dWVOb3J0aCkge1xyXG4gICAgICAgICAgdGV4dCA9IHtcclxuICAgICAgICAgICAgZW46IGAke21hdGNoZXMuYWJpbGl0eX0gKGZyb20gJHtvd25lck5pY2t9LCAjJHtudW1iZXJ9IG5vcnRoKWAsXHJcbiAgICAgICAgICAgIGRlOiBgJHttYXRjaGVzLmFiaWxpdHl9ICh2b24gJHtvd25lck5pY2t9LCAjJHtudW1iZXJ9IG5vcmRlbilgLFxyXG4gICAgICAgICAgICBqYTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5YyX44GuJHtvd25lck5pY2t944GL44KJ44CBIyR7bnVtYmVyfSlgLFxyXG4gICAgICAgICAgICBjbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5p2l6Ieq5YyX5pa5JHtvd25lck5pY2t977yMIyR7bnVtYmVyfSlgLFxyXG4gICAgICAgICAgICBrbzogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo64yA7IOB7J6QIFwiJHtvd25lck5pY2t9XCIsICR7bnVtYmVyfeuyiCDrtoHsqr0pYCxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc1N0YXR1ZVBvc2l0aW9uS25vd24gJiYgIWlzU3RhdHVlTm9ydGgpIHtcclxuICAgICAgICAgIHRleHQgPSB7XHJcbiAgICAgICAgICAgIGVuOiBgJHttYXRjaGVzLmFiaWxpdHl9IChmcm9tICR7b3duZXJOaWNrfSwgIyR7bnVtYmVyfSBzb3V0aClgLFxyXG4gICAgICAgICAgICBkZTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAodm9uICR7b3duZXJOaWNrfSwgIyR7bnVtYmVyfSBTw7xkZW4pYCxcclxuICAgICAgICAgICAgamE6IGAke21hdGNoZXMuYWJpbGl0eX0gKOWNl+OBriR7b3duZXJOaWNrfeOBi+OCieOAgSMke251bWJlcn0pYCxcclxuICAgICAgICAgICAgY246IGAke21hdGNoZXMuYWJpbGl0eX0gKOadpeiHquWNl+aWuSR7b3duZXJOaWNrfe+8jCMke251bWJlcn0pYCxcclxuICAgICAgICAgICAga286IGAke21hdGNoZXMuYWJpbGl0eX0gKOuMgOyDgeyekCBcIiR7b3duZXJOaWNrfVwiLCAke251bWJlcn3rsogg64Ko7Kq9KWAsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgYmxhbWU6IG93bmVyLFxyXG4gICAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIFByb21pc2UgSWNlIFBpbGxhciBUcmFja2VyJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMudGV0aGVyKHsgc291cmNlOiAnSWNlIFBpbGxhcicsIGlkOiBbJzAwMDEnLCAnMDAzOSddIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5waWxsYXJJZFRvT3duZXIgPSBkYXRhLnBpbGxhcklkVG9Pd25lciB8fCB7fTtcclxuICAgICAgICBkYXRhLnBpbGxhcklkVG9Pd25lclttYXRjaGVzLnNvdXJjZUlkXSA9IG1hdGNoZXMudGFyZ2V0O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIFByb21pc2UgSWNlIFBpbGxhciBNaXN0YWtlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IHNvdXJjZTogJ0ljZSBQaWxsYXInLCBpZDogJzU4OUInIH0pLFxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgaWYgKCFkYXRhLnBpbGxhcklkVG9Pd25lcilcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gbWF0Y2hlcy50YXJnZXQgIT09IGRhdGEucGlsbGFySWRUb093bmVyW21hdGNoZXMuc291cmNlSWRdO1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBpbGxhck93bmVyID0gZGF0YS5TaG9ydE5hbWUoZGF0YS5waWxsYXJJZFRvT3duZXJbbWF0Y2hlcy5zb3VyY2VJZF0pO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBibGFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICB0ZXh0OiB7XHJcbiAgICAgICAgICAgIGVuOiBgJHttYXRjaGVzLmFiaWxpdHl9IChmcm9tICR7cGlsbGFyT3duZXJ9KWAsXHJcbiAgICAgICAgICAgIGRlOiBgJHttYXRjaGVzLmFiaWxpdHl9ICh2b24gJHtwaWxsYXJPd25lcn0pYCxcclxuICAgICAgICAgICAgZnI6IGAke21hdGNoZXMuYWJpbGl0eX0gKGRlICR7cGlsbGFyT3duZXJ9KWAsXHJcbiAgICAgICAgICAgIGphOiBgJHttYXRjaGVzLmFiaWxpdHl9ICgke3BpbGxhck93bmVyfeOBi+OCiSlgLFxyXG4gICAgICAgICAgICBjbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5p2l6IeqJHtwaWxsYXJPd25lcn0pYCxcclxuICAgICAgICAgICAga286IGAke21hdGNoZXMuYWJpbGl0eX0gKOuMgOyDgeyekCBcIiR7cGlsbGFyT3duZXJ9XCIpYCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTEyUyBQcm9taXNlIEdhaW4gRmlyZSBSZXNpc3RhbmNlIERvd24gSUknLFxyXG4gICAgICAvLyBUaGUgQmVhc3RseSBTY3VscHR1cmUgZ2l2ZXMgYSAzIHNlY29uZCBkZWJ1ZmYsIHRoZSBSZWdhbCBTY3VscHR1cmUgZ2l2ZXMgYSAxNHMgb25lLlxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnODMyJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuZmlyZSA9IGRhdGEuZmlyZSB8fCB7fTtcclxuICAgICAgICBkYXRhLmZpcmVbbWF0Y2hlcy50YXJnZXRdID0gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTEyUyBQcm9taXNlIExvc2UgRmlyZSBSZXNpc3RhbmNlIERvd24gSUknLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5sb3Nlc0VmZmVjdCh7IGVmZmVjdElkOiAnODMyJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuZmlyZSA9IGRhdGEuZmlyZSB8fCB7fTtcclxuICAgICAgICBkYXRhLmZpcmVbbWF0Y2hlcy50YXJnZXRdID0gZmFsc2U7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0UxMlMgUHJvbWlzZSBTbWFsbCBMaW9uIFRldGhlcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLnRldGhlcih7IHNvdXJjZTogJ0JlYXN0bHkgU2N1bHB0dXJlJywgaWQ6ICcwMDExJyB9KSxcclxuICAgICAgbmV0UmVnZXhEZTogTmV0UmVnZXhlcy50ZXRoZXIoeyBzb3VyY2U6ICdBYmJpbGQgRWluZXMgTMO2d2VuJywgaWQ6ICcwMDExJyB9KSxcclxuICAgICAgbmV0UmVnZXhGcjogTmV0UmVnZXhlcy50ZXRoZXIoeyBzb3VyY2U6ICdDcsOpYXRpb24gTMOpb25pbmUnLCBpZDogJzAwMTEnIH0pLFxyXG4gICAgICBuZXRSZWdleEphOiBOZXRSZWdleGVzLnRldGhlcih7IHNvdXJjZTogJ+WJteOCieOCjOOBn+eNheWtkCcsIGlkOiAnMDAxMScgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLnNtYWxsTGlvbklkVG9Pd25lciA9IGRhdGEuc21hbGxMaW9uSWRUb093bmVyIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuc21hbGxMaW9uSWRUb093bmVyW21hdGNoZXMuc291cmNlSWQudG9VcHBlckNhc2UoKV0gPSBtYXRjaGVzLnRhcmdldDtcclxuICAgICAgICBkYXRhLnNtYWxsTGlvbk93bmVycyA9IGRhdGEuc21hbGxMaW9uT3duZXJzIHx8IFtdO1xyXG4gICAgICAgIGRhdGEuc21hbGxMaW9uT3duZXJzLnB1c2gobWF0Y2hlcy50YXJnZXQpO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIFByb21pc2UgU21hbGwgTGlvbiBMaW9uc2JsYXplJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBzb3VyY2U6ICdCZWFzdGx5IFNjdWxwdHVyZScsIGlkOiAnNThCOScgfSksXHJcbiAgICAgIG5ldFJlZ2V4RGU6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBzb3VyY2U6ICdBYmJpbGQgRWluZXMgTMO2d2VuJywgaWQ6ICc1OEI5JyB9KSxcclxuICAgICAgbmV0UmVnZXhGcjogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IHNvdXJjZTogJ0Nyw6lhdGlvbiBMw6lvbmluZScsIGlkOiAnNThCOScgfSksXHJcbiAgICAgIG5ldFJlZ2V4SmE6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBzb3VyY2U6ICflibXjgonjgozjgZ/njYXlrZAnLCBpZDogJzU4QjknIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIC8vIEZvbGtzIGJhaXRpbmcgdGhlIGJpZyBsaW9uIHNlY29uZCBjYW4gdGFrZSB0aGUgZmlyc3Qgc21hbGwgbGlvbiBoaXQsXHJcbiAgICAgICAgLy8gc28gaXQncyBub3Qgc3VmZmljaWVudCB0byBjaGVjayBvbmx5IHRoZSBvd25lci5cclxuICAgICAgICBpZiAoIWRhdGEuc21hbGxMaW9uT3duZXJzKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IG93bmVyID0gZGF0YS5zbWFsbExpb25JZFRvT3duZXJbbWF0Y2hlcy5zb3VyY2VJZC50b1VwcGVyQ2FzZSgpXTtcclxuICAgICAgICBpZiAoIW93bmVyKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmIChtYXRjaGVzLnRhcmdldCA9PT0gb3duZXIpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSB0YXJnZXQgYWxzbyBoYXMgYSBzbWFsbCBsaW9uIHRldGhlciwgdGhhdCBpcyBhbHdheXMgYSBtaXN0YWtlLlxyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgaXQncyBvbmx5IGEgbWlzdGFrZSBpZiB0aGUgdGFyZ2V0IGhhcyBhIGZpcmUgZGVidWZmLlxyXG4gICAgICAgIGNvbnN0IGhhc1NtYWxsTGlvbiA9IGRhdGEuc21hbGxMaW9uT3duZXJzLmluY2x1ZGVzKG1hdGNoZXMudGFyZ2V0KTtcclxuICAgICAgICBjb25zdCBoYXNGaXJlRGVidWZmID0gZGF0YS5maXJlICYmIGRhdGEuZmlyZVttYXRjaGVzLnRhcmdldF07XHJcblxyXG4gICAgICAgIGlmIChoYXNTbWFsbExpb24gfHwgaGFzRmlyZURlYnVmZikge1xyXG4gICAgICAgICAgY29uc3Qgb3duZXJOaWNrID0gZGF0YS5TaG9ydE5hbWUob3duZXIpO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGNlbnRlclkgPSAtNzU7XHJcbiAgICAgICAgICBjb25zdCB4ID0gcGFyc2VGbG9hdChtYXRjaGVzLngpO1xyXG4gICAgICAgICAgY29uc3QgeSA9IHBhcnNlRmxvYXQobWF0Y2hlcy55KTtcclxuICAgICAgICAgIGxldCBkaXJPYmogPSBudWxsO1xyXG4gICAgICAgICAgaWYgKHkgPCBjZW50ZXJZKSB7XHJcbiAgICAgICAgICAgIGlmICh4ID4gMClcclxuICAgICAgICAgICAgICBkaXJPYmogPSBPdXRwdXRzLmRpck5FO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgZGlyT2JqID0gT3V0cHV0cy5kaXJOVztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh4ID4gMClcclxuICAgICAgICAgICAgICBkaXJPYmogPSBPdXRwdXRzLmRpclNFO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgZGlyT2JqID0gT3V0cHV0cy5kaXJTVztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICAgIGJsYW1lOiBvd25lcixcclxuICAgICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgICBlbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoZnJvbSAke293bmVyTmlja30sICR7ZGlyT2JqWydlbiddfSlgLFxyXG4gICAgICAgICAgICAgIGRlOiBgJHttYXRjaGVzLmFiaWxpdHl9ICh2b24gJHtvd25lck5pY2t9LCAke2Rpck9ialsnZGUnXX0pYCxcclxuICAgICAgICAgICAgICBmcjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoZGUgJHtvd25lck5pY2t9LCAke2Rpck9ialsnZnInXX0pYCxcclxuICAgICAgICAgICAgICBqYTogYCR7bWF0Y2hlcy5hYmlsaXR5fSAoJHtvd25lck5pY2t944GL44KJLCAke2Rpck9ialsnamEnXX0pYCxcclxuICAgICAgICAgICAgICBjbjogYCR7bWF0Y2hlcy5hYmlsaXR5fSAo5p2l6IeqJHtvd25lck5pY2t9LCAke2Rpck9ialsnY24nXX1gLFxyXG4gICAgICAgICAgICAgIGtvOiBgJHttYXRjaGVzLmFiaWxpdHl9ICjrjIDsg4HsnpAgXCIke293bmVyTmlja31cIiwgJHtkaXJPYmpbJ2tvJ119KWAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTEyUyBQcm9taXNlIE5vcnRoIEJpZyBMaW9uJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWRkZWRDb21iYXRhbnRGdWxsKHsgbmFtZTogJ1JlZ2FsIFNjdWxwdHVyZScgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBjb25zdCB5ID0gcGFyc2VGbG9hdChtYXRjaGVzLnkpO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAtNzU7XHJcbiAgICAgICAgaWYgKHkgPCBjZW50ZXJZKVxyXG4gICAgICAgICAgZGF0YS5ub3J0aEJpZ0xpb24gPSBtYXRjaGVzLmlkLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ0UxMlMgUHJvbWlzZSBCaWcgTGlvbiBLaW5nc2JsYXplJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IHNvdXJjZTogJ1JlZ2FsIFNjdWxwdHVyZScsIGlkOiAnNEY5RScgfSksXHJcbiAgICAgIG5ldFJlZ2V4RGU6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IHNvdXJjZTogJ0FiYmlsZCBlaW5lcyBncm/Dn2VuIEzDtndlbicsIGlkOiAnNEY5RScgfSksXHJcbiAgICAgIG5ldFJlZ2V4RnI6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IHNvdXJjZTogJ2Nyw6lhdGlvbiBsw6lvbmluZSByb3lhbGUnLCBpZDogJzRGOUUnIH0pLFxyXG4gICAgICBuZXRSZWdleEphOiBOZXRSZWdleGVzLmFiaWxpdHkoeyBzb3VyY2U6ICflibXjgonjgozjgZ/njYXlrZDnjosnLCBpZDogJzRGOUUnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNpbmdsZVRhcmdldCA9IG1hdGNoZXMudHlwZSA9PT0gJzIxJztcclxuICAgICAgICBjb25zdCBoYXNGaXJlRGVidWZmID0gZGF0YS5maXJlICYmIGRhdGEuZmlyZVttYXRjaGVzLnRhcmdldF07XHJcblxyXG4gICAgICAgIC8vIFN1Y2Nlc3MgaWYgb25seSBvbmUgcGVyc29uIHRha2VzIGl0IGFuZCB0aGV5IGhhdmUgbm8gZmlyZSBkZWJ1ZmYuXHJcbiAgICAgICAgaWYgKHNpbmdsZVRhcmdldCAmJiAhaGFzRmlyZURlYnVmZilcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0ge1xyXG4gICAgICAgICAgbm9ydGhCaWdMaW9uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnbm9ydGggYmlnIGxpb24nLFxyXG4gICAgICAgICAgICBkZTogJ05vcmRlbSwgZ3Jvw59lciBMw7Z3ZScsXHJcbiAgICAgICAgICAgIGphOiAn5aSn44Op44Kk44Kq44OzKOWMlyknLFxyXG4gICAgICAgICAgICBjbjogJ+WMl+aWueWkp+eLruWtkCcsXHJcbiAgICAgICAgICAgIGtvOiAn67aB7Kq9IO2BsCDsgqzsnpAnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNvdXRoQmlnTGlvbjoge1xyXG4gICAgICAgICAgICBlbjogJ3NvdXRoIGJpZyBsaW9uJyxcclxuICAgICAgICAgICAgZGU6ICdTw7xkZW4sIGdyb8OfZXIgTMO2d2UnLFxyXG4gICAgICAgICAgICBqYTogJ+Wkp+ODqeOCpOOCquODsyjljZcpJyxcclxuICAgICAgICAgICAgY246ICfljZfmlrnlpKfni67lrZAnLFxyXG4gICAgICAgICAgICBrbzogJ+uCqOyqvSDtgbAg7IKs7J6QJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzaGFyZWQ6IHtcclxuICAgICAgICAgICAgZW46ICdzaGFyZWQnLFxyXG4gICAgICAgICAgICBkZTogJ2dldGVpbHQnLFxyXG4gICAgICAgICAgICBqYTogJ+mHjeOBreOBnycsXHJcbiAgICAgICAgICAgIGNuOiAn6YeN5Y+gJyxcclxuICAgICAgICAgICAga286ICfqsJnsnbQg66ee7J2MJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmaXJlRGVidWZmOiB7XHJcbiAgICAgICAgICAgIGVuOiAnaGFkIGZpcmUnLFxyXG4gICAgICAgICAgICBkZTogJ2hhdHRlIEZldWVyJyxcclxuICAgICAgICAgICAgamE6ICfngo7ku5jjgY0nLFxyXG4gICAgICAgICAgICBjbjogJ+eBq0RlYnVmZicsXHJcbiAgICAgICAgICAgIGtvOiAn7ZmU7Je8IOuUlOuyhO2UhCDrsJvsnYwnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBsYWJlbHMgPSBbXTtcclxuICAgICAgICBpZiAoZGF0YS5ub3J0aEJpZ0xpb24pIHtcclxuICAgICAgICAgIGlmIChkYXRhLm5vcnRoQmlnTGlvbiA9PT0gbWF0Y2hlcy5zb3VyY2VJZClcclxuICAgICAgICAgICAgbGFiZWxzLnB1c2gob3V0cHV0Lm5vcnRoQmlnTGlvbltkYXRhLnBhcnNlckxhbmddIHx8IG91dHB1dC5ub3J0aEJpZ0xpb25bJ2VuJ10pO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBsYWJlbHMucHVzaChvdXRwdXQuc291dGhCaWdMaW9uW2RhdGEucGFyc2VyTGFuZ10gfHwgb3V0cHV0LnNvdXRoQmlnTGlvblsnZW4nXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc2luZ2xlVGFyZ2V0KVxyXG4gICAgICAgICAgbGFiZWxzLnB1c2gob3V0cHV0LnNoYXJlZFtkYXRhLnBhcnNlckxhbmddIHx8IG91dHB1dC5zaGFyZWRbJ2VuJ10pO1xyXG4gICAgICAgIGlmIChoYXNGaXJlRGVidWZmKVxyXG4gICAgICAgICAgbGFiZWxzLnB1c2gob3V0cHV0LmZpcmVEZWJ1ZmZbZGF0YS5wYXJzZXJMYW5nXSB8fCBvdXRwdXQuZmlyZURlYnVmZlsnZW4nXSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHRleHQ6IGAke21hdGNoZXMuYWJpbGl0eX0gKCR7bGFiZWxzLmpvaW4oJywgJyl9KWAsXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnRTEyUyBLbm9ja2VkIE9mZicsXHJcbiAgICAgIC8vIDU4OUEgPSBJY2UgUGlsbGFyIChwcm9taXNlIHNoaXZhIHBoYXNlKVxyXG4gICAgICAvLyA1OEI2ID0gUGFsbSBPZiBUZW1wZXJhbmNlIChwcm9taXNlIHN0YXR1ZSBoYW5kKVxyXG4gICAgICAvLyA1OEI3ID0gTGFzZXIgRXllIChwcm9taXNlIGxpb24gcGhhc2UpXHJcbiAgICAgIC8vIDU4QzEgPSBEYXJrZXN0IERhbmNlIChvcmFjbGUgdGFuayBqdW1wICsga25vY2tiYWNrIGluIGJlZ2lubmluZyBhbmQgdHJpcGxlIGFwb2MpXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogWyc1ODlBJywgJzU4QjYnLCAnNThCNycsICc1OEMxJ10gfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdLbm9ja2VkIG9mZicsXHJcbiAgICAgICAgICAgIGRlOiAnUnVudGVyZ2VmYWxsZW4nLFxyXG4gICAgICAgICAgICBmcjogJ0Egw6l0w6kgYXNzb21tw6koZSknLFxyXG4gICAgICAgICAgICBqYTogJ+ODjuODg+OCr+ODkOODg+OCrycsXHJcbiAgICAgICAgICAgIGNuOiAn5Ye76YCA5Z2g6JC9JyxcclxuICAgICAgICAgICAga286ICfrhInrsLEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdFMTJTIE9yYWNsZSBTaGFkb3dleWUnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiAnNThEMicsIC4uLnBsYXllckRhbWFnZUZpZWxkcyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoZGF0YSwgbWF0Y2hlcykgPT4gZGF0YS5EYW1hZ2VGcm9tTWF0Y2hlcyhtYXRjaGVzKSA+IDAsXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmFiaWxpdHkgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRPRE86IHdhcm5pbmcgZm9yIHRha2luZyBEaWFtb25kIEZsYXNoICg1RkExKSBzdGFjayBvbiB5b3VyIG93bj9cclxuXHJcbi8vIERpYW1vbmQgV2VhcG9uIEV4dHJlbWVcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUNsb3VkRGVja0V4dHJlbWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0RpYW1vbmRFeCBBdXJpIEFydHMgMSc6ICc1RkFGJywgLy8gQXVyaSBBcnRzIGRhc2hlcy9leHBsb3Npb25zXHJcbiAgICAnRGlhbW9uZEV4IEF1cmkgQXJ0cyAyJzogJzVGQjInLCAvLyBBdXJpIEFydHMgZGFzaGVzL2V4cGxvc2lvbnNcclxuICAgICdEaWFtb25kRXggQXVyaSBBcnRzIDMnOiAnNUZDRCcsIC8vIEF1cmkgQXJ0cyBkYXNoZXMvZXhwbG9zaW9uc1xyXG4gICAgJ0RpYW1vbmRFeCBBdXJpIEFydHMgNCc6ICc1RkNFJywgLy8gQXVyaSBBcnRzIGRhc2hlcy9leHBsb3Npb25zXHJcbiAgICAnRGlhbW9uZEV4IEF1cmkgQXJ0cyA1JzogJzVGQ0YnLCAvLyBBdXJpIEFydHMgZGFzaGVzL2V4cGxvc2lvbnNcclxuICAgICdEaWFtb25kRXggQXVyaSBBcnRzIDYnOiAnNUZGOCcsIC8vIEF1cmkgQXJ0cyBkYXNoZXMvZXhwbG9zaW9uc1xyXG4gICAgJ0RpYW1vbmRFeCBBdXJpIEFydHMgNyc6ICc2MTU5JywgLy8gQXVyaSBBcnRzIGRhc2hlcy9leHBsb3Npb25zXHJcbiAgICAnRGlhbW9uZEV4IEFydGljdWxhdGVkIEJpdCBBZXRoZXJpYWwgQnVsbGV0JzogJzVGQUInLCAvLyBiaXQgbGFzZXJzIGR1cmluZyBhbGwgcGhhc2VzXHJcbiAgICAnRGlhbW9uZEV4IERpYW1vbmQgU2hyYXBuZWwgMSc6ICc1RkNCJywgLy8gY2hhc2luZyBjaXJjbGVzXHJcbiAgICAnRGlhbW9uZEV4IERpYW1vbmQgU2hyYXBuZWwgMic6ICc1RkNDJywgLy8gY2hhc2luZyBjaXJjbGVzXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnRGlhbW9uZEV4IENsYXcgU3dpcGUgTGVmdCc6ICc1RkMyJywgLy8gQWRhbWFudCBQdXJnZSBwbGF0Zm9ybSBjbGVhdmVcclxuICAgICdEaWFtb25kRXggQ2xhdyBTd2lwZSBSaWdodCc6ICc1RkMzJywgLy8gQWRhbWFudCBQdXJnZSBwbGF0Zm9ybSBjbGVhdmVcclxuICAgICdEaWFtb25kRXggQXVyaSBDeWNsb25lIDEnOiAnNUZEMScsIC8vIHN0YW5kaW5nIG9uIHRoZSBibHVlIGtub2NrYmFjayBwdWNrXHJcbiAgICAnRGlhbW9uZEV4IEF1cmkgQ3ljbG9uZSAyJzogJzVGRDInLCAvLyBzdGFuZGluZyBvbiB0aGUgYmx1ZSBrbm9ja2JhY2sgcHVja1xyXG4gICAgJ0RpYW1vbmRFeCBBaXJzaGlwXFwncyBCYW5lIDEnOiAnNUZGRScsIC8vIGRlc3Ryb3lpbmcgb25lIG9mIHRoZSBwbGF0Zm9ybXMgYWZ0ZXIgQXVyaSBDeWNsb25lXHJcbiAgICAnRGlhbW9uZEV4IEFpcnNoaXBcXCdzIEJhbmUgMic6ICc1RkQzJywgLy8gZGVzdHJveWluZyBvbmUgb2YgdGhlIHBsYXRmb3JtcyBhZnRlciBBdXJpIEN5Y2xvbmVcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ0RpYW1vbmRFeCBUYW5rIExhc2Vycyc6ICc1RkM4JywgLy8gY2xlYXZpbmcgeWVsbG93IGxhc2VycyBvbiB0b3AgdHdvIGVubWl0eVxyXG4gICAgJ0RpYW1vbmRFeCBIb21pbmcgTGFzZXInOiAnNUZDNCcsIC8vIEFkYW1hbnRlIFB1cmdlIHNwcmVhZFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnRGlhbW9uZEV4IEZsb29kIFJheSc6ICc1RkM3JywgLy8gXCJsaW1pdCBjdXRcIiBjbGVhdmVzXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ0RpYW1vbmRFeCBWZXJ0aWNhbCBDbGVhdmUgS25vY2tlZCBPZmYnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICc1RkQwJyB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ0tub2NrZWQgb2ZmJyxcclxuICAgICAgICAgICAgZGU6ICdSdW50ZXJnZWZhbGxlbicsXHJcbiAgICAgICAgICAgIGZyOiAnQSDDqXTDqSBhc3NvbW3DqShlKScsXHJcbiAgICAgICAgICAgIGphOiAn44OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwsScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBEaWFtb25kIFdlYXBvbiBOb3JtYWxcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUNsb3VkRGVjayxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRGlhbW9uZCBXZWFwb24gQXVyaSBBcnRzJzogJzVGRTMnLCAvLyBBdXJpIEFydHMgZGFzaGVzXHJcbiAgICAnRGlhbW9uZCBXZWFwb24gRGlhbW9uZCBTaHJhcG5lbCBJbml0aWFsJzogJzVGRTEnLCAvLyBpbml0aWFsIGNpcmNsZSBvZiBEaWFtb25kIFNocmFwbmVsXHJcbiAgICAnRGlhbW9uZCBXZWFwb24gRGlhbW9uZCBTaHJhcG5lbCBDaGFzaW5nJzogJzVGRTInLCAvLyBmb2xsb3d1cCBjaXJjbGVzIGZyb20gRGlhbW9uZCBTaHJhcG5lbFxyXG4gICAgJ0RpYW1vbmQgV2VhcG9uIEFldGhlcmlhbCBCdWxsZXQnOiAnNUZENScsIC8vIGJpdCBsYXNlcnNcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdEaWFtb25kIFdlYXBvbiBDbGF3IFN3aXBlIExlZnQnOiAnNUZEOScsIC8vIEFkYW1hbnQgUHVyZ2UgcGxhdGZvcm0gY2xlYXZlXHJcbiAgICAnRGlhbW9uZCBXZWFwb24gQ2xhdyBTd2lwZSBSaWdodCc6ICc1RkRBJywgLy8gQWRhbWFudCBQdXJnZSBwbGF0Zm9ybSBjbGVhdmVcclxuICAgICdEaWFtb25kIFdlYXBvbiBBdXJpIEN5Y2xvbmUgMSc6ICc1RkU2JywgLy8gc3RhbmRpbmcgb24gdGhlIGJsdWUga25vY2tiYWNrIHB1Y2tcclxuICAgICdEaWFtb25kIFdlYXBvbiBBdXJpIEN5Y2xvbmUgMic6ICc1RkU3JywgLy8gc3RhbmRpbmcgb24gdGhlIGJsdWUga25vY2tiYWNrIHB1Y2tcclxuICAgICdEaWFtb25kIFdlYXBvbiBBaXJzaGlwXFwncyBCYW5lIDEnOiAnNUZFOCcsIC8vIGRlc3Ryb3lpbmcgb25lIG9mIHRoZSBwbGF0Zm9ybXMgYWZ0ZXIgQXVyaSBDeWNsb25lXHJcbiAgICAnRGlhbW9uZCBXZWFwb24gQWlyc2hpcFxcJ3MgQmFuZSAyJzogJzVGRkUnLCAvLyBkZXN0cm95aW5nIG9uZSBvZiB0aGUgcGxhdGZvcm1zIGFmdGVyIEF1cmkgQ3ljbG9uZVxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRGlhbW9uZCBXZWFwb24gSG9taW5nIExhc2VyJzogJzVGREInLCAvLyBzcHJlYWQgbWFya2Vyc1xyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdEaWFtb25kIFdlYXBvbiBWZXJ0aWNhbCBDbGVhdmUgS25vY2tlZCBPZmYnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICc1RkU1JyB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ0tub2NrZWQgb2ZmJyxcclxuICAgICAgICAgICAgZGU6ICdSdW50ZXJnZWZhbGxlbicsXHJcbiAgICAgICAgICAgIGZyOiAnQSDDqXTDqSBhc3NvbW3DqShlKScsXHJcbiAgICAgICAgICAgIGphOiAn44OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwsScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkNhc3RydW1NYXJpbnVtRXh0cmVtZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRW1lcmFsZEV4IEhlYXQgUmF5JzogJzVCRDMnLCAvLyBFbWVyYWxkIEJlYW0gaW5pdGlhbCBjb25hbFxyXG4gICAgJ0VtZXJhbGRFeCBQaG90b24gTGFzZXIgMSc6ICc1NTdCJywgLy8gRW1lcmFsZCBCZWFtIGluc2lkZSBjaXJjbGVcclxuICAgICdFbWVyYWxkRXggUGhvdG9uIExhc2VyIDInOiAnNTU3RCcsIC8vIEVtZXJhbGQgQmVhbSBvdXRzaWRlIGNpcmNsZVxyXG4gICAgJ0VtZXJhbGRFeCBIZWF0IFJheSAxJzogJzU1N0EnLCAvLyBFbWVyYWxkIEJlYW0gcm90YXRpbmcgcHVsc2luZyBsYXNlclxyXG4gICAgJ0VtZXJhbGRFeCBIZWF0IFJheSAyJzogJzU1NzknLCAvLyBFbWVyYWxkIEJlYW0gcm90YXRpbmcgcHVsc2luZyBsYXNlclxyXG4gICAgJ0VtZXJhbGRFeCBFeHBsb3Npb24nOiAnNTU5NicsIC8vIE1hZ2l0ZWsgTWluZSBleHBsb3Npb25cclxuICAgICdFbWVyYWxkRXggVGVydGl1cyBUZXJtaW51cyBFc3QgSW5pdGlhbCc6ICc1NUNEJywgLy8gc3dvcmQgaW5pdGlhbCBwdWRkbGVzXHJcbiAgICAnRW1lcmFsZEV4IFRlcnRpdXMgVGVybWludXMgRXN0IEV4cGxvc2lvbic6ICc1NUNFJywgLy8gc3dvcmQgZXhwbG9zaW9uc1xyXG4gICAgJ0VtZXJhbGRFeCBBaXJib3JuZSBFeHBsb3Npb24nOiAnNTVCRCcsIC8vIGV4YWZsYXJlXHJcbiAgICAnRW1lcmFsZEV4IFNpZGVzY2F0aGUgMSc6ICc1NUQ0JywgLy8gbGVmdC9yaWdodCBjbGVhdmVcclxuICAgICdFbWVyYWxkRXggU2lkZXNjYXRoZSAyJzogJzU1RDUnLCAvLyBsZWZ0L3JpZ2h0IGNsZWF2ZVxyXG4gICAgJ0VtZXJhbGRFeCBTaG90cyBGaXJlZCc6ICc1NUI3JywgLy8gcmFuayBhbmQgZmlsZSBzb2xkaWVyc1xyXG4gICAgJ0VtZXJhbGRFeCBTZWN1bmR1cyBUZXJtaW51cyBFc3QnOiAnNTVDQicsIC8vIGRyb3BwZWQgKyBhbmQgeCBoZWFkbWFya2Vyc1xyXG4gICAgJ0VtZXJhbGRFeCBFeHBpcmUnOiAnNTVEMScsIC8vIGdyb3VuZCBhb2Ugb24gYm9zcyBcImdldCBvdXRcIlxyXG4gICAgJ0VtZXJhbGRFeCBBaXJlIFRhbSBTdG9ybSc6ICc1NUQwJywgLy8gZXhwYW5kaW5nIHJlZCBhbmQgYmxhY2sgZ3JvdW5kIGFvZVxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnRW1lcmFsZEV4IERpdmlkZSBFdCBJbXBlcmEnOiAnNTVEOScsIC8vIG5vbi10YW5rIHByb3RlYW4gc3ByZWFkXHJcbiAgICAnRW1lcmFsZEV4IFByaW11cyBUZXJtaW51cyBFc3QgMSc6ICc1NUM0JywgLy8ga25vY2tiYWNrIGFycm93XHJcbiAgICAnRW1lcmFsZEV4IFByaW11cyBUZXJtaW51cyBFc3QgMic6ICc1NUM1JywgLy8ga25vY2tiYWNrIGFycm93XHJcbiAgICAnRW1lcmFsZEV4IFByaW11cyBUZXJtaW51cyBFc3QgMyc6ICc1NUM2JywgLy8ga25vY2tiYWNrIGFycm93XHJcbiAgICAnRW1lcmFsZEV4IFByaW11cyBUZXJtaW51cyBFc3QgNCc6ICc1NUM3JywgLy8ga25vY2tiYWNrIGFycm93XHJcbiAgfSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5DYXN0cnVtTWFyaW51bSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnRW1lcmFsZCBXZWFwb24gSGVhdCBSYXknOiAnNEY5RCcsIC8vIEVtZXJhbGQgQmVhbSBpbml0aWFsIGNvbmFsXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gUGhvdG9uIExhc2VyIDEnOiAnNTUzNCcsIC8vIEVtZXJhbGQgQmVhbSBpbnNpZGUgY2lyY2xlXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gUGhvdG9uIExhc2VyIDInOiAnNTUzNicsIC8vIEVtZXJhbGQgQmVhbSBtaWRkbGUgY2lyY2xlXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gUGhvdG9uIExhc2VyIDMnOiAnNTUzOCcsIC8vIEVtZXJhbGQgQmVhbSBvdXRzaWRlIGNpcmNsZVxyXG4gICAgJ0VtZXJhbGQgV2VhcG9uIEhlYXQgUmF5IDEnOiAnNTUzMicsIC8vIEVtZXJhbGQgQmVhbSByb3RhdGluZyBwdWxzaW5nIGxhc2VyXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gSGVhdCBSYXkgMic6ICc1NTMzJywgLy8gRW1lcmFsZCBCZWFtIHJvdGF0aW5nIHB1bHNpbmcgbGFzZXJcclxuICAgICdFbWVyYWxkIFdlYXBvbiBNYWduZXRpYyBNaW5lIEV4cGxvc2lvbic6ICc1QjA0JywgLy8gcmVwdWxzaW5nIG1pbmUgZXhwbG9zaW9uc1xyXG4gICAgJ0VtZXJhbGQgV2VhcG9uIFNpZGVzY2F0aGUgMSc6ICc1NTNGJywgLy8gbGVmdC9yaWdodCBjbGVhdmVcclxuICAgICdFbWVyYWxkIFdlYXBvbiBTaWRlc2NhdGhlIDInOiAnNTU0MCcsIC8vIGxlZnQvcmlnaHQgY2xlYXZlXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gU2lkZXNjYXRoZSAzJzogJzU1NDEnLCAvLyBsZWZ0L3JpZ2h0IGNsZWF2ZVxyXG4gICAgJ0VtZXJhbGQgV2VhcG9uIFNpZGVzY2F0aGUgNCc6ICc1NTQyJywgLy8gbGVmdC9yaWdodCBjbGVhdmVcclxuICAgICdFbWVyYWxkIFdlYXBvbiBCaXQgU3Rvcm0nOiAnNTU0QScsIC8vIFwiZ2V0IGluXCJcclxuICAgICdFbWVyYWxkIFdlYXBvbiBFbWVyYWxkIENydXNoZXInOiAnNTUzQycsIC8vIGJsdWUga25vY2tiYWNrIHB1Y2tcclxuICAgICdFbWVyYWxkIFdlYXBvbiBQdWxzZSBMYXNlcic6ICc1NTQ4JywgLy8gbGluZSBhb2VcclxuICAgICdFbWVyYWxkIFdlYXBvbiBFbmVyZ3kgQWV0aGVyb3BsYXNtJzogJzU1NTEnLCAvLyBoaXR0aW5nIGEgZ2xvd3kgb3JiXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gRGl2aWRlIEV0IEltcGVyYSBHcm91bmQnOiAnNTU2RicsIC8vIHBhcnR5IHRhcmdldGVkIGdyb3VuZCBjb25lc1xyXG4gICAgJ0VtZXJhbGQgV2VhcG9uIFByaW11cyBUZXJtaW51cyBFc3QnOiAnNEIzRScsIC8vIGdyb3VuZCBjaXJjbGUgZHVyaW5nIGFycm93IGhlYWRtYXJrZXJzXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gU2VjdW5kdXMgVGVybWludXMgRXN0JzogJzU1NkEnLCAvLyBYIC8gKyBoZWFkbWFya2Vyc1xyXG4gICAgJ0VtZXJhbGQgV2VhcG9uIFRlcnRpdXMgVGVybWludXMgRXN0JzogJzU1NkQnLCAvLyB0cmlwbGUgc3dvcmRzXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gU2hvdHMgRmlyZWQnOiAnNTU1RicsIC8vIGxpbmUgYW9lcyBmcm9tIHNvbGRpZXJzXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdFbWVyYWxkIFdlYXBvbiBEaXZpZGUgRXQgSW1wZXJhIFAxJzogJzU1NEUnLCAvLyB0YW5rYnVzdGVyLCBwcm9iYWJseSBjbGVhdmVzLCBwaGFzZSAxXHJcbiAgICAnRW1lcmFsZCBXZWFwb24gRGl2aWRlIEV0IEltcGVyYSBQMic6ICc1NTcwJywgLy8gdGFua2J1c3RlciwgcHJvYmFibHkgY2xlYXZlcywgcGhhc2UgMlxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdFbWVyYWxkIFdlYXBvbiBFbWVyYWxkIENydXNoZXIgS25vY2tlZCBPZmYnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6ICc1NTNFJyB9KSxcclxuICAgICAgZGVhdGhSZWFzb246IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0eXBlOiAnZmFpbCcsXHJcbiAgICAgICAgICBuYW1lOiBtYXRjaGVzLnRhcmdldCxcclxuICAgICAgICAgIHJlYXNvbjoge1xyXG4gICAgICAgICAgICBlbjogJ0tub2NrZWQgb2ZmJyxcclxuICAgICAgICAgICAgZGU6ICdSdW50ZXJnZWZhbGxlbicsXHJcbiAgICAgICAgICAgIGZyOiAnQSDDqXTDqSBhc3NvbW3DqShlKScsXHJcbiAgICAgICAgICAgIGphOiAn44OO44OD44Kv44OQ44OD44KvJyxcclxuICAgICAgICAgICAgY246ICflh7vpgIDlnaDokL0nLFxyXG4gICAgICAgICAgICBrbzogJ+uEieuwsScsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBHZXR0aW5nIGtub2NrZWQgaW50byBhIHdhbGwgZnJvbSB0aGUgYXJyb3cgaGVhZG1hcmtlci5cclxuICAgICAgaWQ6ICdFbWVyYWxkIFdlYXBvbiBQcmltdXMgVGVybWludXMgRXN0IFdhbGwnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6IFsnNTU2MycsICc1NTY0J10gfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdQdXNoZWQgaW50byB3YWxsJyxcclxuICAgICAgICAgICAgZGU6ICdSw7xja3N0b8OfIGluIGRpZSBXYW5kJyxcclxuICAgICAgICAgICAgamE6ICflo4Hjgbjjg47jg4Pjgq/jg5Djg4Pjgq8nLFxyXG4gICAgICAgICAgICBjbjogJ+WHu+mAgOiHs+WimScsXHJcbiAgICAgICAgICAgIGtvOiAn64SJ67CxJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmltcG9ydCB7IHBsYXllckRhbWFnZUZpZWxkcyB9IGZyb20gJy4uLy4uLy4uL29vcHN5X2NvbW1vbic7XHJcblxyXG4vLyBIYWRlcyBFeFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlTWluc3RyZWxzQmFsbGFkSGFkZXNzRWxlZ3ksXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0hhZGVzRXggU2hhZG93IFNwcmVhZCAyJzogJzQ3QUEnLFxyXG4gICAgJ0hhZGVzRXggU2hhZG93IFNwcmVhZCAzJzogJzQ3RTQnLFxyXG4gICAgJ0hhZGVzRXggU2hhZG93IFNwcmVhZCA0JzogJzQ3RTUnLFxyXG4gICAgLy8gRXZlcnlib2R5IHN0YWNrcyBpbiBnb29kIGZhaXRoIGZvciBCYWQgRmFpdGgsIHNvIGRvbid0IGNhbGwgaXQgYSBtaXN0YWtlLlxyXG4gICAgLy8gJ0hhZGVzRXggQmFkIEZhaXRoIDEnOiAnNDdBRCcsXHJcbiAgICAvLyAnSGFkZXNFeCBCYWQgRmFpdGggMic6ICc0N0IwJyxcclxuICAgIC8vICdIYWRlc0V4IEJhZCBGYWl0aCAzJzogJzQ3QUUnLFxyXG4gICAgLy8gJ0hhZGVzRXggQmFkIEZhaXRoIDQnOiAnNDdBRicsXHJcbiAgICAnSGFkZXNFeCBCcm9rZW4gRmFpdGgnOiAnNDdCMicsXHJcbiAgICAnSGFkZXNFeCBNYWdpYyBTcGVhcic6ICc0N0I2JyxcclxuICAgICdIYWRlc0V4IE1hZ2ljIENoYWtyYW0nOiAnNDdCNScsXHJcbiAgICAnSGFkZXNFeCBGb3JrZWQgTGlnaHRuaW5nJzogJzQ3QzknLFxyXG4gICAgJ0hhZGVzRXggRGFyayBDdXJyZW50IDEnOiAnNDdGMScsXHJcbiAgICAnSGFkZXNFeCBEYXJrIEN1cnJlbnQgMic6ICc0N0YyJyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdIYWRlc0V4IENvbWV0JzogJzQ3QjknLCAvLyBtaXNzZWQgdG93ZXJcclxuICAgICdIYWRlc0V4IEFuY2llbnQgRXJ1cHRpb24nOiAnNDdEMycsXHJcbiAgICAnSGFkZXNFeCBQdXJnYXRpb24gMSc6ICc0N0VDJyxcclxuICAgICdIYWRlc0V4IFB1cmdhdGlvbiAyJzogJzQ3RUQnLFxyXG4gICAgJ0hhZGVzRXggU2hhZG93IFN0cmVhbSc6ICc0N0VBJyxcclxuICAgICdIYWRlc0V4IERlYWQgU3BhY2UnOiAnNDdFRScsXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdIYWRlc0V4IFNoYWRvdyBTcHJlYWQgSW5pdGlhbCc6ICc0N0E5JyxcclxuICAgICdIYWRlc0V4IFJhdmVub3VzIEFzc2F1bHQnOiAnKD86NDdBNnw0N0E3KScsXHJcbiAgICAnSGFkZXNFeCBEYXJrIEZsYW1lIDEnOiAnNDdDNicsXHJcbiAgICAnSGFkZXNFeCBEYXJrIEZyZWV6ZSAxJzogJzQ3QzQnLFxyXG4gICAgJ0hhZGVzRXggRGFyayBGcmVlemUgMic6ICc0N0RGJyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnSGFkZXNFeCBEYXJrIElJIFRldGhlcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLnRldGhlcih7IHNvdXJjZTogJ1NoYWRvdyBvZiB0aGUgQW5jaWVudHMnLCBpZDogJzAwMTEnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNEYXJrID0gZGF0YS5oYXNEYXJrIHx8IFtdO1xyXG4gICAgICAgIGRhdGEuaGFzRGFyay5wdXNoKG1hdGNoZXMudGFyZ2V0KTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnSGFkZXNFeCBEYXJrIElJJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyB0eXBlOiAnMjInLCBpZDogJzQ3QkEnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIC8vIERvbid0IGJsYW1lIHBlb3BsZSB3aG8gZG9uJ3QgaGF2ZSB0ZXRoZXJzLlxyXG4gICAgICBjb25kaXRpb246IChkYXRhLCBtYXRjaGVzKSA9PiBkYXRhLmhhc0RhcmsgJiYgZGF0YS5oYXNEYXJrLmluY2x1ZGVzKG1hdGNoZXMudGFyZ2V0KSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdIYWRlc0V4IEJvc3MgVGV0aGVyJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMudGV0aGVyKHsgc291cmNlOiBbJ0lnZXlvcmhtXFwncyBTaGFkZScsICdMYWhhYnJlYVxcJ3MgU2hhZGUnXSwgaWQ6ICcwMDBFJywgY2FwdHVyZTogZmFsc2UgfSksXHJcbiAgICAgIG1pc3Rha2U6IHtcclxuICAgICAgICB0eXBlOiAnd2FybicsXHJcbiAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgZW46ICdCb3NzZXMgVG9vIENsb3NlJyxcclxuICAgICAgICAgIGRlOiAnQm9zc2VzIHp1IE5haGUnLFxyXG4gICAgICAgICAgZnI6ICdCb3NzIHRyb3AgcHJvY2hlcycsXHJcbiAgICAgICAgICBqYTogJ+ODnOOCuei/keOBmeOBjuOCiycsXHJcbiAgICAgICAgICBjbjogJ0JPU1PpnaDlpKrov5HkuoYnLFxyXG4gICAgICAgICAga286ICfsq4Trk6TsnbQg64SI66y0IOqwgOq5jOybgCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnSGFkZXNFeCBEZWF0aCBTaHJpZWsnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiAnNDdDQicsIC4uLnBsYXllckRhbWFnZUZpZWxkcyB9KSxcclxuICAgICAgY29uZGl0aW9uOiAoZGF0YSwgbWF0Y2hlcykgPT4gZGF0YS5EYW1hZ2VGcm9tTWF0Y2hlcyhtYXRjaGVzKSA+IDAsXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmFiaWxpdHkgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnSGFkZXNFeCBCZXlvbmQgRGVhdGggR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc1NjYnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNCZXlvbmREZWF0aCA9IGRhdGEuaGFzQmV5b25kRGVhdGggfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNCZXlvbmREZWF0aFttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdIYWRlc0V4IEJleW9uZCBEZWF0aCBMb3NlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMubG9zZXNFZmZlY3QoeyBlZmZlY3RJZDogJzU2NicgfSksXHJcbiAgICAgIHJ1bjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBkYXRhLmhhc0JleW9uZERlYXRoID0gZGF0YS5oYXNCZXlvbmREZWF0aCB8fCB7fTtcclxuICAgICAgICBkYXRhLmhhc0JleW9uZERlYXRoW21hdGNoZXMudGFyZ2V0XSA9IGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdIYWRlc0V4IEJleW9uZCBEZWF0aCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc1NjYnIH0pLFxyXG4gICAgICBkZWxheVNlY29uZHM6IChfZGF0YSwgbWF0Y2hlcykgPT4gcGFyc2VGbG9hdChtYXRjaGVzLmR1cmF0aW9uKSAtIDAuNSxcclxuICAgICAgZGVhdGhSZWFzb246IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgaWYgKCFkYXRhLmhhc0JleW9uZERlYXRoKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmICghZGF0YS5oYXNCZXlvbmREZWF0aFttYXRjaGVzLnRhcmdldF0pXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiBtYXRjaGVzLmVmZmVjdCxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdIYWRlc0V4IERvb20gR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICc2RTknIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNEb29tID0gZGF0YS5oYXNEb29tIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzRG9vbVttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdIYWRlc0V4IERvb20gTG9zZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmxvc2VzRWZmZWN0KHsgZWZmZWN0SWQ6ICc2RTknIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNEb29tID0gZGF0YS5oYXNEb29tIHx8IHt9O1xyXG4gICAgICAgIGRhdGEuaGFzRG9vbVttYXRjaGVzLnRhcmdldF0gPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnSGFkZXNFeCBEb29tJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzZFOScgfSksXHJcbiAgICAgIGRlbGF5U2Vjb25kczogKF9kYXRhLCBtYXRjaGVzKSA9PiBwYXJzZUZsb2F0KG1hdGNoZXMuZHVyYXRpb24pIC0gMC41LFxyXG4gICAgICBkZWF0aFJlYXNvbjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBpZiAoIWRhdGEuaGFzRG9vbSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAoIWRhdGEuaGFzRG9vbVttYXRjaGVzLnRhcmdldF0pXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiBtYXRjaGVzLmVmZmVjdCxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIEhhZGVzIE5vcm1hbFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlRHlpbmdHYXNwLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdIYWRlcyBCYWQgRmFpdGggMSc6ICc0MTRCJyxcclxuICAgICdIYWRlcyBCYWQgRmFpdGggMic6ICc0MTRDJyxcclxuICAgICdIYWRlcyBEYXJrIEVydXB0aW9uJzogJzQxNTInLFxyXG4gICAgJ0hhZGVzIFNoYWRvdyBTcHJlYWQgMSc6ICc0MTU2JyxcclxuICAgICdIYWRlcyBTaGFkb3cgU3ByZWFkIDInOiAnNDE1NycsXHJcbiAgICAnSGFkZXMgQnJva2VuIEZhaXRoJzogJzQxNEUnLFxyXG4gICAgJ0hhZGVzIEhlbGxib3JuIFlhd3AnOiAnNDE2RicsXHJcbiAgICAnSGFkZXMgUHVyZ2F0aW9uJzogJzQxNzInLFxyXG4gICAgJ0hhZGVzIFNoYWRvdyBTdHJlYW0nOiAnNDE1QycsXHJcbiAgICAnSGFkZXMgQWVybyc6ICc0NTk1JyxcclxuICAgICdIYWRlcyBFY2hvIDEnOiAnNDE2MycsXHJcbiAgICAnSGFkZXMgRWNobyAyJzogJzQxNjQnLFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnSGFkZXMgTmV0aGVyIEJsYXN0JzogJzQxNjMnLFxyXG4gICAgJ0hhZGVzIFJhdmVub3VzIEFzc2F1bHQnOiAnNDE1OCcsXHJcbiAgICAnSGFkZXMgQW5jaWVudCBEYXJrbmVzcyc6ICc0NTkzJyxcclxuICAgICdIYWRlcyBEdWFsIFN0cmlrZSc6ICc0MTYyJyxcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIElubm9jZW5jZSBFeHRyZW1lXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVDcm93bk9mVGhlSW1tYWN1bGF0ZUV4dHJlbWUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0lubm9FeCBEdWVsIERlc2NlbnQnOiAnM0VEMicsXHJcbiAgICAnSW5ub0V4IFJlcHJvYmF0aW9uIDEnOiAnM0VFMCcsXHJcbiAgICAnSW5ub0V4IFJlcHJvYmF0aW9uIDInOiAnM0VDQycsXHJcbiAgICAnSW5ub0V4IFN3b3JkIG9mIENvbmRlbW5hdGlvbiAxJzogJzNFREUnLFxyXG4gICAgJ0lubm9FeCBTd29yZCBvZiBDb25kZW1uYXRpb24gMic6ICczRURGJyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgMSc6ICczRUQzJyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgMic6ICczRUQ0JyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgMyc6ICczRUQ1JyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgNCc6ICczRUQ2JyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgNSc6ICczRUZCJyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgNic6ICczRUZDJyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgNyc6ICczRUZEJyxcclxuICAgICdJbm5vRXggRHJlYW0gb2YgdGhlIFJvb2QgOCc6ICczRUZFJyxcclxuICAgICdJbm5vRXggSG9seSBUcmluaXR5JzogJzNFREInLFxyXG4gICAgJ0lubm9FeCBTb3VsIGFuZCBCb2R5IDEnOiAnM0VENycsXHJcbiAgICAnSW5ub0V4IFNvdWwgYW5kIEJvZHkgMic6ICczRUQ4JyxcclxuICAgICdJbm5vRXggU291bCBhbmQgQm9keSAzJzogJzNFRDknLFxyXG4gICAgJ0lubm9FeCBTb3VsIGFuZCBCb2R5IDQnOiAnM0VEQScsXHJcbiAgICAnSW5ub0V4IFNvdWwgYW5kIEJvZHkgNSc6ICczRUZGJyxcclxuICAgICdJbm5vRXggU291bCBhbmQgQm9keSA2JzogJzNGMDAnLFxyXG4gICAgJ0lubm9FeCBTb3VsIGFuZCBCb2R5IDcnOiAnM0YwMScsXHJcbiAgICAnSW5ub0V4IFNvdWwgYW5kIEJvZHkgOCc6ICczRjAyJyxcclxuICAgICdJbm5vRXggR29kIFJheSAxJzogJzNFRTYnLFxyXG4gICAgJ0lubm9FeCBHb2QgUmF5IDInOiAnM0VFNycsXHJcbiAgICAnSW5ub0V4IEdvZCBSYXkgMyc6ICczRUU4JyxcclxuICAgICdJbm5vRXggRXhwbG9zaW9uJzogJzNFRjAnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gSW5ub2NlbmNlIE5vcm1hbFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlQ3Jvd25PZlRoZUltbWFjdWxhdGUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0lubm8gRGF5YnJlYWsnOiAnM0U5RCcsXHJcbiAgICAnSW5ubyBIb2x5IFRyaW5pdHknOiAnM0VCMycsXHJcblxyXG4gICAgJ0lubm8gUmVwcm9iYXRpb24gMSc6ICczRUI2JyxcclxuICAgICdJbm5vIFJlcHJvYmF0aW9uIDInOiAnM0VCOCcsXHJcbiAgICAnSW5ubyBSZXByb2JhdGlvbiAzJzogJzNFQ0InLFxyXG4gICAgJ0lubm8gUmVwcm9iYXRpb24gNCc6ICczRUI3JyxcclxuXHJcbiAgICAnSW5ubyBTb3VsIGFuZCBCb2R5IDEnOiAnM0VCMScsXHJcbiAgICAnSW5ubyBTb3VsIGFuZCBCb2R5IDInOiAnM0VCMicsXHJcbiAgICAnSW5ubyBTb3VsIGFuZCBCb2R5IDMnOiAnM0VGOScsXHJcbiAgICAnSW5ubyBTb3VsIGFuZCBCb2R5IDQnOiAnM0VGQScsXHJcblxyXG4gICAgJ0lubm8gR29kIFJheSAxJzogJzNFQkQnLFxyXG4gICAgJ0lubm8gR29kIFJheSAyJzogJzNFQkUnLFxyXG4gICAgJ0lubm8gR29kIFJheSAzJzogJzNFQkYnLFxyXG4gICAgJ0lubm8gR29kIFJheSA0JzogJzNFQzAnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBJdCdzIGhhcmQgdG8gY2FwdHVyZSB0aGUgcmVmbGVjdGlvbiBhYmlsaXRpZXMgZnJvbSBMZXZpYXRoYW4ncyBIZWFkIGFuZCBUYWlsIGlmIHlvdSB1c2VcclxuLy8gcmFuZ2VkIHBoeXNpY2FsIGF0dGFja3MgLyBtYWdpYyBhdHRhY2tzIHJlc3BlY3RpdmVseSwgYXMgdGhlIGFiaWxpdHkgbmFtZXMgYXJlIHRoZVxyXG4vLyBhYmlsaXR5IHlvdSB1c2VkIGFuZCBkb24ndCBhcHBlYXIgdG8gc2hvdyB1cCBpbiB0aGUgbG9nIGFzIG5vcm1hbCBcImFiaWxpdHlcIiBsaW5lcy5cclxuLy8gVGhhdCBzYWlkLCBkb3RzIHN0aWxsIHRpY2sgaW5kZXBlbmRlbnRseSBvbiBib3RoIHNvIGl0J3MgbGlrZWx5IHRoYXQgcGVvcGxlIHdpbGwgYXRhY2tcclxuLy8gdGhlbSBhbnl3YXkuXHJcblxyXG4vLyBUT0RPOiBGaWd1cmUgb3V0IHdoeSBEcmVhZCBUaWRlIC8gV2F0ZXJzcG91dCBhcHBlYXIgbGlrZSBzaGFyZXMgKGkuZS4gMHgxNiBpZCkuXHJcbi8vIERyZWFkIFRpZGUgPSA1Q0NBLzVDQ0IvNUNDQywgV2F0ZXJzcG91dCA9IDVDRDFcclxuXHJcbi8vIExldmlhdGhhbiBVbnJlYWxcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZVdob3JsZWF0ZXJVbnJlYWwsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ0xldmlVbiBHcmFuZCBGYWxsJzogJzVDREYnLCAvLyB2ZXJ5IGxhcmdlIGNpcmN1bGFyIGFvZSBiZWZvcmUgc3Bpbm55IGRpdmVzLCBhcHBsaWVzIGhlYXZ5XHJcbiAgICAnTGV2aVVuIEh5ZHJvc2hvdCc6ICc1Q0Q1JywgLy8gV2F2ZXNwaW5lIFNhaGFnaW4gYW9lIHRoYXQgZ2l2ZXMgRHJvcHN5IGVmZmVjdFxyXG4gICAgJ0xldmlVbiBEcmVhZHN0b3JtJzogJzVDRDYnLCAvLyBXYXZldG9vdGggU2FoYWdpbiBhb2UgdGhhdCBnaXZlcyBIeXN0ZXJpYSBlZmZlY3RcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdMZXZpVW4gQm9keSBTbGFtJzogJzVDRDInLCAvLyBsZXZpIHNsYW0gdGhhdCB0aWx0cyB0aGUgYm9hdFxyXG4gICAgJ0xldmlVbiBTcGlubmluZyBEaXZlIDEnOiAnNUNEQicsIC8vIGxldmkgZGFzaCBhY3Jvc3MgdGhlIGJvYXQgd2l0aCBrbm9ja2JhY2tcclxuICAgICdMZXZpVW4gU3Bpbm5pbmcgRGl2ZSAyJzogJzVDRTMnLCAvLyBsZXZpIGRhc2ggYWNyb3NzIHRoZSBib2F0IHdpdGgga25vY2tiYWNrXHJcbiAgICAnTGV2aVVuIFNwaW5uaW5nIERpdmUgMyc6ICc1Q0U4JywgLy8gbGV2aSBkYXNoIGFjcm9zcyB0aGUgYm9hdCB3aXRoIGtub2NrYmFja1xyXG4gICAgJ0xldmlVbiBTcGlubmluZyBEaXZlIDQnOiAnNUNFOScsIC8vIGxldmkgZGFzaCBhY3Jvc3MgdGhlIGJvYXQgd2l0aCBrbm9ja2JhY2tcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ0xldmlVbiBEcm9wc3knOiAnMTEwJywgLy8gc3RhbmRpbmcgaW4gdGhlIGh5ZHJvIHNob3QgZnJvbSB0aGUgV2F2ZXNwaW5lIFNhaGFnaW5cclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0RmFpbDoge1xyXG4gICAgJ0xldmlVbiBIeXN0ZXJpYSc6ICcxMjgnLCAvLyBzdGFuZGluZyBpbiB0aGUgZHJlYWRzdG9ybSBmcm9tIHRoZSBXYXZldG9vdGggU2FoYWdpblxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdMZXZpVW4gQm9keSBTbGFtIEtub2NrZWQgT2ZmJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eSh7IGlkOiAnNUNEMicgfSksXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgICAgZW46ICdLbm9ja2VkIG9mZicsXHJcbiAgICAgICAgICAgIGRlOiAnUnVudGVyZ2VmYWxsZW4nLFxyXG4gICAgICAgICAgICBmcjogJ0Egw6l0w6kgYXNzb21tw6koZSknLFxyXG4gICAgICAgICAgICBqYTogJ+ODjuODg+OCr+ODkOODg+OCrycsXHJcbiAgICAgICAgICAgIGNuOiAn5Ye76YCA5Z2g6JC9JyxcclxuICAgICAgICAgICAga286ICfrhInrsLEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogdGFraW5nIHR3byBkaWZmZXJlbnQgSGlnaC1Qb3dlcmVkIEhvbWluZyBMYXNlcnMgKDRBRDgpXHJcbi8vIFRPRE86IGNvdWxkIGJsYW1lIHRoZSB0ZXRoZXJlZCBwbGF5ZXIgZm9yIFdoaXRlIEFnb255IC8gV2hpdGUgRnVyeSBmYWlsdXJlcz9cclxuXHJcbi8vIFJ1YnkgV2VhcG9uIEV4dHJlbWVcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLkNpbmRlckRyaWZ0RXh0cmVtZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnUnVieUV4IFJ1YnkgQml0IE1hZ2l0ZWsgUmF5JzogJzRBRDInLCAvLyBsaW5lIGFvZXMgZHVyaW5nIGhlbGljb2NsYXdcclxuICAgICdSdWJ5RXggU3Bpa2UgT2YgRmxhbWUgMSc6ICc0QUQzJywgLy8gaW5pdGlhbCBleHBsb3Npb24gZHVyaW5nIGhlbGljb2NsYXdcclxuICAgICdSdWJ5RXggU3Bpa2UgT2YgRmxhbWUgMic6ICc0QjJGJywgLy8gZm9sbG93dXAgaGVsaWNvY2xhdyBleHBsb3Npb25zXHJcbiAgICAnUnVieUV4IFNwaWtlIE9mIEZsYW1lIDMnOiAnNEQwNCcsIC8vIHJhdmVuc2NsYXcgZXhwbG9zaW9uIGF0IGVuZHMgb2YgbGluZXNcclxuICAgICdSdWJ5RXggU3Bpa2UgT2YgRmxhbWUgNCc6ICc0RDA1JywgLy8gcmF2ZW5zY2xhdyBleHBsb3Npb24gYXQgZW5kcyBvZiBsaW5lc1xyXG4gICAgJ1J1YnlFeCBTcGlrZSBPZiBGbGFtZSA1JzogJzRBQ0QnLCAvLyByYXZlbnNjbGF3IGV4cGxvc2lvbiBhdCBlbmRzIG9mIGxpbmVzXHJcbiAgICAnUnVieUV4IFNwaWtlIE9mIEZsYW1lIDYnOiAnNEFDRScsIC8vIHJhdmVuc2NsYXcgZXhwbG9zaW9uIGF0IGVuZHMgb2YgbGluZXNcclxuICAgICdSdWJ5RXggVW5kZXJtaW5lJzogJzRBRDAnLCAvLyBncm91bmQgYW9lcyB1bmRlciB0aGUgcmF2ZW5zY2xhdyBwYXRjaGVzXHJcbiAgICAnUnVieUV4IFJ1YnkgUmF5JzogJzRCMDInLCAvLyBmcm9udGFsIGxhc2VyXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAxJzogJzRBRDknLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5RXggUmF2ZW5zZmxpZ2h0IDInOiAnNEFEQScsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgMyc6ICc0QUREJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCA0JzogJzRBREUnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5RXggUmF2ZW5zZmxpZ2h0IDUnOiAnNEFERicsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgNic6ICc0QUUwJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCA3JzogJzRBRTEnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5RXggUmF2ZW5zZmxpZ2h0IDgnOiAnNEFFMicsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnlFeCBSYXZlbnNmbGlnaHQgOSc6ICc0QUUzJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAxMCc6ICc0QUU0JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAxMSc6ICc0QUU1JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAxMic6ICc0QUU2JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAxMyc6ICc0QUU3JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAxNCc6ICc0QUU4JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAxNSc6ICc0QUU5JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAxNic6ICc0QUVBJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAxNyc6ICc0RTZCJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAxOCc6ICc0RTZDJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAxOSc6ICc0RTZEJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAyMCc6ICc0RTZFJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAyMSc6ICc0RTZGJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IFJhdmVuc2ZsaWdodCAyMic6ICc0RTcwJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieUV4IEN1dCBBbmQgUnVuIDEnOiAnNEIwNScsIC8vIHNsb3cgY2hhcmdlIGFjcm9zcyBhcmVuYSBhZnRlciBzdGFja3NcclxuICAgICdSdWJ5RXggQ3V0IEFuZCBSdW4gMic6ICc0QjA2JywgLy8gc2xvdyBjaGFyZ2UgYWNyb3NzIGFyZW5hIGFmdGVyIHN0YWNrc1xyXG4gICAgJ1J1YnlFeCBDdXQgQW5kIFJ1biAzJzogJzRCMDcnLCAvLyBzbG93IGNoYXJnZSBhY3Jvc3MgYXJlbmEgYWZ0ZXIgc3RhY2tzXHJcbiAgICAnUnVieUV4IEN1dCBBbmQgUnVuIDQnOiAnNEIwOCcsIC8vIHNsb3cgY2hhcmdlIGFjcm9zcyBhcmVuYSBhZnRlciBzdGFja3NcclxuICAgICdSdWJ5RXggQ3V0IEFuZCBSdW4gNSc6ICc0RE9EJywgLy8gc2xvdyBjaGFyZ2UgYWNyb3NzIGFyZW5hIGFmdGVyIHN0YWNrc1xyXG4gICAgJ1J1YnlFeCBNZXRlb3IgQnVyc3QnOiAnNEFGMicsIC8vIG1ldGVvciBleHBsb2RpbmdcclxuICAgICdSdWJ5RXggQnJhZGFtYW50ZSc6ICc0RTM4JywgLy8gaGVhZG1hcmtlcnMgd2l0aCBsaW5lIGFvZXNcclxuICAgICdSdWJ5RXggQ29tZXQgSGVhdnkgSW1wYWN0JzogJzRBRjYnLCAvLyBsZXR0aW5nIGEgdGFuayBjb21ldCBsYW5kXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnUnVieUV4IFJ1YnkgU3BoZXJlIEJ1cnN0JzogJzRBQ0InLCAvLyBleHBsb2RpbmcgdGhlIHJlZCBtaW5lXHJcbiAgICAnUnVieUV4IEx1bmFyIER5bmFtbyc6ICc0RUIwJywgLy8gXCJnZXQgaW5cIiBmcm9tIFJhdmVuJ3MgSW1hZ2VcclxuICAgICdSdWJ5RXggSXJvbiBDaGFyaW90JzogJzRFQjEnLCAvLyBcImdldCBvdXRcIiBmcm9tIFJhdmVuJ3MgSW1hZ2VcclxuICAgICdSdWJ5RXggSGVhcnQgSW4gVGhlIE1hY2hpbmUnOiAnNEFGQScsIC8vIFdoaXRlIEFnb255L0Z1cnkgc2t1bGwgaGl0dGluZyBwbGF5ZXJzXHJcbiAgfSxcclxuICBzaGFyZVdhcm46IHtcclxuICAgICdSdWJ5RXggSG9taW5nIExhc2Vycyc6ICc0QUQ2JywgLy8gc3ByZWFkIG1hcmtlcnMgZHVyaW5nIGN1dCBhbmQgcnVuXHJcbiAgICAnUnVieUV4IE1ldGVvciBTdHJlYW0nOiAnNEU2OCcsIC8vIHNwcmVhZCBtYXJrZXJzIGR1cmluZyBQMlxyXG4gIH0sXHJcbiAgZ2FpbnNFZmZlY3RGYWlsOiB7XHJcbiAgICAnUnVieUV4IEh5c3RlcmlhJzogJzEyOCcsIC8vIE5lZ2F0aXZlIEF1cmEgbG9va2F3YXkgZmFpbHVyZVxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdSdWJ5RXggU2NyZWVjaCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzRBRUUnIH0pLFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIG5hbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgcmVhc29uOiB7XHJcbiAgICAgICAgICAgIGVuOiAnS25vY2tlZCBpbnRvIHdhbGwnLFxyXG4gICAgICAgICAgICBkZTogJ1LDvGNrc3Rvw58gaW4gZGllIFdhbmQnLFxyXG4gICAgICAgICAgICBqYTogJ+WjgeOBuOODjuODg+OCr+ODkOODg+OCrycsXHJcbiAgICAgICAgICAgIGNuOiAn5Ye76YCA6Iez5aKZJyxcclxuICAgICAgICAgICAga286ICfrhInrsLEnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFJ1YnkgTm9ybWFsXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5DaW5kZXJEcmlmdCxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnUnVieSBSYXZlbnNjbGF3JzogJzRBOTMnLCAvLyBjZW50ZXJlZCBjaXJjbGUgYW9lIGZvciByYXZlbnNjbGF3XHJcbiAgICAnUnVieSBTcGlrZSBPZiBGbGFtZSAxJzogJzRBOUEnLCAvLyBpbml0aWFsIGV4cGxvc2lvbiBkdXJpbmcgaGVsaWNvY2xhd1xyXG4gICAgJ1J1YnkgU3Bpa2UgT2YgRmxhbWUgMic6ICc0QjJFJywgLy8gZm9sbG93dXAgaGVsaWNvY2xhdyBleHBsb3Npb25zXHJcbiAgICAnUnVieSBTcGlrZSBPZiBGbGFtZSAzJzogJzRBOTQnLCAvLyByYXZlbnNjbGF3IGV4cGxvc2lvbiBhdCBlbmRzIG9mIGxpbmVzXHJcbiAgICAnUnVieSBTcGlrZSBPZiBGbGFtZSA0JzogJzRBOTUnLCAvLyByYXZlbnNjbGF3IGV4cGxvc2lvbiBhdCBlbmRzIG9mIGxpbmVzXHJcbiAgICAnUnVieSBTcGlrZSBPZiBGbGFtZSA1JzogJzREMDInLCAvLyByYXZlbnNjbGF3IGV4cGxvc2lvbiBhdCBlbmRzIG9mIGxpbmVzXHJcbiAgICAnUnVieSBTcGlrZSBPZiBGbGFtZSA2JzogJzREMDMnLCAvLyByYXZlbnNjbGF3IGV4cGxvc2lvbiBhdCBlbmRzIG9mIGxpbmVzXHJcbiAgICAnUnVieSBSdWJ5IFJheSc6ICc0QUM2JywgLy8gZnJvbnRhbCBsYXNlclxyXG4gICAgJ1J1YnkgVW5kZXJtaW5lJzogJzRBOTcnLCAvLyBncm91bmQgYW9lcyB1bmRlciB0aGUgcmF2ZW5zY2xhdyBwYXRjaGVzXHJcbiAgICAnUnVieSBSYXZlbnNmbGlnaHQgMSc6ICc0RTY5JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieSBSYXZlbnNmbGlnaHQgMic6ICc0RTZBJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieSBSYXZlbnNmbGlnaHQgMyc6ICc0QUExJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieSBSYXZlbnNmbGlnaHQgNCc6ICc0QUEyJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieSBSYXZlbnNmbGlnaHQgNSc6ICc0QUEzJywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieSBSYXZlbnNmbGlnaHQgNic6ICc0QUE0JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieSBSYXZlbnNmbGlnaHQgNyc6ICc0QUE1JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieSBSYXZlbnNmbGlnaHQgOCc6ICc0QUE2JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieSBSYXZlbnNmbGlnaHQgOSc6ICc0QUE3JywgLy8gZGFzaCBhcm91bmQgdGhlIGFyZW5hXHJcbiAgICAnUnVieSBSYXZlbnNmbGlnaHQgMTAnOiAnNEMyMScsIC8vIGRhc2ggYXJvdW5kIHRoZSBhcmVuYVxyXG4gICAgJ1J1YnkgUmF2ZW5zZmxpZ2h0IDExJzogJzRDMkEnLCAvLyBkYXNoIGFyb3VuZCB0aGUgYXJlbmFcclxuICAgICdSdWJ5IENvbWV0IEJ1cnN0JzogJzRBQjQnLCAvLyBtZXRlb3IgZXhwbG9kaW5nXHJcbiAgICAnUnVieSBCcmFkYW1hbnRlJzogJzRBQkMnLCAvLyBoZWFkbWFya2VycyB3aXRoIGxpbmUgYW9lc1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnUnVieSBIb21pbmcgTGFzZXInOiAnNEFDNScsIC8vIHNwcmVhZCBtYXJrZXJzIGluIFAxXHJcbiAgICAnUnVieSBNZXRlb3IgU3RyZWFtJzogJzRFNjcnLCAvLyBzcHJlYWQgbWFya2VycyBpbiBQMlxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBTaGl2YSBVbnJlYWxcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZUFraEFmYWhBbXBoaXRoZWF0cmVVbnJlYWwsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgLy8gTGFyZ2Ugd2hpdGUgY2lyY2xlcy5cclxuICAgICdTaGl2YUV4IEljaWNsZSBJbXBhY3QnOiAnNTM3QicsXHJcbiAgICAvLyBcImdldCBpblwiIGFvZVxyXG4gICAgJ1NoaXZhRXggV2hpdGVvdXQnOiAnNTM3NicsXHJcbiAgICAvLyBBdm9pZGFibGUgdGFuayBzdHVuLlxyXG4gICAgJ1NoaXZhRXggR2xhY2llciBCYXNoJzogJzUzNzUnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgLy8gMjcwIGRlZ3JlZSBhdHRhY2suXHJcbiAgICAnU2hpdmFFeCBHbGFzcyBEYW5jZSc6ICc1Mzc4JyxcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgLy8gSGFpbHN0b3JtIHNwcmVhZCBtYXJrZXIuXHJcbiAgICAnU2hpdmFFeCBIYWlsc3Rvcm0nOiAnNTM2RicsXHJcbiAgfSxcclxuICBzaGFyZUZhaWw6IHtcclxuICAgIC8vIExhc2VyLiAgVE9ETzogbWF5YmUgYmxhbWUgdGhlIHBlcnNvbiBpdCdzIG9uPz9cclxuICAgICdTaGl2YUV4IEF2YWxhbmNoZSc6ICc1Mzc5JyxcclxuICB9LFxyXG4gIHNvbG9XYXJuOiB7XHJcbiAgICAvLyBQYXJ0eSBzaGFyZWQgdGFuayBidXN0ZXIuXHJcbiAgICAnU2hpdmFFeCBJY2VicmFuZCc6ICc1MzczJyxcclxuICB9LFxyXG4gIHRyaWdnZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnU2hpdmFFeCBEZWVwIEZyZWV6ZScsXHJcbiAgICAgIC8vIFNoaXZhIGFsc28gdXNlcyBhYmlsaXR5IDUzN0Egb24geW91LCBidXQgaXQgaGFzIGFuIHVua25vd24gbmFtZS5cclxuICAgICAgLy8gU28sIHVzZSB0aGUgZWZmZWN0IGluc3RlYWQgZm9yIGZyZWUgdHJhbnNsYXRpb24uXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcxRTcnIH0pLFxyXG4gICAgICBjb25kaXRpb246IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIC8vIFRoZSBpbnRlcm1pc3Npb24gYWxzbyBnZXRzIHRoaXMgZWZmZWN0LCBidXQgZm9yIGEgc2hvcnRlciBkdXJhdGlvbi5cclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChtYXRjaGVzLmR1cmF0aW9uKSA+IDIwO1xyXG4gICAgICB9LFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5lZmZlY3QgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlRGFuY2luZ1BsYWd1ZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnVGl0YW5pYSBXb29kXFwncyBFbWJyYWNlJzogJzNENTAnLFxyXG4gICAgLy8gJ1RpdGFuaWEgRnJvc3QgUnVuZSc6ICczRDRFJyxcclxuICAgICdUaXRhbmlhIEdlbnRsZSBCcmVlemUnOiAnM0Y4MycsXHJcbiAgICAnVGl0YW5pYSBMZWFmc3Rvcm0gMSc6ICczRDU1JyxcclxuICAgICdUaXRhbmlhIFB1Y2tcXCdzIFJlYnVrZSc6ICczRDU4JyxcclxuICAgICdUaXRhbmlhIExlYWZzdG9ybSAyJzogJzNFMDMnLFxyXG4gIH0sXHJcbiAgZGFtYWdlRmFpbDoge1xyXG4gICAgJ1RpdGFuaWEgUGhhbnRvbSBSdW5lIDEnOiAnM0Q1RCcsXHJcbiAgICAnVGl0YW5pYSBQaGFudG9tIFJ1bmUgMic6ICczRDVFJyxcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgJ1RpdGFuaWEgRGl2aW5hdGlvbiBSdW5lJzogJzNENUInLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZURhbmNpbmdQbGFndWVFeHRyZW1lLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdUaXRhbmlhRXggV29vZFxcJ3MgRW1icmFjZSc6ICczRDJGJyxcclxuICAgIC8vICdUaXRhbmlhRXggRnJvc3QgUnVuZSc6ICczRDJCJyxcclxuICAgICdUaXRhbmlhRXggR2VudGxlIEJyZWV6ZSc6ICczRjgyJyxcclxuICAgICdUaXRhbmlhRXggTGVhZnN0b3JtIDEnOiAnM0QzOScsXHJcbiAgICAnVGl0YW5pYUV4IFB1Y2tcXCdzIFJlYnVrZSc6ICczRDQzJyxcclxuICAgICdUaXRhbmlhRXggV2FsbG9wJzogJzNEM0InLFxyXG4gICAgJ1RpdGFuaWFFeCBMZWFmc3Rvcm0gMic6ICczRDQ5JyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdUaXRhbmlhRXggUGhhbnRvbSBSdW5lIDEnOiAnM0Q0QycsXHJcbiAgICAnVGl0YW5pYUV4IFBoYW50b20gUnVuZSAyJzogJzNENEQnLFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAvLyBUT0RPOiBUaGlzIGNvdWxkIG1heWJlIGJsYW1lIHRoZSBwZXJzb24gd2l0aCB0aGUgdGV0aGVyP1xyXG4gICAgJ1RpdGFuaWFFeCBUaHVuZGVyIFJ1bmUnOiAnM0QyOScsXHJcbiAgICAnVGl0YW5pYUV4IERpdmluYXRpb24gUnVuZSc6ICczRDRBJyxcclxuICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbi8vIFRpdGFuIFVucmVhbFxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlTmF2ZWxVbnJlYWwsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1RpdGFuVW4gV2VpZ2h0IE9mIFRoZSBMYW5kJzogJzU4RkUnLFxyXG4gICAgJ1RpdGFuVW4gQnVyc3QnOiAnNUFERicsXHJcbiAgfSxcclxuICBkYW1hZ2VGYWlsOiB7XHJcbiAgICAnVGl0YW5VbiBMYW5kc2xpZGUnOiAnNUFEQycsXHJcbiAgICAnVGl0YW5VbiBHYW9sZXIgTGFuZHNsaWRlJzogJzU5MDInLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnVGl0YW5VbiBSb2NrIEJ1c3Rlcic6ICc1OEY2JyxcclxuICB9LFxyXG4gIHNoYXJlRmFpbDoge1xyXG4gICAgJ1RpdGFuVW4gTW91bnRhaW4gQnVzdGVyJzogJzU4RjcnLFxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG5pbXBvcnQgeyBwbGF5ZXJEYW1hZ2VGaWVsZHMgfSBmcm9tICcuLi8uLi8uLi9vb3BzeV9jb21tb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLk1lbW9yaWFNaXNlcmFFeHRyZW1lLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdWYXJpc0V4IEFsZWEgSWFjdGEgRXN0IDEnOiAnNENEMicsXHJcbiAgICAnVmFyaXNFeCBBbGVhIElhY3RhIEVzdCAyJzogJzRDRDMnLFxyXG4gICAgJ1ZhcmlzRXggQWxlYSBJYWN0YSBFc3QgMyc6ICc0Q0Q0JyxcclxuICAgICdWYXJpc0V4IEFsZWEgSWFjdGEgRXN0IDQnOiAnNENENScsXHJcbiAgICAnVmFyaXNFeCBBbGVhIElhY3RhIEVzdCA1JzogJzRDRDYnLFxyXG4gICAgJ1ZhcmlzRXggSWduaXMgRXN0IDEnOiAnNENCNScsXHJcbiAgICAnVmFyaXNFeCBJZ25pcyBFc3QgMic6ICc0Q0M1JyxcclxuICAgICdWYXJpc0V4IFZlbnR1cyBFc3QgMSc6ICc0Q0M3JyxcclxuICAgICdWYXJpc0V4IFZlbnR1cyBFc3QgMic6ICc0Q0M4JyxcclxuICAgICdWYXJpc0V4IEFzc2F1bHQgQ2Fubm9uJzogJzRDRTUnLFxyXG4gICAgJ1ZhcmlzRXggRm9ydGl1cyBSb3RhdGluZyc6ICc0Q0U5JyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgIC8vIERvbid0IGhpdCB0aGUgc2hpZWxkcyFcclxuICAgICdWYXJpc0V4IFJlcGF5JzogJzRDREQnLFxyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAvLyBUaGlzIGlzIHRoZSBcInByb3RlYW5cIiBmb3J0aXVzLlxyXG4gICAgJ1ZhcmlzRXggRm9ydGl1cyBQcm90ZWFuJzogJzRDRTcnLFxyXG4gIH0sXHJcbiAgc2hhcmVGYWlsOiB7XHJcbiAgICAnVmFyaXNFeCBNYWdpdGVrIEJ1cnN0JzogJzRDREYnLFxyXG4gICAgJ1ZhcmlzRXggQWV0aGVyb2NoZW1pY2FsIEdyZW5hZG8nOiAnNENFRCcsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ1ZhcmlzRXggVGVybWludXMgRXN0JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzRDQjQnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIHN1cHByZXNzU2Vjb25kczogMSxcclxuICAgICAgbWlzdGFrZTogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ3dhcm4nLCBibGFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgTmV0UmVnZXhlcyBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvbmV0cmVnZXhlcyc7XHJcbmltcG9ydCBab25lSWQgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3pvbmVfaWQnO1xyXG5cclxuLy8gVE9ETzogUmFkaWFudCBCcmF2ZXIgaXMgNEYxNi80RjE3KHgyKSwgc2hvdWxkbid0IGdldCBoaXQgYnkgYm90aD9cclxuLy8gVE9ETzogUmFkaWFudCBEZXNwZXJhZG8gaXMgNEYxOC80RjE5LCBzaG91bGRuJ3QgZ2V0IGhpdCBieSBib3RoP1xyXG4vLyBUT0RPOiBSYWRpYW50IE1ldGVvciBpcyA0RjFBLCBhbmQgc2hvdWxkbid0IGdldCBoaXQgYnkgbW9yZSB0aGFuIDE/XHJcbi8vIFRPRE86IG1pc3NpbmcgYSB0b3dlcj9cclxuXHJcbi8vIE5vdGU6IERlbGliZXJhdGVseSBub3QgaW5jbHVkaW5nIHB5cmV0aWMgZGFtYWdlIGFzIGFuIGVycm9yLlxyXG4vLyBOb3RlOiBJdCBkb2Vzbid0IGFwcGVhciB0aGF0IHRoZXJlJ3MgYW55IHdheSB0byB0ZWxsIHdobyBmYWlsZWQgdGhlIGN1dHNjZW5lLlxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHpvbmVJZDogWm9uZUlkLlRoZVNlYXRPZlNhY3JpZmljZSxcclxuICBkYW1hZ2VXYXJuOiB7XHJcbiAgICAnV09MIFNvbGVtbiBDb25maXRlb3InOiAnNEYyQScsIC8vIGdyb3VuZCBwdWRkbGVzXHJcbiAgICAnV09MIENvcnVzY2FudCBTYWJlciBJbic6ICc0RjEwJywgLy8gc2FiZXIgaW5cclxuICAgICdXT0wgQ29ydXNjYW50IFNhYmVyIE91dCc6ICc0RjExJywgLy8gc2FiZXIgb3V0XHJcbiAgICAnV09MIEltYnVlZCBDb3J1c2FuY2UgT3V0JzogJzRGNEInLCAvLyBzYWJlciBvdXRcclxuICAgICdXT0wgSW1idWVkIENvcnVzYW5jZSBJbic6ICc0RjRDJywgLy8gc2FiZXIgaW5cclxuICAgICdXT0wgU2hpbmluZyBXYXZlJzogJzRGMjYnLCAvLyBzd29yZCB0cmlhbmdsZVxyXG4gICAgJ1dPTCBDYXV0ZXJpemUnOiAnNEYyNScsXHJcbiAgICAnV09MIEJyaW1zdG9uZSBFYXJ0aCAxJzogJzRGMUUnLCAvLyBjb3JuZXIgZ3Jvd2luZyBjaXJjbGVzLCBpbml0aWFsXHJcbiAgICAnV09MIEJyaW1zdG9uZSBFYXJ0aCAyJzogJzRGMUYnLCAvLyBjb3JuZXIgZ3Jvd2luZyBjaXJjbGVzLCBncm93aW5nXHJcbiAgICAnV09MIEZsYXJlIEJyZWF0aCc6ICc0RjI0JyxcclxuICAgICdXT0wgRGVjaW1hdGlvbic6ICc0RjIzJyxcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ1dPTCBEZWVwIEZyZWV6ZSc6ICc0RTYnLFxyXG4gIH0sXHJcbiAgdHJpZ2dlcnM6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdXT0wgVHJ1ZSBXYWxraW5nIERlYWQnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5nYWluc0VmZmVjdCh7IGVmZmVjdElkOiAnMzhFJyB9KSxcclxuICAgICAgZGVsYXlTZWNvbmRzOiAoX2RhdGEsIG1hdGNoZXMpID0+IHBhcnNlRmxvYXQobWF0Y2hlcy5kdXJhdGlvbikgLSAwLjUsXHJcbiAgICAgIGRlYXRoUmVhc29uOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIG5hbWU6IG1hdGNoZXMudGFyZ2V0LCByZWFzb246IG1hdGNoZXMuZWZmZWN0IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn07XHJcbiIsImltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy9uZXRyZWdleGVzJztcclxuaW1wb3J0IFpvbmVJZCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvem9uZV9pZCc7XHJcblxyXG4vLyBUT0RPOiBSYWRpYW50IEJyYXZlciBpcyA0RUY3LzRFRjgoeDIpLCBzaG91bGRuJ3QgZ2V0IGhpdCBieSBib3RoP1xyXG4vLyBUT0RPOiBSYWRpYW50IERlc3BlcmFkbyBpcyA0RUY5LzRFRkEsIHNob3VsZG4ndCBnZXQgaGl0IGJ5IGJvdGg/XHJcbi8vIFRPRE86IFJhZGlhbnQgTWV0ZW9yIGlzIDRFRkMsIGFuZCBzaG91bGRuJ3QgZ2V0IGhpdCBieSBtb3JlIHRoYW4gMT9cclxuLy8gVE9ETzogQWJzb2x1dGUgSG9seSBzaG91bGQgYmUgc2hhcmVkP1xyXG4vLyBUT0RPOiBpbnRlcnNlY3RpbmcgYnJpbXN0b25lcz9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB6b25lSWQ6IFpvbmVJZC5UaGVTZWF0T2ZTYWNyaWZpY2VFeHRyZW1lLFxyXG4gIGRhbWFnZVdhcm46IHtcclxuICAgICdXT0xFeCBTb2xlbW4gQ29uZml0ZW9yJzogJzRGMEMnLCAvLyBncm91bmQgcHVkZGxlc1xyXG4gICAgJ1dPTEV4IENvcnVzY2FudCBTYWJlciBJbic6ICc0RUYyJywgLy8gc2FiZXIgaW5cclxuICAgICdXT0xFeCBDb3J1c2NhbnQgU2FiZXIgT3V0JzogJzRFRjEnLCAvLyBzYWJlciBvdXRcclxuICAgICdXT0xFeCBJbWJ1ZWQgQ29ydXNhbmNlIE91dCc6ICc0RjQ5JywgLy8gc2FiZXIgb3V0XHJcbiAgICAnV09MRXggSW1idWVkIENvcnVzYW5jZSBJbic6ICc0RjRBJywgLy8gc2FiZXIgaW5cclxuICAgICdXT0xFeCBTaGluaW5nIFdhdmUnOiAnNEYwOCcsIC8vIHN3b3JkIHRyaWFuZ2xlXHJcbiAgICAnV09MRXggQ2F1dGVyaXplJzogJzRGMDcnLFxyXG4gICAgJ1dPTEV4IEJyaW1zdG9uZSBFYXJ0aCc6ICc0RjAwJywgLy8gY29ybmVyIGdyb3dpbmcgY2lyY2xlcywgZ3Jvd2luZ1xyXG4gIH0sXHJcbiAgc2hhcmVXYXJuOiB7XHJcbiAgICAnV09MRXggQWJzb2x1dGUgU3RvbmUgSUlJJzogJzRFRUInLCAvLyBwcm90ZWFuIHdhdmUgaW1idWVkIG1hZ2ljXHJcbiAgICAnV09MRXggRmxhcmUgQnJlYXRoJzogJzRGMDYnLCAvLyB0ZXRoZXIgZnJvbSBzdW1tb25lZCBiYWhhbXV0c1xyXG4gICAgJ1dPTEV4IFBlcmZlY3QgRGVjaW1hdGlvbic6ICc0RjA1JywgLy8gc21uL3dhciBwaGFzZSBtYXJrZXJcclxuICB9LFxyXG4gIGdhaW5zRWZmZWN0V2Fybjoge1xyXG4gICAgJ1dPTEV4IERlZXAgRnJlZXplJzogJzRFNicsIC8vIGZhaWxpbmcgQWJzb2x1dGUgQmxpenphcmQgSUlJXHJcbiAgICAnV09MRXggRGFtYWdlIERvd24nOiAnMjc0JywgLy8gZmFpbGluZyBBYnNvbHV0ZSBGbGFzaFxyXG4gIH0sXHJcbiAgc29sb1dhcm46IHtcclxuICAgICdXb2xFeCBLYXRvbiBTYW4gU2hhcmUnOiAnNEVGRScsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ1dPTEV4IFRydWUgV2Fsa2luZyBEZWFkJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzhGRicgfSksXHJcbiAgICAgIGRlbGF5U2Vjb25kczogKF9kYXRhLCBtYXRjaGVzKSA9PiBwYXJzZUZsb2F0KG1hdGNoZXMuZHVyYXRpb24pIC0gMC41LFxyXG4gICAgICBkZWF0aFJlYXNvbjogKF9kYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2ZhaWwnLCBuYW1lOiBtYXRjaGVzLnRhcmdldCwgcmVhc29uOiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdXT0xFeCBUb3dlcicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzRGMDQnLCBjYXB0dXJlOiBmYWxzZSB9KSxcclxuICAgICAgbWlzdGFrZToge1xyXG4gICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICByZWFzb246IHtcclxuICAgICAgICAgIGVuOiAnTWlzc2VkIFRvd2VyJyxcclxuICAgICAgICAgIGRlOiAnVHVybSB2ZXJwYXNzdCcsXHJcbiAgICAgICAgICBmcjogJ1RvdXIgbWFucXXDqWUnLFxyXG4gICAgICAgICAgamE6ICfloZTjgpLouI/jgb7jgarjgYvjgaPjgZ8nLFxyXG4gICAgICAgICAgY246ICfmsqHouKnloZQnLFxyXG4gICAgICAgICAga286ICfsnqXtjJAg7Iuk7IiYJyxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdXT0xFeCBUcnVlIEhhbGxvd2VkIEdyb3VuZCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHkoeyBpZDogJzRGNDQnIH0pLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIHJlYXNvbjogbWF0Y2hlcy5hYmlsaXR5IH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBGb3IgQmVyc2VyayBhbmQgRGVlcCBEYXJrc2lkZVxyXG4gICAgICBpZDogJ1dPTEV4IE1pc3NlZCBJbnRlcnJ1cHQnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5KHsgaWQ6IFsnNTE1NicsICc1MTU4J10gfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgcmVhc29uOiBtYXRjaGVzLmFiaWxpdHkgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgWm9uZUlkIGZyb20gJy4uLy4uLy4uLy4uLy4uL3Jlc291cmNlcy96b25lX2lkJztcclxuXHJcbmltcG9ydCB7IHBsYXllckRhbWFnZUZpZWxkcyB9IGZyb20gJy4uLy4uLy4uL29vcHN5X2NvbW1vbic7XHJcblxyXG4vLyBUT0RPOiBGSVggbHVtaW5vdXMgYWV0aGVyb3BsYXNtIHdhcm5pbmcgbm90IHdvcmtpbmdcclxuLy8gVE9ETzogRklYIGRvbGwgZGVhdGggbm90IHdvcmtpbmdcclxuLy8gVE9ETzogZmFpbGluZyBoYW5kIG9mIHBhaW4vcGFydGluZyAoY2hlY2sgZm9yIGhpZ2ggZGFtYWdlPylcclxuLy8gVE9ETzogbWFrZSBzdXJlIGV2ZXJ5Ym9keSB0YWtlcyBleGFjdGx5IG9uZSBwcm90ZWFuIChyYXRoZXIgdGhhbiB3YXRjaGluZyBkb3VibGUgaGl0cylcclxuLy8gVE9ETzogdGh1bmRlciBub3QgaGl0dGluZyBleGFjdGx5IDI/XHJcbi8vIFRPRE86IHBlcnNvbiB3aXRoIHdhdGVyL3RodW5kZXIgZGVidWZmIGR5aW5nXHJcbi8vIFRPRE86IGJhZCBuaXNpIHBhc3NcclxuLy8gVE9ETzogZmFpbGVkIGdhdmVsIG1lY2hhbmljXHJcbi8vIFRPRE86IGRvdWJsZSByb2NrZXQgcHVuY2ggbm90IGhpdHRpbmcgZXhhY3RseSAyPyAob3IgdGFua3MpXHJcbi8vIFRPRE86IHN0YW5kaW5nIGluIHNsdWRnZSBwdWRkbGVzIGJlZm9yZSBoaWRkZW4gbWluZT9cclxuLy8gVE9ETzogaGlkZGVuIG1pbmUgZmFpbHVyZT9cclxuLy8gVE9ETzogZmFpbHVyZXMgb2Ygb3JkYWluZWQgbW90aW9uIC8gc3RpbGxuZXNzXHJcbi8vIFRPRE86IGZhaWx1cmVzIG9mIHBsYWludCBvZiBzZXZlcml0eSAodGV0aGVycylcclxuLy8gVE9ETzogZmFpbHVyZXMgb2YgcGxhaW50IG9mIHNvbGlkYXJpdHkgKHNoYXJlZCBzZW50ZW5jZSlcclxuLy8gVE9ETzogb3JkYWluZWQgY2FwaXRhbCBwdW5pc2htZW50IGhpdHRpbmcgbm9uLXRhbmtzXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgem9uZUlkOiBab25lSWQuVGhlRXBpY09mQWxleGFuZGVyVWx0aW1hdGUsXHJcbiAgZGFtYWdlV2Fybjoge1xyXG4gICAgJ1RFQSBTbHVpY2UnOiAnNDlCMScsXHJcbiAgICAnVEVBIFByb3RlYW4gV2F2ZSAxJzogJzQ4MjQnLFxyXG4gICAgJ1RFQSBQcm90ZWFuIFdhdmUgMic6ICc0OUI1JyxcclxuICAgICdURUEgU3BpbiBDcnVzaGVyJzogJzRBNzInLFxyXG4gICAgJ1RFQSBTYWNyYW1lbnQnOiAnNDg1RicsXHJcbiAgICAnVEVBIFJhZGlhbnQgU2FjcmFtZW50JzogJzQ4ODYnLFxyXG4gICAgJ1RFQSBBbG1pZ2h0eSBKdWRnbWVudCc6ICc0ODkwJyxcclxuICB9LFxyXG4gIGRhbWFnZUZhaWw6IHtcclxuICAgICdURUEgSGF3ayBCbGFzdGVyJzogJzQ4MzAnLFxyXG4gICAgJ1RFQSBDaGFrcmFtJzogJzQ4NTUnLFxyXG4gICAgJ1RFQSBFbnVtZXJhdGlvbic6ICc0ODUwJyxcclxuICAgICdURUEgQXBvY2FseXB0aWMgUmF5JzogJzQ4NEMnLFxyXG4gICAgJ1RFQSBQcm9wZWxsZXIgV2luZCc6ICc0ODMyJyxcclxuICB9LFxyXG4gIHNoYXJlV2Fybjoge1xyXG4gICAgJ1RFQSBQcm90ZWFuIFdhdmUgRG91YmxlIDEnOiAnNDlCNicsXHJcbiAgICAnVEVBIFByb3RlYW4gV2F2ZSBEb3VibGUgMic6ICc0ODI1JyxcclxuICAgICdURUEgRmx1aWQgU3dpbmcnOiAnNDlCMCcsXHJcbiAgICAnVEVBIEZsdWlkIFN0cmlrZSc6ICc0OUI3JyxcclxuICAgICdURUEgSGlkZGVuIE1pbmUnOiAnNDg1MicsXHJcbiAgICAnVEVBIEFscGhhIFN3b3JkJzogJzQ4NkInLFxyXG4gICAgJ1RFQSBGbGFyZXRocm93ZXInOiAnNDg2QicsXHJcbiAgICAnVEVBIENoYXN0ZW5pbmcgSGVhdCc6ICc0QTgwJyxcclxuICAgICdURUEgRGl2aW5lIFNwZWFyJzogJzRBODInLFxyXG4gICAgJ1RFQSBPcmRhaW5lZCBQdW5pc2htZW50JzogJzQ4OTEnLFxyXG4gICAgLy8gT3B0aWNhbCBTcHJlYWRcclxuICAgICdURUEgSW5kaXZpZHVhbCBSZXByb2JhdGlvbic6ICc0ODhDJyxcclxuICB9LFxyXG4gIHNvbG9GYWlsOiB7XHJcbiAgICAvLyBPcHRpY2FsIFN0YWNrXHJcbiAgICAnVEVBIENvbGxlY3RpdmUgUmVwcm9iYXRpb24nOiAnNDg4RCcsXHJcbiAgfSxcclxuICB0cmlnZ2VyczogW1xyXG4gICAge1xyXG4gICAgICAvLyBcInRvbyBtdWNoIGx1bWlub3VzIGFldGhlcm9wbGFzbVwiXHJcbiAgICAgIC8vIFdoZW4gdGhpcyBoYXBwZW5zLCB0aGUgdGFyZ2V0IGV4cGxvZGVzLCBoaXR0aW5nIG5lYXJieSBwZW9wbGVcclxuICAgICAgLy8gYnV0IGFsc28gdGhlbXNlbHZlcy5cclxuICAgICAgaWQ6ICdURUEgRXhoYXVzdCcsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmFiaWxpdHlGdWxsKHsgaWQ6ICc0ODFGJywgLi4ucGxheWVyRGFtYWdlRmllbGRzIH0pLFxyXG4gICAgICBjb25kaXRpb246IChfZGF0YSwgbWF0Y2hlcykgPT4gbWF0Y2hlcy50YXJnZXQgPT09IG1hdGNoZXMuc291cmNlLFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdHlwZTogJ2ZhaWwnLFxyXG4gICAgICAgICAgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LFxyXG4gICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICBlbjogJ2x1bWlub3VzIGFldGhlcm9wbGFzbScsXHJcbiAgICAgICAgICAgIGRlOiAnTHVtaW5pc3plbnRlcyDDhHRoZXJvcGxhc21hJyxcclxuICAgICAgICAgICAgZnI6ICfDiXRow6lyb3BsYXNtYSBsdW1pbmV1eCcsXHJcbiAgICAgICAgICAgIGphOiAn5YWJ5oCn54iG6Zu3JyxcclxuICAgICAgICAgICAgY246ICflhYnmgKfniIbpm7cnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdURUEgRHJvcHN5JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzEyMScgfSksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICd3YXJuJywgYmxhbWU6IG1hdGNoZXMudGFyZ2V0LCB0ZXh0OiBtYXRjaGVzLmVmZmVjdCB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdURUEgVGV0aGVyIFRyYWNraW5nJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMudGV0aGVyKHsgc291cmNlOiAnSmFnZCBEb2xsJywgaWQ6ICcwMDExJyB9KSxcclxuICAgICAgcnVuOiAoZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIGRhdGEuamFnZFRldGhlciA9IGRhdGEuamFnZFRldGhlciB8fCB7fTtcclxuICAgICAgICBkYXRhLmphZ2RUZXRoZXJbbWF0Y2hlcy5zb3VyY2VJZF0gPSBtYXRjaGVzLnRhcmdldDtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVEVBIFJlZHVjaWJsZSBDb21wbGV4aXR5JyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzQ4MjEnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIG1pc3Rha2U6IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHR5cGU6ICdmYWlsJyxcclxuICAgICAgICAgIC8vIFRoaXMgbWF5IGJlIHVuZGVmaW5lZCwgd2hpY2ggaXMgZmluZS5cclxuICAgICAgICAgIG5hbWU6IGRhdGEuamFnZFRldGhlciA/IGRhdGEuamFnZFRldGhlclttYXRjaGVzLnNvdXJjZUlkXSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgIHRleHQ6IHtcclxuICAgICAgICAgICAgZW46ICdEb2xsIERlYXRoJyxcclxuICAgICAgICAgICAgZGU6ICdQdXBwZSBUb3QnLFxyXG4gICAgICAgICAgICBmcjogJ1BvdXDDqWUgbW9ydGUnLFxyXG4gICAgICAgICAgICBqYTogJ+ODieODvOODq+OBjOatu+OCk+OBoCcsXHJcbiAgICAgICAgICAgIGNuOiAn5rWu5aOr5b635q275LqhJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVEVBIERyYWluYWdlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuYWJpbGl0eUZ1bGwoeyBpZDogJzQ4MjcnLCAuLi5wbGF5ZXJEYW1hZ2VGaWVsZHMgfSksXHJcbiAgICAgIGNvbmRpdGlvbjogKGRhdGEsIG1hdGNoZXMpID0+ICFkYXRhLnBhcnR5LmlzVGFuayhtYXRjaGVzLnRhcmdldCksXHJcbiAgICAgIG1pc3Rha2U6IChfZGF0YSwgbWF0Y2hlcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6ICdmYWlsJywgbmFtZTogbWF0Y2hlcy50YXJnZXQsIHRleHQ6IG1hdGNoZXMuYWJpbGl0eSB9O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdURUEgVGhyb3R0bGUgR2FpbicsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmdhaW5zRWZmZWN0KHsgZWZmZWN0SWQ6ICcyQkMnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNUaHJvdHRsZSA9IGRhdGEuaGFzVGhyb3R0bGUgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNUaHJvdHRsZVttYXRjaGVzLnRhcmdldF0gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdURUEgVGhyb3R0bGUgTG9zZScsXHJcbiAgICAgIG5ldFJlZ2V4OiBOZXRSZWdleGVzLmxvc2VzRWZmZWN0KHsgZWZmZWN0SWQ6ICcyQkMnIH0pLFxyXG4gICAgICBydW46IChkYXRhLCBtYXRjaGVzKSA9PiB7XHJcbiAgICAgICAgZGF0YS5oYXNUaHJvdHRsZSA9IGRhdGEuaGFzVGhyb3R0bGUgfHwge307XHJcbiAgICAgICAgZGF0YS5oYXNUaHJvdHRsZVttYXRjaGVzLnRhcmdldF0gPSBmYWxzZTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnVEVBIFRocm90dGxlJyxcclxuICAgICAgbmV0UmVnZXg6IE5ldFJlZ2V4ZXMuZ2FpbnNFZmZlY3QoeyBlZmZlY3RJZDogJzJCQycgfSksXHJcbiAgICAgIGRlbGF5U2Vjb25kczogKF9kYXRhLCBtYXRjaGVzKSA9PiBwYXJzZUZsb2F0KG1hdGNoZXMuZHVyYXRpb24pIC0gMC41LFxyXG4gICAgICBkZWF0aFJlYXNvbjogKGRhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICBpZiAoIWRhdGEuaGFzVGhyb3R0bGUpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKCFkYXRhLmhhc1Rocm90dGxlW21hdGNoZXMudGFyZ2V0XSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbmFtZTogbWF0Y2hlcy50YXJnZXQsXHJcbiAgICAgICAgICByZWFzb246IG1hdGNoZXMuZWZmZWN0LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAvLyBCYWxsb29uIFBvcHBpbmcuICBJdCBzZWVtcyBsaWtlIHRoZSBwZXJzb24gd2hvIHBvcHMgaXQgaXMgdGhlXHJcbiAgICAgIC8vIGZpcnN0IHBlcnNvbiBsaXN0ZWQgZGFtYWdlLXdpc2UsIHNvIHRoZXkgYXJlIGxpa2VseSB0aGUgY3VscHJpdC5cclxuICAgICAgaWQ6ICdURUEgT3V0YnVyc3QnLFxyXG4gICAgICBuZXRSZWdleDogTmV0UmVnZXhlcy5hYmlsaXR5RnVsbCh7IGlkOiAnNDgyQScsIC4uLnBsYXllckRhbWFnZUZpZWxkcyB9KSxcclxuICAgICAgc3VwcHJlc3NTZWNvbmRzOiA1LFxyXG4gICAgICBtaXN0YWtlOiAoX2RhdGEsIG1hdGNoZXMpID0+IHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiAnZmFpbCcsIGJsYW1lOiBtYXRjaGVzLnRhcmdldCwgdGV4dDogbWF0Y2hlcy5zb3VyY2UgfTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgXSxcclxufTtcclxuIiwiaW1wb3J0IGZpbGUwIGZyb20gJy4vMDAtbWlzYy9idWZmcy5qcyc7XG5pbXBvcnQgZmlsZTEgZnJvbSAnLi8wMC1taXNjL2dlbmVyYWwuanMnO1xuaW1wb3J0IGZpbGUyIGZyb20gJy4vMDAtbWlzYy90ZXN0LmpzJztcbmltcG9ydCBmaWxlMyBmcm9tICcuLzAyLWFyci90cmlhbC9pZnJpdC1ubS5qcyc7XG5pbXBvcnQgZmlsZTQgZnJvbSAnLi8wMi1hcnIvdHJpYWwvdGl0YW4tbm0uanMnO1xuaW1wb3J0IGZpbGU1IGZyb20gJy4vMDItYXJyL3RyaWFsL2xldmktZXguanMnO1xuaW1wb3J0IGZpbGU2IGZyb20gJy4vMDItYXJyL3RyaWFsL3NoaXZhLWhtLmpzJztcbmltcG9ydCBmaWxlNyBmcm9tICcuLzAyLWFyci90cmlhbC9zaGl2YS1leC5qcyc7XG5pbXBvcnQgZmlsZTggZnJvbSAnLi8wMi1hcnIvdHJpYWwvdGl0YW4taG0uanMnO1xuaW1wb3J0IGZpbGU5IGZyb20gJy4vMDItYXJyL3RyaWFsL3RpdGFuLWV4LmpzJztcbmltcG9ydCBmaWxlMTAgZnJvbSAnLi8wMy1ody9hbGxpYW5jZS93ZWVwaW5nX2NpdHkuanMnO1xuaW1wb3J0IGZpbGUxMSBmcm9tICcuLzAzLWh3L2R1bmdlb24vYWV0aGVyb2NoZW1pY2FsX3Jlc2VhcmNoX2ZhY2lsaXR5LmpzJztcbmltcG9ydCBmaWxlMTIgZnJvbSAnLi8wMy1ody9kdW5nZW9uL2ZyYWN0YWxfY29udGludXVtLmpzJztcbmltcG9ydCBmaWxlMTMgZnJvbSAnLi8wMy1ody9kdW5nZW9uL2d1YmFsX2xpYnJhcnlfaGFyZC5qcyc7XG5pbXBvcnQgZmlsZTE0IGZyb20gJy4vMDMtaHcvZHVuZ2Vvbi9zb2htX2FsX2hhcmQuanMnO1xuaW1wb3J0IGZpbGUxNSBmcm9tICcuLzAzLWh3L3JhaWQvYTEybi5qcyc7XG5pbXBvcnQgZmlsZTE2IGZyb20gJy4vMDQtc2IvZHVuZ2Vvbi9hbGFfbWhpZ28uanMnO1xuaW1wb3J0IGZpbGUxNyBmcm9tICcuLzA0LXNiL2R1bmdlb24vYmFyZGFtc19tZXR0bGUuanMnO1xuaW1wb3J0IGZpbGUxOCBmcm9tICcuLzA0LXNiL2R1bmdlb24va3VnYW5lX2Nhc3RsZS5qcyc7XG5pbXBvcnQgZmlsZTE5IGZyb20gJy4vMDQtc2IvZHVuZ2Vvbi9zdF9tb2NpYW5uZV9oYXJkLmpzJztcbmltcG9ydCBmaWxlMjAgZnJvbSAnLi8wNC1zYi9kdW5nZW9uL3N3YWxsb3dzX2NvbXBhc3MuanMnO1xuaW1wb3J0IGZpbGUyMSBmcm9tICcuLzA0LXNiL2R1bmdlb24vdGVtcGxlX29mX3RoZV9maXN0LmpzJztcbmltcG9ydCBmaWxlMjIgZnJvbSAnLi8wNC1zYi9kdW5nZW9uL3RoZV9idXJuLmpzJztcbmltcG9ydCBmaWxlMjMgZnJvbSAnLi8wNC1zYi9yYWlkL28xbi5qcyc7XG5pbXBvcnQgZmlsZTI0IGZyb20gJy4vMDQtc2IvcmFpZC9vMm4uanMnO1xuaW1wb3J0IGZpbGUyNSBmcm9tICcuLzA0LXNiL3JhaWQvbzNuLmpzJztcbmltcG9ydCBmaWxlMjYgZnJvbSAnLi8wNC1zYi9yYWlkL280bi5qcyc7XG5pbXBvcnQgZmlsZTI3IGZyb20gJy4vMDQtc2IvcmFpZC9vNHMuanMnO1xuaW1wb3J0IGZpbGUyOCBmcm9tICcuLzA0LXNiL3JhaWQvbzdzLmpzJztcbmltcG9ydCBmaWxlMjkgZnJvbSAnLi8wNC1zYi9yYWlkL28xMnMuanMnO1xuaW1wb3J0IGZpbGUzMCBmcm9tICcuLzA0LXNiL3RyaWFsL2J5YWtrby1leC5qcyc7XG5pbXBvcnQgZmlsZTMxIGZyb20gJy4vMDQtc2IvdHJpYWwvc2hpbnJ5dS5qcyc7XG5pbXBvcnQgZmlsZTMyIGZyb20gJy4vMDQtc2IvdHJpYWwvc3VzYW5vLWV4LmpzJztcbmltcG9ydCBmaWxlMzMgZnJvbSAnLi8wNC1zYi91bHRpbWF0ZS91bHRpbWFfd2VhcG9uX3VsdGltYXRlLmpzJztcbmltcG9ydCBmaWxlMzQgZnJvbSAnLi8wNC1zYi91bHRpbWF0ZS91bmVuZGluZ19jb2lsX3VsdGltYXRlLmpzJztcbmltcG9ydCBmaWxlMzUgZnJvbSAnLi8wNS1zaGIvYWxsaWFuY2UvdGhlX2NvcGllZF9mYWN0b3J5LmpzJztcbmltcG9ydCBmaWxlMzYgZnJvbSAnLi8wNS1zaGIvYWxsaWFuY2UvdGhlX3B1cHBldHNfYnVua2VyLmpzJztcbmltcG9ydCBmaWxlMzcgZnJvbSAnLi8wNS1zaGIvYWxsaWFuY2UvdGhlX3Rvd2VyX2F0X3BhcmFkaWdtc19icmVhY2guanMnO1xuaW1wb3J0IGZpbGUzOCBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL2FrYWRhZW1pYV9hbnlkZXIuanMnO1xuaW1wb3J0IGZpbGUzOSBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL2FtYXVyb3QuanMnO1xuaW1wb3J0IGZpbGU0MCBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL2FuYW1uZXNpc19hbnlkZXIuanMnO1xuaW1wb3J0IGZpbGU0MSBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL2RvaG5fbWhlZy5qcyc7XG5pbXBvcnQgZmlsZTQyIGZyb20gJy4vMDUtc2hiL2R1bmdlb24vaGVyb2VzX2dhdW50bGV0LmpzJztcbmltcG9ydCBmaWxlNDMgZnJvbSAnLi8wNS1zaGIvZHVuZ2Vvbi9ob2xtaW5zdGVyX3N3aXRjaC5qcyc7XG5pbXBvcnQgZmlsZTQ0IGZyb20gJy4vMDUtc2hiL2R1bmdlb24vbWFsaWthaHNfd2VsbC5qcyc7XG5pbXBvcnQgZmlsZTQ1IGZyb20gJy4vMDUtc2hiL2R1bmdlb24vbWF0b3lhc19yZWxpY3QuanMnO1xuaW1wb3J0IGZpbGU0NiBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL210X2d1bGcuanMnO1xuaW1wb3J0IGZpbGU0NyBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL3BhZ2x0aGFuLmpzJztcbmltcG9ydCBmaWxlNDggZnJvbSAnLi8wNS1zaGIvZHVuZ2Vvbi9xaXRhbmFfcmF2ZWwuanMnO1xuaW1wb3J0IGZpbGU0OSBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL3RoZV9ncmFuZF9jb3Ntb3MuanMnO1xuaW1wb3J0IGZpbGU1MCBmcm9tICcuLzA1LXNoYi9kdW5nZW9uL3R3aW5uaW5nLmpzJztcbmltcG9ydCBmaWxlNTEgZnJvbSAnLi8wNS1zaGIvZXVyZWthL2RlbHVicnVtX3JlZ2luYWUuanMnO1xuaW1wb3J0IGZpbGU1MiBmcm9tICcuLzA1LXNoYi9ldXJla2EvZGVsdWJydW1fcmVnaW5hZV9zYXZhZ2UuanMnO1xuaW1wb3J0IGZpbGU1MyBmcm9tICcuLzA1LXNoYi9yYWlkL2Uxbi5qcyc7XG5pbXBvcnQgZmlsZTU0IGZyb20gJy4vMDUtc2hiL3JhaWQvZTFzLmpzJztcbmltcG9ydCBmaWxlNTUgZnJvbSAnLi8wNS1zaGIvcmFpZC9lMm4uanMnO1xuaW1wb3J0IGZpbGU1NiBmcm9tICcuLzA1LXNoYi9yYWlkL2Uycy5qcyc7XG5pbXBvcnQgZmlsZTU3IGZyb20gJy4vMDUtc2hiL3JhaWQvZTNuLmpzJztcbmltcG9ydCBmaWxlNTggZnJvbSAnLi8wNS1zaGIvcmFpZC9lM3MuanMnO1xuaW1wb3J0IGZpbGU1OSBmcm9tICcuLzA1LXNoYi9yYWlkL2U0bi5qcyc7XG5pbXBvcnQgZmlsZTYwIGZyb20gJy4vMDUtc2hiL3JhaWQvZTRzLmpzJztcbmltcG9ydCBmaWxlNjEgZnJvbSAnLi8wNS1zaGIvcmFpZC9lNW4uanMnO1xuaW1wb3J0IGZpbGU2MiBmcm9tICcuLzA1LXNoYi9yYWlkL2U1cy5qcyc7XG5pbXBvcnQgZmlsZTYzIGZyb20gJy4vMDUtc2hiL3JhaWQvZTZuLmpzJztcbmltcG9ydCBmaWxlNjQgZnJvbSAnLi8wNS1zaGIvcmFpZC9lNnMudHMnO1xuaW1wb3J0IGZpbGU2NSBmcm9tICcuLzA1LXNoYi9yYWlkL2U3bi5qcyc7XG5pbXBvcnQgZmlsZTY2IGZyb20gJy4vMDUtc2hiL3JhaWQvZTdzLnRzJztcbmltcG9ydCBmaWxlNjcgZnJvbSAnLi8wNS1zaGIvcmFpZC9lOG4uanMnO1xuaW1wb3J0IGZpbGU2OCBmcm9tICcuLzA1LXNoYi9yYWlkL2U4cy5qcyc7XG5pbXBvcnQgZmlsZTY5IGZyb20gJy4vMDUtc2hiL3JhaWQvZTluLmpzJztcbmltcG9ydCBmaWxlNzAgZnJvbSAnLi8wNS1zaGIvcmFpZC9lOXMuanMnO1xuaW1wb3J0IGZpbGU3MSBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMG4uanMnO1xuaW1wb3J0IGZpbGU3MiBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMHMuanMnO1xuaW1wb3J0IGZpbGU3MyBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMW4uanMnO1xuaW1wb3J0IGZpbGU3NCBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMXMuanMnO1xuaW1wb3J0IGZpbGU3NSBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMm4uanMnO1xuaW1wb3J0IGZpbGU3NiBmcm9tICcuLzA1LXNoYi9yYWlkL2UxMnMuanMnO1xuaW1wb3J0IGZpbGU3NyBmcm9tICcuLzA1LXNoYi90cmlhbC9kaWFtb25kX3dlYXBvbi1leC5qcyc7XG5pbXBvcnQgZmlsZTc4IGZyb20gJy4vMDUtc2hiL3RyaWFsL2RpYW1vbmRfd2VhcG9uLmpzJztcbmltcG9ydCBmaWxlNzkgZnJvbSAnLi8wNS1zaGIvdHJpYWwvZW1lcmFsZF93ZWFwb24tZXguanMnO1xuaW1wb3J0IGZpbGU4MCBmcm9tICcuLzA1LXNoYi90cmlhbC9lbWVyYWxkX3dlYXBvbi5qcyc7XG5pbXBvcnQgZmlsZTgxIGZyb20gJy4vMDUtc2hiL3RyaWFsL2hhZGVzLWV4LmpzJztcbmltcG9ydCBmaWxlODIgZnJvbSAnLi8wNS1zaGIvdHJpYWwvaGFkZXMuanMnO1xuaW1wb3J0IGZpbGU4MyBmcm9tICcuLzA1LXNoYi90cmlhbC9pbm5vY2VuY2UtZXguanMnO1xuaW1wb3J0IGZpbGU4NCBmcm9tICcuLzA1LXNoYi90cmlhbC9pbm5vY2VuY2UuanMnO1xuaW1wb3J0IGZpbGU4NSBmcm9tICcuLzA1LXNoYi90cmlhbC9sZXZpLXVuLmpzJztcbmltcG9ydCBmaWxlODYgZnJvbSAnLi8wNS1zaGIvdHJpYWwvcnVieV93ZWFwb24tZXguanMnO1xuaW1wb3J0IGZpbGU4NyBmcm9tICcuLzA1LXNoYi90cmlhbC9ydWJ5X3dlYXBvbi5qcyc7XG5pbXBvcnQgZmlsZTg4IGZyb20gJy4vMDUtc2hiL3RyaWFsL3NoaXZhLXVuLmpzJztcbmltcG9ydCBmaWxlODkgZnJvbSAnLi8wNS1zaGIvdHJpYWwvdGl0YW5pYS5qcyc7XG5pbXBvcnQgZmlsZTkwIGZyb20gJy4vMDUtc2hiL3RyaWFsL3RpdGFuaWEtZXguanMnO1xuaW1wb3J0IGZpbGU5MSBmcm9tICcuLzA1LXNoYi90cmlhbC90aXRhbi11bi5qcyc7XG5pbXBvcnQgZmlsZTkyIGZyb20gJy4vMDUtc2hiL3RyaWFsL3ZhcmlzLWV4LmpzJztcbmltcG9ydCBmaWxlOTMgZnJvbSAnLi8wNS1zaGIvdHJpYWwvd29sLmpzJztcbmltcG9ydCBmaWxlOTQgZnJvbSAnLi8wNS1zaGIvdHJpYWwvd29sLWV4LmpzJztcbmltcG9ydCBmaWxlOTUgZnJvbSAnLi8wNS1zaGIvdWx0aW1hdGUvdGhlX2VwaWNfb2ZfYWxleGFuZGVyLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgeycwMC1taXNjL2J1ZmZzLmpzJzogZmlsZTAsJzAwLW1pc2MvZ2VuZXJhbC5qcyc6IGZpbGUxLCcwMC1taXNjL3Rlc3QuanMnOiBmaWxlMiwnMDItYXJyL3RyaWFsL2lmcml0LW5tLmpzJzogZmlsZTMsJzAyLWFyci90cmlhbC90aXRhbi1ubS5qcyc6IGZpbGU0LCcwMi1hcnIvdHJpYWwvbGV2aS1leC5qcyc6IGZpbGU1LCcwMi1hcnIvdHJpYWwvc2hpdmEtaG0uanMnOiBmaWxlNiwnMDItYXJyL3RyaWFsL3NoaXZhLWV4LmpzJzogZmlsZTcsJzAyLWFyci90cmlhbC90aXRhbi1obS5qcyc6IGZpbGU4LCcwMi1hcnIvdHJpYWwvdGl0YW4tZXguanMnOiBmaWxlOSwnMDMtaHcvYWxsaWFuY2Uvd2VlcGluZ19jaXR5LmpzJzogZmlsZTEwLCcwMy1ody9kdW5nZW9uL2FldGhlcm9jaGVtaWNhbF9yZXNlYXJjaF9mYWNpbGl0eS5qcyc6IGZpbGUxMSwnMDMtaHcvZHVuZ2Vvbi9mcmFjdGFsX2NvbnRpbnV1bS5qcyc6IGZpbGUxMiwnMDMtaHcvZHVuZ2Vvbi9ndWJhbF9saWJyYXJ5X2hhcmQuanMnOiBmaWxlMTMsJzAzLWh3L2R1bmdlb24vc29obV9hbF9oYXJkLmpzJzogZmlsZTE0LCcwMy1ody9yYWlkL2ExMm4uanMnOiBmaWxlMTUsJzA0LXNiL2R1bmdlb24vYWxhX21oaWdvLmpzJzogZmlsZTE2LCcwNC1zYi9kdW5nZW9uL2JhcmRhbXNfbWV0dGxlLmpzJzogZmlsZTE3LCcwNC1zYi9kdW5nZW9uL2t1Z2FuZV9jYXN0bGUuanMnOiBmaWxlMTgsJzA0LXNiL2R1bmdlb24vc3RfbW9jaWFubmVfaGFyZC5qcyc6IGZpbGUxOSwnMDQtc2IvZHVuZ2Vvbi9zd2FsbG93c19jb21wYXNzLmpzJzogZmlsZTIwLCcwNC1zYi9kdW5nZW9uL3RlbXBsZV9vZl90aGVfZmlzdC5qcyc6IGZpbGUyMSwnMDQtc2IvZHVuZ2Vvbi90aGVfYnVybi5qcyc6IGZpbGUyMiwnMDQtc2IvcmFpZC9vMW4uanMnOiBmaWxlMjMsJzA0LXNiL3JhaWQvbzJuLmpzJzogZmlsZTI0LCcwNC1zYi9yYWlkL28zbi5qcyc6IGZpbGUyNSwnMDQtc2IvcmFpZC9vNG4uanMnOiBmaWxlMjYsJzA0LXNiL3JhaWQvbzRzLmpzJzogZmlsZTI3LCcwNC1zYi9yYWlkL283cy5qcyc6IGZpbGUyOCwnMDQtc2IvcmFpZC9vMTJzLmpzJzogZmlsZTI5LCcwNC1zYi90cmlhbC9ieWFra28tZXguanMnOiBmaWxlMzAsJzA0LXNiL3RyaWFsL3NoaW5yeXUuanMnOiBmaWxlMzEsJzA0LXNiL3RyaWFsL3N1c2Fuby1leC5qcyc6IGZpbGUzMiwnMDQtc2IvdWx0aW1hdGUvdWx0aW1hX3dlYXBvbl91bHRpbWF0ZS5qcyc6IGZpbGUzMywnMDQtc2IvdWx0aW1hdGUvdW5lbmRpbmdfY29pbF91bHRpbWF0ZS5qcyc6IGZpbGUzNCwnMDUtc2hiL2FsbGlhbmNlL3RoZV9jb3BpZWRfZmFjdG9yeS5qcyc6IGZpbGUzNSwnMDUtc2hiL2FsbGlhbmNlL3RoZV9wdXBwZXRzX2J1bmtlci5qcyc6IGZpbGUzNiwnMDUtc2hiL2FsbGlhbmNlL3RoZV90b3dlcl9hdF9wYXJhZGlnbXNfYnJlYWNoLmpzJzogZmlsZTM3LCcwNS1zaGIvZHVuZ2Vvbi9ha2FkYWVtaWFfYW55ZGVyLmpzJzogZmlsZTM4LCcwNS1zaGIvZHVuZ2Vvbi9hbWF1cm90LmpzJzogZmlsZTM5LCcwNS1zaGIvZHVuZ2Vvbi9hbmFtbmVzaXNfYW55ZGVyLmpzJzogZmlsZTQwLCcwNS1zaGIvZHVuZ2Vvbi9kb2huX21oZWcuanMnOiBmaWxlNDEsJzA1LXNoYi9kdW5nZW9uL2hlcm9lc19nYXVudGxldC5qcyc6IGZpbGU0MiwnMDUtc2hiL2R1bmdlb24vaG9sbWluc3Rlcl9zd2l0Y2guanMnOiBmaWxlNDMsJzA1LXNoYi9kdW5nZW9uL21hbGlrYWhzX3dlbGwuanMnOiBmaWxlNDQsJzA1LXNoYi9kdW5nZW9uL21hdG95YXNfcmVsaWN0LmpzJzogZmlsZTQ1LCcwNS1zaGIvZHVuZ2Vvbi9tdF9ndWxnLmpzJzogZmlsZTQ2LCcwNS1zaGIvZHVuZ2Vvbi9wYWdsdGhhbi5qcyc6IGZpbGU0NywnMDUtc2hiL2R1bmdlb24vcWl0YW5hX3JhdmVsLmpzJzogZmlsZTQ4LCcwNS1zaGIvZHVuZ2Vvbi90aGVfZ3JhbmRfY29zbW9zLmpzJzogZmlsZTQ5LCcwNS1zaGIvZHVuZ2Vvbi90d2lubmluZy5qcyc6IGZpbGU1MCwnMDUtc2hiL2V1cmVrYS9kZWx1YnJ1bV9yZWdpbmFlLmpzJzogZmlsZTUxLCcwNS1zaGIvZXVyZWthL2RlbHVicnVtX3JlZ2luYWVfc2F2YWdlLmpzJzogZmlsZTUyLCcwNS1zaGIvcmFpZC9lMW4uanMnOiBmaWxlNTMsJzA1LXNoYi9yYWlkL2Uxcy5qcyc6IGZpbGU1NCwnMDUtc2hiL3JhaWQvZTJuLmpzJzogZmlsZTU1LCcwNS1zaGIvcmFpZC9lMnMuanMnOiBmaWxlNTYsJzA1LXNoYi9yYWlkL2Uzbi5qcyc6IGZpbGU1NywnMDUtc2hiL3JhaWQvZTNzLmpzJzogZmlsZTU4LCcwNS1zaGIvcmFpZC9lNG4uanMnOiBmaWxlNTksJzA1LXNoYi9yYWlkL2U0cy5qcyc6IGZpbGU2MCwnMDUtc2hiL3JhaWQvZTVuLmpzJzogZmlsZTYxLCcwNS1zaGIvcmFpZC9lNXMuanMnOiBmaWxlNjIsJzA1LXNoYi9yYWlkL2U2bi5qcyc6IGZpbGU2MywnMDUtc2hiL3JhaWQvZTZzLnRzJzogZmlsZTY0LCcwNS1zaGIvcmFpZC9lN24uanMnOiBmaWxlNjUsJzA1LXNoYi9yYWlkL2U3cy50cyc6IGZpbGU2NiwnMDUtc2hiL3JhaWQvZThuLmpzJzogZmlsZTY3LCcwNS1zaGIvcmFpZC9lOHMuanMnOiBmaWxlNjgsJzA1LXNoYi9yYWlkL2U5bi5qcyc6IGZpbGU2OSwnMDUtc2hiL3JhaWQvZTlzLmpzJzogZmlsZTcwLCcwNS1zaGIvcmFpZC9lMTBuLmpzJzogZmlsZTcxLCcwNS1zaGIvcmFpZC9lMTBzLmpzJzogZmlsZTcyLCcwNS1zaGIvcmFpZC9lMTFuLmpzJzogZmlsZTczLCcwNS1zaGIvcmFpZC9lMTFzLmpzJzogZmlsZTc0LCcwNS1zaGIvcmFpZC9lMTJuLmpzJzogZmlsZTc1LCcwNS1zaGIvcmFpZC9lMTJzLmpzJzogZmlsZTc2LCcwNS1zaGIvdHJpYWwvZGlhbW9uZF93ZWFwb24tZXguanMnOiBmaWxlNzcsJzA1LXNoYi90cmlhbC9kaWFtb25kX3dlYXBvbi5qcyc6IGZpbGU3OCwnMDUtc2hiL3RyaWFsL2VtZXJhbGRfd2VhcG9uLWV4LmpzJzogZmlsZTc5LCcwNS1zaGIvdHJpYWwvZW1lcmFsZF93ZWFwb24uanMnOiBmaWxlODAsJzA1LXNoYi90cmlhbC9oYWRlcy1leC5qcyc6IGZpbGU4MSwnMDUtc2hiL3RyaWFsL2hhZGVzLmpzJzogZmlsZTgyLCcwNS1zaGIvdHJpYWwvaW5ub2NlbmNlLWV4LmpzJzogZmlsZTgzLCcwNS1zaGIvdHJpYWwvaW5ub2NlbmNlLmpzJzogZmlsZTg0LCcwNS1zaGIvdHJpYWwvbGV2aS11bi5qcyc6IGZpbGU4NSwnMDUtc2hiL3RyaWFsL3J1Ynlfd2VhcG9uLWV4LmpzJzogZmlsZTg2LCcwNS1zaGIvdHJpYWwvcnVieV93ZWFwb24uanMnOiBmaWxlODcsJzA1LXNoYi90cmlhbC9zaGl2YS11bi5qcyc6IGZpbGU4OCwnMDUtc2hiL3RyaWFsL3RpdGFuaWEuanMnOiBmaWxlODksJzA1LXNoYi90cmlhbC90aXRhbmlhLWV4LmpzJzogZmlsZTkwLCcwNS1zaGIvdHJpYWwvdGl0YW4tdW4uanMnOiBmaWxlOTEsJzA1LXNoYi90cmlhbC92YXJpcy1leC5qcyc6IGZpbGU5MiwnMDUtc2hiL3RyaWFsL3dvbC5qcyc6IGZpbGU5MywnMDUtc2hiL3RyaWFsL3dvbC1leC5qcyc6IGZpbGU5NCwnMDUtc2hiL3VsdGltYXRlL3RoZV9lcGljX29mX2FsZXhhbmRlci5qcyc6IGZpbGU5NSx9OyJdLCJzb3VyY2VSb290IjoiIn0=