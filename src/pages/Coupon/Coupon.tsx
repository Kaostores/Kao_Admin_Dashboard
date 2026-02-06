/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateCoupon, GetCategories, GetSubcategories, GetProducts } from "@/utils/ApiCalls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isFormValid =
      couponCode !== "" &&
      discountType !== "" &&
      discountAmount > 0 &&
      minimumPurchaseAmount > 0 &&
      endDate !== "" &&
      !loading;
    setIsFormValid(isFormValid);
  }, [couponCode, discountType, discountAmount, minimumPurchaseAmount, endDate, loading]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await GetCategories();
      if (response && response.status === 200 || response.status === 201) {
        setCategories(response.data.data);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await GetProducts();
      if (response && response.status === 200 || response.status === 201) {
        setProducts(response.data.data);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (applicableCategory) {
        const response = await GetSubcategories(applicableCategory);
        if (response && response.status === 200 || response.status === 201) {
          setSubCategories(response.data.data);
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
      description,
    };

    try {
      setLoading(true);
      const response = await CreateCoupon(couponData);
      if (response?.data?.success) {
        toast.success("Coupon created successfully!");
        setCouponCode("");
        setDiscountType("fixed");
        setDiscountAmount(0);
        setMinimumPurchaseAmount(0);
        setEndDate("");
        setStatus("active");
        setApplicableCategory(null);
        setApplicableSubCategory(null);
        setApplicableProduct(null);
        setDescription("");
      }
    } catch (error: any) {
      toast.error("Failed to create coupon. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-3 sm:px-5 sm:pt-5 pb-8 sm:pb-12 mt-[10px]">
      <div className="w-full mx-auto flex flex-col">
        <div className="w-full bg-white sm:p-6 md:p-8 rounded-lg border">
          <h1 className="text-xl sm:text-2xl font-semibold mb-6">Create a new coupon</h1>

          <form onSubmit={handleCreateCoupon}>
            <div className="space-y-3 sm:space-y-4">

              {/* Coupon Code and Discount Type */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="space-y-2 sm:flex-1">
                  <Label htmlFor="couponCode" className="text-xs sm:text-sm">Coupon code</Label>
                  <Input
                    id="couponCode"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="text-sm"
                    required
                  />
                </div>

                <div className="space-y-2 sm:flex-1">
                  <Label htmlFor="discountType" className="text-xs sm:text-sm">Discount type</Label>
                  <Select value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Discount Amount and Minimum Purchase */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="space-y-2 sm:flex-1">
                  <Label htmlFor="discountAmount" className="text-xs sm:text-sm">Discount amount</Label>
                  <Input
                    id="discountAmount"
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value))}
                    className="text-sm"
                    required
                  />
                </div>

                <div className="space-y-2 sm:flex-1">
                  <Label htmlFor="minimumPurchaseAmount" className="text-xs sm:text-sm">Minimum purchase amount</Label>
                  <Input
                    id="minimumPurchaseAmount"
                    type="number"
                    value={minimumPurchaseAmount}
                    onChange={(e) => setMinimumPurchaseAmount(parseFloat(e.target.value))}
                    className="text-sm"
                    required
                  />
                </div>
              </div>

              {/* End Date and Status */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="space-y-2 sm:flex-1">
                  <Label htmlFor="endDate" className="text-xs sm:text-sm">End date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-sm"
                    required
                  />
                </div>

                <div className="space-y-2 sm:flex-1">
                  <Label htmlFor="status" className="text-xs sm:text-sm">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Applicable Category */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Applicable category (optional)</Label>
                <Select value={applicableCategory || undefined} onValueChange={setApplicableCategory}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Applicable Sub-Category */}
              {applicableCategory && (
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Applicable sub-category (optional)</Label>
                  <Select value={applicableSubCategory || undefined} onValueChange={setApplicableSubCategory}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select a sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((sub: any) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Applicable Product */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Applicable product (optional)</Label>
                <Select value={applicableProduct || undefined} onValueChange={setApplicableProduct}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product: any) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  className="bg-[#0333ae] hover:bg-[#0333ae] text-sm sm:text-base"
                  disabled={!isFormValid || loading}
                >
                  {loading ? "Creating..." : "Create coupon"}
                </Button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Coupon;
