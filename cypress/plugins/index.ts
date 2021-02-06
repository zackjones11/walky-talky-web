/// <reference types="cypress" />

/**
 * This function is called when a project is opened or re-opened
 *
 * @type {Cypress.PluginConfig}
 */
module.exports = (on: Cypress.PluginEvents, config: Cypress.PluginEvents) => {
  console.log(on, config);
};
