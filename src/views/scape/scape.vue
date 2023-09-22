<!--
 * @Author: 何元鹏
 * @Date: 2023-09-14 09:39:00
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-22 21:24:25
-->
<template>
  <div class="portal">
    <div v-if="scapeShow" class="portal-container">
      <div class="operation">
        <div class="search">
          <div class="search-item">
            <div class="label">名称:</div>
            <el-input
              v-model="searchName"
              placeholder="搜索景区名称"
            />
          </div>
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
            <div class="label">分类:</div>
            <el-select v-model="classification" style="width: 100%;" clearable placeholder="请选择">
              <el-option
                v-for="item in secondClass"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
          新增景区
        </el-button>
      </div>
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
            header-align="center"
            width="300"
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="secondType"
            label="分类"
            width="200"
            header-align="center"
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="city"
            label="城市"
            width="200"
            header-align="center"
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="addr"
            label="地址"
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
              >推荐</el-button>
              <el-button
                type="text"
                size="small"
                @click.stop="handleFaresCondition(scope.row)"
              >票价</el-button>

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
      <el-dialog
        width="40%"
        title="推荐"
        :visible.sync="exploreShopInner"
        append-to-body
      ><Recommend :food-id="exploreId" /></el-dialog>
      <el-dialog
        width="45%"
        title="票价情况"
        :visible.sync="faresInner"
        append-to-body
      >
        <Fares :fares-id="faresId" />
      </el-dialog>
    </div>
    <AddScape v-else :shop-data="shopData" :operation-type="operationType" :first-class="secondClass" :filter-city-list="filterCityList" @onBackToList="emitBackToList" />
  </div>

</template>

<script>
import { getList, delShop, getDictFind, getCityFindPage } from "@/api";
import Recommend from "@/views/portal/recommend.vue";
import Fares from "@/views/scape/fares.vue";
import AddScape from "@/views/scape/addScape.vue";

export default {
  name: "Portal",
  components: { Recommend, Fares, AddScape },
  data() {
    return {
      scapeShow: true,
      operationType: "add",
      shopData: {},
      tableData: [],
      delLoading: false,
      addBtnLoading: false, // 添加景区loading
      tableLoading: false, // 表格loading
      addFaresBtnLoading: false,
      changeImage: false, // 是否展示修改图片按钮
      searchName: "", // 搜索关键字
      city: "",
      totalElements: 0,
      pageIndex: 1,
      pageSize: 20,
      secondClass: [],
      filterCityList: [],
      searchCityData: [],
      classification: "",
      exploreId: "",
      exploreShopInner: false,
      faresId: "",
      faresInner: false,
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
        } }

    };
  },
  mounted() {
    this.getLandscapeData({
      type: "风景"
    });
    this.handelSecondType();
    this.getFilterCityListData(this.parentCity);
  },
  methods: {
    /**
     * @description:返回按钮
     * @return {*}
     */
    emitBackToList(jube, show) {
      this.scapeShow = jube;
      const res = {
        city: this.searchCityData ? this.searchCityData[ this.searchCityData.length - 1] : "",
        name: this.searchName,
        type: "风景",
        secondType: this.searchMainClass,
        threeType: this.searchSmallClass
      };
      if (show) {
        this.getLandscapeData(res);
      }
    },
    /**
     * @description: 初始化数据
     * @return {*} 风景列表请求参数
     */
    async getLandscapeData(res) {
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
     * @description: 探店新增
     * @return {*}
     */
    handelExploreShop(row) {
      this.exploreId = row.id;
      this.exploreShopInner = true;
    },
    /**
     * @description:新增推荐
     * @return {*}
     */
    handleFaresCondition(row) {
      this.faresId = row.id;
      this.faresInner = true;
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
     * @description: 搜索
     * @return {*}
     */
    async  handelSearchTableData() {
      const res = {
        city: this.searchCityData ? this.searchCityData[ this.searchCityData.length - 1] : "",
        name: this.searchName,
        type: "风景",
        secondType: this.classification
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
      this.getLandscapeData(nonEmptyValues);
    },
    /**
     * @description: 获取二级分类
     * @return {*}
     */
    async handelSecondType() {
      this.secondClass = [];
      const { data: {
        content
      }} = await getDictFind({
        pageIndex: 1,
        pageSize: 1000
      }, { type: "风景",
        level: 2 });
      content.forEach(item => {
        this.secondClass.push({
          value: item.name,
          label: item.name
        });
      });
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
        type: "风景",
        secondType: this.classification
      };
      this.getLandscapeData(res);
    },
    /**
     * @description: 增加景区-打开对话框
     * @param {*}
     * @return {*}
     */
    handleShopAdd() {
      this.scapeShow = false;
      this.operationType = "add";
    },
    /**
     * @description: 编辑
     * @param {*} row
     * @return {*}
     */
    handleEdit(row) {
      this.scapeShow = false;
      this.operationType = "edit";
      console.log(row);
      this.shopData = row;
    },

    /**
     * @description: 删除景区
     * @param {*} item
     * @return {*}
     */
    handleShopDel(item) {
      this.$confirm("此操作将永久删除选中景区, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          this.tableLoading = true;
          try {
            await delShop(item.id);
            this.$message.success("删除成功!");
            const res = {
              city: this.searchCityData ? this.searchCityData[ this.searchCityData.length - 1] : "",
              name: this.searchName,
              type: "风景",
              secondType: this.classification
            };
            this.getLandscapeData(res);
          } catch (error) {
            this.$message.warning("删除失败");
          } finally {
            this.tableLoading = false;
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
