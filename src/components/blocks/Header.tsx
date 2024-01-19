import React, { useState } from "react";
import pc from "../../assets/ellipse.png";
import { CiHome } from "react-icons/ci";
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

const Header = () => {
	const [show, setShow] = useState(true);
	const [show2, setShow2] = useState(true);

	const toggle = () => {
		setShow(!show);
	};
	const toggle2 = () => {
		setShow2(!show2);
	};

	return (
		<div className='w-[100%] flex fixed'>
			<div className='w-[100%] h-[100%] flex bg-red '>
				<div className='min-w-[280px] h-[100vh] flex bg-[#0333ae] items-center justify-start flex-col py-[20px]'>
					<div className='mb-[15px] '>
						<img src={pc} alt='' className='w-[60%]' />
					</div>
					<div className='w-[100%] min-h-[55px] bg-[#f5f3f3] flex justify-start items-center pl-[40px] mb-[5px] cursor-pointer'>
						<div className='text-[20px] text-[#0333ae] font-bold'>
							<BiHome />
						</div>
						<div className='font-medium text-[#0333ae] text-[18px] ml-[30px] '>
							Home
						</div>
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
							<div className='w-[100%] min-h-[5px] flex justify-start items-center pl-[90px] mb-[10px]  font-medium text-white cursor-pointer text-[18px]'>
								Customers
							</div>
							<div className='w-[100%] min-h-[5px] flex justify-start items-center pl-[90px] mb-[10px]  font-medium text-white cursor-pointer text-[18px]'>
								Agents
							</div>
						</div>
					)}
					<div className='w-[100%] min-h-[55px]  flex justify-start items-center pl-[40px] mb-[5px] cursor-pointer'>
						<div className='text-[20px] text-[#0333ae] text-white font-bold'>
							<IoStorefrontOutline />
						</div>
						<div className='font-medium text-[#0333ae] text-white text-[18px] ml-[30px]'>
							Stores
						</div>
					</div>
					<div className='w-[100%] min-h-[55px]  flex justify-start items-center pl-[40px] mb-[5px] cursor-pointer'>
						<div className='text-[25px] text-[#0333ae] text-white font-bold'>
							<IoBriefcaseOutline />
						</div>
						<div className='font-medium text-[#0333ae] text-white text-[18px] ml-[30px]'>
							Orders
						</div>
					</div>
					<div className='w-[100%] min-h-[55px]  flex justify-start items-center pl-[40px] mb-[5px] cursor-pointer'>
						<div className='text-[20px] text-[#0333ae] text-white font-bold'>
							<IoWalletOutline />
						</div>
						<div className='font-medium text-[#0333ae] text-white text-[18px] ml-[30px]'>
							Wallet
						</div>
					</div>
					<div className='w-[100%] min-h-[55px]  flex justify-start items-center pl-[40px] mb-[5px]'>
						<div className='text-[20px] text-[#0333ae] text-white font-bold'>
							<ImAngry />
						</div>
						<div className='font-medium text-[#0333ae] text-white text-[18px] ml-[30px]'>
							Complaints
						</div>
					</div>
					<div className='flex w-[100%] min-h-[55px] justify-center items-center bg-[#7e7c7c] cursor-pointer'>
						<div className='text-white'>Logout</div>
					</div>
				</div>
				<div  className='w-[100%] h-[70px] z-50  flex bg-[#fff] justify-end items-center shadow-md'>
					<div className='w-[100%] h-[40px] flex  justify-center items-center'>
						<div className=' w-[90%] h-[100%] flex justify-between items-start'>
							<div className='w-[250px] h-[40px] bg-white border-solid mr-[15px] border-[#9ea0a0] border-[1px] flex justify-center items-center rounded-[5px]'>
								<div className='mr-[10px] text-[#0333ae]'>
									<BiSearch />
								</div>
								<div className='w-[85%] h-[100%]'>
									<input
										type='text'
										placeholder='Search'
										className='w-[100%] h-[100%] pl-[5px] outline-none border-0 bg-transparent'
									/>
								</div>
							</div>
							<div className=' w-[250px]  min-h-[100px] flex justify-between flex-col items-center'>
								<div className='w-[100%] min-h-[40px] bg-white  flex justify-center items-center border-solid border-[#9ea0a0] border-[1px] rounded-[5px]'>
									<div className='mr-[10px] text-[#0333ae]'>
										<SlCalender />
									</div>
									<div className='w-[80%] flex justify-between items-center'>
										<div>Last 7 days</div>
										{show2 ? (
											<div className='cursor-pointer' onClick={toggle2}>
												<GoChevronDown />
											</div>
										) : (
											<div className='cursor-pointer' onClick={toggle2}>
												<GoChevronUp />
											</div>
										)}
									</div>
								</div>
								{show2 ? null : (
									<div className='w-[100%] min-h-[50px] bg-white border-[1px] border-black border-solid'></div>
								)}
							</div>
							<div className='w-80px flex justify-center items-center rounded-[5px] overflow-hidden ml-[20px] border-solid border-[#9ea0a0] border-[1px]'>
								<div className='w-[40px] h-[40px] bg-[#0333ae] flex justify-center items-center text-white'>
									<BiPrinter />
								</div>
								<div className='w-[40px] h-[40px] bg-[#fff] flex justify-center items-center text-[#0333ae]'>
									<HiOutlineFolderDownload />
								</div>
							</div>
							<div className='w-80px flex justify-between items-center ml-[20px]'>
								<div className='w-[40px] h-[40px] text-[25px] flex justify-center items-center text-[#0333ae]'>
									<CiSettings />
								</div>
								<div className='w-[40px] h-[40px] text-[20px] flex justify-center items-center text-[#000]'>
									<BiBell />
								</div>
							</div>
							<div className='min-w-[110px] flex justify-between items-center rounded-[5px] overflow-hidden ml-[20px]'>
								<div className='w-[30px] h-[30px] rounded-[50%] bg-orange-600'></div>
								<div>Dan Casey</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
