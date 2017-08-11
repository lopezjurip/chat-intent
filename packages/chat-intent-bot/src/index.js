"use strict";

const dedent = require("dedent");
const _ = require("lodash");
const moment = require("moment");

const ChatIntent = require("chat-intent").default;
const intentWhatsapp = require("chat-intent-whatsapp").default;
const intentTelegram = require("chat-intent-telegram").default;

const createBot = require("./bot");
const createSessionManager = require("./manager");
const configuration = require("./configuration");
const info = require("../package.json");

const config = configuration();

const intent = new ChatIntent();
intent.use(ChatIntent.middleware.validate());
intent.use(ChatIntent.middleware.encodeText());
intent.use(intentWhatsapp());
intent.use(intentTelegram());

const manager = createSessionManager(config);

const bot = createBot({
  intent,
  manager,
  config,
  info,
});

module.exports = bot;

// eslint-disable-next-line no-console
console.log(dedent`
  Bot Started with:
  - NODE_ENV: ${config.get("NODE_ENV")}
  - URL: ${config.get("URL")}
  - PORT: ${config.get("PORT")}
  - TOKEN: ${_.fill([...config.get("TELEGRAM:TOKEN")], "*", 0, -5).join("")}
  - SESSION: ${config.get("SESSION")}
  - STARTED: ${moment().format()}
`);
