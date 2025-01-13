import axios from "axios";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

const SocietyCard = () => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("");

  // const token = sessionStorage.getItem("token");

  const token = import.meta.env.VITE_SOCIETY_TOKEN;
  axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          "https://nexterday.iotkiit.in/api/society"
        );
        console.log("my society",response.data);
        setName(response.data.data.name);
        setEmail(response.data.data.email);
        setPhone(response.data.data.phoneNumber);
        setUrl(response.data.data.websiteUrl);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="m-4 p-4 text-2xl font-bold">My Society</div>
      <>
        <div className="m-4 p-4 text-lg">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {url && <iframe src={url} className="mx-auto p-4 mb-4" height={350} width={600} ></iframe>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  p-4">
                <div className="flex flex-col gap-2 border rounded-md border-blue-500 bg-blue-100 p-2">
                  <div className="flex flex-row gap-2 items-center">
                    <FaUser />
                    <p className="text-xl font-semibold">Name</p>
                  </div>
                  <div className="text-lg">{name} </div>
                </div>

                <div className="flex flex-col gap-2 border rounded-md border-blue-500 bg-blue-100 p-2">
                  <div className="flex flex-row gap-2 items-center">
                    <MdOutlineEmail />
                    <p className="text-xl font-semibold">Email</p>
                  </div>
                  <p className="text-lg">{email}</p>
                </div>
                <div className="flex flex-col gap-2 border rounded-md border-blue-500 bg-blue-100 p-2">
                  <div className="flex flex-row gap-2 items-center">
                    <FaPhoneAlt />
                    <p className="text-xl font-semibold">Phone</p>
                  </div>
                  <p className="text-lg">{phone}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    </div>
  );
};

export default SocietyCard;
