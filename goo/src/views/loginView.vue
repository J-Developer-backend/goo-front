<template>
  <div class="login-container">
    <div class="login-form">
      <h2>登录</h2>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <div class="form-actions">
        <el-button type="primary" @click="handleLogin">登录</el-button>
        <el-button type="text" @click="goToRegister">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/api"; // 引入封装的 API
import { jwtDecode } from "jwt-decode";

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
      if (this.form.username.includes(" ") || this.form.password.includes(" ")) {
        this.$message.error("用户名和密码不能有空格！");
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
          const decodedToken = jwtDecode(token);
          console.log("Decoded JWT:", decodedToken);

          // 解析嵌套的用户信息（sub 中包含 JSON）
          const userInfo = JSON.parse(decodedToken.sub);
          console.log("User Info from JWT:", userInfo);

          // 获取并存储用户 ID
          const userId = userInfo.id; // 从解析后的 JSON 中获取 id
          console.log("User ID:", userId);
          localStorage.setItem("userId", userId);

          // 设置 Vuex store 中的 userId
          this.$store.dispatch('setUserId', userId);

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
    },
    goToRegister() {
      this.$router.push("/register"); // 跳转到注册页面
    }
  }
};
</script>

<style>
/* 页面容器样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 登录表单样式 */
.login-form {
  width: 400px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-form h2 {
  margin-bottom: 20px;
  color: #333333;
  font-weight: bold;
}

/* 按钮组样式 */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.el-button {
  width: 45%;
}

.el-input {
  width: 100%;
}
</style>
