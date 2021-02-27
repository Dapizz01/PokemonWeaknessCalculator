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

function getPokemonsWeaknesses(){
    getAllPokemonsTextRaw()
    parseRawPokemonInfo()
    getPokemonsFromPokeAPI()
    // Chiamata per prelevare i dati dei pokemon
    /*pokemons.forEach((element) => {
        fetch("https://pokeapi.co/api/v2/pokemon/" + element.name.toLowerCase()).then((data) => {
            data.json().then((data) => {
                // Prendo i dati ottenuti e li metto in pokemonsData
                pokemonsData.push(data)
                // Aggiorno pokemonDataWeaknesses, attraverso addPokemonWeakness()
                addPokemonWeakness(data.name)
                // evaluateAllPokemonsWeaknesses()
            })
        })
    })*/
    // La funzione qua sotto non viene chiamata, perchè js è asincrono
    evaluateAllPokemonsWeaknesses()
}

function getPokemonsFromPokeAPI(){
    pokemons.forEach((element) => {
        fetch("https://pokeapi.co/api/v2/pokemon/" + element.name.toLowerCase()).then((data) => {
            data.json().then((data) => {
                // Prendo i dati ottenuti e li metto in pokemonsData
                pokemonsData.push(data)
                // Aggiorno pokemonDataWeaknesses, attraverso addPokemonWeakness()
                addPokemonWeakness(data.name)
                // evaluateAllPokemonsWeaknesses()
            })
        })
    })
    console.log("fine fetch")
}

function evaluateAllPokemonsWeaknesses(){
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
                    updateWeaknesses(element.name, result.damage_relations.double_damage_from, 2)
                    updateWeaknesses(element.name, result.damage_relations.no_damage_from, 0)
                    updateWeaknesses(element.name, result.damage_relations.half_damage_from, 0.5)
                })
            })
        })
    })
    updateExceptionWeaknesses()
}

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

function updateExceptionWeaknesses(){
    // Aggiorna le debolezze nel caso il pokemon abbia un certo item o una certa abilita
    pokemons.forEach((pkmn) => {
        let pkmnName = pkmn.name.toLowerCase()
        switch(pkmn.ability){
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
                console.log("LEVITATE")
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

        switch(pkmn.item){
            case "Air Baloon":
                updateWeaknesses(pkmnName, "ground", 0)
                break;
            case "Ring Target":
                // Da fare la funzione che permette di togliere tutti i 0x
                break;
            default:
                break;
        }
    })
}