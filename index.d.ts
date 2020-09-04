import { FastifyPlugin } from "fastify";
import {
  TwitchPayload,
  TwitchChannelId,
  TwitchRole,
  TwitchRoles,
  TwitchToken
} from "twitch-ebs-tools/dist/types";

declare module "fastify" {
  interface TwitchEbsTools {
    validateToken(token: string): object | Error;
    verifyChannelId(
      payload: TwitchPayload,
      channelId: TwitchChannelId
    ): boolean;
    verifyTokenNotExpired(payload: TwitchPayload): boolean;
    verifyChannelIdAndRole(
      payload: TwitchPayload,
      channelId: TwitchChannelId,
      role: TwitchRole
    ): boolean;
    verifyBroadcaster(payload: TwitchPayload): boolean;
    verifyViewerOrBroadcaster(payload: TwitchPayload): boolean;
    validatePermission(
      token: TwitchToken,
      channelId: TwitchChannelId,
      roles: TwitchRole | TwitchRoles,
      acceptExpired?: boolean,
    ): boolean;
  }
}

declare const fastifyTwitchEbsTools: FastifyPlugin<
  { secret: string; disabled?: boolean }
>;

export = fastifyTwitchEbsTools;
