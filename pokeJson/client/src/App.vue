<template>
<div id="app">
    <pokemon-title></pokemon-title>
    <pokemon-list v-if="!selectedPokemon1 || !selectedPokemon2" :pokemon='pokemon'></pokemon-list>
    <pokemon-detail :selectedPokemon1='selectedPokemon1' :selectedPokemon2='selectedPokemon2' :pokemonDetails1='pokemonDetails1' :pokemonDetails2='pokemonDetails2' :pokemon1Defeated="pokemon1Defeated" :pokemon2Defeated="pokemon2Defeated"></pokemon-detail>
    <battle-result  v-if="pokemonDetails1 && pokemonDetails2" :pokemon1Defeated="pokemon1Defeated" :pokemon2Defeated="pokemon2Defeated"
     :pokemonDetails1="pokemonDetails1" :pokemonDetails2="pokemonDetails2" :pokemonMoves1="pokemonMoves1" :pokemonMoves2="pokemonMoves2"
     :pokemonMoves1Extra="pokemonMoves1Extra" :pokemonMoves2Extra="pokemonMoves2Extra" :pokemonPotions1="pokemonPotions1" :pokemonPotions2="pokemonPotions2"
     :p1turn="p1turn" :p2turn="p2turn"></battle-result>
    <pokemon-chart :chartDataWins='chartDataWins' :chartDataLosses='chartDataLosses' :chartDataPlayed='chartDataPlayed'></pokemon-chart>
</div>
</template>

<script>
import { eventBus } from './main.js';
import PokemonService from './services/PokemonService';
import PokemonList from './components/PokemonList.vue';
import PokemonDetails from './components/PokemonDetails.vue';
import PokemonBattle from './components/PokemonBattle.vue';
import PokemonTitle from './components/PokemonTitle';
import PokemonChart from './components/PokemonChart';

