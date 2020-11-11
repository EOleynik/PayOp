import feenPage from "../../elements/FeenPage";
import loginPage from "../../elements/LoginPage";
import homePage from "../../elements/HomePage";
import restPage from "../../elements/RestPage";
import paymentPage from "../../elements/PaymentPage";
import transactionsPage from "../../elements/TransactionsPage";
import paymentMethodPage from "../../elements/PaymentMethodPage";
import refundsPage from "../../elements/RefundsPage"
import card from "../../fixtures/card";
import math from '../../helpers/MathCheckoutAllCurrenciesSame.js';

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
    cy.server();
    restPage.waitTransactionCreate();
    restPage.getInputOrderID().type('sanitarskiy123',{force: true});
    restPage.getInputOrderAmount().type(payAmount,{force: true});
    restPage.getInputOrderCurrency().type(payCurrency,{force: true});
    restPage.getInputOrderDescription().type('test description',{force: true});
    restPage.getInputResultUrl().type('https://app.stage.payop.com/',{force: true});
    restPage.getInputFailUrl().type('https://app.stage.payop.com/',{force: true});
    restPage.getButtonGenerateConfig().click({force: true});
    restPage.getButtonShowPaymentPage().click({force: true});
    cy.wait('@transactionCreate')
}

function fillCheckoutDataAndPay() {
    paymentPage.getPaymentMethod().click({force: true});
    cy.wait(3000)
    paymentPage.getSubmitPaymentButton().click({force: true});
    window.localStorage.getItem('checkoutData')
    paymentPage.getInputCardNumber().type(card.card_number, {force: true});
    paymentPage.getInputExpirationDate().type(card.expiration_date, {force: true});
    paymentPage.getInputCVC().type(card.CVC, {force: true});
    paymentPage.getInputCardholderName().type(card.cardholder, {force: true});
    paymentPage.getButtonPay().click({force: true});
    cy.wait(6000);
}

function checkTransactionMath() {
    loginPage.visit();
    loginPage.getLoginButton().click({force: true});
    loginPage.getToAdminPanelButton().click({force: true});
    homePage.getMenuPaymentHistory().click({force: true});
}

function createAndCheckRefund() {
    transactionsPage.getTransactionDetails().click({force: true});
    transactionsPage.getCreateFullRefundButton().click({force: true});
    transactionsPage.getConfirmFullRefundButton().click({force: true});
    transactionsPage.getCloseAlertButton().click({force: true});
    homePage.getMenuRefunds().click({force: true});
    refundsPage.checkRefundStatusNew();
    feenPage.acceptRefund();
    refundsPage.visit();
    refundsPage.checkRefundStatusAccepted();
}

describe('Full refund tests', () => {

    beforeEach('Authorization', () => {
        loginPage.visit();
        loginPage.setAuthorization();
        loginPage.getAcceptCookieButton().click({force: true});
        // loginPage.getLoginButton().click({force: true});
        cy.wait(1000)
        homePage.visit()
        // loginPage.getToAdminPanelButton().click({force: true});
    });

    it('Refund, product currency RUB, strategy ALL, 100/0', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 1, 1, 0, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click({force: true});
        homePage.getSubMenuRest().click({force: true});
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath();
        createAndCheckRefund();
    });

    it('Refund, product currency RUB, strategy ALL, 50/50', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 1, 1, 50, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click({force: true});
        homePage.getSubMenuRest().click({force: true});
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath();
        createAndCheckRefund();
    });

    it('Refund, product currency RUB, strategy ALL, 0/100', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 1, 1, 100, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click({force: true});
        homePage.getSubMenuRest().click({force: true});
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath();
        createAndCheckRefund();
    });

    it('Refund, product currency RUB, strategy MAX, 100/0', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 2, 1, 0, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click({force: true});
        homePage.getSubMenuRest().click({force: true});
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath();
        createAndCheckRefund();
    });

    it('Refund, product currency RUB, strategy MAX, 50/50', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 2, 1, 50, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click({force: true});
        homePage.getSubMenuRest().click({force: true});
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath();
        createAndCheckRefund();
    });

    it('Refund, product currency RUB, strategy MAX, 0/100', () => {

        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "RUB";
        setStartupSettings(payCurrency, 2, 1, 100, 'RUB', 10, 10, 'RUB', 10, 10, 0);
        homePage.getMenuProjects().click({force: true});
        homePage.getSubMenuRest().click({force: true});
        fillTransactionData(payAmount, payCurrency);
        fillCheckoutDataAndPay();
        checkTransactionMath();
        createAndCheckRefund();
    });
});
