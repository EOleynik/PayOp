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

    setExchangeCommissionAndStrategy(strategy, mainCurrencyName, mainCurrencyFixCommission, mainCurrencyPercentCommission, productCurrencyName, productCurrencyFixCommission, productCurrencyPercentCommission, payerExchangePart){
        let merchantExchangePart = 100 - payerExchangePart;
        exchangeCommissions.strategy = strategy;
        exchangeCommissions.payerPart = payerExchangePart;
        exchangeCommissions.userPart = +merchantExchangePart;
        exchangeCommissions.value[mainCurrencyName][0] = mainCurrencyFixCommission;
        exchangeCommissions.value[mainCurrencyName][1] = mainCurrencyPercentCommission;
        exchangeCommissions.value[productCurrencyName][0] = productCurrencyFixCommission;
        exchangeCommissions.value[productCurrencyName][1] = productCurrencyPercentCommission;

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

    acceptRefund(){
        cy.request({
            method: 'GET',
            url: `https://app.stage.payop.com/v1/refunds/user-refunds`,
            headers: {
                token: merchant.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);

            let refundId = response.body.data[0].identifier

            cy.request({
                method: 'POST',
                url: `https://app.stage.payop.com/v1/refunds/${refundId}/accept`,
                headers: {
                    token: feen.token,
                },
                body: {}
            }).then((response) => {
                expect(response).property('status').to.equal(201);
                expect(response.body.status).eq(1);

            })
        }
    )}
}

export default new FeenPage();