import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import {
  TwitchEbsTools,
  TwitchToken,
  TwitchPayload,
  TwitchChannelId,
  TwitchRole,
  TwitchRoles,
} from 'twitch-ebs-tools';

export interface TwitchEbsOptions {
  secret: string;
  disabled?: boolean;
}

export interface TwitchEbs {
  validateToken: (token: TwitchToken, ignoreExpiration?: boolean) => boolean;
  verifyChannelId: (payload: TwitchPayload, channelId: TwitchChannelId) => boolean;
  verifyTokenNotExpired: (payload: TwitchPayload) => boolean;
  verifyRole: (payload: TwitchPayload, role: TwitchRole) => boolean;
  verifyChannelIdAndRole: (
    payload: TwitchPayload,
    channelId: TwitchChannelId,
    role: string,
  ) => boolean;
  verifyBroadcaster: (payload: TwitchPayload) => boolean;
  verifyViewerOrBroadcaster: (payload: TwitchPayload) => boolean;
  validatePermission: (
    token: TwitchToken,
    channelId: TwitchChannelId,
    roles: TwitchRoles,
    ignoreExpiration?: boolean,
  ) => boolean;
}

declare module 'fastify' {
  interface FastifyInstance {
    twitchEbs: TwitchEbs;
  }
}

const fastifyTwitchEbsToolsPlugin: FastifyPluginCallback<TwitchEbsOptions> = (
  fastify,
  options,
  next,
) => {
  /* istanbul ignore next - I don't know how to test this */
  if (!options.secret) {
    throw new Error('Fastify Twitch EBS Tools: Missing JWT secret');
  }

  const {
    secret,
    disabled,
  } = options;

  /* istanbul ignore next - I don't know how to test this */
  const validateToken = (token: TwitchToken, ignoreExpiration = false) => {
    if (disabled) return true;
    return new TwitchEbsTools(secret).validateToken(token, ignoreExpiration);
  };

  const verifyChannelId = (payload: TwitchPayload, channelId: TwitchChannelId) => {
    if (disabled) return true;
    return TwitchEbsTools.verifyChannelId(payload, channelId);
  };

  const verifyTokenNotExpired = (payload: TwitchPayload) => {
    if (disabled) return true;
    return TwitchEbsTools.verifyTokenNotExpired(payload);
  };

  const verifyRole = (payload: TwitchPayload, role: TwitchRole) => {
    if (disabled) return true;
    return TwitchEbsTools.verifyRole(payload, role);
  };

  const verifyChannelIdAndRole = (
    payload: TwitchPayload,
    channelId: TwitchChannelId,
    role: string,
  ) => {
    if (disabled) return true;
    return TwitchEbsTools.verifyChannelIdAndRole(payload, channelId, role);
  };

  const verifyBroadcaster = (payload: TwitchPayload) => {
    if (disabled) return true;
    return TwitchEbsTools.verifyBroadcaster(payload);
  };

  const verifyViewerOrBroadcaster = (payload: TwitchPayload) => {
    if (disabled) return true;
    return TwitchEbsTools.verifyViewerOrBroadcaster(payload);
  };

  const validatePermission = (
    token: TwitchToken,
    channelId: TwitchChannelId,
    roles: TwitchRoles,
    ignoreExpiration = false,
  ) => {
    if (disabled) return true;
    return new TwitchEbsTools(secret)
      .validatePermission(token, channelId, roles, ignoreExpiration);
  };

  fastify.decorate('twitchEbs', {
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
};

export default fp(fastifyTwitchEbsToolsPlugin);
