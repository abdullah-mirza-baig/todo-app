// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AiOutlineDashboard,
  AiOutlineUnorderedList,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";

const Sidebar = ({ isOpen, setIsOpen, isCollapsed }) => {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <AiOutlineDashboard size={20} /> },
    { name: "Tasks", path: "/dashboard/tasks", icon: <AiOutlineUnorderedList size={20} /> },
    { name: "Shared Tasks", path: "/dashboard/shared", icon: <AiOutlineShareAlt size={20} /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.66)] z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen  bg-[#F3F4F6] shadow-md z-50 transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "w-16" : "w-64"}
      `}
      >
        <div className={`flex items-center justify-between px-4 py-3 ${isCollapsed ? "py-[14px] sm:py-[26px] " : ''} border-b`}>
          {!isCollapsed && <h2 className="text-xl font-bold text-[#9980FA] ">ToDo App</h2>}
          <IoMdClose
            size={24}
            onClick={() => setIsOpen(false)}
            className="md:hidden cursor-pointer text-gray-600"
          />
        </div>

        <nav className="p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center ${
    isCollapsed ? "justify-center" : ""
  } gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-[#9980FA] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
               <span className={`${isCollapsed ? "mx-auto  text-xl" : "text-base"}`}>{link.icon}</span>
              {!isCollapsed && link.name}
            </Link>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div className="absolute bottom-4 w-full px-4">
          <button
            className="flex items-center gap-2 text-lg text-gray-700 hover:text-red-500 w-full"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            <span className={'text-xl'}><FiLogOut /></span>
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
