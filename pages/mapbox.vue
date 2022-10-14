<template>
  <div>
    <div id="map"></div>
    <!-- <div><button @click="getLayer('bunkazai')">表示</button></div> -->
  </div>
</template>

<!-- eslint-disable camelcase -->
<script>
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import mapService from '@/services/maps';

export default {
  name: 'UserPage',
  //   components: {},
  data() {
    return {
      access_token:
        'pk.eyJ1Ijoiay1vbmlzaGkiLCJhIjoiY2w3cXllangwMGEwMjQwazFiZjBhOW11bSJ9.53Q8b_WN97zEviMsm6DmCQ',
      user: '',
      map: {},
      aichi: {},
      bunkazai: {},
      layers: {},
      header: {
        title: 'aiu',
      },
      paintColor: [
        { color: '#a1dab4', active: false },
        { color: '#41b6c4', active: false },
        { color: '#2c7fb8', active: false },
        { color: '#253494', active: false },
        { color: '#fed976', active: false },
        { color: '#feb24c', active: false },
        { color: '#fd8d3c', active: false },
        { color: '#f03b20', active: false },
        { color: '#bd0026', active: false },
      ],
    };
  },
  async mounted() {
    // this.getGeoJsonData()
    await this.getLayersList();
    await this.createMap();
    const language = new MapboxLanguage({
      defaultLanguage: 'ja',
    });
    this.map.addControl(language);
    this.$nuxt.$on('requireHelp', layer => {
      this.addGeoJsonSource(layer);
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('requireHelp');
  },
  methods: {
    async addGeoJsonSource(layer) {
      const stateDataLayer = this.map.getLayer(layer.table_name);
      if (stateDataLayer === undefined) {
        const request = layer.table_name;
        const response = await this.getGeoJsonData(request);
        //   // Add a data source containing GeoJSON data.
        this.map.addSource(layer.table_name, {
          type: 'geojson',
          data: response,
        });
        if (layer.geom_type === 'point') {
          this.paintPointLayer(layer.table_name);
        } else if (layer.geom_type === 'polygon') {
          this.paintPolygonLayer(layer.table_name);
        }
        this.$nuxt.$emit('returnHelp');
      } else {
        this.changeLayerVisibility(layer.table_name);
      }
    },
    createMap() {
      mapboxgl.accessToken = this.access_token;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [137.15057373046875, 35.0918216511155],
        zoom: 10,
      });
      // this.map.on('load', () => {
      //   // Add a data source containing GeoJSON data.
      //   // this.map.addSource('aichi', {
      //   //   type: 'geojson',
      //   //   data: this.aichi,
      //   // })
      //   // Add a new layer to visualize the polygon.
      //   // 色分けの設定
      //   const jinko_1 = ['<', ['get', 'jinko'], 50]
      //   const jinko_2 = [
      //     'all',
      //     ['>=', ['get', 'jinko'], 50],
      //     ['<', ['get', 'jinko'], 100],
      //   ]
      //   const jinko_3 = [
      //     'all',
      //     ['>=', ['get', 'jinko'], 100],
      //     ['<', ['get', 'jinko'], 200],
      //   ]
      //   const jinko_4 = [
      //     'all',
      //     ['>=', ['get', 'jinko'], 200],
      //     ['<', ['get', 'jinko'], 300],
      //   ]
      //   const jinko_5 = [
      //     'all',
      //     ['>=', ['get', 'jinko'], 300],
      //     ['<', ['get', 'jinko'], 400],
      //   ]
      //   const jinko_6 = [
      //     'all',
      //     ['>=', ['get', 'jinko'], 400],
      //     ['<', ['get', 'jinko'], 500],
      //   ]
      //   const jinko_7 = [
      //     'all',
      //     ['>=', ['get', 'jinko'], 500],
      //     ['<', ['get', 'jinko'], 600],
      //   ]
      //   const jinko_8 = [
      //     'all',
      //     ['>=', ['get', 'jinko'], 600],
      //     ['<', ['get', 'jinko'], 700],
      //   ]
      //   const jinko_9 = [
      //     'all',
      //     ['>=', ['get', 'jinko'], 700],
      //     ['<', ['get', 'jinko'], 800],
      //   ]
      //   const jinko_10 = [
      //     'all',
      //     ['>=', ['get', 'jinko'], 800],
      //     ['<', ['get', 'jinko'], 10000],
      //   ]

      //   // // 色の設定
      //   const colors = [
      //     'rgb(215, 25, 28)',
      //     'rgb(232, 91, 58)',
      //     'rgb(249, 158, 89)',
      //     'rgb(254, 201, 128)',
      //     'rgb(255, 237, 170)',
      //     'rgb(237, 247, 201)',
      //     'rgb(199, 230, 219)',
      //     'rgb(157, 207, 228)',
      //     'rgb(100, 165, 205)',
      //     'rgb(44, 123, 182)',
      //   ]
      //   this.map.addLayer({
      //     id: 'aichi',
      //     type: 'fill',
      //     source: 'aichi', // reference the data source
      //     layout: {},
      //     paint: {
      //       'fill-color': [
      //         'case',
      //         jinko_1,
      //         colors[0],
      //         jinko_2,
      //         colors[1],
      //         jinko_3,
      //         colors[2],
      //         jinko_4,
      //         colors[3],
      //         jinko_5,
      //         colors[4],
      //         jinko_6,
      //         colors[5],
      //         jinko_7,
      //         colors[6],
      //         jinko_8,
      //         colors[7],
      //         jinko_9,
      //         colors[8],
      //         jinko_10,
      //         colors[9],
      //         colors[9],
      //       ],
      //       'fill-opacity': 0.5,
      //     },
      //   })
      //   this.map.addSource('bunkazai', {
      //     type: 'geojson',
      //     data: this.bunkazai,
      //   })
      //   this.map.addLayer({
      //     id: 'bunkazai',
      //     type: 'circle',
      //     source: 'bunkazai',
      //     paint: {
      //       'circle-radius': 4,
      //       'circle-stroke-width': 2,
      //       'circle-color': 'red',
      //       'circle-stroke-color': 'white',
      //     },
      //   })
      // })
      // クリックでポップアップを表示する
      // this.map.on('click', 'aichi', (e) => {
      //   // Copy coordinates array.
      //   const coordinates = e.features[0].geometry.coordinates.slice()
      //   const placename = e.features[0].properties.p32_006
      //   // Ensure that if the map is zoomed out such that multiple
      //   // copies of the feature are visible, the popup appears
      //   // over the copy being pointed to.
      //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      //   }
      //   new mapboxgl.Popup()
      //     .setLngLat(coordinates)
      //     .setHTML(placename)
      //     .addTo(this.map)
      // })

      // // Change the cursor to a pointer when the mouse is over the aichi layer.
      // this.map.on('mouseenter', 'aichi', () => {
      //   this.map.getCanvas().style.cursor = 'pointer'
      // })
      // // Change it back to a pointer when it leaves.
      // this.map.on('mouseleave', 'aichi', () => {
      //   this.map.getCanvas().style.cursor = ''
      // })
    },
    async getGeoJsonData(req) {
      const res = await mapService.getGeoJsonData({ name: req });
      // this.$set(this, 'bunkazai', res[0].json_build_object)
      return res[0].json_build_object;
    },
    async getLayersList() {
      const res = await mapService.getLayersList();
      this.$set(this, 'layers', res);
      this.$nuxt.$emit('getLayersList', this.layers);
    },
    paintPointLayer(table) {
      const availableColor = this.paintColor.find(v => v.active === false);
      availableColor.active = !availableColor.active;
      this.map.addLayer({
        id: table,
        type: 'circle',
        source: table,
        layout: {
          visibility: 'visible',
        },
        paint: {
          'circle-radius': 4,
          'circle-stroke-width': 2,
          'circle-color': availableColor.color,
          'circle-stroke-color': 'white',
        },
      });
    },
    paintPolygonLayer(table) {
      const availableColor = this.paintColor.find(v => v.active === false);
      availableColor.active = !availableColor.active;
      this.map.addLayer({
        id: table,
        type: 'fill',
        source: table,
        layout: {
          visibility: 'visible',
        },
        paint: {
          'fill-color': availableColor.color,
        },
      });
    },
    changeLayerVisibility(clickedLayer) {
      const visibility = this.map.getLayoutProperty(clickedLayer, 'visibility');
      if (visibility === 'visible') {
        this.map.setLayoutProperty(clickedLayer, 'visibility', 'none');
      } else {
        this.map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      }
    },
    setDifferentPaintColor(layerId) {
      const layoutType = this.map.getLayoutProperty(layerId, 'type');
      alert(layoutType);
      const usedColor = this.map.getPaintProperty(
        layerId,
        `${layoutType}-color`
      );
      alert(usedColor);
    },
  },
};
</script>

<style>
/* body { margin: 0; padding: 0; } */
/* #map { position: absolute; top: 0; bottom: 0; width: 100%; } */
#map {
  width: 100%;
  height: 90vh;
}
.mapboxgl-popup {
  position: absolute;
  top: 0;
  bottom: 0;
  color: black;
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
}
.mapboxgl-popup-content {
  position: relative;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 2pxrgb (0 0 0/10%);
  padding: 10px 10px 15px;
  pointer-events: auto;
}
</style>
