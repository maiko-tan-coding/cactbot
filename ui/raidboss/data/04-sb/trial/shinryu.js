'use strict';

// Shinryu Normal
[{
  zoneId: ZoneId.TheRoyalMenagerie,
  timelineFile: 'shinryu.txt',
  triggers: [
    {
      id: 'Shinryu Normal Akh Morn',
      netRegex: NetRegexes.startsUsing({ id: '1FA4', source: 'Shinryu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '1FA4', source: 'Shinryu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '1FA4', source: 'Shinryu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '1FA4', source: '神龍' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1FA4', source: '神龙' }),
      netRegexKo: NetRegexes.startsUsing({ id: '1FA4', source: '신룡' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Akh Morn on YOU',
            de: 'Akh Morn auf DIR',
            fr: 'Akh Morn sur VOUS',
            ja: '自分にアク・モーン',
            cn: '死亡轮回点名',
            ko: '아크몬 대상자',
          };
        } else if (data.role == 'tank') {
          return {
            en: 'Akh Morn on ' + data.ShortName(matches.target),
            de: 'Akh Morn auf ' + data.ShortName(matches.target),
            fr: 'Akh Morn sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にアク・モーン',
            cn: '死亡轮回点' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 아크몬',
          };
        }
      },
      infoText: function(data, matches) {
        // Nobody with Akh Morn is a direct target for Akh Rai,
        // and tanks should never be targeted for it.
        // Additionally, Akh Rai happens only after the intermission.
        if (matches.target == data.me || data.role == 'tank' || !data.finalPhase)
          return;
        return {
          en: 'Akh Rhai: spread and move',
          de: 'Akh Rhai: Verteilen und bewegen',
          fr: 'Akh Rhai: Dispersion et bougez',
          ja: 'アク・ラーイ: 散開 動け',
          cn: '天光轮回：散开和移动',
          ko: '아크 라이: 산개, 이동',
        };
      },
      tts: {
        en: 'akh morn',
        de: 'akh morn',
        fr: 'akh morn',
        ja: 'アク・モーン',
        cn: '死亡轮回',
        ko: '아크몬',
      },
    },
    {
      id: 'Shinryu Normal Diamond Dust',
      netRegex: NetRegexes.startsUsing({ id: '1FAD', source: 'Shinryu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '1FAD', source: 'Shinryu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '1FAD', source: 'Shinryu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '1FAD', source: '神龍' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1FAD', source: '神龙' }),
      netRegexKo: NetRegexes.startsUsing({ id: '1FAD', source: '신룡' }),
      // Here and elsewhere, timings aren't always completely usable. Instead we give the user
      // a quasi-standard amount of time when notifying.
      delaySeconds: function(data, matches) {
        return matches.castTime - 4;
      },
      response: Responses.stopMoving(),
    },
    {
      id: 'Shinryu Normal Dragonfist',
      netRegex: NetRegexes.startsUsing({ id: '24EF', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '24EF', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '24EF', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '24EF', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '24EF', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '24EF', source: '신룡', capture: false }),
      infoText: {
        en: 'Out of middle',
        de: 'Raus aus der Mitte',
        fr: 'Sortez du milieu',
        ja: '中央から離れ',
        cn: '离开中间',
        ko: '중앙 피하기',
      },
    },
    {
      id: 'Shinryu Normal Hellfire',
      netRegex: NetRegexes.startsUsing({ id: '1FAB', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1FAB', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1FAB', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1FAB', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1FAB', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1FAB', source: '신룡', capture: false }),
      durationSeconds: 7,
      alertText: {
        en: 'Get in water',
        de: 'In\'s Wasser',
        fr: 'Allez dans l\'eau',
        ja: '水に入る',
        cn: '进水圈',
        ko: '물 장판에 들어가기',
      },
      tts: {
        en: 'water',
        de: 'wasser',
        fr: 'eau',
        ja: 'みず',
        cn: '进水圈',
        ko: '물 장판',
      },
    },
    {
      id: 'Shinryu Normal Hypernova',
      netRegex: NetRegexes.startsUsing({ id: ['1F99', '1F9A'], source: 'Right Wing', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['1F99', '1F9A'], source: 'Recht(?:e|er|es|en) Schwinge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['1F99', '1F9A'], source: 'Aile Droite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['1F99', '1F9A'], source: 'ライトウィング', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['1F99', '1F9A'], source: '右翼', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['1F99', '1F9A'], source: '오른쪽 날개', capture: false }),
      durationSeconds: 7,
      alertText: {
        en: 'Stack in water',
        de: 'In Wasser stacken',
        fr: 'Packez-vous dans l\'eau',
        ja: '水に集合',
        cn: '在水圈攻击',
        ko: '물 장판에 모이기',
      },
      tts: {
        en: 'water',
        de: 'Wasser',
        fr: 'eau',
        ja: 'みず',
        cn: '水圈',
        ko: '물 장판',
      },
    },
    {
      id: 'Shinryu Normal Judgement Bolt',
      netRegex: NetRegexes.startsUsing({ id: '1FAC', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1FAC', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1FAC', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1FAC', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1FAC', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1FAC', source: '신룡', capture: false }),
      durationSeconds: 7,
      alertText: {
        en: 'out of water',
        de: 'Raus aus dem Wasser',
        fr: 'Sortez de l\'eau',
        ja: '水から離れ',
        cn: '离开水圈',
        ko: '물 장판 밖으로',
      },
    },
    {
      id: 'Shinryu Normal Levinbolt',
      netRegex: NetRegexes.startsUsing({ id: '1F9B', source: 'Right Wing', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1F9B', source: 'Recht(?:e|er|es|en) Schwinge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1F9B', source: 'Aile Droite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1F9B', source: 'ライトウィング', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1F9B', source: '右翼', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1F9B', source: '오른쪽 날개', capture: false }),
      durationSeconds: 7,
      alertText: {
        en: 'Spread out, no water',
        de: 'Verteilen und nicht in\'s Wasser',
        fr: 'Dispersez-vous en dehors de l\'eau',
        ja: '散開、水に入らない',
        cn: '散开，离开水圈',
        ko: '산개, 물장판 X',
      },
      tts: {
        en: 'levinbolt',
        de: 'Blitz',
        fr: 'fulguration',
        ja: '稲妻',
        cn: '离开闪电',
        ko: '우레',
      },
    },
    {
      id: 'Shinryu Normal Tidal Wave',
      netRegex: NetRegexes.startsUsing({ id: '1FAA', source: 'Shinryu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '1FAA', source: 'Shinryu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '1FAA', source: 'Shinryu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '1FAA', source: '神龍' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1FAA', source: '神龙' }),
      netRegexKo: NetRegexes.startsUsing({ id: '1FAA', source: '신룡' }),
      delaySeconds: function(data, matches) {
        return matches.castTime - 6;
      },
      durationSeconds: 5,
      infoText: {
        en: 'Knockback, look for water',
        de: 'Rückstoß, nach Wasser schauen',
        fr: 'Poussée, cherchez l\'eau',
        ja: 'ノックバック、水を探せ',
        cn: '击退，找水圈',
        ko: '넉백, 물기둥 확인',
      },
      tts: {
        en: 'knockback',
        de: 'Rückstoß',
        fr: 'Poussée',
        ja: 'ノックバック',
        cn: '击退',
        ko: '넉백',
      },
    },
    {
      id: 'Shinryu Normal Ice Storm',
      netRegex: NetRegexes.startsUsing({ id: '1FA2', source: 'Left Wing' }),
      netRegexDe: NetRegexes.startsUsing({ id: '1FA2', source: 'link(?:e|er|es|en) Schwinge' }),
      netRegexFr: NetRegexes.startsUsing({ id: '1FA2', source: 'aile gauche' }),
      netRegexJa: NetRegexes.startsUsing({ id: '1FA2', source: 'レフトウィング' }),
      netRegexCn: NetRegexes.startsUsing({ id: '1FA2', source: '左翼' }),
      netRegexKo: NetRegexes.startsUsing({ id: '1FA2', source: '왼쪽 날개' }),
      condition: function(data) {
        return data.role == 'healer';
      },
      delaySeconds: function(data, matches) {
        return matches.castTime - 4;
      },
      response: Responses.aoe(),
    },
    {
      id: 'Shinryu Normal Tail Slap',
      netRegex: NetRegexes.startsUsing({ id: '1F93', source: 'Tail', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1F93', source: 'Schwanz', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1F93', source: 'Queue', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1F93', source: '神龍の尾', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1F93', source: '龙尾', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1F93', source: '신룡의 꼬리', capture: false }),
      delaySeconds: 2,
      infoText: {
        en: 'Tail: Switch targets',
        de: 'Schweif: Zielwechsel',
        fr: 'Queue : Changez de cible',
        ja: '尾: タゲチェンジ',
        cn: '打尾巴',
        ko: '꼬리 공격',
      },
      tts: {
        en: 'tail',
        de: 'schweif',
        fr: 'queue',
        ja: '尾',
        cn: '尾巴',
        ko: '꼬리',
      },
    },
    {
      // Re-using the Gyre Charge triggers since they're convenient and already translated.
      id: 'Shinryu Normal Akh Rai Activation',
      netRegex: NetRegexes.startsUsing({ id: '1FF4', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1FF4', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1FF4', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1FF4', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1FF4', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1FF4', source: '신룡', capture: false }),
      condition: function(data) {
        return !data.finalPhase;
      },
      run: function(data) {
        data.finalPhase = true;
      },
    },
    {
      id: 'Shinryu Normal Divebomb',
      netRegex: NetRegexes.startsUsing({ id: '1FF4', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1FF4', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1FF4', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1FF4', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1FF4', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1FF4', source: '신룡', capture: false }),
      alertText: {
        en: 'avoid divebomb',
        de: 'Divebomb ausweichen',
        fr: 'Évitez la bombe plongeante',
        ja: 'ダイブボムに避け',
        cn: '前方顺劈',
        ko: '급강하 폭격 피하기',
      },
      tts: {
        en: 'divebombs',
        de: 'sturzflug',
        fr: 'bombe plongeante',
        ja: 'ダイブボム',
        cn: '顺劈',
        ko: '급강하 폭격',
      },
    },
    {
      id: 'Shinryu Normal Tethers',
      netRegex: NetRegexes.headMarker({ id: '0061' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 3.8,
      response: Responses.breakChains(),
    },
    {
      // There doesn't really seem to be any verified information about this marker.
      // It usually appears around Burning Chains, but it's wildly inconsistent.
      // However, it *seems* that the tail attacks from the side the target is on.
      id: 'Shinryu Normal Slap Marker',
      netRegex: NetRegexes.headMarker({ id: '0062' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Bait onto unbroken squares',
        de: 'Auf nicht kaputter Fläche ködern',
        fr: 'Attirez sur les carrés non brisés',
        ja: '壊れなかった床に誘導',
        cn: '在未损坏方格上诱导',
        ko: '꼬리 내리치기 유도',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Cocoon': 'Lichtsphäre',
        'Left Wing': 'link(?:e|er|es|en) Schwinge',
        'Right Wing': 'recht(?:e|er|es|en) Schwinge',
        'Shinryu': 'Shinryu',
        'Tail': 'Schwanz',
        'Icicle': 'Eiszapfen',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Elemental Attack': 'Elemental Attack',
        'Dark Matter': 'Dunkelmaterie',
        'Dragonfist': 'Drachenfaust',
        'Earth Breath': 'Erdatem',
        'Gyre Charge': 'Wirbel-Aufladung',
        'Hellfire': 'Höllenfeuer',
        'Hypernova': 'Supernova',
        'Ice Storm': 'Eissturm',
        'Icicle Impact': 'Eiszapfen-Schlag',
        'Judgment Bolt': 'Ionenschlag',
        'Levinbolt': 'Keraunisches Feld',
        'Meteor Impact': 'Meteoreinschlag',
        'Protostar': 'Protostern',
        'Spikesicle': 'Eislanze',
        'Summon Icicle': 'Flugeis',
        'TAP BUTTON OR ELSE': 'DRÜCKE TASTEN ETC',
        'Tail Slap': 'Schweifklapser',
        'Tidal Wave': 'Flutwelle',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Cocoon': 'cocon de lumière',
        'Icicle': 'stalactite',
        'Left Wing': 'aile gauche',
        'Right Wing': 'aile droite',
        'Shinryu': 'Shinryu',
        'Tail': 'queue',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Elemental Attack': 'Attaque élémentaire',
        'Dark Matter': 'Matière sombre',
        'Dragonfist': 'Poing dragon',
        'Earth Breath': 'Souffle de terre',
        'Gyre Charge': 'Gyrocharge',
        'Hellfire': 'Flammes de l\'enfer',
        'Hypernova': 'Hypernova',
        'Ice Storm': 'Tempête de glace',
        'Icicle Impact': 'Impact de stalactite',
        'Judgment Bolt': 'Éclair du jugement',
        'Levinbolt': 'Fulguration',
        'Meteor Impact': 'Impact de météore',
        'Protostar': 'Proto-étoile',
        'Spikesicle': 'Stalactopointe',
        'Summon Icicle': 'Appel de stalactite',
        'Tail Slap': 'Gifle caudale',
        'TAP BUTTON OR ELSE': 'CLIQUEZ SUR LE BOUTON OU AUTRE',
        'Tidal Wave': 'Raz-de-marée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Cocoon': '光の繭',
        'Left Wing': 'レフトウィング',
        'Right Wing': 'ライトウィング',
        'Shinryu': '神龍',
        'Tail': '神龍の尾',
        'Icicle': 'アイシクル',
      },
      'replaceText': {
        'Akh Morn': 'アク・モーン',
        'Elemental Attack': 'エレメンタル攻撃',
        'Dark Matter': 'ダークマター',
        'Dragonfist': '龍掌',
        'Earth Breath': 'アースブレス',
        'Gyre Charge': 'ジャイヤチャージ',
        'Hellfire': '地獄の火炎',
        'Hypernova': 'スーパーノヴァ',
        'Ice Storm': '吹雪',
        'Icicle Impact': 'アイシクルインパクト',
        'Judgment Bolt': '裁きの雷',
        'Levinbolt': '稲妻',
        'Meteor Impact': 'メテオインパクト',
        'Protostar': 'プロトスター',
        'Spikesicle': 'アイシクルスパイク',
        'Summon Icicle': 'サモン・アイシクル',
        'TAP BUTTON OR ELSE': 'ボタンを押せ！',
        'Tail Slap': 'テールスラップ',
        'Tidal Wave': 'タイダルウェイブ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Cocoon': '光茧',
        'Left Wing': '左翼',
        'Right Wing': '右翼',
        'Shinryu': '神龙',
        'Tail': '龙尾',
        'Icicle': '冰柱',
      },
      'replaceText': {
        'Akh Morn': '死亡轮回',
        'Elemental Attack': '大气爆发/制裁之雷/钻石星尘/地狱之火炎/大地之怒/巨浪',
        'Dark Matter': '暗物质',
        'Dragonfist': '龙掌',
        'Earth Breath': '大地吐息',
        'Gyre Charge': '螺旋冲锋',
        'Hellfire': '地狱之火炎',
        'Hypernova': '超新星',
        'Ice Storm': '吹雪',
        'Icicle Impact': '冰柱冲击',
        'Judgment Bolt': '制裁之雷',
        'Levinbolt': '闪电',
        'Meteor Impact': '陨石冲击',
        'Protostar': '原恒星',
        'Spikesicle': '冰柱突刺',
        'Summon Icicle': '召唤冰柱',
        'TAP BUTTON OR ELSE': 'XJB按',
        'Tail Slap': '尾部猛击',
        'Tidal Wave': '巨浪',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Cocoon': '빛의 고치',
        'Left Wing': '왼쪽 날개',
        'Right Wing': '오른쪽 날개',
        'Shinryu': '신룡',
        'Tail(?! )': '신룡의 꼬리',
      },
      'replaceText': {
        'Akh Morn': '아크 몬',
        'Dark Matter': '암흑물질',
        'Dragonfist': '용의 손바닥',
        'Elemental Attack': '원소 공격',
        'Earth Breath': '대지의 숨결',
        'Gyre Charge': '회전 돌진',
        'Hellfire': '지옥의 화염',
        'Hypernova': '초신성',
        'Ice Storm': '눈보라',
        'Icicle Impact': '고드름 낙하',
        'Judgment Bolt': '심판의 벼락',
        'Levinbolt': '우레',
        'Meteor Impact': '운석 낙하',
        'Protostar': '원시별',
        'Spikesicle': '고드름 돌진',
        'Summon Icicle': '고드름 소환',
        'TAP BUTTON OR ELSE': '긴 급 조 작',
        'Tail Slap': '꼬리치기',
        'Tidal Wave': '해일',
      },
    },
  ],
}];
