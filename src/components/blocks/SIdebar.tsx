// import pc from "../../assets/ellipse.png";
// import {  useLocation, useNavigate } from "react-router-dom";
// import { BiHome } from "react-icons/bi";
// import { IoPeopleOutline } from "react-icons/io5";
// import { IoStorefrontOutline } from "react-icons/io5";
// import { IoWalletOutline } from "react-icons/io5";
// import { IoBriefcaseOutline } from "react-icons/io5";
// import { ImAngry } from "react-icons/im";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import { logoutUser } from "@/services/reducers";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import { useRef, useEffect, useState } from "react";
// import { useProfileImage } from '@/pages/Settings/ProfileImageContext';
// import { CiBoxList } from "react-icons/ci";
// import { GoPlus } from "react-icons/go";

// const Sidebar = () => {

//     const location = useLocation();
// 	const navigate = useNavigate();
// 	const active = location?.pathname;
// 	// console.log("active", active);
//     const { profileImage } = useProfileImage();

//     const dispatch = useDispatch()

//     const handleLogout = () => {
// 		dispatch(logoutUser());
// 		toast.success("You have logged out successfully", {
// 			autoClose: 3000,
// 			closeButton: true,
// 			onClose: () => {
// 				navigate("/signin")
// 			}
// 		})
//     }
    
//     const [activeIndex, setActiveIndex] = useState<number | null>(null);
//     const contentHeight1 = useRef<any>(null);
// 	const contentHeight2 = useRef<any>(null);
// 	const contentHeight3 = useRef<any>(null);
//     const contentHeight4 = useRef<any>(null);
//     const contentHeight5 = useRef<any>(null);
    
//     useEffect(() => {
//     if (contentHeight1.current) {
//       contentHeight1.current.style.height =
//         activeIndex === 1 ? `${contentHeight1.current.scrollHeight}px` : "0px";
//     }
//     if (contentHeight2.current) {
//       contentHeight2.current.style.height =
//         activeIndex === 2 ? `${contentHeight2.current.scrollHeight}px` : "0px";
//     }
//     if (contentHeight3.current) {
//       contentHeight3.current.style.height =
//         activeIndex === 3 ? `${contentHeight3.current.scrollHeight}px` : "0px";
//     }
//     if (contentHeight4.current) {
//       contentHeight4.current.style.height =
//         activeIndex === 4 ? `${contentHeight4.current.scrollHeight}px` : "0px";
//     }
//     if (contentHeight5.current) {
//       contentHeight5.current.style.height =
//         activeIndex === 5 ? `${contentHeight5.current.scrollHeight}px` : "0px";
//     }
//     }, [activeIndex]);
    
//     const handleItemClick = (index: number) => {
//     	setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
//   	};

//   return (
//     <div className="w-[100%] h-[100%] relative bg-[#0333ae] items-center justify-start flex-col py-[20px]">
//         <div className="mb-[15px] w-[100%] justify-center flex">
//             <div className="w-[120px] h-[120px] rounded-full overflow-hidden">
//                 <img src={profileImage || pc}  alt='' className='w-[100%] h-[100%] object-cover' />
//             </div>
//         </div>
        
//         <div className="w-[100%] h-[73%] overflow-y-scroll">
//             <div
//             onClick={() => {
//                 navigate("/app/admin")
//             }}
//             className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin" ? "bg-white text-[#0333ae]" : "text-white"}`}
//         >
//             <div className="text-[25px] font-bold">
//                 <BiHome />
//             </div>
//             <div className="font-[600] text-[17px] ml-[20px]">
//                 Home
//             </div>
//             </div>

//         <div className="overflow-hidden">
//             <div
//                 className={`w-full min-h-[55px] flex justify-between items-center text-[#fff] font-[600] cursor-pointer pl-[20px] pr-[20px]`}
//                 onClick={() => handleItemClick(1)}
//             >
//                 <div className="flex items-center">
//                     <IoPeopleOutline className="text-[25px]"/>
//                     <h3 className="text-[17px] ml-[20px] font-bold">
//                         Users
//                     </h3>
//                 </div>
                
//                 <RiArrowDropDownLine
//                     className={`text-[30px] transition-transform duration-500 ${
//                         activeIndex === 1 ? "rotate-180" : ""
//                     }`} 
//                 />
//             </div>
            
//             <div
//                 ref={contentHeight1}
//                 className="transition-height duration-700"
//                 style={{
//                     height: activeIndex === 1 ? `${contentHeight1.current.scrollHeight}px` : "0px"
//                 }}
//             >
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/vendors")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/vendors" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         Vendors
//                     </div>
//                 </div>
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/agents")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/agents" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         Agents
//                     </div>
//                 </div>
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/customers")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/customers" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         Customers
//                     </div>
//                 </div>
//             </div>
//         </div>

//         <div className="overflow-hidden">
//             <div
//                 className={`w-full min-h-[55px] flex justify-between items-center text-[#fff] font-[600] cursor-pointer pl-[20px] pr-[20px]`}
//                 onClick={() => handleItemClick(2)}
//             >
//                 <div className="flex items-center">
//                     <CiBoxList size={23}/>
//                     <h3 className="text-base ml-[20px] font-bold">
//                         Categories
//                     </h3>
//                 </div>
                
//                 <RiArrowDropDownLine
//                     className={`text-[30px] transition-transform duration-500 ${
//                         activeIndex === 2 ? "rotate-180" : ""
//                     }`} 
//                 />
//             </div>
            
//             <div
//                 ref={contentHeight2}
//                 className="transition-height duration-700 pl-5"
//                 style={{
//                     height: activeIndex === 2 ? `${contentHeight2.current.scrollHeight}px` : "0px"
//                 }}
//             >
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/create-categories")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/create-categories" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div>
//                         <IoPeopleOutline size={18}/>
//                     </div>
//                     <div className="font-[600] text-sm ml-3">
//                         Create
//                     </div>
//                 </div>
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/category-lists")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/category-lists" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         Category List
//                     </div>
//                 </div>
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/categories&sub-categories")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/categories&sub-categories" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         Categories & Subs
//                     </div>
//                 </div>
//             </div>
//         </div>
        

//         <div className="overflow-hidden">
//             <div
//                 className={`w-full min-h-[55px] flex justify-between items-center text-[#fff] font-[600] cursor-pointer pl-[20px] pr-[20px]`}
//                 onClick={() => handleItemClick(3)}
//             >
//                 <div className="flex items-center">
//                     <IoPeopleOutline className="text-[25px]"/>
//                     <h3 className="text-[17px] ml-[20px] font-bold">
//                         Coupon
//                     </h3>
//                 </div>
                
//                 <RiArrowDropDownLine
//                     className={`text-[30px] transition-transform duration-500 ${
//                         activeIndex === 3 ? "rotate-180" : ""
//                     }`} 
//                 />
//             </div>
            
//             <div
//                 ref={contentHeight3}
//                 className="transition-height duration-700"
//                 style={{
//                     height: activeIndex === 3 ? `${contentHeight1.current.scrollHeight}px` : "0px"
//                 }}
//             >
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/coupon")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/coupon" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         Create
//                     </div>
//                 </div>
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/coupon-list")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/coupon-list" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         Coupon List
//                     </div>
//                 </div>
//             </div>
//         </div>

//         <div className="overflow-hidden">
//             <div
//                 className={`w-full min-h-[55px] flex justify-between items-center text-[#fff] font-[600] cursor-pointer pl-[20px] pr-[20px]`}
//                 onClick={() => handleItemClick(4)}
//             >
//                 <div className="flex items-center">
//                     <IoPeopleOutline className="text-[25px]"/>
//                     <h3 className="text-[17px] ml-[20px] font-bold">
//                         Brand
//                     </h3>
//                 </div>
                
//                 <RiArrowDropDownLine
//                     className={`text-[30px] transition-transform duration-500 ${
//                         activeIndex === 4 ? "rotate-180" : ""
//                     }`} 
//                 />
//             </div>
            
//             <div
//                 ref={contentHeight4}
//                 className="transition-height duration-700"
//                 style={{
//                     height: activeIndex === 4 ? `${contentHeight1.current.scrollHeight}px` : "0px"
//                 }}
//             >
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/brand")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/brand" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         Create
//                     </div>
//                 </div>
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/brand-list")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/brand-list" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         Brand List
//                     </div>
//                 </div>
//             </div>
//         </div>

