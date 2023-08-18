import { AppTags, IHelper, NAME_OF_OPEN_TAG, OPEN_CLOSE_TAG } from '../../../types/index';
import './desk.scss';
import appleImage from '../../../assets/apple.svg';
import bowlImage from '../../../assets/bowl.svg';
import pineappleImage from '../../../assets/pineapple.svg';
import trayImage from '../../../assets/tray.svg';
import cheeseImage from '../../../assets/cheese.svg';

export class Desk implements IHelper {
    private table: HTMLDivElement;
    private listOfElementsOnDesk: HTMLElement[] = [];
    constructor() {
        this.table = this.createDesk();
    }
    public setTableListener(helper: HTMLDivElement, listOfElementsOnBoard: HTMLDivElement[]) {
        this.table.addEventListener('mouseover', (event) => {
            const tag: EventTarget | null = event.target;
            if (tag && tag instanceof HTMLElement) {
                if (this.table === tag) return;
                tag.classList.add('hovered');
                const element: HTMLElement | null = this.findHtmlBoardElement(listOfElementsOnBoard, tag);
                if (element) {
                    element.classList.add('active');
                    const rect = tag.getBoundingClientRect();
                    const nameOfTag: string = element.classList[0];
                    this.setHelperText(helper, nameOfTag, tag);
                    helper.classList.add('display');
                    helper.style.top = rect.y - 50 + 'px';
                    if (rect.x > document.documentElement.clientWidth / 2) {
                        helper.style.left = rect.x - 130 + 'px';
                    } else {
                        helper.style.left = rect.x + 50 + 'px';
                    }
                }
            }
        });
        this.table.addEventListener('mouseout', (event) => {
            const tag: EventTarget | null = event.target;
            if (tag && tag instanceof HTMLElement) {
                if (this.table === tag) return;
                tag.classList.remove('hovered');
                const element: HTMLElement | null = this.findHtmlBoardElement(listOfElementsOnBoard, tag);
                if (element) {
                    element.classList.remove('active');
                    helper.classList.remove('display');
                }
            }
        });
    }
    public setHelperText(helper: HTMLDivElement, nameOfTag: string, elementOnDesk: HTMLElement): void {
        const className: string = elementOnDesk.classList[0];
        const id: string = elementOnDesk.id;
        if (className && className !== 'hovered' && className !== 'selected') {
            helper.textContent = `<${nameOfTag} class ="${className}"></${nameOfTag}>`;
        } else if (id) {
            helper.textContent = `<${nameOfTag} id ="${id}"></${nameOfTag}>`;
        } else {
            helper.textContent = `<${nameOfTag}></${nameOfTag}>`;
        }
    }
    private findHtmlBoardElement(
        listOfElementsOnBoard: HTMLDivElement[],
        elementOnDesk: HTMLElement
    ): HTMLElement | null {
        const element: HTMLElement | undefined = listOfElementsOnBoard.find(
            (item) => item.dataset.id === elementOnDesk.dataset.element
        );
        if (element) {
            return element;
        }
        return null;
    }
    public get Table() {
        return this.table;
    }
    public get listOfElementsDesk() {
        return this.listOfElementsOnDesk;
    }
    private createDesk(): HTMLDivElement {
        const gameWrapper: HTMLDivElement = document.createElement('div');
        gameWrapper.classList.add('game-wrapper');
        const deskWrapper: HTMLDivElement = document.createElement('div');
        deskWrapper.classList.add('desk-wrapper');
        const desk: HTMLDivElement = document.createElement('div');
        desk.classList.add('desk');
        const deskEdge: HTMLDivElement = document.createElement('div');
        deskEdge.classList.add('desk-edge');
        const deskLeg1: HTMLDivElement = document.createElement('div');
        deskLeg1.classList.add('desk-leg');
        const deskLeg2: HTMLDivElement = document.createElement('div');
        deskLeg2.classList.add('desk-leg');
        deskEdge.append(deskLeg1, deskLeg2);
        deskWrapper.append(desk);
        gameWrapper.append(deskWrapper, deskEdge);
        const playGround: Element | null = document.querySelector('.play-ground');
        if (playGround) {
            playGround.append(gameWrapper);
        }
        return desk;
    }
    public selectRightElements(rightSelector: string): void {
        const elements: NodeListOf<Element> = document.querySelectorAll(`.desk ${rightSelector}`);
        elements.forEach((e) => {
            e.classList.add('selected');
        });
    }
    public generateElementsOnDesk(code: string): void {
        this.listOfElementsOnDesk.splice(0, this.listOfElementsOnDesk.length);
        const arrCode: string[] = code.split('\n');
        for (let i = 0; i < arrCode.length; i += 1) {
            debugger;
            const nameOfTag: RegExpMatchArray | null = arrCode[i].match(NAME_OF_OPEN_TAG);
            const tags: RegExpMatchArray | null = arrCode[i].match(OPEN_CLOSE_TAG);
            if (tags && nameOfTag) {
                if (tags.length > 1) {
                    const element = this.createElement(arrCode[i], nameOfTag[1], i + 1);
                    this.table.append(element);
                } else {
                    const element = this.createElement(arrCode[i], nameOfTag[1], i + 1);
                    i += 1;
                    while (!arrCode[i].includes(nameOfTag[1])) {
                        const nameOfInnerTag: RegExpMatchArray | null = arrCode[i].match(NAME_OF_OPEN_TAG);
                        if (nameOfInnerTag) {
                            const item = this.createElement(arrCode[i], nameOfInnerTag[1], i + 1);
                            element.append(item);
                        }
                        i += 1;
                    }
                    this.table.append(element);
                }
            }
        }
    }
    private createElement(str: string, nameOfTag: string, id: number): HTMLElement {
        const element = document.createElement(nameOfTag);
        element.dataset.element = id.toString();
        this.defineImage(element, nameOfTag);
        this.setIdClassAttributes(element, str);
        this.listOfElementsOnDesk.push(element);
        return element;
    }
    private setIdClassAttributes(element: HTMLElement, str: string) {
        const attributes = /".+?"/;
        if (str.includes('class')) {
            const arrOfClasses: RegExpMatchArray | null = str.match(attributes);
            if (arrOfClasses) {
                element.classList.add(arrOfClasses[0].slice(1, arrOfClasses[0].length - 1));
            }
        }
        if (str.includes('id')) {
            const arrOfId: RegExpMatchArray | null = str.match(attributes);
            if (arrOfId) {
                element.id = arrOfId[0].slice(1, arrOfId[0].length - 1);
            }
        }
    }
    private defineImage(element: HTMLElement, nameOfTag: string) {
        if (nameOfTag === AppTags.APPLE) {
            element.style.backgroundImage = 'url(' + appleImage + ')';
        } else if (nameOfTag === AppTags.PLATE) {
            element.style.backgroundImage = 'url(' + bowlImage + ')';
        } else if (nameOfTag === AppTags.PINEAPPLE) {
            element.style.backgroundImage = 'url(' + pineappleImage + ')';
        } else if (nameOfTag === AppTags.TRAY) {
            element.style.backgroundImage = 'url(' + trayImage + ')';
        } else if (nameOfTag === AppTags.CHEESE) {
            element.style.backgroundImage = 'url(' + cheeseImage + ')';
        }
    }
}
