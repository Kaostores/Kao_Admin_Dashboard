import Card from "@/components/props/DashBoardCard";
import { PiArrowDownLight } from "react-icons/pi";
import LineChartOverView from "@/Charts/LineChartOverView";
import StackedChartComps from "@/Charts/StackedChartComps";
import TableComp from "@/components/TableComp";
import { GetAdminMetrics, getPaymentMethodMetrics } from "@/utils/ApiCalls";
import { useState, useEffect } from "react"

type PaymentMethodMetric = {
  _id: string;
  totalOrders: number;
  paymentMethod: string;
};

const Home = () => {
	const [metrics, setMetrics] = useState<any>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [paymentMetrics, setPaymentMetrics] = useState<PaymentMethodMetric[]>([]);
	const [loadingPayment, setLoadingPayment] = useState(true);
	const [errorPayment, setErrorPayment] = useState(null);

	useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await GetAdminMetrics();
        setMetrics(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);
	
	useEffect(() => {
    const fetchPaymentMetrics = async () => {
      try {
        const paymentData = await getPaymentMethodMetrics();
        setPaymentMetrics(paymentData.data);
      } catch (err: any) {
        setErrorPayment(err);
      } finally {
        setLoadingPayment(false);
      }
    };
    fetchPaymentMetrics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading metrics: {error}</div>;
  }

	const {
    user_metrics: { currentWeekUsers, percentageIncrease: userIncrease },
    store_metrics: { currentWeekStores, percentageIncrease: storeIncrease },
    revenue_metrics: { currentWeekRevenue, percentageIncrease: revenueIncrease },
    order_metrics: { currentWeekOrders, percentageIncrease: orderIncrease }
  } = metrics.data;

	return (
		<div className='w-[100%] xl:min-h-[calc(100%-70px)] sm:w-[100%] bg-[#fff] pl-[20px] pt-[20px] justify-center items-center pb-[30px] mt-[70px]'>
			<div className='xl:w-[100%] xl:h-[100%] flex  items-center flex-col'>
				<div className='xl:w-[95%]  sm:w-[100%]  bg-none  shadow-lg flex-col justify-between p-[15px]'>
					<div className='w-[100%] flex justify-between items-center flex-wrap'>
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

					<div className='w-[100%]'>
						<LineChartOverView />
					</div>
				</div>
				<div className='w-[95%] flex justify-between gap-4 items-center mt-[20px]'>
					<Card tit='Customers' fig={currentWeekUsers} increment={`${userIncrease}%`} Ic='' Cl='' />
          <Card tit='Stores' fig={currentWeekStores} increment={`${storeIncrease}%`} Ic='' Cl='' />
          <Card tit='Revenue' fig={`N${currentWeekRevenue}`} increment={`${revenueIncrease}%`} Ic='' Cl='' />
          <Card
            tit='Average Order Value'
            fig={currentWeekOrders}
            increment={`${orderIncrease}%`}
            Ic=''
            Cl=''
          />
				</div>
				<div className='w-[95%] flex justify-between items-center mt-[20px]'>
					<div className='w-[49%] h-[300px] rounded-[5px] bg-[#fff] shadow-xl'>
						<h3 className='m-3 font-bold'>Payment Methods</h3>
						<div className='flex justify-between'>
							<StackedChartComps />
							<div className='flex-1 pr-5'>
								<div>
                  {paymentMetrics.map((method, index) => (
                    <div key={method._id} className='flex justify-between border-b-[1px] pb-2 mb-2'>
                      <div className='flex items-center'>
                        <div className={`h-[9px] w-[9px] rounded-full bg-${index % 2 === 0 ? 'yellow-300' : '#0030AD'} mr-2`}></div>
                        <div className='text-[#797979]'>{method.paymentMethod}</div>
                      </div>
                      <div className='font-bold'>{method.totalOrders}%</div>
                    </div>
                  ))}
                </div>
							</div>
						</div>
					</div>
					<div className='w-[49%] h-[300px] rounded-[5px] bg-[#fff] shadow-xl'>
						<h3 className='m-3 font-bold'>Top selling stores</h3>
						<TableComp />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
