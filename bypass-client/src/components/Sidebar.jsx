import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside
      className="
        fixed bottom-0 left-0 w-full bg-white border-t shadow-md
        flex flex-row justify-around py-4 border-gray-500

        md:static md:w-64 md:h-auto md:border-t-0 md:border-r
        md:flex-col md:justify-start md:p-6 md:gap-6
      "
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold"
            : "text-gray-600 hover:text-blue-600"
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold"
            : "text-gray-600 hover:text-blue-600"
        }
      >
        Profile
      </NavLink>

      <NavLink
        to="/chat"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold"
            : "text-gray-600 hover:text-blue-600"
        }
      >
        Chat
      </NavLink>
    </aside>
  );
}

export default Sidebar;