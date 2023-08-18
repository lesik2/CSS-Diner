import { HTMLDivSpan, IHelper, NAME_OF_OPEN_TAG, NUMBERS, OPEN_CLOSE_TAG, Tags } from '../../../types/index';
import './htmlBoard.scss';
const hljs = require('highlight.js/lib/common');
import 'highlight.js/styles/dark.css';
export class HtmlBoard implements IHelper {
    private htmlCode: HTMLDivElement;
    private listOfTagsElements: HTMLDivElement[] = [];

    constructor(editor: Element) {
        this.htmlCode = this.createBoard(editor);
    }
    public setListenerForHtmlCode(helper: HTMLDivElement, listOfElementsDesk: HTMLElement[]): void {
        this.htmlCode.addEventListener('mouseover', (event) => {
            const tag: EventTarget | null = event.target;
            if (tag && tag instanceof HTMLElement) {
                const closestDiv: HTMLDivElement | null = tag.closest('div');
                if (closestDiv) {
                    if (this.htmlCode === closestDiv) return;
                    closestDiv.classList.add('active');
                    const element: HTMLElement | null = this.findDeskElement(listOfElementsDesk, closestDiv);
                    if (element) {
                        element.classList.add('hovered');

                        const nameOfTag: string = closestDiv.classList[0];
                        const rect = element.getBoundingClientRect();
                        this.setHelperText(helper, nameOfTag, element);
                        helper.classList.add('display');
                        helper.style.top = rect.y - 50 + 'px';
                        if (rect.x > document.documentElement.clientWidth / 2) {
                            helper.style.left = rect.x - 130 + 'px';
                        } else {
                            helper.style.left = rect.x + 50 + 'px';
                        }
                    }
                }
            }
        });

        this.htmlCode.addEventListener('mouseout', (event) => {
            const tag: EventTarget | null = event.target;
            if (tag && tag instanceof HTMLElement) {
                const closestDiv: HTMLDivElement | null = tag.closest('div');
                if (this.htmlCode === closestDiv) return;
                if (closestDiv) {
                    closestDiv.classList.remove('active');
                    const element: HTMLElement | null = this.findDeskElement(listOfElementsDesk, closestDiv);
                    if (element) {
                        element.classList.remove('hovered');
                        helper.classList.remove('display');
                    }
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
    private findDeskElement(listOfElementsDesk: HTMLElement[], elementOnHtmlBoard: HTMLElement): HTMLElement | null {
        const element: HTMLElement | undefined = listOfElementsDesk.find(
            (item) => item.dataset.element === elementOnHtmlBoard.dataset.id
        );
        if (element) {
            return element;
        }
        return null;
    }
    public get HtmlCode() {
        return this.htmlCode;
    }
    public get ListOfTagsElements() {
        return this.listOfTagsElements;
    }
    private createBoard(editor: Element): HTMLDivElement {
        const htmlBoard: HTMLDivElement = document.createElement('div');
        htmlBoard.classList.add('html-board');
        const htmlHeader: HTMLDivElement = document.createElement('div');
        htmlHeader.classList.add('html-board__header');
        htmlHeader.innerText = 'HTML Viewer';
        const htmlBody: HTMLDivElement = document.createElement('div');
        htmlBody.classList.add('html-board-body');
        const htmlNumbers: HTMLDivElement = document.createElement('div');
        htmlNumbers.classList.add('html-board-body__numbers');
        htmlNumbers.innerText = NUMBERS;
        const htmlCode: HTMLDivElement = document.createElement('div');
        htmlCode.classList.add('html-board-body__code');
        htmlBody.append(htmlNumbers, htmlCode);
        htmlBoard.append(htmlHeader, htmlBody);
        editor.append(htmlBoard);
        return htmlCode;
    }
    private createTagElement(tag: string, textContent: string, id?: number, nameOfTag?: string): HTMLDivSpan {
        const element = tag === Tags.DIV ? document.createElement(Tags.DIV) : document.createElement(Tags.SPAN);
        const preTag = document.createElement('pre');
        const codeTag = document.createElement('code');
        codeTag.append(textContent);
        preTag.append(codeTag);
        element.append(preTag);
        if (tag === Tags.DIV && nameOfTag && id) {
            element.classList.add(nameOfTag);
            element.dataset.id = id.toString();
            if (element instanceof HTMLDivElement) {
                this.listOfTagsElements.push(element);
            }
        }
        return element;
    }
    public generateHtmlCode(code: string): void {
        this.ListOfTagsElements.splice(0, this.listOfTagsElements.length);
        const arrCode: string[] = code.split('\n');
        for (let i = 0; i < arrCode.length; i += 1) {
            const nameOfTag: RegExpMatchArray | null = arrCode[i].match(NAME_OF_OPEN_TAG);
            const tags: RegExpMatchArray | null = arrCode[i].match(OPEN_CLOSE_TAG);
            if (tags && nameOfTag) {
                if (tags.length > 1) {
                    const element = this.createTagElement(Tags.DIV, arrCode[i], i + 1, nameOfTag[1]);
                    hljs.highlightElement(element);
                    this.htmlCode.append(element);
                } else {
                    const element = this.createTagElement(Tags.DIV, arrCode[i], i + 1, nameOfTag[1]);
                    hljs.highlightElement(element);
                    i += 1;
                    while (!arrCode[i].includes(nameOfTag[1])) {
                        const nameOfInnerTag: RegExpMatchArray | null = arrCode[i].match(NAME_OF_OPEN_TAG);
                        if (nameOfInnerTag) {
                            const item = this.createTagElement(Tags.DIV, arrCode[i], i + 1, nameOfInnerTag[1]);
                            hljs.highlightElement(item);
                            element.append(item);
                        }
                        i += 1;
                    }
                    const el = this.createTagElement(Tags.SPAN, arrCode[i]);
                    hljs.highlightElement(el);
                    element.append(el);
                    this.htmlCode.append(element);
                }
            }
        }
    }
}
