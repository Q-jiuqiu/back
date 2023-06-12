<!--
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-06-10 14:05:40
 * @Description: 首页
 * @FilePath: \vue-admin-template\src\views\portal\index.vue
-->
<template>
  <div class="portal-container">
    <!-- 操作按钮 -->
    <div class="operation">
      <div class="search">
        <div class="search-item">
          <div class="label">名称:</div>
          <el-input
            v-model="name"
            placeholder="搜索店铺名称"
          />
        </div>
        <div class="search-item">
          <div class="label">城市:</div>
          <el-input
            v-model="city"
            placeholder="搜索城市"
          />
        </div>
        <div class="search-item">
          <div class="label">区域:</div>
          <el-input
            v-model="region"
            placeholder="搜索区域"
          />
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
        >重置</el-button>
      </div>
      <el-button
        type="primary"
        size="medium"
        @click="handleShopAdd"
      >
        新增门店
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
        @row-click="handleRowClick"
      >
        <el-table-column
          prop="name"
          label="名称"
          header-align="center"
          align="left"
        />
        <el-table-column
          prop="province"
          label="经纬度"
          header-align="center"
          align="left"
        >
          <template slot-scope="scope">
            (
            {{ scope&&scope.row.longitude }} ,
            {{ scope&&scope.row.latitude }})
          </template>
        </el-table-column>
        <el-table-column
          prop="addr"
          label="地址"
          header-align="center"
          align="left"
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
    <!-- 新增门店 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleDialogClose"
      width="70%"
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
            label="门店名称"
            prop="name"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入门店名称"
              :disabled="!isEdit"
            />
          </el-form-item>
          <el-form-item
            label="地址"
            prop="addr"
          >
            <el-input
              v-model="form.addr"
              placeholder="请输入门店地址"
              :disabled="!isEdit"
            />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="城市"
                prop="city"
              >
                <el-input
                  v-model="form.city"
                  placeholder="请输入城市"
                  style="width: 100%;"
                  :disabled="!isEdit"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="地区"
                prop="region"
              >
                <el-input
                  v-model="form.region"
                  placeholder="请输入地区"
                  style="width: 100%;"
                  :disabled="!isEdit"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="经度"
                prop="longitude"
              >
                <el-input
                  v-model="form.longitude"
                  placeholder="请输入经度"
                  type="number"
                  :disabled="!isEdit"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="纬度"
                prop="latitude"
              >
                <el-input
                  v-model="form.latitude"
                  placeholder="请输入纬度"
                  type="number"
                  :disabled="!isEdit"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label=" 一级分类"
              >
                <el-select v-model="form.type" clearable placeholder="请选择" @change="handelSecondType">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="二级分类"
              >
                <el-select v-model="form.secondType" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="热度"
              >
                <el-input-number v-model="form.heat" :min="1" :max="5" label="热度" />
              </el-form-item>
            </el-col>
          </el-row>
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
            label="描述"
            prop="remark"
          >
            <el-input
              v-model="form.remark"
              type="textarea"
              autosize
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
import { getList, addShop, delShop, editShop, getDictFind } from "@/api";

export default {
  name: "Portal",
  data() {
    const validateLatitude = (rule, value, callback) => {
      const log = Number(value);
      if (log >= -85 && log <= 85) {
        callback();
      } else {
        callback(new Error("纬度的取值范围[-85,85]"));
      }
    };
    const validateLongitude = (rule, value, callback) => {
      const lat = Number(value);
      if (lat >= -180 && lat <= 180) {
        callback();
      } else {
        callback(new Error("经度的取值范围[-180,180]"));
      }
    };
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
        name: "",
        addr: "",
        city: "",
        region: "",
        latitude: "",
        longitude: "",
        image: [],
        remark: "",
        type: "美食",
        secondType: "",
        heat: 3
      },
      imageBase64: "", // 图片Base64编码
      rules: {
        name: [
          { required: true, message: "请输入门店名称", trigger: "blur" }
        ],
        addr: [
          { required: true, message: "请输入门店地址", trigger: "blur" }
        ],
        city: [
          { required: true, message: "请输入城市名称", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请输入地区名称", trigger: "blur" }
        ],
        longitude: [
          { required: true, message: "请输入经度", trigger: "blur" },
          { validator: validateLatitude, trigger: "blur" }
        ],
        latitude: [
          { required: true, message: "请输入纬度", trigger: "blur" },
          { validator: validateLongitude, trigger: "blur" }
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
      region: "",
      options1: [
        {
          value: "美食",
          label: "美食"
        },
        {
          value: "风景",
          label: "风景"
        }
      ],
      options2: []
    };
  },
  mounted() {
    this.initTableData();
    this.handelSecondType();
  },
  methods: {
    // 获取二级分类
    async handelSecondType() {
      this.options2 = [];
      const { data: {
        content
      }} = await getDictFind({
        pageIndex: 1,
        pageSize: 1000
      });
      content.forEach(item => {
        this.options2.push({
          value: item.name,
          label: item.name
        });
      });
    },
    async initTableData() {
      try {
        this.tableLoading = true;
        const { data } = await getList(
          {
            name: this.name,
            region: this.region,
            city: this.city
          },
          { pageIndex: 1,
            pageSize: 10
          }
        );
        console.log(data);
        this.tableData = data.content;
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
      this.region = "";
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
            await delShop(item.id);
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
              image: this.imageBase64
            };
            console.log(params);

            // 新增门店
            if (!this.canEdit) {
              await addShop(params);
            } else if (this.canEdit && this.isEdit) {
              console.log(111);
              await editShop(params);
            }
            this.resetForm();
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
