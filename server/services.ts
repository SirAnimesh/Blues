/**
 *  @file       Simulates the two webservices – Chelsea and Juventus – that feed match data into
 *              the match data exchange.
 *  
 *  @author     Animesh Mishra <hello@animesh.ltd>
 *  @copyright  © 2018 Animesh Ltd. All Rights Reserved.
 */

import * as RabbitMQ from "amqplib"

/**
 *  An Event instance describes notable incidents occuring throughout a game. E.g. goals, fouls,
 *  bookings etc. 
 */
class Event {
    /** Service from which the message originated */
    public source?: string

    /** Type of the event. Must be a member of the static `Types` array. */
    public type?: string

    /** Person of Interest */
    public player?: string

    /** Minute at which the incident occured */
    public minute?: number

    /** Supported event types */
    public static Types = [
        "Goal",
        "Goal(P)",
        "Foul",
        "Booking(Y)",
        "Booking(R)"
    ]
}

// Binding and routing keys used by RabbitMQ
const chelseaKey = "england.pl.chelsea" 
const juveKey    = "italy.seriea.juve"

/**
 *  Simulates the `Chelsea` and `Juventus` services by randomly generating match events.
 *  Publishes events to the exchange using the routing keys `england.pl.chelsea` and 
 *  `italy.seriea.juve`.
 *  
 *  #TODO:
 *  Swap this with actual inputs from the respective services.
 */
export async function Simulate() {
    // Connect with the local RabbitMQ server and create a channel
    let connection  = await RabbitMQ.connect("amqp://localhost")
    let channel     = await connection.createChannel()
    let exchange    = "MatchData"

    // Create a topic exchange
    channel.assertExchange(exchange, "topic", { durable: false })

    // Bind queues to the topic exchange
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

    // Publish a random message to the queue every second
    let intervalID = setInterval(function() {
        let randomIndex = Math.floor(Math.random() * 5)
        if(counter % 2 == 0) {
            let message     = new Event()
            message.source  = "Chelsea"
            message.type    = Event.Types[randomIndex]
            message.player  = chelseaPlayers[randomIndex]
            message.minute  = counter * 7

            // Publish a message to the MatchData exchange, from where it will be broadcasted to all
            // the queues subscribed to the topic chelseaKey (england.pl.chelsea)
            channel.publish(exchange, chelseaKey, Buffer.from(JSON.stringify(message)))
        }
        else {
            let message     = new Event()
            message.source  = "Juventus"
            message.type    = Event.Types[randomIndex]
            message.player  = juvePlayers[randomIndex]
            message.minute  = counter * 7

            // Publish a message to the MatchData exchange, from where it will be broadcasted to all
            // the queues subscribed to the topic juveKey (italy.seriea.juventus)
            channel.publish(exchange, juveKey, Buffer.from(JSON.stringify(message)))
        }
        counter++
    }, 1000)

    // Clear out the message publish loop after 14 seconds
    setTimeout(function() {
        clearInterval(intervalID)
    }, 14000)
}