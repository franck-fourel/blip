export const AUTH_CONFIG = {
  domain: 'tidepool-dev.auth0.com',
  clientId: 'uoaUqRCwDo4oEVF2gXwbaGMQ74GQYQLz',
  responseType: 'id_token token',
  scope: 'openid profile read:device-data',
  audience: 'open-api',
  loginRedirectUri: 'http://localhost:3000/logged-in',
  signupRedirectUri: 'http://localhost:3000/email-verification'
}