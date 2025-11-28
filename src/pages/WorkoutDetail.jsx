import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Flame, Edit2, Trash2, Save, X, FileText } from "lucide-react";
import { getWorkoutById, updateWorkout, deleteWorkout } from "../services/api";

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const result = await getWorkoutById(id);
      setWorkout(result.data);
      setEditForm(result.data);
      setIsOffline(result.isOffline || false);
    } catch (err) {
      setError("Workout tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...workout });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ ...workout });
  };

  const handleSave = async () => {
    try {
      const result = await updateWorkout(id, editForm);
      setWorkout(result.data);
      setIsEditing(false);
    } catch (err) {
      alert("Gagal menyimpan perubahan");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah kamu yakin ingin menghapus workout ini?")) return;
    
    try {
      await deleteWorkout(id);
      navigate("/log");
    } catch (err) {
      alert("Gagal menghapus workout");
    }
  };

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
            to="/log"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={20} />
            Kembali ke Log Workout
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
          to="/log"
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
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
          {isEditing ? (
            <input
              type="text"
              value={editForm.exercise || ""}
              onChange={(e) => setEditForm({ ...editForm, exercise: e.target.value })}
              className="text-3xl font-bold bg-white/20 rounded-lg px-4 py-2 w-full text-white placeholder-white/70 outline-none"
              placeholder="Nama Latihan"
            />
          ) : (
            <h1 className="text-3xl font-bold">{workout.exercise}</h1>
          )}
          <p className="text-blue-100 mt-2">Detail Workout</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Duration */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <Clock size={20} />
                </div>
                <span className="text-gray-600 text-sm">Durasi</span>
              </div>
              {isEditing ? (
                <input
                  type="number"
                  value={editForm.duration || ""}
                  onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                  className="text-2xl font-bold text-gray-800 bg-white border rounded-lg px-3 py-1 w-full"
                />
              ) : (
                <p className="text-2xl font-bold text-gray-800">{workout.duration} menit</p>
              )}
            </div>

            {/* Date */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                  <Calendar size={20} />
                </div>
                <span className="text-gray-600 text-sm">Tanggal</span>
              </div>
              {isEditing ? (
                <input
                  type="date"
                  value={editForm.date || ""}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="text-lg font-bold text-gray-800 bg-white border rounded-lg px-3 py-1 w-full"
                />
              ) : (
                <p className="text-xl font-bold text-gray-800">
                  {new Date(workout.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              )}
            </div>

            {/* Calories */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                  <Flame size={20} />
                </div>
                <span className="text-gray-600 text-sm">Kalori Terbakar</span>
              </div>
              {isEditing ? (
                <input
                  type="number"
                  value={editForm.calories || ""}
                  onChange={(e) => setEditForm({ ...editForm, calories: e.target.value })}
                  className="text-2xl font-bold text-gray-800 bg-white border rounded-lg px-3 py-1 w-full"
                  placeholder="0"
                />
              ) : (
                <p className="text-2xl font-bold text-gray-800">{workout.calories || 0} kcal</p>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                <FileText size={20} />
              </div>
              <span className="text-gray-700 font-semibold">Catatan</span>
            </div>
            {isEditing ? (
              <textarea
                value={editForm.notes || ""}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                className="w-full bg-white border rounded-lg p-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Tambahkan catatan untuk workout ini..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {workout.notes || "Tidak ada catatan untuk workout ini."}
              </p>
            )}
          </div>

          {/* Created At */}
          {workout.createdAt && (
            <p className="text-gray-400 text-sm">
              Dibuat pada: {new Date(workout.createdAt).toLocaleString("id-ID")}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save size={18} />
                Simpan
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
                Hapus
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 size={18} />
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
