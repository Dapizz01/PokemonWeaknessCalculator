
/*
    pokemonDataWeaknesses: {
        name: "",
        "tipo1": 2 // superefficace
        "tipo2": 1 // neutro
        "tipo3": 0.5 // non efficace
        "tipo4": 0 // nessun effetto
    }
*/

/*teamMovesEffectiveness =
[{
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
}]*/

var pokemonsData = Array() // Contiene i dati fetchati da pokeAPI di ogni pokemon
var pokemonsDataWeaknesses = Array() // Contiene le debolezze di ogni pokemon
var pokedex = new Pokedex.Pokedex()

let pokemonMoveScheme = {
    moveName: "",
    pokemonOwner: ""
}

let typeEffectiveness = {
    totalEffectiveness: 0,
    effectiveMoves: [],
    notEffectiveMoves: [],
    immunities: []
}

var teamMovesEffectiveness = {  // Contiene l'efficacia delle mosse sui diversi tipi
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
}

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

var teamImmunities = {  // Contiene il numero di pokemon immuni per tipo
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


// Struttura teamMoves:
/*
    teamMoves = {
        "pokemonName": ...,
        "name": ...,
        "power": ...,
        "type": ...,
    }
*/
var teamMoves = Array()

// Funzione principale, da qua si fa il parsing dell'input, prendo i dati da pokeAPI e trova tutte le debolezze della difesa e delle mosse in attacco
async function getPokemonsWeaknesses(){
	document.getElementById("loadingScreen").className = "loadingVisible"
    if(pokemons[0] != undefined)
        resetVariables()
    getAllPokemonsTextRaw()
    parseRawPokemonInfo()
    await fetchInfoAndCalculateWeaknesses()
    await getMovesEffectiveness()
    await buildAllCards()
    drawGraphTypes()
    drawGraphMoves()
	document.getElementById("loadingScreen").className = "loadingInvisible"
}

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

    // Reset pagina html
    document.getElementById("pokemonCards").innerHTML = "";
    chartTypes.destroy();
    chartMoves.destroy();
}

// Funzione che costruisce le cards dei pokemon
async function buildAllCards(){
    for(let i = 0; i < pokemons.length; i++){
        buildNewCard(pokemons[i], pokemonsData[i], pokemonsDataWeaknesses[i])
    }
}

async function fetchInfoAndCalculateWeaknesses(){
    // Ciclo for (NON FOREACH) che itera ogni pokemon in "pokemons"
    for(let i = 0; i < pokemons.length; i++){
        // pkmn -> Pokemon corrente
        let pkmn = pokemons[i]
        // Fetch di pokeAPI di un certo pokemon (usando await rendo il ciclo sincrono)
        let fetchResult = await pokedex.getPokemonByName(pkmn.name.toLowerCase())

        // Aggiungo il json del pokemon in pokemonsData
        pokemonsData.push(fetchResult)
        // Aggiungo un nuovo elemento in addPokemonWeakness con il nome di quel pokemon
        addPokemonWeakness(fetchResult.name)
        // Trovo i tipi non efficaci / superefficaci chiamando evaluatePokemonWeakness()
        await evaluatePokemonWeaknesses(fetchResult)
    }
    // Calcolo di tutte le debolezze del team
    calculateTeamWeakness()
}

async function evaluatePokemonWeaknesses(pkmn){
    // Analizzo tutte le debolezze e l'efficacia della tipi di un solo pokemon "pkmn", SOLO IN DIFESA, NON IN ATTACCO
    let types = Array() // Insieme dei tipi di un pokemon
    
    // Prendo tutti i tipi del pokemon
    for(let i = 0; i < pkmn.types.length; i++){
        types.push(pkmn.types[i])
    }

    // Ciclo for che itera per ogni tipo trovato
    for(let i = 0; i < types.length; i++){
        // currentType è il tipo corrente
        let currentType = types[i]
        // Fetch della pagina di pokeAPI di un certo tipo, qua uso slice altrimenti dà problemi pokeAPI se c'è "/" alla fine dell'URL
        let result = await pokedex.getTypeByName(currentType.type.name)

        // Aggiorno le debolezze del pokemon, modificando i tipi superefficaci, inefficaci, poco efficaci
        updateWeaknesses(result.name, result.damage_relations.double_damage_from, 2)
        updateWeaknesses(result.name, result.damage_relations.no_damage_from, 0)
        updateWeaknesses(result.name, result.damage_relations.half_damage_from, 0.5)
    }

    // Aggiorno i tipi superefficaci / poco efficaci anche in base al tipo di abilità o di item che un certo pokemon possiede
    updateExceptionWeaknesses(pkmn)
}

