import { Publisher, OrderCancelledEvent, Subjects } from "@aspiro/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
