<template>

	<div>
		<el-container style="height: 100vh;">
			<el-aside width="200px">
				<el-row class="tac">
					<el-col :span="12">
						<el-menu router default-active="1" class="el-menu-vertical-demo, el-menu-item" 
						background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
							<el-menu-item index="/home/items">
								<i class="el-icon-menu"></i>
								<span slot="title">商品首页</span>
							</el-menu-item>
							<el-menu-item index="order">
								<i class="el-icon-menu"></i>
								<span slot="title">我的订单</span>
							</el-menu-item>
							<el-menu-item index="/home/message">
								<i class="el-icon-menu"></i>
								<span slot="title">我的消息</span>
							</el-menu-item>
							<el-menu-item index="details">
								<i class="el-icon-menu"></i>
								<span slot="title">我的资料</span>
							</el-menu-item>
							<el-menu-item index="/home/like">
								<i class="el-icon-menu"></i>
								<span slot="title">我的收藏</span>
							</el-menu-item>						
						</el-menu>
					</el-col>
				</el-row>
			</el-aside>
			<el-main>
				<router-view/>
			</el-main>
		</el-container>

	</div>

</template>

<script>

export default {
}
</script>

<style>
.el-menu-item {
  width: 200px;
}
</style>