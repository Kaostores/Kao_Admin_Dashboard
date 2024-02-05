import Order from "@/components/props/OrderSec";

const Store = () => {
	return (
		<div className='w-[calc(100%-280px)] h-[calc(100%-70px)] bg-[#fff] pl-[20px] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]'>
			<div className='w-[97%] h-[100%] flex  items-center flex-col'>
				<div className='w-[100%] h-[100px] flex justify-start items-center text-[25px]'>
					Orders
				</div>
				<div className='w-[100%] h-[100%] flex justify-center items-center flex-col'>
					<Order
						orderId='1232223'
						storeId='4555665'
						customerId='232344'
						timeDate='11:23 AM 22/4/23'
						amount='40,500'
						paymentMethod='Transfer'
					/>
				</div>
			</div>
		</div>
	);
};
export default Store;
