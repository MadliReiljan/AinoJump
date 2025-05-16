describe('Calendar Page Tests - Not Logged In', () => {
  beforeEach(() => {
    cy.visit('/broneeri')

    cy.intercept('GET', '**/events/get_events.php', {
      statusCode: 200,
      body: []
    }).as('getEvents')
  })

  it('should display the calendar page correctly when not logged in', () => {
    cy.wait('@getEvents')

    cy.contains('h2', 'Pane ennast trenni kirja!').should('be.visible')

    cy.contains('h3', 'Tere!').should('be.visible')

    cy.contains('Trennid toimuvad täiskasvanutel:').should('be.visible')
    cy.contains('Trennid toimuvad lastel:').should('be.visible')

    cy.contains('.schedule-row', 'Teisipäeval').should('be.visible')
    cy.contains('.schedule-row', '19:00–20:00').should('be.visible')

    cy.contains('a', 'Stebby').should('be.visible')

    cy.get('.fc').should('exist')

    cy.get('.fc-event').should('not.exist')
    cy.contains('a', 'Stebby').click()
  })

  it('should allow basic calendar navigation', () => {
    Cypress._.times(2, () => {
      cy.get('.fc-next-button').click();
    });

    cy.get('.fc-prev-button').click()

    cy.get('.fc-today-button').click()

    cy.get('.fc-timeGridWeek-button').click()
    cy.get('.fc-timeGridDay-button').click()
    cy.get('.fc-dayGridMonth-button').click()
  })

  it('should not open event creation modal when clicking dates as non-owner', () => {
    cy.get('.fc-daygrid-day').first().click()
    cy.get('.event-modal').should('not.exist')
  })

  it('should display reviews carousel', () => {
    cy.contains('Jumping on aidanud mul taasavastada liikumisrõõmu').should('exist')
    cy.contains('Maarika').should('exist')
  })
})