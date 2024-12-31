import { Icon } from "@iconify/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";




const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
        `Password must contain at least one uppercase letter, one lowercase letter and one number`
      ),
    retypedPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.retypedPassword !== data.password) {
      ctx.addIssue({
        path: ["retypedPassword"],
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
      });
    }
  });

type FormData = z.infer<typeof schema>;

function ChangePassword() {
  const [clicked, setClicked] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRetypedPassword, setShowRetypedPassword] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const login: SubmitHandler<FormData> = (data) => {
    setClicked(true);
    console.log(data);
  };

  return (
    <>
      <div className="flex h-svh w-screen justify-center items-center font-monaSans">
        <div className="md:w-[55%]">
          <div className="p-6 md:min-w-80 md:max-w-[600px] m-auto">
            <h1 className="font-bold text-3xl pb-2 leading-8">
              Set your new password
            </h1>
            
            <form onSubmit={handleSubmit(login)} className="py-9 font-semibold">
              <div className="flex flex-col gap-6 pb-5">
                <div className="">
                  <div className="flex gap-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Password"
                      className="w-full border border-t-0 border-l-0 border-r-0 pb-2 outline-none focus:border-b-gray-400 transition-all"
                    />
                    <button
                      className="flex justify-center items-center"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {!showPassword ? (
                        <Icon
                          icon="mage:eye"
                          width="22"
                          height="22"
                          style={{ color: "#9ca3af" }}
                        />
                      ) : (
                        <Icon
                          icon="mage:eye-off"
                          width="22"
                          height="22"
                          style={{ color: "#9ca3af" }}
                        />
                      )}
                    </button>
                  </div>
                  {errors.password?.message && (
                    <p className="pr-10 font-normal text-sm text-red-500 pt-2 text-justify">
                      {`${errors.password.message}`}
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex gap-2">
                    <input
                      type={showRetypedPassword ? "text" : "password"}
                      {...register("retypedPassword")}
                      placeholder="Retype password"
                      className="w-full border border-t-0 border-l-0 border-r-0 pb-2 outline-none focus:border-b-gray-400 transition-all"
                    />
                    <button
                      className="flex justify-center items-center"
                      onClick={() => {
                        setShowRetypedPassword(!showRetypedPassword);
                      }}
                    >
                      {!showRetypedPassword ? (
                        <Icon
                          icon="mage:eye"
                          width="22"
                          height="22"
                          style={{ color: "#9ca3af" }}
                        />
                      ) : (
                        <Icon
                          icon="mage:eye-off"
                          width="22"
                          height="22"
                          style={{ color: "#9ca3af" }}
                        />
                      )}
                    </button>
                  </div>
                  {errors.retypedPassword?.message && (
                    <p className="font-normal text-sm text-red-500 pt-2">
                      {errors.retypedPassword.message}
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
              >
                {clicked ? (
                  <Icon
                    icon="svg-spinners:90-ring-with-bg"
                    width="24"
                    height="24"
                    style={{ color: "#fff" }}
                  />
                ) : (
                  <span className="flex justify-center items-center">
                    Update Password
                    {/* <Icon
                      icon="uim:angle-right"
                      width="24"
                      height="24"
                      style={{ color: "#fff" }}
                    /> */}
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

export default ChangePassword;
