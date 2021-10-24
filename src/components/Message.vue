<template>
  <div id="message">
    <ul>
      <li v-for="(item, index) in message" :key="index">
        [{{ item.date }}]{{ item.message }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {
    message: {
      handler() {
        //页面滑到最底部
        this.$nextTick(() => {
          let msg = document.getElementById("message"); // 获取对象
          msg.scrollTop = msg.scrollHeight; // 滚动高度
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
#message {
  color: white;
  height: 30vh;
  overflow: scroll;
  overflow-x: auto;
  // background: rgba(255, 255, 255, 0.26);
}
</style>
