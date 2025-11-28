import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, Clock, TrendingUp, Calendar, ChevronRight, Flame } from "lucide-react";
import { getStats, getWorkouts } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalWorkout: 0,
    totalDuration: 0,
    avgDuration: 0,
    thisWeek: 0,
    totalCalories: 0
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsResult, workoutsResult] = await Promise.all([
        getStats(),
        getWorkouts()
      ]);
      
      setStats(statsResult.data);
      setRecentLogs((workoutsResult.data || []).slice(-5).reverse());
      setIsOffline(statsResult.isOffline || workoutsResult.isOffline || false);
    } catch {
      // Use empty data on error
      setStats({
        totalWorkout: 0,
        totalDuration: 0,
        avgDuration: 0,
        thisWeek: 0,
        totalCalories: 0
      });
      setRecentLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: Activity,
      label: "Total Latihan",
      value: `${stats.totalWorkout} sesi`,
      color: "bg-blue-500",
    },
    {
      icon: Clock,
      label: "Total Durasi",
      value: `${stats.totalDuration} menit`,
      color: "bg-green-500",
    },
    {
      icon: TrendingUp,
      label: "Rata-rata",
      value: `${stats.avgDuration} menit`,
      color: "bg-orange-500",
    },
    {
      icon: Calendar,
      label: "Minggu Ini",
      value: `${stats.thisWeek} sesi`,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="p-6 pt-20 md:pt-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Ringkasan aktivitas latihanmu</p>
        </div>
        {isOffline && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
            Mode Offline
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <Icon size={24} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <h2 className="text-2xl font-bold text-gray-800">{stat.value}</h2>
              </div>
            );
          })}
        </div>
      )}

      {/* Total Calories Card */}
      {stats.totalCalories > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-xl text-white">
          <div className="flex items-center gap-3">
            <Flame size={32} />
            <div>
              <p className="text-orange-100">Total Kalori Terbakar</p>
              <h2 className="text-3xl font-bold">{stats.totalCalories} kcal</h2>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Latihan Terbaru</h2>
          <Link to="/log" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Lihat Semua →
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : recentLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Belum ada latihan. Mulai catat latihanmu!</p>
            <Link 
              to="/log"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambah Latihan
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <Link
                key={log.id}
                to={`/workout/${log.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all cursor-pointer group"
              >
                <div>
                  <p className="font-semibold text-gray-800 group-hover:text-blue-600">{log.exercise}</p>
                  <p className="text-sm text-gray-500">{log.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{log.duration} menit</p>
                    {log.calories > 0 && (
                      <p className="text-sm text-orange-500">{log.calories} kcal</p>
                    )}
                  </div>
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
