import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x1C extends LineEvent {
    readonly operation: string;
    readonly waymark: string;
    readonly id: string;
    readonly name: string;
    readonly x: string;
    readonly y: string;
    readonly z: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent28 extends LineEvent0x1C {
}
//# sourceMappingURL=LineEvent0x1C.d.ts.map