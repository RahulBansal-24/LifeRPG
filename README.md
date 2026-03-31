# LifeRPG 🎮

A gamified life management web app with RPG elements.

## Features

- User authentication system
- XP and leveling system
- Quest management (Daily & Main quests)
- Stats tracking (Strength, Intelligence, Discipline, Charisma)
- Leaderboard
- Dark gaming theme with animations

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Framer Motion

**Backend:**
- Node.js with Express
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository
2. Install dependencies for both client and server:

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

3. Set up environment variables:
   - Copy `server/.env.example` to `server/.env`
   - Fill in your MongoDB URI and JWT secret

4. Run the application:

```bash
# Terminal 1 - Server
cd server
npm run server

# Terminal 2 - Client
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

### Auth
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login

### User
- GET `/api/user/profile` - Get user profile

### Quests
- GET `/api/quests` - Get user quests
- POST `/api/quests` - Create new quest
- PUT `/api/quests/:id` - Update quest status

### Leaderboard
- GET `/api/leaderboard` - Get top users by XP

## Project Structure

```
LifeRPG/
├── client/          # React frontend
├── server/          # Node.js backend
└── README.md
```
