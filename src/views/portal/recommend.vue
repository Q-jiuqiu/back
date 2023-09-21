<!--
 * @Author: 何元鹏
 * @Date: 2023-08-23 20:46:14
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-20 20:53:33
-->
<template>
  <div v-loading="recommendedDataListLoading" class="recommend-list">
    <header class="recommend-list-header">
      <el-button
        type="primary"
        size="medium"
        @click="handelRecommendedAdd"
      >
        新增
      </el-button>
    </header>
    <el-table
      border
      :data="recommendedDataList"
      class="recommend-list-table"
    >
      <el-table-column
        label="名称"
        header-align="center"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.foodName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="图片"
        width="180"
        header-align="center"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="{ row }">
          <img style="width: 50px; height: 50px;" :src="row.image" :alt="row.foodName">
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
        header-align="center"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handelRecommendedEditor( scope.row,scope.$index,)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handelRecommendedDelete(scope.row,scope.$index, )"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      width="30%"
      title="推荐"
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
            label="推荐名"
            prop="foodName"
          >
            <el-input
              v-model="form.foodName"
              placeholder="请输入推荐名"
            />
          </el-form-item>

          <el-form-item
            label="图片"
            prop="file"
          >
            <el-upload
              ref="uploadFile"
              class="upload-demo"
              action=""
              :file-list="fileList"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              accept=".jpg,.png,.webp"
              multiple
              :limit="2"
              :on-exceed="handleExceed"
              :auto-upload="false"
              list-type="picture"
              :on-change="handleFileChange"
            >
              <el-button
                size="small"
                type="primary"
              >上传图片</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
              >
                只能上传jpg/png/webp文件，且不超过2M</div>
            </el-upload>

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
import { postRecommendAdd, deleteRecommend, postRecommendEdit, getRecommendFind } from "@/api";
export default {
  // 组件名称
  name: "Recommend",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    foodId: {
      type: String,
      default: () => ""
    }
  },
  // 组件状态值
  data() {
    return {
      fileList: [],
      form: {
        foodName: "",
        image: [],
        file: [],
        describe: "1",
        foodId: this.foodId
      },
      rules: {
        foodName: [
          { required: true, message: "请输入推荐名称", trigger: "blur" }
        ],
        file: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ]
      },
      dataFormIs: false,
      recommendedDataListLoading: true,
      recommendedDataList: [],
      addIsEditor: false
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    foodId: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getRecommendedList();
        }
      }
    }
  },
  mounted() {
    this.getRecommendedList();
  },
  // 组件方法
  methods: {
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
          this.fileList = [{ name: row.name, url: row[key] }];
        } else {
          this.form[key] = row[key];
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
            await deleteRecommend(item.id);
            this.$message.success("删除成功!");
            this.getRecommendedList();
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
    /**
     * @description: 新增
     * @return {*}
     */
    handelRecommendedAdd() {
      this.dataFormIs = true;
      this.addIsEditor = true;
      this.form = {
        foodName: "",
        image: [],
        file: [],
        describe: "1",
        foodId: this.foodId
      };
      this.fileList = [];
    },
    /**
     * @description: 获取推荐数据
     * @return {*}
     */
    async getRecommendedList() {
      this.recommendedDataListLoading = true;
      try {
        const { data } = await getRecommendFind(
          this.foodId
        );
        this.recommendedDataList = data;
      } catch (error) {
        this.$message.error("获取数据失败");
      } finally {
        this.recommendedDataListLoading = false;
      }
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
            const formData = new FormData();
            const { foodName, describe, file, foodId } = this.form;
            formData.append("foodName", foodName);
            formData.append("file", file);
            formData.append("describe", describe);
            formData.append("foodId", foodId);
            if (this.addIsEditor) {
              await postRecommendAdd(formData);
            } else {
              await postRecommendEdit(formData);
            }
          } catch (error) {
            if (this.addIsEditor) {
              this.$message.warning(`新增失败`);
            } else {
              this.$message.warning(`修改失败`);
            }
          } finally {
            this.dataFormIs = false;
            this.getRecommendedList();
          }
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 上传图片
     * @param {*} file
     * @param {*} fileList
     * @return {*}
     */
    handleFileChange(file, fileList) {
      if (this.$refs.uploadFile.uploadFiles.length > 1) {
        this.$refs.uploadFile.uploadFiles.shift();
      }
      const fileType = file.name.split(".").reverse()[0].toLowerCase();
      const imageList = ["png", "gif", "jpg", "jpeg", "webp"];// 图片文件格式列表
      if (!imageList.includes(fileType)) {
        alert("文件格式不正确");
        return false;
      } else {
        this.form.file = file.raw;
        this.fileList = fileList;
      }
    },

    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
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
.recommend-add{
  .image {
    max-width: 100px;
  }
}
.recommend-list{
  &-header{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
    height: 3rem;
  }
  &-table{
    width: 100%;
  }
}

</style>
