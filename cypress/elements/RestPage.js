

class RestPage{


    getInputOrderID() {
        return cy.get('[formcontrolname="id"]', {timeout: 20000});
    }

    getInputOrderAmount() {
        return cy.get('[formcontrolname="amount"]', {timeout: 20000});
    }

    getInputOrderCurrency() {
        return cy.get('[formcontrolname="currency"]', {timeout: 20000});
    }

    getInputOrderDescription() {
        return cy.get('[formcontrolname="description"]', {timeout: 20000});
    }


    getInputResultUrl() {
        return cy.get('[formcontrolname="resultUrl"]', {timeout: 20000});
    }


    getInputFailUrl() {
        return cy.get('[formcontrolname="failPath"]', {timeout: 20000});
    }

    getInputEmail() {
        return cy.get('[formcontrolname="email"]', {timeout: 20000});
    }

    getButtonGenerateConfig() {
        return cy.contains('span', 'Создать конфигурацию ', {timeout: 20000})
        //return cy.get('.col-md-12 > .mat-focus-indicator > .mat-button-wrapper');
    }

    getButtonShowPaymentPage() {
        return cy.contains('span', 'Показать страницу оплаты ', {timeout: 20000})
        //return cy.get('.form-field > .mat-focus-indicator > .mat-button-wrapper');
    }

    waitTransactionCreate() {
        return cy.route({
            method: 'POST',
            url: `/v1/invoices/create`,
        }).as('transactionCreate');
    }
}


export default new RestPage();