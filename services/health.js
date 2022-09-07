import httpClient from '@/services/httpClient'

export default {
  getHealth: async () => {
    const res = await httpClient.get(`/health`)
    return res.data
  },
}
