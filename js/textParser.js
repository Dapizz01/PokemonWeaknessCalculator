// Struttura oggetto pokemon:
// "name" : nome del pokemon
// "item": strumento del pokemon
// "ability" : abilità del pokemon
// "move1": mossa 1
// "move2": mossa 2
// "move3": mossa 3
// "move4": mossa 4

var pokemons = Array()
var pokemonTextRaw = Array()

function getAllPokemonsTextRaw(){
    let allPokemons = $("#pokeTextTeam").text().split("\n");
    allPokemons.forEach(element => {
        pokemonTextRaw.push(element)
        console.log(element)
    });
}