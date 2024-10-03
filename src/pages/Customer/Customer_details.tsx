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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customer details</h1>
      
      <Card className="mb-6 w-[50%]">
        <CardHeader>
          <CardTitle>Customer information</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <CustomerInfoSkeleton />
          ) : customer ? (
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <Avatar className="h-24 w-24 mb-4 md:mb-0">
                <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <p className="text-2xl font-semibold">{customer.name}</p>
                <p className="flex items-center text-sm text-gray-500">
                  <Mail className="mr-2 h-4 w-4" />
                  {customer.email}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <Phone className="mr-2 h-4 w-4" />
                  {customer.phone}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <MapPin className="mr-2 h-4 w-4" />
                  {customer.address}
                </p>
              </div>
            </div>
          ) : (
            <p>No customer data available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order history</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order id</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
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
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.total)}</TableCell>
                    <TableCell>
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
                    >
                        {order.status}
                    </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No orders found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerDetails