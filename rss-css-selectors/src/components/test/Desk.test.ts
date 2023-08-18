import { AppTags } from '../../types/index';
import appleImage from '../../assets/apple.svg';
import bowlImage from '../../assets/bowl.svg';
import { Desk } from '../view/deskVeiw/Desk';
import { LEVELS } from '../app/levels';
const mockDefineImage = jest.fn((element: HTMLElement, nameOfTag: string) => {
    if (nameOfTag === AppTags.APPLE) {
        element.style.backgroundImage = 'url(' + appleImage + ')';
    } else if (nameOfTag === AppTags.PLATE) {
        element.style.backgroundImage = 'url(' + bowlImage + ')';
    }
});
describe('Desk.ts', () => {
    test('should set the correct image for htmlElement', () => {
        const element = document.createElement(AppTags.PLATE);
        mockDefineImage(element, AppTags.PLATE);
        expect(element.style.backgroundImage).toBe('url(' + bowlImage + ')');
    });
    test('should create table in constructor', () => {
        const desk = new Desk();
        expect(desk.Table).toBeDefined();
        expect(desk.Table).not.toBeNull();
    });
    test('should set correct text for helper', () => {
        const desk = new Desk();
        const nameOfTag = 'plate';
        const element = document.createElement('plate');
        const helper = document.createElement('div');
        element.classList.add('huge');
        desk.setHelperText(helper, nameOfTag, element);
        expect(helper.textContent).toBe('<plate class ="huge"></plate>');
    });
    test('should add class for every element', () => {
        const desk = new Desk();
        document.body.innerHTML = '<div class = "desk">' + '  <plate></plate>' + '  <plate></plate>' + '</div>';
        desk.selectRightElements('plate');
        const elements = document.querySelectorAll('.desk plate');
        elements.forEach((e) => {
            expect(e.className).toBe('selected');
        });
    });
    test('should call private method createElement in public method', () => {
        const desk = new Desk();
        const createElement = jest.spyOn(Desk.prototype as never, 'createElement');
        createElement.mockImplementation();
        desk.generateElementsOnDesk(LEVELS[1].htmlCode);
        expect(createElement).toHaveBeenCalled();
    });
});
