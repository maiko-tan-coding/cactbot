import { PlayerChangedRet } from '../types/event';
import { Lang } from '../resources/languages';
export declare type PlayerChangedDetail = {
    detail: PlayerChangedRet;
};
declare type PlayerChangedFunc = (e: PlayerChangedDetail) => void;
export declare const addPlayerChangedOverrideListener: (playerName: string | null, func: PlayerChangedFunc) => void;
export declare const addRemotePlayerSelectUI: (lang: Lang) => void;
export {};
//# sourceMappingURL=player_override.d.ts.map