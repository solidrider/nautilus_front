import { setClient } from '~/services/httpClient'

export default ({ app, store, $axios, redirect }) => {
console.log(process.env.NODE_ENV)
  const setEnvUrl = () => {
    if (process.env.NODE_ENV === 'production') {
      const PROD_API = ''
      return PROD_API
    }
    if (process.env.NODE_ENV === 'develop') {
      return process.env.DEVELOP_API
    }
  }
  console.log(setEnvUrl())
  $axios.setBaseURL(setEnvUrl())
  setClient(app.$axios)
}
