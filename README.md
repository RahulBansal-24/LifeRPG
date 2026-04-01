# 🎮 LifeRPG - Gamify Your Life

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion">
</div>

---

## � About LifeRPG

LifeRPG is a **revolutionary gamified life management web application** that transforms your daily tasks and personal development goals into an exciting RPG adventure! 🎯⚔️

Turn boring routines into epic quests, track your progress with XP and levels, and compete with others on the leaderboard - all while building real-life skills and habits! 📈✨

---

## 🚀 Key Features

### 🎮 Core Gameplay
- 🔐 **Secure Authentication** - Sign up with custom avatars and personalized profiles
- ⭐ **XP & Leveling System** - Earn experience points and level up with animated progress bars
- 📋 **Quest Management** - Create and complete Daily & Main quests with rewards
- 💪 **Character Stats** - Develop Strength, Intelligence, Discipline, and Charisma
- 🏆 **Real-time Leaderboard** - Compete with players globally and climb the ranks

### 🎨 User Experience
- 🌙 **Dark Gaming Theme** - Immersive neon/cyberpunk inspired design
- ✨ **Smooth Animations** - Beautiful transitions and micro-interactions with Framer Motion
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🎯 **Intuitive Interface** - Easy-to-navigate design for all user levels

---

## 🛠️ Technology Stack

### Frontend 🎨
<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white" alt="Framer Motion">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white" alt="Axios">
</div>

### Backend 🚀
<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white" alt="Mongoose">
  <img src="https://img.shields.io/badge/JWT-000000?style=flat&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/bcrypt-3A1F2A?style=flat&logo=bcrypt&logoColor=white" alt="bcrypt">
</div>

---

## 🎯 Website Flow & Pages

### 📱 User Journey
```
🏠 Landing → 🔐 Login/Signup → 🎮 Dashboard → 📋 Quests → 🏆 Leaderboard
```

### 📄 Page Structure
- **🏠 Landing Page** - Welcome screen with game overview
- **🔐 Authentication Pages** - Login & Signup with avatar selection
- **🎮 Dashboard** - Main hub with stats, XP, and recent quests
- **📋 Quests Page** - Create, manage, and complete quests
- **🏆 Leaderboard** - Global rankings and achievements
- **👤 Profile** - User stats and settings (coming soon)

---

## 🚀 Getting Started

### 📋 Prerequisites
- ✅ Node.js (v16 or higher)
- ✅ MongoDB (local or cloud instance)
- ✅ Modern web browser
- ✅ Terminal/Command Prompt

### 🔧 Installation

1. **📥 Clone the repository**
```bash
git clone https://github.com/yourusername/LifeRPG.git
cd LifeRPG
```

2. **📦 Install dependencies**
```bash
# Server dependencies
cd server
npm install

# Client dependencies  
cd ../client
npm install
```

3. **⚙️ Environment Setup**
```bash
# Copy environment file
cd server
cp .env.example .env

# Edit .env with your configuration
# - MongoDB URI
# - JWT Secret
# - Port number
```

4. **🚀 Start the application**
```bash
# Terminal 1 - Start Backend Server
cd server
npm run server

# Terminal 2 - Start Frontend Development Server
cd client
npm run dev
```

5. **🎮 Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

---

## 🔌 API Endpoints

### 🔐 Authentication
- `POST /api/auth/signup` - 📝 User registration
- `POST /api/auth/login` - 🔑 User login

### 👤 User Management
- `GET /api/user/profile` - 👤 Get user profile
- `PUT /api/user/stats` - 📊 Update user stats
- `PUT /api/user/avatar` - 🎭 Update avatar
- `DELETE /api/user/delete-account` - 🗑️ Delete user account and all data

### 📋 Quest Management
- `GET /api/quests` - 📋 Get user quests
- `POST /api/quests` - ➕ Create new quest
- `PUT /api/quests/:id` - ✅ Update quest status
- `DELETE /api/quests/:id` - 🗑️ Delete quest
- `POST /api/quests/generate-daily` - 🌅 Generate daily quests

### 🏆 Leaderboard
- `GET /api/leaderboard` - 🏆 Get top users by XP
- `GET /api/leaderboard/my-rank` - 🎯 Get user's rank