/*function evaluateAllPokemonsWeaknesses(){
    // Analizzo tutte le debolezze e l'efficacia della tipi di tutti i pokemon, SOLO IN DIFESA, NON IN ATTACCO
    pokemonsData.forEach((element) => {
        let types = Array() // Insieme dei tipi di un pokemon
        
        // Prendo tutti i tipi di un certo pokemon
        for(let i = 0; i < element.types.length; i++){
            types.push(element.types[i])
        }

        // Per ogni tipo
        types.forEach((currentType) => {
            // Prendo da pokeAPI tutti le relazioni del tipo considerato con gli altri tipi e aggiorno di conseguenza pokemonDataWeaknesses attraverso updateWeaknesses(...)
            fetch(currentType.type.url).then((data) => {
                data.json().then((result) => {
                    let a = updateWeaknesses(element.name, result.damage_relations.double_damage_from, 2)
                    a = updateWeaknesses(element.name, result.damage_relations.no_damage_from, 0)
                    a = updateWeaknesses(element.name, result.damage_relations.half_damage_from, 0.5)
                })
            })
            console.log(currentType)
        })
    })
    // updateExceptionWeaknesses()
}*/

function updateWeaknesses(name, weaknesses, value){
    // Prendo l'ultimo elemento dell'array (dato che aggiorniamo sempre solo l'ultimo elemento)
	 let pkmn = pokemonsDataWeaknesses[pokemonsDataWeaknesses.length-1]
		if(Array.isArray(weaknesses)){
			 // Per ogni debolezza passata in "weaknesses"
			 for(let type in weaknesses){ // type ora contiene un numero, da 0 a n, con n lunghezza di weaknesses
				  // Aggiorno il valore di pokemonsDataWeaknesses con il tipo "type.name" moltiplicandolo per "value"
				 // typeName contiene l'elemento di weaknesses con etichetta type
				  let typeName = weaknesses[type]
				 // typeName.name indica il nome dell'elemento typeName
				  pkmn[typeName.name] *= value
			 }
		}
		else{
			 pkmn[weaknesses] *= value
		}
    return 0;
}

function addPokemonWeakness(name){
    // Crea un nuovo elemento di pokemonsDataWeaknesses con tutti i tipi valorizzati ad 1
    pokemonsDataWeaknesses.push({
        name: name,
        normal: 1,
        fighting: 1,
        flying: 1,
        poison: 1,
        ground: 1,
        rock: 1,
        bug: 1,
        ghost: 1,
        steel: 1,
        fire: 1,
        water: 1,
        grass: 1,
        electric: 1,
        psychic: 1,
        ice: 1,
        dragon: 1,
        dark: 1,
        fairy: 1
    })
}

function updateExceptionWeaknesses(pkmn){
    // Aggiorna le debolezze nel caso il pokemon abbia un certo item o una certa abilita
    // Attenzione -> pkmn è un pokemon preso da pokeAPI, nel ciclo forEach "element" è uno dei pokemon preso in input, per confrontarli trasformo il nome del pokemon in input in minuscolo e confronto se è uguale a quello di pokeAPI
    let pkmnName = pkmn.name
    pokemons.forEach((element) => {
        if(element.name.toLowerCase() == pkmnName){
            switch(element.ability){
                case "Dry Skin":
                    updateWeaknesses(pkmnName, "fire", 1.25)
                    updateWeaknesses(pkmnName, "water", 0)
                    break;
                case "Flash Fire":
                    updateWeaknesses(pkmnName, "fire", 0)
                    break;
                case "Fluffy":
                    updateWeaknesses(pkmnName, "fire", 2)
                    break;
                case "Heatproof":
                case "Water Bubble":
                    updateWeaknesses(pkmnName, "fire", 0.5)
                    break;
                case "Levitate":
                    updateWeaknesses(pkmnName, "ground", 0)
                    break;
                case "Lightning Rod":
                case "Motor Drive":
                case "Volt Absorb":
                    updateWeaknesses(pkmnName, "electric", 0)
                    break;
                case "Sap Sipper":
                    updateWeaknesses(pkmnName, "grass", 0)
                    break;
                case "Storm Drain":
                case "Water Absorb":
                    updateWeaknesses(pkmnName, "water", 0)
                    break;
                case "Thick Fat":
                    updateWeaknesses(pkmnName, "ice", 0.5)
                    updateWeaknesses(pkmnName, "fire", 0.5)
                    break;
                case "Filter":
                case "Prism Armor":
                case "Solid Rock":
                    // Da fare la funzione che permette di modificare il valore di tutti i tipi super efficaci
                    break;
                case "Wonder Guard":
                    // Da fare funzione apposta
                    break;
                default:
                    break;
            }

            // Se il pokemon ha un item
            if(element.item != null){
                switch(element.item){
                    case "Air Baloon":
                        updateWeaknesses(pkmnName, "ground", 0)
                        break;
                    case "Ring Target":
                        // Da fare la funzione che permette di togliere tutti i 0x
                        break;
                    default:
                        break;
                }
            }
            
        }
    })
}

