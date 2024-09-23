import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://kaostores.onrender.com/api/v1",
    prepareHeaders: (headers) => {
      const token = cookies.get("Kao_cookie_admin");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        console.warn("No token found in cookies.");
      }
    }
  }),
  tagTypes: ["category", "subcategory", "stores", "complaints", "metrics", "vendors", "agents"],
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (formData) => ({
        url: "/admin/category/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["category"]
    }),
    createSubcategory: builder.mutation({
      query: (formData) => ({
        url: "/admin/subcategory/create",
        method: "POST",
        body: {
          name: formData.name,
          categoryId: formData.categoryId,
          tags: formData.tags,
        },
      }),
      invalidatesTags: ["subcategory"]
    }),
    viewAllStores: builder.query({
      query: () => `stores`,
      providesTags: ["stores"],
    }),
    approveStore: builder.mutation({
      query: (storeUuid) => ({
        url: `stores/approve/${storeUuid}`,
        method: "POST",
      }),
      invalidatesTags: ["stores"],
    }),

    addReplyToComplaint: builder.mutation({
      query: (body) => ({
        url: `/complains/add/reply/${body.complainID}`,
        method: "POST",
        body: body
      }),
      invalidatesTags: ["complaints"]
    }),
    SuspendStore: builder.mutation({
			query: (body) => ({
				url: `/stores/suspend/${body.store_uuid}`,
				method: "POST",
				body: body,
			}),
			invalidatesTags: ["stores"],
    }),
    getSubcategories: builder.query({
      query: (categoryId) => `categories/subcategories/${categoryId}`,
      providesTags: ["subcategory"]
    }),
    getMetrics: builder.query({
      query: ({ userId }) => 
        `/analytics/admin/metrics?timeline=last_week&store&userId=${userId}`,
      providesTags: ["metrics"]
    }),

    deleteVendorById: builder.mutation({
      query: (vendorId) => ({
        url: `/user/delete/account/${vendorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["vendors"],  
    }),

    getUsersByType: builder.query({
      query: (type) => ({
        url: `/users?type=${type}`,
        method: "GET",
      }),
      providesTags: ["vendors"],
    }),
    getUserAddress: builder.query({
      query: (addressUuid) => ({
        url: `/user/address/${addressUuid}`,
        method: "GET",
      }),
    }),
      updateAgent: builder.mutation({
      query: ({ user_uuid, data }) => ({
        url: `/user/update/${user_uuid}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["agents"],
    }),
    createVendorAccount: builder.mutation({
      query: (vendorData) => ({
        url: `/user/create/account`,
        method: "POST",
        body: vendorData,
      }),
      invalidatesTags: ["vendors"],
    }),
     getStoreById: builder.query<any, string>({
      query: (storeUuid) => `/stores/${storeUuid}`, 
    }),

    
    updateStore: builder.mutation({
      query: (storeData) => {
        const formData = new FormData();
        formData.append('name', storeData.name);
        formData.append('email', storeData.email);
        formData.append('phone', storeData.phone);
        formData.append('address', storeData.address);
        formData.append('category', storeData.category);
        formData.append('cac_number', storeData.cac_number);
        if (storeData.cac_document) formData.append('cac_document', storeData.cac_document);
        if (storeData.kyc_document) formData.append('kyc_document', storeData.kyc_document);
        if (storeData.business_document) formData.append('business_document', storeData.business_document);
        if (storeData.utility_bill) formData.append('utility_bill', storeData.utility_bill);

        return {
          url: `/store/update/${storeData.id}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    
     }),
});

export const {
  useCreateCategoryMutation,
  useCreateSubcategoryMutation,
  useViewAllStoresQuery,
  useApproveStoreMutation,
  useSuspendStoreMutation,
  useAddReplyToComplaintMutation,
  useGetSubcategoriesQuery,
  useGetMetricsQuery,
  useDeleteVendorByIdMutation,
  useGetUsersByTypeQuery,  
  useGetUserAddressQuery,
  useUpdateAgentMutation,
  useCreateVendorAccountMutation,
  useGetStoreByIdQuery,
  useUpdateStoreMutation,
} = api;
