<!--
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-07-31 22:48:37
 * @Description: 首页
 * @FilePath: \vue-admin-template\src\views\portal\index.vue
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
        新增城市简介
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
        row-key="id"

        lazy
        :load="handelLoadClick"
        :tree-props="{children: 'childs', hasChildren: 'hasChildren'}"
        @row-click="handleRowClick"
      >

        <el-table-column
          prop="city"
          label="城市"
          header-align="center"
          align="left"
          width="500"
        />
        <el-table-column
          prop="remark"
          label="简介"
          header-align="center"
          align="left"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="操作"
          width="230"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.stop="handleNewAddCity(scope.row)"
            > 新增</el-button>
            <el-button
              type="text"
              size="small"
              @click.stop="handlePreview(scope.row)"
            >查看</el-button>
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

    </div>
    <!-- 新增城市推荐 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleDialogClose"
    >
      <span
        slot="title"
        class="dialog-title"
      >
        {{ dialogTitle }}
        <i
          v-if="canEdit"
          class="icon el-icon-edit"
          @click="handleFormEdit"
        />
      </span>
      <div class="dialog-container">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="80px"
        >
          <el-form-item
            label="城市"
            prop="city"
          >
            <el-input
              v-model="form.city"
              placeholder="请输入城市"
            />
          </el-form-item>

          <el-form-item
            label="图片"
          >
            <el-upload
              v-if="!imageBase64"
              class="upload-demo"
              action=""
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              accept=".jpg,.png"
              multiple
              :limit="5"
              :file-list="form.images"
              list-type="picture"
              :auto-upload="false"
              :on-change="handleFileChange"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
              >
                只能上传jpg/png文件，且不超过2M</div>
            </el-upload>
            <div v-else>
              <div v-for="(item,index) in form.images" :key="index">
                <img
                  class="image"
                  :src="item.item"
                  alt="城市照片"
                >
                <i
                  v-if="isEdit"
                  class="el-icon-refresh"
                  title="修改图片"
                  @click="handleChangeImage"
                /></div>

            </div>
          </el-form-item>
          <el-form-item
            label="简介"
            prop="remark"
          >
            <el-input
              v-model="form.remark"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="请输入描述信息"
              :disabled="!isEdit"
            />
          </el-form-item>
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
import { postCityDict, getCityFind, deleteCityDict, postCityEdit, getCityFindPage } from "@/api";

