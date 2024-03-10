import { Ticket } from "../ticket";

it("implements optomistic concurrency control OCC", async () => {
  // Create an instance of a ticker
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make a change to each of the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 500 });

  // Save the first modified ticket
  await firstInstance!.save();

  // Save the second modified ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("We should not reach this point");
});

it("increements the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "Awesomesauce",
    price: 17000,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
