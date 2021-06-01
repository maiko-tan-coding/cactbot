import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x1A extends LineEvent {
    readonly resolvedName: string;
    readonly resolvedTargetName: string;
    readonly fallbackResolvedTargetName: string;
    readonly properCaseConvertedLine: string;
    readonly abilityId: string;
    readonly abilityName: string;
    readonly durationFloat: number;
    readonly durationString: string;
    readonly id: string;
    readonly name: string;
    readonly targetId: string;
    readonly targetName: string;
    readonly stacks: number;
    readonly targetHp: string;
    readonly sourceHp: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
    static showStackCountFor: readonly string[];
}
export declare class LineEvent26 extends LineEvent0x1A {
}
//# sourceMappingURL=LineEvent0x1A.d.ts.map