export const oktaConfig = {
    clientId: '0oaous4xbhpz2I3xZ5d7',
    issuer: 'https://dev-52715003.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}