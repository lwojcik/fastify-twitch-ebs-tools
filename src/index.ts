import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import TwitchEbsTools, {
  TwitchToken,
  TwitchChannelId,
  TwitchPayload,
  TwitchRole,
  TwitchRoles,
} from 'twitch-ebs-tools';

export interface PluginOptions {
  readonly secret: string;
  readonly disabled: boolean;
}

function fastifyTwitchEbsTools(
  fastify: FastifyInstance,
  options: PluginOptions,
  next: CallableFunction,
): void {
  if (!options.secret) {
    return next(new Error('Twitch EBS Tools: Missing JWT secret'));
  }

  const { secret } = options;
  const disabled = options.disabled || false;

  function validateToken(token: TwitchToken): TwitchPayload | Error {
    return new TwitchEbsTools(secret).validateToken(token);
  }

  function verifyChannelId(payload: TwitchPayload, channelId: TwitchChannelId): boolean {
    if (disabled) return true;
    return TwitchEbsTools.verifyChannelId(payload, channelId);
  }

  function verifyTokenNotExpired(payload: TwitchPayload): boolean {
    if (disabled) return true;
    return TwitchEbsTools.verifyTokenNotExpired(payload);
  }

  function verifyRole(payload: TwitchPayload, role: TwitchRole): boolean {
    if (disabled) return true;
    return TwitchEbsTools.verifyRole(payload, role);
  }

  function verifyChannelIdAndRole(
    payload: TwitchPayload,
    channelId: TwitchChannelId,
    role: TwitchRole,
  ): boolean {
    if (disabled) return true;
    return verifyChannelIdAndRole(payload, channelId, role);
  }

  function verifyBroadcaster(payload: TwitchPayload): boolean {
    if (disabled) return true;
    return TwitchEbsTools.verifyBroadcaster(payload);
  }

  function verifyViewerOrBroadcaster(payload: TwitchPayload): boolean {
    if (disabled) return true;
    return TwitchEbsTools.verifyViewerOrBroadcaster(payload);
  }

  function validatePermission(
    token: TwitchToken,
    channelId: TwitchChannelId,
    roles: TwitchRole | TwitchRoles,
  ): boolean {
    if (disabled) return true;
    return new TwitchEbsTools(secret).validatePermission(token, channelId, roles);
  }

  fastify.decorate('twitchEbsTools', {
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

export default fp(fastifyTwitchEbsTools, {
  fastify: '>=2.0.0',
  name: 'fastify-twitch-ebs-tools',
});
