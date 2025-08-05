export interface ChatMessage {
  from: string;
  message: string;
  timestamp: Date;
}

export interface Contact {
  name: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: Date;
}

export interface WebSocketMessage {
  message: {
    from: string;
    message: string;
  };
} 