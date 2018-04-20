# Blues

## Task
Develop a WebSockets (browser based) client that requests an asynchronous reply from a message queue that
fans out to at least 2 possible solution services. Eg. the browser contacts the 'Name the first pasta dish
that comes to mind' queue which fans out to the 'Julia' and 'Robert' services who each answer back after a
random delay with some random message like 'Spaghetti alle Vongele' and 'Tagliatelle al ragù'. Persist the
messages and any data you see fit in a database of your choice. **Present the response & the source of the
response in the Client**.

## My Idea
A football match simulator. Client would establish a Websockets connection with a message queue that fans out
to two services—Chelsea and Juventus. Each service will post messages describing match events – goals,
bookings, substitutions - to the message queue. The Chelsea service will post Chelsea-specific events, and
Juventus service would work likewise. Each event will be persisted in a database, and displayed by the client
along with the source of the message.

## Moving Parts
1. A website (the client)
2. A message queue server
3. Services that feed the message queue
4. A database

## Things I'll need to research
- Websockets
- Message Queues
- RabbitMQ and ZeroMQ


## Architectural Questions

### Which messaging paradigm to implement: point-to-point messaging or PubSub?

### Which queue manager to use: RabbitMQ or ZeroMQ?

### How to model application data? Which database to use?

## Development Plan

1.  Write a website that mocks up responses from a message queue. This would allow me to test the website in isolation.
2.  Implement a message queue server, and fill it with random messages. Again, this way we can test the MQ in isolation.
3.  Now connect the website with MQ.
4.  Write services that feed the message queue.
5.  Connect services and MQ together.
6.  Test the whole chain.
7.  Release.
8.  Party.
