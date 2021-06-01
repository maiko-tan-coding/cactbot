import LogRepository from './LogRepository';
/**
 * Generic class to track an FFXIV log line
 */
export default class LineEvent {
    networkLine: string;
    offset: number;
    convertedLine: string;
    invalid: boolean;
    index: number;
    readonly decEvent: number;
    readonly hexEvent: string;
    readonly timestamp: number;
    readonly checksum: string;
    constructor(repo: LogRepository, networkLine: string, parts: string[]);
    prefix(): string;
    static isDamageHallowed(damage: string): boolean;
    static isDamageBig(damage: string): boolean;
    static calculateDamage(damage: string): number;
}
//# sourceMappingURL=LineEvent.d.ts.map