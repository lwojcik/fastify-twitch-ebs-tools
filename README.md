# fastify-twitch-ebs-tools

[![npm (latest)](https://img.shields.io/npm/v/fastify-twitch-ebs-tools/latest.svg)](https://www.npmjs.com/package/fastify-twitch-ebs-tools)
[![Travis Build Status](https://travis-ci.org/lukemnet/fastify-twitch-ebs-tools.svg?branch=master)](https://travis-ci.org/lukemnet/fastify-twitch-ebs-tools)
[![Maintainability](https://api.codeclimate.com/v1/badges/efe9c52ee3f2a67d2407/maintainability)](https://codeclimate.com/github/lukemnet/fastify-twitch-ebs-tools/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/efe9c52ee3f2a67d2407/test_coverage)](https://codeclimate.com/github/lukemnet/fastify-twitch-ebs-tools/test_coverage)


Fastify plugin providing useful functions for Twitch Extension Backend Services (EBS). Internally it uses [twitch-ebs-tools](https://github.com/lukemnet/twitch-ebs-tools).

## Installation

```
npm install --save fastify-twitch-ebs-tools
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

* [`fastify.twitchEbs.validatePermission(token, channelId, roles, acceptExipired?)`](https://github.com/lukemnet/twitch-ebs-tools/blob/master/README.md#validatepermissiontoken-channelid-roles-acceptexpired)

* [`fastify.twitchEbs.verifyChannelId(payload, channelId)`](https://github.com/lukemnet/twitch-ebs-tools#verifychannelidpayload-channelid)

* [`fastify.twitchEbs.verifyTokenNotExpired(payload)`](https://github.com/lukemnet/twitch-ebs-tools#verifytokennotexpiredpayload)

* [`fastify.twitchEbs.verifyChannelIdAndRole(payload, channelId, role)`](https://github.com/lukemnet/twitch-ebs-tools#verifychannelidandrolepayload-channelid-role)

* [`fastify.twitchEbs.verifyBroadcaster(payload)`](https://github.com/lukemnet/twitch-ebs-tools#verifybroadcasterpayload)

* [`fastify.twitchEbs.verifyViewerOrBroadcaster(payload)`](https://github.com/lukemnet/twitch-ebs-tools#verifyviewerorbroadcasterpayload)

## License

Licensed under MIT License. See [LICENSE](https://raw.githubusercontent.com/lukemnet/fastify-twitch-ebs-tools/master/LICENSE) for more information.
