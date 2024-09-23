import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateCoupon, GetCategories, GetSubcategories, GetProducts } from "@/utils/ApiCalls";

const Coupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState("fixed");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState(0);
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");
  const [applicableCategory, setApplicableCategory] = useState<string | null>(null);
  const [applicableSubCategory, setApplicableSubCategory] = useState<string | null>(null);
  const [applicableProduct, setApplicableProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Fetch categories and products on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await GetCategories();
      if (response && response.status === 200 || response.status === 201) {
        console.log("Categories fetched successfully:", response.data.data);
        setCategories(response.data.data);
      } else {
        console.error("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await GetProducts();
      if (response && response.status === 201 || response.status === 200) {
        console.log("Products fetched successfully:", response.data.data);
        setProducts(response.data.data);
      } else {
        console.error("Failed to fetch products. Status:", response.status);
        toast.error(`Error fetching products. Status: ${response.status}`);
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Error fetching products:", error.response.data);
        toast.error(`Error fetching products: ${error.response.data}`);
      } else if (error.request) {
        console.error("Error fetching products:", error.request);
        toast.error("Error fetching products: No response received");
      } else {
        console.error("Error fetching products:", error.message);
        toast.error(`Error fetching products: ${error.message}`);
      }
    }
  };

  fetchProducts();
}, []);



  useEffect(() => {
  const fetchSubCategories = async () => {
    if (applicableCategory) {
      try {
        const response = await GetSubcategories(applicableCategory);
        if (response && response.status === 200 || response.status === 201) {
          console.log("Subcategories fetched successfully:", response.data.data);
          setSubCategories(response.data.data);
        } else {
          console.error("Failed to fetch subcategories.");
          toast.error("Error fetching subcategories.");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        toast.error("Error fetching subcategories.");
      }
    } else {
      setSubCategories([]);
    }
  };

  fetchSubCategories();
}, [applicableCategory]);


  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    const couponData = {
      couponCode,
      discountType,
      discountAmount,
      minimumPurchaseAmount,
      endDate,
      status,
      applicableCategory,
      applicableSubCategory,
      applicableProduct,
    };

    // Ensure only one of the applicable fields is selected
    if (
      (applicableCategory && applicableSubCategory) ||
      (applicableCategory && applicableProduct) ||
      (applicableSubCategory && applicableProduct)
    ) {
      toast.error("Please select only one of category, sub-category, or product.");
      return;
    }

    try {
      setLoading(true);
      const response = await CreateCoupon(couponData);
      if (response?.data?.success) {
        toast.success("Coupon created successfully!");
        // Reset form
        setCouponCode("");
        setDiscountType("fixed");
        setDiscountAmount(0);
        setMinimumPurchaseAmount(0);
        setEndDate("");
        setStatus("active");
        setApplicableCategory(null);
        setApplicableSubCategory(null);
        setApplicableProduct(null);
      }
    } catch (error: any) {
      toast.error("Failed to create coupon. Please try again: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[40px]">
      <div className="w-[100%] flex-col h-[100%] flex">
        <div className="w-full bg-white p-8 mt-10 rounded-lg shadow-md">
          <h1 className="text-[20px] font-[600] mb-6">Create a New Coupon</h1>
          <form onSubmit={handleCreateCoupon}>
            {/* Coupon Code */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Coupon Code</label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                required
                className="border border-gray-300 p-2 w-full rounded outline-none"
              />
            </div>

            {/* Discount Type */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded outline-none"
              >
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>

            {/* Discount Amount */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Discount Amount</label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value))}
                required
                className="border border-gray-300 p-2 w-full rounded outline-none"
              />
            </div>

            {/* Minimum Purchase Amount */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Minimum Purchase Amount</label>
              <input
                type="number"
                value={minimumPurchaseAmount}
                onChange={(e) => setMinimumPurchaseAmount(parseFloat(e.target.value))}
                required
                className="border border-gray-300 p-2 w-full rounded outline-none"
              />
            </div>

            {/* End Date */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="border border-gray-300 p-2 w-full rounded outline-none"
              />
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Applicable Category */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Applicable Category (Optional)</label>
              <select
                value={applicableCategory || ""}
                onChange={(e) => setApplicableCategory(e.target.value || null)}
                className="border border-gray-300 p-2 w-full rounded outline-none"
              >
                <option value="">Select a category</option>
                {categories.length > 0 ? (
                  categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="">No categories available</option>
                )}
              </select>
            </div>

            {/* Applicable Sub-Category */}
            {applicableCategory && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Applicable Sub-Category (Optional)</label>
                <select
                  value={applicableSubCategory || ""}
                  onChange={(e) => setApplicableSubCategory(e.target.value || null)}
                  className="border border-gray-300 p-2 w-full rounded outline-none"
                >
                  <option value="">Select a sub-category</option>
                  {subCategories.length > 0 ? (
                    subCategories.map((subCategory: any) => (
                      <option key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No sub-categories available</option>
                  )}
                </select>
              </div>
            )}

            {/* Applicable Product */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Applicable Product (Optional)</label>
              <select
                value={applicableProduct || ""}
                onChange={(e) => setApplicableProduct(e.target.value || null)}
                className="border border-gray-300 p-2 w-full rounded outline-none"
              >
                <option value="">Select a product</option>
                {products.length > 0 ? (
                  products.map((product: any) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))
                ) : (
                  <option value="">No products available</option>
                )}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Coupon"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Coupon;
