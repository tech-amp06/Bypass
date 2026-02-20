import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
        <h1 className="text-xl font-bold text-blue-600">Bypass</h1>
      </div>

      <nav className="flex gap-8 text-gray-600 font-medium">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/profile" className="hover:text-blue-600">Profile</Link>
        <Link to="/chat" className="hover:text-blue-600">Chat</Link>
        <a href="#" className="hover:text-blue-600">About Us</a>
      </nav>
    </header>
  );
}

export default Header;