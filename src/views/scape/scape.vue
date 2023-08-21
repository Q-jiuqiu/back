<!--
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-08-01 19:12:56
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
        新增景区
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
          prop="secondType"
          label="分类"
          width="100"
          header-align="center"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="name"
          label="名称"
          header-align="center"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="province"
          width="180"
          label="经纬度"
          header-align="center"
          align="center"
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
          :show-overflow-tooltip="true"
          header-align="center"
          align="left"
        />
        <el-table-column
          prop="remark"
          label="描述"
          :show-overflow-tooltip="true"
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
    <!-- 新增景区 -->
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

      </span>
      <div class="dialog-container">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="80px"
        >
          <el-form-item
            label="景区名称"
            prop="name"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入景区名称"
              :disabled="canEdit && !isEdit "
            />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="地址"
              >
                <el-input
                  v-model="form.addr"
                  placeholder="请输入景区地址"
                  :disabled="canEdit && !isEdit "
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="营业时间"
              >

                <el-input
                  v-model="form.workTime"
                  placeholder="请输入景区营业时间"
                  :disabled="canEdit && !isEdit "
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
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
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="景区等级"
              >
                <el-input
                  v-model="form.threeType"
                  style="width: 100%;"
                  placeholder="请输入景区等级"
                  :disabled="canEdit && !isEdit "
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
                  :disabled="canEdit && !isEdit "
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
                  :disabled="canEdit && !isEdit "
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="二级分类"
              >
                <el-select v-model="form.secondType" style="width: 100%;" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="热度"
                :disabled="canEdit && !isEdit "
              >
                <el-input-number v-model="form.heat" style="width: 100%;" :min="1" :max="100" label="热度" />
              </el-form-item>
            </el-col>

          </el-row>
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
                alt="景区照片"
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
          >
            <el-input
              v-model="form.remark"
              :autosize="{ minRows: 4, maxRows: 8}"
              type="textarea"
              placeholder="请输入描述信息"
              :disabled="canEdit && !isEdit "
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
import { getList, addShop, delShop, editShop, getDictFind, getCityFindPage } from "@/api";

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
      dialogTitle: "新增景区",
      dialogImageUrl: "", // 图片预览地址
      hasImg: false, // 是否有图片
      picture: null, // 图片-文件
      canEdit: false, // 能否编辑 是否显示编辑图标
      isEdit: true, // 是否编辑
      form: {
        name: "",
        addr: "",
        city: "",
        latitude: "",
        longitude: "",
        image: [],
        remark: "",
        type: "风景",
        secondType: "",
        heat: 100,
        workTime: "9:00-18:00",
        threeType: ""
      },
      imageBase64: "", // 图片Base64编码
      rules: {
        name: [
          { required: true, message: "请输入景区名称", trigger: "blur" }
        ],
        city: [
          { required: true, message: "请输入城市名称", trigger: "blur" }
        ],
        longitude: [
          { required: true, message: "请输入经度", trigger: "blur" },
          { validator: validateLongitude, trigger: "blur" }
        ],
        latitude: [
          { required: true, message: "请输入纬度", trigger: "blur" },
          { validator: validateLatitude, trigger: "blur" }
        ]
      },
      addBtnLoading: false, // 添加景区loading
      tableLoading: false, // 表格loading
      changeImage: false, // 是否展示修改图片按钮
      // 搜索关键字
      name: "",
      city: "",
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
      totalElements: 0,
      pageIndex: 1,
      pageSize: 10,
      options2: [],
      filterCityList: [],
      searchCityData: [],
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
          console.log(outputData);
          resolve(outputData);
        } }
    };
  },
  mounted() {
    this.initTableData();
    this.handelSecondType();
    this.getFilterCityListData();
  },
  methods: {
    /* 搜索数据 */
    async  handelSearchTableData() {
      try {
        this.tableLoading = true;
        const res = {
          type: "风景"
        };
        if (this.name !== null && this.name !== "") {
          res.name = this.name;
        }
        if (this.searchCityData.length) {
          res.city = this.searchCityData[ this.searchCityData.length - 1];
        }
        const { data } = await getList(
          res,
          { pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        );

        this.tableData = data.content;
        this.totalElements = data.totalElements;
      } catch (error) {
        this.$message.warning("获取数据失败");
      } finally {
        this.tableLoading = false;
      }
    },
    /* 城市数据 */
    async  getFilterCityListData() {
      const { data } = await getCityFindPage(this.parentCity);
      function convertData(data) {
        return data.map(item => ({
          value: item.city,
          label: item.city,
          id: item.id,
          children: item.childs ? convertData(item.childs) : []
        }));
      }

      const outputData = convertData(data);
      console.log(outputData);
      this.filterCityList = outputData;
    },
    // 获取二级分类
    async handelSecondType() {
      this.options2 = [];
      const { data: {
        content
      }} = await getDictFind({
        pageIndex: 1,
        pageSize: 1000
      }, { type: "风景",
        level: 2 });
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
        const res = {
          type: "风景"
        };
        if (this.name !== null && this.name !== "") {
          res.name = this.name;
        }
        if (this.city !== null && this.city !== "") {
          res.city = this.city;
        }
        if (this.region !== null && this.region !== "") {
          res.region = this.region;
        }
        const { data } = await getList(
          res,
          { pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        );
        console.log(data);
        this.totalElements = data.totalElements;
        this.tableData = data.content;
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
    // 增加景区-打开对话框
    handleShopAdd(event) {
      this.isEdit = false;
      this.canEdit = false;
      this.dissolveFocus(event);
      this.dialogVisible = true;
      this.dialogTitle = "新增景区";
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
    // 删除景区
    handleShopDel(item) {
      this.$confirm("此操作将永久删除选中景区, 是否继续?", "提示", {
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
          this.form.image = [];
        } else {
          this.form[key] = row[key];
        }
      });
    },
    // 编辑
    async  handleEdit(row) {
      console.log(row);
      this.dialogTitle = "编辑景区信息";
      this.isEdit = true;
      this.canEdit = false;
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
      const page = {
        pageIndex: 1,
        pageSize: 1000
      };
      const param = {
        type: "风景",
        parentName: this.form.secondType,
        level: 3
      };
      const { data: {
        content
      }} = await getDictFind(page, param);
      content.forEach(item => {
        this.options3.push({
          value: item.name,
          label: item.name
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
      // 查看并且没有编辑
      if (this.canEdit && !this.isEdit) {
        this.dialogVisible = false;
        return;
      }
      this.form.type = "风景";
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            this.addBtnLoading = true;
            this.form.city = this.form.city.join("/");
            const params = {
              ...this.form,
              image: this.imageBase64
            };
            if (!this.canEdit && !this.isEdit) {
              await addShop(params);
            } else if (!this.canEdit && this.isEdit) {
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
    /*   console.log(this.canEdit, this.isEdit);
      // 查看并且没有编辑
      if (this.canEdit && !this.isEdit) {
        this.dialogVisible = false;
        return;
      }
      this.form.type = "风景";
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            this.addBtnLoading = true;
            this.form.city = this.form.city.join("/");
            const params = {
              ...this.form,
              image: this.imageBase64
            };

            // 新增门店
            if (!this.canEdit && !this.isEdit) {
              await addShop(params);
            } else if (!this.canEdit && this.isEdit) {
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
      }); */
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
