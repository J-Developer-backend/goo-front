<template>
  <div class="chat-container">
    <!-- 聊天对象下拉菜单 -->
    <el-select v-model="selectedUser" placeholder="选择聊天对象" class="chat-select" style="width: 40%;"
      @change="handleSelectUser">
      <el-option v-for="user in users" :key="user.id" :label="user.username" :value="user.id">
      </el-option>
    </el-select>

    <!-- 聊天内容区域 -->
    <div class="chat-content" ref="chatContent">
      <div v-for="message in messages" :key="message.id" class="message">
        <div :class="{ 'my-message': message.self, 'other-message': !message.self }">
          {{ message.content }}
        </div>
      </div>
    </div>

    <!-- 聊天输入区域 -->
    <el-input type="textarea" v-model="inputMessage" placeholder="请输入消息" @keyup.enter.native="sendMessage">
    </el-input>
    <el-button type="primary" @click="sendMessage">发送</el-button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      selectedUser: '',
      users: [],
      messages: [],
      inputMessage: '',
    };
  },
  mounted() {
    let url = '/api//message/getChattedUsers'
    axios({
      method: 'get',
      url: url,
      headers: {
        token: ''
      }
    }).then(res => {
      this.users = res.data.data
      //this.users = [{username: "name1", id: 1}, {username: "name2", id: 2}]
    });
  },
  methods: {
    sendMessage() {
      if (!this.selectedUser) {
        this.$message.error("必须选择一个用户进行交流！")
        return
      }
      if (this.inputMessage.trim() === '') {
        this.$message.error("消息不能为空！")
        return
      }
      const newMessage = {
        content: this.inputMessage,
        self: true, // 假设所有消息都是自己发送的
      };
      this.messages.push(newMessage);
      this.$nextTick(() => {
        this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
      });
      let url = "/api/message/add"
      axios({
        method: 'post',
        url: url,
        headers: {
          token: ''
        },
        data: {
          "context": this.inputMessage,
          "receiveId": this.selectedUser
        }
      }).then(res => {
        this.$message.success(res.data.msg)
        this.inputMessage = ''
      })
    },
    handleSelectUser() {
      let url = "/api/message/getAllMessage?receiveId=" + this.selectedUser
      let otherUser = ""
      this.users.forEach(user => {
        if (user.id === this.selectedUser) {
          otherUser = user.username
        }
      })
      axios({
        method: 'get',
        url: url,
        headers: {
          token: ''
        }
      }).then(res => {
        let data = res.data.data
        data.forEach(m => {
          const message = {
            content: m.context,
            self: m.receiveUserName === otherUser
          }
          this.messages.push(message)
        });
      });
    }
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-select {
  margin: 10px;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin: 10px;
  border: 1px solid #ebeef5;
  width: 80%;
  height: 10vb;
}

.message {
  margin-bottom: 8px;
}

.my-message {
  background-color: #0ef428;
  border-radius: 5px;
  padding: 10px;
  max-width: 40%;
  margin-left: auto;
  word-wrap: break-word;
  /* 允许长单词换行 */
  ;
  text-align: right;
  width: fit-content;
}

.other-message {
  background-color: #0ab6f0;
  border-radius: 5px;
  padding: 10px;
  max-width: 40%;
  margin-right: auto;
  word-wrap: break-word;
  /* 允许长单词换行 */
  ;
  text-align: left;
  width: fit-content;
}
</style>