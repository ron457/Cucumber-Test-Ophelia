import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// @ts-ignore - Bypasses missing type definitions for this JavaScript module
const reporter = require('multiple-cucumber-html-reporter');

reporter.generate({
  jsonDir: 'reports', // Make sure your Cucumber JSON files are saved in this folder!
  reportPath: 'reports/html-report',
  openReportInBrowser: true,
  saveCollectedJSON: true,
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
      { label: 'Project', value: 'Ophelia BDD Commerce Suite' },
      { label: 'Framework', value: 'Playwright + Cucumber + TypeScript' },
      { label: 'Target', value: 'https://practicesoftwaretesting.com' },
      { label: 'Report Generated', value: new Date().toLocaleString() }
    ]
  }
});