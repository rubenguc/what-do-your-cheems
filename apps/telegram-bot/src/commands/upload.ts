import { getChat, saveContribution, updateChat } from "../firebase/queries";
import { getChatInfo } from "../utils/chat";
import { getMessage } from "../utils/language";
import { COMMANDS } from "../contants";
import axios from "axios";
import { ChatContext } from "../interfaces";
import { BOT_TOKEN } from "../env";

export const uploadPhrase = () => async (ctx: ChatContext) => {
  try {
    const { chatId, username } = getChatInfo(ctx);

    const chat = await getChat(chatId);

    if (chat?.command === COMMANDS.PHRASE_TO_ANSWER) {
      await saveContribution({
        chatId,
        type: COMMANDS.PHRASE_TO_ANSWER,
        uploadedBy: username,
        content: ctx.message!.text,
      });

      await updateChat(chatId, "");
      await ctx.reply(getMessage(ctx, "upload_phrase_to_answer_success"));
    }
  } catch (error) {
    await ctx.reply(getMessage(ctx, "upload_phrase_to_answer_error"));
  }
};

export const uploadMeme = () => async (ctx: ChatContext) => {
  try {
    const { chatId, username } = getChatInfo(ctx);

    const chat = await getChat(chatId);

    if (chat?.command === COMMANDS.IMAGE) {
      const isDocument = Boolean(ctx.update.message.document);

      if (isDocument) {
        const mymeType: string = ctx.update.message.document.mime_type || "";

        if (!mymeType.includes("image/")) {
          return ctx.reply(getMessage(ctx, "upload_meme_image_error"));
        }
      }

      const fileId =
        ctx.update.message.photo?.pop?.()?.file_id ||
        ctx.update.message.document?.file_id;

      const res = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
      );

      const filePath = res.data.result.file_path;

      const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

      await saveContribution({
        chatId,
        type: COMMANDS.IMAGE,
        uploadedBy: username,
        content: url,
      });

      await updateChat(chatId, "");
      await ctx.reply(getMessage(ctx, "upload_meme_success"));
    }
  } catch (error) {
    await ctx.reply(getMessage(ctx, "upload_meme_error"));
  }
};
