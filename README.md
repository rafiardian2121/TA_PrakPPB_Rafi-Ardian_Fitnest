# 💪 FitTrack - Fitness Tracker PWA

Aplikasi Progressive Web App (PWA) untuk tracking workout dan jadwal latihan fitness.

## 📋 Deskripsi

FitTrack adalah aplikasi fitness tracker berbasis web yang memungkinkan pengguna untuk:
- Mencatat aktivitas workout harian
- Melihat jadwal latihan mingguan
- Melacak statistik dan progres latihan
- Mengelola profil pengguna

## 🛠️ Tech Stack

### Frontend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| React | 19.2.0 | Library JavaScript untuk membangun UI |
| Vite | 7.2.2 | Build tool dan dev server yang cepat |
| Tailwind CSS | 4.1.17 | Utility-first CSS framework |
| React Router DOM | 7.9.6 | Routing untuk React SPA |
| Lucide React | - | Icon library |

### Backend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| Node.js | ≥18.0.0 | JavaScript runtime |
| Express.js | 4.21.0 | Web framework untuk Node.js |
| Supabase | 2.39.0 | Backend-as-a-Service (PostgreSQL) |
| bcryptjs | 3.0.2 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT authentication |
| CORS | 2.8.5 | Cross-Origin Resource Sharing |

### Database
| Teknologi | Deskripsi |
|-----------|-----------|
| Supabase (PostgreSQL) | Cloud database dengan real-time capabilities |

## 📁 Struktur Project

```
├── public/                 # Static assets
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Service worker untuk offline
│   └── icons/              # App icons
├── src/
│   ├── components/         # Reusable components
│   │   └── Navigation.jsx  # Navigation bar
│   ├── pages/              # Page components
│   │   ├── Landing.jsx     # Landing page
│   │   ├── Dashboard.jsx   # Dashboard utama
│   │   ├── LogWorkout.jsx  # Form log workout
│   │   ├── Schedule.jsx    # Jadwal latihan
│   │   └── About.jsx       # Profil pengguna
│   ├── App.jsx             # Root component
│   ├── App.css             # Global styles
│   └── main.jsx            # Entry point
├── server/
│   ├── index.js            # Express server
│   ├── database.js         # Supabase client & functions
│   ├── package.json        # Server dependencies
│   └── .env                # Environment variables
└── package.json            # Frontend dependencies
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrasi user baru |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |
| PUT | `/api/auth/profile` | Update profil (protected) |

### Workouts
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/workouts` | Get semua workout |
| GET | `/api/workouts/:id` | Get workout by ID |
| POST | `/api/workouts` | Create workout baru |
| PUT | `/api/workouts/:id` | Update workout |
| DELETE | `/api/workouts/:id` | Delete workout |
| GET | `/api/stats` | Get statistik workout |

### Schedules
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/schedules` | Get semua jadwal |
| GET | `/api/schedules/:day` | Get jadwal by hari |

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  nim TEXT DEFAULT '',
  kelompok TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### Workouts Table
```sql
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  exercise TEXT NOT NULL,
  duration INTEGER NOT NULL,
  date DATE NOT NULL,
  notes TEXT DEFAULT '',
  calories INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### Schedules Table
```sql
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  day TEXT NOT NULL UNIQUE,
  day_en TEXT NOT NULL,
  workout TEXT NOT NULL,
  color TEXT NOT NULL,
  tips TEXT
);
```

### Schedule Exercises Table
```sql
CREATE TABLE schedule_exercises (
  id SERIAL PRIMARY KEY,
  schedule_day TEXT NOT NULL REFERENCES schedules(day),
  name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL
);
```

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js ≥ 18.0.0
- npm atau yarn
- Akun Supabase

### Frontend Setup
```bash
# Clone repository
git clone https://github.com/rafiardian2121/TA_Prak-PPB_Rafi-Ardian.git
cd TA_Prak-PPB_Rafi-Ardian

# Install dependencies
npm install

# Run development server
npm run dev
```

### Backend Setup
```bash
# Masuk ke folder server
cd server

# Install dependencies
npm install

# Buat file .env
cp .env.example .env
# Edit .env dengan credentials Supabase

# Run server
npm start
```

### Environment Variables
```env
# Server
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001
JWT_SECRET=your_jwt_secret

# Frontend (.env.production)
VITE_API_URL=http://your-server-ip:3001/api
```

## 📱 PWA Features

- ✅ Installable (Add to Home Screen)
- ✅ Responsive Design
- ✅ Service Worker untuk caching
- ✅ Offline-capable
- ✅ App Manifest

## 👤 Informasi Developer

| Field | Value |
|-------|-------|
| Nama | Rafi Ardian Putra |
| NIM | - |
| Kelompok | - |

## 📄 License

MIT License - Bebas digunakan untuk pembelajaran.
