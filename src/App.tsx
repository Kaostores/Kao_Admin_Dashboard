import { Provider } from "react-redux";
import "./App.css";
import { store } from "./services/store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PublicRoute from "./routes/PublicRoute";
import { ProfileImageProvider } from "@/pages/Settings/ProfileImageContext"; // Import your ProfileImageProvider

function App() {
	return (
		<div>
			<ToastContainer />
			<Provider store={store}>
				<ProfileImageProvider> {/* Wrap your app in ProfileImageProvider */}
					<RouterProvider router={createBrowserRouter([...PublicRoute()])} />
				</ProfileImageProvider>
			</Provider>
		</div>
	);
}

export default App;
