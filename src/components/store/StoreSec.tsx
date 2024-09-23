import { IoStorefrontOutline } from "react-icons/io5";
import StoreEdit from "../store/EditStore";
import { useState, useEffect } from "react";
import { useApproveStoreMutation, useSuspendStoreMutation } from "@/services/apiSlice";
import ReactModal from 'react-modal';
import { IoClose } from 'react-icons/io5';

const StoresSec = ({ stores, loading, toggleBtn }: any) => {
  const [selectedStoreUuid, setSelectedStoreUuid] = useState<string | null>(null);
  const [activeStatusButton, setActiveStatusButton] = useState<string | null>(null);
  const [storeList, setStoreList] = useState(stores);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storeToSuspend, setStoreToSuspend] = useState<string | null>(null);
  const [suspensionNote, setSuspensionNote] = useState('');

  const [approveStore] = useApproveStoreMutation();
  const [] = useSuspendStoreMutation();

  useEffect(() => {
    setStoreList(stores);
  }, [stores]);

  const handleEditClick = (storeUuid: string) => {
    setSelectedStoreUuid(storeUuid);
    toggleBtn(); 
  };

  const updateStoreInList = (updatedStore: any) => {
    setStoreList((prevStores: any) =>
      prevStores.map((store: any) =>
        store.id === updatedStore.id ? updatedStore : store
      )
    );
  };

  const handleStatusChange = async (storeUuid: string, newStatus: string) => {
    try {
      if (newStatus === 'verified') {
        try {
          const response = await approveStore(storeUuid);
          console.log('Store approved response:', response);
        } catch (error) {
          console.error('Error approving store:', error);
        }
      }
    } catch (error: any) {
      console.error(`Error ${newStatus === "verified" ? "approving" : "suspending"} store:`, error.message); 
    }

    setStoreList((prevStores: any) =>
      prevStores.map((store: any) =>
        store.id === storeUuid ? { ...store, status: newStatus } : store
      )
    );

    setActiveStatusButton(null);
  };

  const [suspendingStore] = useSuspendStoreMutation();

  const handleSuspend = async () => {
    if (storeToSuspend && suspensionNote.trim()) {
      try {
        console.log("Store UUID:", storeToSuspend);
        const response = await suspendingStore({
          store_uuid: storeToSuspend,
          note: suspensionNote,
        });
        console.log("Store suspended response:", response);
        
        setStoreList((prevStores: any) =>
          prevStores.map((store: any) =>
            store.id === storeToSuspend ? { ...store, status: 'suspended' } : store
          )
        );
        setIsModalOpen(false);
        setSuspensionNote('');
        setStoreToSuspend(null);
      } catch (error) {
        console.error("Error suspending store:", error);
      }
    } else {
      console.error("Suspension note is required");
    }
  };

  const toggleStatusPopup = (storeUuid: string) => {
    if (isModalOpen) return;
    setActiveStatusButton(activeStatusButton === storeUuid ? null : storeUuid);
  };

  return (
    <div className='relative overflow-hidden w-[100%] h-[100%]'>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        {loading ? (
          <div>Loading</div>
        ) : (
          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope="col" className="px-6 py-3">Store Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope='col' className='px-6 py-3'>Address</th>
                <th scope='col' className='px-6 py-3'>Phone No</th>
                <th scope='col' className='px-6 py-3'>Last Withdrawal</th>
                <th scope='col' className='px-6 py-3'>Category</th>
                <th scope='col' className='px-6 py-3'>Status</th>
                <th scope='col' className='px-6 py-3'>Agent Name</th>
                <th scope='col' className='px-6 py-3'></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {storeList.length > 0 ? (
                storeList.map((store: any) => (
                  <tr key={store.id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${store.status === 'pending' ? 'text-red-500' : 'text-gray-500'}`}>{store.name}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${store.status === 'pending' ? 'text-red-500' : 'text-gray-500'}`}>{store.email}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${store.status === 'pending' ? 'text-red-500' : 'text-gray-500'}`}>{store.address}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${store.status === 'pending' ? 'text-red-500' : 'text-gray-500'}`}>{store.phone}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${store.status === 'pending' ? 'text-red-500' : 'text-gray-500'}`}>{store.LastWithdrawal}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${store.status === 'pending' ? 'text-red-500' : 'text-gray-500'}`}>{store.category}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${store.status === 'pending' ? 'text-red-500' : 'text-gray-500'}`}>
                      <button
                        onClick={() => toggleStatusPopup(store.id)}
                        className={`px-4 py-2 rounded-md ${
                        store.status === 'approved' ? 'bg-blue-500 text-white' :
                        store.status === 'suspended' ? 'bg-red-500 text-white' :
                        store.status === 'pending' ? 'bg-red-300 text-black' : 'bg-gray-300 text-white'
                      }`}
                      >
                        {store.status === 'pending' ? 'Not Verified' : store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                      </button>
                      {activeStatusButton === store.id && !isModalOpen && (
                        <div className='absolute z-10 w-40 bg-white border border-gray-300 shadow-lg rounded-md transform -translate-y-full -mt-[20px]'>
                          <button
                            className='block w-full px-4 py-2 text-left hover:bg-blue-50'
                            onClick={() => handleStatusChange(store.id, 'verified')}
                          >
                            Approve
                          </button>
                          <button
                            className='block w-full px-4 py-2 text-left hover:bg-red-50'
                            onClick={() => {
                              setStoreToSuspend(store.id);
                              setIsModalOpen(true);
                            }}
                          >
                            Suspend
                          </button>
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      
                          {store.verifiedBy}
                      
                    </td>
                    <td className='px-[10px]'>
                      <div
                        className='text-[20px] h-[100%] flex justify-center items-center text-[#0333ae] cursor-pointer'
                        onClick={() => handleEditClick(store.id)}
                      >
                        <IoStorefrontOutline />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4">No stores available</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      {selectedStoreUuid ? (
        <div>
          <StoreEdit togleBtn={toggleBtn} storeUuid={selectedStoreUuid} updateStoreInList={updateStoreInList} />
        </div>
      ) : null}


      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-75 outline-none"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm"
        shouldCloseOnOverlayClick
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Suspend Store</h2>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
              <IoClose size={24} />
            </button>
          </div>
          <textarea
            value={suspensionNote}
            onChange={(e) => setSuspensionNote(e.target.value)}
            className="w-full border rounded-md p-2 mb-4 resize-none"
            placeholder="Enter suspension note..."
          />
          <div className="flex justify-end">
            <button
              onClick={handleSuspend}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Suspend
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default StoresSec;
