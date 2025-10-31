/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			keyframes: {
				shimmer: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
			},
			animation: {
				shimmer: 'shimmer 2s infinite',
			},
		},
	},
	plugins: [
		function({ addUtilities }) {
			const newUtilities = {
				'.scrollbar-thin': {
					scrollbarWidth: 'thin',
					scrollbarColor: '#888 #f1f1f1',
				},
				'.scrollbar-thin::-webkit-scrollbar': {
					height: '10px',
					width: '10px',
				},
				'.scrollbar-thin::-webkit-scrollbar-track': {
					background: '#f1f1f1',
					borderRadius: '5px',
				},
				'.scrollbar-thin::-webkit-scrollbar-thumb': {
					background: '#888',
					borderRadius: '5px',
				},
				'.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
					background: '#555',
				},
			}
			addUtilities(newUtilities)
		},
	],
}

