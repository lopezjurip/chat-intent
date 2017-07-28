"use strict";

import qs from "qs";

export default function middleware(ctx, next) {
  const { identifier } = ctx.result;
  const { text } = ctx.options;

  const querystring = qs.stringify({
    to: `+${identifier}`,
    text,
  });

  ctx.result.telegram = {
    native: `tg:msg?${querystring}`,
  };

  return next();
}
