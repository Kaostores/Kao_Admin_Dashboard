import { useEffect, useState } from "react";
import { BsPersonAdd } from "react-icons/bs";
import { PiDotsThreeVertical } from "react-icons/pi";
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";
import { GetUsersByType, GetUserAddress, deleteVendorById } from "@/utils/ApiCalls";
import AgentDetails from "@/components/agents/AgentsDetails";
import AgentEdit from "@/components/agents/AgentsEdit";
import { format, parseISO } from 'date-fns';
import { useDeleteVendorByIdMutation } from "@/services/apiSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Agents = () => {
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [popupVisible, setPopupVisible] = useState<string | null>(null);
    const [agentStatus, setAgentStatus] = useState<{ [key: string]: string }>({});
    const [selectedAgent, setSelectedAgent] = useState<any>(null);
    const [deleteVendorById] = useDeleteVendorByIdMutation();
    
    const formatDate = (dateString: string) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'MMMM d, yyyy h:mm a');
        } catch {
            return 'Invalid Date';
        }
    };

    const toggleBtn = () => {
        setShow(!show);
        setShow2(false);
    };

    const handleEditAgent = (agent: any) => {
        setSelectedAgent(agent);
        setShow2(true);
        setShow(false);
    };

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const response = await GetUsersByType("agent");
            if (response?.data?.success) {
                setVendors(response.data.data);

                const statusMap: { [key: string]: string } = {};
                response.data.data.forEach((vendor: any) => {
                    statusMap[vendor.id] = "Not Verified";
                });
                setAgentStatus(statusMap);

                const addressPromises = response.data.data.map(async (agent: any) => {
                    if (agent.address_uuid) {
                        const addressData = await GetUserAddress(agent.address_uuid);
                        return { id: agent.id, address: addressData };
                    }
                    return { id: agent.id, address: "Unknown Address" };
                });

                const addressResults = await Promise.all(addressPromises);
                const addressMap: { [key: string]: any } = {};
                addressResults.forEach((result) => {
                    addressMap[result.id] = result.address;
                });
            } else {
                console.error("Failed to fetch vendors");
            }
        } catch (error) {
            console.error("Error fetching vendors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleDeleteAgent = async (id: string) => {
    
    
    try {
        await deleteVendorById(id).unwrap();         
        setVendors(vendors.filter(vendor => vendor.id !== id));
        toast.success("Agent deleted successfully");
    } catch (error) {
        console.error("Error deleting Agent:", error);
        toast.error("Failed to delete Agent");
    }
};

    const handleAgentUpdate = async () => {
        await fetchAgents(); 
    };

    const handleAgentAdded = () => {
        fetchAgents();
    };

    return (
        <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
            <div className="w-[100%] h-[100%] flex items-center flex-col">
                {/* Header */}
                <div className="w-[100%] h-[100px] flex justify-between items-center">
                    <div>Agents</div>
                    <div className="w-[160px] h-[30px] flex justify-between items-center border-[2px] border-[#0333ae] border-solid rounded-[5px] pr-[8px]">
                        <div className="bg-[#0333ae] text-white h-[100%] w-[30px] flex justify-center items-center">
                            <BsPersonAdd />
                        </div>
                        <div className="text-[#0333ae] text-[15px] font-semibold cursor-pointer z-0" onClick={toggleBtn}>
                            Add Agents
                        </div>
                    </div>
                </div>

                {/* Agents Table */}
                <div className="w-[100%] h-[100%] flex justify-center items-center flex-col z-0">
                    {loading ? (
                        <div>Loading...</div>
                    ) : vendors.length > 0 ? (
                        <div className="overflow-hidden w-[100%] h-[100%]">
                            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Name</th>
                                            <th scope="col" className="px-6 py-3">Address</th>
                                            <th scope="col" className="px-6 py-3">Phone No</th>
                                            <th scope="col" className="px-6 py-3">Country</th>
                                            <th scope="col" className="px-6 py-3">Currency</th>
                                            <th scope="col" className="px-6 py-3">Last Login</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                            <th scope="col" className="px-6 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                        {vendors.map((agent: any) => (
                            <tr key={agent.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${agent.firstname} ${agent.lastname}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.address || "Unknown Address"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.country}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.currency}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {agent.last_login ? formatDate(agent.last_login) : "No recent login"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
    <div
        className={`inline-flex items-center px-2.5 py-2 rounded-lg text-xs font-medium ${
            agentStatus[agent.id] === "Verified"
                ? "bg-green-100 text-green-800"
                : agentStatus[agent.id] === "Suspended"
                ? "bg-gray-100 text-gray-600"
                : "bg-red-100 text-red-600"
        }`}
    >
        {agentStatus[agent.id]}
        <PiDotsThreeVertical
            className="ml-2 text-[#3a3a3a] cursor-pointer text-[16px]"
            onClick={() => setPopupVisible(agent.id)}
        />
    </div>
    {popupVisible === agent.id && (
        <div className="absolute mt-2 w-[120px] bg-white border border-gray-300 rounded shadow-lg z-50">
            <div
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => {
                    setAgentStatus((prevStatus) => ({ ...prevStatus, [agent.id]: "Verified" }));
                    setPopupVisible(null); // Hide the popup
                }}
            >
                Verify
            </div>
        </div>
    )}
</td>

                                <td className="px-[10px] ">
                                    <div className="flex justify-around items-center border-[1px] border-solid border-[black] rounded-[5px]">
                                                        <div
                                                            className="w-[50%] h-[30px] flex justify-center items-center border-r-[1px] border-solid border-[black] text-[#0333ae] cursor-pointer"
                                                            onClick={() => handleEditAgent(agent)}
                                                        >
                                                            <IoPersonAddOutline />
                                                        </div>
                                                        <div onClick={() => handleDeleteAgent(agent.id)} className="w-[50%] h-[100%] cursor-pointer flex justify-center items-center text-[#ff0000]">
                                                            <IoPersonRemoveOutline />
                                                        </div>
                                                    </div>
                                </td>
                            </tr>
                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div>No Agents found</div>
                    )}
                </div>
            </div>

            
            {show && <AgentDetails togleBtn={toggleBtn} onAgentAdded={handleAgentAdded} />}

            
            {show2 && selectedAgent && (
                <AgentEdit 
                    togleBtn2={() => setShow2(false)} 
                    agent={selectedAgent} 
                    onUpdate={handleAgentUpdate} 
                />
            )}
        </div>
    );
};

export default Agents;
