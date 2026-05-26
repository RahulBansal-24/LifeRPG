# 🎮 LifeRPG - Gamify Your Life

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion">
</div>

---

## ✨ About LifeRPG

LifeRPG is a **revolutionary gamified life management web application** that transforms your daily tasks and personal development goals into an exciting RPG adventure! 🎯⚔️

Turn boring routines into epic quests, track your progress with XP and levels, and compete with others on the leaderboard - all while building real-life skills and habits! 📈✨

---

## 🚀 Key Features

### 🎮 Core Gameplay
- 🔐 **Secure Authentication** - Sign up with custom avatars and personalized profiles
- 📧 **Password Recovery** - Forgot password feature with email-based password recovery system
- ⭐ **50-Level Progression System** - Epic journey from Novice to Godlike with exponential XP requirements
- 📋 **Quest Management** - Create and complete Daily & Main quests with skill rewards
- 🎲 **Dynamic Daily Quest Pool** - System generates 5 daily quests from curated pool
- 📝 **Main Quest Creation** - Create personalized main quests for long-term goals
- 🎯 **Skill-Based Rewards** - Complete quests to earn XP and stat points in specific skills
- 📈 **Quest Progress Tracking** - Real-time updates on quest status and completion
- 🔄 **Daily Reset System** - New quests available every 24 hours with automatic cleanup
- ⏰ **Daily Quest Limits** - Level-based daily completion limits to maintain game balance (3-10 quests based on level)
- 💪 **Advanced Character Stats** - Develop Strength, Intelligence, Discipline, and Charisma up to 100,000
- 🏆 **Real-time Leaderboard** - Compete with players globally and climb the ranks
- ⚡ **Tiered Level Boosts** - Strategic stat bonuses based on level ranges (0% to 25%)

### 🏪 Arcane Market System
- 💰 **LifeRPG Coins Economy** - Earn coins by completing quests and posting chronicles
- 🛒 **Coupon Marketplace** - Purchase exclusive rewards using earned coins
- ✨ **Premium Rarity Tiers** - Six rarity levels from Basic to Ultimate Deal with unique visual styling
- 🎨 **Animated UI System** - Premium glass/jelly effects, rarity animations, and shine sweep effects
- 🔍 **Advanced Search & Filters** - Filter by category, status, and purchase status
- 📱 **Interactive Modals** - Detailed coupon views with purchase confirmation
- 🏷️ **Rarity Badge System** - Custom CSS classes for Ultra Premium (arcane crystal) and Ultimate Deal (legendary gold)
- 🔄 **Purchase Persistence** - Track purchased coupons and access codes anytime

### 🏢 Enterprise Portal
- 🏢 **Merchant Authentication** - Separate enterprise login/signup system with company accounts
- 📊 **Analytics Dashboard** - Real-time stats on coupon performance and customer engagement
- 🎫 **Coupon Management** - Create, edit, expire, and delete coupons with image uploads
- 📈 **Purchase Analytics** - Track redemptions, timeline data, and top-performing coupons
- 🎨 **Fantasy Enterprise UI** - Premium gaming-themed interface for merchants
- 🔐 **Secure Company Accounts** - JWT-based authentication with company-specific data isolation
- 📊 **Interactive Graphs** - Multi-line charts for active/expired/purchase trends using Recharts
- 🎯 **Role-Based Routing** - Separate navigation flows for personal users and enterprises

### 🎨 User Experience
- 🌙 **Dark Gaming Theme** - Immersive neon/cyberpunk inspired design
- ✨ **Smooth Animations** - Beautiful transitions and micro-interactions with Framer Motion
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🎯 **Intuitive Interface** - Easy-to-navigate design for all user levels
- 🧙 **Mage Guide System** - Interactive companion that provides contextual tips and guidance throughout the user journey
- 🔊 **Immersive Sound System** - Lightweight audio feedback for quest creation, completion, and UI interactions with volume control and mute toggle
- 💎 **Premium Glass/Jelly UI** - Advanced glassmorphism effects with depth and reflections
- 🌟 **Rarity Animations** - Dynamic shine sweeps, glows, and premium badge effects
- 🎨 **Fantasy Aesthetics** - Consistent RPG-themed design across all interfaces
- 📊 **Dashboard Visualizations** - Animated charts and stats with gaming-inspired styling

---

## 🎵 Sound System Architecture

### Core Features
LifeRPG features a sophisticated yet lightweight audio system that enhances user experience without compromising performance:

