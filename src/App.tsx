import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import AppProvider from "./app/providers/AppProvider";

export default function App() {
	return (
		<AppProvider>
			<RouterProvider router={router} />
		</AppProvider>
	);
}
