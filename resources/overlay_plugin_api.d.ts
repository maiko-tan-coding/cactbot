import { EventMap, EventType, IOverlayHandler } from '../types/event';
declare global {
    interface Window {
        __OverlayCallback: EventMap[EventType];
        dispatchOverlayEvent?: typeof processEvent;
        OverlayPluginApi: {
            ready: boolean;
            callHandler: (msg: string, cb?: (value: string) => unknown) => void;
        };
        /**
         * @deprecated This is for backward compatibility.
         *
         * It is recommended to import from this file:
         *
         * `import { addOverlayListener } from '/path/to/overlay_plugin_api';`
         */
        addOverlayListener: IAddOverlayListener;
        /**
         * @deprecated This is for backward compatibility.
         *
         * It is recommended to import from this file:
         *
         * `import { removeOverlayListener } from '/path/to/overlay_plugin_api';`
         */
        removeOverlayListener: IRemoveOverlayListener;
        /**
         * @deprecated This is for backward compatibility.
         *
         * It is recommended to import from this file:
         *
         * `import { callOverlayHandler } from '/path/to/overlay_plugin_api';`
         */
        callOverlayHandler: IOverlayHandler;
    }
}
declare type IAddOverlayListener = <T extends EventType>(event: T, cb: EventMap[T]) => void;
declare type IRemoveOverlayListener = <T extends EventType>(event: T, cb: EventMap[T]) => void;
declare const processEvent: <T extends "onPlayerChangedEvent" | "LogLine" | "CombatData" | "ChangeZone" | "ChangePrimaryPlayer" | "FileChanged" | "OnlineStatusChanged" | "PartyChanged" | "BroadcastMessage" | "EnmityTargetData" | "onForceReload" | "onGameExistsEvent" | "onGameActiveChangedEvent" | "onLogEvent" | "onImportLogEvent" | "onInCombatChangedEvent" | "onZoneChangedEvent" | "onFateEvent" | "onCEEvent" | "onPlayerDied" | "onPartyWipe" | "onUserFileChanged">(msg: Parameters<EventMap[T]>[0]) => void;
export declare const dispatchOverlayEvent: <T extends "onPlayerChangedEvent" | "LogLine" | "CombatData" | "ChangeZone" | "ChangePrimaryPlayer" | "FileChanged" | "OnlineStatusChanged" | "PartyChanged" | "BroadcastMessage" | "EnmityTargetData" | "onForceReload" | "onGameExistsEvent" | "onGameActiveChangedEvent" | "onLogEvent" | "onImportLogEvent" | "onInCombatChangedEvent" | "onZoneChangedEvent" | "onFateEvent" | "onCEEvent" | "onPlayerDied" | "onPartyWipe" | "onUserFileChanged">(msg: Parameters<EventMap[T]>[0]) => void;
export declare const addOverlayListener: IAddOverlayListener;
export declare const removeOverlayListener: IRemoveOverlayListener;
export declare const callOverlayHandler: IOverlayHandler;
export declare const setCallOverlayHandlerOverride: (override?: IOverlayHandler | undefined) => IOverlayHandler;
export declare const init: () => void;
export {};
//# sourceMappingURL=overlay_plugin_api.d.ts.map