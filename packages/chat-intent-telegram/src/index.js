"use strict";

import qs from "qs";

export default function intentTelegram() {
  return function middleware(ctx, next) {
    const { identifier } = ctx.result;
    const { text } = ctx.options;

    const querystring = qs.stringify(
      {
        to: `+${identifier}`,
        text,
      },
      {
        encode: false,
        addQueryPrefix: true,
      }
    );

    ctx.result.telegram = {
      native: `tg://msg${querystring}`,
    };

    return next();
  };
}
