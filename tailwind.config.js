/** @type {import('tailwindcss').Config} */

module.exports = {
    purge: ["./**/*.html"],
    content: ["./src/**/*.{html,js}"],
    theme: {
        fontFamily: {
            display: ["Segou UI", "font-sans"],
            body: ["Segou UI"],
        },
        extend: {},
    },
    plugins: [require("@tailwindcss/forms")],
};
