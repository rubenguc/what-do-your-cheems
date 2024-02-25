import { MESSAGES } from "../messages";
import { ChatContext } from "../interfaces";

export const getLanguageFromMessage = (ctx: ChatContext): string => {
  const language =
    ctx.message?.from?.language_code ||
    ctx.update.message?.from?.language_code ||
    "en";

  return language || "en";
};

export const getMessage = (ctx: ChatContext, message: string): string => {
  const language = getLanguageFromMessage(ctx);

  console.log(language);

  return MESSAGES[language]?.[message] || MESSAGES["en"][message];
};
