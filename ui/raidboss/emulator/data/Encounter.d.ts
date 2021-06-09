import CombatantTracker from './CombatantTracker';
import { Lang } from '../../../../resources/languages';
import LineEvent from './network_log_converter/LineEvent';
export default class Encounter {
    encounterDay: string;
    encounterZoneId: string;
    encounterZoneName: string;
    logLines: LineEvent[];
    private static readonly encounterVersion;
    id?: number;
    version: number;
    initialOffset: number;
    endStatus: string;
    startStatus: string;
    private engageAt;
    private firstPlayerAbility;
    private firstEnemyAbility;
    firstLineIndex: number;
    combatantTracker?: CombatantTracker;
    startTimestamp: number;
    endTimestamp: number;
    duration: number;
    playbackOffset: number;
    language: Lang;
    constructor(encounterDay: string, encounterZoneId: string, encounterZoneName: string, logLines: LineEvent[]);
    initialize(): void;
    get initialTimestamp(): number;
    shouldPersistFight(): boolean;
    upgrade(version: number): boolean;
}
//# sourceMappingURL=Encounter.d.ts.map