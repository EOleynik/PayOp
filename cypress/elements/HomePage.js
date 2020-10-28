import merchant from "../fixtures/merchant.json";
import feen from "../fixtures/feen.json";

class HomePage {

    visit() {
        cy.visit('/');
    }

    checkUrl() {
        return  cy.url().should('include','/ru/profile/overview');
    }

    getCheckUrlMan() {
        return  cy.url().should('include', '/en/manager');
    }

    getCheckUrlFin() {
        return  cy.url().should('include', '/en/financial');
    }

    getMenuVerification() {
        return cy.contains('Verification');
    }

    getMenuRefunds(){
        return cy.contains('Возвраты');
    }

    getChangeAccount() {
        cy.get('[class="acc-active__info_acc-type"]').click()
        return cy.contains('Personal account').click()
    }

    getSubmenuPersonal() {
        return cy.get('[class="mat-line mid-menu__li-text"]').contains('Personal')
    }


    getMenuProjects() {
        return cy.contains('Проекты');
    }

    getSubMenuRest() {
        return cy.contains ('p', 'REST');
    }

    getMenuPaymentHistory() {
        return cy.contains('Транзакции');
    }

    getMenuTransactions() {
        return cy.contains('Transactions');
    }

    getMenuTickets() {
        return cy.contains ('Tickets')
    }

    getMenuCreateTransfer() {
        return cy.contains ('Create Transfer');
    }


    setMainCurrency(currency) {
        merchant.main_currency = currency;
        cy.request({
            method: 'POST',
            url: `https://app.stage.payop.com/v1/users/settings/change-currency`,
            headers: {
                token: merchant.token,
            },
            body: {
                "identifier": merchant.bussiness_account,
                "currency": merchant.main_currency
            }
        }).then((response) => {
            expect(response).property('status').to.equal(201);
            expect(response.body.status).eq(1);

        })
    }

    getMenuChargebacks() {
        return cy.contains('Chargebacks');
    }
}

export default new HomePage();