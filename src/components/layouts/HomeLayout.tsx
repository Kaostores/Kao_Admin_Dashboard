import React from "react";
import Header from "@/components/blocks/Header";
import { Outlet } from "react-router-dom";

const HomeLayout:React.FC = () => {
	return (
		<div>
			<Header/>
			<div className='flex justify-end items-end min-h-[100%] '>
				<Outlet />
			</div>
		</div>
	);
};

export default HomeLayout;
