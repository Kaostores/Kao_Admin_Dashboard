/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from "react"

import { useRef, useEffect, useState } from "react";
import { SlCalender } from "react-icons/sl";
import { BiPrinter } from "react-icons/bi";
import { HiOutlineFolderDownload } from "react-icons/hi";
import { CiMenuBurger } from "react-icons/ci";
// import { AiOutlineClose } from "react-icons/ai";
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
import { useGetNotificationsQuery } from "@/services/apiSlice";
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
	onMenuClick?: () => void;
	isSidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick}) => {
	const { profileImage } = useProfileImage();
	// const [show3, setShow3] = useState(true);
	const location = useLocation();
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const active = location?.pathname;
	console.log("active", active);

	const { data: userData, isLoading: isUserDataLoading } = useGetUserDataQuery(undefined);
	const { data: notificationsData = { data: [] } } = useGetNotificationsQuery({});
	const notifications = notificationsData.data;
	console.log("Notifications data:", notifications)

	// const toggle3 = () => {
	// 	setShow3(!show3);
	// };

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

	const [notificationsViewed, setNotificationsViewed] = useState(false);
	const [previousNotificationCount, setPreviousNotificationCount] = useState(notifications.length);

	useEffect(() => {
		if (notifications.length > previousNotificationCount) {
			setNotificationsViewed(false);
		}
		setPreviousNotificationCount(notifications.length);
	}, [notifications, previousNotificationCount]);

	const handleNotificationClick = () => {
		setNotificationsViewed(true);
		navigate("/app/admin/notification");
	};

	const unreadNotifications = notificationsViewed ? 0 : notifications.length;

	return (
		<div className='w-full h-full bg-[red]'>
			<div className='w-full h-full flex bg-white flex-col sm:flex-row'>

				{/* Main Header */}
				<div className='w-full h-full flex bg-white justify-between items-center z-10 px-3 sm:px-4 md:px-6'>
					
					{/* Hamburger Menu - Mobile Only */}
					<div className='lg:hidden flex items-center cursor-pointer text-xl flex-shrink-0' onClick={onMenuClick}>
						<CiMenuBurger size={24} />
					</div>

					{/* Left Section - Date Picker (Hidden on small mobile) */}
					<div className='hidden lg:flex flex-1 max-w-xs mx-2 md:mx-4'>
						<div className='w-full h-10 bg-white flex justify-center items-center border border-solid border-gray-300 rounded-md'>
							<div className='mr-2 text-blue-600 flex-shrink-0'>
								<SlCalender />
							</div>
							<div className='flex-1 flex justify-between items-center'>
								<div className='text-xs sm:text-sm md:text-base'>
									<Last7DaysDropdown />
								</div>
							</div>
						</div>
					</div>

					{/* Middle Section - Print & Download (Hidden on Mobile) */}
					<div className='hidden md:flex gap-0 flex-shrink-0'>
						<div className='w-10 h-10 bg-blue-600 flex justify-center items-center text-white text-lg rounded-l-md border border-solid border-gray-300'>
							<BiPrinter />
						</div>
						<div className='w-10 h-10 hidden lg:hidden bg-white justify-center items-center text-blue-600 text-lg rounded-r-md border border-solid border-gray-300 border-l-0'>
							<HiOutlineFolderDownload />
						</div>
					</div>

					{/* Right Section - Icons & Profile */}
					<div className='flex flex-row h-full items-center gap-1 sm:gap-2 md:gap-4 ml-auto flex-shrink-0'>

						{/* Settings Icon - Hidden on Small Mobile */}
						<div className='hidden lg:flex justify-center items-center text-blue-600 flex-shrink-0'>
							<Settings size={20} />
						</div>

						{/* Bell Icon */}
						<div className='flex items-center mr-[12px] justify-center text-black flex-shrink-0'>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button onClick={handleNotificationClick} className="bg-transparent hover:bg-transparent outline-none relative p-0 h-auto" size="icon">
										<Bell size={20} className="text-blue-600" />
										{unreadNotifications > 0 && (
											<span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
												{unreadNotifications}
											</span>
										)}
									</Button>
								</DropdownMenuTrigger>
							</DropdownMenu>
						</div>

						{/* Logout Button - Text on Desktop, Icon on Mobile */}
						<div className='hidden lg:block flex-shrink-0'>
							<Button
								variant="secondary"
								className="bg-white text-blue-600 text-xs sm:text-sm hover:bg-white/90 px-2 sm:px-3 py-2"
								onClick={handleLogout}
							>
								<LogOut className="h-4 w-4" />
								<span className='hidden md:inline ml-1'>Logout</span>
							</Button>
						</div>

						{/* Profile Section */}
						<div className='pl-2 py-1 pr-2 sm:pl-3 sm:py-2 sm:pr-3 md:pl-4 md:py-2 md:pr-4 bg-blue-600 flex items-center gap-1 sm:gap-2 rounded-md overflow-hidden flex-shrink-0'>
							<div className='w-6 h-6 sm:w-7 sm:h-7 overflow-hidden rounded-full bg-white flex-shrink-0'>
								<img src={profileImage || ""} alt="profile" className="w-full h-full object-cover" />
							</div>
							<div className='text-white text-xs sm:text-sm hidden sm:block'>
								{isUserDataLoading ? (
									<Skeleton className="h-3 w-12 sm:w-16" />
								) : (
									userData?.data.firstname
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
