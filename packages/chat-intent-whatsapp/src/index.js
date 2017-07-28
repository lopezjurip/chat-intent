"use strict";

import qs from "qs";

export default function middleware(ctx, next) {
  const { identifier } = ctx.result;
  const { text } = ctx.options;

  const querystring = qs.stringify({
    phone: identifier,
    text,
  });

  ctx.result.whatsapp = {
    browser: `https://web.whatsapp.com/send?${querystring}`,
    native: `whatsapp://send?${querystring}`,
  };

  return next();
}
