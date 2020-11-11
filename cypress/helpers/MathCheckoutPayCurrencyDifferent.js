import merchant from "../fixtures/merchant.json"
import feen from "../fixtures/feen.json"
import paymentMethod from "../fixtures/paymentMethod.json"



class MathCheckout {

    checkStrategyMathKHR(payAmount) {
        cy.request({
            method: 'GET',
            url: `https://app.stage.payop.com/v1/instrument-settings/commissions/custom/${paymentMethod.id}/${merchant.project_ID}`,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixedCommission = response.body.data[7].value.KHR[0];
                let percentCommission = response.body.data[7].value.KHR[1];
                let strategy = response.body.data[7].strategy;
                let payerPart = response.body.data[7].payerPart;
                let userPart = response.body.data[7].userPart;

                let exchangeFixRUB = response.body.data[2].value.RUB[0];
                let exchangePercentRUB = response.body.data[2].value.RUB[1];
                let exchangeFixKHR = response.body.data[2].value.KHR[0];
                let exchangePercentKHR = response.body.data[2].value.KHR[1];
                let exchangeStrategy = response.body.data[2].strategy;
                let exchangePayerPart = response.body.data[2].payerPart;
                let exchangeUserPart = response.body.data[2].userPart;

                let exchangeAmount = 1;
                cy.request({
                    method: 'GET',
                    url: `http://data.fixer.io/api/convert?access_key=f74d95af4d874be993c3d2b716800735&from=KHR&to=rub&amount=${exchangeAmount}`,
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    
                    let rate = response.body.info.rate;

                cy.wait(5000);

                //TODO: change locator and status when it will be fixed on staging.
                // cy.get(':nth-child(1) > .cdk-column-state > .mat-chip', {timeout: 20000}).invoke('text').should((text) => {
                //     expect(text.replace(/\s/g, '')).to.eq('Принят')
                // });

                cy.log("Strategy "+strategy)
                cy.log("Exchange strategy"+exchangeStrategy)

                if(strategy === 1){
                    strategyAll(payAmount, fixedCommission, percentCommission, strategy, payerPart, userPart, rate, exchangeStrategy, exchangeFixRUB, exchangePercentRUB, exchangeFixKHR, exchangePercentKHR, exchangePayerPart, exchangeUserPart);
                } else {
                    strategyMax(payAmount, fixedCommission, percentCommission, strategy, payerPart, userPart, rate, exchangeStrategy, exchangeFixRUB, exchangePercentRUB, exchangeFixKHR, exchangePercentKHR, exchangePayerPart, exchangeUserPart);
                }
    })})}

}
export default new MathCheckout();

function currenciesExchanger (currencyFrom, currencyTo, amount){
                let exchangeResult = cy.request({
                    method: 'GET',
                    url: `http://data.fixer.io/api/convert?access_key=f74d95af4d874be993c3d2b716800735&from=${currencyFrom}&to=${currencyTo}&amount=${amount}`,
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    
                    let exchangeResult = response.body.result.toString();
                    return exchangeResult;
                })
                return exchangeResult;

}

