
class LoginPage {

    visit() {
        cy.visit('/ru');
    }

    getLoginButton() {
        return cy.get('[class="blue-btn login-btn"]', {timeout: 20000});
    }

    getAcceptCookieButton() {
        return cy.get('[class="cookie__accept-btn"]', {timeout: 20000});
    }

    getEmailField() {
        return cy.get('[formcontrolname="email"]');
    }

    getPasswordField() {
        return cy.get('[formcontrolname="password"]');
    }

    getSubmitButton() {
        return cy.get('[class="mat-focus-indicator submit-btn login__submit mat-raised-button mat-button-base mat-primary"]');
    }

    setAuthorization() {
        window.localStorage.setItem('user-session', '{"id":"45880","email":"dmitri.s+merchd@payop.com","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjQ1ODgwIiwiYWNjZXNzVG9rZW4iOiI5NTk3NjFjMTM5ZTY5MjdlYmFhYjdjZTgiLCJ0aW1lIjoxNjA0NzYwNjM1LCJ3YWxsZXRJZCI6IjM4MDMyIiwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjp0cnVlfX0.lsTZ33HQ9K9fRevyOuXQbb_9TSiRxeqZDZsFu4PVIkY","role":1,"moduleUrl":"profile","status":1,"accountType":0,"isLoggedIn":true}');
    }
    setLanguageToEng() {
        window.localStorage.setItem('selectedLang', 'en');
    }

    getToAdminPanelButton() {
        return cy.get('[class="mat-focus-indicator mat-raised-button mat-button-base"]', {timeout: 20000});
    }

    remove_captcha() {
        cy.window().then(
            window => console.log(window.localStorage.setItem('disable-captcha\', true'))
        );
    }
}


export default new LoginPage();