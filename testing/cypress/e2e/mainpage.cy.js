describe('Main Page Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the hero section correctly', () => {
    cy.contains('h1', 'Tule hüppa meiega!').should('be.visible')

    cy.get('.booking-link').first().should('be.visible')
      .and('contain', 'Broneeri')
  })

  it('should display the Jumping section', () => {
    cy.contains('h2', 'Jumping, mis see on?').should('be.visible')
    cy.get('.two-column-section .paragraph').should('have.length.at.least', 1)
    cy.get('.content-image').should('be.visible')
  })

  it('should display the benefits section with cards', () => {
    cy.contains('h2', 'Miks just Jumping?').should('be.visible')
    cy.get('.benefit-card').should('have.length', 4)

    cy.contains('.benefit-title', 'Südame tervis ja vereringe').should('be.visible')
    cy.contains('.benefit-title', 'Koordinatsioon ja tasakaal').should('be.visible')
    cy.contains('.benefit-title', 'Kalorite põletus ja vormisolek').should('be.visible')
    cy.contains('.benefit-title', 'Stressi maandamine ja heaolu').should('be.visible')
  })

  it('should navigate to booking page when booking link is clicked', () => {
    cy.get('.booking-link').first().click()

    cy.url().should('include', '/broneeri')
  })
})