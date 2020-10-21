
class LoginPage {

    visit() {
        cy.visit('/');
    }

    getLoginButton() {
        return cy.get('[class="blue-btn login-btn"]');
    }

    getAcceptCookieButton() {
        return cy.get('[class="cookie__accept-btn"]');
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
        window.localStorage.setItem('user-session', '{"id":"45880","email":"dmitri.s+merchd@payop.com","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjQ1ODgwIiwiYWNjZXNzVG9rZW4iOiJlY2Y5MmFjNWQ2N2QxMjQ4MjZmODJlODUiLCJ0aW1lIjoxNjAyNjk3NTU3LCJ3YWxsZXRJZCI6IjM4MDMyIiwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjp0cnVlfX0.iQnu8bPNpxY8fSazCVSkpXOyefdNpn86i9b6Cn0ty4w","role":1,"moduleUrl":"profile","status":1,"accountType":0,"isLoggedIn":true}');
    }
    setLanguageToEng() {
        window.localStorage.setItem('selectedLang', 'en');
    }

    getToAdminPanelButton() {
        return cy.get('[class="mat-focus-indicator mat-raised-button mat-button-base"]');
    }

    remove_captcha() {
        cy.window().then(
            window => console.log(window.localStorage.setItem('disable-captcha\', true'))
        );
    }
}


export default new LoginPage();