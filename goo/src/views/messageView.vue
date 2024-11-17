<template>
  <div class="chat-app">
    <!-- Left Panel: Chat List -->
    <div class="chat-list">
      <el-input v-model="searchQuery" placeholder="搜索" class="search-bar"></el-input>
      <el-scrollbar class="chat-list-scroll">
        <el-menu :default-active="activeChatId" @select="handleChatSelect">
          <el-menu-item
              v-for="chat in filteredChats"
              :key="chat.id"
              :index="chat.id.toString()"
              class="chat-item"
          >
            <div class="chat-avatar">
              <img :src="chat.avatar || defaultAvatar" alt="Avatar" />
            </div>
            <div class="chat-info">
              <div class="chat-name">{{ chat.username }}</div>
              <div class="chat-last-message">{{ chat.lastMessage || "暂无消息" }}</div>
            </div>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- Right Panel: Chat Content -->
    <div class="chat-content">
      <div v-if="activeChatId">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="chat-title">{{ activeChat?.username }}</div>
        </div>

        <!-- Chat Messages -->
        <el-scrollbar class="chat-messages">
          <div
              v-for="message in messages"
              :key="message.id"
              :class="['message', message.sendId === userId ? 'message-right' : 'message-left']"
          >
            <img
                class="message-avatar"
                :src="message.sendId === userId ? userAvatar : activeChat.avatar"
                alt="Avatar"
            />
            <div class="message-content">
              <div class="message-username">
                {{ message.sendId === userId ? "我" : activeChat.username }}
              </div>
              <div class="message-text">{{ message.context }}</div>
            </div>
          </div>
        </el-scrollbar>

        <!-- Chat Input -->
        <div class="chat-input">
          <el-input
              v-model="newMessage"
              placeholder="输入消息..."
              @keyup.enter="sendMessageHandler"
          ></el-input>
          <el-button type="primary" @click="sendMessageHandler">发送</el-button>
        </div>
      </div>
      <div v-else class="no-chat-selected">请选择一个聊天开始对话</div>
    </div>
  </div>
</template>

<script>
import { getChattedUsers, getAllMessages, sendMessage } from "@/api/api";
import {mapState} from "vuex";

export default {
  data() {
    return {
      userAvatar: "path_to_user_avatar", // Avatar for the current user
      defaultAvatar: "path_to_default_avatar", // Fallback avatar for users
      chats: [], // All chatted users
      messages: [], // Chat messages for the active chat
      activeChatId: null, // Currently active chat ID
      searchQuery: "", // Search query
      newMessage: "", // New message text
    };
  },
  computed: {
    ...mapState({
      userId: state => state.userId
    }),
    activeChat() {
      return this.chats.find((chat) => chat.id === this.activeChatId) || null;
    },
    filteredChats() {
      if (this.searchQuery) {
        return this.chats.filter((chat) =>
            chat.username.includes(this.searchQuery)
        );
      }
      return this.chats;
    },
  },
  mounted() {
    console.log(this.userId);
    this.fetchChattedUsers();
  },
  methods: {
    async fetchChattedUsers() {
      try {
        const response = await getChattedUsers();
        if (response.data.code === 200) {
          this.chats = response.data.data;
        } else {
          this.$message.error("获取聊天用户列表失败");
        }
      } catch (error) {
        console.error("获取聊天用户列表失败", error);
        this.$message.error("网络错误，请稍后重试");
      }
    },
    async fetchMessages(receivedId) {
      try {
        const response = await getAllMessages(receivedId);
        if (response.data.code === 200) {
          this.messages = response.data.data;
        } else {
          this.$message.error("获取聊天记录失败");
        }
      } catch (error) {
        console.error("获取聊天记录失败", error);
        this.$message.error("网络错误，请稍后重试");
      }
    },
    handleChatSelect(chatId) {
      this.activeChatId = parseInt(chatId);
      this.fetchMessages(this.activeChatId);
    },


    async sendMessageHandler() {
      if (!this.newMessage.trim()) {
        this.$message.warning("消息不能为空");
        return;
      }
      try {
        const data = {
          context: this.newMessage,
          receiveId: this.activeChatId, // 修改为 receiveId
        };
        const response = await sendMessage(data);
        if (response.data.code === 200) {
          this.messages.push({
            id: Date.now(),
            context: this.newMessage,
            sendId: this.userId,
            receiveId: this.activeChatId,
            avatar: this.userAvatar,
          });
          this.newMessage = "";
        } else {
          this.$message.error("发送消息失败");
        }
      } catch (error) {
        console.error("发送消息失败", error);
        this.$message.error("网络错误，请稍后重试");
      }
    }
  },
};
</script>

<style scoped>
.chat-app {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}
.chat-list {
  width: 300px;
  border-right: 1px solid #ddd;
  background: #fff;
}
.chat-list-scroll {
  height: calc(100% - 50px);
}
.search-bar {
  margin: 10px;
}
.chat-item {
  display: flex;
  padding: 10px;
  cursor: pointer;
}
.chat-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.chat-info {
  margin-left: 10px;
}
.chat-name {
  font-weight: bold;
}
.chat-last-message {
  font-size: 12px;
  color: #666;
}
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
}
.chat-header {
  padding: 10px;
  background: #fff;
  border-bottom: 1px solid #ddd;
}
.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #f9f9f9;
}
.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}
.message-left {
  flex-direction: row;
}
.message-right {
  flex-direction: row-reverse;
}
.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.message-content {
  max-width: 60%;
  padding: 10px;
  margin: 0 10px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.message-username {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}
.message-text {
  font-size: 14px;
}
.chat-input {
  display: flex;
  padding: 10px;
  background: #fff;
  border-top: 1px solid #ddd;
}
.chat-input input {
  flex: 1;
  margin-right: 10px;
}
</style>
