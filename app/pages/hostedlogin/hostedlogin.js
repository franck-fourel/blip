
/**
 * Copyright (c) 2017, Tidepool Project
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

import LoginNav from '../../components/loginnav';
import LoginLogo from '../../components/loginlogo';

import { AUTH_CONFIG } from '../../authconfig';

export let HostedLogin = React.createClass({

  render: function() {
    const nonce = Math.random().toString(36).substring(7);
    const authURL = `https://${AUTH_CONFIG.domain}/authorize?scope=${AUTH_CONFIG.scope}&audience=${AUTH_CONFIG.audience}&response_type=${AUTH_CONFIG.responseType}&client_id=${AUTH_CONFIG.clientId}&redirect_uri=${AUTH_CONFIG.redirectUri}&nonce=${nonce}`; 
   
    return (
      <div className="HostedLogin">
        <LoginNav
          page="hostedlogin"
          hideLinks={Boolean(this.props.seedEmail)}
          trackMetric={this.props.trackMetric} />
        <LoginLogo />
        <a className="HostedLogin-link" href={authURL}>
          Login
        </a>
      </div>
    );
  },
});



export default HostedLogin;