#### **Sound Library**
- 🎵 **3 Essential Sounds**: `create.mp3`, `complete.mp3`, `click.mp3`
- 📈 **Optimized Size**: Total ~157KB for all audio files
- 📍 **Strategic Placement**: Sounds mapped to specific user actions

#### **Volume Control System** 
- **Dynamic Volume Levels**: Different volumes per sound type
  - `create.mp3`: 0.4 volume (subtle creation feedback)
  - `complete.mp3`: 0.4 volume (achievement celebration)
  - `click.mp3`: 0.6 volume (enhanced UI feedback)
- **User Control**: Global mute toggle with localStorage persistence
- **Non-Intrusive**: Designed to enhance without overwhelming

#### **Smart Sound Management** 
- **Cooldown System**: 100ms between sounds prevents spam
- **Error Handling**: Silent fail for browser autoplay restrictions
- **Success-Only**: Sounds play only on successful actions, not errors
- **Memory Efficient**: Audio objects created on-demand

###  Technical Implementation

#### **Centralized Sound Utility** 
```javascript
// Location: /src/utils/sounds.js
export const playSound = (type) => {
  // Mute check, cooldown, volume control, error handling
}
```

#### **Sound Mapping Architecture** 
- **Quest Creation** `create.mp3` - New quests, chronicles, successful submissions
- **Quest Completion** `complete.mp3` - Achievement celebrations, level ups
- **UI Interactions** `click.mp3` - Navigation, mage toggle, button clicks
- **Marketplace Actions** `create.mp3` - Coupon purchases, marketplace interactions
- **Enterprise Actions** `click.mp3` - Dashboard navigation, coupon management
- **Purchase Success** `complete.mp3` - Successful coupon redemption

#### **Browser Compatibility** 
- **HTML5 Audio API**: Native browser audio playback
- **Autoplay Safe**: Handles modern browser autoplay policies
- **Cross-Platform**: Works on desktop, tablet, and mobile devices

###  User Experience Integration

#### **Contextual Audio Feedback** 
- **Creation Actions**: Positive reinforcement for content creation
- **Achievement Actions**: Celebratory sounds for accomplishments
- **Navigation**: Subtle clicks for UI interactions
- **Error Prevention**: No sound plays on failed actions

#### **Accessibility Features** 
- **Mute Persistence**: User preference saved across sessions
- **Volume Balance**: Click sounds louder for visibility, others subtle
- **Performance Optimized**: Minimal impact on page load and responsiveness

---

## � LifeRPG Coins Economy

### 🎮 Coin Earning System
LifeRPG features a **reward-based coin economy** that incentivizes meaningful gameplay and community engagement:

#### **Coin Acquisition Rules**
- **Quest Completion + Chronicle Post**: Users earn coins ONLY after completing a quest AND posting a chronicle about it
- **One-Time Reward**: Coins are awarded once per quest only to prevent farming abuse
- **No Farming**: Cannot repeatedly earn coins for the same quest
- **Encourages Sharing**: Rewards users for documenting and sharing their achievements

#### **Coin Usage**
- **Arcane Market Purchases**: Spend earned coins to purchase exclusive coupons and rewards
- **Premium Rewards**: Access higher-tier coupons with better value propositions
- **Real-World Value**: Coupons provide actual discounts and offers from participating merchants

#### **Economy Progression**
- **Integrated Stats**: Coin balance displayed in navbar for easy access
- **Gameplay Loop**: Complete quests → Post chronicles → Earn coins → Purchase rewards
- **Skill Development**: Encourages consistent quest completion and community participation
- **Merchant Engagement**: Connects users with real businesses through gamified rewards

---

## 🏢 Enterprise Portal

### 🎯 Merchant Authentication System
LifeRPG provides a **separate enterprise authentication system** for businesses and merchants:

#### **Company Account Features**
- **Secure Registration**: Company signup with name, email, and custom branding
- **Independent Sessions**: Separate authentication from personal user accounts
- **JWT-Based Security**: Token-based authentication with company-specific data isolation
- **Account Management**: Full CRUD operations for company profiles and settings

