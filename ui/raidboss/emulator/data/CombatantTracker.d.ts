import Combatant from './Combatant';
import CombatantState from './CombatantState';
import LineEvent, { LineEventSource, LineEventTarget } from './network_log_converter/LineEvent';
import { Lang } from '../../../../resources/languages';
export default class CombatantTracker {
    language: Lang;
    firstTimestamp: number;
    lastTimestamp: number;
    combatants: {
        [id: string]: Combatant;
    };
    partyMembers: string[];
    enemies: string[];
    others: string[];
    pets: string[];
    mainCombatantID?: string;
    initialStates: {
        [id: string]: Partial<CombatantState>;
    };
    constructor(logLines: LineEvent[], language: Lang);
    initialize(logLines: LineEvent[]): void;
    addCombatantFromLine(line: LineEventSource): void;
    addCombatantFromTargetLine(line: LineEventTarget): void;
    extractStateFromLine(line: LineEventSource): Partial<CombatantState>;
    extractStateFromTargetLine(line: LineEventTarget): Partial<CombatantState>;
    initCombatant(id: string, name: string): Combatant;
    getMainCombatantName(): string;
}
//# sourceMappingURL=CombatantTracker.d.ts.map