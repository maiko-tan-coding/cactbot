export declare type Combatant = {
    name?: string;
    job?: string;
    spawn: number;
    despawn: number;
};
export default class LogRepository {
    Combatants: {
        [id: string]: Combatant;
    };
    firstTimestamp: number;
    updateTimestamp(timestamp: number): void;
    updateCombatant(id: string, c: Combatant): void;
    resolveName(id: string, name: string, fallbackId?: string | null, fallbackName?: string | null): string;
}
//# sourceMappingURL=LogRepository.d.ts.map