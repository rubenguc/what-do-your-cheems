import { Firestore } from "@google-cloud/firestore";

const firestore = new Firestore({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export const chatsDB = firestore.collection("chats");
export const contributionsDB = firestore.collection("contributions");
