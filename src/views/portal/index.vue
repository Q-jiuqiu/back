<!--
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: quling
 * @LastEditTime: 2023-05-05 21:52:16
 * @Description: 首页
 * @FilePath: \vue-admin-template\src\views\portal\index.vue
-->
<template>
  <div class="portal-container">
    <!-- 操作按钮 -->
    <div class="operation">
      <el-button
        type="primary"
        size="medium"
        @click="handleShopAdd"
      >
        新增门店
      </el-button>
      <el-button
        type="danger"
        size="medium"
        :loading="delLoading"
        :autofocus="false"
        plain
        @click="handleShopDel"
      >
        删除按钮
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table
        ref="Table"
        :data="tableData"
        border
        height="100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column
          type="selection"
          width="55"
          header-align="center"
          align="left"
        />
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
        />
        <el-table-column
          prop="address"
          label="描述"
          header-align="center"
          align="left"
        />
        <el-table-column
          label="操作"
          width="100"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.stop="handleClick(scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              size="small"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增门店 -->
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
          v-if="isEdit"
          class="el-icon-edit"
        />
      </span>
      <div class="dialog-container">
        <div class="top">
          <div class="left">
            <div class="item">
              <span class="label">门店名称</span>
              <el-input
                v-model="shopName"
                autocomplete="off"
              />
            </div>
            <div class="item">
              <span class="label">经度</span>
              <el-input
                v-model="longitude"
                autocomplete="off"
              />
            </div>
            <div class="item">
              <span class="label">纬度</span>
              <el-input
                v-model="latitude"
                autocomplete="off"
              />
            </div>
            <div class="item">
              <span class="label">门店描述</span>
              <el-input
                v-model="desc"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </div>
          </div>
          <div class="right">
            <el-upload
              ref="upload"
              :class="['upload',{ cover: hasImg }]"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
              :on-change="handleUpload"
            >
              <i
                slot="default"
                class="el-icon-plus"
              />
              <div
                slot="file"
                slot-scope="{file}"
              >
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                >
                <span
                  class="el-upload-list__item-actions"
                >
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
            </el-upload>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogImgVisible">
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Portal",
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      multipleSelection: [], // 表格选中项
      delLoading: false,
      dialogVisible: false, // 对话框显隐
      dialogTitle: "新增门店",
      shopName: "", // 门店名称
      longitude: "", // 经度
      latitude: "", // 纬度
      desc: "", // 门店描述
      dialogImgVisible: false, // 图片预览对话框
      dialogImageUrl: "", // 图片预览地址
      hasImg: false, // 是否有图片
      picture: null, // 图片-文件
      isEdit: false
    };
  },
  methods: {
    // 表格勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      this.dissolveFocus(event);
      this.dialogVisible = true;
    },
    // 关闭对话
    handleDialogClose(done) {
      this.isEdit = false;
      this.handleRemove(this.picture);
      done();
    },
    // 删除门店
    handleShopDel(event) {
      this.dissolveFocus(event);
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: "未选中需删除的门店",
          type: "warning"
        });
        return;
      }
      this.$confirm("此操作将永久删除选中门店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 上传图片
    handleUpload(file) {
      this.hasImg = true;
      console.log(file);
      this.picture = file;
    },
    // 移除图片
    handleRemove(file) {
      console.log(file);
      const fileList = this.$refs.upload.uploadFiles;
      const index = fileList.findIndex(fileItem => { return fileItem.uid === file.uid; });
      fileList.splice(index, 1);
      this.hasImg = false;
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImgVisible = true;
    },
    handleClick(row) {
      console.log(row);
      this.isEdit = true;
      this.dialogVisible = true;
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
    justify-content: flex-end;
    width: 100%;
  }

  .table-container {
    width: 100%;
    overflow: hidden;
  }

  .dialog-container {
    max-height: 400px;
    overflow: auto;
    .top {
      display: grid;
      width: 100%;
      grid-template-columns: 55% calc(45% - 10px);
      grid-column-gap: 10px;

      .cover {
        ::v-deep .el-upload.el-upload--picture-card {
          display: none;
        }
      }
      .upload {
        height: 100%;
        display: flex;
        justify-content: center;
        ::v-deep .el-upload--picture-card,
        ::v-deep .el-upload-list__item {
          width: 250px;
          height: calc(100% - 10px);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

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
      }
    }
  }
}
</style>
