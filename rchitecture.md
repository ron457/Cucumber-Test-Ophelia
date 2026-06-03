# Ophelia BDD Playwright Test Framework — Architecture Reference

## Project Overview

**Framework:** Playwright + Cucumber + TypeScript  
**Target:** Practice Software Testing — ToolShop Demo (practicesoftwaretesting.com)  
**Approach:** Behaviour-Driven Development (BDD) with Gherkin scenarios  
**Reporting:** Multiple Cucumber HTML Reporter + screenshots + JSON report  

---

## 1. End-to-End Workflow

```mermaid
flowchart TD
    A([Test Trigger - CI/CD Push or Manual Run]) --> B[Cucumber Runner - cucumber.cjs]
    B --> C[Read Feature Files - tests/features/shop.feature]
    C --> D[Match Step Definitions - shop.steps.ts]
    D --> E[Execute Hooks - Before / AfterStep / After]
    E --> F[Invoke Page Objects - shop.page.ts]
    F --> G[Resolve Locators - shop.locator.ts]
    G --> H[Load Test Data - shop-data.json]
    H --> I[Playwright Browser Actions - Chromium]
    I --> J{Step Result}
    J -->|Pass| K[Capture Screenshot via AfterStep Hook]
    J -->|Fail| K
    K --> L{More Steps?}
    L -->|Yes| D
    L -->|No| M[Generate Reports - HTML and JSON]
    M --> N([Test Run Complete])
```

---

## 2. System Architecture

```mermaid
flowchart TD
    subgraph CI ["CI/CD — GitHub Actions"]
        GH[".github/workflows/playwright.yml"]
    end

    subgraph BDD ["BDD Layer"]
        FF["Feature Files - Gherkin Scenarios"]
        SD["Step Definitions - TypeScript"]
    end

    subgraph Core ["Framework Core"]
        PO["Page Objects - UI Action Methods"]
        LO["Locators - CSS / data-test selectors"]
        TD["Test Data - shop-data.json"]
        HK["Hooks - Before / AfterStep / After"]
        CFG["Config - playwright.config.ts"]
    end

    subgraph Browser ["Browser Automation"]
        PW["Playwright - Chromium Engine"]
        AUT["App Under Test - practicesoftwaretesting.com"]
    end

    subgraph Reporting ["Reporting"]
        RPT["Cucumber HTML Report"]
        SS["Screenshots"]
        JSON["JSON Report"]
    end

    GH --> FF
    FF --> SD
    SD --> HK
    SD --> PO
    PO --> LO
    PO --> TD
    HK --> SS
    CFG --> PW
    PO --> PW
    PW --> AUT
    SD --> RPT
    SD --> JSON
```

---

## 3. Project Directory Structure

```mermaid
flowchart TD
    ROOT["ophelia-framework/"] --> TESTS["tests/"]
    ROOT --> ASSETS["Assets/"]
    ROOT --> UTILS["utilities/"]
    ROOT --> CONFIG["Config/"]
    ROOT --> GITHUB[".github/workflows/"]
    ROOT --> RUNNER["cucumber.cjs"]

    TESTS --> FEAT["features/ — shop.feature"]
    TESTS --> STEPS["step-definitions/ — shop.steps.ts"]
    TESTS --> PAGES["pages/ — shop.page.ts"]

    ASSETS --> TESTDATA["test-data/ — shop-data.json"]
    ASSETS --> SCREENSHOTS["screenshots/"]

    UTILS --> LOCATORS["locators/ — shop.locator.ts"]

    CONFIG --> PWCONFIG["playwright.config.ts"]

    GITHUB --> WORKFLOW["playwright.yml"]
```

---

## 4. Component Responsibility Map

```mermaid
flowchart LR
    subgraph Input ["Input Layer"]
        GHK["Gherkin .feature files"]
        JDATA["JSON Test Data"]
    end

    subgraph Logic ["Logic Layer"]
        SD["Step Definitions - Connects Gherkin to Playwright"]
        PO["Page Objects - Reusable UI methods"]
        LOC["Locators - All selectors centralised"]
    end

    subgraph Execution ["Execution Layer"]
        PW["Playwright - Auto-wait, screenshot, navigation"]
        HK["Hooks - Setup / Teardown / Screenshot"]
        CFG["Config - Browser, timeout, baseURL"]
    end

    subgraph Output ["Output Layer"]
        HTML["HTML Report"]
        SS["Step Screenshots"]
        JRPT["JSON Report"]
    end

    GHK --> SD
    JDATA --> PO
    SD --> PO
    PO --> LOC
    PO --> PW
    HK --> PW
    CFG --> PW
    PW --> HTML
    HK --> SS
    PW --> JRPT
```

