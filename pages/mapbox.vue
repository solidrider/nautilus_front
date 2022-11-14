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
          <div class="map-overlay bottom">
            <v-card v-show="isRanking">
              <v-container fluid>
                <v-row align="center">
                  <v-col cols="12">
                    <v-select
                      :items="items"
                      label="レイヤー名"
                      @change="selectTableData"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>
              <v-spacer></v-spacer>
              <v-data-table
                v-show="isTable"
                :headers="headers"
                :items="selectedPropertyData"
                :items-per-page="5"
                :sort-by="['rank']"
                class="elevation-1"
              ></v-data-table>
              <v-data-table
                v-show="isTotalTable"
                :headers="totalHeaders"
                :items="totalRankingData"
                :items-per-page="5"
                :sort-by="['rank']"
                class="elevation-1"
              ></v-data-table>
            </v-card>
            <v-btn v-show="isRankingBtn" @click="showRanking()"
              >ランキング表示</v-btn
            >
            <v-btn v-show="!isRankingBtn" @click="hideRanking()"
              >ランキング非表示</v-btn
            >
          </div>
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
      isTable: false,
      isTotalTable: false,
      isRanking: false,
      isRankingBtn: true,
      items: [],
      headers: [
        {
          text: '都道府県',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: '順位', value: 'rank' },
        { text: '値', value: 'value' },
      ],
      totalHeaders: [
        {
          text: '都道府県',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: '平均順位', value: 'rank' },
      ],
      access_token: this.$config.TOKEN,
      user: '',
      map: {},
      aichi: {},
      bunkazai: {},
      layers: {},
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
      propertyData: {},
      selectedPropertyData: [],
      totalRankingData: [
        { name: '北海道', rank: 0 },
        { name: '青森県', rank: 0 },
        { name: '岩手県', rank: 0 },
        { name: '宮城県', rank: 0 },
        { name: '秋田県', rank: 0 },
        { name: '山形県', rank: 0 },
        { name: '福島県', rank: 0 },
        { name: '茨城県', rank: 0 },
        { name: '栃木県', rank: 0 },
        { name: '群馬県', rank: 0 },
        { name: '埼玉県', rank: 0 },
        { name: '千葉県', rank: 0 },
        { name: '東京都', rank: 0 },
        { name: '神奈川県', rank: 0 },
        { name: '新潟県', rank: 0 },
        { name: '富山県', rank: 0 },
        { name: '石川県', rank: 0 },
        { name: '福井県', rank: 0 },
        { name: '山梨県', rank: 0 },
        { name: '長野県', rank: 0 },
        { name: '岐阜県', rank: 0 },
        { name: '静岡県', rank: 0 },
        { name: '愛知県', rank: 0 },
        { name: '三重県', rank: 0 },
        { name: '滋賀県', rank: 0 },
        { name: '京都府', rank: 0 },
        { name: '大阪府', rank: 0 },
        { name: '兵庫県', rank: 0 },
        { name: '奈良県', rank: 0 },
        { name: '和歌山県', rank: 0 },
        { name: '鳥取県', rank: 0 },
        { name: '島根県', rank: 0 },
        { name: '岡山県', rank: 0 },
        { name: '広島県', rank: 0 },
        { name: '山口県', rank: 0 },
        { name: '徳島県', rank: 0 },
        { name: '香川県', rank: 0 },
        { name: '愛媛県', rank: 0 },
        { name: '高知県', rank: 0 },
        { name: '福岡県', rank: 0 },
        { name: '佐賀県', rank: 0 },
        { name: '長崎県', rank: 0 },
        { name: '熊本県', rank: 0 },
        { name: '大分県', rank: 0 },
        { name: '宮崎県', rank: 0 },
        { name: '鹿児島県', rank: 0 },
        { name: '沖縄県', rank: 0 },
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
  },
  methods: {
    async addGeoJsonSource(layer, i, is_reverse) {
      const stateDataLayer = this.map.getLayer(layer.table_name);
      if (stateDataLayer === undefined) {
        const request = layer.table_name;
        const response = await this.getGeoJsonData(request);
        const properties = response.features.map(feature => {
          return feature.properties;
        });
        this.propertyData[layer.title] = properties;
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
        this.changeLayerVisibility(layer, false);
        this.layers[i].isSelected = !this.layers[i].isSelected;
      }
    },
    addReverseGeoJsonSource(layer, i, is_reverse) {
      const stateDataLayer = this.map.getLayer(layer.table_name);
      const stateReverseDataLayer = this.map.getLayer(
        layer.table_name + 'reverse'
      );
      if (stateDataLayer !== undefined && stateReverseDataLayer === undefined) {
        this.layers[i].isSelected = true;
        this.changeLayerVisibility(layer, false);
        this.paintPolygonLayer(layer, is_reverse);
      } else if (stateReverseDataLayer !== undefined) {
        this.changeLayerVisibility(layer, true);
        this.changeLayerVisibility(layer, false);
      }
    },
    createMap() {
      mapboxgl.accessToken = this.access_token;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [137.15057373046875, 38.0918216511155],
        zoom: 4.5,
      });
      const allLayers = [];
      this.layers.map(e => {
        return allLayers.push(e.table_name, e.table_name + 'reverse');
      });
      this.map.on('click', allLayers, async e => {
        this.selectedLayers = [];
        this.selectedLayersTitle = [];
        this.layers.forEach(e => {
          if (e.isSelected === true) {
            this.selectedLayers.push(e.table_name);
            this.selectedLayersTitle.push(e.title);
          }
        });
        const res = await mapService.getAttributeData({
          lngLat: e.lngLat,
          layer: this.selectedLayers,
        });
        const description = res.map((e, index) => {
          const description =
            this.selectedLayersTitle[index] +
            ':' +
            e.rows[0].value +
            ' (' +
            e.rows[0].rank +
            '位)' +
            '<br>';
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
          'circle-color': 'pink',
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
              'fill-color': 'blue',
              'fill-opacity': 1,
            },
      });
    },
    // レイヤーの表示・非表示
    changeLayerVisibility(clickedLayer, isReverse) {
      const visibility = this.map.getLayoutProperty(
        isReverse
          ? clickedLayer.table_name + 'reverse'
          : clickedLayer.table_name,
        'visibility'
      );
      if (visibility === 'visible') {
        this.map.setLayoutProperty(
          isReverse
            ? clickedLayer.table_name + 'reverse'
            : clickedLayer.table_name,
          'visibility',
          'none'
        );
      } else {
        this.map.setLayoutProperty(
          isReverse
            ? clickedLayer.table_name + 'reverse'
            : clickedLayer.table_name,
          'visibility',
          'visible'
        );
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
    // ランキング表示機能
    showRanking() {
      const selectedLayer = this.layers
        .filter(layer => layer.isSelected === true)
        .map(layer => layer.title);
      if (selectedLayer.length > 0) {
        selectedLayer.push('総合');
      }
      this.items = selectedLayer;
      this.isRanking = true;
      this.isRankingBtn = false;
    },
    hideRanking() {
      this.isRanking = false;
      this.isRankingBtn = true;
    },
    selectTableData(value) {
      this.isTable = false;
      this.isTotalTable = false;
      if (value === '総合') {
        const layersTitle = [...this.items];
        layersTitle.pop();
        const properties = layersTitle.map(title => {
          return this.propertyData[title];
        });
        this.totalRankingData.forEach(x => {
          x.rank = 0;
        });
        properties.forEach(x =>
          x.forEach((x, i) => {
            const rank = x.rank / properties.length;
            this.totalRankingData[i].rank += rank;
          })
        );
        this.totalRankingData.forEach(x => {
          x.rank = x.rank.toFixed(1);
        });
        this.isTotalTable = true;
      } else {
        const property = this.propertyData[value];
        this.$set(this, 'selectedPropertyData', property);
        this.isTable = true;
      }
    },
  },
};
</script>

<style>
/* body { margin: 0; padding: 0; } */
/* #map { position: absolute; top: 0; bottom: 0; width: 100%; } */
#map {
  position: absolute;
  top: 0;
  bottom: 0;
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
.map-overlay {
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  position: absolute;
  width: 300px;
  bottom: 0;
  right: 0;
  padding: 10px;
  text-align: center;
}

.map-overlay .map-overlay-inner {
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 10px;
}

.map-overlay-inner fieldset:last-child {
  margin: 0;
}

.map-overlay-inner select {
  width: 100%;
}

.map-overlay-inner button {
  display: inline-block;
  color: black;
  cursor: pointer;
}
</style>
