"use client"

import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { BiCamera } from 'react-icons/bi'
import { Eye, EyeOff } from 'lucide-react'
import { useCreateVendorAccountMutation } from '@/services/apiSlice'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import CurrencySelector from "@/components/ui/CurrencySelector"
import CountrySelector from "@/components/ui/CountrySelector"

type Iprops = {
  togleBtn: () => void
  onAgentAdded: () => void
}

const AgentDetails: React.FC<Iprops> = ({ togleBtn, onAgentAdded }) => {
  const [agentData, setAgentData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    role: 'agent',
    country: '',
    currency: '',
  })
  const [createVendorAccount] = useCreateVendorAccountMutation()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentData({
      ...agentData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await createVendorAccount(agentData).unwrap()
      
      if (response?.success) {
        togleBtn()
        onAgentAdded()
        toast.success('Agent added successfully!')
      } else {
        console.error('Failed to add agent')
        toast.error('Failed to add agent.')
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      toast.error('Error creating agent.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4'>
      <div className='w-full max-w-[100%] lg:max-w-[40%] bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors p-4 sm:p-6 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4 sm:mb-6'>
          <h2 className='text-lg sm:text-xl font-bold text-[#0333ae]'>Add Agent</h2>
          <button onClick={togleBtn} className='text-gray-500 hover:text-[#0333ae] flex-shrink-0'>
            <VscChromeClose size={20} />
          </button>
        </div>
        <div className='flex justify-center items-center flex-col mb-4 sm:mb-6'>
          <div className='w-20 h-20 sm:w-24 sm:h-24 flex justify-center items-center rounded-full bg-gray-200 text-[#0333ae] mb-3 sm:mb-4 flex-shrink-0'>
            <BiCamera size={28} className='sm:text-[36px]' />
          </div>
          <div className='text-[#0333ae] font-semibold text-sm sm:text-base'>Agent ID- 0002930</div>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstname' className='text-sm'>First Name</Label>
              <Input
                id='firstname'
                name='firstname'
                value={agentData.firstname}
                onChange={handleInputChange}
                className='text-sm'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastname' className='text-sm'>Last Name</Label>
              <Input
                id='lastname'
                name='lastname'
                value={agentData.lastname}
                onChange={handleInputChange}
                className='text-sm'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phone' className='text-sm'>Phone Number</Label>
              <PhoneInput
                id='phone'
                defaultCountry='NG'
                value={agentData.phone}
                onChange={(value) =>
                  setAgentData((prev) => ({
                    ...prev,
                    phone: value || '',
                  }))
                }
                className='flex h-10 w-full rounded-md border outline-none border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                placeholder='Enter phone number'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-sm'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={agentData.email}
                onChange={handleInputChange}
                className='text-sm'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-sm'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  value={agentData.password}
                  onChange={handleInputChange}
                  className='text-sm pr-10'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((prev) => !prev)}
                  className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500'
                >
                  {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='country' className='text-sm'>Country</Label>
              <CountrySelector
                selectedCountry={agentData.country}
                setSelectedCountry={(country) =>
                  setAgentData((prev) => ({
                    ...prev,
                    country,
                  }))
                }
              />
            </div>
            <div className='space-y-2 sm:col-span-2'>
              <Label htmlFor='currency' className='text-sm'>Currency</Label>
              <CurrencySelector
                selectedCurrency={agentData.currency}
                setSelectedCurrency={(currency: string) =>
                  setAgentData((prev) => ({
                    ...prev,
                    currency,
                  }))
                }
                setSelectedCountry={(country: string) =>
                  setAgentData((prev) => ({
                    ...prev,
                    country,
                  }))
                }
              />
            </div>
          </div>
          <Button type="submit" className='w-full bg-[#0333ae] hover:bg-[#0333ae] text-sm sm:text-base' disabled={loading}>
            {loading ? 'Adding agent...' : 'Add agent'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AgentDetails
