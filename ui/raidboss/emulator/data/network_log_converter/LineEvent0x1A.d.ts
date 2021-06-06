import LineEvent, { LineEventAbility } from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x1A extends LineEvent implements LineEventAbility {
    readonly resolvedName: string;
    readonly resolvedTargetName: string;
    readonly fallbackResolvedTargetName: string;
    readonly properCaseConvertedLine: string;
    readonly abilityId: number;
    readonly abilityName: string;
    readonly durationFloat: number;
    readonly durationString: string;
    readonly id: string;
    readonly name: string;
    readonly targetId: string;
    readonly targetName: string;
    readonly stacks: number;
    readonly targetHp: number;
    readonly hp: number;
    readonly isAbility = true;
    constructor(repo: LogRepository, line: string, parts: string[]);
    static showStackCountFor: readonly number[];
}
export declare class LineEvent26 extends LineEvent0x1A {
}
//# sourceMappingURL=LineEvent0x1A.d.ts.map