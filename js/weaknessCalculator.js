var pokemonsData = Array() // Contiene i dati fetchati da pokeAPI di ogni pokemon
var pokemonsDataWeaknesses = Array() // Contiene le debolezze di ogni pokemon
/*
    pokemonDataWeaknesses: {
        name: "",
        "tipo1": 2 // superefficace
        "tipo2": 1 // neutro
        "tipo3": 0.5 // non efficace
        "tipo4": 0 // nessun effetto
    }
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

var teamMovesEffectiveness = {  // Contiene l'efficacia delle mosse sui diversi tipi
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
        "name": ...,
        "power": ...,
        "type": ...,
    }
*/
var teamMoves = Array()

// Funzione principale, da qua si fa il parsing dell'input, prendo i dati da pokeAPI e trova tutte le debolezze della difesa e delle mosse in attacco
async function getPokemonsWeaknesses(){
    if(pokemons[0] != undefined)
        resetVariables()
    getAllPokemonsTextRaw()
    parseRawPokemonInfo()
    fetchInfoAndCalculateWeaknesses()
    await getMovesEffectiveness()
    await buildAllCards()
    drawGraph()
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
        bug: 0, dark: 0, dragon: 0, electric: 0, fairy: 0, fighting: 0, fire: 0, flying: 0, ghost: 0, grass: 0, ground: 0, ice: 0, normal: 0, poison: 0, psychic: 0, rock: 0, steel: 0, water: 0
    };

    // Reset pagina html
    document.getElementById("pokemonCards").innerHTML = "";
    myChart.destroy();
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
        let fetchResult = await fetch("https://pokeapi.co/api/v2/pokemon/" + pkmn.name.toLowerCase())
        // Trasformazione in json del risultato
        let jsonResult = await fetchResult.json()

        // Aggiungo il json del pokemon in pokemonsData
        pokemonsData.push(jsonResult)
        // Aggiungo un nuovo elemento in addPokemonWeakness con il nome di quel pokemon
        addPokemonWeakness(jsonResult.name)
        // Trovo i tipi non efficaci / superefficaci chiamando evaluatePokemonWeakness()
        await evaluatePokemonWeaknesses(jsonResult)
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
        let result = await fetch(currentType.type.url.slice(0, -1))
        // Trasformo la promise di fetch in json
        let json = await result.json()

        // Aggiorno le debolezze del pokemon, modificando i tipi superefficaci, inefficaci, poco efficaci
        updateWeaknesses(pkmn.name, json.damage_relations.double_damage_from, 2)
        updateWeaknesses(pkmn.name, json.damage_relations.no_damage_from, 0)
        updateWeaknesses(pkmn.name, json.damage_relations.half_damage_from, 0.5)
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
    // Cerca un certo pokemon con il nome "name"
    pokemonsDataWeaknesses.forEach((pkmn) => {
        if(pkmn.name == name){
            if(Array.isArray(weaknesses)){
                // Per ogni debolezza passata in "weaknesses"
                weaknesses.forEach((type) => {
                    // Aggiorno il valore di pokemonsDataWeaknesses con il tipo "type.name" moltiplicandolo per "value"
                    pkmn[type.name] *= value
                })
            }
            else{
                pkmn[weaknesses] *= value
            }
        }
    })
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
        console.log(pkmn.name)
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
                }
                console.log(key + " - " + teamWeaknesses[key] + " - " + pkmn[key])
            }
            
        })
    })
}

async function getMovesEffectiveness(){
    // moves contiene i nomi di tutte le mosse di tutti i pokemon
    let moves = getAllMoves()
    // Ciclo che itera per ogni mossa
    for(let i = 0; i < moves.length; i++){
        // Fetch dei dati della mossa da pokeAPI
        let fetchResult = await fetch("https://pokeapi.co/api/v2/move/" + moves[i])
        let jsonResult = await fetchResult.json()

        // Per ogni mossa memorizzo nome, potenza e tipo
        teamMoves.push({
            name: jsonResult.name,
            power: jsonResult.power,
            type: jsonResult.type.name 
        })
    }

    // Per ogni mossa
    for(let i = 0; i < moves.length; i++){
        // Se la potenza della mossa non è 0 (quindi fa danno)
        if(teamMoves[i].power != null){
            // Fetch dei dati del tipo della mossa
            let fResult = await fetch("https://pokeapi.co/api/v2/type/" + teamMoves[i].type)
            let jResult = await fResult.json()

            // Aumento l'efficacia del team nei confronti di un certi tipi
            jResult.damage_relations.double_damage_to.forEach((element) => {
                teamMovesEffectiveness[element.name]++;
            })
            // Diminuisco l'efficacia del team nei confronti di un certi tipi 
            jResult.damage_relations.half_damage_to.forEach((element) => {
                teamMovesEffectiveness[element.name]--;
            })
        }
    }
}

function getAllMoves(){
    let result = Array()
    // Per ogni pokemon memorizzo nell'array result il nome della mossa, tutto in minuscolo e sostituendo gli spazi con trattini (come vuole pokeAPI)
    pokemons.forEach((element) => {
        result.push(element.move1.toLowerCase().replaceAll(" ", "-"))
        result.push(element.move2.toLowerCase().replaceAll(" ", "-"))
        result.push(element.move3.toLowerCase().replaceAll(" ", "-"))
        result.push(element.move4.toLowerCase().replaceAll(" ", "-"))
    })
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