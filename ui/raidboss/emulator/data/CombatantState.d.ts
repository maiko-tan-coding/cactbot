export interface PluginState {
    CurrentWorldID?: number;
    WorldID?: number;
    WorldName?: string;
    BNpcID?: number;
    BNpcNameID?: number;
    PartyType?: number;
    ID?: number;
    OwnerID?: number;
    type?: number;
    Job?: number;
    Level?: number;
    Name?: string;
    CurrentHP: number;
    MaxHP: number;
    CurrentMP: number;
    MaxMP: number;
    PosX: number;
    PosY: number;
    PosZ: number;
    Heading: number;
}
export default class CombatantState {
    posX: number;
    posY: number;
    posZ: number;
    heading: number;
    targetable: boolean;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    constructor(posX: number, posY: number, posZ: number, heading: number, targetable: boolean, hp: number, maxHp: number, mp: number, maxMp: number);
    partialClone(props: Partial<CombatantState>): CombatantState;
    toPluginState(): PluginState;
}
//# sourceMappingURL=CombatantState.d.ts.map