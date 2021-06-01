import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x19 extends LineEvent {
    readonly properCaseConvertedLine: string;
    readonly id: string;
    readonly name: string;
    readonly targetId: string;
    readonly targetName: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent25 extends LineEvent0x19 {
}
//# sourceMappingURL=LineEvent0x19.d.ts.map