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
    console.log("Error:",  error);
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
    <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
      <div className="w-[100%] h-[100%] flex justify-between">
        <div className="w-[30%] h-[100%] bg-[#fff] p-[30px] shadow-2xl rounded-[15px] flex flex-col">
          <div className="w-[100%] h-[180px] border border-[#EAEDF1] rounded-[15px] overflow-hidden">
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                className="w-[100%] h-[100%] object-cover"
              />
            )}
          </div>

          <div className="w-[100%] mt-[12px] flex flex-col">
            <div className="w-[100%] flex flex-col">
              <h3 className="text-[18px] font-[600]">Category</h3>
              <p className="text-[15px] font-[500] mt-[3px]">
                {categoryTitle}
              </p>
            </div>
          </div>

          <div className="w-[100%] h-[1px] bg-[#EAEDF1] mt-[25px]"></div>

          <div className="w-[100%] flex mt-[25px] justify-between">
            <button
              disabled={!image || !inputCategoryTitle || load}
              onClick={handleSubmitCategory}
              className="w-[49%] h-[45px] bg-[#0333ae] text-[#fff] flex justify-center items-center text-[13px] rounded-[10px]"
            >
              {load ? "Loading..." : "Create category"}
            </button>
            <button className="w-[49%] h-[45px] border border-[#0333ae] text-[#0333ae] flex justify-center items-center text-[13px] rounded-[10px]">
              Cancel
            </button>
          </div>
        </div>

        <div className="w-[68%] flex flex-col">
          <div className="w-[100%] bg-[#fff] shadow-2xl rounded-[15px] flex flex-col pt-[10px] pb-[30px]">
            <div className="w-[100%] px-[30px] h-[60px] flex items-center border-b border-[#EAEDF1]">
              <h4 className="font-[600]">Add Thumbnail Photo</h4>
            </div>

            <div className="w-[100%] pl-[30px] pr-[30px] mt-[35px]">
              <div
                {...getRootProps()}
                className={`flex h-[200px] flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer ${
                  isDragActive ? "border-blue-400" : "border-gray-300"
                }`}
              >
                <div className="text-[35px] text-[#0333ae]">
                  <FaCloudUploadAlt />
                </div>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-blue-400 mt-[20px]">
                    Drag the files here ...
                  </p>
                ) : (
                  <p className="text-gray-500 mt-[20px]">
                    Drag 'n' drop images here, or{" "}
                    <span className="text-[#0333ae] font-[600] ml-[5px]">
                      click to select files
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-[100%] bg-[#fff] shadow-2xl rounded-[15px] flex flex-col pt-[10px] pb-[30px] mt-[30px]">
            <div className="w-[100%] px-[30px] h-[60px] flex items-center border-b border-[#EAEDF1]">
              <h4 className="font-[500]">Create category</h4>
            </div>

            <div className="w-[100%] pl-[30px] pr-[30px] flex items-center justify-between mt-[30px]">
              <div className="w-[48%] flex flex-col">
                <p className="text-[15px] font-[400]">Category Title</p>
                <input
                  type="text"
                  value={inputCategoryTitle}
                  onChange={(e) => setInputCategoryTitle(e.target.value)}
                  className="w-[100%] h-[45px] rounded-[7px] pl-[10px] mt-[12px] outline-none border border-[#D8DFE7]"
                />
              </div>
            </div>

            <div className="w-[100%] flex justify-end mt-[25px] pr-[30px]">
              <button
                onClick={handleSaveCategory}
                className="w-[180px] h-[40px] bg-[#0333ae] rounded-[7px] flex justify-center items-center text-[#fff]"
              >
                Save
              </button>
            </div>
          </div>

          <div className="w-[100%] bg-[#fff] shadow-2xl rounded-[15px] flex flex-col pt-[10px] pb-[30px] mt-[30px]">
            <div className="w-[100%] px-[30px] h-[60px] flex items-center border-b border-[#EAEDF1]">
              <h4 className="font-[500]">Create Sub-category</h4>
            </div>

            <div className="w-[100%] pl-[30px] pr-[30px] flex items-center justify-between mt-[30px]">
              <div className="w-[48%] flex flex-col">
                <p className="text-[15px] font-[400]">Select a category</p>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-[100%] h-[45px] rounded-[7px] pl-[10px] mt-[12px] outline-none border border-[#D8DFE7]"
                >
                  <option value="">Select</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-[48%] flex flex-col">
                <p className="text-[15px] font-[400]">Sub-category Title</p>
                <input
                  type="text"
                  value={subcategoryTitle}
                  onChange={(e) => setSubcategoryTitle(e.target.value)}
                  className="w-[100%] h-[45px] rounded-[7px] pl-[10px] mt-[12px] outline-none border border-[#D8DFE7]"
                />
              </div>
            </div>

            <div className="w-[100%] pl-[30px] pr-[30px] mt-[30px]">
              <div className="w-[100%] flex flex-col">
                <p className="text-[15px] font-[400]">Tags (comma-separated)</p>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-[100%] h-[45px] rounded-[7px] pl-[10px] mt-[12px] outline-none border border-[#D8DFE7]"
                  placeholder="e.g., Footwares, Flipflops"
                />
              </div>
            </div>

            <div className="w-[100%] flex justify-end mt-[25px] pr-[30px]">
              <button
                onClick={handleSubmitSubcategory}
                className="w-[210px] h-[40px] bg-[#0333ae] rounded-[7px] flex justify-center items-center text-[#fff]"
              >
                create sub-category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
