const baseURL = 'https://pokeapi.co/api/v2/pokemon'

export default {
    getPokemon(){
        return fetch(baseURL)
    }
}