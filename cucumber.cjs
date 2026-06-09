module.exports = {
  default: {
    paths: ['tests/features/**/*.feature'],
    import: ['tests/step-definitions/**/*.ts'],
    loader: ['ts-node/esm'],
    format: ['json:reports/cucumber-report.json']
  }
};