export default {
  name: "Recommend",
  data() {
    return {
      tableData: [],
      delLoading: false,
      dialogVisible: false, // 对话框显隐
      dialogTitle: "新增城市",
      dialogImageUrl: "", // 图片预览地址
      hasImg: false, // 是否有图片
      picture: null, // 图片-文件
      canEdit: false, // 能否编辑 是否显示编辑图标
      isEdit: true, // 是否编辑
      form: {
        images: [],
        remark: "",
        city: ""
      },
      imageBase64: "", // 图片Base64编码
      rules: {
        remark: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ],
        city: [
          { required: true, message: "请输入城市", trigger: "blur" }
        ]
      },
      addBtnLoading: false, // 添加城市loading
      tableLoading: false, // 表格loading
      changeImage: false, // 是否展示修改图片按钮
      // 搜索关键字
      city: "成都市",
      cityOption: [],
      searchCityData: [],
      filterCityList: [],
      parentCity: -1, // 父级城市id
      props: {
        lazy: true,
        async lazyLoad(node, resolve) {
          let id;
          if (node.data?.id) {
            id = node.data.id;
          } else {
            id = -1;
          }
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
          console.log(outputData);
          resolve(outputData);
        } }
    };
  },
  mounted() {
    this.initTableData();
  },
  methods: {
    // 搜索数据
    async handelSearchTableData() {
      const data = await getCityFind(this.searchCityData[ this.searchCityData.length - 1]);
      this.tableData = data;
    },
    /* 城市数据 */
    getFilterCityListData(data) {
      return data.map(item => ({
        value: item.city,
        id: item.id,
        label: item.city,
        level: item.level
      }));
    },
    // 查询描述列表
    async initTableData() {
      try {
        this.tableLoading = true;
        const { data } = await getCityFindPage(this.parentCity);
        const newData = data.map(item => ({ ...item, hasChildren: true }));
        this.tableData = newData;

        const outputData = this.getFilterCityListData(data);
        this.filterCityList = outputData;
      } catch (error) {
        this.$message.warning("获取数据失败");
      } finally {
        this.tableLoading = false;
      }
    },
    // 查询下级
    async handelLoadClick(tree, treeNode, resolve) {
      const { data } = await getCityFindPage(tree.id);
      const newData = data.map(item => {
        if (item.level !== "3") {
          return ({ ...item, hasChildren: true });
        } else {
          return { ...item };
        }
      });
      console.log(data, newData);
      resolve(newData);
    },
    // 新增城市下级
    async handleNewAddCity(row) {
      console.log(row);
      this.dialogVisible = true;
      this.parentCity = row.id;
    },
    // 重置搜索条件
    handleFilterReset() {
      this.name = "";
      this.city = "";
      this.type = "";
      this.initTableData();
    },
    // 点击表格行
    handleRowClick(row) {
      console.log(row);
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
    // 增加城市-打开对话框
    handleShopAdd(event) {
      this.dialogTitle = "新增城市";
      this.isEdit = true;
      this.dissolveFocus(event);
      this.form.images = [];
      this.dialogVisible = true;
      this.parentCity = -1;
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
    // 删除城市
    handleShopDel(item) {
      this.$confirm("此操作将永久删除选中城市, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          try {
            await deleteCityDict(item.id);
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
    // 查看
    handlePreview(row) {
      this.dialogTitle = "查看城市信息";
      this.canEdit = true;
      this.isEdit = false;
      this.dialogVisible = true;
      const key = Object.keys(row);
      key.forEach((key) => {
        if (key.includes("image")) {
          if (row[key]) {
            this.form.images.push({ url: row[key] });
          }
        }
      });
      this.form.city = row.city;
      this.form.id = row.id;
      this.form.remark = row.remark;
    },
    // 编辑
    handleEdit(row) {
      console.log(row);
      this.dialogTitle = "编辑城市信息";
      this.isEdit = true;
      this.canEdit = true;
      this.dialogVisible = true;
      const key = Object.keys(row);
      key.forEach((key) => {
        if (key.includes("image")) {
          if (row[key]) {
            console.log(this.form.images);
            this.form.images.push({ url: row[key] });
          }
        }
      });
      this.form.city = row.city;
      this.form.id = row.id;
      this.form.remark = row.remark;
      this.form.parentCity = row.parentCity;
    },
    // 编辑
    handleFormEdit() {
      this.dialogTitle = "编辑城市信息";
      this.isEdit = true;
    },
    // 重置表单
    resetForm() {
      this.form = {
        images: [],
        remark: "",
        city: ""
      };
    },
    // 提交表单
    handleFormConfirm() {
      // 查看并且没有编辑
      if (this.canEdit && !this.isEdit) {
        this.dialogVisible = false;
        return;
      }
      this.form.images.forEach((item, index) => {
        this.form[`image${index + 1}`] = item.url;
      });
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            this.addBtnLoading = true;

            // 新增城市
            if (!this.canEdit) {
              const params = {
                ...this.form,
                parentCity: this.parentCity
              };
              await postCityDict(params);
              this.resetForm();
            } else if (this.canEdit && this.isEdit) {
              const params = {
                ...this.form
              };
              await postCityEdit(params);
            }
            this.dialogVisible = false;
            await this.initTableData();
          } catch (error) {
            if (!this.canEdit) {
              this.$message.warning(`新增失败`);
            } else if (this.canEdit && this.isEdit) {
              this.$message.warning(`修改失败`);
            }
          } finally {
            this.addBtnLoading = false;
          }
        } else {
          return false;
        }
      });
    },
    // 文件选中
    handleFileChange(file) {
      // 检验选择文件格式
      const fileType = file.name.split(".").reverse()[0].toLowerCase();
      const imageList = ["png", "gif", "jpg", "jpeg"];// 图片文件格式列表
      if (!imageList.includes(fileType)) {
        alert("文件格式不正确");
        return false;
      }
      // 创建文件读取实例
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file.raw);
      fileReader.onload = (e, index) => {
        this.$refs.form.validate();
        this.form.images.push({
          name: `image${index}`,
          url: e.target.result
        });
      };
      console.log(this.form.images);
    },

    handleRemove(file, fileList) {
      this.form.images = fileList;
    },
    beforeRemove() {
      return this.$confirm(`确定移除？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      });
    },
    // 修改图片
    handleChangeImage() {
      this.imageBase64 = "";
      this.form.images = [];
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
