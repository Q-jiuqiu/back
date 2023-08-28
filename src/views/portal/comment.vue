<!--
 * @Author: 何元鹏
 * @Date: 2023-08-23 20:46:14
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-08-24 20:29:51
-->
<template>
  <div v-loading="recommendedDataListLoading" class="recommend-list">
    <el-row v-for="(item,index) in commentDataList" :key="index" style="padding: 0.8rem 0.5rem;">
      <el-col :span="24">
        <div class="recommend-list-center">
          <div class="text">
            <span class="text-center">{{ item.comment }}</span>
            <span class="text-button">
              <el-button type="text" size="small" class="button" @click="handelRecommendedDelete(item)">删除</el-button>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCommentById, deleteComment } from "@/api";
export default {
  // 组件名称
  name: "ExploreShop",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    commentId: {
      type: String,
      default: () => ""
    }
  },
  // 组件状态值
  data() {
    return {
      recommendedDataListLoading: true,
      commentDataList: []
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  mounted() {
    this.getCommentDataList();
  },
  // 组件方法
  methods: {
    /**
     * @description: 获取探店数据
     * @return {*}
     */
    async getCommentDataList() {
      this.recommendedDataListLoading = true;
      try {
        const { data: { content }} = await getCommentById(
          {
            id: this.commentId,
            pageIndex: 1,
            pageSize: 100
          }
        );
        this.commentDataList = content;
      } catch (error) {
        this.$message.error("获取数据失败");
      } finally {
        this.recommendedDataListLoading = false;
      }
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
            this.recommendedDataListLoading = true;
            await deleteComment(item.id);
            this.$message.success("删除成功!");
          } catch (error) {
            this.$message.warning("删除失败");
          } finally {
            this.getCommentDataList();
            this.recommendedDataListLoading = false;
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
