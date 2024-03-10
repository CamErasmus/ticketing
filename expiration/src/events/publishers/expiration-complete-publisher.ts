import { Publisher, ExpirationCompleteEvent, Subjects } from "@aspiro/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
