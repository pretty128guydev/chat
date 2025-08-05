import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8181 });

console.log('WebSocket test server started on port 8181');
console.log('This server will send test messages every 20 seconds');

const testMessages = [
  { from: 'Алёна', message: 'Привет!' },
  { from: 'Марина', message: 'Как дела?' },
  { from: 'Иван', message: 'Добрый день!' },
  { from: 'Елена', message: 'Привет, как ты?' },
  { from: 'Сергей', message: 'Все хорошо!' },
  { from: 'Анна', message: 'Отлично!' },
  { from: 'Дмитрий', message: 'Привет всем!' },
  { from: 'Ольга', message: 'Добрый вечер!' },
  { from: 'Александр', message: 'Как дела?' },
  { from: 'Наталья', message: 'Все отлично!' },
  { from: 'Михаил', message: 'Привет!' },
  { from: 'Екатерина', message: 'Добрый день!' },
  { from: 'Андрей', message: 'Как ты?' },
  { from: 'Татьяна', message: 'Хорошо!' },
  { from: 'Владимир', message: 'Привет всем!' },
  { from: 'Ирина', message: 'Добрый вечер!' }
];

let messageIndex = 0;

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send a welcome message
  ws.send(JSON.stringify({
    message: {
      from: 'Server',
      message: 'Добро пожаловать в чат!'
    }
  }));

  // Send test messages every 5 seconds
  const interval = setInterval(() => {
    const testMessage = testMessages[messageIndex % testMessages.length];
    
    ws.send(JSON.stringify({
      message: testMessage
    }));
    
    messageIndex++;
  }, 5000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.log('WebSocket error:', error);
    clearInterval(interval);
  });
});

console.log('To test the chat app:');
console.log('1. Start this server: node websocket-server.js');
console.log('2. Open the chat app in your browser');
console.log('3. You should see real-time messages appearing every 5 seconds'); 