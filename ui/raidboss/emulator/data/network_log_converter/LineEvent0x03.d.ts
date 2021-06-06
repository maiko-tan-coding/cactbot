import LineEvent, { LineEventJobLevel, LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';
export declare class LineEvent0x03 extends LineEvent implements LineEventSource, LineEventJobLevel {
    readonly id: string;
    readonly name: string;
    readonly jobIdHex: string;
    readonly jobId: number;
    readonly job: string;
    readonly levelString: string;
    readonly level: number;
    readonly ownerId: string;
    readonly worldId: string;
    readonly worldName: string;
    readonly npcNameId: string;
    readonly npcBaseId: string;
    readonly hp: number;
    readonly maxHpString: string;
    readonly maxHp: number;
    readonly mp: number;
    readonly maxMpString: string;
    readonly maxMp: number;
    readonly tp: number;
    readonly maxTp: number;
    readonly xString: string;
    readonly x: number;
    readonly yString: string;
    readonly y: number;
    readonly zString: string;
    readonly z: number;
    readonly heading: number;
    readonly isSource = true;
    readonly isJobLevel = true;
    constructor(repo: LogRepository, line: string, parts: string[]);
}
export declare class LineEvent03 extends LineEvent0x03 {
}
//# sourceMappingURL=LineEvent0x03.d.ts.map