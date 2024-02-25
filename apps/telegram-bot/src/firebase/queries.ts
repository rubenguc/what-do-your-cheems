import { chatsDB, contributionsDB } from ".";
import { COMMANDS } from "../contants";

interface Chat {
  chatId: number;
  username: string;
  command?: string;
}

export const saveChat = async ({ chatId, username }: Chat) => {
  const result = await chatsDB.add({
    chatId,
    username,
    command: "",
    createdAt: new Date().getTime(),
  });

  return result;
};

export const getChat = async (chatId: number) => {
  const result = await chatsDB.where("chatId", "==", chatId).get();

  return result;
};

export const updateChat = async (chatId: number, command: string) => {
  const result = await getChat(chatId);

  await chatsDB.doc(result.docs[0].id).update({
    command,
  });

  return result;
};

export const createChatIfNotExists = async ({ chatId, username }: Chat) => {
  const chat = await getChat(chatId);

  if (chat.empty) {
    return saveChat({ chatId, username });
  }

  return chat;
};

export const updateOrCreateChatIfNotExists = async ({
  chatId,
  username,
  command,
}: Chat) => {
  const chat = await getChat(chatId);

  if (chat.empty) {
    return saveChat({ chatId, username });
  }

  return updateChat(chatId, command);
};

export const saveContribution = async ({
  chatId,
  content,
  type,
  uploadedBy,
}: {
  type: string;
  content: string;
  uploadedBy: string;
  chatId: number;
}) => {
  const result = await contributionsDB.add({
    chatId,
    content,
    type,
    uploadedBy,
    createdAt: new Date().getTime(),
  });
  return result;
};
