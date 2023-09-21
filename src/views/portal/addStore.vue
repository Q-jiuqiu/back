<!--
 * @Author: 何元鹏
 * @Date: 2023-09-20 22:17:48
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-21 16:58:48
-->
<template>
  <div class="addStore">
    <section>
      <el-form
        ref="addStoreForm"
        v-loading="addStoreLoading"
        :rules="rules"
        :model="form"
        label-width="120px"
      >
        <el-row>
          <el-col :span="14">
            <el-form-item
              label="门店名称"
              prop="name"
            >
              <el-input
                v-model="form.name"
                placeholder="请输入门店名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="所属城市"
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
          <el-col :span="8">
            <el-form-item
              label="详细地址"
              prop="addr"
            >
              <el-input
                v-model="form.addr"
                placeholder="请输入门店地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="营业时间"
              prop="workTime"
            >

              <el-input
                v-model="form.workTime"
                placeholder="请输入门店营业时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="经度"
              prop="longitude"
            >
              <el-input
                v-model="form.longitude"
                placeholder="请输入经度"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="纬度"
              prop="latitude"
            >
              <el-input
                v-model="form.latitude"
                placeholder="请输入纬度"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="热度"
            >
              <el-input-number v-model="form.heat" style="width: 100%;" :min="1" :max="100" label="热度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="人均消费"
            >
              <el-input
                v-model="form.capitaConsumption"
                placeholder="请输入人均消费"
              />

            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="卫生度"
              prop="queue"
            >
              <el-input
                v-model="form.queue"
                placeholder="请输入卫生度"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="拥挤度"
              prop="environment"
            >
              <el-input
                v-model="form.environment"
                placeholder="请输入拥挤度"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="一级分类"
            >
              <el-select v-model="form.secondType" style="width: 100%;" clearable placeholder="请选择" @change="handelSecondTypeChange">
                <el-option
                  v-for="(item,index) in firstClass"
                  :key="index"
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
              <el-select
                v-model="form.threeType"
                style="width: 100%;"
                clearable
                placeholder="请选择"
                loading-text="小类加载中..."
                no-data-text="暂无数据"
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
          <el-col :span="8">
            <el-form-item
              label="探店主播"
            >
              <el-select
                v-model="form.threeType"
                style="width: 100%;"
                clearable
                placeholder="请选择"
                loading-text="小类加载中..."
                no-data-text="暂无数据"
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
        <el-row>
          <el-form-item
            label="图片"
          >
            <el-upload
              class="upload-demo"
              action=""
              accept=".jpg,.png,.webp"
              multiple
              :limit="2"
              :file-list="fileList"
              list-type="picture"
              :auto-upload="false"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
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
                只能上传jpg/png/webp文件，且不超过2M</div>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="简介"
          >
            <el-input
              v-model="form.introduction"
              :autosize="{ minRows: 2, maxRows: 8}"
              type="textarea"
              placeholder="请输入简介信息"
            />
          </el-form-item>
          <el-form-item
            label="描述"
          >
            <el-input
              v-model="form.remark"
              :autosize="{ minRows: 4, maxRows: 20}"
              type="textarea"
              placeholder="请输入描述信息"
            />
          </el-form-item>
        </el-row>
      </el-form>
    </section>
    <footer>
      <el-button
        size="medium"
        @click="handleBackToList"
      >
        返回列表
      </el-button>
      <el-button
        type="primary"
        size="medium"
        @click="handleFormConfirm"
      >
        确定
      </el-button>
    </footer>
  </div>
</template>

