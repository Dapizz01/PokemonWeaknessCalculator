// Struttura oggetto pokemon:
// "name" : nome del pokemon
// "item": strumento del pokemon
// "ability" : abilità del pokemon
// "move1": mossa 1
// "move2": mossa 2
// "move3": mossa 3
// "move4": mossa 4

let pokemons = Array()
let pokemonTextRaw = Array() // Contiene tutti i pokemon così come sono inseriti nel textarea

function getAllPokemonsTextRaw(){
    let allPokemons = document.getElementById("pokeTeamText").value.split("\n\n");
    allPokemons.forEach(element => {
        if(element != "")
            pokemonTextRaw.push(element)
    });
}

function parseRawPokemonInfo(){
    // Per ogni pokemon memorizzato in pokemonTextRaw, trovo ogni valore importante e lo memorizzo come oggetto in pokemons
    pokemonTextRaw.forEach(element => {
        pokemons.push({
            "name": getPokemonNameRaw(element),
            "item": getPokemonItemRaw(element),
            "ability": getPokemonAbilityRaw(element),
            "move1": getPokemonMovesRaw(element, 1),
            "move2": getPokemonMovesRaw(element, 2),
            "move3": getPokemonMovesRaw(element, 3),
            "move4": getPokemonMovesRaw(element, 4)
        })
    });
}

function getPokemonNameRaw(pokemonRaw){
    let name

    // Se il pokemon ha un item
    if(pokemonRaw.includes("@")){
        // Prendo il nome del pokemon: prima riga, primo valore separato dallo spazio
        name = pokemonRaw.split(" @")[0]
        name = checkPokemonNameExceptions(name)
    }
    // Se il pokemon non ha nessun item
    else{
        // Prendo la prima riga togliendo i 2 spazi finali
        name = pokemonRaw.split("  ")[0]
        name = checkPokemonNameExceptions(name)
    }
    
    return name;
}

function getPokemonItemRaw(pokemonRaw){
    // Prima riga, prendo l'oggetto del pokemon che è la sottostringa dopo la @, escluso il primo spazio
    let item = pokemonRaw.split("\n")[0].split("@")[1]
    if(item == null)
        return item
    else{
        item = deleteLastSpaces(item)
        return item.substring(1, item.length)
    }
}

function getPokemonAbilityRaw(pokemonRaw){
    // Seconda riga, prendo il nome dopo lo spazio
    console.log(pokemonRaw)
    let ability = pokemonRaw.split("\n")[1].split(": ")[1]
    ability = deleteLastSpaces(ability)
    return ability.substring(0, ability.length)
}

function getPokemonMovesRaw(pokemonRaw, index){
    // Cerco tutte le mosse di un certo pokemon e le memorizzo in moves, dopo ritorno quella richiesta da "index"
    // index va da 1 a 4
    let rows = pokemonRaw.split("\n")
    let moves = Array()
    rows.forEach((element) => {
        if(element.substring(0, 1) == "-"){
            element = deleteLastSpaces(element)
            moves.push(element.substring(2, element.length))    // 2 per non prendere il "-"
        }
    })
    return moves[index-1]
}