#### **Coupon Management System**
- **Create Coupons**: Design exclusive offers with images, categories, and rarity tiers
- **Image Uploads**: Advanced WYSIWYG image editor with 16:9 aspect ratio cropping
- **Rarity Tiers**: Six levels from Basic (2000 coins) to Ultimate Deal (10000 coins)
- **Category System**: Books, Courses, Clothing, Sports, Food, Travel, Gaming, Electronics, Fitness, Lifestyle
- **Active/Expired Control**: Mark coupons as expired to disable new purchases
- **Soft Delete**: Delete coupons while preserving access for users who already purchased them

#### **Purchase Analytics**
- **Redemption Tracking**: Monitor how many users have purchased each coupon
- **Timeline Data**: View purchase activity over time with date-based aggregation
- **Performance Metrics**: Identify top-performing coupons and optimize offerings

---

## 📊 Enterprise Analytics Dashboard

### 🎨 Interactive Analytics System
The enterprise dashboard features **advanced visualizations** for comprehensive business intelligence:

#### **Real-Time Statistics**
- **Total Coupons**: Overview of all created coupons
- **Active/Expired Counts**: Current status of coupon inventory
- **Total Redemptions**: Aggregate purchase data across all coupons
- **Recent Activity**: Live feed of recent purchases and engagement

#### **Animated Graphs & Visualizations**
- **Purchase Timeline**: Area chart showing purchase activity over time with gradient fills
- **Coupon Analytics**: Multi-line graph comparing active, expired, and purchase trends
- **Interactive Filters**: Toggle visibility of different data series
- **Responsive Design**: Charts adapt to different screen sizes and orientations

#### **Performance Metrics**
- **Top Performing Coupons**: Ranked list of coupons by purchase count
- **Recent Purchases Feed**: Live updates on customer activity
- **Date-Based Aggregation**: Daily, monthly, and yearly view options
- **Recharts Integration**: Professional charting library with smooth animations

#### **Fantasy Enterprise Theme**
- **Gaming-Inspired UI**: Neon colors, glass effects, and premium aesthetics
- **Animated Transitions**: Smooth state changes and micro-interactions
- **Hover Effects**: Interactive elements with scale and glow animations
- **Premium Visuals**: Consistent with LifeRPG's fantasy RPG theme

---

## 🏠 Landing Page System

### 🎯 Dual-Role Entry Point
LifeRPG features a **unified landing page** that serves as the entry point for both personal users and enterprise merchants:

#### **Role-Based Navigation**
- **Personal Realm**: Entry point for individual users seeking gamified productivity
- **Merchant Portal**: Entry point for businesses wanting to engage with the LifeRPG community
- **Clear Separation**: Distinct visual design and messaging for each role
- **Seamless Routing**: Automatic navigation to appropriate authentication flows

#### **Personal Realm Features**
- **Adventure Theme**: RPG-inspired design with quest and progression highlights
- **Feature Showcase**: Display of core gameplay features (quests, chronicles, marketplace)
- **Call-to-Action**: Direct navigation to personal login/signup
- **Animated Elements**: Smooth transitions and hover effects for engagement

#### **Merchant Portal Features**
- **Business Theme**: Professional design with analytics and engagement highlights
- **Value Proposition**: Clear benefits for businesses (customer engagement, analytics)
- **Feature Showcase**: Display of enterprise capabilities (coupon management, analytics)
- **Call-to-Action**: Direct navigation to enterprise login/signup

#### **Unified Branding**
- **Consistent Aesthetics**: LifeRPG's fantasy theme maintained across both interfaces
- **Shared Design Language**: Common color palette, typography, and visual elements
- **Professional Polish**: High-quality animations and transitions
- **GitHub Showcase Ready**: Premium presentation suitable for project portfolios

---

## �🔒 Authentication & Security

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

## 📊 Leveling & Stats System

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

### 🚀 Platform Architecture
LifeRPG features a **dual-role platform architecture** with separate interfaces for personal users and enterprise merchants:

#### 📱 Personal User Journey
```
🏠 Landing Page → 🔐 Login/Signup → 🎮 Dashboard → 📋 Quests → 📜 Chronicles → 💰 Earn Coins → 🏪 Arcane Market → 🛒 Purchase Coupons
```

#### 🏢 Enterprise Journey
```
🏠 Landing Page → 🏢 Enterprise Login/Signup → 📊 Enterprise Dashboard → 🎫 Coupon Management → 📈 Analytics Dashboard
```

### 📄 Page Structure

