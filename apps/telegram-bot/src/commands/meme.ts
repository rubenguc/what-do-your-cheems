// import createDebug from "debug";
import { updateOrCreateChatIfNotExists } from "../firebase/queries";
import { getChatInfo } from "../utils/chat";
import { getMessage } from "../utils/language";
import { COMMANDS } from "../contants";
import { ChatContext } from "../interfaces";

// const debug = createDebug("bot:meme");

export const meme = () => async (ctx: ChatContext) => {
  try {
    const { chatId, username } = getChatInfo(ctx);

    await updateOrCreateChatIfNotExists({
      chatId,
      username,
      command: COMMANDS.IMAGE,
    });

    // debug(`Triggered "meme"`);

    await ctx.reply(getMessage(ctx, "upload_meme"));
  } catch (error) {
    await ctx.reply(getMessage(ctx, "upload_meme_error"));
  }
};
