// import createDebug from "debug";
import { updateOrCreateChatIfNotExists } from "../firebase/queries";
import { getChatInfo } from "../utils/chat";
import { getMessage } from "../utils/language";
import { COMMANDS } from "../contants";
import { ChatContext } from "../interfaces";

// const debug = createDebug("bot:phrase");

export const phrase = () => async (ctx: ChatContext) => {
  try {
    const { chatId, username } = getChatInfo(ctx);

    await updateOrCreateChatIfNotExists({
      chatId,
      username,
      command: COMMANDS.PHRASE_TO_ANSWER,
    });

    // debug(`Triggered "phrase"`);

    await ctx.reply(getMessage(ctx, "upload_phrase_to_answer"));
  } catch (error) {
    await ctx.reply(getMessage(ctx, "upload_phrase_to_answer_error"));
  }
};
