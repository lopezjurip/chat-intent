"use strict";

import ChatIntent from "chat-intent";
import intentWhatsapp from "chat-intent-whatsapp";
import intentTelegram from "chat-intent-telegram";
import prettyjson from "prettyjson";
import includes from "lodash/includes";
import startsWith from "lodash/startsWith";

export default function createCLI(builder, print) {
  builder = builder.command({
    command: "generate <phone> [country]",
    aliases: ["gen", "*"],
    desc: "Get URIs to start a conversation.",
    builder: yargs => {
      yargs.option("services", {
        alias: "s",
        describe: "Chat services",
        default: ["whatsapp", "telegram"],
      });
      yargs.option("text", {
        alias: "t",
        describe: "Initial text",
      });
      yargs.option("web", {
        alias: "w",
        describe: "Generate web URIs",
        default: true,
      });
      yargs.option("native", {
        alias: "n",
        describe: "Generate mobile scheme URIs",
        default: false,
      });
    },
    handler: argv => {
      const intent = new ChatIntent();
      intent.use(ChatIntent.middleware.validate());
      intent.use(ChatIntent.middleware.encodeText());
      if (includes(argv.services, "whatsapp")) {
        intent.use(intentWhatsapp());
      }
      if (includes(argv.services, "telegram")) {
        intent.use(intentTelegram());
      }

      const phone = startsWith(argv.phone, "+") ? argv.phone : `+${argv.phone}`;
      const options = {
        text: argv.text,
        country: argv.country || "US",
      };

      const { result } = intent.generate(phone, options);
      if (!result.valid) {
        return print("Invalid number.");
      }
      print(prettyjson.render(result));
    },
  });

  builder = builder.demandCommand().help().wrap(72).argv;

  return builder;
}