<script>
import { addShop, editShop, getDictFind, getCityFindPage } from "@/api";
export default {
  name: "AddStore",
  components: { },
  props: {
    filterCityList: {
      type: Array,
      default: () => []
    },
    firstClass: {
      type: Array,
      default: () => []
    },
    operationType: {
      type: String,
      default: () => "add"
    },
    shopData: {
      type: Object,
      default: () => {}
    }
  },
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
      form: {
        name: "",
        addr: "",
        city: "成都市",
        latitude: "",
        longitude: "",
        remark: "",
        type: "美食",
        secondType: "",
        threeType: "",
        heat: 100,
        workTime: "9:00-22:00",
        introduction: "",
        environment: "",
        queue: "",
        capitaConsumption: "",
        exps: []
      },
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
      fileList: [],
      addStoreLoading: false,
      parentCity: -1,
      smallClass: [],
      loadingSmallClass: false,
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
      }
    };
  },
  computed: {},
  watch: {},
  mounted() {
    if (this.operationType === "edit") {
      const row = this.shopData;
      const key = Object.keys(row);
      key.forEach((key) => {
        if (key.includes("image") && row[key]) {
          this.fileList.push({ url: row[key], name: row.name + key, id: key });
        }
        this.form[key] = row[key];
      });
    }
  },
  methods: {
    /**
     * @description:返回列表
     * @return {*}
     */
    handleBackToList() {
      this.$emit("onBackToList", true, false);
    },
    /**
     * @description: 通过大类查询小类信息列表
     * @param {*} value
     * @return {*}
     */
    async handelSecondTypeChange(value, cityArray = this.form.city) {
      if (Object.prototype.toString.call(cityArray) === "[object String]") {
        cityArray = this.form.city.split("/");
      }
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
        if (content.length) {
          content.forEach(item => {
            this.smallClass.push({
              value: item.name,
              label: item.name
            });
          });
        } else {
          this.smallClass = [];
        }
      } catch (error) {
        this.$message.error("获取数据失败");
      } finally {
        this.loadingSmallClass = false;
      }
    },
    /**
     * @description: 提交新增或者编辑表单
     * @return {*}
     */
    handleFormConfirm() {
      this.$refs.addStoreForm.validate(async(valid) => {
        if (valid) {
          this.addStoreLoading = true;
          try {
            this.fileList.forEach((item, index) => {
              if (item.raw) {
                this.form[`file${index + 1}`] = item.raw;
              }
            });
            console.log(this.form);
            this.form.city = Array.isArray(this.form.city) ? this.form.city.join("/") : this.form.city;
            const formData = new FormData();
            for (const key in this.form) {
              if (Object.prototype.hasOwnProperty.call(this.form, key)) {
                formData.append(key, this.form[key]);
              }
            }
            console.log(formData);
            if (this.operationType === "edit") {
              await editShop(formData);
              this.$message.success(`编辑成功`);
              this.$emit("onBackToList", true, true);
            } else {
              await addShop(formData);
              this.$message.success(`新增成功`);
              this.$emit("onBackToList", true, true);
            }
          } catch (error) {
            if (this.operationType === "edit") {
              this.$message.error(`编辑失败${error}`);
            } else {
              this.$message.error(`新增失败${error}`);
            }
          } finally {
            this.addStoreLoading = false;
          }
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 上传文件
     * @param {*} file
     * @param {*} fileList
     * @return {*}
     */
    handleFileChange(file, fileList) {
      const fileType = file.name.split(".").reverse()[0].toLowerCase();
      const imageList = ["png", "jpg", "jpeg", "webp"];
      if (!imageList.includes(fileType)) {
        alert("文件格式不正确");
        return false;
      } else {
        console.log(fileList);
        this.fileList = fileList;
      }
    },
    /**
     * @description: 删除文件
     * @param {*} file
     * @param {*} fileList
     * @return {*}
     */
    handleRemove(file, fileList) {
      console.log(file.id, fileList);
      this.fileList = fileList;
      delete this.form[file.id];
    },
    /**
     * @description: 删除前
     * @param {*} file
     * @param {*} fileList
     * @return {*}
     */
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      });
    }

  }
};
</script>

<style scoped lang="scss">
.addStore{
  position: relative;
  width: 100%;
  height: 100%;
  section{
    width: 100%;
    height: calc(100% - 3rem);
    padding:20px;
    overflow: hidden;
    overflow-y:auto ;
  }
  footer{
    display: flex;
    width: 100%;
    height: 3rem;
    justify-content: flex-end;
    align-items: center;
    padding-right: 1rem;
  }
}
</style>
