import feenPage from "../elements/FeenPage";
import loginPage from "../elements/LoginPage";
import homePage from "../elements/HomePage";
import restPage from "../elements/RestPage";
import paymentPage from "../elements/PaymentPage";
import card from "../fixtures/card";
import transactionsPage from "../elements/TransactionsPage";
import paymentMethodPage from "../elements/PaymentMethodPage";
import math from '../helpers/MathCheckoutAllCurrenciesSame.js';

cy.getRandomArbitrary = function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
};

function setStartupSettings(payCurrency, checkoutStrategy, exchangeStrategy, payerCommissionsPart) {
    homePage.setMainCurrency(payCurrency);
    feenPage.enablePaymentMethodGroup();
    feenPage.enablePaymentMethod();
    feenPage.setCheckoutCommissionAndStrategy(checkoutStrategy);
    feenPage.setExchangeCommissionAndStrategy(exchangeStrategy);
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
    paymentPage.getInputCartdholderName().type(card.cardholder);
    paymentPage.getButtonPay().click();
    cy.wait(5000);
}

function checkTransactionMath(payAmount) {
    loginPage.visit();
    loginPage.getLoginButton().click();
    loginPage.getToAdminPanelButton().click();
    homePage.getMenuPaymentHistory().click();
    math.checkStrategyMathRUB(payAmount);
}

describe('Pay currency VND. Main currency RUB', () => {

    beforeEach('', () => {
        loginPage.visit();
        loginPage.setAuthorization();
        loginPage.getAcceptCookieButton().click();
        loginPage.getLoginButton().click();
        cy.wait(5000);
        loginPage.getToAdminPanelButton().click();
    });

    it.only('Checkout, product currency RUB, pay currency VND, strategy ALL, 100/0', () => {

        //let payAmount = cy.getRandomArbitrary(300, 500);
        let payAmount = 500;
        let payCurrency = "VND";
        setStartupSettings(payCurrency, 1, 1, 0);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    it('Checkout, product currency RUB, pay currency VND, strategy ALL, 50/50', () => {

        //let payAmount = cy.getRandomArbitrary(300, 500);
        let payAmount = 500;
        let payCurrency = "VND";
        setStartupSettings(payCurrency, 1, 1, 50);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    it('Checkout, product currency RUB, pay currency VND, strategy ALL, 0/100', () => {

        //let payAmount = cy.getRandomArbitrary(300, 500);
        let payAmount = 500;
        let payCurrency = "VND";
        setStartupSettings(payCurrency, 1, 1, 100);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });

    it('Checkout, product currency RUB, pay currency VND, strategy MAX, 100/0', () => {

        //let payAmount = cy.getRandomArbitrary(300, 500);
        let payAmount = 500;
        let payCurrency = "VND";
        setStartupSettings(payCurrency, 2, 1, 0);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });


    it('Checkout, product currency RUB, pay currency VND, strategy MAX, 50/50', () => {

        //let payAmount = cy.getRandomArbitrary(300, 500);
        let payAmount = 500;
        let payCurrency = "VND";
        setStartupSettings(payCurrency, 2, 1, 50);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });
    it('Checkout, product currency RUB, pay currency VND, strategy MAX, 0/100', () => {

        //let payAmount = cy.getRandomArbitrary(300, 500);
        let payAmount = 500;
        let payCurrency = "VND";
        setStartupSettings(payCurrency, 2, 1, 100);
        homePage.getMenuProjects().click();
        homePage.getSubMenuRest().click();
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath(payAmount);
    });
});
