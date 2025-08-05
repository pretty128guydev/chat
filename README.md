# Chat Application

A responsive chat application built with TypeScript, Vue 3, and Quasar Framework.

## Features

- **Responsive Design**: Adapts to different screen sizes
  - Large screens: Shows contacts and chat side by side
  - Small screens: Shows only contacts, chat opens on contact selection
- **Real-time Messaging**: Connects to WebSocket server for live messages
- **Contact Management**: Automatically adds new contacts from incoming messages
- **Message History**: Stores and displays conversation history
- **Unread Count**: Tracks unread messages per contact
- **Modern UI**: Clean, modern interface with Material Design

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:9000`

## Testing with WebSocket Server

To test the real-time messaging functionality, you have two options:

### Option 1: Node.js WebSocket Server (Recommended)

1. Install the WebSocket dependency:
```bash
npm install
```

2. Start the Node.js WebSocket test server:
```bash
node websocket-server.js
```

3. The application will automatically connect to `ws://localhost:8181`

4. The test server sends messages every 2 seconds in the format:
```json
{
  "message": {
    "from": "Алёна",
    "message": "Привет!"
  }
}
```

### Option 2: Docker WebSocket Server

If you have Docker installed:

1. Start the Docker WebSocket test server:
```bash
docker run -p 8181:8181 ravlio/wstest:latest
```

2. The application will automatically connect to `ws://localhost:8181`

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ChatApp.vue          # Main chat application component
│   └── ChatDialog.vue       # Individual chat conversation component
├── stores/
│   └── chat.ts              # Pinia store for chat state management
├── types/
│   └── chat.ts              # TypeScript interfaces
└── pages/
    └── IndexPage.vue        # Main page that hosts the chat app
```

## Features Implemented

- ✅ Responsive layout (large/small window views)
- ✅ Contact list with last message and unread count
- ✅ Chat dialog with message history
- ✅ WebSocket connection for real-time messages
- ✅ Automatic contact creation from incoming messages
- ✅ Message sending (stored locally)
- ✅ Unread message counting
- ✅ Contact sorting by latest message
- ✅ Back navigation on mobile
- ✅ Modern UI with Quasar components

## Technical Stack

- **Frontend**: Vue 3 + TypeScript
- **UI Framework**: Quasar Framework
- **State Management**: Pinia
- **Styling**: SCSS with Quasar components
- **Real-time**: WebSocket connection
