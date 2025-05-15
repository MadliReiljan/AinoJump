describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('[data-cy="email-input"]').should('be.visible');
    cy.get('[data-cy="password-input"]').should('be.visible');
    cy.get('[data-cy="login-button"]').should('be.visible');
    cy.get('[data-cy="google-auth-button"]').should('be.visible');
  });

  it('should show error message for invalid credentials', () => {
    cy.get('[data-cy="email-input"]').type('invalid@example.com');
    cy.get('[data-cy="password-input"]').type('wrongpassword');
    cy.get('[data-cy="login-button"]').click();

    cy.get('.error').should('be.visible');
  });

  it('should successfully log in with valid credentials', () => {
    cy.login();
  });

  it('should navigate to forgot password page', () => {
    cy.get('[data-cy="forgot-password-link"]').click();
    cy.url().should('include', '/login/forgotPassword');
  });

  it('should navigate to registration page', () => {
    cy.get('[data-cy="register-link"]').click();
    cy.url().should('include', '/register');
  });
});