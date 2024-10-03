import React, { useState, useEffect } from 'react';
import { GetSpotlightsByStore, GetStoresByStatus } from '@/utils/ApiCalls';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Spotlightbystore = () => {

  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState('');
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
    
  useEffect(() => {
        const fetchStores = async () => {
            try {
              const response = await GetStoresByStatus('approved');
              
                if (response.success) {
                    setStores(response.data);
                } else {
                    toast.error('Failed to load stores.');
                }
            } catch (error) {
                console.error('Error fetching stores:', error);
                toast.error('Failed to fetch stores.');
            }
        };

        fetchStores();
  }, []);

  const fetchSpotlights = async (storeId: string) => {
        setLoading(true);
        setError('');
        try {
            const response = await GetSpotlightsByStore(storeId);
            if (response.data.success) {
                setSpotlights(response.data.data);
            } else {
                setSpotlights([]);
                setError('No spotlights found for this store.');
            }
        } catch (error) {
            setError('An error occurred while fetching spotlights.');
            toast.error('Failed to fetch spotlights.');
        } finally {
            setLoading(false);
        }
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStoreId = e.target.value;
        setStoreId(selectedStoreId);
        if (selectedStoreId) {
            fetchSpotlights(selectedStoreId);
        }
  };
  
  return (
    <div className="w-[95%] bg-white h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
      <div className="w-[100%] flex-col h-[100%] flex">
        <h1 className="text-[20px] font-[600] mb-6">Spotlights by store</h1>

        <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Select store</label>
                <select
                    value={storeId}
                    onChange={handleStoreChange}
                    className="border border-gray-300 p-2 w-full rounded outline-none"
                >
                    <option value="">Select a store</option>
                    {stores.map((store: any) => (
                        <option key={store.id} value={store.id}>
                            {store.name}
                        </option>
                    ))}
                </select>
        </div>

        {loading ? (
          <div>Loading spotlights...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="mt-[15px] shadow-sm border rounded-lg overflow-x-auto">
            {spotlights.length > 0 ? (
              <table className="w-full table-auto text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                  <tr>
                    <th className="py-3 px-6">Title</th>
                    <th className="py-3 px-6">Description</th>
                    <th className="py-3 px-6">Banner</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y">
                  {spotlights.map((spotlight: any) => (
                    <tr key={spotlight.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{spotlight.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{spotlight.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={spotlight.image}
                          alt={spotlight.title}
                          className="w-20 h-20 object-cover"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No spotlights found for this store.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Spotlightbystore