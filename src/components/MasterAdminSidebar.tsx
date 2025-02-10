import { MdEventAvailable } from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { UserRoundPen, X } from "lucide-react";
import { useNavigate } from "react-router";
// import { useNavigate } from "react-router-dom";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedin: boolean;
  setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string | null;
  userEmail: string | null;
}

const MarsterAdminSidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isLoggedin,
  setIsLoggedin,
  userName,
  userEmail,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`z-20 font-montserrat fixed md:static rounded-xl w-4/5 h-full md:w-1/5 bg-blue-800 text-white flex flex-col justify-between transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full -left-3"
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
          <div className="flex flex-col gap-2 pt-5">
            <p className="text-3xl text-center font-bold px-2  rounded-md text-white">
              {userName || "Master Admin"}
            </p>
            <p className="text-center text-sm px-2 text-white">
              {userEmail || "master-admin@nexterday.com"}
            </p>
          </div>
          {/* Header */}
          {/* <div
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
        </div> */}

          {/* Business Card Section */}

          {/* User Email */}

          <div className="w-full mb-2 text-xl font-semibold flex flex-col gap-3 pt-10">
            {/* <div
              onClick={() => setSelectedTab("societies")}
              className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:text-gray-400 cursor-pointer"
            >
              <MdGroups />
              <p>My Society</p>
            </div> */}
            <button
              className="text-center bg-blue-600 p-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => {
                navigate("/master-admin/pending-events");
              }}
            >
              Pending Events
            </button>
            <button
              className="text-center bg-blue-600 p-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => {
                navigate("/master-admin/checked-events");
              }}
            >
              Checked Events
            </button>
          </div>
        </div>

        {/* <Separator /> */}
      </div>
      {/* <Separator /> */}

      {/* <Separator /> */}

      <div className="p-4">
        {isLoggedin ? (
          <div
            onClick={() => {
              sessionStorage.removeItem("societyToken");
              setIsLoggedin(false);
              navigate("/");
            }}
            className="flex flex-row justify-center items-center gap-3 text-xl bg-blue-600 rounded-xl "
          >
            <RiShutDownLine />
            <p>Logout</p>
          </div>
        ) : (
          <div
            onClick={() => navigate("/")}
            className="text-center flex justify-center items-center gap-2 text-xl font-bold bg-blue-600 p-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all "
          >
            <RiShutDownLine />
            <p>Login</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarsterAdminSidebar;
