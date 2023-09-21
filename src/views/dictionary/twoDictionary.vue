<!--
 * @Author: 何元鹏
 * @Date: 2023-06-06 20:59:09
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-21 21:44:08
-->
<template>
  <div class="portal-container">
    <!-- 操作按钮 -->
    <div class="operation">
      <div class="search">
        <div class="search-item">
          <div class="label">城市:</div>
          <el-cascader
            v-model="searchCityData"
            :options="filterCityList"
            :props="{ checkStrictly: true,...props }"
            clearable
            placeholder="请选择"
          />

        </div>
        <div class="search-item">
          <div class="label">分类:</div>
          <el-select v-model="searchData" placeholder="选择分类">
            <el-option
              v-for="item in filterLists"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>

        </div>

        <el-button
          type="primary"
          size="medium"
          icon="el-icon-search"
          @click="handelSearchTableData"
        >搜索</el-button>
        <el-button
          size="medium"
          icon="el-icon-search"
          @click="handleFilterReset"
        >重置</el-button>
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
        <el-table-column
          label="序号"
          type="index"
          header-align="center"
          align="center"
          width="50"
        />
        <el-table-column
          prop="city"
          label="城市"
          width="420"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="parentName"
          label="一级分类"
          width="200"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="name"
          label="二级分类"
          header-align="center"
          align="center"
        />

        <el-table-column
          label="操作"
          width="150"
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
    <!-- 新增二级分类 -->
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
          <el-row>
            <el-form-item
              label="城市"
              prop="city"
            >
              <el-cascader
                v-model="form.city"
                :options="filterCityList"
                :props="{ checkStrictly: true,...props }"
                style="width: 100%;"
                clearable
                :placeholder="form.city"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="一级类"
              prop="parentName"
            >
              <el-select v-model="form.parentName" clearable placeholder="请选择">
                <el-option
                  v-for="item in filterList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item
              label="二级类"
              prop="name"
            >
              <el-input
                v-model="form.name"
                placeholder="请输入类型"
                style="width: 100%;"
              />
            </el-form-item>
          </el-row>
          <el-form-item
            label="图片"
          >
            <el-upload
              ref="uploadFile"
              class="upload-demo"
              action=""
              :on-change="handleFileChange"
              :file-list="fileList"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              accept=".jpg,.png,.webp"
              multiple
              :limit="2"
              list-type="picture"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png/webp文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-row>
            <el-form-item
              label="描述"
            >
              <el-input
                v-model="form.remark"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="请输入描述信息"
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
  name: "TwoDictionary",

  data() {
    return {
      tableData: [],
      delLoading: false,
      dialogVisible: false, // 对话框显隐
      dialogTitle: "新增数据字典",
      canEdit: false, // 能否编辑 是否显示编辑图标
      searchData: "",
      searchCityData: "",
      fileList: [],
      form: {
        name: "",
        type: "美食",
        remark: "",
        parentName: "",
        level: 3,
        city: "",
        id: ""
      },
      rules: {
        city: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入二级类名称", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择类型", trigger: "change" }
        ]
      },
      addBtnLoading: false, // 添加门店loading
      tableLoading: false, // 表格loading
      filterCityList: [],
      totalElements: 0,
      pageIndex: 1,
      pageSize: 20,
      tableDataOne: [],
      filterList: [],
      filterLists: [],
      parentCity: -1, // 父级城市id
      props: {
        lazy: true,
        async lazyLoad(node, resolve) {
          const { data: { id }} = node;
          const { data } = await getCityFindPage(id);
          function convertData(data) {
            return data.map(item => ({
              value: item.city,
              label: item.city,
              id: item.id,
              level: item.level,
              leaf: item.level >= 3
            }));
          }
          const outputData = convertData(data);
          resolve(outputData);
        } }
    };
  },
  mounted() {
    this.getFilterCityListData();
    this.getFilterList();
    this.getTwoDictionaryDataList();
  },
  methods: {
    /**
     * @description: 数据初始化
     * @return {*}
     */

    async getTwoDictionaryDataList() {
      try {
        this.tableLoading = true;
        const { data: {
          content, totalElements
        }} = await getDictFind(
          { pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }, {
            type: "美食",
            parentName: this.searchData === "所有" ? "" : this.searchData,
            level: 3,
            city: this.searchCityData[ this.searchCityData.length - 1]
          }
        );
        this.totalElements = totalElements;
        this.tableData = content;
      } catch (error) {
        this.$message.warning("获取数据失败");
      } finally {
        this.tableLoading = false;
      }
    },
    /**
     * @description: 搜索数据
     * @return {*}
     */
    async  handelSearchTableData() {
      try {
        this.tableLoading = true;
        let a;
        if (this.searchData === "所有") {
          a = {
            type: "美食",
            level: 3,
            city: this.searchCityData[ this.searchCityData.length - 1]
          };
        } else {
          a = {
            type: "美食",
            parentName: this.searchData,
            level: 3,
            city: this.searchCityData[ this.searchCityData.length - 1]
          };
        }
        const { data: {
          content, totalElements
        }} = await getDictFind(
          { pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }, a
        );
        this.totalElements = totalElements;
        this.tableData = content;
      } catch (error) {
        this.$message.error("获取数据失败");
      } finally {
        this.tableLoading = false;
      }
    },

    /**
     * @description: 城市数据
     * @return {*}
     */
    /*  */
    async  getFilterCityListData() {
      const { data } = await getCityFindPage(this.parentCity);
      function convertData(data) {
        return data.map(item => ({
          value: item.city,
          id: item.id,
          label: item.city,
          level: item.level
        }));
      }

      const outputData = convertData(data);
      this.filterCityList = outputData;
    },
    /**
     * @description: 获取筛选条件
     * @return {*}
     */
    async getFilterList() {
      const { data: {
        content
      }} = await getDictFind(
        { pageIndex: 1,
          pageSize: 10000
        }, {
          type: "美食",
          parentName: "美食",
          level: 2
        }
      );
      this.filterList = content;
      const a = [{
        id: 1,
        name: "所有"
      }];
      this.filterLists = [...a, ...this.filterList];
    },

    // 编辑
    handleEdit(row) {
      this.dialogTitle = "编辑数据字典";
      this.canEdit = true;
      this.dialogVisible = true;
      const key = Object.keys(row);
      key.forEach((key) => {
        if (row[key]) {
          if (key.includes("image")) {
            this.fileList.push({ url: row[key], name: row.name, id: key });
          }
          if (key !== "createTime") {
            this.form[key] = row[key];
          }
        }
      });
      console.log(this.form, this.fileList);
    },

    // 分页
    handelCurrentPage(index) {
      this.pageIndex = index;
      this.getTwoDictionaryDataList();
    },

    // 重置搜索条件
    handleFilterReset() {
      this.name = "";
      this.city = "";
      this.region = "";
      this.searchData = "";
      this.getTwoDictionaryDataList();
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
    // 新增
    handleShopAdd(event) {
      this.dialogTitle = "新增数据字典";
      this.canEdit = false;
      this.dissolveFocus(event);
      this.dialogVisible = true;
      this.fileList = [];
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
          try {
            await deleteDictPit(item.id);
            this.$message.success("删除成功!");
            this.getTwoDictionaryDataList();
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
      this.fileList = [];
    },

    /**
     * @description: 新增或编辑数据并提交数据
     * @return {*}
     */
    handleFormConfirm() {
      this.form.type = "美食";
      this.form.level = 3;
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            this.addBtnLoading = true;
            if (Object.prototype.toString.call(this.form.city) === "[object Array]") {
              this.form.city = this.form.city.join("/");
            }
            console.log(this.form, this.fileList);
            const formData = new FormData();
            for (const key in this.form) {
              if (Object.prototype.hasOwnProperty.call(this.form, key) && this.form[key]) {
                formData.append(key, this.form[key]);
              }
            }
            console.log(formData);
            if (this.canEdit) {
              await postDictEdit(formData); this.$message.success(`编辑成功`);
            } else {
              await postDictAdd(formData); this.$message.success(`新增成功`);
            }
            this.resetForm();
            this.dialogVisible = false;
            this.canEdit = false;
            await this.getTwoDictionaryDataList();
          } catch (error) {
            this.$message.error(`操作数据失败！${error}`);
          } finally {
            this.addBtnLoading = false;
          }
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 文件上传
     * @param {*} file
     * @return {*}
     */
    handleFileChange(file, fileList) {
      if (this.$refs.uploadFile.uploadFiles.length > 1) {
        this.$refs.uploadFile.uploadFiles.shift();
      }
      const fileType = file.name.split(".").reverse()[0].toLowerCase();
      const imageList = ["png", "jpg", "jpeg", "webp"];
      if (!imageList.includes(fileType)) {
        alert("文件格式不正确");
        return false;
      } else {
        this.form.file = file.raw;
        this.fileList = fileList;
      }
    },
    /**
       * @description: 删除图片
       * @param {*} file
       * @param {*} fileList
       * @return {*}
       */
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    /**
     * @description: 图片删除确定
     * @param {*} file
     * @param {*} fileList
     * @return {*}
     */
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
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
