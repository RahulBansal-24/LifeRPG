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
- 📧 **Password Recovery** - Forgot password feature with email-based password recovery system
- ⭐ **50-Level Progression System** - Epic journey from Novice to Godlike with exponential XP requirements
- 📋 **Quest Management** - Create and complete Daily & Main quests with skill rewards
- **Dynamic Daily Quest Pool** - System generates 5 daily quests from curated pool
- **Main Quest Creation** - Create personalized main quests for long-term goals
- **Skill-Based Rewards** - Complete quests to earn XP and stat points in specific skills
- **Quest Progress Tracking** - Real-time updates on quest status and completion
- **Daily Reset System** - New quests available every 24 hours with automatic cleanup
- 💪 **Advanced Character Stats** - Develop Strength, Intelligence, Discipline, and Charisma up to 100,000
- 🏆 **Real-time Leaderboard** - Compete with players globally and climb the ranks
- ⚡ **Tiered Level Boosts** - Strategic stat bonuses based on level ranges (0% to 25%)

### 🎨 User Experience
- 🌙 **Dark Gaming Theme** - Immersive neon/cyberpunk inspired design
- ✨ **Smooth Animations** - Beautiful transitions and micro-interactions with Framer Motion
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🎯 **Intuitive Interface** - Easy-to-navigate design for all user levels
- 🧙 **Mage Guide System** - Interactive companion that provides contextual tips and guidance throughout the user journey

---

## 🔐 Authentication & Security

### 📧 Password Recovery System
LifeRPG includes a comprehensive password recovery feature:

#### **Forgot Password Flow**
- **Email Verification**: Users enter their registered email address
- **Secure Delivery**: Original password sent via encrypted email
- **Immediate Access**: No complex reset tokens or waiting periods
- **User-Friendly**: Simple, one-step password recovery process

#### **Email Service Integration**
- **Gmail Integration**: Secure SMTP delivery via Gmail App Passwords
- **Professional Templates**: Beautiful, themed email templates
- **Error Handling**: Comprehensive validation and error feedback
- **Security**: Email validation and user existence verification

#### **Security Features**
- **Hashed Passwords**: All passwords stored with bcrypt encryption
- **Dual Storage**: Both hashed and original passwords for recovery
- **Access Control**: Password fields excluded from default queries
- **Secure Transport**: HTTPS-ready email delivery

---

## � Leveling & Stats System

### 🏆 50-Level Progression
LifeRPG features an extensive 50-level progression system with unique titles:

| Level Range | Title | XP Required | Boost |
|-------------|--------|-------------|--------|
| 1-5 | Novice → Hero | 0 - 1,000 XP | 0% |
| 6-15 | Champion → Ethereal | 1,750 - 70,000 XP | 5% |
| 16-25 | Transcendent → Limitless | 100,000 - 1,100,000 XP | 10% |
| 26-35 | Supreme → Revered | 1,350,000 - 5,850,000 XP | 15% |
| 36-45 | Worshipped → Consecrated | 6,600,000 - 15,600,000 XP | 20% |
| 46-50 | Anointed → Godlike | 16,850,000 - 22,500,000 XP | 25% |
| 50+ | Godlike (Max) | 22,500,000+ XP | 25% (capped) |

### 💪 Character Development
- **Starting Stats**: 10 points in each skill (Strength, Intelligence, Discipline, Charisma)
- **Maximum Stats**: 100,000 points per skill
- **Level Boosts**: Tiered percentage bonuses applied to effective stat values
- **Progress Display**: Precise 3-decimal percentage tracking

### ⚡ XP Progression
- **Level 1**: 0 XP (Novice)
- **Level 10**: 12,000 XP (Immortal)
- **Level 25**: 1,100,000 XP (Limitless)
- **Level 50**: 22,500,000 XP (Godlike) - Final Level!
- **Beyond 50**: XP continues accumulating, title remains "Godlike"

---

## �️ Technology Stack

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
🔐 Login/Signup → 🎮 Dashboard → 📋 Quests → 📜 Chronicles → 🏆 Leaderboard
```

### 📄 Page Structure
- **🔐 Authentication Pages** - Login & Signup with avatar selection
- **🎮 Dashboard** - Main hub with stats, XP, and recent quests
- **📋 Quests Page** - Create, manage, and complete quests
- **📜 Chronicles Page** - Create and view chronicles with image uploads, comments, and likes
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
- `POST /api/auth/forgot-password` - 📧 Send password recovery email

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

### 📜 Chronicles System
LifeRPG features a complete chronicles system for sharing achievements and experiences:

#### **Core Features**
- **📸 Chronicle Creation** - Create detailed posts with images, captions, and quest associations
- **🖼️ Image Upload & Cropping** - Advanced WYSIWYG image editor with 16:9 aspect ratio
- **📝 Rich Text Content** - Support for detailed captions and storytelling
- **❤️ Like System** - Like and unlike chronicles with real-time updates
- **💬 Comment System** - Hierarchical comments with reply functionality
- **🔗 Quest Integration** - Link chronicles to completed quests for context

#### **Technical Implementation**
- **Perfect WYSIWYG** - What you crop is exactly what gets posted (pixel-perfect)
- **16:9 Standard** - Consistent aspect ratio across creation and display
- **Real-time Updates** - Instant like/comment updates without page refresh
- **Image Processing** - Advanced canvas-based cropping with 1200x675 output
- **Responsive Design** - Works seamlessly on all device sizes

#### **API Endpoints**
- `GET /api/posts` - 📜 Get all chronicles (posts)
- `GET /api/posts/my` - 📜 Get user's chronicles
- `POST /api/posts/create` - 📸 Create new chronicle with image
- `GET /api/posts/:id/image` - 🖼️ Get chronicle image
- `POST /api/posts/:id/like` - ❤️ Like chronicle
- `POST /api/posts/:id/comment` - 💬 Comment on chronicle
- `POST /api/posts/:id/comment/:commentId/reply` - 💭 Reply to comment
- `DELETE /api/posts/:id/comment/:commentId` - 🗑️ Delete comment
- `POST /api/posts/check-eligibility/:questId` - 🔍 Check if quest is eligible for chronicle

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
├── 📄 LifeRPG-Gamify-Your-Life.pptx  # Presentation
└── 📄 LifeRPG-Gamify-Your-Life.pdf   # PDF
```

---

## 🎮 How to Play

1. **🔐 Create Account** - Sign up with username, email, and choose your avatar
2. **📧 Password Recovery** - Use forgot password feature if you lose access to your account
3. **📊 Set Your Goals** - Create quests for daily tasks and main objectives with skill rewards
4. **⚔️ Complete Quests** - Mark tasks as complete to earn XP, stat points, and stars
5. **📈 Level Up** - Progress through 50 levels from Novice to Godlike with tiered stat boosts
6. **🏆 Climb Leaderboard** - Compete with players worldwide using your accumulated XP
7. **🔄 Daily Routine** - Generate new daily quests each day to build consistent habits
8. **💪 Master Skills** - Develop your character stats to 100,000 with strategic level bonuses

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
