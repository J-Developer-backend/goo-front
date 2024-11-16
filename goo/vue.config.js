const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
		port: 7070,
		proxy: {
			'/api': {//前端请求前缀，eg：/api/admin/employee/login
				target: 'http://localhost:8080',//代理转发，http://localhost:8080/admin/employee/login
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	}
})
