import { BaseRegExp } from '../types/trigger';
import { Params } from './regexes';
export declare type NetRegex<T extends string> = BaseRegExp<Exclude<T, 'capture'>>;
declare const startsUsingParams: readonly ["timestamp", "sourceId", "source", "id", "ability", "targetId", "target", "castTime"];
declare const abilityParams: readonly ["sourceId", "source", "id", "ability", "targetId", "target"];
declare const abilityFullParams: readonly ["sourceId", "source", "id", "ability", "targetId", "target", "flags", "damage", "targetCurrentHp", "targetMaxHp", "x", "y", "z", "heading"];
declare const headMarkerParams: readonly ["targetId", "target", "id"];
declare const addedCombatantParams: readonly ["id", "name"];
declare const addedCombatantFullParams: readonly ["id", "name", "job", "level", "ownerId", "world", "npcNameId", "npcBaseId", "currentHp", "hp", "x", "y", "z", "heading"];
declare const removingCombatantParams: readonly ["id", "name", "hp"];
declare const gainsEffectParams: readonly ["effectId", "effect", "duration", "sourceId", "source", "targetId", "target", "count"];
declare const statusEffectExplicitParams: readonly ["targetId", "target", "hp", "maxHp", "x", "y", "z", "heading", "data0", "data1", "data2", "data3", "data4"];
declare const losesEffectParams: readonly ["effectId", "effect", "sourceId", "source", "targetId", "target", "count"];
declare const tetherParams: readonly ["sourceId", "source", "targetId", "target", "id"];
declare const wasDefeatedParams: readonly ["targetId", "target", "sourceId", "source"];
declare const echoParams: readonly ["code", "name", "line"];
declare const dialogParams: readonly ["code", "name", "line"];
declare const messageParams: readonly ["code", "name", "line"];
declare const gameLogParams: readonly ["code", "name", "line"];
declare const gameNameLogParams: readonly ["code", "name", "line"];
declare const statChangeParams: readonly ["job", "strength", "dexterity", "vitality", "intelligence", "mind", "piety", "attackPower", "directHit", "criticalHit", "attackMagicPotency", "healMagicPotency", "determination", "skillSpeed", "spellSpeed", "tenacity"];
declare const changeZoneParams: readonly ["id", "name"];
declare const network6dParams: readonly ["instance", "command", "data0", "data1", "data2", "data3"];
declare const nameToggleParams: readonly ["id", "name", "toggle"];
export declare type StartsUsingParams = typeof startsUsingParams[number];
export declare type AbilityParams = typeof abilityParams[number];
export declare type AbilityFullParams = typeof abilityFullParams[number];
export declare type HeadMarkerParams = typeof headMarkerParams[number];
export declare type AddedCombatantParams = typeof addedCombatantParams[number];
export declare type AddedCombatantFullParams = typeof addedCombatantFullParams[number];
export declare type RemovingCombatantParams = typeof removingCombatantParams[number];
export declare type GainsEffectParams = typeof gainsEffectParams[number];
export declare type StatusEffectExplicitParams = typeof statusEffectExplicitParams[number];
export declare type LosesEffectParams = typeof losesEffectParams[number];
export declare type TetherParams = typeof tetherParams[number];
export declare type WasDefeatedParams = typeof wasDefeatedParams[number];
export declare type EchoParams = typeof echoParams[number];
export declare type DialogParams = typeof dialogParams[number];
export declare type MessageParams = typeof messageParams[number];
export declare type GameLogParams = typeof gameLogParams[number];
export declare type GameNameLogParams = typeof gameNameLogParams[number];
export declare type StatChangeParams = typeof statChangeParams[number];
export declare type ChangeZoneParams = typeof changeZoneParams[number];
export declare type Network6dParams = typeof network6dParams[number];
export declare type NameToggleParams = typeof nameToggleParams[number];
export default class NetRegexes {
    static flagTranslationsNeeded: boolean;
    static setFlagTranslationsNeeded(value: boolean): void;
    static doesNetRegexNeedTranslation(regex: RegExp | string): boolean;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting
     */
    static startsUsing(params?: Params<StartsUsingParams>): NetRegex<StartsUsingParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
     */
    static ability(params?: Params<AbilityParams>): NetRegex<AbilityParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
     */
    static abilityFull(params?: Params<AbilityFullParams>): NetRegex<AbilityFullParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1b-networktargeticon-head-markers
     */
    static headMarker(params?: Params<HeadMarkerParams>): NetRegex<HeadMarkerParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
     */
    static addedCombatant(params?: Params<AddedCombatantParams>): NetRegex<AddedCombatantParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
     */
    static addedCombatantFull(params?: Params<AddedCombatantFullParams>): NetRegex<AddedCombatantFullParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#04-removecombatant
     */
    static removingCombatant(params?: Params<RemovingCombatantParams>): NetRegex<RemovingCombatantParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1a-networkbuff
     */
    static gainsEffect(params?: Params<GainsEffectParams>): NetRegex<GainsEffectParams>;
    /**
     * Prefer gainsEffect over this function unless you really need extra data.
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#26-networkstatuseffects
     */
    static statusEffectExplicit(params?: Params<StatusEffectExplicitParams>): NetRegex<StatusEffectExplicitParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1e-networkbuffremove
     */
    static losesEffect(params?: Params<LosesEffectParams>): NetRegex<LosesEffectParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#23-networktether
     */
    static tether(params?: Params<TetherParams>): NetRegex<TetherParams>;
    /**
     * 'target' was defeated by 'source'
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#19-networkdeath
     */
    static wasDefeated(params?: Params<WasDefeatedParams>): NetRegex<WasDefeatedParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static echo(params?: Params<EchoParams>): NetRegex<EchoParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static dialog(params?: Params<DialogParams>): NetRegex<DialogParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static message(params?: Params<MessageParams>): NetRegex<MessageParams>;
    /**
     * fields: code, name, line, capture
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static gameLog(params?: Params<GameLogParams>): NetRegex<GameLogParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
     */
    static gameNameLog(params?: Params<GameNameLogParams>): NetRegex<GameNameLogParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats
     */
    static statChange(params?: Params<StatChangeParams>): NetRegex<StatChangeParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#01-changezone
     */
    static changeZone(params?: Params<ChangeZoneParams>): NetRegex<ChangeZoneParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#21-network6d-actor-control-lines
     */
    static network6d(params?: Params<Network6dParams>): NetRegex<Network6dParams>;
    /**
     * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#22-networknametoggle
     */
    static nameToggle(params?: Params<NameToggleParams>): NetRegex<NameToggleParams>;
}
export {};
//# sourceMappingURL=netregexes.d.ts.map