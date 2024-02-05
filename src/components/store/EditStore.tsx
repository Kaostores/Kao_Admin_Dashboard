import React from 'react'
import {VscArrowRight, VscChromeClose  } from 'react-icons/vsc';
import { BiCamera } from 'react-icons/bi';
import { VscFileSymlinkFile } from 'react-icons/vsc';
import Upload from './UploadDoc';


type Iprops = {
	togleBtn : any
};

const StoreEdit: React.FC<Iprops> = ({ togleBtn }) => {
  
    const[show,setShow]=React.useState(false);
    const togleBtns=()=>{
        setShow(!show)
    }

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
                        <div className='text-[15px]'>Edit Store</div>
                        <div className='text-[red] cursor-pointer' onClick={togleBtn}>
                            <VscChromeClose/>
                        </div> 
                     </div>
	                 <div className='flex justify-center items-center flex-col mb-[20px]'>
                        <div className='w-[100px] h-[100px] flex justify-center items-center rounded-[50%] bg-[#ddd] text-[35px] text-[#0000ff] mb-[20px]'>
                            <BiCamera/>
                        </div>
                        <div className=' text-[#0000ff] font-semibold'>
                            Store ID- 0002930
                        </div>
                     </div>
	                 <div className='w-[100%]'>
                        <form  className='w-[100%] flex flex-col justify-center items-center'>
                           <div className='w-[100%] flex justify-between items-center flex-wrap'>
                           <div className='flex flex-col mb-[10px]'>
                                <label htmlFor="name" className='text-[13px]'> Name</label>
                                <input type="text" className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                            </div>

                         <div className='flex flex-col mb-[10px]'>
                                <label htmlFor="name"  className='text-[13px]'>Phone Number</label>
                                <input type="text" className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                            </div>
                           <div className='flex flex-col mb-[10px]'>
                                <label htmlFor="name" className='text-[13px]'> Address</label>
                                <input type="text" className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                            </div>

                         <div className='flex flex-col mb-[10px]'>
                            <div className='w-[100%] flex justify-between items-center'>
                              <div>
                              <label htmlFor="name"  className='text-[13px] flex'>
                                   <div className='text-[16px] text-[#0000ff] mr-[px]'><VscFileSymlinkFile/></div> 
                                    Upload</label>
                              </div>
                              <div className='text-[#0000ff] cursor-pointer' onClick={togleBtns}>
                                <VscArrowRight/>
                              </div>
                              </div>
                                <input type="text" className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                            </div>
                            <div className='w-[100%] flex justify-end mt-[5px]'>
                                <button className='bg-[#0000ff] text-white px-[25px] py-[5px] rounded-[5px]'>Save</button>
                            </div>
                           </div>
                        </form>
                     </div>
				</div>
			</div>
            {
                show ? (
                    <div>
                        <Upload togleBtn={togleBtns}/>
                    </div>
                ) : null
            }
		</div>
	);
};

export default StoreEdit;