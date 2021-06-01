import { RaidbossData as Data } from '../types/data';
import { TargetedMatches } from '../types/trigger';
declare const _default: {
    targetIsYou(): (data: Data, matches: TargetedMatches) => boolean;
    targetIsNotYou(): (data: Data, matches: TargetedMatches) => boolean;
    caresAboutAOE(): (data: Data) => boolean;
    caresAboutMagical(): (data: Data) => boolean;
    caresAboutPhysical(): (data: Data) => boolean;
};
export default _default;
//# sourceMappingURL=conditions.d.ts.map