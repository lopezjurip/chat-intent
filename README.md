# chat-intent

[![dependencies][dependencies-image]][dependencies-url] [![dev-dependencies][dev-dependencies-image]][dev-dependencies-url] [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Getting started

Install the main `chat-intent` and the middleware you may need as `chat-intent-whatsapp` and `chat-intent-telegram`:

```sh
yarn add chat-intent chat-intent-whatsapp chat-intent-telegram
```

Create URIs, URLs and parsed phone number:

```js
const ChatIntent = require("chat-intent").default;
const intentWhatsapp = require("chat-intent-whatsapp").default;
const intentTelegram = require("chat-intent-telegram").default;

const intent = new ChatIntent();
intent.use(intentWhatsapp);
intent.use(intentTelegram);

const result = intent.generate("+56 9 8765 4321");
console.log(result);
```

## Development

Clone and install dependencies:

```sh
git clone https://github.com/mrpatiwi/chat-intent.git
cd chat-intent
yarn
```

[dependencies-image]: https://david-dm.org/mrpatiwi/chat-intent.svg
[dependencies-url]: https://david-dm.org/mrpatiwi/chat-intent
[dev-dependencies-image]: https://david-dm.org/mrpatiwi/chat-intent/dev-status.svg
[dev-dependencies-url]: https://david-dm.org/mrpatiwi/chat-intent#info=devDependencies
