export default class TimerBar extends HTMLElement {
    rootElement: HTMLElement;
    foregroundElement: HTMLElement;
    backgroundElement: HTMLElement;
    leftTextElement: HTMLElement;
    centerTextElement: HTMLElement;
    rightTextElement: HTMLElement;
    private _duration;
    private _start;
    private _width;
    private _height;
    private _bg;
    private _fg;
    private _towardRight;
    private _fill;
    private _leftText;
    private _centerText;
    private _rightText;
    private _hideAfter;
    private _loop;
    private _connected;
    private _hideTimer;
    private _animationFrame;
    static get observedAttributes(): string[];
    set bg(c: string | null);
    get bg(): string | null;
    set fg(c: string | null);
    get fg(): string | null;
    set width(w: string | null);
    get width(): string | null;
    set height(w: string | null);
    get height(): string | null;
    set duration(s: string);
    get duration(): string;
    set value(s: string);
    get value(): string;
    set elapsed(s: string);
    get elapsed(): string;
    set toward(t: 'left' | 'right' | null);
    get toward(): 'left' | 'right' | null;
    set stylefill(s: 'empty' | 'fill' | null);
    get stylefill(): 'empty' | 'fill' | null;
    set hideafter(h: string | null);
    get hideafter(): string | null;
    set lefttext(p: string | null);
    get lefttext(): string | null;
    set righttext(p: string | null);
    get righttext(): string | null;
    set centertext(p: string | null);
    get centertext(): string | null;
    set loop(l: boolean);
    get loop(): boolean;
    constructor();
    init(root: ShadowRoot): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | number, newValue: string): void;
    layout(): void;
    updateText(): void;
    draw(): void;
    applyStyles(styles: {
        [s: string]: string;
    }): void;
    setvalue(remainSec: number): void;
    advance(): void;
    show(): void;
    hide(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'timer-bar': TimerBar;
    }
}
//# sourceMappingURL=timerbar.d.ts.map