<template>
  <div class="favorite-container">
    <h2>我的收藏</h2>
    <el-table :data="favorites" border style="width: 100%">
      <el-table-column prop="name" label="商品名称" width="150" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="location" label="位置" />
      <el-table-column label="图片">
        <template #default="scope">
          <img :src="scope.row.image" alt="商品图片" class="item-image" />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" />
    </el-table>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="perSize"
        :current-page="page"
        @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import { getFavorites } from "@/api/api";

export default {
  data() {
    return {
      page: 1, // 当前页
      perSize: 10, // 每页条数
      favorites: [], // 收藏数据
      total: 0, // 总记录数
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
  },
};
</script>

<style>
.favorite-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
