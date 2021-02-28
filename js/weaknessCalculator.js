var pokemonsData = Array() // Contiene i dati fetchati da pokeAPI di ogni pokemon
var pokemonsDataWeaknesses = Array() // Contiene le debolezze di ogni pokemon
/*
    pokemonDataWeaknesses: {
        name: "",
        "tipo1": 2 // superefficace
        "tipo2": 1 //neutro
        "tipo3": 0.5 // non efficace
        "tipo4": 0 // nessun effetto
    }
*/

// Funzione principale, da qua si fa il parsing dell'input, prendo i dati da pokeAPI e trova tutte le debolezze della difesa
function getPokemonsWeaknesses(){
    getAllPokemonsTextRaw()
    parseRawPokemonInfo()
    getPokemonsAndFindWeaknesses()
}

function getPokemonsAndFindWeaknesses(){
    pokemons.forEach((element) => {
        fetch("https://pokeapi.co/api/v2/pokemon/" + element.name.toLowerCase()).then((data) => {
            data.json().then((data) => {
                // Prendo i dati ottenuti e li metto in pokemonsData
                pokemonsData.push(data)
                // Aggiorno pokemonDataWeaknesses, attraverso addPokemonWeakness()
                addPokemonWeakness(data.name)
                evaluatePokemonWeaknesses(data)
            })
        })
    })
}

function evaluatePokemonWeaknesses(pkmn){
    // Analizzo tutte le debolezze e l'efficacia della tipi di un solo pokemon "pkmn", SOLO IN DIFESA, NON IN ATTACCO
    let types = Array() // Insieme dei tipi di un pokemon
    
    // Prendo tutti i tipi del pokemon
    for(let i = 0; i < pkmn.types.length; i++){
        types.push(pkmn.types[i])
    }

    // Per ogni tipo
    types.forEach((currentType) => {
        // Prendo da pokeAPI tutti le relazioni del tipo considerato con gli altri tipi e aggiorno di conseguenza pokemonDataWeaknesses attraverso updateWeaknesses(...)
        fetch(currentType.type.url).then((data) => {
            data.json().then((result) => {
                let a = updateWeaknesses(pkmn.name, result.damage_relations.double_damage_from, 2)
                a = updateWeaknesses(pkmn.name, result.damage_relations.no_damage_from, 0)
                a = updateWeaknesses(pkmn.name, result.damage_relations.half_damage_from, 0.5)
            })
        })
    })
    // Aggiorno le debolezze tenendo conto delle abilità e degli item
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
    })
}