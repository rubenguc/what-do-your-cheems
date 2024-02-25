import createDebug from "debug";
import { ChatContext } from "../interfaces";

const debug = createDebug("bot:ping");

export const ping = () => async (ctx: ChatContext) => {
  const message = `🏓 Pong ${ctx.message?.from?.first_name}`;

  debug(`Triggered "ping" command with message \n${message}`);

  await ctx.reply(message);
};
