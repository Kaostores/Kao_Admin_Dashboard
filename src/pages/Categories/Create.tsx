/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { CreateCategory, GetCategories, CreateSubcategory } from "@/utils/ApiCalls";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Create = () => {
  const [load, setLoad] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [categoryTitle, setCategoryTitle] = useState("Fashion");
  const [inputCategoryTitle, setInputCategoryTitle] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryTitle, setSubcategoryTitle] = useState("");
  const [tags, setTags] = useState("");

  const [formState, setFormState] = useState<any>({
    name: "",
    image: [""],
  });

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

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setImage(acceptedFiles[0]);
    setFormState((prevState: any) => ({
      ...prevState,
      media: acceptedFiles,
    }));
  }, []);

  const handleSaveCategory = () => {
    setCategoryTitle(inputCategoryTitle || "Fashion");
  };

  const handleSubmitCategory = async () => {
    setLoad(true);
    try {
      const data = new FormData();
      data.append("name", inputCategoryTitle);
      if (formState.media && formState.media.length > 0) {
        formState.media.forEach((file: File) => {
          data.append("image", file);
        });
      }

      console.log("FormData being sent:", data);

      const response = await CreateCategory(data);
      console.log("this is response", response);

      if (response?.status === 200) {
        window.location.reload();
        toast.success("Category created successfully!");
        setLoad(false);
      } else {
        setLoad(false);
        const errors = response?.data?.errors;
        if (errors) {
          Object.entries(errors).forEach(([_, errorMessages]: any) => {
            const firstErrorMessage = errorMessages?.field;
            console.log(firstErrorMessage);
          });
        }
        toast.error("Failed to create category.");
      }
    } catch (error: any) {
      setLoad(false);
      toast.error("An error occurred while creating the category");
      console.error("Error:", error.message || error);
    }
  };

  const handleSubmitSubcategory = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category.");
      return;
    }

    if (!subcategoryTitle) {
      toast.error("Please enter a sub-category title.");
      return;
    }

    setLoad(true);
    try {
      const subcategoryData = {
        name: subcategoryTitle,
        categoryId: selectedCategory,
        tags: tags.split(",").map(tag => tag.trim()), // Convert comma-separated tags to an array
      };

      console.log("Sub-category data being sent:", subcategoryData);

      const response = await CreateSubcategory(subcategoryData);

      if (response?.status === 200) {
        toast.success("Sub-category created successfully!");
        window.location.reload();
      } else {
        toast.error("Failed to create sub-category.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the sub-category.");
      console.log("Error:", error);
    } finally {
      setLoad(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  return (
    <div className="w-full bg-white px-3 sm:px-5 sm:pt-6 pb-8 sm:pb-12 mt-[10px]">
      <div className="w-full flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="w-full lg:w-[30%] bg-white p-4 sm:p-6 shadow-lg rounded-lg flex flex-col">
          <div className="w-full h-40 sm:h-48 border border-gray-200 rounded-lg overflow-hidden">
            {image && (
              <img
                src={URL.createObjectURL(image) || "/placeholder.svg"}
                alt="Selected"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="w-full mt-3 sm:mt-4 flex flex-col">
            <div className="w-full flex flex-col">
              <h3 className="text-base sm:text-lg font-semibold">Category</h3>
              <p className="text-sm sm:text-base font-medium mt-1 text-gray-600">
                {categoryTitle}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-200 mt-4 sm:mt-6"></div>

          <div className="w-full flex gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button
              disabled={!image || !inputCategoryTitle || load}
              onClick={handleSubmitCategory}
              className="flex-1 h-10 sm:h-11 bg-[#0333ae] text-white flex justify-center items-center text-xs sm:text-sm rounded-lg font-medium hover:bg-[#0333ae] disabled:opacity-50"
            >
              {load ? "Loading..." : "Create category"}
            </button>
            <button className="flex-1 h-10 sm:h-11 border border-[#0333ae] text-[#0333ae] flex justify-center items-center text-xs sm:text-sm rounded-lg font-medium hover:bg-blue-50">
              Cancel
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[70%] flex flex-col gap-4 sm:gap-6">
          {/* Upload Photo Section */}
          <div className="w-full bg-white shadow-md rounded-lg flex flex-col">
            <div className="w-full px-4 sm:px-6 h-14 flex items-center border-b border-gray-200">
              <h4 className="font-semibold text-sm sm:text-base">Add thumbnail photo</h4>
            </div>

            <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
              <div
                {...getRootProps()}
                className={`flex h-40 sm:h-56 flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 sm:p-6 cursor-pointer transition-colors ${
                  isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="text-3xl sm:text-4xl text-[#0333ae]">
                  <FaCloudUploadAlt />
                </div>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-blue-500 mt-3 sm:mt-4 text-sm sm:text-base">
                    Drag the files here ...
                  </p>
                ) : (
                  <p className="text-gray-600 mt-3 sm:mt-4 text-center text-xs sm:text-sm">
                    Drag and drop images here, or{" "}
                    <span className="text-[#0333ae] font-semibold">
                      click to select files
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Create Category Section */}
          <div className="w-full bg-white shadow-md rounded-lg flex flex-col">
            <div className="w-full px-4 sm:px-6 h-14 flex items-center border-b border-gray-200">
              <h4 className="font-semibold text-sm sm:text-base">Create category</h4>
            </div>

            <div className="w-full px-4 sm:px-6 py-6">
              <div className="space-y-3">
                <div className="flex flex-col">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Category title</p>
                  <input
                    type="text"
                    value={inputCategoryTitle}
                    onChange={(e) => setInputCategoryTitle(e.target.value)}
                    className="w-full h-10 sm:h-11 rounded-lg px-3 mt-2 outline-none border border-gray-300 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end px-4 sm:px-6 pb-6">
              <button
                onClick={handleSaveCategory}
                className="px-6 h-10 bg-[#0333ae] rounded-lg flex justify-center items-center text-white text-sm font-medium hover:bg-[#0333ae]"
              >
                Save
              </button>
            </div>
          </div>

          {/* Create Sub-category Section */}
          <div className="w-full bg-white shadow-md rounded-lg flex flex-col">
            <div className="w-full px-4 sm:px-6 h-14 flex items-center border-b border-gray-200">
              <h4 className="font-semibold text-sm sm:text-base">Create sub-category</h4>
            </div>

            <div className="w-full px-4 sm:px-6 py-6">
              <div className="space-y-4">
                {/* Category and Subcategory Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex flex-col">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Select a category</p>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full h-10 sm:h-11 rounded-lg px-3 mt-2 outline-none border border-gray-300 text-sm"
                    >
                      <option value="">Select</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Sub-category title</p>
                    <input
                      type="text"
                      value={subcategoryTitle}
                      onChange={(e) => setSubcategoryTitle(e.target.value)}
                      className="w-full h-10 sm:h-11 rounded-lg px-3 mt-2 outline-none border border-gray-300 text-sm"
                    />
                  </div>
                </div>

                {/* Tags Input */}
                <div className="flex flex-col">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Tags (comma-separated)</p>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full h-10 sm:h-11 rounded-lg px-3 mt-2 outline-none border border-gray-300 text-sm"
                    placeholder="e.g., Footwares, Flipflops"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end px-4 sm:px-6 pb-6">
              <button
                onClick={handleSubmitSubcategory}
                className="px-6 h-10 bg-[#0333ae] rounded-lg flex justify-center items-center text-white text-sm font-medium hover:bg-[#0333ae]"
              >
                Create sub-category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
