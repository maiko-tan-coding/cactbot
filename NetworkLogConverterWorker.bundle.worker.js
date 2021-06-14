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