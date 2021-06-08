import { Lang } from './languages';
import { BaseOptions } from '../types/data';
import { SavedConfigEntry } from '../types/event';
import { LocaleText } from '../types/trigger';
declare type CactbotConfigurator = unknown;
declare type UserFileCallback = (jsFile: string, localFiles: {
    [filename: string]: string;
}, options: BaseOptions, basePath: string) => void;
declare type ConfigValue = string | number | boolean;
declare type ConfigEntry = {
    id: string;
    name: LocaleText;
    type: 'checkbox' | 'select' | 'float' | 'integer' | 'directory';
    default: ConfigValue;
    debug?: boolean;
    debugOnly?: boolean;
    options?: {
        [lang in Lang]?: {
            [selectText: string]: string;
        };
    };
    setterFunc?: (options: BaseOptions, value: SavedConfigEntry) => void;
};
declare type OptionsTemplate = {
    buildExtraUI?: (base: CactbotConfigurator, container: HTMLElement) => void;
    processExtraOptions?: (options: BaseOptions, savedConfig: SavedConfigEntry) => void;
    options: ConfigEntry[];
};
declare class UserConfig {
    private optionTemplates;
    private savedConfig;
    private userFileCallbacks;
    getDefaultBaseOptions(): BaseOptions;
    evalUserFile(content: string, options: BaseOptions): void;
    registerOptions(overlayName: string, optionTemplate: OptionsTemplate, userFileCallback?: UserFileCallback): void;
    sortUserFiles(keys: string[]): string[];
    filterUserFiles(paths: string[], origOverlayName: string, origExtension: string): string[];
    getUserConfigLocation(overlayName: string, options: BaseOptions, callback: () => void): void;
    loadUserFiles(overlayName: string, options: BaseOptions, callback: () => void): void;
    handleSkin(skinName: string): void;
    appendJSLink(src: string): void;
    appendCSSLink(href: string): void;
    processOptions(options: BaseOptions, savedConfig: SavedConfigEntry, template?: OptionsTemplate): void;
    addUnlockText(lang: Lang): void;
}
declare const _default: UserConfig;
export default _default;
//# sourceMappingURL=user_config.d.ts.map