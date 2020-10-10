import Fastify from 'fastify';
import TwitchEbsTools from 'twitch-ebs-tools';
import jwt from 'jsonwebtoken';
import fastifyTwitchEbsTools from '../src/index';

describe('fastify-twitch-ebs-tools', () => {
  it('should register successfully', () => {
    expect(() => {
      const fastify = Fastify();
      fastify.register(fastifyTwitchEbsTools, {
        disabled: false,
        secret: 'some secret',
      });
    }).not.toThrow();
  });

  it('should expose all twitchEbs methods', async () => {
    expect.assertions(6);
    const fastify = Fastify();

    fastify.register(fastifyTwitchEbsTools, {
      disabled: false,
      secret: 'some secret',
    });

    await fastify.ready();

    expect(fastify.twitchEbs.validateToken).toBeDefined();
    expect(fastify.twitchEbs.verifyChannelId).toBeDefined();
    expect(fastify.twitchEbs.verifyTokenNotExpired).toBeDefined();
    expect(fastify.twitchEbs.verifyRole).toBeDefined();
    expect(fastify.twitchEbs.verifyChannelIdAndRole).toBeDefined();
    expect(fastify.twitchEbs.verifyViewerOrBroadcaster).toBeDefined();
  });

  it('should respect "disabled" option', async () => {
    expect.assertions(7);

    const fastify = Fastify();

    fastify.register(fastifyTwitchEbsTools, {
      disabled: true,
      secret: 'some secret',
    });

    await fastify.ready();

    const testPayload = {} as any;
    const testToken = 'sample_token' as any;

    expect(fastify.twitchEbs.verifyChannelId(testPayload, '123')).toBe(true);
    expect(fastify.twitchEbs.verifyTokenNotExpired(testPayload)).toBe(true);
    expect(fastify.twitchEbs.verifyRole(testPayload, 'role')).toBe(true);
    expect(fastify.twitchEbs.verifyChannelIdAndRole(testPayload, '123', 'role')).toBe(true);
    expect(fastify.twitchEbs.verifyBroadcaster(testPayload)).toBe(true);
    expect(fastify.twitchEbs.verifyViewerOrBroadcaster(testPayload)).toBe(true);
    expect(fastify.twitchEbs.validatePermission(testToken, '123', ['viewer'])).toBe(true);

    fastify.close();
  });

  it('should expose methods corresponding to those of twitch-ebs-tools', async () => {
    expect.assertions(9);

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

    expect(fastify.twitchEbs.validateToken(validToken))
      .toStrictEqual(samplePayload);

    expect(fastify.twitchEbs.verifyChannelId({} as any, '123'))
      .toStrictEqual(TwitchEbsTools.verifyChannelId({} as any, '123'));

    expect(fastify.twitchEbs.verifyTokenNotExpired({} as any))
      .toStrictEqual(TwitchEbsTools.verifyTokenNotExpired({} as any));

    expect(fastify.twitchEbs.verifyRole({} as any, 'role'))
      .toStrictEqual(TwitchEbsTools.verifyRole({} as any, 'role'));

    expect(fastify.twitchEbs.verifyChannelIdAndRole({} as any, '123', 'role'))
      .toStrictEqual(TwitchEbsTools.verifyChannelIdAndRole({} as any, '123', 'role'));

    expect(fastify.twitchEbs.verifyBroadcaster({} as any))
      .toStrictEqual(TwitchEbsTools.verifyBroadcaster({} as any));

    expect(fastify.twitchEbs.verifyViewerOrBroadcaster({} as any))
      .toStrictEqual(TwitchEbsTools.verifyViewerOrBroadcaster({} as any));

    expect(fastify.twitchEbs.validatePermission({} as any, '123', ['viewer']))
      .toStrictEqual(new TwitchEbsTools('some secret').validatePermission({} as any, '123', 'role'));

    expect(fastify.twitchEbs.validatePermission({} as any, '123', ['viewer'], true))
      .toStrictEqual(new TwitchEbsTools('some secret').validatePermission({} as any, '123', ['viewer'], true));

    fastify.close();
  });
});
