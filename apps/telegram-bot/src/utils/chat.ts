import { ChatContext } from "../interfaces";

export const getChatInfo = ({ chat }: ChatContext) => {
  const chatId = chat.id;
  const username = chat!.username;

  return {
    chatId,
    username,
  };
};