export default {
    name: 'app',
    data (){
        return {
            pokemon: [],
            selectedPokemon1: null,
            selectedPokemon2: null,
            pokemonDetails1: null,
            pokemonDetails2: null,
            p1turn: true,
            p2turn: false,
            winsAndLosses:[],
            chartDataWins:[
                ['Pokemon', 'Wins'],
                
            ],
            chartDataLosses:[
                ['Pokemon', 'Losses'],
            ],
            chartDataPlayed:[
                ['Pokemon', 'Battles'],
                
            ],
            
            pokemonMoves1: [],
            pokemonMoves1Extra: [],
            pokemonMoves2: [],
            pokemonMoves2Extra: [],
            pokemonPotions1: 3,
            pokemonPotions2: 3,
            pokemon1Defeated: false,
            pokemon2Defeated: false,
        };
    },
    mounted(){
        this.fetchPokemon();

        eventBus.$on('pokemon-selected-1', (pokemon) => {
            this.selectedPokemon1 = {name: pokemon.name, url: pokemon.url};
            this.fetchPokemonDetails1();
        }),
        eventBus.$on('pokemon-selected-2', (pokemon) => {
            this.selectedPokemon2 = {name: pokemon.name, url: pokemon.url};
            this.fetchPokemonDetails2();
        }),
        eventBus.$on('pokemon-defeated-1', (defeat) => {
            this.pokemon1Defeated = true
        }),
        eventBus.$on('pokemon-defeated-2', (defeat) => {
            this.pokemon2Defeated = true            
        }),
        eventBus.$on('set-health-p1', (number) => {
            this.pokemonDetails1.stats[0].base_stat -= number
        }),
        eventBus.$on('increase-health-p1', (number) => {
            this.pokemonDetails1.stats[0].base_stat += number
            this.pokemonPotions1 -= 1
        }),         
        eventBus.$on('set-health-p2', (number) => {
            this.pokemonDetails2.stats[0].base_stat -= number
        }),
        eventBus.$on('p1played', (played) => {
            this.p1turn = false
        }),
        eventBus.$on('p2next', (next) => {
            this.p2turn = true
        }),
        eventBus.$on('p2played', (played) => {
            this.p2turn = false
        }),
        eventBus.$on('p1next', (next) => {
            this.p1turn = true
        }),
        eventBus.$on('pokemon-1-win', (payload) => {
            const updatedPokemon1 = {
                name:payload.pokemonDetails1.name 
            };
            PokemonService.updateWins(updatedPokemon1)
            const updatedPokemon2 = {
                name:payload.pokemonDetails2.name,
            };
            PokemonService.updateLosses(updatedPokemon2)
            .then(()=> this.fetchWinsAndLosses())
        });

        eventBus.$on('increase-health-p2', (number) => {
            this.pokemonDetails2.stats[0].base_stat += number
            this.pokemonPotions2 -= 1
        }),
           
        eventBus.$on('pokemon-2-win', (payload) => {
            const updatedPokemon1 = {
                name:payload.pokemonDetails1.name, 
                 
            };
            PokemonService.updateLosses(updatedPokemon1)
            const updatedPokemon2 = {
                name:payload.pokemonDetails2.name,
            };
            PokemonService.updateWins(updatedPokemon2)
            .then(()=> this.fetchWinsAndLosses())
        });
        this.fetchWinsAndLosses();
        eventBus.$on('battle-again', () => {
          this.selectedPokemon1 = null,
          this.selectedPokemon2 = null,
          this.pokemonDetails1 = null,
          this.pokemonDetails2 = null,
          this.pokemon1Defeated = false,
          this.pokemon2Defeated = false,
          this.pokemonPotions1 = 3,
          this.pokemonPotions2 = 3
      });

    },
    computed:{
        
    },
    components: {
        'pokemon-detail': PokemonDetails,
        'pokemon-list': PokemonList,
        'battle-result': PokemonBattle,
        'pokemon-title':PokemonTitle,
        'pokemon-chart': PokemonChart,
    },
    methods: {
        fetchPokemon(){
            PokemonService.getPokemon()
                .then(pokemon => this.pokemon = pokemon.results)
    },
    fetchPokemonDetails1(){
    const pokemonName = this.selectedPokemon1.url
    return fetch(pokemonName).then(res => res.json()).then(data => 
    {this.pokemonDetails1 = data
    this.fetchMovesP1(data.moves[0].move.url)
    this.fetchMovesP1Extra(data.moves[1].move.url)
    })

    },
    fetchPokemonDetails2(){
    const pokemonName = this.selectedPokemon2.url
    return fetch(pokemonName).then(res => res.json()).then(data => 
    {this.pokemonDetails2 = data
    this.fetchMovesP2(data.moves[0].move.url)
    this.fetchMovesP2Extra(data.moves[1].move.url)
    })

    },
    fetchMovesP1(movesURL){
            return fetch(movesURL)
            .then(response => response.json())
            .then(data => this.pokemonMoves1 = data)
    },
    fetchMovesP1Extra(movesURL){
            return fetch(movesURL)
            .then(response => response.json())
            .then(data => this.pokemonMoves1Extra = data)
    },
    fetchMovesP2(movesURL){
            return fetch(movesURL)
            .then(response => response.json())
            .then(data => this.pokemonMoves2 = data)
    },
    fetchMovesP2Extra(movesURL){
            return fetch(movesURL)
            .then(response => response.json())
            .then(data => this.pokemonMoves2Extra = data)
    },
    fetchWinsAndLosses(){
        PokemonService.getWinsAndLosses()
        .then(results => {
            this.winsAndLosses = results
        
            let newWins = results.map(result => {
                return [result.name, result.wins]
            })
            this.chartDataWins = [['pokemon', 'wins'], ...newWins]

            let newLosses = results.map(result => {
                return [result.name, result.losses]
            })
            this.chartDataLosses = [['pokemon', 'losses'], ...newLosses]
            
            let newPlayed = results.map(result => {
                return [result.name, result.played]
            })
            this.chartDataPlayed = [['pokemon', 'played'], ...newPlayed]
        
        })
        
    },
   

    

}
}
</script>

<style>
@font-face {
    font-family: 'Pokemon';
    src: url(fonts/Pokemon.ttf);

}

body{
    padding: 1% 1% 0%;
}

.p{
    font-family: Pokemon;
}

</style>