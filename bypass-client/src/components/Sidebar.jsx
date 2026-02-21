import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const menuItems = [
    { name: "Home", path: "/home", icon: "🏠" },
    { name: "Profile", path: "/profile", icon: "👤" },
    { name: "Chat", path: "/chat", icon: "💬" },
  ];

  return (
    <div className="h-full p-4 space-y-2 bg-white">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            location.pathname === item.path ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-slate-50"
          }`}
        >
          <span>{item.icon}</span>
          <span className="text-sm font-medium">{item.name}</span>
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;