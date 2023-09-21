<!--
 * @Author: 何元鹏
 * @Date: 2023-06-06 20:59:09
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-21 18:57:57
-->
<template>
  <div class="portal-container">
    <!-- 操作按钮 -->
    <div class="operation">
      <div class="search">

        <div class="search-item">
          <div class="label">分类:</div>
          <el-select v-model="searchCityData" clearable placeholder="请选择" @change="initTableData">
            <el-option
              v-for="item in filterClassList"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <el-button
        type="primary"
        size="medium"
        @click="handleShopAdd"
      >
        新增
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table
        ref="Table"
        v-loading="tableLoading"
        :data="dictionaryTableData"
        border
        height="calc(100% - 3rem )"
      >
        <el-table-column
          prop="parentName"
          label="一级类"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-select v-if="dictionaryEdit && dictionaryIndex === scope.$index" v-model=" scope.row.parentName " clearable placeholder="请选择">
              <el-option
                v-for="(item,index) in filterClassList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ scope.row.parentName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="二级类"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-if="dictionaryEdit && dictionaryIndex === scope.$index" v-model=" scope.row.name " />
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="dictionaryEdit && dictionaryIndex === scope.$index"
              size="mini"
              @click="handleFormConfirm(scope.$index,scope.row)"
            >保存</el-button>
            <el-button
              type="text"
              size="small"
              @click.stop="handleEdit(scope.$index,scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              class="warn-btn"
              @click.stop="handleShopDel(scope.$index,scope.row)"
            >
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
import { postDictAdd, getDictFind, deleteDictPit, postDictEdit } from "@/api";

export default {
  name: "Portal",
  data() {
    return {
      dictionaryTableData: [],
      tableLoading: false,
      searchCityData: "美食",
      totalElements: 0,
      pageIndex: 1,
      pageSize: 20,
      filterClassList: [{
        value: "美食",
        label: "美食"
      },
      {
        value: "风景",
        label: "风景"
      }],
      dictionaryEdit: false,
      dictionaryIndex: 0
    };
  },
  mounted() {
    this.initTableData();
  },
  methods: {
    /**
     * @description: 获取列表
     * @return {*}
     */
    async initTableData() {
      try {
        this.tableLoading = true;
        const { data: {
          content, totalElements
        }} = await getDictFind(
          { pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }, {
            level: 2,
            type: this.searchCityData
          }
        );
        this.totalElements = totalElements;
        this.dictionaryTableData = content;
      } catch (error) {
        this.$message.warning("获取数据失败");
      } finally {
        this.tableLoading = false;
      }
    },
    // 编辑
    handleEdit(index, row) {
      console.log(index, row);
      this.dictionaryEdit = true;
      this.dictionaryIndex = index;
    },

    // 分页
    handelCurrentPage(index) {
      this.pageIndex = index;
      this.initTableData();
    },

    // 新增
    handleShopAdd() {
      const faresData = {
        city: "四川省/成都市",
        name: "",
        parentName: this.searchCityData,
        type: this.searchCityData,
        level: 2
      };
      this.dictionaryEdit = true;
      this.dictionaryIndex = 0;
      this.dictionaryTableData.unshift(faresData);
    },
    // 删除
    handleShopDel(index, row) {
      console.log(index, row);
      if (row.id) {
        this.$confirm("此操作将永久删除选中门店, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async() => {
            try {
              await deleteDictPit(row.id);
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
      } else {
        this.dictionaryTableData.splice(index, 1);
        this.dictionaryEdit = false;
      }
    },
    // 保存
    async handleFormConfirm(index, row) {
      console.log(index, row);
      try {
        this.tableLoading = true;
        const formData = new FormData();
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            formData.append(key, row[key]);
          }
        }
        console.log(formData);
        if (index) {
          await postDictEdit(formData);
        } else {
          await postDictAdd(formData);
        }
        this.initTableData();
        this.$message.success(`新增成功`);
      } catch (error) {
        this.$message.error(`新增失败`);
      } finally {
        this.tableLoading = false;
        this.dictionaryEdit = false;
      }
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
