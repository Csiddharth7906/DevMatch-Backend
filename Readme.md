# 🚀 DevMatch - Backend API

[![Live API](https://img.shields.io/badge/Live%20API-Available-brightgreen)](https://devmatch-backend.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1+-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8+-red)](https://socket.io/)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange)](https://jwt.io/)

The robust backend API powering DevMatch - a developer matchmaking platform that connects coders, collaborators, and creators. Built with Node.js, Express, and MongoDB, featuring real-time chat capabilities and secure authentication.

## ✨ Key Features

- **🔐 JWT Authentication** - Secure user registration, login, and session management
- **👤 Profile Management** - Complete CRUD operations for developer profiles
- **🤝 Smart Matching System** - Connection requests with multiple status options
- **💬 Real-time Chat** - WebSocket-powered instant messaging with Socket.io
- **📊 User Feed** - Dynamic feed showing potential matches and connections
- **🛡️ Security First** - BCrypt password hashing and protected routes
- **⚡ High Performance** - Optimized MongoDB queries and efficient data handling

## 🌐 Live API

**🔗 Base URL**: [https://devmatch-backend.onrender.com](https://devmatch-backend.onrender.com)

The DevMatch API is deployed and ready to use! You can test all endpoints using the live URL above.

> **⚠️ Note**: The API is hosted on Render's free tier, which may have a cold start delay of 10-15 seconds for the first request after inactivity.

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 5.1+ | Web framework |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | 8.16+ | MongoDB ODM |
| **Socket.io** | 4.8+ | Real-time communication |
| **JWT** | 9.0+ | Authentication tokens |
| **BCrypt** | 6.0+ | Password hashing |
| **Validator** | 13.15+ | Data validation |

## 🏗️ Project Architecture

```
src/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── chat.js              # Chat/Message schema
│   ├── connectionRequest.js # Connection request schema
│   └── user.js              # User profile schema
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── chat.js              # Real-time chat routes
│   ├── profile.js           # Profile management routes
│   ├── request.js           # Connection request routes
│   └── user.js              # User data routes
├── utils/
│   ├── socket.js            # Socket.io configuration
│   └── validation.js        # Input validation helpers
├── apiList.md               # API documentation
└── app.js                   # Application entry point
```

## 🔗 API Endpoints

### 🔐 Authentication Routes (`/auth`)
```
POST   /signup              # Register new user
POST   /login               # User login
POST   /logout              # User logout
```

### 👤 Profile Routes (`/profile`)
```
GET    /profile/view        # Get user profile
PATCH  /profile/edit        # Update profile information
PATCH  /profile/password    # Change/reset password
```

### 🤝 Connection Request Routes (`/request`)
```
POST   /request/send/:status/:userId     # Send connection request
POST   /request/review/:status/:requestId # Accept/reject request
```

### 👥 User Routes (`/user`)
```
GET    /user/requests/received  # Get incoming requests
GET    /user/connections        # Get established connections
GET    /user/feed              # Get potential matches feed
```

### 📊 Connection Status Options
- `ignored` - User ignored the profile
- `interested` - User showed interest
- `accepted` - Connection request accepted
- `rejected` - Connection request rejected

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/devmatch
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/devmatch

# Authentication
JWT_SECRET_KEY=your_super_secret_jwt_key_here

# Server
PORT=5000

# Optional: Socket.io configuration
SOCKET_PORT=5001
```

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Csiddharth7906/DevMatch-Backend.git

# Navigate to project directory
cd DevMatch-Backend

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

The API will be available at `http://localhost:5000`

### 🚀 Production Deployment

The application is deployed on **Render** and accessible at:
**https://devmatch-backend.onrender.com**

#### Deployment Features:
- ✅ **Automatic Deployments** - Connected to GitHub for CI/CD
- ✅ **Environment Variables** - Securely configured on Render
- ✅ **MongoDB Atlas** - Cloud database integration
- ✅ **HTTPS Security** - SSL certificate included
- ✅ **Global CDN** - Fast worldwide access

#### Performance Notes:
- **Cold Start**: ~10-15 seconds delay after 15 minutes of inactivity (free tier)
- **Concurrent Users**: Supports multiple simultaneous connections
- **Uptime**: 99.9% availability with automatic health checks

## 📊 Database Models

### User Model
```javascript
{
  firstName: String (required),
  lastName: String,
  email: String (required, unique),
  password: String (required, hashed),
  skills: [String],
  bio: String,
  profilePicture: String,
  age: Number,
  location: String,
  github: String,
  linkedin: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Connection Request Model
```javascript
{
  fromUserId: ObjectId (required),
  toUserId: ObjectId (required),
  status: String (ignored/interested/accepted/rejected),
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Model
```javascript
{
  participants: [ObjectId] (required),
  messages: [{
    sender: ObjectId,
    content: String,
    timestamp: Date,
    messageType: String
  }],
  lastMessage: Date,
  createdAt: Date
}
```

## 🔐 Authentication Flow

1. **Registration**: User signs up with email/password
2. **Password Hashing**: BCrypt securely hashes passwords
3. **JWT Token**: Server generates signed JWT token
4. **Cookie Storage**: Token stored in HTTP-only cookie
5. **Protected Routes**: Middleware validates JWT on each request
6. **Session Management**: Logout clears authentication cookie

## 💬 Real-time Features

### Socket.io Integration
- **Connection Management**: Automatic user connection tracking
- **Real-time Messaging**: Instant chat between matched users
- **Online Status**: Live user presence indicators
- **Message Broadcasting**: Efficient message delivery system

### Socket Events
```javascript
// Client to Server
'join-room'           # Join specific chat room
'send-message'        # Send chat message
'typing'              # Typing indicator

// Server to Client
'receive-message'     # New message received
'user-online'        # User came online
'user-offline'       # User went offline
```

## 🛡️ Security Features

- **Password Encryption**: BCrypt with salt rounds
- **JWT Tokens**: Secure authentication tokens
- **CORS Protection**: Configured cross-origin requests
- **Input Validation**: Comprehensive data validation
- **Protected Routes**: Authentication middleware
- **HTTP-only Cookies**: Secure token storage

## 📈 Performance Optimizations

- **Database Indexing**: Optimized MongoDB queries
- **Connection Pooling**: Efficient database connections
- **Middleware Optimization**: Streamlined request processing
- **Error Handling**: Comprehensive error management
- **Memory Management**: Efficient data structures

## 🧪 API Testing

### Sample Requests

#### User Registration
```bash
curl -X POST https://devmatch-backend.onrender.com/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "skills": ["JavaScript", "React", "Node.js"]
  }'
```

#### User Login
```bash
curl -X POST https://devmatch-backend.onrender.com/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

#### Get User Feed
```bash
curl -X GET https://devmatch-backend.onrender.com/user/feed \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚧 Upcoming Features

### Phase 1 (In Development)
- **Advanced Matching Algorithm** - ML-based compatibility scoring
- **File Upload System** - Profile picture and resume uploads
- **Email Notifications** - Connection and message alerts
- **Rate Limiting** - API request throttling

### Phase 2 (Planned)
- **Video Chat Integration** - WebRTC-powered video calls
- **Push Notifications** - Mobile app notifications
- **Analytics Dashboard** - User engagement metrics
- **Advanced Search** - Filter by skills, location, experience

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add appropriate error handling
- Include input validation for new endpoints
- Update API documentation for new routes
- Test thoroughly before submitting PR

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Siddharth Chauhan**
- 📧 Email: [siddharthchauhan7906@gmail.com](mailto:siddharthchauhan7906@gmail.com)
- 🐱 GitHub: [@Csiddharth7906](https://github.com/Csiddharth7906)
- 💼 LinkedIn: [Connect with me](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- Built with ❤️ for the developer community
- Thanks to all contributors and open-source libraries
- Special thanks to the Node.js and MongoDB communities

---

<div align="center">
  <p>⭐ Star this repository if you found it helpful!</p>
  <p>🔗 <strong>Frontend Repository:</strong> <a href="https://github.com/Csiddharth7906/DevMatch-UI">DevMatch-UI</a></p>
  <p>Made with ❤️ by <a href="https://github.com/Csiddharth7906">Siddharth Chauhan</a></p>
</div>
