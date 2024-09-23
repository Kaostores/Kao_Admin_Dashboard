import { useEffect, useState } from 'react';
import { GetCoupons, UpdateCoupon, DeleteCoupon, GetCategories, GetSubcategories, GetProducts } from '../../utils/ApiCalls';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const CouponList = () => {
    const [coupons, setCoupons] = useState([]);
    const [editingCoupon, setEditingCoupon] = useState<any>(null); // State to track which coupon is being edited
    const [updatedData, setUpdatedData] = useState<any>({}); // State to hold updated data
    const [loading, setLoading] = useState(false);
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);


        useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setLoading(true);
                const response = await GetCoupons();
                if (response.data.success) {
                    setCoupons(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching coupons:', error);
            } finally {
                setLoading(false);
            }
        };

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

        const fetchProducts = async () => {
            try {
                const response = await GetProducts();
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchCoupons();
        fetchCategories();
        fetchProducts();
    }, []);


    const handleUpdate = async (couponId: string) => {
    const sanitizedData = {
        ...updatedData,
        applicableCategory: updatedData.applicableCategory || null, // Convert empty strings to null
        applicableSubCategory: updatedData.applicableSubCategory || null, // Convert empty strings to null
        applicableProduct: updatedData.applicableProduct || null, // Convert empty strings to null
    };
    
    try {
        const response = await UpdateCoupon(couponId, sanitizedData); // Use the couponId parameter
        if (response.status === 200 || response.status === 201) {
            setCoupons((prevCoupons: any) =>
                prevCoupons.map((coupon: any) =>
                    coupon.id === couponId ? { ...coupon, ...sanitizedData } : coupon
                )
            );
            setEditingCoupon(null);
            toast.success('Coupon updated successfully!');
        }
    } catch (error) {
        console.error('Error updating coupon:', error);
        toast.error('Failed to update coupon.');
    }
};



    const handleDelete = async (couponId: string) => {
        try {
            await DeleteCoupon(couponId);
            setCoupons(coupons.filter((coupon: any) => coupon.id !== couponId));
            toast.success('Coupon deleted successfully!');
        } catch (error) {
            console.error('Error deleting coupon:', error);
            toast.error('Failed to delete coupon.');
        }
    };

    const openEditModal = (coupon: any) => {
        setEditingCoupon(coupon);
        setUpdatedData({
            ...coupon,
            applicableCategory: coupon.applicableCategory || '',
            applicableSubCategory: coupon.applicableSubCategory || '',
            applicableProduct: coupon.applicableProduct || '',
        });
        fetchSubCategories(coupon.applicableCategory);
    };

    const fetchSubCategories = async (categoryId: string) => {
        try {
            const response = await GetSubcategories(categoryId);
            if (response.data.success) {
                setSubCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    return (
        <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
            <div className="w-[100%] flex-col h-[100%] flex">
                <h1 className="text-[20px] font-[600] mb-6">Coupon Management</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="mt-[15px] shadow-sm border rounded-lg overflow-x-auto">
                        <table className="w-full table-auto text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="py-3 px-6">Coupon Code</th>
                                    <th className="py-3 px-6">Discount Type</th>
                                    <th className="py-3 px-6">Discount Amount</th>
                                    <th className="py-3 px-6">Minimum Purchase Amount</th>
                                    <th className="py-3 px-6">End Date</th>
                                    <th className="py-3 px-6">Status</th>
                                    <th className="py-3 px-6">Applicable Product</th>
                                    <th className="py-3 px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 divide-y">
    {coupons.map((coupon: any) => (
        <tr key={coupon.id}>
            <td className="px-6 py-4 whitespace-nowrap">{coupon.couponCode}</td>
            <td className="px-6 py-4 whitespace-nowrap">{coupon.discountType}</td>
            <td className="px-6 py-4 whitespace-nowrap">{coupon.discountAmount}</td>
            <td className="px-6 py-4 whitespace-nowrap">{coupon.minimumPurchaseAmount}</td>
            <td className="px-6 py-4 whitespace-nowrap">{format(new Date(coupon.endDate), 'MMM dd, yyyy')}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`py-1 px-3 rounded-full text-sm ${
                        coupon.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}
                >
                    {coupon.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {coupon.applicableProduct ? coupon.applicableProduct.name : "No Product"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
                    onClick={() => openEditModal(coupon)}
                >
                    Edit
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    onClick={() => handleDelete(coupon.id)}
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

                {/* Edit Modal */}
                {editingCoupon && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] h-[70vh] overflow-y-scroll">
                    <h2 className="text-xl mb-4">Edit Coupon</h2>
                    <input
                        type="text"
                        value={updatedData.couponCode}
                        onChange={(e) => setUpdatedData({ ...updatedData, couponCode: e.target.value })}
                        className="border p-2 w-full mb-4"
                        placeholder="Coupon Code"
                    />
                    <select
                        value={updatedData.discountType}
                        onChange={(e) => setUpdatedData({ ...updatedData, discountType: e.target.value })}
                        className="border p-2 w-full mb-4"
                    >
                        <option value="">Select Discount Type</option>
                        <option value="fixed">Fixed</option>
                        <option value="percentage">Percentage</option>
                    </select>
                    <input
                        type="number"
                        value={updatedData.discountAmount}
                        onChange={(e) => setUpdatedData({ ...updatedData, discountAmount: parseFloat(e.target.value) })}
                        className="border p-2 w-full mb-4"
                        placeholder="Discount Amount"
                    />
                    <input
                        type="number"
                        value={updatedData.minimumPurchaseAmount}
                        onChange={(e) => setUpdatedData({ ...updatedData, minimumPurchaseAmount: parseFloat(e.target.value) })}
                        className="border p-2 w-full mb-4"
                        placeholder="Minimum Purchase Amount"
                    />
                    <input
                        type="date"
                        value={updatedData.endDate}
                        onChange={(e) => setUpdatedData({ ...updatedData, endDate: e.target.value })}
                        className="border p-2 w-full mb-4"
                        placeholder="End Date"
                    />
                    <select
                        value={updatedData.status}
                        onChange={(e) => setUpdatedData({ ...updatedData, status: e.target.value })}
                        className="border p-2 w-full mb-4"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <select
                        value={updatedData.applicableCategory}
                        onChange={(e) => {
                            setUpdatedData({ ...updatedData, applicableCategory: e.target.value });
                            fetchSubCategories(e.target.value);
                        }}
                        className="border p-2 w-full mb-4"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={updatedData.applicableSubCategory}
                        onChange={(e) => setUpdatedData({ ...updatedData, applicableSubCategory: e.target.value })}
                        className="border p-2 w-full mb-4"
                    >
                        <option value="">Select Subcategory</option>
                        {subCategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={updatedData.applicableProduct}
                        onChange={(e) => setUpdatedData({ ...updatedData, applicableProduct: e.target.value })}
                        className="border p-2 w-full mb-4"
                    >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded"
                        onClick={() => handleUpdate(editingCoupon.id)}
                    >
                        Save Changes
                    </button>
                    <button
                        className="ml-4 bg-gray-400 text-white py-2 px-4 rounded"
                        onClick={() => setEditingCoupon(null)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )}
            </div>
        </div>
    );
};

export default CouponList;
