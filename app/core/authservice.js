import React from 'react'
import jwtDecode from 'jwt-decode';

export default class AuthService {

  constructor() {
    this.handleAuthentication = this.handleAuthentication.bind(this);
  }

  handleAuthentication(api) {
    this.extractAccessToken(api);
  }

  getParameterByName(name) {
    var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  extractAccessToken(api) {
    const accessToken = this.getParameterByName('access_token');
    const tokenData = jwtDecode(accessToken);
    if (accessToken && tokenData.sub) {
      const userID = tokenData.sub.split('auth0|')[1];
      api.user.saveAccessTokenSession(userID, accessToken, {});
    }
  }
}