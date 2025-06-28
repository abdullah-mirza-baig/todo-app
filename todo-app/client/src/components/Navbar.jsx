
import React from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const Navbar = ({ toggleSidebar, toggleCollapse }) => {
  return (
    <header className="w-full bg-[#F3F4F6] shadow px-4 py-3 flex items-center justify-between ">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="text-gray-700 md:hidden">
          <HiOutlineMenuAlt3 size={24} />
        </button>

        <button onClick={toggleCollapse} className="hidden md:block text-gray-700">
          <HiOutlineMenuAlt3 size={24} />
        </button>

        <span className="font-bold text-lg text-[#9980FA]">Dashboard</span>
      </div>
    </header>
  );
};

export default Navbar;
