// Struttura oggetto pokemon: (contenuti in "pokemons")
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
    pokemonTextRaw.forEach((element, index) => {
        pokemons.push({
            "name": getPokemonNameRaw(element, index),
            "item": getPokemonItemRaw(element, index),
            "ability": getPokemonAbilityRaw(element, index),
            "move1": getPokemonMovesRaw(element, 1, index),
            "move2": getPokemonMovesRaw(element, 2, index),
            "move3": getPokemonMovesRaw(element, 3, index),
            "move4": getPokemonMovesRaw(element, 4, index),
            "alternativeForm": false
        })
    });

    pokemons.forEach((element) => {
        checkAlternativeForm(element)
    })
}

function getPokemonNameRaw(pokemonRaw, pkmnIndex){
    let name;

    // Se il pokemon ha un item
    if(pokemonRaw.includes("@")){
        // Prendo il nome del pokemon: prima riga, primo valore separato dallo spazio
        name = pokemonRaw.split(" @")[0]
        name = deletePokemonGender(name)
        name = deleteUselessPokemonName(name)
    }
    // Se il pokemon non ha nessun item
    else{
        // Prendo la prima riga togliendo gli spazi finali
        name = deleteLastSpaces(pokemonRaw)
        name = deletePokemonGender(name)
        name = deleteUselessPokemonName(name)
    }
    
    if(name == ""){
        throw "Empty name of the " + pkmnIndex+1 + " pokemon\n"
    }
        
    return name;
}

function getPokemonItemRaw(pokemonRaw, pkmnIndex){
    // Prima riga, prendo l'oggetto del pokemon che è la sottostringa dopo la @, escluso il primo spazio
    let item = pokemonRaw.split("\n")[0].split("@")[1]
    if(item == null)
        return item
    else{
        item = deleteLastSpaces(item)
        return item.substring(1, item.length)
    }
}

function getPokemonAbilityRaw(pokemonRaw, pkmnIndex){
    // Seconda riga, prendo il nome dopo lo spazio
    let ability = pokemonRaw.split("\n")[1].split(": ")[1]
    ability = deleteLastSpaces(ability)
    if(ability.substring(0, ability.length) == ""){
        throw "Empty ability of the " + pkmnIndex+1 + " pokemon\n"
    }
    return ability.substring(0, ability.length)
}

// Restituisce la mossa n° "index"
function getPokemonMovesRaw(pokemonRaw, index, pkmnIndex){
    // Cerco tutte le mosse di un certo pokemon e le memorizzo in moves, dopo ritorno quella richiesta da "index"
    // index va da 1 a 4
    let rows = pokemonRaw.split("\n")
    let moves = Array()
    for(let i = 0; i < rows.length; i++){
        if(rows[i].substring(0, 1) == "-"){ // Se in quella riga c'è un - davanti, allora è una mossa
            rows[i] = deleteLastSpaces(rows[i])
            moves.push(rows[i].substring(2, rows[i].length))    // 2 per non prendere il "-"
        }
    }
    if(moves[index-1] == ""){
        throw "Empty move n°" + index + " of the " + pkmnIndex+1 + " pokemon\n"
    }
    return moves[index-1]
}

