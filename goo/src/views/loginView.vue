<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleLogin">登录</el-button>
  </div>
</template>

<script>
import { login } from "@/api/api"; // 引入封装的 API
import {jwtDecode} from "jwt-decode";

export default {
  data() {
    return {
      form: {
        username: "", // 用户名
        password: ""  // 密码
      }
    };
  },
  methods: {
    async handleLogin() {
      // 表单验证
      if (!this.form.username || !this.form.password) {
        this.$message.error("用户名和密码不能为空！");
        return;
      }

      try {
        // 调用登录接口
        const response = await login(this.form.username, this.form.password);

        // 检查响应中的 code
        if (response.data.code === 200) {
          const token = response.data.data.token; // 获取 token

          // 存储 JWT 到本地
          localStorage.setItem("jwt", token);

          // 解析 JWT 获取用户信息
          console.log(jwtDecode(token));

          const userInfo = jwtDecode(token);

          // 存储用户信息到本地
          localStorage.setItem("user", JSON.stringify(userInfo));

          // 提示用户登录成功并跳转
          this.$message.success(response.data.msg || "登录成功！");
          await this.$router.push("/");
        } else {
          // code 不为 200 时，提示错误信息
          this.$message.error(response.data.msg || "登录失败！");
        }
      } catch (error) {
        // 捕获异常，提示错误信息
        console.error("登录失败：", error);
        this.$message.error("登录失败，请检查网络或稍后重试！");
      }
    }
  }
};
</script>

<style>
/* 样式部分根据需要定制 */
</style>
