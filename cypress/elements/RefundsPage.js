
class RefundsPage {

    visit(){
        cy.visit('/ru/profile/refund/list');
    }

    checkRefundStatusNew(){
        return cy.get('[class="mat-chip mat-focus-indicator mat-primary mat-standard-chip new"]', {timeout: 10000})
            .first()
            .invoke('text').should((text) => {
                expect(text.replace(/\s/g, '')).to.eq('Новый')
    })}

    checkRefundStatusAccepted(){
        return cy.get('[class="mat-chip mat-focus-indicator mat-primary mat-standard-chip accepted"]', {timeout: 10000})
            .first()
            .invoke('text').should((text) => {
                expect(text.replace(/\s/g, '')).to.eq('Принят')
            })}
}


export default new RefundsPage();