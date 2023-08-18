import { ENDGAMETEXT, ILevel } from '../../types/index';
import { HtmlBoard } from '../view/htmlView/HtmlBoard';
import { LEVELS } from './levels';
import Git from '../../assets/git-image.svg';
import Logo from '../../assets/logo.svg';
import { Desk } from '../view/deskVeiw/Desk';
import { CssBoard } from '../view/cssView/CssBoard';
import bulbImg from '../../assets/bulb.svg';
import { ListOfLevels } from '../view/levelsVeiw/ListoFLavels';

export class App {
    private currentLevel: ILevel;
    private numberOfCurrentLevel: number;
    private htmlBoard: HtmlBoard;
    private desk: Desk;
    private helper: HTMLDivElement;
    private cssBoard: CssBoard;
    private bulb: HTMLImageElement;
    private description: HTMLHeadElement;
    private useHelp: boolean;
    private listOfLevels: ListOfLevels;
    constructor() {
        this.useHelp = false;
        const localLevel: string | null = localStorage.getItem('currentLevel');
        this.numberOfCurrentLevel = Number(localLevel ?? 0);
        this.currentLevel = LEVELS[this.numberOfCurrentLevel];
        const playGround: Element | null = document.querySelector('.play-ground');
        if (!playGround) throw new Error('PlayGround is not  defined');
        this.description = this.createDescriptionForTask(playGround);
        this.bulb = this.createSolver(playGround);
        this.helper = this.createHelper(playGround);
        const editor: Element | null = document.querySelector('.editor');
        if (!editor) throw new Error('Editor is not  defined');
        this.htmlBoard = new HtmlBoard(editor);
        this.cssBoard = new CssBoard(editor);
        this.listOfLevels = new ListOfLevels(LEVELS.length, this.numberOfCurrentLevel, this.cssBoard.input);
        this.desk = new Desk();
        this.loadImagesForFooter();
        this.setListenerForBurgerMenu();

        this.cssBoard.input.addEventListener('levelChanged', (event: Event) => {
            if (event instanceof CustomEvent) {
                if (event.detail.reset) {
                    this.resetGame(0);
                    localStorage.clear();
                    return;
                }
                const numberOfNextLevel = Number(event.detail.idLevel);
                const nexLevel: Element | null = this.listOfLevels.listLevels.querySelector(
                    `[data-level='${numberOfNextLevel}']`
                );
                const currentLevel: Element | null = this.listOfLevels.listLevels.querySelector(
                    `[data-level='${this.numberOfCurrentLevel}']`
                );
                if (event.detail.completedLevel) {
                    if (this.bulb.classList.contains('broken')) {
                        currentLevel?.classList.add('helped');
                        localStorage.setItem(this.numberOfCurrentLevel.toString(), 'helped');
                    } else {
                        currentLevel?.classList.add('completed');
                        localStorage.setItem(this.numberOfCurrentLevel.toString(), 'completed');
                    }
                }
                if (numberOfNextLevel < LEVELS.length) {
                    currentLevel?.classList.remove('current');
                    nexLevel?.classList.add('current');
                    this.resetGame(numberOfNextLevel);
                } else {
                    this.endOfGame();
                }
            }
        });
        this.bulb.addEventListener('click', () => {
            if (!this.useHelp) {
                this.bulb.classList.remove('bulb-lite');
                this.bulb.classList.add('broken');
                let i = 0;
                this.cssBoard.input.value = '';
                const typing = async () => {
                    if (i < this.currentLevel.rightSelector.length) {
                        this.cssBoard.input.value += this.currentLevel.rightSelector[i];
                        i += 1;
                        setTimeout(typing, 50);
                    } else {
                        this.cssBoard.disabledBtn = false;
                        this.cssBoard.Enter.removeAttribute('disabled');
                    }
                };
                this.cssBoard.Enter.setAttribute('disabled', 'true');
                this.cssBoard.disabledBtn = true;
                typing();
                this.cssBoard.input.classList.remove('animated');
                this.useHelp = true;
            }
        });
    }
    private endOfGame(): void {
        this.description.textContent = '';
        this.useHelp = true;
        this.bulb.classList.add('broken');
        this.htmlBoard.HtmlCode.textContent = '';
        const span = document.createElement('span');
        span.classList.add('end-game');
        span.textContent = ENDGAMETEXT;
        this.desk.Table.textContent = '';
        this.desk.Table.append(span);
        this.cssBoard.input.value = '';
    }
    private resetGame(newLevel: number): void {
        this.numberOfCurrentLevel = newLevel;
        localStorage.setItem('currentLevel', newLevel.toString());
        this.currentLevel = LEVELS[this.numberOfCurrentLevel];
        this.htmlBoard.HtmlCode.textContent = '';
        this.desk.Table.textContent = '';
        this.cssBoard.input.value = '';
        this.bulb.classList.remove('broken');
        this.startGame();
    }
    public startGame(): void {
        this.cssBoard.input.classList.add('animated');
        this.useHelp = false;
        this.bulb.classList.add('bulb-lite');
        this.description.textContent = this.currentLevel.description;
        this.htmlBoard.generateHtmlCode(this.currentLevel.htmlCode);
        this.desk.generateElementsOnDesk(this.currentLevel.htmlCode);
        this.desk.selectRightElements(this.currentLevel.rightSelector);
        this.cssBoard.setEnterListener(this.currentLevel.rightSelector, this.numberOfCurrentLevel);
        this.desk.setTableListener(this.helper, this.htmlBoard.ListOfTagsElements);
        this.htmlBoard.setListenerForHtmlCode(this.helper, this.desk.listOfElementsDesk);
    }
    private createDescriptionForTask(playGround: Element): HTMLHeadElement {
        const description = document.createElement('h2');
        description.classList.add('description');
        playGround.append(description);
        return description;
    }
    private createSolver(playGround: Element): HTMLImageElement {
        const bulb = document.createElement('img');
        bulb.classList.add('bulb', 'bulb-lite');
        bulb.src = bulbImg;
        bulb.setAttribute('alt', 'bulb for helping solve the task');
        playGround.append(bulb);
        return bulb;
    }
    private createHelper(playGround: Element): HTMLDivElement {
        const helper = document.createElement('div');
        helper.classList.add('helper');
        playGround.append(helper);
        return helper;
    }
    private loadImagesForFooter(): void {
        const gitImg: Element | null = document.querySelector('.git-img');
        const gitCourse: Element | null = document.querySelector('.rs-course-img');
        if (gitImg && gitCourse) {
            gitImg.setAttribute('src', Git);
            gitCourse.setAttribute('src', Logo);
        }
    }
    private setListenerForBurgerMenu() {
        const burgerMenu: Element | null = document.querySelector('.header__burger');
        const wrapper: Element | null = document.querySelector('.body-wrapper');
        if (!wrapper) throw new Error('body wrapper is not defined');
        if (burgerMenu) {
            burgerMenu.addEventListener('click', () => {
                wrapper.classList.toggle('open');
            });
        }
    }
}
