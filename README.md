# Jab-We-Talk 🚀

**Jab-We-Talk** (also called **JabweChat**) is a real-time chat application built for seamless and interactive communication.  
Users can create chat rooms or join random chats effortlessly, with features like typing indicators, message statuses, and room management.  

---

## ⚡ Key Features

### 1. Chat Rooms & Random Chat
- Users can create their own chat rooms with a **name, description, and tags**.  
- Explore **random chat** to meet new people instantly.  

### 2. Real-Time Indicators
- **Typing Indicator:** See when someone is typing.  
- **Message Status:** Know when messages are delivered or read.  

### 3. Room Management
- View the **number of active users** in each room and on the main page.  
- Search for rooms by **name or tags**.  
- **Join/Leave Notifications:** Get notified when users join or leave.  

### 4. Optimized Database Operations
- Messages are temporarily stored in a **hashmap** and periodically saved to MongoDB to reduce frequent read/write operations.  

### 5. Responsive Design
- Works seamlessly across devices with a **clean and adaptive UI**.  

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Frontend:** EJS, CSS, JavaScript  
- **Database:** MongoDB  
- **Real-time Communication:** Socket.io  
- **Authentication:** JWT (JSON Web Token)  
- **Architecture:** MVC Pattern  

---

## 🔄 How it Works

1. **Real-Time Chat:** Exchange messages instantly with typing indicators and message statuses.  
2. **Create or Join Rooms:** Users can create rooms with descriptions and tags or join existing ones.  
3. **Room Listings:** Popular rooms are displayed on the main page.  
4. **Efficient Database Storage:** Messages are batched and saved periodically to optimize performance.  

---

## 📦 Dependencies

```json
"dependencies": {
  "cookie-parser": "^1.4.7",
  "dotenv": "^16.4.7",
  "ejs": "^3.1.10",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.8.4",
  "socket.io": "^4.8.1"
}
