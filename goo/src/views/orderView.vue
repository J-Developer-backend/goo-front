<template>
  <div class="order-container">
    <h2>我的订单</h2>
    <el-table :data="orders" border style="width: 100%">
      <el-table-column prop="itemName" label="商品名称" />
      <el-table-column prop="number" label="数量" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="sellUser" label="卖家" />
      <el-table-column prop="createTime" label="下单时间" />
      <el-table-column prop="status" label="状态">
        <!-- 根据状态值显示对应的状态文字 -->
        <template #default="scope">
          <span>
            {{ getStatusText(scope.row.status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <!-- 0状态：下单等待支付，可以取消或付款 -->
          <el-button
              v-if="scope.row.status === 0"
              size="mini"
              type="danger"
              @click="handleCancelOrder(scope.row.id)"
          >
            取消订单
          </el-button>
          <el-button
              v-if="scope.row.status === 0"
              size="mini"
              type="success"
              @click="handlePayOrder(scope.row.id)"
          >
            付款
          </el-button>
          <!-- 1状态：已支付，可以确认签收 -->
          <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="primary"
              @click="handleFinishOrder(scope.row.id)"
          >
            确认收货
          </el-button>
          <!-- 查看商品详情 -->
          <el-button
              size="mini"
              type="info"
              @click="handleItemDetails(scope.row.itemId)"
          >
            查看商品
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
</template>

<script>
import { getAllOrders, cancelOrder, finishOrder, getItemDetails, payOrder } from "@/api/api";

export default {
  data() {
    return {
      orders: [], // 存储订单数据
      dialogVisible: false, // 商品详情弹框可见性
      itemDetails: {}, // 当前选中的商品详情数据
    };
  },
  mounted() {
    this.fetchOrders(); // 页面加载时获取订单
  },
  methods: {
    // 获取所有订单
    async fetchOrders() {
      try {
        const response = await getAllOrders();
        if (response.data.code === 200) {
          this.orders = response.data.data; // 设置订单数据
        } else {
          this.$message.error("获取订单失败：" + (response.data.msg || "未知错误"));
        }
      } catch (error) {
        console.error("获取订单失败：", error);
        this.$message.error("请求订单数据时出现错误，请稍后重试！");
      }
    },
    // 获取订单状态对应的文字
    getStatusText(status) {
      switch (status) {
        case 0:
          return "下单等待支付";
        case 1:
          return "已支付";
        case 2:
          return "已完成";
        default:
          return "未知状态";
      }
    },
    // 取消订单
    async handleCancelOrder(orderId) {
      try {
        const response = await cancelOrder(orderId);
        if (response.data.code === 200) {
          this.$message.success("订单取消成功！");
          await this.fetchOrders(); // 重新加载订单列表
        } else {
          this.$message.error("取消订单失败：" + (response.data.msg || "未知错误"));
        }
      } catch (error) {
        console.error("取消订单失败：", error);
        this.$message.error("取消订单时出现错误，请稍后重试！");
      }
    },
    // 确认订单完成
    async handleFinishOrder(orderId) {
      try {
        const response = await finishOrder(orderId);
        if (response.data.code === 200) {
          this.$message.success("订单确认完成！");
          await this.fetchOrders(); // 重新加载订单列表
        } else {
          this.$message.error("确认订单失败：" + (response.data.msg || "未知错误"));
        }
      } catch (error) {
        console.error("确认订单失败：", error);
        this.$message.error("确认订单时出现错误，请稍后重试！");
      }
    },
    // 获取商品详情
    async handleItemDetails(itemId) {
      try {
        const response = await getItemDetails(itemId);
        if (response.data.code === 200) {
          this.itemDetails = response.data.data; // 设置商品详情数据
          this.dialogVisible = true; // 显示弹出框
        } else {
          this.$message.error("获取商品详情失败：" + (response.data.msg || "未知错误"));
        }
      } catch (error) {
        console.error("获取商品详情失败：", error);
        this.$message.error("请求商品详情时出现错误，请稍后重试！");
      }
    },
    // 付款订单
    async handlePayOrder(orderId) {
      try {
        const response = await payOrder(orderId, { responseType: 'text' }); // 调用付款接口，指定返回类型为纯文本
        // 直接打开返回的页面内容
        const newWindow = window.open("", "_blank"); // 打开新窗口
        newWindow.document.open();
        newWindow.document.write(response.data); // 将返回的页面 HTML 写入新窗口
        newWindow.document.close();
        this.$message.success("正在跳转到支付页面...");
      } catch (error) {
        console.error("付款失败：", error);
        this.$message.error("付款时出现错误，请稍后重试！");
      }
    },
  },
};
</script>

<style>
.order-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.item-details-image {
  width: 100%;
  max-width: 300px;
  border-radius: 4px;
  object-fit: cover;
}
</style>
