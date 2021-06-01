import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x26 extends LineEvent {
    readonly jobIdHex: string;
    readonly jobIdDec: number;
    readonly jobName: string;
    readonly level: number;
    readonly id: string;
    readonly name: string;
    readonly jobLevelData: string;
    readonly currentHp: string;
    readonly maxHp: string;
    readonly currentMp: string;
    readonly maxMp: string;
    readonly currentTp: string;
    readonly maxTp: string;
    readonly x: string;
    readonly y: string;
    readonly z: string;
    readonly heading: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent38 extends LineEvent0x26 {
}
//# sourceMappingURL=LineEvent0x26.d.ts.map