// import { useState, useEffect, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { GetCategories, GetSubcategories, CreateBrand } from '../../utils/ApiCalls';
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Brand = () => {
//     const [categories, setCategories] = useState<any[]>([]);
//     const [subcategories, setSubcategories] = useState<any[]>([]);
//     const [selectedCategory, setSelectedCategory] = useState<string>('');
//     const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
//     const [brandName, setBrandName] = useState<string>('');
//     const [brandImage, setBrandImage] = useState<File | null>(null); // Add image state
//     const [imagePreview, setImagePreview] = useState<string | null>(null); // For image preview
//     const [loading, setLoading] = useState<boolean>(false);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await GetCategories();
//                 if (response.data.success) {
//                     setCategories(response.data.data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching categories:', error);
//             }
//         };

//         fetchCategories();
//     }, []);

//     useEffect(() => {
//         const fetchSubcategories = async () => {
//             if (selectedCategory) {
//                 try {
//                     const response = await GetSubcategories(selectedCategory);
//                     if (response.data.success) {
//                         setSubcategories(response.data.data);
//                     }
//                 } catch (error) {
//                     console.error('Error fetching subcategories:', error);
//                 }
//             } else {
//                 setSubcategories([]);
//             }
//         };

//         fetchSubcategories();
//     }, [selectedCategory]);

//     // Handle file drop with react-dropzone
//     const onDrop = useCallback((acceptedFiles: File[]) => {
//         const file = acceptedFiles[0];
//         if (file) {
//             setBrandImage(file);
//             setImagePreview(URL.createObjectURL(file)); // Create image preview
//         }
//     }, []);

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop, // Handle the dropped files
//         accept: { 'image/*': [] }, // Accept all image types
//         multiple: false // Only allow one file
//     });

//     const handleCreateBrand = async () => {
//         if (!brandName || !selectedSubcategory || !brandImage) {
//             toast.error('Please provide brand name, image, and select a subcategory');
//             return;
//         }

//         setLoading(true);

//         const brandData = new FormData(); // Use FormData for multipart form
//         brandData.append('name', brandName);
//         brandData.append('image', brandImage); // Append the image
//         brandData.append('subcategoryId', selectedSubcategory);

//         try {
//             const response = await CreateBrand(brandData);

//             console.log("Brand creation response:", response.data);

//             if (response.status === 201 || response.status === 200) {
//                 toast.success("Brand created successfully!");
//                 // Reset form fields
//                 setBrandName('');
//                 setSelectedCategory('');
//                 setSelectedSubcategory('');
//                 setBrandImage(null);
//                 setImagePreview(null); // Reset image preview
//             } else {
//                 toast.error("Failed to create brand");
//             }
//         } catch (error) {
//             toast.error('Error creating brand');
//             console.error('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const isButtonDisabled = !selectedCategory || !selectedSubcategory || !brandImage || loading;

//     return (
//         <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex items-center pb-[30px] mt-[70px]">
//             <div className="w-[55%] flex-col h-[100%] flex">
//                 <h1 className="text-[20px] font-[600] mb-6">Create brand</h1>

//                 <div className="mb-4">
//                     <label className="block mb-2 text-sm font-medium text-gray-700">Brand name</label>
//                     <input
//                         type="text"
//                         value={brandName}
//                         onChange={(e) => setBrandName(e.target.value)}
//                         className="border p-2 w-full outline-none"
//                         placeholder="Enter brand name"
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label className="block mb-2 text-sm font-medium text-gray-700">Select category</label>
//                     <select
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                         className="border p-2 w-full outline-none"
//                     >
//                         <option value="">Select category</option>
//                         {categories.map((category) => (
//                             <option key={category.id} value={category.id}>
//                                 {category.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {selectedCategory && (
//                     <div className="mb-4">
//                         <label className="block mb-2 text-sm font-medium text-gray-700">Select subcategory</label>
//                         <select
//                             value={selectedSubcategory}
//                             onChange={(e) => setSelectedSubcategory(e.target.value)}
//                             className="border p-2 w-full outline-none"
//                         >
//                             <option value="">Select subcategory</option>
//                             {subcategories.map((subcategory) => (
//                                 <option key={subcategory.id} value={subcategory.id}>
//                                     {subcategory.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 )}

//                 <div className="mb-4">
//                     <label className="block mb-2 text-sm font-medium text-gray-700">Brand image</label>
//                     <div 
//                         {...getRootProps()} 
//                         className={`flex h-[200px] flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer ${
//                             isDragActive ? 'bg-gray-100' : 'bg-white'
//                         }`}
//                     >
//                         <input {...getInputProps()} />
//                         {isDragActive ? (
//                             <p>Drop the image here ...</p>
//                         ) : (
//                             <p>Drag and drop an image here, or click to select one</p>
//                         )}
//                     </div>
//                     {imagePreview && (
//                         <div className="mt-4">
//                             <img 
//                                 src={imagePreview} 
//                                 alt="Preview" 
//                                 className="w-32 h-32 object-cover rounded-md" 
//                             />
//                         </div>
//                     )}
//                 </div>

//                 <div className='w-[100%] flex justify-end'>
//                 <button
//                     className={`bg-[#0333ae] hover:bg-[#0333ae] text-white py-2 px-4 rounded ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     onClick={handleCreateBrand}
//                     disabled={isButtonDisabled}
//                 >
//                     {loading ? 'Creating...' : 'Create brand'}
//                 </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Brand;


'use client'

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { GetCategories, GetSubcategories, CreateBrand } from '../../utils/ApiCalls';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Brand = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
    const [brandName, setBrandName] = useState<string>('');
    const [brandImage, setBrandImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setBrandImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    const handleCreateBrand = async () => {
        if (!brandName || !selectedSubcategory || !brandImage) {
            toast.error('Please provide brand name, image, and select a subcategory');
            return;
        }

        setLoading(true);

        const brandData = new FormData();
        brandData.append('name', brandName);
        brandData.append('image', brandImage);
        brandData.append('subcategoryId', selectedSubcategory);

        try {
            const response = await CreateBrand(brandData);

            console.log("Brand creation response:", response.data);

            if (response.status === 201 || response.status === 200) {
                toast.success("Brand created successfully!");
                setBrandName('');
                setSelectedCategory('');
                setSelectedSubcategory('');
                setBrandImage(null);
                setImagePreview(null);
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

    const isButtonDisabled = !selectedCategory || !selectedSubcategory || !brandImage || loading;

    return (
        <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex items-center pb-[30px] mt-[70px]">
            <div className="w-[55%] flex-col h-[100%] flex">
                <h1 className="text-[20px] font-[600] mb-6">Create brand</h1>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="brandName">Brand name</Label>
                        <Input
                            id="brandName"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="Enter brand name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Select category</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedCategory && (
                        <div className="space-y-2">
                            <Label htmlFor="subcategory">Select subcategory</Label>
                            <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subcategories.map((subcategory) => (
                                        <SelectItem key={subcategory.id} value={subcategory.id}>
                                            {subcategory.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Brand image</Label>
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
                                <p>Drag and drop an image here, or click to select one</p>
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

                    <div className='w-[100%] flex justify-end'>
                        <Button
                            onClick={handleCreateBrand}
                            disabled={isButtonDisabled}
                            className={`bg-[#0333ae] hover:bg-[#0333ae] ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating...' : 'Create brand'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Brand;