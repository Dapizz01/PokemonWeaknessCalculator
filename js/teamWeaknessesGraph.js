var ctxTypes = document.getElementById("graphTypes").getContext("2d")
var ctxMoves = document.getElementById("graphMoves").getContext("2d")
var chartTypes = "";
var chartMoves = "";

 // In ordine alfabetico dei tipi
var typesBackgroundColor = ['#ccd675', '#88796f', '#9a87ed', '#fed25f', '#f8c2f8', '#b38273', '#f77e58', '#b3c0f9', '#9e9ed1', '#b8e196', '#e0c681', '#bcefff', '#e7e5e1', '#b680b8', '#f69ebd', '#bfa75f', '#b9b9c7' , '#43a1ff']
var typesBorderColor = ['#87960e', '#3c2d23', '#503da6', '#e79200', '#e08ee0', '#5f2310', '#c72101', '#5d73d4', '#454593', '#389a01', '#ad8c34', '#6dd3f5', '#ada594', '#6a246e', '#dc3165', '#9e863d', '#b5b5c4', '#0c67c2']

function drawGraphTypes(){
    chartTypes = new Chart(ctxTypes, {
        type: "bar",
        data: {
            labels: ["bug", "dark", "dragon", "electric", "fairy", "fighting", "fire", "flying", "ghost","grass","ground", "ice", "normal", "poison", "psychic", "rock", "steel", "water" ],
            datasets: [{
                label: 'Pokemon Types Weaknesses', 
                data: teamWeaknesses,
                backgroundColor: typesBackgroundColor,
                borderColor: typesBorderColor,
                borderWidth: 4
            }]
        }
    })
}

function drawGraphMoves(){
    chartMoves = new Chart(ctxMoves, {
        type: "bar",
        data: {
            labels: ["bug", "dark", "dragon", "electric", "fairy", "fighting", "fire", "flying", "ghost","grass","ground", "ice", "normal", "poison", "psychic", "rock", "steel", "water" ],
            datasets: [{
                label: 'Pokemon Moves Effectiveness', 
                data: teamMovesEffectiveness,
                backgroundColor: typesBackgroundColor,
                borderColor: typesBorderColor,
                borderWidth: 4
            }]
        }
    })
}
