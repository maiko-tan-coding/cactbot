import CombatantState from './CombatantState';
export default class Combatant {
    id: string;
    name: string;
    server: string;
    states: {
        [timestamp: number]: CombatantState;
    };
    significantStates: number[];
    latestTimestamp: number;
    job?: string;
    jobId?: number;
    level?: number;
    constructor(id: string, name: string);
    setName(name: string): void;
    hasState(timestamp: number): boolean;
    pushState(timestamp: number, state: CombatantState): void;
    nextSignificantState(timestamp: number): CombatantState;
    pushPartialState(timestamp: number, props: Partial<CombatantState>): void;
    getState(timestamp: number): CombatantState;
    private getStateByIndex;
}
//# sourceMappingURL=Combatant.d.ts.map