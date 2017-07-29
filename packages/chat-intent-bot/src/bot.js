const bb = require("bot-brother");
const { getPhoneCode } = require("libphonenumber-js");
const dedent = require("dedent");
const moment = require("moment");
const fs = require("mz/fs");
const path = require("path");
const emoji = require("node-emoji").emoji;
const _ = require("lodash");

module.exports = function createBot(options) {
  const { manager, config, info, intent } = options;
  const token = config.get("TELEGRAM:TOKEN");

  const DEFAULT_COUNTRY = "US"; // You win this time.
  const COMMANDS_PATH = path.join(__dirname, "..", "docs", "commands.txt");

  const bot = bb({
    key: token,
    sessionManager: manager,
    webHook: {
      url: `${config.get("URL")}/bot${token}`,
      port: config.get("PORT"),
    },
  });

  bot.texts({
    start: dedent`
      :sparkles: *Keep your address book clean* :sparkles:

      You don't need to add phone numbers to your Contacts to start talking with them.

      Use this bot to create links that starts conversations with a phone number without adding them to contacts.

      <% commands.forEach(command => { -%>
      /<%= command %>
      <% }); -%>
    `,
    about: dedent`
      *<%= info.name %> (<%= info.version %>)*
      *License:* <%= info.license %>
      *Repository:* <%= info.repository.url %>

      :bust_in_silhouette: *Author:*
       • <%= info.author.name %>
       • <%= info.author.email %>
       • <%= info.author.url %>
       • @<%= info.author.username %>
    `,
    service: {
      ask: dedent`
        *Write me the phone number, so I can generate some links.*
        _Are you from <%= emoji.flag %> <%= country %>? The (+<%= code %>) code can be omited._
      `,
      invalid: dedent`
        Sorry but the phone number \`<%= phone %>\` is invalid.
      `,
      answer: dedent`
        *Phone* <%= phone %>
        *Country* <%= emoji.flag %> <%= country %> (+<%= code %>)
        <% if(service.native) { %>
        *<%= service.name %> Mobile* <%= emoji.native %>
        <%= service.native %>
        <% } -%>
        <% if(service.browser) { %>
        *<%= service.name %> Browser* <%= emoji.browser %>
        <%= service.browser %>
        <% } -%>
      `,
    },
    cancel: dedent`
      OK, will cancel the current operation.
      Looking for /help?
    `,
  });

  bot.command(/.*/).use("before", async ctx => {
    // eslint-disable-next-line no-console
    console.log(dedent`
      ${moment().format("YYYY/MM/DD HH:mm:ss")}
      USER: ${JSON.stringify(ctx.meta.user)}
      CHAT: ${JSON.stringify(ctx.meta.chat)}
      FROM: ${JSON.stringify(ctx.meta.from)}
      CMD: ${JSON.stringify(ctx.command)}
      ANSWER: ${JSON.stringify(ctx.answer)}
      CALLBACK: ${JSON.stringify(ctx.callbackData)}
      ---
    `);
  });

  /**
   * /start
   * Init bot showing this first message.
   */
  bot.command("start").invoke(async ctx => {
    const txt = await fs.readFile(COMMANDS_PATH, "utf8");
    // Use String.raw to fix scape problem.
    ctx.data.commands = txt
      .replace("_", String.raw`\_`)
      .split("\n")
      .filter(Boolean);

    await ctx.sendMessage("start", { parse_mode: "Markdown" });
  });

  /**
   * /help
   * Help message, in this case we just redirect to /start
   */
  bot.command("help").invoke(async ctx => {
    await ctx.go("start");
  });

  /**
   * /about
   * Show information from `package.json` like version, author and donation addresses.
   */
  bot.command("about").invoke(async ctx => {
    ctx.data.info = info;
    await ctx.sendMessage("about", { parse_mode: "Markdown" });
  });

  /**
   * /cancel
   * Stop current action. FYI: calling any other /(action) stops the current state.
   */
  bot.command("cancel").invoke(async ctx => {
    ctx.hideKeyboard();
    await ctx.sendMessage("cancel", { parse_mode: "Markdown" });
  });

  /**
   * /telegram
   * Create Telegram URIs
   */
  bot
    .command(/^(telegram|whatsapp)/)
    .invoke(async ctx => {
      let country = ctx.session.country;

      if (!country) {
        const locale = (ctx.meta.user["language_code"] || "").split("-");
        if (locale.length > 1) {
          country = locale[1].toUpperCase();
        } else {
          country = DEFAULT_COUNTRY;
        }
      }

      ctx.session.country = country;

      ctx.data.country = country;
      ctx.data.code = getPhoneCode(country);
      ctx.data.emoji = {
        flag: emoji[`flag-${country.toLowerCase()}`],
      };
      await ctx.sendMessage("service.ask", { parse_mode: "Markdown" });
    })
    .answer(async ctx => {
      const answer = _.trim(ctx.answer);
      const country = ctx.session.country || DEFAULT_COUNTRY;

      const { result } = intent.generate(answer, { country });
      if (!result.valid) {
        ctx.data.phone = result.phone;
        await ctx.sendMessage("service.invalid", {
          parse_mode: "Markdown",
        });
        return await ctx.repeat();
      }

      // Save country for later use.
      ctx.session.country = result.country;

      ctx.data.phone = result.phone;
      ctx.data.code = result.code;
      ctx.data.country = result.country;
      ctx.data.service = result[ctx.command.name.toLowerCase()];
      ctx.data.emoji = {
        flag: emoji[`flag-${result.country.toLowerCase()}`],
        native: emoji["iphone"],
        browser: emoji["globe_with_meridians"],
      };
      await ctx.sendMessage("service.answer", { parse_mode: "Markdown" });
    });
};
