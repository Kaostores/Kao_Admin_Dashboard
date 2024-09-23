import { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetCategoriesWithSubs, UpdateSubcategory, DeleteSubcategory } from "@/utils/ApiCalls"; // Add Update/Delete API Calls
import ReactModal from "react-modal";

const CategoriesandSubs = () => {
    const [load, setLoad] = useState(false);
    const [categoriesWithSubs, setCategoriesWithSubs] = useState<any[]>([]);
    const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
    
    // State for editing subcategories
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editSubCategoryId, setEditSubCategoryId] = useState<string | null>(null);
    const [editSubCategoryName, setEditSubCategoryName] = useState<string>("");
    const [editSubCategoryTags, setEditSubCategoryTags] = useState<string>("");
    const [editCategoryId, setEditCategoryId] = useState<string | null>(null); // For storing parent category ID

    useEffect(() => {
        const fetchCategoriesWithSubs = async () => {
            setLoad(true);
            try {
                const response = await GetCategoriesWithSubs();
                if (response && (response.status === 200 || response.status === 201)) {
                    setCategoriesWithSubs(response.data.data);
                    toast.success("Categories fetched successfully!");
                } else {
                    toast.error("Failed to fetch categories with sub-categories.");
                }
            } catch (err: any) {
                console.error("Error:", err);
            } finally {
                setLoad(false);
            }
        };
        fetchCategoriesWithSubs();
    }, []);

    const handleToggleExpand = (categoryId: string) => {
        setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId);
    };

    // Function to open the modal for editing a subcategory
    const handleEditSubCategory = (subCategory: any, categoryId: string) => {
        setEditSubCategoryId(subCategory.id);
        setEditSubCategoryName(subCategory.name);
        setEditSubCategoryTags(subCategory.tags.join(', ')); // Convert tags to a string
        setEditCategoryId(categoryId); // Store the parent category ID
        setModalIsOpen(true);
    };

    // Function to update the subcategory
    const handleUpdateSubCategory = async () => {
        if (editSubCategoryId && editCategoryId) {
            try {
                const body = {
                    name: editSubCategoryName,
                    categoryId: editCategoryId,
                    tags: editSubCategoryTags.split(',').map(tag => tag.trim()), // Convert tags back to an array
                };
                const response = await UpdateSubcategory(editSubCategoryId, body);
                if (response?.status === 200) {
                    toast.success("Subcategory updated successfully!");
                    const updatedCategories = categoriesWithSubs.map((cat) =>
                        cat.id === editCategoryId
                            ? {
                                  ...cat,
                                  sub_categories: cat.sub_categories.map((sub: any) =>
                                      sub.id === editSubCategoryId ? { ...sub, name: editSubCategoryName, tags: body.tags } : sub
                                  )
                              }
                            : cat
                    );
                    setCategoriesWithSubs(updatedCategories);
                    setModalIsOpen(false);
                } else {
                    toast.error("Failed to update subcategory.");
                }
            } catch (error) {
                toast.error("An error occurred while updating the subcategory.");
                console.error("Error updating subcategory:", error);
            }
        }
    };

    // Function to delete a subcategory
    const handleDeleteSubCategory = async (subCategoryId: string, categoryId: string) => {
        try {
            const deleteResponse = await DeleteSubcategory(subCategoryId);
            if (deleteResponse?.status === 200) {
                toast.success("Subcategory deleted successfully!");
                const updatedCategories = categoriesWithSubs.map((cat) =>
                    cat.id === categoryId
                        ? { ...cat, sub_categories: cat.sub_categories.filter((sub: any) => sub.id !== subCategoryId) }
                        : cat
                );
                setCategoriesWithSubs(updatedCategories);
            } else {
                toast.error("Failed to delete subcategory.");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the subcategory.");
            console.error("Error:", error);
        }
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setEditSubCategoryId(null);
    };

    return (
        <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
            <div className="w-[100%] flex-col h-[100%] flex">
                <h1 className="text-[20px] font-[600] mb-6">Categories with Sub-Categories</h1>

                {load ? (
                    <p>Loading....</p>
                ) : (
                    <div className="mt-[15px] shadow-sm border rounded-lg overflow-x-auto">
                        <table className="w-full table-auto text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="px-4 py-2 border-b">Category Name</th>
                                    <th className="px-4 py-2 border-b">Image</th>
                                    <th className="px-4 py-2 border-b">Sub-Categories</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 divide-y">
                                {categoriesWithSubs.map((category) => (
                                    <Fragment key={category.id}>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img src={category.image} alt={category.name} className="w-20 h-20 object-cover" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleExpand(category.id)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                                >
                                                    {expandedCategoryId === category.id ? 'Collapse' : 'Expand'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedCategoryId === category.id && category.sub_categories.length > 0 && (
                                            <tr>
                                                <td colSpan={4}>
                                                    <table className="w-full table-auto text-sm text-left">
                                                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                                            <tr>
                                                                <th className="py-3 px-6">Sub-Category Name</th>
                                                                <th className="py-3 px-6">Tags</th>
                                                                <th className="py-3 px-6">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-gray-600 divide-y">
                                                            {category.sub_categories.map((subCategory: any) => (
                                                                <tr key={subCategory.id}>
                                                                    <td className="px-6 py-4 whitespace-nowrap">{subCategory.name}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">{subCategory.tags.join(', ')}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <button
                                                                            onClick={() => handleEditSubCategory(subCategory, category.id)}
                                                                            className="py-2 px-3 font-medium text-blue-500 hover:text-blue-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteSubCategory(subCategory.id, category.id)}
                                                                            className="py-2 px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Subcategory Modal */}
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
                        <button
                            type="button"
                            onClick={handleUpdateSubCategory}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="bg-gray-400 text-white px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </ReactModal>
        </div>
    );
};

export default CategoriesandSubs;
