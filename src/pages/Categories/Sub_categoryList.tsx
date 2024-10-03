import { GetSubcategories, UpdateSubcategory, DeleteSubcategory } from "@/utils/ApiCalls";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactModal from "react-modal";
import ReactPaginate from "react-paginate";

const SubcategoryList = () => {
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [editSubcategoryId, setEditSubcategoryId] = useState<string | null>(null);
    const [editSubcategoryName, setEditSubcategoryName] = useState<string>("");
    const [editTags, setEditTags] = useState<string>("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [categoryId] = useState<string>("");
    const [load] = useState(false)

    const [currentPage, setCurrentPage] = useState(0);
    const subcategoriesPerPage = 5;

    useEffect(() => {
        const fetchSubcategories = async () => {
            const response = await GetSubcategories(categoryId);
            if (response && response.status === 201) {
                console.log("Subcategories fetched successfully:", response.data.data);
                setSubcategories(response.data.data);
            } else {
                console.error("Failed to fetch subcategories.");
            }
        };

        fetchSubcategories();
    }, []);

    const handleEdit = (subcategory: any) => {
        setEditSubcategoryId(subcategory.id);
        setEditSubcategoryName(subcategory.name);
        setEditTags(subcategory.tags);
        setModalIsOpen(true);
    };

    const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (editSubcategoryId) {
        try {
            const updatedData = {
                name: editSubcategoryName,
                tags: editTags
            };
            const response = await UpdateSubcategory(editSubcategoryId, updatedData);
            if (response?.status === 200) {
                toast.success("Sub-category updated successfully!");
                const updatedSubcategories = subcategories.map((sub) =>
                    sub.id === editSubcategoryId ? { ...sub, ...updatedData } : sub
                );
                setSubcategories(updatedSubcategories);
                setModalIsOpen(false);
            } else {
                toast.error(response?.data?.message || "Failed to update sub-category.");
            }
        } catch (error) {
            toast.error("An error occurred while updating the sub-category.");
            console.error("Error updating sub-category:", error);
        }
    }
};


    const handleDelete = async (subCategoryId: string) => {
        try {
            const deleteResponse = await DeleteSubcategory(subCategoryId);
            if (deleteResponse?.status === 200) {
                toast.success("Sub-category deleted successfully!");
                setSubcategories(subcategories.filter((sub) => sub.id !== subCategoryId));
            } else {
                toast.error(deleteResponse?.data?.message || "Failed to delete sub-category.");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the sub-category.");
            console.error("Error deleting sub-category:", error);
        }
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * subcategoriesPerPage;
    const currentSubcategories = subcategories.slice(offset, offset + subcategoriesPerPage);
    const pageCount = Math.ceil(subcategories.length / subcategoriesPerPage);

    return (
        <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
            <div className="w-[100%] flex-col h-[100%] flex">
                <h1 className="text-[20px] font-[600] mb-6">Manage sub-categories</h1>

                {load ? (
                  <p>Loading...</p>
                ) : (
                  <div className="mt-[15px] shadow-sm border rounded-lg overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="py-3 px-6">Sub-category name</th>
                                <th className="py-3 px-6">Tags</th>
                                <th className="py-3 px-6"></th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 divide-y">
                            {currentSubcategories.map((subcategory) => (
                                <tr key={subcategory.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{subcategory.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{subcategory.tags}</td>
                                    <td className="text-right px-6 whitespace-nowrap">
                                        <button
                                            onClick={() => handleEdit(subcategory)}
                                            className="py-2 px-3 font-medium text-blue-500 hover:text-blue-500 duration-150 hover:bg-gray-50 rounded-lg"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(subcategory.id)}
                                            className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
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
    onRequestClose={handleCloseModal}
    contentLabel="Edit Sub-Category"
    className="relative bg-white p-6 rounded-lg shadow-lg z-[70] top-0"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
>
    <h2 className="text-xl font-semibold mb-4">Edit sub-category</h2>
    <form onSubmit={handleUpdate}>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Sub-category name:</label>
            <input
                type="text"
                value={editSubcategoryName}
                onChange={(e) => setEditSubcategoryName(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
            />
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Tags:</label>
            <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
            />
        </div>

        <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
            Save changes
        </button>
        <button
            type="button"
            onClick={handleCloseModal}
            className="ml-4 bg-gray-300 text-black px-4 py-2 rounded-lg"
        >
            Cancel
        </button>
    </form>
</ReactModal>

        </div>
    );
};

export default SubcategoryList;

// import { GetSubcategories, UpdateSubcategory, DeleteSubcategory } from "@/utils/ApiCalls";
