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
		<el-button type="primary" @click="login">登录</el-button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			form: {
				username: "",
				password: ""
			}
		}
	},
	methods: {
		login() {
			alert("username:" + this.form.username)
			alert("password:" + this.form.password)
			this.$router.push("/home")
		}
	}
}
</script>

<style></style>