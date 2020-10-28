
class RefundsPage {

    visit() {
        cy.visit('/');
    }

    getLoginButton() {
        return cy.get('[class="blue-btn login-btn"]');
    }

}


export default new RefundsPage();