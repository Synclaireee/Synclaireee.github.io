import { PageHeader, List, message, Button, Modal, Input, Spin } from 'antd'
import pokemonApi from 'api/pokemon'
import React, {useCallback, useEffect, useState} from 'react'
import {capitalizeWords} from 'utils/string'
import styles from './index.module.scss'

function MyPokemon() {

  const [pokemon, setPokemon] = useState([]);
  const [next, setNext] = useState('');
  const [openModal,setOpenModal] = useState(false);
  const [capturePokemon,setCapturePokemon] = useState({});
  const [loading,setLoading] = useState(false);


  const myPokemonList = JSON.parse(localStorage.getItem("MYPOKEMONLIST"));
  const getPokemonList = useCallback(
    async (next) => {
      try {
        setLoading(true);
        let params;
        if(next){
          params = `?${new URL(next).searchParams.toString()}`;
        }

        const res = await pokemonApi.get(params);
        setPokemon((pokemon)=>{return pokemon.concat(res.results)});
        setNext(res.next);
      } catch (e) {
        message.error(e.message)
      }
      setLoading(false);
    },[]
  );
  
  useEffect(() => {
    getPokemonList()
  }, [getPokemonList])
  
  function getId(url){
    return url.split('/').slice(-2)[0];
  }

  function catchPokemon(pokemon){
    let rand = Math.floor(Math.random()*2);
    if(rand){
      let caught = {...pokemon};
      caught.pokemon_id = getId(caught.url);
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

  function checkCaptured(id){
    return myPokemonList.filter((p)=>{
      return p.pokemon_id === id;
    }).length
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
        title="Pokemon List"
      />
      <Spin spinning={loading}>
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
        
        <div className={styles['total-pokemon']}>
          <span>Total Pokemon Caught: {myPokemonList.length} Pokemons</span>
        </div>
        <List
            itemLayout="horizontal"
            dataSource={pokemon}
            bordered
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<a className={styles.list__link} href={`pokemon/details/${getId(item.url)}`}>{capitalizeWords(item.name)}</a>}
                  description={checkCaptured(getId(item.url)) ? <span>Caught: {checkCaptured(getId(item.url))}</span> : <></>}
                />
                <Button onClick={()=>{catchPokemon(item)}}>Catch</Button>
              </List.Item>
            )}
          />
          {
            pokemon.length && next &&
            <Button className={styles.list__button} type="primary" onClick={()=>{getPokemonList(next)}}>More</Button>
          }
        </Spin>
    </div>
  )
}

export default MyPokemon
