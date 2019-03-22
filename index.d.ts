import * as fastify from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
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
      roles: TwitchRole | TwitchRoles
    ): boolean;
  }
  interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    twitchEbs: TwitchEbsTools;
  }
}

declare const fastifyTwitchEbsTools: fastify.Plugin<
  Server,
  IncomingMessage,
  ServerResponse,
  { secret: string; disabled?: boolean }
>;

export = fastifyTwitchEbsTools;
