<!--
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-08-24 20:24:51
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
        <div class="search-item">
          <div class="label">大类:</div>
          <el-select
            v-model="searchMainClass"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in mainClass"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item">
          <div class="label">小类:</div>
          <el-select
            v-model="searchSmallClass"
            clearable
            placeholder="请选择"
            loading-text="小类加载中..."
            :loading="loadingSmallClass"
            @visible-change="handelSearchSmallClassVisible"
          >
            <el-option
              v-for="item in smallClass"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item">
          <div class="label">名称:</div>
          <el-input
            v-model="searchName"
            placeholder="搜索店铺名称"
          />
        </div>
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-search"
          @click="handelSearchTableData"
        >搜索</el-button>

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
        height="calc(100% - 3rem )"
      >
        <el-table-column
          label="序号"
          type="index"
          header-align="center"
          align="center"
          width="50"
        />
        <el-table-column
          prop="name"
          label="名称"
          width="220"
          header-align="center"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="secondType"
          label="大类"
          width="100"
          header-align="center"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="threeType"
          label=" 小类"
          width="100"
          header-align="center"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="capitaConsumption"
          label="人均消费"
          width="100"
          :show-overflow-tooltip="true"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="queue"
          width="150"
          label="排队情况"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="environment"
          width="200"
          label="环境情况"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="introduction"
          label="简介"
          :show-overflow-tooltip="true"
          header-align="center"
          align="left"
        />
        <el-table-column
          label="操作"
          width="200"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.stop="handelExploreShop(scope.row)"
            >探店</el-button>
            <el-button
              type="text"
              size="small"
              @click.stop="handelRecommendAdd(scope.row)"
            >推荐</el-button>
            <el-button
              type="text"
              size="small"
              @click.stop="handlePreview(scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              size="small"
              @click.stop="handelComment(scope.row)"
            >评论</el-button>
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
        :current-page="pageIndex"
        layout="prev, pager, next"
        :total="totalElements"
        style="display: flex;
        justify-content: end;
        align-content: center;"
        @current-change="handelCurrentPage"
      />
    </div>
    <!-- 推荐菜品 -->
    <el-dialog
      width="40%"
      title="门店菜品推荐"
      :visible.sync="innerVisible"
      append-to-body
    ><Recommend :food-id="shopId" /></el-dialog>
    <!-- 探店 -->
    <el-dialog
      width="40%"
      title="探店"
      :visible.sync="exploreShopInner"
      append-to-body
    ><ExploreShop :explore-id="exploreId" /></el-dialog>
    <!-- 评论 -->
    <el-dialog
      width="40%"
      title="评论列表"
      :visible.sync="commentInner"
      append-to-body
    ><Comment :comment-id="commentId" /></el-dialog>
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

      </span>
      <div class="dialog-container">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="80px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="门店名称"
                prop="name"
              >
                <el-input
                  v-model="form.name"
                  placeholder="请输入门店名称"
                  :disabled="canEdit && !isEdit "
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="人均消费"
                prop="capitaConsumption"
              >
                <el-input
                  v-model="form.capitaConsumption"
                  placeholder="请输入人均消费"
                  :disabled="canEdit && !isEdit "
                />

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="地址"
                prop="addr"
              >
                <el-input
                  v-model="form.addr"
                  placeholder="请输入门店地址"
                  :disabled="canEdit && !isEdit "
                />

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="营业时间"
                prop="workTime"
              >

                <el-input
                  v-model="form.workTime"
                  placeholder="请输入门店营业时间"
                  :disabled="canEdit && !isEdit "
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="环境情况"
                prop="environment"
              >
                <el-input
                  v-model="form.environment"
                  placeholder="请输入环境情况"
                  :disabled="canEdit && !isEdit "
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="排队情况"
                prop="queue"
              >
                <el-input
                  v-model="form.queue"
                  placeholder="请输入排队情况"
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
                label="热度"
              >
                <el-input-number v-model="form.heat" style="width: 100%;" :min="1" :max="100" label="热度" />
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
                label="大类"
              >
                <el-select v-model="form.secondType" style="width: 100%;" clearable placeholder="请选择" @change="handelSecondTypeChange">
                  <el-option
                    v-for="item in mainClass"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="小类"
              >
                <el-select
                  v-model="form.threeType"
                  style="width: 100%;"
                  clearable
                  placeholder="请选择"
                  loading-text="小类加载中..."
                  :loading="loadingSmallClass"
                >
                  <el-option
                    v-for="item in smallClass"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
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
          >
            <el-input
              v-model="form.introduction"
              :autosize="{ minRows: 2, maxRows: 8}"
              type="textarea"
              placeholder="请输入简介信息"
              :disabled="canEdit && !isEdit "
            />
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
import Recommend from "@/views/portal/recommend.vue";
import Comment from "@/views/portal/comment.vue";
import ExploreShop from "@/views/portal/exploreShop.vue";

