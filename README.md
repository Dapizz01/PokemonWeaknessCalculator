# PokemonWeaknessCalculator
## What does it do?
Given a string containing all the pokemon details (with the Pokemon Showdown format), the web page will show the details of the inserted pokemon team and will draw 2 graphs. One graph shows the defensive capabilities of the team, in particular the overall weakness of the team related to a certain type and the number of immune pokemon to that type. The other one shows the offensive capabilities, in the same way of the defensive one.
## How to use
1. Paste in the text area the team text. The format must be the Showdown one.
2. Click the button and wait.
Here's the link: https://dapizz01.github.io/PokemonWeaknessCalculator/
## It's kind of slow
It's a known issue, this website makes a lot of requests to [PokeAPI](https://github.com/PokeAPI/pokeapi) (around 30) and it takes some time to respond (from 1 ms to 500 ms). It's already implemented a cache system called [PokeAPI Wrapper JS]https://github.com/PokeAPI/pokeapi-js-wrapper).
## What does the graphs represent?
The defensive one (the first one) shows the defensive weakness of the team to a certain type and the number of pokemons that have immunity to that type. On the X axis there are the types, and every type contains 2 column: the one on the left is for the weakness, the one on the right is for the immunities.
The offensive one (the second one) is basically the same of the defensive one, but applied to the effectiveness of the moves.
In both graphs, if the mouse is hovering a column it shows all the data relative to that type.
