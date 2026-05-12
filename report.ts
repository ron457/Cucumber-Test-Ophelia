import report from 'multiple-cucumber-html-reporter';

report.generate({
  jsonDir: 'reports',
  reportPath: 'reports/html-report',
  metadata: {
    browser: {
      name: 'chrome',
      version: 'latest'
    },
    device: 'Local test machine',
    platform: {
      name: 'windows',
      version: '11'
    }
  },
  customData: {
    title: 'Execution Info',
    data: [
      { label: 'Project', value: 'Ophelia / Cucumber-test' },
      { label: 'Framework', value: 'Playwright + Cucumber + TypeScript' },
      { label: 'Report Generated', value: new Date().toLocaleString() }
    ]
  }
});