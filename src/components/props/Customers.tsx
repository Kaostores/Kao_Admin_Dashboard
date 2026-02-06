/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react"
import { BsPersonAdd } from "react-icons/bs"
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { GetUsersByType, GetUserAddress } from "@/utils/ApiCalls"
import CustomerEdit from "../customer/CustomerEdit"
import CustomersDetails from "../customer/CustomersDetails"
import { format, parseISO } from 'date-fns'
import { useDeleteVendorByIdMutation } from "@/services/apiSlice"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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

export default function CustomerSec() {
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [customerStatus, setCustomerStatus] = useState<{ [key: string]: string }>({})
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [deleteVendorById] = useDeleteVendorByIdMutation()
  const [currentPage, setCurrentPage] = useState(1)
  const customersPerPage = 5

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, 'MMMM d, yyyy h:mm a')
    } catch {
      return 'Invalid Date'
    }
  }

  const toggleBtn = (newCustomer?: any) => {
    setShow(!show)
    setShow2(false)

    if (newCustomer) {
      setCustomers([newCustomer, ...customers])
    }
  }

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setShow2(true)
    setShow(false)
  }

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await GetUsersByType("user")
      if (response?.data?.success) {
        setCustomers(response.data.data)

        const statusMap: { [key: string]: string } = {}
        response.data.data.forEach((customer: any) => {
          statusMap[customer.id] = customer.status || "Inactive"
        })
        setCustomerStatus(statusMap)

        const addressPromises = response.data.data.map(async (customer: any) => {
          if (customer.address_uuid) {
            const addressData = await GetUserAddress(customer.address_uuid)
            return { id: customer.id, address: addressData }
          }
          return { id: customer.id, address: "Unknown Address" }
        })

        await Promise.all(addressPromises)
      } else {
        console.error("Failed to fetch customers")
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleCustomerUpdate = async () => {
    await fetchCustomers()
  }

  const handleDeleteVendor = async (id: string) => {
    try {
      await deleteVendorById(id).unwrap()
      setCustomers(customers.filter(customer => customer.id !== id))
      toast.success("Customer deleted successfully")
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast.error("Failed to delete customer")
    }
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Calculate pagination values
  const indexOfLastCustomer = currentPage * customersPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer)

  return (
    <div className="w-full bg-white px-3 sm:px-5 pt-4 sm:pt-5 pb-8 sm:pb-12 mt-[10px]">
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-1xl sm:text-2xl font-bold">Customers</h1>
          <button 
            onClick={() => toggleBtn()}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[#0333ae] rounded-lg text-[#0333ae] font-semibold hover:bg-[#0333ae] hover:text-white transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            <BsPersonAdd className="text-lg" />
            <span className="text-sm">Add customers</span>
          </button>
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
                  Array.from({ length: customersPerPage }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 8 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  currentCustomers.map((customer: any) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{`${customer.firstname} ${customer.lastname}`}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{customer.address || "Unknown Address"}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{customer.phone}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{customer.country}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{customer.currency}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {customer.last_login ? formatDate(customer.last_login) : "No recent login"}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-2 rounded-lg text-xs font-medium ${
                            customerStatus[customer.id] === "Verified"
                              ? "bg-blue-100 text-[#0333ae]"
                              : customerStatus[customer.id] === "Suspended"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {customerStatus[customer.id]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 sm:gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent" onClick={() => handleEditCustomer(customer)}>
                            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent" onClick={() => handleDeleteVendor(customer.id)}>
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
              Array.from({ length: customersPerPage }).map((_, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            ) : (
              currentCustomers.map((customer: any) => (
                <div key={customer.id} className="bg-white border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-semibold text-sm">{`${customer.firstname} ${customer.lastname}`}</div>
                      <div className="text-xs text-gray-600">{customer.phone}</div>
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                        customerStatus[customer.id] === "Verified"
                          ? "bg-blue-100 text-[#0333ae]"
                          : customerStatus[customer.id] === "Suspended"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {customerStatus[customer.id]}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-700">Address:</span>
                      <div className="truncate">{customer.address || "Unknown Address"}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Country:</span>
                      <div>{customer.country}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Currency:</span>
                      <div>{customer.currency}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Last login:</span>
                      <div className="truncate">
                        {customer.last_login ? formatDate(customer.last_login) : "No recent login"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => handleEditCustomer(customer)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => handleDeleteVendor(customer.id)}>
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
                Page {currentPage} of {Math.ceil(customers.length / customersPerPage)}
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
                  disabled={currentPage === Math.ceil(customers.length / customersPerPage)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {show && 
        <div className="z-[100]">
          <CustomersDetails togleBtn={toggleBtn} />
        </div>
      } 

      {show2 && selectedCustomer && (
        <CustomerEdit 
          isOpen={show2} // Control modal open state
          onClose={() => setShow2(false)} 
          customer={selectedCustomer} 
          onUpdate={handleCustomerUpdate} 
        />
      )}
    </div>
  )
}
