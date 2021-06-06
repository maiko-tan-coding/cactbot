import LineEvent, { LineEventAbility, LineEventSource, LineEventTarget } from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x14 extends LineEvent implements LineEventSource, LineEventTarget, LineEventAbility {
    readonly properCaseConvertedLine: string;
    readonly id: string;
    readonly name: string;
    readonly abilityId: number;
    readonly abilityIdHex: string;
    readonly abilityName: string;
    readonly targetId: string;
    readonly targetName: string;
    readonly duration: string;
    readonly isSource = true;
    readonly isTarget = true;
    readonly isAbility = true;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent20 extends LineEvent0x14 {
}
//# sourceMappingURL=LineEvent0x14.d.ts.map