// API Base URL - sesuaikan dengan server backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function untuk get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function untuk get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function untuk handle response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// ============== AUTH API ==============

// Register new user
export const register = async (name, email, password, nim = '', kelompok = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, nim, kelompok }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error registering:', error);
    return { success: false, message: 'Gagal menghubungi server' };
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, message: 'Gagal menghubungi server' };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error getting current user:', error);
    return { success: false, message: 'Gagal menghubungi server' };
  }
};

// Update profile
export const updateProfile = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'Gagal menghubungi server' };
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// ============== WORKOUT API ==============

// Get all workouts
export const getWorkouts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    // Fallback ke localStorage jika API tidak tersedia
    const localData = JSON.parse(localStorage.getItem('workout_logs') || '[]');
    return { success: true, data: localData, isOffline: true };
  }
};

// Get single workout by ID
export const getWorkoutById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching workout:', error);
    // Fallback ke localStorage
    const localData = JSON.parse(localStorage.getItem('workout_logs') || '[]');
    const workout = localData.find(w => w.id === id || w.id === Number(id));
    if (workout) {
      return { success: true, data: workout, isOffline: true };
    }
    throw error;
  }
};

// Create new workout
export const createWorkout = async (workoutData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutData),
    });
    const result = await handleResponse(response);
    
    // Sync ke localStorage sebagai backup
    const localData = JSON.parse(localStorage.getItem('workout_logs') || '[]');
    localData.push(result.data);
    localStorage.setItem('workout_logs', JSON.stringify(localData));
    
    return result;
  } catch (error) {
    console.error('Error creating workout:', error);
    // Fallback: simpan ke localStorage saja
    const localData = JSON.parse(localStorage.getItem('workout_logs') || '[]');
    const newWorkout = {
      ...workoutData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    localData.push(newWorkout);
    localStorage.setItem('workout_logs', JSON.stringify(localData));
    return { success: true, data: newWorkout, isOffline: true };
  }
};

// Update workout
export const updateWorkout = async (id, workoutData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutData),
    });
    const result = await handleResponse(response);
    
    // Sync ke localStorage
    const localData = JSON.parse(localStorage.getItem('workout_logs') || '[]');
    const index = localData.findIndex(w => w.id === id || w.id === Number(id));
    if (index !== -1) {
      localData[index] = result.data;
      localStorage.setItem('workout_logs', JSON.stringify(localData));
    }
    
    return result;
  } catch (error) {
    console.error('Error updating workout:', error);
    // Fallback ke localStorage
    const localData = JSON.parse(localStorage.getItem('workout_logs') || '[]');
    const index = localData.findIndex(w => w.id === id || w.id === Number(id));
    if (index !== -1) {
      localData[index] = { ...localData[index], ...workoutData };
      localStorage.setItem('workout_logs', JSON.stringify(localData));
      return { success: true, data: localData[index], isOffline: true };
    }
    throw error;
  }
};

// Delete workout
export const deleteWorkout = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'DELETE',
    });
    const result = await handleResponse(response);
    
    // Sync ke localStorage
    const localData = JSON.parse(localStorage.getItem('workout_logs') || '[]');
    const filtered = localData.filter(w => w.id !== id && w.id !== Number(id));
    localStorage.setItem('workout_logs', JSON.stringify(filtered));
    
    return result;
  } catch (error) {
    console.error('Error deleting workout:', error);
    // Fallback ke localStorage
    const localData = JSON.parse(localStorage.getItem('workout_logs') || '[]');
    const filtered = localData.filter(w => w.id !== id && w.id !== Number(id));
    localStorage.setItem('workout_logs', JSON.stringify(filtered));
    return { success: true, isOffline: true };
  }
};

// Get statistics
export const getStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Calculate from localStorage
    const localData = JSON.parse(localStorage.getItem('workout_logs') || '[]');
    const totalWorkout = localData.length;
    const totalDuration = localData.reduce((a, b) => a + Number(b.duration), 0);
    const totalCalories = localData.reduce((a, b) => a + Number(b.calories || 0), 0);
    const avgDuration = totalWorkout > 0 ? Math.round(totalDuration / totalWorkout) : 0;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = localData.filter(w => new Date(w.date) >= weekAgo).length;
    
    return {
      success: true,
      data: { totalWorkout, totalDuration, totalCalories, avgDuration, thisWeek },
      isOffline: true
    };
  }
};

// ============== SCHEDULE API ==============

// Get all schedules
export const getSchedules = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    // Return default schedule data
    return {
      success: true,
      data: getDefaultSchedules(),
      isOffline: true
    };
  }
};

