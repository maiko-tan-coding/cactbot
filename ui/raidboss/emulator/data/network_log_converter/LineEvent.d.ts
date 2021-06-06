import LogRepository from './LogRepository';
/**
 * Generic class to track an FFXIV log line
 */
export default class LineEvent {
    networkLine: string;
    offset: number;
    convertedLine: string;
    invalid: boolean;
    index: number;
    readonly decEvent: number;
    readonly hexEvent: string;
    readonly timestamp: number;
    readonly checksum: string;
    constructor(repo: LogRepository, networkLine: string, parts: string[]);
    prefix(): string;
    static isDamageHallowed(damage: string): boolean;
    static isDamageBig(damage: string): boolean;
    static calculateDamage(damage: string): number;
}
export interface LineEventSource extends LineEvent {
    readonly isSource: true;
    readonly id: string;
    readonly name: string;
    readonly x?: number;
    readonly y?: number;
    readonly z?: number;
    readonly heading?: number;
    readonly targetable?: boolean;
    readonly hp?: number;
    readonly maxHp?: number;
    readonly mp?: number;
    readonly maxMp?: number;
}
export declare const isLineEventSource: (line: LineEvent) => line is LineEventSource;
export interface LineEventTarget extends LineEvent {
    readonly isTarget: true;
    readonly targetId: string;
    readonly targetName: string;
    readonly targetX?: number;
    readonly targetY?: number;
    readonly targetZ?: number;
    readonly targetHeading?: number;
    readonly targetHp?: number;
    readonly targetMaxHp?: number;
    readonly targetMp?: number;
    readonly targetMaxMp?: number;
}
export declare const isLineEventTarget: (line: LineEvent) => line is LineEventTarget;
export interface LineEventJobLevel extends LineEvent {
    readonly isJobLevel: true;
    readonly job: string;
    readonly jobId: number;
    readonly level: number;
}
export declare const isLineEventJobLevel: (line: LineEvent) => line is LineEventJobLevel;
export interface LineEventAbility extends LineEvent {
    readonly isAbility: true;
    readonly abilityId: number;
    readonly abilityName: string;
}
export declare const isLineEventAbility: (line: LineEvent) => line is LineEventAbility;
//# sourceMappingURL=LineEvent.d.ts.map