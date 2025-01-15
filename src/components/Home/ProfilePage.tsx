import { getSocietyProfile, updateSocietyProfile } from "@/api/societyApi";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  // .min(3, "Name must be at least 3 characters"),
  password: z.string(),
  // .min(8, { message: "Password must be at least 8 characters long" }),
  websiteUrl: z.string(),
  // .url({ message: "Enter valid url" }),
  phoneNumber: z.string(),
  // .regex(
  //   /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm,
  //   "Enter valid phone number"
  // ),
});

type FormData = z.infer<typeof schema>;

const ProfilePage = () => {
  const [clicked, setClicked] = useState(false);
  const [societyDetails, setSocietyDetails] = useState<FormData>();
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
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
    setClicked(true);
    try {
      const response = await getSocietyProfile();
      console.log(response);
      setSocietyDetails(response.data.data);
      setValue("name", response.data.data.name);
      setEmail(response.data.data.email);
      setValue("password", response.data.data.password);
      setValue("websiteUrl", response.data.data.websiteUrl);
      setValue("phoneNumber", response.data.data.phoneNumber);
    } catch (error) {
      console.error("Error fetching society profile:", error);
      throw error;
    }
  };

  const updateProfile = async (data: FormData,e:any) => {
    e.preventDefault();
    setClicked(true);
    console.log("hkj", data);
    try {
      const response = await updateSocietyProfile(data);
      console.log(response);

      if (response.status === 200) {
        console.log("updated successfully");
      } else {
        console.error("Error updating");

      }
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(updateProfile)}
      // onSubmit={(e:any) => {
      //   e.preventDefault();
      //   console.log("clicked");
      // }}
      className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8"
    >
      {/* Container for the profile page */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 flex flex-col md:flex-row gap-6">
        {/* Left Section: Admin Info */}
        <div className="md:w-1/3 flex flex-col items-center border-r pr-6">
          {/* Profile Image and Edit Icon */}
          <div className="relative flex items-center justify-center w-28 h-28 mb-4">
            <img
              src="/images/adminProfile.jpg"
              alt="Profile"
              className="w-full h-full rounded-full border border-gray-300 shadow-sm"
            />
            {/* Edit icon positioned at the bottom-right of the profile image */}
            <img
              src="/icons/edit.png"
              alt="Edit"
              className="absolute bottom-1 right-1 w-7 h-7 bg-white p-1 rounded-full border cursor-pointer hover:shadow-md hover:bg-gray-50"
            />
          </div>
          {/* Admin Name and Description */}
          <h2 className="text-2xl font-bold text-gray-800 pb-2">
            <input
              type="text"
              placeholder="Society Name"
              // defaultValue={societyDetails?.name}
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

        {/* Right Section: Admin Details Form */}
        <div className="md:w-2/3 flex flex-col gap-6">
          {/* Horizontal divider for smaller screens */}
          <hr className="md:hidden border-gray-300" />
          <div className="w-full flex flex-col gap-6">
            {/* Email Input Field */}
            <div className="flex flex-col gap-2">
              <label
                className="text-gray-700 text-sm font-bold"
                htmlFor="email"
              >
                Email
              </label>
              <div
                id="email"
                // defaultValue={societyDetails?.email}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              >
                {email}
              </div>
            </div>
            {/* Password Input Field with Forgot Password Link */}
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
              {/* <button
                className="text-blue-500 hover:underline text-sm flex items-center justify-center"
                type="button"
              >
                Forgot Password?
              </button> */}
            </div>
            {/* Website Input Field */}
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
                // defaultValue={societyDetails?.websiteUrl}
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
            {/* Contact Information Section */}
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-gray-800">Contact</h3>
              <input
                type="tel"
                id=".phoneNumber"
                // defaultValue={societyDetails?.phoneNumber}
                {...register("phoneNumber")}
                placeholder="Phone : (098) 765-4321"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />
              {errors.phoneNumber?.message && (
                <p className="font-normal text-sm text-red-500 pt-2">
                  {errors.phoneNumber.message}
                </p>
              )}
              {/* <p className="text-gray-600">Phone 1: (123) 456-7890</p>
              <p className="text-gray-600">Phone 2: (098) 765-4321</p> */}
              <div className="flex justify-between items-center">
                <button
                  className="text-blue-500 hover:underline mt-2 self-start active:scale-90 transition-all"
                  type="submit"
                  // disabled={clicked}
                 
                >
                  Edit
                </button>
                {/* cancel button */}
                <div
                  onClick={() => navigate("/admin-dashboard")}
                  className="text-blue-500 hover:underline mt-2 self-start"
                >
                  Cancel
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProfilePage;
