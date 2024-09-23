import { useEffect, useState } from "react";
import { BsPersonAdd } from "react-icons/bs";
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";
import { GetUsersByType, GetUserAddress } from "@/utils/ApiCalls";
import CustomerEdit from "../customer/CustomerEdit";
import CustomersDetails from "../customer/CustomersDetails";
import { format, parseISO } from 'date-fns';
import { useDeleteVendorByIdMutation } from "@/services/apiSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerSec = () => {
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [customerStatus, setCustomerStatus] = useState<{ [key: string]: string }>({});
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [deleteVendorById] = useDeleteVendorByIdMutation();

    const formatDate = (dateString: string) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'MMMM d, yyyy h:mm a');
        } catch {
            return 'Invalid Date';
        }
    };

    const toggleBtn = (newCustomer?: any) => {
        setShow(!show);
        setShow2(false);

        if (newCustomer) {
            setCustomers([newCustomer, ...customers]); // Add new customer to the top
        }
    };

    const handleEditCustomer = (customer: any) => {
        setSelectedCustomer(customer);
        setShow2(true);
        setShow(false);
    };

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await GetUsersByType("user");
            if (response?.data?.success) {
                setCustomers(response.data.data);

                const statusMap: { [key: string]: string } = {};
                response.data.data.forEach((customer: any) => {
                    statusMap[customer.id] = customer.status || "Inactive";
                });
                setCustomerStatus(statusMap);

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
                console.error("Failed to fetch customers");
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleCustomerUpdate = async () => {
        await fetchCustomers();
    };

    const handleDeleteVendor = async (id: string) => {
        try {
            await deleteVendorById(id).unwrap();
            setCustomers(customers.filter(customer => customer.id !== id));
            toast.success("Vendor deleted successfully");
        } catch (error) {
            console.error("Error deleting vendor:", error);
            toast.error("Failed to delete vendor");
        }
    };

    return (
        <div className="w-[100%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
            <div className="w-[100%] h-[100%] flex items-center flex-col">
                <div className="w-[100%] h-[100px] flex justify-between items-center">
                    <div>Customers</div>
                    <div className="w-[160px] h-[30px] flex justify-between items-center border-[2px] border-[#0333ae] border-solid rounded-[5px] pr-[8px]">
                        <div className="bg-[#0333ae] text-white h-[100%] w-[30px] flex justify-center items-center">
                            <BsPersonAdd />
                        </div>
                        <div className="text-[#0333ae] text-[15px] font-semibold cursor-pointer z-0" onClick={toggleBtn}>
                            Add Customers
                        </div>
                    </div>
                </div>

                <div className="w-[100%] h-[100%] flex justify-center items-center flex-col z-0">
                    {loading ? (
                        <div>Loading...</div>
                    ) : customers.length > 0 ? (
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
                                    {customers.map((customer: any) => (
                                        <tr key={customer.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${customer.firstname} ${customer.lastname}`}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address || "Unknown Address"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.country}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.currency}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.last_login ? formatDate(customer.last_login) : "No recent login"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div
                                                    className={`px-[30px] py-2 flex justify-center text-[13px] items-center rounded-[5px] ${
                                                        customerStatus[customer.id] === "Verified"
                                                            ? "bg-[#0333ae62] text-[#0333ae]"
                                                            : customerStatus[customer.id] === "Suspended"
                                                            ? "bg-[#dddddd] text-[#797979]"
                                                            : "bg-red-400 text-red-800"
                                                    }`}
                                                >
                                                    <div className="">{customerStatus[customer.id]}</div>
                                                </div>
                                            </td>
                                            <td className="px-[10px]">
                                                <div className="flex justify-around items-center border-[1px] border-solid border-[black] rounded-[5px]">
                                                    <div
                                                        className="w-[50%] h-[30px] flex justify-center items-center border-r-[1px] border-solid border-[black] text-[#0333ae] cursor-pointer"
                                                        onClick={() => handleEditCustomer(customer)}
                                                    >
                                                        <IoPersonAddOutline />
                                                    </div>
                                                    <div onClick={() => handleDeleteVendor(customer.id)} className="w-[50%] h-[100%] cursor-pointer flex justify-center items-center text-[#ff0000]">
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

            {show && <CustomersDetails togleBtn={toggleBtn} />} 

            {show2 && selectedCustomer && (
                <CustomerEdit 
                    togleBtn2={() => setShow2(false)} 
                    customer={selectedCustomer} 
                    onUpdate={handleCustomerUpdate} 
                />
            )}
        </div>
    );
};

export default CustomerSec;
