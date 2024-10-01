import React, { useState } from 'react';
import { VscArrowRight, VscChromeClose, VscFileSymlinkFile } from 'react-icons/vsc';
import { BiCamera } from 'react-icons/bi';
import { useUpdateStoreMutation } from '@/services/apiSlice';
import Upload from './UploadDoc';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    category: string;
    cac_number: string;
    cac_document: File | null;
    kyc_document: File | null;
    business_document: File | null;
    utility_bill: File | null;
}

type Iprops = {
    togleBtn: () => void;
    storeUuid: string;  
    updateStoreInList: (updatedStore: any) => void;
    storeDetails: {
        name: string;
        email: string;
        phone: string;
        address: string;
        category: string;
        cac_number: string;
        cac_document: string | null;
        kyc_document: string | null;
        business_document: string | null;
        utility_bill: string | null;
    };
};

const StoreEdit: React.FC<Iprops> = ({ togleBtn, storeUuid, updateStoreInList, storeDetails }) => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: storeDetails.name || '',
        email: storeDetails.email || '',
        phone: storeDetails.phone || '',
        address: storeDetails.address || '',
        category: storeDetails.category || '',
        cac_number: storeDetails.cac_number || '',
        cac_document: null,
        kyc_document: null,
        business_document: null,
        utility_bill: null,
    });
    const [loading, setLoading] = useState(false);

    const [updateStore] = useUpdateStoreMutation();

    const handleCancel = () => {
        togleBtn();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleUpload = () => {
        setShow(!show);
    };

    const handleSubmit = async (e: React.FormEvent | null) => {
        e?.preventDefault();
        setLoading(true);
    
        const updatedFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) {
                updatedFormData.append(key, value);
            }
        });
    
        try {
            const response = await updateStore({ store_uuid: storeUuid, ...formData });
            
            // Update the parent list with the new store data
            updateStoreInList(response);
    
            // Show success notification
            toast.success("Store updated successfully!");
    
            // Close modal after success
            togleBtn(); // This closes the modal when the store is updated successfully
    
        } catch (error: any) {
            console.error('Error updating store:', error.message || error);
            toast.error("Failed to update store.");
        } finally {
            setLoading(false);  // Stop loading after submission
        }
    };
    
    

    return (
        <div className='w-screen h-[100vh] z-20 flex justify-end bg-[#ffffff1f] fixed left-0 top-0 backdrop-blur-sm'>
            <div className='w-[calc(100%-280px)] h-[calc(100%-70px)] pl-[20px] pt-[20px] flex justify-center items-start pb-[30px] mt-[50px]'>
                <div className='w-[56%] py-[30px] h-[550px] pt-[180px] overflow-y-scroll bg-[#f8f7f7] rounded-[10px] flex justify-center items-center border-[1px] border-[#0000ff] border-solid flex-col p-[20px]'>
                    <div className="w-[100%] flex justify-between items-center">
                        <div className='text-[15px]'>Edit Store</div>
                        <div className='text-[red] cursor-pointer' onClick={handleCancel}>
                            <VscChromeClose />
                        </div>
                    </div>
                    <div className='flex justify-center items-center flex-col mb-[20px]'>
                        <div className='w-[100px] h-[100px] flex justify-center items-center rounded-[50%] bg-[#ddd] text-[35px] text-[#0000ff] mb-[20px]'>
                            <BiCamera />
                        </div>
                        <div className='text-[#0000ff] font-semibold'>
                            Store ID - {storeUuid}
                        </div>
                    </div>
                    <div className='w-[100%]'>
                        <form onSubmit={handleSubmit} className='w-[100%] flex flex-col justify-center items-center'>
                            <div className='w-[100%] flex justify-between items-center flex-wrap'>
                                {Object.keys(formData).map((key) => (
                                    key !== 'cac_document' && key !== 'kyc_document' && key !== 'business_document' && key !== 'utility_bill' ? (
                                        <div className='flex flex-col mb-[10px]' key={key}>
                                            <label htmlFor={key} className='text-[13px]'>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                            <input 
                                                type={key === 'email' ? 'email' : 'text'} 
                                                name={key}
                                                className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                                                value={typeof formData[key as keyof FormData] === 'string' ? formData[key as keyof FormData] as string : ''}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    ) : null
                                ))}
                                <div className='flex flex-col mb-[10px]'>
                                    <div className='w-[100%] flex justify-between items-center'>
                                        <div>
                                            <label htmlFor="upload" className='text-[13px] flex'>
                                                <div className='text-[16px] text-[#0000ff] mr-[5px]'>
                                                    <VscFileSymlinkFile />
                                                </div>
                                                Upload
                                            </label>
                                        </div>
                                        <div className='text-[#0000ff] cursor-pointer' onClick={toggleUpload}>
                                            <VscArrowRight />
                                        </div>
                                    </div>
                                    <input 
                                        type="text" 
                                        className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' 
                                        readOnly
                                        value={formData.cac_document?.name || ''}
                                    />
                                </div>

                                <div className='w-[100%] flex justify-end items-center'>
                                <button 
                                    type="submit" 
                                    className={`text-white bg-[#0000ff] px-[20px] py-[5px] rounded-[5px] flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading} // Disable button during loading
                                >
                                    {loading ? 'Updating...' : 'Update Store'}
                                </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {show && (
                <Upload
                togleBtn={toggleUpload}
                onFileChange={(files) => {
                    console.log('Uploaded Files:', {
                        cac_document: files.cacDocument ? files.cacDocument.name : 'No file uploaded',
                        kyc_document: files.kycDocument ? files.kycDocument.name : 'No file uploaded',
                        business_document: files.businessDocument ? files.businessDocument.name : 'No file uploaded',
                        utility_bill: files.utilityBill ? files.utilityBill.name : 'No file uploaded',
                    });
            
                    setFormData((prev) => ({
                        ...prev,
                        cac_document: files.cacDocument || prev.cac_document,
                        kyc_document: files.kycDocument || prev.kyc_document,
                        business_document: files.businessDocument || prev.business_document,
                        utility_bill: files.utilityBill || prev.utility_bill,
                    }));
                }}
                onSubmit={() => handleSubmit(null)} // Call form submission when modal is submitted
                storeDetails={{
                    cacDocument: formData.cac_document?.name || '',
                    kycDocument: formData.kyc_document?.name || '',
                    businessDocument: formData.business_document?.name || '',
                    utilityBill: formData.utility_bill?.name || '',
                }}
                />
            )}
        </div>
    );
};

export default StoreEdit;
