<template>
  <div class="rank">
    <el-table
    size="mini"
      :data="member"
      highlight-current-row
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="名称" prop="name" fixed>
        <template slot-scope="scope">
          {{ scope.row.name
          }}<span
            class="color-cube"
            :style="{
              background: scope.row.color,
            }"
          ></span>
        </template>
      </el-table-column>
      <el-table-column label="资源(万亿吨)" prop="score"> </el-table-column>
      <el-table-column label="占地(光年^2)" prop="number"> </el-table-column>
      <el-table-column label="探索序列" prop="header"> </el-table-column>
      <el-table-column label="拓展延迟" prop="time">
        <template slot-scope="scope"> {{ scope.row.time }}% </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    member: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    tableRowClassName({row}) {
      if(row.status === "ing") {
        return "ing-row";
      }
      if (row.status === "end") {
        return "danger-row";
      }
      if(row.status === "win") {
        return "success-row";
      }
      if (row.time > 100) {
        return "warning-row";
      }
      return "";
    },
  },
};
</script>
