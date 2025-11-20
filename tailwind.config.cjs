/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0f172a', // Slate 900
                brand: {
                    green: '#3b646a',
                    yellow: '#faca4f',
                    orange: '#F27b21',
                    'light-olive': '#Cbb686',
                    olive: '#6f7750',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
