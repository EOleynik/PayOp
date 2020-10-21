class OverviewPage {

    getMenuOverview() {
        return cy.contains('Overview');
    }

    getMenuPaymentMethods() {
        return cy.contains('Payment methods');
    }

    getMenuTransactions() {
        return cy.contains('Transactions');
    }

    getMenuRefund() {
        return cy.contains('Refund');
    }

    getMenuChargeback() {
        return cy.contains('Chargeback');
    }

    getMenuExchange() {
        return cy.contains('Exchange');
    }

    getMenuTickets() {
        return cy.contains('Tickets');
    }

    getMenuWithdrawals() {
        return cy.contains('Withdrawals');
    }

    getMenuCustomize() {
        return cy.contains('Customize');
    }

    getMenuProjects() {
        return cy.contains('Projects');
    }

    getMenuVerification() {
        return cy.contains('Verification');
    }

    getMenuAffiliate() {
        return cy.contains('Affiliate');
    }

    getMenuSettings() {
        return cy.contains('Settings');
    }

    getAcceptCookieButton() {
        return cy.get('[class="cookie__accept-btn"]');
    }

}

export default new OverviewPage();