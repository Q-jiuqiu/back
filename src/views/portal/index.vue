<!--
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: quling
 * @LastEditTime: 2023-05-17 22:14:32
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
              @click.stop="handlePreview(scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              size="small"
              @click.stop="handleEdit(scope.row)"
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
            />
          </el-form-item>
          <el-form-item
            label="地址"
            prop="address"
          >
            <el-input
              v-model="form.address"
              placeholder="请输入门店地址"
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
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="经度"
                prop="latitude"
              >
                <el-input
                  v-model="form.latitude"
                  placeholder="请输入经度"
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="纬度"
                prop="longitude"
              >
                <el-input
                  v-model="form.longitude"
                  placeholder="请输入纬度"
                  type="number"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="图片"
            prop="image"
          >
            <el-input
              v-model="form.image"
              type="textarea"
              autosize
              placeholder="请输入base64编码图片"
            />
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
          @click="handleFormConfirm"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from "@/api";

export default {
  name: "Portal",
  data() {
    const validateLatitude = (rule, value, callback) => {
      const lat = Number(value);
      if (lat >= -180 && lat <= 180) {
        callback();
      } else {
        callback(new Error("经度的取值范围[-180,180]"));
      }
    };
    const validateLongitude = (rule, value, callback) => {
      const log = Number(value);
      if (log >= -85 && log <= 85) {
        callback();
      } else {
        callback(new Error("纬度的取值范围[-85,85]"));
      }
    };
    return {
      tableData: [],
      multipleSelection: [], // 表格选中项
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
        address: "",
        city: "",
        region: "",
        latitude: "",
        longitude: "",
        image: "",
        remark: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入门店名称", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入门店地址", trigger: "blur" }
        ],
        city: [
          { required: true, message: "请输入城市名称", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请输入地区名称", trigger: "blur" }
        ],
        latitude: [
          { required: true, message: "请输入经度", trigger: "blur" },
          { validator: validateLatitude, trigger: "blur" }
        ],
        longitude: [
          { required: true, message: "请输入纬度", trigger: "blur" },
          { validator: validateLongitude, trigger: "blur" }
        ]
      }
    };
  },
  async mounted() {
    const res = await getList();
    console.log(res);
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
      this.dialogTitle = "新增门店";
      this.isEdit = true;
      this.dissolveFocus(event);
      this.dialogVisible = true;
    },
    // 关闭对话
    handleDialogClose(done) {
      this.canEdit = false;
      this.setForm({
        shopName: "",
        longitude: "",
        latitude: "",
        desc: ""
      });
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
    // 查看
    handlePreview(row) {
      console.log(row);
      this.dialogTitle = "查看门店信息";
      this.canEdit = true;
      this.isEdit = false;
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = "编辑门店信息";
      console.log(row);
      this.isEdit = true;
      this.canEdit = true;
      this.dialogVisible = true;
    },
    // 编辑
    handleFormEdit() {
      this.dialogTitle = "编辑门店信息";
      this.isEdit = true;
    },
    // 设置表单信息
    setForm({ shopName = "", longitude = "", latitude = "", desc = "" }) {
      this.shopName = shopName;
      this.longitude = longitude;
      this.latitude = latitude;
      this.desc = desc;
    },
    // 提交表单
    handleFormConfirm() {
      // if()
      this.$refs.form.validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
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
    justify-content: flex-end;
    width: 100%;
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
}
</style>
