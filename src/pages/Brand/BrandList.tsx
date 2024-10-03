'use client'

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
    <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
      <div className="w-[100%] flex-col h-[100%] flex">
        <h1 className="text-[20px] font-[600] mb-6">Brand management</h1>

        <div className="mt-[15px] shadow-sm border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: brandsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="w-[70px] h-[70px] rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
                  </TableRow>
                ))
              ) : (
                currentBrands.map((brand: any) => (
                  <TableRow key={brand.id}>
                    <TableCell>{brand.name}</TableCell>
                    <TableCell>
                      <img src={brand.image} alt="" className="w-[70px] h-[70px] rounded-full object-cover" />
                    </TableCell>
                    {/* <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(brand)}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(brand.id)}
                      >
                        Delete
                      </Button>
                    </TableCell> */}
                    <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="icon" onClick={() => openEditModal(brand)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(brand.id)}>
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
              Page {currentPage} of {Math.ceil(brands.length / brandsPerPage)}
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
              disabled={currentPage === Math.ceil(brands.length / brandsPerPage)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
            </div>
          </div>
        )}

        <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit brand</DialogTitle>
            </DialogHeader>
            {editingBrand && (
              <div className="grid gap-4 py-4">
                <Input
                  type="text"
                  value={updatedData.name}
                  onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                  placeholder="Brand Name"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Brand preview" className="w-[170px] h-[100px] mb-4" />
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button className='bg-[#0333AE] hover:bg-[#0333AE]' onClick={() => handleUpdate(editingBrand.id)}>
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