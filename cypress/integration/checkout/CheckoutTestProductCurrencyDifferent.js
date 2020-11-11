import feenPage from "../../elements/FeenPage";
import loginPage from "../../elements/LoginPage";
import homePage from "../../elements/HomePage";
import restPage from "../../elements/RestPage";
import paymentPage from "../../elements/PaymentPage";
import card from "../../fixtures/card";
import paymentMethodPage from "../../elements/PaymentMethodPage";
import math from '../../helpers/MathCheckoutPayCurrencyDifferent.js';

cy.getRandomArbitrary = function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
};

function setStartupSettings(payCurrency, checkoutStrategy, exchangeStrategy, payerCommissionsPart, mainCurrencyName, mainCurrencyFixCommission, mainCurrencyPercentCommission, productCurrencyName, productCurrencyFixCommission, productCurrencyPercentCommission, payerExchangeCommissionsPart) {
    homePage.setMainCurrency(payCurrency);
    feenPage.enablePaymentMethodGroup();
    feenPage.enablePaymentMethod();
    feenPage.setCheckoutCommissionAndStrategy(checkoutStrategy);
    feenPage.setExchangeCommissionAndStrategy(exchangeStrategy, mainCurrencyName, mainCurrencyFixCommission, mainCurrencyPercentCommission, productCurrencyName, productCurrencyFixCommission, productCurrencyPercentCommission, payerExchangeCommissionsPart);
    paymentMethodPage.setCheckoutCommissionBreakDown(payerCommissionsPart);
}

function fillTransactionData(payAmount, payCurrency) {
    restPage.getInputOrderID().type('sanitarskiy123',{force: true});
    restPage.getInputOrderAmount().type(payAmount,{force: true});
    restPage.getInputOrderCurrency().type(payCurrency,{force: true});
    restPage.getInputOrderDescription().type('test description',{force: true});
    restPage.getInputResultUrl().type('https://app.stage.payop.com/',{force: true});
    restPage.getInputFailUrl().type('https://app.stage.payop.com/',{force: true});
    restPage.getButtonGenerateConfig().click({force: true});
    restPage.getButtonShowPaymentPage().click({force: true});
}

function fillCheckoutDataAndPay() {
    cy.server();

    cy.route({
        method: 'POST',
        url: `/v1/checkout/create`,
    }).as('transactionComplete');

    paymentPage.getPaymentMethod().click();
    cy.wait(3000)
    paymentPage.selectPayCurrency("RUB")
    paymentPage.getSubmitPaymentButton().click();
    paymentPage.getInputCardNumber().type(card.card_number,{force: true});
    paymentPage.getInputExpirationDate().type(card.expiration_date,{force: true});
    paymentPage.getInputCVC().type(card.CVC,{force: true});
    paymentPage.getInputCardholderName().type(card.cardholder,{force: true});
    paymentPage.getButtonPay().click();
    cy.wait(6000);
    cy.wait('@transactionComplete');}

function checkTransactionMath(payAmount) {
    loginPage.visit();
    loginPage.getLoginButton().click();
    loginPage.getToAdminPanelButton().click();
    homePage.getMenuPaymentHistory().click();
    math.checkStrategyMathKHR(payAmount);
}

