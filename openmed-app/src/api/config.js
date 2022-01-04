import axios from 'axios'

/**
 * Server configuration for the REST APIs
 */
const apiServer = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
})

export { apiServer }
