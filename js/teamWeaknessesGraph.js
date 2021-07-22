var ctx = document.getElementById("graph").getContext("2d")
var myChart = "";

function drawGraph(){
    myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["bug", "dark", "dragon", "electric", "fairy", "fighting", "fire", "flying", "ghost","grass","ground", "ice", "normal", "poison", "psychic", "rock", "steel", "water" ],
            datasets: [{
                label: 'Pokemon Weaknesses', 
                data: teamWeaknesses
            }]
        }
    })
}