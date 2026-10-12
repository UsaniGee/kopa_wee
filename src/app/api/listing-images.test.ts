import { describe, expect, it } from "vitest";
import { POST as marketplacePOST } from "./marketplace/route";
import { POST as accommodationPOST } from "./accommodation/route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";

const photo = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD";
const item = { title: "Fan", category: "Electronics", price: "₦15,000", description: "Works well", state: "Lagos", lga: "Ikeja" };
const lodge = { title: "Self-contain", description: "Near PPA", location: "Ikeja", state: "Lagos", lga: "Ikeja", price: "₦200,000/year", contactPhone: "08031234567" };

describe("listing photos", () => {
  it.each([
    ["marketplace", (images: unknown) => marketplacePOST(makeRequest("/api/marketplace", { method: "POST", body: { ...item, images } }))],
    ["accommodation", (images: unknown) => accommodationPOST(makeRequest("/api/accommodation", { method: "POST", body: { ...lodge, images } }))],
  ])("%s accepts up to 3 uploaded photos and rejects links and oversized lists", async (_name, post) => {
    signInAs();
    prismaMock.marketplaceItem.create.mockResolvedValue({ id: "x" });
    prismaMock.accommodationListing.create.mockResolvedValue({ id: "x" });

    expect((await post([photo, photo])).status).toBe(201);
    expect((await post(["https://tracker.example/pixel.gif"])).status).toBe(400);
    expect((await post([photo, photo, photo, photo])).status).toBe(400);
  });
});
