<template>
	<div>
		<div>
			<el-row :gutter="20">
				<el-col :span="4">
					<div class="grid-content bg-purple">
						<el-form ref="searchData" :model="searchData" label-width="100px">
							<el-form-item label="商品名">
								<el-input style="width: 150px;" v-model="searchData.searchName"
									placeholder="商品名"></el-input>
							</el-form-item>
						</el-form>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content bg-purple-light">
						<el-form ref="searchData" :model="searchData" label-width="100px">
							<el-form-item label="分类">
								<el-select style="width: 120px;" v-model="searchData.searchCategory" placeholder="分类">
									<el-option v-for="category in categoryNames" :key="category" :value="category.id"
										:label="category.categoryName">
									</el-option>
								</el-select>
							</el-form-item>
						</el-form>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content bg-purple">
						<el-form ref="searchData" :model="searchData" label-width="100px">
							<el-form-item label="货源地">
								<el-input style="width: 120px;" v-model="searchData.searchLocation"
									placeholder="货源地"></el-input>
							</el-form-item>
						</el-form>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content bg-purple-light">
						<el-form ref="searchData" :model="searchData" label-width="100px">
							<el-form-item label="价格下限">
								<el-input style="width: 120px;" v-model="searchData.minPrice"
									placeholder="价格下限"></el-input>
							</el-form-item>
						</el-form>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content bg-purple">
						<el-form ref="searchData" :model="searchData" label-width="100px">
							<el-form-item label="价格上限">
								<el-input style="width: 150px;" v-model="searchData.maxPrice"
									placeholder="价格上限"></el-input>
							</el-form-item>
						</el-form>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="grid-content bg-purple-light">
						<el-button type="primary" @click="handleSearch">搜索</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div>
			<el-table :data="itemData" style="width: 100%">
				<el-table-column label="商品名称" width="180">
					<template slot-scope="scope">
						<span style="margin-left: 10px">{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="图片" width="180">
					<template slot-scope="scope">
						<img :src="scope.row.image" alt="Image" style="width: 100px; height: auto;">
					</template>
				</el-table-column>
				<el-table-column label="价格" width="180">
					<template slot-scope="scope">
						<span style="margin-left: 10px">{{ scope.row.price }}</span>
					</template>
				</el-table-column>
				<el-table-column label="分类" width="180">
					<template slot-scope="scope">
						<span style="margin-left: 10px">
							<el-tag>{{ scope.row.categoryName }}</el-tag>
						</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" type="success" @click="handleDetail(scope.row)" style="width: 100;">详 情</el-button>
						<el-button size="mini" @click="handlePreOrder(scope.row)" type="primary">下 单</el-button>
						<el-button size="mini" type="danger" @click="handleLike(scope.row)">收 藏</el-button>
						<el-dialog title="商品详情" :visible.sync="dialogVisible" width="30%" center>
							<span>
								<el-descriptions title="商品信息">
									<el-descriptions-item label="商品名称">{{ itemDetails.name }}</el-descriptions-item>
									<el-descriptions-item label="价格">{{ itemDetails.price }}</el-descriptions-item>
									<el-descriptions-item label="分类">
										<el-tag size="small">{{ itemDetails.categoryName }}</el-tag>
									</el-descriptions-item>
									<el-descriptions-item label="卖方">{{ itemDetails.username }}</el-descriptions-item>
									<el-descriptions-item label="联系地址">{{ itemDetails.location }}</el-descriptions-item>
									<el-descriptions-item label="介绍">{{ itemDetails.description
										}}</el-descriptions-item>
									<el-descriptions-item label="图片">
										<template>
											<img :src="itemDetails.image" alt="Image" style="width: 80%; height: auto;">
										</template>
									</el-descriptions-item>
								</el-descriptions>
							</span>
							<div v-for="comment in comments" :key="comment">({{ comment.createTime }}) {{ comment.username }} : {{ comment.context }}</div>
							<span slot="footer" class="dialog-footer">
								<el-button @click="dialogVisible = false" type="primary" style="margin-left: 50px;">确 定</el-button>
							</span>
						</el-dialog>
						<el-dialog title="收货地址" :visible.sync="dialogFormVisible">
							<el-form :model="orderForm">
								<el-form-item label="地址" :label-width="formLabelWidth">
									<el-input v-model="orderForm.target"></el-input>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer">
								<el-button @click="dialogFormVisible = false">取 消</el-button>
								<el-button type="primary" @click="handleOrder">下 单</el-button>
							</div>
						</el-dialog>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="block">
			<el-pagination class="pagination-container" @size-change="handleSizeChange"
				@current-change="handleCurrentChange" :current-page="pageData.page" :page-sizes="pageData.pageSizes"
				:page-size="pageData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageData.total">
			</el-pagination>
		</div>
	</div>
</template>

<script>

import axios from 'axios'

export default {

	data() {
		return {
			categoryNames: [],
			searchData: {
				searchName: '',
				searchCategory: '',
				searchLocation: '',
				minPrice: '',
				maxPrice: ''
			},
			itemData: [],
			itemDetails: {},
			dialogVisible: false,
			dialogFormVisible: false,
			pageData: {
				total: 0,
				page: 1,
				pageSize: 10,
				pageSizes: [10, 20, 30, 40]
			},
			orderForm: {
				itemId: '',
				target: ''
			},
			comments: []
		}
	},
	// 首次分页查询
	mounted() {
		let url = '/api/item/pageQuery?' + 'page=' + this.pageData.page + '&'
			+ 'pageSize=' + this.pageData.pageSize
		axios({
			method: 'get',
			url: url,
			headers: {
				// TODO add token
				token: ''
			}
		}).then(res => {
			if (res.data.code != 200) {
				this.$message.error("无法获取商品：" + res.data.msg);
				return;
			}
			this.itemData = res.data.data.record
			this.pageData.total = res.data.data.total
		});
		axios({
			method: 'get',
			url: '/api/category',
			headers: {
				// TODO add token
				token: ''
			}
		}).then(res => {
			if (res.data.code != 200) {
				return;
			}
			this.categoryNames = res.data.data
		});
	},
	methods: {
		// 商品详情
		handleDetail(row) {
			let url = '/api/item/' + row.id
			axios({
				method: 'get',
				url: url,
				headers: {
					// TODO add token
					token: ''
				}
			}).then(res => {
				this.itemDetails = res.data.data
				this.dialogVisible = true
			});
			axios({
				method: 'get',
				url: '/api/comment/getByItemId?itemId=' + row.id,
				headers: {
					token: ''
				}
			}).then(res => {
				if (res.data.code === 200) {
					this.comments = res.data.data
				} else {
					this.$message.error(res.data.msg);
				}
			});
		},
		handleSizeChange(val) {
			this.pageData.pageSize = val
			this.handlePageChange()
		},
		handleCurrentChange(val) {
			this.pageData.page = val
			this.handlePageChange()
		},
		handlePageChange() {
			let url = this.getPageUrl()
			axios({
				method: 'get',
				url: url,
				headers: {
					// TODO add token
					token: ''
				}
			}).then(res => {
				this.itemData = res.data.data.record
				this.pageData.total = res.data.data.total
			});
		},
		getPageUrl() {
			let url = '/api/item/pageQuery?' + 'page=' + this.pageData.page + '&'
				+ 'pageSize=' + this.pageData.pageSize
			if (this.searchData.searchName != undefined && this.searchData.searchName != null && this.searchData.searchName != '') {
				url = url + '&' + 'itemName=' + this.searchData.searchName
			}
			if (this.searchData.searchCategory != undefined && this.searchData.searchCategory != null && this.searchData.searchCategory != '') {
				url = url + '&' + 'categoryId=' + this.searchData.searchCategory
			}
			if (this.searchData.searchLocation != undefined && this.searchData.searchLocation != null && this.searchData.searchLocation != '') {
				url = url + '&' + 'location=' + this.searchData.searchLocation
			}
			if (this.searchData.minPrice != undefined && this.searchData.minPrice != null && this.searchData.minPrice != '') {
				url = url + '&' + 'minPrice=' + this.searchData.minPrice
			}
			if (this.searchData.maxPrice != undefined && this.searchData.maxPrice != null && this.searchData.maxPrice != '') {
				url = url + '&' + 'maxPrice=' + this.searchData.maxPrice
			}
			return url
		},
		handleSearch() {
			this.handlePageChange()
			this.searchData.searchName = ''
			this.searchData.searchCategory = ''
			this.searchData.searchLocation = ''
			this.searchData.minPrice = ''
			this.searchData.maxPrice = ''
		},
		handleOrder() {
			this.dialogFormVisible = false
			let itemId = this.orderForm.itemId
			let target = this.orderForm.target
			this.orderForm.target = ''
			axios({
				method: 'post',
				url: '/api/orders',
				data: {
					'itemId': itemId,
					'target': target
				},
				headers: {
					token: ''
				}
			}).then(res => {
				if (res.data.code === 200) {
					this.$message({
						message: res.data.msg,
						type: 'success'
					});
				} else {
					this.$message.error(res.data.msg);
				}
			});
		},
		handlePreOrder(row) {
			this.orderForm.itemId = row.id
			this.dialogFormVisible = true
		},
		handleLike(row) {
			let itemId = row.id
			axios({
				method: 'post',
				url: '/api/favorite',
				data: {
					'itemId': itemId
				},
				headers: {
					token: ''
				}
			}).then(res => {
				if (res.data.code === 200) {
					this.$message({
						message: res.data.msg,
						type: 'success'
					});
				} else {
					this.$message.error(res.data.msg);
				}
			});
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

.pagination-container {
	position: fixed;
	bottom: 0;
	width: 100%;
	background-color: #fff;
	/* 根据需要设置背景颜色 */
	padding: 10px 0;
	box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
	/* 可选，添加阴影以突出显示 */
}
</style>