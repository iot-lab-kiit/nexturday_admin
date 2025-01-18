import { getSocietyProfile, updateSocietyProfile } from "@/api/societyApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { updateMetadata } from "@/utils/metadata";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  password: z.string(),
  websiteUrl: z.string().url({ message: "Enter valid url" }),
  phoneNumber: z
    .string()
    .regex(
      /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm,
      "Enter valid phone number"
    ),
});

type FormData = z.infer<typeof schema>;

const ProfilePage = () => {
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [societyDetails, setSocietyDetails] = useState<FormData>();
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    updateMetadata({
      title: "Society Profile",
      description: "Update and manage your society profile",
      keywords: "profile, society, settings, nexturday",
    });
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await getSocietyProfile();
      setSocietyDetails(response.data.data);
      setValue("name", response.data.data.name);
      setEmail(response.data.data.email);
      setValue("password", response.data.data.password);
      setValue("websiteUrl", response.data.data.websiteUrl);
      setValue("phoneNumber", response.data.data.phoneNumber);
    } catch (error) {
      console.error("Error fetching society profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: FormData, e: any) => {
    e.preventDefault();
    setClicked(true);
    try {
      const response = await updateSocietyProfile(data);
      if (response.status === 200) {
        console.log("updated successfully");
      } else {
        console.error("Error updating");
      }
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error updating:", error);
    } finally {
      setClicked(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(updateProfile)}
      className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex flex-col items-center border-r pr-6 my-auto">
            <div className="relative flex items-center justify-center w-28 h-28 mb-4">
              <img
                src="/images/adminProfile.jpg"
                alt="Profile"
                className="w-full h-full rounded-full border border-gray-300 shadow-sm"
              />
              <img
                src="/icons/edit.png"
                alt="Edit"
                className="absolute bottom-1 right-1 w-7 h-7 bg-white p-1 rounded-full border cursor-pointer hover:shadow-md hover:bg-gray-50"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 pb-2">
              <input
                type="text"
                placeholder="Society Name"
                {...register("name")}
                className="w-full text-center border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />
              {errors.name?.message && (
                <p className="font-normal text-center text-sm text-red-500 pt-2">
                  {errors.name.message}
                </p>
              )}
            </h2>
          </div>

          <div className="md:w-2/3 flex flex-col gap-6">
            <hr className="md:hidden border-gray-300" />
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  className="text-gray-700 text-sm font-bold"
                  htmlFor="email"
                >
                  Email
                </label>
                <div
                  id="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                >
                  {email}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-grow flex flex-col gap-2">
                  <label
                    className="text-gray-700 text-sm font-bold"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="********"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                  {errors.password?.message && (
                    <p className="font-normal text-sm text-red-500 pt-2">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-gray-700 text-sm font-bold"
                  htmlFor="website"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  {...register("websiteUrl")}
                  placeholder="https://societywebsite.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                {errors.websiteUrl?.message && (
                  <p className="font-normal text-sm text-red-500 pt-2">
                    {errors.websiteUrl.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-gray-800">Contact</h3>
                <input
                  type="tel"
                  id=".phoneNumber"
                  {...register("phoneNumber")}
                  placeholder="Phone : (098) 765-4321"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                {errors.phoneNumber?.message && (
                  <p className="font-normal text-sm text-red-500 pt-2">
                    {errors.phoneNumber.message}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    type="submit"
                    disabled={clicked}
                  >
                    {clicked ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setClicked(true);
                      navigate("/admin-dashboard");
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={clicked}
                  >
                    {clicked ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      "Discard"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProfilePage;
