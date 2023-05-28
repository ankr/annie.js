import { describe, it } from "node:test";
import { strict as assert } from "node:assert/strict";

import { Animation } from "../index.js";

describe("Animation", () => {
  it("works", () => {
    const animation = new Animation();
    assert(animation instanceof Animation);
  });
});
