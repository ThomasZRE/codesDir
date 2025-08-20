import axios from 'axios'
const baseUrl = '/api/codes/latest'


const getLatest = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

export default { getLatest }
