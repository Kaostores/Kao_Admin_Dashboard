/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { GetOrderDetails } from "@/utils/ApiCalls"
import { Mail, Phone, MapPin, Package, CreditCard, Truck } from "lucide-react"

interface OrderTotal {
  subtotal: number
  discount: number
  total: number
}

interface OrderUser {
  firstname: string
  lastname: string
  email: string
  phone: string
  id: string
}

interface OrderStore {
  name: string
  email: string
  phone: string
  status: string
  vendor: string
  id: string
}

interface ProductMedia {
  url: string
  id: string
}

interface Product {
  name: string
  media: ProductMedia[]
  id: string
}

interface OrderItem {
  product: Product
  quantity: number
  variant: any
  price: number
  id: string
}

interface ShippingAddress {
  fullname: string
  phone: string
  address: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  owner: string
  id: string
}

interface OrderDetailsData {
  orderTotal: OrderTotal
  user: OrderUser
  store: OrderStore
  items: OrderItem[]
  totalPrice: number
  appliedCoupon: string | null
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  shippingAddress: ShippingAddress
  orderDate: string
  createdAt: string
  updatedAt: string
  id: string
}

const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder] = useState<OrderDetailsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return
      try {
        setLoading(true)
        setError(null)
        const response = await GetOrderDetails(id)
        if (response?.success && response.data) {
          setOrder(response.data as OrderDetailsData)
        } else if (response?.data) {
          setOrder(response.data as OrderDetailsData)
        } else {
          setError("Unable to load order details")
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  const SummarySkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-28" />
    </div>
  )

  const ItemsSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
    </TableRow>
  )

  return (
    <div className="container mx-auto px-4 py-4 sm:p-6">
      <h1 className="text-[22px] sm:text-2xl font-bold mb-4 sm:mb-6">
        Order details
      </h1>

      {error && (
        <div className="mb-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-[#0333AE]" />
              Order summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading || !order ? (
              <SummarySkeleton />
            ) : (
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-medium text-gray-700">
                    Order ID:
                  </span>
                  <span className="break-all text-gray-900">
                    {order.id}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-medium text-gray-700">
                    Order date:
                  </span>
                  <span className="text-gray-900">
                    {formatDateTime(order.orderDate)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-medium text-gray-700">
                    Payment method:
                  </span>
                  <span className="inline-flex items-center gap-1 text-gray-900">
                    <CreditCard className="h-3 w-3" />
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-medium text-gray-700">
                    Payment status:
                  </span>
                  <Badge
                    className="text-xs capitalize"
                    variant={order.paymentStatus === "paid" ? "default" : "secondary"}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-medium text-gray-700">
                    Order status:
                  </span>
                  <Badge
                    className="text-xs capitalize flex items-center gap-1"
                    variant={order.orderStatus === "shipped" ? "default" : "secondary"}
                  >
                    <Truck className="h-3 w-3" />
                    {order.orderStatus}
                  </Badge>
                </div>
                <div className="pt-2 mt-1 border-t">
                  <div className="flex justify-between text-sm sm:text-base mb-1">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(order.orderTotal.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base mb-1">
                    <span className="text-gray-700">Discount</span>
                    <span className="font-medium">
                      {formatCurrency(order.orderTotal.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base mt-2 border-t pt-2">
                    <span className="font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="font-semibold text-[#0333AE]">
                      {formatCurrency(order.orderTotal.total || order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-[#0333AE]" />
              Shipping address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading || !order ? (
              <SummarySkeleton />
            ) : (
              <div className="space-y-2 text-sm sm:text-base text-gray-700">
                <p className="font-semibold text-gray-900">
                  {order.shippingAddress.fullname}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{order.shippingAddress.phone}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 mt-1" />
                  <span className="break-words">
                    {order.shippingAddress.address}, {order.shippingAddress.street}
                    , {order.shippingAddress.city}, {order.shippingAddress.state}
                    , {order.shippingAddress.country}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Postal code: {order.shippingAddress.postalCode}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-[#0333AE]" />
              Order items
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 sm:px-2 text-xs sm:text-sm whitespace-nowrap">
                      Product
                    </TableHead>
                    <TableHead className="px-4 sm:px-2 text-xs sm:text-sm whitespace-nowrap">
                      Quantity
                    </TableHead>
                    <TableHead className="px-4 sm:px-2 text-xs sm:text-sm whitespace-nowrap">
                      Price
                    </TableHead>
                    <TableHead className="px-4 sm:px-2 text-xs sm:text-sm whitespace-nowrap">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading || !order ? (
                    <>
                      <ItemsSkeleton />
                      <ItemsSkeleton />
                    </>
                  ) : order.items.length > 0 ? (
                    order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="px-4 sm:px-2 text-xs sm:text-sm whitespace-normal">
                          <div className="flex items-center gap-3">
                            {item.product.media && item.product.media[0]?.url && (
                              <img
                                src={item.product.media[0].url.trim()}
                                alt={item.product.name}
                                className="h-10 w-10 rounded object-cover flex-shrink-0"
                              />
                            )}
                            <span className="font-medium">
                              {item.product.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 sm:px-2 text-xs sm:text-sm">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="px-4 sm:px-2 text-xs sm:text-sm">
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell className="px-4 sm:px-2 text-xs sm:text-sm font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-xs sm:text-sm py-4"
                      >
                        No items found for this order.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#0333AE]" />
              Customer and store
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading || !order ? (
              <SummarySkeleton />
            ) : (
              <div className="space-y-4 text-sm sm:text-base text-gray-700">
                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">
                    Customer
                  </p>
                  <p className="font-semibold text-gray-900">
                    {order.user.firstname} {order.user.lastname}
                  </p>
                  <p className="flex items-center gap-2 mt-1">
                    <Mail className="h-3 w-3" />
                    <span className="break-all">{order.user.email}</span>
                  </p>
                  <p className="flex items-center gap-2 mt-1">
                    <Phone className="h-3 w-3" />
                    <span>{order.user.phone}</span>
                  </p>
                </div>

                <div className="border-t pt-3">
                  <p className="text-xs uppercase text-gray-500 mb-1">
                    Store
                  </p>
                  <p className="font-semibold text-gray-900">
                    {order.store.name}
                  </p>
                  <p className="flex items-center gap-2 mt-1">
                    <Mail className="h-3 w-3" />
                    <span className="break-all">{order.store.email}</span>
                  </p>
                  <p className="flex items-center gap-2 mt-1">
                    <Phone className="h-3 w-3" />
                    <span>{order.store.phone}</span>
                  </p>
                  <div className="mt-2">
                    <Badge className="text-xs capitalize">
                      {order.store.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrderDetails

