import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x27 extends LineEvent {
    readonly id: string;
    readonly name: string;
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
}
export declare class LineEvent39 extends LineEvent0x27 {
}
//# sourceMappingURL=LineEvent0x27.d.ts.map