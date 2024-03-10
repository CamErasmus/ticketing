import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

// Some repeated functions. Listed here for ease of access
const id = new mongoose.Types.ObjectId().toHexString();

it("returns a 404 if the provided id does not exist", async () => {
  const cookie = await global.signin();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({ title: "asdhv", price: 20 })
    .expect(404);
});

it("returns a 401 is the user is not authenticated", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "asdhv", price: 20 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const cookie1 = await global.signin();
  const cookie2 = await global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie1)
    .send({ title: "akjcba", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({ title: "adasc", price: 20 })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie1 = await global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie1)
    .send({ title: "akjcba", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie1)
    .send({ title: "", price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie1)
    .send({ title: "Title", price: -10 })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie1 = await global.signin();
  const title = "A New Title";
  const price = 100;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie1)
    .send({ title: "akjcba", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie1)
    .send({ title: title, price: price })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

it("publishes an event", async () => {
  const cookie = await global.signin();
  const title = "A New Title";
  const price = 100;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "akjcba", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: title, price: price })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "akjcba", price: 20 });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 6000 })
    .expect(400);
});
