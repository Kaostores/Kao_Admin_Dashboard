import { Provider } from "react-redux";
import "./App.css";
// import useLocalStorage from "./helpers";
import { store } from "./services/store";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PublicRoute from "./routes/PublicRoute";

function App() {
	// const [count, setCount] = useLocalStorage<number>("count", 0);

	return (
		<div>
			<ToastContainer />
			<Provider store={store}>
				<RouterProvider router={createBrowserRouter([...PublicRoute()])} />
			</Provider>
		</div>
	); 
}

export default App;
