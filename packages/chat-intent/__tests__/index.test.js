/* eslint-env jest */

"use strict";

import ChatIntent from "../src";

describe("generate", () => {
  const generator = new ChatIntent();

  it("converts string", () => {
    const expected = "+56 9 8765 4321";
    const alternatives = [
      "+56 9 8765 4321",
      "+56 9 87654321",
      "+56 9 87654321",
      "+56987654321",
      "  +56 9 87654321   ",
      "  +56 9 87654321",
    ];
    for (const alternative of alternatives) {
      const result = generator.generate(alternative, { country: "CL" });
      expect(result.phone).toEqual(expected);
    }
  });
});
