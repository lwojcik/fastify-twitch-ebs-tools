const Fastify = require('fastify');
const fastifyTwitchEbsTools = require('./index');
const TwitchEbsTools = require('twitch-ebs-tools');
const jwt = require('jsonwebtoken');

describe('fastify-twitch-ebs-tools', () => {
  test('should register successfully', () => {
    expect(() => {
      const fastify = Fastify();
      fastify.register(fastifyTwitchEbsTools, {
        disabled: false,
        secret: 'some secret'
      });
    }).not.toThrow();
  });

  test('should expose all twitchEbs methods', () => {
    const fastify = Fastify();

    fastify.register(fastifyTwitchEbsTools, {
      disabled: false,
      secret: 'some secret'
    });

    fastify.ready(function () {
      expect(fastify.twitchEbs.validateToken).toBeDefined();
      expect(fastify.twitchEbs.verifyChannelId).toBeDefined();
      expect(fastify.twitchEbs.verifyTokenNotExpired).toBeDefined();
      expect(fastify.twitchEbs.verifyRole).toBeDefined();
      expect(fastify.twitchEbs.verifyChannelIdAndRole).toBeDefined();
      expect(fastify.twitchEbs.verifyViewerOrBroadcaster).toBeDefined();
    });
  });

  test('methods should respect "disabled" option', async () => {
    const fastify = Fastify();

    fastify.register(fastifyTwitchEbsTools, {
      disabled: true,
      secret: 'some secret'
    });

    await fastify.ready();

    expect(fastify.twitchEbs.verifyChannelId({}, '123')).toEqual(true);
    expect(fastify.twitchEbs.verifyTokenNotExpired({})).toEqual(true);
    expect(fastify.twitchEbs.verifyRole({}, 'role')).toEqual(true);
    expect(fastify.twitchEbs.verifyChannelIdAndRole({}, '123', 'role')).toEqual(true);
    expect(fastify.twitchEbs.verifyBroadcaster({})).toEqual(true);
    expect(fastify.twitchEbs.verifyViewerOrBroadcaster({})).toEqual(true);
    expect(fastify.twitchEbs.validatePermission({}, '123', 'role')).toEqual(true);
    fastify.close();
  });

  test('methods should correspond to relevant methods of twitch-ebs-tools', async () => {
    const fastify = Fastify();
    const sampleSecret = 'some secret';
    const samplePayload = { foo: 'bar' };
    const validToken = jwt.sign(samplePayload, Buffer.from(sampleSecret, 'base64'), {
      noTimestamp: true,
    });

    fastify.register(fastifyTwitchEbsTools, {
      disabled: false,
      secret: sampleSecret,
    });

    await fastify.ready();

    expect(fastify.twitchEbs.validateToken(validToken)).toEqual(samplePayload);
    expect(fastify.twitchEbs.verifyChannelId({}, '123')).toEqual(TwitchEbsTools.verifyChannelId({}, '123'));
    expect(fastify.twitchEbs.verifyTokenNotExpired({})).toEqual(TwitchEbsTools.verifyTokenNotExpired({}));
    expect(fastify.twitchEbs.verifyRole({}, 'role')).toEqual(TwitchEbsTools.verifyRole({}, 'role'));
    expect(fastify.twitchEbs.verifyChannelIdAndRole({}, '123', 'role')).toEqual(TwitchEbsTools.verifyChannelIdAndRole({}, '123', 'role'));
    expect(fastify.twitchEbs.verifyBroadcaster({})).toEqual(TwitchEbsTools.verifyBroadcaster({}));
    expect(fastify.twitchEbs.verifyViewerOrBroadcaster({})).toEqual(TwitchEbsTools.verifyViewerOrBroadcaster({}));
    expect(fastify.twitchEbs.validatePermission({}, '123', 'role')).toEqual(new TwitchEbsTools('some secret').validatePermission({}, '123', 'role'));
  });
});
