<template>
  <div class="area">
    <div v-for="(line, index) in area" :key="index">
      <span v-for="(item, index) in line" :key="index" class="line">
        <div
          class="area-item"
          :style="handleCubeStyle(item)"
        ></div>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    area: {
      type: Array,
      default: () => {
        return [[]];
      },
    },
  },
  methods: {
    handleCubeStyle(item) {
      return {
        background: item,
      }
    }
  },
};
</script>

<style lang="scss">

.area {
  .area-item {
      width: 1.5vh;
      height: 1.5vh;
      float: left;
  }
}
</style>
