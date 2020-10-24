import merchant from "../fixtures/merchant.json"
import feen from "../fixtures/feen.json"
import paymentMethod from "../fixtures/paymentMethod.json"

class TransactionsPage {


    getAmountTransaction() {
        const amount = cy.get('[class="bold price-align"]').first();
    }

    checkStrategyMathRUB(payAmount) {
        cy.request({
            method: 'GET',
            url: `https://app.stage.payop.com/v1/instrument-settings/commissions/custom/${paymentMethod.id}/${merchant.project_ID}`,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let fixedCommission = response.body.data[7].value.RUB[0];
            let percentCommission = response.body.data[7].value.RUB[1];
            let strategy = response.body.data[7].strategy;
            let payerPart = response.body.data[7].payerPart;
            let userPart = response.body.data[7].userPart;

            cy.wait(1000);

            //TODO: change locator and status when it will be fixed on staging.
            cy.get(':nth-child(1) > .cdk-column-state > .mat-chip').invoke('text').should((text) => {
                expect(text).to.eq(' Неудачный ')
            });

            let commissionsSum = (+fixedCommission + (+payAmount / 100 * +percentCommission)).toFixed(2);
            cy.log("Strategy "+strategy)
            // логика для стратегии All и разбивок для этой стратегии.
                if (strategy == 1 ) { 
                    if (payerPart == 100){
                    cy.log("Стратегия All, разбивка 0/100")
                    // Check Amount
                    cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                        expect(text).to.eq((+payAmount).toFixed(2) + ' ' + 'RUB')
                    })
                }
                else if (payerPart == 0) {
                    cy.log("Стратегия All, разбивка 100/0");

                    // отнимаем сумму комисий от стоимости товара
                    let rezult = (payAmount - commissionsSum).toFixed(2);

                    cy.log("fixedCommission =" + " " + fixedCommission);
                    cy.log("percentCommission =" + " " + percentCommission);
                    cy.log("strategy =" + " " + strategy);
                    cy.log("payerPart =" + " " + payerPart);
                    cy.log("userPart =" + " " + userPart);
                    cy.log("rezult =" + " " + rezult);

                    // Check Amount
                    cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                        expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
                    })

                }
                else if (payerPart == 50) { // логика для стратегии All и разбивок для этой стратегии. Если стратегия 1 (All) и часть плательщика в оплате комиссий не = 0, то сумму коммисий делим на 100 и умножаем на процент мерчанта.
                    cy.log("Стратегия All, разбивка 50/50");
                    let commissionWithoutPayerPart = (+commissionsSum / 100) * +userPart;

                    // отнимаем сумму комисий от стоимости товара
                    let rezult = (payAmount - commissionWithoutPayerPart).toFixed(2);

                    cy.log("fixedCommission =" + " " + fixedCommission);
                    cy.log("percentCommission =" + " " + percentCommission);
                    cy.log("strategy =" + " " + strategy);
                    cy.log("payerPart =" + " " + payerPart);
                    cy.log("userPart =" + " " + userPart);
                    cy.log("rezult =" + " " + rezult);

                    // Check Amount
                    cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                        expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
                    })
                }}else{
                    if (payerPart == 0) {
                        if (fixedCommission > (+payAmount / 100 * +percentCommission)) {
                            cy.log("Стратегия MAX, разбивка 100/0");
    
                            // отнимаем фиксированную комиссию от стоимости товара
                            let rezult = (+payAmount - +fixedCommission).toFixed(2);
    
                            cy.log("fixedCommission =" + " " + fixedCommission);
                            cy.log("percentCommission =" + " " + percentCommission);
                            cy.log("strategy =" + " " + strategy);
                            cy.log("payerPart =" + " " + payerPart);
                            cy.log("userPart =" + " " + userPart);
                            cy.log("rezult =" + " " + rezult);
    
                            // Check Amount
                            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                                expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
                            })
                        }
                        else {
                            // отнимаем процент комиссии от стоимости товара
                            let rezult = (payAmount - (+payAmount / 100 * +percentCommission)).toFixed(2);
    
                            cy.log("fixedCommission =" + " " + fixedCommission);
                            cy.log("percentCommission =" + " " + percentCommission);
                            cy.log("strategy =" + " " + strategy);
                            cy.log("payerPart =" + " " + payerPart);
                            cy.log("userPart =" + " " + userPart);
                            cy.log("rezult =" + " " + rezult);
                            cy.log("итог комиссии =" + " " + (payAmount / 100 * percentCommission).toFixed(2));
    
                            // Check Amount
                            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                                expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
                            })
                        }
                    } else if (payerPart == 100) {
                        cy.log("ну тут точно чётко должно быть");
    
                        // Check Amount
                        cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                            expect(text).to.eq((+payAmount).toFixed(2) + ' ' + 'RUB')
                        })
                    } else if (payerPart == 50) {
                        if (fixedCommission > (+payAmount / 100 * +percentCommission)) {
                            cy.log("Стратегия MAX, разбивка 50/50");
                            cy.log("Процент комиссии меньше чем фиксированная");
    
                            let halfCommision = (fixedCommission / 100 * payerPart).toFixed(2);
                            // отнимаем фиксированную комиссию от стоимости товара
                            let rezult = (+payAmount - +halfCommision).toFixed(2);
    
                            cy.log("fixedCommission =" + " " + fixedCommission);
                            cy.log("percentCommission =" + " " + percentCommission);
                            cy.log("strategy =" + " " + strategy);
                            cy.log("payerPart =" + " " + payerPart);
                            cy.log("userPart =" + " " + userPart);
                            cy.log("rezult =" + " " + rezult);
    
                            // Check Amount
                            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                                expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
                            })
                        }
                        else {
                            cy.log("Стратегия MAX, разбивка 50/50");
                            cy.log("Процент комиссии больше чем фиксированная");
                            // отнимаем процент комиссии от стоимости товара
                            let halfCommision = ((+payAmount / 100 * +percentCommission) / 100 * payerPart).toFixed(2);
                            // отнимаем фиксированную комиссию от стоимости товара
                            let rezult = (+payAmount - +halfCommision).toFixed(2);
    
                            cy.log("fixedCommission =" + " " + fixedCommission);
                            cy.log("percentCommission =" + " " + percentCommission);
                            cy.log("strategy =" + " " + strategy);
                            cy.log("payerPart =" + " " + payerPart);
                            cy.log("userPart =" + " " + userPart);
                            cy.log("rezult =" + " " + rezult);
                            cy.log("итог комиссии =" + " " + (payAmount / 100 * percentCommission).toFixed(2));
    
                            // Check Amount
                            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                                expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
                            })
                        }
                    }
                }
        })
    }

    // checkStrategyMAXMathRUB(payAmount) {
    //     cy.request({
    //         method: 'GET',
    //         url: `https://app.stage.payop.com/v1/instrument-settings/commissions/custom/${paymentMethod.id}/${merchant.project_ID}`,
    //         headers: {
    //             token: feen.token,
    //         }
    //     }).then((response) => {
    //         expect(response).property('status').to.equal(200);
    //         expect(response.body).property('data').to.not.be.oneOf([null, ""]);
    //         let fixedCommission = response.body.data[7].value.RUB[0];
    //         let percentCommission = response.body.data[7].value.RUB[1];
    //         let strategy = response.body.data[7].strategy;
    //         let payerPart = response.body.data[7].payerPart;
    //         let userPart = response.body.data[7].userPart;

    //         cy.wait(5000);

    //         //TODO: change locator and status when it will be fixed on staging.
    //         cy.get(':nth-child(1) > .cdk-column-state > .mat-chip').invoke('text').should((text) => {
    //             expect(text).to.eq(' Неудачный ')
    //         });

    //         let commissionsSum = (+fixedCommission + (+payAmount / 100 * +percentCommission)).toFixed(2);
    //         cy.log("Strategy "+strategy)
    //         if (payerPart === 0) {
    //                 if (fixedCommission > (+payAmount / 100 * +percentCommission)) {
    //                     cy.log("Стратегия MAX, разбивка 100/0");

    //                     // отнимаем фиксированную комиссию от стоимости товара
    //                     let rezult = (+payAmount - +fixedCommission).toFixed(2);

    //                     cy.log("fixedCommission =" + " " + fixedCommission);
    //                     cy.log("percentCommission =" + " " + percentCommission);
    //                     cy.log("strategy =" + " " + strategy);
    //                     cy.log("payerPart =" + " " + payerPart);
    //                     cy.log("userPart =" + " " + userPart);
    //                     cy.log("rezult =" + " " + rezult);

    //                     // Check Amount
    //                     cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
    //                         expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
    //                     })
    //                 }
    //                 else {
    //                     // отнимаем процент комиссии от стоимости товара
    //                     let rezult = (payAmount - (+payAmount / 100 * +percentCommission)).toFixed(2);

    //                     cy.log("fixedCommission =" + " " + fixedCommission);
    //                     cy.log("percentCommission =" + " " + percentCommission);
    //                     cy.log("strategy =" + " " + strategy);
    //                     cy.log("payerPart =" + " " + payerPart);
    //                     cy.log("userPart =" + " " + userPart);
    //                     cy.log("rezult =" + " " + rezult);
    //                     cy.log("итог комиссии =" + " " + (payAmount / 100 * percentCommission).toFixed(2));

    //                     // Check Amount
    //                     cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
    //                         expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
    //                     })
    //                 }
    //             } else if (payerPart === 100) {
    //                 cy.log("ну тут точно чётко должно быть");

    //                 // Check Amount
    //                 cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
    //                     expect(text).to.eq((+payAmount).toFixed(2) + ' ' + 'RUB')
    //                 })
    //             } else if (payerPart === 50) {
    //                 if (fixedCommission > (+payAmount / 100 * +percentCommission)) {
    //                     cy.log("Стратегия MAX, разбивка 50/50");
    //                     cy.log("Процент комиссии меньше чем фиксированная");

    //                     let halfCommision = (fixedCommission / 100 * payerPart).toFixed(2);
    //                     // отнимаем фиксированную комиссию от стоимости товара
    //                     let rezult = (+payAmount - +halfCommision).toFixed(2);

    //                     cy.log("fixedCommission =" + " " + fixedCommission);
    //                     cy.log("percentCommission =" + " " + percentCommission);
    //                     cy.log("strategy =" + " " + strategy);
    //                     cy.log("payerPart =" + " " + payerPart);
    //                     cy.log("userPart =" + " " + userPart);
    //                     cy.log("rezult =" + " " + rezult);

    //                     // Check Amount
    //                     cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
    //                         expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
    //                     })
    //                 }
    //                 else {
    //                     cy.log("Стратегия MAX, разбивка 50/50");
    //                     cy.log("Процент комиссии больше чем фиксированная");
    //                     // отнимаем процент комиссии от стоимости товара
    //                     let halfCommision = ((+payAmount / 100 * +percentCommission) / 100 * payerPart).toFixed(2);
    //                     // отнимаем фиксированную комиссию от стоимости товара
    //                     let rezult = (+payAmount - +halfCommision).toFixed(2);

    //                     cy.log("fixedCommission =" + " " + fixedCommission);
    //                     cy.log("percentCommission =" + " " + percentCommission);
    //                     cy.log("strategy =" + " " + strategy);
    //                     cy.log("payerPart =" + " " + payerPart);
    //                     cy.log("userPart =" + " " + userPart);
    //                     cy.log("rezult =" + " " + rezult);
    //                     cy.log("итог комиссии =" + " " + (payAmount / 100 * percentCommission).toFixed(2));

    //                     // Check Amount
    //                     cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
    //                         expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'RUB')
    //                     })
    //                 }
    //             }
    //         cy.log("2 Strategy "+strategy)

    //     })
    //     }
}
export default new TransactionsPage();