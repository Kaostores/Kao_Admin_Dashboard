/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useEffect } from "react"
import { BiCamera } from "react-icons/bi"
import { useGetStoreByIdQuery, useUpdateStoreMutation } from "@/services/apiSlice"
import Upload from "./UploadDoc"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  category: string
  cac_number: string
  cac_document: string | File | null
  kyc_document: string | File | null
  business_document: string | File | null
  utility_bill: string | File | null
}

interface StoreEditProps {
  isOpen: boolean
  onClose: () => void
  storeUuid: string
  updateStoreInList: (updatedStore: any) => void
  storeDetails?: {
    name?: string
    email?: string
    phone?: string
    address?: string
    category?: string
    cac_number?: string
    cac_document?: string | null
    kyc_document?: string | null
    business_document?: string | null
    utility_bill?: string | null
  }
}

const StoreEdit: React.FC<StoreEditProps> = ({
  isOpen,
  onClose,
  storeUuid,
  updateStoreInList,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const { data: storeData } = useGetStoreByIdQuery(storeUuid)

  console.log("single store data", storeData?.data)
  const [formData, setFormData] = useState<FormData>({
    name: storeData?.data?.name || "",
    email: storeData?.data?.email || "",
    phone: storeData?.data?.phone || "",
    address: storeData?.data?.address || "",
    category: storeData?.data?.category || "",
    cac_number: storeData?.data?.cac_number || "",
    cac_document: storeData?.data?.cac_document || null,
    kyc_document: storeData?.data?.kyc_document || null,
    business_document: storeData?.data?.business_document || null,
    utility_bill: storeData?.data?.utility_bill || null,
  })
  const [loading, setLoading] = useState(false)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  const [updateStore] = useUpdateStoreMutation()

  useEffect(() => {
    if (storeData?.data) {
      const data = storeData.data as any
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        category: data.category || "",
        cac_number: data.cac_number || "",
        cac_document: data.cac_document || null,
        kyc_document: data.kyc_document || null,
        business_document: data.business_document || null,
        utility_bill: data.utility_bill || null,
      })
    }
  }, [storeData])

  useEffect(() => {
    const isValid = Object.keys(formData).every((key) => {
      if (
        key === "cac_document" ||
        key === "kyc_document" ||
        key === "business_document" ||
        key === "utility_bill"
      ) {
        return true
      }
      return formData[key as keyof FormData]?.toString().trim() !== ""
    })
    setIsSubmitDisabled(!isValid)
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent | null) => {
    e?.preventDefault()
    setLoading(true)

    const updatedFormData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        updatedFormData.append(key, value as string | Blob)
      }
    })

    try {
      const response = await updateStore({
        store_uuid: storeUuid,
        ...formData,
      }).unwrap()

      updateStoreInList(response)
      toast.success("Store updated successfully!")
      onClose()
    } catch (error: any) {
      console.error("Error updating store:", error.message || error)
      toast.error("Failed to update store.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[350px] max-w-2xl max-h-[90vh] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl pb-[40px]">Edit Store</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-auto max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4 flex-wrap sm:space-y-6 p-4 sm:p-0">
            {/* <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <p className="text-sm sm:text-base text-gray-600">
                Store ID - <span className="font-semibold">{storeUuid}</span>
              </p>
            </div> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {Object.keys(formData).map((key) =>
                key !== "cac_document" &&
                key !== "kyc_document" &&
                key !== "business_document" &&
                key !== "utility_bill" ? (
                  <div key={key} className="flex flex-col gap-2">
                    <Label htmlFor={key} className="text-sm sm:text-base font-medium">
                      {key
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Label>
                    <Input
                      id={key}
                      name={key}
                      value={formData[key as keyof FormData] as string}
                      onChange={handleChange}
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                ) : null
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUploadModal(!showUploadModal)}
                className="w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11 flex items-center justify-center gap-2"
              >
                <BiCamera className="w-4 h-4 sm:w-5 sm:h-5" />
                Upload
              </Button>

              <Button
                type="submit"
                disabled={isSubmitDisabled || loading}
                className="w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11 flex items-center justify-center gap-2"
              >
                {loading ? "Updating..." : "Update Store"}
              </Button>
            </div>
          </form>
        </ScrollArea>

        {showUploadModal && (
          <Upload
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onFileChange={(files) => {
              setFormData((prev) => ({
                ...prev,
                cac_document: files.cacDocument || prev.cac_document,
                kyc_document: files.kycDocument || prev.kyc_document,
                business_document: files.businessDocument || prev.business_document,
                utility_bill: files.utilityBill || prev.utility_bill,
              }))
            }}
            onSubmit={() => handleSubmit(null)}
            storeDetails={{
              cacDocument:
                typeof formData.cac_document === "string"
                  ? formData.cac_document.replace(/`/g, "").trim()
                  : formData.cac_document?.name || "",
              kycDocument:
                typeof formData.kyc_document === "string"
                  ? formData.kyc_document.replace(/`/g, "").trim()
                  : formData.kyc_document?.name || "",
              businessDocument:
                typeof formData.business_document === "string"
                  ? formData.business_document.replace(/`/g, "").trim()
                  : formData.business_document?.name || "",
              utilityBill:
                typeof formData.utility_bill === "string"
                  ? formData.utility_bill.replace(/`/g, "").trim()
                  : formData.utility_bill?.name || "",
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default StoreEdit
