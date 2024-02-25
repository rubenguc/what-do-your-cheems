import createDebug from "debug";
import { ChatContext } from "../interfaces";
import { GITHUB_LINK, WEB_LINK } from "../env";

const debug = createDebug("bot:links");

export const github = () => async (ctx: ChatContext) => {
  const message = GITHUB_LINK;

  debug(`Triggered "github" command with message \n${message}`);

  await ctx.reply(message);
};

export const web = () => async (ctx: ChatContext) => {
  const message = WEB_LINK;

  debug(`Triggered "web" command with message \n${message}`);

  await ctx.reply(message);
};
