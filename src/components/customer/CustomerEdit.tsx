import React, { useState, useEffect } from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import { BiCamera } from 'react-icons/bi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import CurrencySelector from '../ui/CurrencySelector';
import { useUpdateAgentMutation } from '@/services/apiSlice';

type Iprops = {
  togleBtn2: () => void;
  customer?: any;
  onUpdate?: () => void;
};

const CustomerEdit: React.FC<Iprops> = ({ togleBtn2, customer, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    country: '',
    currency: '',
  });

  const [updateAgent, { isLoading }] = useUpdateAgentMutation(); // Use the mutation hook

  useEffect(() => {
    if (customer) {
      setFormData({
        firstname: customer.firstname || '',
        lastname: customer.lastname || '',
        phone: customer.phone || '',
        country: customer.country || '',
        currency: customer.currency || '',
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurrencyChange = (selectedCurrency: string, selectedCountry: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      currency: selectedCurrency,
      country: selectedCountry,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      console.error('No customer selected for editing');
      return;
    }

    try {
      const response = await updateAgent({
        user_uuid: customer.id,
        data: {
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
          country: formData.country,
          currency: formData.currency,
        }
      }).unwrap(); // Unwraps the response from the mutation hook
      console.log('Customer updated successfully:', response);
      toast.success('Customer updated successfully!');
      if (onUpdate) onUpdate();
      togleBtn2();
    } catch (error) {
      console.error('Failed to update customer:', error);
      toast.error('Failed to update customer. Please try again.');
    }
  };

  if (!customer) {
    return (
      <div className="w-screen h-[100vh] z-20 flex justify-center items-center bg-[#ffffff1f] fixed left-0 top-0 backdrop-blur-sm">
        <div className="text-red-500">No customer selected for editing</div>
      </div>
    );
  }

  return (
    <div className='w-screen h-[100vh] z-20 flex justify-end bg-[#ffffff1f] fixed left-0 top-0 backdrop-blur-sm'>
      <div className='w-[calc(100%-280px)] h-[calc(100%-70px)] pl-[20px] pt-[20px] flex justify-center items-start pb-[30px] mt-[50px]'>
        <div className='w-[56%] py-[30px] bg-[#f8f7f7] rounded-[10px] flex justify-center items-center border-[1px] border-[#0000ff] border-solid flex-col p-[20px] '>
          <div className='w-[100%] flex justify-between items-center'>
            <div className='text-[15px]'>Edit Customer</div>
            <div className='text-[red] cursor-pointer' onClick={togleBtn2}>
              <VscChromeClose />
            </div>
          </div>
          <div className='flex justify-center items-center flex-col mb-[20px]'>
            <div className='w-[100px] h-[100px] flex justify-center items-center rounded-[50%] bg-[#ddd] text-[35px] text-[#0000ff] mb-[20px]'>
              <BiCamera />
            </div>
            <div className='text-[#0000ff] font-semibold'>
              Customer ID- {customer.id}
            </div>
          </div>
          <div className='w-[100%]'>
            <form className='w-[100%] flex flex-col justify-center items-center' onSubmit={handleSubmit}>
              <div className='w-[100%] flex justify-between items-center flex-wrap'>
                <div className='flex flex-col mb-[10px]'>
                  <label htmlFor="firstname" className='text-[13px]'>First Name</label>
                  <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                </div>
                <div className='flex flex-col mb-[10px]'>
                  <label htmlFor="lastname" className='text-[13px]'>Last Name</label>
                  <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                </div>
                <div className='flex flex-col mb-[10px]'>
                  <label htmlFor="phone" className='text-[13px]'>Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                </div>
                <div className='flex flex-col mb-[10px]'>
                  <label htmlFor="country" className='text-[13px]'>Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]' />
                </div>
                <div className='flex flex-col mb-[10px]'>
                  <label htmlFor="currency" className='text-[13px]'>Currency</label>
                  <div className='w-[250px]'>
                    <CurrencySelector
                      selectedCurrency={formData.currency}
                      setSelectedCurrency={(currency: string) => handleCurrencyChange(currency, formData.country)}
                      setSelectedCountry={(country: string) => setFormData((prevFormData) => ({ ...prevFormData, country }))} 
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className='w-[400px] h-[40px] bg-[#0000ff] text-center mt-[10px] text-white rounded-[5px]' disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerEdit;
