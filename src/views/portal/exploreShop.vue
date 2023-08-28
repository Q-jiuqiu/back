<!--
 * @Author: 何元鹏
 * @Date: 2023-08-23 20:46:14
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-08-27 11:36:08
-->
<template>
  <div v-loading="recommendedDataListLoading" class="recommend-list">
    <el-row v-for="(item,index) in exploreDataList" :key="index" style="padding: 0.8rem 0.5rem;">
      <el-col :span="6">
        <el-image
          class="recommend-list-image"
          :src="item.headSculpture"
          fit="fill"
        />
      </el-col>
      <el-col :span="17">
        <div class="recommend-list-center">
          <span class="title">{{ item.name }}</span>
          <div class="text">
            <span class="text-center">{{ item.comment }}</span>
            <span class="text-button">
              <el-button type="text" size="small" class="button" @click="handelRecommendedEditor(item)">编辑</el-button>
              <el-button type="text" size="small" class="button" @click="handelRecommendedDelete(item)">删除</el-button>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
    <span
      slot="footer"
      class="dialog-footer"
    >

      <el-button
        type="primary"
        size="medium"
        @click="handelRecommendedAdd"
      >
        新增
      </el-button>
    </span>
    <el-dialog
      width="30%"
      title="探店"
      :visible.sync="dataFormIs"
      append-to-body
    >
      <div class="recommend-add">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="80px"
        >
          <el-form-item
            label="探店主播"
            prop="name"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入探店主播"
            />
          </el-form-item>

          <el-form-item
            label="图片"
            prop="headSculpture"
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
              :file-list="form.headSculpture"
              :auto-upload="false"
              :on-change="handleFileChange"
            >
              <el-button
                size="small"
                type="primary"
              >头像</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
              >
                只能上传jpg/png文件，且不超过1M</div>
            </el-upload>
            <div v-else>
              <img
                class="image"
                :src="imageBase64"
                alt="菜品照片"
              >
              <i
                class="el-icon-refresh"
                title="修改图片"
                @click="handleChangeImage"
              />
            </div>
          </el-form-item>
        </el-form>

      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="medium"
          @click="handleFormConfirm"
        >
          确定
        </el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
import { postRestExpAdd, getRestFindExp, deleteExp } from "@/api";
export default {
  // 组件名称
  name: "ExploreShop",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    exploreId: {
      type: String,
      default: () => ""
    }
  },
  // 组件状态值
  data() {
    return {
      imageBase64: "", // 图片Base64编码
      form: {
        name: "",
        headSculpture: [],
        productId: this.exploreId
      },
      rules: {
        name: [
          { required: true, message: "请输入推荐名称", trigger: "blur" }
        ],
        headSculpture: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ]
      },
      dataFormIs: false,
      recommendedDataListLoading: true,
      exploreDataList: [],
      addIsEditor: false
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  mounted() {
    this.getExploreList();
  },
  // 组件方法
  methods: {
    /**
     * @description: 获取探店数据
     * @return {*}
     */
    async getExploreList() {
      this.recommendedDataListLoading = true;
      try {
        const { data } = await getRestFindExp(
          this.exploreId
        );
        this.exploreDataList = data;
      } catch (error) {
        this.$message.error("获取数据失败");
      } finally {
        this.recommendedDataListLoading = false;
      }
    },
    /**
     * @description: 编辑
     * @param {*} row
     * @return {*}
     */
    handelRecommendedEditor(row) {
      this.dataFormIs = true;
      this.addIsEditor = false;
      const key = Object.keys(row);
      key.forEach((key) => {
        if (key === "image") {
          this.imageBase64 = row[key];
          this.form.headSculpture = [{ name: "图片" }];
        } else {
          this.form[key] = row[key];
          this.form.id = row.id;
        }
      });
    },
    /**
     * @description: 删除
     * @param {*} item
     * @return {*}
     */
    handelRecommendedDelete(item) {
      this.$confirm("此操作将永久删除选中门店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          try {
            await deleteExp(item.id);
            this.$message.success("删除成功!");
          } catch (error) {
            this.$message.warning("删除失败");
          } finally {
            this.getExploreList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * @description: 新增
     * @return {*}
     */
    handelRecommendedAdd(item) {
      this.dataFormIs = true;
      this.addIsEditor = true;
      this.form = {
        name: "",
        headSculpture: [],
        comment: "",
        productId: this.exploreId

      };
      this.imageBase64 = "";
    },

    /**
     * @description: 修改或者新增
     * @param {*} file
     * @return {*}
     */
    handleFormConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            const params = {
              ...this.form,
              headSculpture: this.imageBase64
            };
            await postRestExpAdd([params]);
          } catch (error) {
            if (this.addIsEditor) {
              this.$message.warning(`新增失败`);
            } else {
              this.$message.warning(`修改失败`);
            }
          } finally {
            this.getExploreList();
            this.dataFormIs = false;
          }
        } else {
          return false;
        }
      });
    },
    handleFileChange(file) {
      this.form.headSculpture = [file];
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
      this.form.headSculpture = [];
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
      this.form.headSculpture = [];
    }
  }
};
</script>

<style scoped lang="scss">
.recommend-add{
  .image {
    max-width: 100px;
  }
}
.recommend-list{
  &-image {
      width: 80px;
      height: 80px;
      display: block;
      border-radius: 100%;
      margin-left: 1rem;
    }
  &-center{
    padding: 14px;width: 100%;display: inline-block;
    .title{
      font-size: 16px;
      font-weight: 450;
    }

    .text{
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-center{
        width: 60%;
        height: 1rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

</style>
