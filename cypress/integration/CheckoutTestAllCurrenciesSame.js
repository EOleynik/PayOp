import feenPage from "../elements/FeenPage";
import loginPage from "../elements/LoginPage";
import homePage from "../elements/HomePage";
import restPage from "../elements/RestPage";
import paymentPage from "../elements/PaymentPage";
import card from "../fixtures/card";
import paymentMethodPage from "../elements/PaymentMethodPage";
import math from '../helpers/MathCheckoutAllCurrenciesSame.js';

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
    restPage.getInputOrderID().type('sanitarskiy123');
    restPage.getInputOrderAmount().type(payAmount);
    restPage.getInputOrderCurrency().type(payCurrency);
    restPage.getInputOrderDescription().type('test description');
    restPage.getInputResultUrl().type('https://app.stage.payop.com/');
    restPage.getInputFailUrl().type('https://app.stage.payop.com/');
    restPage.getButtonGenerateConfig().click();
    restPage.getButtonShowPaymentPage().click();
}

function fillCheckoutDataAndPay() {
    paymentPage.getPaymentMethod().click();
    paymentPage.getSubmitPaymentButton().click();
    paymentPage.getInputCardNumber().type(card.card_number);
    paymentPage.getInputExpirationDate().type(card.expiration_date);
    paymentPage.getInputCVC().type(card.CVC);
    paymentPage.getInputCardholderName().type(card.cardholder);
    paymentPage.getButtonPay().click();
    cy.wait(6000);
}

function checkTransactionMath(payAmount) {
    loginPage.visit();
    loginPage.getLoginButton().click();
    loginPage.getToAdminPanelButton().click();
    homePage.getMenuPaymentHistory().click();
    math.checkStrategyMathRUB(payAmount);
}

describe('All currencies are same.', () => {

    beforeEach('', () => {
        loginPage.visit();
        loginPage.setAuthorization();
        loginPage.getAcceptCookieButton().click();
        loginPage.getLoginButton().click();
        cy.wait(5000);
        loginPage.getToAdminPanelButton().click();
    });

    // 1.1 Цена товара совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // и валютами провайдера. Цена товара - 500 RUB, основная валюта мерчанта - RUB, валюта оплаты - RUB.
    // Стратегия комиссии - ALL. Разбивка 100/0 - OK
    it('Checkout, product currency RUB, strategy ALL, 100/0', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 1, 1, 0, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    // 1.2 Цена товара совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // и валютами провайдера. Цена товара - 500 RUB, основная валюта мерчанта - RUB, валюта оплаты - RUB.
    // Стратегия комиссии - ALL. Разбивка 50/50 - OK
    it('Checkout, product currency RUB, strategy ALL, 50/50', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 1, 1, 50, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    // 1.3 Цена товара совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // и валютами провайдера. Цена товара - 500 RUB, основная валюта мерчанта - RUB, валюта оплаты - RUB.
    // Стратегия комиссии - ALL. Разбивка 0/100 - OK
    it('Checkout, product currency RUB, strategy ALL, 0/100', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 1, 1, 100, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    // 2.1 Цена товара совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // и валютами провайдера. Цена товара - 500 RUB, основная валюта мерчанта - RUB, валюта оплаты - RUB.
    // Стратегия комиссии - MAX. Разбивка 100/0 - OK
    it('Checkout, product currency RUB, strategy MAX, 100/0', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 2, 1, 0, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    // 2.2 Цена товара совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // и валютами провайдера. Цена товара - 500 RUB, основная валюта мерчанта - RUB, валюта оплаты - RUB.
    // Стратегия комиссии - MAX. Разбивка 100/0 - OK
    it('Checkout, product currency RUB, strategy MAX, 50/50', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 2, 1, 50, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    // 2.3 Цена товара совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // и валютами провайдера. Цена товара - 500 RUB, основная валюта мерчанта - RUB, валюта оплаты - RUB.
    // Стратегия комиссии - MAX. Разбивка 100/0 - OK
    it('Checkout, product currency RUB, strategy MAX, 0/100', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 2, 1, 100, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });
});
