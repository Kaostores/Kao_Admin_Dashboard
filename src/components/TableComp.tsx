import { useEffect, useState } from 'react';
import { getTopStores } from '@/utils/ApiCalls';

const TableComp = () => {
  const [topStores, setTopStores] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopStores = async () => {
      try {
        const response = await getTopStores();
        setTopStores(response?.data || []);
      } catch (error) {
        setError('Failed to fetch top stores.');
        console.error('Error:', error);
      }
    };

    fetchTopStores();
  }, []);


  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='relative overflow-x-auto'>
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>Store name</th>
            <th scope='col' className='px-6 py-3'>Category</th>
            <th scope='col' className='px-6 py-3'>Total orders</th>
          </tr>
        </thead>
        <tbody>
          {topStores.length > 0 ? (
            topStores.map((store: any) => (
              <tr key={store._id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                  {store.storeDetails.name}
                </th>
                <td className='px-6 py-4'>{store.storeDetails.category}</td>
                <td className='px-6 py-4'>{store.totalOrders}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className='px-6 py-4 text-center text-gray-500'>
                No top selling store
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComp;
