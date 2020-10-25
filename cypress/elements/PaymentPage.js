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
        return cy.get('[formcontrolname="pan"]');
    }

    getInputExpirationDate() {
        return cy.get('[formcontrolname="expirationDate"]');
    }

    getInputCVC() {
        return cy.get('[formcontrolname="cvv"]');
    }

    getInputCardholderName() {
        return cy.get('[formcontrolname="holderName"]');
    }

    getButtonPay() {
        return cy.get('[class="mat-focus-indicator confirm-wrap__button mat-raised-button mat-button-base mat-primary"]');
    }

    selectPayCurrency(payCurrency) {
         cy.get('#mat-select-8').click();
       return cy.contains ('span', payCurrency).click();
    }
}

export default new PaymentPage();
