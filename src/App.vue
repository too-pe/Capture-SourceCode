<template>
  <div id="app">
    <header class="header">
      <div class="title">
        <Area :area="title" />
      </div>
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="handleProgress()"
        status="exception"
        v-if="member.length"
      ></el-progress>
      <div class="header-button">
        <el-tooltip content="说明">
          <el-button icon="el-icon-s-order" @click="openDescription"></el-button>
        </el-tooltip>
      </div>
    </header>
    <main class="main">
      <div class="main-item">
        <Rank :member="member" v-if="member.length" />
        <div v-else class="start-description">
          <span>欢迎进入CHAPTURE。
            <br/>在此可进入查看网站说明:)</span>
            <br/>
          <el-button @click="openDescription">说明</el-button>
        </div>
      </div>
      <div class="center">
        <Area :area="area" />
      </div>
      <div class="main-item">
        <config :config.sync="config" />
        <Message :message="message" />
      </div>
    </main>
    <footer class="footer">
      <div class="handle-button">
        <el-button-group>
          <el-button
            @click="start"
            :disabled="flag === 'start' || flag === 'continue'"
            >开始</el-button
          >
          <el-button
            @click="stop"
            :disabled="flag === 'stop' || flag === '' || flag === 'over'"
            >停止</el-button
          >
          <el-button @click="continueTo" :disabled="flag != 'stop'"
            >继续</el-button
          >
        </el-button-group>
      </div>
    </footer>
    <el-dialog title="Chapter" :visible="visible" :before-close="closeDescription">
      <Description/>
    </el-dialog>
  </div>
</template>

