import { FaSignOutAlt } from "react-icons/fa";
import { RiMenuLine } from "react-icons/ri";
import React from "react";
import { useLayout } from "../../contexts/LayoutContext";
import { Link } from "react-router-dom";
import { BiArrowToRight } from "react-icons/bi";

export default function Header() {
  const { sidebarOpen, setSidebarOpen, title, breadcrumb } = useLayout();
  return (
    <header className="flex justify-between items-center bg-white shadow px-4 py-1">
      <div className="flex items-center gap-4">
        {/* Toggle button */}
        <button
          className="text-black cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <RiMenuLine size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-blue-950">{title}</h1>
          <div className="text-sm text-gray-500 space-x-1">
            {breadcrumb.map((item, index) => (
              <span key={index}>
                {item.path && index !== breadcrumb.length - 1 ? (
                  <>
                    <Link
                      to={item.path}
                      className="text-neutral-600 hover:underline"
                    >
                      {item.label}
                    </Link>
                    <span className="mx-1">{">"}</span>
                  </>
                ) : (
                  <span className="text-gray-400">{item.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button className="text-red-500 hover:text-red-700">
        <FaSignOutAlt size={20} />
      </button>
    </header>
  );
}
