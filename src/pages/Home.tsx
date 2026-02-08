/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

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

  const isGraphDataEmpty = !graphData?.data || graphData.data.length === 0;

  const {
    user_metrics: { currentWeekUsers = 0, percentageIncrease: userIncrease = 0 },
    store_metrics: { currentWeekStores = 0, percentageIncrease: storeIncrease = 0 },
    revenue_metrics: { currentWeekRevenue = 0, percentageIncrease: revenueIncrease = 0 },
    order_metrics: { currentWeekOrders = 0, percentageIncrease: orderIncrease = 0 },
  } = metrics || {
    user_metrics: {},
    store_metrics: {},
    revenue_metrics: {},
    order_metrics: {},
  };

  const totalCreditSum = graphData?.data?.reduce((acc: number, day: any) => acc + day.totalCredit, 0) || 0;
  const totalDebitSum = graphData?.data?.reduce((acc: number, day: any) => acc + day.totalDebit, 0) || 0;

  const CardSkeleton = () => (
    <div className="w-1/4 p-4">
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-12 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );

  const ChartSkeleton = () => (
    <div className="w-full h-[300px]">
      <Skeleton className="w-full h-full" />
    </div>
  );

  const PaymentMethodSkeleton = () => (
    <div className="flex justify-between border-b pb-2 mb-2">
      <div className="flex items-center">
        <Skeleton className="h-2 w-2 rounded-full mr-2" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-4 w-10" />
    </div>
  );

  return (
    <div className="w-full bg-white px-3 sm:px-5 pt-3 sm:pt-5 pb-8 mt-[10px]">
      <div className="w-full flex flex-col gap-5">
        {/* Sales Chart Section */}
        <div className="w-full bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-lg p-3 sm:p-4">
  {/* Header and Controls */}
  <div className="w-full flex flex-col gap-3 sm:gap-4 mb-4">
    <h2 className="text-lg sm:text-xl font-semibold">Total sales</h2>

    {/* Radio Controls - Responsive Grid */}
    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 sm:gap-4">
  
  {/* Current Week */}
  <div className="w-full md:w-[48%] lg:w-[23%] flex flex-col sm:flex-row sm:items-center gap-2">
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
      <label
        htmlFor="current-week"
        className="text-sm sm:text-base text-gray-600"
      >
        Current week
      </label>
    </div>
    <div className="font-semibold text-sm sm:text-base">
      {isLoading ? (
        <Skeleton className="h-5 w-24" />
      ) : (
        `NGN ${totalCreditSum}`
      )}
    </div>
  </div>

  {/* Previous Week */}
  <div className="w-full md:w-[48%] lg:w-[23%] flex flex-col sm:flex-row sm:items-center gap-2">
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
      <label
        htmlFor="previous-week"
        className="text-sm sm:text-base text-gray-600"
      >
        Previous week
      </label>
    </div>
    <div className="font-semibold text-sm sm:text-base">
      {isLoading ? (
        <Skeleton className="h-5 w-24" />
      ) : (
        `NGN ${totalDebitSum}`
      )}
    </div>
  </div>

  {/* Change Percentage */}
  <div className="w-full md:w-full lg:w-[23%] flex items-center gap-2">
    {isLoading ? (
      <div className="flex items-center gap-1">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    ) : (
      <div className="flex items-center gap-1">
        <ArrowDown className="text-red-500 w-4 h-4" />
        <div className="text-sm sm:text-base text-red-500 font-semibold">
          {totalDebitSum !== 0
            ? `${(
                ((currentWeekRevenue - totalDebitSum) / totalDebitSum) *
                100
              ).toFixed(2)}%`
            : '0.00%'}
        </div>
      </div>
    )}
    <div className="text-xs sm:text-sm text-gray-600">
      Since last week
    </div>
  </div>

</div>

  </div>

  {/* Chart */}
  <div className="text-xs sm:text-sm mb-3 text-gray-500">
    Sales over time
  </div>
  <div className="w-full overflow-x-auto">
    {graphLoading || isLoading ? (
      <ChartSkeleton />
    ) : isGraphDataEmpty ? (
      <div className="text-center text-sm sm:text-base text-gray-500 py-8">
        No data available for{' '}
        {selectedWeek === 'current' ? 'current week' : 'previous week'}.
      </div>
    ) : (
      <LineChartOverView data={graphData.data} />
    )}
  </div>
</div>


        {/* Metrics Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
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
                fig={`NGN ${currentWeekRevenue}`} 
                increment={`${revenueIncrease.toFixed(0)}%`} 
                Ic="" 
                Cl="" 
              />
              <Card
                tit="Average order value"
                fig={currentWeekOrders.toString()}
                increment={`${orderIncrease.toFixed(0)}%`}
                Ic=""
                Cl=""
              />
            </>
          )}
        </div>

        {/* Bottom Sections - Responsive Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Payment Methods */}
          <div className="rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors p-3 sm:p-4">
            <h3 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Payment methods</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="w-full sm:w-1/2">
                {isLoading ? <ChartSkeleton /> : <StackedChartComps />}
              </div>
              <div className="w-full sm:w-1/2">
                {isLoading ? (
                  <>
                    <PaymentMethodSkeleton />
                    <PaymentMethodSkeleton />
                    <PaymentMethodSkeleton />
                  </>
                ) : (
                  paymentMetrics.map((method, index) => (
                    <div key={method._id} className="flex justify-between border-b pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full flex-shrink-0 ${index % 2 === 0 ? 'bg-yellow-300' : 'bg-blue-600'}`}></div>
                        <div className="text-xs sm:text-sm text-gray-600 truncate">{method.paymentMethod}</div>
                      </div>
                      <div className="font-bold text-xs sm:text-sm flex-shrink-0">{method.totalOrders}%</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors p-3 sm:p-4">
            <h3 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Recent transactions</h3>
            <div className="overflow-x-auto">
              {isLoading ? <ChartSkeleton /> : <TableComp />}
            </div>
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
