import { Provider } from "react-redux";
import "./App.css";
import useLocalStorage from "./helpers";
import { store } from "./services/store";
import SignIn from "./pages/AdminSignUp/SignIn";
import SignUp from "./pages/AdminSignUp/SignUp";

function App() {
	const [count, setCount] = useLocalStorage<number>("count", 0);

	return (
		<div>
			<Provider store={store}>
				<SignIn/>
			</Provider>
		</div>
	);
}

export default App;
