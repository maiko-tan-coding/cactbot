import { RaidbossOptions } from './raidboss_options';
import { LogEvent } from 'types/event';
import { LooseTimelineTrigger } from 'types/trigger';
declare type Replacement = {
    locale: string;
    replaceSync: {
        [key: string]: string;
    };
    replaceText: {
        [key: string]: string;
    };
};
declare type Style = {
    style: {
        [key: string]: string;
    };
    regex: RegExp;
};
export declare type Event = {
    id: number;
    time: number;
    name: string;
    text: string;
    activeTime?: number;
    lineNumber?: number;
    duration?: number;
    sortKey?: number;
    isDur?: boolean;
    style?: {
        [key: string]: string;
    };
};
declare type Error = {
    lineNumber?: number;
    line?: string;
    error: string;
};
export declare type Sync = {
    id: number;
    origRegexStr: string;
    regex: RegExp;
    start: number;
    end: number;
    time: number;
    lineNumber: number;
    jump?: number;
};
declare type AddTimerCallback = (fightNow: number, durationEvent: Event, channeling: boolean) => void;
declare type PopupTextCallback = (text: string) => void;
declare type TriggerCallback = (trigger: LooseTimelineTrigger, matches: RegExpExecArray | null) => void;
export declare class Timeline {
    private options;
    private perTriggerAutoConfig;
    private activeText;
    private replacements;
    private ignores;
    events: Event[];
    private texts;
    syncStarts: Sync[];
    private syncEnds;
    private activeSyncs;
    private activeEvents;
    errors: Error[];
    timebase: number;
    private nextEvent;
    private nextText;
    private nextSyncStart;
    private nextSyncEnd;
    private addTimerCallback;
    private removeTimerCallback;
    private showInfoTextCallback;
    private showAlertTextCallback;
    private showAlarmTextCallback;
    private speakTTSCallback;
    private triggerCallback;
    private syncTimeCallback;
    private updateTimer;
    constructor(text: string, replacements: Replacement[], triggers: LooseTimelineTrigger[], styles: Style[], options: RaidbossOptions);
    private GetReplacedHelper;
    private GetReplacedText;
    private GetReplacedSync;
    GetMissingTranslationsToIgnore(): RegExp[];
    private LoadFile;
    Stop(): void;
    protected SyncTo(fightNow: number, currentTime: number): void;
    private _CollectActiveSyncs;
    OnLogLine(line: string, currentTime: number): void;
    private _AdvanceTimeTo;
    private _ClearTimers;
    private _ClearExceptRunningDurationTimers;
    private _RemoveExpiredTimers;
    private _AddDurationTimers;
    private _AddUpcomingTimers;
    private _AddPassedTexts;
    private _CancelUpdate;
    protected _ScheduleUpdate(fightNow: number): void;
    _OnUpdateTimer(currentTime: number): void;
    SetAddTimer(c: AddTimerCallback | null): void;
    SetRemoveTimer(c: ((e: Event, expired: boolean) => void) | null): void;
    SetShowInfoText(c: PopupTextCallback | null): void;
    SetShowAlertText(c: PopupTextCallback | null): void;
    SetShowAlarmText(c: PopupTextCallback | null): void;
    SetSpeakTTS(c: PopupTextCallback | null): void;
    SetTrigger(c: TriggerCallback | null): void;
    SetSyncTime(c: ((fightNow: number, running: boolean) => void) | null): void;
}
interface PopupText {
    Info: PopupTextCallback;
    Alert: PopupTextCallback;
    Alarm: PopupTextCallback;
    TTS: PopupTextCallback;
    Trigger: TriggerCallback;
}
export declare class TimelineUI {
    private options;
    private init;
    private lang;
    private root;
    private barColor;
    private barExpiresSoonColor;
    private timerlist;
    private activeBars;
    private expireTimers;
    private debugElement;
    private debugFightTimer;
    private timeline;
    private popupText?;
    constructor(options: RaidbossOptions);
    protected Init(): void;
    protected AddDebugInstructions(): void;
    SetPopupTextInterface(popupText: PopupText): void;
    SetTimeline(timeline: Timeline | null): void;
    protected OnAddTimer(fightNow: number, e: Event, channeling: boolean): void;
    private OnTimerExpiresSoon;
    protected OnRemoveTimer(e: Event, expired: boolean): void;
    private OnShowInfoText;
    private OnShowAlertText;
    private OnShowAlarmText;
    private OnSpeakTTS;
    private OnTrigger;
    private OnSyncTime;
}
export declare class TimelineController {
    private options;
    private ui;
    private timelines;
    private suppressNextEngage;
    private wipeRegex;
    private activeTimeline;
    constructor(options: RaidbossOptions, ui: TimelineUI, raidbossDataFiles: {
        [filename: string]: string;
    });
    SetPopupTextInterface(popupText: PopupText): void;
    SetInCombat(inCombat: boolean): void;
    OnLogEvent(e: LogEvent): void;
    SetActiveTimeline(timelineFiles: string[], timelines: string[], replacements: Replacement[], triggers: LooseTimelineTrigger[], styles: Style[]): void;
    IsReady(): boolean;
}
export declare class TimelineLoader {
    private timelineController;
    constructor(timelineController: TimelineController);
    SetTimelines(timelineFiles: string[], timelines: string[], replacements: Replacement[], triggers: LooseTimelineTrigger[], styles: Style[]): void;
    IsReady(): boolean;
    StopCombat(): void;
}
export {};
//# sourceMappingURL=timeline.d.ts.map