<template>
	<div>
		<div>
			<el-row :gutter="20">
				<el-col :span="4">
					<div class="grid-content bg-purple">
						<el-form ref="form" :model="form" label-width="100px">
							<el-form-item label="商品名">
								<el-input v-model="input" placeholder="请输入商品名"></el-input>
							</el-form-item>
						</el-form>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content bg-purple-light">

					</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content bg-purple">

					</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content bg-purple-light">

					</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content bg-purple">

					</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content bg-purple-light">
						<el-button type="primary">搜索</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<el-table :data="itemData" style="width: 100%">
			<el-table-column label="商品名称" width="180">
				<template slot-scope="scope">
					<i class="el-icon-time"></i>
					<span style="margin-left: 10px">{{ scope.row.date }}</span>
				</template>
			</el-table-column>
			<el-table-column label="姓名" width="180">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>姓名: {{ scope.row.name }}</p>
						<p>住址: {{ scope.row.address }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{ scope.row.name }}</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			form: [
				{
					input: "123"
				}
			],
			itemData: [{
				date: '2016-05-02',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1518 弄'
			}, {
				date: '2016-05-04',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1517 弄'
			}, {
				date: '2016-05-01',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1519 弄'
			}, {
				date: '2016-05-03',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1516 弄'
			}, {
				date: '2016-05-02',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1518 弄'
			}, {
				date: '2016-05-04',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1517 弄'
			}, {
				date: '2016-05-01',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1519 弄'
			}, {
				date: '2016-05-03',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1516 弄'
			}]
		}
	},
	methods: {
		handleEdit(index, row) {
			console.log(index, row);
		},
		handleDelete(index, row) {
			console.log(index, row);
		}
	}
}
</script>

<style>
.el-row {
	margin-bottom: 20px;

	&:last-child {
		margin-bottom: 0;
	}
}

.el-col {
	border-radius: 4px;
}

.bg-purple-dark {
	background: #ffffff;
}

.bg-purple {
	background: #ffffff;
}

.bg-purple-light {
	background: #ffffff;
}

.grid-content {
	border-radius: 4px;
	min-height: 36px;
}

.row-bg {
	padding: 10px 0;
	background-color: #ffffff;
}
</style>