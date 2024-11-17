<template>
  <div>
    <div class="order-container">
      <h2>我的订单</h2>
      <div>
        <el-row :gutter="20">
          <el-col :span="6">
            <div>
              状态
              <el-select style="width: 200px;" v-model="searchData.status" placeholder="状态">
                <el-option v-for="s in searchData.statuses" :key="s" :value="s.id" :label="s.status">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-button style="float: left; margin-left: 50px; width: 150px;" type="primary" @click="handleSearch">搜
                索</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table :data="orders" border style="width: 100%">
        <el-table-column prop="itemName" label="商品名称" width="120" />
        <el-table-column prop="number" label="订单号" width="150" />
        <el-table-column prop="price" label="价格" width="120" />
        <el-table-column prop="sellUser" label="卖家" width="120" />
        <el-table-column prop="creatTime" label="下单时间" width="180" />
        <el-table-column prop="status" label="状态" width="150">
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
            <el-button v-if="scope.row.status === 0" size="mini" type="danger" @click="handleCancelOrder(scope.row.id)">
              取消订单
            </el-button>
            <el-button v-if="scope.row.status === 0" size="mini" type="success" @click="handlePayOrder(scope.row.id)">
              付款
            </el-button>
            <!-- 1状态：已支付，可以确认签收 -->
            <el-button v-if="scope.row.status === 1" size="mini" type="primary"
              @click="handleFinishOrder(scope.row.id)">
              确认收货
            </el-button>
            <el-button size="mini" type="warning" @click="handleElse(scope.row)">
              其他信息
            </el-button>
            <!-- 查看商品详情 -->
            <el-button size="mini" type="info" @click="handleItemDetails(scope.row.itemId)">
              查看商品
            </el-button>
            <el-button v-if="scope.row.status === 2" size="mini" type="danger"
              @click="handleShowComment(scope.row.itemId)">
              评价
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
      <el-dialog title="订单其他信息" :visible.sync="dialogElseVisible" width="40%">
        <el-descriptions title="地点信息" border>
          <el-descriptions-item label="货源地">{{ elseDetails.source }}</el-descriptions-item>
          <el-descriptions-item label="目的地">{{ elseDetails.target }}</el-descriptions-item>
        </el-descriptions>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogElseVisible = false">关闭</el-button>
        </span>
      </el-dialog>
      <el-dialog title="发表评论" :visible.sync="dialogCommentVisible" width="40%">
        <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="comment.context">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancelComment" type="danger">关 闭</el-button>
          <el-button @click="handleAddComment" type="primary">发 表</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="block">
      <el-pagination @size-change="handleCurrentChange" @current-change="handleCurrentChange" :current-page.sync="page"
        page-size="10" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getAllOrders, cancelOrder, finishOrder, getItemDetails, payOrder } from "@/api/api";
import axios from "axios"

export default {
  data() {
    return {
      orders: [], // 存储订单数据
      dialogVisible: false, // 商品详情弹框可见性
      dialogElseVisible: false,
      dialogCommentVisible: false,
      itemDetails: {}, // 当前选中的商品详情数据
      elseDetails: {},
      total: 0,
      page: 1,
      searchData: {
        status: 0,
        statuses: [
          { id: 0, status: '下单等待支付' },
          { id: 1, status: '已支付' },
          { id: 2, status: '已完成' },
          { id: 3, status: '已取消' }
        ]
      },
      comment: {
        itemId: '',
        context: ''
      }
    };
  },
  mounted() {
    this.fetchOrders(); // 页面加载时获取订单
  },
  methods: {
    // 获取所有订单
    async fetchOrders() {
      try {
        const response = await getAllOrders(this.page, this.searchData.status);
        if (response.data.code === 200) {
          this.orders = response.data.data.record; // 设置订单数据
          this.total = response.data.data.total
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
        case 3:
          return "已取消"
        default:
          return "未知状态";
      }
    },
    // 取消订单
    async handleCancelOrder(orderId) {
      try {
        const response = await cancelOrder(orderId);
        if (response.data.code === 200) {
          window.location.reload()
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
          window.location.reload()
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
    // 页号改变
    handleCurrentChange() {
      this.fetchOrders()
    },
    handleSearch() {
      this.fetchOrders()
    },
    handleElse(row) {
      this.elseDetails = row
      this.dialogElseVisible = true
    },
    handleShowComment(itemId) {
      this.comment.itemId = itemId
      this.dialogCommentVisible = true
    },
    handleCancelComment() {
      this.comment.context = ''
      this.dialogCommentVisible = false
    },
    handleAddComment() {
      let url = '/api/comment/add'
      axios({
        method: 'post',
        url: url,
        headers: {
          "Content-Type": 'application/json',
          // TODO add token
          token: ''
        },
        data: this.comment
      }).then(res => {
        this.dialogCommentVisible = false
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
  }
};
</script>

<style>
.order-container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
}

.item-details-image {
  width: 100%;
  max-width: 300px;
  border-radius: 4px;
  object-fit: cover;
}
</style>
