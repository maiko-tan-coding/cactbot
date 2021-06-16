/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./resources/regexes.ts
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

;// CONCATENATED MODULE: ./resources/netregexes.ts

// Differences from Regexes:
// * may have more fields
// * AddedCombatant npc id is broken up into npcNameId and npcBaseId
// * gameLog always splits name into its own field (but previously wouldn't)
const separator = '\\|';
const matchDefault = '[^|]*';
const netregexes_startsUsingParams = (/* unused pure expression or super */ null && (['timestamp', 'sourceId', 'source', 'id', 'ability', 'targetId', 'target', 'castTime']));
const netregexes_abilityParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'id', 'ability', 'targetId', 'target']));
const netregexes_abilityFullParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'id', 'ability', 'targetId', 'target', 'flags', 'damage', 'targetCurrentHp', 'targetMaxHp', 'x', 'y', 'z', 'heading']));
const netregexes_headMarkerParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'id']));
const netregexes_addedCombatantParams = (/* unused pure expression or super */ null && (['id', 'name']));
const netregexes_addedCombatantFullParams = (/* unused pure expression or super */ null && (['id', 'name', 'job', 'level', 'ownerId', 'world', 'npcNameId', 'npcBaseId', 'currentHp', 'hp', 'x', 'y', 'z', 'heading']));
const netregexes_removingCombatantParams = (/* unused pure expression or super */ null && (['id', 'name', 'hp']));
const netregexes_gainsEffectParams = (/* unused pure expression or super */ null && (['effectId', 'effect', 'duration', 'sourceId', 'source', 'targetId', 'target', 'count']));
const netregexes_statusEffectExplicitParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'hp', 'maxHp', 'x', 'y', 'z', 'heading', 'data0', 'data1', 'data2', 'data3', 'data4']));
const netregexes_losesEffectParams = (/* unused pure expression or super */ null && (['effectId', 'effect', 'sourceId', 'source', 'targetId', 'target', 'count']));
const netregexes_tetherParams = (/* unused pure expression or super */ null && (['sourceId', 'source', 'targetId', 'target', 'id']));
const netregexes_wasDefeatedParams = (/* unused pure expression or super */ null && (['targetId', 'target', 'sourceId', 'source']));
const netregexes_echoParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const netregexes_dialogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const netregexes_messageParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const netregexes_gameLogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const netregexes_gameNameLogParams = (/* unused pure expression or super */ null && (['code', 'name', 'line']));
const netregexes_statChangeParams = (/* unused pure expression or super */ null && (['job', 'strength', 'dexterity', 'vitality', 'intelligence', 'mind', 'piety', 'attackPower', 'directHit', 'criticalHit', 'attackMagicPotency', 'healMagicPotency', 'determination', 'skillSpeed', 'spellSpeed', 'tenacity']));
const netregexes_changeZoneParams = (/* unused pure expression or super */ null && (['id', 'name']));
const netregexes_network6dParams = (/* unused pure expression or super */ null && (['instance', 'command', 'data0', 'data1', 'data2', 'data3']));
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
    Regexes.validateParams(params, funcName, ['capture', ...validFields]);
    // Find the last key we care about, so we can shorten the regex if needed.
    const capture = Regexes.trueIfUndefined(params.capture);
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
            str += Regexes.maybeCapture(
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
    return Regexes.parse(str);
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
        Regexes.validateParams(params, 'echo', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
        params.code = '0038';
        return NetRegexes.gameLog(params);
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static dialog(params) {
        if (typeof params === 'undefined')
            params = {};
        Regexes.validateParams(params, 'dialog', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
        params.code = '0044';
        return NetRegexes.gameLog(params);
    }
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static message(params) {
        if (typeof params === 'undefined')
            params = {};
        Regexes.validateParams(params, 'message', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
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
        this.regexes = this.buildLocaleRegexes(localeLines, (s) => Regexes.gameLog({ line: s + '.*?' }));
        return this.regexes;
    }
    get localeNetRegex() {
        if (this.netRegexes)
            return this.netRegexes;
        this.netRegexes = this.buildLocaleRegexes(localeLines, (s) => NetRegexes.gameLog({ line: s + '[^|]*?' }));
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


class EmulatorCommon {
    static cloneData(data, exclude = ['options', 'party']) {
        const ret = {};
        // Use extra logic for top-level extend for property exclusion
        // This cut the execution time of this code from 41,000ms to 50ms when parsing a 12 minute pull
        for (const i in data) {
            if (exclude.includes(i))
                continue;
            if (typeof data[i] === 'object')
                ret[i] = EmulatorCommon._cloneData(data[i]);
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
                    ret[i] = EmulatorCommon._cloneData(data[i]);
                return ret;
            }
            if (data === null)
                return null;
            if (data instanceof RegExp)
                return new RegExp(data);
            const ret = {};
            for (const i in data)
                ret[i] = EmulatorCommon._cloneData(data[i]);
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
        const month = EmulatorCommon.zeroPad((date.getMonth() + 1).toString());
        const day = EmulatorCommon.zeroPad(date.getDate().toString());
        return `${year}-${month}-${day}`;
    }
    static timeToTimeString(time, includeMillis = false) {
        return this.dateObjectToTimeString(new Date(time), includeMillis);
    }
    static dateObjectToTimeString(date, includeMillis = false) {
        const hour = EmulatorCommon.zeroPad(date.getHours().toString());
        const minute = EmulatorCommon.zeroPad(date.getMinutes().toString());
        const second = EmulatorCommon.zeroPad(date.getSeconds().toString());
        let ret = `${hour}:${minute}:${second}`;
        if (includeMillis)
            ret = ret + `.${date.getMilliseconds()}`;
        return ret;
    }
    static msToDuration(ms) {
        const tmp = EmulatorCommon.timeToString(ms, false);
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
        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.countdownRegexes);
        if (res) {
            (_a = res.groups) !== null && _a !== void 0 ? _a : (res.groups = {});
            res.groups.StartIn = (parseInt((_b = res.groups.time) !== null && _b !== void 0 ? _b : '0') * 1000).toString();
            res.groups.StartType = 'Countdown';
            return res;
        }
        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.sealRegexes);
        if (res) {
            (_c = res.groups) !== null && _c !== void 0 ? _c : (res.groups = {});
            res.groups.StartIn = '0';
            res.groups.StartType = 'Seal';
            return res;
        }
        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.engageRegexes);
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
        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.winRegex);
        if (res) {
            (_a = res.groups) !== null && _a !== void 0 ? _a : (res.groups = {});
            res.groups.EndType = 'Win';
            return res;
        }
        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.wipeRegex);
        if (res) {
            (_b = res.groups) !== null && _b !== void 0 ? _b : (res.groups = {});
            res.groups.EndType = 'Wipe';
            return res;
        }
        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.cactbotWipeRegex);
        if (res) {
            (_c = res.groups) !== null && _c !== void 0 ? _c : (res.groups = {});
            res.groups.EndType = 'Cactbot Wipe';
            return res;
        }
        res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.unsealRegexes);
        if (res) {
            (_d = res.groups) !== null && _d !== void 0 ? _d : (res.groups = {});
            res.groups.EndType = 'Unseal';
            return res;
        }
    }
}
EmulatorCommon.sealRegexes = LocaleNetRegex.areaSeal;
EmulatorCommon.engageRegexes = LocaleNetRegex.countdownEngage;
EmulatorCommon.countdownRegexes = LocaleNetRegex.countdownStart;
EmulatorCommon.unsealRegexes = LocaleNetRegex.areaUnseal;
EmulatorCommon.wipeRegex = NetRegexes.network6d({ command: '40000010' });
EmulatorCommon.winRegex = NetRegexes.network6d({ command: '40000003' });
EmulatorCommon.cactbotWipeRegex = NetRegexes.echo({ line: 'cactbot wipe.*?' });

;// CONCATENATED MODULE: ./resources/not_reached.ts
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
                throw new UnreachableCode();
            const state = this.states[stateTimestamp];
            if (!state)
                throw new UnreachableCode();
            this.states[timestamp] = state.partialClone(props);
        }
        else {
            const state = this.states[timestamp];
            if (!state)
                throw new UnreachableCode();
            this.states[timestamp] = state.partialClone(props);
        }
        this.latestTimestamp = Math.max(this.latestTimestamp, timestamp);
        const lastSignificantStateTimestamp = this.significantStates[this.significantStates.length - 1];
        if (!lastSignificantStateTimestamp)
            throw new UnreachableCode();
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
            throw new UnreachableCode();
        if (timestamp < initialTimestamp)
            return this.getStateByIndex(0);
        let i = 0;
        for (; i < this.significantStates.length; ++i) {
            const prevTimestamp = this.significantStates[i];
            if (prevTimestamp === undefined)
                throw new UnreachableCode();
            if (prevTimestamp > timestamp)
                return this.getStateByIndex(i - 1);
        }
        return this.getStateByIndex(i - 1);
    }
    // Should only be called when `index` is valid.
    getStateByIndex(index) {
        const stateIndex = this.significantStates[index];
        if (stateIndex === undefined)
            throw new UnreachableCode();
        const state = this.states[stateIndex];
        if (state === undefined)
            throw new UnreachableCode();
        return state;
    }
}

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/CombatantJobSearch.ts
class CombatantJobSearch {
    static getJob(abilityId) {
        for (const [key, value] of Object.entries(CombatantJobSearch.abilities)) {
            if (value === null || value === void 0 ? void 0 : value.includes(abilityId))
                return key;
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
        this.hexEvent = EmulatorCommon.zeroPad(this.decEvent.toString(16).toUpperCase());
        this.timestamp = new Date((_b = parts[fields.timestamp]) !== null && _b !== void 0 ? _b : '0').getTime();
        this.checksum = (_c = parts.slice(-1)[0]) !== null && _c !== void 0 ? _c : '';
        repo.updateTimestamp(this.timestamp);
        this.convertedLine = this.prefix() + (parts.join(':')).replace('|', ':');
    }
    prefix() {
        return '[' + EmulatorCommon.timeToTimeString(this.timestamp, true) + '] ' + this.hexEvent + ':';
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
        damage = EmulatorCommon.zeroPad(damage, 8);
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

;// CONCATENATED MODULE: ./ui/raidboss/emulator/EventBus.ts
/**
 * This is a base class that classes can extend to inherit event bus capabilities.
 * This allows other classes to listen for events with the `on` function.
 * The inheriting class can fire those events with the `dispatch` function.
 */
class EventBus {
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
class LineEvent0x01 extends LineEvent {
    constructor(repo, networkLine, parts) {
        var _a, _b;
        super(repo, networkLine, parts);
        this.zoneId = (_a = parts[LineEvent0x01_fields.zoneId]) !== null && _a !== void 0 ? _a : '';
        this.zoneName = (_b = parts[LineEvent0x01_fields.zoneName]) !== null && _b !== void 0 ? _b : '';
        this.zoneNameProperCase = EmulatorCommon.properCase(this.zoneName);
        this.convertedLine = this.prefix() +
            'Changed Zone to ' + this.zoneName + '.';
        this.properCaseConvertedLine = this.prefix() +
            'Changed Zone to ' + this.zoneNameProperCase + '.';
    }
}
class LineEvent01 extends LineEvent0x01 {
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

;// CONCATENATED MODULE: ./resources/util.ts
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
/* harmony default export */ const util = (Util);

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
        this.job = util.jobEnumToJob(this.jobId);
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
            EmulatorCommon.zeroPad(this.npcBaseId, 8 + Math.max(0, 6 - this.npcNameId.length));
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
            ':' + EmulatorCommon.properCase(this.name) +
            ' starts using ' + this.abilityName +
            ' on ' + EmulatorCommon.properCase(target) + '.';
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
            ' Tick on ' + EmulatorCommon.properCase(resolvedName) +
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
        this.properCaseConvertedLine = this.prefix() + EmulatorCommon.properCase(defeatedName) +
            ' was defeated by ' + EmulatorCommon.properCase(killerName) + '.';
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
            ':' + EmulatorCommon.properCase(this.targetName) +
            ' gains the effect of ' + this.abilityName +
            ' from ' + EmulatorCommon.properCase(this.fallbackResolvedTargetName) +
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
            ':' + EmulatorCommon.properCase(this.targetName) +
            ' loses the effect of ' + this.abilityName +
            ' from ' + EmulatorCommon.properCase(this.fallbackResolvedTargetName) +
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
        this.dataBytes1 = EmulatorCommon.zeroPad((_c = parts[LineEvent0x1F_fields.dataBytes1]) !== null && _c !== void 0 ? _c : '');
        this.dataBytes2 = EmulatorCommon.zeroPad((_d = parts[LineEvent0x1F_fields.dataBytes2]) !== null && _d !== void 0 ? _d : '');
        this.dataBytes3 = EmulatorCommon.zeroPad((_e = parts[LineEvent0x1F_fields.dataBytes3]) !== null && _e !== void 0 ? _e : '');
        this.dataBytes4 = EmulatorCommon.zeroPad((_f = parts[LineEvent0x1F_fields.dataBytes4]) !== null && _f !== void 0 ? _f : '');
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
            this.id + ':' + (EmulatorCommon.properCase(this.name)) +
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
        const padded = EmulatorCommon.zeroPad(this.jobLevelData, 8);
        this.jobIdHex = padded.substr(6, 2).toUpperCase();
        this.jobId = parseInt(this.jobIdHex, 16);
        this.job = util.jobEnumToJob(this.jobId);
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
class NetworkLogConverter extends EventBus {
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
            throw new UnreachableCode();
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
                throw new UnreachableCode();
            let res = EmulatorCommon.matchStart(line.networkLine);
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
                res = EmulatorCommon.matchEnd(line.networkLine);
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

;// CONCATENATED MODULE: ./ui/raidboss/emulator/data/LogEventHandler.ts



class LogEventHandler extends EventBus {
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

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[1].use!./ui/raidboss/emulator/data/NetworkLogConverterWorker.js






onmessage = async msg => {
  const logConverter = new NetworkLogConverter();
  const localLogHandler = new LogEventHandler();
  const repo = new LogRepository(); // Listen for LogEventHandler to dispatch fights and persist them

  localLogHandler.on('fight', async (day, zoneId, zoneName, lines) => {
    const enc = new Encounter(day, zoneId, zoneName, lines);
    enc.initialize();

    if (enc.shouldPersistFight()) {
      postMessage({
        type: 'encounter',
        encounter: enc,
        name: enc.combatantTracker.getMainCombatantName()
      });
    }
  }); // Convert the message manually due to memory issues with extremely large files

  const decoder = new TextDecoder('UTF-8');
  let buf = new Uint8Array(msg.data);
  let nextOffset = 0;
  let lines = [];
  let lineCount = 0;

  for (let currentOffset = nextOffset; nextOffset < buf.length && nextOffset !== -1; currentOffset = nextOffset) {
    nextOffset = buf.indexOf(0x0A, nextOffset + 1);
    const line = decoder.decode(buf.slice(currentOffset, nextOffset)).trim();

    if (line.length) {
      ++lineCount;
      lines.push(line);
    }

    if (lines.length >= 1000) {
      lines = logConverter.convertLines(lines, repo);
      localLogHandler.parseLogs(lines);
      postMessage({
        type: 'progress',
        lines: lineCount,
        bytes: nextOffset,
        totalBytes: buf.length
      });
      lines = [];
    }
  }

  if (lines.length > 0) {
    lines = logConverter.convertLines(lines, repo);
    localLogHandler.parseLogs(lines);
    lines = [];
  }

  postMessage({
    type: 'progress',
    lines: lineCount,
    bytes: buf.length,
    totalBytes: buf.length
  });
  buf = null;
  localLogHandler.endFight();
  postMessage({
    type: 'done'
  });
};
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWN0Ym90Ly4vcmVzb3VyY2VzL3JlZ2V4ZXMudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3Jlc291cmNlcy9uZXRyZWdleGVzLnRzIiwid2VicGFjazovL2NhY3Rib3QvLi9yZXNvdXJjZXMvdHJhbnNsYXRpb25zLnRzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9yYWlkYm9zcy9lbXVsYXRvci9FbXVsYXRvckNvbW1vbi50cyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vcmVzb3VyY2VzL25vdF9yZWFjaGVkLnRzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9yYWlkYm9zcy9lbXVsYXRvci9kYXRhL0NvbWJhdGFudC50cyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvcmFpZGJvc3MvZW11bGF0b3IvZGF0YS9Db21iYXRhbnRKb2JTZWFyY2gudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvQ29tYmF0YW50U3RhdGUudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3Jlc291cmNlcy9wZXRfbmFtZXMudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudC50cyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvcmFpZGJvc3MvZW11bGF0b3IvZGF0YS9Db21iYXRhbnRUcmFja2VyLnRzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9yYWlkYm9zcy9lbXVsYXRvci9kYXRhL25ldHdvcmtfbG9nX2NvbnZlcnRlci9Mb2dSZXBvc2l0b3J5LnRzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9yYWlkYm9zcy9lbXVsYXRvci9FdmVudEJ1cy50cyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvcmFpZGJvc3MvZW11bGF0b3IvZGF0YS9uZXR3b3JrX2xvZ19jb252ZXJ0ZXIvTGluZUV2ZW50MHgwMC50cyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvcmFpZGJvc3MvZW11bGF0b3IvZGF0YS9uZXR3b3JrX2xvZ19jb252ZXJ0ZXIvTGluZUV2ZW50MHgwMS50cyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvcmFpZGJvc3MvZW11bGF0b3IvZGF0YS9uZXR3b3JrX2xvZ19jb252ZXJ0ZXIvTGluZUV2ZW50MHgwMi50cyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vcmVzb3VyY2VzL3V0aWwudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MDMudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MDQudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MEMudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MTQudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MTUudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MTYudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MTcudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MTgudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MTkudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MUEudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MUIudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MUMudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MUQudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MUUudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MUYudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MjIudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MjMudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MjQudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MjUudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MjYudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudDB4MjcudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvbmV0d29ya19sb2dfY29udmVydGVyL1BhcnNlTGluZS50cyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvcmFpZGJvc3MvZW11bGF0b3IvZGF0YS9OZXR3b3JrTG9nQ29udmVydGVyLnRzIiwid2VicGFjazovL2NhY3Rib3QvLi9yZXNvdXJjZXMvbGFuZ3VhZ2VzLnRzIiwid2VicGFjazovL2NhY3Rib3QvLi91aS9yYWlkYm9zcy9lbXVsYXRvci9kYXRhL0VuY291bnRlci50cyIsIndlYnBhY2s6Ly9jYWN0Ym90Ly4vdWkvcmFpZGJvc3MvZW11bGF0b3IvZGF0YS9Mb2dFdmVudEhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vY2FjdGJvdC8uL3VpL3JhaWRib3NzL2VtdWxhdG9yL2RhdGEvTmV0d29ya0xvZ0NvbnZlcnRlcldvcmtlci5qcyJdLCJuYW1lcyI6WyJvbm1lc3NhZ2UiLCJtc2ciLCJsb2dDb252ZXJ0ZXIiLCJOZXR3b3JrTG9nQ29udmVydGVyIiwibG9jYWxMb2dIYW5kbGVyIiwiTG9nRXZlbnRIYW5kbGVyIiwicmVwbyIsIkxvZ1JlcG9zaXRvcnkiLCJvbiIsImRheSIsInpvbmVJZCIsInpvbmVOYW1lIiwibGluZXMiLCJlbmMiLCJFbmNvdW50ZXIiLCJpbml0aWFsaXplIiwic2hvdWxkUGVyc2lzdEZpZ2h0IiwicG9zdE1lc3NhZ2UiLCJ0eXBlIiwiZW5jb3VudGVyIiwibmFtZSIsImNvbWJhdGFudFRyYWNrZXIiLCJnZXRNYWluQ29tYmF0YW50TmFtZSIsImRlY29kZXIiLCJUZXh0RGVjb2RlciIsImJ1ZiIsIlVpbnQ4QXJyYXkiLCJkYXRhIiwibmV4dE9mZnNldCIsImxpbmVDb3VudCIsImN1cnJlbnRPZmZzZXQiLCJsZW5ndGgiLCJpbmRleE9mIiwibGluZSIsImRlY29kZSIsInNsaWNlIiwidHJpbSIsInB1c2giLCJjb252ZXJ0TGluZXMiLCJwYXJzZUxvZ3MiLCJieXRlcyIsInRvdGFsQnl0ZXMiLCJlbmRGaWdodCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFVQSxNQUFNLGlCQUFpQixHQUFHLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQVUsQ0FBQztBQUNqRyxNQUFNLGFBQWEsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQVUsQ0FBQztBQUNySCxNQUFNLGlCQUFpQixHQUFHO0lBQ3hCLFdBQVc7SUFDWCxVQUFVO0lBQ1YsUUFBUTtJQUNSLElBQUk7SUFDSixTQUFTO0lBQ1QsVUFBVTtJQUNWLFFBQVE7SUFDUixPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFFBQVE7SUFDUixRQUFRO0lBQ1IsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsVUFBVTtJQUNWLGFBQWE7SUFDYixVQUFVO0lBQ1YsYUFBYTtJQUNiLFNBQVM7SUFDVCxTQUFTO0lBQ1QsU0FBUztJQUNULGVBQWU7SUFDZixJQUFJO0lBQ0osT0FBTztJQUNQLElBQUk7SUFDSixPQUFPO0lBQ1AsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsU0FBUztJQUNULFNBQVM7Q0FDRCxDQUFDO0FBQ1gs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a0IsQ0FBQyxHQUFHLEdBQUc7WUFDbkUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRztZQUNuRSxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsR0FBRyxHQUFHO1lBQzVFLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUc7WUFDakUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRztZQUMvRCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHO1lBQy9ELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUc7WUFDL0QsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRztZQUMvRCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHO1lBQy9ELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUc7WUFDL0QsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRztZQUMvRCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHO1lBQy9ELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUc7WUFDL0QsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRztZQUMvRCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHO1lBQy9ELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUc7WUFDakUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRztZQUNqRSxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHO1lBQ2pFLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUc7WUFDakUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRztZQUNqRSxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsR0FBRztZQUMzRixPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsR0FBRztZQUNqRyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsR0FBRztZQUMzRixPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsR0FBRztZQUNqRyxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsR0FBRyxZQUFZO1lBQ25ELE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxHQUFHLGdCQUFnQjtZQUN2RCxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsR0FBRztZQUN6RixPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsR0FBRztZQUN6RixPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsR0FBRztZQUN6RixPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsR0FBRztZQUNyRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxZQUFZLENBQUMsR0FBRyxHQUFHO1lBQzdELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxHQUFHLEdBQUc7WUFDbkUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLEdBQUcsR0FBRztZQUM3RCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsR0FBRyxHQUFHO1lBQ25FLGFBQWEsR0FBRyxZQUFZO1lBQzVCLGFBQWEsR0FBRyxnQkFBZ0I7WUFDaEMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEdBQUcsR0FBRztZQUMzRCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxHQUFHO1lBQzNELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLEdBQUc7WUFDM0QsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLEdBQUcsR0FBRztZQUN2RSxNQUFNLENBQUMsQ0FBQyxxQkFBcUI7UUFDL0IsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQTRCO1FBQzVDLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVztZQUMxQixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1QsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDMUQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixDQUFDO1lBQ3RFLE1BQU07WUFDTixPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsR0FBRyxHQUFHO1lBQzVFLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxHQUFHLGFBQWE7WUFDM0UsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzFELE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsd0JBQXdCO0lBQ3hCLDJGQUEyRjtJQUMzRixNQUFNLENBQUMsY0FBYyxDQUFDLENBQWdDO1FBQ3BELElBQUksT0FBTyxDQUFDLEtBQUssV0FBVztZQUMxQixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1QsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNsRSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLENBQUM7WUFDdEUsd0NBQXdDO1lBQ3hDLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUMvRCxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxrQkFBa0IsQ0FDckIsQ0FBb0M7UUFFdEMsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXO1lBQzFCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDVCxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxvQkFBb0IsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQztZQUN0RSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDO1lBQ25FLHVCQUF1QixHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztZQUNqRixjQUFjLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDO1lBQ3RFLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7WUFDdEUsV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUk7WUFDeEUsYUFBYTtZQUNiLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLEdBQUc7WUFDM0QsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEdBQUcsR0FBRztZQUMzRCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxLQUFLO1lBQzdELFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDbEYsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBbUM7UUFDMUQsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXO1lBQzFCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDVCxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxtQkFBbUIsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQztZQUN0RSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQztZQUM3RCxzQkFBc0I7WUFDdEIsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsS0FBSztZQUM1RCxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLEdBQUcsSUFBSTtZQUMxRSxPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWE7Z0JBQzlCLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLEdBQUc7Z0JBQzNELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLEdBQUc7Z0JBQzNELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBR0QsOERBQThEO0lBQzlELDBGQUEwRjtJQUMxRixNQUFNLENBQUMsV0FBVyxDQUFDLENBQTZCO1FBQzlDLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVztZQUMxQixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1QsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDNUQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixDQUFDO1lBQ3RFLE1BQU07WUFDTixPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsR0FBRyxHQUFHO1lBQzVFLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztZQUN4RCx1QkFBdUI7WUFDdkIsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO1lBQ3hELFFBQVE7WUFDUixPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7WUFDeEQsT0FBTztZQUNQLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQztZQUNuRSxhQUFhLENBQUM7UUFDaEIsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxvQkFBb0IsQ0FDdkIsQ0FBc0M7UUFFeEMsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXO1lBQzFCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDVCxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxzQkFBc0IsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRW5ELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUV0QixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLENBQUM7WUFDdEUsTUFBTTtZQUNOLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxHQUFHLEdBQUc7WUFDNUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRztZQUNqRSxlQUFlLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLEdBQUcsR0FBRztZQUNwRixPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxZQUFZLENBQUMsR0FBRyxHQUFHO1lBQzdELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxHQUFHLEdBQUc7WUFDbkUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLEdBQUcsR0FBRztZQUM3RCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsR0FBRyxHQUFHO1lBQ25FLE1BQU0sR0FBRyxTQUFTO1lBQ2xCLE1BQU0sR0FBRyxtQkFBbUI7WUFDNUIsK0JBQStCO1lBQy9CLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxHQUFHO1lBQzdFLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxHQUFHO1lBQzdFLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxHQUFHO1lBQzdFLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxHQUFHO1lBQ3pGLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUc7WUFDL0QsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRztZQUMvRCx3REFBd0Q7WUFDeEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDakYsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDakYsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNwRixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUdEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBNkI7UUFDOUMsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXO1lBQzFCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDVCxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUM1RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLENBQUM7WUFDdEUsTUFBTTtZQUNOLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxHQUFHLEdBQUc7WUFDNUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO1lBQ3hELHVCQUF1QjtZQUN2QixPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7WUFDeEQsUUFBUTtZQUNSLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNuRSxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUdEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBd0I7UUFDcEMsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXO1lBQzFCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDVCxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDbEQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixDQUFDO1lBQ3RFLE1BQU07WUFDTixPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsR0FBRyxHQUFHO1lBQzVFLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUc7WUFDakUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEdBQUcsR0FBRztZQUM1RSxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7WUFDM0QsYUFBYTtZQUNiLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUMxRCxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUdEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQTZCO1FBQzlDLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVztZQUMxQixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1QsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDNUQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixDQUFDO1lBQ3RFLE1BQU07WUFDTixPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7WUFDeEQsbUJBQW1CO1lBQ25CLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNuRSxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUdEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBdUI7UUFDbEMsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXO1lBQzFCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDVCxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDaEQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixDQUFDO1lBQ3RFLE1BQU07WUFDTixPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7WUFDcEQsU0FBUztZQUNULE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUMxRCxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUdEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXO1lBQzFCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDVCxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDOUMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3JCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSTtZQUNaLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNsQixJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHRDs7O09BR0c7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQXdCO1FBQ3BDLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVztZQUMxQixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1QsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2xELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQztZQUN0RSxNQUFNO1lBQ04sT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUc7WUFDbkQsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsR0FBRztZQUMxRCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDNUQsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQXlCO1FBQ3RDLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVztZQUMxQixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1QsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUNyQixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUk7WUFDWixPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU87WUFDbEIsSUFBSSxFQUFFLE1BQU07U0FDYixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUF5QjtRQUN0QyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFdBQVc7WUFDMUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNULE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLENBQUM7WUFDdEUsTUFBTTtZQUNOLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUc7WUFDM0QsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzVELE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBR0Q7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQTZCO1FBQzlDLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVztZQUMxQixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1QsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDNUQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixDQUFDO1lBQ3RFLE1BQU07WUFDTixPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHO1lBQzNELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEdBQUc7WUFDNUQsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzVELE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQTRCO1FBQzVDLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVztZQUMxQixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1QsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDMUQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixDQUFDO1lBQ3RFLG9CQUFvQjtZQUNwQixPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHO1lBQ3pELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUc7WUFDbkUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRztZQUNyRSxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHO1lBQ25FLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUc7WUFDM0UsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRztZQUMzRCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHO1lBQzdELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUc7WUFDekUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRztZQUNyRSxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHO1lBQ3pFLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHO1lBQ3ZGLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHO1lBQ25GLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUc7WUFDN0UsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRztZQUN2RSxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUM7WUFDakUsS0FBSztZQUNMLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUE0QjtRQUM1QyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFdBQVc7WUFDMUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNULE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzFELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQztZQUN0RSxzQkFBc0I7WUFDdEIsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQy9ELE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUEyQjtRQUMxQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFdBQVc7WUFDMUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNULE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUN4RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLENBQUM7WUFDdEUsTUFBTTtZQUNOLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUc7WUFDbEUsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEdBQUcsR0FBRztZQUNoRSxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxHQUFHO1lBQzVELE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUc7WUFDNUQsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsR0FBRztZQUM1RCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDL0QsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxZQUFZLENBQ2YsT0FBZ0IsRUFDaEIsSUFBWSxFQUNaLEtBQW9DLEVBQ3BDLFlBQXFCO1FBRXZCLElBQUksQ0FBQyxLQUFLO1lBQ1IsS0FBSyxHQUFHLFlBQVksQ0FBQztRQUN2QixLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUEyQixDQUFDLENBQUM7UUFDbkQsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDN0QsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBVztRQUN6QixPQUFPLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVELDBFQUEwRTtJQUMxRSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQVksRUFBRSxLQUFhO1FBQzdDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7WUFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLGlCQUFpQixDQUFDLENBQUM7UUFDaEQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztRQUVoRCxPQUFPLEtBQUssR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFnQztRQUM5QyxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQXdCLEVBQVUsRUFBRTtZQUN0RCxPQUFPLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxZQUFZLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDN0YsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxLQUFLLEdBQXNCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2IsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNkLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztnQkFFbEIsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNkO2FBQU07WUFDTCxnREFBZ0Q7WUFDaEQsS0FBSyxHQUFHLElBQWdCLENBQUM7U0FDMUI7UUFDRCxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUE2QjtRQUN4QyxNQUFNLGtCQUFrQixHQUFHO1lBQ3pCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFlBQVksRUFBRSxPQUFPO1lBQ3JCLFFBQVEsRUFBRSxjQUFjO1lBQ3hCLE9BQU8sRUFBRSxnQkFBZ0I7WUFDekIsV0FBVyxFQUFFLGtCQUFrQjtZQUMvQixRQUFRLEVBQUUsYUFBYTtZQUN2QixzRUFBc0U7WUFDdEUseUNBQXlDO1lBQ3pDLElBQUksRUFBRSwrQkFBK0I7WUFDckMsbUhBQW1IO1lBQ25ILEtBQUssRUFBRSx1Q0FBdUM7U0FDL0MsQ0FBQztRQUVGLCtDQUErQztRQUMvQyxvRUFBb0U7UUFDcEUsc0VBQXNFO1FBQ3RFLDhEQUE4RDtRQUM5RCxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUM7UUFDcEIsSUFBSSxZQUFZLFlBQVksTUFBTSxFQUFFO1lBQ2xDLFNBQVMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUMvQixDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEQsWUFBWSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7U0FDcEM7UUFDRCxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDcEUsT0FBTyxrQkFBa0IsQ0FBQyxLQUF3QyxDQUFDLElBQUksS0FBSyxDQUFDO1FBQy9FLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQTZCO1FBQzlDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksWUFBWSxZQUFZLE1BQU07WUFDaEMsU0FBUyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBZTtRQUNwQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxXQUFXO1lBQ2hDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxNQUFNLENBQUMsY0FBYyxDQUNqQixDQUFxQyxFQUNyQyxRQUFnQixFQUNoQixNQUEwQjtRQUU1QixJQUFJLENBQUMsS0FBSyxJQUFJO1lBQ1osT0FBTztRQUNULElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtZQUN2QixPQUFPO1FBQ1QsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtZQUNwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsUUFBUSx3QkFBd0IsR0FBRyxNQUFNO29CQUN4RCxpQkFBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDaEQ7U0FDRjtJQUNILENBQUM7Q0FDRjs7O0FDeHZCMkM7QUFTNUMsNEJBQTRCO0FBQzVCLHlCQUF5QjtBQUN6QixvRUFBb0U7QUFDcEUsNEVBQTRFO0FBRTVFLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN4QixNQUFNLFlBQVksR0FBRyxPQUFPLENBQUM7QUFFN0IsTUFBTSw0QkFBaUIsR0FBRyxpREFBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFVLEdBQUM7QUFDMUgsTUFBTSx3QkFBYSxHQUFHLGlEQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFVLEdBQUM7QUFDN0YsTUFBTSw0QkFBaUIsR0FBRyxpREFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxTQUFTLENBQVUsR0FBQztBQUNoTCxNQUFNLDJCQUFnQixHQUFHLGlEQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFVLEdBQUM7QUFDL0QsTUFBTSwrQkFBb0IsR0FBRyxpREFBQyxJQUFJLEVBQUUsTUFBTSxDQUFVLEdBQUM7QUFDckQsTUFBTSxtQ0FBd0IsR0FBRyxpREFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFVLEdBQUM7QUFDcEssTUFBTSxrQ0FBdUIsR0FBRyxpREFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBVSxHQUFDO0FBQzlELE1BQU0sNEJBQWlCLEdBQUcsaURBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBVSxHQUFDO0FBQzNILE1BQU0scUNBQTBCLEdBQUcsaURBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFVLEdBQUM7QUFDekosTUFBTSw0QkFBaUIsR0FBRyxpREFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQVUsR0FBQztBQUMvRyxNQUFNLHVCQUFZLEdBQUcsaURBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBVSxHQUFDO0FBQ2pGLE1BQU0sNEJBQWlCLEdBQUcsaURBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFVLEdBQUM7QUFDaEYsTUFBTSxxQkFBVSxHQUFHLGlEQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFVLEdBQUM7QUFDckQsTUFBTSx1QkFBWSxHQUFHLGlEQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFVLEdBQUM7QUFDdkQsTUFBTSx3QkFBYSxHQUFHLGlEQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFVLEdBQUM7QUFDeEQsTUFBTSx3QkFBYSxHQUFHLGlEQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFVLEdBQUM7QUFDeEQsTUFBTSw0QkFBaUIsR0FBRyxpREFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBVSxHQUFDO0FBQzVELE1BQU0sMkJBQWdCLEdBQUcsaURBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBVSxHQUFDO0FBQzlQLE1BQU0sMkJBQWdCLEdBQUcsaURBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBVSxHQUFDO0FBQ2pELE1BQU0sMEJBQWUsR0FBRyxpREFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBVSxHQUFDO0FBQzdGLE1BQU0sZ0JBQWdCLEdBQUcsaURBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQVUsR0FBQztBQXdCM0QsbUVBQW1FO0FBQ25FLHdFQUF3RTtBQUN4RSxxRUFBcUU7QUFDckUsaUVBQWlFO0FBQ2pFLHVEQUF1RDtBQUN2RCxNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQztBQUNwQyxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQztBQUNqQyxNQUFNLDBCQUEwQixHQUFHO0lBQ2pDLFNBQVM7SUFDVCxNQUFNO0lBQ04sUUFBUTtJQUNSLFFBQVE7SUFDUixNQUFNO0NBQ1AsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFHLENBQ2hCLE1BQTZELEVBQzdELFFBQWdCLEVBQ2hCLE1BQStCLEVBQ3pCLEVBQUU7O0lBQ1YsTUFBTSxHQUFHLE1BQU0sYUFBTixNQUFNLGNBQU4sTUFBTSxHQUFJLEVBQUUsQ0FBQztJQUN0QixNQUFNLFdBQVcsR0FBYSxFQUFFLENBQUM7SUFDakMsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3pDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUTtZQUMzQixTQUFTO1FBQ1gsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDL0I7SUFDRCxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUV0RSwwRUFBMEU7SUFDMUUsTUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFJLE9BQU8sRUFBRTtRQUNYLE1BQU0sR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztLQUMxQztTQUFNO1FBQ0wsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNYLEtBQUssTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFO1lBQzNCLE1BQU0sS0FBSyxTQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQUksRUFBRSxDQUFDO1lBQ2hDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUTtnQkFDM0IsU0FBUztZQUNYLE1BQU0sU0FBUyxTQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsMENBQUUsS0FBSyxDQUFDO1lBQ3JDLElBQUksU0FBUyxJQUFJLFNBQVMsSUFBSSxNQUFNO2dCQUNsQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1NBQ2hCO0tBQ0Y7SUFFRCxvRUFBb0U7SUFDcEUsa0VBQWtFO0lBQ2xFLGtFQUFrRTtJQUNsRSx1RUFBdUU7SUFDdkUsbUVBQW1FO0lBQ25FLG9EQUFvRDtJQUNwRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsMEJBQTBCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUYsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsc0JBQXNCLElBQUksV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFdEYsbUNBQW1DO0lBQ25DLElBQUksR0FBRyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQzNELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxFQUFFO1FBQ3pCLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixrQkFBa0I7UUFDbEIsTUFBTSxhQUFhLEdBQUcsR0FBRyxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDeEMsSUFBSSxhQUFhLEtBQUssQ0FBQztZQUNyQixHQUFHLElBQUksZUFBZSxDQUFDO2FBQ3BCLElBQUksYUFBYSxHQUFHLENBQUM7WUFDeEIsR0FBRyxJQUFJLGlCQUFpQixhQUFhLEdBQUcsQ0FBQztRQUMzQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBRWQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUTtZQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsUUFBUSxvQkFBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFMUUsTUFBTSxTQUFTLFNBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQ0FBRSxLQUFLLENBQUM7UUFDckMsTUFBTSxVQUFVLHFCQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsMENBQUUsS0FBSywwQ0FBRSxRQUFRLHFDQUFNLFlBQVksQ0FBQztRQUVsRSxJQUFJLFNBQVMsRUFBRTtZQUNiLEdBQUcsSUFBSSxvQkFBb0I7WUFDdkIsMENBQTBDO1lBQzFDLDBDQUEwQztZQUMxQyxPQUFPLEVBQUUsU0FBUyxFQUFHLE1BQWtDLENBQUMsU0FBUyxDQUFDLEVBQUUsVUFBVSxDQUFDO2dCQUNqRixTQUFTLENBQUM7U0FDYjthQUFNO1lBQ0wsR0FBRyxJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUM7U0FDL0I7UUFHRCxrRUFBa0U7UUFDbEUsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLGFBQU4sTUFBTSxjQUFOLE1BQU0sR0FBSSxDQUFXLENBQUM7WUFDaEMsTUFBTTtLQUNUO0lBQ0QsT0FBTyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsQ0FBQyxDQUFDO0FBRWEsTUFBTSxVQUFVO0lBRTdCLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxLQUFjO1FBQzdDLFVBQVUsQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUM7SUFDNUMsQ0FBQztJQUNELE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxLQUFzQjtRQUN2RCxvRUFBb0U7UUFDcEUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNsRCxNQUFNLEdBQUcsR0FBRyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM3RCxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFrQztRQUNuRCxPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFO1lBQ3hDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNqQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3pCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN0QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ2xCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUN4QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQ3RCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7U0FDekIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUdEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBOEI7UUFDM0MsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRTtZQUNwQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDcEMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUN6QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDdEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNsQixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtTQUN2QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFrQztRQUNuRCxPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFO1lBQ3hDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUNwQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3pCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN0QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ2xCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUN4QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQ3RCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDckIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN0QixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUU7WUFDaEMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUM1QixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO1lBQ2xCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7WUFDbEIsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtZQUNsQixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1NBQ3pCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBaUM7UUFDakQsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRTtZQUN2QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDakMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUN6QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDdEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0Q7O09BRUc7SUFDSCxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQXFDO1FBQ3pELE9BQU8sV0FBVyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRTtZQUMzQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDakMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUN6QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ2xCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUdEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLGtCQUFrQixDQUNyQixNQUF5QztRQUUzQyxPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLEVBQUU7WUFDL0MsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ2pDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDekIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNsQixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3BCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDbkIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUNyQixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDckIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUN6QixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQzFCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDMUIsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNuQixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO1lBQ2xCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7WUFDbEIsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtZQUNsQixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1NBQ3pCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxpQkFBaUIsQ0FDcEIsTUFBd0M7UUFFMUMsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLG1CQUFtQixFQUFFO1lBQzlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNqQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3pCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDbEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUNwQixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1NBQ3BCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBa0M7UUFDbkQsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRTtZQUN4QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDakMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUN6QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDdEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUN4QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDdEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUN4QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQ3RCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7U0FDdEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUdEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxvQkFBb0IsQ0FDdkIsTUFBMkM7UUFFN0MsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLHNCQUFzQixFQUFFO1lBQ2pELENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNqQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3pCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN0QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ2xCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDckIsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtZQUNsQixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO1lBQ2xCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7WUFDbEIsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUN4QixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3RCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDdEIsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUN0QixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3RCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7U0FDdkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUdEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFrQztRQUNuRCxPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFO1lBQ3hDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNqQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3pCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN0QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDdEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUN4QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQ3RCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7U0FDdEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUdEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUE2QjtRQUN6QyxPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO1lBQ25DLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNqQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3pCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN0QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDdEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFrQztRQUNuRCxPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFO1lBQ3hDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNqQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3pCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN0QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7U0FDdkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUdEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUEyQjtRQUNyQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVc7WUFDL0IsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNkLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDakcsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDckIsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFHRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBNkI7UUFDekMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXO1lBQy9CLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDZCxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ25HLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLE9BQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBR0Q7O09BRUc7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQThCO1FBQzNDLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVztZQUMvQixNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2Qsc0JBQXNCLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNwRyxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztRQUNyQixPQUFPLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUdEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBOEI7UUFDM0MsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRTtZQUNwQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDakMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUN6QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3BCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDcEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtTQUNyQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0Q7O09BRUc7SUFDSCxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQWtDO1FBQ25ELDJCQUEyQjtRQUMzQixPQUFPLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUdEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFpQztRQUNqRCxPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFO1lBQ3ZDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNqQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3pCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDbkIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUN4QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3pCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRTtZQUM1QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3BCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDckIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUMzQixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQzFCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDNUIsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLG9CQUFvQixFQUFFO1lBQ25DLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtZQUNqQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFO1lBQzlCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDM0IsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUMzQixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO1NBQzFCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBaUM7UUFDakQsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRTtZQUN2QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDakMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUN6QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ2xCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUdEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFnQztRQUMvQyxPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFO1lBQ3RDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNqQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3pCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUN2QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3JCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDckIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUNyQixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO1NBQ3RCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBaUM7UUFDakQsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRTtZQUN2QyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDakMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUN6QixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ2xCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDcEIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtTQUN2QixDQUFDLENBQUM7SUFDTCxDQUFDOztBQTlXTSxpQ0FBc0IsR0FBRyxLQUFLLENBQUM7OztBQzVKUjtBQUNNO0FBRXRDLDBGQUEwRjtBQUMxRixNQUFNLFdBQVcsR0FBRztJQUNsQixjQUFjLEVBQUU7UUFDZCxFQUFFLEVBQUUsd0VBQXdFO1FBQzVFLEVBQUUsRUFBRSx5RUFBeUU7UUFDN0UsRUFBRSxFQUFFLDZFQUE2RTtRQUNqRixFQUFFLEVBQUUsa0RBQWtEO1FBQ3RELEVBQUUsRUFBRSxnREFBZ0Q7UUFDcEQsRUFBRSxFQUFFLG9EQUFvRDtLQUN6RDtJQUNELGVBQWUsRUFBRTtRQUNmLEVBQUUsRUFBRSxTQUFTO1FBQ2IsRUFBRSxFQUFFLFFBQVE7UUFDWixFQUFFLEVBQUUsbUJBQW1CO1FBQ3ZCLEVBQUUsRUFBRSxPQUFPO1FBQ1gsRUFBRSxFQUFFLE9BQU87UUFDWCxFQUFFLEVBQUUsUUFBUTtLQUNiO0lBQ0QsZUFBZSxFQUFFO1FBQ2YsRUFBRSxFQUFFLDRDQUE0QztRQUNoRCxFQUFFLEVBQUUsb0RBQW9EO1FBQ3hELEVBQUUsRUFBRSxzRUFBc0U7UUFDMUUsRUFBRSxFQUFFLDhDQUE4QztRQUNsRCxFQUFFLEVBQUUsaUNBQWlDO1FBQ3JDLEVBQUUsRUFBRSx3Q0FBd0M7S0FDN0M7SUFDRCxRQUFRLEVBQUU7UUFDUixFQUFFLEVBQUUsaUVBQWlFO1FBQ3JFLEVBQUUsRUFBRSxtRUFBbUU7UUFDdkUsRUFBRSxFQUFFLGlFQUFpRTtRQUNyRSxFQUFFLEVBQUUseUNBQXlDO1FBQzdDLEVBQUUsRUFBRSx3Q0FBd0M7UUFDNUMsRUFBRSxFQUFFLG9EQUFvRDtLQUN6RDtJQUNELFVBQVUsRUFBRTtRQUNWLEVBQUUsRUFBRSxtQ0FBbUM7UUFDdkMsRUFBRSxFQUFFLGtDQUFrQztRQUN0QyxFQUFFLEVBQUUsNkJBQTZCO1FBQ2pDLEVBQUUsRUFBRSx3QkFBd0I7UUFDNUIsRUFBRSxFQUFFLG9CQUFvQjtRQUN4QixFQUFFLEVBQUUsOEJBQThCO0tBQ25DO0lBQ0QsdUNBQXVDO0lBQ3ZDLG9CQUFvQjtJQUNwQixhQUFhLEVBQUU7UUFDYixFQUFFLEVBQUUscUVBQXFFO1FBQ3pFLEVBQUUsRUFBRSx5R0FBeUc7UUFDN0csRUFBRSxFQUFFLDBFQUEwRTtRQUM5RSxFQUFFLEVBQUUscUVBQXFFO1FBQ3pFLEVBQUUsRUFBRSxrRUFBa0U7UUFDdEUsRUFBRSxFQUFFLHFEQUFxRDtLQUMxRDtJQUNELGtCQUFrQixFQUFFO1FBQ2xCLEVBQUUsRUFBRSxxREFBcUQ7UUFDekQsRUFBRSxFQUFFLGtFQUFrRTtRQUN0RSxFQUFFLEVBQUUsdUVBQXVFO1FBQzNFLEVBQUUsRUFBRSxxREFBcUQ7UUFDekQsRUFBRSxFQUFFLGdEQUFnRDtRQUNwRCxFQUFFLEVBQUUscUNBQXFDO0tBQzFDO0lBQ0QsY0FBYyxFQUFFO1FBQ2QsRUFBRSxFQUFFLHNFQUFzRTtRQUMxRSxFQUFFLEVBQUUsOEZBQThGO1FBQ2xHLEVBQUUsRUFBRSx1RUFBdUU7UUFDM0UsRUFBRSxFQUFFLDRFQUE0RTtRQUNoRixFQUFFLEVBQUUsMkVBQTJFO1FBQy9FLEVBQUUsRUFBRSxzRkFBc0Y7S0FDM0Y7SUFDRCxtQkFBbUIsRUFBRTtRQUNuQixFQUFFLEVBQUUsK0RBQStEO1FBQ25FLEVBQUUsRUFBRSwyREFBMkQ7UUFDL0QsRUFBRSxFQUFFLHVGQUF1RjtRQUMzRixFQUFFLEVBQUUscURBQXFEO1FBQ3pELEVBQUUsRUFBRSxpREFBaUQ7UUFDckQsRUFBRSxFQUFFLG9DQUFvQztLQUN6QztJQUNELFlBQVksRUFBRTtRQUNaLEVBQUUsRUFBRSx1QkFBdUI7UUFDM0IsRUFBRSxFQUFFLG9DQUFvQztRQUN4QyxFQUFFLEVBQUUsMEJBQTBCO1FBQzlCLEVBQUUsRUFBRSxnQ0FBZ0M7UUFDcEMsRUFBRSxFQUFFLDZCQUE2QjtRQUNqQyxFQUFFLEVBQUUsaUJBQWlCO0tBQ3RCO0lBQ0QsaUJBQWlCLEVBQUU7UUFDakIsRUFBRSxFQUFFLDBEQUEwRDtRQUM5RCxFQUFFLEVBQUUsbUVBQW1FO1FBQ3ZFLEVBQUUsRUFBRSw2RkFBNkY7UUFDakcsRUFBRSxFQUFFLHNEQUFzRDtRQUMxRCxFQUFFLEVBQUUsa0RBQWtEO1FBQ3RELEVBQUUsRUFBRSx3Q0FBd0M7S0FDN0M7SUFDRCxjQUFjLEVBQUU7UUFDZCxFQUFFLEVBQUUsNkJBQTZCO1FBQ2pDLEVBQUUsRUFBRSxxQ0FBcUM7UUFDekMsRUFBRSxFQUFFLDRCQUE0QjtRQUNoQyxFQUFFLEVBQUUsK0JBQStCO1FBQ25DLEVBQUUsRUFBRSw4QkFBOEI7UUFDbEMsRUFBRSxFQUFFLGVBQWU7S0FDcEI7SUFDRCxtQkFBbUIsRUFBRTtRQUNuQixFQUFFLEVBQUUsa0NBQWtDO1FBQ3RDLEVBQUUsRUFBRSw2QkFBNkI7UUFDakMsRUFBRSxFQUFFLDhDQUE4QztRQUNsRCxFQUFFLEVBQUUsaUNBQWlDO1FBQ3JDLEVBQUUsRUFBRSw0QkFBNEI7UUFDaEMsRUFBRSxFQUFFLGtCQUFrQjtLQUN2QjtDQUNPLENBQUM7QUFNWCxNQUFNLFFBQVE7SUFJWixJQUFJLFdBQVc7UUFDYixJQUFJLElBQUksQ0FBQyxPQUFPO1lBQ2QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsSUFBSSxJQUFJLENBQUMsVUFBVTtZQUNqQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xILE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRUQsa0JBQWtCLENBQ2QsT0FBMkIsRUFDM0IsT0FBOEI7UUFFaEMsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUNyQixNQUFNO2FBQ0gsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUNoQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQ3JELENBQUM7SUFDeEIsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQWlCLEVBQUUsT0FBOEI7UUFDaEUsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQyxPQUFPO1lBQ0wsRUFBRSxFQUFFLE9BQU87WUFDWCxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUMxQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUMxQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUMxQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUMxQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztTQUMzQyxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUV6QixNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO0FBQ3pDLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7OztBQ25LVztBQUNWO0FBZXhDLE1BQU0sY0FBYztJQUNqQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQWMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDO1FBQzdELE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztRQUV6Qiw4REFBOEQ7UUFDOUQsK0ZBQStGO1FBQy9GLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ3BCLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLFNBQVM7WUFFWCxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVE7Z0JBQzdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztnQkFFNUMseUVBQXlFO2dCQUN6RSxtRUFBbUU7Z0JBQ25FLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEI7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDLElBQWM7UUFDOUIsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDNUIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2QixNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO29CQUNsQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFOUMsT0FBTyxHQUFHLENBQUM7YUFDWjtZQUVELElBQUksSUFBSSxLQUFLLElBQUk7Z0JBQ2YsT0FBTyxJQUFJLENBQUM7WUFFZCxJQUFJLElBQUksWUFBWSxNQUFNO2dCQUN4QixPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTFCLE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztZQUN6QixLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUk7Z0JBQ2xCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTlDLE9BQU8sR0FBRyxDQUFDO1NBQ1o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDLElBQVksRUFBRSxhQUFhLEdBQUcsSUFBSTtRQUNwRCxNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNyQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzlCLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDMUQsZUFBZTtRQUNmLE1BQU0sTUFBTSxHQUFHLEtBQUssU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hHLE9BQU8sUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQVk7UUFDbEMsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsTUFBTSxDQUFDLHNCQUFzQixDQUFDLElBQVU7UUFDdEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2RSxNQUFNLEdBQUcsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzlELE9BQU8sR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBWSxFQUFFLGFBQWEsR0FBRyxLQUFLO1FBQ3pELE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxNQUFNLENBQUMsc0JBQXNCLENBQUMsSUFBVSxFQUFFLGFBQWEsR0FBRyxLQUFLO1FBQzdELE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDaEUsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNwRSxNQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxJQUFJLE1BQU0sSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUN4QyxJQUFJLGFBQWE7WUFDZixHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUM7UUFFM0MsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFVO1FBQzVCLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25ELE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBWSxFQUFFLGFBQWEsR0FBRyxLQUFLO1FBQ3pELE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLE9BQU8sR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDO0lBQ3BHLENBQUM7SUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQztRQUNqQyxPQUFPLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBVztRQUMzQixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNoRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQVcsRUFBRSxHQUFXO1FBQzFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBWSxFQUM3QixPQUFzQztRQUN4QyxJQUFJLE9BQU8sWUFBWSxNQUFNO1lBQzNCLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixLQUFLLE1BQU0sT0FBTyxJQUFJLE9BQU8sRUFBRTtZQUM3QixNQUFNLElBQUksR0FBRyxPQUErQixDQUFDO1lBQzdDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsSUFBSSxHQUFHLENBQUMsTUFBTTtvQkFDWixHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQzdCLE9BQU8sR0FBRyxDQUFDO2FBQ1o7U0FDRjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBWTs7UUFDNUIsSUFBSSxHQUFHLENBQUM7UUFDUixtRUFBbUU7UUFDbkUsZ0RBQWdEO1FBQ2hELEdBQUcsR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMxRSxJQUFJLEdBQUcsRUFBRTtZQUNQLFNBQUcsQ0FBQyxNQUFNLG9DQUFWLEdBQUcsQ0FBQyxNQUFNLEdBQUssRUFBRSxFQUFDO1lBQ2xCLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxPQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxtQ0FBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMxRSxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7WUFDbkMsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUNELEdBQUcsR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckUsSUFBSSxHQUFHLEVBQUU7WUFDUCxTQUFHLENBQUMsTUFBTSxvQ0FBVixHQUFHLENBQUMsTUFBTSxHQUFLLEVBQUUsRUFBQztZQUNsQixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7WUFDekIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1lBQzlCLE9BQU8sR0FBRyxDQUFDO1NBQ1o7UUFDRCxHQUFHLEdBQUcsY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksR0FBRyxFQUFFO1lBQ1AsU0FBRyxDQUFDLE1BQU0sb0NBQVYsR0FBRyxDQUFDLE1BQU0sR0FBSyxFQUFFLEVBQUM7WUFDbEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ3pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUNoQyxPQUFPLEdBQUcsQ0FBQztTQUNaO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBWTs7UUFDMUIsSUFBSSxHQUFHLENBQUM7UUFDUixtRUFBbUU7UUFDbkUsZ0RBQWdEO1FBQ2hELEdBQUcsR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEUsSUFBSSxHQUFHLEVBQUU7WUFDUCxTQUFHLENBQUMsTUFBTSxvQ0FBVixHQUFHLENBQUMsTUFBTSxHQUFLLEVBQUUsRUFBQztZQUNsQixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDM0IsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUNELEdBQUcsR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbkUsSUFBSSxHQUFHLEVBQUU7WUFDUCxTQUFHLENBQUMsTUFBTSxvQ0FBVixHQUFHLENBQUMsTUFBTSxHQUFLLEVBQUUsRUFBQztZQUNsQixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDNUIsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUNELEdBQUcsR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMxRSxJQUFJLEdBQUcsRUFBRTtZQUNQLFNBQUcsQ0FBQyxNQUFNLG9DQUFWLEdBQUcsQ0FBQyxNQUFNLEdBQUssRUFBRSxFQUFDO1lBQ2xCLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQztZQUNwQyxPQUFPLEdBQUcsQ0FBQztTQUNaO1FBQ0QsR0FBRyxHQUFHLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2RSxJQUFJLEdBQUcsRUFBRTtZQUNQLFNBQUcsQ0FBQyxNQUFNLG9DQUFWLEdBQUcsQ0FBQyxNQUFNLEdBQUssRUFBRSxFQUFDO1lBQ2xCLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztZQUM5QixPQUFPLEdBQUcsQ0FBQztTQUNaO0lBQ0gsQ0FBQzs7QUFFTSwwQkFBVyxHQUFHLHVCQUF1QixDQUFDO0FBQ3RDLDRCQUFhLEdBQUcsOEJBQThCLENBQUM7QUFDL0MsK0JBQWdCLEdBQUcsNkJBQTZCLENBQUM7QUFDakQsNEJBQWEsR0FBRyx5QkFBeUIsQ0FBQztBQUMxQyx3QkFBUyxHQUFHLG9CQUFvQixDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDMUQsdUJBQVEsR0FBRyxvQkFBb0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQ3pELCtCQUFnQixHQUFHLGVBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7OztBQzNNekUsMEVBQTBFO0FBQzFFLG9FQUFvRTtBQUVwRSx5RUFBeUU7QUFDekUsd0VBQXdFO0FBQ3hFLCtFQUErRTtBQUMvRSwrRUFBK0U7QUFDL0UsdUJBQXVCO0FBRXZCLDRFQUE0RTtBQUM1RSwrRUFBK0U7QUFDeEUsTUFBTSxlQUFnQixTQUFRLEtBQUs7SUFDeEM7UUFDRSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUMzQyxDQUFDO0NBQ0Y7OztBQ2ZtRTtBQUlyRCxNQUFNLFNBQVM7SUFXNUIsWUFBWSxFQUFVLEVBQUUsSUFBWTtRQVRwQyxTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUNaLFdBQU0sR0FBNEMsRUFBRSxDQUFDO1FBQ3JELHNCQUFpQixHQUFhLEVBQUUsQ0FBQztRQUNqQyxvQkFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBTW5CLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsT0FBTyxDQUFDLElBQVk7O1FBQ2xCLHNFQUFzRTtRQUN0RSxzRUFBc0U7UUFDdEUsb0VBQW9FO1FBQ3BFLG1FQUFtRTtRQUNuRSxpQ0FBaUM7UUFDakMsb0VBQW9FO1FBQ3BFLG1CQUFtQjtRQUNuQixJQUFJLElBQUksS0FBSyxFQUFFO1lBQ2IsT0FBTztRQUVULE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLElBQUksU0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLG1DQUFJLEVBQUUsQ0FBQztRQUMzQixJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUNsQixJQUFJLENBQUMsTUFBTSxlQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsMENBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLG9DQUFLLEVBQUUsQ0FBQztJQUNyRCxDQUFDO0lBRUQsUUFBUSxDQUFDLFNBQWlCO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxTQUFTLENBQUM7SUFDOUMsQ0FBQztJQUVELFNBQVMsQ0FBQyxTQUFpQixFQUFFLEtBQXFCO1FBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztZQUM3QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxTQUFpQjs7UUFDcEMsZ0ZBQWdGO1FBQ2hGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsTUFBTSx5QkFBeUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNwRSwwRkFBMEY7UUFDMUYsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyx5QkFBeUI7WUFDakQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QywyRkFBMkY7UUFDM0YsMkNBQTJDO2FBQ3RDLElBQUksS0FBSyxLQUFLLHlCQUF5QjtZQUN4QyxTQUFTLEdBQUcsT0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMseUJBQXlCLENBQUMsbUNBQUksQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRXpELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3RELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFJLFVBQVUsSUFBSSxVQUFVLEdBQUcsU0FBUztnQkFDdEMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELGdCQUFnQixDQUFDLFNBQWlCLEVBQUUsS0FBOEI7O1FBQ2hFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDeEMsNkNBQTZDO1lBQzdDLE1BQU0sY0FBYyxTQUFHLElBQUksQ0FBQyxpQkFBaUI7aUJBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztpQkFDNUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsSUFBSSxjQUFjLEtBQUssU0FBUztnQkFDOUIsTUFBTSxJQUFJLGVBQWUsRUFBRSxDQUFDO1lBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ1IsTUFBTSxJQUFJLGVBQWUsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwRDthQUFNO1lBQ0wsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsS0FBSztnQkFDUixNQUFNLElBQUksZUFBZSxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3BEO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFakUsTUFBTSw2QkFBNkIsR0FDakMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLDZCQUE2QjtZQUNoQyxNQUFNLElBQUksZUFBZSxFQUFFLENBQUM7UUFDOUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztRQUNoRixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUU1RCxJQUFJLDZCQUE2QixLQUFLLFNBQVMsSUFBSSxZQUFZLEtBQUssWUFBWTtZQUM5RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxRQUFRLENBQUMsU0FBaUI7UUFDeEIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hELElBQUksZ0JBQWdCO1lBQ2xCLE9BQU8sZ0JBQWdCLENBQUM7UUFFMUIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkQsSUFBSSxnQkFBZ0IsS0FBSyxTQUFTO1lBQ2hDLE1BQU0sSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM5QixJQUFJLFNBQVMsR0FBRyxnQkFBZ0I7WUFDOUIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDN0MsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQUksYUFBYSxLQUFLLFNBQVM7Z0JBQzdCLE1BQU0sSUFBSSxlQUFlLEVBQUUsQ0FBQztZQUM5QixJQUFJLGFBQWEsR0FBRyxTQUFTO2dCQUMzQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3RDO1FBRUQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsK0NBQStDO0lBQ3ZDLGVBQWUsQ0FBQyxLQUFhO1FBQ25DLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxJQUFJLFVBQVUsS0FBSyxTQUFTO1lBQzFCLE1BQU0sSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM5QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksS0FBSyxLQUFLLFNBQVM7WUFDckIsTUFBTSxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQzlCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztDQUNGOzs7QUNwSWMsTUFBTSxrQkFBa0I7SUFDckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFpQjtRQUM3QixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN2RSxJQUFJLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxRQUFRLENBQUMsU0FBUztnQkFDM0IsT0FBTyxHQUFnRCxDQUFDO1NBQzNEO0lBQ0gsQ0FBQzs7QUFFZSxvQ0FBaUIsR0FBRyxtQkFBbUIsQ0FBQztBQUV4Qyw0QkFBUyxHQUFnQztJQUN2RCxHQUFHLEVBQUU7UUFDSCxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbEYsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ2xGLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUNsRixLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ25GLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ3JGLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO1FBQ3JGLElBQUk7S0FDTDtJQUNELEdBQUcsRUFBRTtRQUNILEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7UUFDckYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDcEYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO0tBQ3ZFO0lBQ0QsR0FBRyxFQUFFO1FBQ0gsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUN0RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7UUFDeEYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUk7UUFDdkYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtLQUMzRDtJQUNELEdBQUcsRUFBRTtRQUNILEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUNsRixLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbEYsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ2xGLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUNsRixLQUFLO0tBQ047SUFDRCxHQUFHLEVBQUU7UUFDSCxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSztRQUN0RixJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ3hGLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbkYsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRztLQUM5RTtJQUNELEdBQUcsRUFBRTtRQUNILEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDekYsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUNyRixLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDdkYsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJO1FBQ3pGLElBQUksRUFBRSxJQUFJO0tBQ1g7SUFDRCxHQUFHLEVBQUU7UUFDSCxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ3pGLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO1FBQ3pGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUN4RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUN4RixLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUN0RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7S0FDakI7SUFDRCxHQUFHLEVBQUU7UUFDSCxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ3pGLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDekYsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQzFGLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO0tBQy9FO0lBQ0QsR0FBRyxFQUFFO1FBQ0gsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUs7UUFDekYsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7UUFDcEYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRTtLQUNuRjtJQUNELEdBQUcsRUFBRTtRQUNILEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDekYsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUNwRixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSztRQUNuRixLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUN2RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO0tBQ3ZCO0lBQ0QsR0FBRyxFQUFFO1FBQ0gsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUN6RixLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUNyRixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7UUFDeEYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtLQUM3RTtJQUNELEdBQUcsRUFBRTtRQUNILEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ3hGLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQzFGLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO1FBQ3JGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHO0tBQzVCO0lBQ0QsR0FBRyxFQUFFO1FBQ0gsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUN6RixLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUN2RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ3JGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO0tBQ25GO0lBQ0QsR0FBRyxFQUFFO1FBQ0gsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ2xGLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUNsRixLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbEYsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ2xGLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUNsRixLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztLQUNsQztJQUNELEdBQUcsRUFBRTtRQUNILEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ3RGLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbkYsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7UUFDdEYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRztLQUN2RDtJQUNELEdBQUcsRUFBRTtRQUNILEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUNsRixLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbEYsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7UUFDdEYsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUN0RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHO1FBQ3BGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7S0FDM0Q7SUFDRCxHQUFHLEVBQUU7UUFDSCxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbEYsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUNuRixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUNsRixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUNsRixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO0tBQ3ZCO0lBQ0QsR0FBRyxFQUFFO1FBQ0gsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ2xGLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztRQUNsRixLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDbEYs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LFVBQVUsQ0FBQztRQUNyQyxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssU0FBUztZQUN2QixLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDckIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7WUFDMUIsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxTQUFTO1lBQ3ZCLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNyQixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztZQUMxQixLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFM0IsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsMEJBQTBCLENBQUMsSUFBcUI7UUFDOUMsTUFBTSxLQUFLLEdBQTRCLEVBQUUsQ0FBQztRQUUxQyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUztZQUM1QixLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDNUIsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVM7WUFDNUIsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzVCLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTO1lBQzVCLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1QixJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUztZQUNsQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDckMsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVM7WUFDN0IsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTO1lBQ2hDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFB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QUFFLEVBQUU7SUFDUCxHQUFHLEVBQUUsRUFBRTtJQUNQLEdBQUcsRUFBRSxFQUFFO0lBQ1AsR0FBRyxFQUFFLEVBQUU7SUFDUCxHQUFHLEVBQUUsRUFBRTtJQUNQLEdBQUcsRUFBRSxFQUFFO0lBQ1AsR0FBRyxFQUFFLEVBQUU7SUFDUCxHQUFHLEVBQUUsRUFBRTtJQUNQLEdBQUcsRUFBRSxFQUFFO0lBQ1AsR0FBRyxFQUFFLEVBQUU7SUFDUCxHQUFHLEVBQUUsRUFBRTtJQUNQLEdBQUcsRUFBRSxFQUFFO0lBQ1AsR0FBRyxFQUFFLEVBQUU7SUFDUCxHQUFHLEVBQUUsRUFBRTtJQUNQLEdBQUcsRUFBRSxFQUFFO0lBQ1AsR0FBRyxFQUFFLEVBQUU7SUFDUCxHQUFHLEVBQUUsRUFBRTtJQUNQLEdBQUcsRUFBRSxFQUFFO0NBQ1IsQ0FBQztBQUVGLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFVLENBQUM7QUFDcEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBVyxDQUFDO0FBRXBGLE1BQU0sUUFBUSxHQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuRSxNQUFNLFVBQVUsR0FBVSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELE1BQU0sWUFBWSxHQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUUsTUFBTSxhQUFhLEdBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxRCxNQUFNLGFBQWEsR0FBVSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUss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QUFNLENBQUMsV0FBVyxDQUFDLG1DQUFJLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxVQUFVLE9BQUMsS0FBSyxDQUFDLG9CQUFNLENBQUMsU0FBUyxDQUFDLG1DQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxXQUFXLFNBQUcsS0FBSyxDQUFDLG9CQUFNLENBQUMsV0FBVyxDQUFDLG1DQUFJLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxVQUFVLE9BQUMsS0FBSyxDQUFDLG9CQUFNLENBQUMsU0FBUyxDQUFDLG1DQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxPQUFDLEtBQUssQ0FBQyxvQkFBTSxDQUFDLEtBQUssQ0FBQyxtQ0FBSSxFQUFFLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsT0FBTyxTQUFHLEtBQUssQ0FBQyxvQkFBTSxDQUFDLE9BQU8sQ0FBQyxtQ0FBSSxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLFNBQUcsS0FBSyxDQUFDLG9CQUFNLENBQUMsT0FBTyxDQUFDLG1DQUFJLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sU0FBRyxLQUFLLENBQUMsb0JBQU0sQ0FBQyxPQUFPLENBQUMsbUNBQUksRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNs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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2VSZWdFeHAgfSBmcm9tICcuLi90eXBlcy90cmlnZ2VyJztcclxuXHJcbmV4cG9ydCB0eXBlIFBhcmFtczxUIGV4dGVuZHMgc3RyaW5nPiA9XHJcbiAgUGFydGlhbDxSZWNvcmQ8RXhjbHVkZTxULCAndGltZXN0YW1wJyB8ICdjYXB0dXJlJz4sIHN0cmluZyB8IHN0cmluZ1tdPiAmXHJcbiAgeyAndGltZXN0YW1wJzogc3RyaW5nOyAnY2FwdHVyZSc6IGJvb2xlYW4gfT47XHJcblxyXG5leHBvcnQgdHlwZSBSZWdleDxUIGV4dGVuZHMgc3RyaW5nPiA9IEJhc2VSZWdFeHA8RXhjbHVkZTxULCAnY2FwdHVyZSc+PjtcclxuXHJcbnR5cGUgVmFsaWRTdHJpbmdPckFycmF5ID0gc3RyaW5nIHwgc3RyaW5nW107XHJcblxyXG5jb25zdCBzdGFydHNVc2luZ1BhcmFtcyA9IFsndGltZXN0YW1wJywgJ3NvdXJjZScsICdpZCcsICdhYmlsaXR5JywgJ3RhcmdldCcsICdjYXB0dXJlJ10gYXMgY29uc3Q7XHJcbmNvbnN0IGFiaWxpdHlQYXJhbXMgPSBbJ3RpbWVzdGFtcCcsICdzb3VyY2UnLCAnc291cmNlSWQnLCAnaWQnLCAnYWJpbGl0eScsICd0YXJnZXRJZCcsICd0YXJnZXQnLCAnY2FwdHVyZSddIGFzIGNvbnN0O1xyXG5jb25zdCBhYmlsaXR5RnVsbFBhcmFtcyA9IFtcclxuICAndGltZXN0YW1wJyxcclxuICAnc291cmNlSWQnLFxyXG4gICdzb3VyY2UnLFxyXG4gICdpZCcsXHJcbiAgJ2FiaWxpdHknLFxyXG4gICd0YXJnZXRJZCcsXHJcbiAgJ3RhcmdldCcsXHJcbiAgJ2ZsYWdzJyxcclxuICAnZmxhZzAnLFxyXG4gICdmbGFnMScsXHJcbiAgJ2ZsYWcyJyxcclxuICAnZmxhZzMnLFxyXG4gICdmbGFnNCcsXHJcbiAgJ2ZsYWc1JyxcclxuICAnZmxhZzYnLFxyXG4gICdmbGFnNycsXHJcbiAgJ2ZsYWc4JyxcclxuICAnZmxhZzknLFxyXG4gICdmbGFnMTAnLFxyXG4gICdmbGFnMTEnLFxyXG4gICdmbGFnMTInLFxyXG4gICdmbGFnMTMnLFxyXG4gICdmbGFnMTQnLFxyXG4gICd0YXJnZXRIcCcsXHJcbiAgJ3RhcmdldE1heEhwJyxcclxuICAndGFyZ2V0TXAnLFxyXG4gICd0YXJnZXRNYXhNcCcsXHJcbiAgJ3RhcmdldFgnLFxyXG4gICd0YXJnZXRZJyxcclxuICAndGFyZ2V0WicsXHJcbiAgJ3RhcmdldEhlYWRpbmcnLFxyXG4gICdocCcsXHJcbiAgJ21heEhwJyxcclxuICAnbXAnLFxyXG4gICdtYXhNcCcsXHJcbiAgJ3gnLFxyXG4gICd5JyxcclxuICAneicsXHJcbiAgJ2hlYWRpbmcnLFxyXG4gICdjYXB0dXJlJyxcclxuXSBhcyBjb25zdDtcclxuY29uc3QgaGVhZE1hcmtlclBhcmFtcyA9IFsndGltZXN0YW1wJywgJ3RhcmdldElkJywgJ3RhcmdldCcsICdpZCcsICdjYXB0dXJlJ10gYXMgY29uc3Q7XHJcbmNvbnN0IGFkZGVkQ29tYmF0YW50UGFyYW1zID0gWyd0aW1lc3RhbXAnLCAnbmFtZScsICdjYXB0dXJlJ10gYXMgY29uc3Q7XHJcbmNvbnN0IGFkZGVkQ29tYmF0YW50RnVsbFBhcmFtcyA9IFtcclxuICAndGltZXN0YW1wJyxcclxuICAnaWQnLFxyXG4gICduYW1lJyxcclxuICAnam9iJyxcclxuICAnbGV2ZWwnLFxyXG4gICdocCcsXHJcbiAgJ3gnLFxyXG4gICd5JyxcclxuICAneicsXHJcbiAgJ25wY0lkJyxcclxuICAnY2FwdHVyZScsXHJcbl0gYXMgY29uc3Q7XHJcbmNvbnN0IHJlbW92aW5nQ29tYmF0YW50UGFyYW1zID0gW1xyXG4gICd0aW1lc3RhbXAnLFxyXG4gICdpZCcsXHJcbiAgJ25hbWUnLFxyXG4gICdocCcsXHJcbiAgJ3gnLFxyXG4gICd5JyxcclxuICAneicsXHJcbiAgJ2NhcHR1cmUnLFxyXG5dIGFzIGNvbnN0O1xyXG5jb25zdCBnYWluc0VmZmVjdFBhcmFtcyA9IFsndGltZXN0YW1wJywgJ3RhcmdldElkJywgJ3RhcmdldCcsICdlZmZlY3QnLCAnc291cmNlJywgJ2R1cmF0aW9uJywgJ2NhcHR1cmUnXSBhcyBjb25zdDtcclxuY29uc3Qgc3RhdHVzRWZmZWN0RXhwbGljaXRQYXJhbXMgPSBbXHJcbiAgJ3RpbWVzdGFtcCcsXHJcbiAgJ3RhcmdldElkJyxcclxuICAndGFyZ2V0JyxcclxuICAnam9iJyxcclxuICAnaHAnLFxyXG4gICdtYXhIcCcsXHJcbiAgJ21wJyxcclxuICAnbWF4TXAnLFxyXG4gICd4JyxcclxuICAneScsXHJcbiAgJ3onLFxyXG4gICdoZWFkaW5nJyxcclxuICAnZGF0YTAnLFxyXG4gICdkYXRhMScsXHJcbiAgJ2RhdGEyJyxcclxuICAnZGF0YTMnLFxyXG4gICdkYXRhNCcsXHJcbiAgJ2NhcHR1cmUnLFxyXG5dIGFzIGNvbnN0O1xyXG5jb25zdCBsb3Nlc0VmZmVjdFBhcmFtcyA9IFsndGltZXN0YW1wJywgJ3RhcmdldElkJywgJ3RhcmdldCcsICdlZmZlY3QnLCAnc291cmNlJywgJ2NhcHR1cmUnXSBhcyBjb25zdDtcclxuY29uc3Qgc3RhdENoYW5nZVBhcmFtcyA9IFtcclxuICAndGltZXN0YW1wJyxcclxuICAnam9iJyxcclxuICAnc3RyZW5ndGgnLFxyXG4gICdkZXh0ZXJpdHknLFxyXG4gICd2aXRhbGl0eScsXHJcbiAgJ2ludGVsbGlnZW5jZScsXHJcbiAgJ21pbmQnLFxyXG4gICdwaWV0eScsXHJcbiAgJ2F0dGFja1Bvd2VyJyxcclxuICAnZGlyZWN0SGl0JyxcclxuICAnY3JpdGljYWxIaXQnLFxyXG4gICdhdHRhY2tNYWdpY1BvdGVuY3knLFxyXG4gICdoZWFsTWFnaWNQb3RlbmN5JyxcclxuICAnZGV0ZXJtaW5hdGlvbicsXHJcbiAgJ3NraWxsU3BlZWQnLFxyXG4gICdzcGVsbFNwZWVkJyxcclxuICAndGVuYWNpdHknLFxyXG4gICdjYXB0dXJlJyxcclxuXSBhcyBjb25zdDtcclxuY29uc3QgdGV0aGVyUGFyYW1zID0gWyd0aW1lc3RhbXAnLCAnc291cmNlJywgJ3NvdXJjZUlkJywgJ3RhcmdldCcsICd0YXJnZXRJZCcsICdpZCcsICdjYXB0dXJlJ10gYXMgY29uc3Q7XHJcbmNvbnN0IHdhc0RlZmVhdGVkUGFyYW1zID0gWyd0aW1lc3RhbXAnLCAndGFyZ2V0JywgJ3NvdXJjZScsICdjYXB0dXJlJ10gYXMgY29uc3Q7XHJcbmNvbnN0IGhhc0hQUGFyYW1zID0gWyd0aW1lc3RhbXAnLCAnbmFtZScsICdocCcsICdjYXB0dXJlJ10gYXMgY29uc3Q7XHJcbmNvbnN0IGVjaG9QYXJhbXMgPSBbJ3RpbWVzdGFtcCcsICdjb2RlJywgJ2xpbmUnLCAnY2FwdHVyZSddIGFzIGNvbnN0O1xyXG5jb25zdCBkaWFsb2dQYXJhbXMgPSBbJ3RpbWVzdGFtcCcsICdjb2RlJywgJ2xpbmUnLCAnbmFtZScsICdjYXB0dXJlJ10gYXMgY29uc3Q7XHJcbmNvbnN0IG1lc3NhZ2VQYXJhbXMgPSBbJ3RpbWVzdGFtcCcsICdjb2RlJywgJ2xpbmUnLCAnY2FwdHVyZSddIGFzIGNvbnN0O1xyXG5jb25zdCBnYW1lTG9nUGFyYW1zID0gWyd0aW1lc3RhbXAnLCAnY29kZScsICdsaW5lJywgJ2NhcHR1cmUnXSBhcyBjb25zdDtcclxuY29uc3QgZ2FtZU5hbWVMb2dQYXJhbXMgPSBbJ3RpbWVzdGFtcCcsICdjb2RlJywgJ25hbWUnLCAnbGluZScsICdjYXB0dXJlJ10gYXMgY29uc3Q7XHJcbmNvbnN0IGNoYW5nZVpvbmVQYXJhbXMgPSBbJ3RpbWVzdGFtcCcsICduYW1lJywgJ2NhcHR1cmUnXSBhcyBjb25zdDtcclxuY29uc3QgbmV0d29yazZkUGFyYW1zID0gWyd0aW1lc3RhbXAnLCAnaW5zdGFuY2UnLCAnY29tbWFuZCcsICdkYXRhMCcsICdkYXRhMScsICdkYXRhMicsICdkYXRhMycsICdjYXB0dXJlJ10gYXMgY29uc3Q7XHJcblxyXG5leHBvcnQgdHlwZSBTdGFydHNVc2luZ1BhcmFtcyA9IHR5cGVvZiBzdGFydHNVc2luZ1BhcmFtc1tudW1iZXJdO1xyXG5leHBvcnQgdHlwZSBBYmlsaXR5UGFyYW1zID0gdHlwZW9mIGFiaWxpdHlQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgQWJpbGl0eUZ1bGxQYXJhbXMgPSB0eXBlb2YgYWJpbGl0eUZ1bGxQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgSGVhZE1hcmtlclBhcmFtcyA9IHR5cGVvZiBoZWFkTWFya2VyUGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIEFkZGVkQ29tYmF0YW50UGFyYW1zID0gdHlwZW9mIGFkZGVkQ29tYmF0YW50UGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIEFkZGVkQ29tYmF0YW50RnVsbFBhcmFtcyA9IHR5cGVvZiBhZGRlZENvbWJhdGFudEZ1bGxQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgUmVtb3ZpbmdDb21iYXRhbnRQYXJhbXMgPSB0eXBlb2YgcmVtb3ZpbmdDb21iYXRhbnRQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgR2FpbnNFZmZlY3RQYXJhbXMgPSB0eXBlb2YgZ2FpbnNFZmZlY3RQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgU3RhdHVzRWZmZWN0RXhwbGljaXRQYXJhbXMgPSB0eXBlb2Ygc3RhdHVzRWZmZWN0RXhwbGljaXRQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgTG9zZXNFZmZlY3RQYXJhbXMgPSB0eXBlb2YgbG9zZXNFZmZlY3RQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgU3RhdENoYW5nZVBhcmFtcyA9IHR5cGVvZiBzdGF0Q2hhbmdlUGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIFRldGhlclBhcmFtcyA9IHR5cGVvZiB0ZXRoZXJQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgV2FzRGVmZWF0ZWRQYXJhbXMgPSB0eXBlb2Ygd2FzRGVmZWF0ZWRQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgSGFzSFBQYXJhbXMgPSB0eXBlb2YgaGFzSFBQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgRWNob1BhcmFtcyA9IHR5cGVvZiBlY2hvUGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIERpYWxvZ1BhcmFtcyA9IHR5cGVvZiBkaWFsb2dQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgTWVzc2FnZVBhcmFtcyA9IHR5cGVvZiBtZXNzYWdlUGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIEdhbWVMb2dQYXJhbXMgPSB0eXBlb2YgZ2FtZUxvZ1BhcmFtc1tudW1iZXJdO1xyXG5leHBvcnQgdHlwZSBHYW1lTmFtZUxvZ1BhcmFtcyA9IHR5cGVvZiBnYW1lTmFtZUxvZ1BhcmFtc1tudW1iZXJdO1xyXG5leHBvcnQgdHlwZSBDaGFuZ2Vab25lUGFyYW1zID0gdHlwZW9mIGNoYW5nZVpvbmVQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgTmV0d29yazZkUGFyYW1zID0gdHlwZW9mIG5ldHdvcms2ZFBhcmFtc1tudW1iZXJdO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnZXhlcyB7XHJcbiAgLyoqXHJcbiAgICogZmllbGRzOiBzb3VyY2UsIGlkLCBhYmlsaXR5LCB0YXJnZXQsIGNhcHR1cmVcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMTQtbmV0d29ya3N0YXJ0c2Nhc3RpbmdcclxuICAgKi9cclxuICBzdGF0aWMgc3RhcnRzVXNpbmcoZj86IFBhcmFtczxTdGFydHNVc2luZ1BhcmFtcz4pOiBSZWdleDxTdGFydHNVc2luZ1BhcmFtcz4ge1xyXG4gICAgaWYgKHR5cGVvZiBmID09PSAndW5kZWZpbmVkJylcclxuICAgICAgZiA9IHt9O1xyXG4gICAgUmVnZXhlcy52YWxpZGF0ZVBhcmFtcyhmLCAnc3RhcnRzVXNpbmcnLCBzdGFydHNVc2luZ1BhcmFtcyk7XHJcbiAgICBjb25zdCBjYXB0dXJlID0gUmVnZXhlcy50cnVlSWZVbmRlZmluZWQoZi5jYXB0dXJlKTtcclxuICAgIGxldCBzdHIgPSBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGltZXN0YW1wJywgJ1xcXFx5e1RpbWVzdGFtcH0nKSArXHJcbiAgICAgICcgMTQ6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdpZCcsIGYuaWQsICdcXFxceXtBYmlsaXR5Q29kZX0nKSArICc6JztcclxuXHJcbiAgICBpZiAoZi5zb3VyY2UgfHwgZi5pZCB8fCBmLnRhcmdldCB8fCBjYXB0dXJlKVxyXG4gICAgICBzdHIgKz0gUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3NvdXJjZScsIGYuc291cmNlLCAnLio/JykgKyAnIHN0YXJ0cyB1c2luZyAnO1xyXG5cclxuICAgIGlmIChmLmFiaWxpdHkgfHwgZi50YXJnZXQgfHwgY2FwdHVyZSlcclxuICAgICAgc3RyICs9IFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdhYmlsaXR5JywgZi5hYmlsaXR5LCAnLio/JykgKyAnIG9uICc7XHJcblxyXG4gICAgaWYgKGYudGFyZ2V0IHx8IGNhcHR1cmUpXHJcbiAgICAgIHN0ciArPSBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGFyZ2V0JywgZi50YXJnZXQsICcuKj8nKSArICdcXFxcLic7XHJcblxyXG4gICAgcmV0dXJuIFJlZ2V4ZXMucGFyc2Uoc3RyKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGZpZWxkczogc291cmNlSWQsIHNvdXJjZSwgaWQsIGFiaWxpdHksIHRhcmdldElkLCB0YXJnZXQsIGNhcHR1cmVcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMTUtbmV0d29ya2FiaWxpdHlcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMTYtbmV0d29ya2FvZWFiaWxpdHlcclxuICAgKi9cclxuICBzdGF0aWMgYWJpbGl0eShmPzogUGFyYW1zPEFiaWxpdHlQYXJhbXM+KTogUmVnZXg8QWJpbGl0eVBhcmFtcz4ge1xyXG4gICAgaWYgKHR5cGVvZiBmID09PSAndW5kZWZpbmVkJylcclxuICAgICAgZiA9IHt9O1xyXG4gICAgUmVnZXhlcy52YWxpZGF0ZVBhcmFtcyhmLCAnYWJpbGl0eScsIGFiaWxpdHlQYXJhbXMpO1xyXG4gICAgY29uc3QgY2FwdHVyZSA9IFJlZ2V4ZXMudHJ1ZUlmVW5kZWZpbmVkKGYuY2FwdHVyZSk7XHJcbiAgICBsZXQgc3RyID0gUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RpbWVzdGFtcCcsICdcXFxceXtUaW1lc3RhbXB9JykgK1xyXG4gICAgICAnIDFbNTZdOicgKyBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnc291cmNlSWQnLCAnXFxcXHl7T2JqZWN0SWR9JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnc291cmNlJywgZi5zb3VyY2UsICdbXjpdKj8nKSArICc6JztcclxuXHJcbiAgICBpZiAoZi5pZCB8fCBmLmFiaWxpdHkgfHwgZi50YXJnZXQgfHwgZi50YXJnZXRJZCB8fCBjYXB0dXJlKVxyXG4gICAgICBzdHIgKz0gUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2lkJywgZi5pZCwgJ1xcXFx5e0FiaWxpdHlDb2RlfScpICsgJzonO1xyXG5cclxuICAgIGlmIChmLmFiaWxpdHkgfHwgZi50YXJnZXQgfHwgZi50YXJnZXRJZCB8fCBjYXB0dXJlKVxyXG4gICAgICBzdHIgKz0gUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2FiaWxpdHknLCBmLmFiaWxpdHksICdbXjpdKj8nKSArICc6JztcclxuXHJcbiAgICBpZiAoZi50YXJnZXQgfHwgZi50YXJnZXRJZCB8fCBjYXB0dXJlKVxyXG4gICAgICBzdHIgKz0gUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RhcmdldElkJywgJ1xcXFx5e09iamVjdElkfScpICsgJzonO1xyXG5cclxuICAgIGlmIChmLnRhcmdldCB8fCBjYXB0dXJlKVxyXG4gICAgICBzdHIgKz0gUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RhcmdldCcsIGYudGFyZ2V0LCAnW146XSo/JykgKyAnOic7XHJcblxyXG4gICAgcmV0dXJuIFJlZ2V4ZXMucGFyc2Uoc3RyKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGZpZWxkczogc291cmNlSWQsIHNvdXJjZSwgaWQsIGFiaWxpdHksIHRhcmdldElkLCB0YXJnZXQsIGZsYWdzLCB4LCB5LCB6LCBoZWFkaW5nLCBjYXB0dXJlXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzE1LW5ldHdvcmthYmlsaXR5XHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzE2LW5ldHdvcmthb2VhYmlsaXR5XHJcbiAgICovXHJcbiAgc3RhdGljIGFiaWxpdHlGdWxsKGY/OiBQYXJhbXM8QWJpbGl0eUZ1bGxQYXJhbXM+KTogUmVnZXg8QWJpbGl0eUZ1bGxQYXJhbXM+IHtcclxuICAgIGlmICh0eXBlb2YgZiA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgIGYgPSB7fTtcclxuICAgIFJlZ2V4ZXMudmFsaWRhdGVQYXJhbXMoZiwgJ2FiaWxpdHlGdWxsJywgYWJpbGl0eUZ1bGxQYXJhbXMpO1xyXG4gICAgY29uc3QgY2FwdHVyZSA9IFJlZ2V4ZXMudHJ1ZUlmVW5kZWZpbmVkKGYuY2FwdHVyZSk7XHJcbiAgICBjb25zdCBzdHIgPSBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGltZXN0YW1wJywgJ1xcXFx5e1RpbWVzdGFtcH0nKSArXHJcbiAgICAgICcgMVs1Nl06JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdzb3VyY2VJZCcsIGYuc291cmNlSWQsICdcXFxceXtPYmplY3RJZH0nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdzb3VyY2UnLCBmLnNvdXJjZSwgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2lkJywgZi5pZCwgJ1xcXFx5e0FiaWxpdHlDb2RlfScpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2FiaWxpdHknLCBmLmFiaWxpdHksICdbXjpdKj8nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0YXJnZXRJZCcsIGYudGFyZ2V0SWQsICdcXFxceXtPYmplY3RJZH0nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0YXJnZXQnLCBmLnRhcmdldCwgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWdzJywgZi5mbGFncywgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWcwJywgZi5mbGFnMCwgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWcxJywgZi5mbGFnMSwgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWcyJywgZi5mbGFnMiwgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWczJywgZi5mbGFnMywgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWc0JywgZi5mbGFnNCwgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWc1JywgZi5mbGFnNSwgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWc2JywgZi5mbGFnNiwgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWc3JywgZi5mbGFnNywgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWc4JywgZi5mbGFnOCwgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWc5JywgZi5mbGFnOSwgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWcxMCcsIGYuZmxhZzEwLCAnW146XSo/JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnZmxhZzExJywgZi5mbGFnMTEsICdbXjpdKj8nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdmbGFnMTInLCBmLmZsYWcxMiwgJ1teOl0qPycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2ZsYWcxMycsIGYuZmxhZzEzLCAnW146XSo/JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnZmxhZzE0JywgZi5mbGFnMTMsICdbXjpdKj8nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMub3B0aW9uYWwoUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RhcmdldEhwJywgZi50YXJnZXRIcCwgJ1xcXFx5e0Zsb2F0fScpKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMub3B0aW9uYWwoUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RhcmdldE1heEhwJywgZi50YXJnZXRNYXhIcCwgJ1xcXFx5e0Zsb2F0fScpKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMub3B0aW9uYWwoUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RhcmdldE1wJywgZi50YXJnZXRNcCwgJ1xcXFx5e0Zsb2F0fScpKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMub3B0aW9uYWwoUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RhcmdldE1heE1wJywgZi50YXJnZXRNYXhNcCwgJ1xcXFx5e0Zsb2F0fScpKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMub3B0aW9uYWwoJ1xcXFx5e0Zsb2F0fScpICsgJzonICsgLy8gVGFyZ2V0IFRQXHJcbiAgICAgIFJlZ2V4ZXMub3B0aW9uYWwoJ1xcXFx5e0Zsb2F0fScpICsgJzonICsgLy8gVGFyZ2V0IE1heCBUUFxyXG4gICAgICBSZWdleGVzLm9wdGlvbmFsKFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0YXJnZXRYJywgZi50YXJnZXRYLCAnXFxcXHl7RmxvYXR9JykpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5vcHRpb25hbChSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGFyZ2V0WScsIGYudGFyZ2V0WSwgJ1xcXFx5e0Zsb2F0fScpKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMub3B0aW9uYWwoUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RhcmdldFonLCBmLnRhcmdldFosICdcXFxceXtGbG9hdH0nKSkgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm9wdGlvbmFsKFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0YXJnZXRIZWFkaW5nJywgZi50YXJnZXRIZWFkaW5nLCAnXFxcXHl7RmxvYXR9JykpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2hwJywgZi5ocCwgJ1xcXFx5e0Zsb2F0fScpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ21heEhwJywgZi5tYXhIcCwgJ1xcXFx5e0Zsb2F0fScpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ21wJywgZi5tcCwgJ1xcXFx5e0Zsb2F0fScpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ21heE1wJywgZi5tYXhNcCwgJ1xcXFx5e0Zsb2F0fScpICsgJzonICtcclxuICAgICAgJ1xcXFx5e0Zsb2F0fTonICsgLy8gU291cmNlIFRQXHJcbiAgICAgICdcXFxceXtGbG9hdH06JyArIC8vIFNvdXJjZSBNYXggVFBcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3gnLCBmLngsICdcXFxceXtGbG9hdH0nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd5JywgZi55LCAnXFxcXHl7RmxvYXR9JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAneicsIGYueiwgJ1xcXFx5e0Zsb2F0fScpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2hlYWRpbmcnLCBmLmhlYWRpbmcsICdcXFxceXtGbG9hdH0nKSArICc6JyArXHJcbiAgICAgICcuKj8kJzsgLy8gVW5rbm93biBsYXN0IGZpZWxkXHJcbiAgICByZXR1cm4gUmVnZXhlcy5wYXJzZShzdHIpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGZpZWxkczogdGFyZ2V0SWQsIHRhcmdldCwgaWQsIGNhcHR1cmVcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMWItbmV0d29ya3RhcmdldGljb24taGVhZC1tYXJrZXJzXHJcbiAgICovXHJcbiAgc3RhdGljIGhlYWRNYXJrZXIoZj86IFBhcmFtczxIZWFkTWFya2VyUGFyYW1zPik6IFJlZ2V4PEhlYWRNYXJrZXJQYXJhbXM+IHtcclxuICAgIGlmICh0eXBlb2YgZiA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgIGYgPSB7fTtcclxuICAgIFJlZ2V4ZXMudmFsaWRhdGVQYXJhbXMoZiwgJ2hlYWRNYXJrZXInLCBoZWFkTWFya2VyUGFyYW1zKTtcclxuICAgIGNvbnN0IGNhcHR1cmUgPSBSZWdleGVzLnRydWVJZlVuZGVmaW5lZChmLmNhcHR1cmUpO1xyXG4gICAgY29uc3Qgc3RyID0gUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RpbWVzdGFtcCcsICdcXFxceXtUaW1lc3RhbXB9JykgK1xyXG4gICAgICAnIDFCOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGFyZ2V0SWQnLCBmLnRhcmdldElkLCAnXFxcXHl7T2JqZWN0SWR9JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGFyZ2V0JywgZi50YXJnZXQsICdbXjpdKj8nKSArICc6Li4uLjouLi4uOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnaWQnLCBmLmlkLCAnLi4uLicpICsgJzonO1xyXG4gICAgcmV0dXJuIFJlZ2V4ZXMucGFyc2Uoc3RyKTtcclxuICB9XHJcblxyXG4gIC8vIGZpZWxkczogbmFtZSwgY2FwdHVyZVxyXG4gIC8vIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMwMy1hZGRjb21iYXRhbnRcclxuICBzdGF0aWMgYWRkZWRDb21iYXRhbnQoZj86IFBhcmFtczxBZGRlZENvbWJhdGFudFBhcmFtcz4pOiBSZWdleDxBZGRlZENvbWJhdGFudFBhcmFtcz4ge1xyXG4gICAgaWYgKHR5cGVvZiBmID09PSAndW5kZWZpbmVkJylcclxuICAgICAgZiA9IHt9O1xyXG4gICAgUmVnZXhlcy52YWxpZGF0ZVBhcmFtcyhmLCAnYWRkZWRDb21iYXRhbnQnLCBhZGRlZENvbWJhdGFudFBhcmFtcyk7XHJcbiAgICBjb25zdCBjYXB0dXJlID0gUmVnZXhlcy50cnVlSWZVbmRlZmluZWQoZi5jYXB0dXJlKTtcclxuICAgIGNvbnN0IHN0ciA9IFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0aW1lc3RhbXAnLCAnXFxcXHl7VGltZXN0YW1wfScpICtcclxuICAgICAgJyAwMzpcXFxceXtPYmplY3RJZH06QWRkZWQgbmV3IGNvbWJhdGFudCAnICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ25hbWUnLCBmLm5hbWUsICcuKj8nKSArICdcXFxcLic7XHJcbiAgICByZXR1cm4gUmVnZXhlcy5wYXJzZShzdHIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZmllbGRzOiBpZCwgbmFtZSwgaHAsIHgsIHksIHosIG5wY0lkLCBjYXB0dXJlXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzAzLWFkZGNvbWJhdGFudFxyXG4gICAqL1xyXG4gIHN0YXRpYyBhZGRlZENvbWJhdGFudEZ1bGwoXHJcbiAgICAgIGY/OiBQYXJhbXM8QWRkZWRDb21iYXRhbnRGdWxsUGFyYW1zPixcclxuICApOiBSZWdleDxBZGRlZENvbWJhdGFudEZ1bGxQYXJhbXM+IHtcclxuICAgIGlmICh0eXBlb2YgZiA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgIGYgPSB7fTtcclxuICAgIFJlZ2V4ZXMudmFsaWRhdGVQYXJhbXMoZiwgJ2FkZGVkQ29tYmF0YW50RnVsbCcsIGFkZGVkQ29tYmF0YW50RnVsbFBhcmFtcyk7XHJcbiAgICBjb25zdCBjYXB0dXJlID0gUmVnZXhlcy50cnVlSWZVbmRlZmluZWQoZi5jYXB0dXJlKTtcclxuICAgIGNvbnN0IHN0ciA9IFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0aW1lc3RhbXAnLCAnXFxcXHl7VGltZXN0YW1wfScpICtcclxuICAgICAgJyAwMzonICsgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2lkJywgZi5pZCwgJ1xcXFx5e09iamVjdElkfScpICtcclxuICAgICAgJzpBZGRlZCBuZXcgY29tYmF0YW50ICcgKyBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnbmFtZScsIGYubmFtZSwgJ1teOl0qPycpICtcclxuICAgICAgJ1xcXFwuIHsyfUpvYjogJyArIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdqb2InLCBmLmpvYiwgJ1teOl0qPycpICtcclxuICAgICAgJyBMZXZlbDogJyArIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdsZXZlbCcsIGYubGV2ZWwsICdbXjpdKj8nKSArXHJcbiAgICAgICcgTWF4IEhQOiAnICsgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2hwJywgZi5ocCwgJ1swLTldKycpICsgJ1xcLicgK1xyXG4gICAgICAnLio/UG9zOiBcXFxcKCcgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAneCcsIGYueCwgJ1xcXFx5e0Zsb2F0fScpICsgJywnICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3knLCBmLnksICdcXFxceXtGbG9hdH0nKSArICcsJyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd6JywgZi56LCAnXFxcXHl7RmxvYXR9JykgKyAnXFxcXCknICtcclxuICAgICAgJyg/OiBcXFxcKCcgKyBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnbnBjSWQnLCBmLm5wY0lkLCAnLio/JykgKyAnXFxcXCkpP1xcXFwuJztcclxuICAgIHJldHVybiBSZWdleGVzLnBhcnNlKHN0cik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBmaWVsZHM6IGlkLCBuYW1lLCBocCwgY2FwdHVyZVxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMwNC1yZW1vdmVjb21iYXRhbnRcclxuICAgKi9cclxuICBzdGF0aWMgcmVtb3ZpbmdDb21iYXRhbnQoZj86IFBhcmFtczxSZW1vdmluZ0NvbWJhdGFudFBhcmFtcz4pOiBSZWdleDxSZW1vdmluZ0NvbWJhdGFudFBhcmFtcz4ge1xyXG4gICAgaWYgKHR5cGVvZiBmID09PSAndW5kZWZpbmVkJylcclxuICAgICAgZiA9IHt9O1xyXG4gICAgUmVnZXhlcy52YWxpZGF0ZVBhcmFtcyhmLCAncmVtb3ZpbmdDb21iYXRhbnQnLCByZW1vdmluZ0NvbWJhdGFudFBhcmFtcyk7XHJcbiAgICBjb25zdCBjYXB0dXJlID0gUmVnZXhlcy50cnVlSWZVbmRlZmluZWQoZi5jYXB0dXJlKTtcclxuICAgIGNvbnN0IHN0ciA9IFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0aW1lc3RhbXAnLCAnXFxcXHl7VGltZXN0YW1wfScpICtcclxuICAgICAgJyAwNDonICsgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2lkJywgJ1xcXFx5e09iamVjdElkfScpICtcclxuICAgICAgJzpSZW1vdmluZyBjb21iYXRhbnQgJyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICduYW1lJywgZi5uYW1lLCAnLio/JykgKyAnXFxcXC4nICtcclxuICAgICAgJy4qP01heCBIUDogJyArIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdocCcsIGYuaHAsICdbMC05XSsnKSArICdcXC4nICtcclxuICAgICAgUmVnZXhlcy5vcHRpb25hbCgnLio/UG9zOiBcXFxcKCcgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAneCcsIGYueCwgJ1xcXFx5e0Zsb2F0fScpICsgJywnICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3knLCBmLnksICdcXFxceXtGbG9hdH0nKSArICcsJyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd6JywgZi56LCAnXFxcXHl7RmxvYXR9JykgKyAnXFxcXCknKTtcclxuICAgIHJldHVybiBSZWdleGVzLnBhcnNlKHN0cik7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gZmllbGRzOiB0YXJnZXRJZCwgdGFyZ2V0LCBlZmZlY3QsIHNvdXJjZSwgZHVyYXRpb24sIGNhcHR1cmVcclxuICAvLyBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMWEtbmV0d29ya2J1ZmZcclxuICBzdGF0aWMgZ2FpbnNFZmZlY3QoZj86IFBhcmFtczxHYWluc0VmZmVjdFBhcmFtcz4pOiBSZWdleDxHYWluc0VmZmVjdFBhcmFtcz4ge1xyXG4gICAgaWYgKHR5cGVvZiBmID09PSAndW5kZWZpbmVkJylcclxuICAgICAgZiA9IHt9O1xyXG4gICAgUmVnZXhlcy52YWxpZGF0ZVBhcmFtcyhmLCAnZ2FpbnNFZmZlY3QnLCBnYWluc0VmZmVjdFBhcmFtcyk7XHJcbiAgICBjb25zdCBjYXB0dXJlID0gUmVnZXhlcy50cnVlSWZVbmRlZmluZWQoZi5jYXB0dXJlKTtcclxuICAgIGNvbnN0IHN0ciA9IFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0aW1lc3RhbXAnLCAnXFxcXHl7VGltZXN0YW1wfScpICtcclxuICAgICAgJyAxQTonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RhcmdldElkJywgZi50YXJnZXRJZCwgJ1xcXFx5e09iamVjdElkfScpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RhcmdldCcsIGYudGFyZ2V0LCAnLio/JykgK1xyXG4gICAgICAnIGdhaW5zIHRoZSBlZmZlY3Qgb2YgJyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdlZmZlY3QnLCBmLmVmZmVjdCwgJy4qPycpICtcclxuICAgICAgJyBmcm9tICcgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnc291cmNlJywgZi5zb3VyY2UsICcuKj8nKSArXHJcbiAgICAgICcgZm9yICcgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnZHVyYXRpb24nLCBmLmR1cmF0aW9uLCAnXFxcXHl7RmxvYXR9JykgK1xyXG4gICAgICAnIFNlY29uZHNcXFxcLic7XHJcbiAgICByZXR1cm4gUmVnZXhlcy5wYXJzZShzdHIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUHJlZmVyIGdhaW5zRWZmZWN0IG92ZXIgdGhpcyBmdW5jdGlvbiB1bmxlc3MgeW91IHJlYWxseSBuZWVkIGV4dHJhIGRhdGEuXHJcbiAgICogZmllbGRzOiB0YXJnZXRJZCwgdGFyZ2V0LCBqb2IsIGhwLCBtYXhIcCwgbXAsIG1heE1wLCB4LCB5LCB6LCBoZWFkaW5nLFxyXG4gICAqICAgICAgICAgZGF0YTAsIGRhdGExLCBkYXRhMiwgZGF0YTMsIGRhdGE0XHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzI2LW5ldHdvcmtzdGF0dXNlZmZlY3RzXHJcbiAgICovXHJcbiAgc3RhdGljIHN0YXR1c0VmZmVjdEV4cGxpY2l0KFxyXG4gICAgICBmPzogUGFyYW1zPFN0YXR1c0VmZmVjdEV4cGxpY2l0UGFyYW1zPixcclxuICApOiBSZWdleDxTdGF0dXNFZmZlY3RFeHBsaWNpdFBhcmFtcz4ge1xyXG4gICAgaWYgKHR5cGVvZiBmID09PSAndW5kZWZpbmVkJylcclxuICAgICAgZiA9IHt9O1xyXG4gICAgUmVnZXhlcy52YWxpZGF0ZVBhcmFtcyhmLCAnc3RhdHVzRWZmZWN0RXhwbGljaXQnLCBzdGF0dXNFZmZlY3RFeHBsaWNpdFBhcmFtcyk7XHJcbiAgICBjb25zdCBjYXB0dXJlID0gUmVnZXhlcy50cnVlSWZVbmRlZmluZWQoZi5jYXB0dXJlKTtcclxuXHJcbiAgICBjb25zdCBrRmllbGQgPSAnLio/Oic7XHJcblxyXG4gICAgY29uc3Qgc3RyID0gUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RpbWVzdGFtcCcsICdcXFxceXtUaW1lc3RhbXB9JykgK1xyXG4gICAgICAnIDI2OicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGFyZ2V0SWQnLCBmLnRhcmdldElkLCAnXFxcXHl7T2JqZWN0SWR9JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGFyZ2V0JywgZi50YXJnZXQsICdbXjpdKj8nKSArICc6JyArXHJcbiAgICAgICdbMC05QS1GXXswLDZ9JyArIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdqb2InLCBmLmpvYiwgJ1swLTlBLUZdezAsMn0nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdocCcsIGYuaHAsICdcXFxceXtGbG9hdH0nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdtYXhIcCcsIGYubWF4SHAsICdcXFxceXtGbG9hdH0nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdtcCcsIGYubXAsICdcXFxceXtGbG9hdH0nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdtYXhNcCcsIGYubWF4TXAsICdcXFxceXtGbG9hdH0nKSArICc6JyArXHJcbiAgICAgIGtGaWVsZCArIC8vIHRwIGxvbFxyXG4gICAgICBrRmllbGQgKyAvLyBtYXggdHAgZXh0cmEgbG9sXHJcbiAgICAgIC8vIHgsIHksIHogaGVhZGluZyBtYXkgYmUgYmxhbmtcclxuICAgICAgUmVnZXhlcy5vcHRpb25hbChSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAneCcsIGYueCwgJ1xcXFx5e0Zsb2F0fScpKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMub3B0aW9uYWwoUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3knLCBmLnksICdcXFxceXtGbG9hdH0nKSkgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm9wdGlvbmFsKFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd6JywgZi56LCAnXFxcXHl7RmxvYXR9JykpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5vcHRpb25hbChSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnaGVhZGluZycsIGYuaGVhZGluZywgJ1xcXFx5e0Zsb2F0fScpKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdkYXRhMCcsIGYuZGF0YTAsICdbXjpdKj8nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdkYXRhMScsIGYuZGF0YTEsICdbXjpdKj8nKSArICc6JyArXHJcbiAgICAgIC8vIGRhdGEyLCAzLCA0IG1heSBub3QgZXhpc3QgYW5kIHRoZSBsaW5lIG1heSB0ZXJtaW5hdGUuXHJcbiAgICAgIFJlZ2V4ZXMub3B0aW9uYWwoUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2RhdGEyJywgZi5kYXRhMiwgJ1teOl0qPycpICsgJzonKSArXHJcbiAgICAgIFJlZ2V4ZXMub3B0aW9uYWwoUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2RhdGEzJywgZi5kYXRhMywgJ1teOl0qPycpICsgJzonKSArXHJcbiAgICAgIFJlZ2V4ZXMub3B0aW9uYWwoUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2RhdGE0JywgZi5kYXRhNCwgJ1teOl0qPycpICsgJzonKTtcclxuICAgIHJldHVybiBSZWdleGVzLnBhcnNlKHN0cik7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogZmllbGRzOiB0YXJnZXRJZCwgdGFyZ2V0LCBlZmZlY3QsIHNvdXJjZSwgY2FwdHVyZVxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMxZS1uZXR3b3JrYnVmZnJlbW92ZVxyXG4gICAqL1xyXG4gIHN0YXRpYyBsb3Nlc0VmZmVjdChmPzogUGFyYW1zPExvc2VzRWZmZWN0UGFyYW1zPik6IFJlZ2V4PExvc2VzRWZmZWN0UGFyYW1zPiB7XHJcbiAgICBpZiAodHlwZW9mIGYgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICBmID0ge307XHJcbiAgICBSZWdleGVzLnZhbGlkYXRlUGFyYW1zKGYsICdsb3Nlc0VmZmVjdCcsIGxvc2VzRWZmZWN0UGFyYW1zKTtcclxuICAgIGNvbnN0IGNhcHR1cmUgPSBSZWdleGVzLnRydWVJZlVuZGVmaW5lZChmLmNhcHR1cmUpO1xyXG4gICAgY29uc3Qgc3RyID0gUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RpbWVzdGFtcCcsICdcXFxceXtUaW1lc3RhbXB9JykgK1xyXG4gICAgICAnIDFFOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGFyZ2V0SWQnLCBmLnRhcmdldElkLCAnXFxcXHl7T2JqZWN0SWR9JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGFyZ2V0JywgZi50YXJnZXQsICcuKj8nKSArXHJcbiAgICAgICcgbG9zZXMgdGhlIGVmZmVjdCBvZiAnICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2VmZmVjdCcsIGYuZWZmZWN0LCAnLio/JykgK1xyXG4gICAgICAnIGZyb20gJyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdzb3VyY2UnLCBmLnNvdXJjZSwgJy4qPycpICsgJ1xcXFwuJztcclxuICAgIHJldHVybiBSZWdleGVzLnBhcnNlKHN0cik7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogZmllbGRzOiBzb3VyY2UsIHNvdXJjZUlkLCB0YXJnZXQsIHRhcmdldElkLCBpZCwgY2FwdHVyZVxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMyMy1uZXR3b3JrdGV0aGVyXHJcbiAgICovXHJcbiAgc3RhdGljIHRldGhlcihmPzogUGFyYW1zPFRldGhlclBhcmFtcz4pOiBSZWdleDxUZXRoZXJQYXJhbXM+IHtcclxuICAgIGlmICh0eXBlb2YgZiA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgIGYgPSB7fTtcclxuICAgIFJlZ2V4ZXMudmFsaWRhdGVQYXJhbXMoZiwgJ3RldGhlcicsIHRldGhlclBhcmFtcyk7XHJcbiAgICBjb25zdCBjYXB0dXJlID0gUmVnZXhlcy50cnVlSWZVbmRlZmluZWQoZi5jYXB0dXJlKTtcclxuICAgIGNvbnN0IHN0ciA9IFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0aW1lc3RhbXAnLCAnXFxcXHl7VGltZXN0YW1wfScpICtcclxuICAgICAgJyAyMzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3NvdXJjZUlkJywgZi5zb3VyY2VJZCwgJ1xcXFx5e09iamVjdElkfScpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3NvdXJjZScsIGYuc291cmNlLCAnW146XSo/JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGFyZ2V0SWQnLCBmLnRhcmdldElkLCAnXFxcXHl7T2JqZWN0SWR9JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGFyZ2V0JywgZi50YXJnZXQsICdbXjpdKj8nKSArXHJcbiAgICAgICc6Li4uLjouLi4uOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnaWQnLCBmLmlkLCAnLi4uLicpICsgJzonO1xyXG4gICAgcmV0dXJuIFJlZ2V4ZXMucGFyc2Uoc3RyKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiAndGFyZ2V0JyB3YXMgZGVmZWF0ZWQgYnkgJ3NvdXJjZSdcclxuICAgKiBmaWVsZHM6IHRhcmdldCwgc291cmNlLCBjYXB0dXJlXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzE5LW5ldHdvcmtkZWF0aFxyXG4gICAqL1xyXG4gIHN0YXRpYyB3YXNEZWZlYXRlZChmPzogUGFyYW1zPFdhc0RlZmVhdGVkUGFyYW1zPik6IFJlZ2V4PFdhc0RlZmVhdGVkUGFyYW1zPiB7XHJcbiAgICBpZiAodHlwZW9mIGYgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICBmID0ge307XHJcbiAgICBSZWdleGVzLnZhbGlkYXRlUGFyYW1zKGYsICd3YXNEZWZlYXRlZCcsIHdhc0RlZmVhdGVkUGFyYW1zKTtcclxuICAgIGNvbnN0IGNhcHR1cmUgPSBSZWdleGVzLnRydWVJZlVuZGVmaW5lZChmLmNhcHR1cmUpO1xyXG4gICAgY29uc3Qgc3RyID0gUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RpbWVzdGFtcCcsICdcXFxceXtUaW1lc3RhbXB9JykgK1xyXG4gICAgICAnIDE5OicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGFyZ2V0JywgZi50YXJnZXQsICcuKj8nKSArXHJcbiAgICAgICcgd2FzIGRlZmVhdGVkIGJ5ICcgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnc291cmNlJywgZi5zb3VyY2UsICcuKj8nKSArICdcXFxcLic7XHJcbiAgICByZXR1cm4gUmVnZXhlcy5wYXJzZShzdHIpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGZpZWxkczogbmFtZSwgaHAsIGNhcHR1cmVcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMGQtY29tYmF0YW50aHBcclxuICAgKi9cclxuICBzdGF0aWMgaGFzSFAoZj86IFBhcmFtczxIYXNIUFBhcmFtcz4pOiBSZWdleDxIYXNIUFBhcmFtcz4ge1xyXG4gICAgaWYgKHR5cGVvZiBmID09PSAndW5kZWZpbmVkJylcclxuICAgICAgZiA9IHt9O1xyXG4gICAgUmVnZXhlcy52YWxpZGF0ZVBhcmFtcyhmLCAnaGFzSFAnLCBoYXNIUFBhcmFtcyk7XHJcbiAgICBjb25zdCBjYXB0dXJlID0gUmVnZXhlcy50cnVlSWZVbmRlZmluZWQoZi5jYXB0dXJlKTtcclxuICAgIGNvbnN0IHN0ciA9IFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0aW1lc3RhbXAnLCAnXFxcXHl7VGltZXN0YW1wfScpICtcclxuICAgICAgJyAwRDonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ25hbWUnLCBmLm5hbWUsICcuKj8nKSArXHJcbiAgICAgICcgSFAgYXQgJyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdocCcsIGYuaHAsICdcXFxcZCsnKSArICclJztcclxuICAgIHJldHVybiBSZWdleGVzLnBhcnNlKHN0cik7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogZmllbGRzOiBjb2RlLCBsaW5lLCBjYXB0dXJlXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzAwLWxvZ2xpbmVcclxuICAgKi9cclxuICBzdGF0aWMgZWNobyhmPzogUGFyYW1zPEVjaG9QYXJhbXM+KTogUmVnZXg8RWNob1BhcmFtcz4ge1xyXG4gICAgaWYgKHR5cGVvZiBmID09PSAndW5kZWZpbmVkJylcclxuICAgICAgZiA9IHt9O1xyXG4gICAgUmVnZXhlcy52YWxpZGF0ZVBhcmFtcyhmLCAnZWNobycsIGVjaG9QYXJhbXMpO1xyXG4gICAgcmV0dXJuIFJlZ2V4ZXMuZ2FtZUxvZyh7XHJcbiAgICAgIGxpbmU6IGYubGluZSxcclxuICAgICAgY2FwdHVyZTogZi5jYXB0dXJlLFxyXG4gICAgICBjb2RlOiAnMDAzOCcsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBmaWVsZHM6IGNvZGUsIGxpbmUsIG5hbWUsIGNhcHR1cmVcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMDAtbG9nbGluZVxyXG4gICAqL1xyXG4gIHN0YXRpYyBkaWFsb2coZj86IFBhcmFtczxEaWFsb2dQYXJhbXM+KTogUmVnZXg8RGlhbG9nUGFyYW1zPiB7XHJcbiAgICBpZiAodHlwZW9mIGYgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICBmID0ge307XHJcbiAgICBSZWdleGVzLnZhbGlkYXRlUGFyYW1zKGYsICdkaWFsb2cnLCBkaWFsb2dQYXJhbXMpO1xyXG4gICAgY29uc3QgY2FwdHVyZSA9IFJlZ2V4ZXMudHJ1ZUlmVW5kZWZpbmVkKGYuY2FwdHVyZSk7XHJcbiAgICBjb25zdCBzdHIgPSBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGltZXN0YW1wJywgJ1xcXFx5e1RpbWVzdGFtcH0nKSArXHJcbiAgICAgICcgMDA6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdjb2RlJywgJzAwNDQnKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICduYW1lJywgZi5uYW1lLCAnLio/JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnbGluZScsIGYubGluZSwgJy4qJykgKyAnJCc7XHJcbiAgICByZXR1cm4gUmVnZXhlcy5wYXJzZShzdHIpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGZpZWxkczogY29kZSwgbGluZSwgY2FwdHVyZVxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMwMC1sb2dsaW5lXHJcbiAgICovXHJcbiAgc3RhdGljIG1lc3NhZ2UoZj86IFBhcmFtczxNZXNzYWdlUGFyYW1zPik6IFJlZ2V4PE1lc3NhZ2VQYXJhbXM+IHtcclxuICAgIGlmICh0eXBlb2YgZiA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgIGYgPSB7fTtcclxuICAgIFJlZ2V4ZXMudmFsaWRhdGVQYXJhbXMoZiwgJ21lc3NhZ2UnLCBtZXNzYWdlUGFyYW1zKTtcclxuICAgIHJldHVybiBSZWdleGVzLmdhbWVMb2coe1xyXG4gICAgICBsaW5lOiBmLmxpbmUsXHJcbiAgICAgIGNhcHR1cmU6IGYuY2FwdHVyZSxcclxuICAgICAgY29kZTogJzA4MzknLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBmaWVsZHM6IGNvZGUsIGxpbmUsIGNhcHR1cmVcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMDAtbG9nbGluZVxyXG4gICAqL1xyXG4gIHN0YXRpYyBnYW1lTG9nKGY/OiBQYXJhbXM8R2FtZUxvZ1BhcmFtcz4pOiBSZWdleDxHYW1lTG9nUGFyYW1zPiB7XHJcbiAgICBpZiAodHlwZW9mIGYgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICBmID0ge307XHJcbiAgICBSZWdleGVzLnZhbGlkYXRlUGFyYW1zKGYsICdnYW1lTG9nJywgZ2FtZUxvZ1BhcmFtcyk7XHJcbiAgICBjb25zdCBjYXB0dXJlID0gUmVnZXhlcy50cnVlSWZVbmRlZmluZWQoZi5jYXB0dXJlKTtcclxuICAgIGNvbnN0IHN0ciA9IFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0aW1lc3RhbXAnLCAnXFxcXHl7VGltZXN0YW1wfScpICtcclxuICAgICAgJyAwMDonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2NvZGUnLCBmLmNvZGUsICcuLi4uJykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnbGluZScsIGYubGluZSwgJy4qJykgKyAnJCc7XHJcbiAgICByZXR1cm4gUmVnZXhlcy5wYXJzZShzdHIpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGZpZWxkczogY29kZSwgbmFtZSwgbGluZSwgY2FwdHVyZVxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMwMC1sb2dsaW5lXHJcbiAgICogU29tZSBnYW1lIGxvZyBsaW5lcyBoYXZlIG5hbWVzIGluIHRoZW0sIGJ1dCBub3QgYWxsLiAgQWxsIG5ldHdvcmsgbG9nIGxpbmVzIGZvciB0aGVzZVxyXG4gICAqIGhhdmUgZW1wdHkgZmllbGRzLCBidXQgdGhlc2UgZ2V0IGRyb3BwZWQgYnkgdGhlIEFDVCBGRlhWIHBsdWdpbi5cclxuICAgKi9cclxuICBzdGF0aWMgZ2FtZU5hbWVMb2coZj86IFBhcmFtczxHYW1lTmFtZUxvZ1BhcmFtcz4pOiBSZWdleDxHYW1lTmFtZUxvZ1BhcmFtcz4ge1xyXG4gICAgaWYgKHR5cGVvZiBmID09PSAndW5kZWZpbmVkJylcclxuICAgICAgZiA9IHt9O1xyXG4gICAgUmVnZXhlcy52YWxpZGF0ZVBhcmFtcyhmLCAnZ2FtZU5hbWVMb2cnLCBnYW1lTmFtZUxvZ1BhcmFtcyk7XHJcbiAgICBjb25zdCBjYXB0dXJlID0gUmVnZXhlcy50cnVlSWZVbmRlZmluZWQoZi5jYXB0dXJlKTtcclxuICAgIGNvbnN0IHN0ciA9IFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0aW1lc3RhbXAnLCAnXFxcXHl7VGltZXN0YW1wfScpICtcclxuICAgICAgJyAwMDonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2NvZGUnLCBmLmNvZGUsICcuLi4uJykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnbmFtZScsIGYubmFtZSwgJ1teOl0qJykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnbGluZScsIGYubGluZSwgJy4qJykgKyAnJCc7XHJcbiAgICByZXR1cm4gUmVnZXhlcy5wYXJzZShzdHIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZmllbGRzOiBqb2IsIHN0cmVuZ3RoLCBkZXh0ZXJpdHksIHZpdGFsaXR5LCBpbnRlbGxpZ2VuY2UsIG1pbmQsIHBpZXR5LCBhdHRhY2tQb3dlcixcclxuICAgKiAgICAgICAgIGRpcmVjdEhpdCwgY3JpdGljYWxIaXQsIGF0dGFja01hZ2ljUG90ZW5jeSwgaGVhbE1hZ2ljUG90ZW5jeSwgZGV0ZXJtaW5hdGlvbixcclxuICAgKiAgICAgICAgIHNraWxsU3BlZWQsIHNwZWxsU3BlZWQsIHRlbmFjaXR5LCBjYXB0dXJlXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzBjLXBsYXllcnN0YXRzXHJcbiAgICovXHJcbiAgc3RhdGljIHN0YXRDaGFuZ2UoZj86IFBhcmFtczxTdGF0Q2hhbmdlUGFyYW1zPik6IFJlZ2V4PFN0YXRDaGFuZ2VQYXJhbXM+IHtcclxuICAgIGlmICh0eXBlb2YgZiA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgIGYgPSB7fTtcclxuICAgIFJlZ2V4ZXMudmFsaWRhdGVQYXJhbXMoZiwgJ3N0YXRDaGFuZ2UnLCBzdGF0Q2hhbmdlUGFyYW1zKTtcclxuICAgIGNvbnN0IGNhcHR1cmUgPSBSZWdleGVzLnRydWVJZlVuZGVmaW5lZChmLmNhcHR1cmUpO1xyXG4gICAgY29uc3Qgc3RyID0gUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RpbWVzdGFtcCcsICdcXFxceXtUaW1lc3RhbXB9JykgK1xyXG4gICAgICAnIDBDOlBsYXllciBTdGF0czogJyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdqb2InLCBmLmpvYiwgJ1xcXFxkKycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3N0cmVuZ3RoJywgZi5zdHJlbmd0aCwgJ1xcXFxkKycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2RleHRlcml0eScsIGYuZGV4dGVyaXR5LCAnXFxcXGQrJykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndml0YWxpdHknLCBmLnZpdGFsaXR5LCAnXFxcXGQrJykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnaW50ZWxsaWdlbmNlJywgZi5pbnRlbGxpZ2VuY2UsICdcXFxcZCsnKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdtaW5kJywgZi5taW5kLCAnXFxcXGQrJykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAncGlldHknLCBmLnBpZXR5LCAnXFxcXGQrJykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnYXR0YWNrUG93ZXInLCBmLmF0dGFja1Bvd2VyLCAnXFxcXGQrJykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnZGlyZWN0SGl0JywgZi5kaXJlY3RIaXQsICdcXFxcZCsnKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdjcml0aWNhbEhpdCcsIGYuY3JpdGljYWxIaXQsICdcXFxcZCsnKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdhdHRhY2tNYWdpY1BvdGVuY3knLCBmLmF0dGFja01hZ2ljUG90ZW5jeSwgJ1xcXFxkKycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ2hlYWxNYWdpY1BvdGVuY3knLCBmLmhlYWxNYWdpY1BvdGVuY3ksICdcXFxcZCsnKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdkZXRlcm1pbmF0aW9uJywgZi5kZXRlcm1pbmF0aW9uLCAnXFxcXGQrJykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnc2tpbGxTcGVlZCcsIGYuc2tpbGxTcGVlZCwgJ1xcXFxkKycpICsgJzonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3NwZWxsU3BlZWQnLCBmLnNwZWxsU3BlZWQsICdcXFxcZCsnKSArXHJcbiAgICAgICc6MDonICtcclxuICAgICAgUmVnZXhlcy5tYXliZUNhcHR1cmUoY2FwdHVyZSwgJ3RlbmFjaXR5JywgZi50ZW5hY2l0eSwgJ1xcXFxkKycpO1xyXG4gICAgcmV0dXJuIFJlZ2V4ZXMucGFyc2Uoc3RyKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBmaWVsZHM6IG5hbWUsIGNhcHR1cmVcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMDEtY2hhbmdlem9uZVxyXG4gICAqL1xyXG4gIHN0YXRpYyBjaGFuZ2Vab25lKGY/OiBQYXJhbXM8Q2hhbmdlWm9uZVBhcmFtcz4pOiBSZWdleDxDaGFuZ2Vab25lUGFyYW1zPiB7XHJcbiAgICBpZiAodHlwZW9mIGYgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICBmID0ge307XHJcbiAgICBSZWdleGVzLnZhbGlkYXRlUGFyYW1zKGYsICdjaGFuZ2Vab25lJywgY2hhbmdlWm9uZVBhcmFtcyk7XHJcbiAgICBjb25zdCBjYXB0dXJlID0gUmVnZXhlcy50cnVlSWZVbmRlZmluZWQoZi5jYXB0dXJlKTtcclxuICAgIGNvbnN0IHN0ciA9IFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICd0aW1lc3RhbXAnLCAnXFxcXHl7VGltZXN0YW1wfScpICtcclxuICAgICAgJyAwMTpDaGFuZ2VkIFpvbmUgdG8gJyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICduYW1lJywgZi5uYW1lLCAnLio/JykgKyAnXFxcXC4nO1xyXG4gICAgcmV0dXJuIFJlZ2V4ZXMucGFyc2Uoc3RyKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBmaWVsZHM6IGluc3RhbmNlLCBjb21tYW5kLCBkYXRhMCwgZGF0YTEsIGRhdGEyLCBkYXRhM1xyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMyMS1uZXR3b3JrNmQtYWN0b3ItY29udHJvbC1saW5lc1xyXG4gICAqL1xyXG4gIHN0YXRpYyBuZXR3b3JrNmQoZj86IFBhcmFtczxOZXR3b3JrNmRQYXJhbXM+KTogUmVnZXg8TmV0d29yazZkUGFyYW1zPiB7XHJcbiAgICBpZiAodHlwZW9mIGYgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICBmID0ge307XHJcbiAgICBSZWdleGVzLnZhbGlkYXRlUGFyYW1zKGYsICduZXR3b3JrNmQnLCBuZXR3b3JrNmRQYXJhbXMpO1xyXG4gICAgY29uc3QgY2FwdHVyZSA9IFJlZ2V4ZXMudHJ1ZUlmVW5kZWZpbmVkKGYuY2FwdHVyZSk7XHJcbiAgICBjb25zdCBzdHIgPSBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAndGltZXN0YW1wJywgJ1xcXFx5e1RpbWVzdGFtcH0nKSArXHJcbiAgICAgICcgMjE6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdpbnN0YW5jZScsIGYuaW5zdGFuY2UsICcuKj8nKSArICc6JyArXHJcbiAgICAgIFJlZ2V4ZXMubWF5YmVDYXB0dXJlKGNhcHR1cmUsICdjb21tYW5kJywgZi5jb21tYW5kLCAnLio/JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnZGF0YTAnLCBmLmRhdGEwLCAnLio/JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnZGF0YTEnLCBmLmRhdGExLCAnLio/JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnZGF0YTInLCBmLmRhdGEyLCAnLio/JykgKyAnOicgK1xyXG4gICAgICBSZWdleGVzLm1heWJlQ2FwdHVyZShjYXB0dXJlLCAnZGF0YTMnLCBmLmRhdGEzLCAnLio/JykgKyAnJCc7XHJcbiAgICByZXR1cm4gUmVnZXhlcy5wYXJzZShzdHIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGVscGVyIGZ1bmN0aW9uIGZvciBidWlsZGluZyBuYW1lZCBjYXB0dXJlIGdyb3VwXHJcbiAgICovXHJcbiAgc3RhdGljIG1heWJlQ2FwdHVyZShcclxuICAgICAgY2FwdHVyZTogYm9vbGVhbixcclxuICAgICAgbmFtZTogc3RyaW5nLFxyXG4gICAgICB2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10gfCB1bmRlZmluZWQsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZT86IHN0cmluZyxcclxuICApOiBzdHJpbmcge1xyXG4gICAgaWYgKCF2YWx1ZSlcclxuICAgICAgdmFsdWUgPSBkZWZhdWx0VmFsdWU7XHJcbiAgICB2YWx1ZSA9IFJlZ2V4ZXMuYW55T2YodmFsdWUgYXMgVmFsaWRTdHJpbmdPckFycmF5KTtcclxuICAgIHJldHVybiBjYXB0dXJlID8gUmVnZXhlcy5uYW1lZENhcHR1cmUobmFtZSwgdmFsdWUpIDogdmFsdWU7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgb3B0aW9uYWwoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGAoPzoke3N0cn0pP2A7XHJcbiAgfVxyXG5cclxuICAvLyBDcmVhdGVzIGEgbmFtZWQgcmVnZXggY2FwdHVyZSBncm91cCBuYW1lZCB8bmFtZXwgZm9yIHRoZSBtYXRjaCB8dmFsdWV8LlxyXG4gIHN0YXRpYyBuYW1lZENhcHR1cmUobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmIChuYW1lLmluY2x1ZGVzKCc+JykpXHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1wiJyArIG5hbWUgKyAnXCIgY29udGFpbnMgXCI+XCIuJyk7XHJcbiAgICBpZiAobmFtZS5pbmNsdWRlcygnPCcpKVxyXG4gICAgICBjb25zb2xlLmVycm9yKCdcIicgKyBuYW1lICsgJ1wiIGNvbnRhaW5zIFwiPlwiLicpO1xyXG5cclxuICAgIHJldHVybiAnKD88JyArIG5hbWUgKyAnPicgKyB2YWx1ZSArICcpJztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnZlbmllbmNlIGZvciB0dXJuaW5nIG11bHRpcGxlIGFyZ3MgaW50byBhIHVuaW9uZWQgcmVndWxhciBleHByZXNzaW9uLlxyXG4gICAqIGFueU9mKHgsIHksIHopIG9yIGFueU9mKFt4LCB5LCB6XSkgZG8gdGhlIHNhbWUgdGhpbmcsIGFuZCByZXR1cm4gKD86eHx5fHopLlxyXG4gICAqIGFueU9mKHgpIG9yIGFueU9mKHgpIG9uIGl0cyBvd24gc2ltcGxpZmllcyB0byBqdXN0IHguXHJcbiAgICogYXJncyBtYXkgYmUgc3RyaW5ncyBvciBSZWdFeHAsIGFsdGhvdWdoIGFueSBhZGRpdGlvbmFsIG1hcmtlcnMgdG8gUmVnRXhwXHJcbiAgICogbGlrZSAvaW5zZW5zaXRpdmUvaSBhcmUgZHJvcHBlZC5cclxuICAgKi9cclxuICBzdGF0aWMgYW55T2YoLi4uYXJnczogKHN0cmluZ3xzdHJpbmdbXXxSZWdFeHApW10pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgYW55T2ZBcnJheSA9IChhcnJheTogKHN0cmluZ3xSZWdFeHApW10pOiBzdHJpbmcgPT4ge1xyXG4gICAgICByZXR1cm4gYCg/OiR7YXJyYXkubWFwKChlbGVtKSA9PiBlbGVtIGluc3RhbmNlb2YgUmVnRXhwID8gZWxlbS5zb3VyY2UgOiBlbGVtKS5qb2luKCd8Jyl9KWA7XHJcbiAgICB9O1xyXG4gICAgbGV0IGFycmF5OiAoc3RyaW5nfFJlZ0V4cClbXSA9IFtdO1xyXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3NbMF0pKVxyXG4gICAgICAgIGFycmF5ID0gYXJnc1swXTtcclxuICAgICAgZWxzZSBpZiAoYXJnc1swXSlcclxuICAgICAgICBhcnJheSA9IFthcmdzWzBdXTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGFycmF5ID0gW107XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBUT0RPOiBtb3JlIGFjY3VyYXRlIHR5cGUgaW5zdGVhZCBvZiBgYXNgIGNhc3RcclxuICAgICAgYXJyYXkgPSBhcmdzIGFzIHN0cmluZ1tdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFueU9mQXJyYXkoYXJyYXkpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHBhcnNlKHJlZ2V4cFN0cmluZzogUmVnRXhwIHwgc3RyaW5nKTogUmVnRXhwIHtcclxuICAgIGNvbnN0IGtDYWN0Ym90Q2F0ZWdvcmllcyA9IHtcclxuICAgICAgVGltZXN0YW1wOiAnXi57MTR9JyxcclxuICAgICAgTmV0VGltZXN0YW1wOiAnLnszM30nLFxyXG4gICAgICBOZXRGaWVsZDogJyg/OltefF0qXFxcXHwpJyxcclxuICAgICAgTG9nVHlwZTogJ1swLTlBLUZhLWZdezJ9JyxcclxuICAgICAgQWJpbGl0eUNvZGU6ICdbMC05QS1GYS1mXXsxLDh9JyxcclxuICAgICAgT2JqZWN0SWQ6ICdbMC05QS1GXXs4fScsXHJcbiAgICAgIC8vIE1hdGNoZXMgYW55IGNoYXJhY3RlciBuYW1lIChpbmNsdWRpbmcgZW1wdHkgc3RyaW5ncyB3aGljaCB0aGUgRkZYSVZcclxuICAgICAgLy8gQUNUIHBsdWdpbiBjYW4gZ2VuZXJhdGUgd2hlbiB1bmtub3duKS5cclxuICAgICAgTmFtZTogJyg/OlteXFxcXHM6fF0rKD86IFteXFxcXHM6fF0rKT98KScsXHJcbiAgICAgIC8vIEZsb2F0cyBjYW4gaGF2ZSBjb21tYSBhcyBzZXBhcmF0b3IgaW4gRkZYSVYgcGx1Z2luIG91dHB1dDogaHR0cHM6Ly9naXRodWIuY29tL3JhdmFobi9GRlhJVl9BQ1RfUGx1Z2luL2lzc3Vlcy8xMzdcclxuICAgICAgRmxvYXQ6ICctP1swLTldKyg/OlsuLF1bMC05XSspPyg/OkUtP1swLTldKyk/JyxcclxuICAgIH07XHJcblxyXG4gICAgLy8gQWxsIHJlZ2V4ZXMgaW4gY2FjdGJvdCBhcmUgY2FzZSBpbnNlbnNpdGl2ZS5cclxuICAgIC8vIFRoaXMgYXZvaWRzIGhlYWRhY2hlcyBhcyB0aGluZ3MgbGlrZSBgVmljZSBhbmQgVmFuaXR5YCB0dXJucyBpbnRvXHJcbiAgICAvLyBgVmljZSBBbmQgVmFuaXR5YCwgZXNwZWNpYWxseSBmb3IgRnJlbmNoIGFuZCBHZXJtYW4uICBJdCBhcHBlYXJzIHRvXHJcbiAgICAvLyBoYXZlIGEgfjIwJSByZWdleCBwYXJzaW5nIG92ZXJoZWFkLCBidXQgYXQgbGVhc3QgdGhleSB3b3JrLlxyXG4gICAgbGV0IG1vZGlmaWVycyA9ICdpJztcclxuICAgIGlmIChyZWdleHBTdHJpbmcgaW5zdGFuY2VvZiBSZWdFeHApIHtcclxuICAgICAgbW9kaWZpZXJzICs9IChyZWdleHBTdHJpbmcuZ2xvYmFsID8gJ2cnIDogJycpICtcclxuICAgICAgICAgICAgICAgICAgICAocmVnZXhwU3RyaW5nLm11bHRpbGluZSA/ICdtJyA6ICcnKTtcclxuICAgICAgcmVnZXhwU3RyaW5nID0gcmVnZXhwU3RyaW5nLnNvdXJjZTtcclxuICAgIH1cclxuICAgIHJlZ2V4cFN0cmluZyA9IHJlZ2V4cFN0cmluZy5yZXBsYWNlKC9cXFxceVxceyguKj8pXFx9L2csIChtYXRjaCwgZ3JvdXApID0+IHtcclxuICAgICAgcmV0dXJuIGtDYWN0Ym90Q2F0ZWdvcmllc1tncm91cCBhcyBrZXlvZiB0eXBlb2Yga0NhY3Rib3RDYXRlZ29yaWVzXSB8fCBtYXRjaDtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAocmVnZXhwU3RyaW5nLCBtb2RpZmllcnMpO1xyXG4gIH1cclxuXHJcbiAgLy8gTGlrZSBSZWdleC5SZWdleGVzLnBhcnNlLCBidXQgZm9yY2UgZ2xvYmFsIGZsYWcuXHJcbiAgc3RhdGljIHBhcnNlR2xvYmFsKHJlZ2V4cFN0cmluZzogUmVnRXhwIHwgc3RyaW5nKTogUmVnRXhwIHtcclxuICAgIGNvbnN0IHJlZ2V4ID0gUmVnZXhlcy5wYXJzZShyZWdleHBTdHJpbmcpO1xyXG4gICAgbGV0IG1vZGlmaWVycyA9ICdnaSc7XHJcbiAgICBpZiAocmVnZXhwU3RyaW5nIGluc3RhbmNlb2YgUmVnRXhwKVxyXG4gICAgICBtb2RpZmllcnMgKz0gKHJlZ2V4cFN0cmluZy5tdWx0aWxpbmUgPyAnbScgOiAnJyk7XHJcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChyZWdleC5zb3VyY2UsIG1vZGlmaWVycyk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgdHJ1ZUlmVW5kZWZpbmVkKHZhbHVlPzogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHR5cGVvZiAodmFsdWUpID09PSAndW5kZWZpbmVkJylcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gISF2YWx1ZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyB2YWxpZGF0ZVBhcmFtcyhcclxuICAgICAgZjogUmVhZG9ubHk8eyBbczogc3RyaW5nXTogdW5rbm93biB9PixcclxuICAgICAgZnVuY05hbWU6IHN0cmluZyxcclxuICAgICAgcGFyYW1zOiBSZWFkb25seTxzdHJpbmdbXT4sXHJcbiAgKTogdm9pZCB7XHJcbiAgICBpZiAoZiA9PT0gbnVsbClcclxuICAgICAgcmV0dXJuO1xyXG4gICAgaWYgKHR5cGVvZiBmICE9PSAnb2JqZWN0JylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGYpO1xyXG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCBrZXlzLmxlbmd0aDsgKytrKSB7XHJcbiAgICAgIGNvbnN0IGtleSA9IGtleXNba107XHJcbiAgICAgIGlmIChrZXkgJiYgIXBhcmFtcy5pbmNsdWRlcyhrZXkpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Z1bmNOYW1lfTogaW52YWxpZCBwYXJhbWV0ZXIgJyR7a2V5fScuICBgICtcclxuICAgICAgICAgICAgYFZhbGlkIHBhcmFtczogJHtKU09OLnN0cmluZ2lmeShwYXJhbXMpfWApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IEJhc2VSZWdFeHAgfSBmcm9tICcuLi90eXBlcy90cmlnZ2VyJztcclxuaW1wb3J0IFJlZ2V4ZXMsIHsgUGFyYW1zIH0gZnJvbSAnLi9yZWdleGVzJztcclxuXHJcbmludGVyZmFjZSBGaWVsZHMge1xyXG4gIGZpZWxkOiBzdHJpbmc7XHJcbiAgdmFsdWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIE5ldFJlZ2V4PFQgZXh0ZW5kcyBzdHJpbmc+ID0gQmFzZVJlZ0V4cDxFeGNsdWRlPFQsICdjYXB0dXJlJz4+O1xyXG5cclxuLy8gRGlmZmVyZW5jZXMgZnJvbSBSZWdleGVzOlxyXG4vLyAqIG1heSBoYXZlIG1vcmUgZmllbGRzXHJcbi8vICogQWRkZWRDb21iYXRhbnQgbnBjIGlkIGlzIGJyb2tlbiB1cCBpbnRvIG5wY05hbWVJZCBhbmQgbnBjQmFzZUlkXHJcbi8vICogZ2FtZUxvZyBhbHdheXMgc3BsaXRzIG5hbWUgaW50byBpdHMgb3duIGZpZWxkIChidXQgcHJldmlvdXNseSB3b3VsZG4ndClcclxuXHJcbmNvbnN0IHNlcGFyYXRvciA9ICdcXFxcfCc7XHJcbmNvbnN0IG1hdGNoRGVmYXVsdCA9ICdbXnxdKic7XHJcblxyXG5jb25zdCBzdGFydHNVc2luZ1BhcmFtcyA9IFsndGltZXN0YW1wJywgJ3NvdXJjZUlkJywgJ3NvdXJjZScsICdpZCcsICdhYmlsaXR5JywgJ3RhcmdldElkJywgJ3RhcmdldCcsICdjYXN0VGltZSddIGFzIGNvbnN0O1xyXG5jb25zdCBhYmlsaXR5UGFyYW1zID0gWydzb3VyY2VJZCcsICdzb3VyY2UnLCAnaWQnLCAnYWJpbGl0eScsICd0YXJnZXRJZCcsICd0YXJnZXQnXSBhcyBjb25zdDtcclxuY29uc3QgYWJpbGl0eUZ1bGxQYXJhbXMgPSBbJ3NvdXJjZUlkJywgJ3NvdXJjZScsICdpZCcsICdhYmlsaXR5JywgJ3RhcmdldElkJywgJ3RhcmdldCcsICdmbGFncycsICdkYW1hZ2UnLCAndGFyZ2V0Q3VycmVudEhwJywgJ3RhcmdldE1heEhwJywgJ3gnLCAneScsICd6JywgJ2hlYWRpbmcnXSBhcyBjb25zdDtcclxuY29uc3QgaGVhZE1hcmtlclBhcmFtcyA9IFsndGFyZ2V0SWQnLCAndGFyZ2V0JywgJ2lkJ10gYXMgY29uc3Q7XHJcbmNvbnN0IGFkZGVkQ29tYmF0YW50UGFyYW1zID0gWydpZCcsICduYW1lJ10gYXMgY29uc3Q7XHJcbmNvbnN0IGFkZGVkQ29tYmF0YW50RnVsbFBhcmFtcyA9IFsnaWQnLCAnbmFtZScsICdqb2InLCAnbGV2ZWwnLCAnb3duZXJJZCcsICd3b3JsZCcsICducGNOYW1lSWQnLCAnbnBjQmFzZUlkJywgJ2N1cnJlbnRIcCcsICdocCcsICd4JywgJ3knLCAneicsICdoZWFkaW5nJ10gYXMgY29uc3Q7XHJcbmNvbnN0IHJlbW92aW5nQ29tYmF0YW50UGFyYW1zID0gWydpZCcsICduYW1lJywgJ2hwJ10gYXMgY29uc3Q7XHJcbmNvbnN0IGdhaW5zRWZmZWN0UGFyYW1zID0gWydlZmZlY3RJZCcsICdlZmZlY3QnLCAnZHVyYXRpb24nLCAnc291cmNlSWQnLCAnc291cmNlJywgJ3RhcmdldElkJywgJ3RhcmdldCcsICdjb3VudCddIGFzIGNvbnN0O1xyXG5jb25zdCBzdGF0dXNFZmZlY3RFeHBsaWNpdFBhcmFtcyA9IFsndGFyZ2V0SWQnLCAndGFyZ2V0JywgJ2hwJywgJ21heEhwJywgJ3gnLCAneScsICd6JywgJ2hlYWRpbmcnLCAnZGF0YTAnLCAnZGF0YTEnLCAnZGF0YTInLCAnZGF0YTMnLCAnZGF0YTQnXSBhcyBjb25zdDtcclxuY29uc3QgbG9zZXNFZmZlY3RQYXJhbXMgPSBbJ2VmZmVjdElkJywgJ2VmZmVjdCcsICdzb3VyY2VJZCcsICdzb3VyY2UnLCAndGFyZ2V0SWQnLCAndGFyZ2V0JywgJ2NvdW50J10gYXMgY29uc3Q7XHJcbmNvbnN0IHRldGhlclBhcmFtcyA9IFsnc291cmNlSWQnLCAnc291cmNlJywgJ3RhcmdldElkJywgJ3RhcmdldCcsICdpZCddIGFzIGNvbnN0O1xyXG5jb25zdCB3YXNEZWZlYXRlZFBhcmFtcyA9IFsndGFyZ2V0SWQnLCAndGFyZ2V0JywgJ3NvdXJjZUlkJywgJ3NvdXJjZSddIGFzIGNvbnN0O1xyXG5jb25zdCBlY2hvUGFyYW1zID0gWydjb2RlJywgJ25hbWUnLCAnbGluZSddIGFzIGNvbnN0O1xyXG5jb25zdCBkaWFsb2dQYXJhbXMgPSBbJ2NvZGUnLCAnbmFtZScsICdsaW5lJ10gYXMgY29uc3Q7XHJcbmNvbnN0IG1lc3NhZ2VQYXJhbXMgPSBbJ2NvZGUnLCAnbmFtZScsICdsaW5lJ10gYXMgY29uc3Q7XHJcbmNvbnN0IGdhbWVMb2dQYXJhbXMgPSBbJ2NvZGUnLCAnbmFtZScsICdsaW5lJ10gYXMgY29uc3Q7XHJcbmNvbnN0IGdhbWVOYW1lTG9nUGFyYW1zID0gWydjb2RlJywgJ25hbWUnLCAnbGluZSddIGFzIGNvbnN0O1xyXG5jb25zdCBzdGF0Q2hhbmdlUGFyYW1zID0gWydqb2InLCAnc3RyZW5ndGgnLCAnZGV4dGVyaXR5JywgJ3ZpdGFsaXR5JywgJ2ludGVsbGlnZW5jZScsICdtaW5kJywgJ3BpZXR5JywgJ2F0dGFja1Bvd2VyJywgJ2RpcmVjdEhpdCcsICdjcml0aWNhbEhpdCcsICdhdHRhY2tNYWdpY1BvdGVuY3knLCAnaGVhbE1hZ2ljUG90ZW5jeScsICdkZXRlcm1pbmF0aW9uJywgJ3NraWxsU3BlZWQnLCAnc3BlbGxTcGVlZCcsICd0ZW5hY2l0eSddIGFzIGNvbnN0O1xyXG5jb25zdCBjaGFuZ2Vab25lUGFyYW1zID0gWydpZCcsICduYW1lJ10gYXMgY29uc3Q7XHJcbmNvbnN0IG5ldHdvcms2ZFBhcmFtcyA9IFsnaW5zdGFuY2UnLCAnY29tbWFuZCcsICdkYXRhMCcsICdkYXRhMScsICdkYXRhMicsICdkYXRhMyddIGFzIGNvbnN0O1xyXG5jb25zdCBuYW1lVG9nZ2xlUGFyYW1zID0gWydpZCcsICduYW1lJywgJ3RvZ2dsZSddIGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IHR5cGUgU3RhcnRzVXNpbmdQYXJhbXMgPSB0eXBlb2Ygc3RhcnRzVXNpbmdQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgQWJpbGl0eVBhcmFtcyA9IHR5cGVvZiBhYmlsaXR5UGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIEFiaWxpdHlGdWxsUGFyYW1zID0gdHlwZW9mIGFiaWxpdHlGdWxsUGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIEhlYWRNYXJrZXJQYXJhbXMgPSB0eXBlb2YgaGVhZE1hcmtlclBhcmFtc1tudW1iZXJdO1xyXG5leHBvcnQgdHlwZSBBZGRlZENvbWJhdGFudFBhcmFtcyA9IHR5cGVvZiBhZGRlZENvbWJhdGFudFBhcmFtc1tudW1iZXJdO1xyXG5leHBvcnQgdHlwZSBBZGRlZENvbWJhdGFudEZ1bGxQYXJhbXMgPSB0eXBlb2YgYWRkZWRDb21iYXRhbnRGdWxsUGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIFJlbW92aW5nQ29tYmF0YW50UGFyYW1zID0gdHlwZW9mIHJlbW92aW5nQ29tYmF0YW50UGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIEdhaW5zRWZmZWN0UGFyYW1zID0gdHlwZW9mIGdhaW5zRWZmZWN0UGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIFN0YXR1c0VmZmVjdEV4cGxpY2l0UGFyYW1zID0gdHlwZW9mIHN0YXR1c0VmZmVjdEV4cGxpY2l0UGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIExvc2VzRWZmZWN0UGFyYW1zID0gdHlwZW9mIGxvc2VzRWZmZWN0UGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIFRldGhlclBhcmFtcyA9IHR5cGVvZiB0ZXRoZXJQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgV2FzRGVmZWF0ZWRQYXJhbXMgPSB0eXBlb2Ygd2FzRGVmZWF0ZWRQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgRWNob1BhcmFtcyA9IHR5cGVvZiBlY2hvUGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIERpYWxvZ1BhcmFtcyA9IHR5cGVvZiBkaWFsb2dQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgTWVzc2FnZVBhcmFtcyA9IHR5cGVvZiBtZXNzYWdlUGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIEdhbWVMb2dQYXJhbXMgPSB0eXBlb2YgZ2FtZUxvZ1BhcmFtc1tudW1iZXJdO1xyXG5leHBvcnQgdHlwZSBHYW1lTmFtZUxvZ1BhcmFtcyA9IHR5cGVvZiBnYW1lTmFtZUxvZ1BhcmFtc1tudW1iZXJdO1xyXG5leHBvcnQgdHlwZSBTdGF0Q2hhbmdlUGFyYW1zID0gdHlwZW9mIHN0YXRDaGFuZ2VQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgQ2hhbmdlWm9uZVBhcmFtcyA9IHR5cGVvZiBjaGFuZ2Vab25lUGFyYW1zW251bWJlcl07XHJcbmV4cG9ydCB0eXBlIE5ldHdvcms2ZFBhcmFtcyA9IHR5cGVvZiBuZXR3b3JrNmRQYXJhbXNbbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgTmFtZVRvZ2dsZVBhcmFtcyA9IHR5cGVvZiBuYW1lVG9nZ2xlUGFyYW1zW251bWJlcl07XHJcblxyXG4vLyBJZiBOZXRSZWdleGVzLnNldEZsYWdUcmFuc2xhdGlvbnNOZWVkZWQgaXMgc2V0IHRvIHRydWUsIHRoZW4gYW55XHJcbi8vIHJlZ2V4IGNyZWF0ZWQgdGhhdCByZXF1aXJlcyBhIHRyYW5zbGF0aW9uIHdpbGwgYmVnaW4gd2l0aCB0aGlzIHN0cmluZ1xyXG4vLyBhbmQgbWF0Y2ggdGhlIG1hZ2ljU3RyaW5nUmVnZXguICBUaGlzIGlzIG1heWJlIGEgYml0IGdvb2Z5LCBidXQgaXNcclxuLy8gYSBwcmV0dHkgc3RyYWlnaHRmb3J3YXJkIHdheSB0byBtYXJrIHJlZ2V4ZXMgZm9yIHRyYW5zbGF0aW9ucy5cclxuLy8gSWYgaXNzdWUgIzEzMDYgaXMgZXZlciByZXNvbHZlZCwgd2UgY2FuIHJlbW92ZSB0aGlzLlxyXG5jb25zdCBtYWdpY1RyYW5zbGF0aW9uU3RyaW5nID0gYF5eYDtcclxuY29uc3QgbWFnaWNTdHJpbmdSZWdleCA9IC9eXFxeXFxeLztcclxuY29uc3Qga2V5c1RoYXRSZXF1aXJlVHJhbnNsYXRpb24gPSBbXHJcbiAgJ2FiaWxpdHknLFxyXG4gICduYW1lJyxcclxuICAnc291cmNlJyxcclxuICAndGFyZ2V0JyxcclxuICAnbGluZScsXHJcbl07XHJcblxyXG5jb25zdCBwYXJzZUhlbHBlciA9IChcclxuICAgIHBhcmFtczogeyB0aW1lc3RhbXA/OiBzdHJpbmc7IGNhcHR1cmU/OiBib29sZWFuIH0gfCB1bmRlZmluZWQsXHJcbiAgICBmdW5jTmFtZTogc3RyaW5nLFxyXG4gICAgZmllbGRzOiB7IFtzOiBzdHJpbmddOiBGaWVsZHMgfSxcclxuKTogUmVnRXhwID0+IHtcclxuICBwYXJhbXMgPSBwYXJhbXMgPz8ge307XHJcbiAgY29uc3QgdmFsaWRGaWVsZHM6IHN0cmluZ1tdID0gW107XHJcbiAgZm9yIChjb25zdCB2YWx1ZSBvZiBPYmplY3QudmFsdWVzKGZpZWxkcykpIHtcclxuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKVxyXG4gICAgICBjb250aW51ZTtcclxuICAgIHZhbGlkRmllbGRzLnB1c2godmFsdWUuZmllbGQpO1xyXG4gIH1cclxuICBSZWdleGVzLnZhbGlkYXRlUGFyYW1zKHBhcmFtcywgZnVuY05hbWUsIFsnY2FwdHVyZScsIC4uLnZhbGlkRmllbGRzXSk7XHJcblxyXG4gIC8vIEZpbmQgdGhlIGxhc3Qga2V5IHdlIGNhcmUgYWJvdXQsIHNvIHdlIGNhbiBzaG9ydGVuIHRoZSByZWdleCBpZiBuZWVkZWQuXHJcbiAgY29uc3QgY2FwdHVyZSA9IFJlZ2V4ZXMudHJ1ZUlmVW5kZWZpbmVkKHBhcmFtcy5jYXB0dXJlKTtcclxuICBjb25zdCBmaWVsZEtleXMgPSBPYmplY3Qua2V5cyhmaWVsZHMpO1xyXG4gIGxldCBtYXhLZXk7XHJcbiAgaWYgKGNhcHR1cmUpIHtcclxuICAgIG1heEtleSA9IGZpZWxkS2V5c1tmaWVsZEtleXMubGVuZ3RoIC0gMV07XHJcbiAgfSBlbHNlIHtcclxuICAgIG1heEtleSA9IDA7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBmaWVsZEtleXMpIHtcclxuICAgICAgY29uc3QgdmFsdWUgPSBmaWVsZHNba2V5XSA/PyB7fTtcclxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IGZpZWxkc1trZXldPy5maWVsZDtcclxuICAgICAgaWYgKGZpZWxkTmFtZSAmJiBmaWVsZE5hbWUgaW4gcGFyYW1zKVxyXG4gICAgICAgIG1heEtleSA9IGtleTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEZvciB0ZXN0aW5nLCBpdCdzIHVzZWZ1bCB0byBrbm93IGlmIHRoaXMgaXMgYSByZWdleCB0aGF0IHJlcXVpcmVzXHJcbiAgLy8gdHJhbnNsYXRpb24uICBXZSB0ZXN0IHRoaXMgYnkgc2VlaW5nIGlmIHRoZXJlIGFyZSBhbnkgc3BlY2lmaWVkXHJcbiAgLy8gZmllbGRzLCBhbmQgaWYgc28sIGluc2VydGluZyBhIG1hZ2ljIHN0cmluZyB0aGF0IHdlIGNhbiBkZXRlY3QuXHJcbiAgLy8gVGhpcyBsZXRzIHVzIGRpZmZlcmVudGlhdGUgYmV0d2VlbiBcInJlZ2V4IHRoYXQgc2hvdWxkIGJlIHRyYW5zbGF0ZWRcIlxyXG4gIC8vIGUuZy4gYSByZWdleCB3aXRoIGB0YXJnZXRgIHNwZWNpZmllZCwgYW5kIFwicmVnZXggdGhhdCBzaG91bGRuJ3RcIlxyXG4gIC8vIGUuZy4gYSBnYWlucyBlZmZlY3Qgd2l0aCBqdXN0IGVmZmVjdElkIHNwZWNpZmllZC5cclxuICBjb25zdCB0cmFuc1BhcmFtcyA9IE9iamVjdC5rZXlzKHBhcmFtcykuZmlsdGVyKChrKSA9PiBrZXlzVGhhdFJlcXVpcmVUcmFuc2xhdGlvbi5pbmNsdWRlcyhrKSk7XHJcbiAgY29uc3QgbmVlZHNUcmFuc2xhdGlvbnMgPSBOZXRSZWdleGVzLmZsYWdUcmFuc2xhdGlvbnNOZWVkZWQgJiYgdHJhbnNQYXJhbXMubGVuZ3RoID4gMDtcclxuXHJcbiAgLy8gQnVpbGQgdGhlIHJlZ2V4IGZyb20gdGhlIGZpZWxkcy5cclxuICBsZXQgc3RyID0gbmVlZHNUcmFuc2xhdGlvbnMgPyBtYWdpY1RyYW5zbGF0aW9uU3RyaW5nIDogJ14nO1xyXG4gIGxldCBsYXN0S2V5ID0gLTE7XHJcbiAgZm9yIChjb25zdCBfa2V5IGluIGZpZWxkcykge1xyXG4gICAgY29uc3Qga2V5ID0gcGFyc2VJbnQoX2tleSk7XHJcbiAgICAvLyBGaWxsIGluIGJsYW5rcy5cclxuICAgIGNvbnN0IG1pc3NpbmdGaWVsZHMgPSBrZXkgLSBsYXN0S2V5IC0gMTtcclxuICAgIGlmIChtaXNzaW5nRmllbGRzID09PSAxKVxyXG4gICAgICBzdHIgKz0gJ1xcXFx5e05ldEZpZWxkfSc7XHJcbiAgICBlbHNlIGlmIChtaXNzaW5nRmllbGRzID4gMSlcclxuICAgICAgc3RyICs9IGBcXFxceXtOZXRGaWVsZH17JHttaXNzaW5nRmllbGRzfX1gO1xyXG4gICAgbGFzdEtleSA9IGtleTtcclxuXHJcbiAgICBjb25zdCB2YWx1ZSA9IGZpZWxkc1trZXldO1xyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtmdW5jTmFtZX06IGludmFsaWQgdmFsdWU6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWApO1xyXG5cclxuICAgIGNvbnN0IGZpZWxkTmFtZSA9IGZpZWxkc1trZXldPy5maWVsZDtcclxuICAgIGNvbnN0IGZpZWxkVmFsdWUgPSBmaWVsZHNba2V5XT8udmFsdWU/LnRvU3RyaW5nKCkgPz8gbWF0Y2hEZWZhdWx0O1xyXG5cclxuICAgIGlmIChmaWVsZE5hbWUpIHtcclxuICAgICAgc3RyICs9IFJlZ2V4ZXMubWF5YmVDYXB0dXJlKFxyXG4gICAgICAgICAgLy8gbW9yZSBhY2N1cmF0ZSB0eXBlIGluc3RlYWQgb2YgYGFzYCBjYXN0XHJcbiAgICAgICAgICAvLyBtYXliZSB0aGlzIGZ1bmN0aW9uIG5lZWRzIGEgcmVmYWN0b3JpbmdcclxuICAgICAgICAgIGNhcHR1cmUsIGZpZWxkTmFtZSwgKHBhcmFtcyBhcyB7IFtzOiBzdHJpbmddOiBzdHJpbmcgfSlbZmllbGROYW1lXSwgZmllbGRWYWx1ZSkgK1xyXG4gICAgICAgIHNlcGFyYXRvcjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0ciArPSBmaWVsZFZhbHVlICsgc2VwYXJhdG9yO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBTdG9wIGlmIHdlJ3JlIG5vdCBjYXB0dXJpbmcgYW5kIGRvbid0IGNhcmUgYWJvdXQgZnV0dXJlIGZpZWxkcy5cclxuICAgIGlmIChrZXkgPj0gKG1heEtleSA/PyAwIGFzIG51bWJlcikpXHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuICByZXR1cm4gUmVnZXhlcy5wYXJzZShzdHIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmV0UmVnZXhlcyB7XHJcbiAgc3RhdGljIGZsYWdUcmFuc2xhdGlvbnNOZWVkZWQgPSBmYWxzZTtcclxuICBzdGF0aWMgc2V0RmxhZ1RyYW5zbGF0aW9uc05lZWRlZCh2YWx1ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgTmV0UmVnZXhlcy5mbGFnVHJhbnNsYXRpb25zTmVlZGVkID0gdmFsdWU7XHJcbiAgfVxyXG4gIHN0YXRpYyBkb2VzTmV0UmVnZXhOZWVkVHJhbnNsYXRpb24ocmVnZXg6IFJlZ0V4cCB8IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgLy8gTmVlZCB0byBgc2V0RmxhZ1RyYW5zbGF0aW9uc05lZWRlZGAgYmVmb3JlIGNhbGxpbmcgdGhpcyBmdW5jdGlvbi5cclxuICAgIGNvbnNvbGUuYXNzZXJ0KE5ldFJlZ2V4ZXMuZmxhZ1RyYW5zbGF0aW9uc05lZWRlZCk7XHJcbiAgICBjb25zdCBzdHIgPSB0eXBlb2YgcmVnZXggPT09ICdzdHJpbmcnID8gcmVnZXggOiByZWdleC5zb3VyY2U7XHJcbiAgICByZXR1cm4gISFtYWdpY1N0cmluZ1JlZ2V4LmV4ZWMoc3RyKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMxNC1uZXR3b3Jrc3RhcnRzY2FzdGluZ1xyXG4gICAqL1xyXG4gIHN0YXRpYyBzdGFydHNVc2luZyhwYXJhbXM/OiBQYXJhbXM8U3RhcnRzVXNpbmdQYXJhbXM+KTogTmV0UmVnZXg8U3RhcnRzVXNpbmdQYXJhbXM+IHtcclxuICAgIHJldHVybiBwYXJzZUhlbHBlcihwYXJhbXMsICdzdGFydHNVc2luZycsIHtcclxuICAgICAgMDogeyBmaWVsZDogJ3R5cGUnLCB2YWx1ZTogJzIwJyB9LFxyXG4gICAgICAxOiB7IGZpZWxkOiAndGltZXN0YW1wJyB9LFxyXG4gICAgICAyOiB7IGZpZWxkOiAnc291cmNlSWQnIH0sXHJcbiAgICAgIDM6IHsgZmllbGQ6ICdzb3VyY2UnIH0sXHJcbiAgICAgIDQ6IHsgZmllbGQ6ICdpZCcgfSxcclxuICAgICAgNTogeyBmaWVsZDogJ2FiaWxpdHknIH0sXHJcbiAgICAgIDY6IHsgZmllbGQ6ICd0YXJnZXRJZCcgfSxcclxuICAgICAgNzogeyBmaWVsZDogJ3RhcmdldCcgfSxcclxuICAgICAgODogeyBmaWVsZDogJ2Nhc3RUaW1lJyB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzE1LW5ldHdvcmthYmlsaXR5XHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzE2LW5ldHdvcmthb2VhYmlsaXR5XHJcbiAgICovXHJcbiAgc3RhdGljIGFiaWxpdHkocGFyYW1zPzogUGFyYW1zPEFiaWxpdHlQYXJhbXM+KTogTmV0UmVnZXg8QWJpbGl0eVBhcmFtcz4ge1xyXG4gICAgcmV0dXJuIHBhcnNlSGVscGVyKHBhcmFtcywgJ2FiaWxpdHknLCB7XHJcbiAgICAgIDA6IHsgZmllbGQ6ICd0eXBlJywgdmFsdWU6ICcyWzEyXScgfSxcclxuICAgICAgMTogeyBmaWVsZDogJ3RpbWVzdGFtcCcgfSxcclxuICAgICAgMjogeyBmaWVsZDogJ3NvdXJjZUlkJyB9LFxyXG4gICAgICAzOiB7IGZpZWxkOiAnc291cmNlJyB9LFxyXG4gICAgICA0OiB7IGZpZWxkOiAnaWQnIH0sXHJcbiAgICAgIDU6IHsgZmllbGQ6ICdhYmlsaXR5JyB9LFxyXG4gICAgICA2OiB7IGZpZWxkOiAndGFyZ2V0SWQnIH0sXHJcbiAgICAgIDc6IHsgZmllbGQ6ICd0YXJnZXQnIH0sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMTUtbmV0d29ya2FiaWxpdHlcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMTYtbmV0d29ya2FvZWFiaWxpdHlcclxuICAgKi9cclxuICBzdGF0aWMgYWJpbGl0eUZ1bGwocGFyYW1zPzogUGFyYW1zPEFiaWxpdHlGdWxsUGFyYW1zPik6IE5ldFJlZ2V4PEFiaWxpdHlGdWxsUGFyYW1zPiB7XHJcbiAgICByZXR1cm4gcGFyc2VIZWxwZXIocGFyYW1zLCAnYWJpbGl0eUZ1bGwnLCB7XHJcbiAgICAgIDA6IHsgZmllbGQ6ICd0eXBlJywgdmFsdWU6ICcyWzEyXScgfSxcclxuICAgICAgMTogeyBmaWVsZDogJ3RpbWVzdGFtcCcgfSxcclxuICAgICAgMjogeyBmaWVsZDogJ3NvdXJjZUlkJyB9LFxyXG4gICAgICAzOiB7IGZpZWxkOiAnc291cmNlJyB9LFxyXG4gICAgICA0OiB7IGZpZWxkOiAnaWQnIH0sXHJcbiAgICAgIDU6IHsgZmllbGQ6ICdhYmlsaXR5JyB9LFxyXG4gICAgICA2OiB7IGZpZWxkOiAndGFyZ2V0SWQnIH0sXHJcbiAgICAgIDc6IHsgZmllbGQ6ICd0YXJnZXQnIH0sXHJcbiAgICAgIDg6IHsgZmllbGQ6ICdmbGFncycgfSxcclxuICAgICAgOTogeyBmaWVsZDogJ2RhbWFnZScgfSxcclxuICAgICAgMjQ6IHsgZmllbGQ6ICd0YXJnZXRDdXJyZW50SHAnIH0sXHJcbiAgICAgIDI1OiB7IGZpZWxkOiAndGFyZ2V0TWF4SHAnIH0sXHJcbiAgICAgIDQwOiB7IGZpZWxkOiAneCcgfSxcclxuICAgICAgNDE6IHsgZmllbGQ6ICd5JyB9LFxyXG4gICAgICA0MjogeyBmaWVsZDogJ3onIH0sXHJcbiAgICAgIDQzOiB7IGZpZWxkOiAnaGVhZGluZycgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMxYi1uZXR3b3JrdGFyZ2V0aWNvbi1oZWFkLW1hcmtlcnNcclxuICAgKi9cclxuICBzdGF0aWMgaGVhZE1hcmtlcihwYXJhbXM/OiBQYXJhbXM8SGVhZE1hcmtlclBhcmFtcz4pOiBOZXRSZWdleDxIZWFkTWFya2VyUGFyYW1zPiB7XHJcbiAgICByZXR1cm4gcGFyc2VIZWxwZXIocGFyYW1zLCAnaGVhZE1hcmtlcicsIHtcclxuICAgICAgMDogeyBmaWVsZDogJ3R5cGUnLCB2YWx1ZTogJzI3JyB9LFxyXG4gICAgICAxOiB7IGZpZWxkOiAndGltZXN0YW1wJyB9LFxyXG4gICAgICAyOiB7IGZpZWxkOiAndGFyZ2V0SWQnIH0sXHJcbiAgICAgIDM6IHsgZmllbGQ6ICd0YXJnZXQnIH0sXHJcbiAgICAgIDY6IHsgZmllbGQ6ICdpZCcgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMwMy1hZGRjb21iYXRhbnRcclxuICAgKi9cclxuICBzdGF0aWMgYWRkZWRDb21iYXRhbnQocGFyYW1zPzogUGFyYW1zPEFkZGVkQ29tYmF0YW50UGFyYW1zPik6IE5ldFJlZ2V4PEFkZGVkQ29tYmF0YW50UGFyYW1zPiB7XHJcbiAgICByZXR1cm4gcGFyc2VIZWxwZXIocGFyYW1zLCAnYWRkZWRDb21iYXRhbnQnLCB7XHJcbiAgICAgIDA6IHsgZmllbGQ6ICd0eXBlJywgdmFsdWU6ICcwMycgfSxcclxuICAgICAgMTogeyBmaWVsZDogJ3RpbWVzdGFtcCcgfSxcclxuICAgICAgMjogeyBmaWVsZDogJ2lkJyB9LFxyXG4gICAgICAzOiB7IGZpZWxkOiAnbmFtZScgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMwMy1hZGRjb21iYXRhbnRcclxuICAgKi9cclxuICBzdGF0aWMgYWRkZWRDb21iYXRhbnRGdWxsKFxyXG4gICAgICBwYXJhbXM/OiBQYXJhbXM8QWRkZWRDb21iYXRhbnRGdWxsUGFyYW1zPixcclxuICApOiBOZXRSZWdleDxBZGRlZENvbWJhdGFudEZ1bGxQYXJhbXM+IHtcclxuICAgIHJldHVybiBwYXJzZUhlbHBlcihwYXJhbXMsICdhZGRlZENvbWJhdGFudEZ1bGwnLCB7XHJcbiAgICAgIDA6IHsgZmllbGQ6ICd0eXBlJywgdmFsdWU6ICcwMycgfSxcclxuICAgICAgMTogeyBmaWVsZDogJ3RpbWVzdGFtcCcgfSxcclxuICAgICAgMjogeyBmaWVsZDogJ2lkJyB9LFxyXG4gICAgICAzOiB7IGZpZWxkOiAnbmFtZScgfSxcclxuICAgICAgNDogeyBmaWVsZDogJ2pvYicgfSxcclxuICAgICAgNTogeyBmaWVsZDogJ2xldmVsJyB9LFxyXG4gICAgICA2OiB7IGZpZWxkOiAnb3duZXJJZCcgfSxcclxuICAgICAgODogeyBmaWVsZDogJ3dvcmxkJyB9LFxyXG4gICAgICA5OiB7IGZpZWxkOiAnbnBjTmFtZUlkJyB9LFxyXG4gICAgICAxMDogeyBmaWVsZDogJ25wY0Jhc2VJZCcgfSxcclxuICAgICAgMTE6IHsgZmllbGQ6ICdjdXJyZW50SHAnIH0sXHJcbiAgICAgIDEyOiB7IGZpZWxkOiAnaHAnIH0sXHJcbiAgICAgIDE3OiB7IGZpZWxkOiAneCcgfSxcclxuICAgICAgMTg6IHsgZmllbGQ6ICd5JyB9LFxyXG4gICAgICAxOTogeyBmaWVsZDogJ3onIH0sXHJcbiAgICAgIDIwOiB7IGZpZWxkOiAnaGVhZGluZycgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMwNC1yZW1vdmVjb21iYXRhbnRcclxuICAgKi9cclxuICBzdGF0aWMgcmVtb3ZpbmdDb21iYXRhbnQoXHJcbiAgICAgIHBhcmFtcz86IFBhcmFtczxSZW1vdmluZ0NvbWJhdGFudFBhcmFtcz4sXHJcbiAgKTogTmV0UmVnZXg8UmVtb3ZpbmdDb21iYXRhbnRQYXJhbXM+IHtcclxuICAgIHJldHVybiBwYXJzZUhlbHBlcihwYXJhbXMsICdyZW1vdmluZ0NvbWJhdGFudCcsIHtcclxuICAgICAgMDogeyBmaWVsZDogJ3R5cGUnLCB2YWx1ZTogJzA0JyB9LFxyXG4gICAgICAxOiB7IGZpZWxkOiAndGltZXN0YW1wJyB9LFxyXG4gICAgICAyOiB7IGZpZWxkOiAnaWQnIH0sXHJcbiAgICAgIDM6IHsgZmllbGQ6ICduYW1lJyB9LFxyXG4gICAgICAxMjogeyBmaWVsZDogJ2hwJyB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzFhLW5ldHdvcmtidWZmXHJcbiAgICovXHJcbiAgc3RhdGljIGdhaW5zRWZmZWN0KHBhcmFtcz86IFBhcmFtczxHYWluc0VmZmVjdFBhcmFtcz4pOiBOZXRSZWdleDxHYWluc0VmZmVjdFBhcmFtcz4ge1xyXG4gICAgcmV0dXJuIHBhcnNlSGVscGVyKHBhcmFtcywgJ2dhaW5zRWZmZWN0Jywge1xyXG4gICAgICAwOiB7IGZpZWxkOiAndHlwZScsIHZhbHVlOiAnMjYnIH0sXHJcbiAgICAgIDE6IHsgZmllbGQ6ICd0aW1lc3RhbXAnIH0sXHJcbiAgICAgIDI6IHsgZmllbGQ6ICdlZmZlY3RJZCcgfSxcclxuICAgICAgMzogeyBmaWVsZDogJ2VmZmVjdCcgfSxcclxuICAgICAgNDogeyBmaWVsZDogJ2R1cmF0aW9uJyB9LFxyXG4gICAgICA1OiB7IGZpZWxkOiAnc291cmNlSWQnIH0sXHJcbiAgICAgIDY6IHsgZmllbGQ6ICdzb3VyY2UnIH0sXHJcbiAgICAgIDc6IHsgZmllbGQ6ICd0YXJnZXRJZCcgfSxcclxuICAgICAgODogeyBmaWVsZDogJ3RhcmdldCcgfSxcclxuICAgICAgOTogeyBmaWVsZDogJ2NvdW50JyB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogUHJlZmVyIGdhaW5zRWZmZWN0IG92ZXIgdGhpcyBmdW5jdGlvbiB1bmxlc3MgeW91IHJlYWxseSBuZWVkIGV4dHJhIGRhdGEuXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzI2LW5ldHdvcmtzdGF0dXNlZmZlY3RzXHJcbiAgICovXHJcbiAgc3RhdGljIHN0YXR1c0VmZmVjdEV4cGxpY2l0KFxyXG4gICAgICBwYXJhbXM/OiBQYXJhbXM8U3RhdHVzRWZmZWN0RXhwbGljaXRQYXJhbXM+LFxyXG4gICk6IE5ldFJlZ2V4PFN0YXR1c0VmZmVjdEV4cGxpY2l0UGFyYW1zPiB7XHJcbiAgICByZXR1cm4gcGFyc2VIZWxwZXIocGFyYW1zLCAnc3RhdHVzRWZmZWN0RXhwbGljaXQnLCB7XHJcbiAgICAgIDA6IHsgZmllbGQ6ICd0eXBlJywgdmFsdWU6ICczOCcgfSxcclxuICAgICAgMTogeyBmaWVsZDogJ3RpbWVzdGFtcCcgfSxcclxuICAgICAgMjogeyBmaWVsZDogJ3RhcmdldElkJyB9LFxyXG4gICAgICAzOiB7IGZpZWxkOiAndGFyZ2V0JyB9LFxyXG4gICAgICA1OiB7IGZpZWxkOiAnaHAnIH0sXHJcbiAgICAgIDY6IHsgZmllbGQ6ICdtYXhIcCcgfSxcclxuICAgICAgMTE6IHsgZmllbGQ6ICd4JyB9LFxyXG4gICAgICAxMjogeyBmaWVsZDogJ3knIH0sXHJcbiAgICAgIDEzOiB7IGZpZWxkOiAneicgfSxcclxuICAgICAgMTQ6IHsgZmllbGQ6ICdoZWFkaW5nJyB9LFxyXG4gICAgICAxNTogeyBmaWVsZDogJ2RhdGEwJyB9LFxyXG4gICAgICAxNjogeyBmaWVsZDogJ2RhdGExJyB9LFxyXG4gICAgICAxNzogeyBmaWVsZDogJ2RhdGEyJyB9LFxyXG4gICAgICAxODogeyBmaWVsZDogJ2RhdGEzJyB9LFxyXG4gICAgICAxOTogeyBmaWVsZDogJ2RhdGE0JyB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzFlLW5ldHdvcmtidWZmcmVtb3ZlXHJcbiAgICovXHJcbiAgc3RhdGljIGxvc2VzRWZmZWN0KHBhcmFtcz86IFBhcmFtczxMb3Nlc0VmZmVjdFBhcmFtcz4pOiBOZXRSZWdleDxMb3Nlc0VmZmVjdFBhcmFtcz4ge1xyXG4gICAgcmV0dXJuIHBhcnNlSGVscGVyKHBhcmFtcywgJ2xvc2VzRWZmZWN0Jywge1xyXG4gICAgICAwOiB7IGZpZWxkOiAndHlwZScsIHZhbHVlOiAnMzAnIH0sXHJcbiAgICAgIDE6IHsgZmllbGQ6ICd0aW1lc3RhbXAnIH0sXHJcbiAgICAgIDI6IHsgZmllbGQ6ICdlZmZlY3RJZCcgfSxcclxuICAgICAgMzogeyBmaWVsZDogJ2VmZmVjdCcgfSxcclxuICAgICAgNTogeyBmaWVsZDogJ3NvdXJjZUlkJyB9LFxyXG4gICAgICA2OiB7IGZpZWxkOiAnc291cmNlJyB9LFxyXG4gICAgICA3OiB7IGZpZWxkOiAndGFyZ2V0SWQnIH0sXHJcbiAgICAgIDg6IHsgZmllbGQ6ICd0YXJnZXQnIH0sXHJcbiAgICAgIDk6IHsgZmllbGQ6ICdjb3VudCcgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMyMy1uZXR3b3JrdGV0aGVyXHJcbiAgICovXHJcbiAgc3RhdGljIHRldGhlcihwYXJhbXM/OiBQYXJhbXM8VGV0aGVyUGFyYW1zPik6IE5ldFJlZ2V4PFRldGhlclBhcmFtcz4ge1xyXG4gICAgcmV0dXJuIHBhcnNlSGVscGVyKHBhcmFtcywgJ3RldGhlcicsIHtcclxuICAgICAgMDogeyBmaWVsZDogJ3R5cGUnLCB2YWx1ZTogJzM1JyB9LFxyXG4gICAgICAxOiB7IGZpZWxkOiAndGltZXN0YW1wJyB9LFxyXG4gICAgICAyOiB7IGZpZWxkOiAnc291cmNlSWQnIH0sXHJcbiAgICAgIDM6IHsgZmllbGQ6ICdzb3VyY2UnIH0sXHJcbiAgICAgIDQ6IHsgZmllbGQ6ICd0YXJnZXRJZCcgfSxcclxuICAgICAgNTogeyBmaWVsZDogJ3RhcmdldCcgfSxcclxuICAgICAgODogeyBmaWVsZDogJ2lkJyB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogJ3RhcmdldCcgd2FzIGRlZmVhdGVkIGJ5ICdzb3VyY2UnXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzE5LW5ldHdvcmtkZWF0aFxyXG4gICAqL1xyXG4gIHN0YXRpYyB3YXNEZWZlYXRlZChwYXJhbXM/OiBQYXJhbXM8V2FzRGVmZWF0ZWRQYXJhbXM+KTogTmV0UmVnZXg8V2FzRGVmZWF0ZWRQYXJhbXM+IHtcclxuICAgIHJldHVybiBwYXJzZUhlbHBlcihwYXJhbXMsICd3YXNEZWZlYXRlZCcsIHtcclxuICAgICAgMDogeyBmaWVsZDogJ3R5cGUnLCB2YWx1ZTogJzI1JyB9LFxyXG4gICAgICAxOiB7IGZpZWxkOiAndGltZXN0YW1wJyB9LFxyXG4gICAgICAyOiB7IGZpZWxkOiAndGFyZ2V0SWQnIH0sXHJcbiAgICAgIDM6IHsgZmllbGQ6ICd0YXJnZXQnIH0sXHJcbiAgICAgIDQ6IHsgZmllbGQ6ICdzb3VyY2VJZCcgfSxcclxuICAgICAgNTogeyBmaWVsZDogJ3NvdXJjZScgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMwMC1sb2dsaW5lXHJcbiAgICovXHJcbiAgc3RhdGljIGVjaG8ocGFyYW1zPzogUGFyYW1zPEVjaG9QYXJhbXM+KTogTmV0UmVnZXg8RWNob1BhcmFtcz4ge1xyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICBwYXJhbXMgPSB7fTtcclxuICAgIFJlZ2V4ZXMudmFsaWRhdGVQYXJhbXMocGFyYW1zLCAnZWNobycsIFsndHlwZScsICd0aW1lc3RhbXAnLCAnY29kZScsICduYW1lJywgJ2xpbmUnLCAnY2FwdHVyZSddKTtcclxuICAgIHBhcmFtcy5jb2RlID0gJzAwMzgnO1xyXG4gICAgcmV0dXJuIE5ldFJlZ2V4ZXMuZ2FtZUxvZyhwYXJhbXMpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMwMC1sb2dsaW5lXHJcbiAgICovXHJcbiAgc3RhdGljIGRpYWxvZyhwYXJhbXM/OiBQYXJhbXM8RGlhbG9nUGFyYW1zPik6IE5ldFJlZ2V4PERpYWxvZ1BhcmFtcz4ge1xyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICBwYXJhbXMgPSB7fTtcclxuICAgIFJlZ2V4ZXMudmFsaWRhdGVQYXJhbXMocGFyYW1zLCAnZGlhbG9nJywgWyd0eXBlJywgJ3RpbWVzdGFtcCcsICdjb2RlJywgJ25hbWUnLCAnbGluZScsICdjYXB0dXJlJ10pO1xyXG4gICAgcGFyYW1zLmNvZGUgPSAnMDA0NCc7XHJcbiAgICByZXR1cm4gTmV0UmVnZXhlcy5nYW1lTG9nKHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzAwLWxvZ2xpbmVcclxuICAgKi9cclxuICBzdGF0aWMgbWVzc2FnZShwYXJhbXM/OiBQYXJhbXM8TWVzc2FnZVBhcmFtcz4pOiBOZXRSZWdleDxNZXNzYWdlUGFyYW1zPiB7XHJcbiAgICBpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgIHBhcmFtcyA9IHt9O1xyXG4gICAgUmVnZXhlcy52YWxpZGF0ZVBhcmFtcyhwYXJhbXMsICdtZXNzYWdlJywgWyd0eXBlJywgJ3RpbWVzdGFtcCcsICdjb2RlJywgJ25hbWUnLCAnbGluZScsICdjYXB0dXJlJ10pO1xyXG4gICAgcGFyYW1zLmNvZGUgPSAnMDgzOSc7XHJcbiAgICByZXR1cm4gTmV0UmVnZXhlcy5nYW1lTG9nKHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogZmllbGRzOiBjb2RlLCBuYW1lLCBsaW5lLCBjYXB0dXJlXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzAwLWxvZ2xpbmVcclxuICAgKi9cclxuICBzdGF0aWMgZ2FtZUxvZyhwYXJhbXM/OiBQYXJhbXM8R2FtZUxvZ1BhcmFtcz4pOiBOZXRSZWdleDxHYW1lTG9nUGFyYW1zPiB7XHJcbiAgICByZXR1cm4gcGFyc2VIZWxwZXIocGFyYW1zLCAnZ2FtZUxvZycsIHtcclxuICAgICAgMDogeyBmaWVsZDogJ3R5cGUnLCB2YWx1ZTogJzAwJyB9LFxyXG4gICAgICAxOiB7IGZpZWxkOiAndGltZXN0YW1wJyB9LFxyXG4gICAgICAyOiB7IGZpZWxkOiAnY29kZScgfSxcclxuICAgICAgMzogeyBmaWVsZDogJ25hbWUnIH0sXHJcbiAgICAgIDQ6IHsgZmllbGQ6ICdsaW5lJyB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogbWF0Y2hlczogaHR0cHM6Ly9naXRodWIuY29tL3F1aXNxdW91cy9jYWN0Ym90L2Jsb2IvbWFpbi9kb2NzL0xvZ0d1aWRlLm1kIzAwLWxvZ2xpbmVcclxuICAgKi9cclxuICBzdGF0aWMgZ2FtZU5hbWVMb2cocGFyYW1zPzogUGFyYW1zPEdhbWVOYW1lTG9nUGFyYW1zPik6IE5ldFJlZ2V4PEdhbWVOYW1lTG9nUGFyYW1zPiB7XHJcbiAgICAvLyBmb3IgY29tcGF0IHdpdGggUmVnZXhlcy5cclxuICAgIHJldHVybiBOZXRSZWdleGVzLmdhbWVMb2cocGFyYW1zKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMGMtcGxheWVyc3RhdHNcclxuICAgKi9cclxuICBzdGF0aWMgc3RhdENoYW5nZShwYXJhbXM/OiBQYXJhbXM8U3RhdENoYW5nZVBhcmFtcz4pOiBOZXRSZWdleDxTdGF0Q2hhbmdlUGFyYW1zPiB7XHJcbiAgICByZXR1cm4gcGFyc2VIZWxwZXIocGFyYW1zLCAnc3RhdENoYW5nZScsIHtcclxuICAgICAgMDogeyBmaWVsZDogJ3R5cGUnLCB2YWx1ZTogJzEyJyB9LFxyXG4gICAgICAxOiB7IGZpZWxkOiAndGltZXN0YW1wJyB9LFxyXG4gICAgICAyOiB7IGZpZWxkOiAnam9iJyB9LFxyXG4gICAgICAzOiB7IGZpZWxkOiAnc3RyZW5ndGgnIH0sXHJcbiAgICAgIDQ6IHsgZmllbGQ6ICdkZXh0ZXJpdHknIH0sXHJcbiAgICAgIDU6IHsgZmllbGQ6ICd2aXRhbGl0eScgfSxcclxuICAgICAgNjogeyBmaWVsZDogJ2ludGVsbGlnZW5jZScgfSxcclxuICAgICAgNzogeyBmaWVsZDogJ21pbmQnIH0sXHJcbiAgICAgIDg6IHsgZmllbGQ6ICdwaWV0eScgfSxcclxuICAgICAgOTogeyBmaWVsZDogJ2F0dGFja1Bvd2VyJyB9LFxyXG4gICAgICAxMDogeyBmaWVsZDogJ2RpcmVjdEhpdCcgfSxcclxuICAgICAgMTE6IHsgZmllbGQ6ICdjcml0aWNhbEhpdCcgfSxcclxuICAgICAgMTI6IHsgZmllbGQ6ICdhdHRhY2tNYWdpY1BvdGVuY3knIH0sXHJcbiAgICAgIDEzOiB7IGZpZWxkOiAnaGVhbE1hZ2ljUG90ZW5jeScgfSxcclxuICAgICAgMTQ6IHsgZmllbGQ6ICdkZXRlcm1pbmF0aW9uJyB9LFxyXG4gICAgICAxNTogeyBmaWVsZDogJ3NraWxsU3BlZWQnIH0sXHJcbiAgICAgIDE2OiB7IGZpZWxkOiAnc3BlbGxTcGVlZCcgfSxcclxuICAgICAgMTg6IHsgZmllbGQ6ICd0ZW5hY2l0eScgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMwMS1jaGFuZ2V6b25lXHJcbiAgICovXHJcbiAgc3RhdGljIGNoYW5nZVpvbmUocGFyYW1zPzogUGFyYW1zPENoYW5nZVpvbmVQYXJhbXM+KTogTmV0UmVnZXg8Q2hhbmdlWm9uZVBhcmFtcz4ge1xyXG4gICAgcmV0dXJuIHBhcnNlSGVscGVyKHBhcmFtcywgJ2NoYW5nZVpvbmUnLCB7XHJcbiAgICAgIDA6IHsgZmllbGQ6ICd0eXBlJywgdmFsdWU6ICcwMScgfSxcclxuICAgICAgMTogeyBmaWVsZDogJ3RpbWVzdGFtcCcgfSxcclxuICAgICAgMjogeyBmaWVsZDogJ2lkJyB9LFxyXG4gICAgICAzOiB7IGZpZWxkOiAnbmFtZScgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIG1hdGNoZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlzcXVvdXMvY2FjdGJvdC9ibG9iL21haW4vZG9jcy9Mb2dHdWlkZS5tZCMyMS1uZXR3b3JrNmQtYWN0b3ItY29udHJvbC1saW5lc1xyXG4gICAqL1xyXG4gIHN0YXRpYyBuZXR3b3JrNmQocGFyYW1zPzogUGFyYW1zPE5ldHdvcms2ZFBhcmFtcz4pOiBOZXRSZWdleDxOZXR3b3JrNmRQYXJhbXM+IHtcclxuICAgIHJldHVybiBwYXJzZUhlbHBlcihwYXJhbXMsICduZXR3b3JrNmQnLCB7XHJcbiAgICAgIDA6IHsgZmllbGQ6ICd0eXBlJywgdmFsdWU6ICczMycgfSxcclxuICAgICAgMTogeyBmaWVsZDogJ3RpbWVzdGFtcCcgfSxcclxuICAgICAgMjogeyBmaWVsZDogJ2luc3RhbmNlJyB9LFxyXG4gICAgICAzOiB7IGZpZWxkOiAnY29tbWFuZCcgfSxcclxuICAgICAgNDogeyBmaWVsZDogJ2RhdGEwJyB9LFxyXG4gICAgICA1OiB7IGZpZWxkOiAnZGF0YTEnIH0sXHJcbiAgICAgIDY6IHsgZmllbGQ6ICdkYXRhMicgfSxcclxuICAgICAgNzogeyBmaWVsZDogJ2RhdGEzJyB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBtYXRjaGVzOiBodHRwczovL2dpdGh1Yi5jb20vcXVpc3F1b3VzL2NhY3Rib3QvYmxvYi9tYWluL2RvY3MvTG9nR3VpZGUubWQjMjItbmV0d29ya25hbWV0b2dnbGVcclxuICAgKi9cclxuICBzdGF0aWMgbmFtZVRvZ2dsZShwYXJhbXM/OiBQYXJhbXM8TmFtZVRvZ2dsZVBhcmFtcz4pOiBOZXRSZWdleDxOYW1lVG9nZ2xlUGFyYW1zPiB7XHJcbiAgICByZXR1cm4gcGFyc2VIZWxwZXIocGFyYW1zLCAnbmFtZVRvZ2dsZScsIHtcclxuICAgICAgMDogeyBmaWVsZDogJ3R5cGUnLCB2YWx1ZTogJzM0JyB9LFxyXG4gICAgICAxOiB7IGZpZWxkOiAndGltZXN0YW1wJyB9LFxyXG4gICAgICAyOiB7IGZpZWxkOiAnaWQnIH0sXHJcbiAgICAgIDM6IHsgZmllbGQ6ICduYW1lJyB9LFxyXG4gICAgICA2OiB7IGZpZWxkOiAndG9nZ2xlJyB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IExhbmcgfSBmcm9tICcuL2xhbmd1YWdlcyc7XHJcbmltcG9ydCBSZWdleGVzIGZyb20gJy4vcmVnZXhlcyc7XHJcbmltcG9ydCBOZXRSZWdleGVzIGZyb20gJy4vbmV0cmVnZXhlcyc7XHJcblxyXG4vLyBGaWxsIGluIExvY2FsZVJlZ2V4IHNvIHRoYXQgdGhpbmdzIGxpa2UgTG9jYWxlUmVnZXguY291bnRkb3duU3RhcnQuZGUgaXMgYSB2YWxpZCByZWdleC5cclxuY29uc3QgbG9jYWxlTGluZXMgPSB7XHJcbiAgY291bnRkb3duU3RhcnQ6IHtcclxuICAgIGVuOiAnQmF0dGxlIGNvbW1lbmNpbmcgaW4gKD88dGltZT5cXFxceXtGbG9hdH0pIHNlY29uZHMhIFxcXFwoKD88cGxheWVyPi4qPylcXFxcKScsXHJcbiAgICBkZTogJ05vY2ggKD88dGltZT5cXFxceXtGbG9hdH0pIFNla3VuZGVuIGJpcyBLYW1wZmJlZ2lubiEgXFxcXCgoPzxwbGF5ZXI+Lio/KVxcXFwpJyxcclxuICAgIGZyOiAnRMOpYnV0IGR1IGNvbWJhdCBkYW5zICg/PHRpbWU+XFxcXHl7RmxvYXR9KSBzZWNvbmRlc1sgXT8hIFxcXFwoKD88cGxheWVyPi4qPylcXFxcKScsXHJcbiAgICBqYTogJ+aIpumXmOmWi+Wni+OBvuOBpyg/PHRpbWU+XFxcXHl7RmxvYXR9Keenku+8gSBcXFxcKCg/PHBsYXllcj4uKj8pXFxcXCknLFxyXG4gICAgY246ICfot53nprvmiJjmlpflvIDlp4vov5jmnIkoPzx0aW1lPlxcXFx5e0Zsb2F0fSnnp5LvvIEg77yIKD88cGxheWVyPi4qPynvvIknLFxyXG4gICAga286ICfsoITtiKwg7Iuc7J6RICg/PHRpbWU+XFxcXHl7RmxvYXR9Key0iCDsoIQhIFxcXFwoKD88cGxheWVyPi4qPylcXFxcKScsXHJcbiAgfSxcclxuICBjb3VudGRvd25FbmdhZ2U6IHtcclxuICAgIGVuOiAnRW5nYWdlIScsXHJcbiAgICBkZTogJ1N0YXJ0IScsXHJcbiAgICBmcjogJ8OAIGxcXCdhdHRhcXVlWyBdPyEnLFxyXG4gICAgamE6ICfmiKbpl5jplovlp4vvvIEnLFxyXG4gICAgY246ICfmiJjmlpflvIDlp4vvvIEnLFxyXG4gICAga286ICfsoITtiKwg7Iuc7J6RIScsXHJcbiAgfSxcclxuICBjb3VudGRvd25DYW5jZWw6IHtcclxuICAgIGVuOiAnQ291bnRkb3duIGNhbmNlbGVkIGJ5ICg/PHBsYXllcj5cXFxceXtOYW1lfSknLFxyXG4gICAgZGU6ICcoPzxwbGF5ZXI+XFxcXHl7TmFtZX0pIGhhdCBkZW4gQ291bnRkb3duIGFiZ2Vicm9jaGVuJyxcclxuICAgIGZyOiAnTGUgY29tcHRlIMOgIHJlYm91cnMgYSDDqXTDqSBpbnRlcnJvbXB1IHBhciAoPzxwbGF5ZXI+XFxcXHl7TmFtZX0pWyBdP1xcXFwuJyxcclxuICAgIGphOiAnKD88cGxheWVyPlxcXFx5e05hbWV9KeOBq+OCiOOCiuOAgeaIpumXmOmWi+Wni+OCq+OCpuODs+ODiOOBjOOCreODo+ODs+OCu+ODq+OBleOCjOOBvuOBl+OBn+OAgicsXHJcbiAgICBjbjogJyg/PHBsYXllcj5cXFxceXtOYW1lfSnlj5bmtojkuobmiJjmlpflvIDlp4vlgJLorqHml7bjgIInLFxyXG4gICAga286ICcoPzxwbGF5ZXI+XFxcXHl7TmFtZX0pIOuLmOydtCDstIjsnb3quLDrpbwg7Leo7IaM7ZaI7Iq164uI64ukXFxcXC4nLFxyXG4gIH0sXHJcbiAgYXJlYVNlYWw6IHtcclxuICAgIGVuOiAnKD88YXJlYT4uKj8pIHdpbGwgYmUgc2VhbGVkIG9mZiBpbiAoPzx0aW1lPlxcXFx5e0Zsb2F0fSkgc2Vjb25kcyEnLFxyXG4gICAgZGU6ICdOb2NoICg/PHRpbWU+XFxcXHl7RmxvYXR9KSBTZWt1bmRlbiwgYmlzIHNpY2ggKD88YXJlYT4uKj8pIHNjaGxpZcOfdCcsXHJcbiAgICBmcjogJ0Zlcm1ldHVyZSAoPzxhcmVhPi4qPykgZGFucyAoPzx0aW1lPlxcXFx5e0Zsb2F0fSkgc2Vjb25kZXNbIF0/XFxcXC4nLFxyXG4gICAgamE6ICcoPzxhcmVhPi4qPynjga7lsIHpjpbjgb7jgafjgYLjgagoPzx0aW1lPlxcXFx5e0Zsb2F0fSnnp5InLFxyXG4gICAgY246ICfot50oPzxhcmVhPi4qPynooqvlsIHplIHov5jmnIkoPzx0aW1lPlxcXFx5e0Zsb2F0fSnnp5InLFxyXG4gICAga286ICcoPzx0aW1lPlxcXFx5e0Zsb2F0fSnstIgg7ZuE7JeQICg/PGFyZWE+Lio/KSjsnbR86rCAKSDrtInsh4TrkKnri4jri6RcXFxcLicsXHJcbiAgfSxcclxuICBhcmVhVW5zZWFsOiB7XHJcbiAgICBlbjogJyg/PGFyZWE+Lio/KSBpcyBubyBsb25nZXIgc2VhbGVkLicsXHJcbiAgICBkZTogJyg/PGFyZWE+Lio/KSDDtmZmbmV0IHNpY2ggZXJuZXV0LicsXHJcbiAgICBmcjogJ091dmVydHVyZSAoPzxhcmVhPi4qPylbIF0/IScsXHJcbiAgICBqYTogJyg/PGFyZWE+Lio/KeOBruWwgemOluOBjOino+OBi+OCjOOBn+KApuKApicsXHJcbiAgICBjbjogJyg/PGFyZWE+Lio/KeeahOWwgemUgeino+mZpOS6hicsXHJcbiAgICBrbzogJyg/PGFyZWE+Lio/KeydmCDrtInsh4TqsIAg7ZW07KCc65CY7JeI7Iq164uI64ukXFxcXC4nLFxyXG4gIH0sXHJcbiAgLy8gUmVjaXBlIG5hbWUgYWx3YXlzIHN0YXJ0IHdpdGggXFx1ZTBiYlxyXG4gIC8vIEhRIGljb24gaXMgXFx1ZTAzY1xyXG4gIGNyYWZ0aW5nU3RhcnQ6IHtcclxuICAgIGVuOiAnWW91IGJlZ2luIHN5bnRoZXNpemluZyAoPzxjb3VudD4oYW4/fFxcXFxkKykgKT9cXHVlMGJiKD88cmVjaXBlPi4qKVxcXFwuJyxcclxuICAgIGRlOiAnRHUgaGFzdCBiZWdvbm5lbiwgZHVyY2ggU3ludGhlc2UgKD88Y291bnQ+KGVpbihlfGVzfGVtfGVyKT98XFxcXGQrKSApP1xcdWUwYmIoPzxyZWNpcGU+LiopIGhlcnp1c3RlbGxlblxcXFwuJyxcclxuICAgIGZyOiAnVm91cyBjb21tZW5jZXogw6AgZmFicmlxdWVyICg/PGNvdW50Pih1bmU/fFxcXFxkKykgKT9cXHVlMGJiKD88cmVjaXBlPi4qKVxcXFwuJyxcclxuICAgIGphOiAnKD88cGxheWVyPlxcXFx5e05hbWV9KeOBr1xcdWUwYmIoPzxyZWNpcGU+LiopKMOXKD88Y291bnQ+XFxcXGQrKSk/44Gu6KO95L2c44KS6ZaL5aeL44GX44Gf44CCJyxcclxuICAgIGNuOiAnKD88cGxheWVyPlxcXFx5e05hbWV9KeW8gOWni+WItuS9nOKAnFxcdWUwYmIoPzxyZWNpcGU+Liop4oCdKMOXKD88Y291bnQ+XFxcXGQrKSk/44CCJyxcclxuICAgIGtvOiAnXFx1ZTBiYig/PHJlY2lwZT4uKikow5coPzxjb3VudD5cXFxcZCsp6rCcKT8g7KCc7J6R7J2EIOyLnOyeke2VqeuLiOuLpFxcXFwuJyxcclxuICB9LFxyXG4gIHRyaWFsQ3JhZnRpbmdTdGFydDoge1xyXG4gICAgZW46ICdZb3UgYmVnaW4gdHJpYWwgc3ludGhlc2lzIG9mIFxcdWUwYmIoPzxyZWNpcGU+LiopXFxcXC4nLFxyXG4gICAgZGU6ICdEdSBoYXN0IG1pdCBkZXIgVGVzdHN5bnRoZXNlIHZvbiBcXHVlMGJiKD88cmVjaXBlPi4qKSBiZWdvbm5lblxcXFwuJyxcclxuICAgIGZyOiAnVm91cyBjb21tZW5jZXogdW5lIHN5bnRow6hzZSBkXFwnZXNzYWkgcG91ciB1bmU/IFxcdWUwYmIoPzxyZWNpcGU+LiopXFxcXC4nLFxyXG4gICAgamE6ICcoPzxwbGF5ZXI+XFxcXHl7TmFtZX0p44GvXFx1ZTBiYig/PHJlY2lwZT4uKinjga7oo73kvZznt7Tnv5LjgpLplovlp4vjgZfjgZ/jgIInLFxyXG4gICAgY246ICcoPzxwbGF5ZXI+XFxcXHl7TmFtZX0p5byA5aeL57uD5Lmg5Yi25L2cXFx1ZTBiYig/PHJlY2lwZT4uKinjgIInLFxyXG4gICAga286ICdcXHVlMGJiKD88cmVjaXBlPi4qKSDsoJzsnpEg7Jew7Iq17J2EIOyLnOyeke2VqeuLiOuLpFxcXFwuJyxcclxuICB9LFxyXG4gIGNyYWZ0aW5nRmluaXNoOiB7XHJcbiAgICBlbjogJ1lvdSBzeW50aGVzaXplICg/PGNvdW50Pihhbj98XFxcXGQrKSApP1xcdWUwYmIoPzxyZWNpcGU+LiopKFxcdWUwM2MpP1xcXFwuJyxcclxuICAgIGRlOiAnRHUgaGFzdCBlcmZvbGdyZWljaCAoPzxjb3VudD4oZWluKGV8ZXN8ZW18ZXIpP3xcXFxcZCspICk/KD88cmVjaXBlPi4qKShcXHVlMDNjKT8gaGVyZ2VzdGVsbHRcXFxcLicsXHJcbiAgICBmcjogJ1ZvdXMgZmFicmlxdWV6ICg/PGNvdW50Pih1bmU/fFxcXFxkKykgKT9cXHVlMGJiKD88cmVjaXBlPi4qKShcXHVlMDNjKT9cXFxcLicsXHJcbiAgICBqYTogJyg/PHBsYXllcj5cXFxceXtOYW1lfSnjga9cXHVlMGJiKD88cmVjaXBlPi4qKShcXHVlMDNjKT8ow5coPzxjb3VudD5cXFxcZCspKT/jgpLlrozmiJDjgZXjgZvjgZ/vvIEnLFxyXG4gICAgY246ICcoPzxwbGF5ZXI+XFxcXHl7TmFtZX0p5Yi25L2c4oCcXFx1ZTBiYig/PHJlY2lwZT4uKikoXFx1ZTAzYyk/4oCdKMOXKD88Y291bnQ+XFxcXGQrKSk/5oiQ5Yqf77yBJyxcclxuICAgIGtvOiAnKD88cGxheWVyPlxcXFx5e05hbWV9KSDri5jsnbQgXFx1ZTBiYig/PHJlY2lwZT4uKikoXFx1ZTAzYyk/KMOXKD88Y291bnQ+XFxcXGQrKeqwnCk/KOydhHzrpbwpIOyZhOyEse2WiOyKteuLiOuLpCEnLFxyXG4gIH0sXHJcbiAgdHJpYWxDcmFmdGluZ0ZpbmlzaDoge1xyXG4gICAgZW46ICdZb3VyIHRyaWFsIHN5bnRoZXNpcyBvZiBcXHVlMGJiKD88cmVjaXBlPi4qKSBwcm92ZWQgYSBzdWNjZXNzIScsXHJcbiAgICBkZTogJ0RpZSBUZXN0c3ludGhlc2Ugdm9uIFxcdWUwYmIoPzxyZWNpcGU+LiopIHdhciBlcmZvbGdyZWljaCEnLFxyXG4gICAgZnI6ICdWb3RyZSBzeW50aMOoc2UgZFxcJ2Vzc2FpIHBvdXIgZmFicmlxdWVyIFxcdWUwYmIoPzxyZWNpcGU+LiopIGEgw6l0w6kgY291cm9ubsOpZSBkZSBzdWNjw6hzIScsXHJcbiAgICBqYTogJyg/PHBsYXllcj5cXFxceXtOYW1lfSnjga9cXHVlMGJiKD88cmVjaXBlPi4qKeOBruijveS9nOe3tOe/kuOBq+aIkOWKn+OBl+OBn++8gScsXHJcbiAgICBjbjogJyg/PHBsYXllcj5cXFxceXtOYW1lfSnnu4PkuaDliLbkvZxcXHVlMGJiKD88cmVjaXBlPi4qKeaIkOWKn+S6hu+8gScsXHJcbiAgICBrbzogJ1xcdWUwYmIoPzxyZWNpcGU+LiopIOygnOyekSDsl7DsirXsl5Ag7ISx6rO17ZaI7Iq164uI64ukIScsXHJcbiAgfSxcclxuICBjcmFmdGluZ0ZhaWw6IHtcclxuICAgIGVuOiAnWW91ciBzeW50aGVzaXMgZmFpbHMhJyxcclxuICAgIGRlOiAnRGVpbmUgU3ludGhlc2UgaXN0IGZlaGxnZXNjaGxhZ2VuIScsXHJcbiAgICBmcjogJ0xhIHN5bnRow6hzZSDDqWNob3VlXFxcXC57M30nLFxyXG4gICAgamE6ICcoPzxwbGF5ZXI+XFxcXHl7TmFtZX0p44Gv6KO95L2c44Gr5aSx5pWX44GX44Gf4oCm4oCmJyxcclxuICAgIGNuOiAnKD88cGxheWVyPlxcXFx5e05hbWV9KeWItuS9nOWksei0peS6huKApuKApicsXHJcbiAgICBrbzogJ+ygnOyekeyXkCDsi6TtjKjtlojsirXri4jri6TigKbigKZcXFxcLicsXHJcbiAgfSxcclxuICB0cmlhbENyYWZ0aW5nRmFpbDoge1xyXG4gICAgZW46ICdZb3VyIHRyaWFsIHN5bnRoZXNpcyBvZiBcXHVlMGJiKD88cmVjaXBlPi4qKSBmYWlsZWRcXFxcLnszfScsXHJcbiAgICBkZTogJ0RpZSBUZXN0c3ludGhlc2Ugdm9uIFxcdWUwYmIoPzxyZWNpcGU+LiopIGlzdCBmZWhsZ2VzY2hsYWdlblxcXFwuezN9JyxcclxuICAgIGZyOiAnVm90cmUgc3ludGjDqHNlIGRcXCdlc3NhaSBwb3VyIGZhYnJpcXVlciBcXHVlMGJiKD88cmVjaXBlPi4qKSBzXFwnZXN0IHNvbGTDqWUgcGFyIHVuIMOpY2hlY1xcXFwuezN9JyxcclxuICAgIGphOiAnKD88cGxheWVyPlxcXFx5e05hbWV9KeOBr1xcdWUwYmIoPzxyZWNpcGU+Liop44Gu6KO95L2c57e057+S44Gr5aSx5pWX44GX44Gf4oCm4oCmJyxcclxuICAgIGNuOiAnKD88cGxheWVyPlxcXFx5e05hbWV9Kee7g+S5oOWItuS9nFxcdWUwYmIoPzxyZWNpcGU+Liop5aSx6LSl5LqG4oCm4oCmJyxcclxuICAgIGtvOiAnXFx1ZTBiYig/PHJlY2lwZT4uKikg7KCc7J6RIOyXsOyKteyXkCDsi6TtjKjtlojsirXri4jri6TigKbigKZcXFxcLicsXHJcbiAgfSxcclxuICBjcmFmdGluZ0NhbmNlbDoge1xyXG4gICAgZW46ICdZb3UgY2FuY2VsIHRoZSBzeW50aGVzaXNcXFxcLicsXHJcbiAgICBkZTogJ0R1IGhhc3QgZGllIFN5bnRoZXNlIGFiZ2Vicm9jaGVuXFxcXC4nLFxyXG4gICAgZnI6ICdMYSBzeW50aMOoc2UgZXN0IGFubnVsw6llXFxcXC4nLFxyXG4gICAgamE6ICcoPzxwbGF5ZXI+XFxcXHl7TmFtZX0p44Gv6KO95L2c44KS5Lit5q2i44GX44Gf44CCJyxcclxuICAgIGNuOiAnKD88cGxheWVyPlxcXFx5e05hbWV9KeS4reatouS6huWItuS9nOS9nOS4muOAgicsXHJcbiAgICBrbzogJ+ygnOyekeydhCDspJHsp4DtlojsirXri4jri6RcXFxcLicsXHJcbiAgfSxcclxuICB0cmlhbENyYWZ0aW5nQ2FuY2VsOiB7XHJcbiAgICBlbjogJ1lvdSBhYmFuZG9uZWQgdHJpYWwgc3ludGhlc2lzXFxcXC4nLFxyXG4gICAgZGU6ICdUZXN0c3ludGhlc2UgYWJnZWJyb2NoZW5cXFxcLicsXHJcbiAgICBmcjogJ1ZvdXMgYXZleiBpbnRlcnJvbXB1IGxhIHN5bnRow6hzZSBkXFwnZXNzYWlcXFxcLicsXHJcbiAgICBqYTogJyg/PHBsYXllcj5cXFxceXtOYW1lfSnjga/oo73kvZznt7Tnv5LjgpLkuK3mraLjgZfjgZ/jgIInLFxyXG4gICAgY246ICcoPzxwbGF5ZXI+XFxcXHl7TmFtZX0p5YGc5q2i5LqG57uD5Lmg44CCJyxcclxuICAgIGtvOiAn7KCc7J6RIOyXsOyKteydhCDspJHsp4DtlojsirXri4jri6RcXFxcLicsXHJcbiAgfSxcclxufSBhcyBjb25zdDtcclxuXHJcbnR5cGUgTG9jYWxlTGluZSA9IHsgZW46IHN0cmluZyB9ICYgUGFydGlhbDxSZWNvcmQ8RXhjbHVkZTxMYW5nLCAnZW4nPiwgc3RyaW5nPj47XHJcblxyXG50eXBlIExvY2FsZVJlZ2V4ZXNPYmogPSBSZWNvcmQ8a2V5b2YgdHlwZW9mIGxvY2FsZUxpbmVzLCBSZWNvcmQ8TGFuZywgUmVnRXhwPj47XHJcblxyXG5jbGFzcyBSZWdleFNldCB7XHJcbiAgcmVnZXhlcz86IExvY2FsZVJlZ2V4ZXNPYmo7XHJcbiAgbmV0UmVnZXhlcz86IExvY2FsZVJlZ2V4ZXNPYmo7XHJcblxyXG4gIGdldCBsb2NhbGVSZWdleCgpOiBMb2NhbGVSZWdleGVzT2JqIHtcclxuICAgIGlmICh0aGlzLnJlZ2V4ZXMpXHJcbiAgICAgIHJldHVybiB0aGlzLnJlZ2V4ZXM7XHJcbiAgICB0aGlzLnJlZ2V4ZXMgPSB0aGlzLmJ1aWxkTG9jYWxlUmVnZXhlcyhsb2NhbGVMaW5lcywgKHM6IHN0cmluZykgPT4gUmVnZXhlcy5nYW1lTG9nKHsgbGluZTogcyArICcuKj8nIH0pKTtcclxuICAgIHJldHVybiB0aGlzLnJlZ2V4ZXM7XHJcbiAgfVxyXG5cclxuICBnZXQgbG9jYWxlTmV0UmVnZXgoKTogTG9jYWxlUmVnZXhlc09iaiB7XHJcbiAgICBpZiAodGhpcy5uZXRSZWdleGVzKVxyXG4gICAgICByZXR1cm4gdGhpcy5uZXRSZWdleGVzO1xyXG4gICAgdGhpcy5uZXRSZWdleGVzID0gdGhpcy5idWlsZExvY2FsZVJlZ2V4ZXMobG9jYWxlTGluZXMsIChzOiBzdHJpbmcpID0+IE5ldFJlZ2V4ZXMuZ2FtZUxvZyh7IGxpbmU6IHMgKyAnW158XSo/JyB9KSk7XHJcbiAgICByZXR1cm4gdGhpcy5uZXRSZWdleGVzO1xyXG4gIH1cclxuXHJcbiAgYnVpbGRMb2NhbGVSZWdleGVzKFxyXG4gICAgICBsb2NhbGVzOiB0eXBlb2YgbG9jYWxlTGluZXMsXHJcbiAgICAgIGJ1aWxkZXI6IChzOiBzdHJpbmcpID0+IFJlZ0V4cCxcclxuICApOiBMb2NhbGVSZWdleGVzT2JqIHtcclxuICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoXHJcbiAgICAgICAgT2JqZWN0XHJcbiAgICAgICAgICAuZW50cmllcyhsb2NhbGVzKVxyXG4gICAgICAgICAgLm1hcCgoW2tleSwgbGluZXNdKSA9PiBba2V5LCB0aGlzLmJ1aWxkTG9jYWxlUmVnZXgobGluZXMsIGJ1aWxkZXIpXSksXHJcbiAgICApIGFzIExvY2FsZVJlZ2V4ZXNPYmo7XHJcbiAgfVxyXG5cclxuICBidWlsZExvY2FsZVJlZ2V4KGxpbmVzOiBMb2NhbGVMaW5lLCBidWlsZGVyOiAoczogc3RyaW5nKSA9PiBSZWdFeHApOiBSZWNvcmQ8TGFuZywgUmVnRXhwPiB7XHJcbiAgICBjb25zdCByZWdleEVuID0gYnVpbGRlcihsaW5lcy5lbik7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBlbjogcmVnZXhFbixcclxuICAgICAgZGU6IGxpbmVzLmRlID8gYnVpbGRlcihsaW5lcy5kZSkgOiByZWdleEVuLFxyXG4gICAgICBmcjogbGluZXMuZnIgPyBidWlsZGVyKGxpbmVzLmZyKSA6IHJlZ2V4RW4sXHJcbiAgICAgIGphOiBsaW5lcy5qYSA/IGJ1aWxkZXIobGluZXMuamEpIDogcmVnZXhFbixcclxuICAgICAgY246IGxpbmVzLmNuID8gYnVpbGRlcihsaW5lcy5jbikgOiByZWdleEVuLFxyXG4gICAgICBrbzogbGluZXMua28gPyBidWlsZGVyKGxpbmVzLmtvKSA6IHJlZ2V4RW4sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgcmVnZXhTZXQgPSBuZXcgUmVnZXhTZXQoKTtcclxuXHJcbmV4cG9ydCBjb25zdCBMb2NhbGVSZWdleCA9IHJlZ2V4U2V0LmxvY2FsZVJlZ2V4O1xyXG5leHBvcnQgY29uc3QgTG9jYWxlTmV0UmVnZXggPSByZWdleFNldC5sb2NhbGVOZXRSZWdleDtcclxuIiwiaW1wb3J0IHsgTG9jYWxlTmV0UmVnZXggfSBmcm9tICcuLi8uLi8uLi9yZXNvdXJjZXMvdHJhbnNsYXRpb25zJztcclxuaW1wb3J0IE5ldFJlZ2V4ZXMgZnJvbSAnLi4vLi4vLi4vcmVzb3VyY2VzL25ldHJlZ2V4ZXMnO1xyXG5pbXBvcnQgeyBMYW5nIH0gZnJvbSAnLi4vLi4vLi4vcmVzb3VyY2VzL2xhbmd1YWdlcyc7XHJcbmltcG9ydCB7IExvZ0V2ZW50IH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZXZlbnQnO1xyXG5pbXBvcnQgTGluZUV2ZW50IGZyb20gJy4vZGF0YS9uZXR3b3JrX2xvZ19jb252ZXJ0ZXIvTGluZUV2ZW50JztcclxuXHJcbi8vIERpc2FibGUgbm8tZXhwbGljaXQtYW55IGZvciBjbG9uZURhdGEgYXMgaXQgbmVlZHMgdG8gd29yayBvbiByYXcgb2JqZWN0cyBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy5cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuZXhwb3J0IHR5cGUgRGF0YVR5cGUgPSB7IFtrZXk6IHN0cmluZ106IGFueSB9IHwgbnVsbDtcclxuXHJcbmV4cG9ydCB0eXBlIEVtdWxhdG9yTG9nRXZlbnQgPSBMb2dFdmVudCAmIHtcclxuICBkZXRhaWw6IHtcclxuICAgIGxvZ3M6IExpbmVFdmVudFtdO1xyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtdWxhdG9yQ29tbW9uIHtcclxuICBzdGF0aWMgY2xvbmVEYXRhKGRhdGE6IERhdGFUeXBlLCBleGNsdWRlID0gWydvcHRpb25zJywgJ3BhcnR5J10pOiBEYXRhVHlwZSB7XHJcbiAgICBjb25zdCByZXQ6IERhdGFUeXBlID0ge307XHJcblxyXG4gICAgLy8gVXNlIGV4dHJhIGxvZ2ljIGZvciB0b3AtbGV2ZWwgZXh0ZW5kIGZvciBwcm9wZXJ0eSBleGNsdXNpb25cclxuICAgIC8vIFRoaXMgY3V0IHRoZSBleGVjdXRpb24gdGltZSBvZiB0aGlzIGNvZGUgZnJvbSA0MSwwMDBtcyB0byA1MG1zIHdoZW4gcGFyc2luZyBhIDEyIG1pbnV0ZSBwdWxsXHJcbiAgICBmb3IgKGNvbnN0IGkgaW4gZGF0YSkge1xyXG4gICAgICBpZiAoZXhjbHVkZS5pbmNsdWRlcyhpKSlcclxuICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgZGF0YVtpXSA9PT0gJ29iamVjdCcpXHJcbiAgICAgICAgcmV0W2ldID0gRW11bGF0b3JDb21tb24uX2Nsb25lRGF0YShkYXRhW2ldKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIC8vIEFzc2lnbm1lbnQgb2YgYW55IHRvIGFueS4gU2VlIERhdGFUeXBlIGRlZmluaXRpb24gYWJvdmUgZm9yIHJlYXNvbmluZy5cclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1hc3NpZ25tZW50XHJcbiAgICAgICAgcmV0W2ldID0gZGF0YVtpXTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXQ7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgX2Nsb25lRGF0YShkYXRhOiBEYXRhVHlwZSk6IERhdGFUeXBlIHtcclxuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICBjb25zdCByZXQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyArK2kpXHJcbiAgICAgICAgICByZXRbaV0gPSBFbXVsYXRvckNvbW1vbi5fY2xvbmVEYXRhKGRhdGFbaV0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZGF0YSA9PT0gbnVsbClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgUmVnRXhwKVxyXG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKGRhdGEpO1xyXG5cclxuICAgICAgY29uc3QgcmV0OiBEYXRhVHlwZSA9IHt9O1xyXG4gICAgICBmb3IgKGNvbnN0IGkgaW4gZGF0YSlcclxuICAgICAgICByZXRbaV0gPSBFbXVsYXRvckNvbW1vbi5fY2xvbmVEYXRhKGRhdGFbaV0pO1xyXG5cclxuICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHRpbWVUb1N0cmluZyh0aW1lOiBudW1iZXIsIGluY2x1ZGVNaWxsaXMgPSB0cnVlKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IG5lZ2F0aXZlID0gdGltZSA8IDAgPyAnLScgOiAnJztcclxuICAgIHRpbWUgPSBNYXRoLmFicyh0aW1lKTtcclxuICAgIGNvbnN0IG1pbGxpc051bSA9IHRpbWUgJSAxMDAwO1xyXG4gICAgY29uc3Qgc2Vjc051bSA9ICgodGltZSAlICg2MCAqIDEwMDApKSAtIG1pbGxpc051bSkgLyAxMDAwO1xyXG4gICAgLy8gTWlsbGlzZWNvbmRzXHJcbiAgICBjb25zdCBtaWxsaXMgPSBgMDAke21pbGxpc051bX1gLnN1YnN0cigtMyk7XHJcbiAgICBjb25zdCBzZWNzID0gYDAke3NlY3NOdW19YC5zdWJzdHIoLTIpO1xyXG4gICAgY29uc3QgbWlucyA9IGAwJHsoKCgodGltZSAlICg2MCAqIDYwICogMTAwMCkpIC0gbWlsbGlzTnVtKSAvIDEwMDApIC0gc2Vjc051bSkgLyA2MH1gLnN1YnN0cigtMik7XHJcbiAgICByZXR1cm4gbmVnYXRpdmUgKyBtaW5zICsgJzonICsgc2VjcyArIChpbmNsdWRlTWlsbGlzID8gJy4nICsgbWlsbGlzIDogJycpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHRpbWVUb0RhdGVTdHJpbmcodGltZTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGVPYmplY3RUb0RhdGVTdHJpbmcobmV3IERhdGUodGltZSkpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGRhdGVPYmplY3RUb0RhdGVTdHJpbmcoZGF0ZTogRGF0ZSk6IHN0cmluZyB7XHJcbiAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgbW9udGggPSBFbXVsYXRvckNvbW1vbi56ZXJvUGFkKChkYXRlLmdldE1vbnRoKCkgKyAxKS50b1N0cmluZygpKTtcclxuICAgIGNvbnN0IGRheSA9IEVtdWxhdG9yQ29tbW9uLnplcm9QYWQoZGF0ZS5nZXREYXRlKCkudG9TdHJpbmcoKSk7XHJcbiAgICByZXR1cm4gYCR7eWVhcn0tJHttb250aH0tJHtkYXl9YDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyB0aW1lVG9UaW1lU3RyaW5nKHRpbWU6IG51bWJlciwgaW5jbHVkZU1pbGxpcyA9IGZhbHNlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGVPYmplY3RUb1RpbWVTdHJpbmcobmV3IERhdGUodGltZSksIGluY2x1ZGVNaWxsaXMpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGRhdGVPYmplY3RUb1RpbWVTdHJpbmcoZGF0ZTogRGF0ZSwgaW5jbHVkZU1pbGxpcyA9IGZhbHNlKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGhvdXIgPSBFbXVsYXRvckNvbW1vbi56ZXJvUGFkKGRhdGUuZ2V0SG91cnMoKS50b1N0cmluZygpKTtcclxuICAgIGNvbnN0IG1pbnV0ZSA9IEVtdWxhdG9yQ29tbW9uLnplcm9QYWQoZGF0ZS5nZXRNaW51dGVzKCkudG9TdHJpbmcoKSk7XHJcbiAgICBjb25zdCBzZWNvbmQgPSBFbXVsYXRvckNvbW1vbi56ZXJvUGFkKGRhdGUuZ2V0U2Vjb25kcygpLnRvU3RyaW5nKCkpO1xyXG4gICAgbGV0IHJldCA9IGAke2hvdXJ9OiR7bWludXRlfToke3NlY29uZH1gO1xyXG4gICAgaWYgKGluY2x1ZGVNaWxsaXMpXHJcbiAgICAgIHJldCA9IHJldCArIGAuJHtkYXRlLmdldE1pbGxpc2Vjb25kcygpfWA7XHJcblxyXG4gICAgcmV0dXJuIHJldDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtc1RvRHVyYXRpb24obXM6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBjb25zdCB0bXAgPSBFbXVsYXRvckNvbW1vbi50aW1lVG9TdHJpbmcobXMsIGZhbHNlKTtcclxuICAgIHJldHVybiB0bXAucmVwbGFjZSgnOicsICdtJykgKyAncyc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZGF0ZVRpbWVUb1N0cmluZyh0aW1lOiBudW1iZXIsIGluY2x1ZGVNaWxsaXMgPSBmYWxzZSk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodGltZSk7XHJcbiAgICByZXR1cm4gYCR7dGhpcy5kYXRlT2JqZWN0VG9EYXRlU3RyaW5nKGRhdGUpfSAke3RoaXMuZGF0ZU9iamVjdFRvVGltZVN0cmluZyhkYXRlLCBpbmNsdWRlTWlsbGlzKX1gO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHplcm9QYWQoc3RyOiBzdHJpbmcsIGxlbiA9IDIpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuICgnJyArIHN0cikucGFkU3RhcnQobGVuLCAnMCcpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHByb3BlckNhc2Uoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW15cXFdfXStbXlxccy1dKikgKi9nLCAodHh0KSA9PiB7XHJcbiAgICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzcGFjZVBhZExlZnQoc3RyOiBzdHJpbmcsIGxlbjogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBzdHIucGFkU3RhcnQobGVuLCAnICcpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGRvZXNMaW5lTWF0Y2gobGluZTogc3RyaW5nLFxyXG4gICAgICByZWdleGVzOiBSZWNvcmQ8TGFuZywgUmVnRXhwPiB8IFJlZ0V4cCk6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGwge1xyXG4gICAgaWYgKHJlZ2V4ZXMgaW5zdGFuY2VvZiBSZWdFeHApXHJcbiAgICAgIHJldHVybiByZWdleGVzLmV4ZWMobGluZSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBsYW5nU3RyIGluIHJlZ2V4ZXMpIHtcclxuICAgICAgY29uc3QgbGFuZyA9IGxhbmdTdHIgYXMga2V5b2YgdHlwZW9mIHJlZ2V4ZXM7XHJcbiAgICAgIGNvbnN0IHJlcyA9IHJlZ2V4ZXNbbGFuZ10uZXhlYyhsaW5lKTtcclxuICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgIGlmIChyZXMuZ3JvdXBzKVxyXG4gICAgICAgICAgcmVzLmdyb3Vwcy5sYW5ndWFnZSA9IGxhbmc7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbWF0Y2hTdGFydChsaW5lOiBzdHJpbmcpOiBSZWdFeHBNYXRjaEFycmF5IHwgdW5kZWZpbmVkIHtcclxuICAgIGxldCByZXM7XHJcbiAgICAvLyBDdXJyZW50bHkgYWxsIG9mIHRoZXNlIHJlZ2V4ZXMgaGF2ZSBncm91cHMgaWYgdGhleSBtYXRjaCBhdCBhbGwsXHJcbiAgICAvLyBidXQgYmUgcm9idXN0IHRvIHRoYXQgY2hhbmdpbmcgaW4gdGhlIGZ1dHVyZS5cclxuICAgIHJlcyA9IEVtdWxhdG9yQ29tbW9uLmRvZXNMaW5lTWF0Y2gobGluZSwgRW11bGF0b3JDb21tb24uY291bnRkb3duUmVnZXhlcyk7XHJcbiAgICBpZiAocmVzKSB7XHJcbiAgICAgIHJlcy5ncm91cHMgPz89IHt9O1xyXG4gICAgICByZXMuZ3JvdXBzLlN0YXJ0SW4gPSAocGFyc2VJbnQocmVzLmdyb3Vwcy50aW1lID8/ICcwJykgKiAxMDAwKS50b1N0cmluZygpO1xyXG4gICAgICByZXMuZ3JvdXBzLlN0YXJ0VHlwZSA9ICdDb3VudGRvd24nO1xyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcmVzID0gRW11bGF0b3JDb21tb24uZG9lc0xpbmVNYXRjaChsaW5lLCBFbXVsYXRvckNvbW1vbi5zZWFsUmVnZXhlcyk7XHJcbiAgICBpZiAocmVzKSB7XHJcbiAgICAgIHJlcy5ncm91cHMgPz89IHt9O1xyXG4gICAgICByZXMuZ3JvdXBzLlN0YXJ0SW4gPSAnMCc7XHJcbiAgICAgIHJlcy5ncm91cHMuU3RhcnRUeXBlID0gJ1NlYWwnO1xyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcmVzID0gRW11bGF0b3JDb21tb24uZG9lc0xpbmVNYXRjaChsaW5lLCBFbXVsYXRvckNvbW1vbi5lbmdhZ2VSZWdleGVzKTtcclxuICAgIGlmIChyZXMpIHtcclxuICAgICAgcmVzLmdyb3VwcyA/Pz0ge307XHJcbiAgICAgIHJlcy5ncm91cHMuU3RhcnRJbiA9ICcwJztcclxuICAgICAgcmVzLmdyb3Vwcy5TdGFydFR5cGUgPSAnRW5nYWdlJztcclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYXRjaEVuZChsaW5lOiBzdHJpbmcpOiBSZWdFeHBNYXRjaEFycmF5IHwgdW5kZWZpbmVkIHtcclxuICAgIGxldCByZXM7XHJcbiAgICAvLyBDdXJyZW50bHkgYWxsIG9mIHRoZXNlIHJlZ2V4ZXMgaGF2ZSBncm91cHMgaWYgdGhleSBtYXRjaCBhdCBhbGwsXHJcbiAgICAvLyBidXQgYmUgcm9idXN0IHRvIHRoYXQgY2hhbmdpbmcgaW4gdGhlIGZ1dHVyZS5cclxuICAgIHJlcyA9IEVtdWxhdG9yQ29tbW9uLmRvZXNMaW5lTWF0Y2gobGluZSwgRW11bGF0b3JDb21tb24ud2luUmVnZXgpO1xyXG4gICAgaWYgKHJlcykge1xyXG4gICAgICByZXMuZ3JvdXBzID8/PSB7fTtcclxuICAgICAgcmVzLmdyb3Vwcy5FbmRUeXBlID0gJ1dpbic7XHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICByZXMgPSBFbXVsYXRvckNvbW1vbi5kb2VzTGluZU1hdGNoKGxpbmUsIEVtdWxhdG9yQ29tbW9uLndpcGVSZWdleCk7XHJcbiAgICBpZiAocmVzKSB7XHJcbiAgICAgIHJlcy5ncm91cHMgPz89IHt9O1xyXG4gICAgICByZXMuZ3JvdXBzLkVuZFR5cGUgPSAnV2lwZSc7XHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICByZXMgPSBFbXVsYXRvckNvbW1vbi5kb2VzTGluZU1hdGNoKGxpbmUsIEVtdWxhdG9yQ29tbW9uLmNhY3Rib3RXaXBlUmVnZXgpO1xyXG4gICAgaWYgKHJlcykge1xyXG4gICAgICByZXMuZ3JvdXBzID8/PSB7fTtcclxuICAgICAgcmVzLmdyb3Vwcy5FbmRUeXBlID0gJ0NhY3Rib3QgV2lwZSc7XHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICByZXMgPSBFbXVsYXRvckNvbW1vbi5kb2VzTGluZU1hdGNoKGxpbmUsIEVtdWxhdG9yQ29tbW9uLnVuc2VhbFJlZ2V4ZXMpO1xyXG4gICAgaWYgKHJlcykge1xyXG4gICAgICByZXMuZ3JvdXBzID8/PSB7fTtcclxuICAgICAgcmVzLmdyb3Vwcy5FbmRUeXBlID0gJ1Vuc2VhbCc7XHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2VhbFJlZ2V4ZXMgPSBMb2NhbGVOZXRSZWdleC5hcmVhU2VhbDtcclxuICBzdGF0aWMgZW5nYWdlUmVnZXhlcyA9IExvY2FsZU5ldFJlZ2V4LmNvdW50ZG93bkVuZ2FnZTtcclxuICBzdGF0aWMgY291bnRkb3duUmVnZXhlcyA9IExvY2FsZU5ldFJlZ2V4LmNvdW50ZG93blN0YXJ0O1xyXG4gIHN0YXRpYyB1bnNlYWxSZWdleGVzID0gTG9jYWxlTmV0UmVnZXguYXJlYVVuc2VhbDtcclxuICBzdGF0aWMgd2lwZVJlZ2V4ID0gTmV0UmVnZXhlcy5uZXR3b3JrNmQoeyBjb21tYW5kOiAnNDAwMDAwMTAnIH0pO1xyXG4gIHN0YXRpYyB3aW5SZWdleCA9IE5ldFJlZ2V4ZXMubmV0d29yazZkKHsgY29tbWFuZDogJzQwMDAwMDAzJyB9KTtcclxuICBzdGF0aWMgY2FjdGJvdFdpcGVSZWdleCA9IE5ldFJlZ2V4ZXMuZWNobyh7IGxpbmU6ICdjYWN0Ym90IHdpcGUuKj8nIH0pO1xyXG59XHJcbiIsIi8vIEhlbHBlciBFcnJvciBmb3IgVHlwZVNjcmlwdCBzaXR1YXRpb25zIHdoZXJlIHRoZSBwcm9ncmFtbWVyIHRoaW5rcyB0aGV5XHJcbi8vIGtub3cgYmV0dGVyIHRoYW4gVHlwZVNjcmlwdCB0aGF0IHNvbWUgc2l0dWF0aW9uIHdpbGwgbmV2ZXIgb2NjdXIuXHJcblxyXG4vLyBUaGUgaW50ZW50aW9uIGhlcmUgaXMgdGhhdCB0aGUgcHJvZ3JhbW1lciBkb2VzIG5vdCBleHBlY3QgYSBwYXJ0aWN1bGFyXHJcbi8vIGJpdCBvZiBjb2RlIHRvIGhhcHBlbiwgYW5kIHNvIGhhcyBub3Qgd3JpdHRlbiBjYXJlZnVsIGVycm9yIGhhbmRsaW5nLlxyXG4vLyBJZiBpdCBkb2VzIG9jY3VyLCBhdCBsZWFzdCB0aGVyZSB3aWxsIGJlIGFuIGVycm9yIGFuZCB3ZSBjYW4gZmlndXJlIG91dCB3aHkuXHJcbi8vIFRoaXMgaXMgcHJlZmVyYWJsZSB0byBjYXN0aW5nIG9yIGRpc2FibGluZyBUeXBlU2NyaXB0IGFsdG9nZXRoZXIgaW4gb3JkZXIgdG9cclxuLy8gYXZvaWQgc3ludGF4IGVycm9ycy5cclxuXHJcbi8vIE9uZSBjb21tb24gZXhhbXBsZSBpcyBhIHJlZ2V4LCB3aGVyZSBpZiB0aGUgcmVnZXggbWF0Y2hlcyB0aGVuIGFsbCBvZiB0aGVcclxuLy8gKG5vbi1vcHRpb25hbCkgcmVnZXggZ3JvdXBzIHdpbGwgYWxzbyBiZSB2YWxpZCwgYnV0IFR5cGVTY3JpcHQgZG9lc24ndCBrbm93LlxyXG5leHBvcnQgY2xhc3MgVW5yZWFjaGFibGVDb2RlIGV4dGVuZHMgRXJyb3Ige1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoJ1RoaXMgY29kZSBzaG91bGRuXFwndCBiZSByZWFjaGVkJyk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFVucmVhY2hhYmxlQ29kZSB9IGZyb20gJy4uLy4uLy4uLy4uL3Jlc291cmNlcy9ub3RfcmVhY2hlZCc7XHJcbmltcG9ydCB7IEpvYiB9IGZyb20gJy4uLy4uLy4uLy4uL3R5cGVzL2pvYic7XHJcbmltcG9ydCBDb21iYXRhbnRTdGF0ZSBmcm9tICcuL0NvbWJhdGFudFN0YXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbWJhdGFudCB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBuYW1lID0gJyc7XHJcbiAgc2VydmVyID0gJyc7XHJcbiAgc3RhdGVzOiB7IFt0aW1lc3RhbXA6IG51bWJlcl06IENvbWJhdGFudFN0YXRlIH0gPSB7fTtcclxuICBzaWduaWZpY2FudFN0YXRlczogbnVtYmVyW10gPSBbXTtcclxuICBsYXRlc3RUaW1lc3RhbXAgPSAtMTtcclxuICBqb2I/OiBKb2I7XHJcbiAgam9iSWQ/OiBudW1iZXI7XHJcbiAgbGV2ZWw/OiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgdGhpcy5zZXROYW1lKG5hbWUpO1xyXG4gIH1cclxuXHJcbiAgc2V0TmFtZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIC8vIFNvbWV0aW1lcyBuZXR3b3JrIGxpbmVzIGFycml2ZSBhZnRlciB0aGUgY29tYmF0YW50IGhhcyBiZWVuIGNsZWFyZWRcclxuICAgIC8vIGZyb20gbWVtb3J5IGluIHRoZSBjbGllbnQsIHNvIHRoZSBuZXR3b3JrIGxpbmUgd2lsbCBoYXZlIGEgdmFsaWQgSURcclxuICAgIC8vIGJ1dCB0aGUgbmFtZSB3aWxsIGJlIGJsYW5rLiBTaW5jZSB3ZSdyZSB0cmFja2luZyB0aGUgbmFtZSBmb3IgdGhlXHJcbiAgICAvLyBlbnRpcmUgZmlnaHQgYW5kIG5vdCBvbiBhIHN0YXRlLWJ5LXN0YXRlIGJhc2lzLCB3ZSBkb24ndCB3YW50IHRvXHJcbiAgICAvLyBibGFuayBvdXQgYSBuYW1lIGluIHRoaXMgY2FzZS5cclxuICAgIC8vIElmIGEgY29tYmF0YW50IGFjdHVhbGx5IGhhcyBhIGJsYW5rIG5hbWUsIHRoYXQncyBzdGlsbCBhbGxvd2VkIGJ5XHJcbiAgICAvLyB0aGUgY29uc3RydWN0b3IuXHJcbiAgICBpZiAobmFtZSA9PT0gJycpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBwYXJ0cyA9IG5hbWUuc3BsaXQoJygnKTtcclxuICAgIHRoaXMubmFtZSA9IHBhcnRzWzBdID8/ICcnO1xyXG4gICAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpXHJcbiAgICAgIHRoaXMuc2VydmVyID0gcGFydHNbMV0/LnJlcGxhY2UoL1xcKSQvLCAnJykgPz8gJyc7XHJcbiAgfVxyXG5cclxuICBoYXNTdGF0ZSh0aW1lc3RhbXA6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RhdGVzW3RpbWVzdGFtcF0gIT09IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIHB1c2hTdGF0ZSh0aW1lc3RhbXA6IG51bWJlciwgc3RhdGU6IENvbWJhdGFudFN0YXRlKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0YXRlc1t0aW1lc3RhbXBdID0gc3RhdGU7XHJcbiAgICB0aGlzLmxhdGVzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgIGlmICghdGhpcy5zaWduaWZpY2FudFN0YXRlcy5pbmNsdWRlcyh0aW1lc3RhbXApKVxyXG4gICAgICB0aGlzLnNpZ25pZmljYW50U3RhdGVzLnB1c2godGltZXN0YW1wKTtcclxuICB9XHJcblxyXG4gIG5leHRTaWduaWZpY2FudFN0YXRlKHRpbWVzdGFtcDogbnVtYmVyKTogQ29tYmF0YW50U3RhdGUge1xyXG4gICAgLy8gU2hvcnRjdXQgb3V0IGlmIHRoaXMgaXMgc2lnbmlmaWNhbnQgb3IgaWYgdGhlcmUncyBubyBoaWdoZXIgc2lnbmlmaWNhbnQgc3RhdGVcclxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zaWduaWZpY2FudFN0YXRlcy5pbmRleE9mKHRpbWVzdGFtcCk7XHJcbiAgICBjb25zdCBsYXN0U2lnbmlmaWNhbnRTdGF0ZUluZGV4ID0gdGhpcy5zaWduaWZpY2FudFN0YXRlcy5sZW5ndGggLSAxO1xyXG4gICAgLy8gSWYgdGltZXN0YW1wIGlzIGEgc2lnbmlmaWNhbnQgc3RhdGUgYWxyZWFkeSwgYW5kIGl0J3Mgbm90IHRoZSBsYXN0IG9uZSwgcmV0dXJuIHRoZSBuZXh0XHJcbiAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IGxhc3RTaWduaWZpY2FudFN0YXRlSW5kZXgpXHJcbiAgICAgIHJldHVybiB0aGlzLmdldFN0YXRlQnlJbmRleChpbmRleCArIDEpO1xyXG4gICAgLy8gSWYgdGltZXN0YW1wIGlzIHRoZSBsYXN0IHNpZ25pZmljYW50IHN0YXRlIG9yIHRoZSB0aW1lc3RhbXAgaXMgcGFzdCB0aGUgbGFzdCBzaWduaWZpY2FudFxyXG4gICAgLy8gc3RhdGUsIHJldHVybiB0aGUgbGFzdCBzaWduaWZpY2FudCBzdGF0ZVxyXG4gICAgZWxzZSBpZiAoaW5kZXggPT09IGxhc3RTaWduaWZpY2FudFN0YXRlSW5kZXggfHxcclxuICAgICAgICB0aW1lc3RhbXAgPiAodGhpcy5zaWduaWZpY2FudFN0YXRlc1tsYXN0U2lnbmlmaWNhbnRTdGF0ZUluZGV4XSA/PyAwKSlcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGVCeUluZGV4KGxhc3RTaWduaWZpY2FudFN0YXRlSW5kZXgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaWduaWZpY2FudFN0YXRlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICBjb25zdCBzdGF0ZUluZGV4ID0gdGhpcy5zaWduaWZpY2FudFN0YXRlc1tpXTtcclxuICAgICAgaWYgKHN0YXRlSW5kZXggJiYgc3RhdGVJbmRleCA+IHRpbWVzdGFtcClcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZUJ5SW5kZXgoaSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGVCeUluZGV4KHRoaXMuc2lnbmlmaWNhbnRTdGF0ZXMubGVuZ3RoIC0gMSk7XHJcbiAgfVxyXG5cclxuICBwdXNoUGFydGlhbFN0YXRlKHRpbWVzdGFtcDogbnVtYmVyLCBwcm9wczogUGFydGlhbDxDb21iYXRhbnRTdGF0ZT4pOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnN0YXRlc1t0aW1lc3RhbXBdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgLy8gQ2xvbmUgdGhlIGxhc3Qgc3RhdGUgYmVmb3JlIHRoaXMgdGltZXN0YW1wXHJcbiAgICAgIGNvbnN0IHN0YXRlVGltZXN0YW1wID0gdGhpcy5zaWduaWZpY2FudFN0YXRlc1xyXG4gICAgICAgIC5maWx0ZXIoKHMpID0+IHMgPCB0aW1lc3RhbXApXHJcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGIgLSBhKVswXSA/PyB0aGlzLnNpZ25pZmljYW50U3RhdGVzWzBdO1xyXG4gICAgICBpZiAoc3RhdGVUaW1lc3RhbXAgPT09IHVuZGVmaW5lZClcclxuICAgICAgICB0aHJvdyBuZXcgVW5yZWFjaGFibGVDb2RlKCk7XHJcbiAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZXNbc3RhdGVUaW1lc3RhbXBdO1xyXG4gICAgICBpZiAoIXN0YXRlKVxyXG4gICAgICAgIHRocm93IG5ldyBVbnJlYWNoYWJsZUNvZGUoKTtcclxuICAgICAgdGhpcy5zdGF0ZXNbdGltZXN0YW1wXSA9IHN0YXRlLnBhcnRpYWxDbG9uZShwcm9wcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGVzW3RpbWVzdGFtcF07XHJcbiAgICAgIGlmICghc3RhdGUpXHJcbiAgICAgICAgdGhyb3cgbmV3IFVucmVhY2hhYmxlQ29kZSgpO1xyXG4gICAgICB0aGlzLnN0YXRlc1t0aW1lc3RhbXBdID0gc3RhdGUucGFydGlhbENsb25lKHByb3BzKTtcclxuICAgIH1cclxuICAgIHRoaXMubGF0ZXN0VGltZXN0YW1wID0gTWF0aC5tYXgodGhpcy5sYXRlc3RUaW1lc3RhbXAsIHRpbWVzdGFtcCk7XHJcblxyXG4gICAgY29uc3QgbGFzdFNpZ25pZmljYW50U3RhdGVUaW1lc3RhbXAgPVxyXG4gICAgICB0aGlzLnNpZ25pZmljYW50U3RhdGVzW3RoaXMuc2lnbmlmaWNhbnRTdGF0ZXMubGVuZ3RoIC0gMV07XHJcbiAgICBpZiAoIWxhc3RTaWduaWZpY2FudFN0YXRlVGltZXN0YW1wKVxyXG4gICAgICB0aHJvdyBuZXcgVW5yZWFjaGFibGVDb2RlKCk7XHJcbiAgICBjb25zdCBvbGRTdGF0ZUpTT04gPSBKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlc1tsYXN0U2lnbmlmaWNhbnRTdGF0ZVRpbWVzdGFtcF0pO1xyXG4gICAgY29uc3QgbmV3U3RhdGVKU09OID0gSlNPTi5zdHJpbmdpZnkodGhpcy5zdGF0ZXNbdGltZXN0YW1wXSk7XHJcblxyXG4gICAgaWYgKGxhc3RTaWduaWZpY2FudFN0YXRlVGltZXN0YW1wICE9PSB0aW1lc3RhbXAgJiYgbmV3U3RhdGVKU09OICE9PSBvbGRTdGF0ZUpTT04pXHJcbiAgICAgIHRoaXMuc2lnbmlmaWNhbnRTdGF0ZXMucHVzaCh0aW1lc3RhbXApO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3RhdGUodGltZXN0YW1wOiBudW1iZXIpOiBDb21iYXRhbnRTdGF0ZSB7XHJcbiAgICBjb25zdCBzdGF0ZUJ5VGltZXN0YW1wID0gdGhpcy5zdGF0ZXNbdGltZXN0YW1wXTtcclxuICAgIGlmIChzdGF0ZUJ5VGltZXN0YW1wKVxyXG4gICAgICByZXR1cm4gc3RhdGVCeVRpbWVzdGFtcDtcclxuXHJcbiAgICBjb25zdCBpbml0aWFsVGltZXN0YW1wID0gdGhpcy5zaWduaWZpY2FudFN0YXRlc1swXTtcclxuICAgIGlmIChpbml0aWFsVGltZXN0YW1wID09PSB1bmRlZmluZWQpXHJcbiAgICAgIHRocm93IG5ldyBVbnJlYWNoYWJsZUNvZGUoKTtcclxuICAgIGlmICh0aW1lc3RhbXAgPCBpbml0aWFsVGltZXN0YW1wKVxyXG4gICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZUJ5SW5kZXgoMCk7XHJcblxyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgZm9yICg7IGkgPCB0aGlzLnNpZ25pZmljYW50U3RhdGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgIGNvbnN0IHByZXZUaW1lc3RhbXAgPSB0aGlzLnNpZ25pZmljYW50U3RhdGVzW2ldO1xyXG4gICAgICBpZiAocHJldlRpbWVzdGFtcCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHRocm93IG5ldyBVbnJlYWNoYWJsZUNvZGUoKTtcclxuICAgICAgaWYgKHByZXZUaW1lc3RhbXAgPiB0aW1lc3RhbXApXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGVCeUluZGV4KGkgLSAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZUJ5SW5kZXgoaSAtIDEpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIHdoZW4gYGluZGV4YCBpcyB2YWxpZC5cclxuICBwcml2YXRlIGdldFN0YXRlQnlJbmRleChpbmRleDogbnVtYmVyKTogQ29tYmF0YW50U3RhdGUge1xyXG4gICAgY29uc3Qgc3RhdGVJbmRleCA9IHRoaXMuc2lnbmlmaWNhbnRTdGF0ZXNbaW5kZXhdO1xyXG4gICAgaWYgKHN0YXRlSW5kZXggPT09IHVuZGVmaW5lZClcclxuICAgICAgdGhyb3cgbmV3IFVucmVhY2hhYmxlQ29kZSgpO1xyXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlc1tzdGF0ZUluZGV4XTtcclxuICAgIGlmIChzdGF0ZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICB0aHJvdyBuZXcgVW5yZWFjaGFibGVDb2RlKCk7XHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IEpvYiB9IGZyb20gJy4uLy4uLy4uLy4uL3R5cGVzL2pvYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21iYXRhbnRKb2JTZWFyY2gge1xyXG4gIHN0YXRpYyBnZXRKb2IoYWJpbGl0eUlkOiBudW1iZXIpOiBKb2IgfCB1bmRlZmluZWQge1xyXG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoQ29tYmF0YW50Sm9iU2VhcmNoLmFiaWxpdGllcykpIHtcclxuICAgICAgaWYgKHZhbHVlPy5pbmNsdWRlcyhhYmlsaXR5SWQpKVxyXG4gICAgICAgIHJldHVybiBrZXkgYXMga2V5b2YgdHlwZW9mIENvbWJhdGFudEpvYlNlYXJjaC5hYmlsaXRpZXM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVhZG9ubHkgYWJpbGl0eU1hdGNoUmVnZXggPSAvW2EtZkEtRjAtOV17MSw0fS9pO1xyXG5cclxuICBzdGF0aWMgcmVhZG9ubHkgYWJpbGl0aWVzOiB7IFtqb2IgaW4gSm9iXT86IG51bWJlcltdIH0gPSB7XHJcbiAgICBQTEQ6IFtcclxuICAgICAgMTI5NTksIDEyOTYxLCAxMjk2NCwgMTI5NjcsIDEyOTY4LCAxMjk2OSwgMTI5NzAsIDEyOTcxLCAxMjk3MiwgMTI5NzMsIDEyOTc0LCAxMjk3NSxcclxuICAgICAgMTI5NzYsIDEyOTc4LCAxMjk4MCwgMTI5ODEsIDEyOTgyLCAxMjk4MywgMTI5ODQsIDEyOTg1LCAxMjk4NiwgMTI5ODcsIDEyOTg4LCAxMjk4OSxcclxuICAgICAgMTI5OTEsIDEyOTkyLCAxMjk5MywgMTI5OTQsIDEyOTk2LCAxMzAwMCwgMTMwMDEsIDEzMDA2LCAxNDQ4MCwgMTY0NTcsIDE2NDU4LCAxNjQ1OSxcclxuICAgICAgMTY0NjAsIDE2NDYxLCAxNzY2OSwgMTc2NzEsIDE3NjcyLCAxNzY5MSwgMTc2OTIsIDE3NjkzLCAxNzY5NCwgMTc4NjYsIDE4MDUwLCAyNywgMjksXHJcbiAgICAgIDMwLCAzNTM4LCAzNTM5LCAzNTQwLCAzNTQxLCAzNTQyLCA0Mjg0LCA0Mjg1LCA0Mjg2LCA1MDIwNywgNTAyMDksIDUwMjQ2LCA1MDI2MCwgNTAyNjEsXHJcbiAgICAgIDUwMjYyLCA1MDI2MywgNTAyNjQsIDczODIsIDczODMsIDczODQsIDczODUsIDg3NDYsIDg3NDksIDg3NTAsIDg3NTEsIDg3NTIsIDg3NTQsIDg3NTUsXHJcbiAgICAgIDg3NTYsXHJcbiAgICBdLFxyXG4gICAgV0FSOiBbXHJcbiAgICAgIDE2NDYyLCAxNjQ2MywgMTY0NjQsIDE2NDY1LCAxNzY5NSwgMTc2OTYsIDE3Njk3LCAxNzY5OCwgMTc4ODksIDM1NDksIDM1NTAsIDM1NTEsIDM1NTIsXHJcbiAgICAgIDQyODksIDQyOTAsIDQyOTEsIDQ5LCA1MDE1NywgNTAyMTgsIDUwMjQ5LCA1MDI2NSwgNTAyNjYsIDUwMjY3LCA1MDI2OCwgNTAyNjksIDUxLCA1MixcclxuICAgICAgNzM4NiwgNzM4NywgNzM4OCwgNzM4OSwgODc1OCwgODc2MSwgODc2MiwgODc2MywgODc2NCwgODc2NSwgODc2NywgODc2OCxcclxuICAgIF0sXHJcbiAgICBEUks6IFtcclxuICAgICAgMTY0NjYsIDE2NDY3LCAxNjQ2OCwgMTY0NjksIDE2NDcwLCAxNjQ3MSwgMTY0NzIsIDE3NzAwLCAxNzcwMSwgMTc3MDIsIDM2MTcsIDM2MjEsIDM2MjMsXHJcbiAgICAgIDM2MjQsIDM2MjUsIDM2MjksIDM2MzIsIDM2MzQsIDM2MzYsIDM2MzgsIDM2MzksIDM2NDAsIDM2NDEsIDM2NDMsIDQzMDMsIDQzMDQsIDQzMDUsIDQzMDYsXHJcbiAgICAgIDQzMDcsIDQzMDgsIDQzMDksIDQzMTAsIDQzMTEsIDQzMTIsIDQ2ODAsIDUwMTU4LCA1MDE1OSwgNTAyNzEsIDUwMjcyLCA1MDMxOSwgNzM5MCwgNzM5MSxcclxuICAgICAgNzM5MiwgNzM5MywgODc2OSwgODc3MiwgODc3MywgODc3NSwgODc3NiwgODc3NywgODc3OCwgODc3OSxcclxuICAgIF0sXHJcbiAgICBHTkI6IFtcclxuICAgICAgMTc3MDMsIDE3NzA0LCAxNzcwNSwgMTc3MDYsIDE3NzA3LCAxNzcwOCwgMTc3MDksIDE3NzEwLCAxNzcxMSwgMTc3MTIsIDE3NzEzLCAxNzcxNCxcclxuICAgICAgMTc3MTYsIDE3NzE3LCAxNzg5MCwgMTc4OTEsIDE2MTM3LCA1MDMyMCwgMTYxMzgsIDE2MTM5LCAxNjE0MCwgMTYxNDEsIDE2MTQyLCAxNjE0MyxcclxuICAgICAgMTYxNDQsIDE2MTQ1LCAxNjE2MiwgNTAyNTcsIDE2MTQ4LCAxNjE0OSwgMTYxNTEsIDE2MTUyLCA1MDI1OCwgMTYxNTMsIDE2MTU0LCAxNjE0NixcclxuICAgICAgMTYxNDcsIDE2MTUwLCAxNjE1OSwgMTYxNjAsIDE2MTYxLCAxNjE1NSwgMTYxNTYsIDE2MTU3LCAxNjE1OCwgMTYxNjMsIDE2MTY0LCAxNjE2NSxcclxuICAgICAgNTAyNTksXHJcbiAgICBdLFxyXG4gICAgV0hNOiBbXHJcbiAgICAgIDEyOTU4LCAxMjk2MiwgMTI5NjUsIDEyOTk3LCAxMzAwMiwgMTMwMDMsIDEzMDA0LCAxMzAwNSwgMTMxLCAxMzYsIDEzNywgMTM5LCAxNDAsIDE0NDgxLFxyXG4gICAgICAxNTg0LCAxNjUzMSwgMTY1MzIsIDE2NTMzLCAxNjUzNCwgMTY1MzUsIDE2NTM2LCAxNzY4OCwgMTc2ODksIDE3NjkwLCAxNzc4OSwgMTc3OTAsIDE3NzkxLFxyXG4gICAgICAxNzc5MywgMTc3OTQsIDE3ODMyLCAzNTY4LCAzNTY5LCAzNTcwLCAzNTcxLCA0Mjk2LCA0Mjk3LCA1MDE4MSwgNTAxODIsIDUwMTk2LCA1MDMwNyxcclxuICAgICAgNTAzMDgsIDUwMzA5LCA1MDMxMCwgNzQzMCwgNzQzMSwgNzQzMiwgNzQzMywgODg5NSwgODg5NiwgODkwMCwgOTYyMSwgMTI3LCAxMzMsXHJcbiAgICBdLFxyXG4gICAgU0NIOiBbXHJcbiAgICAgIDE2NTM3LCAxNjUzOCwgMTY1MzksIDE2NTQwLCAxNjU0MSwgMTY1NDIsIDE2NTQzLCAxNjU0NCwgMTY1NDUsIDE2NTQ2LCAxNjU0NywgMTY1NDgsIDE2NTUwLFxyXG4gICAgICAxNjU1MSwgMTY2LCAxNjcsIDE3MjE1LCAxNzIxNiwgMTc3OTUsIDE3Nzk2LCAxNzc5NywgMTc3OTgsIDE3ODAyLCAxNzg2NCwgMTc4NjUsIDE3ODY5LFxyXG4gICAgICAxNzg3MCwgMTc5OTAsIDE4NSwgMTg2LCAxODgsIDE4OSwgMTkwLCAzNTgzLCAzNTg0LCAzNTg1LCAzNTg2LCAzNTg3LCA0MzAwLCA1MDE4NCwgNTAyMTQsXHJcbiAgICAgIDUwMzExLCA1MDMxMiwgNTAzMTMsIDUwMzI0LCA3NDM0LCA3NDM1LCA3NDM2LCA3NDM3LCA3NDM4LCA3ODY5LCA4MDIsIDgwMywgODA1LCA4OTA0LCA4OTA1LFxyXG4gICAgICA4OTA5LCA5NjIyLFxyXG4gICAgXSxcclxuICAgIEFTVDogW1xyXG4gICAgICAxMDAyNywgMTAwMjgsIDEwMDI5LCAxNjU1MiwgMTY1NTMsIDE2NTU0LCAxNjU1NSwgMTY1NTYsIDE2NTU3LCAxNjU1OCwgMTY1NTksIDE3MDU1LCAxNzE1MSxcclxuICAgICAgMTcxNTIsIDE3ODA0LCAxNzgwNSwgMTc4MDYsIDE3ODA3LCAxNzgwOSwgMTc5OTEsIDM1OTAsIDM1OTMsIDM1OTQsIDM1OTUsIDM1OTYsIDM1OTgsIDM1OTksXHJcbiAgICAgIDM2MDAsIDM2MDEsIDM2MDMsIDM2MDQsIDM2MDUsIDM2MDYsIDM2MDgsIDM2MTAsIDM2MTIsIDM2MTMsIDM2MTQsIDM2MTUsIDQzMDEsIDQzMDIsIDQ0MDEsXHJcbiAgICAgIDQ0MDIsIDQ0MDMsIDQ0MDQsIDQ0MDUsIDQ0MDYsIDQ2NzcsIDQ2NzgsIDQ2NzksIDUwMTIyLCA1MDEyNCwgNTAxMjUsIDUwMTg2LCA1MDE4NywgNTAxODgsXHJcbiAgICAgIDUwMTg5LCA1MDMxNCwgNTAzMTUsIDUwMzE2LCA3NDM5LCA3NDQwLCA3NDQxLCA3NDQyLCA3NDQzLCA3NDQ0LCA3NDQ1LCA3NDQ4LCA4MzI0LCA4OTEzLFxyXG4gICAgICA4OTE0LCA4OTE2LCA5NjI5LFxyXG4gICAgXSxcclxuICAgIE1OSzogW1xyXG4gICAgICAxMjk2MCwgMTI5NjMsIDEyOTY2LCAxMjk3NywgMTI5NzksIDEyOTkwLCAxMjk5NSwgMTI5OTgsIDEyOTk5LCAxNDQ3NiwgMTQ0NzgsIDE2NDczLCAxNjQ3NCxcclxuICAgICAgMTY0NzUsIDE2NDc2LCAxNzY3NCwgMTc2NzUsIDE3Njc2LCAxNzY3NywgMTc3MTksIDE3NzIwLCAxNzcyMSwgMTc3MjIsIDE3NzIzLCAxNzcyNCwgMTc3MjUsXHJcbiAgICAgIDE3NzI2LCAzNTQzLCAzNTQ1LCAzNTQ2LCAzNTQ3LCA0MjYyLCA0Mjg3LCA0Mjg4LCA1MDE2MCwgNTAxNjEsIDUwMjQ1LCA1MDI3MywgNTAyNzQsIDYzLCA3MCxcclxuICAgICAgNzEsIDczOTQsIDczOTUsIDczOTYsIDc0LCA4NzgwLCA4NzgxLCA4NzgyLCA4NzgzLCA4Nzg0LCA4Nzg1LCA4Nzg3LCA4Nzg5LCA4OTI1LFxyXG4gICAgXSxcclxuICAgIERSRzogW1xyXG4gICAgICAxNjQ3NywgMTY0NzgsIDE2NDc5LCAxNjQ4MCwgMTc3MjgsIDE3NzI5LCAzNTUzLCAzNTU0LCAzNTU1LCAzNTU2LCAzNTU3LCA0MjkyLCA0MjkzLCA1MDE2MixcclxuICAgICAgNTAxNjMsIDUwMjQ3LCA1MDI3NSwgNTAyNzYsIDczOTcsIDczOTgsIDczOTksIDc0MDAsIDg2LCA4NzkxLCA4NzkyLCA4NzkzLCA4Nzk0LCA4Nzk1LFxyXG4gICAgICA4Nzk2LCA4Nzk3LCA4Nzk4LCA4Nzk5LCA4ODAyLCA4ODAzLCA4ODA0LCA4ODA1LCA4ODA2LCA5MiwgOTQsIDk1LCA5NiwgOTY0MCwgNzUsIDc4LFxyXG4gICAgXSxcclxuICAgIE5JTjogW1xyXG4gICAgICAxNjQ4OCwgMTY0ODksIDE2NDkxLCAxNjQ5MiwgMTY0OTMsIDE3NDEzLCAxNzQxNCwgMTc0MTUsIDE3NDE2LCAxNzQxNywgMTc0MTgsIDE3NDE5LCAxNzQyMCxcclxuICAgICAgMTc3MzIsIDE3NzMzLCAxNzczNCwgMTc3MzUsIDE3NzM2LCAxNzczNywgMTc3MzgsIDE3NzM5LCAyMjQ2LCAyMjU5LCAyMjYwLCAyMjYxLCAyMjYyLFxyXG4gICAgICAyMjYzLCAyMjY0LCAyMjY1LCAyMjY2LCAyMjY3LCAyMjY4LCAyMjY5LCAyMjcwLCAyMjcxLCAyMjcyLCAzNTYzLCAzNTY2LCA0Mjk1LCA1MDE2NSxcclxuICAgICAgNTAxNjYsIDUwMTY3LCA1MDI1MCwgNTAyNzksIDUwMjgwLCA3NDAxLCA3NDAyLCA3NDAzLCA4ODA3LCA4ODA4LCA4ODA5LCA4ODEwLCA4ODEyLCA4ODE0LFxyXG4gICAgICA4ODE1LCA4ODE2LCA4ODIwLCA5NDYxLFxyXG4gICAgXSxcclxuICAgIFNBTTogW1xyXG4gICAgICAxNjQ4MSwgMTY0ODIsIDE2NDgzLCAxNjQ4NCwgMTY0ODUsIDE2NDg2LCAxNjQ4NywgMTc3NDAsIDE3NzQxLCAxNzc0MiwgMTc3NDMsIDE3NzQ0LCA1MDIwOCxcclxuICAgICAgNTAyMTUsIDUwMjc3LCA1MDI3OCwgNzQ3NywgNzQ3OCwgNzQ3OSwgNzQ4MCwgNzQ4MSwgNzQ4MiwgNzQ4MywgNzQ4NCwgNzQ4NSwgNzQ4NiwgNzQ4NyxcclxuICAgICAgNzQ4OCwgNzQ4OSwgNzQ5MCwgNzQ5MSwgNzQ5MiwgNzQ5MywgNzQ5NCwgNzQ5NSwgNzQ5NiwgNzQ5NywgNzQ5OCwgNzQ5OSwgNzUwMSwgNzUwMiwgNzg1NSxcclxuICAgICAgNzg1NywgNzg2NywgODgyMSwgODgyMiwgODgyMywgODgyNCwgODgyNSwgODgyNiwgODgyOCwgODgyOSwgODgzMCwgODgzMSwgODgzMyxcclxuICAgIF0sXHJcbiAgICBCUkQ6IFtcclxuICAgICAgMTAwMjMsIDExNCwgMTE2LCAxMTcsIDExOCwgMTMwMDcsIDE0NDc5LCAxNjQ5NCwgMTY0OTUsIDE2NDk2LCAxNzY3OCwgMTc2NzksIDE3NjgwLCAxNzY4MSxcclxuICAgICAgMTc2ODIsIDE3NzQ1LCAxNzc0NywgMzU1OCwgMzU1OSwgMzU2MCwgMzU2MSwgMzU2MiwgNDI5NCwgNTAxNjgsIDUwMTY5LCA1MDI4MiwgNTAyODMsIDUwMjg0LFxyXG4gICAgICA1MDI4NSwgNTAyODYsIDUwMjg3LCA3NDA0LCA3NDA1LCA3NDA2LCA3NDA3LCA3NDA4LCA3NDA5LCA4ODM2LCA4ODM3LCA4ODM4LCA4ODM5LCA4ODQxLFxyXG4gICAgICA4ODQyLCA4ODQzLCA4ODQ0LCA5NjI1LCAxMDYsXHJcbiAgICBdLFxyXG4gICAgTUNIOiBbXHJcbiAgICAgIDE2NDk3LCAxNjQ5OCwgMTY0OTksIDE2NTAwLCAxNjUwMSwgMTY1MDIsIDE2NTAzLCAxNjUwNCwgMTY3NjYsIDE2ODg5LCAxNzIwNiwgMTcyMDksIDE3NzQ5LFxyXG4gICAgICAxNzc1MCwgMTc3NTEsIDE3NzUyLCAxNzc1MywgMTc3NTQsIDI4NjQsIDI4NjYsIDI4NjgsIDI4NzAsIDI4NzIsIDI4NzMsIDI4NzQsIDI4NzYsIDI4NzgsXHJcbiAgICAgIDI4OTAsIDQyNzYsIDQ2NzUsIDQ2NzYsIDUwMTE3LCA1MDExOSwgNTAyODgsIDUwMjg5LCA1MDI5MCwgNTAyOTEsIDUwMjkyLCA1MDI5MywgNTAyOTQsXHJcbiAgICAgIDc0MTAsIDc0MTEsIDc0MTIsIDc0MTMsIDc0MTQsIDc0MTUsIDc0MTYsIDc0MTgsIDg4NDgsIDg4NDksIDg4NTAsIDg4NTEsIDg4NTMsIDg4NTUsXHJcbiAgICBdLFxyXG4gICAgRE5DOiBbXHJcbiAgICAgIDE3NzU2LCAxNzc1NywgMTc3NTgsIDE3NzU5LCAxNzc2MCwgMTc3NjEsIDE3NzYyLCAxNzc2MywgMTc3NjQsIDE3NzY1LCAxNzc2NiwgMTc3NjcsXHJcbiAgICAgIDE3NzY4LCAxNzc2OSwgMTc3NzAsIDE3NzcxLCAxNzc3MiwgMTc3NzMsIDE3ODI0LCAxNzgyNSwgMTc4MjYsIDE3ODI3LCAxNzgyOCwgMTc4MjksXHJcbiAgICAgIDE4MDc2LCAxNTk4OSwgMTU5OTAsIDE1OTkzLCAxNTk5NywgMTU5OTksIDE2MDAwLCAxNjAwMSwgMTYwMDIsIDE2MDAzLCAxNjE5MSwgMTYxOTIsXHJcbiAgICAgIDE1OTkxLCAxNTk5NCwgMTYwMDcsIDUwMjUyLCAxNTk5NSwgMTU5OTIsIDE1OTk2LCAxNjAwOCwgMTYwMTAsIDUwMjUxLCAxNjAxNSwgMTYwMTIsXHJcbiAgICAgIDE2MDA2LCAxODA3MywgNTAyNTMsIDE2MDExLCAxNjAwOSwgNTAyNTQsIDE1OTk4LCAxNjAwNCwgMTYxOTMsIDE2MTk0LCAxNjE5NSwgMTYxOTYsXHJcbiAgICAgIDE2MDEzLCAxNjAwNSwgNTAyNTUsIDUwMjU2LCAxNjAxNCxcclxuICAgIF0sXHJcbiAgICBCTE06IFtcclxuICAgICAgMTQ0NzcsIDE1MywgMTU0LCAxNTgsIDE1OSwgMTYyLCAxNjUwNSwgMTY1MDYsIDE2NTA3LCAxNzY4MywgMTc2ODQsIDE3Njg1LCAxNzY4NiwgMTc2ODcsXHJcbiAgICAgIDE3Nzc0LCAxNzc3NSwgMzU3MywgMzU3NCwgMzU3NSwgMzU3NiwgMzU3NywgNDI5OCwgNTAxNzEsIDUwMTcyLCA1MDE3MywgNTAxNzQsIDUwMjk1LFxyXG4gICAgICA1MDI5NiwgNTAyOTcsIDUwMzIxLCA1MDMyMiwgNzQxOSwgNzQyMCwgNzQyMSwgNzQyMiwgODg1OCwgODg1OSwgODg2MCwgODg2MSwgODg2MiwgODg2MyxcclxuICAgICAgODg2NCwgODg2NSwgODg2NiwgODg2NywgODg2OSwgOTYzNywgMTQ5LCAxNTUsIDE0MSwgMTUyLFxyXG4gICAgXSxcclxuICAgIFNNTjogW1xyXG4gICAgICAxNjUxMCwgMTY1MTEsIDE2NTEzLCAxNjUxNCwgMTY1MTUsIDE2NTE2LCAxNjUxNywgMTY1MTgsIDE2NTE5LCAxNjUyMiwgMTY1MjMsIDE2NTQ5LFxyXG4gICAgICAxNjc5NSwgMTY3OTYsIDE2Nzk3LCAxNjc5OCwgMTY3OTksIDE2ODAwLCAxNjgwMSwgMTY4MDIsIDE2ODAzLCAxNzc3NywgMTc3NzgsIDE3Nzc5LFxyXG4gICAgICAxNzc4MCwgMTc3ODEsIDE3NzgyLCAxNzc4MywgMTc3ODQsIDE3Nzg1LCAxODAsIDE4NCwgMzU3OCwgMzU3OSwgMzU4MCwgMzU4MSwgMzU4MiwgNDI5OSxcclxuICAgICAgNTAxNzYsIDUwMTc3LCA1MDE3OCwgNTAyMTMsIDUwMjE3LCA1MDI5OCwgNTAyOTksIDUwMzAwLCA1MDMwMSwgNTAzMDIsIDc0MjMsIDc0MjQsIDc0MjUsXHJcbiAgICAgIDc0MjYsIDc0MjcsIDc0MjgsIDc0MjksIDc0NDksIDc0NTAsIDc4NywgNzg4LCA3OTEsIDc5MiwgNzk0LCA3OTYsIDc5NywgNzk4LCA4MDAsIDgwMSxcclxuICAgICAgODg3MiwgODg3MywgODg3NCwgODg3NywgODg3OCwgODg3OSwgODg4MCwgODg4MSwgOTAxNCwgOTQzMixcclxuICAgIF0sXHJcbiAgICBSRE06IFtcclxuICAgICAgMTAwMjUsIDE2NTI0LCAxNjUyNSwgMTY1MjYsIDE2NTI3LCAxNjUyOCwgMTY1MjksIDE2NTMwLCAxNzc4NiwgMTc3ODcsIDE3Nzg4LCA1MDE5NSxcclxuICAgICAgNTAyMDAsIDUwMjAxLCA1MDIxNiwgNTAzMDMsIDUwMzA0LCA1MDMwNSwgNTAzMDYsIDc1MDMsIDc1MDQsIDc1MDUsIDc1MDYsIDc1MDcsIDc1MDksXHJcbiAgICAgIDc1MTAsIDc1MTEsIDc1MTIsIDc1MTMsIDc1MTQsIDc1MTUsIDc1MTYsIDc1MTcsIDc1MTgsIDc1MTksIDc1MjAsIDc1MjEsIDc1MjMsIDc1MjQsXHJcbiAgICAgIDc1MjUsIDc1MjYsIDc1MjcsIDc1MjgsIDc1MjksIDc1MzAsIDg4ODIsIDg4ODMsIDg4ODQsIDg4ODUsIDg4ODcsIDg4ODgsIDg4ODksIDg4OTAsXHJcbiAgICAgIDg4OTEsIDg4OTIsIDk0MzMsIDk0MzQsXHJcbiAgICBdLFxyXG4gICAgQkxVOiBbXHJcbiAgICAgIDExNzE1LCAxMTM4MywgMTEzODQsIDExMzg1LCAxMTM4NiwgMTEzODcsIDExMzg4LCAxMTM4OSwgMTEzOTAsIDExMzkxLCAxMTM5MiwgMTEzOTMsXHJcbiAgICAgIDExMzk0LCAxMTM5NSwgMTEzOTYsIDExMzk3LCAxMTM5OCwgMTEzOTksIDExNDAwLCAxMTQwMSwgMTE0MDIsIDExNDAzLCAxMTQwNCwgMTE0MDUsXHJcbiAgICAgIDExNDA2LCAxMTQwNywgMTE0MDgsIDExNDA5LCAxMTQxMCwgMTE0MTEsIDExNDEyLCAxMTQxMywgMTE0MTQsIDExNDE1LCAxMTQxNiwgMTE0MTcsXHJcbiAgICAgIDExNDE4LCAxMTQxOSwgMTE0MjAsIDExNDIxLCAxMTQyMiwgMTE0MjMsIDExNDI0LCAxMTQyNSwgMTE0MjYsIDExNDI3LCAxMTQyOCwgMTE0MjksXHJcbiAgICAgIDExNDMwLCAxMTQzMSwgNTAyMTksIDUwMjIwLCA1MDIyMSwgNTAyMjIsIDUwMjIzLCA1MDIyNCxcclxuICAgIF0sXHJcbiAgfTtcclxufVxyXG4iLCIvLyBNZW1iZXIgbmFtZXMgdGFrZW4gZnJvbSBPdmVybGF5UGx1Z2luJ3MgTWluaVBhcnNlLmNzXHJcbi8vIFR5cGVzIHRha2VuIGZyb20gRkZYSVYgcGFyc2VyIHBsdWdpblxyXG5leHBvcnQgaW50ZXJmYWNlIFBsdWdpblN0YXRlIHtcclxuICBDdXJyZW50V29ybGRJRD86IG51bWJlcjtcclxuICBXb3JsZElEPzogbnVtYmVyO1xyXG4gIFdvcmxkTmFtZT86IHN0cmluZztcclxuICBCTnBjSUQ/OiBudW1iZXI7XHJcbiAgQk5wY05hbWVJRD86IG51bWJlcjtcclxuICBQYXJ0eVR5cGU/OiBudW1iZXI7XHJcbiAgSUQ/OiBudW1iZXI7XHJcbiAgT3duZXJJRD86IG51bWJlcjtcclxuICB0eXBlPzogbnVtYmVyO1xyXG4gIEpvYj86IG51bWJlcjtcclxuICBMZXZlbD86IG51bWJlcjtcclxuICBOYW1lPzogc3RyaW5nO1xyXG4gIEN1cnJlbnRIUDogbnVtYmVyO1xyXG4gIE1heEhQOiBudW1iZXI7XHJcbiAgQ3VycmVudE1QOiBudW1iZXI7XHJcbiAgTWF4TVA6IG51bWJlcjtcclxuICBQb3NYOiBudW1iZXI7XHJcbiAgUG9zWTogbnVtYmVyO1xyXG4gIFBvc1o6IG51bWJlcjtcclxuICBIZWFkaW5nOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbWJhdGFudFN0YXRlIHtcclxuICBwb3NYOiBudW1iZXI7XHJcbiAgcG9zWTogbnVtYmVyO1xyXG4gIHBvc1o6IG51bWJlcjtcclxuICBoZWFkaW5nOiBudW1iZXI7XHJcbiAgdGFyZ2V0YWJsZTogYm9vbGVhbjtcclxuICBocDogbnVtYmVyO1xyXG4gIG1heEhwOiBudW1iZXI7XHJcbiAgbXA6IG51bWJlcjtcclxuICBtYXhNcDogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwb3NYOiBudW1iZXIsIHBvc1k6IG51bWJlciwgcG9zWjogbnVtYmVyLCBoZWFkaW5nOiBudW1iZXIsXHJcbiAgICAgIHRhcmdldGFibGU6IGJvb2xlYW4sXHJcbiAgICAgIGhwOiBudW1iZXIsIG1heEhwOiBudW1iZXIsIG1wOiBudW1iZXIsIG1heE1wOiBudW1iZXIpIHtcclxuICAgIHRoaXMucG9zWCA9IHBvc1g7XHJcbiAgICB0aGlzLnBvc1kgPSBwb3NZO1xyXG4gICAgdGhpcy5wb3NaID0gcG9zWjtcclxuICAgIHRoaXMuaGVhZGluZyA9IGhlYWRpbmc7XHJcbiAgICB0aGlzLnRhcmdldGFibGUgPSB0YXJnZXRhYmxlO1xyXG4gICAgdGhpcy5ocCA9IGhwO1xyXG4gICAgdGhpcy5tYXhIcCA9IG1heEhwO1xyXG4gICAgdGhpcy5tcCA9IG1wO1xyXG4gICAgdGhpcy5tYXhNcCA9IG1heE1wO1xyXG4gIH1cclxuXHJcbiAgcGFydGlhbENsb25lKHByb3BzOiBQYXJ0aWFsPENvbWJhdGFudFN0YXRlPik6IENvbWJhdGFudFN0YXRlIHtcclxuICAgIHJldHVybiBuZXcgQ29tYmF0YW50U3RhdGUoXHJcbiAgICAgICAgcHJvcHMucG9zWCA/PyB0aGlzLnBvc1gsXHJcbiAgICAgICAgcHJvcHMucG9zWSA/PyB0aGlzLnBvc1ksXHJcbiAgICAgICAgcHJvcHMucG9zWiA/PyB0aGlzLnBvc1osXHJcbiAgICAgICAgcHJvcHMuaGVhZGluZyA/PyB0aGlzLmhlYWRpbmcsXHJcbiAgICAgICAgcHJvcHMudGFyZ2V0YWJsZSA/PyB0aGlzLnRhcmdldGFibGUsXHJcbiAgICAgICAgcHJvcHMuaHAgPz8gdGhpcy5ocCxcclxuICAgICAgICBwcm9wcy5tYXhIcCA/PyB0aGlzLm1heEhwLFxyXG4gICAgICAgIHByb3BzLm1wID8/IHRoaXMubXAsXHJcbiAgICAgICAgcHJvcHMubWF4TXAgPz8gdGhpcy5tYXhNcCk7XHJcbiAgfVxyXG5cclxuICB0b1BsdWdpblN0YXRlKCk6IFBsdWdpblN0YXRlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIFBvc1g6IHRoaXMucG9zWCxcclxuICAgICAgUG9zWTogdGhpcy5wb3NZLFxyXG4gICAgICBQb3NaOiB0aGlzLnBvc1osXHJcbiAgICAgIEhlYWRpbmc6IHRoaXMuaGVhZGluZyxcclxuICAgICAgQ3VycmVudEhQOiB0aGlzLmhwLFxyXG4gICAgICBNYXhIUDogdGhpcy5tYXhIcCxcclxuICAgICAgQ3VycmVudE1QOiB0aGlzLm1wLFxyXG4gICAgICBNYXhNUDogdGhpcy5tYXhNcCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsIi8vIEF1dG8tZ2VuZXJhdGVkIGZyb20gZ2VuX3BldF9uYW1lcy5weVxyXG4vLyBETyBOT1QgRURJVCBUSElTIEZJTEUgRElSRUNUTFlcclxuXHJcbmltcG9ydCB7IExhbmcgfSBmcm9tICcuL2xhbmd1YWdlcyc7XHJcblxyXG50eXBlIFBldERhdGEgPSB7XHJcbiAgW25hbWUgaW4gTGFuZ106IHJlYWRvbmx5IHN0cmluZ1tdO1xyXG59O1xyXG5cclxuY29uc3QgZGF0YTogUGV0RGF0YSA9IHtcclxuICAnY24nOiBbXHJcbiAgICAn57u/5a6d55+z5YW9JyxcclxuICAgICfpu4Tlrp3nn7Plhb0nLFxyXG4gICAgJ+S8iuW8l+WIqeeJueS5i+eBtScsXHJcbiAgICAn5rOw5Z2m5LmL54G1JyxcclxuICAgICfov6bmpbznvZfkuYvngbUnLFxyXG4gICAgJ+acneaXpeWwj+S7meWlsycsXHJcbiAgICAn5aSV5pyI5bCP5LuZ5aWzJyxcclxuICAgICfovablvI/mta7nqbrngq7loZQnLFxyXG4gICAgJ+ixoeW8j+a1ruepuueCruWhlCcsXHJcbiAgICAn5Lqa54G156We5be05ZOI5aeG54m5JyxcclxuICAgICfkuprngbXnpZ7kuI3mrbvpuJ8nLFxyXG4gICAgJ+eCveWkqeS9vycsXHJcbiAgICAn5pyI6ZW/5a6d55+z5YW9JyxcclxuICAgICfoi7Hpm4TnmoTmjqDlvbEnLFxyXG4gICAgJ+WQjuW8j+iHqui1sOS6uuWBticsXHJcbiAgICAn5YiG6LqrJyxcclxuICBdLFxyXG4gICdkZSc6IFtcclxuICAgICdTbWFyYWdkLUthcmZ1bmtlbCcsXHJcbiAgICAnVG9wYXMtS2FyZnVua2VsJyxcclxuICAgICdJZnJpdC1FZ2knLFxyXG4gICAgJ1RpdGFuLUVnaScsXHJcbiAgICAnR2FydWRhLUVnaScsXHJcbiAgICAnRW9zJyxcclxuICAgICdTZWxlbmUnLFxyXG4gICAgJ1NlbGJzdHNjaHVzcy1HeXJvY29wdGVyIFRVUk0nLFxyXG4gICAgJ1NlbGJzdHNjaHVzcy1HeXJvY29wdGVyIEzDhFVGRVInLFxyXG4gICAgJ0RlbWktQmFoYW11dCcsXHJcbiAgICAnRGVtaS1QaMO2bml4JyxcclxuICAgICdTZXJhcGgnLFxyXG4gICAgJ01vbmRzdGVpbi1LYXJmdW5rZWwnLFxyXG4gICAgJ1NjaGF0dGVuc2NoZW1lbicsXHJcbiAgICAnQXV0b21hdG9uIERBTUUnLFxyXG4gICAgJ0dlZG9wcGVsdGVzIEljaCcsXHJcbiAgXSxcclxuICAnZW4nOiBbXHJcbiAgICAnRW1lcmFsZCBDYXJidW5jbGUnLFxyXG4gICAgJ1RvcGF6IENhcmJ1bmNsZScsXHJcbiAgICAnSWZyaXQtRWdpJyxcclxuICAgICdUaXRhbi1FZ2knLFxyXG4gICAgJ0dhcnVkYS1FZ2knLFxyXG4gICAgJ0VvcycsXHJcbiAgICAnU2VsZW5lJyxcclxuICAgICdSb29rIEF1dG90dXJyZXQnLFxyXG4gICAgJ0Jpc2hvcCBBdXRvdHVycmV0JyxcclxuICAgICdEZW1pLUJhaGFtdXQnLFxyXG4gICAgJ0RlbWktUGhvZW5peCcsXHJcbiAgICAnU2VyYXBoJyxcclxuICAgICdNb29uc3RvbmUgQ2FyYnVuY2xlJyxcclxuICAgICdFc3RlZW0nLFxyXG4gICAgJ0F1dG9tYXRvbiBRdWVlbicsXHJcbiAgICAnQnVuc2hpbicsXHJcbiAgXSxcclxuICAnZnInOiBbXHJcbiAgICAnQ2FyYnVuY2xlIMOpbWVyYXVkZScsXHJcbiAgICAnQ2FyYnVuY2xlIHRvcGF6ZScsXHJcbiAgICAnSWZyaXQtRWdpJyxcclxuICAgICdUaXRhbi1FZ2knLFxyXG4gICAgJ0dhcnVkYS1FZ2knLFxyXG4gICAgJ0VvcycsXHJcbiAgICAnU2VsZW5lJyxcclxuICAgICdBdXRvLXRvdXJlbGxlIFRvdXInLFxyXG4gICAgJ0F1dG8tdG91cmVsbGUgRm91JyxcclxuICAgICdEZW1pLUJhaGFtdXQnLFxyXG4gICAgJ0RlbWktUGjDqW5peCcsXHJcbiAgICAnU8OpcmFwaGluJyxcclxuICAgICdDYXJidW5jbGUgaMOpY2F0b2xpdGUnLFxyXG4gICAgJ0VzdGltZScsXHJcbiAgICAnQXV0b21hdGUgUmVpbmUnLFxyXG4gICAgJ09tYnJlJyxcclxuICBdLFxyXG4gICdqYSc6IFtcclxuICAgICfjgqvjg7zjg5Djg7Pjgq/jg6vjg7vjgqjjg6Hjg6njg6vjg4knLFxyXG4gICAgJ+OCq+ODvOODkOODs+OCr+ODq+ODu+ODiOODkeODvOOCuicsXHJcbiAgICAn44Kk44OV44Oq44O844OI44O744Ko44KuJyxcclxuICAgICfjgr/jgqTjgr/jg7Pjg7vjgqjjgq4nLFxyXG4gICAgJ+OCrOODq+ODvOODgOODu+OCqOOCricsXHJcbiAgICAn44OV44Kn44Ki44Oq44O844O744Ko44Kq44K5JyxcclxuICAgICfjg5XjgqfjgqLjg6rjg7zjg7vjgrvjg6zjg40nLFxyXG4gICAgJ+OCquODvOODiOOCv+ODrOODg+ODiOODu+ODq+ODvOOCrycsXHJcbiAgICAn44Kq44O844OI44K/44Os44OD44OI44O744OT44K344On44OD44OXJyxcclxuICAgICfjg4fjg5/jg7vjg5Djg4/jg6Djg7zjg4gnLFxyXG4gICAgJ+ODh+ODn+ODu+ODleOCp+ODi+ODg+OCr+OCuScsXHJcbiAgICAn44K744Op44OV44Kj44OgJyxcclxuICAgICfjgqvjg7zjg5Djg7Pjgq/jg6vjg7vjg6Djg7zjg7Pjgrnjg4jjg7zjg7MnLFxyXG4gICAgJ+iLsembhOOBruW9sei6qycsXHJcbiAgICAn44Kq44O844OI44Oe44OI44Oz44O744Kv44Kk44O844OzJyxcclxuICAgICfliIbouqsnLFxyXG4gIF0sXHJcbiAgJ2tvJzogW1xyXG4gICAgJ+y5tOuyme2BtCDsl5DrqZTrnoTrk5wnLFxyXG4gICAgJ+y5tOuyme2BtCDthqDtjIzspognLFxyXG4gICAgJ+ydtO2UhOumrO2KuCDsl5DquLAnLFxyXG4gICAgJ+2DgOydtO2DhCDsl5DquLAnLFxyXG4gICAgJ+qwgOujqOuLpCDsl5DquLAnLFxyXG4gICAgJ+yalOyglSDsl5DsmKTsiqQnLFxyXG4gICAgJ+yalOyglSDshYDroIjrhKQnLFxyXG4gICAgJ+yekOuPme2PrO2DkSDro6knLFxyXG4gICAgJ+yekOuPme2PrO2DkSDruYTsiI0nLFxyXG4gICAgJ+uNsOuvuOuwlO2VmOustO2KuCcsXHJcbiAgICAn642w66+47ZS864uJ7IqkJyxcclxuICAgICfshLjrnbztlYwnLFxyXG4gICAgJ+y5tOuyme2BtCDrrLjsiqTthqQnLFxyXG4gICAgJ+yYgeybheydmCDtmZjsmIEnLFxyXG4gICAgJ+yekOuPmeyduO2YlSDtgLgnLFxyXG4gICAgJ+u2hOyLoCcsXHJcbiAgXSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRhdGE7XHJcbiIsImltcG9ydCB7IEpvYiB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL2pvYic7XHJcbmltcG9ydCBFbXVsYXRvckNvbW1vbiBmcm9tICcuLi8uLi9FbXVsYXRvckNvbW1vbic7XHJcbmltcG9ydCBMb2dSZXBvc2l0b3J5IGZyb20gJy4vTG9nUmVwb3NpdG9yeSc7XHJcblxyXG5jb25zdCBmaWVsZHMgPSB7XHJcbiAgZXZlbnQ6IDAsXHJcbiAgdGltZXN0YW1wOiAxLFxyXG59IGFzIGNvbnN0O1xyXG5cclxuLyoqXHJcbiAqIEdlbmVyaWMgY2xhc3MgdG8gdHJhY2sgYW4gRkZYSVYgbG9nIGxpbmVcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVFdmVudCB7XHJcbiAgcHVibGljIG9mZnNldCA9IDA7XHJcbiAgcHVibGljIGNvbnZlcnRlZExpbmU6IHN0cmluZztcclxuICBwdWJsaWMgaW52YWxpZCA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpbmRleCA9IDA7XHJcbiAgcHVibGljIHJlYWRvbmx5IGRlY0V2ZW50OiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IGhleEV2ZW50OiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRpbWVzdGFtcDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBjaGVja3N1bTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBwcm9wZXJDYXNlQ29udmVydGVkTGluZT86IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocmVwbzogTG9nUmVwb3NpdG9yeSwgcHVibGljIG5ldHdvcmtMaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgdGhpcy5kZWNFdmVudCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5ldmVudF0gPz8gJzAnKTtcclxuICAgIHRoaXMuaGV4RXZlbnQgPSBFbXVsYXRvckNvbW1vbi56ZXJvUGFkKHRoaXMuZGVjRXZlbnQudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkpO1xyXG4gICAgdGhpcy50aW1lc3RhbXAgPSBuZXcgRGF0ZShwYXJ0c1tmaWVsZHMudGltZXN0YW1wXSA/PyAnMCcpLmdldFRpbWUoKTtcclxuICAgIHRoaXMuY2hlY2tzdW0gPSBwYXJ0cy5zbGljZSgtMSlbMF0gPz8gJyc7XHJcbiAgICByZXBvLnVwZGF0ZVRpbWVzdGFtcCh0aGlzLnRpbWVzdGFtcCk7XHJcbiAgICB0aGlzLmNvbnZlcnRlZExpbmUgPSB0aGlzLnByZWZpeCgpICsgKHBhcnRzLmpvaW4oJzonKSkucmVwbGFjZSgnfCcsICc6Jyk7XHJcbiAgfVxyXG5cclxuICBwcmVmaXgoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAnWycgKyBFbXVsYXRvckNvbW1vbi50aW1lVG9UaW1lU3RyaW5nKHRoaXMudGltZXN0YW1wLCB0cnVlKSArICddICcgKyB0aGlzLmhleEV2ZW50ICsgJzonO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGlzRGFtYWdlSGFsbG93ZWQoZGFtYWdlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAocGFyc2VJbnQoZGFtYWdlLCAxNikgJiBwYXJzZUludCgnMTAwMCcsIDE2KSkgPiAwO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGlzRGFtYWdlQmlnKGRhbWFnZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gKHBhcnNlSW50KGRhbWFnZSwgMTYpICYgcGFyc2VJbnQoJzQwMDAnLCAxNikpID4gMDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjYWxjdWxhdGVEYW1hZ2UoZGFtYWdlOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgaWYgKExpbmVFdmVudC5pc0RhbWFnZUhhbGxvd2VkKGRhbWFnZSkpXHJcbiAgICAgIHJldHVybiAwO1xyXG5cclxuICAgIGRhbWFnZSA9IEVtdWxhdG9yQ29tbW9uLnplcm9QYWQoZGFtYWdlLCA4KTtcclxuICAgIGNvbnN0IHBhcnRzID0gW1xyXG4gICAgICBkYW1hZ2Uuc3Vic3RyKDAsIDIpLFxyXG4gICAgICBkYW1hZ2Uuc3Vic3RyKDIsIDIpLFxyXG4gICAgICBkYW1hZ2Uuc3Vic3RyKDQsIDIpLFxyXG4gICAgICBkYW1hZ2Uuc3Vic3RyKDYsIDIpLFxyXG4gICAgXSBhcyBjb25zdDtcclxuXHJcbiAgICBpZiAoIUxpbmVFdmVudC5pc0RhbWFnZUJpZyhkYW1hZ2UpKVxyXG4gICAgICByZXR1cm4gcGFyc2VJbnQocGFydHMuc2xpY2UoMCwgMikucmV2ZXJzZSgpLmpvaW4oJycpLCAxNik7XHJcblxyXG4gICAgcmV0dXJuIHBhcnNlSW50KFxyXG4gICAgICAgIChwYXJ0c1szXSArIHBhcnRzWzBdKSArXHJcbiAgICAgIChwYXJzZUludChwYXJ0c1sxXSwgMTYpIC0gcGFyc2VJbnQocGFydHNbM10sIDE2KVxyXG4gICAgICApLnRvU3RyaW5nKDE2KSwgMTYpO1xyXG4gIH1cclxufVxyXG5cclxuLy8gVHlwZSBndWFyZHMgZm9yIHRoZXNlIGludGVyZmFjZXMgcmVxdWlyZSB0aGVpciBvd24gZGVzY3JpcHRvciBwcm9wZXJ0eVxyXG4vLyBiZWNhdXNlIHdlIGRvbid0IHdhbnQgZXZlcnkgbGluZSBldmVudCB3aXRoIGFuIGlkL25hbWVcclxuLy8gdG8gdXBkYXRlIGNvbWJhdGFudCBzdGF0ZSwgZm9yIGV4YW1wbGVcclxuZXhwb3J0IGludGVyZmFjZSBMaW5lRXZlbnRTb3VyY2UgZXh0ZW5kcyBMaW5lRXZlbnQge1xyXG4gIHJlYWRvbmx5IGlzU291cmNlOiB0cnVlO1xyXG4gIHJlYWRvbmx5IGlkOiBzdHJpbmc7XHJcbiAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG4gIHJlYWRvbmx5IHg/OiBudW1iZXI7XHJcbiAgcmVhZG9ubHkgeT86IG51bWJlcjtcclxuICByZWFkb25seSB6PzogbnVtYmVyO1xyXG4gIHJlYWRvbmx5IGhlYWRpbmc/OiBudW1iZXI7XHJcbiAgcmVhZG9ubHkgdGFyZ2V0YWJsZT86IGJvb2xlYW47XHJcbiAgcmVhZG9ubHkgaHA/OiBudW1iZXI7XHJcbiAgcmVhZG9ubHkgbWF4SHA/OiBudW1iZXI7XHJcbiAgcmVhZG9ubHkgbXA/OiBudW1iZXI7XHJcbiAgcmVhZG9ubHkgbWF4TXA/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpc0xpbmVFdmVudFNvdXJjZSA9IChsaW5lOiBMaW5lRXZlbnQpOiBsaW5lIGlzIExpbmVFdmVudFNvdXJjZSA9PiB7XHJcbiAgcmV0dXJuICdpc1NvdXJjZScgaW4gbGluZTtcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGluZUV2ZW50VGFyZ2V0IGV4dGVuZHMgTGluZUV2ZW50IHtcclxuICByZWFkb25seSBpc1RhcmdldDogdHJ1ZTtcclxuICByZWFkb25seSB0YXJnZXRJZDogc3RyaW5nO1xyXG4gIHJlYWRvbmx5IHRhcmdldE5hbWU6IHN0cmluZztcclxuICByZWFkb25seSB0YXJnZXRYPzogbnVtYmVyO1xyXG4gIHJlYWRvbmx5IHRhcmdldFk/OiBudW1iZXI7XHJcbiAgcmVhZG9ubHkgdGFyZ2V0Wj86IG51bWJlcjtcclxuICByZWFkb25seSB0YXJnZXRIZWFkaW5nPzogbnVtYmVyO1xyXG4gIHJlYWRvbmx5IHRhcmdldEhwPzogbnVtYmVyO1xyXG4gIHJlYWRvbmx5IHRhcmdldE1heEhwPzogbnVtYmVyO1xyXG4gIHJlYWRvbmx5IHRhcmdldE1wPzogbnVtYmVyO1xyXG4gIHJlYWRvbmx5IHRhcmdldE1heE1wPzogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaXNMaW5lRXZlbnRUYXJnZXQgPSAobGluZTogTGluZUV2ZW50KTogbGluZSBpcyBMaW5lRXZlbnRUYXJnZXQgPT4ge1xyXG4gIHJldHVybiAnaXNUYXJnZXQnIGluIGxpbmU7XHJcbn07XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExpbmVFdmVudEpvYkxldmVsIGV4dGVuZHMgTGluZUV2ZW50IHtcclxuICByZWFkb25seSBpc0pvYkxldmVsOiB0cnVlO1xyXG4gIHJlYWRvbmx5IGpvYjogSm9iO1xyXG4gIHJlYWRvbmx5IGpvYklkOiBudW1iZXI7XHJcbiAgcmVhZG9ubHkgbGV2ZWw6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGlzTGluZUV2ZW50Sm9iTGV2ZWwgPSAobGluZTogTGluZUV2ZW50KTogbGluZSBpcyBMaW5lRXZlbnRKb2JMZXZlbCA9PiB7XHJcbiAgcmV0dXJuICdpc0pvYkxldmVsJyBpbiBsaW5lO1xyXG59O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMaW5lRXZlbnRBYmlsaXR5IGV4dGVuZHMgTGluZUV2ZW50IHtcclxuICByZWFkb25seSBpc0FiaWxpdHk6IHRydWU7XHJcbiAgcmVhZG9ubHkgYWJpbGl0eUlkOiBudW1iZXI7XHJcbiAgcmVhZG9ubHkgYWJpbGl0eU5hbWU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGlzTGluZUV2ZW50QWJpbGl0eSA9IChsaW5lOiBMaW5lRXZlbnQpOiBsaW5lIGlzIExpbmVFdmVudEFiaWxpdHkgPT4ge1xyXG4gIHJldHVybiAnaXNBYmlsaXR5JyBpbiBsaW5lO1xyXG59O1xyXG4iLCJpbXBvcnQgQ29tYmF0YW50IGZyb20gJy4vQ29tYmF0YW50JztcclxuaW1wb3J0IENvbWJhdGFudEpvYlNlYXJjaCBmcm9tICcuL0NvbWJhdGFudEpvYlNlYXJjaCc7XHJcbmltcG9ydCBDb21iYXRhbnRTdGF0ZSBmcm9tICcuL0NvbWJhdGFudFN0YXRlJztcclxuaW1wb3J0IFBldE5hbWVzQnlMYW5nIGZyb20gJy4uLy4uLy4uLy4uL3Jlc291cmNlcy9wZXRfbmFtZXMnO1xyXG5pbXBvcnQgTGluZUV2ZW50LCB7IGlzTGluZUV2ZW50Sm9iTGV2ZWwsIGlzTGluZUV2ZW50QWJpbGl0eSwgaXNMaW5lRXZlbnRTb3VyY2UsIGlzTGluZUV2ZW50VGFyZ2V0LCBMaW5lRXZlbnRTb3VyY2UsIExpbmVFdmVudFRhcmdldCB9IGZyb20gJy4vbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudCc7XHJcbmltcG9ydCB7IExhbmcgfSBmcm9tICcuLi8uLi8uLi8uLi9yZXNvdXJjZXMvbGFuZ3VhZ2VzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbWJhdGFudFRyYWNrZXIge1xyXG4gIGxhbmd1YWdlOiBMYW5nO1xyXG4gIGZpcnN0VGltZXN0YW1wOiBudW1iZXI7XHJcbiAgbGFzdFRpbWVzdGFtcDogbnVtYmVyO1xyXG4gIGNvbWJhdGFudHM6IHsgW2lkOiBzdHJpbmddOiBDb21iYXRhbnQgfSA9IHt9O1xyXG4gIHBhcnR5TWVtYmVyczogc3RyaW5nW10gPSBbXTtcclxuICBlbmVtaWVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gIG90aGVyczogc3RyaW5nW10gPSBbXTtcclxuICBwZXRzOiBzdHJpbmdbXSA9IFtdO1xyXG4gIG1haW5Db21iYXRhbnRJRD86IHN0cmluZztcclxuICBpbml0aWFsU3RhdGVzOiB7IFtpZDogc3RyaW5nXTogUGFydGlhbDxDb21iYXRhbnRTdGF0ZT4gfSA9IHt9O1xyXG4gIGNvbnN0cnVjdG9yKGxvZ0xpbmVzOiBMaW5lRXZlbnRbXSwgbGFuZ3VhZ2U6IExhbmcpIHtcclxuICAgIHRoaXMubGFuZ3VhZ2UgPSBsYW5ndWFnZTtcclxuICAgIHRoaXMuZmlyc3RUaW1lc3RhbXAgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICAgIHRoaXMubGFzdFRpbWVzdGFtcCA9IDA7XHJcbiAgICB0aGlzLmluaXRpYWxpemUobG9nTGluZXMpO1xyXG4gICAgLy8gQ2xlYXIgaW5pdGlhbFN0YXRlcyBhZnRlciB3ZSBpbml0aWFsaXplLCB3ZSBkb24ndCBuZWVkIGl0IGFueW1vcmVcclxuICAgIHRoaXMuaW5pdGlhbFN0YXRlcyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZShsb2dMaW5lczogTGluZUV2ZW50W10pOiB2b2lkIHtcclxuICAgIC8vIEZpcnN0IHBhc3M6IEdldCBsaXN0IG9mIGNvbWJhdGFudHMsIGZpZ3VyZSBvdXQgd2hlcmUgdGhleVxyXG4gICAgLy8gc3RhcnQgYXQgaWYgcG9zc2libGVcclxuICAgIGZvciAoY29uc3QgbGluZSBvZiBsb2dMaW5lcykge1xyXG4gICAgICB0aGlzLmZpcnN0VGltZXN0YW1wID0gTWF0aC5taW4odGhpcy5maXJzdFRpbWVzdGFtcCwgbGluZS50aW1lc3RhbXApO1xyXG4gICAgICB0aGlzLmxhc3RUaW1lc3RhbXAgPSBNYXRoLm1heCh0aGlzLmxhc3RUaW1lc3RhbXAsIGxpbmUudGltZXN0YW1wKTtcclxuXHJcbiAgICAgIGlmIChpc0xpbmVFdmVudFNvdXJjZShsaW5lKSlcclxuICAgICAgICB0aGlzLmFkZENvbWJhdGFudEZyb21MaW5lKGxpbmUpO1xyXG5cclxuICAgICAgaWYgKGlzTGluZUV2ZW50VGFyZ2V0KGxpbmUpKVxyXG4gICAgICAgIHRoaXMuYWRkQ29tYmF0YW50RnJvbVRhcmdldExpbmUobGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQmV0d2VlbiBwYXNzZXM6IENyZWF0ZSBvdXIgaW5pdGlhbCBjb21iYXRhbnQgc3RhdGVzXHJcbiAgICBmb3IgKGNvbnN0IGlkIGluIHRoaXMuaW5pdGlhbFN0YXRlcykge1xyXG4gICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuaW5pdGlhbFN0YXRlc1tpZF0gPz8ge307XHJcbiAgICAgIHRoaXMuY29tYmF0YW50c1tpZF0/LnB1c2hTdGF0ZSh0aGlzLmZpcnN0VGltZXN0YW1wLCBuZXcgQ29tYmF0YW50U3RhdGUoXHJcbiAgICAgICAgICBOdW1iZXIoc3RhdGUucG9zWCksXHJcbiAgICAgICAgICBOdW1iZXIoc3RhdGUucG9zWSksXHJcbiAgICAgICAgICBOdW1iZXIoc3RhdGUucG9zWiksXHJcbiAgICAgICAgICBOdW1iZXIoc3RhdGUuaGVhZGluZyksXHJcbiAgICAgICAgICBzdGF0ZS50YXJnZXRhYmxlID8/IGZhbHNlLFxyXG4gICAgICAgICAgTnVtYmVyKHN0YXRlLmhwKSxcclxuICAgICAgICAgIE51bWJlcihzdGF0ZS5tYXhIcCksXHJcbiAgICAgICAgICBOdW1iZXIoc3RhdGUubXApLFxyXG4gICAgICAgICAgTnVtYmVyKHN0YXRlLm1heE1wKSxcclxuICAgICAgKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2Vjb25kIHBhc3M6IEFuYWx5emUgY29tYmF0YW50IGluZm9ybWF0aW9uIGZvciB0cmFja2luZ1xyXG4gICAgY29uc3QgZXZlbnRUcmFja2VyOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge307XHJcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbG9nTGluZXMpIHtcclxuICAgICAgaWYgKGlzTGluZUV2ZW50U291cmNlKGxpbmUpKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLmV4dHJhY3RTdGF0ZUZyb21MaW5lKGxpbmUpO1xyXG4gICAgICAgIGlmIChzdGF0ZSkge1xyXG4gICAgICAgICAgZXZlbnRUcmFja2VyW2xpbmUuaWRdID0gZXZlbnRUcmFja2VyW2xpbmUuaWRdID8/IDA7XHJcbiAgICAgICAgICArK2V2ZW50VHJhY2tlcltsaW5lLmlkXTtcclxuICAgICAgICAgIHRoaXMuY29tYmF0YW50c1tsaW5lLmlkXT8ucHVzaFBhcnRpYWxTdGF0ZShsaW5lLnRpbWVzdGFtcCwgc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoaXNMaW5lRXZlbnRUYXJnZXQobGluZSkpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuZXh0cmFjdFN0YXRlRnJvbVRhcmdldExpbmUobGluZSk7XHJcbiAgICAgICAgaWYgKHN0YXRlKSB7XHJcbiAgICAgICAgICBldmVudFRyYWNrZXJbbGluZS50YXJnZXRJZF0gPSBldmVudFRyYWNrZXJbbGluZS50YXJnZXRJZF0gPz8gMDtcclxuICAgICAgICAgICsrZXZlbnRUcmFja2VyW2xpbmUudGFyZ2V0SWRdO1xyXG4gICAgICAgICAgdGhpcy5jb21iYXRhbnRzW2xpbmUudGFyZ2V0SWRdPy5wdXNoUGFydGlhbFN0YXRlKGxpbmUudGltZXN0YW1wLCBzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRmlndXJlIG91dCBwYXJ0eS9lbmVteS9vdGhlciBzdGF0dXNcclxuICAgIGNvbnN0IHBldE5hbWVzID0gUGV0TmFtZXNCeUxhbmdbdGhpcy5sYW5ndWFnZV07XHJcbiAgICB0aGlzLm90aGVycyA9IHRoaXMub3RoZXJzLmZpbHRlcigoSUQpID0+IHtcclxuICAgICAgaWYgKHRoaXMuY29tYmF0YW50c1tJRF0/LmpvYiAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgdGhpcy5jb21iYXRhbnRzW0lEXT8uam9iICE9PSAnTk9ORScgJiZcclxuICAgICAgICBJRC5zdGFydHNXaXRoKCcxJykpIHtcclxuICAgICAgICB0aGlzLnBhcnR5TWVtYmVycy5wdXNoKElEKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSBpZiAocGV0TmFtZXMuaW5jbHVkZXModGhpcy5jb21iYXRhbnRzW0lEXT8ubmFtZSA/PyAnJykpIHtcclxuICAgICAgICB0aGlzLnBldHMucHVzaChJRCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9IGVsc2UgaWYgKChldmVudFRyYWNrZXJbSURdID8/IDApID4gMCkge1xyXG4gICAgICAgIHRoaXMuZW5lbWllcy5wdXNoKElEKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBNYWluIGNvbWJhdGFudCBpcyB0aGUgb25lIHRoYXQgdG9vayB0aGUgbW9zdCBhY3Rpb25zXHJcbiAgICB0aGlzLm1haW5Db21iYXRhbnRJRCA9IHRoaXMuZW5lbWllcy5zb3J0KChsLCByKSA9PiB7XHJcbiAgICAgIHJldHVybiAoZXZlbnRUcmFja2VyW3JdID8/IDApIC0gKGV2ZW50VHJhY2tlcltsXSA/PyAwKTtcclxuICAgIH0pWzBdO1xyXG4gIH1cclxuXHJcbiAgYWRkQ29tYmF0YW50RnJvbUxpbmUobGluZTogTGluZUV2ZW50U291cmNlKTogdm9pZCB7XHJcbiAgICBjb25zdCBjb21iYXRhbnQgPSB0aGlzLmluaXRDb21iYXRhbnQobGluZS5pZCwgbGluZS5uYW1lKTtcclxuICAgIGNvbnN0IGluaXRTdGF0ZSA9IHRoaXMuaW5pdGlhbFN0YXRlc1tsaW5lLmlkXSA/PyB7fTtcclxuXHJcbiAgICBjb25zdCBleHRyYWN0ZWRTdGF0ZSA9IHRoaXMuZXh0cmFjdFN0YXRlRnJvbUxpbmUobGluZSkgPz8ge307XHJcblxyXG4gICAgaW5pdFN0YXRlLnBvc1ggPSBpbml0U3RhdGUucG9zWCA/PyBleHRyYWN0ZWRTdGF0ZS5wb3NYO1xyXG4gICAgaW5pdFN0YXRlLnBvc1kgPSBpbml0U3RhdGUucG9zWSA/PyBleHRyYWN0ZWRTdGF0ZS5wb3NZO1xyXG4gICAgaW5pdFN0YXRlLnBvc1ogPSBpbml0U3RhdGUucG9zWiA/PyBleHRyYWN0ZWRTdGF0ZS5wb3NaO1xyXG4gICAgaW5pdFN0YXRlLmhlYWRpbmcgPSBpbml0U3RhdGUuaGVhZGluZyA/PyBleHRyYWN0ZWRTdGF0ZS5oZWFkaW5nO1xyXG4gICAgaW5pdFN0YXRlLnRhcmdldGFibGUgPSBpbml0U3RhdGUudGFyZ2V0YWJsZSA/PyBleHRyYWN0ZWRTdGF0ZS50YXJnZXRhYmxlO1xyXG4gICAgaW5pdFN0YXRlLmhwID0gaW5pdFN0YXRlLmhwID8/IGV4dHJhY3RlZFN0YXRlLmhwO1xyXG4gICAgaW5pdFN0YXRlLm1heEhwID0gaW5pdFN0YXRlLm1heEhwID8/IGV4dHJhY3RlZFN0YXRlLm1heEhwO1xyXG4gICAgaW5pdFN0YXRlLm1wID0gaW5pdFN0YXRlLm1wID8/IGV4dHJhY3RlZFN0YXRlLm1wO1xyXG4gICAgaW5pdFN0YXRlLm1heE1wID0gaW5pdFN0YXRlLm1heE1wID8/IGV4dHJhY3RlZFN0YXRlLm1heE1wO1xyXG5cclxuICAgIGlmIChpc0xpbmVFdmVudEpvYkxldmVsKGxpbmUpKSB7XHJcbiAgICAgIGNvbWJhdGFudC5qb2IgPSB0aGlzLmNvbWJhdGFudHNbbGluZS5pZF0/LmpvYiA/PyBsaW5lLmpvYjtcclxuICAgICAgY29tYmF0YW50LmxldmVsID0gdGhpcy5jb21iYXRhbnRzW2xpbmUuaWRdPy5sZXZlbCA/PyBsaW5lLmxldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc0xpbmVFdmVudEFiaWxpdHkobGluZSkpIHtcclxuICAgICAgaWYgKCFjb21iYXRhbnQuam9iICYmICFsaW5lLmlkLnN0YXJ0c1dpdGgoJzQnKSAmJiBsaW5lLmFiaWxpdHlJZCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIGNvbWJhdGFudC5qb2IgPSBDb21iYXRhbnRKb2JTZWFyY2guZ2V0Sm9iKGxpbmUuYWJpbGl0eUlkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZENvbWJhdGFudEZyb21UYXJnZXRMaW5lKGxpbmU6IExpbmVFdmVudFRhcmdldCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbml0Q29tYmF0YW50KGxpbmUudGFyZ2V0SWQsIGxpbmUudGFyZ2V0TmFtZSk7XHJcbiAgICBjb25zdCBpbml0U3RhdGUgPSB0aGlzLmluaXRpYWxTdGF0ZXNbbGluZS50YXJnZXRJZF0gPz8ge307XHJcblxyXG4gICAgY29uc3QgZXh0cmFjdGVkU3RhdGUgPSB0aGlzLmV4dHJhY3RTdGF0ZUZyb21UYXJnZXRMaW5lKGxpbmUpID8/IHt9O1xyXG5cclxuICAgIGluaXRTdGF0ZS5wb3NYID0gaW5pdFN0YXRlLnBvc1ggPz8gZXh0cmFjdGVkU3RhdGUucG9zWDtcclxuICAgIGluaXRTdGF0ZS5wb3NZID0gaW5pdFN0YXRlLnBvc1kgPz8gZXh0cmFjdGVkU3RhdGUucG9zWTtcclxuICAgIGluaXRTdGF0ZS5wb3NaID0gaW5pdFN0YXRlLnBvc1ogPz8gZXh0cmFjdGVkU3RhdGUucG9zWjtcclxuICAgIGluaXRTdGF0ZS5oZWFkaW5nID0gaW5pdFN0YXRlLmhlYWRpbmcgPz8gZXh0cmFjdGVkU3RhdGUuaGVhZGluZztcclxuICAgIGluaXRTdGF0ZS5ocCA9IGluaXRTdGF0ZS5ocCA/PyBleHRyYWN0ZWRTdGF0ZS5ocDtcclxuICAgIGluaXRTdGF0ZS5tYXhIcCA9IGluaXRTdGF0ZS5tYXhIcCA/PyBleHRyYWN0ZWRTdGF0ZS5tYXhIcDtcclxuICAgIGluaXRTdGF0ZS5tcCA9IGluaXRTdGF0ZS5tcCA/PyBleHRyYWN0ZWRTdGF0ZS5tcDtcclxuICAgIGluaXRTdGF0ZS5tYXhNcCA9IGluaXRTdGF0ZS5tYXhNcCA/PyBleHRyYWN0ZWRTdGF0ZS5tYXhNcDtcclxuICB9XHJcblxyXG4gIGV4dHJhY3RTdGF0ZUZyb21MaW5lKGxpbmU6IExpbmVFdmVudFNvdXJjZSk6IFBhcnRpYWw8Q29tYmF0YW50U3RhdGU+IHtcclxuICAgIGNvbnN0IHN0YXRlOiBQYXJ0aWFsPENvbWJhdGFudFN0YXRlPiA9IHt9O1xyXG5cclxuICAgIGlmIChsaW5lLnggIT09IHVuZGVmaW5lZClcclxuICAgICAgc3RhdGUucG9zWCA9IGxpbmUueDtcclxuICAgIGlmIChsaW5lLnkgIT09IHVuZGVmaW5lZClcclxuICAgICAgc3RhdGUucG9zWSA9IGxpbmUueTtcclxuICAgIGlmIChsaW5lLnogIT09IHVuZGVmaW5lZClcclxuICAgICAgc3RhdGUucG9zWiA9IGxpbmUuejtcclxuICAgIGlmIChsaW5lLmhlYWRpbmcgIT09IHVuZGVmaW5lZClcclxuICAgICAgc3RhdGUuaGVhZGluZyA9IGxpbmUuaGVhZGluZztcclxuICAgIGlmIChsaW5lLnRhcmdldGFibGUgIT09IHVuZGVmaW5lZClcclxuICAgICAgc3RhdGUudGFyZ2V0YWJsZSA9IGxpbmUudGFyZ2V0YWJsZTtcclxuICAgIGlmIChsaW5lLmhwICE9PSB1bmRlZmluZWQpXHJcbiAgICAgIHN0YXRlLmhwID0gbGluZS5ocDtcclxuICAgIGlmIChsaW5lLm1heEhwICE9PSB1bmRlZmluZWQpXHJcbiAgICAgIHN0YXRlLm1heEhwID0gbGluZS5tYXhIcDtcclxuICAgIGlmIChsaW5lLm1wICE9PSB1bmRlZmluZWQpXHJcbiAgICAgIHN0YXRlLm1wID0gbGluZS5tcDtcclxuICAgIGlmIChsaW5lLm1heE1wICE9PSB1bmRlZmluZWQpXHJcbiAgICAgIHN0YXRlLm1heE1wID0gbGluZS5tYXhNcDtcclxuXHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG5cclxuICBleHRyYWN0U3RhdGVGcm9tVGFyZ2V0TGluZShsaW5lOiBMaW5lRXZlbnRUYXJnZXQpOiBQYXJ0aWFsPENvbWJhdGFudFN0YXRlPiB7XHJcbiAgICBjb25zdCBzdGF0ZTogUGFydGlhbDxDb21iYXRhbnRTdGF0ZT4gPSB7fTtcclxuXHJcbiAgICBpZiAobGluZS50YXJnZXRYICE9PSB1bmRlZmluZWQpXHJcbiAgICAgIHN0YXRlLnBvc1ggPSBsaW5lLnRhcmdldFg7XHJcbiAgICBpZiAobGluZS50YXJnZXRZICE9PSB1bmRlZmluZWQpXHJcbiAgICAgIHN0YXRlLnBvc1kgPSBsaW5lLnRhcmdldFk7XHJcbiAgICBpZiAobGluZS50YXJnZXRaICE9PSB1bmRlZmluZWQpXHJcbiAgICAgIHN0YXRlLnBvc1ogPSBsaW5lLnRhcmdldFo7XHJcbiAgICBpZiAobGluZS50YXJnZXRIZWFkaW5nICE9PSB1bmRlZmluZWQpXHJcbiAgICAgIHN0YXRlLmhlYWRpbmcgPSBsaW5lLnRhcmdldEhlYWRpbmc7XHJcbiAgICBpZiAobGluZS50YXJnZXRIcCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICBzdGF0ZS5ocCA9IGxpbmUudGFyZ2V0SHA7XHJcbiAgICBpZiAobGluZS50YXJnZXRNYXhIcCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICBzdGF0ZS5tYXhIcCA9IGxpbmUudGFyZ2V0TWF4SHA7XHJcbiAgICBpZiAobGluZS50YXJnZXRNcCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICBzdGF0ZS5tcCA9IGxpbmUudGFyZ2V0TXA7XHJcbiAgICBpZiAobGluZS50YXJnZXRNYXhNcCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICBzdGF0ZS5tYXhNcCA9IGxpbmUudGFyZ2V0TWF4TXA7XHJcblxyXG4gICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxuXHJcbiAgaW5pdENvbWJhdGFudChpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBDb21iYXRhbnQge1xyXG4gICAgbGV0IGNvbWJhdGFudCA9IHRoaXMuY29tYmF0YW50c1tpZF07XHJcbiAgICBpZiAoY29tYmF0YW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgY29tYmF0YW50ID0gdGhpcy5jb21iYXRhbnRzW2lkXSA9IG5ldyBDb21iYXRhbnQoaWQsIG5hbWUpO1xyXG4gICAgICB0aGlzLm90aGVycy5wdXNoKGlkKTtcclxuICAgICAgdGhpcy5pbml0aWFsU3RhdGVzW2lkXSA9IHtcclxuICAgICAgICB0YXJnZXRhYmxlOiB0cnVlLFxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIGlmIChjb21iYXRhbnQubmFtZSA9PT0gJycpIHtcclxuICAgICAgY29tYmF0YW50LnNldE5hbWUobmFtZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29tYmF0YW50O1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFpbkNvbWJhdGFudE5hbWUoKTogc3RyaW5nIHtcclxuICAgIGlmICh0aGlzLm1haW5Db21iYXRhbnRJRClcclxuICAgICAgcmV0dXJuIHRoaXMuY29tYmF0YW50c1t0aGlzLm1haW5Db21iYXRhbnRJRF0/Lm5hbWUgPz8gJ1Vua25vd24nO1xyXG4gICAgcmV0dXJuICdVbmtub3duJztcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IHR5cGUgQ29tYmF0YW50ID0ge1xyXG4gIG5hbWU/OiBzdHJpbmc7XHJcbiAgam9iPzogc3RyaW5nO1xyXG4gIHNwYXduOiBudW1iZXI7XHJcbiAgZGVzcGF3bjogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dSZXBvc2l0b3J5IHtcclxuICBDb21iYXRhbnRzOiB7IFtpZDogc3RyaW5nXTogQ29tYmF0YW50IH0gPSB7fTtcclxuICBmaXJzdFRpbWVzdGFtcCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG5cclxuICB1cGRhdGVUaW1lc3RhbXAodGltZXN0YW1wOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuZmlyc3RUaW1lc3RhbXAgPSBNYXRoLm1pbih0aGlzLmZpcnN0VGltZXN0YW1wLCB0aW1lc3RhbXApO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQ29tYmF0YW50KGlkOiBzdHJpbmcsIGM6IENvbWJhdGFudCk6IHZvaWQge1xyXG4gICAgaWQgPSBpZC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgaWYgKGlkICYmIGlkLmxlbmd0aCkge1xyXG4gICAgICBsZXQgY29tYmF0YW50ID0gdGhpcy5Db21iYXRhbnRzW2lkXTtcclxuICAgICAgaWYgKGNvbWJhdGFudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29tYmF0YW50ID0ge1xyXG4gICAgICAgICAgbmFtZTogYy5uYW1lLFxyXG4gICAgICAgICAgam9iOiBjLmpvYixcclxuICAgICAgICAgIHNwYXduOiBjLnNwYXduLFxyXG4gICAgICAgICAgZGVzcGF3bjogYy5kZXNwYXduLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5Db21iYXRhbnRzW2lkXSA9IGNvbWJhdGFudDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb21iYXRhbnQubmFtZSA9IGMubmFtZSB8fCBjb21iYXRhbnQubmFtZTtcclxuICAgICAgICBjb21iYXRhbnQuam9iID0gYy5qb2IgfHwgY29tYmF0YW50LmpvYjtcclxuICAgICAgICBjb21iYXRhbnQuc3Bhd24gPSBNYXRoLm1pbihjb21iYXRhbnQuc3Bhd24sIGMuc3Bhd24pO1xyXG4gICAgICAgIGNvbWJhdGFudC5kZXNwYXduID0gTWF0aC5tYXgoY29tYmF0YW50LmRlc3Bhd24sIGMuZGVzcGF3bik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlc29sdmVOYW1lKFxyXG4gICAgICBpZDogc3RyaW5nLFxyXG4gICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAgIGZhbGxiYWNrSWQ6IHN0cmluZyB8IG51bGwgPSBudWxsLFxyXG4gICAgICBmYWxsYmFja05hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsKTogc3RyaW5nIHtcclxuICAgIGxldCByZXQgPSBuYW1lO1xyXG5cclxuICAgIGlmIChmYWxsYmFja0lkICE9PSBudWxsKSB7XHJcbiAgICAgIGlmIChpZCA9PT0gJ0UwMDAwMDAwJyAmJiByZXQgPT09ICcnKSB7XHJcbiAgICAgICAgaWYgKGZhbGxiYWNrSWQuc3RhcnRzV2l0aCgnNCcpKVxyXG4gICAgICAgICAgcmV0ID0gZmFsbGJhY2tOYW1lID8/ICcnO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHJldCA9ICdVbmtub3duJztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZXQgPT09ICcnKVxyXG4gICAgICByZXQgPSB0aGlzLkNvbWJhdGFudHNbaWRdPy5uYW1lID8/ICcnO1xyXG5cclxuICAgIHJldHVybiByZXQ7XHJcbiAgfVxyXG59XHJcbiIsIi8vIEV2ZW50QnVzIGJ5IGRlZmluaXRpb24gcmVxdWlyZXMgZ2VuZXJpYyBwYXJhbWV0ZXJzLlxyXG4vLyBNYXAgb3VyIHN0YW5kLWluIGdlbmVyaWNzIHRvIGFjdHVhbCBnZW5lcmljcyBoZXJlLlxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10eXBlc1xyXG50eXBlIFNjb3BlID0gb2JqZWN0O1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG50eXBlIFBhcmFtID0gYW55O1xyXG5cclxudHlwZSBDYWxsYmFja0Z1bmN0aW9uID0gKC4uLmFyZ3M6IFBhcmFtKSA9PiB2b2lkO1xyXG50eXBlIEV2ZW50TWFwRW50cnkgPSB7XHJcbiAgZXZlbnQ6IHN0cmluZztcclxuICBzY29wZTogU2NvcGU7XHJcbiAgY2FsbGJhY2s6IENhbGxiYWNrRnVuY3Rpb247XHJcbn07XHJcbnR5cGUgRXZlbnRNYXAgPSB7IFtldmVudDogc3RyaW5nXTogRXZlbnRNYXBFbnRyeVtdIH07XHJcblxyXG4vKipcclxuICogVGhpcyBpcyBhIGJhc2UgY2xhc3MgdGhhdCBjbGFzc2VzIGNhbiBleHRlbmQgdG8gaW5oZXJpdCBldmVudCBidXMgY2FwYWJpbGl0aWVzLlxyXG4gKiBUaGlzIGFsbG93cyBvdGhlciBjbGFzc2VzIHRvIGxpc3RlbiBmb3IgZXZlbnRzIHdpdGggdGhlIGBvbmAgZnVuY3Rpb24uXHJcbiAqIFRoZSBpbmhlcml0aW5nIGNsYXNzIGNhbiBmaXJlIHRob3NlIGV2ZW50cyB3aXRoIHRoZSBgZGlzcGF0Y2hgIGZ1bmN0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRCdXMge1xyXG4gIHByaXZhdGUgbGlzdGVuZXJzOiBFdmVudE1hcCA9IHt9O1xyXG4gIC8qKlxyXG4gICAqIFN1YnNjcmliZSB0byBhbiBldmVudFxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudChzKSB0byBzdWJzY3JpYmUgdG8sIHNwYWNlIHNlcGFyYXRlZFxyXG4gICAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gaW52b2tlXHJcbiAgICogQHBhcmFtIHNjb3BlIE9wdGlvbmFsLiBUaGUgc2NvcGUgdG8gYXBwbHkgdGhlIGZ1bmN0aW9uIGFnYWluc3RcclxuICAgKiBAcmV0dXJucyBUaGUgY2FsbGJhY2tzIHJlZ2lzdGVyZWQgdG8gdGhlIGV2ZW50KHMpXHJcbiAgICovXHJcbiAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s/OiBDYWxsYmFja0Z1bmN0aW9uLCBzY29wZT86IFNjb3BlKTogRXZlbnRNYXBFbnRyeVtdIHtcclxuICAgIGNvbnN0IGV2ZW50cyA9IGV2ZW50LnNwbGl0KCcgJyk7XHJcbiAgICBjb25zdCByZXQ6IEV2ZW50TWFwRW50cnlbXSA9IFtdO1xyXG4gICAgc2NvcGUgPSBzY29wZSA/PyAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB7fSA6IHdpbmRvdyk7XHJcbiAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xyXG4gICAgICBjb25zdCBldmVudHM6IEV2ZW50TWFwRW50cnlbXSA9IHRoaXMubGlzdGVuZXJzW2V2ZW50XSA/Pz0gW107XHJcbiAgICAgIGlmIChjYWxsYmFjayAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIGV2ZW50cy5wdXNoKHsgZXZlbnQ6IGV2ZW50LCBzY29wZTogc2NvcGUsIGNhbGxiYWNrOiBjYWxsYmFjayB9KTtcclxuICAgICAgcmV0LnB1c2goLi4uKHRoaXMubGlzdGVuZXJzW2V2ZW50XSA/PyBbXSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERpc3BhdGNoIGFuIGV2ZW50IHRvIGFueSBzdWJzY3JpYmVyc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBkaXNwYXRjaFxyXG4gICAqIEBwYXJhbSBldmVudEFyZ3VtZW50cyBUaGUgZXZlbnQgYXJndW1lbnRzIHRvIHBhc3MgdG8gbGlzdGVuZXJzXHJcbiAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgY2FuIGJlIGF3YWl0J2Qgb3IgaWdub3JlZFxyXG4gICAqL1xyXG4gIGFzeW5jIGRpc3BhdGNoKGV2ZW50OiBzdHJpbmcsIC4uLmV2ZW50QXJndW1lbnRzOiBQYXJhbSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKHRoaXMubGlzdGVuZXJzW2V2ZW50XSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgZm9yIChjb25zdCBsIG9mIHRoaXMubGlzdGVuZXJzW2V2ZW50XSA/PyBbXSkge1xyXG4gICAgICBjb25zdCByZXMgPSBsLmNhbGxiYWNrLmFwcGx5KGwuc2NvcGUsIGV2ZW50QXJndW1lbnRzKTtcclxuICAgICAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKHJlcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBMaW5lRXZlbnQgZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxuY29uc3QgZmllbGRzID0ge1xyXG4gIHR5cGU6IDIsXHJcbiAgc3BlYWtlcjogMyxcclxufSBhcyBjb25zdDtcclxuXHJcbi8vIENoYXQgZXZlbnRcclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDB4MDAgZXh0ZW5kcyBMaW5lRXZlbnQge1xyXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHNwZWFrZXI6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgbWVzc2FnZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZXBvOiBMb2dSZXBvc2l0b3J5LCBsaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgc3VwZXIocmVwbywgbGluZSwgcGFydHMpO1xyXG5cclxuICAgIHRoaXMudHlwZSA9IHBhcnRzW2ZpZWxkcy50eXBlXSA/PyAnJztcclxuICAgIHRoaXMuc3BlYWtlciA9IHBhcnRzW2ZpZWxkcy5zcGVha2VyXSA/PyAnJztcclxuICAgIHRoaXMubWVzc2FnZSA9IHBhcnRzLnNsaWNlKDQsIC0xKS5qb2luKCd8Jyk7XHJcblxyXG4gICAgLy8gVGhlIGV4YWN0IHJlYXNvbiBmb3IgdGhpcyBjaGVjayBpc24ndCBjbGVhciBhbnltb3JlIGJ1dCBtYXkgYmUgcmVsYXRlZCB0b1xyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3JhdmFobi9GRlhJVl9BQ1RfUGx1Z2luL2lzc3Vlcy8yNTBcclxuICAgIGlmICh0aGlzLm1lc3NhZ2Uuc3BsaXQoJ1xcdTAwMWZcXHUwMDFmJykubGVuZ3RoID4gMSlcclxuICAgICAgdGhpcy5pbnZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmNvbnZlcnRlZExpbmUgPVxyXG4gICAgICB0aGlzLnByZWZpeCgpICsgdGhpcy50eXBlICsgJzonICtcclxuICAgICAgICAvLyBJZiBzcGVha2VyIGlzIGJsYW5rLCBpdCdzIGV4Y2x1ZGVkIGZyb20gdGhlIGNvbnZlcnRlZCBsaW5lXHJcbiAgICAgICAgKHRoaXMuc3BlYWtlciAhPT0gJycgPyB0aGlzLnNwZWFrZXIgKyAnOicgOiAnJykgK1xyXG4gICAgICAgIHRoaXMubWVzc2FnZS50cmltKCk7XHJcbiAgICB0aGlzLmNvbnZlcnRlZExpbmUgPSBMaW5lRXZlbnQwMC5yZXBsYWNlQ2hhdFN5bWJvbHModGhpcy5jb252ZXJ0ZWRMaW5lKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXBsYWNlQ2hhdFN5bWJvbHMobGluZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGZvciAoY29uc3QgcmVwIG9mIExpbmVFdmVudDAwLmNoYXRTeW1ib2xSZXBsYWNlbWVudHMpXHJcbiAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UocmVwLlNlYXJjaCwgcmVwLlJlcGxhY2UpO1xyXG5cclxuICAgIHJldHVybiBsaW5lO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNoYXRTeW1ib2xSZXBsYWNlbWVudHMgPSBbXHJcbiAgICB7XHJcbiAgICAgIFNlYXJjaDogLzpcXHVFMDZGL2csXHJcbiAgICAgIFJlcGxhY2U6ICc64oeSJyxcclxuICAgICAgVHlwZTogJ1N5bWJvbCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBTZWFyY2g6IC8gXFx1RTBCQlxcdUUwNUMvZyxcclxuICAgICAgUmVwbGFjZTogJyAnLFxyXG4gICAgICBUeXBlOiAnUG9zaXRpdmUgRWZmZWN0JyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFNlYXJjaDogLyBcXHVFMEJCXFx1RTA1Qi9nLFxyXG4gICAgICBSZXBsYWNlOiAnICcsXHJcbiAgICAgIFR5cGU6ICdOZWdhdGl2ZSBFZmZlY3QnLFxyXG4gICAgfSxcclxuICBdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MDAgZXh0ZW5kcyBMaW5lRXZlbnQweDAwIHt9XHJcbiIsImltcG9ydCBMaW5lRXZlbnQgZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgRW11bGF0b3JDb21tb24gZnJvbSAnLi4vLi4vRW11bGF0b3JDb21tb24nO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxuY29uc3QgZmllbGRzID0ge1xyXG4gIHpvbmVJZDogMixcclxuICB6b25lTmFtZTogMyxcclxufSBhcyBjb25zdDtcclxuXHJcbi8vIFpvbmUgY2hhbmdlIGV2ZW50XHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQweDAxIGV4dGVuZHMgTGluZUV2ZW50IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgcHJvcGVyQ2FzZUNvbnZlcnRlZExpbmU6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IHpvbmVJZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSB6b25lTmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSB6b25lTmFtZVByb3BlckNhc2U6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocmVwbzogTG9nUmVwb3NpdG9yeSwgbmV0d29ya0xpbmU6IHN0cmluZywgcGFydHM6IHN0cmluZ1tdKSB7XHJcbiAgICBzdXBlcihyZXBvLCBuZXR3b3JrTGluZSwgcGFydHMpO1xyXG5cclxuICAgIHRoaXMuem9uZUlkID0gcGFydHNbZmllbGRzLnpvbmVJZF0gPz8gJyc7XHJcbiAgICB0aGlzLnpvbmVOYW1lID0gcGFydHNbZmllbGRzLnpvbmVOYW1lXSA/PyAnJztcclxuICAgIHRoaXMuem9uZU5hbWVQcm9wZXJDYXNlID0gRW11bGF0b3JDb21tb24ucHJvcGVyQ2FzZSh0aGlzLnpvbmVOYW1lKTtcclxuXHJcbiAgICB0aGlzLmNvbnZlcnRlZExpbmUgPSB0aGlzLnByZWZpeCgpICtcclxuICAgICAgJ0NoYW5nZWQgWm9uZSB0byAnICsgdGhpcy56b25lTmFtZSArICcuJztcclxuICAgIHRoaXMucHJvcGVyQ2FzZUNvbnZlcnRlZExpbmUgPSB0aGlzLnByZWZpeCgpICtcclxuICAgICAgJ0NoYW5nZWQgWm9uZSB0byAnICsgdGhpcy56b25lTmFtZVByb3BlckNhc2UgKyAnLic7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MDEgZXh0ZW5kcyBMaW5lRXZlbnQweDAxIHt9XHJcbiIsImltcG9ydCBMaW5lRXZlbnQgZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxuY29uc3QgZmllbGRzID0ge1xyXG4gIGlkOiAyLFxyXG4gIG5hbWU6IDMsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBQbGF5ZXIgY2hhbmdlIGV2ZW50XHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQweDAyIGV4dGVuZHMgTGluZUV2ZW50IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgaWQ6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZXBvOiBMb2dSZXBvc2l0b3J5LCBsaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgc3VwZXIocmVwbywgbGluZSwgcGFydHMpO1xyXG5cclxuICAgIHRoaXMuaWQgPSBwYXJ0c1tmaWVsZHMuaWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnO1xyXG4gICAgdGhpcy5uYW1lID0gcGFydHNbZmllbGRzLm5hbWVdID8/ICcnO1xyXG5cclxuICAgIHRoaXMuY29udmVydGVkTGluZSA9IHRoaXMucHJlZml4KCkgKyAnQ2hhbmdlZCBwcmltYXJ5IHBsYXllciB0byAnICsgdGhpcy5uYW1lICsgJy4nO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDAyIGV4dGVuZHMgTGluZUV2ZW50MHgwMiB7fVxyXG4iLCJpbXBvcnQgeyBKb2IsIFJvbGUgfSBmcm9tICcuLi90eXBlcy9qb2InO1xyXG5cclxuLy8gVE9ETzogaXQnZCBiZSBuaWNlIHRvIG5vdCByZXBlYXQgam9iIG5hbWVzLCBidXQgYXQgbGVhc3QgUmVjb3JkIGVuZm9yY2VzIHRoYXQgYWxsIGFyZSBzZXQuXHJcbmNvbnN0IG5hbWVUb0pvYkVudW06IFJlY29yZDxKb2IsIG51bWJlcj4gPSB7XHJcbiAgTk9ORTogMCxcclxuICBHTEE6IDEsXHJcbiAgUEdMOiAyLFxyXG4gIE1SRDogMyxcclxuICBMTkM6IDQsXHJcbiAgQVJDOiA1LFxyXG4gIENOSjogNixcclxuICBUSE06IDcsXHJcbiAgQ1JQOiA4LFxyXG4gIEJTTTogOSxcclxuICBBUk06IDEwLFxyXG4gIEdTTTogMTEsXHJcbiAgTFRXOiAxMixcclxuICBXVlI6IDEzLFxyXG4gIEFMQzogMTQsXHJcbiAgQ1VMOiAxNSxcclxuICBNSU46IDE2LFxyXG4gIEJUTjogMTcsXHJcbiAgRlNIOiAxOCxcclxuICBQTEQ6IDE5LFxyXG4gIE1OSzogMjAsXHJcbiAgV0FSOiAyMSxcclxuICBEUkc6IDIyLFxyXG4gIEJSRDogMjMsXHJcbiAgV0hNOiAyNCxcclxuICBCTE06IDI1LFxyXG4gIEFDTjogMjYsXHJcbiAgU01OOiAyNyxcclxuICBTQ0g6IDI4LFxyXG4gIFJPRzogMjksXHJcbiAgTklOOiAzMCxcclxuICBNQ0g6IDMxLFxyXG4gIERSSzogMzIsXHJcbiAgQVNUOiAzMyxcclxuICBTQU06IDM0LFxyXG4gIFJETTogMzUsXHJcbiAgQkxVOiAzNixcclxuICBHTkI6IDM3LFxyXG4gIEROQzogMzgsXHJcbn07XHJcblxyXG5jb25zdCBhbGxKb2JzID0gT2JqZWN0LmtleXMobmFtZVRvSm9iRW51bSkgYXMgSm9iW107XHJcbmNvbnN0IGFsbFJvbGVzID0gWyd0YW5rJywgJ2hlYWxlcicsICdkcHMnLCAnY3JhZnRlcicsICdnYXRoZXJlcicsICdub25lJ10gYXMgUm9sZVtdO1xyXG5cclxuY29uc3QgdGFua0pvYnM6IEpvYltdID0gWydHTEEnLCAnUExEJywgJ01SRCcsICdXQVInLCAnRFJLJywgJ0dOQiddO1xyXG5jb25zdCBoZWFsZXJKb2JzOiBKb2JbXSA9IFsnQ05KJywgJ1dITScsICdTQ0gnLCAnQVNUJ107XHJcbmNvbnN0IG1lbGVlRHBzSm9iczogSm9iW10gPSBbJ1BHTCcsICdNTksnLCAnTE5DJywgJ0RSRycsICdST0cnLCAnTklOJywgJ1NBTSddO1xyXG5jb25zdCByYW5nZWREcHNKb2JzOiBKb2JbXSA9IFsnQVJDJywgJ0JSRCcsICdETkMnLCAnTUNIJ107XHJcbmNvbnN0IGNhc3RlckRwc0pvYnM6IEpvYltdID0gWydCTFUnLCAnUkRNJywgJ0JMTScsICdTTU4nLCAnQUNOJywgJ1RITSddO1xyXG5jb25zdCBkcHNKb2JzOiBKb2JbXSA9IFsuLi5tZWxlZURwc0pvYnMsIC4uLnJhbmdlZERwc0pvYnMsIC4uLmNhc3RlckRwc0pvYnNdO1xyXG5jb25zdCBjcmFmdGluZ0pvYnM6IEpvYltdID0gWydDUlAnLCAnQlNNJywgJ0FSTScsICdHU00nLCAnTFRXJywgJ1dWUicsICdBTEMnLCAnQ1VMJ107XHJcbmNvbnN0IGdhdGhlcmluZ0pvYnM6IEpvYltdID0gWydNSU4nLCAnQlROJywgJ0ZTSCddO1xyXG5cclxuY29uc3Qgc3R1bkpvYnM6IEpvYltdID0gWydCTFUnLCAuLi50YW5rSm9icywgLi4ubWVsZWVEcHNKb2JzXTtcclxuY29uc3Qgc2lsZW5jZUpvYnM6IEpvYltdID0gWydCTFUnLCAuLi50YW5rSm9icywgLi4ucmFuZ2VkRHBzSm9ic107XHJcbmNvbnN0IHNsZWVwSm9iczogSm9iW10gPSBbJ0JMTScsICdCTFUnLCAuLi5oZWFsZXJKb2JzXTtcclxuY29uc3QgZmVpbnRKb2JzOiBKb2JbXSA9IFsuLi5tZWxlZURwc0pvYnNdO1xyXG5jb25zdCBhZGRsZUpvYnM6IEpvYltdID0gWy4uLmNhc3RlckRwc0pvYnNdO1xyXG5jb25zdCBjbGVhbnNlSm9iczogSm9iW10gPSBbJ0JMVScsICdCUkQnLCAuLi5oZWFsZXJKb2JzXTtcclxuXHJcbmNvbnN0IGpvYlRvUm9sZU1hcDogTWFwPEpvYiwgUm9sZT4gPSAoKCkgPT4ge1xyXG4gIGNvbnN0IGFkZFRvTWFwID0gKG1hcDogTWFwPEpvYiwgUm9sZT4sIGpvYnM6IEpvYltdLCByb2xlOiBSb2xlKSA9PiB7XHJcbiAgICBqb2JzLmZvckVhY2goKGpvYikgPT4gbWFwLnNldChqb2IsIHJvbGUpKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBtYXA6IE1hcDxKb2IsIFJvbGU+ID0gbmV3IE1hcChbWydOT05FJywgJ25vbmUnXV0pO1xyXG4gIGFkZFRvTWFwKG1hcCwgdGFua0pvYnMsICd0YW5rJyk7XHJcbiAgYWRkVG9NYXAobWFwLCBoZWFsZXJKb2JzLCAnaGVhbGVyJyk7XHJcbiAgYWRkVG9NYXAobWFwLCBkcHNKb2JzLCAnZHBzJyk7XHJcbiAgYWRkVG9NYXAobWFwLCBjcmFmdGluZ0pvYnMsICdjcmFmdGVyJyk7XHJcbiAgYWRkVG9NYXAobWFwLCBnYXRoZXJpbmdKb2JzLCAnZ2F0aGVyZXInKTtcclxuXHJcbiAgcmV0dXJuIG1hcDtcclxufSkoKTtcclxuXHJcbmNvbnN0IFV0aWwgPSB7XHJcbiAgam9iRW51bVRvSm9iOiAoaWQ6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3Qgam9iID0gYWxsSm9icy5maW5kKChqb2I6IEpvYikgPT4gbmFtZVRvSm9iRW51bVtqb2JdID09PSBpZCk7XHJcbiAgICByZXR1cm4gam9iID8/ICdOT05FJztcclxuICB9LFxyXG4gIGpvYlRvSm9iRW51bTogKGpvYjogSm9iKSA9PiBuYW1lVG9Kb2JFbnVtW2pvYl0sXHJcbiAgam9iVG9Sb2xlOiAoam9iOiBKb2IpID0+IHtcclxuICAgIGNvbnN0IHJvbGUgPSBqb2JUb1JvbGVNYXAuZ2V0KGpvYik7XHJcbiAgICByZXR1cm4gcm9sZSA/PyAnbm9uZSc7XHJcbiAgfSxcclxuICBnZXRBbGxSb2xlczogKCk6IHJlYWRvbmx5IFJvbGVbXSA9PiBhbGxSb2xlcyxcclxuICBpc1RhbmtKb2I6IChqb2I6IEpvYikgPT4gdGFua0pvYnMuaW5jbHVkZXMoam9iKSxcclxuICBpc0hlYWxlckpvYjogKGpvYjogSm9iKSA9PiBoZWFsZXJKb2JzLmluY2x1ZGVzKGpvYiksXHJcbiAgaXNNZWxlZURwc0pvYjogKGpvYjogSm9iKSA9PiBtZWxlZURwc0pvYnMuaW5jbHVkZXMoam9iKSxcclxuICBpc1JhbmdlZERwc0pvYjogKGpvYjogSm9iKSA9PiByYW5nZWREcHNKb2JzLmluY2x1ZGVzKGpvYiksXHJcbiAgaXNDYXN0ZXJEcHNKb2I6IChqb2I6IEpvYikgPT4gY2FzdGVyRHBzSm9icy5pbmNsdWRlcyhqb2IpLFxyXG4gIGlzRHBzSm9iOiAoam9iOiBKb2IpID0+IGRwc0pvYnMuaW5jbHVkZXMoam9iKSxcclxuICBpc0NyYWZ0aW5nSm9iOiAoam9iOiBKb2IpID0+IGNyYWZ0aW5nSm9icy5pbmNsdWRlcyhqb2IpLFxyXG4gIGlzR2F0aGVyaW5nSm9iOiAoam9iOiBKb2IpID0+IGdhdGhlcmluZ0pvYnMuaW5jbHVkZXMoam9iKSxcclxuICBpc0NvbWJhdEpvYjogKGpvYjogSm9iKSA9PiB7XHJcbiAgICByZXR1cm4gIWNyYWZ0aW5nSm9icy5pbmNsdWRlcyhqb2IpICYmICFnYXRoZXJpbmdKb2JzLmluY2x1ZGVzKGpvYik7XHJcbiAgfSxcclxuICBjYW5TdHVuOiAoam9iOiBKb2IpID0+IHN0dW5Kb2JzLmluY2x1ZGVzKGpvYiksXHJcbiAgY2FuU2lsZW5jZTogKGpvYjogSm9iKSA9PiBzaWxlbmNlSm9icy5pbmNsdWRlcyhqb2IpLFxyXG4gIGNhblNsZWVwOiAoam9iOiBKb2IpID0+IHNsZWVwSm9icy5pbmNsdWRlcyhqb2IpLFxyXG4gIGNhbkNsZWFuc2U6IChqb2I6IEpvYikgPT4gY2xlYW5zZUpvYnMuaW5jbHVkZXMoam9iKSxcclxuICBjYW5GZWludDogKGpvYjogSm9iKSA9PiBmZWludEpvYnMuaW5jbHVkZXMoam9iKSxcclxuICBjYW5BZGRsZTogKGpvYjogSm9iKSA9PiBhZGRsZUpvYnMuaW5jbHVkZXMoam9iKSxcclxufSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFV0aWw7XHJcbiIsImltcG9ydCBMaW5lRXZlbnQsIHsgTGluZUV2ZW50Sm9iTGV2ZWwsIExpbmVFdmVudFNvdXJjZSB9IGZyb20gJy4vTGluZUV2ZW50JztcclxuaW1wb3J0IEVtdWxhdG9yQ29tbW9uIGZyb20gJy4uLy4uL0VtdWxhdG9yQ29tbW9uJztcclxuaW1wb3J0IFV0aWwgZnJvbSAnLi4vLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3V0aWwnO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5pbXBvcnQgeyBKb2IgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9qb2InO1xyXG5cclxuY29uc3QgZmllbGRzID0ge1xyXG4gIGlkOiAyLFxyXG4gIG5hbWU6IDMsXHJcbiAgam9iSWRIZXg6IDQsXHJcbiAgbGV2ZWxTdHJpbmc6IDUsXHJcbiAgb3duZXJJZDogNixcclxuICB3b3JsZElkOiA3LFxyXG4gIHdvcmxkTmFtZTogOCxcclxuICBucGNOYW1lSWQ6IDksXHJcbiAgbnBjQmFzZUlkOiAxMCxcclxuICBjdXJyZW50SHA6IDExLFxyXG4gIG1heEhwU3RyaW5nOiAxNCxcclxuICBjdXJyZW50TXA6IDEzLFxyXG4gIG1heE1wU3RyaW5nOiAxNCxcclxuICBjdXJyZW50VHA6IDE1LFxyXG4gIG1heFRwOiAxNixcclxuICB4U3RyaW5nOiAxNyxcclxuICB5U3RyaW5nOiAxOCxcclxuICB6U3RyaW5nOiAxOSxcclxuICBoZWFkaW5nOiAyMCxcclxufSBhcyBjb25zdDtcclxuXHJcbi8vIEFkZGVkIGNvbWJhdGFudCBldmVudFxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MHgwMyBleHRlbmRzIExpbmVFdmVudCBpbXBsZW1lbnRzIExpbmVFdmVudFNvdXJjZSwgTGluZUV2ZW50Sm9iTGV2ZWwge1xyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGpvYklkSGV4OiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGpvYklkOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IGpvYjogSm9iO1xyXG4gIHB1YmxpYyByZWFkb25seSBsZXZlbFN0cmluZzogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBsZXZlbDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBvd25lcklkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHdvcmxkSWQ6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgd29ybGROYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IG5wY05hbWVJZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBucGNCYXNlSWQ6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgaHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbWF4SHBTdHJpbmc6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgbWF4SHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbXA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbWF4TXBTdHJpbmc6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgbWF4TXA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgdHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbWF4VHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgeFN0cmluZzogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSB4OiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHlTdHJpbmc6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgeTogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSB6U3RyaW5nOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHo6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgaGVhZGluZzogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBpc1NvdXJjZSA9IHRydWU7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlzSm9iTGV2ZWwgPSB0cnVlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZXBvOiBMb2dSZXBvc2l0b3J5LCBsaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgc3VwZXIocmVwbywgbGluZSwgcGFydHMpO1xyXG5cclxuICAgIHRoaXMuaWQgPSBwYXJ0c1tmaWVsZHMuaWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnO1xyXG4gICAgdGhpcy5uYW1lID0gcGFydHNbZmllbGRzLm5hbWVdID8/ICcnO1xyXG4gICAgdGhpcy5qb2JJZEhleCA9IHBhcnRzW2ZpZWxkcy5qb2JJZEhleF0/LnRvVXBwZXJDYXNlKCkgPz8gJyc7XHJcbiAgICB0aGlzLmpvYklkID0gcGFyc2VJbnQodGhpcy5qb2JJZEhleCwgMTYpO1xyXG4gICAgdGhpcy5qb2IgPSBVdGlsLmpvYkVudW1Ub0pvYih0aGlzLmpvYklkKTtcclxuICAgIHRoaXMubGV2ZWxTdHJpbmcgPSBwYXJ0c1tmaWVsZHMubGV2ZWxTdHJpbmddID8/ICcnO1xyXG4gICAgdGhpcy5sZXZlbCA9IHBhcnNlRmxvYXQodGhpcy5sZXZlbFN0cmluZyk7XHJcbiAgICB0aGlzLm93bmVySWQgPSBwYXJ0c1tmaWVsZHMub3duZXJJZF0/LnRvVXBwZXJDYXNlKCkgPz8gJyc7XHJcbiAgICB0aGlzLndvcmxkSWQgPSBwYXJ0c1tmaWVsZHMud29ybGRJZF0gPz8gJyc7XHJcbiAgICB0aGlzLndvcmxkTmFtZSA9IHBhcnRzW2ZpZWxkcy53b3JsZE5hbWVdID8/ICcnO1xyXG4gICAgdGhpcy5ucGNOYW1lSWQgPSBwYXJ0c1tmaWVsZHMubnBjTmFtZUlkXSA/PyAnJztcclxuICAgIHRoaXMubnBjQmFzZUlkID0gcGFydHNbZmllbGRzLm5wY0Jhc2VJZF0gPz8gJyc7XHJcbiAgICB0aGlzLmhwID0gcGFyc2VGbG9hdChwYXJ0c1tmaWVsZHMuY3VycmVudEhwXSA/PyAnJyk7XHJcbiAgICB0aGlzLm1heEhwU3RyaW5nID0gcGFydHNbZmllbGRzLm1heEhwU3RyaW5nXSA/PyAnJztcclxuICAgIHRoaXMubWF4SHAgPSBwYXJzZUZsb2F0KHRoaXMubWF4SHBTdHJpbmcpO1xyXG4gICAgdGhpcy5tcCA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLmN1cnJlbnRNcF0gPz8gJycpO1xyXG4gICAgdGhpcy5tYXhNcFN0cmluZyA9IHBhcnRzW2ZpZWxkcy5tYXhNcFN0cmluZ10gPz8gJyc7XHJcbiAgICB0aGlzLm1heE1wID0gcGFyc2VGbG9hdCh0aGlzLm1heE1wU3RyaW5nKTtcclxuICAgIHRoaXMudHAgPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy5jdXJyZW50VHBdID8/ICcnKTtcclxuICAgIHRoaXMubWF4VHAgPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy5tYXhUcF0gPz8gJycpO1xyXG4gICAgdGhpcy54U3RyaW5nID0gcGFydHNbZmllbGRzLnhTdHJpbmddID8/ICcnO1xyXG4gICAgdGhpcy54ID0gcGFyc2VGbG9hdCh0aGlzLnhTdHJpbmcpO1xyXG4gICAgdGhpcy55U3RyaW5nID0gcGFydHNbZmllbGRzLnlTdHJpbmddID8/ICcnO1xyXG4gICAgdGhpcy55ID0gcGFyc2VGbG9hdCh0aGlzLnlTdHJpbmcpO1xyXG4gICAgdGhpcy56U3RyaW5nID0gcGFydHNbZmllbGRzLnpTdHJpbmddID8/ICcnO1xyXG4gICAgdGhpcy56ID0gcGFyc2VGbG9hdCh0aGlzLnpTdHJpbmcpO1xyXG4gICAgdGhpcy5oZWFkaW5nID0gcGFyc2VGbG9hdChwYXJ0c1tmaWVsZHMuaGVhZGluZ10gPz8gJycpO1xyXG5cclxuICAgIHJlcG8udXBkYXRlQ29tYmF0YW50KHRoaXMuaWQsIHtcclxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxyXG4gICAgICBzcGF3bjogdGhpcy50aW1lc3RhbXAsXHJcbiAgICAgIGRlc3Bhd246IHRoaXMudGltZXN0YW1wLFxyXG4gICAgICBqb2I6IHRoaXMuam9iSWRIZXgsXHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgY29tYmF0YW50TmFtZSA9IHRoaXMubmFtZTtcclxuICAgIGlmICh0aGlzLndvcmxkTmFtZSAhPT0gJycpXHJcbiAgICAgIGNvbWJhdGFudE5hbWUgPSBjb21iYXRhbnROYW1lICsgJygnICsgdGhpcy53b3JsZE5hbWUgKyAnKSc7XHJcblxyXG4gICAgdGhpcy5jb252ZXJ0ZWRMaW5lID0gdGhpcy5wcmVmaXgoKSArIHRoaXMuaWQudG9VcHBlckNhc2UoKSArXHJcbiAgICAgICc6QWRkZWQgbmV3IGNvbWJhdGFudCAnICsgY29tYmF0YW50TmFtZSArXHJcbiAgICAgICcuICBKb2I6ICcgKyB0aGlzLmpvYiArXHJcbiAgICAgICcgTGV2ZWw6ICcgKyB0aGlzLmxldmVsU3RyaW5nICtcclxuICAgICAgJyBNYXggSFA6ICcgKyB0aGlzLm1heEhwU3RyaW5nICtcclxuICAgICAgJyBNYXggTVA6ICcgKyB0aGlzLm1heE1wU3RyaW5nICtcclxuICAgICAgJyBQb3M6ICgnICsgdGhpcy54U3RyaW5nICsgJywnICsgdGhpcy55U3RyaW5nICsgJywnICsgdGhpcy56U3RyaW5nICsgJyknO1xyXG5cclxuICAgIC8vIFRoaXMgbGFzdCBwYXJ0IGlzIGd1ZXNzd29yayBmb3IgdGhlIGFyZWEgYmV0d2VlbiA5IGFuZCAxMC5cclxuICAgIGNvbnN0IHVua25vd25WYWx1ZSA9IHRoaXMubnBjTmFtZUlkICtcclxuICAgICAgRW11bGF0b3JDb21tb24uemVyb1BhZCh0aGlzLm5wY0Jhc2VJZCwgOCArIE1hdGgubWF4KDAsIDYgLSB0aGlzLm5wY05hbWVJZC5sZW5ndGgpKTtcclxuXHJcbiAgICBpZiAodW5rbm93blZhbHVlICE9PSAnMDAwMDAwMDAwMDAwMDAnKVxyXG4gICAgICB0aGlzLmNvbnZlcnRlZExpbmUgKz0gJyAoJyArIHVua25vd25WYWx1ZSArICcpJztcclxuXHJcbiAgICB0aGlzLmNvbnZlcnRlZExpbmUgKz0gJy4nO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDAzIGV4dGVuZHMgTGluZUV2ZW50MHgwMyB7IH1cclxuIiwiaW1wb3J0IHsgTGluZUV2ZW50MHgwMyB9IGZyb20gJy4vTGluZUV2ZW50MHgwMyc7XHJcbmltcG9ydCBMb2dSZXBvc2l0b3J5IGZyb20gJy4vTG9nUmVwb3NpdG9yeSc7XHJcblxyXG4vLyBSZW1vdmVkIGNvbWJhdGFudCBldmVudFxyXG4vLyBFeHRlbmQgdGhlIGFkZCBjb21iYXRhbnQgZXZlbnQgdG8gcmVkdWNlIGR1cGxpY2F0ZSBjb2RlIHNpbmNlIHRoZXkncmVcclxuLy8gdGhlIHNhbWUgZnJvbSBhIGRhdGEgcGVyc3BlY3RpdmVcclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDB4MDQgZXh0ZW5kcyBMaW5lRXZlbnQweDAzIHtcclxuICBjb25zdHJ1Y3RvcihyZXBvOiBMb2dSZXBvc2l0b3J5LCBsaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgc3VwZXIocmVwbywgbGluZSwgcGFydHMpO1xyXG5cclxuICAgIHRoaXMuY29udmVydGVkTGluZSA9IHRoaXMucHJlZml4KCkgKyB0aGlzLmlkLnRvVXBwZXJDYXNlKCkgK1xyXG4gICAgICAnOlJlbW92aW5nIGNvbWJhdGFudCAnICsgdGhpcy5uYW1lICtcclxuICAgICAgJy4gTWF4IE1QOiAnICsgdGhpcy5tYXhNcFN0cmluZyArXHJcbiAgICAgICcuIFBvczogKCcgKyB0aGlzLnhTdHJpbmcgKyAnLCcgKyB0aGlzLnlTdHJpbmcgKyAnLCcgKyB0aGlzLnpTdHJpbmcgKyAnKSc7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MDQgZXh0ZW5kcyBMaW5lRXZlbnQweDA0IHsgfVxyXG4iLCJpbXBvcnQgTGluZUV2ZW50IGZyb20gJy4vTGluZUV2ZW50JztcclxuaW1wb3J0IExvZ1JlcG9zaXRvcnkgZnJvbSAnLi9Mb2dSZXBvc2l0b3J5JztcclxuXHJcbmNvbnN0IGZpZWxkcyA9IHtcclxuICBjbGFzczogMixcclxuICBzdHJlbmd0aDogMyxcclxuICBkZXh0ZXJpdHk6IDQsXHJcbiAgdml0YWxpdHk6IDUsXHJcbiAgaW50ZWxsaWdlbmNlOiA2LFxyXG4gIG1pbmQ6IDcsXHJcbiAgcGlldHk6IDgsXHJcbiAgYXR0YWNrUG93ZXI6IDksXHJcbiAgZGlyZWN0SGl0OiAxMCxcclxuICBjcml0aWNhbEhpdDogMTEsXHJcbiAgYXR0YWNrTWFnaWNQb3RlbmN5OiAxMixcclxuICBoZWFsTWFnaWNQb3RlbmN5OiAxMyxcclxuICBkZXRlcm1pbmF0aW9uOiAxNCxcclxuICBza2lsbFNwZWVkOiAxNSxcclxuICBzcGVsbFNwZWVkOiAxNixcclxuICB0ZW5hY2l0eTogMTgsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBQbGF5ZXIgc3RhdHMgZXZlbnRcclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDB4MEMgZXh0ZW5kcyBMaW5lRXZlbnQge1xyXG4gIHB1YmxpYyByZWFkb25seSBjbGFzczogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBzdHJlbmd0aDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBkZXh0ZXJpdHk6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgdml0YWxpdHk6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgaW50ZWxsaWdlbmNlOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IG1pbmQ6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgcGlldHk6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgYXR0YWNrUG93ZXI6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgZGlyZWN0SGl0OiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGNyaXRpY2FsSGl0OiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGF0dGFja01hZ2ljUG90ZW5jeTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBoZWFsTWFnaWNQb3RlbmN5OiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGRldGVybWluYXRpb246IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgc2tpbGxTcGVlZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBzcGVsbFNwZWVkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRlbmFjaXR5OiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHJlcG86IExvZ1JlcG9zaXRvcnksIGxpbmU6IHN0cmluZywgcGFydHM6IHN0cmluZ1tdKSB7XHJcbiAgICBzdXBlcihyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcblxyXG4gICAgdGhpcy5jbGFzcyA9IHBhcnRzW2ZpZWxkcy5jbGFzc10gPz8gJyc7XHJcbiAgICB0aGlzLnN0cmVuZ3RoID0gcGFydHNbZmllbGRzLnN0cmVuZ3RoXSA/PyAnJztcclxuICAgIHRoaXMuZGV4dGVyaXR5ID0gcGFydHNbZmllbGRzLmRleHRlcml0eV0gPz8gJyc7XHJcbiAgICB0aGlzLnZpdGFsaXR5ID0gcGFydHNbZmllbGRzLnZpdGFsaXR5XSA/PyAnJztcclxuICAgIHRoaXMuaW50ZWxsaWdlbmNlID0gcGFydHNbZmllbGRzLmludGVsbGlnZW5jZV0gPz8gJyc7XHJcbiAgICB0aGlzLm1pbmQgPSBwYXJ0c1tmaWVsZHMubWluZF0gPz8gJyc7XHJcbiAgICB0aGlzLnBpZXR5ID0gcGFydHNbZmllbGRzLnBpZXR5XSA/PyAnJztcclxuICAgIHRoaXMuYXR0YWNrUG93ZXIgPSBwYXJ0c1tmaWVsZHMuYXR0YWNrUG93ZXJdID8/ICcnO1xyXG4gICAgdGhpcy5kaXJlY3RIaXQgPSBwYXJ0c1tmaWVsZHMuZGlyZWN0SGl0XSA/PyAnJztcclxuICAgIHRoaXMuY3JpdGljYWxIaXQgPSBwYXJ0c1tmaWVsZHMuY3JpdGljYWxIaXRdID8/ICcnO1xyXG4gICAgdGhpcy5hdHRhY2tNYWdpY1BvdGVuY3kgPSBwYXJ0c1tmaWVsZHMuYXR0YWNrTWFnaWNQb3RlbmN5XSA/PyAnJztcclxuICAgIHRoaXMuaGVhbE1hZ2ljUG90ZW5jeSA9IHBhcnRzW2ZpZWxkcy5oZWFsTWFnaWNQb3RlbmN5XSA/PyAnJztcclxuICAgIHRoaXMuZGV0ZXJtaW5hdGlvbiA9IHBhcnRzW2ZpZWxkcy5kZXRlcm1pbmF0aW9uXSA/PyAnJztcclxuICAgIHRoaXMuc2tpbGxTcGVlZCA9IHBhcnRzW2ZpZWxkcy5za2lsbFNwZWVkXSA/PyAnJztcclxuICAgIHRoaXMuc3BlbGxTcGVlZCA9IHBhcnRzW2ZpZWxkcy5zcGVsbFNwZWVkXSA/PyAnJztcclxuICAgIHRoaXMudGVuYWNpdHkgPSBwYXJ0c1tmaWVsZHMudGVuYWNpdHldID8/ICcnO1xyXG5cclxuICAgIHRoaXMuY29udmVydGVkTGluZSA9IHRoaXMucHJlZml4KCkgK1xyXG4gICAgICAnUGxheWVyIFN0YXRzOiAnICsgcGFydHMuc2xpY2UoMiwgcGFydHMubGVuZ3RoIC0gMSkuam9pbignOicpLnJlcGxhY2UoL1xcfC9nLCAnOicpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDEyIGV4dGVuZHMgTGluZUV2ZW50MHgwQyB7IH1cclxuIiwiaW1wb3J0IExpbmVFdmVudCwgeyBMaW5lRXZlbnRBYmlsaXR5LCBMaW5lRXZlbnRTb3VyY2UsIExpbmVFdmVudFRhcmdldCB9IGZyb20gJy4vTGluZUV2ZW50JztcclxuaW1wb3J0IEVtdWxhdG9yQ29tbW9uIGZyb20gJy4uLy4uL0VtdWxhdG9yQ29tbW9uJztcclxuaW1wb3J0IExvZ1JlcG9zaXRvcnkgZnJvbSAnLi9Mb2dSZXBvc2l0b3J5JztcclxuXHJcbmNvbnN0IGZpZWxkcyA9IHtcclxuICBpZDogMixcclxuICBuYW1lOiAzLFxyXG4gIGFiaWxpdHlJZDogNCxcclxuICBhYmlsaXR5TmFtZTogNSxcclxuICB0YXJnZXRJZDogNixcclxuICB0YXJnZXROYW1lOiA3LFxyXG4gIGR1cmF0aW9uOiA4LFxyXG59IGFzIGNvbnN0O1xyXG5cclxuLy8gQWJpbGl0eSB1c2UgZXZlbnRcclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDB4MTQgZXh0ZW5kcyBMaW5lRXZlbnRcclxuICBpbXBsZW1lbnRzIExpbmVFdmVudFNvdXJjZSwgTGluZUV2ZW50VGFyZ2V0LCBMaW5lRXZlbnRBYmlsaXR5IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgcHJvcGVyQ2FzZUNvbnZlcnRlZExpbmU6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGlkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgYWJpbGl0eUlkOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IGFiaWxpdHlJZEhleDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBhYmlsaXR5TmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSB0YXJnZXRJZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSB0YXJnZXROYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGR1cmF0aW9uOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlzU291cmNlID0gdHJ1ZTtcclxuICBwdWJsaWMgcmVhZG9ubHkgaXNUYXJnZXQgPSB0cnVlO1xyXG4gIHB1YmxpYyByZWFkb25seSBpc0FiaWxpdHkgPSB0cnVlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZXBvOiBMb2dSZXBvc2l0b3J5LCBsaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgc3VwZXIocmVwbywgbGluZSwgcGFydHMpO1xyXG5cclxuICAgIHRoaXMuaWQgPSBwYXJ0c1tmaWVsZHMuaWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnO1xyXG4gICAgdGhpcy5uYW1lID0gcGFydHNbZmllbGRzLm5hbWVdID8/ICcnO1xyXG4gICAgdGhpcy5hYmlsaXR5SWRIZXggPSBwYXJ0c1tmaWVsZHMuYWJpbGl0eUlkXT8udG9VcHBlckNhc2UoKSA/PyAnJztcclxuICAgIHRoaXMuYWJpbGl0eUlkID0gcGFyc2VJbnQodGhpcy5hYmlsaXR5SWRIZXgpO1xyXG4gICAgdGhpcy5hYmlsaXR5TmFtZSA9IHBhcnRzW2ZpZWxkcy5hYmlsaXR5TmFtZV0gPz8gJyc7XHJcbiAgICB0aGlzLnRhcmdldElkID0gcGFydHNbZmllbGRzLnRhcmdldElkXT8udG9VcHBlckNhc2UoKSA/PyAnJztcclxuICAgIHRoaXMudGFyZ2V0TmFtZSA9IHBhcnRzW2ZpZWxkcy50YXJnZXROYW1lXSA/PyAnJztcclxuICAgIHRoaXMuZHVyYXRpb24gPSBwYXJ0c1tmaWVsZHMuZHVyYXRpb25dID8/ICcnO1xyXG5cclxuICAgIHJlcG8udXBkYXRlQ29tYmF0YW50KHRoaXMuaWQsIHtcclxuICAgICAgam9iOiB1bmRlZmluZWQsXHJcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgc3Bhd246IHRoaXMudGltZXN0YW1wLFxyXG4gICAgICBkZXNwYXduOiB0aGlzLnRpbWVzdGFtcCxcclxuICAgIH0pO1xyXG5cclxuICAgIHJlcG8udXBkYXRlQ29tYmF0YW50KHRoaXMudGFyZ2V0SWQsIHtcclxuICAgICAgam9iOiB1bmRlZmluZWQsXHJcbiAgICAgIG5hbWU6IHRoaXMudGFyZ2V0TmFtZSxcclxuICAgICAgc3Bhd246IHRoaXMudGltZXN0YW1wLFxyXG4gICAgICBkZXNwYXduOiB0aGlzLnRpbWVzdGFtcCxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMudGFyZ2V0TmFtZS5sZW5ndGggPT09IDAgPyAnVW5rbm93bicgOiB0aGlzLnRhcmdldE5hbWU7XHJcblxyXG4gICAgdGhpcy5jb252ZXJ0ZWRMaW5lID0gdGhpcy5wcmVmaXgoKSArIHRoaXMuYWJpbGl0eUlkSGV4ICtcclxuICAgICAgJzonICsgdGhpcy5uYW1lICtcclxuICAgICAgJyBzdGFydHMgdXNpbmcgJyArIHRoaXMuYWJpbGl0eU5hbWUgK1xyXG4gICAgICAnIG9uICcgKyB0YXJnZXQgKyAnLic7XHJcbiAgICB0aGlzLnByb3BlckNhc2VDb252ZXJ0ZWRMaW5lID0gdGhpcy5wcmVmaXgoKSArIHRoaXMuYWJpbGl0eUlkSGV4ICtcclxuICAgICAgJzonICsgRW11bGF0b3JDb21tb24ucHJvcGVyQ2FzZSh0aGlzLm5hbWUpICtcclxuICAgICAgJyBzdGFydHMgdXNpbmcgJyArIHRoaXMuYWJpbGl0eU5hbWUgK1xyXG4gICAgICAnIG9uICcgKyBFbXVsYXRvckNvbW1vbi5wcm9wZXJDYXNlKHRhcmdldCkgKyAnLic7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MjAgZXh0ZW5kcyBMaW5lRXZlbnQweDE0IHsgfVxyXG4iLCJpbXBvcnQgTGluZUV2ZW50LCB7IExpbmVFdmVudEFiaWxpdHksIExpbmVFdmVudFNvdXJjZSwgTGluZUV2ZW50VGFyZ2V0IH0gZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxuY29uc3QgZmllbGRzID0ge1xyXG4gIGlkOiAyLFxyXG4gIG5hbWU6IDMsXHJcbiAgZmxhZ3M6IDgsXHJcbiAgZGFtYWdlOiA5LFxyXG4gIGFiaWxpdHlJZDogNCxcclxuICBhYmlsaXR5TmFtZTogNSxcclxuICB0YXJnZXRJZDogNixcclxuICB0YXJnZXROYW1lOiA3LFxyXG4gIHRhcmdldEhwOiAyNCxcclxuICB0YXJnZXRNYXhIcDogMjUsXHJcbiAgdGFyZ2V0TXA6IDI2LFxyXG4gIHRhcmdldE1heE1wOiAyNyxcclxuICB0YXJnZXRYOiAzMCxcclxuICB0YXJnZXRZOiAzMSxcclxuICB0YXJnZXRaOiAzMixcclxuICB0YXJnZXRIZWFkaW5nOiAzMyxcclxuICBzb3VyY2VIcDogMzQsXHJcbiAgc291cmNlTWF4SHA6IDM1LFxyXG4gIHNvdXJjZU1wOiAzNixcclxuICBzb3VyY2VNYXhNcDogMzcsXHJcbiAgeDogNDAsXHJcbiAgeTogNDEsXHJcbiAgejogNDIsXHJcbiAgaGVhZGluZzogNDMsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBBYmlsaXR5IGhpdCBzaW5nbGUgdGFyZ2V0IGV2ZW50XHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQweDE1IGV4dGVuZHMgTGluZUV2ZW50XHJcbiAgaW1wbGVtZW50cyBMaW5lRXZlbnRTb3VyY2UsIExpbmVFdmVudFRhcmdldCwgTGluZUV2ZW50QWJpbGl0eSB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGRhbWFnZTogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGFiaWxpdHlJZDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBhYmlsaXR5TmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSB0YXJnZXRJZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSB0YXJnZXROYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGZsYWdzOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldEhwOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldE1heEhwOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldE1wOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldE1heE1wOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldFg6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0WTogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSB0YXJnZXRaOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldEhlYWRpbmc6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgaHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbWF4SHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbXA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbWF4TXA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgeDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSB5OiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHo6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgaGVhZGluZzogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBpc1NvdXJjZSA9IHRydWU7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlzVGFyZ2V0ID0gdHJ1ZTtcclxuICBwdWJsaWMgcmVhZG9ubHkgaXNBYmlsaXR5ID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IocmVwbzogTG9nUmVwb3NpdG9yeSwgbGluZTogc3RyaW5nLCBwYXJ0czogc3RyaW5nW10pIHtcclxuICAgIHN1cGVyKHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuXHJcbiAgICB0aGlzLmlkID0gcGFydHNbZmllbGRzLmlkXT8udG9VcHBlckNhc2UoKSA/PyAnJztcclxuICAgIHRoaXMubmFtZSA9IHBhcnRzW2ZpZWxkcy5uYW1lXSA/PyAnJztcclxuXHJcbiAgICB0aGlzLmZsYWdzID0gcGFydHNbZmllbGRzLmZsYWdzXSA/PyAnJztcclxuXHJcbiAgICBjb25zdCBmaWVsZE9mZnNldCA9IHRoaXMuZmxhZ3MgPT09ICczRicgPyAyIDogMDtcclxuXHJcbiAgICB0aGlzLmRhbWFnZSA9IExpbmVFdmVudC5jYWxjdWxhdGVEYW1hZ2UocGFydHNbZmllbGRzLmRhbWFnZSArIGZpZWxkT2Zmc2V0XSA/PyAnJyk7XHJcbiAgICB0aGlzLmFiaWxpdHlJZCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5hYmlsaXR5SWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnKTtcclxuICAgIHRoaXMuYWJpbGl0eU5hbWUgPSBwYXJ0c1tmaWVsZHMuYWJpbGl0eU5hbWVdID8/ICcnO1xyXG4gICAgdGhpcy50YXJnZXRJZCA9IHBhcnRzW2ZpZWxkcy50YXJnZXRJZF0/LnRvVXBwZXJDYXNlKCkgPz8gJyc7XHJcbiAgICB0aGlzLnRhcmdldE5hbWUgPSBwYXJ0c1tmaWVsZHMudGFyZ2V0TmFtZV0gPz8gJyc7XHJcblxyXG4gICAgdGhpcy50YXJnZXRIcCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy50YXJnZXRIcCArIGZpZWxkT2Zmc2V0XSA/PyAnJyk7XHJcbiAgICB0aGlzLnRhcmdldE1heEhwID0gcGFyc2VJbnQocGFydHNbZmllbGRzLnRhcmdldE1heEhwICsgZmllbGRPZmZzZXRdID8/ICcnKTtcclxuICAgIHRoaXMudGFyZ2V0TXAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMudGFyZ2V0TXAgKyBmaWVsZE9mZnNldF0gPz8gJycpO1xyXG4gICAgdGhpcy50YXJnZXRNYXhNcCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy50YXJnZXRNYXhNcCArIGZpZWxkT2Zmc2V0XSA/PyAnJyk7XHJcbiAgICB0aGlzLnRhcmdldFggPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy50YXJnZXRYICsgZmllbGRPZmZzZXRdID8/ICcnKTtcclxuICAgIHRoaXMudGFyZ2V0WSA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLnRhcmdldFkgKyBmaWVsZE9mZnNldF0gPz8gJycpO1xyXG4gICAgdGhpcy50YXJnZXRaID0gcGFyc2VGbG9hdChwYXJ0c1tmaWVsZHMudGFyZ2V0WiArIGZpZWxkT2Zmc2V0XSA/PyAnJyk7XHJcbiAgICB0aGlzLnRhcmdldEhlYWRpbmcgPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy50YXJnZXRIZWFkaW5nICsgZmllbGRPZmZzZXRdID8/ICcnKTtcclxuXHJcbiAgICB0aGlzLmhwID0gcGFyc2VJbnQocGFydHNbZmllbGRzLnNvdXJjZUhwICsgZmllbGRPZmZzZXRdID8/ICcnKTtcclxuICAgIHRoaXMubWF4SHAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMuc291cmNlTWF4SHAgKyBmaWVsZE9mZnNldF0gPz8gJycpO1xyXG4gICAgdGhpcy5tcCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5zb3VyY2VNcCArIGZpZWxkT2Zmc2V0XSA/PyAnJyk7XHJcbiAgICB0aGlzLm1heE1wID0gcGFyc2VJbnQocGFydHNbZmllbGRzLnNvdXJjZU1heE1wICsgZmllbGRPZmZzZXRdID8/ICcnKTtcclxuICAgIHRoaXMueCA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLnggKyBmaWVsZE9mZnNldF0gPz8gJycpO1xyXG4gICAgdGhpcy55ID0gcGFyc2VGbG9hdChwYXJ0c1tmaWVsZHMueSArIGZpZWxkT2Zmc2V0XSA/PyAnJyk7XHJcbiAgICB0aGlzLnogPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy56ICsgZmllbGRPZmZzZXRdID8/ICcnKTtcclxuICAgIHRoaXMuaGVhZGluZyA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLmhlYWRpbmcgKyBmaWVsZE9mZnNldF0gPz8gJycpO1xyXG5cclxuXHJcbiAgICByZXBvLnVwZGF0ZUNvbWJhdGFudCh0aGlzLmlkLCB7XHJcbiAgICAgIGpvYjogdW5kZWZpbmVkLFxyXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXHJcbiAgICAgIHNwYXduOiB0aGlzLnRpbWVzdGFtcCxcclxuICAgICAgZGVzcGF3bjogdGhpcy50aW1lc3RhbXAsXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXBvLnVwZGF0ZUNvbWJhdGFudCh0aGlzLnRhcmdldElkLCB7XHJcbiAgICAgIGpvYjogdW5kZWZpbmVkLFxyXG4gICAgICBuYW1lOiB0aGlzLnRhcmdldE5hbWUsXHJcbiAgICAgIHNwYXduOiB0aGlzLnRpbWVzdGFtcCxcclxuICAgICAgZGVzcGF3bjogdGhpcy50aW1lc3RhbXAsXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQyMSBleHRlbmRzIExpbmVFdmVudDB4MTUge31cclxuIiwiaW1wb3J0IHsgTGluZUV2ZW50MHgxNSB9IGZyb20gJy4vTGluZUV2ZW50MHgxNSc7XHJcbmltcG9ydCBMb2dSZXBvc2l0b3J5IGZyb20gJy4vTG9nUmVwb3NpdG9yeSc7XHJcblxyXG4vLyBBYmlsaXR5IGhpdCBtdWx0aXBsZS9ubyB0YXJnZXQgZXZlbnRcclxuLy8gRHVwbGljYXRlIG9mIDB4MTUgYXMgZmFyIGFzIGRhdGFcclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDB4MTYgZXh0ZW5kcyBMaW5lRXZlbnQweDE1IHtcclxuICBjb25zdHJ1Y3RvcihyZXBvOiBMb2dSZXBvc2l0b3J5LCBsaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgc3VwZXIocmVwbywgbGluZSwgcGFydHMpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDIyIGV4dGVuZHMgTGluZUV2ZW50MHgxNiB7fVxyXG4iLCJpbXBvcnQgTGluZUV2ZW50LCB7IExpbmVFdmVudEFiaWxpdHksIExpbmVFdmVudFNvdXJjZSB9IGZyb20gJy4vTGluZUV2ZW50JztcclxuaW1wb3J0IExvZ1JlcG9zaXRvcnkgZnJvbSAnLi9Mb2dSZXBvc2l0b3J5JztcclxuXHJcbmNvbnN0IGZpZWxkcyA9IHtcclxuICBpZDogMixcclxuICBuYW1lOiAzLFxyXG4gIGFiaWxpdHlJZDogNCxcclxuICBhYmlsaXR5TmFtZTogNSxcclxuICByZWFzb246IDYsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBDYW5jZWwgYWJpbGl0eSBldmVudFxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MHgxNyBleHRlbmRzIExpbmVFdmVudFxyXG4gIGltcGxlbWVudHMgTGluZUV2ZW50U291cmNlLCBMaW5lRXZlbnRBYmlsaXR5IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgaWQ6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBhYmlsaXR5SWQ6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgYWJpbGl0eU5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgcmVhc29uOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlzU291cmNlID0gdHJ1ZTtcclxuICBwdWJsaWMgcmVhZG9ubHkgaXNBYmlsaXR5ID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IocmVwbzogTG9nUmVwb3NpdG9yeSwgbGluZTogc3RyaW5nLCBwYXJ0czogc3RyaW5nW10pIHtcclxuICAgIHN1cGVyKHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuXHJcbiAgICB0aGlzLmlkID0gcGFydHNbZmllbGRzLmlkXT8udG9VcHBlckNhc2UoKSA/PyAnJztcclxuICAgIHRoaXMubmFtZSA9IHBhcnRzW2ZpZWxkcy5uYW1lXSA/PyAnJztcclxuICAgIHRoaXMuYWJpbGl0eUlkID0gcGFyc2VJbnQocGFydHNbZmllbGRzLmFiaWxpdHlJZF0/LnRvVXBwZXJDYXNlKCkgPz8gJycpO1xyXG4gICAgdGhpcy5hYmlsaXR5TmFtZSA9IHBhcnRzW2ZpZWxkcy5hYmlsaXR5TmFtZV0gPz8gJyc7XHJcbiAgICB0aGlzLnJlYXNvbiA9IHBhcnRzW2ZpZWxkcy5yZWFzb25dID8/ICcnO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDIzIGV4dGVuZHMgTGluZUV2ZW50MHgxNyB7fVxyXG4iLCJpbXBvcnQgTGluZUV2ZW50LCB7IExpbmVFdmVudFNvdXJjZSB9IGZyb20gJy4vTGluZUV2ZW50JztcclxuaW1wb3J0IEVtdWxhdG9yQ29tbW9uIGZyb20gJy4uLy4uL0VtdWxhdG9yQ29tbW9uJztcclxuaW1wb3J0IExvZ1JlcG9zaXRvcnkgZnJvbSAnLi9Mb2dSZXBvc2l0b3J5JztcclxuXHJcbmNvbnN0IGZpZWxkcyA9IHtcclxuICBpZDogMixcclxuICBuYW1lOiAzLFxyXG4gIHR5cGU6IDQsXHJcbiAgZWZmZWN0SWQ6IDUsXHJcbiAgZGFtYWdlOiA2LFxyXG4gIGN1cnJlbnRIcDogNyxcclxuICBtYXhIcDogOCxcclxuICBjdXJyZW50TXA6IDksXHJcbiAgbWF4TXA6IDEwLFxyXG4gIGN1cnJlbnRUcDogMTEsXHJcbiAgbWF4VHA6IDEyLFxyXG4gIHg6IDEzLFxyXG4gIHk6IDE0LFxyXG4gIHo6IDE1LFxyXG4gIGhlYWRpbmc6IDE2LFxyXG59IGFzIGNvbnN0O1xyXG5cclxuLy8gRG9UL0hvVCBldmVudFxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MHgxOCBleHRlbmRzIExpbmVFdmVudCBpbXBsZW1lbnRzIExpbmVFdmVudFNvdXJjZSB7XHJcbiAgcHVibGljIHJlYWRvbmx5IHByb3BlckNhc2VDb252ZXJ0ZWRMaW5lOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgZWZmZWN0SWQ6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgZGFtYWdlOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IGhwOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IG1heEhwOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IG1wOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IG1heE1wOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRwOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IG1heFRwOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHg6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgeTogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSB6OiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IGhlYWRpbmc6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgaXNTb3VyY2UgPSB0cnVlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZXBvOiBMb2dSZXBvc2l0b3J5LCBsaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgc3VwZXIocmVwbywgbGluZSwgcGFydHMpO1xyXG5cclxuICAgIHRoaXMuaWQgPSBwYXJ0c1tmaWVsZHMuaWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnO1xyXG4gICAgdGhpcy5uYW1lID0gcGFydHNbZmllbGRzLm5hbWVdID8/ICcnO1xyXG5cclxuICAgIHRoaXMudHlwZSA9IHBhcnRzW2ZpZWxkcy50eXBlXSA/PyAnJztcclxuICAgIHRoaXMuZWZmZWN0SWQgPSBwYXJ0c1tmaWVsZHMuZWZmZWN0SWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnO1xyXG4gICAgdGhpcy5kYW1hZ2UgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMuZGFtYWdlXSA/PyAnJywgMTYpO1xyXG5cclxuICAgIHRoaXMuaHAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMuY3VycmVudEhwXSA/PyAnJyk7XHJcbiAgICB0aGlzLm1heEhwID0gcGFyc2VJbnQocGFydHNbZmllbGRzLm1heEhwXSA/PyAnJyk7XHJcbiAgICB0aGlzLm1wID0gcGFyc2VJbnQocGFydHNbZmllbGRzLmN1cnJlbnRNcF0gPz8gJycpO1xyXG4gICAgdGhpcy5tYXhNcCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5tYXhNcF0gPz8gJycpO1xyXG4gICAgdGhpcy50cCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5jdXJyZW50VHBdID8/ICcnKTtcclxuICAgIHRoaXMubWF4VHAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMubWF4VHBdID8/ICcnKTtcclxuICAgIHRoaXMueCA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLnhdID8/ICcnKTtcclxuICAgIHRoaXMueSA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLnldID8/ICcnKTtcclxuICAgIHRoaXMueiA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLnpdID8/ICcnKTtcclxuICAgIHRoaXMuaGVhZGluZyA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLmhlYWRpbmddID8/ICcnKTtcclxuXHJcbiAgICByZXBvLnVwZGF0ZUNvbWJhdGFudCh0aGlzLmlkLCB7XHJcbiAgICAgIGpvYjogdW5kZWZpbmVkLFxyXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXHJcbiAgICAgIHNwYXduOiB0aGlzLnRpbWVzdGFtcCxcclxuICAgICAgZGVzcGF3bjogdGhpcy50aW1lc3RhbXAsXHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgZWZmZWN0TmFtZSA9ICcnO1xyXG4gICAgY29uc3QgcmVzb2x2ZWROYW1lID0gcmVwby5yZXNvbHZlTmFtZSh0aGlzLmlkLCB0aGlzLm5hbWUpO1xyXG5cclxuICAgIGlmICh0aGlzLmVmZmVjdElkIGluIExpbmVFdmVudDB4MTguc2hvd0VmZmVjdE5hbWVzRm9yKVxyXG4gICAgICBlZmZlY3ROYW1lID0gTGluZUV2ZW50MHgxOC5zaG93RWZmZWN0TmFtZXNGb3JbdGhpcy5lZmZlY3RJZF0gPz8gJyc7XHJcblxyXG4gICAgbGV0IGVmZmVjdFBhcnQgPSAnJztcclxuICAgIGlmIChlZmZlY3ROYW1lKVxyXG4gICAgICBlZmZlY3RQYXJ0ID0gZWZmZWN0TmFtZSArICcgJztcclxuXHJcbiAgICB0aGlzLmNvbnZlcnRlZExpbmUgPSB0aGlzLnByZWZpeCgpICsgZWZmZWN0UGFydCArIHRoaXMudHlwZSArXHJcbiAgICAgICcgVGljayBvbiAnICsgcmVzb2x2ZWROYW1lICtcclxuICAgICAgJyBmb3IgJyArIHRoaXMuZGFtYWdlLnRvU3RyaW5nKCkgKyAnIGRhbWFnZS4nO1xyXG5cclxuICAgIHRoaXMucHJvcGVyQ2FzZUNvbnZlcnRlZExpbmUgPSB0aGlzLnByZWZpeCgpICsgZWZmZWN0UGFydCArIHRoaXMudHlwZSArXHJcbiAgICAgICcgVGljayBvbiAnICsgRW11bGF0b3JDb21tb24ucHJvcGVyQ2FzZShyZXNvbHZlZE5hbWUpICtcclxuICAgICAgJyBmb3IgJyArIHRoaXMuZGFtYWdlLnRvU3RyaW5nKCkgKyAnIGRhbWFnZS4nO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNob3dFZmZlY3ROYW1lc0ZvcjogeyBbZWZmZWN0SWQ6IHN0cmluZ106IHN0cmluZyB9ID0ge1xyXG4gICAgJzRDNCc6ICdFeGNvZ25pdGlvbicsXHJcbiAgICAnMzVEJzogJ1dpbGRmaXJlJyxcclxuICAgICcxRjUnOiAnRG90b24nLFxyXG4gICAgJzJFRCc6ICdTYWx0ZWQgRWFydGgnLFxyXG4gICAgJzRCNSc6ICdGbGFtZXRocm93ZXInLFxyXG4gICAgJzJFMyc6ICdBc3lsdW0nLFxyXG4gICAgJzc3Nyc6ICdBc3lsdW0nLFxyXG4gICAgJzc5OCc6ICdTYWNyZWQgU29pbCcsXHJcbiAgICAnNEM3JzogJ0ZleSBVbmlvbicsXHJcbiAgICAnNzQyJzogJ05hc2NlbnQgR2xpbnQnLFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQyNCBleHRlbmRzIExpbmVFdmVudDB4MTggeyB9XHJcbiIsImltcG9ydCBMaW5lRXZlbnQgZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgRW11bGF0b3JDb21tb24gZnJvbSAnLi4vLi4vRW11bGF0b3JDb21tb24nO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxuY29uc3QgZmllbGRzID0ge1xyXG4gIGlkOiAyLFxyXG4gIG5hbWU6IDMsXHJcbiAgdGFyZ2V0SWQ6IDQsXHJcbiAgdGFyZ2V0TmFtZTogNSxcclxufSBhcyBjb25zdDtcclxuXHJcbi8vIENvbWJhdGFudCBkZWZlYXRlZCBldmVudFxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MHgxOSBleHRlbmRzIExpbmVFdmVudCB7XHJcbiAgcHVibGljIHJlYWRvbmx5IHByb3BlckNhc2VDb252ZXJ0ZWRMaW5lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0SWQ6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0TmFtZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZXBvOiBMb2dSZXBvc2l0b3J5LCBsaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgc3VwZXIocmVwbywgbGluZSwgcGFydHMpO1xyXG5cclxuICAgIHRoaXMuaWQgPSBwYXJ0c1tmaWVsZHMuaWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnO1xyXG4gICAgdGhpcy5uYW1lID0gcGFydHNbZmllbGRzLm5hbWVdID8/ICcnO1xyXG4gICAgdGhpcy50YXJnZXRJZCA9IHBhcnRzW2ZpZWxkcy50YXJnZXRJZF0/LnRvVXBwZXJDYXNlKCkgPz8gJyc7XHJcbiAgICB0aGlzLnRhcmdldE5hbWUgPSBwYXJ0c1tmaWVsZHMudGFyZ2V0TmFtZV0gPz8gJyc7XHJcblxyXG4gICAgcmVwby51cGRhdGVDb21iYXRhbnQodGhpcy5pZCwge1xyXG4gICAgICBqb2I6IHVuZGVmaW5lZCxcclxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxyXG4gICAgICBzcGF3bjogdGhpcy50aW1lc3RhbXAsXHJcbiAgICAgIGRlc3Bhd246IHRoaXMudGltZXN0YW1wLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmVwby51cGRhdGVDb21iYXRhbnQodGhpcy50YXJnZXRJZCwge1xyXG4gICAgICBqb2I6IHVuZGVmaW5lZCxcclxuICAgICAgbmFtZTogdGhpcy50YXJnZXROYW1lLFxyXG4gICAgICBzcGF3bjogdGhpcy50aW1lc3RhbXAsXHJcbiAgICAgIGRlc3Bhd246IHRoaXMudGltZXN0YW1wLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IHJlc29sdmVkTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgbGV0IHJlc29sdmVkVGFyZ2V0TmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGlmICh0aGlzLmlkICE9PSAnMDAnKVxyXG4gICAgICByZXNvbHZlZE5hbWUgPSByZXBvLnJlc29sdmVOYW1lKHRoaXMuaWQsIHRoaXMubmFtZSk7XHJcblxyXG4gICAgaWYgKHRoaXMudGFyZ2V0SWQgIT09ICcwMCcpXHJcbiAgICAgIHJlc29sdmVkVGFyZ2V0TmFtZSA9IHJlcG8ucmVzb2x2ZU5hbWUodGhpcy50YXJnZXRJZCwgdGhpcy50YXJnZXROYW1lKTtcclxuXHJcbiAgICBjb25zdCBkZWZlYXRlZE5hbWUgPSAocmVzb2x2ZWROYW1lID8/IHRoaXMubmFtZSk7XHJcbiAgICBjb25zdCBraWxsZXJOYW1lID0gKHJlc29sdmVkVGFyZ2V0TmFtZSA/PyB0aGlzLnRhcmdldE5hbWUpO1xyXG4gICAgdGhpcy5jb252ZXJ0ZWRMaW5lID0gdGhpcy5wcmVmaXgoKSArIGRlZmVhdGVkTmFtZSArXHJcbiAgICAgICcgd2FzIGRlZmVhdGVkIGJ5ICcgKyBraWxsZXJOYW1lICsgJy4nO1xyXG4gICAgdGhpcy5wcm9wZXJDYXNlQ29udmVydGVkTGluZSA9IHRoaXMucHJlZml4KCkgKyBFbXVsYXRvckNvbW1vbi5wcm9wZXJDYXNlKGRlZmVhdGVkTmFtZSkgK1xyXG4gICAgICAnIHdhcyBkZWZlYXRlZCBieSAnICsgRW11bGF0b3JDb21tb24ucHJvcGVyQ2FzZShraWxsZXJOYW1lKSArICcuJztcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQyNSBleHRlbmRzIExpbmVFdmVudDB4MTkgeyB9XHJcbiIsImltcG9ydCBMaW5lRXZlbnQsIHsgTGluZUV2ZW50QWJpbGl0eSB9IGZyb20gJy4vTGluZUV2ZW50JztcclxuaW1wb3J0IEVtdWxhdG9yQ29tbW9uIGZyb20gJy4uLy4uL0VtdWxhdG9yQ29tbW9uJztcclxuaW1wb3J0IExvZ1JlcG9zaXRvcnkgZnJvbSAnLi9Mb2dSZXBvc2l0b3J5JztcclxuXHJcbmNvbnN0IGZpZWxkcyA9IHtcclxuICBhYmlsaXR5SWQ6IDIsXHJcbiAgYWJpbGl0eU5hbWU6IDMsXHJcbiAgZHVyYXRpb25TdHJpbmc6IDQsXHJcbiAgaWQ6IDUsXHJcbiAgbmFtZTogNixcclxuICB0YXJnZXRJZDogNyxcclxuICB0YXJnZXROYW1lOiA4LFxyXG4gIHN0YWNrczogOSxcclxuICB0YXJnZXRIcDogMTAsXHJcbiAgc291cmNlSHA6IDExLFxyXG59IGFzIGNvbnN0O1xyXG5cclxuLy8gR2FpbiBzdGF0dXMgZWZmZWN0IGV2ZW50XHJcbi8vIERlbGliZXJhdGVseSBkb24ndCBmbGFnIHRoaXMgYXMgTGluZUV2ZW50U291cmNlIG9yIExpbmVFdmVudFRhcmdldFxyXG4vLyBiZWNhdXNlIDB4MUEgbGluZSB2YWx1ZXMgYXJlbid0IGFjY3VyYXRlXHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQweDFBIGV4dGVuZHMgTGluZUV2ZW50IGltcGxlbWVudHMgTGluZUV2ZW50QWJpbGl0eSB7XHJcbiAgcHVibGljIHJlYWRvbmx5IHJlc29sdmVkTmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSByZXNvbHZlZFRhcmdldE5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgZmFsbGJhY2tSZXNvbHZlZFRhcmdldE5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgcHJvcGVyQ2FzZUNvbnZlcnRlZExpbmU6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGFiaWxpdHlJZDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBhYmlsaXR5TmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBkdXJhdGlvbkZsb2F0OiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IGR1cmF0aW9uU3RyaW5nOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0SWQ6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0TmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBzdGFja3M6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0SHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgaHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgaXNBYmlsaXR5ID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IocmVwbzogTG9nUmVwb3NpdG9yeSwgbGluZTogc3RyaW5nLCBwYXJ0czogc3RyaW5nW10pIHtcclxuICAgIHN1cGVyKHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuXHJcbiAgICB0aGlzLmFiaWxpdHlJZCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5hYmlsaXR5SWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnKTtcclxuICAgIHRoaXMuYWJpbGl0eU5hbWUgPSBwYXJ0c1tmaWVsZHMuYWJpbGl0eU5hbWVdID8/ICcnO1xyXG4gICAgdGhpcy5kdXJhdGlvblN0cmluZyA9IHBhcnRzW2ZpZWxkcy5kdXJhdGlvblN0cmluZ10gPz8gJyc7XHJcbiAgICB0aGlzLmR1cmF0aW9uRmxvYXQgPSBwYXJzZUZsb2F0KHRoaXMuZHVyYXRpb25TdHJpbmcpO1xyXG4gICAgdGhpcy5pZCA9IHBhcnRzW2ZpZWxkcy5pZF0/LnRvVXBwZXJDYXNlKCkgPz8gJyc7XHJcbiAgICB0aGlzLm5hbWUgPSBwYXJ0c1tmaWVsZHMubmFtZV0gPz8gJyc7XHJcbiAgICB0aGlzLnRhcmdldElkID0gcGFydHNbZmllbGRzLnRhcmdldElkXT8udG9VcHBlckNhc2UoKSA/PyAnJztcclxuICAgIHRoaXMudGFyZ2V0TmFtZSA9IHBhcnRzW2ZpZWxkcy50YXJnZXROYW1lXSA/PyAnJztcclxuICAgIHRoaXMuc3RhY2tzID0gcGFyc2VJbnQocGFydHNbZmllbGRzLnN0YWNrc10gPz8gJzAnKTtcclxuICAgIHRoaXMudGFyZ2V0SHAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMudGFyZ2V0SHBdID8/ICcnKTtcclxuICAgIHRoaXMuaHAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMuc291cmNlSHBdID8/ICcnKTtcclxuXHJcbiAgICByZXBvLnVwZGF0ZUNvbWJhdGFudCh0aGlzLmlkLCB7XHJcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgc3Bhd246IHRoaXMudGltZXN0YW1wLFxyXG4gICAgICBkZXNwYXduOiB0aGlzLnRpbWVzdGFtcCxcclxuICAgICAgam9iOiB1bmRlZmluZWQsXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXBvLnVwZGF0ZUNvbWJhdGFudCh0aGlzLnRhcmdldElkLCB7XHJcbiAgICAgIG5hbWU6IHRoaXMudGFyZ2V0TmFtZSxcclxuICAgICAgc3Bhd246IHRoaXMudGltZXN0YW1wLFxyXG4gICAgICBkZXNwYXduOiB0aGlzLnRpbWVzdGFtcCxcclxuICAgICAgam9iOiB1bmRlZmluZWQsXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnJlc29sdmVkTmFtZSA9IHJlcG8ucmVzb2x2ZU5hbWUodGhpcy5pZCwgdGhpcy5uYW1lKTtcclxuICAgIHRoaXMucmVzb2x2ZWRUYXJnZXROYW1lID0gcmVwby5yZXNvbHZlTmFtZSh0aGlzLnRhcmdldElkLCB0aGlzLnRhcmdldE5hbWUpO1xyXG5cclxuICAgIHRoaXMuZmFsbGJhY2tSZXNvbHZlZFRhcmdldE5hbWUgPVxyXG4gICAgICByZXBvLnJlc29sdmVOYW1lKHRoaXMuaWQsIHRoaXMubmFtZSwgdGhpcy50YXJnZXRJZCwgdGhpcy50YXJnZXROYW1lKTtcclxuXHJcbiAgICBsZXQgc3RhY2tDb3VudFRleHQgPSAnJztcclxuICAgIGlmICh0aGlzLnN0YWNrcyA+IDAgJiYgdGhpcy5zdGFja3MgPCAyMCAmJlxyXG4gICAgICBMaW5lRXZlbnQweDFBLnNob3dTdGFja0NvdW50Rm9yLmluY2x1ZGVzKHRoaXMuYWJpbGl0eUlkKSlcclxuICAgICAgc3RhY2tDb3VudFRleHQgPSAnICgnICsgdGhpcy5zdGFja3MudG9TdHJpbmcoKSArICcpJztcclxuXHJcbiAgICB0aGlzLmNvbnZlcnRlZExpbmUgPSB0aGlzLnByZWZpeCgpICsgdGhpcy50YXJnZXRJZCArXHJcbiAgICAgICc6JyArIHRoaXMudGFyZ2V0TmFtZSArXHJcbiAgICAgICcgZ2FpbnMgdGhlIGVmZmVjdCBvZiAnICsgdGhpcy5hYmlsaXR5TmFtZSArXHJcbiAgICAgICcgZnJvbSAnICsgdGhpcy5mYWxsYmFja1Jlc29sdmVkVGFyZ2V0TmFtZSArXHJcbiAgICAgICcgZm9yICcgKyB0aGlzLmR1cmF0aW9uU3RyaW5nICsgJyBTZWNvbmRzLicgKyBzdGFja0NvdW50VGV4dDtcclxuXHJcbiAgICB0aGlzLnByb3BlckNhc2VDb252ZXJ0ZWRMaW5lID0gdGhpcy5wcmVmaXgoKSArIHRoaXMudGFyZ2V0SWQgK1xyXG4gICAgICAnOicgKyBFbXVsYXRvckNvbW1vbi5wcm9wZXJDYXNlKHRoaXMudGFyZ2V0TmFtZSkgK1xyXG4gICAgICAnIGdhaW5zIHRoZSBlZmZlY3Qgb2YgJyArIHRoaXMuYWJpbGl0eU5hbWUgK1xyXG4gICAgICAnIGZyb20gJyArIEVtdWxhdG9yQ29tbW9uLnByb3BlckNhc2UodGhpcy5mYWxsYmFja1Jlc29sdmVkVGFyZ2V0TmFtZSkgK1xyXG4gICAgICAnIGZvciAnICsgdGhpcy5kdXJhdGlvblN0cmluZyArICcgU2Vjb25kcy4nICsgc3RhY2tDb3VudFRleHQ7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2hvd1N0YWNrQ291bnRGb3I6IHJlYWRvbmx5IG51bWJlcltdID0gW1xyXG4gICAgMzA0LCAvLyBBZXRoZXJmbG93XHJcbiAgICA0MDYsIC8vIFZ1bG5lcmFiaWxpdHkgRG93blxyXG4gICAgMzUwLCAvLyBWdWxuZXJhYmlsaXR5IERvd25cclxuICAgIDcxNCwgLy8gVnVsbmVyYWJpbGl0eSBVcFxyXG4gICAgNTA1LCAvLyBEYW1hZ2UgVXBcclxuICAgIDEyMzksIC8vIEVtYm9sZGVuXHJcbiAgICAxMjk3LCAvLyBFbWJvbGRlblxyXG4gIF0gYXMgY29uc3Q7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQyNiBleHRlbmRzIExpbmVFdmVudDB4MUEge31cclxuIiwiaW1wb3J0IExpbmVFdmVudCwgeyBMaW5lRXZlbnRTb3VyY2UgfSBmcm9tICcuL0xpbmVFdmVudCc7XHJcbmltcG9ydCBMb2dSZXBvc2l0b3J5IGZyb20gJy4vTG9nUmVwb3NpdG9yeSc7XHJcblxyXG5jb25zdCBmaWVsZHMgPSB7XHJcbiAgdGFyZ2V0SWQ6IDIsXHJcbiAgdGFyZ2V0TmFtZTogMyxcclxuICBoZWFkbWFya2VySWQ6IDYsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBIZWFkIG1hcmtlciBldmVudFxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MHgxQiBleHRlbmRzIExpbmVFdmVudCBpbXBsZW1lbnRzIExpbmVFdmVudFNvdXJjZSB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgaGVhZG1hcmtlcklkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlzU291cmNlID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IocmVwbzogTG9nUmVwb3NpdG9yeSwgbGluZTogc3RyaW5nLCBwYXJ0czogc3RyaW5nW10pIHtcclxuICAgIHN1cGVyKHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuXHJcbiAgICB0aGlzLmlkID0gcGFydHNbZmllbGRzLnRhcmdldElkXT8udG9VcHBlckNhc2UoKSA/PyAnJztcclxuICAgIHRoaXMubmFtZSA9IHBhcnRzW2ZpZWxkcy50YXJnZXROYW1lXSA/PyAnJztcclxuICAgIHRoaXMuaGVhZG1hcmtlcklkID0gcGFydHNbZmllbGRzLmhlYWRtYXJrZXJJZF0gPz8gJyc7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MjcgZXh0ZW5kcyBMaW5lRXZlbnQweDFCIHt9XHJcbiIsImltcG9ydCBMaW5lRXZlbnQgZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxuY29uc3QgZmllbGRzID0ge1xyXG4gIG9wZXJhdGlvbjogMixcclxuICB3YXltYXJrOiAzLFxyXG4gIGlkOiA0LFxyXG4gIG5hbWU6IDUsXHJcbiAgeDogNixcclxuICB5OiA3LFxyXG4gIHo6IDgsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBGbG9vciB3YXltYXJrZXIgZXZlbnRcclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDB4MUMgZXh0ZW5kcyBMaW5lRXZlbnQge1xyXG4gIHB1YmxpYyByZWFkb25seSBvcGVyYXRpb246IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgd2F5bWFyazogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHg6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgeTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSB6OiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHJlcG86IExvZ1JlcG9zaXRvcnksIGxpbmU6IHN0cmluZywgcGFydHM6IHN0cmluZ1tdKSB7XHJcbiAgICBzdXBlcihyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcblxyXG4gICAgdGhpcy5vcGVyYXRpb24gPSBwYXJ0c1tmaWVsZHMub3BlcmF0aW9uXSA/PyAnJztcclxuICAgIHRoaXMud2F5bWFyayA9IHBhcnRzW2ZpZWxkcy53YXltYXJrXSA/PyAnJztcclxuICAgIHRoaXMuaWQgPSBwYXJ0c1tmaWVsZHMuaWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnO1xyXG4gICAgdGhpcy5uYW1lID0gcGFydHNbZmllbGRzLm5hbWVdID8/ICcnO1xyXG4gICAgdGhpcy54ID0gcGFydHNbZmllbGRzLnhdID8/ICcnO1xyXG4gICAgdGhpcy55ID0gcGFydHNbZmllbGRzLnldID8/ICcnO1xyXG4gICAgdGhpcy56ID0gcGFydHNbZmllbGRzLnpdID8/ICcnO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDI4IGV4dGVuZHMgTGluZUV2ZW50MHgxQyB7fVxyXG4iLCJpbXBvcnQgTGluZUV2ZW50IGZyb20gJy4vTGluZUV2ZW50JztcclxuaW1wb3J0IExvZ1JlcG9zaXRvcnkgZnJvbSAnLi9Mb2dSZXBvc2l0b3J5JztcclxuXHJcbmNvbnN0IGZpZWxkcyA9IHtcclxuICBvcGVyYXRpb246IDIsXHJcbiAgd2F5bWFyazogMyxcclxuICBpZDogNCxcclxuICBuYW1lOiA1LFxyXG4gIHRhcmdldElkOiA2LFxyXG4gIHRhcmdldE5hbWU6IDcsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBXYXltYXJrZXJcclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDB4MUQgZXh0ZW5kcyBMaW5lRXZlbnQge1xyXG4gIHB1YmxpYyByZWFkb25seSBvcGVyYXRpb246IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgd2F5bWFyazogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldElkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldE5hbWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocmVwbzogTG9nUmVwb3NpdG9yeSwgbGluZTogc3RyaW5nLCBwYXJ0czogc3RyaW5nW10pIHtcclxuICAgIHN1cGVyKHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuXHJcbiAgICB0aGlzLm9wZXJhdGlvbiA9IHBhcnRzW2ZpZWxkcy5vcGVyYXRpb25dID8/ICcnO1xyXG4gICAgdGhpcy53YXltYXJrID0gcGFydHNbZmllbGRzLndheW1hcmtdID8/ICcnO1xyXG4gICAgdGhpcy5pZCA9IHBhcnRzW2ZpZWxkcy5pZF0/LnRvVXBwZXJDYXNlKCkgPz8gJyc7XHJcbiAgICB0aGlzLm5hbWUgPSBwYXJ0c1tmaWVsZHMubmFtZV0gPz8gJyc7XHJcbiAgICB0aGlzLnRhcmdldElkID0gcGFydHNbZmllbGRzLnRhcmdldElkXT8udG9VcHBlckNhc2UoKSA/PyAnJztcclxuICAgIHRoaXMudGFyZ2V0TmFtZSA9IHBhcnRzW2ZpZWxkcy50YXJnZXROYW1lXSA/PyAnJztcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQyOSBleHRlbmRzIExpbmVFdmVudDB4MUQge31cclxuIiwiaW1wb3J0IHsgTGluZUV2ZW50MHgxQSB9IGZyb20gJy4vTGluZUV2ZW50MHgxQSc7XHJcbmltcG9ydCBFbXVsYXRvckNvbW1vbiBmcm9tICcuLi8uLi9FbXVsYXRvckNvbW1vbic7XHJcbmltcG9ydCBMb2dSZXBvc2l0b3J5IGZyb20gJy4vTG9nUmVwb3NpdG9yeSc7XHJcblxyXG4vLyBMb3NlIHN0YXR1cyBlZmZlY3QgZXZlbnRcclxuLy8gRXh0ZW5kIHRoZSBnYWluIHN0YXR1cyBldmVudCB0byByZWR1Y2UgZHVwbGljYXRlIGNvZGUgc2luY2UgdGhleSdyZVxyXG4vLyB0aGUgc2FtZSBmcm9tIGEgZGF0YSBwZXJzcGVjdGl2ZVxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MHgxRSBleHRlbmRzIExpbmVFdmVudDB4MUEge1xyXG4gIHB1YmxpYyByZWFkb25seSBwcm9wZXJDYXNlQ29udmVydGVkTGluZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZXBvOiBMb2dSZXBvc2l0b3J5LCBsaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgc3VwZXIocmVwbywgbGluZSwgcGFydHMpO1xyXG5cclxuICAgIGxldCBzdGFja0NvdW50VGV4dCA9ICcnO1xyXG4gICAgaWYgKHRoaXMuc3RhY2tzID4gMCAmJiB0aGlzLnN0YWNrcyA8IDIwICYmXHJcbiAgICAgIExpbmVFdmVudDB4MUEuc2hvd1N0YWNrQ291bnRGb3IuaW5jbHVkZXModGhpcy5hYmlsaXR5SWQpKVxyXG4gICAgICBzdGFja0NvdW50VGV4dCA9ICcgKCcgKyB0aGlzLnN0YWNrcy50b1N0cmluZygpICsgJyknO1xyXG5cclxuICAgIHRoaXMuY29udmVydGVkTGluZSA9IHRoaXMucHJlZml4KCkgKyB0aGlzLnRhcmdldElkICtcclxuICAgICAgJzonICsgdGhpcy50YXJnZXROYW1lICtcclxuICAgICAgJyBsb3NlcyB0aGUgZWZmZWN0IG9mICcgKyB0aGlzLmFiaWxpdHlOYW1lICtcclxuICAgICAgJyBmcm9tICcgKyB0aGlzLmZhbGxiYWNrUmVzb2x2ZWRUYXJnZXROYW1lICtcclxuICAgICAgJyBmb3IgJyArIHRoaXMuZHVyYXRpb25TdHJpbmcgKyAnIFNlY29uZHMuJyArIHN0YWNrQ291bnRUZXh0O1xyXG5cclxuICAgIHRoaXMucHJvcGVyQ2FzZUNvbnZlcnRlZExpbmUgPSB0aGlzLnByZWZpeCgpICsgdGhpcy50YXJnZXRJZCArXHJcbiAgICAgICc6JyArIEVtdWxhdG9yQ29tbW9uLnByb3BlckNhc2UodGhpcy50YXJnZXROYW1lKSArXHJcbiAgICAgICcgbG9zZXMgdGhlIGVmZmVjdCBvZiAnICsgdGhpcy5hYmlsaXR5TmFtZSArXHJcbiAgICAgICcgZnJvbSAnICsgRW11bGF0b3JDb21tb24ucHJvcGVyQ2FzZSh0aGlzLmZhbGxiYWNrUmVzb2x2ZWRUYXJnZXROYW1lKSArXHJcbiAgICAgICcgZm9yICcgKyB0aGlzLmR1cmF0aW9uU3RyaW5nICsgJyBTZWNvbmRzLicgKyBzdGFja0NvdW50VGV4dDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQzMCBleHRlbmRzIExpbmVFdmVudDB4MUUgeyB9XHJcbiIsImltcG9ydCBMaW5lRXZlbnQgZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgRW11bGF0b3JDb21tb24gZnJvbSAnLi4vLi4vRW11bGF0b3JDb21tb24nO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxuY29uc3Qgc3BsaXRGdW5jID0gKHM6IHN0cmluZykgPT4gW1xyXG4gIHMuc3Vic3RyKDYsIDIpLFxyXG4gIHMuc3Vic3RyKDQsIDIpLFxyXG4gIHMuc3Vic3RyKDIsIDIpLFxyXG4gIHMuc3Vic3RyKDAsIDIpLFxyXG5dO1xyXG5cclxuY29uc3QgZmllbGRzID0ge1xyXG4gIGlkOiAyLFxyXG4gIGRhdGFCeXRlczE6IDMsXHJcbiAgZGF0YUJ5dGVzMjogNCxcclxuICBkYXRhQnl0ZXMzOiA1LFxyXG4gIGRhdGFCeXRlczQ6IDYsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBKb2IgZ2F1Z2UgZXZlbnRcclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDB4MUYgZXh0ZW5kcyBMaW5lRXZlbnQge1xyXG4gIHB1YmxpYyByZWFkb25seSBqb2JHYXVnZUJ5dGVzOiBzdHJpbmdbXTtcclxuICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBwcm9wZXJDYXNlQ29udmVydGVkTGluZTogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgaWQ6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgZGF0YUJ5dGVzMTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBkYXRhQnl0ZXMyOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGRhdGFCeXRlczM6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgZGF0YUJ5dGVzNDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZXBvOiBMb2dSZXBvc2l0b3J5LCBsaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgc3VwZXIocmVwbywgbGluZSwgcGFydHMpO1xyXG5cclxuICAgIHRoaXMuaWQgPSBwYXJ0c1tmaWVsZHMuaWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnO1xyXG4gICAgdGhpcy5kYXRhQnl0ZXMxID0gRW11bGF0b3JDb21tb24uemVyb1BhZChwYXJ0c1tmaWVsZHMuZGF0YUJ5dGVzMV0gPz8gJycpO1xyXG4gICAgdGhpcy5kYXRhQnl0ZXMyID0gRW11bGF0b3JDb21tb24uemVyb1BhZChwYXJ0c1tmaWVsZHMuZGF0YUJ5dGVzMl0gPz8gJycpO1xyXG4gICAgdGhpcy5kYXRhQnl0ZXMzID0gRW11bGF0b3JDb21tb24uemVyb1BhZChwYXJ0c1tmaWVsZHMuZGF0YUJ5dGVzM10gPz8gJycpO1xyXG4gICAgdGhpcy5kYXRhQnl0ZXM0ID0gRW11bGF0b3JDb21tb24uemVyb1BhZChwYXJ0c1tmaWVsZHMuZGF0YUJ5dGVzNF0gPz8gJycpO1xyXG5cclxuICAgIHRoaXMuam9iR2F1Z2VCeXRlcyA9IFtcclxuICAgICAgLi4uc3BsaXRGdW5jKHRoaXMuZGF0YUJ5dGVzMSksXHJcbiAgICAgIC4uLnNwbGl0RnVuYyh0aGlzLmRhdGFCeXRlczIpLFxyXG4gICAgICAuLi5zcGxpdEZ1bmModGhpcy5kYXRhQnl0ZXMzKSxcclxuICAgICAgLi4uc3BsaXRGdW5jKHRoaXMuZGF0YUJ5dGVzNCksXHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMubmFtZSA9IHJlcG8uQ29tYmF0YW50c1t0aGlzLmlkXT8ubmFtZSB8fCAnJztcclxuXHJcbiAgICByZXBvLnVwZGF0ZUNvbWJhdGFudCh0aGlzLmlkLCB7XHJcbiAgICAgIG5hbWU6IHJlcG8uQ29tYmF0YW50c1t0aGlzLmlkXT8ubmFtZSxcclxuICAgICAgc3Bhd246IHRoaXMudGltZXN0YW1wLFxyXG4gICAgICBkZXNwYXduOiB0aGlzLnRpbWVzdGFtcCxcclxuICAgICAgam9iOiB0aGlzLmpvYkdhdWdlQnl0ZXNbMF0/LnRvVXBwZXJDYXNlKCksXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmNvbnZlcnRlZExpbmUgPSB0aGlzLnByZWZpeCgpICtcclxuICAgICAgdGhpcy5pZCArICc6JyArIHRoaXMubmFtZSArXHJcbiAgICAgICc6JyArIHRoaXMuZGF0YUJ5dGVzMSArXHJcbiAgICAgICc6JyArIHRoaXMuZGF0YUJ5dGVzMiArXHJcbiAgICAgICc6JyArIHRoaXMuZGF0YUJ5dGVzMyArXHJcbiAgICAgICc6JyArIHRoaXMuZGF0YUJ5dGVzNDtcclxuICAgIHRoaXMucHJvcGVyQ2FzZUNvbnZlcnRlZExpbmUgPSB0aGlzLnByZWZpeCgpICtcclxuICAgICAgdGhpcy5pZCArICc6JyArIChFbXVsYXRvckNvbW1vbi5wcm9wZXJDYXNlKHRoaXMubmFtZSkpICtcclxuICAgICAgJzonICsgdGhpcy5kYXRhQnl0ZXMxICtcclxuICAgICAgJzonICsgdGhpcy5kYXRhQnl0ZXMyICtcclxuICAgICAgJzonICsgdGhpcy5kYXRhQnl0ZXMzICtcclxuICAgICAgJzonICsgdGhpcy5kYXRhQnl0ZXM0O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDMxIGV4dGVuZHMgTGluZUV2ZW50MHgxRiB7fVxyXG4iLCJpbXBvcnQgTGluZUV2ZW50LCB7IExpbmVFdmVudFNvdXJjZSB9IGZyb20gJy4vTGluZUV2ZW50JztcclxuaW1wb3J0IExvZ1JlcG9zaXRvcnkgZnJvbSAnLi9Mb2dSZXBvc2l0b3J5JztcclxuXHJcbmNvbnN0IGZpZWxkcyA9IHtcclxuICBpZDogMixcclxuICBuYW1lOiAzLFxyXG4gIHRhcmdldElkOiA0LFxyXG4gIHRhcmdldE5hbWU6IDUsXHJcbiAgdGFyZ2V0YWJsZTogNixcclxufSBhcyBjb25zdDtcclxuXHJcbi8vIE5hbWVwbGF0ZSB0b2dnbGVcclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDB4MjIgZXh0ZW5kcyBMaW5lRXZlbnQgaW1wbGVtZW50cyBMaW5lRXZlbnRTb3VyY2Uge1xyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldElkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldE5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0YWJsZTogYm9vbGVhbjtcclxuICBwdWJsaWMgcmVhZG9ubHkgaXNTb3VyY2UgPSB0cnVlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihyZXBvOiBMb2dSZXBvc2l0b3J5LCBsaW5lOiBzdHJpbmcsIHBhcnRzOiBzdHJpbmdbXSkge1xyXG4gICAgc3VwZXIocmVwbywgbGluZSwgcGFydHMpO1xyXG5cclxuICAgIHRoaXMuaWQgPSBwYXJ0c1tmaWVsZHMuaWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnO1xyXG4gICAgdGhpcy5uYW1lID0gcGFydHNbZmllbGRzLm5hbWVdID8/ICcnO1xyXG4gICAgdGhpcy50YXJnZXRJZCA9IHBhcnRzW2ZpZWxkcy50YXJnZXRJZF0/LnRvVXBwZXJDYXNlKCkgPz8gJyc7XHJcbiAgICB0aGlzLnRhcmdldE5hbWUgPSBwYXJ0c1tmaWVsZHMudGFyZ2V0TmFtZV0gPz8gJyc7XHJcbiAgICB0aGlzLnRhcmdldGFibGUgPSAhIXBhcnNlSW50KHBhcnRzW2ZpZWxkcy50YXJnZXRhYmxlXSA/PyAnJywgMTYpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDM0IGV4dGVuZHMgTGluZUV2ZW50MHgyMiB7fVxyXG4iLCJpbXBvcnQgTGluZUV2ZW50IGZyb20gJy4vTGluZUV2ZW50JztcclxuaW1wb3J0IExvZ1JlcG9zaXRvcnkgZnJvbSAnLi9Mb2dSZXBvc2l0b3J5JztcclxuXHJcbmNvbnN0IGZpZWxkcyA9IHtcclxuICBpZDogMixcclxuICBuYW1lOiAzLFxyXG4gIHRhcmdldElkOiA0LFxyXG4gIHRhcmdldE5hbWU6IDUsXHJcbiAgdGV0aGVySWQ6IDgsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBUZXRoZXIgZXZlbnRcclxuZXhwb3J0IGNsYXNzIExpbmVFdmVudDB4MjMgZXh0ZW5kcyBMaW5lRXZlbnQge1xyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldElkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldE5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgdGV0aGVySWQ6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocmVwbzogTG9nUmVwb3NpdG9yeSwgbGluZTogc3RyaW5nLCBwYXJ0czogc3RyaW5nW10pIHtcclxuICAgIHN1cGVyKHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuXHJcbiAgICB0aGlzLmlkID0gcGFydHNbZmllbGRzLmlkXT8udG9VcHBlckNhc2UoKSA/PyAnJztcclxuICAgIHRoaXMubmFtZSA9IHBhcnRzW2ZpZWxkcy5uYW1lXSA/PyAnJztcclxuICAgIHRoaXMudGFyZ2V0SWQgPSBwYXJ0c1tmaWVsZHMudGFyZ2V0SWRdPy50b1VwcGVyQ2FzZSgpID8/ICcnO1xyXG4gICAgdGhpcy50YXJnZXROYW1lID0gcGFydHNbZmllbGRzLnRhcmdldE5hbWVdID8/ICcnO1xyXG4gICAgdGhpcy50ZXRoZXJJZCA9IHBhcnRzW2ZpZWxkcy50ZXRoZXJJZF0gPz8gJyc7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MzUgZXh0ZW5kcyBMaW5lRXZlbnQweDIzIHt9XHJcbiIsImltcG9ydCBMaW5lRXZlbnQgZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxuY29uc3QgZmllbGRzID0ge1xyXG4gIHZhbHVlSGV4OiAyLFxyXG4gIGJhcnM6IDMsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBMaW1pdCBnYXVnZSBldmVudFxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MHgyNCBleHRlbmRzIExpbmVFdmVudCB7XHJcbiAgcHVibGljIHJlYWRvbmx5IHZhbHVlSGV4OiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHZhbHVlRGVjOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IGJhcnM6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocmVwbzogTG9nUmVwb3NpdG9yeSwgbGluZTogc3RyaW5nLCBwYXJ0czogc3RyaW5nW10pIHtcclxuICAgIHN1cGVyKHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuXHJcbiAgICB0aGlzLnZhbHVlSGV4ID0gcGFydHNbZmllbGRzLnZhbHVlSGV4XSA/PyAnJztcclxuICAgIHRoaXMudmFsdWVEZWMgPSBwYXJzZUludCh0aGlzLnZhbHVlSGV4LCAxNik7XHJcbiAgICB0aGlzLmJhcnMgPSBwYXJ0c1tmaWVsZHMuYmFyc10gPz8gJyc7XHJcblxyXG4gICAgdGhpcy5jb252ZXJ0ZWRMaW5lID0gdGhpcy5wcmVmaXgoKSArICdMaW1pdCBCcmVhazogJyArIHRoaXMudmFsdWVIZXg7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MzYgZXh0ZW5kcyBMaW5lRXZlbnQweDI0IHt9XHJcbiIsImltcG9ydCBMaW5lRXZlbnQsIHsgTGluZUV2ZW50U291cmNlIH0gZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxuY29uc3QgZmllbGRzID0ge1xyXG4gIGlkOiAyLFxyXG4gIG5hbWU6IDMsXHJcbiAgc2VxdWVuY2VJZDogNCxcclxuICBjdXJyZW50SHA6IDUsXHJcbiAgbWF4SHA6IDYsXHJcbiAgY3VycmVudE1wOiA3LFxyXG4gIG1heE1wOiA4LFxyXG4gIGN1cnJlbnRUcDogOSxcclxuICBtYXhUcDogMTAsXHJcbiAgeDogMTEsXHJcbiAgeTogMTIsXHJcbiAgejogMTMsXHJcbiAgaGVhZGluZzogMTQsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBBY3Rpb24gc3luYyBldmVudFxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MHgyNSBleHRlbmRzIExpbmVFdmVudCBpbXBsZW1lbnRzIExpbmVFdmVudFNvdXJjZSB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgc2VxdWVuY2VJZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBocDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBtYXhIcDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBtcDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBtYXhNcDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSB0cDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBtYXhUcDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSB4OiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHk6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgejogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBoZWFkaW5nOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlzU291cmNlID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IocmVwbzogTG9nUmVwb3NpdG9yeSwgbGluZTogc3RyaW5nLCBwYXJ0czogc3RyaW5nW10pIHtcclxuICAgIHN1cGVyKHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuXHJcbiAgICB0aGlzLmlkID0gcGFydHNbZmllbGRzLmlkXT8udG9VcHBlckNhc2UoKSA/PyAnJztcclxuICAgIHRoaXMubmFtZSA9IHBhcnRzW2ZpZWxkcy5uYW1lXSA/PyAnJztcclxuICAgIHRoaXMuc2VxdWVuY2VJZCA9IHBhcnRzW2ZpZWxkcy5zZXF1ZW5jZUlkXSA/PyAnJztcclxuICAgIHRoaXMuaHAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMuY3VycmVudEhwXSA/PyAnJyk7XHJcbiAgICB0aGlzLm1heEhwID0gcGFyc2VJbnQocGFydHNbZmllbGRzLm1heEhwXSA/PyAnJyk7XHJcbiAgICB0aGlzLm1wID0gcGFyc2VJbnQocGFydHNbZmllbGRzLmN1cnJlbnRNcF0gPz8gJycpO1xyXG4gICAgdGhpcy5tYXhNcCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5tYXhNcF0gPz8gJycpO1xyXG4gICAgdGhpcy50cCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5jdXJyZW50VHBdID8/ICcnKTtcclxuICAgIHRoaXMubWF4VHAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMubWF4VHBdID8/ICcnKTtcclxuICAgIHRoaXMueCA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLnhdID8/ICcnKTtcclxuICAgIHRoaXMueSA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLnldID8/ICcnKTtcclxuICAgIHRoaXMueiA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLnpdID8/ICcnKTtcclxuICAgIHRoaXMuaGVhZGluZyA9IHBhcnNlRmxvYXQocGFydHNbZmllbGRzLmhlYWRpbmddID8/ICcnKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQzNyBleHRlbmRzIExpbmVFdmVudDB4MjUge31cclxuIiwiaW1wb3J0IExpbmVFdmVudCwgeyBMaW5lRXZlbnRKb2JMZXZlbCwgTGluZUV2ZW50U291cmNlIH0gZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgRW11bGF0b3JDb21tb24gZnJvbSAnLi4vLi4vRW11bGF0b3JDb21tb24nO1xyXG5pbXBvcnQgVXRpbCBmcm9tICcuLi8uLi8uLi8uLi8uLi9yZXNvdXJjZXMvdXRpbCc7XHJcbmltcG9ydCBMb2dSZXBvc2l0b3J5IGZyb20gJy4vTG9nUmVwb3NpdG9yeSc7XHJcbmltcG9ydCB7IEpvYiB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL2pvYic7XHJcblxyXG5jb25zdCBmaWVsZHMgPSB7XHJcbiAgaWQ6IDIsXHJcbiAgbmFtZTogMyxcclxuICBqb2JMZXZlbERhdGE6IDQsXHJcbiAgY3VycmVudEhwOiA1LFxyXG4gIG1heEhwOiA2LFxyXG4gIGN1cnJlbnRNcDogNyxcclxuICBtYXhNcDogOCxcclxuICBjdXJyZW50VHA6IDksXHJcbiAgbWF4VHA6IDEwLFxyXG4gIHg6IDExLFxyXG4gIHk6IDEyLFxyXG4gIHo6IDEzLFxyXG4gIGhlYWRpbmc6IDE0LFxyXG59IGFzIGNvbnN0O1xyXG5cclxuLy8gTmV0d29yayBzdGF0dXMgZWZmZWN0IGV2ZW50XHJcbmV4cG9ydCBjbGFzcyBMaW5lRXZlbnQweDI2IGV4dGVuZHMgTGluZUV2ZW50IGltcGxlbWVudHMgTGluZUV2ZW50U291cmNlLCBMaW5lRXZlbnRKb2JMZXZlbCB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGpvYklkSGV4OiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGpvYklkOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IGpvYjogSm9iO1xyXG4gIHB1YmxpYyByZWFkb25seSBsZXZlbDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGpvYkxldmVsRGF0YTogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBocDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBtYXhIcDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBtcDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBtYXhNcDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSB0cDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBtYXhUcDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSB4OiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHk6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgejogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBoZWFkaW5nOiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlzU291cmNlID0gdHJ1ZTtcclxuICBwdWJsaWMgcmVhZG9ubHkgaXNKb2JMZXZlbCA9IHRydWU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHJlcG86IExvZ1JlcG9zaXRvcnksIGxpbmU6IHN0cmluZywgcGFydHM6IHN0cmluZ1tdKSB7XHJcbiAgICBzdXBlcihyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcblxyXG4gICAgdGhpcy5pZCA9IHBhcnRzW2ZpZWxkcy5pZF0/LnRvVXBwZXJDYXNlKCkgPz8gJyc7XHJcbiAgICB0aGlzLm5hbWUgPSBwYXJ0c1tmaWVsZHMubmFtZV0gPz8gJyc7XHJcblxyXG4gICAgdGhpcy5qb2JMZXZlbERhdGEgPSBwYXJ0c1tmaWVsZHMuam9iTGV2ZWxEYXRhXSA/PyAnJztcclxuXHJcbiAgICB0aGlzLmhwID0gcGFyc2VJbnQocGFydHNbZmllbGRzLmN1cnJlbnRIcF0gPz8gJycpO1xyXG4gICAgdGhpcy5tYXhIcCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5tYXhIcF0gPz8gJycpO1xyXG4gICAgdGhpcy5tcCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5jdXJyZW50TXBdID8/ICcnKTtcclxuICAgIHRoaXMubWF4TXAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMubWF4TXBdID8/ICcnKTtcclxuICAgIHRoaXMudHAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMuY3VycmVudFRwXSA/PyAnJyk7XHJcbiAgICB0aGlzLm1heFRwID0gcGFyc2VJbnQocGFydHNbZmllbGRzLm1heFRwXSA/PyAnJyk7XHJcbiAgICB0aGlzLnggPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy54XSA/PyAnJyk7XHJcbiAgICB0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy55XSA/PyAnJyk7XHJcbiAgICB0aGlzLnogPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy56XSA/PyAnJyk7XHJcbiAgICB0aGlzLmhlYWRpbmcgPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy5oZWFkaW5nXSA/PyAnJyk7XHJcblxyXG4gICAgY29uc3QgcGFkZGVkID0gRW11bGF0b3JDb21tb24uemVyb1BhZCh0aGlzLmpvYkxldmVsRGF0YSwgOCk7XHJcblxyXG4gICAgdGhpcy5qb2JJZEhleCA9IHBhZGRlZC5zdWJzdHIoNiwgMikudG9VcHBlckNhc2UoKTtcclxuICAgIHRoaXMuam9iSWQgPSBwYXJzZUludCh0aGlzLmpvYklkSGV4LCAxNik7XHJcbiAgICB0aGlzLmpvYiA9IFV0aWwuam9iRW51bVRvSm9iKHRoaXMuam9iSWQpO1xyXG5cclxuICAgIHRoaXMubGV2ZWwgPSBwYXJzZUludChwYWRkZWQuc3Vic3RyKDQsIDIpLCAxNik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MzggZXh0ZW5kcyBMaW5lRXZlbnQweDI2IHt9XHJcbiIsImltcG9ydCBMaW5lRXZlbnQsIHsgTGluZUV2ZW50U291cmNlIH0gZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxuY29uc3QgZmllbGRzID0ge1xyXG4gIGlkOiAyLFxyXG4gIG5hbWU6IDMsXHJcbiAgY3VycmVudEhwOiA0LFxyXG4gIG1heEhwOiA1LFxyXG4gIGN1cnJlbnRNcDogNixcclxuICBtYXhNcDogNyxcclxuICBjdXJyZW50VHA6IDgsXHJcbiAgbWF4VHA6IDksXHJcbiAgeDogMTAsXHJcbiAgeTogMTEsXHJcbiAgejogMTIsXHJcbiAgaGVhZGluZzogMTMsXHJcbn0gYXMgY29uc3Q7XHJcblxyXG4vLyBOZXR3b3JrIHVwZGF0ZSBocCBldmVudFxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MHgyNyBleHRlbmRzIExpbmVFdmVudCBpbXBsZW1lbnRzIExpbmVFdmVudFNvdXJjZSB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGlkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgaHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbWF4SHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbXA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbWF4TXA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgdHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbWF4VHA6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgeDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSB5OiBudW1iZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IHo6IG51bWJlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgaGVhZGluZzogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBpc1NvdXJjZSA9IHRydWU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHJlcG86IExvZ1JlcG9zaXRvcnksIGxpbmU6IHN0cmluZywgcGFydHM6IHN0cmluZ1tdKSB7XHJcbiAgICBzdXBlcihyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcblxyXG4gICAgdGhpcy5pZCA9IHBhcnRzW2ZpZWxkcy5pZF0/LnRvVXBwZXJDYXNlKCkgPz8gJyc7XHJcbiAgICB0aGlzLm5hbWUgPSBwYXJ0c1tmaWVsZHMubmFtZV0gPz8gJyc7XHJcbiAgICB0aGlzLmhwID0gcGFyc2VJbnQocGFydHNbZmllbGRzLmN1cnJlbnRIcF0gPz8gJycpO1xyXG4gICAgdGhpcy5tYXhIcCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5tYXhIcF0gPz8gJycpO1xyXG4gICAgdGhpcy5tcCA9IHBhcnNlSW50KHBhcnRzW2ZpZWxkcy5jdXJyZW50TXBdID8/ICcnKTtcclxuICAgIHRoaXMubWF4TXAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMubWF4TXBdID8/ICcnKTtcclxuICAgIHRoaXMudHAgPSBwYXJzZUludChwYXJ0c1tmaWVsZHMuY3VycmVudFRwXSA/PyAnJyk7XHJcbiAgICB0aGlzLm1heFRwID0gcGFyc2VJbnQocGFydHNbZmllbGRzLm1heFRwXSA/PyAnJyk7XHJcbiAgICB0aGlzLnggPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy54XSA/PyAnJyk7XHJcbiAgICB0aGlzLnkgPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy55XSA/PyAnJyk7XHJcbiAgICB0aGlzLnogPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy56XSA/PyAnJyk7XHJcbiAgICB0aGlzLmhlYWRpbmcgPSBwYXJzZUZsb2F0KHBhcnRzW2ZpZWxkcy5oZWFkaW5nXSA/PyAnJyk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZUV2ZW50MzkgZXh0ZW5kcyBMaW5lRXZlbnQweDI3IHt9XHJcbiIsImltcG9ydCBMaW5lRXZlbnQgZnJvbSAnLi9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgeyBMaW5lRXZlbnQwMCB9IGZyb20gJy4vTGluZUV2ZW50MHgwMCc7XHJcbmltcG9ydCB7IExpbmVFdmVudDAxIH0gZnJvbSAnLi9MaW5lRXZlbnQweDAxJztcclxuaW1wb3J0IHsgTGluZUV2ZW50MDIgfSBmcm9tICcuL0xpbmVFdmVudDB4MDInO1xyXG5pbXBvcnQgeyBMaW5lRXZlbnQwMyB9IGZyb20gJy4vTGluZUV2ZW50MHgwMyc7XHJcbmltcG9ydCB7IExpbmVFdmVudDA0IH0gZnJvbSAnLi9MaW5lRXZlbnQweDA0JztcclxuaW1wb3J0IHsgTGluZUV2ZW50MTIgfSBmcm9tICcuL0xpbmVFdmVudDB4MEMnO1xyXG5pbXBvcnQgeyBMaW5lRXZlbnQyMCB9IGZyb20gJy4vTGluZUV2ZW50MHgxNCc7XHJcbmltcG9ydCB7IExpbmVFdmVudDIxIH0gZnJvbSAnLi9MaW5lRXZlbnQweDE1JztcclxuaW1wb3J0IHsgTGluZUV2ZW50MjIgfSBmcm9tICcuL0xpbmVFdmVudDB4MTYnO1xyXG5pbXBvcnQgeyBMaW5lRXZlbnQyMyB9IGZyb20gJy4vTGluZUV2ZW50MHgxNyc7XHJcbmltcG9ydCB7IExpbmVFdmVudDI0IH0gZnJvbSAnLi9MaW5lRXZlbnQweDE4JztcclxuaW1wb3J0IHsgTGluZUV2ZW50MjUgfSBmcm9tICcuL0xpbmVFdmVudDB4MTknO1xyXG5pbXBvcnQgeyBMaW5lRXZlbnQyNiB9IGZyb20gJy4vTGluZUV2ZW50MHgxQSc7XHJcbmltcG9ydCB7IExpbmVFdmVudDI3IH0gZnJvbSAnLi9MaW5lRXZlbnQweDFCJztcclxuaW1wb3J0IHsgTGluZUV2ZW50MjggfSBmcm9tICcuL0xpbmVFdmVudDB4MUMnO1xyXG5pbXBvcnQgeyBMaW5lRXZlbnQyOSB9IGZyb20gJy4vTGluZUV2ZW50MHgxRCc7XHJcbmltcG9ydCB7IExpbmVFdmVudDMwIH0gZnJvbSAnLi9MaW5lRXZlbnQweDFFJztcclxuaW1wb3J0IHsgTGluZUV2ZW50MzEgfSBmcm9tICcuL0xpbmVFdmVudDB4MUYnO1xyXG5pbXBvcnQgeyBMaW5lRXZlbnQzNCB9IGZyb20gJy4vTGluZUV2ZW50MHgyMic7XHJcbmltcG9ydCB7IExpbmVFdmVudDM1IH0gZnJvbSAnLi9MaW5lRXZlbnQweDIzJztcclxuaW1wb3J0IHsgTGluZUV2ZW50MzYgfSBmcm9tICcuL0xpbmVFdmVudDB4MjQnO1xyXG5pbXBvcnQgeyBMaW5lRXZlbnQzNyB9IGZyb20gJy4vTGluZUV2ZW50MHgyNSc7XHJcbmltcG9ydCB7IExpbmVFdmVudDM4IH0gZnJvbSAnLi9MaW5lRXZlbnQweDI2JztcclxuaW1wb3J0IHsgTGluZUV2ZW50MzkgfSBmcm9tICcuL0xpbmVFdmVudDB4MjcnO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VMaW5lIHtcclxuICBzdGF0aWMgcGFyc2UocmVwbzogTG9nUmVwb3NpdG9yeSwgbGluZTogc3RyaW5nKTogTGluZUV2ZW50IHwgdW5kZWZpbmVkIHtcclxuICAgIGxldCByZXQ7XHJcblxyXG4gICAgY29uc3QgcGFydHMgPSBsaW5lLnNwbGl0KCd8Jyk7XHJcbiAgICBjb25zdCBldmVudCA9IHBhcnRzWzBdO1xyXG5cclxuICAgIC8vIERvbid0IHBhcnNlIHJhdyBuZXR3b3JrIHBhY2tldCBsaW5lc1xyXG4gICAgaWYgKCFldmVudCB8fCBldmVudCA9PT0gJzI1MicpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICAvLyBUaGlzIGlzIHVnbHksIGJ1dCBXZWJwYWNrIHByZWZlcnMgYmVpbmcgZXhwbGljaXRcclxuICAgIHN3aXRjaCAoJ0xpbmVFdmVudCcgKyBldmVudCkge1xyXG4gICAgY2FzZSAnTGluZUV2ZW50MDAnOlxyXG4gICAgICByZXQgPSBuZXcgTGluZUV2ZW50MDAocmVwbywgbGluZSwgcGFydHMpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ0xpbmVFdmVudDAxJzpcclxuICAgICAgcmV0ID0gbmV3IExpbmVFdmVudDAxKHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdMaW5lRXZlbnQwMic6XHJcbiAgICAgIHJldCA9IG5ldyBMaW5lRXZlbnQwMihyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnTGluZUV2ZW50MDMnOlxyXG4gICAgICByZXQgPSBuZXcgTGluZUV2ZW50MDMocmVwbywgbGluZSwgcGFydHMpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ0xpbmVFdmVudDA0JzpcclxuICAgICAgcmV0ID0gbmV3IExpbmVFdmVudDA0KHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdMaW5lRXZlbnQxMic6XHJcbiAgICAgIHJldCA9IG5ldyBMaW5lRXZlbnQxMihyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnTGluZUV2ZW50MjAnOlxyXG4gICAgICByZXQgPSBuZXcgTGluZUV2ZW50MjAocmVwbywgbGluZSwgcGFydHMpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ0xpbmVFdmVudDIxJzpcclxuICAgICAgcmV0ID0gbmV3IExpbmVFdmVudDIxKHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdMaW5lRXZlbnQyMic6XHJcbiAgICAgIHJldCA9IG5ldyBMaW5lRXZlbnQyMihyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnTGluZUV2ZW50MjMnOlxyXG4gICAgICByZXQgPSBuZXcgTGluZUV2ZW50MjMocmVwbywgbGluZSwgcGFydHMpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ0xpbmVFdmVudDI0JzpcclxuICAgICAgcmV0ID0gbmV3IExpbmVFdmVudDI0KHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdMaW5lRXZlbnQyNSc6XHJcbiAgICAgIHJldCA9IG5ldyBMaW5lRXZlbnQyNShyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnTGluZUV2ZW50MjYnOlxyXG4gICAgICByZXQgPSBuZXcgTGluZUV2ZW50MjYocmVwbywgbGluZSwgcGFydHMpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ0xpbmVFdmVudDI3JzpcclxuICAgICAgcmV0ID0gbmV3IExpbmVFdmVudDI3KHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdMaW5lRXZlbnQyOCc6XHJcbiAgICAgIHJldCA9IG5ldyBMaW5lRXZlbnQyOChyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnTGluZUV2ZW50MjknOlxyXG4gICAgICByZXQgPSBuZXcgTGluZUV2ZW50MjkocmVwbywgbGluZSwgcGFydHMpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ0xpbmVFdmVudDMwJzpcclxuICAgICAgcmV0ID0gbmV3IExpbmVFdmVudDMwKHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdMaW5lRXZlbnQzMSc6XHJcbiAgICAgIHJldCA9IG5ldyBMaW5lRXZlbnQzMShyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnTGluZUV2ZW50MzQnOlxyXG4gICAgICByZXQgPSBuZXcgTGluZUV2ZW50MzQocmVwbywgbGluZSwgcGFydHMpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ0xpbmVFdmVudDM1JzpcclxuICAgICAgcmV0ID0gbmV3IExpbmVFdmVudDM1KHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdMaW5lRXZlbnQzNic6XHJcbiAgICAgIHJldCA9IG5ldyBMaW5lRXZlbnQzNihyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnTGluZUV2ZW50MzcnOlxyXG4gICAgICByZXQgPSBuZXcgTGluZUV2ZW50MzcocmVwbywgbGluZSwgcGFydHMpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ0xpbmVFdmVudDM4JzpcclxuICAgICAgcmV0ID0gbmV3IExpbmVFdmVudDM4KHJlcG8sIGxpbmUsIHBhcnRzKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdMaW5lRXZlbnQzOSc6XHJcbiAgICAgIHJldCA9IG5ldyBMaW5lRXZlbnQzOShyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0ID0gbmV3IExpbmVFdmVudChyZXBvLCBsaW5lLCBwYXJ0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWxzbyBkb24ndCBwYXJzZSBsaW5lcyB3aXRoIGEgbm9uLXNhbmUgZGF0ZS4gVGhpcyBpcyAyMDAwLTAxLTAxIDAwOjAwOjAwXHJcbiAgICBpZiAocmV0ICYmIHJldC50aW1lc3RhbXAgPCA5NDY2ODQ4MDApXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICAvLyBGaW5hbGx5LCBpZiB0aGUgb2JqZWN0IG1hcmtzIGl0c2VsZiBhcyBpbnZhbGlkLCBza2lwIGl0XHJcbiAgICBpZiAocmV0ICYmIHJldC5pbnZhbGlkKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgcmV0dXJuIHJldDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4uL0V2ZW50QnVzJztcclxuaW1wb3J0IExpbmVFdmVudCBmcm9tICcuL25ldHdvcmtfbG9nX2NvbnZlcnRlci9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgTG9nUmVwb3NpdG9yeSBmcm9tICcuL25ldHdvcmtfbG9nX2NvbnZlcnRlci9Mb2dSZXBvc2l0b3J5JztcclxuaW1wb3J0IFBhcnNlTGluZSBmcm9tICcuL25ldHdvcmtfbG9nX2NvbnZlcnRlci9QYXJzZUxpbmUnO1xyXG5cclxuY29uc3QgaXNMaW5lRXZlbnQgPSAobGluZT86IExpbmVFdmVudCk6IGxpbmUgaXMgTGluZUV2ZW50ID0+IHtcclxuICByZXR1cm4gISFsaW5lO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmV0d29ya0xvZ0NvbnZlcnRlciBleHRlbmRzIEV2ZW50QnVzIHtcclxuICBjb252ZXJ0RmlsZShkYXRhOiBzdHJpbmcpOiBMaW5lRXZlbnRbXSB7XHJcbiAgICBjb25zdCByZXBvID0gbmV3IExvZ1JlcG9zaXRvcnkoKTtcclxuICAgIHJldHVybiB0aGlzLmNvbnZlcnRMaW5lcyhcclxuICAgICAgICAvLyBTcGxpdCBkYXRhIGludG8gYW4gYXJyYXkgb2Ygc2VwYXJhdGUgbGluZXMsIHJlbW92aW5nIGFueSBibGFuayBsaW5lcy5cclxuICAgICAgICBkYXRhLnNwbGl0KE5ldHdvcmtMb2dDb252ZXJ0ZXIubGluZVNwbGl0UmVnZXgpLmZpbHRlcigobCkgPT4gbCAhPT0gJycpLFxyXG4gICAgICAgIHJlcG8sXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29udmVydExpbmVzKGxpbmVzOiBzdHJpbmdbXSwgcmVwbzogTG9nUmVwb3NpdG9yeSk6IExpbmVFdmVudFtdIHtcclxuICAgIGxldCBsaW5lRXZlbnRzID0gbGluZXMubWFwKChsKSA9PiBQYXJzZUxpbmUucGFyc2UocmVwbywgbCkpLmZpbHRlcihpc0xpbmVFdmVudCk7XHJcbiAgICAvLyBDYWxsIGBjb252ZXJ0YCB0byBjb252ZXJ0IHRoZSBuZXR3b3JrIGxpbmUgdG8gbm9uLW5ldHdvcmsgZm9ybWF0IGFuZCB1cGRhdGUgaW5kZXhpbmcgdmFsdWVzXHJcbiAgICBsaW5lRXZlbnRzID0gbGluZUV2ZW50cy5tYXAoKGwsIGkpID0+IHtcclxuICAgICAgbC5pbmRleCA9IGk7XHJcbiAgICAgIHJldHVybiBsO1xyXG4gICAgfSk7XHJcbiAgICAvLyBTb3J0IHRoZSBsaW5lcyBiYXNlZCBvbiBgJHt0aW1lc3RhbXB9XyR7aW5kZXh9YCB0byBoYW5kbGUgb3V0LW9mLW9yZGVyIGxpbmVzIHByb3Blcmx5XHJcbiAgICAvLyBAVE9ETzogUmVtb3ZlIHRoaXMgb25jZSB1bmRlcmx5aW5nIENvbWJhdGFudFRyYWNrZXIgdXBkYXRlIGlzc3VlcyBhcmUgcmVzb2x2ZWRcclxuICAgIHJldHVybiBsaW5lRXZlbnRzLnNvcnQoKGwsIHIpID0+IChgJHtsLnRpbWVzdGFtcH1fJHtsLmluZGV4fWApLmxvY2FsZUNvbXBhcmUoYCR7ci50aW1lc3RhbXB9XyR7ci5pbmRleH1gKSk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbGluZVNwbGl0UmVnZXggPSAvXFxyP1xcbi9nbTtcclxufVxyXG4iLCJleHBvcnQgY29uc3QgbGFuZ3VhZ2VzID0gWydlbicsICdkZScsICdmcicsICdqYScsICdjbicsICdrbyddIGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IHR5cGUgTGFuZyA9IHR5cGVvZiBsYW5ndWFnZXNbbnVtYmVyXTtcclxuXHJcbmV4cG9ydCB0eXBlIE5vbkVuTGFuZyA9IEV4Y2x1ZGU8TGFuZywgJ2VuJz47XHJcblxyXG5leHBvcnQgY29uc3QgaXNMYW5nID0gKGxhbmc/OiBzdHJpbmcpOiBsYW5nIGlzIExhbmcgPT4ge1xyXG4gIGNvbnN0IGxhbmdTdHJzOiByZWFkb25seSBzdHJpbmdbXSA9IGxhbmd1YWdlcztcclxuICBpZiAoIWxhbmcpXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgcmV0dXJuIGxhbmdTdHJzLmluY2x1ZGVzKGxhbmcpO1xyXG59O1xyXG4iLCJpbXBvcnQgQ29tYmF0YW50VHJhY2tlciBmcm9tICcuL0NvbWJhdGFudFRyYWNrZXInO1xyXG5pbXBvcnQgUGV0TmFtZXNCeUxhbmcgZnJvbSAnLi4vLi4vLi4vLi4vcmVzb3VyY2VzL3BldF9uYW1lcyc7XHJcbmltcG9ydCBFbXVsYXRvckNvbW1vbiBmcm9tICcuLi9FbXVsYXRvckNvbW1vbic7XHJcbmltcG9ydCBMb2dSZXBvc2l0b3J5IGZyb20gJy4vbmV0d29ya19sb2dfY29udmVydGVyL0xvZ1JlcG9zaXRvcnknO1xyXG5pbXBvcnQgTmV0d29ya0xvZ0NvbnZlcnRlciBmcm9tICcuL05ldHdvcmtMb2dDb252ZXJ0ZXInO1xyXG5pbXBvcnQgeyBMYW5nLCBpc0xhbmcgfSBmcm9tICcuLi8uLi8uLi8uLi9yZXNvdXJjZXMvbGFuZ3VhZ2VzJztcclxuaW1wb3J0IExpbmVFdmVudCwgeyBpc0xpbmVFdmVudFNvdXJjZSwgaXNMaW5lRXZlbnRUYXJnZXQgfSBmcm9tICcuL25ldHdvcmtfbG9nX2NvbnZlcnRlci9MaW5lRXZlbnQnO1xyXG5pbXBvcnQgeyBVbnJlYWNoYWJsZUNvZGUgfSBmcm9tICcuLi8uLi8uLi8uLi9yZXNvdXJjZXMvbm90X3JlYWNoZWQnO1xyXG5cclxuY29uc3QgaXNQZXROYW1lID0gKG5hbWU6IHN0cmluZywgbGFuZ3VhZ2U/OiBMYW5nKSA9PiB7XHJcbiAgaWYgKGxhbmd1YWdlKVxyXG4gICAgcmV0dXJuIFBldE5hbWVzQnlMYW5nW2xhbmd1YWdlXS5pbmNsdWRlcyhuYW1lKTtcclxuXHJcbiAgZm9yIChjb25zdCBsYW5nIGluIFBldE5hbWVzQnlMYW5nKSB7XHJcbiAgICBpZiAoIWlzTGFuZyhsYW5nKSlcclxuICAgICAgdGhyb3cgbmV3IFVucmVhY2hhYmxlQ29kZSgpO1xyXG4gICAgaWYgKFBldE5hbWVzQnlMYW5nW2xhbmddLmluY2x1ZGVzKG5hbWUpKVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbmNvbnN0IGlzVmFsaWRUaW1lc3RhbXAgPSAodGltZXN0YW1wOiBudW1iZXIpID0+IHtcclxuICByZXR1cm4gdGltZXN0YW1wID4gMCAmJiB0aW1lc3RhbXAgPCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuY291bnRlciB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgZW5jb3VudGVyVmVyc2lvbiA9IDE7XHJcbiAgcHVibGljIGlkPzogbnVtYmVyO1xyXG4gIHZlcnNpb246IG51bWJlcjtcclxuICBpbml0aWFsT2Zmc2V0ID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZW5kU3RhdHVzID0gJ1Vua25vd24nO1xyXG4gIHN0YXJ0U3RhdHVzID0gJ1Vua25vd24nO1xyXG4gIHByaXZhdGUgZW5nYWdlQXQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBwcml2YXRlIGZpcnN0UGxheWVyQWJpbGl0eSA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIHByaXZhdGUgZmlyc3RFbmVteUFiaWxpdHkgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmaXJzdExpbmVJbmRleCA9IDA7XHJcbiAgY29tYmF0YW50VHJhY2tlcj86IENvbWJhdGFudFRyYWNrZXI7XHJcbiAgc3RhcnRUaW1lc3RhbXAgPSAwO1xyXG4gIGVuZFRpbWVzdGFtcCA9IDA7XHJcbiAgZHVyYXRpb24gPSAwO1xyXG4gIHBsYXliYWNrT2Zmc2V0ID0gMDtcclxuICBsYW5ndWFnZTogTGFuZyA9ICdlbic7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIGVuY291bnRlckRheTogc3RyaW5nLFxyXG4gICAgcHVibGljIGVuY291bnRlclpvbmVJZDogc3RyaW5nLFxyXG4gICAgcHVibGljIGVuY291bnRlclpvbmVOYW1lOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgbG9nTGluZXM6IExpbmVFdmVudFtdKSB7XHJcbiAgICB0aGlzLnZlcnNpb24gPSBFbmNvdW50ZXIuZW5jb3VudGVyVmVyc2lvbjtcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzdGFydFN0YXR1c2VzID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcblxyXG4gICAgdGhpcy5sb2dMaW5lcy5mb3JFYWNoKChsaW5lLCBpKSA9PiB7XHJcbiAgICAgIGlmICghbGluZSlcclxuICAgICAgICB0aHJvdyBuZXcgVW5yZWFjaGFibGVDb2RlKCk7XHJcblxyXG4gICAgICBsZXQgcmVzID0gRW11bGF0b3JDb21tb24ubWF0Y2hTdGFydChsaW5lLm5ldHdvcmtMaW5lKTtcclxuICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgIHRoaXMuZmlyc3RMaW5lSW5kZXggPSBpO1xyXG4gICAgICAgIGlmIChyZXMuZ3JvdXBzPy5TdGFydFR5cGUpXHJcbiAgICAgICAgICBzdGFydFN0YXR1c2VzLmFkZChyZXMuZ3JvdXBzLlN0YXJ0VHlwZSk7XHJcbiAgICAgICAgaWYgKHJlcy5ncm91cHM/LlN0YXJ0SW4pIHtcclxuICAgICAgICAgIGNvbnN0IHN0YXJ0SW4gPSBwYXJzZUludChyZXMuZ3JvdXBzLlN0YXJ0SW4pO1xyXG4gICAgICAgICAgaWYgKHN0YXJ0SW4gPj0gMClcclxuICAgICAgICAgICAgdGhpcy5lbmdhZ2VBdCA9IE1hdGgubWluKGxpbmUudGltZXN0YW1wICsgc3RhcnRJbiwgdGhpcy5lbmdhZ2VBdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlcyA9IEVtdWxhdG9yQ29tbW9uLm1hdGNoRW5kKGxpbmUubmV0d29ya0xpbmUpO1xyXG4gICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMuZ3JvdXBzPy5FbmRUeXBlKVxyXG4gICAgICAgICAgICB0aGlzLmVuZFN0YXR1cyA9IHJlcy5ncm91cHMuRW5kVHlwZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGlzTGluZUV2ZW50U291cmNlKGxpbmUpICYmIGlzTGluZUV2ZW50VGFyZ2V0KGxpbmUpKSB7XHJcbiAgICAgICAgICBpZiAobGluZS5pZC5zdGFydHNXaXRoKCcxJykgfHxcclxuICAgICAgICAgICAgKGxpbmUuaWQuc3RhcnRzV2l0aCgnNCcpICYmIGlzUGV0TmFtZShsaW5lLm5hbWUsIHRoaXMubGFuZ3VhZ2UpKSkge1xyXG4gICAgICAgICAgICAvLyBQbGF5ZXIgb3IgcGV0IGFiaWxpdHlcclxuICAgICAgICAgICAgaWYgKGxpbmUudGFyZ2V0SWQuc3RhcnRzV2l0aCgnNCcpICYmICFpc1BldE5hbWUobGluZS50YXJnZXROYW1lLCB0aGlzLmxhbmd1YWdlKSkge1xyXG4gICAgICAgICAgICAgIC8vIFRhcmdldHRpbmcgbm9uIHBsYXllciBvciBwZXRcclxuICAgICAgICAgICAgICB0aGlzLmZpcnN0UGxheWVyQWJpbGl0eSA9IE1hdGgubWluKHRoaXMuZmlyc3RQbGF5ZXJBYmlsaXR5LCBsaW5lLnRpbWVzdGFtcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAobGluZS5pZC5zdGFydHNXaXRoKCc0JykgJiYgIWlzUGV0TmFtZShsaW5lLm5hbWUsIHRoaXMubGFuZ3VhZ2UpKSB7XHJcbiAgICAgICAgICAgIC8vIE5vbi1wbGF5ZXIgYWJpbGl0eVxyXG4gICAgICAgICAgICBpZiAobGluZS50YXJnZXRJZC5zdGFydHNXaXRoKCcxJykgfHwgaXNQZXROYW1lKGxpbmUudGFyZ2V0TmFtZSwgdGhpcy5sYW5ndWFnZSkpIHtcclxuICAgICAgICAgICAgICAvLyBUYXJnZXR0aW5nIHBsYXllciBvciBwZXRcclxuICAgICAgICAgICAgICB0aGlzLmZpcnN0RW5lbXlBYmlsaXR5ID0gTWF0aC5taW4odGhpcy5maXJzdEVuZW15QWJpbGl0eSwgbGluZS50aW1lc3RhbXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG1hdGNoZWRMYW5nID0gcmVzPy5ncm91cHM/Lmxhbmd1YWdlO1xyXG4gICAgICBpZiAoaXNMYW5nKG1hdGNoZWRMYW5nKSlcclxuICAgICAgICB0aGlzLmxhbmd1YWdlID0gbWF0Y2hlZExhbmc7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmNvbWJhdGFudFRyYWNrZXIgPSBuZXcgQ29tYmF0YW50VHJhY2tlcih0aGlzLmxvZ0xpbmVzLCB0aGlzLmxhbmd1YWdlKTtcclxuICAgIHRoaXMuc3RhcnRUaW1lc3RhbXAgPSB0aGlzLmNvbWJhdGFudFRyYWNrZXIuZmlyc3RUaW1lc3RhbXA7XHJcbiAgICB0aGlzLmVuZFRpbWVzdGFtcCA9IHRoaXMuY29tYmF0YW50VHJhY2tlci5sYXN0VGltZXN0YW1wO1xyXG4gICAgdGhpcy5kdXJhdGlvbiA9IHRoaXMuZW5kVGltZXN0YW1wIC0gdGhpcy5zdGFydFRpbWVzdGFtcDtcclxuXHJcbiAgICBpZiAodGhpcy5pbml0aWFsT2Zmc2V0ID09PSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikge1xyXG4gICAgICBpZiAodGhpcy5lbmdhZ2VBdCA8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKVxyXG4gICAgICAgIHRoaXMuaW5pdGlhbE9mZnNldCA9IHRoaXMuZW5nYWdlQXQgLSB0aGlzLnN0YXJ0VGltZXN0YW1wO1xyXG4gICAgICBlbHNlIGlmICh0aGlzLmZpcnN0UGxheWVyQWJpbGl0eSA8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKVxyXG4gICAgICAgIHRoaXMuaW5pdGlhbE9mZnNldCA9IHRoaXMuZmlyc3RQbGF5ZXJBYmlsaXR5IC0gdGhpcy5zdGFydFRpbWVzdGFtcDtcclxuICAgICAgZWxzZSBpZiAodGhpcy5maXJzdEVuZW15QWJpbGl0eSA8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKVxyXG4gICAgICAgIHRoaXMuaW5pdGlhbE9mZnNldCA9IHRoaXMuZmlyc3RFbmVteUFiaWxpdHkgLSB0aGlzLnN0YXJ0VGltZXN0YW1wO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5pbml0aWFsT2Zmc2V0ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmaXJzdExpbmUgPSB0aGlzLmxvZ0xpbmVzW3RoaXMuZmlyc3RMaW5lSW5kZXhdO1xyXG5cclxuICAgIGlmIChmaXJzdExpbmUgJiYgZmlyc3RMaW5lLm9mZnNldClcclxuICAgICAgdGhpcy5wbGF5YmFja09mZnNldCA9IGZpcnN0TGluZS5vZmZzZXQ7XHJcblxyXG4gICAgdGhpcy5zdGFydFN0YXR1cyA9IFsuLi5zdGFydFN0YXR1c2VzXS5zb3J0KCkuam9pbignLCAnKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXQgaW5pdGlhbFRpbWVzdGFtcCgpIDogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLnN0YXJ0VGltZXN0YW1wICsgdGhpcy5pbml0aWFsT2Zmc2V0O1xyXG4gIH1cclxuXHJcbiAgc2hvdWxkUGVyc2lzdEZpZ2h0KCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGlzVmFsaWRUaW1lc3RhbXAodGhpcy5maXJzdFBsYXllckFiaWxpdHkpICYmIGlzVmFsaWRUaW1lc3RhbXAodGhpcy5maXJzdEVuZW15QWJpbGl0eSk7XHJcbiAgfVxyXG5cclxuICB1cGdyYWRlKHZlcnNpb246IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgaWYgKEVuY291bnRlci5lbmNvdW50ZXJWZXJzaW9uIDw9IHZlcnNpb24pXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICBjb25zdCByZXBvID0gbmV3IExvZ1JlcG9zaXRvcnkoKTtcclxuICAgIGNvbnN0IGNvbnZlcnRlciA9IG5ldyBOZXR3b3JrTG9nQ29udmVydGVyKCk7XHJcbiAgICB0aGlzLmxvZ0xpbmVzID0gY29udmVydGVyLmNvbnZlcnRMaW5lcyhcclxuICAgICAgICB0aGlzLmxvZ0xpbmVzLm1hcCgobCkgPT4gbC5uZXR3b3JrTGluZSksXHJcbiAgICAgICAgcmVwbyxcclxuICAgICk7XHJcbiAgICB0aGlzLnZlcnNpb24gPSBFbmNvdW50ZXIuZW5jb3VudGVyVmVyc2lvbjtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgRW11bGF0b3JDb21tb24gZnJvbSAnLi4vRW11bGF0b3JDb21tb24nO1xyXG5pbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi4vRXZlbnRCdXMnO1xyXG5pbXBvcnQgTGluZUV2ZW50IGZyb20gJy4vbmV0d29ya19sb2dfY29udmVydGVyL0xpbmVFdmVudCc7XHJcbmltcG9ydCB7IExpbmVFdmVudDB4MDEgfSBmcm9tICcuL25ldHdvcmtfbG9nX2NvbnZlcnRlci9MaW5lRXZlbnQweDAxJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ0V2ZW50SGFuZGxlciBleHRlbmRzIEV2ZW50QnVzIHtcclxuICBwdWJsaWMgY3VycmVudEZpZ2h0OiBMaW5lRXZlbnRbXSA9IFtdO1xyXG4gIHB1YmxpYyBjdXJyZW50Wm9uZU5hbWUgPSAnVW5rbm93bic7XHJcbiAgcHVibGljIGN1cnJlbnRab25lSWQgPSAnLTEnO1xyXG5cclxuICBwYXJzZUxvZ3MobG9nczogTGluZUV2ZW50W10pOiB2b2lkIHtcclxuICAgIGZvciAoY29uc3QgbGluZU9iaiBvZiBsb2dzKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudEZpZ2h0LnB1c2gobGluZU9iaik7XHJcblxyXG4gICAgICBsaW5lT2JqLm9mZnNldCA9IGxpbmVPYmoudGltZXN0YW1wIC0gdGhpcy5jdXJyZW50RmlnaHRTdGFydDtcclxuXHJcbiAgICAgIGNvbnN0IHJlcyA9IEVtdWxhdG9yQ29tbW9uLm1hdGNoRW5kKGxpbmVPYmoubmV0d29ya0xpbmUpO1xyXG4gICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgdGhpcy5lbmRGaWdodCgpO1xyXG4gICAgICB9IGVsc2UgaWYgKGxpbmVPYmogaW5zdGFuY2VvZiBMaW5lRXZlbnQweDAxKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Wm9uZUlkID0gbGluZU9iai56b25lSWQ7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Wm9uZU5hbWUgPSBsaW5lT2JqLnpvbmVOYW1lO1xyXG4gICAgICAgIHRoaXMuZW5kRmlnaHQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXQgY3VycmVudEZpZ2h0U3RhcnQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRGaWdodFswXT8udGltZXN0YW1wID8/IDA7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldCBjdXJyZW50RmlnaHRFbmQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRGaWdodC5zbGljZSgtMSlbMF0/LnRpbWVzdGFtcCA/PyAwO1xyXG4gIH1cclxuXHJcbiAgZW5kRmlnaHQoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50RmlnaHQubGVuZ3RoIDwgMilcclxuICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUodGhpcy5jdXJyZW50RmlnaHRTdGFydCkudG9JU09TdHJpbmcoKTtcclxuICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKHRoaXMuY3VycmVudEZpZ2h0RW5kKS50b0lTT1N0cmluZygpO1xyXG5cclxuICAgIGNvbnNvbGUuZGVidWcoYERpc3BhdGNoaW5nIG5ldyBmaWdodFxyXG5TdGFydDogJHtzdGFydH1cclxuRW5kOiAke2VuZH1cclxuWm9uZTogJHt0aGlzLmN1cnJlbnRab25lTmFtZX1cclxuTGluZSBDb3VudDogJHt0aGlzLmN1cnJlbnRGaWdodC5sZW5ndGh9XHJcbmApO1xyXG4gICAgdm9pZCB0aGlzLmRpc3BhdGNoKCdmaWdodCcsIHN0YXJ0LnN1YnN0cigwLCAxMCksIHRoaXMuY3VycmVudFpvbmVJZCwgdGhpcy5jdXJyZW50Wm9uZU5hbWUsIHRoaXMuY3VycmVudEZpZ2h0KTtcclxuXHJcbiAgICB0aGlzLmN1cnJlbnRGaWdodCA9IFtdO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgRW11bGF0b3JDb21tb24gZnJvbSAnLi4vRW11bGF0b3JDb21tb24nO1xyXG5pbXBvcnQgRW5jb3VudGVyIGZyb20gJy4vRW5jb3VudGVyJztcclxuaW1wb3J0IExvZ0V2ZW50SGFuZGxlciBmcm9tICcuL0xvZ0V2ZW50SGFuZGxlcic7XHJcbmltcG9ydCBOZXR3b3JrTG9nQ29udmVydGVyIGZyb20gJy4vTmV0d29ya0xvZ0NvbnZlcnRlcic7XHJcbmltcG9ydCBMb2dSZXBvc2l0b3J5IGZyb20gJy4vbmV0d29ya19sb2dfY29udmVydGVyL0xvZ1JlcG9zaXRvcnknO1xyXG5cclxub25tZXNzYWdlID0gYXN5bmMgKG1zZykgPT4ge1xyXG4gIGNvbnN0IGxvZ0NvbnZlcnRlciA9IG5ldyBOZXR3b3JrTG9nQ29udmVydGVyKCk7XHJcbiAgY29uc3QgbG9jYWxMb2dIYW5kbGVyID0gbmV3IExvZ0V2ZW50SGFuZGxlcigpO1xyXG4gIGNvbnN0IHJlcG8gPSBuZXcgTG9nUmVwb3NpdG9yeSgpO1xyXG5cclxuICAvLyBMaXN0ZW4gZm9yIExvZ0V2ZW50SGFuZGxlciB0byBkaXNwYXRjaCBmaWdodHMgYW5kIHBlcnNpc3QgdGhlbVxyXG4gIGxvY2FsTG9nSGFuZGxlci5vbignZmlnaHQnLCBhc3luYyAoZGF5LCB6b25lSWQsIHpvbmVOYW1lLCBsaW5lcykgPT4ge1xyXG4gICAgY29uc3QgZW5jID0gbmV3IEVuY291bnRlcihkYXksIHpvbmVJZCwgem9uZU5hbWUsIGxpbmVzKTtcclxuICAgIGVuYy5pbml0aWFsaXplKCk7XHJcbiAgICBpZiAoZW5jLnNob3VsZFBlcnNpc3RGaWdodCgpKSB7XHJcbiAgICAgIHBvc3RNZXNzYWdlKHtcclxuICAgICAgICB0eXBlOiAnZW5jb3VudGVyJyxcclxuICAgICAgICBlbmNvdW50ZXI6IGVuYyxcclxuICAgICAgICBuYW1lOiBlbmMuY29tYmF0YW50VHJhY2tlci5nZXRNYWluQ29tYmF0YW50TmFtZSgpLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gQ29udmVydCB0aGUgbWVzc2FnZSBtYW51YWxseSBkdWUgdG8gbWVtb3J5IGlzc3VlcyB3aXRoIGV4dHJlbWVseSBsYXJnZSBmaWxlc1xyXG4gIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoJ1VURi04Jyk7XHJcbiAgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KG1zZy5kYXRhKTtcclxuICBsZXQgbmV4dE9mZnNldCA9IDA7XHJcbiAgbGV0IGxpbmVzID0gW107XHJcbiAgbGV0IGxpbmVDb3VudCA9IDA7XHJcbiAgZm9yIChsZXQgY3VycmVudE9mZnNldCA9IG5leHRPZmZzZXQ7XHJcbiAgICBuZXh0T2Zmc2V0IDwgYnVmLmxlbmd0aCAmJiBuZXh0T2Zmc2V0ICE9PSAtMTtcclxuICAgIGN1cnJlbnRPZmZzZXQgPSBuZXh0T2Zmc2V0KSB7XHJcbiAgICBuZXh0T2Zmc2V0ID0gYnVmLmluZGV4T2YoMHgwQSwgbmV4dE9mZnNldCArIDEpO1xyXG4gICAgY29uc3QgbGluZSA9IGRlY29kZXIuZGVjb2RlKGJ1Zi5zbGljZShjdXJyZW50T2Zmc2V0LCBuZXh0T2Zmc2V0KSkudHJpbSgpO1xyXG4gICAgaWYgKGxpbmUubGVuZ3RoKSB7XHJcbiAgICAgICsrbGluZUNvdW50O1xyXG4gICAgICBsaW5lcy5wdXNoKGxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChsaW5lcy5sZW5ndGggPj0gMTAwMCkge1xyXG4gICAgICBsaW5lcyA9IGxvZ0NvbnZlcnRlci5jb252ZXJ0TGluZXMobGluZXMsIHJlcG8pO1xyXG4gICAgICBsb2NhbExvZ0hhbmRsZXIucGFyc2VMb2dzKGxpbmVzKTtcclxuICAgICAgcG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIHR5cGU6ICdwcm9ncmVzcycsXHJcbiAgICAgICAgbGluZXM6IGxpbmVDb3VudCxcclxuICAgICAgICBieXRlczogbmV4dE9mZnNldCxcclxuICAgICAgICB0b3RhbEJ5dGVzOiBidWYubGVuZ3RoLFxyXG4gICAgICB9KTtcclxuICAgICAgbGluZXMgPSBbXTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKGxpbmVzLmxlbmd0aCA+IDApIHtcclxuICAgIGxpbmVzID0gbG9nQ29udmVydGVyLmNvbnZlcnRMaW5lcyhsaW5lcywgcmVwbyk7XHJcbiAgICBsb2NhbExvZ0hhbmRsZXIucGFyc2VMb2dzKGxpbmVzKTtcclxuICAgIGxpbmVzID0gW107XHJcbiAgfVxyXG4gIHBvc3RNZXNzYWdlKHtcclxuICAgIHR5cGU6ICdwcm9ncmVzcycsXHJcbiAgICBsaW5lczogbGluZUNvdW50LFxyXG4gICAgYnl0ZXM6IGJ1Zi5sZW5ndGgsXHJcbiAgICB0b3RhbEJ5dGVzOiBidWYubGVuZ3RoLFxyXG4gIH0pO1xyXG4gIGJ1ZiA9IG51bGw7XHJcblxyXG4gIGxvY2FsTG9nSGFuZGxlci5lbmRGaWdodCgpO1xyXG5cclxuICBwb3N0TWVzc2FnZSh7XHJcbiAgICB0eXBlOiAnZG9uZScsXHJcbiAgfSk7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=