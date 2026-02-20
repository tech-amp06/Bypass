import React from 'react'

function Header() {
  return (
    <div className="header bg-blue-500 p-4 text-white flex justify-between">
      <div className="logo">
        <p>Bypass</p>
      </div>

      <div className="profile">
        <p>Profile</p>
      </div>
    </div>
  )
}

export default Header