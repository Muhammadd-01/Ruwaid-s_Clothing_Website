/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#D4AF37",
                    dark: "#B8962E",
                    light: "#E5C76B",
                    foreground: "#000000",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                dark: {
                    DEFAULT: "#0A0A0A",
                    100: "#1A1A1A",
                    200: "#2A2A2A",
                    300: "#3A3A3A",
                    400: "#4A4A4A",
                },
                gold: {
                    DEFAULT: "#D4AF37",
                    50: "#FBF7E9",
                    100: "#F5EBD0",
                    200: "#EDD9A0",
                    300: "#E5C76B",
                    400: "#D4AF37",
                    500: "#B8962E",
                    600: "#9A7D26",
                    700: "#7C651E",
                    800: "#5E4C16",
                    900: "#40340E",
                },
                gray: {
                    DEFAULT: "#6B7280",
                    50: "#F9FAFB",
                    100: "#F3F4F6",
                    200: "#E5E7EB",
                    300: "#D1D5DB",
                    400: "#9CA3AF",
                    500: "#6B7280",
                    600: "#4B5563",
                    700: "#374151",
                    800: "#1F2937",
                    900: "#111827",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Playfair Display", "Georgia", "serif"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
                shimmer: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
                fadeIn: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: 0 },
                    "100%": { transform: "translateY(0)", opacity: 1 },
                },
                slideDown: {
                    "0%": { transform: "translateY(-20px)", opacity: 0 },
                    "100%": { transform: "translateY(0)", opacity: 1 },
                },
                scaleIn: {
                    "0%": { transform: "scale(0.95)", opacity: 0 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                shimmer: "shimmer 2s infinite",
                fadeIn: "fadeIn 0.5s ease-out",
                slideUp: "slideUp 0.5s ease-out",
                slideDown: "slideDown 0.5s ease-out",
                scaleIn: "scaleIn 0.3s ease-out",
                float: "float 3s ease-in-out infinite",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
                "dark-gradient": "linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
