import { GetCategories, UpdateCategory, DeleteCategory } from "@/utils/ApiCalls";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactModal from "react-modal";
import ReactPaginate from "react-paginate";
import Swal from 'sweetalert2';

const CategoryList = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
    const [editCategoryName, setEditCategoryName] = useState<string>("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editCategoryImage, setEditCategoryImage] = useState<File | null>(null);

    const [currentPage, setCurrentPage] = useState(0);
  const categoriesPerPage = 5;

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await GetCategories();
            if (response && response.status === 200) {
                console.log("Categories fetched successfully:", response.data.data);
                setCategories(response.data.data);
            } else {
                console.error("Failed to fetch categories.");
            }
        };

        fetchCategories();
    }, []);

    const handleEdit = (category: any) => {
        setEditCategoryId(category.id);
        setEditCategoryName(category.name);
        setEditCategoryImage(null);
        setModalIsOpen(true);
    };

   const handleUpdate = async () => {
    if (editCategoryId) {
        try {

            // Create a new FormData object to send the category data
            const formData = new FormData();
            formData.append("name", editCategoryName);
            if (editCategoryImage) {
                formData.append("image", editCategoryImage); // Append the new image if it exists
            }

            // Send the formData to the API
            const response = await UpdateCategory(editCategoryId, formData);
            if (response?.status === 200) {
                toast.success("Category updated successfully!");
                const updatedCategories = categories.map((cat) =>
                    cat.id === editCategoryId ? { ...cat, name: editCategoryName, image: response.data.image } : cat
                );
                setCategories(updatedCategories);
                setModalIsOpen(false);
                setEditCategoryId(null);
                setEditCategoryImage(null); // Reset image state after update
            } else {
                toast.error(response?.data?.message || "Failed to update category.");
            }
        } catch (error) {
            toast.error("An error occurred while updating the category.");
            console.error("Error updating category:", error);
        } 
    }
};


    const handleDelete = async (categoryId: string) => {
        try {
            // Fetch categories to check if the selected category has subcategories
            const response = await GetCategories();
            const category = response.data.data.find((cat: any) => cat.id === categoryId);

            if (category && category.subcategories && category.subcategories.length > 0) {
                // Show SweetAlert if subcategories exist
                 Swal.fire({
                    title: 'Warning',
                    text: 'This category has subcategories. Please delete the subcategories before deleting this category.',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            } else {
                // Proceed with deleting the category if no subcategories are found
                const deleteResponse = await DeleteCategory(categoryId);
                if (deleteResponse?.status === 200) {
                    toast.success("Category deleted successfully!");
                    setCategories(categories.filter((cat) => cat.id !== categoryId));
                } else {
                    Swal.fire({
                    title: 'Warning',
                    text: 'This category has subcategories. Please delete the subcategories before deleting this category.',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                } 
            }
        } catch (error) {
            toast.error("An error occurred while deleting the category.");
            console.error("Error:", error);
        }
    };


    const handleCloseModal = () => {
    setModalIsOpen(false);
    setEditCategoryImage(null);
  };

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };
  
  const offset = currentPage * categoriesPerPage;
  const currentCategories = categories.slice(offset, offset + categoriesPerPage);
  const pageCount = Math.ceil(categories.length / categoriesPerPage);

    return (
        <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
            <div className="w-[100%] flex-col h-[100%] flex">
                <h1 className="text-[20px] font-[600] mb-6">Manage Categories</h1>

                <div className="mt-[15px] shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6">Category Name</th>
                            <th className="py-3 px-6"></th>

                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {
                            currentCategories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        
                                        {category.name}
                                    </td>
                                    <td className="text-right px-6 whitespace-nowrap">
                                        
                                            <button onClick={() => handleEdit(category)} className="py-2 px-3 font-medium text-blue-500 hover:text-blue-500 duration-150 hover:bg-gray-50 rounded-lg">
                                            Edit
                                        </button>
                                        
                                        <button onClick={() => handleDelete(category.id)} className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-6">
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName="flex space-x-2"
                        pageClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                        previousClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                        nextClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                        breakClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                        activeClassName="bg-blue-500 text-white border-blue-500"
                    />
                </div>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">Category Name:</label>
            <input
              type="text"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Category Image:</label>
            <input
              type="file"
              onChange={(e) => setEditCategoryImage(e.target.files?.[0] || null)}
              className="border border-gray-300 p-2 w-full rounded"
            />
            {editCategoryImage ? (
              <img
                src={URL.createObjectURL(editCategoryImage)}
                alt="Selected"
                className="w-[100px] h-[100px] object-cover mt-2"
              />
            ) : (
              <p className="text-sm text-gray-500 mt-2">No image selected</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </ReactModal>
        </div>
    );
};

export default CategoryList;
