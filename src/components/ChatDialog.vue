<template>
  <div class="chat-dialog">
    <!-- Chat Header -->
    <div class="chat-header">
      <div class="header-content">
        <div class="back-button" @click="$emit('back')">
          <q-icon name="arrow_back" size="24px" color="primary" />
        </div>
        <div class="contact-info">
          <div 
            v-if="contact"
            class="custom-avatar-small"
            :style="{
              backgroundColor: getAvatarProps(contact).color,
              color: getAvatarProps(contact).textColor
            }"
          >
            {{ getAvatarProps(contact).text }}
          </div>
          <div class="contact-details">
            <div class="contact-name">{{ contact }}</div>
            <div class="contact-id">ID{{ contact?.replace(/\s/g, '') }}</div>
          </div>
        </div>
        <div class="header-actions">
          <q-icon name="volume_up" size="20px" color="grey-6" />
        </div>
      </div>
      <div class="chat-date">{{ formatCurrentDate() }}</div>
    </div>

    <!-- Messages Area -->
    <div class="messages-area" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message-wrapper"
        :class="{ 'own-message': message.from === 'You' }"
      >
        <div class="message-bubble">
          <div class="message-text">{{ message.message }}</div>
          <div class="message-time">{{ formatMessageTime(message.timestamp) }}</div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area">
      <div class="input-actions">
        <div class="action-item">
          <q-icon name="camera_alt" size="20px" color="grey-6" />
          <span class="action-text">Send Photo</span>
        </div>
        <div class="action-item">
          <q-icon name="favorite" size="20px" color="grey-6" />
          <span class="action-text">Send Sticker</span>
        </div>
        <div class="action-item">
          <q-icon name="sentiment_satisfied_alt" size="20px" color="grey-6" />
          <span class="action-text">Emoji</span>
        </div>
      </div>
      <div class="input-container">
        <q-input
          v-model="newMessage"
          placeholder="Enter Message"
          outlined
          dense
          @keyup.enter="sendMessage"
          class="message-input"
        />
        <div class="input-meta">
          <div class="char-counter">{{ newMessage.length }}/200</div>
          <div class="service-icons">
            <q-icon name="android" size="16px" color="green" />
            <q-icon name="android" size="16px" color="grey-4" />
          </div>
          <q-btn
            round
            color="green"
            icon="send"
            size="md"
            @click="sendMessage"
            :disable="!newMessage.trim()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { ChatMessage } from 'src/types/chat';
import { getAvatarProps } from 'src/utils/avatars';

interface Props {
  contact: string | null;
  messages: ChatMessage[];
}

interface Emits {
  (e: 'back'): void;
  (e: 'send-message', message: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const newMessage = ref('');
const messagesContainer = ref<HTMLElement>();

// Methods
const sendMessage = () => {
  if (newMessage.value.trim()) {
    emit('send-message', newMessage.value);
    newMessage.value = '';
  }
};

const formatCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};

const formatMessageTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Auto-scroll to bottom when new messages arrive
watch(() => props.messages.length, async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}, { immediate: true });
</script>

<style scoped>
.chat-dialog {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.back-button {
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #f5f5f5;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  margin-left: 12px;
}

.custom-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.contact-avatar-img {
  font-weight: 600;
  font-size: 12px;
}

.contact-details {
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.contact-id {
  font-size: 12px;
  color: #666;
}

.header-actions {
  display: flex;
  align-items: center;
}

.chat-date {
  text-align: center;
  font-size: 12px;
  color: #666;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.message-wrapper {
  display: flex;
  margin-bottom: 16px;
}

.message-wrapper.own-message {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.message-wrapper:not(.own-message) .message-bubble {
  background: #e3f2fd;
  color: #333;
}

.message-wrapper.own-message .message-bubble {
  background: #1976d2;
  color: white;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
}

.input-area {
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 16px 20px;
}

.input-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.action-item:hover {
  background-color: #f5f5f5;
}

.action-text {
  font-size: 12px;
  color: #666;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.message-input {
  flex: 1;
}

.input-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.char-counter {
  font-size: 11px;
  color: #666;
  min-width: 40px;
}

.service-icons {
  display: flex;
  align-items: center;
  gap: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .input-actions {
    gap: 12px;
  }
  
  .action-text {
    display: none;
  }
}
</style> 