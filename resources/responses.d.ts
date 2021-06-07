import { ResponseOutput, ResponseFunc, TargetedMatches, Output } from '../types/trigger';
import { RaidbossData as Data } from '../types/data';
declare type TargetedResponseOutput = ResponseOutput<Data, TargetedMatches>;
declare type Severity = 'info' | 'alert' | 'alarm';
declare type SevText = 'infoText' | 'alertText' | 'alarmText';
export declare const builtInResponseStr = "cactbot-builtin-response";
export declare const triggerFunctions: string[];
export declare const triggerTextOutputFunctions: string[];
export declare const triggerOutputFunctions: string[];
export declare const severityMap: {
    [sev in Severity]: SevText;
};
export declare const Responses: {
    readonly tankBuster: (targetSev?: "info" | "alert" | "alarm" | undefined, otherSev?: "info" | "alert" | "alarm" | undefined) => (_data: unknown, _matches: unknown, output: Output) => TargetedResponseOutput;
    readonly tankBusterSwap: (busterSev?: "info" | "alert" | "alarm" | undefined, swapSev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => ResponseOutput<Data, import("../types/trigger").Matches<"sourceId" | "source" | "targetId" | "target">>;
    readonly tankCleave: (sev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => {
        [x: string]: (data: Data, matches: TargetedMatches, output: Output) => string | undefined;
    };
    readonly miniBuster: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly aoe: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly bigAoe: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly spread: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly stackMarker: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly getTogether: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly stackMarkerOn: (sev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => {
        [x: string]: (data: Data, matches: TargetedMatches, output: Output) => string | undefined;
    };
    readonly stackMiddle: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly doritoStack: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly spreadThenStack: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly stackThenSpread: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly knockback: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly knockbackOn: (targetSev?: "info" | "alert" | "alarm" | undefined, otherSev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => ResponseOutput<Data, import("../types/trigger").Matches<"sourceId" | "source" | "targetId" | "target">>;
    readonly lookTowards: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly lookAway: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly lookAwayFromTarget: (sev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => {
        [x: string]: (data: Data, matches: TargetedMatches, output: Output) => string | undefined;
    };
    readonly lookAwayFromSource: (sev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => {
        [x: string]: (data: Data, matches: TargetedMatches, output: Output) => string | undefined;
    };
    readonly getBehind: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly goFrontOrSides: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly getUnder: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly getIn: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly getOut: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly outOfMelee: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly getInThenOut: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly getOutThenIn: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly getBackThenFront: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly getFrontThenBack: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly goMiddle: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly goRight: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly goLeft: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly goWest: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly goEast: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly goFrontBack: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly goSides: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly killAdds: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly killExtraAdd: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly awayFromFront: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly sleep: (sev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => {
        [x: string]: (_data: Data, matches: TargetedMatches, output: Output) => string | undefined;
    };
    readonly stun: (sev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => {
        [x: string]: (_data: Data, matches: TargetedMatches, output: Output) => string | undefined;
    };
    readonly interrupt: (sev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => {
        [x: string]: (_data: Data, matches: TargetedMatches, output: Output) => string | undefined;
    };
    readonly preyOn: (targetSev?: "info" | "alert" | "alarm" | undefined, otherSev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => ResponseOutput<Data, import("../types/trigger").Matches<"sourceId" | "source" | "targetId" | "target">>;
    readonly awayFrom: (sev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => {
        [x: string]: (data: Data, matches: TargetedMatches, output: Output) => string | undefined;
    };
    readonly meteorOnYou: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly stopMoving: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly stopEverything: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly moveAway: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly moveAround: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly breakChains: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly moveChainsTogether: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
    readonly earthshaker: (sev?: "info" | "alert" | "alarm" | undefined) => (_data: Data, _matches: unknown, output: Output) => {
        [x: string]: (data: Data, matches: TargetedMatches, output: Output) => string | undefined;
    };
    readonly wakeUp: (sev?: "info" | "alert" | "alarm" | undefined) => ResponseFunc<Data, unknown>;
};
export {};
//# sourceMappingURL=responses.d.ts.map