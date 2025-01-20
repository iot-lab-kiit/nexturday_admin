import { MdEventAvailable } from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { UserRoundPen, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedin: boolean;
  setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string | null;
  userEmail: string | null;
  setSelectedTab: React.Dispatch<
    React.SetStateAction<"societies" | "events" | "home" | "AddEvent">
  >;
  navigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isLoggedin,
  setIsLoggedin,
  userName,
  userEmail,
  setSelectedTab,
  navigate,
}) => (
  <div
    className={`z-20 fixed md:static rounded-xl w-4/5 h-full md:w-1/5 bg-blue-800 text-white flex flex-col justify-between transition-transform duration-300 ${
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

      <div className="h-[10vh] p-4 mx-2 space-y-4">
        {/* Header */}
        <div
          className="relative m-auto p-4 w-[full] h-[15vh] bg-cover bg-center bg-no-repeat rounded-lg shadow-inner flex items-start flex-col"
          style={{
            backgroundImage:
              "url('https://i0.wp.com/backgroundabstract.com/wp-content/uploads/edd/2022/01/vecteezy_abstract-blue-and-orange-wave-business-background_-e1656072952998.jpg?resize=1000%2C750&ssl=1')",
          }}
        >
          <p className="text-slate-900 text-xl font-bold px-2  rounded-md ">
            {userName || "Society"}
          </p>
          <p className="text-slate-900 text-center text-sm px-2">
            {userEmail || ""}
          </p>
        </div>

        {/* Business Card Section */}

        {/* User Email */}

        <div className="w-full mb-2 text-xl font-semibold">
          {/* <div
              onClick={() => setSelectedTab("societies")}
              className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer"
            >
              <MdGroups />
              <p>My Society</p>
            </div> */}
          <div
            onClick={() => setSelectedTab("events")}
            className="flex  flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer"
          >
            <MdEventAvailable />
            <p>Events</p>
          </div>
          <div
            onClick={() => navigate("/add-event")}
            className="flex flex-row text-sm font-semibold justify-center gap-2 items-center py-2 px-6 w-fit m-auto mt-4 hover:text-gray-400 cursor-pointer border-2 rounded-xl"
          >
            <FaPlus className="" />
            <p>Add Events</p>
          </div>
        </div>
      </div>

      {/* <Separator /> */}
    </div>
    {/* <Separator /> */}
    <div className="flex flex-row font-semibold justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer mx-auto">
      <UserRoundPen className="text-sm" />
      <p onClick={() => navigate("/update-profile")} className="py-1 mx-auto">
        Edit Profile
      </p>
    </div>
    {/* <Separator /> */}

    {isLoggedin ? (
      <div
        onClick={() => {
          sessionStorage.removeItem("societyToken");
          setIsLoggedin(false);
          navigate("/");
        }}
        className="flex  pb-7 font-semibold flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer mx-auto"
      >
        <RiShutDownLine />
        <p>Logout</p>
      </div>
    ) : (
      <div
        onClick={() => navigate("/")}
        className="flex  font-semibold flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer mx-auto"
      >
        <RiShutDownLine />
        <p>Login</p>
      </div>
    )}
  </div>
);

export default Sidebar;
