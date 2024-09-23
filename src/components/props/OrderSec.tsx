import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { GetOrders } from '../../utils/ApiCalls';

interface Order {
  orderId: string;
  storeId: string;
  customerId: string;
  timeDate: string;
  amount: number;
  paymentMethod: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [ordersPerPage] = useState<number>(5);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await GetOrders();
        console.log("Fetched orders response data:", response.data);
        const ordersData = response.data.data.map((order: any) => ({
          orderId: order.id,
          storeId: order.store.name,
          customerId: order.shippingAddress.fullname,
          timeDate: new Date(order.orderDate).toLocaleString(),
          amount: order.totalPrice, 
          paymentMethod: order.paymentMethod
        }));

        setOrders(ordersData);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching orders:", err.response?.data || err.message || err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const startIndex = currentPage * ordersPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='relative overflow-hidden w-[100%] h-[100%]'>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-[5px] py-[5px]'>Store Name</th>
              <th scope='col' className='px-6 py-3'>Customer Name</th>
              <th scope='col' className='px-6 py-3'>Time/Date</th>
              <th scope='col' className='px-6 py-3'>Amount</th>
              <th scope='col' className='px-6 py-3'>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.orderId} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                <td className='px-[5px] py-[5px] min-w-[100px]'>{order.storeId}</td>
                <td className='px-6 py-4'>{order.customerId}</td>
                <td className='px-6 py-4'>{order.timeDate}</td>
                <td className='px-6 py-4'>{order.amount}</td>
                <td className='px-6 py-4'>{order.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-center my-4'>
        <ReactPaginate
          pageCount={Math.ceil(orders.length / ordersPerPage)}
          marginPagesDisplayed={2}
            pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName="flex space-x-2"
        	pageClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                        previousClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                        nextClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                        breakClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                        activeClassName="bg-blue-500 text-white border-blue-500"
        />
      </div>
    </div>
  );
};

export default Orders;
