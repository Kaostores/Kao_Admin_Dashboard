/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react"
import { PiDotsThreeVertical } from "react-icons/pi"
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { GetUsersByType, GetUserAddress } from "@/utils/ApiCalls"
import VendorsDetails from "@/components/vendors/VendorsDetails"
import VendorsEdit from "@/components/vendors/VendorsEdit"
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDeleteVendorByIdMutation } from "@/services/apiSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function VendorsEmployee() {
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [popupVisible, setPopupVisible] = useState<string | null>(null)
  const [vendorStatus, setVendorStatus] = useState<{ [key: string]: string }>({})
  const [selectedVendor, setSelectedVendor] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const vendorsPerPage = 5
  const [deleteVendorById] = useDeleteVendorByIdMutation()
  
  const handleDeleteVendor = async (id: string) => {
    try {
      await deleteVendorById(id)
      toast.success("Vendor deleted successfully")
      fetchVendors()
    } catch (error) {
      console.error("Error deleting vendor:", error)
      toast.error("Failed to delete vendor")
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, 'MMMM d, yyyy h:mm a')
    } catch {
      return 'Invalid Date'
    }
  }

  const toggleBtn = () => {
    setShow(!show)
    setShow2(false)
  }

  const handleEditVendor = (vendor: any) => {
    setSelectedVendor(vendor)
    setShow2(true)
    setShow(false)
  }

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await GetUsersByType("vendor")
      if (response?.data?.success) {
        setVendors(response.data.data)

        const statusMap: { [key: string]: string } = {}
        response.data.data.forEach((vendor: any) => {
          statusMap[vendor.id] = "Not Verified"
        })
        setVendorStatus(statusMap)

        const addressPromises = response.data.data.map(async (vendor: any) => {
          if (vendor.address_uuid) {
            const addressData = await GetUserAddress(vendor.address_uuid)
            return { id: vendor.id, address: addressData }
          }
          return { id: vendor.id, address: "Unknown Address" }
        })

        await Promise.all(addressPromises)
      } else {
        console.error("Failed to fetch vendors")
      }
    } catch (error) {
      console.error("Error fetching vendors:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Calculate pagination values
  const indexOfLastVendor = currentPage * vendorsPerPage
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage
  const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor)

  return (
    <div className="w-full bg-white px-3 sm:px-5 pt-4 sm:pt-5 pb-8 sm:pb-12 mt-[10px]">
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-1xl sm:text-2xl font-bold">Vendors</h1>
        </div>

        {/* Table Container */}
        <div className="w-full flex flex-col gap-4 z-0">
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Name</TableHead>
                  <TableHead className="text-xs sm:text-sm">Address</TableHead>
                  <TableHead className="text-xs sm:text-sm">Phone no</TableHead>
                  <TableHead className="text-xs sm:text-sm">Country</TableHead>
                  <TableHead className="text-xs sm:text-sm">Currency</TableHead>
                  <TableHead className="text-xs sm:text-sm">Last login</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: vendorsPerPage }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 8 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  currentVendors.map((vendor: any) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{`${vendor.firstname} ${vendor.lastname}`}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{vendor.address || "Unknown Address"}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{vendor.phone}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{vendor.country}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{vendor.currency}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {vendor.last_login ? formatDate(vendor.last_login) : "No recent login"}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-2 rounded-lg text-xs font-medium ${
                            vendorStatus[vendor.id] === "Verified"
                              ? "bg-green-100 text-green-800"
                              : vendorStatus[vendor.id] === "Suspended"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {vendorStatus[vendor.id]}
                          <PiDotsThreeVertical
                            className="ml-2 text-gray-700 cursor-pointer text-base"
                            onClick={() => setPopupVisible(vendor.id)}
                          />
                        </div>
                        {popupVisible === vendor.id && (
                          <div className="absolute mt-2 w-28 bg-white border border-gray-300 rounded shadow-lg z-50">
                            <div
                              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setVendorStatus((prevStatus) => ({ ...prevStatus, [vendor.id]: "Verified" }))
                                setPopupVisible(null)
                              }}
                            >
                              Verify
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 sm:gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent" onClick={() => handleEditVendor(vendor)}>
                            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent" onClick={() => handleDeleteVendor(vendor.id)}>
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {loading ? (
              Array.from({ length: vendorsPerPage }).map((_, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            ) : (
              currentVendors.map((vendor: any) => (
                <div key={vendor.id} className="bg-white border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-semibold text-sm">{`${vendor.firstname} ${vendor.lastname}`}</div>
                      <div className="text-xs text-gray-600">{vendor.phone}</div>
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                        vendorStatus[vendor.id] === "Verified"
                          ? "bg-green-100 text-green-800"
                          : vendorStatus[vendor.id] === "Suspended"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {vendorStatus[vendor.id]}
                      <PiDotsThreeVertical
                        className="ml-1 cursor-pointer text-sm"
                        onClick={() => setPopupVisible(vendor.id)}
                      />
                      {popupVisible === vendor.id && (
                        <div className="absolute mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg z-50">
                          <div
                            className="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              setVendorStatus((prevStatus) => ({ ...prevStatus, [vendor.id]: "Verified" }))
                              setPopupVisible(null)
                            }}
                          >
                            Verify
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-700">Address:</span>
                      <div className="truncate">{vendor.address || "Unknown Address"}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Country:</span>
                      <div>{vendor.country}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Currency:</span>
                      <div>{vendor.currency}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Last login:</span>
                      <div className="truncate">
                        {vendor.last_login ? formatDate(vendor.last_login) : "No recent login"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => handleEditVendor(vendor)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => handleDeleteVendor(vendor.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Page {currentPage} of {Math.ceil(vendors.length / vendorsPerPage)}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs bg-transparent"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs bg-transparent"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(vendors.length / vendorsPerPage)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {show && <VendorsDetails togleBtn={toggleBtn} onVendorAdded={fetchVendors} />}
      
      {show2 && selectedVendor && (
        <VendorsEdit 
          isOpen={show2}
          onClose={() => setShow2(false)} 
          vendor={selectedVendor} 
          onUpdate={fetchVendors} 
        />
      )}
    </div>
  )
}
