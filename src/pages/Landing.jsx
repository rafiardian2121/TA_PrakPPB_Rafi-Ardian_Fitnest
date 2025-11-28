import { useState } from "react";
import {
  Dumbbell,
  Home,
  Calendar,
  BookOpen,
  Users,
  Plus,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse -bottom-48 -right-48 animation-delay-2000"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center px-6 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  PWA • Offline First • Modern
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  Fitness Journey
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                Catat setiap latihan, pantau progres real-time, dan capai target
                fitness dengan aplikasi tracking paling intuitif. Semua data
                tersimpan offline.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 mb-16">
                  <Link to="/dashboard">Mulai Sekarang</Link>
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">100%</div>
                  <div className="text-sm text-gray-400">Offline Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">Fast</div>
                  <div className="text-sm text-gray-400">Performance</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">Free</div>
                  <div className="text-sm text-gray-400">Forever</div>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end animate-fade-in-right hidden lg:block">
              <div className="relative">
                <img
                  src="/hero.jpg"
                  alt="Workout Illustration"
                  className="w-[480px] h-auto drop-shadow-2xl rounded-3xl border border-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-24 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Fitur Powerful untuk Hasil Maksimal
            </h2>
            <p className="text-gray-400 text-lg">
              Semua yang kamu butuhkan untuk tracking workout yang efektif
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Dumbbell size={32} />,
                title: "Easy Tracking",
                desc: "Catat workout dalam hitungan detik dengan interface yang super simpel",
              },
              {
                icon: <TrendingUp size={32} />,
                title: "Progress Monitor",
                desc: "Lihat perkembangan dengan statistik dan visualisasi yang jelas",
              },
              {
                icon: <Clock size={32} />,
                title: "Offline First",
                desc: "Semua data tersimpan lokal, akses kapan saja tanpa internet",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-2xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-4">
              Siap Memulai Perjalanan Fitnessmu?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan atlet yang sudah tracking workout
              mereka dengan aplikasi ini
            </p>
            <button
              onClick={() => window.setPage("dashboard")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-10 py-4 rounded-xl font-bold shadow-2xl shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              Start Free Today
              <TrendingUp size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} Workout Tracker. Built with ❤️ for
            fitness enthusiasts.
          </p>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 71%;
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite 1s;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 2s ease-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

function Dashboard() {
  const logs = JSON.parse(localStorage.getItem("workout_logs") || "[]");
  const totalWorkout = logs.length;
  const totalDuration = logs.reduce((a, b) => a + Number(b.duration), 0);

  // Get recent workouts (last 5)
  const recentWorkouts = logs.slice(-5).reverse();

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
          <Home className="text-white" size={28} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-blue-100">Total Latihan</p>
            <Award className="text-blue-200" size={32} />
          </div>
          <h2 className="text-5xl font-bold">{totalWorkout}</h2>
          <p className="text-blue-100 mt-2">sesi latihan</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-green-100">Total Durasi</p>
            <Clock className="text-green-200" size={32} />
          </div>
          <h2 className="text-5xl font-bold">{totalDuration}</h2>
          <p className="text-green-100 mt-2">menit latihan</p>
        </div>
      </div>

      {recentWorkouts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            Aktivitas Terbaru
          </h2>
          <div className="space-y-3">
            {recentWorkouts.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg text-gray-800">
                      {log.exercise}
                    </p>
                    <p className="text-gray-600">{log.duration} menit</p>
                  </div>
                  <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {log.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LogWorkout() {
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const logs = JSON.parse(localStorage.getItem("workout_logs") || "[]");

  const addWorkout = () => {
    if (!exercise || !duration) return alert("Lengkapi data latihan!");

    const newEntry = {
      id: Date.now(),
      exercise,
      duration: Number(duration),
      date,
    };

    localStorage.setItem("workout_logs", JSON.stringify([...logs, newEntry]));
    setExercise("");
    setDuration("");
    alert("Latihan berhasil ditambahkan!");
  };

  const deleteWorkout = (id) => {
    const filtered = logs.filter((log) => log.id !== id);
    localStorage.setItem("workout_logs", JSON.stringify(filtered));
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl">
          <Plus className="text-white" size={28} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Log Latihan
        </h1>
      </div>

      <div className="space-y-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl shadow-lg">
        <input
          type="text"
          placeholder="Nama latihan (Push Up, Squat...)"
          className="w-full border-2 border-gray-300 p-4 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
        />

        <input
          type="number"
          placeholder="Durasi (menit)"
          className="w-full border-2 border-gray-300 p-4 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <input
          type="date"
          className="w-full border-2 border-gray-300 p-4 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={addWorkout}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Tambah Latihan
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-2xl flex items-center gap-2">
          <BookOpen className="text-orange-600" />
          Riwayat Latihan
        </h2>
        {logs.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <Dumbbell size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">Belum ada latihan tercatat</p>
          </div>
        )}

        <div className="grid gap-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-5 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-orange-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-xl text-gray-800">
                    {log.exercise}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock size={16} />
                      {log.duration} menit
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {log.date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteWorkout(log.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Schedule() {
  const schedule = [
    {
      day: "Senin",
      workout: "Chest + Tricep",
      color: "from-red-500 to-pink-500",
    },
    {
      day: "Selasa",
      workout: "Back + Bicep",
      color: "from-orange-500 to-yellow-500",
    },
    { day: "Rabu", workout: "Leg Day", color: "from-green-500 to-emerald-500" },
    { day: "Kamis", workout: "Shoulder", color: "from-blue-500 to-cyan-500" },
    {
      day: "Jumat",
      workout: "Full Body",
      color: "from-purple-500 to-pink-500",
    },
    { day: "Sabtu", workout: "Cardio", color: "from-indigo-500 to-purple-500" },
    { day: "Minggu", workout: "Rest", color: "from-gray-400 to-gray-500" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
          <Calendar className="text-white" size={28} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Jadwal Workout
        </h1>
      </div>

      <div className="grid gap-4">
        {schedule.map((item) => (
          <div
            key={item.day}
            className={`p-6 bg-gradient-to-r ${item.color} rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all`}
          >
            <p className="font-bold text-2xl mb-2">{item.day}</p>
            <p className="text-lg opacity-90">{item.workout}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function About() {
  const team = ["Muhammad Tajut Zam Zami", "Anggota 2", "Anggota 3"];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
          <Users className="text-white" size={28} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          About
        </h1>
      </div>

      <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl shadow-lg">
        <p className="text-lg text-gray-700 leading-relaxed">
          Workout Tracker adalah aplikasi latihan fisik berbasis PWA yang bisa
          digunakan secara offline untuk mencatat progres latihan harian.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Users className="text-indigo-600" />
          Tim Pengembang
        </h2>
        <div className="grid gap-4">
          {team.map((t, i) => (
            <div
              key={i}
              className="p-5 bg-white border-2 border-indigo-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-400 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {t.charAt(0)}
                </div>
                <p className="font-semibold text-lg text-gray-800">{t}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");

  // Expose setPage to window for navigation
  window.setPage = setPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {page === "landing" ? (
        <Landing />
      ) : (
        <>
          {/* Navigation */}
          <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-2">
                  <Dumbbell className="text-blue-600" size={28} />
                  <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Workout Tracker
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage("dashboard")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      page === "dashboard"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Home size={18} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                  <button
                    onClick={() => setPage("log")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      page === "log"
                        ? "bg-orange-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Log</span>
                  </button>
                  <button
                    onClick={() => setPage("schedule")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      page === "schedule"
                        ? "bg-green-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Calendar size={18} />
                    <span className="hidden sm:inline">Jadwal</span>
                  </button>
                  <button
                    onClick={() => setPage("about")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      page === "about"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Users size={18} />
                    <span className="hidden sm:inline">About</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Page Content */}
          <main className="py-8">
            {page === "dashboard" && <Dashboard />}
            {page === "log" && <LogWorkout />}
            {page === "schedule" && <Schedule />}
            {page === "about" && <About />}
          </main>
        </>
      )}
    </div>
  );
}
