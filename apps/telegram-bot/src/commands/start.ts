import createDebug from "debug";
import { getMessage } from "../utils/language";
import { createChatIfNotExists, saveChat } from "../firebase/queries";
import { getChatInfo } from "../utils/chat";
import { ChatContext } from "../interfaces";

const debug = createDebug("bot:start");

export const start = () => async (ctx: ChatContext) => {
  const message = getMessage(ctx, "start_message");

  const { chatId, username } = getChatInfo(ctx);

  await createChatIfNotExists({
    chatId,
    username,
  });

  debug(`Triggered "start" command with message \n${message}`);

  await ctx.reply(message);
};
