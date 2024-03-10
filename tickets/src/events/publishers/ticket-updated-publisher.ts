import { Publisher, Subjects, TicketUpdatedEvent } from "@aspiro/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
