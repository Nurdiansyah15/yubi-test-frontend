import React, { useEffect } from "react";
import { useLayout } from "../contexts/LayoutContext";

export default function Home() {
  const { setTitle, setBreadcrumb } = useLayout();
  useEffect(() => {
    setTitle("Home");
    setBreadcrumb([{ label: "Home", path: "/" }]);
  }, []);
  return <div>Home</div>;
}