function checkPokemonNameExceptions(pkmnName){
    
    pkmnName = deletePokemonGender(pkmnName)
    pkmnName = deleteUselessPokemonName(pkmnName)

    switch(pkmnName){
        // INDEEDEE (fixato)
        case "Indeedee-F":
            pkmnName = "Indeedee-female";
            break;
        case "Indeedee":
            pkmnName = "Indeedee-male";
            break;
        // CALYREX
        case "Calyrex-Ice":
            pkmnName = "calyrex-ice-rider"
        case "Calyrex-Shadow":
            pkmnName = "calyrex-shadow-rider"
            break;
        // Varianti di PIKACHU con il cappello delle regioni
        case "Pikachu-Original":
        case "Pikachu-Hoenn":
        case "Pikachu-Sinnoh":
        case "Pikachu-Unova":
        case "Pikachu-Kalos":
        case "Pikachu-Partner":
            pkmnName += "-cap"
            break;
        // CASO PARTICOLARE: Kyogre con Blue Orb diventa "Primal-Kyogre", stesso con Groudon

        // WORMADAM: "wormadam" base equivale a "wormadam-plant"
        case "Wormadam":
            pkmnName = "Wormadam-plant"
            break;
        // GIRATINA: la forma base di giratina su showdown è "giratina", su pokeAPI "giratina-altered"
        case "Giratina":
            pkmnName = "Giratina-altered"
            break;
        // SHAYMIN: la forma base di shaymin su showdown è "shaymin", su pokeAPI "shaymin-land"
        case "Shaymin":
            pkmnName = "Shaymin-land"
            break;
        // DARMANITAN: a differenza di showdown, il nome di darmanitan su pokeAPI richiede anche "-standard" nel nome
        case "Darmanitan":
            pkmnName = "Darmanitan-standard"
            break;
        case "Darmanitan-Galar":
            pkmnName = "Darmanitan-standard-galar"
            break;
        // SAWSBUCK: su pokeAPI non ci sono tutte le varianti, invece su showdown si, quindi tolgo il nome della variante della stagione (tanto è inutile)
        case "Sawsbuck-Summer":
        case "Sawsbuck-Winter":
        case "Sawsbuck-Autumn":
            pkmnName = "Sawsbuck"
            break;
        // TORNADUS, LANDORUS e THUNDURUS: la forma base su pokeAPI è "incarnate", "therian" rimane la stessa
        case "Tornadus":
            pkmnName = "Tornadus-incarnate"
            break;
        case "Landorus":
            pkmnName = "Landorus-incarnate"
            break;
        case "Thundurus":
            pkmnName = "Thundurus-incarnate"
            break;
        // KELDEO: la forma base di Keldeo su showdown è "Keldeo", su pokeAPI "Keldeo-ordinary"
        case "Keldeo":
            pkmnName = "Keldeo-ordinary"
            break;
        // MELOETTA: la forma base di Meloetta su showdown è "Meloetta", su pokeAPI "Meloetta-aria"
        case "Meloetta":
            pkmnName = "Meloetta-aria"
            break;
        // GENESECT: su showdown se Genesect ha un disco cambia nome, su pokeAPI è sempre "Genesect"
        case "Genesect-Chill":
        case "Genesect-Burn":
        case "Genesect-Douse":
        case "Genesect-Shock":
            pkmnName = "Genesect"
            break;
        // VIVILLION: sono da fare, ma ce ne sono 30, un parto
        // FLABEBE, FLOETTE, FLORGES: hanno 5 colori, quello di default per showdown è il rosso
        case "Flabébé-Blue":
        case "Flabébé-Orange":
        case "Flabébé-White":
        case "Flabébé-Yellow":
            pkmnName = "Flabébé"
        case "Floette-Blue":
        case "Floette-Orange":
        case "Floette-White":
        case "Floette-Yellow":
            pkmnName = "Floette"
        case "Florges-Blue":
        case "Florges-Orange":
        case "Florges-White":
        case "Florges-Yellow":
            pkmnName = "Florges"
        // FURFROU: ha 10 varianti, ma pokeAPI accetta solo quella standard (quella bianca)
        case "Furfrou-Dandy":
        case "Furfrou-Debutante":
        case "Furfrou-Diamond":
        case "Furfrou-Heart":
        case "Furfrou-Kabuki":
        case "Furfrou-La Reine":
        case "Furfrou-Matron":
        case "Furfrou-Pharaoh":
        case "Furfrou-Star":
            pkmnName = "Furfrou"
            break;
        // AEGISLASH: su pokeAPI la versione standard di Aegislash è chiamata "Aegislash-shield", su showdown "aegislash"
        case "Aegislash":
            pkmnName = "Aegislash-shield"
            break;
        // PUMPKABOO - GOURGEIST: su showdown la versione grandezza normale viene chiamata "Pumpkaboo", mentre su pokeAPI "Pumpkaboo-average", le altre versioni sono compatibili
        case "Pumpkaboo":
            pkmnName = "Pumpkaboo-average"
            break;
        case "Gourgeist":
            pkmnName = "Gourgeist-average"
        // XERNEAS: su pokeAPI non c'è Xerneas-Neutral, invece su showdown si
        case "Xerneas-Neutral":
            pkmnName = "Xerneas"
            break;
        // ZYGARDE: su showdown Zygarde 10% è chiamato "Zygarde-10%" su pokeAPI "Zygarde-10"
        case "Zygarde-10%":
            pkmnName = "Zygarde-10"
            break;
        // ORICORIO: su showdown la variante base e pa'u sono chiamate "Oricorio" e "Oricorio-Pa'u" su pokeAPI invece "oricorio-baile" e "oricorio-pau"
        case "Oricorio":
            pkmnName = "Oricorio-baile"
            break;
        case "Oricorio-Pa'u":
            pkmnName = "Oricorio-pau"
            break;
        // LYCANROC: la forma base su showdown è "lycanroc" su pokeAPI "lycanroc-midday"
        case "Lycanroc":
            pkmnName = "Lycanroc-midday"
            break;
        // WISHIWASHI: su showdown Wishiwashi da solo si chiama "Wishiwashi" su pokeAPI "Wishiwashi-solo"
        case "Wishiwashi":
            pkmnName = "Wishiwashi-solo"
            break;
        // ARCEUS E SILVALLY: un altro parto
        // MINIOR: su showdown esiste solo una versione meteora, su pokeAPI una per ogni colore, inoltre su showdown il colore base è rosso
        case "Minior-Meteor":
            pkmnName = "Minior-red-meteor"
            break;
        case "Minior":
            pkmnName = "Minior-red"
            break;
        // MIMIKYU: pokeAPI e showdown hanno dei nomi leggermente diversi
        case "Mimikyu":
            pkmnName = "Mimikyu-disguised"
            break;
        case "Mimikyu-Busted-Totem":
            pkmnName = "Mimikyu-totem-busted"
            break;
        case "Mimikyu-Totem":
            pkmnName = "Mimikyu-totem-disguised"
            break;
        // NECROZMA: anche qua nomi leggermente diversi
        case "Necrozma-Dawn-Wings":
            pkmnName = "Necrozma-dawn"
            break;
        case "Necrozma-Dusk-Mane":
            pkmnName = "Necrozma-dusk"
            break;
        // CRAMORANT: su pokeAPI non ci sono le varianti "gorging" e "gulping"
        case "Cramorant-Gorging":
            pkmnName = "Cramorant"
            break;
        case "Cramorant-Gulping":
            pkmnName = "Cramorant"
            break;
        // TOXTRICITY: anche qua nomi un pò diversi
        case "Toxtricity":
            pkmnName = "Toxtricity-amped"
            break;
        case "Toxtricity-Gmax":
            pkmnName = "Toxtricity-amped-gmax"
            break;
        // SINISTEA - POLTEAGEIST
        case "Sinistea-Antique":
            pkmnName = "Sinistea"
            break;
        case "Polteageist-Antique":
            pkmnName = "Polteageist"
            break;
        // EISCUE: la forma base ha nomi diversi
        case "Eiscue":
            pkmnName = "Eiscue-ice"
            break;
        // MORPEKO: la versione Hangry non c'è su pokeAPI
        case "Morpeko-Hangry":
            pkmnName = "Morpeko"
            break;
        // ZACIAN - ZAMAZENTA: le versioni base hanno nomi diversi
        case "Zacian":
            pkmnName = "Zacian-hero"
            break;
        case "Zamazenta":
            pkmnName = "Zamazenta-hero"
            break;
        // URSHIFU: la variante single strike ha nomi diversi
        case "Urshifu":
            pkmnName = "Urshifu-single-strike"
            break;
        case "Urshifu-Gmax":
            pkmnName = "Urshifu-single-strike-gmax"
            break;
        // ZARUDE: la versione dada non c'è su pokeAPI
        case "Zarude-dada":
            pkmnName = "Zarude"
            break;
        // I VARI TAPU: hanno lo spazio che separa i due nomi, vanno uniti con il trattino
        case "Tapu Koko":
            pkmnName = "Tapu-Koko"
            break;
        case "Tapu Fini":
            pkmnName = "Tapu-Fini"
            break;
        case "Tapu Lele":
            pkmnName = "Tapu-Lele"
            break;
        case "Tapu Bulu":
            pkmnName = "Tapu-Bulu"
            break;
    }
    return pkmnName
}

