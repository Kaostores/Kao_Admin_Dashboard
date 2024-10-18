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

interface AgentEditProps {
  isOpen: boolean
  onClose: () => void
  vendor?: any
  onUpdate?: () => void
}

const AgentEdit: React.FC<AgentEditProps> = ({ isOpen, onClose, vendor, onUpdate }) => {
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
    if (vendor) {
      setFormData({
        firstname: vendor.firstname || '',
        lastname: vendor.lastname || '',
        phone: vendor.phone || '',
        country: vendor.country || '',
        currency: vendor.currency || '',
      })
    }
  }, [vendor])

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
    if (!vendor) {
      console.error('No vendor selected for editing')
      return
    }

    try {
      const response = await updateAgent({
        user_uuid: vendor.id,
        data: {
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
          country: formData.country,
          currency: formData.currency,
        }
      }).unwrap()
      console.log('Vendor updated successfully:', response)
      toast.success('Vendor updated successfully!')
      if (onUpdate) onUpdate()
      onClose()
    } catch (error) {
      console.error('Failed to update vendor:', error)
      toast.error('Failed to update vendor. Please try again.')
    }
  }

  if (!vendor) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className='text-[#0333AE]'>Edit Vendor</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
            <span className="sr-only hover:text-[#0333AE]">Close</span>
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={vendor.avatarUrl} alt={vendor.firstname} />
              <AvatarFallback>
                <Camera className="h-12 w-12 text-[#0333AE]" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-[#0333AE]">
              Employee ID: {vendor.id}
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
            <Button type="submit" className="w-full bg-[#0333AE] hover:bg-[#0333AE]" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AgentEdit