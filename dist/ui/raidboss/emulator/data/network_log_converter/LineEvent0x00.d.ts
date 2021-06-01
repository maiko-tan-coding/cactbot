import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x00 extends LineEvent {
    readonly type: string;
    readonly speaker: string;
    readonly message: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
    static replaceChatSymbols(line: string): string;
    static chatSymbolReplacements: {
        Search: RegExp;
        Replace: string;
        Type: string;
    }[];
}
export declare class LineEvent00 extends LineEvent0x00 {
}
//# sourceMappingURL=LineEvent0x00.d.ts.map