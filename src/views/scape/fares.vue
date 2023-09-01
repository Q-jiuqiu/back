<!--
 * @Author: 何元鹏
 * @Date: 2023-08-27 12:12:01
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-08-31 20:43:44
-->
<template>
  <div class="fares">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="成人票:">
        <el-input v-model="form.adult" />
      </el-form-item>
      <el-form-item label="老人票:">
        <el-input v-model="form.elder" />
      </el-form-item>
      <el-form-item label="儿童票:">
        <el-input v-model="form.child" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handelSubmitForm('form')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getFaresFindExp, postDbsFaresAdd } from "@/api";
export default {
  name: "Fares",
  components: {},
  props: {
    faresId: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      form: {
        id: this.faresId,
        adult: "",
        elder: "",
        child: "",
        productId: this.faresId
      }
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getCheckFares();
  },
  methods: {
    /**
     * @description: 查询票价
     * @return {*}
     */
    async getCheckFares() {
      console.log(this.faresId);
      const { data } = await getFaresFindExp(this.faresId);
      console.log(data);
      this.form = data[0];
      console.log(this.form);
    },

    /**
      * @description: 提交票价
      * @param {*} formName
      * @return {*}
      */
    handelSubmitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const data = await postDbsFaresAdd([this.form]);
          data && this.$message.success("新建票价成功");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }

  }
};
</script>

<style scoped lang="scss">

</style>
