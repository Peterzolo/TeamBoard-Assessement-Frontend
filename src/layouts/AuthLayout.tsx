import { type ReactNode } from "react";

type AuthLayoutProps = {
	children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div
			className="min-h-dvh bg-cover bg-center"
			style={{ backgroundImage: "url(/images/authbg.jpg)" }}
		>
			<div className="min-h-dvh bg-black/30">
				<div className="mx-auto max-w-md px-4 py-8 min-h-dvh grid place-items-center">
					{children}
				</div>
			</div>
		</div>
	);
}

