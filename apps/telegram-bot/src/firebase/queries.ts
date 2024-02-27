import axios from "axios";

const firebaseAPI = axios.create({
  baseURL: `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents/`,
});

interface Chat {
  chatId: number;
  username: string;
  command?: string;
}

const createChat = async ({ chatId, username, command }: Chat) => {
  await firebaseAPI.post("chats", {
    fields: {
      chatId: { integerValue: chatId },
      username: { stringValue: username },
      command: { stringValue: command },
    },
  });
};

const getChatByChatId = async (chatId: number) => {
  const response = await firebaseAPI.get(`chats`);

  return response.data.documents?.find(
    (chat: any) => chat.fields.chatId?.integerValue == chatId
  );
};

export const saveChat = async ({ chatId, username }: Chat) => {
  const result = await createChat({
    chatId,
    username,
    command: "",
  });

  return result;
};

export const getChat = async (chatId: number) => {
  const result = await getChatByChatId(chatId);

  if (!result) {
    return null;
  }

  return {
    id: result.name.split("/").pop(),
    chatId: result.fields.chatId.integerValue,
    username: result.fields.username.stringValue,
    command: result.fields.command.stringValue,
  };
};

export const updateChat = async (chatId: number, command: string) => {
  const chat = await getChat(chatId);

  await firebaseAPI.patch(`chats/${chat?.id}?updateMask.fieldPaths=command`, {
    fields: {
      command: { stringValue: command },
    },
  });
};

export const createChatIfNotExists = async ({ chatId, username }: Chat) => {
  const chat = await getChat(chatId);

  if (!chat) {
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

  if (!chat) {
    return saveChat({ chatId, username });
  }

  return updateChat(chatId, command as string);
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
  const result = await firebaseAPI.post(`contributions`, {
    fields: {
      chatId: { integerValue: chatId },
      content: { stringValue: content },
      type: { stringValue: type },
      uploadedBy: { stringValue: uploadedBy },
    },
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  });

  return result;
};
