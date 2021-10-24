<template>
  <div class="config">
    <el-form :model="config" class="config-form">
      <el-form-item>
        <el-slider
          :min="100"
          :max="10000"
          v-model="config.winScore"
          @change="emitConfig"
          show-input
          :format-tooltip="
            () => {
              return '获胜分数：' + config.winScore;
            }
          "
        />
      </el-form-item>
       <el-form-item>
        <el-slider
          :min="110"
          :max="5000"
          v-model="config.time"
          @change="emitConfig"
          show-input
          :format-tooltip="
            () => {
              return '最大扩展周期：' + config.time + '%';
            }
          "
        />
      </el-form-item>
      <el-form-item class="tag">
        <el-tag
          :key="tag.color"
          v-for="(tag, index) in config.member"
          closable
          :disable-transitions="false"
          @close="handleClose(tag, index)"
        >
          {{ tag.name }}
          <el-tooltip :content="tag.color">
            <span
              class="color-cube config-cube"
              :style="{
                background: tag.color,
              }"
            ></span>
          </el-tooltip>
        </el-tag>
        <div v-if="inputVisible" class="add-tag-form">
          <el-input
            class="input-new-tag"
            v-model="inputValue.name"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            placeholder="请输入名称"
          >
          </el-input>
          <el-input
            class="input-new-tag"
            v-model="inputValue.color"
            placeholder="请输入颜色(16进制)"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
          >
          </el-input>
          <el-tooltip>
            <div slot="content">
              <sketch-picker
                v-model="inputValue.color"
                @input="updateColor"
                @keyup.enter.native="handleInputConfirm"
              ></sketch-picker>
            </div>
            <el-button>取色器</el-button>
          </el-tooltip>
          <el-button @click="handleInputConfirm">确认</el-button>
          <el-button @click="handleInputCancel">取消</el-button>
        </div>
        <el-button v-else class="button-new-tag" size="mini" @click="showInput"
          >+新成员</el-button
        >
      </el-form-item>
      <el-form-item class="presets">
        <el-select v-model="currentPresets" multiple clearable size="mini">
          <el-option
            v-for="(item, index) in presets"
            :key="index"
            :value="item.color"
            :label="item.name"
          >
            <el-tooltip :content="item.color">
              <span
                class="color-cube config-cube"
                :style="{
                  background: item.color,
                }"
              ></span>
            </el-tooltip>
            {{ item.name }}
          </el-option>
        </el-select>
        <el-button @click="handlePresetsConfig" class="preset-button"
          >添加预设</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PRESETS from "../common/presets";
import { Sketch } from "vue-color";
export default {
  components: {
    "sketch-picker": Sketch,
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      inputVisible: false,
      inputValue: {
        name: "",
        color: "",
      },
      presets: PRESETS,
      currentPresets: [],
    };
  },
  methods: {
    handleClose(tag, index) {
      this.presets.push(this.config.member[index]);
      this.config.member.splice(index, 1);
      this.$forceUpdate();
    },
    handlePresetsConfig() {
      this.currentPresets.forEach((item) => {
        const finder = this.presets.find((preset) => {
          return preset.color === item;
        });
        this.config.member.push(finder);
      });
      this.presets = this.presets.filter((item) => {
        return this.currentPresets.indexOf(item.color) === -1;
      });

      this.currentPresets = [];
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      const colorExp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!colorExp.test(inputValue.color)) {
        this.$message.error(
          "[" + inputValue.color + "]" + "不是一个可用的颜色格式！"
        );
        return;
      }
      this.config.member.push(inputValue);
      this.emitConfig();
      this.inputVisible = false;
      this.inputValue = {
        color: "",
        name: "",
      };
    },
    handleInputCancel() {
      this.inputValue = {
        name: "",
        color: "",
      };
      this.inputVisible = false;
    },
    emitConfig() {
      this.$emit("update:config", this.config);
      console.log(this.config);
      console.log("配置更新成功！");
    },
    updateColor(val) {
      this.inputValue.color = val.hex;
    },
  },
};
</script>
<style lang="scss" scoped>
.config {
  .config-form {
    .tag {
      height: 23vh;
      overflow: scroll;
      overflow-x: auto;
      .config-cube {
        float: left;
        margin: 5px;
      }

      .add-tag-form {
        display: flex;
        gap: 5px;
      }
    }
    .presets {
      .config-cube {
        margin-top: 5px;
      }
      .preset-button {
        float: right;
        margin-top: 5px;
      }
    }
  }
}
</style>
