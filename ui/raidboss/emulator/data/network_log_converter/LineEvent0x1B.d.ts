import LineEvent, { LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x1B extends LineEvent implements LineEventSource {
    readonly id: string;
    readonly name: string;
    readonly headmarkerId: string;
    readonly isSource = true;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent27 extends LineEvent0x1B {
}
//# sourceMappingURL=LineEvent0x1B.d.ts.map