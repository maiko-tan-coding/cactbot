import { LineEvent0x1A } from './LineEvent0x1A';
import LogRepository from './LogRepository';
export declare class LineEvent0x1E extends LineEvent0x1A {
    readonly properCaseConvertedLine: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent30 extends LineEvent0x1E {
}
//# sourceMappingURL=LineEvent0x1E.d.ts.map