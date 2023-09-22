<!--
 * @Author: 何元鹏
 * @Date: 2023-08-23 20:46:14
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-20 22:13:21
-->
<template>
  <div class="comment">
    <header class="comment-header">
      <el-button
        type="primary"
        size="medium"
        @click="handleCommentSure"
      >
        新增
      </el-button>
    </header>
    <el-table
      v-loading="commentLoading"
      border
      :data="commentDataList"
      class="comment-table"
    >
      <el-table-column
        label="评论内容"
        header-align="center"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <el-input v-if="commentEdit && commentIndex === scope.$index" v-model=" scope.row.comment " />
          <span v-else>{{ scope.row.comment }}</span>
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
            v-if="commentEdit && commentIndex === scope.$index"
            size="mini"
            @click="handelCommentSave(scope.$index,scope.row)"
          >保存</el-button>
          <el-button
            v-else
            size="mini"
            @click="handelCommentEdit( scope.row,scope.$index,)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handelRecommendedDelete(scope.row,scope.$index, )"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
      commentLoading: true,
      commentDataList: [],
      commentEdit: false,
      commentIndex: 0
    };
  },
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
     * @description: 获取
     * @return {*}
     */
    async getCommentDataList() {
      this.commentLoading = true;
      try {
        const { data: { content }} = await getCommentById(
          {
            id: this.commentId,
            pageIndex: 1,
            pageSize: 1000
          }
        );
        this.commentDataList = content;
      } catch (error) {
        this.$message.error("获取数据失败");
      } finally {
        this.commentLoading = false;
      }
    },
    /**
     * @description:编辑
     * @return {*}
     */
    async handelCommentEdit(row, index) {
      console.log(row, index);
      this.commentEdit = true;
      this.commentIndex = index;
    },
    /**
     * @description: 新增
     * @return {*}
     */
    handleCommentSure() {
      const commentData = {
        comment: "",
        productId: this.commentId
      };
      this.commentEdit = true;
      this.commentIndex = 0;
      this.commentDataList.unshift(commentData);
    },
    /**
     * @description:提交
     * @return {*}
     */
    async handelCommentSave(index, row) {
      console.log(index, row);
      try {
        this.commentLoading = true;
        await postCommentAdd(row);
        this.$message.success(`新增成功`);
      } catch (error) {
        this.$message.error(`新增失败`);
      } finally {
        this.getCommentDataList();
        this.commentLoading = false;
        this.commentEdit = false;
      }
    },

    /**
     * @description: 删除
     * @param {*} item
     * @return {*}
     */
    handelRecommendedDelete(row, index) {
      console.log(row, index);
      if (row.id) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async() => {
            try {
              this.commentLoading = true;
              await deleteComment(row.id);
              this.$message.success("删除成功!");
            } catch (error) {
              this.$message.error("删除失败");
            } finally {
              this.getCommentDataList();
              this.commentLoading = false;
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.commentDataList.splice(index, 1);
        this.commentEdit = false;
      }
    }

  }
};
</script>

<style scoped lang="scss">
.comment {
  &-header{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
    height: 3rem;
  }
  &-center{
    width: 100%;
  }
}
</style>
