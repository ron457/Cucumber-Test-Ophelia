import report from 'multiple-cucumber-html-reporter';

report.generate({
  jsonDir: 'reports',
  reportPath: 'reports/html-report',

  pageTitle: 'Tools Buying Automation Report',
  reportName: 'Playwright + Cucumber Execution Report',

  displayDuration: true,
  durationInMS: true,
  openReportInBrowser: true,

  metadata: {
    browser: {
      name: 'chrome',
      version: 'latest'
    },
    device: 'Local Machine',
    platform: {
      name: 'Windows',
      version: '11'
    }
  },

  customData: {
    title: 'Project Information',
    data: [
      {
        label: 'Project',
        value: 'Tools Buying Site Automation'
      },
      {
        label: 'Framework',
        value: 'Playwright + Cucumber + TypeScript'
      },
      {
        label: 'BDD',
        value: 'Gherkin'
      }
    ]
  }
});