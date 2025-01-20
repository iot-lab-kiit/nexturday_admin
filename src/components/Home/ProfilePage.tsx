import { getSocietyProfile, updateSocietyProfile } from "@/api/societyApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { updateMetadata } from "@/utils/metadata";
import { IoIosLogIn } from "react-icons/io";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  password: z.string().optional(),
  websiteUrl: z
    .string()
    .url({ message: "Enter valid url" })
    .optional()
    .nullable(),
  phoneNumber: z
    .string()
    .regex(
      /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm,
      "Enter valid phone number"
    ),
});

type FormData = z.infer<typeof schema>;

const PasswordChangeModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-3">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex gap-4 items-center mb-4">
          <div className="bg-red-200 w-8 h-8 flex justify-center items-center rounded-lg">
            <Icon
              icon="line-md:alert"
              width="24"
              height="24"
              style={{ color: "#dc2626" }}
            />
          </div>
          <h3 className="text-lg font-semibold text-red-600">
            Confirm Password Change
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          <ul className="flex flex-col gap-2 list-disc pl-7 text-justify">
            <li>
              You have opted to change your password by providing input in the
              password field.
            </li>
            <li>Click update to change password, else click on cancel.</li>
            <li>Keep the password field empty to keep the same password.</li>
          </ul>
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500"
          >
            {loading ? (
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
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

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
    if (data.password && data.password.trim()) {
      setPendingFormData(data);
      setShowPasswordModal(true);
      return;
    }
    await processUpdate(data);
  };

  const processUpdate = async (data: FormData) => {
    setClicked(true);
    try {
      const requestBody: any = {
        name: data.name,
        phoneNumber: data.phoneNumber,
      };

      if (data.password && data.password.trim()) {
        requestBody.password = data.password;
      }

      if (data.websiteUrl && data.websiteUrl.trim()) {
        requestBody.websiteUrl = data.websiteUrl;
      }

      const response = await updateSocietyProfile(requestBody);
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        navigate("/admin-dashboard");
      } else {
        toast.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error updating:", error);
      toast.error("Error updating profile");
    } finally {
      setClicked(false);
    }
  };

  const handleModalConfirm = async () => {
    if (pendingFormData) {
      await processUpdate(pendingFormData);
    }
    setShowPasswordModal(false);
    setPendingFormData(null);
  };

  const handleModalClose = () => {
    setShowPasswordModal(false);
    setPendingFormData(null);
    setValue("password", "");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(updateProfile)}
        className="min-h-screen bg-blue-900 flex justify-center items-center px-4 py-8"
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
                    className="w-full border bg-slate-100 text-slate-500 cursor-not-allowed border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
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
                    <div className="flex gap-2">
                      <input
                        id="password"
                        type="password"
                        {...register("password")}
                        placeholder="********"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                      />
                      {/* <div className="bg-red-300 w-12 flex justify-center items-center rounded-lg">!</div> */}
                    </div>
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
                  <div className="flex justify-between items-center flex-col gap-6 w-full ">
                    <button
                      className="px-4 py-2 flex justify-center bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
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
                        "Update"
                      )}
                    </button>
                    <div className="flex items-center justify-end gap-4 w-full">
                      {" "}
                      <p className="text-sm text-gray-600">
                        Directly proceed to my dashboard{" "}
                      </p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
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
                          <p className="flex items-center gap-3">
                            Proceed
                            <IoIosLogIn className=" text-white text-2xl " />
                          </p>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        loading={clicked}
      />
    </>
  );
};

export default ProfilePage;
