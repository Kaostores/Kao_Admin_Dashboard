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

  const navigate = useNavigate() // Initialize navigate hook

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
    navigate(`/app/admin/customer/${encodeURIComponent(orderId)}`);
  };

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
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="flex items-center mb-4">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="ghost" className="ml-2">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store name</TableHead>
              <TableHead>Customer name</TableHead>
              <TableHead>Time/Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment method</TableHead>
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
                  className="cursor-pointer"
                  onClick={() => handleOrderClick(order.customerId)} // Handle row click
                >
                  <TableCell className="font-medium">{order.storeId}</TableCell>
                  <TableCell>{order.customerId}</TableCell>
                  <TableCell>{order.timeDate}</TableCell>
                  <TableCell>{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.amount)}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.ceil(filteredOrders.length / ordersPerPage)}
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
            disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
          </div>
        </div>
      )}
    </div>
  )
}
