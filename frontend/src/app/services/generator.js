import axios from 'axios'
const baseUrl = '/api/generator'

const add = async (requestObject) => {
    const response = await axios.post(baseUrl, requestObject)
    return response.data
}

export default {add}