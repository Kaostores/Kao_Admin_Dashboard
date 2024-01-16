import react from "react"
import dp from "../../assets/Ic.png"
import kao from "../../assets/ellipse.png"
import {FiUser} from "react-icons/fi"
import {FiUnlock} from "react-icons/fi"

const SignUp=()=>{
    return(
        <div className="w-[100%] h-[100vh] flex justify-center  lg:overflow-hidden items-center ">
            <div className="w-[100%] h-[100%] flex justify-center items-center">
              <div className="w-[50%] h-[100vh] hidden relative lg:block">
                 <div className="w-[100%] h-[100%] bg-cover bg-right-top bg-bb absolute right-[40px]"/>
                 <div className="w-[100%] h-[100%] bg-[#0333ae] absolute bg-opacity-95"></div>
                 <div className="w-[100%] absolute top-[20%] left-[15%] md:left-[7%] md:w-[70% ] md:top-[30%] lg:top-[20%] lg:left-[15%]">
                    <img src={dp} alt="" />
                 </div>
              </div>
              <div className="width-[100%] absolute top-0 z-10 sm:top-[40px] lg:top-[0]">
                <img src={kao} alt="" />
              </div>
              <div className="w-[50%] h-[100vh] relative sm:w-[100%] md:w-[100%] lg:w-[50%]">
                 <div className="w-[100%] h-[100%] bg-cover bg-center bg-bb absolute "/>
                 <div className="w-[100%] h-[100%] bg-[#fcfcfc] absolute bg-opacity-90"></div>
                 <div className="w-[500px] pt-[25px] pb-[25px] bg-slate-900  absolute top-[20%] left-[20%] rounded-[20px] bg-opacity-20 sm:w-[290px] sm:left-[15px] sm:top-[30%] smm:left-[10%] smx:left-[10%] smx:w-[350px] md:w-[600px] lg:w-[500px] lg:left-[20%] lg:top-[20%]">
                     <form action="POST" className="w-[100%] h-[100%] flex justify-center items-center flex-col">
                        <div className="text-black text-[30px] font-bold mb-[20px]">Welcome!</div>
                        <div className="w-[300px] h-[45px] border-[3px] border-solid border-[#0333ae] rounded-[5px] flex justify-between items-center pl-[5px] pr-[5px] mb-[20px] sm:w-[270px] smx:w-[320px] md:w-[500px] lg:w-[450px]">
                            <div className="text-[20px] text-[#0333ae]">
                                <FiUser/>
                            </div>
                            <div className="h-[100%]">
                                <input type="text" placeholder="Username" className="w-[270px] h-[100%] bg-transparent outline-none pl-[10px] placeholder-black md:w-[500px] "/>
                            </div>
                        </div>
                        <div className="w-[300px] h-[45px] border-[3px] border-solid border-[#0333ae] rounded-[5px] flex justify-between items-center pl-[5px] pr-[5px] mb-[15px] sm:w-[270px] smx:w-[320px] md:w-[500px] lg:w-[450px]">
                            <div className="text-[20px] text-[#0333ae]">
                                <FiUnlock/>
                            </div>
                            <div className="h-[100%]">
                                <input type="text" placeholder="Password" className="w-[270px] h-[100%] bg-transparent outline-none pl-[10px] placeholder-black md:w-[500px]"/>
                            </div>
                        </div> 
                        <div className="w-[60%] flex justify-end sm:w-[90%] md:w-[81%] lg:w-[90%]">
                            <div className="text-[#0333ae] font-bold cursor-pointer ">Forget Password?</div>
                        </div>
                        <div className="w-[100%] flex justify-center items-center flex-col mt-[30px]">
                            <div className="font-bold mb-[20px] cursor-pointer ">Remember me</div>
                            <div className="w-[300px] h-[45px] flex justify-center items-center text-white bg-[#0333ae] rounded-[10px] mb-[10px] cursor-pointer sm:w-[270px] smx:w-[320px] md:w-[500px] lg:w-[450px]">Login</div>
                            <div className="text-[#0333ae] font-bold cursor-pointer">Sign Up</div>
                        </div>
                     </form>
                 </div>
              </div>
            </div>
        </div>
    ) 
}
export default SignUp;