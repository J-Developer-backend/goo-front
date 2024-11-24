<template>
    <div>
        <div>
            <el-button style="float: right; margin-left: 50px; width: 150px;" type="primary" @click="handleShowAdd">
                新增商品
            </el-button>
            <el-dialog title="新增商品" :visible.sync="dialogFormVisible" class='dialog'>
                <el-form :model="addItem">
                    <el-form-item label="商品名称" class="input-box">
                        <el-input v-model="addItem.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" class="input-box">
                        <el-input v-model="addItem.price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品地点" class="input-box">
                        <el-input v-model="addItem.location"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" style="width: 37%;">
                        <el-select style="width: 120px;" v-model="addItem.categoryId" placeholder="分类">
                            <el-option v-for="category in categorys" :key="category" :value="category.id"
                                :label="category.categoryName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品描述" class="input-box">
                        <el-input v-model="addItem.description"></el-input>
                    </el-form-item>
                    <el-form-item label="商品图片" class="input-box">
                        <el-upload class="avatar-uploader" action="/api//upload" :show-file-list="false"
                            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" alt="">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleAddItemCancel">取 消</el-button>
                    <el-button type="primary" @click="handleAddItem">新 增</el-button>
                </div>
            </el-dialog>
            <el-button style="float: right; width: 120px;" type="danger" @click="handleDelete">删除</el-button>
        </div>
        <div>
            <el-table ref="multipleTable" :data="itemData" style="width: 100%" tooltip-effect="dark"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
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
                        <el-button size="mini" type="success" @click="handleDetail(scope.row)">详情</el-button>
                        <el-button size="mini" type="warning" @click="handleUpdate(scope.row)">修改</el-button>
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
                                            <img :src="itemDetails.image" alt="Image"
                                                style="width: 100px; height: auto;">
                                        </template>
                                    </el-descriptions-item>
                                </el-descriptions>
                            </span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false" type="primary">确 定</el-button>
                            </span>
                        </el-dialog>
                        <el-dialog title="修改商品" :visible.sync="dialogUpdateVisible" class='dialog'>
                            <el-form :model="updateItem">
                                <el-form-item label="商品名称" class="input-box">
                                    <el-input v-model="updateItem.name"></el-input>
                                </el-form-item>
                                <el-form-item label="商品价格" class="input-box">
                                    <el-input v-model="updateItem.price"></el-input>
                                </el-form-item>
                                <el-form-item label="商品地点" class="input-box">
                                    <el-input v-model="updateItem.location"></el-input>
                                </el-form-item>
                                <el-form-item label="分类" style="width: 37%;">
                                    <el-select style="width: 120px;" v-model="updateItem.categoryId" placeholder="分类">
                                        <el-option v-for="category in categorys" :key="category" :value="category.id"
                                            :label="category.categoryName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="商品描述" class="input-box">
                                    <el-input v-model="updateItem.description"></el-input>
                                </el-form-item>
                                <el-form-item label="商品图片" class="input-box">
                                    <el-upload class="avatar-uploader" action="/api//upload" :show-file-list="false"
                                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                        <img v-if="updateItem.image" :src="updateItem.image" alt="" style="width: 90%;">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="handleUpdateItemCancel">取 消</el-button>
                                <el-button type="primary" @click="handleUpdateItem">修 改</el-button>
                            </div>
                        </el-dialog>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

