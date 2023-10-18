<template>
  <div class="addScape">
    <section>
      <el-form
        ref="addStoreForm"
        :rules="rules"
        :model="form"
        label-width="100px"
      >
        <el-row>
          <el-col :span="14"> <el-form-item
            label="景区名称"
            prop="name"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入景区名称"
              :disabled="canEdit && !isEdit "
            />
          </el-form-item></el-col>
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
            >
              <el-input
                v-model="form.addr"
                placeholder="请输入景区地址"
                :disabled="canEdit && !isEdit "
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="开放时间"
            >
              <el-input
                v-model="form.workTime"
                placeholder="请输入景区开放时间"
                :disabled="canEdit && !isEdit "
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
          <el-col :span="8">
            <el-form-item
              label="预约"
              prop="environment"
            >
              <el-input
                v-model="form.environment"
                placeholder="请输入是否需要预约"
                :disabled="canEdit && !isEdit "
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="拥挤度"
              prop="queue"
            >
              <el-input
                v-model="form.queue"
                placeholder="请输入拥挤度"
                :disabled="canEdit && !isEdit "
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="二级分类"
            >
              <el-select v-model="form.secondType" style="width: 100%;" clearable placeholder="请选择">
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
              label="门票价格"
              :disabled="canEdit && !isEdit "
            >
              <el-input v-model="form.capitaConsumption" placeholder="请输入价格" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item
              label="购票小程序ID"
              :disabled="canEdit && !isEdit "
            >
              <el-input v-model="form.region" placeholder="请输入ID号" />
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-form-item
            label="购票链接"
          >
            <el-upload
              class="upload-demo"
              action=""
              accept=".jpg,.png,.webp"
              multiple
              :limit="1"
              :file-list="fileCapitaList"
              list-type="picture"
              :auto-upload="false"
              :on-remove="handleCapitaRemove"
              :on-change="handleCapitaFileChange"
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
        </el-row>
        <el-row>
          <el-form-item
            label="图片"
          >
            <el-upload
              class="upload-demo"
              action=""
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              accept=".jpg,.png,.webp"
              multiple
              :limit="2"
              :file-list="fileList"
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
              :disabled="canEdit && !isEdit "
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
              :disabled="canEdit && !isEdit "
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
import { addShop, editShop, getCityFindPage, getFindId, postSaveImage } from "@/api";
export default {
  name: "AddScape",
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
        image: [],
        remark: "",
        type: "风景",
        secondType: "",
        heat: 100,
        workTime: "9:00-18:00",
        threeType: "",
        introduction: "",
        price: "",
        environment: "",
        queue: "",
        capitaConsumption: "",
        region: "",
        paymentCode: ""
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
      fileCapitaList: [],
      addStoreLoading: false,
      parentCity: -1,
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
  async mounted() {
    if (this.operationType === "edit") {
      const { data } = await getFindId(this.shopData.id);
      const row = data;
      const key = Object.keys(row);
      key.forEach((key) => {
        if (row[key]) {
          this.form[key] = row[key];
          if (key.includes("image")) {
            this.fileList.push({ url: row[key], name: row.name + key, id: key });
          }
          if (key.includes("paymentCode")) {
            this.fileCapitaList.push({
              url: row[key]
            });
          }
        }
      });
    }
  },
  methods: {
    /**
     * @description: 上传二维码购票
     * @return {*}
     */
    async  handleCapitaFileChange(file) {
      const fileType = file.name.split(".").reverse()[0].toLowerCase();
      const imageList = ["png", "jpg", "jpeg", "webp"];
      if (!imageList.includes(fileType)) {
        alert("文件格式不正确");
        return false;
      } else {
        const formData = new FormData();
        formData.append("file", file.raw);
        try {
          const url = await postSaveImage(formData);
          console.log(url.message);
          this.form.paymentCode = url.message;
        } catch (error) {
          console.log(error);
        }
      }
    },
    handleCapitaRemove() {
      this.fileCapitaList = [];
      this.form.paymentCode = "";
    },
    /**
     * @description:返回列表
     * @return {*}
     */
    handleBackToList() {
      this.$emit("onBackToList", true, false);
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
              } else {
                this.form[`image${index + 1}`] = item.url;
              }
            });
            this.form.city = Array.isArray(this.form.city) ? this.form.city.join("/") : this.form.city;
            const formData = new FormData();
            for (const key in this.form) {
              if (Object.prototype.hasOwnProperty.call(this.form, key) && this.form[key]) {
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
.addScape{
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
