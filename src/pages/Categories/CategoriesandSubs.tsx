'use client'

import { useState, useEffect, Fragment } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { GetCategoriesWithSubs, UpdateSubcategory, DeleteSubcategory } from "@/utils/ApiCalls"
import ReactModal from "react-modal"
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
import { Skeleton } from "@/components/ui/skeleton"

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
  const [modalIsOpen, setModalIsOpen] = useState(false)
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
    setModalIsOpen(true)
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
          setModalIsOpen(false)
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

  const handleCloseModal = () => {
    setModalIsOpen(false)
    setEditSubCategoryId(null)
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const paginateSub = (categoryId: string, pageNumber: number) => 
    setCurrentSubPage({ ...currentSubPage, [categoryId]: pageNumber })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCategories = categoriesWithSubs.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="w-[95%] bg-white h-full pt-[40px] flex justify-center items-center pb-8 mt-[90px]">
      <div className="w-full flex-col h-full flex">
        <h1 className="text-[18px] font-semibold mb-6">Categories with Sub-Categories</h1>

        {load ? (
          // Skeleton component for loading state
          <div className="mt-4 border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Sub-Categories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Render skeleton rows while loading */}
                {[...Array(5)].map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="w-40 h-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-20 h-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-40 h-6" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Sub-Categories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCategories.map((category) => (
                  <Fragment key={category.id}>
                    <TableRow>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>
                        <img src={category.image} alt={category.name} className="w-20 h-20 object-cover" />
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleToggleExpand(category.id)}
                          variant="outline"
                          size="sm"
                        >
                          {expandedCategoryId === category.id ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-2" />
                              Collapse
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-2" />
                              Expand
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedCategoryId === category.id && category.sub_categories.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Sub-Category Name</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Actions</TableHead>
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
                                    <TableCell>{subCategory.name}</TableCell>
                                    <TableCell>{subCategory.tags.join(", ")}</TableCell>
                                    <TableCell>
                                      {/* <Button
                                        onClick={() => handleEditSubCategory(subCategory, category.id)}
                                        variant="outline"
                                        size="sm"
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        onClick={() => handleDeleteSubCategory(subCategory.id, category.id)}
                                        variant="destructive"
                                        size="sm"
                                        className="ml-2"
                                      >
                                        Delete
                                      </Button> */}
                                      <div className=" space-x-1">
                                        <Button variant="outline" size="icon" onClick={() => handleEditSubCategory(subCategory, category.id)}>
                                            <Pencil className="h-4 w-4 " />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => handleDeleteSubCategory(subCategory.id, category.id)}>
                                            <Trash2 className="h-4 w-4 " />
                                        </Button>
                                        </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                          {category.sub_categories.length > itemsPerPage && (
                            <div className="flex items-center justify-between py-4">
                              <div className="text-sm text-muted-foreground">
                                Page {currentSubPage[category.id]} of {Math.ceil(category.sub_categories.length / itemsPerPage)}
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => paginateSub(category.id, currentSubPage[category.id] - 1)}
                                  disabled={currentSubPage[category.id] === 1}
                                >
                                  <ChevronLeft className="h-4 w-4 mr-2" />
                                  Previous
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => paginateSub(category.id, currentSubPage[category.id] + 1)}
                                  disabled={currentSubPage[category.id] === Math.ceil(category.sub_categories.length / itemsPerPage)}
                                >
                                  Next
                                  <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!load && categoriesWithSubs.length > itemsPerPage && (
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {Math.ceil(categoriesWithSubs.length / itemsPerPage)}
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
                disabled={currentPage === Math.ceil(categoriesWithSubs.length / itemsPerPage)}
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
        onRequestClose={handleCloseModal}
        contentLabel="Edit Subcategory"
        className="relative bg-white p-6 rounded-lg shadow-lg z-[70] top-0"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Subcategory</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Subcategory Name</label>
            <input
              type="text"
              value={editSubCategoryName}
              onChange={(e) => setEditSubCategoryName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              value={editSubCategoryTags}
              onChange={(e) => setEditSubCategoryTags(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateSubCategory}
              className="bg-blue-500 text-white hover:bg-blue-600 mr-2"
            >
              Save
            </Button>
            <Button
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

export default CategoriesandSubs

// 'use client'

// import { useState, useEffect, Fragment } from "react"
// import { toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import { GetCategoriesWithSubs, UpdateSubcategory, DeleteSubcategory } from "@/utils/ApiCalls"
// import ReactModal from "react-modal"
// import { Button } from "@/components/ui/button"
// import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Skeleton } from "@/components/ui/skeleton"

// interface Category {
//   id: string
//   name: string
//   image: string
//   sub_categories: SubCategory[]
// }

// interface SubCategory {
//   id: string
//   name: string
//   tags: string[]
// }

// const CategoriesandSubs = () => {
//   const [load, setLoad] = useState(false)
//   const [categoriesWithSubs, setCategoriesWithSubs] = useState<Category[]>([])
//   const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)
//   const [modalIsOpen, setModalIsOpen] = useState(false)
//   const [editSubCategoryId, setEditSubCategoryId] = useState<string | null>(null)
//   const [editSubCategoryName, setEditSubCategoryName] = useState<string>("")
//   const [editSubCategoryTags, setEditSubCategoryTags] = useState<string>("")
//   const [editCategoryId, setEditCategoryId] = useState<string | null>(null)

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1)
//   const [currentSubPage, setCurrentSubPage] = useState<{ [key: string]: number }>({})
//   const itemsPerPage = 5

//   useEffect(() => {
//     const fetchCategoriesWithSubs = async () => {
//       setLoad(true)
//       try {
//         const response = await GetCategoriesWithSubs()
//         if (response && (response.status === 200 || response.status === 201)) {
//           setCategoriesWithSubs(response.data.data)
//           toast.success("Categories fetched successfully!")
//         } else {
//           toast.error("Failed to fetch categories with sub-categories.")
//         }
//       } catch (err: any) {
//         console.error("Error:", err)
//       } finally {
//         setLoad(false)
//       }
//     }
//     fetchCategoriesWithSubs()
//   }, [])

//   const handleToggleExpand = (categoryId: string) => {
//     setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId)
//     if (!currentSubPage[categoryId]) {
//       setCurrentSubPage({ ...currentSubPage, [categoryId]: 1 })
//     }
//   }

//   const handleEditSubCategory = (subCategory: SubCategory, categoryId: string) => {
//     setEditSubCategoryId(subCategory.id)
//     setEditSubCategoryName(subCategory.name)
//     setEditSubCategoryTags(subCategory.tags.join(', '))
//     setEditCategoryId(categoryId)
//     setModalIsOpen(true)
//   }

//   const handleUpdateSubCategory = async () => {
//     if (editSubCategoryId && editCategoryId) {
//       try {
//         const body = {
//           name: editSubCategoryName,
//           categoryId: editCategoryId,
//           tags: editSubCategoryTags.split(',').map(tag => tag.trim()),
//         }
//         const response = await UpdateSubcategory(editSubCategoryId, body)
//         if (response?.status === 200) {
//           toast.success("Subcategory updated successfully!")
//           const updatedCategories = categoriesWithSubs.map((cat) =>
//             cat.id === editCategoryId
//               ? {
//                   ...cat,
//                   sub_categories: cat.sub_categories.map((sub) =>
//                     sub.id === editSubCategoryId ? { ...sub, name: editSubCategoryName, tags: body.tags } : sub
//                   )
//                 }
//               : cat
//           )
//           setCategoriesWithSubs(updatedCategories)
//           setModalIsOpen(false)
//         } else {
//           toast.error("Failed to update subcategory.")
//         }
//       } catch (error) {
//         toast.error("An error occurred while updating the subcategory.")
//         console.error("Error updating subcategory:", error)
//       }
//     }
//   }

//   const handleDeleteSubCategory = async (subCategoryId: string, categoryId: string) => {
//     try {
//       const deleteResponse = await DeleteSubcategory(subCategoryId)
//       if (deleteResponse?.status === 200) {
//         toast.success("Subcategory deleted successfully!")
//         const updatedCategories = categoriesWithSubs.map((cat) =>
//           cat.id === categoryId
//             ? { ...cat, sub_categories: cat.sub_categories.filter((sub) => sub.id !== subCategoryId) }
//             : cat
//         )
//         setCategoriesWithSubs(updatedCategories)
//       } else {
//         toast.error("Failed to delete subcategory.")
//       }
//     } catch (error) {
//       toast.error("An error occurred while deleting the subcategory.")
//       console.error("Error:", error)
//     }
//   }

//   const handleCloseModal = () => {
//     setModalIsOpen(false)
//     setEditSubCategoryId(null)
//   }

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
//   const paginateSub = (categoryId: string, pageNumber: number) => 
//     setCurrentSubPage({ ...currentSubPage, [categoryId]: pageNumber })

//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentCategories = categoriesWithSubs.slice(indexOfFirstItem, indexOfLastItem)

//   return (
//     <div className="w-[95%] bg-white h-full pt-5 flex justify-center items-center pb-8 mt-[70px]">
//       <div className="w-full flex-col h-full flex">
//         <h1 className="text-2xl font-semibold mb-6">Categories with Sub-Categories</h1>

//         {load ? (
//           <p>Loading....</p>
//         ) : (
//           <div className="mt-4 border rounded-lg overflow-hidden">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Category Name</TableHead>
//                   <TableHead>Image</TableHead>
//                   <TableHead>Sub-Categories</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {currentCategories.map((category) => (
//                   <Fragment key={category.id}>
//                     <TableRow>
//                       <TableCell>{category.name}</TableCell>
//                       <TableCell>
//                         <img src={category.image} alt={category.name} className="w-20 h-20 object-cover" />
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           onClick={() => handleToggleExpand(category.id)}
//                           variant="outline"
//                           size="sm"
//                         >
//                           {expandedCategoryId === category.id ? (
//                             <>
//                               <ChevronUp className="h-4 w-4 mr-2" />
//                               Collapse
//                             </>
//                           ) : (
//                             <>
//                               <ChevronDown className="h-4 w-4 mr-2" />
//                               Expand
//                             </>
//                           )}
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                     {expandedCategoryId === category.id && category.sub_categories.length > 0 && (
//                       <TableRow>
//                         <TableCell colSpan={3}>
//                           <Table>
//                             <TableHeader>
//                               <TableRow>
//                                 <TableHead>Sub-Category Name</TableHead>
//                                 <TableHead>Tags</TableHead>
//                                 <TableHead>Actions</TableHead>
//                               </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                               {category.sub_categories
//                                 .slice(
//                                   (currentSubPage[category.id] - 1) * itemsPerPage,
//                                   currentSubPage[category.id] * itemsPerPage
//                                 )
//                                 .map((subCategory) => (
//                                   <TableRow key={subCategory.id}>
//                                     <TableCell>{subCategory.name}</TableCell>
//                                     <TableCell>{subCategory.tags.join(', ')}</TableCell>
//                                     <TableCell>
//                                       <Button
//                                         onClick={() => handleEditSubCategory(subCategory, category.id)}
//                                         variant="outline"
//                                         size="sm"
//                                         className="mr-2"
//                                       >
//                                         Edit
//                                       </Button>
//                                       <Button
//                                         onClick={() => handleDeleteSubCategory(subCategory.id, category.id)}
//                                         variant="outline"
//                                         size="sm"
//                                         className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                                       >
//                                         Delete
//                                       </Button>
//                                     </TableCell>
//                                   </TableRow>
//                                 ))}
//                             </TableBody>
//                           </Table>
//                           {category.sub_categories.length > itemsPerPage && (
//                             <div className="flex items-center justify-between py-4">
//                               <div className="text-sm text-muted-foreground">
//                                 Page {currentSubPage[category.id]} of {Math.ceil(category.sub_categories.length / itemsPerPage)}
//                               </div>
//                               <div className="flex space-x-2">
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => paginateSub(category.id, currentSubPage[category.id] - 1)}
//                                   disabled={currentSubPage[category.id] === 1}
//                                 >
//                                   <ChevronLeft className="h-4 w-4 mr-2" />
//                                   Previous
//                                 </Button>
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => paginateSub(category.id, currentSubPage[category.id] + 1)}
//                                   disabled={currentSubPage[category.id] === Math.ceil(category.sub_categories.length / itemsPerPage)}
//                                 >
//                                   Next
//                                   <ChevronRight className="h-4 w-4 ml-2" />
//                                 </Button>
//                               </div>
//                             </div>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </Fragment>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}

//         {!load && categoriesWithSubs.length > itemsPerPage && (
//           <div className="flex items-center justify-between py-4">
//             <div className="text-sm text-muted-foreground">
//               Page {currentPage} of {Math.ceil(categoriesWithSubs.length / itemsPerPage)}
//             </div>
//             <div className="flex space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => paginate(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft className="h-4 w-4 mr-2" />
//                 Previous
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => paginate(currentPage + 1)}
//                 disabled={currentPage === Math.ceil(categoriesWithSubs.length / itemsPerPage)}
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4 ml-2" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>

//       <ReactModal
//         isOpen={modalIsOpen}
//         onRequestClose={handleCloseModal}
//         contentLabel="Edit Subcategory"
//         className="relative bg-white p-6 rounded-lg shadow-lg z-[70] top-0"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
//       >
//         <h2 className="text-xl font-semibold mb-4">Edit Subcategory</h2>
//         <form>
//           <div className="mb-4">
//             <label className="block text-gray-700">Subcategory Name</label>
//             <input
//               type="text"
//               value={editSubCategoryName}
//               onChange={(e) => setEditSubCategoryName(e.target.value)}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Tags (comma separated)</label>
//             <input
//               type="text"
//               value={editSubCategoryTags}
//               onChange={(e) => setEditSubCategoryTags(e.target.value)}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
//             />
//           </div>
//           <div className="flex justify-end">
//             <Button
//               onClick={handleUpdateSubCategory}
//               className="bg-blue-500 text-white hover:bg-blue-600 mr-2"
//             >
//               Save
//             </Button>
//             <Button
//               onClick={handleCloseModal}
//               variant="outline"
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </ReactModal>
//     </div>
//   )
// }

// export default CategoriesandSubs