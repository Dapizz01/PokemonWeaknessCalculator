var ctxTypes = document.getElementById("graphTypes").getContext("2d")
var ctxMoves = document.getElementById("graphMoves").getContext("2d")
var chartTypes = "";
var chartMoves = "";

// Cambio colore font grafico
Chart.defaults.color = "#ebdbb2"

 // In ordine alfabetico dei tipi
var typesBackgroundColor = ['#ccd675', '#88796f', '#9a87ed', '#fed25f', '#f8c2f8', '#b38273', '#f77e58', '#b3c0f9', '#9e9ed1', '#b8e196', '#e0c681', '#bcefff', '#e7e5e1', '#b680b8', '#f69ebd', '#bfa75f', '#b9b9c7' , '#43a1ff']
var typesBorderColor = ['#87960e', '#3c2d23', '#503da6', '#e79200', '#e08ee0', '#5f2310', '#c72101', '#5d73d4', '#454593', '#389a01', '#ad8c34', '#6dd3f5', '#ada594', '#6a246e', '#dc3165', '#9e863d', '#b5b5c4', '#0c67c2']

const tooltipWeakness = (tooltipItems) => {
    let outputString = ""
    pokemonsDataWeaknesses.forEach((element) => {
        if(tooltipItems.datasetIndex == 0){
            if(element[tooltipItems.label] != 0) // Se non si tratta di un'immunità
                outputString = outputString.concat(element.name+": "+element[tooltipItems.label]+"\n")
        }
        else if(tooltipItems.datasetIndex == 1){
            if(element[tooltipItems.label] == 0) // Se si tratta di un'immunità
                outputString = outputString.concat(element.name+"\n")
        }
    })
    return outputString
}

const tooltipMoves = (tooltipItems) => {
    let outputString = ""
    Object.keys(teamMovesEffectiveness).forEach((key) => {
        if(tooltipItems.datasetIndex == 0){
            if(key == tooltipItems.label){
                if(teamMovesEffectiveness[key].effectiveMoves.length > 0)
                    outputString = outputString.concat("\nSupereffective moves (" + teamMovesEffectiveness[key].effectiveMoves.length + "):\n")
                teamMovesEffectiveness[key].effectiveMoves.forEach((element) => {
                    outputString = outputString.concat(element.moveName+" - "+element.pokemonOwner+"\n")
                })
                if(teamMovesEffectiveness[key].notEffectiveMoves.length > 0)
                    outputString = outputString.concat("\nNot very effective moves (" + teamMovesEffectiveness[key].notEffectiveMoves.length + "):\n")
                teamMovesEffectiveness[key].notEffectiveMoves.forEach((element) => {
                    outputString = outputString.concat(element.moveName+" - "+element.pokemonOwner+"\n")
                })
            }
        }
        else if(tooltipItems.datasetIndex == 1){
            if(key == tooltipItems.label){
                if(teamMovesEffectiveness[key].immunities.length > 0)
                    outputString = outputString.concat("\nIneffective moves:\n")
                teamMovesEffectiveness[key].immunities.forEach((element) => {
                    outputString = outputString.concat(element.moveName+" - "+element.pokemonOwner+"\n")
                })
            }
        }
    })
    return outputString
}

function drawGraphTypes(){
    chartTypes = new Chart(ctxTypes, {
        type: "bar",
        data: {
            labels: ["bug", "dark", "dragon", "electric", "fairy", "fighting", "fire", "flying", "ghost","grass","ground", "ice", "normal", "poison", "psychic", "rock", "steel", "water" ],
            datasets: [
            {
                label: 'Pokemon Types Weaknesses', 
                data: teamWeaknesses,
                backgroundColor: typesBackgroundColor,
                borderColor: typesBorderColor,
                borderWidth: 4,
                minBarLength: 3,
                categoryPercentage: 0.8,
                barPercentage: 1
            },
            {
                label: 'Pokemon Types Immunity',
                data: teamImmunities,
                backgroundColor: typesBorderColor,
                borderColor: typesBackgroundColor,
                borderWidth: 4,
                minBarLength: 3,
                categoryPercentage: 0.8,
                barPercentage: 1,
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: tooltipWeakness
                    }
                },
                title: {
                    display: true,
                    text: "Pokemon Types Weaknesses",
                    font: {
                        size: 25
                    }
                }
            }
        }
    })
}

function drawGraphMoves(){
    let totalMoves = Array()
    let immunityMoves = Array()
    Object.keys(teamMovesEffectiveness).forEach((key) => {
        totalMoves.push(teamMovesEffectiveness[key].totalEffectiveness)
        immunityMoves.push(teamMovesEffectiveness[key].immunities.length)
    })
    chartMoves = new Chart(ctxMoves, {
        type: "bar",
        data: {
            labels: ["bug", "dark", "dragon", "electric", "fairy", "fighting", "fire", "flying", "ghost","grass","ground", "ice", "normal", "poison", "psychic", "rock", "steel", "water" ],
            datasets: [{
                label: 'Pokemon Moves Effectiveness', 
                data: totalMoves,
                backgroundColor: typesBackgroundColor,
                borderColor: typesBorderColor,
                borderWidth: 4,
                minBarLength: 3,
                categoryPercentage: 0.8,
                barPercentage: 1
            }, {
                label: 'Pokemon Moves Immunities', 
                data: immunityMoves,
                backgroundColor: typesBorderColor,
                borderColor: typesBackgroundColor,
                borderWidth: 4,
                minBarLength: 3,
                categoryPercentage: 0.8,
                barPercentage: 1,
            }]
        }, 
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: tooltipMoves
                    }
                },
                title: {
                    display: true,
                    text: "Pokemon Moves Type Effectiveness",
                    font: {
                        size: 25
                    }
                },
            }
        }
    })
}