function deletePokemonGender(pkmnName){
    if(pkmnName.includes("(M)") || pkmnName.includes("(F)"))
        return pkmnName.substring(0, pkmnName.length-4)
    else
        return pkmnName
}

function deleteUselessPokemonName(pkmnName){
    if(pkmnName.includes("(")){
        pkmnName = pkmnName.substring(pkmnName.indexOf("(")+1, pkmnName.indexOf(")"))
    }
    return pkmnName;
}

function deleteLastSpaces(element){
    while( element[element.length-1] == " " )
        element = element.substring(0, element.length-1)
    return element
}
/* ESEMPIO:
Palkia @ Life Orb  
Ability: Telepathy  
Level: 50  
EVs: 4 HP / 252 SpA / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Spacial Rend  
- Thunder  
- Hydro Pump  
- Fire Blast  

Landorus-Therian (M) @ Assault Vest  
Ability: Intimidate  
Level: 50  
EVs: 92 HP / 68 Atk / 92 SpD / 252 Spe  
Jolly Nature  
- Earthquake  
- U-turn  
- Fly  
- Rock Slide  

Whimsicott @ Focus Sash  
Ability: Prankster  
Level: 50  
EVs: 4 HP / 252 SpA / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Tailwind  
- Helping Hand  
- Dazzling Gleam  
- Protect  

Rotom-Heat @ Safety Goggles  
Ability: Levitate  
Level: 50  
EVs: 252 HP / 188 SpA / 68 Spe  
Timid Nature  
IVs: 0 Atk  
- Thunderbolt  
- Overheat  
- Protect  
- Nasty Plot  

Indeedee (M) @ Odd Incense  
Ability: Psychic Surge  
Level: 50  
EVs: 4 HP / 252 SpA / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Trick Room  
- Imprison  
- Expanding Force  
- Protect  

Registeel @ Leftovers  
Ability: Clear Body  
Level: 50  
EVs: 156 HP / 4 Atk / 252 Def / 4 SpD / 92 Spe  
Serious Nature  
- Iron Defense  
- Body Press  
- Iron Head  
- Protect  

*/

// ANCORA DA FARE COME ECCEZIONI: SILVALLY, ARCEUS, VIVILLON e ALCREAMIE
