import merchant from "../fixtures/merchant.json"
import feen from "../fixtures/feen.json"
import paymentMethod from "../fixtures/paymentMethod.json"



class MathCheckout {

    checkStrategyMathVND(payAmount) {
        cy.request({
            method: 'GET',
            url: `https://app.stage.payop.com/v1/instrument-settings/commissions/custom/${paymentMethod.id}/${merchant.project_ID}`,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixedCommission = response.body.data[7].value.VND[0];
                let percentCommission = response.body.data[7].value.VND[1];
                let strategy = response.body.data[7].strategy;
                let payerPart = response.body.data[7].payerPart;
                let userPart = response.body.data[7].userPart;

                cy.request({
                    method: 'GET',
                    url: "http://data.fixer.io/api/convert?access_key=f74d95af4d874be993c3d2b716800735&from=" + checkout.product_currency_c3 + "&to=" + merchant.main_currency + "&amount=1",
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    let rate = response.body.info.rate;

                cy.wait(5000);

                //TODO: change locator and status when it will be fixed on staging.
                cy.get(':nth-child(1) > .cdk-column-state > .mat-chip').invoke('text').should((text) => {
                    expect(text).to.eq(' Неудачный ')
                });

                cy.log("Strategy "+strategy)

                if(strategy === 1){
                    strategyAll(payAmount, fixedCommission, percentCommission, strategy, payerPart, userPart, rate);
                } else {
                    strategyMax(payAmount, fixedCommission, percentCommission, strategy, payerPart, userPart, rate);
                }
    })})}

}
export default new MathCheckout();

function strategyAll(payAmount, fixedCommission, percentCommission, strategy, payerPart, userPart, rate){

    let exchangeCommission = (payAmount / 100 * checkout.exchange_percentage).toFixed(2);

    let commissionsSum = (+fixedCommission + (+payAmount / 100 * +percentCommission)).toFixed(2);
    if (payerPart == 100){
        cy.log("Стратегия All, разбивка 0/100")

        cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
            expect(text).to.eq((+payAmount).toFixed(2) + ' ' + 'RUB')
        })
    }
    else if (payerPart == 0) {
        cy.wait(5000);
        cy.log("Стратегия All, разбивка 100/0");

        let rezult = (+payAmount - +commissionsSum).toFixed(2);

        cy.log("payAmount =" + " " + payAmount);
        cy.log("fixedCommission =" + " " + fixedCommission);
        cy.log("percentCommission =" + " " + percentCommission);
        cy.log("strategy =" + " " + strategy);
        cy.log("payerPart =" + " " + payerPart);
        cy.log("userPart =" + " " + userPart);
        cy.log("rezult =" + " " + rezult);

            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
            })

    }
    else if (payerPart == 50) {
        cy.wait(5000);
        cy.log("Стратегия All, разбивка 50/50");
        let commissionWithoutPayerPart = ((+commissionsSum / 100) * +userPart).toFixed(2);

        let rezult = (+payAmount - +commissionWithoutPayerPart).toFixed(2);

        cy.log("payAmount =" + " " + payAmount);
        cy.log("fixedCommission =" + " " + fixedCommission);
        cy.log("percentCommission =" + " " + percentCommission);
        cy.log("strategy =" + " " + strategy);
        cy.log("payerPart =" + " " + payerPart);
        cy.log("userPart =" + " " + userPart);
        cy.log("rezult =" + " " + rezult);

            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
            })
    }else{
        cy.log("Стратегия All, разбивка не в рамках кейсов");
    }
}

function strategyMax(payAmount, fixedCommission, percentCommission, strategy, payerPart, userPart, rate){
    if (payerPart == 0) {
        if (fixedCommission > (+payAmount / 100 * +percentCommission)) {
            cy.wait(5000);
            cy.log("Стратегия MAX, разбивка 100/0");

            let rezult = (+payAmount - +fixedCommission).toFixed(2);

            cy.log("payAmount =" + " " + payAmount);
            cy.log("fixedCommission =" + " " + fixedCommission);
            cy.log("percentCommission =" + " " + percentCommission);
            cy.log("strategy =" + " " + strategy);
            cy.log("payerPart =" + " " + payerPart);
            cy.log("userPart =" + " " + userPart);
            cy.log("rezult =" + " " + rezult);

            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
            })
        }
        else {
            cy.wait(5000);

            let rezult = (payAmount - (+payAmount / 100 * +percentCommission)).toFixed(2);

            cy.log("payAmount =" + " " + payAmount);
            cy.log("fixedCommission =" + " " + fixedCommission);
            cy.log("percentCommission =" + " " + percentCommission);
            cy.log("strategy =" + " " + strategy);
            cy.log("payerPart =" + " " + payerPart);
            cy.log("userPart =" + " " + userPart);
            cy.log("rezult =" + " " + rezult);
            cy.log("итог комиссии =" + " " + (+payAmount / 100 * +percentCommission).toFixed(2));

            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
            })
        }
    }else if (payerPart == 100) {
        cy.wait(5000);

        cy.log("ну тут точно чётко должно быть");

        cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
            expect(text).to.eq((+payAmount).toFixed(2) + ' ' + 'RUB')
        })
    } else if (payerPart == 50) {
        if (fixedCommission > (+payAmount / 100 * +percentCommission)) {
            cy.wait(5000);

            cy.log("Стратегия MAX, разбивка 50/50");
            cy.log("Процент комиссии меньше чем фиксированная");

            let halfCommision = (+fixedCommission / 100 * +payerPart).toFixed(2);

            let rezult = (+payAmount - +halfCommision).toFixed(2);

            cy.log("payAmount =" + " " + payAmount);
            cy.log("fixedCommission =" + " " + fixedCommission);
            cy.log("percentCommission =" + " " + percentCommission);
            cy.log("strategy =" + " " + strategy);
            cy.log("payerPart =" + " " + payerPart);
            cy.log("userPart =" + " " + userPart);
            cy.log("rezult =" + " " + rezult);

            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
            })
        }
        else {
            cy.wait(5000);

            cy.log("Стратегия MAX, разбивка 50/50");
            cy.log("Процент комиссии больше чем фиксированная");

            let halfCommision = ((+payAmount / 100 * +percentCommission) / 100 * +payerPart).toFixed(2);

            let rezult = (+payAmount - +halfCommision).toFixed(2);

            cy.log("payAmount =" + " " + payAmount);
            cy.log("fixedCommission =" + " " + fixedCommission);
            cy.log("percentCommission =" + " " + percentCommission);
            cy.log("strategy =" + " " + strategy);
            cy.log("payerPart =" + " " + payerPart);
            cy.log("userPart =" + " " + userPart);
            cy.log("rezult =" + " " + rezult);
            cy.log("итог комиссии =" + " " + (+payAmount / 100 * +percentCommission).toFixed(2));

            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
            })
        }
}else{
    cy.log("Стратегия All, разбивка не в рамках кейсов");
}
}