# Recovery Companion

Intelligent post-discharge monitoring that bridges the gap between hospital discharge and first follow-up appointment.

## Tech Stack

- **Frontend**: React 18 + Vite + Zustand + React Router
- **Backend**: Node.js + Express
- **Auth & SQL**: Supabase
- **NoSQL**: MongoDB (Mongoose)
- **AI**: Google Gemini Vision API, Web Speech API
- **Maps**: Google Maps JS API

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Supabase project
- Google Cloud API keys (Maps, Gemini)

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Install dependencies:

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### Running the App

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

## Project Structure

See `CLAUDE.md` for detailed architecture and implementation guide.
