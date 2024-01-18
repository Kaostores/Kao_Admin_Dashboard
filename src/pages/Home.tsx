import React from 'react'
import Card from '@/components/props/DashBoardCard'
import {PiArrowDownLight} from "react-icons/pi"

const Home = () => {
  return (
		<div className=' w-[calc(100%-250px)] min-h-[calc(100%-70px)] bg-[#F3F3F3] pl-[20px] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]'>
			<div className='w-[100%] h-[100%] flex  items-center flex-col'>
				<div className='w-[95%] min-h-[300px] bg-[#fff] shadow-lg flex-col justify-between p-[15px]'>
					<div className='w-[100%] flex justify-between items-center'>
						<div>Total Sales</div>
						<div className='flex justify-center items-center'>
							<div className='flex justify-center items-center mr-[30px]'>
								<div className='w-[10px] h-[10px] rounded-[50%] bg-[#0333ae] mr-[5px]'></div>
								<div className='text-[#88898a]'>Current Weeks</div>
							</div>
							<div className='font-semibold'>N31,000</div>
						</div>
						<div className='flex justify-center items-center'>
							<div className='flex justify-center items-center mr-[30px]'>
								<div className='w-[10px] h-[10px] rounded-[50%] bg-[#88898a] mr-[5px]'></div>
								<div>Previous Weeks</div>
							</div>
							<div className='font-semibold'>N37,000</div>
						</div>
						<div className='flex justify-center items-center'>
							<div className='flex justify-center items-center mr-[10px]'>
								<div className=' text-[#ff3b3b] mr-[1px]'>
									<PiArrowDownLight />
								</div>
								<div className='text-[#ff3b3b]'>16.21%</div>
							</div>
							<div className='text-[14px]'>Since last week</div>
						</div>
					</div>
					<div className='text-[14px] my-[10px] text-[#8b8c8d]'>
						Sales over time
					</div>
					<div className='w-[100%] h-[300px] flex justify-between items-center'>
						<div className='w-[10%] h-[100%] flex justify-between items-center flex-col'>
							<div>5000</div>
							<div>4000</div>
							<div>3000</div>
							<div>2000</div>
							<div>1000</div>
						</div>
						<div className='w-[89%] h-[100%] bg-[#8db7e0]'></div>
					</div>
					<div className='w-[100%] flex justify-end items-center'>
						<div className='w-[89%] flex justify-between items-center '>
							<div>Mon</div>
							<div>Tue</div>
							<div>Wed</div>
							<div>Thu</div>
							<div>Fri</div>
							<div>Sat</div>
							<div>Sun</div>
						</div>
					</div>
				</div>
				<div className='w-[95%] flex justify-between gap-4 items-center mt-[20px]'>
					<Card tit='Customers' fig='34,254' increment='3.00%' Ic='' Cl='' />
					<Card tit='Stores' fig='34,254' increment='4.78%' Ic='' Cl='' />
					<Card tit='Revenue' fig='34,254' increment='2.00%' Ic='' Cl='' />
					<Card
						tit='Average Order Value'
						fig='34,254'
						increment='5.18%'
						Ic=''
						Cl=''
					/>
				</div>
				<div className='w-[95%] flex justify-between items-center mt-[20px]'>
					<div className='w-[49%] min-h-[300px] rounded-[5px] bg-[#fff] shadow-xl'></div>
					<div className='w-[49%] min-h-[300px] rounded-[5px] bg-[#fff] shadow-xl'></div>
				</div>
			</div>
		</div>
	);
}

export default Home