function strategyAll(payAmount, fixedCommission, percentCommission, strategy, payerPart, userPart, rate, exchangeStrategy, exchangeFixRUB, exchangePercentRUB, exchangeFixKHR, exchangePercentKHR, exchangePayerPart, exchangeUserPart){

    let commissionsSum = (+fixedCommission + (+payAmount / 100 * +percentCommission));
    if (payerPart == 100){
        cy.log("Стратегия All, разбивка 0/100")

        cy.log("rate =" + " " + rate);
        cy.log("payAmount =" + " " + payAmount);
        cy.log("fixedCommission =" + " " + fixedCommission);
        cy.log("percentCommission =" + " " + percentCommission);
        cy.log("strategy =" + " " + strategy);
        cy.log("payerPart =" + " " + payerPart);
        cy.log("userPart =" + " " + userPart);
        cy.log("rezult =" + " " + rezult);

        let exchangeExternalResult = exchangeExternal(payAmount, exchangeStrategy, exchangePayerPart, exchangeFixKHR, exchangePercentKHR);
        let resultAfterExchange = (+payAmount - +exchangeExternalResult) * rate;
        let exchangeInternalCurrent = exchangeInternal(resultAfterExchange, exchangeStrategy, exchangePayerPart, exchangeFixRUB, exchangePercentRUB);
        let resultFinal = (resultAfterExchange - exchangeInternalCurrent).toFixed(2);

        cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
            expect(text.replace(/\s/g, '')).to.eq((+resultFinal).toFixed(2) + 'RUB')
        })
    }
    else if (payerPart == 0) {
        cy.log("Стратегия All, разбивка 100/0");

        let rezult = (+payAmount - +commissionsSum);

        cy.log("rate =" + " " + rate);
        cy.log("payAmount =" + " " + payAmount);
        cy.log("fixedCommission =" + " " + fixedCommission);
        cy.log("percentCommission =" + " " + percentCommission);
        cy.log("strategy =" + " " + strategy);
        cy.log("payerPart =" + " " + payerPart);
        cy.log("userPart =" + " " + userPart);
        cy.log("rezult =" + " " + rezult);

        let exchangeExternalResult = exchangeExternal(payAmount, exchangeStrategy, exchangePayerPart, exchangeFixKHR, exchangePercentKHR);
        let resultAfterExchange = (+rezult - +exchangeExternalResult) * rate;
        let exchangeInternalCurrent = exchangeInternal(resultAfterExchange, exchangeStrategy, exchangePayerPart, exchangeFixRUB, exchangePercentRUB);
        let resultFinal = (resultAfterExchange - exchangeInternalCurrent).toFixed(2);

        cy.log("exchangeInternalCurrent =" + " " + exchangeInternalCurrent);

        cy.log("exchangeExternalResult =" + " " + exchangeExternalResult);
        cy.log("resultAfterExchange =" + " " + resultAfterExchange);

            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                expect(text.replace(/\s/g, '')).to.eq((+resultFinal).toFixed(2) + 'RUB')
            })

    }
    else if (payerPart == 50) {
        cy.wait(5000);
        cy.log("Стратегия All, разбивка 50/50");
        let commissionWithoutPayerPart = ((+commissionsSum / 100) * +userPart).toFixed(2);

        let rezult = (+payAmount - +commissionWithoutPayerPart).toFixed(2);


        cy.log("rate =" + " " + rate);
        cy.log("payAmount =" + " " + payAmount);
        cy.log("fixedCommission =" + " " + fixedCommission);
        cy.log("percentCommission =" + " " + percentCommission);
        cy.log("strategy =" + " " + strategy);
        cy.log("payerPart =" + " " + payerPart);
        cy.log("userPart =" + " " + userPart);
        cy.log("rezult =" + " " + rezult);

        let exchangeExternalResult = exchangeExternal(payAmount, exchangeStrategy, exchangePayerPart, exchangeFixKHR, exchangePercentKHR);
        let resultAfterExchange = (+rezult - +exchangeExternalResult) * rate;
        let exchangeInternalCurrent = exchangeInternal(resultAfterExchange, exchangeStrategy, exchangePayerPart, exchangeFixRUB, exchangePercentRUB);
        let resultFinal = (resultAfterExchange - exchangeInternalCurrent).toFixed(2);

            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                expect(text.replace(/\s/g, '')).to.eq((+resultFinal).toFixed(2) + 'RUB')
            })
    }else{
        cy.log("Стратегия All, разбивка не в рамках кейсов");
    }
}

function strategyMax(payAmount, fixedCommission, percentCommission, strategy, payerPart, userPart, rate, exchangeStrategy, exchangeFixRUB, exchangePercentRUB, exchangeFixKHR, exchangePercentKHR, exchangePayerPart, exchangeUserPart){
    if (payerPart == 0) {
        if (fixedCommission > (+payAmount / 100 * +percentCommission)) {
            cy.wait(5000);
            cy.log("Стратегия MAX, разбивка 100/0");

            let rezult = (+payAmount - +fixedCommission).toFixed(2);

            cy.log("rate =" + " " + rate);
            cy.log("payAmount =" + " " + payAmount);
            cy.log("fixedCommission =" + " " + fixedCommission);
            cy.log("percentCommission =" + " " + percentCommission);
            cy.log("strategy =" + " " + strategy);
            cy.log("payerPart =" + " " + payerPart);
            cy.log("userPart =" + " " + userPart);
            cy.log("rezult =" + " " + rezult);
    
            let exchangeExternalResult = exchangeExternal(payAmount, exchangeStrategy, exchangePayerPart, exchangeFixKHR, exchangePercentKHR);
            let resultAfterExchange = (+rezult - +exchangeExternalResult) * rate;
            let exchangeInternalCurrent = exchangeInternal(resultAfterExchange, exchangeStrategy, exchangePayerPart, exchangeFixRUB, exchangePercentRUB);
            let resultFinal = (resultAfterExchange - exchangeInternalCurrent).toFixed(2);
    
            cy.log("exchangeInternalCurrent =" + " " + exchangeInternalCurrent);
    
            cy.log("exchangeExternalResult =" + " " + exchangeExternalResult);
            cy.log("resultAfterExchange =" + " " + resultAfterExchange);
    
                cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                    expect(text.replace(/\s/g, '')).to.eq((+resultFinal).toFixed(2) + 'RUB')
                })
        }
        else {
            cy.wait(5000);

            let rezult = (payAmount - (+payAmount / 100 * +percentCommission)).toFixed(2);

            cy.log("rate =" + " " + rate);
            cy.log("payAmount =" + " " + payAmount);
            cy.log("fixedCommission =" + " " + fixedCommission);
            cy.log("percentCommission =" + " " + percentCommission);
            cy.log("strategy =" + " " + strategy);
            cy.log("payerPart =" + " " + payerPart);
            cy.log("userPart =" + " " + userPart);
            cy.log("rezult =" + " " + rezult);
    
            let exchangeExternalResult = exchangeExternal(payAmount, exchangeStrategy, exchangePayerPart, exchangeFixKHR, exchangePercentKHR);
            let resultAfterExchange = (+rezult - +exchangeExternalResult) * rate;
            let exchangeInternalCurrent = exchangeInternal(resultAfterExchange, exchangeStrategy, exchangePayerPart, exchangeFixRUB, exchangePercentRUB);
            let resultFinal = (resultAfterExchange - exchangeInternalCurrent).toFixed(2);
    
            cy.log("exchangeInternalCurrent =" + " " + exchangeInternalCurrent);
    
            cy.log("exchangeExternalResult =" + " " + exchangeExternalResult);
            cy.log("resultAfterExchange =" + " " + resultAfterExchange);
    
                cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                    expect(text.replace(/\s/g, '')).to.eq((+resultFinal).toFixed(2) + 'RUB')
                })
        }
    }else if (payerPart == 100) {
        cy.wait(5000);
        cy.log("rate =" + " " + rate);
        cy.log("payAmount =" + " " + payAmount);
        cy.log("fixedCommission =" + " " + fixedCommission);
        cy.log("percentCommission =" + " " + percentCommission);
        cy.log("strategy =" + " " + strategy);
        cy.log("payerPart =" + " " + payerPart);
        cy.log("userPart =" + " " + userPart);
        cy.log("rezult =" + " " + rezult);

        let exchangeExternalResult = exchangeExternal(payAmount, exchangeStrategy, exchangePayerPart, exchangeFixKHR, exchangePercentKHR);
        let resultAfterExchange = (+payAmount - +exchangeExternalResult) * rate;
        let exchangeInternalCurrent = exchangeInternal(resultAfterExchange, exchangeStrategy, exchangePayerPart, exchangeFixRUB, exchangePercentRUB);
        let resultFinal = (resultAfterExchange - exchangeInternalCurrent).toFixed(2);

        cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
            expect(text.replace(/\s/g, '')).to.eq((+resultFinal).toFixed(2) + 'RUB')
        })
    } else if (payerPart == 50) {
        if (fixedCommission > (+payAmount / 100 * +percentCommission)) {
            cy.wait(5000);

            cy.log("Стратегия MAX, разбивка 50/50");
            cy.log("Процент комиссии меньше чем фиксированная");

            let halfCommision = (+fixedCommission / 100 * +payerPart).toFixed(2);

            let rezult = (+payAmount - +halfCommision).toFixed(2);

            cy.log("rate =" + " " + rate);
            cy.log("payAmount =" + " " + payAmount);
            cy.log("fixedCommission =" + " " + fixedCommission);
            cy.log("percentCommission =" + " " + percentCommission);
            cy.log("strategy =" + " " + strategy);
            cy.log("payerPart =" + " " + payerPart);
            cy.log("userPart =" + " " + userPart);
            cy.log("rezult =" + " " + rezult);
    
            let exchangeExternalResult = exchangeExternal(payAmount, exchangeStrategy, exchangePayerPart, exchangeFixKHR, exchangePercentKHR);
            let resultAfterExchange = (+rezult - +exchangeExternalResult) * rate;
            let exchangeInternalCurrent = exchangeInternal(resultAfterExchange, exchangeStrategy, exchangePayerPart, exchangeFixRUB, exchangePercentRUB);
            let resultFinal = (resultAfterExchange - exchangeInternalCurrent).toFixed(2);
    
                cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                    expect(text.replace(/\s/g, '')).to.eq((+resultFinal).toFixed(2) + 'RUB')
                })
        }
        else {
            cy.wait(5000);

            cy.log("Стратегия MAX, разбивка 50/50");
            cy.log("Процент комиссии больше чем фиксированная");

            let halfCommision = ((+payAmount / 100 * +percentCommission) / 100 * +payerPart).toFixed(2);

            let rezult = (+payAmount - +halfCommision).toFixed(2);

            cy.log("rate =" + " " + rate);
            cy.log("payAmount =" + " " + payAmount);
            cy.log("fixedCommission =" + " " + fixedCommission);
            cy.log("percentCommission =" + " " + percentCommission);
            cy.log("strategy =" + " " + strategy);
            cy.log("payerPart =" + " " + payerPart);
            cy.log("userPart =" + " " + userPart);
            cy.log("rezult =" + " " + rezult);
    
            let exchangeExternalResult = exchangeExternal(payAmount, exchangeStrategy, exchangePayerPart, exchangeFixKHR, exchangePercentKHR);
            let resultAfterExchange = (+rezult - +exchangeExternalResult) * rate;
            let exchangeInternalCurrent = exchangeInternal(resultAfterExchange, exchangeStrategy, exchangePayerPart, exchangeFixRUB, exchangePercentRUB);
            let resultFinal = (resultAfterExchange - exchangeInternalCurrent).toFixed(2);

            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                expect(text.replace(/\s/g, '')).to.eq((+resultFinal).toFixed(2) + 'RUB')
            })
        }
}else{
    cy.log("Стратегия MAX, разбивка не в рамках кейсов");
}
}

