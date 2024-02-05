import  { useState } from "react";
import pc from "../../assets/ellipse.png";
import { BiHome } from "react-icons/bi";
import { IoPeopleOutline } from "react-icons/io5";
import { IoStorefrontOutline } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
import { IoBriefcaseOutline } from "react-icons/io5";
import { ImAngry } from "react-icons/im";
import { GoChevronUp } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";
import { BiSearch } from "react-icons/bi";
import { SlCalender } from "react-icons/sl";
import { BiPrinter } from "react-icons/bi";
import { HiOutlineFolderDownload } from "react-icons/hi";
import { CiSettings } from "react-icons/ci";
import { BiBell } from "react-icons/bi";
import {  useLocation, useNavigate } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import {VscChromeClose  } from 'react-icons/vsc';
import Last7DaysDropdown from "./DropDown";

const Header = () => {
	const [show, setShow] = useState(true);
	// const [show2, setShow2] = useState(true);
	const [show3, setShow3] = useState(true);
	const location = useLocation();
	const navigate = useNavigate();
	const active = location?.pathname;
	console.log("active", active);

	const toggle = () => {
		setShow(!show);
	};
	// const toggle2 = () => {
		// setShow2(!show2);
	// };
	const toggle3 = () => {
		setShow3(!show3);
	};

	return (
		<div className='w-[100%] flex fixed'>
			<div className='w-[100%] h-[100%] flex bg-red '>
				{
					show3 ? (
<div className='min-w-[280px] h-[100vh]  bg-[#0333ae] hidden items-center justify-start flex-col py-[20px] xl:flex relative'>
					<div className='mb-[15px] '>
						<img src={pc} alt='' className='w-[60%]' />
					</div>
					<div
						onClick={() => {
							navigate("/app/admin");
						}}
						className={`
             w-full min-h-[55px] flex justify-start  items-center pl-[40px] mb-[5px] cursor-pointer 
             ${
								active === "/app/admin"
									? "bg-white text-[#0333ae]"
									: "text-white"
							}
             }
             `}>
						<div className='text-[20px]  font-bold'>
							<BiHome />
						</div>
						<div className='font-medium  text-[18px] ml-[30px] '>Home</div>
					</div>
					<div className='w-[100%] min-h-[55px] flex justify-start items-center pl-[40px] mb-[5px] cursor-pointer'>
						<div className='text-[20px] text-[#0333ae] text-white font-bold'>
							<IoPeopleOutline />
						</div>
						<div className='font-medium text-[#0333ae] text-white text-[18px] ml-[30px] mr-[40px] '>
							Users
						</div>
						<div
							className='text-[20px] text-[#0333ae] text-white font-bold cursor-pointer'
							onClick={toggle}>
							{show ? <GoChevronDown /> : <GoChevronUp />}
						</div>
					</div>
					{show ? null : (
						<div className='w-[100%] flex flex-col justify-center items-center mb-[5px]'>
							<div
								onClick={() => {
									navigate("/app/admin/customers");
								}}
								className={`w-full h-[40px] flex justify-start items-center pl-[90px] mb-[10px] font-medium cursor-pointer text-[18px] ${
									active === "/app/admin/customers"
										? "bg-white text-[#0333ae]"
										: "text-white"
								}
      `}>
								Customers
							</div>

							<div
								onClick={() => {
									navigate("/app/admin/agents");
								}}
								className={`w-full h-[40px] flex justify-start items-center pl-[90px] mb-[10px] font-medium cursor-pointer text-[18px] ${
									active === "/app/admin/agents"
										? "bg-white text-[#0333ae]"
										: "text-white"
								}
                `}>
								Agents
							</div>
						</div>
					)}

					<div
						onClick={() => {
							navigate("/app/admin/stores");
						}}
						className={`
     w-full min-h-[55px] flex justify-start  items-center pl-[40px] mb-[5px] cursor-pointer 
     ${
				active === "/app/admin/stores"
					? "bg-white text-[#0333ae]"
					: "text-white"
			}
     
     `}>
						<div className='text-[20px]  font-bold'>
							<IoStorefrontOutline />
						</div>
						<div className='font-medium  text-[18px] ml-[30px] '>Stores</div>
					</div>

					<div
						onClick={() => {
							navigate("/app/admin/orders");
						}}
						className={` w-full min-h-[55px] flex justify-start  items-center pl-[40px] mb-[5px] cursor-pointer ${
							active === "/app/admin/orders"
								? "bg-white text-[#0333ae]"
								: "text-white"
						}`}>
						<div className='text-[20px]  font-bold'>
							<IoBriefcaseOutline />
						</div>
						<div className='font-medium  text-[18px] ml-[30px] '>Orders</div>
					</div>

					<div
						onClick={() => {
							navigate("/app/admin/wallet");
						}}
						className={` w-full min-h-[55px] flex justify-start  items-center pl-[40px] mb-[5px] cursor-pointer ${
							active === "/app/admin/wallet"
								? "bg-white text-[#0333ae]"
								: "text-white"
						}`}>
						<div className='text-[20px]  font-bold'>
							<IoWalletOutline />
						</div>
						<div className='font-medium  text-[18px] ml-[30px] '>Wallet</div>
					</div>

					<div
						onClick={() => {
							navigate("/app/admin/complaints");
						}}
						className={` w-full min-h-[55px] flex justify-start  items-center pl-[40px] mb-[5px]
cursor-pointer ${
							active === "/app/admin/complaints"
								? "bg-white text-[#0333ae]"
								: "text-white"
						}`}>
						<div className='text-[20px]  font-bold'>
							<ImAngry />
						</div>
						<div className='font-medium  text-[18px] ml-[30px] '>
							Complaints
						</div>
					</div>

					<div className='flex w-[100%] min-h-[55px] justify-center items-center bg-[#7e7c7c] cursor-pointer absolute bottom-0'>
						<div className='text-white'>Logout</div>
					</div>
				</div>
					):(
<div className='xl:min-w-[280px] sm:min-w-[200px] min-h-[100vh]  z-50 xl:relative sm:fixed bg-[#0333ae] xl:items-center xl:justify-start flex-col sm:py-[20px] xl:py-[20px] xl:flex '>
					<div className='mb-[15px] '>
						<img src={pc} alt='' className='xl:w-[60%] sm:w-[30%] sm:ml-[15%]' />
					</div>
					<div className="absolute top-[10px] right-[20px] text-[white] text-[17px] cursor-pointer" onClick={toggle3}>
						<VscChromeClose/>
					</div>
					<div
						onClick={() => {
							navigate("/app/admin");
						}}
						className={`
             w-full xl:min-h-[55px] sm:min-h-[38px] flex justify-start  items-center pl-[40px] xl:mb-[5px] sm:mb-[2px] cursor-pointer 
             ${
								active === "/app/admin"
									? "bg-white text-[#0333ae]"
									: "text-white"
							}
             }
             `}>
						<div className='xl:text-[20px] sm:text-[15px]  font-bold'>
							<BiHome />
						</div>
						<div className='font-medium  xl:text-[18px] sm:text-[15px] ml-[30px] '>Home</div>
					</div>
					<div className='w-[100%] min-h-[55px] flex justify-start items-center pl-[40px] mb-[5px] cursor-pointer'>
						<div className='xl:text-[20px] sm:text-[14px] text-[#0333ae] text-white font-bold'>
							<IoPeopleOutline />
						</div>
						<div className='font-medium sm:text-[14px] text-[#0333ae] text-white xl:text-[18px] ml-[30px] mr-[40px] '>
							Users
						</div>
						<div
							className='text-[20px] text-[#0333ae] text-white font-bold cursor-pointer'
							onClick={toggle}>
							{show ? <GoChevronDown /> : <GoChevronUp />}
						</div>
					</div>
					{show ? null : (
						<div className='w-[100%] flex flex-col justify-center items-center xl:mb-[5px] sm:mb-[2px]'>
							<div
								onClick={() => {
									navigate("/app/admin/customers");
								}}
								className={`  w-full xl:min-h-[55px] sm:min-h-[20px] flex justify-start  items-center pl-[90px] xl:mb-[5px] sm:mb-[2px] cursor-pointer sm:text-[12px] xl:text-[16px] ${
									active === "/app/admin/customers"
										? "bg-white text-[#0333ae]"
										: "text-white"
								}
      `}>
								Customers
							</div>

							<div
								onClick={() => {
									navigate("/app/admin/agents");
								}}
								className={`w-full xl:min-h-[55px] sm:min-h-[20px] flex justify-start  items-center pl-[90px] xl:mb-[5px] sm:mb-[2px] cursor-pointer sm:text-[12px] xl:text-[16px] ${
									active === "/app/admin/agents"
										? "bg-white text-[#0333ae]"
										: "text-white"
								}
                `}>
								Agents
							</div>
						</div>
					)}

					<div
						onClick={() => {
							navigate("/app/admin/stores");
						}}
						className={`
     w-full xl:min-h-[55px] sm:min-h-[40px] flex justify-start  items-center pl-[40px] xl:mb-[5px] sm:mb-[2px] cursor-pointer 
     ${
				active === "/app/admin/stores"
					? "bg-white text-[#0333ae]"
					: "text-white"
			}
     
     `}>
						<div className='xl:text-[20px] sm:text-[14px]  font-bold'>
							<IoStorefrontOutline />
						</div>
						<div className='font-medium  xl:text-[18px] sm:text-[14px] ml-[30px] '>Stores</div>
					</div>

					<div
						onClick={() => {
							navigate("/app/admin/orders");
						}}
						className={` w-full xl:min-h-[55px] sm:min-h-[40px] flex justify-start  items-center pl-[40px] xl:mb-[5px] sm:mb-[5px] cursor-pointer ${
							active === "/app/admin/orders"
								? "bg-white text-[#0333ae]"
								: "text-white"
						}`}>
						<div className='xl:text-[20px] sm:text-[14px]  font-bold'>
							<IoBriefcaseOutline />
						</div>
						<div className='font-medium  xl:text-[18px] sm:text-[14px] ml-[30px] '>Orders</div>
					</div>

					<div
						onClick={() => {
							navigate("/app/admin/wallet");
						}}
						className={` w-full xl:min-h-[55px] sm:min-h-[40px] flex justify-start  items-center pl-[40px] xl:mb-[5px] sm:mb-[2px] cursor-pointer ${
							active === "/app/admin/wallet"
								? "bg-white text-[#0333ae]"
								: "text-white"
						}`}>
						<div className='xl:text-[20px] sm:text-[14px]  font-bold'>
							<IoWalletOutline />
						</div>
						<div className='font-medium  xl:text-[18px] sm:text-[14px] ml-[30px] '>Wallet</div>
					</div>

					<div
						onClick={() => {
							navigate("/app/admin/complaints");
						}}
						className={` w-full xl:min-h-[55px] sm:min-h-[40px] flex justify-start  items-center pl-[40px] xl:mb-[5px] sm:mb-[2px] cursor-pointer 
                ${
							active === "/app/admin/complaints"
								? "bg-white text-[#0333ae]"
								: "text-white"
						}`}>
						<div className='xl:text-[20px] sm:text-[14px] font-bold'>
							<ImAngry />
						</div>
						<div className='font-medium  xl:text-[18px] sm:text-[14px] ml-[30px] '>
							Complaints
						</div>
					</div>

					<div className='flex w-[100%] xl:min-h-[55px] sm:min-h-[40px] justify-center items-center bg-[#C7C7C7] cursor-pointer absolute top-0'>
						<div className='text-white xl:text-[16px] sm:text-[14px] fixed bottom-0'>Logout</div>
					</div>
				</div>
					)
				}
				<div className='w-[100%] h-[70px]   flex bg-[#fff] justify-end items-center shadow-md z-10'>
					<div className='w-[100%] h-[40px] flex  justify-center items-center'>
						<div className=' w-[90%] h-[100%] flex justify-between items-start'>
						<div className="xl:hidden xl:text-[16px] smx:text-[20px] sm:block smx:h-[100%] sm:mr-[10px] sm:cursor-pointer " onClick={toggle3}>
							<CiMenuBurger/>
						</div>
						<div className="w-[60%]  flex sm:mt-[-10px] sm:flex xl:mt-[0px] md:flex md:flex-row md:mt-[0px] md:w-[60%] flex-col justify-between xl:flex-row md:items-center items-center">
						<div className='sm:w-[150px] smx:w-[200px] sm:mb-[10px] md:mb-[0px] sm:h-[25px] xl:h-[40px] md:h-[38px] xl:w-[250px] bg-white  border-solid  border-[#9ea0a0] border-[1px] flex justify-center items-center rounded-[5px]'>
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
							</div>
							<div className='sm:w-[150px] sm:h-[25px] xl:w-[250px] xl:h-[40px]  flex justify-between flex-col items-center xl:mt-[0px] sm:mt-[0] smx:mt-[0] md:mt-[-13px]'>
								<div className='sm:w-[150px] smx:w-[200px] sm:min-h-[25px] xl:w-[200px] xl:min-h-[40px] md:min-h-[38px]  bg-white  flex justify-center items-center border-solid border-[#9ea0a0] border-[1px] rounded-[5px]'>
									<div className='mr-[10px] sm:text-[13px] text-[#0333ae]'>
										<SlCalender />
									</div>
									<div className='w-[80%] flex justify-between items-center'>
										<div className="xl:text-[16px] sm:text-[13px]"><Last7DaysDropdown/></div>
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
							<div className="xl:flex xl:flex-row sm:flex-col xl:justify-center xl:mt-[0px] sm:mt-[-10px] items-center">
							<div className='xl:w-[80px] xl:flex xl:flex-row sm:flex sm:flex-row xl:justify-between sm:justify-start sm:items-end xl:items-center ml-[20px]'>
								<div className='xl:w-[40px] xl:h-[40px] xl:text-[25px] sm:text-[15px] smx:text-[20px] flex justify-center items-center text-[#0333ae]'>
									<CiSettings />
								</div>
								<div className='xl:w-[40px] xl:h-[40px] xl:text-[25px] sm:text-[15px] smx:text-[20px] smx:ml-[10px] flex justify-center items-center text-[#000]'>
									<BiBell />
								</div>
							</div>
							<div className='xl:min-w-[110px] sm:w-[60px] md:w-[120px] xl:flex sm:flex justify-between items-center rounded-[5px] overflow-hidden ml-[20px] sm:mt-[0] smx:mt-[0] xl:mt-[0] md:mt-[10px]'>
								<div className='xl:w-[30px] smx:w-[15px] md:w-[25px] md:h-[25px] xl:h-[30px] smx:h-[10px] sm:w-[10px] smx:mr-[15px] sm:h-[10px] rounded-[50%] bg-orange-600'></div>
								<div className="xl:text-[16px] sm:text-[10px] md:text-[14px]">Dan Casey</div>
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
