import React from "react";
import { Outlet } from "react-router-dom";
import { LayoutProvider } from "../../contexts/LayoutContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <LayoutProvider>
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex flex-col flex-1">
          <Header />

          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
