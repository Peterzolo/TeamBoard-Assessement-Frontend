import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "./component/sidebar/Sidebar";
import { Header } from "./component/header/Header";
import { MainContent } from "./component/main/MainContent";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isSidebarOpen={sidebarOpen}
        onSidebarClose={handleSidebarClose}
      />
      <div className="flex-1 flex flex-col min-h-0 ml-0 lg:ml-64">
        <Header
          isSidebarOpen={sidebarOpen}
          onSidebarToggle={handleSidebarToggle}
        />
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </div>
  );
};

export default DashboardLayout;
