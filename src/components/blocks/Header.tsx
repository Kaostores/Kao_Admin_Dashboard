import React from 'react'
import pc from "../../assets/ellipse.png"
import { CiHome } from 'react-icons/ci'
import { BiHome } from 'react-icons/bi'
import {IoPeopleOutline} from "react-icons/io5"
import {IoStorefront} from "react-icons/io5"
import {IoWallet} from "react-icons/io5"
import {IoBriefcase} from "react-icons/io5"
import { ImAngry } from 'react-icons/im'

const Header = () => {
  return (
            <div className='w-[300px] h-[100vh] flex justify-center items-center bg-[#0333ae]'>
              <div className='w-[100%] h-[100%] flex  items-center flex-col py-[20px]'>
                <div className='mb-[15px]'>
                  <img src={pc} alt="" />
                </div>
                <div className='w-[100%] h-[60px] bg-[#f5f3f3] flex justify-start items-center pl-[50px] mb-[20px]'>
                  <div className='text-[25px] text-[#0333ae] font-bold'>
                    <BiHome/>
                  </div>
                  <div className='font-bold text-[#0333ae] text-[20px] ml-[30px]'>Home</div>
                </div>
                <div className='w-[100%] h-[60px] flex justify-start items-center pl-[50px] mb-[20px]'>
                  <div className='text-[25px] text-[#0333ae] text-white font-bold'>
                    <IoPeopleOutline/>
                  </div>
                  <div className='font-bold text-[#0333ae] text-white text-[20px] ml-[30px]'>Users</div>
                </div>
                <div className='w-[100%] h-[60px]  flex justify-start items-center pl-[50px] mb-[20px]'>
                  <div className='text-[25px] text-[#0333ae] text-white font-bold'>
                    <IoStorefront/>
                  </div>
                  <div className='font-bold text-[#0333ae] text-white text-[20px] ml-[30px]'>Stores</div>
                </div>
                <div className='w-[100%] h-[60px]  flex justify-start items-center pl-[50px] mb-[20px]'>
                  <div className='text-[25px] text-[#0333ae] text-white font-bold'>
                    <IoBriefcase/>
                  </div>
                  <div className='font-bold text-[#0333ae] text-white text-[20px] ml-[30px]'>Orders</div>
                </div>
                <div className='w-[100%] h-[60px]  flex justify-start items-center pl-[50px] mb-[20px]'>
                  <div className='text-[25px] text-[#0333ae] text-white font-bold'>
                    <IoWallet/>
                  </div>
                  <div className='font-bold text-[#0333ae] text-white text-[20px] ml-[30px]'>Wallet</div>
                </div>
                <div className='w-[100%] h-[60px]  flex justify-start items-center pl-[50px] mb-[20px]'>
                  <div className='text-[25px] text-[#0333ae] text-white font-bold'>
                    <ImAngry/>
                  </div>
                  <div className='font-bold text-[#0333ae] text-white text-[20px] ml-[30px]'>Complaint</div>
                </div>
              </div>
            </div>
  )
}

export default Header