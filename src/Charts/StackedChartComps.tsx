import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { getPaymentMethodMetrics } from '@/utils/ApiCalls'; // Ensure correct import
import { Skeleton } from "@/components/ui/skeleton"; // Adjust this import based on your project structure

type PaymentMethodMetric = {
  _id: string;
  totalOrders: number;
  paymentMethod: string;
};

const StackedChartComps = () => {
  const [paymentMetrics, setPaymentMetrics] = useState<PaymentMethodMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMetrics = async () => {
      try {
        const response = await getPaymentMethodMetrics();
        const transformedData = response.data.map((metric: PaymentMethodMetric) => ({
          name: metric.paymentMethod, // For X-axis
          totalOrders: metric.totalOrders, // For Y-axis (or stacked bars)
        }));
        setPaymentMetrics(transformedData);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentMetrics();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className="w-full h-[250px]" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading payment method metrics</div>;
  }

  return (
    <div>
      <BarChart
        width={300}
        height={250}
        data={paymentMetrics}
        barSize={10}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey='name' />
        <Tooltip />
        <Bar dataKey='totalOrders' fill='#0030AD' />
      </BarChart>
    </div>
  );
};

export default StackedChartComps;
