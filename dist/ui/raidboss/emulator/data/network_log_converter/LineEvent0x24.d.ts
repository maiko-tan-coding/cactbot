import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x24 extends LineEvent {
    readonly valueHex: string;
    readonly valueDec: number;
    readonly bars: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent36 extends LineEvent0x24 {
}
//# sourceMappingURL=LineEvent0x24.d.ts.map