/**
 *  @file       Starts a Websockets server on localhost and serves the message queue data
 *              to the client.
 *  
 *  @author     Animesh Mishra <hello@animesh.ltd>
 *  @copyright  © 2018 Animesh Ltd. All Rights Reserved.
 */

import * as RabbitMQ    from "amqplib"
import * as Express     from "express"
import * as Logger      from "morgan"
import * as BodyParser  from "body-parser"
import * as Services    from "./services"

// Instantiate an Exprress application and
let app = Express()
app.use(Logger("dev"))
app.use(BodyParser.json())

// Binding and routing keys used by RabbitMQ
const chelseaKey = "england.pl.chelsea" 
const juveKey    = "italy.seriea.juve"

// Route
app.get("/matchdata", async (request, response) => {
    let data = new Array<string>()
    try {
        // Connect with the local RabbitMQ server and create a channel
        let connection  = await RabbitMQ.connect("amqp://localhost")
        let channel     = await connection.createChannel()
        let exchange    = "MatchData"

        // Create a topic exchange
        channel.assertExchange(exchange, "topic", { durable: false })

        // Bind queues to the exchange
        let queue = await channel.assertQueue("", { durable: false })
        channel.bindQueue(queue.queue, exchange, chelseaKey)
        channel.bindQueue(queue.queue, exchange, juveKey)
        
        // Consume data
        channel.consume(queue.queue, (message) => {
            console.log(JSON.parse(message!.content.toString()))
        })

        await Services.Simulate()
    }
    catch (exception) {
        console.log(exception)
    }
})

// Start the server
app.listen(8080, function() {
    console.log("Server started at port 8080.")  
})