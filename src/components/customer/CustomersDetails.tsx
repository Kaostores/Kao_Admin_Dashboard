import React from 'react'
import {VscChromeClose  } from 'react-icons/vsc';
import { BiCamera } from 'react-icons/bi';

type Iprops = {
	togleBtn : any
};

const CustomersDetails: React.FC<Iprops> = ({ togleBtn }) => {
	return (
		<div
			className='w-screen h-[100vh] z-20 flex justify-end bg-[#ffffff1f] fixed left-0 top-0 
backdrop-blur-sm'>
			<div
				className='w-[calc(100%-280px)] h-[calc(100%-70px)] pl-[20px] pt-[20px] flex justify-center 
items-start pb-[30px] mt-[50px]'>
				<div
					className='w-[56%] py-[30px] bg-[#f8f7f7] rounded-[10px] flex justify-center 
items-center border-[1px] border-[#0000ff] border-solid flex-col p-[20px] '>
	                 <div className="w-[100%] flex justify-between items-center">
                        <div className='text-[15px]'>Add Customers</div>
                        <div className='text-[red] cursor-pointer' onClick={togleBtn}>
                            <VscChromeClose/>
                        </div> 
                     </div>
	                 <div className='flex justify-center items-center flex-col mb-[20px]'>
                        <div className='w-[100px] h-[100px] flex justify-center items-center rounded-[50%] bg-[#ddd] text-[35px] text-[#0000ff] mb-[20px]'>
                            <BiCamera/>
                        </div>
                        <div className=' text-[#0000ff] font-semibold'>
                            Customer ID- 0002930
                        </div>
                     </div>
	                 <div className='w-[100%]'>
                        <form action="POST" className='w-[100%] flex flex-col justify-center items-center'>
                           <div className='w-[100%] flex justify-between items-center flex-wrap'>
                           <div className='flex flex-col mb-[10px]'>
                                <label htmlFor="name" className='text-[13px]'>First Name</label>
                                <input type="text" className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                            </div>
                         <div className='flex flex-col mb-[10px]'>
                                <label htmlFor="name"  className='text-[13px]'>Last Name</label>
                                <input type="text" className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                            </div>
                           <div className='flex flex-col mb-[10px]'>
                                <label htmlFor="name" className='text-[13px]'>Phone Number</label>
                                <input type="text" className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                            </div>
                         <div className='flex flex-col mb-[10px]'>
                                <label htmlFor="name"  className='text-[13px]'>Email</label>
                                <input type="text" className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                            </div>
                         <div className='flex flex-col mb-[10px]'>
                                <label htmlFor="name"  className='text-[13px]'>Address</label>
                                <input type="text" className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                            </div>
                           </div>
                           <button className='w-[400px] h-[40px] bg-[#0000ff] text-center mt-[10px] text-white rounded-[5px]'  onClick={togleBtn}>Add Customer</button>
                        </form>
                     </div>
				</div>
			</div>
		</div>
	);
};

export default CustomersDetails