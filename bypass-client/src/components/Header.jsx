import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="px-8 py-4 flex justify-between items-center w-full bg-white">        
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
        <h1 className="text-xl font-bold text-blue-600">Bypass</h1>
      </div>
      <nav className="flex items-center gap-8 text-gray-600 font-medium">
        <div className="hidden md:flex gap-8">
          <Link to="/home" className="hover:text-blue-600">Home</Link>
          <Link to="/profile" className="hover:text-blue-600">Profile</Link>
          <Link to="/chat" className="hover:text-blue-600">Chat</Link>
        </div>
        <button className="text-sm font-bold text-slate-400">Support</button>
      </nav>
    </div>
  );
}

export default Header;