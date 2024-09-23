import React, { useState } from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import { BiCamera } from 'react-icons/bi';
import { useCreateVendorAccountMutation } from '@/services/apiSlice';
import CurrencySelector from '../ui/CurrencySelector'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Iprops = {
  togleBtn: () => void;
  onAgentAdded: () => void;
};

const AgentDetails: React.FC<Iprops> = ({ togleBtn, onAgentAdded }) => {

  const [agentData, setAgentData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    password: 'password', 
    role: 'agent', 
    country: 'Nigerian',
    currency: 'NGN',
  });
   const [createVendorAccount] = useCreateVendorAccountMutation(); // Use mutation hook
  const [loading, setLoading] = useState(false);

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentData({
      ...agentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCurrencyChange = (selectedCurrency: string, selectedCountry: string) => {
    setAgentData((prevData) => ({
      ...prevData,
      currency: selectedCurrency,
      country: selectedCountry,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createVendorAccount({
        ...agentData,
        country: agentData.country,
        currency: agentData.currency,
      }).unwrap();
      
      if (response?.success) {
        togleBtn();
        onAgentAdded()
        toast.success('Customer added successfully!');
      } else {
        console.error('Failed to add customer');
        toast.error('Failed to add customer.');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Error creating customer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-screen h-[100vh] z-20 flex justify-end bg-[#ffffff1f] fixed left-0 top-0 backdrop-blur-sm'>
      <div className='w-[calc(100%-280px)] h-[calc(100%-70px)] pl-[20px] pt-[20px] flex justify-center items-start pb-[30px] mt-[50px]'>
        <div className='w-[56%] py-[30px] bg-[#f8f7f7] rounded-[10px] flex justify-center items-center border-[1px] border-[#0000ff] border-solid flex-col p-[20px] '>
          <div className='w-[100%] flex justify-between items-center'>
            <div className='text-[15px]'>Add Vendors</div>
            <div className='text-[red] cursor-pointer' onClick={togleBtn}>
              <VscChromeClose />
            </div>
          </div>
          <div className='flex justify-center items-center flex-col mb-[20px]'>
            <div className='w-[100px] h-[100px] flex justify-center items-center rounded-[50%] bg-[#ddd] text-[35px] text-[#0000ff] mb-[20px]'>
              <BiCamera />
            </div>
            <div className=' text-[#0000ff] font-semibold'>Agent ID- 0002930</div>
          </div>
          <div className='w-[100%]'>
            <form onSubmit={handleSubmit} className='w-[100%] flex flex-col justify-center items-center'>
              <div className='w-[100%] flex justify-between items-center flex-wrap'>
                <div className='flex flex-col mb-[10px]'>
                  <label htmlFor='firstname' className='text-[13px]'>First Name</label>
                  <input
                    type='text'
                    name='firstname'
                    value={agentData.firstname}
                    onChange={handleInputChange}
                    className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                  />
                </div>
                <div className='flex flex-col mb-[10px]'>
                  <label htmlFor='lastname' className='text-[13px]'>Last Name</label>
                  <input
                    type='text'
                    name='lastname'
                    value={agentData.lastname}
                    onChange={handleInputChange}
                    className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                  />
                </div>
                <div className='flex flex-col mb-[10px]'>
                  <label htmlFor='phone' className='text-[13px]'>Phone Number</label>
                  <input
                    type='text'
                    name='phone'
                    value={agentData.phone}
                    onChange={handleInputChange}
                    className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                  />
                </div>
                <div className='flex flex-col mb-[10px]'>
                  <label htmlFor='email' className='text-[13px]'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={agentData.email}
                    onChange={handleInputChange}
                    className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                  />
                </div>
                <div className='flex flex-col mb-[10px]'>
                  <label htmlFor='address' className='text-[13px]'>password</label>
                  <input
                    type='text'
                    name='password'
                    value={agentData.password}
                    onChange={handleInputChange}
                    className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                  />
                </div>
                <div className='flex-col mb-[10px] hidden' >
                  <label htmlFor='address' className='text-[13px]'>role</label>
                  <input
                    type='text'
                    name='role'
                    value={agentData.role}
                    onChange={handleInputChange}
                    className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                  />
                </div>
                <div className='flex flex-col mb-[10px] '>
                  <label htmlFor='address' className='text-[13px]'>country</label>
                  <input
                    type='text'
                    name='country'
                    value={agentData.country}
                    onChange={(e) => {
                      setAgentData({ ...agentData, country: e.target.value });
                    }}
                    className='w-[250px] py-[5px] px-[6px] outline-[0px] border-[1px] border-solid border-[#868484] rounded-[5px] text-[14px]'
                  />
                </div>
                <div className='flex flex-col mb-[10px]'>
                  <label htmlFor='address' className='text-[13px]'>currency</label>
                  <div className='w-[250px]'>
                    <CurrencySelector
                    selectedCurrency={agentData.currency}
                    setSelectedCurrency={(currency: string) => handleCurrencyChange(currency, agentData.country)}
                    setSelectedCountry={(country: string) => setAgentData((prevData) => ({ ...prevData, country }))}
                  />
                  </div>
                </div>
              </div>
              <button className='w-[400px] h-[40px] bg-[#0000ff] text-center mt-[10px] text-white rounded-[5px]'>
                {loading ? 'Adding Agent...' : 'Add Agent'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
