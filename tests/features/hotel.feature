Feature: Hotel booking journey

  @hotel @smoke
  Scenario: Guest checks availability and confirms a booking
    Given the guest opens the hotel homepage
    When the guest selects stay dates
    And the guest checks availability
    And the guest chooses a room from the available options
    And the guest tries the reserve now feature
    Then the guest completes the booking details
    And the booking is confirmed
    