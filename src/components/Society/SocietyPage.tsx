import axios from "axios";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import LoadingSpinner from "../Global/LoadingSpinner";

const SocietyPage = () => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("");

  const token = sessionStorage.getItem("societyToken");
  axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchSocietyDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/society`
        );
        toast.success("Society details fetched successfully");
        setName(response.data.data.name);
        setEmail(response.data.data.email);
        setPhone(response.data.data.phoneNumber);
        setUrl(response.data.data.websiteUrl);
      } catch (error) {
        toast.error("Error fetching society details");
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocietyDetails();
  }, []);

  return (
    <div className="w-full h-full max-w-screen p-4">
      <div className="mb-4 text-2xl font-bold text-center">My Society</div>
      <div className="text-lg">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {url && (
              <iframe
                src={url}
                className="w-3/5 mx-auto p-2 mb-4 aspect-video border rounded-md"
              ></iframe>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="flex flex-col gap-2 border rounded-md border-blue-500 bg-blue-100 p-4">
                <div className="flex flex-row gap-2 items-center">
                  <FaUser />
                  <p className="text-lg font-semibold">Name</p>
                </div>
                <div className="text-sm">{name}</div>
              </div>

              <div className="flex flex-col gap-2 border rounded-md border-blue-500 bg-blue-100 p-4">
                <div className="flex flex-row gap-2 items-center">
                  <MdOutlineEmail />
                  <p className="text-lg font-semibold">Email</p>
                </div>
                <p className="text-sm">{email}</p>
              </div>
              <div className="flex flex-col gap-2 border rounded-md border-blue-500 bg-blue-100 p-4">
                <div className="flex flex-row gap-2 items-center">
                  <FaPhoneAlt />
                  <p className="text-lg font-semibold">Phone</p>
                </div>
                <p className="text-sm">{phone}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocietyPage;
