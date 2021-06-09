import React from 'react'
import { Layout } from 'antd'
import routes from 'constants/routes'
import Header from 'components/Header'
import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import PokemonList from './pokemon'
import MyPokemon from './mypokemon'
import PokemonDetail from './pokemon/details'


function App() {
  return (
      <Router>
        <Layout style={{ width: '100vw', minHeight:'100vh'}}>
          <Layout.Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
            <Header />
          </Layout.Header>
          <Layout.Content className={'app__content'}>
            <Switch>
              <Route exact path={routes.POKEMON}>
                <PokemonList />
              </Route>
              <Route path={routes.MYPOKEMON}>
                <MyPokemon />
              </Route>
              <Route path={routes.POKEMON_DETAILS}>
                <PokemonDetail />
              </Route>
              <Redirect to = {routes.POKEMON}/>
            </Switch>
          </Layout.Content>
        </Layout>
      </Router>
  )
}

export default App
