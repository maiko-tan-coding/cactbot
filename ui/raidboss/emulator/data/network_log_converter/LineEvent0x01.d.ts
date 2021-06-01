import LineEvent from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x01 extends LineEvent {
    readonly properCaseConvertedLine: string;
    readonly zoneId: string;
    readonly zoneName: string;
    readonly zoneNameProperCase: string;
    constructor(repo: LogRepository, networkLine: string, parts: string[]);
}
export declare class LineEvent01 extends LineEvent0x01 {
}
//# sourceMappingURL=LineEvent0x01.d.ts.map