function exchangeExternal(payAmount, exchangeStrategy, exchangePayerPart, exchangeFixKHR, exchangePercentKHR){
    if(exchangeStrategy == 1){
        if (exchangePayerPart == 100) {
            cy.log("Стратегия exchange external - All, разбивка exchange 0/100")

            let exchangeExternalResult =  0
            return exchangeExternalResult;

        } else if (exchangePayerPart == 0){
            cy.log("Стратегия exchange external - All, разбивка exchange 100/0")

            let exchangeExternalResult =  (+exchangeFixKHR + (payAmount / 100 * exchangePercentKHR)).toFixed(2);
            return exchangeExternalResult;

        }else if (exchangePayerPart == 50){
            cy.log("Стратегия exchange external - All, разбивка exchange 50/50")

            let exchangeExternalResult =  ((+exchangeFixKHR + (payAmount / 100 * exchangePercentKHR)) / 2).toFixed(2);
            return exchangeExternalResult;
        }
        
    } else {
        if (exchangePayerPart == 100) {
            cy.log("Стратегия exchange external - MAX, разбивка exchange 0/100")
            
            let exchangeExternalResult =  0;
            return exchangeExternalResult;

        } else if (exchangePayerPart == 0){
            cy.log("Стратегия exchange external - MAX, разбивка exchange 100/0")

            if( +exchangeFixKHR > (payAmount / 100 * exchangePercentKHR)){

                let exchangeExternalResult =  +exchangeFixKHR.toFixed(2);
                return exchangeExternalResult;

            }else{

                let exchangeExternalResult =  (payAmount / 100 * exchangePercentKHR).toFixed(2);
                return exchangeExternalResult;
            }
        }else if (exchangePayerPart == 50){
            cy.log("Стратегия exchange external - MAX, разбивка exchange 50/50")

            if( +exchangeFixKHR > (payAmount / 100 * exchangePercentKHR)){

                let exchangeExternalResult =  (+exchangeFixKHR / 2).toFixed(2);
                return exchangeExternalResult;

            }else{

                let exchangeExternalResult =  ((payAmount / 100 * exchangePercentKHR) / 2).toFixed(2);
                return exchangeExternalResult;

            }
        }
    }
}

