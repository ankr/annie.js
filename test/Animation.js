import { describe, it } from "node:test";
import { strict as assert } from "node:assert/strict";

import { Animation, AnimationsManager } from "../index.js";

describe("Animation", () => {
  it("works", () => {
    const mockTimer = new Object();
    const manager = new AnimationsManager(mockTimer);
    const animation = new Animation(manager);
    assert(animation instanceof Animation);
  });
});
