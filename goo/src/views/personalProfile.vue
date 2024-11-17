<template>
  <div class="profile-container">
    <h2>个人资料</h2>
    <el-form :model="userInfo" label-width="120px" class="profile-form">
      <el-form-item label="用户名">
        <el-input v-model="userInfo.username" :disabled="!isEditMode" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userInfo.email" :disabled="!isEditMode" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="userInfo.phoneNumber" :disabled="!isEditMode" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="userInfo.sex" :disabled="!isEditMode" placeholder="请选择性别">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="头像">
        <el-input v-model="userInfo.avatar" :disabled="!isEditMode" placeholder="请输入头像 URL" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="formattedCreateTime" disabled />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toggleEditMode">{{ isEditMode ? '保存' : '修改资料' }}</el-button>
        <el-button type="danger" @click="openResetPasswordDialog">修改密码</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="修改密码" :visible.sync="resetPasswordDialogVisible">
      <el-form :model="passwordForm" label-width="120px">
        <el-form-item label="原密码">
          <el-input type="password" v-model="passwordForm.originPassword" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="passwordForm.newPassword" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleResetPassword">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, resetPassword, update } from "@/api/api";

export default {
  data() {
    return {
      userInfo: {
        id: "",
        username: "",
        email: "",
        phoneNumber: "",
        sex: 1, // 1: Male, 2: Female
        avatar: "",
        creatTime: "",
      },
      originalUserInfo: {}, // Store original user info for comparison
      isEditMode: false,
      resetPasswordDialogVisible: false,
      passwordForm: {
        originPassword: "",
        newPassword: "",
      },
      formattedCreateTime: "",
    };
  },
  mounted() {
    this.fetchUserProfile();
  },
  methods: {
    // Fetch user profile data
    async fetchUserProfile() {
      try {
        const response = await getUserProfile();
        if (response.data.code === 200) {
          this.userInfo = response.data.data;
          this.originalUserInfo = {...response.data.data}; // Save the original data
          this.formattedCreateTime = this.formatDate(this.userInfo.creatTime);
        } else {
          this.$message.error("获取个人资料失败：" + response.data.msg);
        }
      } catch (error) {
        console.error("获取个人资料失败：", error);
        this.$message.error("请求个人资料时出现错误，请稍后重试！");
      }
    },
    // Format creation time
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },
    // Toggle edit mode for updating profile
    async toggleEditMode() {
      if (this.isEditMode) {
        const payload = {};
        Object.keys(this.userInfo).forEach((key) => {
          if (this.userInfo[key] !== this.originalUserInfo[key]) {
            payload[key] = this.userInfo[key];
          }
        });

        if (Object.keys(payload).length === 0) {
          this.$message.info("没有任何更改。");
          this.isEditMode = false;
          return;
        }

        try {
          const response = await update(
              payload.avatar || null,
              payload.creatTime || null,
              payload.email || null,
              payload.phoneNumber || null,
              payload.sex || null,
              payload.username || null
          );
          if (response.data.code === 200) {
            this.$message.success("资料更新成功！");
            this.fetchUserProfile();
          } else {
            this.$message.error("资料更新失败：" + response.data.msg);
          }
        } catch (error) {
          console.error("资料更新失败：", error);
          this.$message.error("更新个人资料时出现错误，请稍后重试！");
        }
      }
      this.isEditMode = !this.isEditMode;
    },
    // Open reset password dialog
    openResetPasswordDialog() {
      this.resetPasswordDialogVisible = true;
    },
    // Handle password reset
    async handleResetPassword() {
      try {
        const response = await resetPassword(this.passwordForm);
        if (response.data.code === 200) {
          this.$message.success("密码修改成功！");
          this.resetPasswordDialogVisible = false;
          this.passwordForm = {originPassword: "", newPassword: ""};
        } else {
          this.$message.error("密码修改失败：" + response.data.msg);
        }
      } catch (error) {
        console.error("密码修改失败：", error);
        this.$message.error("修改密码时出现错误，请稍后重试！");
      }
    },
  },
};
</script>

<style>
.profile-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.profile-form {
  max-width: 600px;
  margin: auto;
}

.dialog-footer {
  text-align: right;
}
</style>
