"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Phone, MapPin } from 'lucide-react'

interface CustomerDetails {
  id: string
  name: string
  email: string
  phone: string
  address: string
  avatarUrl: string
}

interface Order {
  id: string
  date: string
  total: number
  status: 'completed' | 'processing' | 'cancelled'
}

const CustomerDetails = () => {
  const { id } = useParams()
  const [customer, setCustomer] = useState<CustomerDetails | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomerData = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock data
      setCustomer({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 890',
        address: '123 Main St, Anytown, AN 12345',
        avatarUrl: 'https://api.dicebear.com/6.x/avataaars/svg?seed=John'
      })
      setOrders([
        { id: 'ORD001', date: '2023-05-15', total: 125.99, status: 'completed' },
        { id: 'ORD002', date: '2023-06-02', total: 79.99, status: 'processing' },
        { id: 'ORD003', date: '2023-06-18', total: 249.99, status: 'completed' },
        { id: 'ORD004', date: '2023-07-01', total: 59.99, status: 'cancelled' },
      ])
      setLoading(false)
    }

    fetchCustomerData()
  }, [id])

  const CustomerInfoSkeleton = () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )

  const OrderSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
    </TableRow>
  )

  return (
    <div className="container mx-auto px-4 py-4 sm:p-6">
      <h1 className="text-[25px] sm:text-2xl font-bold mb-4 sm:mb-6">Customer details</h1>
      
      <Card className="mb-4 sm:mb-6 w-full">
  <CardHeader className="pb-3 sm:pb-6">
    <CardTitle className="text-lg sm:text-xl">
      Customer information
    </CardTitle>
  </CardHeader>

  <CardContent>
    {loading ? (
      <CustomerInfoSkeleton />
    ) : customer ? (
      <div className="flex flex-wrap flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-6">

        {/* Avatar */}
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0">
          <AvatarImage
            src={customer.avatarUrl || "/placeholder.svg"}
            alt={customer.name}
          />
          <AvatarFallback>
            {customer.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* Details */}
        <div className="space-y-2 w-full min-w-0 text-center sm:text-left">
          <p className="text-xl sm:text-2xl font-semibold break-words">
            {customer.name}
          </p>

          <a 
            href={`mailto:${customer.email}`}
            className="flex justify-center sm:justify-start items-start sm:items-center text-xs sm:text-sm text-gray-500 gap-2 hover:text-blue-600 hover:underline cursor-pointer transition-colors duration-200"
          >
            <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="break-all">{customer.email}</span>
          </a>

          <a 
            href={`tel:${customer.phone.replace(/\s+/g, '')}`}
            className="flex justify-center sm:justify-start items-start sm:items-center text-xs sm:text-sm text-gray-500 gap-2 hover:text-blue-600 hover:underline cursor-pointer transition-colors duration-200"
          >
            <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="break-all">{customer.phone}</span>
          </a>

          <p className="flex justify-center sm:justify-start items-start text-xs sm:text-sm text-gray-500 gap-2">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
            <span className="break-words">{customer.address}</span>
          </p>
        </div>
      </div>
    ) : (
      <p className="text-sm text-center sm:text-left">
        No customer data available.
      </p>
    )}
  </CardContent>
      </Card>


      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Order history</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 sm:px-2 text-xs sm:text-sm whitespace-nowrap">Order id</TableHead>
                  <TableHead className="px-4 sm:px-2 text-xs sm:text-sm whitespace-nowrap">Date</TableHead>
                  <TableHead className="px-4 sm:px-2 text-xs sm:text-sm whitespace-nowrap">Total</TableHead>
                  <TableHead className="px-4 sm:px-2 text-xs sm:text-sm whitespace-nowrap">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <>
                    <OrderSkeleton />
                    <OrderSkeleton />
                    <OrderSkeleton />
                  </>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="px-4 sm:px-2 text-xs sm:text-sm whitespace-nowrap font-medium">{order.id}</TableCell>
                      <TableCell className="px-4 sm:px-2 text-xs sm:text-sm whitespace-nowrap">{order.date}</TableCell>
                      <TableCell className="px-4 sm:px-2 text-xs sm:text-sm whitespace-nowrap">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.total)}</TableCell>
                      <TableCell className="px-4 sm:px-2">
                        <Badge
                          style={{
                            backgroundColor: order.status === 'completed' ? '#0333AE' : '',
                            color: order.status === 'completed' ? '#ffffff' : ''
                          }}
                          variant={
                            order.status === 'completed'
                              ? 'default'
                              : order.status === 'processing'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-xs whitespace-nowrap"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-xs sm:text-sm py-4">No orders found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerDetails
