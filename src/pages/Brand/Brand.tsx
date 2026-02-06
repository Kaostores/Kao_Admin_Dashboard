/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

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
        <div className="w-full bg-white min-h-screen pt-4 md:pt-5 pb-8 md:pb-12 px-4 md:px-8">
            <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col">
                <h1 className="text-[25px] md:text-xl lg:text-2xl font-semibold mb-6 md:mb-8">Create brand</h1>

                <div className="space-y-4 md:space-y-5">
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
                            className={`flex h-40 sm:h-48 md:h-56 flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 md:p-6 cursor-pointer transition-colors ${
                                isDragActive ? 'bg-gray-100' : 'bg-white'
                            }`}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p className="text-sm md:text-base text-center">Drop the image here ...</p>
                            ) : (
                                <p className="text-sm md:text-base text-center">Drag and drop an image here, or click to select one</p>
                            )}
                        </div>
                        {imagePreview && (
                            <div className="mt-4">
                                <img 
                                    src={imagePreview || "/placeholder.svg"} 
                                    alt="Preview" 
                                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md" 
                                />
                            </div>
                        )}
                    </div>

                    <div className='w-full flex justify-end'>
                        <Button
                            onClick={handleCreateBrand}
                            disabled={isButtonDisabled}
                            className={`bg-[#0333ae] hover:bg-[#0333ae] text-sm md:text-base ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
