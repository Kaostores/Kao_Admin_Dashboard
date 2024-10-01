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
    <div className="w-[100%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
      <div className="w-[100%] h-[100%] flex items-center flex-col">
        <div className="w-[100%] h-[100px] flex justify-between items-center">
          <div>Customers</div>
          <div className="w-[160px] h-[30px] flex justify-between items-center border-[2px] border-[#0333ae] border-solid rounded-[5px] pr-[8px]">
            <div className="bg-[#0333ae] text-white h-[100%] w-[30px] flex justify-center items-center">
              <BsPersonAdd />
            </div>
            <div className="text-[#0333ae] text-[15px] font-semibold cursor-pointer z-0" onClick={() => toggleBtn()}>
              Add Customers
            </div>
          </div>
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
                      <TableCell>{`${customer.firstname} ${customer.lastname}`}</TableCell>
                      <TableCell>{customer.address || "Unknown Address"}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.country}</TableCell>
                      <TableCell>{customer.currency}</TableCell>
                      <TableCell>{customer.last_login ? formatDate(customer.last_login) : "No recent login"}</TableCell>
                      <TableCell>
                        <div
                          className={`px-[30px] py-2 flex justify-center text-[13px] items-center rounded-[5px] ${
                            customerStatus[customer.id] === "Verified"
                              ? "bg-[#0333ae62] text-[#0333ae]"
                              : customerStatus[customer.id] === "Suspended"
                              ? "bg-[#dddddd] text-[#797979]"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <div>{customerStatus[customer.id]}</div>
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex justify-around items-center border-[1px] border-solid border-[black] rounded-[5px]">
                          <div
                            className="w-[50%] h-[30px] flex justify-center items-center border-r-[1px] border-solid border-[black] text-[#0333ae] cursor-pointer"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <IoPersonAddOutline />
                          </div>
                          <div onClick={() => handleDeleteVendor(customer.id)} className="w-[50%] h-[100%] cursor-pointer flex justify-center items-center text-[#ff0000]">
                            <IoPersonRemoveOutline />
                          </div>
                        </div>
                      </TableCell> */}
                      <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="icon" onClick={() => handleEditCustomer(customer)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteVendor(customer.id)}>
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
                  Page {currentPage} of {Math.ceil(customers.length / customersPerPage)}
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
                  disabled={currentPage === Math.ceil(customers.length / customersPerPage)}
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

      {show && <CustomersDetails togleBtn={toggleBtn} />} 

      {show2 && selectedCustomer && (
        <CustomerEdit 
          togleBtn2={() => setShow2(false)} 
          customer={selectedCustomer} 
          onUpdate={handleCustomerUpdate} 
        />
      )}
    </div>
  )
}