import LineEvent, { LineEventAbility, LineEventSource, LineEventTarget } from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x15 extends LineEvent implements LineEventSource, LineEventTarget, LineEventAbility {
    readonly damage: number;
    readonly id: string;
    readonly name: string;
    readonly abilityId: number;
    readonly abilityName: string;
    readonly targetId: string;
    readonly targetName: string;
    readonly flags: string;
    readonly targetHp: number;
    readonly targetMaxHp: number;
    readonly targetMp: number;
    readonly targetMaxMp: number;
    readonly targetX: number;
    readonly targetY: number;
    readonly targetZ: number;
    readonly targetHeading: number;
    readonly hp: number;
    readonly maxHp: number;
    readonly mp: number;
    readonly maxMp: number;
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly heading: number;
    readonly isSource = true;
    readonly isTarget = true;
    readonly isAbility = true;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent21 extends LineEvent0x15 {
}
//# sourceMappingURL=LineEvent0x15.d.ts.map