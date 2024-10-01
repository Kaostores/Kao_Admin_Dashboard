import { useState, useEffect } from "react";
import Card from "@/components/props/DashBoardCard";
import { ArrowDown } from "lucide-react";
import LineChartOverView from "@/Charts/LineChartOverView";
import StackedChartComps from "@/Charts/StackedChartComps";
import TableComp from "@/components/TableComp";
import { GetAdminMetrics, getPaymentMethodMetrics } from "@/utils/ApiCalls";
import { useFetchAdminGraphDataQuery } from '@/services/apiSlice';
import { Skeleton } from "@/components/ui/skeleton";

type PaymentMethodMetric = {
  _id: string;
  totalOrders: number;
  paymentMethod: string;
};

type Metrics = {
  user_metrics: { currentWeekUsers: number; percentageIncrease: number };
  store_metrics: { currentWeekStores: number; percentageIncrease: number };
  revenue_metrics: { currentWeekRevenue: number; percentageIncrease: number };
  order_metrics: { currentWeekOrders: number; percentageIncrease: number };
};

export default function Home() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [paymentMetrics, setPaymentMetrics] = useState<PaymentMethodMetric[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<'current' | 'previous'>('current');
  const [isLoading, setIsLoading] = useState(true);

  const { data: graphData, isLoading: graphLoading, isError: graphError } = useFetchAdminGraphDataQuery({
    timeline: selectedWeek === 'current' ? 'this_week' : 'last_week',
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [metricsData, paymentData] = await Promise.all([
          GetAdminMetrics(),
          getPaymentMethodMetrics(),
        ]);
        setMetrics(metricsData.data);
        setPaymentMetrics(paymentData.data);
      } catch (err) {
        setError("Error loading data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (graphData) {
      console.log("Graph Data:", graphData.data);
      console.log("Selected Week:", selectedWeek);
    }
  }, [graphData, selectedWeek]);

  if (error || graphError) {
    return <div className="flex items-center justify-center h-screen">Error loading data</div>;
  }

  if (!metrics) {
    return null;
  }

  const isGraphDataEmpty = !graphData?.data || graphData.data.length === 0;

  const {
    user_metrics: { currentWeekUsers, percentageIncrease: userIncrease },
    store_metrics: { currentWeekStores, percentageIncrease: storeIncrease },
    revenue_metrics: { currentWeekRevenue, percentageIncrease: revenueIncrease },
    order_metrics: { currentWeekOrders, percentageIncrease: orderIncrease },
  } = metrics;

  const totalCreditSum = graphData?.data?.reduce((acc: number, day: any) => acc + day.totalCredit, 0) || 0;
  const totalDebitSum = graphData?.data?.reduce((acc: number, day: any) => acc + day.totalDebit, 0) || 0;

  return (
    <div className="w-full xl:min-h-[calc(100%-70px)] bg-white pl-5 pt-5 pb-8 mt-[70px]">
      <div className="xl:w-full xl:h-full flex items-center flex-col">
        <div className="xl:w-[95%] sm:w-full bg-none shadow-lg flex-col justify-between p-4">
          <div className="w-full flex justify-between items-center flex-wrap mb-4">
            <div className="text-xl font-semibold">Total sales</div>
            <div className="flex justify-center items-center">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="current-week" 
                  name="week" 
                  value="current" 
                  checked={selectedWeek === 'current'} 
                  onChange={() => {
                    setSelectedWeek('current');
                    console.log("Fetching current week's data...");
                  }} 
                  className="mr-2" 
                />
                <label htmlFor="current-week" className="text-gray-600">Current week</label>
              </div>
              <div className="font-semibold">NGN {totalCreditSum}</div>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="previous-week" 
                  name="week" 
                  value="previous" 
                  checked={selectedWeek === 'previous'} 
                  onChange={() => {
                    setSelectedWeek('previous');
                    console.log("Fetching previous week's data...");
                  }} 
                  className="mr-2" 
                />
                <label htmlFor="previous-week" className="text-gray-600">Previous week</label>
              </div>
              <div className="font-semibold ml-[5px]">NGN {totalDebitSum}</div>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center mr-2">
                <ArrowDown className="text-red-500 mr-1" />
                <div className="text-red-500">
                  {totalDebitSum !== 0 ? 
                    `${((currentWeekRevenue - totalDebitSum) / totalDebitSum * 100).toFixed(2)}%` : 
                    '0.00%'}
                </div>
              </div>
              <div className="text-sm">Since last week</div>
            </div>
          </div>
          <div className="text-sm mb-2 text-gray-500">Sales over time</div>

          <div className="w-full">
            {graphLoading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            ) : isGraphDataEmpty ? (
              <div className="text-center text-gray-500">
                No data available for {selectedWeek === 'current' ? "current week" : "previous week"}.
              </div>
            ) : (
              <LineChartOverView data={graphData.data} />
            )}
          </div>
        </div>
        <div className="w-[95%] flex justify-between gap-4 items-center mt-5">
          {isLoading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <>
              <Card 
                tit="Customers" 
                fig={currentWeekUsers.toString()}
                increment={`${userIncrease.toFixed(0)}%`} 
                Ic="" 
                Cl="" 
              />
              <Card 
                tit="Stores" 
                fig={currentWeekStores.toString()}
                increment={`${storeIncrease.toFixed(0)}%`} 
                Ic="" 
                Cl="" 
              />
              <Card 
                tit="Revenue" 
                fig={`N${currentWeekRevenue}`} 
                increment={`${revenueIncrease.toFixed(0)}%`} 
                Ic="" 
                Cl="" 
              />
              <Card
                tit="Average Order Value"
                fig={currentWeekOrders.toString()}
                increment={`${orderIncrease.toFixed(0)}%`}
                Ic=""
                Cl=""
              />
            </>
          )}
        </div>
        <div className="w-[95%] flex justify-between items-start mt-5">
          <div className="w-[49%] rounded-lg bg-white shadow-xl p-4">
            <h3 className="font-bold mb-4">Payment methods</h3>
            <div className="flex justify-between">
              <StackedChartComps />
              <div className="flex-1 pl-4">
                {isLoading ? (
                  <>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </>
                ) : (
                  paymentMetrics.map((method, index) => (
                    <div key={method._id} className="flex justify-between border-b pb-2 mb-2">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${index % 2 === 0 ? 'bg-yellow-300' : 'bg-blue-600'} mr-2`}></div>
                        <div className="text-gray-600">{method.paymentMethod}</div>
                      </div>
                      <div className="font-bold">{method.totalOrders}%</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="w-[49%] rounded-lg bg-white shadow-xl p-4">
            <h3 className="font-bold mb-4">Recent transactions</h3>
            <TableComp />
          </div>
        </div>
      </div>
    </div>
  );
}

// function SkeletonPaymentMethod() {
//   return (
//     <div className="flex justify-between border-b pb-2 mb-2">
//       <div className="flex items-center">
//         <Skeleton className="h-2 w-2 rounded-full mr-2" />
//         <Skeleton className="h-4 w-24" />
//       </div>
//       <Skeleton className="h-4 w-12" />
//     </div>
//   );
// }