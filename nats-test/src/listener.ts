import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const id = randomBytes(4).toString("hex");

const stan = nats.connect("ticketing", id, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Noice. Listener connected successfully.");

  stan.on("close", () => {
    console.log("NATS closed");
    process.exit();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
