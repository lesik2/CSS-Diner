import { NUMBERS } from '../../../types/index';
import './cssBoard.scss';
export class CssBoard {
    private enter: HTMLButtonElement;
    private cssInput: HTMLInputElement;
    public disabledBtn = false;
    constructor(editor: Element) {
        [this.enter, this.cssInput] = this.createBoard(editor);
        this.cssInput.classList.add('animated');
        this.cssInput.addEventListener('input', (e: Event) => {
            const target: EventTarget | null = e.target;
            if (target && target instanceof HTMLInputElement) {
                const value: string = target.value;
                if (value === '') {
                    this.cssInput.classList.add('animated');
                } else {
                    this.cssInput.classList.remove('animated');
                }
            }
        });
    }
    public setEnterListener(rightAnswer: string, numberOfLevel: number): void {
        this.cssInput.addEventListener('levelChanged', () => {
            document.removeEventListener('keydown', documentKeyDown);
            this.enter.removeEventListener('mousedown', enterMouseDown);
        });
        const documentKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Enter' && !this.disabledBtn) {
                this.enter.classList.add('click');
                this.checkAnswer(this.cssInput.value, rightAnswer, numberOfLevel);
            }
        };
        const enterMouseDown = () => {
            if (!this.disabledBtn) {
                this.enter.classList.add('click');
                this.checkAnswer(this.cssInput.value, rightAnswer, numberOfLevel);
            }
        };
        document.addEventListener('keydown', documentKeyDown);

        document.addEventListener('keyup', (event) => {
            if (event.code === 'Enter' && !this.disabledBtn) {
                this.enter.classList.remove('click');
            }
        });
        this.enter.addEventListener('mousedown', enterMouseDown);
        this.enter.addEventListener('mouseup', () => {
            if (!this.disabledBtn) {
                this.enter.classList.remove('click');
            }
        });
    }
    public get input() {
        return this.cssInput;
    }
    public get Enter() {
        return this.enter;
    }
    private createBoard(editor: Element): [HTMLButtonElement, HTMLInputElement] {
        const cssBoard: HTMLDivElement = document.createElement('div');
        cssBoard.classList.add('css-board');
        const cssHeader: HTMLDivElement = document.createElement('div');
        cssHeader.classList.add('css-board__header');
        cssHeader.innerText = 'Css Editor';
        const cssBody: HTMLDivElement = document.createElement('div');
        cssBody.classList.add('css-board-body');
        const cssNumbers: HTMLDivElement = document.createElement('div');
        cssNumbers.classList.add('css-board-body__numbers');
        cssNumbers.textContent = NUMBERS;
        const cssCode: HTMLDivElement = document.createElement('div');
        cssCode.classList.add('css-board-body__code');
        const input: HTMLInputElement = document.createElement('input');
        input.classList.add('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Type in a CSS selector');
        const button: HTMLButtonElement = document.createElement('button');
        button.classList.add('enter-button');
        button.textContent = 'enter';
        cssCode.append(input, button);
        cssBody.append(cssNumbers, cssCode);
        cssBoard.append(cssHeader, cssBody);
        editor.append(cssBoard);
        return [button, input];
    }
    private checkAnswer(answer: string, rightAnswer: string, numberOfLevel: number) {
        try {
            const rightElements: NodeListOf<Element> = document.querySelectorAll(`.desk ${rightAnswer}`);
            const elements: NodeListOf<Element> = document.querySelectorAll(`.desk ${answer}`);
            if (elements.length === 0 || answer === '') {
                this.shakeBoard();
            } else if (this.equalListOfNodes(Array.from(rightElements), Array.from(elements))) {
                setTimeout(
                    () =>
                        this.cssInput.dispatchEvent(
                            new CustomEvent('levelChanged', {
                                detail: { idLevel: numberOfLevel + 1, completedLevel: true, reset: false },
                            })
                        ),
                    500
                );
                rightElements.forEach((e) => {
                    e.classList.add('lift');
                });
            } else {
                elements.forEach((e) => {
                    e.classList.add('shake');
                    e.addEventListener('animationend', () => {
                        e.classList.remove('shake');
                    });
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
                this.shakeBoard();
            }
        }
    }
    private shakeBoard(): void {
        const element: Element | null = document.querySelector('.editor');
        if (element) {
            element.classList.add('shake');
            element.addEventListener('animationend', () => {
                element.classList.remove('shake');
            });
        }
    }
    private equalListOfNodes(rightElements: Element[], Element: Element[]): boolean {
        return rightElements.length === Element.length && rightElements.every((e, i) => e === Element[i]);
    }
}
