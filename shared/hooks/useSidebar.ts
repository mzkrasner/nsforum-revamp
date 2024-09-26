import { useQuery, useQueryClient } from "@tanstack/react-query";

const useSidebar = () => {
  const queryClient = useQueryClient();

  const { data: isSidebarOpen } = useQuery({
    queryKey: ["sidebar-state"],
    queryFn: () => false,
  });

  const setIsSidebarOpen = (isSidebarOpen: boolean) => {
    queryClient.setQueryData(["sidebar-state"], isSidebarOpen);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return { isSidebarOpen, setIsSidebarOpen, toggleSidebar };
};

export default useSidebar;
