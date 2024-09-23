import { useEffect, useState } from "react";
import { BsPersonAdd } from "react-icons/bs";
import { PiDotsThreeVertical } from "react-icons/pi";
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";
import { GetUsersByType, GetUserAddress } from "@/utils/ApiCalls";
import VendorsDetails from "@/components/vendors/VendorsDetails";
import VendorsEdit from "@/components/vendors/VendorsEdit";
import { format, parseISO } from 'date-fns';
import ReactPaginate from "react-paginate";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useDeleteVendorByIdMutation } from "@/services/apiSlice";

const VendorsEmployee = () => {
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [popupVisible, setPopupVisible] = useState<string | null>(null);
    const [vendorStatus, setVendorStatus] = useState<{ [key: string]: string }>({});
    const [selectedVendor, setSelectedVendor] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const vendorsPerPage = 5;
    const [deleteVendorById] = useDeleteVendorByIdMutation();
    
    const handleDeleteVendor = async (id: string) => {
    
    
    try {
        await deleteVendorById(id).unwrap();         
        setVendors(vendors.filter(vendor => vendor.id !== id));
        toast.success("Vendor deleted successfully");
    } catch (error) {
        console.error("Error deleting vendor:", error);
        toast.error("Failed to delete vendor");
    }
};

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

    const handleEditVendor = (vendor: any) => {
        setSelectedVendor(vendor);
        setShow2(true);
        setShow(false);
    };

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const response = await GetUsersByType("vendor");
            if (response?.data?.success) {
                setVendors(response.data.data);

                const statusMap: { [key: string]: string } = {};
                response.data.data.forEach((vendor: any) => {
                    statusMap[vendor.id] = "Not Verified";
                });
                setVendorStatus(statusMap);

                const addressPromises = response.data.data.map(async (vendor: any) => {
                    if (vendor.address_uuid) {
                        const addressData = await GetUserAddress(vendor.address_uuid);
                        return { id: vendor.id, address: addressData };
                    }
                    return { id: vendor.id, address: "Unknown Address" };
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

    const handleVendorAdded = () => {
        fetchVendors();
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    

    const handleAgentUpdate = async () => {
        await fetchVendors(); 
    };

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    // Calculate pagination values
    const offset = currentPage * vendorsPerPage;
    const currentVendors = vendors.slice(offset, offset + vendorsPerPage);
    const pageCount = Math.ceil(vendors.length / vendorsPerPage);

    return (
        <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
            <div className="w-[100%] h-[100%] flex items-center flex-col">

                <div className="w-[100%] h-[100px] flex justify-between items-center">
                    <div>Vendors</div>
                    <div className="w-[160px] h-[30px] flex justify-between items-center border-[2px] border-[#0333ae] border-solid rounded-[5px] pr-[8px]">
                        <div className="bg-[#0333ae] text-white h-[100%] w-[30px] flex justify-center items-center">
                            <BsPersonAdd />
                        </div>
                        <div className="text-[#0333ae] text-[15px] font-semibold cursor-pointer z-0" onClick={toggleBtn}>
                            Add Vendors
                        </div>
                    </div>
                </div>

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
                        {currentVendors.map((vendor: any) => (
                            <tr key={vendor.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${vendor.firstname} ${vendor.lastname}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.address || "Unknown Address"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.country}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.currency}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {vendor.last_login ? formatDate(vendor.last_login) : "No recent login"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
    <div
        className={`inline-flex items-center px-2.5 py-2 rounded-lg text-xs font-medium ${
            vendorStatus[vendor.id] === "Verified"
                ? "bg-green-100 text-green-800"
                : vendorStatus[vendor.id] === "Suspended"
                ? "bg-gray-100 text-gray-600"
                : "bg-red-100 text-red-600"
        }`}
    >
        {vendorStatus[vendor.id]}
        <PiDotsThreeVertical
            className="ml-2 text-[#3a3a3a] cursor-pointer text-[16px]"
            onClick={() => setPopupVisible(vendor.id)}
        />
    </div>
    {popupVisible === vendor.id && (
        <div className="absolute mt-2 w-[120px] bg-white border border-gray-300 rounded shadow-lg z-50">
            <div
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => {
                    setVendorStatus((prevStatus) => ({ ...prevStatus, [vendor.id]: "Verified" }));
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
                                                            onClick={() => handleEditVendor(vendor)}
                                                        >
                                                            <IoPersonAddOutline />
                                                        </div>
                                                        <div onClick={() => handleDeleteVendor(vendor.id)} className="w-[50%] h-[100%] cursor-pointer flex justify-center items-center text-[#ff0000]">
                                                            <IoPersonRemoveOutline />
                                                        </div>
                                                    </div>
                                </td>
                            </tr>
                        ))}
                                    </tbody>
                                </table>

                                <div className="mt-4 w-[100%] flex justify-center">
                                    <ReactPaginate
                                        previousLabel={"Previous"}
                                        nextLabel={"Next"}
                                        breakLabel={"..."}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handlePageClick}
                                        containerClassName="flex space-x-2"
                                        pageClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                                        previousClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                                        nextClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                                        breakClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                                        activeClassName="bg-blue-500 text-white border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>No vendors found</div>
                    )}
                </div>
            </div>

            {show && <VendorsDetails togleBtn={toggleBtn} onVendorAdded={handleVendorAdded} />}
            
            {show2 && selectedVendor && (
                <VendorsEdit 
                    togleBtn2={() => setShow2(false)} 
                    vendor={selectedVendor} 
                    onUpdate={handleAgentUpdate} 
                />
            )}
        </div>
    );
};

export default VendorsEmployee;
