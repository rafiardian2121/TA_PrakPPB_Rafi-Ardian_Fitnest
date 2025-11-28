import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, ChevronRight } from "lucide-react";
import { getSchedules } from "../services/api";

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const result = await getSchedules();
      setSchedule(result.data || []);
      setIsOffline(result.isOffline || false);
    } catch {
      // Fallback to default schedule
      setSchedule([
        { day: "Senin", workout: "Chest + Tricep", color: "bg-red-500" },
        { day: "Selasa", workout: "Back + Bicep", color: "bg-orange-500" },
        { day: "Rabu", workout: "Leg Day", color: "bg-yellow-500" },
        { day: "Kamis", workout: "Shoulder", color: "bg-green-500" },
        { day: "Jumat", workout: "Full Body", color: "bg-blue-500" },
        { day: "Sabtu", workout: "Cardio", color: "bg-purple-500" },
        { day: "Minggu", workout: "Rest", color: "bg-gray-500" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long" });

  return (
    <div className="p-6 pt-20 md:pt-6 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Jadwal Workout
          </h1>
          <p className="text-gray-600">
            Rencana mingguan untuk mencapai target fitness
          </p>
        </div>
        {isOffline && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
            Mode Offline
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedule.map((item) => {
            const isToday = item.day === today;
            return (
              <Link
                key={item.day}
                to={`/schedule/${item.day.toLowerCase()}`}
                className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all hover:shadow-md group cursor-pointer ${
                  isToday
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-100 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg text-gray-800 group-hover:text-blue-600">{item.day}</p>
                    {isToday && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mt-1">
                        Hari Ini
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`${item.color} p-3 rounded-lg text-white`}>
                      <Dumbbell size={20} />
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
                <p className="text-gray-700 font-medium">{item.workout}</p>
                <p className="text-sm text-gray-500 mt-2">Klik untuk lihat detail →</p>
              </Link>
            );
          })}
        </div>
      )}

      <div className="bg-linear-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Tips</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Sesuaikan jadwal dengan kondisi tubuhmu</li>
          <li>• Istirahat yang cukup sama pentingnya dengan latihan</li>
          <li>• Jangan lupa pemanasan sebelum workout</li>
        </ul>
      </div>
    </div>
  );
}
