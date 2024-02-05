import React from 'react'
import { GoChevronDown } from 'react-icons/go';

type Iprops = {
	togleBtn : any
};

const ComplianceDetails: React.FC<Iprops> = ({ togleBtn }) => {
	return (
		<div
			className='w-screen h-[100vh] z-20 flex justify-end bg-[#ffffff1f] fixed left-0 top-0 
backdrop-blur-sm'>
			<div
				className='w-[calc(100%-280px)] h-[calc(100%-70px)] pl-[20px] pt-[20px] flex justify-center 
items-start pb-[30px] mt-[70px]'>
				<div
					className='w-[96%] py-[30px] bg-[#f8f7f7] rounded-[10px] flex justify-center 
items-center border-[1px] border-[#0000ff] border-solid'>
					<div className='w-[97%] h-[96%] flex flex-col'>
						<div className='flex flex-col'>
							<div className='mb-[15px]'>
								<div className='flex items-center text-[14px]'>
									<div className='flex justify-center items-center mr-[30px] '>
										<div className='font-bold'>Store ID:</div>
										<div className='text-[#0000ff] ml-[5px]'>00000921</div>
									</div>
									<div className='flex justify-center items-center'>
										<div className='font-bold'>StoreName:</div>
										<div className='text-[#0000ff] ml-[5px]'>
											Revolutional Army
										</div>
									</div>
								</div>
							</div>
							<div className='mb-[15px]'>
								<div className='flex items-center text-[14px]'>
									<div className='flex justify-center items-center mr-[30px] '>
										<div className='font-bold'>Agent ID:</div>
										<div className='text-[#0000ff] ml-[5px]'>33827728</div>
									</div>
									<div className='flex justify-center items-center'>
										<div className='font-bold'>Agent Name:</div>
										<div className='text-[#0000ff] ml-[5px]'>Solomon Teach</div>
									</div>
								</div>
							</div>

							<div>
								<div
									className='w-[100%] flex justify-between text-[14px] mb-[20px]
'>
									<div className='flex justify-center items-center mr-[30px] '>
										<div className='font-bold'>Complaint Category:</div>
										<div className='text-[#0000ff] ml-[5px]'>Bribery</div>
									</div>
									<div className='flex justify-center items-center '>
										<div className='font-bold text-[#797777]'>Time|Date:</div>
										<div className='text-[#797777] ml-[5px]'>
											11:40|26/06/2023
										</div>
									</div>
								</div>
							</div>
						</div>
						<div
							className='w-[100%] bg-[#ddd] p-[10px] rounded-[5px] border-[1px] border-
[#0000ff] border-solid mb-[15px]'>
							<div className='text-[13px]'>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde
								magni doloribus mollitia hic atque laboriosam distinctio labore
								quod quis? Labore omnis incidunt laudantium, itaque explicabo
								adipisci veniam! Accusantium asperiores nulla maxime sint
								adipisci alias voluptatem eos at quae distinctio amet, tempore
								magni voluptas nobis, quasi sit nam? Eligendi, totam vitae,
								labore dolore quisquam, autem explicabo ea necessitatibus
								assumenda voluptate at!
							</div>
						</div>
						<div className='w-[100%] flex justify-between items-center mb-[40px]'>
							<div
								className='flex justify-center items-center p-[5px] border-[1px] border-
[#888787] border-solid rounded-[5px]'>
								<div className='mr-[30px] text-[12px]'>Display Action</div>
								<div className='text-[14px] text-[#0000ff] cursor-pointer'>
									<GoChevronDown />
								</div>
							</div>
							<div className='flex justify-center items-center text-[13px]'>
								<div
									className='border-[1px] border-[#888787] border-solid rounded-[5px] mr-
[20px] py-[8px] px-[15px] cursor-pointer'>
									<div className='text-[#888787]'>Send Reply</div>
								</div>
								<div
									className='border-[1px] bg-[#888787] border-solid rounded-[5px]  py-[8px] 
px-[35px] cursor-pointer'
									onClick={togleBtn}>
									<div className='text-[#fff]'>Done</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ComplianceDetails