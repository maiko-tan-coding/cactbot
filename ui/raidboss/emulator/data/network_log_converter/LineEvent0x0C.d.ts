import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x0C extends LineEvent {
    readonly class: string;
    readonly strength: string;
    readonly dexterity: string;
    readonly vitality: string;
    readonly intelligence: string;
    readonly mind: string;
    readonly piety: string;
    readonly attackPower: string;
    readonly directHit: string;
    readonly criticalHit: string;
    readonly attackMagicPotency: string;
    readonly healMagicPotency: string;
    readonly determination: string;
    readonly skillSpeed: string;
    readonly spellSpeed: string;
    readonly tenacity: string;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent12 extends LineEvent0x0C {
}
//# sourceMappingURL=LineEvent0x0C.d.ts.map