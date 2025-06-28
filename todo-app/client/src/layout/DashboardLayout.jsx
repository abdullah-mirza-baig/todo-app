// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // for desktop collapse

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
      />

      <div className="flex flex-col flex-1">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          toggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />

        <main className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