describe('Checkout product currency different with pay currency.', () => {

    beforeEach('', () => {
        loginPage.visit();
        loginPage.setAuthorization();
        loginPage.getAcceptCookieButton().click();
        loginPage.getLoginButton().click();
        cy.wait(5000);
        loginPage.getToAdminPanelButton().click();
    });

    //  Валюта товара не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB).
    // Oсновная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - ALL. Разбивка 100/0 and Exchange external   0/100
    it('Checkout, product currency RUB, strategy ALL, payment method 100/0, exchange 0/100', () => {

        let payAmount = cy.getRandomArbitrary(100000, 200000);
        //let payAmount = 500000;
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 1, 1, 0, 'RUB', 100, 10, 'KHR', 10000, 10, 100);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, "KHR");
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    //  Валюта не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    //Oсновная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - ALL. Разбивка 0/100 and Exchange external   0/100
    it('Checkout, product currency RUB, strategy ALL, payment method 0/100, exchange 0/100', () => {

        let payAmount = cy.getRandomArbitrary(100000, 200000);
        //let payAmount = 500000;
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 1, 1, 0, 'RUB', 100, 10, 'KHR', 10000, 10, 100);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, "KHR");
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    //  Валюта не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // Oсновная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - ALL. Разбивка 50/50 and Exchange external   0/100
    it('Checkout, product currency RUB, strategy ALL, payment method 50/50, exchange 0/100', () => {

        let payAmount = cy.getRandomArbitrary(100000, 200000);
        //let payAmount = 500000;
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 1, 1, 50, 'RUB', 10, 10, 'KHR', 10, 10);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, "KHR");
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    // Валюта не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // Oсновная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - ALL. Разбивка 50/50 and Exchange external   50/50
    it('Checkout, product currency RUB, strategy ALL, payment method 50/50, exchange 50/50', () => {

        let payAmount = cy.getRandomArbitrary(100000, 200000);
        //let payAmount = 500000;
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 1, 1, 50, 'RUB', 10, 10, 'KHR', 10, 10);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, "KHR");
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    // Валюта не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // Oсновная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - ALL. Разбивка 50/50 and Exchange external   100/0
    it('Checkout, product currency RUB, strategy ALL, payment method 50/50, exchange 100/0', () => {

        let payAmount = cy.getRandomArbitrary(100000, 200000);
        //let payAmount = 500000;
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 1, 1, 50, 'RUB', 10, 10, 'KHR', 10, 10);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, "KHR");
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

        //  Валюта товара не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB).
    // Oсновная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - MAX. Разбивка 100/0 and Exchange external   0/100
    it('Checkout, product currency RUB, strategy MAX, payment method 100/0, exchange 0/100', () => {

        let payAmount = cy.getRandomArbitrary(100000, 200000);
        //let payAmount = 500000;
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 2, 1, 0, 'RUB', 100, 10, 'KHR', 10000, 10, 100);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, "KHR");
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    //  Валюта не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    //Oсновная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - MAX. Разбивка 0/100 and Exchange external   0/100
    it('Checkout, product currency RUB, strategy MAX, payment method 0/100, exchange 0/100', () => {

        let payAmount = cy.getRandomArbitrary(100000, 200000);
        //let payAmount = 500000;
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 2, 1, 0, 'RUB', 100, 10, 'KHR', 10000, 10, 100);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, "KHR");
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    //  Валюта не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // Oсновная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - MAX. Разбивка 50/50 and Exchange external   0/100
    it('Checkout, product currency RUB, strategy MAX, payment method 50/50, exchange 0/100', () => {

        let payAmount = cy.getRandomArbitrary(100000, 200000);
        //let payAmount = 500000;
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 2, 1, 50, 'RUB', 10, 10, 'KHR', 10, 10);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, "KHR");
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    // Валюта не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // Oсновная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - MAX. Разбивка 50/50 and Exchange external   50/50
    it('Checkout, product currency RUB, strategy MAX, payment method 50/50, exchange 50/50', () => {

        let payAmount = cy.getRandomArbitrary(100000, 200000);
        //let payAmount = 500000;
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 2, 1, 50, 'RUB', 10, 10, 'KHR', 10, 10);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, "KHR");
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    // Валюта не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // Oсновная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - MAX. Разбивка 50/50 and Exchange external   100/0
    it('Checkout, product currency RUB, strategy MAX, payment method 50/50, exchange 100/0', () => {

        let payAmount = cy.getRandomArbitrary(100000, 200000);
        //let payAmount = 500000;
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 2, 1, 50, 'RUB', 10, 10, 'KHR', 10, 10);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, "KHR");
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });
});
