/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, Fragment } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { GetCategoriesWithSubs, UpdateSubcategory, DeleteSubcategory } from "@/utils/ApiCalls"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
  image: string
  sub_categories: SubCategory[]
}

interface SubCategory {
  id: string
  name: string
  tags: string[]
}

const CategoriesandSubs = () => {
  const [load, setLoad] = useState(false)
  const [categoriesWithSubs, setCategoriesWithSubs] = useState<Category[]>([])
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editSubCategoryId, setEditSubCategoryId] = useState<string | null>(null)
  const [editSubCategoryName, setEditSubCategoryName] = useState<string>("")
  const [editSubCategoryTags, setEditSubCategoryTags] = useState<string>("")
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSubPage, setCurrentSubPage] = useState<{ [key: string]: number }>({})
  const itemsPerPage = 5

  useEffect(() => {
    const fetchCategoriesWithSubs = async () => {
      setLoad(true)
      try {
        const response = await GetCategoriesWithSubs()
        if (response && (response.status === 200 || response.status === 201)) {
          setCategoriesWithSubs(response.data.data)
        } else {
          toast.error("Failed to fetch categories with sub-categories.")
        }
      } catch (err: any) {
        console.error("Error:", err)
      } finally {
        setLoad(false)
      }
    }
    fetchCategoriesWithSubs()
  }, [])

  const handleToggleExpand = (categoryId: string) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId)
    if (!currentSubPage[categoryId]) {
      setCurrentSubPage({ ...currentSubPage, [categoryId]: 1 })
    }
  }

  const handleEditSubCategory = (subCategory: SubCategory, categoryId: string) => {
    setEditSubCategoryId(subCategory.id)
    setEditSubCategoryName(subCategory.name)
    setEditSubCategoryTags(subCategory.tags.join(', '))
    setEditCategoryId(categoryId)
    setIsDialogOpen(true)
  }

  const handleUpdateSubCategory = async () => {
    if (editSubCategoryId && editCategoryId) {
      try {
        const body = {
          name: editSubCategoryName,
          categoryId: editCategoryId,
          tags: editSubCategoryTags.split(',').map(tag => tag.trim()),
        }
        const response = await UpdateSubcategory(editSubCategoryId, body)
        if (response?.status === 200) {
          toast.success("Subcategory updated successfully!")
          const updatedCategories = categoriesWithSubs.map((cat) =>
            cat.id === editCategoryId
              ? {
                  ...cat,
                  sub_categories: cat.sub_categories.map((sub) =>
                    sub.id === editSubCategoryId ? { ...sub, name: editSubCategoryName, tags: body.tags } : sub
                  )
                }
              : cat
          )
          setCategoriesWithSubs(updatedCategories)
          setIsDialogOpen(false)
        } else {
          toast.error("Failed to update subcategory.")
        }
      } catch (error) {
        toast.error("An error occurred while updating the subcategory.")
        console.error("Error updating subcategory:", error)
      }
    }
  }

  const handleDeleteSubCategory = async (subCategoryId: string, categoryId: string) => {
    try {
      const deleteResponse = await DeleteSubcategory(subCategoryId)
      if (deleteResponse?.status === 200) {
        toast.success("Subcategory deleted successfully!")
        const updatedCategories = categoriesWithSubs.map((cat) =>
          cat.id === categoryId
            ? { ...cat, sub_categories: cat.sub_categories.filter((sub) => sub.id !== subCategoryId) }
            : cat
        )
        setCategoriesWithSubs(updatedCategories)
      } else {
        toast.error("Failed to delete subcategory.")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the subcategory.")
      console.error("Error:", error)
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const paginateSub = (categoryId: string, pageNumber: number) => 
    setCurrentSubPage({ ...currentSubPage, [categoryId]: pageNumber })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCategories = categoriesWithSubs.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="w-full bg-white px-3 sm:px-5 pt-4 sm:pt-6 pb-8 sm:pb-12 mt-[10px]">
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        <h1 className="text-1xl sm:text-2xl font-bold">Categories with sub-categories</h1>

        {load ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Category Name</TableHead>
                  <TableHead className="text-xs sm:text-sm">Image</TableHead>
                  <TableHead className="text-xs sm:text-sm">Sub-Categories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="w-32 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-16 h-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-32 h-4" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Category name</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Image</TableHead>
                  <TableHead className="text-xs sm:text-sm">Sub-categories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCategories.map((category) => (
                  <Fragment key={category.id}>
                    <TableRow>
                      <TableCell className="text-xs sm:text-sm font-medium">{category.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <img src={category.image || "/placeholder.svg"} alt={category.name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded" />
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleToggleExpand(category.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {expandedCategoryId === category.id ? (
                            <>
                              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">Collapse</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">Expand</span>
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedCategoryId === category.id && category.sub_categories.length > 0 && (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs sm:text-sm">Sub-category name</TableHead>
                              <TableHead className="text-xs sm:text-sm">Tags</TableHead>
                              <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {category.sub_categories
                              .slice(
                                (currentSubPage[category.id] - 1) * itemsPerPage,
                                currentSubPage[category.id] * itemsPerPage
                              )
                              .map((subCategory) => (
                                <TableRow key={subCategory.id}>
                                  <TableCell className="text-xs sm:text-sm">{subCategory.name}</TableCell>
                                  <TableCell className="text-xs sm:text-sm">{subCategory.tags.join(", ")}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => handleEditSubCategory(subCategory, category.id)}>
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => handleDeleteSubCategory(subCategory.id, category.id)}>
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                        {category.sub_categories.length > itemsPerPage && (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Page {currentSubPage[category.id]} of {Math.ceil(category.sub_categories.length / itemsPerPage)}
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none text-xs bg-transparent"
                                onClick={() => paginateSub(category.id, currentSubPage[category.id] - 1)}
                                disabled={currentSubPage[category.id] === 1}
                              >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none text-xs bg-transparent"
                                onClick={() => paginateSub(category.id, currentSubPage[category.id] + 1)}
                                disabled={currentSubPage[category.id] === Math.ceil(category.sub_categories.length / itemsPerPage)}
                              >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!load && categoriesWithSubs.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Page {currentPage} of {Math.ceil(categoriesWithSubs.length / itemsPerPage)}
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
                disabled={currentPage === Math.ceil(categoriesWithSubs.length / itemsPerPage)}
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
            <DialogTitle className="text-lg sm:text-xl font-semibold text-[#0333ae]">Edit subcategory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">
                Name
              </Label>
              <Input
                id="name"
                value={editSubCategoryName}
                onChange={(e) => setEditSubCategoryName(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-xs sm:text-sm">
                Tags
              </Label>
              <Input
                id="tags"
                value={editSubCategoryTags}
                onChange={(e) => setEditSubCategoryTags(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-4 border-t">
            <Button variant="outline" className="text-sm bg-transparent" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#0333ae] hover:bg-[#0333ae] text-sm" onClick={handleUpdateSubCategory}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CategoriesandSubs
