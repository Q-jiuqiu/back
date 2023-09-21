<!--
 * @Author: 何元鹏
 * @Date: 2023-08-23 20:46:14
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-20 21:31:49
-->
<template>
  <div v-loading="recommendedDataListLoading" class="explore">
    <header class="explore-header">
      <el-button
        type="primary"
        size="medium"
        @click="handelRecommendedAdd"
      >
        新增
      </el-button>
    </header>
    <el-table
      v-loading="exploreLoading"
      border
      :data="exploreDataList"
      class="explore-table"
    >
      <el-table-column
        label="名称"
        header-align="center"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">

          <el-select v-if="exploreEdit && exploreIndex === scope.$index" v-model="scope.row.name" multiple placeholder="请选择">
            <el-option
              v-for="(item,index) in visitStoreData"
              :key="index"
              :label="item.entName"
              :value="item.id"
            />
          </el-select>
          <span v-else>{{ scope.row.name }}</span>

        </template>
      </el-table-column>
      <el-table-column
        label="图片"
        width="180"
        header-align="center"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="{ row }">
          <img style="width: 50px; height: 50px;" :src="row.headSculpture" :alt="row.name">
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
        header-align="center"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handelRecommendedEditor( scope.row,scope.$index,)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handelRecommendedDelete(scope.row,scope.$index, )"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>
import { postRestExpAdd, getRestFindExp, deleteExp, getExpUserFind } from "@/api";
export default {
  // 组件名称
  name: "ExploreShop",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    exploreId: {
      type: String,
      default: () => ""
    }
  },
  // 组件状态值
  data() {
    return {
      exploreDataList: [],
      exploreLoading: true,
      exploreEdit: false,
      exploreIndex: 0,
      visitStoreData: []
    };
  },

  mounted() {
    this.getExploreList();
  },
  // 组件方法
  methods: {
    /**
     * @description: 获取主播列表
     * @return {*}
     */
    async getVisitStoreDataList() {
      try {
        this.exploreLoading = true;
        const { data: { content }} = await getExpUserFind(
          { pageIndex: 1,
            pageSize: 1000
          }
        );
        this.visitStoreData = content;
        console.log(content);
      } catch (error) {
        this.$message.error("获取数据失败");
      } finally {
        this.exploreLoading = false;
      }
    },
    /**
     * @description:获取
     * @return {*}
     */
    async getExploreList() {
      this.exploreLoading = true;
      try {
        const { data } = await getRestFindExp(
          this.exploreId
        );
        this.exploreDataList = data;
      } catch (error) {
        this.$message.error("获取数据失败");
      } finally {
        this.exploreLoading = false;
      }
    },
    /**
     * @description:新增
     * @return {*}
     */
    handelExploreAdd() {},
    /**
     * @description:编辑
     * @return {*}
     */
    handelExploreEditor() {},
    /**
     * @description:删除
     * @return {*}
     */
    handelExploreDelete(row, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          try {
            await deleteExp(row.id);
            this.$message.success("删除成功!");
          } catch (error) {
            this.$message.error("删除失败");
          } finally {
            this.getExploreList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped lang="scss">

.explore{
  position: relative;
  width: 100%;
  height: 100%;
}

</style>
