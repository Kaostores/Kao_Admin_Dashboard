import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { getPaymentMethodMetrics } from '@/utils/ApiCalls'; // Ensure correct import

type PaymentMethodMetric = {
  _id: string;
  totalOrders: number;
  paymentMethod: string;
};

const StackedChartComps = () => {
  const [paymentMetrics, setPaymentMetrics] = useState<PaymentMethodMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentMetrics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
