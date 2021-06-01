import { Job, Role } from '../types/job';
declare const Util: {
    readonly jobEnumToJob: (id: number) => Job;
    readonly jobToJobEnum: (job: Job) => number;
    readonly jobToRole: (job: Job) => Role;
    readonly getAllRoles: () => readonly Role[];
    readonly isTankJob: (job: Job) => boolean;
    readonly isHealerJob: (job: Job) => boolean;
    readonly isMeleeDpsJob: (job: Job) => boolean;
    readonly isRangedDpsJob: (job: Job) => boolean;
    readonly isCasterDpsJob: (job: Job) => boolean;
    readonly isDpsJob: (job: Job) => boolean;
    readonly isCraftingJob: (job: Job) => boolean;
    readonly isGatheringJob: (job: Job) => boolean;
    readonly isCombatJob: (job: Job) => boolean;
    readonly canStun: (job: Job) => boolean;
    readonly canSilence: (job: Job) => boolean;
    readonly canSleep: (job: Job) => boolean;
    readonly canCleanse: (job: Job) => boolean;
    readonly canFeint: (job: Job) => boolean;
    readonly canAddle: (job: Job) => boolean;
};
export default Util;
//# sourceMappingURL=util.d.ts.map