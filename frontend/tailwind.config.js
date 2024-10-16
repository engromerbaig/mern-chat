/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
	  extend: {
		colors: {
		  sky: {
			500: '#1E3A5F',  // Update the sky-500 color to your custom hex value
		  },
		},
	  },
	},
	// eslint-disable-next-line no-undef
	plugins: [require("daisyui")],
  };
  