
class TransactionsPage {

    getAmountTransaction() {
        const amount = cy.get('[class="bold price-align"]').first();
    }

    getTransactionDetails() {
        return cy.get('[class="mat-focus-indicator details-button-custom mat-raised-button mat-button-base"]', {timeout: 20000}).contains('Детали', {timeout: 20000}).first();
    }

    getCreateFullRefundButton(){
            return cy.get('[class="mat-focus-indicator button-action button-action--primary mat-raised-button mat-button-base ng-star-inserted"]', {timeout: 20000})
    }

    getCreatePartialRefundButton(){
        return cy.get('[class="mat-focus-indicator button-action button-action--default mat-raised-button mat-button-base ng-star-inserted"]', {timeout: 20000})
    }

    getConfirmFullRefundButton(){
            return cy.get('[class="mat-focus-indicator button-simple ng-tns-c81-1 mat-raised-button mat-button-base"]', {timeout: 20000})
    }

    getConfirmPartialRefundButton(){
            return cy.get('[class="mat-focus-indicator button-action button-action--primary mat-raised-button mat-button-base"]', {timeout: 20000})
    }

    getFillRefundValue(refundValue){
        return cy.get('[formcontrolname="amount"]', {timeout: 20000}).type(refundValue)
    }

    getCloseAlertButton(){
            return cy.get('[class="close-alert ng-tns-c71-0"]', {timeout: 20000})
    }

}
export default new TransactionsPage();