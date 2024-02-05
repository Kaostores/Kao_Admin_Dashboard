import React from "react";

import { VscChromeClose } from "react-icons/vsc";
import { BiCamera } from "react-icons/bi";
import { VscFileSymlinkFile } from "react-icons/vsc";

import Upload from "./UploadDoc";

type Iprops = {
	togleBtn: any;
};

const StoreDetails: React.FC<Iprops> = ({ togleBtn }) => {
	const [show, setShow] = React.useState(false);

	const togBtn = () => {
		setShow(!show);
	};
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
					<div className='w-[100%] flex justify-between items-center'>
						<div className='text-[15px]'>Add Store</div>
						<div className='text-[red] cursor-pointer' onClick={togleBtn}>
							<VscChromeClose />
						</div>
					</div>
					<div className='flex justify-center items-center flex-col mb-[20px]'>
						<div className='w-[100px] h-[100px] flex justify-center items-center rounded-[50%] bg-[#ddd] text-[35px] text-[#0000ff] mb-[20px]'>
							<BiCamera />
						</div>
						<div className=' text-[#0000ff] font-semibold'>
							Store ID- 0002930
						</div>
					</div>
					<div className='w-[100%]'>
						<form className='w-[100%] flex flex-col justify-center items-center'>
							<div className='w-[100%] flex justify-between items-center flex-wrap'>
								<div className='flex flex-col mb-[10px]'>
									<label htmlFor='name' className='text-[13px]'>
										{" "}
										Name
									</label>
									<input
										type='text'
										className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
									/>
								</div>
								<div className='flex flex-col mb-[10px]'>
									<label htmlFor='name' className='text-[13px]'>
										Phone Number
									</label>
									<input
										type='text'
										className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
									/>
								</div>
								<div className='flex flex-col mb-[10px]'>
									<label htmlFor='name' className='text-[13px]'>
										Email
									</label>
									<input
										type='text'
										className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
									/>
								</div>
								<div className='flex flex-col mb-[10px]'>
									<label htmlFor='name' className='text-[13px]'>
										Address
									</label>
									<input
										type='text'
										className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
									/>
								</div>
							</div>
							<div className='w-[100%] flex justify-end'>
								<button
									className='w-[180px] h-[40px] bg-[rgb(0,0,255)] text-center mt-[10px] text-white rounded-[5px] mr-[20px]'
									onClick={togleBtn}>
									Save
								</button>
								<div className='w-[180px] h-[40px] text-[#0000ff] text-center mt-[10px] bg-white rounded-[5px] flex justify-center items-center border-solid border-[1px] border-[#0000ff] cursor-pointer'>
									<div className='mr-[10px] text-[#0000ff]'>
										<VscFileSymlinkFile />
									</div>
									<button
										type='button'
										className='cursor-pointer'
										onClick={togBtn}>
										Upload
									</button>
								</div>
								{/* <span id="selectedFile">{selectedFile?selectedFile : 'No File Selected'}</span> */}
							</div>
						</form>
					</div>
				</div>
			</div>
			{show ? <Upload togleBtn={togBtn} /> : null}
		</div>
	);
};

export default StoreDetails;
