import fetch from './commons'

function get(params = ''){
    return fetch({
      endpoint: `/pokemon${params}`,
      method: 'GET',
    })
  }

function getDetail(id){
  return fetch({
    endpoint: `/pokemon/${id}`,
    method:'GET'
  })
}

const functions={
    get,
    getDetail
}
export default functions