import { useState } from "react";

const useSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return { isSidebarOpen, setIsSidebarOpen, toggleSidebar };
};

export default useSidebar;
