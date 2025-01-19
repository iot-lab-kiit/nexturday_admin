import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import EventPage from "../Events/EventPage";
import { getUserEmail } from "@/api/email";
import { checkUser } from "@/api/checkUser";
import Sidebar from "../Global/Sidebar";

function Home() {
  const [selectedTab, setSelectedTab] = useState<
    "societies" | "events" | "home" | "AddEvent"
  >("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await getUserEmail();
        setUserName(response.data.data.name);
        setUserEmail(response.data.data.email);
      } catch (error) {
        console.error("Error fetching user email:", error);
        setUserEmail(null);
      }
    };

    fetchUserEmail();
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row relative py-4 pl-4 h-screen">
      {/* Sidebar Component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isLoggedin={isLoggedin}
        setIsLoggedin={setIsLoggedin}
        userName={userName}
        userEmail={userEmail}
        setSelectedTab={setSelectedTab}
        navigate={navigate}
      />

      <div className="md:hidden absolute top-4 left-4 h-full">
        <Menu
          className="text-blue-800 text-2xl cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-4/5 p-4 bg-gray-50 overflow-auto">
        {selectedTab === "home" && (
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-3xl font-bold text-gray-700">Welcome Admin</h1>
            <p className="text-gray-500">Select a section from the sidebar.</p>
          </div>
        )}
        {selectedTab === "events" && <EventPage />}
      </div>
    </div>
  );
}

export default Home;
