import httpClient from '@/services/httpClient';

export default {
  getGeoJsonData: async req => {
    const res = await httpClient.post(`/maps`, req);
    return res.data;
  },
  getAttributeData: async req => {
    const res = await httpClient.post(`/maps/attribute`, req);
    return res.data;
  },
  getAttributeRangeData: async req => {
    const res = await httpClient.post(`/maps/attribute_range`, req);
    return res.data;
  },
  getLayersList: async () => {
    const res = await httpClient.get(`/maps/layers`);
    return res.data;
  },
};
