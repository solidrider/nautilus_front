<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list two-line>
        <v-list-item v-for="(layer, i) in layers" :key="i" router exact>
          <v-list-item-content>
            <v-checkbox
              v-model="check[i]"
              :label="layer.title"
              @click="addGeoJsonSource(layer, i)"
            >
            </v-checkbox>
            <v-switch
              v-model="is_reverse[i]"
              @change="addReverseGeoJsonSource(layer, i, is_reverse[i])"
            />
            <v-list-item-subtitle>
              <v-slider
                v-model="opacity[i]"
                :disabled="!check[i]"
                max="100"
                min="0"
                @change="setLayerOpacity(layer, opacity[i])"
              ></v-slider>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <div>
          <div id="map"></div>
          <!-- <div><button @click="addGeoJsonSource('jinko_clone')">表示</button></div> -->
        </div>
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>N2i&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<!-- eslint-disable camelcase -->
<script>
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import mapService from '@/services/maps';

export default {
  name: 'MapPage',
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
      is_reverse: [],
      opacity: [],
      check: [],
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'nautilus',
      selectedLayers: [],
      selectedLayersTitle: [],
      attributeData: [],
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
  },
  methods: {
    async addGeoJsonSource(layer, i, is_reverse) {
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
          this.paintPointLayer(layer);
        } else if (layer.geom_type === 'polygon') {
          this.paintPolygonLayer(layer, false);
        }
        this.layers[i].isSelected = true;
      } else {
        // 一度取得しているデータは表示・非表示を切り替える
        this.changeLayerVisibility(layer);
        this.layers[i].isSelected = false;
      }
    },
    addReverseGeoJsonSource(layer, i, is_reverse) {
      const stateDataLayer = this.map.getLayer(layer.table_name);
      if (stateDataLayer !== undefined) {
        this.layers[i].isSelected = true;
        this.changeLayerVisibility(layer);
        this.layers[i].isSelected = false;
        this.paintPolygonLayer(layer, is_reverse);
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
      const allLayers = [];
      this.layers.map(e => {
        return allLayers.push(e.table_name, e.table_name + 'reverse');
      });
      this.map.on('click', allLayers, async e => {
        this.selectedLayers = [];
        // eslint-disable-next-line array-callback-return
        this.layers.map(e => {
          if (e.isSelected === true) {
            this.selectedLayers.push(e.table_name);
            this.selectedLayersTitle.push(e.title);
          }
          this.selectedLayers = Array.from(new Set(this.selectedLayers));
          this.selectedLayersTitle = Array.from(
            new Set(this.selectedLayersTitle)
          );
        });
        console.log(this.selectedLayers);
        const res = await mapService.getAttributeData({
          lngLat: e.lngLat,
          layer: this.selectedLayers,
        });
        const description = res.map((e, index) => {
          const description =
            this.selectedLayersTitle[index] + ':' + e.rows[0].value + '<br>';
          return description;
        });
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(description)
          .addTo(this.map);
      });
    },
    async getGeoJsonData(req) {
      const res = await mapService.getGeoJsonData({ name: req });
      return res[0].json_build_object;
    },
    async getLayersList() {
      const res = await mapService.getLayersList();
      res.forEach(e => {
        e.isSelected = false;
      });
      this.$set(this, 'layers', res);
      this.layers.forEach(() => {
        this.is_reverse.push(false);
        this.opacity.push(50);
        this.check.push(false);
      });
    },
    paintPointLayer(layer) {
      // 使用済みカラーはactive=trueとして同じ色を使わないようにする
      const availableColor = this.paintColor.find(v => v.active === false);
      availableColor.active = !availableColor.active;
      this.map.addLayer({
        id: layer.table_name,
        type: 'circle',
        source: layer.table_name,
        layout: {
          visibility: 'visible',
        },
        paint: {
          'circle-radius': 4,
          'circle-stroke-width': 2,
          'circle-color': availableColor.color,
          'circle-stroke-color': 'white',
          'circle-opacity': 1,
        },
      });
    },
    async paintPolygonLayer(layer, i) {
      const is_reverse = i;
      const attribute = await mapService.getAttributeRangeData({
        name: layer.table_name,
        isReverse: is_reverse,
      });
      const max_value = Number(attribute[0].max);
      const min_value = Number(attribute[0].min);
      console.log(min_value);
      const availableColor = this.paintColor.find(v => v.active === false);
      availableColor.active = !availableColor.active;
      this.map.addLayer({
        id: is_reverse ? layer.table_name + 'reverse' : layer.table_name,
        type: 'fill',
        source: layer.table_name,
        layout: {
          visibility: 'visible',
        },
        paint: layer.is_choropleth // 階級区分図の場合はグラデーションをかける
          ? {
              // 塗りつぶす色を指定
              'fill-color': {
                property: is_reverse ? 'reversed_value' : 'value', // 色情報に、geoJsonのpropertiesの'value'の値を参照する
                stops: [
                  [min_value, 'rgba(0, 0, 0, 0)'],
                  [max_value, 'rgba(200,0,0,0.3)'],
                ],
                default: 'rgba(0, 0, 0, 0)', // 'value'がnullなら透明にする
              },
            }
          : {
              'fill-color': availableColor.color,
              'fill-opacity': 1,
            },
      });
      // ポリゴンはアウトラインをつける
      this.map.addLayer({
        id: `${layer.table_name}-outline`,
        type: 'line',
        source: layer.table_name,
        layout: { visibility: 'visible' },
        paint: {
          'line-color': '#000',
          'line-width': 0.1,
        },
      });
    },
    // レイヤーの表示・非表示
    changeLayerVisibility(clickedLayer) {
      const visibility = this.map.getLayoutProperty(
        clickedLayer.table_name,
        'visibility'
      );
      if (visibility === 'visible') {
        this.map.setLayoutProperty(
          clickedLayer.table_name,
          'visibility',
          'none'
        );
        // ポリゴンにはアウトラインもついている
        if (clickedLayer.geom_type === 'polygon') {
          this.map.setLayoutProperty(
            `${clickedLayer.table_name}-outline`,
            'visibility',
            'none'
          );
        }
      } else {
        this.map.setLayoutProperty(
          clickedLayer.table_name,
          'visibility',
          'visible'
        );
        // ポリゴンにはアウトラインもついている
        if (clickedLayer.geom_type === 'polygon') {
          this.map.setLayoutProperty(
            `${clickedLayer.table_name}-outline`,
            'visibility',
            'visible'
          );
        }
      }
    },
    // レイヤーの透明度調整
    setLayerOpacity(layer, value) {
      if (layer.geom_type === 'point') {
        this.map.setPaintProperty(
          layer.table_name,
          'circle-opacity',
          Number(value / 100)
        );
      } else if (layer.geom_type === 'polygon') {
        this.map.setPaintProperty(
          layer.table_name,
          'fill-opacity',
          Number(value / 100)
        );
      }
    },
    test(value) {
      console.log(value);
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
