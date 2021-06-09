import { RaidbossOptions } from '../../../../ui/raidboss/raidboss_options';
import { TimelineUI, Event } from '../../timeline';
import RaidEmulator from '../data/RaidEmulator';
interface EmulatorTimerBar {
    $progress: HTMLElement;
    $bar: HTMLDivElement;
    $leftLabel: HTMLElement;
    $rightLabel: HTMLElement;
    start: number;
    style: 'fill' | 'empty';
    duration: number;
    event: Event;
    forceRemoveAt: number;
}
export default class RaidEmulatorTimelineUI extends TimelineUI {
    emulatedTimerBars: EmulatorTimerBar[];
    emulatedStatus: string;
    $barContainer: HTMLElement;
    $progressTemplate: HTMLElement;
    constructor(options: RaidbossOptions);
    bindTo(emulator: RaidEmulator): void;
    stop(): void;
    updateBar(bar: EmulatorTimerBar, currentLogTime: number): void;
    Init(): void;
    AddDebugInstructions(): void;
    protected OnAddTimer(fightNow: number, e: Event, channeling: boolean): void;
    OnRemoveTimer(e: Event, expired: boolean): void;
}
export {};
//# sourceMappingURL=RaidEmulatorTimelineUI.d.ts.map