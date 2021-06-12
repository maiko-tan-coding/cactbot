import { StatChangeParams } from '../../resources/netregexes';
import { Regex } from '../../resources/regexes';
import { Bars } from './bar';
import { Lang } from '../../resources/languages';
import { Job } from '../../types/job';
export declare class RegexesHolder {
    StatsRegex: Regex<StatChangeParams>;
    YouGainEffectRegex: RegExp;
    YouLoseEffectRegex: RegExp;
    YouUseAbilityRegex: RegExp;
    AnybodyAbilityRegex: RegExp;
    MobGainsEffectRegex: RegExp;
    MobLosesEffectRegex: RegExp;
    MobGainsEffectFromYouRegex: RegExp;
    MobLosesEffectFromYouRegex: RegExp;
    cordialRegex: RegExp;
    countdownStartRegex: RegExp;
    countdownCancelRegex: RegExp;
    craftingStartRegexes: RegExp[];
    craftingFinishRegexes: RegExp[];
    craftingStopRegexes: RegExp[];
    constructor(lang: Lang, playerName: string);
}
export declare const doesJobNeedMPBar: (job: Job) => boolean;
export declare const calcGCDFromStat: (bars: Bars, stat: number, actionDelay?: number) => number;
export declare const computeBackgroundColorFrom: (element: HTMLElement, classList: string) => string;
export declare const makeAuraTimerIcon: (name: string, seconds: number, opacity: number, iconWidth: number, iconHeight: number, iconText: string, barHeight: number, textHeight: number, textColor: string, borderSize: number, borderColor: string, barColor: string, auraIcon: string) => HTMLDivElement;
//# sourceMappingURL=utils.d.ts.map