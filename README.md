# fastify-twitch-ebs-tools

[![npm (latest)](https://img.shields.io/npm/v/fastify-twitch-ebs-tools/latest.svg)](https://www.npmjs.com/package/fastify-twitch-ebs-tools)
[![Travis Build Status](https://travis-ci.org/lukemnet/fastify-twitch-ebs-tools.svg?branch=master)](https://travis-ci.org/lukemnet/fastify-twitch-ebs-tools)
[![Maintainability](https://api.codeclimate.com/v1/badges/efe9c52ee3f2a67d2407/maintainability)](https://codeclimate.com/github/lukemnet/fastify-twitch-ebs-tools/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/efe9c52ee3f2a67d2407/test_coverage)](https://codeclimate.com/github/lukemnet/fastify-twitch-ebs-tools/test_coverage)


Fastify plugin providing utility functions for Twitch Extension Backend Services (EBS). Internally it uses [twitch-ebs-tools](https://github.com/lukemnet/twitch-ebs-tools).

## Install

```
npm install fastify-twitch-ebs-tools
```

## Manual build

```
git clone https://github.com/lukemnet/fastify-twitch-ebs-tools.git
cd fastify-twitch-ebs-tools
npm install
npm run build
```

## Usage

Register as a plugin to get access to additional methods.

Example below assumes Twitch token to be sent via request headers.

```js
const fastify = require('fastify');

fastify.register(require('fastify-twitch-ebs-tools'), {
  secret: 'twitch shared secret',
  disabled: false,
});

fastify.get('/config/:channelId', (req, reply) => {
  const { token } = req.headers;
  const { channelId } = req.params;
  const valid = fastify.twitchEbs.validatePermission(
    token,
    channelId,
    'broadcaster',
  );

  if (valid) {
    // do something and send the reply back
    reply.send(/* reply object */);
  } else {
    // error 400
  }
});

fastify.listen(3000, (error) => {
  if (error) throw error;
});
```

## Options

* `secret` - Twitch shared secret used to sign and verify JWTs (required). The plugin will throw an error if no secret is provided. Required.

* `disabled` - if `true`, all validation methods will return `true`. Useful for temporarily disabling route authentication for debugging purposes. Does not affect `validateToken()` method. Defaults to `false`. Optional.

## Usage

All plugin methods pass arguments to relevant methods of `twitch-ebs-tools`. Refer to [`twitch-ebs-tools` documentation](https://github.com/lukemnet/twitch-ebs-tools/blob/master/README.md#basic-usage) to get more details.

Available methods:

* [`fastify.twitchEbs.validateToken(token)`](https://github.com/lukemnet/twitch-ebs-tools/blob/master/README.md#validatetokentoken)

* [`fastify.twitchEbs.validatePermission(token, channelId, roles, ignoreExpiration?)`](https://github.com/lukemnet/twitch-ebs-tools/blob/master/README.md#validatepermissiontoken-channelid-roles-ignoreExpiration)

* [`fastify.twitchEbs.verifyChannelId(payload, channelId)`](https://github.com/lukemnet/twitch-ebs-tools#verifychannelidpayload-channelid)

* [`fastify.twitchEbs.verifyTokenNotExpired(payload)`](https://github.com/lukemnet/twitch-ebs-tools#verifytokennotexpiredpayload)

* [`fastify.twitchEbs.verifyChannelIdAndRole(payload, channelId, role)`](https://github.com/lukemnet/twitch-ebs-tools#verifychannelidandrolepayload-channelid-role)

* [`fastify.twitchEbs.verifyBroadcaster(payload)`](https://github.com/lukemnet/twitch-ebs-tools#verifybroadcasterpayload)

* [`fastify.twitchEbs.verifyViewerOrBroadcaster(payload)`](https://github.com/lukemnet/twitch-ebs-tools#verifyviewerorbroadcasterpayload)

## Contributions

Contributions of any kind are welcome.

You can contribute to Fastify-twitch-ebs-tools by:

* submiting bug reports or feature suggestions
* improving documentation
* submitting pull requests

Before contributing be sure to read [Contributing Guidelines](https://github.com/lukemnet/fastify-twitch-ebs-tools/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/lukemnet/fastify-twitch-ebs-tools/blob/master/CODE_OF_CONDUCT.md).

## Contributors

To all who contribute code, improve documentation, submit issues or feature requests - thank you for making Fastify-twitch-ebs-tools even better!

We maintain an [AUTHORS](https://github.com/lukemnet/twitch-ebs-tools/blob/master/AUTHORS) file where we keep a list of all project contributors. Please consider adding your name there with your next PR.

## License

Licensed under MIT License. See [LICENSE](https://raw.githubusercontent.com/lukemnet/fastify-twitch-ebs-tools/master/LICENSE) for more information.

## Legal

This project is not authored, affiliated or endorsed in any way by Twitch.tv.