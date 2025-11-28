import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
  getAllSchedules,
  getScheduleByDay,
  createUser,
  getUserById,
  getUserByEmail,
  verifyPassword,
  updateUser
} from './database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fitness-tracker-secret-key-2025';

// Middleware
app.use(cors());
app.use(express.json());

// ============== AUTH MIDDLEWARE ==============
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// ============== AUTH ENDPOINTS ==============

// POST Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, nim, kelompok } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = await createUser({ name, email, password, nim, kelompok });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      },
      message: 'Registration successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET Current User (protected)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT Update Profile (protected)
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, password, avatar, nim, kelompok } = req.body;
    
    console.log('📝 Update profile request:', { name, nim, kelompok });

    // Check if new email is already taken by another user
    if (email) {
      const existingUser = await getUserByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    const updated = await updateUser(req.user.id, { name, email, password, avatar, nim, kelompok });

    res.json({
      success: true,
      data: updated,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============== WORKOUT ENDPOINTS ==============

// GET all workouts
app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await getAllWorkouts();
    res.json({
      success: true,
      data: workouts,
      message: 'Workouts retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET single workout by ID
app.get('/api/workouts/:id', async (req, res) => {
  try {
    const workout = await getWorkoutById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }
    
    res.json({
      success: true,
      data: workout,
      message: 'Workout retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST create new workout
app.post('/api/workouts', async (req, res) => {
  try {
    const { exercise, duration, date, notes, calories } = req.body;
    
    if (!exercise || !duration || !date) {
      return res.status(400).json({
        success: false,
        message: 'Exercise, duration, and date are required'
      });
    }
    
    const newWorkout = await createWorkout({
      exercise,
      duration: Number(duration),
      date,
      notes: notes || '',
      calories: calories || 0
    });
    
    res.status(201).json({
      success: true,
      data: newWorkout,
      message: 'Workout created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT update workout
app.put('/api/workouts/:id', async (req, res) => {
  try {
    const existing = await getWorkoutById(req.params.id);
    
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }
    
    const { exercise, duration, date, notes, calories } = req.body;
    
    const updated = await updateWorkout(req.params.id, {
      exercise,
      duration: duration ? Number(duration) : undefined,
      date,
      notes,
      calories: calories !== undefined ? Number(calories) : undefined
    });
    
    res.json({
      success: true,
      data: updated,
      message: 'Workout updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE workout
app.delete('/api/workouts/:id', async (req, res) => {
  try {
    const deleted = await deleteWorkout(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }
    
    res.json({
      success: true,
      data: deleted,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET workout statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getWorkoutStats();
    res.json({
      success: true,
      data: stats,
      message: 'Statistics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============== SCHEDULE ENDPOINTS ==============

// GET all schedules
app.get('/api/schedules', async (req, res) => {
  try {
    const schedules = await getAllSchedules();
    res.json({
      success: true,
      data: schedules,
      message: 'Schedules retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET single schedule by day
app.get('/api/schedules/:day', async (req, res) => {
  try {
    const schedule = await getScheduleByDay(req.params.day);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }
    
    res.json({
      success: true,
      data: schedule,
      message: 'Schedule retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running with Supabase database',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💾 Using Supabase database`);
  console.log(`📚 API Endpoints:`);
  console.log(`   POST   /api/auth/register - Register new user`);
  console.log(`   POST   /api/auth/login    - Login user`);
  console.log(`   GET    /api/auth/me       - Get current user`);
  console.log(`   PUT    /api/auth/profile  - Update profile`);
  console.log(`   GET    /api/workouts      - Get all workouts`);
  console.log(`   GET    /api/workouts/:id  - Get workout by ID`);
  console.log(`   POST   /api/workouts      - Create new workout`);
  console.log(`   PUT    /api/workouts/:id  - Update workout`);
  console.log(`   DELETE /api/workouts/:id  - Delete workout`);
  console.log(`   GET    /api/stats         - Get statistics`);
  console.log(`   GET    /api/schedules     - Get all schedules`);
  console.log(`   GET    /api/schedules/:day - Get schedule by day`);
});
