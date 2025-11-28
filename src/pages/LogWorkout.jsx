import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Calendar, Clock, ChevronRight, Flame, FileText } from 'lucide-react';
import { getWorkouts, createWorkout, deleteWorkout as deleteWorkoutApi } from "../services/api";

export default function LogWorkout() {
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [calories, setCalories] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const result = await getWorkouts();
      setLogs(result.data || []);
      setIsOffline(result.isOffline || false);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async () => {
    if (!exercise || !duration) return alert("Lengkapi data latihan!");

    try {
      const workoutData = {
        exercise,
        duration: Number(duration),
        date,
        notes,
        calories: Number(calories) || 0
      };

      const result = await createWorkout(workoutData);
      setLogs([...logs, result.data]);
      setIsOffline(result.isOffline || false);

      // Reset form
      setExercise("");
      setDuration("");
      setNotes("");
      setCalories("");
    } catch {
      alert("Gagal menambahkan workout");
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (!confirm("Yakin ingin menghapus workout ini?")) return;
    
    try {
      await deleteWorkoutApi(id);
      setLogs(logs.filter(log => log.id !== id));
    } catch {
      alert("Gagal menghapus workout");
    }
  };

  return (
    <div className="p-6 pt-20 md:pt-6 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Log Latihan</h1>
          <p className="text-gray-600">Catat sesi latihanmu hari ini</p>
        </div>
        {isOffline && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
            Mode Offline
          </span>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Latihan</label>
          <input
            type="text"
            placeholder="Push Up, Squat, Running..."
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durasi (menit)</label>
            <input
              type="number"
              placeholder="30"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kalori Terbakar</label>
            <input
              type="number"
              placeholder="150"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
          <input
            type="date"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
          <textarea
            placeholder="Catatan tambahan untuk workout ini..."
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          onClick={addWorkout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Tambah Latihan</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-xl text-gray-800 mb-4">Riwayat Latihan</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-2">Memuat data...</p>
          </div>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada latihan tercatat</p>
        ) : (
          <div className="space-y-3">
            {logs.slice().reverse().map((log) => (
              <Link 
                key={log.id} 
                to={`/workout/${log.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all group cursor-pointer"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-800 group-hover:text-blue-600">{log.exercise}</p>
                  <div className="flex items-center flex-wrap gap-3 mt-1 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{log.duration} menit</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{log.date}</span>
                    </span>
                    {log.calories > 0 && (
                      <span className="flex items-center space-x-1 text-orange-600">
                        <Flame size={14} />
                        <span>{log.calories} kcal</span>
                      </span>
                    )}
                    {log.notes && (
                      <span className="flex items-center space-x-1 text-purple-600">
                        <FileText size={14} />
                        <span>Ada catatan</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteWorkout(log.id);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
