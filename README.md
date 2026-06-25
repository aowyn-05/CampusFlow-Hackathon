# CampusFlow 🎓

CampusFlow is a student productivity web app that lets students add academic deadlines and notices, which are then processed by AI and automatically turned into **WhatsApp reminders** and **Google Calendar events** via n8n automation.

Built in a 3-hour hackathon sprint.

---

## ✨ Features

- **Student Onboarding** — name, branch, year, phone, email
- **Task Management** — add/edit/delete deadlines with reminder time and "Add to Calendar" toggle
- **AI Notice Summarizer** — paste a college notice, get a clean 3-bullet summary
- **AI Flashcard Generator** — turn study notes into Q&A flashcards
- **Attendance Alerter** — calculates how many more classes you need to attend to hit a target percentage
- **Automated Reminders** — WhatsApp message sent 24h (and optionally 1h) before a deadline
- **Automated Calendar Events** — deadlines auto-created as Google Calendar events
- **Notice Broadcast** — summarized notices pushed to a list of students via WhatsApp + Calendar

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Next.js), Tailwind CSS, ShadcnUI |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| AI | Groq API (Llama 3.1) |
| Automation | n8n Cloud |
| Messaging | Twilio WhatsApp API |
| Calendar | Google Calendar API (OAuth2) |
| Auth | JWT, bcrypt |

---

## 📁 Project Structure

```
campusflow/
├── frontend/              # React/Next.js client
└── backend/
    ├── config/
    │   └── supabase.js    # Supabase client setup
    ├── routes/
    │   ├── auth.js        # Register / login
    │   ├── tasks.js       # Task CRUD + n8n webhook trigger
    │   └── ai.js          # Summarizer, flashcards, attendance alerter
    ├── server.js          # Express app entry point
    ├── .env.example
    └── package.json
```

---

## ⚙️ Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/campusflow.git
cd campusflow/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your keys:

```env
PORT=5000
JWT_SECRET=

SUPABASE_URL=
SUPABASE_KEY=

GROQ_API_KEY=

N8N_DEADLINE_WEBHOOK=
N8N_NOTICE_WEBHOOK=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### 4. Set up the database
Run the following in the Supabase SQL editor:

```sql
create table users (
  id uuid default gen_random_uuid() primary key,
  name text,
  branch text,
  year text,
  phone text,
  email text unique,
  password text,
  created_at timestamp default now()
);

create table tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id),
  title text,
  subject text,
  deadline timestamp,
  reminder_time timestamp,
  add_to_calendar boolean default false,
  phone text,
  student_name text,
  created_at timestamp default now()
);
```

### 5. Run the backend
```bash
npm run dev
```
Server will start on `http://localhost:5000`.

### 6. Run the frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔌 API Reference

### Auth

| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ name, branch, year, phone, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |

### Tasks

| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/tasks` | `{ user_id, title, subject, deadline, reminder_time, add_to_calendar, phone, student_name }` |
| GET | `/api/tasks` | — |

### AI

| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/ai/summarize` | `{ noticeText }` |
| POST | `/api/ai/flashcards` | `{ notesText }` |
| POST | `/api/ai/attendance` | `{ attended, total, subject, targetPercent }` |

---

## 🔄 Automation Flow

```
Student adds task
      ↓
Backend saves to Supabase
      ↓
Backend POSTs to n8n webhook
      ↓
n8n creates Google Calendar event
      ↓
n8n sends WhatsApp reminder (24h before, optional 1h nudge)
```

---

## 👥 Team

| Role | Owner |
|---|---|
| Frontend + UI | Member A |
| Backend + AI | Member B |
| n8n Automation + Integration | Member C |

---

## 📄 License

Built for hackathon purposes. No license restrictions — use freely for educational reference.
