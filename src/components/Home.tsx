import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdKeyboardArrowDown,
  MdGroups,
  MdEventAvailable,
} from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { Separator } from "./ui/separator";
import { Menu, UserRoundPen, X } from "lucide-react";
import { SocietyCard } from "./SocietyCard";
import ReactCarousel from "./ReactCarousel";

function Home() {
  const [selectedTab, setSelectedTab] = useState<
    "societies" | "events" | "home"
  >("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedin, setisLoggedin] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col md:flex-row relative">
      {/* Sidebar */}
      <div
        className={`z-20 fixed md:static w-4/5 md:w-1/5 h-screen bg-blue-800 text-white flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="w-full h-full">
          <div className="flex justify-end md:hidden p-2">
            <X
              className="text-white text-2xl cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            />
          </div>

          <div className="h-[10vh] p-2 mx-2">
            <div className="flex md:flex-row items-center justify-between">
              <div className="flex flex-row items-center">
                Admin
                <MdKeyboardArrowDown className="mt-1" />
              </div>
              <div>
                <IoIosSettings />
              </div>
            </div>
            <p className="text-xs font-thin text-gray-400">
              admin: admin@email.com
            </p>
          </div>
          <Separator />
          <div className="w-full h-[15vh] p-2 mb-2">
            <div
              onClick={() => setSelectedTab("societies")}
              className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer"
            >
              <MdGroups />
              <p>Societies</p>
            </div>
            <div
              onClick={() => setSelectedTab("events")}
              className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer"
            >
              <MdEventAvailable />
              <p>Events</p>
            </div>
          </div>
          <Separator />
          <div className="text-sm border-[1px] rounded-full m-2 py-1 px-2 w-fit mx-auto flex flex-row gap-2 items-center justify-center mt-4 text-blue-400">
            <FaPlus className="text-xl" />
            <p>Add Category</p>
          </div>
        </div>
        <Separator />
        <div className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer mx-auto">
        <UserRoundPen className="text-sm"/>
          <p
            onClick={() => navigate("/profile")}
            className="py-1 mx-auto"
          >
            My Profile
          </p>
        </div>
        <Separator />
        {isLoggedin ? (
          <div className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer mx-auto">
            <RiShutDownLine />
            <p>Logout</p>
          </div>
        ) : (
          <div
            onClick={() => navigate("/login")}
            className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer mx-auto"
          >
            <RiShutDownLine />
            <p>Login</p>
          </div>
        )}
      </div>

      <div className="md:hidden absolute top-4 left-4">
        <Menu
          className="text-blue-800 text-2xl cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-4/5 h-screen p-4 bg-gray-50 overflow-auto">
        {selectedTab === "home" && (
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-3xl font-bold text-gray-700">Welcome Admin</h1>
            <p className="text-gray-500">Select a section from the sidebar.</p>
          </div>
        )}
        {selectedTab === "societies" && <SocietyCard />}
        {selectedTab === "events" && <ReactCarousel />}
      </div>
    </div>
  );
}

export default Home;
