import { Icon } from "@iconify/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
// import { signup, signin } from "../lib/auth";
import axios from "axios";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

function ForgotPassword() {
  const [clicked, setClicked] = useState<boolean>(false);
  // const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const updatePassword: SubmitHandler<FormData> = async (data) => {
    const baseUrl = "";
    const res = {
      email: data.email,
    };
    try {
      await axios.patch(`${baseUrl}/api/society`, res);
      // if(response)
    } catch (error) {
      console.log(error);
    }
    // const response = await axios.patch(`${baseUrl}/api/society`, res);
    setClicked(true);
    // console.log(data);
  };

  return (
    <>
      <div className="flex h-svh w-screen justify-center items-center font-monaSans">
        <div className="md:w-[55%]">
          <div className="p-6 md:min-w-80 md:max-w-[600px] m-auto">
            <h1 className="font-bold text-3xl pb-2 leading-8">
              Forgot Password?
            </h1>
            <p className="leading-5">
              No worries, we'll send you reset instructions.
            </p>
            {/* <div className="py-9">
              <button className="w-full border rounded-md p-2 font-semibold flex justify-center items-center gap-3 active:scale-95 transition-all">
                <Icon icon="devicon:google" width="15" height="15" />
                Login with Google
              </button>
            </div> 
             <div className="flex justify-center items-center">
              <hr className="w-full" />
              <div className="px-2">or</div>
              <hr className="w-full" />
            </div> */}
            <form onSubmit={handleSubmit(updatePassword)} className="py-9 font-semibold">
              <div className="flex flex-col gap-6 pb-5">
                <div>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Email address"
                    className="w-full border border-t-0 border-l-0 border-r-0 pb-2 outline-none focus:border-b-gray-400 transition-all"
                  />
                  {errors.email?.message && (
                    <p className="font-normal text-sm text-red-500 pt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              {/* <div className="flex justify-between pt-5 pb-7 flex-wrap">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    name="rememberMe"
                    id="rememberMe"
                    className="h-4 w-4"
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <a href="#" className="text-blue-500 active:text-blue-700">
                  Forgot Password?
                </a>
              </div> */}
              <button
                type="submit"
                className="w-full flex items-center justify-center bg-blue-500 text-white p-2 rounded-md active:bg-blue-600 active:scale-95 transition-all"
                disabled={clicked}
                // onClick={()=>{
                //   handleSignIn()
                // }}
              >
                {clicked ? (
                  <div>Logging in</div>
                ) : (
                  <span className="flex justify-center items-center">
                    Next
                    <Icon
                      icon="uim:angle-right"
                      width="24"
                      height="24"
                      style={{ color: "#fff" }}
                    />
                  </span>
                )}
              </button>
            </form>
            {/* <p className="font-semibold">
              Dont have an account?{" "}
              <a href="#" className="text-blue-500 active:text-blue-700">
                Create one now.
              </a>
            </p> */}
          </div>
        </div>
        <div className="hidden md:block h-full w-[45%] p-6 pl-0">
          <div className="bg-blue-500 h-full w-full rounded-xl"></div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
