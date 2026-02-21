import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Profile from "./components/profile/Profile";
import Chat from "./components/Chat";
import Auth from "./components/Auth";

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/auth" || location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen relative">
      {!hideLayout && (
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
          <Header />
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        {!hideLayout && (
          <aside className="w-64 hidden md:block border-r border-slate-200 bg-white">
            <Sidebar />
          </aside>
        )}

        <main className={`flex-1 ${hideLayout ? "" : "p-4 md:p-8"} overflow-y-auto`}>
          <div className={`${hideLayout ? "" : "max-w-7xl mx-auto"}`}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </div>
        </main>
      </div>

      {!hideLayout && (
        <button
          onClick={() => alert("Emergency Protocol Activated! Contacting Medical Staff...")}
          className="fixed bottom-8 right-8 z-[9999] bg-red-600 hover:bg-red-500 text-white w-20 h-20 rounded-[2rem] shadow-[0_20px_50px_rgba(220,38,38,0.3)] flex items-center justify-center text-4xl transition-all hover:scale-110 active:scale-90 border-4 border-white"
        >
          🚨
        </button>
      )}
    </div>
  );
}

export default App;