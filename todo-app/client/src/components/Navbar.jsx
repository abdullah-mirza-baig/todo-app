// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
//   const user = (localStorage.getItem("user"));
    // console.log(user)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-indigo-600 text-white px-4 py-3 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-semibold">ToDo App</h1>
      <button
        onClick={handleLogout}
        className="bg-white text-indigo-600 font-medium px-4 py-1 rounded hover:bg-gray-100 transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
