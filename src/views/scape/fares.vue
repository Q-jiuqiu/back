<template>
  <div class="fares">
    <header class="fares-header">
      <el-button
        type="primary"
        size="medium"
        @click="handleFaresPreview"
      >
        新增
      </el-button>
    </header>
    <section class="fares-center">
      <el-table
        v-loading="faresLoading"
        :data="faresTableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="adult"
          label="人群类型"
          width="120"
          header-align="center"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-if="faresEdit && faresIndex === scope.$index" v-model=" scope.row.adult " />
            <span v-else>{{ scope.row.adult }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="elder"
          label="具体条件"
          header-align="center"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-if="faresEdit && faresIndex === scope.$index" v-model=" scope.row.elder " />
            <span v-else>{{ scope.row.elder }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="child"
          label="票价"
          width="100"
          header-align="center"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-if="faresEdit && faresIndex === scope.$index" v-model=" scope.row.child " />
            <span v-else>{{ scope.row.child }}</span>
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
              v-if="faresEdit && faresIndex === scope.$index"
              size="mini"
              @click="handelSubmitFaresForm(scope.$index,scope.row)"
            >保存</el-button>
            <el-button
              v-else
              size="mini"
              @click="handleFaresEdit(scope.$index,scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleFaresDelete(scope.$index,scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
import { getFaresFindExp, postDbsFaresAdd, deleteFares } from "@/api";

export default {
  // 组件名称
  name: "Fares",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    faresId: {
      type: String,
      default: () => ""
    }
  },
  // 组件状态值
  data() {
    return {
      faresLoading: true,
      faresTableData: [],
      faresEdit: false,
      faresIndex: 0
    };
  },
  watch: {
    faresId: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getFaresDataList();
        }
      }
    }
  },
  mounted() {
    this.getFaresDataList();
  },
  methods: {
    /**
     * @description: 获取票价数据
     * @return {*}
     */
    async getFaresDataList() {
      this.faresLoading = true;
      try {
        const { data } = await getFaresFindExp(
          this.faresId
        );
        this.faresTableData = data;
      } catch (error) {
        this.$message.error("获取数据失败");
      } finally {
        this.faresLoading = false;
      }
    },
    /**
     * @description: 新增票价
     * @return {*}
     */
    handleFaresPreview() {
      const faresData = {
        id: "",
        adult: "",
        elder: "",
        child: "",
        productId: this.faresId
      };
      this.faresEdit = true;
      this.faresIndex = 0;
      this.faresTableData.unshift(faresData);
    },
    /**
     * @description: 编辑
     * @param {*} index
     * @param {*} row
     * @return {*}
     */
    handleFaresEdit(index, row) {
      console.log(index, row);
      this.faresEdit = true;
      this.faresIndex = index;
    },
    /**
      * @description: 新增
      * @param {*} formName
      * @return {*}
      */
    async  handelSubmitFaresForm(index, row) {
      console.log(index, row);
      try {
        this.faresLoading = true;
        const data = await postDbsFaresAdd([row]);
        data && this.$message.success("新建票价成功");
      } catch (error) {
        this.$message.error("新建票价失败");
      } finally {
        this.getFaresDataList();
        this.faresLoading = false;
        this.faresEdit = false;
      }
    },
    /**
     * @description: 删除票价
     * @return {*}
     */
    async handleFaresDelete(index, row) {
      console.log(index, row);
      if (row.id) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async() => {
            this.faresLoading = true;
            try {
              await deleteFares(row.id);
              this.getFaresDataList();
            } catch (error) {
              this.$message.error("删除失败");
            } finally {
              this.faresLoading = false;
              this.faresEdit = false;
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.faresTableData.splice(index, 1);
        this.faresEdit = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.fares{
  &-header{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
    height: 3rem;
  }
  &-center{
    width: 100%;
  }
}
</style>
