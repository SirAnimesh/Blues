/**
 *  @file       Starts a Websockets server on localhost and serves the message queue data
 *              to the client.
 *  
 *  @author     Animesh Mishra <hello@animesh.ltd>
 *  @copyright  © 2018 Animesh Ltd. All Rights Reserved.
 */

import * as HTTP        from "http"
import * as RabbitMQ    from "amqplib"
import * as Express     from "express"
import * as WebSocket   from "ws"
import * as Services    from "./services"

// Instantiate an Express application
const app = Express()

// Initialise a basic HTTP server
const server = HTTP.createServer(app)

// Initialise a WebSockets server instance
const socketServer = new WebSocket.Server({ server })

// Binding and routing keys used by RabbitMQ
const chelseaKey = "england.pl.chelsea" 
const juveKey    = "italy.seriea.juve"

socketServer.on("connection", async (socket) => {
    socket.on("message", async (message: string) => {
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
                if(message != null) {
                    let data = JSON.parse(message!.content.toString())
                    socket.send(message!.content.toString())
                    if (data.minute == 91) {
                        socket.send("Full-time")
                        connection.close()
                    }
                }
            })
    
            Services.Simulate()
        }
        catch (exception) {
            console.log(exception)
        }
    })
})

// Start the server
server.listen(8080, function() {
    console.log("Server started at port 8080.")  
})