#### 🎮 Personal Interface
- **🏠 Landing Page** - Dual-role entry point with Personal Realm and Merchant Portal options
- **🔐 Authentication Pages** - Login & Signup with avatar selection
- **🎮 Dashboard** - Main hub with stats, XP, coins, and recent quests
- **📋 Quests Page** - Create, manage, and complete quests
- **📜 Chronicles Page** - Create and view chronicles with image uploads, comments, and likes
- **🏪 Arcane Market** - Coupon marketplace with search, filters, and purchasing
- **🏆 Leaderboard** - Global rankings and achievements
- **👤 Profile** - User stats and settings (coming soon)

#### 🏢 Enterprise Interface
- **🏠 Landing Page** - Shared entry point with enterprise portal access
- **🏢 Enterprise Login** - Company-specific authentication
- **🏢 Enterprise Signup** - Company registration with logo and details
- **📊 Enterprise Dashboard** - Analytics hub with stats, graphs, and performance metrics
- **🎫 Coupon Management** - Create, edit, expire, and delete coupons with image uploads
- **📈 Analytics Dashboard** - Advanced visualizations for purchase tracking and trends

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

### 🏪 Arcane Market (Coupons)
- `GET /api/coupons` - 🛒 Get all available coupons
- `GET /api/coupons/redeemed` - 🎫 Get user's purchased coupons
- `GET /api/coupons/:id` - 📋 Get single coupon details
- `POST /api/coupons/:id/redeem` - 💰 Purchase coupon with coins
- `GET /api/coupons/meta/categories` - 📂 Get available categories

### 🏢 Enterprise Authentication
- `POST /api/company/signup` - 🏢 Register new company account
- `POST /api/company/login` - 🔑 Company login
- `DELETE /api/company/delete` - 🗑️ Delete enterprise account

### 🎫 Enterprise Coupon Management
- `GET /api/company/coupons` - 📋 Get company's coupons
- `POST /api/company/coupons` - ➕ Create new coupon with image
- `PUT /api/company/coupons/:id/expire` - ⏰ Mark coupon as expired
- `DELETE /api/company/coupons/:id` - 🗑️ Delete coupon (soft delete)
- `GET /api/company/coupons/:id/image` - 🖼️ Get coupon image

### 📊 Enterprise Analytics
- `GET /api/company/dashboard` - 📈 Get dashboard stats and analytics

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
- `DELETE /api/posts/:id` - 🗑️ Delete chronicle
- `GET /api/leaderboard` - 🏆 Get top users by XP
- `GET /api/leaderboard/my-rank` - 🎯 Get user's rank
- `GET /api/health` - 🔍 Server status monitoring (deployment/monitoring utility, not used in core functionality)

---

