import urljoin from 'url-join'
import {DEFAULT_HEADERS, SERVER_BASE_URL } from './constants'

async function baseFetch(config, data=undefined){
    const { headers = {}, endpoint } = config
    try {
      const res = await window.fetch(urljoin(SERVER_BASE_URL, endpoint), {
        headers: {
          ...DEFAULT_HEADERS,
          ...headers,
        },
        body: typeof data === 'object' ? JSON.stringify(data) : undefined,
        ...config,
      })
  
      const body = await res.json()
  
      if (res.status === 200) {
        const payload = body
        return payload
      }
  
      throw new Error((body).message)
    } catch (e) {
      throw new Error(e.message)
    }
  }
  
  export default baseFetch