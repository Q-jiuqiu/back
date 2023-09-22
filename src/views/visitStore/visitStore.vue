<!--
 * @Author: 何元鹏
 * @Date: 2023-06-06 20:59:09
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-21 21:27:52
-->
<template>
  <div class="portal-container">
    <!-- 操作按钮 -->
    <div class="operation">
      <div class="search" />
      <el-button
        type="primary"
        size="medium"
        @click="handleVisitStoreAdd"
      >
        新增字典
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table
        ref="Table"
        v-loading="tableLoading"
        :data="tableVisitStoreData"
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
          prop="entName"
          label="名称"
          header-align="center"
          align="center"
        />
        <el-table-column
          label="头像"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <img style="width: 100px; height: 100px;" :src="scope.row.pictrue" :alt="scope.row.entName">
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.stop="handleVisitStoreEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              class="warn-btn"
              @click.stop="handleVisitStoreDel(scope.row)"
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
    <!-- 新增探店 -->
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
              label="名称"
              prop="entName"
            >
              <el-input
                v-model="form.entName"
                placeholder="请输入类型"
                style="width: 100%;"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="头像"
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
import { getExpUserAdd, deleteExpUserDel, getExpUserFind } from "@/api";

export default {
  name: "VisitStore",
  data() {
    return {
      tableVisitStoreData: [],
      delLoading: false,
      dialogVisible: false,
      form: {
        entName: "",
        pictrue: "",
        file: [],
        id: ""
      },
      rules: {
        entName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ]
      },
      addBtnLoading: false,
      tableLoading: false,
      pageIndex: 1,
      pageSize: 20,
      dialogTitle: "新增探店字典表",
      totalElements: 0,
      isEdit: false,
      fileList: []

    };
  },
  mounted() {
    this.getVisitStoreDataList();
  },
  methods: {
    /**
     * @description: 获取主播列表
     * @return {*}
     */
    async getVisitStoreDataList() {
      try {
        this.tableLoading = true;
        const { data: { content, totalElements }} = await getExpUserFind(
          { pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        );
        this.tableVisitStoreData = content;
        this.totalElements = totalElements;
      } catch (error) {
        this.$message.warning("获取数据失败");
      } finally {
        this.tableLoading = false;
      }
    },
    /**
     * @description:编辑
     * @return {*}
     */
    handleVisitStoreEdit(row) {
      this.fileList = [];
      this.dialogTitle = "编辑探店信息数据字典";
      this.dialogVisible = true;
      this.isEdit = true;
      const key = Object.keys(row);
      key.forEach((key) => {
        if (row[key]) {
          this.form[key] = row[key];
          if (key === "pictrue") {
            this.fileList = [{ name: row.name, url: row[key] }];
          }
        }
      });
    },

    /**
     * @description:关闭新增、编辑
     * @return {*}
     */
    handleDialogClose(done) {
      this.dialogVisible = false;
      done();
    },
    /**
     * @description:上传文件
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
     * @description: 删除上传文件
     * @param {*} file
     * @param {*} fileList
     * @return {*}
     */
    handleRemove(file, fileList) {
      this.form.pictrue = fileList;
    },
    /**
     * @description: 删除文件前提示
     * @return {*}
     */
    beforeRemove() {
      return this.$confirm(`确定移除？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      });
    },

    /**
     * @description: 分页
     * @param {*} index
     * @return {*}
     */
    handelCurrentPage(index) {
      this.pageIndex = index;
      this.getVisitStoreDataList();
    },

    /**
     * @description: 点击新增按钮
     * @return {*}
     */
    handleVisitStoreAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增数据字典";
    },

    /**
     * @description: 提交表单编辑或新增数据
     * @return {*}
     */
    handleFormConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            const { entName, pictrue, id } = this.form;
            let { file } = this.form;
            this.addBtnLoading = true;

            const formData = new FormData();
            formData.append("entName", entName);
            if (Object.prototype.toString.call(file) === "[object Array]") {
              file = new File([], "");
            }
            formData.append("file", file);
            if (this.isEdit) {
              formData.append("id", id);
              formData.append("pictrue", pictrue);
            }
            const { data } = await getExpUserAdd(formData);
            this.$message.success(`新增成功${data}`);
          } catch (error) {
            this.$message.error(`新增失败`);
          } finally {
            this.getVisitStoreDataList();
            this.addBtnLoading = false;
            this.dialogVisible = false;
          }
        } else {
          return false;
        }
      });
    },
    /**
     * @description:删除选中字典表
     * @return {*}
     */
    handleVisitStoreDel(row) {
      this.$confirm("此操作将永久删除选中字典表, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          try {
            await deleteExpUserDel(row.id);
            this.$message.success("删除成功!");
            this.getVisitStoreDataList();
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
