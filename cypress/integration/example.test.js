/// <reference types="cypress" />

context("Example", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080");
  });

  it("should say Hello World!", () => {
    cy.contains("Hello World!");
  });
});
