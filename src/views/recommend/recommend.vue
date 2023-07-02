<!--
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-07-01 23:33:55
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
          <el-select v-model="city" placeholder="请选择" @change="handelCityChange">
            <el-option
              v-for="item in cityOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item">
          <div class="label">类型:</div>
          <el-select v-model="type" placeholder="请选择" @change="handelTypeChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item">
          <div class="label">名称:</div>
          <el-select v-model="form.name" filterable placeholder="请选择" @change="handelNameChange">
            <el-option
              v-for="item in nameOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-search"
          @click="initTableData"
        >筛选</el-button>
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
        新增门店推荐
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table
        ref="Table"
        v-loading="tableLoading"
        :data="tableData"
        border
        height="100%"
        empty-text="请先选择筛选条件"
        @row-click="handleRowClick"
      >

        <el-table-column
          prop="foodName"
          label="推荐菜单"
          header-align="center"
          align="left"
        />

        <el-table-column
          prop="describe"
          label="简介"
          header-align="center"
          align="left"
          :show-overflow-tooltip="true"
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
    <!-- 新增门店推荐 -->
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
            label="推荐名"
            prop="foodName"
          >
            <el-input
              v-model="form.foodName"
              placeholder="请输入推荐名"
              :disabled="!isEdit"
            />
          </el-form-item>

          <el-form-item
            label="图片"
            prop="image"
          >
            <el-upload
              v-if="!imageBase64"
              class="upload-demo"
              action=""
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              accept=".jpg,.png"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="form.image"
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

              <img
                class="image"
                :src="imageBase64"
                alt="门店照片"
              >
              <i
                v-if="isEdit"
                class="el-icon-refresh"
                title="修改图片"
                @click="handleChangeImage"
              />
            </div>
          </el-form-item>
          <el-form-item
            label="简介"
            prop="describe"
          >
            <el-input
              v-model="form.describe"
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
import { postRecommendAdd, deleteRecommend, postRecommendEdit, getRecommendFind, getTypeCityFind, getList } from "@/api";

export default {
  name: "Recommend",
  data() {
    return {
      tableData: [],
      delLoading: false,
      dialogVisible: false, // 对话框显隐
      dialogTitle: "新增门店",
      dialogImageUrl: "", // 图片预览地址
      hasImg: false, // 是否有图片
      picture: null, // 图片-文件
      canEdit: false, // 能否编辑 是否显示编辑图标
      isEdit: true, // 是否编辑
      form: {
        foodName: "",
        image: [],
        describe: "",
        foodId: "",
        name: "",
        city: "",
        type: ""
      },
      imageBase64: "", // 图片Base64编码
      rules: {
        foodName: [
          { required: true, message: "请输入推荐名称", trigger: "blur" }
        ],
        describe: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ],
        image: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ]

      },
      addBtnLoading: false, // 添加门店loading
      tableLoading: false, // 表格loading
      changeImage: false, // 是否展示修改图片按钮
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
        { pageIndex: 1,
          pageSize: 10000
        }
      );
      this.form.name = data.content[0].id;
      this.nameOptions = data.content;
      this.initTableData();
    },
    handelNameChange(value) {
      console.log(value);
      this.form.name = value;
      this.initTableData();
    },
    // 查询描述列表
    async initTableData(id = this.form.name) {
      try {
        this.tableLoading = true;
        const { data } = await getRecommendFind(
          this.form.name
        );
        console.log(data);
        this.tableData = data;
      } catch (error) {
        this.$message.warning("获取数据失败");
      } finally {
        this.tableLoading = false;
      }
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
    // 增加门店-打开对话框
    handleShopAdd(event) {
      this.dialogTitle = "新增门店";
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
            await deleteRecommend(item.id);
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
      this.dialogTitle = "查看门店信息";
      this.canEdit = true;
      this.isEdit = false;
      this.dialogVisible = true;
      const key = Object.keys(row);
      key.forEach((key) => {
        if (key === "image") {
          this.imageBase64 = row[key];
          this.form.image = [{ name: "图片" }];
        } else {
          this.form[key] = row[key];
        }
      });
    },
    handleEdit(row) {
      this.dialogTitle = "编辑门店信息";
      this.isEdit = true;
      this.canEdit = true;
      this.dialogVisible = true;
      const key = Object.keys(row);
      key.forEach((key) => {
        if (key === "image") {
          this.imageBase64 = row[key];
          this.form.image = [{ name: "图片" }];
        } else {
          this.form[key] = row[key];
        }
      });
    },
    // 编辑
    handleFormEdit() {
      this.dialogTitle = "编辑门店信息";
      this.isEdit = true;
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
      console.log(this.canEdit, this.isEdit);
      // 查看并且没有编辑
      if (this.canEdit && !this.isEdit) {
        this.dialogVisible = false;
        return;
      }
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            this.addBtnLoading = true;
            const params = {
              ...this.form,
              image: this.imageBase64,
              foodId: this.form.name
            };
            console.log(params);
            // 新增门店
            if (!this.canEdit) {
              await postRecommendAdd([params]);
            } else if (this.canEdit && this.isEdit) {
              console.log(111);
              await postRecommendEdit(params);
            }

            await this.initTableData(this.form.name);
            this.resetForm();
            this.dialogVisible = false;
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
      console.log(file);
      this.form.image = [file];
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
      fileReader.onload = (e) => {
        this.imageBase64 = e.target.result; // 获取base64字符串
        this.$refs.form.validate();
      };
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.form.image = [];
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      });
    },
    // 修改图片
    handleChangeImage() {
      this.imageBase64 = "";
      this.form.image = [];
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
