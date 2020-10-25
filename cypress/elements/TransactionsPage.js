
class TransactionsPage {

    getAmountTransaction() {
        const amount = cy.get('[class="bold price-align"]').first();
    }

}
export default new TransactionsPage();