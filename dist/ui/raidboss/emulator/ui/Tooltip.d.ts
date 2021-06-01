declare const validDirections: readonly ["top", "right", "bottom", "left"];
declare type ValidDirection = typeof validDirections[number];
export default class Tooltip {
    private offset;
    private target;
    private direction;
    private tooltip;
    private inner;
    private arrow;
    private static templates;
    constructor(targetRef: string | HTMLElement, direction: ValidDirection, text: string, autoShow?: boolean, autoHide?: boolean);
    setText(text: string): void;
    show(): void;
    hide(): void;
    static initializeTemplates(): void;
    static getTemplate(dir: string): HTMLTemplateElement;
    static cloneTemplate(direction: ValidDirection): HTMLElement;
}
export {};
//# sourceMappingURL=Tooltip.d.ts.map