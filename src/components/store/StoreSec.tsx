// 'use client'

// import { useState, useEffect } from "react"
// import { IoClose } from "react-icons/io5"
// import ReactModal from 'react-modal'
// import { Skeleton } from "@/components/ui/skeleton"
// import { useApproveStoreMutation, useSuspendStoreMutation } from "@/services/apiSlice"
// import { Button } from "@/components/ui/button"
// import { ChevronLeft, ChevronRight, Pencil, ChevronDown } from "lucide-react"
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableHead,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table"
// import StoreEdit from "../store/EditStore";

// interface Store {
//   id: string
//   name: string
//   email: string
//   address: string
//   phone: string
//   LastWithdrawal: string
//   category: string
//   status: string
//   verifiedBy: string
// }

// interface StoresSecProps {
//   stores: Store[]
//   loading: boolean
//   toggleBtn: () => void
// }

// export default function StoresTable({ stores, loading, toggleBtn }: StoresSecProps) {
//   const [selectedStoreUuid, setSelectedStoreUuid] = useState<string | null>(null)
//   const [activeStatusButton, setActiveStatusButton] = useState<string | null>(null)
//   const [storeList, setStoreList] = useState<Store[] | any>(stores)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [storeToSuspend, setStoreToSuspend] = useState<string | null>(null)
//   const [suspensionNote, setSuspensionNote] = useState('')

//   const [approveStore] = useApproveStoreMutation()
//   const [suspendingStore] = useSuspendStoreMutation()
  

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1)
//   const storesPerPage = 10

//   useEffect(() => {
//     setStoreList(stores)
//   }, [stores])

//   const handleEditClick = (storeUuid: string) => {
//     setSelectedStoreUuid(storeUuid)
//     toggleBtn()
//   }

//   const updateStoreInList = (updatedStore: Store) => {
//     setStoreList((prevStores: any) =>
//       prevStores.map((store: any) =>
//         store.id === updatedStore.id ? { ...store, ...updatedStore } : store
//       )
//     )
//   }

//   const handleStatusChange = async (storeUuid: string, newStatus: string) => {
//     try {
//       if (newStatus === 'verified') {
//         const response = await approveStore(storeUuid)
//         console.log('Store approved response:', response)
//       }
//     } catch (error: any) {
//       console.error(`Error ${newStatus === "verified" ? "approving" : "suspending"} store:`, error.message)
//     }

//     setStoreList((prevStores: any) =>
//       prevStores.map((store: any) =>
//         store.id === storeUuid ? { ...store, status: newStatus } : store
//       )
//     )

//     setActiveStatusButton(null)
//   }

//   const handleSuspend = async () => {
//     if (storeToSuspend && suspensionNote.trim()) {
//       try {
//         console.log("Store UUID:", storeToSuspend)
//         const response = await suspendingStore({
//           store_uuid: storeToSuspend,
//           note: suspensionNote,
//         })
//         console.log("Store suspended response:", response)
        
//         setStoreList((prevStores: any) =>
//           prevStores.map((store: any) =>
//             store.id === storeToSuspend ? { ...store, status: 'suspended' } : store
//           )
//         )
//         setIsModalOpen(false)
//         setSuspensionNote('')
//         setStoreToSuspend(null)
//       } catch (error) {
//         console.error("Error suspending store:", error)
//       }
//     } else {
//       console.error("Suspension note is required")
//     }
//   }

//   const toggleStatusPopup = (storeUuid: string) => {
//     if (isModalOpen) return
//     setActiveStatusButton(activeStatusButton === storeUuid ? null : storeUuid)
//   }

//   // Pagination logic
//   const indexOfLastStore = currentPage * storesPerPage
//   const indexOfFirstStore = indexOfLastStore - storesPerPage
//   const currentStores = storeList.slice(indexOfFirstStore, indexOfLastStore)

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

