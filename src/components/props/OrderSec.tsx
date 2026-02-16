/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react'
import { GetOrders } from '@/utils/ApiCalls'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Order {
  orderId: string
  storeId: string
  customerId: string
  timeDate: string
  amount: number
  paymentMethod: string
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [ordersPerPage] = useState<number>(5)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await GetOrders()
        const ordersData = response.data.data.map((order: any) => ({
          orderId: order.id,
          storeId: order.store?.name || 'Unknown Store',
          customerId: order.shippingAddress?.fullname || 'Unknown Customer',
          timeDate: new Date(order.orderDate).toLocaleString(),
          amount: order.totalPrice,
          paymentMethod: order.paymentMethod
        }))
        setOrders(ordersData)
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching orders:", err.response?.data || err.message || err)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleOrderClick = (orderId: string) => {
    navigate(`/app/admin/orders/${encodeURIComponent(orderId)}`)
  }

  const filteredOrders = orders.filter(order =>
    order.storeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
    </TableRow>
  )

  return (
    <div className="w-full min-h-screen bg-white px-3 sm:px-5 sm:pb-2">
      <div className="w-full flex flex-col gap-4 ">
        <h1 className="text-xl sm:text-3xl font-bold">Orders</h1>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm flex-1 sm:max-w-sm"
          />
          <Button variant="ghost" size="icon" className="bg-transparent">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Store name</TableHead>
                <TableHead className="text-xs sm:text-sm">Customer name</TableHead>
                <TableHead className="text-xs sm:text-sm hidden md:table-cell">Time/Date</TableHead>
                <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Payment method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : (
                currentOrders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleOrderClick(order.orderId)}
                  >
                    <TableCell className="text-xs sm:text-sm font-medium">{order.storeId}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{order.customerId}</TableCell>
                    <TableCell className="text-xs sm:text-sm hidden md:table-cell">{order.timeDate}</TableCell>
                    <TableCell className="text-xs sm:text-sm font-medium">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.amount)}</TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{order.paymentMethod}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Page {currentPage} of {Math.ceil(filteredOrders.length / ordersPerPage)}
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
                disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
