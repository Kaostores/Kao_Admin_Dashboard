import React from "react";
import Header from "@/components/blocks/Header";
import { Outlet } from "react-router-dom";
import Sidebar from "../blocks/SIdebar";

const HomeLayout:React.FC = () => {
	return (
		// <div className="flex">
		// 	<Sidebar />
		// 	<div className='flex justify-end items-end min-h-[100%] '>
		// 		<Header/>
		// 		<Outlet />
		// 	</div>
		// </div>

		<div className="w-full h-screen relative flex">
			<div className="w-64 h-full sticky top-0 left-0">
				<Sidebar />
			</div>
			<div className="flex-1 h-full relative overflow-x-hidden">
				<div className="w-[calc(100%-256px)] h-[70px] z-[50] fixed top-0 right-0 shadow-md">
					<Header />
				</div>
				<div className="flex justify-center">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default HomeLayout;
