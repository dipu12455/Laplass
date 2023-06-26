export default {
    testEnvironment: 'node',
    transform: {},
    transformIgnorePatterns: [
        '/node_modules/',
    ],
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    extensionsToTreatAsEsm: ['.js'],
};