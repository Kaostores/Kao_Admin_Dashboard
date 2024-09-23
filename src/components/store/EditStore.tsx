import React, { useState, useEffect } from 'react';
import { VscArrowRight, VscChromeClose, VscFileSymlinkFile } from 'react-icons/vsc';
import { BiCamera } from 'react-icons/bi';
import { useGetStoreByIdQuery, useUpdateStoreMutation } from '@/services/apiSlice';
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
    togleBtn: any;
    storeUuid: string;  
    updateStoreInList: (updatedStore: any) => void;
};

const StoreEdit: React.FC<Iprops> = ({ togleBtn, storeUuid, updateStoreInList }) => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    cac_number: '',
    cac_document: null,
    kyc_document: null,
    business_document: null,
    utility_bill: null,
});

    const { data: store, isLoading, isError } = useGetStoreByIdQuery(storeUuid);
    const [updateStore] = useUpdateStoreMutation();

    useEffect(() => {
        if (store) {
            setFormData({
                name: store.name,
                email: store.email,
                phone: store.phone,
                address: store.address,
                category: store.category,
                cac_number: store.cac_number,
                cac_document: null, 
                kyc_document: null,
                business_document: null,
                utility_bill: null,
            });
        }
    }, [store]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await updateStore({ ...formData, id: storeUuid });
            if (response.data) {
                updateStoreInList(response.data);
                togleBtn();
                toast.success("Store updated successfully!");
            }
        } catch (error) {
            console.error('Error updating store:', error);
            toast.error("Failed to update store.");
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading store details.</div>;

    return (
        <div className='w-screen h-[100vh] z-20 flex justify-end bg-[#ffffff1f] fixed left-0 top-0 backdrop-blur-sm'>
            <div className='w-[calc(100%-280px)] h-[calc(100%-70px)] pl-[20px] pt-[20px] flex justify-center items-start pb-[30px] mt-[50px]'>
                <div className='w-[56%] py-[30px] bg-[#f8f7f7] rounded-[10px] flex justify-center items-center border-[1px] border-[#0000ff] border-solid flex-col p-[20px]'>
                    <div className="w-[100%] flex justify-between items-center">
                        <div className='text-[15px]'>Edit Store</div>
                        <div className='text-[red] cursor-pointer' onClick={togleBtn}>
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
                                <div className='flex flex-col mb-[10px]'>
                                    <label htmlFor="name" className='text-[13px]'>Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className='flex flex-col mb-[10px]'>
                                    <label htmlFor="email" className='text-[13px]'>Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className='flex flex-col mb-[10px]'>
                                    <label htmlFor="phone" className='text-[13px]'>Phone Number</label>
                                    <input 
                                        type="text" 
                                        name="phone"
                                        className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className='flex flex-col mb-[10px]'>
                                    <label htmlFor="address" className='text-[13px]'>Address</label>
                                    <input 
                                        type="text" 
                                        name="address"
                                        className='w-[553px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

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
                                    />
                                </div>

                                <div className='w-[100%] flex justify-end items-center'>
                                    <button 
                                        type="submit" 
                                        className='text-white bg-[#0000ff] px-[20px] py-[5px] rounded-[5px]'
                                    >
                                        Update Store
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
                        setFormData((prev) => ({
                            ...prev,
                            cac_document: files.cacDocument || null,
                            kyc_document: files.kycDocument || null,
                            business_document: files.businessDocument || null,
                            utility_bill: files.utilityBill || null,
                        }));
                    }}
                    onSubmit={() => {
            handleSubmit({} as React.FormEvent); 
        }} 
                    storeDetails={{
                        cacDocument: formData.cac_document?.name || '',
                        kycDocument: formData.kyc_document?.name || '',
                        businessDocument: formData.business_document?.name || '',
                        utilityBill: formData.utility_bill?.name || ''
                    }}
                />
            )}
        </div>
    );
};

export default StoreEdit;
