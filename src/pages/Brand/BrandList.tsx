import { useEffect, useState } from 'react';
import { GetBrands, UpdateBrand, DeleteBrand } from '../../utils/ApiCalls';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactModal from 'react-modal';
import Swal from 'sweetalert2';

// Set app element for accessibility
ReactModal.setAppElement('#root');

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [editingBrand, setEditingBrand] = useState<any>(null);
    const [updatedData, setUpdatedData] = useState<any>({});
    const [brandImage, setBrandImage] = useState<File | null>(null); // Track image file
    const [imagePreview, setImagePreview] = useState<string | null>(null); // Preview URL
    const [loading, setLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setLoading(true);
                const response = await GetBrands();
                if (response.data.success) {
                    setBrands(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
                toast.error('Failed to fetch brands');
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, []);

    // Handle updating brand details
    const handleUpdate = async (brandId: string) => {
        try {
            const formData = new FormData();
            formData.append('name', updatedData.name);

            // Only append image if there's a new image
            if (brandImage) {
                formData.append('image', brandImage);
            }

            const response = await UpdateBrand(brandId, formData);
            if (response.status === 200) {
                setBrands((prevBrands: any) =>
                    prevBrands.map((brand: any) =>
                        brand.id === brandId ? { ...brand, ...updatedData, image: imagePreview || brand.image } : brand
                    )
                );
                setEditingBrand(null);
                setModalIsOpen(false);
                toast.success('Brand updated successfully!');
            }
        } catch (error) {
            console.error('Error updating brand:', error);
            toast.error('Failed to update brand');
        }
    };

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBrandImage(file);
            setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the selected image
        }
    };

    const handleDelete = async (brandId: string) => {
        try {
            await DeleteBrand(brandId);
            setBrands(brands.filter((brand: any) => brand.id !== brandId));
            toast.success('Brand deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting brand:', error);

            if (error.response && error.response.data && error.response.data.message) {
                Swal.fire({
                    title: 'Error',
                    text: error.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ff0000',
                });
            } else {
                toast.error('Failed to delete brand');
            }
        }
    };

    const openEditModal = (brand: any) => {
        setEditingBrand(brand);
        setUpdatedData({ ...brand });
        setImagePreview(brand.image); // Show the existing image in the modal
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setEditingBrand(null);
        setBrandImage(null); // Clear the image when modal is closed
        setImagePreview(null);
    };

    return (
        <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
            <div className="w-[100%] flex-col h-[100%] flex">
                <h1 className="text-[20px] font-[600] mb-6">Brand Management</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="mt-[15px] shadow-sm border rounded-lg overflow-x-auto">
                        <table className="w-full table-auto text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="py-3 px-6">Brand Name</th>
                                    <th className="py-3 px-6">Image</th>
                                    <th className="py-3 px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 divide-y">
                                {brands.map((brand: any) => (
                                    <tr key={brand.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{brand.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img src={brand.image} alt="" className="w-[170px] h-[100px] object-cover" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                            <button
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
                                                onClick={() => openEditModal(brand)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                                                onClick={() => handleDelete(brand.id)}
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

                <ReactModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    className="bg-white p-6 rounded-lg shadow-lg w-[400px] h-auto"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
                >
                    {editingBrand && (
                        <div>
                            <h2 className="text-xl mb-4">Edit Brand</h2>
                            <input
                                type="text"
                                value={updatedData.name}
                                onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                                className="border p-2 w-full mb-4"
                                placeholder="Brand Name"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border p-2 w-full mb-4"
                            />
                            {imagePreview && (
                                <img src={imagePreview} alt="Brand preview" className="w-[170px] h-[100px] mb-4" />
                            )}
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded"
                                onClick={() => handleUpdate(editingBrand.id)}
                            >
                                Save Changes
                            </button>
                            <button
                                className="ml-4 bg-gray-400 text-white py-2 px-4 rounded"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </ReactModal>
            </div>
        </div>
    );
};

export default BrandList;
