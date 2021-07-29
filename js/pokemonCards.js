function buildNewCard(pkmn, apiData, pkmnWeaknesses){
    // name è il nome del pokemon
    let name = pkmn.name
    // ability è l'abilità del pokemon
    let ability = pkmn.ability
    // item è l'item del pokemon
    let item = pkmn.item
    // typeImages contiene i path delle immagini dei tipi usati dai pokemon
    let typeImages = Array()
    // pkmnImage è lo sprite usato nelle cards
    let pkmnImage;
    let types = Array()

    // Serie di if-else per prendere lo sprite migliore (ordine di precendenza: 1. Dream World, 2. official-artwork, 3. front_default)
    // Prendi sprite dream world
    if(apiData.sprites.other.dream_world.front_default != null){
        pkmnImage = apiData.sprites.other.dream_world.front_default
    }
    // Prendi sprite official-artwork
    else if(apiData.sprites.other["official-artwork"].front_default != null)
        pkmnImage = apiData.sprites.other["official-artwork"].front_default
    // Prendi sprite front_default
    else
        pkmnImage = apiData.sprites.front_default

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
                value: pkmnWeaknesses[key],
                imgLink: "icons/" + key + ".png"
            })
        }
        else if(pkmnWeaknesses[key] < 1 && key != "name"){
            resistences.push({
                type: key,
                value: pkmnWeaknesses[key],
                imgLink: "icons/" + key + ".png"
            })
        }
    })

    // Sort delle weaknesses
    weaknesses.sort((a, b) => {
        return b.value - a.value
    })
    // Sort delle resistences
    resistences.sort((a, b) => {
        return b.value - a.value
    })

    // Costruzione della carta con html
    let card = '' 
    card += '<div class="pokemonCard">'
    card += '<p class="pkmnName">' + name + '</p>'
    card += '<img class="pkmnImage" src="' + pkmnImage + '"><br>'
    card += '<div class="types"> Types: '
    typeImages.forEach((element) => {
        card += '<img class="typeIcon" src="' + element + '">'
    })
    card += '</div>'
    card += '<p> Ability: ' + ability + ' / Item: ' + item + ' </p>'
    card += '<div class="weaknesses">Weak to:<br>'
    weaknesses.forEach((element) => {
        card += '<p><img src="' + element.imgLink + '" class="typeIcon"> x' + element.value + ' </p>'
    })
    card += '</div>'
    card += '<div class="resistences">Resistent to:<br>'
    resistences.forEach((element) => {
        card += '<p><img src="' + element.imgLink + '" class="typeIcon"> x' + element.value + ' </p>'
    })
    card += '</div>'
    card += '</div>'
    card += ''
    card += ''
    card += ''
    card += ''

    $("#pokemonCards").append(card)
    
}
