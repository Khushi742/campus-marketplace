import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidSellerRating } from "../lib/seller-rating.ts";

describe("seller rating validation", () => {
  it("accepts integer ratings from one to five", () => {
    for (const rating of [1, 2, 3, 4, 5]) {
      assert.equal(isValidSellerRating(rating), true);
    }
  });

  it("rejects values outside the supported range or format", () => {
    for (const rating of [0, 6, 1.5, "5", null, NaN]) {
      assert.equal(isValidSellerRating(rating), false);
    }
  });
});
