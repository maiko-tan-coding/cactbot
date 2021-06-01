import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x15 extends LineEvent {
    readonly damage: number;
    readonly id: string;
    readonly name: string;
    readonly abilityId: string;
    readonly abilityName: string;
    readonly targetId: string;
    readonly targetName: string;
    readonly flags: string;
    readonly targetHp: string;
    readonly targetMaxHp: string;
    readonly targetMp: string;
    readonly targetMaxMp: string;
    readonly targetX: string;
    readonly targetY: string;
    readonly targetZ: string;
    readonly targetHeading: string;
    readonly sourceHp: string;
    readonly sourceMaxHp: string;
    readonly sourceMp: string;
    readonly sourceMaxMp: string;
    readonly x: string;
    readonly y: string;
    readonly z: string;
    readonly heading: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent21 extends LineEvent0x15 {
}
//# sourceMappingURL=LineEvent0x15.d.ts.map