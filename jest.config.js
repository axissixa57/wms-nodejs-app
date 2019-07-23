module.exports = {
  roots: [
    '<rootDir>/tests' // путь где искать тесты
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js$', // где ещё могут лежать тесты (папка __tests__ например), расширения файлов, названия файлов (spec - это спецификация)
  moduleFileExtensions: ['js'],
  testEnvironment: 'node'
};
