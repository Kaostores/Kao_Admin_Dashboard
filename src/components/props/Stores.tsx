// import { useEffect, useState } from "react";
// import { IoStorefrontOutline } from "react-icons/io5";
// import StoreEdit from "../store/EditStore";
// import { GetStoresByStatus } from "@/utils/ApiCalls";

// const Stores = () => {
//     const [show, setShow] = useState(false);
//     const [stores, setStores] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedStoreUuid, setSelectedStoreUuid] = useState<string | null>(null);
//     const [activeStatusButton, setActiveStatusButton] = useState<string | null>(null); // For tracking active status button popup

//     const toggleBtn = () => {
//         setShow(!show);
//     };

//     const handleEditClick = (storeUuid: string) => {
//         setSelectedStoreUuid(storeUuid);
//         toggleBtn();
//     };

//     const updateStoreInList = (updatedStore: any) => {
//         setStores((prevStores) =>
//             prevStores.map((store) =>
//                 store.id === updatedStore.id ? updatedStore : store
//             )
//         );
//     };

//     const toggleStatusPopup = (storeUuid: string) => {
//         setActiveStatusButton(activeStatusButton === storeUuid ? null : storeUuid);
//     };

//     const handleStatusChange = (storeUuid: string, newStatus: string) => {
//         setStores((prevStores) =>
//             prevStores.map((store) =>
//                 store.id === storeUuid ? { ...store, status: newStatus } : store
//             )
//         );
//         setActiveStatusButton(null);
//     };

//     useEffect(() => {
//         const fetchStores = async () => {
//             try {
//                 const response = await GetStoresByStatus("approved");
//                 setStores(response.data);
//             } catch (error) {
//                 console.error("Error fetching stores:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStores();
//     }, []);

//     return (
//         <div className='relative overflow-hidden w-[100%] h-[100%]'>
//             <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
//                 {loading ? (
//                     <div>Loading</div>
//                 ) : (
//                     <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
//                         <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
//                             <tr>
//                                 <th scope='col' className='px-[5px] py-[5px]'>Store Name</th>
//                                 <th scope='col' className='px-[5px] py-[5px]'>Email</th>
//                                 <th scope='col' className='px-6 py-3'>Address</th>
//                                 <th scope='col' className='px-6 py-3'>Phone No</th>
//                                 <th scope='col' className='px-6 py-3'>Last Withdrawal</th>
//                                 <th scope='col' className='px-6 py-3'>Category</th>
//                                 <th scope='col' className='px-6 py-3'>Status</th>
//                                 <th scope='col' className='px-6 py-3'>Agent Name</th>
//                                 <th scope='col' className='px-6 py-3'></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {stores.map((store) => (
//                                 <tr key={store.id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
//                                     <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>{store.name}</td>
//                                     <td className='px-6 py-4'>{store.email}</td>
//                                     <td className='px-6 py-4'>{store.address}</td>
//                                     <td className='px-6 py-4'>{store.phone}</td>
//                                     <td className='px-6 py-4'>{store.LastWithdrawal}</td>
//                                     <td className='px-6 py-4'>{store.category}</td>
//                                     <td className='px-6 py-4'>
//                                         <button
//                                             onClick={() => toggleStatusPopup(store.id)}
//                                             className={`px-4 py-2 rounded-md ${
//                                                 store.status === 'verified' ? 'bg-blue-500 text-white' :
//                                                 store.status === 'suspended' ? 'bg-red-500 text-white' : 'bg-red-300 text-white'
//                                             }`}
//                                         >
//                                             {store.status === 'verified' ? 'Verified' :
//                                             store.status === 'suspended' ? 'Suspended' : 'Not Verified'}
//                                         </button>
                                    
//                                         {activeStatusButton === store.id && (
//                                             <div className='absolute z-10 w-40 bg-white border border-gray-300 shadow-lg rounded-md transform -translate-y-full -mt-[20px]'>
//                                                 <button
//                                                     className='block w-full px-4 py-2 text-left hover:bg-blue-50'
//                                                     onClick={() => handleStatusChange(store.id, 'verified')}
//                                                 >
//                                                     Approve
//                                                 </button>
//                                                 <button
//                                                     className='block w-full px-4 py-2 text-left hover:bg-red-50'
//                                                     onClick={() => handleStatusChange(store.id, 'suspended')}
//                                                 >
//                                                     Suspend
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </td>
//                                     <td className='px-[10px]'>
//                                         <div className='flex justify-around items-center'>
//                                             <div className='min-w-[120px] h-[30px] flex justify-center items-center text-[#000]'>
//                                                 {store.name}
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className='px-[10px]'>
//                                         <div
//                                             className='text-[20px] h-[100%] flex justify-center items-center text-[#0333ae] cursor-pointer'
//                                             onClick={() => handleEditClick(store.id)}
//                                         >
//                                             <IoStorefrontOutline />
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
// 							<h2>this is body</h2>
//                         </tbody>
//                     </table>
					
//                 )}
//             </div>
//             {show && selectedStoreUuid ? (
//                 <div>
//                     <StoreEdit
//                         togleBtn={toggleBtn}
//                         storeUuid={selectedStoreUuid}
//                         updateStoreInList={updateStoreInList}
//                     />
//                 </div>
//             ) : null}
//         </div>
//     );
// };

// export default Stores;


