export default class TimerIcon extends HTMLElement {
    rootElement: HTMLDivElement;
    borderBackgroundElement: HTMLDivElement;
    borderForegroundElement: HTMLDivElement;
    iconElement: HTMLDivElement;
    textElement: HTMLDivElement;
    readonly kBackgroundOpacity: number;
    readonly kOuterBorderSize: number;
    readonly kAnimateMs: number;
    private _value;
    private _duration;
    private _width;
    private _height;
    private _borderBg;
    private _borderFg;
    private _scale;
    private _hideAfter;
    private _icon;
    private _zoom;
    private _text;
    private _textColor;
    private _colorBorderSize;
    private _connected;
    private _timer;
    private _hideTimer;
    startTimeMs: number;
    static get observedAttributes(): string[];
    set scale(s: string | null);
    get scale(): string | null;
    set bordercolor(c: string | null);
    get bordercolor(): string | null;
    set bordersize(c: string | null);
    get bordersize(): string | null;
    set width(w: string | null);
    get width(): string | null;
    set height(h: string | null);
    get height(): string | null;
    set duration(s: string | null);
    get duration(): string | null;
    set hideafter(h: string | null);
    get hideafter(): string | null;
    set icon(p: string | null);
    get icon(): string | null;
    set zoom(p: string | null);
    get zoom(): string | null;
    set text(p: string | null);
    get text(): string | null;
    set textcolor(p: string | null);
    get textcolor(): string | null;
    constructor();
    init(root: ShadowRoot): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | number, newValue: string): void;
    layout(): void;
    draw(): void;
    reset(): void;
    advance(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'timer-icon': TimerIcon;
    }
}
//# sourceMappingURL=timericon.d.ts.map