// Funzione principale, da qua si fa il parsing dell'input, prendo i dati da pokeAPI e trova tutte le debolezze della difesa e delle mosse in attacco
async function getPokemonsWeaknesses(){
	document.getElementById("loadingScreen").className = "loadingVisible"
    if(pokemons[0] != undefined)
        resetVariables()
    try{
        getAllPokemonsTextRaw()
        parseRawPokemonInfo()
        await fetchInfoAndCalculateWeaknesses()
        await getMovesEffectiveness()
        await buildAllCards()
        drawGraphTypes()
        drawGraphMoves()
    }
    catch(error){
        alert(error)
        resetVariables()
    }
	document.getElementById("loadingScreen").className = "loadingInvisible"
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
        let fetchResult;

        if(pkmn.alternativeForm)
            fetchResult = await pokedex.getPokemonFormByName(pkmn.name.toLowerCase()).catch(reason => {
                throw "Error! Pokemon " + pkmn.name.toLowerCase() + " not found\n"
            })
        else
            fetchResult = await pokedex.getPokemonByName(pkmn.name.toLowerCase()).catch(reason => {
                throw "Error! Pokemon " + pkmn.name.toLowerCase() + " not found\n"
            })

        // Fetch di pokeAPI di un certo pokemon (usando await rendo il ciclo sincrono), se c'è un errore, questo viene preso dal catch e viene mandato un errore custom
        // fetchResult = await pokedex.getPokemonByName(pkmn.name.toLowerCase()).catch(reason => {
        //    throw "Error! Pokemon " + pkmn.name.toLowerCase() + " not found\n"
        // })
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
        // Fetch della pagina di pokeAPI di un certo tipo
        let result = await pokedex.getTypeByName(currentType.type.name)

        // Aggiorno le debolezze del pokemon, modificando i tipi superefficaci, inefficaci, poco efficaci
        updateWeaknesses(result.name, result.damage_relations.double_damage_from, 2)
        updateWeaknesses(result.name, result.damage_relations.no_damage_from, 0)
        updateWeaknesses(result.name, result.damage_relations.half_damage_from, 0.5)
    }

    // Aggiorno i tipi superefficaci / poco efficaci anche in base al tipo di abilità o di item che un certo pokemon possiede
    updateExceptionWeaknesses(pkmn)
}

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
                    wondeguard(element.name)
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
            let fetchResult = await pokedex.getMoveByName(pokemonsList[i].moves[j]).catch(reason => {
                throw "Error! Move " + pokemonsList[i].moves[j] + " not found\n"
            })

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
                })
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
    result.push(singlePokemon.move1.toLowerCase().replace(/ /g, "-"))
    result.push(singlePokemon.move2.toLowerCase().replace(/ /g, "-"))
    result.push(singlePokemon.move3.toLowerCase().replace(/ /g, "-"))
    result.push(singlePokemon.move4.toLowerCase().replace(/ /g, "-"))
    return result
}


//--------------------------------
// Funzioni per gestire le abilità
//--------------------------------

function wondeguard(pkmnName){
    // Ciclo che itera per ogni pokemon
    pokemonsDataWeaknesses.forEach((pkmn) => {
        if( pkmnName === pkmn.name )
            // Object.keys trasforma un oggetto in array associativo (es: object.prop -> object[prop])
            Object.keys(pkmn).forEach((key) => {
                if(key != "name")
                    if(pkmn[key] != 2 && pkmn[key] != 4)
                        pkmn[key] = 0
        })
    })
}

/*
ESEMPIO: 
debolezze:
-fuoco x2
-acqua x4
-fuoco x2

resistenze:
-fuoco x0.5
-acqua x0.25

complesso:
-fuoco: 1+1-1 = 1
-acqua-acqua-acqua 2-2 = 0
*/
