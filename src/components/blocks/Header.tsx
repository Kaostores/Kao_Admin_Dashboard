import { useRef, useEffect, useState } from "react";
import { SlCalender } from "react-icons/sl";
import { BiPrinter } from "react-icons/bi";
import { HiOutlineFolderDownload } from "react-icons/hi";
import { CiSettings } from "react-icons/ci";
import { BiBell } from "react-icons/bi";
import {  useLocation } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import Last7DaysDropdown from "./DropDown";
import 'react-toastify/dist/ReactToastify.css';
import { useProfileImage } from '@/pages/Settings/ProfileImageContext';

const Header = () => {
	const { profileImage } = useProfileImage();
	const [show3, setShow3] = useState(true);
	const location = useLocation();
	const active = location?.pathname;
	console.log("active", active);

   const toggle3 = () => {
    setShow3(!show3);
   };




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
								{/* <div className='sm:w-[150px] smx:w-[200px] sm:mb-[10px] md:mb-[0px] sm:h-[25px] xl:h-[40px] md:h-[38px] xl:w-[250px] bg-white  border-solid  border-[#9ea0a0] border-[1px] flex justify-center items-center rounded-[5px]'>
									<div className='mr-[10px] text-[#0333ae] sm:ml-[10px] sm:text-[13px] xl:text-[16px] '>
										<BiSearch />
									</div>
									<div className='w-[85%] h-[100%]'>
										<input
											type='text'
											placeholder='Search'
											className='w-[100%] h-[100%] pl-[5px] outline-none border-0 bg-transparent sm:text-[13px] xl:text-[16px]'
										/>
									</div>
								</div> */}
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
							<div className='w-80px justify-center items-center rounded-[5px] sm:block sm:mt-[-10px] xl:mt-[0] xl:overflow-hidden xl:flex  ml-[20px] border-solid border-[#9ea0a0] border-[1px]'>
								<div className='xl:w-[40px] smx:w-[30px] xl:h-[40px] smx:h-[30px] sm:w-[20px] sm:h-[30px] sm:text-[13px] xl:text-[16px] smx:text-[17px] bg-[#0333ae] flex justify-center items-center text-white'>
									<BiPrinter />
								</div>
								<div className='xl:w-[40px] smx:w-[30px] xl:h-[40px] smx:h-[30px] sm:w-[20px] sm:h-[30px] sm:text-[13px] xl:text-[16px] smx:text-[17px] bg-[#fff] flex justify-center items-center text-[#0333ae]'>
									<HiOutlineFolderDownload />
								</div>
							</div>
							<div className='xl:flex xl:flex-row sm:flex-col xl:justify-center xl:mt-[0px] sm:mt-[-10px] items-center'>
								<div className='xl:w-[80px] xl:flex xl:flex-row sm:flex sm:flex-row xl:justify-between sm:justify-start sm:items-end xl:items-center ml-[20px]'>
									<div className='xl:w-[40px] xl:h-[40px] xl:text-[25px] sm:text-[15px] smx:text-[20px] flex justify-center items-center text-[#0333ae]'>
										<CiSettings />
									</div>
									<div className='xl:w-[40px] xl:h-[40px] xl:text-[25px] sm:text-[15px] smx:text-[20px] smx:ml-[10px] flex justify-center items-center text-[#000]'>
										<BiBell />
									</div>
								</div>
								<div className='xl:min-w-[110px] sm:w-[60px] md:w-[120px] xl:flex sm:flex justify-between items-center rounded-[5px] overflow-hidden ml-[20px] sm:mt-[0] smx:mt-[0] xl:mt-[0] md:mt-[10px]'>
									<div className='xl:w-[30px] smx:w-[15px] overflow-hidden md:w-[25px] md:h-[25px] xl:h-[30px] smx:h-[10px] sm:w-[10px] smx:mr-[15px] sm:h-[10px] rounded-[50%] bg-orange-600'>
										<img src={profileImage || ""} alt="" className="w-[100%] h-[100%] object-cover"/>
									</div>
									<div className='xl:text-[16px] sm:text-[10px] md:text-[14px]'>
										Dan Casey
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





