import LineEvent, { LineEventAbility, LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x17 extends LineEvent implements LineEventSource, LineEventAbility {
    readonly id: string;
    readonly name: string;
    readonly abilityId: number;
    readonly abilityName: string;
    readonly reason: string;
    readonly isSource = true;
    readonly isAbility = true;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent23 extends LineEvent0x17 {
}
//# sourceMappingURL=LineEvent0x17.d.ts.map