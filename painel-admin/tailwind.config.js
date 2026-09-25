/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tinta: "#2b1e17",
        textoSuave: "#6e5c4e",
        caramelo: "#c4622d",
        carameloForte: "#9c4a1f",
        dourado: "#d4a24c",
        creme: "#fdf8f3",
        areia: "#f4e8d8",
        borda: "#e8ddd1",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        corpo: ['"DM Sans"', "system-ui", "sans-serif"],
        // Números e micro-rótulos: grotesca técnica (Manrope) passa precisão
        // de ferramenta profissional; serifada fica nos títulos de marca.
        numero: ["Manrope", '"DM Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        Cartao: "0 18px 45px -18px rgba(43, 30, 23, 0.28)",
      },
    },
  },
  plugins: [],
};
