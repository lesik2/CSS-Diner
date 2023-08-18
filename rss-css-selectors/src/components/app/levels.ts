import { ILevel } from '../../types/index';

export const LEVELS: ILevel[] = [
    {
        htmlCode: `<plate id ="blue"></plate>
<plate>
<apple class ="green"></apple>
<apple id ="delicious"></apple>
<apple></apple>
</plate>
<apple></apple>
<apple></apple>
<apple></apple>`,
        description: `Select all apples`,
        rightSelector: 'apple',
    },
    {
        htmlCode: `
<plate></plate>
<plate id ="small"></plate>
<plate></plate>`,
        description: `Now select small plate`,
        rightSelector: '#small',
    },
    {
        htmlCode: `
<plate>
<pineapple></pineapple>
</plate>
<pineapple></pineapple>`,
        description: `Select pineapple on the plate`,
        rightSelector: 'plate pineapple',
    },
    {
        htmlCode: `
<plate>
<apple></apple>
</plate>
<plate>
<apple class ="green"></apple>
</plate>`,
        description: `Select green apple`,
        rightSelector: '.green',
    },
    {
        htmlCode: `
<plate>
<apple class ="green"></apple>
<apple class ="green"></apple>
<apple class ="green"></apple>
</plate>
<plate></plate>`,
        description: `That's tricky! You have to select the center apple`,
        rightSelector: 'plate>apple:nth-child(2)',
    },
    {
        htmlCode: `
<plate>
<cheese></cheese>
</plate>
<plate>
<apple class ="green"></apple>
<apple></apple>
</plate>`,
        description: `You have to select everything except plates`,
        rightSelector: ':not(plate)',
    },
    {
        htmlCode: `
<plate>
<pineapple id = "huge"></pineapple>
</plate>
<tray>
<cheese></cheese>
<cheese></cheese>
</tray>`,
        description: `You'll do this! You have to select all cheese on the tray`,
        rightSelector: 'tray>cheese',
    },
    {
        htmlCode: `
<tray>
<pineapple></pineapple>
</tray>
<tray>
<pineapple></pineapple>
</tray>
<pineapple></pineapple>`,
        description: `Select pineapple on the center tray`,
        rightSelector: 'tray:nth-child(2)>pineapple',
    },
    {
        htmlCode: `
<apple></apple>
<pineapple></pineapple>
<plate>
<pineapple></pineapple>
</plate>
<pineapple></pineapple>`,
        description: ` You have to select all pineapples after apple`,
        rightSelector: 'apple~pineapple',
    },
    {
        htmlCode: `
<plate>
<apple></apple>
<apple></apple>
</plate>
<tray>
<apple></apple>
<apple class ="green"></apple>
</tray>`,
        description: `Select the first apple on the plate`,
        rightSelector: 'plate>apple:first-child',
    },
];
