<template>
  <div class="add-item-container">
    <h2>新建商品</h2>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="商品分类">
        <el-input v-model="form.categoryId" placeholder="请输入分类ID"></el-input>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model="form.name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input
            type="textarea"
            v-model="form.description"
            placeholder="请输入商品描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="form.price" placeholder="请输入商品价格"></el-input>
      </el-form-item>
      <el-form-item label="商品位置">
        <el-input v-model="form.location" placeholder="请输入商品位置"></el-input>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :on-change="handleFileChange"
            :show-file-list="false"
            :before-upload="beforeUpload"
        >
          <el-button type="primary">选择图片</el-button>
        </el-upload>
        <div class="image-preview">
          <div
              v-for="(image, index) in form.imageList"
              :key="index"
              class="image-preview-item"
          >
            <img :src="image" class="image-preview-img" />
            <el-button
                size="mini"
                type="danger"
                class="delete-btn"
                @click="removeImage(index)"
            >
              删除
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { uploadImage, submitItem } from "@/api/api";

export default {
  data() {
    return {
      form: {
        categoryId: "",
        name: "",
        description: "",
        price: "",
        location: "",
        imageList: [], // 存放上传图片的地址
      },
    };
  },
  methods: {
    // 上传图片时处理文件
    handleFileChange(file) {
      uploadImage(file.raw)
          .then((response) => {
            if (response.data.code === 0) {
              // 上传成功，存储图片地址
              this.form.imageList.push(response.data.data);
              this.$message.success("图片上传成功！");
            } else {
              this.$message.error("图片上传失败：" + response.data.msg);
            }
          })
          .catch((error) => {
            console.error("图片上传失败：", error);
            this.$message.error("图片上传失败，请稍后重试！");
          });
    },
    // 删除某张图片
    removeImage(index) {
      this.form.imageList.splice(index, 1);
    },
    // 提交表单
    submitForm() {
      const payload = {
        categoryId: this.form.categoryId,
        name: this.form.name,
        description: this.form.description,
        price: this.form.price,
        location: this.form.location,
        image: this.form.imageList.join(","), // 将图片地址拼接成字符串
      };

      submitItem(payload)
          .then((response) => {
            if (response.data.code === 0) {
              this.$message.success("商品创建成功！");
              this.$router.push("/home/items"); // 跳转到商品首页
            } else {
              this.$message.error("商品创建失败：" + response.data.msg);
            }
          })
          .catch((error) => {
            console.error("商品创建失败：", error);
            this.$message.error("商品创建失败，请稍后重试！");
          });
    },
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
      this.form.imageList = [];
    },
    // 限制文件上传类型
    beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        this.$message.error("只能上传图片文件！");
      }
      return isImage;
    },
  },
};
</script>

<style>
/* 样式保持不变 */
.add-item-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.upload-demo {
  margin-bottom: 20px;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-preview-item {
  position: relative;
  display: inline-block;
}

.image-preview-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}
</style>
