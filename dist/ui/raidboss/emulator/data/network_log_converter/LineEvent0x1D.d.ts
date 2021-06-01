import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x1D extends LineEvent {
    readonly operation: string;
    readonly waymark: string;
    readonly id: string;
    readonly name: string;
    readonly targetId: string;
    readonly targetName: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent29 extends LineEvent0x1D {
}
//# sourceMappingURL=LineEvent0x1D.d.ts.map