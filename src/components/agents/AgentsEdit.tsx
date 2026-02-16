/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"
import { useUpdateAgentMutation } from '@/services/apiSlice'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, X } from "lucide-react"
import CurrencySelector from "@/components/ui/CurrencySelector"
import CountrySelector from "@/components/ui/CountrySelector"

interface AgentEditProps {
  isOpen: boolean
  onClose: () => void
  agent?: any
  onUpdate?: () => void
}

const AgentEdit: React.FC<AgentEditProps> = ({ isOpen, onClose, agent, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    country: '',
    currency: '',
  })

  const [updateAgent, { isLoading }] = useUpdateAgentMutation()

  useEffect(() => {
    if (agent) {
      setFormData({
        firstname: agent.firstname || '',
        lastname: agent.lastname || '',
        phone: agent.phone || '',
        country: agent.country || '',
        currency: agent.currency || '',
      })
    }
  }, [agent])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agent) {
      console.error('No agent selected for editing')
      return
    }

    try {
      const response = await updateAgent({
        user_uuid: agent.id,
        data: {
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
          country: formData.country,
          currency: formData.currency,
        }
      }).unwrap()
      console.log('Agent updated successfully:', response)
      toast.success('Agent updated successfully!')
      if (onUpdate) onUpdate()
      onClose()
    } catch (error) {
      console.error('Failed to update agent:', error)
      toast.error('Failed to update agent. Please try again.')
    }
  }

  if (!agent) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-[425px] rounded-lg p-4 sm:p-6">
        <DialogHeader className="flex flex-row items-center justify-between gap-2 mb-4">
          <DialogTitle className='text-lg sm:text-xl font-semibold text-[#0333AE]'>Edit Agent</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 p-0 flex-shrink-0">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Avatar and ID Section */}
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage src={agent.avatarUrl || "/placeholder.svg"} alt={agent.firstname} />
              <AvatarFallback>
                <Camera className="h-8 w-8 sm:h-12 sm:w-12 text-[#0333AE]" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs sm:text-sm font-medium text-[#0333AE] text-center">
              Employee ID: {agent.id}
            </span>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="text-xs sm:text-sm">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname" className="text-xs sm:text-sm">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Phone and Country Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
                <PhoneInput
                  id="phone"
                  defaultCountry="NG"
                  value={formData.phone}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: value || '',
                    }))
                  }
                  className="flex h-10 w-full rounded-md border outline-none border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-xs sm:text-sm">Country</Label>
                <CountrySelector
                  selectedCountry={formData.country}
                  setSelectedCountry={(country) =>
                    setFormData((prev) => ({
                      ...prev,
                      country,
                    }))
                  }
                />
              </div>
            </div>

            {/* Currency Field */}
            <div className="space-y-2">
              <Label htmlFor='currency' className="text-xs sm:text-sm">Currency</Label>
              <CurrencySelector
                selectedCurrency={formData.currency}
                setSelectedCurrency={(currency: string) =>
                  setFormData((prev) => ({
                    ...prev,
                    currency,
                  }))
                }
                setSelectedCountry={(country: string) =>
                  setFormData((prev) => ({
                    ...prev,
                    country,
                  }))
                }
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-[#0333AE] hover:bg-[#0333AE] text-sm sm:text-base mt-4 sm:mt-6" 
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AgentEdit
