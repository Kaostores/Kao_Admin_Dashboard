import pc from "../../assets/ellipse.png";
import {  useLocation, useNavigate } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { IoPeopleOutline } from "react-icons/io5";
import { IoStorefrontOutline } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
import { IoBriefcaseOutline } from "react-icons/io5";
import { ImAngry } from "react-icons/im";
import { RiArrowDropDownLine } from "react-icons/ri";
import { logoutUser } from "@/services/reducers";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRef, useEffect, useState } from "react";

const Sidebar = () => {

    const location = useLocation();
	const navigate = useNavigate();
	const active = location?.pathname;
	console.log("active", active);

    const dispatch = useDispatch()

    const handleLogout = () => {
		dispatch(logoutUser());
		toast.success("You have logged out successfully", {
			autoClose: 3000,
			closeButton: true,
			onClose: () => {
				navigate("/signin")
			}
		})
    }
    
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const contentHeight1 = useRef<any>(null);
	const contentHeight2 = useRef<any>(null);
	const contentHeight3 = useRef<any>(null);
    const contentHeight4 = useRef<any>(null);
    const contentHeight5 = useRef<any>(null);
    
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
    if (contentHeight5.current) {
      contentHeight5.current.style.height =
        activeIndex === 5 ? `${contentHeight5.current.scrollHeight}px` : "0px";
    }
    }, [activeIndex]);
    
    const handleItemClick = (index: number) => {
    	setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  	};

  return (
    <div className="w-[100%] h-[100%] relative bg-[#0333ae] items-center justify-start flex-col py-[20px]">
        <div className="mb-[15px] w-[100%] justify-center flex">
            <img src={pc} alt='' className='w-[40%]' />
        </div>
        
        <div className="w-[100%] h-[73%] overflow-y-scroll">
            <div
            onClick={() => {
                navigate("/app/admin")
            }}
            className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin" ? "bg-white text-[#0333ae]" : "text-white"}`}
        >
            <div className="text-[25px] font-bold">
                <BiHome />
            </div>
            <div className="font-[600] text-[17px] ml-[20px]">
                Home
            </div>
            </div>

        <div className="overflow-hidden">
            <div
                className={`w-full min-h-[55px] flex justify-between items-center text-[#fff] font-[600] cursor-pointer pl-[20px] pr-[20px]`}
                onClick={() => handleItemClick(1)}
            >
                <div className="flex items-center">
                    <IoPeopleOutline className="text-[25px]"/>
                    <h3 className="text-[17px] ml-[20px] font-bold">
                        Users
                    </h3>
                </div>
                
                <RiArrowDropDownLine
                    className={`text-[30px] transition-transform duration-500 ${
                        activeIndex === 1 ? "rotate-180" : ""
                    }`} 
                />
            </div>
            
            <div
                ref={contentHeight1}
                className="transition-height duration-700"
                style={{
                    height: activeIndex === 1 ? `${contentHeight1.current.scrollHeight}px` : "0px"
                }}
            >
                <div
                    onClick={() => {
                        navigate("/app/admin/vendors")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/vendors" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Vendors
                    </div>
                </div>
                <div
                    onClick={() => {
                        navigate("/app/admin/agents")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/agents" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Agents
                    </div>
                </div>
                <div
                    onClick={() => {
                        navigate("/app/admin/customers")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/customers" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Customers
                    </div>
                </div>
            </div>
        </div>

        <div className="overflow-hidden">
            <div
                className={`w-full min-h-[55px] flex justify-between items-center text-[#fff] font-[600] cursor-pointer pl-[20px] pr-[20px]`}
                onClick={() => handleItemClick(2)}
            >
                <div className="flex items-center">
                    <IoPeopleOutline className="text-[25px]"/>
                    <h3 className="text-[17px] ml-[20px] font-bold">
                        Categories
                    </h3>
                </div>
                
                <RiArrowDropDownLine
                    className={`text-[30px] transition-transform duration-500 ${
                        activeIndex === 2 ? "rotate-180" : ""
                    }`} 
                />
            </div>
            
            <div
                ref={contentHeight2}
                className="transition-height duration-700"
                style={{
                    height: activeIndex === 2 ? `${contentHeight2.current.scrollHeight}px` : "0px"
                }}
            >
                <div
                    onClick={() => {
                        navigate("/app/admin/create-categories")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/create-categories" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Create
                    </div>
                </div>
                <div
                    onClick={() => {
                        navigate("/app/admin/category-lists")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/category-lists" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Category List
                    </div>
                </div>
                <div
                    onClick={() => {
                        navigate("/app/admin/categories&sub-categories")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/categories&sub-categories" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Categories & Subs
                    </div>
                </div>
            </div>
        </div>
        

        <div className="overflow-hidden">
            <div
                className={`w-full min-h-[55px] flex justify-between items-center text-[#fff] font-[600] cursor-pointer pl-[20px] pr-[20px]`}
                onClick={() => handleItemClick(3)}
            >
                <div className="flex items-center">
                    <IoPeopleOutline className="text-[25px]"/>
                    <h3 className="text-[17px] ml-[20px] font-bold">
                        Coupon
                    </h3>
                </div>
                
                <RiArrowDropDownLine
                    className={`text-[30px] transition-transform duration-500 ${
                        activeIndex === 3 ? "rotate-180" : ""
                    }`} 
                />
            </div>
            
            <div
                ref={contentHeight3}
                className="transition-height duration-700"
                style={{
                    height: activeIndex === 3 ? `${contentHeight1.current.scrollHeight}px` : "0px"
                }}
            >
                <div
                    onClick={() => {
                        navigate("/app/admin/coupon")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/coupon" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Create
                    </div>
                </div>
                <div
                    onClick={() => {
                        navigate("/app/admin/coupon-list")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/coupon-list" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Coupon List
                    </div>
                </div>
            </div>
        </div>

        <div className="overflow-hidden">
            <div
                className={`w-full min-h-[55px] flex justify-between items-center text-[#fff] font-[600] cursor-pointer pl-[20px] pr-[20px]`}
                onClick={() => handleItemClick(4)}
            >
                <div className="flex items-center">
                    <IoPeopleOutline className="text-[25px]"/>
                    <h3 className="text-[17px] ml-[20px] font-bold">
                        Brand
                    </h3>
                </div>
                
                <RiArrowDropDownLine
                    className={`text-[30px] transition-transform duration-500 ${
                        activeIndex === 4 ? "rotate-180" : ""
                    }`} 
                />
            </div>
            
            <div
                ref={contentHeight4}
                className="transition-height duration-700"
                style={{
                    height: activeIndex === 4 ? `${contentHeight1.current.scrollHeight}px` : "0px"
                }}
            >
                <div
                    onClick={() => {
                        navigate("/app/admin/brand")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/brand" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Create
                    </div>
                </div>
                <div
                    onClick={() => {
                        navigate("/app/admin/brand-list")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/brand-list" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Brand List
                    </div>
                </div>
            </div>
        </div>

        <div
            onClick={() => {
                navigate("/app/admin/stores")
            }}
            className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/stores" ? "bg-white text-[#0333ae]" : "text-white"}`}
        >
            <div className="text-[25px] font-bold">
                <IoStorefrontOutline />
            </div>
            <div className="font-[600] text-[17px] ml-[20px]">
                Stores
            </div>
        </div>

        <div
            onClick={() => {
                navigate("/app/admin/orders")
            }}
            className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/orders" ? "bg-white text-[#0333ae]" : "text-white"}`}
        >
            <div className="text-[25px] font-bold">
                <IoBriefcaseOutline />
            </div>
            <div className="font-[600] text-[17px] ml-[20px]">
                Orders
            </div>
        </div>

        <div
            onClick={() => {
                navigate("/app/admin/wallet")
            }}
            className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/wallet" ? "bg-white text-[#0333ae]" : "text-white"}`}
        >
            <div className="text-[25px] font-bold">
                <IoWalletOutline />
            </div>
            <div className="font-[600] text-[17px] ml-[20px]">
                Wallet
            </div>
        </div>

        <div
            onClick={() => {
                navigate("/app/admin/complaints")
            }}
            className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/complaints" ? "bg-white text-[#0333ae]" : "text-white"}`}
        >
            <div className="text-[25px] font-bold">
                <ImAngry />
            </div>
            <div className="font-[600] text-[17px] ml-[20px]">
                Complaints
            </div>
        </div>

        <div
            onClick={() => {
                navigate("/app/admin/settings")
            }}
            className={`w-full min-h-[55px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/settings" ? "bg-white text-[#0333ae]" : "text-white"}`}
        >
            <div className="text-[25px] font-bold">
                <ImAngry />
            </div>
            <div className="font-[600] text-[17px] ml-[20px]">
                Settings
            </div>
        </div>

        <div className="overflow-hidden">
            <div
                className={`w-full min-h-[55px] flex justify-between items-center text-[#fff] font-[600] cursor-pointer pl-[20px] pr-[20px]`}
                onClick={() => handleItemClick(5)}
            >
                <div className="flex items-center">
                    <IoPeopleOutline className="text-[25px]"/>
                    <h3 className="text-[17px] ml-[20px] font-bold">
                        Spotlight
                    </h3>
                </div>
                
                <RiArrowDropDownLine
                    className={`text-[30px] transition-transform duration-500 ${
                        activeIndex === 5 ? "rotate-180" : ""
                    }`} 
                />
            </div>
            
            <div
                ref={contentHeight5}
                className="transition-height duration-700"
                style={{
                    height: activeIndex === 5 ? `${contentHeight1.current.scrollHeight}px` : "0px"
                }}
            >
                <div
                    onClick={() => {
                        navigate("/app/admin/add-spotlight")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/add-spotlight" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Add spotlight
                    </div>
                </div>
                <div
                    onClick={() => {
                        navigate("/app/admin/spotlight-by-store")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/spotlight-by-store" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        Spotlight by store
                    </div>
                </div>
                <div
                    onClick={() => {
                        navigate("/app/admin/allspotlight")
                    }}
                    className={`w-full min-h-[40px] flex justify-start  items-center pl-[20px] mb-[5px] cursor-pointer ${active === "/app/admin/allspotlight" ? "bg-white text-[#0333ae]" : "text-white"}`} 
                >
                    <div className="text-[17px]">
                        <IoPeopleOutline />
                    </div>
                    <div className="font-[600] text-[15px] ml-[20px]">
                        All Spotlights
                    </div>
                </div>
            </div>
        </div>

        </div>
        
        <div
            onClick={handleLogout}
            className="flex w-[100%] min-h-[55px] justify-center items-center bg-[#7e7c7c] cursor-pointer absolute bottom-0"
        >
            <div className='text-white'>Logout</div>
        </div>
    </div>
  )
}

export default Sidebar