describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

xit('should display login form', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('.password-input-wrapper input').should('be.visible');
    cy.get('.login-button').should('be.visible');
    // Removed Google auth button check as it's not in your component
  });

  it('should show error message for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('.password-input-wrapper input').type('wrongpassword');
    cy.get('.login-button').click();

    cy.get('.error-message').should('be.visible');
  });

  xit('should successfully log in with valid credentials', () => {
  // First enter credentials
    cy.get('input[type="email"]').type(Cypress.env('CYPRESS_USERNAME'));
    cy.get('.password-input-wrapper input').type(Cypress.env('CYPRESS_PASSWORD'));
    cy.get('input[type="checkbox"]').check(); // Test remember me

    // Now click login
    cy.get('.login-button').click();
    
    // Verify redirect
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should navigate to forgot password page', () => {
    cy.contains('a', 'Unustasid Parooli?').click();
    cy.url().should('include', '/forgot_password');
  });

  it('should navigate to registration page', () => {
    cy.contains('a', 'Registreeri!').click();
    cy.url().should('include', '/register');
  });

  it('should toggle password visibility', () => {
    cy.get('.password-input-wrapper input').should('have.attr', 'type', 'password');
    cy.get('.password-toggle-icon').click();
    cy.get('.password-input-wrapper input').should('have.attr', 'type', 'text');
    cy.get('.password-toggle-icon').click();
    cy.get('.password-input-wrapper input').should('have.attr', 'type', 'password');
  });
});