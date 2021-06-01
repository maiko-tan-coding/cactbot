import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x25 extends LineEvent {
    readonly id: string;
    readonly name: string;
    readonly sequenceId: string;
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
export declare class LineEvent37 extends LineEvent0x25 {
}
//# sourceMappingURL=LineEvent0x25.d.ts.map