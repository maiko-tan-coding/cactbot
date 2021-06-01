import { LocaleText } from '../types/trigger';
declare type ZoneInfoType = {
    [zoneId: number]: {
        readonly exVersion: number;
        readonly contentType?: number;
        readonly name: LocaleText;
        readonly offsetX: number;
        readonly offsetY: number;
        readonly sizeFactor: number;
        readonly weatherRate: number;
    };
};
declare const data: ZoneInfoType;
export default data;
//# sourceMappingURL=zone_info.d.ts.map