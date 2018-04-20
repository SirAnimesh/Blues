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
alongwith the source of the message.