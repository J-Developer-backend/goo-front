<template>
  <div class="register-container">
    <div class="register-form">
      <h2>注册</h2>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <div class="form-actions">
        <el-button type="primary" @click="handleRegister">注册</el-button>
        <el-button type="text" @click="goToLogin">已有账号？登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from "@/api/api"; // 假设已经封装了注册 API

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
    async handleRegister() {
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
        // 调用注册接口
        const response = await register(this.form.username, this.form.password);

        // 检查响应中的 code
        if (response.data.code === 200) {

          // 提示用户注册成功并跳转
          this.$message.success(response.data.msg || "注册成功！请去登录");
          await this.$router.push("/login");
        } else {
          // code 不为 200 时，提示错误信息
          this.$message.error(response.data.msg || "注册失败！");
        }
      } catch (error) {
        // 捕获异常，提示错误信息
        console.error("注册失败：", error);
        this.$message.error("注册失败，请检查网络或稍后重试！");
      }
    },
    goToLogin() {
      this.$router.push("/login"); // 跳转到登录页
    }
  }
};
</script>

<style>
/* 页面容器样式 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 注册表单样式 */
.register-form {
  width: 400px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.register-form h2 {
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
