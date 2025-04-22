import React, { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [title, setTitle] = useState("Dashboard");
  const [breadcrumb, setBreadcrumb] = useState([
    { label: "Dashboard", path: "/" },
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        title,
        setTitle,
        breadcrumb,
        setBreadcrumb,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
