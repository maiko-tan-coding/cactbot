import EventBus from '../EventBus';
import LineEvent from './network_log_converter/LineEvent';
import LogRepository from './network_log_converter/LogRepository';
export default class NetworkLogConverter extends EventBus {
    convertFile(data: string): LineEvent[];
    convertLines(lines: string[], repo: LogRepository): LineEvent[];
    static lineSplitRegex: RegExp;
}
//# sourceMappingURL=NetworkLogConverter.d.ts.map