import {
  MdKeyboardArrowDown,
  MdGroups,
  MdEventAvailable,
} from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { FiAlignJustify } from "react-icons/fi";

function App() {
  return (
    <>
      <div className="w-full h-full flex">
        <div className="w-1/5 h-screen bg-blue-800 text-white ">
          <div className="border-b-[1px] h-[10vh] p-2 mx-2">
            <div className="flex flex-row items-center justify-between ">
              <div className="flex flex-row items-center">
                Admin
                <MdKeyboardArrowDown className="mt-1" />
              </div>
              <div>
                <IoIosSettings />
              </div>
            </div>
            <p className="text-xs font-thin text-gray-400 ">
              admin: admin@email.com
            </p>
          </div>
          <div className="w-full h-[15vh] p-2">
            <div className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:bg-blue-400">
              <MdGroups />
              <p>Societies</p>
            </div>
            <div className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:bg-blue-400">
              <MdEventAvailable />
              <p>Events</p>
            </div>
            <div className="flex flex-row justify-center gap-2 items-center py-2 px-2 rounded-lg hover:bg-blue-400">
              <FiAlignJustify />
              <p>Others</p>
            </div>
          </div>
        </div>
        <div className="w-4/5 h-full border border-green-500 m-2 p-2">
          Admin Panel
        </div>
      </div>
    </>
  );
}

export default App;
