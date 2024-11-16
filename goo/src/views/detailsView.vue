<template>
  <div class="item-details-container">
    <h2>{{ item.name }}</h2>
    <el-row>
      <el-col :span="12">
        <img :src="item.image" alt="商品图片" class="item-image" />
      </el-col>
      <el-col :span="12">
        <p><strong>分类:</strong> {{ item.categoryName }}</p>
        <p><strong>价格:</strong> ¥{{ item.price }}</p>
        <p><strong>描述:</strong> {{ item.description }}</p>
        <p><strong>位置:</strong> {{ item.location }}</p>
        <p><strong>收藏时间:</strong> {{ item.createTime }}</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getItemDetails } from "@/api/api";

export default {
  data() {
    return {
      item: {}, // 商品详情数据
    };
  },
  async mounted() {
    const itemId = this.$route.params.itemId; // 获取路由参数中的商品ID
    await this.fetchItemDetails(itemId); // 请求商品详情
  },
  methods: {
    async fetchItemDetails(itemId) {
      try {
        const response = await getItemDetails(itemId);
        if (response.data.code === 200) {
          this.item = response.data.data; // 解析商品详情数据
        } else {
          this.$message.error("获取商品详情失败：" + (response.data.msg || "未知错误"));
        }
      } catch (error) {
        console.error("获取商品详情失败：", error);
        this.$message.error("请求商品详情时出现错误，请稍后重试！");
      }
    },
  },
};
</script>

<style>
.item-details-container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
}

.item-image {
  width: 100%;
  max-width: 400px;
  border-radius: 4px;
  object-fit: cover;
}
</style>
