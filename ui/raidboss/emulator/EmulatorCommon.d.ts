import { Lang } from '../../../resources/languages';
declare type DataType = {
    [key: string]: any;
} | null;
export default class EmulatorCommon {
    static cloneData(data: DataType, exclude?: string[]): DataType;
    static _cloneData(data: DataType): DataType;
    static timeToString(time: number, includeMillis?: boolean): string;
    static timeToDateString(time: number): string;
    static dateObjectToDateString(date: Date): string;
    static timeToTimeString(time: number, includeMillis?: boolean): string;
    static dateObjectToTimeString(date: Date, includeMillis?: boolean): string;
    static msToDuration(ms: number): string;
    static dateTimeToString(time: number, includeMillis?: boolean): string;
    static zeroPad(str: string, len?: number): string;
    static properCase(str: string): string;
    static spacePadLeft(str: string, len: number): string;
    static doesLineMatch(line: string, regexes: Record<Lang, RegExp> | RegExp): RegExpExecArray | null;
    static matchStart(line: string): RegExpMatchArray | undefined;
    static matchEnd(line: string): RegExpMatchArray | undefined;
    static sealRegexes: Record<"en" | "de" | "fr" | "ja" | "cn" | "ko", RegExp>;
    static engageRegexes: Record<"en" | "de" | "fr" | "ja" | "cn" | "ko", RegExp>;
    static countdownRegexes: Record<"en" | "de" | "fr" | "ja" | "cn" | "ko", RegExp>;
    static unsealRegexes: Record<"en" | "de" | "fr" | "ja" | "cn" | "ko", RegExp>;
    static wipeRegex: import("../../../resources/netregexes").NetRegex<"instance" | "command" | "data0" | "data1" | "data2" | "data3">;
    static winRegex: import("../../../resources/netregexes").NetRegex<"instance" | "command" | "data0" | "data1" | "data2" | "data3">;
    static cactbotWipeRegex: import("../../../resources/netregexes").NetRegex<"code" | "name" | "line">;
}
export {};
//# sourceMappingURL=EmulatorCommon.d.ts.map