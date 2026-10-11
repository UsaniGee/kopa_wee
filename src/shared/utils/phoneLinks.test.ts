import { describe, expect, it } from "vitest";
import { telLink, whatsAppLink } from "./phoneLinks";

describe("phone links", () => {
  it("builds WhatsApp links from local, 234 and +234 numbers", () => {
    for (const phone of ["0803 123 4567", "2348031234567", "+234 803-123-4567"]) {
      expect(whatsAppLink(phone)).toBe("https://wa.me/2348031234567");
    }
  });

  it("adds a URL-encoded opening message", () => {
    expect(whatsAppLink("08031234567", "Hi, is the fan still available?")).toBe(
      "https://wa.me/2348031234567?text=Hi%2C%20is%20the%20fan%20still%20available%3F"
    );
  });

  it("builds tel: links in international format", () => {
    expect(telLink("0803 123 4567")).toBe("tel:+2348031234567");
  });

  it("returns null for missing or unusable numbers", () => {
    for (const phone of [null, undefined, "", "call me", "12"]) {
      expect(whatsAppLink(phone)).toBeNull();
      expect(telLink(phone)).toBeNull();
    }
  });
});
