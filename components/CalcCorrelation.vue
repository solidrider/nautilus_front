<template>
  <div class="calc-tab">
    <v-card v-show="isShow">
      <v-container fluid>
        <v-row align="center">
          <v-col cols="12">
            <v-select :items="items" label="レイヤーA" @change="setPropertyA">
            </v-select>
            <v-select :items="items" label="レイヤーB" @change="setPropertyB">
            </v-select>
            <p>{{ correlation }}</p>
            <v-btn
              style="background-color: gray"
              @click="calcCorrelation(layerA, layerB)"
              >相関係数を計算</v-btn
            >
            <v-btn @click="closeCalcTab">閉じる</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: null,
    },
    property: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    layerA: [],
    layerB: [],
    correlation: 0,
    dispersion: 0,
    isShow: true,
  }),
  methods: {
    calcCorrelation(x, y) {
      this.dispersion = 0;
      this.correlation = 0;
      for (let i = 0; i < 47; i++) {
        this.dispersion += (x[i].rank - y[i].rank) ** 2 / 47;
      }
      this.correlation = 1 - (6 * this.dispersion) / (47 ** 2 - 1);
      this.correlation = Math.trunc(this.correlation * 100) / 100;
    },
    setPropertyA(value) {
      const property = this.property[value];
      this.$set(this, 'layerA', property);
    },
    setPropertyB(value) {
      const property = this.property[value];
      this.$set(this, 'layerB', property);
    },
    openCalcTab() {
      this.isShow = true;
    },
    closeCalcTab() {
      this.isShow = false;
      this.$emit('change-mode');
      this.isShow = true;
    },
  },
};
</script>

<style scoped>
.calc-tab {
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  position: absolute;
  width: 300px;
  bottom: 100;
  right: 0;
  padding: 10px;
  text-align: center;
}
</style>
