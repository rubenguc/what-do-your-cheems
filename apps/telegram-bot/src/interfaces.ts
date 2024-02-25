import { Context } from "telegraf";

type Chat = Context["chat"] & {
  username: string;
};

type Update = Context["update"] & {
  message: {
    from: {
      language_code: string;
    };
    document: {
      mime_type: string;
      file_id: string;
    };
    photo?: [
      {
        file_id: string;
      },
    ];
  };
};

type Message = Context["message"] & {
  text: string;
};

export type ChatContext = Context & {
  chat: Chat;
  update: Update;
  message?: Message;
};
