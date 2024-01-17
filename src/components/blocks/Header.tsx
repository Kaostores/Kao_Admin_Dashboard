import React,{useState} from 'react'
import pc from "../../assets/ellipse.png"
import { CiHome } from 'react-icons/ci'
import { BiHome } from 'react-icons/bi'
import {IoPeopleOutline} from "react-icons/io5"
import {IoStorefrontOutline} from "react-icons/io5"
import {IoWalletOutline} from "react-icons/io5"
import {IoBriefcaseOutline} from "react-icons/io5"
import { ImAngry } from 'react-icons/im'
import { GoChevronUp } from 'react-icons/go'
import { GoChevronDown } from 'react-icons/go'

const Header = () => {

         const [show,setShow] = useState(true)

         const toggle =()=>{
          setShow(!show)
         }


  return (
            <div className='w-[100%] flex fixed'>
              <div className='w-[100%] h-[100%] flex'>
                 <div className='w-[300px]  flex bg-[#0333ae] items-center flex-col py-[20px] sticky'>
                 <div className='mb-[15px]'>
                  <img src={pc} alt="" />
                </div>
                <div className='w-[100%] h-[60px] bg-[#f5f3f3] flex justify-start items-center pl-[40px] mb-[5px] cursor-pointer'>
                  <div className='text-[25px] text-[#0333ae] font-bold'>
                    <BiHome/>
                  </div>
                  <div className='font-medium text-[#0333ae] text-[20px] ml-[30px] '>Home</div>
                </div>
                <div className='w-[100%] h-[60px] flex justify-start items-center pl-[40px] mb-[5px] cursor-pointer'>
                  <div className='text-[25px] text-[#0333ae] text-white font-bold'>
                    <IoPeopleOutline/>
                  </div>
                  <div className='font-medium text-[#0333ae] text-white text-[20px] ml-[30px] mr-[40px] '>Users</div>
                  <div className='text-[25px] text-[#0333ae] text-white font-bold cursor-pointer' onClick={toggle}>
                    {show ? (
                      <GoChevronDown/>
                    ): (<GoChevronUp/>)}
                  </div>
                </div>
               {show ? (null) : (
                 <div className='w-[100%] flex flex-col justify-center items-center  text-[20px]'>
                 <div className='w-[100%] h-[60px] flex justify-start items-center pl-[98px] mb-[5px]  font-medium text-white cursor-pointer'>Customers</div>
                 <div className='w-[100%] h-[60px] flex justify-start items-center pl-[98px] mb-[5px]  font-medium text-white cursor-pointer'>Agents</div>
               </div>
               )}
                <div className='w-[100%] h-[60px]  flex justify-start items-center pl-[40px] mb-[5px] cursor-pointer'>
                  <div className='text-[25px] text-[#0333ae] text-white font-bold'>
                    <IoStorefrontOutline/>
                  </div>
                  <div className='font-medium text-[#0333ae] text-white text-[20px] ml-[30px]'>Stores</div>
                </div>
                <div className='w-[100%] h-[60px]  flex justify-start items-center pl-[40px] mb-[5px] cursor-pointer'>
                  <div className='text-[25px] text-[#0333ae] text-white font-bold'>
                    <IoBriefcaseOutline/>
                  </div>
                  <div className='font-medium text-[#0333ae] text-white text-[20px] ml-[30px]'>Orders</div>
                </div>
                <div className='w-[100%] h-[60px]  flex justify-start items-center pl-[40px] mb-[5px] cursor-pointer'>
                  <div className='text-[25px] text-[#0333ae] text-white font-bold'>
                    <IoWalletOutline/>
                  </div>
                  <div className='font-medium text-[#0333ae] text-white text-[20px] ml-[30px]'>Wallet</div>
                </div>
                <div className='w-[100%] h-[60px]  flex justify-start items-center pl-[40px] mb-[5px]'>
                  <div className='text-[25px] text-[#0333ae] text-white font-bold'>
                    <ImAngry/>
                  </div>
                  <div className='font-medium text-[#0333ae] text-white text-[20px] ml-[30px]'>Complaints</div>
                </div>
                 <div className='flex w-[100%] h-[60px] justify-center items-center bg-[#7e7c7c] cursor-pointer'>
                  <div className='text-white'>Logout</div>
                 </div>
                 </div>
                 <div className='w-[100%] h-[50px] bg-[#123456] text-white flex'>
                  <div>header</div>
                 </div>
              </div>
            </div>
  )
}

export default Header