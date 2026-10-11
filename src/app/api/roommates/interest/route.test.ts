import { describe, expect, it } from "vitest";
import { GET, PATCH, POST } from "./route";
import { GET as roommatesGET, PATCH as roommatesPATCH } from "../route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";

const express = (body: unknown) => POST(makeRequest("/api/roommates/interest", { method: "POST", body }));
const respond = (body: unknown) => PATCH(makeRequest("/api/roommates/interest", { method: "PATCH", body }));

const contact = { phone: "+2348031234567", email: "ada@example.com" };

function stubInterest(requestStatus: string, interestStatus = "PENDING") {
  prismaMock.roommateInterest.findUnique.mockResolvedValue({
    id: "int_1",
    status: interestStatus,
    request: { id: "req_1", userId: "owner_1", status: requestStatus },
    interestedUser: { id: "seeker_1", name: "Ada", ppaName: null },
  });
  prismaMock.user.findUnique.mockResolvedValue({ name: "Owner", ppaName: null });
}

describe("roommate interest flow", () => {
  it("lets a signed-in user express interest in someone else's active request", async () => {
    signInAs({ id: "seeker_1" });
    prismaMock.roommateRequest.findUnique.mockResolvedValue({ id: "req_1", userId: "owner_1", status: "ACTIVE" });
    prismaMock.roommateInterest.findUnique.mockResolvedValue(null);
    prismaMock.roommateInterest.create.mockResolvedValue({ id: "int_1" });
    prismaMock.user.findUnique.mockResolvedValue({ name: "Ada", ppaName: null });
    prismaMock.notification.create.mockResolvedValue({});

    const res = await express({ requestId: "req_1", message: "I work in Ikeja too" });

    expect(res.status).toBe(200);
    expect(prismaMock.roommateInterest.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ requestId: "req_1", interestedUserId: "seeker_1", status: "PENDING" }) })
    );
    expect(prismaMock.notification.create).toHaveBeenCalledWith({ data: expect.objectContaining({ userId: "owner_1" }) });
  });

  it("on accept: matches the request, declines other pending interests and notifies both without promising messaging", async () => {
    signInAs({ id: "owner_1" });
    stubInterest("ACTIVE");
    prismaMock.roommateInterest.update.mockResolvedValue({});
    prismaMock.roommateInterest.updateMany.mockResolvedValue({ count: 2 });
    prismaMock.roommateRequest.update.mockResolvedValue({});
    prismaMock.notification.create.mockResolvedValue({});

    const res = await respond({ interestId: "int_1", action: "ACCEPT" });

    expect(res.status).toBe(200);
    expect(prismaMock.roommateInterest.update).toHaveBeenCalledWith({ where: { id: "int_1" }, data: { status: "ACCEPTED" } });
    expect(prismaMock.roommateRequest.update).toHaveBeenCalledWith({ where: { id: "req_1" }, data: { status: "MATCHED" } });
    expect(prismaMock.roommateInterest.updateMany).toHaveBeenCalledWith({
      where: { requestId: "req_1", status: "PENDING", NOT: { id: "int_1" } },
      data: { status: "DECLINED" },
    });
    for (const [arg] of prismaMock.notification.create.mock.calls) {
      expect(arg.data.message).not.toMatch(/send them a message|via the Accommodation tab/i);
    }
  });

  it("only the request owner can respond", async () => {
    signInAs({ id: "someone_else" });
    stubInterest("ACTIVE");
    expect((await respond({ interestId: "int_1", action: "ACCEPT" })).status).toBe(403);
  });

  it("refuses to accept on a request that is no longer active", async () => {
    signInAs({ id: "owner_1" });
    stubInterest("MATCHED");

    const res = await respond({ interestId: "int_1", action: "ACCEPT" });

    expect(res.status).toBe(409);
    expect(prismaMock.roommateRequest.update).not.toHaveBeenCalled();
    expect(prismaMock.roommateInterest.update).not.toHaveBeenCalled();
  });

  it("shows the owner's contact to the interested user only once accepted", async () => {
    signInAs({ id: "seeker_1" });
    const owner = { name: "Owner", avatarUrl: null, ...contact };
    const request = { id: "req_1", state: "Lagos", lga: "Ikeja", area: null, budget: "₦150,000", accommodationType: "Self-contain", status: "MATCHED", user: owner };
    prismaMock.roommateInterest.findMany.mockResolvedValue([
      { id: "int_1", status: "ACCEPTED", request },
      { id: "int_2", status: "PENDING", request: { ...request, id: "req_2", status: "ACTIVE" } },
    ]);

    const body = await (await GET(makeRequest("/api/roommates/interest?mine=true"))).json();

    expect(prismaMock.roommateInterest.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { interestedUserId: "seeker_1" } })
    );
    expect(body.data[0].request.user).toMatchObject(contact);
    expect(body.data[1].request.user).not.toHaveProperty("phone");
    expect(body.data[1].request.user).not.toHaveProperty("email");
  });

  it("shows an interested user's contact to the owner only once accepted", async () => {
    signInAs({ id: "owner_1" });
    prismaMock.roommateRequest.findFirst.mockResolvedValue({
      id: "req_1",
      status: "MATCHED",
      interests: [
        { id: "int_1", status: "ACCEPTED", interestedUser: { id: "seeker_1", name: "Ada", ...contact } },
        { id: "int_2", status: "DECLINED", interestedUser: { id: "seeker_2", name: "Bo", ...contact } },
      ],
    });

    const body = await (await roommatesGET(makeRequest("/api/roommates?my=true"))).json();

    expect(body.data.interests[0].interestedUser).toMatchObject(contact);
    expect(body.data.interests[1].interestedUser).not.toHaveProperty("phone");
    expect(body.data.interests[1].interestedUser).not.toHaveProperty("email");
  });

  it("does not let a MATCHED request be edited", async () => {
    signInAs({ id: "owner_1" });
    prismaMock.roommateRequest.findFirst.mockResolvedValue(null); // only ACTIVE requests are editable

    const res = await roommatesPATCH(makeRequest("/api/roommates", { method: "PATCH", body: { id: "req_1", budget: "₦1" } }));

    expect(res.status).toBe(404);
    expect(prismaMock.roommateRequest.findFirst).toHaveBeenCalledWith({
      where: { id: "req_1", userId: "owner_1", status: "ACTIVE" },
    });
    expect(prismaMock.roommateRequest.update).not.toHaveBeenCalled();
  });
});
