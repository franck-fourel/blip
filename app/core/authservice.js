import React from 'react'

export default class AuthService {
  constructor() {
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleAuthentication() {
    console.log('handleAuthentication');
    console.log(window.location.hash);
    this.extractAccessToken();
    this.extractIDToken();
  }

  getParameterByName(name) {
    var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  extractAccessToken() {
    const accessToken = this.getParameterByName('access_token');
    console.log('saving access_token ...', accessToken);
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
    }
  }

  extractIDToken() {
    const idToken = this.getParameterByName('id_token');
    console.log('saving id_token ...', idToken);
    if (idToken) {
      localStorage.setItem('id_token', idToken);
    }
  }

  loggedIn(){
    if (this.getAccessToken() && this.getIDToken()){
      return true;
    }
    return false;
  }

  getAccessToken(){
    return localStorage.getItem('access_token');
  }

  getIDToken(){
    return localStorage.getItem('id_token');
  }

  logout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }
}