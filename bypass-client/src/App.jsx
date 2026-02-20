import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Profile from "./components/profile/Profile";
import Chat from "./components/Chat";
import Auth from "./components/Auth";

function App() {
  const location = useLocation();

  // Hide layout for auth page
const hideLayout =
  location.pathname === "/auth" || location.pathname === "/";

  
  return (
    <div className="flex flex-col min-h-screen">

      {/* Header (hidden on auth page) */}
      {!hideLayout && (
        <div className="shadow-xl z-50">
          <Header />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar (hidden on auth page) */}
        {!hideLayout && <Sidebar />}

        <main
          className={`flex-1 ${
            hideLayout ? "" : "p-8"
          } overflow-y-auto bg-gray-50`}
        >
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;