//   return (
//     <div className='relative overflow-hidden w-full h-full'>
//       <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Store name</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Address</TableHead>
//               <TableHead>Phone no</TableHead>
//               <TableHead>Last withdrawal</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Agent name</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               Array.from({ length: 5 }).map((_, idx) => (
//                 <TableRow key={idx}>
//                   <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//                   <TableCell><Skeleton className="h-4 w-32" /></TableCell>
//                   <TableCell><Skeleton className="h-4 w-40" /></TableCell>
//                   <TableCell><Skeleton className="h-4 w-20" /></TableCell>
//                   <TableCell><Skeleton className="h-4 w-28" /></TableCell>
//                   <TableCell><Skeleton className="h-4 w-28" /></TableCell>
//                   <TableCell><Skeleton className="h-4 w-20" /></TableCell>
//                   <TableCell><Skeleton className="h-4 w-28" /></TableCell>
//                   <TableCell><Skeleton className="h-6 w-6" /></TableCell>
//                 </TableRow>
//               ))
//             ) : currentStores.length > 0 ? (
//               currentStores.map((store: any) => (
//                 <TableRow key={store.id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
//                   <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.name}</TableCell>
//                   <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.email}</TableCell>
//                   <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.address}</TableCell>
//                   <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.phone}</TableCell>
//                   <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.LastWithdrawal}</TableCell>
//                   <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.category}</TableCell>
//                   <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>
//                     <button
//                       onClick={() => toggleStatusPopup(store.id)}
//                       className={`px-3 py-1 rounded-full flex items-center justify-between w-full ${
//                         store.status === 'approved' ? 'bg-blue-500 text-white' :
//                         store.status === 'suspended' ? 'bg-red-500 text-white' :
//                         store.status === 'pending' ? 'bg-red-300 text-black' : 'bg-gray-300 text-white'
//                       }`}
//                       aria-haspopup="true"
//                       aria-expanded={activeStatusButton === store.id}
//                     >
//                       <span>{store.status === 'pending' ? 'Not Verified' : store.status.charAt(0).toUpperCase() + store.status.slice(1)}</span>
//                       <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${activeStatusButton === store.id ? 'rotate-180' : ''}`} />
//                     </button>
//                     {activeStatusButton === store.id && !isModalOpen && (
//                       <div className='absolute z-10 w-40 bg-white border border-gray-300 shadow-lg rounded-md transform -translate-y-full -mt-[20px]'>
//                         <button
//                           className='block w-full px-4 py-2 text-left hover:bg-blue-50'
//                           onClick={() => handleStatusChange(store.id, 'verified')}
//                         >
//                           Approve
//                         </button>
//                         <button
//                           className='block w-full px-4 py-2 text-left hover:bg-red-50'
//                           onClick={() => {
//                             setStoreToSuspend(store.id)
//                             setIsModalOpen(true)
//                           }}
//                         >
//                           Suspend
//                         </button>
//                       </div>
//                     )}
//                   </TableCell>
//                   <TableCell>{store.verifiedBy}</TableCell>
//                   <TableCell>
//                     {/* <div
//                       className='text-[20px] h-full flex justify-center items-center text-[#0333ae] cursor-pointer'
//                       onClick={() => handleEditClick(store.id)}
//                     >
//                       <IoStorefrontOutline />
//                     </div> */}
//                     <Button variant="outline" size="icon" onClick={() => handleEditClick(store.id)}>
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={9} className="text-center">No stores available</TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
      
//       {!loading && (
//         <div className="flex items-center justify-between py-4">
//           <div className="text-sm text-muted-foreground">
//             Page {currentPage} of {Math.ceil(storeList.length / storesPerPage)}
//           </div>
//           <div className="flex space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => paginate(currentPage - 1)}
//               disabled={currentPage === 1}
//             >
//               <ChevronLeft className="h-4 w-4 mr-2" />
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => paginate(currentPage + 1)}
//               disabled={currentPage === Math.ceil(storeList.length / storesPerPage)}
//             >
//               Next
//               <ChevronRight className="h-4 w-4 ml-2" />
//             </Button>
//           </div>
//         </div>
//       )}

//       <ReactModal
//         isOpen={isModalOpen}
//         onRequestClose={() => setIsModalOpen(false)}
//         className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-75 outline-none"
//         overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm"
//         shouldCloseOnOverlayClick
//       >
//         <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Suspend Store</h2>
//             <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
//               <IoClose size={24} />
//             </button>
//           </div>
//           <textarea
//             value={suspensionNote}
//             onChange={(e) => setSuspensionNote(e.target.value)}
//             className="w-full border rounded-md p-2 mb-4 resize-none"
//             placeholder="Enter suspension note..."
//           />
//           <div className="flex justify-end">
//             <button
//               onClick={handleSuspend}
//               className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
//             >
//               Suspend
//             </button>
//           </div>
//         </div>
//       </ReactModal>

//       {selectedStoreUuid && (
//         <StoreEdit 
//           togleBtn={toggleBtn} 
//           storeUuid={selectedStoreUuid} 
//           updateStoreInList={updateStoreInList} 
//           storeDetails={storeList.find((store: any) => store.id === selectedStoreUuid)}
//         />
//       )}
//     </div>
//   )
// }


const StoreSec = () => {
  return (
    <div>StoreSec</div>
  )
}

export default StoreSec