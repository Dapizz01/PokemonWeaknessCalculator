// Il file contiene la dichiarazione di tutte le variabili di "weaknessCalculator.js"




var pokemonsData = Array() // Contiene i dati fetchati da pokeAPI di ogni pokemon

var pokemonsDataWeaknesses = Array() // Contiene le debolezze di ogni pokemon
/*
    pokemonsDataWeaknesses = [{
        name: "",
        "tipo1": 2 // superefficace
        "tipo2": 1 // neutro
        "tipo3": 0.5 // non efficace
        "tipo4": 0 // nessun effetto
    }]
*/

var pokedex = new Pokedex.Pokedex() // Oggetto che peremette di effettuare le richieste a pokeAPI
var errorMessage = ""


let pokemonMoveScheme = { // Struttura utilizzata per capire a quale pokemon appartiene una certa mossa
    moveName: "",
    pokemonOwner: ""
}



var teamMovesEffectiveness = {  // Contiene l'efficacia delle mosse sui diversi tipi
    bug: {
        totalEffectiveness: 0,  // Efficacia complessiva del team su questo tipo
        effectiveMoves: [],     // Contiene elementi di tipo pokemonMoveScheme
        notEffectiveMoves: [],  // Contiene elementi di tipo pokemonMoveScheme
        immunities: []          // Contiene elementi di tipo pokemonMoveScheme
    },
    dark: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    dragon: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    electric: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    fairy: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    fighting: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    fire: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    flying: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    ghost: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    grass: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    ground: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    ice: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    normal: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    poison: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    psychic: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    rock: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    steel: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    },
    water: {
        totalEffectiveness: 0,
        effectiveMoves: [],
        notEffectiveMoves: [],
        immunities: []
    }
}
/*
    teamMovesEffectiveness = [{
        ice:
        {
            "totalEffectiveness" : 2,
            "effectiveMoves": [
                {
                    "moveName": "flamethrower"
                    "pokemonOwner": "charizard"
                },
                ...
            ],
            "notEffectiveMoves": [
                ...
            ],
            "immunities": [
                .....
            ]
        }
    }]
*/


var teamWeaknesses = {  // Contiene le debolezze del team ad ogni tipo ( >0 debolezza; <0 resistenza )
    bug: 0,
    dark: 0,
    dragon: 0,
    electric: 0,
    fairy: 0,
    fighting: 0,
    fire: 0,
    flying: 0,
    ghost: 0,
    grass: 0,
    ground: 0,
    ice: 0,
    normal: 0,
    poison: 0,
    psychic: 0,
    rock: 0,
    steel: 0,
    water: 0
}

var teamImmunities = {  // Contiene il numero di pokemon immuni ad un certo tipo
    bug: 0,
    dark: 0,
    dragon: 0,
    electric: 0,
    fairy: 0,
    fighting: 0,
    fire: 0,
    flying: 0,
    ghost: 0,
    grass: 0,
    ground: 0,
    ice: 0,
    normal: 0,
    poison: 0,
    psychic: 0,
    rock: 0,
    steel: 0,
    water: 0
}



var teamMoves = Array()
/*
    teamMoves = {
        "pokemonName": ...,
        "name": ...,
        "power": ...,
        "type": ...,
    }
*/


// Resetta le variabili al loro valore di default e resetta la pagina html
function resetVariables(){
    // Reset variabili
    pokemonsData = Array();
    pokemonsDataWeaknesses = Array();
    pokemons = Array();
    pokemonTextRaw = Array();
    pokemonsTextRaw = Array();
    teamMoves = Array();
    teamWeaknesses = {  // Contiene le debolezze del team ad ogni tipo ( >0 debolezza; <0 resistenza )
        bug: 0, dark: 0, dragon: 0, electric: 0, fairy: 0, fighting: 0, fire: 0, flying: 0, ghost: 0, grass: 0, ground: 0, ice: 0, normal: 0, poison: 0, psychic: 0, rock: 0, steel: 0, water: 0
    };
    teamMovesEffectiveness = {  // Contiene l'efficacia delle mosse sui diversi tipi
        bug: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        dark: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        dragon: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        electric: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        fairy: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        fighting: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        fire: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        flying: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        ghost: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        grass: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        ground: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        ice: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        normal: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        poison: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        psychic: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        rock: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        steel: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        },
        water: {
            totalEffectiveness: 0,
            effectiveMoves: [],
            notEffectiveMoves: [],
            immunities: []
        }
    };
    teamImmunities = {  // Contiene il numero di immunità difensive
        bug: 0, dark: 0, dragon: 0, electric: 0, fairy: 0, fighting: 0, fire: 0, flying: 0, ghost: 0, grass: 0, ground: 0, ice: 0, normal: 0, poison: 0, psychic: 0, rock: 0, steel: 0, water: 0
    };
    correctParse = true
    parsingMessage = ""
    correctFetch = true
    fetchMessage = ""

    // Reset pagina html
    document.getElementById("pokemonCards").innerHTML = "";

    // != undefined perchè, dopo il destroy, chart.js reistanzia i vecchi chart come undefined
    if(chartTypes != undefined && chartTypes != false)
        chartTypes.destroy();
    if(chartMoves != undefined && chartMoves != false)
        chartMoves.destroy();
}