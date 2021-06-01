import { LocaleObject } from '../types/trigger';
declare type LocaleTextOrArray = LocaleObject<string | string[]>;
export declare type Rank = 'S' | 'SS+' | 'SS-' | 'A' | 'B';
export declare type HuntEntry = {
    id: string;
    name: LocaleTextOrArray | string | string[];
    rank?: Rank;
    regex?: RegExp;
    hp?: number;
};
export declare type HuntMap = {
    [huntName: string]: HuntEntry;
};
declare const data: HuntMap;
export default data;
//# sourceMappingURL=hunt.d.ts.map