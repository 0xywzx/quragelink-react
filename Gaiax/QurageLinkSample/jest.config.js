module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'vue'
  ],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1'
  },
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  testURL: "http://localhost/",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$"
}
