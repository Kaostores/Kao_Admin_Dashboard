"use client"

import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { BiCamera } from 'react-icons/bi'
import { useCreateVendorAccountMutation, useGetCurrenciesQuery } from '@/services/apiSlice'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type IProps = {
  togleBtn: () => void
}

interface CurrencyData {
  currency: string
  country: string
}

const CustomersDetails: React.FC<IProps> = ({ togleBtn }) => {
  const [vendorData, setVendorData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    role: 'user',
    country: '',
    currency: '',
  })

  const [createVendorAccount, { isLoading }] = useCreateVendorAccountMutation()
  const { data: currenciesResponse, isLoading: isLoadingCurrencies, error: currenciesError } = useGetCurrenciesQuery({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVendorData({
      ...vendorData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCurrencyChange = (value: string) => {
    const selectedCurrency = currenciesResponse?.data.find((c: CurrencyData) => c.currency === value)
    setVendorData((prevData) => ({
      ...prevData,
      currency: value,
      country: selectedCurrency?.country || prevData.country,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await createVendorAccount(vendorData).unwrap()
      
      if (response?.success) {
        togleBtn()
        toast.success('Customer added successfully!')
      } else {
        console.error('Failed to add customer')
        toast.error('Failed to add customer.')
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      toast.error('Error creating customer.')
    } finally {
      setLoading(false)
    }
  }

  const currencies = currenciesResponse?.data.map((item: CurrencyData) => item.currency).filter(Boolean) || []

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4'>
      <div className='w-full max-w-[100%] lg:max-w-[40%] bg-white rounded-lg shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4 sm:mb-6'>
          <h2 className='text-lg sm:text-xl font-bold text-[#0333ae]'>Add customer</h2>
          <button onClick={togleBtn} className='text-gray-500 hover:text-[#0333ae] flex-shrink-0'>
            <VscChromeClose size={20} />
          </button>
        </div>
        <div className='flex justify-center items-center flex-col mb-4 sm:mb-6'>
          <div className='w-20 h-20 sm:w-24 sm:h-24 flex justify-center items-center rounded-full bg-gray-200 text-[#0333ae] mb-3 sm:mb-4 flex-shrink-0'>
            <BiCamera size={28} className='sm:text-[36px]' />
          </div>
          <div className='text-[#0333ae] font-semibold text-sm sm:text-base'>Customer id- 0002930</div>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name Fields */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstname' className='text-xs sm:text-sm'>First name</Label>
              <Input
                id='firstname'
                name='firstname'
                value={vendorData.firstname}
                onChange={handleInputChange}
                className='text-sm'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastname' className='text-xs sm:text-sm'>Last name</Label>
              <Input
                id='lastname'
                name='lastname'
                value={vendorData.lastname}
                onChange={handleInputChange}
                className='text-sm'
              />
            </div>
          </div>

          {/* Phone and Email Fields */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='phone' className='text-xs sm:text-sm'>Phone number</Label>
              <Input
                id='phone'
                name='phone'
                value={vendorData.phone}
                onChange={handleInputChange}
                className='text-sm'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-xs sm:text-sm'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={vendorData.email}
                onChange={handleInputChange}
                className='text-sm'
              />
            </div>
          </div>

          {/* Password and Country Fields */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-xs sm:text-sm'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                value={vendorData.password}
                onChange={handleInputChange}
                className='text-sm'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='country' className='text-xs sm:text-sm'>Country</Label>
              <Input
                id='country'
                name='country'
                value={vendorData.country}
                onChange={handleInputChange}
                className='text-sm'
              />
            </div>
          </div>

          {/* Currency Field */}
          <div className='space-y-2'>
            <Label htmlFor='currency' className='text-xs sm:text-sm'>Currency</Label>
            <Select
              value={vendorData.currency}
              onValueChange={handleCurrencyChange}
              disabled={isLoadingCurrencies || !!currenciesError}
            >
              <SelectTrigger className='text-sm'>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCurrencies && (
                  <SelectItem value="loading">Loading currencies...</SelectItem>
                )}
                {currenciesError && (
                  <SelectItem value="error">Error loading currencies</SelectItem>
                )}
                {currencies.length > 0 && currencies.map((currency: string) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
                {!isLoadingCurrencies && !currenciesError && currencies.length === 0 && (
                  <SelectItem value="no-currencies">No currencies available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className='w-full bg-[#0333ae] hover:bg-[#0333ae] text-sm sm:text-base mt-4 sm:mt-6' 
            disabled={loading || isLoading}
          >
            {loading || isLoading ? 'Adding user...' : 'Add user'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CustomersDetails