function calculateTeamWeakness(){
    // Ciclo che itera per ogni pokemon
    pokemonsDataWeaknesses.forEach((pkmn) => {
        // Object.keys trasforma un oggetto in array associativo (es: object.prop -> object[prop])
        Object.keys(pkmn).forEach((key) => {
            if(key != "name"){
                // Se la mossa del pokemon è superefficace
                if(pkmn[key] > 1)
                    // Aumento di 1 o di 2 l'efficacia del team contro un certo tipo
                    teamWeaknesses[key] += pkmn[key]/2
                // Se non è molto efficace
                else if(pkmn[key] < 1){
                    if(pkmn[key] != 0)
                        // Diminuisco di 1 o di 2 l'efficacia del team contro un certo tipo
                        teamWeaknesses[key] -= (1/(pkmn[key]))/2
                    else    // Calcolo delle immunità
                        teamImmunities[key]++;
                }
                // console.log(key + " - " + teamWeaknesses[key] + " - " + pkmn[key])
            }
            
        })
    })
}

async function getMovesEffectiveness(){
    let pokemonsList = Array()
    pokemons.forEach((element) => {
        let pokemonMoves = getAllMoves(element)
        pokemonsList.push({
            pokemonName: element.name,
            moves: pokemonMoves
        })
    })
    // Ciclo che itera per ogni pokemon
    for(let i = 0; i < pokemonsList.length; i++){
        // Fetch dei dati della mossa da pokeAPI
        for(let j = 0; j < pokemonsList[i].moves.length; j++){
            let fetchResult = await pokedex.getMoveByName(pokemonsList[i].moves[j])

            // Per ogni mossa memorizzo nome, potenza e tipo
            teamMoves.push({
                pokemonName: pokemonsList[i].pokemonName,
                name: fetchResult.name,
                power: fetchResult.power,
                type: fetchResult.type.name 
            })
        }
    }

    // Per ogni pokemon
    for(let i = 0; i < teamMoves.length; i++){
        // Se la potenza della mossa non è 0 (quindi fa danno)
        if(teamMoves[i].power != null){
            // Fetch dei dati del tipo della mossa
            let fetchResult = await pokedex.getTypeByName(teamMoves[i].type)
            let tempScheme = {
                moveName: teamMoves[i].name,
                pokemonOwner: teamMoves[i].pokemonName
            }

            // Aumento l'efficacia del team nei confronti di un certi tipi
            fetchResult.damage_relations.double_damage_to.forEach((element) => {
                teamMovesEffectiveness[element.name].totalEffectiveness++;
                teamMovesEffectiveness[element.name].effectiveMoves.push({
                    moveName: teamMoves[i].name,
                    pokemonOwner: teamMoves[i].pokemonName
                }) // NON VA!!!
            })
            // Diminuisco l'efficacia del team nei confronti di un certi tipi 
            fetchResult.damage_relations.half_damage_to.forEach((element) => {
                teamMovesEffectiveness[element.name].totalEffectiveness--;
                teamMovesEffectiveness[element.name].notEffectiveMoves.push(tempScheme)
            })
            fetchResult.damage_relations.no_damage_to.forEach((element) => {
                teamMovesEffectiveness[element.name].immunities.push(tempScheme)
            })
          }
    }
}

function getAllMoves(singlePokemon){
    let result = Array()
    // Per ogni pokemon memorizzo nell'array result il nome della mossa, tutto in minuscolo e sostituendo gli spazi con trattini (come vuole pokeAPI)
    result.push(singlePokemon.move1.toLowerCase().replaceAll(" ", "-"))
    result.push(singlePokemon.move2.toLowerCase().replaceAll(" ", "-"))
    result.push(singlePokemon.move3.toLowerCase().replaceAll(" ", "-"))
    result.push(singlePokemon.move4.toLowerCase().replaceAll(" ", "-"))
    return result
}

/*
ESEMPIO: 
debolezze:
-fuoco x2
-fuoco x4
-acqua

resistenze:
-fuoco x0.5
-acqua x0.25
-acqua

complesso:
-fuoco+fuoco-fuoco (1+1-1 = 1)
-acqua-acqua-acqua (+1-1-1 = -1)
*/
