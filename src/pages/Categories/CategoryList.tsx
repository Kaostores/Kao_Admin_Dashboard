"use client"

import { GetCategories, UpdateCategory, DeleteCategory } from "@/utils/ApiCalls"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from 'sweetalert2'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DialogFooter,
} from "@/components/ui/dialog"

interface Category {
  id: string
  name: string
  image?: string
  subcategories?: Category[]
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null)
  const [editCategoryName, setEditCategoryName] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editCategoryImage, setEditCategoryImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const categoriesPerPage = 5

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      const response = await GetCategories()
      if (response && response.status === 200) {
        console.log("Categories fetched successfully:", response.data.data)
        setCategories(response.data.data)
      } else {
        console.error("Failed to fetch categories.")
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  const handleEdit = (category: Category) => {
    setEditCategoryId(category.id)
    setEditCategoryName(category.name)
    setEditCategoryImage(null)
    setIsDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (editCategoryId) {
      try {
        const formData = new FormData()
        formData.append("name", editCategoryName)
        if (editCategoryImage) {
          formData.append("image", editCategoryImage)
        }

        const response = await UpdateCategory(editCategoryId, formData)
        if (response?.status === 200) {
          toast.success("Category updated successfully!")
          const updatedCategories = categories.map((cat) =>
            cat.id === editCategoryId ? { ...cat, name: editCategoryName, image: response.data.image } : cat
          )
          setCategories(updatedCategories)
          setIsDialogOpen(false)
          setEditCategoryId(null)
          setEditCategoryImage(null)
        } else {
          toast.error(response?.data?.message || "Failed to update category.")
        }
      } catch (error) {
        toast.error("An error occurred while updating the category.")
        console.error("Error updating category:", error)
      } 
    }
  }

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await GetCategories()
      const category = response.data.data.find((cat: Category) => cat.id === categoryId)

      if (category && category.subcategories && category.subcategories.length > 0) {
        Swal.fire({
          title: 'Warning',
          text: 'This category has subcategories. Please delete the subcategories before deleting this category.',
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        })
      } else {
        const deleteResponse = await DeleteCategory(categoryId)
        if (deleteResponse?.status === 200) {
          toast.success("Category deleted successfully!")
          setCategories(categories.filter((cat) => cat.id !== categoryId))
        } else {
          Swal.fire({
            title: 'Warning',
            text: 'This category has subcategories. Please delete the subcategories before deleting this category.',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
        } 
      }
    } catch (error) {
      toast.error("An error occurred while deleting the category.")
      console.error("Error:", error)
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditCategoryImage(null)
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const indexOfLastCategory = currentPage * categoriesPerPage
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory)

  return (
    <div className="w-full bg-white px-3 sm:px-5 pt-4 sm:pt-6 pb-8 sm:pb-12 mt-[10px]">
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        <h1 className="text-xl sm:text-2xl font-bold">Manage categories</h1>

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Category name</TableHead>
                <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-32 sm:w-48" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                currentCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="text-xs sm:text-sm font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 sm:gap-2 justify-end">
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => handleEdit(category)}>
                          <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => handleDelete(category.id)}>
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

        {!loading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Page {currentPage} of {Math.ceil(categories.length / categoriesPerPage)}
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
                disabled={currentPage === Math.ceil(categories.length / categoriesPerPage)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95%] max-w-[425px] rounded-lg p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg sm:text-xl font-semibold text-[#0333ae]">Edit category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName" className="text-xs sm:text-sm">Category name</Label>
              <Input
                id="categoryName"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryImage" className="text-xs sm:text-sm">Category image</Label>
              <Input
                id="categoryImage"
                type="file"
                onChange={(e) => setEditCategoryImage(e.target.files?.[0] || null)}
                className="text-sm"
              />
            </div>
            {editCategoryImage && (
              <div className="flex justify-center">
                <img
                  src={URL.createObjectURL(editCategoryImage) || "/placeholder.svg"}
                  alt="Selected category"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 pt-4 border-t">
            <Button type="button" onClick={handleCloseDialog} variant="outline" className="text-sm bg-transparent">
              Cancel
            </Button>
            <Button className="bg-[#0333ae] hover:bg-[#0333ae] text-sm" type="button" onClick={handleUpdate}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CategoryList
