import AuthGuard from "../../../Components/auth/AuthGuard";

export default function HomeScreen() {
	return (
		<AuthGuard>
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Welcome
				</h1>
				<p className="mt-2 text-gray-600">
					This is a scalable starter with routing and lazy-loading.
				</p>
			</div>
		</AuthGuard>
	);
}
