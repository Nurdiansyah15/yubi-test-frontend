import React from "react";
import { RiBillFill, RiHomeLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useLayout } from "../../contexts/LayoutContext";

export default function Sidebar() {
  const { sidebarOpen } = useLayout();

  return (
    <div
      className={`${
        sidebarOpen ? "w-48" : "w-12 items-center"
      } min-h-screen bg-neutral-700 flex flex-col transition-all p-1 duration-300`}
    >
      <Link
        to={"/"}
        className="p-3 flex text-md items-center gap-2 text-white bg-neutral-700 hover:bg-neutral-500"
      >
        <RiHomeLine size={18} />
        {sidebarOpen && <span>Home</span>}
      </Link>

      <Link
        to={"/sales"}
        className="p-3 flex text-md items-center gap-2 text-white bg-neutral-700 hover:bg-neutral-500"
      >
        <RiBillFill size={18} />
        {sidebarOpen && <span>Sales</span>}
      </Link>
    </div>
  );
}
