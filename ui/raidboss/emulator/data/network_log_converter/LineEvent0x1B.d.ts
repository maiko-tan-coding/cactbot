import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x1B extends LineEvent {
    readonly targetId: string;
    readonly targetName: string;
    readonly headmarkerId: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent27 extends LineEvent0x1B {
}
//# sourceMappingURL=LineEvent0x1B.d.ts.map