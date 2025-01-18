import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdEventAvailable } from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { Menu, UserRoundPen, X } from "lucide-react";
import EventPage from "../Events/EventPage";
import { Separator } from "../ui/separator";
import { getUserEmail } from "@/api/email";
import { checkUser } from "@/api/checkUser";
import { url } from "inspector";

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
        if (response) {
          setIsLoggedin(true);
        } else {
          setIsLoggedin(false);
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
        setIsLoggedin(false);
      }
    };

    checkUserLoggedIn();
  });

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
      {/* Sidebar */}
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
              className="relative m-auto p-4 w-[full] h-[15vh] bg-cover bg-center bg-no-repeat rounded-lg shadow-inner flex items-start"
              style={{
                backgroundImage:
                  "url('https://i0.wp.com/backgroundabstract.com/wp-content/uploads/edd/2022/01/vecteezy_abstract-blue-and-orange-wave-business-background_-e1656072952998.jpg?resize=1000%2C750&ssl=1')",
              }}
            >
              <span className="text-slate-900 text-xl font-bold p-2  rounded-md ">
                {userName || "Society"}
              </span>
            </div>

            <div className="flex flex-row items-center justify-center font-bold text-3xl">
              Admin Panel
            </div>

            {/* Business Card Section */}

            {/* User Email */}
            <p className="text-slate-200 text-center text-sm">
              {userEmail || ""}
            </p>
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
          <p onClick={() => navigate("/profile")} className="py-1 mx-auto">
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
            className="flex text-xl font-semibold flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer mx-auto"
          >
            <RiShutDownLine />
            <p>Login</p>
          </div>
        )}
      </div>

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
        {/* {selectedTab === "societies" && <SocietyPage />} */}
        {selectedTab === "events" && <EventPage />}
      </div>
    </div>
  );
}

export default Home;