## 🎯 Brand & Visual Identity
- **🌐 Production-Ready Favicon System** - Comprehensive favicon setup with PWA support
  - Main favicon.ico for browser tabs
  - High-resolution 96x96.png for modern displays
  - Apple touch icon for iOS home screens
  - Progressive Web App manifest for PWA installation
  - Proper theme colors matching gaming aesthetic (#0f172a)
- **🎨 Consistent Branding** - All icons follow LifeRPG's neon/cyberpunk theme
- **📱 Mobile Optimized** - Works seamlessly across all device sizes and platforms

---

## 📁 Project Structure

```
LifeRPG/
├── 📁 client/                 # React Frontend Application
│   ├── 📁 public/              # Static assets (favicon, images, sounds)
│   │   ├── favicon.ico           # Main browser tab icon
│   │   ├── favicon-96x96.png     # High-resolution icon for modern displays
│   │   ├── apple-touch-icon.png  # iOS home screen icon
│   │   ├── site.webmanifest       # PWA manifest for app installation
│   │   ├── web-app-manifest-192x192.png  # PWA icon (192x192)
│   │   ├── web-app-manifest-512x512.png  # PWA icon (512x512)
│   │   └── sounds/         # Audio files for immersive feedback
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable UI components
│   │   ├── 📁 context/         # React Context (Auth, Mage, CompanyAuth)
│   │   ├── 📁 pages/           # Page components
│   │   │   ├── 📁 enterprise/  # Enterprise portal pages
│   │   │   │   ├── CompanyDashboard.jsx
│   │   │   │   ├── CompanyCouponsPage.jsx
│   │   │   │   ├── CompanyLoginPage.jsx
│   │   │   │   └── CompanySignupPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── MarketplacePage.jsx
│   │   │   ├── MarketplacePage.css
│   │   │   └── ...
│   │   ├── 📁 services/        # API services
│   │   ├── 📁 utils/           # Helper functions (sounds, formatting)
│   │   ├── 📄 App.jsx          # Main App component
│   │   └── 📄 main.jsx         # App entry point
│   ├── 📄 package.json         # Frontend dependencies
│   ├── 📄 vite.config.js       # Vite configuration
│   └── 📄 tailwind.config.js   # Tailwind CSS config
├── 📁 server/                  # Node.js Backend API
│   ├── 📁 middleware/          # Express middleware
│   ├── 📁 models/              # MongoDB models
│   │   ├── User.js
│   │   ├── Quest.js
│   │   ├── Post.js
│   │   ├── Company.js
│   │   ├── Coupon.js
│   │   └── CouponRedemption.js
│   ├── 📁 routes/              # API routes
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── quests.js
│   │   ├── posts.js
│   │   ├── company.js
│   │   └── coupons.js
│   ├── 📁 utils/              # Utility functions
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

### 📱 Personal User Journey
1. **🏠 Choose Your Path** - Select Personal Realm on the landing page
2. **🔐 Create Account** - Sign up with username, email, and choose your avatar
3. **📧 Password Recovery** - Use forgot password feature if you lose access to your account
4. **📊 Set Your Goals** - Create quests for daily tasks and main objectives with skill rewards
5. **⚔️ Complete Quests** - Mark tasks as complete to earn XP, stat points, and stars
6. **📜 Post Chronicles** - Share your achievements with the community to earn LifeRPG coins
7. **💰 Earn Coins** - Receive coins for each quest completion + chronicle post (one-time per quest)
8. **🏪 Visit Arcane Market** - Browse exclusive coupons and rewards from participating merchants
9. **🛒 Purchase Coupons** - Spend your earned coins to unlock real-world discounts and offers
10. **📈 Level Up** - Progress through 50 levels from Novice to Godlike with tiered stat boosts
11. **🏆 Climb Leaderboard** - Compete with players worldwide using your accumulated XP
12. **🔄 Daily Routine** - Generate new daily quests each day to build consistent habits
13. **💪 Master Skills** - Develop your character stats to 100,000 with strategic level bonuses

### 🏢 Enterprise Journey
1. **🏠 Choose Your Path** - Select Merchant Portal on the landing page
2. **🏢 Create Company Account** - Register your business with company details and branding
3. **🎫 Create Coupons** - Design exclusive offers with images, categories, and rarity tiers
4. **📊 Monitor Analytics** - Track coupon performance, purchases, and customer engagement
5. **🎯 Optimize Strategy** - Use data insights to improve your coupon offerings
6. **📈 Grow Your Business** - Engage with the LifeRPG community to drive customer acquisition

---

## 🌟 Use Cases & Applications

### 🎓 Education
- 📚 Study motivation and progress tracking
- 🎯 Assignment completion gamification
- 📊 Learning habit formation
- 🎓 Course platforms offering student discounts

### 💼 Professional Development
- 💪 Skill acquisition tracking
- 📋 Project management gamification
- 🎯 Career goal achievement

### 🏃 Personal Growth
- 🏃‍♂️ Fitness and health habit tracking
- 🧘‍♀️ Mindfulness and meditation practice
- 📚 Reading and learning goals

### 🏢 Enterprise & Business
- 🏪 Local businesses offering customer rewards
- 🏋️ Gyms and fitness centers with membership incentives
- 🧘 Yoga studios and wellness centers
- 📚 Educational platforms and course providers
- 🛍️ E-commerce merchants and online stores
- 🎭 Entertainment venues and event organizers
- 🍕 Restaurants and food delivery services

### 👥 Social Features
- 🏆 Friendly competition with friends
- 👥 Team challenges and collaboration
- 📊 Community achievements
- 🤝 Community-driven coupon discovery

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
- 🎯 AI-driven coupon recommendations

### 🌐 Social Features
- 👥 Guilds and team quests
- 💬 Chat and messaging
- 🎪 Events and competitions
- 🏰 Guild marketplaces and group rewards

### 🔗 Integrations
- 📅 Calendar integration
- 📊 Analytics dashboard
- 🔗 Third-party app connections

### 🏪 Marketplace Enhancements
- 🎯 Achievement-based rewards
- 📊 Real-time analytics for enterprises
- 🎪 Enterprise campaigns and promotions
- 🔮 Smart marketplace recommendations
- 🌐 Multi-currency support
- 📦 Wishlist and notification system

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
