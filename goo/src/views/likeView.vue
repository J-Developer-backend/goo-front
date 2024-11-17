<template>
  <div>
    <div class="favorite-container">
      <h2>我的收藏</h2>
      <el-table :data="favorites" border style="width: 100%">
        <el-table-column prop="name" label="商品名称" width="120" />
        <el-table-column prop="description" label="描述" width="120" />
        <el-table-column prop="price" label="价格" width="120" />
        <el-table-column prop="location" label="位置" width="120" />
        <el-table-column label="图片" width="150">
          <template #default="scope">
            <img :src="scope.row.image" alt="商品图片" class="item-image" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">
              查看详情
            </el-button>
            <el-button size="mini" type="danger" @click="handleCancel(scope.row)">
              取消收藏
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 商品详情弹出框 -->
      <el-dialog title="商品详情" :visible.sync="dialogVisible" width="40%">
        <el-descriptions title="商品信息" border>
          <el-descriptions-item label="商品名称">{{ itemDetails.name }}</el-descriptions-item>
          <el-descriptions-item label="价格">{{ itemDetails.price }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{ itemDetails.categoryName }}</el-descriptions-item>
          <el-descriptions-item label="卖方">{{ itemDetails.username }}</el-descriptions-item>
          <el-descriptions-item label="货源地">{{ itemDetails.location }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ itemDetails.description }}</el-descriptions-item>
          <el-descriptions-item label="图片">
            <img :src="itemDetails.image" alt="商品图片" class="item-details-image" />
          </el-descriptions-item>
        </el-descriptions>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="block">
      <el-pagination @size-change="handlePageChange" @current-change="handlePageChange" :current-page.sync="page"
        page-size="10" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getFavorites } from "@/api/api";
import axios from 'axios'

export default {
  data() {
    return {
      page: 1, // 当前页
      perSize: 10, // 每页条数
      favorites: [], // 收藏数据
      total: 0, // 总记录数
      dialogVisible: false, // 商品详情弹框可见性
      itemDetails: {}, // 当前选中的商品详情数据
    };
  },
  mounted() {
    this.fetchFavorites(); // 页面加载时请求数据
  },
  methods: {
    // 获取收藏数据
    async fetchFavorites() {
      try {
        const response = await getFavorites(this.page, this.perSize);
        if (response.data.code === 200) {
          this.favorites = response.data.data.record; // 解析 record 数据
          this.total = response.data.data.total; // 获取总记录数
        } else {
          this.$message.error("获取收藏数据失败：" + (response.data.msg || "未知错误"));
        }
      } catch (error) {
        console.error("获取收藏数据失败：", error);
        this.$message.error("请求收藏数据时出现错误，请稍后重试！");
      }
    },
    // 页码变更时触发
    handlePageChange(newPage) {
      this.page = newPage;
      this.fetchFavorites();
    },
    // 显示商品详情
    handleDetail(row) {
      this.itemDetails = row; // 设置当前商品详情
      this.dialogVisible = true; // 显示弹框
    },
    handleCancel(row) {
      let id = row.id
      axios({
        method: 'delete',
        url: '/api/favorite/' + id,
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
      })
    }
  },
};
</script>

<style>
.favorite-container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details-image {
  width: 100%;
  max-width: 300px;
  border-radius: 4px;
  object-fit: cover;
}
</style>
