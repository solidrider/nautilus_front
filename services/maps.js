import httpClient from '@/services/httpClient';

export default {
  getGeoJsonData: async req => {
    const res = await httpClient.post(`/maps`, req);
    return res.data;
  },
  getLayersList: async () => {
    const res = await httpClient.get(`/maps/layers`);
    return res.data;
  },
};
