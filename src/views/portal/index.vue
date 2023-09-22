<!--
 * @Author: quling
 * @Date: 2023-04-27 22:44:28
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-22 20:58:18
 * @Description: 首页
 * @FilePath: \vue-admin-template\src\views\portal\index.vue
-->
<template>
  <div class="portal">
    <div v-if="storeShow" class="portal-container">
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
                v-for="(item,index) in mainClass"
                :key="index"
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
                v-for="(item,index) in smallClass"
                :key="index"
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
            width="320"
            header-align="center"
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="city"
            label="所属城市"
            :show-overflow-tooltip="true"
            width="220"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="secondType"
            label="一级分类"
            width="150"
            header-align="center"
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="threeType"
            label="二级分类"

            header-align="center"
            :show-overflow-tooltip="true"
            align="center"
          />

          <el-table-column
            label="操作"
            width="300"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click.stop="handelRecommendAdd(scope.row)"
              >推荐</el-button>

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
      <el-dialog
        width="40%"
        title="推荐"
        :visible.sync="innerVisible"
        append-to-body
      ><Recommend :food-id="shopId" /></el-dialog>
      <el-dialog
        width="40%"
        title="评论"
        :visible.sync="commentInner"
        append-to-body
      ><Comment :comment-id="commentId" /></el-dialog>
    </div>
    <AddStore v-else :shop-data="shopData" :operation-type="operationType" :first-class="mainClass" :filter-city-list="filterCityList" @onBackToList="emitBackToList" />
  </div>
</template>

<script>
import { getList, delShop, getDictFind, getCityFindPage } from "@/api";
import Recommend from "@/views/portal/recommend.vue";
import Comment from "@/views/portal/comment.vue";
import AddStore from "@/views/portal/addStore.vue";
export default {
  name: "Portal",
  components: { Recommend, Comment, AddStore },
  data() {
    return {
      parentCity: -1,
      storeShow: true,
      tableData: [],
      tableLoading: false,
      searchName: "",
      totalElements: 0,
      pageIndex: 1,
      pageSize: 20,
      mainClass: [],
      smallClass: [],
      searchCityData: [],
      searchSmallClass: "",
      searchMainClass: "",
      loadingSmallClass: false,
      shopId: "",
      innerVisible: false,
      commentId: "",
      commentInner: false,
      filterCityList: [],
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
      operationType: "add",
      shopData: {}
    };
  },
  mounted() {
    this.initTableData({
      type: "美食"
    });
    this.getFilterCityListData(this.parentCity);
    this.handelSearchSecondType();
  },
  methods: {
    /**
     * @description:返回按钮
     * @return {*}
     */
    emitBackToList(jube, show) {
      this.storeShow = jube;
      const res = {
        city: this.searchCityData ? this.searchCityData[ this.searchCityData.length - 1] : "",
        name: this.searchName,
        type: "美食",
        secondType: this.searchMainClass,
        threeType: this.searchSmallClass
      };
      if (show) {
        this.initTableData(res);
      }
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
      const res = {
        city: this.searchCityData ? this.searchCityData[ this.searchCityData.length - 1] : "",
        name: this.searchName,
        type: "美食",
        secondType: this.searchMainClass,
        threeType: this.searchSmallClass
      };
      this.initTableData(res);
    },
    /**
     * @description: 新增
     * @return {*}
     */
    handleShopAdd() {
      this.storeShow = false;
      this.operationType = "add";
    },
    /**
     * @description: 编辑
     * @param {*} row
     * @return {*}
     */
    handleEdit(row) {
      this.storeShow = false;
      this.operationType = "edit";
      console.log(row);
      this.shopData = row;
    },

    /**
     * @description: 删除门店
     * @param {*} item
     * @return {*}
     */
    handleShopDel(item) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          try {
            await delShop(item.id);
            this.$message.success("删除成功!");
            const res = {
              city: this.searchCityData ? this.searchCityData[ this.searchCityData.length - 1] : "",
              name: this.searchName,
              type: "美食",
              secondType: this.classification
            };
            this.initTableData(res);
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

    /**
     * @description:评论
     * @return {*}
     */
    handelComment(row) {
      this.commentId = row.id;
      this.commentInner = true;
    },
    /**
     * @description: 推荐新增
     * @return {*}
     */
    handelRecommendAdd(row) {
      this.shopId = row.id;
      this.innerVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.portal{
  width: 100%;
  height: 100%;
  position: relative;
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
}

</style>
