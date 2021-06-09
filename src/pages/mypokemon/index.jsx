import { PageHeader, List, Button, Modal, message} from 'antd'
import React, { useEffect, useState } from 'react'
import {capitalizeWords} from 'utils/string'
import styles from './index.module.scss'

function PokemonList() {
  
  const [pokemon,setPokemon] = useState([]);
  const [releasedPokemon, setReleasedPokemon] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const myPokemonList = JSON.parse(localStorage.getItem("MYPOKEMONLIST"));
  
  function releasePokemon(){
    let postReleased = [...myPokemonList]
    postReleased = postReleased.filter(pokemon=>{
      return pokemon.id !== releasedPokemon.id;
    })
    localStorage.setItem("MYPOKEMONLIST", JSON.stringify(postReleased))
    setPokemon(JSON.parse(localStorage.getItem("MYPOKEMONLIST")))
    setReleasedPokemon({});
    setModalOpen(false);
    message.success(`Release ${releasedPokemon.id} Success!`);
  }

  function openModal(pokemon){
    setReleasedPokemon(pokemon);
    setModalOpen(true);
  }
  
  useEffect(() => {
    setPokemon(JSON.parse(localStorage.getItem("MYPOKEMONLIST")) || [])
  }, [])

  return (
    <div>
      <PageHeader
        title="My Pokemon List"
      />

      <Modal
          visible={modalOpen}
          title="Release Pokemon"
          handleOk = {()=>{releasePokemon()}}
          handleCancel = {() => {setModalOpen(false)}}
          footer={[
            <Button key="submit" type="danger" onClick={()=>{releasePokemon()}}>
              Delete
            </Button>
          ]}
        >
          <span>Do you really want to release {releasedPokemon.nickname}?</span>
        </Modal>

      <List
          bordered
          itemLayout="horizontal"
          dataSource={pokemon}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<div><span className={styles.list__nickname}>{item.nickname} : </span><span className={styles.list__name}>{capitalizeWords(item.name)}</span></div>}
              />
              <Button type="danger" onClick={()=>{openModal(item)}}>Release</Button>
            </List.Item>
          )}
        />
    </div>
  )
}

export default PokemonList
