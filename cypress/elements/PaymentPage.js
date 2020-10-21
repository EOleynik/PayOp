import merchant from "../fixtures/merchant"
import checkout from "../fixtures/checkout"

class PaymentPage{

    getPaymentMethod(){
        return cy.get('.payment__name').first();
    }

    getSubmitPaymentButton(){
        return cy.get('[class="mat-focus-indicator confirm-wrap__button mat-raised-button mat-button-base mat-primary"]').first();
    }
    getInputCardNumber() {
        return cy.get('#mat-input-15');
    }

    getInputExpirationDate() {
        return cy.get('#mat-input-16');
    }

    getInputCVC() {
        return cy.get('#mat-input-17');
    }

    getInputCartdholderName() {
        return cy.get('#mat-input-18');
    }

    getButtonPay() {
        return cy.get('[class="mat-focus-indicator confirm-wrap__button mat-raised-button mat-button-base mat-primary"]');
    }

    selectPayCurrency() {
         cy.contains('span', merchant.main_currency).click();
       return cy.contains ('span', checkout.pay_currency).click();
    }
}

export default new PaymentPage();
