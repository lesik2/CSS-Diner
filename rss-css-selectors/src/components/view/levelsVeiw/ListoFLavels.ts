import './listOfLevels.scss';
import tickImage from '../../../assets/tick.svg';
import bulbImg from '../../../assets/bulb.svg';
export class ListOfLevels {
    private listOfLevels: HTMLDivElement;
    private resetLink: HTMLAnchorElement;
    private listOfLinks: HTMLAnchorElement[] = [];
    private levels: HTMLDivElement | null = document.querySelector('.levels');
    constructor(numberOfLevels: number, currentLevel: number, cssInput: HTMLInputElement) {
        [this.listOfLevels, this.resetLink] = this.createListOfLevels(numberOfLevels, currentLevel);
        this.setListenerForResetLink(cssInput);
        this.setListenerForListOfLevels(cssInput);
    }
    private setListenerForResetLink(cssInput: HTMLInputElement): void {
        this.resetLink.addEventListener('click', () => {
            for (let i = 0; i < this.listOfLinks.length; i += 1) {
                this.listOfLinks[i].classList.remove('current');
                this.listOfLinks[i].classList.remove('helped');
                this.listOfLinks[i].classList.remove('completed');
            }
            this.listOfLinks[0].classList.add('current');
            document.querySelector('.body-wrapper')?.classList.remove('open');
            cssInput.dispatchEvent(
                new CustomEvent('levelChanged', {
                    detail: { reset: true },
                })
            );
        });
    }
    private setListenerForListOfLevels(cssInput: HTMLInputElement): void {
        this.listOfLevels.addEventListener('click', (event) => {
            const element: EventTarget | null = event.target;
            if (element && element instanceof HTMLElement) {
                const level: HTMLAnchorElement | null = element.closest('a');
                if (!level) return;
                if (!this.listOfLevels.contains(level)) return;
                document.querySelector('.body-wrapper')?.classList.remove('open');
                cssInput.dispatchEvent(
                    new CustomEvent('levelChanged', {
                        detail: { idLevel: level.getAttribute('data-level'), completedLevel: false, reset: false },
                    })
                );
            }
        });
    }
    public get listLevels(): HTMLDivElement {
        return this.listOfLevels;
    }
    public get ResetLink(): HTMLAnchorElement {
        return this.resetLink;
    }
    public get Levels() {
        return this.levels;
    }
    private createListOfLevels(numberOfLevels: number, currentLevel: number): [HTMLDivElement, HTMLAnchorElement] {
        const list = document.createElement('div');
        list.classList.add('levels-list');
        for (let i = 0; i < numberOfLevels; i += 1) {
            const localLink: string | null = localStorage.getItem(i.toString());
            const link = document.createElement('a');
            link.classList.add('level');
            if (localLink) {
                link.classList.add(localLink);
            }
            link.setAttribute('data-level', i.toString());
            if (i === currentLevel) {
                link.classList.add('current');
            }
            const checkMark = document.createElement('img');
            checkMark.src = tickImage;
            checkMark.alt = 'Checkmark';
            checkMark.classList.add('checkmark');
            const span = document.createElement('span');
            span.classList.add('level-number');
            span.textContent = 'Level ' + (i + 1).toString();
            const help = document.createElement('img');
            help.src = bulbImg;
            help.alt = 'Level solve with help';
            help.classList.add('level-help');
            link.append(checkMark, help, span);
            this.listOfLinks.push(link);
            list.append(link);
        }
        const resetLink = document.createElement('a');
        resetLink.classList.add('reset-progress');
        resetLink.textContent = 'Reset Progress';
        if (this.levels) {
            this.levels.append(list, resetLink);
        }
        return [list, resetLink];
    }
}
