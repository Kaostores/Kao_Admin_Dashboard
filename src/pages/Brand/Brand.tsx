import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { GetCategories, GetSubcategories, CreateBrand } from '../../utils/ApiCalls';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Brand = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
    const [brandName, setBrandName] = useState<string>('');
    const [brandImage, setBrandImage] = useState<File | null>(null); // Add image state
    const [imagePreview, setImagePreview] = useState<string | null>(null); // For image preview
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await GetCategories();
                if (response.data.success) {
                    setCategories(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubcategories = async () => {
            if (selectedCategory) {
                try {
                    const response = await GetSubcategories(selectedCategory);
                    if (response.data.success) {
                        setSubcategories(response.data.data);
                    }
                } catch (error) {
                    console.error('Error fetching subcategories:', error);
                }
            } else {
                setSubcategories([]);
            }
        };

        fetchSubcategories();
    }, [selectedCategory]);

    // Handle file drop with react-dropzone
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setBrandImage(file);
            setImagePreview(URL.createObjectURL(file)); // Create image preview
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, // Handle the dropped files
        accept: { 'image/*': [] }, // Accept all image types
        multiple: false // Only allow one file
    });

    const handleCreateBrand = async () => {
        if (!brandName || !selectedSubcategory || !brandImage) {
            toast.error('Please provide brand name, image, and select a subcategory');
            return;
        }

        setLoading(true);

        const brandData = new FormData(); // Use FormData for multipart form
        brandData.append('name', brandName);
        brandData.append('image', brandImage); // Append the image
        brandData.append('subcategoryId', selectedSubcategory);

        try {
            const response = await CreateBrand(brandData);

            console.log("Brand creation response:", response.data);

            if (response.status === 201 || response.status === 200) {
                toast.success("Brand created successfully!");
                // Reset form fields
                setBrandName('');
                setSelectedCategory('');
                setSelectedSubcategory('');
                setBrandImage(null);
                setImagePreview(null); // Reset image preview
            } else {
                toast.error("Failed to create brand");
            }
        } catch (error) {
            toast.error('Error creating brand');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
            <div className="w-[100%] flex-col h-[100%] flex">
                <h1 className="text-[20px] font-[600] mb-6">Create Brand</h1>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Brand Name</label>
                    <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="border p-2 w-full outline-none"
                        placeholder="Enter brand name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Select Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border p-2 w-full outline-none"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Select Subcategory</label>
                    <select
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                        className="border p-2 w-full outline-none"
                        disabled={!selectedCategory}
                    >
                        <option value="">Select Subcategory</option>
                        {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Brand Image</label>
                    <div 
                        {...getRootProps()} 
                        className={`flex h-[200px] flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer ${
                            isDragActive ? 'bg-gray-100' : 'bg-white'
                        }`}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>Drop the image here ...</p>
                        ) : (
                            <p>Drag 'n' drop an image here, or click to select one</p>
                        )}
                    </div>
                    {imagePreview && (
                        <div className="mt-4">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-32 h-32 object-cover rounded-md" 
                            />
                        </div>
                    )}
                </div>

                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={handleCreateBrand}
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Brand'}
                </button>
            </div>
        </div>
    );
};

export default Brand;
