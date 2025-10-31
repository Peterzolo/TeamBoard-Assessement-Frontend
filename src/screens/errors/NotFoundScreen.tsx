import { Link } from "react-router-dom";

export default function NotFoundScreen() {
	return (
		<section className="mx-auto max-w-6xl px-4 py-16 text-center">
			<h1 className="text-4xl font-bold text-gray-900">404</h1>
			<p className="mt-2 text-gray-600">Page not found.</p>
			<p className="mt-6">
				<Link to="/" className="text-sky-600 hover:underline">Go home</Link>
			</p>
		</section>
	);
}

