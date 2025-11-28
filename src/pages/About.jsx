import { useState, useEffect } from "react";
import { Users, Target, Zap, Edit2, Save, X } from "lucide-react";
import { useAuth } from "../App";
import { updateProfile, getCurrentUser } from "../services/api";

export default function About() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [error, setError] = useState("");
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    nim: user?.nim || "",
    kelompok: user?.kelompok || "",
  });

  // Refresh user data from API when page loads
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        const result = await getCurrentUser();
        if (result.success) {
          setUser(result.data);
          localStorage.setItem("user", JSON.stringify(result.data));
          setEditForm({
            name: result.data.name || "",
            nim: result.data.nim || "",
            kelompok: result.data.kelompok || "",
          });
        }
      } catch (err) {
        console.error("Failed to refresh user data:", err);
      } finally {
        setRefreshing(false);
      }
    };
    refreshUserData();
  }, [setUser]);
  
  const profile = {
    name: user?.name || "Guest",
    nim: user?.nim || "-",
    kelompok: user?.kelompok || "-",
  };

  const handleEdit = () => {
    setEditForm({
      name: user?.name || "",
      nim: user?.nim || "",
      kelompok: user?.kelompok || "",
    });
    setIsEditing(true);
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      setError("Nama tidak boleh kosong");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await updateProfile(editForm);
      
      if (result.success) {
        // Update user in context and localStorage
        const updatedUser = { ...user, ...result.data };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
      } else {
        setError(result.message || "Gagal menyimpan profil");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Target,
      title: "Simple & Focused",
      desc: "Interface yang mudah dan fokus pada tracking workout",
    },
    {
      icon: Zap,
      title: "Fast & Responsive",
      desc: "Performa cepat dengan teknologi modern",
    },
    {
      icon: Users,
      title: "User Friendly",
      desc: "Dirancang untuk semua level fitness",
    },
  ];

  if (refreshing) {
    return (
      <div className="p-6 pt-20 md:pt-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20 md:pt-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">About</h1>
        <p className="text-gray-600">Profil & Tentang Aplikasi</p>
      </div>

      {/* About App */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Workout Tracker</h2>
        <p className="text-blue-50 leading-relaxed">
          Workout Tracker adalah aplikasi latihan fisik berbasis PWA yang
          dirancang untuk membantu kamu mencatat dan memantau progres latihan
          harian dengan mudah. Aplikasi ini dapat digunakan secara offline dan
          menyimpan data secara lokal untuk kemudahan akses kapan saja.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg w-fit mb-4">
                <Icon size={24} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Profile Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Profil</h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 size={18} />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                <X size={18} />
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Simpan
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Nama Lengkap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
              <input
                type="text"
                value={editForm.nim}
                onChange={(e) => setEditForm({ ...editForm, nim: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Nomor Induk Mahasiswa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelompok</label>
              <input
                type="text"
                value={editForm.kelompok}
                onChange={(e) => setEditForm({ ...editForm, kelompok: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Nomor Kelompok"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-700 w-24">Nama</span>
              <span className="text-gray-800">{profile.name}</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-700 w-24">NIM</span>
              <span className="text-gray-800">{profile.nim}</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-700 w-24">Kelompok</span>
              <span className="text-gray-800">{profile.kelompok}</span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} Workout Tracker • Built with React + Vite
        </p>
      </div>
    </div>
  );
}
