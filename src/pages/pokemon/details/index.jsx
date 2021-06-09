import { PageHeader, message, Descriptions, Tag, Modal, Button, Input } from 'antd'
import pokemonApi from 'api/pokemon'
import React, { useEffect, useState} from 'react'
import { useParams, useHistory } from 'react-router-dom'
import {capitalizeWords, removeHyphenAndCapitalize} from 'utils/string'
import styles from './index.module.scss'

function PokemonDetail() {

  const [pokemon, setPokemon] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [openModal,setOpenModal] = useState(false);
  const [capturePokemon,setCapturePokemon] = useState({});
  const { id } = useParams();
  let history = useHistory();
  const myPokemonList = JSON.parse(localStorage.getItem("MYPOKEMONLIST"));
  
  useEffect(() => {
    async function getPokemonDetails(){
      if(!id) return;
      try {
        const res = await pokemonApi.getDetail(id);
        // console.log(res);
        setPokemon(res);
        setLoaded(true);
      } catch (e) {
        message.error(e.message)
      }
    }
    getPokemonDetails();
  },[id]);

  function catchPokemon(){
    let rand = Math.floor(Math.random()*2);
    if(rand){
      let caught = {...pokemon};
      caught.pokemon_id = id;
      setCapturePokemon(caught);
      setOpenModal(true);
    }
    else{
      message.error(`Failed to catch ${capitalizeWords(pokemon.name)}`)
      return;
    }
  }
  function handleChangeNickname({ target: { value } }){
    let saved = {...capturePokemon}
    saved.nickname = value
    setCapturePokemon(saved);
  }
  function handleOk(){
    if(!validateNickname(capturePokemon.nickname)){
      if(capturePokemon.nickname){
        message.error('Nickname has been used!')
      }
      else{
        message.error('Please insert nickname!')
      }
      return
    }
    else{
      if(!myPokemonList || myPokemonList.length === 0){
        let saved = {...capturePokemon}
        saved.id = 1
        localStorage.setItem("MYPOKEMONLIST",JSON.stringify([saved]));
      }
      else{
        let saved = {...capturePokemon}
        saved.id = myPokemonList.slice(-1)[0].id + 1
        myPokemonList.push(saved)
        localStorage.setItem("MYPOKEMONLIST",JSON.stringify(myPokemonList))
      }
      
      // console.log(myPokemonList);
      setOpenModal(false);
      setCapturePokemon({});
      message.success(`Success to catch ${capitalizeWords(capturePokemon.nickname)}`)
    }
  }

  function validateNickname(name){
    let flag = true;
    if(!name){
      flag = false;
    }
    else if(myPokemonList){
      myPokemonList.forEach((pokemon)=>{
        if(pokemon.nickname === name){
          flag = false;
        }
      })
    }
    return flag;
  }


  return (
    <div>
      <PageHeader
        onBack={() => {history.push('/pokemon')}}
        title="Pokemon Details"
      />  
      <Modal
        title={`You have caught ${capitalizeWords(capturePokemon.name)}!`}
        visible={openModal}
        onOk={handleOk}
        closable={false}
        footer={[<Button disabled={!validateNickname(capturePokemon.nickname)} key="submit" type="primary" onClick={handleOk}>Submit</Button>]}
        >
          <div className={styles.modal__content}>
            <span>Congratulations!</span>
            <span>You have successfully caught {capitalizeWords(capturePokemon.name)}!</span>
            <span>Please give her a nickname!</span>
            <Input value={capturePokemon.nickname} onChange={handleChangeNickname} placeholder={`My ${capitalizeWords(capturePokemon.name)}`}></Input>
          </div>
      </Modal>
      {
        loaded &&
        <div>
          <Descriptions
            title={capitalizeWords(pokemon.name)}
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
            >
            <Descriptions.Item span={2} label="Official Artwork">
              <img className={styles.description__image} alt="official-artwork" src={pokemon.sprites.other['official-artwork'].front_default}/>
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Sprites">
              <img alt="front_default" src={pokemon.sprites.front_default}/>
              <img alt="front_default" src={pokemon.sprites.front_shiny}/>
              <img alt="front_default" src={pokemon.sprites.back_default}/>
              <img alt="front_default" src={pokemon.sprites.back_shiny}/>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {
                pokemon.types.map((type)=>{
                  return (
                    <Tag className={styles.description__type} key={type.type.name}>{capitalizeWords(type.type.name)}</Tag>
                  )
                })
              }
            </Descriptions.Item>
            <Descriptions.Item label="Height/Weight">
              <span>Height: {pokemon.height/10}m Weight: {pokemon.weight/10}kg</span>
            </Descriptions.Item>
            <Descriptions.Item label="Ability">
              {
                pokemon.abilities.map((ability)=>{
                  return (
                    <Tag className={styles.description__ability} key={ability.ability.name}>{capitalizeWords(ability.ability.name)}</Tag>
                  )
                })
              }
            </Descriptions.Item>
            <Descriptions.Item label="Base Experience Yield">
              <span> {pokemon.base_experience}</span>
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Base Stat">
              {
                pokemon.stats.map((stat)=>{
                  return (
                    <Tag className={styles.description__stats} key={stat.stat.name}>{removeHyphenAndCapitalize(stat.stat.name)} : {stat.base_stat}</Tag>
                  )
                })
              }
            </Descriptions.Item>
            <Descriptions.Item span={2} label="EV Yield">
              {
                pokemon.stats.map((stat)=>{
                  return (
                    <Tag className={styles.description__stats} key={stat.stat.name + '_effort'}>{removeHyphenAndCapitalize(stat.stat.name)} : {stat.effort}</Tag>
                  )
                })
              }
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Moveset">
              {
                pokemon.moves.map((move)=>{
                  return (
                    <Tag className={styles.description__moves} key={move.move.name}>{removeHyphenAndCapitalize(move.move.name)}</Tag>
                  )
                })
              }
            </Descriptions.Item>
          </Descriptions>
          <Button className={styles.description__button} onClick={()=>{catchPokemon()}} type="primary">Capture</Button>
        </div>
      }
    </div>
  )
}

export default PokemonDetail
