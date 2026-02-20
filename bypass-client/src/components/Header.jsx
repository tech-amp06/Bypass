import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      {/* Header */}
      <header className="bg-white shadow px-8 py-4 flex justify-between items-center">        
          <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
          <h1 className="text-xl font-bold text-blue-600">Bypass</h1>
        </div>

        <nav className="flex items-center gap-8 text-gray-600 font-medium">
          {/* Desktop menu */}
          <div className="hidden md:flex gap-8">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/profile" className="hover:text-blue-600">Profile</Link>
          <Link to="/chat" className="hover:text-blue-600">Chat</Link>
         </div>
        {/* About Us - always visible */}
        <a href="#" className="hover:text-blue-600 text-sm md:text-base">
          About Us
          </a>
        </nav>
      </header>

      {/* Emergency Button */}
      <button
        onClick={() => alert("Emergency Activated!")}
        className="
          fixed 
          bottom-20 md:bottom-6 
          right-4 md:right-6 
          bg-red-600 hover:bg-red-700 
          text-white 
          w-14 h-14 md:w-16 md:h-16 
          rounded-full 
          shadow-2xl 
          flex items-center justify-center 
          text-xl md:text-2xl 
          z-50 
          transition-transform duration-300 
          active:scale-90
        "
      >
        🚨
      </button>
    </>
  );
}

export default Header;