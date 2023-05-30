import { describe, it } from "node:test";
import { strict as assert } from "node:assert/strict";

import { Tween, Manager } from "../index.js";

describe("Tween", () => {
  it("works", () => {
    const mockTimer = new Object();
    const manager = new Manager(mockTimer);
    const tween = new Tween(manager);
    assert(tween instanceof Tween);
  });
});
