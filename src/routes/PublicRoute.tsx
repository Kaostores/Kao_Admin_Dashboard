import HomeLayout from "@/components/layouts/HomeLayout";
import SignIn from "@/pages/AdminSignUp/SignIn";
import SignUp from "@/pages/AdminSignUp/SignUp";
import Home from "@/pages/Home";

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
