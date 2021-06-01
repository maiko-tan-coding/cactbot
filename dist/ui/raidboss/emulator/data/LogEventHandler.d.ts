import EventBus from '../EventBus';
import LineEvent from './network_log_converter/LineEvent';
export default class LogEventHandler extends EventBus {
    currentFight: LineEvent[];
    currentZoneName: string;
    currentZoneId: string;
    parseLogs(logs: LineEvent[]): void;
    private get currentFightStart();
    private get currentFightEnd();
    endFight(): void;
}
//# sourceMappingURL=LogEventHandler.d.ts.map