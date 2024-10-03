import { useRef, useEffect, useState } from "react";
import { SlCalender } from "react-icons/sl";
import { BiPrinter } from "react-icons/bi";
import { HiOutlineFolderDownload } from "react-icons/hi";
import { CiMenuBurger } from "react-icons/ci";
import Last7DaysDropdown from "./DropDown";
import 'react-toastify/dist/ReactToastify.css';
import { useProfileImage } from '@/pages/Settings/ProfileImageContext';
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { logoutUser } from "@/services/reducers"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { LogOut, Bell, Settings } from "lucide-react"
import { useGetUserDataQuery } from "@/services/apiSlice";
import { Skeleton } from "@/components/ui/skeleton"

const Header = () => {
	const { profileImage } = useProfileImage();
	const [show3, setShow3] = useState(true);
	const location = useLocation();
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const active = location?.pathname;
	console.log("active", active);

	const { data, isLoading } = useGetUserDataQuery(undefined);

   const toggle3 = () => {
    setShow3(!show3);
   };


   const handleLogout = () => {
    dispatch(logoutUser())
    toast.success("You have logged out successfully", {
      autoClose: 3000,
      closeButton: true,
      onClose: () => {
        navigate("/")
      },
    })
  }


	const [activeIndex] = useState<number | null>(null);
	const contentHeight1 = useRef<any>(null);
	const contentHeight2 = useRef<any>(null);
	const contentHeight3 = useRef<any>(null);
	const contentHeight4 = useRef<any>(null);

	useEffect(() => {
    if (contentHeight1.current) {
      contentHeight1.current.style.height =
        activeIndex === 1 ? `${contentHeight1.current.scrollHeight}px` : "0px";
    }
    if (contentHeight2.current) {
      contentHeight2.current.style.height =
        activeIndex === 2 ? `${contentHeight2.current.scrollHeight}px` : "0px";
    }
    if (contentHeight3.current) {
      contentHeight3.current.style.height =
        activeIndex === 3 ? `${contentHeight3.current.scrollHeight}px` : "0px";
    }
    if (contentHeight4.current) {
      contentHeight4.current.style.height =
        activeIndex === 4 ? `${contentHeight4.current.scrollHeight}px` : "0px";
    }
	}, [activeIndex]);
	


	return (
		<div className='w-[100%] '>
			<div className='w-[100%] h-[100%] flex bg-red '>

				<div className='xl:w-full h-[70px] flex bg-[#fff] justify-end items-center z-[10] '>
					<div className='w-[100%] h-[40px] flex  justify-center items-center'>
						<div className=' w-[90%] h-[100%] flex justify-between items-start'>
							<div
								className='xl:hidden xl:text-[16px] smx:text-[20px] sm:block smx:h-[100%] sm:mr-[10px] sm:cursor-pointer '
								onClick={toggle3}>
								<CiMenuBurger />
							</div>
							<div className='w-[60%]  flex sm:mt-[-10px] sm:flex xl:mt-[0px] md:flex md:flex-row md:mt-[0px] md:w-[60%] flex-col justify-between xl:flex-row md:items-center items-center'>
								<div className='sm:w-[150px] sm:h-[25px] xl:w-[250px] xl:h-[40px]  flex justify-between flex-col items-center xl:mt-[0px] sm:mt-[0] smx:mt-[0] md:mt-[-13px]'>
									<div className='sm:w-[150px] smx:w-[200px] sm:min-h-[25px] xl:w-[200px] xl:min-h-[40px] md:min-h-[38px]  bg-white  flex justify-center items-center border-solid border-[#9ea0a0] border-[1px] rounded-[5px]'>
										<div className='mr-[10px] sm:text-[13px] text-[#0333ae]'>
											<SlCalender />
										</div>
										<div className='w-[80%] flex justify-between items-center'>
											<div className='xl:text-[16px] sm:text-[13px]'>
												<Last7DaysDropdown />
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='w-[80px] justify-center items-center rounded-[5px] sm:block sm:mt-[-10px] xl:mt-[0] xl:overflow-hidden xl:flex  mr-[-22px] border-solid border-[#9ea0a0] border-[1px]'>
								<div className='xl:w-[40px] smx:w-[30px] xl:h-[40px] smx:h-[30px] sm:w-[20px] sm:h-[30px] sm:text-[13px] xl:text-[16px] smx:text-[17px] bg-[#0333ae] flex justify-center items-center text-white'>
									<BiPrinter />
								</div>
								<div className='xl:w-[40px] smx:w-[30px] xl:h-[40px] smx:h-[30px] sm:w-[20px] sm:h-[30px] sm:text-[13px] xl:text-[16px] smx:text-[17px] bg-[#fff] flex justify-center items-center text-[#0333ae]'>
									<HiOutlineFolderDownload />
								</div>
							</div>
							<div className='xl:flex xl:flex-row h-[100%]  w-[450px] sm:flex-col xl:justify-center xl:mt-[0px] sm:mt-[-10px] items-center'>
								<div className='xl:w-[80px] xl:flex xl:flex-row sm:flex sm:flex-row xl:justify-between sm:justify-start sm:items-end xl:items-center ml-[20px]'>
									<div className='xl:w-[20px] xl:h-[40px] xl:text-[25px] sm:text-[15px] smx:text-[20px] flex justify-center items-center text-[#0333ae]'>
										<Settings size={22} />
									</div>
									<div className='xl:w-[40px] xl:h-[40px] xl:text-[25px] sm:text-[15px] smx:text-[20px] smx:ml-[10px] flex justify-center items-center text-[#000]'>
										<Bell size={22}/> 
									</div>
								</div>
								<div className="">
									<Button
									variant="secondary"
									className="w-full bg-white text-[#0333ae] text-[15px] hover:bg-white/90"
									onClick={handleLogout}
									>
									<LogOut className="mr-2 h-4 w-4" />
									Logout
									</Button>
								</div>
								<div className='pl-[15px] py-[10px] pr-[15px] bg-[#0333ae] xl:flex sm:flex justify-between items-center rounded-[5px] overflow-hidden ml-[20px]'>
									<div className='w-[25px] overflow-hidden h-[25px] rounded-[50%] bg-[#fff]'>
										<img src={profileImage || ""} alt="" className="w-[100%] h-[100%] object-cover"/>
									</div>
									<div className='xl:text-[16px] text-[#fff] sm:text-[10px] ml-[8px] md:text-[14px]'>
										{isLoading ? (
											<Skeleton className="h-4 w-[80px]" />
										) : (
											data?.data.firstname
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;