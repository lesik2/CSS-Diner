import { HtmlBoard } from '../view/htmlView/HtmlBoard';
import { LEVELS } from '../app/levels';
jest.mock('highlight.js/lib/common');
describe('HtmlBoard.ts', () => {
    test('should create htmlCode in constructor', () => {
        const editor = document.createElement('div');
        const htmlboard = new HtmlBoard(editor);
        expect(htmlboard.HtmlCode).toBeDefined();
        expect(htmlboard.HtmlCode).not.toBeNull();
    });
    test('should append htmlBoard in editor', () => {
        const editor = document.createElement('div');
        const htmlboard = new HtmlBoard(editor);
        expect(editor.children).toHaveLength(1);
    });
    test('should call private method createTagElement in public method', () => {
        const editor = document.createElement('div');
        const htmlboard = new HtmlBoard(editor);
        const createTagElement = jest.spyOn(HtmlBoard.prototype as never, 'createTagElement');
        createTagElement.mockImplementation();
        htmlboard.generateHtmlCode(LEVELS[1].htmlCode);
        expect(createTagElement).toHaveBeenCalled();
    });
});
