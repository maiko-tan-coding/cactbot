import { BaseOptions, RaidbossData } from '../../types/data';
import { LooseTrigger, MatchesAny, TriggerAutoConfig, TriggerField, TriggerOutput } from '../../types/trigger';
export declare type PerTriggerOption = Partial<{
    TextAlert: boolean;
    SoundAlert: boolean;
    SpeechAlert: boolean;
    GroupSpeechAlert: boolean;
    SoundOverride: string;
    VolumeOverride: number;
    Condition: TriggerField<RaidbossData, boolean>;
    InfoText: TriggerOutput<RaidbossData, MatchesAny>;
    AlertText: TriggerOutput<RaidbossData, MatchesAny>;
    AlarmText: TriggerOutput<RaidbossData, MatchesAny>;
    TTSText: TriggerOutput<RaidbossData, MatchesAny>;
}>;
export declare type PerTriggerAutoConfig = {
    [triggerId: string]: TriggerAutoConfig;
};
export declare type PerTriggerOptions = {
    [triggerId: string]: PerTriggerOption;
};
export declare type DisabledTriggers = {
    [triggerId: string]: boolean;
};
declare type RaidbossNonConfigOptions = {
    PlayerNicks: {
        [gameName: string]: string;
    };
    InfoSound: string;
    AlertSound: string;
    AlarmSound: string;
    LongSound: string;
    PullSound: string;
    AudioAllowed: boolean;
    DisabledTriggers: DisabledTriggers;
    PerTriggerAutoConfig: PerTriggerAutoConfig;
    PerTriggerOptions: PerTriggerOptions;
    Triggers: LooseTrigger[];
    PlayerNameOverride: string | null;
    IsRemoteRaidboss: boolean;
    TransformTts: (text: string) => string;
};
declare const defaultRaidbossConfigOptions: {
    Debug: boolean;
    DefaultAlertOutput: string;
    AlertsLanguage: "en" | "de" | "fr" | "ja" | "cn" | "ko" | undefined;
    TimelineLanguage: "en" | "de" | "fr" | "ja" | "cn" | "ko" | undefined;
    TimelineEnabled: boolean;
    AlertsEnabled: boolean;
    ShowTimerBarsAtSeconds: number;
    KeepExpiredTimerBarsForSeconds: number;
    BarExpiresSoonSeconds: number;
    MaxNumberOfTimerBars: number;
    DisplayAlarmTextForSeconds: number;
    DisplayAlertTextForSeconds: number;
    DisplayInfoTextForSeconds: number;
    AlarmSoundVolume: number;
    AlertSoundVolume: number;
    InfoSoundVolume: number;
    LongSoundVolume: number;
    PullSoundVolume: number;
    cactbotWormholeStrat: boolean;
    cactbote8sUptimeKnockbackStrat: boolean;
};
declare type RaidbossConfigOptions = typeof defaultRaidbossConfigOptions;
export interface RaidbossOptions extends BaseOptions, RaidbossNonConfigOptions, RaidbossConfigOptions {
}
declare const Options: RaidbossOptions;
export default Options;
//# sourceMappingURL=raidboss_options.d.ts.map