import HomeLayout from "@/components/layouts/HomeLayout";
import SignIn from "@/pages/AdminSignUp/SignIn";
import Home from "@/pages/Home";
import Agents from "@/pages/Agents/AgentEmplyee";
import Wallet from "@/pages/AdminWallet/Wallet";
import Complain from "@/pages/ComplainPage/Complain";
import Store from "@/pages/StoresSection/Stores";
import Order from "@/pages/Orders/OrderSection";
import Customers from "@/pages/Customer/Customers";
import Create from "@/pages/Categories/Create";
import CategoryList from "@/pages/Categories/CategoryList";
import CategoriesandSubs from "@/pages/Categories/CategoriesandSubs";
import Sub_categoryList from "@/pages/Categories/Sub_categoryList";
import Coupon from "@/pages/Coupon/Coupon";
import CouponList from "@/pages/Coupon/CouponList";
import Brand from "@/pages/Brand/Brand";
import BrandList from "@/pages/Brand/BrandList";
import Settings from "@/pages/Settings/Settings";
import AddSpotlight from "@/pages/Spotlight/AddSpotlight";
import Spotlightbystore from "@/pages/Spotlight/Spotlightbystore";
import Vendor from "@/pages/Vendor/Vendor";
import AllStores from "@/pages/AllStores/AllStores";
import Allspotlights from "@/pages/Spotlight/Allspotlights";
import VendorsEmployee from "@/pages/Vendors/VendorsEmployee";
import CustomerDetails from "@/pages/Customer/Customer_details";

const PublicRoute = () => {
	return [
		{
			path: "/app/admin",
			element: <HomeLayout />,
			children: [
				{
					index: true,
					element: <Home />,
				},
				{
					path: "agents",
					element: <Agents />,
				},
				{
					path: "vendors",
					element: <VendorsEmployee />
				},
				{
					path: "wallet",
					element: <Wallet />,
				},
				{
					path: "complaints",
					element: <Complain />,
				},
				{
					path: "stores",
					element: <Store />,
				},
				{
					path: "orders",
					element: <Order />,
				},
				{
					path: "customers",
					element: <Customers />,
				},
				{
					path: "create-categories",
					element: <Create />
				},
				{
					path: "category-lists",
					element: <CategoryList />
				},
				{
					path: "categories&sub-categories",
					element: <CategoriesandSubs />
				},
				{
					path: "sub_category_lists",
					element: <Sub_categoryList />
				},
				{
					path: "coupon",
					element: <Coupon />
				},
				{
					path: "coupon-list",
					element: <CouponList />
				},
				{
					path: "brand",
					element: <Brand />
				},
				{
					path: "brand-list",
					element: <BrandList />
				},
				{
					path: "settings",
					element: <Settings />
				},
				{
					path: "add-spotlight",
					element: <AddSpotlight />
				},
				{
					path: "spotlight-by-store",
					element: <Spotlightbystore />
				},
				{
					path: "vendor",
					element: <Vendor />
				},
				{
					path: "allStores",
					element: <AllStores />
				},
				{
					path: "allspotlight",
					element: <Allspotlights />
				},
				{
					path: "customer/:id",
					element: <CustomerDetails />
				}
			],
		},

		{
			path: "/",
			element: <SignIn />,
		},
	];
};

export default PublicRoute
