// Struttura oggetto pokemon:
// "name" : nome del pokemon
// "item": strumento del pokemon
// "ability" : abilità del pokemon
// "move1": mossa 1
// "move2": mossa 2
// "move3": mossa 3
// "move4": mossa 4

let pokemons = Array()
let pokemonTextRaw = Array() // Contiene tutti i pokemon così come sono inseriti nel textarea

function getAllPokemonsTextRaw(){
    // Prendo tutti i pokemon nel textarea, dividendoli per ogni \n\n e poi li metto nell'array allPokemons
    let allPokemons = document.getElementById("pokeTeamText").value.split("\n\n");
    allPokemons.forEach(element => {
        pokemonTextRaw.push(element)
        console.log(element)
    });
}

function parseRawPokemonInfo(){
    // Per ogni pokemon memorizzato in pokemonTextRaw, trovo ogni valore importante e lo memorizzo come oggetto in pokemons
    pokemonTextRaw.forEach(element => {
        pokemons.push({
            "name": getPokemonNameRaw(element),
            "item": getPokemonItemRaw(element),
            "ability": getPokemonAbilityRaw(element),
            "move1": getPokemonMovesRaw(element, 1),
            "move2": getPokemonMovesRaw(element, 2),
            "move3": getPokemonMovesRaw(element, 3),
            "move4": getPokemonMovesRaw(element, 4)
        })
    });
}

function getPokemonNameRaw(pokemonRaw){
    // Prendo il nome del pokemon: prima riga, primo valore separato dallo spazio
    let name = pokemonRaw.split(" ")[0]
    
    // Eccezioni per pokemon che si distinguono per il genere
    if(name == "Indeedee"){
        if(pokemonRaw.split(" ")[1] == "(M)")
            name = "Indeedee-male"
        else
            name = "Indeedee-female"
    }
    
    return name;
}

function getPokemonItemRaw(pokemonRaw){
    // Prima riga, prendo l'oggetto del pokemon che è la sottostringa dopo la @, escluso il primo spazio
    let item = pokemonRaw.split("\n")[0].split("@")[1]
    return item.substring(1, item.length-2)
}

function getPokemonAbilityRaw(pokemonRaw){
    // Seconda riga, prendo il nome dopo lo spazio
    let ability = pokemonRaw.split("\n")[1].split(": ")[1]
    return ability.substring(0, ability.length-2)
}

function getPokemonMovesRaw(pokemonRaw, index){
    // Cerco tutte le mosse di un certo pokemon e le memorizzo in moves, dopo ritorno quella richiesta da "index"
    // index va da 1 a 4
    let rows = pokemonRaw.split("\n")
    let moves = Array()
    rows.forEach((element) => {
        if(element.substring(0, 1) == "-"){
            moves.push(element.substring(2, element.length-2))
        }
    })
    return moves[index-1]
}

/* ESEMPIO:
Palkia @ Life Orb  
Ability: Telepathy  
Level: 50  
EVs: 4 HP / 252 SpA / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Spacial Rend  
- Thunder  
- Hydro Pump  
- Fire Blast  

Landorus-Therian (M) @ Assault Vest  
Ability: Intimidate  
Level: 50  
EVs: 92 HP / 68 Atk / 92 SpD / 252 Spe  
Jolly Nature  
- Earthquake  
- U-turn  
- Fly  
- Rock Slide  

Whimsicott @ Focus Sash  
Ability: Prankster  
Level: 50  
EVs: 4 HP / 252 SpA / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Tailwind  
- Helping Hand  
- Dazzling Gleam  
- Protect  

Rotom-Heat @ Safety Goggles  
Ability: Levitate  
Level: 50  
EVs: 252 HP / 188 SpA / 68 Spe  
Timid Nature  
IVs: 0 Atk  
- Thunderbolt  
- Overheat  
- Protect  
- Nasty Plot  

Indeedee (M) @ Odd Incense  
Ability: Psychic Surge  
Level: 50  
EVs: 4 HP / 252 SpA / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Trick Room  
- Imprison  
- Expanding Force  
- Protect  

Registeel @ Leftovers  
Ability: Clear Body  
Level: 50  
EVs: 156 HP / 4 Atk / 252 Def / 4 SpD / 92 Spe  
Serious Nature  
- Iron Defense  
- Body Press  
- Iron Head  
- Protect  

*/