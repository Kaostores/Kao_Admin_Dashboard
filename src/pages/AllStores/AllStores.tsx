import React, { useState, useEffect } from 'react';
import { GetStoresByStatus } from '../../utils/ApiCalls';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

interface Store {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  status: string;
}

const Stores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [status, setStatus] = useState<string>('approved');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchStores(status);
  }, [status]);

  const fetchStores = async (status: string) => {
    setLoading(true);
    try {
      const response = await GetStoresByStatus(status);
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Error fetching stores');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setCurrentPage(0); // Reset pagination when status changes
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentStores = stores.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(stores.length / itemsPerPage);

  return (
    <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
      <div className="w-[100%] flex-col h-[100%] flex">
        <h1 className="text-[20px] font-[600] mb-6">Stores</h1>
        
        {/* Search Filter */}
        <div className="mb-4 flex items-center">
          <label htmlFor="status" className="mr-2">Filter by status:</label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="approved">Approved</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-6">Loading stores...</div>
        ) : (
          <>
            <div className="mt-[15px] shadow-sm border rounded-lg overflow-x-auto">
              <table className="w-full table-auto text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                  <tr>
                    <th className="py-3 px-6">Store Name</th>
                    <th className="py-3 px-6">Email</th>
                    <th className="py-3 px-6">Phone</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y">
                  {currentStores.length > 0 ? (
                    currentStores.map((store: Store) => (
                      <tr key={store.id}>
                        <td className="px-6 py-4">{store.name}</td>
                        <td className="px-6 py-4">{store.email}</td>
                        <td className="px-6 py-4">{store.phone}</td>
                        <td className="px-6 py-4">{store.category}</td>
                        <td className="px-6 py-4">{store.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        No results found for {status} stores.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4">
              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination flex justify-center"}
                pageClassName={"mx-2"}
                activeClassName={"font-bold"}
                previousLinkClassName={"mr-2"}
                nextLinkClassName={"ml-2"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Stores;

// import React, { useEffect, useState } from "react";
// import { BsPersonAdd } from "react-icons/bs";
// import AgentDetails from "@/components/agents/AgentsDetails";
// import AgentSec from "@/components/props/AgentsSec";
// import { GetUsersByType } from "@/utils/ApiCalls"; // Assuming the correct API call is set up

// const Agents = () => {
//     const [show, setShow] = useState(false);
//     const [agents, setAgents] = useState<any[]>([]); // State to store agents data
//     const [loading, setLoading] = useState(true); // Loading state

//     const toggleBtn = () => {
//         setShow(!show);
//     };

//     // Fetch agents when the component loads
//     useEffect(() => {
//         const fetchAgents = async () => {
//             try {
//                 setLoading(true);
//                 const response = await GetUsersByType('vendor'); // Fetch users with type 'vendor'
//                 if (response?.data?.success) {
//                     setAgents(response.data.data); // Assuming response.data.data contains the agents
//                 } else {
//                     console.error("Failed to fetch agents");
//                 }
//             } catch (error) {
//                 console.error("Error fetching agents:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAgents();
//     }, []);

//     return (
//         <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
//             <div className="w-[100%] h-[100%] flex items-center flex-col">
//                 <div className="w-[100%] h-[100px] flex justify-between items-center">
//                     <div>Agents</div>
//                     <div className="w-[160px] h-[30px] flex justify-between items-center border-[2px] border-[#0333ae] border-solid rounded-[5px] pr-[8px]">
//                         <div className="bg-[#0333ae] text-white h-[100%] w-[30px] flex justify-center items-center">
//                             <BsPersonAdd />
//                         </div>
//                         <div className="text-[#0333ae] text-[15px] font-semibold cursor-pointer z-0" onClick={toggleBtn}>
//                             Add Employee
//                         </div>
//                     </div>
//                 </div>
//                 <div className="w-[100%] h-[100%] flex justify-center items-center flex-col z-0">
//                     {loading ? (
//                         <div>Loading...</div> // Loading state while fetching agents
//                     ) : (
//                         agents.length > 0 ? (
//                             agents.map((agent: any) => (
//                                 <AgentSec
//                                     key={agent.id}
//                                     name={`${agent.firstname} ${agent.lastname}`}
//                                     add={agent.address || "Unknown Address"} // Assuming there is no address field in the response
//                                     order={agent.id} // Displaying agent's ID as order for now
//                                     pnumb={agent.phone}
//                                     lastlogin={agent.lastLogin || "No recent login"} // Assuming lastLogin field exists
//                                 />
//                             ))
//                         ) : (
//                             <div>No agents found</div>
//                         )
//                     )}
//                 </div>
//             </div>
//             {show ? <AgentDetails toggleBtn={toggleBtn} /> : null}
//         </div>
//     );
// };

// export default Agents;

