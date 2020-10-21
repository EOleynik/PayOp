

class RestPage{


    getInputOrderID() {
        return cy.get('#mat-input-5');
    }

    getInputOrderAmount() {
        return cy.get('#mat-input-6');
    }

    getInputOrderCurrency() {
        return cy.get('#mat-input-7');
    }

    getInputOrderDescription() {
        return cy.get('#mat-input-8');
    }


    getInputResultUrl() {
        return cy.get('#mat-input-12');
    }


    getInputFailUrl() {
        return cy.get('#mat-input-13');
    }


    getButtonGenerateConfig() {
        return cy.contains('span', 'Создать конфигурацию ')
        //return cy.get('.col-md-12 > .mat-focus-indicator > .mat-button-wrapper');
    }

    getButtonShowPaymentPage() {
        return cy.contains('span', 'Показать страницу оплаты ')
        //return cy.get('.form-field > .mat-focus-indicator > .mat-button-wrapper');
    }
}


export default new RestPage();