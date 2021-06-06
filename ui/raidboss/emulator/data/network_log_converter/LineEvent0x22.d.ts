import LineEvent, { LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x22 extends LineEvent implements LineEventSource {
    readonly id: string;
    readonly name: string;
    readonly targetId: string;
    readonly targetName: string;
    readonly targetable: boolean;
    readonly isSource = true;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent34 extends LineEvent0x22 {
}
//# sourceMappingURL=LineEvent0x22.d.ts.map