### 🏥 Health Check
- `GET /api/health` - 🔍 Server status monitoring (deployment/monitoring utility, not used in core functionality)

---

## 📁 Project Structure

```
LifeRPG/
├── 📁 client/                 # React Frontend Application
│   ├── 📁 public/              # Static assets (favicon, images)
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable UI components
│   │   ├── 📁 context/         # React Context (Auth)
│   │   ├── 📁 pages/           # Page components
│   │   ├── 📁 services/        # API services
│   │   ├── 📁 utils/           # Helper functions
│   │   ├── 📄 App.jsx          # Main App component
│   │   └── 📄 main.jsx         # App entry point
│   ├── 📄 package.json         # Frontend dependencies
│   ├── 📄 vite.config.js       # Vite configuration
│   └── 📄 tailwind.config.js   # Tailwind CSS config
├── 📁 server/                  # Node.js Backend API
│   ├── 📁 middleware/          # Express middleware
│   ├── 📁 models/              # MongoDB models (User, Quest)
│   ├── 📁 routes/              # API routes
│   ├── 📄 .env                 # Environment variables
│   ├── 📄 .env.example         # Environment template
│   ├── 📄 package.json         # Backend dependencies
│   └── 📄 server.js            # Server entry point
├── 📄 .gitignore               # Git ignore file
├── 📄 README.md                # This file
├── 📄 DEPLOYMENT.md            # Deployment guide
└── 📄 LifeRPG - Gamify Your Life.pptx  # Presentation
```

---

## 🎮 How to Play

1. **🔐 Create Account** - Sign up with username, email, and choose your avatar
2. **📊 Set Your Goals** - Create quests for daily tasks and main objectives
3. **⚔️ Complete Quests** - Mark tasks as complete to earn XP rewards
4. **📈 Level Up** - Watch your stats grow and unlock new achievements
5. **🏆 Climb Leaderboard** - Compete with players worldwide
6. **🔄 Daily Routine** - Generate new daily quests each day

---

## 🌟 Use Cases & Applications

### 🎓 Education
- 📚 Study motivation and progress tracking
- 🎯 Assignment completion gamification
- 📊 Learning habit formation

### 💼 Professional Development
- 💪 Skill acquisition tracking
- 📋 Project management gamification
- 🎯 Career goal achievement

### 🏃 Personal Growth
- 🏃‍♂️ Fitness and health habit tracking
- 🧘‍♀️ Mindfulness and meditation practice
- 📚 Reading and learning goals

### 👥 Social Features
- 🏆 Friendly competition with friends
- 👥 Team challenges and collaboration
- 📊 Community achievements

---

## 🚀 Future Improvements

### 📱 Mobile Application
- 📲 React Native mobile app
- 🔔 Push notifications for quests
- 📱 Offline mode support

### 🤖 AI Integration
- 🤖 Smart quest suggestions
- 📊 Personalized recommendations
- 🎯 Adaptive difficulty system

### 🌐 Social Features
- 👥 Guilds and team quests
- 💬 Chat and messaging
- 🎪 Events and competitions

### 🔗 Integrations
- 📅 Calendar integration
- 📊 Analytics dashboard
- 🔗 Third-party app connections

---

## 👨‍💻 Author

<div align="center">
  <h3>👨‍💻 Rahul Bansal</h3>
  <p>🚀 Full-Stack Developer | 🎮 Gaming Enthusiast | 💡 Innovation Driver</p>
  <p>📧 Connect with me: <a href="mailto:itzrahulbansal24@gmail.com">itzrahulbansal24@gmail.com</a></p>
  <p>🔗 GitHub: <a href="https://github.com/RahulBansal-24">@RahulBansal-24</a></p>
  <p>💼 LinkedIn: <a href="https://www.linkedin.com/in/itsrahulbansal24">linkedin.com/in/itsrahulbansal24</a></p>
</div>

---

<div align="center">
  <h3>🎮 Ready to Gamify Your Life? Start Your Adventure Now! 🎯</h3>
  <p>⭐ Star this repository | 🍴 Fork for your own version | 🐛 Report issues</p>
  <p>Made with ❤️ and lots of ☕ by Rahul Bansal</p>
</div>
