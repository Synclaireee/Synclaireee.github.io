import urljoin from 'url-join'

const BASE = '/'
const POKEMON = urljoin(BASE, '/pokemon')
const POKEMON_DETAILS = urljoin(BASE, '/pokemon/details/:id')
const MYPOKEMON = urljoin(BASE, '/mypokemon')

const routes =  {
  BASE,
  POKEMON,
  POKEMON_DETAILS,
  MYPOKEMON
}

export default routes;