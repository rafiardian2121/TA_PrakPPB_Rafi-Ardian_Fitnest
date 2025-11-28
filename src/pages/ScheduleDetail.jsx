import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Dumbbell, CheckCircle2, Info, Timer } from "lucide-react";
import { getScheduleByDay } from "../services/api";

export default function ScheduleDetail() {
  const { day } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchSchedule();
    // Load completed exercises from localStorage
    const saved = localStorage.getItem(`completed_${day}`);
    if (saved) {
      setCompletedExercises(JSON.parse(saved));
    }
  }, [day]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const result = await getScheduleByDay(day);
      setSchedule(result.data);
      setIsOffline(result.isOffline || false);
    } catch (err) {
      setError("Jadwal tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = (index) => {
    const newCompleted = completedExercises.includes(index)
      ? completedExercises.filter(i => i !== index)
      : [...completedExercises, index];
    
    setCompletedExercises(newCompleted);
    localStorage.setItem(`completed_${day}`, JSON.stringify(newCompleted));
  };

  const progress = schedule?.exercises 
    ? Math.round((completedExercises.length / schedule.exercises.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Link
            to="/schedule"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={20} />
            Kembali ke Jadwal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20 md:pt-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/schedule"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </Link>
        
        {isOffline && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
            Mode Offline
          </span>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className={`${schedule.color} p-6 text-white`}>
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell size={32} />
            <div>
              <h1 className="text-3xl font-bold">{schedule.day}</h1>
              <p className="text-white/80">{schedule.workout}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 font-medium">Progress Hari Ini</span>
            <span className="text-gray-800 font-bold">{progress}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {completedExercises.length} dari {schedule.exercises?.length || 0} latihan selesai
          </p>
        </div>

        {/* Exercise List */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Dumbbell className="text-blue-600" size={24} />
            Daftar Latihan
          </h2>
          
          <div className="space-y-3">
            {schedule.exercises?.map((exercise, index) => {
              const isCompleted = completedExercises.includes(index);
              return (
                <div
                  key={index}
                  onClick={() => toggleExercise(index)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                    isCompleted 
                      ? "bg-green-50 border-2 border-green-200" 
                      : "bg-gray-50 border-2 border-transparent hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className={`font-semibold ${isCompleted ? "text-green-700 line-through" : "text-gray-800"}`}>
                        {exercise.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {exercise.sets} set × {exercise.reps} reps
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isCompleted 
                      ? "bg-green-200 text-green-700" 
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {isCompleted ? "Selesai" : "Belum"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips Section */}
        {schedule.tips && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-t">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                <Info size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Tips</h3>
                <p className="text-gray-600">{schedule.tips}</p>
              </div>
            </div>
          </div>
        )}

        {/* Estimated Time */}
        <div className="p-6 border-t">
          <div className="flex items-center gap-3 text-gray-600">
            <Timer size={20} />
            <span>Estimasi waktu: <strong>{schedule.exercises?.length * 10 || 0} - {schedule.exercises?.length * 15 || 0} menit</strong></span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      {completedExercises.length > 0 && (
        <button
          onClick={() => {
            setCompletedExercises([]);
            localStorage.removeItem(`completed_${day}`);
          }}
          className="w-full py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
        >
          Reset Progress Hari Ini
        </button>
      )}
    </div>
  );
}
