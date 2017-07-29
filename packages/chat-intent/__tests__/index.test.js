/* eslint-env jest */

"use strict";

import ChatIntent, { middleware } from "../src";

describe("generate", () => {
  it("converts string", () => {
    const phone = "+56 9 8765 4321";
    const alternatives = [
      "+56 9 8765 4321",
      "+56 9 87654321",
      "+56 9 87654321",
      "+56987654321",
      "  +56 9 87654321   ",
      "  +56 9 87654321",
    ];
    for (const alternative of alternatives) {
      const generator = new ChatIntent();
      const { result } = generator.generate(alternative, { country: "CL" });
      expect(result.phone).toEqual(phone);
    }
  });

  it("encodes text with middleware", () => {
    const generator = new ChatIntent();
    generator.use(middleware.encodeText());

    const phone = "+56 9 8765 4321";
    const text = "Hello world!";
    const { options } = generator.generate(phone, { country: "CL", text });
    expect(options.text).toEqual("Hello+world!");
  });

  it("works with validate middleware", () => {
    const generator = new ChatIntent();
    generator.use(middleware.validate());

    const phone = "+56 9 8765 4321";
    const { result } = generator.generate(phone, { country: "CL" });
    expect(result.identifier).toEqual("56987654321");
    expect(result.valid).toBeTruthy(); // because is undefined.
  });

  it.only("prefixes with country code", () => {
    const generator = new ChatIntent();
    generator.use(middleware.validate());
    const phone = "987654321";
    const { result } = generator.generate(phone, { country: "CL" });
    expect(result.identifier).toEqual("56987654321");
    expect(result.phone).toEqual("+56 9 8765 4321");
  });
});
