import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { updateSocietyProfile } from "../api/societyApi";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string(),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
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
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setClicked(true);
    try {
      const response = await updateSocietyProfile(data);
      if (response.status === 200) {
        console.log("updated successfully");
      } else {
        console.error("Error updating");
      }
      navigate("/");
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex justify-center items-center px-4 py-8"
    >
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-4xl p-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-col items-center border-r pr-8">
          <div className="relative flex items-center justify-center w-32 h-32 mb-6">
            <img
              src="/images/adminProfile.jpg"
              alt="Profile"
              className="w-full h-full rounded-full border-4 border-blue-300 shadow-lg"
            />
            <img
              src="/icons/edit.png"
              alt="Edit"
              className="absolute bottom-1 right-1 w-8 h-8 bg-white p-1 rounded-full border cursor-pointer hover:shadow-lg hover:bg-gray-100"
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 pb-3">
            <input
              type="text"
              placeholder="Society Name"
              {...register("name")}
              className="w-full text-center border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
            />
            {errors.name?.message && (
              <p className="font-normal text-center text-sm text-red-500 pt-2">
                {errors.name.message}
              </p>
            )}
          </h2>
          <textarea
            className="w-full text-justify border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder="This is a brief description about the society. It can be 2-3 lines long."
            {...register("description")}
          ></textarea>
        </div>

        <div className="md:w-2/3 flex flex-col gap-8">
          <hr className="md:hidden border-gray-300" />
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                className="text-gray-700 text-sm font-bold"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="admin@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
              />
              {errors.email?.message && (
                <p className="font-normal text-sm text-red-500 pt-2">
                  {errors.email.message}
                </p>
              )}
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
              />
              {errors.phoneNumber?.message && (
                <p className="font-normal text-sm text-red-500 pt-2">
                  {errors.phoneNumber.message}
                </p>
              )}
              <div className="flex gap-8">
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 mt-4 py-2 px-6 rounded-lg self-start active:scale-95 transition-all"
                  type="submit"
                  disabled={clicked}
                >
                  Edit
                </button>
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 mt-4 py-2 px-6 rounded-lg self-start active:scale-95 transition-all"
                  type="button"
                  onClick={() => navigate("/admin-dashboard")}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProfilePage;
