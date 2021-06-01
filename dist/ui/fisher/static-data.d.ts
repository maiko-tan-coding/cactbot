import { Lang } from '../../types/global';
declare type LangMapping = {
    [lang in Lang]: {
        [id: string]: string | string[];
    };
};
declare type FisherData = {
    readonly fish: LangMapping;
    readonly placefish: {
        [placeId: string]: number[];
    };
    readonly places: LangMapping;
    readonly tackle: LangMapping;
    readonly tugs: {
        [fishId: string]: number;
    };
};
declare const data: FisherData;
export default data;
//# sourceMappingURL=static-data.d.ts.map