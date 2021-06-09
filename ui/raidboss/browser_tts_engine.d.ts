import { Lang } from '../../resources/languages';
declare class TTSItem {
    readonly text: string;
    readonly item: SpeechSynthesisUtterance;
    constructor(text: string, lang?: string, voice?: SpeechSynthesisVoice);
    play(): void;
}
declare type TTSItemDictionary = {
    [key: string]: TTSItem;
};
export default class BrowserTTSEngine {
    readonly ttsItems: TTSItemDictionary;
    private speechLang?;
    private speechVoice?;
    constructor(lang: Lang);
    play(text: string): void;
}
export {};
//# sourceMappingURL=browser_tts_engine.d.ts.map