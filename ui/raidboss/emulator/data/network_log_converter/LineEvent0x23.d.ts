import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x23 extends LineEvent {
    readonly id: string;
    readonly name: string;
    readonly targetId: string;
    readonly targetName: string;
    readonly tetherId: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent35 extends LineEvent0x23 {
}
//# sourceMappingURL=LineEvent0x23.d.ts.map