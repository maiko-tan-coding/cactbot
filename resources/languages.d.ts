export declare const languages: readonly ["en", "de", "fr", "ja", "cn", "ko"];
export declare type Lang = typeof languages[number];
export declare type NonEnLang = Exclude<Lang, 'en'>;
export declare const isLang: (lang?: string | undefined) => lang is "en" | "de" | "fr" | "ja" | "cn" | "ko";
//# sourceMappingURL=languages.d.ts.map