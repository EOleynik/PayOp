import merchant from "../fixtures/merchant"
import checkout from "../fixtures/checkout"

class PaymentPage{

    getPaymentMethod(){
        return cy.get('.payment__name', {timeout: 20000}).first();
    }

    getSubmitPaymentButton(){
        return cy.get('[class="mat-focus-indicator confirm-wrap__button mat-raised-button mat-button-base mat-primary"]', {timeout: 20000}).first();
    }
    getInputCardNumber() {
        return cy.get('[formcontrolname="pan"]', {timeout: 20000});
    }

    getInputExpirationDate() {
        return cy.get('[formcontrolname="expirationDate"]', {timeout: 20000});
    }

    getInputCVC() {
        return cy.get('[formcontrolname="cvv"]', {timeout: 20000});
    }

    getInputCardholderName() {
        return cy.get('[formcontrolname="holderName"]', {timeout: 20000});
    }

    getButtonPay() {
        return cy.get('[class="mat-focus-indicator confirm-wrap__button mat-raised-button mat-button-base mat-primary"]', {timeout: 20000});
    }

    selectPayCurrency(payCurrency) {
         cy.get('#mat-select-8').click();
       return cy.contains ('span', payCurrency).click();
    }

    waitTransactionComplete(){
        cy.route({
            method: 'POST',
            url: `/v1/checkout/create`,
        }).as('transactionComplete');    }
}

export default new PaymentPage();
