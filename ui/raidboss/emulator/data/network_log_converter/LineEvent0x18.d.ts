import LineEvent, { LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x18 extends LineEvent implements LineEventSource {
    readonly properCaseConvertedLine: string;
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly effectId: string;
    readonly damage: number;
    readonly hp: number;
    readonly maxHp: number;
    readonly mp: number;
    readonly maxMp: number;
    readonly tp: number;
    readonly maxTp: number;
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly heading: number;
    readonly isSource = true;
    constructor(repo: LogRepository, line: string, parts: string[]);
    static showEffectNamesFor: Record<string, string>;
}
export declare class LineEvent24 extends LineEvent0x18 {
}
//# sourceMappingURL=LineEvent0x18.d.ts.map