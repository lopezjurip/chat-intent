"use strict";

import { getPhoneCode, isValidNumber, asYouType } from "libphonenumber-js";
import { composeSync } from "ctx-compose";
import replace from "lodash/replace";
import trim from "lodash/trim";

const DEFAULT = {
  country: "US",
};

export const middleware = {
  validate: () => ({ result }, next) => {
    if (isValidNumber(result.phone)) {
      result.valid = true;
      return next();
    } else {
      result.valid = false;
    }
  },
  encodeText: () => ({ options }, next) => {
    if (options.text) {
      options.text = replace(options.text, / /g, "+");
    }
    return next();
  },
};

export default class ChatIntent {
  constructor() {
    this.middleware = [];
  }

  use(...middlewares) {
    this.middleware = [...this.middleware, ...middlewares];
    return this;
  }

  generate(value = "", options = DEFAULT) {
    const formatter = new asYouType(options.country);
    const phone = formatter.input(trim(value));
    const country = formatter["country"] || options.country;
    const code = formatter["country_phone_code"] || getPhoneCode(country);
    const identifier = replace(phone, /([.*+?^=!:${}()|[\]/\\_-\s])/g, "");

    const result = { identifier, phone, country, code };
    const context = { result, options };
    composeSync(this.middleware)(context);
    return context;
  }
}

ChatIntent.middleware = middleware;
