import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Hardcoded Supabase credentials for Vercel deployment
const supabaseUrl = 'https://kbkkdrmckofzjenbrhwp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtia2tkcm1ja29memplbmJyaHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTIxNjcsImV4cCI6MjA3OTg4ODE2N30.rnpv258b4eNw1hKZgIw8bgLNJRBrNG2LfP6_P2uGhs4';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔗 Connected to Supabase:', supabaseUrl);

// ==================== WORKOUT FUNCTIONS ====================

export const getAllWorkouts = async () => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
  
  return data || [];
};

export const getWorkoutById = async (id) => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching workout:', error);
    throw error;
  }
  
  return data;
};

export const createWorkout = async (workout) => {
  const created_at = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('workouts')
    .insert({
      exercise: workout.exercise,
      duration: workout.duration,
      date: workout.date,
      notes: workout.notes || '',
      calories: workout.calories || 0,
      user_id: workout.userId || null,
      created_at
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
  
  return data;
};

export const updateWorkout = async (id, workout) => {
  const updated_at = new Date().toISOString();
  
  const updateData = { updated_at };
  if (workout.exercise !== undefined) updateData.exercise = workout.exercise;
  if (workout.duration !== undefined) updateData.duration = workout.duration;
  if (workout.date !== undefined) updateData.date = workout.date;
  if (workout.notes !== undefined) updateData.notes = workout.notes;
  if (workout.calories !== undefined) updateData.calories = workout.calories;
  
  const { data, error } = await supabase
    .from('workouts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
  
  return data;
};

export const deleteWorkout = async (id) => {
  // First get the workout to return it
  const workout = await getWorkoutById(id);
  
  if (workout) {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  }
  
  return workout;
};

export const getWorkoutStats = async () => {
  const { data: workouts, error } = await supabase
    .from('workouts')
    .select('*');
  
  if (error) {
    console.error('Error fetching workout stats:', error);
    throw error;
  }
  
  const allWorkouts = workouts || [];
  
  const totalWorkout = allWorkouts.length;
  const totalDuration = allWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalCalories = allWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
  const avgDuration = totalWorkout > 0 ? Math.round(totalDuration / totalWorkout) : 0;
  
  // Calculate workouts this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  
  const thisWeek = allWorkouts.filter(w => w.date >= weekAgoStr).length;
  
  return {
    totalWorkout,
    totalDuration,
    totalCalories,
    avgDuration,
    thisWeek
  };
};

// ==================== SCHEDULE FUNCTIONS ====================

export const getAllSchedules = async () => {
  const { data: schedules, error: scheduleError } = await supabase
    .from('schedules')
    .select('*')
    .order('id', { ascending: true });
  
  if (scheduleError) {
    console.error('Error fetching schedules:', scheduleError);
    throw scheduleError;
  }
  
  const { data: exercises, error: exerciseError } = await supabase
    .from('schedule_exercises')
    .select('*');
  
  if (exerciseError) {
    console.error('Error fetching schedule exercises:', exerciseError);
    throw exerciseError;
  }
  
  // Group exercises by schedule_day
  const exercisesByDay = {};
  (exercises || []).forEach(ex => {
    if (!exercisesByDay[ex.schedule_day]) {
      exercisesByDay[ex.schedule_day] = [];
    }
    exercisesByDay[ex.schedule_day].push({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps
    });
  });
  
  return (schedules || []).map(schedule => ({
    ...schedule,
    exercises: exercisesByDay[schedule.day] || []
  }));
};

export const getScheduleByDay = async (day) => {
  const { data: schedule, error: scheduleError } = await supabase
    .from('schedules')
    .select('*')
    .or(`day.ilike.${day},day_en.ilike.${day}`)
    .single();
  
  if (scheduleError && scheduleError.code !== 'PGRST116') {
    console.error('Error fetching schedule:', scheduleError);
    throw scheduleError;
  }
  
  if (!schedule) return null;
  
  const { data: exercises, error: exerciseError } = await supabase
    .from('schedule_exercises')
    .select('name, sets, reps')
    .eq('schedule_day', schedule.day);
  
  if (exerciseError) {
    console.error('Error fetching exercises:', exerciseError);
    throw exerciseError;
  }
  
  return {
    ...schedule,
    exercises: exercises || []
  };
};

// ==================== USER FUNCTIONS ====================

export const createUser = async (userData) => {
  const created_at = new Date().toISOString();
  const hashedPassword = bcrypt.hashSync(userData.password, 10);
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      nim: userData.nim || '',
      kelompok: userData.kelompok || '',
      avatar: userData.avatar || '',
      created_at
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }
  
  // Return user without password
  const { password, ...userWithoutPassword } = data;
  return userWithoutPassword;
};

export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user:', error);
    throw error;
  }
  
  if (data) {
    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }
  
  return null;
};

export const getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user by email:', error);
    throw error;
  }
  
  return data;
};

export const verifyPassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

export const updateUser = async (id, userData) => {
  const updated_at = new Date().toISOString();
  
  console.log('📝 updateUser called with:', { id, userData });
  
  const updateData = { updated_at };
  
  if (userData.name) updateData.name = userData.name;
  if (userData.email) updateData.email = userData.email.toLowerCase();
  if (userData.password) updateData.password = bcrypt.hashSync(userData.password, 10);
  if (userData.nim !== undefined) updateData.nim = userData.nim;
  if (userData.kelompok !== undefined) updateData.kelompok = userData.kelompok;
  if (userData.avatar !== undefined) updateData.avatar = userData.avatar;
  
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }
  
  // Return user without password
  const { password, ...userWithoutPassword } = data;
  return userWithoutPassword;
};

// Export Supabase client for direct access if needed
export default supabase;
