import LineEvent, { LineEventJobLevel, LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x26 extends LineEvent implements LineEventSource, LineEventJobLevel {
    readonly jobIdHex: string;
    readonly jobId: number;
    readonly job: string;
    readonly level: number;
    readonly id: string;
    readonly name: string;
    readonly jobLevelData: string;
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
    readonly isJobLevel = true;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent38 extends LineEvent0x26 {
}
//# sourceMappingURL=LineEvent0x26.d.ts.map