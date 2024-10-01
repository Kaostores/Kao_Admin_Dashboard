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
    <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
      <div className="w-[100%] flex-col h-[100%] flex">
        <h1 className="text-[20px] font-[600] mb-6">Coupon Management</h1>

        <div className="mt-[15px] shadow-sm border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Discount Type</TableHead>
                <TableHead>Discount Amount</TableHead>
                <TableHead>Minimum Purchase Amount</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applicable Product</TableHead>
                <TableHead>Actions</TableHead>
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
                    <TableCell>{coupon.couponCode}</TableCell>
                    <TableCell>{coupon.discountType}</TableCell>
                    <TableCell>{coupon.discountAmount}</TableCell>
                    <TableCell>{coupon.minimumPurchaseAmount}</TableCell>
                    <TableCell>{format(new Date(coupon.endDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <span
                        className={`py-1 px-3 rounded-full text-sm ${
                          coupon.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {coupon.applicableProduct ? coupon.applicableProduct.name : "No Product"}
                    </TableCell>
                    {/* <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(coupon)}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        Delete
                      </Button>
                    </TableCell> */}
                    <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="icon" onClick={() => openEditModal(coupon)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(coupon.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && (
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {Math.ceil(coupons.length / couponsPerPage)}
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
              disabled={currentPage === Math.ceil(coupons.length / couponsPerPage)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
            </div>
          </div>
        )}

        <Dialog open={!!editingCoupon} onOpenChange={() => setEditingCoupon(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Coupon</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                value={updatedData.couponCode}
                onChange={(e) => setUpdatedData({ ...updatedData, couponCode: e.target.value })}
                placeholder="Coupon Code"
              />
              <Select
                value={updatedData.discountType}
                onValueChange={(value) => setUpdatedData({ ...updatedData, discountType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Discount Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={updatedData.discountAmount}
                onChange={(e) => setUpdatedData({ ...updatedData, discountAmount: parseFloat(e.target.value) })}
                placeholder="Discount Amount"
              />
              <Input
                type="number"
                value={updatedData.minimumPurchaseAmount}
                onChange={(e) => setUpdatedData({ ...updatedData, minimumPurchaseAmount: parseFloat(e.target.value) })}
                placeholder="Minimum Purchase Amount"
              />
              <Input
                type="date"
                value={updatedData.endDate}
                onChange={(e) => setUpdatedData({ ...updatedData, endDate: e.target.value })}
                placeholder="End Date"
              />
              <Select
                value={updatedData.status}
                onValueChange={(value) => setUpdatedData({ ...updatedData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={updatedData.applicableCategory}
                onValueChange={(value) => {
                  setUpdatedData({ ...updatedData, applicableCategory: value })
                  fetchSubCategories(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={updatedData.applicableSubCategory}
                onValueChange={(value) => setUpdatedData({ ...updatedData, applicableSubCategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={updatedData.applicableProduct}
                onValueChange={(value) => setUpdatedData({ ...updatedData, applicableProduct: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Product" />
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
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingCoupon(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdate(editingCoupon.id)}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}