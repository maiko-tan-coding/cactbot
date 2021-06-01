declare type StartMap = {
    [s: string]: {
        id: string;
        next: StartMap;
    };
};
declare type ComboCallback = (id?: string) => void;
export default class ComboTracker {
    comboTimer?: number;
    comboBreakers: readonly string[];
    startMap: StartMap;
    callback: ComboCallback;
    considerNext: StartMap;
    isFinalSkill: boolean;
    constructor(comboBreakers: readonly string[], callback: ComboCallback);
    AddCombo(skillList: string[]): void;
    HandleAbility(id: string): void;
    StateTransition(id?: string, nextState?: StartMap[string]): void;
    AbortCombo(id?: string): void;
    static setup(callback: ComboCallback): ComboTracker;
}
export {};
//# sourceMappingURL=combo_tracker.d.ts.map