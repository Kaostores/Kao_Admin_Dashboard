import { Provider } from "react-redux";
import "./App.css";
import useLocalStorage from "./helpers";
import { store } from "./services/store";

function App() {
	const [count, setCount] = useLocalStorage<number>("count", 0);

	return (
		<div>
			<Provider store={store}>
				<div>Welcome to Kao Store Ecomerce</div>
			</Provider>
		</div>
	);
}

export default App;
