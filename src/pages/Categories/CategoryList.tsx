'use client'

import { GetCategories, UpdateCategory, DeleteCategory } from "@/utils/ApiCalls"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ReactModal from "react-modal"
import Swal from 'sweetalert2'
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
  const [modalIsOpen, setModalIsOpen] = useState(false)
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
    setModalIsOpen(true)
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
          setModalIsOpen(false)
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

  const handleCloseModal = () => {
    setModalIsOpen(false)
    setEditCategoryImage(null)
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const indexOfLastCategory = currentPage * categoriesPerPage
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory)

  return (
    <div className="w-[95%] bg-white h-full pt-5 flex justify-center items-center pb-8 mt-[70px]">
      <div className="w-full flex-col h-full flex">
        <h1 className="text-2xl font-semibold mb-6">Manage Categories</h1>

        <div className="mt-4 border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
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
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button> */}
                      <div className=" space-x-1">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(category)}>
                        <Pencil className="h-4 w-4 " />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(category.id)}>
                        <Trash2 className="h-4 w-4 " />
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

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Edit Category"
        className="relative bg-white p-6 rounded-lg shadow-lg z-[70] top-0"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name:</label>
            <input
              type="text"
              id="categoryName"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700">Category Image:</label>
            <input
              type="file"
              id="categoryImage"
              onChange={(e) => setEditCategoryImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            {editCategoryImage ? (
              <img
                src={URL.createObjectURL(editCategoryImage)}
                alt="Selected category"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            ) : (
              <p className="mt-2 text-sm text-gray-500">No image selected</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={handleUpdate}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Save
            </Button>
            <Button
              type="button"
              onClick={handleCloseModal}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </ReactModal>
    </div>
  )
}

export default CategoryList