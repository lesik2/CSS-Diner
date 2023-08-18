module.exports = {
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(tsx?|jsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
            './test/file-mock.js'
        ),
        '\\.(css|less|scss)$': require.resolve('./test/style-mock.js'),
    },
};
