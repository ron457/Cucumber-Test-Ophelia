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
    A([Test Trigger\nCI/CD Push / Manual Run]) --> B[Cucumber Runner\ncucumber.cjs]
    B --> C[Read Feature Files\ntests/features/shop.feature]
    C --> D[Match Step Definitions\ntests/step-definitions/shop.steps.ts]
    D --> E[Execute Hooks\nBefore / AfterStep / After]
    E --> F[Invoke Page Objects\ntests/pages/shop.page.ts]
    F --> G[Resolve Locators\nutilities/locators/shop.locator.ts]
    G --> H[Load Test Data\nAssets/test-data/shop-data.json]
    H --> I[Playwright Browser Actions\nChromium]
    I --> J{Step Result}
    J -->|Pass| K[Capture Screenshot\nAfterStep Hook]
    J -->|Fail| K
    K --> L{More Steps?}
    L -->|Yes| D
    L -->|No| M[Generate Reports\nHTML + JSON]
    M --> N([Test Run Complete])
```

---

## 2. System Architecture

```mermaid
flowchart TD
    subgraph CI ["CI/CD — GitHub Actions"]
        GH[.github/workflows/playwright.yml]
    end

    subgraph BDD ["BDD Layer"]
        FF[Feature Files\nGherkin Scenarios]
        SD[Step Definitions\nTypeScript]
    end

    subgraph Framework ["Framework Core"]
        PO[Page Objects\nUI Action Methods]
        LO[Locators\nCSS / data-test selectors]
        TD[Test Data\nshop-data.json]
        HK[Hooks\nBefore / AfterStep / After]
        CFG[Config\nplaywright.config.ts]
    end

    subgraph Browser ["Browser Automation"]
        PW[Playwright\nChromium Engine]
        AUT[Application Under Test\npracticesoftwaretesting.com]
    end

    subgraph Reporting ["Reporting"]
        RPT[Cucumber HTML Report]
        SS[Screenshots]
        JSON[JSON Report]
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
    ROOT[ophelia-framework/] --> TESTS[tests/]
    ROOT --> ASSETS[Assets/]
    ROOT --> UTILS[utilities/]
    ROOT --> CONFIG[Config/]
    ROOT --> GITHUB[.github/workflows/]
    ROOT --> RUNNER[cucumber.cjs]

    TESTS --> FEAT[features/\nshop.feature]
    TESTS --> STEPS[step-definitions/\nshop.steps.ts]
    TESTS --> PAGES[pages/\nshop.page.ts]

    ASSETS --> TESTDATA[test-data/\nshop-data.json]
    ASSETS --> SCREENSHOTS[screenshots/]

    UTILS --> LOCATORS[locators/\nshop.locator.ts]

    CONFIG --> PWCONFIG[playwright.config.ts]

    GITHUB --> WORKFLOW[playwright.yml]
```

---

## 4. Component Responsibility Map

```mermaid
flowchart LR
    subgraph Input ["Input Layer"]
        GHK[Gherkin .feature files]
        JDATA[JSON Test Data]
    end

    subgraph Logic ["Logic Layer"]
        SD[Step Definitions\nConnects Gherkin → Playwright]
        PO[Page Objects\nReusable UI methods]
        LOC[Locators\nAll selectors centralised]
    end

    subgraph Execution ["Execution Layer"]
        PW[Playwright\nAuto-wait, screenshot, navigation]
        HK[Hooks\nSetup / Teardown / Screenshot]
        CFG[Config\nBrowser, timeout, baseURL]
    end

    subgraph Output ["Output Layer"]
        HTML[HTML Report]
        SS[Step Screenshots]
        JRPT[JSON Report]
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
    START([npx cucumber-js]) --> TAG{Execution Tag}

    TAG -->|@smoke| M1[Module 1\nHomepage & Navigation]
    TAG -->|@login| M2[Module 2\nAuthentication]
    TAG -->|@register| M3[Module 3\nRegistration]
    TAG -->|@cart| M4[Module 4\nCart Flow]
    TAG -->|@checkout| M5[Module 5\nAuthenticated Checkout]
    TAG -->|@checkout-guest| M6[Module 6\nGuest Checkout]
    TAG -->|@regression| ALL[All Modules]

    M1 --> PASS
    M2 --> PASS
    M3 --> PASS
    M4 --> PASS
    M5 --> PASS
    M6 --> PASS
    ALL --> PASS

    PASS([Results & Report])
```

---

## 6. Module 1 — Homepage & Navigation Flow

```mermaid
flowchart TD
    A([Browser Opens\nBase URL]) --> B[Wait for Page Load]
    B --> C[Wait for Product Cards\nisVisible check]
    C --> D{Skeleton\nLoading?}
    D -->|Yes| C
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
    F --> G{Authentication\nResult}
    G -->|Success| H[Assert Authenticated State]
    G -->|Failure| I[Error Message Displayed]
    H --> J([PASS — User Session Established])
    I --> K([FAIL])
