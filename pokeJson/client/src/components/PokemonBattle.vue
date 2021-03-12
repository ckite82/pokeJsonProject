<template>
  <div class="battle">
      <div class="p1-container">
      <button class="p1stuff" v-if="!pokemon1Defeated && !pokemon2Defeated && p1turn" :p1turn="p1turn" :pokemonDetails1="pokemonDetails1" :pokemonDetails2="pokemonDetails2" 
      v-on:click="attackByFirstPokemon" @click.prevent="playSound('http://soundbible.com/grab.php?id=1773&type=mp3')">
      {{pokemonDetails1.moves[0].move.name}}</button>
      <button class="p1stuff" v-if="!pokemon1Defeated && !pokemon2Defeated && p1turn" :pokemonDetails1="pokemonDetails1" :pokemonDetails2="pokemonDetails2" 
      v-on:click="attackByFirstPokemonExtra" @click.prevent="playSound('http://soundbible.com/grab.php?id=1773&type=mp3')">
      {{pokemonDetails1.moves[1].move.name}}</button>
      <button class="p1stuff" v-if="pokemonPotions1 && !pokemon1Defeated && !pokemon2Defeated && p1turn" 
      :pokemonPotions1="pokemonPotions1" v-on:click="potionByFirstPokemon" 
      @click.prevent="playSound('http://soundbible.com/grab.php?id=1527&type=mp3')">Use a potion ({{pokemonPotions1}})</button>
      <p class="hp">Remaining HP: <b><i>{{pokemonDetails1.stats[0].base_stat}}</i></b></p>
      </div>
      <section class="result-container">
      <div class="result-contents" v-if="pokemon1Defeated || pokemon2Defeated">
        <p v-if="pokemon1Defeated">{{pokemonDetails1.name}} is defeated</p>
        <p v-if="pokemon2Defeated">{{pokemonDetails2.name}} is defeated</p>
        <audio v-if="pokemon1Defeated || pokemon2Defeated" autoplay src="http://soundbible.com/grab.php?id=2103&type=mp3"></audio>  
      </div>
      </section>
      <div class="p2-container">
      <button class="p2stuff" v-if="!pokemon2Defeated && !pokemon1Defeated && p2turn" :pokemonDetails1="pokemonDetails1" :pokemonDetails2="pokemonDetails2" v-on:click="attackBySecondPokemon" @click.prevent="playSound('http://soundbible.com/grab.php?id=1773&type=mp3')">{{pokemonDetails2.moves[0].move.name}}</button>
      <button class="p2stuff" v-if="!pokemon2Defeated && !pokemon1Defeated && p2turn" :pokemonDetails1="pokemonDetails1" :pokemonDetails2="pokemonDetails2" v-on:click="attackBySecondPokemonExtra" @click.prevent="playSound('http://soundbible.com/grab.php?id=1773&type=mp3')">{{pokemonDetails2.moves[1].move.name}}</button>
      <button class="p2stuff" v-if="pokemonPotions2 && !pokemon2Defeated && !pokemon1Defeated && p2turn" :pokemonPotions2="pokemonPotions2" v-on:click="potionBySecondPokemon" @click.prevent="playSound('http://soundbible.com/grab.php?id=1527&type=mp3')">Use a potion ({{pokemonPotions2}})</button>
      <p class="hp">Remaining HP: <b><i>{{pokemonDetails2.stats[0].base_stat}}</i></b></p>
      </div>
  </div>
</template>

<script>

import { eventBus } from '@/main'

