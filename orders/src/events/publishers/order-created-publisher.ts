import { Publisher, OrderCreatedEvent, Subjects } from "@aspiro/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