function checkAlternativeForm(pkmn){
    switch(pkmn.name){
        // INDEEDEE (fixato)
        case "Indeedee-F":
            pkmn.name = "Indeedee-female";
            break;
        case "Indeedee":
            pkmn.name = "Indeedee-male";
            break;
        // CALYREX
        case "Calyrex-Ice":
            pkmn.name = "calyrex-ice-rider"
            break;
        case "Calyrex-Shadow":
            pkmn.name = "calyrex-shadow-rider"
            break;
        // Varianti di PIKACHU con il cappello delle regioni
        case "Pikachu-Original":
        case "Pikachu-Hoenn":
        case "Pikachu-Sinnoh":
        case "Pikachu-Unova":
        case "Pikachu-Kalos":
        case "Pikachu-Partner":
            pkmn.name += "-cap"
            break;
        // CASO PARTICOLARE: Kyogre con Blue Orb diventa "Primal-Kyogre", stesso con Groudon
        case "Kyogre":
            if(pkmn.item == "Blue Orb"){
                pkmn.name = "Kyogre-primal"
                alternativeForm = true
            }
            break;
        case "Groudon":
            if(pkmn.item == "Red Orb"){
                pkmn.name = "Groudon-primal"
                alternativeForm = true
            }
            break;
        // WORMADAM: "wormadam" base equivale a "wormadam-plant"
        case "Wormadam":
            pkmn.name = "Wormadam-plant"
            break;
        // GIRATINA: la forma base di giratina su showdown è "giratina", su pokeAPI "giratina-altered"
        case "Giratina":
            pkmn.name = "Giratina-altered"
            break;
        // SHAYMIN: la forma base di shaymin su showdown è "shaymin", su pokeAPI "shaymin-land"
        case "Shaymin":
            pkmn.name = "Shaymin-land"
            break;
        // DARMANITAN: a differenza di showdown, il nome di darmanitan su pokeAPI richiede anche "-standard" nel nome
        case "Darmanitan":
            pkmn.name = "Darmanitan-standard"
            break;
        case "Darmanitan-Galar":
            pkmn.name = "Darmanitan-standard-galar"
            break;
        // SAWSBUCK: su pokeAPI non ci sono tutte le varianti, invece su showdown si, quindi tolgo il nome della variante della stagione (tanto è inutile)
        case "Sawsbuck-Summer":
        case "Sawsbuck-Winter":
        case "Sawsbuck-Autumn":
            pkmn.name = "Sawsbuck"
            break;
        // TORNADUS, LANDORUS e THUNDURUS: la forma base su pokeAPI è "incarnate", "therian" rimane la stessa
        case "Tornadus":
            pkmn.name = "Tornadus-incarnate"
            break;
        case "Landorus":
            pkmn.name = "Landorus-incarnate"
            break;
        case "Thundurus":
            pkmn.name = "Thundurus-incarnate"
            break;
        // KELDEO: la forma base di Keldeo su showdown è "Keldeo", su pokeAPI "Keldeo-ordinary"
        case "Keldeo":
            pkmn.name = "Keldeo-ordinary"
            break;
        // MELOETTA: la forma base di Meloetta su showdown è "Meloetta", su pokeAPI "Meloetta-aria"
        case "Meloetta":
            pkmn.name = "Meloetta-aria"
            break;
        // GENESECT: su showdown se Genesect ha un disco cambia nome, su pokeAPI è sempre "Genesect"
        case "Genesect-Chill":
        case "Genesect-Burn":
        case "Genesect-Douse":
        case "Genesect-Shock":
            pkmn.name = "Genesect"
            break;
        // VIVILLION: sono da fare, ma ce ne sono 30, un parto
        // FLABEBE, FLOETTE, FLORGES: hanno 5 colori, quello di default per showdown è il rosso
        case "Flabébé-Blue":
        case "Flabébé-Orange":
        case "Flabébé-White":
        case "Flabébé-Yellow":
            pkmn.name = "Flabébé"
        case "Floette-Blue":
        case "Floette-Orange":
        case "Floette-White":
        case "Floette-Yellow":
            pkmn.name = "Floette"
        case "Florges-Blue":
        case "Florges-Orange":
        case "Florges-White":
        case "Florges-Yellow":
            pkmn.name = "Florges"
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
            pkmn.name = "Furfrou"
            break;
        // AEGISLASH: su pokeAPI la versione standard di Aegislash è chiamata "Aegislash-shield", su showdown "aegislash"
        case "Aegislash":
            pkmn.name = "Aegislash-shield"
            break;
        // PUMPKABOO - GOURGEIST: su showdown la versione grandezza normale viene chiamata "Pumpkaboo", mentre su pokeAPI "Pumpkaboo-average", le altre versioni sono compatibili
        case "Pumpkaboo":
            pkmn.name = "Pumpkaboo-average"
            break;
        case "Gourgeist":
            pkmn.name = "Gourgeist-average"
        // XERNEAS: su pokeAPI non c'è Xerneas-Neutral, invece su showdown si
        case "Xerneas-Neutral":
            pkmn.name = "Xerneas"
            break;
        // ZYGARDE: su showdown Zygarde 10% è chiamato "Zygarde-10%" su pokeAPI "Zygarde-10"
        case "Zygarde-10%":
            pkmn.name = "Zygarde-10"
            break;
        // ORICORIO: su showdown la variante base e pa'u sono chiamate "Oricorio" e "Oricorio-Pa'u" su pokeAPI invece "oricorio-baile" e "oricorio-pau"
        case "Oricorio":
            pkmn.name = "Oricorio-baile"
            break;
        case "Oricorio-Pa'u":
            pkmn.name = "Oricorio-pau"
            break;
        // LYCANROC: la forma base su showdown è "lycanroc" su pokeAPI "lycanroc-midday"
        case "Lycanroc":
            pkmn.name = "Lycanroc-midday"
            break;
        // WISHIWASHI: su showdown Wishiwashi da solo si chiama "Wishiwashi" su pokeAPI "Wishiwashi-solo"
        case "Wishiwashi":
            pkmn.name = "Wishiwashi-solo"
            break;
        // ARCEUS E SILVALLY: un altro parto
        // MINIOR: su showdown esiste solo una versione meteora, su pokeAPI una per ogni colore, inoltre su showdown il colore base è rosso
        case "Minior-Meteor":
            pkmn.name = "Minior-red-meteor"
            break;
        case "Minior":
            pkmn.name = "Minior-red"
            break;
        // MIMIKYU: pokeAPI e showdown hanno dei nomi leggermente diversi
        case "Mimikyu":
            pkmn.name = "Mimikyu-disguised"
            break;
        case "Mimikyu-Busted-Totem":
            pkmn.name = "Mimikyu-totem-busted"
            break;
        case "Mimikyu-Totem":
            pkmn.name = "Mimikyu-totem-disguised"
            break;
        // NECROZMA: anche qua nomi leggermente diversi
        case "Necrozma-Dawn-Wings":
            pkmn.name = "Necrozma-dawn"
            break;
        case "Necrozma-Dusk-Mane":
            pkmn.name = "Necrozma-dusk"
            break;
        // CRAMORANT: su pokeAPI non ci sono le varianti "gorging" e "gulping"
        case "Cramorant-Gorging":
            pkmn.name = "Cramorant"
            break;
        case "Cramorant-Gulping":
            pkmn.name = "Cramorant"
            break;
        // TOXTRICITY: anche qua nomi un pò diversi
        case "Toxtricity":
            pkmn.name = "Toxtricity-amped"
            break;
        case "Toxtricity-Gmax":
            pkmn.name = "Toxtricity-amped-gmax"
            break;
        // SINISTEA - POLTEAGEIST
        case "Sinistea-Antique":
            pkmn.name = "Sinistea"
            break;
        case "Polteageist-Antique":
            pkmn.name = "Polteageist"
            break;
        // EISCUE: la forma base ha nomi diversi
        case "Eiscue":
            pkmn.name = "Eiscue-ice"
            break;
        // MORPEKO: la versione Hangry non c'è su pokeAPI
        case "Morpeko-Hangry":
            pkmn.name = "Morpeko"
            break;
        // ZACIAN - ZAMAZENTA: le versioni base hanno nomi diversi
        case "Zacian":
            pkmn.name = "Zacian-hero"
            break;
        case "Zamazenta":
            pkmn.name = "Zamazenta-hero"
            break;
        // URSHIFU: la variante single strike ha nomi diversi
        case "Urshifu":
            pkmn.name = "Urshifu-single-strike"
            break;
        case "Urshifu-Gmax":
            pkmn.name = "Urshifu-single-strike-gmax"
            break;
        // ZARUDE: la versione dada non c'è su pokeAPI
        case "Zarude-dada":
            pkmn.name = "Zarude"
            break;
        // I VARI TAPU: hanno lo spazio che separa i due nomi, vanno uniti con il trattino
        case "Tapu Koko":
            pkmn.name = "Tapu-Koko"
            break;
        case "Tapu Fini":
            pkmn.name = "Tapu-Fini"
            break;
        case "Tapu Lele":
            pkmn.name = "Tapu-Lele"
            break;
        case "Tapu Bulu":
            pkmn.name = "Tapu-Bulu"
            break;
        // GASTRODON: gastrodon west viene chiamato solo gastrodon
        case "Gastrodon":
            pkmn.name = "Gastrodon-West"
            break;
        // DEOXYS: deoxys forma normale è chiamato "deoxys-normal"
        case "Deoxys":
            pkmn.name = "Deoxys-normal"
            break;
        // BURMY: forme alternative
        case "Burmy":
            pkmn.alternativeForm = true
            pkmn.name = "Burmy-plant"
            break;
        case "Burmy-Sandy":
            pkmn.alternativeForm = true
            break;
        case "Burmy-Trash":
            pkmn.alternativeForm = true;
            break;
        // WORMADAM: sono pokemon diversi, ma showdown considera la forma plant come base
        case "Wormadam":
            pkmn.name = "Wormadam-plant"
            break;
        // SHELLOS: forme differenti
        case "Shellos-East":
            pkmn.alternativeForm = true;
            break;
        // GASTRODON: stessa cosa di Shellos
        case "Gastrodon-East":
            pkmn.alternativeForm = true;
            break;
        // BASCULIN: ha 2 colori diversi, considerati come pokemon diversi
        case "Basculin":
            pkmn.name = "Basculin-red-striped"
            break;
    }
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

/*
Rayquaza @ White Herb  
Ability: Air Lock  
Level: 50  
EVs: 36 HP / 236 Atk / 4 Def / 12 SpD / 220 Spe  
Jolly Nature  
- Dragon Dance  
- Dragon Ascent  
- Protect  
- Waterfall  

Heatran @ Shuca Berry  
Ability: Flash Fire  
Level: 50  
EVs: 116 HP / 12 Def / 252 SpA / 100 SpD / 28 Spe  
Modest Nature  
IVs: 0 Atk  
- Earth Power  
- Flash Cannon  
- Burning Jealousy  
- Protect  

Jellicent (M) @ Rindo Berry  
Ability: Water Absorb  
Level: 50  
EVs: 252 HP / 60 Def / 196 SpD  
Sassy Nature  
IVs: 0 Atk / 0 Spe  
- Trick Room  
- Water Spout  
- Shadow Ball  
- Strength Sap  

Indeedee-F (F) @ Red Card  
Ability: Psychic Surge  
Level: 50  
EVs: 236 HP / 116 Def / 156 SpA  
Relaxed Nature  
IVs: 0 Atk / 0 Spe  
- Follow Me  
- Expanding Force  
- Protect  
- Mystical Fire  

Regieleki @ Focus Sash  
Ability: Transistor  
Level: 50  
EVs: 236 SpA / 20 SpD / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Electroweb  
- Thunderbolt  
- Volt Switch  
- Protect  

Landorus-Therian (M) @ Choice Scarf  
Ability: Intimidate  
Level: 50  
EVs: 124 HP / 4 Def / 252 SpA / 60 SpD / 68 Spe  
Modest Nature  
- U-turn  
- Rock Slide  
- Earth Power  
- Sludge Bomb  

*/