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
    <div className="w-[95%] bg-white h-full pt-5 flex justify-center items-center pb-8 mt-[90px]">
      <div className="w-full flex-col h-full flex">
        <h1 className="text-2xl font-semibold mb-6">Manage categories</h1>

        <div className="mt-4 border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-[100px] inline-block mr-2" />
                      <Skeleton className="h-8 w-[100px] inline-block" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                currentCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="space-x-1">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(category.id)}>
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
              Page {currentPage} of {Math.ceil(categories.length / categoriesPerPage)}
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
                disabled={currentPage === Math.ceil(categories.length / categoriesPerPage)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader className="mb-[30px]">
            <DialogTitle className="text-[#0333ae]">Edit category</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-4">
              <Label htmlFor="categoryName">Category name</Label>
              <Input
                id="categoryName"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="categoryImage">Category image</Label>
              <Input
                id="categoryImage"
                type="file"
                onChange={(e) => setEditCategoryImage(e.target.files?.[0] || null)}
              />
            </div>
            {editCategoryImage && (
              <div className="flex justify-center">
                <img
                  src={URL.createObjectURL(editCategoryImage)}
                  alt="Selected category"
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
            )}
          </div>
          <DialogFooter className="mt-[30px]">
            <Button type="button" onClick={handleCloseDialog} variant="outline">
              Cancel
            </Button>
            <Button className="bg-[#0333ae] hover:bg-[#0333ae]" type="button" onClick={handleUpdate}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CategoryList