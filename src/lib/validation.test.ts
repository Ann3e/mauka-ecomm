import { describe, expect, it } from "vitest";
import { isValidPin, isValidEmail, imageError, validateListing, type ListingInput } from "./validation";

const base: ListingInput = { title: "Jeans", collection: "wear", type: "Jeans", material: "Cotton denim", size: "32", price: "500",
  description: "d", condition: "c", mainPhoto: true, extraPhotos: 0, flawNote: "", flawPhoto: false, usable: "", ideas: "" };

describe("validation", () => {
  it("accepts six-digit Indian PIN codes only", () => {
    expect(isValidPin("560001")).toBe(true);
    expect(isValidPin("56001")).toBe(false);
    expect(isValidPin("060001")).toBe(false);
  });
  it("rejects invalid email", () => { expect(isValidEmail("a@b")).toBe(false); expect(isValidEmail("a@b.in")).toBe(true); });
  it("rejects non-positive price", () => { expect(validateListing({ ...base, price: "0" })["price"]).toBeDefined(); });
  it("rejects oversized images", () => { expect(imageError({ type: "image/png", size: 4e6 })).not.toBeNull(); });
  it("requires flaw note, flaw photo and usable parts for Restyle but not ideas", () => {
    const e = validateListing({ ...base, collection: "restyle" });
    expect(Object.keys(e).sort()).toEqual(["flawNote", "flawPhoto", "usable"]);
  });
  it("allows at most three extra photos", () => { expect(validateListing({ ...base, extraPhotos: 4 })["extraPhotos"]).toBeDefined(); });
});
