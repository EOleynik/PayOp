import merchant from "../fixtures/merchant";
import breakdown from "../payloads/checkoutBreakdown.json";

class PaymentMethodPage{

    setCheckoutCommissionBreakDown(payerPart){
        breakdown.applicationIdentifier = merchant.project_ID;
        breakdown.payerPart = payerPart;
        breakdown.userIdentifier = merchant.bussiness_account
        cy.request({
            method: 'POST',
            url: `https://app.stage.payop.com/v1/instrument-settings/commissions/assign-commission-distribution-all-for-application`,
            headers: {
                token: merchant.token,
            },
            body: breakdown
        }).then((response) => {
            expect(response).property('status').to.equal(201);
            expect(response.body.status).eq(1);
        })
    }

}

export default new PaymentMethodPage();