```

---

## 8. Module 3 — Registration Flow

```mermaid
flowchart TD
    A([Homepage Loaded]) --> B[Navigate to Register]
    B --> C[Fill First Name]
    C --> D[Fill Last Name]
    D --> E[Fill Date of Birth]
    E --> F[Fill Country]
    F --> G[Fill Address\nHouse No + Street + City + State + Postal]
    G --> H[Fill Phone]
    H --> I[Fill Email]
    I --> J[Fill Password]
    J --> K{Password\nValidation}
    K -->|Invalid chars| L[Adjust Password\nRemove special chars]
    L --> J
    K -->|Valid| M[Submit Registration Form]
    M --> N{Account\nCreated?}
    N -->|Yes| O[Assert Authenticated]
    N -->|No| P([FAIL])
    O --> Q([PASS])
```

---

## 9. Module 4 — Cart Flow

```mermaid
flowchart TD
    A([Homepage Loaded]) --> B[Select Hardware Product]
    B --> C[Product Detail Page]
    C --> D[Click Add to Cart]
    D --> E[Assert Success Toast\nTop-right notification]
    E --> F[Open Cart Page]
    F --> G[Assert Product Name]
    G --> H[Assert Quantity = 1]
    H --> I[Assert Correct Price]
    I --> J{All Assertions\nPass?}
    J -->|Yes| K([PASS])
    J -->|No| L([FAIL])
```

---

## 10. Module 5 — Authenticated Checkout Flow

```mermaid
flowchart TD
    A([Product in Cart]) --> B[Proceed to Checkout\nproceed-1]
    B --> C[Step 2: Sign In]
    C --> D[Enter Credentials]
    D --> E[Click Login Submit]
    E --> F{Login\nSuccess?}
    F -->|Yes| G[Click proceed-2]
    F -->|No| H([FAIL / Switch to Guest])
    G --> I[Step 3: Billing Address]
    I --> J[Fill Billing Form\nfrom test-data]
    J --> K[proceedBilling\nauto-detect proceed-3 vs proceed-2]
    K --> L[Step 4: Payment]
    L --> M[Select Cash on Delivery]
    M --> N[Click Finish]
    N --> O[Assert Order Confirmation]
    O --> P([PASS])
```

---

## 11. Module 6 — Guest Checkout Flow

```mermaid
flowchart TD
    A([Product in Cart]) --> B[Click proceed-1\nArrives at Sign In Step]
    B --> C[Fill Email + Password]
    C --> D[Click Login Submit]
    D --> E{Wait up to 10s\nfor Error Text}
    E -->|Error Detected\n'Invalid email or password'| F[Click 'Continue as Guest' Tab]
    E -->|Timeout / Auth Success| G([Auth Flow or FAIL])
    F --> H[Fill Guest Email]
    H --> I[Fill Guest First Name]
    I --> J[Fill Guest Last Name]
    J --> K[Click Guest Submit]
    K --> L[Assert 'Continuing as guest: Guest']
    L --> M[Click proceed-2-guest\nArrives at Billing Address]
    M --> N[Fill Billing Form]
    N --> O[proceedBilling\nAuto-detects proceed-3]
    O --> P[Select Cash on Delivery]
    P --> Q[Click Finish — 1st time]
    Q --> R[Assert payment-success-message\nvisible]
    R --> S[Click Finish — 2nd time]
    S --> T[Assert 'Thanks for your order!']
    T --> U([PASS])
```

---

## 12. Screenshot Capture Hook Flow

```mermaid
flowchart TD
    A([AfterStep Hook Triggered]) --> B[Every Step Completion]
    B --> C{Step\nStatus}
    C -->|Pass| D[Capture Full-Page Screenshot]
    C -->|Fail| D
    D --> E[Save to Assets/screenshots/]
    E --> F[Filename: step-name-timestamp.png]
    F --> G[Attach to Cucumber Report]
    G --> H([Screenshot Archived])
```

---

## 13. CI/CD Pipeline Flow

```mermaid
flowchart TD
    A([Git Push to Repository]) --> B[GitHub Actions Triggered\nplaywright.yml]
    B --> C[Checkout Repository]
    C --> D[Install Node.js 18+]
    D --> E[npm install\nInstall dependencies]
    E --> F[Install Playwright Browsers\nnpx playwright install]
    F --> G[Run Tests\nnpx cucumber-js]
    G --> H{Test Results}
    H -->|All Pass| I[Generate HTML Report]
    H -->|Any Fail| J[Generate HTML Report\n+ Failure Screenshots]
    I --> K[Upload Artifacts]
    J --> K
    K --> L([Pipeline Complete])
```

---

## 14. Test Data Flow

```mermaid
flowchart LR
    subgraph JSON ["shop-data.json"]
        LOGIN[login\nemail + password]
        GUEST[guest\nemail + firstName + lastName]
        REG[registration\nfull user profile]
        BILLING[billing\naddress fields]
    end

    subgraph Modules ["Test Modules"]
        M2[Auth / Guest Fallback]
        M3[Registration]
        M5[Authenticated Checkout]
        M6[Guest Checkout]
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
    A([proceedBilling called]) --> B{Is proceed-3\nvisible?}
    B -->|Yes — Guest Flow| C[Click proceed-3]
    B -->|No — Auth Flow| D[Click proceed-2]
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