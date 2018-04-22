/**
 *  main.js
 *  Blues
 *
 *  Manages the asynchronous communication between the website and the message queue.
 *
 *  Created on 20 April 2018 by Animesh Mishra <hello@animesh.ltd>
 *  © 2018 Animesh Ltd. All Rights Reserved.
 *
 */

var chelseaScore = 0
var juveScore = 0

/**
 *  `onClick` event handler for the start button. Takes care of the following tasks:
 *      - disabling the Start button after kick-off
 *      - enabling the Reset button after kick-off
 *      - establishing a websockets connection with the server
 *      - managing the server-client communication
 *      - displaying final match result at full-time
 */
function Start() {
    console.log("◊◊◊  Start() begins  ◊◊◊")

    var startButton = document.getElementById("start")
    startButton.disabled = true
    startButton.classList.add("disabled")

    // Open a websockets connection and tell the server that the client is ready
    var webSocket = new WebSocket("ws://localhost:8080")
    webSocket.onopen = function (event) {
        webSocket.send("Bring it on!"); 
    }

    // The Websockets server sends a "Full-time" message to denote the end of a match data
    // stream. The onmessage handler checks for this message and calls the DeclareResult()
    // method to print the match result on the screen.
    // Otherwise, match data events are inserted into the DOM.
    //
    // #TODO: Must think of a better way to handle this scenario
    webSocket.onmessage = function (event) {
        if(event.data == "Full-time") {
            DeclareResult()

            // Enable the Reset button
            var reset = document.getElementById("stop")
            reset.disabled = false
            reset.classList.remove("disabled")
            reset.style.cursor = "pointer"
        }
        else {
            InsertMessage(JSON.parse(event.data))
        }
    }

    console.log("◊◊◊  Start() ends  ◊◊◊")
}

/**
 *  `onClick` event handler for the Reset button. Does the following:
 *      - reset team scores to 0
 *      - removes all the match events and timestamps from the DOM
 *      - reset the match result string to blank ""
 *      - enable the Start button
 *      - disable the Reset button
 *  
 *  #TODO:
 *  Close the connection without introducing bugs. I don't fully understand WebSockets
 *  yet. Earlier I was closing the connection server-side at full-time, but that kept
 *  throwing errors server-side when I refreshed the page and started the simulation again
 */
function Reset() {
    console.log("◊◊◊  Reset() begins  ◊◊◊")
    chelseaScore = 0
    juveScore = 0
    UpdateScore()

    RemoveChildren("minuteEvents")
    RemoveChildren("chelseaEvents")
    RemoveChildren("juveEvents")

    let result = document.getElementById("result")
    result.innerHTML = ""

    var startButton = document.getElementById("start")
    startButton.disabled = false
    startButton.classList.remove("disabled")
    startButton.style.cursor = "pointer"

    var stopButton = document.getElementById("stop")
    stopButton.disabled = true
    stopButton.classList.add("disabled")

    console.log("◊◊◊  Reset() ends  ◊◊◊")
}

function InsertMessage(message) {
    AddTimeStamp(message.minute)

    if (message.source == "Chelsea") {
        if (message.type == "Goal" || message.type == "Goal(P)") { chelseaScore++ }
        AddChelseaEvent(message.player + "  ◊  " + message.type)
        AddJuveEvent(" ")
    }

    else {
        if (message.type == "Goal" || message.type == "Goal(P)") { juveScore++ }
        AddChelseaEvent(" ")
        AddJuveEvent(message.type + "  ◊  " + message.player)
    }

    UpdateScore()
}

function AddTimeStamp(minute) {
    let timestamp = document.createElement("Label")
    timestamp.innerHTML = minute + "'"
    timestamp.setAttribute("class", "minute")
    document.getElementById("minuteEvents").appendChild(timestamp)
}

function AddJuveEvent(text) {
    let label = document.createElement("Label")
    label.innerHTML = text
    label.setAttribute("class", "juveEvent")

    document.getElementById("juveEvents").appendChild(label)
}

function AddChelseaEvent(text) {
    let label = document.createElement("Label")
    label.innerHTML = text
    label.setAttribute("class", "chelseaEvent")

    document.getElementById("chelseaEvents").appendChild(label)
}

function RemoveChildren(divName) {
    let div = document.getElementById(divName)
    while(div.firstChild) {
        div.removeChild(div.firstChild)
    }
}

function UpdateScore() {
    var score = document.getElementById("score")
    score.innerHTML = chelseaScore + "   –   " + juveScore
}

function DeclareResult() {
    let result = document.getElementById("result")

    if (chelseaScore > juveScore) {
        result.innerHTML = "Chelsea wins!"
    }
    else if (chelseaScore < juveScore) {
        result.innerHTML = "Juventus wins!"
    }
    else {
        result.innerHTML = "It was a draw."
    }
}
