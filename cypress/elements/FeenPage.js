import loginPage from "./LoginPage";
import feen from "../fixtures/feen.json";
import merchant from "../fixtures/merchant.json";
import paymentMethod from "../fixtures/paymentMethod.json";
import checkoutCommissions from "../payloads/checkoutCommissions.json";
import exchangeCommissions from "../payloads/exchangeCommissions.json";
import manajer from "../fixtures/manajer.json";

class FeenPage {

    enablePaymentMethodGroup(){
        cy.request({
            method: 'POST',
            url: `https://app.stage.payop.com/v1/instrument-settings/user-payment-settings/payment-methods/${paymentMethod.groupId}/enable`,
            headers: {
                token: feen.token,
            },
            body: {
                "applicationIdentifier": merchant.project_ID,
                "userIdentifier": merchant.bussiness_account
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body.status).eq(1);

        })
    }

    enablePaymentMethod(){
        cy.request({
            method: 'POST',
            url: `https://app.stage.payop.com/v1/instrument-settings/user-payment-settings/payment-methods/${paymentMethod.groupId}/appoint-primary`,
            headers: {
                token: feen.token,
            },
            body: {
                "applicationIdentifier": merchant.project_ID,
                "primaryIdentifier": paymentMethod.id,
                "userIdentifier": merchant.bussiness_account
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body.status).eq(1);

        })
    }

    setCheckoutCommissionAndStrategy(strategy){
        checkoutCommissions.strategy = strategy;
        cy.request({
            method: 'POST',
            url: `https://app.stage.payop.com/v1/instrument-settings/commissions`,
            headers: {
                token: feen.token,
            },
            body: checkoutCommissions
        }).then((response) => {
            expect(response).property('status').to.equal(201);
            expect(response.body.status).eq(1);

        })
    }

    setExchangeCommissionAndStrategy(strategy){
        exchangeCommissions.strategy = strategy;
        cy.request({
            method: 'POST',
            url: `https://app.stage.payop.com/v1/instrument-settings/commissions`,
            headers: {
                token: feen.token,
            },
            body: exchangeCommissions
        }).then((response) => {
            expect(response).property('status').to.equal(201);
            expect(response.body.status).eq(1);

        })
    }
}

export default new FeenPage();