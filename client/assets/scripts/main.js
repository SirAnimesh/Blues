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

function Start() {
  console.log("◊◊◊  Start() begins  ◊◊◊")

  var startButton = document.getElementById("start")
  startButton.disabled = true
  startButton.classList.add("disabled")

  var stopButton = document.getElementById("stop")
  stopButton.disabled = false
  stopButton.classList.remove("disabled")
  stopButton.style.cursor = "pointer"

  MockMQ()

  console.log("◊◊◊  Start() ends  ◊◊◊")
}

function Reset() {
  console.log("◊◊◊  Reset() begins  ◊◊◊")

  var startButton = document.getElementById("start")
  startButton.disabled = false
  startButton.classList.remove("disabled")
  startButton.style.cursor = "pointer"

  var stopButton = document.getElementById("stop")
  stopButton.disabled = true
  stopButton.classList.add("disabled")

  console.log("◊◊◊  Reset() ends  ◊◊◊")

}

async function MockMQ() {
    // Will keep calling InsertMessage() every second until
    // the interval is cleared
    var counter = 1

    var intervalID = setInterval(function() {
        if(counter % 2 == 0) {
            InsertMessage({
                source: "chelsea",
                type: "Foul",
                player: "Willian",
                minute: (counter * 8) - 3
            })
        }
        else {
            InsertMessage({
                source: "juventus",
                type: "Goal(P)",
                player: "Dybala",
                minute: (counter * 8) - 3
            })
        }
        counter += 1;

    }, 1000)

    // Clears the interval after 15 seconds
    setTimeout(function() {
        clearInterval(intervalID)
        StopSimulation()
    }, 12000)
}

function InsertMessage(message) {
    AddTimeStamp(message.minute)

    if(message.source == "chelsea") {
        if(message.type == "Goal" || message.type == "Goal(P)") { chelseaScore++ }
        AddChelseaEvent(message.player + "  ◊  " + message.type)
        AddJuveEvent(" ")
    }

    else {
        if(message.type == "Goal" || message.type == "Goal(P)") { juveScore++ }
        AddChelseaEvent(" ")
        AddJuveEvent(message.type + "  ◊  " + message.player)
    }

    UpdateScore()
}

function AddTimeStamp(minute) {
    let timestamp = document.createElement("Label")
    timestamp.innerHTML = minute + "'"
    timestamp.setAttribute("class", "minute")
    document.getElementById("minutes").appendChild(timestamp)
}

//
//   message = {source: "juventus", text: "", minute: 8}
//
function AddJuveEvent(text) {
    let label = document.createElement("Label")
    label.innerHTML = text
    label.setAttribute("class", "juveEvent")

    document.getElementById("juventus").appendChild(label)
}

function AddChelseaEvent(text) {
    let label = document.createElement("Label")
    label.innerHTML = text
    label.setAttribute("class", "chelseaEvent")

    document.getElementById("chelsea").appendChild(label)
}

function UpdateScore() {
    var score = document.getElementById("score")
    score.innerHTML = chelseaScore + "   –   " + juveScore
}

function StopSimulation() {
    let result = document.getElementById("result")

    if(chelseaScore > juveScore) {
        result.innerHTML = "Chelsea wins!"
    }
    else if (chelseaScore < juveScore) {
        result.innerHTML = "Juventus wins!"
    }
    else {
        result.innerHTML = "It was a draw."
    }
}
