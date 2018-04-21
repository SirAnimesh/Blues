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

// Instantiate an Exprress application and
let app = Express()
app.use(Logger("dev"))
app.use(BodyParser.json())

app.listen(8080, async function() {
    try {
        // Connect with the local RabbitMQ server and create two channels
        let connection  = await RabbitMQ.connect("amqp://localhost")
        let channel     = await connection.createChannel()

        // Create an exchange
        channel.assertExchange("MatchData", "fanout", { durable: false })

        // Create non-durable queues for the two teams. When the connection closes, the 
        // queue will be deleted because it's declared as exclusive.
        let chelsea = await channel.assertQueue("Chelsea", { exclusive: true })
        channel.bindQueue(chelsea.queue, "MatchData", "")

        let juventus = await channel.assertQueue("Juventus", { exclusive: true })
        channel.bindQueue(juventus.queue, "MatchData", "")

        // Publish a message to the MatchData exchange, from where it will fan out to all
        // the queues bound to the exchange
        channel.publish("MatchData", "", Buffer.from("Hello, world!"))

        await ReadQueueData(channel, chelsea, juventus)

        setTimeout(function() {
            connection.close()
            process.exit(0)
        }, 500)
    }
    catch (exception) {
        console.log(exception)
    }
})

async function ReadQueueData(channel: RabbitMQ.Channel, chelsea: RabbitMQ.Replies.AssertQueue, juventus: RabbitMQ.Replies.AssertQueue) {
    channel.consume(chelsea.queue, (message) => {
        console.log("Chelsea queue says: " + message!.content.toString())
    }, { noAck: true })

    channel.consume(juventus.queue, (message) => {
        console.log("Juventus queue says: " + message!.content.toString())
    }, { noAck: true })
}