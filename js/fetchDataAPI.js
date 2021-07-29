async function getPokemonFromAPI(name){
    /* $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + name.toLowerCase()
    }).done((data) => {
        return data
    }) */
	 pokedex.getPokemonByName(name.toLowerCase()).then((data) => {
		 data.json().then((data) => {
				result = data
		 })
	 })
    /*fetch("https://pokeapi.co/api/v2/pokemon/" + name.toLowerCase()).then((data) => {
        data.json().then((data) => {
            result = data
        })
    })*/
}