export default {
  name: 'battle-result',
  props:['pokemonDetails1', 'pokemonDetails2', 'pokemonMoves1', 'pokemonMoves1Extra','pokemonMoves2', 'pokemonMoves2Extra', 
  'pokemon1Defeated', 'pokemon2Defeated', 'pokemonPotions1', 'pokemonPotions2', 'p1turn', 'p2turn'],
	methods: {
		attackByFirstPokemon(){
        if (this.pokemonDetails2.stats[0].base_stat < this.pokemonMoves1.pp) {
        eventBus.$emit('set-health-p2', this.pokemonDetails2.stats[0].base_stat)
        eventBus.$emit('pokemon-defeated-2', this.pokemonDetails2.isDefeated = true)
        const payload = {'pokemonDetails1':this.pokemonDetails1, 'pokemonDetails2':this.pokemonDetails2}
        eventBus.$emit('pokemon-1-win', payload); 
      }else{
        eventBus.$emit('set-health-p2', this.pokemonMoves1.pp)
        eventBus.$emit('p1played', this.p1turn = false)
        eventBus.$emit('p2next', this.p2turn = true)
      }},
      attackByFirstPokemonExtra(){
        if (this.pokemonDetails2.stats[0].base_stat < this.pokemonMoves1Extra.pp) {
        eventBus.$emit('set-health-p2', this.pokemonDetails2.stats[0].base_stat)
        eventBus.$emit('pokemon-defeated-2', this.pokemonDetails2.isDefeated = true)
        const payload = {'pokemonDetails1':this.pokemonDetails1, 'pokemonDetails2':this.pokemonDetails2}
        eventBus.$emit('pokemon-1-win', payload);
      }else{
        eventBus.$emit('set-health-p2', this.pokemonMoves1Extra.pp)
        eventBus.$emit('p1played', this.p1turn = false)
        eventBus.$emit('p2next', this.p2turn = true)
      }},
      potionByFirstPokemon(){
        eventBus.$emit('increase-health-p1', 15)
        eventBus.$emit('p1played', this.p1turn = false)
        eventBus.$emit('p2next', this.p2turn = true)
      },
    attackBySecondPokemon(){
      if (this.pokemonDetails1.stats[0].base_stat < this.pokemonMoves2.pp) {
        eventBus.$emit('set-health-p1', this.pokemonDetails1.stats[0].base_stat)
        eventBus.$emit('pokemon-defeated-1', this.pokemonDetails1.isDefeated = true)
        const payload = {'pokemonDetails1':this.pokemonDetails1, 'pokemonDetails2':this.pokemonDetails2}
        eventBus.$emit('pokemon-2-win', payload);
      }else{
        eventBus.$emit('set-health-p1', this.pokemonMoves2.pp)
        eventBus.$emit('p2played', this.p2turn = false)
        eventBus.$emit('p1next', this.p1turn = true)
      
      }},
    attackBySecondPokemonExtra(){
      if (this.pokemonDetails1.stats[0].base_stat < this.pokemonMoves2Extra.pp) {
        eventBus.$emit('set-health-p1', this.pokemonDetails1.stats[0].base_stat)
        eventBus.$emit('pokemon-defeated-1', this.pokemonDetails1.isDefeated = true);
        const payload = {'pokemonDetails1':this.pokemonDetails1, 'pokemonDetails2':this.pokemonDetails2}
        eventBus.$emit('pokemon-2-win', payload);
      }else{
        eventBus.$emit('set-health-p1', this.pokemonMoves2Extra.pp)
        eventBus.$emit('p2played', this.p2turn = false)
        eventBus.$emit('p1next', this.p1turn = true)
      
      }},
    potionBySecondPokemon(){
      eventBus.$emit('increase-health-p2', 15)
      eventBus.$emit('p2played', this.p2turn = false)
      eventBus.$emit('p1next', this.p1turn = true)
    },
    playSound (sound) {
      if(sound) {
        let audio = new Audio(sound);
        audio.play();
      }
    }
    
      
  } 
}


</script>

<style>

.battle {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.p1-container > button {
  min-height: 50px;
  width: 190px;
  margin-top: 10px;
  text-justify: center;
  text-align: center;
  font-family: "Fira Sans";
  font-size: 16pt;
  color: white;
  background-color: red;
  border: solid 10px rgb(255, 217, 0);
  border-color: black;
  border-radius: 5px;
}
.p1stuff {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.p2-container > button {
  min-height: 50px;
  width: 190px;
  margin-top: 10px;
  text-justify: center;
  text-align: center;
  font-family: "Fira Sans";
  font-size: 16pt;
  color: white;
  background-color: red;
  border: solid 10px rgb(255, 217, 0);
  border-color: black;
  border-radius: 5px;
}
.p2stuff {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hp {
  border: solid 10px blue;
  border-radius: 5px;
  width: 150px;
  background-color: gold;
  padding: 10px;
  font-family: "Fira sans";
  font-size: 22pt;
  color: black;
}

.result-container {
  display: flex;
  flex-direction: row;
}

.result-contents {
  border: solid 10px rgb(255, 217, 0);
  border-radius: 5px;
  width: 100px;
  height: 140px;
  background-color: rgb(#888);
  padding: 10px;
  justify-content: center;
  font-family: Pokemon;
  background-image: url("https://cdn140.picsart.com/297375860189201.gif?to=min&r=640");
  background-repeat: no-repeat;
  background-size: contain;
  background-position:bottom;
  }
  


</style>