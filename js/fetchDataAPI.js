// DA FIXARE (richiamata in getPokemonsWeaknesses)
async function getPokemonFromAPI(name){
    /* $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + name.toLowerCase()
    }).done((data) => {
        return data
    }) */
    fetch("https://pokeapi.co/api/v2/pokemon/" + name.toLowerCase()).then((data) => {
        data.json().then((data) => {
            result = data
        })
    })
}