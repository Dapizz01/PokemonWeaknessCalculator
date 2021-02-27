var pokemonsData = Array()
var pokemonsDataWeaknesses = Array()
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
    
    // Chiamata per prelevare i dati dei pokemon
    pokemons.forEach((element) => {
        fetch("https://pokeapi.co/api/v2/pokemon/" + element.name.toLowerCase()).then((data) => {
            data.json().then((data) => {
                pokemonsData.push(data)
                addPokemonWeakness(data.name)
            })
        })
    })
    // La funzione qua sotto non viene chiamata, perchè js è asincrono
    evaluateAllPokemonsWeaknesses()
}

function evaluateAllPokemonsWeaknesses(){
    pokemonsData.forEach((element) => {
        let types = Array() // Insieme dei tipi di un pokemon
        
        for(let i = 0; i < element.types.length; i++){
            types.push(element.types[i])
        }

        types.forEach((currentType) => {
            fetch(currentType.type.url).then((data) => {
                data.json().then((result) => {
                    updateX2Weaknesses(element.name, result.damage_relations.double_damage_from)
                    updateX0Weaknesses(element.name, result.damage_relations.no_damage_from)
                    updateX0_5Weaknesses(element.name, result.damage_relations.half_damage_from)
                })
            })
        })
    })
}

function updateX2Weaknesses(name, weaknesses){
    pokemonsDataWeaknesses.forEach((pkmn) => {
        if(pkmn.name == name){
            weaknesses.forEach((type) => {
                pkmn[type.name] *= 2
            })
        }
    })
}

function updateX0Weaknesses(name, weaknesses){
    pokemonsDataWeaknesses.forEach((pkmn) => {
        if(pkmn.name == name){
            weaknesses.forEach((type) => {
                pkmn[type.name] = 0
            })
        }
    })
}

function updateX0_5Weaknesses(name, weaknesses){
    pokemonsDataWeaknesses.forEach((pkmn) => {
        if(pkmn.name == name){
            weaknesses.forEach((type) => {
                pkmn[type.name] *= 0.5
            })
        }
    })
}

function addPokemonWeakness(name){
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