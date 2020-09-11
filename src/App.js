import React from "react";
import { Main } from "./Main.jsx";
import Amplify from "@aws-amplify/core";
import './index.css';
import Storage from 'aws-amplify';

Amplify.configure({
  Auth: {
      region: 'eu-central-1',
      userPoolId: 'xxxx',
      identityPoolId: "xxx",
      userPoolWebClientId: 'xxx',
      oauth: {
        domain: 'xxxx',
        scope: ['email', 'profile', 'openid'],
        redirectSignIn: 'https://kydi.fi/',
        redirectSignOut: 'https://kydi.fi/',
        responseType: 'code',
        options: {
          AdvancedSecurityDataCollectionFlag: false
      }
    }
  },
    Storage: {
        bucket: 'xxx',
        region: 'eu-central-1',
    }
});


export default () => (
  <>
    <Main />
  </>
);
