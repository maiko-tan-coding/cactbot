import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x1F extends LineEvent {
    readonly jobGaugeBytes: string[];
    readonly name: string;
    readonly properCaseConvertedLine: string;
    readonly id: string;
    readonly dataBytes1: string;
    readonly dataBytes2: string;
    readonly dataBytes3: string;
    readonly dataBytes4: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent31 extends LineEvent0x1F {
}
//# sourceMappingURL=LineEvent0x1F.d.ts.map