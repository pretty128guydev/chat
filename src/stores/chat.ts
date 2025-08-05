import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ChatMessage, Contact, WebSocketMessage } from 'src/types/chat';

export const useChatStore = defineStore('chat', () => {
  const contacts = ref<Contact[]>([]);
  const messages = ref<Map<string, ChatMessage[]>>(new Map());
  const selectedContact = ref<string | null>(null);
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const activeTab = ref<'recent' | 'new'>('recent');
  const newContacts = ref<Set<string>>(new Set());

  // Mock data for initial display
  const initializeMockData = () => {
    const mockContacts: Contact[] = [
      {
        name: 'Алёна',
        lastMessage: 'Привет! Как дела?',
        unreadCount: 2,
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        name: 'Марина',
        lastMessage: 'Не забудь про встречу завтра',
        unreadCount: 0,
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      {
        name: 'Иван',
        lastMessage: 'Документы готовы',
        unreadCount: 1,
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      }
    ];

    const mockMessages = new Map<string, ChatMessage[]>();
    
    // Mock messages for Алёна
    mockMessages.set('Алёна', [
      {
        from: 'Алёна',
        message: 'Привет!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        from: 'You',
        message: 'Привет! Как дела?',
        timestamp: new Date(Date.now() - 1000 * 60 * 45)
      },
      {
        from: 'Алёна',
        message: 'Хорошо, спасибо! А у тебя?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30)
      }
    ]);

    // Mock messages for Марина
    mockMessages.set('Марина', [
      {
        from: 'Марина',
        message: 'Привет!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3)
      },
      {
        from: 'You',
        message: 'Привет, Марина!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5)
      },
      {
        from: 'Марина',
        message: 'Не забудь про встречу завтра',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
      }
    ]);

    // Mock messages for Иван
    mockMessages.set('Иван', [
      {
        from: 'Иван',
        message: 'Добрый день!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25)
      },
      {
        from: 'You',
        message: 'Добрый день, Иван!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5)
      },
      {
        from: 'Иван',
        message: 'Документы готовы',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    ]);

    contacts.value = mockContacts;
    messages.value = mockMessages;
  };

  // Computed properties
  const sortedContacts = computed(() => {
    return [...contacts.value].sort((a, b) => 
      b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
    );
  });

  const newContactsList = computed(() => {
    return sortedContacts.value.filter(contact => newContacts.value.has(contact.name));
  });

  const currentMessages = computed(() => {
    if (!selectedContact.value) return [];
    return messages.value.get(selectedContact.value) || [];
  });

  const totalUnreadCount = computed(() => {
    return contacts.value.reduce((total, contact) => total + contact.unreadCount, 0);
  });

  const newContactsCount = computed(() => {
    return newContacts.value.size;
  });

  // Methods
  const setActiveTab = (tab: 'recent' | 'new') => {
    activeTab.value = tab;
  };

  const connectWebSocket = () => {
    try {
      ws.value = new WebSocket('ws://localhost:8181');
      
      ws.value.onopen = () => {
        isConnected.value = true;
        console.log('WebSocket connected successfully');
      };

      ws.value.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          handleIncomingMessage(data.message.from, data.message.message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.value.onclose = () => {
        isConnected.value = false;
        console.log('WebSocket disconnected');
      };

      ws.value.onerror = () => {
        console.log('WebSocket connection failed - this is normal if the test server is not running');
        console.log('To test with real-time messages, run: node websocket-server.js');
        isConnected.value = false;
      };
    } catch {
      console.log('WebSocket connection failed - continuing with mock data');
      console.log('To test with real-time messages, run: node websocket-server.js');
    }
  };

  const handleIncomingMessage = (from: string, message: string) => {
    const chatMessage: ChatMessage = {
      from,
      message,
      timestamp: new Date()
    };

    // Add message to the conversation
    if (!messages.value.has(from)) {
      messages.value.set(from, []);
    }
    messages.value.get(from)!.push(chatMessage);

    // Update or create contact
    const existingContact = contacts.value.find(c => c.name === from);
    if (existingContact) {
      existingContact.lastMessage = message;
      existingContact.lastMessageTime = chatMessage.timestamp;
      if (selectedContact.value !== from) {
        existingContact.unreadCount++;
      }
    } else {
      // This is a new contact
      contacts.value.push({
        name: from,
        lastMessage: message,
        unreadCount: selectedContact.value === from ? 0 : 1,
        lastMessageTime: chatMessage.timestamp
      });
      newContacts.value.add(from);
    }
  };

  const selectContact = (contactName: string | null) => {
    selectedContact.value = contactName;
    // Reset unread count for selected contact
    if (contactName) {
      const contact = contacts.value.find(c => c.name === contactName);
      if (contact) {
        contact.unreadCount = 0;
        // Remove from new contacts when selected
        newContacts.value.delete(contactName);
      }
    }
  };

  const sendMessage = (message: string) => {
    if (!selectedContact.value || !message.trim()) return;

    const chatMessage: ChatMessage = {
      from: 'You',
      message: message.trim(),
      timestamp: new Date()
    };

    // Add message to the conversation
    if (!messages.value.has(selectedContact.value)) {
      messages.value.set(selectedContact.value, []);
    }
    messages.value.get(selectedContact.value)!.push(chatMessage);

    // Update contact's last message
    const contact = contacts.value.find(c => c.name === selectedContact.value);
    if (contact) {
      contact.lastMessage = message.trim();
      contact.lastMessageTime = chatMessage.timestamp;
    }
  };

  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
    }
    isConnected.value = false;
  };

  // Initialize mock data
  initializeMockData();

  return {
    contacts: sortedContacts,
    newContacts: newContactsList,
    messages,
    selectedContact,
    isConnected,
    currentMessages,
    activeTab,
    totalUnreadCount,
    newContactsCount,
    connectWebSocket,
    selectContact,
    sendMessage,
    disconnect,
    setActiveTab
  };
}); 