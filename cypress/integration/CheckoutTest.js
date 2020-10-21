
import feenPage from "../elements/FeenPage";
import loginPage from "../elements/LoginPage";
import homePage from "../elements/HomePage";
import restPage from "../elements/RestPage";
import paymentPage from "../elements/PaymentPage";
import card from "../fixtures/card";
import transactionsPage from "../elements/TransactionsPage";
import checkout from "../fixtures/checkout";

cy.getRandomArbitrary = function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
};


describe ('Checkout suit UI ', () => {

    // it('Set main currency', () => {
    //     homePage.setMainCurrency()
    // });

    describe('Checkout with default commissions settings', () => {

        beforeEach('', () => {
            loginPage.visit();
            loginPage.setAuthorization();
            cy.wait(1000);
            loginPage.getAcceptCookieButton().click();
            loginPage.getLoginButton().click();
            cy.wait(5000);
            loginPage.getToAdminPanelButton().click();
            homePage.setMainCurrency()
        });

        // 1.Цена товара совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
        // и валютами провайдера. Цена товара - 500 RUB, основная валюта мерчанта - RUB, валюта оплаты - RUB.
        // Стратегия комиссии - ALL. Разбивка 100/0 - OK
        it('Checkout, product currency RUB', () => {

            let payAmount = cy.getRandomArbitrary(300, 500);
            //let payAmount = 500;
            let payCurrency = 'RUB';

            homePage.checkUrl();
            homePage.getMenuProjects().click();
            cy.wait(5000);
            homePage.getSubMenuRest().click();

            restPage.getInputOrderID().type('dsan123');
            restPage.getInputOrderAmount().type(payAmount);
            restPage.getInputOrderCurrency().type(payCurrency);
            restPage.getInputOrderDescription().type('case1');
            restPage.getInputResultUrl().type('https://app.stage.payop.com/');
            restPage.getInputFailUrl().type('https://app.stage.payop.com/');
            restPage.getButtonGenerateConfig().click();
            restPage.getButtonShowPaymentPage().click();
            cy.wait(5000);

            paymentPage.getPaymentMethod().click();
            paymentPage.getSubmitPaymentButton().click();
            paymentPage.getInputCardNumber().type(card.card_number);
            paymentPage.getInputExpirationDate().type(card.expiration_date);
            paymentPage.getInputCVC().type(card.CVC);
            paymentPage.getInputCartdholderName().type(card.cardholder);
            paymentPage.getButtonPay().click();
            cy.wait(5000);

            loginPage.visit();
            loginPage.getLoginButton().click();
            cy.wait(5000);
            loginPage.getToAdminPanelButton().click();
            cy.wait(5000);
            homePage.getMenuPaymentHistory().click();
            transactionsPage.checkAmountUIRUB(payAmount);
        });

        // 2.Простой кейс. Цена товара - совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
        // и валютами провайдера. Цена товара в USD или EUR или RUB
    //     it('Checkout, product currency USD or EUR or RUB', () => {
    //
    //         let payAmount = cy.getRandomArbitrary(300, 500);
    //         //let payAmount = 400;
    //
    //         loginPage.getButtonToAdminPanel().click();
    //         cy.wait(5000);
    //         homePage.getCheckUrl();
    //         homePage.getMenuProjects().click();
    //         cy.wait(5000);
    //         homePage.getSubMenuRest().click();
    //
    //         restPage.getInputOrderID().type("C2" + checkout.product_currency_c2);
    //         restPage.getInputOrderAmount().type(payAmount);
    //         restPage.getInputOrderCurrency().type(checkout.product_currency_c2);
    //         restPage.getInputOrderDescription().type('case2');
    //         restPage.getInputResultUrl().type('https://app.stage.paydo.com/');
    //         restPage.getInputFailUrl().type('https://app.stage.paydo.com/');
    //         restPage.getButtonGenerateConfig().click();
    //         restPage.getButtonShowPaymentPage().click();
    //         cy.wait(5000);
    //
    //         paymentPage.getInputCardNumber().type(card.card_number);
    //         paymentPage.getInputExpirationDate().type(card.expiration_date);
    //         paymentPage.getInputCVC().type(card.CVC);
    //         paymentPage.getInputCartdholderName().type(card.cardholder);
    //         paymentPage.getButtonPay().click();
    //         cy.wait(5000);
    //
    //         loginPage.visit();
    //         loginPage.getLoginButton().click();
    //         cy.wait(5000);
    //         loginPage.getToAdminPanelButton().click();
    //         cy.wait(5000);
    //         homePage.getMenuPaymentHistory().click();
    //         transactionsPage.checkAmountUIUSD(payAmount);
    //     });
    //
    //     // 3.Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
    //     // основная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - ALL. Цена товара в UAH
    //     it('Checkout, product currency is not USD, GBP, EUR, RUB', () => {
    //
    //         let payAmount = cy.getRandomArbitrary(300, 500);
    //         //let payAmount = 366.31;
    //
    //         loginPage.getButtonToAdminPanel().click();
    //         cy.wait(5000);
    //         homePage.getCheckUrl();
    //         homePage.getMenuProjects().click();
    //         cy.wait(5000);
    //         homePage.getSubMenuRest().click();
    //
    //         restPage.getInputOrderID().type("C3" + checkout.product_currency_c3);
    //         restPage.getInputOrderAmount().type(payAmount);
    //         restPage.getInputOrderCurrency().type(checkout.product_currency_c3);
    //         restPage.getInputOrderDescription().type('case3');
    //         restPage.getInputResultUrl().type('https://app.stage.paydo.com/');
    //         restPage.getInputFailUrl().type('https://app.stage.paydo.com/');
    //         restPage.getButtonGenerateConfig().click();
    //         restPage.getButtonShowPaymentPage().click();
    //         cy.wait(5000);
    //
    //         paymentPage.getInputCardNumber().type(card.card_number);
    //         paymentPage.getInputExpirationDate().type(card.expiration_date);
    //         paymentPage.getInputCVC().type(card.CVC);
    //         paymentPage.getInputCartdholderName().type(card.cardholder);
    //         paymentPage.getButtonPay().click();
    //         cy.wait(5000);
    //
    //         loginPage.visit();
    //         loginPage.getLoginButton().click();
    //         cy.wait(5000);
    //         loginPage.getToAdminPanelButton().click();
    //         cy.wait(5000);
    //         homePage.getMenuPaymentHistory().click();
    //         transactionsPage.checkAmountUIUAH(payAmount);
    //     });
    //
    //     // 4.Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
    //     // основная валюта мерчанта не совпадает с валютой оплаты. Цена товара в CUP
    //     it('Checkout, product currency is not USD, GBP, EUR, RUB, the main currency does not match the payment currency ', () => {
    //
    //         let payAmount = cy.getRandomArbitrary(500, 1500);
    //         //let payAmount = 419.94;
    //
    //         loginPage.getButtonToAdminPanel().click();
    //         cy.wait(5000);
    //         homePage.getCheckUrl();
    //         homePage.getMenuProjects().click();
    //         cy.wait(5000);
    //         homePage.getSubMenuRest().click();
    //
    //         restPage.getInputOrderID().type("C4" + checkout.product_currency_c4);
    //         restPage.getInputOrderAmount().type(payAmount);
    //         restPage.getInputOrderCurrency().type(checkout.product_currency_c4);
    //         restPage.getInputOrderDescription().type('case4');
    //         restPage.getInputResultUrl().type('https://app.stage.paydo.com/');
    //         restPage.getInputFailUrl().type('https://app.stage.paydo.com/');
    //         restPage.getButtonGenerateConfig().click();
    //         restPage.getButtonShowPaymentPage().click();
    //         cy.wait(5000);
    //
    //         paymentPage.selectPayCurrency();
    //         paymentPage.getInputCardNumber().type(card.card_number);
    //         paymentPage.getInputExpirationDate().type(card.expiration_date);
    //         paymentPage.getInputCVC().type(card.CVC);
    //         paymentPage.getInputCartdholderName().type(card.cardholder);
    //         paymentPage.getButtonPay().click();
    //         cy.wait(5000);
    //
    //         loginPage.visit();
    //         loginPage.getLoginButton().click();
    //         cy.wait(5000);
    //         loginPage.getToAdminPanelButton().click();
    //         cy.wait(5000);
    //         homePage.getMenuPaymentHistory().click();
    //         transactionsPage.checkAmountUICUP(payAmount);
    //     });
    // });

    describe ('Change strategy', () => {

        it('Change strategy', () => {
            feenPage.changeCommissionsAndStrategy()
        });
    });

    describe('Checkout after change strategy', () => {

        beforeEach('', () => {
            loginPage.visit();
            loginPage.getAuthorization();
        });

        // 1.Самый простой кейс. Цена товара совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
        // и валютами провайдера. Цена товара в GBP
        it('Checkout, product currency RUB', () => {

            let payAmount = cy.getRandomArbitrary(300, 500);
            //let payAmount = 500;
            let payCurrency = 'RUB';

            homePage.checkUrl();
            homePage.getMenuProjects().click();
            cy.wait(5000);
            homePage.getSubMenuRest().click();

            restPage.getInputOrderID().type('dsan123');
            restPage.getInputOrderAmount().type(payAmount);
            restPage.getInputOrderCurrency().type(payCurrency);
            restPage.getInputOrderDescription().type('case1');
            restPage.getInputResultUrl().type('https://app.stage.payop.com/');
            restPage.getInputFailUrl().type('https://app.stage.payop.com/');
            restPage.getButtonGenerateConfig().click();
            restPage.getButtonShowPaymentPage().click();
            cy.wait(5000);

            paymentPage.getPaymentMethod().click();
            paymentPage.getSubmitPaymentButton().click();
            paymentPage.getInputCardNumber().type(card.card_number);
            paymentPage.getInputExpirationDate().type(card.expiration_date);
            paymentPage.getInputCVC().type(card.CVC);
            paymentPage.getInputCartdholderName().type(card.cardholder);
            paymentPage.getButtonPay().click();
            cy.wait(5000);

            loginPage.visit();
            loginPage.getLoginButton().click();
            cy.wait(5000);
            loginPage.getToAdminPanelButton().click();
            cy.wait(5000);
            homePage.getMenuPaymentHistory().click();
            transactionsPage.checkAmountUIRUB(payAmount);
        });

        // 2.Простой кейс. Цена товара - совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
        // и валютами провайдера. Цена товара в USD или EUR или RUB
        // it('Checkout, product currency USD or EUR or RUB', () => {
        //
        //     let payAmount = cy.getRandomArbitrary(300, 500);
        //     //let payAmount = 400;
        //
        //     loginPage.getButtonToAdminPanel().click();
        //     cy.wait(5000);
        //     homePage.getCheckUrl();
        //     homePage.getMenuProjects().click();
        //     cy.wait(5000);
        //     homePage.getSubMenuRest().click();
        //
        //     restPage.getInputOrderID().type("C2" + checkout.product_currency_c2);
        //     restPage.getInputOrderAmount().type(payAmount);
        //     restPage.getInputOrderCurrency().type(checkout.product_currency_c2);
        //     restPage.getInputOrderDescription().type('case2');
        //     restPage.getInputResultUrl().type('https://app.stage.paydo.com/');
        //     restPage.getInputFailUrl().type('https://app.stage.paydo.com/');
        //     restPage.getButtonGenerateConfig().click();
        //     restPage.getButtonShowPaymentPage().click();
        //     cy.wait(5000);
        //
        //     paymentPage.getInputCardNumber().type(card.card_number);
        //     paymentPage.getInputExpirationDate().type(card.expiration_date);
        //     paymentPage.getInputCVC().type(card.CVC);
        //     paymentPage.getInputCartdholderName().type(card.cardholder);
        //     paymentPage.getButtonPay().click();
        //     cy.wait(5000);
        //
        //     loginPage.visit();
        //     cy.wait(5000);
        //     loginPage.getButtonToAdminPanel().click();
        //     cy.wait(5000);
        //     homePage.getMenuPaymentHistory().click();
        //     transactionsPage.checkAmountUIUSD(payAmount);
        // });
        //
        // // 3.Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
        // // основная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - ALL. Цена товара в UAH
        // it('Checkout, product currency is not USD, GBP, EUR, RUB', () => {
        //
        //     let payAmount = cy.getRandomArbitrary(300, 500);
        //     //let payAmount = 366.31;
        //
        //     loginPage.getButtonToAdminPanel().click();
        //     cy.wait(5000);
        //     homePage.getCheckUrl();
        //     homePage.getMenuProjects().click();
        //     cy.wait(5000);
        //     homePage.getSubMenuRest().click();
        //
        //     restPage.getInputOrderID().type("C3" + checkout.product_currency_c3);
        //     restPage.getInputOrderAmount().type(payAmount);
        //     restPage.getInputOrderCurrency().type(checkout.product_currency_c3);
        //     restPage.getInputOrderDescription().type('case3');
        //     restPage.getInputResultUrl().type('https://app.stage.paydo.com/');
        //     restPage.getInputFailUrl().type('https://app.stage.paydo.com/');
        //     restPage.getButtonGenerateConfig().click();
        //     restPage.getButtonShowPaymentPage().click();
        //     cy.wait(5000);
        //
        //     paymentPage.getInputCardNumber().type(card.card_number);
        //     paymentPage.getInputExpirationDate().type(card.expiration_date);
        //     paymentPage.getInputCVC().type(card.CVC);
        //     paymentPage.getInputCartdholderName().type(card.cardholder);
        //     paymentPage.getButtonPay().click();
        //     cy.wait(5000);
        //
        //     loginPage.visit();
        //     cy.wait(5000);
        //     loginPage.getButtonToAdminPanel().click();
        //     cy.wait(5000);
        //     homePage.getMenuPaymentHistory().click();
        //     transactionsPage.checkAmountUIUAH(payAmount);
        // });
        //
        // // 4.Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
        // // основная валюта мерчанта не совпадает с валютой оплаты. Цена товара в CUP
        // it('Checkout, product currency is not USD, GBP, EUR, RUB, the main currency does not match the payment currency ', () => {
        //
        //     let payAmount = cy.getRandomArbitrary(500, 1500);
        //     //let payAmount = 419.94;
        //
        //     loginPage.getButtonToAdminPanel().click();
        //     cy.wait(5000);
        //     homePage.getCheckUrl();
        //     homePage.getMenuProjects().click();
        //     cy.wait(5000);
        //     homePage.getSubMenuRest().click();
        //
        //     restPage.getInputOrderID().type("C4" + checkout.product_currency_c4);
        //     restPage.getInputOrderAmount().type(payAmount);
        //     restPage.getInputOrderCurrency().type(checkout.product_currency_c4);
        //     restPage.getInputOrderDescription().type('case4');
        //     restPage.getInputResultUrl().type('https://app.stage.paydo.com/');
        //     restPage.getInputFailUrl().type('https://app.stage.paydo.com/');
        //     restPage.getButtonGenerateConfig().click();
        //     restPage.getButtonShowPaymentPage().click();
        //     cy.wait(5000);
        //
        //     paymentPage.selectPayCurrency();
        //     paymentPage.getInputCardNumber().type(card.card_number);
        //     paymentPage.getInputExpirationDate().type(card.expiration_date);
        //     paymentPage.getInputCVC().type(card.CVC);
        //     paymentPage.getInputCartdholderName().type(card.cardholder);
        //     paymentPage.getButtonPay().click();
        //     cy.wait(5000);
        //
        //     loginPage.visit();
        //     cy.wait(5000);
        //     loginPage.getButtonToAdminPanel().click();
        //     cy.wait(5000);
        //     homePage.getMenuPaymentHistory().click();
        //     transactionsPage.checkAmountUICUP(payAmount);
         })
    });
});




