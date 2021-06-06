import LineEvent, { LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x27 extends LineEvent implements LineEventSource {
    readonly id: string;
    readonly name: string;
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
}
export declare class LineEvent39 extends LineEvent0x27 {
}
//# sourceMappingURL=LineEvent0x27.d.ts.map