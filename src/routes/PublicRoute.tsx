import HomeLayout from "@/components/layouts/HomeLayout";
import SignUp from "@/pages/AdminSignUp/SignUp";
import Home from "@/pages/Home";

const PublicRoute = () => {
	return [
		{
			path: "/",
			element: <HomeLayout />,
			children: [
				{
					index: true,
					element: <Home />,
				},
			],
		},

		{
			path: "signup",
			element: <SignUp />,
		},
	];
};

export default PublicRoute
