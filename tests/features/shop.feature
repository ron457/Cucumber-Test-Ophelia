Feature: Practice software testing shopping journey

  @smoke @cart
  Scenario: User opens homepage and adds a product to cart
    Given the user opens the practice software testing homepage
    When the user browses homepage navigation
    And the user selects a hardware product
    And the user adds the product to cart
    Then the cart should show the selected product

  @login @auth
  Scenario: User logs in with valid credentials
    Given the user opens the practice software testing homepage
    When the user navigates to login page
    And the user logs in
    Then the user should be authenticated

  @register @auth
  Scenario: User registers a new account
    Given the user opens the practice software testing homepage
    When the user navigates to register page
    And the user registers
    Then the user should be authenticated

  @checkout @regression
  Scenario: User continues checkout after authentication
    Given the user opens the practice software testing homepage
    When the user selects a hardware product
    And the user adds the product to cart
    And the user proceeds to checkout
    And the user continues checkout after authentication
    And the user fills billing details
    And the user selects payment method
    And the user confirms the order
    Then the order confirmation message should appear

  @checkout-guest @regression
  Scenario: User completes checkout as guest
    Given the user opens the practice software testing homepage
    When the user selects a hardware product
    And the user adds the product to cart
    And the user proceeds to checkout
    And the user continues checkout as guest
    And the user fills billing details
    And the user selects payment method
    And the user confirms the order
    Then the order confirmation message should appear