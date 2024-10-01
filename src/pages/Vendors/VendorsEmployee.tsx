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
    <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
      <div className="w-[100%] h-[100%] flex items-center flex-col">
        <div className="w-[100%] h-[100px] flex justify-between items-center">
          <div>Vendors</div>
          {/* <div className="w-[160px] h-[30px] flex justify-between items-center border-[2px] border-[#0333ae] border-solid rounded-[5px] pr-[8px]">
            <div className="bg-[#0333ae] text-white h-[100%] w-[30px] flex justify-center items-center">
              <BsPersonAdd />
            </div>
            <div className="text-[#0333ae] text-[15px] font-semibold cursor-pointer z-0" onClick={toggleBtn}>
              Add Vendors
            </div>
          </div> */}
        </div>

        <div className="w-[100%] h-[100%] flex justify-center items-center flex-col z-0">
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone No</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
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
                      <TableCell className="font-medium">{`${vendor.firstname} ${vendor.lastname}`}</TableCell>
                      <TableCell>{vendor.address || "Unknown Address"}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>{vendor.country}</TableCell>
                      <TableCell>{vendor.currency}</TableCell>
                      <TableCell>
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
                            className="ml-2 text-[#3a3a3a] cursor-pointer text-[16px]"
                            onClick={() => setPopupVisible(vendor.id)}
                          />
                        </div>
                        {popupVisible === vendor.id && (
                          <div className="absolute mt-2 w-[120px] bg-white border border-gray-300 rounded shadow-lg z-50">
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
                      {/* <TableCell>
                        <div className="flex justify-around items-center border-[1px] border-solid border-[black] rounded-[5px]">
                          <div
                            className="w-[50%] h-[30px] flex justify-center items-center border-r-[1px] border-solid border-[black] text-[#0333ae] cursor-pointer"
                            onClick={() => handleEditVendor(vendor)}
                          >
                            <IoPersonAddOutline />
                          </div>
                          <div onClick={() => handleDeleteVendor(vendor.id)} className="w-[50%] h-[100%] cursor-pointer flex justify-center items-center text-[#ff0000]">
                            <IoPersonRemoveOutline />
                          </div>
                        </div>
                      </TableCell> */}
                      <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditVendor(vendor)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteVendor(vendor.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {!loading && (
              <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {Math.ceil(vendors.length / vendorsPerPage)}
                </div>
                <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(vendors.length / vendorsPerPage)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {show && <VendorsDetails togleBtn={toggleBtn} onVendorAdded={fetchVendors} />}
      
      {show2 && selectedVendor && (
        <VendorsEdit 
          togleBtn2={() => setShow2(false)} 
          vendor={selectedVendor} 
          onUpdate={fetchVendors} 
        />
      )}
    </div>
  )
}