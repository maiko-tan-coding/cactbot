import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x14 extends LineEvent {
    readonly properCaseConvertedLine: string;
    readonly id: string;
    readonly name: string;
    readonly abilityId: string;
    readonly abilityName: string;
    readonly targetId: string;
    readonly targetName: string;
    readonly duration: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent20 extends LineEvent0x14 {
}
//# sourceMappingURL=LineEvent0x14.d.ts.map