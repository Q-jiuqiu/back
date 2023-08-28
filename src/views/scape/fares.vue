<!--
 * @Author: 何元鹏
 * @Date: 2023-08-27 12:12:01
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-08-27 13:19:12
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
        adult: "",
        elder: "",
        child: ""
      }
    };
  },
  computed: {},
  watch: {},
  mounted() {
  },
  methods: {
    /**
      * @description: 提交票价
      * @param {*} formName
      * @return {*}
      */
    handelSubmitForm(formName) {
      console.log(this.faresId);
      this.$refs[formName].validate((valid) => {
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

<style scoped lang="scss">

</style>
