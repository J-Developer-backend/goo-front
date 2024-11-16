<template>
  <div class="header-banner">
    <div class="login-info">
      <template v-if="isLoggedIn">
        <img :src="avatar" alt="Avatar" class="avatar" />
        <span>Welcome, {{ userName }}</span>
        <el-button type="danger" size="mini" @click="logout">Logout</el-button>
      </template>
      <template v-else>
        <el-button type="primary" @click="goToLogin">Login</el-button>
      </template>
    </div>
    <div class="project-name">
      <span>Project Name</span>
    </div>
  </div>
</template>

<script>
import {jwtDecode} from 'jwt-decode'; // 确保正确导入

export default {
  data() {
    return {
      isLoggedIn: false,
      userName: '',
      avatar: '' // 用户头像
    };
  },
  created() {
    const token = localStorage.getItem('jwt'); // 获取JWT Token
    if (token) {
      try {
        // 解码 JWT 获取用户信息
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken.sub) {
          const userInfo = JSON.parse(decodedToken.sub); // 从 sub 中解析用户信息

          this.isLoggedIn = true;
          this.userName = userInfo.username || 'Unknown'; // 设置用户名
          this.avatar = userInfo.avatar || 'default-avatar.png'; // 设置头像，默认值为占位符图片
        } else {
          throw new Error('Invalid token format');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout(); // 解码失败时清除状态
      }
    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/login'); // 跳转到登录页
    },
    logout() {
      // 清除本地存储的用户信息和JWT
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');

      // 重置登录状态
      this.isLoggedIn = false;
      this.userName = '';
      this.avatar = '';

      // 提示信息
      this.$message.success('You have successfully logged out.');

      // 跳转到首页并避免重复导航
      if (this.$route.path !== '/') {
        this.$router.push('/').catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            console.error(err);
          }
        });
      }
    }
  }
};
</script>

<style>
.header-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: yellow;
  padding: 10px;
}

.login-info {
  flex: 1;
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.project-name {
  flex: 2;
  text-align: center;
  font-weight: bold;
}
</style>
