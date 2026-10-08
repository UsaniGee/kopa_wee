import { describe, expect, it } from "vitest";
import { GET as marketplaceGET } from "./marketplace/route";
import { GET as accommodationGET } from "./accommodation/route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";

const sellerSelect = () => prismaMock.marketplaceItem.findMany.mock.calls[0][0].include.seller.select;
const ownerSelect = () => prismaMock.accommodationListing.findMany.mock.calls[0][0].include.owner.select;

describe("listing contact details", () => {
  it("hides seller email and phone from signed-out visitors", async () => {
    prismaMock.marketplaceItem.findMany.mockResolvedValue([]);
    await marketplaceGET(makeRequest("/api/marketplace"));
    expect(sellerSelect()).not.toHaveProperty("email");
    expect(sellerSelect()).not.toHaveProperty("phone");
    expect(sellerSelect()).toHaveProperty("name", true);
  });

  it("shows seller phone and email to signed-in users", async () => {
    signInAs();
    prismaMock.marketplaceItem.findMany.mockResolvedValue([]);
    await marketplaceGET(makeRequest("/api/marketplace"));
    expect(sellerSelect()).toMatchObject({ phone: true, email: true });
  });

  it("hides lodge owner contact and the listing phone from signed-out visitors", async () => {
    prismaMock.accommodationListing.findMany.mockResolvedValue([
      { id: "l1", contactPhone: "08030000000", owner: { name: "Owner" } },
    ]);

    const body = await (await accommodationGET(makeRequest("/api/accommodation"))).json();

    expect(ownerSelect()).not.toHaveProperty("phone");
    expect(ownerSelect()).not.toHaveProperty("email");
    expect(body.data[0].contactPhone).toBeNull();
  });

  it("shows the lodge contact phone to signed-in users", async () => {
    signInAs();
    prismaMock.accommodationListing.findMany.mockResolvedValue([
      { id: "l1", contactPhone: "08030000000", owner: { name: "Owner" } },
    ]);
    const body = await (await accommodationGET(makeRequest("/api/accommodation"))).json();
    expect(body.data[0].contactPhone).toBe("08030000000");
  });
});
