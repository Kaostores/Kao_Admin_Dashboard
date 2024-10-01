import Order from "@/components/props/OrderSec";

const Store = () => {
  return (
    <div className='w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]'>
      <div className='w-[100%] h-[100%] flex items-center flex-col'>
        <div className='w-[100%] h-[100%] flex justify-center items-center flex-col'>
          <Order
            // storeId='4555665'
            // customerId='232344'
            // timeDate='11:23 AM 22/4/23'
            // amount='40,500'
            // paymentMethod='Transfer'
          />
        </div>
      </div>
    </div>
  );
};

export default Store;
