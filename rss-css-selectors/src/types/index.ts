export interface ILevel {
    htmlCode: string;
    description: string;
    rightSelector: string;
}
export interface IHelper {
    setHelperText(helper: HTMLDivElement, nameOfTag: string, elementOnDesk: HTMLElement): void;
}
export enum AppTags {
    PLATE = 'plate',
    APPLE = 'apple',
    PINEAPPLE = 'pineapple',
    TRAY = 'tray',
    CHEESE = 'cheese',
}
export enum Tags {
    DIV = 'div',
    SPAN = 'span',
}
export const NUMBERS = '1 2 3 4 5 6 7 8 9 10 11';
export const ENDGAMETEXT = `You've done it!`;
export type HTMLDivSpan = HTMLDivElement | HTMLSpanElement;
export const OPEN_CLOSE_TAG = /<\/?[a-z][a-z0-9]*(\s|>)/gi;
export const NAME_OF_OPEN_TAG = /<([^\s>]+)(\s|>)+/;
