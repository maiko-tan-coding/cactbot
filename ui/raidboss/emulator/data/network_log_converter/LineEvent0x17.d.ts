import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x17 extends LineEvent {
    readonly id: string;
    readonly name: string;
    readonly abilityId: string;
    readonly abilityName: string;
    readonly reason: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent23 extends LineEvent0x17 {
}
//# sourceMappingURL=LineEvent0x17.d.ts.map