export default {
  name: "Portal",
  components: { Recommend, ExploreShop, Comment },
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
        city: [],
        latitude: "",
        longitude: "",
        image: [],
        remark: "",
        type: "美食",
        secondType: "",
        threeType: "",
        heat: 100,
        workTime: "9:00-22:00",
        introduction: "",
        environment: "",
        queue: "",
        capitaConsumption: ""
      },
      imageBase64: "", // 图片Base64编码
      rules: {
        name: [
          { required: true, message: "请输入门店名称", trigger: "blur" }
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
      addBtnLoading: false, // 添加门店loading
      tableLoading: false, // 表格loading
      changeImage: false, // 是否展示修改图片按钮
      searchName: "", // 搜索关键字
      city: "",
      totalElements: 0,
      pageIndex: 1,
      pageCurrent: 1,
      pageSize: 5,
      mainClass: [],
      smallClass: [],
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
          resolve(outputData);
        }
      },
      searchSmallClass: "",
      searchMainClass: "",
      environment: "",
      queue: "",
      introduction: "",
      loadingSmallClass: false,
      shopId: "",
      innerVisible: false,
      exploreId: "",
      commentId: "",
      exploreShopInner: false,
      commentInner: false
    };
  },
  watch: {

  },
  mounted() {
    this.initTableData({
      type: this.form.type
    });
    this.getFilterCityListData(this.parentCity);
    this.handelSearchSecondType();
  },
  methods: {
    /**
     * @description:评论
     * @return {*}
     */
    handelComment(row) {
      console.log(row);
      this.commentId = row.id;
      this.commentInner = true;
    },
    /**
     * @description: 探店新增
     * @return {*}
     */
    handelExploreShop(row) {
      console.log(row);
      this.exploreId = row.id;
      this.exploreShopInner = true;
    },
    /**
     * @description: 推荐新增
     * @return {*}
     */
    handelRecommendAdd(row) {
      this.shopId = row.id;
      this.innerVisible = true;
    },
    /**
     * @description: 初始化数据
     * @return {*} 美食列表请求参数
     */
    async initTableData(res) {
      try {
        this.tableLoading = true;
        const { data } = await getList(
          res,
          { pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        );
        this.tableData = data.content;
        this.totalElements = data.totalElements;
      } catch (error) {
        this.$message.error("获取数据失败");
      } finally {
        this.tableLoading = false;
      }
    },
    /**
     * @description: 城市数据
     * @return {*} -1代表城市的第一级
     */
    async getFilterCityListData(parentCity) {
      const { data } = await getCityFindPage(parentCity);
      function convertData(data) {
        return data.map(item => ({
          value: item.city,
          label: item.city,
          id: item.id,
          children: item.childs ? convertData(item.childs) : []
        }));
      }
      this.filterCityList = convertData(data);
    },

    /**
     * @description:查询大类
     * @return {*}
     */
    async handelSearchSecondType() {
      this.mainClass = [];
      const page = {
        pageIndex: 1,
        pageSize: 1000
      };
      const param = {
        type: "美食",
        level: 2
      };
      const { data: {
        content
      }} = await getDictFind(page, param);
      content.forEach(item => {
        this.mainClass.push({
          value: item.name,
          label: item.name
        });
      });
    },
    /**
     * @description: 搜索数据
     * @return {*}
     */
    async handelSearchTableData() {
      const res = {
        city: this.searchCityData ? this.searchCityData[ this.searchCityData.length - 1] : "",
        name: this.searchName,
        type: "美食",
        secondType: this.searchMainClass,
        threeType: this.searchSmallClass
      };
      function filterNonEmptyValues(obj) {
        const nonEmptyProperties = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== "" || value) {
            nonEmptyProperties[key] = value;
          }
        }
        return nonEmptyProperties;
      }
      const nonEmptyValues = filterNonEmptyValues(res);
      this.initTableData(nonEmptyValues);
    },
    /**
     * @description: 触发小类筛选
     * @return {*}
     */
    handelSearchSmallClassVisible(condition) {
      if (!this.searchMainClass) {
        this.$message.info("未选择大类信息，无法查询小类信息");
        return;
      }
      if (condition) {
        this.handelSecondTypeChange(this.searchMainClass, this.searchCityData);
      } else {
        this.smallClass = [];
      }
    },
    /**
     * @description: 通过大类查询小类信息列表
     * @param {*} value
     * @return {*}
     */
    async handelSecondTypeChange(value, cityArray = this.form.city.split("/")) {
      const city = cityArray.length > 2 ? cityArray[cityArray.length - 2] : cityArray[cityArray.length - 1];
      this.loadingSmallClass = true;
      this.smallClass = [];
      const page = {
        pageIndex: 1,
        pageSize: 1000
      };
      const param = {
        type: "美食",
        parentName: value,
        city: city,
        level: 3
      };
      try {
        const { data: {
          content
        }} = await getDictFind(page, param);
        content.forEach(item => {
          this.smallClass.push({
            value: item.name,
            label: item.name
          });
        });
      } catch (error) {
        this.$message.error("获取数据失败");
      } finally {
        this.loadingSmallClass = false;
      }
    },

    /**
     * @description: 分页
     * @param {*} index
     * @return {*}
     */
    handelCurrentPage(index) {
      this.pageIndex = index;
      this.initTableData({
        type: this.form.type
      });
    },
    /**
     * @description: 增加门店-打开对话框
     * @return {*}
     */
    handleShopAdd() {
      this.dialogTitle = "新增门店";
      this.isEdit = false;
      this.canEdit = false;
      this.dialogVisible = true;
    },
    /**
     * @description: 编辑
     * @param {*} row
     * @return {*}
     */
    async handleEdit(row) {
      this.dialogTitle = "编辑门店信息";
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
    },
    /**
     * @description: 提交新增或者编辑表单
     * @return {*}
     */
    handleFormConfirm() {
      // 查看并且没有编辑
      if (this.canEdit && !this.isEdit) {
        this.dialogVisible = false;
        return;
      }
      this.form.type = "美食";
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
            this.initTableData({
              type: "美食"
            });
          } catch (error) {
            if (!this.canEdit) {
              this.$message.error(`新增失败${error}`);
            } else if (this.canEdit && this.isEdit) {
              this.$message.error(`修改失败${error}`);
            }
          } finally {
            this.addBtnLoading = false;
          }
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 关闭对话
     * @param {*} done
     * @return {*}
     */
    handleDialogClose(done) {
      if (this.addBtnLoading) {
        this.$message.info("正在增加数据……");
        return;
      }
      this.resetForm();
      this.canEdit = false;
      done();
    },
    /**
     * @description: 删除门店
     * @param {*} item
     * @return {*}
     */
    handleShopDel(item) {
      this.$confirm("此操作将永久删除选中门店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          try {
            await delShop(item.id);
            this.$message.success("删除成功!");
            this.initTableData({
              type: this.form.type
            });
          } catch (error) {
            this.$message.error(`删除失败${error}`);
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

    // 重置表单
    resetForm() {
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(this.form, key)) {
          this.form[key] = "";
        }
      }
      this.imageBase64 = "";
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
