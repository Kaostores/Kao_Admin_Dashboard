/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { GetCoupons, UpdateCoupon, DeleteCoupon, GetCategories, GetSubcategories, GetProducts } from '../../utils/ApiCalls'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CouponList() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [editingCoupon, setEditingCoupon] = useState<any>(null)
  const [updatedData, setUpdatedData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [subCategories, setSubCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const couponsPerPage = 5

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true)
        const response = await GetCoupons()
        if (response.data.success) {
          setCoupons(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching coupons:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await GetCategories()
        if (response.data.success) {
          setCategories(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await GetProducts()
        if (response.data.success) {
          setProducts(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchCoupons()
    fetchCategories()
    fetchProducts()
  }, [])

  const handleUpdate = async (couponId: string) => {
    const sanitizedData = {
      ...updatedData,
      applicableCategory: updatedData.applicableCategory || null,
      applicableSubCategory: updatedData.applicableSubCategory || null,
      applicableProduct: updatedData.applicableProduct || null,
    }
    
    setUpdateLoading(true)
    try {
      const response = await UpdateCoupon(couponId, sanitizedData)
      if (response.status === 200 || response.status === 201) {
        setCoupons((prevCoupons: any) =>
          prevCoupons.map((coupon: any) =>
            coupon.id === couponId ? { ...coupon, ...sanitizedData } : coupon
          )
        )
        setEditingCoupon(null)
        toast.success('Coupon updated successfully!')
      }
    } catch (error) {
      console.error('Error updating coupon:', error)
      toast.error('Failed to update coupon.')
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDelete = async (couponId: string) => {
    try {
      await DeleteCoupon(couponId)
      setCoupons(coupons.filter((coupon: any) => coupon.id !== couponId))
      toast.success('Coupon deleted successfully!')
    } catch (error) {
      console.error('Error deleting coupon:', error)
      toast.error('Failed to delete coupon.')
    }
  }

  const openEditModal = (coupon: any) => {
    setEditingCoupon(coupon)
    setUpdatedData({
      ...coupon,
      applicableCategory: coupon.applicableCategory || '',
      applicableSubCategory: coupon.applicableSubCategory || '',
      applicableProduct: coupon.applicableProduct || '',
    })
    fetchSubCategories(coupon.applicableCategory)
  }

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const response = await GetSubcategories(categoryId)
      if (response.data.success) {
        setSubCategories(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Calculate pagination values
  const indexOfLastCoupon = currentPage * couponsPerPage
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage
  const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon)

  return (
    <div className="w-full bg-white px-3 sm:px-5 pt-4 sm:pt-5 mt-[10px]">
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <h1 className="text-[15px] sm:text-2xl font-bold">Coupon management</h1>

        {/* Desktop Table */}
        <div className="hidden md:block w-full overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Coupon code</TableHead>
                <TableHead className="text-xs sm:text-sm">Discount type</TableHead>
                <TableHead className="text-xs sm:text-sm">Discount amount</TableHead>
                <TableHead className="text-xs sm:text-sm">Minimum purchase amount</TableHead>
                <TableHead className="text-xs sm:text-sm">End date</TableHead>
                <TableHead className="text-xs sm:text-sm">Status</TableHead>
                <TableHead className="text-xs sm:text-sm">Applicable product</TableHead>
                <TableHead className="text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: couponsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 8 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                currentCoupons.map((coupon: any) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium text-xs sm:text-sm">{coupon.couponCode}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{coupon.discountType}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{coupon.discountAmount}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{coupon.minimumPurchaseAmount}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{format(new Date(coupon.endDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <span
                        className={`py-1 px-3 rounded-full text-xs font-medium ${
                          coupon.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {coupon.applicableProduct ? coupon.applicableProduct.name : "No Product"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 sm:gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent" onClick={() => openEditModal(coupon)}>
                          <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent" onClick={() => handleDelete(coupon.id)}>
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
            Array.from({ length: couponsPerPage }).map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          ) : (
            currentCoupons.map((coupon: any) => (
              <div key={coupon.id} className="bg-white border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="font-semibold text-sm">{coupon.couponCode}</div>
                    <div className="text-xs text-gray-600">{coupon.discountType} - {coupon.discountAmount}</div>
                  </div>
                  <span
                    className={`py-1 px-2 rounded-full text-xs font-medium whitespace-nowrap ${
                      coupon.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {coupon.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 border-t pt-3">
                  <div>
                    <span className="font-semibold text-gray-700">Min. Purchase:</span>
                    <div>{coupon.minimumPurchaseAmount}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">End Date:</span>
                    <div>{format(new Date(coupon.endDate), 'MMM dd')}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-700">Product:</span>
                    <div className="truncate">{coupon.applicableProduct ? coupon.applicableProduct.name : "No Product"}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => openEditModal(coupon)}>
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => handleDelete(coupon.id)}>
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
              Page {currentPage} of {Math.ceil(coupons.length / couponsPerPage)}
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
                disabled={currentPage === Math.ceil(coupons.length / couponsPerPage)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        <Dialog open={!!editingCoupon} onOpenChange={() => setEditingCoupon(null)}>
          <DialogContent className="w-[95%] max-w-[425px] rounded-lg p-4 sm:p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg sm:text-xl font-semibold">Edit coupon</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 sm:gap-4 py-4 max-h-[70vh] overflow-y-auto">
              {/* Coupon Code and Discount Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Input
                    value={updatedData.couponCode}
                    onChange={(e) => setUpdatedData({ ...updatedData, couponCode: e.target.value })}
                    placeholder="Coupon Code"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Select
                    value={updatedData.discountType}
                    onValueChange={(value) => setUpdatedData({ ...updatedData, discountType: value })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select Discount Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Discount Amount and Minimum Purchase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Input
                    type="number"
                    value={updatedData.discountAmount}
                    onChange={(e) => setUpdatedData({ ...updatedData, discountAmount: parseFloat(e.target.value) })}
                    placeholder="Discount Amount"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={updatedData.minimumPurchaseAmount}
                    onChange={(e) => setUpdatedData({ ...updatedData, minimumPurchaseAmount: parseFloat(e.target.value) })}
                    placeholder="Minimum Purchase Amount"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* End Date and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Input
                    type="date"
                    value={updatedData.endDate}
                    onChange={(e) => setUpdatedData({ ...updatedData, endDate: e.target.value })}
                    placeholder="End Date"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Select
                    value={updatedData.status}
                    onValueChange={(value) => setUpdatedData({ ...updatedData, status: value })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category Selection */}
              <Select
                value={updatedData.applicableCategory}
                onValueChange={(value) => {
                  setUpdatedData({ ...updatedData, applicableCategory: value })
                  fetchSubCategories(value)
                }}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Subcategory Selection */}
              <Select
                value={updatedData.applicableSubCategory}
                onValueChange={(value) => setUpdatedData({ ...updatedData, applicableSubCategory: value })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Product Selection */}
              <Select
                value={updatedData.applicableProduct}
                onValueChange={(value) => setUpdatedData({ ...updatedData, applicableProduct: value })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
              <Button variant="outline" className="text-sm bg-transparent" onClick={() => setEditingCoupon(null)}>
                Cancel
              </Button>
              {updateLoading ? (
                <Button className='bg-[#0333AE] hover:bg-[#0333AE] text-sm' disabled>
                  <Skeleton className="h-5 w-20" />
                </Button>
              ) : (
                <Button className='bg-[#0333AE] hover:bg-[#0333AE] text-sm' onClick={() => handleUpdate(editingCoupon.id)}>
                  Save changes
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
