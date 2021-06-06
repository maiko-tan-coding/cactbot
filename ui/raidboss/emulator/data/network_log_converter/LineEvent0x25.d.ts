import LineEvent, { LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x25 extends LineEvent implements LineEventSource {
    readonly id: string;
    readonly name: string;
    readonly sequenceId: string;
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
export declare class LineEvent37 extends LineEvent0x25 {
}
//# sourceMappingURL=LineEvent0x25.d.ts.map