//         <div
//             onClick={() => {
//                 navigate("/app/admin/stores")
//             }}
//             className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/stores" ? "bg-white text-[#0333ae]" : "text-white"}`}
//         >
//             <div className="text-[25px] font-bold">
//                 <IoStorefrontOutline />
//             </div>
//             <div className="font-[600] text-[17px] ml-[20px]">
//                 Stores
//             </div>
//         </div>

//         <div
//             onClick={() => {
//                 navigate("/app/admin/orders")
//             }}
//             className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/orders" ? "bg-white text-[#0333ae]" : "text-white"}`}
//         >
//             <div className="text-[25px] font-bold">
//                 <IoBriefcaseOutline />
//             </div>
//             <div className="font-[600] text-[17px] ml-[20px]">
//                 Orders
//             </div>
//         </div>

//         <div
//             onClick={() => {
//                 navigate("/app/admin/wallet")
//             }}
//             className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/wallet" ? "bg-white text-[#0333ae]" : "text-white"}`}
//         >
//             <div className="text-[25px] font-bold">
//                 <IoWalletOutline />
//             </div>
//             <div className="font-[600] text-[17px] ml-[20px]">
//                 Wallet
//             </div>
//         </div>

//         <div
//             onClick={() => {
//                 navigate("/app/admin/complaints")
//             }}
//             className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/complaints" ? "bg-white text-[#0333ae]" : "text-white"}`}
//         >
//             <div className="text-[25px] font-bold">
//                 <ImAngry />
//             </div>
//             <div className="font-[600] text-[17px] ml-[20px]">
//                 Complaints
//             </div>
//         </div>

//         <div
//             onClick={() => {
//                 navigate("/app/admin/settings")
//             }}
//             className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/settings" ? "bg-white text-[#0333ae]" : "text-white"}`}
//         >
//             <div className="text-[25px] font-bold">
//                 <ImAngry />
//             </div>
//             <div className="font-[600] text-[17px] ml-[20px]">
//                 Settings
//             </div>
//         </div>

//         <div className="overflow-hidden">
//             <div
//                 className={`w-full min-h-[55px] flex justify-between items-center text-[#fff] font-[600] cursor-pointer pl-[20px] pr-[20px]`}
//                 onClick={() => handleItemClick(5)}
//             >
//                 <div className="flex items-center">
//                     <IoPeopleOutline className="text-[25px]"/>
//                     <h3 className="text-[17px] ml-[20px] font-bold">
//                         Spotlight
//                     </h3>
//                 </div>
                
//                 <RiArrowDropDownLine
//                     className={`text-[30px] transition-transform duration-500 ${
//                         activeIndex === 5 ? "rotate-180" : ""
//                     }`} 
//                 />
//             </div>
            
//             <div
//                 ref={contentHeight5}
//                 className="transition-height duration-700"
//                 style={{
//                     height: activeIndex === 5 ? `${contentHeight1.current.scrollHeight}px` : "0px"
//                 }}
//             >
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/add-spotlight")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/add-spotlight" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         Add spotlight
//                     </div>
//                 </div>
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/spotlight-by-store")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/spotlight-by-store" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         Spotlight by store
//                     </div>
//                 </div>
//                 <div
//                     onClick={() => {
//                         navigate("/app/admin/allspotlight")
//                     }}
//                     className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/allspotlight" ? "bg-white text-[#0333ae]" : "text-white"}`} 
//                 >
//                     <div className="text-[17px]">
//                         <IoPeopleOutline />
//                     </div>
//                     <div className="font-[600] text-[15px] ml-[20px]">
//                         All Spotlights
//                     </div>
//                 </div>
//             </div>
//         </div>

//         </div>
        
//         <div
//             onClick={handleLogout}
//             className="flex w-[100%] min-h-[55px] justify-center items-center bg-[#7e7c7c] cursor-pointer absolute bottom-0"
//         >
//             <div className='text-white'>Logout</div>
//         </div>
//     </div>
//   )
// }

// export default Sidebar


"use client"

import { useState } from "react"
import pc from "../../assets/ellipse.png"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { logoutUser } from "@/services/reducers"
import { useProfileImage } from '@/pages/Settings/ProfileImageContext'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Home,
  Users,
  Store,
  Wallet,
  Briefcase,
  Frown,
  Settings,
  LogOut,
  Plus,
  List,
} from "lucide-react"

type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  { title: "Home", href: "/app/admin", icon: <Home className="h-5 w-5" /> },
  {
    title: "Users",
    href: "#",
    icon: <Users className="h-5 w-5" />,
    submenu: [
      { title: "Vendors", href: "/app/admin/vendors" },
      { title: "Agents", href: "/app/admin/agents" },
      { title: "Customers", href: "/app/admin/customers" },
    ],
  },
  {
    title: "Categories",
    href: "#",
    icon: <List className="h-5 w-5" />,
    submenu: [
      { title: "Create", href: "/app/admin/create-categories" },
      { title: "Categories", href: "/app/admin/category-lists" },
      { title: "Categories & Subs", href: "/app/admin/categories&sub-categories" },
    ],
  },
  {
    title: "Coupon",
    href: "#",
    icon: <Plus className="h-5 w-5" />,
    submenu: [
      { title: "Create", href: "/app/admin/coupon" },
      { title: "Coupons", href: "/app/admin/coupon-list" },
    ],
  },
  {
    title: "Brand",
    href: "#",
    icon: <Store className="h-5 w-5" />,
    submenu: [
      { title: "Create", href: "/app/admin/brand" },
      { title: "Brands", href: "/app/admin/brand-list" },
    ],
  },
  { title: "Stores", href: "/app/admin/stores", icon: <Store className="h-5 w-5" /> },
  { title: "Orders", href: "/app/admin/orders", icon: <Briefcase className="h-5 w-5" /> },
  { title: "Wallet", href: "/app/admin/wallet", icon: <Wallet className="h-5 w-5" /> },
  { title: "Complaints", href: "/app/admin/complaints", icon: <Frown className="h-5 w-5" /> },
  { title: "Settings", href: "/app/admin/settings", icon: <Settings className="h-5 w-5" /> },
  {
    title: "Spotlight",
    href: "#",
    icon: <Plus className="h-5 w-5" />,
    submenu: [
      { title: "Add spotlight", href: "/app/admin/add-spotlight" },
      { title: "Spotlight by store", href: "/app/admin/spotlight-by-store" },
      { title: "All Spotlights", href: "/app/admin/allspotlight" },
    ],
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { profileImage } = useProfileImage()
  const [openAccordions, setOpenAccordions] = useState<string[]>([])

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

  const handleAccordionChange = (value: string) => {
    setOpenAccordions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  return (
    <div className="flex h-full w-64 flex-col bg-[#0333ae] text-white">
      <div className="flex items-center justify-center p-6">
        <div className="mb-[15px] w-[100%] justify-center flex">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden">
            <img src={profileImage || pc} alt='' className='w-[100%] h-[100%] object-cover' />
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <Accordion
          type="multiple"
          value={openAccordions}
          onValueChange={setOpenAccordions}
          className="w-full space-y-2"
        >
          {navItems.map((item, index) => (
            <AccordionItem value={item.title} key={index} className="border-none">
              {item.submenu ? (
                <AccordionTrigger
                  onClick={() => handleAccordionChange(item.title)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/10",
                    openAccordions.includes(item.title) && "bg-white/10"
                  )}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3 text-sm font-medium hover:text-[#fff] hover:no-underline">{item.title}</span>
                  </div>
                  {/* <ChevronDown className="h-4 w-4 transition-transform duration-200" /> */}
                </AccordionTrigger>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-white/10 hover:text-[#fff] px-3",
                    location.pathname === item.href && "bg-white hover:bg-white hover:text-[#0333ae] text-[#0333ae]"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  {item.icon}
                  <span className="ml-3 text-sm font-medium">{item.title}</span>
                </Button>
              )}
              {item.submenu && (
                <AccordionContent>
                  <div className="ml-6 space-y-1 mt-[8px]">
                    {item.submenu.map((subItem, subIndex) => (
                      <Button
                        key={subIndex}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-white hover:bg-white/10 hover:text-white",
                          location.pathname === subItem.href && "bg-white text-[#0333ae] hover:bg-white hover:text-[#0333ae]"
                        )}
                        onClick={() => navigate(subItem.href)}
                      >
                        <span className="text-sm">{subItem.title}</span>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
      <div className="p-3">
        <Button
          variant="secondary"
          className="w-full bg-white text-[#0333ae] hover:bg-white/90"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}