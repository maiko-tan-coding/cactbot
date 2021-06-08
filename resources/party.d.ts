import { Party } from '../types/event';
import { Job, Role } from '../types/job';
export default class PartyTracker {
    details: Party[];
    partyNames_: string[];
    partyIds_: string[];
    allianceNames_: string[];
    allianceIds_: string[];
    nameToRole_: {
        [name: string]: Role;
    };
    idToName_: {
        [id: string]: string;
    };
    roleToPartyNames_: Record<Role, string[]>;
    onPartyChanged(e: {
        party: Party[];
    }): void;
    reset(): void;
    get partyNames(): string[];
    get partyIds(): string[];
    get allianceNames(): string[];
    get tankNames(): string[];
    get healerNames(): string[];
    get dpsNames(): string[];
    isRole(name: string, role: string): boolean;
    isTank(name: string): boolean;
    isHealer(name: string): boolean;
    isDPS(name: string): boolean;
    inParty(name: string): boolean;
    inAlliance(name: string): boolean;
    otherTank(name: string): string | undefined;
    otherHealer(name: string): string | undefined;
    jobName(name: string): Job | undefined;
    nameFromId(id: string): string | undefined;
}
//# sourceMappingURL=party.d.ts.map