import React from "react";
import { VscChromeClose } from "react-icons/vsc";

import { VscFileSymlinkFile } from "react-icons/vsc";

type Iprops = {
	togleBtn: any;
};

const Upload: React.FC<Iprops> = ({ togleBtn }) => {
	const [fileName, setFileName] = React.useState(
		"Upload the title document here",
	);
	const [fileName2, setFileName2] = React.useState(
		"Upload the title document here",
	);
	const [fileName3, setFileName3] = React.useState(
		"Upload the title document here",
	);
	const [fileName4, setFileName4] = React.useState(
		"Upload the title document here",
	);

	const handleFileChange = (e: any) => {
		const fileInput = e.target;
		if (fileInput?.files.length > 0) {
			setFileName(fileInput?.files[0].name);
		} else {
			setFileName("Upload the title document here");
		}
	};
	const handleFileChange2 = (e: any) => {
		const fileInput2 = e.target;
		if (fileInput2?.files.length > 0) {
			setFileName2(fileInput2?.files[0].name);
		} else {
			setFileName2("Upload the title document here");
		}
	};
	const handleFileChange3 = (e: any) => {
		const fileInput = e.target;
		if (fileInput?.files.length > 0) {
			setFileName3(fileInput?.files[0].name);
		} else {
			setFileName3("Upload the title document here");
		}
	};
	const handleFileChange4 = (e: any) => {
		const fileInput = e.target;
		if (fileInput?.files.length > 0) {
			setFileName4(fileInput?.files[0].name);
		} else {
			setFileName4("Upload the title document here");
		}
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
						<div className='text-[18px]'>Upload Document</div>
						<div className='text-[red] cursor-pointer' onClick={togleBtn}>
							<VscChromeClose />
						</div>
					</div>
					<div className='w-[100%] flex justify-start flex-col mt-[10px]'>
						<div className='text-[14px]'>Revolutionary Army</div>
						<div className='text-[14px] font-semibold text-[#0000ff]'>
							Store ID - 0002930
						</div>
					</div>
					<div className='w-[100%] mt-[50px]'>
						<form className='w-[100%] flex flex-col justify-center items-center'>
							<div className='w-[100%] flex justify-between items-center flex-wrap'>
								<div className='flex flex-col mb-[20px]'>
									<input
										type='file'
										id='fileInput'
										accept='.pdf,.doc'
										onChange={handleFileChange}
										className='hidden'
									/>
									<label
										htmlFor='fileInput'
										className='cursor-pointer text-[14px] mb-[5px]'>
										CAC DOCUMENT (select a file)
									</label>
									<p className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[13px] bg-white'>
										{fileName}
									</p>
								</div>
								<div className='flex flex-col mb-[20px]'>
									<input
										type='file'
										id='fileInput2'
										accept='.pdf,.doc'
										onChange={handleFileChange2}
										className='hidden'
									/>
									<label
										htmlFor='fileInput2'
										className='cursor-pointer text-[14px] mb-[5px]'>
										KYC (select a file)
									</label>
									<p className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[13px] bg-white'>
										{fileName2}
									</p>
								</div>
								<div className='flex flex-col mb-[20px]'>
									<input
										type='file'
										id='fileInput3'
										accept='.pdf,.doc'
										onChange={handleFileChange3}
										className='hidden'
									/>
									<label
										htmlFor='fileInput3'
										className='cursor-pointer text-[14px] mb-[5px]'>
										Business Certificate (select a file)
									</label>
									<p className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[13px] bg-white'>
										{fileName3}
									</p>
								</div>
								<div className='flex flex-col mb-[20px]'>
									<input
										type='file'
										id='fileInput4'
										accept='.pdf,.doc'
										onChange={handleFileChange4}
										className='hidden'
									/>
									<label
										htmlFor='fileInput4'
										className='cursor-pointer text-[14px] mb-[5px]'>
										Utility Bill (select a file)
									</label>
									<p className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[13px] bg-white'>
										{fileName4}
									</p>
								</div>

								<div className='w-[100%] flex justify-end mt-[5px]'>
									<button className='bg-[#0000ff] text-white px-[25px] py-[5px] rounded-[5px] flex justify-center items-center'>
										<div className='mr-[5px]'>
											<VscFileSymlinkFile />
										</div>
										<div>Upload</div>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Upload;
