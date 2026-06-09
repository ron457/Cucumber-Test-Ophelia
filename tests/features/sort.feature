Feature: Product Sorting

  @sort @regression
  Scenario: User sorts products by different options
    When the user sorts products by different criteria
    Then products should be sorted correctly