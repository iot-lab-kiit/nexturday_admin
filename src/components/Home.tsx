import { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdGroups,
  MdEventAvailable,
} from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { GoArrowLeft } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import { Separator } from "./ui/separator";
// import SocietiesTable from "../components/SocietiesTable";
// import EventsTable from "../components/EventsTable";
import { SocietyCard } from "./SocietyCard";
import { EventCarousel } from "./EventCarousel";

function Home() {
  const [selectedTab, setSelectedTab] = useState<
    "societies" | "events" | "home"
  >("home");
  
  return (
    <div className="w-full flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-1/5 h-screen bg-blue-800 text-white flex flex-col justify-between">
        <div className="w-full h-full">
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
              className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:bg-blue-400 cursor-pointer"
            >
              <MdGroups />
              <p>Societies</p>
            </div>
            <div
              onClick={() => setSelectedTab("events")}
              className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:bg-blue-400 cursor-pointer"
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
        <div className="flex flex-row justify-start items-center gap-2 my-4 ml-4">
          <GoArrowLeft className="text-xl text-blue-400" />
          <p>Back to portal</p>
        </div>
        <Separator />
        <div className="my-4 flex flex-col gap-3 justify-center items-start ml-4">
          <p>My Profile</p>
          <p>Permission</p>
          <p>CH Management</p>
        </div>
        <Separator />
        <div className="flex flex-row gap-3 justify-start items-center my-4 ml-4 text-gray-500">
          <RiShutDownLine />
          <p>Logout</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-4/5 h-screen p-4 bg-gray-50 overflow-auto">
        {selectedTab === "home" && (
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-3xl font-bold text-gray-700">Welcome Admin</h1>
            <p className="text-gray-500">Select a section from the sidebar.</p>
          </div>
        )}
        {selectedTab === "societies" && <SocietyCard />}
        {/* {selectedTab === "events" && <EventsTable />} */}
        {selectedTab === "events" && <EventCarousel />}
      </div>
    </div>
  );
}

export default Home;
