# Playwright BDD Automation Framework

A scalable end-to-end test automation framework built using Playwright, Cucumber (BDD), and TypeScript following the Page Object Model (POM) design pattern.

---

## Technologies Used

- Playwright
- Cucumber
- TypeScript
- Node.js
- VS Code
- Git & GitHub

---

## Framework Architecture

This framework follows:

- Behavior Driven Development (BDD)
- Page Object Model (POM)
- Data-Driven Testing using JSON
- Reusable Locator Strategy
- Modular Automation Framework Structure

---

## Project Structure

```text
playwright-bdd-tests/
│
├── Assets/
│   └── test-data/
│       └── data.json
│
├── Utilities/
│   └── locators/
│       └── login.locator.ts
│
├── tests/
│   ├── features/
│   │   └── login.feature
│   │
│   ├── pages/
│   │   └── login.page.ts
│   │
│   └── step-definitions/
│       └── login.steps.ts
│
├── cucumber.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## Features Implemented

- Playwright Browser Automation
- Cucumber BDD Framework
- Gherkin Feature Files
- Page Object Model (POM)
- Externalized Locators
- JSON-based Test Data Management
- Multiple Test Users
- Hooks (`Before` and `After`)
- Assertions and Validation
- Chromium Browser Execution
- GitHub Version Control

---

## Test Website Used

The framework currently automates login and booking functionality using:

- SauceDemo  
  https://www.saucedemo.com/
  
- AutomationTesting
  https://automationintesting.online/

This application is commonly used for automation practice because of its stable UI, predictable locators, and reusable test credentials.

---

## Sample BDD Scenario

```gherkin
Feature: Login Functionality

Scenario: Successful login with valid credentials

Given user navigates to login page
When user enters valid username
And user enters valid password
And user clicks on login button
Then user should be redirected to dashboard page
```

---



## Installation

Clone the repository:

```bash
git clone (https://github.com/ron457/Cucumber-Test-Ophelia.git)
```

Move into project directory:

```bash
cd Cucumber-Test-Ophelia
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## Run Tests

Execute all tests:

```bash
npm test
```

---

## Framework Flow

```text
Feature File
   ↓
Step Definitions
   ↓
Page Object Methods
   ↓
Locators + Test Data
   ↓
Playwright Browser Actions
```

---

## Key Learning Outcomes

- Building scalable automation frameworks
- Implementing BDD using Cucumber
- Integrating Playwright with TypeScript
- Designing reusable automation architecture
- Managing test data externally
- Working with asynchronous browser automation
- Debugging synchronization and locator issues

---

## Future Enhancements

- Cross-browser execution
- Parallel execution
- HTML/Allure reporting
- Screenshot capture on failure
- CI/CD pipeline integration
- Retry mechanism
- Environment configuration
- API testing integration
- Jenkins/GitHub Actions integration

---

## Author

Rhitav Gangopadhyay

```
