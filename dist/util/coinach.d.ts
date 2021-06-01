export declare class CoinachReader {
    coinachPath: string;
    ffxivPath: string;
    verbose: boolean;
    constructor(coinachPath: string | null, ffxivPath: string | null, verbose?: boolean);
    exd(table: string, lang: string): Promise<string[]>;
    rawexd(table: string, lang: string): Promise<string[]>;
    _coinachCmd(coinachCmd: string, table: string, lang: string): Promise<string[]>;
}
export declare class CoinachWriter {
    cactbotPath: string;
    verbose: boolean;
    constructor(cactbotPath: string | null, verbose: boolean);
    _findCactbotPath(): string;
    write(filename: string, scriptname: string, variable: string | null, d: unknown[]): Promise<void>;
    writeTypeScript(filename: string, scriptname: string, header: string | null, type: string | null, asConst: boolean | null, data: unknown[]): Promise<void>;
}
//# sourceMappingURL=coinach.d.ts.map