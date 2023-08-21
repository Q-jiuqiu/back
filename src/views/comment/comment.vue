<!--
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-07-02 00:36:13
 * @Description: 评价
 * @FilePath: \vue-admin-template\src\views\comment\comment.vue
-->
<template>
  <div class="portal-container">
    <!-- 操作按钮 -->
    <div class="operation">
      <div class="search">

        <div class="search-item">
          <div class="label">城市:</div>
          <el-select v-model="city" placeholder="请选择" @change="handelCityChange">
            <el-option v-for="item in cityOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <div class="label">类型:</div>
          <el-select v-model="type" placeholder="请选择" @change="handelTypeChange">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search-item">
          <div class="label">名称:</div>
          <el-select v-model="form.name" filterable placeholder="请选择" @change="handelNameChange">
            <el-option v-for="item in nameOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <el-button type="primary" size="medium" icon="el-icon-search" @click="initTableData">筛选</el-button>
        <el-button size="medium" icon="el-icon-search" @click="handleFilterReset">重置</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table
        ref="Table"
        v-loading="tableLoading"
        :data="tableData"
        border
        height="calc(100% - 3rem )"
        empty-text="请先选择筛选条件"
      >

        <el-table-column prop="comment" label="评价" header-align="center" align="left" />
        <el-table-column label="操作" width="150" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="warn-btn" @click.stop="handleCommentDel(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :page-size="pageSize"
        :page-count="pageIndex"
        layout="prev, pager, next"
        :total="totalElements"
        style="display: flex;
        justify-content: end;
        align-content: center;"
        @current-change="handelCurrentPage"
      />
    </div>
  </div>
</template>

<script>
import { getTypeCityFind, getList, getCommentById, deleteComment } from "@/api";

export default {
  name: "Comment",
  data() {
    return {
      tableData: [],
      form: {
        foodName: "",
        image: [],
        describe: "",
        foodId: "",
        name: "",
        city: "",
        type: ""
      },
      tableLoading: false, // 表格loading
      // 搜索关键字
      name: "",
      city: "",
      type: "美食",
      options: [
        {
          value: "美食",
          label: "美食"
        },
        {
          value: "风景",
          label: "风景"
        }
      ],
      cityOption: [],
      totalElements: 0,
      pageIndex: 1,
      pageSize: 10,
      nameOptions: []
    };
  },
  mounted() {
    /*  this.initTableData(); */
    this.getQueryCityData();
  },
  methods: {
    // 查询城市信息
    async getQueryCityData() {
      const { data } = await getTypeCityFind();
      this.city = data[0];
      data.forEach(item => {
        this.cityOption.push({
          value: item,
          label: item
        });
      });
      this.getStoreIdData(data[0], this.type);
    },
    handelTypeChange(v) {
      console.log(v);
      this.type = v;
      this.form.name = "";
      this.getStoreIdData(this.city, v);
    },
    handelCityChange(v) {
      console.log(v);
      this.city = v;
      this.form.name = "";
      this.getStoreIdData(v, this.type);
    },
    async getStoreIdData(city, type) {
      const { data } = await getList(
        {
          type: type,
          city: city
        },
        {
          pageIndex: 1,
          pageSize: 10000
        }
      );
      this.nameOptions = data.content;
    },
    handelNameChange(value) {
      console.log(value);
      this.form.name = value;
      this.initTableData();
    },
    // 查询描述列表
    async initTableData() {
      try {
        if (this.form.name) {
          this.tableLoading = true;
          const { data } = await getCommentById(
            {
              id: this.form.name,
              pageIndex: this.pageIndex,
              pageSize: this.pageSize
            }
          );
          console.log(data);
          this.tableData = data.content;
          this.totalElements = data.totalElements;
        } else {
          this.$message.info("请选择店铺名称");
        }
      } catch (error) {
        this.$message.warning("获取数据失败");
      } finally {
        this.tableLoading = false;
      }
    },
    // 分页
    handelCurrentPage(index) {
      console.log(index);
      this.pageIndex = index;
      this.initTableData();
    },

    // 重置搜索条件
    handleFilterReset() {
      this.form.name = "";
      this.city = "";
      this.type = "";
      this.tableData = [];
    },
    // 删除评价
    handleCommentDel(item) {
      this.$confirm("此操作将永久删除选中评价, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          console.log(item);
          try {
            await deleteComment(item.id);
            this.$message.success("删除成功!");
            this.initTableData();
          } catch (error) {
            this.$message.warning("删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 重置表单
    resetForm() {
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(this.form, key)) {
          this.form[key] = "";
        }
      }
      this.imageBase64 = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.portal-container {
  padding: 15px;
  display: grid;
  height: 100%;
  grid-template-rows: 50px calc(100% - 50px);

  .operation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .search {
      display: flex;

      &-item {
        display: flex;
        align-items: center;
        margin-right: 20px;

        .label {
          white-space: nowrap;
          margin-right: 5px;
        }
      }
    }
  }

  .table-container {
    width: 100%;
    overflow: hidden;
  }

  .icon {
    cursor: pointer;
    margin-left: 5px;
  }

  .dialog-container {
    max-height: 400px;
    overflow: auto;

    .item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .label {
        display: inline-block;
        margin-right: 10px;
        white-space: nowrap;
        font-size: 15px;
        min-width: 60px;
        text-align: center;
        color: #000;
      }
    }
  }

  .warn-btn {
    color: #f56c6c;
  }

  .image {
    max-width: 100px;
  }
}
</style>
