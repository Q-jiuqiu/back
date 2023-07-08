<!--
 * @Author: 何元鹏
 * @Date: 2023-06-06 20:59:09
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-07-06 21:13:59
-->
<!--
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-06-06 22:35:43
 * @Description: 首页
 * @FilePath: \vue-admin-template\src\views\portal\index.vue
-->
<template>
  <div class="portal-container">
    <!-- 操作按钮 -->
    <div class="operation">
      <div class="search">

        <!--  <div class="search-item">
          <div class="label">城市:</div>
          <el-select v-model="searchCityData" clearable placeholder="请选择">
            <el-option
              v-for="item in filterCityList"
              :key="item.id"
              :label="item.city"
              :value="item.city"
            />
          </el-select>

        </div>

        <el-button
          type="primary"
          size="medium"
          icon="el-icon-search"
          @click="initTableData"
        >搜索</el-button>
        <el-button
          size="medium"
          icon="el-icon-search"
          @click="handleFilterReset"
        >重置</el-button> -->
      </div>
      <el-button
        type="primary"
        size="medium"
        @click="handleShopAdd"
      >
        新增字典
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table
        ref="Table"
        v-loading="tableLoading"
        :data="tableData"
        border
        height="calc(100% - 3rem )"
        @row-click="handleRowClick"
      >
        <!-- <el-table-column
          prop="city"
          label="城市"
          width="120"
          header-align="center"
          align="center"
        /> -->
        <el-table-column
          prop="parentName"
          label="一级类"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="name"
          label="二级类"
          header-align="center"
          align="center"
        />
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.stop="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              class="warn-btn"
              @click.stop="handleShopDel(scope.row)"
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
    <!-- 新增避坑 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleDialogClose"
    >
      <span
        slot="title"
        class="dialog-title"
      >
        {{ dialogTitle }}

      </span>
      <div class="dialog-container">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="80px"
        >
          <!-- <el-row>
            <el-form-item
              label="城市"
              prop="city"
            >
              <el-select v-model="form.city" clearable placeholder="请选择">
                <el-option
                  v-for="item in filterCityList"
                  :key="item.id"
                  :label="item.city"
                  :value="item.city"
                />
              </el-select>
            </el-form-item>
          </el-row> -->
          <el-row>
            <el-form-item
              label="大类"
              prop="parentName"
            >
              <el-select v-model="form.parentName" clearable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="小类"
              prop="name"
            >
              <el-input
                v-model="form.name"
                placeholder="请输入类型"
                style="width: 100%;"
              />
            </el-form-item>
          </el-row>

        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="dialogVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          size="medium"
          :loading="addBtnLoading"
          @click="handleFormConfirm"
        >
          确定
        </el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { postDictAdd, getDictFind, deleteDictPit, postDictEdit, getCityFindPage } from "@/api";

export default {
  name: "Portal",
  data() {
    return {
      tableData: [],
      delLoading: false,
      dialogVisible: false, // 对话框显隐
      dialogTitle: "新增数据字典",
      canEdit: false, // 能否编辑 是否显示编辑图标
      isEdit: true, // 是否编辑
      imageBase64: "", // 图片Base64编码
      form: {
        name: "",
        parentName: "美食",
        type: "美食",
        level: 2
        // city: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        parentName: [
          { required: true, message: "请选择类型", trigger: "change" }
        ]
        /*  city: [
          { required: true, message: "请选择类型", trigger: "change" }
        ] */
      },
      addBtnLoading: false, // 添加门店loading
      tableLoading: false, // 表格loading
      searchCityData: "",
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
      totalElements: 0,
      pageIndex: 1,
      pageSize: 10,
      filterCityList: []
    };
  },
  mounted() {
    this.initTableData();
  },
  methods: {
    // 编辑
    handleEdit(row) {
      this.dialogTitle = "编辑门店信息数据字典";
      this.isEdit = true;
      this.canEdit = true;
      this.dialogVisible = true;
      const key = Object.keys(row);
      key.forEach((key) => {
        this.form[key] = row[key];
      });
    },
    // 获取列表
    async initTableData() {
      try {
        this.tableLoading = true;
        const { data: {
          content, totalElements
        }} = await getDictFind(
          { pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }, {
            level: 2
            // city: this.searchCityData
          }
        );
        this.totalElements = totalElements;
        this.tableData = content;
        const { data } = await getCityFindPage(
          1,
          1000
        );
        this.filterCityList = data.content;
      } catch (error) {
        this.$message.warning("获取数据失败");
      } finally {
        this.tableLoading = false;
      }
    },
    // 分页
    handelCurrentPage(index) {
      this.pageIndex = index;
      this.initTableData();
    },

    // 重置搜索条件
    handleFilterReset() {
      this.name = "";
      this.searchCityData = "";
      this.region = "";
      this.initTableData();
    },
    // 点击表格行
    handleRowClick(row) {
      this.$refs.Table.toggleRowSelection(row);
    },
    // 按钮失焦
    dissolveFocus(event) {
      let target = event.target;
      if (target.nodeName === "SPAN") {
        target = event.target.parentNode;
      }
      target.blur();
    },
    // 增加门店-打开对话框
    handleShopAdd(event) {
      this.dialogTitle = "新增数据字典";
      this.isEdit = true;
      this.dissolveFocus(event);
      this.dialogVisible = true;
    },
    // 关闭对话
    handleDialogClose(done) {
      if (this.addBtnLoading) {
        this.$message.info("正在增加数据……");
        return;
      }
      this.resetForm();
      this.canEdit = false;
      done();
    },
    // 删除门店
    handleShopDel(item) {
      this.$confirm("此操作将永久删除选中门店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          console.log(item);
          try {
            await deleteDictPit(item.id);
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
    },
    // 提交表单
    handleFormConfirm() {
      console.log(this.form);
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            this.addBtnLoading = true;
            this.form.type = this.form.parentName;
            if (this.canEdit) {
              await postDictEdit(this.form);
            } else {
              await postDictAdd(this.form);
            }
            this.resetForm();
            this.dialogVisible = false;
            await this.initTableData();
            this.$message.success(`新增成功`);
          } catch (error) {
            this.$message.error(`新增失败`);
          } finally {
            this.addBtnLoading = false;
          }
        } else {
          return false;
        }
      });
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
