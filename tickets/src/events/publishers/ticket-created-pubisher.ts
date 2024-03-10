import { Publisher, Subjects, TicketCreatedEvent } from "@aspiro/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
