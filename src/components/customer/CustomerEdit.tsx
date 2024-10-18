"use client"

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useUpdateAgentMutation, useGetCurrenciesQuery } from '@/services/apiSlice'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CurrencyData {
  currency: string
  country: string
}

interface CustomerEditProps {
  isOpen: boolean
  onClose: () => void
  customer?: any
  onUpdate?: () => void
}

const CustomerEdit: React.FC<CustomerEditProps> = ({ isOpen, onClose, customer, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    country: '',
    currency: '',
  })

  const [updateAgent, { isLoading }] = useUpdateAgentMutation()
  const { data: currenciesResponse, isLoading: isLoadingCurrencies, error: currenciesError } = useGetCurrenciesQuery({})

  useEffect(() => {
    if (customer) {
      setFormData({
        firstname: customer.firstname || '',
        lastname: customer.lastname || '',
        phone: customer.phone || '',
        country: customer.country || '',
        currency: customer.currency || '',
      })
    }
  }, [customer])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCurrencyChange = (value: string) => {
    const selectedCurrency = currenciesResponse?.data.find((c: CurrencyData) => c.currency === value)
    setFormData((prevData) => ({
      ...prevData,
      currency: value,
      country: selectedCurrency?.country || prevData.country,
    }))
  }

  const currencies = currenciesResponse?.data.map((item: CurrencyData) => item.currency).filter(Boolean) || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customer) {
      console.error('No customer selected for editing')
      return
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
      }).unwrap()
      console.log('Customer updated successfully:', response)
      toast.success('Customer updated successfully!')
      if (onUpdate) onUpdate()
      onClose()
    } catch (error) {
      console.error('Failed to update customer:', error)
      toast.error('Failed to update customer. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className='text-[#0333ae]'>Edit Customer</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 p-0 hover:text-[#0333ae]">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={customer?.avatarUrl} alt={customer?.firstname} />
              <AvatarFallback>
                <Camera className="h-12 w-12 text-[#0333ae]" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-[#0333ae]">
              Customer ID: {customer?.id}
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
              <div className='space-y-2'>
              <Label htmlFor='currency'>Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={handleCurrencyChange}
                disabled={isLoadingCurrencies || !!currenciesError}
              >
                <SelectTrigger>
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
            </div>
            <Button type="submit" className="w-full bg-[#0333ae] hover:bg-[#0333ae]" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomerEdit