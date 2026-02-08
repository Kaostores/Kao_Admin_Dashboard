/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { GetBrands, UpdateBrand, DeleteBrand } from '../../utils/ApiCalls'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Swal from 'sweetalert2'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export default function BrandList() {
  const [brands, setBrands] = useState<any[]>([])
  const [editingBrand, setEditingBrand] = useState<any>(null)
  const [updatedData, setUpdatedData] = useState<any>({})
  const [brandImage, setBrandImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const brandsPerPage = 5

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        const response = await GetBrands()
        if (response.data.success) {
          setBrands(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
        toast.error('Failed to fetch brands')
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  const handleUpdate = async (brandId: string) => {
    try {
      const formData = new FormData()
      formData.append('name', updatedData.name)

      if (brandImage) {
        formData.append('image', brandImage)
      }

      const response = await UpdateBrand(brandId, formData)
      if (response.status === 200) {
        setBrands((prevBrands: any) =>
          prevBrands.map((brand: any) =>
            brand.id === brandId ? { ...brand, ...updatedData, image: imagePreview || brand.image } : brand
          )
        )
        setEditingBrand(null)
        setModalIsOpen(false)
        toast.success('Brand updated successfully!')
      }
    } catch (error) {
      console.error('Error updating brand:', error)
      toast.error('Failed to update brand')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBrandImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleDelete = async (brandId: string) => {
    try {
      await DeleteBrand(brandId)
      setBrands(brands.filter((brand: any) => brand.id !== brandId))
      toast.success('Brand deleted successfully!')
    } catch (error: any) {
      console.error('Error deleting brand:', error)

      if (error.response && error.response.data && error.response.data.message) {
        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff0000',
        })
      } else {
        toast.error('Failed to delete brand')
      }
    }
  }

  const openEditModal = (brand: any) => {
    setEditingBrand(brand)
    setUpdatedData({ ...brand })
    setImagePreview(brand.image)
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
    setEditingBrand(null)
    setBrandImage(null)
    setImagePreview(null)
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Calculate pagination values
  const indexOfLastBrand = currentPage * brandsPerPage
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand)

  return (
    <div className="w-full bg-white pt-4 pb-8 md:pb-12 mt-4 px-4 md:px-8">
      <div className="w-full flex flex-col">
        <h1 className="text-[25px] md:text-xl lg:text-2xl font-semibold mb-6 md:mb-8">Brand management</h1>

        <div className="mt-3 md:mt-4 shadow-sm border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs md:text-sm">Brand name</TableHead>
                <TableHead className="text-xs md:text-sm">Image</TableHead>
                <TableHead className="text-xs md:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: brandsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-32 md:w-48" /></TableCell>
                    <TableCell><Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 md:w-24" /></TableCell>
                  </TableRow>
                ))
              ) : (
                currentBrands.map((brand: any) => (
                  <TableRow key={brand.id}>
                    <TableCell className="text-xs md:text-sm font-medium">{brand.name}</TableCell>
                    <TableCell>
                      <img src={brand.image || "/placeholder.svg"} alt={brand.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover" />
                    </TableCell>
                    <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(brand)} className="p-2">
                        <Pencil className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(brand.id)} className="p-2">
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mt-4">
            <div className="text-xs md:text-sm text-muted-foreground">
              Page {currentPage} of {Math.ceil(brands.length / brandsPerPage)}
            </div>
            <div className="flex gap-1 md:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-xs md:text-sm"
            >
              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(brands.length / brandsPerPage)}
              className="text-xs md:text-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
            </Button>
            </div>
          </div>
        )}

        <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
          <DialogContent className="w-full max-w-sm md:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Edit brand</DialogTitle>
            </DialogHeader>
            {editingBrand && (
              <div className="grid gap-4 py-4">
                <Input
                  type="text"
                  value={updatedData.name}
                  onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                  placeholder="Brand Name"
                  className="text-sm"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm"
                />
                {imagePreview && (
                  <img src={imagePreview || "/placeholder.svg"} alt="Brand preview" className="w-32 h-20 md:w-40 md:h-24 mb-4 object-cover rounded" />
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={closeModal} className="text-xs md:text-sm bg-transparent">
                    Cancel
                  </Button>
                  <Button className='bg-[#0333AE] hover:bg-[#0333AE] text-xs md:text-sm' onClick={() => handleUpdate(editingBrand.id)}>
                    Save changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