---

## 5. Module Execution Flow (Tag-Based)

```mermaid
flowchart TD
    START([npx cucumber-js]) --> TAG{Execution Tag?}

    TAG -->|smoke| M1["Module 1 - Homepage & Navigation"]
    TAG -->|login| M2["Module 2 - Authentication"]
    TAG -->|register| M3["Module 3 - Registration"]
    TAG -->|cart| M4["Module 4 - Cart Flow"]
    TAG -->|checkout| M5["Module 5 - Authenticated Checkout"]
    TAG -->|checkout-guest| M6["Module 6 - Guest Checkout"]
    TAG -->|regression| ALL["All Modules"]

    M1 --> RESULTS
    M2 --> RESULTS
    M3 --> RESULTS
    M4 --> RESULTS
    M5 --> RESULTS
    M6 --> RESULTS
    ALL --> RESULTS

    RESULTS([Results and Report])
```

---

## 6. Module 1 — Homepage & Navigation Flow

```mermaid
flowchart TD
    A([Browser Opens - Base URL]) --> B[Wait for Page Load]
    B --> C["Wait for Product Cards - isVisible check"]
    C --> D{Skeleton Loading?}
    D -->|Yes - loop| C
    D -->|No| E[Product Grid Rendered]
    E --> F[Browse Navigation]
    F --> G[Select Product]
    G --> H[Open Product Detail Page]
    H --> I[Click Add to Cart]
    I --> J[Assert Toast Notification]
    J --> K[Open Cart]
    K --> L{Product in Cart?}
    L -->|Yes| M([PASS])
    L -->|No| N([FAIL])
```

---

## 7. Module 2 — Authentication Flow

```mermaid
flowchart TD
    A([Homepage Loaded]) --> B[Click Sign In]
    B --> C[Login Page Loads]
    C --> D[Enter Email from test-data]
    D --> E[Enter Password from test-data]
    E --> F[Click Submit]
    F --> G{Authentication Result}
    G -->|Success| H[Assert Authenticated State]
    G -->|Failure| I[Error Message Displayed]
    H --> J([PASS - User Session Established])
    I --> K([FAIL])
```

---

## 8. Module 3 — Registration Flow

```mermaid
flowchart TD
    A([Homepage Loaded]) --> B[Navigate to Register]
    B --> C[Fill First Name and Last Name]
    C --> D[Fill Date of Birth and Country]
    D --> E["Fill Address - House, Street, City, State, Postal"]
    E --> F[Fill Phone and Email]
    F --> G[Fill Password]
    G --> H{Password Validation}
    H -->|Invalid chars| I[Adjust Password - Remove special chars]
    I --> G
    H -->|Valid| J[Submit Registration Form]
    J --> K{Account Created?}
    K -->|Yes| L[Assert Authenticated]
    K -->|No| M([FAIL])
    L --> N([PASS])
```

---

## 9. Module 4 — Cart Flow

```mermaid
flowchart TD
    A([Homepage Loaded]) --> B[Select Hardware Product]
    B --> C[Product Detail Page]
    C --> D[Click Add to Cart]
    D --> E[Assert Success Toast - Top-right notification]
    E --> F[Open Cart Page]
    F --> G[Assert Product Name]
    G --> H[Assert Quantity equals 1]
    H --> I[Assert Correct Price]
    I --> J{All Assertions Pass?}
    J -->|Yes| K([PASS])
    J -->|No| L([FAIL])
```

---

## 10. Module 5 — Authenticated Checkout Flow

```mermaid
flowchart TD
    A([Product in Cart]) --> B["Proceed to Checkout - proceed-1"]
    B --> C[Step 2 - Sign In Page]
    C --> D[Enter Credentials from test-data]
    D --> E[Click Login Submit]
    E --> F{Login Success?}
    F -->|Yes| G["Click proceed-2"]
    F -->|No| H([FAIL or Switch to Guest])
    G --> I[Step 3 - Billing Address]
    I --> J[Fill Billing Form from test-data]
    J --> K["proceedBilling - auto-detect proceed-3 vs proceed-2"]
    K --> L[Step 4 - Payment]
    L --> M[Select Cash on Delivery]
    M --> N[Click Finish]
    N --> O[Assert Order Confirmation]
    O --> P([PASS])
```

---

## 11. Module 6 — Guest Checkout Flow

```mermaid
flowchart TD
    A([Product in Cart]) --> B["Click proceed-1 - Arrives at Sign In Step"]
    B --> C[Fill Email and Password]
    C --> D[Click Login Submit]
    D --> E{Wait up to 10s for Error Text}
    E -->|Error Detected| F["Click Continue as Guest Tab"]
    E -->|Timeout or Auth Success| G([Auth Flow or FAIL])
    F --> H[Fill Guest Email]
    H --> I[Fill Guest First Name and Last Name]
    I --> J[Click Guest Submit]
    J --> K["Assert - Continuing as guest: Guest"]
    K --> L["Click proceed-2-guest - Arrives at Billing Address"]
    L --> M[Fill Billing Form]
    M --> N["proceedBilling - Auto-detects proceed-3"]
    N --> O[Select Cash on Delivery]
    O --> P[Click Finish - 1st time]
    P --> Q[Assert payment-success-message visible]
    Q --> R[Click Finish - 2nd time]
    R --> S["Assert: Thanks for your order!"]
    S --> T([PASS])
```

---

## 12. Screenshot Capture Hook Flow

```mermaid
flowchart TD
    A([AfterStep Hook Triggered]) --> B[Every Step Completion]
    B --> C{Step Status}
    C -->|Pass| D[Capture Full-Page Screenshot]
    C -->|Fail| D
    D --> E["Save to Assets/screenshots/"]
    E --> F["Filename: step-name-timestamp.png"]
    F --> G[Attach to Cucumber Report]
    G --> H([Screenshot Archived])
```

---

## 13. CI/CD Pipeline Flow

```mermaid
flowchart TD
    A([Git Push to Repository]) --> B["GitHub Actions Triggered - playwright.yml"]
    B --> C[Checkout Repository]
    C --> D["Install Node.js 18+"]
    D --> E["npm install - Install dependencies"]
    E --> F["npx playwright install - Chromium Browser"]
    F --> G["Run Tests - npx cucumber-js"]
    G --> H{Test Results}
    H -->|All Pass| I[Generate HTML Report]
    H -->|Any Fail| J["Generate HTML Report + Failure Screenshots"]
    I --> K[Upload Artifacts]
    J --> K
    K --> L([Pipeline Complete])
```

---

## 14. Test Data Flow

```mermaid
flowchart LR
    subgraph JSON ["shop-data.json"]
        LOGIN["login - email and password"]
        GUEST["guest - email, firstName, lastName"]
        REG["registration - full user profile"]
        BILLING["billing - address fields"]
    end

    subgraph Modules ["Test Modules"]
        M2["Auth / Guest Fallback"]
        M3["Registration"]
        M5["Authenticated Checkout"]
        M6["Guest Checkout"]
    end

    LOGIN --> M2
    LOGIN --> M5
    GUEST --> M6
    REG --> M3
    BILLING --> M5
    BILLING --> M6
```

---

## 15. proceedBilling Auto-Detection Logic

```mermaid
flowchart TD
    A(["proceedBilling called"]) --> B{"Is proceed-3 visible?"}
    B -->|Yes - Guest Flow| C["Click proceed-3"]
    B -->|No - Auth Flow| D["Click proceed-2"]
    C --> E([Arrives at Payment Step])
    D --> E
```

---

## 16. Acceptance Criteria Status

| ID | Criteria | Status |
|----|----------|--------|
| AC-01 | Each tagged module executes independently | Passing |
| AC-02 | Homepage loads and product grid renders within timeout | Passing |
| AC-03 | Login flow authenticates a valid user | Passing |
| AC-04 | Registration flow creates a new account | Passing |
| AC-05 | Cart flow adds product and validates contents | Passing |
| AC-06 | Authenticated checkout completes all 4 steps | Passing |
| AC-07 | Guest checkout detects login failure and falls back to guest flow | Passing |
| AC-08 | Guest checkout handles double-finish confirmation flow | Passing |
| AC-09 | Screenshots captured at every step via AfterStep hook | Passing |
| AC-10 | Cucumber HTML report generated after each run | Passing |
| AC-11 | proceedBilling auto-detects proceed-3 vs proceed-2 for guest vs auth | Passing |
| AC-12 | Framework requires only tests folder changes for a new site | Passing |

