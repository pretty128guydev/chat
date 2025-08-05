<template>
  <div class="chat-app">
    <!-- Header -->
    <div class="chat-header">
      <div class="header-content">
        <div class="header-tabs">
          <div 
            class="tab" 
            :class="{ 'active': activeTab === 'recent' }"
            @click="setActiveTab('recent')"
          >
            Recent
            <q-badge v-if="totalUnreadCount > 0" color="red" :label="totalUnreadCount" />
          </div>
          <div 
            class="tab" 
            :class="{ 'active': activeTab === 'new' }"
            @click="setActiveTab('new')"
          >
            New
            <q-badge v-if="newContactsCount > 0" color="red" :label="newContactsCount" />
          </div>
        </div>
        <div class="connection-status">
          <q-badge 
            :color="isConnected ? 'green' : 'orange'" 
            :label="isConnected ? 'Connected' : 'Offline'"
            class="status-badge"
          />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="chat-content">
      <!-- Contacts Panel -->
      <div class="contacts-panel" :class="{ 'full-width': !showChat }">
        <div class="contacts-list">
          <div
            v-for="contact in displayedContacts"
            :key="contact.name"
            class="contact-item"
            :class="{ 'active': selectedContact === contact.name }"
            @click="selectContact(contact.name)"
          >
            <div class="contact-avatar">
              <div 
                class="custom-avatar"
                :style="{
                  backgroundColor: debugAvatarProps(contact.name).color,
                  color: debugAvatarProps(contact.name).textColor
                }"
              >
                {{ debugAvatarProps(contact.name).text }}
              </div>
            </div>
            <div class="contact-info">
              <div class="contact-name">{{ contact.name }}</div>
              <div class="contact-last-message">{{ contact.lastMessage }}</div>
            </div>
            <div class="contact-meta">
              <div class="contact-date">{{ formatDate(contact.lastMessageTime) }}</div>
              <q-badge
                v-if="contact.unreadCount > 0"
                color="primary"
                :label="contact.unreadCount"
                class="unread-badge"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Panel -->
      <div v-if="showChat" class="chat-panel">
        <ChatDialog
          :contact="selectedContact"
          :messages="currentMessages"
          @back="goBack"
          @send-message="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useChatStore } from 'src/stores/chat';
import { getAvatarProps } from 'src/utils/avatars';
import ChatDialog from './ChatDialog.vue';

const $q = useQuasar();
const chatStore = useChatStore();

// Computed properties
const contacts = computed(() => chatStore.contacts);
const newContacts = computed(() => chatStore.newContacts);
const selectedContact = computed(() => chatStore.selectedContact);
const currentMessages = computed(() => chatStore.currentMessages);
const activeTab = computed(() => chatStore.activeTab);
const totalUnreadCount = computed(() => chatStore.totalUnreadCount);
const newContactsCount = computed(() => chatStore.newContactsCount);
const isConnected = computed(() => chatStore.isConnected);

const displayedContacts = computed(() => {
  return activeTab.value === 'new' ? newContacts.value : contacts.value;
});

// Debug avatar props
const debugAvatarProps = (name: string) => {
  const props = getAvatarProps(name);
  console.log(`Avatar props for ${name}:`, props);
  return props;
};

const showChat = computed(() => {
  // Show chat on large screens or when a contact is selected on small screens
  return $q.screen.gt.sm || selectedContact.value !== null;
});

// Methods
const selectContact = (contactName: string) => {
  chatStore.selectContact(contactName);
};

const goBack = () => {
  chatStore.selectContact(null);
};

const sendMessage = (message: string) => {
  chatStore.sendMessage(message);
};

const setActiveTab = (tab: 'recent' | 'new') => {
  chatStore.setActiveTab(tab);
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  } else {
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit',
      year: 'numeric'
    });
  }
};

// Lifecycle
onMounted(() => {
  chatStore.connectWebSocket();
});

onUnmounted(() => {
  chatStore.disconnect();
});
</script>

<style scoped>
.chat-app {
  height: 100vh;
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
  justify-content: space-between;
  align-items: center;
}

.header-tabs {
  display: flex;
  gap: 20px;
}

.connection-status {
  display: flex;
  align-items: center;
}

.status-badge {
  font-size: 10px;
  font-weight: 500;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 0;
  position: relative;
  color: #666;
  transition: color 0.2s;
}

.tab:hover {
  color: #1976d2;
}

.tab.active {
  color: #1976d2;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1976d2;
}

.chat-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.contacts-panel {
  width: 350px;
  border-right: 1px solid #e0e0e0;
  background: white;
  display: flex;
  flex-direction: column;
}

.contacts-panel.full-width {
  width: 100%;
  border-right: none;
}

.contacts-list {
  flex: 1;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;
}

.contact-item:hover {
  background-color: #f8f9fa;
}

.contact-item.active {
  background-color: #e3f2fd;
}

.contact-avatar {
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.custom-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.contact-avatar-img {
  font-weight: 600;
  font-size: 14px;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px; /* Match q-avatar size */
  height: 32px; /* Match q-avatar size */
  background-color: #e0e0e0;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-name {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.contact-last-message {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.contact-date {
  font-size: 11px;
  color: #999;
}

.unread-badge {
  font-size: 10px;
}

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Responsive design */
@media (max-width: 768px) {
  .contacts-panel {
    width: 100%;
  }
  
  .chat-panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 10;
  }
}
</style> 