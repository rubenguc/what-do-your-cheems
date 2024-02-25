// @ts-nocheck
import { Telegraf } from "telegraf";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { development, production } from "./core";
import { ping, start } from "./commands";
import { github, web } from "./commands/links";
import { phrase } from "./commands/phrase";
import { meme } from "./commands/meme";
import { message } from "telegraf/filters";
import { uploadMeme, uploadPhrase } from "./commands/upload";
import { BOT_TOKEN, ENVIRONMENT } from "./env";

const bot = new Telegraf(BOT_TOKEN);

// tslint:disable-next-line: no-console
bot.command("ping", ping());
bot.command("start", start());
bot.command("github", github());
bot.command("link", web());
bot.command("phrase", phrase());
bot.command("meme", meme());
bot.on(message("text"), uploadPhrase());
bot.on(message("photo"), uploadMeme());
bot.on(message("document"), uploadMeme());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== "production" && development(bot);
