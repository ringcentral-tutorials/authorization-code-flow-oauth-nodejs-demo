# RingCentral Authorization Code Flow OAuth in Node.js with Express Web framework

## Overview

The OAuth 2.0 authorization code flow (aka 3-legged OAuth) protects users information and lets them control what they share with your app. You are required to use this flow if your app is a web app and will be used by more than one user.

### Clone and Setup the project
```
$ git clone https://github.com/ringcentral-tutorials/authorization-code-flow-oauth-nodejs-demo

$ cd authorization-code-flow-oauth-nodejs-demo

$ npm install --save

$ cp environment/dotenv-sandbox environment/.env-sandbox

$ cp environment/dotenv-production environment/.env-production

```

### Create an app

* Create an application at [RingCentral Developer Portal](https://developer.ringcentral.com).
* Select `Server/Web` for the Platform type.
* Add the `ReadAccounts`, `ReadCallLog` permissions for the app.
* Specify the redirect Uri as `http://localhost:5000/oauth2callback`
* Copy the Client id and Client secret and add them to the `.env-[environment]` file.
```
RC_CLIENT_ID=
RC_CLIENT_SECRET=
```

If you don't know how to create a RingCentral app. Click [https://developer.ringcentral.com/library/getting-started.html](here) for instructions.

### Run the demo

```
$ node index.js
```

On a Web browser, enter `localhost:5000` then choose to login your production or sandbox account.

### RingCentral Developer Portal
To setup a free developer account, click [here](https://developer/ringcentral.com)

## RingCentral Node JS SDK
The SDK is available at https://github.com/ringcentral/ringcentral-js