<script>
import Area from "./components/Area";
import Member from "./common/member";
import Rank from "./components/Rank";
import { TITLE } from "./common/areas";
import Message from "./components/Message";
import Config from "./components/Config";
import { dateTransform } from "./utils/dateTransform";
import Description from "./components/Description";
export default {
  components: {
    Area,
    Rank,
    Message,
    Config,
    Description
  },
  data() {
    return {
      position: {
        x: 3,
        y: 5,
      },
      title: TITLE,
      area: [],
      size: 50,
      member: [],
      flag: "",
      config: {
        winScore: 100,
        member: [],
        time: 500,
      },
      message: [],
      visible: false,
    };
  },
  created() {
    this.createMap();
  },
  methods: {
    handleProgress() {
      return (
        (this.member.length &&
          parseInt(
            this.member[0].score > this.config.winScore
              ? 100
              : (this.member[0].score / this.config.winScore) * 100
          )) ||
        0
      );
    },
    openDescription() {
      this.visible = true;
    },
    closeDescription() {
      this.visible = false;
    },
    start() {
      const memberConfig = this.config.member;
      if (memberConfig.length < 2) {
        this.$message.error("请至少有两名成员!");
        return;
      }
      console.log(memberConfig);
      this.addMessage("争夺开始！");
      this.createMap();
      this.flag = "start";
      this.member = [];
      memberConfig.forEach((item) => {
        this.member = [
          ...this.member,
          new Member({
            ...item,
            number: 0,
          }),
        ];
      });
      this.member.forEach((item) => {
        this.addMessage(item.name + "加入争夺！");
        this.makeRandomPath(item, item.header - 1);
      });
    },
    stop() {
      this.flag = "stop";
      this.addMessage("争夺停止！");
    },
    async continueTo() {
      this.addMessage("争夺继续！");
      this.flag = "continue";
      console.log(this.member);
      this.member.forEach((item) => {
        if (item.status !== "end") {
          for (let i = 0; i < item.header; i++) {
            this.makeRandomPath(item, i);
            console.log(i);
          }
        }
      });
    },
    createMap() {
      const size = this.size;
      this.area = new Array(size);
      for (let i = 0; i < size; i++) {
        this.area[i] = new Array(size);
      }
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          this.area[i][j] = "#000000";
        }
      }
    },
    makeRandomPath(item, i) {
      const size = this.size;
      if (!item.x[i]) {
        var xlocation = Math.floor(Math.random() * size),
          ylocation = Math.floor(Math.random() * size);
        (item.x[i] = xlocation), (item.y[i] = ylocation);
      }
      var x = item.x[i],
        y = item.y[i];
      var random = 0;
      var that = this;
      var t = setTimeout(function timer() {
        item.time = that.timeAround(item);
        if (
          (that.member.filter((item) => {
            return item.status === "ing";
          }).length <= 1 ||
            item.score > that.config.winScore) &&
          item.status !== "win"
        ) {
          that.flag = "over";
          item.status = "win";
          that.addMessage("争夺结束！" + item.name + "获胜!");
          clearInterval(t);
          return;
        }
        random = Math.floor(Math.random() * 4);
        {
          if (random === 0 && x < size - 1) {
            x++;
          } else if (random === 1 && y < size - 1) {
            y++;
          } else if (random === 2 && x > 0) {
            x--;
          } else if (random === 3 && y > 0) {
            y--;
          }
          if (that.area[x][y] !== item.color) {
            item.number++;
            // find empty
            if (that.area[x][y] === "#000000") {
              item.score++;
            }
            // find others
            else {
              item.score += 10;
            }
            // lose mine
            var deleteCube = that.member.find((mem) => {
              return mem.color === that.area[x][y];
            });
            if (deleteCube) {
              if (deleteCube.status !== "end") {
                deleteCube.score -= 10;
              }
              deleteCube.number--;
            }
            // rank
            that.member.sort((a, b) => {
              return b.score - a.score;
            });
            // print
            that.member = that.member.slice(0);
          }
        }
        that.area[x][y] = item.color;
        that.area = that.area.slice(0);
        if (item.time <= that.config.time) {
          if (that.flag === "stop" || that.flag === "over") {
            clearTimeout(t);
            return;
          }
          t = setTimeout(timer, item.time);
        } else {
          clearTimeout(t);
          item.status = "end";
          item.header = 0;
          that.addMessage(item.name + "停止争夺！");
          // one be killed, random one would have a new list;
          const random = Math.floor(Math.random() * that.member.length);

          if (that.member[random].status === "end") {
            // if the random one was end, reborn;
            const config = {
              color: that.member[random].color,
              name: that.member[random].name,
              number: that.member[random].number,
            };
            that.member[random] = new Member(config);
            that.addMessage(that.member[random].name + "继续争夺！");
            console.log(that.member[random].header - 1);
          } else {
            that.addMessage(that.member[random].name + "将添加新探索序列！");
            that.member[random].header++;
          }
          that.makeRandomPath(
            that.member[random],
            that.member[random].header - 1
          );
        }
      }, item.time);
    },
    timeAround(item) {
      return item.score < 0 ? 100 - item.score * 10 : 100;
    },
    addMessage(message) {
      const date = dateTransform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.message.push({
        date: date,
        message: message,
      });
    },
  },
};
</script>
<style lang="scss">
::-webkit-scrollbar {
  color: transparent;
}
body {
  margin: 0;
  .el-table {
    height: 75vh;
    overflow: scroll;
    .ing-row {
      background: transparent;
    }
    .warning-row {
      background: rgb(251, 218, 156);
    }
    .success-row {
      background: #e3ffd4;
    }
    .danger-row {
      background: rgb(246, 218, 218);
    }
  }

  .el-button {
    font-size: smaller;
    padding: 10px;
    color: blanchedalmond;
    border-color: rgba(255, 255, 255, 0.472);
    background-color: transparent;

    &:hover {
      border-color: white;
      background: white;
      color: black;
    }
  }

  .el-button:disabled {
    background-color: transparent;
    border: black;
    color: rgba(255, 255, 255, 0.472);

    &:hover {
      background-color: transparent;
      border: black;
      color: rgba(255, 255, 255, 0.472);
    }
  }

  .color-cube {
    width: 20px;
    height: 20px;
    float: right;
  }
}
</style>
<style lang="scss" scoped>
#app {
  background: rgb(56, 101, 184);
  height: 100vh;
  margin: 0;
  overflow: scroll;
  .header {
    width: 100%;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    .title {
      width: 22%;
    }
    .el-progress {
      padding-top: 15px;
      width: 20%;
    }
    .header-button {
      width: 22%;

      .el-button {
        margin: 0 10px;
        float: right;
      }
    }
  }
  .main {
    display: flex;
    height: 60vh;

    .main-item {
      width: 30%;
      padding: 0 10px;

      .start-description{
        padding-top: 20vh;
        color: white;
        text-align: center;
      }
    }

    .center {
      width: 40%;
      display: flex;
      justify-content: center;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    padding: 10px;
    background: rgb(0, 0, 0);
    z-index: 10;
    width: 100%;
    .handle-button {
      text-align: center;
    }
  }
}
</style>
