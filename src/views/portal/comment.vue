<!--
 * @Author: 何元鹏
 * @Date: 2023-08-23 20:46:14
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-11 19:04:08
-->
<template>
  <div v-loading="recommendedDataListLoading" class="recommend-list">
    <div v-if="commentAddIs">
      <el-row v-for="(item,index) in commentDataList" :key="index" style="padding: 0.8rem 0.5rem;">
        <el-col :span="24">
          <div class="recommend-list-center">
            <div class="text">
              <span class="text-center">{{ item.comment }}</span>
              <span class="text-button">
                <el-button type="text" size="small" class="button" @click="handelRecommendedDelete(item)">删除</el-button>
                <el-button type="text" size="small" class="button" @click="handelRecommendedEdit(item)">编辑</el-button>
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="80px"
      >
        <el-form-item
          label="评论"
        >
          <el-input
            v-model="form.comment"
            size="medium"
            style="width: 80%;"
            placeholder="请输入评论内容"
          />
          <el-button
            type="primary"
            size="medium"
            @click="handleCommentAdd"
          >
            确定
          </el-button>
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
        @click="handleCommentSure"
      >
        新增
      </el-button>
    </span>
  </div>
</template>

<script>
import { getCommentById, deleteComment, postCommentAdd } from "@/api";
export default {
  // 组件名称
  name: "Comment",
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
      commentDataList: [],
      form: {
        comment: ""
      },
      commentAddIs: true
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    commentId: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getCommentDataList();
        }
      }
    }
  },
  mounted() {
    this.getCommentDataList();
  },
  // 组件方法
  methods: {
    /**
     * @description:编辑
     * @return {*}
     */
    async handelRecommendedEdit(item) {
      this.commentAddIs = false;
      this.form = item;
    },
    /**
     * @description:新增
     * @return {*}
     */
    handleCommentSure() {
      this.commentAddIs = false;
    },
    /**
     * @description: 提交评论
     * @return {*}
     */
    handleCommentAdd() {
      this.$refs.form.validate(async(valid) => {
        this.recommendedDataListLoading = true;
        if (valid) {
          try {
            const params = {
              ...this.form,
              productId: this.commentId
            };
            await postCommentAdd(params);
            this.commentAddIs = true;
            this.$message.success(`新增成功`);
          } catch (error) {
            this.$message.warning(`新增失败`);
          } finally {
            this.getCommentDataList();
            this.recommendedDataListLoading = false;
          }
        } else {
          return false;
        }
      });
    },
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
    width: 100%;
    display: inline-block;
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
