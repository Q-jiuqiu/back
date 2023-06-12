<!--
 * @Author: 何元鹏
 * @Date: 2023-06-06 20:59:09
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-06-10 13:48:04
-->
<!--
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-06-06 22:35:43
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
          <el-input
            v-model="city"
            placeholder="搜索城市"
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
        新增字典
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
          prop="type"
          label="大类"
          header-align="center"
          align="left"
        />
        <el-table-column
          prop="name"
          label="小类"
          header-align="center"
          align="left"
        />
        <el-table-column
          prop="remark"
          label="描述"
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
    <!-- 新增避坑 -->
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
        ><el-row>
           <el-form-item
             label="大类"
             prop="type"
           >
             <el-select v-model="form.type" clearable placeholder="请选择">
               <el-option
                 v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"
               />
             </el-select>
           </el-form-item>
         </el-row>
          <el-row>
            <el-form-item
              label="小类"
              prop="name"
            >
              <el-input
                v-model="form.name"
                placeholder="请输入类型"
                style="width: 100%;"
              />
            </el-form-item>
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
          <el-row>
            <el-form-item
              label="描述"
              prop="remark"
            >
              <el-input
                v-model="form.remark"
                type="textarea"
                autosize
                placeholder="请输入描述信息"
              />
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
import { postDictAdd, getDictFind, deleteDictPit, postDictEdit } from "@/api";

export default {
  name: "Portal",
  data() {
    return {
      tableData: [],
      delLoading: false,
      dialogVisible: false, // 对话框显隐
      dialogTitle: "新增数据字典",
      canEdit: false, // 能否编辑 是否显示编辑图标
      isEdit: true, // 是否编辑
      imageBase64: "", // 图片Base64编码
      form: {
        name: "",
        type: "美食",
        remark: "",
        image: []
      },
      rules: {
        name: [
          { required: true, message: "请输入城市名称", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入说明名称", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        image: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ]
      },
      addBtnLoading: false, // 添加门店loading
      tableLoading: false, // 表格loading
      city: "成都市",
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
      totalElements: 0,
      pageIndex: 1,
      pageSize: 10
    };
  },
  mounted() {
    this.initTableData();
  },
  methods: {
    // 编辑
    handleEdit(row) {
      this.dialogTitle = "编辑门店信息数据字典";
      this.isEdit = true;
      this.canEdit = true;
      this.dialogVisible = true;
      console.log(row);
      //  const { name, type, remark, id, image } = row;
      const key = Object.keys(row);
      key.forEach((key) => {
        if (key === "image") {
          this.imageBase64 = row[key];
          this.form.image = [{ name: "图片" }];
        } else {
          this.form[key] = row[key];
        }
      });
      /* this.form = {
        name,
        type,
        remark,
        id,
        image
      }; */
    },
    // 获取列表
    async initTableData() {
      try {
        this.tableLoading = true;
        const { data: {
          content, totalElements
        }} = await getDictFind(
          { pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        );
        this.totalElements = totalElements;
        this.tableData = content;
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
    // 增加门店-打开对话框
    handleShopAdd(event) {
      this.dialogTitle = "新增数据字典";
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
            await deleteDictPit(item.id);
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
      console.log(this.form);
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            this.addBtnLoading = true;
            console.log(this.canEdit);
            const { name, remark, type, id } = this.form;
            const data = {
              name,
              remark,
              type,
              image: this.imageBase64,
              id
            };
            if (this.canEdit) {
              await postDictEdit(data);
            } else {
              await postDictAdd(data);
            }
            this.resetForm();
            this.dialogVisible = false;
            await this.initTableData();
            this.$message.success(`新增成功`);
          } catch (error) {
            this.$message.error(`新增失败`);
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
        console.log(this.imageBase64);
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
