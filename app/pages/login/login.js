
/**
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../redux/actions';

import { Link } from 'react-router';
import _ from 'lodash';

import utils from '../../core/utils';

import LoginNav from '../../components/loginnav';
import LoginLogo from '../../components/loginlogo';

export let Login = React.createClass({
  propTypes: {
    acknowledgeNotification: React.PropTypes.func.isRequired,
    confirmSignup: React.PropTypes.func.isRequired,
    fetchers: React.PropTypes.array.isRequired,
    isInvite: React.PropTypes.bool.isRequired,
    notification: React.PropTypes.object,
    onSubmit: React.PropTypes.func.isRequired,
    seedEmail: React.PropTypes.string,
    trackMetric: React.PropTypes.func.isRequired,
    working: React.PropTypes.bool.isRequired
  },

  getInitialState: function() {
    return {
      seedEmail: this.props.seedEmail,
      notification: null
    };
  },

  render: function() {
    var form = this.renderForm();
    var inviteIntro = this.renderInviteIntroduction();

    return (
      <div className="login">
        <LoginNav
          page="login"
          hideLinks={Boolean(this.props.seedEmail)}
          trackMetric={this.props.trackMetric} />
        <LoginLogo />

        {inviteIntro}
        <div className="container-small-outer login-form">
          <div className="container-small-inner login-form-box">
            <div className="login-simpleform">{form}</div>
          </div>
        </div>
      </div>
    );
  },

  renderInviteIntroduction: function() {
    if (!this.props.isInvite) {
      return null;
    }

    return (
      <div className='login-inviteIntro'>
        <p>{'You\'ve been invited to Tidepool.'}</p><p>{'Log in to view the invitation.'}</p>
      </div>
    );
  },

  renderForm: function() {
    var forgotPassword = this.renderForgotPassword();
    const loggedInRedirectUri = 'http://localhost:3000/logged-in';

    const loginURL = `http://localhost:3007?email=${this.state.seedEmail}&redirect_uri=${loggedInRedirectUri}`

    return (
      <div>
        {<div className="login-forgotpassword">{forgotPassword}</div>}
        <a className="login" href={loginURL}>
          Login
        </a>
      </div>
    );
  },

  logPasswordReset : function() {
    this.props.trackMetric('Clicked Forgot Password');
  },

  renderForgotPassword: function() {
    return <Link to="/request-password-reset">Forgot your password?</Link>;
  },

  doFetching: function(nextProps) {
    if (!nextProps.fetchers) {
      return;
    }
    nextProps.fetchers.forEach(fetcher => {
      fetcher();
    });
  },

  /**
   * Before rendering for first time
   * begin fetching any required data
   */
  componentWillMount: function() {
    this.doFetching(this.props);
  }
});

/**
 * Expose "Smart" Component that is connect-ed to Redux
 */

let getFetchers = (dispatchProps, ownProps, other, api) => {
  if (other.signupKey) {
    return [
      dispatchProps.confirmSignup.bind(null, api, other.signupKey, other.signupEmail)
    ];
  }

  return [];
}

export function mapStateToProps(state) {
  return {
    notification: state.blip.working.loggingIn.notification || state.blip.working.confirmingSignup.notification,
    working: state.blip.working.loggingIn.inProgress,
  };
}

let mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit: actions.async.login,
  acknowledgeNotification: actions.sync.acknowledgeNotification,
  confirmSignup: actions.async.confirmSignup
}, dispatch);

let mergeProps = (stateProps, dispatchProps, ownProps) => {
  let seedEmail = utils.getInviteEmail(ownProps.location) || utils.getSignupEmail(ownProps.location);
  let signupKey = utils.getSignupKey(ownProps.location);
  let isInvite = !_.isEmpty(utils.getInviteEmail(ownProps.location));
  let api = ownProps.routes[0].api;
  return Object.assign({}, stateProps, dispatchProps, {
    fetchers: getFetchers(dispatchProps, ownProps, { signupKey, signupEmail: seedEmail }, api),
    isInvite: isInvite,
    seedEmail: seedEmail,
    trackMetric: ownProps.routes[0].trackMetric,
    onSubmit: dispatchProps.onSubmit.bind(null, api)
  });
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Login);
