import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import MasterAdminSidebar from "./MasterAdminSidebar";
import { Menu } from "lucide-react";
import { checkUser } from "@/api/checkUser";

const MasterAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const response = await checkUser();
        setIsLoggedin(response ? true : false);
      } catch (error) {
        console.error("Error fetching user email:", error);
        setIsLoggedin(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  return (
    <div className="flex h-screen w-full p-4 relative">
      <MasterAdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isLoggedin={isLoggedin}
        setIsLoggedin={setIsLoggedin}
      />
      <div className="md:hidden absolute top-4 left-4 h-full">
        <Menu
          className="text-blue-800 text-2xl cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />
      </div>
      <div className="w-full overflow-y-auto p-4 pt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default MasterAdminLayout;
