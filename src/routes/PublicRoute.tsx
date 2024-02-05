import HomeLayout from "@/components/layouts/HomeLayout";
import SignIn from "@/pages/AdminSignUp/SignIn";
import SignUp from "@/pages/AdminSignUp/SignUp";
import Home from "@/pages/Home";
import Agents from "@/pages/Agents/AgentEmplyee";
import Wallet from "@/pages/AdminWallet/Wallet";
import Complain from "@/pages/ComplainPage/Complain";
import Store from "@/pages/StoresSection/Stores";
import Order from "@/pages/Orders/OrderSection";
import Customers from "@/pages/Customer/Customers";

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
			],
		},

		{
			path: "/",
			element: <SignUp />,
		},
		{
			path: "signin",
			element: <SignIn />,
		},
	];
};

export default PublicRoute
