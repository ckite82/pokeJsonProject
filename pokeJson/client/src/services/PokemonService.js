const apiURL = 'https://pokeapi.co/api/v2/pokemon?limit=100'
const baseURL = 'http://localhost:3000/api/pokemon'

export default {
    getPokemon(){
        return fetch(apiURL)
        .then(res => res.json()) 
    },
    getWinsAndLosses(){
        return fetch(baseURL)
        .then(res => res.json());
    },
    updateWins(updatedPokemon1){
        console.log(updatedPokemon1);
        return fetch(baseURL + '/updatewins',{
            method: 'PUT',
            body: JSON.stringify(updatedPokemon1),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json());
},
    updateLosses(updatedPokemon2){
    console.log(updatedPokemon2);
    return fetch(baseURL + '/updatelosses',{
        method: 'PUT',
        body: JSON.stringify(updatedPokemon2),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json());
}
}