export default {

    data() {
        return {
            itemData: [],
            itemDetails: {},
            dialogVisible: false,
            multipleSelection: [],
            dialogFormVisible: false,
            addItem: {
                categoryId: '',
                description: '',
                image: '',
                location: '',
                name: '',
                price: ''
            },
            categorys: [],
            imageUrl: '',
            dialogUpdateVisible: false,
            updateItem: {
                id: '',
                categoryId: '',
                description: '',
                image: '',
                location: '',
                name: '',
                price: ''
            }
        }
    },
    mounted() {
        let url = 'api/item'
        axios({
            method: 'get',
            url: url,
            headers: {
                // TODO add token
                token: ''
            }
        }).then(res => {
            if (res.data.code != 200) {
				this.$message.error("无法获取数据：" + res.data.msg);
				return;
			}
            this.itemData = res.data.data
        })
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
        },

        // 多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        handleDelete() {
            if (this.multipleSelection.length === 0) {
                this.$message.error('没有选择商品');
                return
            }
            let url = '/api/item?ids='
            this.multipleSelection.forEach(row => {
                url = url + row.id + ','
            })
            url = url + '-1'
            axios({
                method: 'delete',
                url: url,
                headers: {
                    // TODO add token
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
                // 刷新当前页面
                window.location.reload();
            });
        },
        handleShowAdd() {
            this.dialogFormVisible = true;
            axios({
                method: 'get',
                url: '/api/category',
                headers: {
                    // TODO add token
                    token: ''
                }
            }).then(res => {
                this.categorys = res.data.data
            });
        },
        handleAddItemCancel() {
            this.dialogFormVisible = false
            this.addItem.categoryId = ''
            this.addItem.description = ''
            this.addItem.image = ''
            this.addItem.location = ''
            this.addItem.name = ''
            this.addItem.price = ''
        },

        handleAddItem() {
            let url = '/api/item'
            if (!this.addItem.name || 
            !this.addItem.categoryId ||
            !this.addItem.description ||
            !this.addItem.image ||
            !this.addItem.location ||
            !this.addItem.price) {
                this.$message.error("商品信息不能有空值！")
                return
            }
            if (parseFloat(this.addItem.price) <= 0.0) {
                this.$message.error("商品价格不合理")
                return
            }
            axios({
                method: 'post',
                url: url,
                headers: {
                    "Content-Type": 'application/json',
                    // TODO add token
                    "token": ''
                },
                data: this.addItem
            }).then(res => {
                this.dialogFormVisible = false
                if (res.data.code === 200) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                } else {
                    this.$message.error(res.data.msg);
                }
                window.location.reload();
            });
        },

        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.addItem.image = res.data
            this.updateItem.image = res.data
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleUpdate(row) {
            this.updateItem.id = row.id
            let url = '/api/item/' + row.id
            axios({
                method: 'get',
                url: url,
                headers: {
                    // TODO add token
                    token: ''
                }
            }).then(res => {
                let data = res.data.data
                this.updateItem.categoryId = data.categoryId
                this.updateItem.description = data.description
                this.updateItem.image = data.image
                this.updateItem.location = data.location
                this.updateItem.name = data.name
                this.updateItem.price = data.price
                this.dialogUpdateVisible = true
            });
            axios({
                method: 'get',
                url: '/api/category',
                headers: {
                    // TODO add token
                    token: ''
                }
            }).then(res => {
                this.categorys = res.data.data
            });
        },
        handleUpdateItemCancel() {
            this.dialogUpdateVisible = false
        },

        handleUpdateItem() {
            if (!this.updateItem.name || 
            !this.updateItem.categoryId ||
            !this.updateItem.description ||
            !this.updateItem.image ||
            !this.updateItem.location ||
            !this.updateItem.price) {
                this.$message.error("商品信息不能有空值！")
                return
            }
            if (parseFloat(this.updateItem.price) <= 0.0) {
                this.$message.error("商品价格不合理")
                return
            }
            let url = '/api/item/update'
            axios({
                method: 'put',
                url: url,
                headers: {
                    "Content-Type": 'application/json',
                    // TODO add token
                    token: ''
                },
                data: this.updateItem
            }).then(res => {
                this.dialogUpdateVisible = false
                if (res.data.code === 200) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                } else {
                    this.$message.error(res.data.msg);
                }
                window.location.reload();
            });
        }

    }
}
</script>

<style>
.dialog {
    width: 80%;
    /* 或其他百分比 */
    margin: auto;
}

.input-box {
    width: 80%;
    /* 输入框宽度填满对话框 */
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    object-fit: contain;
}
</style>