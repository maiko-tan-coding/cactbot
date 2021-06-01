declare type Scope = object;
declare type Param = any;
declare type CallbackFunction = (...args: Param) => void;
declare type EventMapEntry = {
    event: string;
    scope: Scope;
    callback: CallbackFunction;
};
/**
 * This is a base class that classes can extend to inherit event bus capabilities.
 * This allows other classes to listen for events with the `on` function.
 * The inheriting class can fire those events with the `dispatch` function.
 */
export default class EventBus {
    private listeners;
    /**
     * Subscribe to an event
     *
     * @param event The event(s) to subscribe to, space separated
     * @param callback The callback to invoke
     * @param scope Optional. The scope to apply the function against
     * @returns The callbacks registered to the event(s)
     */
    on(event: string, callback?: CallbackFunction, scope?: Scope): EventMapEntry[];
    /**
     * Dispatch an event to any subscribers
     *
     * @param event The event to dispatch
     * @param eventArguments The event arguments to pass to listeners
     * @returns A promise that can be await'd or ignored
     */
    dispatch(event: string, ...eventArguments: Param): Promise<void>;
}
export {};
//# sourceMappingURL=EventBus.d.ts.map