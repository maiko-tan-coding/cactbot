import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x18 extends LineEvent {
    readonly properCaseConvertedLine: string;
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly effectId: string;
    readonly damage: number;
    readonly currentHp: number;
    readonly maxHp: number;
    readonly currentMp: number;
    readonly maxMp: number;
    readonly currentTp: number;
    readonly maxTp: number;
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly heading: number;
    constructor(repo: LogRepository, line: string, parts: string[]);
    static showEffectNamesFor: Record<string, string>;
}
export declare class LineEvent24 extends LineEvent0x18 {
}
//# sourceMappingURL=LineEvent0x18.d.ts.map