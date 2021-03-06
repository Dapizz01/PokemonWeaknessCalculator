let width = 400
let height = 400
var offsetX = 0
var stepY
var stepX

function setup(){
    createCanvas(width, height);
}

function draw(){
    background(0)
    fill(255) 
    var maxWeakness = 0
    var minWeakness = 10
    let weaknessLength = 0
    Object.keys(teamWeaknesses).forEach((key) => {
        if(teamWeaknesses[key] > maxWeakness)
            maxWeakness = teamWeaknesses[key]
        if(teamWeaknesses[key] < minWeakness)
            minWeakness = teamWeaknesses[key]
        weaknessLength++
    });
    if(maxWeakness > -minWeakness)
        stepY = (height/2)/maxWeakness
    else
        stepY = (height/2)/(-minWeakness)
    stepX = width/weaknessLength
    offsetX = 0
    Object.keys(teamWeaknesses).forEach((key) => {
        textAlign(CENTER)
        if(teamWeaknesses[key] > 0)
            text(teamWeaknesses[key], offsetX+(stepX/2), (height / 2) + 10)
        else   
            text(teamWeaknesses[key], offsetX+(stepX/2), (height / 2) - 10)
        rect(offsetX, height/2, stepX, stepY * -teamWeaknesses[key])
        offsetX += stepX
    })
    //rect(0, height/2, width, 1)
}