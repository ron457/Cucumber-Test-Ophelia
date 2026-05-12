Feature: Login Functionality

@login @smoke
Scenario: Successful login with valid credentials
    Given user navigates to login page
    When user enters valid username
    And user enters valid password
    And user clicks on login button
    Then user should be redirected to dashboard page