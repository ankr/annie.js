import { describe, it } from "node:test";
import { strict as assert } from "node:assert/strict";

import { Tween } from "../index.js";

describe("Tween", () => {
  it("works", () => {
    const tween = new Tween();
    assert(tween instanceof Tween);
  });
});
