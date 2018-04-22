/**
 *  @file       Simulates the two webservices – Chelsea and Juventus – that feed match data into
 *              the match data exchange.
 *  
 *  @author     Animesh Mishra <hello@animesh.ltd>
 *  @copyright  © 2018 Animesh Ltd. All Rights Reserved.
 */

import * as RabbitMQ from "amqplib"

class Message {
    public source?: string
    public type?: string
    public player?: string
    public minute?: number
}

const eventTypes = [
    "Goal",
    "Goal(P)",
    "Foul",
    "Booking(Y)",
    "Booking(R)"
]

// Binding and routing keys used by RabbitMQ
const chelseaKey = "england.pl.chelsea" 
const juveKey    = "italy.seriea.juve"

export async function Simulate() {
    // Connect with the local RabbitMQ server and create a channel
    let connection  = await RabbitMQ.connect("amqp://localhost")
    let channel     = await connection.createChannel()
    let exchange    = "MatchData"

    // Create a topic exchange
    channel.assertExchange(exchange, "topic", { durable: false })

    // Bind queues to the exchange
    let chelsea = await channel.assertQueue("chelsea", { durable: false })
    channel.bindQueue(chelsea.queue, exchange, chelseaKey)
    
    let juventus = await channel.assertQueue("juventus", { durable: false })
    channel.bindQueue(juventus.queue, exchange, juveKey)

    let chelseaPlayers = [
        "Hazard",
        "Fàbregas",
        "Willian",
        "Azpilicueta",
        "Alonso"
    ]

    let juvePlayers = [
        "Mandzukic",
        "Dybala",
        "Higuain",
        "Sandro",
        "Buffon",
    ]

    let counter = 1

    let intervalID = setInterval(function() {
        let randomIndex = Math.floor(Math.random() * 5)
        if(counter % 2 == 0) {
            let message     = new Message()
            message.source  = "Chelsea"
            message.type    = eventTypes[randomIndex]
            message.player  = chelseaPlayers[randomIndex]
            message.minute  = counter * 7

            // Publish a message to the MatchData exchange, from where it will be broadcasted to all
            // the queues subscribed to the topic chelseaKey (england.pl.chelsea)
            channel.publish(exchange, chelseaKey, Buffer.from(JSON.stringify(message)))
        }
        else {
            let message     = new Message()
            message.source  = "Juventus"
            message.type    = eventTypes[randomIndex]
            message.player  = juvePlayers[randomIndex]
            message.minute  = counter * 7

            // Publish a message to the MatchData exchange, from where it will be broadcasted to all
            // the queues subscribed to the topic juveKey (italy.seriea.juventus)
            // Since we are persisting the message in our own databases, I've set the queue
            channel.publish(exchange, juveKey, Buffer.from(JSON.stringify(message)))
        }
        counter++
    }, 1000)

    setTimeout(function() {
        clearInterval(intervalID)
    }, 14000)
}