function exchangeInternal(payAmount, exchangeStrategy, exchangePayerPart, exchangeFixRUB, exchangePercentRUB){
    if(exchangeStrategy == 1){
        if (exchangePayerPart == 100) {
            cy.log("Стратегия exchange internal - All, разбивка exchange 0/100")

            let exchangeInternalResult =  (+exchangeFixRUB + (payAmount / 100 * exchangePercentRUB));
            return exchangeInternalResult;

        } else if (exchangePayerPart == 0){
            cy.log("Стратегия exchange internal - All, разбивка exchange 100/0")

            let exchangeInternalResult =  (+exchangeFixRUB + (payAmount / 100 * exchangePercentRUB));
            return exchangeInternalResult;

        }else if (exchangePayerPart == 50){
            cy.log("Стратегия exchange internal - All, разбивка exchange 50/50")

            let exchangeInternalResult =  ((+exchangeFixRUB + (payAmount / 100 * exchangePercentRUB)) / 2);
            return exchangeInternalResult;
        }
        
    } else {
        if (exchangePayerPart == 100) {
            cy.log("Стратегия exchange internal - MAX, разбивка exchange 0/100")
            
            let exchangeInternalResult =  0;
            return exchangeInternalResult;

        } else if (exchangePayerPart == 0){
            cy.log("Стратегия exchange internal - MAX, разбивка exchange 100/0")

            if( +exchangeFixRUB > (payAmount / 100 * exchangePercentRUB)){

                let exchangeInternalResult =  +exchangeFixRUB.toFixed(2);
                return exchangeInternalResult;

            }else{

                let exchangeInternalResult =  (payAmount / 100 * exchangePercentRUB).toFixed(2);
                return exchangeInternalResult;
            }
        }else if (exchangePayerPart == 50){
            cy.log("Стратегия exchange internal - MAX, разбивка exchange 50/50")

            if( +exchangeFixRUB > (payAmount / 100 * exchangePercentRUB)){

                let exchangeInternalResult =  (+exchangeFixRUB / 2).toFixed(2);
                return exchangeInternalResult;

            }else{

                let exchangeInternalResult =  ((payAmount / 100 * exchangePercentRUB) / 2).toFixed(2);
                return exchangeInternalResult;
                
            }
        }
    }
}