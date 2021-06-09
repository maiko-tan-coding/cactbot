import { Lang, NonEnLang } from '../../resources/languages';
export declare const syncKeys: {
    seal: string;
    unseal: string;
    engage: string;
};
declare type CommonReplacement = {
    replaceSync: {
        [replaceKey: string]: {
            [key in Lang]?: string;
        };
    };
    replaceText: {
        [replaceKey: string]: {
            [key in NonEnLang]?: string;
        } & {
            en?: never;
        };
    };
};
export declare const commonReplacement: CommonReplacement;
export declare const partialCommonReplacementKeys: string[];
export {};
//# sourceMappingURL=common_replacement.d.ts.map