// Get schedule by day
export const getScheduleByDay = async (day) => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules/${day}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    // Return from default data
    const schedules = getDefaultSchedules();
    const schedule = schedules.find(
      s => s.day.toLowerCase() === day.toLowerCase() ||
           s.dayEn?.toLowerCase() === day.toLowerCase()
    );
    if (schedule) {
      return { success: true, data: schedule, isOffline: true };
    }
    throw error;
  }
};

// Default schedule data (fallback)
const getDefaultSchedules = () => [
  {
    day: 'Senin',
    dayEn: 'monday',
    workout: 'Chest + Tricep',
    color: 'bg-red-500',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 12 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 12 },
      { name: 'Cable Fly', sets: 3, reps: 15 },
      { name: 'Tricep Pushdown', sets: 3, reps: 12 },
      { name: 'Skull Crusher', sets: 3, reps: 12 }
    ],
    tips: 'Fokus pada kontraksi otot dada, jangan terlalu berat di awal'
  },
  {
    day: 'Selasa',
    dayEn: 'selasa',
    workout: 'Back + Bicep',
    color: 'bg-orange-500',
    exercises: [
      { name: 'Pull Up', sets: 4, reps: 10 },
      { name: 'Barbell Row', sets: 4, reps: 12 },
      { name: 'Lat Pulldown', sets: 3, reps: 12 },
      { name: 'Barbell Curl', sets: 3, reps: 12 },
      { name: 'Hammer Curl', sets: 3, reps: 12 }
    ],
    tips: 'Tarik dengan siku, bukan dengan tangan untuk aktivasi punggung maksimal'
  },
  {
    day: 'Rabu',
    dayEn: 'rabu',
    workout: 'Leg Day',
    color: 'bg-yellow-500',
    exercises: [
      { name: 'Squat', sets: 4, reps: 12 },
      { name: 'Leg Press', sets: 4, reps: 15 },
      { name: 'Romanian Deadlift', sets: 3, reps: 12 },
      { name: 'Leg Curl', sets: 3, reps: 15 },
      { name: 'Calf Raises', sets: 4, reps: 20 }
    ],
    tips: 'Jangan skip leg day! Pastikan pemanasan yang cukup sebelum squat berat'
  },
  {
    day: 'Kamis',
    dayEn: 'kamis',
    workout: 'Shoulder',
    color: 'bg-green-500',
    exercises: [
      { name: 'Overhead Press', sets: 4, reps: 10 },
      { name: 'Lateral Raise', sets: 4, reps: 15 },
      { name: 'Front Raise', sets: 3, reps: 12 },
      { name: 'Rear Delt Fly', sets: 3, reps: 15 },
      { name: 'Shrugs', sets: 3, reps: 15 }
    ],
    tips: 'Gunakan beban ringan untuk lateral raise, fokus pada form'
  },
  {
    day: 'Jumat',
    dayEn: 'jumat',
    workout: 'Full Body',
    color: 'bg-blue-500',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 8 },
      { name: 'Bench Press', sets: 3, reps: 10 },
      { name: 'Pull Up', sets: 3, reps: 10 },
      { name: 'Squat', sets: 3, reps: 12 },
      { name: 'Plank', sets: 3, reps: '60 detik' }
    ],
    tips: 'Hari untuk compound movement, fokus pada kekuatan'
  },
  {
    day: 'Sabtu',
    dayEn: 'sabtu',
    workout: 'Cardio',
    color: 'bg-purple-500',
    exercises: [
      { name: 'Running', sets: 1, reps: '30 menit' },
      { name: 'Jump Rope', sets: 5, reps: '2 menit' },
      { name: 'Burpees', sets: 3, reps: 15 },
      { name: 'Mountain Climbers', sets: 3, reps: 30 },
      { name: 'Cycling', sets: 1, reps: '20 menit' }
    ],
    tips: 'Jaga heart rate di zona fat burning (60-70% max HR)'
  },
  {
    day: 'Minggu',
    dayEn: 'minggu',
    workout: 'Rest',
    color: 'bg-gray-500',
    exercises: [
      { name: 'Stretching', sets: 1, reps: '15 menit' },
      { name: 'Foam Rolling', sets: 1, reps: '10 menit' },
      { name: 'Light Walking', sets: 1, reps: '30 menit' }
    ],
    tips: 'Istirahat penting untuk recovery otot. Tidur 7-8 jam dan makan bergizi'
  }
];

export default {
  // Auth
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  isAuthenticated,
  // Workouts
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getStats,
  // Schedules
  getSchedules,
  getScheduleByDay
};
