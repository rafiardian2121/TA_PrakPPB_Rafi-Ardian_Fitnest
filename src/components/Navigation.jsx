import { BarChart3, Calendar, Info, Activity, LogOut, User, Dumbbell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navigation({ user, onLogout }) {
  const location = useLocation();
  const currentPage = location.pathname;
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    { id: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "/log", icon: Activity, label: "Log" },
    { id: "/schedule", icon: Calendar, label: "Jadwal" },
    { id: "/about", icon: Info, label: "About" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:top-0 md:bottom-auto z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-between items-center py-3">
          {/* Desktop: Logo */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="text-white" size={18} />
            </div>
            <span className="font-bold text-gray-800">Workout Tracker</span>
          </div>

          {/* Nav Items */}
          <div className="flex justify-around md:justify-center md:space-x-4 flex-1 md:flex-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || currentPage.startsWith(item.id + '/');

              return (
                <Link
                  key={item.id}
                  to={item.id}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={22} />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop: User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={18} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                    {user.name}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: User info bar (top) */}
      {user && isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-600" size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </nav>
  );
}
