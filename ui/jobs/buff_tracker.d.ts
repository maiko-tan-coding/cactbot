import { JobsOptions } from './types';
import WidgetList from '../../resources/widget_list';
import { MatchesAbility, MatchesGainsEffect, MatchesLosesEffect } from '../../resources/matches';
import PartyTracker from '../../resources/party';
export interface BuffInfo {
    name: string;
    cooldownAbility?: string[];
    gainEffect?: string[];
    loseEffect?: string[];
    mobGainsEffect?: string;
    mobLosesEffect?: string;
    durationSeconds?: number;
    useEffectDuration?: boolean;
    icon: string;
    side?: 'left' | 'right';
    borderColor: string;
    sortKey: number;
    cooldown?: number;
    sharesCooldownWith?: string[];
    hide?: boolean;
    stack?: number;
    partyOnly?: boolean;
}
export interface Aura {
    addCallback: () => void;
    removeCallback: () => void;
    addTimeout: number | null;
    /** id in `window.clearTimeout(id)` */
    removeTimeout: number | null;
}
export declare class Buff {
    name: string;
    info: BuffInfo;
    options: JobsOptions;
    activeList: WidgetList;
    cooldownList: WidgetList;
    readyList: WidgetList;
    active: Aura | null;
    cooldown: {
        [s: string]: Aura;
    };
    ready: {
        [s: string]: Aura;
    };
    readySortKeyBase: number;
    cooldownSortKeyBase: number;
    constructor(name: string, info: BuffInfo, list: WidgetList, options: JobsOptions);
    addCooldown(source: string, effectSeconds: number): void;
    addReady(source: string): void;
    makeAura(key: string, list: WidgetList, seconds: number, secondsUntilShow: number, adjustSort: number, textColor: string, txt: string, opacity: number, expireCallback?: () => void): Aura;
    clear(): void;
    clearCooldown(source: string): void;
    onGain(seconds: number): void;
    onLose(): void;
    onCooldown(seconds: number, source: string): void;
}
export declare class BuffTracker {
    buffInfo: {
        [s: string]: Omit<BuffInfo, 'name'>;
    };
    options: JobsOptions;
    partyTracker: PartyTracker;
    playerName: string;
    leftBuffDiv: WidgetList;
    rightBuffDiv: WidgetList;
    buffs: {
        [s: string]: Buff;
    };
    gainEffectMap: {
        [s: string]: BuffInfo[];
    };
    loseEffectMap: {
        [s: string]: BuffInfo[];
    };
    cooldownAbilityMap: {
        [s: string]: BuffInfo[];
    };
    mobGainsEffectMap: {
        [s: string]: BuffInfo[];
    };
    mobLosesEffectMap: {
        [s: string]: BuffInfo[];
    };
    constructor(options: JobsOptions, playerName: string, leftBuffDiv: WidgetList, rightBuffDiv: WidgetList, partyTracker: PartyTracker);
    onUseAbility(id: string, matches: MatchesAbility): void;
    onGainEffect(buffs: BuffInfo[] | undefined, matches: MatchesGainsEffect): void;
    onLoseEffect(buffs: BuffInfo[] | undefined, _matches: MatchesLosesEffect): void;
    onYouGainEffect(name: string, matches: MatchesGainsEffect): void;
    onYouLoseEffect(name: string, matches: MatchesLosesEffect): void;
    onMobGainsEffect(name: string, matches: MatchesGainsEffect): void;
    onMobLosesEffect(name: string, matches: MatchesLosesEffect): void;
    onBigBuff(name: string, seconds: number | undefined, info: BuffInfo, source: string | undefined, option: 'active' | 'cooldown'): void;
    onLoseBigBuff(name: string): void;
    clear(): void;
}
//# sourceMappingURL=buff_tracker.d.ts.map