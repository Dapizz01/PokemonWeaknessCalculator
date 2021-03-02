function buildNewCard(pkmn, apiData, pkmnWeaknesses){
    let name = pkmn.name
    let ability = pkmn.ability
    let item = pkmn.item
    let typeImages = Array()
    let pkmnImage = apiData.sprites.other.dream_world.front_default
    let types = Array()

    // Lettura dei tipi dentro apiData
    apiData.types.forEach(element => {
        types.push(element.type.name)
    });

    // Creazione percorsi immagini
    types.forEach((element) => {
        typeImages.push("icons/" + element + ".png")
    })

    // Lettura di debolezze e resistenze
    let weaknesses = Array()
    let resistences = Array()

    // Lettura debolezze e resistenze
    Object.keys(pkmnWeaknesses).forEach((key) => {
        if(pkmnWeaknesses[key] > 1 && key != "name"){
            weaknesses.push({
                type: key,
                value: pkmnWeaknesses[key]
            })
        }
        else if(pkmnWeaknesses[key] < 1 && key != "name"){
            resistences.push({
                type: key,
                value: pkmnWeaknesses[key]
            })
        }
    })

    /*weaknesses.sort((a, b) => {
        return b.value - a.value
    })
    resistences.sort((a, b) => {
        return a.value - b.value
    })*/

    let card = '' 
    card += '<div class="pokemonCard">'
    card += '<p>' + name + '</p>'
    card += '<img src="' + pkmnImage + '"><br>'
    card += '<div class="types"> Types: '
    typeImages.forEach((element) => {
        card += '<img src="' + element + '">'
    })
    card += '</div><br>'
    card += '<p> Ability: ' + ability + ' / Item: ' + item + ' </p>'
    card += '<div class="resistences">'
    resistences.forEach((element) => {
        card += '<p> ' + element.type + ' x' + element.value + ' </p>'
    })
    card += '</div>'
    card += '<div class="weaknesses">'
    weaknesses.forEach((element) => {
        card += '<p> ' + element.type + ' x' + element.value + ' </p>'
    })
    card += '</div>'
    card += '</div>'
    card += ''
    card += ''
    card += ''
    card += ''

    $("#pokemonCards").append(card)
    
}