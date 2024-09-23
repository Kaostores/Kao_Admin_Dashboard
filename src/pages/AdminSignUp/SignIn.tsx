import dp from "../../assets/Ic.png";
import kao from "../../assets/ellipse.png";
import { Login } from "@/utils/ApiCalls";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiUnlock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Cookies from "universal-cookie";
import { updateUserDetails } from "@/services/reducers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "email is required",
  }),
  password: z.string().min(2, {
    message: "password is required",
  }),
});

const SignIn = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoad(true);
    try {
        const response: any = await Login(values);

        if (response?.status === 200) {
            toast.success("Login Successful");
            cookies.set("Kao_cookie_admin", response?.data?.token, {
                expires: expiryDate,
                path: "/",
            });
          console.log(response)
            dispatch(updateUserDetails(response?.data.data));
            navigate("/app/admin");
        } else if (response?.status === 500) {
            toast.error("Server error: Details do not match");
        } else if (response?.response?.status === 401) {
            toast.info("Unauthorized: Invalid Credentials");
        } else {
            toast.info("Unexpected response: " + response?.status);
        }
    } catch (error) {
        console.error("Submission error:", error);
        toast.error("An error occurred. Please try again.");
    } finally {
        setLoad(false);
    }
}


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  const [load, setLoad] = useState(false);

  return (
    <div className='w-[100%] h-[100vh] flex justify-center items-center lg:overflow-hidden'>
      <div className='w-[100%] h-[100%] flex justify-center items-center'>
        <div className='w-[50%] h-[100vh] hidden relative lg:block'>
          <div className='w-[100%] h-[100%] bg-cover bg-right-top bg-bb absolute right-[40px]' />
          <div className='w-[100%] h-[100%] bg-[#0333ae] absolute bg-opacity-95'></div>
          <div className='w-[100%] absolute top-[20%] left-[15%] md:left-[7%] md:w-[70%] md:top-[30%] lg:top-[10%] lg:left-[15%] lg:w-[100%]'>
            <img src={dp} alt='' className='lg:w-[70%]' />
          </div>
        </div>
        <div className='width-[100%] absolute top-0 z-10 sm:top-[20px] lg:top-[0]'>
          <img
            src={kao}
            alt=''
            className='sm:w-[70px] md:w-[75px] lg:w-[100%]'
          />
        </div>
        <div className='w-[50%] h-[100vh] relative sm:w-[100%] sm:h-[130vh] sm:my-[20px] md:w-[100%] lg:w-[50%]'>
          <div className='w-[100%] h-[100%] bg-cover bg-center bg-bb absolute ' />
          <div className='w-[100%] h-[100%] bg-[#fcfcfc] absolute bg-opacity-90'></div>
          <div className='w-[500px] pt-[20px] pb-[20px] bg-slate-900 absolute top-[20%] left-[20%] rounded-[20px] bg-opacity-20 sm:w-[290px] sm:left-[15px] sm:top-[30%] smm:left-[10%] smx:left-[10%] smx:w-[350px] md:w-[600px] lg:w-[500px] lg:left-[15%] lg:top-[25%]'>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-[100%] h-[100%] flex justify-center items-center flex-col'>
              <div className='text-black text-[30px] font-bold mb-[20px]'>
                Welcome back
              </div>

              <div className='w-[300px] h-[45px] border-[2px] border-solid border-[#0333ae] rounded-[5px] flex justify-between items-center pl-[5px] pr-[5px] mb-[15px] sm:w-[270px] smx:w-[320px] md:w-[500px] lg:w-[450px]'>
                <div className='text-[20px] text-[#0333ae]'>
                  <FiUnlock />
                </div>
                <div className='h-[100%]'>
                  <input
                    type='email'
                    placeholder='Email'
                    {...form.register("email")}
                    className='w-[270px] h-[100%] bg-transparent outline-none pl-[10px] placeholder-black md:w-[500px]'
                  />
                </div>
              </div>

              <div className='w-[300px] h-[45px] border-[2px] border-solid border-[#0333ae] rounded-[5px] flex justify-between items-center pl-[5px] pr-[5px] mb-[15px] sm:w-[270px] smx:w-[320px] md:w-[500px] lg:w-[450px]'>
                <div className='text-[20px] text-[#0333ae]'>
                  <FiUnlock />
                </div>
                <div className='h-[100%]'>
                  <input
                    type='password'
                    placeholder='Password'
                    {...form.register("password")}
                    className='w-[100%] h-[100%] bg-transparent outline-none pl-[10px] placeholder-black md:w-[500px]'
                  />
                </div>
              </div>

              <div className='w-[60%] flex justify-end sm:w-[90%] md:w-[81%] lg:w-[90%]'>
                <div className='text-[#0333ae] font-bold cursor-pointer'>
                  Forget Password?
                </div>
              </div>
              <div className='w-[100%] flex justify-center items-center flex-col mt-[30px]'>
                <div className='font-bold mb-[20px] flex justify-center items-center'></div>
                <button
                  type='submit'
                  disabled={load}
                  className='w-[300px] h-[45px] flex justify-center items-center text-white bg-[#0333ae] rounded-[10px] mb-[10px] cursor-pointer sm:w-[270px] smx:w-[320px] md:w-[500px] lg:w-[450px]'>
                  {load ? "Loading..." : "Login"}
                </button>
                <Link to='/'>
                  <div className='text-[#0333ae] font-bold cursor-pointer'>
                    Sign Up
                  </div>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
