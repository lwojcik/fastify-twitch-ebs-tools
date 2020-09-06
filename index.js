const fp = require('fastify-plugin');
const TwitchEbsTools = require('twitch-ebs-tools');

function fastifyTwitchEbs(fastify, options, next) {
  /* istanbul ignore next */
  if (!options.secret) {
    throw new Error('Twitch EBS Tools: Missing JWT secret');
  }

  const {
    secret,
    disabled,
  } = options;

  /* istanbul ignore next - I don't know how to test this */
  function validateToken(token, ignoreExpiration = false) {
    return new TwitchEbsTools(secret).validateToken(token, ignoreExpiration);
  }

  function verifyChannelId(payload, channelId) {
    if (disabled) return true;
    return TwitchEbsTools.verifyChannelId(payload, channelId);
  }

  function verifyTokenNotExpired(payload) {
    if (disabled) return true;
    return TwitchEbsTools.verifyTokenNotExpired(payload);
  }

  function verifyRole(payload, role) {
    if (disabled) return true;
    return TwitchEbsTools.verifyRole(payload, role);
  }

  function verifyChannelIdAndRole(payload, channelId, role) {
    if (disabled) return true;
    return TwitchEbsTools.verifyChannelIdAndRole(payload, channelId, role);
  }

  function verifyBroadcaster(payload) {
    if (disabled) return true;
    return TwitchEbsTools.verifyBroadcaster(payload);
  }

  function verifyViewerOrBroadcaster(payload) {
    if (disabled) return true;
    return TwitchEbsTools.verifyViewerOrBroadcaster(payload);
  }

  function validatePermission(token, channelId, roles, ignoreExpiration = false) {
    if (disabled) return true;
    return new TwitchEbsTools(secret).validatePermission(token, channelId, roles, ignoreExpiration);
  }

  fastify.decorate('twitchEbs', {
    options: {
      secret,
      disabled,
    },
    validateToken,
    validatePermission,
    verifyTokenNotExpired,
    verifyBroadcaster,
    verifyChannelId,
    verifyRole,
    verifyViewerOrBroadcaster,
    verifyChannelIdAndRole,
  });

  next();
}

module.exports = fp(fastifyTwitchEbs, {
  fastify: '>=2.0.0',
  name: 'fastify-twitch-ebs-tools',
});