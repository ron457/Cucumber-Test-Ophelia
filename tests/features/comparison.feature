Feature: Product Comparison

  @comparison
  Scenario: User compares products and clears comparison

    When the user selects products for comparison
    And the user clicks Compare Now
    Then the comparison page should be displayed

    When the user clears all compared products
    Then no products should remain for comparison

    When the user clicks Browse Products
    Then the user should be redirected to the home page