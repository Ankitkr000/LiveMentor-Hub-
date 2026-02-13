# 🎓 LiveMentor-Hub

> **Real-time remote classroom platform connecting students with teachers through instant doubt matching, video calls, and AI-powered assistance.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.0-black.svg)](https://socket.io/)
[![WebRTC](https://img.shields.io/badge/WebRTC-P2P-orange.svg)](https://webrtc.org/)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture Flow](#-architecture-flow)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Socket Events](#-socket-events)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement

Traditional online learning faces critical challenges:

- **Long Wait Times**: Students wait hours on forums for help with their doubts
- **Expensive Tutoring**: Private tutoring costs $30-50/hour, inaccessible to many
- **Delayed Responses**: Educational platforms take 2-24 hours for responses
- **No Real-time Interaction**: Lack of instant visual and verbal communication
- **Limited Accessibility**: No 24/7 support when teachers are unavailable

---

## 💡 Solution

**LiveMentor-Hub** is a real-time remote classroom platform that:

✅ **Matches students with expert teachers in under 2 seconds**  
✅ **Enables instant 1-on-1 video calls** using WebRTC peer-to-peer technology  
✅ **Zoom-like group meetings** where teachers can host classes for multiple students  
✅ **Screen sharing & content sharing** for live coding and presentations  
✅ **Razorpay payment integration** for secure transactions and premium features  
✅ **Offers AI-powered tutoring** as a fallback when teachers are unavailable  
✅ **Ensures zero video infrastructure costs** with WebRTC direct connections  

---

## 🚀 Key Features

### 1. **Instant Doubt Matching**
- Students select subject and ask questions
- Real-time broadcasting to available teachers
- Sub-2-second teacher-student connection
- Automatic retry mechanism with 60s timeout
- AI fallback if no teacher available

### 2. **1-on-1 Video Calls**
- WebRTC peer-to-peer video/audio
- Real-time text chat sidebar
- Camera and microphone controls
- Low latency (< 100ms)
- Zero server bandwidth costs

### 3. **Group Meetings** (Zoom-like Functionality)
- Host scheduled online classes with multiple students
- UUID-based secure meeting links
- Mesh topology for up to 10 participants
- Teacher-only meeting creation
- Participant management and capacity limits
- Real-time participant count and status

### 4. **AI Assistant**
- Powered by Groq's Llama 3.3 70B model
- 10x faster than GPT-4 (30ms vs 300ms first token)
- Contextual conversation history
- Subject-specific responses (DSA, Web Dev, AI-ML, etc.)
- Code review and concept explanations

### 5. **Real-time Communication**
- Socket.IO for instant updates
- Live doubt notifications
- Online/offline status tracking
- Room-based message isolation

### 6. **Content Sharing**
- Screen sharing for live coding/presentations
- Real-time content broadcast to all participants
- Teacher-controlled sharing permissions
- High-quality screen capture
- Application/window/tab sharing options

### 7. **Payment Integration**
- Razorpay payment gateway integration
- Secure payment processing for premium features
- Multiple payment methods (UPI, Cards, Net Banking)
- Transaction history and receipts
- Subscription management

### 8. **Security**
- JWT authentication with HTTP-only cookies
- XSS and CSRF protection
- bcrypt password hashing
- UUID v4 meeting links (2^122 entropy)
- Role-based access control
- Secure payment processing with Razorpay

---

## 🌟 What Makes LiveMentor-Hub Stand Out

### **Comprehensive Learning Platform**
Unlike competitors who offer only video calls OR only chat support, LiveMentor-Hub provides:

1. **Instant Doubt Resolution** - Sub-2-second teacher matching vs. hours of waiting on forums
2. **Zoom-like Classroom Experience** - Teachers can host full classes with multiple students simultaneously
3. **Screen Sharing & Content Sharing** - Live coding demonstrations, presentation sharing, and visual teaching
4. **Zero Video Infrastructure Cost** - WebRTC P2P eliminates server bandwidth costs ($0 vs. Twilio's $1500/month at scale)
5. **AI-Powered Fallback** - Students always get help, even when human teachers are unavailable
6. **Razorpay Integration** - Simplified Indian payment methods (UPI, Cards, Net Banking) with instant verification
7. **Teacher Economy** - Flexible scheduling, subject selection, and availability control
8. **Real-time Everything** - WebSocket-powered instant updates without page refreshes
9. **Secure by Design** - JWT cookies, UUID links, role-based access, and encrypted payments

### **Key Differentiators**
| Feature | LiveMentor-Hub | Traditional Platforms |
|---------|----------------|----------------------|
| **Response Time** | < 2 seconds | 2-24 hours |
| **Video Infrastructure** | P2P WebRTC (Free) | Cloud servers ($$$$) |
| **Group Classes** | ✅ Built-in | ❌ or Separate product |
| **Screen Sharing** | ✅ Real-time | Limited or premium only |
| **AI Assistant** | ✅ Always available | ❌ Most don't have |
| **Payment Options** | UPI, Cards, Net Banking | Limited options |
| **Teacher Flexibility** | Complete control | Fixed schedules |

---

## 🛠️ Technology Stack

### **Backend**
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Node.js + Express** | Server framework | Non-blocking I/O for real-time apps |
| **MongoDB + Mongoose** | Database | Flexible schema for rapid iteration |
| **Socket.IO** | WebSocket server | Built-in rooms, reconnection, acknowledgments |
| **JWT** | Authentication | Stateless, secure token-based auth |
| **bcrypt** | Password hashing | Industry-standard encryption |
| **Groq API** | AI integration | 10x faster inference than GPT-4 |
| **UUID v4** | Meeting links | Cryptographically secure IDs |

### **Frontend**
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React 18** | UI framework | Component reusability, hooks |
| **Vite** | Build tool | 10x faster than Webpack |
| **Tailwind CSS** | Styling | Rapid prototyping, purged CSS |
| **CSS Modules** | Component styling | Scoped styles, no collisions |
| **Socket.IO Client** | Real-time events | Syncs with backend WebSocket |
| **Axios** | HTTP client | Automatic JSON parsing, interceptors |
| **Lottie** | Animations | Lightweight vector animations |
| **Lucide React** | Icons | Modern, customizable icons |

### **Real-time & Video**
| Technology | Purpose |
|------------|---------|
| **WebRTC** | Peer-to-peer video/audio calls |
| **STUN Server** | NAT traversal (Google's free STUN) |
| **RTCPeerConnection** | WebRTC connection management |
| **Media Streams** | Camera and microphone access || **getDisplayMedia** | Screen sharing and content capture |

### **Payment Gateway**
| Technology | Purpose |
|------------|---------||
| **Razorpay** | Payment processing and subscription management |
| **Razorpay SDK** | Secure checkout integration |
| **Webhooks** | Real-time payment status updates |
---

## 🏗️ Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
├─────────────────────────────────────────────────────────────┤
│  StudentDashboard ←→ TeacherDashboard ←→ VideoChat          │
│       ↓                    ↓                  ↓              │
│   AIAssistant      GroupVideoChat        ChatRoom           │
└──────────┬──────────────────┬──────────────────┬────────────┘
           │                  │                  │
      HTTP REST          Socket.IO          WebRTC P2P
           │                  │                  │
┌──────────┴──────────────────┴──────────────────┴────────────┐
│                    BACKEND (Node.js)                         │
├─────────────────────────────────────────────────────────────┤
│  Express Routes  │  Socket.IO Handler  │  JWT Middleware    │
│       ↓                    ↓                                 │
│  Controllers:  userController, meetingController, aiController │
│       ↓                                                      │
│  Mongoose Models: User, Doubt, Meeting                      │
└──────────┬─────────────────────────────────┬────────────────┘
           │                                 │
      MongoDB Atlas                     Groq API
    (Cloud Database)                (Llama 3.3 70B)
```

### Component Communication Flow

#### **Doubt Matching Flow**
```
Student Dashboard → Ask Doubt → Backend API (POST /ask-doubt)
                                      ↓
                            Create Doubt Document (MongoDB)
                                      ↓
                    Socket.IO Broadcast → All Online Teachers
                                      ↓
                            Teacher Accepts → Update Doubt
                                      ↓
                    Socket.IO Room Creation (doubtId)
                                      ↓
              WebRTC Signaling (offer/answer/ICE candidates)
                                      ↓
                            Video Call Established
```

#### **Group Meeting Flow**
```
Teacher Dashboard → Create Meeting → Backend API (POST /create-meeting)
                                            ↓
                                Meeting Document + UUID Link
                                            ↓
Student → Browse Meetings → GET /available-meetings
                                            ↓
            Join Meeting → POST /join-meeting/:meetingLink
                                            ↓
                Socket.IO: join_group_meeting event
                                            ↓
                    Mesh WebRTC (N-1 peer connections)
                                            ↓
                        Multi-party Video Call
```

---

## 📁 Project Structure

```
LiveMentor-Hub-/
├── README.md
├── Backend/
│   ├── package.json
│   ├── server.js                    # Entry point: HTTP + Socket.IO server
│   ├── .env                         # Environment variables
│   ├── config/
│   │   └── db.js                    # MongoDB connection with retry logic
│   ├── Controllers/
│   │   ├── userController.js        # Auth, doubt matching, profile
│   │   ├── meetingController.js     # Group meeting CRUD
│   │   ├── aiController.js          # Groq AI integration
│   │   └── paymentController.js     # Razorpay payment processing
│   ├── Middleware/
│   │   └── authMiddleware.js        # JWT verification from cookies
│   ├── Models/
│   │   ├── userSchema.js            # User: role, subjects[], isOnline
│   │   ├── doubtSchema.js           # Doubt: question, matchedTeacher, status
│   │   ├── meetingSchema.js         # Meeting: UUID link, participants[]
│   │   └── paymentSchema.js         # Payment: orderId, amount, status
│   ├── Routes/
│   │   └── userRoute.js             # Express routes: /users, /meetings, /ai, /payments
│   └── socket/
│       └── socketHandler.js         # Socket.IO events (doubt, WebRTC)
│
└── Frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    ├── public/
    └── src/
        ├── App.jsx                  # Auth wrapper: /me check, user state
        ├── main.jsx                 # React root, Socket.IO init
        ├── socket.js                # Socket.IO client config
        ├── index.css                # Global styles
        ├── assets/                  # Lottie animations, avatars
        ├── components/
        │   ├── StudentDashboard.jsx # Ask doubts, AI, meetings list
        │   ├── TeacherDashboard.jsx # Accept doubts, toggle availability
        │   ├── VideoChat.jsx        # 1-on-1 WebRTC with chat
        │   ├── GroupVideoChat.jsx   # Multi-party mesh topology
        │   ├── AIAssistant.jsx      # Chat with Groq AI
        │   ├── ChatRoom.jsx         # Text messaging sidebar
        │   ├── Profile.jsx          # Update user info
        │   ├── TeacherSkillSelect.jsx # Choose subjects to teach
        │   ├── Login.jsx            # Login form
        │   ├── Signup.jsx           # Registration form
        │   ├── StudentNavBar.jsx    # Navigation bar
        │   ├── ProtectedRoute.jsx   # Auth guard
        │   ├── CustomCursor.jsx     # Animated cursor
        │   └── css/                 # Component-scoped CSS modules
        ├── pages/
        │   ├── LandingPage.jsx      # Hero section, features
        │   ├── LoginPage.jsx        # Auth page (/login/:role)
        │   ├── SignupPage.jsx       # Registration page
        │   ├── Premium.jsx          # Premium features page
        │   ├── NotFound.jsx         # 404 page
        │   └── VideoChatWrapper.jsx # Routing wrapper for /room/:roomId
        └── routes/
            └── AppRouter.jsx        # React Router with protected routes
```

---

## 🔧 Installation

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Groq API Key** ([Get key](https://console.groq.com/))
- **Razorpay Account** ([Sign up](https://razorpay.com/))

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/LiveMentor-Hub.git
   cd LiveMentor-Hub-/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file in Backend/**
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   GROQ_API_KEY=your_groq_api_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Start the backend server**
   ```bash
   npm start
   # or for development with nodemon
   npm run dev
   ```

   Server will run on **http://localhost:5000**

### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update Socket.IO URL (src/socket.js)**
   ```javascript
   import { io } from "socket.io-client";
   const socket = io("http://localhost:5000", {
     withCredentials: true
   });
   export default socket;
   ```

4. **Start the frontend dev server**
   ```bash
   npm run dev
   ```

   Frontend will run on **http://localhost:5174**

---

## 🎮 Usage

### For Students

1. **Sign up** as a student at `/signup/student`
2. **Login** at `/login/student`
3. **Ask a doubt**:
   - Select subject (DSA, Web Dev, AI-ML, etc.)
   - Type your question
   - Click "Ask Doubt"
   - Wait for teacher (< 2 seconds typically)
4. **Join video call** when teacher accepts
5. **Use AI Assistant** if no teacher available
6. **Browse meetings** and join group sessions
7. **Subscribe to premium** for unlimited access and priority matching
8. **Pay securely** via Razorpay (UPI/Cards/Net Banking)

### For Teachers

1. **Sign up** as a teacher at `/signup/teacher`
2. **Login** at `/login/teacher`
3. **Set subjects** you can teach (Profile > Choose Skills)
4. **Toggle availability** to "ON"
5. **Accept incoming doubts** from dashboard
6. **Create group meetings** for scheduled sessions
7. **Share screen** during video calls for live coding/presentations
8. **Access AI Assistant** for teaching resources
9. **Track earnings** through payment history

---

## 📡 API Endpoints

### **Authentication**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/signup` | Register new user | ❌ |
| POST | `/login` | Login user, returns JWT cookie | ❌ |
| POST | `/logout` | Logout user, clears cookie | ✅ |
| GET | `/me` | Get current user from token | ✅ |

### **User Management**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/user/:id` | Get user by ID | ✅ |
| PUT | `/user/:id` | Update user profile | ✅ |

### **Doubt Matching**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ask-doubt` | Student asks doubt, broadcasts to teachers | ✅ |
| POST | `/try-assign-teacher` | Retry mechanism for unmatched doubts | ✅ |

### **Meetings**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create-meeting` | Teacher creates group meeting | ✅ |
| GET | `/teacher-meetings` | Get teacher's created meetings | ✅ |
| GET | `/available-meetings` | Get all upcoming meetings | ✅ |
| POST | `/join-meeting/:meetingLink` | Student joins meeting | ✅ |
| PUT | `/meeting/:meetingLink/status` | Update meeting status | ✅ |
| DELETE | `/meeting/:meetingLink` | Delete meeting (teacher only) | ✅ |

### **AI Assistant**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/chat` | Chat with Groq AI | ✅ |
| GET | `/suggested-questions` | Get practice questions | ✅ |
| POST | `/explain-concept` | Get concept explanation | ✅ |
| POST | `/review-code` | Get code review feedback | ✅ |

### **Payments**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create-order` | Create Razorpay order | ✅ |
| POST | `/verify-payment` | Verify payment signature | ✅ |
| GET | `/payment-history` | Get user's transaction history | ✅ |
| POST | `/subscribe-premium` | Activate premium subscription | ✅ |

---

## 🔌 Socket Events

### **Client → Server**

| Event | Payload | Description |
|-------|---------|-------------|
| `register_socket` | `{ userId }` | Register user's socket ID |
| `join_room` | `{ roomId }` | Join doubt/meeting room |
| `accept_doubt` | `{ doubtId, teacherId }` | Teacher accepts doubt |
| `offer` | `{ offer, to }` | WebRTC offer for 1-on-1 |
| `answer` | `{ answer, to }` | WebRTC answer for 1-on-1 |
| `ice_candidate` | `{ candidate, to }` | ICE candidate for NAT traversal |
| `join_group_meeting` | `{ meetingLink, userName, userId }` | Join group meeting |
| `group_offer` | `{ offer, toSocketId, meetingLink }` | WebRTC offer for mesh |
| `group_answer` | `{ answer, toSocketId, meetingLink }` | WebRTC answer for mesh |
| `group_ice_candidate` | `{ candidate, toSocketId, meetingLink }` | ICE for mesh |
| `send_message` | `{ message, roomId, sender }` | Send chat message |
| `start_screen_share` | `{ roomId, userId }` | Start screen sharing session |
| `stop_screen_share` | `{ roomId, userId }` | Stop screen sharing session |

### **Server → Client**

| Event | Payload | Description |
|-------|---------|-------------|
| `incoming_doubt` | `{ doubtId, question, subject, studentSocketId }` | Notify teacher of new doubt |
| `doubt_accepted` | `{ doubtId, teacherSocketId }` | Notify student teacher accepted |
| `doubt_taken` | `{ doubtId }` | Remove doubt card from other teachers |
| `doubt_already_taken` | `{ doubtId }` | Notify teacher doubt was taken |
| `joined_room_ack` | `{ roomId }` | Confirm room join |
| `offer` | `{ offer, from }` | Forward WebRTC offer |
| `answer` | `{ answer, from }` | Forward WebRTC answer |
| `ice_candidate` | `{ candidate, from }` | Forward ICE candidate |
| `participant_joined` | `{ socketId, userName, userId }` | New participant in group |
| `group_offer` | `{ offer, fromSocketId }` | Forward mesh offer |
| `group_answer` | `{ answer, fromSocketId }` | Forward mesh answer |
| `group_ice_candidate` | `{ candidate, fromSocketId }` | Forward mesh ICE |
| `receive_message` | `{ message, sender, timestamp }` | Receive chat message |
| `user_disconnected` | `{ socketId }` | User left meeting |
| `screen_share_started` | `{ userId, userName }` | User started sharing screen |
| `screen_share_stopped` | `{ userId }` | User stopped sharing screen |

---

## 📸 Screenshots

### Student Dashboard
![Student Dashboard](https://via.placeholder.com/800x450?text=Student+Dashboard)
- Ask doubts interface
- Browse meetings
- AI assistant access

### Teacher Dashboard
![Teacher Dashboard](https://via.placeholder.com/800x450?text=Teacher+Dashboard)
- Incoming doubt cards
- Availability toggle
- Create meetings

### Video Call Interface
![Video Call](https://via.placeholder.com/800x450?text=Video+Call+Interface)
- 1-on-1 video streams
- Camera/mic controls
- Real-time chat

### Group Meeting
![Group Meeting](https://via.placeholder.com/800x450?text=Group+Meeting)
- Multiple video tiles
- Participant list
- Mesh topology

---

## 🚀 Future Enhancements

### Short-term (1-2 months)
- [ ] **Session Recording**: Record and save video sessions to cloud storage
- [ ] **Whiteboard**: Real-time collaborative drawing canvas
- [ ] **Rating System**: Students rate teachers after sessions
- [ ] **Multi-currency Support**: International payment options

### Medium-term (3-6 months)
- [ ] **Mobile App**: React Native iOS/Android apps
- [ ] **Analytics Dashboard**: Teacher performance metrics
- [ ] **Recurring Meetings**: Weekly/monthly scheduled sessions
- [ ] **Breakout Rooms**: Split large meetings into smaller groups
- [ ] **File Sharing**: Upload/download PDFs, code files

### Long-term (6-12 months)
- [ ] **SFU Media Server**: Migrate from mesh to SFU for 50+ participants
- [ ] **AI Homework Checker**: Automated assignment grading
- [ ] **Live Transcriptions**: Real-time speech-to-text captions
- [ ] **Multi-language Support**: Internationalization (i18n)
- [ ] **Blockchain Certificates**: NFT-based completion certificates

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines
- Use **ES6+ syntax** (arrow functions, async/await)
- Follow **Airbnb JavaScript Style Guide**
- Write **meaningful commit messages**
- Add **comments** for complex logic
- Test **before submitting PR**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google STUN Server** - Free STUN server for WebRTC NAT traversal
- **Groq** - Ultra-fast AI inference API
- **MongoDB Atlas** - Cloud database hosting
- **Razorpay** - Seamless payment gateway for Indian markets
- **Lottie Files** - Beautiful animation library
- **Socket.IO Community** - Real-time communication framework

