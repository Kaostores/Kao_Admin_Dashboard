'use client';

import React, { useState, useEffect } from "react";
import Header from "@/components/blocks/Header";
import { Outlet } from "react-router-dom";
// import Sidebar from "@/components/blocks/Sidebar";
import Sidebar from "../blocks/SIdebar";

const HomeLayout: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Close sidebar when window resizes to desktop
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setIsSidebarOpen(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const closeSidebar = () => {
		setIsSidebarOpen(false);
	};

	return (
		<div className="w-full h-screen relative flex">
			{/* Mobile Sidebar Overlay & Drawer */}
			<div
				className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
					}`}
				onClick={closeSidebar}
			/>

			{/* Mobile Sidebar Drawer */}
			<div
				className={`fixed left-0 top-0 h-full w-64 bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
					} border border-gray-200 hover:border-gray-300 transition-colors`}
			>
				<Sidebar onNavigate={closeSidebar} />
			</div>

			{/* Desktop Sidebar - Always Visible */}
			<div className="hidden lg:block w-64 h-full sticky top-0 left-0">
				<Sidebar />
			</div>

			{/* Main Content Area */}
			<div className="flex-1 h-full relative overflow-x-hidden flex flex-col">
				{/* Header */}
				<div className="w-full bg-[red] h-16 z-40 sticky top-0 right-0 shadow-md">
					<Header 
						onMenuClick={toggleSidebar}
						isSidebarOpen={isSidebarOpen}
					/>
				</div>

				{/* Page Content */}
				<div className="flex-1 w-full overflow-y-auto pt-4 pb-4">
					<div className="flex justify-center px-2 md:px-4">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeLayout;
